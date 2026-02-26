const fs = require("fs");
const path = require("path");
function userMarkdownSetup(md) {
  // The md parameter stands for the markdown-it instance used throughout the site generator.
  // Feel free to add any plugin you want here instead of /.eleventy.js
}
function userEleventySetup(eleventyConfig) {
  // The eleventyConfig parameter stands for the the config instantiated in /.eleventy.js.
  // Feel free to add any plugin you want here instead of /.eleventy.js

  const linkFilter = eleventyConfig.getFilter("link");

eleventyConfig.addFilter("link", function (str) {
    if (!str) return str;

    return str.replace(/\[\[(.*?)(?:\|(.*?))?\]\]/g, function (match, fileLink, linkTitle) {
      
      if (fileLink.indexOf("],[") > -1 || fileLink.indexOf('"$"') > -1) {
        return match;
      }

      const cleanedFileLink = fileLink.replace(/\.md\\+$/i, "");

      const normalizedLink = linkTitle
        ? `[[${cleanedFileLink}|${linkTitle}]]`
        : `[[${cleanedFileLink}|${cleanedFileLink}]]`;

      return linkFilter(normalizedLink);
    });
  });

  eleventyConfig.on('eleventy.before', async ({ dir }) => {
    const files = await fs.promises.readdir(dir.input, { recursive: true });
    const markdownFiles = files.filter((file) => file.endsWith('.md'));
    for (const file of markdownFiles) {
      const content = await fs.promises.readFile(`${dir.input}/${file}`, 'utf-8');
      const frontmatterRegex = /^---([\s\S]*?)---/m;
      const match = content.match(frontmatterRegex);

      if (match) {
        const updatedFrontmatter = match[1].replace(/\\\|/g, '|');
        const updatedContent = content.replace(match[0], `---${updatedFrontmatter}---`);
        await fs.promises.writeFile(`${dir.input}/${file}`, updatedContent, 'utf-8');
      }
    }
  });

  eleventyConfig.on('eleventy.before', async ({ dir }) => {
    const inputDir = dir.input;
    const notesDir = path.join(inputDir, 'notes');

    const files = await fs.promises.readdir(notesDir, { recursive: true });

    const foundLinks = new Set();
    const markdownFiles = files.filter((f) => f.endsWith('.md'));

    for (const file of markdownFiles) {
      const content = await fs.promises.readFile(path.join(notesDir, file), 'utf-8');

      const wikiLinkRegex = /\[\[([^#|\]\n]+)(?:[#|][^\]\n]*)?\]\]/g;
      let match;
      while ((match = wikiLinkRegex.exec(content)) !== null) {
        // We remove backslashes so 'Рунарсон\' becomes 'Рунарсон'
        let link = match[1]
          .replace(/[\\]+$/g, '')
          .replace(/\.md$/g, "")
          .trim();

        if (link) {
          foundLinks.add(link);
        }
      }
    }

    const slugify = eleventyConfig.getFilter("slugify");

    for (const link of foundLinks) {
      if (!link.includes('://')) {

        const slug = slugify(link);
        const permalink = `/${slug}/`;
        const stubPath = path.join(notesDir, `${link}.md`);

        const exists = await fs.promises.stat(stubPath).catch(() => null);

        if (!exists) {
          const stubContent = `---
title: "${link}"
permalink: "${permalink}"
tags: ["stub"]
dg-publish: true
---
> [!info] Эта заметка ещё не написана
> Этой страницы пока не существует, либо информация временно скрыта.
>
> Однако вы можете изучить **Граф связей** или заглянуть в раздел **Обратные ссылки** (Backlinks) ниже, чтобы понять, в каком контексте упоминается «${link}».
`;

          await fs.promises.writeFile(stubPath, stubContent, 'utf-8');
          console.log(`[Stub Created] ${link}.md -> ${permalink}`);
        }
      }
    }
  });
}

exports.userMarkdownSetup = userMarkdownSetup;
exports.userEleventySetup = userEleventySetup;
