/**
 * Prepara os assets do logo a partir do PNG oficial:
 *  - remove o fundo branco (torna transparente) para uso em dark mode
 *  - recorta o símbolo (camadas isométricas) isolado, para header/favicon
 *  - recorta o lockup completo (símbolo + wordmark) para OG/rodapé
 * Uso: node scripts/logo-assets.js
 */
const path = require("node:path");
const sharp = require(path.join(process.cwd(), "node_modules", "sharp"));

const SRC = path.join(process.cwd(), "Fathom Layer Logo.png");
const OUT = path.join(process.cwd(), "public");

// Pixels quase-brancos viram transparentes; o resto mantém alpha original.
async function stripWhite(buffer) {
  const { data, info } = await sharp(buffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += info.channels) {
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    const min = Math.min(r, g, b);
    const max = Math.max(r, g, b);
    // branco/cinza claro e pouco saturado -> transparente (com borda suave)
    if (min > 232 && max - min < 14) {
      data[i + 3] = 0;
    } else if (min > 205 && max - min < 22) {
      data[i + 3] = Math.round(((min - 205) / 27) * 0 + (1 - (min - 205) / 27) * data[i + 3]);
    }
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
    .png()
    .toBuffer();
}

(async () => {
  const meta = await sharp(SRC).metadata();
  console.log(`source: ${meta.width}x${meta.height} alpha=${meta.hasAlpha}`);

  const transparent = await stripWhite(await sharp(SRC).toBuffer());

  // Lockup completo, aparado no conteúdo real
  await sharp(transparent)
    .trim({ threshold: 1 })
    .resize({ width: 1200, withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT, "fathom-layer-lockup.png"));

  // Símbolo isolado: metade esquerda do lockup, depois aparado
  const trimmed = await sharp(transparent).trim({ threshold: 1 }).toBuffer();
  const tMeta = await sharp(trimmed).metadata();
  await sharp(trimmed)
    .extract({ left: 0, top: 0, width: Math.round(tMeta.width * 0.29), height: tMeta.height })
    .trim({ threshold: 1 })
    .resize({ width: 512, withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT, "fathom-layer-symbol.png"));

  // apple-icon: iOS não lida bem com transparência — compõe sobre o fundo do site
  const symbol = await sharp(path.join(OUT, "fathom-layer-symbol.png"))
    .resize({ width: 148, height: 148, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();
  await sharp({
    create: { width: 180, height: 180, channels: 4, background: { r: 10, g: 10, b: 11, alpha: 1 } },
  })
    .composite([{ input: symbol, gravity: "center" }])
    .png({ compressionLevel: 9 })
    .toFile(path.join(process.cwd(), "app", "apple-icon.png"));

  for (const f of ["fathom-layer-lockup.png", "fathom-layer-symbol.png"]) {
    const m = await sharp(path.join(OUT, f)).metadata();
    console.log(`${f}: ${m.width}x${m.height} alpha=${m.hasAlpha}`);
  }
  const ai = await sharp(path.join(process.cwd(), "app", "apple-icon.png")).metadata();
  console.log(`app/apple-icon.png: ${ai.width}x${ai.height}`);
})();
