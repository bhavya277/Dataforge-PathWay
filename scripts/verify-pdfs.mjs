import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { PDFParse } = require('pdf-parse');

async function inspect(filePath) {
  const buf = fs.readFileSync(filePath);
  const parser = new PDFParse(new Uint8Array(buf));
  await parser.load();
  const textObj = await parser.getText();
  const text = textObj.text;
  console.log('====================================');
  console.log('File:', filePath);
  console.log('Total Pages:', textObj.total);
  console.log('Extracted text length:', text.length);

  // Leaks
  const leaks = ['file:', 'modib', 'OneDrive', 'Users/', 'Users\\'];
  let foundLeak = false;
  for (const l of leaks) {
    if (text.toLowerCase().includes(l.toLowerCase())) {
      console.log('  LEAK DETECTED:', l);
      foundLeak = true;
    }
  }
  if (!foundLeak) console.log('  [PASS] Zero path or username leaks found.');

  // Raw LaTeX
  const rawLatex = ['\\underbrace', '$$', '\\sum', '\\lambda', '\\text{', '\\mathbb', '\\operatorname'];
  let foundLatex = false;
  for (const r of rawLatex) {
    if (text.includes(r)) {
      console.log('  RAW LATEX DETECTED:', r);
      foundLatex = true;
    }
  }
  if (!foundLatex) console.log('  [PASS] Zero raw LaTeX control sequences detected.');

  // Check key phrases from formulas
  const terms = ['Target Contribution', 'Cross-Talk', 'Softmax', 'Dragon Hatchling'];
  for (const t of terms) {
    const ok = text.toLowerCase().includes(t.toLowerCase());
    console.log(`  Term "${t}":`, ok ? '[FOUND]' : '[NOT FOUND]');
  }

  console.log('\n--- HEAD (350 chars) ---');
  console.log(text.slice(0, 350).replace(/\r?\n/g, ' '));
  console.log('\n--- TAIL (350 chars) ---');
  console.log(text.slice(-350).replace(/\r?\n/g, ' '));
}

async function run() {
  await inspect('CONCEPT_SUMMARY.pdf');
  await inspect('BLOG_POST.pdf');
}

run().catch(console.error);
