const fs = require("fs");
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

      const normalizedLink = linkTitle
        ? match
        : `[[${fileLink}|${fileLink}]]`;

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
}
exports.userMarkdownSetup = userMarkdownSetup;
exports.userEleventySetup = userEleventySetup;
