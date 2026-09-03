export type Service = {
  id: number;
  name: string;
  description: string;
  duration: number;
  price: number;
};

export type Provider = {
  id: number;
  name: string;
  category: string;
  description: string;
  hours: string;
  initials: string;
  status: "Open" | "Closed";
  services: Service[];
};

export const providers: Provider[] = [
  {
    id: 1,
    name: "Precision Barbers",
    category: "Barber & Grooming",
    description:
      "Professional barbering and grooming services for everyday cuts, beard maintenance, and complete grooming appointments.",
    hours: "09:00–17:00",
    initials: "PB",
    status: "Open",
    services: [
      {
        id: 1,
        name: "Standard Haircut",
        description: "Classic haircut and finishing.",
        duration: 45,
        price: 180,
      },
      {
        id: 2,
        name: "Haircut & Beard Trim",
        description: "Haircut combined with beard shaping and trimming.",
        duration: 60,
        price: 250,
      },
      {
        id: 3,
        name: "Beard Trim",
        description: "Beard trimming, shaping, and finishing.",
        duration: 30,
        price: 100,
      },
    ],
  },

  {
    id: 2,
    name: "Greenview Medical Practice",
    category: "General Practice",
    description:
      "General practice consultations and follow-up appointments. The platform is used for scheduling only and does not store medical records.",
    hours: "08:00–16:00",
    initials: "GM",
    status: "Open",
    services: [
      {
        id: 4,
        name: "General Consultation",
        description: "Standard appointment with a general practitioner.",
        duration: 30,
        price: 450,
      },
      {
        id: 5,
        name: "Follow-up Consultation",
        description: "Follow-up appointment after an initial consultation.",
        duration: 20,
        price: 300,
      },
    ],
  },

  {
    id: 3,
    name: "Nova Beauty Studio",
    category: "Beauty & Styling",
    description:
      "Beauty treatments and professional styling services available by appointment.",
    hours: "09:00–18:00",
    initials: "NB",
    status: "Open",
    services: [
      {
        id: 6,
        name: "Hair Styling",
        description: "Professional hair styling for everyday or special occasions.",
        duration: 60,
        price: 250,
      },
      {
        id: 7,
        name: "Facial Treatment",
        description: "Facial cleansing and skincare treatment.",
        duration: 45,
        price: 350,
      },
      {
        id: 8,
        name: "Makeup Session",
        description: "Professional makeup application.",
        duration: 60,
        price: 400,
      },
    ],
  },

  {
    id: 4,
    name: "Thabo Mobile Massage",
    category: "Massage Therapy",
    description:
      "Independent massage therapy services offering scheduled relaxation and deep tissue sessions.",
    hours: "08:00–17:00",
    initials: "TM",
    status: "Open",
    services: [
      {
        id: 9,
        name: "Swedish Massage",
        description: "Full-body relaxation massage.",
        duration: 60,
        price: 400,
      },
      {
        id: 10,
        name: "Deep Tissue Massage",
        description: "Focused massage using deeper pressure techniques.",
        duration: 60,
        price: 500,
      },
      {
        id: 11,
        name: "Express Massage",
        description: "Short massage session focused on selected areas.",
        duration: 30,
        price: 250,
      },
    ],
  },

  {
    id: 5,
    name: "Urban Nail Studio",
    category: "Beauty & Styling",
    description:
      "Professional manicure, pedicure, and nail styling appointments.",
    hours: "09:00–18:00",
    initials: "UN",
    status: "Open",
    services: [
      {
        id: 12,
        name: "Manicure",
        description: "Nail shaping, care, and polish application.",
        duration: 45,
        price: 180,
      },
      {
        id: 13,
        name: "Pedicure",
        description: "Foot and nail care with polish application.",
        duration: 60,
        price: 220,
      },
      {
        id: 14,
        name: "Gel Nails",
        description: "Gel nail preparation and application.",
        duration: 75,
        price: 300,
      },
    ],
  },

  {
    id: 6,
    name: "Peak Physio",
    category: "Physiotherapy",
    description:
      "Physiotherapy consultations and scheduled rehabilitation sessions.",
    hours: "08:00–17:00",
    initials: "PP",
    status: "Closed",
    services: [
      {
        id: 15,
        name: "Initial Assessment",
        description:
          "Initial physiotherapy consultation and physical assessment.",
        duration: 60,
        price: 600,
      },
      {
        id: 16,
        name: "Follow-up Session",
        description: "Follow-up physiotherapy and rehabilitation session.",
        duration: 45,
        price: 450,
      },
    ],
  },
];