import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import { marked } from 'marked';
import katex from 'katex';

const PROJECT_ROOT = path.resolve('.');
const DOCS_DIR = path.join(PROJECT_ROOT, 'docs');

// Ensure docs/ directory exists
if (!fs.existsSync(DOCS_DIR)) {
  fs.mkdirSync(DOCS_DIR, { recursive: true });
}

// 1. Prepare fully self-contained KaTeX CSS with base64-inlined fonts
function getInlinedKatexCss() {
  const katexCssPath = path.join(PROJECT_ROOT, 'node_modules', 'katex', 'dist', 'katex.min.css');
  if (!fs.existsSync(katexCssPath)) {
    throw new Error(`KaTeX CSS not found at: ${katexCssPath}`);
  }
  let css = fs.readFileSync(katexCssPath, 'utf8');
  const fontsDir = path.join(PROJECT_ROOT, 'node_modules', 'katex', 'dist', 'fonts');

  // Inline font files as base64 data URIs so Puppeteer renders fonts without network or file-scheme resolution
  css = css.replace(/url\((?:['"]?)(?:fonts\/)?([^'")]+)(?:['"]?)\)/g, (match, filename) => {
    const cleanFilename = path.basename(filename);
    const fontPath = path.join(fontsDir, cleanFilename);
    if (fs.existsSync(fontPath)) {
      const ext = path.extname(cleanFilename).toLowerCase().slice(1);
      const mime = ext === 'woff2' ? 'font/woff2' : ext === 'woff' ? 'font/woff' : ext === 'ttf' ? 'font/ttf' : 'application/octet-stream';
      const b64 = fs.readFileSync(fontPath).toString('base64');
      return `url("data:${mime};base64,${b64}")`;
    }
    return match;
  });

  return css;
}

// 2. Safe Markdown-to-HTML parser with LaTeX protection and KaTeX SSR
function renderMarkdownWithKaTeX(mdText) {
  const mathPlaceholders = [];

  // Temporarily replace block math $$...$$ to protect LaTeX syntax (especially subscripts like _ ) from Markdown parser
  let protectedMd = mdText.replace(/\$\$([\s\S]*?)\$\$/g, (match, tex) => {
    const id = `@@KATEX_BLOCK_${mathPlaceholders.length}@@`;
    mathPlaceholders.push({ id, tex: tex.trim(), displayMode: true });
    return `\n\n${id}\n\n`;
  });

  // Temporarily replace inline math $...$
  protectedMd = protectedMd.replace(/\$([^\$\n\r]+?)\$/g, (match, tex) => {
    const id = `@@KATEX_INLINE_${mathPlaceholders.length}@@`;
    mathPlaceholders.push({ id, tex: tex.trim(), displayMode: false });
    return id;
  });

  // Configure marked for GFM
  marked.setOptions({
    gfm: true,
    breaks: false,
  });

  let html = marked.parse(protectedMd);

  // Restore placeholders with server-side rendered KaTeX
  for (const item of mathPlaceholders) {
    try {
      const renderedMath = katex.renderToString(item.tex, {
        displayMode: item.displayMode,
        throwOnError: false,
      });

      if (item.displayMode) {
        // If marked wrapped the block placeholder in <p>...</p>, replace the whole paragraph cleanly
        const pRegex = new RegExp(`<p>\\s*${item.id}\\s*<\\/p>`, 'g');
        if (pRegex.test(html)) {
          html = html.replace(pRegex, renderedMath);
        } else {
          html = html.replaceAll(item.id, renderedMath);
        }
      } else {
        html = html.replaceAll(item.id, renderedMath);
      }
    } catch (err) {
      console.error(`[KaTeX Error] Failed to render TeX: "${item.tex}"`, err);
      throw err;
    }
  }

  return html;
}

// 3. Blog Post HTML template (multi-page academic publication styling)
function buildBlogPostHtml(bodyHtml, katexCss) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Associative Memory in Fast-Weight Architectures: The Geometry of Recurrent Interference</title>
<style>
${katexCss}

@page {
  size: A4;
  margin: 14mm 18mm 12mm 18mm;
}

* {
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  line-height: 1.42;
  color: #111318;
  background: #FFFFFF;
  max-width: 100%;
  margin: 0 auto;
  font-size: 9.5pt;
  -webkit-font-smoothing: antialiased;
}

h1 {
  font-size: 15pt;
  font-weight: 700;
  margin: 0 0 4pt 0;
  color: #111318;
  line-height: 1.22;
}

h2, h3 {
  font-size: 11pt;
  font-weight: 700;
  margin-top: 10pt;
  margin-bottom: 3pt;
  color: #111318;
  border-bottom: 1px solid #E2E8F0;
  padding-bottom: 1.5pt;
  page-break-after: avoid;
}

p {
  margin: 3.5pt 0;
}

strong {
  color: #0F172A;
}

blockquote {
  border-left: 3px solid #3B82F6;
  margin: 6pt 0;
  padding: 3pt 8pt;
  font-style: italic;
  color: #334155;
  background: #F8FAFC;
}

ol, ul {
  padding-left: 16pt;
  margin: 4pt 0;
}

li {
  margin: 1.5pt 0;
}

hr {
  border: none;
  border-top: 1px solid #E2E8F0;
  margin: 8pt 0;
}

code {
  font-family: "JetBrains Mono", Menlo, Consolas, monospace;
  font-size: 8.5pt;
  background: #F1F5F9;
  padding: 1pt 3pt;
  border-radius: 2pt;
  color: #0F172A;
}

.katex-display {
  margin: 5pt 0 !important;
  text-align: center;
}

.katex {
  font-size: 1.02em;
}
</style>
</head>
<body>
${bodyHtml}
</body>
</html>`;
}

// 4. Concept Summary HTML template (strictly engineered for 1-page A4)
function buildConceptSummaryHtml(bodyHtml, katexCss) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Associative Memory & Fast Weights: Concept Summary</title>
<style>
${katexCss}

@page {
  size: A4;
  margin: 8mm 10mm 7mm 10mm;
}

* {
  box-sizing: border-box;
}

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  line-height: 1.25;
  color: #0F172A;
  background: #FFFFFF;
  font-size: 8.9pt;
  -webkit-font-smoothing: antialiased;
}

h1 {
  font-size: 13.5pt;
  font-weight: 700;
  margin: 0 0 1pt 0;
  color: #0F172A;
  line-height: 1.15;
  letter-spacing: -0.01em;
}

h3:first-of-type {
  margin-top: 3pt;
}

h3 {
  font-size: 9.3pt;
  font-weight: 700;
  margin-top: 4.5pt;
  margin-bottom: 1.5pt;
  color: #0F172A;
  border-bottom: 0.6pt solid #CBD5E1;
  padding-bottom: 1pt;
  line-height: 1.2;
}

/* Header metadata styling */
body > h3:nth-of-type(1) {
  font-size: 8.4pt;
  font-weight: 600;
  color: #475569;
  border-bottom: none;
  margin: 0 0 2pt 0;
  padding-bottom: 0;
}

p {
  margin: 2.5pt 0;
  text-align: justify;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 3.5pt 0;
  font-size: 7.6pt;
  line-height: 1.18;
}

th, td {
  border: 0.5pt solid #CBD5E1;
  padding: 1.8pt 3.5pt;
  text-align: left;
  vertical-align: top;
}

th {
  background-color: #F1F5F9;
  font-weight: 700;
  color: #1E293B;
}

ul {
  padding-left: 13pt;
  margin: 2pt 0;
}

li {
  margin: 1pt 0;
}

hr {
  border: none;
  border-top: 0.5pt solid #E2E8F0;
  margin: 3pt 0;
}

code {
  font-family: "JetBrains Mono", Menlo, Consolas, monospace;
  font-size: 7.8pt;
  background: #F1F5F9;
  padding: 0.5pt 2.5pt;
  border-radius: 2pt;
  color: #0F172A;
}

.katex-display {
  margin: 2.5pt 0 !important;
  text-align: center;
}

.katex {
  font-size: 0.96em;
}

.katex-display > .katex {
  font-size: 0.98em;
}
</style>
</head>
<body>
${bodyHtml}
</body>
</html>`;
}

async function exportPdfs() {
  console.log('=== Starting Reliable KaTeX + Puppeteer PDF Export ===');
  
  // Verify source markdown files
  const blogMdPath = path.join(PROJECT_ROOT, 'BLOG_POST.md');
  const conceptMdPath = path.join(PROJECT_ROOT, 'CONCEPT_SUMMARY.md');
  
  if (!fs.existsSync(blogMdPath)) {
    throw new Error(`Missing source file: ${blogMdPath}`);
  }
  if (!fs.existsSync(conceptMdPath)) {
    throw new Error(`Missing source file: ${conceptMdPath}`);
  }

  const blogMd = fs.readFileSync(blogMdPath, 'utf8');
  const conceptMd = fs.readFileSync(conceptMdPath, 'utf8');

  // Prepare KaTeX CSS with inlined fonts
  console.log('-> Inlining KaTeX CSS and webfonts...');
  const katexCss = getInlinedKatexCss();

  // Render Markdown with KaTeX SSR
  console.log('-> Parsing BLOG_POST.md and rendering KaTeX SSR...');
  const blogBodyHtml = renderMarkdownWithKaTeX(blogMd);
  const blogFullHtml = buildBlogPostHtml(blogBodyHtml, katexCss);

  console.log('-> Parsing CONCEPT_SUMMARY.md and rendering KaTeX SSR...');
  const conceptBodyHtml = renderMarkdownWithKaTeX(conceptMd);
  const conceptFullHtml = buildConceptSummaryHtml(conceptBodyHtml, katexCss);

  // Save intermediate HTML to docs/ for auditability & preview
  fs.writeFileSync(path.join(DOCS_DIR, 'blog_post.html'), blogFullHtml, 'utf8');
  fs.writeFileSync(path.join(DOCS_DIR, 'concept_summary.html'), conceptFullHtml, 'utf8');
  console.log('-> Intermediate HTML written to docs/blog_post.html and docs/concept_summary.html');

  // Launch Puppeteer (works cross-platform: Linux CI, Windows, macOS)
  console.log('-> Launching Puppeteer...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  });

  try {
    const page = await browser.newPage();

    // Export BLOG_POST.pdf
    console.log('-> Rendering BLOG_POST.pdf...');
    await page.setContent(blogFullHtml, { waitUntil: 'load' });
    const blogPdfPath = path.join(PROJECT_ROOT, 'BLOG_POST.pdf');
    const blogDocsPdfPath = path.join(DOCS_DIR, 'BLOG_POST.pdf');
    
    await page.pdf({
      path: blogPdfPath,
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: false,
      headerTemplate: '<span></span>',
      footerTemplate: '<span></span>',
    });
    fs.copyFileSync(blogPdfPath, blogDocsPdfPath);
    console.log(`   Created: ${blogPdfPath}`);
    console.log(`   Mirrored: ${blogDocsPdfPath}`);

    // Export CONCEPT_SUMMARY.pdf
    console.log('-> Rendering CONCEPT_SUMMARY.pdf...');
    await page.setContent(conceptFullHtml, { waitUntil: 'load' });
    const conceptPdfPath = path.join(PROJECT_ROOT, 'CONCEPT_SUMMARY.pdf');
    const conceptDocsPdfPath = path.join(DOCS_DIR, 'CONCEPT_SUMMARY.pdf');

    await page.pdf({
      path: conceptPdfPath,
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: false,
      headerTemplate: '<span></span>',
      footerTemplate: '<span></span>',
    });
    fs.copyFileSync(conceptPdfPath, conceptDocsPdfPath);
    console.log(`   Created: ${conceptPdfPath}`);
    console.log(`   Mirrored: ${conceptDocsPdfPath}`);

  } finally {
    await browser.close();
  }

  console.log('=== PDF Export Finished Successfully ===');
}

exportPdfs().catch((err) => {
  console.error('FATAL: PDF export failed:', err);
  process.exit(1);
});
