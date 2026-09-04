"""
[DEPRECATED] export_concept_pdf.py
Superseded by the unified, reliable Node/Puppeteer/KaTeX export pipeline:
    npm run export:pdf
    (or: node scripts/export-pdfs.mjs)

This Python script is retained only as an archived reference.
Direct execution forwards to the authoritative Node export pipeline.
"""

import sys
import subprocess

def main():
    print("[DEPRECATED] export_concept_pdf.py has been replaced by the unified KaTeX/Puppeteer pipeline.")
    print("Executing: npm run export:pdf ...")
    ret = subprocess.run(["npm", "run", "export:pdf"], shell=True)
    sys.exit(ret.returncode)

if __name__ == "__main__":
    main()
