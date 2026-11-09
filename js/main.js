import * as THREE from 'three';
import { OrbitControls } from 'three/addons/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/RoomEnvironment.js';
import { Reflector } from 'three/addons/Reflector.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/CSS2DRenderer.js';
import { GLTFExporter } from 'three/addons/GLTFExporter.js';
import { makeMaterials, buildCar } from './car.js';
import { shadowTex } from './tex.js';
import { CATS, ICONS } from './data.js';

const $ = s => document.querySelector(s);
const params = new URLSearchParams(location.search);
const QA = params.has('qa');

function hasWebGL() { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } }
if (!hasWebGL()) { $('#nogl').hidden = false; $('#loading').classList.add('done'); throw new Error('WebGL unavailable'); }

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: QA });
} catch (e) { $('#nogl').hidden = false; $('#loading').classList.add('done'); throw e; }
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.outputColorSpace = THREE.SRGBColorSpace;
$('#stage').appendChild(renderer.domElement);

const labelRenderer = new CSS2DRenderer({ element: $('#labels') });
labelRenderer.setSize(innerWidth, innerHeight);

const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
const envTex = pmrem.fromScene(new RoomEnvironment(), 0.035).texture;
scene.environment = envTex;

const camera = new THREE.PerspectiveCamera(30, innerWidth / innerHeight, 0.05, 80);
const HOME = { pos: new THREE.Vector3(5.35, 1.9, 5.85), target: new THREE.Vector3(0, 0.52, 0) };
camera.position.copy(HOME.pos);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.copy(HOME.target); controls.enableDamping = true; controls.dampingFactor = 0.08;
controls.minDistance = 1.6; controls.maxDistance = 16; controls.maxPolarAngle = Math.PI * 0.495; controls.autoRotateSpeed = 0.9;
controls.update();

// 展台
const stage = new THREE.Group(); scene.add(stage);
const R = 4.8;
const mirror = new Reflector(new THREE.CircleGeometry(R, 96), { clipBias: 0.003, textureWidth: Math.min(innerWidth * renderer.getPixelRatio(), 2048) * 0.6, textureHeight: Math.min(innerHeight * renderer.getPixelRatio(), 1400) * 0.6, color: 0x8a8e94 });
mirror.rotation.x = -Math.PI / 2; mirror.position.y = 0.0; stage.add(mirror);
const floorTint = new THREE.Mesh(new THREE.CircleGeometry(R, 96), new THREE.MeshStandardMaterial({ color: 0x07080a, roughness: 0.35, metalness: 0.2, transparent: true, opacity: 0.78 }));
floorTint.rotation.x = -Math.PI / 2; floorTint.position.y = 0.002; stage.add(floorTint);
const rimRing = new THREE.Mesh(new THREE.TorusGeometry(R, 0.05, 12, 160), new THREE.MeshStandardMaterial({ color: 0xf2f3f5, metalness: 0.3, roughness: 0.3 }));
rimRing.rotation.x = -Math.PI / 2; rimRing.position.y = 0.01; stage.add(rimRing);
const plinth = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.05, R + 0.25, 0.16, 120, 1, true), new THREE.MeshStandardMaterial({ color: 0xe9ebee, roughness: 0.5, side: THREE.DoubleSide }));
plinth.position.y = -0.07; stage.add(plinth);
const contact = new THREE.Mesh(new THREE.PlaneGeometry(5.6, 2.6), new THREE.MeshBasicMaterial({ map: shadowTex(), transparent: true, opacity: 0.9, depthWrite: false }));
contact.rotation.x = -Math.PI / 2; contact.position.y = 0.004; stage.add(contact);

// 灯光
const hemi = new THREE.HemisphereLight(0xffffff, 0x30343a, 0.5); scene.add(hemi);
const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(4, 7, 5); scene.add(key);
const rim = new THREE.DirectionalLight(0xdfe8ff, 0.9); rim.position.set(-6, 4, -4); scene.add(rim);
const spot = new THREE.SpotLight(0xffffff, 0, 30, 0.55, 0.6, 1.2); spot.position.set(0, 9, 2); spot.target.position.set(0, 0, 0); scene.add(spot, spot.target);

const M = makeMaterials();
let car = null;
const state = { vis: 1, visT: 1, ex: 0, exT: 0, doors: 0, doorsT: 0, lids: 0, lidsT: 0, mode: 'orig', sel: null, selMesh: null, labels: false, dark: false, cardOpen: false };
const tween = { active: false };

// ---------- UI 构建 ----------
const navList = $('#navList');
CATS.forEach(c => {
  const li = document.createElement('li');
  li.innerHTML = `<button data-k="${c.key}"><span class="ic"><svg viewBox="0 0 24 24">${ICONS[c.icon]}</svg></span><span class="t"><small>${c.no}</small><span>${c.name}</span></span><span class="arr">›</span></button>`;
  navList.appendChild(li);
});
navList.addEventListener('click', e => { const b = e.target.closest('button'); if (b) select(b.dataset.k, null, true); });

function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), 2200); }

function setRange(el, v) { el.value = v; el.style.setProperty('--p', v + '%'); }
const visRange = $('#visRange'), exRange = $('#exRange');
visRange.addEventListener('input', () => setVis(visRange.value / 100));
exRange.addEventListener('input', () => setExplode(exRange.value / 100));
document.querySelectorAll('[data-vis]').forEach(b => b.onclick = () => setVis(+b.dataset.vis / 100));
document.querySelectorAll('.ends [data-ex]').forEach(b => b.onclick = () => setExplode(+b.dataset.ex / 100));
document.querySelectorAll('#segExplode button').forEach(b => b.onclick = () => setExplode(+b.dataset.v));
document.querySelectorAll('#matModes button').forEach(b => b.onclick = () => setMode(b.dataset.m));
$('#tgDoors').onchange = e => { state.doorsT = e.target.checked ? 1 : 0; };
$('#tgLids').onchange = e => { state.lidsT = e.target.checked ? 1 : 0; };
$('#btnLight').onclick = () => setTheme(!state.dark);
$('#btnLabels').onclick = () => setLabels(!state.labels);
$('#btnRotate').onclick = () => { controls.autoRotate = !controls.autoRotate; $('#btnRotate').classList.toggle('on', controls.autoRotate); toast(controls.autoRotate ? '自动旋转：开' : '自动旋转：关'); };
$('#zIn').onclick = () => dolly(0.82); $('#zOut').onclick = () => dolly(1.22);
$('#btnReset').onclick = reset;
$('#btnFull').onclick = () => { if (!document.fullscreenElement) document.documentElement.requestFullscreen?.(); else document.exitFullscreen?.(); };
document.addEventListener('fullscreenchange', () => { $('#btnFull span').textContent = document.fullscreenElement ? '退出全屏' : '全屏显示'; });
$('#btnDownload').onclick = downloadGLB;
$('#cardClose').onclick = $('#cardHide').onclick = () => showCard(false);
$('#cardOpen').onclick = () => showCard(true);
$('#cardFocus').onclick = () => { if (state.sel) focusCat(state.sel, true); };
document.querySelectorAll('#swatches button').forEach(b => b.onclick = () => {
  document.querySelectorAll('#swatches button').forEach(x => x.classList.toggle('on', x === b));
  car.shellMats.get(M.paint).color.set(b.dataset.c); M.paint.color.set(b.dataset.c);
  $('#heroEyebrow').textContent = `${b.dataset.n} / CARBON · R8 V10`;
  applyMaterials();
});

function setVis(v) { state.visT = v; setRange(visRange, Math.round(v * 100)); $('#visVal').textContent = Math.round(v * 100) + '%'; }
function setExplode(v) {
  state.exT = v; setRange(exRange, Math.round(v * 100)); $('#exVal').textContent = Math.round(v * 100) + '%';
  document.querySelectorAll('#segExplode button').forEach(b => b.classList.toggle('on', (+b.dataset.v === 1) === (v > 0.5)));
}
function setMode(m) { state.mode = m; document.querySelectorAll('#matModes button').forEach(b => b.classList.toggle('on', b.dataset.m === m)); applyMaterials(); }
function setTheme(dark) {
  state.dark = dark; document.body.classList.toggle('theme-dark', dark); document.body.classList.toggle('theme-light', !dark);
  $('#btnLight').classList.toggle('on', dark);
  scene.environmentIntensity = dark ? 0.45 : 1.0;
  hemi.intensity = dark ? 0.12 : 0.5; key.intensity = dark ? 0.5 : 1.6; rim.intensity = dark ? 1.6 : 0.9; spot.intensity = dark ? 90 : 0;
  plinth.material.color.set(dark ? 0x1c1f23 : 0xe9ebee); rimRing.material.color.set(dark ? 0xe1071c : 0xf2f3f5);
  rimRing.material.emissive.set(dark ? 0x6a0010 : 0x000000);
  toast(dark ? '展厅灯光：夜间聚光' : '展厅灯光：明亮展厅');
}
function dolly(f) { const off = camera.position.clone().sub(controls.target).multiplyScalar(f); const d = THREE.MathUtils.clamp(off.length(), controls.minDistance, controls.maxDistance); off.setLength(d); animateCam(controls.target.clone().add(off), controls.target.clone(), 450); }

// ---------- 标注 ----------
const labelGroup = new THREE.Group(); scene.add(labelGroup);
function buildLabels() {
  CATS.forEach(c => {
    const el = document.createElement('div'); el.className = 'lbl'; el.innerHTML = `<b>${c.no}</b>${c.name}`; el.dataset.k = c.key;
    el.addEventListener('pointerdown', e => { e.stopPropagation(); select(c.key, null, true); });
    const o = new CSS2DObject(el); o.position.copy(car.anchors[c.key]); o.userData.k = c.key; labelGroup.add(o);
  });
  labelGroup.visible = false;
}
function setLabels(on) { state.labels = on; labelGroup.visible = on; labelGroup.children.forEach(o => o.element.style.display = on ? '' : 'none'); $('#btnLabels').classList.toggle('on', on); }

// ---------- 材质系统 ----------
const clay = new THREE.MeshStandardMaterial({ name: 'Clay', color: 0xeeeeec, roughness: 0.62, metalness: 0.0 });
const clayShell = clay.clone(); clayShell.side = THREE.DoubleSide;
const clayGlass = new THREE.MeshStandardMaterial({ color: 0xcfd6de, roughness: 0.2, transparent: true, opacity: 0.35, depthWrite: false, side: THREE.DoubleSide });
const wireCols = { body: 0x1f5fd6, cockpit: 0x8a5cd6, power: 0xe1071c, cooling: 0x1aa39a, chassis: 0x6c737c, suspension: 0xe08a12 };
const wireMats = {}; for (const k in wireCols) wireMats[k] = new THREE.MeshBasicMaterial({ color: wireCols[k], wireframe: true, transparent: true, opacity: 0.55 });
const hlCache = new Map();
function hl(base) {
  let h = hlCache.get(base);
  if (!h) { if (!baseOpacity.has(base)) baseOpacity.set(base, { op: base.opacity, tr: base.transparent, dw: base.depthWrite }); h = base.clone(); baseOpacity.set(h, baseOpacity.get(base)); if (h.isMeshBasicMaterial) { h.color.set(0xff1d34); h.opacity = 1; } else { h.emissive = new THREE.Color(0xff2036); h.emissiveIntensity = 0.55; h.emissiveMap = null; } hlCache.set(base, h); }
  return h;
}
const baseOpacity = new WeakMap();
function baseFor(o) {
  const orig = o.userData.origMat;
  if (state.mode === 'clay') return o.userData.shell ? (orig.transparent ? clayGlass : clayShell) : clay;
  if (state.mode === 'wire') return o.userData.shell ? wireMats.body : (wireMats[o.userData.cat] || wireMats.chassis);
  return orig;
}
function applyMaterials() {
  if (!car) return;
  car.root.traverse(o => {
    if (!o.isMesh) return;
    const base = baseFor(o);
    let on = false;
    if (state.selMesh) on = o.userData.cat === state.selMesh.userData.cat && o.userData.label === state.selMesh.userData.label;
    else if (state.sel && state.sel !== 'body') on = o.userData.cat === state.sel;
    o.material = on ? hl(base) : base;
  });
  applyOpacity();
}
function applyOpacity() {
  const v = state.vis; const seen = new Set();
  car.root.traverse(o => {
    if (!o.isMesh || !o.userData.shell) return;
    o.visible = v > 0.01;
    const m = o.material; if (seen.has(m)) return; seen.add(m);
    if (!baseOpacity.has(m)) baseOpacity.set(m, { op: m.opacity, tr: m.transparent, dw: m.depthWrite });
    const b = baseOpacity.get(m);
    const wantT = b.tr || v < 0.999;
    if (m.transparent !== wantT) m.needsUpdate = true;
    m.transparent = wantT; m.opacity = b.op * (b.tr ? Math.max(v, 0.0) : v); m.depthWrite = !wantT ? b.dw : false;
  });
}

// ---------- 选择 / 聚焦 ----------
function select(k, mesh, focus) {
  state.sel = k; state.selMesh = mesh || null;
  document.querySelectorAll('#navList button').forEach(b => b.classList.toggle('on', b.dataset.k === k));
  labelGroup.children.forEach(o => o.element.classList.toggle('on', o.userData.k === k));
  const c = CATS.find(c => c.key === k);
  if (c) {
    $('#cardEn').textContent = c.en; $('#cardTitle').textContent = c.title; $('#cardDesc').textContent = c.desc;
    $('#cardTags').innerHTML = c.tags.map(t => `<span>${t}</span>`).join('');
    $('#cardPart').textContent = mesh && mesh.userData.label ? `已选部件：${mesh.userData.label}` : '结构示意 · 点击模型部件可查看名称';
    showCard(true);
    if (focus) focusCat(k, true);
  } else showCard(false);
  applyMaterials();
}
function showCard(on) {
  state.cardOpen = on; $('#card').hidden = !on; $('#cardOpen').hidden = on || !state.sel;
  if (on) { $('#card').style.animation = 'none'; void $('#card').offsetWidth; $('#card').style.animation = ''; }
}
function focusCat(k, fade) {
  const c = CATS.find(c => c.key === k); if (!c) return;
  if (fade && c.fade !== undefined && state.visT > 0.5) setVis(c.fade);
  if (fade && k === 'body' && state.visT < 0.5) setVis(1);
  if (k === 'body') { animateCam(HOME.pos.clone(), HOME.target.clone(), 1100); return; }
  const center = new THREE.Vector3(...c.target);
  const dir = new THREE.Vector3(...c.dir).normalize();
  animateCam(center.clone().addScaledVector(dir, c.dist), center, 1100);
}
function animateCam(pos, target, ms) {
  tween.active = true; tween.t0 = performance.now(); tween.ms = ms;
  tween.p0 = camera.position.clone(); tween.q0 = controls.target.clone(); tween.p1 = pos; tween.q1 = target;
}
const ray = new THREE.Raycaster(); const ndc = new THREE.Vector2(); let downAt = null;
renderer.domElement.addEventListener('pointerdown', e => { downAt = [e.clientX, e.clientY]; });
renderer.domElement.addEventListener('pointerup', e => {
  if (!downAt || Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) > 5) return;
  const hit = pick(e); if (hit) select(hit.userData.cat, hit, false);
});
renderer.domElement.addEventListener('pointermove', e => { if (e.buttons) return; renderer.domElement.style.cursor = pick(e) ? 'pointer' : 'grab'; });
function pick(e) {
  if (!car) return null;
  ndc.set(e.clientX / innerWidth * 2 - 1, -e.clientY / innerHeight * 2 + 1); ray.setFromCamera(ndc, camera);
  const hits = ray.intersectObject(car.root, true);
  for (const h of hits) {
    const o = h.object; if (!o.visible) continue;
    let vis = true; for (let p = o; p; p = p.parent) if (!p.visible) vis = false; if (!vis) continue;
    if (o.userData.shell && (state.vis < 0.35 || (o.userData.origMat && o.userData.origMat.transparent && state.vis < 0.999))) continue;
    if (o.userData.origMat && o.userData.origMat.name && o.userData.origMat.name.startsWith('Glass') && state.vis >= 0.999) { /* 玻璃后方的部件 */ continue; }
    return o;
  }
  return null;
}

function reset() {
  setVis(1); setExplode(0); setMode('orig');
  $('#tgDoors').checked = false; $('#tgLids').checked = false; state.doorsT = 0; state.lidsT = 0;
  state.sel = null; state.selMesh = null; showCard(false); $('#cardOpen').hidden = true;
  document.querySelectorAll('#navList button').forEach(b => b.classList.remove('on'));
  controls.autoRotate = false; $('#btnRotate').classList.remove('on');
  animateCam(HOME.pos.clone(), HOME.target.clone(), 900); applyMaterials(); toast('已重置模型');
}

// ---------- 导出 GLB ----------
function downloadGLB() {
  if (!car) return;
  toast('正在导出 GLB…');
  const prev = { mode: state.mode, sel: state.sel, selMesh: state.selMesh, vis: state.vis };
  state.mode = 'orig'; state.sel = null; state.selMesh = null; state.vis = 1; applyMaterials();
  car.root.traverse(o => { if (o.isMesh) o.visible = true; });
  new GLTFExporter().parse(car.root, res => {
    const blob = new Blob([res], { type: 'model/gltf-binary' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'audi-r8-structure-schematic.glb'; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    Object.assign(state, prev); applyMaterials(); toast(`已导出 GLB（${(blob.size / 1048576).toFixed(1)} MB）`);
  }, err => { Object.assign(state, prev); applyMaterials(); toast('导出失败：' + err.message); }, { binary: true });
}

// ---------- 主循环 ----------
const clock = new THREE.Clock();
function approach(cur, tgt, dt, k = 5) { return cur + (tgt - cur) * (1 - Math.exp(-k * dt)); }
function tick() {
  const dt = Math.min(clock.getDelta(), 0.05);
  if (car) {
    const nv = approach(state.vis, state.visT, dt, 7); if (Math.abs(nv - state.vis) > 1e-4 || state.vis !== state.visT) { state.vis = Math.abs(nv - state.visT) < 0.002 ? state.visT : nv; applyOpacity(); }
    state.ex = approach(state.ex, state.exT, dt, 4); state.doors = approach(state.doors, state.doorsT, dt, 3.2); state.lids = approach(state.lids, state.lidsT, dt, 3.2);
    for (const e of car.explode) e.obj.position.copy(e.base).addScaledVector(e.dir, state.ex);
    for (const d of car.hinges.doors) d.obj.quaternion.setFromAxisAngle(d.axis, d.max * state.doors);
    for (const d of car.hinges.lids) d.obj.quaternion.setFromAxisAngle(d.axis, d.max * state.lids);
  }
  if (tween.active) {
    let t = (performance.now() - tween.t0) / tween.ms; if (t >= 1) { t = 1; tween.active = false; }
    const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    camera.position.lerpVectors(tween.p0, tween.p1, e); controls.target.lerpVectors(tween.q0, tween.q1, e);
  }
  controls.update();
  renderer.render(scene, camera); labelRenderer.render(scene, camera);
}
function snap() { if (car) { state.vis = state.visT; applyOpacity(); } state.vis = state.visT; state.ex = state.exT; state.doors = state.doorsT; state.lids = state.lidsT; if (tween.active) { tween.t0 = -1e9; } }

addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); labelRenderer.setSize(innerWidth, innerHeight); });

// ---------- 启动 ----------
requestAnimationFrame(() => setTimeout(() => {
  try {
    car = buildCar(M); scene.add(car.root); buildLabels(); setLabels(false); applyMaterials();
  } catch (e) { console.error(e); $('#loading p').textContent = '模型组装失败：' + e.message; return; }
  renderer.setAnimationLoop(tick);
  setTimeout(() => $('#loading').classList.add('done'), 300);
  window.__r8 = { setVis, setExplode, setMode, setTheme, setLabels, select, showCard, focusCat, snap, reset, tick, state, camera, controls, car,
    doors: v => { $('#tgDoors').checked = !!v; state.doorsT = v ? 1 : 0; }, lids: v => { $('#tgLids').checked = !!v; state.lidsT = v ? 1 : 0; },
    cam: (p, t) => { tween.active = false; camera.position.set(...p); controls.target.set(...t); controls.update(); }, ready: true, exportGLB: () => new Promise((res, rej) => new GLTFExporter().parse(car.root, r => res(r.byteLength), rej, { binary: true })) };
}, 30));
