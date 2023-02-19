import json

import pandas as pd
from tokenizers import Tokenizer

d = pd.read_csv("tweets.csv")
tkz_mul = Tokenizer.from_pretrained("bert-base-multilingual-cased")
ecd = tkz_mul.encode_batch(d["Content"])


def connect_tokens(tokens: list[str]):
    last = tokens[0]
    for i, tok in enumerate(tokens):
        if tok.startswith("##"):
            last += tok[2:]
            tokens[i] = last
        else:
            last = tok
    return tokens


date_w_tokens = [
    {"Date": date, "Tokens": connect_tokens(enc.tokens)}
    for date, enc in zip(d["Date"], ecd)
]

with open("../src/lib/date_w_tokens.json", "w") as f:
    json.dump({"data": date_w_tokens}, f)
