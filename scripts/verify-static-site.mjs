import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const siteDir = path.join(rootDir, "dbggm-site");
const errors = [];
const warnings = [];

const coreRoutes = [
  "/",
  "/open-account/",
  "/deposit-guide/",
  "/withdrawal-guide/",
  "/account-types/",
  "/mt4-mt5-guide/",
  "/faq/",
  "/risk-disclosure/",
  "/about/",
  "/contact/",
  "/guides/",
];

const forbiddenPhrases = [
  "127.0.0.1",
  "localhost",
  "/Users/",
  "MarketHubX",
  "保证收益",
  "稳赚",
  "无风险",
  "包盈利",
  "100% 出金",
  "100%出金",
  "官方唯一",
  "绝对安全",
];

const walk = (dir) => {
  const entries = readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const filePath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(filePath);
    return filePath;
  });
};

const normalizeRoute = (href) => {
  const cleanHref = href.split("#")[0].split("?")[0];
  if (!cleanHref || cleanHref === "/") return "/";
  return cleanHref.endsWith("/") ? cleanHref : cleanHref;
};

const routeExists = (href) => {
  const route = normalizeRoute(href);
  if (route === "/") return existsSync(path.join(siteDir, "index.html"));

  const relative = route.replace(/^\//, "");
  const directPath = path.join(siteDir, relative);
  const indexPath = path.join(siteDir, relative, "index.html");
  return existsSync(directPath) || existsSync(indexPath);
};

const checkJsonLd = (html, file) => {
  const matches = html.matchAll(
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  );
  for (const match of matches) {
    try {
      JSON.parse(match[1].trim());
    } catch (error) {
      errors.push(`${file}: JSON-LD 语法错误：${error.message}`);
    }
  }
};

if (!existsSync(siteDir)) {
  errors.push("缺少 dbggm-site 站点目录。");
} else {
  const files = walk(siteDir);
  const htmlFiles = files.filter((file) => file.endsWith(".html"));
  const checkTextFiles = files.filter((file) =>
    /\.(html|css|js|txt|xml|json|svg)$/i.test(file),
  );

  for (const route of coreRoutes) {
    if (!routeExists(route)) errors.push(`核心页面不存在：${route}`);
  }

  for (const requiredFile of ["404.html", "robots.txt", "sitemap.xml"]) {
    if (!existsSync(path.join(siteDir, requiredFile))) {
      errors.push(`缺少 ${requiredFile}`);
    }
  }

  const sitemapPath = path.join(siteDir, "sitemap.xml");
  if (existsSync(sitemapPath)) {
    const sitemap = readFileSync(sitemapPath, "utf8");
    const sitemapUrls = new Set(
      [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim()),
    );
    for (const route of coreRoutes) {
      const url = `https://dbgmarkets-help.com${route === "/" ? "/" : route}`;
      if (!sitemapUrls.has(url)) errors.push(`sitemap.xml 缺少：${url}`);
    }
    if (sitemapUrls.has("https://dbgmarkets-help.com/404.html")) {
      errors.push("sitemap.xml 不应包含 404 页面。");
    }
    for (const url of sitemapUrls) {
      if (/127\.0\.0\.1|localhost/i.test(url)) errors.push(`sitemap.xml 包含本地地址：${url}`);
    }
  }

  const robotsPath = path.join(siteDir, "robots.txt");
  if (existsSync(robotsPath)) {
    const robots = readFileSync(robotsPath, "utf8");
    if (!/Sitemap:\s*https:\/\/dbgmarkets-help\.com\/sitemap\.xml/i.test(robots)) {
      errors.push("robots.txt 未声明正式 sitemap 地址。");
    }
    if (/Disallow:\s*\/(open-account|deposit-guide|withdrawal-guide|faq|risk-disclosure)/i.test(robots)) {
      errors.push("robots.txt 屏蔽了核心页面。");
    }
  }

  for (const file of checkTextFiles) {
    const relativeFile = path.relative(rootDir, file);
    const text = readFileSync(file, "utf8");
    for (const phrase of forbiddenPhrases) {
      if (text.includes(phrase)) errors.push(`${relativeFile}: 出现禁止上线文本：${phrase}`);
    }
  }

  for (const file of htmlFiles) {
    const relativeFile = path.relative(rootDir, file);
    const html = readFileSync(file, "utf8");

    if (!/<title>[^<]+<\/title>/i.test(html)) errors.push(`${relativeFile}: 缺少 title`);
    if (!/<meta\s+name=["']description["']\s+content=["'][^"']+["']/i.test(html)) {
      errors.push(`${relativeFile}: 缺少 meta description`);
    }
    if (!/<meta\s+name=["']robots["']\s+content=["'][^"']+["']/i.test(html)) {
      errors.push(`${relativeFile}: 缺少 robots meta`);
    }
    if (
      !relativeFile.endsWith("404.html") &&
      !/<meta\s+name=["']robots["']\s+content=["'][^"']*index,follow[^"']*["']/i.test(html)
    ) {
      errors.push(`${relativeFile}: 正式页面 robots meta 不是 index,follow`);
    }
    if (!/<meta\s+property=["']og:title["']\s+content=["'][^"']+["']/i.test(html)) {
      errors.push(`${relativeFile}: 缺少 Open Graph title`);
    }
    if (!/<meta\s+property=["']og:description["']\s+content=["'][^"']+["']/i.test(html)) {
      errors.push(`${relativeFile}: 缺少 Open Graph description`);
    }
    if (!/<meta\s+property=["']og:image["']\s+content=["']https:\/\/dbgmarkets-help\.com\/[^"']+["']/i.test(html)) {
      errors.push(`${relativeFile}: 缺少正式域名 og:image`);
    }
    if (!/<meta\s+name=["']twitter:title["']\s+content=["'][^"']+["']/i.test(html)) {
      errors.push(`${relativeFile}: 缺少 Twitter title`);
    }
    if (!/<meta\s+name=["']twitter:description["']\s+content=["'][^"']+["']/i.test(html)) {
      errors.push(`${relativeFile}: 缺少 Twitter description`);
    }
    if (!/<meta\s+name=["']twitter:image["']\s+content=["']https:\/\/dbgmarkets-help\.com\/[^"']+["']/i.test(html)) {
      errors.push(`${relativeFile}: 缺少正式域名 Twitter image`);
    }
    if (!/<h1[\s>]/i.test(html) && !relativeFile.endsWith("404.html")) {
      errors.push(`${relativeFile}: 缺少 H1`);
    }

    const h1Count = (html.match(/<h1[\s>]/gi) || []).length;
    if (h1Count > 1) errors.push(`${relativeFile}: H1 数量超过 1 个`);

    checkJsonLd(html, relativeFile);

    const srcMatches = html.matchAll(/\s(?:src|poster)=["']([^"']+)["']/gi);
    for (const match of srcMatches) {
      const asset = match[1];
      if (/^(https?:)?\/\//.test(asset) || asset.startsWith("data:")) continue;
      const cleanAsset = asset.split("#")[0].split("?")[0];
      const assetPath = path.join(siteDir, cleanAsset.replace(/^\//, ""));
      if (!existsSync(assetPath)) errors.push(`${relativeFile}: 图片或媒体不存在：${asset}`);
    }

    const imgMatches = html.matchAll(/<img\b([^>]*?)>/gi);
    for (const match of imgMatches) {
      const tag = match[0];
      if (!/\balt=["'][^"']*["']/i.test(tag)) errors.push(`${relativeFile}: 图片缺少 alt：${tag}`);
      if (!/\bwidth=["']\d+["']/i.test(tag) || !/\bheight=["']\d+["']/i.test(tag)) {
        errors.push(`${relativeFile}: 图片缺少 width/height：${tag}`);
      }
    }

    const hrefMatches = html.matchAll(/\shref=["']([^"']+)["']/gi);
    for (const match of hrefMatches) {
      const href = match[1];
      if (
        !href ||
        href.startsWith("#") ||
        /^(https?:)?\/\//.test(href) ||
        /^(mailto|tel|javascript):/i.test(href)
      ) {
        continue;
      }
      if (href.includes(".html")) errors.push(`${relativeFile}: 内链仍使用 .html：${href}`);
      if (href.startsWith("/") && !routeExists(href)) {
        errors.push(`${relativeFile}: 内链目标不存在：${href}`);
      }
    }

    const anchorMatches = html.matchAll(/<a\b([^>]*?)>/gi);
    for (const match of anchorMatches) {
      const tag = match[0];
      const href = tag.match(/\shref=["']([^"']+)["']/i)?.[1];
      if (!href || !/^https?:\/\//i.test(href)) continue;
      const rel = tag.match(/\srel=["']([^"']+)["']/i)?.[1] || "";
      if (!/\bnoopener\b/i.test(rel) || !/\bnoreferrer\b/i.test(rel)) {
        errors.push(`${relativeFile}: 外部链接缺少 noopener noreferrer：${href}`);
      }
    }
  }

  const cssFiles = files.filter((file) => file.endsWith(".css"));
  for (const file of cssFiles) {
    const relativeFile = path.relative(rootDir, file);
    const css = readFileSync(file, "utf8");
    const urls = css.matchAll(/url\(["']?([^"')]+)["']?\)/gi);
    for (const match of urls) {
      const asset = match[1];
      if (/^(https?:)?\/\//.test(asset) || asset.startsWith("data:")) continue;
      const cleanAsset = asset.split("#")[0].split("?")[0];
      const assetPath = asset.startsWith("/")
        ? path.join(siteDir, cleanAsset.replace(/^\//, ""))
        : path.resolve(path.dirname(file), cleanAsset);
      if (!existsSync(assetPath)) errors.push(`${relativeFile}: CSS 资源不存在：${asset}`);
    }
  }

  for (const file of files) {
    const relativeFile = path.relative(rootDir, file);
    if (statSync(file).size === 0) warnings.push(`${relativeFile}: 文件为空`);
  }
}

if (warnings.length) {
  console.warn("Warnings:");
  for (const warning of warnings) console.warn(`- ${warning}`);
}

if (errors.length) {
  console.error("Static site verification failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Static site verification passed.");
console.log(`Checked site directory: ${path.relative(rootDir, siteDir)}`);
console.log(`Checked core routes: ${coreRoutes.join(", ")}`);
