const sharp = require('sharp');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SIZE = 1024;

async function main() {
  // Background: soft meadow green gradient
  const background = await sharp({
    create: {
      width: SIZE,
      height: SIZE,
      channels: 4,
      background: { r: 144, g: 212, b: 125, alpha: 1 }, // #90D47D
    },
  })
    .composite([
      {
        input: Buffer.from(
          `<svg width="${SIZE}" height="${SIZE}">
            <defs>
              <radialGradient id="g" cx="50%" cy="45%" r="65%">
                <stop offset="0%" stop-color="#B4E09A" stop-opacity="1"/>
                <stop offset="100%" stop-color="#7DC06A" stop-opacity="1"/>
              </radialGradient>
            </defs>
            <rect width="${SIZE}" height="${SIZE}" fill="url(#g)"/>
          </svg>`
        ),
        top: 0,
        left: 0,
      },
    ])
    .png()
    .toBuffer();

  // Character: kobito centered, larger
  const KOBITO_W = 560;
  const KOBITO_H = 986;
  const kobitoBuf = await sharp(path.join(ROOT, 'assets/game/char_kobito.png'))
    .resize(KOBITO_W, KOBITO_H, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  // Compose
  const result = await sharp(background)
    .composite([
      {
        input: kobitoBuf,
        left: Math.round((SIZE - KOBITO_W) / 2),
        top: Math.round((SIZE - KOBITO_H) / 2),
      },
    ])
    .png()
    .toBuffer();

  const outputPath = path.join(ROOT, 'assets/icon.png');
  await sharp(result).png().toFile(outputPath);

  // Also write to assets/splash-icon.png (same image is fine)
  const splashPath = path.join(ROOT, 'assets/splash-icon.png');
  await sharp(result).png().toFile(splashPath);

  // Verify
  const meta = await sharp(outputPath).metadata();
  console.log(`Generated: ${outputPath}`);
  console.log(`Size: ${meta.width}x${meta.height}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
