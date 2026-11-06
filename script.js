// ===== CONFIGURAÇÃO =====
const PASTA = "fotos/";             // pasta das fotos
const EXTENSAO = ".jpg";            // fotos nomeadas 1.jpg, 2.jpg, 3.jpg...
const MAX_FOTOS = 500;              // limite de busca
const FOTOS_NO_CARROSSEL = 6;       // quantas fotos aleatórias vão no carrossel
const INICIO = new Date("2025-11-23T00:00:00-03:00"); // 23/11/2025, horário de Brasília

// ===== CARREGA AS FOTOS 1.jpg, 2.jpg, ... ATÉ NÃO ACHAR MAIS =====
function existe(src){
  return new Promise(ok => { const i = new Image(); i.onload = () => ok(true); i.onerror = () => ok(false); i.src = src; });
}
async function carregarFotos(){
  const lista = [];
  for (let n = 1; n <= MAX_FOTOS; n++){
    const src = PASTA + n + EXTENSAO;
    if (await existe(src)) lista.push(src); else break;
  }
  return lista;
}

// ===== GALERIA =====
const gal = document.getElementById("gal"), lb = document.getElementById("lb"), lbi = document.getElementById("lbi");
function montarGaleria(fotos){
  fotos.forEach(src => {
    const g = document.createElement("img");
    g.src = src; g.loading = "lazy"; g.alt = "";
    g.onclick = () => { lbi.src = src; lb.classList.add("on"); };
    gal.appendChild(g);
  });
  lb.onclick = () => lb.classList.remove("on");
}

// ===== CARROSSEL ALEATÓRIO =====
const car = document.getElementById("car"), dots = document.getElementById("dots");
let i = 0, t, S = [], B = [];
function embaralhar(a){ a = [...a]; for (let k = a.length - 1; k > 0; k--){ const j = Math.floor(Math.random() * (k + 1)); [a[k], a[j]] = [a[j], a[k]]; } return a; }
function montarCarrossel(fotos){
  embaralhar(fotos).slice(0, FOTOS_NO_CARROSSEL).forEach((src, k) => {
    const d = document.createElement("div");
    d.className = "slide" + (k ? "" : " on");
    d.innerHTML = '<img alt="">'; d.firstChild.src = src;
    car.insertBefore(d, dots);
    const b = document.createElement("b"); b.onclick = () => go(k); dots.appendChild(b);
  });
  S = car.querySelectorAll(".slide"); B = dots.children;
  if (!S.length) return;
  B[0].className = "on";
  t = setInterval(() => go(i + 1), 4500);
  car.querySelector(".prev").onclick = () => go(i - 1);
  car.querySelector(".next").onclick = () => go(i + 1);
}
function go(n){
  S[i].classList.remove("on"); B[i].className = "";
  i = (n + S.length) % S.length;
  S[i].classList.add("on"); B[i].className = "on";
  clearInterval(t); t = setInterval(() => go(i + 1), 4500);
}

// ===== CONTADOR =====
function tick(){
  const n = new Date();
  let m = (n.getFullYear() - INICIO.getFullYear()) * 12 + n.getMonth() - INICIO.getMonth();
  let a = new Date(INICIO); a.setMonth(a.getMonth() + m);
  if (a > n){ m--; a = new Date(INICIO); a.setMonth(a.getMonth() + m); }
  let r = Math.floor((n - a) / 1000);
  const dd = Math.floor(r / 86400); r %= 86400;
  document.getElementById("m").textContent = m;
  document.getElementById("d").textContent = dd;
  document.getElementById("h").textContent = Math.floor(r / 3600);
  document.getElementById("mi").textContent = Math.floor(r % 3600 / 60);
  document.getElementById("s").textContent = r % 60;
  document.getElementById("tot").textContent = "São " + Math.floor((n - INICIO) / 86400000).toLocaleString("pt-BR") + " dias de nós dois";
}
tick(); setInterval(tick, 1000);

// ===== INICIA =====
carregarFotos().then(fotos => { montarGaleria(fotos); montarCarrossel(fotos); });
