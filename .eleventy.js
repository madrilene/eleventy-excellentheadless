/**
 * I strive to keep the `.eleventy.js` file clean and uncluttered. Most adjustments must be made in:
 *  - `./config/filters/index.js`
 *  - `./config/plugins/index.js`
 *  - `./config/shortcodes/index.js`
 *  - `./config/transforms/index.js`
 */

// module import filters
const {
  limit,
  toHtml,
  where,
  excerpt,
  toISOString,
  formatDate,
  toAbsoluteUrl,
  stripHtml,
  minifyCss,
  mdInline
} = require('./config/filters/index.js');

// module import shortcodes
const {imageShortcodePlaceholder, liteYoutube} = require('./config/shortcodes/index.js');

// module import collections
const {wpPosts} = require('./config/collections/index.js');

// module import transforms

// plugins
const markdownLib = require('./config/plugins/markdown.js');
const {EleventyRenderPlugin} = require('@11ty/eleventy');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const {slugifyString} = require('./config/utils');
const {escape} = require('lodash');
const pluginRss = require('@11ty/eleventy-plugin-rss');

// get access to environment variables in templates
const inspect = require('node:util').inspect;
require('dotenv').config();

module.exports = eleventyConfig => {
  // Tell 11ty to use the .eleventyignore and ignore our .gitignore file
  eleventyConfig.setUseGitIgnore(false);

  // 	--------------------- Custom Watch Targets -----------------------
  eleventyConfig.addWatchTarget('./src/assets');
  eleventyConfig.addWatchTarget('./utils/*.js');

  // --------------------- layout aliases -----------------------
  eleventyConfig.addLayoutAlias('base', 'base.njk');
  eleventyConfig.addLayoutAlias('page', 'page.njk');
  eleventyConfig.addLayoutAlias('home', 'home.njk');
  eleventyConfig.addLayoutAlias('blog', 'blog.njk');
  eleventyConfig.addLayoutAlias('post', 'post.njk');

  // 	---------------------  Custom filters -----------------------
  eleventyConfig.addFilter('limit', limit);
  eleventyConfig.addFilter('where', where);
  eleventyConfig.addFilter('excerpt', excerpt);
  eleventyConfig.addFilter('escape', escape);
  eleventyConfig.addFilter('toHtml', toHtml);
  eleventyConfig.addFilter('toIsoString', toISOString);
  eleventyConfig.addFilter('formatDate', formatDate);
  eleventyConfig.addFilter('toAbsoluteUrl', toAbsoluteUrl);
  eleventyConfig.addFilter('stripHtml', stripHtml);
  eleventyConfig.addFilter('slugify', slugifyString);
  eleventyConfig.addFilter('toJson', JSON.stringify);
  eleventyConfig.addFilter('fromJson', JSON.parse);
  eleventyConfig.addFilter('cssmin', minifyCss);
  eleventyConfig.addFilter('md', mdInline);
  eleventyConfig.addFilter('keys', Object.keys);
  eleventyConfig.addFilter('values', Object.values);
  eleventyConfig.addFilter('entries', Object.entries);

  eleventyConfig.addFilter('inspect', value => inspect(value, {sorted: true}));

  // 	--------------------- Custom shortcodes ---------------------
  eleventyConfig.addNunjucksAsyncShortcode('imagePlaceholder', imageShortcodePlaceholder);
  eleventyConfig.addShortcode('youtube', liteYoutube);
  eleventyConfig.addShortcode('year', () => `${new Date().getFullYear()}`); // current year, stephanie eckles

  // 	--------------------- Custom transforms ---------------------

  // 	--------------------- Custom collections -----------------------
  eleventyConfig.addCollection('posts', wpPosts);

  // 	--------------------- Plugins ---------------------
  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.setLibrary('md', markdownLib);
  eleventyConfig.addPlugin(pluginRss);

  // 	--------------------- Global data -----------------------

  eleventyConfig.addGlobalData('env', process.env);

  // 	--------------------- Passthrough File Copy -----------------------

  // same path

  ['src/assets/fonts/', 'src/assets/images/'].forEach(path =>
    eleventyConfig.addPassthroughCopy(path)
  );

  //  social icons and manifest to root directory
  eleventyConfig.addPassthroughCopy({
    'src/assets/images/favicon/*': '/'
  });

  // 	--------------------- Config -----------------------

  return {
    dir: {
      input: 'src',
      output: 'dist',
      includes: '_includes',
      layouts: '_layouts'
    },
    markdownTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk'
  };
};
