/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.tuklasverse.com', // Replace with your actual domain
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.8,
  sitemapSize: 5000,
  exclude: ['/404'],
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
    };
  },
};
