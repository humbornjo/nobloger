<script lang="ts">
  import CodeRounded from "@icons/material-symbols/code-rounded";
  import RssFeedRounded from "@icons/material-symbols/rss-feed-rounded";

  interface Props {
    rssUrl: string;
  }

  let { rssUrl }: Props = $props();
</script>

<nav class="footer-nav" aria-label="Footer">
  <a class="footer-link" href="https://github.com/humbornjo/nobloger">
    <span class="footer-link__icon" aria-hidden="true">
      <CodeRounded />
    </span>
    <span>Source</span>
  </a>
  <a class="footer-link" href={rssUrl}>
    <span class="footer-link__icon" aria-hidden="true">
      <RssFeedRounded />
    </span>
    <span>RSS</span>
  </a>
</nav>

<style>
  .footer-nav {
    display: flex;
    align-items: center;
    gap: 1.25rem;
  }

  .footer-link {
    display: inline-flex;
    min-height: 2.25rem;
    align-items: center;
    gap: 0.375rem;
    color: var(--muted-foreground);
    font-family: var(--font-ui);
    font-size: 0.8125rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    line-height: 1;
    text-decoration: none;
  }

  .footer-link__icon {
    display: inline-flex;
    width: 0.9375rem;
    height: 0.9375rem;
    align-items: center;
    justify-content: center;
    color: var(--primary);
  }

  .footer-link__icon :global(svg) {
    width: 100%;
    height: 100%;
  }

  @media (hover: hover) {
    .footer-link:hover {
      color: var(--foreground);
    }
  }
</style>
