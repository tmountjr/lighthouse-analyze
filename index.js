const fs = require('fs')
const yargs = require('yargs/yargs');
const lighthouse = require('lighthouse');
const { hideBin } = require('yargs/helpers')
const chromeLauncher = require('chrome-launcher');

const packageVersion = JSON.parse(fs.readFileSync('./package.json').toString()).version

const argv = yargs(hideBin(process.argv))
  .option('url', {
    alias: 'u',
    type: 'string',
    description: 'URL to process'
  })
  .coerce('url', arg => {
    // Strip trailing slash
    let transformed = arg.replace(/\/$/, '')

    // Ensure it starts with https://
    if (! /^https?:\/\//.test(transformed)) {
      transformed = `https://${arg}`
    }
    return transformed
  })
  .option('test-count', {
    alias: 't',
    type: 'number',
    description: 'Number of tests to run (default = 5, max = 50)',
    default: 5
  })
  .coerce('test-count', arg => {
    if (arg < 0) return 0
    if (arg > 50) return 50
  })
  .usage('Usage: $0 --url=[url] --test-count=[test count]')
  .demandOption('url')
  .help().alias('help', 'h')
  .version('version', packageVersion).alias('version', 'v')
  .argv;

const testUrl = argv.url;

(async () => {
  const testCount = 20
  let currentTest = 0
  const testResults = []

  while (currentTest < testCount) {
    process.stdout.write(`Running test ${currentTest + 1} of ${testCount}...`)
    const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless']})
    const options = {
      logLevel: 'silent',
      output: 'json',
      onlyCategories: ['performance'],
      port: chrome.port
    }
    const runnerResult = await lighthouse(testUrl, options)
  
    const { largestContentfulPaint, firstContentfulPaint, interactive, cumulativeLayoutShift } = runnerResult.lhr.audits.metrics.details.items[0]
    testResults.push({
      LCP: largestContentfulPaint,
      FCP: firstContentfulPaint,
      TTI: interactive,
      CLS: cumulativeLayoutShift
    })
    await chrome.kill()
    console.log('done!')
    currentTest++
  }

  console.log('\nResults:')
  console.log('LCP,FCP,TTI,CLS')
  console.log(testResults.map(r => [r.LCP, r.FCP, r.TTI, r.CLS].join(',')).join('\r\n'))

  const averages = testResults.reduce((prev, curr, index) => {
    Object.keys(prev).forEach(key => {
      curr[key] = ((prev[key] * index) + curr[key]) / (index + 1)
    })
    return curr
  })
  console.log('\nAverages:', averages)
  process.exit()
})();
