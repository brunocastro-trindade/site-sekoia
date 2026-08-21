"use client";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
// "ogl" (WebGL) é importado dinamicamente dentro do efeito abaixo, só quando o
// componente está prestes a entrar na viewport — evita empacotar essa lib no
// bundle principal para quem tem prefers-reduced-motion, sem WebGL, ou nunca
// rola até essa seção.

const VERTEX = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  precision highp float;

  uniform sampler2D tMap;
  uniform vec2 uImageSize;
  uniform vec2 uPlaneSize;
  uniform float uProgress;
  uniform float uEdge;
  uniform vec2 uMouse;
  uniform float uHover;
  uniform float uZoom;
  uniform vec3 uTintLow;
  uniform vec3 uTintHigh;
  uniform float uDuotone;
  uniform vec2 uFocus;

  varying vec2 vUv;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                    + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
                             dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  vec2 coverUv(vec2 uv, vec2 imageSize, vec2 planeSize, vec2 focus) {
    float rPlane = planeSize.x / planeSize.y;
    float rImage = imageSize.x / imageSize.y;
    vec2 newSize = rPlane < rImage
      ? vec2(imageSize.x * planeSize.y / imageSize.y, planeSize.y)
      : vec2(planeSize.x, imageSize.y * planeSize.x / imageSize.x);
    vec2 offset = (rPlane < rImage
      ? vec2((newSize.x - planeSize.x) * focus.x, (newSize.y - planeSize.y) * 0.5)
      : vec2((newSize.x - planeSize.x) * 0.5, (newSize.y - planeSize.y) * focus.y)) / newSize;
    return uv * planeSize / newSize + offset;
  }

  void main() {
    vec2 screenUv = (vUv - 0.5) / uZoom - uMouse * (0.6 * uHover / uZoom) + 0.5;
    vec2 uv = coverUv(screenUv, uImageSize, uPlaneSize, uFocus);

    vec4 tex = texture2D(tMap, uv);

    float luma = dot(tex.rgb, vec3(0.299, 0.587, 0.114));
    vec3 duotone = mix(uTintLow, uTintHigh, luma);
    tex.rgb = mix(tex.rgb, duotone, uDuotone);

    float n1 = snoise(vUv * 1.4 + 4.0);
    float n2 = snoise(vUv * 4.5 + 9.0) * 0.18;
    float n = n1 + n2;
    float threshold = clamp(n * 0.5 + 0.5, 0.0, 1.0);

    float alpha = smoothstep(threshold - uEdge, threshold + uEdge, uProgress) * tex.a;

    gl_FragColor = vec4(tex.rgb, alpha);
  }
`;

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

const damp = (current: number, target: number, lambda: number, dt: number) =>
  current + (target - current) * (1 - Math.exp(-lambda * dt));

function supportsWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

export interface ScrollDissolveImageProps {
  src: string;
  alt: string;
  aspectRatio?: string;
  parallaxIntensity?: number;
  edge?: number;
  duotone?: number;
  duotoneFrom?: string;
  duotoneTo?: string;
  focus?: [number, number];
  zoom?: number;
  onClick?: () => void;
  className?: string;
}

function hexToRgb01(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const n = parseInt(clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export function ScrollDissolveImage({
  src,
  alt,
  aspectRatio = "4 / 3",
  parallaxIntensity = 0.15,
  edge = 0.06,
  duotone = 1,
  duotoneFrom = "#1a2410",
  duotoneTo = "#c6ff4d",
  focus = [0.5, 0.5],
  zoom = 1,
  onClick,
  className = "",
}: ScrollDissolveImageProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasHostRef = useRef<HTMLDivElement | null>(null);

  const [webglOk, setWebglOk] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [imgVisible, setImgVisible] = useState(false);
  const [nearViewport, setNearViewport] = useState(false);

  useEffect(() => {
    setWebglOk(supportsWebGL());
    setReducedMotion(prefersReducedMotion());
  }, []);

  useEffect(() => {
    if (webglOk && !reducedMotion) return undefined;
    const el = containerRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImgVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [webglOk, reducedMotion]);

  // Dispara o import da lib WebGL e a montagem do canvas só quando o card está
  // a ~20% da viewport de distância, em vez de fazer isso incondicionalmente
  // no mount (a maioria das instâncias começa fora da tela, abaixo do Hero).
  useEffect(() => {
    if (!webglOk || reducedMotion) return undefined;
    const el = containerRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearViewport(true);
          io.disconnect();
        }
      },
      { rootMargin: "20% 0px 20% 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [webglOk, reducedMotion]);

  const progressTarget = useRef(0);
  useEffect(() => {
    if (!webglOk || reducedMotion) return undefined;
    const el = containerRef.current;
    if (!el) return undefined;

    let raf = 0;
    let active = false;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh;
      const end = vh * 0.45;
      progressTarget.current = clamp((start - rect.top) / (start - end), 0, 1);
    };

    const loop = () => {
      measure();
      if (active) raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting;
        if (active && !raf) {
          raf = requestAnimationFrame(loop);
        } else if (!active && raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { rootMargin: "20% 0px 20% 0px", threshold: 0 },
    );
    io.observe(el);
    measure();

    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [webglOk, reducedMotion]);

  const mouseTarget = useRef({ x: 0, y: 0 });
  const hoverTarget = useRef(0);

  const handlePointerMove = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseTarget.current = {
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
    };
  }, []);

  const handlePointerEnter = useCallback(() => {
    hoverTarget.current = 1;
  }, []);

  const handlePointerLeave = useCallback(() => {
    hoverTarget.current = 0;
    mouseTarget.current = { x: 0, y: 0 };
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if ((e.key === "Enter" || e.key === " ") && onClick) {
        e.preventDefault();
        onClick();
      }
    },
    [onClick],
  );

  useEffect(() => {
    if (!webglOk || reducedMotion || !nearViewport) return undefined;
    const host = canvasHostRef.current;
    const container = containerRef.current;
    if (!host || !container) return undefined;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    import("ogl").then(({ Renderer, Triangle, Program, Mesh, Texture }) => {
      if (cancelled) return;

      const renderer = new Renderer({ alpha: true, antialias: true, dpr: Math.min(window.devicePixelRatio || 1, 2) });
      const gl = renderer.gl;
      gl.clearColor(0, 0, 0, 0);
      host.appendChild(gl.canvas);

      const geometry = new Triangle(gl);
      const texture = new Texture(gl, { generateMipmaps: false });

      const image = new Image();
      image.crossOrigin = "anonymous";
      image.src = src;
      image.onload = () => {
        texture.image = image;
        program.uniforms.uImageSize.value = [image.naturalWidth, image.naturalHeight];
      };

      const program = new Program(gl, {
        vertex: VERTEX,
        fragment: FRAGMENT,
        transparent: true,
        uniforms: {
          tMap: { value: texture },
          uImageSize: { value: [1, 1] },
          uPlaneSize: { value: [1, 1] },
          uProgress: { value: 0 },
          uEdge: { value: edge },
          uMouse: { value: [0, 0] },
          uHover: { value: 0 },
          uZoom: { value: 1 },
          uTintLow: { value: hexToRgb01(duotoneFrom) },
          uTintHigh: { value: hexToRgb01(duotoneTo) },
          uDuotone: { value: duotone },
          uFocus: { value: focus },
        },
      });

      const mesh = new Mesh(gl, { geometry, program });

      let raf = 0;
      let lastTime = performance.now();
      let disposed = false;

      const resize = () => {
        const { clientWidth, clientHeight } = container;
        renderer.setSize(clientWidth, clientHeight);
        program.uniforms.uPlaneSize.value = [clientWidth, clientHeight];
      };

      let resizeTimer: ReturnType<typeof setTimeout> | null = null;
      const onResize = () => {
        if (resizeTimer) return;
        resizeTimer = setTimeout(() => {
          resize();
          resizeTimer = null;
        }, 120);
      };

      resize();
      window.addEventListener("resize", onResize);

      const render = (now: number) => {
        const dt = Math.min((now - lastTime) / 1000, 0.05);
        lastTime = now;

        const p = program.uniforms.uProgress.value as number;
        program.uniforms.uProgress.value = damp(p, progressTarget.current, 10, dt);

        const h = program.uniforms.uHover.value as number;
        const nextHover = damp(h, hoverTarget.current, 8, dt);
        program.uniforms.uHover.value = nextHover;
        program.uniforms.uZoom.value = zoom * (1 + parallaxIntensity * nextHover);

        const m = program.uniforms.uMouse.value as [number, number];
        program.uniforms.uMouse.value = [
          damp(m[0], mouseTarget.current.x, 10, dt),
          damp(m[1], mouseTarget.current.y, 10, dt),
        ];

        renderer.render({ scene: mesh });
        if (!disposed) raf = requestAnimationFrame(render);
      };
      raf = requestAnimationFrame(render);

      cleanup = () => {
        disposed = true;
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", onResize);
        if (resizeTimer) clearTimeout(resizeTimer);
        image.onload = null;
        const loseCtx = gl.getExtension("WEBGL_lose_context");
        loseCtx?.loseContext();
        if (gl.canvas.parentNode === host) host.removeChild(gl.canvas);
      };
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, webglOk, reducedMotion, nearViewport]);

  const wrapperStyle: CSSProperties = { aspectRatio };

  return (
    <div
      ref={containerRef}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? alt : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      onMouseMove={handlePointerMove}
      onMouseEnter={handlePointerEnter}
      onMouseLeave={handlePointerLeave}
      style={{ ...wrapperStyle, "--parallax-intensity": parallaxIntensity } as CSSProperties}
      className={`group relative isolate w-full overflow-hidden rounded-full bg-black outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${onClick ? "cursor-pointer" : ""
        } ${className}`}
    >
      {webglOk && !reducedMotion && (
        <div ref={canvasHostRef} className="absolute inset-0 [&>canvas]:block [&>canvas]:h-full [&>canvas]:w-full" />
      )}

      {(!webglOk || reducedMotion) && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out ${imgVisible ? "opacity-100" : "opacity-0"
            }`}
        />
      )}
    </div>
  );
}

export default ScrollDissolveImage;
