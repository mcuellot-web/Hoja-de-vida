const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    // Construir la ruta del archivo
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    // Obtener la extensión del archivo
    const extname = String(path.extname(filePath)).toLowerCase();
    
    // Tipos MIME
    const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon'
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    // Leer el archivo
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // Archivo no encontrado
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - Página no encontrada</h1>');
            } else {
                // Error del servidor
                res.writeHead(500);
                res.end('Error interno del servidor: ' + err.code);
            }
        } else {
            // Éxito
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// Iniciar servidor en el puerto 3000
const PORT = 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log('========================================');
    console.log('🚀 Servidor Node.js corriendo');
    console.log(`📍 http://localhost:${PORT}`);
    console.log(`📍 http://127.0.0.1:${PORT}`);
    console.log(`📁 Sirviendo: ${__dirname}`);
    console.log('========================================');
    console.log('Presiona Ctrl+C para detener');
});

// Manejar cierre limpio
process.on('SIGINT', () => {
    console.log('\n🛑 Servidor detenido');
    process.exit();
});
