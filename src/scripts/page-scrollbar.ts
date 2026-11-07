export {};

const root = document.documentElement;
const bar = document.createElement("div");
bar.className = "page-scrollbar";
bar.setAttribute("aria-hidden", "true");

const thumb = document.createElement("div");
thumb.className = "page-scrollbar__thumb";
bar.append(thumb);
document.body.append(bar);
root.dataset.customScrollbar = "true";

let dragging = false;
let dragStartY = 0;
let dragStartScroll = 0;

function metrics() {
  const viewport = window.innerHeight;
  const scrollHeight = root.scrollHeight;
  const maxScroll = scrollHeight - viewport;
  const trackHeight = viewport;
  const thumbHeight = Math.max(24, (viewport / scrollHeight) * trackHeight);
  const maxThumb = trackHeight - thumbHeight;
  return { maxScroll, thumbHeight, maxThumb };
}

function update() {
  const { maxScroll, thumbHeight, maxThumb } = metrics();
  bar.hidden = maxScroll <= 1;
  if (bar.hidden) return;

  thumb.style.height = `${thumbHeight}px`;
  const top = (window.scrollY / maxScroll) * maxThumb;
  thumb.style.transform = `translateY(${top}px)`;
}

bar.addEventListener("pointerdown", (event) => {
  const { maxScroll, maxThumb, thumbHeight } = metrics();
  if (maxScroll <= 1) return;

  event.preventDefault();
  dragging = true;
  dragStartY = event.clientY;
  dragStartScroll = window.scrollY;
  bar.setPointerCapture(event.pointerId);

  if (event.target !== thumb) {
    const rect = bar.getBoundingClientRect();
    const y = Math.min(
      Math.max(event.clientY - rect.top - thumbHeight / 2, 0),
      maxThumb,
    );
    window.scrollTo(0, (y / maxThumb) * maxScroll);
    dragStartY = event.clientY;
    dragStartScroll = window.scrollY;
  }
});

bar.addEventListener("pointermove", (event) => {
  if (!dragging) return;
  const { maxScroll, maxThumb } = metrics();
  if (maxScroll <= 1 || maxThumb <= 0) return;

  const delta = event.clientY - dragStartY;
  window.scrollTo(0, dragStartScroll + (delta / maxThumb) * maxScroll);
  update();
});

function finishDrag(event: PointerEvent) {
  if (!dragging) return;
  dragging = false;
  if (bar.hasPointerCapture(event.pointerId)) {
    bar.releasePointerCapture(event.pointerId);
  }
}

bar.addEventListener("pointerup", finishDrag);
bar.addEventListener("pointercancel", finishDrag);
window.addEventListener("scroll", update, { passive: true });
window.addEventListener("resize", update);

const resizeObserver = new ResizeObserver(update);
resizeObserver.observe(document.body);
void document.fonts.ready.then(update);
update();
