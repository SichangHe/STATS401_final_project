#!/usr/bin/env node
import fs from 'fs';

const f = fs.readFileSync('../src/lib/custom.geo.json')
const j = JSON.parse(f)
for (const feature of j.features) {
    feature.properties = {
        name_en: feature.properties.name_en
    }
}

let new_f = JSON.stringify(j)
fs.writeFileSync('../src/lib/custom.geo.json', new_f)
