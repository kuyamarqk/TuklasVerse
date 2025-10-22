import type { IConfig, ISitemapField } from 'next-sitemap';

const config: IConfig = {
  siteUrl: 'https://www.tuklasverse.com',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.8,
  sitemapSize: 5000,
  exclude: ['/404'],

  transform: async (
    config: IConfig,
    path: string
  ): Promise<ISitemapField> => ({
    loc: path,
    changefreq: config.changefreq,
    priority: config.priority,
    lastmod: new Date().toISOString(),
  }),
};

export default config;
