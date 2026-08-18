import { describe, it, expect } from 'vitest';
import {
  PILLARS,
  PILLAR_KEYS,
  matchesPillar,
  pillarBySlug,
  pillarByKey,
} from '../lib/taxonomy';

// A taxonomia decide a URL de todo item do catálogo. Um erro aqui não quebra o
// build — produz 404 em silêncio, que foi o que aconteceu com /trending
// apontando para /hardware/gpu/{slug}, uma rota que nunca existiu.

describe('PILLARS', () => {
  it('o slug de ecosystem_mobility encurta para "ecosystem" na URL', () => {
    expect(PILLARS.ecosystem_mobility.slug).toBe('ecosystem');
  });

  it('todo pilar tem slug, nome e tagline', () => {
    for (const key of PILLAR_KEYS) {
      const pillar = PILLARS[key];
      expect(pillar.slug).toBeTruthy();
      expect(pillar.name).toBeTruthy();
      expect(pillar.tagline).toBeTruthy();
    }
  });

  it('os slugs são únicos entre si', () => {
    const slugs = PILLAR_KEYS.map((k) => PILLARS[k].slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe('pillarBySlug', () => {
  it('resolve o slug encurtado de volta para a chave do banco', () => {
    expect(pillarBySlug('ecosystem')?.key).toBe('ecosystem_mobility');
  });

  it('resolve os pilares cujo slug é igual à chave', () => {
    expect(pillarBySlug('compute')?.key).toBe('compute');
    expect(pillarBySlug('intelligence')?.key).toBe('intelligence');
  });

  // Se isto voltar um pilar, a URL do banco vaza para o site.
  it('não resolve a chave crua do banco como se fosse slug', () => {
    expect(pillarBySlug('ecosystem_mobility')).toBeNull();
  });

  it('devolve null para slug desconhecido', () => {
    expect(pillarBySlug('hardware')).toBeNull();
    expect(pillarBySlug('')).toBeNull();
  });
});

describe('pillarByKey', () => {
  it('resolve as três chaves do banco', () => {
    for (const key of PILLAR_KEYS) {
      expect(pillarByKey(key)?.key).toBe(key);
    }
  });

  it('devolve null para chave inexistente', () => {
    expect(pillarByKey('mobility')).toBeNull();
  });
});

describe('matchesPillar', () => {
  it('casa por interseção de tags', () => {
    expect(matchesPillar(['llm', 'privacy'], 'intelligence')).toBe(true);
    expect(matchesPillar(['laptops'], 'compute')).toBe(true);
    expect(matchesPillar(['ev'], 'ecosystem_mobility')).toBe(true);
  });

  // A sobreposição é intencional: local-ai é legítimo nos dois pilares.
  it('permite que local-ai pertença a intelligence e a compute', () => {
    expect(matchesPillar(['local-ai'], 'intelligence')).toBe(true);
    expect(matchesPillar(['local-ai'], 'compute')).toBe(true);
  });

  it('não casa quando não há tag em comum', () => {
    expect(matchesPillar(['ev'], 'compute')).toBe(false);
    expect(matchesPillar([], 'intelligence')).toBe(false);
  });

  // Item sem tag foi o estado de 58 dos 70 produtos publicados, e fazia o
  // casamento por pilar falhar em silêncio.
  it('item sem tags não pertence a pilar nenhum', () => {
    for (const key of PILLAR_KEYS) {
      expect(matchesPillar([], key)).toBe(false);
    }
  });
});
