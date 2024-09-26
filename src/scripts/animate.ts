let ctx: NodeJS.Timeout;
const sbox = document.getElementById("search") as HTMLInputElement;

if (sbox !== null) {
  const posts = JSON.parse(sbox.dataset.posts ?? "");
  sbox?.addEventListener("input", () => {
    clearTimeout(ctx);
    const eles = document.getElementsByClassName("nobloger-animate");
    for (let ele of eles) {
      ele.classList.add("opacity-0");
    }

    ctx = setTimeout(async () => {
      for (let ele of eles) {
        (ele as HTMLElement).style.removeProperty("display");
      }
      const matches = findMatch(sbox.value, posts);
      for (let ele of eles) {
        const hide =
          matches.filter((match: any) =>
            ((ele as any).href ?? match.url).includes(match.url),
          ).length === 0;
        if (hide) (ele as HTMLElement).style.display = "none";
      }
      animation();
    }, 500);
  });
}

function findMatch(text: string, posts: any) {
  const match = posts.filter((post: any) =>
    post.frontmatter.title.toLowerCase().includes(text.toLowerCase()),
  );
  return match;
}

async function animation() {
  const eles = document.getElementsByClassName("nobloger-animate");
  for (let ele of eles) {
    setTimeout(() => {
      ele?.classList.remove("opacity-0");
      let _ = (ele as any).href
        ? undefined
        : ele.classList.remove("nobloger-animate");
    }, 300); // fade in
    await new Promise((r) => setTimeout(r, 75));
  }
}

animation();

