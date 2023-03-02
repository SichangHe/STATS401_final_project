#!/usr/bin/env node
// This file is run after `tweets_tokenization.py`.
import fs from 'fs';

const f = fs.readFileSync('../src/lib/date_w_tokens.json')
const j = JSON.parse(f)
let data = j.data

const blacklist =
    /^((turkey)|(turki)|(syria)|(earthqua)|(http).*)|(that)|(those)|(than)|(from)|(this)|(will)|(with)|(have)|(been)|(were)|(they)|(them)|(their)|(your)|(for)|(the)|(and)|(you)|(who)|(are)|(her)|(our)|(has)|(amp)|(his)|(not)|(but)|(was)|(000)|(can)|(tur)|(tra)|(what)|(\[.*\])$/i;


const count_data = (data) => {
    let counts = new Map();
    for (const d_w_t of data) {
        for (const tk of d_w_t['Tokens']) {
            counts.set(tk, (counts.get(tk) || 0) + 1);
        }
    }
    const aggregated = [];
    for (const [tk, cnt] of counts) {
        if (tk.length < 3 || blacklist.test(tk)) {
            continue;
        }
        aggregated.push({ text: tk, count: cnt });
    }
    aggregated.sort((a, b) => b.count - a.count);
    return aggregated;
};

let words = count_data(data).slice(0, 200);
let texts = new Set(words.map((d) => d.text))

let filtered_data = [];
data.forEach((d) => {
    const tokens = d.Tokens.filter((tk) => texts.has(tk));
    if (tokens.length > 0) {
        filtered_data.push({
            Date: d.Date,
            Tokens: tokens
        });
    }
})

let new_j = {
    data: filtered_data
}
let new_f = JSON.stringify(new_j)
fs.writeFileSync('../src/lib/date_w_tokens.json', new_f)
