"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { premultipliedAlpha: false });
    if (!gl) return;

    const vsSource = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
    const fsSource = `
      precision highp float;
      uniform float u_t;
      uniform vec2 u_res;
      uniform vec3 u_acc;
      float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float n(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),u.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),u.x),u.y);}
      float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p*=2.02;a*=.5;}return v;}
      void main(){
        vec2 uv=gl_FragCoord.xy/u_res.xy;
        vec2 p=uv*2.2;
        float t=u_t*0.05;
        float w=fbm(p*1.5-t);
        float f=fbm(p+vec2(t,t*.6)+w*0.6);
        vec3 white=vec3(1.);
        vec3 acc=u_acc;
        vec3 ind=mix(acc,vec3(0.45,0.55,0.95),0.5);
        vec3 col=mix(white,acc,smoothstep(0.35,0.9,f));
        col=mix(col,ind,smoothstep(0.5,1.0,fbm(p*0.8+t))*0.45);
        float al=(0.35+0.55*f)*smoothstep(0.02,0.5,uv.x*(1.0-uv.x)*4.0);
        gl_FragColor=vec4(col,al);
      }
    `;

    const compileShader = (type: number, source: string) => {
      const sh = gl.createShader(type);
      if (!sh) return null;
      gl.shaderSource(sh, source);
      gl.compileShader(sh);
      return sh;
    };

    const program = gl.createProgram();
    const vs = compileShader(gl.VERTEX_SHADER, vsSource);
    const fs = compileShader(gl.FRAGMENT_SHADER, fsSource);
    if (!program || !vs || !fs) return;

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    const lp = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(lp);
    gl.vertexAttribPointer(lp, 2, gl.FLOAT, false, 0, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const uT = gl.getUniformLocation(program, "u_t");
    const uR = gl.getUniformLocation(program, "u_res");
    const uA = gl.getUniformLocation(program, "u_acc");

    const brandColorHex = "1D77F5";
    const r = parseInt(brandColorHex.slice(0, 2), 16) / 255;
    const gVal = parseInt(brandColorHex.slice(2, 4), 16) / 255;
    const b = parseInt(brandColorHex.slice(4, 6), 16) / 255;

    let animationFrameId: number;
    const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;

    const resize = () => {
      const w = canvas.clientWidth || 600;
      const hVal = canvas.clientHeight || 430;
      canvas.width = w * dpr;
      canvas.height = hVal * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resize();
    window.addEventListener("resize", resize);

    const t0 = performance.now();
    const render = () => {
      gl.uniform1f(uT, (performance.now() - t0) / 1000);
      gl.uniform2f(uR, canvas.width, canvas.height);
      gl.uniform3f(uA, r, gVal, b);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const handleGoCreate = () => {
    router.push("/create");
  };

  const handleGoHow = () => {
    router.push("/how-it-works");
  };

  return (
    <div style={{ padding: "46px 24px 90px", display: "flex", flexDirection: "column", alignItems: "center", gap: "18px" }}>
      <div style={{ font: "600 12px/1 'Plus Jakarta Sans'", letterSpacing: ".14em", textTransform: "uppercase", color: "#8a8f99" }}>
        Home · Desktop
      </div>

      {/* ================= DESKTOP ARTBOARD ================= */}
      <div className="desktop-only" style={{ width: "1280px", background: "#fff", borderRadius: "20px", overflow: "hidden", boxShadow: "0 40px 90px rgba(21, 36, 60, .16)", border: "1px solid #E3E7EE" }}>
        {/* HEADER */}
        <div style={{ position: "sticky", top: 0, zIndex: 6, background: "rgba(255, 255, 255, .94)", backdropFilter: "blur(8px)", borderBottom: "1px solid #EBEFF4", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 36px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "9px" }}>
              <img src="/assets/cs-mark.png" alt="" style={{ height: "40px", width: "auto", display: "block" }} />
              <span style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "22px", letterSpacing: "-.02em", color: "#15243C" }}>
                Cutout<span style={{ color: "#1D77F5" }}>Stuff</span>
              </span>
            </Link>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "30px", font: "600 14.5px 'Plus Jakarta Sans'", color: "#3c4658" }}>
            <Link href="/create">Create</Link>
            <Link href="/how-it-works">How It Works</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/gallery">Gallery</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/partner">Partner</Link>
          </div>
          <button
            onClick={handleGoCreate}
            style={{ font: "700 14px 'Plus Jakarta Sans'", color: "#fff", background: "#1D77F5", border: "none", borderRadius: "11px", padding: "12px 20px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px" }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 16V8M12 8l-3 3M12 8l3 3"></path>
              <path d="M20 16.5A4.5 4.5 0 0 0 18 8a6 6 0 0 0-11.5-1.5A4 4 0 0 0 5 16"></path>
            </svg>
            Upload Your Photo
          </button>
        </div>

        {/* HERO */}
        <div style={{ position: "relative", overflow: "hidden", minHeight: "580px", display: "flex", alignItems: "center" }}>
          <img
            src="/assets/hero-lineup-wide.png"
            alt="Life-size foam-board cutouts"
            style={{ position: "absolute", inset: 0, width: "1559px", height: "100%", objectFit: "cover", objectPosition: "center 58%", zIndex: 0, left: "-193px" }}
          />
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              zIndex: 1,
              opacity: 0.85
            }}
          />
          <div style={{ position: "absolute", inset: 0, zIndex: 2, background: "linear-gradient(100deg,#F4F3F1 0%,rgba(244,243,241,.92) 30%,rgba(244,243,241,.5) 46%,rgba(244,243,241,0) 60%)" }}></div>
          <div style={{ position: "relative", zIndex: 3, padding: "0 36px", maxWidth: "560px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "9px", marginBottom: "18px", font: "600 12px/1 'Plus Jakarta Sans'", letterSpacing: ".16em", textTransform: "uppercase", color: "#1D77F5" }}>
              <span style={{ width: "20px", height: "2px", borderRadius: "2px", background: "#1D77F5" }}></span>
              Premium foam-board · Made in the USA
            </div>
            <h1 style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "60px", lineHeight: "1.0", letterSpacing: "-.03em", margin: 0, color: "#15243C" }}>
              Turn any photo into a life-size{" "}
              <span style={{ position: "relative", whiteSpace: "nowrap" }}>
                cutout.
                <svg viewBox="0 0 130 14" preserveAspectRatio="none" style={{ position: "absolute", left: 0, bottom: "-7px", width: "100%", height: "10px" }} fill="none" stroke="#1D77F5" strokeWidth="3.5" strokeLinecap="round">
                  <path d="M4 8 Q 45 2, 72 7 T 126 6"></path>
                </svg>
              </span>
            </h1>
            <p style={{ fontSize: "18px", lineHeight: "1.6", color: "#4A535F", margin: "24px 0 28px", maxWidth: "42ch" }}>
              Upload your photo, pick a size, and check out. We review every order before production, then print and ship a premium foam-board cutout to your door.
            </p>
            <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
              <button
                onClick={handleGoCreate}
                style={{ font: "700 16px 'Plus Jakarta Sans'", color: "#fff", background: "#1D77F5", border: "none", borderRadius: "13px", padding: "16px 26px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "10px", boxShadow: "0 12px 26px rgba(29,119,245,.28)" }}
              >
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 16V8M12 8l-3 3M12 8l3 3"></path>
                  <path d="M20 16.5A4.5 4.5 0 0 0 18 8a6 6 0 0 0-11.5-1.5A4 4 0 0 0 5 16"></path>
                </svg>
                Upload Your Photo
              </button>
              <button
                onClick={handleGoHow}
                style={{ font: "700 16px 'Plus Jakarta Sans'", color: "#15243C", background: "#fff", border: "1.5px solid #DCE3EC", borderRadius: "13px", padding: "14.5px 24px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "9px" }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#1D77F5" strokeWidth="2" strokeLinejoin="round">
                  <path d="M6 4l14 8-14 8z"></path>
                </svg>
                See How It Works
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "13px", marginTop: "26px" }}>
              <div style={{ display: "flex" }}>
                <span style={{ display: "block", width: "36px", height: "36px", border: "2px solid #fff", borderRadius: "50%", background: "#ccc" }} />
                <span style={{ display: "block", width: "36px", height: "36px", border: "2px solid #fff", borderRadius: "50%", background: "#bbb", marginLeft: "-11px" }} />
                <span style={{ display: "block", width: "36px", height: "36px", border: "2px solid #fff", borderRadius: "50%", background: "#aaa", marginLeft: "-11px" }} />
                <span style={{ display: "block", width: "36px", height: "36px", border: "2px solid #fff", borderRadius: "50%", background: "#999", marginLeft: "-11px" }} />
              </div>
              <div>
                <div style={{ color: "#F4B63F", fontSize: "14px", letterSpacing: "1.5px" }}>★★★★★</div>
                <div style={{ font: "600 13px 'Plus Jakarta Sans'", color: "#4A535F", marginTop: "2px" }}>4.9/5 from 8,500+ happy customers</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "9px", marginTop: "18px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B98645" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="11" width="16" height="10" rx="2"></rect>
                <path d="M8 11V7a4 4 0 0 1 8 0v4"></path>
              </svg>
              <span style={{ font: "500 13.5px/1.5 'Plus Jakarta Sans'", color: "#4A535F" }}>
                Your photo stays private. We review every order before production.
              </span>
            </div>
          </div>
        </div>

        {/* TRUST BAR */}
        <div style={{ background: "#F7F9FC", borderTop: "1px solid #EBEFF4", borderBottom: "1px solid #EBEFF4", padding: "20px 36px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "9px" }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1D77F5" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l3 5-9 13L3 8z"></path><path d="M3 8h18M9 3l-2 5 5 13 5-13-2-5"></path></svg><span style={{ font: "600 12.5px/1.3 'Plus Jakarta Sans'", color: "#3c4658" }}>Premium<br />quality</span></div>
          <div style={{ width: "1px", height: "30px", background: "#E3E7EE" }}></div>
          <div style={{ display: "flex", alignItems: "center", gap: "9px" }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1D77F5" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3L5 21M12 3l7 18M8 14h8"></path></svg><span style={{ font: "600 12.5px/1.3 'Plus Jakarta Sans'", color: "#3c4658" }}>Stand<br />included</span></div>
          <div style={{ width: "1px", height: "30px", background: "#E3E7EE" }}></div>
          <div style={{ display: "flex", alignItems: "center", gap: "9px" }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1D77F5" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"></circle><circle cx="8.5" cy="9.5" r="1.2" fill="#1D77F5" stroke="none"></circle><circle cx="15.5" cy="9.5" r="1.2" fill="#1D77F5" stroke="none"></circle><circle cx="9" cy="14.5" r="1.2" fill="#1D77F5" stroke="none"></circle><circle cx="15" cy="14.5" r="1.2" fill="#1D77F5" stroke="none"></circle></svg><span style={{ font: "600 12.5px/1.3 'Plus Jakarta Sans'", color: "#3c4658" }}>Full-color<br />print</span></div>
          <div style={{ width: "1px", height: "30px", background: "#E3E7EE" }}></div>
          <div style={{ display: "flex", alignItems: "center", gap: "9px" }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1D77F5" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"></rect><path d="M8 11V7a4 4 0 0 1 8 0v4"></path></svg><span style={{ font: "600 12.5px/1.3 'Plus Jakarta Sans'", color: "#3c4658" }}>Private &amp; secure<br />upload</span></div>
          <div style={{ width: "1px", height: "30px", background: "#E3E7EE" }}></div>
          <div style={{ display: "flex", alignItems: "center", gap: "9px" }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1D77F5" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8l9-5 9 5-9 5-9-5z"></path><path d="M3 8v8l9 5 9-5V8"></path></svg><span style={{ font: "600 12.5px/1.3 'Plus Jakarta Sans'", color: "#3c4658" }}>Ships flat,<br />stands tall</span></div>
          <div style={{ width: "1px", height: "30px", background: "#E3E7EE" }}></div>
          <div style={{ display: "flex", alignItems: "center", gap: "9px" }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1D77F5" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22V3M4 4h13l-2 4 2 4H4"></path></svg><span style={{ font: "600 12.5px/1.3 'Plus Jakarta Sans'", color: "#3c4658" }}>Made in<br />the USA</span></div>
        </div>

        {/* CHOOSE YOUR SIZE */}
        <div style={{ padding: "56px 36px 16px", textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "34px", letterSpacing: "-.02em", margin: "0 0 28px", color: "#15243C" }}>
            Choose Your Size
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "18px" }}>
            <div style={{ border: "1px solid #E3E7EE", borderRadius: "16px", padding: "26px 22px", textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 700, fontSize: "19px", color: "#15243C" }}>3 Feet Tall</div>
              <div style={{ font: "500 13px 'Plus Jakarta Sans'", color: "#8a93a6", marginTop: "12px" }}>from</div>
              <div style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "44px", letterSpacing: "-.02em", color: "#1D77F5", lineHeight: 1 }}>$49</div>
              <div style={{ font: "500 12.5px 'Plus Jakarta Sans'", color: "#8a93a6", marginTop: "4px" }}>+ shipping</div>
              <button onClick={handleGoCreate} style={{ width: "100%", font: "700 14px 'Plus Jakarta Sans'", color: "#1D77F5", background: "#fff", border: "1.5px solid #CFE2FB", borderRadius: "10px", padding: "11px", cursor: "pointer", marginTop: "18px" }}>
                Select Size
              </button>
            </div>
            <div style={{ border: "1px solid #E3E7EE", borderRadius: "16px", padding: "26px 22px", textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 700, fontSize: "19px", color: "#15243C" }}>5 Feet Tall</div>
              <div style={{ font: "500 13px 'Plus Jakarta Sans'", color: "#8a93a6", marginTop: "12px" }}>from</div>
              <div style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "44px", letterSpacing: "-.02em", color: "#1D77F5", lineHeight: 1 }}>$99</div>
              <div style={{ font: "500 12.5px 'Plus Jakarta Sans'", color: "#8a93a6", marginTop: "4px" }}>+ shipping</div>
              <button onClick={handleGoCreate} style={{ width: "100%", font: "700 14px 'Plus Jakarta Sans'", color: "#1D77F5", background: "#fff", border: "1.5px solid #CFE2FB", borderRadius: "10px", padding: "11px", cursor: "pointer", marginTop: "18px" }}>
                Select Size
              </button>
            </div>
            <div style={{ border: "1px solid #E3E7EE", borderRadius: "16px", padding: "26px 22px", textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 700, fontSize: "19px", color: "#15243C" }}>6 Feet Tall</div>
              <div style={{ font: "500 13px 'Plus Jakarta Sans'", color: "#8a93a6", marginTop: "12px" }}>from</div>
              <div style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "44px", letterSpacing: "-.02em", color: "#1D77F5", lineHeight: 1 }}>$149</div>
              <div style={{ font: "500 12.5px 'Plus Jakarta Sans'", color: "#8a93a6", marginTop: "4px" }}>+ shipping</div>
              <button onClick={handleGoCreate} style={{ width: "100%", font: "700 14px 'Plus Jakarta Sans'", color: "#1D77F5", background: "#fff", border: "1.5px solid #CFE2FB", borderRadius: "10px", padding: "11px", cursor: "pointer", marginTop: "18px" }}>
                Select Size
              </button>
            </div>
            <div style={{ border: "1px solid #E3E7EE", borderRadius: "16px", padding: "26px 22px", textAlign: "center", display: "flex", flexDirection: "column" }}>
              <div style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 700, fontSize: "19px", color: "#15243C" }}>Custom Size</div>
              <div style={{ font: "500 13.5px/1.5 'Plus Jakarta Sans'", color: "#5B636E", margin: "16px 0", flex: 1 }}>Get a quote for any size you need.</div>
              <Link href="/support" style={{ width: "100%", font: "700 14px 'Plus Jakarta Sans'", color: "#1D77F5", background: "#fff", border: "1.5px solid #CFE2FB", borderRadius: "10px", padding: "11px", cursor: "pointer", display: "block" }}>
                Get a Quote
              </Link>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "18px" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B98645" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l8-8 10 10-8 8z"></path><circle cx="8" cy="8" r="1.4" fill="#B98645" stroke="none"></circle></svg>
            <span style={{ font: "500 14px 'Plus Jakarta Sans'", color: "#5B636E" }}>Volume discounts available for events, businesses, and organizations.</span>
            <Link href="/partner" style={{ font: "700 14px 'Plus Jakarta Sans'", color: "#1D77F5" }}>Learn more →</Link>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div style={{ padding: "48px 36px 8px", borderTop: "1px solid #EBEFF4", margin: "44px 36px 0" }}>
          <h2 style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "34px", letterSpacing: "-.02em", margin: "0 0 36px", color: "#15243C", textAlign: "center" }}>
            How It Works
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr auto 1fr auto 1fr", gap: "14px", alignItems: "start" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ position: "relative", width: "66px", height: "66px", margin: "0 auto 16px" }}>
                <div style={{ width: "66px", height: "66px", borderRadius: "50%", background: "#EAF3FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1D77F5" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 16V8M12 8l-3 3M12 8l3 3"></path>
                    <path d="M20 16.5A4.5 4.5 0 0 0 18 8a6 6 0 0 0-11.5-1.5A4 4 0 0 0 5 16"></path>
                  </svg>
                </div>
                <span style={{ position: "absolute", top: "-4px", right: "6px", width: "24px", height: "24px", borderRadius: "50%", background: "#1D77F5", color: "#fff", font: "700 12px 'Plus Jakarta Sans'", display: "flex", alignItems: "center", justifyContent: "center" }}>1</span>
              </div>
              <div style={{ font: "700 16px 'Plus Jakarta Sans'", color: "#15243C" }}>Upload your photo</div>
              <div style={{ font: "500 13.5px/1.55 'Plus Jakarta Sans'", color: "#5B636E", marginTop: "6px" }}>Choose a clear photo with good lighting.</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", height: "66px" }}>
              <svg width="30" height="16" viewBox="0 0 30 16" fill="none" stroke="#C2C9D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 8h24M20 2l6 6-6 6"></path>
              </svg>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ position: "relative", width: "66px", height: "66px", margin: "0 auto 16px" }}>
                <div style={{ width: "66px", height: "66px", borderRadius: "50%", background: "#EAF3FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1D77F5" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="7"></circle>
                    <path d="M21 21l-4.3-4.3"></path>
                  </svg>
                </div>
                <span style={{ position: "absolute", top: "-4px", right: "6px", width: "24px", height: "24px", borderRadius: "50%", background: "#1D77F5", color: "#fff", font: "700 12px 'Plus Jakarta Sans'", display: "flex", alignItems: "center", justifyContent: "center" }}>2</span>
              </div>
              <div style={{ font: "700 16px 'Plus Jakarta Sans'", color: "#15243C" }}>We check the quality</div>
              <div style={{ font: "500 13.5px/1.55 'Plus Jakarta Sans'", color: "#5B636E", marginTop: "6px" }}>Our team reviews your photo and prepares your cutout.</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", height: "66px" }}>
              <svg width="30" height="16" viewBox="0 0 30 16" fill="none" stroke="#C2C9D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 8h24M20 2l6 6-6 6"></path>
              </svg>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ position: "relative", width: "66px", height: "66px", margin: "0 auto 16px" }}>
                <div style={{ width: "66px", height: "66px", borderRadius: "50%", background: "#EAF3FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1D77F5" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="5" width="18" height="14" rx="2"></rect>
                    <path d="M3 7l9 6 9-6"></path>
                  </svg>
                </div>
                <span style={{ position: "absolute", top: "-4px", right: "6px", width: "24px", height: "24px", borderRadius: "50%", background: "#1D77F5", color: "#fff", font: "700 12px 'Plus Jakarta Sans'", display: "flex", alignItems: "center", justifyContent: "center" }}>3</span>
              </div>
              <div style={{ font: "700 16px 'Plus Jakarta Sans'", color: "#15243C" }}>You approve the preview</div>
              <div style={{ font: "500 13.5px/1.55 'Plus Jakarta Sans'", color: "#5B636E", marginTop: "6px" }}>We email you a preview to approve before printing.</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", height: "66px" }}>
              <svg width="30" height="16" viewBox="0 0 30 16" fill="none" stroke="#C2C9D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 8h24M20 2l6 6-6 6"></path>
              </svg>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ position: "relative", width: "66px", height: "66px", margin: "0 auto 16px" }}>
                <div style={{ width: "66px", height: "66px", borderRadius: "50%", background: "#EAF3FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1D77F5" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 7h11v9H2zM13 10h4l3 3v3h-7z"></path>
                    <circle cx="6" cy="18" r="1.6"></circle>
                    <circle cx="17" cy="18" r="1.6"></circle>
                  </svg>
                </div>
                <span style={{ position: "absolute", top: "-4px", right: "6px", width: "24px", height: "24px", borderRadius: "50%", background: "#1D77F5", color: "#fff", font: "700 12px 'Plus Jakarta Sans'", display: "flex", alignItems: "center", justifyContent: "center" }}>4</span>
              </div>
              <div style={{ font: "700 16px 'Plus Jakarta Sans'", color: "#15243C" }}>We print and ship</div>
              <div style={{ font: "500 13.5px/1.55 'Plus Jakarta Sans'", color: "#5B636E", marginTop: "6px" }}>Your cutout is printed, packed flat, and shipped fast.</div>
            </div>
          </div>
        </div>

        {/* REVIEWS */}
        <div style={{ padding: "48px 36px 8px", borderTop: "1px solid #EBEFF4", margin: "44px 36px 0" }}>
          <h2 style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "34px", letterSpacing: "-.02em", margin: "0 0 32px", color: "#15243C", textAlign: "center" }}>
            What Customers Are Saying
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "18px" }}>
            <div style={{ border: "1px solid #E3E7EE", borderRadius: "16px", padding: "22px" }}>
              <div style={{ color: "#F4B63F", fontSize: "14px", letterSpacing: "2px", marginBottom: "12px" }}>★★★★★</div>
              <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#2c3647", margin: "0 0 18px" }}>“The cutout was a huge hit at our party! Great quality and super easy process.”</p>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ display: "block", width: "34px", height: "34px", borderRadius: "50%", background: "#ddd" }} />
                <span style={{ font: "700 13px 'Plus Jakarta Sans'", color: "#15243C" }}>Jessica M.</span>
              </div>
            </div>
            <div style={{ border: "1px solid #E3E7EE", borderRadius: "16px", padding: "22px" }}>
              <div style={{ color: "#F4B63F", fontSize: "14px", letterSpacing: "2px", marginBottom: "12px" }}>★★★★★</div>
              <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#2c3647", margin: "0 0 18px" }}>“Fast shipping, great quality, and the preview approval gave me total peace of mind.”</p>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ display: "block", width: "34px", height: "34px", borderRadius: "50%", background: "#ccc" }} />
                <span style={{ font: "700 13px 'Plus Jakarta Sans'", color: "#15243C" }}>David R.</span>
              </div>
            </div>
            <div style={{ border: "1px solid #E3E7EE", borderRadius: "16px", padding: "22px" }}>
              <div style={{ color: "#F4B63F", fontSize: "14px", letterSpacing: "2px", marginBottom: "12px" }}>★★★★★</div>
              <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#2c3647", margin: "0 0 18px" }}>“Exactly as described. The colors look amazing and the stand is very sturdy.”</p>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ display: "block", width: "34px", height: "34px", borderRadius: "50%", background: "#bbb" }} />
                <span style={{ font: "700 13px 'Plus Jakarta Sans'", color: "#15243C" }}>Amanda K.</span>
              </div>
            </div>
            <div style={{ border: "1px solid #E3E7EE", borderRadius: "16px", padding: "22px" }}>
              <div style={{ color: "#F4B63F", fontSize: "14px", letterSpacing: "2px", marginBottom: "12px" }}>★★★★★</div>
              <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#2c3647", margin: "0 0 18px" }}>“We ordered for our whole team. CutoutStuff knocked it out of the park!”</p>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ display: "block", width: "34px", height: "34px", borderRadius: "50%", background: "#aaa" }} />
                <span style={{ font: "700 13px 'Plus Jakarta Sans'", color: "#15243C" }}>Chris P.</span>
              </div>
            </div>
          </div>
          <div style={{ textAlign: "center", marginTop: "22px", font: "600 14px 'Plus Jakarta Sans'", color: "#1D77F5" }}>
            View more reviews on <span style={{ color: "#5B636E" }}>Google</span> →
          </div>
        </div>

        {/* SCALE PHOTO */}
        <div style={{ position: "relative", margin: "48px 36px 0", borderRadius: "18px", overflow: "hidden" }}>
          <img src="/assets/warehouse-cutouts.png" alt="Warehouse floor" style={{ display: "block", width: "100%", height: "380px", objectFit: "cover", objectPosition: "center 42%" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,rgba(21,36,60,.86) 0%,rgba(21,36,60,.55) 44%,rgba(21,36,60,0) 72%)" }}></div>
          <div style={{ position: "absolute", left: "36px", top: "50%", transform: "translateY(-50%)", maxWidth: "460px", color: "#fff" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "9px", font: "600 12px/1 'Plus Jakarta Sans'", letterSpacing: ".16em", textTransform: "uppercase", color: "#7FB2F7", marginBottom: "14px" }}>
              <span style={{ width: "20px", height: "2px", borderRadius: "2px", background: "#7FB2F7" }}></span>
              Made to order, at scale
            </div>
            <h2 style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "34px", letterSpacing: "-.02em", margin: "0 0 12px", lineHeight: "1.04" }}>
              Thousands shipped. No two alike.
            </h2>
            <p style={{ font: "500 15.5px/1.6 'Plus Jakarta Sans'", color: "#cfd9e8", margin: 0, maxWidth: "40ch" }}>
              Every cutout is printed, cut, and shipped to order from our U.S. production floor — yours included.
            </p>
          </div>
        </div>

        {/* PARTNER */}
        <div style={{ margin: "44px 36px 0", background: "#EAF3FF", borderRadius: "18px", padding: "26px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            <span style={{ width: "52px", height: "52px", borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1D77F5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 5l3 3 4-3 3 3-4 4-2-2M13 19l-3-3-4 3-3-3 4-4 2 2"></path>
              </svg>
            </span>
            <div>
              <div style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 700, fontSize: "19px", color: "#15243C" }}>Partner With Us</div>
              <div style={{ font: "500 14px/1.5 'Plus Jakarta Sans'", color: "#3c4658" }}>Schools, businesses, events, and resellers — let’s create something awesome together.</div>
            </div>
          </div>
          <Link href="/partner" style={{ font: "700 14.5px 'Plus Jakarta Sans'", color: "#fff", background: "#1D77F5", border: "none", borderRadius: "11px", padding: "13px 24px", cursor: "pointer", flex: "none" }}>
            Learn More
          </Link>
        </div>

        {/* BOTTOM TRUST ROW */}
        <div style={{ padding: "36px 36px 44px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1D77F5" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", marginTop: "1px" }}>
              <circle cx="12" cy="12" r="9"></circle>
              <path d="M9 12.5l2 2 4-4.5"></path>
            </svg>
            <div>
              <div style={{ font: "700 13.5px 'Plus Jakarta Sans'", color: "#15243C" }}>100% Satisfaction Guarantee</div>
              <div style={{ font: "500 12.5px/1.45 'Plus Jakarta Sans'", color: "#8a93a6" }}>We stand behind every cutout.</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1D77F5" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", marginTop: "1px" }}>
              <path d="M2 7h11v9H2zM13 10h4l3 3v3h-7z"></path>
              <circle cx="6" cy="18" r="1.6"></circle>
              <circle cx="17" cy="18" r="1.6"></circle>
            </svg>
            <div>
              <div style={{ font: "700 13.5px 'Plus Jakarta Sans'", color: "#15243C" }}>Fast Turnaround</div>
              <div style={{ font: "500 12.5px/1.45 'Plus Jakarta Sans'", color: "#8a93a6" }}>Most orders ship in 2–4 business days.</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1D77F5" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", marginTop: "1px" }}>
              <rect x="4" y="11" width="16" height="10" rx="2"></rect>
              <path d="M8 11V7a4 4 0 0 1 8 0v4"></path>
            </svg>
            <div>
              <div style={{ font: "700 13.5px 'Plus Jakarta Sans'", color: "#15243C" }}>Secure Checkout</div>
              <div style={{ font: "500 12.5px/1.45 'Plus Jakarta Sans'", color: "#8a93a6" }}>Your information is always protected.</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1D77F5" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", marginTop: "1px" }}>
              <circle cx="9" cy="8" r="3.5"></circle>
              <path d="M3 20c0-3.5 2.7-5.5 6-5.5s6 2 6 5.5"></path>
              <path d="M16 4a4 4 0 0 1 0 8M21 20c0-2.6-1.3-4.4-3.5-5"></path>
            </svg>
            <div>
              <div style={{ font: "700 13.5px 'Plus Jakarta Sans'", color: "#15243C" }}>Real People, Real Support</div>
              <div style={{ font: "500 12.5px/1.45 'Plus Jakarta Sans'", color: "#8a93a6" }}>We’re here to help.</div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div style={{ background: "#15243C", color: "#fff", padding: "44px 36px 30px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr 1.1fr", gap: "28px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "12px" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "9px" }}>
                  <img src="/assets/cs-mark.png" alt="" style={{ height: "32px", width: "auto", display: "block" }} />
                  <span style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "19px", letterSpacing: "-.02em", color: "#fff" }}>
                    Cutout<span style={{ color: "#5DA0FF" }}>Stuff</span>
                  </span>
                </span>
              </div>
              <p style={{ font: "500 13px/1.6 'Plus Jakarta Sans'", color: "#9fb0c6", margin: 0, maxWidth: "30ch" }}>Life-size cutouts for life’s best moments.</p>
            </div>
            <div>
              <div style={{ font: "700 13px 'Plus Jakarta Sans'", marginBottom: "14px" }}>Shop</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "9px", font: "500 13.5px 'Plus Jakarta Sans'", color: "#9fb0c6" }}>
                <Link href="/create">Create</Link>
                <Link href="/pricing">Pricing</Link>
                <Link href="/gallery">Gallery</Link>
              </div>
            </div>
            <div>
              <div style={{ font: "700 13px 'Plus Jakarta Sans'", marginBottom: "14px" }}>Help</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "9px", font: "500 13.5px 'Plus Jakarta Sans'", color: "#9fb0c6" }}>
                <Link href="/faq">FAQ</Link>
                <Link href="/support">Support</Link>
              </div>
            </div>
            <div>
              <div style={{ font: "700 13px 'Plus Jakarta Sans'", marginBottom: "14px" }}>Company</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "9px", font: "500 13.5px 'Plus Jakarta Sans'", color: "#9fb0c6" }}>
                <Link href="/about">About Us</Link>
                <Link href="/partner">Partner With Us</Link>
                <Link href="/support">Contact Us</Link>
              </div>
            </div>
            <div>
              <div style={{ font: "700 13px 'Plus Jakarta Sans'", marginBottom: "14px" }}>Follow Us</div>
              <div style={{ display: "flex", gap: "12px", color: "#9fb0c6" }}>
                {/* Social icons */}
                <span>FB</span>
                <span>IG</span>
                <span>TT</span>
                <span>YT</span>
              </div>
            </div>
          </div>
          <div style={{ borderTop: "1px solid #25364f", marginTop: "28px", paddingTop: "18px", font: "500 12.5px 'Plus Jakarta Sans'", color: "#7e90a8", textAlign: "center" }}>
            © 2026 CutoutStuff.com. All rights reserved.
          </div>
        </div>
      </div>

      {/* ================= MOBILE ARTBOARD ================= */}
      <div className="mobile-only" style={{ width: "390px", background: "#fff", borderRadius: "30px", overflow: "hidden", boxShadow: "0 40px 90px rgba(21, 36, 60, .18)", border: "1px solid #E3E7EE", position: "relative" }}>
        <div style={{ position: "sticky", top: 0, zIndex: 6, background: "rgba(255, 255, 255, .95)", backdropFilter: "blur(8px)", borderBottom: "1px solid #EBEFF4", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "7px" }}>
              <img src="/assets/cs-mark.png" alt="" style={{ height: "28px", width: "auto", display: "block" }} />
              <span style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "17px", letterSpacing: "-.02em", color: "#15243C" }}>
                Cutout<span style={{ color: "#1D77F5" }}>Stuff</span>
              </span>
            </span>
          </div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#15243C" strokeWidth="2" strokeLinecap="round">
            <path d="M3 6h18M3 12h18M3 18h18"></path>
          </svg>
        </div>
        <div style={{ background: "linear-gradient(180deg,#F2F6FC,#fff)", padding: "26px 20px 18px" }}>
          <h1 style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "34px", lineHeight: "1.0", letterSpacing: "-.03em", margin: 0, color: "#15243C" }}>
            Turn any photo into a life-size cutout.
          </h1>
          <p style={{ fontSize: "15px", lineHeight: "1.55", color: "#5B636E", margin: "14px 0 18px" }}>
            Upload your photo, pick a size, and check out. We review every order before production, then print and ship a premium foam-board cutout to your door.
          </p>
          <button
            onClick={handleGoCreate}
            style={{ width: "100%", font: "700 15.5px 'Plus Jakarta Sans'", color: "#fff", background: "#1D77F5", border: "none", borderRadius: "13px", padding: "15px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "9px", boxShadow: "0 10px 22px rgba(29, 119, 245,.24)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 16V8M12 8l-3 3M12 8l3 3"></path>
              <path d="M20 16.5A4.5 4.5 0 0 0 18 8a6 6 0 0 0-11.5-1.5A4 4 0 0 0 5 16"></path>
            </svg>
            Upload Your Photo
          </button>
          <button
            onClick={handleGoHow}
            style={{ width: "100%", font: "700 15px 'Plus Jakarta Sans'", color: "#15243C", background: "#fff", border: "1.5px solid #DCE3EC", borderRadius: "13px", padding: "13px", cursor: "pointer", marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1D77F5" strokeWidth="2" strokeLinejoin="round">
              <path d="M6 4l14 8-14 8z"></path>
            </svg>
            See How It Works
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "14px", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B98645" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="11" width="16" height="10" rx="2"></rect>
              <path d="M8 11V7a4 4 0 0 1 8 0v4"></path>
            </svg>
            <span style={{ font: "500 12px 'Plus Jakarta Sans'", color: "#5B636E" }}>Private upload · we review every order</span>
          </div>
        </div>
        <div style={{ position: "relative", height: "230px", overflow: "hidden" }}>
          <img
            src="/assets/hero-lineup-wide.png"
            alt="Life-size foam-board cutouts"
            style={{ position: "absolute", inset: 0, width: "762px", height: "100%", objectFit: "cover", objectPosition: "66% 42%", left: "-358px" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(244,243,241,.4) 0%,rgba(244,243,241,0) 26%,rgba(244,243,241,.55) 84%,#fff 100%)" }}></div>
        </div>
        <div style={{ padding: "22px 20px" }}>
          <h2 style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "24px", letterSpacing: "-.02em", margin: "0 0 14px", color: "#15243C", textAlign: "center" }}>
            Choose Your Size
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div style={{ border: "1px solid #E3E7EE", borderRadius: "13px", padding: "16px", textAlign: "center" }}>
              <div style={{ font: "700 14px 'Plus Jakarta Sans'", color: "#15243C" }}>3 Feet</div>
              <div style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "26px", color: "#1D77F5", marginTop: "4px" }}>$49</div>
              <div style={{ font: "500 11px 'Plus Jakarta Sans'", color: "#8a93a6" }}>+ shipping</div>
            </div>
            <div style={{ border: "1px solid #E3E7EE", borderRadius: "13px", padding: "16px", textAlign: "center" }}>
              <div style={{ font: "700 14px 'Plus Jakarta Sans'", color: "#15243C" }}>5 Feet</div>
              <div style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "26px", color: "#1D77F5", marginTop: "4px" }}>$99</div>
              <div style={{ font: "500 11px 'Plus Jakarta Sans'", color: "#8a93a6" }}>+ shipping</div>
            </div>
            <div style={{ border: "1px solid #E3E7EE", borderRadius: "13px", padding: "16px", textAlign: "center" }}>
              <div style={{ font: "700 14px 'Plus Jakarta Sans'", color: "#15243C" }}>6 Feet</div>
              <div style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "26px", color: "#1D77F5", marginTop: "4px" }}>$149</div>
              <div style={{ font: "500 11px 'Plus Jakarta Sans'", color: "#8a93a6" }}>+ shipping</div>
            </div>
            <div style={{ border: "1px solid #E3E7EE", borderRadius: "13px", padding: "16px", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ font: "700 14px 'Plus Jakarta Sans'", color: "#15243C" }}>Custom</div>
              <Link href="/support" style={{ font: "600 12.5px 'Plus Jakarta Sans'", color: "#1D77F5", marginTop: "6px" }}>
                Get a Quote
              </Link>
            </div>
          </div>
        </div>
        <div style={{ padding: "8px 20px 24px" }}>
          <h2 style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "24px", letterSpacing: "-.02em", margin: "0 0 16px", color: "#15243C", textAlign: "center" }}>
            How It Works
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", gap: "13px", alignItems: "center" }}>
              <span style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#EAF3FF", display: "flex", alignItems: "center", justifyContent: "center", flex: "none", position: "relative" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1D77F5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 16V8M12 8l-3 3M12 8l3 3"></path>
                  <path d="M20 16.5A4.5 4.5 0 0 0 18 8a6 6 0 0 0-11.5-1.5A4 4 0 0 0 5 16"></path>
                </svg>
              </span>
              <div>
                <div style={{ font: "700 14px 'Plus Jakarta Sans'", color: "#15243C" }}>Upload your photo</div>
                <div style={{ font: "500 12.5px 'Plus Jakarta Sans'", color: "#5B636E" }}>Choose a clear photo with good lighting.</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "13px", alignItems: "center" }}>
              <span style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#EAF3FF", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1D77F5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7"></circle>
                  <path d="M21 21l-4.3-4.3"></path>
                </svg>
              </span>
              <div>
                <div style={{ font: "700 14px 'Plus Jakarta Sans'", color: "#15243C" }}>We check the quality</div>
                <div style={{ font: "500 12.5px 'Plus Jakarta Sans'", color: "#5B636E" }}>Our team reviews and preps your cutout.</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "13px", alignItems: "center" }}>
              <span style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#EAF3FF", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1D77F5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="5" width="18" height="14" rx="2"></rect>
                  <path d="M3 7l9 6 9-6"></path>
                </svg>
              </span>
              <div>
                <div style={{ font: "700 14px 'Plus Jakarta Sans'", color: "#15243C" }}>You approve the preview</div>
                <div style={{ font: "500 12.5px 'Plus Jakarta Sans'", color: "#5B636E" }}>We email a preview before printing.</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "13px", alignItems: "center" }}>
              <span style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#EAF3FF", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1D77F5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 7h11v9H2zM13 10h4l3 3v3h-7z"></path>
                  <circle cx="6" cy="18" r="1.6"></circle>
                  <circle cx="17" cy="18" r="1.6"></circle>
                </svg>
              </span>
              <div>
                <div style={{ font: "700 14px 'Plus Jakarta Sans'", color: "#15243C" }}>We print and ship</div>
                <div style={{ font: "500 12.5px 'Plus Jakarta Sans'", color: "#5B636E" }}>Printed, packed flat, shipped fast.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
