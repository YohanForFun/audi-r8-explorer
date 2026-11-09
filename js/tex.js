// 程序化画布纹理
import * as THREE from 'three';
function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; }
export function carbonTex() {
  const [c, g] = canvas(256, 256); g.fillStyle = '#16181b'; g.fillRect(0, 0, 256, 256);
  const s = 16;
  for (let y = 0; y < 256; y += s) for (let x = 0; x < 256; x += s) {
    const o = ((x / s + y / s) % 2) === 0;
    const gr = g.createLinearGradient(x, y, o ? x + s : x, o ? y : y + s);
    gr.addColorStop(0, '#202328'); gr.addColorStop(0.5, o ? '#3a3f46' : '#2b2f35'); gr.addColorStop(1, '#1a1c20');
    g.fillStyle = gr; g.fillRect(x + 0.5, y + 0.5, s - 1, s - 1);
  }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(6, 6); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
export function honeyTex(bg = '#050506', line = '#3a3d42') {
  const [c, g] = canvas(256, 256); g.fillStyle = bg; g.fillRect(0, 0, 256, 256);
  g.strokeStyle = line; g.lineWidth = 3.2;
  const r = 16, hgt = Math.sqrt(3) * r;
  for (let row = -1; row < 12; row++) for (let col = -1; col < 12; col++) {
    const cx = col * r * 3 + (row % 2 ? r * 1.5 : 0), cy = row * hgt / 2;
    g.beginPath();
    for (let k = 0; k < 6; k++) { const a = Math.PI / 3 * k; const px = cx + r * Math.cos(a), py = cy + r * Math.sin(a); k ? g.lineTo(px, py) : g.moveTo(px, py); }
    g.closePath(); g.stroke();
  }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
export function cockpitTex() {
  const [c, g] = canvas(1024, 384);
  g.fillStyle = '#05070a'; g.fillRect(0, 0, 1024, 384);
  const dial = (cx, cy, R, frac, label, unit) => {
    g.lineWidth = 10; g.strokeStyle = '#1d232b'; g.beginPath(); g.arc(cx, cy, R, Math.PI * 0.75, Math.PI * 2.25); g.stroke();
    g.strokeStyle = '#e3132b'; g.beginPath(); g.arc(cx, cy, R, Math.PI * 0.75, Math.PI * (0.75 + 1.5 * frac)); g.stroke();
    g.lineWidth = 3; g.strokeStyle = '#8c96a3';
    for (let i = 0; i <= 9; i++) { const a = Math.PI * (0.75 + 1.5 * i / 9); g.beginPath(); g.moveTo(cx + Math.cos(a) * (R - 22), cy + Math.sin(a) * (R - 22)); g.lineTo(cx + Math.cos(a) * (R - 8), cy + Math.sin(a) * (R - 8)); g.stroke(); }
    g.fillStyle = '#f2f4f7'; g.font = 'bold 64px sans-serif'; g.textAlign = 'center'; g.fillText(label, cx, cy + 20);
    g.fillStyle = '#8c96a3'; g.font = '22px sans-serif'; g.fillText(unit, cx, cy + 56);
  };
  dial(512, 200, 150, 0.62, '5', '×1000 rpm');
  dial(190, 210, 110, 0.4, '128', 'km/h');
  g.fillStyle = '#0c1722'; g.fillRect(720, 70, 250, 260);
  g.strokeStyle = '#2a6fd6'; g.lineWidth = 6; g.beginPath(); g.moveTo(740, 300); g.bezierCurveTo(800, 220, 860, 260, 950, 100); g.stroke();
  g.fillStyle = '#f2f4f7'; g.font = 'bold 26px sans-serif'; g.textAlign = 'left'; g.fillText('D 4', 740, 110);
  g.fillStyle = '#e3132b'; g.font = 'bold 22px sans-serif'; g.fillText('PERFORMANCE', 30, 40);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
export function discTex() {
  const [c, g] = canvas(256, 256);
  const gr = g.createRadialGradient(128, 128, 30, 128, 128, 128); gr.addColorStop(0, '#6b6f75'); gr.addColorStop(1, '#8a8e94');
  g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
  g.fillStyle = '#2a2c30';
  for (let i = 0; i < 36; i++) { const a = i / 36 * Math.PI * 2; for (const rr of [70, 88, 106]) { const o = (rr / 18) % 2 ? 0.09 : 0; g.beginPath(); g.arc(128 + Math.cos(a + o) * rr, 128 + Math.sin(a + o) * rr, 3.2, 0, Math.PI * 2); g.fill(); } }
  g.fillStyle = '#3c3f44'; g.beginPath(); g.arc(128, 128, 56, 0, Math.PI * 2); g.fill();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
export function shadowTex() {
  const [c, g] = canvas(256, 256);
  const gr = g.createRadialGradient(128, 128, 10, 128, 128, 128);
  gr.addColorStop(0, 'rgba(0,0,0,0.85)'); gr.addColorStop(0.55, 'rgba(0,0,0,0.5)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}
