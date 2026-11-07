import { posix } from "node:path";

const childLinkPattern = /^\.\/([^/]+)\.md$/;
// Noblog emits a configurable marker before child-page links (⸎ by default;
// older stores used the kaomoji). Accept any short symbol-only marker so a
// config override still renders as a subpage link.
const legacyChildPageMarker = "(」ﾟﾛﾟ)｣";

function isChildPageMarker(value) {
  const marker = value.trim();
  if (marker === legacyChildPageMarker) return true;
  return /^[^\p{L}\p{N}\s]{1,4}$/u.test(marker);
}

const linkIconPath =
  "M11 17H7q-2.075 0-3.537-1.463T2 12t1.463-3.537T7 7h4v2H7q-1.25 0-2.125.875T4 12t.875 2.125T7 15h4zm-3-4v-2h8v2zm5 4v-2h4q1.25 0 2.125-.875T20 12t-.875-2.125T17 9h-4V7h4q2.075 0 3.538 1.463T22 12t-1.463 3.538T17 17z";

function classNames(properties) {
  const value = properties?.className;
  if (Array.isArray(value)) return value;
  if (typeof value === "string") return value.split(/\s+/).filter(Boolean);
  return [];
}

function createLinkIcon() {
  return {
    type: "element",
    tagName: "svg",
    properties: {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      width: "16",
      height: "16",
      className: ["noblog-subpage__icon"],
      ariaHidden: "true",
      focusable: "false",
    },
    children: [
      {
        type: "element",
        tagName: "path",
        properties: { fill: "currentColor", d: linkIconPath },
        children: [],
      },
    ],
  };
}

export default function satteriNoblogChildLinks({ base = "/" } = {}) {
  return {
    name: "noblog-child-links",
    element: {
      filter: ["a"],
      visit(node, ctx) {
        const href = node.properties?.href;
        const match = typeof href === "string" && childLinkPattern.exec(href);

        if (!match) return;

        ctx.setProperty(
          node,
          "href",
          posix.join(base, "posts/subpages", match[1]),
        );

        const parent = ctx.parent(node);
        if (!parent || parent.type !== "element" || parent.tagName !== "p") {
          return;
        }

        const index = ctx.indexOf(node);
        if (index === undefined) return;

        let markerIndex;
        for (let i = index - 1; i >= 0; i -= 1) {
          const sibling = parent.children[i];
          if (sibling.type === "text" && sibling.value.trim() === "") continue;
          markerIndex = i;
          break;
        }

        const markerNode =
          markerIndex === undefined ? undefined : parent.children[markerIndex];
        const onlyMarkerAndLink =
          markerIndex !== undefined &&
          markerNode?.type === "text" &&
          isChildPageMarker(markerNode.value) &&
          parent.children.every(
            (child, i) =>
              i === markerIndex ||
              i === index ||
              (child.type === "text" && child.value.trim() === ""),
          );

        ctx.prependChild(node, createLinkIcon());

        if (onlyMarkerAndLink) {
          ctx.removeNode(markerNode);
          ctx.setProperty(parent, "className", [
            ...classNames(parent.properties),
            "noblog-subpage",
          ]);
          ctx.setProperty(node, "className", [
            ...classNames(node.properties),
            "noblog-subpage__link",
          ]);
          return;
        }

        ctx.setProperty(node, "className", [
          ...classNames(node.properties),
          "noblog-subpage__inline",
        ]);
      },
    },
  };
}
