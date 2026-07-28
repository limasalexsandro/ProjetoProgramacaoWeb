"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);

  async function realizarLogout() {
    setCarregando(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Não foi possível realizar o logout.");
      }

      router.push("/");
      router.refresh();
    } catch {
      alert("Não foi possível sair da plataforma.");
      setCarregando(false);
    }
  }

  return (
    <button
      type="button"
      className="logout-button"
      onClick={realizarLogout}
      disabled={carregando}
    >
      {carregando ? "Saindo..." : "Sair"}
    </button>
  );
}