/**
 * RPIX — Custom Magnetic Cursor
 */

export function initCursor() {
  if (typeof window === 'undefined') return;
  if (window.matchMedia('(pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (document.querySelector('.rpix-cursor')) return;

  document.documentElement.classList.add('cursor-none');

  const cursor = document.createElement('div');
  cursor.className = 'rpix-cursor';
  cursor.setAttribute('aria-hidden', 'true');

  const label = document.createElement('div');
  label.className = 'rpix-cursor-label';
  label.setAttribute('aria-hidden', 'true');

  document.body.appendChild(cursor);
  document.body.appendChild(label);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let curX = mouseX;
  let curY = mouseY;
  let labelX = mouseX;
  let labelY = mouseY;
  let raf = 0;

  const lerp = (a: number, b: number, n: number) => a + (b - a) * n;

  const render = () => {
    curX = lerp(curX, mouseX, 0.18);
    curY = lerp(curY, mouseY, 0.18);
    labelX = lerp(labelX, mouseX, 0.12);
    labelY = lerp(labelY, mouseY, 0.12);

    cursor.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
    label.style.transform = `translate(${labelX}px, ${labelY + 28}px) translate(-50%, 0)`;

    raf = requestAnimationFrame(render);
  };

  const onMove = (e: MouseEvent) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Magnetic attraction
    const magnetic = (e.target as HTMLElement)?.closest?.('[data-magnetic]');
    if (magnetic) {
      const rect = magnetic.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const strength = 0.3;
      mouseX = mouseX + (cx - mouseX) * strength;
      mouseY = mouseY + (cy - mouseY) * strength;
    }
  };

  const onOver = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const hoverEl = target.closest('a, button, [data-cursor], input, textarea, select, [role="button"]');
    if (hoverEl) {
      cursor.classList.add('is-hover');
      const cursorLabel = (hoverEl as HTMLElement).dataset.cursor;
      if (cursorLabel) {
        label.textContent = cursorLabel;
        label.classList.add('is-visible');
      }
    }
  };

  const onOut = (e: MouseEvent) => {
    const related = e.relatedTarget as HTMLElement | null;
    if (!related?.closest?.('a, button, [data-cursor], input, textarea, select, [role="button"]')) {
      cursor.classList.remove('is-hover');
      label.classList.remove('is-visible');
    }
  };

  const onDown = () => cursor.classList.add('is-click');
  const onUp = () => cursor.classList.remove('is-click');

  window.addEventListener('mousemove', onMove, { passive: true });
  document.addEventListener('mouseover', onOver);
  document.addEventListener('mouseout', onOut);
  window.addEventListener('mousedown', onDown);
  window.addEventListener('mouseup', onUp);

  raf = requestAnimationFrame(render);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseover', onOver);
    document.removeEventListener('mouseout', onOut);
    window.removeEventListener('mousedown', onDown);
    window.removeEventListener('mouseup', onUp);
    cursor.remove();
    label.remove();
    document.documentElement.classList.remove('cursor-none');
  };
}
