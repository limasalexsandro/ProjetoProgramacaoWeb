// app/components/DashboardHeader.tsx
import Link from "next/link";
import LogoutButton from "@/app/dashboard/logout-button";

type DashboardHeaderProps = {
  nome: string;
  email: string;
};

export default function DashboardHeader({
  nome,
  email,
}: DashboardHeaderProps) {
  return (
    <header className="dashboard-header">
      <div>
        <Link href="/dashboard" className="dashboard-label">
           <span className="dashboard-label">PGA</span>
        </Link>
        <h1>Plataforma de Gerenciamento de Avaliações</h1>
      </div>

      <div className="dashboard-user">
        <div>
          <strong>{nome}</strong>
          <span>{email}</span>
        </div>

        <LogoutButton />
      </div>
    </header>
  );
}