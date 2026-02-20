import * as pdfjsLib from "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.min.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.worker.min.mjs";

const pdfUrl = "../assets/normal-vr-case-study.pdf";

const canvas = document.getElementById("slideCanvas");
const canvasWrap = document.getElementById("canvasWrap");
const ctx = canvas.getContext("2d");
const statusEl = document.getElementById("status");
const progressEl = document.getElementById("progress");
const thumbsEl = document.getElementById("thumbs");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const fitBtn = document.getElementById("fitBtn");
const zoomInBtn = document.getElementById("zoomInBtn");
const zoomOutBtn = document.getElementById("zoomOutBtn");

let pdfDoc = null;
let pageNum = 1;
let zoom = 1.2;
let fitToWidth = false;
let rendering = false;
let pendingPage = null;

function updateStatus() {
  statusEl.textContent = `Slide ${pageNum} of ${pdfDoc?.numPages ?? "-"}`;
  const progress = pdfDoc ? (pageNum / pdfDoc.numPages) * 100 : 0;
  progressEl.style.width = `${progress}%`;
}

function setThumbActive() {
  document.querySelectorAll(".thumb-btn").forEach((btn) => {
    const isActive = Number(btn.dataset.page) === pageNum;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-current", isActive ? "page" : "false");
  });
}

function getScale(page) {
  if (!fitToWidth) {
    return zoom;
  }
  const raw = page.getViewport({ scale: 1 });
  const available = Math.max(320, canvasWrap.clientWidth - 40);
  return available / raw.width;
}

async function renderPage(num) {
  if (!pdfDoc) return;
  rendering = true;

  const page = await pdfDoc.getPage(num);
  const scale = getScale(page);
  const viewport = page.getViewport({ scale });

  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.floor(viewport.width * dpr);
  canvas.height = Math.floor(viewport.height * dpr);
  canvas.style.width = `${Math.floor(viewport.width)}px`;
  canvas.style.height = `${Math.floor(viewport.height)}px`;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  await page.render({ canvasContext: ctx, viewport }).promise;

  rendering = false;
  updateStatus();
  setThumbActive();

  if (pendingPage) {
    const next = pendingPage;
    pendingPage = null;
    renderPage(next);
  }
}

function queueRender(num) {
  if (rendering) {
    pendingPage = num;
    return;
  }
  renderPage(num);
}

function goToPage(num) {
  if (!pdfDoc) return;
  if (num < 1 || num > pdfDoc.numPages) return;
  pageNum = num;
  queueRender(pageNum);
}

async function makeThumb(pageNumber) {
  const page = await pdfDoc.getPage(pageNumber);
  const viewport = page.getViewport({ scale: 0.2 });
  const thumbCanvas = document.createElement("canvas");
  const thumbCtx = thumbCanvas.getContext("2d");
  thumbCanvas.width = viewport.width;
  thumbCanvas.height = viewport.height;

  await page.render({ canvasContext: thumbCtx, viewport }).promise;

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "thumb-btn";
  btn.dataset.page = String(pageNumber);

  const label = document.createElement("span");
  label.textContent = `Slide ${pageNumber}`;

  btn.appendChild(thumbCanvas);
  btn.appendChild(label);
  btn.addEventListener("click", () => goToPage(pageNumber));

  thumbsEl.appendChild(btn);
}

async function buildThumbs() {
  thumbsEl.innerHTML = "";
  for (let i = 1; i <= pdfDoc.numPages; i += 1) {
    await makeThumb(i);
  }
  setThumbActive();
}

prevBtn.addEventListener("click", () => goToPage(pageNum - 1));
nextBtn.addEventListener("click", () => goToPage(pageNum + 1));
fitBtn.addEventListener("click", () => {
  fitToWidth = !fitToWidth;
  fitBtn.textContent = fitToWidth ? "Fixed Zoom" : "Fit Width";
  queueRender(pageNum);
});
zoomInBtn.addEventListener("click", () => {
  fitToWidth = false;
  zoom = Math.min(zoom + 0.15, 3);
  queueRender(pageNum);
});
zoomOutBtn.addEventListener("click", () => {
  fitToWidth = false;
  zoom = Math.max(zoom - 0.15, 0.5);
  queueRender(pageNum);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") goToPage(pageNum + 1);
  if (event.key === "ArrowLeft") goToPage(pageNum - 1);
});

window.addEventListener("resize", () => {
  if (fitToWidth) queueRender(pageNum);
});

async function init() {
  statusEl.textContent = "Loading PDF...";
  pdfDoc = await pdfjsLib.getDocument(pdfUrl).promise;
  await buildThumbs();
  await renderPage(pageNum);
}

init().catch((error) => {
  statusEl.textContent = "Unable to load PDF.";
  console.error(error);
});
