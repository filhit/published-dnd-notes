---
tags:
  - foundry
dg-publish: true
permalink: /kak-konvertirovat-muzyku-v-ogg/
dgPassFrontmatter: true

---


```shell
ffmpeg -i <input> -vn -c:a libopus -b:a 320K <output>
```