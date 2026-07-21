/**
 * RPIX — Cinematic Preloader
 */

import gsap from 'gsap';

const STORAGE_KEY = 'rpix-visited';

export function shouldShowLoader(): boolean {
  if (typeof sessionStorage === 'undefined') return true;
  // Show once per session
  return !sessionStorage.getItem(STORAGE_KEY);
}

export function markLoaderSeen() {
  try {
    sessionStorage.setItem(STORAGE_KEY, '1');
  } catch {
    /* ignore */
  }
}

export function createLoader(): HTMLElement {
  const loader = document.createElement('div');
  loader.className = 'rpix-loader';
  loader.id = 'rpix-loader';
  loader.innerHTML = `
    <div class="rpix-loader-logo" aria-label="RPIX">RPIX</div>
    <div class="rpix-loader-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
      <div class="rpix-loader-bar-fill"></div>
    </div>
    <div class="text-label" style="color: var(--rpix-muted-fg); opacity: 0.6;">Crafting light</div>
  `;
  document.body.prepend(loader);
  return loader;
}

export async function runLoader(): Promise<void> {
  if (typeof window === 'undefined') return;
  if (!shouldShowLoader()) return;

  const loader = createLoader();
  const fill = loader.querySelector('.rpix-loader-bar-fill') as HTMLElement;
  const logo = loader.querySelector('.rpix-loader-logo') as HTMLElement;
  const bar = loader.querySelector('.rpix-loader-bar') as HTMLElement;

  gsap.set(logo, { opacity: 0, letterSpacing: '0.8em' });
  gsap.set(bar, { opacity: 0 });

  await new Promise<void>((resolve) => {
    const tl = gsap.timeline({
      onComplete: () => {
        markLoaderSeen();
        resolve();
      },
    });

    tl.to(logo, {
      opacity: 1,
      letterSpacing: '0.4em',
      duration: 1.0,
      ease: 'power3.out',
    })
      .to(bar, { opacity: 1, duration: 0.4 }, '-=0.4')
      .to(fill, {
        scaleX: 1,
        duration: 1.4,
        ease: 'power2.inOut',
        onUpdate: function () {
          const p = Math.round(this.progress() * 100);
          bar.setAttribute('aria-valuenow', String(p));
        },
      })
      .to(loader, {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut',
        delay: 0.15,
        onComplete: () => loader.remove(),
      });
  });
}
