"use client";

import { useEffect, useRef } from "react";

export type NormalizedPointer = {
  x: number;
  y: number;
};

/**
 * Normalized pointer in clip space (-1 … 1), updated from document-level mouse moves.
 */
export function usePagePointer() {
  const pointer = useRef<NormalizedPointer>({ x: 0, y: 0 });

  useEffect(() => {
    let hasGyro = false;

    const update = (clientX: number, clientY: number) => {
      pointer.current.x = (clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -(clientY / window.innerHeight) * 2 + 1;
    };

    const onMouseMove = (event: MouseEvent) => {
      update(event.clientX, event.clientY);
    };

    const onTouchMove = (event: TouchEvent) => {
      if (hasGyro) {
        return;
      }
      const touch = event.touches[0];
      if (touch) {
        update(touch.clientX, touch.clientY);
      }
    };

    const onDeviceOrientation = (event: DeviceOrientationEvent) => {
      const { beta, gamma } = event;
      if (beta !== null && gamma !== null) {
        hasGyro = true;

        // Map left-right tilt (gamma) to x: clamp to [-30, 30] and map to [-1, 1]
        pointer.current.x = Math.max(-1, Math.min(1, gamma / 30));

        // Map front-back tilt (beta) to y: baseline of 60 deg comfort angle, map to [-1, 1]
        // Tilting forward (smaller beta) -> maps to y > 0
        // Tilting backward (larger beta) -> maps to y < 0
        pointer.current.y = Math.max(-1, Math.min(1, -(beta - 60) / 30));
      }
    };

    const requestGyroPermission = async () => {
      const DeviceOrientation = window.DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<PermissionState>;
      };

      if (typeof DeviceOrientation?.requestPermission === "function") {
        try {
          const state = await DeviceOrientation.requestPermission();
          if (state === "granted") {
            window.addEventListener("deviceorientation", onDeviceOrientation, {
              passive: true,
            });
          }
        } catch (err) {
          console.warn("Error requesting device orientation permission:", err);
        }
      } else {
        // Non-iOS or older platforms where permission is not required
        window.addEventListener("deviceorientation", onDeviceOrientation, {
          passive: true,
        });
      }
    };

    const initGyroPermission = () => {
      requestGyroPermission();
      window.removeEventListener("click", initGyroPermission);
      window.removeEventListener("touchstart", initGyroPermission);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("click", initGyroPermission);
    window.addEventListener("touchstart", initGyroPermission);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("click", initGyroPermission);
      window.removeEventListener("touchstart", initGyroPermission);
      window.removeEventListener("deviceorientation", onDeviceOrientation);
    };
  }, []);

  return pointer;
}
