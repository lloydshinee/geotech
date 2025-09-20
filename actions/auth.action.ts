"use server";

import { signIn } from "@/auth";
import { LoginFormData } from "@/components/login-form";

export async function login(data: LoginFormData) {
  try {
    await signIn("credentials", { redirect: false, ...data });
  } catch (error) {
    throw new Error("Login failed");
  }
}
