export function siteUrl(): string {
  return (import.meta.env.VITE_SITE_URL || "https://wannarat-hash-tools.vercel.app").replace(/\/$/, "");
}

export function setMeta(title: string, description: string, path = window.location.pathname): void {
  document.title = title;
  upsertMeta("description", description);
  upsertMeta("og:title", title, "property");
  upsertMeta("og:description", description, "property");
  upsertMeta("og:type", "website", "property");
  upsertMeta("og:url", `${siteUrl()}${path}`, "property");
  upsertLink("canonical", `${siteUrl()}${path}`);
}

function upsertMeta(name: string, content: string, attr: "name" | "property" = "name"): void {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attr, name);
    document.head.appendChild(element);
  }
  element.content = content;
}

function upsertLink(rel: string, href: string): void {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement("link");
    element.rel = rel;
    document.head.appendChild(element);
  }
  element.href = href;
}
