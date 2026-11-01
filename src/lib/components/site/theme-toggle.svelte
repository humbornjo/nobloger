<script lang="ts">
  import { onMount, tick } from "svelte";
  import Moon from "@icons/lucide/moon";
  import Sun from "@icons/lucide/sun";
  import { Button } from "$lib/components/ui/button";

  type ResolvedTheme = "light" | "dark";

  let theme = $state<ResolvedTheme>("light");
  let nextTheme = $derived<ResolvedTheme>(theme === "dark" ? "light" : "dark");
  let transitionRunning = false;

  function applyTheme(selectedTheme: ResolvedTheme) {
    document.documentElement.setAttribute("data-theme", selectedTheme);

    try {
      localStorage.setItem("theme", selectedTheme);
    } catch {
      // The selected theme still applies when storage is unavailable.
    }

    theme = selectedTheme;
  }

  function finishThemeTransition() {
    const root = document.documentElement;
    root.removeAttribute("data-theme-switching");
    root.style.removeProperty("--theme-transition-x");
    root.style.removeProperty("--theme-transition-y");
    root.style.removeProperty("--theme-transition-radius");
    transitionRunning = false;
  }

  async function toggleTheme(event: MouseEvent) {
    if (transitionRunning) return;

    const root = document.documentElement;
    const selectedTheme = nextTheme;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!document.startViewTransition || reducedMotion) {
      root.setAttribute("data-theme-switching", "");
      applyTheme(selectedTheme);
      void root.offsetWidth;
      requestAnimationFrame(finishThemeTransition);
      return;
    }

    const button = event.currentTarget as HTMLButtonElement;
    const rect = button.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    root.style.setProperty("--theme-transition-x", `${x}px`);
    root.style.setProperty("--theme-transition-y", `${y}px`);
    root.style.setProperty("--theme-transition-radius", `${radius}px`);
    root.setAttribute("data-theme-switching", "");
    transitionRunning = true;

    const transition = document.startViewTransition(async () => {
      applyTheme(selectedTheme);
      await tick();
    });

    void transition.finished.then(
      finishThemeTransition,
      finishThemeTransition,
    );
  }

  onMount(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const syncTheme = () => {
      const explicitTheme = document.documentElement.dataset.theme;
      theme =
        explicitTheme === "light" || explicitTheme === "dark"
          ? explicitTheme
          : media.matches
            ? "dark"
            : "light";
    };

    syncTheme();
    media.addEventListener("change", syncTheme);
    return () => media.removeEventListener("change", syncTheme);
  });
</script>

<Button
  id="theme-toggle"
  variant="ghost"
  size="icon-lg"
  class="size-[36px] text-muted-foreground hover:bg-transparent hover:text-muted-foreground hover:shadow-none sm:size-7 dark:hover:bg-transparent"
  aria-label={`Switch to ${nextTheme} theme`}
  title={`Switch to ${nextTheme} theme`}
  onclick={toggleTheme}
>
  <span class="theme-toggle__icon theme-toggle__icon--sun" aria-hidden="true">
    <Sun
      class="motion-safe:transition-transform motion-safe:group-hover/button:rotate-[30deg]"
      strokeWidth={1.5}
    />
  </span>
  <span class="theme-toggle__icon theme-toggle__icon--moon" aria-hidden="true">
    <Moon
      class="motion-safe:transition-transform motion-safe:group-hover/button:-rotate-[18deg]"
      strokeWidth={1.5}
    />
  </span>
</Button>
