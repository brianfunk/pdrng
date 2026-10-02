/** Swagger UI page served at /api/docs. Loads swagger-ui-dist from a CDN and points at our spec. */
export const docsHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>pdrng API</title>
  <meta name="description" content="REST API reference for pdrng: deterministic coin flips, dice, cards, roulette, tarot and fortunes from a seed." />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui.min.css" />
  <style>
    :root { color-scheme: light; }
    body { margin: 0; background: #f7f6f3; }
    .topbar { display: none; }
    .swagger-ui .info .title { font-family: Inter, system-ui, sans-serif; }
    .pdrng-bar { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: .85rem 1.25rem; background: #0b0d12; color: #f7f6f3; font: 500 14px/1 Inter, system-ui, sans-serif; }
    .pdrng-bar a { color: #f5c451; text-decoration: none; }
    .pdrng-bar a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="pdrng-bar"><span>pdrng API &middot; your seed, your number, your fate</span><a href="/">&larr; back to the site</a></div>
  <div id="swagger-ui"></div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui-bundle.min.js" crossorigin></script>
  <script>
    window.ui = SwaggerUIBundle({
      url: '/api/openapi.json',
      dom_id: '#swagger-ui',
      deepLinking: true,
      tryItOutEnabled: true,
      displayRequestDuration: true,
      defaultModelsExpandDepth: 0,
    });
  </script>
</body>
</html>`;
