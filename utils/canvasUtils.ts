/**
 * Draws the Polaroid onto a canvas and triggers a download.
 */
export const downloadPolaroid = (imageSrc: string, caption: string, date: string) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // High resolution output dimensions
  const width = 1000;
  const height = 1200;
  const padding = 60;
  const bottomPadding = 250;
  
  canvas.width = width;
  canvas.height = height;

  // 1. Draw Paper Background (Off-white with subtle noise texture ideally, but solid for now)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Add a very subtle gradient for realism
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#ffffff');
  gradient.addColorStop(1, '#f8f8f8');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // 2. Load and Draw Image
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    // Determine draw dimensions for the inner photo (square aspect ratio logic or fit)
    const innerWidth = width - (padding * 2);
    const innerHeight = height - padding - bottomPadding;
    
    // Draw a dark placeholder behind image (film back)
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(padding, padding, innerWidth, innerHeight);

    // Draw the image covering the area (center crop)
    const imgAspect = img.width / img.height;
    const targetAspect = innerWidth / innerHeight;

    let drawWidth, drawHeight, sx, sy;

    if (imgAspect > targetAspect) {
      drawHeight = img.height;
      drawWidth = img.height * targetAspect;
      sy = 0;
      sx = (img.width - drawWidth) / 2;
    } else {
      drawWidth = img.width;
      drawHeight = img.width / targetAspect;
      sx = 0;
      sy = (img.height - drawHeight) / 2;
    }

    ctx.drawImage(img, sx, sy, drawWidth, drawHeight, padding, padding, innerWidth, innerHeight);

    // 3. Draw Text
    // Caption
    ctx.fillStyle = '#222222';
    ctx.font = '400 60px "Caveat", cursive, serif'; // Fallback to serif if Caveat unavailable in canvas context
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(caption, width / 2, height - (bottomPadding / 1.8));

    // Date (smaller, lighter)
    ctx.fillStyle = '#888888';
    ctx.font = '400 30px serif';
    ctx.fillText(date, width / 2, height - 60);

    // 4. Trigger Download
    const link = document.createElement('a');
    link.download = `polaroid-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };
  img.src = imageSrc;
};
