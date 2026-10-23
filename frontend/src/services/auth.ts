import { apiFetch } from "./api";
import type { AuthUser } from "../context/AuthContext";

export function verifyEmailOtp(email: string, code: string) {
	return apiFetch<{ success: boolean; message: string; user: AuthUser }>(
		"/auth/verify-otp",
		{
			method: "POST",
			body: JSON.stringify({ email, code }),
		},
	);
}

export function resendEmailOtp(email: string) {
	return apiFetch<{ success: boolean; message: string }>("/auth/resend-otp", {
		method: "POST",
		body: JSON.stringify({ email }),
	});
}

export function getVerificationEmail(error: unknown): string | null {
	const data = (error as { data?: { code?: string; email?: string } } | null)
		?.data;

	return data?.code === "EMAIL_NOT_VERIFIED" && data.email ? data.email : null;
}
