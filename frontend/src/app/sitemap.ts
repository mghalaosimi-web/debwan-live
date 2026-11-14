import type { MetadataRoute } from "next";

const siteUrl = "https://debwan-live-football-web.onrender.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: siteUrl, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/football`, lastModified, changeFrequency: "daily", priority: 0.95 },
    { url: `${siteUrl}/football/matches`, lastModified, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/football/competitions`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/football/standings`, lastModified, changeFrequency: "daily", priority: 0.8 },
    { url: `${siteUrl}/football/teams`, lastModified, changeFrequency: "weekly", priority: 0.75 },
    { url: `${siteUrl}/football/scorers`, lastModified, changeFrequency: "daily", priority: 0.75 }
  ];
}
