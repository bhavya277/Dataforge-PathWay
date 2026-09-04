import os
import subprocess
import markdown

def generate_pdf():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    summary_md_path = os.path.join(base_dir, "CONCEPT_SUMMARY.md")
    docs_dir = os.path.join(base_dir, "docs")
    os.makedirs(docs_dir, exist_ok=True)
    html_path = os.path.join(docs_dir, "concept_summary.html")
    pdf_path = os.path.join(base_dir, "CONCEPT_SUMMARY.pdf")
    docs_pdf_path = os.path.join(docs_dir, "CONCEPT_SUMMARY.pdf")

    with open(summary_md_path, "r", encoding="utf-8") as f:
        md_text = f.read()

    body_html = markdown.markdown(md_text, extensions=['tables', 'fenced_code'])

    # Clean, compact single-page academic brief layout
    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Associative Memory & Fast Weights: Concept Summary</title>
<script>
MathJax = {{
  tex: {{
    inlineMath: [['$', '$']],
    displayMath: [['$$', '$$']]
  }},
  svg: {{
    fontCache: 'global'
  }}
}};
</script>
<script type="text/javascript" id="MathJax-script" async
  src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js">
</script>
<style>
  @page {{
    size: A4;
    margin: 12mm 15mm;
  }}
  body {{
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    line-height: 1.35;
    color: #111318;
    background: #FFFFFF;
    max-width: 820px;
    margin: 0 auto;
    font-size: 10.5pt;
  }}
  h1 {{
    font-size: 16pt;
    font-weight: 700;
    margin: 0 0 2pt 0;
    color: #111318;
    line-height: 1.2;
  }}
  h3 {{
    font-size: 11pt;
    font-weight: 700;
    margin-top: 8pt;
    margin-bottom: 3pt;
    color: #111318;
    border-bottom: 0.75pt solid #D1D5DB;
    padding-bottom: 1.5pt;
  }}
  p {{
    margin: 4pt 0;
  }}
  table {{
    width: 100%;
    border-collapse: collapse;
    margin: 6pt 0;
    font-size: 9pt;
  }}
  th, td {{
    border: 0.5pt solid #D1D5DB;
    padding: 3.5pt 5pt;
    text-align: left;
  }}
  th {{
    background-color: #F3F4F6;
    font-weight: 600;
  }}
  ul {{
    padding-left: 16pt;
    margin: 3pt 0;
  }}
  li {{
    margin: 1.5pt 0;
  }}
  hr {{
    border: none;
    border-top: 0.5pt solid #E5E7EB;
    margin: 6pt 0;
  }}
  code {{
    font-family: "JetBrains Mono", Menlo, Consolas, monospace;
    font-size: 9pt;
    background: #F3F4F6;
    padding: 1pt 3pt;
    border-radius: 2pt;
  }}
  .mjx-chtml {{
    font-size: 98% !important;
  }}
</style>
</head>
<body>
{body_html}
</body>
</html>
"""

    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html_content)

    print(f"Generated clean HTML: {html_path}")

    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
    browser = chrome_path if os.path.exists(chrome_path) else edge_path

    cmd = [
        browser,
        "--headless",
        "--disable-gpu",
        "--run-all-compositor-stages-before-draw",
        f"--print-to-pdf={pdf_path}",
        html_path
    ]
    try:
        subprocess.run(cmd, check=True)
        import shutil
        shutil.copyfile(pdf_path, docs_pdf_path)
        print(f"Successfully exported PDF to: {pdf_path} and {docs_pdf_path}")
    except Exception as e:
        print(f"Browser export warning: {e}")

if __name__ == "__main__":
    generate_pdf()
