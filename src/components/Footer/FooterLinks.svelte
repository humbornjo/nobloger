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
