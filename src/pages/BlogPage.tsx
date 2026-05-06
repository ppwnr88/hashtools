import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { blogArticles, getArticle } from "./blogData";
import { setMeta } from "../utils/seo";

export function BlogPage() {
  const { slug } = useParams();
  const article = getArticle(slug);

  useEffect(() => {
    if (article) setMeta(`${article.title} - Wannarat Hash Tools`, article.description);
  }, [article]);

  if (!article) return <Navigate to="/" replace />;

  return (
    <article className="blog-article">
      <p className="terminal-prompt"># blog</p>
      <h1>{article.title}</h1>
      <p className="lead">{article.description}</p>
      {article.sections.map((section) => (
        <section key={section.heading}>
          <h2>{section.heading}</h2>
          {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </section>
      ))}
      <pre className="code-block"><code>{article.code}</code></pre>
      <table>
        <tbody>
          {article.table.map((row) => <tr key={row.join("-")}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>)}
        </tbody>
      </table>
      <section>
        <h2>Practical checklist</h2>
        <p>Before choosing any algorithm, write down the job in one sentence. If the job is "detect accidental changes," a checksum or fast cryptographic hash can be appropriate. If the job is "prove a trusted system created this message," use HMAC with a secret key or a digital signature. If the job is "store user passwords," use a password hashing algorithm with salts and tunable cost. Clear wording prevents a surprising number of security mistakes.</p>
        <p>Keep the expected output format explicit. Hex lowercase is common in command-line tools, uppercase appears in older enterprise documentation, and Base64 is compact for transport. A mismatch in casing or encoding can look like a cryptographic failure when the real issue is presentation. Good tools show the algorithm, format, input source, file name, and size together so humans can compare the right values.</p>
        <p>For team workflows, avoid manual copy-paste as the only control. Put verification commands in README files, release scripts, CI jobs, or deployment checks. Browser tools are excellent for debugging and learning, while automated checks are better for repeatable production gates. The safest process usually combines both: quick local inspection when developing and scripted enforcement when shipping.</p>
        <p>For sensitive material, treat the device and page context as part of the threat model. This site is built as a client-side static app and does not upload your input, but browser extensions, shared screens, compromised devices, and pasted secrets can still create risk. When handling production credentials, prefer internal machines, private networks, and dedicated secret-management workflows.</p>
        <p>Finally, document migration choices. If an old API still needs MD5, say that it is compatibility-only. If a new service uses SHA-256 checksums, publish examples. If password hashes are moving from bcrypt to Argon2id, support old verification while rehashing after successful login. A small note today saves future developers from guessing why a decision was made.</p>
      </section>
      <section>
        <h2>FAQ</h2>
        {article.faq.map(([q, a]) => <p key={q}><strong>{q}</strong><br />{a}</p>)}
      </section>
      <div className="related-links">
        <Link to={article.relatedTool}>Open related tool</Link>
        {blogArticles.filter((item) => item.slug !== article.slug).slice(0, 3).map((item) => <Link key={item.slug} to={`/blog/${item.slug}`}>{item.title}</Link>)}
      </div>
    </article>
  );
}
