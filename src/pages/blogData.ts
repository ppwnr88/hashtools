export type BlogArticle = {
  slug: string;
  title: string;
  description: string;
  relatedTool: string;
  code: string;
  table: [string, string, string][];
  sections: { heading: string; body: string[] }[];
  faq: [string, string][];
};

const longNote = "A useful way to think about this is to separate integrity, authenticity, and password storage. Integrity asks whether bytes changed. Authenticity asks who produced the bytes and whether a secret or private key was involved. Password storage asks how to slow down guessing when an attacker already has the database. A single fast hash is good for the first question, incomplete for the second, and usually the wrong tool for the third. Wannarat Hash Tools keeps those workflows visible side by side so developers can choose deliberately instead of copying a random snippet from an old issue thread.";

export const blogArticles: BlogArticle[] = [
  {
    slug: "what-is-hash-function",
    title: "What Is a Hash Function?",
    description: "A developer-friendly introduction to hash functions, checksums, collisions, and practical safety rules.",
    relatedTool: "/tools/hash",
    code: "const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('hello'));\nconst hex = [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('');",
    table: [["Concept", "Meaning", "Example"], ["Deterministic", "Same input produces same output", "SHA-256('hello') is stable"], ["Fixed length", "Output size is constant", "SHA-256 is 32 bytes"], ["Collision", "Two inputs share one digest", "Rare for strong hashes"]],
    sections: [
      { heading: "The short version", body: ["A hash function turns input of any size into a fixed-size fingerprint. The input can be a word, a JSON payload, a photo, a release archive, or a multi-gigabyte disk image. A good cryptographic hash is deterministic, fast to compute, hard to reverse, and designed so that tiny input changes produce outputs that look unrelated.", longNote] },
      { heading: "What developers use hashes for", body: ["Hashes are useful for file integrity checks, cache keys, content-addressed storage, build pipelines, API examples, and duplicate detection. When a download page publishes a SHA-256 checksum, you can hash your local file and compare the two values. If they match, the file probably arrived without accidental corruption or replacement.", "Hashes are also used inside larger security systems, but the surrounding design matters. For example, HMAC combines a hash with a secret key to authenticate messages. Password hashing uses salts and expensive work factors to slow attackers. Digital signatures use asymmetric cryptography rather than a bare digest. The digest is often a component, not the whole security story."] },
      { heading: "Common pitfalls", body: ["MD5 and SHA-1 are still seen because older formats and examples depend on them. They are fine for some non-adversarial checksum chores, but they should not protect money, accounts, releases, or permissions. Collision attacks against those algorithms mean an attacker can sometimes craft two different inputs with the same hash.", "Another pitfall is storing password = SHA256(password). That looks tidy but is dangerous because fast hashes are exactly what attackers want. Use bcrypt, Argon2id, scrypt, or PBKDF2 with a unique salt and tuned parameters."] },
      { heading: "Using this site", body: ["The hash tool is designed for learning and developer utility. It runs in your browser, supports popular and commonly used hash algorithms, and avoids sending input to a server. It is good for quick checks, examples, and local comparisons. For automated production checks, put the same algorithm into your build or deployment process so humans are not the only guardrail."] },
    ],
    faq: [["Can I reverse a hash?", "A secure hash is designed to be one-way. Weak inputs can still be guessed by hashing many candidates."], ["Is SHA-256 always enough?", "It is a strong general digest, but passwords need password hashing and authenticated messages need HMAC or signatures."], ["Why do hashes look random?", "Good hashes avalanche changes, so even one changed bit should produce a very different digest."]],
  },
  {
    slug: "md5-vs-sha256",
    title: "MD5 vs SHA-256",
    description: "How MD5 and SHA-256 differ, why MD5 is still around, and when to migrate.",
    relatedTool: "/tools/hash",
    code: "md5('hello')    // 5d41402abc4b2a76b9719d911017c592\nsha256('hello') // 2cf24dba5fb0a30e26e83b2ac5b9e29e...",
    table: [["Algorithm", "Output", "Modern security use"], ["MD5", "128 bits", "No"], ["SHA-256", "256 bits", "Yes, for digest use"], ["bcrypt", "Encoded string", "Password storage"]],
    sections: [
      { heading: "Why the comparison matters", body: ["MD5 and SHA-256 both produce deterministic fingerprints, but they live in very different security eras. MD5 is fast, compact, and deeply embedded in old systems. SHA-256 is part of the SHA-2 family and remains a standard choice for file integrity, blockchain data structures, release verification, and many protocol designs.", longNote] },
      { heading: "Where MD5 still appears", body: ["MD5 often appears in legacy APIs, old database columns, asset fingerprints, ETags, and checksum examples. Some teams keep it because changing an external contract is expensive. Others use it for quick non-security dedupe where a deliberate attacker is not in scope. That can be acceptable if the risk is explicitly understood.", "The problem starts when MD5 is used as proof that something is trustworthy. Public collision demonstrations and practical chosen-prefix attacks mean MD5 cannot provide modern collision resistance. If an attacker can influence inputs, MD5 should be treated as unsafe."] },
      { heading: "Why SHA-256 is the normal default", body: ["SHA-256 has a larger output, a stronger design, and enormous ecosystem support. It is available in browsers, OpenSSL, package managers, cloud platforms, and CI systems. For a release checksum, SHA-256 is usually the boring and correct choice.", "SHA-256 is still fast. That is good for files and signatures, but bad for password storage. A password hash should be slow, salted, and parameterized. Migrating from MD5 password storage directly to SHA-256 is not a real fix; migrate to bcrypt, Argon2id, scrypt, or PBKDF2."] },
      { heading: "Migration advice", body: ["If you use MD5 for cache keys or non-security identifiers, document that it is not a trust boundary. If you use MD5 for downloads, signatures, tokens, or passwords, plan a migration. Add SHA-256 alongside MD5 first when compatibility matters, then phase out the MD5 dependency once clients have moved.", "In Wannarat Hash Tools, MD5 remains available because developers still need to inspect old systems. The warning exists because available does not mean recommended for security."] },
    ],
    faq: [["Is MD5 broken?", "Yes for collision-resistant security use. It can still detect many accidental changes."], ["Should I use SHA-512 instead?", "SHA-256 is already strong for general fingerprints. Choose based on protocol requirements."], ["Can I compare MD5 and SHA-256 outputs?", "Only as separate fingerprints. They are different algorithms and lengths."]],
  },
  {
    slug: "what-is-bcrypt",
    title: "What Is bcrypt?",
    description: "A practical explanation of bcrypt, salts, cost factors, and password verification.",
    relatedTool: "/tools/password-hash",
    code: "const ok = await bcryptVerify({ password: 'candidate', hash: storedHash });\n// Store the encoded bcrypt hash, not the plain password.",
    table: [["Property", "bcrypt", "Fast hash"], ["Salt", "Built in", "Manual if any"], ["Cost", "Configurable", "Usually none"], ["Purpose", "Passwords", "Integrity"]],
    sections: [
      { heading: "bcrypt in plain language", body: ["bcrypt is a password hashing algorithm designed to make guessing expensive. When users create passwords, the server stores a bcrypt hash rather than the password itself. Later, verification hashes the candidate password using the parameters embedded in the stored hash and checks whether the result matches.", longNote] },
      { heading: "Salt and cost", body: ["A bcrypt salt is random data that makes identical passwords produce different hashes. This blocks simple rainbow table reuse and makes bulk attacks more expensive. The cost factor controls how much work bcrypt performs. Higher cost means slower login and slower attacks. Teams tune cost based on their hardware and latency budget.", "The encoded bcrypt string includes the algorithm marker, cost, salt, and hash material. That is why applications usually store one string in the password_hash column. You do not need a separate salt column for standard bcrypt encoded output."] },
      { heading: "Verification workflow", body: ["Password verification should not decrypt anything. bcrypt is one-way. You take the login candidate, run bcrypt verification against the stored hash, and get true or false. Because the stored hash includes parameters, old hashes can keep working while new signups use a higher cost.", "Never log real passwords while debugging password code. Avoid sending them to third-party tools. This site runs locally in the browser for learning, but real production passwords deserve trusted devices and audited application code."] },
      { heading: "bcrypt limits", body: ["bcrypt has a 72-byte password input limit in many implementations. It is still widely used and respected, but Argon2id is often recommended for new systems because it can use memory hardness to make GPU attacks more expensive. bcrypt remains a practical default when your stack supports it well and your parameters are current."] },
    ],
    faq: [["Can bcrypt be reversed?", "No. Verification compares a candidate password against the stored hash."], ["What cost should I use?", "Use the highest cost that keeps login latency acceptable, and revisit it over time."], ["Do I need a salt?", "Yes, but standard bcrypt encoded hashes include it."]],
  },
  {
    slug: "argon2-vs-bcrypt",
    title: "Argon2 vs bcrypt",
    description: "Compare Argon2id and bcrypt for password hashing decisions.",
    relatedTool: "/tools/password-hash",
    code: "argon2id({ password, salt, iterations: 3, memorySize: 19456, parallelism: 1, hashLength: 32 })",
    table: [["Feature", "Argon2id", "bcrypt"], ["Memory hardness", "Yes", "Limited"], ["Maturity", "Modern", "Very established"], ["Encoded params", "Yes", "Yes"]],
    sections: [
      { heading: "Two good tools with different strengths", body: ["bcrypt is the older workhorse. Argon2id is the modern password hashing recommendation in many new designs. Both are much better than plain SHA-256 for password storage because they include salts and configurable work. The choice often depends on platform support, compliance requirements, operational experience, and how much control you have over parameters.", longNote] },
      { heading: "Why Argon2id is attractive", body: ["Argon2id can be tuned with memory size, iterations, parallelism, and output length. Memory hardness matters because attackers often rely on GPUs or specialized hardware to test many guesses in parallel. Requiring meaningful memory per guess changes the economics of an attack.", "The id variant mixes Argon2i and Argon2d design goals and is commonly recommended for password hashing. It is a strong choice for new applications when your runtime and deployment environment support it reliably."] },
      { heading: "Why bcrypt remains common", body: ["bcrypt has been deployed for decades. Libraries are mature, encoded hashes are familiar, and many teams already have monitoring around its latency. If you are working in a stack where bcrypt support is excellent and Argon2 support is awkward, a well-tuned bcrypt setup can be safer than a poorly understood Argon2 deployment.", "bcrypt tuning is mostly the cost factor. That simplicity is a benefit, though the 72-byte password input limit and weaker memory-hardness story are real tradeoffs."] },
      { heading: "Practical decision guide", body: ["For a new project, prefer Argon2id if your platform supports it cleanly and you can tune memory without harming availability. For existing bcrypt systems, do not panic-migrate blindly. Add migration on next successful login, keep old hashes verifiable, and measure latency. Always use unique salts and store the encoded hash string.", "Wannarat Hash Tools exposes both so developers can inspect formats and test verification behavior locally. It is not a replacement for a production password policy, secure transport, rate limiting, breach detection, or account recovery design."] },
    ],
    faq: [["Is Argon2id always better?", "It is often preferred for new systems, but correct deployment matters more than a label."], ["Should I rehash old bcrypt passwords?", "Usually on next login after verifying the old hash, not by asking everyone to reset immediately."], ["Can I use both?", "Yes during migration. Store enough metadata or encoded hashes so verification knows which algorithm to use."]],
  },
  {
    slug: "how-to-verify-file-integrity",
    title: "How to Verify File Integrity",
    description: "A practical checklist for comparing checksums after downloads and builds.",
    relatedTool: "/tools/hash",
    code: "shasum -a 256 ./download.zip\n# Compare the printed digest with the publisher's SHA-256 value.",
    table: [["Step", "Why it matters", "Tool"], ["Download checksum", "Gets expected digest", "Publisher site"], ["Hash local file", "Measures your bytes", "SHA-256"], ["Compare carefully", "Finds mismatch", "Terminal or browser"]],
    sections: [
      { heading: "What integrity verification proves", body: ["File integrity verification answers a narrow but important question: do the bytes I have match the bytes represented by this published digest? If the SHA-256 value from the publisher matches your local SHA-256 value, accidental corruption is very unlikely. It also helps detect simple replacement when the checksum came from a trusted channel.", longNote] },
      { heading: "The basic workflow", body: ["First, obtain the expected checksum from the official source. Second, hash the file you downloaded using the same algorithm. Third, compare the full value, not just the first few characters. A mismatch means you should stop and investigate rather than opening or deploying the file.", "This site can hash uploaded files directly in the browser. The file bytes are read locally and are not uploaded. For very large production artifacts, command-line tools inside CI may be more repeatable, but the browser tool is convenient for quick checks and cross-platform support."] },
      { heading: "Integrity is not always authenticity", body: ["If an attacker controls both the download and the page showing the checksum, the values can still match. Stronger release processes publish checksums over trusted channels, sign checksum files, or provide Sigstore, GPG, minisign, or platform package signatures. Hashes are powerful, but trust in the expected value matters.", "Use SHA-256 or SHA-512 for modern release checks. CRC32 and Adler-32 are useful for accidental transmission errors, but they are not designed to resist malicious tampering. MD5 and SHA-1 should be avoided for security-sensitive release verification."] },
      { heading: "Operational habits", body: ["Keep checksum verification close to the workflow. In CI, fail builds on mismatch. In documentation, tell users which algorithm to use and show an example command. In internal tooling, display the file name, size, algorithm, and digest together so people compare the right artifact.", "A clean verification habit prevents subtle mistakes, especially when teams move artifacts between machines, buckets, release pages, and package registries."] },
    ],
    faq: [["Which algorithm should I use?", "SHA-256 is the usual default for downloadable files."], ["Can this site hash large files?", "It reads files locally in the browser; very large files depend on browser memory and device capability."], ["What if checksums differ?", "Do not use the file. Download again from the official source and verify the expected digest channel."]],
  },
];

export function getArticle(slug: string | undefined) {
  return blogArticles.find((article) => article.slug === slug);
}
