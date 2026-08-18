// Fonte única do gate editorial.
//
// Antes, a mesma regra vivia em três lugares que discordavam entre si: a
// condição SQL da migration, o prompt do agente Gatekeeper e o julgamento
// implícito de quem usava o /admin/review. Foi essa dispersão que permitiu a
// um script publicar 70 itens que nenhuma das três versões teria aprovado.
//
// Aqui a regra é código, testada, e o resto do sistema aponta para ela.

export type GateSubject = {
  status?: string | null;
  editorial_notes?: string | null;
  pros?: string[] | null;
  cons?: string[] | null;
  ideal_for?: string[] | null;
  specs?: Record<string, unknown> | null;
};

export type GateResult = {
  pass: boolean;
  failures: string[];
};

// Mínimo de caracteres para uma nota contar como avaliação. Abaixo disso é
// legenda: o acervo inteiro já esteve com média de 98.
export const MIN_EDITORIAL_LENGTH = 200;

// Campos estruturados somados (specs + pros + cons + ideal_for) exigidos para
// a página sustentar a promessa de "números antes de adjetivos".
export const MIN_STRUCTURED_FIELDS = 5;

const len = (a: unknown[] | null | undefined) => (Array.isArray(a) ? a.length : 0);

export function countStructuredFields(item: GateSubject): number {
  const specCount = item.specs ? Object.keys(item.specs).length : 0;
  return specCount + len(item.pros) + len(item.cons) + len(item.ideal_for);
}

/**
 * Avalia um item contra o gate editorial.
 *
 * Um item só é indexável quando a página que ele gera vale a visita. As três
 * primeiras regras são as que o acervo violava em massa; a quarta é a que
 * separa análise de marketing.
 */
export function evaluateQualityGate(item: GateSubject): GateResult {
  const failures: string[] = [];

  if ((item.editorial_notes?.trim().length ?? 0) < MIN_EDITORIAL_LENGTH) {
    failures.push(
      `Editorial note is shorter than ${MIN_EDITORIAL_LENGTH} characters — that is a caption, not an assessment.`
    );
  }

  // Sem contras não é análise. Todo produto tem um lado ruim; uma página que
  // não o nomeia está vendendo, não avaliando.
  if (len(item.cons) < 1) {
    failures.push('No cons listed. Every product has a downside; a review without one is marketing.');
  }

  if (len(item.ideal_for) < 1) {
    failures.push('No stated audience. "Who is this wrong for" is the question the page exists to answer.');
  }

  const structured = countStructuredFields(item);
  if (structured < MIN_STRUCTURED_FIELDS) {
    failures.push(
      `Only ${structured} structured fields across specs, pros, cons and ideal_for — ${MIN_STRUCTURED_FIELDS} required.`
    );
  }

  return { pass: failures.length === 0, failures };
}

/**
 * Normaliza um título para detecção de duplicata.
 *
 * Os scripts de seed criaram oito pares do mesmo produto a partir de fontes
 * diferentes — "Nvidia GeForce RTX 5090 (32GB)" e "GeForce RTX 5090", uma
 * linha com o preço e a outra com a nota. Comparar slug não pega isso;
 * comparar o título normalizado pega.
 */
export function normaliseTitle(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '');
}

export function findDuplicateTitles(items: { slug: string; title: string }[]): {
  key: string;
  slugs: string[];
}[] {
  const groups = new Map<string, string[]>();
  for (const item of items) {
    const key = normaliseTitle(item.title);
    const bucket = groups.get(key);
    if (bucket) bucket.push(item.slug);
    else groups.set(key, [item.slug]);
  }
  return [...groups.entries()]
    .filter(([, slugs]) => slugs.length > 1)
    .map(([key, slugs]) => ({ key, slugs }));
}
