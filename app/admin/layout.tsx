import { AdminNav } from "./AdminNav";

// Painel operacional (dashboard-spec §1): rota protegida no mesmo projeto,
// mobile-first — triagem rápida também pelo celular.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <AdminNav />
      {children}
    </div>
  );
}
