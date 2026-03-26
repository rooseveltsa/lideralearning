/**
 * Script to generate missing PDIs for existing self-assessments.
 *
 * Run via:
 *   curl -X POST http://localhost:3000/api/admin/generate-missing-pdis
 *
 * Or add to package.json scripts and run with ts-node/tsx:
 *   npx tsx src/scripts/generate-missing-pdis.ts
 */

async function main() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  console.log(`Calling ${baseUrl}/api/admin/generate-missing-pdis ...`)

  const res = await fetch(`${baseUrl}/api/admin/generate-missing-pdis`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })

  const data = await res.json()
  console.log('Result:', JSON.stringify(data, null, 2))

  if (data.generated > 0) {
    console.log(`Successfully generated ${data.generated} PDIs.`)
  } else if (data.generated === 0 && data.errors.length === 0) {
    console.log('All self-assessments already have PDIs. Nothing to do.')
  } else {
    console.error('Errors encountered:', data.errors)
  }
}

main().catch(console.error)
