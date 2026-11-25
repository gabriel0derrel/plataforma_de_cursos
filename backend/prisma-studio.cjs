const { spawn } = require('node:child_process');
const { connect, createServer } = require('node:net');

const studioPort = 5555;
const studio = spawn('./node_modules/.bin/prisma', [
  'studio', '--port', String(studioPort), '--browser', 'none',
], { stdio: 'inherit' });

// Studio 7 escuta no loopback. A porta publicada do Docker chega ao relay,
// que preserva o Host e a Origin do navegador ao encaminhar a conexão.
const relay = createServer((client) => {
  const upstream = connect(studioPort, '127.0.0.1');
  client.on('error', () => upstream.destroy());
  upstream.on('error', () => client.destroy());
  client.on('close', () => upstream.destroy());
  upstream.on('close', () => client.destroySoon());
  client.pipe(upstream);
  upstream.pipe(client);
});

relay.on('error', (error) => {
  console.error('Prisma Studio relay:', error.message);
  process.exitCode = 1;
  studio.kill();
});

studio.on('error', (error) => {
  console.error('Prisma Studio:', error.message);
  process.exit(1);
});

studio.on('exit', (code, signal) => {
  const interrupted = signal === 'SIGTERM' || signal === 'SIGINT';
  process.exit(process.exitCode || (code ?? (interrupted ? 0 : 1)));
});
process.on('SIGTERM', () => studio.kill('SIGTERM'));
process.on('SIGINT', () => studio.kill('SIGINT'));

relay.listen(5556, '0.0.0.0');
