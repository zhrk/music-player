const { serve } = require('@hono/node-server');
const { Hono } = require('hono');
const musicMetadata = require('music-metadata');
const emptyCover = require('./emptyCover');

const config = { headers: { 'Content-Type': 'image/jpeg' } };

const app = new Hono({ port: 4445 });

app.get('/cover', async (c) => {
  const src = c.req.query('src');

  const metadata = await musicMetadata.parseFile(decodeURIComponent(src));

  const picture = metadata.common.picture;

  if (!picture) {
    return new Response(emptyCover, {
      headers: { 'Content-Type': 'image/png', 'Content-Length': emptyCover.length.toString() },
    });
  }

  return new Response(picture[0].data, config);
});

const server = serve(app);

module.exports = server;
