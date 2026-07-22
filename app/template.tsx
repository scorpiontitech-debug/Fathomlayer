// Remonta a cada navegação — transição de rota leve, CSS puro.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
