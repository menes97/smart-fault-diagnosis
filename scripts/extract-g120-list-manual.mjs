// Extracts the fault list (section 4.2) of the Siemens SINAMICS G120 CU240B-2/CU240E-2 List Manual (09/2020).
//
// Usage:
//   pdftotext -raw G120_CU240BE-2_List_Manual_0920_en_US.pdf manual_raw.txt
//   node scripts/extract-g120-list-manual.mjs manual_raw.txt [--en-out local-en.json]
//
// Writes src/diagnosis/g120ListManualFacts.json with short factual data only (code, official title, message class,
// reaction, acknowledgement, printed page). The manual is copyrighted: its cause/remedy text is NOT written into the
// repository. --en-out writes that text to a local file (keep it out of git) for writing our own Turkish guidance.
import { readFileSync, writeFileSync } from 'node:fs'

const [input, ...rest] = process.argv.slice(2)
if (!input) {
  console.error('usage: node scripts/extract-g120-list-manual.mjs <pdftotext -raw output> [--en-out file.json]')
  process.exit(1)
}
const enOut = rest.includes('--en-out') ? rest[rest.indexOf('--en-out') + 1] : null

const pages = readFileSync(input, 'latin1').replace(/\r/g, '').split('\f')
const NOISE = [
  /^SINAMICS G120 Control Units CU240B-2\/CU240E-2$/,
  /^(\d{1,4} )?List Manual, 09\/2020, A5E33839529( \d{1,4})?$/,
  /^4 Faults and alarms$/,
  /^4\.2 List of faults and alarms$/,
]
// F = fault, A = alarm, C = Safety Integrated (motion) message.
const HEADER = /^([FAC]\d{5})(?: \(([A-Z, ]+)\))? (.+)$/

function printedPage(i) {
  const p = pages[i].replace(/\s+/g, ' ')
  const odd = p.match(/A5E33839529 (\d{1,4})\b/)
  const even = p.match(/CU240B-2\/CU240E-2 (\d{1,4}) List Manual, 09\/2020/)
  return Number(odd?.[1] ?? even?.[1] ?? i + 1)
}

const lines = []
pages.forEach((pg, i) => {
  for (const raw of pg.split('\n')) {
    const t = raw.trim()
    if (t && !NOISE.some((re) => re.test(t))) lines.push({ t, page: printedPage(i) })
  }
})

const isHeader = (i) => HEADER.test(lines[i]?.t ?? '') && lines[i + 1]?.t.startsWith('Message class:')
const start = lines.findIndex((l, i) => /^F01000 /.test(l.t) && isHeader(i))
// The list ends where the appendix (a page with the single letter "A") begins.
const listEnd = lines.findIndex((l, i) => i > start && l.t === "A")

function unwrap(block) {
  const out = []
  for (const l of block) {
    const prev = out.at(-1)
    if (prev && /-$/.test(prev.t) && /^[a-z]/.test(l.t)) prev.t += l.t
    else if (prev && /^[a-z(\[]/.test(l.t) && !/^- /.test(l.t)) prev.t += ' ' + l.t
    else out.push({ ...l })
  }
  return out
}

const facts = []
const en = {}
for (let i = start; i < listEnd; i++) {
  if (!isHeader(i)) continue
  const [, code, alsoAs, title] = HEADER.exec(lines[i].t)
  let e = i + 1
  while (e < listEnd && !isHeader(e)) e++
  const block = unwrap(lines.slice(i, e))
  const field = (label) => block.find((l) => l.t.startsWith(`${label}:`))?.t.slice(label.length + 2).trim() ?? null
  const ci = block.findIndex((l) => l.t.startsWith('Cause:'))
  const ri = block.findIndex((l) => l.t.startsWith('Remedy:'))
  facts.push({
    code,
    type: code.startsWith('F') ? 'fault' : code.startsWith('A') ? 'alarm' : 'safety-message',
    title,
    ...(alsoAs ? { alsoAs } : {}),
    messageClass: field('Message class'),
    reaction: field('Reaction'),
    acknowledge: field('Acknowledge'),
    pageStart: Math.min(...block.map((l) => l.page)),
    pageEnd: Math.max(...block.map((l) => l.page)),
  })
  if (ci >= 0) {
    en[code] = {
      title,
      cause: block.slice(ci, ri >= 0 ? ri : undefined).map((l) => l.t.replace(/^Cause: ?/, '')),
      remedy: ri >= 0 ? block.slice(ri).map((l) => l.t.replace(/^Remedy: ?/, '')) : [],
    }
  }
  i = e - 1
}

const out = new URL('../src/diagnosis/g120ListManualFacts.json', import.meta.url)
writeFileSync(
  out,
  JSON.stringify(
    {
      document: 'SINAMICS G120 Control Units CU240B-2/CU240E-2 List Manual, 09/2020, A5E33839529',
      firmware: '4.7 SP13',
      sourceUrl: 'https://support.industry.siemens.com/cs/document/109782301/',
      entries: facts,
    },
    null,
    1,
  ) + '\n',
)
if (enOut) writeFileSync(enOut, JSON.stringify(en, null, 1))
const f = facts.filter((x) => x.type === 'fault').length
console.log(`${facts.length} entries (${f} faults, ${facts.length - f} alarms) → src/diagnosis/g120ListManualFacts.json${enOut ? `; EN text → ${enOut}` : ''}`)
