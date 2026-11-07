import { createCustomScrollbar } from "./custom-scrollbar";

const root = document.documentElement;
const bar = document.createElement("div");
bar.className = "page-scrollbar";
bar.setAttribute("aria-hidden", "true");

const thumb = document.createElement("div");
thumb.className = "page-scrollbar__thumb";
bar.append(thumb);
document.body.append(bar);

const { update } = createCustomScrollbar({
  axis: "y",
  track: bar,
  thumb,
  getMetrics: () => ({
    viewportSize: window.innerHeight,
    contentSize: root.scrollHeight,
    position: window.scrollY,
  }),
  scrollTo: (position) => window.scrollTo(0, position),
});

window.addEventListener("scroll", update, { passive: true });
window.addEventListener("resize", update);

const resizeObserver = new ResizeObserver(update);
resizeObserver.observe(document.body);
void document.fonts.ready.then(update);

root.dataset.customScrollbar = "true";
update();
