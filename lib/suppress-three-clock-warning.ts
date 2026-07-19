/**
 * @react-three/fiber 9.x still instantiates deprecated THREE.Clock internally.
 * Remove this once R3F v10 stable is released.
 */
const CLOCK_DEPRECATION =
  "THREE.Clock: This module has been deprecated. Please use THREE.Timer instead.";

let patched = false;

export function suppressThreeClockWarning() {
  if (patched || typeof window === "undefined") {
    return;
  }

  patched = true;
  const originalWarn = console.warn.bind(console);

  console.warn = (...args: unknown[]) => {
    const first = args[0];
    if (typeof first === "string" && first.includes(CLOCK_DEPRECATION)) {
      return;
    }
    originalWarn(...args);
  };
}
