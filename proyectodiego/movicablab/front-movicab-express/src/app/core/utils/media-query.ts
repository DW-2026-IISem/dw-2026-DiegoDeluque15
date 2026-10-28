import { signal, effect, OnDestroy } from '@angular/core';

/**
 * Observa una media query y devuelve un signal reactivo con su estado.
 * Se limpia automáticamente cuando el contexto se destruye.
 */
export function watchMediaQuery(query: string) {
  const mql = window.matchMedia(query);
  const matches = signal(mql.matches);

  const handler = (e: MediaQueryListEvent) => matches.set(e.matches);
  mql.addEventListener('change', handler);

  return {
    matches,
    destroy: () => mql.removeEventListener('change', handler),
  };
}
