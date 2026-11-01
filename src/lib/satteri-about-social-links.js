const linkedInProfile = "https://www.linkedin.com/in/shua-shin-8a1134271";

export default function satteriAboutSocialLinks() {
  return {
    name: "about-social-links",
    element: {
      filter: ["a"],
      visit(node, ctx) {
        const href = node.properties?.href;
        if (typeof href !== "string" || !href.startsWith(linkedInProfile)) {
          return;
        }

        const parent = ctx.parent(node);
        ctx.removeNode(
          parent?.type === "element" && parent.tagName === "li" ? parent : node,
        );
      },
    },
  };
}
