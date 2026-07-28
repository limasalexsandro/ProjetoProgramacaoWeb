import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verificarToken } from "@/lib/auth";
import LoginForm from "./login-form";

export default async function LoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (token) {
    const dadosToken = verificarToken(token);

    if (dadosToken) {
      redirect("/dashboard");
    }
  }

  return <LoginForm />;
}