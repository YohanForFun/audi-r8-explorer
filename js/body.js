// 程序化 R8 车身曲面：以纵向截面放样（loft），两端用超椭圆收口
import * as THREE from 'three';

export function pchip(pts) {
  const n = pts.length, xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  const d = [], m = new Array(n);
  for (let i = 0; i < n - 1; i++) d.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]));
  m[0] = d[0]; m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) { m[i] = m[i + 1] = 0; continue; }
    const a = m[i] / d[i], b = m[i + 1] / d[i], s = a * a + b * b;
    if (s > 9) { const t = 3 / Math.sqrt(s); m[i] = t * a * d[i]; m[i + 1] = t * b * d[i]; }
  }
  return x => {
    if (x <= xs[0]) return ys[0];
    if (x >= xs[n - 1]) return ys[n - 1];
    let i = 0; while (x > xs[i + 1]) i++;
    const h = xs[i + 1] - xs[i], t = (x - xs[i]) / h, t2 = t * t, t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * ys[i] + (t3 - 2 * t2 + t) * h * m[i] + (-2 * t3 + 3 * t2) * ys[i + 1] + (t3 - t2) * h * m[i + 1];
  };
}

// ---- 主要尺寸（米），x 向前，y 向上，z 向右 ----
export const DIM = {
  xF: 2.215, xR: -2.225, axF: 1.19, axR: -1.46, wr: 0.345, trackF: 0.82, trackR: 0.80,
};
const XS_F = 1.55, XS_R = -1.80, N_F = 3.2, N_R = 4.2;

const fTop = pchip([[-2.225, 0.90], [-2.15, 0.955], [-2.0, 0.968], [-1.6, 0.99], [-1.05, 1.06], [-0.62, 1.185], [-0.25, 1.235], [0.05, 1.228], [0.32, 1.175], [0.6, 1.06], [0.95, 0.872], [1.3, 0.785], [1.75, 0.72], [2.05, 0.635], [2.215, 0.53]]);
const fBelt = pchip([[-2.225, 0.85], [-2.0, 0.885], [-1.46, 0.905], [-0.95, 0.865], [-0.45, 0.80], [0.15, 0.765], [0.75, 0.755], [1.19, 0.80], [1.65, 0.755], [2.0, 0.65], [2.215, 0.55]]);
const fW = pchip([[-2.225, 0.925], [-1.9, 0.962], [-1.46, 0.975], [-0.95, 0.958], [-0.35, 0.928], [0.35, 0.93], [1.19, 0.955], [1.75, 0.94], [2.215, 0.905]]);
const fWc = pchip([[-2.225, 0.74], [-1.8, 0.71], [-1.2, 0.645], [-0.5, 0.60], [0.2, 0.585], [0.7, 0.63], [1.0, 0.72]]);
const fG = pchip([[-2.225, 0.5], [-1.5, 0.85], [-0.95, 1], [0.66, 1], [0.99, 0]]);
const fHb = pchip([[-2.225, 0.17], [-1.9, 0.13], [-1.6, 0.115], [1.7, 0.115], [2.215, 0.10]]);
const fMid = pchip([[-2.225, 0.48], [-1.46, 0.47], [0, 0.44], [1.19, 0.46], [2.215, 0.42]]);
export const xFrontH = pchip([[0.0, 2.13], [0.1, 2.175], [0.2, 2.205], [0.3, 2.215], [0.4, 2.20], [0.5, 2.16], [0.58, 2.10], [0.66, 2.0], [0.8, 1.9], [1.4, 1.85]]);
export const xRearH = pchip([[0.0, -2.12], [0.16, -2.19], [0.3, -2.225], [0.8, -2.225], [0.92, -2.2], [1.0, -2.14], [1.4, -2.0]]);
export const fns = { fTop, fBelt, fW, fWc, fG, fHb, fMid };

const secCache = new Map();
export function section(x) {
  const key = Math.round(x * 50000);
  let s = secCache.get(key); if (s) return s;
  const W = fW(x), hb = fHb(x), ht = fTop(x), hbelt = fBelt(x), wc = fWc(x), g = fG(x), hm = fMid(x);
  const d = ht - hbelt;
  const hood = [[W * 0.80, hbelt + d * 0.32], [W * 0.52, hbelt + d * 0.74], [W * 0.25, hbelt + d * 0.95]];
  const cab = [[W - 0.15, hbelt + 0.03], [wc, ht - 0.075], [wc * 0.55, ht - 0.014]];
  const L = (a, b) => [a[0] + (b[0] - a[0]) * g, a[1] + (b[1] - a[1]) * g];
  s = [[0, hb], [W - 0.11, hb], [W - 0.02, hb + 0.085], [W, hm], [W - 0.018, hbelt - 0.075], [W - 0.075, hbelt],
    L(hood[0], cab[0]), L(hood[1], cab[1]), L(hood[2], cab[2]), [0, ht]];
  if (secCache.size > 200000) secCache.clear();
  secCache.set(key, s); return s;
}

// centripetal Catmull-Rom on 2D points, t in [0,1] ; control point i at t=i/(n-1)
export function crEval(P, t) {
  const n = P.length - 1; const p = Math.min(Math.max(t, 0), 1) * n;
  let i = Math.floor(p); if (i >= n) i = n - 1; const w = p - i;
  const p1 = P[i], p2 = P[i + 1];
  const p0 = i > 0 ? P[i - 1] : [2 * p1[0] - p2[0], 2 * p1[1] - p2[1]];
  const p3 = i + 2 <= n ? P[i + 2] : [2 * p2[0] - p1[0], 2 * p2[1] - p1[1]];
  const dist = (a, b) => Math.max(Math.pow((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2, 0.25), 1e-4);
  let dt0 = dist(p0, p1), dt1 = dist(p1, p2), dt2 = dist(p2, p3);
  if (dt1 < 1e-4) dt1 = 1; if (dt0 < 1e-4) dt0 = dt1; if (dt2 < 1e-4) dt2 = dt1;
  const out = [0, 0];
  for (let k = 0; k < 2; k++) {
    let t1 = (p1[k] - p0[k]) / dt0 - (p2[k] - p0[k]) / (dt0 + dt1) + (p2[k] - p1[k]) / dt1;
    let t2 = (p2[k] - p1[k]) / dt1 - (p3[k] - p1[k]) / (dt1 + dt2) + (p3[k] - p2[k]) / dt2;
    t1 *= dt1; t2 *= dt1;
    const c0 = p1[k], c1 = t1, c2 = -3 * p1[k] + 3 * p2[k] - 2 * t1 - t2, c3 = 2 * p1[k] - 2 * p2[k] + t1 + t2;
    out[k] = c0 + c1 * w + c2 * w * w + c3 * w * w * w;
  }
  return out;
}

// x_ref -> 平面收口因子 f 与归一化 t
function endInfo(xr) {
  if (xr > XS_F) { const t = Math.min((xr - XS_F) / (DIM.xF - XS_F), 1); return { zone: 1, t, f: Math.pow(Math.max(1 - Math.pow(t, N_F), 0), 1 / N_F) }; }
  if (xr < XS_R) { const t = Math.min((XS_R - xr) / (XS_R - DIM.xR), 1); return { zone: -1, t, f: Math.pow(Math.max(1 - Math.pow(t, N_R), 0), 1 / N_R) }; }
  return { zone: 0, t: 0, f: 1 };
}

// 曲面点：xr 为参考纵向坐标，v ∈[0,1] 沿截面（底部中心→顶部中心），side=±1
export function surf(xr, v, side = 1, out = new THREE.Vector3()) {
  const sec = section(xr);
  const [lat, h] = crEval(sec, v);
  const e = endInfo(xr);
  let x = xr, l = lat;
  if (e.zone === 1) { x = XS_F + (Math.max(xFrontH(h), XS_F + 0.01) - XS_F) * e.t; l = lat * e.f; }
  else if (e.zone === -1) { x = XS_R - (XS_R - Math.min(xRearH(h), XS_R - 0.01)) * e.t; l = lat * e.f; }
  return out.set(x, h, side * l);
}

// 以 f 均匀采样的端部 x_ref 序列
export function xSamples(step = 0.012, endN = 46) {
  const out = [];
  for (let k = 0; k <= endN; k++) { const f = k / endN; const t = Math.pow(1 - Math.pow(f, N_R), 1 / N_R); out.push(XS_R - (XS_R - DIM.xR) * t); }
  const mid = [];
  const n = Math.ceil((XS_F - XS_R) / step);
  for (let i = 1; i < n; i++) mid.push(XS_R + (XS_F - XS_R) * i / n);
  const front = [];
  for (let k = endN; k >= 0; k--) { const f = k / endN; const t = Math.pow(1 - Math.pow(f, N_F), 1 / N_F); front.push(XS_F + (DIM.xF - XS_F) * t); }
  return [...out, ...mid, ...front];
}

export function lateralAtHeight(xr, h) {
  const sec = section(xr); let prev = crEval(sec, 0);
  for (let i = 1; i <= 80; i++) {
    const c = crEval(sec, i / 80 * 0.62);
    if ((prev[1] - h) * (c[1] - h) <= 0 && c[1] !== prev[1]) { const w = (h - prev[1]) / (c[1] - prev[1]); return prev[0] + (c[0] - prev[0]) * w; }
    prev = c;
  }
  return prev[0];
}
// 车头/车尾表面在 (z,h) 处的 x
export function bodyEndX(z, h, end = 1) {
  const az = Math.abs(z);
  let xr = end > 0 ? 2.0 : -2.05;
  let x = 0;
  for (let it = 0; it < 4; it++) {
    const W = lateralAtHeight(xr, h);
    const f = Math.min(az / Math.max(W, 1e-3), 1);
    if (end > 0) {
      const t = Math.pow(1 - Math.pow(f, N_F), 1 / N_F);
      x = XS_F + (xFrontH(h) - XS_F) * t; xr = XS_F + (DIM.xF - XS_F) * t;
    } else {
      const t = Math.pow(1 - Math.pow(f, N_R), 1 / N_R);
      x = XS_R - (XS_R - xRearH(h)) * t; xr = XS_R - (XS_R - DIM.xR) * t;
    }
  }
  return x;
}

export const V = i => i / 9;

// 通用曲面贴片：map(a,b)->[xr,v]
export function patchGeo(map, nu, nv, side, offset = 0, opts = {}) {
  const pos = [], uv = [], idx = [], p = new THREE.Vector3();
  for (let j = 0; j <= nv; j++) for (let i = 0; i <= nu; i++) {
    const [xr, v] = map(i / nu, j / nv);
    surf(xr, v, side, p); pos.push(p.x, p.y, p.z); uv.push(i / nu, j / nv);
  }
  for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) {
    const a = j * (nu + 1) + i, b = a + 1, c = a + nu + 1, d = c + 1;
    idx.push(a, b, d, a, d, c);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx); g.computeVertexNormals();
  orientOutward(g);
  if (offset) offsetAlongNormal(g, offset);
  return g;
}

export function orientOutward(g) {
  const pos = g.attributes.position, nor = g.attributes.normal;
  let score = 0; const c = new THREE.Vector3(0, 0.55, 0);
  for (let i = 0; i < pos.count; i += Math.max(1, Math.floor(pos.count / 200))) {
    const dx = pos.getX(i) * 0.25 - c.x, dy = pos.getY(i) - c.y, dz = pos.getZ(i) - c.z;
    score += dx * nor.getX(i) + dy * nor.getY(i) + dz * nor.getZ(i);
  }
  if (score < 0) {
    const ix = g.index.array; for (let i = 0; i < ix.length; i += 3) { const t = ix[i + 1]; ix[i + 1] = ix[i + 2]; ix[i + 2] = t; }
    g.index.needsUpdate = true; g.computeVertexNormals();
  }
}
export function offsetAlongNormal(g, o) {
  const pos = g.attributes.position, nor = g.attributes.normal;
  for (let i = 0; i < pos.count; i++) pos.setXYZ(i, pos.getX(i) + nor.getX(i) * o, pos.getY(i) + nor.getY(i) * o, pos.getZ(i) + nor.getZ(i) * o);
  pos.needsUpdate = true;
}

// 主车身（带开口），holes: [{x0,x1,v0,v1}] ; arches: [{x,y,r}]
export function bodyGeo(side, holes, arches) {
  const xs = xSamples(0.011, 40);
  const nv = 150;
  const pos = [], idx = [], keep = [];
  const p = new THREE.Vector3();
  const cols = xs.length;
  const deep = [];
  for (let j = 0; j <= nv; j++) {
    const v = j / nv;
    for (let i = 0; i < cols; i++) {
      surf(xs[i], v, side, p);
      let dp = false;
      if (Math.abs(p.z) > 0.6) for (const a of arches) {
        const dx = p.x - a.x, dy = p.y - a.y, d = Math.hypot(dx, dy);
        if (d < a.r) {
          const hx = Math.sqrt(Math.max(a.r * a.r - dy * dy, 0));
          if (d > a.r - 0.10 && v > 0.05 && v < 0.58 && dy > -0.12) { p.x = a.x + dx / d * a.r; p.y = a.y + dy / d * a.r; }
          else if (dy <= -0.12 && Math.abs(dx) > hx - 0.12) { p.x = a.x + Math.sign(dx || 1) * hx; }
          else dp = true;
        }
      }
      pos.push(p.x, p.y, p.z); deep.push(dp);
    }
  }
  for (let j = 0; j < nv; j++) for (let i = 0; i < cols - 1; i++) {
    const a = j * cols + i, b = a + 1, c = a + cols, d = c + 1;
    if (deep[a] || deep[b] || deep[c] || deep[d]) continue;
    const xm = (xs[i] + xs[i + 1]) / 2, vm = (j + 0.5) / nv;
    let skip = false;
    for (const h of holes) {
      if (h.side && h.side !== side) continue;
      const x0 = typeof h.x0 === 'function' ? h.x0(vm) : h.x0, x1 = typeof h.x1 === 'function' ? h.x1(vm) : h.x1;
      if (xm > x0 && xm < x1 && vm > h.v0 && vm < h.v1) { skip = true; break; }
    }
    if (skip) continue;
    // 拱内被吸附到圆上的四边形若退化则跳过
    idx.push(a, b, d, a, d, c);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx); g.computeVertexNormals(); orientOutward(g);
  return g;
}

export function xrFromF(f, end) {
  f = Math.min(Math.max(f, 0), 1);
  if (end > 0) { const t = Math.pow(1 - Math.pow(f, N_F), 1 / N_F); return XS_F + (DIM.xF - XS_F) * t; }
  const t = Math.pow(1 - Math.pow(f, N_R), 1 / N_R); return XS_R - (XS_R - DIM.xR) * t;
}
export const ZONES = { XS_F, XS_R };
