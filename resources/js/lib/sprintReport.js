const REPORT_VERSION = 'sprint-report-v2';

function resolveImageUrl(path) {
    if (!path) {
        return null;
    }

    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
        return path;
    }

    if (path.startsWith('/storage/')) {
        return path;
    }

    return `/storage/${path.replace(/^\/+/, '')}`;
}

function formatLegacyReport(rawSummary, sprint) {
    const imageMatch = rawSummary?.match(/\[IMAGES:(.*?)\]/);
    const gallery = imageMatch?.[1]
        ? imageMatch[1]
            .split(',')
            .map((item, index) => ({
                url: resolveImageUrl(item.trim()),
                caption: `Sprint image ${index + 1}`,
                day_number: null,
                position: index + 1,
            }))
            .filter((item) => item.url)
        : [];

    const cleanSummary = (rawSummary || '').replace(/\n\n\[IMAGES:.*?\]/, '').trim();

    return {
        version: 'legacy-report',
        style: 'professional',
        headline: sprint?.title ? `Sprint report for ${sprint.title}` : 'Sprint report',
        subheadline: 'Legacy summary',
        preview: cleanSummary,
        summary: cleanSummary,
        metrics: {
            duration_days: sprint?.duration_days ?? '-',
            updates_posted: '-',
            score: '-',
            reactions_received: '-',
            rank_label: '-',
            images_count: gallery.length,
            resources_count: 0,
        },
        accomplishments: [],
        timeline: [],
        lessons: [],
        resources: [],
        gallery,
        hashtags: [],
        formats: {
            linkedin: cleanSummary,
            portfolio: cleanSummary,
            caption: cleanSummary,
        },
    };
}

export function parseSprintReport(rawSummary, sprint = null) {
    if (!rawSummary || !rawSummary.trim()) {
        return null;
    }

    try {
        const parsed = JSON.parse(rawSummary);

        if (!parsed?.version || parsed.version !== REPORT_VERSION) {
            return formatLegacyReport(rawSummary, sprint);
        }

        return {
            ...parsed,
            metrics: {
                duration_days: parsed.metrics?.duration_days ?? sprint?.duration_days ?? '-',
                updates_posted: parsed.metrics?.updates_posted ?? '-',
                score: parsed.metrics?.score ?? '-',
                reactions_received: parsed.metrics?.reactions_received ?? '-',
                rank_label: parsed.metrics?.rank_label ?? '-',
                images_count: parsed.metrics?.images_count ?? (parsed.gallery || []).length,
                resources_count: parsed.metrics?.resources_count ?? (parsed.resources || []).length,
            },
            gallery: (parsed.gallery || []).map((item, index) => ({
                ...item,
                position: item.position ?? index + 1,
                url: resolveImageUrl(item.url),
            })),
            preview: parsed.preview || parsed.summary || parsed.headline || '',
            formats: {
                linkedin: parsed.formats?.linkedin || parsed.summary || '',
                portfolio: parsed.formats?.portfolio || parsed.summary || '',
                caption: parsed.formats?.caption || parsed.summary || '',
            },
        };
    } catch (error) {
        return formatLegacyReport(rawSummary, sprint);
    }
}

export function hasSprintReport(rawSummary) {
    return Boolean(rawSummary && rawSummary.trim().length > 0);
}

export function getSprintReportPreview(rawSummary, sprint = null) {
    return parseSprintReport(rawSummary, sprint)?.preview || '';
}

export function buildPrintableReportHtml(report, sprint) {
    const metricsEntries = [
        ['Duration', `${report.metrics?.duration_days ?? sprint?.duration_days ?? '-'} days`],
        ['Updates', `${report.metrics?.updates_posted ?? '-'}`],
        ['Score', `${report.metrics?.score ?? '-'}`],
        ['Reactions', `${report.metrics?.reactions_received ?? '-'}`],
        ['Rank', `${report.metrics?.rank_label ?? '-'}`],
    ];

    const metricsHtml = metricsEntries
        .map(([label, value]) => `<div class="metric"><span class="metric-label">${label}</span><strong>${value}</strong></div>`)
        .join('');

    const accomplishmentsHtml = (report.accomplishments || [])
        .map((item) => `<li>${item}</li>`)
        .join('');

    const timelineHtml = (report.timeline || [])
        .map(
            (item) => `
                <div class="timeline-item">
                    <div class="timeline-kicker">${item.title} • Day ${item.day_number ?? '-'}</div>
                    <div class="timeline-summary">${item.summary}</div>
                </div>
            `
        )
        .join('');

    const lessonsHtml = (report.lessons || [])
        .map((item) => `<li>${item}</li>`)
        .join('');

    const resourcesHtml = (report.resources || [])
        .map((item) => `<li><a href="${item}" target="_blank" rel="noopener noreferrer">${item}</a></li>`)
        .join('');

    const galleryHtml = (report.gallery || [])
        .map(
            (item) => `
                <figure class="gallery-item">
                    <img src="${item.url}" alt="${item.caption || 'Sprint image'}" />
                    <figcaption>${item.caption || ''}</figcaption>
                </figure>
            `
        )
        .join('');

    return `
        <!doctype html>
        <html>
        <head>
            <meta charset="utf-8" />
            <title>${report.headline}</title>
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
                    <h1>${report.headline}</h1>
                    <p>${report.subheadline || ''}</p>
                </section>
                <section class="section">
                    <h2>Overview</h2>
                    <p class="lede">${report.summary || ''}</p>
                </section>
                <section class="section">
                    <h2>Metrics</h2>
                    <div class="metrics">${metricsHtml}</div>
                </section>
                <section class="section">
                    <h2>Accomplishments</h2>
                    <ul>${accomplishmentsHtml}</ul>
                </section>
                <section class="section">
                    <h2>Timeline</h2>
                    ${timelineHtml}
                </section>
                <section class="section">
                    <h2>Lessons</h2>
                    <ul>${lessonsHtml}</ul>
                </section>
                ${report.resources?.length ? `<section class="section"><h2>Resources</h2><ul>${resourcesHtml}</ul></section>` : ''}
                ${report.gallery?.length ? `<section class="section"><h2>Gallery</h2><div class="gallery">${galleryHtml}</div></section>` : ''}
            </main>
        </body>
        </html>
    `;
}
