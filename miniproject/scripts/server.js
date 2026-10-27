/**
 * MiniProject WebLab - Zero-Dependency Local Static Server
 * Serves the workspace so that both the dashboard and all nested assignments,
 * images, stylesheets, scripts, audio, and video files resolve properly.
 * 
 * Usage:
 *   node scripts/server.js [port]
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = parseInt(process.argv[2], 10) || 3000;
// Root directory is workspace root (parent of miniproject) so that ../ paths resolve cleanly
const workspaceRoot = path.resolve(__dirname, '..', '..');

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.pdf': 'application/pdf',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  
  // Default route: redirect root to miniproject/index.html
  if (reqPath === '/' || reqPath === '/miniproject' || reqPath === '/miniproject/') {
    res.writeHead(302, { Location: '/miniproject/index.html' });
    res.end();
    return;
  }

  // Resolve safe file path within workspaceRoot
  const safePath = path.normalize(path.join(workspaceRoot, reqPath));
  if (!safePath.startsWith(workspaceRoot)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(safePath, (err, stats) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
      res.end(`404 Not Found: ${reqPath}`);
      return;
    }

    let filePath = safePath;
    if (stats.isDirectory()) {
      filePath = path.join(safePath, 'index.html');
    }

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
        res.end(`404 Not Found: ${reqPath}`);
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(content);
    });
  });
});

server.listen(PORT, () => {
  console.log('='.repeat(65));
  console.log(' MiniProject — WebLab Development Server Running');
  console.log(` WebLab Dashboard URL : http://localhost:${PORT}/miniproject/index.html`);
  console.log(` Serving Workspace   : ${workspaceRoot}`);
  console.log(' Press Ctrl+C to terminate the server');
  console.log('='.repeat(65));
});
