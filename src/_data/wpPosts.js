const EleventyFetch = require('@11ty/eleventy-fetch');
const wpUrl = process.env.CMS;

async function getPosts() {
  try {
    const endpoint = `${wpUrl}/wp-json/wp/v2/posts`;
    const response = EleventyFetch(endpoint, {
      duration: '2m',
      type: 'json'
    });
    const posts = await response;
    console.log(endpoint);
    return posts;
  } catch (e) {
    console.log(e);
  }
}
module.exports = getPosts;
console.log(getPosts);
