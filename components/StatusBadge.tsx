// Badge semântico de disponibilidade (design system §2: verde para
// "disponível", âmbar para "descontinuado" — dessaturados, uso pontual,
// nunca decorativo). Roadmap #21: a página de um item arquivado permanece
// live; este badge é o que informa o leitor de que o dado é histórico.
export function DiscontinuedBadge() {
  return (
    <span className="inline-flex items-center gap-2 rounded-md border border-warn/35 bg-warn/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-warn">
      <span aria-hidden className="h-1 w-1 rounded-full bg-warn" />
      Discontinued
    </span>
  );
}

// Nota exibida no lugar do bloco "Where to buy" quando o item está
// arquivado. Sem link de afiliado: o produto não está mais à venda, então
// não existe caminho de compra honesto a oferecer.
export function DiscontinuedNotice({ kind }: { kind: "product" | "software" }) {
  return (
    <section className="max-w-2xl rounded-lg border border-warn/25 bg-warn/[0.06] p-5">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-warn">
        No longer available
      </p>
      <p className="mt-2 leading-relaxed text-dim">
        {kind === "product"
          ? "This product has been discontinued and is no longer sold through the retailers we track. The specifications and score below are kept as a historical record — they are not updated, and the figures reflect the product as it was last verified."
          : "This software has been discontinued and is no longer available. The evaluation below is kept as a historical record and is no longer updated."}
      </p>
    </section>
  );
}
