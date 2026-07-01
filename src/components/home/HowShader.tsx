"use client";

import { useEffect, useRef } from "react";

// Decorative WebGL fbm-noise background for the How-It-Works band
// (README §Homepage-only detail). Cool grey + faint petrol flow.
// Falls back silently to the section's CSS mesh gradient if WebGL is
// unavailable, and freezes on the first frame under reduced motion.
export default function HowShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { premultipliedAlpha: false });
    if (!gl) return;

    const vs = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
    const fs = `
      precision highp float;
      uniform float u_t; uniform vec2 u_res; uniform vec3 u_acc;
      float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float n(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);
        return mix(mix(h(i),h(i+vec2(1,0)),u.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),u.x),u.y);}
      float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p*=2.02;a*=.5;}return v;}
      void main(){
        vec2 uv=gl_FragCoord.xy/u_res.xy;
        vec2 p=uv*2.2; float t=u_t*0.05;
        float w=fbm(p*1.5-t);
        float f=fbm(p+vec2(t,t*.6)+w*0.6);
        vec3 col=mix(vec3(1.),u_acc,smoothstep(0.35,0.9,f));
        float al=(0.16+0.34*f)*smoothstep(0.02,0.5,uv.x*(1.0-uv.x)*4.0);
        gl_FragColor=vec4(col,al);
      }`;

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type);
      if (!sh) return null;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    };
    const v = compile(gl.VERTEX_SHADER, vs);
    const f = compile(gl.FRAGMENT_SHADER, fs);
    if (!v || !f) return;
    const prog = gl.createProgram();
    gl.attachShader(prog, v);
    gl.attachShader(prog, f);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const uT = gl.getUniformLocation(prog, "u_t");
    const uRes = gl.getUniformLocation(prog, "u_res");
    const uAcc = gl.getUniformLocation(prog, "u_acc");
    gl.uniform3f(uAcc, 0.204, 0.357, 0.42); // #345B6B

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const reduce =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    let raf = 0;
    const start = performance.now();
    const frame = (now: number) => {
      gl.uniform1f(uT, (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduce) raf = requestAnimationFrame(frame);
    };
    if (reduce) frame(start);
    else raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
