// Audi R8（二代风格）程序化结构示意模型
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/BufferGeometryUtils.js';
import * as B from './body.js';
import { carbonTex, honeyTex, cockpitTex, discTex } from './tex.js';

const { V, DIM } = B;
const v3 = (x, y, z) => new THREE.Vector3(x, y, z);
const Z = v3(0, 0, 1);

export function makeMaterials() {
  const carbon = carbonTex();
  const honey = honeyTex(); honey.repeat.set(9, 4);
  const honey2 = honeyTex('#07080a', '#2a2d31'); honey2.repeat.set(6, 3);
  const M = {
    paint: new THREE.MeshPhysicalMaterial({ name: 'Paint_AraBlue', color: 0x173a86, metalness: 0.55, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.06, side: THREE.DoubleSide }),
    carbon: new THREE.MeshPhysicalMaterial({ name: 'Carbon', map: carbon, color: 0x9aa0a8, metalness: 0.3, roughness: 0.35, clearcoat: 1, clearcoatRoughness: 0.08, side: THREE.DoubleSide }),
    carbonMatte: new THREE.MeshStandardMaterial({ name: 'CFRP', map: carbon, metalness: 0.2, roughness: 0.55 }),
    glass: new THREE.MeshPhysicalMaterial({ name: 'Glass_Tint', color: 0x0b0f14, metalness: 0.1, roughness: 0.04, transparent: true, opacity: 0.8, depthWrite: false, side: THREE.DoubleSide, envMapIntensity: 1.6 }),
    glassEngine: new THREE.MeshPhysicalMaterial({ name: 'Glass_Engine', color: 0x0e1216, metalness: 0.1, roughness: 0.03, transparent: true, opacity: 0.5, depthWrite: false, side: THREE.DoubleSide, envMapIntensity: 1.8 }),
    blackGloss: new THREE.MeshPhysicalMaterial({ name: 'Black_Gloss', color: 0x07080a, metalness: 0.2, roughness: 0.15, clearcoat: 1, side: THREE.DoubleSide }),
    blackMatte: new THREE.MeshStandardMaterial({ name: 'Black_Trim', color: 0x0d0e10, metalness: 0.1, roughness: 0.75, side: THREE.DoubleSide }),
    honey: new THREE.MeshStandardMaterial({ name: 'Grille_Honeycomb', map: honey, color: 0xffffff, metalness: 0.4, roughness: 0.45, side: THREE.DoubleSide }),
    honey2: new THREE.MeshStandardMaterial({ name: 'Intake_Mesh', map: honey2, color: 0xffffff, metalness: 0.4, roughness: 0.5, side: THREE.DoubleSide }),
    chrome: new THREE.MeshStandardMaterial({ name: 'Chrome', color: 0xdfe3e8, metalness: 1, roughness: 0.12 }),
    darkChrome: new THREE.MeshStandardMaterial({ name: 'Dark_Chrome', color: 0x55595f, metalness: 1, roughness: 0.22 }),
    lampGlass: new THREE.MeshPhysicalMaterial({ name: 'Lamp_Housing', color: 0x111418, metalness: 0.6, roughness: 0.12, clearcoat: 1 }),
    led: new THREE.MeshStandardMaterial({ name: 'LED_White', color: 0xffffff, emissive: 0xe8f2ff, emissiveIntensity: 2.4 }),
    tail: new THREE.MeshPhysicalMaterial({ name: 'Tail_Lens', color: 0x3a0306, metalness: 0.2, roughness: 0.1, clearcoat: 1, emissive: 0x5a0008, emissiveIntensity: 0.6 }),
    tailLed: new THREE.MeshStandardMaterial({ name: 'LED_Red', color: 0xff2030, emissive: 0xff0a1e, emissiveIntensity: 2.6 }),
    alu: new THREE.MeshStandardMaterial({ name: 'ASF_Aluminium', color: 0xc9ced4, metalness: 0.9, roughness: 0.32 }),
    aluCast: new THREE.MeshStandardMaterial({ name: 'Cast_Aluminium', color: 0xa9aeb4, metalness: 0.85, roughness: 0.45 }),
    engine: new THREE.MeshStandardMaterial({ name: 'Engine_Block', color: 0x55595f, metalness: 0.8, roughness: 0.42 }),
    engineDark: new THREE.MeshStandardMaterial({ name: 'Engine_Dark', color: 0x1f2226, metalness: 0.6, roughness: 0.45 }),
    camRed: new THREE.MeshPhysicalMaterial({ name: 'Cam_Cover_Red', color: 0xb3121f, metalness: 0.35, roughness: 0.3, clearcoat: 0.6 }),
    exhaust: new THREE.MeshStandardMaterial({ name: 'Exhaust_Steel', color: 0x8d8070, metalness: 0.95, roughness: 0.32 }),
    tip: new THREE.MeshStandardMaterial({ name: 'Exhaust_Tip', color: 0x2a2b2e, metalness: 1, roughness: 0.25, side: THREE.DoubleSide }),
    radiator: new THREE.MeshStandardMaterial({ name: 'Radiator_Core', map: honeyTex('#2b2f34', '#7a8089'), metalness: 0.7, roughness: 0.5 }),
    hose: new THREE.MeshStandardMaterial({ name: 'Hose', color: 0x15171a, metalness: 0.1, roughness: 0.7 }),
    coolant: new THREE.MeshStandardMaterial({ name: 'Coolant_Line', color: 0x2c63c9, metalness: 0.3, roughness: 0.45 }),
    tank: new THREE.MeshStandardMaterial({ name: 'Fuel_Tank', color: 0x3e4247, metalness: 0.3, roughness: 0.6 }),
    leather: new THREE.MeshStandardMaterial({ name: 'Leather_Black', color: 0x15161a, metalness: 0.05, roughness: 0.62 }),
    stitch: new THREE.MeshStandardMaterial({ name: 'Stitch_Red', color: 0xc0182a, roughness: 0.5 }),
    dash: new THREE.MeshStandardMaterial({ name: 'Dash_Soft', color: 0x1b1c20, metalness: 0.1, roughness: 0.7 }),
    screen: new THREE.MeshStandardMaterial({ name: 'Virtual_Cockpit', map: cockpitTex(), emissive: 0xffffff, emissiveMap: null, emissiveIntensity: 0.0 }),
    rubber: new THREE.MeshStandardMaterial({ name: 'Tyre', color: 0x101112, metalness: 0, roughness: 0.86 }),
    rim: new THREE.MeshStandardMaterial({ name: 'Rim_Titanium', color: 0x5f6369, metalness: 0.9, roughness: 0.28 }),
    rimDark: new THREE.MeshStandardMaterial({ name: 'Rim_Inner', color: 0x2c2e31, metalness: 0.8, roughness: 0.4 }),
    disc: new THREE.MeshStandardMaterial({ name: 'Brake_Disc', map: discTex(), metalness: 0.9, roughness: 0.38 }),
    caliper: new THREE.MeshPhysicalMaterial({ name: 'Caliper_Red', color: 0xc3101f, metalness: 0.2, roughness: 0.3, clearcoat: 1 }),
    spring: new THREE.MeshStandardMaterial({ name: 'Spring_Red', color: 0xd21d2c, metalness: 0.4, roughness: 0.35 }),
    damper: new THREE.MeshStandardMaterial({ name: 'Damper', color: 0xd9dde2, metalness: 0.95, roughness: 0.2 }),
    arm: new THREE.MeshStandardMaterial({ name: 'Wishbone', color: 0x3b3f45, metalness: 0.75, roughness: 0.4 }),
    floor: new THREE.MeshStandardMaterial({ name: 'Floor_Pan', color: 0x6d7379, metalness: 0.7, roughness: 0.5, side: THREE.DoubleSide }),
  };
  M.screen.emissiveMap = M.screen.map; M.screen.emissiveIntensity = 1.1;
  return M;
}

// ---------- 几何工具 ----------
function mk(geo, mat, label) { const m = new THREE.Mesh(geo, mat); if (label) m.name = label; m.userData.label = label; return m; }
function beamGeo(a, b, w, h) {
  const d = b.clone().sub(a), len = d.length();
  const g = new THREE.BoxGeometry(w, h, len);
  const q = new THREE.Quaternion().setFromUnitVectors(Z, d.normalize());
  g.applyQuaternion(q); const m = a.clone().add(b).multiplyScalar(0.5); g.translate(m.x, m.y, m.z); return g;
}
function cylGeo(a, b, r, seg = 16, r2 = r) {
  const d = b.clone().sub(a), len = d.length();
  const g = new THREE.CylinderGeometry(r2, r, len, seg); g.rotateX(Math.PI / 2);
  g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(Z, d.normalize()));
  const m = a.clone().add(b).multiplyScalar(0.5); g.translate(m.x, m.y, m.z); return g;
}
function tubeGeo(pts, r, seg = 64, rs = 12, closed = false) {
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, closed, 'centripetal'), seg, r, rs, closed);
}
function rbox(w, h, d, r = 0.02, x = 0, y = 0, z = 0) { const g = new RoundedBoxGeometry(w, h, d, 3, r); g.translate(x, y, z); return g; }
function merge(list) { return mergeGeometries(list.map(g => g.index ? g.toNonIndexed() : g), false); }
function rect(x0, x1, v0, v1) { return (a, b) => [x0 + (x1 - x0) * a, v0 + (v1 - v0) * b]; }
function nsteps(len, step) { return Math.max(2, Math.ceil(len / step)); }
function patch(x0, x1, v0, v1, side, off, stepX = 0.012) {
  return B.patchGeo(rect(x0, x1, v0, v1), nsteps(x1 - x0, stepX), nsteps((v1 - v0) * 9 * 0.25, 0.008), side, off);
}

// 前脸/尾部：在 (z,h) 多边形内生成贴合车身的网格
function faceGrid(poly, end, offset, step = 0.012) {
  let zmin = 1e9, zmax = -1e9, hmin = 1e9, hmax = -1e9;
  for (const [z, h] of poly) { zmin = Math.min(zmin, z); zmax = Math.max(zmax, z); hmin = Math.min(hmin, h); hmax = Math.max(hmax, h); }
  const nz = Math.ceil((zmax - zmin) / step), nh = Math.ceil((hmax - hmin) / step);
  const inside = (z, h) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [zi, hi] = poly[i], [zj, hj] = poly[j]; if ((hi > h) !== (hj > h) && z < (zj - zi) * (h - hi) / (hj - hi) + zi) c = !c; } return c; };
  const pos = [], uv = [], idx = [], map = new Map();
  const vid = (i, j) => {
    const k = i * 10000 + j; if (map.has(k)) return map.get(k);
    const z = zmin + (zmax - zmin) * i / nz, h = hmin + (hmax - hmin) * j / nh;
    const x = B.bodyEndX(z, h, end);
    pos.push(x, h, z); uv.push(z * 2.2, h * 2.2); map.set(k, pos.length / 3 - 1); return pos.length / 3 - 1;
  };
  for (let i = 0; i < nz; i++) for (let j = 0; j < nh; j++) {
    const zc = zmin + (zmax - zmin) * (i + 0.5) / nz, hc = hmin + (hmax - hmin) * (j + 0.5) / nh;
    if (!inside(zc, hc)) continue;
    const a = vid(i, j), b = vid(i + 1, j), c = vid(i, j + 1), d = vid(i + 1, j + 1);
    idx.push(a, d, b, a, c, d);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx); g.computeVertexNormals();
  let sx = 0; const nn = g.attributes.normal; for (let i = 0; i < nn.count; i++) sx += nn.getX(i);
  if (sx * end < 0) { const ix = g.index.array; for (let i = 0; i < ix.length; i += 3) { const t = ix[i + 1]; ix[i + 1] = ix[i + 2]; ix[i + 2] = t; } g.computeVertexNormals(); }
  B.offsetAlongNormal(g, offset);
  return g;
}
function faceOutline(poly, end, offset, r) {
  const pts = poly.map(([z, h]) => v3(B.bodyEndX(z, h, end) + end * offset, h, z));
  return tubeGeo(pts, r, 120, 8, true);
}

// ---------- 车轮 ----------
function wheelGroup(M, width, label) {
  const g = new THREE.Group(); g.name = label;
  const R = DIM.wr, rimR = 0.252;
  // 轮胎（绕 y 轴旋转后转向 z 轴）
  const hw = width / 2;
  const prof = [[rimR - 0.005, -hw + 0.012], [rimR + 0.02, -hw], [R - 0.025, -hw + 0.004], [R - 0.004, -hw + 0.03], [R, -hw + 0.06], [R, hw - 0.06], [R - 0.004, hw - 0.03], [R - 0.025, hw - 0.004], [rimR + 0.02, hw], [rimR - 0.005, hw - 0.012]].map(p => new THREE.Vector2(p[0], p[1]));
  const tyre = new THREE.LatheGeometry(prof, 72); tyre.rotateX(Math.PI / 2);
  g.add(mk(tyre, M.rubber, '轮胎'));
  // 轮辋筒
  const barrel = new THREE.CylinderGeometry(rimR - 0.006, rimR - 0.006, width - 0.03, 48, 1, true); barrel.rotateX(Math.PI / 2);
  const lip = new THREE.TorusGeometry(rimR - 0.002, 0.011, 8, 64); lip.translate(0, 0, hw - 0.02);
  const rimParts = [barrel, lip];
  // 五组双辐条
  const faceZ = hw - 0.035;
  for (let k = 0; k < 5; k++) for (const s of [-1, 1]) {
    const a = k / 5 * Math.PI * 2 + s * 0.12;
    const sh = new THREE.Shape(); sh.moveTo(0.055, -0.016); sh.lineTo(rimR - 0.012, -0.011); sh.lineTo(rimR - 0.012, 0.011); sh.lineTo(0.055, 0.016); sh.closePath();
    const sp = new THREE.ExtrudeGeometry(sh, { depth: 0.03, bevelEnabled: true, bevelSize: 0.004, bevelThickness: 0.004, bevelSegments: 2 });
    // 凹面：外端更靠外
    const p = sp.attributes.position; for (let i = 0; i < p.count; i++) { const r = p.getX(i); p.setZ(i, p.getZ(i) - 0.045 * (1 - (r - 0.055) / (rimR - 0.07))); }
    sp.computeVertexNormals();
    sp.rotateZ(a); sp.translate(0, 0, faceZ - 0.02); rimParts.push(sp);
  }
  const hub = new THREE.CylinderGeometry(0.068, 0.075, 0.05, 32); hub.rotateX(Math.PI / 2); hub.translate(0, 0, faceZ - 0.05); rimParts.push(hub);
  g.add(mk(merge(rimParts), M.rim, '轮辋（5 双辐）'));
  const inner = new THREE.CylinderGeometry(rimR - 0.01, rimR - 0.01, 0.01, 40); inner.rotateX(Math.PI / 2); inner.translate(0, 0, -hw + 0.03);
  g.add(mk(inner, M.rimDark, '轮辋内侧'));
  const cap = new THREE.CylinderGeometry(0.035, 0.035, 0.012, 24); cap.rotateX(Math.PI / 2); cap.translate(0, 0, faceZ - 0.018);
  g.add(mk(cap, M.blackGloss, '中心盖'));
  return g;
}

// ---------- 主构建 ----------
export function buildCar(M) {
  const root = new THREE.Group(); root.name = 'Audi_R8_Structure_Schematic';
  const G = {};
  for (const k of ['body', 'cockpit', 'power', 'cooling', 'chassis', 'suspension']) { G[k] = new THREE.Group(); G[k].name = k; root.add(G[k]); }
  const explode = []; const hinges = { doors: [], lids: [] };
  const addEx = (obj, dir) => explode.push({ obj, base: obj.position.clone(), dir: dir.clone() });

  // ===== 车身 =====
  const doorX0 = -0.42, doorX1 = 0.775, doorV0 = V(1.55), doorV1 = V(6.07);
  const dgX0 = -0.405, dgX1 = 0.87, dgV1 = V(6.95);
  const wsX0 = 0.27, wsX1 = 0.975, wsV0 = V(7.05);
  const fkX0 = 1.0, fkX1 = 2.06, fkV0 = V(5.75);
  const egX0 = -1.93, egX1 = -0.70, egV0 = V(7.3);
  const holes = [
    { x0: doorX0 - 0.004, x1: doorX1 + 0.004, v0: doorV0 - 0.003, v1: doorV1 + 0.002 },
    { x0: dgX0, x1: dgX1, v0: doorV1, v1: dgV1 },
    { x0: wsX0, x1: wsX1, v0: wsV0, v1: 1.01 },
    { x0: fkX0 - 0.004, x1: fkX1 + 0.004, v0: fkV0 - 0.003, v1: 1.01 },
    { x0: egX0 - 0.004, x1: egX1 + 0.004, v0: egV0 - 0.003, v1: 1.01 },
  ];
  const arches = [{ x: DIM.axF, y: DIM.wr, r: 0.392 }, { x: DIM.axR, y: DIM.wr, r: 0.398 }];
  const shell = new THREE.Group(); shell.name = '车身外壳'; G.body.add(shell);
  for (const s of [1, -1]) shell.add(mk(B.bodyGeo(s, holes, arches), M.paint, '铝/碳纤维车身外板'));
  addEx(shell, v3(0, 1.45, 0));

  // 风挡与固定玻璃
  const glassG = new THREE.Group(); glassG.name = '前风挡'; G.body.add(glassG);
  for (const s of [1, -1]) glassG.add(mk(patch(wsX0, wsX1, wsV0, 1, s, 0.001), M.glass, '前风挡玻璃'));
  addEx(glassG, v3(0.3, 1.9, 0));

  // 侧刀（Sideblade）
  for (const s of [1, -1]) {
    const blade = new THREE.Group(); blade.name = s > 0 ? '右侧刀' : '左侧刀';
    const up = B.patchGeo((a, b) => { const v = V(3.22) + (V(5.3) - V(3.22)) * b; const xr = -0.475 + (-(0.97 - 0.24 * b * b) + 0.475) * a; return [xr, v]; }, 40, 40, s, 0.007);
    const lo = B.patchGeo((a, b) => { const v = V(2.2) + (V(3.1) - V(2.2)) * b; const xr = -0.475 + (-(1.0 - 0.02 * b) + 0.475) * a; return [xr, v]; }, 40, 14, s, 0.007);
    blade.add(mk(up, M.carbon, '侧刀上段（碳纤维）'), mk(lo, M.carbon, '侧刀下段（碳纤维）'));
    const intake = B.patchGeo((a, b) => [-0.60 + (-0.80 + 0.60) * a, V(4.5) + (V(5.15) - V(4.5)) * b], 24, 16, s, 0.0105);
    blade.add(mk(intake, M.honey2, '侧进气口格栅'));
    G.body.add(blade); addEx(blade, v3(0, 1.0, s * 0.75));
  }

  // 车门（含门窗与后视镜），前铰链
  for (const s of [1, -1]) {
    const hinge = B.surf(doorX1, V(4.2), s);
    const pivot = new THREE.Group(); pivot.name = s > 0 ? '右车门' : '左车门'; pivot.position.copy(hinge);
    const panel = patch(doorX0, doorX1, doorV0, doorV1, s, 0.0015);
    const glass = patch(dgX0, dgX1, doorV1 + 0.002, dgV1, s, 0.001);
    const inner = patch(doorX0 + 0.02, doorX1 - 0.02, doorV0 + 0.02, doorV1, s, -0.06);
    const mirrorBase = B.surf(0.60, V(6.0), s);
    const mir = new THREE.Group();
    const housing = rbox(0.17, 0.085, 0.13, 0.035); housing.translate(0, 0, s * 0.03);
    const stalk = rbox(0.05, 0.03, 0.08, 0.012); stalk.translate(0.02, -0.03, -s * 0.03);
    mir.add(mk(housing, M.carbon, '后视镜壳（碳纤维）'), mk(stalk, M.blackGloss, '后视镜支臂'));
    mir.position.copy(mirrorBase).add(v3(0, 0.08, s * 0.10));
    [panel, glass, inner].forEach(g => g.translate(-hinge.x, -hinge.y, -hinge.z));
    mir.position.sub(hinge);
    pivot.add(mk(panel, M.paint, '车门外板'), mk(glass, M.glass, '无框车窗玻璃'), mk(inner, M.blackMatte, '车门内饰板'), mir);
    pivot.userData.shellGroup = true;
    G.body.add(pivot); hinges.doors.push({ obj: pivot, axis: v3(0.06, 1, 0).normalize(), max: s * 1.08 });
    addEx(pivot, v3(0, 0.6, s * 1.15));
  }

  // 前备箱盖（后铰链） & 发动机玻璃盖（前铰链）
  {
    const h = B.surf(fkX0, 1, 1);
    const pivot = new THREE.Group(); pivot.name = '前备箱盖'; pivot.position.set(h.x, h.y, 0);
    for (const s of [1, -1]) { const g = patch(fkX0, fkX1, fkV0, 1, s, 0.0015); g.translate(-h.x, -h.y, 0); pivot.add(mk(g, M.paint, '前备箱盖')); }
    G.body.add(pivot); hinges.lids.push({ obj: pivot, axis: v3(0, 0, 1), max: 0.92 }); addEx(pivot, v3(0.45, 1.75, 0));
  }
  {
    const h = B.surf(egX1, 1, 1);
    const pivot = new THREE.Group(); pivot.name = '发动机舱玻璃盖'; pivot.position.set(h.x, h.y, 0);
    for (const s of [1, -1]) {
      const g = patch(egX0, egX1, egV0, 1, s, 0.0015); g.translate(-h.x, -h.y, 0); pivot.add(mk(g, M.glassEngine, '发动机舱玻璃盖'));
      const fr = patch(egX0, egX1, egV0, egV0 + 0.012, s, 0.003); fr.translate(-h.x, -h.y, 0); pivot.add(mk(fr, M.blackGloss, '玻璃盖边框'));
      // 散热百叶
      for (let k = 0; k < 4; k++) { const xx = -1.62 - k * 0.07; const lg = patch(xx - 0.025, xx, egV0 + 0.02, V(8.3), s, 0.004); lg.translate(-h.x, -h.y, 0); pivot.add(mk(lg, M.blackGloss, '散热百叶')); }
    }
    G.body.add(pivot); hinges.lids.push({ obj: pivot, axis: v3(0, 0, 1), max: -0.85 }); addEx(pivot, v3(-0.35, 1.85, 0));
  }

  // 灯组
  const lights = new THREE.Group(); lights.name = '灯组'; G.body.add(lights); addEx(lights, v3(0, 1.45, 0));
  for (const s of [1, -1]) {
    const hp = [[0.50, 0.505], [0.64, 0.548], [0.79, 0.566], [0.845, 0.552], [0.865, 0.505], [0.80, 0.474], [0.60, 0.466]].map(([z, h]) => [s * z, h]);
    lights.add(mk(faceGrid(hp, 1, 0.004, 0.006), M.lampGlass, 'LED 大灯'));
    const refl = [[0.57, 0.503], [0.76, 0.535], [0.81, 0.522], [0.80, 0.50], [0.62, 0.490]].map(([z, h]) => [s * z, h]);
    lights.add(mk(faceGrid(refl, 1, 0.0065, 0.005), M.darkChrome, '大灯反射腔'));
    const drl = [[0.60, 0.470], [0.80, 0.479], [0.862, 0.506], [0.856, 0.518], [0.80, 0.491], [0.60, 0.481]].map(([z, h]) => [s * z, h]);
    lights.add(mk(faceGrid(drl, 1, 0.0075, 0.004), M.led, 'LED 日间行车灯'));
    // 尾灯（按收口因子采样）
    const tmap = (a, b) => [B.xrFromF(0.07 + 0.92 * a, -1), V(4.32) + (V(4.7) - V(4.32)) * b];
    lights.add(mk(B.patchGeo(tmap, 60, 8, s, 0.003), M.tail, 'LED 尾灯'));
    lights.add(mk(B.patchGeo((a, b) => [B.xrFromF(0.12 + 0.86 * a, -1), V(4.40) + 0.006 * b], 60, 2, s, 0.0045), M.tailLed, '尾灯光带'));
  }

  // 前脸：单框格栅 + 侧进气 + 下扰流
  const front = new THREE.Group(); front.name = '前脸'; G.body.add(front); addEx(front, v3(0.95, 0.5, 0));
  {
    const grille = [[-0.33, 0.505], [0.33, 0.505], [0.47, 0.44], [0.44, 0.19], [0.33, 0.13], [-0.33, 0.13], [-0.44, 0.19], [-0.47, 0.44]];
    front.add(mk(faceGrid(grille, 1, 0.008, 0.01), M.honey, '六边形单框格栅'));
    front.add(mk(faceOutline(grille, 1, 0.012, 0.011), M.darkChrome, '格栅边框'));
    // 四环标志
    for (let k = 0; k < 4; k++) {
      const z = (k - 1.5) * 0.072; const x = B.bodyEndX(z, 0.44, 1) + 0.03;
      const ring = new THREE.TorusGeometry(0.043, 0.0065, 10, 48); ring.rotateY(Math.PI / 2); ring.translate(x, 0.435, z);
      front.add(mk(ring, M.chrome, 'Audi 四环'));
    }
    for (const s of [1, -1]) {
      const intake = [[0.53, 0.40], [0.80, 0.36], [0.86, 0.22], [0.83, 0.15], [0.52, 0.15], [0.49, 0.22]].map(([z, h]) => [s * z, h]);
      front.add(mk(faceGrid(intake, 1, 0.006, 0.01), M.honey2, '前侧进气口'));
      front.add(mk(faceOutline(intake, 1, 0.009, 0.008), M.blackGloss, '进气口饰框'));
      // 三条前缘狭缝（仅示意）
    }
    // 前下扰流
    const lipPts = []; for (let i = 0; i <= 30; i++) { const z = -0.86 + 1.72 * i / 30; lipPts.push(v3(B.bodyEndX(z, 0.12, 1) + 0.035, 0.105, z)); }
    const lip = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(lipPts), 60, 0.018, 6); lip.scale(1, 0.5, 1);
    lip.translate(0, 0.0525, 0);
    front.add(mk(lip, M.carbon, '前下扰流（碳纤维）'));
  }
  // 尾部：黑色格栅带 + 扩散器 + 排气口 + 扰流
  const rear = new THREE.Group(); rear.name = '尾部'; G.body.add(rear); addEx(rear, v3(-0.95, 0.5, 0));
  {
    for (const s of [1, -1]) {
      rear.add(mk(B.patchGeo((a, b) => [B.xrFromF(0.02 + 0.93 * a, -1), V(3.35) + (V(4.18) - V(3.35)) * b], 60, 14, s, 0.003), M.honey, '尾部黑色格栅'));
      rear.add(mk(B.patchGeo((a, b) => [B.xrFromF(0.0 + 0.97 * a, -1), V(0.6) + (V(2.75) - V(0.6)) * b], 60, 18, s, 0.003), M.carbon, '后扩散器（碳纤维）'));
      // 椭圆排气尾管
      const z = s * 0.50, h = 0.33, x = B.bodyEndX(z, h, -1);
      const tip = new THREE.TorusGeometry(0.075, 0.012, 10, 40); tip.scale(1, 0.62, 1); tip.rotateY(Math.PI / 2); tip.translate(x - 0.005, h, z);
      const tipIn = new THREE.CylinderGeometry(0.072, 0.072, 0.16, 32, 1, true); tipIn.scale(0.62, 1, 1); tipIn.rotateZ(Math.PI / 2);
      tipIn.translate(x + 0.07, h, z);
      rear.add(mk(tip, M.chrome, '椭圆排气尾管'), mk(tipIn, M.tip, '排气尾管内壁'));
    }
    for (let k = -3; k <= 3; k++) { const z = k * 0.11; const x0 = B.bodyEndX(z, 0.2, -1); rear.add(mk(beamGeo(v3(x0 + 0.02, 0.22, z), v3(x0 + 0.40, 0.17, z), 0.008, 0.09), M.carbon, '扩散器导流鳍')); }
  }
  // 轮拱内衬
  {
    const lin = [];
    for (const a of arches) for (const s of [1, -1]) {
      const pos = [], idx = []; const N = 48;
      for (let i = 0; i <= N; i++) { const ph = -0.35 + (Math.PI + 0.7) * i / N; const x = a.x + Math.cos(ph) * (a.r - 0.004), y = a.y + Math.sin(ph) * (a.r - 0.004); const zo = Math.max(0.62, B.lateralAtHeight(x, Math.max(y, 0.2)) - 0.012); for (const z of [0.56, zo]) pos.push(x, y, s * z); }
      for (let i = 0; i < N; i++) { const p = i * 2; idx.push(p, p + 1, p + 3, p, p + 3, p + 2); }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); lin.push(g);
    }
    shell.add(mk(merge(lin), M.blackMatte, '轮拱内衬'));
  }

  // ===== 车架与底盘（ASF） =====
  {
    const C = G.chassis, A = M.alu;
    const beams = [], cfrp = [];
    const sym = (fn) => { fn(1); fn(-1); };
    sym(s => {
      beams.push(beamGeo(v3(0.98, 0.24, s * 0.80), v3(-0.62, 0.24, s * 0.80), 0.09, 0.16)); // 门槛
      beams.push(tubeGeo([v3(0.97, 0.38, s * 0.78), v3(0.92, 0.76, s * 0.70), v3(0.58, 1.0, s * 0.58), v3(0.28, 1.10, s * 0.52)], 0.028, 30, 8)); // A 柱
      beams.push(tubeGeo([v3(0.28, 1.10, s * 0.52), v3(-0.2, 1.15, s * 0.51), v3(-0.55, 1.10, s * 0.52)], 0.026, 24, 8)); // 车顶纵梁
      beams.push(beamGeo(v3(0.98, 0.34, s * 0.45), v3(2.02, 0.32, s * 0.42), 0.08, 0.12)); // 前纵梁
      beams.push(beamGeo(v3(0.98, 0.66, s * 0.72), v3(1.78, 0.55, s * 0.66), 0.06, 0.07)); // 前上边梁
      beams.push(beamGeo(v3(1.19, 0.32, s * 0.45), v3(1.12, 0.64, s * 0.60), 0.07, 0.07)); // 前减振塔
      beams.push(beamGeo(v3(-0.62, 0.30, s * 0.62), v3(-2.10, 0.30, s * 0.55), 0.08, 0.13)); // 后纵梁
      beams.push(tubeGeo([v3(-0.55, 1.10, s * 0.52), v3(-1.1, 0.94, s * 0.66), v3(-1.7, 0.84, s * 0.74), v3(-2.10, 0.80, s * 0.70)], 0.028, 30, 8)); // 后上边梁
      beams.push(beamGeo(v3(-1.46, 0.30, s * 0.58), v3(-1.40, 0.82, s * 0.70), 0.07, 0.07)); // 后减振塔
      beams.push(beamGeo(v3(-0.62, 0.30, s * 0.80), v3(-1.0, 0.30, s * 0.62), 0.07, 0.10));
      cfrp.push(beamGeo(v3(-0.55, 0.30, s * 0.78), v3(-0.55, 1.09, s * 0.53), 0.10, 0.06)); // CFRP B 柱
      beams.push(beamGeo(v3(-1.0, 0.86, s * 0.76), v3(-0.85, 0.30, s * 0.70), 0.05, 0.05)); // 侧斜撑
    });
    beams.push(beamGeo(v3(0.28, 1.10, -0.52), v3(0.28, 1.10, 0.52), 0.05, 0.05)); // 风挡上横梁
    beams.push(beamGeo(v3(-0.55, 1.10, -0.52), v3(-0.55, 1.10, 0.52), 0.05, 0.06));
    beams.push(beamGeo(v3(0.97, 0.80, -0.72), v3(0.97, 0.80, 0.72), 0.06, 0.06)); // 前围上横梁
    beams.push(beamGeo(v3(2.02, 0.32, -0.55), v3(2.02, 0.32, 0.55), 0.06, 0.10)); // 前防撞梁
    beams.push(beamGeo(v3(-2.10, 0.32, -0.6), v3(-2.10, 0.32, 0.6), 0.06, 0.10)); // 后防撞梁
    beams.push(beamGeo(v3(-1.46, 0.82, -0.70), v3(-1.46, 0.82, 0.70), 0.05, 0.05)); // 发动机舱横撑
    beams.push(beamGeo(v3(-0.75, 0.84, -0.66), v3(-1.46, 0.82, 0.70), 0.035, 0.035)); // X 形加强
    beams.push(beamGeo(v3(-0.75, 0.84, 0.66), v3(-1.46, 0.82, -0.70), 0.035, 0.035));
    C.add(mk(merge(beams), A, '奥迪空间框架（铝合金型材）'));
    // CFRP：B 柱、中央通道、后隔板
    cfrp.push(rbox(0.04, 0.80, 1.40, 0.015, -0.62, 0.60, 0)); // 后隔板
    cfrp.push(rbox(1.45, 0.20, 0.26, 0.04, 0.22, 0.27, 0)); // 中央通道
    C.add(mk(merge(cfrp), M.carbonMatte, 'CFRP 构件（B 柱/中央通道/后隔板）'));
    const floor = new THREE.BoxGeometry(1.62, 0.012, 1.58); floor.translate(0.18, 0.165, 0);
    C.add(mk(floor, M.floor, '地板'));
    const frunk = rbox(0.56, 0.16, 0.76, 0.04, 1.52, 0.50, 0);
    C.add(mk(frunk, M.blackMatte, '前备箱舱'));
    addEx(C, v3(0, 0, 0));
  }

  // ===== 座舱 =====
  {
    const K = G.cockpit;
    const seat = (z, label) => {
      const g = new THREE.Group(); g.name = label;
      const cush = rbox(0.48, 0.10, 0.44, 0.04); cush.rotateZ(0.12); cush.translate(-0.08, 0.27, 0);
      const back = rbox(0.11, 0.68, 0.46, 0.045); back.rotateZ(0.32); back.translate(-0.36, 0.60, 0);
      const parts = [cush, back];
      for (const sz of [-1, 1]) {
        const bol = rbox(0.12, 0.52, 0.07, 0.03); bol.rotateZ(0.32); bol.translate(-0.31, 0.58, sz * 0.22); parts.push(bol);
        const cb = rbox(0.42, 0.08, 0.07, 0.03); cb.rotateZ(0.12); cb.translate(-0.06, 0.32, sz * 0.21); parts.push(cb);
      }
      g.add(mk(merge(parts), M.leather, '桶形运动座椅'));
      const st = rbox(0.02, 0.5, 0.012, 0.004); st.rotateZ(0.32); st.translate(-0.30, 0.60, 0);
      const st2 = st.clone(); st.translate(0, 0, 0.12); st2.translate(0, 0, -0.12);
      g.add(mk(merge([st, st2]), M.stitch, '红色缝线'));
      g.position.z = z; return g;
    };
    const sd = seat(-0.33, '驾驶员座椅'), sp = seat(0.33, '乘客座椅');
    K.add(sd, sp);
    // 方向盘（平底）
    const sw = new THREE.Group(); sw.name = '平底方向盘';
    const rim = []; for (let i = 0; i <= 64; i++) { const a = i / 64 * Math.PI * 2; let y = Math.sin(a) * 0.185, z = Math.cos(a) * 0.185; if (y < -0.15) y = -0.15; rim.push(v3(0, y, z)); }
    sw.add(mk(tubeGeo(rim.slice(0, 64), 0.019, 96, 10, true), M.leather, '方向盘轮圈'));
    const spokes = [beamGeo(v3(0, 0, 0), v3(0, 0, 0.17), 0.02, 0.05), beamGeo(v3(0, 0, 0), v3(0, 0, -0.17), 0.02, 0.05), beamGeo(v3(0, 0, 0), v3(0, -0.15, 0), 0.02, 0.05)];
    sw.add(mk(merge(spokes), M.darkChrome, '方向盘辐条'));
    sw.add(mk(rbox(0.05, 0.10, 0.13, 0.02), M.leather, '安全气囊'));
    for (const sz of [-1, 1]) { const b = new THREE.CylinderGeometry(0.018, 0.018, 0.02, 16); b.rotateZ(Math.PI / 2); b.translate(-0.01, -0.06, sz * 0.105); sw.add(mk(b, M.caliper, '方向盘卫星按键')); }
    sw.position.set(0.40, 0.70, -0.33); sw.rotation.z = -0.38; K.add(sw);
    const col = cylGeo(v3(0.40, 0.70, -0.33), v3(0.62, 0.62, -0.33), 0.03); K.add(mk(col, M.dash, '转向柱'));
    // 仪表台 + virtual cockpit
    const dash = rbox(0.42, 0.20, 1.44, 0.06, 0.74, 0.66, 0); K.add(mk(dash, M.dash, '仪表台'));
    const hood = rbox(0.24, 0.05, 0.42, 0.02); hood.rotateZ(-0.05); hood.translate(0.66, 0.82, -0.33); K.add(mk(hood, M.dash, '仪表遮光罩'));
    const scr = new THREE.PlaneGeometry(0.30, 0.115); scr.rotateY(-Math.PI / 2); scr.rotateZ(-0.25); scr.translate(0.585, 0.765, -0.33);
    K.add(mk(scr, M.screen, '12.3 英寸 virtual cockpit'));
    const cons = rbox(0.70, 0.16, 0.20, 0.04); cons.rotateZ(0.28); cons.translate(0.40, 0.45, 0); K.add(mk(cons, M.dash, '中央控制台'));
    const gear = cylGeo(v3(0.25, 0.40, 0), v3(0.24, 0.47, 0), 0.025); K.add(mk(gear, M.darkChrome, '换挡拨杆'));
    for (const z of [-0.36, -0.27]) { K.add(mk(rbox(0.02, 0.10, z === -0.36 ? 0.05 : 0.08, 0.008, 0.88, 0.27, z), M.darkChrome, z === -0.36 ? '制动踏板' : '加速踏板')); }
    addEx(K, v3(0, 0.45, 0));
    sd.userData.ex = true; addEx(sd, v3(0, 0.2, -0.35)); addEx(sp, v3(0, 0.2, 0.35));
  }

  // ===== 动力与传动 =====
  {
    const P = G.power;
    const eng = new THREE.Group(); eng.name = '5.2L V10 发动机';
    const ex0 = -0.66, ex1 = -1.38, ecx = (ex0 + ex1) / 2, el = ex0 - ex1, cy = 0.34;
    eng.add(mk(rbox(el, 0.22, 0.34, 0.03, ecx, cy - 0.02, 0), M.engine, '曲轴箱 / 缸体下部'));
    eng.add(mk(rbox(el - 0.04, 0.08, 0.36, 0.02, ecx, cy - 0.17, 0), M.engineDark, '干式油底壳'));
    eng.add(mk(rbox(0.06, 0.34, 0.44, 0.03, ex0 + 0.02, cy + 0.08, 0), M.engineDark, '正时链条罩'));
    for (const s of [1, -1]) {
      const bank = new THREE.Group(); bank.name = s > 0 ? '右列气缸（5 缸）' : '左列气缸（5 缸）';
      bank.position.set(0, cy, 0); bank.rotation.x = -s * Math.PI / 4;
      bank.add(mk(rbox(el - 0.02, 0.24, 0.18, 0.02, ecx, 0.17, 0), M.engine, '气缸体'));
      bank.add(mk(rbox(el - 0.04, 0.09, 0.20, 0.03, ecx, 0.335, 0), M.camRed, '凸轮轴罩盖'));
      for (let i = 0; i < 5; i++) {
        const x = ex0 - 0.07 - i * (el - 0.14) / 4 - (s > 0 ? 0.0 : 0.03);
        const coil = new THREE.CylinderGeometry(0.022, 0.022, 0.07, 14); coil.translate(x, 0.40, 0);
        bank.add(mk(coil, M.engineDark, '点火线圈'));
        const liner = new THREE.CylinderGeometry(0.044, 0.044, 0.2, 20); liner.translate(x, 0.16, s * 0.0); bank.add(mk(liner, M.aluCast, '气缸（示意）'));
      }
      eng.add(bank);
    }
    // 进气歧管（V 形夹角内）
    eng.add(mk(rbox(el - 0.12, 0.10, 0.20, 0.04, ecx, cy + 0.42, 0), M.carbonMatte, '进气稳压腔'));
    const runners = [];
    for (const s of [1, -1]) for (let i = 0; i < 5; i++) {
      const x = ex0 - 0.07 - i * (el - 0.14) / 4 - (s > 0 ? 0 : 0.03);
      runners.push(tubeGeo([v3(x, cy + 0.42, s * 0.04), v3(x, cy + 0.38, s * 0.14), v3(x, cy + 0.26, s * 0.19)], 0.022, 12, 8));
    }
    eng.add(mk(merge(runners), M.aluCast, '进气歧管'));
    const tb = cylGeo(v3(ex0 + 0.0, cy + 0.42, 0), v3(ex0 + 0.12, cy + 0.42, 0), 0.05, 24); eng.add(mk(tb, M.chrome, '节气门体'));
    P.add(eng); addEx(eng, v3(0.0, 0.75, 0));
    // 7 速 S tronic
    const gb = new THREE.Group(); gb.name = '7 速 S tronic 双离合变速箱';
    const bell = cylGeo(v3(ex1, cy, 0), v3(ex1 - 0.16, cy, 0), 0.19, 32, 0.15); gb.add(mk(bell, M.aluCast, '双离合模块壳体'));
    gb.add(mk(rbox(0.46, 0.30, 0.30, 0.05, ex1 - 0.38, cy, 0), M.aluCast, '变速箱壳体'));
    gb.add(mk(rbox(0.22, 0.24, 0.36, 0.05, DIM.axR - 0.0, cy, 0), M.engine, '后差速器'));
    P.add(gb); addEx(gb, v3(-0.75, 0.45, 0));
    // 传动轴与半轴
    const shafts = [];
    shafts.push(tubeGeo([v3(-1.36, 0.22, 0.20), v3(-0.9, 0.18, 0.21), v3(-0.3, 0.22, 0.05), v3(0.6, 0.25, 0.0), v3(1.08, 0.30, 0.0)], 0.03, 60, 10)); // quattro 传动轴
    for (const s of [1, -1]) {
      shafts.push(cylGeo(v3(DIM.axR, DIM.wr, s * 0.18), v3(DIM.axR, DIM.wr, s * 0.66), 0.024));
      shafts.push(cylGeo(v3(DIM.axF, DIM.wr, s * 0.14), v3(DIM.axF, DIM.wr, s * 0.68), 0.022));
    }
    const sh = new THREE.Group(); sh.name = '传动轴与半轴'; sh.add(mk(merge(shafts), M.darkChrome, 'quattro 传动轴 / 半轴'));
    const cvs = []; for (const s of [1, -1]) for (const [x, z0, z1] of [[DIM.axR, 0.2, 0.64], [DIM.axF, 0.16, 0.66]]) { for (const z of [z0, z1]) { const c = new THREE.SphereGeometry(0.045, 16, 10); c.scale(1, 1, 0.8); c.translate(x, DIM.wr, s * z); cvs.push(c); } }
    sh.add(mk(merge(cvs), M.hose, '等速万向节护套'));
    P.add(sh);
    const fd = new THREE.Group(); fd.name = '前桥差速器 / 多片离合器';
    fd.add(mk(rbox(0.22, 0.20, 0.26, 0.05, DIM.axF, DIM.wr - 0.02, 0), M.aluCast, '前桥差速器（quattro）'));
    P.add(fd); addEx(fd, v3(0.45, 0.3, 0));
  }

  // ===== 冷却与排气 =====
  {
    const Cg = G.cooling;
    const rad = new THREE.Group(); rad.name = '前置散热器组';
    const core = (w, h) => { const g = new THREE.BoxGeometry(0.05, h, w); return g; };
    const c1 = core(0.62, 0.30); c1.rotateZ(-0.35); c1.translate(1.98, 0.30, 0); rad.add(mk(c1, M.radiator, '中央散热器'));
    for (const s of [1, -1]) { const c = core(0.30, 0.26); c.rotateY(s * 0.55); c.translate(1.92, 0.28, s * 0.62); rad.add(mk(c, M.radiator, s > 0 ? '右前散热器' : '左前散热器')); }
    Cg.add(rad); addEx(rad, v3(0.75, 0.25, 0));
    const lines = [];
    for (const s of [1, -1]) lines.push(tubeGeo([v3(1.9, 0.26, s * 0.30), v3(1.2, 0.20, s * 0.30), v3(0.4, 0.20, s * 0.12), v3(-0.4, 0.20, s * 0.10), v3(-0.66, 0.30, s * 0.12)], 0.022, 60, 8));
    const lg = new THREE.Group(); lg.name = '冷却液管路'; lg.add(mk(merge(lines), M.coolant, '冷却液管路')); Cg.add(lg);
    // 侧进气道（侧刀 → 发动机舱）
    const ducts = new THREE.Group(); ducts.name = '侧进气道';
    for (const s of [1, -1]) ducts.add(mk(tubeGeo([v3(-0.78, 0.78, s * 0.90), v3(-0.82, 0.76, s * 0.70), v3(-0.92, 0.74, s * 0.40)], 0.07, 24, 14), M.hose, '侧进气道'));
    Cg.add(ducts); addEx(ducts, v3(0, 0.5, 0));
    // 排气
    const exg = new THREE.Group(); exg.name = '排气系统';
    const ex0 = -0.66, el = 0.72, cy = 0.34;
    const pipes = [];
    for (const s of [1, -1]) {
      for (let i = 0; i < 5; i++) {
        const x = ex0 - 0.07 - i * (el - 0.14) / 4 - (s > 0 ? 0 : 0.03);
        pipes.push(tubeGeo([v3(x, cy + 0.10, s * 0.26), v3(x, cy + 0.02, s * 0.36), v3(x - 0.05, cy - 0.10, s * 0.38), v3(-1.30, cy - 0.12, s * 0.37)], 0.02, 20, 8));
      }
      pipes.push(tubeGeo([v3(-1.30, cy - 0.12, s * 0.37), v3(-1.6, 0.24, s * 0.42), v3(-1.85, 0.30, s * 0.46)], 0.035, 30, 10));
      pipes.push(tubeGeo([v3(-2.0, 0.33, s * 0.48), v3(-2.12, 0.33, s * 0.50)], 0.045, 8, 12));
    }
    exg.add(mk(merge(pipes), M.exhaust, '排气歧管与排气管'));
    for (const s of [1, -1]) { const muf = rbox(0.24, 0.20, 0.30, 0.07, -1.93, 0.32, s * 0.45); exg.add(mk(muf, M.exhaust, '后消声器')); }
    const cats = []; for (const s of [1, -1]) cats.push(cylGeo(v3(-1.38, cy - 0.12, s * 0.37), v3(-1.6, 0.24, s * 0.42), 0.06, 20));
    exg.add(mk(merge(cats), M.aluCast, '催化转化器'));
    Cg.add(exg); addEx(exg, v3(-0.35, -0.0, 0));
    const tank = new THREE.Group(); tank.name = '燃油箱';
    tank.add(mk(rbox(0.40, 0.18, 0.70, 0.06, 1.24, 0.40, 0), M.tank, '燃油箱（示意位置）'));
    Cg.add(tank); addEx(tank, v3(0.3, 0.55, 0));
  }

  // ===== 悬挂与制动 / 车轮 =====
  for (const [ax, tz, w, nm] of [[DIM.axF, DIM.trackF, 0.245, '前'], [DIM.axR, DIM.trackR, 0.295, '后']]) for (const s of [1, -1]) {
    const corner = new THREE.Group(); corner.name = `${nm}${s > 0 ? '右' : '左'}悬挂`; corner.position.set(ax, 0, 0); corner.scale.z = s;
    const wheel = wheelGroup(M, w, '车轮'); wheel.position.set(0, DIM.wr, tz); corner.add(wheel); wheel.userData.wheel = true;
    const brake = new THREE.Group(); brake.name = '制动';
    const disc = new THREE.CylinderGeometry(0.19, 0.19, 0.032, 48); disc.rotateX(Math.PI / 2); disc.translate(0, DIM.wr, tz - 0.07);
    brake.add(mk(disc, M.disc, '通风打孔制动盘'));
    const cal = rbox(0.16, 0.10, 0.075, 0.03); cal.translate(0, 0.15, 0); cal.rotateZ(nm === '前' ? -0.6 : 0.6); cal.translate(0, DIM.wr, tz - 0.07);
    brake.add(mk(cal, M.caliper, '多活塞制动卡钳'));
    corner.add(brake);
    const sus = new THREE.Group(); sus.name = '双叉臂悬挂';
    const lb = v3(0, 0.17, tz - 0.15), ub = v3(0.0, 0.54, tz - 0.17);
    const arms = [
      cylGeo(lb, v3(0.21, 0.16, 0.36), 0.017), cylGeo(lb, v3(-0.21, 0.16, 0.36), 0.017),
      cylGeo(ub, v3(0.15, 0.55, 0.44), 0.015), cylGeo(ub, v3(-0.15, 0.55, 0.44), 0.015),
      cylGeo(v3(0.12, 0.30, tz - 0.16), v3(0.18, 0.28, 0.40), 0.01),
    ];
    sus.add(mk(merge(arms), M.arm, '上/下控制臂（双叉臂）'));
    sus.add(mk(cylGeo(lb, ub, 0.03, 14), M.aluCast, '转向节'));
    const hub = cylGeo(v3(0, DIM.wr, tz - 0.16), v3(0, DIM.wr, tz - 0.06), 0.07, 24); sus.add(mk(hub, M.aluCast, '轮毂轴承'));
    // 螺旋弹簧减振器
    const a = v3(-0.05, 0.20, tz - 0.25), b = v3(-0.07, 0.68, 0.47);
    sus.add(mk(cylGeo(a, b, 0.022, 16), M.damper, '减振器'));
    const dir = b.clone().sub(a), len = dir.length(); dir.normalize();
    const q = new THREE.Quaternion().setFromUnitVectors(v3(0, 1, 0), dir);
    const hel = []; for (let i = 0; i <= 160; i++) { const t = i / 160, an = t * Math.PI * 2 * 7; hel.push(v3(Math.cos(an) * 0.05, len * (0.22 + 0.58 * t), Math.sin(an) * 0.05).applyQuaternion(q).add(a)); }
    sus.add(mk(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(hel), 320, 0.009, 6), M.spring, '螺旋弹簧'));
    corner.add(sus);
    G.suspension.add(corner);
    addEx(wheel, v3(0, 0, 0.75)); addEx(brake, v3(0, 0, 0.45)); addEx(sus, v3(0, 0, 0.22));
    // 半轴/轮子标签分类
    wheel.userData.cat = 'suspension';
  }

  // ===== 分类标注 =====
  const catOf = { body: 'body', cockpit: 'cockpit', power: 'power', cooling: 'cooling', chassis: 'chassis', suspension: 'suspension' };
  for (const k in G) G[k].traverse(o => { if (o.isMesh) { o.userData.cat = catOf[k]; } });
  G.cooling.traverse(o => { if (o.isMesh && o.name.startsWith('燃油箱')) o.userData.cat = 'cooling'; });
  G.body.traverse(o => { if (o.isMesh) o.userData.shell = true; });
  // 外壳使用独立材质实例，便于淡出而不影响内部结构
  const shellMats = new Map();
  G.body.traverse(o => { if (o.isMesh) { if (!shellMats.has(o.material)) { const c = o.material.clone(); c.name = o.material.name; shellMats.set(o.material, c); } o.material = shellMats.get(o.material); } });
  root.traverse(o => { if (o.isMesh) { o.userData.origMat = o.material; } });

  const anchors = {
    body: v3(0.2, 1.42, 0), cockpit: v3(0.0, 1.0, -0.33), power: v3(-1.05, 1.05, 0),
    cooling: v3(1.95, 0.75, 0.3), chassis: v3(0.3, 0.45, 0.95), suspension: v3(DIM.axF, 0.9, 0.9),
  };
  return { root, G, explode, hinges, anchors, shellMats };
}
