---
{"dg-publish":true,"permalink":"/kak-konvertirovat-muzyku-v-ogg/","tags":["foundry"]}
---


```shell
ffmpeg -i <input> -vn -c:a libopus -b:a 320K <output>
```