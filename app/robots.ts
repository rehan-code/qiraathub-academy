import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/',
    },
    sitemap: 'https://academy.qiraathub.com/sitemap.xml',
    host: 'https://academy.qiraathub.com',
  }
}
