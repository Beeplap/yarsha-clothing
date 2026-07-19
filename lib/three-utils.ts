/**
 * Central tweak panel for the hero 3D blob.
 * Adjust values here; no need to dig through component files.
 */
export const BLOB_CONFIG = {
  /** Overall mesh scale inside the canvas */
  scale: 1.6,
  /** Vertex noise displacement strength */
  distortAmount: 0.16,
  /** Core fill; keep the glass body dark against the hero charcoal */
  coreColor: "#252524",
  /** Fresnel rim; muted sage edge glow */
  rimColor: "#7BA05B",
  /** Organic cell lines */
  gridColor: "#9DB783",
  /** Back-face halo for depth */
  rimGlowColor: "#7BA05B",
  rimGlowCore: "#25301F",
  /** Cell density */
  gridScale: 8.2,
  /** Cell line brightness */
  gridStrength: 0.68,
  /** Fresnel rim intensity */
  rimStrength: 1.02,
  /** Surface opacity */
  opacity: 0.68,
  /** How much page cursor tilts the blob (radians) */
  cursorRotationInfluence: 0.62,
  /** Rotation smoothing (higher = snappier) */
  rotationSmoothing: 3.2,
  /** Subtle idle Y spin (rad/s) when not moving mouse much */
  idleRotationSpeed: 0.06,
} as const;

export function lerp(start: number, end: number, amount: number): number {
  return start + (end - start) * amount;
}

export function damp(
  current: number,
  target: number,
  smoothness: number,
  delta: number,
): number {
  return lerp(current, target, 1 - Math.exp(-smoothness * delta));
}
