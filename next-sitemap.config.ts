const config = {
  siteUrl: process.env.SITE_URL || 'https://www.tuklasverse.com',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.8,
  sitemapSize: 5000,
  exclude: ['/404'],

  transform: async (config, path) => ({
    loc: path,
    changefreq: config.changefreq,
    priority: config.priority,
    lastmod: new Date().toISOString(),
  }),
};

module.exports = config;
