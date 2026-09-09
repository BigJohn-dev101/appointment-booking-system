-- =========================================================
-- AppointHub Database Schema
-- PostgreSQL 18+
--
-- Core principles:
-- - Users are authentication identities
-- - Businesses are tenant boundaries
-- - Memberships define business-level access
-- - Provider profiles are bookable identities
-- - Tenant relationships are enforced by PostgreSQL
-- - Confirmed appointments cannot overlap for a provider
-- =========================================================


-- Required for GiST equality support on UUID values
-- used by the appointment exclusion constraint.
CREATE EXTENSION IF NOT EXISTS btree_gist;


-- =========================================================
-- 1. USERS
-- =========================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    email VARCHAR(255) NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(150) NOT NULL,

    is_platform_admin BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Emails are unique regardless of case.
-- Example:
-- user@example.com and USER@example.com cannot both exist.
CREATE UNIQUE INDEX users_email_unique
    ON users (LOWER(email));


-- =========================================================
-- 2. BUSINESSES
-- =========================================================

CREATE TABLE businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(150) NOT NULL,
    description TEXT,

    timezone VARCHAR(64) NOT NULL
        DEFAULT 'Africa/Johannesburg',

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- =========================================================
-- 3. BUSINESS MEMBERSHIPS
-- =========================================================

CREATE TABLE business_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    business_id UUID NOT NULL,

    user_id UUID NOT NULL,

    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    is_provider BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_membership_business
        FOREIGN KEY (business_id)
        REFERENCES businesses(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_membership_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    -- A user can only have one membership in a given business.
    CONSTRAINT uq_membership_business_user
        UNIQUE (business_id, user_id),

    -- Needed so provider_profiles can enforce that its
    -- membership belongs to the same business.
    CONSTRAINT uq_membership_id_business
        UNIQUE (id, business_id),

    -- A membership must currently represent at least one
    -- business capability.
    CONSTRAINT chk_membership_role
        CHECK (is_admin = TRUE OR is_provider = TRUE)
);


-- =========================================================
-- 4. PROVIDER PROFILES
-- =========================================================

CREATE TABLE provider_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    membership_id UUID NOT NULL,
    business_id UUID NOT NULL,

    display_name VARCHAR(150) NOT NULL,
    bio TEXT,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- One membership can have at most one provider profile.
    CONSTRAINT uq_provider_membership
        UNIQUE (membership_id),

    -- Ensures the membership and provider profile
    -- belong to the SAME business.
    CONSTRAINT fk_provider_membership_business
        FOREIGN KEY (membership_id, business_id)
        REFERENCES business_memberships(id, business_id)
        ON DELETE CASCADE,

    -- Allows other tables to reference a provider together
    -- with its business and enforce tenant consistency.
    CONSTRAINT uq_provider_id_business
        UNIQUE (id, business_id)
);


-- =========================================================
-- 5. SERVICES
-- =========================================================

CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    business_id UUID NOT NULL,

    name VARCHAR(150) NOT NULL,
    description TEXT,

    duration_minutes INTEGER NOT NULL,

    price NUMERIC(10, 2),

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_service_business
        FOREIGN KEY (business_id)
        REFERENCES businesses(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_service_duration
        CHECK (duration_minutes > 0),

    CONSTRAINT chk_service_price
        CHECK (price IS NULL OR price >= 0),

    -- Allows tenant-safe composite references.
    CONSTRAINT uq_service_id_business
        UNIQUE (id, business_id)
);


-- =========================================================
-- 6. PROVIDER SERVICES
-- =========================================================

CREATE TABLE provider_services (
    provider_id UUID NOT NULL,
    service_id UUID NOT NULL,
    business_id UUID NOT NULL,

    CONSTRAINT pk_provider_services
        PRIMARY KEY (provider_id, service_id),

    -- Provider must belong to this business.
    CONSTRAINT fk_provider_service_provider
        FOREIGN KEY (provider_id, business_id)
        REFERENCES provider_profiles(id, business_id)
        ON DELETE CASCADE,

    -- Service must belong to this same business.
    CONSTRAINT fk_provider_service_service
        FOREIGN KEY (service_id, business_id)
        REFERENCES services(id, business_id)
        ON DELETE CASCADE
);


-- =========================================================
-- 7. WORKING HOURS
-- =========================================================

CREATE TABLE working_hours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    provider_id UUID NOT NULL,

    -- 0 = Sunday
    -- 1 = Monday
    -- ...
    -- 6 = Saturday
    weekday SMALLINT NOT NULL,

    start_time TIME NOT NULL,
    end_time TIME NOT NULL,

    CONSTRAINT fk_working_hours_provider
        FOREIGN KEY (provider_id)
        REFERENCES provider_profiles(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_working_hours_weekday
        CHECK (weekday BETWEEN 0 AND 6),

    CONSTRAINT chk_working_hours_time
        CHECK (end_time > start_time),

    -- Prevent exact duplicate schedule entries.
    CONSTRAINT uq_working_hours
        UNIQUE (
            provider_id,
            weekday,
            start_time,
            end_time
        )
);


-- =========================================================
-- 8. BLOCKED TIMES
-- =========================================================

CREATE TABLE blocked_times (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    provider_id UUID NOT NULL,

    start_at TIMESTAMPTZ NOT NULL,
    end_at TIMESTAMPTZ NOT NULL,

    reason VARCHAR(200),

    CONSTRAINT fk_blocked_time_provider
        FOREIGN KEY (provider_id)
        REFERENCES provider_profiles(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_blocked_time_range
        CHECK (end_at > start_at)
);


-- =========================================================
-- 9. APPOINTMENTS
-- =========================================================

CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    business_id UUID NOT NULL,
    customer_user_id UUID NOT NULL,
    provider_id UUID NOT NULL,
    service_id UUID NOT NULL,

    start_at TIMESTAMPTZ NOT NULL,
    end_at TIMESTAMPTZ NOT NULL,

    status VARCHAR(20) NOT NULL
        DEFAULT 'confirmed',

    no_show BOOLEAN NOT NULL DEFAULT FALSE,

    -- Snapshot of the price at the time of booking.
    price_at_booking NUMERIC(10, 2),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Preserve appointment history.
    CONSTRAINT fk_appointment_business
        FOREIGN KEY (business_id)
        REFERENCES businesses(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_appointment_customer
        FOREIGN KEY (customer_user_id)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    -- Provider must belong to the appointment's business.
    CONSTRAINT fk_appointment_provider_business
        FOREIGN KEY (provider_id, business_id)
        REFERENCES provider_profiles(id, business_id)
        ON DELETE RESTRICT,

    -- Service must belong to the appointment's business.
    CONSTRAINT fk_appointment_service_business
        FOREIGN KEY (service_id, business_id)
        REFERENCES services(id, business_id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_appointment_time
        CHECK (end_at > start_at),

    CONSTRAINT chk_appointment_status
        CHECK (
            status IN (
                'confirmed',
                'cancelled',
                'completed'
            )
        ),

    CONSTRAINT chk_appointment_price
        CHECK (
            price_at_booking IS NULL
            OR price_at_booking >= 0
        ),

    -- Prevent two confirmed appointments from occupying
    -- overlapping time for the same provider.
    --
    -- [start_at, end_at) means:
    -- 09:00-10:00 and 10:00-11:00 do NOT overlap.
    CONSTRAINT no_overlapping_confirmed_appointments
        EXCLUDE USING gist (
            provider_id WITH =,
            tstzrange(start_at, end_at, '[)') WITH &&
        )
        WHERE (status = 'confirmed')
);


-- =========================================================
-- INDEXES
-- =========================================================

-- Customer appointment history.
CREATE INDEX idx_appointments_customer
    ON appointments (customer_user_id);

-- Business calendar / dashboard queries.
CREATE INDEX idx_appointments_business_start
    ON appointments (business_id, start_at);

-- Provider calendar queries.
CREATE INDEX idx_appointments_provider_start
    ON appointments (provider_id, start_at);

-- Membership authorization lookups.
CREATE INDEX idx_memberships_user
    ON business_memberships (user_id);

-- Provider availability lookups.
CREATE INDEX idx_working_hours_provider_weekday
    ON working_hours (provider_id, weekday);

CREATE INDEX idx_blocked_times_provider_start
    ON blocked_times (provider_id, start_at);

-- Service discovery by business.
CREATE INDEX idx_services_business
    ON services (business_id);