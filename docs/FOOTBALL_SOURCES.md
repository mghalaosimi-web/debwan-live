# Football Hub — Official Free Sources

## Scope

The first football milestone provides a Debwan Live discovery page that directs viewers to official broadcasters for free-to-watch football content. It does not proxy, extract, embed, record, or redistribute broadcaster video streams.

## Verified sources (checked 2026-11-10)

| Provider | Free offering | Official destination | Important limits |
|---|---|---|---|
| Thmanyah | Selected Saudi football matches are available free in its app; three satellite channels are free-to-air | https://app.thmanyah.com/ | Digital live sports are limited to the Arab rights territory, which includes Yemen. Satellite channels are on Arabsat Badr 8 only. |
| beIN SPORTS | beIN confirms two free-to-air channels: beIN SPORTS and beIN SPORTS NEWS | https://connect.bein.com/ | This does not make paid beIN sports channels or all premium matches free. |
| TOD | بث رياضي مدفوع عبر منصة beIN، تشمل حقوق مسابقات كبرى في أسواق MENA وتركيا | https://www.tod.tv/ | اشتراك مدفوع؛ تحقق من توفر البطولة والباقة في اليمن قبل الاشتراك. |
| قنوات الكأس | قنوات رياضية قطرية مع جدول بث رسمي | https://www.alkass.net/tvguide | تحقق من جدول القناة والتوفر الرقمي والحقوق حسب الدولة؛ لا تفترض أن كل مباراة متاحة في اليمن. |
| FIFA+ on DAZN | Selected live matches from FIFA member associations and competitions; free-to-view catalogue with an account | https://www.dazn.com/fifaplus | FIFA+ moved to DAZN in 2026. Catalogue, live events, and access vary by country and rights; registration may be required. Do not imply every competition or match is available in Yemen. |

## Thmanyah satellite tuning information

Published by Thmanyah's official support center:
- Satellite: Arabsat Badr 8 (26°E)
- Frequency: 11919 MHz
- Polarization: Horizontal (H)
- Modulation: DVB-S2 8PSK
- Symbol rate: 27500
- FEC: 3/4
- Encryption: Free-to-air

The satellite signal coverage includes Yemen. Satellite reception is not an internet stream URL and must not be entered into the HLS player.

## Rights and player policy

1. Official web/app links may be presented as outbound links.
2. Do not scrape, extract, proxy, or expose private HLS/DASH URLs, DRM keys, cookies, or provider tokens.
3. Do not bypass authentication, subscription, geo-restrictions, or anti-automation controls.
4. An in-app player may be enabled only for a source whose terms or written authorization explicitly permit embedding and redistribution.
5. Mark a source as live only after an actual health check of an authorized stream. A provider's broadcast schedule is not proof that a particular stream URL is playable.
6. Clearly distinguish free-to-air satellite reception from free digital streaming.

## Primary references

- Thmanyah — broadcast rights geography and satellite tuning: https://ask.thmanyah.com/النطاق-الجغرافي-لحقوق-البث
- Thmanyah — app availability and free access: https://ask.thmanyah.com/ما-هو-تطبيق-ثمانية
- Thmanyah — official app match page and live viewing flow: https://ask.thmanyah.com/en/match-page-on-thamanyah-app
- beIN — official FAQ confirming two free-to-air channels and beIN CONNECT MENA availability: https://www.bein.com/en/faqs/
- TOD — official beIN Media Group platform and rights portfolio: https://www.beinmediagroup.com/subsidiary/tod/
- Al Kass — official broadcast schedule: https://www.alkass.net/tvguide
- FIFA — FIFA+ transition to DAZN: https://www.fifa.com/ar/dazn
- FIFA — FIFA+ launches on DAZN: https://inside.fifa.com/organisation/media-releases/fifa-plus-dazn-global-home-of-football
- DAZN — FIFA+ availability and account requirements: https://www.dazn.com/en-CA/help/articles/36029102113053-fifa-on-dazn-everything-you-need-to-know
- Saudi Pro League — Thmanyah awarded MENA broadcast rights for 2025/26–2030/31: https://www.spl.com.sa/ar/news/spl-fdl-saff-announce-broadcast-rights-award-thmanyah

## Next engineering milestones

- Add a normalized football competition/match data model or integrate a licensed fixture provider.
- Add fixtures, live status, results, and competition filters independently from video sources.
- Add admin-managed source records with ownership/permission metadata and health checks.
- Add HLS playback only after an explicitly authorized stream source is supplied.
