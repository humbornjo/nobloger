import type { Attachment } from "svelte/attachments";

export const scrollFade: Attachment<HTMLElement> = (element) => {
  const update = () => {
    const canScroll = element.scrollHeight > element.clientHeight + 1;
    element.dataset.overflowTop = String(canScroll && element.scrollTop > 1);
    element.dataset.overflowBottom = String(
      canScroll &&
        element.scrollTop + element.clientHeight < element.scrollHeight - 1,
    );
  };

  const resizeObserver = new ResizeObserver(update);
  resizeObserver.observe(element);
  for (const child of element.children) resizeObserver.observe(child);

  element.addEventListener("scroll", update, { passive: true });
  update();

  return () => {
    resizeObserver.disconnect();
    element.removeEventListener("scroll", update);
  };
};
