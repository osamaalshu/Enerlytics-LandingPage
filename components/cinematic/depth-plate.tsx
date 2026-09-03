"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { MediaSource } from "@/components/cinematic/media-source";
import { cn } from "@/lib/cn";

/**
 * DepthPlate — a still photograph with real parallax.
 *
 * Each plate ships with a depth map (assets-src/depth.py → /media/<id>-depth.jpg,
 * Depth Anything V2 run locally). A ~60-line WebGL fragment shader displaces
 * the colour texture by depth, driven by scroll position and pointer, so the
 * foreground equipment slides against the jebel and sky like a camera move.
 * Small, dependency-free, one draw call per frame, only while on screen.
 *
 * Falls back to the plain poster (MediaSource) on reduced motion, coarse
 * pointers, missing depth map, or no WebGL. The poster always renders first,
 * so LCP never waits on the canvas.
 */
const VERT = `attribute vec2 p;varying vec2 v;void main(){v=vec2(p.x*.5+.5,1.-(p.y*.5+.5));gl_Position=vec4(p,0.,1.);}`;
const FRAG = `precision mediump float;varying vec2 v;uniform sampler2D c;uniform sampler2D d;uniform vec2 o;uniform vec2 s;uniform float z;
void main(){
  // cover-fit the texture into the canvas
  vec2 uv=(v-.5)*s+.5;
  uv=(uv-.5)/z+.5;
  float depth=texture2D(d,uv).r;
  vec2 shift=o*(depth-.5);
  vec4 col=texture2D(c,uv+shift);
  // vignette
  float vig=smoothstep(1.15,.35,length((v-.5)*vec2(1.,.85)));
  gl_FragColor=vec4(col.rgb*mix(.78,1.06,vig),1.);
}`;

export function DepthPlate({
  id,
  alt,
  focal = "50% 50%",
  strength = 0.028,
  className,
  priority = false,
}: {
  id: string;
  alt: string;
  focal?: string;
  /** max UV displacement at the depth extremes */
  strength?: number;
  className?: string;
  priority?: boolean;
}) {
  const reduced = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) return;

    let raf = 0;
    let alive = true;
    let visible = false;
    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    let img: HTMLImageElement | null = null;

    const load = (src: string) =>
      new Promise<HTMLImageElement>((res, rej) => {
        const i = new Image();
        i.onload = () => res(i);
        i.onerror = rej;
        i.src = src;
      });

    (async () => {
      let depth: HTMLImageElement;
      try {
        [img, depth] = await Promise.all([load(`/media/${id}-1920.jpg`), load(`/media/${id}-depth.jpg`)]);
      } catch {
        return; // no depth map → poster only
      }
      if (!alive) return;
      const prog = gl.createProgram()!;
      const sh = (t: number, src: string) => {
        const s = gl.createShader(t)!;
        gl.shaderSource(s, src);
        gl.compileShader(s);
        gl.attachShader(prog, s);
      };
      sh(gl.VERTEX_SHADER, VERT);
      sh(gl.FRAGMENT_SHADER, FRAG);
      gl.linkProgram(prog);
      gl.useProgram(prog);
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, "p");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      const tex = (unit: number, image: HTMLImageElement, name: string) => {
        const t = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, t);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.uniform1i(gl.getUniformLocation(prog, name), unit);
      };
      tex(0, img, "c");
      tex(1, depth, "d");
      const uO = gl.getUniformLocation(prog, "o");
      const uS = gl.getUniformLocation(prog, "s");
      const uZ = gl.getUniformLocation(prog, "z");

      const resize = () => {
        const r = wrap.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        canvas.width = Math.round(r.width * dpr);
        canvas.height = Math.round(r.height * dpr);
        gl.viewport(0, 0, canvas.width, canvas.height);
        // cover-fit scale: shrink the axis that would overflow
        const ia = img!.width / img!.height;
        const ca = r.width / r.height;
        gl.uniform2f(uS, ca > ia ? 1 : ca / ia, ca > ia ? ia / ca : 1);
      };
      resize();
      window.addEventListener("resize", resize);

      const io = new IntersectionObserver((e) => { visible = e.some((x) => x.isIntersecting); }, { threshold: 0 });
      io.observe(wrap);

      const onMove = (e: PointerEvent) => {
        const r = wrap.getBoundingClientRect();
        target.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
        target.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
      };
      window.addEventListener("pointermove", onMove, { passive: true });

      const frame = () => {
        if (!alive) return;
        raf = requestAnimationFrame(frame);
        if (!visible) return;
        const r = wrap.getBoundingClientRect();
        // scroll contributes a vertical camera drift, pointer a horizontal tilt
        const scrollY = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
        cur.x += (target.x * 0.6 - cur.x) * 0.05;
        cur.y += ((target.y * 0.4 + scrollY * 1.2) - cur.y) * 0.05;
        gl.uniform2f(uO, -cur.x * strength, cur.y * strength);
        gl.uniform1f(uZ, 1.06);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      };
      setReady(true);
      frame();

      return () => {
        window.removeEventListener("resize", resize);
        window.removeEventListener("pointermove", onMove);
        io.disconnect();
      };
    })();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
    };
  }, [id, reduced, strength]);

  return (
    <div ref={wrapRef} className={cn("absolute inset-0 overflow-hidden bg-ink", className)}>
      <MediaSource id={id} alt={alt} focal={focal} priority={priority} drift={!ready} />
      <canvas
        ref={canvasRef}
        aria-hidden
        className={cn("absolute inset-0 h-full w-full transition-opacity duration-700", ready ? "opacity-100" : "opacity-0")}
      />
    </div>
  );
}
