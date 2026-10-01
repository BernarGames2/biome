#!/bin/sh
# uso: scripts/lh.sh [url]  (requer lighthouse instalado em /tmp/claude-0/lh)
cd /tmp/claude-0/lh && CHROME_PATH=/opt/pw-browsers/chromium node_modules/.bin/lighthouse ${1:-http://localhost:4174/} --chrome-flags="--headless=new --no-sandbox" --output=json --output-path=./m.json --quiet --form-factor=mobile >/dev/null 2>&1
node -e '
const r=require("./m.json");console.log(Object.entries(r.categories).map(([k,v])=>k+" "+Math.round(v.score*100)).join(" | "));
for(const a of ["first-contentful-paint","largest-contentful-paint","cumulative-layout-shift","total-blocking-time","speed-index"])console.log(a,r.audits[a].displayValue);
for(const a of Object.values(r.audits))if(a.score!==null&&a.score<0.9&&!["informative","notApplicable","manual"].includes(a.scoreDisplayMode))console.log("FAIL",a.id,a.displayValue||"")'
