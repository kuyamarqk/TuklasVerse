/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://tuklas-verse.vercel.app',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: ['/404', '/500'],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/admin'] },
    ],
    additionalSitemaps: [
      'https://tuklas-verse.vercel.app/sitemap-posts.xml',
      'https://tuklas-verse.vercel.app/sitemap-pages.xml',
    ],
  },
};

