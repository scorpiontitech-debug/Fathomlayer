import { describe, it, expect } from 'vitest';
import {
  evaluateQualityGate,
  countStructuredFields,
  normaliseTitle,
  findDuplicateTitles,
  MIN_EDITORIAL_LENGTH,
} from '../lib/quality-gate';

// Cada teste aqui corresponde a uma falha que já aconteceu em produção.
// Não são casos hipotéticos — são regressões.

const goodNote = 'x'.repeat(MIN_EDITORIAL_LENGTH + 40);

const passingItem = {
  status: 'published',
  editorial_notes: goodNote,
  pros: ['a', 'b'],
  cons: ['c'],
  ideal_for: ['d'],
  specs: { memory: '16GB', bus: '256-bit' },
};

describe('evaluateQualityGate', () => {
  it('aprova um item completo', () => {
    const result = evaluateQualityGate(passingItem);
    expect(result.pass).toBe(true);
    expect(result.failures).toEqual([]);
  });

  // O acervo chegou a ter média de 98 caracteres de nota editorial.
  it('reprova nota editorial curta demais para ser avaliação', () => {
    const result = evaluateQualityGate({
      ...passingItem,
      editorial_notes: 'Aprovado por Fathom AI (Forced Ingestion)',
    });
    expect(result.pass).toBe(false);
    expect(result.failures.some((f) => f.includes('caption'))).toBe(true);
  });

  it('reprova nota ausente', () => {
    const result = evaluateQualityGate({ ...passingItem, editorial_notes: null });
    expect(result.pass).toBe(false);
  });

  it('não deixa espaço em branco passar por conteúdo', () => {
    const result = evaluateQualityGate({
      ...passingItem,
      editorial_notes: ' '.repeat(MIN_EDITORIAL_LENGTH + 10),
    });
    expect(result.pass).toBe(false);
  });

  // Quinze produtos publicados não tinham nenhum contra listado.
  it('reprova item sem contras — sem contras é marketing', () => {
    const result = evaluateQualityGate({ ...passingItem, cons: [] });
    expect(result.pass).toBe(false);
    expect(result.failures.some((f) => f.includes('marketing'))).toBe(true);
  });

  it('reprova item sem público declarado', () => {
    const result = evaluateQualityGate({ ...passingItem, ideal_for: [] });
    expect(result.pass).toBe(false);
  });

  it('reprova quando faltam campos estruturados mesmo com nota longa', () => {
    const result = evaluateQualityGate({
      status: 'published',
      editorial_notes: goodNote,
      pros: ['a'],
      cons: ['b'],
      ideal_for: ['c'],
      specs: {},
    });
    expect(result.pass).toBe(false);
    expect(result.failures.some((f) => f.includes('structured fields'))).toBe(true);
  });

  it('acumula todas as falhas em vez de parar na primeira', () => {
    const result = evaluateQualityGate({
      status: 'published',
      editorial_notes: 'curta',
      pros: [],
      cons: [],
      ideal_for: [],
      specs: null,
    });
    expect(result.pass).toBe(false);
    expect(result.failures.length).toBeGreaterThanOrEqual(4);
  });

  it('trata campos nulos sem quebrar', () => {
    expect(() => evaluateQualityGate({})).not.toThrow();
    expect(evaluateQualityGate({}).pass).toBe(false);
  });
});

describe('countStructuredFields', () => {
  it('soma specs, pros, cons e ideal_for', () => {
    expect(
      countStructuredFields({
        specs: { a: 1, b: 2 },
        pros: ['x'],
        cons: ['y'],
        ideal_for: ['z'],
      })
    ).toBe(5);
  });

  it('devolve zero para um item vazio', () => {
    expect(countStructuredFields({})).toBe(0);
  });
});

describe('normaliseTitle', () => {
  // Este é exatamente o par que passou despercebido em produção.
  it('reconhece o mesmo produto sob grafias diferentes', () => {
    expect(normaliseTitle('Nvidia GeForce RTX 5090 (32GB)')).toBe(
      normaliseTitle('nvidia geforce rtx 5090 32gb')
    );
  });

  it('ignora acentos', () => {
    expect(normaliseTitle('Óculos AR')).toBe(normaliseTitle('Oculos AR'));
  });

  it('não colapsa produtos genuinamente diferentes', () => {
    expect(normaliseTitle('Oura Ring Gen 3')).not.toBe(normaliseTitle('Oura Ring Gen 4'));
    expect(normaliseTitle('RTX 5080')).not.toBe(normaliseTitle('RTX 5090'));
  });
});

describe('findDuplicateTitles', () => {
  it('encontra os pares que os scripts de seed criaram', () => {
    const dupes = findDuplicateTitles([
      { slug: 'nvidia-geforce-rtx-5090', title: 'Nvidia GeForce RTX 5090 (32GB)' },
      { slug: 'nvidia-geforce-rtx-5090-32gb', title: 'Nvidia GeForce RTX 5090 (32GB)' },
      { slug: 'oura-ring-gen-3', title: 'Oura Ring Gen 3' },
    ]);
    expect(dupes).toHaveLength(1);
    expect(dupes[0].slugs).toEqual([
      'nvidia-geforce-rtx-5090',
      'nvidia-geforce-rtx-5090-32gb',
    ]);
  });

  it('devolve lista vazia quando não há duplicata', () => {
    expect(
      findDuplicateTitles([
        { slug: 'a', title: 'Alpha' },
        { slug: 'b', title: 'Beta' },
      ])
    ).toEqual([]);
  });
});
