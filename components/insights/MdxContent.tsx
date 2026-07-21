import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";

const components = {
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="prose-h2" {...props}>{children}</h2>
  ),
  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="prose-h3" {...props}>{children}</h3>
  ),
  p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="prose-p" {...props}>{children}</p>
  ),
  a: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} className="prose-a" target={href?.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" {...props}>
      {children}
    </a>
  ),
  ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="prose-ul" {...props}>{children}</ul>
  ),
  ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="prose-ol" {...props}>{children}</ol>
  ),
  li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="prose-li" {...props}>{children}</li>
  ),
  blockquote: ({ children, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="prose-blockquote" {...props}>{children}</blockquote>
  ),
  hr: () => <hr className="prose-hr" />,
  strong: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <strong className="prose-strong" {...props}>{children}</strong>
  ),
  code: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <code className="prose-code" {...props}>{children}</code>
  ),
  pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className="prose-pre" {...props}>{children}</pre>
  ),
};

// Escape { } outside fenced and inline code blocks so MDX never evaluates
// {expression} patterns — prevents env var exfiltration if DB content is tampered with.
function sanitizeMdxSource(source: string): string {
  const parts = source.split(/(```[\s\S]*?```|`[^`\n]+`)/g);
  return parts
    .map((part, i) =>
      i % 2 === 1 ? part : part.replace(/\{/g, "&#123;").replace(/\}/g, "&#125;")
    )
    .join("");
}

export async function MdxContent({ source }: { source: string }) {
  const safeSource = sanitizeMdxSource(source);
  return (
    <div className="mdx-prose">
      <MDXRemote
        source={safeSource}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeSlug, [rehypeHighlight, { detect: true }]],
          },
        }}
        components={components}
      />
    </div>
  );
}
