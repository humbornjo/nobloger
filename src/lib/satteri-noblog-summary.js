import { markdownToHast } from "satteri";

function classNames(properties) {
  const value = properties?.className;
  if (Array.isArray(value)) return value;
  if (typeof value === "string") return value.split(/\s+/).filter(Boolean);
  return [];
}

function normalizeEmphasis(text) {
  return text
    .split(/(\$[^$]*\$|`[^`]*`)/g)
    .map((part, index) => {
      if (index % 2 === 1) return part;

      return part.replace(/\*\*([^*\n]*?)\*\*/g, (match, inner) => {
        const leading = inner.match(/^\s*/)?.[0] ?? "";
        const trailing = inner.match(/\s*$/)?.[0] ?? "";
        const body = inner.slice(
          leading.length,
          inner.length - trailing.length,
        );
        return body ? `${leading}**${body}**${trailing}` : match;
      });
    })
    .join("");
}

function inlineChildren(text) {
  const tree = markdownToHast(normalizeEmphasis(text), { position: false });
  const paragraph = tree.children?.find(
    (child) => child.type === "element" && child.tagName === "p",
  );

  return paragraph?.type === "element"
    ? (paragraph.children ?? [])
    : [{ type: "text", value: text }];
}

export default function satteriNoblogSummary() {
  return {
    name: "noblog-summary",
    element: {
      filter: ["summary"],
      visit(node, ctx) {
        const onlyChild = node.children.length === 1 ? node.children[0] : null;
        if (
          onlyChild?.type === "element" &&
          onlyChild.tagName === "span" &&
          classNames(onlyChild.properties).includes("details__summary-label")
        ) {
          return;
        }

        const hasElementChildren = node.children.some(
          (child) => child.type !== "text",
        );
        const children = hasElementChildren
          ? node.children
          : inlineChildren(ctx.textContent(node));

        ctx.replaceNode(node, {
          type: "element",
          tagName: "summary",
          properties: { ...(node.properties ?? {}) },
          children: [
            {
              type: "element",
              tagName: "span",
              properties: { className: ["details__summary-label"] },
              children,
            },
          ],
        });
      },
    },
  };
}
