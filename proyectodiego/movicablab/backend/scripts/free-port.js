#!/usr/bin/env node
/**
 * free-port.js
 * Libera el puerto configurado (PORT env o 3002) antes de arrancar el servidor.
 * Solo aplica en entornos Unix/Linux con lsof disponible;
 * en otros sistemas se ignora silenciosamente.
 */
'use strict';

const { execSync } = require('child_process');

const port = process.env.PORT || 3002;

try {
  const result = execSync(`lsof -ti tcp:${port}`, { encoding: 'utf8' }).trim();
  if (result) {
    result.split('\n').forEach((pid) => {
      try {
        process.kill(Number(pid), 'SIGTERM');
        console.log(`[free-port] PID ${pid} liberado del puerto ${port}`);
      } catch (_) {
        // proceso ya terminó
      }
    });
  }
} catch (_) {
  // lsof no disponible o puerto ya libre — continuar normalmente
}
