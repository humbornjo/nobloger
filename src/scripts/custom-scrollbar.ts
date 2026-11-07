interface ScrollMetrics {
  viewportSize: number;
  contentSize: number;
  position: number;
}

interface CustomScrollbarOptions {
  axis: "x" | "y";
  track: HTMLElement;
  thumb: HTMLElement;
  getMetrics: () => ScrollMetrics;
  scrollTo: (position: number) => void;
}

const MIN_THUMB_SIZE = 24;
const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export function createCustomScrollbar({
  axis,
  track,
  thumb,
  getMetrics,
  scrollTo,
}: CustomScrollbarOptions) {
  const horizontal = axis === "x";
  let dragging = false;
  let activePointerId: number | undefined;
  let dragStartPointer = 0;
  let dragStartScroll = 0;

  const pointerPosition = (event: PointerEvent) =>
    horizontal ? event.clientX : event.clientY;

  const geometry = () => {
    const { viewportSize, contentSize, position } = getMetrics();
    const trackSize = horizontal ? track.clientWidth : track.clientHeight;
    const maxScroll = Math.max(0, contentSize - viewportSize);
    const thumbSize = Math.min(
      trackSize,
      Math.max(
        MIN_THUMB_SIZE,
        contentSize > 0 ? (viewportSize / contentSize) * trackSize : 0,
      ),
    );

    return {
      position,
      trackSize,
      maxScroll,
      thumbSize,
      maxThumb: Math.max(0, trackSize - thumbSize),
    };
  };

  const update = () => {
    const { position, trackSize, maxScroll, thumbSize, maxThumb } = geometry();
    track.hidden = maxScroll <= 1 || trackSize <= 0;
    if (track.hidden) return;

    const offset =
      maxScroll > 0 ? clamp(position / maxScroll, 0, 1) * maxThumb : 0;
    if (horizontal) {
      thumb.style.width = `${thumbSize}px`;
      thumb.style.transform = `translateX(${offset}px)`;
    } else {
      thumb.style.height = `${thumbSize}px`;
      thumb.style.transform = `translateY(${offset}px)`;
    }
  };

  track.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || dragging) return;

    update();
    const { trackSize, maxScroll, thumbSize, maxThumb } = geometry();
    if (track.hidden || trackSize <= 0 || maxThumb <= 0) return;

    event.preventDefault();
    dragging = true;
    activePointerId = event.pointerId;
    dragStartPointer = pointerPosition(event);
    dragStartScroll = getMetrics().position;
    track.dataset.dragging = "true";
    track.setPointerCapture(event.pointerId);

    if (event.target !== thumb) {
      const rect = track.getBoundingClientRect();
      const trackOrigin = horizontal ? rect.left : rect.top;
      const thumbOffset = clamp(
        pointerPosition(event) - trackOrigin - thumbSize / 2,
        0,
        maxThumb,
      );
      scrollTo((thumbOffset / maxThumb) * maxScroll);
      dragStartScroll = getMetrics().position;
      update();
    }
  });

  track.addEventListener("pointermove", (event) => {
    if (!dragging || event.pointerId !== activePointerId) return;

    const { maxScroll, maxThumb } = geometry();
    if (maxScroll <= 1 || maxThumb <= 0) return;

    const delta = pointerPosition(event) - dragStartPointer;
    scrollTo(dragStartScroll + (delta / maxThumb) * maxScroll);
    update();
  });

  const finishDrag = (event: PointerEvent) => {
    if (!dragging || event.pointerId !== activePointerId) return;

    dragging = false;
    activePointerId = undefined;
    delete track.dataset.dragging;
    if (track.hasPointerCapture(event.pointerId)) {
      track.releasePointerCapture(event.pointerId);
    }
  };

  track.addEventListener("pointerup", finishDrag);
  track.addEventListener("pointercancel", finishDrag);
  track.addEventListener("lostpointercapture", finishDrag);
  update();

  return { update };
}
