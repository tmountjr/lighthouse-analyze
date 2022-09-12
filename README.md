# Lighthouse Analyze
Provides a basic CLI to gather Core Web Vitals statistics using Lighthouse.

## Usage
After cloning, run `yarn install` or `npm install` to install dependencies.

Run the `index.js` file to start the analysis:
```
$ node . --url=https://your-domain.com --test-count=10
```

`help` is also available:
```
$ node . help
```

## Output
The console output will include a block of text suitable for copying/pasting into a spreadsheet, as well as a summary line of averages across the entire pass:
```
$ node . --url=https://your-domain.com
Running test 1 of 20...done!
Running test 2 of 20...done!
Running test 3 of 20...done!
...
Running test 20 of 20...done!

Results:
LCP,FCP,TTI,CLS
987,987,1579,0.08112265006701151
1370,1002,1002,0.08123440006044177
994,994,1152,0.08112265006701151
...
1001,1001,1801,0

Averages: { LCP: 1034.6, FCP: 992.6, TTI: 1292.9, CLS: 0.08112265006701151 }
```