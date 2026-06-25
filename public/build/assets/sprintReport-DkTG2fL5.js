const g="sprint-report-v2";function c(e){return e?e.startsWith("http://")||e.startsWith("https://")||e.startsWith("data:")||e.startsWith("/storage/")?e:`/storage/${e.replace(/^\/+/,"")}`:null}function l(e,s){const i=e?.match(/\[IMAGES:(.*?)\]/),n=i?.[1]?i[1].split(",").map((a,o)=>({url:c(a.trim()),caption:`Sprint image ${o+1}`,day_number:null,position:o+1})).filter(a=>a.url):[],r=(e||"").replace(/\n\n\[IMAGES:.*?\]/,"").trim();return{version:"legacy-report",style:"professional",headline:s?.title?`Sprint report for ${s.title}`:"Sprint report",subheadline:"Legacy summary",preview:r,summary:r,metrics:{duration_days:s?.duration_days??"-",updates_posted:"-",score:"-",reactions_received:"-",rank_label:"-",images_count:n.length,resources_count:0},accomplishments:[],timeline:[],lessons:[],resources:[],gallery:n,hashtags:[],formats:{linkedin:r,portfolio:r,caption:r}}}function u(e,s=null){if(!e||!e.trim())return null;try{const i=JSON.parse(e);return!i?.version||i.version!==g?l(e,s):{...i,metrics:{duration_days:i.metrics?.duration_days??s?.duration_days??"-",updates_posted:i.metrics?.updates_posted??"-",score:i.metrics?.score??"-",reactions_received:i.metrics?.reactions_received??"-",rank_label:i.metrics?.rank_label??"-",images_count:i.metrics?.images_count??(i.gallery||[]).length,resources_count:i.metrics?.resources_count??(i.resources||[]).length},gallery:(i.gallery||[]).map((n,r)=>({...n,position:n.position??r+1,url:c(n.url)})),preview:i.preview||i.summary||i.headline||"",formats:{linkedin:i.formats?.linkedin||i.summary||"",portfolio:i.formats?.portfolio||i.summary||"",caption:i.formats?.caption||i.summary||"",twitter:i.formats?.twitter||""}}}catch{return l(e,s)}}function h(e){return!!(e&&e.trim().length>0)}function f(e,s=null){return u(e,s)?.preview||""}function b(e,s){const n=[["Duration",`${e.metrics?.duration_days??s?.duration_days??"-"} days`],["Updates",`${e.metrics?.updates_posted??"-"}`],["Score",`${e.metrics?.score??"-"}`],["Reactions",`${e.metrics?.reactions_received??"-"}`],["Rank",`${e.metrics?.rank_label??"-"}`]].map(([t,d])=>`<div class="metric"><span class="metric-label">${t}</span><strong>${d}</strong></div>`).join(""),r=(e.accomplishments||[]).map(t=>`<li>${t}</li>`).join(""),a=(e.timeline||[]).map(t=>`
                <div class="timeline-item">
                    <div class="timeline-kicker">${t.title} • Day ${t.day_number??"-"}</div>
                    <div class="timeline-summary">${t.summary}</div>
                </div>
            `).join(""),o=(e.lessons||[]).map(t=>`<li>${t}</li>`).join(""),m=(e.resources||[]).map(t=>`<li><a href="${t}" target="_blank" rel="noopener noreferrer">${t}</a></li>`).join(""),p=(e.gallery||[]).map(t=>`
                <figure class="gallery-item">
                    <img src="${t.url}" alt="${t.caption||"Sprint image"}" />
                    <figcaption>${t.caption||""}</figcaption>
                </figure>
            `).join("");return`
        <!doctype html>
        <html>
        <head>
            <meta charset="utf-8" />
            <title>${e.headline}</title>
            <style>
                body { font-family: Georgia, serif; margin: 0; color: #1f2937; background: #f5f1e8; }
                .page { max-width: 960px; margin: 0 auto; padding: 40px 32px 72px; }
                .hero { background: linear-gradient(135deg, #153b2e, #2f6b4f); color: white; padding: 32px; border-radius: 24px; }
                .hero h1 { margin: 0 0 10px; font-size: 34px; line-height: 1.1; }
                .hero p { margin: 0; color: rgba(255,255,255,0.82); font-size: 16px; }
                .section { background: white; border-radius: 22px; padding: 28px; margin-top: 24px; box-shadow: 0 20px 60px rgba(21, 59, 46, 0.08); }
                .section h2 { margin: 0 0 16px; font-size: 18px; letter-spacing: 0.08em; text-transform: uppercase; color: #2f6b4f; }
                .lede { font-size: 18px; line-height: 1.7; margin: 0; }
                .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 14px; }
                .metric { padding: 16px; border-radius: 16px; background: #f6faf8; border: 1px solid #d9eadf; }
                .metric-label { display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #5d7a6e; margin-bottom: 10px; }
                ul { margin: 0; padding-left: 20px; line-height: 1.8; }
                .timeline-item { padding: 16px 0; border-top: 1px solid #e5e7eb; }
                .timeline-item:first-child { border-top: 0; padding-top: 0; }
                .timeline-kicker { font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #5d7a6e; margin-bottom: 8px; }
                .timeline-summary { font-size: 16px; line-height: 1.7; }
                .gallery { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
                .gallery-item { margin: 0; }
                .gallery-item img { width: 100%; height: 240px; object-fit: cover; border-radius: 18px; display: block; }
                .gallery-item figcaption { margin-top: 10px; font-size: 13px; color: #6b7280; line-height: 1.6; }
                a { color: #2f6b4f; }
                @media print {
                    body { background: white; }
                    .page { max-width: none; padding: 24px; }
                    .section { box-shadow: none; border: 1px solid #e5e7eb; }
                }
            </style>
        </head>
        <body>
            <main class="page">
                <section class="hero">
                    <h1>${e.headline}</h1>
                    <p>${e.subheadline||""}</p>
                </section>
                <section class="section">
                    <h2>Overview</h2>
                    <p class="lede">${e.summary||""}</p>
                </section>
                <section class="section">
                    <h2>Metrics</h2>
                    <div class="metrics">${n}</div>
                </section>
                <section class="section">
                    <h2>Accomplishments</h2>
                    <ul>${r}</ul>
                </section>
                <section class="section">
                    <h2>Timeline</h2>
                    ${a}
                </section>
                <section class="section">
                    <h2>Lessons</h2>
                    <ul>${o}</ul>
                </section>
                ${e.resources?.length?`<section class="section"><h2>Resources</h2><ul>${m}</ul></section>`:""}
                ${e.gallery?.length?`<section class="section"><h2>Gallery</h2><div class="gallery">${p}</div></section>`:""}
            </main>
        </body>
        </html>
    `}export{b,f as g,h,u as p};
