const svg = (width = 800, height = 620) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="#F6F1EA"/>
  <rect x="${width * 0.08}" y="${height * 0.1}" width="${width * 0.84}" height="${height * 0.72}" rx="18" fill="#FFFDF9" stroke="#D8C7A8" stroke-width="4"/>
  <path d="M${width * 0.24} ${height * 0.64}H${width * 0.76}L${width * 0.65} ${height * 0.45}L${width * 0.56} ${height * 0.58}L${width * 0.49} ${height * 0.49}L${width * 0.4} ${height * 0.64}L${width * 0.35} ${height * 0.56}L${width * 0.24} ${height * 0.64}Z" fill="#D8C7A8"/>
  <circle cx="${width * 0.36}" cy="${height * 0.35}" r="${Math.min(width, height) * 0.07}" fill="#C49A45"/>
  <text x="${width / 2}" y="${height * 0.92}" text-anchor="middle" fill="#7A6236" font-family="Arial, sans-serif" font-size="${Math.max(16, Math.round(width * 0.035))}" font-weight="700">Sindureghari Furniture</text>
</svg>`;

export async function GET(_request, context) {
    const params = await context.params;
    const [rawWidth, rawHeight] = params.size || [];
    const width = Math.min(Number(rawWidth) || 800, 1600);
    const height = Math.min(Number(rawHeight) || Math.round(width * 0.775), 1600);

    return new Response(svg(width, height), {
        headers: {
            'Content-Type': 'image/svg+xml; charset=utf-8',
            'Cache-Control': 'public, max-age=31536000, immutable'
        }
    });
}
