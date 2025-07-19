const { serve } = require('@hono/node-server');
const { Hono } = require('hono');
const musicMetadata = require('music-metadata');

const config = { headers: { 'Content-Type': 'image/jpeg' } };

const app = new Hono({ port: 4445 });

app.get('/cover/:path', async (c) => {
  const pathParam = c.req.param('path');

  const metadata = await musicMetadata.parseFile(decodeURIComponent(pathParam));

  const picture = metadata.common.picture;

  if (!picture) return c.body(null, 204);

  return new Response(picture[0].data, config);
});

serve(app);
