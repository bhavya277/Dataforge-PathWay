import os
import subprocess
import markdown

def generate_pdf():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    blog_md_path = os.path.join(base_dir, "BLOG_POST.md")
    docs_dir = os.path.join(base_dir, "docs")
    os.makedirs(docs_dir, exist_ok=True)
    html_path = os.path.join(docs_dir, "blog_post.html")
    pdf_path = os.path.join(docs_dir, "BLOG_POST.pdf")

    with open(blog_md_path, "r", encoding="utf-8") as f:
        md_text = f.read()

    # Convert markdown to HTML
    body_html = markdown.markdown(md_text, extensions=['tables', 'fenced_code'])

    # Wrap in academic editorial publication styling with MathJax for math rendering
    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Associative Memory in Fast-Weight Architectures</title>
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
    margin: 20mm;
  }}
  body {{
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    line-height: 1.55;
    color: #111318;
    background: #FFFFFF;
    max-width: 800px;
    margin: 0 auto;
    font-size: 13px;
  }}
  h1 {{
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 8px;
    color: #111318;
    line-height: 1.25;
  }}
  h3 {{
    font-size: 15px;
    font-weight: 700;
    margin-top: 18px;
    margin-bottom: 6px;
    color: #111318;
    border-bottom: 1px solid #E2E4E8;
    padding-bottom: 3px;
  }}
  p {{
    margin: 8px 0;
  }}
  strong {{
    color: #111318;
  }}
  blockquote {{
    border-left: 3px solid #111318;
    margin: 12px 0;
    padding-left: 12px;
    font-style: italic;
    color: #374151;
  }}
  ol, ul {{
    padding-left: 20px;
    margin: 8px 0;
  }}
  li {{
    margin: 3px 0;
  }}
  hr {{
    border: none;
    border-top: 1px solid #E5E7EB;
    margin: 16px 0;
  }}
  code {{
    font-family: "JetBrains Mono", Menlo, Consolas, monospace;
    font-size: 11px;
    background: #F3F4F6;
    padding: 1px 4px;
    border-radius: 2px;
  }}
  .mjx-chtml {{
    font-size: 105% !important;
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

    # Use Chrome or Edge headless to print to PDF
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
        print(f"Successfully exported PDF to: {pdf_path}")
    except Exception as e:
        print(f"Browser export warning: {e}")

if __name__ == "__main__":
    generate_pdf()
