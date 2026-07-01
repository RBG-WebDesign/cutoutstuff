/* CutOutStuff chart web components — powered by Recharts (UMD), rendered in an
   isolated React root so it never collides with the Design Component runtime's
   own React. Brand styling (petrol-slate, Space Mono ticks) lives here. */
(function () {
  var INK = '#17191C';
  var ACCENT = '#345B6B';
  var MUTE = '#9AA0A6';
  var GRID = 'rgba(23,25,28,0.08)';
  var MONO = "'Space Mono', ui-monospace, monospace";

  function ready() {
    return window.React && window.ReactDOM && window.Recharts;
  }

  // Load chart libraries strictly AFTER the runtime's React exists on window,
  // so the Recharts UMD never races React initialization.
  var injected = false;
  function loadLibs() {
    if (injected || window.Recharts) return;
    if (!window.React || !window.ReactDOM) { setTimeout(loadLibs, 60); return; }
    injected = true;
    var urls = [
      'https://unpkg.com/prop-types@15.8.1/prop-types.min.js',
      'https://unpkg.com/react-is@18.3.1/umd/react-is.production.min.js',
      'https://unpkg.com/recharts@3.9.1/umd/Recharts.js'
    ];
    (function next(i) {
      if (i >= urls.length) return;
      var s = document.createElement('script');
      s.src = urls[i];
      s.onload = function () { next(i + 1); };
      s.onerror = function () { injected = false; setTimeout(loadLibs, 3000); };
      document.head.appendChild(s);
    })(0);
  }
  loadLibs();

  function waitFor(cb) {
    if (ready()) { cb(); return; }
    var tries = 0;
    var t = setInterval(function () {
      if (ready() || tries++ > 400) { clearInterval(t); if (ready()) cb(); }
    }, 25);
  }

  function makeTooltip(React, valueLabel, formatter) {
    return function Tooltip(props) {
      if (!props || !props.active || !props.payload || !props.payload.length) return null;
      var p = props.payload[0];
      var val = formatter ? formatter(p.value) : p.value;
      return React.createElement('div', {
        style: {
          background: '#fff', border: '1px solid rgba(23,25,28,0.14)', borderRadius: '2px',
          padding: '8px 12px', boxShadow: '0 4px 16px rgba(23,25,28,0.10)', fontFamily: MONO
        }
      }, [
        React.createElement('div', { key: 'l', style: { fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', color: MUTE, marginBottom: '3px' } }, props.label),
        React.createElement('div', { key: 'v', style: { fontSize: '14px', fontWeight: 700, color: INK } }, val)
      ]);
    };
  }

  function build(React, Recharts, el) {
    var type = (el.getAttribute('type') || 'bar').toLowerCase();
    var xKey = el.getAttribute('xkey') || 'x';
    var yKey = el.getAttribute('ykey') || 'y';
    var color = el.getAttribute('color') || ACCENT;
    var prefix = el.getAttribute('prefix') || '';
    var showY = el.getAttribute('showy') === 'true';
    var data = [];
    try { data = JSON.parse(el.getAttribute('data') || '[]'); } catch (e) { data = []; }

    var fmt = function (v) {
      return prefix + Number(v).toLocaleString('en-US');
    };

    var axisTick = { fontFamily: MONO, fontSize: 10, fill: MUTE };
    var common = {
      data: data,
      margin: { top: 8, right: 8, bottom: 0, left: showY ? 4 : -20 }
    };

    var children = [
      React.createElement(Recharts.CartesianGrid, { key: 'g', vertical: false, stroke: GRID }),
      React.createElement(Recharts.XAxis, { key: 'x', dataKey: xKey, tickLine: false, axisLine: false, tick: axisTick, dy: 6 }),
      React.createElement(Recharts.YAxis, { key: 'y', hide: !showY, tickLine: false, axisLine: false, tick: axisTick, width: 48, tickFormatter: fmt }),
      React.createElement(Recharts.Tooltip, {
        key: 't', cursor: { fill: 'rgba(52,91,107,0.06)' },
        content: React.createElement(makeTooltip(React, yKey, fmt))
      })
    ];

    var chart;
    if (type === 'area') {
      var gid = 'cos-grad-' + Math.random().toString(36).slice(2, 8);
      children.unshift(React.createElement('defs', { key: 'd' },
        React.createElement('linearGradient', { id: gid, x1: 0, y1: 0, x2: 0, y2: 1 }, [
          React.createElement('stop', { key: 'a', offset: '0%', stopColor: color, stopOpacity: 0.28 }),
          React.createElement('stop', { key: 'b', offset: '100%', stopColor: color, stopOpacity: 0.02 })
        ])
      ));
      children.push(React.createElement(Recharts.Area, {
        key: 'series', type: 'monotone', dataKey: yKey, stroke: color, strokeWidth: 2,
        fill: 'url(#' + gid + ')', dot: false, activeDot: { r: 4, fill: color }
      }));
      chart = React.createElement(Recharts.AreaChart, common, children);
    } else if (type === 'line') {
      children.push(React.createElement(Recharts.Line, {
        key: 'series', type: 'monotone', dataKey: yKey, stroke: color, strokeWidth: 2,
        dot: false, activeDot: { r: 4, fill: color }
      }));
      chart = React.createElement(Recharts.LineChart, common, children);
    } else {
      children.push(React.createElement(Recharts.Bar, {
        key: 'series', dataKey: yKey, fill: color, radius: [3, 3, 0, 0], maxBarSize: 46
      }));
      chart = React.createElement(Recharts.BarChart, common, children);
    }

    return React.createElement(Recharts.ResponsiveContainer, { width: '100%', height: '100%' }, chart);
  }

  var Chart = function () {};

  class CosChart extends HTMLElement {
    static get observedAttributes() { return ['type', 'data', 'xkey', 'ykey', 'color', 'prefix', 'showy']; }
    connectedCallback() {
      this.style.display = 'block';
      this.style.width = '100%';
      this.style.height = (this.getAttribute('height') || '160') + 'px';
      waitFor(this._render.bind(this));
    }
    attributeChangedCallback() {
      if (this._root) waitFor(this._render.bind(this));
    }
    disconnectedCallback() {
      if (this._root) { try { this._root.unmount(); } catch (e) {} this._root = null; }
    }
    _render() {
      var React = window.React, ReactDOM = window.ReactDOM, Recharts = window.Recharts;
      if (!this._mount) {
        this._mount = document.createElement('div');
        this._mount.style.width = '100%';
        this._mount.style.height = '100%';
        this.appendChild(this._mount);
      }
      if (!this._root) this._root = ReactDOM.createRoot(this._mount);
      this._root.render(build(React, Recharts, this));
    }
  }

  if (!customElements.get('cos-chart')) customElements.define('cos-chart', CosChart);
})();
