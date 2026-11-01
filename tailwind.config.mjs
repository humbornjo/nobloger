/** @type {import('tailwindcss').Config} */

const heading = {
  fontFamily: "var(--font-markdown-heading)",
  fontWeight: "600",
  lineHeight: "1.3",
  letterSpacing: "-0.015em",
  marginTop: "2rem",
  marginBottom: "0.75rem",
  overflowWrap: "break-word",
  scrollMarginBlockStart: "4rem",
};

export default {
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-body": "var(--foreground)",
            "--tw-prose-headings": "var(--foreground)",
            "--tw-prose-lead": "var(--muted-foreground)",
            "--tw-prose-links": "var(--primary)",
            "--tw-prose-bold": "var(--foreground)",
            "--tw-prose-counters": "var(--muted-foreground)",
            "--tw-prose-bullets": "var(--primary)",
            "--tw-prose-hr": "var(--border)",
            "--tw-prose-quotes": "var(--muted-foreground)",
            "--tw-prose-quote-borders": "var(--muted)",
            "--tw-prose-captions": "var(--muted-foreground)",
            "--tw-prose-code": "var(--foreground)",
            "--tw-prose-pre-code": "var(--foreground)",
            "--tw-prose-pre-bg": "var(--muted)",
            "--tw-prose-th-borders": "var(--border)",
            "--tw-prose-td-borders": "var(--border)",
            maxWidth: "none",
            fontFamily: "var(--font-markdown)",
            fontSize: "1.125rem",
            fontWeight: "400",
            lineHeight: "1.65",
            p: {
              marginTop: "0",
              marginBottom: "1em",
              overflowWrap: "break-word",
              textWrap: "pretty",
            },
            a: {
              fontWeight: "inherit",
              textDecorationLine: "underline",
              textDecorationThickness: "0.06em",
              textUnderlineOffset: "0.2em",
            },
            strong: {
              fontWeight: "700",
            },
            h1: {
              ...heading,
              fontSize: "2rem",
              marginTop: "0",
            },
            h2: {
              ...heading,
              fontSize: "1.5rem",
              marginTop: "2.25rem",
            },
            h3: {
              ...heading,
              fontSize: "1.25rem",
              marginTop: "2rem",
            },
            h4: {
              ...heading,
              fontSize: "1.125rem",
            },
            h5: {
              ...heading,
              fontSize: "1rem",
            },
            h6: {
              ...heading,
              fontSize: "0.875rem",
            },
            ul: {
              marginTop: "1rem",
              marginBottom: "1rem",
              paddingInlineStart: "1.5rem",
            },
            ol: {
              marginTop: "1rem",
              marginBottom: "1rem",
              paddingInlineStart: "1.5rem",
            },
            li: {
              marginTop: "0.375em",
              marginBottom: "0.375em",
            },
            blockquote: {
              borderInlineStartWidth: "2px",
              borderInlineStartColor: "var(--border)",
              fontStyle: "normal",
              fontWeight: "400",
              marginBlock: "1.5rem",
              marginInline: "0",
              padding: "0.25rem 0 0.25rem 1.25rem",
            },
            "blockquote > :last-child": {
              marginBottom: "0",
            },
            hr: {
              borderTopWidth: "1px",
              borderStyle: "solid",
              marginTop: "2rem",
              marginBottom: "2rem",
            },
            img: {
              marginTop: "1.5rem",
              marginBottom: "1.5rem",
            },
            pre: {
              backgroundColor: "var(--muted)",
              border: "0",
              borderRadius: "0",
              fontFamily: "var(--font-code)",
              fontSize: "1rem",
              fontWeight: "400",
              lineHeight: "1.6",
              marginTop: "1.5rem",
              marginBottom: "1.5rem",
              overflowX: "auto",
              padding: "1rem",
            },
            "pre code": {
              backgroundColor: "transparent",
              border: "0",
              fontFamily: "inherit",
              fontSize: "inherit",
              fontWeight: "inherit",
              padding: "0",
            },
            ":not(pre) > code": {
              backgroundColor: "var(--accent)",
              border: "0",
              borderRadius: "0",
              fontFamily: "var(--font-code)",
              fontSize: "0.875em",
              fontWeight: "400",
              margin: "0",
              overflowWrap: "break-word",
              padding: "0.125em 0.25em",
            },
            "code::before": {
              content: "none",
            },
            "code::after": {
              content: "none",
            },
            table: {
              fontFamily: "var(--font-markdown)",
              fontSize: "1rem",
              lineHeight: "1.45",
              marginTop: "1.5rem",
              marginBottom: "1.5rem",
            },
            "thead th": {
              fontWeight: "700",
              minWidth: "8rem",
              padding: "0.5rem 0.75rem",
              textAlign: "start",
              verticalAlign: "bottom",
            },
            "tbody td": {
              minWidth: "8rem",
              padding: "0.5rem 0.75rem",
              verticalAlign: "top",
            },
            details: {
              marginTop: "1rem",
              marginBottom: "1rem",
            },
            summary: {
              fontFamily: "var(--font-markdown)",
              fontWeight: "400",
              lineHeight: "1.45",
              textWrap: "pretty",
            },
          },
        },
      },
    },
  },
};
