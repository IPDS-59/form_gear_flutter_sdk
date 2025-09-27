var Yd = Object.defineProperty;
var Xd = (t, e, n) => e in t ? Yd(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var pe = (t, e, n) => (Xd(t, typeof e != "symbol" ? e + "" : e, n), n);
const Tl = {
  context: void 0,
  registry: void 0
}, Qd = (t, e) => t === e, Ye = Symbol("solid-proxy"), Kr = Symbol("solid-track"), Mi = {
  equals: Qd
};
let Al = Vl;
const Zt = 1, Oi = 2, Ll = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
};
var Pe = null;
let ys = null, Jd = null, Ve = null, st = null, Yt = null, Wi = 0;
function Ar(t, e) {
  const n = Ve, r = Pe, i = t.length === 0, s = e === void 0 ? r : e, o = i ? Ll : {
    owned: null,
    cleanups: null,
    context: s ? s.context : null,
    owner: s
  }, a = i ? t : () => t(() => lt(() => Ui(o)));
  Pe = o, Ve = null;
  try {
    return $n(a, !0);
  } finally {
    Ve = n, Pe = r;
  }
}
function N(t, e) {
  e = e ? Object.assign({}, Mi, e) : Mi;
  const n = {
    value: t,
    observers: null,
    observerSlots: null,
    comparator: e.equals || void 0
  }, r = (i) => (typeof i == "function" && (i = i(n.value)), Rl(n, i));
  return [zl.bind(n), r];
}
function Fl(t, e, n) {
  const r = Hi(t, e, !0, Zt);
  rr(r);
}
function oe(t, e, n) {
  const r = Hi(t, e, !1, Zt);
  rr(r);
}
function Z(t, e, n) {
  Al = rf;
  const r = Hi(t, e, !1, Zt);
  (!n || !n.render) && (r.user = !0), Yt ? Yt.push(r) : rr(r);
}
function J(t, e, n) {
  n = n ? Object.assign({}, Mi, n) : Mi;
  const r = Hi(t, e, !0, 0);
  return r.observers = null, r.observerSlots = null, r.comparator = n.equals || void 0, rr(r), zl.bind(r);
}
function zt(t) {
  return $n(t, !1);
}
function lt(t) {
  if (Ve === null)
    return t();
  const e = Ve;
  Ve = null;
  try {
    return t();
  } finally {
    Ve = e;
  }
}
function He(t, e, n) {
  const r = Array.isArray(t);
  let i, s = n && n.defer;
  return (o) => {
    let a;
    if (r) {
      a = Array(t.length);
      for (let c = 0; c < t.length; c++)
        a[c] = t[c]();
    } else
      a = t();
    if (s)
      return s = !1, o;
    const l = lt(() => e(a, i, o));
    return i = a, l;
  };
}
function en(t) {
  Z(() => lt(t));
}
function me(t) {
  return Pe === null || (Pe.cleanups === null ? Pe.cleanups = [t] : Pe.cleanups.push(t)), t;
}
function Br() {
  return Ve;
}
function Zd() {
  return Pe;
}
function ef(t, e) {
  const n = Pe, r = Ve;
  Pe = t, Ve = null;
  try {
    return $n(e, !0);
  } catch (i) {
    ko(i);
  } finally {
    Pe = n, Ve = r;
  }
}
function Fe(t, e) {
  const n = Symbol("context");
  return {
    id: n,
    Provider: of(n),
    defaultValue: t
  };
}
function Ne(t) {
  return Pe && Pe.context && Pe.context[t.id] !== void 0 ? Pe.context[t.id] : t.defaultValue;
}
function Dn(t) {
  const e = J(t), n = J(() => Ys(e()));
  return n.toArray = () => {
    const r = n();
    return Array.isArray(r) ? r : r != null ? [r] : [];
  }, n;
}
function zl() {
  if (this.sources && this.state)
    if (this.state === Zt)
      rr(this);
    else {
      const t = st;
      st = null, $n(() => Ii(this), !1), st = t;
    }
  if (Ve) {
    const t = this.observers ? this.observers.length : 0;
    Ve.sources ? (Ve.sources.push(this), Ve.sourceSlots.push(t)) : (Ve.sources = [this], Ve.sourceSlots = [t]), this.observers ? (this.observers.push(Ve), this.observerSlots.push(Ve.sources.length - 1)) : (this.observers = [Ve], this.observerSlots = [Ve.sources.length - 1]);
  }
  return this.value;
}
function Rl(t, e, n) {
  let r = t.value;
  return (!t.comparator || !t.comparator(r, e)) && (t.value = e, t.observers && t.observers.length && $n(() => {
    for (let i = 0; i < t.observers.length; i += 1) {
      const s = t.observers[i], o = ys && ys.running;
      o && ys.disposed.has(s), (o ? !s.tState : !s.state) && (s.pure ? st.push(s) : Yt.push(s), s.observers && Nl(s)), o || (s.state = Zt);
    }
    if (st.length > 1e6)
      throw st = [], new Error();
  }, !1)), e;
}
function rr(t) {
  if (!t.fn)
    return;
  Ui(t);
  const e = Wi;
  tf(
    t,
    t.value,
    e
  );
}
function tf(t, e, n) {
  let r;
  const i = Pe, s = Ve;
  Ve = Pe = t;
  try {
    r = t.fn(e);
  } catch (o) {
    return t.pure && (t.state = Zt, t.owned && t.owned.forEach(Ui), t.owned = null), t.updatedAt = n + 1, ko(o);
  } finally {
    Ve = s, Pe = i;
  }
  (!t.updatedAt || t.updatedAt <= n) && (t.updatedAt != null && "observers" in t ? Rl(t, r) : t.value = r, t.updatedAt = n);
}
function Hi(t, e, n, r = Zt, i) {
  const s = {
    fn: t,
    state: r,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: e,
    owner: Pe,
    context: Pe ? Pe.context : null,
    pure: n
  };
  return Pe === null || Pe !== Ll && (Pe.owned ? Pe.owned.push(s) : Pe.owned = [s]), s;
}
function Ei(t) {
  if (t.state === 0)
    return;
  if (t.state === Oi)
    return Ii(t);
  if (t.suspense && lt(t.suspense.inFallback))
    return t.suspense.effects.push(t);
  const e = [t];
  for (; (t = t.owner) && (!t.updatedAt || t.updatedAt < Wi); )
    t.state && e.push(t);
  for (let n = e.length - 1; n >= 0; n--)
    if (t = e[n], t.state === Zt)
      rr(t);
    else if (t.state === Oi) {
      const r = st;
      st = null, $n(() => Ii(t, e[0]), !1), st = r;
    }
}
function $n(t, e) {
  if (st)
    return t();
  let n = !1;
  e || (st = []), Yt ? n = !0 : Yt = [], Wi++;
  try {
    const r = t();
    return nf(n), r;
  } catch (r) {
    n || (Yt = null), st = null, ko(r);
  }
}
function nf(t) {
  if (st && (Vl(st), st = null), t)
    return;
  const e = Yt;
  Yt = null, e.length && $n(() => Al(e), !1);
}
function Vl(t) {
  for (let e = 0; e < t.length; e++)
    Ei(t[e]);
}
function rf(t) {
  let e, n = 0;
  for (e = 0; e < t.length; e++) {
    const r = t[e];
    r.user ? t[n++] = r : Ei(r);
  }
  for (e = 0; e < n; e++)
    Ei(t[e]);
}
function Ii(t, e) {
  t.state = 0;
  for (let n = 0; n < t.sources.length; n += 1) {
    const r = t.sources[n];
    if (r.sources) {
      const i = r.state;
      i === Zt ? r !== e && (!r.updatedAt || r.updatedAt < Wi) && Ei(r) : i === Oi && Ii(r, e);
    }
  }
}
function Nl(t) {
  for (let e = 0; e < t.observers.length; e += 1) {
    const n = t.observers[e];
    n.state || (n.state = Oi, n.pure ? st.push(n) : Yt.push(n), n.observers && Nl(n));
  }
}
function Ui(t) {
  let e;
  if (t.sources)
    for (; t.sources.length; ) {
      const n = t.sources.pop(), r = t.sourceSlots.pop(), i = n.observers;
      if (i && i.length) {
        const s = i.pop(), o = n.observerSlots.pop();
        r < i.length && (s.sourceSlots[o] = r, i[r] = s, n.observerSlots[r] = o);
      }
    }
  if (t.owned) {
    for (e = t.owned.length - 1; e >= 0; e--)
      Ui(t.owned[e]);
    t.owned = null;
  }
  if (t.cleanups) {
    for (e = t.cleanups.length - 1; e >= 0; e--)
      t.cleanups[e]();
    t.cleanups = null;
  }
  t.state = 0;
}
function sf(t) {
  return t instanceof Error ? t : new Error(typeof t == "string" ? t : "Unknown error", {
    cause: t
  });
}
function ko(t, e = Pe) {
  throw sf(t);
}
function Ys(t) {
  if (typeof t == "function" && !t.length)
    return Ys(t());
  if (Array.isArray(t)) {
    const e = [];
    for (let n = 0; n < t.length; n++) {
      const r = Ys(t[n]);
      Array.isArray(r) ? e.push.apply(e, r) : e.push(r);
    }
    return e;
  }
  return t;
}
function of(t, e) {
  return function(r) {
    let i;
    return oe(
      () => i = lt(() => (Pe.context = {
        ...Pe.context,
        [t]: r.value
      }, Dn(() => r.children))),
      void 0
    ), i;
  };
}
const af = Symbol("fallback");
function oa(t) {
  for (let e = 0; e < t.length; e++)
    t[e]();
}
function lf(t, e, n = {}) {
  let r = [], i = [], s = [], o = 0, a = e.length > 1 ? [] : null;
  return me(() => oa(s)), () => {
    let l = t() || [], c, u;
    return l[Kr], lt(() => {
      let h = l.length, m, w, g, p, v, b, C, _, E;
      if (h === 0)
        o !== 0 && (oa(s), s = [], r = [], i = [], o = 0, a && (a = [])), n.fallback && (r = [af], i[0] = Ar((F) => (s[0] = F, n.fallback())), o = 1);
      else if (o === 0) {
        for (i = new Array(h), u = 0; u < h; u++)
          r[u] = l[u], i[u] = Ar(f);
        o = h;
      } else {
        for (g = new Array(h), p = new Array(h), a && (v = new Array(h)), b = 0, C = Math.min(o, h); b < C && r[b] === l[b]; b++)
          ;
        for (C = o - 1, _ = h - 1; C >= b && _ >= b && r[C] === l[_]; C--, _--)
          g[_] = i[C], p[_] = s[C], a && (v[_] = a[C]);
        for (m = /* @__PURE__ */ new Map(), w = new Array(_ + 1), u = _; u >= b; u--)
          E = l[u], c = m.get(E), w[u] = c === void 0 ? -1 : c, m.set(E, u);
        for (c = b; c <= C; c++)
          E = r[c], u = m.get(E), u !== void 0 && u !== -1 ? (g[u] = i[c], p[u] = s[c], a && (v[u] = a[c]), u = w[u], m.set(E, u)) : s[c]();
        for (u = b; u < h; u++)
          u in g ? (i[u] = g[u], s[u] = p[u], a && (a[u] = v[u], a[u](u))) : i[u] = Ar(f);
        i = i.slice(0, o = h), r = l.slice(0);
      }
      return i;
    });
    function f(h) {
      if (s[u] = h, a) {
        const [m, w] = N(u);
        return a[u] = w, e(l[u], m);
      }
      return e(l[u]);
    }
  };
}
let cf = !1;
function d(t, e) {
  return lt(() => t(e || {}));
}
function ci() {
  return !0;
}
const Xs = {
  get(t, e, n) {
    return e === Ye ? n : t.get(e);
  },
  has(t, e) {
    return e === Ye ? !0 : t.has(e);
  },
  set: ci,
  deleteProperty: ci,
  getOwnPropertyDescriptor(t, e) {
    return {
      configurable: !0,
      enumerable: !0,
      get() {
        return t.get(e);
      },
      set: ci,
      deleteProperty: ci
    };
  },
  ownKeys(t) {
    return t.keys();
  }
};
function xs(t) {
  return (t = typeof t == "function" ? t() : t) ? t : {};
}
function uf() {
  for (let t = 0, e = this.length; t < e; ++t) {
    const n = this[t]();
    if (n !== void 0)
      return n;
  }
}
function D(...t) {
  let e = !1;
  for (let o = 0; o < t.length; o++) {
    const a = t[o];
    e = e || !!a && Ye in a, t[o] = typeof a == "function" ? (e = !0, J(a)) : a;
  }
  if (e)
    return new Proxy(
      {
        get(o) {
          for (let a = t.length - 1; a >= 0; a--) {
            const l = xs(t[a])[o];
            if (l !== void 0)
              return l;
          }
        },
        has(o) {
          for (let a = t.length - 1; a >= 0; a--)
            if (o in xs(t[a]))
              return !0;
          return !1;
        },
        keys() {
          const o = [];
          for (let a = 0; a < t.length; a++)
            o.push(...Object.keys(xs(t[a])));
          return [...new Set(o)];
        }
      },
      Xs
    );
  const n = {}, r = /* @__PURE__ */ Object.create(null);
  for (let o = t.length - 1; o >= 0; o--) {
    const a = t[o];
    if (!a)
      continue;
    const l = Object.getOwnPropertyNames(a);
    for (let c = l.length - 1; c >= 0; c--) {
      const u = l[c];
      if (u === "__proto__" || u === "constructor")
        continue;
      const f = Object.getOwnPropertyDescriptor(a, u);
      if (!r[u])
        r[u] = f.get ? {
          enumerable: !0,
          configurable: !0,
          get: uf.bind(n[u] = [f.get.bind(a)])
        } : f.value !== void 0 ? f : void 0;
      else {
        const h = n[u];
        h && (f.get ? h.push(f.get.bind(a)) : f.value !== void 0 && h.push(() => f.value));
      }
    }
  }
  const i = {}, s = Object.keys(r);
  for (let o = s.length - 1; o >= 0; o--) {
    const a = s[o], l = r[a];
    l && l.get ? Object.defineProperty(i, a, l) : i[a] = l ? l.value : void 0;
  }
  return i;
}
function K(t, ...e) {
  if (Ye in t) {
    const i = new Set(e.length > 1 ? e.flat() : e[0]), s = e.map((o) => new Proxy(
      {
        get(a) {
          return o.includes(a) ? t[a] : void 0;
        },
        has(a) {
          return o.includes(a) && a in t;
        },
        keys() {
          return o.filter((a) => a in t);
        }
      },
      Xs
    ));
    return s.push(
      new Proxy(
        {
          get(o) {
            return i.has(o) ? void 0 : t[o];
          },
          has(o) {
            return i.has(o) ? !1 : o in t;
          },
          keys() {
            return Object.keys(t).filter((o) => !i.has(o));
          }
        },
        Xs
      )
    ), s;
  }
  const n = {}, r = e.map(() => ({}));
  for (const i of Object.getOwnPropertyNames(t)) {
    const s = Object.getOwnPropertyDescriptor(t, i), o = !s.get && !s.set && s.enumerable && s.writable && s.configurable;
    let a = !1, l = 0;
    for (const c of e)
      c.includes(i) && (a = !0, o ? r[l][i] = s.value : Object.defineProperty(r[l], i, s)), ++l;
    a || (o ? n[i] = s.value : Object.defineProperty(n, i, s));
  }
  return [...r, n];
}
let df = 0;
function tt() {
  const t = Tl.context;
  return t ? `${t.id}${t.count++}` : `cl-${df++}`;
}
const Kl = (t) => `Stale read from <${t}>.`;
function xe(t) {
  const e = "fallback" in t && {
    fallback: () => t.fallback
  };
  return J(lf(() => t.each, t.children, e || void 0));
}
function te(t) {
  const e = t.keyed, n = J(() => t.when, void 0, {
    equals: (r, i) => e ? r === i : !r == !i
  });
  return J(
    () => {
      const r = n();
      if (r) {
        const i = t.children;
        return typeof i == "function" && i.length > 0 ? lt(
          () => i(
            e ? r : () => {
              if (!lt(n))
                throw Kl("Show");
              return t.when;
            }
          )
        ) : i;
      }
      return t.fallback;
    },
    void 0,
    void 0
  );
}
function ff(t) {
  let e = !1;
  const n = (s, o) => (e ? s[1] === o[1] : !s[1] == !o[1]) && s[2] === o[2], r = Dn(() => t.children), i = J(
    () => {
      let s = r();
      Array.isArray(s) || (s = [s]);
      for (let o = 0; o < s.length; o++) {
        const a = s[o].when;
        if (a)
          return e = !!s[o].keyed, [o, a, s[o]];
      }
      return [-1];
    },
    void 0,
    {
      equals: n
    }
  );
  return J(
    () => {
      const [s, o, a] = i();
      if (s < 0)
        return t.fallback;
      const l = a.children;
      return typeof l == "function" && l.length > 0 ? lt(
        () => l(
          e ? o : () => {
            if (lt(i)[0] !== s)
              throw Kl("Match");
            return a.when;
          }
        )
      ) : l;
    },
    void 0,
    void 0
  );
}
function ks(t) {
  return t;
}
const hf = [
  "allowfullscreen",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "disabled",
  "formnovalidate",
  "hidden",
  "indeterminate",
  "inert",
  "ismap",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "seamless",
  "selected"
], gf = /* @__PURE__ */ new Set([
  "className",
  "value",
  "readOnly",
  "formNoValidate",
  "isMap",
  "noModule",
  "playsInline",
  ...hf
]), mf = /* @__PURE__ */ new Set([
  "innerHTML",
  "textContent",
  "innerText",
  "children"
]), wf = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(null), {
  className: "class",
  htmlFor: "for"
}), pf = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(null), {
  class: "className",
  formnovalidate: {
    $: "formNoValidate",
    BUTTON: 1,
    INPUT: 1
  },
  ismap: {
    $: "isMap",
    IMG: 1
  },
  nomodule: {
    $: "noModule",
    SCRIPT: 1
  },
  playsinline: {
    $: "playsInline",
    VIDEO: 1
  },
  readonly: {
    $: "readOnly",
    INPUT: 1,
    TEXTAREA: 1
  }
});
function vf(t, e) {
  const n = pf[t];
  return typeof n == "object" ? n[e] ? n.$ : void 0 : n;
}
const bf = /* @__PURE__ */ new Set([
  "beforeinput",
  "click",
  "dblclick",
  "contextmenu",
  "focusin",
  "focusout",
  "input",
  "keydown",
  "keyup",
  "mousedown",
  "mousemove",
  "mouseout",
  "mouseover",
  "mouseup",
  "pointerdown",
  "pointermove",
  "pointerout",
  "pointerover",
  "pointerup",
  "touchend",
  "touchmove",
  "touchstart"
]), yf = /* @__PURE__ */ new Set([
  "altGlyph",
  "altGlyphDef",
  "altGlyphItem",
  "animate",
  "animateColor",
  "animateMotion",
  "animateTransform",
  "circle",
  "clipPath",
  "color-profile",
  "cursor",
  "defs",
  "desc",
  "ellipse",
  "feBlend",
  "feColorMatrix",
  "feComponentTransfer",
  "feComposite",
  "feConvolveMatrix",
  "feDiffuseLighting",
  "feDisplacementMap",
  "feDistantLight",
  "feDropShadow",
  "feFlood",
  "feFuncA",
  "feFuncB",
  "feFuncG",
  "feFuncR",
  "feGaussianBlur",
  "feImage",
  "feMerge",
  "feMergeNode",
  "feMorphology",
  "feOffset",
  "fePointLight",
  "feSpecularLighting",
  "feSpotLight",
  "feTile",
  "feTurbulence",
  "filter",
  "font",
  "font-face",
  "font-face-format",
  "font-face-name",
  "font-face-src",
  "font-face-uri",
  "foreignObject",
  "g",
  "glyph",
  "glyphRef",
  "hkern",
  "image",
  "line",
  "linearGradient",
  "marker",
  "mask",
  "metadata",
  "missing-glyph",
  "mpath",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "radialGradient",
  "rect",
  "set",
  "stop",
  "svg",
  "switch",
  "symbol",
  "text",
  "textPath",
  "tref",
  "tspan",
  "use",
  "view",
  "vkern"
]), xf = {
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace"
};
function kf(t, e, n) {
  let r = n.length, i = e.length, s = r, o = 0, a = 0, l = e[i - 1].nextSibling, c = null;
  for (; o < i || a < s; ) {
    if (e[o] === n[a]) {
      o++, a++;
      continue;
    }
    for (; e[i - 1] === n[s - 1]; )
      i--, s--;
    if (i === o) {
      const u = s < r ? a ? n[a - 1].nextSibling : n[s - a] : l;
      for (; a < s; )
        t.insertBefore(n[a++], u);
    } else if (s === a)
      for (; o < i; )
        (!c || !c.has(e[o])) && e[o].remove(), o++;
    else if (e[o] === n[s - 1] && n[a] === e[i - 1]) {
      const u = e[--i].nextSibling;
      t.insertBefore(n[a++], e[o++].nextSibling), t.insertBefore(n[--s], u), e[i] = n[s];
    } else {
      if (!c) {
        c = /* @__PURE__ */ new Map();
        let f = a;
        for (; f < s; )
          c.set(n[f], f++);
      }
      const u = c.get(e[o]);
      if (u != null)
        if (a < u && u < s) {
          let f = o, h = 1, m;
          for (; ++f < i && f < s && !((m = c.get(e[f])) == null || m !== u + h); )
            h++;
          if (h > u - a) {
            const w = e[o];
            for (; a < u; )
              t.insertBefore(n[a++], w);
          } else
            t.replaceChild(n[a++], e[o++]);
        } else
          o++;
      else
        e[o++].remove();
    }
  }
}
const aa = "_$DX_DELEGATE";
function Cf(t, e, n, r = {}) {
  let i;
  return Ar((s) => {
    i = s, e === document ? t() : k(e, t(), e.firstChild ? null : void 0, n);
  }, r.owner), () => {
    i(), e.textContent = "";
  };
}
function L(t, e, n) {
  let r;
  const i = () => {
    const o = document.createElement("template");
    return o.innerHTML = t, o.content.firstChild;
  }, s = () => (r || (r = i())).cloneNode(!0);
  return s.cloneNode = s, s;
}
function qi(t, e = window.document) {
  const n = e[aa] || (e[aa] = /* @__PURE__ */ new Set());
  for (let r = 0, i = t.length; r < i; r++) {
    const s = t[r];
    n.has(s) || (n.add(s), e.addEventListener(s, Pf));
  }
}
function Xe(t, e, n) {
  n == null ? t.removeAttribute(e) : t.setAttribute(e, n);
}
function _f(t, e, n, r) {
  r == null ? t.removeAttributeNS(e, n) : t.setAttributeNS(e, n, r);
}
function De(t, e) {
  e == null ? t.removeAttribute("class") : t.className = e;
}
function Sf(t, e, n, r) {
  if (r)
    Array.isArray(n) ? (t[`$$${e}`] = n[0], t[`$$${e}Data`] = n[1]) : t[`$$${e}`] = n;
  else if (Array.isArray(n)) {
    const i = n[0];
    t.addEventListener(e, n[0] = (s) => i.call(t, n[1], s));
  } else
    t.addEventListener(e, n);
}
function Mf(t, e, n = {}) {
  const r = Object.keys(e || {}), i = Object.keys(n);
  let s, o;
  for (s = 0, o = i.length; s < o; s++) {
    const a = i[s];
    !a || a === "undefined" || e[a] || (la(t, a, !1), delete n[a]);
  }
  for (s = 0, o = r.length; s < o; s++) {
    const a = r[s], l = !!e[a];
    !a || a === "undefined" || n[a] === l || !l || (la(t, a, !0), n[a] = l);
  }
  return n;
}
function Of(t, e, n) {
  if (!e)
    return n ? Xe(t, "style") : e;
  const r = t.style;
  if (typeof e == "string")
    return r.cssText = e;
  typeof n == "string" && (r.cssText = n = void 0), n || (n = {}), e || (e = {});
  let i, s;
  for (s in n)
    e[s] == null && r.removeProperty(s), delete n[s];
  for (s in e)
    i = e[s], i !== n[s] && (r.setProperty(s, i), n[s] = i);
  return n;
}
function nt(t, e = {}, n, r) {
  const i = {};
  return r || oe(
    () => i.children = jr(t, e.children, i.children)
  ), oe(
    () => typeof e.ref == "function" ? vt(e.ref, t) : e.ref = t
  ), oe(() => Ef(t, e, n, !0, i, !0)), i;
}
function vt(t, e, n) {
  return lt(() => t(e, n));
}
function k(t, e, n, r) {
  if (n !== void 0 && !r && (r = []), typeof e != "function")
    return jr(t, e, r, n);
  oe((i) => jr(t, e(), i, n), r);
}
function Ef(t, e, n, r, i = {}, s = !1) {
  e || (e = {});
  for (const o in i)
    if (!(o in e)) {
      if (o === "children")
        continue;
      i[o] = ca(t, o, null, i[o], n, s);
    }
  for (const o in e) {
    if (o === "children")
      continue;
    const a = e[o];
    i[o] = ca(t, o, a, i[o], n, s);
  }
}
function If(t) {
  return t.toLowerCase().replace(/-([a-z])/g, (e, n) => n.toUpperCase());
}
function la(t, e, n) {
  const r = e.trim().split(/\s+/);
  for (let i = 0, s = r.length; i < s; i++)
    t.classList.toggle(r[i], n);
}
function ca(t, e, n, r, i, s) {
  let o, a, l, c, u;
  if (e === "style")
    return Of(t, n, r);
  if (e === "classList")
    return Mf(t, n, r);
  if (n === r)
    return r;
  if (e === "ref")
    s || n(t);
  else if (e.slice(0, 3) === "on:") {
    const f = e.slice(3);
    r && t.removeEventListener(f, r), n && t.addEventListener(f, n);
  } else if (e.slice(0, 10) === "oncapture:") {
    const f = e.slice(10);
    r && t.removeEventListener(f, r, !0), n && t.addEventListener(f, n, !0);
  } else if (e.slice(0, 2) === "on") {
    const f = e.slice(2).toLowerCase(), h = bf.has(f);
    if (!h && r) {
      const m = Array.isArray(r) ? r[0] : r;
      t.removeEventListener(f, m);
    }
    (h || n) && (Sf(t, f, n, h), h && qi([f]));
  } else if (e.slice(0, 5) === "attr:")
    Xe(t, e.slice(5), n);
  else if ((u = e.slice(0, 5) === "prop:") || (l = mf.has(e)) || !i && ((c = vf(e, t.tagName)) || (a = gf.has(e))) || (o = t.nodeName.includes("-")))
    u && (e = e.slice(5), a = !0), e === "class" || e === "className" ? De(t, n) : o && !a && !l ? t[If(e)] = n : t[c || e] = n;
  else {
    const f = i && e.indexOf(":") > -1 && xf[e.split(":")[0]];
    f ? _f(t, f, e, n) : Xe(t, wf[e] || e, n);
  }
  return n;
}
function Pf(t) {
  const e = `$$${t.type}`;
  let n = t.composedPath && t.composedPath()[0] || t.target;
  for (t.target !== n && Object.defineProperty(t, "target", {
    configurable: !0,
    value: n
  }), Object.defineProperty(t, "currentTarget", {
    configurable: !0,
    get() {
      return n || document;
    }
  }); n; ) {
    const r = n[e];
    if (r && !n.disabled) {
      const i = n[`${e}Data`];
      if (i !== void 0 ? r.call(n, i, t) : r.call(n, t), t.cancelBubble)
        return;
    }
    n = n._$host || n.parentNode || n.host;
  }
}
function jr(t, e, n, r, i) {
  for (; typeof n == "function"; )
    n = n();
  if (e === n)
    return n;
  const s = typeof e, o = r !== void 0;
  if (t = o && n[0] && n[0].parentNode || t, s === "string" || s === "number")
    if (s === "number" && (e = e.toString()), o) {
      let a = n[0];
      a && a.nodeType === 3 ? a.data !== e && (a.data = e) : a = document.createTextNode(e), n = Fn(t, n, r, a);
    } else
      n !== "" && typeof n == "string" ? n = t.firstChild.data = e : n = t.textContent = e;
  else if (e == null || s === "boolean")
    n = Fn(t, n, r);
  else {
    if (s === "function")
      return oe(() => {
        let a = e();
        for (; typeof a == "function"; )
          a = a();
        n = jr(t, a, n, r);
      }), () => n;
    if (Array.isArray(e)) {
      const a = [], l = n && Array.isArray(n);
      if (Qs(a, e, n, i))
        return oe(() => n = jr(t, a, n, r, !0)), () => n;
      if (a.length === 0) {
        if (n = Fn(t, n, r), o)
          return n;
      } else
        l ? n.length === 0 ? ua(t, a, r) : kf(t, n, a) : (n && Fn(t), ua(t, a));
      n = a;
    } else if (e.nodeType) {
      if (Array.isArray(n)) {
        if (o)
          return n = Fn(t, n, r, e);
        Fn(t, n, null, e);
      } else
        n == null || n === "" || !t.firstChild ? t.appendChild(e) : t.replaceChild(e, t.firstChild);
      n = e;
    }
  }
  return n;
}
function Qs(t, e, n, r) {
  let i = !1;
  for (let s = 0, o = e.length; s < o; s++) {
    let a = e[s], l = n && n[t.length], c;
    if (!(a == null || a === !0 || a === !1))
      if ((c = typeof a) == "object" && a.nodeType)
        t.push(a);
      else if (Array.isArray(a))
        i = Qs(t, a, l) || i;
      else if (c === "function")
        if (r) {
          for (; typeof a == "function"; )
            a = a();
          i = Qs(
            t,
            Array.isArray(a) ? a : [a],
            Array.isArray(l) ? l : [l]
          ) || i;
        } else
          t.push(a), i = !0;
      else {
        const u = String(a);
        l && l.nodeType === 3 && l.data === u ? t.push(l) : t.push(document.createTextNode(u));
      }
  }
  return i;
}
function ua(t, e, n = null) {
  for (let r = 0, i = e.length; r < i; r++)
    t.insertBefore(e[r], n);
}
function Fn(t, e, n, r) {
  if (n === void 0)
    return t.textContent = "";
  const i = r || document.createTextNode("");
  if (e.length) {
    let s = !1;
    for (let o = e.length - 1; o >= 0; o--) {
      const a = e[o];
      if (i !== a) {
        const l = a.parentNode === t;
        !s && !o ? l ? t.replaceChild(i, a) : t.insertBefore(i, n) : l && a.remove();
      } else
        s = !0;
    }
  } else
    t.insertBefore(i, n);
  return [i];
}
const Df = !1, $f = "http://www.w3.org/2000/svg";
function Bl(t, e = !1) {
  return e ? document.createElementNS($f, t) : document.createElement(t);
}
function Gi(t) {
  const { useShadow: e } = t, n = document.createTextNode(""), r = () => t.mount || document.body, i = Zd();
  let s, o = !!Tl.context;
  return Z(
    () => {
      s || (s = ef(i, () => J(() => t.children)));
      const a = r();
      if (a instanceof HTMLHeadElement) {
        const [l, c] = N(!1), u = () => c(!0);
        Ar((f) => k(a, () => l() ? f() : s(), null)), me(u);
      } else {
        const l = Bl(t.isSVG ? "g" : "div", t.isSVG), c = e && l.attachShadow ? l.attachShadow({
          mode: "open"
        }) : l;
        Object.defineProperty(l, "_$host", {
          get() {
            return n.parentNode;
          },
          configurable: !0
        }), k(c, s), a.appendChild(l), t.ref && t.ref(l), me(() => a.removeChild(l));
      }
    },
    void 0,
    {
      render: !o
    }
  ), n;
}
function yi(t) {
  const [e, n] = K(t, ["component"]), r = J(() => e.component);
  return J(() => {
    const i = r();
    switch (typeof i) {
      case "function":
        return lt(() => i(n));
      case "string":
        const s = yf.has(i), o = Bl(i, s);
        return nt(o, n, s), o;
    }
  });
}
const Yn = Symbol("store-raw"), Rt = Symbol("store-node"), Ct = Symbol("store-has"), jl = Symbol("store-self");
function Wl(t) {
  let e = t[Ye];
  if (!e && (Object.defineProperty(t, Ye, {
    value: e = new Proxy(t, Af)
  }), !Array.isArray(t))) {
    const n = Object.keys(t), r = Object.getOwnPropertyDescriptors(t);
    for (let i = 0, s = n.length; i < s; i++) {
      const o = n[i];
      r[o].get && Object.defineProperty(t, o, {
        enumerable: r[o].enumerable,
        get: r[o].get.bind(e)
      });
    }
  }
  return e;
}
function $t(t) {
  let e;
  return t != null && typeof t == "object" && (t[Ye] || !(e = Object.getPrototypeOf(t)) || e === Object.prototype || Array.isArray(t));
}
function Tt(t, e = /* @__PURE__ */ new Set()) {
  let n, r, i, s;
  if (n = t != null && t[Yn])
    return n;
  if (!$t(t) || e.has(t))
    return t;
  if (Array.isArray(t)) {
    Object.isFrozen(t) ? t = t.slice(0) : e.add(t);
    for (let o = 0, a = t.length; o < a; o++)
      i = t[o], (r = Tt(i, e)) !== i && (t[o] = r);
  } else {
    Object.isFrozen(t) ? t = Object.assign({}, t) : e.add(t);
    const o = Object.keys(t), a = Object.getOwnPropertyDescriptors(t);
    for (let l = 0, c = o.length; l < c; l++)
      s = o[l], !a[s].get && (i = t[s], (r = Tt(i, e)) !== i && (t[s] = r));
  }
  return t;
}
function Xn(t, e) {
  let n = t[e];
  return n || Object.defineProperty(t, e, {
    value: n = /* @__PURE__ */ Object.create(null)
  }), n;
}
function En(t, e, n) {
  if (t[e])
    return t[e];
  const [r, i] = N(n, {
    equals: !1,
    internal: !0
  });
  return r.$ = i, t[e] = r;
}
function Tf(t, e) {
  const n = Reflect.getOwnPropertyDescriptor(t, e);
  return !n || n.get || !n.configurable || e === Ye || e === Rt || (delete n.value, delete n.writable, n.get = () => t[Ye][e]), n;
}
function Co(t) {
  Br() && En(Xn(t, Rt), jl)();
}
function Hl(t) {
  return Co(t), Reflect.ownKeys(t);
}
const Af = {
  get(t, e, n) {
    if (e === Yn)
      return t;
    if (e === Ye)
      return n;
    if (e === Kr)
      return Co(t), n;
    const r = Xn(t, Rt), i = r[e];
    let s = i ? i() : t[e];
    if (e === Rt || e === Ct || e === "__proto__")
      return s;
    if (!i) {
      const o = Object.getOwnPropertyDescriptor(t, e);
      Br() && (typeof s != "function" || t.hasOwnProperty(e)) && !(o && o.get) && (s = En(r, e, s)());
    }
    return $t(s) ? Wl(s) : s;
  },
  has(t, e) {
    return e === Yn || e === Ye || e === Kr || e === Rt || e === Ct || e === "__proto__" ? !0 : (Br() && En(Xn(t, Ct), e)(), e in t);
  },
  set() {
    return !0;
  },
  deleteProperty() {
    return !0;
  },
  ownKeys: Hl,
  getOwnPropertyDescriptor: Tf
};
function it(t, e, n, r = !1) {
  if (!r && t[e] === n)
    return;
  const i = t[e], s = t.length;
  n === void 0 ? (delete t[e], t[Ct] && t[Ct][e] && i !== void 0 && t[Ct][e].$()) : (t[e] = n, t[Ct] && t[Ct][e] && i === void 0 && t[Ct][e].$());
  let o = Xn(t, Rt), a;
  if ((a = En(o, e, i)) && a.$(() => n), Array.isArray(t) && t.length !== s) {
    for (let l = t.length; l < s; l++)
      (a = o[l]) && a.$();
    (a = En(o, "length", s)) && a.$(t.length);
  }
  (a = o[jl]) && a.$();
}
function Ul(t, e) {
  const n = Object.keys(e);
  for (let r = 0; r < n.length; r += 1) {
    const i = n[r];
    it(t, i, e[i]);
  }
}
function Lf(t, e) {
  if (typeof e == "function" && (e = e(t)), e = Tt(e), Array.isArray(e)) {
    if (t === e)
      return;
    let n = 0, r = e.length;
    for (; n < r; n++) {
      const i = e[n];
      t[n] !== i && it(t, n, i);
    }
    it(t, "length", r);
  } else
    Ul(t, e);
}
function Ir(t, e, n = []) {
  let r, i = t;
  if (e.length > 1) {
    r = e.shift();
    const o = typeof r, a = Array.isArray(t);
    if (Array.isArray(r)) {
      for (let l = 0; l < r.length; l++)
        Ir(t, [r[l]].concat(e), n);
      return;
    } else if (a && o === "function") {
      for (let l = 0; l < t.length; l++)
        r(t[l], l) && Ir(t, [l].concat(e), n);
      return;
    } else if (a && o === "object") {
      const { from: l = 0, to: c = t.length - 1, by: u = 1 } = r;
      for (let f = l; f <= c; f += u)
        Ir(t, [f].concat(e), n);
      return;
    } else if (e.length > 1) {
      Ir(t[r], e, [r].concat(n));
      return;
    }
    i = t[r], n = [r].concat(n);
  }
  let s = e[0];
  typeof s == "function" && (s = s(i, n), s === i) || r === void 0 && s == null || (s = Tt(s), r === void 0 || $t(i) && $t(s) && !Array.isArray(s) ? Ul(i, s) : it(t, r, s));
}
function ql(...[t, e]) {
  const n = Tt(t || {}), r = Array.isArray(n), i = Wl(n);
  function s(...o) {
    zt(() => {
      r && o.length === 1 ? Lf(n, o[0]) : Ir(n, o);
    });
  }
  return [i, s];
}
function Ff(t, e) {
  const n = Reflect.getOwnPropertyDescriptor(t, e);
  return !n || n.get || n.set || !n.configurable || e === Ye || e === Rt || (delete n.value, delete n.writable, n.get = () => t[Ye][e], n.set = (r) => t[Ye][e] = r), n;
}
const zf = {
  get(t, e, n) {
    if (e === Yn)
      return t;
    if (e === Ye)
      return n;
    if (e === Kr)
      return Co(t), n;
    const r = Xn(t, Rt), i = r[e];
    let s = i ? i() : t[e];
    if (e === Rt || e === Ct || e === "__proto__")
      return s;
    if (!i) {
      const o = Object.getOwnPropertyDescriptor(t, e), a = typeof s == "function";
      if (Br() && (!a || t.hasOwnProperty(e)) && !(o && o.get))
        s = En(r, e, s)();
      else if (s != null && a && s === Array.prototype[e])
        return (...l) => zt(() => Array.prototype[e].apply(n, l));
    }
    return $t(s) ? Gl(s) : s;
  },
  has(t, e) {
    return e === Yn || e === Ye || e === Kr || e === Rt || e === Ct || e === "__proto__" ? !0 : (Br() && En(Xn(t, Ct), e)(), e in t);
  },
  set(t, e, n) {
    return zt(() => it(t, e, Tt(n))), !0;
  },
  deleteProperty(t, e) {
    return zt(() => it(t, e, void 0, !0)), !0;
  },
  ownKeys: Hl,
  getOwnPropertyDescriptor: Ff
};
function Gl(t) {
  let e = t[Ye];
  if (!e) {
    Object.defineProperty(t, Ye, {
      value: e = new Proxy(t, zf)
    });
    const n = Object.keys(t), r = Object.getOwnPropertyDescriptors(t), i = Object.getPrototypeOf(t), s = t !== null && typeof t == "object" && !Array.isArray(t) && i !== Object.prototype;
    if (s) {
      const o = Object.getOwnPropertyDescriptors(i);
      n.push(...Object.keys(o)), Object.assign(r, o);
    }
    for (let o = 0, a = n.length; o < a; o++) {
      const l = n[o];
      if (!(s && l === "constructor")) {
        if (r[l].get) {
          const c = r[l].get.bind(e);
          Object.defineProperty(t, l, {
            get: c,
            configurable: !0
          });
        }
        if (r[l].set) {
          const c = r[l].set;
          Object.defineProperty(t, l, {
            set: (f) => zt(() => c.call(e, f)),
            configurable: !0
          });
        }
      }
    }
  }
  return e;
}
function Yl(t, e) {
  const n = Tt(t || {});
  return Gl(n);
}
function Rf(t, e) {
  zt(() => e(Tt(t)));
}
const Js = Symbol("store-root");
function Nn(t, e, n, r, i) {
  const s = e[n];
  if (t === s)
    return;
  const o = Array.isArray(t);
  if (n !== Js && (!$t(t) || !$t(s) || o !== Array.isArray(s) || i && t[i] !== s[i])) {
    it(e, n, t);
    return;
  }
  if (o) {
    if (t.length && s.length && (!r || i && t[0] && t[0][i] != null)) {
      let c, u, f, h, m, w, g, p;
      for (f = 0, h = Math.min(s.length, t.length); f < h && (s[f] === t[f] || i && s[f] && t[f] && s[f][i] === t[f][i]); f++)
        Nn(t[f], s, f, r, i);
      const v = new Array(t.length), b = /* @__PURE__ */ new Map();
      for (h = s.length - 1, m = t.length - 1; h >= f && m >= f && (s[h] === t[m] || i && s[f] && t[f] && s[h][i] === t[m][i]); h--, m--)
        v[m] = s[h];
      if (f > m || f > h) {
        for (u = f; u <= m; u++)
          it(s, u, t[u]);
        for (; u < t.length; u++)
          it(s, u, v[u]), Nn(t[u], s, u, r, i);
        s.length > t.length && it(s, "length", t.length);
        return;
      }
      for (g = new Array(m + 1), u = m; u >= f; u--)
        w = t[u], p = i && w ? w[i] : w, c = b.get(p), g[u] = c === void 0 ? -1 : c, b.set(p, u);
      for (c = f; c <= h; c++)
        w = s[c], p = i && w ? w[i] : w, u = b.get(p), u !== void 0 && u !== -1 && (v[u] = s[c], u = g[u], b.set(p, u));
      for (u = f; u < t.length; u++)
        u in v ? (it(s, u, v[u]), Nn(t[u], s, u, r, i)) : it(s, u, t[u]);
    } else
      for (let c = 0, u = t.length; c < u; c++)
        Nn(t[c], s, c, r, i);
    s.length > t.length && it(s, "length", t.length);
    return;
  }
  const a = Object.keys(t);
  for (let c = 0, u = a.length; c < u; c++)
    Nn(t[a[c]], s, a[c], r, i);
  const l = Object.keys(s);
  for (let c = 0, u = l.length; c < u; c++)
    t[l[c]] === void 0 && it(s, l[c], void 0);
}
function Vf(t, e = {}) {
  const { merge: n, key: r = "id" } = e, i = Tt(t);
  return (s) => {
    if (!$t(s) || !$t(i))
      return i;
    const o = Nn(
      i,
      {
        [Js]: s
      },
      Js,
      n,
      r
    );
    return o === void 0 ? s : o;
  };
}
const Pi = /* @__PURE__ */ new WeakMap(), Xl = {
  get(t, e) {
    if (e === Yn)
      return t;
    const n = t[e];
    let r;
    return $t(n) ? Pi.get(n) || (Pi.set(n, r = new Proxy(n, Xl)), r) : n;
  },
  set(t, e, n) {
    return it(t, e, Tt(n)), !0;
  },
  deleteProperty(t, e) {
    return it(t, e, void 0, !0), !0;
  }
};
function Nf(t) {
  return (e) => {
    if ($t(e)) {
      let n;
      (n = Pi.get(e)) || Pi.set(e, n = new Proxy(e, Xl)), t(n);
    }
    return e;
  };
}
const Kf = (t, e) => {
  const n = {
    label: e.desc,
    value: e.value,
    description: e.fullDesc
  };
  return t.map(
    (r) => Object.keys(n).reduce((i, s) => ({ ...i, [s]: r[n[s]] }), {})
  );
}, Bf = () => new Promise((t) => {
  navigator.geolocation.getCurrentPosition(
    (e) => {
      t(e);
    }
  );
});
class jf {
  constructor() {
    pe(this, "events", {});
  }
  on(e, n) {
    var r;
    this.events[e] || (this.events[e] = []), (r = this.events[e]) == null || r.push(n);
  }
  off(e, n) {
    var r;
    this.events[e] = (r = this.events[e]) == null ? void 0 : r.filter((i) => i !== n);
  }
  emit(e, ...n) {
    for (const r of this.events[e] ?? [])
      r(...n);
  }
  has(e) {
    var n;
    return this.events[e] && (((n = this.events[e]) == null ? void 0 : n.length) || 0) > 0;
  }
}
const $e = Yl(new jf()), Wf = "Answer", Hf = "Blank", Uf = "Browse", qf = "Cancel", Gf = "Close", Yf = "Confirm", Xf = "Description", Qf = "Error", Jf = "Language", Zf = "No", eh = "Now", th = "or", nh = "Question", rh = "Remark", ih = "Reset", sh = "Review", oh = "Search", ah = "Settings", lh = "Submit", ch = "Summary", uh = "Template", dh = "Today", fh = "Upload", hh = "Uploaded", gh = "Validation", mh = "version", wh = "View", ph = "Warning", vh = "Yes", bh = {
  "add.item": "Add Item",
  "add.remark": "Add Remark",
  answer: Wf,
  "app.info": "App Info",
  blank: Hf,
  browse: Uf,
  cancel: qf,
  close: Gf,
  confirm: Yf,
  "dark.mode": "Dark Mode",
  delete: "Delete",
  "delete.file": "Delete File",
  "delete.file.confirmation": "Are you sure you want to delete this file?",
  "delete.nested": "Delete Item",
  "delete.nested.confirmation": 'Are you sure you want to delete item "{{name}}"?',
  "delete.photo": "Delete Photo",
  "delete.photo.confirmation": "Are you sure you want to delete this photo?",
  description: Xf,
  "drag.drop.csv": "Drag and drop CSV file here",
  "drag.drop.file": "Drag and drop file here",
  "drag.drop.photo": "Drag and drop photo here",
  error: Qf,
  "fill.other": "Fill Other",
  "font.size": "Font Size",
  "force.submit": "Force Submit",
  "get.location": "Get Location",
  "get.location.acquired": "Location acquired",
  "get.location.confirmation": "Are you sure you want to get your current location?",
  "get.time": "Get Time",
  "get.time.acquired": "Current time acquired",
  "get.time.confirmation": "Are you sure you want to get the current time?",
  language: Jf,
  no: Zf,
  "no.": "No. ",
  "no.options.found": "No options found",
  "no.remarks": "No Remarks",
  now: eh,
  or: th,
  "preview.photo": "Preview Photo",
  question: nh,
  remark: rh,
  reset: ih,
  review: sh,
  search: oh,
  "select.option": "Select an option",
  "select.options": "Select one or more options",
  "select.unit": "Select a unit",
  settings: ah,
  submit: lh,
  "submit.confirm.message": "Are you sure you want to submit this data?",
  "submit.confirm.title": "Confirm Submit",
  "submit.failed": "Failed to submit data, fix the error first",
  "submit.success": "Successfully submitted",
  summary: ch,
  template: uh,
  "this.month": "This Month",
  "this.week": "This Week",
  "this.year": "This Year",
  today: dh,
  upload: fh,
  "upload.file": "Upload File",
  "upload.file.failed": "Failed to upload file",
  "upload.file.confirmation": "Are you sure you want to upload this file?",
  "upload.photo": "Upload Photo",
  "upload.photo.confirmation": "Are you sure you want to upload this photo?",
  uploaded: hh,
  validation: gh,
  version: mh,
  view: wh,
  warning: ph,
  yes: vh
}, yh = "Isian", xh = "Kosong", kh = "Pilih", Ch = "Batal", _h = "Tutup", Sh = "Konfirmasi", Mh = "Deskripsi", Oh = "Kesalahan", Eh = "Bahasa", Ih = "Tidak", Ph = "Sekarang", Dh = "atau", $h = "Pertanyaan", Th = "Catatan", Ah = "Hapus", Lh = "Tinjau", Fh = "Cari", zh = "Pengaturan", Rh = "Submit", Vh = "Ringkasan", Nh = "Template", Kh = "Hari ini", Bh = "Unggah", jh = "Sudah Terunggah", Wh = "Validasi", Hh = "versi", Uh = "Lihat", qh = "Peringatan", Gh = "Ya", Yh = {
  "add.item": "Tambah",
  "add.remark": "Tambah Catatan",
  answer: yh,
  "app.info": "Info Aplikasi",
  blank: xh,
  browse: kh,
  cancel: Ch,
  close: _h,
  confirm: Sh,
  "dark.mode": "Mode Gelap",
  "delete.file": "Hapus File",
  "delete.file.confirmation": "Apakah Anda yakin ingin menghapus file ini?",
  "delete.nested": "Hapus Item",
  "delete.nested.confirmation": 'Apakah Anda yakin ingin menghapus item "{{name}}"?',
  "delete.photo": "Hapus Foto",
  "delete.photo.confirmation": "Apakah Anda yakin ingin menghapus foto ini?",
  description: Mh,
  "drag.drop.csv": "Tarik dan seret fail csv di sini",
  "drag.drop.file": "Tarik dan seret file di sini",
  "drag.drop.photo": "Tarik dan seret foto di sini",
  error: Oh,
  "fill.other": "Isikan Lainnya",
  "font.size": "Ukuran Font",
  "force.submit": "Submit Paksa",
  "get.location": "Ambil Lokasi",
  "get.location.acquired": "Berhasil mengambil lokasi",
  "get.location.confirmation": "Apakah Anda yakin ingin mengambil lokasi saat ini?",
  "get.time": "Ambil Waktu",
  "get.time.acquired": "Berhasil mendapatkan waktu sekarang",
  "get.time.confirmation": "Apakah Anda yakin ingin mengambil waktu saat ini?",
  language: Eh,
  no: Ih,
  "no.": "No.",
  "no.options.found": "Pilihan tidak ditemukan",
  "no.remarks": "Tidak ada catatan",
  now: Ph,
  or: Dh,
  "preview.photo": "Pratinjau Foto",
  question: $h,
  remark: Th,
  reset: Ah,
  review: Lh,
  search: Fh,
  "select.option": "Pilih salah satu",
  "select.options": "Pilih satu atau lebih",
  "select.unit": "Pilih Satuan",
  settings: zh,
  submit: Rh,
  "submit.confirm.message": "Apakah Anda yakin ingin mengirimkan data ini?",
  "submit.confirm.title": "Konfirmasi Submit",
  "submit.failed": "Gagal melakukan submit, terdapat error",
  "submit.success": "Berhasil submit data",
  summary: Vh,
  template: Nh,
  "this.month": "Bulan ini",
  "this.week": "Minggu ini",
  "this.year": "Tahun ini",
  today: Kh,
  upload: Bh,
  "upload.file": "Unggah File",
  "upload.file.confirmation": "Apakah Anda yakin ingin mengunggah file ini?",
  "upload.file.failed": "Gagal mengunggah file",
  "upload.photo": "Unggah Foto",
  "upload.photo.confirmation": "Apakah Anda yakin ingin mengunggah foto ini?",
  uploaded: jh,
  validation: Wh,
  version: Hh,
  view: Uh,
  warning: qh,
  yes: Gh
}, Xh = () => {
  va("en", bh), va("id", Yh);
}, Ql = "This field is required", Qh = {
  "file.not.uploaded.yet": "File not uploaded yet",
  "invalid.email": "Invalid email",
  "invalid.number": "Invalid number",
  "invalid.url": "Invalid URL",
  "photo.not.uploaded.yet": "Photo not uploaded yet",
  required: Ql,
  "required.open": "The other field is required",
  "invalid.length.min": "Length must be at least {{lengthInput.minlength}}",
  "invalid.length.max": "Length must not exceed {{lengthInput.maxlength}}",
  "invalid.mask": "Text must match {{maskingFormat}} format",
  "invalid.min": "Value must be at least {{rangeInput.min}}",
  "invalid.max": "Value must not exceed {{rangeInput.max}}",
  "invalid.gps": "Accuracy must not exceed {{minAccuracy}}"
}, Jh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Qh,
  required: Ql
}, Symbol.toStringTag, { value: "Module" })), Jl = "Wajib diisi", Zh = {
  "file.not.uploaded.yet": "File belum diunggah",
  "invalid.email": "Email tidak valid",
  "invalid.number": "Angka tidak valid",
  "invalid.url": "URL tidak valid",
  "photo.not.uploaded.yet": "Foto belum diunggah",
  required: Jl,
  "required.open": "Rincian lainnya wajib diisi",
  "invalid.length.min": "Panjang minimal {{lengthInput.minlength}}",
  "invalid.length.max": "Panjang maksimal {{lengthInput.maxlength}}",
  "invalid.mask": "Teks harus sesuai format {{maskingFormat}}",
  "invalid.min": "Tidak boleh kurang dari {{rangeInput.min}}",
  "invalid.max": "Tidak boleh lebih dari {{rangeInput.max}}",
  "invalid.gps": "Akurasi GPS tidak boleh lebih dari {{minAccuracy}}"
}, e0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Zh,
  required: Jl
}, Symbol.toStringTag, { value: "Module" })), et = (t, e) => e.reduce((n, r) => t[r] !== void 0 ? { ...n, [r]: t[r] } : n, {}), t0 = (t, e) => Object.keys(t).reduce(
  (n, r) => e.includes(r) ? n : { ...n, [r]: t[r] },
  {}
), n0 = (t, e = "next") => {
  const n = e === "next" ? 1 : -1;
  if (t.length === 0)
    return [];
  const r = [...t];
  return r[r.length - 1] += n, r;
}, Cs = (t) => t.map((e) => ({ ...e })), Zl = (t, e) => {
  const n = (r, i) => {
    if (i.length === 0)
      return r;
    let s = r;
    for (let o = i.length; o > 0; o--) {
      const a = i.slice(0, o).join(".");
      if (s[a] !== void 0)
        return s = s[a], n(s, i.slice(o));
    }
  };
  return n(t, e.split("."));
}, r0 = (t, e, n) => n.reduce((r, i) => t[i] !== void 0 ? { ...r, [i]: e(t[i], i) } : r, t), ec = (t, e) => {
  if (t === e)
    return !0;
  if (typeof t != "object" || t === null || typeof e != "object" || e === null)
    return !1;
  const n = Object.keys(t), r = Object.keys(e);
  if (n.length !== r.length)
    return !1;
  for (const i of n)
    if (!r.includes(i) || !ec(
      t[i],
      e[i]
    ))
      return !1;
  return !0;
};
var tc = /* @__PURE__ */ ((t) => (t[t.Section = 1] = "Section", t[t.NestedInput = 2] = "NestedInput", t[t.InnerHTML = 3] = "InnerHTML", t[t.VariableInput = 4] = "VariableInput", t[t.NestedChild = 5] = "NestedChild", t[t.RangeSliderInput = 18] = "RangeSliderInput", t[t.GpsInput = 33] = "GpsInput", t[t.CsvInput = 34] = "CsvInput", t[t.NowInput = 35] = "NowInput", t[t.SignatureInput = 36] = "SignatureInput", t[t.UnitInput = 37] = "UnitInput", t))(tc || {}), Di = /* @__PURE__ */ ((t) => (t[t.UrlInput = 19] = "UrlInput", t[t.CurrencyInput = 20] = "CurrencyInput", t[t.MaskingInput = 24] = "MaskingInput", t[t.TextInput = 25] = "TextInput", t[t.TextAreaInput = 30] = "TextAreaInput", t[t.EmailInput = 31] = "EmailInput", t))(Di || {}), Lr = /* @__PURE__ */ ((t) => (t[t.NumberInput = 28] = "NumberInput", t[t.DecimalInput = 38] = "DecimalInput", t))(Lr || {}), _o = /* @__PURE__ */ ((t) => (t[t.RadioInput = 26] = "RadioInput", t[t.SelectInput = 27] = "SelectInput", t[t.RatingInput = 40] = "RatingInput", t))(_o || {}), nc = /* @__PURE__ */ ((t) => (t[t.DateInput = 11] = "DateInput", t[t.DateTimeLocalInput = 12] = "DateTimeLocalInput", t[t.TimeInput = 13] = "TimeInput", t[t.MonthInput = 14] = "MonthInput", t[t.WeekInput = 15] = "WeekInput", t[t.YearInput = 10] = "YearInput", t))(nc || {}), So = /* @__PURE__ */ ((t) => (t[t.ListTextInputRepeat = 21] = "ListTextInputRepeat", t[t.MultipleSelectInput = 23] = "MultipleSelectInput", t[t.ListSelectInputRepeat = 22] = "ListSelectInputRepeat", t[t.CheckboxInput = 29] = "CheckboxInput", t))(So || {}), rc = /* @__PURE__ */ ((t) => (t[t.SingleCheckInput = 16] = "SingleCheckInput", t[t.ToggleInput = 17] = "ToggleInput", t))(rc || {}), ic = /* @__PURE__ */ ((t) => (t[t.PhotoInput = 32] = "PhotoInput", t[t.FileInput = 39] = "FileInput", t))(ic || {});
const ie = {
  ...tc,
  ...Di,
  ...Lr,
  ..._o,
  ...So,
  ...rc,
  ...ic,
  ...nc
}, _s = {
  Text: "text",
  None: "none",
  Tel: "tel",
  Url: "url",
  Email: "email",
  Numeric: "numeric",
  Decimal: "decimal",
  Search: "search"
};
var sc = /* @__PURE__ */ ((t) => (t[t.Warning = 1] = "Warning", t[t.Error = 2] = "Error", t))(sc || {}), xi = /* @__PURE__ */ ((t) => (t[t.SingleValue = 1] = "SingleValue", t[t.MultiValue = 2] = "MultiValue", t[t.HTML = 3] = "HTML", t))(xi || {}), ct = /* @__PURE__ */ ((t) => (t[t.Valid = 0] = "Valid", t[t.Warning = 1] = "Warning", t[t.Invalid = 2] = "Invalid", t))(ct || {});
const i0 = {
  en: "English",
  id: "Indonesian"
}, da = /* @__PURE__ */ Object.assign({
  "../locales/en.json": Jh,
  "../locales/id.json": e0
}), s0 = (t) => {
  var e;
  return (e = t.split("/").pop()) == null ? void 0 : e.split(".")[0];
}, o0 = () => {
  const t = /* @__PURE__ */ new Map();
  for (const e in da) {
    const n = s0(e);
    t.set(n, da[e].default);
  }
  return t;
}, a0 = (t, e, n, r = {}) => {
  const i = l0(t, n), s = c0(e, i);
  return u0(s, r);
}, l0 = (t, e) => Array.isArray(t) || t === void 0 ? "" : typeof t == "string" ? t : typeof t == "object" ? t[e] ?? t.default : String(t), c0 = (t, e) => {
  if (!t)
    return e;
  const n = Zl(t, e);
  return typeof n == "string" ? n : e;
}, u0 = (t, e) => t.replace(/{{(.*?)}}/g, (n, r) => {
  const i = Zl(e, r);
  return typeof i == "string" || typeof i == "number" ? i.toString() : n;
}), Zs = { t: a0, langs: i0, importDefaultLocales: o0 };
var Te = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function oc(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var ac = {}, un = {}, dn = {}, Yi = {}, lc = {};
(function(t) {
  var e = Te && Te.__awaiter || function(g, p, v, b) {
    function C(_) {
      return _ instanceof v ? _ : new v(function(E) {
        E(_);
      });
    }
    return new (v || (v = Promise))(function(_, E) {
      function F(y) {
        try {
          x(b.next(y));
        } catch (z) {
          E(z);
        }
      }
      function T(y) {
        try {
          x(b.throw(y));
        } catch (z) {
          E(z);
        }
      }
      function x(y) {
        y.done ? _(y.value) : C(y.value).then(F, T);
      }
      x((b = b.apply(g, p || [])).next());
    });
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), t.isComparable = t.roundFixed = t.calcMinUnitsRequired = t.isWeakKey = t.throwRangeError = t.rangeCheck = t.getMSB = t.trampolineAsync = t.trampoline = t.toThunk = t.isThunk = t.THUNK_SYMBOL = t.arrayRemove = t.uuidV4 = void 0;
  const n = function() {
    return "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx".replace(/[x]/g, function(g) {
      const p = Math.random() * 16 | 0;
      return (g == "x" ? p : p & 3 | 8).toString(16);
    });
  };
  t.uuidV4 = n;
  const r = function(g, p) {
    let v = -1, b = g ? g.length : 0;
    const C = [];
    for (; ++v < b; ) {
      const _ = g[v];
      p(_, v, g) && (C.push(_), Array.prototype.splice.call(g, v--, 1), b--);
    }
    return C;
  };
  t.arrayRemove = r, t.THUNK_SYMBOL = Symbol("thunk");
  const i = (g) => typeof g == "function" && g.__THUNK__ === t.THUNK_SYMBOL;
  t.isThunk = i;
  const s = (g) => {
    const p = () => g();
    return p.__THUNK__ = t.THUNK_SYMBOL, p;
  };
  t.toThunk = s;
  const o = (g) => Object.assign((...v) => {
    let b = g(...v);
    for (; (0, t.isThunk)(b) && typeof b == "function"; )
      b = b();
    return b;
  }, { cont: (...v) => (0, t.toThunk)(() => g(...v)) });
  t.trampoline = o;
  const a = (g) => Object.assign((...v) => e(void 0, void 0, void 0, function* () {
    let b = yield g(...v);
    for (; (0, t.isThunk)(b) && typeof b == "function"; )
      b = yield b();
    return b;
  }), { cont: (...v) => (0, t.toThunk)(() => g(...v)) });
  t.trampolineAsync = a;
  const l = (g) => g <= 0 ? 0 : 1 << 31 - Math.clz32(g);
  t.getMSB = l;
  const c = (g, p, v, b = "Index out of bounds.") => {
    if (g < p || g > v)
      throw new RangeError(b);
  };
  t.rangeCheck = c;
  const u = (g = "The value is off-limits.") => {
    throw new RangeError(g);
  };
  t.throwRangeError = u;
  const f = (g) => {
    const p = typeof g;
    return p === "object" && g !== null || p === "function";
  };
  t.isWeakKey = f;
  const h = (g, p) => Math.floor((g + p - 1) / p);
  t.calcMinUnitsRequired = h;
  const m = (g, p = 10) => {
    const v = Math.pow(10, p);
    return Math.round(g * v) / v;
  };
  t.roundFixed = m;
  function w(g) {
    const p = typeof g;
    return p === "number" ? !isNaN(g) : p === "string" || p === "bigint" || p === "boolean" ? !0 : p === "symbol" || p === "undefined" ? !1 : p === "function" ? w(g()) : p === "object" ? g === null : !1;
  }
  t.isComparable = w;
})(lc);
var Xi = {};
Object.defineProperty(Xi, "__esModule", { value: !0 });
Xi.toBinaryString = void 0;
function d0(t, e = 32) {
  let n = (t >>> 0).toString(2);
  return n = n.padStart(e, "0"), n;
}
Xi.toBinaryString = d0;
(function(t) {
  var e = Te && Te.__createBinding || (Object.create ? function(r, i, s, o) {
    o === void 0 && (o = s);
    var a = Object.getOwnPropertyDescriptor(i, s);
    (!a || ("get" in a ? !i.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return i[s];
    } }), Object.defineProperty(r, o, a);
  } : function(r, i, s, o) {
    o === void 0 && (o = s), r[o] = i[s];
  }), n = Te && Te.__exportStar || function(r, i) {
    for (var s in r)
      s !== "default" && !Object.prototype.hasOwnProperty.call(i, s) && e(i, r, s);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(lc, t), n(Xi, t);
})(Yi);
var Tn = {}, Qi = {};
Object.defineProperty(Qi, "__esModule", { value: !0 });
Qi.IterableEntryBase = void 0;
class f0 {
  // protected _toEntryFn?: (rawElement: R) => BTNEntry<K, V>;
  //
  // /**
  //  * The function returns the value of the _toEntryFn property.
  //  * @returns The function being returned is `this._toEntryFn`.
  //  */
  // get toEntryFn() {
  //   return this._toEntryFn;
  // }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The function is an implementation of the Symbol.iterator method that returns an iterable iterator.
   * @param {any[]} args - The `args` parameter in the code snippet represents a rest parameter. It
   * allows the function to accept any number of arguments as an array. In this case, the `args`
   * parameter is used to pass any additional arguments to the `_getIterator` method.
   */
  *[Symbol.iterator](...e) {
    yield* this._getIterator(...e);
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The function returns an iterator that yields key-value pairs from the object, where the value can
   * be undefined.
   */
  *entries() {
    for (const e of this)
      yield e;
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The function returns an iterator that yields the keys of a data structure.
   */
  *keys() {
    for (const e of this)
      yield e[0];
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The function returns an iterator that yields the values of a collection.
   */
  *values() {
    for (const e of this)
      yield e[1];
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `every` function checks if every element in a collection satisfies a given condition.
   * @param predicate - The `predicate` parameter is a callback function that takes three arguments:
   * `value`, `key`, and `index`. It should return a boolean value indicating whether the condition is
   * met for the current element in the iteration.
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that specifies the value
   * to be used as `this` when executing the `predicate` function. If `thisArg` is provided, it will be
   * passed as the first argument to the `predicate` function. If `thisArg` is not provided
   * @returns The `every` method is returning a boolean value. It returns `true` if every element in
   * the collection satisfies the provided predicate function, and `false` otherwise.
   */
  every(e, n) {
    let r = 0;
    for (const i of this)
      if (!e.call(n, i[1], i[0], r++, this))
        return !1;
    return !0;
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The "some" function iterates over a collection and returns true if at least one element satisfies
   * a given predicate.
   * @param predicate - The `predicate` parameter is a callback function that takes three arguments:
   * `value`, `key`, and `index`. It should return a boolean value indicating whether the condition is
   * met for the current element in the iteration.
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that specifies the value
   * to be used as the `this` value when executing the `predicate` function. If `thisArg` is provided,
   * it will be passed as the first argument to the `predicate` function. If `thisArg` is
   * @returns a boolean value. It returns true if the predicate function returns true for any pair in
   * the collection, and false otherwise.
   */
  some(e, n) {
    let r = 0;
    for (const i of this)
      if (e.call(n, i[1], i[0], r++, this))
        return !0;
    return !1;
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `forEach` function iterates over each key-value pair in a collection and executes a callback
   * function for each pair.
   * @param callbackfn - The callback function that will be called for each element in the collection.
   * It takes four parameters: the value of the current element, the key of the current element, the
   * index of the current element, and the collection itself.
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that allows you to
   * specify the value of `this` within the callback function. If `thisArg` is provided, it will be
   * used as the `this` value when calling the callback function. If `thisArg` is not provided, `
   */
  forEach(e, n) {
    let r = 0;
    for (const i of this) {
      const [s, o] = i;
      e.call(n, o, s, r++, this);
    }
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `find` function iterates over the entries of a collection and returns the first value for
   * which the callback function returns true.
   * @param callbackfn - The callback function that will be called for each entry in the collection. It
   * takes three arguments: the value of the entry, the key of the entry, and the index of the entry in
   * the collection. It should return a boolean value indicating whether the current entry matches the
   * desired condition.
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that specifies the value
   * to be used as `this` when executing the `callbackfn` function. If `thisArg` is provided, it will
   * be passed as the `this` value to the `callbackfn` function. If `thisArg
   * @returns The method `find` returns the value of the first element in the iterable that satisfies
   * the provided callback function. If no element satisfies the callback function, `undefined` is
   * returned.
   */
  find(e, n) {
    let r = 0;
    for (const i of this) {
      const [s, o] = i;
      if (e.call(n, o, s, r++, this))
        return i;
    }
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The function checks if a given key exists in a collection.
   * @param {K} key - The parameter "key" is of type K, which means it can be any type. It represents
   * the key that we want to check for existence in the data structure.
   * @returns a boolean value. It returns true if the key is found in the collection, and false
   * otherwise.
   */
  has(e) {
    for (const n of this) {
      const [r] = n;
      if (r === e)
        return !0;
    }
    return !1;
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The function checks if a given value exists in a collection.
   * @param {V} value - The parameter "value" is the value that we want to check if it exists in the
   * collection.
   * @returns a boolean value, either true or false.
   */
  hasValue(e) {
    for (const [, n] of this)
      if (n === e)
        return !0;
    return !1;
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `get` function retrieves the value associated with a given key from a collection.
   * @param {K} key - K (the type of the key) - This parameter represents the key that is being
   * searched for in the collection.
   * @returns The `get` method returns the value associated with the specified key if it exists in the
   * collection, otherwise it returns `undefined`.
   */
  get(e) {
    for (const n of this) {
      const [r, i] = n;
      if (r === e)
        return i;
    }
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `reduce` function iterates over key-value pairs and applies a callback function to each pair,
   * accumulating a single value.
   * @param callbackfn - The callback function that will be called for each element in the collection.
   * It takes four arguments: the current accumulator value, the current value of the element, the key
   * of the element, and the index of the element in the collection. It should return the updated
   * accumulator value.
   * @param {U} initialValue - The `initialValue` parameter is the initial value of the accumulator. It
   * is the value that will be used as the first argument to the `callbackfn` function when reducing
   * the elements of the collection.
   * @returns The `reduce` method is returning the final value of the accumulator after iterating over
   * all the elements in the collection.
   */
  reduce(e, n) {
    let r = n, i = 0;
    for (const s of this) {
      const [o, a] = s;
      r = e(r, a, o, i++, this);
    }
    return r;
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The print function logs the elements of an array to the console.
   */
  print() {
    console.log([...this]);
  }
}
Qi.IterableEntryBase = f0;
var Ji = {};
Object.defineProperty(Ji, "__esModule", { value: !0 });
Ji.IterableElementBase = void 0;
class h0 {
  /**
   * The protected constructor initializes the options for the IterableElementBase class, including the
   * toElementFn function.
   * @param [options] - An optional object that contains the following properties:
   */
  constructor(e) {
    if (e) {
      const { toElementFn: n } = e;
      if (typeof n == "function")
        this._toElementFn = n;
      else if (n)
        throw new TypeError("toElementFn must be a function type");
    }
  }
  /**
   * The function returns the _toElementFn property, which is a function that converts a raw element to
   * a specific type.
   * @returns The function `get toElementFn()` is returning either a function that takes a raw element
   * `rawElement` of type `R` and returns an element `E`, or `undefined` if no function is assigned to
   * `_toElementFn`.
   */
  get toElementFn() {
    return this._toElementFn;
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The function is an implementation of the Symbol.iterator method that returns an IterableIterator.
   * @param {any[]} args - The `args` parameter in the code snippet represents a rest parameter. It
   * allows the function to accept any number of arguments as an array. In this case, the `args`
   * parameter is used to pass any number of arguments to the `_getIterator` method.
   */
  *[Symbol.iterator](...e) {
    yield* this._getIterator(...e);
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The function returns an iterator that yields all the values in the object.
   */
  *values() {
    for (const e of this)
      yield e;
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `every` function checks if every element in the array satisfies a given predicate.
   * @param predicate - The `predicate` parameter is a callback function that takes three arguments:
   * the current element being processed, its index, and the array it belongs to. It should return a
   * boolean value indicating whether the element satisfies a certain condition or not.
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that specifies the value
   * to be used as `this` when executing the `predicate` function. If `thisArg` is provided, it will be
   * passed as the `this` value to the `predicate` function. If `thisArg` is
   * @returns The `every` method is returning a boolean value. It returns `true` if every element in
   * the array satisfies the provided predicate function, and `false` otherwise.
   */
  every(e, n) {
    let r = 0;
    for (const i of this)
      if (!e.call(n, i, r++, this))
        return !1;
    return !0;
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The "some" function checks if at least one element in a collection satisfies a given predicate.
   * @param predicate - The `predicate` parameter is a callback function that takes three arguments:
   * `value`, `index`, and `array`. It should return a boolean value indicating whether the current
   * element satisfies the condition.
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that specifies the value
   * to be used as the `this` value when executing the `predicate` function. If `thisArg` is provided,
   * it will be passed as the `this` value to the `predicate` function. If `thisArg
   * @returns a boolean value. It returns true if the predicate function returns true for any element
   * in the collection, and false otherwise.
   */
  some(e, n) {
    let r = 0;
    for (const i of this)
      if (e.call(n, i, r++, this))
        return !0;
    return !1;
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `forEach` function iterates over each element in an array-like object and calls a callback
   * function for each element.
   * @param callbackfn - The callbackfn parameter is a function that will be called for each element in
   * the array. It takes three arguments: the current element being processed, the index of the current
   * element, and the array that forEach was called upon.
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that specifies the value
   * to be used as `this` when executing the `callbackfn` function. If `thisArg` is provided, it will
   * be passed as the `this` value to the `callbackfn` function. If `thisArg
   */
  forEach(e, n) {
    let r = 0;
    for (const i of this)
      e.call(n, i, r++, this);
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `find` function iterates over the elements of an array-like object and returns the first
   * element that satisfies the provided callback function.
   * @param callbackfn - The callbackfn parameter is a function that will be called for each element in
   * the array. It takes three arguments: the current element being processed, the index of the current
   * element, and the array itself. The function should return a boolean value indicating whether the
   * current element matches the desired condition.
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that specifies the value
   * to be used as `this` when executing the `callbackfn` function. If `thisArg` is provided, it will
   * be passed as the `this` value to the `callbackfn` function. If `thisArg
   * @returns The `find` method returns the first element in the array that satisfies the provided
   * callback function. If no element satisfies the callback function, `undefined` is returned.
   */
  find(e, n) {
    let r = 0;
    for (const i of this)
      if (e.call(n, i, r++, this))
        return i;
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The function checks if a given element exists in a collection.
   * @param {E} element - The parameter "element" is of type E, which means it can be any type. It
   * represents the element that we want to check for existence in the collection.
   * @returns a boolean value. It returns true if the element is found in the collection, and false
   * otherwise.
   */
  has(e) {
    for (const n of this)
      if (n === e)
        return !0;
    return !1;
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `reduce` function iterates over the elements of an array-like object and applies a callback
   * function to reduce them into a single value.
   * @param callbackfn - The callbackfn parameter is a function that will be called for each element in
   * the array. It takes four arguments:
   * @param {U} initialValue - The initialValue parameter is the initial value of the accumulator. It
   * is the value that the accumulator starts with before the reduction operation begins.
   * @returns The `reduce` method is returning the final value of the accumulator after iterating over
   * all the elements in the array and applying the callback function to each element.
   */
  reduce(e, n) {
    let r = n, i = 0;
    for (const s of this)
      r = e(r, s, i++, this);
    return r;
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The print function logs the elements of an array to the console.
   */
  print() {
    console.log([...this]);
  }
}
Ji.IterableElementBase = h0;
(function(t) {
  var e = Te && Te.__createBinding || (Object.create ? function(r, i, s, o) {
    o === void 0 && (o = s);
    var a = Object.getOwnPropertyDescriptor(i, s);
    (!a || ("get" in a ? !i.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return i[s];
    } }), Object.defineProperty(r, o, a);
  } : function(r, i, s, o) {
    o === void 0 && (o = s), r[o] = i[s];
  }), n = Te && Te.__exportStar || function(r, i) {
    for (var s in r)
      s !== "default" && !Object.prototype.hasOwnProperty.call(i, s) && e(i, r, s);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(Qi, t), n(Ji, t);
})(Tn);
var cc = {}, Zi = {}, Vt = {};
/**
 * data-structure-typed
 * @author Kirk Qi
 * @copyright Copyright (c) 2022 Kirk Qi <qilinaus@gmail.com>
 * @license MIT License
 */
Object.defineProperty(Vt, "__esModule", { value: !0 });
Vt.FibonacciHeap = Vt.FibonacciHeapNode = Vt.Heap = void 0;
const g0 = Tn;
class Sn extends g0.IterableElementBase {
  /**
   * The constructor initializes a heap data structure with optional elements and options.
   * @param elements - The `elements` parameter is an iterable object that contains the initial
   * elements to be added to the heap.
   * It is an optional parameter, and if not provided, the heap will
   * be initialized as empty.
   * @param [options] - The `options` parameter is an optional object that can contain additional
   * configuration options for the heap.
   * In this case, it is used to specify a custom comparator
   * function for comparing elements in the heap.
   * The comparator function is used to determine the
   * order of elements in the heap.
   */
  constructor(e = [], n) {
    if (super(n), this._elements = [], this._DEFAULT_COMPARATOR = (r, i) => {
      if (typeof r == "object" || typeof i == "object")
        throw TypeError("When comparing object types, a custom comparator must be defined in the constructor's options parameter.");
      return r > i ? 1 : r < i ? -1 : 0;
    }, this._comparator = this._DEFAULT_COMPARATOR, n) {
      const { comparator: r } = n;
      r && (this._comparator = r);
    }
    if (e)
      for (const r of e)
        this.toElementFn ? this.add(this.toElementFn(r)) : this.add(r);
  }
  /**
   * The function returns an array of elements.
   * @returns The element array is being returned.
   */
  get elements() {
    return this._elements;
  }
  /**
   * Get the size (number of elements) of the heap.
   */
  get size() {
    return this.elements.length;
  }
  /**
   * Get the last element in the heap, which is not necessarily a leaf node.
   * @returns The last element or undefined if the heap is empty.
   */
  get leaf() {
    var e;
    return (e = this.elements[this.size - 1]) !== null && e !== void 0 ? e : void 0;
  }
  /**
   * Static method that creates a binary heap from an array of elements and a comparison function.
   * @returns A new Heap instance.
   * @param elements
   * @param options
   */
  static heapify(e, n) {
    return new Sn(e, n);
  }
  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * Insert an element into the heap and maintain the heap properties.
   * @param element - The element to be inserted.
   */
  add(e) {
    return this._elements.push(e), this._bubbleUp(this.elements.length - 1);
  }
  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * Remove and return the top element (the smallest or largest element) from the heap.
   * @returns The top element or undefined if the heap is empty.
   */
  poll() {
    if (this.elements.length === 0)
      return;
    const e = this.elements[0], n = this.elements.pop();
    return this.elements.length && (this.elements[0] = n, this._sinkDown(0, this.elements.length >> 1)), e;
  }
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * Peek at the top element of the heap without removing it.
   * @returns The top element or undefined if the heap is empty.
   */
  peek() {
    return this.elements[0];
  }
  /**
   * Check if the heap is empty.
   * @returns True if the heap is empty, otherwise false.
   */
  isEmpty() {
    return this.size === 0;
  }
  /**
   * Reset the elements of the heap. Make the elements empty.
   */
  clear() {
    this._elements = [];
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * Clear and add elements of the heap
   * @param elements
   */
  refill(e) {
    return this._elements = e, this.fix();
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * Use a comparison function to check whether a binary heap contains a specific element.
   * @param element - the element to check.
   * @returns Returns true if the specified element is contained; otherwise, returns false.
   */
  has(e) {
    return this.elements.includes(e);
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `delete` function removes an element from an array-like data structure, maintaining the order
   * and structure of the remaining elements.
   * @param {E} element - The `element` parameter represents the element that you want to delete from
   * the array `this.elements`.
   * @returns The `delete` function is returning a boolean value. It returns `true` if the element was
   * successfully deleted from the array, and `false` if the element was not found in the array.
   */
  delete(e) {
    const n = this.elements.indexOf(e);
    return n < 0 ? !1 : (n === 0 ? this.poll() : n === this.elements.length - 1 ? this.elements.pop() : (this.elements.splice(n, 1, this.elements.pop()), this._bubbleUp(n), this._sinkDown(n, this.elements.length >> 1)), !0);
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(log n)
   *
   * Depth-first search (DFS) method, different traversal orders can be selected。
   * @param order - Traverse order parameter: 'IN' (in-order), 'PRE' (pre-order) or 'POST' (post-order).
   * @returns An array containing elements traversed in the specified order.
   */
  dfs(e = "PRE") {
    const n = [], r = (i) => {
      const s = 2 * i + 1, o = s + 1;
      i < this.size && (e === "IN" ? (r(s), n.push(this.elements[i]), r(o)) : e === "PRE" ? (n.push(this.elements[i]), r(s), r(o)) : e === "POST" && (r(s), r(o), n.push(this.elements[i])));
    };
    return r(0), n;
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * Convert the heap to an array.
   * @returns An array containing the elements of the heap.
   */
  toArray() {
    return [...this.elements];
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * Clone the heap, creating a new heap with the same elements.
   * @returns A new Heap instance containing the same elements.
   */
  clone() {
    return new Sn(this, { comparator: this.comparator, toElementFn: this.toElementFn });
  }
  /**
   * Time Complexity: O(n log n)
   * Space Complexity: O(n)
   *
   * Sort the elements in the heap and return them as an array.
   * @returns An array containing the elements sorted in ascending order.
   */
  sort() {
    const e = [], n = new Sn(this, { comparator: this.comparator });
    for (; n.size !== 0; ) {
      const r = n.poll();
      r !== void 0 && e.push(r);
    }
    return e;
  }
  /**
   * Time Complexity: O(n log n)
   * Space Complexity: O(n)
   *
   * Fix the entire heap to maintain heap properties.
   */
  fix() {
    const e = [];
    for (let n = Math.floor(this.size / 2); n >= 0; n--)
      e.push(this._sinkDown(n, this.elements.length >> 1));
    return e;
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `filter` function creates a new Heap object containing elements that pass a given callback
   * function.
   * @param callback - The `callback` parameter is a function that will be called for each element in
   * the heap. It takes three arguments: the current element, the index of the current element, and the
   * heap itself. The callback function should return a boolean value indicating whether the current
   * element should be included in the filtered list
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that specifies the value
   * to be used as `this` when executing the `callback` function. If `thisArg` is provided, it will be
   * passed as the `this` value to the `callback` function. If `thisArg` is
   * @returns The `filter` method is returning a new `Heap` object that contains the elements that pass
   * the filter condition specified by the `callback` function.
   */
  filter(e, n) {
    const r = new Sn([], { toElementFn: this.toElementFn, comparator: this.comparator });
    let i = 0;
    for (const s of this)
      e.call(n, s, i, this) && r.add(s), i++;
    return r;
  }
  /**
   * Time Complexity: O(n log n)
   * Space Complexity: O(n)
   *
   * The `map` function creates a new heap by applying a callback function to each element of the
   * original heap.
   * @param callback - The `callback` parameter is a function that will be called for each element in
   * the heap. It takes three arguments: `el` (the current element), `index` (the index of the current
   * element), and `this` (the heap itself). The callback function should return a value of
   * @param comparator - The `comparator` parameter is a function that defines the order of the
   * elements in the heap. It takes two elements `a` and `b` as arguments and returns a negative number
   * if `a` should be placed before `b`, a positive number if `a` should be placed after
   * @param [toElementFn] - The `toElementFn` parameter is an optional function that converts the raw
   * element `RR` to the desired type `T`. It takes a single argument `rawElement` of type `RR` and
   * returns a value of type `T`. This function is used to transform the elements of the original
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that allows you to
   * specify the value of `this` within the callback function. It is used to set the context or scope
   * in which the callback function will be executed. If `thisArg` is provided, it will be used as the
   * value of
   * @returns a new instance of the `Heap` class with the mapped elements.
   */
  map(e, n, r, i) {
    const s = new Sn([], { comparator: n, toElementFn: r });
    let o = 0;
    for (const a of this)
      s.add(e.call(i, a, o, this)), o++;
    return s;
  }
  /**
   * The function returns the value of the _comparator property.
   * @returns The `_comparator` property is being returned.
   */
  get comparator() {
    return this._comparator;
  }
  /**
   * The function `_getIterator` returns an iterable iterator for the elements in the class.
   */
  *_getIterator() {
    for (const e of this.elements)
      yield e;
  }
  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * Float operation to maintain heap properties after adding an element.
   * @param index - The index of the newly added element.
   */
  _bubbleUp(e) {
    const n = this.elements[e];
    for (; e > 0; ) {
      const r = e - 1 >> 1, i = this.elements[r];
      if (this.comparator(i, n) <= 0)
        break;
      this.elements[e] = i, e = r;
    }
    return this.elements[e] = n, !0;
  }
  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * Sinking operation to maintain heap properties after removing the top element.
   * @param index - The index from which to start sinking.
   * @param halfLength
   */
  _sinkDown(e, n) {
    const r = this.elements[e];
    for (; e < n; ) {
      let i = e << 1 | 1;
      const s = i + 1;
      let o = this.elements[i];
      if (s < this.elements.length && this.comparator(o, this.elements[s]) > 0 && (i = s, o = this.elements[s]), this.comparator(o, r) >= 0)
        break;
      this.elements[e] = o, e = i;
    }
    return this.elements[e] = r, !0;
  }
}
Vt.Heap = Sn;
class uc {
  /**
   * The constructor function initializes an object with an element and a degree, and sets the marked
   * property to false.
   * @param {E} element - The "element" parameter represents the value or data that will be stored in
   * the node of a data structure. It can be any type of data, such as a number, string, object, or
   * even another data structure.
   * @param [degree=0] - The degree parameter represents the degree of the element in a data structure
   * called a Fibonacci heap. The degree of a node is the number of children it has. By default, the
   * degree is set to 0 when a new node is created.
   */
  constructor(e, n = 0) {
    this.element = e, this.degree = n, this.marked = !1;
  }
}
Vt.FibonacciHeapNode = uc;
class m0 {
  /**
   * The constructor function initializes a FibonacciHeap object with an optional comparator function.
   * @param [comparator] - The `comparator` parameter is an optional argument that represents a
   * function used to compare elements in the FibonacciHeap. If a comparator function is provided, it
   * will be used to determine the order of elements in the heap. If no comparator function is
   * provided, a default comparator function will be used.
   */
  constructor(e) {
    if (this._size = 0, this.clear(), this._comparator = e || this._defaultComparator, typeof this.comparator != "function")
      throw new Error("FibonacciHeap constructor: given comparator should be a function.");
  }
  /**
   * The function returns the root node of a Fibonacci heap.
   * @returns The method is returning either a FibonacciHeapNode object or undefined.
   */
  get root() {
    return this._root;
  }
  /**
   * The function returns the size of an object.
   * @returns The size of the object, which is a number.
   */
  get size() {
    return this._size;
  }
  /**
   * The function returns the minimum node in a Fibonacci heap.
   * @returns The method is returning the minimum node of the Fibonacci heap, which is of type
   * `FibonacciHeapNode<E>`. If there is no minimum node, it will return `undefined`.
   */
  get min() {
    return this._min;
  }
  /**
   * The function returns the comparator used for comparing elements.
   * @returns The `_comparator` property of the object.
   */
  get comparator() {
    return this._comparator;
  }
  /**
   * Get the size (number of elements) of the heap.
   * @returns {number} The size of the heap.  Returns 0 if the heap is empty. Returns -1 if the heap is invalid.
   */
  clear() {
    this._root = void 0, this._min = void 0, this._size = 0;
  }
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * Insert an element into the heap and maintain the heap properties.
   * @param element
   * @returns {FibonacciHeap<E>} FibonacciHeap<E> - The heap itself.
   */
  add(e) {
    return this.push(e);
  }
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * Insert an element into the heap and maintain the heap properties.
   * @param element
   * @returns {FibonacciHeap<E>} FibonacciHeap<E> - The heap itself.
   */
  push(e) {
    const n = this.createNode(e);
    return n.left = n, n.right = n, this.mergeWithRoot(n), (!this.min || this.comparator(n.element, this.min.element) <= 0) && (this._min = n), this._size++, this;
  }
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * Peek at the top element of the heap without removing it.
   * @returns The top element or undefined if the heap is empty.
   * @protected
   */
  peek() {
    return this.min ? this.min.element : void 0;
  }
  /**
   * Time Complexity: O(n), where n is the number of elements in the linked list.
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(n), where n is the number of elements in the linked list.
   * Space Complexity: O(1)
   *
   * Get the size (number of elements) of the heap.
   * @param {FibonacciHeapNode<E>} head - The head of the linked list.
   * @protected
   * @returns FibonacciHeapNode<E>[] - An array containing the elements of the linked list.
   */
  consumeLinkedList(e) {
    const n = [];
    if (!e)
      return n;
    let r = e, i = !1;
    for (; !(r === e && i); )
      r === e && (i = !0), r && (n.push(r), r = r.right);
    return n;
  }
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * @param parent
   * @param node
   */
  mergeWithChild(e, n) {
    e.child ? (n.right = e.child.right, n.left = e.child, e.child.right.left = n, e.child.right = n) : e.child = n;
  }
  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * Remove and return the top element (the smallest or largest element) from the heap.
   * @returns The top element or undefined if the heap is empty.
   */
  poll() {
    return this.pop();
  }
  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * Remove and return the top element (the smallest or largest element) from the heap.
   * @returns The top element or undefined if the heap is empty.
   */
  pop() {
    if (this.size === 0)
      return;
    const e = this.min;
    if (e.child) {
      const n = this.consumeLinkedList(e.child);
      for (const r of n)
        this.mergeWithRoot(r), r.parent = void 0;
    }
    return this.removeFromRoot(e), e === e.right ? (this._min = void 0, this._root = void 0) : (this._min = e.right, this._consolidate()), this._size--, e.element;
  }
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * merge two heaps. The heap that is merged will be cleared. The heap that is merged into will remain.
   * @param heapToMerge
   */
  merge(e) {
    if (e.size !== 0) {
      if (this.root && e.root) {
        const n = this.root, r = e.root, i = n.right, s = r.left;
        n.right = r, r.left = n, i.left = s, s.right = i;
      }
      (!this.min || e.min && this.comparator(e.min.element, this.min.element) < 0) && (this._min = e.min), this._size += e.size, e.clear();
    }
  }
  /**
   * Create a new node.
   * @param element
   * @protected
   */
  createNode(e) {
    return new uc(e);
  }
  /**
   * Default comparator function used by the heap.
   * @param {E} a
   * @param {E} b
   * @protected
   */
  _defaultComparator(e, n) {
    return e < n ? -1 : e > n ? 1 : 0;
  }
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * Merge the given node with the root list.
   * @param node - The node to be merged.
   */
  mergeWithRoot(e) {
    this.root ? (e.right = this.root.right, e.left = this.root, this.root.right.left = e, this.root.right = e) : this._root = e;
  }
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * Remove and return the top element (the smallest or largest element) from the heap.
   * @param node - The node to be removed.
   * @protected
   */
  removeFromRoot(e) {
    this.root === e && (this._root = e.right), e.left && (e.left.right = e.right), e.right && (e.right.left = e.left);
  }
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * Remove and return the top element (the smallest or largest element) from the heap.
   * @param y
   * @param x
   * @protected
   */
  _link(e, n) {
    this.removeFromRoot(e), e.left = e, e.right = e, this.mergeWithChild(n, e), n.degree++, e.parent = n;
  }
  /**
   * Time Complexity: O(n log n)
   * Space Complexity: O(n)
   */
  /**
   * Time Complexity: O(n log n)
   * Space Complexity: O(n)
   *
   * Remove and return the top element (the smallest or largest element) from the heap.
   * @protected
   */
  _consolidate() {
    const e = new Array(this.size), n = this.consumeLinkedList(this.root);
    let r, i, s, o;
    for (const a of n) {
      for (r = a, s = r.degree; e[s]; )
        i = e[s], this.comparator(r.element, i.element) > 0 && (o = r, r = i, i = o), this._link(i, r), e[s] = void 0, s++;
      e[s] = r;
    }
    for (let a = 0; a < this.size; a++)
      e[a] && this.comparator(e[a].element, this.min.element) <= 0 && (this._min = e[a]);
  }
}
Vt.FibonacciHeap = m0;
Object.defineProperty(Zi, "__esModule", { value: !0 });
Zi.MaxHeap = void 0;
const w0 = Vt;
class Fr extends w0.Heap {
  constructor(e = [], n) {
    super(e, Object.assign({ comparator: (r, i) => {
      if (typeof r == "object" || typeof i == "object")
        throw TypeError("When comparing object types, a custom comparator must be defined in the constructor's options parameter.");
      return r < i ? 1 : r > i ? -1 : 0;
    } }, n));
  }
  /**
   * The `clone` function returns a new instance of the `MaxHeap` class with the same properties as the
   * current instance.
   * @returns The `clone()` method is returning a new instance of the `MaxHeap` class with the same
   * properties as the current instance.
   */
  clone() {
    return new Fr(this, { comparator: this.comparator, toElementFn: this.toElementFn });
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `filter` function creates a new MaxHeap object containing elements that pass a given callback
   * function.
   * @param callback - The `callback` parameter is a function that will be called for each element in
   * the heap. It takes three arguments: the current element, the index of the current element, and the
   * heap itself. The callback function should return a boolean value indicating whether the current
   * element should be included in the filtered list
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that specifies the value
   * to be used as `this` when executing the `callback` function. If `thisArg` is provided, it will be
   * passed as the `this` value to the `callback` function. If `thisArg` is
   * @returns The `filter` method is returning a new `MaxHeap` object that contains the elements that pass
   * the filter condition specified by the `callback` function.
   */
  filter(e, n) {
    const r = new Fr([], { toElementFn: this.toElementFn, comparator: this.comparator });
    let i = 0;
    for (const s of this)
      e.call(n, s, i, this) && r.add(s), i++;
    return r;
  }
  /**
   * Time Complexity: O(n log n)
   * Space Complexity: O(n)
   *
   * The `map` function creates a new heap by applying a callback function to each element of the
   * original heap.
   * @param callback - The `callback` parameter is a function that will be called for each element in
   * the heap. It takes three arguments: `el` (the current element), `index` (the index of the current
   * element), and `this` (the heap itself). The callback function should return a value of
   * @param comparator - The `comparator` parameter is a function that defines the order of the
   * elements in the heap. It takes two elements `a` and `b` as arguments and returns a negative number
   * if `a` should be placed before `b`, a positive number if `a` should be placed after
   * @param [toElementFn] - The `toElementFn` parameter is an optional function that converts the raw
   * element `RR` to the desired type `T`. It takes a single argument `rawElement` of type `RR` and
   * returns a value of type `T`. This function is used to transform the elements of the original
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that allows you to
   * specify the value of `this` within the callback function. It is used to set the context or scope
   * in which the callback function will be executed. If `thisArg` is provided, it will be used as the
   * value of
   * @returns a new instance of the `MaxHeap` class with the mapped elements.
   */
  map(e, n, r, i) {
    const s = new Fr([], { comparator: n, toElementFn: r });
    let o = 0;
    for (const a of this)
      s.add(e.call(i, a, o, this)), o++;
    return s;
  }
}
Zi.MaxHeap = Fr;
var es = {};
Object.defineProperty(es, "__esModule", { value: !0 });
es.MinHeap = void 0;
const p0 = Vt;
class zr extends p0.Heap {
  constructor(e = [], n) {
    super(e, n);
  }
  /**
   * The `clone` function returns a new instance of the `MinHeap` class with the same comparator and
   * toElementFn as the original instance.
   * @returns The `clone()` method is returning a new instance of the `MinHeap` class with the same
   * properties as the current instance.
   */
  clone() {
    return new zr(this, { comparator: this.comparator, toElementFn: this.toElementFn });
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `filter` function creates a new MinHeap object containing elements that pass a given callback
   * function.
   * @param callback - The `callback` parameter is a function that will be called for each element in
   * the heap. It takes three arguments: the current element, the index of the current element, and the
   * heap itself. The callback function should return a boolean value indicating whether the current
   * element should be included in the filtered list
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that specifies the value
   * to be used as `this` when executing the `callback` function. If `thisArg` is provided, it will be
   * passed as the `this` value to the `callback` function. If `thisArg` is
   * @returns The `filter` method is returning a new `MinHeap` object that contains the elements that pass
   * the filter condition specified by the `callback` function.
   */
  filter(e, n) {
    const r = new zr([], { toElementFn: this.toElementFn, comparator: this.comparator });
    let i = 0;
    for (const s of this)
      e.call(n, s, i, this) && r.add(s), i++;
    return r;
  }
  /**
   * Time Complexity: O(n log n)
   * Space Complexity: O(n)
   *
   * The `map` function creates a new heap by applying a callback function to each element of the
   * original heap.
   * @param callback - The `callback` parameter is a function that will be called for each element in
   * the heap. It takes three arguments: `el` (the current element), `index` (the index of the current
   * element), and `this` (the heap itself). The callback function should return a value of
   * @param comparator - The `comparator` parameter is a function that defines the order of the
   * elements in the heap. It takes two elements `a` and `b` as arguments and returns a negative number
   * if `a` should be placed before `b`, a positive number if `a` should be placed after
   * @param [toElementFn] - The `toElementFn` parameter is an optional function that converts the raw
   * element `RR` to the desired type `T`. It takes a single argument `rawElement` of type `RR` and
   * returns a value of type `T`. This function is used to transform the elements of the original
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that allows you to
   * specify the value of `this` within the callback function. It is used to set the context or scope
   * in which the callback function will be executed. If `thisArg` is provided, it will be used as the
   * value of
   * @returns a new instance of the `MinHeap` class with the mapped elements.
   */
  map(e, n, r, i) {
    const s = new zr([], { comparator: n, toElementFn: r });
    let o = 0;
    for (const a of this)
      s.add(e.call(i, a, o, this)), o++;
    return s;
  }
}
es.MinHeap = zr;
(function(t) {
  var e = Te && Te.__createBinding || (Object.create ? function(r, i, s, o) {
    o === void 0 && (o = s);
    var a = Object.getOwnPropertyDescriptor(i, s);
    (!a || ("get" in a ? !i.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return i[s];
    } }), Object.defineProperty(r, o, a);
  } : function(r, i, s, o) {
    o === void 0 && (o = s), r[o] = i[s];
  }), n = Te && Te.__exportStar || function(r, i) {
    for (var s in r)
      s !== "default" && !Object.prototype.hasOwnProperty.call(i, s) && e(i, r, s);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(Zi, t), n(es, t), n(Vt, t);
})(cc);
var dc = {}, Qn = {}, fc = {}, Jn = {};
Object.defineProperty(Jn, "__esModule", { value: !0 });
Jn.SinglyLinkedList = Jn.SinglyLinkedListNode = void 0;
const v0 = Tn;
class qt {
  /**
   * The constructor function initializes an instance of a class with a given value and sets the next property to undefined.
   * @param {E} value - The "value" parameter is of type E, which means it can be any data type. It represents the value that
   * will be stored in the node of a linked list.
   */
  constructor(e) {
    this._value = e, this._next = void 0;
  }
  /**
   * The function returns the value of a protected variable.
   * @returns The value of the variable `_value` is being returned.
   */
  get value() {
    return this._value;
  }
  /**
   * The above function sets the value of a variable.
   * @param {E} value - The parameter "value" is of type E, which means it can be any type.
   */
  set value(e) {
    this._value = e;
  }
  /**
   * The `next` function returns the next node in a singly linked list.
   * @returns The `next` property is being returned. It can be either a `SinglyLinkedListNode<E>`
   * object or `undefined`.
   */
  get next() {
    return this._next;
  }
  /**
   * The "next" property of a SinglyLinkedListNode is set to the provided value.
   * @param {SinglyLinkedListNode<E> | undefined} value - The `value` parameter is of type
   * `SinglyLinkedListNode<E> | undefined`. This means that it can accept either a
   * `SinglyLinkedListNode` object or `undefined` as its value.
   */
  set next(e) {
    this._next = e;
  }
}
Jn.SinglyLinkedListNode = qt;
class Wn extends v0.IterableElementBase {
  constructor(e = [], n) {
    if (super(n), this._size = 0, e)
      for (const r of e)
        this.toElementFn ? this.push(this.toElementFn(r)) : this.push(r);
  }
  /**
   * The `head` function returns the first node of a singly linked list.
   * @returns The method is returning either a SinglyLinkedListNode object or undefined.
   */
  get head() {
    return this._head;
  }
  /**
   * The `tail` function returns the last node of a singly linked list.
   * @returns The method is returning either a SinglyLinkedListNode object or undefined.
   */
  get tail() {
    return this._tail;
  }
  /**
   * The above function returns the value of the first element in a linked list, or undefined if the
   * list is empty.
   * @returns The value of the first node in the linked list, or undefined if the linked list is empty.
   */
  get first() {
    var e;
    return (e = this.head) === null || e === void 0 ? void 0 : e.value;
  }
  /**
   * The function returns the value of the last element in a linked list, or undefined if the list is
   * empty.
   * @returns The value of the last node in the linked list, or undefined if the linked list is empty.
   */
  get last() {
    var e;
    return (e = this.tail) === null || e === void 0 ? void 0 : e.value;
  }
  /**
   * The function returns the size of an object.
   * @returns The size of the object, which is a number.
   */
  get size() {
    return this._size;
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   * Linear time, where n is the length of the input array, as it performs a loop to push each element into the linked list.
   * Linear space, as it creates a new node for each element in the array.
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `fromArray` function creates a new SinglyLinkedList instance and populates it with the elements from the given
   * array.
   * @param {E[]} data - The `data` parameter is an array of elements of type `E`.
   * @returns The `fromArray` function returns a `SinglyLinkedList` object.
   */
  static fromArray(e) {
    const n = new Wn();
    for (const r of e)
      n.push(r);
    return n;
  }
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The push function adds a new element to the end of a singly linked list.
   * @param {E} element - The "element" parameter represents the value of the element that you want to
   * add to the linked list.
   * @returns The `push` method is returning a boolean value, `true`.
   */
  push(e) {
    const n = new qt(e);
    return this.head ? (this.tail.next = n, this._tail = n) : (this._head = n, this._tail = n), this._size++, !0;
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   * Linear time in the worst case, as it may need to traverse the list to find the last element.
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `pop` function removes and returns the value of the last element in a linked list.
   * @returns The method is returning the value of the element that is being popped from the end of the
   * list.
   */
  pop() {
    if (!this.head)
      return;
    if (this.head === this.tail) {
      const r = this.head.value;
      return this._head = void 0, this._tail = void 0, this._size--, r;
    }
    let e = this.head;
    for (; e.next !== this.tail; )
      e = e.next;
    const n = this.tail.value;
    return e.next = void 0, this._tail = e, this._size--, n;
  }
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `shift()` function removes and returns the value of the first element in a linked list.
   * @returns The value of the removed node.
   */
  shift() {
    if (!this.head)
      return;
    const e = this.head;
    return this._head = this.head.next, this._size--, e.value;
  }
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The unshift function adds a new element to the beginning of a singly linked list.
   * @param {E} element - The "element" parameter represents the value of the element that you want to
   * add to the beginning of the singly linked list.
   * @returns The `unshift` method is returning a boolean value, `true`.
   */
  unshift(e) {
    const n = new qt(e);
    return this.head ? (n.next = this.head, this._head = n) : (this._head = n, this._tail = n), this._size++, !0;
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The function `at` returns the value at a specified index in a linked list, or undefined if the index is out of range.
   * @param {number} index - The index parameter is a number that represents the position of the element we want to
   * retrieve from the list.
   * @returns The method `at(index: number): E | undefined` returns the value at the specified index in the linked list, or
   * `undefined` if the index is out of bounds.
   */
  at(e) {
    if (e < 0 || e >= this.size)
      return;
    let n = this.head;
    for (let r = 0; r < e; r++)
      n = n.next;
    return n.value;
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The function `getNodeAt` returns the node at a given index in a singly linked list.
   * @param {number} index - The `index` parameter is a number that represents the position of the node we want to
   * retrieve from the linked list. It indicates the zero-based index of the node we want to access.
   * @returns The method `getNodeAt(index: number)` returns a `SinglyLinkedListNode<E>` object if the node at the
   * specified index exists, or `undefined` if the index is out of bounds.
   */
  getNodeAt(e) {
    let n = this.head;
    for (let r = 0; r < e; r++)
      n = n.next;
    return n;
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `deleteAt` function removes an element at a specified index from a linked list and returns the removed element.
   * @param {number} index - The index parameter represents the position of the element that needs to be deleted in the
   * data structure. It is of type number.
   * @returns The method `deleteAt` returns the value of the node that was deleted, or `undefined` if the index is out of
   * bounds.
   */
  deleteAt(e) {
    if (e < 0 || e >= this.size)
      return !1;
    if (e === 0)
      return this.shift(), !0;
    if (e === this.size - 1)
      return this.pop(), !0;
    const n = this.getNodeAt(e - 1), r = n.next;
    return n.next = r.next, this._size--, !0;
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The delete function removes a node with a specific value from a singly linked list.
   * @param {E | SinglyLinkedListNode<E>} valueOrNode - The `valueOrNode` parameter can accept either a value of type `E`
   * or a `SinglyLinkedListNode<E>` object.
   * @returns The `delete` method returns a boolean value. It returns `true` if the value or node is found and
   * successfully deleted from the linked list, and `false` if the value or node is not found in the linked list.
   */
  delete(e) {
    if (!e)
      return !1;
    let n;
    e instanceof qt ? n = e.value : n = e;
    let r = this.head, i;
    for (; r; ) {
      if (r.value === n)
        return i === void 0 ? (this._head = r.next, r === this.tail && (this._tail = void 0)) : (i.next = r.next, r === this.tail && (this._tail = i)), this._size--, !0;
      i = r, r = r.next;
    }
    return !1;
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `addAt` function inserts a value at a specified index in a singly linked list.
   * @param {number} index - The index parameter represents the position at which the new value should be inserted in the
   * linked list. It is of type number.
   * @param {E} value - The `value` parameter represents the value that you want to insert into the linked list at the
   * specified index.
   * @returns The `insert` method returns a boolean value. It returns `true` if the insertion is successful, and `false`
   * if the index is out of bounds.
   */
  addAt(e, n) {
    if (e < 0 || e > this.size)
      return !1;
    if (e === 0)
      return this.unshift(n), !0;
    if (e === this.size)
      return this.push(n), !0;
    const r = new qt(n), i = this.getNodeAt(e - 1);
    return r.next = i.next, i.next = r, this._size++, !0;
  }
  /**
   * The function checks if the length of a data structure is equal to zero and returns a boolean value indicating
   * whether it is empty or not.
   * @returns A boolean value indicating whether the length of the object is equal to 0.
   */
  isEmpty() {
    return this.size === 0;
  }
  /**
   * The `clear` function resets the linked list by setting the head, tail, and length to undefined and 0 respectively.
   */
  clear() {
    this._head = void 0, this._tail = void 0, this._size = 0;
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   * Linear time, where n is the length of the list, as it needs to traverse the entire list to convert it to an array.
   * Linear space, as it creates an array with the same length as the list.
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `toArray` function converts a linked list into an array.
   * @returns The `toArray()` method is returning an array of type `E[]`.
   */
  toArray() {
    const e = [];
    let n = this.head;
    for (; n; )
      e.push(n.value), n = n.next;
    return e;
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `reverse` function reverses the order of the nodes in a singly linked list.
   * @returns The reverse() method does not return anything. It has a return type of void.
   */
  reverse() {
    if (!this.head || this.head === this.tail)
      return this;
    let e, n = this.head, r;
    for (; n; )
      r = n.next, n.next = e, e = n, n = r;
    return [this._head, this._tail] = [this.tail, this.head], this;
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `indexOf` function returns the index of the first occurrence of a given value in a linked list.
   * @param {E} value - The value parameter is the value that you want to find the index of in the linked list.
   * @returns The method is returning the index of the first occurrence of the specified value in the linked list. If the
   * value is not found, it returns -1.
   */
  indexOf(e) {
    let n = 0, r = this.head;
    for (; r; ) {
      if (r.value === e)
        return n;
      n++, r = r.next;
    }
    return -1;
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The function finds a node in a singly linked list by its value and returns the node if found, otherwise returns
   * undefined.
   * @param {E} value - The value parameter is the value that we want to search for in the linked list.
   * @returns a `SinglyLinkedListNode<E>` if a node with the specified value is found in the linked list. If no node with
   * the specified value is found, the function returns `undefined`.
   */
  getNode(e) {
    let n = this.head;
    for (; n; ) {
      if (n.value === e)
        return n;
      n = n.next;
    }
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `addBefore` function inserts a new value before an existing value in a singly linked list.
   * @param {E | SinglyLinkedListNode<E>} existingValueOrNode - The existing value or node that you want to insert the
   * new value before. It can be either the value itself or a node containing the value in the linked list.
   * @param {E} newValue - The `newValue` parameter represents the value that you want to insert into the linked list.
   * @returns The method `addBefore` returns a boolean value. It returns `true` if the new value was successfully
   * inserted before the existing value, and `false` otherwise.
   */
  addBefore(e, n) {
    if (!this.head)
      return !1;
    let r;
    if (e instanceof qt ? r = e.value : r = e, this.head.value === r)
      return this.unshift(n), !0;
    let i = this.head;
    for (; i.next; ) {
      if (i.next.value === r) {
        const s = new qt(n);
        return s.next = i.next, i.next = s, this._size++, !0;
      }
      i = i.next;
    }
    return !1;
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `addAfter` function inserts a new node with a given value after an existing node in a singly linked list.
   * @param {E | SinglyLinkedListNode<E>} existingValueOrNode - The existing value or node in the linked list after which
   * the new value will be inserted. It can be either the value of the existing node or the existing node itself.
   * @param {E} newValue - The value that you want to insert into the linked list after the existing value or node.
   * @returns The method returns a boolean value. It returns true if the new value was successfully inserted after the
   * existing value or node, and false if the existing value or node was not found in the linked list.
   */
  addAfter(e, n) {
    let r;
    if (e instanceof qt ? r = e : r = this.getNode(e), r) {
      const i = new qt(n);
      return i.next = r.next, r.next = i, r === this.tail && (this._tail = i), this._size++, !0;
    }
    return !1;
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The function counts the number of occurrences of a given value in a linked list.
   * @param {E} value - The value parameter is the value that you want to count the occurrences of in the linked list.
   * @returns The count of occurrences of the given value in the linked list.
   */
  countOccurrences(e) {
    let n = 0, r = this.head;
    for (; r; )
      r.value === e && n++, r = r.next;
    return n;
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `clone` function returns a new instance of the `SinglyLinkedList` class with the same values
   * as the original list.
   * @returns The `clone()` method is returning a new instance of the `SinglyLinkedList` class, which
   * is a clone of the original list.
   */
  clone() {
    return new Wn(this, { toElementFn: this.toElementFn });
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `filter` function creates a new SinglyLinkedList by iterating over the elements of the current
   * list and applying a callback function to each element to determine if it should be included in the
   * filtered list.
   * @param callback - The callback parameter is a function that will be called for each element in the
   * list. It takes three arguments: the current element, the index of the current element, and the
   * list itself. The callback function should return a boolean value indicating whether the current
   * element should be included in the filtered list or not
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that specifies the value
   * to be used as `this` when executing the `callback` function. If `thisArg` is provided, it will be
   * passed as the `this` value to the `callback` function. If `thisArg` is
   * @returns The `filter` method is returning a new `SinglyLinkedList` object that contains the
   * elements that pass the filter condition specified by the `callback` function.
   */
  filter(e, n) {
    const r = new Wn([], { toElementFn: this.toElementFn });
    let i = 0;
    for (const s of this)
      e.call(n, s, i, this) && r.push(s), i++;
    return r;
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */
  /**
   * The `map` function takes a callback function and returns a new SinglyLinkedList with the results
   * of applying the callback to each element in the original list.
   * @param callback - The `callback` parameter is a function that will be called for each element in
   * the original list. It takes three arguments: `current` (the current element being processed),
   * `index` (the index of the current element), and `this` (the original list). It should return a
   * value
   * @param [toElementFn] - The `toElementFn` parameter is an optional function that can be used to
   * convert the raw element (`RR`) to the desired element type (`T`). It takes the raw element as
   * input and returns the converted element. If this parameter is not provided, the raw element will
   * be used as is.
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that allows you to
   * specify the value of `this` within the callback function. It is used to set the context or scope
   * in which the callback function will be executed. If `thisArg` is provided, it will be used as the
   * value of
   * @returns a new instance of the `SinglyLinkedList` class with the mapped elements.
   */
  map(e, n, r) {
    const i = new Wn([], { toElementFn: n });
    let s = 0;
    for (const o of this)
      i.push(e.call(r, o, s, this)), s++;
    return i;
  }
  /**
   * The function `_getIterator` returns an iterable iterator that yields the values of a linked list.
   */
  *_getIterator() {
    let e = this.head;
    for (; e; )
      yield e.value, e = e.next;
  }
}
Jn.SinglyLinkedList = Wn;
var Zn = {};
Object.defineProperty(Zn, "__esModule", { value: !0 });
Zn.DoublyLinkedList = Zn.DoublyLinkedListNode = void 0;
const b0 = Tn;
class Gt {
  /**
   * The constructor function initializes the value, next, and previous properties of an object.
   * @param {E} value - The "value" parameter is the value that will be stored in the node. It can be of any data type, as it
   * is defined as a generic type "E".
   */
  constructor(e) {
    this._value = e, this._next = void 0, this._prev = void 0;
  }
  /**
   * The function returns the value of a protected variable.
   * @returns The value of the variable `_value` is being returned.
   */
  get value() {
    return this._value;
  }
  /**
   * The above function sets the value of a variable.
   * @param {E} value - The parameter "value" is of type E, which means it can be any type.
   */
  set value(e) {
    this._value = e;
  }
  /**
   * The "next" function returns the next node in a doubly linked list.
   * @returns The `next` property is being returned. It can be either a `DoublyLinkedListNode<E>`
   * object or `undefined`.
   */
  get next() {
    return this._next;
  }
  /**
   * The "next" property of a DoublyLinkedListNode is set to the provided value.
   * @param {DoublyLinkedListNode<E> | undefined} value - The `value` parameter is of type
   * `DoublyLinkedListNode<E> | undefined`. This means that it can accept either a
   * `DoublyLinkedListNode` object or `undefined` as its value.
   */
  set next(e) {
    this._next = e;
  }
  /**
   * The `prev` function returns the previous node in a doubly linked list.
   * @returns The `prev` property of the `DoublyLinkedListNode` class is being returned. It can either
   * be a `DoublyLinkedListNode` object or `undefined`.
   */
  get prev() {
    return this._prev;
  }
  /**
   * The function sets the previous node of a doubly linked list node.
   * @param {DoublyLinkedListNode<E> | undefined} value - The `value` parameter is of type
   * `DoublyLinkedListNode<E> | undefined`. This means that it can accept either a
   * `DoublyLinkedListNode` object or `undefined` as its value.
   */
  set prev(e) {
    this._prev = e;
  }
}
Zn.DoublyLinkedListNode = Gt;
class Hn extends b0.IterableElementBase {
  constructor(e = [], n) {
    if (super(n), this._head = void 0, this._tail = void 0, this._size = 0, e)
      for (const r of e)
        this.toElementFn ? this.push(this.toElementFn(r)) : this.push(r);
  }
  /**
   * The `head` function returns the first node of a doubly linked list.
   * @returns The method `getHead()` returns either a `DoublyLinkedListNode<E>` object or `undefined`.
   */
  get head() {
    return this._head;
  }
  /**
   * The `tail` function returns the last node of a doubly linked list.
   * @returns The `get tail()` method is returning either a `DoublyLinkedListNode<E>` object or
   * `undefined`.
   */
  get tail() {
    return this._tail;
  }
  /**
   * The function returns the size of an object.
   * @returns The size of the object, which is a number.
   */
  get size() {
    return this._size;
  }
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   * where n is the number of elements in the linked list.
   */
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `get first` function returns the first node in a doubly linked list, or undefined if the list is empty.
   * @returns The method `get first()` returns the first node of the doubly linked list, or `undefined` if the list is empty.
   */
  get first() {
    var e;
    return (e = this.head) === null || e === void 0 ? void 0 : e.value;
  }
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `get last` function returns the last node in a doubly linked list, or undefined if the list is empty.
   * @returns The method `get last()` returns the last node of the doubly linked list, or `undefined` if the list is empty.
   */
  get last() {
    var e;
    return (e = this.tail) === null || e === void 0 ? void 0 : e.value;
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `fromArray` function creates a new instance of a DoublyLinkedList and populates it with the elements from the
   * given array.
   * @param {E[]} data - The `data` parameter is an array of elements of type `E`.
   * @returns The `fromArray` function returns a DoublyLinkedList object.
   */
  static fromArray(e) {
    return new Hn(e);
  }
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  /**
   * The push function adds a new element to the end of a doubly linked list.
   * @param {E} element - The "element" parameter represents the value that you want to add to the
   * doubly linked list.
   * @returns The `push` method is returning a boolean value, `true`.
   */
  push(e) {
    const n = new Gt(e);
    return this.head ? (n.prev = this.tail, this.tail.next = n, this._tail = n) : (this._head = n, this._tail = n), this._size++, !0;
  }
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  /**
   * The `pop()` function removes and returns the value of the last element in a linked list.
   * @returns The method is returning the value of the removed node.
   */
  pop() {
    if (!this.tail)
      return;
    const e = this.tail;
    return this.head === this.tail ? (this._head = void 0, this._tail = void 0) : (this._tail = e.prev, this.tail.next = void 0), this._size--, e.value;
  }
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  /**
   * The `shift()` function removes and returns the value of the first element in a doubly linked list.
   * @returns The value of the removed node.
   */
  shift() {
    if (!this.head)
      return;
    const e = this.head;
    return this.head === this.tail ? (this._head = void 0, this._tail = void 0) : (this._head = e.next, this.head.prev = void 0), this._size--, e.value;
  }
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  /**
   * The unshift function adds a new element to the beginning of a doubly linked list.
   * @param {E} element - The "element" parameter represents the value of the element that you want to
   * add to the beginning of the doubly linked list.
   * @returns The `unshift` method is returning a boolean value, `true`.
   */
  unshift(e) {
    const n = new Gt(e);
    return this.head ? (n.next = this.head, this.head.prev = n, this._head = n) : (this._head = n, this._tail = n), this._size++, !0;
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `at` function returns the value at a specified index in a linked list, or undefined if the index is out of bounds.
   * @param {number} index - The index parameter is a number that represents the position of the element we want to
   * retrieve from the list.
   * @returns The method is returning the value at the specified index in the linked list. If the index is out of bounds
   * or the linked list is empty, it will return undefined.
   */
  at(e) {
    if (e < 0 || e >= this.size)
      return;
    let n = this.head;
    for (let r = 0; r < e; r++)
      n = n.next;
    return n.value;
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The function `getNodeAt` returns the node at a given index in a doubly linked list, or undefined if the index is out of
   * range.
   * @param {number} index - The `index` parameter is a number that represents the position of the node we want to
   * retrieve from the doubly linked list. It indicates the zero-based index of the node we want to access.
   * @returns The method `getNodeAt(index: number)` returns a `DoublyLinkedListNode<E>` object if the index is within the
   * valid range of the linked list, otherwise it returns `undefined`.
   */
  getNodeAt(e) {
    if (e < 0 || e >= this.size)
      return;
    let n = this.head;
    for (let r = 0; r < e; r++)
      n = n.next;
    return n;
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The function `findNodeByValue` searches for a node with a specific value in a doubly linked list and returns the
   * node if found, otherwise it returns undefined.
   * @param {E} value - The `value` parameter is the value that we want to search for in the doubly linked list.
   * @returns The function `findNodeByValue` returns a `DoublyLinkedListNode<E>` if a node with the specified value `value`
   * is found in the linked list. If no such node is found, it returns `undefined`.
   */
  getNode(e) {
    let n = this.head;
    for (; n; ) {
      if (n.value === e)
        return n;
      n = n.next;
    }
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `insert` function inserts a value at a specified index in a doubly linked list.
   * @param {number} index - The index parameter represents the position at which the new value should be inserted in the
   * DoublyLinkedList. It is of type number.
   * @param {E} value - The `value` parameter represents the value that you want to insert into the Doubly Linked List at the
   * specified index.
   * @returns The `insert` method returns a boolean value. It returns `true` if the insertion is successful, and `false`
   * if the index is out of bounds.
   */
  addAt(e, n) {
    if (e < 0 || e > this.size)
      return !1;
    if (e === 0)
      return this.unshift(n), !0;
    if (e === this.size)
      return this.push(n), !0;
    const r = new Gt(n), i = this.getNodeAt(e - 1), s = i.next;
    return r.prev = i, r.next = s, i.next = r, s.prev = r, this._size++, !0;
  }
  /**
   * Time Complexity: O(1) or O(n)
   * Space Complexity: O(1)
   * where n is the number of elements in the linked list.
   */
  /**
   * Time Complexity: O(1) or O(n)
   * Space Complexity: O(1)
   *
   * The `addBefore` function inserts a new value before an existing value or node in a doubly linked list.
   * @param {E | DoublyLinkedListNode<E>} existingValueOrNode - The existing value or node in the doubly linked list
   * before which the new value will be inserted. It can be either the value of the existing node or the existing node
   * itself.
   * @param {E} newValue - The `newValue` parameter represents the value that you want to insert into the doubly linked
   * list.
   * @returns The method returns a boolean value. It returns `true` if the insertion is successful, and `false` if the
   * insertion fails.
   */
  addBefore(e, n) {
    let r;
    if (e instanceof Gt ? r = e : r = this.getNode(e), r) {
      const i = new Gt(n);
      return i.prev = r.prev, r.prev && (r.prev.next = i), i.next = r, r.prev = i, r === this.head && (this._head = i), this._size++, !0;
    }
    return !1;
  }
  /**
   * Time Complexity: O(1) or O(n)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(1) or O(n)
   * Space Complexity: O(1)
   *
   * The `addAfter` function inserts a new node with a given value after an existing node in a doubly linked list.
   * @param {E | DoublyLinkedListNode<E>} existingValueOrNode - The existing value or node in the doubly linked list
   * after which the new value will be inserted. It can be either the value of the existing node or the existing node
   * itself.
   * @param {E} newValue - The value that you want to insert into the doubly linked list.
   * @returns The method returns a boolean value. It returns true if the insertion is successful, and false if the
   * existing value or node is not found in the doubly linked list.
   */
  addAfter(e, n) {
    let r;
    if (e instanceof Gt ? r = e : r = this.getNode(e), r) {
      const i = new Gt(n);
      return i.next = r.next, r.next && (r.next.prev = i), i.prev = r, r.next = i, r === this.tail && (this._tail = i), this._size++, !0;
    }
    return !1;
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `deleteAt` function removes an element at a specified index from a linked list and returns the removed element.
   * @param {number} index - The index parameter represents the position of the element that needs to be deleted in the
   * data structure. It is of type number.
   * @returns The method `deleteAt` returns the value of the node that was deleted, or `undefined` if the index is out of
   * bounds.
   */
  deleteAt(e) {
    if (e < 0 || e >= this.size)
      return !1;
    if (e === 0)
      return this.shift(), !0;
    if (e === this.size - 1)
      return this.pop(), !0;
    const n = this.getNodeAt(e), r = n.prev, i = n.next;
    return r.next = i, i.prev = r, this._size--, !0;
  }
  /**
   * Time Complexity: O(1) or O(n)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(1) or O(n)
   * Space Complexity: O(1)
   *
   * The `delete` function removes a node from a doubly linked list based on either the node itself or its value.
   * @param {E | DoublyLinkedListNode<E>} valOrNode - The `valOrNode` parameter can accept either a value of type `E` or
   * a `DoublyLinkedListNode<E>` object.
   * @returns The `delete` method returns a boolean value. It returns `true` if the value or node was successfully
   * deleted from the doubly linked list, and `false` if the value or node was not found in the list.
   */
  delete(e) {
    let n;
    if (e instanceof Gt ? n = e : n = this.getNode(e), n) {
      if (n === this.head)
        this.shift();
      else if (n === this.tail)
        this.pop();
      else {
        const r = n.prev, i = n.next;
        r.next = i, i.prev = r, this._size--;
      }
      return !0;
    }
    return !1;
  }
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function checks if a variable has a size greater than zero and returns a boolean value.
   * @returns A boolean value is being returned.
   */
  isEmpty() {
    return this.size === 0;
  }
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `clear` function resets the linked list by setting the head, tail, and size to undefined and 0 respectively.
   */
  clear() {
    this._head = void 0, this._tail = void 0, this._size = 0;
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The function returns the index of the first occurrence of a given value in a linked list.
   * @param {E} value - The parameter `value` is of type `E`, which means it can be any data type. It represents the value
   * that we are searching for in the linked list.
   * @returns The method `indexOf` returns the index of the first occurrence of the specified value `value` in the linked
   * list. If the value is not found, it returns -1.
   */
  indexOf(e) {
    let n = 0, r = this.head;
    for (; r; ) {
      if (r.value === e)
        return n;
      n++, r = r.next;
    }
    return -1;
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `findBackward` function iterates through a linked list from the last node to the first node and returns the last
   * value that satisfies the given callback function, or undefined if no value satisfies the callback.
   * @param callback - A function that takes a value of type E as its parameter and returns a boolean value. This
   * function is used to determine whether a given value satisfies a certain condition.
   * @returns The method `findBackward` returns the last value in the linked list that satisfies the condition specified by
   * the callback function. If no value satisfies the condition, it returns `undefined`.
   */
  findBackward(e) {
    let n = this.tail;
    for (; n; ) {
      if (e(n.value))
        return n.value;
      n = n.prev;
    }
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `reverse` function reverses the order of the elements in a doubly linked list.
   */
  reverse() {
    let e = this.head;
    for ([this._head, this._tail] = [this.tail, this.head]; e; ) {
      const n = e.next;
      [e.prev, e.next] = [e.next, e.prev], e = n;
    }
    return this;
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `toArray` function converts a linked list into an array.
   * @returns The `toArray()` method is returning an array of type `E[]`.
   */
  toArray() {
    const e = [];
    let n = this.head;
    for (; n; )
      e.push(n.value), n = n.next;
    return e;
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `toReversedArray` function converts a doubly linked list into an array in reverse order.
   * @returns The `toReversedArray()` function returns an array of type `E[]`.
   */
  toReversedArray() {
    const e = [];
    let n = this.tail;
    for (; n; )
      e.push(n.value), n = n.prev;
    return e;
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `clone` function creates a new instance of the `DoublyLinkedList` class with the same values
   * as the original list.
   * @returns The `clone()` method is returning a new instance of the `DoublyLinkedList` class, which
   * is a copy of the original list.
   */
  clone() {
    return new Hn(this);
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `filter` function creates a new DoublyLinkedList by iterating over the elements of the current
   * list and applying a callback function to each element, returning only the elements for which the
   * callback function returns true.
   * @param callback - The `callback` parameter is a function that will be called for each element in
   * the DoublyLinkedList. It takes three arguments: the current element, the index of the current
   * element, and the DoublyLinkedList itself. The callback function should return a boolean value
   * indicating whether the current element should be included
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that specifies the value
   * to be used as `this` when executing the `callback` function. If `thisArg` is provided, it will be
   * passed as the `this` value to the `callback` function. If `thisArg` is
   * @returns The `filter` method is returning a new `DoublyLinkedList` object that contains the
   * elements that pass the filter condition specified by the `callback` function.
   */
  filter(e, n) {
    const r = new Hn([], { toElementFn: this.toElementFn });
    let i = 0;
    for (const s of this)
      e.call(n, s, i, this) && r.push(s), i++;
    return r;
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */
  /**
   * The `map` function takes a callback function and returns a new DoublyLinkedList with the results
   * of applying the callback to each element in the original list.
   * @param callback - The callback parameter is a function that will be called for each element in the
   * original DoublyLinkedList. It takes three arguments: current (the current element being
   * processed), index (the index of the current element), and this (the original DoublyLinkedList).
   * The callback function should return a value of type
   * @param [toElementFn] - The `toElementFn` parameter is an optional function that can be used to
   * convert the raw element (`RR`) to the desired element type (`T`). It takes the raw element as
   * input and returns the converted element. If this parameter is not provided, the raw element will
   * be used as is.
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that allows you to
   * specify the value of `this` within the callback function. It is used to set the context or scope
   * in which the callback function will be executed. If `thisArg` is provided, it will be used as the
   * value of
   * @returns a new instance of the `DoublyLinkedList` class with elements of type `T` and `RR`.
   */
  map(e, n, r) {
    const i = new Hn([], { toElementFn: n });
    let s = 0;
    for (const o of this)
      i.push(e.call(r, o, s, this)), s++;
    return i;
  }
  /**
   * The function returns an iterator that iterates over the values of a linked list.
   */
  *_getIterator() {
    let e = this.head;
    for (; e; )
      yield e.value, e = e.next;
  }
}
Zn.DoublyLinkedList = Hn;
var er = {};
Object.defineProperty(er, "__esModule", { value: !0 });
er.SkipList = er.SkipListNode = void 0;
class eo {
  constructor(e, n, r) {
    this.key = e, this.value = n, this.forward = new Array(r);
  }
}
er.SkipListNode = eo;
class y0 {
  /**
   * The constructor function initializes a SkipLinkedList object with optional options and elements.
   * @param elements - The `elements` parameter is an iterable containing key-value pairs `[K, V]`. It
   * is used to initialize the SkipLinkedList with the given key-value pairs. If no elements are
   * provided, the SkipLinkedList will be empty.
   * @param {SkipLinkedListOptions} [options] - The `options` parameter is an optional object that can
   * contain two properties:
   */
  constructor(e = [], n) {
    if (this._head = new eo(void 0, void 0, this.maxLevel), this._level = 0, this._maxLevel = 16, this._probability = 0.5, n) {
      const { maxLevel: r, probability: i } = n;
      typeof r == "number" && (this._maxLevel = r), typeof i == "number" && (this._probability = i);
    }
    if (e)
      for (const [r, i] of e)
        this.add(r, i);
  }
  /**
   * The function returns the head node of a SkipList.
   * @returns The method is returning a SkipListNode object with generic key type K and value type V.
   */
  get head() {
    return this._head;
  }
  /**
   * The function returns the value of the protected variable _level.
   * @returns The level property of the object.
   */
  get level() {
    return this._level;
  }
  /**
   * The function returns the maximum level.
   * @returns The value of the variable `_maxLevel` is being returned.
   */
  get maxLevel() {
    return this._maxLevel;
  }
  /**
   * The function returns the probability value.
   * @returns The probability value stored in the protected variable `_probability` is being returned.
   */
  get probability() {
    return this._probability;
  }
  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * Get the value of the first element (the smallest element) in the Skip List.
   * @returns The value of the first element, or undefined if the Skip List is empty.
   */
  get first() {
    const e = this.head.forward[0];
    return e ? e.value : void 0;
  }
  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * Get the value of the last element (the largest element) in the Skip List.
   * @returns The value of the last element, or undefined if the Skip List is empty.
   */
  get last() {
    let e = this.head;
    for (let n = this.level - 1; n >= 0; n--)
      for (; e.forward[n]; )
        e = e.forward[n];
    return e.value;
  }
  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * The add function adds a new node with a given key and value to a Skip List data structure.
   * @param {K} key - The key parameter represents the key of the node that needs to be added to the skip list.
   * @param {V} value - The "value" parameter represents the value associated with the key that is being added to the Skip
   * List.
   */
  add(e, n) {
    const r = new eo(e, n, this._randomLevel()), i = new Array(this.maxLevel).fill(this.head);
    let s = this.head;
    for (let o = this.level - 1; o >= 0; o--) {
      for (; s.forward[o] && s.forward[o].key < e; )
        s = s.forward[o];
      i[o] = s;
    }
    for (let o = 0; o < r.forward.length; o++)
      r.forward[o] = i[o].forward[o], i[o].forward[o] = r;
    r.forward[0] || (this._level = Math.max(this.level, r.forward.length));
  }
  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * The function `get` retrieves the value associated with a given key from a skip list data structure.
   * @param {K} key - The `key` parameter is the key of the element that we want to retrieve from the data structure.
   * @returns The method `get(key: K)` returns the value associated with the given key if it exists in the data structure,
   * otherwise it returns `undefined`.
   */
  get(e) {
    let n = this.head;
    for (let r = this.level - 1; r >= 0; r--)
      for (; n.forward[r] && n.forward[r].key < e; )
        n = n.forward[r];
    if (n = n.forward[0], n && n.key === e)
      return n.value;
  }
  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   */
  /**
   * The function checks if a key exists in a data structure.
   * @param {K} key - The parameter "key" is of type K, which represents the type of the key being
   * checked.
   * @returns a boolean value.
   */
  has(e) {
    return this.get(e) !== void 0;
  }
  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * The `delete` function removes a node with a specific key from a Skip List data structure.
   * @param {K} key - The key parameter represents the key of the node that needs to be removed from the skip list.
   * @returns The `delete` method returns a boolean value. It returns `true` if the key was successfully removed from the
   * skip list, and `false` if the key was not found in the skip list.
   */
  delete(e) {
    const n = new Array(this.maxLevel).fill(this.head);
    let r = this.head;
    for (let i = this.level - 1; i >= 0; i--) {
      for (; r.forward[i] && r.forward[i].key < e; )
        r = r.forward[i];
      n[i] = r;
    }
    if (r = r.forward[0], r && r.key === e) {
      for (let i = 0; i < this.level && n[i].forward[i] === r; i++)
        n[i].forward[i] = r.forward[i];
      for (; this.level > 0 && !this.head.forward[this.level - 1]; )
        this._level--;
      return !0;
    }
    return !1;
  }
  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * Get the value of the first element in the Skip List that is greater than the given key.
   * @param key - the given key.
   * @returns The value of the first element greater than the given key, or undefined if there is no such element.
   */
  higher(e) {
    let n = this.head;
    for (let i = this.level - 1; i >= 0; i--)
      for (; n.forward[i] && n.forward[i].key <= e; )
        n = n.forward[i];
    const r = n.forward[0];
    return r ? r.value : void 0;
  }
  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   *
   * Get the value of the last element in the Skip List that is less than the given key.
   * @param key - the given key.
   * @returns The value of the last element less than the given key, or undefined if there is no such element.
   */
  lower(e) {
    let n = this.head, r;
    for (let i = this.level - 1; i >= 0; i--) {
      for (; n.forward[i] && n.forward[i].key < e; )
        n = n.forward[i];
      n.key < e && (r = n);
    }
    return r ? r.value : void 0;
  }
  /**
   * Time Complexity: O(maxLevel)
   * Space Complexity: O(1)
   * where maxLevel is the maximum level of the SkipList, as it may iterate up to maxLevel times in the worst case.
   */
  /**
   * Time Complexity: O(maxLevel)
   * Space Complexity: O(1)
   *
   * The function "_randomLevel" generates a random level based on a given probability and maximum level.
   * @returns the level, which is a number.
   */
  _randomLevel() {
    let e = 1;
    for (; Math.random() < this.probability && e < this.maxLevel; )
      e++;
    return e;
  }
}
er.SkipList = y0;
(function(t) {
  var e = Te && Te.__createBinding || (Object.create ? function(r, i, s, o) {
    o === void 0 && (o = s);
    var a = Object.getOwnPropertyDescriptor(i, s);
    (!a || ("get" in a ? !i.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return i[s];
    } }), Object.defineProperty(r, o, a);
  } : function(r, i, s, o) {
    o === void 0 && (o = s), r[o] = i[s];
  }), n = Te && Te.__exportStar || function(r, i) {
    for (var s in r)
      s !== "default" && !Object.prototype.hasOwnProperty.call(i, s) && e(i, r, s);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(Jn, t), n(Zn, t), n(er, t);
})(fc);
Object.defineProperty(Qn, "__esModule", { value: !0 });
Qn.LinkedListQueue = Qn.Queue = void 0;
const x0 = Tn, k0 = fc;
class Un extends x0.IterableElementBase {
  constructor(e = [], n) {
    if (super(n), this._elements = [], this._offset = 0, e)
      for (const r of e)
        this.toElementFn ? this.push(this.toElementFn(r)) : this.push(r);
  }
  /**
   * The elements function returns the elements of this set.
   * @return An array of the elements in the stack
   */
  get elements() {
    return this._elements;
  }
  /**
   * The offset function returns the offset of the current page.
   * @return The value of the protected variable _offset
   */
  get offset() {
    return this._offset;
  }
  /**
   * The size function returns the number of elements in an array.
   * @returns {number} The size of the array, which is the difference between the length of the array and the offset.
   */
  get size() {
    return this.elements.length - this.offset;
  }
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `first` function returns the first element of the array `_elements` if it exists, otherwise it returns `undefined`.
   * @returns The `get first()` method returns the first element of the data structure, represented by the `_elements` array at
   * the `_offset` index. If the data structure is empty (size is 0), it returns `undefined`.
   */
  get first() {
    return this.size > 0 ? this.elements[this.offset] : void 0;
  }
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `last` function returns the last element in an array-like data structure, or undefined if the structure is empty.
   * @returns The method `get last()` returns the last element of the `_elements` array if the array is not empty. If the
   * array is empty, it returns `undefined`.
   */
  get last() {
    return this.size > 0 ? this.elements[this.elements.length - 1] : void 0;
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The function "fromArray" creates a new Queue object from an array of elements.Creates a queue from an existing array.
   * @public
   * @static
   * @param {E[]} elements - The "elements" parameter is an array of elements of type E.
   * @returns The method is returning a new instance of the Queue class, initialized with the elements from the input
   * array.
   */
  static fromArray(e) {
    return new Un(e);
  }
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The push function adds an element to the end of the queue and returns the updated queue.Adds an element at the back of the queue.
   * @param {E} element - The `element` parameter represents the element that you want to add to the queue.
   * @returns The `add` method is returning a `Queue<E>` object.
   */
  push(e) {
    return this.elements.push(e), !0;
  }
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `shift` function removes and returns the first element in the queue, and adjusts the internal data structure if
   * necessary to optimize performance.
   * @returns The function `shift()` returns either the first element in the queue or `undefined` if the queue is empty.
   */
  shift() {
    if (this.size === 0)
      return;
    const e = this.first;
    return this._offset += 1, this.offset * 2 < this.elements.length || (this._elements = this.elements.slice(this.offset), this._offset = 0), e;
  }
  /**
   * The delete function removes an element from the list.
   * @param element: E Specify the element to be deleted
   * @return A boolean value indicating whether the element was successfully deleted or not
   */
  delete(e) {
    const n = this.elements.indexOf(e);
    return this.deleteAt(n);
  }
  /**
   * The deleteAt function deletes the element at a given index.
   * @param index: number Determine the index of the element to be deleted
   * @return A boolean value
   */
  deleteAt(e) {
    return this.elements.splice(e, 1).length === 1;
  }
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * @param index
   */
  at(e) {
    return this.elements[e + this._offset];
  }
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function checks if a data structure is empty by comparing its size to zero.
   * @returns {boolean} A boolean value indicating whether the size of the object is 0 or not.
   */
  isEmpty() {
    return this.size === 0;
  }
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(n)
   */
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(n)
   *
   * The toArray() function returns an array of elements from the current offset to the end of the _elements array.
   * @returns An array of type E is being returned.
   */
  toArray() {
    return this.elements.slice(this.offset);
  }
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The clear function resets the elements array and offset to their initial values.
   */
  clear() {
    this._elements = [], this._offset = 0;
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   * where n is the number of elements in the queue. It creates a shallow copy of the internal array. the space required is proportional to the number of elements in the queue.
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `clone()` function returns a new Queue object with the same elements as the original Queue.
   * @returns The `clone()` method is returning a new instance of the `Queue` class.
   */
  clone() {
    return new Un(this.elements.slice(this.offset), { toElementFn: this.toElementFn });
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `filter` function creates a new `Queue` object containing elements from the original `Queue`
   * that satisfy a given predicate function.
   * @param predicate - The `predicate` parameter is a callback function that takes three arguments:
   * the current element being iterated over, the index of the current element, and the queue itself.
   * It should return a boolean value indicating whether the element should be included in the filtered
   * queue or not.
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that specifies the value
   * to be used as `this` when executing the `predicate` function. If `thisArg` is provided, it will be
   * passed as the `this` value to the `predicate` function. If `thisArg` is
   * @returns The `filter` method is returning a new `Queue` object that contains the elements that
   * satisfy the given predicate function.
   */
  filter(e, n) {
    const r = new Un([], { toElementFn: this.toElementFn });
    let i = 0;
    for (const s of this)
      e.call(n, s, i, this) && r.push(s), i++;
    return r;
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */
  map(e, n, r) {
    const i = new Un([], { toElementFn: n });
    let s = 0;
    for (const o of this)
      i.push(e.call(r, o, s, this)), s++;
    return i;
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The function `_getIterator` returns an iterable iterator for the elements in the class.
   */
  *_getIterator() {
    for (const e of this.elements.slice(this.offset))
      yield e;
  }
}
Qn.Queue = Un;
class Mo extends k0.SinglyLinkedList {
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   * The `clone` function returns a new instance of the `LinkedListQueue` class with the same values as
   * the current instance.
   * @returns The `clone()` method is returning a new instance of `LinkedListQueue` with the same
   * values as the original `LinkedListQueue`.
   */
  clone() {
    return new Mo(this, { toElementFn: this.toElementFn });
  }
}
Qn.LinkedListQueue = Mo;
var ts = {};
Object.defineProperty(ts, "__esModule", { value: !0 });
ts.Deque = void 0;
const C0 = Tn, zn = Yi;
class Mn extends C0.IterableElementBase {
  /**
   * The constructor initializes a Deque object with optional iterable of elements and options.
   * @param elements - An iterable object (such as an array or a Set) that contains the initial
   * elements to be added to the deque. It can also be an object with a `length` or `size` property
   * that represents the number of elements in the iterable object. If no elements are provided, an
   * empty deque
   * @param {DequeOptions} [options] - The `options` parameter is an optional object that can contain
   * configuration options for the deque. In this code, it is used to set the `bucketSize` option,
   * which determines the size of each bucket in the deque. If the `bucketSize` option is not provided
   * or is not a number
   */
  constructor(e = [], n) {
    if (super(n), this._bucketSize = 4096, this._bucketFirst = 0, this._firstInBucket = 0, this._bucketLast = 0, this._lastInBucket = 0, this._bucketCount = 0, this._buckets = [], this._size = 0, n) {
      const { bucketSize: s } = n;
      typeof s == "number" && (this._bucketSize = s);
    }
    let r;
    "length" in e ? e.length instanceof Function ? r = e.length() : r = e.length : e.size instanceof Function ? r = e.size() : r = e.size, this._bucketCount = (0, zn.calcMinUnitsRequired)(r, this._bucketSize) || 1;
    for (let s = 0; s < this._bucketCount; ++s)
      this._buckets.push(new Array(this._bucketSize));
    const i = (0, zn.calcMinUnitsRequired)(r, this._bucketSize);
    this._bucketFirst = this._bucketLast = (this._bucketCount >> 1) - (i >> 1), this._firstInBucket = this._lastInBucket = this._bucketSize - r % this._bucketSize >> 1;
    for (const s of e)
      this.toElementFn ? this.push(this.toElementFn(s)) : this.push(s);
  }
  /**
   * The bucketSize function returns the size of the bucket.
   *
   * @return The size of the bucket
   */
  get bucketSize() {
    return this._bucketSize;
  }
  /**
   * The function returns the value of the protected variable `_bucketFirst`.
   * @returns The value of the `_bucketFirst` property.
   */
  get bucketFirst() {
    return this._bucketFirst;
  }
  /**
   * The function returns the value of the protected variable _firstInBucket.
   * @returns The method is returning the value of the variable `_firstInBucket`, which is of type
   * `number`.
   */
  get firstInBucket() {
    return this._firstInBucket;
  }
  /**
   * The function returns the value of the protected variable `_bucketLast`.
   * @returns The value of the `_bucketLast` property, which is a number.
   */
  get bucketLast() {
    return this._bucketLast;
  }
  /**
   * The function returns the value of the protected variable _lastInBucket.
   * @returns The method is returning the value of the variable `_lastInBucket`, which is of type
   * `number`.
   */
  get lastInBucket() {
    return this._lastInBucket;
  }
  /**
   * The function returns the number of buckets.
   * @returns The number of buckets.
   */
  get bucketCount() {
    return this._bucketCount;
  }
  /**
   * The buckets function returns the buckets property of the object.
   * @return The buckets property
   */
  get buckets() {
    return this._buckets;
  }
  /**
   * The size function returns the number of items in the stack.
   * @return The number of values in the set
   */
  get size() {
    return this._size;
  }
  /**
   * The function returns the first element in a collection if it exists, otherwise it returns
   * undefined.
   * @returns The first element of the collection, of type E, is being returned.
   */
  get first() {
    if (this.size !== 0)
      return this._buckets[this._bucketFirst][this._firstInBucket];
  }
  /**
   * The last function returns the last element in the queue.
   * @return The last element in the array
   */
  get last() {
    if (this.size !== 0)
      return this._buckets[this._bucketLast][this._lastInBucket];
  }
  /**
   * Time Complexity - Amortized O(1) (possible reallocation)
   * Space Complexity - O(n) (due to potential resizing).
   */
  /**
   * Time Complexity - Amortized O(1) (possible reallocation),
   * Space Complexity - O(n) (due to potential resizing).
   *
   * The push function adds an element to a data structure and reallocates memory if necessary.
   * @param {E} element - The `element` parameter represents the value that you want to add to the data
   * structure.
   * @returns The size of the data structure after the element has been pushed.
   */
  push(e) {
    return this.size && (this._lastInBucket < this._bucketSize - 1 ? this._lastInBucket += 1 : this._bucketLast < this._bucketCount - 1 ? (this._bucketLast += 1, this._lastInBucket = 0) : (this._bucketLast = 0, this._lastInBucket = 0), this._bucketLast === this._bucketFirst && this._lastInBucket === this._firstInBucket && this._reallocate()), this._size += 1, this._buckets[this._bucketLast][this._lastInBucket] = e, !0;
  }
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `pop()` function removes and returns the last element from a data structure, updating the
   * internal state variables accordingly.
   * @returns The element that was removed from the data structure is being returned.
   */
  pop() {
    if (this.size === 0)
      return;
    const e = this._buckets[this._bucketLast][this._lastInBucket];
    return this.size !== 1 && (this._lastInBucket > 0 ? this._lastInBucket -= 1 : this._bucketLast > 0 ? (this._bucketLast -= 1, this._lastInBucket = this._bucketSize - 1) : (this._bucketLast = this._bucketCount - 1, this._lastInBucket = this._bucketSize - 1)), this._size -= 1, e;
  }
  /**
   * Time Complexity: Amortized O(1)
   * Space Complexity: O(n)
   */
  /**
   * Time Complexity: Amortized O(1)
   * Space Complexity: O(n)
   *
   * The `unshift` function adds an element to the beginning of an array-like data structure and
   * returns the new size of the structure.
   * @param {E} element - The `element` parameter represents the element that you want to add to the
   * beginning of the data structure.
   * @returns The size of the data structure after the element has been added.
   */
  unshift(e) {
    return this.size && (this._firstInBucket > 0 ? this._firstInBucket -= 1 : this._bucketFirst > 0 ? (this._bucketFirst -= 1, this._firstInBucket = this._bucketSize - 1) : (this._bucketFirst = this._bucketCount - 1, this._firstInBucket = this._bucketSize - 1), this._bucketFirst === this._bucketLast && this._firstInBucket === this._lastInBucket && this._reallocate()), this._size += 1, this._buckets[this._bucketFirst][this._firstInBucket] = e, !0;
  }
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `shift()` function removes and returns the first element from a data structure, updating the
   * internal state variables accordingly.
   * @returns The element that is being removed from the beginning of the data structure is being
   * returned.
   */
  shift() {
    if (this.size === 0)
      return;
    const e = this._buckets[this._bucketFirst][this._firstInBucket];
    return this.size !== 1 && (this._firstInBucket < this._bucketSize - 1 ? this._firstInBucket += 1 : this._bucketFirst < this._bucketCount - 1 ? (this._bucketFirst += 1, this._firstInBucket = 0) : (this._bucketFirst = 0, this._firstInBucket = 0)), this._size -= 1, e;
  }
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function checks if the size of an object is equal to zero and returns a boolean value.
   * @returns A boolean value indicating whether the size of the object is 0 or not.
   */
  isEmpty() {
    return this.size === 0;
  }
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The clear() function resets the state of the object by initializing all variables to their default
   * values.
   */
  clear() {
    this._buckets = [new Array(this._bucketSize)], this._bucketCount = 1, this._bucketFirst = this._bucketLast = this._size = 0, this._firstInBucket = this._lastInBucket = this._bucketSize >> 1;
  }
  /**
   * The below function is a generator that yields elements from a collection one by one.
   */
  *begin() {
    let e = 0;
    for (; e < this.size; )
      yield this.at(e), e++;
  }
  /**
   * The function `reverseBegin()` is a generator that yields elements in reverse order starting from
   * the last element.
   */
  *reverseBegin() {
    let e = this.size - 1;
    for (; e >= 0; )
      yield this.at(e), e--;
  }
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `at` function retrieves an element at a specified position in an array-like data structure.
   * @param {number} pos - The `pos` parameter represents the position of the element that you want to
   * retrieve from the data structure. It is of type `number` and should be a valid index within the
   * range of the data structure.
   * @returns The element at the specified position in the data structure is being returned.
   */
  at(e) {
    (0, zn.rangeCheck)(e, 0, this.size - 1);
    const { bucketIndex: n, indexInBucket: r } = this._getBucketAndPosition(e);
    return this._buckets[n][r];
  }
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `setAt` function sets an element at a specific position in an array-like data structure.
   * @param {number} pos - The `pos` parameter represents the position at which the element needs to be
   * set. It is of type `number`.
   * @param {E} element - The `element` parameter is the value that you want to set at the specified
   * position in the data structure.
   */
  setAt(e, n) {
    (0, zn.rangeCheck)(e, 0, this.size - 1);
    const { bucketIndex: r, indexInBucket: i } = this._getBucketAndPosition(e);
    return this._buckets[r][i] = n, !0;
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `addAt` function inserts one or more elements at a specified position in an array-like data
   * structure.
   * @param {number} pos - The `pos` parameter represents the position at which the element(s) should
   * be inserted. It is of type `number`.
   * @param {E} element - The `element` parameter represents the element that you want to insert into
   * the array at the specified position.
   * @param [num=1] - The `num` parameter represents the number of times the `element` should be
   * inserted at the specified position (`pos`). By default, it is set to 1, meaning that the `element`
   * will be inserted once. However, you can provide a different value for `num` if you want
   * @returns The size of the array after the insertion is being returned.
   */
  addAt(e, n, r = 1) {
    const i = this.size;
    if ((0, zn.rangeCheck)(e, 0, i), e === 0)
      for (; r--; )
        this.unshift(n);
    else if (e === this.size)
      for (; r--; )
        this.push(n);
    else {
      const s = [];
      for (let o = e; o < this.size; ++o)
        s.push(this.at(o));
      this.cut(e - 1, !0);
      for (let o = 0; o < r; ++o)
        this.push(n);
      for (let o = 0; o < s.length; ++o)
        this.push(s[o]);
    }
    return !0;
  }
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `cut` function updates the state of the object based on the given position and returns the
   * updated size.
   * @param {number} pos - The `pos` parameter represents the position at which the string should be
   * cut. It is a number that indicates the index of the character where the cut should be made.
   * @param {boolean} isCutSelf - If true, the original deque will not be cut, and return a new deque
   * @returns The method is returning the updated size of the data structure.
   */
  cut(e, n = !1) {
    if (n) {
      if (e < 0)
        return this.clear(), this;
      const { bucketIndex: r, indexInBucket: i } = this._getBucketAndPosition(e);
      return this._bucketLast = r, this._lastInBucket = i, this._size = e + 1, this;
    } else {
      const r = new Mn([], { bucketSize: this._bucketSize });
      for (let i = 0; i <= e; i++)
        r.push(this.at(i));
      return r;
    }
  }
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1) or O(n)
   */
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1) or O(n)
   *
   * The `cutRest` function cuts the elements from a specified position in a deque and returns a new
   * deque with the cut elements.
   * @param {number} pos - The `pos` parameter represents the position from which to cut the Deque. It
   * is a number that indicates the index of the element in the Deque where the cut should start.
   * @param [isCutSelf=false] - isCutSelf is a boolean parameter that determines whether the original
   * Deque should be modified or a new Deque should be created. If isCutSelf is true, the original
   * Deque will be modified by cutting off elements starting from the specified position. If isCutSelf
   * is false, a new De
   * @returns The function `cutRest` returns either the modified original deque (`this`) or a new deque
   * (`newDeque`) depending on the value of the `isCutSelf` parameter.
   */
  cutRest(e, n = !1) {
    if (n) {
      if (e < 0)
        return this.clear(), this;
      const { bucketIndex: r, indexInBucket: i } = this._getBucketAndPosition(e);
      return this._bucketFirst = r, this._firstInBucket = i, this._size = this._size - e, this;
    } else {
      const r = new Mn([], { bucketSize: this._bucketSize });
      for (let i = e; i < this.size; i++)
        r.push(this.at(i));
      return r;
    }
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1) or O(n)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1) or O(n)
   *
   * The `deleteAt` function removes an element at a specified position in an array-like data
   * structure.
   * @param {number} pos - The `pos` parameter in the `deleteAt` function represents the position at
   * which an element needs to be deleted from the data structure. It is of type `number` and indicates
   * the index of the element to be deleted.
   * @returns The size of the data structure after the deletion operation is performed.
   */
  deleteAt(e) {
    if ((0, zn.rangeCheck)(e, 0, this.size - 1), e === 0)
      this.shift();
    else if (e === this.size - 1)
      this.pop();
    else {
      const n = this.size - 1;
      let { bucketIndex: r, indexInBucket: i } = this._getBucketAndPosition(e);
      for (let s = e; s < n; ++s) {
        const { bucketIndex: o, indexInBucket: a } = this._getBucketAndPosition(e + 1);
        this._buckets[r][i] = this._buckets[o][a], r = o, i = a;
      }
      this.pop();
    }
    return !0;
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `delete` function removes all occurrences of a specified element from an array-like data
   * structure.
   * @param {E} element - The `element` parameter represents the element that you want to delete from
   * the data structure.
   * @returns The size of the data structure after the element has been deleted.
   */
  delete(e) {
    const n = this.size;
    if (n === 0)
      return !1;
    let r = 0, i = 0;
    for (; r < n; ) {
      const s = this.at(r);
      s !== e && (this.setAt(i, s), i += 1), r += 1;
    }
    return this.cut(i - 1, !0), !0;
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The reverse() function reverses the order of the buckets and the elements within each bucket in a
   * data structure.
   * @returns The reverse() method is returning the object itself (this) after performing the reverse
   * operation on the buckets and updating the relevant properties.
   */
  reverse() {
    this._buckets.reverse().forEach(function(s) {
      s.reverse();
    });
    const { _bucketFirst: e, _bucketLast: n, _firstInBucket: r, _lastInBucket: i } = this;
    return this._bucketFirst = this._bucketCount - n - 1, this._bucketLast = this._bucketCount - e - 1, this._firstInBucket = this._bucketSize - i - 1, this._lastInBucket = this._bucketSize - r - 1, this;
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `unique()` function removes duplicate elements from an array-like data structure and returns
   * the number of unique elements.
   * @returns The size of the modified array is being returned.
   */
  unique() {
    if (this.size <= 1)
      return this;
    let e = 1, n = this.at(0);
    for (let r = 1; r < this.size; ++r) {
      const i = this.at(r);
      i !== n && (n = i, this.setAt(e++, i));
    }
    return this.cut(e - 1, !0), this;
  }
  /**
   * Time Complexity: O(n log n)
   * Space Complexity: O(n)
   */
  /**
   * Time Complexity: O(n log n)
   * Space Complexity: O(n)
   *
   * The `sort` function sorts the elements in a data structure using a provided comparator function.
   * @param [comparator] - The `comparator` parameter is a function that takes in two elements `x` and
   * `y` of type `E` and returns a number. The comparator function is used to determine the order of
   * the elements in the sorted array.
   * @returns Deque<E>
   */
  sort(e) {
    const n = [];
    for (let r = 0; r < this.size; ++r)
      n.push(this.at(r));
    n.sort(e);
    for (let r = 0; r < this.size; ++r)
      this.setAt(r, n[r]);
    return this;
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `shrinkToFit` function reorganizes the elements in an array-like data structure to minimize
   * memory usage.
   * @returns Nothing is being returned. The function is using the `return` statement to exit early if
   * `this.size` is 0, but it does not return any value.
   */
  shrinkToFit() {
    if (this.size === 0)
      return;
    const e = [];
    if (this._bucketFirst !== this._bucketLast) {
      if (this._bucketFirst < this._bucketLast)
        for (let n = this._bucketFirst; n <= this._bucketLast; ++n)
          e.push(this._buckets[n]);
      else {
        for (let n = this._bucketFirst; n < this._bucketCount; ++n)
          e.push(this._buckets[n]);
        for (let n = 0; n <= this._bucketLast; ++n)
          e.push(this._buckets[n]);
      }
      this._bucketFirst = 0, this._bucketLast = e.length - 1, this._buckets = e;
    }
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The function "indexOf" returns the index of the first occurrence of a given element in an array,
   * or -1 if the element is not found.
   * @param {E} element - The "element" parameter represents the element that you want to find the
   * index of in the data structure.
   * @returns The indexOf function returns the index of the first occurrence of the specified element
   * in the data structure. If the element is not found, it returns -1.
   */
  indexOf(e) {
    for (let n = 0; n < this.size; ++n)
      if (this.at(n) === e)
        return n;
    return -1;
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `toArray` function converts the elements of a data structure into an array.
   * @returns The `toArray()` method is returning an array of elements of type `E`.
   */
  toArray() {
    return [...this];
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `clone()` function returns a new instance of the `Deque` class with the same elements and
   * bucket size as the original instance.
   * @returns The `clone()` method is returning a new instance of the `Deque` class with the same
   * elements as the original deque (`this`) and the same bucket size.
   */
  clone() {
    return new Mn(this, { bucketSize: this.bucketSize, toElementFn: this.toElementFn });
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `filter` function creates a new deque containing elements from the original deque that satisfy
   * a given predicate function.
   * @param predicate - The `predicate` parameter is a callback function that takes three arguments:
   * the current element being iterated over, the index of the current element, and the deque itself.
   * It should return a boolean value indicating whether the element should be included in the filtered
   * deque or not.
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that specifies the value
   * to be used as `this` when executing the `predicate` function. If `thisArg` is provided, it will be
   * passed as the `this` value to the `predicate` function. If `thisArg` is
   * @returns The `filter` method is returning a new `Deque` object that contains the elements that
   * satisfy the given predicate function.
   */
  filter(e, n) {
    const r = new Mn([], { bucketSize: this._bucketSize, toElementFn: this.toElementFn });
    let i = 0;
    for (const s of this)
      e.call(n, s, i, this) && r.push(s), i++;
    return r;
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */
  /**
   * The `map` function takes a callback function and applies it to each element in the deque,
   * returning a new deque with the results.
   * @param callback - The callback parameter is a function that will be called for each element in the
   * deque. It takes three arguments: the current element, the index of the element, and the deque
   * itself. It should return a value of type EM.
   * @param [toElementFn] - The `toElementFn` parameter is an optional function that can be used to
   * transform the raw element (`RM`) into a new element (`EM`) before adding it to the new deque. If
   * provided, this function will be called for each raw element in the original deque.
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that allows you to
   * specify the value of `this` within the callback function. It is used to set the context or scope
   * in which the callback function will be executed. If `thisArg` is provided, it will be used as the
   * value of
   * @returns a new Deque object with elements of type EM and raw elements of type RM.
   */
  map(e, n, r) {
    const i = new Mn([], { bucketSize: this._bucketSize, toElementFn: n });
    let s = 0;
    for (const o of this)
      i.push(e.call(r, o, s, this)), s++;
    return i;
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The above function is an implementation of the iterator protocol in TypeScript, allowing the
   * object to be iterated over using a for...of loop.
   */
  *_getIterator() {
    for (let e = 0; e < this.size; ++e)
      yield this.at(e);
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `_reallocate` function reallocates the buckets in an array, adding new buckets if needed.
   * @param {number} [needBucketNum] - The `needBucketNum` parameter is an optional number that
   * specifies the number of new buckets needed. If not provided, it will default to half of the
   * current bucket count (`this._bucketCount >> 1`) or 1 if the current bucket count is less than 2.
   */
  _reallocate(e) {
    const n = [], r = e || this._bucketCount >> 1 || 1;
    for (let i = 0; i < r; ++i)
      n[i] = new Array(this._bucketSize);
    for (let i = this._bucketFirst; i < this._bucketCount; ++i)
      n[n.length] = this._buckets[i];
    for (let i = 0; i < this._bucketLast; ++i)
      n[n.length] = this._buckets[i];
    n[n.length] = [...this._buckets[this._bucketLast]], this._bucketFirst = r, this._bucketLast = n.length - 1;
    for (let i = 0; i < r; ++i)
      n[n.length] = new Array(this._bucketSize);
    this._buckets = n, this._bucketCount = n.length;
  }
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function calculates the bucket index and index within the bucket based on the given position.
   * @param {number} pos - The `pos` parameter represents the position within the data structure. It is
   * a number that indicates the index or position of an element within the structure.
   * @returns an object with two properties: "bucketIndex" and "indexInBucket".
   */
  _getBucketAndPosition(e) {
    let n, r;
    const i = this._firstInBucket + e;
    return n = this._bucketFirst + Math.floor(i / this._bucketSize), n >= this._bucketCount && (n -= this._bucketCount), r = (i + 1) % this._bucketSize - 1, r < 0 && (r = this._bucketSize - 1), { bucketIndex: n, indexInBucket: r };
  }
}
ts.Deque = Mn;
(function(t) {
  var e = Te && Te.__createBinding || (Object.create ? function(r, i, s, o) {
    o === void 0 && (o = s);
    var a = Object.getOwnPropertyDescriptor(i, s);
    (!a || ("get" in a ? !i.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return i[s];
    } }), Object.defineProperty(r, o, a);
  } : function(r, i, s, o) {
    o === void 0 && (o = s), r[o] = i[s];
  }), n = Te && Te.__exportStar || function(r, i) {
    for (var s in r)
      s !== "default" && !Object.prototype.hasOwnProperty.call(i, s) && e(i, r, s);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(Qn, t), n(ts, t);
})(dc);
Object.defineProperty(dn, "__esModule", { value: !0 });
dn.AbstractGraph = dn.AbstractEdge = dn.AbstractVertex = void 0;
const _0 = Yi, S0 = Tn, M0 = cc, O0 = dc;
class It {
  /**
   * The function is a protected constructor that takes an key and an optional value as parameters.
   * @param {VertexKey} key - The `key` parameter is of type `VertexKey` and represents the identifier of the vertex. It is
   * used to uniquely identify the vertex object.
   * @param {V} [value] - The parameter "value" is an optional parameter of type V. It is used to assign a value to the
   * vertex. If no value is provided, it will be set to undefined.
   */
  constructor(e, n) {
    this.key = e, this.value = n;
  }
}
dn.AbstractVertex = It;
class hc {
  /**
   * The above function is a protected constructor that initializes the weight, value, and hash code properties of an
   * object.
   * @param {number} [weight] - The `weight` parameter is an optional number that represents the weight of the object. If
   * a value is provided, it will be assigned to the `_weight` property. If no value is provided, the default value of 1
   * will be assigned.
   * @param {VO} [value] - The `value` parameter is of type `VO`, which means it can be any type. It is an optional parameter,
   * meaning it can be omitted when creating an instance of the class.
   */
  constructor(e, n) {
    this.weight = e !== void 0 ? e : 1, this.value = n, this._hashCode = (0, _0.uuidV4)();
  }
  get hashCode() {
    return this._hashCode;
  }
}
dn.AbstractEdge = hc;
class E0 extends S0.IterableEntryBase {
  constructor() {
    super(), this._vertexMap = /* @__PURE__ */ new Map();
  }
  get vertexMap() {
    return this._vertexMap;
  }
  set vertexMap(e) {
    this._vertexMap = e;
  }
  get size() {
    return this._vertexMap.size;
  }
  /**
   * Time Complexity: O(1) - Constant time for Map lookup.
   * Space Complexity: O(1) - Constant space, as it creates only a few variables.
   */
  /**
   * Time Complexity: O(1) - Constant time for Map lookup.
   * Space Complexity: O(1) - Constant space, as it creates only a few variables.
   *
   * The function "getVertex" returns the vertex with the specified ID or undefined if it doesn't exist.
   * @param {VertexKey} vertexKey - The `vertexKey` parameter is the identifier of the vertex that you want to retrieve from
   * the `_vertexMap` map.
   * @returns The method `getVertex` returns the vertex with the specified `vertexKey` if it exists in the `_vertexMap`
   * map. If the vertex does not exist, it returns `undefined`.
   */
  getVertex(e) {
    return this._vertexMap.get(e) || void 0;
  }
  /**
   * Time Complexity: O(1) - Constant time for Map lookup.
   * Space Complexity: O(1) - Constant space, as it creates only a few variables.
   */
  /**
   * Time Complexity: O(1) - Constant time for Map lookup.
   * Space Complexity: O(1) - Constant space, as it creates only a few variables.
   *
   * The function checks if a vertex exists in a graph.
   * @param {VO | VertexKey} vertexOrKey - The parameter `vertexOrKey` can be either a vertex object (`VO`) or a vertex ID
   * (`VertexKey`).
   * @returns a boolean value.
   */
  hasVertex(e) {
    return this._vertexMap.has(this._getVertexKey(e));
  }
  /**
   * Time Complexity: O(1) - Constant time for Map operations.
   * Space Complexity: O(1) - Constant space, as it creates only a few variables.
   */
  addVertex(e, n) {
    if (e instanceof It)
      return this._addVertex(e);
    {
      const r = this.createVertex(e, n);
      return this._addVertex(r);
    }
  }
  isVertexKey(e) {
    const n = typeof e;
    return n === "string" || n === "number";
  }
  /**
   * Time Complexity: O(K), where K is the number of vertexMap to be removed.
   * Space Complexity: O(1) - Constant space, as it creates only a few variables.
   */
  /**
   * Time Complexity: O(K), where K is the number of vertexMap to be removed.
   * Space Complexity: O(1) - Constant space, as it creates only a few variables.
   *
   * The function removes all vertexMap from a graph and returns a boolean indicating if any vertexMap were removed.
   * @param {VO[] | VertexKey[]} vertexMap - The `vertexMap` parameter can be either an array of vertexMap (`VO[]`) or an array
   * of vertex IDs (`VertexKey[]`).
   * @returns a boolean value. It returns true if at least one vertex was successfully removed, and false if no vertexMap
   * were removed.
   */
  removeManyVertices(e) {
    const n = [];
    for (const r of e)
      n.push(this.deleteVertex(r));
    return n.length > 0;
  }
  /**
   * Time Complexity: O(1) - Depends on the implementation in the concrete class.
   * Space Complexity: O(1) - Depends on the implementation in the concrete class.
   */
  /**
   * Time Complexity: O(1) - Depends on the implementation in the concrete class.
   * Space Complexity: O(1) - Depends on the implementation in the concrete class.
   *
   * The function checks if there is an edge between two vertexMap and returns a boolean value indicating the result.
   * @param {VertexKey | VO} v1 - The parameter v1 can be either a VertexKey or a VO. A VertexKey represents the unique
   * identifier of a vertex in a graph, while VO represents the type of the vertex object itself.
   * @param {VertexKey | VO} v2 - The parameter `v2` represents the second vertex in the edge. It can be either a
   * `VertexKey` or a `VO` type, which represents the type of the vertex.
   * @returns A boolean value is being returned.
   */
  hasEdge(e, n) {
    return !!this.getEdge(e, n);
  }
  /**
   * Time Complexity: O(1) - Depends on the implementation in the concrete class.
   * Space Complexity: O(1) - Depends on the implementation in the concrete class.
   */
  addEdge(e, n, r, i) {
    if (e instanceof hc)
      return this._addEdge(e);
    if (n instanceof It || typeof n == "string" || typeof n == "number") {
      if (!(this.hasVertex(e) && this.hasVertex(n)))
        return !1;
      e instanceof It && (e = e.key), n instanceof It && (n = n.key);
      const s = this.createEdge(e, n, r, i);
      return this._addEdge(s);
    } else
      throw new Error("dest must be a Vertex or vertex key while srcOrEdge is an Edge");
  }
  /**
   * Time Complexity: O(1) - Constant time for Map and Edge operations.
   * Space Complexity: O(1) - Constant space, as it creates only a few variables.
   */
  /**
   * Time Complexity: O(1) - Constant time for Map and Edge operations.
   * Space Complexity: O(1) - Constant space, as it creates only a few variables.
   *
   * The function sets the weight of an edge between two vertexMap in a graph.
   * @param {VertexKey | VO} srcOrKey - The `srcOrKey` parameter can be either a `VertexKey` or a `VO` object. It represents
   * the source vertex of the edge.
   * @param {VertexKey | VO} destOrKey - The `destOrKey` parameter represents the destination vertex of the edge. It can be
   * either a `VertexKey` or a vertex object `VO`.
   * @param {number} weight - The weight parameter represents the weight of the edge between the source vertex (srcOrKey)
   * and the destination vertex (destOrKey).
   * @returns a boolean value. If the edge exists between the source and destination vertexMap, the function will update
   * the weight of the edge and return true. If the edge does not exist, the function will return false.
   */
  setEdgeWeight(e, n, r) {
    const i = this.getEdge(e, n);
    return i ? (i.weight = r, !0) : !1;
  }
  /**
   * Time Complexity: O(P), where P is the number of paths found (in the worst case, exploring all paths).
   * Space Complexity: O(P) - Linear space, where P is the number of paths found.
   */
  /**
   * Time Complexity: O(P), where P is the number of paths found (in the worst case, exploring all paths).
   * Space Complexity: O(P) - Linear space, where P is the number of paths found.
   *
   * The function `getAllPathsBetween` finds all paths between two vertexMap in a graph using depth-first search.
   * @param {VO | VertexKey} v1 - The parameter `v1` represents either a vertex object (`VO`) or a vertex ID (`VertexKey`).
   * It is the starting vertex for finding paths.
   * @param {VO | VertexKey} v2 - The parameter `v2` represents either a vertex object (`VO`) or a vertex ID (`VertexKey`).
   * @param limit - The count of limitation of result array.
   * @returns The function `getAllPathsBetween` returns an array of arrays of vertexMap (`VO[][]`).
   */
  getAllPathsBetween(e, n, r = 1e3) {
    const i = [], s = this._getVertex(e), o = this._getVertex(n);
    if (!(s && o))
      return [];
    const a = [];
    for (a.push({ vertex: s, path: [s] }); a.length > 0; ) {
      const { vertex: l, path: c } = a.pop();
      if (l === o && (i.push(c), i.length >= r))
        return i;
      const u = this.getNeighbors(l);
      for (const f of u)
        if (!c.includes(f)) {
          const h = [...c, f];
          a.push({ vertex: f, path: h });
        }
    }
    return i;
  }
  /**
   * Time Complexity: O(L), where L is the length of the path.
   * Space Complexity: O(1) - Constant space.
   */
  /**
   * Time Complexity: O(L), where L is the length of the path.
   * Space Complexity: O(1) - Constant space.
   *
   * The function calculates the sum of weights along a given path.
   * @param {VO[]} path - An array of vertexMap (VO) representing a path in a graph.
   * @returns The function `getPathSumWeight` returns the sum of the weights of the edgeMap in the given path.
   */
  getPathSumWeight(e) {
    var n;
    let r = 0;
    for (let i = 0; i < e.length; i++)
      r += ((n = this.getEdge(e[i], e[i + 1])) === null || n === void 0 ? void 0 : n.weight) || 0;
    return r;
  }
  /**
   * Time Complexity: O(V + E) - Depends on the implementation (Dijkstra's algorithm).
   * Space Complexity: O(V + E) - Depends on the implementation (Dijkstra's algorithm).
   */
  /**
   * Time Complexity: O(V + E) - Depends on the implementation (Dijkstra's algorithm).
   * Space Complexity: O(V + E) - Depends on the implementation (Dijkstra's algorithm).
   *
   * The function `getMinCostBetween` calculates the minimum cost between two vertexMap in a graph, either based on edge
   * weights or using a breadth-first search algorithm.
   * @param {VO | VertexKey} v1 - The parameter `v1` represents the starting vertex or its ID.
   * @param {VO | VertexKey} v2 - The parameter `v2` represents the destination vertex or its ID. It is the vertex to which
   * you want to find the minimum cost or weight from the source vertex `v1`.
   * @param {boolean} [isWeight] - isWeight is an optional parameter that indicates whether the graph edgeMap have weights.
   * If isWeight is set to true, the function will calculate the minimum cost between v1 and v2 based on the weights of
   * the edgeMap. If isWeight is set to false or not provided, the function will calculate the
   * @returns The function `getMinCostBetween` returns a number representing the minimum cost between two vertexMap (`v1`
   * and `v2`). If the `isWeight` parameter is `true`, it calculates the minimum weight among all paths between the
   * vertexMap. If `isWeight` is `false` or not provided, it uses a breadth-first search (BFS) algorithm to calculate the
   * minimum number of
   */
  getMinCostBetween(e, n, r) {
    if (r === void 0 && (r = !1), r) {
      const i = this.getAllPathsBetween(e, n);
      let s = 1 / 0;
      for (const o of i)
        s = Math.min(this.getPathSumWeight(o), s);
      return s;
    } else {
      const i = this._getVertex(n), s = this._getVertex(e);
      if (!(s && i))
        return;
      const o = /* @__PURE__ */ new Map(), a = new O0.Queue([s]);
      o.set(s, !0);
      let l = 0;
      for (; a.size > 0; ) {
        for (let c = 0; c < a.size; c++) {
          const u = a.shift();
          if (u === i)
            return l;
          if (u !== void 0) {
            const f = this.getNeighbors(u);
            for (const h of f)
              o.has(h) || (o.set(h, !0), a.push(h));
          }
        }
        l++;
      }
      return;
    }
  }
  /**
   * Time Complexity: O(V + E) - Depends on the implementation (Dijkstra's algorithm or DFS).
   * Space Complexity: O(V + E) - Depends on the implementation (Dijkstra's algorithm or DFS).
   */
  /**
   * Time Complexity: O(V + E) - Depends on the implementation (Dijkstra's algorithm or DFS).
   * Space Complexity: O(V + E) - Depends on the implementation (Dijkstra's algorithm or DFS).
   *
   * The function `getMinPathBetween` returns the minimum path between two vertexMap in a graph, either based on weight or
   * using a breadth-first search algorithm.
   * @param {VO | VertexKey} v1 - The parameter `v1` represents the starting vertex of the path. It can be either a vertex
   * object (`VO`) or a vertex ID (`VertexKey`).
   * @param {VO | VertexKey} v2 - VO | VertexKey - The second vertex or vertex ID between which we want to find the minimum
   * path.
   * @param {boolean} [isWeight] - A boolean flag indicating whether to consider the weight of edgeMap in finding the
   * minimum path. If set to true, the function will use Dijkstra's algorithm to find the minimum weighted path. If set
   * to false, the function will use breadth-first search (BFS) to find the minimum path.
   * @param isDFS - If set to true, it enforces the use of getAllPathsBetween to first obtain all possible paths,
   * followed by iterative computation of the shortest path. This approach may result in exponential time complexity,
   * so the default method is to use the Dijkstra algorithm to obtain the shortest weighted path.
   * @returns The function `getMinPathBetween` returns an array of vertexMap (`VO[]`) representing the minimum path between
   * two vertexMap (`v1` and `v2`). If there is no path between the vertexMap, it returns `undefined`.
   */
  getMinPathBetween(e, n, r, i = !1) {
    var s, o;
    if (r === void 0 && (r = !1), r)
      if (i) {
        const a = this.getAllPathsBetween(e, n, 1e4);
        let l = 1 / 0, c = -1, u = 0;
        for (const f of a) {
          const h = this.getPathSumWeight(f);
          h < l && (l = h, c = u), u++;
        }
        return a[c] || void 0;
      } else
        return (o = (s = this.dijkstra(e, n, !0, !0)) === null || s === void 0 ? void 0 : s.minPath) !== null && o !== void 0 ? o : [];
    else {
      let a = [];
      const l = this._getVertex(e), c = this._getVertex(n);
      if (!(l && c))
        return [];
      const u = (f, h, m, w) => {
        if (m.add(f), f === h) {
          a = [l, ...w];
          return;
        }
        const g = this.getNeighbors(f);
        for (const p of g)
          m.has(p) || (w.push(p), u(p, h, m, w), w.pop());
        m.delete(f);
      };
      return u(l, c, /* @__PURE__ */ new Set(), []), a;
    }
  }
  /**
   *  Dijkstra algorithm time: O(VE) space: O(VO + EO)
   */
  /**
   * Time Complexity: O(V^2 + E) - Quadratic time in the worst case (no heap optimization).
   * Space Complexity: O(V + E) - Depends on the implementation (Dijkstra's algorithm).
   */
  /**
   * Time Complexity: O(V^2 + E) - Quadratic time in the worst case (no heap optimization).
   * Space Complexity: O(V + E) - Depends on the implementation (Dijkstra's algorithm).
   *
   * The function `dijkstraWithoutHeap` implements Dijkstra's algorithm to find the shortest path between two vertexMap in
   * a graph without using a heap data structure.
   * @param {VO | VertexKey} src - The source vertex from which to start the Dijkstra's algorithm. It can be either a
   * vertex object or a vertex ID.
   * @param {VO | VertexKey | undefined} [dest] - The `dest` parameter in the `dijkstraWithoutHeap` function is an optional
   * parameter that specifies the destination vertex for the Dijkstra algorithm. It can be either a vertex object or its
   * identifier. If no destination is provided, the value is set to `undefined`.
   * @param {boolean} [getMinDist] - The `getMinDist` parameter is a boolean flag that determines whether the minimum
   * distance from the source vertex to the destination vertex should be calculated and returned in the result. If
   * `getMinDist` is set to `true`, the `minDist` property in the result will contain the minimum distance
   * @param {boolean} [genPaths] - The `genPaths` parameter is a boolean flag that determines whether or not to generate
   * paths in the Dijkstra algorithm. If `genPaths` is set to `true`, the algorithm will calculate and return the
   * shortest paths from the source vertex to all other vertexMap in the graph. If `genPaths
   * @returns The function `dijkstraWithoutHeap` returns an object of type `DijkstraResult<VO>`.
   */
  dijkstraWithoutHeap(e, n = void 0, r = !1, i = !1) {
    let s = 1 / 0, o, a = [];
    const l = [], c = this._vertexMap, u = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Set(), h = /* @__PURE__ */ new Map(), m = this._getVertex(e), w = n ? this._getVertex(n) : void 0;
    if (!m)
      return;
    for (const v of c) {
      const b = v[1];
      b instanceof It && u.set(b, 1 / 0);
    }
    u.set(m, 0), h.set(m, void 0);
    const g = () => {
      let v = 1 / 0, b;
      for (const [C, _] of u)
        f.has(C) || _ < v && (v = _, b = C);
      return b;
    }, p = (v) => {
      for (const b of c) {
        const C = b[1];
        if (C instanceof It) {
          const _ = [C];
          let E = h.get(C);
          for (; E; )
            _.push(E), E = h.get(E);
          const F = _.reverse();
          b[1] === v && (a = F), l.push(F);
        }
      }
    };
    for (let v = 1; v < c.size; v++) {
      const b = g();
      if (b) {
        if (f.add(b), w && w === b)
          return r && (s = u.get(w) || 1 / 0), i && p(w), { distMap: u, preMap: h, seen: f, paths: l, minDist: s, minPath: a };
        const C = this.getNeighbors(b);
        for (const _ of C)
          if (!f.has(_)) {
            const E = this.getEdge(b, _);
            if (E) {
              const F = u.get(b), T = u.get(_);
              F !== void 0 && T !== void 0 && E.weight + F < T && (u.set(_, E.weight + F), h.set(_, b));
            }
          }
      }
    }
    return r && u.forEach((v, b) => {
      b !== m && v < s && (s = v, i && (o = b));
    }), i && p(o), { distMap: u, preMap: h, seen: f, paths: l, minDist: s, minPath: a };
  }
  /**
   *  Dijkstra algorithm time: O(logVE) space: O(VO + EO)
   *
   * Dijkstra's algorithm only solves the single-source shortest path problem, while the Bellman-Ford algorithm and Floyd-Warshall algorithm can address shortest paths between all pairs of nodes.
   * Dijkstra's algorithm is suitable for graphs with non-negative edge weights, whereas the Bellman-Ford algorithm and Floyd-Warshall algorithm can handle negative-weight edgeMap.
   * The time complexity of Dijkstra's algorithm and the Bellman-Ford algorithm depends on the size of the graph, while the time complexity of the Floyd-Warshall algorithm is O(VO^3), where VO is the number of nodes. For dense graphs, Floyd-Warshall might become slower.
   *
   */
  /**
   * Time Complexity: O((V + E) * log(V)) - Depends on the implementation (using a binary heap).
   * Space Complexity: O(V + E) - Depends on the implementation (using a binary heap).
   */
  /**
   * Time Complexity: O((V + E) * log(V)) - Depends on the implementation (using a binary heap).
   * Space Complexity: O(V + E) - Depends on the implementation (using a binary heap).
   *
   * Dijkstra's algorithm is used to find the shortest paths from a source node to all other nodes in a graph. Its basic idea is to repeatedly choose the node closest to the source node and update the distances of other nodes using this node as an intermediary. Dijkstra's algorithm requires that the edge weights in the graph are non-negative.
   * The `dijkstra` function implements Dijkstra's algorithm to find the shortest path between a source vertex and an
   * optional destination vertex, and optionally returns the minimum distance, the paths, and other information.
   * @param {VO | VertexKey} src - The `src` parameter represents the source vertex from which the Dijkstra algorithm will
   * start. It can be either a vertex object or a vertex ID.
   * @param {VO | VertexKey | undefined} [dest] - The `dest` parameter is the destination vertex or vertex ID. It specifies the
   * vertex to which the shortest path is calculated from the source vertex. If no destination is provided, the algorithm
   * will calculate the shortest paths to all other vertexMap from the source vertex.
   * @param {boolean} [getMinDist] - The `getMinDist` parameter is a boolean flag that determines whether the minimum
   * distance from the source vertex to the destination vertex should be calculated and returned in the result. If
   * `getMinDist` is set to `true`, the `minDist` property in the result will contain the minimum distance
   * @param {boolean} [genPaths] - The `genPaths` parameter is a boolean flag that determines whether or not to generate
   * paths in the Dijkstra algorithm. If `genPaths` is set to `true`, the algorithm will calculate and return the
   * shortest paths from the source vertex to all other vertexMap in the graph. If `genPaths
   * @returns The function `dijkstra` returns an object of type `DijkstraResult<VO>`.
   */
  dijkstra(e, n = void 0, r = !1, i = !1) {
    var s;
    let o = 1 / 0, a, l = [];
    const c = [], u = this._vertexMap, f = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Set(), m = /* @__PURE__ */ new Map(), w = this._getVertex(e), g = n ? this._getVertex(n) : void 0;
    if (!w)
      return;
    for (const b of u) {
      const C = b[1];
      C instanceof It && f.set(C, 1 / 0);
    }
    const p = new M0.Heap([], { comparator: (b, C) => b.key - C.key });
    p.add({ key: 0, value: w }), f.set(w, 0), m.set(w, void 0);
    const v = (b) => {
      for (const C of u) {
        const _ = C[1];
        if (_ instanceof It) {
          const E = [_];
          let F = m.get(_);
          for (; F; )
            E.push(F), F = m.get(F);
          const T = E.reverse();
          C[1] === b && (l = T), c.push(T);
        }
      }
    };
    for (; p.size > 0; ) {
      const b = p.poll(), C = b == null ? void 0 : b.key, _ = b == null ? void 0 : b.value;
      if (C !== void 0 && _) {
        if (h.add(_), g && g === _)
          return r && (o = f.get(g) || 1 / 0), i && v(g), { distMap: f, preMap: m, seen: h, paths: c, minDist: o, minPath: l };
        const E = this.getNeighbors(_);
        for (const F of E)
          if (!h.has(F)) {
            const T = (s = this.getEdge(_, F)) === null || s === void 0 ? void 0 : s.weight;
            if (typeof T == "number") {
              const x = f.get(F);
              x && C + T < x && (p.add({ key: C + T, value: F }), m.set(F, _), f.set(F, C + T));
            }
          }
      }
    }
    return r && f.forEach((b, C) => {
      C !== w && b < o && (o = b, i && (a = C));
    }), i && v(a), { distMap: f, preMap: m, seen: h, paths: c, minDist: o, minPath: l };
  }
  /**
   * Time Complexity: O(V * E) - Quadratic time in the worst case (Bellman-Ford algorithm).
   * Space Complexity: O(V + E) - Depends on the implementation (Bellman-Ford algorithm).
   * one to rest pairs
   */
  /**
   * Time Complexity: O(V * E) - Quadratic time in the worst case (Bellman-Ford algorithm).
   * Space Complexity: O(V + E) - Depends on the implementation (Bellman-Ford algorithm).
   *
   * one to rest pairs
   * The Bellman-Ford algorithm is also used to find the shortest paths from a source node to all other nodes in a graph. Unlike Dijkstra's algorithm, it can handle edge weights that are negative. Its basic idea involves iterative relaxation of all edgeMap for several rounds to gradually approximate the shortest paths. Due to its ability to handle negative-weight edgeMap, the Bellman-Ford algorithm is more flexible in some scenarios.
   * The `bellmanFord` function implements the Bellman-Ford algorithm to find the shortest path from a source vertex to
   * all other vertexMap in a graph, and optionally detects negative cycles and generates the minimum path.
   * @param {VO | VertexKey} src - The `src` parameter is the source vertex from which the Bellman-Ford algorithm will
   * start calculating the shortest paths. It can be either a vertex object or a vertex ID.
   * @param {boolean} [scanNegativeCycle] - A boolean flag indicating whether to scan for negative cycles in the graph.
   * @param {boolean} [getMin] - The `getMin` parameter is a boolean flag that determines whether the algorithm should
   * calculate the minimum distance from the source vertex to all other vertexMap in the graph. If `getMin` is set to
   * `true`, the algorithm will find the minimum distance and update the `min` variable with the minimum
   * @param {boolean} [genPath] - A boolean flag indicating whether to generate paths for all vertexMap from the source
   * vertex.
   * @returns The function `bellmanFord` returns an object with the following properties:
   */
  bellmanFord(e, n, r, i) {
    r === void 0 && (r = !1), i === void 0 && (i = !1);
    const s = this._getVertex(e), o = [], a = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map();
    let c = 1 / 0, u = [], f;
    if (n && (f = !1), !s)
      return { hasNegativeCycle: f, distMap: a, preMap: l, paths: o, min: c, minPath: u };
    const h = this._vertexMap, m = h.size, w = this.edgeSet(), g = w.length;
    this._vertexMap.forEach((v) => {
      a.set(v, 1 / 0);
    }), a.set(s, 0);
    for (let v = 1; v < m; ++v)
      for (let b = 0; b < g; ++b) {
        const C = this.getEndsOfEdge(w[b]);
        if (C) {
          const [_, E] = C, F = w[b].weight, T = a.get(_), x = a.get(E);
          T !== void 0 && x !== void 0 && a.get(_) !== 1 / 0 && T + F < x && (a.set(E, T + F), i && l.set(E, _));
        }
      }
    let p;
    if (r && a.forEach((v, b) => {
      b !== s && v < c && (c = v, i && (p = b));
    }), i)
      for (const v of h) {
        const b = v[1];
        if (b instanceof It) {
          const C = [b];
          let _ = l.get(b);
          for (; _ !== void 0; )
            C.push(_), _ = l.get(_);
          const E = C.reverse();
          v[1] === p && (u = E), o.push(E);
        }
      }
    for (let v = 0; v < g; ++v) {
      const b = this.getEndsOfEdge(w[v]);
      if (b) {
        const [C] = b, _ = w[v].weight, E = a.get(C);
        E && E !== 1 / 0 && E + _ < E && (f = !0);
      }
    }
    return { hasNegativeCycle: f, distMap: a, preMap: l, paths: o, min: c, minPath: u };
  }
  /**
   * Dijkstra algorithm time: O(logVE) space: O(VO + EO)
   */
  /**
   * Dijkstra algorithm time: O(logVE) space: O(VO + EO)
   * Dijkstra's algorithm is used to find the shortest paths from a source node to all other nodes in a graph. Its basic idea is to repeatedly choose the node closest to the source node and update the distances of other nodes using this node as an intermediary. Dijkstra's algorithm requires that the edge weights in the graph are non-negative.
   */
  /**
   * BellmanFord time:O(VE) space:O(VO)
   * one to rest pairs
   * The Bellman-Ford algorithm is also used to find the shortest paths from a source node to all other nodes in a graph. Unlike Dijkstra's algorithm, it can handle edge weights that are negative. Its basic idea involves iterative relaxation of all edgeMap for several rounds to gradually approximate the shortest paths. Due to its ability to handle negative-weight edgeMap, the Bellman-Ford algorithm is more flexible in some scenarios.
   * The `bellmanFord` function implements the Bellman-Ford algorithm to find the shortest path from a source vertex to
   */
  /**
   * Time Complexity: O(V^3) - Cubic time (Floyd-Warshall algorithm).
   * Space Complexity: O(V^2) - Quadratic space (Floyd-Warshall algorithm).
   * Not support graph with negative weight cycle
   * all pairs
   * The Floyd-Warshall algorithm is used to find the shortest paths between all pairs of nodes in a graph. It employs dynamic programming to compute the shortest paths from any node to any other node. The Floyd-Warshall algorithm's advantage lies in its ability to handle graphs with negative-weight edgeMap, and it can simultaneously compute shortest paths between any two nodes.
   */
  /**
   * Time Complexity: O(V^3) - Cubic time (Floyd-Warshall algorithm).
   * Space Complexity: O(V^2) - Quadratic space (Floyd-Warshall algorithm).
   *
   * Not support graph with negative weight cycle
   * all pairs
   * The Floyd-Warshall algorithm is used to find the shortest paths between all pairs of nodes in a graph. It employs dynamic programming to compute the shortest paths from any node to any other node. The Floyd-Warshall algorithm's advantage lies in its ability to handle graphs with negative-weight edgeMap, and it can simultaneously compute shortest paths between any two nodes.
   * The function implements the Floyd-Warshall algorithm to find the shortest path between all pairs of vertexMap in a
   * graph.
   * @returns The function `floydWarshall()` returns an object with two properties: `costs` and `predecessor`. The `costs`
   * property is a 2D array of numbers representing the shortest path costs between vertexMap in a graph. The
   * `predecessor` property is a 2D array of vertexMap (or `undefined`) representing the predecessor vertexMap in the shortest
   * path between vertexMap in the
   */
  floydWarshall() {
    var e;
    const n = [...this._vertexMap], r = n.length, i = [], s = [];
    for (let o = 0; o < r; o++) {
      i[o] = [], s[o] = [];
      for (let a = 0; a < r; a++)
        s[o][a] = void 0;
    }
    for (let o = 0; o < r; o++)
      for (let a = 0; a < r; a++)
        i[o][a] = ((e = this.getEdge(n[o][1], n[a][1])) === null || e === void 0 ? void 0 : e.weight) || 1 / 0;
    for (let o = 0; o < r; o++)
      for (let a = 0; a < r; a++)
        for (let l = 0; l < r; l++)
          i[a][l] > i[a][o] + i[o][l] && (i[a][l] = i[a][o] + i[o][l], s[a][l] = n[o][1]);
    return { costs: i, predecessor: s };
  }
  /**
   * O(V+E+C)
   * O(V+C)
   */
  getCycles(e = !1) {
    const n = [], r = /* @__PURE__ */ new Set(), i = (o, a, l) => {
      if (l.has(o)) {
        (!e && a.length > 2 || e && a.length >= 2) && a[0] === o.key && n.push([...a]);
        return;
      }
      l.add(o), a.push(o.key);
      for (const c of this.getNeighbors(o))
        c && i(c, a, l);
      l.delete(o), a.pop();
    };
    for (const o of this.vertexMap.values())
      i(o, [], r);
    const s = /* @__PURE__ */ new Map();
    for (const o of n) {
      const a = [...o].sort().toString();
      s.has(a) || s.set(a, o);
    }
    return [...s].map((o) => o[1]);
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `filter` function iterates over key-value pairs in a data structure and returns an array of
   * pairs that satisfy a given predicate.
   * @param predicate - The `predicate` parameter is a callback function that takes four arguments:
   * `value`, `key`, `index`, and `this`. It is used to determine whether an element should be included
   * in the filtered array. The callback function should return `true` if the element should be
   * included, and `
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that allows you to
   * specify the value of `this` within the `predicate` function. It is used when you want to bind a
   * specific object as the context for the `predicate` function. If `thisArg` is provided, it will be
   * @returns The `filter` method returns an array of key-value pairs `[VertexKey, V | undefined][]`
   * that satisfy the given predicate function.
   */
  filter(e, n) {
    const r = [];
    let i = 0;
    for (const [s, o] of this)
      e.call(n, o, s, i, this) && r.push([s, o]), i++;
    return r;
  }
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */
  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `map` function iterates over the elements of a collection and applies a callback function to
   * each element, returning an array of the results.
   * @param callback - The callback parameter is a function that will be called for each element in the
   * map. It takes four arguments:
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that allows you to
   * specify the value of `this` within the callback function. If `thisArg` is provided, it will be
   * used as the `this` value when calling the callback function. If `thisArg` is not provided, `
   * @returns The `map` function is returning an array of type `T[]`.
   */
  map(e, n) {
    const r = [];
    let i = 0;
    for (const [s, o] of this)
      r.push(e.call(n, o, s, i, this)), i++;
    return r;
  }
  *_getIterator() {
    for (const e of this._vertexMap.values())
      yield [e.key, e.value];
  }
  _addVertex(e) {
    return this.hasVertex(e) ? !1 : (this._vertexMap.set(e.key, e), !0);
  }
  _getVertex(e) {
    const n = this._getVertexKey(e);
    return this._vertexMap.get(n) || void 0;
  }
  _getVertexKey(e) {
    return e instanceof It ? e.key : e;
  }
}
dn.AbstractGraph = E0;
Object.defineProperty(un, "__esModule", { value: !0 });
un.DirectedGraph = un.DirectedEdge = un.DirectedVertex = void 0;
const Oo = dn, ui = Yi;
class to extends Oo.AbstractVertex {
  /**
   * The constructor function initializes a vertex with an optional value.
   * @param {VertexKey} key - The `key` parameter is of type `VertexKey` and represents the identifier of the vertex. It is
   * used to uniquely identify the vertex within a graph or data structure.
   * @param {V} [value] - The "value" parameter is an optional parameter of type V. It is used to initialize the value of the
   * vertex. If no value is provided, the vertex will be initialized with a default value.
   */
  constructor(e, n) {
    super(e, n);
  }
}
un.DirectedVertex = to;
class gc extends Oo.AbstractEdge {
  /**
   * The constructor function initializes the source and destination vertexMap of an edge, along with an optional weight
   * and value.
   * @param {VertexKey} src - The `src` parameter is the source vertex ID. It represents the starting point of an edge in
   * a graph.
   * @param {VertexKey} dest - The `dest` parameter represents the destination vertex of an edge. It is of type
   * `VertexKey`, which is likely a unique identifier for a vertex in a graph.
   * @param {number} [weight] - The weight parameter is an optional number that represents the weight of the edge.
   * @param {E} [value] - The `value` parameter is an optional parameter of type `E`. It represents the value associated with
   * the edge.
   */
  constructor(e, n, r, i) {
    super(r, i), this.src = e, this.dest = n;
  }
}
un.DirectedEdge = gc;
class Eo extends Oo.AbstractGraph {
  /**
   * The constructor function initializes an instance of a class.
   */
  constructor() {
    super(), this._outEdgeMap = /* @__PURE__ */ new Map(), this._inEdgeMap = /* @__PURE__ */ new Map();
  }
  get outEdgeMap() {
    return this._outEdgeMap;
  }
  set outEdgeMap(e) {
    this._outEdgeMap = e;
  }
  get inEdgeMap() {
    return this._inEdgeMap;
  }
  set inEdgeMap(e) {
    this._inEdgeMap = e;
  }
  /**
   * In TypeScript, a subclass inherits the interface implementation of its parent class, without needing to implement the same interface again in the subclass. This behavior differs from Java's approach. In Java, if a parent class implements an interface, the subclass needs to explicitly implement the same interface, even if the parent class has already implemented it.
   * This means that using abstract methods in the parent class cannot constrain the grandchild classes. Defining methods within an interface also cannot constrain the descendant classes. When inheriting from this class, developers need to be aware that this method needs to be overridden.
   */
  /**
   * The function creates a new vertex with an optional value and returns it.
   * @param {VertexKey} key - The `key` parameter is the unique identifier for the vertex. It is of type `VertexKey`, which
   * could be a number or a string depending on how you want to identify your vertexMap.
   * @param [value] - The 'value' parameter is an optional value that can be assigned to the vertex. If a value is provided,
   * it will be assigned to the 'value' property of the vertex. If no value is provided, the 'value' property will be
   * assigned the same value as the 'key' parameter
   * @returns a new instance of a DirectedVertex object, casted as type VO.
   */
  createVertex(e, n) {
    return new to(e, n);
  }
  /**
   * In TypeScript, a subclass inherits the interface implementation of its parent class, without needing to implement the same interface again in the subclass. This behavior differs from Java's approach. In Java, if a parent class implements an interface, the subclass needs to explicitly implement the same interface, even if the parent class has already implemented it.
   * This means that using abstract methods in the parent class cannot constrain the grandchild classes. Defining methods within an interface also cannot constrain the descendant classes. When inheriting from this class, developers need to be aware that this method needs to be overridden.
   */
  /**
   * The function creates a directed edge between two vertexMap with an optional weight and value.
   * @param {VertexKey} src - The source vertex ID of the edge. It represents the starting point of the edge.
   * @param {VertexKey} dest - The `dest` parameter is the identifier of the destination vertex for the edge.
   * @param {number} [weight] - The weight parameter is an optional number that represents the weight of the edge. If no
   * weight is provided, it defaults to 1.
   * @param [value] - The 'value' parameter is an optional value that can be assigned to the edge. It can be of any type and
   * is used to store additional information or data associated with the edge.
   * @returns a new instance of a DirectedEdge object, casted as type EO.
   */
  createEdge(e, n, r, i) {
    return new gc(e, n, r ?? 1, i);
  }
  /**
   * Time Complexity: O(|V|) where |V| is the number of vertexMap
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(|V|) where |V| is the number of vertexMap
   * Space Complexity: O(1)
   *
   * The `getEdge` function retrieves an edge between two vertexMap based on their source and destination IDs.
   * @param {VO | VertexKey | undefined} srcOrKey - The source vertex or its ID. It can be either a vertex object or a vertex ID.
   * @param {VO | VertexKey | undefined} destOrKey - The `destOrKey` parameter in the `getEdge` function represents the
   * destination vertex of the edge. It can be either a vertex object (`VO`), a vertex ID (`VertexKey`), or `undefined` if the
   * destination is not specified.
   * @returns the first edge found between the source and destination vertexMap, or undefined if no such edge is found.
   */
  getEdge(e, n) {
    let r = [];
    if (e !== void 0 && n !== void 0) {
      const i = this._getVertex(e), s = this._getVertex(n);
      if (i && s) {
        const o = this._outEdgeMap.get(i);
        o && (r = o.filter((a) => a.dest === s.key));
      }
    }
    return r[0] || void 0;
  }
  /**
   * Time Complexity: O(|E|) where |E| is the number of edgeMap
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(|E|) where |E| is the number of edgeMap
   * Space Complexity: O(1)
   *
   * The function removes an edge between two vertexMap in a graph and returns the removed edge.
   * @param {VO | VertexKey} srcOrKey - The source vertex or its ID.
   * @param {VO | VertexKey} destOrKey - The `destOrKey` parameter represents the destination vertex or its ID.
   * @returns the removed edge (EO) if it exists, or undefined if either the source or destination vertex does not exist.
   */
  deleteEdgeSrcToDest(e, n) {
    const r = this._getVertex(e), i = this._getVertex(n);
    let s;
    if (!r || !i)
      return;
    const o = this._outEdgeMap.get(r);
    o && (0, ui.arrayRemove)(o, (l) => l.dest === i.key);
    const a = this._inEdgeMap.get(i);
    return a && (s = (0, ui.arrayRemove)(a, (l) => l.src === r.key)[0] || void 0), s;
  }
  /**
   * Time Complexity: O(E) where E is the number of edgeMap
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(E) where E is the number of edgeMap
   * Space Complexity: O(1)
   *
   * The `deleteEdge` function removes an edge from a graph and returns the removed edge.
   * @param {EO | VertexKey} edgeOrSrcVertexKey - The `edge` parameter can be either an `EO` object (edge object) or
   * a `VertexKey` (key of a vertex).
   * @param {VertexKey} [destVertexKey] - The `destVertexKey` parameter is an optional parameter that
   * represents the key of the destination vertex of the edge. It is used to specify the destination
   * vertex when the `edge` parameter is a vertex key. If `destVertexKey` is not provided, the function
   * assumes that the `edge`
   * @returns the removed edge (EO) or undefined if no edge was removed.
   */
  deleteEdge(e, n) {
    let r, i, s;
    if (this.isVertexKey(e))
      if (this.isVertexKey(n))
        i = this._getVertex(e), s = this._getVertex(n);
      else
        return;
    else
      i = this._getVertex(e.src), s = this._getVertex(e.dest);
    if (i && s) {
      const o = this._outEdgeMap.get(i);
      o && o.length > 0 && (0, ui.arrayRemove)(o, (l) => l.src === i.key && l.dest === (s == null ? void 0 : s.key));
      const a = this._inEdgeMap.get(s);
      a && a.length > 0 && (r = (0, ui.arrayRemove)(a, (l) => l.src === i.key && l.dest === s.key)[0]);
    }
    return r;
  }
  /**
   * Time Complexity: O(1) - Constant time for Map operations.
   * Space Complexity: O(1) - Constant space, as it creates only a few variables.
   */
  /**
   * Time Complexity: O(1) - Constant time for Map operations.
   * Space Complexity: O(1) - Constant space, as it creates only a few variables.
   *
   * The `deleteVertex` function removes a vertex from a graph by its ID or by the vertex object itself.
   * @param {VO | VertexKey} vertexOrKey - The parameter `vertexOrKey` can be either a vertex object (`VO`) or a vertex ID
   * (`VertexKey`).
   * @returns The method is returning a boolean value.
   */
  deleteVertex(e) {
    let n, r;
    if (this.isVertexKey(e) ? (r = this.getVertex(e), n = e) : (r = e, n = this._getVertexKey(e)), r) {
      const i = this.getNeighbors(r);
      for (const s of i)
        this._inEdgeMap.delete(s);
      this._outEdgeMap.delete(r), this._inEdgeMap.delete(r);
    }
    return this._vertexMap.delete(n);
  }
  /**
   * Time Complexity: O(|E|) where |E| is the number of edgeMap
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(|E|) where |E| is the number of edgeMap
   * Space Complexity: O(1)
   *
   * The function removes edgeMap between two vertexMap and returns the removed edgeMap.
   * @param {VertexKey | VO} v1 - The parameter `v1` can be either a `VertexKey` or a `VO`. A `VertexKey` represents the
   * unique identifier of a vertex in a graph, while `VO` represents the actual vertex object.
   * @param {VertexKey | VO} v2 - The parameter `v2` represents either a `VertexKey` or a `VO` object. It is used to specify
   * the second vertex in the edge that needs to be removed.
   * @returns an array of removed edgeMap (EO[]).
   */
  deleteEdgesBetween(e, n) {
    const r = [];
    if (e && n) {
      const i = this.deleteEdgeSrcToDest(e, n), s = this.deleteEdgeSrcToDest(n, e);
      i && r.push(i), s && r.push(s);
    }
    return r;
  }
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function `incomingEdgesOf` returns an array of incoming edgeMap for a given vertex or vertex ID.
   * @param {VO | VertexKey} vertexOrKey - The parameter `vertexOrKey` can be either a vertex object (`VO`) or a vertex ID
   * (`VertexKey`).
   * @returns The method `incomingEdgesOf` returns an array of edgeMap (`EO[]`).
   */
  incomingEdgesOf(e) {
    const n = this._getVertex(e);
    return n ? this.inEdgeMap.get(n) || [] : [];
  }
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function `outgoingEdgesOf` returns an array of outgoing edgeMap from a given vertex or vertex ID.
   * @param {VO | VertexKey} vertexOrKey - The parameter `vertexOrKey` can accept either a vertex object (`VO`) or a vertex ID
   * (`VertexKey`).
   * @returns The method `outgoingEdgesOf` returns an array of edgeMap (`EO[]`).
   */
  outgoingEdgesOf(e) {
    const n = this._getVertex(e);
    return n ? this._outEdgeMap.get(n) || [] : [];
  }
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function "degreeOf" returns the total degree of a vertex, which is the sum of its out-degree and in-degree.
   * @param {VertexKey | VO} vertexOrKey - The parameter `vertexOrKey` can be either a `VertexKey` or a `VO`.
   * @returns The sum of the out-degree and in-degree of the specified vertex or vertex ID.
   */
  degreeOf(e) {
    return this.outDegreeOf(e) + this.inDegreeOf(e);
  }
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function "inDegreeOf" returns the number of incoming edgeMap for a given vertex.
   * @param {VertexKey | VO} vertexOrKey - The parameter `vertexOrKey` can be either a `VertexKey` or a `VO`.
   * @returns The number of incoming edgeMap of the specified vertex or vertex ID.
   */
  inDegreeOf(e) {
    return this.incomingEdgesOf(e).length;
  }
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function `outDegreeOf` returns the number of outgoing edgeMap from a given vertex.
   * @param {VertexKey | VO} vertexOrKey - The parameter `vertexOrKey` can be either a `VertexKey` or a `VO`.
   * @returns The number of outgoing edgeMap from the specified vertex or vertex ID.
   */
  outDegreeOf(e) {
    return this.outgoingEdgesOf(e).length;
  }
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function "edgesOf" returns an array of both outgoing and incoming edgeMap of a given vertex or vertex ID.
   * @param {VertexKey | VO} vertexOrKey - The parameter `vertexOrKey` can be either a `VertexKey` or a `VO`.
   * @returns The function `edgesOf` returns an array of edgeMap.
   */
  edgesOf(e) {
    return [...this.outgoingEdgesOf(e), ...this.incomingEdgesOf(e)];
  }
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function "getEdgeSrc" returns the source vertex of an edge, or undefined if the edge does not exist.
   * @param {EO} e - The parameter "e" is of type EO, which represents an edge in a graph.
   * @returns either a vertex object (VO) or undefined.
   */
  getEdgeSrc(e) {
    return this._getVertex(e.src);
  }
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function "getEdgeDest" returns the destination vertex of an edge.
   * @param {EO} e - The parameter "e" is of type "EO", which represents an edge in a graph.
   * @returns either a vertex object of type VO or undefined.
   */
  getEdgeDest(e) {
    return this._getVertex(e.dest);
  }
  /**
   * Time Complexity: O(|E|) where |E| is the number of edgeMap
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(|E|) where |E| is the number of edgeMap
   * Space Complexity: O(1)
   *
   * The function `getDestinations` returns an array of destination vertexMap connected to a given vertex.
   * @param {VO | VertexKey | undefined} vertex - The `vertex` parameter represents the starting vertex from which we want to
   * find the destinations. It can be either a `VO` object, a `VertexKey` value, or `undefined`.
   * @returns an array of vertexMap (VO[]).
   */
  getDestinations(e) {
    if (e === void 0)
      return [];
    const n = [], r = this.outgoingEdgesOf(e);
    for (const i of r) {
      const s = this.getEdgeDest(i);
      s && n.push(s);
    }
    return n;
  }
  /**
   * Time Complexity: O(|V| + |E|) where |V| is the number of vertexMap and |E| is the number of edgeMap
   * Space Complexity: O(|V|)
   */
  /**
   * Time Complexity: O(|V| + |E|) where |V| is the number of vertexMap and |E| is the number of edgeMap
   * Space Complexity: O(|V|)
   *
   * The `topologicalSort` function performs a topological sort on a graph and returns an array of vertexMap or vertex IDs
   * in the sorted order, or undefined if the graph contains a cycle.
   * @param {'vertex' | 'key'} [propertyName] - The `propertyName` parameter is an optional parameter that specifies the
   * property to use for sorting the vertexMap. It can have two possible values: 'vertex' or 'key'. If 'vertex' is
   * specified, the vertexMap themselves will be used for sorting. If 'key' is specified, the ids of
   * @returns an array of vertexMap or vertex IDs in topological order. If there is a cycle in the graph, it returns undefined.
   */
  topologicalSort(e) {
    e = e ?? "key";
    const n = /* @__PURE__ */ new Map();
    for (const o of this.vertexMap)
      n.set(o[1], 0);
    let r = [], i = !1;
    const s = (o) => {
      n.set(o, 1);
      const a = this.getDestinations(o);
      for (const l of a) {
        const c = n.get(l);
        c === 0 ? s(l) : c === 1 && (i = !0);
      }
      n.set(o, 2), r.push(o);
    };
    for (const o of this.vertexMap)
      n.get(o[1]) === 0 && s(o[1]);
    if (!i)
      return e === "key" && (r = r.map((o) => o instanceof to ? o.key : o)), r.reverse();
  }
  /**
   * Time Complexity: O(|E|) where |E| is the number of edgeMap
   * Space Complexity: O(|E|)
   */
  /**
   * Time Complexity: O(|E|) where |E| is the number of edgeMap
   * Space Complexity: O(|E|)
   *
   * The `edgeSet` function returns an array of all the edgeMap in the graph.
   * @returns The `edgeSet()` method returns an array of edgeMap (`EO[]`).
   */
  edgeSet() {
    let e = [];
    return this._outEdgeMap.forEach((n) => {
      e = [...e, ...n];
    }), e;
  }
  /**
   * Time Complexity: O(|E|) where |E| is the number of edgeMap
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(|E|) where |E| is the number of edgeMap
   * Space Complexity: O(1)
   *
   * The function `getNeighbors` returns an array of neighboring vertexMap of a given vertex or vertex ID in a graph.
   * @param {VO | VertexKey} vertexOrKey - The parameter `vertexOrKey` can be either a vertex object (`VO`) or a vertex ID
   * (`VertexKey`).
   * @returns an array of vertexMap (VO[]).
   */
  getNeighbors(e) {
    const n = [], r = this._getVertex(e);
    if (r) {
      const i = this.outgoingEdgesOf(r);
      for (const s of i) {
        const o = this._getVertex(s.dest);
        o && n.push(o);
      }
    }
    return n;
  }
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function "getEndsOfEdge" returns the source and destination vertexMap of an edge if it exists in the graph,
   * otherwise it returns undefined.
   * @param {EO} edge - The parameter `edge` is of type `EO`, which represents an edge in a graph.
   * @returns The function `getEndsOfEdge` returns an array containing two vertexMap `[VO, VO]` if the edge exists in the
   * graph. If the edge does not exist, it returns `undefined`.
   */
  getEndsOfEdge(e) {
    if (!this.hasEdge(e.src, e.dest))
      return;
    const n = this._getVertex(e.src), r = this._getVertex(e.dest);
    if (n && r)
      return [n, r];
  }
  /**
   * The isEmpty function checks if the graph is empty.
   *
   * @return A boolean value
   */
  isEmpty() {
    return this.vertexMap.size === 0 && this.inEdgeMap.size === 0 && this.outEdgeMap.size === 0;
  }
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The clear function resets the vertex map, in-edge map, and out-edge map.
   */
  clear() {
    this._vertexMap = /* @__PURE__ */ new Map(), this._inEdgeMap = /* @__PURE__ */ new Map(), this._outEdgeMap = /* @__PURE__ */ new Map();
  }
  /**
   * The clone function creates a new DirectedGraph object with the same vertices and edges as the original.
   *
   * @return A new instance of the directedgraph class
   */
  clone() {
    const e = new Eo();
    return e.vertexMap = new Map(this.vertexMap), e.inEdgeMap = new Map(this.inEdgeMap), e.outEdgeMap = new Map(this.outEdgeMap), e;
  }
  /**
   *  Time Complexity: O(V + E)
   *  Space Complexity: O(V)
   *  Tarjan is an algorithm based on dfs,which is used to solve the connectivity problem of graphs.
   *  Tarjan can find the SSC(strongly connected components), articulation points, and bridges of directed graphs.
   */
  /**
   *  Time Complexity: O(V + E)
   *  Space Complexity: O(V)
   *  Tarjan is an algorithm based on dfs,which is used to solve the connectivity problem of graphs.
   *  Tarjan can find the SSC(strongly connected components), articulation points, and bridges of directed graphs.
   *
   * The function `tarjan` implements the Tarjan's algorithm to find strongly connected components in a
   * graph.
   * @returns The function `tarjan()` returns an object with three properties: `dfnMap`, `lowMap`, and
   * `SCCs`.
   */
  tarjan() {
    const e = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
    let i = 0;
    const s = [], o = /* @__PURE__ */ new Set(), a = (l) => {
      e.set(l, i), n.set(l, i), i++, s.push(l), o.add(l);
      const c = this.getNeighbors(l);
      for (const u of c)
        e.has(u) ? o.has(u) && n.set(l, Math.min(n.get(l), e.get(u))) : (a(u), n.set(l, Math.min(n.get(l), n.get(u))));
      if (e.get(l) === n.get(l)) {
        const u = [];
        let f;
        do
          f = s.pop(), o.delete(f), u.push(f);
        while (f !== l);
        r.set(r.size, u);
      }
    };
    for (const l of this.vertexMap.values())
      e.has(l) || a(l);
    return { dfnMap: e, lowMap: n, SCCs: r };
  }
  /**
   * Time Complexity: O(V + E) - Depends on the implementation (Tarjan's algorithm).
   * Space Complexity: O(V) - Depends on the implementation (Tarjan's algorithm).
   */
  /**
   * Time Complexity: O(V + E) - Depends on the implementation (Tarjan's algorithm).
   * Space Complexity: O(V) - Depends on the implementation (Tarjan's algorithm).
   *
   * The function returns a map that associates each vertex object with its corresponding depth-first
   * number.
   * @returns A Map object with keys of type VO and values of type number.
   */
  getDFNMap() {
    return this.tarjan().dfnMap;
  }
  /**
   * The function returns a Map object that contains the low values of each vertex in a Tarjan
   * algorithm.
   * @returns The method `getLowMap()` is returning a `Map` object with keys of type `VO` and values of
   * type `number`.
   */
  getLowMap() {
    return this.tarjan().lowMap;
  }
  /**
   * The function "getSCCs" returns a map of strongly connected components (SCCs) using the Tarjan
   * algorithm.
   * @returns a map where the keys are numbers and the values are arrays of VO objects.
   */
  getSCCs() {
    return this.tarjan().SCCs;
  }
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function `_addEdge` adds an edge to a graph if the source and destination vertexMap exist.
   * @param {EO} edge - The parameter `edge` is of type `EO`, which represents an edge in a graph. It is the edge that
   * needs to be added to the graph.
   * @returns a boolean value. It returns true if the edge was successfully added to the graph, and false if either the
   * source or destination vertex does not exist in the graph.
   */
  _addEdge(e) {
    if (!(this.hasVertex(e.src) && this.hasVertex(e.dest)))
      return !1;
    const n = this._getVertex(e.src), r = this._getVertex(e.dest);
    if (n && r) {
      const i = this._outEdgeMap.get(n);
      i ? i.push(e) : this._outEdgeMap.set(n, [e]);
      const s = this._inEdgeMap.get(r);
      return s ? s.push(e) : this._inEdgeMap.set(r, [e]), !0;
    } else
      return !1;
  }
}
un.DirectedGraph = Eo;
var mc = {};
Object.defineProperty(mc, "__esModule", { value: !0 });
var wc = {};
Object.defineProperty(wc, "__esModule", { value: !0 });
(function(t) {
  var e = Te && Te.__createBinding || (Object.create ? function(r, i, s, o) {
    o === void 0 && (o = s);
    var a = Object.getOwnPropertyDescriptor(i, s);
    (!a || ("get" in a ? !i.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return i[s];
    } }), Object.defineProperty(r, o, a);
  } : function(r, i, s, o) {
    o === void 0 && (o = s), r[o] = i[s];
  }), n = Te && Te.__exportStar || function(r, i) {
    for (var s in r)
      s !== "default" && !Object.prototype.hasOwnProperty.call(i, s) && e(i, r, s);
  };
  Object.defineProperty(t, "__esModule", { value: !0 });
  /**
   * data-structure-typed
   *
   * @author Tyler Zeng
   * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
   * @license MIT License
   */
  n(un, t), n(mc, t), n(wc, t);
})(ac);
class kn {
  constructor() {
    pe(this, "graph");
    this.graph = new ac.DirectedGraph();
  }
  has(e) {
    return this.graph.hasVertex(e);
  }
  get(e) {
    return this.graph.getVertex(e);
  }
  add(e, n = null) {
    if (!this.graph.addVertex(e, n) && n !== null) {
      const i = this.graph.getVertex(e);
      i && (i.value = n);
    }
  }
  remove(e) {
    this.graph.removeManyVertices([e]);
  }
  connect(e, n) {
    const r = this.parseInput(n), i = this.parseInput(e);
    r.key !== i.key && (this.graph.hasEdge(i.key, r.key) || this.graph.hasEdge(r.key, i.key) || (this.add(i.key, i.value), this.add(r.key, r.value), this.graph.addEdge(i.key, r.key)));
  }
  getConnections(e) {
    return Array.from(this.graph.getDestinations(e)).map((n) => n.key);
  }
  getTopoSort() {
    var e;
    return ((e = this.graph.topologicalSort()) == null ? void 0 : e.map((n) => n.toString())) || [];
  }
  /**
   * because this graph can have value
   * either string or component with dataKey,
   * we have this utility to return the key
   *
   * @param v
   * @returns
   */
  parseInput(e) {
    return {
      key: typeof e == "string" ? e : e.dataKey,
      value: typeof e != "string" ? e : null
    };
  }
}
var Io = { exports: {} };
function I0(t) {
  try {
    return JSON.stringify(t);
  } catch {
    return '"[Circular]"';
  }
}
var P0 = D0;
function D0(t, e, n) {
  var r = n && n.stringify || I0, i = 1;
  if (typeof t == "object" && t !== null) {
    var s = e.length + i;
    if (s === 1)
      return t;
    var o = new Array(s);
    o[0] = r(t);
    for (var a = 1; a < s; a++)
      o[a] = r(e[a]);
    return o.join(" ");
  }
  if (typeof t != "string")
    return t;
  var l = e.length;
  if (l === 0)
    return t;
  for (var c = "", u = 1 - i, f = -1, h = t && t.length || 0, m = 0; m < h; ) {
    if (t.charCodeAt(m) === 37 && m + 1 < h) {
      switch (f = f > -1 ? f : 0, t.charCodeAt(m + 1)) {
        case 100:
        case 102:
          if (u >= l || e[u] == null)
            break;
          f < m && (c += t.slice(f, m)), c += Number(e[u]), f = m + 2, m++;
          break;
        case 105:
          if (u >= l || e[u] == null)
            break;
          f < m && (c += t.slice(f, m)), c += Math.floor(Number(e[u])), f = m + 2, m++;
          break;
        case 79:
        case 111:
        case 106:
          if (u >= l || e[u] === void 0)
            break;
          f < m && (c += t.slice(f, m));
          var w = typeof e[u];
          if (w === "string") {
            c += "'" + e[u] + "'", f = m + 2, m++;
            break;
          }
          if (w === "function") {
            c += e[u].name || "<anonymous>", f = m + 2, m++;
            break;
          }
          c += r(e[u]), f = m + 2, m++;
          break;
        case 115:
          if (u >= l)
            break;
          f < m && (c += t.slice(f, m)), c += String(e[u]), f = m + 2, m++;
          break;
        case 37:
          f < m && (c += t.slice(f, m)), c += "%", f = m + 2, m++, u--;
          break;
      }
      ++u;
    }
    ++m;
  }
  return f === -1 ? t : (f < h && (c += t.slice(f)), c);
}
const fa = P0;
Io.exports = Xt;
const Wr = U0().console || {}, $0 = {
  mapHttpRequest: di,
  mapHttpResponse: di,
  wrapRequestSerializer: Ss,
  wrapResponseSerializer: Ss,
  wrapErrorSerializer: Ss,
  req: di,
  res: di,
  err: ga,
  errWithCause: ga
};
function $i(t, e) {
  return t === "silent" ? 1 / 0 : e.levels.values[t];
}
const Po = Symbol("pino.logFuncs"), no = Symbol("pino.hierarchy"), T0 = {
  error: "log",
  fatal: "error",
  warn: "error",
  info: "log",
  debug: "log",
  trace: "log"
};
function ha(t, e) {
  const n = {
    logger: e,
    parent: t[no]
  };
  e[no] = n;
}
function A0(t, e, n) {
  const r = {};
  e.forEach((i) => {
    r[i] = n[i] ? n[i] : Wr[i] || Wr[T0[i] || "log"] || Hr;
  }), t[Po] = r;
}
function L0(t, e) {
  return Array.isArray(t) ? t.filter(function(r) {
    return r !== "!stdSerializers.err";
  }) : t === !0 ? Object.keys(e) : !1;
}
function Xt(t) {
  t = t || {}, t.browser = t.browser || {};
  const e = t.browser.transmit;
  if (e && typeof e.send != "function")
    throw Error("pino: transmit option must have a send function");
  const n = t.browser.write || Wr;
  t.browser.write && (t.browser.asObject = !0);
  const r = t.serializers || {}, i = L0(t.browser.serialize, r);
  let s = t.browser.serialize;
  Array.isArray(t.browser.serialize) && t.browser.serialize.indexOf("!stdSerializers.err") > -1 && (s = !1);
  const o = Object.keys(t.customLevels || {}), a = ["error", "fatal", "warn", "info", "debug", "trace"].concat(o);
  typeof n == "function" && a.forEach(function(g) {
    n[g] = n;
  }), (t.enabled === !1 || t.browser.disabled) && (t.level = "silent");
  const l = t.level || "info", c = Object.create(n);
  c.log || (c.log = Hr), A0(c, a, n), ha({}, c), Object.defineProperty(c, "levelVal", {
    get: f
  }), Object.defineProperty(c, "level", {
    get: h,
    set: m
  });
  const u = {
    transmit: e,
    serialize: i,
    asObject: t.browser.asObject,
    formatters: t.browser.formatters,
    levels: a,
    timestamp: j0(t)
  };
  c.levels = F0(t), c.level = l, c.setMaxListeners = c.getMaxListeners = c.emit = c.addListener = c.on = c.prependListener = c.once = c.prependOnceListener = c.removeListener = c.removeAllListeners = c.listeners = c.listenerCount = c.eventNames = c.write = c.flush = Hr, c.serializers = r, c._serialize = i, c._stdErrSerialize = s, c.child = w, e && (c._logEvent = ro());
  function f() {
    return $i(this.level, this);
  }
  function h() {
    return this._level;
  }
  function m(g) {
    if (g !== "silent" && !this.levels.values[g])
      throw Error("unknown level " + g);
    this._level = g, Cn(this, u, c, "error"), Cn(this, u, c, "fatal"), Cn(this, u, c, "warn"), Cn(this, u, c, "info"), Cn(this, u, c, "debug"), Cn(this, u, c, "trace"), o.forEach((p) => {
      Cn(this, u, c, p);
    });
  }
  function w(g, p) {
    if (!g)
      throw new Error("missing bindings for child Pino");
    p = p || {}, i && g.serializers && (p.serializers = g.serializers);
    const v = p.serializers;
    if (i && v) {
      var b = Object.assign({}, r, v), C = t.browser.serialize === !0 ? Object.keys(b) : i;
      delete g.serializers, ns([g], C, b, this._stdErrSerialize);
    }
    function _(F) {
      this._childLevel = (F._childLevel | 0) + 1, this.bindings = g, b && (this.serializers = b, this._serialize = C), e && (this._logEvent = ro(
        [].concat(F._logEvent.bindings, g)
      ));
    }
    _.prototype = this;
    const E = new _(this);
    return ha(this, E), E.level = this.level, E;
  }
  return c;
}
function F0(t) {
  const e = t.customLevels || {}, n = Object.assign({}, Xt.levels.values, e), r = Object.assign({}, Xt.levels.labels, z0(e));
  return {
    values: n,
    labels: r
  };
}
function z0(t) {
  const e = {};
  return Object.keys(t).forEach(function(n) {
    e[t[n]] = n;
  }), e;
}
Xt.levels = {
  values: {
    fatal: 60,
    error: 50,
    warn: 40,
    info: 30,
    debug: 20,
    trace: 10
  },
  labels: {
    10: "trace",
    20: "debug",
    30: "info",
    40: "warn",
    50: "error",
    60: "fatal"
  }
};
Xt.stdSerializers = $0;
Xt.stdTimeFunctions = Object.assign({}, { nullTime: pc, epochTime: vc, unixTime: W0, isoTime: H0 });
function R0(t) {
  const e = [];
  t.bindings && e.push(t.bindings);
  let n = t[no];
  for (; n.parent; )
    n = n.parent, n.logger.bindings && e.push(n.logger.bindings);
  return e.reverse();
}
function Cn(t, e, n, r) {
  if (Object.defineProperty(t, r, {
    value: $i(t.level, n) > $i(r, n) ? Hr : n[Po][r],
    writable: !0,
    enumerable: !0,
    configurable: !0
  }), !e.transmit && t[r] === Hr)
    return;
  t[r] = N0(t, e, n, r);
  const i = R0(t);
  i.length !== 0 && (t[r] = V0(i, t[r]));
}
function V0(t, e) {
  return function() {
    return e.apply(this, [...t, ...arguments]);
  };
}
function N0(t, e, n, r) {
  return /* @__PURE__ */ function(i) {
    return function() {
      const o = e.timestamp(), a = new Array(arguments.length), l = Object.getPrototypeOf && Object.getPrototypeOf(this) === Wr ? Wr : this;
      for (var c = 0; c < a.length; c++)
        a[c] = arguments[c];
      if (e.serialize && !e.asObject && ns(a, this._serialize, this.serializers, this._stdErrSerialize), e.asObject || e.formatters ? i.call(l, K0(this, r, a, o, e.formatters)) : i.apply(l, a), e.transmit) {
        const u = e.transmit.level || t._level, f = n.levels.values[u], h = n.levels.values[r];
        if (h < f)
          return;
        B0(this, {
          ts: o,
          methodLevel: r,
          methodValue: h,
          transmitLevel: u,
          transmitValue: n.levels.values[e.transmit.level || t._level],
          send: e.transmit.send,
          val: $i(t._level, n)
        }, a);
      }
    };
  }(t[Po][r]);
}
function K0(t, e, n, r, i = {}) {
  const {
    level: s = () => t.levels.values[e],
    log: o = (h) => h
  } = i;
  t._serialize && ns(n, t._serialize, t.serializers, t._stdErrSerialize);
  const a = n.slice();
  let l = a[0];
  const c = {};
  r && (c.time = r), c.level = s(e, t.levels.values[e]);
  let u = (t._childLevel | 0) + 1;
  if (u < 1 && (u = 1), l !== null && typeof l == "object") {
    for (; u-- && typeof a[0] == "object"; )
      Object.assign(c, a.shift());
    l = a.length ? fa(a.shift(), a) : void 0;
  } else
    typeof l == "string" && (l = fa(a.shift(), a));
  return l !== void 0 && (c.msg = l), o(c);
}
function ns(t, e, n, r) {
  for (const i in t)
    if (r && t[i] instanceof Error)
      t[i] = Xt.stdSerializers.err(t[i]);
    else if (typeof t[i] == "object" && !Array.isArray(t[i]))
      for (const s in t[i])
        e && e.indexOf(s) > -1 && s in n && (t[i][s] = n[s](t[i][s]));
}
function B0(t, e, n) {
  const r = e.send, i = e.ts, s = e.methodLevel, o = e.methodValue, a = e.val, l = t._logEvent.bindings;
  ns(
    n,
    t._serialize || Object.keys(t.serializers),
    t.serializers,
    t._stdErrSerialize === void 0 ? !0 : t._stdErrSerialize
  ), t._logEvent.ts = i, t._logEvent.messages = n.filter(function(c) {
    return l.indexOf(c) === -1;
  }), t._logEvent.level.label = s, t._logEvent.level.value = o, r(s, t._logEvent, a), t._logEvent = ro(l);
}
function ro(t) {
  return {
    ts: 0,
    messages: [],
    bindings: t || [],
    level: { label: "", value: 0 }
  };
}
function ga(t) {
  const e = {
    type: t.constructor.name,
    msg: t.message,
    stack: t.stack
  };
  for (const n in t)
    e[n] === void 0 && (e[n] = t[n]);
  return e;
}
function j0(t) {
  return typeof t.timestamp == "function" ? t.timestamp : t.timestamp === !1 ? pc : vc;
}
function di() {
  return {};
}
function Ss(t) {
  return t;
}
function Hr() {
}
function pc() {
  return !1;
}
function vc() {
  return Date.now();
}
function W0() {
  return Math.round(Date.now() / 1e3);
}
function H0() {
  return new Date(Date.now()).toISOString();
}
function U0() {
  function t(e) {
    return typeof e < "u" && e;
  }
  try {
    return typeof globalThis < "u" || Object.defineProperty(Object.prototype, "globalThis", {
      get: function() {
        return delete Object.prototype.globalThis, this.globalThis = this;
      },
      configurable: !0
    }), globalThis;
  } catch {
    return t(self) || t(window) || t(this) || {};
  }
}
Io.exports.default = Xt;
var q0 = Io.exports.pino = Xt;
const G0 = (t) => ({
  user: t.user,
  template: et(t.template, [
    "id",
    "version",
    "title",
    "acronym",
    "description",
    "forceSubmit"
  ]),
  validation: et(t.validation || {}, [
    "version",
    "dataKey",
    "description"
  ]),
  response: et(t.response || {}, ["createdAt", "createdBy"])
}), Y0 = (t, e, n = !1) => {
  var r, i;
  return {
    dataKey: "",
    description: "",
    answers: t,
    templateDataKey: e.template.dataKey,
    templateVersion: e.template.version,
    validationVersion: e.validation.version,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedBy: ((r = e.user) == null ? void 0 : r.username) || "enumerator",
    createdAt: e.response.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
    createdBy: e.response.createdBy || ((i = e.user) == null ? void 0 : i.username) || "",
    isForceSubmit: n
  };
}, X0 = (t) => ({
  dataKey: "",
  notes: t
}), Q0 = (t, e) => {
  var n, r;
  return {
    principals: t.sort((i, s) => i.principal - s.principal),
    templateDataKey: e.template.dataKey,
    templateVersion: e.template.version,
    validationVersion: e.validation.version,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedBy: ((n = e.user) == null ? void 0 : n.username) || "enumerator",
    createdAt: e.response.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
    createdBy: e.response.createdBy || ((r = e.user) == null ? void 0 : r.username) || ""
  };
}, J0 = (t, e) => {
  if (!t)
    return { params: [], config: {} };
  const n = t.parentCondition.map((i) => {
    const s = e(i.value);
    return { key: i.key, value: s ?? "" };
  });
  return {
    config: t0(t, [
      "parentCondition"
    ]),
    params: n
  };
};
function ma(t) {
  return t.type > 10;
}
function io(t) {
  return t.answer === null || t.answer === void 0 || t.answer === "" || Array.isArray(t.answer) && (t.answer.length === 0 || t.answer.every((e) => e === null)) ? !0 : t.type === ie.ListTextInputRepeat || t.type === ie.ListSelectInputRepeat ? t.answer.every((e) => e.value === 0 || e.value === "0") : !1;
}
function Z0(t) {
  return t.validationState === ct.Invalid;
}
function e2(t) {
  return t.validationState === ct.Warning;
}
function Ms(t) {
  return t.answer !== void 0 && t.type !== ie.NestedChild;
}
const t2 = (t) => {
  const e = /^((https?):\/\/)?(www.)?[a-z0-9]+(\.(com))+(\/.*)?$/;
  return t.length < 2083 && e.test(t);
}, bc = (t) => t === void 0 ? !0 : String(t).trim().length === 0, n2 = (t) => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(t), r2 = (t) => {
  const e = t.replace(/[^a-zA-Z0-9]/g, "").replace(
    /9+/g,
    (n) => n.length === 1 ? "\\d" : `\\d{${n.length}}`
  ).replace(
    /A+/g,
    (n) => n.length === 1 ? "[A-Za-z]" : `([A-Za-z]){${n.length}}`
  );
  return new RegExp(`^${e}$`);
}, i2 = (t) => t2(t.answer), s2 = (t) => bc(t.answer) ? !1 : !isNaN(Number(t.answer)), o2 = (t) => n2(t.answer), a2 = (t) => {
  var e;
  return ((e = t.answer) == null ? void 0 : e[0].url) !== void 0;
}, l2 = (t) => {
  var r, i;
  const e = ((r = t.answer) == null ? void 0 : r.length) || 0, n = (i = t.lengthInput) == null ? void 0 : i.minlength;
  return !(n !== void 0 && e < n);
}, c2 = (t) => {
  var r, i;
  const e = ((r = t.answer) == null ? void 0 : r.length) || 0, n = (i = t.lengthInput) == null ? void 0 : i.maxlength;
  return !(n !== void 0 && e > n);
}, u2 = (t) => r2(t.maskingFormat).test(t.answer), d2 = (t) => {
  var e;
  return !((t == null ? void 0 : t.answer) === void 0 || ((e = t.rangeInput) == null ? void 0 : e.min) !== void 0 && t.answer < t.rangeInput.min);
}, f2 = (t) => {
  var e;
  return !((t == null ? void 0 : t.answer) === void 0 || ((e = t.rangeInput) == null ? void 0 : e.max) !== void 0 && t.answer > t.rangeInput.max);
}, h2 = (t) => {
  var n;
  const e = (n = t.answer) == null ? void 0 : n[0].value.accuracy;
  return !(e === void 0 || t.minAccuracy !== void 0 && e > t.minAccuracy);
}, g2 = (t) => {
  var r, i;
  const e = (r = t.answer) == null ? void 0 : r.find((s) => s.open), n = (i = t.options) == null ? void 0 : i.find((s) => s.open);
  return e === void 0 || ec(n == null ? void 0 : n.label, e.label) ? !0 : !bc(e.label);
}, m2 = [
  {
    function: i2,
    message: "invalid.url",
    inputModes: [_s.Url],
    inputTypes: [ie.UrlInput]
  },
  {
    function: o2,
    message: "invalid.email",
    inputTypes: [ie.EmailInput],
    inputModes: [_s.Email]
  },
  {
    function: a2,
    message: "file.not.uploaded.yet",
    inputTypes: [ie.FileInput, ie.PhotoInput]
  },
  {
    function: s2,
    message: "invalid.number",
    inputModes: [_s.Numeric],
    inputTypes: Object.values(Lr)
  },
  {
    function: l2,
    message: "invalid.length.min",
    params: ["lengthInput"],
    inputTypes: Object.values(Di)
  },
  {
    function: c2,
    message: "invalid.length.max",
    params: ["lengthInput"],
    inputTypes: Object.values(Di)
  },
  {
    function: u2,
    message: "invalid.mask",
    params: ["maskingFormat"],
    inputTypes: [ie.MaskingInput]
  },
  {
    function: d2,
    message: "invalid.min",
    params: ["rangeInput"],
    inputTypes: Object.values(Lr)
  },
  {
    function: f2,
    message: "invalid.max",
    params: ["rangeInput"],
    inputTypes: Object.values(Lr)
  },
  {
    function: h2,
    message: "invalid.gps",
    params: ["minAccuracy"],
    inputTypes: [ie.GpsInput]
  },
  {
    function: g2,
    message: "required.open",
    params: ["answer", "options"],
    inputTypes: [
      ...Object.values(_o),
      ...Object.values(So)
    ]
  }
], yc = (t) => m2.filter(
  (e) => {
    var n, r;
    return ((n = e.inputTypes) == null ? void 0 : n.includes(t.type)) || ((r = e.inputModes) == null ? void 0 : r.includes(t.inputMode ?? "text"));
  }
), w2 = (t) => yc(t).length || t.required || t.inputMode !== void 0;
class p2 {
  constructor(e) {
    pe(this, "component");
    pe(this, "expressions");
    pe(this, "evaluateFn");
    pe(this, "callbackFn");
    pe(this, "validationResult", {
      validationState: ct.Valid,
      validationMessage: [],
      validationParams: {}
    });
    this.component = e.component, this.expressions = e.expressions, this.evaluateFn = e.evaluateFn, this.callbackFn = e.callbackFn;
  }
  validateAll() {
    this.validateRequired(!1), this.validateRules(!1), this.callbackFn(this.validationResult);
  }
  /**
   * Set validation result
   *
   * @param {ValidationResult} validationResult
   */
  setValidationResult(e) {
    var n;
    (n = this.validationResult.validationMessage) == null || n.push(
      ...e.validationMessage ?? []
    ), this.validationResult.validationParams = {
      ...this.validationResult.validationParams,
      ...e.validationParams
    }, this.validationResult.validationState !== ct.Invalid && (this.validationResult.validationState = e.validationState);
  }
  validateRules(e = !0) {
    var n;
    (n = this.component.remarks) != null && n.length || (this.validateComponent(), this.validateTemplate()), e && this.callbackFn(this.validationResult);
  }
  /**
   * Validates the component itself
   *
   * @private
   * @returns {void}
   */
  validateComponent() {
    if (io(this.component))
      return;
    const e = yc(this.component);
    if (e != null && e.length)
      for (const n of e)
        n.function(
          et(this.component, ["answer", ...n.params ?? []])
        ) || this.setValidationResult({
          validationState: ct.Invalid,
          validationMessage: [n.message],
          validationParams: et(
            this.component,
            n.params ?? []
          )
        });
  }
  /**
   * Validates component from template
   *
   * @returns {void}
   */
  validateTemplate() {
    for (const e of this.expressions) {
      if (!this.evaluateFn(e.test))
        continue;
      const r = {
        validationState: e.type === sc.Error ? ct.Invalid : ct.Warning,
        validationMessage: [e.message]
      };
      this.setValidationResult(r);
    }
  }
  /**
   * Validate for required component
   *
   * @returns {void}
   */
  validateRequired(e = !0) {
    if (io(this.component) && this.component.required && this.component.enable) {
      const n = {
        validationState: ct.Invalid,
        validationMessage: ["required"]
      };
      this.setValidationResult(n);
    }
    e && this.callbackFn(this.validationResult);
  }
}
const v2 = (t, e) => t ? typeof t == "string" ? t.includes("$") : t[e].includes("$") : !1, b2 = (t) => t.includes("getValue"), y2 = (t) => {
  if (!t)
    return [];
  const e = /@\$ROW\d*\$/g, n = t.match(e);
  return n || [];
}, x2 = (t) => {
  const e = t.match(/\d+/);
  if (!e)
    return [0];
  const n = [];
  for (let r = 0; r <= parseInt(e[0]); r++)
    n.push(r);
  return n;
}, fi = (t, e, n) => {
  const r = y2(t), i = {}, s = {};
  return r.forEach((o) => {
    if (i[o] !== void 0)
      return;
    const a = x2(o);
    let l = "";
    a.forEach((c) => {
      if (s[c] === void 0) {
        const u = n.getRowIndex(e, c);
        if (u === void 0)
          return;
        s[c] = u.toString();
      }
      l += "#" + s[c];
    }), i[o] = l;
  }), Object.keys(i).forEach((o) => {
    t = t.replaceAll(o, i[o]);
  }), Object.keys(s).forEach((o) => {
    t = t.replaceAll(
      `getRowIndex(${o})`,
      s[o]
    );
  }), { result: t, memo: s };
}, k2 = (t) => t.includes("#"), xc = (t) => t.split("#")[0], C2 = (t) => t.replace(xc(t), ""), ki = (t, e) => t + "#" + Number(e), _2 = (t, e) => ({
  dataKey: ki(t.dataKey, e.value),
  type: ie.NestedChild,
  label: e.label,
  components: [],
  enable: !0,
  answer: e,
  level: t.level + 1,
  disableInput: !1,
  disableInitial: !1,
  remarks: [],
  enableRemark: t.enableRemark,
  validationState: ct.Valid,
  validationMessage: []
}), S2 = [
  "dataKey",
  "presetMaster",
  "answer",
  "type",
  "inputMode",
  "isCapital",
  "required",
  "enable",
  "disableInput",
  "disableInitial",
  "isEditable",
  "label",
  "hint",
  "description",
  "remarks",
  "enableRemark",
  "level",
  "components",
  "updatedAt",
  "validationState",
  "validationMessage",
  "principal",
  "columnName",
  // from: select, dropdown, checkboxes
  "options",
  "typeOption",
  "sourceOption",
  // from: nested
  "sourceQuestion",
  // from: mask input, text input
  "maskingFormat",
  "prefix",
  "suffix",
  "rows",
  "rangeInput",
  "lengthInput",
  // from: file and photo input
  "accept",
  "maxFiles",
  "cols",
  // from: variable input
  "render",
  "renderType",
  // from: gps input
  "minAccuracy",
  // from: currency input
  "currency",
  // from: decimal input
  "decimalLength",
  // from: list repeat
  "isEditableList"
], M2 = (t) => et(t, S2), O2 = (t) => et(t, ["dataKey", "enableCondition", "componentEnable"]), E2 = (t) => et(t, ["dataKey", "expression", "componentVar"]), I2 = (t) => et(t, ["dataKey", "components", "sourceQuestion"]), P2 = (t) => et(t, ["dataKey", "sourceOption"]), D2 = (t) => et(t, ["dataKey", "validations"]), $2 = (t) => et(t, ["dataKey", "label", "labelVariable"]), T2 = (t) => et(t, ["dataKey", "sourceSelect"]), A2 = (t) => et(t, ["label", "description", "hint", "validations", "options"]), wa = (t) => Array.isArray(t[0]) ? t[0] : t, L2 = (t) => r0(
  t,
  (e) => Array.isArray(e) ? e[0] : e,
  ["sourceSelect", "rangeInput", "lengthInput"]
), pa = (t, e) => {
  const n = [], r = (i) => {
    for (const s of i)
      s.enable !== !1 && (n.push(e(s)), s.components && r(s.components));
  };
  return r(t), n;
}, Wt = {
  createBase: M2,
  createEnable: O2,
  createNested: I2,
  createVariable: E2,
  createValidation: D2,
  createSourceOption: P2,
  createLabelVariable: $2,
  createLookup: T2,
  createLocale: A2
};
var Nt = /* @__PURE__ */ ((t) => (t[t.Open = 1] = "Open", t[t.Review = 2] = "Review", t[t.Close = 3] = "Close", t))(Nt || {}), kc = /* @__PURE__ */ ((t) => (t[t.Initial = 1] = "Initial", t[t.Prefilled = 2] = "Prefilled", t))(kc || {});
class F2 {
  constructor(e) {
    pe(this, "components");
    pe(this, "dictionary");
    pe(this, "config", {});
    pe(this, "meta");
    pe(this, "logger");
    pe(this, "locales", /* @__PURE__ */ new Map());
    pe(this, "temporary", {
      preset: {},
      remark: {},
      response: {},
      validations: {}
    });
    pe(this, "principals");
    pe(this, "localeComponents", /* @__PURE__ */ new Map());
    /**
     * graph database
     */
    pe(this, "graphEnablingComponent");
    pe(this, "graphVariableComponent");
    pe(this, "graphNestedComponent");
    pe(this, "graphSourceOptionComponent");
    pe(this, "graphValidationComponent");
    pe(this, "graphLabelVariableComponent");
    pe(this, "graphLookupComponent");
    /**
     * gret external data from principals
     *
     * @param dataTypes
     * @returns
     */
    pe(this, "getPrincipalCollection", (e) => {
      const n = {};
      return e.forEach((r) => {
        n[r] = this.principals.map((i) => i[r]);
      }), n;
    });
    this.config = {
      locale: e.locale ?? "en",
      formMode: e.formMode ?? 1,
      initialMode: e.initialMode ?? 1
      /* Initial */
    }, this.logger = q0({
      enabled: !!e.debug,
      browser: e.debug ? {
        transmit: {
          send: async (n, r) => {
            var i;
            return (i = e.logger) == null ? void 0 : i.call(e, {
              level: n,
              time: r.ts,
              message: r.messages[0]
            });
          }
        }
      } : void 0
    }), this.meta = G0(e), this.principals = e.principals || [], Zs.importDefaultLocales().forEach((n, r) => {
      this.locales.set(r, { ...this.locales.get(r), ...n });
    }), this.components = [], this.dictionary = {}, this.graphEnablingComponent = new kn(), this.graphVariableComponent = new kn(), this.graphNestedComponent = new kn(), this.graphSourceOptionComponent = new kn(), this.graphValidationComponent = new kn(), this.graphLabelVariableComponent = new kn(), this.graphLookupComponent = new kn(), this.logger.info("engine starting..."), console.time("total"), this.loadTemporaryData(e), this.loadTemplate(e), this.runDependentComponents("nested"), this.runDependentComponents("variable"), this.runDependentComponents("enabling"), this.runDependentComponents("source-option"), this.runDependentComponents("label-variable"), this.config.formMode === 2 && this.runDependentComponents("validation"), this.logger.info("components", this.components), this.logger.info("dictionary", this.dictionary), console.timeEnd("total");
  }
  /**
   * Sets the language for the application.
   *
   * @param {Lang} lang - The language to set.
   */
  setLang(e) {
    this.config.locale = e, this.runDependentComponents("label-variable");
  }
  /**
   * Loads a locale into the language map.
   *
   * @param {Lang} lang - The language key.
   * @param {Locale} locale - The locale to load.
   */
  loadLocale(e, n) {
    this.locales.set(e, { ...this.locales.get(e), ...n });
  }
  /**
   * Translates the given key or LocaleText using the configured locale.
   *
   * @param {string | LocaleText} key - The key or LocaleText to be translated.
   */
  translate(e, n) {
    if (!e)
      return "";
    const r = this.config.locale ?? "en";
    return Zs.t(e, this.locales.get(r), r, n);
  }
  /**
   * we keep the data first, so we can't add later to
   * tree component
   *
   * @param input
   */
  loadTemporaryData(e) {
    var n, r, i;
    this.logger.info("looping preset, data, validations, and remarks..."), e.preset && ((n = e.preset.predata) == null || n.forEach((s) => {
      this.temporary.preset[s.dataKey] = s.answer;
    })), e.response && ((r = e.response.answers) == null || r.forEach((s) => {
      this.temporary.response[s.dataKey] = s.answer;
    })), e.remark && ((i = e.remark.notes) == null || i.forEach((s) => {
      this.temporary.remark[s.dataKey] = s.comments;
    })), e.validation && e.validation.testFunctions.forEach((s) => {
      this.temporary.validations[s.dataKey] = s.validations;
    });
  }
  /**
   * A template, or questionnaire template, serves as the
   * backbone of the form. We build a component tree based
   * on the template configuration.
   *
   * this function, generate components tree and graph for
   * relationship between component, by nested components,
   * by enabling components, by sources.
   */
  loadTemplate(e) {
    this.logger.info("looping template...."), this.loopComponents(e.template.components, []);
  }
  /**
   * loop throught components array
   *
   * @param components
   * @param idxs
   */
  loopComponents(e, n) {
    e = wa(e);
    for (let r = 0; r < e.length; r++) {
      const i = [...n, r], s = e[r];
      s.level = n.length, this.constructComponent(i, s);
    }
  }
  /**
   * we doing magic here, need more explanations
   *
   * @param indexes
   * @param component
   */
  constructComponent(e, n) {
    var h, m, w;
    n = L2(n);
    const r = this.config.initialMode === 2 || this.config.initialMode === 1 && n.presetMaster;
    this.temporary.preset[n.dataKey] !== void 0 && r && (n.answer = this.temporary.preset[n.dataKey], delete this.temporary.preset[n.dataKey]), this.temporary.response[n.dataKey] !== void 0 && (n.answer = this.temporary.response[n.dataKey], delete this.temporary.response[n.dataKey]), n.enableRemark && this.temporary.remark[n.dataKey] !== void 0 && (n.remarks = this.temporary.remark[n.dataKey], delete this.temporary.remark[n.dataKey]), n.enable = !0;
    const i = n.components ? wa(
      n.components
    ) : [];
    n.components = i;
    const s = Wt.createBase(n), o = Wt.createLocale(n);
    this.localeComponents.set(n.dataKey, o), this.setComponentByIndex(e, s), this.dictionary[n.dataKey] = e, n.type === ie.NestedInput && this.setComponentProperty(n.dataKey, { components: [] });
    const a = Wt.createEnable(n), l = this.extractExpressionDependencies(
      a.dataKey,
      a.enableCondition
    );
    if (a.componentEnable = l.dependencies, a.enableCondition = l.code, this.graphEnablingComponent.add(n.dataKey, a), (h = a.componentEnable) == null || h.forEach((g) => {
      this.graphEnablingComponent.connect(g, a);
    }), n.type === ie.VariableInput) {
      const g = Wt.createVariable(n), p = this.extractExpressionDependencies(
        g.dataKey,
        g.expression
      );
      g.expression = p.code, g.componentVar = p.dependencies, this.graphVariableComponent.add(
        g.dataKey,
        g
      ), (m = g.componentVar) != null && m.length || this.runVariable(g.dataKey), g.componentVar.forEach((v) => {
        this.graphVariableComponent.connect(v, g);
      });
    }
    if (n.type === ie.NestedInput) {
      const g = fi(
        n.sourceQuestion,
        n.dataKey,
        { getRowIndex: this.getRowIndex.bind(this) }
      );
      this.setComponentProperty(n.dataKey, {
        sourceQuestion: g.result
      }), n.sourceQuestion = g.result;
      const p = Wt.createNested(n);
      this.graphNestedComponent.add(p.dataKey, p), p.sourceQuestion && this.graphNestedComponent.connect(
        p.sourceQuestion,
        p.dataKey
      ), n.components = [];
    }
    if (v2(n.label, this.config.locale ?? "en")) {
      const g = Wt.createLabelVariable(n), p = /* @__PURE__ */ new Set();
      g.labelVariable = Cs(
        g.labelVariable ?? []
      ), (w = g.labelVariable) == null || w.forEach((v) => {
        if (!b2(v.value))
          return;
        const b = this.extractExpressionDependencies(
          g.dataKey,
          v.value
        );
        v.value = b.code, v.componentVar = b.dependencies, b.dependencies.forEach((C) => {
          p.add(C);
        });
      }), this.graphLabelVariableComponent.add(g.dataKey, g), p.forEach((v) => {
        this.graphLabelVariableComponent.connect(v, g);
      });
    }
    if (n.sourceOption) {
      const g = fi(n.sourceOption, n.dataKey, {
        getRowIndex: this.getRowIndex.bind(this)
      });
      this.setComponentProperty(n.dataKey, {
        sourceOption: g.result
      });
      const p = Wt.createSourceOption(n);
      this.graphSourceOptionComponent.add(
        n.dataKey,
        p
      ), this.graphSourceOptionComponent.connect(
        g.result,
        p
      );
    }
    let c = [];
    if (!k2(n.dataKey))
      this.temporary.validations[n.dataKey] && (c = Cs(
        this.temporary.validations[n.dataKey]
      ), delete this.temporary.validations[n.dataKey]);
    else {
      const g = xc(n.dataKey);
      this.temporary.validations[g] && (c = Cs(this.temporary.validations[g]));
    }
    const u = /* @__PURE__ */ new Set();
    c == null || c.forEach((g) => {
      const p = this.extractExpressionDependencies(
        n.dataKey,
        g.test
      );
      g.test = p.code, p.dependencies.forEach((v) => {
        u.add(v);
      });
    }), n.validations = c ?? [];
    const f = Wt.createValidation(n);
    this.graphValidationComponent.add(n.dataKey, {
      dataKey: f.dataKey,
      validations: f.validations
    });
    for (const g of u)
      this.graphValidationComponent.connect(g, f);
    if (n.sourceSelect) {
      const g = Array.isArray(n.sourceSelect) ? n.sourceSelect[0] : n.sourceSelect;
      g.parentCondition = g.parentCondition.map(
        (v) => {
          const b = fi(v.value, n.dataKey, {
            getRowIndex: this.getRowIndex.bind(this)
          });
          return {
            ...v,
            value: b.result
          };
        }
      ), this.setComponentProperty(n.dataKey, {
        sourceSelect: g
      });
      const p = Wt.createLookup(n);
      this.graphLookupComponent.add(n.dataKey, p);
      for (const v of g.parentCondition)
        this.graphLookupComponent.connect(
          v.value,
          p
        );
    }
    n.type === ie.Section && this.loopComponents(i ?? [], e);
  }
  /**
   * custom "safe" eval code
   *
   * @param code
   */
  evalInContext(e, n) {
    try {
      const r = {};
      for (const s in this)
        r[s] = void 0;
      return r.getValue = this.getAnswer.bind(this), r.getPrincipalCollection = this.getPrincipalCollection.bind(this), r.getRowIndex = (s) => this.getRowIndex(e, s), new Function(
        "with(this) { return eval(`" + n + "`); }"
      ).call(r);
    } catch (r) {
      r instanceof Error && this.logger.warn(`eval error ${e} : ${r.message} 
${n}`);
    }
  }
  evalAndUpdateDependencies(e, n, r) {
    const i = this.extractExpressionDependencies(e, n), s = this.getGraphByType(r);
    for (const o of i.dependencies)
      s.connect(o, e);
    return i.result;
  }
  /**
   *
   * @param dataKey
   * @param level
   * @returns
   */
  getRowIndex(e, n) {
    var a;
    const r = this.dictionary[e] || [];
    let i, s = 0, o = this.components;
    for (const l of r) {
      if (o[l].type === ie.NestedChild && (s++, i = Number((a = o[l].answer) == null ? void 0 : a.value)), s > n)
        break;
      o = o[l].components;
    }
    return i;
  }
  /**
   * it's magic
   *
   * @param dataKey
   * @param code
   * @returns
   */
  extractExpressionDependencies(e, n) {
    const r = /* @__PURE__ */ new Set();
    let i = n;
    try {
      const s = fi(n, e, {
        getRowIndex: this.getRowIndex.bind(this)
      });
      i = s.result;
      const o = {};
      for (const l in this)
        o[l] = void 0;
      o.getValue = (l) => (r.add(l), this.getAnswer(l)), o.getRowIndex = (l) => {
        if (s.memo[l] === void 0) {
          const c = this.getRowIndex(e, l);
          c && (s.memo[l] = c.toString());
        }
        return i = i.replaceAll(
          `getRowIndex(${l})`,
          s.memo[l]
        ), s.memo[l];
      }, o.getPrincipalCollection = this.getPrincipalCollection.bind(this);
      const a = new Function(
        "with(this) { return eval(`" + i + "`); }"
      ).call(o);
      return {
        code: i,
        dependencies: [...r],
        result: a
      };
    } catch (s) {
      return s instanceof Error && this.logger.warn(`eval error ${e} : ${s.message} 
${n}`), {
        code: i,
        dependencies: [...r]
      };
    }
  }
  /**
   * get current component tree by dataKey, component index is stored
   * in dictionary as hash table to access the component tree blazingly fast
   *
   * @param dataKey
   * @returns
   */
  getComponent(e) {
    const n = this.dictionary[e];
    return n ? this.getComponentByIndex(n) : void 0;
  }
  /**
   * get parent component of any datakey
   *
   * @param dataKey
   * @returns
   */
  getParentComponent(e) {
    const n = this.dictionary[e];
    return !n || n.length === 1 ? void 0 : this.getComponentByIndex(n.slice(0, -1));
  }
  /**
   *
   * @param dataKey
   * @returns
   */
  getSection(e) {
    let n = this.getParentComponent(e);
    if (n) {
      for (; n.type !== ie.Section; )
        n = this.getParentComponent(n.dataKey) ?? n;
      return n;
    }
  }
  /**
   * get adjacent component from dataKey
   *
   * @param dataKey
   * @param position
   * @returns
   */
  getAdjacentComponent(e, n = "next") {
    const r = this.dictionary[e], i = n0(r, n);
    return this.getComponentByIndex(i);
  }
  /**
   * Retrieves the dependants of the given data key of the specified type.
   *
   * @param {string} dataKey - the key of the data
   * @param {DependentType} type - the type of dependants
   * @return {Component[] | undefined} the dependant components or undefined
   */
  getDependantComponents(e, n) {
    const r = this.getGraphByType(n);
    return !this.getComponent(e) || !r ? [] : r.getConnections(e).map((s) => this.getComponent(s.toString())).filter((s) => s !== void 0);
  }
  /**
   * recursive loop to acess the component tree by
   * given indexes
   *
   * @param indexes
   * @param components
   * @returns
   */
  getComponentByIndex(e, n = this.components) {
    if (!e.length)
      return;
    const r = n[e[0]];
    if (r)
      return e.length > 1 ? this.getComponentByIndex(e.slice(1), r.components) : r;
  }
  /**
   * update tree nodes in given indexes
   *
   * @param indexes
   * @param component
   */
  setComponentByIndex(e, n) {
    let r = this.components;
    for (let i = 0; i < e.length; i++) {
      const s = e[i];
      i === e.length - 1 && r && (r[s] = n), i < e.length - 1 && (r = r[s].components);
    }
  }
  /**
   * Sets property of certain component
   * by dataKey.
   *
   * @param {string} dataKey
   * @param {Partial<Component>} property
   * @returns
   */
  setComponentProperty(e, n) {
    const r = this.getComponent(e);
    if (!r)
      return;
    const i = this.dictionary[e];
    this.setComponentByIndex(i, { ...r, ...n });
  }
  /**
   * get component's answers
   *
   * @param dataKey
   * @returns Answer
   */
  getAnswer(e) {
    var r;
    const n = this.getComponent(e);
    if (n && n.enable)
      return (r = this.getComponent(e)) == null ? void 0 : r.answer;
  }
  /**
   * get component's real value
   *
   * @param dataKey
   * @returns Answer
   */
  getValue(e) {
    var r;
    const n = this.getComponent(e);
    return Array.isArray(n == null ? void 0 : n.answer) ? (n == null ? void 0 : n.answer[0]).value : typeof (n == null ? void 0 : n.answer) == "object" ? (r = n == null ? void 0 : n.answer) == null ? void 0 : r.value : n == null ? void 0 : n.answer;
  }
  /**
   * Saves an answer for a given data key.
   * All components that are dependent on the data key
   * will be re-evaluated.
   *
   * @param {string} dataKey - The key of the data to save the answer for.
   * @param {Answer} answer - The answer to save.
   */
  saveAnswer(e, n) {
    const r = this.getComponent(e);
    if (!r)
      return;
    const i = (/* @__PURE__ */ new Date()).getTime();
    this.setComponentProperty(e, {
      answer: n,
      updatedAt: i,
      createdAt: r.createdAt ?? i
    }), this.logger.info(`saving answer for ${e}`), this.runValidation(e, "all"), this.runEnabling(e), this.runDependentComponents("nested", e), this.runDependentComponents("variable", e), this.runDependentComponents("enabling", e), this.runDependentComponents("validation", e), this.runDependentComponents("source-option", e), this.runDependentComponents("label-variable", e), this.runDependentComponents("lookup", e);
  }
  /**
   * Adds a remark to the component identified by the given data key.
   *
   * @param {string} dataKey - The key to identify the component.
   * @param {Omit<RemarkContent, "sender">} remark - The remark to be added.
   */
  addRemark(e, n) {
    var i;
    const r = this.getComponent(e);
    r && (r.remarks || (r.remarks = []), r.remarks.push({
      ...n,
      sender: ((i = this.meta.user) == null ? void 0 : i.username) || "anonymous"
    }), this.runValidation(e));
  }
  /**
   * Runs all enabling components in the form.
   * The enabling components are the components
   * that are dependent on each other.
   */
  runDependentComponents(e, n) {
    const r = this.getGraphByType(e);
    if (r === void 0)
      return;
    const i = n ? r.getConnections(n) : r.getTopoSort();
    this.logger.info(
      `trigger ${e} from ${n || "root"} for ${i.length} components`
    );
    for (const s of i) {
      const o = s.toString();
      e === "nested" && this.runNested(o), e === "lookup" && this.runLookup(o), e === "variable" && this.runVariable(o), e === "enabling" && this.runEnabling(o), e === "validation" && this.runValidation(o), e === "source-option" && this.runSourceOption(o), e === "label-variable" && this.runLabelVariable(o);
    }
  }
  getGraphByType(e) {
    switch (e) {
      case "enabling":
        return this.graphEnablingComponent;
      case "validation":
        return this.graphValidationComponent;
      case "nested":
        return this.graphNestedComponent;
      case "variable":
        return this.graphVariableComponent;
      case "source-option":
        return this.graphSourceOptionComponent;
      case "label-variable":
        return this.graphLabelVariableComponent;
      case "lookup":
        return this.graphLookupComponent;
    }
  }
  /**
   * Runs the enable condition of certain component
   * by dataKey. The enable condition is an expression
   * that can be evaluated in the context of the
   * component. Then the result of the expression
   * is used to enable or disable the component.
   *
   *  @param {string} dataKey
   *  @returns
   */
  runEnabling(e) {
    var o, a;
    const n = this.getComponent(e), r = (a = (o = this.graphEnablingComponent.get(e)) == null ? void 0 : o.value) == null ? void 0 : a.enableCondition;
    if (!n || !r)
      return (n == null ? void 0 : n.enable) || !1;
    const i = this.evalAndUpdateDependencies(
      e,
      r || "",
      "enabling"
    ), s = Array.isArray(i) ? i.length > 0 : !!i;
    return this.setComponentProperty(e, { enable: s }), s;
  }
  /**
   * Runs the expression of certain component
   * by dataKey. The expression is an expression
   * that can be evaluated in the context of the
   * component. Then the result of the expression
   * is used to set the answer of the component.
   *
   * @param {string} dataKey
   * @returns
   */
  runVariable(e) {
    var s, o;
    const n = this.getComponent(e), r = (o = (s = this.graphVariableComponent.get(e)) == null ? void 0 : s.value) == null ? void 0 : o.expression;
    if (!n || !r)
      return;
    const i = this.evalAndUpdateDependencies(
      e,
      r ?? "",
      "variable"
    );
    return this.saveAnswer(e, i), i;
  }
  /**
   * Runs the validation of certain component
   * by dataKey. The validation is an expression
   * that can be evaluated in the context of the
   * component. Then the result of the expression
   * is used to set the validation state of the component.
   *
   * @param {string} dataKey
   * @param {"all" | "rules" | "required"} type - the type of validation to run.
   * default is "rules"
   */
  runValidation(e, n = "rules") {
    var o, a;
    const r = this.getComponent(e);
    if (!r)
      return;
    const i = ((a = (o = this.graphValidationComponent.get(e)) == null ? void 0 : o.value) == null ? void 0 : a.validations) ?? [];
    if (i.length === 0 && !w2(r))
      return;
    const s = {
      all: "validateAll",
      rules: "validateRules",
      required: "validateRequired"
    };
    new p2({
      component: r,
      expressions: i,
      evaluateFn: (l) => this.evalAndUpdateDependencies(e, l, "validation"),
      callbackFn: (l) => this.setComponentProperty(e, { ...l })
    })[s[n]]();
  }
  /**
   * Run the nested component of certain component
   * by dataKey.
   *
   * @param dataKey
   */
  runNested(e) {
    var o, a;
    const n = this.getComponent(e), r = (a = (o = this.graphNestedComponent.get(e)) == null ? void 0 : o.value) == null ? void 0 : a.sourceQuestion;
    if (!n || !r)
      return;
    let i = this.getAnswer(r);
    if (!i)
      return;
    !Array.isArray(i) && !Number.isNaN(Number(i)) && (i = Array(Number(i)).fill(0).map((l, c) => ({
      value: c + 1,
      label: (c + 1).toString()
    })));
    const s = [];
    for (const l of i)
      if (!(l.value === "0" || l.value === 0)) {
        for (const c of n.components || []) {
          const u = c.answer;
          if (l.value == (u == null ? void 0 : u.value) && c.enable) {
            const f = ki(
              n.dataKey,
              l.value
            );
            this.saveAnswer(f, l), this.setComponentProperty(f, {
              label: l.label
            }), s.push(l.value);
          }
        }
        s.includes(l.value) || this.insertNestedComponents(n.dataKey, l);
      }
    for (const l of n.components || []) {
      const c = l.answer;
      if (!c)
        return;
      i.every((u) => c.value !== u.value) && this.deleteNestedComponents(n.dataKey, c);
    }
  }
  /**
   *
   * @param dataKey
   * @returns
   */
  runSourceOption(e) {
    const n = this.getComponent(e);
    if (!n || !n.sourceOption)
      return;
    const r = this.getAnswer(
      n.sourceOption
    );
    if (!r)
      return;
    const i = r.map((s) => ({
      ...s,
      open: !1
    }));
    if (this.setComponentProperty(e, {
      options: i
    }), n.answer !== void 0) {
      const s = i.find(
        (o) => {
          var a;
          return o.value === ((a = n.answer) == null ? void 0 : a[0].value);
        }
      ) ? n.answer : void 0;
      this.saveAnswer(e, s);
    }
    return r;
  }
  /**
   * generate the value component from labels
   *
   * @param dataKey
   * @returns
   */
  runLabelVariable(e) {
    var s, o, a;
    const n = this.getComponent(e), r = (s = this.graphLabelVariableComponent.get(e)) == null ? void 0 : s.value;
    if (!n || !r || !r.label)
      return;
    let i = this.translate(r.label);
    if ((o = r.labelVariable) == null || o.forEach((l) => {
      const c = this.evalAndUpdateDependencies(
        e,
        l.value,
        "label-variable"
      );
      i = i.replaceAll(`$${l.variable}`, c || "");
    }), i.includes("$NAME$")) {
      const l = (a = this.getParentComponent(e)) == null ? void 0 : a.answer;
      i = i.replaceAll(
        "$NAME$",
        this.translate(l.label)
      );
    }
    this.setComponentProperty(e, { label: i });
  }
  /**
   * Run lookup component dependencies
   *
   * @param dataKey {string}
   */
  runLookup(e) {
    var i;
    const n = (i = this.graphLookupComponent.get(e)) == null ? void 0 : i.value;
    if (!n)
      return;
    const r = this.getComponent(n.dataKey);
    if (r) {
      if (r.answer === void 0) {
        this.setComponentProperty(r.dataKey, { answer: void 0 });
        return;
      }
      this.saveAnswer(r.dataKey, r.answer);
    }
  }
  /**
   * Get options from lookup.
   *
   * @param dataKey {string}
   */
  getLookupOptions(e, n) {
    const r = this.graphLookupComponent.get(e);
    if (!r || !r.value)
      return;
    const { config: i, params: s } = J0(
      r.value.sourceSelect,
      this.getValue.bind(this)
    );
    return n(i, s);
  }
  /**
   * Inserts new nested components into the components
   * property of the parent component.
   *
   * @param parent
   */
  insertNestedComponents(e, n) {
    var u, f, h;
    if (n.value === "0" || n.value === 0)
      return;
    const r = this.getComponent(e);
    if (!r)
      return;
    const i = ki(
      e,
      n.value
    );
    if (this.getComponent(i))
      return this.setComponentProperty(i, { enable: !0 });
    const o = (f = (u = this.graphNestedComponent.get(r.dataKey)) == null ? void 0 : u.value) == null ? void 0 : f.components;
    if (!o)
      return;
    const a = ((h = r.components) == null ? void 0 : h.length) ?? 0, l = [...this.dictionary[r.dataKey], a], c = _2(r, n);
    this.setComponentByIndex(l, c), this.dictionary[c.dataKey] = l;
    for (let m = 0; m < o.length; m++) {
      const w = {
        ...o[m]
      }, g = [...l, m];
      w.dataKey = w.dataKey + C2(c.dataKey), this.constructComponent(
        g,
        w
      ), this.graphEnablingComponent.connect(
        i,
        w.dataKey
      ), w.type === ie.VariableInput && this.graphVariableComponent.connect(
        i,
        w.dataKey
      ), w.type === ie.NestedInput && this.graphNestedComponent.connect(
        i,
        w.dataKey
      ), this.graphValidationComponent.connect(
        i,
        w.dataKey
      ), this.graphSourceOptionComponent.connect(
        i,
        w.dataKey
      ), this.graphLabelVariableComponent.connect(
        i,
        w.dataKey
      );
    }
    this.runDependentComponents("nested", i), this.runDependentComponents("variable", i), this.runDependentComponents("enabling", i), this.runDependentComponents("label-variable", i), this.runDependentComponents("source-option", i), this.config.formMode === 2 && this.runDependentComponents("validation", i);
  }
  /**
   * delete nested data by nested_key, or in others word
   * remove nested_key#1 (nested_key with nestedId 1). It can be
   * fully deletes or just soft delete from the tree. soft deletes
   * mean make it disabled.
   *
   * @param nestedDataKey
   * @param nestedAnswer
   * @param softDelete
   * @returns
   */
  deleteNestedComponents(e, n, r = !0) {
    if (!this.getComponent(e))
      return;
    const s = ki(
      e,
      Number(n.value)
    ), o = this.getComponent(s);
    if (o)
      if (r)
        this.setComponentProperty(s, { enable: !1 });
      else {
        for (const a of o.components ?? [])
          delete this.dictionary[a.dataKey];
        this.setComponentByIndex(this.dictionary[s], void 0), delete this.dictionary[s];
      }
  }
  /**
   * generate a summary of the answers.
   *
   * @return {Summary} A summary of the answers
   */
  getSummary() {
    const e = {
      answer: [],
      blank: [],
      error: [],
      warning: []
    };
    return pa(this.components, (n) => {
      var i;
      if (!ma(n))
        return;
      const r = et(n, [
        "label",
        "dataKey",
        "validationParams",
        "validationMessage"
      ]);
      r.section = ((i = this.getSection(n.dataKey)) == null ? void 0 : i.label) || "", Ms(n) && e.answer.push(r), io(n) && e.blank.push(r), Z0(n) && e.error.push(r), e2(n) && e.warning.push(r);
    }), e;
  }
  /**
   * generate output consisting of response, remark, and principal.
   * you can use this to save your data.
   *
   * @return {Output}
   */
  getOutput(e = !1) {
    const n = [], r = [], i = [];
    return pa(this.components, (s) => {
      var o;
      ma(s) && Ms(s) && n.push(
        et(s, [
          "dataKey",
          "answer",
          "updatedAt",
          "createdAt"
        ])
      ), (o = s.remarks) != null && o.length && r.push({
        dataKey: s.dataKey,
        comments: s.remarks
      }), s.principal && Ms(s) && i.push(
        et(s, [
          "dataKey",
          "answer",
          "principal",
          "columnName"
        ])
      );
    }), {
      response: Y0(n, this.meta, e),
      remark: X0(r),
      principal: Q0(i, this.meta)
    };
  }
  /**
   * you can call this function to check everything,
   * e.g validation before you submit the data.
   * after running this function, you can get the summary
   * to see error, blank, and warning list. also get the response
   * to submit
   */
  finalize() {
    for (const e of this.graphValidationComponent.getTopoSort())
      this.runValidation(e, "all");
  }
  /**
   * Checks if force submit is enabled.
   *
   * It evaluates the enable condition provided in the template
   * and returns true if it evaluates to true, otherwise false.
   *
   * @returns {boolean} - True if force submit is enabled, false otherwise.
   */
  isForceSubmitEnabled() {
    return this.meta.template.forceSubmit ? this.evalInContext(
      "",
      this.meta.template.forceSubmit.enableCondition
    ) : !1;
  }
  /**
   * Validate force submit.
   *
   * It evaluates the expression provided in the forceSubmit
   * configuration and returns true if it evaluates to true,
   * otherwise false.
   *
   * @returns {boolean} - True if force submit is valid, false otherwise.
   */
  validateForceSubmit() {
    return !this.meta.template.forceSubmit || !this.isForceSubmitEnabled() ? !1 : this.evalInContext("", this.meta.template.forceSubmit.expression);
  }
}
let ae;
const z2 = (t) => {
  ae = Yl(new F2(t)), Mt({
    activeDataKey: ae.components[0].dataKey
  }), r1(t.template.themeColor || {}), Xh(), ae.logger.info("create engine completed");
}, R2 = (t, e) => zt(() => ae.saveAnswer(t, e)), V2 = (t = !1) => {
  var e;
  if (ae.logger.info("submitting..."), t === !0) {
    if (!ae.validateForceSubmit())
      throw new Error(A((e = ae.meta.template.forceSubmit) == null ? void 0 : e.message));
  } else if (Rf(ae, Nf((n) => n.finalize())), ae.getSummary().error.length)
    throw new Error(A("submit.failed"));
  $e.emit("submit", ae.getOutput(t));
}, N2 = (t, e = "all") => {
  zt(() => ae.runValidation(t, e));
}, K2 = (t, e) => {
  zt(() => ae.getLookupOptions(t, e));
}, tn = () => (ae == null ? void 0 : ae.config.locale) ?? "en", va = (t, e) => zt(() => ae.loadLocale(t, e)), A = (t, e) => ae.translate(t, e);
function Ae(t) {
  const e = Object.prototype.toString.call(t);
  return t instanceof Date || typeof t == "object" && e === "[object Date]" ? new t.constructor(+t) : typeof t == "number" || e === "[object Number]" || typeof t == "string" || e === "[object String]" ? new Date(t) : /* @__PURE__ */ new Date(NaN);
}
function bt(t, e) {
  return t instanceof Date ? new t.constructor(e) : new Date(e);
}
function rs(t, e) {
  const n = Ae(t);
  return isNaN(e) ? bt(t, NaN) : (e && n.setDate(n.getDate() + e), n);
}
function B2(t, e) {
  const n = Ae(t);
  if (isNaN(e))
    return bt(t, NaN);
  if (!e)
    return n;
  const r = n.getDate(), i = bt(t, n.getTime());
  i.setMonth(n.getMonth() + e + 1, 0);
  const s = i.getDate();
  return r >= s ? i : (n.setFullYear(
    i.getFullYear(),
    i.getMonth(),
    r
  ), n);
}
function In(t, e) {
  const {
    years: n = 0,
    months: r = 0,
    weeks: i = 0,
    days: s = 0,
    hours: o = 0,
    minutes: a = 0,
    seconds: l = 0
  } = e, c = Ae(t), u = r || n ? B2(c, r + n * 12) : c, f = s || i ? rs(u, s + i * 7) : u, h = a + o * 60, w = (l + h * 60) * 1e3;
  return bt(t, f.getTime() + w);
}
const Cc = 6048e5, j2 = 864e5;
let W2 = {};
function Xr() {
  return W2;
}
function at(t, e) {
  var a, l, c, u;
  const n = Xr(), r = (e == null ? void 0 : e.weekStartsOn) ?? ((l = (a = e == null ? void 0 : e.locale) == null ? void 0 : a.options) == null ? void 0 : l.weekStartsOn) ?? n.weekStartsOn ?? ((u = (c = n.locale) == null ? void 0 : c.options) == null ? void 0 : u.weekStartsOn) ?? 0, i = Ae(t), s = i.getDay(), o = (s < r ? 7 : 0) + s - r;
  return i.setDate(i.getDate() - o), i.setHours(0, 0, 0, 0), i;
}
function Ti(t) {
  return at(t, { weekStartsOn: 1 });
}
function Do(t) {
  const e = Ae(t), n = e.getFullYear(), r = bt(t, 0);
  r.setFullYear(n + 1, 0, 4), r.setHours(0, 0, 0, 0);
  const i = Ti(r), s = bt(t, 0);
  s.setFullYear(n, 0, 4), s.setHours(0, 0, 0, 0);
  const o = Ti(s);
  return e.getTime() >= i.getTime() ? n + 1 : e.getTime() >= o.getTime() ? n : n - 1;
}
function Ai(t) {
  const e = Ae(t);
  return e.setHours(0, 0, 0, 0), e;
}
function ba(t) {
  const e = Ae(t), n = new Date(
    Date.UTC(
      e.getFullYear(),
      e.getMonth(),
      e.getDate(),
      e.getHours(),
      e.getMinutes(),
      e.getSeconds(),
      e.getMilliseconds()
    )
  );
  return n.setUTCFullYear(e.getFullYear()), +t - +n;
}
function H2(t, e) {
  const n = Ai(t), r = Ai(e), i = +n - ba(n), s = +r - ba(r);
  return Math.round((i - s) / j2);
}
function U2(t) {
  const e = Do(t), n = bt(t, 0);
  return n.setFullYear(e, 0, 4), n.setHours(0, 0, 0, 0), Ti(n);
}
function q2(t, e) {
  const n = e * 7;
  return rs(t, n);
}
function G2(t) {
  return bt(t, Date.now());
}
function _c(t, e) {
  const n = Ai(t), r = Ai(e);
  return +n == +r;
}
function Y2(t) {
  return t instanceof Date || typeof t == "object" && Object.prototype.toString.call(t) === "[object Date]";
}
function X2(t) {
  if (!Y2(t) && typeof t != "number")
    return !1;
  const e = Ae(t);
  return !isNaN(Number(e));
}
function Sc(t) {
  const e = Ae(t), n = e.getMonth();
  return e.setFullYear(e.getFullYear(), n + 1, 0), e.setHours(23, 59, 59, 999), e;
}
function Mc(t, e) {
  const n = Ae(t.start), r = Ae(t.end);
  let i = +n > +r;
  const s = i ? +n : +r, o = i ? r : n;
  o.setHours(0, 0, 0, 0);
  let a = 1;
  const l = [];
  for (; +o <= s; )
    l.push(Ae(o)), o.setDate(o.getDate() + a), o.setHours(0, 0, 0, 0);
  return i ? l.reverse() : l;
}
function Q2(t, e) {
  const n = Ae(t.start), r = Ae(t.end);
  let i = +n > +r;
  const s = at(i ? r : n, e), o = at(i ? n : r, e);
  s.setHours(15), o.setHours(15);
  const a = +o.getTime();
  let l = s, c = 1;
  const u = [];
  for (; +l <= a; )
    l.setHours(0), u.push(Ae(l)), l = q2(l, c), l.setHours(15);
  return i ? u.reverse() : u;
}
function ya(t) {
  const e = Ae(t);
  return e.setDate(1), e.setHours(0, 0, 0, 0), e;
}
function J2(t) {
  const e = Ae(t), n = bt(t, 0);
  return n.setFullYear(e.getFullYear(), 0, 1), n.setHours(0, 0, 0, 0), n;
}
function Oc(t, e) {
  var a, l;
  const n = Xr(), r = n.weekStartsOn ?? ((l = (a = n.locale) == null ? void 0 : a.options) == null ? void 0 : l.weekStartsOn) ?? 0, i = Ae(t), s = i.getDay(), o = (s < r ? -7 : 0) + 6 - (s - r);
  return i.setDate(i.getDate() + o), i.setHours(23, 59, 59, 999), i;
}
const Z2 = {
  lessThanXSeconds: {
    one: "less than a second",
    other: "less than {{count}} seconds"
  },
  xSeconds: {
    one: "1 second",
    other: "{{count}} seconds"
  },
  halfAMinute: "half a minute",
  lessThanXMinutes: {
    one: "less than a minute",
    other: "less than {{count}} minutes"
  },
  xMinutes: {
    one: "1 minute",
    other: "{{count}} minutes"
  },
  aboutXHours: {
    one: "about 1 hour",
    other: "about {{count}} hours"
  },
  xHours: {
    one: "1 hour",
    other: "{{count}} hours"
  },
  xDays: {
    one: "1 day",
    other: "{{count}} days"
  },
  aboutXWeeks: {
    one: "about 1 week",
    other: "about {{count}} weeks"
  },
  xWeeks: {
    one: "1 week",
    other: "{{count}} weeks"
  },
  aboutXMonths: {
    one: "about 1 month",
    other: "about {{count}} months"
  },
  xMonths: {
    one: "1 month",
    other: "{{count}} months"
  },
  aboutXYears: {
    one: "about 1 year",
    other: "about {{count}} years"
  },
  xYears: {
    one: "1 year",
    other: "{{count}} years"
  },
  overXYears: {
    one: "over 1 year",
    other: "over {{count}} years"
  },
  almostXYears: {
    one: "almost 1 year",
    other: "almost {{count}} years"
  }
}, eg = (t, e, n) => {
  let r;
  const i = Z2[t];
  return typeof i == "string" ? r = i : e === 1 ? r = i.one : r = i.other.replace("{{count}}", e.toString()), n != null && n.addSuffix ? n.comparison && n.comparison > 0 ? "in " + r : r + " ago" : r;
};
function qn(t) {
  return (e = {}) => {
    const n = e.width ? String(e.width) : t.defaultWidth;
    return t.formats[n] || t.formats[t.defaultWidth];
  };
}
const tg = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy"
}, ng = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
}, rg = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
}, ig = {
  date: qn({
    formats: tg,
    defaultWidth: "full"
  }),
  time: qn({
    formats: ng,
    defaultWidth: "full"
  }),
  dateTime: qn({
    formats: rg,
    defaultWidth: "full"
  })
}, sg = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: "P"
}, og = (t, e, n, r) => sg[t];
function Lt(t) {
  return (e, n) => {
    const r = n != null && n.context ? String(n.context) : "standalone";
    let i;
    if (r === "formatting" && t.formattingValues) {
      const o = t.defaultFormattingWidth || t.defaultWidth, a = n != null && n.width ? String(n.width) : o;
      i = t.formattingValues[a] || t.formattingValues[o];
    } else {
      const o = t.defaultWidth, a = n != null && n.width ? String(n.width) : t.defaultWidth;
      i = t.values[a] || t.values[o];
    }
    const s = t.argumentCallback ? t.argumentCallback(e) : e;
    return i[s];
  };
}
const ag = {
  narrow: ["B", "A"],
  abbreviated: ["BC", "AD"],
  wide: ["Before Christ", "Anno Domini"]
}, lg = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
}, cg = {
  narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
  abbreviated: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ],
  wide: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ]
}, ug = {
  narrow: ["S", "M", "T", "W", "T", "F", "S"],
  short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  wide: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ]
}, dg = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  }
}, fg = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  }
}, hg = (t, e) => {
  const n = Number(t), r = n % 100;
  if (r > 20 || r < 10)
    switch (r % 10) {
      case 1:
        return n + "st";
      case 2:
        return n + "nd";
      case 3:
        return n + "rd";
    }
  return n + "th";
}, gg = {
  ordinalNumber: hg,
  era: Lt({
    values: ag,
    defaultWidth: "wide"
  }),
  quarter: Lt({
    values: lg,
    defaultWidth: "wide",
    argumentCallback: (t) => t - 1
  }),
  month: Lt({
    values: cg,
    defaultWidth: "wide"
  }),
  day: Lt({
    values: ug,
    defaultWidth: "wide"
  }),
  dayPeriod: Lt({
    values: dg,
    defaultWidth: "wide",
    formattingValues: fg,
    defaultFormattingWidth: "wide"
  })
};
function Ft(t) {
  return (e, n = {}) => {
    const r = n.width, i = r && t.matchPatterns[r] || t.matchPatterns[t.defaultMatchWidth], s = e.match(i);
    if (!s)
      return null;
    const o = s[0], a = r && t.parsePatterns[r] || t.parsePatterns[t.defaultParseWidth], l = Array.isArray(a) ? wg(a, (f) => f.test(o)) : (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- I challange you to fix the type
      mg(a, (f) => f.test(o))
    );
    let c;
    c = t.valueCallback ? t.valueCallback(l) : l, c = n.valueCallback ? (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- I challange you to fix the type
      n.valueCallback(c)
    ) : c;
    const u = e.slice(o.length);
    return { value: c, rest: u };
  };
}
function mg(t, e) {
  for (const n in t)
    if (Object.prototype.hasOwnProperty.call(t, n) && e(t[n]))
      return n;
}
function wg(t, e) {
  for (let n = 0; n < t.length; n++)
    if (e(t[n]))
      return n;
}
function Ec(t) {
  return (e, n = {}) => {
    const r = e.match(t.matchPattern);
    if (!r)
      return null;
    const i = r[0], s = e.match(t.parsePattern);
    if (!s)
      return null;
    let o = t.valueCallback ? t.valueCallback(s[0]) : s[0];
    o = n.valueCallback ? n.valueCallback(o) : o;
    const a = e.slice(i.length);
    return { value: o, rest: a };
  };
}
const pg = /^(\d+)(th|st|nd|rd)?/i, vg = /\d+/i, bg = {
  narrow: /^(b|a)/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  wide: /^(before christ|before common era|anno domini|common era)/i
}, yg = {
  any: [/^b/i, /^(a|c)/i]
}, xg = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](th|st|nd|rd)? quarter/i
}, kg = {
  any: [/1/i, /2/i, /3/i, /4/i]
}, Cg = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
}, _g = {
  narrow: [
    /^j/i,
    /^f/i,
    /^m/i,
    /^a/i,
    /^m/i,
    /^j/i,
    /^j/i,
    /^a/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ],
  any: [
    /^ja/i,
    /^f/i,
    /^mar/i,
    /^ap/i,
    /^may/i,
    /^jun/i,
    /^jul/i,
    /^au/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ]
}, Sg = {
  narrow: /^[smtwf]/i,
  short: /^(su|mo|tu|we|th|fr|sa)/i,
  abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
  wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
}, Mg = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
}, Og = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
}, Eg = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^mi/i,
    noon: /^no/i,
    morning: /morning/i,
    afternoon: /afternoon/i,
    evening: /evening/i,
    night: /night/i
  }
}, Ig = {
  ordinalNumber: Ec({
    matchPattern: pg,
    parsePattern: vg,
    valueCallback: (t) => parseInt(t, 10)
  }),
  era: Ft({
    matchPatterns: bg,
    defaultMatchWidth: "wide",
    parsePatterns: yg,
    defaultParseWidth: "any"
  }),
  quarter: Ft({
    matchPatterns: xg,
    defaultMatchWidth: "wide",
    parsePatterns: kg,
    defaultParseWidth: "any",
    valueCallback: (t) => t + 1
  }),
  month: Ft({
    matchPatterns: Cg,
    defaultMatchWidth: "wide",
    parsePatterns: _g,
    defaultParseWidth: "any"
  }),
  day: Ft({
    matchPatterns: Sg,
    defaultMatchWidth: "wide",
    parsePatterns: Mg,
    defaultParseWidth: "any"
  }),
  dayPeriod: Ft({
    matchPatterns: Og,
    defaultMatchWidth: "any",
    parsePatterns: Eg,
    defaultParseWidth: "any"
  })
}, Ic = {
  code: "en-US",
  formatDistance: eg,
  formatLong: ig,
  formatRelative: og,
  localize: gg,
  match: Ig,
  options: {
    weekStartsOn: 0,
    firstWeekContainsDate: 1
  }
};
function Pg(t) {
  const e = Ae(t);
  return H2(e, J2(e)) + 1;
}
function $o(t) {
  const e = Ae(t), n = +Ti(e) - +U2(e);
  return Math.round(n / Cc) + 1;
}
function Pc(t, e) {
  var u, f, h, m;
  const n = Ae(t), r = n.getFullYear(), i = Xr(), s = (e == null ? void 0 : e.firstWeekContainsDate) ?? ((f = (u = e == null ? void 0 : e.locale) == null ? void 0 : u.options) == null ? void 0 : f.firstWeekContainsDate) ?? i.firstWeekContainsDate ?? ((m = (h = i.locale) == null ? void 0 : h.options) == null ? void 0 : m.firstWeekContainsDate) ?? 1, o = bt(t, 0);
  o.setFullYear(r + 1, 0, s), o.setHours(0, 0, 0, 0);
  const a = at(o, e), l = bt(t, 0);
  l.setFullYear(r, 0, s), l.setHours(0, 0, 0, 0);
  const c = at(l, e);
  return n.getTime() >= a.getTime() ? r + 1 : n.getTime() >= c.getTime() ? r : r - 1;
}
function Dg(t, e) {
  var a, l, c, u;
  const n = Xr(), r = (e == null ? void 0 : e.firstWeekContainsDate) ?? ((l = (a = e == null ? void 0 : e.locale) == null ? void 0 : a.options) == null ? void 0 : l.firstWeekContainsDate) ?? n.firstWeekContainsDate ?? ((u = (c = n.locale) == null ? void 0 : c.options) == null ? void 0 : u.firstWeekContainsDate) ?? 1, i = Pc(t, e), s = bt(t, 0);
  return s.setFullYear(i, 0, r), s.setHours(0, 0, 0, 0), at(s, e);
}
function $g(t, e) {
  const n = Ae(t), r = +at(n, e) - +Dg(n, e);
  return Math.round(r / Cc) + 1;
}
function Ie(t, e) {
  const n = t < 0 ? "-" : "", r = Math.abs(t).toString().padStart(e, "0");
  return n + r;
}
const an = {
  // Year
  y(t, e) {
    const n = t.getFullYear(), r = n > 0 ? n : 1 - n;
    return Ie(e === "yy" ? r % 100 : r, e.length);
  },
  // Month
  M(t, e) {
    const n = t.getMonth();
    return e === "M" ? String(n + 1) : Ie(n + 1, 2);
  },
  // Day of the month
  d(t, e) {
    return Ie(t.getDate(), e.length);
  },
  // AM or PM
  a(t, e) {
    const n = t.getHours() / 12 >= 1 ? "pm" : "am";
    switch (e) {
      case "a":
      case "aa":
        return n.toUpperCase();
      case "aaa":
        return n;
      case "aaaaa":
        return n[0];
      case "aaaa":
      default:
        return n === "am" ? "a.m." : "p.m.";
    }
  },
  // Hour [1-12]
  h(t, e) {
    return Ie(t.getHours() % 12 || 12, e.length);
  },
  // Hour [0-23]
  H(t, e) {
    return Ie(t.getHours(), e.length);
  },
  // Minute
  m(t, e) {
    return Ie(t.getMinutes(), e.length);
  },
  // Second
  s(t, e) {
    return Ie(t.getSeconds(), e.length);
  },
  // Fraction of second
  S(t, e) {
    const n = e.length, r = t.getMilliseconds(), i = Math.trunc(
      r * Math.pow(10, n - 3)
    );
    return Ie(i, e.length);
  }
}, Rn = {
  am: "am",
  pm: "pm",
  midnight: "midnight",
  noon: "noon",
  morning: "morning",
  afternoon: "afternoon",
  evening: "evening",
  night: "night"
}, xa = {
  // Era
  G: function(t, e, n) {
    const r = t.getFullYear() > 0 ? 1 : 0;
    switch (e) {
      case "G":
      case "GG":
      case "GGG":
        return n.era(r, { width: "abbreviated" });
      case "GGGGG":
        return n.era(r, { width: "narrow" });
      case "GGGG":
      default:
        return n.era(r, { width: "wide" });
    }
  },
  // Year
  y: function(t, e, n) {
    if (e === "yo") {
      const r = t.getFullYear(), i = r > 0 ? r : 1 - r;
      return n.ordinalNumber(i, { unit: "year" });
    }
    return an.y(t, e);
  },
  // Local week-numbering year
  Y: function(t, e, n, r) {
    const i = Pc(t, r), s = i > 0 ? i : 1 - i;
    if (e === "YY") {
      const o = s % 100;
      return Ie(o, 2);
    }
    return e === "Yo" ? n.ordinalNumber(s, { unit: "year" }) : Ie(s, e.length);
  },
  // ISO week-numbering year
  R: function(t, e) {
    const n = Do(t);
    return Ie(n, e.length);
  },
  // Extended year. This is a single number designating the year of this calendar system.
  // The main difference between `y` and `u` localizers are B.C. years:
  // | Year | `y` | `u` |
  // |------|-----|-----|
  // | AC 1 |   1 |   1 |
  // | BC 1 |   1 |   0 |
  // | BC 2 |   2 |  -1 |
  // Also `yy` always returns the last two digits of a year,
  // while `uu` pads single digit years to 2 characters and returns other years unchanged.
  u: function(t, e) {
    const n = t.getFullYear();
    return Ie(n, e.length);
  },
  // Quarter
  Q: function(t, e, n) {
    const r = Math.ceil((t.getMonth() + 1) / 3);
    switch (e) {
      case "Q":
        return String(r);
      case "QQ":
        return Ie(r, 2);
      case "Qo":
        return n.ordinalNumber(r, { unit: "quarter" });
      case "QQQ":
        return n.quarter(r, {
          width: "abbreviated",
          context: "formatting"
        });
      case "QQQQQ":
        return n.quarter(r, {
          width: "narrow",
          context: "formatting"
        });
      case "QQQQ":
      default:
        return n.quarter(r, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Stand-alone quarter
  q: function(t, e, n) {
    const r = Math.ceil((t.getMonth() + 1) / 3);
    switch (e) {
      case "q":
        return String(r);
      case "qq":
        return Ie(r, 2);
      case "qo":
        return n.ordinalNumber(r, { unit: "quarter" });
      case "qqq":
        return n.quarter(r, {
          width: "abbreviated",
          context: "standalone"
        });
      case "qqqqq":
        return n.quarter(r, {
          width: "narrow",
          context: "standalone"
        });
      case "qqqq":
      default:
        return n.quarter(r, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  // Month
  M: function(t, e, n) {
    const r = t.getMonth();
    switch (e) {
      case "M":
      case "MM":
        return an.M(t, e);
      case "Mo":
        return n.ordinalNumber(r + 1, { unit: "month" });
      case "MMM":
        return n.month(r, {
          width: "abbreviated",
          context: "formatting"
        });
      case "MMMMM":
        return n.month(r, {
          width: "narrow",
          context: "formatting"
        });
      case "MMMM":
      default:
        return n.month(r, { width: "wide", context: "formatting" });
    }
  },
  // Stand-alone month
  L: function(t, e, n) {
    const r = t.getMonth();
    switch (e) {
      case "L":
        return String(r + 1);
      case "LL":
        return Ie(r + 1, 2);
      case "Lo":
        return n.ordinalNumber(r + 1, { unit: "month" });
      case "LLL":
        return n.month(r, {
          width: "abbreviated",
          context: "standalone"
        });
      case "LLLLL":
        return n.month(r, {
          width: "narrow",
          context: "standalone"
        });
      case "LLLL":
      default:
        return n.month(r, { width: "wide", context: "standalone" });
    }
  },
  // Local week of year
  w: function(t, e, n, r) {
    const i = $g(t, r);
    return e === "wo" ? n.ordinalNumber(i, { unit: "week" }) : Ie(i, e.length);
  },
  // ISO week of year
  I: function(t, e, n) {
    const r = $o(t);
    return e === "Io" ? n.ordinalNumber(r, { unit: "week" }) : Ie(r, e.length);
  },
  // Day of the month
  d: function(t, e, n) {
    return e === "do" ? n.ordinalNumber(t.getDate(), { unit: "date" }) : an.d(t, e);
  },
  // Day of year
  D: function(t, e, n) {
    const r = Pg(t);
    return e === "Do" ? n.ordinalNumber(r, { unit: "dayOfYear" }) : Ie(r, e.length);
  },
  // Day of week
  E: function(t, e, n) {
    const r = t.getDay();
    switch (e) {
      case "E":
      case "EE":
      case "EEE":
        return n.day(r, {
          width: "abbreviated",
          context: "formatting"
        });
      case "EEEEE":
        return n.day(r, {
          width: "narrow",
          context: "formatting"
        });
      case "EEEEEE":
        return n.day(r, {
          width: "short",
          context: "formatting"
        });
      case "EEEE":
      default:
        return n.day(r, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Local day of week
  e: function(t, e, n, r) {
    const i = t.getDay(), s = (i - r.weekStartsOn + 8) % 7 || 7;
    switch (e) {
      case "e":
        return String(s);
      case "ee":
        return Ie(s, 2);
      case "eo":
        return n.ordinalNumber(s, { unit: "day" });
      case "eee":
        return n.day(i, {
          width: "abbreviated",
          context: "formatting"
        });
      case "eeeee":
        return n.day(i, {
          width: "narrow",
          context: "formatting"
        });
      case "eeeeee":
        return n.day(i, {
          width: "short",
          context: "formatting"
        });
      case "eeee":
      default:
        return n.day(i, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Stand-alone local day of week
  c: function(t, e, n, r) {
    const i = t.getDay(), s = (i - r.weekStartsOn + 8) % 7 || 7;
    switch (e) {
      case "c":
        return String(s);
      case "cc":
        return Ie(s, e.length);
      case "co":
        return n.ordinalNumber(s, { unit: "day" });
      case "ccc":
        return n.day(i, {
          width: "abbreviated",
          context: "standalone"
        });
      case "ccccc":
        return n.day(i, {
          width: "narrow",
          context: "standalone"
        });
      case "cccccc":
        return n.day(i, {
          width: "short",
          context: "standalone"
        });
      case "cccc":
      default:
        return n.day(i, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  // ISO day of week
  i: function(t, e, n) {
    const r = t.getDay(), i = r === 0 ? 7 : r;
    switch (e) {
      case "i":
        return String(i);
      case "ii":
        return Ie(i, e.length);
      case "io":
        return n.ordinalNumber(i, { unit: "day" });
      case "iii":
        return n.day(r, {
          width: "abbreviated",
          context: "formatting"
        });
      case "iiiii":
        return n.day(r, {
          width: "narrow",
          context: "formatting"
        });
      case "iiiiii":
        return n.day(r, {
          width: "short",
          context: "formatting"
        });
      case "iiii":
      default:
        return n.day(r, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // AM or PM
  a: function(t, e, n) {
    const i = t.getHours() / 12 >= 1 ? "pm" : "am";
    switch (e) {
      case "a":
      case "aa":
        return n.dayPeriod(i, {
          width: "abbreviated",
          context: "formatting"
        });
      case "aaa":
        return n.dayPeriod(i, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();
      case "aaaaa":
        return n.dayPeriod(i, {
          width: "narrow",
          context: "formatting"
        });
      case "aaaa":
      default:
        return n.dayPeriod(i, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // AM, PM, midnight, noon
  b: function(t, e, n) {
    const r = t.getHours();
    let i;
    switch (r === 12 ? i = Rn.noon : r === 0 ? i = Rn.midnight : i = r / 12 >= 1 ? "pm" : "am", e) {
      case "b":
      case "bb":
        return n.dayPeriod(i, {
          width: "abbreviated",
          context: "formatting"
        });
      case "bbb":
        return n.dayPeriod(i, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();
      case "bbbbb":
        return n.dayPeriod(i, {
          width: "narrow",
          context: "formatting"
        });
      case "bbbb":
      default:
        return n.dayPeriod(i, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // in the morning, in the afternoon, in the evening, at night
  B: function(t, e, n) {
    const r = t.getHours();
    let i;
    switch (r >= 17 ? i = Rn.evening : r >= 12 ? i = Rn.afternoon : r >= 4 ? i = Rn.morning : i = Rn.night, e) {
      case "B":
      case "BB":
      case "BBB":
        return n.dayPeriod(i, {
          width: "abbreviated",
          context: "formatting"
        });
      case "BBBBB":
        return n.dayPeriod(i, {
          width: "narrow",
          context: "formatting"
        });
      case "BBBB":
      default:
        return n.dayPeriod(i, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Hour [1-12]
  h: function(t, e, n) {
    if (e === "ho") {
      let r = t.getHours() % 12;
      return r === 0 && (r = 12), n.ordinalNumber(r, { unit: "hour" });
    }
    return an.h(t, e);
  },
  // Hour [0-23]
  H: function(t, e, n) {
    return e === "Ho" ? n.ordinalNumber(t.getHours(), { unit: "hour" }) : an.H(t, e);
  },
  // Hour [0-11]
  K: function(t, e, n) {
    const r = t.getHours() % 12;
    return e === "Ko" ? n.ordinalNumber(r, { unit: "hour" }) : Ie(r, e.length);
  },
  // Hour [1-24]
  k: function(t, e, n) {
    let r = t.getHours();
    return r === 0 && (r = 24), e === "ko" ? n.ordinalNumber(r, { unit: "hour" }) : Ie(r, e.length);
  },
  // Minute
  m: function(t, e, n) {
    return e === "mo" ? n.ordinalNumber(t.getMinutes(), { unit: "minute" }) : an.m(t, e);
  },
  // Second
  s: function(t, e, n) {
    return e === "so" ? n.ordinalNumber(t.getSeconds(), { unit: "second" }) : an.s(t, e);
  },
  // Fraction of second
  S: function(t, e) {
    return an.S(t, e);
  },
  // Timezone (ISO-8601. If offset is 0, output is always `'Z'`)
  X: function(t, e, n) {
    const r = t.getTimezoneOffset();
    if (r === 0)
      return "Z";
    switch (e) {
      case "X":
        return Ca(r);
      case "XXXX":
      case "XX":
        return _n(r);
      case "XXXXX":
      case "XXX":
      default:
        return _n(r, ":");
    }
  },
  // Timezone (ISO-8601. If offset is 0, output is `'+00:00'` or equivalent)
  x: function(t, e, n) {
    const r = t.getTimezoneOffset();
    switch (e) {
      case "x":
        return Ca(r);
      case "xxxx":
      case "xx":
        return _n(r);
      case "xxxxx":
      case "xxx":
      default:
        return _n(r, ":");
    }
  },
  // Timezone (GMT)
  O: function(t, e, n) {
    const r = t.getTimezoneOffset();
    switch (e) {
      case "O":
      case "OO":
      case "OOO":
        return "GMT" + ka(r, ":");
      case "OOOO":
      default:
        return "GMT" + _n(r, ":");
    }
  },
  // Timezone (specific non-location)
  z: function(t, e, n) {
    const r = t.getTimezoneOffset();
    switch (e) {
      case "z":
      case "zz":
      case "zzz":
        return "GMT" + ka(r, ":");
      case "zzzz":
      default:
        return "GMT" + _n(r, ":");
    }
  },
  // Seconds timestamp
  t: function(t, e, n) {
    const r = Math.trunc(t.getTime() / 1e3);
    return Ie(r, e.length);
  },
  // Milliseconds timestamp
  T: function(t, e, n) {
    const r = t.getTime();
    return Ie(r, e.length);
  }
};
function ka(t, e = "") {
  const n = t > 0 ? "-" : "+", r = Math.abs(t), i = Math.trunc(r / 60), s = r % 60;
  return s === 0 ? n + String(i) : n + String(i) + e + Ie(s, 2);
}
function Ca(t, e) {
  return t % 60 === 0 ? (t > 0 ? "-" : "+") + Ie(Math.abs(t) / 60, 2) : _n(t, e);
}
function _n(t, e = "") {
  const n = t > 0 ? "-" : "+", r = Math.abs(t), i = Ie(Math.trunc(r / 60), 2), s = Ie(r % 60, 2);
  return n + i + e + s;
}
const _a = (t, e) => {
  switch (t) {
    case "P":
      return e.date({ width: "short" });
    case "PP":
      return e.date({ width: "medium" });
    case "PPP":
      return e.date({ width: "long" });
    case "PPPP":
    default:
      return e.date({ width: "full" });
  }
}, Dc = (t, e) => {
  switch (t) {
    case "p":
      return e.time({ width: "short" });
    case "pp":
      return e.time({ width: "medium" });
    case "ppp":
      return e.time({ width: "long" });
    case "pppp":
    default:
      return e.time({ width: "full" });
  }
}, Tg = (t, e) => {
  const n = t.match(/(P+)(p+)?/) || [], r = n[1], i = n[2];
  if (!i)
    return _a(t, e);
  let s;
  switch (r) {
    case "P":
      s = e.dateTime({ width: "short" });
      break;
    case "PP":
      s = e.dateTime({ width: "medium" });
      break;
    case "PPP":
      s = e.dateTime({ width: "long" });
      break;
    case "PPPP":
    default:
      s = e.dateTime({ width: "full" });
      break;
  }
  return s.replace("{{date}}", _a(r, e)).replace("{{time}}", Dc(i, e));
}, Ag = {
  p: Dc,
  P: Tg
}, Lg = /^D+$/, Fg = /^Y+$/, zg = ["D", "DD", "YY", "YYYY"];
function Rg(t) {
  return Lg.test(t);
}
function Vg(t) {
  return Fg.test(t);
}
function Ng(t, e, n) {
  const r = Kg(t, e, n);
  if (console.warn(r), zg.includes(t))
    throw new RangeError(r);
}
function Kg(t, e, n) {
  const r = t[0] === "Y" ? "years" : "days of the month";
  return `Use \`${t.toLowerCase()}\` instead of \`${t}\` (in \`${e}\`) for formatting ${r} to the input \`${n}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
}
const Bg = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g, jg = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g, Wg = /^'([^]*?)'?$/, Hg = /''/g, Ug = /[a-zA-Z]/;
function We(t, e, n) {
  var u, f, h, m, w, g, p, v;
  const r = Xr(), i = (n == null ? void 0 : n.locale) ?? r.locale ?? Ic, s = (n == null ? void 0 : n.firstWeekContainsDate) ?? ((f = (u = n == null ? void 0 : n.locale) == null ? void 0 : u.options) == null ? void 0 : f.firstWeekContainsDate) ?? r.firstWeekContainsDate ?? ((m = (h = r.locale) == null ? void 0 : h.options) == null ? void 0 : m.firstWeekContainsDate) ?? 1, o = (n == null ? void 0 : n.weekStartsOn) ?? ((g = (w = n == null ? void 0 : n.locale) == null ? void 0 : w.options) == null ? void 0 : g.weekStartsOn) ?? r.weekStartsOn ?? ((v = (p = r.locale) == null ? void 0 : p.options) == null ? void 0 : v.weekStartsOn) ?? 0, a = Ae(t);
  if (!X2(a))
    throw new RangeError("Invalid time value");
  let l = e.match(jg).map((b) => {
    const C = b[0];
    if (C === "p" || C === "P") {
      const _ = Ag[C];
      return _(b, i.formatLong);
    }
    return b;
  }).join("").match(Bg).map((b) => {
    if (b === "''")
      return { isToken: !1, value: "'" };
    const C = b[0];
    if (C === "'")
      return { isToken: !1, value: qg(b) };
    if (xa[C])
      return { isToken: !0, value: b };
    if (C.match(Ug))
      throw new RangeError(
        "Format string contains an unescaped latin alphabet character `" + C + "`"
      );
    return { isToken: !1, value: b };
  });
  i.localize.preprocessor && (l = i.localize.preprocessor(a, l));
  const c = {
    firstWeekContainsDate: s,
    weekStartsOn: o,
    locale: i
  };
  return l.map((b) => {
    if (!b.isToken)
      return b.value;
    const C = b.value;
    (!(n != null && n.useAdditionalWeekYearTokens) && Vg(C) || !(n != null && n.useAdditionalDayOfYearTokens) && Rg(C)) && Ng(C, e, String(t));
    const _ = xa[C[0]];
    return _(a, C, i.localize, c);
  }).join("");
}
function qg(t) {
  const e = t.match(Wg);
  return e ? e[1].replace(Hg, "'") : t;
}
function $c(t) {
  return Ae(t).getDay();
}
function tr(t) {
  return Ae(t).getFullYear();
}
function Os(t, e, n) {
  const r = at(t, n), i = at(e, n);
  return +r == +i;
}
function To(t, e) {
  const n = Ae(t), r = Ae(e);
  return n.getFullYear() === r.getFullYear() && n.getMonth() === r.getMonth();
}
function Gg(t) {
  return _c(t, G2(t));
}
function Yg(t, e) {
  let n = e - $c(t);
  return n <= 0 && (n += 7), rs(t, n);
}
function Tc(t) {
  return Yg(t, 4);
}
function Xg(t, e) {
  const n = Ae(t);
  return isNaN(+n) ? bt(t, NaN) : (n.setFullYear(e), n);
}
const Ao = (t, e) => {
  const n = t.name.split(".").pop(), r = We(Date.now(), "yyyyMMdd-HHmmss"), i = Math.ceil(Math.random() * 1e3);
  return { filename: `${e.replace(/#/g, "-")}-${r}-${i}.${n}`, uri: URL.createObjectURL(t) };
}, Li = (t) => t.value === 0 || t.value === "0", Sa = (t) => {
  if (!t)
    return 0;
  const e = t.find(Li);
  return e && typeof e.label == "string" ? parseInt(e.label.split("#")[1]) : 0;
}, Qg = (t) => [
  {
    label: so(t),
    value: {
      latitude: t.latitude,
      longitude: t.longitude,
      accuracy: t.accuracy
    }
  },
  {
    label: "map",
    value: so(t)
  },
  {
    label: "latitude",
    value: t.latitude
  },
  {
    label: "longitude",
    value: t.longitude
  },
  {
    label: "accuracy",
    value: t.accuracy
  }
], Jg = (t) => {
  if (!t)
    return "";
  const { latitude: e, longitude: n, accuracy: r } = t[0].value;
  return `${e},${n}${r ? ` (${r}m)` : ""}`;
}, so = (t) => {
  const e = Array.isArray(t) ? t[0].value.latitude : t.latitude, n = Array.isArray(t) ? t[0].value.longitude : t.longitude;
  return `https://maps.google.com/maps?q=${e},${n}`;
}, Ur = (t) => typeof t > "u" ? [] : t.map((e) => typeof e == "object" ? { ...e } : e), Lo = (t) => {
  var e;
  return t.type !== ie.NestedInput ? t.components : (e = t.components) == null ? void 0 : e.slice().sort(
    (n, r) => Number(n.answer.value) - Number(r.answer.value)
  );
}, Zg = (t, e) => {
  if (t)
    return Ur(t).map((n) => {
      if (n.open) {
        const r = e == null ? void 0 : e.find((i) => i.value === n.value);
        n.label = (r == null ? void 0 : r.label) ?? n.label;
      }
      return n;
    });
}, [je, Mt] = ql({
  activeDataKey: "",
  focusedDataKey: void 0,
  isSidebarOpen: !1,
  theme: {
    color: {
      primary: "#6366f1"
    },
    isDark: !1,
    fontScale: 1
  }
}), Fo = () => ae.getComponent(je.activeDataKey), Ma = () => {
  const t = ae.getParentComponent(je.activeDataKey);
  if (t)
    return t.type === ie.NestedInput ? ae.getParentComponent(t.dataKey) : t;
}, Ac = (t) => {
  const e = Fo();
  if (!e)
    return;
  if (e.type === ie.NestedChild) {
    const r = ae.getParentComponent(e.dataKey);
    if (!r)
      return;
    const i = Lo(r);
    if (!i)
      return;
    const s = i.findIndex((l) => l.dataKey === e.dataKey), o = i.filter((l, c) => (t === "next" ? c > s : c < s) && l.enable);
    return (t === "next" ? o[0] : o[o.length - 1]) ?? Ma();
  }
  const n = ae.getAdjacentComponent(e.dataKey, t);
  if (!n)
    return Ma();
  if (n.enable)
    return n;
}, Lc = () => Ac("next"), Fc = () => Ac("prev"), e1 = () => {
  if (!je.activeDataKey)
    return;
  const t = Lc();
  t && Mt({
    activeDataKey: t.dataKey
  });
}, t1 = () => {
  if (!je.activeDataKey)
    return;
  const t = Fc();
  t && Mt({
    activeDataKey: t.dataKey
  });
}, n1 = (t) => {
  const e = ae.getParentComponent(t);
  e && (Mt({
    activeDataKey: e.dataKey
  }), setTimeout(() => {
    Mt({
      focusedDataKey: t
    });
  }, 500));
}, Qr = () => Mt({
  isSidebarOpen: !je.isSidebarOpen
}), r1 = (t) => Mt("theme", "color", t), i1 = () => Mt("theme", "isDark", !je.theme.isDark), s1 = (t) => Mt("theme", "fontScale", t);
var o1 = { grad: 0.9, turn: 360, rad: 360 / (2 * Math.PI) }, Ht = function(t) {
  return typeof t == "string" ? t.length > 0 : typeof t == "number";
}, Je = function(t, e, n) {
  return e === void 0 && (e = 0), n === void 0 && (n = Math.pow(10, e)), Math.round(n * t) / n + 0;
}, St = function(t, e, n) {
  return e === void 0 && (e = 0), n === void 0 && (n = 1), t > n ? n : t > e ? t : e;
}, zc = function(t) {
  return (t = isFinite(t) ? t % 360 : 0) > 0 ? t : t + 360;
}, Oa = function(t) {
  return { r: St(t.r, 0, 255), g: St(t.g, 0, 255), b: St(t.b, 0, 255), a: St(t.a) };
}, Es = function(t) {
  return { r: Je(t.r), g: Je(t.g), b: Je(t.b), a: Je(t.a, 3) };
}, a1 = /^#([0-9a-f]{3,8})$/i, hi = function(t) {
  var e = t.toString(16);
  return e.length < 2 ? "0" + e : e;
}, Rc = function(t) {
  var e = t.r, n = t.g, r = t.b, i = t.a, s = Math.max(e, n, r), o = s - Math.min(e, n, r), a = o ? s === e ? (n - r) / o : s === n ? 2 + (r - e) / o : 4 + (e - n) / o : 0;
  return { h: 60 * (a < 0 ? a + 6 : a), s: s ? o / s * 100 : 0, v: s / 255 * 100, a: i };
}, Vc = function(t) {
  var e = t.h, n = t.s, r = t.v, i = t.a;
  e = e / 360 * 6, n /= 100, r /= 100;
  var s = Math.floor(e), o = r * (1 - n), a = r * (1 - (e - s) * n), l = r * (1 - (1 - e + s) * n), c = s % 6;
  return { r: 255 * [r, a, o, o, l, r][c], g: 255 * [l, r, r, a, o, o][c], b: 255 * [o, o, l, r, r, a][c], a: i };
}, Ea = function(t) {
  return { h: zc(t.h), s: St(t.s, 0, 100), l: St(t.l, 0, 100), a: St(t.a) };
}, Ia = function(t) {
  return { h: Je(t.h), s: Je(t.s), l: Je(t.l), a: Je(t.a, 3) };
}, Pa = function(t) {
  return Vc((n = (e = t).s, { h: e.h, s: (n *= ((r = e.l) < 50 ? r : 100 - r) / 100) > 0 ? 2 * n / (r + n) * 100 : 0, v: r + n, a: e.a }));
  var e, n, r;
}, Rr = function(t) {
  return { h: (e = Rc(t)).h, s: (i = (200 - (n = e.s)) * (r = e.v) / 100) > 0 && i < 200 ? n * r / 100 / (i <= 100 ? i : 200 - i) * 100 : 0, l: i / 2, a: e.a };
  var e, n, r, i;
}, l1 = /^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s*,\s*([+-]?\d*\.?\d+)%\s*,\s*([+-]?\d*\.?\d+)%\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, c1 = /^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s+([+-]?\d*\.?\d+)%\s+([+-]?\d*\.?\d+)%\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, u1 = /^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, d1 = /^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, Da = { string: [[function(t) {
  var e = a1.exec(t);
  return e ? (t = e[1]).length <= 4 ? { r: parseInt(t[0] + t[0], 16), g: parseInt(t[1] + t[1], 16), b: parseInt(t[2] + t[2], 16), a: t.length === 4 ? Je(parseInt(t[3] + t[3], 16) / 255, 2) : 1 } : t.length === 6 || t.length === 8 ? { r: parseInt(t.substr(0, 2), 16), g: parseInt(t.substr(2, 2), 16), b: parseInt(t.substr(4, 2), 16), a: t.length === 8 ? Je(parseInt(t.substr(6, 2), 16) / 255, 2) : 1 } : null : null;
}, "hex"], [function(t) {
  var e = u1.exec(t) || d1.exec(t);
  return e ? e[2] !== e[4] || e[4] !== e[6] ? null : Oa({ r: Number(e[1]) / (e[2] ? 100 / 255 : 1), g: Number(e[3]) / (e[4] ? 100 / 255 : 1), b: Number(e[5]) / (e[6] ? 100 / 255 : 1), a: e[7] === void 0 ? 1 : Number(e[7]) / (e[8] ? 100 : 1) }) : null;
}, "rgb"], [function(t) {
  var e = l1.exec(t) || c1.exec(t);
  if (!e)
    return null;
  var n, r, i = Ea({ h: (n = e[1], r = e[2], r === void 0 && (r = "deg"), Number(n) * (o1[r] || 1)), s: Number(e[3]), l: Number(e[4]), a: e[5] === void 0 ? 1 : Number(e[5]) / (e[6] ? 100 : 1) });
  return Pa(i);
}, "hsl"]], object: [[function(t) {
  var e = t.r, n = t.g, r = t.b, i = t.a, s = i === void 0 ? 1 : i;
  return Ht(e) && Ht(n) && Ht(r) ? Oa({ r: Number(e), g: Number(n), b: Number(r), a: Number(s) }) : null;
}, "rgb"], [function(t) {
  var e = t.h, n = t.s, r = t.l, i = t.a, s = i === void 0 ? 1 : i;
  if (!Ht(e) || !Ht(n) || !Ht(r))
    return null;
  var o = Ea({ h: Number(e), s: Number(n), l: Number(r), a: Number(s) });
  return Pa(o);
}, "hsl"], [function(t) {
  var e = t.h, n = t.s, r = t.v, i = t.a, s = i === void 0 ? 1 : i;
  if (!Ht(e) || !Ht(n) || !Ht(r))
    return null;
  var o = function(a) {
    return { h: zc(a.h), s: St(a.s, 0, 100), v: St(a.v, 0, 100), a: St(a.a) };
  }({ h: Number(e), s: Number(n), v: Number(r), a: Number(s) });
  return Vc(o);
}, "hsv"]] }, $a = function(t, e) {
  for (var n = 0; n < e.length; n++) {
    var r = e[n][0](t);
    if (r)
      return [r, e[n][1]];
  }
  return [null, void 0];
}, f1 = function(t) {
  return typeof t == "string" ? $a(t.trim(), Da.string) : typeof t == "object" && t !== null ? $a(t, Da.object) : [null, void 0];
}, Is = function(t, e) {
  var n = Rr(t);
  return { h: n.h, s: St(n.s + 100 * e, 0, 100), l: n.l, a: n.a };
}, Ps = function(t) {
  return (299 * t.r + 587 * t.g + 114 * t.b) / 1e3 / 255;
}, Ta = function(t, e) {
  var n = Rr(t);
  return { h: n.h, s: n.s, l: St(n.l + 100 * e, 0, 100), a: n.a };
}, Aa = function() {
  function t(e) {
    this.parsed = f1(e)[0], this.rgba = this.parsed || { r: 0, g: 0, b: 0, a: 1 };
  }
  return t.prototype.isValid = function() {
    return this.parsed !== null;
  }, t.prototype.brightness = function() {
    return Je(Ps(this.rgba), 2);
  }, t.prototype.isDark = function() {
    return Ps(this.rgba) < 0.5;
  }, t.prototype.isLight = function() {
    return Ps(this.rgba) >= 0.5;
  }, t.prototype.toHex = function() {
    return e = Es(this.rgba), n = e.r, r = e.g, i = e.b, o = (s = e.a) < 1 ? hi(Je(255 * s)) : "", "#" + hi(n) + hi(r) + hi(i) + o;
    var e, n, r, i, s, o;
  }, t.prototype.toRgb = function() {
    return Es(this.rgba);
  }, t.prototype.toRgbString = function() {
    return e = Es(this.rgba), n = e.r, r = e.g, i = e.b, (s = e.a) < 1 ? "rgba(" + n + ", " + r + ", " + i + ", " + s + ")" : "rgb(" + n + ", " + r + ", " + i + ")";
    var e, n, r, i, s;
  }, t.prototype.toHsl = function() {
    return Ia(Rr(this.rgba));
  }, t.prototype.toHslString = function() {
    return e = Ia(Rr(this.rgba)), n = e.h, r = e.s, i = e.l, (s = e.a) < 1 ? "hsla(" + n + ", " + r + "%, " + i + "%, " + s + ")" : "hsl(" + n + ", " + r + "%, " + i + "%)";
    var e, n, r, i, s;
  }, t.prototype.toHsv = function() {
    return e = Rc(this.rgba), { h: Je(e.h), s: Je(e.s), v: Je(e.v), a: Je(e.a, 3) };
    var e;
  }, t.prototype.invert = function() {
    return Pt({ r: 255 - (e = this.rgba).r, g: 255 - e.g, b: 255 - e.b, a: e.a });
    var e;
  }, t.prototype.saturate = function(e) {
    return e === void 0 && (e = 0.1), Pt(Is(this.rgba, e));
  }, t.prototype.desaturate = function(e) {
    return e === void 0 && (e = 0.1), Pt(Is(this.rgba, -e));
  }, t.prototype.grayscale = function() {
    return Pt(Is(this.rgba, -1));
  }, t.prototype.lighten = function(e) {
    return e === void 0 && (e = 0.1), Pt(Ta(this.rgba, e));
  }, t.prototype.darken = function(e) {
    return e === void 0 && (e = 0.1), Pt(Ta(this.rgba, -e));
  }, t.prototype.rotate = function(e) {
    return e === void 0 && (e = 15), this.hue(this.hue() + e);
  }, t.prototype.alpha = function(e) {
    return typeof e == "number" ? Pt({ r: (n = this.rgba).r, g: n.g, b: n.b, a: e }) : Je(this.rgba.a, 3);
    var n;
  }, t.prototype.hue = function(e) {
    var n = Rr(this.rgba);
    return typeof e == "number" ? Pt({ h: e, s: n.s, l: n.l, a: n.a }) : Je(n.h);
  }, t.prototype.isEqual = function(e) {
    return this.toHex() === Pt(e).toHex();
  }, t;
}(), Pt = function(t) {
  return t instanceof Aa ? t : new Aa(t);
};
const h1 = 500, La = [
  { name: "50", intensity: 0.7 },
  { name: "100", intensity: 0.4 },
  { name: "200", intensity: 0.25 },
  { name: "300", intensity: 0.1 },
  { name: "400", intensity: 0.05 },
  { name: "500", intensity: 0 },
  // base-color
  { name: "600", intensity: -0.1 },
  { name: "700", intensity: -0.25 },
  { name: "800", intensity: -0.4 },
  { name: "900", intensity: -0.55 },
  { name: "950", intensity: -0.71 }
], g1 = (t) => {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push({
      name: t[n].name,
      intensity: t[t.length - 1 - n].intensity
    });
  return e;
}, m1 = (t, e = !1) => {
  const n = {};
  for (const [r, i] of Object.entries(t)) {
    const s = w1({ hex: i, reverse: e });
    for (const [o, a] of Object.entries(s)) {
      const { h: l, s: c, l: u } = Pt(a).toHsl();
      n[`--fasih-form-${r}-${o}`] = `${l} ${c}% ${u}%`;
    }
    n[`--fasih-form-${r}`] = n[`--fasih-form-${r}-${h1}`];
  }
  return n;
}, w1 = ({
  hex: t,
  reverse: e
}) => {
  const n = e ? g1(La) : La, r = {};
  return n.forEach(({ name: i, intensity: s }) => {
    r[i] = Pt(t).lighten(s).toHex();
  }), r;
}, p1 = () => {
  Z(() => {
    v1(je.theme.color, je.theme.isDark), b1(je.theme.isDark), y1(je.theme.fontScale);
  });
}, v1 = (t, e) => {
  const n = m1(t, e);
  for (const [r, i] of Object.entries(n))
    document.documentElement.style.setProperty(r, i);
}, b1 = (t) => {
  t ? document.documentElement.classList.add("dark") : document.documentElement.classList.remove("dark");
}, y1 = (t) => {
  document.documentElement.style.setProperty("--fasih-form-font-scale", t.toString());
};
function Nc(t) {
  var e, n, r = "";
  if (typeof t == "string" || typeof t == "number")
    r += t;
  else if (typeof t == "object")
    if (Array.isArray(t)) {
      var i = t.length;
      for (e = 0; e < i; e++)
        t[e] && (n = Nc(t[e])) && (r && (r += " "), r += n);
    } else
      for (n in t)
        t[n] && (r && (r += " "), r += n);
  return r;
}
function x1() {
  for (var t, e, n = 0, r = "", i = arguments.length; n < i; n++)
    (t = arguments[n]) && (e = Nc(t)) && (r && (r += " "), r += e);
  return r;
}
const zo = "-";
function k1(t) {
  const e = _1(t), {
    conflictingClassGroups: n,
    conflictingClassGroupModifiers: r
  } = t;
  function i(o) {
    const a = o.split(zo);
    return a[0] === "" && a.length !== 1 && a.shift(), Kc(a, e) || C1(o);
  }
  function s(o, a) {
    const l = n[o] || [];
    return a && r[o] ? [...l, ...r[o]] : l;
  }
  return {
    getClassGroupId: i,
    getConflictingClassGroupIds: s
  };
}
function Kc(t, e) {
  var o;
  if (t.length === 0)
    return e.classGroupId;
  const n = t[0], r = e.nextPart.get(n), i = r ? Kc(t.slice(1), r) : void 0;
  if (i)
    return i;
  if (e.validators.length === 0)
    return;
  const s = t.join(zo);
  return (o = e.validators.find(({
    validator: a
  }) => a(s))) == null ? void 0 : o.classGroupId;
}
const Fa = /^\[(.+)\]$/;
function C1(t) {
  if (Fa.test(t)) {
    const e = Fa.exec(t)[1], n = e == null ? void 0 : e.substring(0, e.indexOf(":"));
    if (n)
      return "arbitrary.." + n;
  }
}
function _1(t) {
  const {
    theme: e,
    prefix: n
  } = t, r = {
    nextPart: /* @__PURE__ */ new Map(),
    validators: []
  };
  return M1(Object.entries(t.classGroups), n).forEach(([s, o]) => {
    oo(o, r, s, e);
  }), r;
}
function oo(t, e, n, r) {
  t.forEach((i) => {
    if (typeof i == "string") {
      const s = i === "" ? e : za(e, i);
      s.classGroupId = n;
      return;
    }
    if (typeof i == "function") {
      if (S1(i)) {
        oo(i(r), e, n, r);
        return;
      }
      e.validators.push({
        validator: i,
        classGroupId: n
      });
      return;
    }
    Object.entries(i).forEach(([s, o]) => {
      oo(o, za(e, s), n, r);
    });
  });
}
function za(t, e) {
  let n = t;
  return e.split(zo).forEach((r) => {
    n.nextPart.has(r) || n.nextPart.set(r, {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    }), n = n.nextPart.get(r);
  }), n;
}
function S1(t) {
  return t.isThemeGetter;
}
function M1(t, e) {
  return e ? t.map(([n, r]) => {
    const i = r.map((s) => typeof s == "string" ? e + s : typeof s == "object" ? Object.fromEntries(Object.entries(s).map(([o, a]) => [e + o, a])) : s);
    return [n, i];
  }) : t;
}
function O1(t) {
  if (t < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let e = 0, n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
  function i(s, o) {
    n.set(s, o), e++, e > t && (e = 0, r = n, n = /* @__PURE__ */ new Map());
  }
  return {
    get(s) {
      let o = n.get(s);
      if (o !== void 0)
        return o;
      if ((o = r.get(s)) !== void 0)
        return i(s, o), o;
    },
    set(s, o) {
      n.has(s) ? n.set(s, o) : i(s, o);
    }
  };
}
const Bc = "!";
function E1(t) {
  const e = t.separator, n = e.length === 1, r = e[0], i = e.length;
  return function(o) {
    const a = [];
    let l = 0, c = 0, u;
    for (let g = 0; g < o.length; g++) {
      let p = o[g];
      if (l === 0) {
        if (p === r && (n || o.slice(g, g + i) === e)) {
          a.push(o.slice(c, g)), c = g + i;
          continue;
        }
        if (p === "/") {
          u = g;
          continue;
        }
      }
      p === "[" ? l++ : p === "]" && l--;
    }
    const f = a.length === 0 ? o : o.substring(c), h = f.startsWith(Bc), m = h ? f.substring(1) : f, w = u && u > c ? u - c : void 0;
    return {
      modifiers: a,
      hasImportantModifier: h,
      baseClassName: m,
      maybePostfixModifierPosition: w
    };
  };
}
function I1(t) {
  if (t.length <= 1)
    return t;
  const e = [];
  let n = [];
  return t.forEach((r) => {
    r[0] === "[" ? (e.push(...n.sort(), r), n = []) : n.push(r);
  }), e.push(...n.sort()), e;
}
function P1(t) {
  return {
    cache: O1(t.cacheSize),
    splitModifiers: E1(t),
    ...k1(t)
  };
}
const D1 = /\s+/;
function $1(t, e) {
  const {
    splitModifiers: n,
    getClassGroupId: r,
    getConflictingClassGroupIds: i
  } = e, s = /* @__PURE__ */ new Set();
  return t.trim().split(D1).map((o) => {
    const {
      modifiers: a,
      hasImportantModifier: l,
      baseClassName: c,
      maybePostfixModifierPosition: u
    } = n(o);
    let f = r(u ? c.substring(0, u) : c), h = !!u;
    if (!f) {
      if (!u)
        return {
          isTailwindClass: !1,
          originalClassName: o
        };
      if (f = r(c), !f)
        return {
          isTailwindClass: !1,
          originalClassName: o
        };
      h = !1;
    }
    const m = I1(a).join(":");
    return {
      isTailwindClass: !0,
      modifierId: l ? m + Bc : m,
      classGroupId: f,
      originalClassName: o,
      hasPostfixModifier: h
    };
  }).reverse().filter((o) => {
    if (!o.isTailwindClass)
      return !0;
    const {
      modifierId: a,
      classGroupId: l,
      hasPostfixModifier: c
    } = o, u = a + l;
    return s.has(u) ? !1 : (s.add(u), i(l, c).forEach((f) => s.add(a + f)), !0);
  }).reverse().map((o) => o.originalClassName).join(" ");
}
function T1() {
  let t = 0, e, n, r = "";
  for (; t < arguments.length; )
    (e = arguments[t++]) && (n = jc(e)) && (r && (r += " "), r += n);
  return r;
}
function jc(t) {
  if (typeof t == "string")
    return t;
  let e, n = "";
  for (let r = 0; r < t.length; r++)
    t[r] && (e = jc(t[r])) && (n && (n += " "), n += e);
  return n;
}
function Ra(t, ...e) {
  let n, r, i, s = o;
  function o(l) {
    const c = e.reduce((u, f) => f(u), t());
    return n = P1(c), r = n.cache.get, i = n.cache.set, s = a, a(l);
  }
  function a(l) {
    const c = r(l);
    if (c)
      return c;
    const u = $1(l, n);
    return i(l, u), u;
  }
  return function() {
    return s(T1.apply(null, arguments));
  };
}
function ze(t) {
  const e = (n) => n[t] || [];
  return e.isThemeGetter = !0, e;
}
const Wc = /^\[(?:([a-z-]+):)?(.+)\]$/i, A1 = /^\d+\/\d+$/, L1 = /* @__PURE__ */ new Set(["px", "full", "screen"]), F1 = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, z1 = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, R1 = /^(rgba?|hsla?|hwb|(ok)?(lab|lch))\(.+\)$/, V1 = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, N1 = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/;
function Ut(t) {
  return On(t) || L1.has(t) || A1.test(t);
}
function ln(t) {
  return ir(t, "length", G1);
}
function On(t) {
  return !!t && !Number.isNaN(Number(t));
}
function gi(t) {
  return ir(t, "number", On);
}
function _r(t) {
  return !!t && Number.isInteger(Number(t));
}
function K1(t) {
  return t.endsWith("%") && On(t.slice(0, -1));
}
function we(t) {
  return Wc.test(t);
}
function cn(t) {
  return F1.test(t);
}
const B1 = /* @__PURE__ */ new Set(["length", "size", "percentage"]);
function j1(t) {
  return ir(t, B1, Hc);
}
function W1(t) {
  return ir(t, "position", Hc);
}
const H1 = /* @__PURE__ */ new Set(["image", "url"]);
function U1(t) {
  return ir(t, H1, X1);
}
function q1(t) {
  return ir(t, "", Y1);
}
function Sr() {
  return !0;
}
function ir(t, e, n) {
  const r = Wc.exec(t);
  return r ? r[1] ? typeof e == "string" ? r[1] === e : e.has(r[1]) : n(r[2]) : !1;
}
function G1(t) {
  return z1.test(t) && !R1.test(t);
}
function Hc() {
  return !1;
}
function Y1(t) {
  return V1.test(t);
}
function X1(t) {
  return N1.test(t);
}
function Va() {
  const t = ze("colors"), e = ze("spacing"), n = ze("blur"), r = ze("brightness"), i = ze("borderColor"), s = ze("borderRadius"), o = ze("borderSpacing"), a = ze("borderWidth"), l = ze("contrast"), c = ze("grayscale"), u = ze("hueRotate"), f = ze("invert"), h = ze("gap"), m = ze("gradientColorStops"), w = ze("gradientColorStopPositions"), g = ze("inset"), p = ze("margin"), v = ze("opacity"), b = ze("padding"), C = ze("saturate"), _ = ze("scale"), E = ze("sepia"), F = ze("skew"), T = ze("space"), x = ze("translate"), y = () => ["auto", "contain", "none"], z = () => ["auto", "hidden", "clip", "visible", "scroll"], I = () => ["auto", we, e], O = () => [we, e], Q = () => ["", Ut, ln], H = () => ["auto", On, we], S = () => ["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top"], M = () => ["solid", "dashed", "dotted", "double", "none"], P = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], B = () => ["start", "end", "center", "between", "around", "evenly", "stretch"], V = () => ["", "0", we], X = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], q = () => [On, gi], $ = () => [On, we];
  return {
    cacheSize: 500,
    separator: ":",
    theme: {
      colors: [Sr],
      spacing: [Ut, ln],
      blur: ["none", "", cn, we],
      brightness: q(),
      borderColor: [t],
      borderRadius: ["none", "", "full", cn, we],
      borderSpacing: O(),
      borderWidth: Q(),
      contrast: q(),
      grayscale: V(),
      hueRotate: $(),
      invert: V(),
      gap: O(),
      gradientColorStops: [t],
      gradientColorStopPositions: [K1, ln],
      inset: I(),
      margin: I(),
      opacity: q(),
      padding: O(),
      saturate: q(),
      scale: q(),
      sepia: V(),
      skew: $(),
      space: O(),
      translate: O()
    },
    classGroups: {
      // Layout
      /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */
      aspect: [{
        aspect: ["auto", "square", "video", we]
      }],
      /**
       * Container
       * @see https://tailwindcss.com/docs/container
       */
      container: ["container"],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [{
        columns: [cn]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": X()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": X()
      }],
      /**
       * Break Inside
       * @see https://tailwindcss.com/docs/break-inside
       */
      "break-inside": [{
        "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"]
      }],
      /**
       * Box Decoration Break
       * @see https://tailwindcss.com/docs/box-decoration-break
       */
      "box-decoration": [{
        "box-decoration": ["slice", "clone"]
      }],
      /**
       * Box Sizing
       * @see https://tailwindcss.com/docs/box-sizing
       */
      box: [{
        box: ["border", "content"]
      }],
      /**
       * Display
       * @see https://tailwindcss.com/docs/display
       */
      display: ["block", "inline-block", "inline", "flex", "inline-flex", "table", "inline-table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row-group", "table-row", "flow-root", "grid", "inline-grid", "contents", "list-item", "hidden"],
      /**
       * Floats
       * @see https://tailwindcss.com/docs/float
       */
      float: [{
        float: ["right", "left", "none", "start", "end"]
      }],
      /**
       * Clear
       * @see https://tailwindcss.com/docs/clear
       */
      clear: [{
        clear: ["left", "right", "both", "none", "start", "end"]
      }],
      /**
       * Isolation
       * @see https://tailwindcss.com/docs/isolation
       */
      isolation: ["isolate", "isolation-auto"],
      /**
       * Object Fit
       * @see https://tailwindcss.com/docs/object-fit
       */
      "object-fit": [{
        object: ["contain", "cover", "fill", "none", "scale-down"]
      }],
      /**
       * Object Position
       * @see https://tailwindcss.com/docs/object-position
       */
      "object-position": [{
        object: [...S(), we]
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: z()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": z()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": z()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: y()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": y()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": y()
      }],
      /**
       * Position
       * @see https://tailwindcss.com/docs/position
       */
      position: ["static", "fixed", "absolute", "relative", "sticky"],
      /**
       * Top / Right / Bottom / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      inset: [{
        inset: [g]
      }],
      /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": [g]
      }],
      /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": [g]
      }],
      /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      start: [{
        start: [g]
      }],
      /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      end: [{
        end: [g]
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: [g]
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: [g]
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: [g]
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: [g]
      }],
      /**
       * Visibility
       * @see https://tailwindcss.com/docs/visibility
       */
      visibility: ["visible", "invisible", "collapse"],
      /**
       * Z-Index
       * @see https://tailwindcss.com/docs/z-index
       */
      z: [{
        z: ["auto", _r, we]
      }],
      // Flexbox and Grid
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: I()
      }],
      /**
       * Flex Direction
       * @see https://tailwindcss.com/docs/flex-direction
       */
      "flex-direction": [{
        flex: ["row", "row-reverse", "col", "col-reverse"]
      }],
      /**
       * Flex Wrap
       * @see https://tailwindcss.com/docs/flex-wrap
       */
      "flex-wrap": [{
        flex: ["wrap", "wrap-reverse", "nowrap"]
      }],
      /**
       * Flex
       * @see https://tailwindcss.com/docs/flex
       */
      flex: [{
        flex: ["1", "auto", "initial", "none", we]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: V()
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: V()
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: ["first", "last", "none", _r, we]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": [Sr]
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: ["auto", {
          span: ["full", _r, we]
        }, we]
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": H()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": H()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": [Sr]
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: ["auto", {
          span: [_r, we]
        }, we]
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": H()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": H()
      }],
      /**
       * Grid Auto Flow
       * @see https://tailwindcss.com/docs/grid-auto-flow
       */
      "grid-flow": [{
        "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"]
      }],
      /**
       * Grid Auto Columns
       * @see https://tailwindcss.com/docs/grid-auto-columns
       */
      "auto-cols": [{
        "auto-cols": ["auto", "min", "max", "fr", we]
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": ["auto", "min", "max", "fr", we]
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: [h]
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": [h]
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": [h]
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: ["normal", ...B()]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": ["start", "end", "center", "stretch"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", "start", "end", "center", "stretch"]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      "align-content": [{
        content: ["normal", ...B(), "baseline"]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      "align-items": [{
        items: ["start", "end", "center", "baseline", "stretch"]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", "start", "end", "center", "stretch", "baseline"]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      "place-content": [{
        "place-content": [...B(), "baseline"]
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      "place-items": [{
        "place-items": ["start", "end", "center", "baseline", "stretch"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", "start", "end", "center", "stretch"]
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: [b]
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: [b]
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: [b]
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: [b]
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: [b]
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: [b]
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: [b]
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: [b]
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: [b]
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: [p]
      }],
      /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: [p]
      }],
      /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: [p]
      }],
      /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: [p]
      }],
      /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: [p]
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: [p]
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: [p]
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: [p]
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: [p]
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/space
       */
      "space-x": [{
        "space-x": [T]
      }],
      /**
       * Space Between X Reverse
       * @see https://tailwindcss.com/docs/space
       */
      "space-x-reverse": ["space-x-reverse"],
      /**
       * Space Between Y
       * @see https://tailwindcss.com/docs/space
       */
      "space-y": [{
        "space-y": [T]
      }],
      /**
       * Space Between Y Reverse
       * @see https://tailwindcss.com/docs/space
       */
      "space-y-reverse": ["space-y-reverse"],
      // Sizing
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: ["auto", "min", "max", "fit", "svw", "lvw", "dvw", we, e]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [we, e, "min", "max", "fit"]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [we, e, "none", "full", "min", "max", "fit", "prose", {
          screen: [cn]
        }, cn]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: [we, e, "auto", "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": [we, e, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": [we, e, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Size
       * @see https://tailwindcss.com/docs/size
       */
      size: [{
        size: [we, e, "auto", "min", "max", "fit"]
      }],
      // Typography
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", cn, ln]
      }],
      /**
       * Font Smoothing
       * @see https://tailwindcss.com/docs/font-smoothing
       */
      "font-smoothing": ["antialiased", "subpixel-antialiased"],
      /**
       * Font Style
       * @see https://tailwindcss.com/docs/font-style
       */
      "font-style": ["italic", "not-italic"],
      /**
       * Font Weight
       * @see https://tailwindcss.com/docs/font-weight
       */
      "font-weight": [{
        font: ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black", gi]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [Sr]
      }],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-normal": ["normal-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-ordinal": ["ordinal"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-slashed-zero": ["slashed-zero"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-figure": ["lining-nums", "oldstyle-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-spacing": ["proportional-nums", "tabular-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-fraction": ["diagonal-fractions", "stacked-fractons"],
      /**
       * Letter Spacing
       * @see https://tailwindcss.com/docs/letter-spacing
       */
      tracking: [{
        tracking: ["tighter", "tight", "normal", "wide", "wider", "widest", we]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": ["none", On, gi]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: ["none", "tight", "snug", "normal", "relaxed", "loose", Ut, we]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", we]
      }],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      "list-style-type": [{
        list: ["none", "disc", "decimal", we]
      }],
      /**
       * List Style Position
       * @see https://tailwindcss.com/docs/list-style-position
       */
      "list-style-position": [{
        list: ["inside", "outside"]
      }],
      /**
       * Placeholder Color
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/placeholder-color
       */
      "placeholder-color": [{
        placeholder: [t]
      }],
      /**
       * Placeholder Opacity
       * @see https://tailwindcss.com/docs/placeholder-opacity
       */
      "placeholder-opacity": [{
        "placeholder-opacity": [v]
      }],
      /**
       * Text Alignment
       * @see https://tailwindcss.com/docs/text-align
       */
      "text-alignment": [{
        text: ["left", "center", "right", "justify", "start", "end"]
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: [t]
      }],
      /**
       * Text Opacity
       * @see https://tailwindcss.com/docs/text-opacity
       */
      "text-opacity": [{
        "text-opacity": [v]
      }],
      /**
       * Text Decoration
       * @see https://tailwindcss.com/docs/text-decoration
       */
      "text-decoration": ["underline", "overline", "line-through", "no-underline"],
      /**
       * Text Decoration Style
       * @see https://tailwindcss.com/docs/text-decoration-style
       */
      "text-decoration-style": [{
        decoration: [...M(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: ["auto", "from-font", Ut, ln]
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": ["auto", Ut, we]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: [t]
      }],
      /**
       * Text Transform
       * @see https://tailwindcss.com/docs/text-transform
       */
      "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
      /**
       * Text Overflow
       * @see https://tailwindcss.com/docs/text-overflow
       */
      "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
      /**
       * Text Wrap
       * @see https://tailwindcss.com/docs/text-wrap
       */
      "text-wrap": [{
        text: ["wrap", "nowrap", "balance", "pretty"]
      }],
      /**
       * Text Indent
       * @see https://tailwindcss.com/docs/text-indent
       */
      indent: [{
        indent: O()
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", we]
      }],
      /**
       * Whitespace
       * @see https://tailwindcss.com/docs/whitespace
       */
      whitespace: [{
        whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"]
      }],
      /**
       * Word Break
       * @see https://tailwindcss.com/docs/word-break
       */
      break: [{
        break: ["normal", "words", "all", "keep"]
      }],
      /**
       * Hyphens
       * @see https://tailwindcss.com/docs/hyphens
       */
      hyphens: [{
        hyphens: ["none", "manual", "auto"]
      }],
      /**
       * Content
       * @see https://tailwindcss.com/docs/content
       */
      content: [{
        content: ["none", we]
      }],
      // Backgrounds
      /**
       * Background Attachment
       * @see https://tailwindcss.com/docs/background-attachment
       */
      "bg-attachment": [{
        bg: ["fixed", "local", "scroll"]
      }],
      /**
       * Background Clip
       * @see https://tailwindcss.com/docs/background-clip
       */
      "bg-clip": [{
        "bg-clip": ["border", "padding", "content", "text"]
      }],
      /**
       * Background Opacity
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/background-opacity
       */
      "bg-opacity": [{
        "bg-opacity": [v]
      }],
      /**
       * Background Origin
       * @see https://tailwindcss.com/docs/background-origin
       */
      "bg-origin": [{
        "bg-origin": ["border", "padding", "content"]
      }],
      /**
       * Background Position
       * @see https://tailwindcss.com/docs/background-position
       */
      "bg-position": [{
        bg: [...S(), W1]
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      "bg-repeat": [{
        bg: ["no-repeat", {
          repeat: ["", "x", "y", "round", "space"]
        }]
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      "bg-size": [{
        bg: ["auto", "cover", "contain", j1]
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          "gradient-to": ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
        }, U1]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: [t]
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from-pos": [{
        from: [w]
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: [w]
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: [w]
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: [m]
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: [m]
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: [m]
      }],
      // Borders
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: [s]
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": [s]
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": [s]
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": [s]
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": [s]
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": [s]
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": [s]
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": [s]
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": [s]
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": [s]
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": [s]
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": [s]
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": [s]
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": [s]
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": [s]
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: [a]
      }],
      /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": [a]
      }],
      /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": [a]
      }],
      /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": [a]
      }],
      /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": [a]
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": [a]
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": [a]
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": [a]
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": [a]
      }],
      /**
       * Border Opacity
       * @see https://tailwindcss.com/docs/border-opacity
       */
      "border-opacity": [{
        "border-opacity": [v]
      }],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      "border-style": [{
        border: [...M(), "hidden"]
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-x": [{
        "divide-x": [a]
      }],
      /**
       * Divide Width X Reverse
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-x-reverse": ["divide-x-reverse"],
      /**
       * Divide Width Y
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-y": [{
        "divide-y": [a]
      }],
      /**
       * Divide Width Y Reverse
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-y-reverse": ["divide-y-reverse"],
      /**
       * Divide Opacity
       * @see https://tailwindcss.com/docs/divide-opacity
       */
      "divide-opacity": [{
        "divide-opacity": [v]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/divide-style
       */
      "divide-style": [{
        divide: M()
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: [i]
      }],
      /**
       * Border Color X
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": [i]
      }],
      /**
       * Border Color Y
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": [i]
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": [i]
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": [i]
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": [i]
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": [i]
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: [i]
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: ["", ...M()]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [Ut, we]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: [Ut, ln]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: [t]
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/ring-width
       */
      "ring-w": [{
        ring: Q()
      }],
      /**
       * Ring Width Inset
       * @see https://tailwindcss.com/docs/ring-width
       */
      "ring-w-inset": ["ring-inset"],
      /**
       * Ring Color
       * @see https://tailwindcss.com/docs/ring-color
       */
      "ring-color": [{
        ring: [t]
      }],
      /**
       * Ring Opacity
       * @see https://tailwindcss.com/docs/ring-opacity
       */
      "ring-opacity": [{
        "ring-opacity": [v]
      }],
      /**
       * Ring Offset Width
       * @see https://tailwindcss.com/docs/ring-offset-width
       */
      "ring-offset-w": [{
        "ring-offset": [Ut, ln]
      }],
      /**
       * Ring Offset Color
       * @see https://tailwindcss.com/docs/ring-offset-color
       */
      "ring-offset-color": [{
        "ring-offset": [t]
      }],
      // Effects
      /**
       * Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow
       */
      shadow: [{
        shadow: ["", "inner", "none", cn, q1]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow-color
       */
      "shadow-color": [{
        shadow: [Sr]
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [v]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...P(), "plus-lighter", "plus-darker"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": P()
      }],
      // Filters
      /**
       * Filter
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/filter
       */
      filter: [{
        filter: ["", "none"]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: [n]
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [r]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [l]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      "drop-shadow": [{
        "drop-shadow": ["", "none", cn, we]
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: [c]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [u]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: [f]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [C]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: [E]
      }],
      /**
       * Backdrop Filter
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/backdrop-filter
       */
      "backdrop-filter": [{
        "backdrop-filter": ["", "none"]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": [n]
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [r]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [l]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": [c]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [u]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": [f]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [v]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [C]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": [E]
      }],
      // Tables
      /**
       * Border Collapse
       * @see https://tailwindcss.com/docs/border-collapse
       */
      "border-collapse": [{
        border: ["collapse", "separate"]
      }],
      /**
       * Border Spacing
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing": [{
        "border-spacing": [o]
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": [o]
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": [o]
      }],
      /**
       * Table Layout
       * @see https://tailwindcss.com/docs/table-layout
       */
      "table-layout": [{
        table: ["auto", "fixed"]
      }],
      /**
       * Caption Side
       * @see https://tailwindcss.com/docs/caption-side
       */
      caption: [{
        caption: ["top", "bottom"]
      }],
      // Transitions and Animation
      /**
       * Tranisition Property
       * @see https://tailwindcss.com/docs/transition-property
       */
      transition: [{
        transition: ["none", "all", "", "colors", "opacity", "shadow", "transform", we]
      }],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [{
        duration: $()
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "in", "out", "in-out", we]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: $()
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", "spin", "ping", "pulse", "bounce", we]
      }],
      // Transforms
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: ["", "gpu", "none"]
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: [_]
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": [_]
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": [_]
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: [_r, we]
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": [x]
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": [x]
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": [F]
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": [F]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: ["center", "top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left", "top-left", we]
      }],
      // Interactivity
      /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */
      accent: [{
        accent: ["auto", t]
      }],
      /**
       * Appearance
       * @see https://tailwindcss.com/docs/appearance
       */
      appearance: [{
        appearance: ["none", "auto"]
      }],
      /**
       * Cursor
       * @see https://tailwindcss.com/docs/cursor
       */
      cursor: [{
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", we]
      }],
      /**
       * Caret Color
       * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
       */
      "caret-color": [{
        caret: [t]
      }],
      /**
       * Pointer Events
       * @see https://tailwindcss.com/docs/pointer-events
       */
      "pointer-events": [{
        "pointer-events": ["none", "auto"]
      }],
      /**
       * Resize
       * @see https://tailwindcss.com/docs/resize
       */
      resize: [{
        resize: ["none", "y", "x", ""]
      }],
      /**
       * Scroll Behavior
       * @see https://tailwindcss.com/docs/scroll-behavior
       */
      "scroll-behavior": [{
        scroll: ["auto", "smooth"]
      }],
      /**
       * Scroll Margin
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-m": [{
        "scroll-m": O()
      }],
      /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": O()
      }],
      /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": O()
      }],
      /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": O()
      }],
      /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": O()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": O()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": O()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": O()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": O()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": O()
      }],
      /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": O()
      }],
      /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": O()
      }],
      /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": O()
      }],
      /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": O()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": O()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": O()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": O()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": O()
      }],
      /**
       * Scroll Snap Align
       * @see https://tailwindcss.com/docs/scroll-snap-align
       */
      "snap-align": [{
        snap: ["start", "end", "center", "align-none"]
      }],
      /**
       * Scroll Snap Stop
       * @see https://tailwindcss.com/docs/scroll-snap-stop
       */
      "snap-stop": [{
        snap: ["normal", "always"]
      }],
      /**
       * Scroll Snap Type
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-type": [{
        snap: ["none", "x", "y", "both"]
      }],
      /**
       * Scroll Snap Type Strictness
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-strictness": [{
        snap: ["mandatory", "proximity"]
      }],
      /**
       * Touch Action
       * @see https://tailwindcss.com/docs/touch-action
       */
      touch: [{
        touch: ["auto", "none", "manipulation"]
      }],
      /**
       * Touch Action X
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-x": [{
        "touch-pan": ["x", "left", "right"]
      }],
      /**
       * Touch Action Y
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-y": [{
        "touch-pan": ["y", "up", "down"]
      }],
      /**
       * Touch Action Pinch Zoom
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-pz": ["touch-pinch-zoom"],
      /**
       * User Select
       * @see https://tailwindcss.com/docs/user-select
       */
      select: [{
        select: ["none", "text", "all", "auto"]
      }],
      /**
       * Will Change
       * @see https://tailwindcss.com/docs/will-change
       */
      "will-change": [{
        "will-change": ["auto", "scroll", "contents", "transform", we]
      }],
      // SVG
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: [t, "none"]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [Ut, ln, gi]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: [t, "none"]
      }],
      // Accessibility
      /**
       * Screen Readers
       * @see https://tailwindcss.com/docs/screen-readers
       */
      sr: ["sr-only", "not-sr-only"],
      /**
       * Forced Color Adjust
       * @see https://tailwindcss.com/docs/forced-color-adjust
       */
      "forced-color-adjust": [{
        "forced-color-adjust": ["auto", "none"]
      }]
    },
    conflictingClassGroups: {
      overflow: ["overflow-x", "overflow-y"],
      overscroll: ["overscroll-x", "overscroll-y"],
      inset: ["inset-x", "inset-y", "start", "end", "top", "right", "bottom", "left"],
      "inset-x": ["right", "left"],
      "inset-y": ["top", "bottom"],
      flex: ["basis", "grow", "shrink"],
      gap: ["gap-x", "gap-y"],
      p: ["px", "py", "ps", "pe", "pt", "pr", "pb", "pl"],
      px: ["pr", "pl"],
      py: ["pt", "pb"],
      m: ["mx", "my", "ms", "me", "mt", "mr", "mb", "ml"],
      mx: ["mr", "ml"],
      my: ["mt", "mb"],
      size: ["w", "h"],
      "font-size": ["leading"],
      "fvn-normal": ["fvn-ordinal", "fvn-slashed-zero", "fvn-figure", "fvn-spacing", "fvn-fraction"],
      "fvn-ordinal": ["fvn-normal"],
      "fvn-slashed-zero": ["fvn-normal"],
      "fvn-figure": ["fvn-normal"],
      "fvn-spacing": ["fvn-normal"],
      "fvn-fraction": ["fvn-normal"],
      "line-clamp": ["display", "overflow"],
      rounded: ["rounded-s", "rounded-e", "rounded-t", "rounded-r", "rounded-b", "rounded-l", "rounded-ss", "rounded-se", "rounded-ee", "rounded-es", "rounded-tl", "rounded-tr", "rounded-br", "rounded-bl"],
      "rounded-s": ["rounded-ss", "rounded-es"],
      "rounded-e": ["rounded-se", "rounded-ee"],
      "rounded-t": ["rounded-tl", "rounded-tr"],
      "rounded-r": ["rounded-tr", "rounded-br"],
      "rounded-b": ["rounded-br", "rounded-bl"],
      "rounded-l": ["rounded-tl", "rounded-bl"],
      "border-spacing": ["border-spacing-x", "border-spacing-y"],
      "border-w": ["border-w-s", "border-w-e", "border-w-t", "border-w-r", "border-w-b", "border-w-l"],
      "border-w-x": ["border-w-r", "border-w-l"],
      "border-w-y": ["border-w-t", "border-w-b"],
      "border-color": ["border-color-t", "border-color-r", "border-color-b", "border-color-l"],
      "border-color-x": ["border-color-r", "border-color-l"],
      "border-color-y": ["border-color-t", "border-color-b"],
      "scroll-m": ["scroll-mx", "scroll-my", "scroll-ms", "scroll-me", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml"],
      "scroll-mx": ["scroll-mr", "scroll-ml"],
      "scroll-my": ["scroll-mt", "scroll-mb"],
      "scroll-p": ["scroll-px", "scroll-py", "scroll-ps", "scroll-pe", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl"],
      "scroll-px": ["scroll-pr", "scroll-pl"],
      "scroll-py": ["scroll-pt", "scroll-pb"],
      touch: ["touch-x", "touch-y", "touch-pz"],
      "touch-x": ["touch"],
      "touch-y": ["touch"],
      "touch-pz": ["touch"]
    },
    conflictingClassGroupModifiers: {
      "font-size": ["leading"]
    }
  };
}
function Q1(t, {
  cacheSize: e,
  prefix: n,
  separator: r,
  extend: i = {},
  override: s = {}
}) {
  Ci(t, "cacheSize", e), Ci(t, "prefix", n), Ci(t, "separator", r);
  for (const o in s)
    J1(t[o], s[o]);
  for (const o in i)
    Z1(t[o], i[o]);
  return t;
}
function Ci(t, e, n) {
  n !== void 0 && (t[e] = n);
}
function J1(t, e) {
  if (e)
    for (const n in e)
      Ci(t, n, e[n]);
}
function Z1(t, e) {
  if (e)
    for (const n in e) {
      const r = e[n];
      r !== void 0 && (t[n] = (t[n] || []).concat(r));
    }
}
function em(t, ...e) {
  return typeof t == "function" ? Ra(Va, t, ...e) : Ra(() => Q1(Va(), t), ...e);
}
var tm = em({ prefix: "tw-" }), G = (...t) => tm(x1(t));
function Uc(t) {
  var e, n, r = "";
  if (typeof t == "string" || typeof t == "number")
    r += t;
  else if (typeof t == "object")
    if (Array.isArray(t))
      for (e = 0; e < t.length; e++)
        t[e] && (n = Uc(t[e])) && (r && (r += " "), r += n);
    else
      for (e in t)
        t[e] && (r && (r += " "), r += e);
  return r;
}
function nm() {
  for (var t, e, n = 0, r = ""; n < arguments.length; )
    (t = arguments[n++]) && (e = Uc(t)) && (r && (r += " "), r += e);
  return r;
}
const Na = (t) => typeof t == "boolean" ? "".concat(t) : t === 0 ? "0" : t, Ka = nm, bn = (t, e) => (n) => {
  var r;
  if ((e == null ? void 0 : e.variants) == null)
    return Ka(t, n == null ? void 0 : n.class, n == null ? void 0 : n.className);
  const { variants: i, defaultVariants: s } = e, o = Object.keys(i).map((c) => {
    const u = n == null ? void 0 : n[c], f = s == null ? void 0 : s[c];
    if (u === null)
      return null;
    const h = Na(u) || Na(f);
    return i[c][h];
  }), a = n && Object.entries(n).reduce((c, u) => {
    let [f, h] = u;
    return h === void 0 || (c[f] = h), c;
  }, {}), l = e == null || (r = e.compoundVariants) === null || r === void 0 ? void 0 : r.reduce((c, u) => {
    let { class: f, className: h, ...m } = u;
    return Object.entries(m).every((w) => {
      let [g, p] = w;
      return Array.isArray(p) ? p.includes({
        ...s,
        ...a
      }[g]) : {
        ...s,
        ...a
      }[g] === p;
    }) ? [
      ...c,
      f,
      h
    ] : c;
  }, []);
  return Ka(t, o, l, n == null ? void 0 : n.class, n == null ? void 0 : n.className);
};
var rm = L("<div><div>"), im = bn("tw-mx-2 tw-line-clamp-2 tw-text-balance tw-rounded-full tw-bg-primary/80 tw-px-4 tw-py-1 tw-text-center tw-text-xs tw-text-primary-foreground tw-shadow-md", { variants: { variant: { default: "tw-bg-primary tw-text-primary-foreground", destructive: "tw-bg-destructive tw-text-destructive-foreground" } }, defaultVariants: { variant: "default" } }), sm = (t) => {
  let e = D({ duration: 3e3 }, t), [n, r] = K(e, ["class", "children", "variant", "duration", "open", "onOpenChange"]);
  return Z(() => {
    n.open && setTimeout(() => {
      var i;
      (i = n.onOpenChange) == null || i.call(n, !1);
    }, n.duration);
  }), (() => {
    var i = rm(), s = i.firstChild;
    return nt(i, D({ get class() {
      return G("tw-invisible tw-absolute tw-bottom-20 tw-left-0 tw-right-0 tw-z-[100] tw-m-auto tw-w-fit tw-max-w-sm tw-translate-y-full tw-text-balance tw-opacity-0 tw-duration-500 tw-ease-in-out", n.open && "!tw-visible !tw-opacity-100");
    } }, r), !1, !0), k(s, () => n.children), oe(() => De(s, G(im({ variant: n.variant }), n.class))), i;
  })();
}, qc = Fe(), Gc = () => {
  let t = Ne(qc);
  if (!t)
    throw new Error("Toast Context not found");
  return t;
}, om = (t) => {
  let e, [n] = K(t, ["children"]), [r, i] = N({ open: !1 }), s = () => {
    e && clearTimeout(e), e = setTimeout(() => i({ ...r(), open: !1 }), 3e3);
  };
  return d(qc.Provider, { value: { show: (o) => {
    s(), i({ open: !0, content: o, variant: "default" });
  }, destructive: (o) => {
    s(), i({ open: !0, content: o, variant: "destructive" });
  } }, get children() {
    return [J(() => n.children), d(sm, { get open() {
      return r().open;
    }, get variant() {
      return r().variant;
    }, get children() {
      return r().content;
    } })];
  } });
};
function Yc(t) {
  return (...e) => {
    for (const n of t)
      n && n(...e);
  };
}
function am(t) {
  return (...e) => {
    for (let n = t.length - 1; n >= 0; n--) {
      const r = t[n];
      r && r(...e);
    }
  };
}
var R = (t) => typeof t == "function" && !t.length ? t() : t, Ba = (t) => Array.isArray(t) ? t : t ? [t] : [];
function lm(t, ...e) {
  return typeof t == "function" ? t(...e) : t;
}
var cm = me;
function um(t, e, n, r) {
  return t.addEventListener(e, n, r), cm(t.removeEventListener.bind(t, e, n, r));
}
function dm(t, e, n, r) {
  const i = () => {
    Ba(R(t)).forEach((s) => {
      s && Ba(R(e)).forEach((o) => um(s, o, n, r));
    });
  };
  typeof t == "function" ? Z(i) : oe(i);
}
function mi() {
  return !0;
}
var fm = {
  get(t, e, n) {
    return e === Ye ? n : t.get(e);
  },
  has(t, e) {
    return t.has(e);
  },
  set: mi,
  deleteProperty: mi,
  getOwnPropertyDescriptor(t, e) {
    return {
      configurable: !0,
      enumerable: !0,
      get() {
        return t.get(e);
      },
      set: mi,
      deleteProperty: mi
    };
  },
  ownKeys(t) {
    return t.keys();
  }
}, hm = /((?:--)?(?:\w+-?)+)\s*:\s*([^;]*)/g;
function ja(t) {
  const e = {};
  let n;
  for (; n = hm.exec(t); )
    e[n[1]] = n[2];
  return e;
}
function gm(t, e) {
  if (typeof t == "string") {
    if (typeof e == "string")
      return `${t};${e}`;
    t = ja(t);
  } else
    typeof e == "string" && (e = ja(e));
  return { ...t, ...e };
}
var Ds = (t, e, n) => {
  let r;
  for (const i of t) {
    const s = R(i)[e];
    r ? s && (r = n(r, s)) : r = s;
  }
  return r;
};
function mm(...t) {
  var o;
  const e = Array.isArray(t[0]), n = e ? t[0] : t;
  if (n.length === 1)
    return n[0];
  const r = e && ((o = t[1]) != null && o.reverseEventHandlers) ? am : Yc, i = {};
  for (const a of n) {
    const l = R(a);
    for (const c in l)
      if (c[0] === "o" && c[1] === "n" && c[2]) {
        const u = l[c], f = c.toLowerCase(), h = typeof u == "function" ? u : (
          // jsx event handlers can be tuples of [callback, arg]
          Array.isArray(u) ? u.length === 1 ? u[0] : u[0].bind(void 0, u[1]) : void 0
        );
        h ? i[f] ? i[f].push(h) : i[f] = [h] : delete i[f];
      }
  }
  const s = D(...n);
  return new Proxy(
    {
      get(a) {
        if (typeof a != "string")
          return Reflect.get(s, a);
        if (a === "style")
          return Ds(n, "style", gm);
        if (a === "ref") {
          const l = [];
          for (const c of n) {
            const u = R(c)[a];
            typeof u == "function" && l.push(u);
          }
          return r(l);
        }
        if (a[0] === "o" && a[1] === "n" && a[2]) {
          const l = i[a.toLowerCase()];
          return l ? r(l) : Reflect.get(s, a);
        }
        return a === "class" || a === "className" ? Ds(n, a, (l, c) => `${l} ${c}`) : a === "classList" ? Ds(n, a, (l, c) => ({ ...l, ...c })) : Reflect.get(s, a);
      },
      has(a) {
        return Reflect.has(s, a);
      },
      keys() {
        return Object.keys(s);
      }
    },
    fm
  );
}
function _e(...t) {
  return Yc(t);
}
function wm(t, e, n = -1) {
  return n in t ? [...t.slice(0, n), e, ...t.slice(n)] : [...t, e];
}
function ao(t, e) {
  const n = [...t], r = n.indexOf(e);
  return r !== -1 && n.splice(r, 1), n;
}
function pm(t) {
  return typeof t == "number";
}
function vm(t) {
  return Array.isArray(t);
}
function Kn(t) {
  return Object.prototype.toString.call(t) === "[object String]";
}
function fn(t) {
  return typeof t == "function";
}
function Et(t) {
  return (e) => `${t()}-${e}`;
}
function dt(t, e) {
  return t ? t === e || t.contains(e) : !1;
}
function Pr(t, e = !1) {
  const { activeElement: n } = Qt(t);
  if (!(n != null && n.nodeName))
    return null;
  if (Xc(n) && n.contentDocument)
    return Pr(n.contentDocument.body, e);
  if (e) {
    const r = n.getAttribute("aria-activedescendant");
    if (r) {
      const i = Qt(n).getElementById(r);
      if (i)
        return i;
    }
  }
  return n;
}
function Qt(t) {
  return t ? t.ownerDocument || t : document;
}
function Xc(t) {
  return t.tagName === "IFRAME";
}
var Jr = /* @__PURE__ */ ((t) => (t.Escape = "Escape", t.Enter = "Enter", t.Tab = "Tab", t.Space = " ", t.ArrowDown = "ArrowDown", t.ArrowLeft = "ArrowLeft", t.ArrowRight = "ArrowRight", t.ArrowUp = "ArrowUp", t.End = "End", t.Home = "Home", t.PageDown = "PageDown", t.PageUp = "PageUp", t))(Jr || {});
function Ro(t) {
  var e;
  return typeof window < "u" && window.navigator != null ? (
    // @ts-ignore
    t.test(((e = window.navigator.userAgentData) == null ? void 0 : e.platform) || window.navigator.platform)
  ) : !1;
}
function is() {
  return Ro(/^Mac/i);
}
function bm() {
  return Ro(/^iPhone/i);
}
function ym() {
  return Ro(/^iPad/i) || // iPadOS 13 lies and says it's a Mac, but we can distinguish by detecting touch support.
  is() && navigator.maxTouchPoints > 1;
}
function xm() {
  return bm() || ym();
}
function _i() {
  return is() || xm();
}
function ce(t, e) {
  return e && (fn(e) ? e(t) : e[0](e[1], t)), t == null ? void 0 : t.defaultPrevented;
}
function ut(t) {
  return (e) => {
    for (const n of t)
      ce(e, n);
  };
}
function km(t) {
  return is() ? t.metaKey && !t.ctrlKey : t.ctrlKey && !t.metaKey;
}
function Ue(t) {
  if (t)
    if (Cm())
      t.focus({ preventScroll: !0 });
    else {
      const e = _m(t);
      t.focus(), Sm(e);
    }
}
var wi = null;
function Cm() {
  if (wi == null) {
    wi = !1;
    try {
      document.createElement("div").focus({
        get preventScroll() {
          return wi = !0, !0;
        }
      });
    } catch {
    }
  }
  return wi;
}
function _m(t) {
  let e = t.parentNode;
  const n = [], r = document.scrollingElement || document.documentElement;
  for (; e instanceof HTMLElement && e !== r; )
    (e.offsetHeight < e.scrollHeight || e.offsetWidth < e.scrollWidth) && n.push({
      element: e,
      scrollTop: e.scrollTop,
      scrollLeft: e.scrollLeft
    }), e = e.parentNode;
  return r instanceof HTMLElement && n.push({
    element: r,
    scrollTop: r.scrollTop,
    scrollLeft: r.scrollLeft
  }), n;
}
function Sm(t) {
  for (const { element: e, scrollTop: n, scrollLeft: r } of t)
    e.scrollTop = n, e.scrollLeft = r;
}
var Qc = [
  "input:not([type='hidden']):not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "button:not([disabled])",
  "a[href]",
  "area[href]",
  "[tabindex]",
  "iframe",
  "object",
  "embed",
  "audio[controls]",
  "video[controls]",
  "[contenteditable]:not([contenteditable='false'])"
], Mm = [...Qc, '[tabindex]:not([tabindex="-1"]):not([disabled])'], Vo = Qc.join(":not([hidden]),") + ",[tabindex]:not([disabled]):not([hidden])", Om = Mm.join(
  ':not([hidden]):not([tabindex="-1"]),'
);
function Jc(t, e) {
  const r = Array.from(t.querySelectorAll(Vo)).filter(Wa);
  return e && Wa(t) && r.unshift(t), r.forEach((i, s) => {
    if (Xc(i) && i.contentDocument) {
      const o = i.contentDocument.body, a = Jc(o, !1);
      r.splice(s, 1, ...a);
    }
  }), r;
}
function Wa(t) {
  return Zc(t) && !Em(t);
}
function Zc(t) {
  return t.matches(Vo) && No(t);
}
function Em(t) {
  return parseInt(t.getAttribute("tabindex") || "0", 10) < 0;
}
function No(t, e) {
  return t.nodeName !== "#comment" && Im(t) && Pm(t, e) && (!t.parentElement || No(t.parentElement, t));
}
function Im(t) {
  if (!(t instanceof HTMLElement) && !(t instanceof SVGElement))
    return !1;
  const { display: e, visibility: n } = t.style;
  let r = e !== "none" && n !== "hidden" && n !== "collapse";
  if (r) {
    if (!t.ownerDocument.defaultView)
      return r;
    const { getComputedStyle: i } = t.ownerDocument.defaultView, { display: s, visibility: o } = i(t);
    r = s !== "none" && o !== "hidden" && o !== "collapse";
  }
  return r;
}
function Pm(t, e) {
  return !t.hasAttribute("hidden") && (t.nodeName === "DETAILS" && e && e.nodeName !== "SUMMARY" ? t.hasAttribute("open") : !0);
}
function Dm(t, e, n) {
  const r = e != null && e.tabbable ? Om : Vo, i = document.createTreeWalker(t, NodeFilter.SHOW_ELEMENT, {
    acceptNode(s) {
      var o;
      return (o = e == null ? void 0 : e.from) != null && o.contains(s) ? NodeFilter.FILTER_REJECT : s.matches(r) && No(s) && !n && (!(e != null && e.accept) || e.accept(s)) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  return e != null && e.from && (i.currentNode = e.from), i;
}
function Ha(t) {
  for (; t && !$m(t); )
    t = t.parentElement;
  return t || document.scrollingElement || document.documentElement;
}
function $m(t) {
  const e = window.getComputedStyle(t);
  return /(auto|scroll)/.test(e.overflow + e.overflowX + e.overflowY);
}
function Tm() {
}
function eu(t, e = -1 / 0, n = 1 / 0) {
  return Math.min(Math.max(t, e), n);
}
function $s(t, e, n, r) {
  const i = (t - (isNaN(e) ? 0 : e)) % r;
  let s = Math.abs(i) * 2 >= r ? t + Math.sign(i) * (r - Math.abs(i)) : t - i;
  isNaN(e) ? !isNaN(n) && s > n && (s = Math.floor(n / r) * r) : s < e ? s = e : !isNaN(n) && s > n && (s = e + Math.floor((n - e) / r) * r);
  const o = r.toString(), a = o.indexOf("."), l = a >= 0 ? o.length - a : 0;
  if (l > 0) {
    const c = Math.pow(10, l);
    s = Math.round(s * c) / c;
  }
  return s;
}
function Am(t, e) {
  const [n, r] = t;
  let i = !1;
  const s = e.length;
  for (let o = s, a = 0, l = o - 1; a < o; l = a++) {
    const [c, u] = e[a], [f, h] = e[l], [, m] = e[l === 0 ? o - 1 : l - 1] || [0, 0], w = (u - h) * (n - c) - (c - f) * (r - u);
    if (h < u) {
      if (r >= h && r < u) {
        if (w === 0)
          return !0;
        w > 0 && (r === h ? r > m && (i = !i) : i = !i);
      }
    } else if (u < h) {
      if (r > u && r <= h) {
        if (w === 0)
          return !0;
        w < 0 && (r === h ? r < m && (i = !i) : i = !i);
      }
    } else if (r == u && (n >= f && n <= c || n >= c && n <= f))
      return !0;
  }
  return i;
}
function fe(t, e) {
  return D(t, e);
}
var Mr = /* @__PURE__ */ new Map(), Ua = /* @__PURE__ */ new Set();
function qa() {
  if (typeof window > "u")
    return;
  const t = (n) => {
    if (!n.target)
      return;
    let r = Mr.get(n.target);
    r || (r = /* @__PURE__ */ new Set(), Mr.set(n.target, r), n.target.addEventListener("transitioncancel", e)), r.add(n.propertyName);
  }, e = (n) => {
    if (!n.target)
      return;
    const r = Mr.get(n.target);
    if (r && (r.delete(n.propertyName), r.size === 0 && (n.target.removeEventListener("transitioncancel", e), Mr.delete(n.target)), Mr.size === 0)) {
      for (const i of Ua)
        i();
      Ua.clear();
    }
  };
  document.body.addEventListener("transitionrun", t), document.body.addEventListener("transitionend", e);
}
typeof document < "u" && (document.readyState !== "loading" ? qa() : document.addEventListener("DOMContentLoaded", qa));
function lo(t, e) {
  const n = Ga(t, e, "left"), r = Ga(t, e, "top"), i = e.offsetWidth, s = e.offsetHeight;
  let o = t.scrollLeft, a = t.scrollTop;
  const l = o + t.offsetWidth, c = a + t.offsetHeight;
  n <= o ? o = n : n + i > l && (o += n + i - l), r <= a ? a = r : r + s > c && (a += r + s - c), t.scrollLeft = o, t.scrollTop = a;
}
function Ga(t, e, n) {
  const r = n === "left" ? "offsetLeft" : "offsetTop";
  let i = 0;
  for (; e.offsetParent && (i += e[r], e.offsetParent !== t); ) {
    if (e.offsetParent.contains(t)) {
      i -= t[r];
      break;
    }
    e = e.offsetParent;
  }
  return i;
}
function Lm(t, e) {
  var n, r;
  if (document.contains(t)) {
    const i = document.scrollingElement || document.documentElement;
    if (window.getComputedStyle(i).overflow === "hidden") {
      let o = Ha(t);
      for (; t && o && t !== i && o !== i; )
        lo(o, t), t = o, o = Ha(t);
    } else {
      const { left: o, top: a } = t.getBoundingClientRect();
      (n = t == null ? void 0 : t.scrollIntoView) == null || n.call(t, { block: "nearest" });
      const { left: l, top: c } = t.getBoundingClientRect();
      (Math.abs(o - l) > 1 || Math.abs(a - c) > 1) && ((r = t.scrollIntoView) == null || r.call(t, { block: "nearest" }));
    }
  }
}
var Zr = {
  border: "0",
  clip: "rect(0 0 0 0)",
  "clip-path": "inset(50%)",
  height: "1px",
  margin: "0 -1px -1px 0",
  overflow: "hidden",
  padding: "0",
  position: "absolute",
  width: "1px",
  "white-space": "nowrap"
};
function co(t) {
  let e = t.startIndex ?? 0;
  const n = t.startLevel ?? 0, r = [], i = (l) => {
    if (l == null)
      return "";
    const c = t.getKey ?? "key", u = Kn(c) ? l[c] : c(l);
    return u != null ? String(u) : "";
  }, s = (l) => {
    if (l == null)
      return "";
    const c = t.getTextValue ?? "textValue", u = Kn(c) ? l[c] : c(l);
    return u != null ? String(u) : "";
  }, o = (l) => {
    if (l == null)
      return !1;
    const c = t.getDisabled ?? "disabled";
    return (Kn(c) ? l[c] : c(l)) ?? !1;
  }, a = (l) => {
    var c;
    if (l != null)
      return Kn(t.getSectionChildren) ? l[t.getSectionChildren] : (c = t.getSectionChildren) == null ? void 0 : c.call(t, l);
  };
  for (const l of t.dataSource) {
    if (Kn(l) || pm(l)) {
      r.push({
        type: "item",
        rawValue: l,
        key: String(l),
        textValue: String(l),
        disabled: o(l),
        level: n,
        index: e
      }), e++;
      continue;
    }
    if (a(l) != null) {
      r.push({
        type: "section",
        rawValue: l,
        key: "",
        textValue: "",
        disabled: !1,
        level: n,
        index: e
      }), e++;
      const c = a(l) ?? [];
      if (c.length > 0) {
        const u = co({
          dataSource: c,
          getKey: t.getKey,
          getTextValue: t.getTextValue,
          getDisabled: t.getDisabled,
          getSectionChildren: t.getSectionChildren,
          startIndex: e,
          startLevel: n + 1
        });
        r.push(...u), e += u.length;
      }
    } else
      r.push({
        type: "item",
        rawValue: l,
        key: i(l),
        textValue: s(l),
        disabled: o(l),
        level: n,
        index: e
      }), e++;
  }
  return r;
}
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/bfce84fee12a027d9cbc38b43e1747e3e4b4b169/packages/@react-stately/collections/src/useCollection.ts
 */
function Fm(t, e = []) {
  const n = co({
    dataSource: R(t.dataSource),
    getKey: R(t.getKey),
    getTextValue: R(t.getTextValue),
    getDisabled: R(t.getDisabled),
    getSectionChildren: R(t.getSectionChildren)
  }), [r, i] = N(t.factory(n));
  return Z(He([
    () => R(t.dataSource),
    () => R(t.getKey),
    () => R(t.getTextValue),
    () => R(t.getDisabled),
    () => R(t.getSectionChildren),
    () => t.factory,
    ...e
  ], ([s, o, a, l, c, u]) => {
    const f = co({
      dataSource: s,
      getKey: o,
      getTextValue: a,
      getDisabled: l,
      getSectionChildren: c
    });
    i(() => u(f));
  }, {
    defer: !0
  })), r;
}
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/22cb32d329e66c60f55d4fc4025d1d44bb015d71/packages/@react-stately/collections/src/getItemCount.ts
 */
const Ya = /* @__PURE__ */ new WeakMap();
function Xa(t) {
  let e = Ya.get(t);
  if (e != null)
    return e;
  e = 0;
  for (const n of t)
    n.type === "item" && e++;
  return Ya.set(t, e), e;
}
function sr(t) {
  var o;
  const [e, n] = N((o = t.defaultValue) == null ? void 0 : o.call(t)), r = J(() => {
    var a;
    return ((a = t.value) == null ? void 0 : a.call(t)) !== void 0;
  }), i = J(() => {
    var a;
    return r() ? (a = t.value) == null ? void 0 : a.call(t) : e();
  });
  return [i, (a) => {
    lt(() => {
      var c;
      const l = lm(a, i());
      return Object.is(l, i()) || (r() || n(l), (c = t.onChange) == null || c.call(t, l)), l;
    });
  }];
}
function tu(t) {
  const [e, n] = sr(t);
  return [() => e() ?? !1, n];
}
function nu(t) {
  const [e, n] = sr(t);
  return [() => e() ?? [], n];
}
function or(t = {}) {
  const [e, n] = tu({
    value: () => R(t.open),
    defaultValue: () => !!R(t.defaultOpen),
    onChange: (o) => {
      var a;
      return (a = t.onOpenChange) == null ? void 0 : a.call(t, o);
    }
  }), r = () => {
    n(!0);
  }, i = () => {
    n(!1);
  };
  return {
    isOpen: e,
    setIsOpen: n,
    open: r,
    close: i,
    toggle: () => {
      e() ? i() : r();
    }
  };
}
function zm(t) {
  const e = (n) => {
    var r;
    n.key === Jr.Escape && ((r = t.onEscapeKeyDown) == null || r.call(t, n));
  };
  Z(() => {
    var r;
    if (R(t.isDisabled))
      return;
    const n = ((r = t.ownerDocument) == null ? void 0 : r.call(t)) ?? Qt();
    n.addEventListener("keydown", e), me(() => {
      n.removeEventListener("keydown", e);
    });
  });
}
/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/81b25f4b40c54f72aeb106ca0e64e1e09655153e/packages/react/dismissable-layer/src/DismissableLayer.tsx
 *
 * Portions of this file are based on code from zag.
 * MIT Licensed, Copyright (c) 2021 Chakra UI.
 *
 * Credits to the Chakra UI team:
 * https://github.com/chakra-ui/zag/blob/d1dbf9e240803c9e3ed81ebef363739be4273de0/packages/utilities/dismissable/src/layer-stack.ts
 */
const Fi = "data-kb-top-layer";
let ru, uo = !1;
const Jt = [];
function qr(t) {
  return Jt.findIndex((e) => e.node === t);
}
function Rm(t) {
  return Jt[qr(t)];
}
function Vm(t) {
  return Jt[Jt.length - 1].node === t;
}
function iu() {
  return Jt.filter((t) => t.isPointerBlocking);
}
function Nm() {
  return [...iu()].slice(-1)[0];
}
function Ko() {
  return iu().length > 0;
}
function su(t) {
  var n;
  const e = qr((n = Nm()) == null ? void 0 : n.node);
  return qr(t) < e;
}
function Km(t) {
  Jt.push(t);
}
function Bm(t) {
  const e = qr(t);
  e < 0 || Jt.splice(e, 1);
}
function jm() {
  for (const {
    node: t
  } of Jt)
    t.style.pointerEvents = su(t) ? "none" : "auto";
}
function Wm(t) {
  if (Ko() && !uo) {
    const e = Qt(t);
    ru = document.body.style.pointerEvents, e.body.style.pointerEvents = "none", uo = !0;
  }
}
function Hm(t) {
  if (Ko())
    return;
  const e = Qt(t);
  e.body.style.pointerEvents = ru, e.body.style.length === 0 && e.body.removeAttribute("style"), uo = !1;
}
const gt = {
  layers: Jt,
  isTopMostLayer: Vm,
  hasPointerBlockingLayer: Ko,
  isBelowPointerBlockingLayer: su,
  addLayer: Km,
  removeLayer: Bm,
  indexOf: qr,
  find: Rm,
  assignPointerEventToLayers: jm,
  disableBodyPointerEvents: Wm,
  restoreBodyPointerEvents: Hm
};
/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/81b25f4b40c54f72aeb106ca0e64e1e09655153e/packages/react/focus-scope/src/FocusScope.tsx
 *
 * Portions of this file are based on code from zag.
 * MIT Licensed, Copyright (c) 2021 Chakra UI.
 *
 * Credits to the Chakra UI team:
 * https://github.com/chakra-ui/zag/blob/d1dbf9e240803c9e3ed81ebef363739be4273de0/packages/utilities/focus-scope/src/focus-on-child-unmount.ts
 * https://github.com/chakra-ui/zag/blob/d1dbf9e240803c9e3ed81ebef363739be4273de0/packages/utilities/focus-scope/src/focus-containment.ts
 */
const Ts = "focusScope.autoFocusOnMount", As = "focusScope.autoFocusOnUnmount", Qa = {
  bubbles: !1,
  cancelable: !0
}, Ja = {
  /** A stack of focus scopes, with the active one at the top */
  stack: [],
  active() {
    return this.stack[0];
  },
  add(t) {
    var e;
    t !== this.active() && ((e = this.active()) == null || e.pause()), this.stack = ao(this.stack, t), this.stack.unshift(t);
  },
  remove(t) {
    var e;
    this.stack = ao(this.stack, t), (e = this.active()) == null || e.resume();
  }
};
function ss(t, e) {
  const [n, r] = N(!1), i = {
    pause() {
      r(!0);
    },
    resume() {
      r(!1);
    }
  };
  let s = null;
  const o = (w) => {
    var g;
    return (g = t.onMountAutoFocus) == null ? void 0 : g.call(t, w);
  }, a = (w) => {
    var g;
    return (g = t.onUnmountAutoFocus) == null ? void 0 : g.call(t, w);
  }, l = () => Qt(e()), c = () => {
    const w = l().createElement("span");
    return w.setAttribute("data-focus-trap", ""), w.tabIndex = 0, Object.assign(w.style, Zr), w;
  }, u = () => {
    const w = e();
    return w ? Jc(w, !0).filter((g) => !g.hasAttribute("data-focus-trap")) : [];
  }, f = () => {
    const w = u();
    return w.length > 0 ? w[0] : null;
  }, h = () => {
    const w = u();
    return w.length > 0 ? w[w.length - 1] : null;
  }, m = () => {
    const w = e();
    if (!w)
      return !1;
    const g = Pr(w);
    return !g || dt(w, g) ? !1 : Zc(g);
  };
  Z(() => {
    const w = e();
    if (!w)
      return;
    Ja.add(i);
    const g = Pr(w);
    if (!dt(w, g)) {
      const v = new CustomEvent(Ts, Qa);
      w.addEventListener(Ts, o), w.dispatchEvent(v), v.defaultPrevented || setTimeout(() => {
        Ue(f()), Pr(w) === g && Ue(w);
      }, 0);
    }
    me(() => {
      w.removeEventListener(Ts, o), setTimeout(() => {
        const v = new CustomEvent(As, Qa);
        m() && v.preventDefault(), w.addEventListener(As, a), w.dispatchEvent(v), v.defaultPrevented || Ue(g ?? l().body), w.removeEventListener(As, a), Ja.remove(i);
      }, 0);
    });
  }), Z(() => {
    const w = e();
    if (!w || !R(t.trapFocus) || n())
      return;
    const g = (v) => {
      const b = v.target;
      b != null && b.closest(`[${Fi}]`) || (dt(w, b) ? s = b : Ue(s));
    }, p = (v) => {
      const C = v.relatedTarget ?? Pr(w);
      C != null && C.closest(`[${Fi}]`) || dt(w, C) || Ue(s);
    };
    l().addEventListener("focusin", g), l().addEventListener("focusout", p), me(() => {
      l().removeEventListener("focusin", g), l().removeEventListener("focusout", p);
    });
  }), Z(() => {
    const w = e();
    if (!w || !R(t.trapFocus) || n())
      return;
    const g = c();
    w.insertAdjacentElement("afterbegin", g);
    const p = c();
    w.insertAdjacentElement("beforeend", p);
    function v(C) {
      const _ = f(), E = h();
      C.relatedTarget === _ ? Ue(E) : Ue(_);
    }
    g.addEventListener("focusin", v), p.addEventListener("focusin", v);
    const b = new MutationObserver((C) => {
      for (const _ of C)
        _.previousSibling === p && (p.remove(), w.insertAdjacentElement("beforeend", p)), _.nextSibling === g && (g.remove(), w.insertAdjacentElement("afterbegin", g));
    });
    b.observe(w, {
      childList: !0,
      subtree: !1
    }), me(() => {
      g.removeEventListener("focusin", v), p.removeEventListener("focusin", v), g.remove(), p.remove(), b.disconnect();
    });
  });
}
/*!
 * Portions of this file are based on code from zag.
 * MIT Licensed, Copyright (c) 2021 Chakra UI.
 *
 * Credits to the zag team:
 * https://github.com/chakra-ui/zag/blob/c1e6c7689b22bf58741ded7cf224dd9baec2a046/packages/utilities/form-utils/src/form.ts
 */
function ar(t, e) {
  Z(He(t, (n) => {
    if (n == null)
      return;
    const r = Um(n);
    r != null && (r.addEventListener("reset", e, { passive: !0 }), me(() => {
      r.removeEventListener("reset", e);
    }));
  }));
}
function Um(t) {
  return qm(t) ? t.form : t.closest("form");
}
function qm(t) {
  return t.matches("textarea, input, select, button");
}
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/15e101b74966bd5eb719c6529ce71ce57eaed430/packages/@react-aria/live-announcer/src/LiveAnnouncer.tsx
 */
const ou = 7e3;
let Ls = null;
const Gm = "data-live-announcer";
function Fs(t, e = "assertive", n = ou) {
  Ls || (Ls = new Ym()), Ls.announce(t, e, n);
}
class Ym {
  constructor() {
    pe(this, "node");
    pe(this, "assertiveLog");
    pe(this, "politeLog");
    this.node = document.createElement("div"), this.node.dataset.liveAnnouncer = "true", Object.assign(this.node.style, Zr), this.assertiveLog = this.createLog("assertive"), this.node.appendChild(this.assertiveLog), this.politeLog = this.createLog("polite"), this.node.appendChild(this.politeLog), document.body.prepend(this.node);
  }
  createLog(e) {
    const n = document.createElement("div");
    return n.setAttribute("role", "log"), n.setAttribute("aria-live", e), n.setAttribute("aria-relevant", "additions"), n;
  }
  destroy() {
    this.node && (document.body.removeChild(this.node), this.node = null);
  }
  announce(e, n = "assertive", r = ou) {
    if (!this.node)
      return;
    const i = document.createElement("div");
    i.textContent = e, n === "assertive" ? this.assertiveLog.appendChild(i) : this.politeLog.appendChild(i), e !== "" && setTimeout(() => {
      i.remove();
    }, r);
  }
  clear(e) {
    this.node && ((!e || e === "assertive") && (this.assertiveLog.innerHTML = ""), (!e || e === "polite") && (this.politeLog.innerHTML = ""));
  }
}
/*!
 * This file is based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/810579b671791f1593108f62cdc1893de3a220e3/packages/@react-aria/overlays/src/ariaHideOutside.ts
 */
function os(t) {
  Z(() => {
    R(t.isDisabled) || me(Xm(R(t.targets), R(t.root)));
  });
}
const Or = /* @__PURE__ */ new WeakMap(), kt = [];
function Xm(t, e = document.body) {
  const n = new Set(t), r = /* @__PURE__ */ new Set(), i = (l) => {
    for (const h of l.querySelectorAll(`[${Gm}], [${Fi}]`))
      n.add(h);
    const c = (h) => {
      if (n.has(h) || h.parentElement && r.has(h.parentElement) && h.parentElement.getAttribute("role") !== "row")
        return NodeFilter.FILTER_REJECT;
      for (const m of n)
        if (h.contains(m))
          return NodeFilter.FILTER_SKIP;
      return NodeFilter.FILTER_ACCEPT;
    }, u = document.createTreeWalker(l, NodeFilter.SHOW_ELEMENT, {
      acceptNode: c
    }), f = c(l);
    if (f === NodeFilter.FILTER_ACCEPT && s(l), f !== NodeFilter.FILTER_REJECT) {
      let h = u.nextNode();
      for (; h != null; )
        s(h), h = u.nextNode();
    }
  }, s = (l) => {
    const c = Or.get(l) ?? 0;
    l.getAttribute("aria-hidden") === "true" && c === 0 || (c === 0 && l.setAttribute("aria-hidden", "true"), r.add(l), Or.set(l, c + 1));
  };
  kt.length && kt[kt.length - 1].disconnect(), i(e);
  const o = new MutationObserver((l) => {
    for (const c of l)
      if (!(c.type !== "childList" || c.addedNodes.length === 0) && ![...n, ...r].some((u) => u.contains(c.target))) {
        for (const u of c.removedNodes)
          u instanceof Element && (n.delete(u), r.delete(u));
        for (const u of c.addedNodes)
          (u instanceof HTMLElement || u instanceof SVGElement) && (u.dataset.liveAnnouncer === "true" || u.dataset.reactAriaTopLayer === "true") ? n.add(u) : u instanceof Element && i(u);
      }
  });
  o.observe(e, { childList: !0, subtree: !0 });
  const a = {
    observe() {
      o.observe(e, { childList: !0, subtree: !0 });
    },
    disconnect() {
      o.disconnect();
    }
  };
  return kt.push(a), () => {
    o.disconnect();
    for (const l of r) {
      const c = Or.get(l);
      if (c == null)
        return;
      c === 1 ? (l.removeAttribute("aria-hidden"), Or.delete(l)) : Or.set(l, c - 1);
    }
    a === kt[kt.length - 1] ? (kt.pop(), kt.length && kt[kt.length - 1].observe()) : kt.splice(kt.indexOf(a), 1);
  };
}
/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/81b25f4b40c54f72aeb106ca0e64e1e09655153e/packages/react/dismissable-layer/src/DismissableLayer.tsx
 *
 * Portions of this file are based on code from zag.
 * MIT Licensed, Copyright (c) 2021 Chakra UI.
 *
 * Credits to the Chakra UI team:
 * https://github.com/chakra-ui/zag/blob/d1dbf9e240803c9e3ed81ebef363739be4273de0/packages/utilities/interact-outside/src/index.ts
 */
const Za = "interactOutside.pointerDownOutside", el = "interactOutside.focusOutside";
function Qm(t, e) {
  let n, r = Tm;
  const i = () => Qt(e()), s = (f) => {
    var h;
    return (h = t.onPointerDownOutside) == null ? void 0 : h.call(t, f);
  }, o = (f) => {
    var h;
    return (h = t.onFocusOutside) == null ? void 0 : h.call(t, f);
  }, a = (f) => {
    var h;
    return (h = t.onInteractOutside) == null ? void 0 : h.call(t, f);
  }, l = (f) => {
    var m;
    const h = f.target;
    return !(h instanceof HTMLElement) || h.closest(`[${Fi}]`) || !dt(i(), h) || dt(e(), h) ? !1 : !((m = t.shouldExcludeElement) != null && m.call(t, h));
  }, c = (f) => {
    function h() {
      const m = e(), w = f.target;
      if (!m || !w || !l(f))
        return;
      const g = ut([
        s,
        a
      ]);
      w.addEventListener(Za, g, {
        once: !0
      });
      const p = new CustomEvent(Za, {
        bubbles: !1,
        cancelable: !0,
        detail: {
          originalEvent: f,
          isContextMenu: f.button === 2 || km(f) && f.button === 0
        }
      });
      w.dispatchEvent(p);
    }
    f.pointerType === "touch" ? (i().removeEventListener("click", h), r = h, i().addEventListener("click", h, { once: !0 })) : h();
  }, u = (f) => {
    const h = e(), m = f.target;
    if (!h || !m || !l(f))
      return;
    const w = ut([
      o,
      a
    ]);
    m.addEventListener(el, w, { once: !0 });
    const g = new CustomEvent(el, {
      bubbles: !1,
      cancelable: !0,
      detail: {
        originalEvent: f,
        isContextMenu: !1
      }
    });
    m.dispatchEvent(g);
  };
  Z(() => {
    R(t.isDisabled) || (n = window.setTimeout(() => {
      i().addEventListener("pointerdown", c, !0);
    }, 0), i().addEventListener("focusin", u, !0), me(() => {
      window.clearTimeout(n), i().removeEventListener("click", r), i().removeEventListener("pointerdown", c, !0), i().removeEventListener("focusin", u, !0);
    }));
  });
}
/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/21a7c97dc8efa79fecca36428eec49f187294085/packages/react/presence/src/Presence.tsx
 * https://github.com/radix-ui/primitives/blob/21a7c97dc8efa79fecca36428eec49f187294085/packages/react/presence/src/useStateMachine.tsx
 */
function gn(t) {
  const [e, n] = N();
  let r = {}, i = t(), s = "none";
  const [o, a] = Jm(t() ? "mounted" : "unmounted", {
    mounted: {
      UNMOUNT: "unmounted",
      ANIMATION_OUT: "unmountSuspended"
    },
    unmountSuspended: {
      MOUNT: "mounted",
      ANIMATION_END: "unmounted"
    },
    unmounted: {
      MOUNT: "mounted"
    }
  });
  return Z(He(o, (l) => {
    const c = pi(r);
    s = l === "mounted" ? c : "none";
  })), Z(He(t, (l) => {
    if (i === l)
      return;
    const c = pi(r);
    l ? a("MOUNT") : (r == null ? void 0 : r.display) === "none" ? a("UNMOUNT") : a(i && s !== c ? "ANIMATION_OUT" : "UNMOUNT"), i = l;
  })), Z(He(e, (l) => {
    if (l) {
      const c = (f) => {
        const m = pi(r).includes(f.animationName);
        f.target === l && m && a("ANIMATION_END");
      }, u = (f) => {
        f.target === l && (s = pi(r));
      };
      l.addEventListener("animationstart", u), l.addEventListener("animationcancel", c), l.addEventListener("animationend", c), me(() => {
        l.removeEventListener("animationstart", u), l.removeEventListener("animationcancel", c), l.removeEventListener("animationend", c);
      });
    } else
      a("ANIMATION_END");
  })), {
    isPresent: () => ["mounted", "unmountSuspended"].includes(o()),
    setRef: (l) => {
      l && (r = getComputedStyle(l)), n(l);
    }
  };
}
function pi(t) {
  return (t == null ? void 0 : t.animationName) || "none";
}
function Jm(t, e) {
  const n = (o, a) => e[o][a] ?? o, [r, i] = N(t);
  return [r, (o) => {
    i((a) => n(a, o));
  }];
}
function Ge(t) {
  return (e) => (t(e), () => t(void 0));
}
/*!
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the ariakit team:
 * https://github.com/ariakit/ariakit/blob/8a13899ff807bbf39f3d89d2d5964042ba4d5287/packages/ariakit-react-utils/src/hooks.ts
 */
function au(t, e) {
  const [n, r] = N(tl(e == null ? void 0 : e()));
  return Z(() => {
    var i;
    r(((i = t()) == null ? void 0 : i.tagName.toLowerCase()) || tl(e == null ? void 0 : e()));
  }), n;
}
function tl(t) {
  return Kn(t) ? t : void 0;
}
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/a13802d8be6f83af1450e56f7a88527b10d9cadf/packages/@react-stately/toggle/src/useToggleState.ts
 */
function Bo(t = {}) {
  const [e, n] = tu({
    value: () => R(t.isSelected),
    defaultValue: () => !!R(t.defaultIsSelected),
    onChange: (s) => {
      var o;
      return (o = t.onSelectedChange) == null ? void 0 : o.call(t, s);
    }
  });
  return {
    isSelected: e,
    setIsSelected: (s) => {
      !R(t.isReadOnly) && !R(t.isDisabled) && n(s);
    },
    toggle: () => {
      !R(t.isReadOnly) && !R(t.isDisabled) && n(!e());
    }
  };
}
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/70e7caf1946c423bc9aa9cb0e50dbdbe953d239b/packages/@react-aria/label/src/useField.ts
 */
const lr = ["id", "name", "validationState", "required", "disabled", "readOnly"];
function cr(t) {
  const e = `form-control-${tt()}`, n = fe({
    id: e
  }, t), [r, i] = N(), [s, o] = N(), [a, l] = N(), [c, u] = N(), f = (g, p, v) => {
    const b = v != null || r() != null;
    return [
      v,
      r(),
      // If there is both an aria-label and aria-labelledby, add the field itself has an aria-labelledby
      b && p != null ? g : void 0
    ].filter(Boolean).join(" ") || void 0;
  }, h = (g) => [
    a(),
    // Use aria-describedby for error message because aria-errormessage is unsupported using VoiceOver or NVDA.
    // See https://github.com/adobe/react-spectrum/issues/1346#issuecomment-740136268
    c(),
    g
  ].filter(Boolean).join(" ") || void 0, m = J(() => ({
    "data-valid": R(n.validationState) === "valid" ? "" : void 0,
    "data-invalid": R(n.validationState) === "invalid" ? "" : void 0,
    "data-required": R(n.required) ? "" : void 0,
    "data-disabled": R(n.disabled) ? "" : void 0,
    "data-readonly": R(n.readOnly) ? "" : void 0
  }));
  return {
    formControlContext: {
      name: () => R(n.name) ?? R(n.id),
      dataset: m,
      validationState: () => R(n.validationState),
      isRequired: () => R(n.required),
      isDisabled: () => R(n.disabled),
      isReadOnly: () => R(n.readOnly),
      labelId: r,
      fieldId: s,
      descriptionId: a,
      errorMessageId: c,
      getAriaLabelledBy: f,
      getAriaDescribedBy: h,
      generateId: Et(() => R(n.id)),
      registerLabel: Ge(i),
      registerField: Ge(o),
      registerDescription: Ge(l),
      registerErrorMessage: Ge(u)
    }
  };
}
const An = Fe();
function ft() {
  const t = Ne(An);
  if (t === void 0)
    throw new Error("[kobalte]: `useFormControlContext` must be used within a `FormControlContext.Provider` component");
  return t;
}
const ei = ["id", "aria-label", "aria-labelledby", "aria-describedby"];
function ti(t) {
  const e = ft(), n = fe({
    id: e.generateId("field")
  }, t);
  return Z(() => me(e.registerField(R(n.id)))), {
    fieldProps: {
      id: () => R(n.id),
      ariaLabel: () => R(n["aria-label"]),
      ariaLabelledBy: () => e.getAriaLabelledBy(R(n.id), R(n["aria-label"]), R(n["aria-labelledby"])),
      ariaDescribedBy: () => e.getAriaDescribedBy(R(n["aria-describedby"]))
    }
  };
}
function Se(t) {
  var i;
  const [e, n] = K(t, ["asChild", "as", "children"]);
  if (!e.asChild)
    return d(yi, D({
      get component() {
        return e.as;
      }
    }, n, {
      get children() {
        return e.children;
      }
    }));
  const r = Dn(() => e.children);
  if (nl(r())) {
    const s = rl(n, ((i = r()) == null ? void 0 : i.props) ?? {});
    return d(yi, s);
  }
  if (vm(r())) {
    const s = r().find(nl);
    if (s) {
      const o = () => d(xe, {
        get each() {
          return r();
        },
        children: (l) => d(te, {
          when: l === s,
          fallback: l,
          get children() {
            return s.props.children;
          }
        })
      }), a = rl(n, (s == null ? void 0 : s.props) ?? {});
      return d(yi, D(a, {
        children: o
      }));
    }
  }
  throw new Error("[kobalte]: Component is expected to render `asChild` but no children `As` component was found.");
}
const Zm = Symbol("$$KobalteAsComponent");
function nl(t) {
  return (t == null ? void 0 : t[Zm]) === !0;
}
function rl(t, e) {
  return mm([t, e], {
    reverseEventHandlers: !0
  });
}
function ew(t) {
  let e;
  const n = ft(), r = fe({
    id: n.generateId("label")
  }, t), [i, s] = K(r, ["ref"]), o = au(() => e, () => "label");
  return Z(() => me(n.registerLabel(s.id))), d(Se, D({
    as: "label",
    ref(a) {
      var l = _e((c) => e = c, i.ref);
      typeof l == "function" && l(a);
    },
    get for() {
      return J(() => o() === "label")() ? n.fieldId() : void 0;
    }
  }, () => n.dataset(), s));
}
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/b35d5c02fe900badccd0cf1a8f23bb593419f238/packages/@react-aria/i18n/src/utils.ts
 */
const tw = /* @__PURE__ */ new Set([
  "Avst",
  "Arab",
  "Armi",
  "Syrc",
  "Samr",
  "Mand",
  "Thaa",
  "Mend",
  "Nkoo",
  "Adlm",
  "Rohg",
  "Hebr"
]), nw = /* @__PURE__ */ new Set([
  "ae",
  "ar",
  "arc",
  "bcc",
  "bqi",
  "ckb",
  "dv",
  "fa",
  "glk",
  "he",
  "ku",
  "mzn",
  "nqo",
  "pnb",
  "ps",
  "sd",
  "ug",
  "ur",
  "yi"
]);
function rw(t) {
  if (Intl.Locale) {
    const n = new Intl.Locale(t).maximize().script ?? "";
    return tw.has(n);
  }
  const e = t.split("-")[0];
  return nw.has(e);
}
function iw(t) {
  return rw(t) ? "rtl" : "ltr";
}
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/b35d5c02fe900badccd0cf1a8f23bb593419f238/packages/@react-aria/i18n/src/useDefaultLocale.ts
 */
function lu() {
  let t = typeof navigator < "u" && // @ts-ignore
  (navigator.language || navigator.userLanguage) || "en-US";
  try {
    Intl.DateTimeFormat.supportedLocalesOf([t]);
  } catch {
    t = "en-US";
  }
  return {
    locale: t,
    direction: iw(t)
  };
}
let fo = lu();
const Dr = /* @__PURE__ */ new Set();
function il() {
  fo = lu();
  for (const t of Dr)
    t(fo);
}
function sw() {
  const [t, e] = N(fo), n = J(() => t());
  return en(() => {
    Dr.size === 0 && window.addEventListener("languagechange", il), Dr.add(e), me(() => {
      Dr.delete(e), Dr.size === 0 && window.removeEventListener("languagechange", il);
    });
  }), {
    locale: () => n().locale,
    direction: () => n().direction
  };
}
const ow = Fe();
function ni() {
  const t = sw();
  return Ne(ow) || t;
}
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/b35d5c02fe900badccd0cf1a8f23bb593419f238/packages/@react-aria/i18n/src/useCollator.ts
 */
const zs = /* @__PURE__ */ new Map();
function cu(t) {
  const { locale: e } = ni(), n = J(() => e() + (t ? Object.entries(t).sort((r, i) => r[0] < i[0] ? -1 : 1).join() : ""));
  return J(() => {
    const r = n();
    let i;
    return zs.has(r) && (i = zs.get(r)), i || (i = new Intl.Collator(e(), t), zs.set(r, i)), i;
  });
}
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/22cb32d329e66c60f55d4fc4025d1d44bb015d71/packages/@react-aria/i18n/src/useFilter.ts
 */
function aw(t) {
  const e = cu({
    usage: "search",
    ...t
  });
  return {
    startsWith: (s, o) => {
      if (o.length === 0)
        return !0;
      const a = s.normalize("NFC"), l = o.normalize("NFC");
      return e().compare(a.slice(0, l.length), l) === 0;
    },
    endsWith: (s, o) => {
      if (o.length === 0)
        return !0;
      const a = s.normalize("NFC"), l = o.normalize("NFC");
      return e().compare(a.slice(-l.length), l) === 0;
    },
    contains: (s, o) => {
      if (o.length === 0)
        return !0;
      const a = s.normalize("NFC"), l = o.normalize("NFC");
      let c = 0;
      const u = o.length;
      for (; c + u <= a.length; c++) {
        const f = a.slice(c, c + u);
        if (e().compare(l, f) === 0)
          return !0;
      }
      return !1;
    }
  };
}
let Rs = /* @__PURE__ */ new Map(), ho = !1;
try {
  ho = new Intl.NumberFormat("de-DE", {
    signDisplay: "exceptZero"
  }).resolvedOptions().signDisplay === "exceptZero";
} catch {
}
let zi = !1;
try {
  zi = new Intl.NumberFormat("de-DE", {
    style: "unit",
    unit: "degree"
  }).resolvedOptions().style === "unit";
} catch {
}
const uu = {
  degree: {
    narrow: {
      default: "°",
      "ja-JP": " 度",
      "zh-TW": "度",
      "sl-SI": " °"
    }
  }
};
class lw {
  /** Formats a number value as a string, according to the locale and options provided to the constructor. */
  format(e) {
    let n = "";
    if (!ho && this.options.signDisplay != null ? n = uw(this.numberFormatter, this.options.signDisplay, e) : n = this.numberFormatter.format(e), this.options.style === "unit" && !zi) {
      var r;
      let { unit: i, unitDisplay: s = "short", locale: o } = this.resolvedOptions();
      if (!i)
        return n;
      let a = (r = uu[i]) === null || r === void 0 ? void 0 : r[s];
      n += a[o] || a.default;
    }
    return n;
  }
  /** Formats a number to an array of parts such as separators, digits, punctuation, and more. */
  formatToParts(e) {
    return this.numberFormatter.formatToParts(e);
  }
  /** Formats a number range as a string. */
  formatRange(e, n) {
    if (typeof this.numberFormatter.formatRange == "function")
      return this.numberFormatter.formatRange(e, n);
    if (n < e)
      throw new RangeError("End date must be >= start date");
    return `${this.format(e)} – ${this.format(n)}`;
  }
  /** Formats a number range as an array of parts. */
  formatRangeToParts(e, n) {
    if (typeof this.numberFormatter.formatRangeToParts == "function")
      return this.numberFormatter.formatRangeToParts(e, n);
    if (n < e)
      throw new RangeError("End date must be >= start date");
    let r = this.numberFormatter.formatToParts(e), i = this.numberFormatter.formatToParts(n);
    return [
      ...r.map((s) => ({
        ...s,
        source: "startRange"
      })),
      {
        type: "literal",
        value: " – ",
        source: "shared"
      },
      ...i.map((s) => ({
        ...s,
        source: "endRange"
      }))
    ];
  }
  /** Returns the resolved formatting options based on the values passed to the constructor. */
  resolvedOptions() {
    let e = this.numberFormatter.resolvedOptions();
    return !ho && this.options.signDisplay != null && (e = {
      ...e,
      signDisplay: this.options.signDisplay
    }), !zi && this.options.style === "unit" && (e = {
      ...e,
      style: "unit",
      unit: this.options.unit,
      unitDisplay: this.options.unitDisplay
    }), e;
  }
  constructor(e, n = {}) {
    this.numberFormatter = cw(e, n), this.options = n;
  }
}
function cw(t, e = {}) {
  let { numberingSystem: n } = e;
  if (n && t.includes("-nu-") && (t.includes("-u-") || (t += "-u-"), t += `-nu-${n}`), e.style === "unit" && !zi) {
    var r;
    let { unit: o, unitDisplay: a = "short" } = e;
    if (!o)
      throw new Error('unit option must be provided with style: "unit"');
    if (!(!((r = uu[o]) === null || r === void 0) && r[a]))
      throw new Error(`Unsupported unit ${o} with unitDisplay = ${a}`);
    e = {
      ...e,
      style: "decimal"
    };
  }
  let i = t + (e ? Object.entries(e).sort((o, a) => o[0] < a[0] ? -1 : 1).join() : "");
  if (Rs.has(i))
    return Rs.get(i);
  let s = new Intl.NumberFormat(t, e);
  return Rs.set(i, s), s;
}
function uw(t, e, n) {
  if (e === "auto")
    return t.format(n);
  if (e === "never")
    return t.format(Math.abs(n));
  {
    let r = !1;
    if (e === "always" ? r = n > 0 || Object.is(n, 0) : e === "exceptZero" && (Object.is(n, -0) || Object.is(n, 0) ? n = Math.abs(n) : r = n > 0), r) {
      let i = t.format(-n), s = t.format(n), o = i.replace(s, "").replace(/\u200e|\u061C/, "");
      return [
        ...o
      ].length !== 1 && console.warn("@react-aria/i18n polyfill for NumberFormat signDisplay: Unsupported case"), i.replace(s, "!!!").replace(o, "+").replace("!!!", s);
    } else
      return t.format(n);
  }
}
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/b35d5c02fe900badccd0cf1a8f23bb593419f238/packages/@react-aria/i18n/src/useNumberFormatter.ts
 */
function dw(t) {
  const { locale: e } = ni();
  return J(() => new lw(e(), R(t)));
}
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/bfce84fee12a027d9cbc38b43e1747e3e4b4b169/packages/@react-stately/selection/src/Selection.ts
 * https://github.com/adobe/react-spectrum/blob/bfce84fee12a027d9cbc38b43e1747e3e4b4b169/packages/@react-stately/selection/src/types.ts
 * https://github.com/adobe/react-spectrum/blob/bfce84fee12a027d9cbc38b43e1747e3e4b4b169/packages/@react-types/shared/src/selection.d.ts
 */
class _t extends Set {
  constructor(n, r, i) {
    super(n);
    pe(this, "anchorKey");
    pe(this, "currentKey");
    n instanceof _t ? (this.anchorKey = r || n.anchorKey, this.currentKey = i || n.currentKey) : (this.anchorKey = r, this.currentKey = i);
  }
}
function fw(t) {
  const [e, n] = sr(t);
  return [() => e() ?? new _t(), n];
}
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/8f2f2acb3d5850382ebe631f055f88c704aa7d17/packages/@react-aria/selection/src/utils.ts
 */
function du(t) {
  return _i() ? t.altKey : t.ctrlKey;
}
function Bn(t) {
  return is() ? t.metaKey : t.ctrlKey;
}
function sl(t) {
  return new _t(t);
}
function hw(t, e) {
  if (t.size !== e.size)
    return !1;
  for (const n of t)
    if (!e.has(n))
      return !1;
  return !0;
}
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/bfce84fee12a027d9cbc38b43e1747e3e4b4b169/packages/@react-stately/selection/src/useMultipleSelectionState.ts
 */
function gw(t) {
  const e = fe({
    selectionMode: "none",
    selectionBehavior: "toggle"
  }, t), [n, r] = N(!1), [i, s] = N(), o = J(() => {
    const g = R(e.selectedKeys);
    return g != null ? sl(g) : g;
  }), a = J(() => {
    const g = R(e.defaultSelectedKeys);
    return g != null ? sl(g) : new _t();
  }), [l, c] = fw({
    value: o,
    defaultValue: a,
    onChange: (g) => {
      var p;
      return (p = e.onSelectionChange) == null ? void 0 : p.call(e, g);
    }
  }), [u, f] = N(R(e.selectionBehavior)), h = () => R(e.selectionMode), m = () => R(e.disallowEmptySelection) ?? !1, w = (g) => {
    (R(e.allowDuplicateSelectionEvents) || !hw(g, l())) && c(g);
  };
  return Z(() => {
    const g = l();
    R(e.selectionBehavior) === "replace" && u() === "toggle" && typeof g == "object" && g.size === 0 && f("replace");
  }), Z(() => {
    f(R(e.selectionBehavior) ?? "toggle");
  }), {
    selectionMode: h,
    disallowEmptySelection: m,
    selectionBehavior: u,
    setSelectionBehavior: f,
    isFocused: n,
    setFocused: r,
    focusedKey: i,
    setFocusedKey: s,
    selectedKeys: l,
    setSelectedKeys: w
  };
}
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/8f2f2acb3d5850382ebe631f055f88c704aa7d17/packages/@react-aria/selection/src/useTypeSelect.ts
 */
function mw(t) {
  const [e, n] = N(""), [r, i] = N(-1);
  return {
    typeSelectHandlers: {
      onKeyDown: (o) => {
        var h;
        if (R(t.isDisabled))
          return;
        const a = R(t.keyboardDelegate), l = R(t.selectionManager);
        if (!a.getKeyForSearch)
          return;
        const c = ww(o.key);
        if (!c || o.ctrlKey || o.metaKey)
          return;
        c === " " && e().trim().length > 0 && (o.preventDefault(), o.stopPropagation());
        let u = n((m) => m + c), f = a.getKeyForSearch(u, l.focusedKey()) ?? a.getKeyForSearch(u);
        f == null && pw(u) && (u = u[0], f = a.getKeyForSearch(u, l.focusedKey()) ?? a.getKeyForSearch(u)), f != null && (l.setFocusedKey(f), (h = t.onTypeSelect) == null || h.call(t, f)), clearTimeout(r()), i(window.setTimeout(() => n(""), 500));
      }
    }
  };
}
function ww(t) {
  return t.length === 1 || !/^[A-Z]/i.test(t) ? t : "";
}
function pw(t) {
  return t.split("").every((e) => e === t[0]);
}
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/8f2f2acb3d5850382ebe631f055f88c704aa7d17/packages/@react-aria/selection/src/useSelectableCollection.ts
 */
function fu(t, e, n) {
  const i = D({
    selectOnFocus: () => R(t.selectionManager).selectionBehavior() === "replace"
  }, t), s = () => e(), { direction: o } = ni();
  let a = { top: 0, left: 0 };
  dm(() => R(i.isVirtualized) ? void 0 : s(), "scroll", () => {
    const g = s();
    g && (a = {
      top: g.scrollTop,
      left: g.scrollLeft
    });
  });
  const { typeSelectHandlers: l } = mw({
    isDisabled: () => R(i.disallowTypeAhead),
    keyboardDelegate: () => R(i.keyboardDelegate),
    selectionManager: () => R(i.selectionManager)
  }), c = (g) => {
    var T, x, y, z, I, O, Q, H;
    ce(g, l.onKeyDown), g.altKey && g.key === "Tab" && g.preventDefault();
    const p = e();
    if (!(p != null && p.contains(g.target)))
      return;
    const v = R(i.selectionManager), b = R(i.selectOnFocus), C = (S) => {
      S != null && (v.setFocusedKey(S), g.shiftKey && v.selectionMode() === "multiple" ? v.extendSelection(S) : b && !du(g) && v.replaceSelection(S));
    }, _ = R(i.keyboardDelegate), E = R(i.shouldFocusWrap), F = v.focusedKey();
    switch (g.key) {
      case "ArrowDown": {
        if (_.getKeyBelow) {
          g.preventDefault();
          let S;
          F != null ? S = _.getKeyBelow(F) : S = (T = _.getFirstKey) == null ? void 0 : T.call(_), S == null && E && (S = (x = _.getFirstKey) == null ? void 0 : x.call(_, F)), C(S);
        }
        break;
      }
      case "ArrowUp": {
        if (_.getKeyAbove) {
          g.preventDefault();
          let S;
          F != null ? S = _.getKeyAbove(F) : S = (y = _.getLastKey) == null ? void 0 : y.call(_), S == null && E && (S = (z = _.getLastKey) == null ? void 0 : z.call(_, F)), C(S);
        }
        break;
      }
      case "ArrowLeft": {
        if (_.getKeyLeftOf) {
          g.preventDefault();
          const S = o() === "rtl";
          let M;
          F != null ? M = _.getKeyLeftOf(F) : M = S ? (I = _.getFirstKey) == null ? void 0 : I.call(_) : (O = _.getLastKey) == null ? void 0 : O.call(_), C(M);
        }
        break;
      }
      case "ArrowRight": {
        if (_.getKeyRightOf) {
          g.preventDefault();
          const S = o() === "rtl";
          let M;
          F != null ? M = _.getKeyRightOf(F) : M = S ? (Q = _.getLastKey) == null ? void 0 : Q.call(_) : (H = _.getFirstKey) == null ? void 0 : H.call(_), C(M);
        }
        break;
      }
      case "Home":
        if (_.getFirstKey) {
          g.preventDefault();
          const S = _.getFirstKey(F, Bn(g));
          S != null && (v.setFocusedKey(S), Bn(g) && g.shiftKey && v.selectionMode() === "multiple" ? v.extendSelection(S) : b && v.replaceSelection(S));
        }
        break;
      case "End":
        if (_.getLastKey) {
          g.preventDefault();
          const S = _.getLastKey(F, Bn(g));
          S != null && (v.setFocusedKey(S), Bn(g) && g.shiftKey && v.selectionMode() === "multiple" ? v.extendSelection(S) : b && v.replaceSelection(S));
        }
        break;
      case "PageDown":
        if (_.getKeyPageBelow && F != null) {
          g.preventDefault();
          const S = _.getKeyPageBelow(F);
          C(S);
        }
        break;
      case "PageUp":
        if (_.getKeyPageAbove && F != null) {
          g.preventDefault();
          const S = _.getKeyPageAbove(F);
          C(S);
        }
        break;
      case "a":
        Bn(g) && v.selectionMode() === "multiple" && R(i.disallowSelectAll) !== !0 && (g.preventDefault(), v.selectAll());
        break;
      case "Escape":
        g.defaultPrevented || (g.preventDefault(), R(i.disallowEmptySelection) || v.clearSelection());
        break;
      case "Tab":
        if (!R(i.allowsTabNavigation)) {
          if (g.shiftKey)
            p.focus();
          else {
            const S = Dm(p, { tabbable: !0 });
            let M, P;
            do
              P = S.lastChild(), P && (M = P);
            while (P);
            M && !M.contains(document.activeElement) && Ue(M);
          }
          break;
        }
    }
  }, u = (g) => {
    var C, _;
    const p = R(i.selectionManager), v = R(i.keyboardDelegate), b = R(i.selectOnFocus);
    if (p.isFocused()) {
      g.currentTarget.contains(g.target) || p.setFocused(!1);
      return;
    }
    if (g.currentTarget.contains(g.target)) {
      if (p.setFocused(!0), p.focusedKey() == null) {
        const E = (T) => {
          T != null && (p.setFocusedKey(T), b && p.replaceSelection(T));
        }, F = g.relatedTarget;
        F && g.currentTarget.compareDocumentPosition(F) & Node.DOCUMENT_POSITION_FOLLOWING ? E(p.lastSelectedKey() ?? ((C = v.getLastKey) == null ? void 0 : C.call(v))) : E(p.firstSelectedKey() ?? ((_ = v.getFirstKey) == null ? void 0 : _.call(v)));
      } else if (!R(i.isVirtualized)) {
        const E = s();
        if (E) {
          E.scrollTop = a.top, E.scrollLeft = a.left;
          const F = E.querySelector(`[data-key="${p.focusedKey()}"]`);
          F && (Ue(F), lo(E, F));
        }
      }
    }
  }, f = (g) => {
    const p = R(i.selectionManager);
    g.currentTarget.contains(g.relatedTarget) || p.setFocused(!1);
  }, h = (g) => {
    s() === g.target && g.preventDefault();
  }, m = () => {
    var E, F;
    const g = R(i.autoFocus);
    if (!g)
      return;
    const p = R(i.selectionManager), v = R(i.keyboardDelegate);
    let b;
    g === "first" && (b = (E = v.getFirstKey) == null ? void 0 : E.call(v)), g === "last" && (b = (F = v.getLastKey) == null ? void 0 : F.call(v));
    const C = p.selectedKeys();
    C.size && (b = C.values().next().value), p.setFocused(!0), p.setFocusedKey(b);
    const _ = e();
    _ && b == null && !R(i.shouldUseVirtualFocus) && Ue(_);
  };
  return en(() => {
    i.deferAutoFocus ? setTimeout(m, 0) : m();
  }), Z(He([
    s,
    () => R(i.isVirtualized),
    () => R(i.selectionManager).focusedKey()
  ], (g) => {
    var C;
    const [p, v, b] = g;
    if (v)
      b && ((C = i.scrollToKey) == null || C.call(i, b));
    else if (b && p) {
      const _ = p.querySelector(`[data-key="${b}"]`);
      _ && lo(p, _);
    }
  })), {
    tabIndex: J(() => {
      if (!R(i.shouldUseVirtualFocus))
        return R(i.selectionManager).focusedKey() == null ? 0 : -1;
    }),
    onKeyDown: c,
    onMouseDown: h,
    onFocusIn: u,
    onFocusOut: f
  };
}
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/8f2f2acb3d5850382ebe631f055f88c704aa7d17/packages/@react-aria/selection/src/useSelectableItem.ts
 */
function vw(t, e) {
  const n = () => R(t.selectionManager), r = () => R(t.key), i = () => R(t.shouldUseVirtualFocus), s = (b) => {
    n().selectionMode() !== "none" && (n().selectionMode() === "single" ? n().isSelected(r()) && !n().disallowEmptySelection() ? n().toggleSelection(r()) : n().replaceSelection(r()) : b != null && b.shiftKey ? n().extendSelection(r()) : n().selectionBehavior() === "toggle" || Bn(b) || "pointerType" in b && b.pointerType === "touch" ? n().toggleSelection(r()) : n().replaceSelection(r()));
  }, o = () => n().isSelected(r()), a = () => R(t.disabled) || n().isDisabled(r()), l = () => !a() && n().canSelectItem(r());
  let c = null;
  const u = (b) => {
    l() && (c = b.pointerType, b.pointerType === "mouse" && b.button === 0 && !R(t.shouldSelectOnPressUp) && s(b));
  }, f = (b) => {
    l() && b.pointerType === "mouse" && b.button === 0 && R(t.shouldSelectOnPressUp) && R(t.allowsDifferentPressOrigin) && s(b);
  }, h = (b) => {
    l() && (R(t.shouldSelectOnPressUp) && !R(t.allowsDifferentPressOrigin) || c !== "mouse") && s(b);
  }, m = (b) => {
    !l() || !["Enter", " "].includes(b.key) || (du(b) ? n().toggleSelection(r()) : s(b));
  }, w = (b) => {
    a() && b.preventDefault();
  }, g = (b) => {
    const C = e();
    i() || a() || !C || b.target === C && n().setFocusedKey(r());
  }, p = J(() => {
    if (!(i() || a()))
      return r() === n().focusedKey() ? 0 : -1;
  }), v = J(() => R(t.virtualized) ? void 0 : r());
  return Z(He([
    e,
    r,
    i,
    () => n().focusedKey(),
    () => n().isFocused()
  ], ([b, C, _, E, F]) => {
    b && C === E && F && !_ && document.activeElement !== b && (t.focus ? t.focus() : Ue(b));
  })), {
    isSelected: o,
    isDisabled: a,
    allowsSelection: l,
    tabIndex: p,
    dataKey: v,
    onPointerDown: u,
    onPointerUp: f,
    onClick: h,
    onKeyDown: m,
    onMouseDown: w,
    onFocus: g
  };
}
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/bfce84fee12a027d9cbc38b43e1747e3e4b4b169/packages/@react-stately/selection/src/SelectionManager.ts
 */
class bw {
  constructor(e, n) {
    pe(this, "collection");
    pe(this, "state");
    this.collection = e, this.state = n;
  }
  /** The type of selection that is allowed in the collection. */
  selectionMode() {
    return this.state.selectionMode();
  }
  /** Whether the collection allows empty selection. */
  disallowEmptySelection() {
    return this.state.disallowEmptySelection();
  }
  /** The selection behavior for the collection. */
  selectionBehavior() {
    return this.state.selectionBehavior();
  }
  /** Sets the selection behavior for the collection. */
  setSelectionBehavior(e) {
    this.state.setSelectionBehavior(e);
  }
  /** Whether the collection is currently focused. */
  isFocused() {
    return this.state.isFocused();
  }
  /** Sets whether the collection is focused. */
  setFocused(e) {
    this.state.setFocused(e);
  }
  /** The current focused key in the collection. */
  focusedKey() {
    return this.state.focusedKey();
  }
  /** Sets the focused key. */
  setFocusedKey(e) {
    (e == null || this.collection().getItem(e)) && this.state.setFocusedKey(e);
  }
  /** The currently selected keys in the collection. */
  selectedKeys() {
    return this.state.selectedKeys();
  }
  /** Returns whether a key is selected. */
  isSelected(e) {
    if (this.state.selectionMode() === "none")
      return !1;
    const n = this.getKey(e);
    return n == null ? !1 : this.state.selectedKeys().has(n);
  }
  /** Whether the selection is empty. */
  isEmpty() {
    return this.state.selectedKeys().size === 0;
  }
  /** Whether all items in the collection are selected. */
  isSelectAll() {
    if (this.isEmpty())
      return !1;
    const e = this.state.selectedKeys();
    return this.getAllSelectableKeys().every((n) => e.has(n));
  }
  firstSelectedKey() {
    let e;
    for (const n of this.state.selectedKeys()) {
      const r = this.collection().getItem(n), i = (r == null ? void 0 : r.index) != null && (e == null ? void 0 : e.index) != null && r.index < e.index;
      (!e || i) && (e = r);
    }
    return e == null ? void 0 : e.key;
  }
  lastSelectedKey() {
    let e;
    for (const n of this.state.selectedKeys()) {
      const r = this.collection().getItem(n), i = (r == null ? void 0 : r.index) != null && (e == null ? void 0 : e.index) != null && r.index > e.index;
      (!e || i) && (e = r);
    }
    return e == null ? void 0 : e.key;
  }
  /** Extends the selection to the given key. */
  extendSelection(e) {
    if (this.selectionMode() === "none")
      return;
    if (this.selectionMode() === "single") {
      this.replaceSelection(e);
      return;
    }
    const n = this.getKey(e);
    if (n == null)
      return;
    const r = this.state.selectedKeys(), i = r.anchorKey || n, s = new _t(r, i, n);
    for (const o of this.getKeyRange(i, r.currentKey || n))
      s.delete(o);
    for (const o of this.getKeyRange(n, i))
      this.canSelectItem(o) && s.add(o);
    this.state.setSelectedKeys(s);
  }
  getKeyRange(e, n) {
    const r = this.collection().getItem(e), i = this.collection().getItem(n);
    return r && i ? r.index != null && i.index != null && r.index <= i.index ? this.getKeyRangeInternal(e, n) : this.getKeyRangeInternal(n, e) : [];
  }
  getKeyRangeInternal(e, n) {
    const r = [];
    let i = e;
    for (; i != null; ) {
      const s = this.collection().getItem(i);
      if (s && s.type === "item" && r.push(i), i === n)
        return r;
      i = this.collection().getKeyAfter(i);
    }
    return [];
  }
  getKey(e) {
    const n = this.collection().getItem(e);
    return n ? !n || n.type !== "item" ? null : n.key : e;
  }
  /** Toggles whether the given key is selected. */
  toggleSelection(e) {
    if (this.selectionMode() === "none")
      return;
    if (this.selectionMode() === "single" && !this.isSelected(e)) {
      this.replaceSelection(e);
      return;
    }
    const n = this.getKey(e);
    if (n == null)
      return;
    const r = new _t(this.state.selectedKeys());
    r.has(n) ? r.delete(n) : this.canSelectItem(n) && (r.add(n), r.anchorKey = n, r.currentKey = n), !(this.disallowEmptySelection() && r.size === 0) && this.state.setSelectedKeys(r);
  }
  /** Replaces the selection with only the given key. */
  replaceSelection(e) {
    if (this.selectionMode() === "none")
      return;
    const n = this.getKey(e);
    if (n == null)
      return;
    const r = this.canSelectItem(n) ? new _t([n], n, n) : new _t();
    this.state.setSelectedKeys(r);
  }
  /** Replaces the selection with the given keys. */
  setSelectedKeys(e) {
    if (this.selectionMode() === "none")
      return;
    const n = new _t();
    for (const r of e) {
      const i = this.getKey(r);
      if (i != null && (n.add(i), this.selectionMode() === "single"))
        break;
    }
    this.state.setSelectedKeys(n);
  }
  /** Selects all items in the collection. */
  selectAll() {
    this.selectionMode() === "multiple" && this.state.setSelectedKeys(new Set(this.getAllSelectableKeys()));
  }
  /**
   * Removes all keys from the selection.
   */
  clearSelection() {
    const e = this.state.selectedKeys();
    !this.disallowEmptySelection() && e.size > 0 && this.state.setSelectedKeys(new _t());
  }
  /**
   * Toggles between select all and an empty selection.
   */
  toggleSelectAll() {
    this.isSelectAll() ? this.clearSelection() : this.selectAll();
  }
  select(e, n) {
    this.selectionMode() !== "none" && (this.selectionMode() === "single" ? this.isSelected(e) && !this.disallowEmptySelection() ? this.toggleSelection(e) : this.replaceSelection(e) : this.selectionBehavior() === "toggle" || n && n.pointerType === "touch" ? this.toggleSelection(e) : this.replaceSelection(e));
  }
  /** Returns whether the current selection is equal to the given selection. */
  isSelectionEqual(e) {
    if (e === this.state.selectedKeys())
      return !0;
    const n = this.selectedKeys();
    if (e.size !== n.size)
      return !1;
    for (const r of e)
      if (!n.has(r))
        return !1;
    for (const r of n)
      if (!e.has(r))
        return !1;
    return !0;
  }
  canSelectItem(e) {
    if (this.state.selectionMode() === "none")
      return !1;
    const n = this.collection().getItem(e);
    return n != null && !n.disabled;
  }
  isDisabled(e) {
    const n = this.collection().getItem(e);
    return !n || n.disabled;
  }
  getAllSelectableKeys() {
    const e = [];
    return ((r) => {
      for (; r != null; ) {
        if (this.canSelectItem(r)) {
          const i = this.collection().getItem(r);
          if (!i)
            continue;
          i.type === "item" && e.push(r);
        }
        r = this.collection().getKeyAfter(r);
      }
    })(this.collection().getFirstKey()), e;
  }
}
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/bfce84fee12a027d9cbc38b43e1747e3e4b4b169/packages/@react-stately/list/src/ListCollection.ts
 */
class ol {
  constructor(e) {
    pe(this, "keyMap", /* @__PURE__ */ new Map());
    pe(this, "iterable");
    pe(this, "firstKey");
    pe(this, "lastKey");
    this.iterable = e;
    for (const i of e)
      this.keyMap.set(i.key, i);
    if (this.keyMap.size === 0)
      return;
    let n, r = 0;
    for (const [i, s] of this.keyMap)
      n ? (n.nextKey = i, s.prevKey = n.key) : (this.firstKey = i, s.prevKey = void 0), s.type === "item" && (s.index = r++), n = s, n.nextKey = void 0;
    this.lastKey = n.key;
  }
  *[Symbol.iterator]() {
    yield* this.iterable;
  }
  getSize() {
    return this.keyMap.size;
  }
  getKeys() {
    return this.keyMap.keys();
  }
  getKeyBefore(e) {
    var n;
    return (n = this.keyMap.get(e)) == null ? void 0 : n.prevKey;
  }
  getKeyAfter(e) {
    var n;
    return (n = this.keyMap.get(e)) == null ? void 0 : n.nextKey;
  }
  getFirstKey() {
    return this.firstKey;
  }
  getLastKey() {
    return this.lastKey;
  }
  getItem(e) {
    return this.keyMap.get(e);
  }
  at(e) {
    const n = [...this.getKeys()];
    return this.getItem(n[e]);
  }
}
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/bfce84fee12a027d9cbc38b43e1747e3e4b4b169/packages/@react-stately/list/src/useListState.ts
 */
function hu(t) {
  const e = gw(t), r = Fm({
    dataSource: () => R(t.dataSource),
    getKey: () => R(t.getKey),
    getTextValue: () => R(t.getTextValue),
    getDisabled: () => R(t.getDisabled),
    getSectionChildren: () => R(t.getSectionChildren),
    factory: (s) => t.filter ? new ol(t.filter(s)) : new ol(s)
  }, [() => t.filter]), i = new bw(r, e);
  return Fl(() => {
    const s = e.focusedKey();
    s != null && !r().getItem(s) && e.setFocusedKey(void 0);
  }), {
    collection: r,
    selectionManager: () => i
  };
}
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/8f2f2acb3d5850382ebe631f055f88c704aa7d17/packages/@react-aria/selection/src/ListKeyboardDelegate.ts
 */
class gu {
  constructor(e, n, r) {
    pe(this, "collection");
    pe(this, "ref");
    pe(this, "collator");
    this.collection = e, this.ref = n, this.collator = r;
  }
  getKeyBelow(e) {
    let n = this.collection().getKeyAfter(e);
    for (; n != null; ) {
      const r = this.collection().getItem(n);
      if (r && r.type === "item" && !r.disabled)
        return n;
      n = this.collection().getKeyAfter(n);
    }
  }
  getKeyAbove(e) {
    let n = this.collection().getKeyBefore(e);
    for (; n != null; ) {
      const r = this.collection().getItem(n);
      if (r && r.type === "item" && !r.disabled)
        return n;
      n = this.collection().getKeyBefore(n);
    }
  }
  getFirstKey() {
    let e = this.collection().getFirstKey();
    for (; e != null; ) {
      const n = this.collection().getItem(e);
      if (n && n.type === "item" && !n.disabled)
        return e;
      e = this.collection().getKeyAfter(e);
    }
  }
  getLastKey() {
    let e = this.collection().getLastKey();
    for (; e != null; ) {
      const n = this.collection().getItem(e);
      if (n && n.type === "item" && !n.disabled)
        return e;
      e = this.collection().getKeyBefore(e);
    }
  }
  getItem(e) {
    var n, r;
    return ((r = (n = this.ref) == null ? void 0 : n.call(this)) == null ? void 0 : r.querySelector(`[data-key="${e}"]`)) ?? null;
  }
  // TODO: not working correctly
  getKeyPageAbove(e) {
    var o;
    const n = (o = this.ref) == null ? void 0 : o.call(this);
    let r = this.getItem(e);
    if (!n || !r)
      return;
    const i = Math.max(0, r.offsetTop + r.offsetHeight - n.offsetHeight);
    let s = e;
    for (; s && r && r.offsetTop > i; )
      s = this.getKeyAbove(s), r = s != null ? this.getItem(s) : null;
    return s;
  }
  // TODO: not working correctly
  getKeyPageBelow(e) {
    var o;
    const n = (o = this.ref) == null ? void 0 : o.call(this);
    let r = this.getItem(e);
    if (!n || !r)
      return;
    const i = Math.min(n.scrollHeight, r.offsetTop - r.offsetHeight + n.offsetHeight);
    let s = e;
    for (; s && r && r.offsetTop < i; )
      s = this.getKeyBelow(s), r = s != null ? this.getItem(s) : null;
    return s;
  }
  getKeyForSearch(e, n) {
    var s;
    const r = (s = this.collator) == null ? void 0 : s.call(this);
    if (!r)
      return;
    let i = n != null ? this.getKeyBelow(n) : this.getFirstKey();
    for (; i != null; ) {
      const o = this.collection().getItem(i);
      if (o) {
        const a = o.textValue.slice(0, e.length);
        if (o.textValue && r.compare(a, e) === 0)
          return i;
      }
      i = this.getKeyBelow(i);
    }
  }
}
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/8f2f2acb3d5850382ebe631f055f88c704aa7d17/packages/@react-aria/selection/src/useSelectableList.ts
 */
function yw(t, e, n) {
  const r = cu({ usage: "search", sensitivity: "base" }), i = J(() => {
    const s = R(t.keyboardDelegate);
    return s || new gu(t.collection, e, r);
  });
  return fu({
    selectionManager: () => R(t.selectionManager),
    keyboardDelegate: i,
    autoFocus: () => R(t.autoFocus),
    deferAutoFocus: () => R(t.deferAutoFocus),
    shouldFocusWrap: () => R(t.shouldFocusWrap),
    disallowEmptySelection: () => R(t.disallowEmptySelection),
    selectOnFocus: () => R(t.selectOnFocus),
    disallowTypeAhead: () => R(t.disallowTypeAhead),
    shouldUseVirtualFocus: () => R(t.shouldUseVirtualFocus),
    allowsTabNavigation: () => R(t.allowsTabNavigation),
    isVirtualized: () => R(t.isVirtualized),
    scrollToKey: (s) => {
      var o;
      return (o = R(t.scrollToKey)) == null ? void 0 : o(s);
    }
  }, e);
}
const mu = Fe();
function xw() {
  const t = Ne(mu);
  if (t === void 0)
    throw new Error("[kobalte]: `useCollapsibleContext` must be used within a `Collapsible.Root` component");
  return t;
}
function kw(t) {
  let e;
  const n = xw(), r = fe({
    id: n.generateId("content")
  }, t), [i, s] = K(r, ["ref", "id", "style"]), o = gn(() => n.shouldMount()), [a, l] = N(0), [c, u] = N(0);
  let h = n.isOpen() || o.isPresent(), m;
  return en(() => {
    const w = requestAnimationFrame(() => {
      h = !1;
    });
    me(() => {
      cancelAnimationFrame(w);
    });
  }), Z(He(
    /**
     * depends on `presence.isPresent` because it will be `false` on
     * animation end (so when close finishes). This allows us to
     * retrieve the dimensions *before* closing.
     */
    [() => o.isPresent()],
    () => {
      if (!e)
        return;
      m = m || {
        transitionDuration: e.style.transitionDuration,
        animationName: e.style.animationName
      }, e.style.transitionDuration = "0s", e.style.animationName = "none";
      const w = e.getBoundingClientRect();
      l(w.height), u(w.width), h || (e.style.transitionDuration = m.transitionDuration, e.style.animationName = m.animationName);
    }
  )), Z(() => me(n.registerContentId(i.id))), d(te, {
    get when() {
      return o.isPresent();
    },
    get children() {
      return d(Se, D({
        as: "div",
        ref(w) {
          var g = _e((p) => {
            o.setRef(p), e = p;
          }, i.ref);
          typeof g == "function" && g(w);
        },
        get id() {
          return i.id;
        },
        get style() {
          return {
            "--kb-collapsible-content-height": a() ? `${a()}px` : void 0,
            "--kb-collapsible-content-width": c() ? `${c()}px` : void 0,
            ...i.style
          };
        }
      }, () => n.dataset(), s));
    }
  });
}
function Cw(t) {
  const e = `collapsible-${tt()}`, n = fe({
    id: e
  }, t), [r, i] = K(n, ["open", "defaultOpen", "onOpenChange", "disabled", "forceMount"]), [s, o] = N(), a = or({
    open: () => r.open,
    defaultOpen: () => r.defaultOpen,
    onOpenChange: (u) => {
      var f;
      return (f = r.onOpenChange) == null ? void 0 : f.call(r, u);
    }
  }), l = J(() => ({
    "data-expanded": a.isOpen() ? "" : void 0,
    "data-closed": a.isOpen() ? void 0 : "",
    "data-disabled": r.disabled ? "" : void 0
  })), c = {
    dataset: l,
    isOpen: a.isOpen,
    disabled: () => r.disabled ?? !1,
    shouldMount: () => r.forceMount || a.isOpen(),
    contentId: s,
    toggle: a.toggle,
    generateId: Et(() => i.id),
    registerContentId: Ge(o)
  };
  return d(mu.Provider, {
    value: c,
    get children() {
      return d(Se, D({
        as: "div"
      }, l, i));
    }
  });
}
/*!
 * Portions of this file are based on code from ariakit
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the ariakit team:
 * https://github.com/hope-ui/hope-ui/blob/54125b130195f37161dbeeea0c21dc3b198bc3ac/packages/core/src/button/is-button.ts
 */
const _w = [
  "button",
  "color",
  "file",
  "image",
  "reset",
  "submit"
];
function Sw(t) {
  const e = t.tagName.toLowerCase();
  return e === "button" ? !0 : e === "input" && t.type ? _w.indexOf(t.type) !== -1 : !1;
}
function ur(t) {
  let e;
  const n = fe({
    type: "button"
  }, t), [r, i] = K(n, ["ref", "type", "disabled"]), s = au(() => e, () => "button"), o = J(() => {
    const c = s();
    return c == null ? !1 : Sw({
      tagName: c,
      type: r.type
    });
  }), a = J(() => s() === "input"), l = J(() => s() === "a" && (e == null ? void 0 : e.getAttribute("href")) != null);
  return d(Se, D({
    as: "button",
    ref(c) {
      var u = _e((f) => e = f, r.ref);
      typeof u == "function" && u(c);
    },
    get type() {
      return o() || a() ? r.type : void 0;
    },
    get role() {
      return !o() && !l() ? "button" : void 0;
    },
    get tabIndex() {
      return !o() && !l() && !r.disabled ? 0 : void 0;
    },
    get disabled() {
      return o() || a() ? r.disabled : void 0;
    },
    get "aria-disabled"() {
      return !o() && !a() && r.disabled ? !0 : void 0;
    },
    get "data-disabled"() {
      return r.disabled ? "" : void 0;
    }
  }, i));
}
const wu = Fe();
function pu() {
  return Ne(wu);
}
function Mw() {
  const t = pu();
  if (t === void 0)
    throw new Error("[kobalte]: `useDomCollectionContext` must be used within a `DomCollectionProvider` component");
  return t;
}
/*!
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/da142672eddefa99365773ced72171facc06fdcb/packages/ariakit/src/collection/collection-state.ts
 */
function vu(t, e) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_PRECEDING);
}
function Ow(t, e) {
  var i;
  const n = e.ref();
  if (!n)
    return -1;
  let r = t.length;
  if (!r)
    return -1;
  for (; r--; ) {
    const s = (i = t[r]) == null ? void 0 : i.ref();
    if (s && vu(s, n))
      return r + 1;
  }
  return 0;
}
function Ew(t) {
  const e = t.map((r, i) => [i, r]);
  let n = !1;
  return e.sort(([r, i], [s, o]) => {
    const a = i.ref(), l = o.ref();
    return a === l || !a || !l ? 0 : vu(a, l) ? (r > s && (n = !0), -1) : (r < s && (n = !0), 1);
  }), n ? e.map(([r, i]) => i) : t;
}
function bu(t, e) {
  const n = Ew(t);
  t !== n && e(n);
}
function Iw(t) {
  var i, s;
  const e = t[0], n = (i = t[t.length - 1]) == null ? void 0 : i.ref();
  let r = (s = e == null ? void 0 : e.ref()) == null ? void 0 : s.parentElement;
  for (; r; ) {
    if (n && r.contains(n))
      return r;
    r = r.parentElement;
  }
  return Qt(r).body;
}
function Pw(t, e) {
  Z(() => {
    const n = setTimeout(() => {
      bu(t(), e);
    });
    me(() => clearTimeout(n));
  });
}
function Dw(t, e) {
  if (typeof IntersectionObserver != "function") {
    Pw(t, e);
    return;
  }
  let n = [];
  Z(() => {
    const r = () => {
      const o = !!n.length;
      n = t(), o && bu(t(), e);
    }, i = Iw(t()), s = new IntersectionObserver(r, { root: i });
    for (const o of t()) {
      const a = o.ref();
      a && s.observe(a);
    }
    me(() => s.disconnect());
  });
}
/*!
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/da142672eddefa99365773ced72171facc06fdcb/packages/ariakit/src/collection/collection.tsx
 * https://github.com/ariakit/ariakit/blob/da142672eddefa99365773ced72171facc06fdcb/packages/ariakit/src/collection/collection-state.ts
 * https://github.com/ariakit/ariakit/blob/da142672eddefa99365773ced72171facc06fdcb/packages/ariakit/src/collection/collection-item.ts
 */
function yu(t = {}) {
  const [e, n] = nu({
    value: () => R(t.items),
    onChange: (s) => {
      var o;
      return (o = t.onItemsChange) == null ? void 0 : o.call(t, s);
    }
  });
  Dw(e, n);
  const r = (s) => (n((o) => {
    const a = Ow(o, s);
    return wm(o, s, a);
  }), () => {
    n((o) => {
      const a = o.filter((l) => l.ref() !== s.ref());
      return o.length === a.length ? o : a;
    });
  });
  return { DomCollectionProvider: (s) => d(wu.Provider, {
    value: { registerItem: r },
    get children() {
      return s.children;
    }
  }) };
}
function xu(t) {
  const e = Mw(), n = fe({ shouldRegisterItem: !0 }, t);
  Z(() => {
    if (!n.shouldRegisterItem)
      return;
    const r = e.registerItem(n.getItem());
    me(r);
  });
}
const ku = Fe();
function dr() {
  const t = Ne(ku);
  if (t === void 0)
    throw new Error("[kobalte]: `useDialogContext` must be used within a `Dialog` component");
  return t;
}
function $w(t) {
  const e = dr(), [n, r] = K(t, ["aria-label", "onClick"]);
  return d(ur, D({
    get "aria-label"() {
      return n["aria-label"] || e.translations().dismiss;
    },
    onClick: (s) => {
      ce(s, n.onClick), e.close();
    }
  }, r));
}
var Dt = (t) => typeof t == "function" ? t() : t, vi = /* @__PURE__ */ new Map(), Tw = (t) => {
  Z(() => {
    const e = Dt(t.style) ?? {}, n = Dt(t.properties) ?? [], r = {};
    for (const s in e)
      r[s] = t.element.style[s];
    const i = vi.get(t.key);
    i ? i.activeCount++ : vi.set(t.key, {
      activeCount: 1,
      originalStyles: r,
      properties: n.map((s) => s.key)
    }), Object.assign(t.element.style, t.style);
    for (const s of n)
      t.element.style.setProperty(s.key, s.value);
    me(() => {
      var o;
      const s = vi.get(t.key);
      if (s) {
        if (s.activeCount !== 1) {
          s.activeCount--;
          return;
        }
        vi.delete(t.key);
        for (const [a, l] of Object.entries(s.originalStyles))
          t.element.style[a] = l;
        for (const a of s.properties)
          t.element.style.removeProperty(a);
        t.element.style.length === 0 && t.element.removeAttribute("style"), (o = t.cleanup) == null || o.call(t);
      }
    });
  });
}, al = Tw, Aw = (t, e) => {
  switch (e) {
    case "x":
      return [t.clientWidth, t.scrollLeft, t.scrollWidth];
    case "y":
      return [t.clientHeight, t.scrollTop, t.scrollHeight];
  }
}, Lw = (t, e) => {
  const n = getComputedStyle(t), r = e === "x" ? n.overflowX : n.overflowY;
  return r === "auto" || r === "scroll" || // The HTML element is a scroll container if it has overflow visible
  t.tagName === "HTML" && r === "visible";
}, Fw = (t, e, n) => {
  const r = e === "x" && window.getComputedStyle(t).direction === "rtl" ? -1 : 1;
  let i = t, s = 0, o = 0, a = !1;
  do {
    const [l, c, u] = Aw(
      i,
      e
    ), f = u - l - r * c;
    (c !== 0 || f !== 0) && Lw(i, e) && (s += f, o += c), i === (n ?? document.documentElement) ? a = !0 : i = i._$host ?? i.parentElement;
  } while (i && !a);
  return [s, o];
}, [ll, cl] = N([]), zw = (t) => ll().indexOf(t) === ll().length - 1, Rw = (t) => {
  const e = D(
    {
      element: null,
      enabled: !0,
      hideScrollbar: !0,
      preventScrollbarShift: !0,
      preventScrollbarShiftMode: "padding",
      allowPinchZoom: !1
    },
    t
  ), n = tt();
  let r = [0, 0], i = null, s = null;
  Z(() => {
    Dt(e.enabled) && (cl((c) => [...c, n]), me(() => {
      cl(
        (c) => c.filter((u) => u !== n)
      );
    }));
  }), Z(() => {
    if (!Dt(e.enabled) || !Dt(e.hideScrollbar))
      return;
    const { body: c } = document, u = window.innerWidth - c.offsetWidth;
    if (al({
      key: "prevent-scroll-overflow",
      element: c,
      style: {
        overflow: "hidden"
      }
    }), Dt(e.preventScrollbarShift)) {
      const f = {}, h = [];
      u > 0 && (Dt(e.preventScrollbarShiftMode) === "padding" ? f.paddingRight = `calc(${window.getComputedStyle(c).paddingRight} + ${u}px)` : f.marginRight = `calc(${window.getComputedStyle(c).marginRight} + ${u}px)`, h.push({
        key: "--scrollbar-width",
        value: `${u}px`
      }));
      const m = window.scrollY, w = window.scrollX;
      al({
        key: "prevent-scroll-scrollbar",
        element: c,
        style: f,
        properties: h,
        cleanup: () => {
          u > 0 && window.scrollTo(w, m);
        }
      });
    }
  }), Z(() => {
    !zw(n) || !Dt(e.enabled) || (document.addEventListener("wheel", a, {
      passive: !1
    }), document.addEventListener("touchstart", o, {
      passive: !1
    }), document.addEventListener("touchmove", l, {
      passive: !1
    }), me(() => {
      document.removeEventListener("wheel", a), document.removeEventListener("touchstart", o), document.removeEventListener("touchmove", l);
    }));
  });
  const o = (c) => {
    r = ul(c), i = null, s = null;
  }, a = (c) => {
    const u = c.target, f = Dt(e.element), h = Vw(c), m = Math.abs(h[0]) > Math.abs(h[1]) ? "x" : "y", w = m === "x" ? h[0] : h[1], g = dl(u, m, w, f);
    let p;
    f && go(f, u) ? p = !g : p = !0, p && c.cancelable && c.preventDefault();
  }, l = (c) => {
    const u = Dt(e.element), f = c.target;
    let h;
    if (c.touches.length === 2)
      h = !Dt(e.allowPinchZoom);
    else {
      if (i == null || s === null) {
        const m = ul(c).map(
          (g, p) => r[p] - g
        ), w = Math.abs(m[0]) > Math.abs(m[1]) ? "x" : "y";
        i = w, s = w === "x" ? m[0] : m[1];
      }
      if (f.type === "range")
        h = !1;
      else {
        const m = dl(
          f,
          i,
          s,
          u
        );
        u && go(u, f) ? h = !m : h = !0;
      }
    }
    h && c.cancelable && c.preventDefault();
  };
}, Vw = (t) => [
  t.deltaX,
  t.deltaY
], ul = (t) => t.changedTouches[0] ? [t.changedTouches[0].clientX, t.changedTouches[0].clientY] : [0, 0], dl = (t, e, n, r) => {
  const i = r && go(r, t), [s, o] = Fw(
    t,
    e,
    i ? r : void 0
  );
  return !(n > 0 && Math.abs(s) <= 1 || n < 0 && Math.abs(o) < 1);
}, go = (t, e) => {
  if (t.contains(e))
    return !0;
  let n = e;
  for (; n; ) {
    if (n === t)
      return !0;
    n = n._$host ?? n.parentElement;
  }
  return !1;
}, Nw = Rw, as = Nw;
const Cu = Fe();
function Kw() {
  return Ne(Cu);
}
function ls(t) {
  let e;
  const n = Kw(), [r, i] = K(t, ["ref", "disableOutsidePointerEvents", "excludedElements", "onEscapeKeyDown", "onPointerDownOutside", "onFocusOutside", "onInteractOutside", "onDismiss", "bypassTopMostLayerCheck"]), s = /* @__PURE__ */ new Set([]), o = (f) => {
    s.add(f);
    const h = n == null ? void 0 : n.registerNestedLayer(f);
    return () => {
      s.delete(f), h == null || h();
    };
  };
  Qm({
    shouldExcludeElement: (f) => {
      var h;
      return e ? ((h = r.excludedElements) == null ? void 0 : h.some((m) => dt(m(), f))) || [...s].some((m) => dt(m, f)) : !1;
    },
    onPointerDownOutside: (f) => {
      var h, m, w;
      !e || gt.isBelowPointerBlockingLayer(e) || !r.bypassTopMostLayerCheck && !gt.isTopMostLayer(e) || ((h = r.onPointerDownOutside) == null || h.call(r, f), (m = r.onInteractOutside) == null || m.call(r, f), f.defaultPrevented || (w = r.onDismiss) == null || w.call(r));
    },
    onFocusOutside: (f) => {
      var h, m, w;
      (h = r.onFocusOutside) == null || h.call(r, f), (m = r.onInteractOutside) == null || m.call(r, f), f.defaultPrevented || (w = r.onDismiss) == null || w.call(r);
    }
  }, () => e), zm({
    ownerDocument: () => Qt(e),
    onEscapeKeyDown: (f) => {
      var h;
      !e || !gt.isTopMostLayer(e) || ((h = r.onEscapeKeyDown) == null || h.call(r, f), !f.defaultPrevented && r.onDismiss && (f.preventDefault(), r.onDismiss()));
    }
  }), en(() => {
    if (!e)
      return;
    gt.addLayer({
      node: e,
      isPointerBlocking: r.disableOutsidePointerEvents,
      dismiss: r.onDismiss
    });
    const f = n == null ? void 0 : n.registerNestedLayer(e);
    gt.assignPointerEventToLayers(), gt.disableBodyPointerEvents(e), me(() => {
      e && (gt.removeLayer(e), f == null || f(), gt.assignPointerEventToLayers(), gt.restoreBodyPointerEvents(e));
    });
  }), Z(He([() => e, () => r.disableOutsidePointerEvents], ([f, h]) => {
    if (!f)
      return;
    const m = gt.find(f);
    m && m.isPointerBlocking !== h && (m.isPointerBlocking = h, gt.assignPointerEventToLayers()), h && gt.disableBodyPointerEvents(f), me(() => {
      gt.restoreBodyPointerEvents(f);
    });
  }, {
    defer: !0
  }));
  const u = {
    registerNestedLayer: o
  };
  return d(Cu.Provider, {
    value: u,
    get children() {
      return d(Se, D({
        as: "div",
        ref(f) {
          var h = _e((m) => e = m, r.ref);
          typeof h == "function" && h(f);
        }
      }, i));
    }
  });
}
function Bw(t) {
  let e;
  const n = dr(), r = fe({
    id: n.generateId("content")
  }, t), [i, s] = K(r, ["ref", "onOpenAutoFocus", "onCloseAutoFocus", "onPointerDownOutside", "onFocusOutside", "onInteractOutside"]);
  let o = !1, a = !1;
  const l = (h) => {
    var m;
    (m = i.onPointerDownOutside) == null || m.call(i, h), n.modal() && h.detail.isContextMenu && h.preventDefault();
  }, c = (h) => {
    var m;
    (m = i.onFocusOutside) == null || m.call(i, h), n.modal() && h.preventDefault();
  }, u = (h) => {
    var m;
    (m = i.onInteractOutside) == null || m.call(i, h), !n.modal() && (h.defaultPrevented || (o = !0, h.detail.originalEvent.type === "pointerdown" && (a = !0)), dt(n.triggerRef(), h.target) && h.preventDefault(), h.detail.originalEvent.type === "focusin" && a && h.preventDefault());
  }, f = (h) => {
    var m;
    (m = i.onCloseAutoFocus) == null || m.call(i, h), n.modal() ? (h.preventDefault(), Ue(n.triggerRef())) : (h.defaultPrevented || (o || Ue(n.triggerRef()), h.preventDefault()), o = !1, a = !1);
  };
  return os({
    isDisabled: () => !(n.isOpen() && n.modal()),
    targets: () => e ? [e] : []
  }), as({
    element: () => e ?? null,
    enabled: () => n.isOpen() && n.preventScroll()
  }), ss({
    trapFocus: () => n.isOpen() && n.modal(),
    onMountAutoFocus: i.onOpenAutoFocus,
    onUnmountAutoFocus: f
  }, () => e), Z(() => me(n.registerContentId(s.id))), d(te, {
    get when() {
      return n.contentPresence.isPresent();
    },
    get children() {
      return d(ls, D({
        ref(h) {
          var m = _e((w) => {
            n.contentPresence.setRef(w), e = w;
          }, i.ref);
          typeof m == "function" && m(h);
        },
        role: "dialog",
        tabIndex: -1,
        get disableOutsidePointerEvents() {
          return J(() => !!n.modal())() && n.isOpen();
        },
        get excludedElements() {
          return [n.triggerRef];
        },
        get "aria-labelledby"() {
          return n.titleId();
        },
        get "aria-describedby"() {
          return n.descriptionId();
        },
        get "data-expanded"() {
          return n.isOpen() ? "" : void 0;
        },
        get "data-closed"() {
          return n.isOpen() ? void 0 : "";
        },
        onPointerDownOutside: l,
        onFocusOutside: c,
        onInteractOutside: u,
        get onDismiss() {
          return n.close;
        }
      }, s));
    }
  });
}
function jw(t) {
  const e = dr(), n = fe({
    id: e.generateId("description")
  }, t), [r, i] = K(n, ["id"]);
  return Z(() => me(e.registerDescriptionId(r.id))), d(Se, D({
    as: "p",
    get id() {
      return r.id;
    }
  }, i));
}
function Ww(t) {
  const e = dr(), [n, r] = K(t, ["ref", "style", "onPointerDown"]), i = (s) => {
    ce(s, n.onPointerDown), s.target === s.currentTarget && s.preventDefault();
  };
  return d(te, {
    get when() {
      return e.overlayPresence.isPresent();
    },
    get children() {
      return d(Se, D({
        as: "div",
        ref(s) {
          var o = _e(e.overlayPresence.setRef, n.ref);
          typeof o == "function" && o(s);
        },
        get style() {
          return {
            "pointer-events": "auto",
            ...n.style
          };
        },
        get "data-expanded"() {
          return e.isOpen() ? "" : void 0;
        },
        get "data-closed"() {
          return e.isOpen() ? void 0 : "";
        },
        onPointerDown: i
      }, r));
    }
  });
}
function Hw(t) {
  const e = dr();
  return d(te, {
    get when() {
      return e.contentPresence.isPresent() || e.overlayPresence.isPresent();
    },
    get children() {
      return d(Gi, t);
    }
  });
}
const fl = {
  // `aria-label` of Dialog.CloseButton.
  dismiss: "Dismiss"
};
function Uw(t) {
  const e = `dialog-${tt()}`, n = fe({
    id: e,
    modal: !0,
    translations: fl
  }, t), [r, i] = N(), [s, o] = N(), [a, l] = N(), [c, u] = N(), f = or({
    open: () => n.open,
    defaultOpen: () => n.defaultOpen,
    onOpenChange: (p) => {
      var v;
      return (v = n.onOpenChange) == null ? void 0 : v.call(n, p);
    }
  }), h = () => n.forceMount || f.isOpen(), m = gn(h), w = gn(h), g = {
    translations: () => n.translations ?? fl,
    isOpen: f.isOpen,
    modal: () => n.modal ?? !0,
    preventScroll: () => n.preventScroll ?? g.modal(),
    contentId: r,
    titleId: s,
    descriptionId: a,
    triggerRef: c,
    overlayPresence: m,
    contentPresence: w,
    close: f.close,
    toggle: f.toggle,
    setTriggerRef: u,
    generateId: Et(() => n.id),
    registerContentId: Ge(i),
    registerTitleId: Ge(o),
    registerDescriptionId: Ge(l)
  };
  return d(ku.Provider, {
    value: g,
    get children() {
      return n.children;
    }
  });
}
function qw(t) {
  const e = dr(), n = fe({
    id: e.generateId("title")
  }, t), [r, i] = K(n, ["id"]);
  return Z(() => me(e.registerTitleId(r.id))), d(Se, D({
    as: "h2",
    get id() {
      return r.id;
    }
  }, i));
}
const _u = Fe();
function cs() {
  const t = Ne(_u);
  if (t === void 0)
    throw new Error("[kobalte]: `useCheckboxContext` must be used within a `Checkbox` component");
  return t;
}
function Gw(t) {
  const e = ft(), n = cs(), r = fe({
    id: n.generateId("control")
  }, t), [i, s] = K(r, ["onClick", "onKeyDown"]);
  return d(Se, D({
    as: "div",
    onClick: (l) => {
      var c;
      ce(l, i.onClick), n.toggle(), (c = n.inputRef()) == null || c.focus();
    },
    onKeyDown: (l) => {
      var c;
      ce(l, i.onKeyDown), l.key === Jr.Space && (n.toggle(), (c = n.inputRef()) == null || c.focus());
    }
  }, () => e.dataset(), () => n.dataset(), s));
}
function Yw(t) {
  const e = ft(), n = cs(), r = fe({
    id: n.generateId("indicator")
  }, t), [i, s] = K(r, ["ref", "forceMount"]), o = gn(() => i.forceMount || n.indeterminate() || n.checked());
  return d(te, {
    get when() {
      return o.isPresent();
    },
    get children() {
      return d(Se, D({
        as: "div",
        ref(a) {
          var l = _e(o.setRef, i.ref);
          typeof l == "function" && l(a);
        }
      }, () => e.dataset(), () => n.dataset(), s));
    }
  });
}
var Xw = /* @__PURE__ */ L("<input type=checkbox>");
function Qw(t) {
  let e;
  const n = ft(), r = cs(), i = fe({
    id: r.generateId("input")
  }, t), [s, o, a] = K(i, ["ref", "style", "onChange", "onFocus", "onBlur"], ei), {
    fieldProps: l
  } = ti(o), [c, u] = N(!1), f = (w) => {
    if (ce(w, s.onChange), w.stopPropagation(), !c()) {
      const g = w.target;
      r.setIsChecked(g.checked), g.checked = r.checked();
    }
    u(!1);
  }, h = (w) => {
    ce(w, s.onFocus), r.setIsFocused(!0);
  }, m = (w) => {
    ce(w, s.onBlur), r.setIsFocused(!1);
  };
  return Z(He([() => r.checked(), () => r.value()], () => {
    u(!0), e == null || e.dispatchEvent(new Event("input", {
      bubbles: !0,
      cancelable: !0
    })), e == null || e.dispatchEvent(new Event("change", {
      bubbles: !0,
      cancelable: !0
    }));
  }, {
    defer: !0
  })), Z(He([() => e, () => r.indeterminate(), () => r.checked()], ([w, g]) => {
    w && (w.indeterminate = g);
  })), (() => {
    var w = Xw();
    w.addEventListener("blur", m), w.addEventListener("focus", h), w.addEventListener("change", f);
    var g = _e((p) => {
      r.setInputRef(p), e = p;
    }, s.ref);
    return typeof g == "function" && vt(g, w), nt(w, D({
      get id() {
        return l.id();
      },
      get name() {
        return n.name();
      },
      get value() {
        return r.value();
      },
      get checked() {
        return r.checked();
      },
      get required() {
        return n.isRequired();
      },
      get disabled() {
        return n.isDisabled();
      },
      get readonly() {
        return n.isReadOnly();
      },
      get style() {
        return {
          ...Zr,
          ...s.style
        };
      },
      get "aria-label"() {
        return l.ariaLabel();
      },
      get "aria-labelledby"() {
        return l.ariaLabelledBy();
      },
      get "aria-describedby"() {
        return l.ariaDescribedBy();
      },
      get "aria-invalid"() {
        return n.validationState() === "invalid" || void 0;
      },
      get "aria-required"() {
        return n.isRequired() || void 0;
      },
      get "aria-disabled"() {
        return n.isDisabled() || void 0;
      },
      get "aria-readonly"() {
        return n.isReadOnly() || void 0;
      }
    }, () => n.dataset(), () => r.dataset(), a), !1, !1), w;
  })();
}
function Jw(t) {
  const e = cs();
  return d(ew, D(() => e.dataset(), t));
}
function Zw(t) {
  let e;
  const n = `checkbox-${tt()}`, r = fe({
    value: "on",
    id: n
  }, t), [i, s, o] = K(r, ["ref", "children", "value", "checked", "defaultChecked", "indeterminate", "onChange", "onPointerDown"], lr), [a, l] = N(), [c, u] = N(!1), {
    formControlContext: f
  } = cr(s), h = Bo({
    isSelected: () => i.checked,
    defaultIsSelected: () => i.defaultChecked,
    onSelectedChange: (p) => {
      var v;
      return (v = i.onChange) == null ? void 0 : v.call(i, p);
    },
    isDisabled: () => f.isDisabled(),
    isReadOnly: () => f.isReadOnly()
  });
  ar(() => e, () => h.setIsSelected(i.defaultChecked ?? !1));
  const m = (p) => {
    ce(p, i.onPointerDown), c() && p.preventDefault();
  }, w = J(() => ({
    "data-checked": h.isSelected() ? "" : void 0,
    "data-indeterminate": i.indeterminate ? "" : void 0
  })), g = {
    value: () => i.value,
    dataset: w,
    checked: () => h.isSelected(),
    indeterminate: () => i.indeterminate ?? !1,
    inputRef: a,
    generateId: Et(() => R(s.id)),
    toggle: () => h.toggle(),
    setIsChecked: (p) => h.setIsSelected(p),
    setIsFocused: u,
    setInputRef: l
  };
  return d(An.Provider, {
    value: f,
    get children() {
      return d(_u.Provider, {
        value: g,
        get children() {
          return d(Se, D({
            as: "div",
            ref(p) {
              var v = _e((b) => e = b, i.ref);
              typeof v == "function" && v(p);
            },
            role: "group",
            get id() {
              return R(s.id);
            },
            onPointerDown: m
          }, () => f.dataset(), w, o, {
            get children() {
              return d(ep, {
                state: g,
                get children() {
                  return i.children;
                }
              });
            }
          }));
        }
      });
    }
  });
}
function ep(t) {
  const e = Dn(() => {
    const n = t.children;
    return fn(n) ? n(t.state) : n;
  });
  return J(e);
}
const Su = Fe();
function tp() {
  const t = Ne(Su);
  if (t === void 0)
    throw new Error("[kobalte]: `usePopperContext` must be used within a `Popper` component");
  return t;
}
function jo(t) {
  const e = tp(), [n, r] = K(t, ["ref", "style"]);
  return d(Se, D({
    as: "div",
    ref(i) {
      var s = _e(e.setPositionerRef, n.ref);
      typeof s == "function" && s(i);
    },
    "data-popper-positioner": "",
    get style() {
      return {
        position: "absolute",
        top: 0,
        left: 0,
        "min-width": "max-content",
        ...n.style
      };
    }
  }, r));
}
const np = ["top", "right", "bottom", "left"], mn = Math.min, wt = Math.max, Ri = Math.round, bi = Math.floor, wn = (t) => ({
  x: t,
  y: t
}), rp = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, ip = {
  start: "end",
  end: "start"
};
function mo(t, e, n) {
  return wt(t, mn(e, n));
}
function Ln(t, e) {
  return typeof t == "function" ? t(e) : t;
}
function pn(t) {
  return t.split("-")[0];
}
function fr(t) {
  return t.split("-")[1];
}
function Mu(t) {
  return t === "x" ? "y" : "x";
}
function Wo(t) {
  return t === "y" ? "height" : "width";
}
function ri(t) {
  return ["top", "bottom"].includes(pn(t)) ? "y" : "x";
}
function Ho(t) {
  return Mu(ri(t));
}
function sp(t, e, n) {
  n === void 0 && (n = !1);
  const r = fr(t), i = Ho(t), s = Wo(i);
  let o = i === "x" ? r === (n ? "end" : "start") ? "right" : "left" : r === "start" ? "bottom" : "top";
  return e.reference[s] > e.floating[s] && (o = Vi(o)), [o, Vi(o)];
}
function op(t) {
  const e = Vi(t);
  return [wo(t), e, wo(e)];
}
function wo(t) {
  return t.replace(/start|end/g, (e) => ip[e]);
}
function ap(t, e, n) {
  const r = ["left", "right"], i = ["right", "left"], s = ["top", "bottom"], o = ["bottom", "top"];
  switch (t) {
    case "top":
    case "bottom":
      return n ? e ? i : r : e ? r : i;
    case "left":
    case "right":
      return e ? s : o;
    default:
      return [];
  }
}
function lp(t, e, n, r) {
  const i = fr(t);
  let s = ap(pn(t), n === "start", r);
  return i && (s = s.map((o) => o + "-" + i), e && (s = s.concat(s.map(wo)))), s;
}
function Vi(t) {
  return t.replace(/left|right|bottom|top/g, (e) => rp[e]);
}
function cp(t) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...t
  };
}
function Ou(t) {
  return typeof t != "number" ? cp(t) : {
    top: t,
    right: t,
    bottom: t,
    left: t
  };
}
function Ni(t) {
  const {
    x: e,
    y: n,
    width: r,
    height: i
  } = t;
  return {
    width: r,
    height: i,
    top: n,
    left: e,
    right: e + r,
    bottom: n + i,
    x: e,
    y: n
  };
}
function hl(t, e, n) {
  let {
    reference: r,
    floating: i
  } = t;
  const s = ri(e), o = Ho(e), a = Wo(o), l = pn(e), c = s === "y", u = r.x + r.width / 2 - i.width / 2, f = r.y + r.height / 2 - i.height / 2, h = r[a] / 2 - i[a] / 2;
  let m;
  switch (l) {
    case "top":
      m = {
        x: u,
        y: r.y - i.height
      };
      break;
    case "bottom":
      m = {
        x: u,
        y: r.y + r.height
      };
      break;
    case "right":
      m = {
        x: r.x + r.width,
        y: f
      };
      break;
    case "left":
      m = {
        x: r.x - i.width,
        y: f
      };
      break;
    default:
      m = {
        x: r.x,
        y: r.y
      };
  }
  switch (fr(e)) {
    case "start":
      m[o] -= h * (n && c ? -1 : 1);
      break;
    case "end":
      m[o] += h * (n && c ? -1 : 1);
      break;
  }
  return m;
}
const up = async (t, e, n) => {
  const {
    placement: r = "bottom",
    strategy: i = "absolute",
    middleware: s = [],
    platform: o
  } = n, a = s.filter(Boolean), l = await (o.isRTL == null ? void 0 : o.isRTL(e));
  let c = await o.getElementRects({
    reference: t,
    floating: e,
    strategy: i
  }), {
    x: u,
    y: f
  } = hl(c, r, l), h = r, m = {}, w = 0;
  for (let g = 0; g < a.length; g++) {
    const {
      name: p,
      fn: v
    } = a[g], {
      x: b,
      y: C,
      data: _,
      reset: E
    } = await v({
      x: u,
      y: f,
      initialPlacement: r,
      placement: h,
      strategy: i,
      middlewareData: m,
      rects: c,
      platform: o,
      elements: {
        reference: t,
        floating: e
      }
    });
    u = b ?? u, f = C ?? f, m = {
      ...m,
      [p]: {
        ...m[p],
        ..._
      }
    }, E && w <= 50 && (w++, typeof E == "object" && (E.placement && (h = E.placement), E.rects && (c = E.rects === !0 ? await o.getElementRects({
      reference: t,
      floating: e,
      strategy: i
    }) : E.rects), {
      x: u,
      y: f
    } = hl(c, h, l)), g = -1);
  }
  return {
    x: u,
    y: f,
    placement: h,
    strategy: i,
    middlewareData: m
  };
};
async function Gr(t, e) {
  var n;
  e === void 0 && (e = {});
  const {
    x: r,
    y: i,
    platform: s,
    rects: o,
    elements: a,
    strategy: l
  } = t, {
    boundary: c = "clippingAncestors",
    rootBoundary: u = "viewport",
    elementContext: f = "floating",
    altBoundary: h = !1,
    padding: m = 0
  } = Ln(e, t), w = Ou(m), p = a[h ? f === "floating" ? "reference" : "floating" : f], v = Ni(await s.getClippingRect({
    element: (n = await (s.isElement == null ? void 0 : s.isElement(p))) == null || n ? p : p.contextElement || await (s.getDocumentElement == null ? void 0 : s.getDocumentElement(a.floating)),
    boundary: c,
    rootBoundary: u,
    strategy: l
  })), b = f === "floating" ? {
    x: r,
    y: i,
    width: o.floating.width,
    height: o.floating.height
  } : o.reference, C = await (s.getOffsetParent == null ? void 0 : s.getOffsetParent(a.floating)), _ = await (s.isElement == null ? void 0 : s.isElement(C)) ? await (s.getScale == null ? void 0 : s.getScale(C)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, E = Ni(s.convertOffsetParentRelativeRectToViewportRelativeRect ? await s.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: a,
    rect: b,
    offsetParent: C,
    strategy: l
  }) : b);
  return {
    top: (v.top - E.top + w.top) / _.y,
    bottom: (E.bottom - v.bottom + w.bottom) / _.y,
    left: (v.left - E.left + w.left) / _.x,
    right: (E.right - v.right + w.right) / _.x
  };
}
const dp = (t) => ({
  name: "arrow",
  options: t,
  async fn(e) {
    const {
      x: n,
      y: r,
      placement: i,
      rects: s,
      platform: o,
      elements: a,
      middlewareData: l
    } = e, {
      element: c,
      padding: u = 0
    } = Ln(t, e) || {};
    if (c == null)
      return {};
    const f = Ou(u), h = {
      x: n,
      y: r
    }, m = Ho(i), w = Wo(m), g = await o.getDimensions(c), p = m === "y", v = p ? "top" : "left", b = p ? "bottom" : "right", C = p ? "clientHeight" : "clientWidth", _ = s.reference[w] + s.reference[m] - h[m] - s.floating[w], E = h[m] - s.reference[m], F = await (o.getOffsetParent == null ? void 0 : o.getOffsetParent(c));
    let T = F ? F[C] : 0;
    (!T || !await (o.isElement == null ? void 0 : o.isElement(F))) && (T = a.floating[C] || s.floating[w]);
    const x = _ / 2 - E / 2, y = T / 2 - g[w] / 2 - 1, z = mn(f[v], y), I = mn(f[b], y), O = z, Q = T - g[w] - I, H = T / 2 - g[w] / 2 + x, S = mo(O, H, Q), M = !l.arrow && fr(i) != null && H !== S && s.reference[w] / 2 - (H < O ? z : I) - g[w] / 2 < 0, P = M ? H < O ? H - O : H - Q : 0;
    return {
      [m]: h[m] + P,
      data: {
        [m]: S,
        centerOffset: H - S - P,
        ...M && {
          alignmentOffset: P
        }
      },
      reset: M
    };
  }
}), fp = function(t) {
  return t === void 0 && (t = {}), {
    name: "flip",
    options: t,
    async fn(e) {
      var n, r;
      const {
        placement: i,
        middlewareData: s,
        rects: o,
        initialPlacement: a,
        platform: l,
        elements: c
      } = e, {
        mainAxis: u = !0,
        crossAxis: f = !0,
        fallbackPlacements: h,
        fallbackStrategy: m = "bestFit",
        fallbackAxisSideDirection: w = "none",
        flipAlignment: g = !0,
        ...p
      } = Ln(t, e);
      if ((n = s.arrow) != null && n.alignmentOffset)
        return {};
      const v = pn(i), b = pn(a) === a, C = await (l.isRTL == null ? void 0 : l.isRTL(c.floating)), _ = h || (b || !g ? [Vi(a)] : op(a));
      !h && w !== "none" && _.push(...lp(a, g, w, C));
      const E = [a, ..._], F = await Gr(e, p), T = [];
      let x = ((r = s.flip) == null ? void 0 : r.overflows) || [];
      if (u && T.push(F[v]), f) {
        const O = sp(i, o, C);
        T.push(F[O[0]], F[O[1]]);
      }
      if (x = [...x, {
        placement: i,
        overflows: T
      }], !T.every((O) => O <= 0)) {
        var y, z;
        const O = (((y = s.flip) == null ? void 0 : y.index) || 0) + 1, Q = E[O];
        if (Q)
          return {
            data: {
              index: O,
              overflows: x
            },
            reset: {
              placement: Q
            }
          };
        let H = (z = x.filter((S) => S.overflows[0] <= 0).sort((S, M) => S.overflows[1] - M.overflows[1])[0]) == null ? void 0 : z.placement;
        if (!H)
          switch (m) {
            case "bestFit": {
              var I;
              const S = (I = x.map((M) => [M.placement, M.overflows.filter((P) => P > 0).reduce((P, B) => P + B, 0)]).sort((M, P) => M[1] - P[1])[0]) == null ? void 0 : I[0];
              S && (H = S);
              break;
            }
            case "initialPlacement":
              H = a;
              break;
          }
        if (i !== H)
          return {
            reset: {
              placement: H
            }
          };
      }
      return {};
    }
  };
};
function gl(t, e) {
  return {
    top: t.top - e.height,
    right: t.right - e.width,
    bottom: t.bottom - e.height,
    left: t.left - e.width
  };
}
function ml(t) {
  return np.some((e) => t[e] >= 0);
}
const hp = function(t) {
  return t === void 0 && (t = {}), {
    name: "hide",
    options: t,
    async fn(e) {
      const {
        rects: n
      } = e, {
        strategy: r = "referenceHidden",
        ...i
      } = Ln(t, e);
      switch (r) {
        case "referenceHidden": {
          const s = await Gr(e, {
            ...i,
            elementContext: "reference"
          }), o = gl(s, n.reference);
          return {
            data: {
              referenceHiddenOffsets: o,
              referenceHidden: ml(o)
            }
          };
        }
        case "escaped": {
          const s = await Gr(e, {
            ...i,
            altBoundary: !0
          }), o = gl(s, n.floating);
          return {
            data: {
              escapedOffsets: o,
              escaped: ml(o)
            }
          };
        }
        default:
          return {};
      }
    }
  };
};
async function gp(t, e) {
  const {
    placement: n,
    platform: r,
    elements: i
  } = t, s = await (r.isRTL == null ? void 0 : r.isRTL(i.floating)), o = pn(n), a = fr(n), l = ri(n) === "y", c = ["left", "top"].includes(o) ? -1 : 1, u = s && l ? -1 : 1, f = Ln(e, t);
  let {
    mainAxis: h,
    crossAxis: m,
    alignmentAxis: w
  } = typeof f == "number" ? {
    mainAxis: f,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: 0,
    crossAxis: 0,
    alignmentAxis: null,
    ...f
  };
  return a && typeof w == "number" && (m = a === "end" ? w * -1 : w), l ? {
    x: m * u,
    y: h * c
  } : {
    x: h * c,
    y: m * u
  };
}
const mp = function(t) {
  return t === void 0 && (t = 0), {
    name: "offset",
    options: t,
    async fn(e) {
      var n, r;
      const {
        x: i,
        y: s,
        placement: o,
        middlewareData: a
      } = e, l = await gp(e, t);
      return o === ((n = a.offset) == null ? void 0 : n.placement) && (r = a.arrow) != null && r.alignmentOffset ? {} : {
        x: i + l.x,
        y: s + l.y,
        data: {
          ...l,
          placement: o
        }
      };
    }
  };
}, wp = function(t) {
  return t === void 0 && (t = {}), {
    name: "shift",
    options: t,
    async fn(e) {
      const {
        x: n,
        y: r,
        placement: i
      } = e, {
        mainAxis: s = !0,
        crossAxis: o = !1,
        limiter: a = {
          fn: (p) => {
            let {
              x: v,
              y: b
            } = p;
            return {
              x: v,
              y: b
            };
          }
        },
        ...l
      } = Ln(t, e), c = {
        x: n,
        y: r
      }, u = await Gr(e, l), f = ri(pn(i)), h = Mu(f);
      let m = c[h], w = c[f];
      if (s) {
        const p = h === "y" ? "top" : "left", v = h === "y" ? "bottom" : "right", b = m + u[p], C = m - u[v];
        m = mo(b, m, C);
      }
      if (o) {
        const p = f === "y" ? "top" : "left", v = f === "y" ? "bottom" : "right", b = w + u[p], C = w - u[v];
        w = mo(b, w, C);
      }
      const g = a.fn({
        ...e,
        [h]: m,
        [f]: w
      });
      return {
        ...g,
        data: {
          x: g.x - n,
          y: g.y - r
        }
      };
    }
  };
}, pp = function(t) {
  return t === void 0 && (t = {}), {
    name: "size",
    options: t,
    async fn(e) {
      const {
        placement: n,
        rects: r,
        platform: i,
        elements: s
      } = e, {
        apply: o = () => {
        },
        ...a
      } = Ln(t, e), l = await Gr(e, a), c = pn(n), u = fr(n), f = ri(n) === "y", {
        width: h,
        height: m
      } = r.floating;
      let w, g;
      c === "top" || c === "bottom" ? (w = c, g = u === (await (i.isRTL == null ? void 0 : i.isRTL(s.floating)) ? "start" : "end") ? "left" : "right") : (g = c, w = u === "end" ? "top" : "bottom");
      const p = m - l[w], v = h - l[g], b = !e.middlewareData.shift;
      let C = p, _ = v;
      if (f) {
        const F = h - l.left - l.right;
        _ = u || b ? mn(v, F) : F;
      } else {
        const F = m - l.top - l.bottom;
        C = u || b ? mn(p, F) : F;
      }
      if (b && !u) {
        const F = wt(l.left, 0), T = wt(l.right, 0), x = wt(l.top, 0), y = wt(l.bottom, 0);
        f ? _ = h - 2 * (F !== 0 || T !== 0 ? F + T : wt(l.left, l.right)) : C = m - 2 * (x !== 0 || y !== 0 ? x + y : wt(l.top, l.bottom));
      }
      await o({
        ...e,
        availableWidth: _,
        availableHeight: C
      });
      const E = await i.getDimensions(s.floating);
      return h !== E.width || m !== E.height ? {
        reset: {
          rects: !0
        }
      } : {};
    }
  };
};
function hr(t) {
  return Eu(t) ? (t.nodeName || "").toLowerCase() : "#document";
}
function pt(t) {
  var e;
  return (t == null || (e = t.ownerDocument) == null ? void 0 : e.defaultView) || window;
}
function nn(t) {
  var e;
  return (e = (Eu(t) ? t.ownerDocument : t.document) || window.document) == null ? void 0 : e.documentElement;
}
function Eu(t) {
  return t instanceof Node || t instanceof pt(t).Node;
}
function Kt(t) {
  return t instanceof Element || t instanceof pt(t).Element;
}
function Bt(t) {
  return t instanceof HTMLElement || t instanceof pt(t).HTMLElement;
}
function wl(t) {
  return typeof ShadowRoot > "u" ? !1 : t instanceof ShadowRoot || t instanceof pt(t).ShadowRoot;
}
function ii(t) {
  const {
    overflow: e,
    overflowX: n,
    overflowY: r,
    display: i
  } = At(t);
  return /auto|scroll|overlay|hidden|clip/.test(e + r + n) && !["inline", "contents"].includes(i);
}
function vp(t) {
  return ["table", "td", "th"].includes(hr(t));
}
function Uo(t) {
  const e = qo(), n = At(t);
  return n.transform !== "none" || n.perspective !== "none" || (n.containerType ? n.containerType !== "normal" : !1) || !e && (n.backdropFilter ? n.backdropFilter !== "none" : !1) || !e && (n.filter ? n.filter !== "none" : !1) || ["transform", "perspective", "filter"].some((r) => (n.willChange || "").includes(r)) || ["paint", "layout", "strict", "content"].some((r) => (n.contain || "").includes(r));
}
function bp(t) {
  let e = vn(t);
  for (; Bt(e) && !nr(e); ) {
    if (Uo(e))
      return e;
    e = vn(e);
  }
  return null;
}
function qo() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
function nr(t) {
  return ["html", "body", "#document"].includes(hr(t));
}
function At(t) {
  return pt(t).getComputedStyle(t);
}
function us(t) {
  return Kt(t) ? {
    scrollLeft: t.scrollLeft,
    scrollTop: t.scrollTop
  } : {
    scrollLeft: t.pageXOffset,
    scrollTop: t.pageYOffset
  };
}
function vn(t) {
  if (hr(t) === "html")
    return t;
  const e = (
    // Step into the shadow DOM of the parent of a slotted node.
    t.assignedSlot || // DOM Element detected.
    t.parentNode || // ShadowRoot detected.
    wl(t) && t.host || // Fallback.
    nn(t)
  );
  return wl(e) ? e.host : e;
}
function Iu(t) {
  const e = vn(t);
  return nr(e) ? t.ownerDocument ? t.ownerDocument.body : t.body : Bt(e) && ii(e) ? e : Iu(e);
}
function Yr(t, e, n) {
  var r;
  e === void 0 && (e = []), n === void 0 && (n = !0);
  const i = Iu(t), s = i === ((r = t.ownerDocument) == null ? void 0 : r.body), o = pt(i);
  return s ? e.concat(o, o.visualViewport || [], ii(i) ? i : [], o.frameElement && n ? Yr(o.frameElement) : []) : e.concat(i, Yr(i, [], n));
}
function Pu(t) {
  const e = At(t);
  let n = parseFloat(e.width) || 0, r = parseFloat(e.height) || 0;
  const i = Bt(t), s = i ? t.offsetWidth : n, o = i ? t.offsetHeight : r, a = Ri(n) !== s || Ri(r) !== o;
  return a && (n = s, r = o), {
    width: n,
    height: r,
    $: a
  };
}
function Go(t) {
  return Kt(t) ? t : t.contextElement;
}
function Gn(t) {
  const e = Go(t);
  if (!Bt(e))
    return wn(1);
  const n = e.getBoundingClientRect(), {
    width: r,
    height: i,
    $: s
  } = Pu(e);
  let o = (s ? Ri(n.width) : n.width) / r, a = (s ? Ri(n.height) : n.height) / i;
  return (!o || !Number.isFinite(o)) && (o = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: o,
    y: a
  };
}
const yp = /* @__PURE__ */ wn(0);
function Du(t) {
  const e = pt(t);
  return !qo() || !e.visualViewport ? yp : {
    x: e.visualViewport.offsetLeft,
    y: e.visualViewport.offsetTop
  };
}
function xp(t, e, n) {
  return e === void 0 && (e = !1), !n || e && n !== pt(t) ? !1 : e;
}
function Pn(t, e, n, r) {
  e === void 0 && (e = !1), n === void 0 && (n = !1);
  const i = t.getBoundingClientRect(), s = Go(t);
  let o = wn(1);
  e && (r ? Kt(r) && (o = Gn(r)) : o = Gn(t));
  const a = xp(s, n, r) ? Du(s) : wn(0);
  let l = (i.left + a.x) / o.x, c = (i.top + a.y) / o.y, u = i.width / o.x, f = i.height / o.y;
  if (s) {
    const h = pt(s), m = r && Kt(r) ? pt(r) : r;
    let w = h, g = w.frameElement;
    for (; g && r && m !== w; ) {
      const p = Gn(g), v = g.getBoundingClientRect(), b = At(g), C = v.left + (g.clientLeft + parseFloat(b.paddingLeft)) * p.x, _ = v.top + (g.clientTop + parseFloat(b.paddingTop)) * p.y;
      l *= p.x, c *= p.y, u *= p.x, f *= p.y, l += C, c += _, w = pt(g), g = w.frameElement;
    }
  }
  return Ni({
    width: u,
    height: f,
    x: l,
    y: c
  });
}
const kp = [":popover-open", ":modal"];
function Yo(t) {
  return kp.some((e) => {
    try {
      return t.matches(e);
    } catch {
      return !1;
    }
  });
}
function Cp(t) {
  let {
    elements: e,
    rect: n,
    offsetParent: r,
    strategy: i
  } = t;
  const s = i === "fixed", o = nn(r), a = e ? Yo(e.floating) : !1;
  if (r === o || a && s)
    return n;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = wn(1);
  const u = wn(0), f = Bt(r);
  if ((f || !f && !s) && ((hr(r) !== "body" || ii(o)) && (l = us(r)), Bt(r))) {
    const h = Pn(r);
    c = Gn(r), u.x = h.x + r.clientLeft, u.y = h.y + r.clientTop;
  }
  return {
    width: n.width * c.x,
    height: n.height * c.y,
    x: n.x * c.x - l.scrollLeft * c.x + u.x,
    y: n.y * c.y - l.scrollTop * c.y + u.y
  };
}
function _p(t) {
  return Array.from(t.getClientRects());
}
function $u(t) {
  return Pn(nn(t)).left + us(t).scrollLeft;
}
function Sp(t) {
  const e = nn(t), n = us(t), r = t.ownerDocument.body, i = wt(e.scrollWidth, e.clientWidth, r.scrollWidth, r.clientWidth), s = wt(e.scrollHeight, e.clientHeight, r.scrollHeight, r.clientHeight);
  let o = -n.scrollLeft + $u(t);
  const a = -n.scrollTop;
  return At(r).direction === "rtl" && (o += wt(e.clientWidth, r.clientWidth) - i), {
    width: i,
    height: s,
    x: o,
    y: a
  };
}
function Mp(t, e) {
  const n = pt(t), r = nn(t), i = n.visualViewport;
  let s = r.clientWidth, o = r.clientHeight, a = 0, l = 0;
  if (i) {
    s = i.width, o = i.height;
    const c = qo();
    (!c || c && e === "fixed") && (a = i.offsetLeft, l = i.offsetTop);
  }
  return {
    width: s,
    height: o,
    x: a,
    y: l
  };
}
function Op(t, e) {
  const n = Pn(t, !0, e === "fixed"), r = n.top + t.clientTop, i = n.left + t.clientLeft, s = Bt(t) ? Gn(t) : wn(1), o = t.clientWidth * s.x, a = t.clientHeight * s.y, l = i * s.x, c = r * s.y;
  return {
    width: o,
    height: a,
    x: l,
    y: c
  };
}
function pl(t, e, n) {
  let r;
  if (e === "viewport")
    r = Mp(t, n);
  else if (e === "document")
    r = Sp(nn(t));
  else if (Kt(e))
    r = Op(e, n);
  else {
    const i = Du(t);
    r = {
      ...e,
      x: e.x - i.x,
      y: e.y - i.y
    };
  }
  return Ni(r);
}
function Tu(t, e) {
  const n = vn(t);
  return n === e || !Kt(n) || nr(n) ? !1 : At(n).position === "fixed" || Tu(n, e);
}
function Ep(t, e) {
  const n = e.get(t);
  if (n)
    return n;
  let r = Yr(t, [], !1).filter((a) => Kt(a) && hr(a) !== "body"), i = null;
  const s = At(t).position === "fixed";
  let o = s ? vn(t) : t;
  for (; Kt(o) && !nr(o); ) {
    const a = At(o), l = Uo(o);
    !l && a.position === "fixed" && (i = null), (s ? !l && !i : !l && a.position === "static" && !!i && ["absolute", "fixed"].includes(i.position) || ii(o) && !l && Tu(t, o)) ? r = r.filter((u) => u !== o) : i = a, o = vn(o);
  }
  return e.set(t, r), r;
}
function Ip(t) {
  let {
    element: e,
    boundary: n,
    rootBoundary: r,
    strategy: i
  } = t;
  const o = [...n === "clippingAncestors" ? Yo(e) ? [] : Ep(e, this._c) : [].concat(n), r], a = o[0], l = o.reduce((c, u) => {
    const f = pl(e, u, i);
    return c.top = wt(f.top, c.top), c.right = mn(f.right, c.right), c.bottom = mn(f.bottom, c.bottom), c.left = wt(f.left, c.left), c;
  }, pl(e, a, i));
  return {
    width: l.right - l.left,
    height: l.bottom - l.top,
    x: l.left,
    y: l.top
  };
}
function Pp(t) {
  const {
    width: e,
    height: n
  } = Pu(t);
  return {
    width: e,
    height: n
  };
}
function Dp(t, e, n) {
  const r = Bt(e), i = nn(e), s = n === "fixed", o = Pn(t, !0, s, e);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = wn(0);
  if (r || !r && !s)
    if ((hr(e) !== "body" || ii(i)) && (a = us(e)), r) {
      const f = Pn(e, !0, s, e);
      l.x = f.x + e.clientLeft, l.y = f.y + e.clientTop;
    } else
      i && (l.x = $u(i));
  const c = o.left + a.scrollLeft - l.x, u = o.top + a.scrollTop - l.y;
  return {
    x: c,
    y: u,
    width: o.width,
    height: o.height
  };
}
function Vs(t) {
  return At(t).position === "static";
}
function vl(t, e) {
  return !Bt(t) || At(t).position === "fixed" ? null : e ? e(t) : t.offsetParent;
}
function Au(t, e) {
  const n = pt(t);
  if (Yo(t))
    return n;
  if (!Bt(t)) {
    let i = vn(t);
    for (; i && !nr(i); ) {
      if (Kt(i) && !Vs(i))
        return i;
      i = vn(i);
    }
    return n;
  }
  let r = vl(t, e);
  for (; r && vp(r) && Vs(r); )
    r = vl(r, e);
  return r && nr(r) && Vs(r) && !Uo(r) ? n : r || bp(t) || n;
}
const $p = async function(t) {
  const e = this.getOffsetParent || Au, n = this.getDimensions, r = await n(t.floating);
  return {
    reference: Dp(t.reference, await e(t.floating), t.strategy),
    floating: {
      x: 0,
      y: 0,
      width: r.width,
      height: r.height
    }
  };
};
function Tp(t) {
  return At(t).direction === "rtl";
}
const Lu = {
  convertOffsetParentRelativeRectToViewportRelativeRect: Cp,
  getDocumentElement: nn,
  getClippingRect: Ip,
  getOffsetParent: Au,
  getElementRects: $p,
  getClientRects: _p,
  getDimensions: Pp,
  getScale: Gn,
  isElement: Kt,
  isRTL: Tp
};
function Ap(t, e) {
  let n = null, r;
  const i = nn(t);
  function s() {
    var a;
    clearTimeout(r), (a = n) == null || a.disconnect(), n = null;
  }
  function o(a, l) {
    a === void 0 && (a = !1), l === void 0 && (l = 1), s();
    const {
      left: c,
      top: u,
      width: f,
      height: h
    } = t.getBoundingClientRect();
    if (a || e(), !f || !h)
      return;
    const m = bi(u), w = bi(i.clientWidth - (c + f)), g = bi(i.clientHeight - (u + h)), p = bi(c), b = {
      rootMargin: -m + "px " + -w + "px " + -g + "px " + -p + "px",
      threshold: wt(0, mn(1, l)) || 1
    };
    let C = !0;
    function _(E) {
      const F = E[0].intersectionRatio;
      if (F !== l) {
        if (!C)
          return o();
        F ? o(!1, F) : r = setTimeout(() => {
          o(!1, 1e-7);
        }, 1e3);
      }
      C = !1;
    }
    try {
      n = new IntersectionObserver(_, {
        ...b,
        // Handle <iframe>s
        root: i.ownerDocument
      });
    } catch {
      n = new IntersectionObserver(_, b);
    }
    n.observe(t);
  }
  return o(!0), s;
}
function Lp(t, e, n, r) {
  r === void 0 && (r = {});
  const {
    ancestorScroll: i = !0,
    ancestorResize: s = !0,
    elementResize: o = typeof ResizeObserver == "function",
    layoutShift: a = typeof IntersectionObserver == "function",
    animationFrame: l = !1
  } = r, c = Go(t), u = i || s ? [...c ? Yr(c) : [], ...Yr(e)] : [];
  u.forEach((v) => {
    i && v.addEventListener("scroll", n, {
      passive: !0
    }), s && v.addEventListener("resize", n);
  });
  const f = c && a ? Ap(c, n) : null;
  let h = -1, m = null;
  o && (m = new ResizeObserver((v) => {
    let [b] = v;
    b && b.target === c && m && (m.unobserve(e), cancelAnimationFrame(h), h = requestAnimationFrame(() => {
      var C;
      (C = m) == null || C.observe(e);
    })), n();
  }), c && !l && m.observe(c), m.observe(e));
  let w, g = l ? Pn(t) : null;
  l && p();
  function p() {
    const v = Pn(t);
    g && (v.x !== g.x || v.y !== g.y || v.width !== g.width || v.height !== g.height) && n(), g = v, w = requestAnimationFrame(p);
  }
  return n(), () => {
    var v;
    u.forEach((b) => {
      i && b.removeEventListener("scroll", n), s && b.removeEventListener("resize", n);
    }), f == null || f(), (v = m) == null || v.disconnect(), m = null, l && cancelAnimationFrame(w);
  };
}
const Fp = mp, zp = wp, Rp = fp, Vp = pp, Np = hp, Kp = dp, Bp = (t, e, n) => {
  const r = /* @__PURE__ */ new Map(), i = {
    platform: Lu,
    ...n
  }, s = {
    ...i.platform,
    _c: r
  };
  return up(t, e, {
    ...i,
    platform: s
  });
};
function bl(t) {
  const { x: e = 0, y: n = 0, width: r = 0, height: i = 0 } = t ?? {};
  if (typeof DOMRect == "function")
    return new DOMRect(e, n, r, i);
  const s = {
    x: e,
    y: n,
    width: r,
    height: i,
    top: n,
    right: e + r,
    bottom: n + i,
    left: e
  };
  return { ...s, toJSON: () => s };
}
function jp(t, e) {
  return {
    contextElement: t,
    getBoundingClientRect: () => {
      const r = e(t);
      return r ? bl(r) : t ? t.getBoundingClientRect() : bl();
    }
  };
}
function Wp(t) {
  return /^(?:top|bottom|left|right)(?:-(?:start|end))?$/.test(t);
}
const Hp = {
  top: "bottom",
  right: "left",
  bottom: "top",
  left: "right"
};
function Up(t, e) {
  const [n, r] = t.split("-"), i = Hp[n];
  return r ? n === "left" || n === "right" ? `${i} ${r === "start" ? "top" : "bottom"}` : r === "start" ? `${i} ${e === "rtl" ? "right" : "left"}` : `${i} ${e === "rtl" ? "left" : "right"}` : `${i} center`;
}
function Xo(t) {
  const e = fe({
    getAnchorRect: (h) => h == null ? void 0 : h.getBoundingClientRect(),
    placement: "bottom",
    gutter: 0,
    shift: 0,
    flip: !0,
    slide: !0,
    overlap: !1,
    sameWidth: !1,
    fitViewport: !1,
    hideWhenDetached: !1,
    detachedPadding: 0,
    arrowPadding: 4,
    overflowPadding: 8
  }, t), [n, r] = N(), [i, s] = N(), [o, a] = N(e.placement), l = () => jp(e.anchorRef(), e.getAnchorRect), {
    direction: c
  } = ni();
  async function u() {
    var F, T;
    const h = l(), m = n(), w = i();
    if (!h || !m)
      return;
    const g = ((w == null ? void 0 : w.clientHeight) || 0) / 2, p = typeof e.gutter == "number" ? e.gutter + g : e.gutter ?? g;
    m.style.setProperty("--kb-popper-content-overflow-padding", `${e.overflowPadding}px`), h.getBoundingClientRect();
    const v = [
      // https://floating-ui.com/docs/offset
      Fp(({
        placement: x
      }) => {
        const y = !!x.split("-")[1];
        return {
          mainAxis: p,
          crossAxis: y ? void 0 : e.shift,
          alignmentAxis: e.shift
        };
      })
    ];
    if (e.flip !== !1) {
      const x = typeof e.flip == "string" ? e.flip.split(" ") : void 0;
      if (x !== void 0 && !x.every(Wp))
        throw new Error("`flip` expects a spaced-delimited list of placements");
      v.push(Rp({
        padding: e.overflowPadding,
        fallbackPlacements: x
      }));
    }
    (e.slide || e.overlap) && v.push(zp({
      mainAxis: e.slide,
      crossAxis: e.overlap,
      padding: e.overflowPadding
    })), v.push(Vp({
      padding: e.overflowPadding,
      apply({
        availableWidth: x,
        availableHeight: y,
        rects: z
      }) {
        const I = Math.round(z.reference.width);
        x = Math.floor(x), y = Math.floor(y), m.style.setProperty("--kb-popper-anchor-width", `${I}px`), m.style.setProperty("--kb-popper-content-available-width", `${x}px`), m.style.setProperty("--kb-popper-content-available-height", `${y}px`), e.sameWidth && (m.style.width = `${I}px`), e.fitViewport && (m.style.maxWidth = `${x}px`, m.style.maxHeight = `${y}px`);
      }
    })), e.hideWhenDetached && v.push(Np({
      padding: e.detachedPadding
    })), w && v.push(Kp({
      element: w,
      padding: e.arrowPadding
    }));
    const b = await Bp(h, m, {
      placement: e.placement,
      strategy: "absolute",
      middleware: v,
      platform: {
        ...Lu,
        isRTL: () => c() === "rtl"
      }
    });
    if (a(b.placement), (F = e.onCurrentPlacementChange) == null || F.call(e, b.placement), !m)
      return;
    m.style.setProperty("--kb-popper-content-transform-origin", Up(b.placement, c()));
    const C = Math.round(b.x), _ = Math.round(b.y);
    let E;
    if (e.hideWhenDetached && (E = (T = b.middlewareData.hide) != null && T.referenceHidden ? "hidden" : "visible"), Object.assign(m.style, {
      top: "0",
      left: "0",
      transform: `translate3d(${C}px, ${_}px, 0)`,
      visibility: E
    }), w && b.middlewareData.arrow) {
      const {
        x,
        y
      } = b.middlewareData.arrow, z = b.placement.split("-")[0];
      Object.assign(w.style, {
        left: x != null ? `${x}px` : "",
        top: y != null ? `${y}px` : "",
        [z]: "100%"
      });
    }
  }
  Z(() => {
    const h = l(), m = n();
    if (!h || !m)
      return;
    const w = Lp(h, m, u, {
      // JSDOM doesn't support ResizeObserver
      elementResize: typeof ResizeObserver == "function"
    });
    me(w);
  }), Z(() => {
    const h = n(), m = e.contentRef();
    !h || !m || queueMicrotask(() => {
      h.style.zIndex = getComputedStyle(m).zIndex;
    });
  });
  const f = {
    currentPlacement: o,
    contentRef: () => e.contentRef(),
    setPositionerRef: r,
    setArrowRef: s
  };
  return d(Su.Provider, {
    value: f,
    get children() {
      return e.children;
    }
  });
}
const Fu = Fe();
function gr() {
  const t = Ne(Fu);
  if (t === void 0)
    throw new Error("[kobalte]: `useComboboxContext` must be used within a `Combobox` component");
  return t;
}
function qp(t) {
  let e;
  const n = gr(), [r, i] = K(t, ["ref", "id", "style", "onCloseAutoFocus", "onFocusOutside"]), s = () => {
    n.resetInputValue(n.listState().selectionManager().selectedKeys()), n.close();
  }, o = (a) => {
    var l;
    (l = r.onFocusOutside) == null || l.call(r, a), n.isOpen() && n.isModal() && a.preventDefault();
  };
  return os({
    isDisabled: () => !(n.isOpen() && n.isModal()),
    targets: () => {
      const a = [];
      e && a.push(e);
      const l = n.controlRef();
      return l && a.push(l), a;
    }
  }), as({
    element: () => e ?? null,
    enabled: () => n.isOpen() && n.preventScroll()
  }), ss({
    trapFocus: () => n.isOpen() && n.isModal(),
    onMountAutoFocus: (a) => {
      a.preventDefault();
    },
    onUnmountAutoFocus: (a) => {
      var l;
      (l = r.onCloseAutoFocus) == null || l.call(r, a), a.defaultPrevented || (Ue(n.inputRef()), a.preventDefault());
    }
  }, () => e), d(te, {
    get when() {
      return n.contentPresence.isPresent();
    },
    get children() {
      return d(jo, {
        get children() {
          return d(ls, D({
            ref(a) {
              var l = _e((c) => {
                n.setContentRef(c), n.contentPresence.setRef(c), e = c;
              }, r.ref);
              typeof l == "function" && l(a);
            },
            get disableOutsidePointerEvents() {
              return J(() => !!n.isModal())() && n.isOpen();
            },
            get excludedElements() {
              return [n.controlRef];
            },
            get style() {
              return {
                "--kb-combobox-content-transform-origin": "var(--kb-popper-content-transform-origin)",
                position: "relative",
                ...r.style
              };
            },
            onFocusOutside: o,
            onDismiss: s
          }, () => n.dataset(), i));
        }
      });
    }
  });
}
function Gp(t) {
  let e;
  const n = ft(), r = gr(), i = fe({
    id: r.generateId("input")
  }, t), [s, o, a] = K(i, ["ref", "disabled", "onInput", "onPointerDown", "onClick", "onKeyDown", "onFocus", "onBlur"], ei), l = () => r.listState().collection(), c = () => r.listState().selectionManager(), u = () => s.disabled || r.isDisabled() || n.isDisabled(), {
    fieldProps: f
  } = ti(o), h = (b) => {
    if (ce(b, s.onInput), n.isReadOnly() || u())
      return;
    const C = b.target;
    r.setInputValue(C.value), C.value = r.inputValue() ?? "", r.isOpen() ? l().getSize() <= 0 && !r.allowsEmptyCollection() && r.close() : l().getSize() > 0 && r.open(!1, "input");
  }, m = (b) => {
    if (ce(b, s.onKeyDown), !(n.isReadOnly() || u()))
      switch (r.isOpen() && ce(b, r.onInputKeyDown), b.key) {
        case "Enter":
          if (r.isOpen()) {
            b.preventDefault();
            const C = c().focusedKey();
            C != null && c().select(C);
          }
          break;
        case "Tab":
          r.isOpen() && (r.close(), r.resetInputValue(r.listState().selectionManager().selectedKeys()));
          break;
        case "Escape":
          r.isOpen() ? (r.close(), r.resetInputValue(r.listState().selectionManager().selectedKeys())) : r.setInputValue("");
          break;
        case "ArrowDown":
          r.isOpen() || r.open(b.altKey ? !1 : "first", "manual");
          break;
        case "ArrowUp":
          r.isOpen() ? b.altKey && (r.close(), r.resetInputValue(r.listState().selectionManager().selectedKeys())) : r.open("last", "manual");
          break;
        case "ArrowLeft":
        case "ArrowRight":
          c().setFocusedKey(void 0);
          break;
        case "Backspace":
          if (r.removeOnBackspace() && c().selectionMode() === "multiple" && r.inputValue() === "") {
            const C = [...c().selectedKeys()].pop() ?? "";
            c().toggleSelection(C);
          }
          break;
      }
  }, w = (b) => {
    ce(b, s.onFocus), !r.isInputFocused() && r.setIsInputFocused(!0);
  }, g = (b) => {
    ce(b, s.onBlur), !(dt(r.controlRef(), b.relatedTarget) || dt(r.contentRef(), b.relatedTarget)) && r.setIsInputFocused(!1);
  };
  let p = 0;
  return d(Se, D({
    as: "input",
    ref(b) {
      var C = _e((_) => {
        r.setInputRef(_), e = _;
      }, s.ref);
      typeof C == "function" && C(b);
    },
    get id() {
      return f.id();
    },
    get value() {
      return r.inputValue();
    },
    get required() {
      return n.isRequired();
    },
    get disabled() {
      return n.isDisabled();
    },
    get readonly() {
      return n.isReadOnly();
    },
    get placeholder() {
      return r.placeholder();
    },
    type: "text",
    role: "combobox",
    autoComplete: "off",
    autoCorrect: "off",
    spellCheck: "false",
    "aria-haspopup": "listbox",
    "aria-autocomplete": "list",
    get "aria-expanded"() {
      return r.isOpen();
    },
    get "aria-controls"() {
      return J(() => !!r.isOpen())() ? r.listboxId() : void 0;
    },
    get "aria-activedescendant"() {
      return r.activeDescendant();
    },
    get "aria-label"() {
      return f.ariaLabel();
    },
    get "aria-labelledby"() {
      return f.ariaLabelledBy();
    },
    get "aria-describedby"() {
      return f.ariaDescribedBy();
    },
    get "aria-invalid"() {
      return n.validationState() === "invalid" || void 0;
    },
    get "aria-required"() {
      return n.isRequired() || void 0;
    },
    get "aria-disabled"() {
      return n.isDisabled() || void 0;
    },
    get "aria-readonly"() {
      return n.isReadOnly() || void 0;
    },
    onInput: h,
    onKeyDown: m,
    onFocus: w,
    onBlur: g,
    onTouchEnd: (b) => {
      if (!e || n.isReadOnly() || u())
        return;
      if (b.timeStamp - p < 500) {
        b.preventDefault(), e.focus();
        return;
      }
      const C = b.target.getBoundingClientRect(), _ = b.changedTouches[0], E = Math.ceil(C.left + 0.5 * C.width), F = Math.ceil(C.top + 0.5 * C.height);
      _.clientX === E && _.clientY === F && (b.preventDefault(), e.focus(), r.toggle(!1, "manual"), p = b.timeStamp);
    }
  }, () => r.dataset(), () => n.dataset(), a));
}
function Yp(t) {
  const e = gr();
  return d(te, {
    get when() {
      return e.contentPresence.isPresent();
    },
    get children() {
      return d(Gi, t);
    }
  });
}
function Xp(t) {
  const e = ft(), n = gr(), [r, i] = K(t, ["ref", "children"]), s = () => n.listState().selectionManager();
  return d(Se, D({
    as: "div",
    ref(o) {
      var a = _e(n.setControlRef, r.ref);
      typeof a == "function" && a(o);
    }
  }, () => n.dataset(), () => e.dataset(), i, {
    get children() {
      return d(Qp, {
        state: {
          selectedOptions: () => n.selectedOptions(),
          remove: (o) => n.removeOptionFromSelection(o),
          clear: () => s().clearSelection()
        },
        get children() {
          return r.children;
        }
      });
    }
  }));
}
function Qp(t) {
  const e = Dn(() => {
    const n = t.children;
    return fn(n) ? n(t.state) : n;
  });
  return J(e);
}
function Jp(t) {
  const e = gr(), n = fe({
    children: "▼"
  }, t);
  return d(Se, D({
    as: "span",
    "aria-hidden": "true"
  }, () => e.dataset(), n));
}
const Zp = {
  // Annouce option to screen readers on focus.
  focusAnnouncement: (t, e) => `${t}${e ? ", selected" : ""}`,
  // Annouce the number of options available to screen readers on open.
  countAnnouncement: (t) => {
    switch (t) {
      case 1:
        return "one option available";
    }
  },
  // Annouce the selection of an option to screen readers.
  selectedAnnouncement: (t) => `${t}, selected`,
  // `aria-label` of Combobox.Trigger.
  triggerLabel: "Show suggestions",
  // `aria-label` of Combobox.Listbox.
  listboxLabel: "Suggestions"
};
function ev(t) {
  const e = `combobox-${tt()}`, n = aw({
    sensitivity: "base"
  }), r = fe({
    id: e,
    selectionMode: "single",
    allowsEmptyCollection: !1,
    disallowEmptySelection: !1,
    allowDuplicateSelectionEvents: !0,
    closeOnSelection: t.selectionMode === "single",
    removeOnBackspace: !0,
    gutter: 8,
    sameWidth: !0,
    modal: !1,
    defaultFilter: "contains",
    triggerMode: "input",
    translations: Zp
  }, t), [i, s, o, a] = K(r, ["translations", "itemComponent", "sectionComponent", "open", "defaultOpen", "onOpenChange", "onInputChange", "value", "defaultValue", "onChange", "triggerMode", "placeholder", "options", "optionValue", "optionTextValue", "optionLabel", "optionDisabled", "optionGroupChildren", "keyboardDelegate", "allowDuplicateSelectionEvents", "disallowEmptySelection", "defaultFilter", "shouldFocusWrap", "allowsEmptyCollection", "closeOnSelection", "removeOnBackspace", "selectionBehavior", "selectionMode", "virtualized", "modal", "preventScroll", "forceMount"], ["getAnchorRect", "placement", "gutter", "shift", "flip", "slide", "overlap", "sameWidth", "fitViewport", "hideWhenDetached", "detachedPadding", "arrowPadding", "overflowPadding"], lr), [l, c] = N(), [u, f] = N(), [h, m] = N(), [w, g] = N(), [p, v] = N(), [b, C] = N(), [_, E] = N(!1), [F, T] = N(!1), [x, y] = N(!1), [z, I] = N(i.options), O = or({
    open: () => i.open,
    defaultOpen: () => i.defaultOpen,
    onOpenChange: (Y) => {
      var j;
      return (j = i.onOpenChange) == null ? void 0 : j.call(i, Y, q);
    }
  }), [Q, H] = sr({
    defaultValue: () => "",
    onChange: (Y) => {
      var j;
      (j = i.onInputChange) == null || j.call(i, Y), Y === "" && i.selectionMode === "single" && !W.selectionManager().isEmpty() && i.value === void 0 && W.selectionManager().setSelectedKeys([]), W.selectionManager().setFocusedKey(void 0);
    }
  }), S = (Y) => {
    const j = i.optionValue;
    return j == null ? String(Y) : String(fn(j) ? j(Y) : Y[j]);
  }, M = (Y) => {
    const j = i.optionLabel;
    return j == null ? String(Y) : String(fn(j) ? j(Y) : Y[j]);
  }, P = J(() => {
    const Y = i.optionGroupChildren;
    return Y == null ? i.options : i.options.flatMap((j) => j[Y] ?? j);
  }), B = (Y) => {
    var Ee;
    const j = Q() ?? "";
    if (fn(i.defaultFilter))
      return (Ee = i.defaultFilter) == null ? void 0 : Ee.call(i, Y, j);
    const be = M(Y);
    switch (i.defaultFilter) {
      case "startsWith":
        return n.startsWith(be, j);
      case "endsWith":
        return n.endsWith(be, j);
      case "contains":
        return n.contains(be, j);
    }
  }, V = J(() => {
    const Y = i.optionGroupChildren;
    if (Y == null)
      return i.options.filter(B);
    const j = [];
    for (const be of i.options) {
      const Ee = be[Y].filter(B);
      Ee.length !== 0 && j.push({
        ...be,
        [Y]: Ee
      });
    }
    return j;
  }), X = J(() => O.isOpen() ? x() ? i.options : V() : z());
  let q = "focus";
  const $ = (Y) => [...Y].map((j) => P().find((be) => S(be) === j)).filter((j) => j != null), W = hu({
    selectedKeys: () => i.value != null ? i.value.map(S) : i.value,
    defaultSelectedKeys: () => i.defaultValue != null ? i.defaultValue.map(S) : i.defaultValue,
    onSelectionChange: (Y) => {
      var be;
      (be = i.onChange) == null || be.call(i, $(Y)), i.closeOnSelection && O.isOpen() && Y.size > 0 && le();
      const j = h();
      j && (j.setSelectionRange(j.value.length, j.value.length), Ue(j));
    },
    allowDuplicateSelectionEvents: () => R(i.allowDuplicateSelectionEvents),
    disallowEmptySelection: () => i.disallowEmptySelection,
    selectionBehavior: () => R(i.selectionBehavior),
    selectionMode: () => i.selectionMode,
    dataSource: X,
    getKey: () => i.optionValue,
    getTextValue: () => i.optionTextValue,
    getDisabled: () => i.optionDisabled,
    getSectionChildren: () => i.optionGroupChildren
  }), ee = J(() => $(W.selectionManager().selectedKeys())), U = (Y) => {
    W.selectionManager().toggleSelection(S(Y));
  }, se = gn(() => i.forceMount || O.isOpen()), de = (Y, j) => {
    if (!(y(j === "manual") ? i.options.length > 0 : V().length > 0) && !i.allowsEmptyCollection)
      return;
    q = j, E(Y), O.open();
    let rt = W.selectionManager().firstSelectedKey();
    rt == null && (Y === "first" ? rt = W.collection().getFirstKey() : Y === "last" && (rt = W.collection().getLastKey())), W.selectionManager().setFocused(!0), W.selectionManager().setFocusedKey(rt);
  }, le = () => {
    O.close(), W.selectionManager().setFocused(!1), W.selectionManager().setFocusedKey(void 0);
  }, ne = (Y, j) => {
    O.isOpen() ? le() : de(Y, j);
  }, {
    formControlContext: he
  } = cr(o);
  ar(h, () => {
    const Y = i.defaultValue ? [...i.defaultValue].map(S) : new _t();
    W.selectionManager().setSelectedKeys(Y);
  });
  const ke = J(() => {
    const Y = R(i.keyboardDelegate);
    return Y || new gu(W.collection, b, void 0);
  }), Le = fu({
    selectionManager: () => W.selectionManager(),
    keyboardDelegate: ke,
    disallowTypeAhead: !0,
    disallowEmptySelection: !0,
    shouldFocusWrap: () => i.shouldFocusWrap,
    // Prevent item scroll behavior from being applied here, handled in the Listbox component.
    isVirtualized: !0
  }, h), ge = (Y) => {
    Y && i.triggerMode === "focus" && de(!1, "focus"), T(Y), W.selectionManager().setFocused(Y);
  }, Oe = J(() => {
    var j, be;
    const Y = W.selectionManager().focusedKey();
    if (Y)
      return (be = (j = b()) == null ? void 0 : j.querySelector(`[data-key="${Y}"]`)) == null ? void 0 : be.id;
  }), ue = (Y) => {
    if (i.selectionMode === "single") {
      const j = [...Y][0], be = P().find((Ee) => S(Ee) === j);
      H(be ? M(be) : "");
    } else
      H("");
  }, ye = (Y) => {
    var j;
    return (j = i.itemComponent) == null ? void 0 : j.call(i, {
      item: Y
    });
  }, Re = (Y) => {
    var j;
    return (j = i.sectionComponent) == null ? void 0 : j.call(i, {
      section: Y
    });
  };
  Z(He([V, x], (Y, j) => {
    if (O.isOpen() && j != null) {
      const be = j[0], Ee = j[1];
      I(Ee ? i.options : be);
    } else {
      const be = Y[0], Ee = Y[1];
      I(Ee ? i.options : be);
    }
  })), Z(He(Q, () => {
    x() && y(!1);
  })), Z(He(() => W.selectionManager().selectedKeys(), ue));
  let qe = "";
  Z(() => {
    var be;
    const Y = W.selectionManager().focusedKey() ?? "", j = W.collection().getItem(Y);
    if (_i() && j != null && Y !== qe) {
      const Ee = W.selectionManager().isSelected(Y), rt = ((be = i.translations) == null ? void 0 : be.focusAnnouncement((j == null ? void 0 : j.textValue) || "", Ee)) ?? "";
      Fs(rt);
    }
    Y && (qe = Y);
  });
  let Ke = Xa(W.collection()), ot = O.isOpen();
  Z(() => {
    var Ee;
    const Y = Xa(W.collection()), j = O.isOpen(), be = j !== ot && (W.selectionManager().focusedKey() == null || _i());
    if (j && (be || Y !== Ke)) {
      const rt = ((Ee = i.translations) == null ? void 0 : Ee.countAnnouncement(Y)) ?? "";
      Fs(rt);
    }
    Ke = Y, ot = j;
  });
  let Ze = "";
  Z(() => {
    var be;
    const Y = [...W.selectionManager().selectedKeys()].pop() ?? "", j = W.collection().getItem(Y);
    if (_i() && F() && j && Y !== Ze) {
      const Ee = ((be = i.translations) == null ? void 0 : be.selectedAnnouncement((j == null ? void 0 : j.textValue) || "")) ?? "";
      Fs(Ee);
    }
    Y && (Ze = Y);
  });
  const Ce = J(() => ({
    "data-expanded": O.isOpen() ? "" : void 0,
    "data-closed": O.isOpen() ? void 0 : ""
  })), Be = {
    dataset: Ce,
    isOpen: O.isOpen,
    isDisabled: () => he.isDisabled() ?? !1,
    isMultiple: () => R(i.selectionMode) === "multiple",
    isVirtualized: () => i.virtualized ?? !1,
    isModal: () => i.modal ?? !1,
    preventScroll: () => i.preventScroll ?? Be.isModal(),
    allowsEmptyCollection: () => i.allowsEmptyCollection ?? !1,
    shouldFocusWrap: () => i.shouldFocusWrap ?? !1,
    removeOnBackspace: () => i.removeOnBackspace ?? !0,
    selectedOptions: ee,
    isInputFocused: F,
    contentPresence: se,
    autoFocus: _,
    inputValue: Q,
    triggerMode: () => i.triggerMode,
    activeDescendant: Oe,
    controlRef: u,
    inputRef: h,
    triggerRef: w,
    contentRef: p,
    listState: () => W,
    keyboardDelegate: ke,
    listboxId: l,
    triggerAriaLabel: () => {
      var Y;
      return (Y = i.translations) == null ? void 0 : Y.triggerLabel;
    },
    listboxAriaLabel: () => {
      var Y;
      return (Y = i.translations) == null ? void 0 : Y.listboxLabel;
    },
    setIsInputFocused: ge,
    resetInputValue: ue,
    setInputValue: H,
    setControlRef: f,
    setInputRef: m,
    setTriggerRef: g,
    setContentRef: v,
    setListboxRef: C,
    open: de,
    close: le,
    toggle: ne,
    placeholder: () => i.placeholder,
    renderItem: ye,
    renderSection: Re,
    removeOptionFromSelection: U,
    onInputKeyDown: (Y) => Le.onKeyDown(Y),
    generateId: Et(() => R(o.id)),
    registerListboxId: Ge(c)
  };
  return d(An.Provider, {
    value: he,
    get children() {
      return d(Fu.Provider, {
        value: Be,
        get children() {
          return d(Xo, D({
            anchorRef: u,
            contentRef: p
          }, s, {
            get children() {
              return d(Se, D({
                as: "div",
                role: "group",
                get id() {
                  return R(o.id);
                }
              }, () => he.dataset(), Ce, a));
            }
          }));
        }
      });
    }
  });
}
function tv(t) {
  const [e, n] = K(t, ["value", "defaultValue", "onChange", "multiple"]), r = J(() => e.value != null ? e.multiple ? e.value : [e.value] : e.value), i = J(() => e.defaultValue != null ? e.multiple ? e.defaultValue : [e.defaultValue] : e.defaultValue);
  return d(ev, D({
    get value() {
      return r();
    },
    get defaultValue() {
      return i();
    },
    onChange: (o) => {
      var a, l;
      e.multiple ? (a = e.onChange) == null || a.call(e, o) : (l = e.onChange) == null || l.call(e, o[0] ?? null);
    },
    get selectionMode() {
      return e.multiple ? "multiple" : "single";
    }
  }, n));
}
function yl(t) {
  const e = ft(), n = gr(), r = fe({
    id: n.generateId("trigger")
  }, t), [i, s] = K(r, ["ref", "disabled", "onPointerDown", "onClick", "aria-labelledby"]), o = () => i.disabled || n.isDisabled() || e.isDisabled() || e.isReadOnly(), a = (u) => {
    ce(u, i.onPointerDown), u.currentTarget.dataset.pointerType = u.pointerType, !o() && u.pointerType !== "touch" && u.button === 0 && (u.preventDefault(), n.toggle(!1, "manual"));
  }, l = (u) => {
    var f;
    ce(u, i.onClick), o() || (u.currentTarget.dataset.pointerType === "touch" && n.toggle(!1, "manual"), (f = n.inputRef()) == null || f.focus());
  }, c = () => e.getAriaLabelledBy(s.id, n.triggerAriaLabel(), i["aria-labelledby"]);
  return d(ur, D({
    ref(u) {
      var f = _e(n.setTriggerRef, i.ref);
      typeof f == "function" && f(u);
    },
    get disabled() {
      return o();
    },
    tabIndex: "-1",
    "aria-haspopup": "listbox",
    get "aria-expanded"() {
      return n.isOpen();
    },
    get "aria-controls"() {
      return J(() => !!n.isOpen())() ? n.listboxId() : void 0;
    },
    get "aria-label"() {
      return n.triggerAriaLabel();
    },
    get "aria-labelledby"() {
      return c();
    },
    onPointerDown: a,
    onClick: l
  }, () => n.dataset(), s));
}
const zu = Fe();
function Ru() {
  return Ne(zu);
}
function mr() {
  const t = Ru();
  if (t === void 0)
    throw new Error("[kobalte]: `useMenuContext` must be used within a `Menu` component");
  return t;
}
const Vu = Fe();
function wr() {
  const t = Ne(Vu);
  if (t === void 0)
    throw new Error("[kobalte]: `useMenuRootContext` must be used within a `MenuRoot` component");
  return t;
}
/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/81b25f4b40c54f72aeb106ca0e64e1e09655153e/packages/react/menu/src/Menu.tsx
 */
function nv(t, e) {
  return e ? Am([t.clientX, t.clientY], e) : !1;
}
function rv(t) {
  const e = wr(), n = pu(), r = Ru(), i = fe({
    placement: "bottom-start"
  }, t), [s, o] = K(i, ["open", "defaultOpen", "onOpenChange"]);
  let a = 0, l = null, c = "right";
  const [u, f] = N(), [h, m] = N(), [w, g] = N(), [p, v] = N(), [b, C] = N(!0), [_, E] = N(o.placement), [F, T] = N([]), [x, y] = N([]), {
    DomCollectionProvider: z
  } = yu({
    items: x,
    onItemsChange: y
  }), I = or({
    open: () => s.open,
    defaultOpen: () => s.defaultOpen,
    onOpenChange: (U) => {
      var se;
      return (se = s.onOpenChange) == null ? void 0 : se.call(s, U);
    }
  }), O = gn(() => e.forceMount() || I.isOpen()), Q = hu({
    selectionMode: "none",
    dataSource: x
  }), H = (U) => {
    C(U), I.open();
  }, S = (U = !1) => {
    I.close(), U && r && r.close(!0);
  }, M = (U) => {
    C(U), I.toggle();
  }, P = () => {
    const U = p();
    U && (Ue(U), Q.selectionManager().setFocused(!0), Q.selectionManager().setFocusedKey(void 0));
  }, B = (U) => {
    T((de) => [...de, U]);
    const se = r == null ? void 0 : r.registerNestedMenu(U);
    return () => {
      T((de) => ao(de, U)), se == null || se();
    };
  }, V = (U) => c === (l == null ? void 0 : l.side) && nv(U, l == null ? void 0 : l.area), X = (U) => {
    V(U) && U.preventDefault();
  }, q = (U) => {
    V(U) || P();
  }, $ = (U) => {
    V(U) && U.preventDefault();
  };
  os({
    isDisabled: () => !(r == null && I.isOpen() && e.isModal()),
    targets: () => [p(), ...F()].filter(Boolean)
  }), Z(() => {
    const U = p();
    if (!U || !r)
      return;
    const se = r.registerNestedMenu(U);
    me(() => {
      se();
    });
  });
  const ee = {
    dataset: J(() => ({
      "data-expanded": I.isOpen() ? "" : void 0,
      "data-closed": I.isOpen() ? void 0 : ""
    })),
    isOpen: I.isOpen,
    contentPresence: O,
    nestedMenus: F,
    currentPlacement: _,
    pointerGraceTimeoutId: () => a,
    autoFocus: b,
    listState: () => Q,
    parentMenuContext: () => r,
    triggerRef: w,
    contentRef: p,
    triggerId: u,
    contentId: h,
    setTriggerRef: g,
    setContentRef: v,
    open: H,
    close: S,
    toggle: M,
    focusContent: P,
    onItemEnter: X,
    onItemLeave: q,
    onTriggerLeave: $,
    setPointerDir: (U) => c = U,
    setPointerGraceTimeoutId: (U) => a = U,
    setPointerGraceIntent: (U) => l = U,
    registerNestedMenu: B,
    registerItemToParentDomCollection: n == null ? void 0 : n.registerItem,
    registerTriggerId: Ge(f),
    registerContentId: Ge(m)
  };
  return d(z, {
    get children() {
      return d(zu.Provider, {
        value: ee,
        get children() {
          return d(Xo, D({
            anchorRef: w,
            contentRef: p,
            onCurrentPlacementChange: E
          }, o));
        }
      });
    }
  });
}
const iv = Fe();
function sv(t) {
  let e;
  const n = wr(), r = mr(), i = fe({
    id: n.generateId(`item-${tt()}`)
  }, t), [s, o] = K(i, ["ref", "textValue", "disabled", "closeOnSelect", "checked", "indeterminate", "onSelect", "onPointerMove", "onPointerLeave", "onPointerDown", "onPointerUp", "onClick", "onKeyDown", "onMouseDown", "onFocus"]), [a, l] = N(), [c, u] = N(), [f, h] = N(), m = () => r.listState().selectionManager(), w = () => o.id, g = () => m().focusedKey() === w(), p = () => {
    var y;
    (y = s.onSelect) == null || y.call(s), s.closeOnSelect && r.close(!0);
  };
  xu({
    getItem: () => {
      var y;
      return {
        ref: () => e,
        type: "item",
        key: w(),
        textValue: s.textValue ?? ((y = f()) == null ? void 0 : y.textContent) ?? (e == null ? void 0 : e.textContent) ?? "",
        disabled: s.disabled ?? !1
      };
    }
  });
  const v = vw({
    key: w,
    selectionManager: m,
    shouldSelectOnPressUp: !0,
    allowsDifferentPressOrigin: !0,
    disabled: () => s.disabled
  }, () => e), b = (y) => {
    ce(y, s.onPointerMove), y.pointerType === "mouse" && (s.disabled ? r.onItemLeave(y) : (r.onItemEnter(y), y.defaultPrevented || (Ue(y.currentTarget), r.listState().selectionManager().setFocused(!0), r.listState().selectionManager().setFocusedKey(w()))));
  }, C = (y) => {
    ce(y, s.onPointerLeave), y.pointerType === "mouse" && r.onItemLeave(y);
  }, _ = (y) => {
    ce(y, s.onPointerUp), !s.disabled && y.button === 0 && p();
  }, E = (y) => {
    if (ce(y, s.onKeyDown), !y.repeat && !s.disabled)
      switch (y.key) {
        case "Enter":
        case " ":
          p();
          break;
      }
  }, F = J(() => {
    if (s.indeterminate)
      return "mixed";
    if (s.checked != null)
      return s.checked;
  }), T = J(() => ({
    "data-indeterminate": s.indeterminate ? "" : void 0,
    "data-checked": s.checked && !s.indeterminate ? "" : void 0,
    "data-disabled": s.disabled ? "" : void 0,
    "data-highlighted": g() ? "" : void 0
  })), x = {
    isChecked: () => s.checked,
    dataset: T,
    setLabelRef: h,
    generateId: Et(() => o.id),
    registerLabel: Ge(l),
    registerDescription: Ge(u)
  };
  return d(iv.Provider, {
    value: x,
    get children() {
      return d(Se, D({
        as: "div",
        ref(y) {
          var z = _e((I) => e = I, s.ref);
          typeof z == "function" && z(y);
        },
        get tabIndex() {
          return v.tabIndex();
        },
        get "aria-checked"() {
          return F();
        },
        get "aria-disabled"() {
          return s.disabled;
        },
        get "aria-labelledby"() {
          return a();
        },
        get "aria-describedby"() {
          return c();
        },
        get "data-key"() {
          return v.dataKey();
        },
        get onPointerDown() {
          return ut([s.onPointerDown, v.onPointerDown]);
        },
        get onPointerUp() {
          return ut([_, v.onPointerUp]);
        },
        get onClick() {
          return ut([s.onClick, v.onClick]);
        },
        get onKeyDown() {
          return ut([E, v.onKeyDown]);
        },
        get onMouseDown() {
          return ut([s.onMouseDown, v.onMouseDown]);
        },
        get onFocus() {
          return ut([s.onFocus, v.onFocus]);
        },
        onPointerMove: b,
        onPointerLeave: C
      }, T, o));
    }
  });
}
const ov = Fe();
function Nu() {
  return Ne(ov);
}
function av(t) {
  let e;
  const n = wr(), r = mr(), i = Nu(), s = fe({
    id: n.generateId(`content-${tt()}`)
  }, t), [o, a] = K(s, ["ref", "id", "style", "onOpenAutoFocus", "onCloseAutoFocus", "onEscapeKeyDown", "onFocusOutside", "onPointerEnter", "onPointerMove", "onKeyDown", "onMouseDown", "onFocusIn", "onFocusOut"]);
  let l = 0;
  const c = () => r.parentMenuContext() == null && i === void 0 && n.isModal(), u = yw({
    selectionManager: r.listState().selectionManager,
    collection: r.listState().collection,
    autoFocus: r.autoFocus,
    deferAutoFocus: !0,
    shouldFocusWrap: !0,
    disallowTypeAhead: () => !r.listState().selectionManager().isFocused()
  }, () => e);
  ss({
    trapFocus: () => c() && r.isOpen(),
    onMountAutoFocus: (p) => {
      var v;
      i === void 0 && ((v = o.onOpenAutoFocus) == null || v.call(o, p));
    },
    onUnmountAutoFocus: o.onCloseAutoFocus
  }, () => e);
  const f = (p) => {
    if (dt(p.currentTarget, p.target) && (p.key === "Tab" && r.isOpen() && p.preventDefault(), i !== void 0 && p.currentTarget.getAttribute("aria-haspopup") !== "true"))
      switch (p.key) {
        case "ArrowRight":
          p.stopPropagation(), p.preventDefault(), r.close(!0), i.setAutoFocusMenu(!0), i.nextMenu();
          break;
        case "ArrowLeft":
          if (p.currentTarget.hasAttribute("data-closed"))
            break;
          p.stopPropagation(), p.preventDefault(), r.close(!0), i.setAutoFocusMenu(!0), i.previousMenu();
          break;
      }
  }, h = (p) => {
    var v;
    (v = o.onEscapeKeyDown) == null || v.call(o, p), i == null || i.setAutoFocusMenu(!1), r.close(!0);
  }, m = (p) => {
    var v;
    (v = o.onFocusOutside) == null || v.call(o, p), n.isModal() && p.preventDefault();
  }, w = (p) => {
    var v, b;
    ce(p, o.onPointerEnter), r.isOpen() && ((v = r.parentMenuContext()) == null || v.listState().selectionManager().setFocused(!1), (b = r.parentMenuContext()) == null || b.listState().selectionManager().setFocusedKey(void 0));
  }, g = (p) => {
    if (ce(p, o.onPointerMove), p.pointerType !== "mouse")
      return;
    const v = p.target, b = l !== p.clientX;
    dt(p.currentTarget, v) && b && (r.setPointerDir(p.clientX > l ? "right" : "left"), l = p.clientX);
  };
  return Z(() => me(r.registerContentId(o.id))), d(te, {
    get when() {
      return r.contentPresence.isPresent();
    },
    get children() {
      return d(jo, {
        get children() {
          return d(ls, D({
            ref(p) {
              var v = _e((b) => {
                r.setContentRef(b), r.contentPresence.setRef(b), e = b;
              }, o.ref);
              typeof v == "function" && v(p);
            },
            role: "menu",
            get id() {
              return o.id;
            },
            get tabIndex() {
              return u.tabIndex();
            },
            get disableOutsidePointerEvents() {
              return J(() => !!c())() && r.isOpen();
            },
            get excludedElements() {
              return [r.triggerRef];
            },
            bypassTopMostLayerCheck: !0,
            get style() {
              return {
                "--kb-menu-content-transform-origin": "var(--kb-popper-content-transform-origin)",
                position: "relative",
                ...o.style
              };
            },
            get "aria-labelledby"() {
              return r.triggerId();
            },
            onEscapeKeyDown: h,
            onFocusOutside: m,
            get onDismiss() {
              return r.close;
            },
            get onKeyDown() {
              return ut([o.onKeyDown, u.onKeyDown, f]);
            },
            get onMouseDown() {
              return ut([o.onMouseDown, u.onMouseDown]);
            },
            get onFocusIn() {
              return ut([o.onFocusIn, u.onFocusIn]);
            },
            get onFocusOut() {
              return ut([o.onFocusOut, u.onFocusOut]);
            },
            onPointerEnter: w,
            onPointerMove: g
          }, () => r.dataset(), a));
        }
      });
    }
  });
}
function lv(t) {
  let e;
  const n = wr(), r = mr(), [i, s] = K(t, ["ref"]);
  return as({
    element: () => e ?? null,
    enabled: () => r.isOpen() && n.preventScroll()
  }), d(av, D({
    ref(o) {
      var a = _e((l) => {
        e = l;
      }, i.ref);
      typeof a == "function" && a(o);
    }
  }, s));
}
function cv(t) {
  return d(sv, D({
    role: "menuitem",
    closeOnSelect: !0
  }, t));
}
function uv(t) {
  const e = mr();
  return d(te, {
    get when() {
      return e.contentPresence.isPresent();
    },
    get children() {
      return d(Gi, t);
    }
  });
}
function dv(t) {
  const e = `menu-${tt()}`, n = fe({
    id: e,
    modal: !0
  }, t), [r, i] = K(n, ["id", "modal", "preventScroll", "forceMount", "open", "defaultOpen", "onOpenChange", "value"]), s = or({
    open: () => r.open,
    defaultOpen: () => r.defaultOpen,
    onOpenChange: (a) => {
      var l;
      return (l = r.onOpenChange) == null ? void 0 : l.call(r, a);
    }
  }), o = {
    isModal: () => r.modal ?? !0,
    preventScroll: () => r.preventScroll ?? o.isModal(),
    forceMount: () => r.forceMount ?? !1,
    generateId: Et(() => r.id),
    value: () => r.value
  };
  return d(Vu.Provider, {
    value: o,
    get children() {
      return d(rv, D({
        get open() {
          return s.isOpen();
        },
        get onOpenChange() {
          return s.setIsOpen;
        }
      }, i));
    }
  });
}
function fv(t) {
  const e = wr(), n = mr(), r = Nu(), i = fe({
    id: e.generateId("trigger")
  }, t), [s, o] = K(i, ["ref", "id", "disabled", "onPointerDown", "onClick", "onKeyDown", "onMouseOver", "onFocus"]);
  let a;
  r !== void 0 && (a = e.value() ?? s.id, Z(() => {
    r.registerMenu(a, [n.contentRef(), ...n.nestedMenus()]);
  }), Z(() => {
    var w;
    r.value() === a ? ((w = n.triggerRef()) == null || w.focus(), r.autoFocusMenu() && n.open(!0)) : n.close(!0);
  }), Z(() => {
    n.isOpen() && r.setValue(a);
  }), me(() => {
    r.unregisterMenu(a);
  }), r.lastValue() === void 0 && r.setLastValue(a));
  const l = () => {
    r == null || r.setAutoFocusMenu(!0), r !== void 0 ? n.toggle(!1) : n.toggle(!0), r !== void 0 && !n.isOpen() && r.value() === a && r.closeMenu();
  }, c = (w) => {
    ce(w, s.onPointerDown), w.currentTarget.dataset.pointerType = w.pointerType, !s.disabled && w.pointerType !== "touch" && w.button === 0 && l();
  }, u = (w) => {
    ce(w, s.onClick), s.disabled || w.currentTarget.dataset.pointerType === "touch" && l();
  }, f = (w) => {
    if (ce(w, s.onKeyDown), !s.disabled)
      switch (w.key) {
        case "Enter":
        case " ":
        case "ArrowDown":
          w.stopPropagation(), w.preventDefault(), Lm(w.currentTarget), n.toggle("first");
          break;
        case "ArrowUp":
          w.stopPropagation(), w.preventDefault(), n.toggle("last");
          break;
        case "ArrowRight":
          if (r === void 0)
            break;
          w.stopPropagation(), w.preventDefault(), r.nextMenu();
          break;
        case "ArrowLeft":
          if (r === void 0)
            break;
          w.stopPropagation(), w.preventDefault(), r.previousMenu();
          break;
      }
  }, h = (w) => {
    ce(w, s.onMouseOver), !s.disabled && r !== void 0 && r.value() !== void 0 && r.setValue(a);
  }, m = (w) => {
    ce(w, s.onFocus), r !== void 0 && r.setValue(a);
  };
  return Z(() => me(n.registerTriggerId(s.id))), d(ur, D({
    ref(w) {
      var g = _e(n.setTriggerRef, s.ref);
      typeof g == "function" && g(w);
    },
    get id() {
      return s.id;
    },
    get disabled() {
      return s.disabled;
    },
    "aria-haspopup": "true",
    get "aria-expanded"() {
      return n.isOpen();
    },
    get "aria-controls"() {
      return J(() => !!n.isOpen())() ? n.contentId() : void 0;
    },
    get "data-highlighted"() {
      return a !== void 0 && (r == null ? void 0 : r.value()) === a ? !0 : void 0;
    },
    get tabIndex() {
      return r !== void 0 ? r.value() === a || r.lastValue() === a ? 0 : -1 : void 0;
    },
    onPointerDown: c,
    onMouseOver: h,
    onClick: u,
    onKeyDown: f,
    onFocus: m,
    role: r !== void 0 ? "menuitem" : void 0
  }, () => n.dataset(), o));
}
function hv(t) {
  const e = wr(), n = mr(), [r, i] = K(t, ["onCloseAutoFocus", "onInteractOutside"]);
  let s = !1;
  return d(lv, D({
    onCloseAutoFocus: (l) => {
      var c;
      (c = r.onCloseAutoFocus) == null || c.call(r, l), s || Ue(n.triggerRef()), s = !1, l.preventDefault();
    },
    onInteractOutside: (l) => {
      var c;
      (c = r.onInteractOutside) == null || c.call(r, l), (!e.isModal() || l.detail.isContextMenu) && (s = !0);
    }
  }, i));
}
function gv(t) {
  const e = `dropdownmenu-${tt()}`, n = fe({
    id: e
  }, t);
  return d(dv, n);
}
const Ku = Fe();
function Qo() {
  const t = Ne(Ku);
  if (t === void 0)
    throw new Error("[kobalte]: `usePopoverContext` must be used within a `Popover` component");
  return t;
}
function mv(t) {
  let e;
  const n = Qo(), r = fe({
    id: n.generateId("content")
  }, t), [i, s] = K(r, ["ref", "style", "onOpenAutoFocus", "onCloseAutoFocus", "onPointerDownOutside", "onFocusOutside", "onInteractOutside"]);
  let o = !1, a = !1, l = !1;
  const c = (m) => {
    var w;
    (w = i.onCloseAutoFocus) == null || w.call(i, m), n.isModal() ? (m.preventDefault(), o || Ue(n.triggerRef())) : (m.defaultPrevented || (a || Ue(n.triggerRef()), m.preventDefault()), a = !1, l = !1);
  }, u = (m) => {
    var w;
    (w = i.onPointerDownOutside) == null || w.call(i, m), n.isModal() && (o = m.detail.isContextMenu);
  }, f = (m) => {
    var w;
    (w = i.onFocusOutside) == null || w.call(i, m), n.isOpen() && n.isModal() && m.preventDefault();
  }, h = (m) => {
    var w;
    (w = i.onInteractOutside) == null || w.call(i, m), !n.isModal() && (m.defaultPrevented || (a = !0, m.detail.originalEvent.type === "pointerdown" && (l = !0)), dt(n.triggerRef(), m.target) && m.preventDefault(), m.detail.originalEvent.type === "focusin" && l && m.preventDefault());
  };
  return os({
    isDisabled: () => !(n.isOpen() && n.isModal()),
    targets: () => e ? [e] : []
  }), as({
    element: () => e ?? null,
    enabled: () => n.isOpen() && n.preventScroll()
  }), ss({
    trapFocus: () => n.isOpen() && n.isModal(),
    onMountAutoFocus: i.onOpenAutoFocus,
    onUnmountAutoFocus: c
  }, () => e), Z(() => me(n.registerContentId(s.id))), d(te, {
    get when() {
      return n.contentPresence.isPresent();
    },
    get children() {
      return d(jo, {
        get children() {
          return d(ls, D({
            ref(m) {
              var w = _e((g) => {
                n.setContentRef(g), n.contentPresence.setRef(g), e = g;
              }, i.ref);
              typeof w == "function" && w(m);
            },
            role: "dialog",
            tabIndex: -1,
            get disableOutsidePointerEvents() {
              return J(() => !!n.isOpen())() && n.isModal();
            },
            get excludedElements() {
              return [n.triggerRef];
            },
            get style() {
              return {
                "--kb-popover-content-transform-origin": "var(--kb-popper-content-transform-origin)",
                position: "relative",
                ...i.style
              };
            },
            get "aria-labelledby"() {
              return n.titleId();
            },
            get "aria-describedby"() {
              return n.descriptionId();
            },
            onPointerDownOutside: u,
            onFocusOutside: f,
            onInteractOutside: h,
            get onDismiss() {
              return n.close;
            }
          }, () => n.dataset(), s));
        }
      });
    }
  });
}
function wv(t) {
  const e = Qo();
  return d(te, {
    get when() {
      return e.contentPresence.isPresent();
    },
    get children() {
      return d(Gi, t);
    }
  });
}
const xl = {
  // `aria-label` of Popover.CloseButton.
  dismiss: "Dismiss"
};
function pv(t) {
  const e = `popover-${tt()}`, n = fe({
    id: e,
    modal: !1,
    translations: xl
  }, t), [r, i] = K(n, ["translations", "id", "open", "defaultOpen", "onOpenChange", "modal", "preventScroll", "forceMount", "anchorRef"]), [s, o] = N(), [a, l] = N(), [c, u] = N(), [f, h] = N(), [m, w] = N(), [g, p] = N(), v = or({
    open: () => r.open,
    defaultOpen: () => r.defaultOpen,
    onOpenChange: (F) => {
      var T;
      return (T = r.onOpenChange) == null ? void 0 : T.call(r, F);
    }
  }), b = () => {
    var F;
    return ((F = r.anchorRef) == null ? void 0 : F.call(r)) ?? s() ?? a();
  }, C = gn(() => r.forceMount || v.isOpen()), _ = J(() => ({
    "data-expanded": v.isOpen() ? "" : void 0,
    "data-closed": v.isOpen() ? void 0 : ""
  })), E = {
    translations: () => r.translations ?? xl,
    dataset: _,
    isOpen: v.isOpen,
    isModal: () => r.modal ?? !1,
    preventScroll: () => r.preventScroll ?? E.isModal(),
    contentPresence: C,
    triggerRef: a,
    contentId: f,
    titleId: m,
    descriptionId: g,
    setDefaultAnchorRef: o,
    setTriggerRef: l,
    setContentRef: u,
    close: v.close,
    toggle: v.toggle,
    generateId: Et(() => r.id),
    registerContentId: Ge(h),
    registerTitleId: Ge(w),
    registerDescriptionId: Ge(p)
  };
  return d(Ku.Provider, {
    value: E,
    get children() {
      return d(Xo, D({
        anchorRef: b,
        contentRef: c
      }, i));
    }
  });
}
function vv(t) {
  const e = Qo(), [n, r] = K(t, ["ref", "onClick", "onPointerDown"]);
  return d(ur, D({
    ref(o) {
      var a = _e(e.setTriggerRef, n.ref);
      typeof a == "function" && a(o);
    },
    "aria-haspopup": "dialog",
    get "aria-expanded"() {
      return e.isOpen();
    },
    get "aria-controls"() {
      return J(() => !!e.isOpen())() ? e.contentId() : void 0;
    },
    onPointerDown: (o) => {
      ce(o, n.onPointerDown), o.preventDefault();
    },
    onClick: (o) => {
      ce(o, n.onClick), e.toggle();
    }
  }, () => e.dataset(), r));
}
const Bu = Fe();
function ju() {
  const t = Ne(Bu);
  if (t === void 0)
    throw new Error("[kobalte]: `useRadioGroupContext` must be used within a `RadioGroup` component");
  return t;
}
const Wu = Fe();
function ds() {
  const t = Ne(Wu);
  if (t === void 0)
    throw new Error("[kobalte]: `useRadioGroupItemContext` must be used within a `RadioGroup.Item` component");
  return t;
}
function bv(t) {
  const e = ft(), n = ju(), r = `${e.generateId("item")}-${tt()}`, i = fe({
    id: r
  }, t), [s, o] = K(i, ["value", "disabled", "onPointerDown"]), [a, l] = N(), [c, u] = N(), [f, h] = N(), [m, w] = N(), [g, p] = N(!1), v = J(() => n.isSelectedValue(s.value)), b = J(() => s.disabled || e.isDisabled() || !1), C = (F) => {
    ce(F, s.onPointerDown), g() && F.preventDefault();
  }, _ = J(() => ({
    ...e.dataset(),
    "data-disabled": b() ? "" : void 0,
    "data-checked": v() ? "" : void 0
  })), E = {
    value: () => s.value,
    dataset: _,
    isSelected: v,
    isDisabled: b,
    inputId: a,
    labelId: c,
    descriptionId: f,
    inputRef: m,
    select: () => n.setSelectedValue(s.value),
    generateId: Et(() => o.id),
    registerInput: Ge(l),
    registerLabel: Ge(u),
    registerDescription: Ge(h),
    setIsFocused: p,
    setInputRef: w
  };
  return d(Wu.Provider, {
    value: E,
    get children() {
      return d(Se, D({
        as: "div",
        role: "group",
        onPointerDown: C
      }, _, o));
    }
  });
}
function yv(t) {
  const e = ds(), n = fe({
    id: e.generateId("control")
  }, t), [r, i] = K(n, ["onClick", "onKeyDown"]);
  return d(Se, D({
    as: "div",
    onClick: (a) => {
      var l;
      ce(a, r.onClick), e.select(), (l = e.inputRef()) == null || l.focus();
    },
    onKeyDown: (a) => {
      var l;
      ce(a, r.onKeyDown), a.key === Jr.Space && (e.select(), (l = e.inputRef()) == null || l.focus());
    }
  }, () => e.dataset(), i));
}
function xv(t) {
  const e = ds(), n = fe({
    id: e.generateId("indicator")
  }, t), [r, i] = K(n, ["ref", "forceMount"]), s = gn(() => r.forceMount || e.isSelected());
  return d(te, {
    get when() {
      return s.isPresent();
    },
    get children() {
      return d(Se, D({
        as: "div",
        ref(o) {
          var a = _e(s.setRef, r.ref);
          typeof a == "function" && a(o);
        }
      }, () => e.dataset(), i));
    }
  });
}
var kv = /* @__PURE__ */ L("<input type=radio>");
function Cv(t) {
  const e = ft(), n = ju(), r = ds(), i = fe({
    id: r.generateId("input")
  }, t), [s, o] = K(i, ["ref", "style", "aria-labelledby", "aria-describedby", "onChange", "onFocus", "onBlur"]), a = () => [
    s["aria-labelledby"],
    r.labelId(),
    // If there is both an aria-label and aria-labelledby, add the input itself has an aria-labelledby
    s["aria-labelledby"] != null && o["aria-label"] != null ? o.id : void 0
  ].filter(Boolean).join(" ") || void 0, l = () => [s["aria-describedby"], r.descriptionId(), n.ariaDescribedBy()].filter(Boolean).join(" ") || void 0, [c, u] = N(!1), f = (w) => {
    if (ce(w, s.onChange), w.stopPropagation(), !c()) {
      n.setSelectedValue(r.value());
      const g = w.target;
      g.checked = r.isSelected();
    }
    u(!1);
  }, h = (w) => {
    ce(w, s.onFocus), r.setIsFocused(!0);
  }, m = (w) => {
    ce(w, s.onBlur), r.setIsFocused(!1);
  };
  return Z(He([() => r.isSelected(), () => r.value()], (w) => {
    if (!w[0] && w[1] === r.value())
      return;
    u(!0);
    const g = r.inputRef();
    g == null || g.dispatchEvent(new Event("input", {
      bubbles: !0,
      cancelable: !0
    })), g == null || g.dispatchEvent(new Event("change", {
      bubbles: !0,
      cancelable: !0
    }));
  }, {
    defer: !0
  })), Z(() => me(r.registerInput(o.id))), (() => {
    var w = kv();
    w.addEventListener("blur", m), w.addEventListener("focus", h), w.addEventListener("change", f);
    var g = _e(r.setInputRef, s.ref);
    return typeof g == "function" && vt(g, w), nt(w, D({
      get name() {
        return e.name();
      },
      get value() {
        return r.value();
      },
      get checked() {
        return r.isSelected();
      },
      get required() {
        return e.isRequired();
      },
      get disabled() {
        return r.isDisabled();
      },
      get readonly() {
        return e.isReadOnly();
      },
      get style() {
        return {
          ...Zr,
          ...s.style
        };
      },
      get "aria-labelledby"() {
        return a();
      },
      get "aria-describedby"() {
        return l();
      }
    }, () => r.dataset(), o), !1, !1), w;
  })();
}
var _v = /* @__PURE__ */ L("<label>");
function Sv(t) {
  const e = ds(), n = fe({
    id: e.generateId("label")
  }, t);
  return Z(() => me(e.registerLabel(n.id))), (() => {
    var r = _v();
    return nt(r, D({
      get for() {
        return e.inputId();
      }
    }, () => e.dataset(), n), !1, !1), r;
  })();
}
function Mv(t) {
  let e;
  const n = `radiogroup-${tt()}`, r = fe({
    id: n,
    orientation: "vertical"
  }, t), [i, s, o] = K(r, ["ref", "value", "defaultValue", "onChange", "orientation", "aria-labelledby", "aria-describedby"], lr), [a, l] = sr({
    value: () => i.value,
    defaultValue: () => i.defaultValue,
    onChange: (w) => {
      var g;
      return (g = i.onChange) == null ? void 0 : g.call(i, w);
    }
  }), {
    formControlContext: c
  } = cr(s);
  ar(() => e, () => l(i.defaultValue ?? ""));
  const u = () => c.getAriaLabelledBy(R(s.id), o["aria-label"], i["aria-labelledby"]), f = () => c.getAriaDescribedBy(i["aria-describedby"]), h = (w) => w === a(), m = {
    ariaDescribedBy: f,
    isSelectedValue: h,
    setSelectedValue: (w) => {
      if (!(c.isReadOnly() || c.isDisabled()) && (l(w), e))
        for (const g of e.querySelectorAll("[type='radio']")) {
          const p = g;
          p.checked = h(p.value);
        }
    }
  };
  return d(An.Provider, {
    value: c,
    get children() {
      return d(Bu.Provider, {
        value: m,
        get children() {
          return d(Se, D({
            as: "div",
            ref(w) {
              var g = _e((p) => e = p, i.ref);
              typeof g == "function" && g(w);
            },
            role: "radiogroup",
            get id() {
              return R(s.id);
            },
            get "aria-invalid"() {
              return c.validationState() === "invalid" || void 0;
            },
            get "aria-required"() {
              return c.isRequired() || void 0;
            },
            get "aria-disabled"() {
              return c.isDisabled() || void 0;
            },
            get "aria-readonly"() {
              return c.isReadOnly() || void 0;
            },
            get "aria-orientation"() {
              return i.orientation;
            },
            get "aria-labelledby"() {
              return u();
            },
            get "aria-describedby"() {
              return f();
            }
          }, () => c.dataset(), o));
        }
      });
    }
  });
}
const Hu = Fe();
function fs() {
  const t = Ne(Hu);
  if (t === void 0)
    throw new Error("[kobalte]: `useSliderContext` must be used within a `Slider.Root` component");
  return t;
}
function Ov(t) {
  const e = fs(), [n, r] = K(t, ["style"]), i = () => e.state.values().map((a) => e.state.getValuePercent(a) * 100), s = () => e.state.values().length > 1 ? Math.min(...i()) : 0, o = () => 100 - Math.max(...i());
  return d(Se, D({
    as: "div",
    get style() {
      return {
        [e.startEdge()]: `${s()}%`,
        [e.endEdge()]: `${o()}%`,
        ...n.style
      };
    }
  }, () => e.dataset(), r));
}
function Ev(t) {
  let e;
  const n = fs(), r = fe({
    id: n.generateId(`thumb-${tt()}`)
  }, t), [i, s, o] = K(r, ["ref", "style", "onKeyDown", "onPointerDown", "onPointerMove", "onPointerUp", "onFocus", "onBlur"], ei), {
    fieldProps: a
  } = ti(s);
  xu({
    getItem: () => ({
      ref: () => e,
      disabled: n.state.isDisabled(),
      key: a.id(),
      textValue: "",
      type: "item"
    })
  });
  const l = () => e ? n.thumbs().findIndex((C) => C.ref() === e) : -1, c = () => n.state.getThumbValue(l()), u = () => n.state.getThumbPercent(l()), f = () => n.state.orientation() === "vertical" ? "translateY(50%)" : "translateX(-50%)";
  let h = 0;
  const m = (C) => {
    ce(C, i.onKeyDown), n.onStepKeyDown(C, l());
  }, w = (C) => {
    var E;
    ce(C, i.onPointerDown);
    const _ = C.currentTarget;
    C.preventDefault(), C.stopPropagation(), _.setPointerCapture(C.pointerId), _.focus(), h = n.state.orientation() === "horizontal" ? C.clientX : C.clientY, c() !== void 0 && ((E = n.onSlideStart) == null || E.call(n, l(), c()));
  }, g = (C) => {
    var E;
    if (C.stopPropagation(), ce(C, i.onPointerMove), C.currentTarget.hasPointerCapture(C.pointerId)) {
      const F = {
        deltaX: C.clientX - h,
        deltaY: C.clientY - h
      };
      (E = n.onSlideMove) == null || E.call(n, F), h = n.state.orientation() === "horizontal" ? C.clientX : C.clientY;
    }
  }, p = (C) => {
    var E;
    C.stopPropagation(), ce(C, i.onPointerUp);
    const _ = C.currentTarget;
    _.hasPointerCapture(C.pointerId) && (_.releasePointerCapture(C.pointerId), (E = n.onSlideEnd) == null || E.call(n));
  }, v = (C) => {
    ce(C, i.onFocus), n.state.setFocusedThumb(l());
  }, b = (C) => {
    ce(C, i.onBlur), n.state.setFocusedThumb(void 0);
  };
  return en(() => {
    n.state.setThumbEditable(l(), !n.state.isDisabled());
  }), d(Uu.Provider, {
    value: {
      index: l
    },
    get children() {
      return d(Se, D({
        as: "span",
        ref(C) {
          var _ = _e((E) => e = E, i.ref);
          typeof _ == "function" && _(C);
        },
        role: "slider",
        get id() {
          return a.id();
        },
        get tabIndex() {
          return n.state.isDisabled() ? void 0 : 0;
        },
        get style() {
          return {
            display: c() === void 0 ? "none" : void 0,
            position: "absolute",
            [n.startEdge()]: `calc(${u() * 100}%)`,
            transform: f(),
            "touch-action": "none",
            ...i.style
          };
        },
        get "aria-valuetext"() {
          return n.state.getThumbValueLabel(l());
        },
        get "aria-valuemin"() {
          return n.minValue();
        },
        get "aria-valuenow"() {
          return c();
        },
        get "aria-valuemax"() {
          return n.maxValue();
        },
        get "aria-orientation"() {
          return n.state.orientation();
        },
        get "aria-label"() {
          return a.ariaLabel();
        },
        get "aria-labelledby"() {
          return a.ariaLabelledBy();
        },
        get "aria-describedby"() {
          return a.ariaDescribedBy();
        },
        onKeyDown: m,
        onPointerDown: w,
        onPointerMove: g,
        onPointerUp: p,
        onFocus: v,
        onBlur: b
      }, () => n.dataset(), o));
    }
  });
}
const Uu = Fe();
function Iv() {
  const t = Ne(Uu);
  if (t === void 0)
    throw new Error("[kobalte]: `useThumbContext` must be used within a `Slider.Thumb` component");
  return t;
}
var Pv = /* @__PURE__ */ L("<input type=range>");
function Dv(t) {
  const e = ft(), n = fs(), r = Iv(), i = fe({
    id: n.generateId("input")
  }, t), [s, o, a] = K(i, ["ref", "style", "onChange"], ei), {
    fieldProps: l
  } = ti(o), [c, u] = N(""), f = (h) => {
    ce(h, s.onChange);
    const m = h.target;
    n.state.setThumbValue(r.index(), parseFloat(m.value)), m.value = String(n.state.values()[r.index()]) ?? "";
  };
  return Z(() => {
    u(r.index() === -1 ? "" : n.state.getThumbValueLabel(r.index()));
  }), (() => {
    var h = Pv();
    h.addEventListener("change", f);
    var m = _e((w) => w, s.ref);
    return typeof m == "function" && vt(m, h), nt(h, D({
      get id() {
        return l.id();
      },
      get name() {
        return e.name();
      },
      get tabIndex() {
        return n.state.isDisabled() ? void 0 : -1;
      },
      get min() {
        return n.state.getThumbMinValue(r.index());
      },
      get max() {
        return n.state.getThumbMaxValue(r.index());
      },
      get step() {
        return n.state.step();
      },
      get value() {
        return n.state.values()[r.index()];
      },
      get required() {
        return e.isRequired();
      },
      get disabled() {
        return e.isDisabled();
      },
      get readonly() {
        return e.isReadOnly();
      },
      get style() {
        return {
          ...Zr,
          ...s.style
        };
      },
      get "aria-orientation"() {
        return n.state.orientation();
      },
      get "aria-valuetext"() {
        return c();
      },
      get "aria-label"() {
        return l.ariaLabel();
      },
      get "aria-labelledby"() {
        return l.ariaLabelledBy();
      },
      get "aria-describedby"() {
        return l.ariaDescribedBy();
      },
      get "aria-invalid"() {
        return e.validationState() === "invalid" || void 0;
      },
      get "aria-required"() {
        return e.isRequired() || void 0;
      },
      get "aria-disabled"() {
        return e.isDisabled() || void 0;
      },
      get "aria-readonly"() {
        return e.isReadOnly() || void 0;
      }
    }, () => n.dataset(), a), !1, !1), h;
  })();
}
function po(t, e, n) {
  const r = [...t];
  return r[n] = e, r.sort((i, s) => i - s);
}
function $v(t, e) {
  if (t.length === 1)
    return 0;
  const n = t.map((s) => Math.abs(s - e)), r = Math.min(...n), i = n.indexOf(r);
  return e < t[i] ? i : n.lastIndexOf(r);
}
function Tv(t) {
  return t.slice(0, -1).map((e, n) => t[n + 1] - e);
}
function vo(t, e) {
  if (e > 0) {
    const n = Tv(t);
    return Math.min(...n) >= e;
  }
  return !0;
}
function Av(t, e) {
  return (n) => {
    if (t[0] === t[1] || e[0] === e[1])
      return e[0];
    const r = (e[1] - e[0]) / (t[1] - t[0]);
    return e[0] + r * (n - t[0]);
  };
}
function Vn(t) {
  t.preventDefault(), t.stopPropagation();
}
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/1ddcde7b4fef9af7f08e11bb78d71fe60bbcc64b/packages/@react-stately/slider/src/useSliderState.ts
 */
function Lv(t) {
  const e = fe({
    minValue: () => 0,
    maxValue: () => 100,
    step: () => 1,
    minStepsBetweenThumbs: () => 0,
    orientation: () => "horizontal",
    isDisabled: () => !1
  }, t), n = J(() => {
    let I = (e.maxValue() - e.minValue()) / 10;
    return I = $s(I, 0, I + e.step(), e.step()), Math.max(I, e.step());
  }), r = J(() => e.defaultValue() ?? [e.minValue()]), [i, s] = nu({
    value: () => e.value(),
    defaultValue: r,
    onChange: (I) => {
      var O;
      return (O = e.onChange) == null ? void 0 : O.call(e, I);
    }
  }), [o, a] = N(new Array(i().length).fill(!1)), [l, c] = N(new Array(i().length).fill(!1)), [u, f] = N(void 0), h = () => {
    s(r());
  }, m = (I) => (I - e.minValue()) / (e.maxValue() - e.minValue()), w = (I) => I === 0 ? t.minValue() : i()[I - 1] + t.minStepsBetweenThumbs() * t.step(), g = (I) => I === i().length - 1 ? t.maxValue() : i()[I + 1] - t.minStepsBetweenThumbs() * t.step(), p = (I) => l()[I], v = (I) => {
    c((O) => (O[I] = !0, O));
  }, b = (I, O) => {
    if (e.isDisabled() || !p(I))
      return;
    const Q = $s(O, w(I), g(I), e.step()), H = po(i(), Q, I);
    vo(H, e.minStepsBetweenThumbs() * e.step()) && s((S) => [...kl(S, I, Q)]);
  }, C = (I, O) => {
    var H;
    if (e.isDisabled() || !p(I))
      return;
    const Q = o()[I];
    a((S) => [...kl(S, I, O)]), Q && !o().some(Boolean) && ((H = e.onChangeEnd) == null || H.call(e, i()));
  }, _ = (I) => e.numberFormatter.format(I), E = (I, O) => {
    b(I, T(O));
  }, F = (I) => Math.round((I - e.minValue()) / e.step()) * e.step() + e.minValue(), T = (I) => {
    const O = I * (e.maxValue() - e.minValue()) + e.minValue();
    return eu(F(O), e.minValue(), e.maxValue());
  }, x = (I, O) => {
    const Q = i()[I] + O, H = po(i(), Q, I);
    vo(H, e.minStepsBetweenThumbs() * e.step()) && b(I, $s(Q, e.minValue(), e.maxValue(), e.step()));
  };
  return {
    values: i,
    getThumbValue: (I) => i()[I],
    setThumbValue: b,
    setThumbPercent: E,
    isThumbDragging: (I) => o()[I],
    setThumbDragging: C,
    focusedThumb: u,
    setFocusedThumb: f,
    getThumbPercent: (I) => m(i()[I]),
    getValuePercent: m,
    getThumbValueLabel: (I) => _(i()[I]),
    getFormattedValue: _,
    getThumbMinValue: w,
    getThumbMaxValue: g,
    getPercentValue: T,
    isThumbEditable: p,
    setThumbEditable: v,
    incrementThumb: (I, O = 1) => {
      x(I, Math.max(O, t.step()));
    },
    decrementThumb: (I, O = 1) => {
      x(I, -Math.max(O, t.step()));
    },
    step: e.step,
    pageSize: n,
    orientation: e.orientation,
    isDisabled: e.isDisabled,
    setValues: s,
    resetValues: h
  };
}
function kl(t, e, n) {
  return t[e] === n ? t : [...t.slice(0, e), n, ...t.slice(e + 1)];
}
function Fv(t) {
  let e;
  const n = `slider-${tt()}`, r = fe({
    id: n,
    minValue: 0,
    maxValue: 100,
    step: 1,
    minStepsBetweenThumbs: 0,
    orientation: "horizontal",
    disabled: !1,
    inverted: !1,
    getValueLabel: (S) => S.values.join(", ")
  }, t), [i, s, o] = K(r, ["ref", "value", "defaultValue", "onChange", "onChangeEnd", "inverted", "minValue", "maxValue", "step", "minStepsBetweenThumbs", "getValueLabel", "orientation"], lr), {
    formControlContext: a
  } = cr(s), l = dw(() => ({
    style: "decimal"
  })), {
    direction: c
  } = ni(), u = Lv({
    value: () => i.value,
    defaultValue: () => i.defaultValue ?? [i.minValue],
    maxValue: () => i.maxValue,
    minValue: () => i.minValue,
    minStepsBetweenThumbs: () => i.minStepsBetweenThumbs,
    isDisabled: () => a.isDisabled() ?? !1,
    orientation: () => i.orientation,
    step: () => i.step,
    numberFormatter: l(),
    onChange: i.onChange,
    onChangeEnd: i.onChangeEnd
  }), [f, h] = N([]), {
    DomCollectionProvider: m
  } = yu({
    items: f,
    onItemsChange: h
  });
  ar(() => e, () => u.resetValues());
  const w = () => c() === "ltr", g = () => w() && !i.inverted || !w() && i.inverted, p = () => !i.inverted, v = () => u.orientation() === "vertical", b = J(() => ({
    ...a.dataset(),
    "data-orientation": i.orientation
  })), [C, _] = N();
  let E = null;
  const F = (S, M) => {
    u.setFocusedThumb(S), u.setThumbDragging(S, !0), u.setThumbValue(S, M), E = null;
  }, T = ({
    deltaX: S,
    deltaY: M
  }) => {
    var ee;
    const P = u.focusedThumb();
    if (P === void 0)
      return;
    const {
      width: B,
      height: V
    } = C().getBoundingClientRect(), X = v() ? V : B;
    E === null && (E = u.getThumbPercent(u.focusedThumb()) * X);
    let q = v() ? M : S;
    (!v() && i.inverted || v() && p()) && (q = -q), E += q;
    const $ = eu(E / X, 0, 1), W = po(u.values(), E, P);
    vo(W, i.minStepsBetweenThumbs * u.step()) && (u.setThumbPercent(u.focusedThumb(), $), (ee = i.onChange) == null || ee.call(i, u.values()));
  }, x = () => {
    const S = u.focusedThumb();
    S !== void 0 && (u.setThumbDragging(S, !1), f()[S].ref().focus());
  }, y = (S) => {
    const M = u.focusedThumb();
    !a.isDisabled() && M !== void 0 && (Vn(S), u.setThumbValue(M, u.getThumbMinValue(M)));
  }, z = (S) => {
    const M = u.focusedThumb();
    !a.isDisabled() && M !== void 0 && (Vn(S), u.setThumbValue(M, u.getThumbMaxValue(M)));
  }, I = (S, M) => {
    if (!a.isDisabled())
      switch (S.key) {
        case "Left":
        case "ArrowLeft":
        case "Down":
        case "ArrowDown":
          Vn(S), w() ? u.decrementThumb(M, S.shiftKey ? u.pageSize() : u.step()) : u.incrementThumb(M, S.shiftKey ? u.pageSize() : u.step());
          break;
        case "Right":
        case "ArrowRight":
        case "Up":
        case "ArrowUp":
          Vn(S), w() ? u.incrementThumb(M, S.shiftKey ? u.pageSize() : u.step()) : u.decrementThumb(M, S.shiftKey ? u.pageSize() : u.step());
          break;
        case "Home":
          y(S);
          break;
        case "End":
          z(S);
          break;
        case "PageUp":
          Vn(S), u.incrementThumb(M, u.pageSize());
          break;
        case "PageDown":
          Vn(S), u.decrementThumb(M, u.pageSize());
          break;
      }
  }, O = J(() => v() ? p() ? "bottom" : "top" : g() ? "left" : "right"), Q = J(() => v() ? p() ? "top" : "bottom" : g() ? "right" : "left"), H = {
    dataset: b,
    state: u,
    thumbs: f,
    setThumbs: h,
    onSlideStart: F,
    onSlideMove: T,
    onSlideEnd: x,
    onStepKeyDown: I,
    isSlidingFromLeft: g,
    isSlidingFromBottom: p,
    trackRef: C,
    minValue: () => i.minValue,
    maxValue: () => i.maxValue,
    inverted: () => i.inverted,
    startEdge: O,
    endEdge: Q,
    registerTrack: (S) => _(S),
    generateId: Et(() => R(s.id)),
    getValueLabel: i.getValueLabel
  };
  return d(m, {
    get children() {
      return d(An.Provider, {
        value: a,
        get children() {
          return d(Hu.Provider, {
            value: H,
            get children() {
              return d(Se, D({
                as: "div",
                ref(S) {
                  var M = _e((P) => e = P, i.ref);
                  typeof M == "function" && M(S);
                },
                role: "group",
                get id() {
                  return R(s.id);
                }
              }, b, o));
            }
          });
        }
      });
    }
  });
}
function zv(t) {
  const e = fs(), [n, r] = K(t, ["onPointerDown", "onPointerMove", "onPointerUp"]), [i, s] = N();
  function o(f) {
    const h = i() || e.trackRef().getBoundingClientRect(), m = [0, e.state.orientation() === "vertical" ? h.height : h.width];
    let w = e.isSlidingFromLeft() ? [e.minValue(), e.maxValue()] : [e.maxValue(), e.minValue()];
    e.state.orientation() === "vertical" && (w = e.isSlidingFromBottom() ? [e.maxValue(), e.minValue()] : [e.minValue(), e.maxValue()]);
    const g = Av(m, w);
    return s(h), g(f - (e.state.orientation() === "vertical" ? h.top : h.left));
  }
  let a = 0;
  return d(Se, D({
    as: "div",
    ref(f) {
      var h = _e(e.registerTrack, t.ref);
      typeof h == "function" && h(f);
    },
    onPointerDown: (f) => {
      var g;
      ce(f, n.onPointerDown), f.target.setPointerCapture(f.pointerId), f.preventDefault();
      const m = o(e.state.orientation() === "horizontal" ? f.clientX : f.clientY);
      a = e.state.orientation() === "horizontal" ? f.clientX : f.clientY;
      const w = $v(e.state.values(), m);
      (g = e.onSlideStart) == null || g.call(e, w, m);
    },
    onPointerMove: (f) => {
      var m;
      ce(f, n.onPointerMove), f.target.hasPointerCapture(f.pointerId) && ((m = e.onSlideMove) == null || m.call(e, {
        deltaX: f.clientX - a,
        deltaY: f.clientY - a
      }), a = e.state.orientation() === "horizontal" ? f.clientX : f.clientY);
    },
    onPointerUp: (f) => {
      var m;
      ce(f, n.onPointerUp);
      const h = f.target;
      h.hasPointerCapture(f.pointerId) && (h.releasePointerCapture(f.pointerId), s(void 0), (m = e.onSlideEnd) == null || m.call(e));
    }
  }, () => e.dataset(), r));
}
const qu = Fe();
function Gu() {
  const t = Ne(qu);
  if (t === void 0)
    throw new Error("[kobalte]: `useSwitchContext` must be used within a `Switch` component");
  return t;
}
function Rv(t) {
  const e = ft(), n = Gu(), r = fe({
    id: n.generateId("control")
  }, t), [i, s] = K(r, ["onClick", "onKeyDown"]);
  return d(Se, D({
    as: "div",
    onClick: (l) => {
      var c;
      ce(l, i.onClick), n.toggle(), (c = n.inputRef()) == null || c.focus();
    },
    onKeyDown: (l) => {
      var c;
      ce(l, i.onKeyDown), l.key === Jr.Space && (n.toggle(), (c = n.inputRef()) == null || c.focus());
    }
  }, () => e.dataset(), () => n.dataset(), s));
}
function Vv(t) {
  let e;
  const n = `switch-${tt()}`, r = fe({
    value: "on",
    id: n
  }, t), [i, s, o] = K(r, ["ref", "children", "value", "checked", "defaultChecked", "onChange", "onPointerDown"], lr), [a, l] = N(), [c, u] = N(!1), {
    formControlContext: f
  } = cr(s), h = Bo({
    isSelected: () => i.checked,
    defaultIsSelected: () => i.defaultChecked,
    onSelectedChange: (p) => {
      var v;
      return (v = i.onChange) == null ? void 0 : v.call(i, p);
    },
    isDisabled: () => f.isDisabled(),
    isReadOnly: () => f.isReadOnly()
  });
  ar(() => e, () => h.setIsSelected(i.defaultChecked ?? !1));
  const m = (p) => {
    ce(p, i.onPointerDown), c() && p.preventDefault();
  }, w = J(() => ({
    "data-checked": h.isSelected() ? "" : void 0
  })), g = {
    value: () => i.value,
    dataset: w,
    checked: () => h.isSelected(),
    inputRef: a,
    generateId: Et(() => R(s.id)),
    toggle: () => h.toggle(),
    setIsChecked: (p) => h.setIsSelected(p),
    setIsFocused: u,
    setInputRef: l
  };
  return d(An.Provider, {
    value: f,
    get children() {
      return d(qu.Provider, {
        value: g,
        get children() {
          return d(Se, D({
            as: "div",
            ref(p) {
              var v = _e((b) => e = b, i.ref);
              typeof v == "function" && v(p);
            },
            role: "group",
            get id() {
              return R(s.id);
            },
            onPointerDown: m
          }, () => f.dataset(), w, o, {
            get children() {
              return d(Nv, {
                state: g,
                get children() {
                  return i.children;
                }
              });
            }
          }));
        }
      });
    }
  });
}
function Nv(t) {
  const e = Dn(() => {
    const n = t.children;
    return fn(n) ? n(t.state) : n;
  });
  return J(e);
}
function Kv(t) {
  const e = ft(), n = Gu(), r = fe({
    id: n.generateId("thumb")
  }, t);
  return d(Se, D({
    as: "div"
  }, () => e.dataset(), () => n.dataset(), r));
}
const Yu = Fe();
function Xu() {
  const t = Ne(Yu);
  if (t === void 0)
    throw new Error("[kobalte]: `useTextFieldContext` must be used within a `TextField` component");
  return t;
}
function Jo(t) {
  return d(Qu, D({
    type: "text"
  }, t));
}
function Qu(t) {
  const e = ft(), n = Xu(), r = fe({
    id: n.generateId("input")
  }, t), [i, s, o] = K(r, ["onInput"], ei), {
    fieldProps: a
  } = ti(s);
  return d(Se, D({
    as: "input",
    get id() {
      return a.id();
    },
    get name() {
      return e.name();
    },
    get value() {
      return n.value();
    },
    get required() {
      return e.isRequired();
    },
    get disabled() {
      return e.isDisabled();
    },
    get readonly() {
      return e.isReadOnly();
    },
    get "aria-label"() {
      return a.ariaLabel();
    },
    get "aria-labelledby"() {
      return a.ariaLabelledBy();
    },
    get "aria-describedby"() {
      return a.ariaDescribedBy();
    },
    get "aria-invalid"() {
      return e.validationState() === "invalid" || void 0;
    },
    get "aria-required"() {
      return e.isRequired() || void 0;
    },
    get "aria-disabled"() {
      return e.isDisabled() || void 0;
    },
    get "aria-readonly"() {
      return e.isReadOnly() || void 0;
    },
    get onInput() {
      return ut([i.onInput, n.onInput]);
    }
  }, () => e.dataset(), o));
}
function Zo(t) {
  let e;
  const n = `textfield-${tt()}`, r = fe({
    id: n
  }, t), [i, s, o] = K(r, ["ref", "value", "defaultValue", "onChange"], lr), [a, l] = sr({
    value: () => i.value,
    defaultValue: () => i.defaultValue,
    onChange: (h) => {
      var m;
      return (m = i.onChange) == null ? void 0 : m.call(i, h);
    }
  }), {
    formControlContext: c
  } = cr(s);
  ar(() => e, () => l(i.defaultValue ?? ""));
  const u = (h) => {
    if (c.isReadOnly() || c.isDisabled())
      return;
    const m = h.target;
    l(m.value), m.value = a() ?? "";
  }, f = {
    value: a,
    generateId: Et(() => R(s.id)),
    onInput: u
  };
  return d(An.Provider, {
    value: c,
    get children() {
      return d(Yu.Provider, {
        value: f,
        get children() {
          return d(Se, D({
            as: "div",
            ref(h) {
              var m = _e((w) => e = w, i.ref);
              typeof m == "function" && m(h);
            },
            role: "group",
            get id() {
              return R(s.id);
            }
          }, () => c.dataset(), o));
        }
      });
    }
  });
}
function Bv(t) {
  let e;
  const n = Xu(), r = fe({
    id: n.generateId("textarea")
  }, t), [i, s] = K(r, ["ref", "autoResize", "submitOnEnter", "onKeyPress"]);
  Z(He([() => e, () => i.autoResize, () => n.value()], ([a, l]) => {
    !a || !l || jv(a);
  }));
  const o = (a) => {
    e && i.submitOnEnter && a.key === "Enter" && !a.shiftKey && e.form && (e.form.requestSubmit(), a.preventDefault());
  };
  return d(Qu, D({
    as: "textarea",
    get "aria-multiline"() {
      return i.submitOnEnter ? "false" : void 0;
    },
    get onKeyPress() {
      return ut([i.onKeyPress, o]);
    },
    ref(a) {
      var l = _e((c) => e = c, i.ref);
      typeof l == "function" && l(a);
    }
  }, s));
}
function jv(t) {
  const e = t.style.alignSelf, n = t.style.overflow;
  "MozAppearance" in t.style || (t.style.overflow = "hidden"), t.style.alignSelf = "start", t.style.height = "auto", t.style.height = `${t.scrollHeight + (t.offsetHeight - t.clientHeight)}px`, t.style.overflow = n, t.style.alignSelf = e;
}
function Wv(t) {
  const [e, n] = K(t, ["children", "pressed", "defaultPressed", "onChange", "onClick"]), r = Bo({
    isSelected: () => e.pressed,
    defaultIsSelected: () => e.defaultPressed,
    onSelectedChange: (s) => {
      var o;
      return (o = e.onChange) == null ? void 0 : o.call(e, s);
    },
    isDisabled: () => n.disabled
  });
  return d(ur, D({
    get "aria-pressed"() {
      return r.isSelected();
    },
    get "data-pressed"() {
      return r.isSelected() ? "" : void 0;
    },
    onClick: (s) => {
      ce(s, e.onClick), r.toggle();
    }
  }, n, {
    get children() {
      return d(Hv, {
        get state() {
          return {
            pressed: r.isSelected
          };
        },
        get children() {
          return e.children;
        }
      });
    }
  }));
}
function Hv(t) {
  const e = Dn(() => {
    const n = t.children;
    return fn(n) ? n(t.state) : n;
  });
  return J(e);
}
var Ju = Vv, Zu = (t) => {
  let [e, n] = K(t, ["class"]);
  return d(Rv, D({ get class() {
    return G("tw-bg-input tw-inline-flex tw-h-[20px] tw-w-[36px] tw-shrink-0 tw-cursor-pointer tw-items-center tw-rounded-full tw-border tw-border-border tw-bg-muted tw-shadow-sm tw-transition-colors focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-primary focus-visible:tw-ring-offset-2 focus-visible:tw-ring-offset-background data-[disabled]:tw-cursor-not-allowed data-[checked]:tw-bg-primary data-[disabled]:tw-opacity-50", e.class);
  } }, n));
}, ed = (t) => {
  let [e, n] = K(t, ["class"]);
  return d(Kv, D({ get class() {
    return G("tw-pointer-events-none tw-block tw-h-4 tw-w-4 tw-translate-x-0 tw-rounded-full tw-bg-background tw-shadow-lg tw-ring-0 tw-transition-transform data-[checked]:tw-translate-x-4", e.class);
  } }, n));
}, Uv = L("<table>"), qv = L("<thead>"), Gv = L("<tbody>"), Yv = L("<tr>"), Xv = L("<th>"), Qv = L("<td>");
L("<caption>");
var td = (t) => {
  let [e, n] = K(t, ["class"]);
  return (() => {
    var r = Uv();
    return nt(r, D({ get class() {
      return G("tw-w-full tw-caption-bottom tw-text-sm", e.class);
    } }, n), !1, !1), r;
  })();
}, nd = (t) => {
  let [e, n] = K(t, ["class"]);
  return (() => {
    var r = qv();
    return nt(r, D({ get class() {
      return G("[&_tr]:tw-border-b", e.class);
    } }, n), !1, !1), r;
  })();
}, rd = (t) => {
  let [e, n] = K(t, ["class"]);
  return (() => {
    var r = Gv();
    return nt(r, D({ get class() {
      return G("[&_tr:last-child]:tw-border-0", e.class);
    } }, n), !1, !1), r;
  })();
}, Vr = (t) => {
  let [e, n] = K(t, ["class"]);
  return (() => {
    var r = Yv();
    return nt(r, D({ get class() {
      return G("tw-border-b tw-transition-colors hover:tw-bg-muted/50 data-[state=selected]:tw-bg-muted", e.class);
    } }, n), !1, !1), r;
  })();
}, Si = (t) => {
  let [e, n] = K(t, ["class"]);
  return (() => {
    var r = Xv();
    return nt(r, D({ get class() {
      return G("tw-h-10 tw-px-2 tw-text-left tw-align-middle tw-font-medium tw-text-muted-foreground [&:has([role=checkbox])]:tw-pr-0 [&>[role=checkbox]]:tw-translate-y-[2px]", e.class);
    } }, n), !1, !1), r;
  })();
}, $r = (t) => {
  let [e, n] = K(t, ["class"]);
  return (() => {
    var r = Qv();
    return nt(r, D({ get class() {
      return G("tw-p-2 tw-align-middle [&:has([role=checkbox])]:tw-pr-0 [&>[role=checkbox]]:tw-translate-y-[2px]", e.class);
    } }, n), !1, !1), r;
  })();
}, id = (t) => {
  let [e, n] = K(t, ["class"]);
  return d(Bv, D({ get class() {
    return G("tw-flex tw-min-h-[60px] tw-w-full tw-rounded-md tw-border tw-border-border tw-bg-transparent tw-px-3 tw-py-2 tw-text-sm tw-shadow-sm placeholder:tw-text-muted-foreground focus-visible:tw-outline-none focus-visible:tw-ring-1 focus-visible:tw-ring-primary disabled:tw-cursor-not-allowed disabled:tw-opacity-50", e.class);
  } }, n));
}, Jv = L('<div class="tw-flex tw-select-none tw-items-center tw-border-r tw-border-border tw-px-2">'), Zv = L('<div class="tw-flex tw-select-none tw-items-center tw-border-l tw-border-border tw-px-2">'), eb = L("<div>"), Ot = Zo, tb = bn("tw-flex tw-h-9 tw-w-full tw-py-1 tw-text-sm", { variants: { variant: { default: "tw-rounded-md tw-border tw-border-border tw-bg-background tw-shadow-sm tw-transition-colors file:tw-border-0 file:tw-bg-transparent file:tw-text-sm file:tw-font-medium placeholder:tw-text-muted-foreground focus-visible:tw-outline-none focus-visible:tw-ring-1 focus-visible:tw-ring-primary disabled:tw-cursor-not-allowed disabled:tw-opacity-50", ghost: "tw-border-none focus-visible:tw-outline-none disabled:tw-cursor-not-allowed disabled:tw-opacity-50" } }, defaultVariants: { variant: "default" } }), jt = (t) => {
  let [e, n] = K(t, ["class", "variant", "size", "prefix", "suffix"]);
  return (() => {
    var r = eb();
    return k(r, d(te, { get when() {
      return e.prefix;
    }, get children() {
      var i = Jv();
      return k(i, () => e.prefix), i;
    } }), null), k(r, d(Jo, D(n, { class: "tw-flex-1 tw-bg-transparent tw-px-2 placeholder:tw-text-muted-foreground focus-visible:tw-outline-none disabled:tw-opacity-50" })), null), k(r, d(te, { get when() {
      return e.suffix;
    }, get children() {
      var i = Zv();
      return k(i, () => e.suffix), i;
    } }), null), oe(() => De(r, G(tb({ variant: e.variant }), e.class))), r;
  })();
}, nb = bn("focus-visible:tw-ring-ring data-[pressed]:tw-bg-accent data-[pressed]:tw-text-accent-foreground tw-inline-flex tw-items-center tw-justify-center tw-rounded-md tw-text-sm tw-font-medium tw-transition-colors hover:tw-bg-muted hover:tw-text-muted-foreground focus-visible:tw-outline-none focus-visible:tw-ring disabled:tw-pointer-events-none disabled:tw-opacity-50", { variants: { variant: { default: "tw-bg-transparent", outline: "tw-border-input hover:tw-bg-accent hover:tw-text-accent-foreground tw-border tw-bg-transparent tw-shadow-sm" }, size: { default: "tw-h-9 tw-px-3", sm: "tw-h-8 tw-px-2", lg: "tw-h-10 tw-px-3" } }, defaultVariants: { variant: "default", size: "default" } }), rb = (t) => {
  let [e, n] = K(t, ["class", "variant", "size"]);
  return d(Wv, D({ get class() {
    return G(nb({ variant: e.variant, size: e.size }), e.class, "tw-px-2 tw-py-2 data-[pressed]:tw-bg-primary data-[pressed]:tw-text-primary-foreground");
  } }, n));
}, ib = L('<div class="tw-flex tw-flex-row">'), sb = bn("focus-visible:tw-ring-ring data-[pressed]:tw-bg-accent data-[pressed]:tw-text-accent-foreground tw-inline-flex tw-items-center tw-justify-center tw-rounded-md tw-text-sm tw-font-medium tw-transition-colors hover:tw-bg-muted hover:tw-text-muted-foreground focus-visible:tw-outline-none focus-visible:tw-ring disabled:tw-pointer-events-none disabled:tw-opacity-50", { variants: { variant: { default: "tw-bg-transparent", outline: "tw-border-input hover:tw-bg-accent hover:tw-text-accent-foreground tw-border tw-bg-transparent tw-shadow-sm" }, size: { default: "tw-h-9 tw-px-3", sm: "tw-h-8 tw-px-2", lg: "tw-h-10 tw-px-3" } }, defaultVariants: { variant: "default", size: "default" } }), ob = (t) => {
  let [e, n] = K(t, ["class", "variant", "size", "options", "value", "onChange"]), r = (i) => {
    e.onChange(i);
  };
  return (() => {
    var i = ib();
    return k(i, d(xe, { get each() {
      return e.options;
    }, children: (s, o) => d(rb, D({ get title() {
      return s.title;
    }, onClick: () => r(s.value), get pressed() {
      return e.value === s.value;
    }, get class() {
      return G(sb({ variant: e.variant, size: e.size }), o() === 0 && "tw-rounded-r-none", o() === e.options.length - 1 && "tw-rounded-l-none", o() !== 0 && o() !== e.options.length - 1 && "tw-rounded-none tw-border-l-0 tw-border-r-0", e.class);
    } }, n, { get children() {
      return s.label();
    } })) })), i;
  })();
}, ab = /* @__PURE__ */ L("<svg stroke-width=0>");
function ve(t, e) {
  const n = D(t.a, e), [r, i] = K(n, ["src"]), [s, o] = N(""), a = J(() => e.title ? `${t.c}<title>${e.title}</title>` : t.c);
  return Z(() => o(a())), me(() => {
    o("");
  }), (() => {
    var l = ab();
    return nt(l, D({
      get stroke() {
        var c;
        return (c = t.a) == null ? void 0 : c.stroke;
      },
      get color() {
        return e.color || "currentColor";
      },
      get fill() {
        return e.color || "currentColor";
      },
      get style() {
        return {
          ...e.style,
          overflow: "visible"
        };
      }
    }, i, {
      get height() {
        return e.size || "1em";
      },
      get width() {
        return e.size || "1em";
      },
      xmlns: "http://www.w3.org/2000/svg",
      get innerHTML() {
        return s();
      }
    }), !0, !0), k(l, () => Df), l;
  })();
}
function sd(t) {
  return ve({
    a: { xmlns: "http://www.w3.org/2000/svg", class: "icon icon-tabler icon-tabler-alert-hexagon", width: "24", height: "24", viewBox: "0 0 24 24", "stroke-width": "2", stroke: "currentColor", fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" },
    c: '<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19.875 6.27c.7 .398 1.13 1.143 1.125 1.948v7.284c0 .809 -.443 1.555 -1.158 1.948l-6.75 4.27a2.269 2.269 0 0 1 -2.184 0l-6.75 -4.27a2.225 2.225 0 0 1 -1.158 -1.948v-7.285c0 -.809 .443 -1.554 1.158 -1.947l6.75 -3.98a2.33 2.33 0 0 1 2.25 0l6.75 3.98h-.033z"/><path d="M12 8v4"/><path d="M12 16h.01"/>'
  }, t);
}
function lb(t) {
  return ve({
    a: { xmlns: "http://www.w3.org/2000/svg", class: "icon icon-tabler icon-tabler-arrow-left", width: "24", height: "24", viewBox: "0 0 24 24", "stroke-width": "2", stroke: "currentColor", fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" },
    c: '<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l14 0"/><path d="M5 12l6 6"/><path d="M5 12l6 -6"/>'
  }, t);
}
function cb(t) {
  return ve({
    a: { xmlns: "http://www.w3.org/2000/svg", class: "icon icon-tabler icon-tabler-arrow-right", width: "24", height: "24", viewBox: "0 0 24 24", "stroke-width": "2", stroke: "currentColor", fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" },
    c: '<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l14 0"/><path d="M13 18l6 -6"/><path d="M13 6l6 6"/>'
  }, t);
}
function ub(t) {
  return ve({
    a: { xmlns: "http://www.w3.org/2000/svg", class: "icon icon-tabler icon-tabler-calendar", width: "24", height: "24", viewBox: "0 0 24 24", "stroke-width": "2", stroke: "currentColor", fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" },
    c: '<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z"/><path d="M16 3v4"/><path d="M8 3v4"/><path d="M4 11h16"/><path d="M11 15h1"/><path d="M12 15v3"/>'
  }, t);
}
function od(t) {
  return ve({
    a: { xmlns: "http://www.w3.org/2000/svg", class: "icon icon-tabler icon-tabler-check", width: "24", height: "24", viewBox: "0 0 24 24", "stroke-width": "2", stroke: "currentColor", fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" },
    c: '<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l5 5l10 -10"/>'
  }, t);
}
function ad(t) {
  return ve({
    a: { xmlns: "http://www.w3.org/2000/svg", class: "icon icon-tabler icon-tabler-chevron-down", width: "24", height: "24", viewBox: "0 0 24 24", "stroke-width": "2", stroke: "currentColor", fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" },
    c: '<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 9l6 6l6 -6"/>'
  }, t);
}
function ea(t) {
  return ve({
    a: { xmlns: "http://www.w3.org/2000/svg", class: "icon icon-tabler icon-tabler-chevron-left", width: "24", height: "24", viewBox: "0 0 24 24", "stroke-width": "2", stroke: "currentColor", fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" },
    c: '<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 6l-6 6l6 6"/>'
  }, t);
}
function hs(t) {
  return ve({
    a: { xmlns: "http://www.w3.org/2000/svg", class: "icon icon-tabler icon-tabler-chevron-right", width: "24", height: "24", viewBox: "0 0 24 24", "stroke-width": "2", stroke: "currentColor", fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" },
    c: '<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 6l6 6l-6 6"/>'
  }, t);
}
function db(t) {
  return ve({
    a: { xmlns: "http://www.w3.org/2000/svg", class: "icon icon-tabler icon-tabler-chevron-up", width: "24", height: "24", viewBox: "0 0 24 24", "stroke-width": "2", stroke: "currentColor", fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" },
    c: '<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 15l6 -6l6 6"/>'
  }, t);
}
function fb(t) {
  return ve({
    a: { xmlns: "http://www.w3.org/2000/svg", class: "icon icon-tabler icon-tabler-chevrons-left", width: "24", height: "24", viewBox: "0 0 24 24", "stroke-width": "2", stroke: "currentColor", fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" },
    c: '<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M11 7l-5 5l5 5"/><path d="M17 7l-5 5l5 5"/>'
  }, t);
}
function hb(t) {
  return ve({
    a: { xmlns: "http://www.w3.org/2000/svg", class: "icon icon-tabler icon-tabler-chevrons-right", width: "24", height: "24", viewBox: "0 0 24 24", "stroke-width": "2", stroke: "currentColor", fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" },
    c: '<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 7l5 5l-5 5"/><path d="M13 7l5 5l-5 5"/>'
  }, t);
}
function gb(t) {
  return ve({
    a: { xmlns: "http://www.w3.org/2000/svg", class: "icon icon-tabler icon-tabler-clock-record", width: "24", height: "24", viewBox: "0 0 24 24", "stroke-width": "2", stroke: "currentColor", fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" },
    c: '<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M21 12.3a9 9 0 1 0 -8.683 8.694"/><path d="M12 7v5l2 2"/><path d="M19 19m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/>'
  }, t);
}
function mb(t) {
  return ve({
    a: { xmlns: "http://www.w3.org/2000/svg", class: "icon icon-tabler icon-tabler-device-floppy", width: "24", height: "24", viewBox: "0 0 24 24", "stroke-width": "2", stroke: "currentColor", fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" },
    c: '<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2"/><path d="M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M14 4l0 4l-6 0l0 -4"/>'
  }, t);
}
function ld(t) {
  return ve({
    a: { xmlns: "http://www.w3.org/2000/svg", class: "icon icon-tabler icon-tabler-discount-check", width: "24", height: "24", viewBox: "0 0 24 24", "stroke-width": "2", stroke: "currentColor", fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" },
    c: '<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 7.2a2.2 2.2 0 0 1 2.2 -2.2h1a2.2 2.2 0 0 0 1.55 -.64l.7 -.7a2.2 2.2 0 0 1 3.12 0l.7 .7c.412 .41 .97 .64 1.55 .64h1a2.2 2.2 0 0 1 2.2 2.2v1c0 .58 .23 1.138 .64 1.55l.7 .7a2.2 2.2 0 0 1 0 3.12l-.7 .7a2.2 2.2 0 0 0 -.64 1.55v1a2.2 2.2 0 0 1 -2.2 2.2h-1a2.2 2.2 0 0 0 -1.55 .64l-.7 .7a2.2 2.2 0 0 1 -3.12 0l-.7 -.7a2.2 2.2 0 0 0 -1.55 -.64h-1a2.2 2.2 0 0 1 -2.2 -2.2v-1a2.2 2.2 0 0 0 -.64 -1.55l-.7 -.7a2.2 2.2 0 0 1 0 -3.12l.7 -.7a2.2 2.2 0 0 0 .64 -1.55v-1"/><path d="M9 12l2 2l4 -4"/>'
  }, t);
}
function wb(t) {
  return ve({
    a: { xmlns: "http://www.w3.org/2000/svg", class: "icon icon-tabler icon-tabler-dots-vertical", width: "24", height: "24", viewBox: "0 0 24 24", "stroke-width": "2", stroke: "currentColor", fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" },
    c: '<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/><path d="M12 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/><path d="M12 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/>'
  }, t);
}
function pb(t) {
  return ve({
    a: { xmlns: "http://www.w3.org/2000/svg", class: "icon icon-tabler icon-tabler-eye", width: "24", height: "24", viewBox: "0 0 24 24", "stroke-width": "2", stroke: "currentColor", fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" },
    c: '<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"/><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6"/>'
  }, t);
}
function vb(t) {
  return ve({
    a: { xmlns: "http://www.w3.org/2000/svg", class: "icon icon-tabler icon-tabler-file-analytics", width: "24", height: "24", viewBox: "0 0 24 24", "stroke-width": "2", stroke: "currentColor", fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" },
    c: '<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"/><path d="M9 17l0 -5"/><path d="M12 17l0 -1"/><path d="M15 17l0 -3"/>'
  }, t);
}
function bb(t) {
  return ve({
    a: { xmlns: "http://www.w3.org/2000/svg", class: "icon icon-tabler icon-tabler-file-check", width: "24", height: "24", viewBox: "0 0 24 24", "stroke-width": "2", stroke: "currentColor", fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" },
    c: '<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"/><path d="M9 15l2 2l4 -4"/>'
  }, t);
}
function yb(t) {
  return ve({
    a: { xmlns: "http://www.w3.org/2000/svg", class: "icon icon-tabler icon-tabler-file-delta", width: "24", height: "24", viewBox: "0 0 24 24", "stroke-width": "2", stroke: "currentColor", fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" },
    c: '<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"/><path d="M9 17h6l-3 -6z"/>'
  }, t);
}
function xb(t) {
  return ve({
    a: { xmlns: "http://www.w3.org/2000/svg", class: "icon icon-tabler icon-tabler-file-description", width: "24", height: "24", viewBox: "0 0 24 24", "stroke-width": "2", stroke: "currentColor", fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" },
    c: '<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"/><path d="M9 17h6"/><path d="M9 13h6"/>'
  }, t);
}
function kb(t) {
  return ve({
    a: { xmlns: "http://www.w3.org/2000/svg", class: "icon icon-tabler icon-tabler-file-upload", width: "24", height: "24", viewBox: "0 0 24 24", "stroke-width": "2", stroke: "currentColor", fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" },
    c: '<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"/><path d="M12 11v6"/><path d="M9.5 13.5l2.5 -2.5l2.5 2.5"/>'
  }, t);
}
function Cb(t) {
  return ve({
    a: { xmlns: "http://www.w3.org/2000/svg", class: "icon icon-tabler icon-tabler-file", width: "24", height: "24", viewBox: "0 0 24 24", "stroke-width": "2", stroke: "currentColor", fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" },
    c: '<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"/>'
  }, t);
}
function _b(t) {
  return ve({
    a: { xmlns: "http://www.w3.org/2000/svg", class: "icon icon-tabler icon-tabler-info-circle", width: "24", height: "24", viewBox: "0 0 24 24", "stroke-width": "2", stroke: "currentColor", fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" },
    c: '<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"/><path d="M12 9h.01"/><path d="M11 12h1v4h1"/>'
  }, t);
}
function Sb(t) {
  return ve({
    a: { xmlns: "http://www.w3.org/2000/svg", class: "icon icon-tabler icon-tabler-map-pin-check", width: "24", height: "24", viewBox: "0 0 24 24", "stroke-width": "2", stroke: "currentColor", fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" },
    c: '<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"/><path d="M11.87 21.48a1.992 1.992 0 0 1 -1.283 -.58l-4.244 -4.243a8 8 0 1 1 13.355 -3.474"/><path d="M15 19l2 2l4 -4"/>'
  }, t);
}
function Mb(t) {
  return ve({
    a: { xmlns: "http://www.w3.org/2000/svg", class: "icon icon-tabler icon-tabler-menu-2", width: "24", height: "24", viewBox: "0 0 24 24", "stroke-width": "2", stroke: "currentColor", fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" },
    c: '<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 6l16 0"/><path d="M4 12l16 0"/><path d="M4 18l16 0"/>'
  }, t);
}
function Ob(t) {
  return ve({
    a: { xmlns: "http://www.w3.org/2000/svg", class: "icon icon-tabler icon-tabler-message", width: "24", height: "24", viewBox: "0 0 24 24", "stroke-width": "2", stroke: "currentColor", fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" },
    c: '<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 9h8"/><path d="M8 13h6"/><path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z"/>'
  }, t);
}
function Eb(t) {
  return ve({
    a: { xmlns: "http://www.w3.org/2000/svg", class: "icon icon-tabler icon-tabler-moon", width: "24", height: "24", viewBox: "0 0 24 24", "stroke-width": "2", stroke: "currentColor", fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" },
    c: '<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z"/>'
  }, t);
}
function Ib(t) {
  return ve({
    a: { xmlns: "http://www.w3.org/2000/svg", class: "icon icon-tabler icon-tabler-notebook", width: "24", height: "24", viewBox: "0 0 24 24", "stroke-width": "2", stroke: "currentColor", fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" },
    c: '<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-11a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1m3 0v18"/><path d="M13 8l2 0"/><path d="M13 12l2 0"/>'
  }, t);
}
function cd(t) {
  return ve({
    a: { xmlns: "http://www.w3.org/2000/svg", class: "icon icon-tabler icon-tabler-plus", width: "24", height: "24", viewBox: "0 0 24 24", "stroke-width": "2", stroke: "currentColor", fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" },
    c: '<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 5l0 14"/><path d="M5 12l14 0"/>'
  }, t);
}
function Pb(t) {
  return ve({
    a: { xmlns: "http://www.w3.org/2000/svg", class: "icon icon-tabler icon-tabler-pointer", width: "24", height: "24", viewBox: "0 0 24 24", "stroke-width": "2", stroke: "currentColor", fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" },
    c: '<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7.904 17.563a1.2 1.2 0 0 0 2.228 .308l2.09 -3.093l4.907 4.907a1.067 1.067 0 0 0 1.509 0l1.047 -1.047a1.067 1.067 0 0 0 0 -1.509l-4.907 -4.907l3.113 -2.09a1.2 1.2 0 0 0 -.309 -2.228l-13.582 -3.904l3.904 13.563z"/>'
  }, t);
}
function Db(t) {
  return ve({
    a: { xmlns: "http://www.w3.org/2000/svg", class: "icon icon-tabler icon-tabler-progress", width: "24", height: "24", viewBox: "0 0 24 24", "stroke-width": "2", stroke: "currentColor", fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" },
    c: '<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 20.777a8.942 8.942 0 0 1 -2.48 -.969"/><path d="M14 3.223a9.003 9.003 0 0 1 0 17.554"/><path d="M4.579 17.093a8.961 8.961 0 0 1 -1.227 -2.592"/><path d="M3.124 10.5c.16 -.95 .468 -1.85 .9 -2.675l.169 -.305"/><path d="M6.907 4.579a8.954 8.954 0 0 1 3.093 -1.356"/>'
  }, t);
}
function $b(t) {
  return ve({
    a: { xmlns: "http://www.w3.org/2000/svg", class: "icon icon-tabler icon-tabler-reload", width: "24", height: "24", viewBox: "0 0 24 24", "stroke-width": "2", stroke: "currentColor", fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" },
    c: '<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747"/><path d="M20 4v5h-5"/>'
  }, t);
}
function ud(t) {
  return ve({
    a: { xmlns: "http://www.w3.org/2000/svg", class: "icon icon-tabler icon-tabler-send", width: "24", height: "24", viewBox: "0 0 24 24", "stroke-width": "2", stroke: "currentColor", fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" },
    c: '<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 14l11 -11"/><path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5"/>'
  }, t);
}
function Tb(t) {
  return ve({
    a: { xmlns: "http://www.w3.org/2000/svg", class: "icon icon-tabler icon-tabler-settings", width: "24", height: "24", viewBox: "0 0 24 24", "stroke-width": "2", stroke: "currentColor", fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" },
    c: '<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"/><path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"/>'
  }, t);
}
function Ab(t) {
  return ve({
    a: { xmlns: "http://www.w3.org/2000/svg", class: "icon icon-tabler icon-tabler-star", width: "24", height: "24", viewBox: "0 0 24 24", "stroke-width": "2", stroke: "currentColor", fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" },
    c: '<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"/>'
  }, t);
}
function Lb(t) {
  return ve({
    a: { xmlns: "http://www.w3.org/2000/svg", class: "icon icon-tabler icon-tabler-sun", width: "24", height: "24", viewBox: "0 0 24 24", "stroke-width": "2", stroke: "currentColor", fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" },
    c: '<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"/><path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7"/>'
  }, t);
}
function Ns(t) {
  return ve({
    a: { xmlns: "http://www.w3.org/2000/svg", class: "icon icon-tabler icon-tabler-text-size", width: "24", height: "24", viewBox: "0 0 24 24", "stroke-width": "2", stroke: "currentColor", fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" },
    c: '<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 7v-2h13v2"/><path d="M10 5v14"/><path d="M12 19h-4"/><path d="M15 13v-1h6v1"/><path d="M18 12v7"/><path d="M17 19h2"/>'
  }, t);
}
function yn(t) {
  return ve({
    a: { xmlns: "http://www.w3.org/2000/svg", class: "icon icon-tabler icon-tabler-x", width: "24", height: "24", viewBox: "0 0 24 24", "stroke-width": "2", stroke: "currentColor", fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" },
    c: '<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12"/><path d="M6 6l12 12"/>'
  }, t);
}
var Fb = L("<span class=tw-sr-only>Close"), ta = L("<div>"), zb = L('<div class="tw-absolute tw-inset-0 tw-z-50 tw-flex tw-items-center tw-justify-center">'), Rb = Uw, Vb = (t) => {
  let [e, n] = K(t, ["class"]);
  return d(Ww, D({ get class() {
    return G("tw-absolute tw-inset-0 tw-z-50 tw-bg-background/80 tw-backdrop-blur-sm data-[expanded]:tw-animate-in data-[closed]:tw-animate-out data-[closed]:tw-fade-out-0 data-[expanded]:tw-fade-in-0", e.class);
  } }, n));
}, Nb = (t) => {
  let [e, n] = K(t, ["class", "children"]);
  return d(Hw, { get mount() {
    return document.getElementById("fasih-form");
  }, get children() {
    return [d(Vb, {}), (() => {
      var r = zb();
      return k(r, d(Bw, D({ class: "tw-absolute tw-left-[50%] tw-top-[50%] tw-z-50 tw-flex tw-max-h-svh tw-w-full tw-max-w-lg tw-translate-x-[-50%] tw-translate-y-[-50%] tw-gap-4 tw-py-10 data-[expanded]:tw-animate-in data-[closed]:tw-animate-out data-[closed]:tw-fade-out-0 data-[expanded]:tw-fade-in-0 data-[closed]:tw-zoom-out-95 data-[expanded]:tw-zoom-in-95 data-[closed]:tw-slide-out-to-left-1/2 data-[closed]:tw-slide-out-to-top-[48%] data-[expanded]:tw-slide-in-from-left-1/2 data-[expanded]:tw-slide-in-from-top-[48%]" }, n, { get children() {
        var i = ta();
        return k(i, () => e.children, null), k(i, d($w, { class: "tw-absolute tw-right-4 tw-top-4 tw-rounded-sm tw-opacity-70 tw-ring-offset-background tw-transition-opacity hover:tw-opacity-100 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-primary focus:tw-ring-offset-2 disabled:tw-pointer-events-none", get children() {
          return [d(yn, { class: "tw-size-4" }), Fb()];
        } }), null), oe(() => De(i, G("tw-relative tw-flex tw-w-full tw-flex-col tw-gap-4 tw-overflow-auto tw-border tw-bg-background tw-p-6 tw-pt-4 tw-shadow-lg tw-duration-200 sm:tw-rounded-lg", e.class))), i;
      } }))), r;
    })()];
  } });
}, Kb = (t) => {
  let [e, n] = K(t, ["class"]);
  return d(qw, D({ get class() {
    return G("tw-text-lg tw-font-semibold tw-text-foreground", e.class);
  } }, n));
}, Bb = (t) => {
  let [e, n] = K(t, ["class"]);
  return d(jw, D({ get class() {
    return G("tw-text-sm tw-text-muted-foreground", e.class);
  } }, n));
}, jb = (t) => {
  let [e, n] = K(t, ["class"]);
  return (() => {
    var r = ta();
    return nt(r, D({ get class() {
      return G("tw-flex tw-flex-col tw-space-y-2 tw-text-center sm:tw-text-left", e.class);
    } }, n), !1, !1), r;
  })();
}, Wb = (t) => {
  let [e, n] = K(t, ["class"]);
  return (() => {
    var r = ta();
    return nt(r, D({ get class() {
      return G("tw-flex tw-flex-col-reverse sm:tw-flex-row sm:tw-justify-end sm:tw-space-x-2", e.class);
    } }, n), !1, !1), r;
  })();
}, Hb = bn("tw-inline-flex tw-items-center tw-justify-center tw-rounded-md tw-text-sm tw-font-medium tw-transition-colors focus-visible:tw-outline-none focus-visible:tw-ring-1 focus-visible:tw-ring-primary disabled:tw-pointer-events-none disabled:tw-opacity-50", { variants: { variant: { default: "hover:tw-bg-primary-400 tw-bg-primary tw-text-primary-foreground tw-shadow", destructive: "tw-bg-destructive tw-text-destructive-foreground tw-shadow-sm hover:tw-bg-destructive/90", outline: "tw-border tw-border-primary tw-bg-background tw-text-primary tw-shadow-sm hover:tw-bg-primary hover:tw-text-primary-foreground", ghost: "hover:tw-bg-primary/10", link: "tw-text-primary tw-underline-offset-4 hover:tw-underline", loading: "tw-bg-primary/80 tw-text-primary-foreground tw-shadow" }, size: { default: "tw-h-9 tw-px-4 tw-py-2", sm: "tw-h-8 tw-rounded-md tw-px-3 tw-text-xs", lg: "tw-h-10 tw-rounded-md tw-px-8", icon: "tw-size-9" }, loading: { default: "" } }, defaultVariants: { variant: "default", size: "default" } }), re = (t) => {
  let [e, n] = K(t, ["class", "variant", "size"]);
  return d(ur, D({ get disabled() {
    return e.variant === "loading" || t.disabled;
  }, get class() {
    return G(Hb({ size: e.size, variant: e.variant }), e.class);
  } }, n, { get children() {
    return d(te, { get when() {
      return e.variant === "loading";
    }, get fallback() {
      return t.children;
    }, get children() {
      return d(Db, { class: "tw-size-5 tw-animate-spin" });
    } });
  } }));
}, Ub = L('<div class="tw-flex tw-flex-col tw-overflow-auto">'), dd = Fe(), ht = () => {
  let t = Ne(dd);
  if (!t)
    throw new Error("Modal Context not found");
  return t;
}, qb = (t) => {
  let [e] = K(t, ["children"]), [n, r] = N(), [i, s] = N(), [o, a] = N(!1), l = (h) => {
    s([...i() || [], h]), r(h), a(!0);
  }, c = (h) => {
    var m, w;
    h.type = "CONFIRM_MODAL", h.labels ?? (h.labels = {}), h.labels.cancel = h.labels.cancel || ((m = t.label) == null ? void 0 : m.cancel) || "Cancel", h.labels.confirm = h.labels.confirm || ((w = t.label) == null ? void 0 : w.confirm) || "Confirm", h.onCancel = h.onCancel || (() => u()), s([...i() || [], h]), r(h), a(!0);
  }, u = () => {
    let h = i();
    return !h || h.length <= 1 ? f() : (h.pop(), s(h), r(h[h.length - 1]));
  }, f = () => {
    s([]), r(void 0), a(!1);
  };
  return d(dd.Provider, { value: { open: l, close: u, closeAll: f, openConfirmModal: c }, get children() {
    return [J(() => e.children), d(Rb, { get open() {
      return o();
    }, onOpenChange: u, get children() {
      return d(Nb, { get children() {
        return [d(jb, { get children() {
          return [d(Kb, { get children() {
            var h;
            return (h = n()) == null ? void 0 : h.title;
          } }), d(te, { get when() {
            var h;
            return (h = n()) == null ? void 0 : h.description;
          }, get children() {
            return d(Bb, { class: "tw-pb-4", get children() {
              var h;
              return (h = n()) == null ? void 0 : h.description;
            } });
          } })];
        } }), (() => {
          var h = Ub();
          return k(h, () => {
            var m;
            return (m = n()) == null ? void 0 : m.children();
          }), h;
        })(), d(te, { get when() {
          var h;
          return ((h = n()) == null ? void 0 : h.type) === "CONFIRM_MODAL";
        }, get children() {
          return d(Wb, { class: "tw-gap-1", get children() {
            return [d(re, { variant: "outline", get onClick() {
              var h;
              return (h = n()) == null ? void 0 : h.onCancel;
            }, get children() {
              var h, m;
              return (m = (h = n()) == null ? void 0 : h.labels) == null ? void 0 : m.cancel;
            } }), d(re, { get onClick() {
              var h;
              return (h = n()) == null ? void 0 : h.onConfirm;
            }, get children() {
              var h, m;
              return (m = (h = n()) == null ? void 0 : h.labels) == null ? void 0 : m.confirm;
            } })];
          } });
        } })];
      } });
    } })];
  } });
};
L("<span>");
var Gb = fv, Yb = (t) => {
  let e = D({ gutter: 4 }, t);
  return d(gv, e);
}, Xb = (t) => {
  let [e, n] = K(t, ["class"]);
  return d(uv, { get mount() {
    return document.getElementById("fasih-form");
  }, get children() {
    return d(hv, D({ get class() {
      return G("tw-min-w-8rem tw-z-50 tw-overflow-hidden tw-rounded-md tw-border tw-bg-background tw-p-1 tw-text-foreground tw-shadow-md data-[expanded]:tw-animate-in data-[closed]:tw-animate-out data-[closed]:tw-fade-out-0 data-[expanded]:tw-fade-in-0 data-[closed]:tw-zoom-out-95 data-[expanded]:tw-zoom-in-95", e.class);
    } }, n));
  } });
}, Qb = (t) => {
  let [e, n] = K(t, ["class", "inset"]);
  return d(cv, D({ get class() {
    return G("focus:tw-bg-primary/10 focus:tw-text-foreground tw-relative tw-flex tw-cursor-default tw-select-none tw-items-center tw-rounded-sm tw-px-2 tw-py-1.5 tw-text-sm tw-outline-none tw-transition-colors data-[disabled]:tw-pointer-events-none data-[disabled]:tw-opacity-50", e.inset && "tw-pl-8", e.class);
  } }, n));
}, Jb = L("<div><input type=file>"), Zb = (t, e) => {
  let n = e.trim().toLowerCase();
  return n.endsWith("/*") ? t.replace(/\/.*$/, "") === n.replace(/\/.*$/, "") : t === n;
}, ey = (t, e) => {
  if (!t || !e)
    return !0;
  let n = Array.isArray(e) ? e : e.split(","), r = t.name || "", i = (t.type || "").toLowerCase(), s = i.replace(/\/.*$/, "");
  return n.some((o) => {
    let a = o.trim().toLowerCase();
    return a.charAt(0) === "." ? r.toLowerCase().endsWith(a) : a.endsWith("/*") ? s === a.replace(/\/.*$/, "") : i === a;
  });
};
function ty(t, e) {
  return t.type === "application/x-moz-file" || ey(t, e);
}
var ny = { maxFiles: 1, disabled: !1 }, na = (t) => {
  let e = D(ny, t), [n] = K(e, ["class"]), [r, i] = N(), [s, o] = N(), [a, l] = N([]), [c, u] = N(!1), [f, h] = N(), m = (C) => {
    var _;
    if (!e.disabled) {
      for (let E of C)
        a().length !== e.maxFiles && E && (e.accept && !ty(E, e.accept) || l([...a(), E]));
      (_ = e.setFiles) == null || _.call(e, a());
    }
  }, w = (C) => {
    C.preventDefault(), C.stopPropagation(), m(C.target.files || []);
  }, g = (C) => {
    var _;
    e.disabled || (C.preventDefault(), C.stopPropagation(), m(((_ = C.dataTransfer) == null ? void 0 : _.files) || []), h(void 0), u(!1));
  }, p = (C) => {
    var E;
    if (e.disabled)
      return;
    C.preventDefault(), C.stopPropagation();
    let _ = [];
    for (let F of ((E = C.dataTransfer) == null ? void 0 : E.items) || []) {
      if (F.kind !== "file")
        continue;
      let T = e.accept !== void 0 ? F && Zb(F.type, e.accept) : !0;
      _.push(T);
    }
    h(e.accept ? _.every((F) => F === !0) : void 0), u(!0);
  }, v = () => {
    h(void 0), u(!1);
  }, b = () => {
    var C;
    if (!e.disabled)
      return e.onOpenFileBrowser ? e.onOpenFileBrowser({ accept: e.accept, maxFiles: e.maxFiles, disabled: e.disabled, defaultAction: () => {
        var _;
        return (_ = s()) == null ? void 0 : _.click();
      } }) : (C = s()) == null ? void 0 : C.click();
  };
  return Z(() => l(e.files || [])), Z(() => {
    var C, _, E, F;
    (C = r()) == null || C.addEventListener("drop", g), (_ = r()) == null || _.addEventListener("dragover", p), (E = r()) == null || E.addEventListener("dragenter", p), (F = r()) == null || F.addEventListener("dragleave", v), me(() => {
      var T, x, y, z;
      (T = r()) == null || T.removeEventListener("drop", g), (x = r()) == null || x.removeEventListener("dragover", p), (y = r()) == null || y.removeEventListener("dragenter", p), (z = r()) == null || z.removeEventListener("dragleave", v);
    });
  }), (() => {
    var C = Jb(), _ = C.firstChild;
    return vt(i, C), nt(C, n, !1, !0), k(C, () => e.children({ disabled: e.disabled, isAccepted: f, isDragActive: c, openFileBrowser: b }), _), _.addEventListener("change", w), vt(o, _), _.style.setProperty("display", "none"), oe((E) => {
      var F = e.accept, T = e.disabled, x = e.maxFiles > 1;
      return F !== E.e && Xe(_, "accept", E.e = F), T !== E.t && (_.disabled = E.t = T), x !== E.a && (_.multiple = E.a = x), E;
    }, { e: void 0, t: void 0, a: void 0 }), C;
  })();
}, Tr = (t = "en-US") => {
  var e;
  return ((e = new Intl.NumberFormat(t).formatToParts(1.1).find((n) => n.type === "decimal")) == null ? void 0 : e.value) || ".";
}, fd = (t) => (typeof t == "number" || !Number.isNaN(Number(t))) && !Number.isNaN(t), Ks = (t, e = "en-US", n = {}) => {
  if (t === "")
    return;
  let r = new Intl.NumberFormat(e, { ...n }), i = t.replace(new RegExp(`\\${r.format(1e3).charAt(1)}`, "g"), "").replace(Tr(e), ".");
  return Number(i);
}, Bs = (t, e = "en-US", n = {}) => t === void 0 || t === "" || !fd(t) ? "" : new Intl.NumberFormat(e, { ...n }).format(Number(t)), ry = (t, e) => Array.from({ length: e - t + 1 }, (n, r) => t + r), iy = (t, e) => {
  let n;
  if (typeof e != "function")
    throw new TypeError("Expected a function");
  let r = parseInt(t, 10);
  return t = isNaN(r) ? 0 : r, function(...i) {
    return --t > 0 && (n = e == null ? void 0 : e.apply(this, i)), t <= 1 && (e = void 0), n;
  };
}, hd = (t) => iy(2, t), hn = (t) => typeof t > "u" ? [] : t.map((e) => typeof e == "object" ? { ...e } : e), sy = (t, e, n) => t && t.slice(0, n) + e + t.slice(n), oy = L('<div class="tw-select-none tw-border-r tw-border-border tw-px-2">'), ay = L('<div class="tw-select-none tw-border-l tw-border-border tw-px-2">'), ly = L('<div><div class="tw-flex tw-flex-col">'), cy = { step: 1, startValue: 0, decimalScale: 0, fixedDecimalScale: !1, locale: "en-US" }, uy = bn("tw-items tw-flex tw-h-9 tw-w-full tw-flex-row tw-items-center tw-gap-2 tw-rounded-md tw-text-sm", { variants: { variant: { default: "tw-rounded-md tw-border tw-border-border tw-bg-background tw-shadow-sm tw-transition-colors focus-within:tw-outline-none focus-within:tw-ring-1 focus-within:tw-ring-primary disabled:tw-cursor-not-allowed disabled:tw-opacity-50", ghost: "tw-border-none focus-visible:tw-outline-none disabled:tw-cursor-not-allowed disabled:tw-opacity-50" } }, defaultVariants: { variant: "default" } }), gs = (t) => {
  let e = D(cy, t), [n, r] = N(), [i, s] = K(e, ["min", "max", "step", "value", "class", "locale", "prefix", "suffix", "variant", "onChange", "readOnly", "startValue", "decimalScale", "fixedDecimalScale"]), o = (m) => m === "" || m === void 0 ? m : Bs(m, i.locale, { maximumFractionDigits: i.decimalScale }), a = (m) => {
    var w;
    (w = i.onChange) == null || w.call(i, m), r(m);
  }, l = (m) => {
    let w = (i == null ? void 0 : i.step) ?? 1, g = Number(i.value ?? 0) + (m === "increment" ? w : -w);
    a(g);
  }, c = (m) => {
    var b;
    let w = i.decimalScale || 0, g = Tr(i.locale), p = ((b = m.currentTarget.value.split(g)[1]) == null ? void 0 : b.length) || 0, v = p < w ? p : 0;
    return { maximumFractionDigits: w, minimumFractionDigits: v };
  }, u = (m) => {
    let w = Tr(i.locale), g = m.data === w && !m.currentTarget.value.includes(w), p = m.currentTarget.selectionStart || 0;
    if (g) {
      m.preventDefault(), m.currentTarget.value = sy(m.currentTarget.value, w, p);
      let v = p + 1;
      m.currentTarget.setSelectionRange(v, v);
    }
  }, f = (m) => {
    let w = m.data === "-", g = m.currentTarget.selectionStart === 0;
    w && !g && m.preventDefault();
  }, h = (m) => {
    let w = m.data === Tr(i.locale), g = m.data === "-";
    isNaN(Number(m.data)) && !w && !g && m.preventDefault();
  };
  return d(Zo, { get lang() {
    return i.locale;
  }, get children() {
    var m = ly(), w = m.firstChild;
    return k(m, d(te, { get when() {
      return i.prefix;
    }, get children() {
      var g = oy();
      return k(g, () => i.prefix), g;
    } }), w), k(m, d(Jo, D({ type: "text", get min() {
      return i.min;
    }, get max() {
      return i.max;
    }, inputMode: "decimal", get disabled() {
      return t.disabled;
    }, get readOnly() {
      return t.readOnly;
    }, get value() {
      return o(i.value);
    }, class: "tw-flex-1 tw-bg-transparent tw-pl-2 placeholder:tw-text-muted-foreground focus-visible:tw-outline-none disabled:tw-opacity-50", onChange: (g) => a(Ks(g.target.value, i.locale)), onInput: (g) => {
      let p = g.currentTarget.value, v = p.slice(-1);
      if (p === "")
        return;
      let b = Tr(i.locale), C = c(g), _ = Bs(Ks(p, i.locale, C), i.locale, C), E = Bs(n(), i.locale, C), F = p === "-" || v === b, T = Math.max(g.currentTarget.selectionEnd || 0, g.currentTarget.selectionStart || 0);
      F || (g.currentTarget.value = _);
      let x = _.length - E.length;
      E.length && _.length && (T += x + (x > 0 ? -1 : 1));
      let y = Math.max(0, Math.min(T, _.length));
      F && y++, g.currentTarget.setSelectionRange(y, y), r(Ks(p, i.locale, C));
    }, onKeyDown: (g) => {
      i.readOnly || ((g.key === "ArrowUp" || g.key === "ArrowDown") && (g.preventDefault(), l(g.key === "ArrowUp" ? "increment" : "decrement")), g.currentTarget.focus());
    }, onBeforeInput: (g) => {
      g.data && (f(g), u(g), h(g));
    } }, s)), w), k(m, d(te, { get when() {
      return i.suffix;
    }, get children() {
      var g = ay();
      return k(g, () => i.suffix), g;
    } }), w), k(w, d(re, { variant: "outline", get disabled() {
      return t.disabled || t.readOnly;
    }, onClick: () => l("increment"), class: "tw-size-4 tw-rounded-none tw-rounded-tr-md tw-border-r-0 tw-border-t-0 tw-border-border", get children() {
      return d(db, {});
    } }), null), k(w, d(re, { variant: "outline", onClick: () => l("decrement"), get disabled() {
      return t.disabled || t.readOnly;
    }, class: "tw-size-4 tw-rounded-none tw-rounded-br-md tw-border-y-0 tw-border-r-0 tw-border-border", get children() {
      return d(ad, {});
    } }), null), oe(() => De(m, G(uy({ variant: i.variant }), i.class))), m;
  } });
}, dy = Cv, gd = Sv, md = Mv, wd = bv, pd = (t) => {
  let [e, n] = K(t, ["class", "children"]);
  return d(yv, D({ as: "button", role: "radio", get class() {
    return G("tw- tw-flex tw-aspect-square tw-size-4 tw-cursor-pointer tw-items-center tw-justify-center tw-rounded-full tw-border tw-border-primary tw-text-primary tw-shadow focus:tw-outline-none focus-visible:tw-ring focus-visible:tw-ring-primary data-[disabled]:tw-cursor-not-allowed data-[checked]:tw-bg-primary data-[disabled]:tw-opacity-75", e.class);
  } }, n, { get children() {
    return [J(() => e.children), d(xv, { class: "tw-size-2 tw-rounded-full data-[checked]:tw-bg-background" })];
  } }));
}, fy = L('<div class="tw-flex tw-flex-col">'), hy = (t) => {
  let [, e] = K(t, ["class"]);
  return d(Fv, D({ get class() {
    return G("tw-relative tw-flex tw-w-full tw-touch-none tw-select-none tw-flex-col tw-items-center", t.class);
  } }, e));
}, gy = (t) => {
  let [, e] = K(t, ["class"]);
  return d(zv, D({ get class() {
    return G("tw-relative tw-h-2 tw-w-full tw-grow tw-rounded-full tw-bg-border", t.class);
  } }, e));
}, my = (t) => {
  let [, e] = K(t, ["class"]);
  return d(Ov, D({ get class() {
    return G("tw-absolute tw-h-full tw-bg-primary", t.class);
  } }, e));
}, Cl = (t) => {
  let [, e] = K(t, ["class", "children"]);
  return (() => {
    var n = fy();
    return k(n, d(Ev, D({ get class() {
      return G("tw-top-[-4.5px] tw-block tw-h-4 tw-w-4 tw-rounded-full tw-border-2 tw-border-primary-400 tw-ring-offset-background tw-transition-colors focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-primary focus-visible:tw-ring-offset-2 disabled:tw-pointer-events-none disabled:tw-opacity-50", t.class);
    } }, e, { get children() {
      return [d(Dv, {}), J(() => t.children)];
    } }))), n;
  })();
}, vd = Jw, bd = Qw, yd = Zw, xd = (t) => {
  let [e, n] = K(t, ["class", "children"]);
  return d(Gw, D({ get class() {
    return G("tw-h-4 tw-w-4 tw-shrink-0 tw-cursor-pointer tw-rounded-sm tw-border tw-border-primary tw-shadow focus-visible:tw-outline-none focus-visible:tw-ring focus-visible:tw-ring-primary data-[disabled]:tw-cursor-not-allowed data-[checked]:tw-bg-primary data-[checked]:tw-text-primary-foreground data-[disabled]:tw-opacity-75", e.class);
  } }, n, { get children() {
    return d(Yw, { class: "tw-flex tw-items-center tw-justify-center tw-text-current", get children() {
      return d(od, { class: "tw-size-4" });
    } });
  } }));
}, kd = Cw, Cd = (t) => {
  let [e, n] = K(t, ["class"]);
  return d(kw, D({ get class() {
    return G("tw-animate-collapsible-up data-[expanded]:tw-animate-collapsible-down", e.class);
  } }, n));
}, _d = { exports: {} };
(function(t) {
  ((e, n) => {
    t.exports ? t.exports = n() : e.fuzzysort = n();
  })(Te, (e) => {
    var n = (S, M) => {
      if (S == "farzher")
        return { target: "farzher was here (^-^*)/", score: 0, _indexes: [0] };
      if (!S || !M)
        return O;
      var P = u(S);
      x(M) || (M = c(M));
      var B = P.bitflags;
      return (B & M._bitflags) !== B ? O : h(P, M);
    }, r = (S, M, P) => {
      if (S == "farzher")
        return [{ target: "farzher was here (^-^*)/", score: 0, _indexes: [0], obj: M ? M[0] : O }];
      if (!S)
        return P && P.all ? f(S, M, P) : I;
      var B = u(S), V = B.bitflags;
      B.containsSpace;
      var X = P && P.threshold || z, q = P && P.limit || y, $ = 0, W = 0, ee = M.length;
      if (P && P.key)
        for (var U = P.key, se = 0; se < ee; ++se) {
          var de = M[se], le = T(de, U);
          if (le && (x(le) || (le = c(le)), (V & le._bitflags) === V)) {
            var ne = h(B, le);
            ne !== O && (ne.score < X || (ne = { target: ne.target, _targetLower: "", _targetLowerCodes: O, _nextBeginningIndexes: O, _bitflags: 0, score: ne.score, _indexes: ne._indexes, obj: de }, $ < q ? (H.add(ne), ++$) : (++W, ne.score > H.peek().score && H.replaceTop(ne))));
          }
        }
      else if (P && P.keys)
        for (var he = P.scoreFn || F, ke = P.keys, Le = ke.length, se = 0; se < ee; ++se) {
          for (var de = M[se], ge = new Array(Le), Oe = 0; Oe < Le; ++Oe) {
            var U = ke[Oe], le = T(de, U);
            if (!le) {
              ge[Oe] = O;
              continue;
            }
            x(le) || (le = c(le)), (V & le._bitflags) !== V ? ge[Oe] = O : ge[Oe] = h(B, le);
          }
          ge.obj = de;
          var ue = he(ge);
          ue !== O && (ue < X || (ge.score = ue, $ < q ? (H.add(ge), ++$) : (++W, ue > H.peek().score && H.replaceTop(ge))));
        }
      else
        for (var se = 0; se < ee; ++se) {
          var le = M[se];
          if (le && (x(le) || (le = c(le)), (V & le._bitflags) === V)) {
            var ne = h(B, le);
            ne !== O && (ne.score < X || ($ < q ? (H.add(ne), ++$) : (++W, ne.score > H.peek().score && H.replaceTop(ne))));
          }
        }
      if ($ === 0)
        return I;
      for (var ye = new Array($), se = $ - 1; se >= 0; --se)
        ye[se] = H.poll();
      return ye.total = $ + W, ye;
    }, i = (S, M, P) => {
      if (typeof M == "function")
        return s(S, M);
      if (S === O)
        return O;
      M === void 0 && (M = "<b>"), P === void 0 && (P = "</b>");
      var B = "", V = 0, X = !1, q = S.target, $ = q.length, W = S._indexes;
      W = W.slice(0, W.len).sort((se, de) => se - de);
      for (var ee = 0; ee < $; ++ee) {
        var U = q[ee];
        if (W[V] === ee) {
          if (++V, X || (X = !0, B += M), V === W.length) {
            B += U + P + q.substr(ee + 1);
            break;
          }
        } else
          X && (X = !1, B += P);
        B += U;
      }
      return B;
    }, s = (ee, M) => {
      if (ee === O)
        return O;
      var P = ee.target, B = P.length, V = ee._indexes;
      V = V.slice(0, V.len).sort((de, le) => de - le);
      for (var X = "", q = 0, $ = 0, W = !1, ee = [], U = 0; U < B; ++U) {
        var se = P[U];
        if (V[$] === U) {
          if (++$, W || (W = !0, ee.push(X), X = ""), $ === V.length) {
            X += se, ee.push(M(X, q++)), X = "", ee.push(P.substr(U + 1));
            break;
          }
        } else
          W && (W = !1, ee.push(M(X, q++)), X = "");
        X += se;
      }
      return ee;
    }, o = (S) => S._indexes.slice(0, S._indexes.len).sort((M, P) => M - P), a = (S) => {
      typeof S != "string" && (S = "");
      var M = w(S);
      return { target: S, _targetLower: M._lower, _targetLowerCodes: M.lowerCodes, _nextBeginningIndexes: O, _bitflags: M.bitflags, score: O, _indexes: [0], obj: O };
    }, l = (S) => {
      typeof S != "string" && (S = ""), S = S.trim();
      var M = w(S), P = [];
      if (M.containsSpace) {
        var B = S.split(/\s+/);
        B = [...new Set(B)];
        for (var V = 0; V < B.length; V++)
          if (B[V] !== "") {
            var X = w(B[V]);
            P.push({ lowerCodes: X.lowerCodes, _lower: B[V].toLowerCase(), containsSpace: !1 });
          }
      }
      return { lowerCodes: M.lowerCodes, bitflags: M.bitflags, containsSpace: M.containsSpace, _lower: M._lower, spaceSearches: P };
    }, c = (S) => {
      if (S.length > 999)
        return a(S);
      var M = b.get(S);
      return M !== void 0 || (M = a(S), b.set(S, M)), M;
    }, u = (S) => {
      if (S.length > 999)
        return l(S);
      var M = C.get(S);
      return M !== void 0 || (M = l(S), C.set(S, M)), M;
    }, f = (S, M, P) => {
      var B = [];
      B.total = M.length;
      var V = P && P.limit || y;
      if (P && P.key)
        for (var X = 0; X < M.length; X++) {
          var q = M[X], $ = T(q, P.key);
          if ($) {
            x($) || ($ = c($)), $.score = z, $._indexes.len = 0;
            var W = $;
            if (W = { target: W.target, _targetLower: "", _targetLowerCodes: O, _nextBeginningIndexes: O, _bitflags: 0, score: $.score, _indexes: O, obj: q }, B.push(W), B.length >= V)
              return B;
          }
        }
      else if (P && P.keys)
        for (var X = 0; X < M.length; X++) {
          for (var q = M[X], ee = new Array(P.keys.length), U = P.keys.length - 1; U >= 0; --U) {
            var $ = T(q, P.keys[U]);
            if (!$) {
              ee[U] = O;
              continue;
            }
            x($) || ($ = c($)), $.score = z, $._indexes.len = 0, ee[U] = $;
          }
          if (ee.obj = q, ee.score = z, B.push(ee), B.length >= V)
            return B;
        }
      else
        for (var X = 0; X < M.length; X++) {
          var $ = M[X];
          if ($ && (x($) || ($ = c($)), $.score = z, $._indexes.len = 0, B.push($), B.length >= V))
            return B;
        }
      return B;
    }, h = (S, M, P = !1) => {
      if (P === !1 && S.containsSpace)
        return m(S, M);
      for (var B = S._lower, V = S.lowerCodes, X = V[0], q = M._targetLowerCodes, $ = V.length, W = q.length, de = 0, ee = 0, U = 0; ; ) {
        var se = X === q[ee];
        if (se) {
          if (_[U++] = ee, ++de, de === $)
            break;
          X = V[de];
        }
        if (++ee, ee >= W)
          return O;
      }
      var de = 0, le = !1, ne = 0, he = M._nextBeginningIndexes;
      he === O && (he = M._nextBeginningIndexes = p(M.target)), ee = _[0] === 0 ? 0 : he[_[0] - 1];
      var ke = 0;
      if (ee !== W)
        for (; ; )
          if (ee >= W) {
            if (de <= 0 || (++ke, ke > 200))
              break;
            --de;
            var Le = E[--ne];
            ee = he[Le];
          } else {
            var se = V[de] === q[ee];
            if (se) {
              if (E[ne++] = ee, ++de, de === $) {
                le = !0;
                break;
              }
              ++ee;
            } else
              ee = he[ee];
          }
      var ge = M._targetLower.indexOf(B, _[0]), Oe = ~ge;
      if (Oe && !le)
        for (var ue = 0; ue < U; ++ue)
          _[ue] = ge + ue;
      var ye = !1;
      Oe && (ye = M._nextBeginningIndexes[ge - 1] === ge);
      {
        if (le)
          var Re = E, qe = ne;
        else
          var Re = _, qe = U;
        for (var Ke = 0, ot = 0, ue = 1; ue < $; ++ue)
          Re[ue] - Re[ue - 1] !== 1 && (Ke -= Re[ue], ++ot);
        var Ze = Re[$ - 1] - Re[0] - ($ - 1);
        if (Ke -= (12 + Ze) * ot, Re[0] !== 0 && (Ke -= Re[0] * Re[0] * 0.2), !le)
          Ke *= 1e3;
        else {
          for (var Ce = 1, ue = he[0]; ue < W; ue = he[ue])
            ++Ce;
          Ce > 24 && (Ke *= (Ce - 24) * 10);
        }
        Oe && (Ke /= 1 + $ * $ * 1), ye && (Ke /= 1 + $ * $ * 1), Ke -= W - $, M.score = Ke;
        for (var ue = 0; ue < qe; ++ue)
          M._indexes[ue] = Re[ue];
        return M._indexes.len = qe, M;
      }
    }, m = (S, M) => {
      for (var P = /* @__PURE__ */ new Set(), B = 0, V = O, X = 0, q = S.spaceSearches, U = 0; U < q.length; ++U) {
        var $ = q[U];
        if (V = h($, M), V === O)
          return O;
        B += V.score, V._indexes[0] < X && (B -= X - V._indexes[0]), X = V._indexes[0];
        for (var W = 0; W < V._indexes.len; ++W)
          P.add(V._indexes[W]);
      }
      var ee = h(
        S,
        M,
        /*allowSpaces=*/
        !0
      );
      if (ee !== O && ee.score > B)
        return ee;
      V.score = B;
      var U = 0;
      for (let se of P)
        V._indexes[U++] = se;
      return V._indexes.len = U, V;
    }, w = (S) => {
      for (var M = S.length, P = S.toLowerCase(), B = [], V = 0, X = !1, q = 0; q < M; ++q) {
        var $ = B[q] = P.charCodeAt(q);
        if ($ === 32) {
          X = !0;
          continue;
        }
        var W = $ >= 97 && $ <= 122 ? $ - 97 : $ >= 48 && $ <= 57 ? 26 : $ <= 127 ? 30 : 31;
        V |= 1 << W;
      }
      return { lowerCodes: B, bitflags: V, containsSpace: X, _lower: P };
    }, g = (S) => {
      for (var M = S.length, P = [], B = 0, V = !1, X = !1, q = 0; q < M; ++q) {
        var $ = S.charCodeAt(q), W = $ >= 65 && $ <= 90, ee = W || $ >= 97 && $ <= 122 || $ >= 48 && $ <= 57, U = W && !V || !X || !ee;
        V = W, X = ee, U && (P[B++] = q);
      }
      return P;
    }, p = (S) => {
      for (var M = S.length, P = g(S), B = [], V = P[0], X = 0, q = 0; q < M; ++q)
        V > q ? B[q] = V : (V = P[++X], B[q] = V === void 0 ? M : V);
      return B;
    }, v = () => {
      b.clear(), C.clear(), _ = [], E = [];
    }, b = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map(), _ = [], E = [], F = (S) => {
      for (var M = z, P = S.length, B = 0; B < P; ++B) {
        var V = S[B];
        if (V !== O) {
          var X = V.score;
          X > M && (M = X);
        }
      }
      return M === z ? O : M;
    }, T = (S, M) => {
      var P = S[M];
      if (P !== void 0)
        return P;
      var B = M;
      Array.isArray(M) || (B = M.split("."));
      for (var V = B.length, X = -1; S && ++X < V; )
        S = S[B[X]];
      return S;
    }, x = (S) => typeof S == "object", y = 1 / 0, z = -y, I = [];
    I.total = 0;
    var O = null, Q = (S) => {
      var M = [], P = 0, B = {}, V = (X) => {
        for (var q = 0, $ = M[q], W = 1; W < P; ) {
          var ee = W + 1;
          q = W, ee < P && M[ee].score < M[W].score && (q = ee), M[q - 1 >> 1] = M[q], W = 1 + (q << 1);
        }
        for (var U = q - 1 >> 1; q > 0 && $.score < M[U].score; U = (q = U) - 1 >> 1)
          M[q] = M[U];
        M[q] = $;
      };
      return B.add = (X) => {
        var q = P;
        M[P++] = X;
        for (var $ = q - 1 >> 1; q > 0 && X.score < M[$].score; $ = (q = $) - 1 >> 1)
          M[q] = M[$];
        M[q] = X;
      }, B.poll = (X) => {
        if (P !== 0) {
          var q = M[0];
          return M[0] = M[--P], V(), q;
        }
      }, B.peek = (X) => {
        if (P !== 0)
          return M[0];
      }, B.replaceTop = (X) => {
        M[0] = X, V();
      }, B;
    }, H = Q();
    return { single: n, go: r, highlight: i, prepare: a, indexes: o, cleanup: v };
  });
})(_d);
var wy = _d.exports;
const _l = /* @__PURE__ */ oc(wy);
var py = (t, e, n) => {
  let r = _l.go(t, hn(e), { keys: n, threshold: -1 / 0 });
  return { data: r.map((i) => i.obj), highlighted: r.map((i) => i.map((s, o) => {
    var a;
    return _l.highlight(s) || (s == null ? void 0 : s.target) || ((a = i.obj[n[o]]) == null ? void 0 : a.toString()) || "";
  })) };
}, vy = L("<div>"), by = bn("tw-inline-flex tw-items-center tw-rounded-md tw-border tw-px-2.5 tw-py-0.5 tw-text-xs tw-font-semibold tw-transition-colors focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-primary focus:tw-ring-offset-2", { variants: { variant: { default: "tw-border-transparent tw-bg-primary tw-text-primary-foreground tw-shadow hover:tw-bg-primary/80", destructive: "tw-border-transparent tw-bg-destructive tw-text-destructive-foreground tw-shadow hover:tw-bg-destructive/80", outline: "tw-text-foreground" } }, defaultVariants: { variant: "default" } }), Sd = (t) => {
  let [e, n] = K(t, ["class", "variant"]);
  return (() => {
    var r = vy();
    return nt(r, D({ get class() {
      return G(by({ variant: e.variant }), e.class);
    } }, n), !1, !1), r;
  })();
};
function Er(t, e, n) {
  let r = n.initialDeps ?? [], i;
  return () => {
    var s, o, a, l;
    let c;
    n.key && ((s = n.debug) != null && s.call(n)) && (c = Date.now());
    const u = t();
    if (!(u.length !== r.length || u.some((m, w) => r[w] !== m)))
      return i;
    r = u;
    let h;
    if (n.key && ((o = n.debug) != null && o.call(n)) && (h = Date.now()), i = e(...u), n.key && ((a = n.debug) != null && a.call(n))) {
      const m = Math.round((Date.now() - c) * 100) / 100, w = Math.round((Date.now() - h) * 100) / 100, g = w / 16, p = (v, b) => {
        for (v = String(v); v.length < b; )
          v = " " + v;
        return v;
      };
      console.info(
        `%c⏱ ${p(w, 5)} /${p(m, 5)} ms`,
        `
            font-size: .6rem;
            font-weight: bold;
            color: hsl(${Math.max(
          0,
          Math.min(120 - 120 * g, 120)
        )}deg 100% 31%);`,
        n == null ? void 0 : n.key
      );
    }
    return (l = n == null ? void 0 : n.onChange) == null || l.call(n, i), i;
  };
}
function js(t, e) {
  if (t === void 0)
    throw new Error("Unexpected undefined");
  return t;
}
const yy = (t, e) => Math.abs(t - e) < 1, xy = (t, e) => {
  let n;
  return function(...r) {
    clearTimeout(n), n = setTimeout(() => t.apply(this, r), e);
  };
}, ky = (t) => t, Cy = (t) => {
  const e = Math.max(t.startIndex - t.overscan, 0), n = Math.min(t.endIndex + t.overscan, t.count - 1), r = [];
  for (let i = e; i <= n; i++)
    r.push(i);
  return r;
}, _y = (t, e) => {
  const n = t.scrollElement;
  if (!n)
    return;
  const r = (s) => {
    const { width: o, height: a } = s;
    e({ width: Math.round(o), height: Math.round(a) });
  };
  if (r(n.getBoundingClientRect()), typeof ResizeObserver > "u")
    return () => {
    };
  const i = new ResizeObserver((s) => {
    const o = s[0];
    if (o != null && o.borderBoxSize) {
      const a = o.borderBoxSize[0];
      if (a) {
        r({ width: a.inlineSize, height: a.blockSize });
        return;
      }
    }
    r(n.getBoundingClientRect());
  });
  return i.observe(n, { box: "border-box" }), () => {
    i.unobserve(n);
  };
}, Sl = {
  passive: !0
}, Sy = typeof window > "u" ? !0 : "onscrollend" in window, My = (t, e) => {
  const n = t.scrollElement;
  if (!n)
    return;
  let r = 0;
  const i = Sy ? () => {
  } : xy(() => {
    e(r, !1);
  }, t.options.isScrollingResetDelay), s = (l) => () => {
    r = n[t.options.horizontal ? "scrollLeft" : "scrollTop"], i(), e(r, l);
  }, o = s(!0), a = s(!1);
  return a(), n.addEventListener("scroll", o, Sl), n.addEventListener("scrollend", a, Sl), () => {
    n.removeEventListener("scroll", o), n.removeEventListener("scrollend", a);
  };
}, Oy = (t, e, n) => {
  if (e != null && e.borderBoxSize) {
    const r = e.borderBoxSize[0];
    if (r)
      return Math.round(
        r[n.options.horizontal ? "inlineSize" : "blockSize"]
      );
  }
  return Math.round(
    t.getBoundingClientRect()[n.options.horizontal ? "width" : "height"]
  );
}, bo = (t, {
  adjustments: e = 0,
  behavior: n
}, r) => {
  var i, s;
  const o = t + e;
  (s = (i = r.scrollElement) == null ? void 0 : i.scrollTo) == null || s.call(i, {
    [r.options.horizontal ? "left" : "top"]: o,
    behavior: n
  });
};
class Ey {
  constructor(e) {
    this.unsubs = [], this.scrollElement = null, this.isScrolling = !1, this.scrollToIndexTimeoutId = null, this.measurementsCache = [], this.itemSizeCache = /* @__PURE__ */ new Map(), this.pendingMeasuredCacheIndexes = [], this.scrollDirection = null, this.scrollAdjustments = 0, this.measureElementCache = /* @__PURE__ */ new Map(), this.observer = /* @__PURE__ */ (() => {
      let n = null;
      const r = () => n || (typeof ResizeObserver < "u" ? n = new ResizeObserver((i) => {
        i.forEach((s) => {
          this._measureElement(s.target, s);
        });
      }) : null);
      return {
        disconnect: () => {
          var i;
          return (i = r()) == null ? void 0 : i.disconnect();
        },
        observe: (i) => {
          var s;
          return (s = r()) == null ? void 0 : s.observe(i, { box: "border-box" });
        },
        unobserve: (i) => {
          var s;
          return (s = r()) == null ? void 0 : s.unobserve(i);
        }
      };
    })(), this.range = null, this.setOptions = (n) => {
      Object.entries(n).forEach(([r, i]) => {
        typeof i > "u" && delete n[r];
      }), this.options = {
        debug: !1,
        initialOffset: 0,
        overscan: 1,
        paddingStart: 0,
        paddingEnd: 0,
        scrollPaddingStart: 0,
        scrollPaddingEnd: 0,
        horizontal: !1,
        getItemKey: ky,
        rangeExtractor: Cy,
        onChange: () => {
        },
        measureElement: Oy,
        initialRect: { width: 0, height: 0 },
        scrollMargin: 0,
        gap: 0,
        indexAttribute: "data-index",
        initialMeasurementsCache: [],
        lanes: 1,
        isScrollingResetDelay: 150,
        ...n
      };
    }, this.notify = (n, r) => {
      var i, s;
      const { startIndex: o, endIndex: a } = this.range ?? {
        startIndex: void 0,
        endIndex: void 0
      }, l = this.calculateRange();
      (n || o !== (l == null ? void 0 : l.startIndex) || a !== (l == null ? void 0 : l.endIndex)) && ((s = (i = this.options).onChange) == null || s.call(i, this, r));
    }, this.cleanup = () => {
      this.unsubs.filter(Boolean).forEach((n) => n()), this.unsubs = [], this.scrollElement = null;
    }, this._didMount = () => (this.measureElementCache.forEach(this.observer.observe), () => {
      this.observer.disconnect(), this.cleanup();
    }), this._willUpdate = () => {
      const n = this.options.getScrollElement();
      this.scrollElement !== n && (this.cleanup(), this.scrollElement = n, this._scrollToOffset(this.scrollOffset, {
        adjustments: void 0,
        behavior: void 0
      }), this.unsubs.push(
        this.options.observeElementRect(this, (r) => {
          this.scrollRect = r, this.notify(!1, !1);
        })
      ), this.unsubs.push(
        this.options.observeElementOffset(this, (r, i) => {
          this.scrollAdjustments = 0, this.scrollDirection = i ? this.scrollOffset < r ? "forward" : "backward" : null, this.scrollOffset = r;
          const s = this.isScrolling;
          this.isScrolling = i, this.notify(s !== i, i);
        })
      ));
    }, this.getSize = () => this.scrollRect[this.options.horizontal ? "width" : "height"], this.getMeasurementOptions = Er(
      () => [
        this.options.count,
        this.options.paddingStart,
        this.options.scrollMargin,
        this.options.getItemKey
      ],
      (n, r, i, s) => (this.pendingMeasuredCacheIndexes = [], {
        count: n,
        paddingStart: r,
        scrollMargin: i,
        getItemKey: s
      }),
      {
        key: !1
      }
    ), this.getFurthestMeasurement = (n, r) => {
      const i = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
      for (let o = r - 1; o >= 0; o--) {
        const a = n[o];
        if (i.has(a.lane))
          continue;
        const l = s.get(
          a.lane
        );
        if (l == null || a.end > l.end ? s.set(a.lane, a) : a.end < l.end && i.set(a.lane, !0), i.size === this.options.lanes)
          break;
      }
      return s.size === this.options.lanes ? Array.from(s.values()).sort((o, a) => o.end === a.end ? o.index - a.index : o.end - a.end)[0] : void 0;
    }, this.getMeasurements = Er(
      () => [this.getMeasurementOptions(), this.itemSizeCache],
      ({ count: n, paddingStart: r, scrollMargin: i, getItemKey: s }, o) => {
        const a = this.pendingMeasuredCacheIndexes.length > 0 ? Math.min(...this.pendingMeasuredCacheIndexes) : 0;
        this.pendingMeasuredCacheIndexes = [];
        const l = this.measurementsCache.slice(0, a);
        for (let c = a; c < n; c++) {
          const u = s(c), f = this.options.lanes === 1 ? l[c - 1] : this.getFurthestMeasurement(l, c), h = f ? f.end + this.options.gap : r + i, m = o.get(u), w = typeof m == "number" ? m : this.options.estimateSize(c), g = h + w, p = f ? f.lane : c % this.options.lanes;
          l[c] = {
            index: c,
            start: h,
            size: w,
            end: g,
            key: u,
            lane: p
          };
        }
        return this.measurementsCache = l, l;
      },
      {
        key: !1,
        debug: () => this.options.debug
      }
    ), this.calculateRange = Er(
      () => [this.getMeasurements(), this.getSize(), this.scrollOffset],
      (n, r, i) => this.range = n.length > 0 && r > 0 ? Iy({
        measurements: n,
        outerSize: r,
        scrollOffset: i
      }) : null,
      {
        key: !1,
        debug: () => this.options.debug
      }
    ), this.getIndexes = Er(
      () => [
        this.options.rangeExtractor,
        this.calculateRange(),
        this.options.overscan,
        this.options.count
      ],
      (n, r, i, s) => r === null ? [] : n({
        startIndex: r.startIndex,
        endIndex: r.endIndex,
        overscan: i,
        count: s
      }),
      {
        key: !1,
        debug: () => this.options.debug
      }
    ), this.indexFromElement = (n) => {
      const r = this.options.indexAttribute, i = n.getAttribute(r);
      return i ? parseInt(i, 10) : (console.warn(
        `Missing attribute name '${r}={index}' on measured element.`
      ), -1);
    }, this._measureElement = (n, r) => {
      const i = this.measurementsCache[this.indexFromElement(n)];
      if (!i || !n.isConnected) {
        this.measureElementCache.forEach((a, l) => {
          a === n && (this.observer.unobserve(n), this.measureElementCache.delete(l));
        });
        return;
      }
      const s = this.measureElementCache.get(i.key);
      s !== n && (s && this.observer.unobserve(s), this.observer.observe(n), this.measureElementCache.set(i.key, n));
      const o = this.options.measureElement(n, r, this);
      this.resizeItem(i, o);
    }, this.resizeItem = (n, r) => {
      const i = this.itemSizeCache.get(n.key) ?? n.size, s = r - i;
      s !== 0 && ((this.shouldAdjustScrollPositionOnItemSizeChange !== void 0 ? this.shouldAdjustScrollPositionOnItemSizeChange(n, s, this) : n.start < this.scrollOffset + this.scrollAdjustments) && this._scrollToOffset(this.scrollOffset, {
        adjustments: this.scrollAdjustments += s,
        behavior: void 0
      }), this.pendingMeasuredCacheIndexes.push(n.index), this.itemSizeCache = new Map(this.itemSizeCache.set(n.key, r)), this.notify(!0, !1));
    }, this.measureElement = (n) => {
      n && this._measureElement(n, void 0);
    }, this.getVirtualItems = Er(
      () => [this.getIndexes(), this.getMeasurements()],
      (n, r) => {
        const i = [];
        for (let s = 0, o = n.length; s < o; s++) {
          const a = n[s], l = r[a];
          i.push(l);
        }
        return i;
      },
      {
        key: !1,
        debug: () => this.options.debug
      }
    ), this.getVirtualItemForOffset = (n) => {
      const r = this.getMeasurements();
      return js(
        r[Md(
          0,
          r.length - 1,
          (i) => js(r[i]).start,
          n
        )]
      );
    }, this.getOffsetForAlignment = (n, r) => {
      const i = this.getSize();
      r === "auto" && (n <= this.scrollOffset ? r = "start" : n >= this.scrollOffset + i ? r = "end" : r = "start"), r === "start" ? n = n : r === "end" ? n = n - i : r === "center" && (n = n - i / 2);
      const s = this.options.horizontal ? "scrollWidth" : "scrollHeight", a = (this.scrollElement ? "document" in this.scrollElement ? this.scrollElement.document.documentElement[s] : this.scrollElement[s] : 0) - this.getSize();
      return Math.max(Math.min(a, n), 0);
    }, this.getOffsetForIndex = (n, r = "auto") => {
      n = Math.max(0, Math.min(n, this.options.count - 1));
      const i = js(this.getMeasurements()[n]);
      if (r === "auto")
        if (i.end >= this.scrollOffset + this.getSize() - this.options.scrollPaddingEnd)
          r = "end";
        else if (i.start <= this.scrollOffset + this.options.scrollPaddingStart)
          r = "start";
        else
          return [this.scrollOffset, r];
      const s = r === "end" ? i.end + this.options.scrollPaddingEnd : i.start - this.options.scrollPaddingStart;
      return [this.getOffsetForAlignment(s, r), r];
    }, this.isDynamicMode = () => this.measureElementCache.size > 0, this.cancelScrollToIndex = () => {
      this.scrollToIndexTimeoutId !== null && (clearTimeout(this.scrollToIndexTimeoutId), this.scrollToIndexTimeoutId = null);
    }, this.scrollToOffset = (n, { align: r = "start", behavior: i } = {}) => {
      this.cancelScrollToIndex(), i === "smooth" && this.isDynamicMode() && console.warn(
        "The `smooth` scroll behavior is not fully supported with dynamic size."
      ), this._scrollToOffset(this.getOffsetForAlignment(n, r), {
        adjustments: void 0,
        behavior: i
      });
    }, this.scrollToIndex = (n, { align: r = "auto", behavior: i } = {}) => {
      n = Math.max(0, Math.min(n, this.options.count - 1)), this.cancelScrollToIndex(), i === "smooth" && this.isDynamicMode() && console.warn(
        "The `smooth` scroll behavior is not fully supported with dynamic size."
      );
      const [s, o] = this.getOffsetForIndex(n, r);
      this._scrollToOffset(s, { adjustments: void 0, behavior: i }), i !== "smooth" && this.isDynamicMode() && (this.scrollToIndexTimeoutId = setTimeout(() => {
        if (this.scrollToIndexTimeoutId = null, this.measureElementCache.has(
          this.options.getItemKey(n)
        )) {
          const [l] = this.getOffsetForIndex(n, o);
          yy(l, this.scrollOffset) || this.scrollToIndex(n, { align: o, behavior: i });
        } else
          this.scrollToIndex(n, { align: o, behavior: i });
      }));
    }, this.scrollBy = (n, { behavior: r } = {}) => {
      this.cancelScrollToIndex(), r === "smooth" && this.isDynamicMode() && console.warn(
        "The `smooth` scroll behavior is not fully supported with dynamic size."
      ), this._scrollToOffset(this.scrollOffset + n, {
        adjustments: void 0,
        behavior: r
      });
    }, this.getTotalSize = () => {
      var n;
      const r = this.getMeasurements();
      let i;
      return r.length === 0 ? i = this.options.paddingStart : i = this.options.lanes === 1 ? ((n = r[r.length - 1]) == null ? void 0 : n.end) ?? 0 : Math.max(
        ...r.slice(-this.options.lanes).map((s) => s.end)
      ), i - this.options.scrollMargin + this.options.paddingEnd;
    }, this._scrollToOffset = (n, {
      adjustments: r,
      behavior: i
    }) => {
      this.options.scrollToFn(n, { behavior: i, adjustments: r }, this);
    }, this.measure = () => {
      var n, r;
      this.itemSizeCache = /* @__PURE__ */ new Map(), (r = (n = this.options).onChange) == null || r.call(n, this, !1);
    }, this.setOptions(e), this.scrollRect = this.options.initialRect, this.scrollOffset = typeof this.options.initialOffset == "function" ? this.options.initialOffset() : this.options.initialOffset, this.measurementsCache = this.options.initialMeasurementsCache, this.measurementsCache.forEach((n) => {
      this.itemSizeCache.set(n.key, n.size);
    }), this.notify(!1, !1);
  }
}
const Md = (t, e, n, r) => {
  for (; t <= e; ) {
    const i = (t + e) / 2 | 0, s = n(i);
    if (s < r)
      t = i + 1;
    else if (s > r)
      e = i - 1;
    else
      return i;
  }
  return t > 0 ? t - 1 : 0;
};
function Iy({
  measurements: t,
  outerSize: e,
  scrollOffset: n
}) {
  const r = t.length - 1, s = Md(0, r, (a) => t[a].start, n);
  let o = s;
  for (; o < r && t[o].end < n + e; )
    o++;
  return { startIndex: s, endIndex: o };
}
function Py(t) {
  const e = D(t), n = new Ey(e), [r, i] = ql(n.getVirtualItems()), [s, o] = N(n.getTotalSize()), a = {
    get(c, u) {
      switch (u) {
        case "getVirtualItems":
          return () => r;
        case "getTotalSize":
          return () => s();
        default:
          return Reflect.get(c, u);
      }
    }
  }, l = new Proxy(n, a);
  return l.setOptions(e), en(() => {
    const c = l._didMount();
    l._willUpdate(), me(c);
  }), Fl(() => {
    l.setOptions(D(e, t, {
      onChange: (c, u) => {
        var f;
        c._willUpdate(), i(Vf(c.getVirtualItems(), {
          key: "index"
        })), o(c.getTotalSize()), (f = t.onChange) == null || f.call(t, c, u);
      }
    })), l.measure();
  }), l;
}
function Od(t) {
  return Py(D({
    observeElementRect: _y,
    observeElementOffset: My,
    scrollToFn: bo
  }, t));
}
var Dy = L('<div class="tw-flex tw-grow tw-flex-wrap tw-justify-start tw-gap-2"><div class="tw-m-1 tw-grow">'), $y = L('<div class="tw-flex tw-h-auto tw-min-h-9 tw-w-full tw-items-center tw-justify-between tw-rounded-md tw-border tw-border-border tw-px-2 tw-py-1 tw-shadow-sm">'), Ty = L('<div class="tw-absolute tw-inset-0 tw-w-full">'), Ay = L('<div class="tw-no-scrollbar tw-h-min tw-flex-1"><div class="tw-relative tw-flex tw-w-full tw-flex-col">'), Ly = L('<div class="tw-relative tw-flex tw-min-h-8 tw-w-full tw-select-none tw-items-center tw-rounded-sm tw-py-2 tw-pl-2 tw-pr-8 tw-text-sm tw-outline-none">'), Fy = L("<div>"), zy = L('<div class="tw-absolute tw-right-2 tw-size-3.5 tw-items-center tw-justify-center">'), Ry = L('<li class="tw-relative tw-flex tw-min-h-8 tw-w-full tw-cursor-pointer tw-select-none tw-items-center tw-rounded-sm tw-py-2 tw-pl-2 tw-pr-8 tw-text-sm tw-outline-none hover:tw-bg-primary/10 data-[disabled]:tw-pointer-events-none data-[highlighted]:tw-bg-primary/10 data-[highlighted]:tw-text-foreground data-[disabled]:tw-opacity-50"><div class="tw-flex tw-flex-col tw-p-0">'), Ed = hd(() => Fe()), ms = () => {
  let t = Ne(Ed());
  if (t === void 0)
    throw new Error("useComboboxContext must be used within a ComboboxContext.Provider");
  return t;
}, Id = hd(() => Fe()), Vy = () => {
  let t = Ne(Id());
  if (t === void 0)
    throw new Error("useItemContext must be used within a ItemContextProps.Provider");
  return t;
}, Ny = (t) => t, jn = (t, e) => {
  if (!t)
    return "";
  let n = Ny(e);
  return typeof n == "string" ? t[n] : n(t);
}, Ky = (t) => t, mt = (t, e) => {
  if (!t)
    return;
  let n = Ky(e);
  return typeof n == "string" ? t[n] : n(t);
}, si = (t) => {
  let e = lt(() => t.optionLabel), n = D({ optionLabel: "label", optionValue: "value", itemKeys: [e ?? "label"], itemRenderer: (T) => d(ra, { get children() {
    return jn(T, e);
  } }), noOptions: () => "No options found" }, t), [r, i] = N(""), [s, o] = N([]), [a, l] = N([]), [c, u] = N(), [f, h] = N(!1), m = Ed(), w = () => {
    var T;
    return n.multiple ? (T = c()) == null ? void 0 : T.length : !!c();
  }, g = (T) => {
    var I, O, Q;
    let x = mt(T, n.optionValue);
    if (n.multiple ? ((I = c()) == null ? void 0 : I.find((H) => mt(H, n.optionValue) === x)) !== void 0 : mt(c(), n.optionValue) === x)
      return n.multiple && n.disallowEmptySelection ? (((O = c()) == null ? void 0 : O.length) || 0) > 1 && p(T) : !n.disallowEmptySelection && p(T);
    let y = n.multiple ? [...c() ?? [], T] : T;
    u(() => y);
    let z = jn(y, n.optionLabel);
    i(() => z), (Q = n.onInputChange) == null || Q.call(n, z), n.multiple || (C(!1), b(y));
  }, p = (T) => {
    var y;
    let x = n.multiple ? (y = c()) == null ? void 0 : y.filter((z) => mt(z, n.optionValue) !== mt(T, n.optionValue)) : void 0;
    i(""), u(x);
  }, v = () => {
    i(""), b(void 0);
  }, b = (T) => {
    var y, z;
    let x = Array.isArray(T) ? hn(T) : T;
    u(() => x), n.multiple ? (y = n.onChange) == null || y.call(n, x ?? []) : (z = n.onChange) == null || z.call(n, x);
  }, C = (T) => {
    var x;
    (x = n.onOpenChange) == null || x.call(n, T), h(T);
  }, _ = () => {
    i(() => jn(c(), n.optionLabel));
  };
  en(() => {
    o(() => n.options), u(() => E()), _();
  }), Z(He(r, () => F(), { defer: !0 })), Z(He(f, (T, x) => {
    T || (r() || b(c()), _()), !x && T && F(!1);
  }, { defer: !0 }));
  let E = () => {
    let T = hn(n.options).filter((x) => {
      var z;
      let y = mt(x, n.optionValue);
      return n.multiple ? ((z = n.value) == null ? void 0 : z.find((I) => mt(I, n.optionValue) === y)) !== void 0 : mt(n.value, n.optionValue) === y;
    });
    return (n.multiple ? T : T[0]) ?? n.value;
  }, F = (T = !0) => {
    var Q;
    let x = hn(n.options);
    if (!r() || !T) {
      o(x), l(x.map((H) => {
        var S;
        return ((S = n.itemKeys) == null ? void 0 : S.map((M) => jn(H, M) || "")) || [];
      }));
      return;
    }
    let y = x.map((H) => {
      let S = {};
      return n.itemKeys.forEach((M, P) => {
        S[P] = jn(H, M), S.value = mt(H, n.optionValue);
      }), S;
    }), z = ry(0, ((Q = n.itemKeys) == null ? void 0 : Q.length) - 1).map((H) => H.toString()), I = py(r(), y, z), O = I.data.map((H) => x.find((S) => mt(S, n.optionValue) === H.value)).filter((H) => H !== void 0);
    o(O), l(I.highlighted);
  };
  return d(tv, D(n, { defaultFilter: () => !0, onOpenChange: C, get children() {
    return d(m.Provider, { value: { props: n, inputText: r, setInputText: i, filtered: s, highlighted: a, selected: c, selectItem: g, removeItem: p, save: b }, get children() {
      return [d(Xp, { get children() {
        var T = $y();
        return k(T, d(yl, { class: "tw-grow", get children() {
          return d(te, { get when() {
            return n.multiple;
          }, get fallback() {
            return d(Ml, {});
          }, get children() {
            var x = Dy(), y = x.firstChild;
            return k(x, d(jy, {}), y), k(y, d(Ml, {})), x;
          } });
        } }), null), k(T, d(te, { get when() {
          return w() && n.clearable;
        }, get children() {
          return d(yn, { class: "tw-mx-2 tw-cursor-pointer tw-text-muted-foreground", onClick: () => v() });
        } }), null), k(T, d(yl, { get children() {
          return d(Jp, { class: "tw-flex tw-size-3.5 tw-items-center tw-justify-center", get children() {
            return d(ad, { class: "tw-size-4 tw-opacity-50" });
          } });
        } }), null), T;
      } }), d(Yp, { get mount() {
        return document.getElementById("fasih-form");
      }, get children() {
        return d(qp, { class: "tw-relative tw-z-50 tw-max-h-[var(--kb-popper-content-available-height)] tw-min-w-32 tw-overflow-auto tw-rounded-md tw-border tw-bg-popover tw-flex tw-text-popover-foreground tw-shadow-md data-[expanded]:tw-animate-in data-[closed]:tw-animate-out data-[closed]:tw-fade-out-0 data-[expanded]:tw-fade-in-0 data-[closed]:tw-zoom-out-95 data-[expanded]:tw-zoom-in-95", get children() {
          return d(By, {});
        } });
      } })];
    } });
  } }));
}, By = () => {
  let [t, e] = N(), n = ms(), r = Od({ get count() {
    return n.filtered().length;
  }, getScrollElement: () => t(), estimateSize: () => 32 }), i = r.getVirtualItems();
  return (() => {
    var s = Ay(), o = s.firstChild;
    return vt(e, s), k(o, d(te, { get when() {
      return i.length > 0;
    }, get fallback() {
      return (() => {
        var a = Ly();
        return k(a, () => {
          var l, c;
          return (c = (l = n.props).noOptions) == null ? void 0 : c.call(l, n.inputText());
        }), a;
      })();
    }, get children() {
      var a = Ty();
      return k(a, d(xe, { each: i, children: (l) => {
        let c = Id();
        return d(c.Provider, { value: { get item() {
          return n.filtered()[l.index];
        }, get highlighted() {
          return n.highlighted()[l.index];
        } }, get children() {
          var u = Fy(), f = r.measureElement;
          return typeof f == "function" ? vt(f, u) : r.measureElement = u, k(u, () => {
            var h, m;
            return (m = (h = n.props).itemRenderer) == null ? void 0 : m.call(h, n.filtered()[l.index], n.highlighted()[l.index]);
          }), oe(() => Xe(u, "data-index", l.index)), u;
        } });
      } })), oe(() => {
        var l, c;
        return `translateY(${((l = i[0]) == null ? void 0 : l.start) ?? 0}px)` != null ? a.style.setProperty("transform", `translateY(${((c = i[0]) == null ? void 0 : c.start) ?? 0}px)`) : a.style.removeProperty("transform");
      }), a;
    } })), oe(() => `${r.getTotalSize()}px` != null ? o.style.setProperty("height", `${r.getTotalSize()}px`) : o.style.removeProperty("height")), s;
  })();
}, ra = (t) => {
  let e = Vy(), n = ms(), r = () => {
    if (!n.selected())
      return !1;
    let i = mt(e.item, n.props.optionValue);
    return Array.isArray(n.selected()) ? n.selected().find((s) => mt(s, n.props.optionValue) === i) !== void 0 : mt(n.selected(), n.props.optionValue) === i;
  };
  return (() => {
    var i = Ry(), s = i.firstChild;
    return i.$$click = () => n.selectItem(e.item), k(i, d(te, { get when() {
      return r();
    }, get children() {
      var o = zy();
      return k(o, d(od, { class: "tw-size-4 tw-text-primary" })), o;
    } }), s), k(s, () => t.children), oe(() => Xe(i, "data-highlighted", r() ? "" : void 0)), i;
  })();
}, Ml = () => {
  let t = ms();
  return d(Gp, { onInput: (e) => {
    t.setInputText(e.currentTarget.value);
  }, get value() {
    return t.inputText();
  }, get placeholder() {
    return t.props.placeholder;
  }, class: "tw-flex-0 tw-size-full tw-bg-transparent tw-text-sm placeholder:tw-text-muted-foreground focus:tw-outline-none disabled:tw-cursor-not-allowed disabled:tw-opacity-50" });
}, jy = () => {
  let t = ms();
  return d(xe, { get each() {
    return t.selected();
  }, children: (e) => d(Sd, { class: "tw-flex tw-items-center tw-gap-1 tw-pr-1 tw-font-normal tw-text-foreground", variant: "outline", onPointerDown: (n) => n.stopPropagation(), get children() {
    return [J(() => jn(e, t.props.optionLabel)), d(re, { class: "tw-size-6 tw-rounded-md tw-p-2", size: "sm", variant: "ghost", onClick: () => {
      t.removeItem(e), t.save(t.selected());
    }, get children() {
      return d(yn, { class: "tw-size-3" });
    } })];
  } }) });
};
qi(["click"]);
var pr = vv, vr = (t) => {
  let e = D({ gutter: 4 }, t);
  return d(pv, e);
}, br = (t) => {
  let [e, n] = K(t, ["class", "children"]);
  return d(wv, { get mount() {
    return document.getElementById("fasih-form");
  }, get children() {
    return d(mv, D({ get class() {
      return G("tw-z-50 tw-rounded-md tw-border tw-bg-popover tw-p-4 tw-text-popover-foreground tw-shadow-md tw-outline-none data-[expanded]:tw-animate-in data-[closed]:tw-animate-out data-[closed]:tw-fade-out-0 data-[expanded]:tw-fade-in-0 data-[closed]:tw-zoom-out-95 data-[expanded]:tw-zoom-in-95", e.class);
    } }, n, { get children() {
      return e.children;
    } }));
  } });
};
const Wy = {
  lessThanXSeconds: {
    one: "kurang dari 1 detik",
    other: "kurang dari {{count}} detik"
  },
  xSeconds: {
    one: "1 detik",
    other: "{{count}} detik"
  },
  halfAMinute: "setengah menit",
  lessThanXMinutes: {
    one: "kurang dari 1 menit",
    other: "kurang dari {{count}} menit"
  },
  xMinutes: {
    one: "1 menit",
    other: "{{count}} menit"
  },
  aboutXHours: {
    one: "sekitar 1 jam",
    other: "sekitar {{count}} jam"
  },
  xHours: {
    one: "1 jam",
    other: "{{count}} jam"
  },
  xDays: {
    one: "1 hari",
    other: "{{count}} hari"
  },
  aboutXWeeks: {
    one: "sekitar 1 minggu",
    other: "sekitar {{count}} minggu"
  },
  xWeeks: {
    one: "1 minggu",
    other: "{{count}} minggu"
  },
  aboutXMonths: {
    one: "sekitar 1 bulan",
    other: "sekitar {{count}} bulan"
  },
  xMonths: {
    one: "1 bulan",
    other: "{{count}} bulan"
  },
  aboutXYears: {
    one: "sekitar 1 tahun",
    other: "sekitar {{count}} tahun"
  },
  xYears: {
    one: "1 tahun",
    other: "{{count}} tahun"
  },
  overXYears: {
    one: "lebih dari 1 tahun",
    other: "lebih dari {{count}} tahun"
  },
  almostXYears: {
    one: "hampir 1 tahun",
    other: "hampir {{count}} tahun"
  }
}, Hy = (t, e, n) => {
  let r;
  const i = Wy[t];
  return typeof i == "string" ? r = i : e === 1 ? r = i.one : r = i.other.replace("{{count}}", e.toString()), n != null && n.addSuffix ? n.comparison && n.comparison > 0 ? "dalam waktu " + r : r + " yang lalu" : r;
}, Uy = {
  full: "EEEE, d MMMM yyyy",
  long: "d MMMM yyyy",
  medium: "d MMM yyyy",
  short: "d/M/yyyy"
}, qy = {
  full: "HH.mm.ss",
  long: "HH.mm.ss",
  medium: "HH.mm",
  short: "HH.mm"
}, Gy = {
  full: "{{date}} 'pukul' {{time}}",
  long: "{{date}} 'pukul' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
}, Yy = {
  date: qn({
    formats: Uy,
    defaultWidth: "full"
  }),
  time: qn({
    formats: qy,
    defaultWidth: "full"
  }),
  dateTime: qn({
    formats: Gy,
    defaultWidth: "full"
  })
}, Xy = {
  lastWeek: "eeee 'lalu pukul' p",
  yesterday: "'Kemarin pukul' p",
  today: "'Hari ini pukul' p",
  tomorrow: "'Besok pukul' p",
  nextWeek: "eeee 'pukul' p",
  other: "P"
}, Qy = (t, e, n, r) => Xy[t], Jy = {
  narrow: ["SM", "M"],
  abbreviated: ["SM", "M"],
  wide: ["Sebelum Masehi", "Masehi"]
}, Zy = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["K1", "K2", "K3", "K4"],
  wide: ["Kuartal ke-1", "Kuartal ke-2", "Kuartal ke-3", "Kuartal ke-4"]
}, e3 = {
  narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
  abbreviated: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agt",
    "Sep",
    "Okt",
    "Nov",
    "Des"
  ],
  wide: [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember"
  ]
}, t3 = {
  narrow: ["M", "S", "S", "R", "K", "J", "S"],
  short: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
  abbreviated: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
  wide: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]
}, n3 = {
  narrow: {
    am: "AM",
    pm: "PM",
    midnight: "tengah malam",
    noon: "tengah hari",
    morning: "pagi",
    afternoon: "siang",
    evening: "sore",
    night: "malam"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "tengah malam",
    noon: "tengah hari",
    morning: "pagi",
    afternoon: "siang",
    evening: "sore",
    night: "malam"
  },
  wide: {
    am: "AM",
    pm: "PM",
    midnight: "tengah malam",
    noon: "tengah hari",
    morning: "pagi",
    afternoon: "siang",
    evening: "sore",
    night: "malam"
  }
}, r3 = {
  narrow: {
    am: "AM",
    pm: "PM",
    midnight: "tengah malam",
    noon: "tengah hari",
    morning: "pagi",
    afternoon: "siang",
    evening: "sore",
    night: "malam"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "tengah malam",
    noon: "tengah hari",
    morning: "pagi",
    afternoon: "siang",
    evening: "sore",
    night: "malam"
  },
  wide: {
    am: "AM",
    pm: "PM",
    midnight: "tengah malam",
    noon: "tengah hari",
    morning: "pagi",
    afternoon: "siang",
    evening: "sore",
    night: "malam"
  }
}, i3 = (t, e) => "ke-" + Number(t), s3 = {
  ordinalNumber: i3,
  era: Lt({
    values: Jy,
    defaultWidth: "wide"
  }),
  quarter: Lt({
    values: Zy,
    defaultWidth: "wide",
    argumentCallback: (t) => t - 1
  }),
  month: Lt({
    values: e3,
    defaultWidth: "wide"
  }),
  day: Lt({
    values: t3,
    defaultWidth: "wide"
  }),
  dayPeriod: Lt({
    values: n3,
    defaultWidth: "wide",
    formattingValues: r3,
    defaultFormattingWidth: "wide"
  })
}, o3 = /^ke-(\d+)?/i, a3 = /\d+/i, l3 = {
  narrow: /^(sm|m)/i,
  abbreviated: /^(s\.?\s?m\.?|s\.?\s?e\.?\s?u\.?|m\.?|e\.?\s?u\.?)/i,
  wide: /^(sebelum masehi|sebelum era umum|masehi|era umum)/i
}, c3 = {
  any: [/^s/i, /^(m|e)/i]
}, u3 = {
  narrow: /^[1234]/i,
  abbreviated: /^K-?\s[1234]/i,
  wide: /^Kuartal ke-?\s?[1234]/i
}, d3 = {
  any: [/1/i, /2/i, /3/i, /4/i]
}, f3 = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|mei|jun|jul|agt|sep|okt|nov|des)/i,
  wide: /^(januari|februari|maret|april|mei|juni|juli|agustus|september|oktober|november|desember)/i
}, h3 = {
  narrow: [
    /^j/i,
    /^f/i,
    /^m/i,
    /^a/i,
    /^m/i,
    /^j/i,
    /^j/i,
    /^a/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ],
  any: [
    /^ja/i,
    /^f/i,
    /^ma/i,
    /^ap/i,
    /^me/i,
    /^jun/i,
    /^jul/i,
    /^ag/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ]
}, g3 = {
  narrow: /^[srkjm]/i,
  short: /^(min|sen|sel|rab|kam|jum|sab)/i,
  abbreviated: /^(min|sen|sel|rab|kam|jum|sab)/i,
  wide: /^(minggu|senin|selasa|rabu|kamis|jumat|sabtu)/i
}, m3 = {
  narrow: [/^m/i, /^s/i, /^s/i, /^r/i, /^k/i, /^j/i, /^s/i],
  any: [/^m/i, /^sen/i, /^sel/i, /^r/i, /^k/i, /^j/i, /^sa/i]
}, w3 = {
  narrow: /^(a|p|tengah m|tengah h|(di(\swaktu)?) (pagi|siang|sore|malam))/i,
  any: /^([ap]\.?\s?m\.?|tengah malam|tengah hari|(di(\swaktu)?) (pagi|siang|sore|malam))/i
}, p3 = {
  any: {
    am: /^a/i,
    pm: /^pm/i,
    midnight: /^tengah m/i,
    noon: /^tengah h/i,
    morning: /pagi/i,
    afternoon: /siang/i,
    evening: /sore/i,
    night: /malam/i
  }
}, v3 = {
  ordinalNumber: Ec({
    matchPattern: o3,
    parsePattern: a3,
    valueCallback: (t) => parseInt(t, 10)
  }),
  era: Ft({
    matchPatterns: l3,
    defaultMatchWidth: "wide",
    parsePatterns: c3,
    defaultParseWidth: "any"
  }),
  quarter: Ft({
    matchPatterns: u3,
    defaultMatchWidth: "wide",
    parsePatterns: d3,
    defaultParseWidth: "any",
    valueCallback: (t) => t + 1
  }),
  month: Ft({
    matchPatterns: f3,
    defaultMatchWidth: "wide",
    parsePatterns: h3,
    defaultParseWidth: "any"
  }),
  day: Ft({
    matchPatterns: g3,
    defaultMatchWidth: "wide",
    parsePatterns: m3,
    defaultParseWidth: "any"
  }),
  dayPeriod: Ft({
    matchPatterns: w3,
    defaultMatchWidth: "any",
    parsePatterns: p3,
    defaultParseWidth: "any"
  })
}, b3 = {
  code: "id",
  formatDistance: Hy,
  formatLong: Yy,
  formatRelative: Qy,
  localize: s3,
  match: v3,
  options: {
    weekStartsOn: 1,
    firstWeekContainsDate: 1
  }
};
var y3 = L('<div class="tw-flex tw-items-center tw-justify-evenly"><div class=tw-flex></div><p class="tw-flex tw-flex-1 tw-items-center tw-justify-center tw-gap-1"></p><div class=tw-flex>'), x3 = L('<div class="tw-flex tw-items-center tw-justify-evenly"><p class="tw-flex tw-flex-1 tw-items-center tw-justify-center tw-gap-1">'), k3 = L('<div class="tw-flex tw-items-center tw-justify-evenly"><p class="tw-flex tw-flex-1 tw-items-center tw-justify-center tw-gap-1 tw-text-sm tw-font-semibold">'), C3 = L('<div class="tw-mt-4 tw-grid tw-w-full tw-grid-cols-7 tw-place-items-center tw-gap-y-1">'), Pd = L('<div class="tw-text-sm tw-text-muted-foreground">'), _3 = L('<div><div class="tw-grid tw-w-full tw-grid-cols-8 tw-place-items-center tw-gap-y-1"><div class="tw-flex tw-size-8 tw-items-center tw-justify-center tw-border-r tw-border-border tw-text-sm tw-font-bold">W'), Dd = L("<div>"), S3 = L("<div><div>"), $d = L('<div class="tw-mt-4 tw-grid tw-grid-cols-3 tw-place-items-center tw-gap-2">'), M3 = L('<div class="tw-min-w-min tw-select-none">'), O3 = L('<div><div class="tw-absolute tw-flex tw-h-full tw-divide-x tw-divide-solid tw-divide-border">'), E3 = L('<div class="tw-no-scrollbar tw-h-full tw-w-12 tw-overflow-auto tw-px-1 tw-font-mono"><div class="tw-relative tw-w-full"></div><div>'), I3 = L("<span>"), P3 = L('<div class="tw-absolute tw-inset-0">'), Ws = { en: Ic, id: b3 }, D3 = (t) => In(t, { months: -1 }), $3 = (t) => In(t, { months: 1 }), Td = (t) => In(t, { years: -1 }), Ad = (t) => In(t, { years: 1 }), T3 = (t) => {
  let e = Math.floor(tr(t) / 10) * 10;
  return `${e}-${e + 9}`;
}, A3 = (t) => {
  let [e, n] = t.split("-W"), r = /* @__PURE__ */ new Date(`${e}-01-01`), i = parseInt(n, 10);
  $c(r) < 4 && i--;
  let s = In(at(r), { weeks: i });
  return Tc(s);
}, Ld = (t) => {
  let e = Do(t), n = $o(t);
  return `${e}-W${String(n).padStart(2, "0")}`;
}, L3 = (t) => {
  let e = t == null ? void 0 : t.split(":");
  return { hour: (e == null ? void 0 : e[0]) || "00", minute: (e == null ? void 0 : e[1]) || "00", second: (e == null ? void 0 : e[2]) || "00" };
}, Hs = (t) => `${(t == null ? void 0 : t.hour) || "00"}:${(t == null ? void 0 : t.minute) || "00"}:${(t == null ? void 0 : t.second) || "00"}`, Us = (t) => Array.from({ length: t }, (e, n) => n < 10 ? `0${n}` : `${n}`), F3 = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t, Fd = Fe(), xn = () => {
  let t = Ne(Fd);
  if (t === void 0)
    throw new Error("useDateContext must be used within a DateContext.Provider");
  return t;
}, z3 = (t) => {
  let [e] = K(t, ["value", "setValue", "locale"]), [n, r] = N(), [i, s] = N(t.type || "day"), [o, a] = N(ya(/* @__PURE__ */ new Date())), l = (f) => {
    if (r(f), !!e.setValue) {
      if (f === void 0)
        return e.setValue(void 0);
      switch (t.type) {
        case "year":
          return e.setValue(tr(f).toString());
        case "month":
          return e.setValue(We(f, "yyyy-MM"));
        case "week":
          return e.setValue(Ld(f));
        default:
          return e.setValue(We(f, "yyyy-MM-dd"));
      }
    }
  }, c = () => e.locale && Ws[e.locale] !== void 0 ? Ws[e.locale] : Ws.en, u = (f = "EEEEE") => {
    let h = at(/* @__PURE__ */ new Date());
    return Array.from(Array(7)).map((m, w) => We(rs(h, w), f, { locale: c() }));
  };
  return Z(() => {
    let f = e.value ? new Date(e.value) : void 0;
    e.value && Number.isNaN(f == null ? void 0 : f.valueOf()) && (f = A3(e.value)), r(f), a(ya(f || /* @__PURE__ */ new Date()));
  }), d(Fd.Provider, { get value() {
    return { value: n, setValue: l, valueType: t.type || "day", activeDate: o, setActiveDate: a, calendar: i, setCalendar: s, locale: c, getDaysName: u };
  }, get children() {
    return t.children;
  } });
}, Ol = () => {
  let t = xn();
  return (() => {
    var e = y3(), n = e.firstChild, r = n.nextSibling, i = r.nextSibling;
    return k(n, d(re, { size: "icon", variant: "ghost", onClick: () => t.setActiveDate(Td(t.activeDate())), get children() {
      return d(fb, {});
    } }), null), k(n, d(re, { size: "icon", variant: "ghost", onClick: () => t.setActiveDate(D3(t.activeDate())), get children() {
      return d(ea, {});
    } }), null), k(r, d(re, { variant: "ghost", class: "tw-px-2 tw-font-semibold", onClick: () => t.setCalendar("month"), get children() {
      return We(t.activeDate(), "MMMM", { locale: t.locale() });
    } }), null), k(r, d(re, { variant: "ghost", class: "tw-px-2 tw-font-semibold", onClick: () => t.setCalendar("year"), get children() {
      return We(t.activeDate(), "yyyy");
    } }), null), k(i, d(re, { size: "icon", variant: "ghost", onClick: () => t.setActiveDate($3(t.activeDate())), get children() {
      return d(hs, {});
    } }), null), k(i, d(re, { size: "icon", variant: "ghost", onClick: () => t.setActiveDate(Ad(t.activeDate())), get children() {
      return d(hb, {});
    } }), null), e;
  })();
}, R3 = () => {
  let t = xn();
  return (() => {
    var e = x3(), n = e.firstChild;
    return k(e, d(re, { size: "icon", variant: "ghost", onClick: () => t.setActiveDate(Td(t.activeDate())), get children() {
      return d(ea, {});
    } }), n), k(n, d(re, { variant: "ghost", class: "tw-px-2 tw-font-semibold", onClick: () => t.setCalendar("year"), get children() {
      return We(t.activeDate(), "yyyy");
    } })), k(e, d(re, { size: "icon", variant: "ghost", onClick: () => t.setActiveDate(Ad(t.activeDate())), get children() {
      return d(hs, {});
    } }), null), e;
  })();
}, V3 = () => {
  let t = xn(), e = () => t.setActiveDate(In(t.activeDate(), { years: -10 })), n = () => t.setActiveDate(In(t.activeDate(), { years: 10 }));
  return (() => {
    var r = k3(), i = r.firstChild;
    return k(r, d(re, { variant: "ghost", size: "icon", onClick: e, get children() {
      return d(ea, {});
    } }), i), k(i, () => T3(t.activeDate())), k(r, d(re, { variant: "ghost", size: "icon", onClick: n, get children() {
      return d(hs, {});
    } }), null), r;
  })();
}, N3 = () => {
  let t = xn(), e = () => Mc({ start: at(t.activeDate()), end: Oc(Sc(t.activeDate())) }), n = (r) => t.setValue(r);
  return (() => {
    var r = C3();
    return k(r, d(xe, { get each() {
      return t.getDaysName();
    }, children: (i) => (() => {
      var s = Pd();
      return k(s, i), s;
    })() }), null), k(r, d(xe, { get each() {
      return e();
    }, children: (i) => d(re, { onClick: () => n(i), get variant() {
      return _c(i, t.value()) ? "default" : "ghost";
    }, get class() {
      return G("tw-size-8 tw-font-mono tw-text-xs", Gg(i) && "underline", !To(i, t.activeDate()) && "text-muted-foreground");
    }, get children() {
      return We(i, "d");
    } }) }), null), r;
  })();
}, K3 = () => {
  let t = xn(), e = () => Q2({ start: at(t.activeDate()), end: Sc(t.activeDate()) }), n = (r) => t.setValue(r);
  return (() => {
    var r = _3(), i = r.firstChild;
    return i.firstChild, k(i, d(xe, { get each() {
      return t.getDaysName();
    }, children: (s) => (() => {
      var o = Pd();
      return k(o, s), o;
    })() }), null), k(r, d(xe, { get each() {
      return e();
    }, children: (s) => {
      let o = Oc(s), a = $o(o), l = Mc({ start: s, end: o });
      return d(re, { onClick: () => n(Tc(s)), get variant() {
        return Os(o, t.value()) ? "default" : "ghost";
      }, class: "tw-grid tw-w-full tw-cursor-pointer tw-grid-cols-8 tw-place-items-center tw-p-0 tw-text-xs", get children() {
        return [(() => {
          var c = Dd();
          return k(c, a), oe(() => De(c, G("tw-flex tw-h-8 tw-w-8 tw-items-center tw-justify-center tw-border-r tw-border-border tw-font-mono tw-font-bold", Os(o, t.value()) && "border-none font-bold"))), c;
        })(), d(xe, { each: l, children: (c) => (() => {
          var u = S3(), f = u.firstChild;
          return k(f, () => We(c, "d")), oe(() => De(u, G("tw-flex tw-h-8 tw-w-8 tw-items-center tw-justify-center tw-font-mono", Os(o, t.value()) && "font-bold", !To(c, t.activeDate()) && "text-muted-foreground"))), u;
        })() })];
      } });
    } }), null), r;
  })();
}, B3 = () => {
  let t = xn(), e = () => {
    let r = tr(t.activeDate()), i = [];
    for (let s = 0; s < 12; s++)
      i.push(new Date(r, s, 1));
    return i;
  }, n = (r) => t.valueType === "month" ? t.setValue(r) : (t.setActiveDate(r), t.valueType === "week" ? t.setCalendar("week") : t.setCalendar("day"));
  return (() => {
    var r = $d();
    return k(r, d(xe, { get each() {
      return e();
    }, children: (i) => d(re, { size: "sm", onClick: () => n(i), get variant() {
      return To(i, t.value()) ? "default" : "ghost";
    }, get children() {
      return We(i, "MMM", { locale: t.locale() });
    } }) })), r;
  })();
}, j3 = () => {
  let t = xn(), e = () => {
    let r = Math.floor(tr(t.activeDate()) / 10) * 10, i = [];
    for (let s = r; s < r + 10; s++)
      i.push(s);
    return i;
  }, n = (r) => {
    if (t.valueType === "year")
      return t.setValue(new Date(r, 0, 1));
    t.setActiveDate(Xg(t.activeDate(), r)), t.setCalendar("month");
  };
  return (() => {
    var r = $d();
    return k(r, d(xe, { get each() {
      return e();
    }, children: (i) => d(re, { size: "sm", class: "tw-font-mono", onClick: () => n(i), get variant() {
      return tr(t.value()) === i ? "default" : "ghost";
    }, children: i }) })), r;
  })();
}, W3 = () => {
  let t = xn();
  return (() => {
    var e = M3();
    return k(e, d(te, { get when() {
      return t.calendar() === "day";
    }, get children() {
      return [d(Ol, {}), d(N3, {})];
    } }), null), k(e, d(te, { get when() {
      return t.calendar() === "week";
    }, get children() {
      return [d(Ol, {}), d(K3, {})];
    } }), null), k(e, d(te, { get when() {
      return t.calendar() === "month";
    }, get children() {
      return [d(R3, {}), d(B3, {})];
    } }), null), k(e, d(te, { get when() {
      return t.calendar() === "year";
    }, get children() {
      return [d(V3, {}), d(j3, {})];
    } }), null), e;
  })();
}, oi = (t) => {
  let [e, n] = K(t, ["class"]);
  return (() => {
    var r = Dd();
    return k(r, d(z3, D(n, { get children() {
      return d(W3, {});
    } }))), oe(() => De(r, G(e.class))), r;
  })();
}, zd = (t) => {
  let [e] = K(t, ["value", "setValue", "class"]), [n, r] = N(), i = () => Us(24), s = Us(60), o = Us(60);
  return Z(() => r(L3(t.value))), (() => {
    var a = O3(), l = a.firstChild;
    return k(l, d(qs, { get ticks() {
      return i();
    }, get tick() {
      var c;
      return (c = n()) == null ? void 0 : c.hour;
    }, setTick: (c) => {
      var u;
      r({ ...n(), hour: c }), (u = e.setValue) == null || u.call(e, Hs(n()));
    } }), null), k(l, d(qs, { ticks: s, get tick() {
      var c;
      return (c = n()) == null ? void 0 : c.minute;
    }, setTick: (c) => {
      var u;
      r({ ...n(), minute: c }), (u = e.setValue) == null || u.call(e, Hs(n()));
    } }), null), k(l, d(qs, { ticks: o, get tick() {
      var c;
      return (c = n()) == null ? void 0 : c.second;
    }, setTick: (c) => {
      var u;
      r({ ...n(), second: c }), (u = e.setValue) == null || u.call(e, Hs(n()));
    } }), null), oe(() => De(a, G("tw-relative tw-w-36", e.class))), a;
  })();
}, qs = (t) => {
  let e, [n, r] = N(), [i, s] = N(0), [o] = K(t, ["ticks", "tick", "setTick"]), [a, l] = N();
  Z(() => l(o.tick)), Z(() => s(n().clientHeight));
  let c = Od({ count: o.ticks.length, getScrollElement: () => n(), estimateSize: () => 32, scrollToFn: (f, h, m) => {
    let w = n();
    if (!w)
      return;
    let g = 1e3, p = w.scrollTop, v = e = Date.now(), b = () => {
      if (e !== v)
        return;
      let C = Date.now() - v, _ = F3(Math.min(C / g, 1)), E = p + (f - p) * _;
      C < g ? (bo(E, h, m), requestAnimationFrame(b)) : bo(E, h, m);
    };
    requestAnimationFrame(b);
  } });
  Z(() => {
    let f = a(), h = o.ticks.findIndex((m) => m === f);
    c.scrollToIndex(h, { align: "start" });
  });
  let u = (f) => {
    var h;
    l(f), (h = o.setTick) == null || h.call(o, f);
  };
  return (() => {
    var f = E3(), h = f.firstChild, m = h.nextSibling;
    return vt(r, f), k(h, d(xe, { get each() {
      return c.getVirtualItems();
    }, children: (w) => (() => {
      var g = P3(), p = c.measureElement;
      return typeof p == "function" ? vt(p, g) : c.measureElement = g, k(g, d(re, { class: "tw-size-10", onClick: () => {
        var v;
        return u((v = o.ticks) == null ? void 0 : v[w.index]);
      }, get variant() {
        var v;
        return a() === ((v = o.ticks) == null ? void 0 : v[w.index]) ? "default" : "ghost";
      }, get children() {
        var v = I3();
        return k(v, () => {
          var b;
          return (b = o.ticks) == null ? void 0 : b[w.index];
        }), v;
      } })), oe((v) => {
        var b = w.index, C = `${w.size}px`, _ = `translateY(${w.start}px)`;
        return b !== v.e && Xe(g, "data-index", v.e = b), C !== v.t && ((v.t = C) != null ? g.style.setProperty("height", C) : g.style.removeProperty("height")), _ !== v.a && ((v.a = _) != null ? g.style.setProperty("transform", _) : g.style.removeProperty("transform")), v;
      }, { e: void 0, t: void 0, a: void 0 }), g;
    })() })), oe((w) => {
      var g = `${c.getTotalSize()}px`, p = `${i() - 32}px`;
      return g !== w.e && ((w.e = g) != null ? h.style.setProperty("height", g) : h.style.removeProperty("height")), p !== w.t && ((w.t = p) != null ? m.style.setProperty("height", p) : m.style.removeProperty("height")), w;
    }, { e: void 0, t: void 0 }), f;
  })();
}, H3 = L("<div>"), ws = L('<div class="tw-flex tw-flex-row tw-gap-2">'), U3 = L('<div class="tw-flex tw-flex-col tw-gap-2"><div class="tw-flex tw-flex-1 tw-flex-row tw-gap-2">'), q3 = L('<div class="tw-flex tw-flex-col tw-items-center"><div class="tw-mt-2 tw-flex tw-w-full tw-justify-center tw-gap-2 tw-divide-x tw-border-t tw-border-border tw-pt-2"><div class="tw-flex tw-flex-1 tw-flex-col tw-gap-4 tw-pl-2">'), G3 = bn("tw-flex tw-h-9 tw-w-full tw-items-center tw-gap-2 tw-px-3 tw-py-1 tw-text-sm", { variants: { variant: { default: "tw-rounded-md tw-border tw-border-border tw-bg-background tw-shadow-sm tw-transition-colors placeholder:tw-text-muted-foreground focus-visible:tw-outline-none focus-visible:tw-ring-1 focus-visible:tw-ring-primary disabled:tw-cursor-not-allowed disabled:tw-opacity-50", ghost: "tw-border-none focus-visible:tw-outline-none disabled:tw-cursor-not-allowed disabled:tw-opacity-50" } }, defaultVariants: { variant: "default" } }), yr = (t) => {
  let [e, n] = K(t, ["class", "variant"]);
  return d(Zo, { get children() {
    var r = H3();
    return k(r, d(ub, { class: "tw-text-primary dark:tw-fill-primary/50" }), null), k(r, d(Jo, D({ class: "tw-flex-1 tw-bg-transparent" }, n)), null), oe(() => De(r, G(G3({ variant: e.variant }), e.class))), r;
  } });
}, xr = { now: "Now", today: "Today", thisWeek: "This Week", thisMonth: "This Month", thisYear: "This Year", reset: "Reest" }, ps = (t) => {
  let [e, n] = N(), [r, i] = N(!1);
  return Z(() => n(t.value)), { value: e, setValue: (s) => {
    var o;
    (o = t.setValue) == null || o.call(t, s), n(s), i(!1);
  }, isOpen: r, setIsOpen: i };
}, Rd = (t) => {
  let [e, n] = N(), [r, i] = N(!1);
  return Z(() => n(t.value)), Z(He(r, () => {
    r() || !t.setValue || t.setValue(e());
  }, { defer: !0 })), { value: e, setValue: (s) => {
    n(s);
  }, isOpen: r, setIsOpen: i };
}, Y3 = (t) => {
  let e = We(/* @__PURE__ */ new Date(), "yyyy-MM-dd"), n = D({ label: xr }, t), [r, i] = K(n, ["value", "setValue", "label"]), { value: s, setValue: o, isOpen: a, setIsOpen: l } = ps(n);
  return d(vr, { placement: "bottom-start", onOpenChange: l, get open() {
    return a() && !(t.readOnly || t.disabled);
  }, get children() {
    return [d(pr, { class: "tw-flex-1", get children() {
      return d(yr, D({ placeholder: e, get value() {
        return s() || "";
      } }, i));
    } }), d(br, { class: "tw-w-48 tw-min-w-min tw-space-y-2", get children() {
      return [d(oi, { type: "day", get value() {
        return s();
      }, setValue: o, get locale() {
        return t.locale;
      } }), (() => {
        var c = ws();
        return k(c, d(re, { size: "sm", class: "tw-w-full", variant: "default", onClick: () => o(e), get children() {
          return r.label.today;
        } }), null), k(c, d(re, { size: "sm", class: "tw-w-full", variant: "outline", onClick: () => o(void 0), get children() {
          return r.label.reset;
        } }), null), c;
      })()];
    } })];
  } });
}, X3 = (t) => {
  let e = D({ label: xr }, t), [n, r] = K(e, ["value", "setValue", "label"]), { value: i, setValue: s, isOpen: o, setIsOpen: a } = Rd(e);
  return d(vr, { placement: "bottom-start", onOpenChange: a, get open() {
    return o() && !(t.readOnly || t.disabled);
  }, get children() {
    return [d(pr, { class: "tw-flex-1", get children() {
      return d(yr, D({ placeholder: "07:00:00", get value() {
        return i() || "";
      } }, r));
    } }), d(br, { class: "tw-min-w-min tw-space-y-2", onOpenAutoFocus: (l) => l.preventDefault(), get children() {
      var l = U3(), c = l.firstChild;
      return k(l, d(zd, { class: "tw-flex tw-h-32", get value() {
        return i();
      }, setValue: s }), c), k(c, d(re, { size: "sm", class: "tw-flex-1", variant: "default", onClick: () => s(We(/* @__PURE__ */ new Date(), "HH:mm:ss")), get children() {
        return n.label.now;
      } }), null), k(c, d(re, { size: "sm", class: "tw-flex-1", variant: "outline", onClick: () => s(void 0), get children() {
        return n.label.reset;
      } }), null), l;
    } })];
  } });
}, Q3 = (t) => {
  let e = We(/* @__PURE__ */ new Date(), "yyyy-MM-dd'T'HH:mm:ss"), [n, r] = N(), [i, s] = N(), o = D({ label: xr }, t), [a, l] = K(o, ["value", "setValue", "label"]), { value: c, setValue: u, isOpen: f, setIsOpen: h } = Rd(o);
  Z(() => {
    let g = c();
    r(g ? We(new Date(g), "yyyy-MMM-dd") : void 0), s(g ? We(new Date(g), "HH:mm:ss") : "00:00:00");
  });
  let m = () => u(We(`${n()} ${i()}`, "yyyy-MM-dd'T'HH:mm:ss")), w = () => {
    let g = /* @__PURE__ */ new Date();
    r(We(g, "yyyy-MMM-dd")), s(We(g, "hh:mm:ss")), m();
  };
  return d(vr, { placement: "bottom-start", onOpenChange: h, get open() {
    return f() && !(t.readOnly || t.disabled);
  }, get children() {
    return [d(pr, { class: "tw-flex-1", get children() {
      return d(yr, D({ placeholder: e, get value() {
        return c() || "";
      } }, l));
    } }), d(br, { class: "tw-space-y-2", get children() {
      var g = q3(), p = g.firstChild, v = p.firstChild;
      return k(g, d(oi, { type: "day", get value() {
        return n();
      }, get locale() {
        return t.locale;
      }, setValue: (b) => {
        r(b), m();
      } }), p), k(p, d(zd, { class: "tw-h-20", get value() {
        return i();
      }, setValue: (b) => {
        s(b), m();
      } }), v), k(v, d(re, { size: "sm", class: "tw-w-full", variant: "default", onClick: w, get children() {
        return a.label.now;
      } }), null), k(v, d(re, { size: "sm", class: "tw-w-full", variant: "outline", onClick: () => u(void 0), get children() {
        return a.label.reset;
      } }), null), g;
    } })];
  } });
}, J3 = (t) => {
  let e = Ld(/* @__PURE__ */ new Date()), n = D({ label: xr }, t), [r, i] = K(n, ["value", "setValue", "label"]), { value: s, setValue: o, isOpen: a, setIsOpen: l } = ps(n);
  return d(vr, { placement: "bottom-start", onOpenChange: l, get open() {
    return a() && !(t.readOnly || t.disabled);
  }, get children() {
    return [d(pr, { class: "tw-flex-1", get children() {
      return d(yr, D({ placeholder: e, get value() {
        return s() || "";
      } }, i));
    } }), d(br, { class: "tw-min-w-min tw-space-y-2", get children() {
      return [d(oi, { type: "week", get value() {
        return s();
      }, setValue: o, get locale() {
        return t.locale;
      } }), (() => {
        var c = ws();
        return k(c, d(re, { size: "sm", class: "tw-w-full", variant: "default", onClick: () => o(e), get children() {
          return r.label.thisWeek;
        } }), null), k(c, d(re, { size: "sm", class: "tw-w-full", variant: "outline", onClick: () => o(void 0), get children() {
          return r.label.reset;
        } }), null), c;
      })()];
    } })];
  } });
}, Z3 = (t) => {
  let e = We(/* @__PURE__ */ new Date(), "yyyy-MM"), n = D({ label: xr }, t), [r, i] = K(n, ["value", "setValue", "label"]), { value: s, setValue: o, isOpen: a, setIsOpen: l } = ps(n);
  return d(vr, { placement: "bottom-start", onOpenChange: l, get open() {
    return a() && !(t.readOnly || t.disabled);
  }, get children() {
    return [d(pr, { class: "tw-flex-1", get children() {
      return d(yr, D({ placeholder: e, get value() {
        return s() || "";
      } }, i));
    } }), d(br, { class: "tw-min-w-56 tw-space-y-2", get children() {
      return [d(oi, { type: "month", get value() {
        return s();
      }, setValue: o, get locale() {
        return t.locale;
      } }), (() => {
        var c = ws();
        return k(c, d(re, { size: "sm", class: "tw-w-full", variant: "default", onClick: () => o(e), get children() {
          return r.label.thisMonth;
        } }), null), k(c, d(re, { size: "sm", class: "tw-w-full", variant: "outline", onClick: () => o(void 0), get children() {
          return r.label.reset;
        } }), null), c;
      })()];
    } })];
  } });
}, e5 = (t) => {
  let e = tr(/* @__PURE__ */ new Date()).toString(), n = D({ label: xr }, t), [r, i] = K(n, ["value", "setValue", "label"]), { value: s, setValue: o, isOpen: a, setIsOpen: l } = ps(n);
  return d(vr, { placement: "bottom-start", onOpenChange: l, get open() {
    return a() && !(t.readOnly || t.disabled);
  }, get children() {
    return [d(pr, { class: "tw-flex-1", get children() {
      return d(yr, D({ placeholder: e, get value() {
        return s() || "";
      } }, i));
    } }), d(br, { class: "tw-min-w-min tw-space-y-2", get children() {
      return [d(oi, { type: "year", get value() {
        return s();
      }, setValue: o, get locale() {
        return t.locale;
      } }), (() => {
        var c = ws();
        return k(c, d(re, { size: "sm", class: "tw-w-full", variant: "default", onClick: () => o(e), get children() {
          return r.label.thisYear;
        } }), null), k(c, d(re, { size: "sm", class: "tw-w-full", variant: "outline", onClick: () => o(void 0), get children() {
          return r.label.reset;
        } }), null), c;
      })()];
    } })];
  } });
};
function yo(t) {
  return typeof t != "string" ? t : t.replace(/<\/?[^>]+(>|$)/g, "").replace(/&[^;]+;/g, "");
}
const El = (t) => t ? t.replace(/a/g, "_").replace(/9/g, "#") : "", t5 = (t) => typeof t != "string" ? t : t.replace(/[^a-zA-Z0-9]/g, ""), Nr = (t) => typeof t != "string" ? t : JSON.parse(t), n5 = (t) => {
  if (t !== void 0)
    return t.map((e) => {
      let n = "";
      return (typeof e == "string" || typeof e == "number") && (n = e), typeof e == "object" && !Array.isArray(e) && (n = e.label || e.value), String(n);
    });
}, r5 = (t, e) => yo(A(t.label)).toLowerCase().includes(e.toLowerCase()) || yo(A(t.section)).toLowerCase().includes(e.toLowerCase());
var i5 = /* @__PURE__ */ L('<div class="tw-flex tw-flex-col tw-overflow-hidden">'), s5 = /* @__PURE__ */ L('<div class="tw-text-xs tw-text-muted-foreground">'), o5 = /* @__PURE__ */ L('<div class="tw-line-clamp-2 tw-font-semibold tw-text-foreground/80">'), a5 = /* @__PURE__ */ L("<ul>"), l5 = /* @__PURE__ */ L('<div class="tw-flex tw-h-full tw-flex-col tw-items-center tw-justify-between">'), c5 = /* @__PURE__ */ L("<li>"), u5 = /* @__PURE__ */ L('<div class="tw-grid tw-grid-cols-2 tw-gap-4">'), d5 = /* @__PURE__ */ L('<button><span class="tw-text-xl tw-font-medium"></span><span>'), f5 = /* @__PURE__ */ L('<div class="tw-flex tw-flex-col-reverse tw-justify-end tw-gap-2 sm:tw-flex-row"><div class=tw-flex>'), h5 = /* @__PURE__ */ L('<div class="tw-flex tw-flex-col tw-gap-4">');
const g5 = (t) => {
  const e = ht(), [n, r] = N(""), i = (o) => {
    n1(o.dataKey), e.closeAll();
  }, s = () => t.items.filter((o) => r5(o, n()));
  return (() => {
    var o = i5();
    return k(o, d(Ot, {
      class: "tw-p-1",
      get children() {
        return d(jt, {
          type: "text",
          get placeholder() {
            return A("search") + "...";
          },
          get value() {
            return n();
          },
          onInput: (a) => r(a.target.value)
        });
      }
    }), null), k(o, d(td, {
      class: "tw-flex tw-flex-col tw-gap-2 tw-overflow-hidden",
      get children() {
        return [d(nd, {
          class: "tw-table tw-w-full tw-flex-1 tw-table-fixed",
          get children() {
            return d(Vr, {
              class: "tw-pl-4",
              get children() {
                return [d(Si, {
                  class: "tw-w-10",
                  get children() {
                    return A("no.");
                  }
                }), d(Si, {
                  get children() {
                    return A("question");
                  }
                }), d(Si, {
                  class: "tw-w-12 tw-text-center",
                  get children() {
                    return A("view");
                  }
                })];
              }
            });
          }
        }), d(rd, {
          class: "tw-block tw-overflow-auto",
          get children() {
            return [d(te, {
              get when() {
                return s().length;
              },
              get children() {
                return d(xe, {
                  get each() {
                    return s();
                  },
                  children: (a, l) => d(Vr, {
                    class: "tw-table tw-w-full even:tw-bg-muted/75",
                    get children() {
                      return [d($r, {
                        class: "tw-w-10 tw-select-none tw-align-top",
                        get children() {
                          return l() + 1;
                        }
                      }), d($r, {
                        class: "tw-align-top",
                        get children() {
                          return [(() => {
                            var c = s5();
                            return k(c, () => A(a.section)), c;
                          })(), (() => {
                            var c = o5();
                            return k(c, () => yo(A(a.label))), c;
                          })(), d(te, {
                            get when() {
                              return t.type === "error" || t.type === "warning";
                            },
                            get children() {
                              var c = a5();
                              return k(c, d(xe, {
                                get each() {
                                  return a.validationMessage;
                                },
                                children: (u) => (() => {
                                  var f = c5();
                                  return k(f, () => A(u, a.validationParams)), oe(() => {
                                    var h;
                                    return De(f, G((((h = a.validationMessage) == null ? void 0 : h.length) ?? 0) > 1 && "pl-2"));
                                  }), f;
                                })()
                              })), oe(() => {
                                var u;
                                return De(c, G("tw-mt-0.5 tw-list-outside tw-pt-0.5", t.type === "error" && "tw-text-destructive", t.type === "warning" && "tw-text-foreground", (((u = a.validationMessage) == null ? void 0 : u.length) ?? 0) > 1 && "list-['-'] pl-1"));
                              }), c;
                            }
                          })];
                        }
                      }), d($r, {
                        class: "tw- tw-w-12 tw-align-top",
                        get children() {
                          var c = l5();
                          return k(c, d(re, {
                            color: "primary",
                            variant: "ghost",
                            class: "tw-text-primary-500",
                            get title() {
                              return A("view");
                            },
                            onClick: () => i(a),
                            get children() {
                              return d(Pb, {});
                            }
                          })), c;
                        }
                      })];
                    }
                  })
                });
              }
            }), d(te, {
              get when() {
                return !t.items.length;
              },
              get children() {
                return d(Vr, {
                  class: "tw-table tw-w-full tw-table-fixed",
                  get children() {
                    return d($r, {
                      class: "tw-text-center",
                      children: "No data"
                    });
                  }
                });
              }
            })];
          }
        })];
      }
    }), null), o;
  })();
}, m5 = (t) => {
  const e = ht(), n = {
    error: "Error",
    blank: "Blank",
    answer: "Answer",
    warning: "Warning"
  }, r = () => Object.keys(n).map((s) => ({
    type: s,
    title: A(n[s]),
    total: t.summary[s].length
  })), i = (s) => {
    if (s !== "answer")
      return e.open({
        title: A(n[s]),
        children: () => d(g5, {
          get items() {
            return t.summary[s];
          },
          type: s
        })
      });
  };
  return (() => {
    var s = u5();
    return k(s, d(xe, {
      get each() {
        return r();
      },
      children: (o) => (() => {
        var a = d5(), l = a.firstChild, c = l.nextSibling;
        return a.$$click = () => i(o.type), k(l, () => o.total), k(c, () => o.title), oe((u) => {
          var f = G("tw-flex tw-flex-col tw-items-center tw-justify-center tw-rounded-md tw-bg-muted tw-py-4 tw-duration-200 hover:tw-bg-muted/50", o.type !== "answer" && "cursor-pointer"), h = G("tw-text-sm tw-font-light");
          return f !== u.e && De(a, u.e = f), h !== u.t && De(c, u.t = h), u;
        }, {
          e: void 0,
          t: void 0
        }), a;
      })()
    })), s;
  })();
}, Vd = () => {
  const t = Gc(), e = ht(), [n, r] = N(!1), i = () => ae.getSummary().error.length > 0, s = async (c = !1) => {
    try {
      r(!0), V2(c), t.show(A("submit.success")), e.closeAll();
    } catch (u) {
      t.destructive(String(u));
    } finally {
      r(!1);
    }
  }, o = async (c = !1) => {
    e.openConfirmModal({
      title: A("submit.confirm.title"),
      onConfirm: () => {
        s(c), e.close();
      },
      children: () => A("submit.confirm.message")
    });
  }, a = () => ae.isForceSubmitEnabled(), l = () => o(!0);
  return (() => {
    var c = h5();
    return k(c, d(m5, {
      get summary() {
        return ae.getSummary();
      }
    }), null), k(c, d(te, {
      get when() {
        return ae.config.formMode === Nt.Open;
      },
      get children() {
        var u = f5(), f = u.firstChild;
        return k(u, d(re, {
          variant: "outline",
          onClick: () => e.closeAll(),
          get children() {
            return A("cancel");
          }
        }), f), k(f, d(re, {
          onClick: () => o(),
          get class() {
            return G("tw-w-full sm:tw-w-auto tw-border-r-background tw-border-r-2", {
              "tw-rounded-r-none": a()
            });
          },
          get disabled() {
            return i();
          },
          get variant() {
            return n() ? "loading" : "default";
          },
          get children() {
            return A("submit");
          }
        }), null), k(f, d(te, {
          get when() {
            return a();
          },
          get children() {
            return d(Yb, {
              placement: "bottom-end",
              get children() {
                return [d(Gb, {
                  get children() {
                    return d(re, {
                      class: "tw-w-full tw-rounded-l-none tw-px-2 sm:tw-w-auto",
                      get children() {
                        return d(wb, {});
                      }
                    });
                  }
                }), d(Xb, {
                  get children() {
                    return d(Qb, {
                      class: "tw-cursor-pointer",
                      onClick: l,
                      get children() {
                        return A("force.submit");
                      }
                    });
                  }
                })];
              }
            });
          }
        }), null), u;
      }
    }), null), c;
  })();
};
qi(["click"]);
var w5 = /* @__PURE__ */ L('<div class="tw-border-b tw-py-2"><div class="tw-container tw-flex tw-flex-1 tw-items-center tw-justify-between tw-gap-2 tw-px-4"><div class="tw-flex tw-items-center tw-justify-start tw-gap-2"><div class=tw-flex-1><h1 class="tw-line-clamp-2 tw-text-sm tw-font-bold"></h1><h2 class="tw-line-clamp-2 tw-hidden tw-text-xs tw-text-muted-foreground @5xl/main:tw-block">');
const p5 = () => {
  const t = ht();
  return (() => {
    var e = w5(), n = e.firstChild, r = n.firstChild, i = r.firstChild, s = i.firstChild, o = s.nextSibling;
    return k(r, d(re, {
      size: "icon",
      role: "button",
      variant: "ghost",
      class: "@5xl/main:tw-hidden",
      "aria-label": "sidebar-toggle",
      onClick: () => Qr(),
      get children() {
        return d(Mb, {
          class: "tw-size-4"
        });
      }
    }), i), k(s, () => A(ae.meta.template.title)), k(o, () => A(ae.meta.template.description)), k(n, d(re, {
      color: "primary",
      variant: "outline",
      class: "tw-font-semibold",
      onClick: () => t.open({
        title: A(ae.config.formMode === Nt.Open ? "submit" : "summary"),
        children: () => d(Vd, {})
      }),
      get children() {
        return [J(() => J(() => ae.config.formMode === Nt.Open)() ? d(ud, {
          class: "tw-mr-2 tw-size-4"
        }) : d(Ib, {
          class: "tw-mr-2 tw-size-4"
        })), J(() => A(ae.config.formMode === Nt.Open ? "submit" : "summary"))];
      }
    }), null), e;
  })();
}, v5 = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20width='3272'%20height='3577'%20fill='none'%20xmlns:v='https://vecta.io/nano'%3e%3cg%20fill-rule='evenodd'%3e%3cuse%20xlink:href='%23B'%20fill='%237f7fbf'/%3e%3cuse%20xlink:href='%23B'%20fill='%232563eb'/%3e%3cuse%20xlink:href='%23C'%20fill='%237fbfff'/%3e%3cuse%20xlink:href='%23C'%20fill='%232aaaff'/%3e%3cuse%20xlink:href='%23C'%20fill='%232563eb'/%3e%3cuse%20xlink:href='%23D'%20fill='%237fffff'/%3e%3cuse%20xlink:href='%23D'%20fill='%230ff'/%3e%3cpath%20d='M1035.31%201.463c-19.31%201.827-43.09%209.126-59.867%2018.376-8.633%204.759-16.006%209.359-18.632%2011.624-1.375%201.186-3.625%202.859-5%203.717-7.611%204.752-28.804%2027.191-36.175%2038.304-3.074%204.635-11.825%2019.478-11.825%2020.058%200%20.215-1.337%203.312-2.972%206.88s-3.283%207.743-3.663%209.275-1.968%205.641-3.528%209.13-2.837%207.014-2.837%207.833-1.383%204.64-3.073%208.491-3.686%208.877-4.435%2011.168-3.131%208.89-5.292%2014.665l-5.745%2015.5-11.399%2030.5-7.017%2019-6.483%2017.5c-2.771%207.111-5.998%2015.835-11.654%2031.5l-7.563%2020.5-10.824%2029-4.241%2011.5-10.978%2030.235c-.493%201.639-14.301%201.749-251.159%202l-250.637.265-12.5%202.349c-19.592%203.683-44.873%2012.94-54.966%2020.127-1.564%201.113-3.115%202.024-3.449%202.024-.764%200-9.386%206.009-16.585%2011.558-7.104%205.476-18.696%2017.257-26.059%2026.483-11.358%2014.233-20.65%2030.945-26.942%2048.459-3.341%209.3-3.859%2011.171-6.656%2024-3.394%2015.574-4.341%2042.12-1.997%2056%202.449%2014.504%205.337%2026.647%207.572%2031.833%201.145%202.658%202.082%205.274%202.082%205.813%200%201.174%209.159%2019.89%2012.162%2024.854%203.083%205.095%209.956%2015.181%2011.924%2017.5%203.094%203.643%2015.167%2016.878%2022.847%2025.047l15.067%2016.044%2022%2023.401%2021%2022.326%2013%2013.716%2033.496%2035.501%2021%2022.45%2015.004%2015.89%2025%2026.527%2016%2016.952%2019%2020.115%2021.152%2022.453%2011.87%2012.828%203.719%204.25H3004.53l2.05-5.75%2011.97-32.25%205.76-15.5%207.97-21.5%207.04-19%2012.44-33.5%207.03-19%205.97-16.242%2012.59-33.758%206.47-17.5%206.52-17.5%207.49-20%205.96-16%2012.88-35%2012.6-34%2013.79-37%205.76-15.5%206.47-17.5%207.24-19.5%206.31-17%206.46-17.5%2013-35%207.06-19%206.49-17.5%206.5-17.5%205.98-16%205.94-16%207.01-19%2012.7-34.5c1.05-3.025%202.34-6.4%202.87-7.5.54-1.1%202.27-5.6%203.86-10l6.58-18c12.75-34.483%2015.64-45.621%2017.57-67.584%203.62-41.262-13.04-90.163-41.54-121.886-9.4-10.475-28.28-27.18-32.51-28.77-.82-.311-2.17-1.126-3-1.811-1.33-1.103-5.08-3.236-15.5-8.81-16.25-8.693-39.19-14.92-61.06-16.576-21.72-1.644-2064.48-1.237-2081.94.415z'%20fill='%2322d3ee'/%3e%3c/g%3e%3cdefs%20%3e%3cpath%20id='B'%20d='M1037.31%201.097c-14.99%201.133-33.99%205.841-46.276%2011.47-2.903%201.329-5.696%202.417-6.206%202.417s-3.219%201.35-6.017%203-5.451%203-5.896%203c-1.254%200-16.504%2010.263-17.404%2011.712-.44.708-1.285%201.288-1.878%201.288-2.585%200-30.822%2027.486-30.822%2030.002%200%20.378-.954%201.545-2.12%202.593-3.102%202.788-8.488%2011.382-16.235%2025.905-2.892%205.421-7.645%2016.612-7.645%2018%200%20.748-1.328%204.23-2.952%207.738s-3.189%207.727-3.48%209.376-1.241%204.429-2.113%206.175-2.845%206.672-4.386%2010.944l-11.432%2030.639c-.901%202.13-1.637%204.48-1.637%205.223s-1.086%203.725-2.414%206.628-3.633%208.652-5.122%2012.777l-12.483%2034c-4.074%2010.669-8.318%2022.311-11.667%2032-1.425%204.125-2.932%207.95-3.348%208.5s-1.663%203.925-2.77%207.5-2.999%208.75-4.203%2011.5-3.223%207.925-4.485%2011.5l-12.505%2034c-1.755%204.675-4.008%2010.975-5.008%2014s-2.738%207.631-3.864%2010.235l-2.047%204.734-500.584.531-12.5%202.308c-6.875%201.27-15.875%203.446-20%204.836s-8.85%202.877-10.5%203.304c-2.808.728-11.701%204.97-24.5%2011.684-11.427%205.994-29.838%2021.356-42.582%2035.532-3.903%204.341-12.93%2017.332-17.16%2024.693-9.617%2016.738-15.085%2030.984-19.437%2050.643-2.601%2011.75-3.175%2016.793-3.576%2031.38-.478%2017.398.196%2025.332%203.367%2039.62%202.238%2010.086%205.648%2021.542%206.583%2022.121.443.273.805%201.261.805%202.195%200%201.782%209.74%2022.32%2010.995%2023.184.399.275%201.503%202.016%202.453%203.869%201.999%203.9%208.361%2013.165%2010.047%2014.631.633.55%201.568%201.741%202.078%202.648.837%201.487%2014.565%2016.616%2023.427%2025.817l10.962%2011.585%2015.502%2016.45%2021.538%2022.937%2030.248%2031.81c5.362%205.512%209.75%2010.297%209.75%2010.631s3.038%203.667%206.75%207.405c7.244%207.294%2013.778%2014.185%2035.75%2037.706l19.669%2020.999%2014%2014.87%2014.831%2015.676%2046.775%2049.716%209.532%2010.25H3004.57l1.21-3.25%203.53-9.25c1.28-3.3%203.23-8.7%204.33-12s3.87-10.725%206.15-16.5%204.75-12.525%205.48-15c.74-2.475%202.69-7.875%204.34-12%206.3-15.73%209.22-23.54%209.21-24.657-.01-.636%201.29-4.05%202.87-7.585%201.59-3.536%203.21-7.9%203.61-9.698.39-1.798%201.65-5.359%202.8-7.914%201.14-2.555%203.38-8.246%204.96-12.646l6.36-17.5%204.84-13.5c.74-2.2%202.34-6.25%203.54-9a152.84%20152.84%200%200%200%204.03-10.5c2.89-8.592%207.91-22.194%209.42-25.5.76-1.65%202.05-5.25%202.87-8%20.83-2.75%202.67-7.6%204.1-10.779%201.42-3.178%202.59-6.427%202.59-7.221s1.16-4.043%202.58-7.221%203.84-9.379%205.39-13.779l8.56-23.5%204.42-12c1.55-4.402%206.91-18.885%2011.1-30l6.45-17.5%205.27-14c4.48-11.075%208.23-21.197%208.23-22.23%200-.601%201.58-4.773%203.5-9.27%201.93-4.497%203.5-8.756%203.5-9.464s1.09-3.745%202.42-6.75%203.6-8.913%205.06-13.13c1.45-4.217%203.29-8.903%204.08-10.412.78-1.509%201.43-3.536%201.43-4.505.01-.968.91-3.682%202.02-6.031%201.1-2.349%203.53-8.532%205.4-13.739l4.64-12.969c1.48-4.138%204.72-12.67%205.88-15.5%202.41-5.888%207.32-19.395%207.99-22%20.43-1.65%201.69-5.025%202.81-7.5%201.11-2.475%202.59-6.3%203.29-8.5%201.42-4.505%202.01-6.028%204.93-12.695%201.13-2.582%202.05-5.353%202.05-6.157s1.35-4.466%203-8.138c1.64-3.672%203.18-7.711%203.41-8.976s1.8-5.606%203.5-9.648%203.09-7.84%203.09-8.441%201.58-4.727%203.5-9.169c1.93-4.442%203.5-8.739%203.5-9.549s.98-3.667%202.17-6.35c1.2-2.682%203.38-8.252%204.86-12.377l4.47-12.5c.99-2.75%203.08-8.041%204.65-11.759s2.85-7.455%202.85-8.306c0-1.365%202.22-7.033%205.08-12.935.53-1.1%201.14-2.974%201.37-4.165.22-1.191%201.79-5.458%203.48-9.481s3.07-7.825%203.07-8.448%201.39-4.455%203.08-8.518%203.22-8.063%203.39-8.888c.18-.825%201.67-5.55%203.32-10.5%205.89-17.696%208.84-42.441%207.23-60.748-1.21-13.745-5.34-35-8.02-41.261-1.09-2.541-2.16-5.604-2.38-6.806-.49-2.656-9.67-21.639-13.15-27.185-1.38-2.2-3.03-5.013-3.65-6.25-.63-1.238-1.52-2.25-1.98-2.25s-.84-.575-.84-1.277-1.35-2.755-3-4.562-3-3.638-3-4.071c0-.978-20.45-21.603-25.09-25.308-6.5-5.184-12.79-9.782-13.39-9.782-.69%200-6.3-3.88-8.31-5.75-.75-.687-1.98-1.25-2.75-1.25-.76%200-3.52-1.35-6.12-3s-5.31-3-6.02-3-4.11-1.376-7.55-3.058c-3.45-1.682-8.07-3.45-10.27-3.929s-7.6-1.847-12-3.039c-10.89-2.951-10.29-2.858-25.5-3.97-16.71-1.221-2064.31-1.114-2080.5.109zM814.819%201095.23c-1.034%202.34-2.09%205.42-2.349%206.84-.258%201.43-1.783%205.93-3.39%2010-1.606%204.08-3.62%209.44-4.476%2011.91l-8.852%2025c-1.499%204.13-3.517%209.98-4.485%2013-.967%203.03-2.59%207.17-3.607%209.21s-1.849%204.64-1.849%205.77-.434%202.83-.965%203.79c-2.052%203.69-5.035%2011.2-5.035%2012.67%200%20.85-1.575%205.34-3.5%2010-1.925%204.65-3.5%209.09-3.5%209.88s-.839%203.4-1.865%205.81c-2.552%205.99-3.393%208.17-3.689%209.56-.54%202.56-2.744%208.87-3.428%209.81-.397.55-1.523%203.48-2.502%206.5-.979%203.03-2.994%208.88-4.476%2013l-4.491%2012.5-5.779%2016.5c-2.19%206.33-4.385%2011.93-4.876%2012.45-.492.53-.894%201.74-.894%202.7s-1.535%205.71-3.412%2010.55c-3.228%208.33-7.694%2020.95-10.546%2029.8a97.19%2097.19%200%200%201-3.19%208.25c-1.046%202.34-2.179%205.72-2.518%207.5-.338%201.79-.946%203.7-1.351%204.25s-2.647%206.63-4.983%2013.5c-2.336%206.88-4.619%2012.97-5.072%2013.54s-1.278%202.82-1.834%205c-1.183%204.64-8.096%2024.18-10.6%2029.96-.952%202.2-2.37%206.45-3.15%209.45-.781%202.99-1.835%205.94-2.344%206.55-.509.62-1.58%203.57-2.38%206.56s-2.786%208.82-4.413%2012.94c-1.626%204.13-3.729%209.75-4.672%2012.5l-5.514%2015.5-5.028%2014c-.677%201.93-2.134%205.9-3.237%208.82-3.205%208.5-8.709%2024.29-10.175%2029.18a98.58%2098.58%200%200%201-3.453%209.31c-1.157%202.64-2.846%207.37-3.752%2010.5s-2.712%208.03-4.012%2010.88-2.364%205.93-2.364%206.85c0%20.91-.612%203.08-1.359%204.81-2.833%206.57-3.791%209.18-8.78%2023.96-2.82%208.36-5.47%2015.64-5.889%2016.19s-1.694%204.04-2.832%207.75c-1.139%203.7-3.164%209.55-4.501%2013-1.337%203.44-2.723%207.54-3.081%209.11-.359%201.58-1.493%204.73-2.521%207-1.028%202.28-2.419%205.94-3.091%208.14s-2.328%206.7-3.678%2010-2.619%206.83-2.82%207.83c-.599%203.02-1.59%206-3.046%209.17-1.757%203.84-9.304%2025.05-10.315%2029-.422%201.65-1.647%205.03-2.721%207.5-1.075%202.48-2.555%206.53-3.289%209-.735%202.48-1.913%205.85-2.618%207.5s-2.718%207.28-4.474%2012.5c-1.756%205.23-3.801%2010.68-4.545%2012.12s-1.567%203.8-1.829%205.25c-.263%201.44-1.794%206.12-3.402%2010.38l-4.718%2012.75-5.204%2014.5-5.712%2016.5a205.63%20205.63%200%200%201-4.938%2013.22c-1.45%203.42-2.637%206.94-2.637%207.82%200%20.87-1.064%203.93-2.364%206.78s-3.105%207.75-4.012%2010.88-2.584%207.86-3.729%2010.5-2.283%205.87-2.53%207.18c-.247%201.3-1.604%205.13-3.017%208.5s-2.917%207.7-3.343%209.62c-.427%201.93-2.125%206.88-3.776%2011-1.65%204.13-3.532%209.08-4.184%2011-5.177%2015.31-7.094%2020.5-10.222%2027.7-1.003%202.31-1.826%205.01-1.829%206s-.593%202.93-1.31%204.3c-.718%201.38-2.132%204.98-3.144%208l-5.066%2014.5-4.434%2012.5c-3.868%2011.22-5.742%2016.39-8.719%2024.03-1.827%204.68-3.321%209.08-3.321%209.77s-1.287%204.5-2.86%208.48c-3.028%207.65-4.607%2012.03-9.277%2025.72-1.595%204.68-3.531%209.85-4.304%2011.5s-1.699%204.35-2.06%206-1.051%203.9-1.536%205c-2.521%205.72-5.963%2015-5.963%2016.07%200%20.67-1.35%204.4-3%208.27-1.65%203.88-3%207.78-3%208.66%200%20.89-.82%203.5-1.823%205.81-2.602%205.98-4.542%2011.18-7.167%2019.19-1.262%203.85-2.616%207.45-3.011%208s-.995%202.47-1.333%204.25c-.339%201.79-1.472%205.17-2.518%207.5-1.046%202.34-2.465%206.05-3.152%208.25s-2.295%206.7-3.571%2010-2.838%208.03-3.47%2010.5c-.633%202.48-1.516%204.95-1.964%205.5s-2.704%206.63-5.015%2013.5c-2.312%206.88-4.538%2012.95-4.949%2013.5s-1.023%202.47-1.361%204.25c-.339%201.79-1.593%205.39-2.788%208-1.195%202.62-3.2%207.9-4.457%2011.75-2.951%209.05-8.331%2024.38-12.985%2037l-5.143%2014.5c-.802%202.48-2.509%207.2-3.794%2010.5s-3.111%208.48-4.057%2011.5c-.946%203.03-2.496%207.3-3.444%209.5s-2.863%207.38-4.255%2011.5c-3.198%209.48-4.272%2012.46-8.399%2023.26-1.839%204.82-3.344%209.27-3.344%209.9%200%201.34-5.01%2015.3-9.092%2025.34-1.566%203.85-3.143%208.35-3.505%2010-.679%203.1-3.874%2011.67-5.489%2014.74-.503.95-.914%202.36-.914%203.11%200%20.76-1.354%204.66-3.01%208.68-1.655%204.01-3.196%208.24-3.425%209.38-.589%202.97-2.717%208.91-3.612%2010.09-.417.55-1.27%203.03-1.897%205.5-.627%202.48-1.547%205.4-2.045%206.5-1.26%202.79-5.331%2013.92-7.498%2020.5-.995%203.03-2.169%205.97-2.609%206.54s-1.238%202.82-1.774%205c-.877%203.57-2.909%209.37-9.261%2026.46l-2.881%207.5c-.461%201.1-1.055%203.13-1.321%204.5-.266%201.38-1.69%205.37-3.163%208.87-1.474%203.51-2.866%207.4-3.093%208.65s-1.763%205.45-3.412%209.33c-1.649%203.87-2.999%207.77-2.999%208.65%200%20.89-.943%203.68-2.097%206.22-1.153%202.53-3.575%208.91-5.383%2014.19l-9.056%2025.59c-1.809%204.95-4.057%2011.42-4.995%2014.37s-2.324%206.55-3.081%208-1.378%203.37-1.382%204.26-1.095%204.09-2.427%207.1-2.925%207.45-3.542%209.87-1.527%205.3-2.024%206.4c-3.675%208.14-5.013%2011.61-5.013%2013.02%200%20.89-1.319%204.85-2.931%208.8-3.371%208.26-8.889%2023.78-10.019%2028.18-.424%201.65-2.121%206.38-3.77%2010.5-1.65%204.13-3.696%209.53-4.547%2012l-3.269%209.5c-2.455%207.13-8.161%2022.72-11.559%2031.57-1.598%204.16-2.905%208.33-2.905%209.26s-.838%203.6-1.863%205.93c-2.844%206.48-4.954%2011.98-5.652%2014.74-.347%201.38-1.667%205.2-2.932%208.5s-3.1%208.48-4.076%2011.5c-.975%203.03-2.113%205.95-2.527%206.5s-1.267%203.03-1.894%205.5c-.627%202.48-1.58%205.4-2.119%206.5-.852%201.74-3.986%2010.36-10.547%2029l-4.443%2012.5-4.463%2013c-.979%203.03-2.083%205.95-2.452%206.5s-1.261%203.03-1.981%205.5c-.721%202.48-1.895%205.85-2.609%207.5-.715%201.66-2.402%206.38-3.75%2010.5-1.348%204.13-3.63%2010.3-5.071%2013.72s-2.624%207.02-2.627%208-.668%203.05-1.476%204.6-2.681%206.5-4.161%2011-3.56%2010.21-4.622%2012.68c-1.062%202.48-2.528%206.53-3.259%209-.73%202.48-3.134%209.45-5.341%2015.5l-5.737%2016a294.27%20294.27%200%200%201-3.549%209.66c-1.004%202.56-3.176%208.69-4.826%2013.62-1.65%204.92-3.678%2010.25-4.506%2011.84-.827%201.58-1.507%203.68-1.511%204.66-.003.97-1.317%205.02-2.919%209-1.602%203.97-3.566%209.25-4.365%2011.72-2.349%207.29-5.776%2016.89-9.366%2026.26-1.846%204.82-3.356%209.37-3.356%2010.11%200%20.75-1.35%204.33-3%207.97s-3%207.28-3%208.09-1.621%205.66-3.602%2010.77c-5.807%2015-9.045%2024-10.367%2028.8-.681%202.48-1.582%204.95-2.004%205.5-.776%201.02-3.069%207.63-3.403%209.81-.1.66-1.558%204.79-3.24%209.19l-4.612%2012.5c-.854%202.48-2.463%206.87-3.576%209.75-1.113%202.89-1.831%205.25-1.596%205.25s-.312%201.69-1.215%203.75c-1.444%203.3-5.215%2013.55-10.943%2029.75l-4.455%2012.5-4.477%2012.5-3.829%2011c-1.12%203.3-2.592%207.35-3.27%209s-2.67%207.28-4.426%2012.5c-1.756%205.23-3.805%2010.69-4.554%2012.14-.749%201.44-1.625%204.12-1.946%205.95s-1.175%204.69-1.895%206.37c-3.309%207.7-3.848%209.39-4.636%2014.54-.463%203.03-1.555%208.65-2.428%2012.5-2.113%209.32-3.057%2034.73-1.697%2045.67%203.073%2024.71%2012.404%2051.95%2024.267%2070.83%202.244%203.57%204.379%206.72%204.744%207s1.301%201.74%202.081%203.25c.779%201.52%201.779%202.75%202.222%202.75s1.454%201.24%202.246%202.75c1.482%202.83%2020.989%2023.25%2022.211%2023.25.376%200%201.974%201.35%203.55%203s3.206%203%203.62%203%202.547%201.57%204.741%203.48c2.194%201.92%204.344%203.49%204.778%203.5s3.129%201.6%205.987%203.52c2.859%201.93%205.521%203.5%205.917%203.5s3.009%201.35%205.807%203%205.587%203%206.197%203%204.015%201.38%207.566%203.05c3.552%201.68%208.32%203.43%2010.597%203.88%202.277.46%208.64%202.13%2014.14%203.7l10%202.87h490l495.999-.69c14.46-1.67%2038.16-9.52%2054.5-18.06%208.64-4.52%2024.52-15.18%2027.21-18.27%201.18-1.36%202.54-2.48%203.02-2.48%201.17%200%2016.77-15.73%2016.77-16.91%200-.52%201.35-1.91%203-3.09%201.65-1.17%203-2.72%203-3.44s.66-1.86%201.46-2.53c.81-.67%203.14-3.76%205.19-6.87%202.04-3.11%204-5.88%204.34-6.16.55-.44%202.02-3.15%207.33-13.5%202.84-5.52%207.68-16.58%207.68-17.54%200-1.45%204.16-13.32%205.08-14.5.45-.57%201.25-2.82%201.79-5%20.92-3.71%203.35-10.63%2010.03-28.46%202.81-7.51%204.52-12.3%208.37-23.5%202.76-8.02%206.84-19.24%2010.55-29%201.67-4.4%203.57-10.02%204.21-12.5.64-2.47%201.51-4.95%201.92-5.5s1.54-3.47%202.51-6.5c.97-3.02%203.06-8.87%204.66-13%201.6-4.12%203.09-8.4%203.3-9.5.22-1.1%201.79-5.45%203.49-9.66%201.7-4.22%203.09-8.4%203.09-9.3s.66-2.91%201.46-4.47c.81-1.55%203.01-7.27%204.9-12.7l16.56-46.07c1.69-4.51%203.08-9.03%203.08-10.05%200-1.01.38-2.27.85-2.8.87-.98%205.45-13%205.78-15.17.29-1.88%203.62-10.64%204.49-11.82.43-.57%201.21-2.82%201.75-5%20.53-2.17%202.39-7.78%204.12-12.46l10.39-28.5%205.73-16c2.19-6.05%204.57-13.02%205.3-15.5a91.15%2091.15%200%200%201%203.02-8.5c.95-2.2%203.21-8.27%205.05-13.5l4.55-13%204.49-12.5%204.77-13.5c3.16-9.33%205.13-14.75%208.37-23.02%201.84-4.69%203.34-9.43%203.34-10.55%200-1.11.36-2.45.8-2.98.78-.92%203.1-6.89%206.59-16.95%206.87-19.8%209.9-28.13%2010.56-29%20.42-.55%201.05-2.46%201.38-4.25.34-1.78%201.48-5.16%202.52-7.5%201.05-2.33%202.47-6.05%203.17-8.25s2.48-7.37%203.97-11.5l4.47-12.5%205.54-15.5%205.01-14%204.48-12.5%204.79-13.5c3.37-9.88%205.18-14.87%208.38-23.14%201.84-4.75%203.34-9.49%203.34-10.55%200-1.05.41-2.33.91-2.86.5-.52%202.28-5.08%203.95-10.12%201.68-5.05%204.2-11.9%205.6-15.22%201.4-3.33%202.54-6.85%202.55-7.83%200-.98.59-2.9%201.31-4.28.71-1.37%202.12-4.97%203.12-8%201.55-4.7%203.14-9.02%207.52-20.5.42-1.1%201.31-3.8%201.97-6s1.62-4.9%202.14-6c.51-1.1%202.24-5.82%203.85-10.5l9.75-27.14c1.83-4.75%203.33-9.14%203.33-9.77%200-.62%201.16-3.93%202.58-7.36%201.42-3.42%203.23-8.68%204.04-11.67.8-2.99%201.86-5.93%202.36-6.54.81-.97%203.05-7.25%208.57-24.02.91-2.75%202.78-7.92%204.16-11.5%201.38-3.57%203.61-9.75%204.95-13.74%201.35-3.98%203.1-8.48%203.89-10%20.79-1.51%201.44-3.55%201.44-4.53.01-.97%201.53-5.7%203.39-10.5l4.58-12.23%204.16-12c1.62-4.67%203.55-9.85%204.3-11.5.74-1.65%201.92-4.8%202.61-7s2.48-7.37%203.97-11.5l3.97-11.5c.7-2.2%201.87-5.35%202.61-7s2.66-6.82%204.27-11.5l10.26-28.5c.51-1.1%201.1-2.9%201.31-4.01s1.7-5.61%203.32-10l4.23-11.99c.7-2.2%202.09-5.81%203.08-8.03s2.1-5.37%202.46-7c.35-1.63%201.02-3.87%201.47-4.97s1.71-4.47%202.79-7.5l5.47-15%207.93-22.5c1.12-3.3%202.93-8.25%204.03-11s2.68-7.25%203.51-10%202.19-6.57%203.02-8.5c.83-1.92%203.01-8.02%204.85-13.55%201.83-5.53%204.03-11.38%204.87-13%20.85-1.62%201.54-3.72%201.54-4.66.01-.95.75-3.42%201.65-5.5%202.67-6.16%203.11-7.35%206.42-17.29%201.74-5.22%203.62-10.06%204.18-10.75.55-.68.75-1.25.43-1.25-.59%200%201.42-6.27%203.61-11.25l1.21-2.75h318c346.08%200%20335.98.16%20354.01-5.47%204.4-1.37%208.58-2.5%209.3-2.51.71-.01%204.66-1.59%208.77-3.52%204.11-1.92%208.03-3.53%208.7-3.57.68-.04%202.58-.91%204.23-1.93%201.65-1.03%205.03-2.87%207.5-4.1%202.48-1.24%205.77-3.29%207.33-4.57%201.55-1.28%203.23-2.33%203.73-2.33%201.18%200%2013.39-9.44%2019.04-14.72%202.42-2.26%205.64-5.08%207.15-6.27%201.51-1.18%202.75-2.51%202.75-2.94s1.61-2.49%203.58-4.58c4.36-4.62%2015.37-19.17%2016.18-21.38.33-.88.91-1.83%201.3-2.11.92-.65%2011.29-21.1%2011.57-22.82.23-1.39%202.8-7.45%204.41-10.39.51-.95%201.34-3.42%201.84-5.5s2.26-7.16%203.92-11.29c3.04-7.58%208.06-20.99%209.91-26.5.56-1.65%202.25-6.15%203.75-10%207.14-18.24%208.56-22.08%208.55-23.22-.01-.67%201.07-3.59%202.39-6.5%201.33-2.9%203.3-7.98%204.4-11.28%201.09-3.3%202.94-8.17%204.1-10.83%201.15-2.66%202.1-5.5%202.1-6.31%200-.82%201.17-4.04%202.6-7.17%201.43-3.12%203.85-9.28%205.39-13.68%204.04-11.6%204.96-14.08%208.67-23.36%201.84-4.59%203.34-8.91%203.34-9.59%200-1.17%201.94-5.85%204.05-9.77.51-.95%201.33-3.42%201.83-5.5s2.27-7.16%203.94-11.29a477.35%20477.35%200%200%200%206.19-16.5c1.74-4.95%204.45-12.15%206.02-16s4.06-10.6%205.53-15c1.46-4.4%203.06-8.42%203.55-8.95.49-.52.89-1.76.89-2.76%200-.99.94-3.94%202.08-6.55%204.43-10.07%204.92-11.35%204.92-12.68%200-.75%201.35-4.38%203-8.06%201.65-3.67%203-7.34%203-8.14%200-1.32%201.26-4.49%205.57-14.01.79-1.73%201.43-3.76%201.43-4.5s1.29-4.5%202.88-8.35%203.45-8.8%204.13-11%202.3-6.37%203.61-9.28c1.31-2.9%202.38-5.9%202.38-6.65%200-.76%201.35-4.39%203-8.07%201.65-3.67%203-7.25%203-7.95s1.39-4.6%203.09-8.66%203.77-9.64%204.6-12.39%201.86-5.45%202.28-6%201.54-3.47%202.48-6.5c.95-3.02%202.81-7.87%204.14-10.78s2.84-7.18%203.36-9.5%201.72-5.76%202.66-7.64%202.92-6.83%204.4-11l9.1-24.58c1.56-3.85%203.14-8.35%203.53-10%20.38-1.65%201.8-5.47%203.14-8.5%201.35-3.02%203.12-7.75%203.94-10.5.81-2.75%201.82-5.45%202.23-6%20.42-.55%201.56-3.47%202.54-6.5.98-3.02%203.07-8.54%204.65-12.26%201.57-3.71%202.86-7.48%202.86-8.37s1.58-5.1%203.5-9.37c1.93-4.26%203.5-8.42%203.5-9.24%200-.83%201.29-4.59%202.87-8.38%201.58-3.78%203.43-8.68%204.12-10.88s2.32-6.37%203.63-9.28c1.31-2.9%202.38-6.09%202.38-7.08s.29-2.09.64-2.45c.91-.9%205.35-11.95%205.36-13.31%200-1.05%202.88-8.31%205.12-12.92.55-1.12%201.11-2.7%201.25-3.5.39-2.27%201.72-6.17%203.22-9.46.76-1.65%202.23-5.47%203.29-8.5%205.86-16.84%209.97-27.86%2011.45-30.7.92-1.76%201.67-3.85%201.67-4.64%200-.8%201.39-4.71%203.09-8.7%201.69-3.99%203.25-8.11%203.45-9.16s1.56-4.9%203.03-8.56c4.54-11.35%209.04-26.8%209.9-34.03l1.49-12.18c1.75-14.28%201.39-26.12-1.49-48.53-1-7.77-6.16-24.81-10.15-33.5-1.39-3.02-2.68-6.3-2.87-7.27-.19-.98-1.72-3.82-3.4-6.3-1.68-2.49-3.05-5.15-3.05-5.91%200-.75-.58-1.97-1.28-2.7-.71-.72-2.79-3.79-4.63-6.82-1.83-3.02-3.94-6.17-4.67-7-.74-.82-4.62-5.31-8.63-9.97s-9.09-10.06-11.28-12c-2.2-1.94-5.16-4.65-6.58-6.03-3.95-3.81-12.93-10.43-17.68-13.04-2.34-1.28-4.25-2.66-4.25-3.07s-.97-1.06-2.15-1.43c-1.19-.38-4.36-1.99-7.05-3.57-2.69-1.59-5.31-2.89-5.83-2.89-.51%200-3.74-1.36-7.17-3.02s-7.29-3.21-8.58-3.44c-1.29-.24-5.89-1.58-10.23-2.98-4.34-1.41-12.98-3.33-19.19-4.28-10.45-1.6-31.32-1.75-278.05-2.02l-266.75-2.07c0-.98.43-2.21.95-2.74.52-.52%202.28-5.03%203.91-10.02s4.13-11.84%205.55-15.22c1.43-3.38%202.59-6.86%202.59-7.73s.92-3.61%202.05-6.08c1.13-2.48%202.95-7.42%204.05-10.99%201.1-3.56%202.92-8.6%204.05-11.2%201.12-2.59%202.21-5.61%202.42-6.71s2.21-6.95%204.44-13l9.96-27.5%2010.54-28.65c.82-1.73%201.49-3.89%201.49-4.8s1.58-5.46%203.5-10.11c1.93-4.66%203.5-8.98%203.5-9.62s1.08-3.89%202.39-7.24c1.32-3.34%202.7-7.09%203.07-8.33l.68-2.25H816.699l-1.88%204.25z'/%3e%3cpath%20id='C'%20d='M1037.31%201.097c-14.99%201.133-33.99%205.841-46.276%2011.47-2.903%201.329-5.696%202.417-6.206%202.417s-3.219%201.35-6.017%203-5.361%203-5.694%203c-1.192%200-16.822%2010.355-17.606%2011.664-.44.735-1.285%201.336-1.878%201.336-2.585%200-30.822%2027.486-30.822%2030.002%200%20.378-.954%201.545-2.12%202.593-3.102%202.788-8.488%2011.382-16.235%2025.905-2.892%205.421-7.645%2016.612-7.645%2018%200%20.748-1.328%204.23-2.952%207.738s-3.189%207.727-3.48%209.376-1.241%204.429-2.113%206.175-2.845%206.672-4.386%2010.944l-11.432%2030.639c-.901%202.13-1.637%204.48-1.637%205.223s-1.086%203.725-2.414%206.628-3.633%208.652-5.122%2012.777l-12.483%2034c-4.074%2010.669-8.318%2022.311-11.667%2032-1.425%204.125-2.932%207.95-3.348%208.5s-1.663%203.925-2.77%207.5-2.999%208.75-4.203%2011.5-3.223%207.925-4.485%2011.5l-12.505%2034c-1.755%204.675-4.008%2010.975-5.008%2014s-2.738%207.631-3.864%2010.235l-2.047%204.734-500.584.531-12.5%202.351c-6.875%201.293-15.875%203.462-20%204.82s-8.85%202.826-10.5%203.262c-2.812.745-11.783%205.028-24.5%2011.699-11.427%205.994-29.838%2021.356-42.582%2035.532-3.903%204.341-12.93%2017.332-17.16%2024.693-9.617%2016.738-15.085%2030.984-19.437%2050.643-2.601%2011.75-3.175%2016.793-3.576%2031.38-.478%2017.398.196%2025.332%203.367%2039.62%202.238%2010.086%205.648%2021.542%206.583%2022.121.443.273.805%201.261.805%202.195%200%201.782%209.74%2022.32%2010.995%2023.184.399.275%201.503%202.016%202.453%203.869%201.999%203.9%208.361%2013.165%2010.047%2014.631.633.55%201.568%201.741%202.078%202.648.837%201.487%2014.565%2016.616%2023.427%2025.817l10.962%2011.585%2015.512%2016.45%2021.538%2022.929%2016.988%2018.095%2030.395%2032.063%2014%2014.913%2021.105%2022.489%2019.669%2020.999%2014%2014.87%2014.831%2015.676%2046.775%2049.716%209.532%2010.25H3004.57l1.21-3.25%203.53-9.25c1.28-3.3%203.23-8.7%204.33-12s3.87-10.725%206.15-16.5%204.75-12.525%205.48-15c.74-2.475%202.69-7.875%204.34-12%206.3-15.73%209.22-23.54%209.21-24.657-.01-.636%201.29-4.05%202.87-7.585%201.59-3.536%203.21-7.9%203.61-9.698.39-1.798%201.65-5.359%202.8-7.914%201.14-2.555%203.38-8.246%204.96-12.646l6.36-17.5%204.84-13.5c.74-2.2%202.34-6.25%203.54-9a152.84%20152.84%200%200%200%204.03-10.5c2.89-8.592%207.91-22.194%209.42-25.5.76-1.65%202.05-5.25%202.87-8%20.83-2.75%202.67-7.6%204.1-10.779%201.42-3.178%202.59-6.427%202.59-7.221s1.16-4.043%202.58-7.221%203.84-9.379%205.39-13.779l8.56-23.5%204.42-12c1.55-4.402%206.91-18.885%2011.1-30l6.45-17.5%205.27-14c4.48-11.075%208.23-21.197%208.23-22.23%200-.601%201.58-4.773%203.5-9.27%201.93-4.497%203.5-8.756%203.5-9.464s1.09-3.745%202.42-6.75%203.6-8.913%205.06-13.13c1.45-4.217%203.29-8.903%204.08-10.412.78-1.509%201.43-3.536%201.43-4.505.01-.968.89-3.668%201.97-6%201.68-3.648%205.61-14.052%2010.09-26.739%201.14-3.229%201.89-5.231%205.07-13.5l7.93-21.5%204.61-12.139c1.84-4.752%203.34-9.145%203.34-9.764s.43-1.906.97-2.861c2-3.608%205.03-11.183%205.03-12.588%200-.804%201.35-4.466%203-8.138%201.64-3.672%203.18-7.711%203.41-8.976s1.8-5.606%203.5-9.648%203.09-7.84%203.09-8.441%201.58-4.727%203.5-9.169c1.93-4.442%203.5-8.739%203.5-9.549s.98-3.667%202.17-6.35c1.2-2.682%203.38-8.252%204.86-12.377l4.47-12.5c.99-2.75%203.08-8.041%204.65-11.759s2.85-7.455%202.85-8.306c0-1.365%202.22-7.033%205.08-12.935.53-1.1%201.14-2.974%201.37-4.165.22-1.191%201.79-5.458%203.48-9.481s3.07-7.825%203.07-8.448%201.39-4.455%203.08-8.518%203.22-8.063%203.39-8.888c.18-.825%201.67-5.55%203.32-10.5%205.89-17.696%208.84-42.441%207.23-60.748-1.21-13.745-5.34-35-8.02-41.261-1.09-2.541-2.16-5.604-2.38-6.806-.49-2.656-9.67-21.639-13.15-27.185-1.38-2.2-3.03-5.013-3.65-6.25-.63-1.238-1.52-2.25-1.98-2.25s-.84-.575-.84-1.277-1.35-2.755-3-4.562-3-3.638-3-4.071c0-.978-20.45-21.603-25.09-25.308-6.5-5.184-12.79-9.782-13.39-9.782-.69%200-6.3-3.88-8.31-5.75-.75-.687-1.98-1.25-2.75-1.25-.76%200-3.52-1.35-6.12-3s-5.31-3-6.02-3-4.11-1.376-7.55-3.058c-3.45-1.682-8.07-3.45-10.27-3.929s-7.37-1.801-11.5-2.939c-10.13-2.796-10.58-2.866-26-4.041-16.54-1.26-2063.8-1.181-2080.5.08zM814.819%201095.23c-1.034%202.34-2.09%205.42-2.349%206.84-.258%201.43-1.783%205.93-3.39%2010-1.606%204.08-3.62%209.44-4.476%2011.91l-8.851%2025-8.734%2025c-1.876%205.53-2.542%207.23-5.153%2013.2-1.13%202.58-2.055%205.42-2.055%206.3%200%20.89-1.368%204.83-3.039%208.76-1.672%203.92-3.447%208.74-3.945%2010.69s-2.972%209.18-5.496%2016.05l-12.563%2035-4.488%2012.5-10.509%2030c-.671%202.2-1.561%204.45-1.977%205s-2.104%205.05-3.753%2010l-4.47%2013c-.81%202.2-2.043%205.8-2.74%208s-2.122%205.92-3.168%208.25c-1.046%202.34-2.179%205.72-2.518%207.5-.338%201.79-.946%203.7-1.351%204.25s-2.647%206.63-4.983%2013.5c-2.336%206.88-4.619%2012.97-5.072%2013.54s-1.278%202.82-1.834%205-2.892%209.14-5.192%2015.46l-7.071%2020c-1.588%204.68-3.554%209.93-4.368%2011.67-.815%201.75-1.779%204.67-2.143%206.5-.364%201.84-1.776%205.81-3.14%208.83-1.363%203.03-3.261%208.2-4.218%2011.5s-2.648%208.25-3.758%2011c-3.112%207.71-8.151%2021.51-9.679%2026.5-.757%202.48-3.263%209.68-5.57%2016l-5.67%2016a170.73%20170.73%200%200%201-3.527%209.5c-1.127%202.75-3.068%208.15-4.314%2012s-4.143%2012.18-6.439%2018.5l-19.871%2055.72c-2.185%206.17-4.259%2011.68-4.608%2012.24-.35.57-1.242%203.17-1.983%205.79-.741%202.61-3.011%209.25-5.044%2014.75l-6.597%2018.5c-1.596%204.68-3.343%209.4-3.881%2010.5-1.341%202.74-8.99%2024.3-9.936%2028-.421%201.65-1.645%205.03-2.719%207.5-1.075%202.48-2.548%206.53-3.274%209-.726%202.48-1.728%205.4-2.227%206.5-.774%201.71-3.059%208.05-9.905%2027.5l-9.465%2026.5-11.541%2032.81c-1.628%204.84-3.568%2010.02-4.311%2011.5s-1.9%204.94-2.571%207.68-1.586%205.44-2.032%206-2.178%205.06-3.845%2010.01l-7.211%2020.5c-2.298%206.33-4.768%2013.53-5.488%2016-.72%202.48-2.702%207.74-4.403%2011.7s-3.093%207.74-3.093%208.41-1.285%204.64-2.855%208.81l-4.089%2011.08-5.016%2014-5.564%2015.5-5.129%2013.76c-1.841%204.82-3.347%209.37-3.347%2010.13%200%20.75-1.126%203.91-2.503%207.02-1.376%203.12-2.914%207.33-3.418%209.38-.503%202.04-2.337%207.54-4.076%2012.21l-15.14%2042c-1.595%204.68-3.531%209.85-4.304%2011.5s-1.699%204.35-2.06%206-1.051%203.9-1.536%205c-2.404%205.46-5.962%2014.97-5.955%2015.93.005.59-1.287%204.45-2.87%208.57-1.583%204.13-3.644%209.75-4.582%2012.5l-6.219%2017.5c-2.483%206.88-4.857%2013.85-5.275%2015.5s-1.672%205.03-2.788%207.5c-1.115%202.48-2.591%206.3-3.278%208.5s-2.295%206.7-3.571%2010-2.838%208.03-3.47%2010.5c-.633%202.48-1.516%204.95-1.964%205.5s-2.704%206.63-5.015%2013.5c-2.312%206.88-4.538%2012.95-4.949%2013.5s-1.03%202.5-1.377%204.33a32.45%2032.45%200%200%201-2.135%206.5c-1.657%203.5-8.017%2021.15-9.609%2026.67-.555%201.93-2.609%207.78-4.565%2013l-16.394%2045.5-12.481%2035-5.703%2016c-3.508%2010.37-7.957%2022.68-11.422%2031.63-1.838%204.74-3.341%209.16-3.341%209.81%200%201.21-3.403%2010.1-5.086%2013.3-.503.95-.914%202.36-.914%203.11%200%20.76-1.354%204.66-3.01%208.68-1.655%204.01-3.196%208.24-3.425%209.38-.599%203.02-2.725%208.92-3.636%2010.11-.43.55-1.33%203.25-2.001%206-.671%202.74-1.77%206.11-2.442%207.48-.672%201.38-2.93%207.43-5.018%2013.45-2.087%206.03-4.394%2012.1-5.126%2013.5-.731%201.41-1.332%203.37-1.336%204.37s-.493%202.73-1.089%203.84c-1.112%202.08-7.731%2020.43-10.583%2029.34-1.88%205.88-5.709%2016.33-10.732%2029.3-1.981%205.12-3.602%2010-3.602%2010.85s-.696%203.02-1.547%204.81c-1.308%202.76-5.031%2012.9-10.48%2028.54l-4.509%2012.5c-1.809%204.95-4.057%2011.42-4.995%2014.37s-2.324%206.55-3.081%208-1.378%203.37-1.382%204.26-1.095%204.09-2.427%207.1-2.925%207.45-3.542%209.87-1.523%205.3-2.014%206.4c-3.179%207.12-5.023%2011.95-5.023%2013.15%200%20.77-1.539%205.33-3.42%2010.13a524.09%20524.09%200%200%200-6.336%2017.22l-4.723%2013.5-10.044%2028-11.39%2031.32c-1.698%204.57-3.087%208.96-3.087%209.76%200%20.79-.873%203.35-1.941%205.68-1.817%203.97-3.511%208.69-11.212%2031.24-1.691%204.95-3.429%209.45-3.863%2010s-1.313%203.03-1.955%205.5c-1.152%204.45-3.393%2010.64-10.427%2028.8-1.981%205.12-3.6%209.85-3.597%2010.5.003.66-1.284%204.58-2.86%208.7-1.575%204.13-3.67%209.98-4.653%2013-.984%203.03-2.091%205.95-2.46%206.5s-1.261%203.03-1.981%205.5c-.721%202.48-1.895%205.85-2.609%207.5-.715%201.66-2.402%206.38-3.75%2010.5-1.348%204.13-3.63%2010.3-5.071%2013.72s-2.624%207.02-2.627%208-.665%203.05-1.469%204.59-2.799%206.72-4.433%2011.5l-6.574%2018.69-12.128%2034-4.508%2012.5-6.39%2018-6.404%2018-4.296%2012c-3.422%2010.08-6.253%2017.95-9.436%2026.26-1.846%204.82-3.356%209.37-3.356%2010.12s-1.282%204.46-2.848%208.24c-1.566%203.79-3.617%209.13-4.558%2011.88l-6.22%2017.5-6.044%2017.5c-.844%202.75-1.88%205.45-2.302%206-.805%201.05-2.809%206.87-3.479%2010.11-.217%201.04-1.778%205.22-3.471%209.28s-3.078%207.97-3.078%208.68c0%20.7-1.392%204.76-3.093%209.01s-3.297%208.84-3.544%2010.21c-.248%201.36-1.105%203.75-1.904%205.29-.799%201.55-2.786%206.77-4.415%2011.62l-6.397%2018.3-5.198%2014.5c-.97%202.75-3.267%208.89-5.106%2013.64s-3.343%209.5-3.343%2010.55-.408%202.34-.906%202.86c-.844.89-1.978%204.03-10.084%2027.95-1.678%204.95-3.446%209.9-3.929%2011-2.096%204.77-3.17%208.35-4.049%2013.5-.516%203.03-1.648%208.65-2.516%2012.5-2.199%209.76-3.07%2034.84-1.598%2046%203.369%2025.54%2012.278%2051.52%2024.17%2070.5%202.239%203.58%204.486%206.65%204.992%206.84.506.18.92.91.92%201.61s1.025%202.35%202.277%203.67c1.252%201.31%203.455%203.96%204.895%205.88%205.313%207.11%2021.554%2022.67%2029.137%2027.91%201.205.84%203.311%202.55%204.681%203.81%201.369%201.25%202.863%202.28%203.32%202.28s2.711%201.28%205.01%202.84c7.496%205.08%2030.82%2015.85%2037.04%2017.09%202.277.46%208.64%202.13%2014.14%203.7l10%202.87%20483.5.3%20496.109-.73c6.94-.56%2015.04-1.68%2018-2.48%2020.66-5.61%2029.55-8.89%2042.89-15.82%207.12-3.71%2024.03-14.93%2028-18.59%2010.33-9.51%2019-18.21%2019-19.04%200-.55%201.35-1.96%203-3.14%201.65-1.17%203-2.72%203-3.44s.67-1.86%201.48-2.54c4-3.32%2014.85-21.69%2021.45-36.31%201.69-3.74%203.07-7.22%203.07-7.75%200-1.42%204.03-12.79%205.61-15.81.76-1.46%201.38-3.46%201.38-4.46.01-1%20.5-2.73%201.09-3.84.6-1.11%202.79-6.82%204.87-12.69l10.06-28.16%204.79-13.5%206.22-17.5%205.59-16c.78-2.47%202.04-5.85%202.79-7.5s1.92-4.8%202.59-7c.68-2.2%202.56-7.43%204.19-11.63%201.63-4.19%203.06-8.26%203.17-9.04s1.6-5.23%203.3-9.88l4.33-11.95%205.04-14%205.56-15.5%2011.34-31.2c1.69-4.51%203.08-9.03%203.08-10.05%200-1.01.4-2.27.89-2.8.48-.52%202.79-6.57%205.12-13.45%202.33-6.87%204.61-12.96%205.06-13.54.46-.57%201.26-2.82%201.8-5%20.53-2.17%202.39-7.78%204.12-12.46l10.2-28%208.32-23.5c1.25-3.3%203.26-8.92%204.48-12.5l6-17%205.03-14%204.5-12.5%204.77-13.5c2.65-7.82%204.96-14.23%208.39-23.24%201.82-4.81%203.32-9.56%203.32-10.55s.36-2.23.8-2.76c.78-.92%202.99-6.6%206.6-16.95l12.07-34%206.45-18%204.63-13%204.78-13.5%206.13-17%205.24-14.5%208.3-23.5%208.32-23.5c1.12-3.3%202.6-7.35%203.29-9s2.35-6.37%203.7-10.5c1.35-4.12%203.63-10.3%205.07-13.72s2.62-7.02%202.63-8c0-.98.59-2.9%201.31-4.28.71-1.37%202.12-4.97%203.12-8%20.99-3.02%202.85-8.2%204.11-11.5s3.26-8.92%204.44-12.5c1.18-3.57%202.55-7.4%203.06-8.5.5-1.1%202.23-5.82%203.84-10.5l15.08-42c1.75-4.67%203.61-10.28%204.15-12.45.54-2.18%201.63-5.33%202.42-7%201.33-2.82%205.66-14.88%209.19-25.55.81-2.47%202.99-8.55%204.83-13.5l6.46-18%206.42-18%204.52-12.5%2011.4-32%205.15-14.5%205.01-14%2010.04-28.5c.36-1.37%201.26-3.85%201.98-5.5.73-1.65%202.03-5.14%202.89-7.76.85-2.62%202.84-8.24%204.4-12.5l4.14-11.74c.7-2.2%202.09-5.81%203.08-8.03s2.1-5.37%202.46-7c.35-1.63%201.02-3.87%201.47-4.97s1.71-4.47%202.79-7.5l5.47-15%207.93-22.5c1.12-3.3%202.93-8.25%204.03-11s2.68-7.25%203.51-10%202.19-6.57%203.02-8.5c.83-1.92%203.01-8.02%204.85-13.55%201.83-5.53%204.03-11.38%204.87-13%20.85-1.62%201.54-3.72%201.54-4.66.01-.95.75-3.42%201.65-5.5%202.7-6.23%203.05-7.19%208.34-22.79%202.79-8.25%205.63-16.23%206.29-17.75l1.22-2.75h318c353.24%200%20334.65.34%20357.5-6.49%206.62-1.98%2014.23-4.71%2016.92-6.05%202.68-1.35%205.31-2.46%205.83-2.46%201.02%200%203.58-1.31%2012.32-6.31%2015.17-8.69%2026.55-17.29%2037.39-28.27%206.49-6.57%2019.77-23.36%2022.71-28.7%206.23-11.34%208.61-15.97%2010.63-20.72l3.82-9c.82-1.92%201.91-4.27%202.43-5.21.51-.95%201.34-3.42%201.84-5.5s2.26-7.16%203.92-11.29c3.04-7.58%208.06-20.99%209.91-26.5.56-1.65%202.25-6.15%203.75-10%207.14-18.24%208.56-22.08%208.55-23.22-.01-.67%201.07-3.59%202.39-6.5%201.33-2.9%203.3-7.98%204.4-11.28%201.09-3.3%202.94-8.17%204.1-10.83%201.15-2.66%202.1-5.5%202.1-6.31%200-.82%201.17-4.04%202.6-7.17%201.43-3.12%203.85-9.28%205.39-13.68%204.04-11.6%204.96-14.08%208.67-23.36%201.84-4.59%203.34-9.13%203.34-10.08s.29-2.02.64-2.38c.88-.87%205.35-11.93%205.34-13.19%200-.55%201.53-4.82%203.4-9.5%201.88-4.67%204.85-12.55%206.6-17.5%201.76-4.95%204.48-12.15%206.05-16s4.06-10.6%205.53-15c1.46-4.4%203.06-8.42%203.55-8.95.49-.52.89-1.72.89-2.67%200-.94%201.58-5.45%203.5-10.02%201.93-4.56%203.5-8.83%203.5-9.48%200-.66%201.35-4.2%203-7.88%201.65-3.67%203-7.34%203-8.14%200-1.32%201.26-4.49%205.57-14.01.79-1.73%201.43-3.76%201.43-4.5s1.29-4.5%202.88-8.35%203.45-8.8%204.13-11%202.3-6.37%203.61-9.28c1.31-2.9%202.38-5.9%202.38-6.65%200-.76%201.35-4.39%203-8.07%201.65-3.67%203-7.25%203-7.95s1.39-4.6%203.09-8.66%203.77-9.64%204.6-12.39%201.88-5.45%202.32-6%201.58-3.69%202.54-6.98c.95-3.3%202.1-6.67%202.56-7.5%202.04-3.75%204.89-11.06%204.89-12.55%200-.9%201.35-4.56%203-8.12%201.65-3.57%203-7.04%203-7.71%200-.68%201.57-5.03%203.48-9.68%201.92-4.65%203.49-8.98%203.5-9.61.01-.64%201.32-4.05%202.9-7.59%201.59-3.53%203.21-7.9%203.61-9.7.39-1.8%201.85-5.81%203.23-8.92%201.38-3.1%203.18-7.89%204-10.64.81-2.75%201.83-5.45%202.25-6s1.54-3.47%202.48-6.5c.94-3.02%202.97-8.65%204.5-12.5s3.56-9.25%204.52-12c3.04-8.73%207.14-19.83%209.23-25a191.03%20191.03%200%200%200%203.81-10.5c.98-3.02%202.11-5.95%202.51-6.5s1.26-2.8%201.92-5%201.63-4.9%202.15-6c.51-1.1%202.23-5.6%203.81-10l11.1-30c.55-1.1%201.85-4.47%202.9-7.5%205.31-15.42%209.94-27.83%2011.43-30.7.92-1.76%201.67-3.78%201.66-4.5%200-.71%201.31-4.67%202.92-8.8%2010.3-26.4%2015.44-42.46%2016.55-51.67l1.5-12.3c.57-4.66%201.04-12.77%201.04-18.03%200-8.4-.41-13.36-2.5-30.5-.45-3.67-1.24-6.62-5.98-22.5-.9-3.02-2.25-6.85-3-8.5-2.86-6.31-8.51-18.07-9.49-19.75-.57-.96-1.46-2.53-2-3.5-3.4-6.15-7.56-12.74-9.39-14.87l-9.14-10.72c-8.11-9.55-25.53-24.97-33.5-29.65-3.02-1.78-5.72-3.56-6-3.96-.27-.39-5.9-3.29-12.5-6.43l-13.74-6.67c-.95-.52-2.3-.95-3-.95-.69%200-5.38-1.34-10.41-2.99-20.9-6.83-2.95-6.43-298.6-6.75l-266.75-2.07c0-.98.41-2.21.91-2.74.5-.52%202.28-5.08%203.95-10.12%201.68-5.05%204.2-11.9%205.6-15.22%201.4-3.33%202.54-6.85%202.55-7.83%200-.98.62-2.96%201.38-4.41s2.16-5.05%203.12-8%202.97-8.74%204.47-12.87l6.48-18%207-19.5%204.5-12.5%205.69-16%207.49-21%204.57-13a401.71%20401.71%200%200%201%203.8-10.5c1.25-3.3%202.58-7.01%202.95-8.25l.68-2.25H816.699l-1.88%204.25z'/%3e%3cpath%20id='D'%20d='M1037.31%201.097c-14.99%201.133-33.99%205.841-46.276%2011.47-2.903%201.329-5.696%202.417-6.206%202.417s-3.219%201.35-6.017%203-5.361%203-5.694%203c-1.192%200-16.822%2010.355-17.606%2011.664-.44.735-1.285%201.336-1.878%201.336-2.585%200-30.822%2027.486-30.822%2030.002%200%20.378-.954%201.545-2.12%202.593-3.102%202.788-8.488%2011.382-16.235%2025.905-2.892%205.421-7.645%2016.612-7.645%2018%200%20.748-1.328%204.23-2.952%207.738s-3.189%207.727-3.48%209.376-1.241%204.429-2.113%206.175-2.845%206.672-4.386%2010.944l-11.432%2030.639c-.901%202.13-1.637%204.48-1.637%205.223s-1.086%203.725-2.414%206.628-3.633%208.652-5.122%2012.777l-12.483%2034c-4.074%2010.669-8.318%2022.311-11.667%2032-1.425%204.125-2.932%207.95-3.348%208.5s-1.663%203.925-2.77%207.5-2.999%208.75-4.203%2011.5-3.223%207.925-4.485%2011.5l-12.505%2034c-1.755%204.675-4.008%2010.975-5.008%2014s-2.738%207.631-3.864%2010.235l-2.047%204.734-500.584.531-12.5%202.351c-6.875%201.293-15.875%203.462-20%204.82s-8.85%202.826-10.5%203.262c-2.812.745-11.783%205.028-24.5%2011.699-11.427%205.994-29.838%2021.356-42.582%2035.532-3.903%204.341-12.93%2017.332-17.16%2024.693-9.617%2016.738-15.085%2030.984-19.437%2050.643-2.601%2011.75-3.175%2016.793-3.576%2031.38-.478%2017.398.196%2025.332%203.367%2039.62%202.238%2010.086%205.648%2021.542%206.583%2022.121.443.273.805%201.261.805%202.195%200%201.782%209.74%2022.32%2010.995%2023.184.399.275%201.503%202.016%202.453%203.869%201.999%203.9%208.361%2013.165%2010.047%2014.631.633.55%201.568%201.741%202.078%202.648.837%201.487%2014.565%2016.616%2023.427%2025.817l10.962%2011.585%2015.512%2016.45%2021.538%2022.929%2016.988%2018.095%2030.395%2032.063%2014%2014.913%2021.105%2022.489%2019.669%2020.999%2014%2014.87%2014.831%2015.676%2046.775%2049.716%209.532%2010.25H3004.57l1.21-3.25%203.53-9.25c1.28-3.3%203.23-8.7%204.33-12s3.87-10.725%206.15-16.5%204.75-12.525%205.48-15c.74-2.475%202.69-7.875%204.34-12%206.3-15.73%209.22-23.54%209.21-24.657-.01-.636%201.29-4.05%202.87-7.585%201.59-3.536%203.21-7.9%203.61-9.698.39-1.798%201.65-5.359%202.8-7.914%201.14-2.555%203.38-8.246%204.96-12.646l6.36-17.5%204.84-13.5c.74-2.2%202.34-6.25%203.54-9a152.84%20152.84%200%200%200%204.03-10.5c2.89-8.592%207.91-22.194%209.42-25.5.76-1.65%202.05-5.25%202.87-8%20.83-2.75%202.67-7.6%204.1-10.779%201.42-3.178%202.59-6.427%202.59-7.221s1.16-4.043%202.58-7.221%203.84-9.379%205.39-13.779l8.56-23.5%204.42-12c1.55-4.402%206.91-18.885%2011.1-30l6.45-17.5%205.27-14c4.48-11.075%208.23-21.197%208.23-22.23%200-.601%201.58-4.773%203.5-9.27%201.93-4.497%203.5-8.756%203.5-9.464s1.09-3.745%202.42-6.75%203.6-8.913%205.06-13.13c1.45-4.217%203.29-8.903%204.08-10.412.78-1.509%201.43-3.536%201.43-4.505.01-.968.89-3.668%201.97-6%201.68-3.648%205.61-14.052%2010.09-26.739%201.14-3.229%201.89-5.231%205.07-13.5l7.93-21.5%204.61-12.139c1.84-4.752%203.34-9.145%203.34-9.764s.43-1.906.97-2.861c2-3.608%205.03-11.183%205.03-12.588%200-.804%201.35-4.466%203-8.138%201.64-3.672%203.18-7.711%203.41-8.976s1.8-5.606%203.5-9.648%203.09-7.84%203.09-8.441%201.58-4.727%203.5-9.169c1.93-4.442%203.5-8.739%203.5-9.549s.98-3.667%202.17-6.35c1.2-2.682%203.38-8.252%204.86-12.377l4.47-12.5c.99-2.75%203.08-8.041%204.65-11.759s2.85-7.455%202.85-8.306c0-1.365%202.22-7.033%205.08-12.935.53-1.1%201.14-2.974%201.37-4.165.22-1.191%201.79-5.458%203.48-9.481s3.07-7.825%203.07-8.448%201.39-4.455%203.08-8.518%203.22-8.063%203.39-8.888c.18-.825%201.67-5.55%203.32-10.5%205.89-17.696%208.84-42.441%207.23-60.748-1.21-13.745-5.34-35-8.02-41.261-1.09-2.541-2.16-5.604-2.38-6.806-.49-2.656-9.67-21.639-13.15-27.185-1.38-2.2-3.03-5.013-3.65-6.25-.63-1.238-1.52-2.25-1.98-2.25s-.84-.575-.84-1.277-1.35-2.755-3-4.562-3-3.638-3-4.071c0-.978-20.45-21.603-25.09-25.308-6.5-5.184-12.79-9.782-13.39-9.782-.69%200-6.3-3.88-8.31-5.75-.75-.687-1.98-1.25-2.75-1.25-.76%200-3.52-1.35-6.12-3s-5.31-3-6.02-3-4.11-1.376-7.55-3.058c-3.45-1.682-8.07-3.45-10.27-3.929s-7.37-1.801-11.5-2.939c-10.13-2.796-10.58-2.866-26-4.041-16.54-1.26-2063.8-1.181-2080.5.08zM2423.68%202252.73c-1.24%201.59-1.21%201.62.38.38.96-.75%201.75-1.54%201.75-1.75%200-.82-.82-.29-2.13%201.37z'/%3e%3c/defs%3e%3c/svg%3e";
var b5 = /* @__PURE__ */ L('<div class="tw-my-2 tw-mr-2 tw-flex tw-flex-1 tw-gap-y-2 tw-items-center tw-w-full tw-flex-wrap tw-justify-between"><div class=tw-text-sm></div><div>'), y5 = /* @__PURE__ */ L('<div class="tw-flex tw-flex-col tw-gap-3 tw-overflow-hidden"><div class="tw-my-2 tw-border-t tw-border-muted"></div><div class="tw-flex tw-w-full tw-items-start tw-justify-between tw-gap-4 md:tw-flex-row"><div class="tw-flex tw-items-center tw-gap-4 tw-self-start"><img class=tw-size-9 title="Fasih Form"alt="Fasih Form"><div><h1 class="tw-mb-0 tw-text-lg tw-font-medium">Fasih Form</h1><p class="tw-text-sm tw-font-light"> </p></div></div><div class="tw-full tw-flex tw-flex-col tw-items-end tw-gap-2"><div class=tw-text-xs><div class="tw-flex tw-items-center tw-font-normal"><div class="tw-leading-none tw-flex tw-flex-col tw-gap-y-1 tw-font-semibold tw-text-right"><div></div><div class=tw-font-light>v-</div></div></div></div><div class=tw-text-xs><div class="tw-flex tw-items-center tw-font-normal"><div class="tw-leading-none tw-flex tw-flex-col tw-gap-y-1 tw-font-semibold tw-text-right"><div></div><div class=tw-font-light>v-');
const Gs = (t) => (() => {
  var e = b5(), n = e.firstChild, r = n.nextSibling;
  return k(n, () => t.label), k(r, () => t.children), e;
})(), x5 = () => {
  const t = () => "0.0.18", e = () => {
    i1();
  }, n = Object.entries(Zs.langs).map((i) => ({
    label: i[1],
    value: i[0]
  })), r = (i) => {
    i && ae.setLang(i.value);
  };
  return (() => {
    var i = y5(), s = i.firstChild, o = s.nextSibling, a = o.firstChild, l = a.firstChild, c = l.nextSibling, u = c.firstChild, f = u.nextSibling, h = f.firstChild, m = a.nextSibling, w = m.firstChild, g = w.firstChild, p = g.firstChild, v = p.firstChild, b = v.nextSibling;
    b.firstChild;
    var C = w.nextSibling, _ = C.firstChild, E = _.firstChild, F = E.firstChild, T = F.nextSibling;
    return T.firstChild, k(i, d(Gs, {
      get label() {
        return A("dark.mode");
      },
      get children() {
        return d(Ju, {
          onChange: e,
          get checked() {
            return !!je.theme.isDark;
          },
          get children() {
            return d(Zu, {
              get children() {
                return d(ed, {
                  class: "tw-flex tw-size-6 tw--translate-x-1 tw-items-center tw-justify-center tw-border tw-border-border data-[checked]:tw-translate-x-4",
                  get children() {
                    return J(() => !!je.theme.isDark)() ? d(Eb, {
                      size: 12
                    }) : d(Lb, {
                      size: 12
                    });
                  }
                });
              }
            });
          }
        });
      }
    }), s), k(i, d(Gs, {
      get label() {
        return A("language");
      },
      get children() {
        return d(si, {
          virtualized: !0,
          sameWidth: !0,
          fitViewport: !0,
          disallowEmptySelection: !0,
          get value() {
            return n.find((x) => x.value == ae.config.locale);
          },
          onChange: r,
          options: n,
          optionLabel: "label",
          optionValue: "value",
          get placeholder() {
            return A("select.option");
          }
        });
      }
    }), s), k(i, d(Gs, {
      get label() {
        return A("font.size");
      },
      get children() {
        return d(ob, {
          variant: "outline",
          get value() {
            return je.theme.fontScale;
          },
          onChange: (x) => s1(Number(x)),
          options: [{
            label: () => d(Ns, {
              size: 10
            }),
            value: 1,
            title: "100%"
          }, {
            label: () => d(Ns, {
              size: 13
            }),
            value: 1.25,
            title: "125%"
          }, {
            label: () => d(Ns, {
              size: 16
            }),
            value: 1.5,
            title: "150%"
          }]
        });
      }
    }), s), Xe(l, "src", v5), k(f, () => A("version"), h), k(f, t, null), k(v, () => A("template")), k(b, () => ae.meta.template.version, null), k(g, d(xb, {
      size: 22,
      class: "tw-ml-1 tw-stroke-1"
    }), null), k(F, () => A("validation")), k(T, () => ae.meta.validation.version, null), k(_, d(bb, {
      size: 22,
      class: "tw-ml-1 tw-stroke-1"
    }), null), i;
  })();
};
var k5 = /* @__PURE__ */ L('<div><div role=button><div class="tw-flex tw-items-start tw-space-x-1"><div class="tw-text-sm tw-font-semibold"></div></div><div class="tw-text-xs tw-font-normal">'), Nd = /* @__PURE__ */ L("<div>"), C5 = /* @__PURE__ */ L("<span class=tw-sr-only>"), _5 = /* @__PURE__ */ L('<div class="tw-flex tw-items-center @5xl/main:tw-pb-3"><div class="tw-line-clamp-2 tw-flex-1 tw-px-4 tw-text-sm tw-font-bold @5xl/main:tw-line-clamp-1"></div><div class=@5xl/main:tw-hidden>'), S5 = /* @__PURE__ */ L('<div class="tw-flex tw-w-full tw-items-center tw-justify-between tw-gap-2"><div class=tw-text-sm>'), M5 = /* @__PURE__ */ L('<aside><div class="tw-flex-1 tw-overflow-auto tw-border-y tw-border-border tw-py-2">');
const xo = (t) => {
  const [e, n] = N(!1), r = () => t.component.type === ie.NestedInput ? n(!e()) : (je.isSidebarOpen && Qr(), Mt({
    activeDataKey: t.component.dataKey
  }));
  return d(te, {
    get when() {
      var i;
      return J(() => !!((t.component.type === ie.Section || t.component.type === ie.NestedInput || t.component.type === ie.NestedChild) && t.component.enable))() && ((i = t.component.components) == null ? void 0 : i.some((s) => s.enable));
    },
    get children() {
      var i = k5(), s = i.firstChild, o = s.firstChild, a = o.firstChild, l = o.nextSibling;
      return s.$$click = r, k(o, d(te, {
        get when() {
          var c;
          return t.component.type === ie.NestedInput && ((c = t.component.components) == null ? void 0 : c.length);
        },
        get children() {
          return d(hs, {
            get class() {
              return G("tw-mt-0.5 tw-size-4 tw-transition tw-duration-300", e() && "tw-rotate-90 tw-transform");
            }
          });
        }
      }), a), k(i, d(te, {
        get when() {
          return t.component.components;
        },
        get children() {
          return d(xe, {
            get each() {
              return Lo(t.component);
            },
            children: (c) => c.type === ie.NestedChild ? d(kd, {
              class: "tw-pl-4",
              get open() {
                return e();
              },
              get children() {
                return d(Cd, {
                  get children() {
                    return d(xo, {
                      component: c
                    });
                  }
                });
              }
            }) : d(xo, {
              component: c
            })
          });
        }
      }), null), oe((c) => {
        var u = G("fasih-form-sidebar tw-mb-2", t.component.level === 2 && "tw-pl-2", t.component.level === 3 && "tw-pl-4", t.component.type === ie.NestedInput && "tw-pl-0"), f = A(t.component.label), h = G("tw-mr-2 tw-cursor-pointer tw-rounded-lg tw-px-4 tw-py-2 tw-text-foreground hover:tw-bg-primary/10", t.component.type === ie.NestedInput && "tw-text-muted-foreground", t.component.dataKey === je.activeDataKey && "tw-bg-gradient-to-br tw-from-primary-500 tw-to-primary-400 tw-text-primary-foreground hover:tw-bg-gradient-to-b hover:tw-from-primary-400 hover:tw-to-primary-400"), m = A(t.component.label || t.component.dataKey), w = A(t.component.description || "");
        return u !== c.e && De(i, c.e = u), f !== c.t && Xe(s, "title", c.t = f), h !== c.a && De(s, c.a = h), m !== c.o && (a.innerHTML = c.o = m), w !== c.i && (l.innerHTML = c.i = w), c;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0,
        i: void 0
      }), i;
    }
  });
}, O5 = () => (() => {
  var t = Nd();
  return t.$$click = () => Qr(), oe(() => De(t, G("tw-absolute tw-z-40 tw-h-full tw-w-full tw-backdrop-blur-sm tw-transition tw-duration-200 tw-ease-in-out @5xl/main:tw-hidden", !je.isSidebarOpen && "tw-hidden"))), t;
})(), E5 = () => (() => {
  var t = _5(), e = t.firstChild, n = e.nextSibling;
  return k(e, () => A(ae.meta.template.title)), k(n, d(re, {
    variant: "ghost",
    size: "icon",
    onClick: () => Qr(),
    get children() {
      return [d(yn, {
        class: "tw-size-4"
      }), (() => {
        var r = C5();
        return k(r, () => A("close")), r;
      })()];
    }
  })), t;
})(), I5 = () => {
  const t = ht(), e = () => (Qr(), t.open({
    title: A("settings"),
    children: () => d(x5, {})
  }));
  return (() => {
    var n = Nd();
    return k(n, d(re, {
      size: "sm",
      class: "tw-w-full",
      variant: "ghost",
      onClick: e,
      get children() {
        var r = S5(), i = r.firstChild;
        return k(i, () => A("settings")), k(r, d(Tb, {
          class: "tw-size-4"
        }), null), r;
      }
    })), n;
  })();
}, P5 = () => [d(O5, {}), (() => {
  var t = M5(), e = t.firstChild;
  return k(t, d(E5, {}), e), k(e, d(xe, {
    get each() {
      return ae.components;
    },
    children: (n) => d(xo, {
      component: n
    })
  })), k(t, d(I5, {}), null), oe(() => De(t, G("tw-absolute tw-inset-y-0 tw-left-0 tw-z-50 tw-flex tw-h-full tw-w-full tw-max-w-72 tw-translate-x-0 tw-transform tw-flex-col tw-gap-1 tw-border-r tw-bg-background tw-p-4 tw-shadow-md tw-transition tw-duration-200 tw-ease-in-out @5xl/main:tw-static @5xl/main:tw-flex @5xl/main:tw-translate-x-0 @5xl/main:tw-flex-col", !je.isSidebarOpen && "-tw-translate-x-full"))), t;
})()];
qi(["click"]);
var D5 = /* @__PURE__ */ L('<div class="tw-line-clamp-1 tw-w-20 tw-text-xs @2xl/navigation:tw-w-24">'), $5 = /* @__PURE__ */ L('<div class="tw-line-clamp-1 tw-w-20 tw-text-xs md:tw-w-24">'), T5 = /* @__PURE__ */ L('<div class="tw-container tw-absolute tw-inset-x-0 tw-bottom-0 tw-flex tw-items-stretch tw-justify-between tw-p-4 tw-py-2 tw-backdrop-blur-sm tw-@container/navigation"><div id=fasih-form-nav-label class="tw-text-md tw-hidden tw-items-center tw-justify-center tw-rounded-lg tw-border tw-bg-primary tw-px-4 tw-text-center tw-font-medium tw-text-primary-foreground tw-shadow-lg @3xl/navigation:tw-flex"><div class="tw-line-clamp-1 tw-w-16 tw-text-xs tw-font-medium md:tw-w-44">');
const A5 = () => {
  const t = ht(), e = () => Fc(), n = () => Lc(), r = () => {
    var o;
    return A((o = Fo()) == null ? void 0 : o.label);
  }, i = () => {
    var o;
    return A((o = n()) == null ? void 0 : o.label);
  }, s = () => {
    var o;
    return A((o = e()) == null ? void 0 : o.label);
  };
  return (() => {
    var o = T5(), a = o.firstChild, l = a.firstChild;
    return k(o, d(re, {
      variant: "outline",
      onClick: t1,
      get title() {
        return s();
      },
      id: "fasih-form-nav-prev-button",
      get class() {
        return G("tw-rounded-lg", e() === void 0 && "tw-invisible");
      },
      get children() {
        return [d(lb, {
          class: "tw-mr-2 tw-size-4"
        }), (() => {
          var c = D5();
          return k(c, s), c;
        })()];
      }
    }), a), k(l, r), k(o, d(te, {
      get when() {
        return n() !== void 0 || ae.config.formMode !== Nt.Open;
      },
      get fallback() {
        return d(re, {
          color: "primary",
          class: "tw-rounded-lg tw-text-xs",
          id: "fasih-form-nav-submit-button",
          onClick: () => t.open({
            title: A("submit"),
            children: () => d(Vd, {})
          }),
          get children() {
            return [d(ud, {
              class: "tw-mr-2 tw-size-4"
            }), J(() => A("submit"))];
          }
        });
      },
      get children() {
        return d(re, {
          variant: "outline",
          onClick: e1,
          id: "fasih-form-nav-next-button",
          get title() {
            return i();
          },
          get class() {
            return G("tw-rounded-lg", n() === void 0 && "tw-invisible");
          },
          get children() {
            return [(() => {
              var c = $5();
              return k(c, i), c;
            })(), d(cb, {
              class: "tw-ml-2 tw-size-4"
            })];
          }
        });
      }
    }), null), oe(() => Xe(a, "title", r())), o;
  })();
};
var Kd = /* @__PURE__ */ L("<span class=tw-text-destructive>*"), L5 = /* @__PURE__ */ L("<div><div>"), F5 = /* @__PURE__ */ L('<span class="tw-text-xs tw-text-muted-foreground">'), z5 = /* @__PURE__ */ L('<div class="tw-flex tw-space-x-2"><div>'), R5 = /* @__PURE__ */ L('<div class="tw-flex tw-flex-1 tw-flex-col tw-pr-2 tw-font-semibold">');
const V5 = (t) => {
  const [e, n] = N(!0), [r, i] = N(), [s, o] = N(!1), a = () => {
    var l;
    return n((((l = r()) == null ? void 0 : l.offsetHeight) || 0) <= 36);
  };
  return Z(a), en(() => window.addEventListener("resize", a)), me(() => window.removeEventListener("resize", a)), [(() => {
    var l = L5(), c = l.firstChild;
    return vt(i, l), k(l, d(te, {
      get when() {
        return t.required === !0;
      },
      get children() {
        return Kd();
      }
    }), null), k(l, d(te, {
      get when() {
        return t.hint;
      },
      get children() {
        return d(re, {
          size: "icon",
          variant: "ghost",
          onClick: () => o(!s()),
          get children() {
            return d(_b, {
              class: "tw-size-4 tw-text-primary"
            });
          }
        });
      }
    }), null), oe((u) => {
      var f = G("tw-flex tw-gap-2", e() && "tw-items-center"), h = G(!e() && "tw-flex-1"), m = A(t.label);
      return f !== u.e && De(l, u.e = f), h !== u.t && De(c, u.t = h), m !== u.a && (c.innerHTML = u.a = m), u;
    }, {
      e: void 0,
      t: void 0,
      a: void 0
    }), l;
  })(), d(te, {
    get when() {
      return t.hint;
    },
    get children() {
      return d(kd, {
        get open() {
          return s();
        },
        onOpenChange: o,
        get children() {
          return d(Cd, {
            get children() {
              var l = F5();
              return k(l, () => A(t.hint)), l;
            }
          });
        }
      });
    }
  })];
}, Bd = (t) => (() => {
  var e = R5();
  return k(e, d(te, {
    get when() {
      return !t.hint;
    },
    get children() {
      var n = z5(), r = n.firstChild;
      return k(n, d(te, {
        get when() {
          return t.required === !0;
        },
        get children() {
          return Kd();
        }
      }), null), oe(() => r.innerHTML = A(t.label)), n;
    }
  }), null), k(e, d(te, {
    get when() {
      return t.hint;
    },
    get children() {
      return d(V5, t);
    }
  }), null), e;
})();
var N5 = /* @__PURE__ */ L("<div class=tw-space-y-2>"), K5 = /* @__PURE__ */ L('<div class="tw-flex tw-flex-col-reverse tw-justify-end tw-gap-2 sm:tw-flex-row">'), B5 = /* @__PURE__ */ L('<div class="tw-flex tw-flex-col tw-gap-2 tw-overflow-auto"><div class="tw-flex-1 tw-overflow-auto">'), j5 = /* @__PURE__ */ L('<div class="tw-italic tw-text-muted-foreground">'), W5 = /* @__PURE__ */ L("<span class=tw-text-xs>"), H5 = /* @__PURE__ */ L('<div class="tw-space-y-2 tw-rounded-sm tw-p-2 tw-text-left odd:tw-bg-muted/75"><div class="tw-flex tw-items-center tw-justify-between"><div class="tw-line-clamp-1 tw-flex-1 tw-font-bold"></div></div><div class="tw-text-sm tw-font-medium">');
const U5 = (t) => {
  const e = ht(), [n, r] = N(!1), [i, s] = N(""), o = (l) => {
    l.target.value && r(!1), s(l.target.value);
  }, a = () => {
    if (!i())
      return r(!0);
    ae.addRemark(t.dataKey, {
      comment: i(),
      datetime: (/* @__PURE__ */ new Date()).toISOString()
    }), s("");
  };
  return (() => {
    var l = B5(), c = l.firstChild;
    return k(c, d(xe, {
      get each() {
        return t.remarks;
      },
      get fallback() {
        return (() => {
          var u = j5();
          return k(u, () => A("no.remarks")), u;
        })();
      },
      children: (u) => (() => {
        var f = H5(), h = f.firstChild, m = h.firstChild, w = h.nextSibling;
        return k(m, () => u.sender), k(h, d(te, {
          get when() {
            return u.datetime;
          },
          get children() {
            var g = W5();
            return k(g, () => new Date(u.datetime).toLocaleDateString()), g;
          }
        }), null), k(w, () => u.comment), f;
      })()
    })), k(l, d(te, {
      get when() {
        return ae.config.formMode === Nt.Open || ae.config.formMode === Nt.Review;
      },
      get children() {
        return [(() => {
          var u = N5();
          return k(u, d(Ot, {
            get children() {
              return d(id, {
                get value() {
                  return i();
                },
                onChange: o,
                get class() {
                  return G("tw-border focus:tw-border-primary", n() && "border-destructive");
                }
              });
            }
          })), u;
        })(), (() => {
          var u = K5();
          return k(u, d(re, {
            variant: "outline",
            onClick: () => e.closeAll(),
            get children() {
              return A("cancel");
            }
          }), null), k(u, d(re, {
            onClick: a,
            class: "tw-w-full sm:tw-w-auto",
            get children() {
              return A("add.remark");
            }
          }), null), u;
        })()];
      }
    }), null), l;
  })();
};
var q5 = /* @__PURE__ */ L('<div class="tw-absolute tw--right-2 tw--top-2">');
const Il = (t) => {
  const e = ht(), [n] = K(t, ["class"]);
  return d(re, {
    size: "icon",
    role: "button",
    variant: "ghost",
    get title() {
      return A("remark");
    },
    get "aria-label"() {
      return A("remark");
    },
    get class() {
      return G("tw-relative tw-text-primary hover:tw-text-primary-400", n.class);
    },
    onClick: () => e.open({
      title: A("remark"),
      children: () => d(U5, t)
    }),
    get children() {
      return [d(Ob, {
        class: "tw-size-4"
      }), d(te, {
        get when() {
          return t.remarks;
        },
        get children() {
          var r = q5();
          return k(r, d(Sd, {
            class: "tw-rounded-full tw-text-xs",
            get children() {
              var i;
              return (i = t.remarks) == null ? void 0 : i.length;
            }
          })), r;
        }
      })];
    }
  });
};
var G5 = /* @__PURE__ */ L("<div>"), Y5 = /* @__PURE__ */ L('<div class="tw-flex tw-flex-row tw-items-start tw-space-x-2"><span>'), X5 = /* @__PURE__ */ L('<div class="tw-flex tw-flex-col tw-gap-2 tw-rounded-lg tw-bg-background tw-py-2 @lg/form:tw-flex-row"><div class="tw-flex tw-items-start @lg/form:tw-w-1/2"></div><div class="tw-flex tw-flex-col tw-space-y-2 @lg/form:tw-flex-1"><div class="tw-flex tw-items-start tw-space-x-2"><div class=tw-flex-1>');
const jd = (t) => (() => {
  var e = G5();
  return k(e, d(xe, {
    get each() {
      return t.message || [];
    },
    children: (n) => (() => {
      var r = Y5(), i = r.firstChild;
      return k(r, d(sd, {
        class: "tw-size-4"
      }), i), k(i, () => A(n, t.params)), r;
    })()
  })), oe(() => De(e, G("tw-space-y-2 tw-text-xs tw-font-bold", t.state === ct.Invalid && "tw-text-destructive", t.state === ct.Warning && "tw-text-foreground"))), e;
})(), Me = (t) => (() => {
  var e = X5(), n = e.firstChild, r = n.nextSibling, i = r.firstChild, s = i.firstChild;
  return k(n, d(Bd, t), null), k(n, d(te, {
    get when() {
      return t.enableRemark;
    },
    get children() {
      return d(Il, D({
        class: "tw-flex @lg/form:tw-hidden"
      }, t));
    }
  }), null), k(s, () => t.children), k(i, d(te, {
    get when() {
      return t.enableRemark;
    },
    get children() {
      return d(Il, D({
        class: "tw-hidden @lg/form:tw-flex"
      }, t));
    }
  }), null), k(r, d(jd, {
    get message() {
      return t.validationMessage;
    },
    get params() {
      return t.validationParams;
    },
    get state() {
      return t.validationState;
    }
  }), null), e;
})(), ai = (t) => {
  const [e, n] = N(t.options ?? []), r = () => Ur(t.answer ?? []).sort((o, a) => Number(o.value) - Number(a.value)).map((o) => {
    const a = e().find((l) => l.value === o.value);
    return A((a == null ? void 0 : a.label) ?? o.label);
  }).join(", ");
  K2(t.dataKey, (o, a) => {
    $e.emit("lookup-request", t.dataKey, o, a);
  });
  const i = (o) => t.type === ie.SelectInput ? o.some((a) => {
    var l, c;
    return a.value === ((l = t.answer) == null ? void 0 : l[0].value) && a.label === ((c = t.answer) == null ? void 0 : c[0].label);
  }) : !0, s = (o, a, l) => {
    if (o !== t.dataKey || !l)
      return;
    const c = Kf(Nr(l), Nr(a));
    !i(c) && t.answer !== void 0 && t.onValueChange(void 0), n(c);
  };
  return $e.on("lookup-fetched", s), me(() => {
    $e.off("lookup-fetched", s);
  }), {
    options: e,
    answerLabel: r,
    fetch
  };
}, Wd = (t) => {
  const e = {
    1: "tw-grid tw-grid-cols-1",
    2: "tw-grid tw-grid-cols-2",
    3: "tw-grid tw-grid-cols-3",
    4: "tw-grid tw-grid-cols-4",
    5: "tw-grid tw-grid-cols-5",
    6: "tw-grid tw-grid-cols-6"
  }, n = Object.keys(e).length;
  return t < 1 ? e[1] : t > n ? e[n] : e[t];
}, Qe = (t, e = "default") => {
  switch (t) {
    case ct.Invalid:
      return G(
        "tw-border-destructive",
        e === "tw-ring" && "tw-ring-1 tw-ring-destructive"
      );
    case ct.Warning:
      return G(
        "tw-border-foreground",
        e === "tw-ring" && "tw-ring-1 tw-ring-foreground"
      );
    default:
      return "";
  }
}, Q5 = Fe(), vs = (t) => {
  const e = () => Ur(t.answer ?? []).find((o) => o.open), n = () => e() !== void 0, r = () => {
    var o;
    return (o = Ur(t.options).find((a) => {
      var l;
      return a.value === ((l = e()) == null ? void 0 : l.value);
    })) == null ? void 0 : o.label;
  }, i = () => {
    var o, a;
    return ((o = e()) == null ? void 0 : o.label) === r() ? "" : (a = e()) == null ? void 0 : a.label;
  }, s = (o) => {
    if (t.answer === void 0)
      return;
    const a = t.answer.map((l) => (l.open && (l.label = o), l));
    t.onValueChange(a);
  };
  return d(Q5.Provider, {
    value: t,
    get children() {
      return [J(() => t.children), d(te, {
        get when() {
          return n();
        },
        get children() {
          return d(Ot, {
            class: "tw-mt-4",
            get children() {
              return d(jt, {
                autofocus: !0,
                type: "text",
                onBlur: (o) => {
                  s(o.target.value);
                },
                get placeholder() {
                  return A("fill.other");
                },
                get readOnly() {
                  return t.disabled;
                },
                get value() {
                  return A(i());
                },
                get prefix() {
                  return A(r()) + ":";
                },
                get class() {
                  return G(Qe(t.validationState));
                }
              });
            }
          });
        }
      })];
    }
  });
}, Hd = (t, e) => {
  const n = [], r = Math.ceil(t.length / e);
  for (let i = 0; i < t.length; i += r) {
    const s = t.slice(i, i + r);
    n.push(s);
  }
  return n;
};
var J5 = /* @__PURE__ */ L("<div>"), Z5 = /* @__PURE__ */ L('<div class="tw-flex tw-flex-col tw-gap-3">'), e4 = /* @__PURE__ */ L("<span>"), t4 = /* @__PURE__ */ L('<div class="tw-grid tw-gap-1.5 tw-leading-none">');
const n4 = (t) => {
  const {
    options: e
  } = ai(t);
  return d(Me, D(t, {
    get children() {
      return d(vs, D(t, {
        get children() {
          var n = J5();
          return k(n, d(xe, {
            get each() {
              return Hd(e(), t.cols ?? 1);
            },
            children: (r) => (() => {
              var i = Z5();
              return k(i, d(xe, {
                each: r,
                children: (s) => d(yd, {
                  get disabled() {
                    return t.disabled;
                  },
                  class: "tw-flex tw-items-start tw-space-x-2",
                  get checked() {
                    var o;
                    return !!((o = t.answer) != null && o.find((a) => a.value === s.value));
                  },
                  onChange: (o) => {
                    var l;
                    const a = o ? [...t.answer || [], {
                      ...s,
                      value: s.value,
                      label: s.label
                    }] : ((l = t.answer) == null ? void 0 : l.filter((c) => c.value !== s.value)) || [];
                    t.onValueChange(a);
                  },
                  get children() {
                    return [d(xd, {}), d(bd, {}), (() => {
                      var o = t4();
                      return k(o, d(vd, {
                        get class() {
                          return G("tw--mt-[3px] tw-cursor-pointer tw-truncate tw-text-pretty tw-text-sm tw-font-normal tw-leading-normal", t.disabled && "cursor-default text-muted-foreground");
                        },
                        get children() {
                          var a = e4();
                          return oe(() => a.innerHTML = A(s.label)), a;
                        }
                      })), o;
                    })()];
                  }
                })
              })), i;
            })()
          })), oe(() => De(n, G("tw-gap-3", Wd(t.cols ?? 1)))), n;
        }
      }));
    }
  }));
};
var Ud = { exports: {} };
/* @license
Papa Parse
v5.4.1
https://github.com/mholt/PapaParse
License: MIT
*/
(function(t, e) {
  (function(n, r) {
    t.exports = r();
  })(Te, function n() {
    var r = typeof self < "u" ? self : typeof window < "u" ? window : r !== void 0 ? r : {}, i = !r.document && !!r.postMessage, s = r.IS_PAPA_WORKER || !1, o = {}, a = 0, l = { parse: function(x, y) {
      var z = (y = y || {}).dynamicTyping || !1;
      if (T(z) && (y.dynamicTypingFunction = z, z = {}), y.dynamicTyping = z, y.transform = !!T(y.transform) && y.transform, y.worker && l.WORKERS_SUPPORTED) {
        var I = function() {
          if (!l.WORKERS_SUPPORTED)
            return !1;
          var Q = (S = r.URL || r.webkitURL || null, M = n.toString(), l.BLOB_URL || (l.BLOB_URL = S.createObjectURL(new Blob(["var global = (function() { if (typeof self !== 'undefined') { return self; } if (typeof window !== 'undefined') { return window; } if (typeof global !== 'undefined') { return global; } return {}; })(); global.IS_PAPA_WORKER=true; ", "(", M, ")();"], { type: "text/javascript" })))), H = new r.Worker(Q), S, M;
          return H.onmessage = b, H.id = a++, o[H.id] = H;
        }();
        return I.userStep = y.step, I.userChunk = y.chunk, I.userComplete = y.complete, I.userError = y.error, y.step = T(y.step), y.chunk = T(y.chunk), y.complete = T(y.complete), y.error = T(y.error), delete y.worker, void I.postMessage({ input: x, config: y, workerId: I.id });
      }
      var O = null;
      return l.NODE_STREAM_INPUT, typeof x == "string" ? (x = function(Q) {
        return Q.charCodeAt(0) === 65279 ? Q.slice(1) : Q;
      }(x), O = y.download ? new f(y) : new m(y)) : x.readable === !0 && T(x.read) && T(x.on) ? O = new w(y) : (r.File && x instanceof File || x instanceof Object) && (O = new h(y)), O.stream(x);
    }, unparse: function(x, y) {
      var z = !1, I = !0, O = ",", Q = `\r
`, H = '"', S = H + H, M = !1, P = null, B = !1;
      (function() {
        if (typeof y == "object") {
          if (typeof y.delimiter != "string" || l.BAD_DELIMITERS.filter(function($) {
            return y.delimiter.indexOf($) !== -1;
          }).length || (O = y.delimiter), (typeof y.quotes == "boolean" || typeof y.quotes == "function" || Array.isArray(y.quotes)) && (z = y.quotes), typeof y.skipEmptyLines != "boolean" && typeof y.skipEmptyLines != "string" || (M = y.skipEmptyLines), typeof y.newline == "string" && (Q = y.newline), typeof y.quoteChar == "string" && (H = y.quoteChar), typeof y.header == "boolean" && (I = y.header), Array.isArray(y.columns)) {
            if (y.columns.length === 0)
              throw new Error("Option columns is empty");
            P = y.columns;
          }
          y.escapeChar !== void 0 && (S = y.escapeChar + H), (typeof y.escapeFormulae == "boolean" || y.escapeFormulae instanceof RegExp) && (B = y.escapeFormulae instanceof RegExp ? y.escapeFormulae : /^[=+\-@\t\r].*$/);
        }
      })();
      var V = new RegExp(p(H), "g");
      if (typeof x == "string" && (x = JSON.parse(x)), Array.isArray(x)) {
        if (!x.length || Array.isArray(x[0]))
          return X(null, x, M);
        if (typeof x[0] == "object")
          return X(P || Object.keys(x[0]), x, M);
      } else if (typeof x == "object")
        return typeof x.data == "string" && (x.data = JSON.parse(x.data)), Array.isArray(x.data) && (x.fields || (x.fields = x.meta && x.meta.fields || P), x.fields || (x.fields = Array.isArray(x.data[0]) ? x.fields : typeof x.data[0] == "object" ? Object.keys(x.data[0]) : []), Array.isArray(x.data[0]) || typeof x.data[0] == "object" || (x.data = [x.data])), X(x.fields || [], x.data || [], M);
      throw new Error("Unable to serialize unrecognized input");
      function X($, W, ee) {
        var U = "";
        typeof $ == "string" && ($ = JSON.parse($)), typeof W == "string" && (W = JSON.parse(W));
        var se = Array.isArray($) && 0 < $.length, de = !Array.isArray(W[0]);
        if (se && I) {
          for (var le = 0; le < $.length; le++)
            0 < le && (U += O), U += q($[le], le);
          0 < W.length && (U += Q);
        }
        for (var ne = 0; ne < W.length; ne++) {
          var he = se ? $.length : W[ne].length, ke = !1, Le = se ? Object.keys(W[ne]).length === 0 : W[ne].length === 0;
          if (ee && !se && (ke = ee === "greedy" ? W[ne].join("").trim() === "" : W[ne].length === 1 && W[ne][0].length === 0), ee === "greedy" && se) {
            for (var ge = [], Oe = 0; Oe < he; Oe++) {
              var ue = de ? $[Oe] : Oe;
              ge.push(W[ne][ue]);
            }
            ke = ge.join("").trim() === "";
          }
          if (!ke) {
            for (var ye = 0; ye < he; ye++) {
              0 < ye && !Le && (U += O);
              var Re = se && de ? $[ye] : ye;
              U += q(W[ne][Re], ye);
            }
            ne < W.length - 1 && (!ee || 0 < he && !Le) && (U += Q);
          }
        }
        return U;
      }
      function q($, W) {
        if ($ == null)
          return "";
        if ($.constructor === Date)
          return JSON.stringify($).slice(1, 25);
        var ee = !1;
        B && typeof $ == "string" && B.test($) && ($ = "'" + $, ee = !0);
        var U = $.toString().replace(V, S);
        return (ee = ee || z === !0 || typeof z == "function" && z($, W) || Array.isArray(z) && z[W] || function(se, de) {
          for (var le = 0; le < de.length; le++)
            if (-1 < se.indexOf(de[le]))
              return !0;
          return !1;
        }(U, l.BAD_DELIMITERS) || -1 < U.indexOf(O) || U.charAt(0) === " " || U.charAt(U.length - 1) === " ") ? H + U + H : U;
      }
    } };
    if (l.RECORD_SEP = "", l.UNIT_SEP = "", l.BYTE_ORDER_MARK = "\uFEFF", l.BAD_DELIMITERS = ["\r", `
`, '"', l.BYTE_ORDER_MARK], l.WORKERS_SUPPORTED = !i && !!r.Worker, l.NODE_STREAM_INPUT = 1, l.LocalChunkSize = 10485760, l.RemoteChunkSize = 5242880, l.DefaultDelimiter = ",", l.Parser = v, l.ParserHandle = g, l.NetworkStreamer = f, l.FileStreamer = h, l.StringStreamer = m, l.ReadableStreamStreamer = w, r.jQuery) {
      var c = r.jQuery;
      c.fn.parse = function(x) {
        var y = x.config || {}, z = [];
        return this.each(function(Q) {
          if (!(c(this).prop("tagName").toUpperCase() === "INPUT" && c(this).attr("type").toLowerCase() === "file" && r.FileReader) || !this.files || this.files.length === 0)
            return !0;
          for (var H = 0; H < this.files.length; H++)
            z.push({ file: this.files[H], inputElem: this, instanceConfig: c.extend({}, y) });
        }), I(), this;
        function I() {
          if (z.length !== 0) {
            var Q, H, S, M, P = z[0];
            if (T(x.before)) {
              var B = x.before(P.file, P.inputElem);
              if (typeof B == "object") {
                if (B.action === "abort")
                  return Q = "AbortError", H = P.file, S = P.inputElem, M = B.reason, void (T(x.error) && x.error({ name: Q }, H, S, M));
                if (B.action === "skip")
                  return void O();
                typeof B.config == "object" && (P.instanceConfig = c.extend(P.instanceConfig, B.config));
              } else if (B === "skip")
                return void O();
            }
            var V = P.instanceConfig.complete;
            P.instanceConfig.complete = function(X) {
              T(V) && V(X, P.file, P.inputElem), O();
            }, l.parse(P.file, P.instanceConfig);
          } else
            T(x.complete) && x.complete();
        }
        function O() {
          z.splice(0, 1), I();
        }
      };
    }
    function u(x) {
      this._handle = null, this._finished = !1, this._completed = !1, this._halted = !1, this._input = null, this._baseIndex = 0, this._partialLine = "", this._rowCount = 0, this._start = 0, this._nextChunk = null, this.isFirstChunk = !0, this._completeResults = { data: [], errors: [], meta: {} }, (function(y) {
        var z = E(y);
        z.chunkSize = parseInt(z.chunkSize), y.step || y.chunk || (z.chunkSize = null), this._handle = new g(z), (this._handle.streamer = this)._config = z;
      }).call(this, x), this.parseChunk = function(y, z) {
        if (this.isFirstChunk && T(this._config.beforeFirstChunk)) {
          var I = this._config.beforeFirstChunk(y);
          I !== void 0 && (y = I);
        }
        this.isFirstChunk = !1, this._halted = !1;
        var O = this._partialLine + y;
        this._partialLine = "";
        var Q = this._handle.parse(O, this._baseIndex, !this._finished);
        if (!this._handle.paused() && !this._handle.aborted()) {
          var H = Q.meta.cursor;
          this._finished || (this._partialLine = O.substring(H - this._baseIndex), this._baseIndex = H), Q && Q.data && (this._rowCount += Q.data.length);
          var S = this._finished || this._config.preview && this._rowCount >= this._config.preview;
          if (s)
            r.postMessage({ results: Q, workerId: l.WORKER_ID, finished: S });
          else if (T(this._config.chunk) && !z) {
            if (this._config.chunk(Q, this._handle), this._handle.paused() || this._handle.aborted())
              return void (this._halted = !0);
            Q = void 0, this._completeResults = void 0;
          }
          return this._config.step || this._config.chunk || (this._completeResults.data = this._completeResults.data.concat(Q.data), this._completeResults.errors = this._completeResults.errors.concat(Q.errors), this._completeResults.meta = Q.meta), this._completed || !S || !T(this._config.complete) || Q && Q.meta.aborted || (this._config.complete(this._completeResults, this._input), this._completed = !0), S || Q && Q.meta.paused || this._nextChunk(), Q;
        }
        this._halted = !0;
      }, this._sendError = function(y) {
        T(this._config.error) ? this._config.error(y) : s && this._config.error && r.postMessage({ workerId: l.WORKER_ID, error: y, finished: !1 });
      };
    }
    function f(x) {
      var y;
      (x = x || {}).chunkSize || (x.chunkSize = l.RemoteChunkSize), u.call(this, x), this._nextChunk = i ? function() {
        this._readChunk(), this._chunkLoaded();
      } : function() {
        this._readChunk();
      }, this.stream = function(z) {
        this._input = z, this._nextChunk();
      }, this._readChunk = function() {
        if (this._finished)
          this._chunkLoaded();
        else {
          if (y = new XMLHttpRequest(), this._config.withCredentials && (y.withCredentials = this._config.withCredentials), i || (y.onload = F(this._chunkLoaded, this), y.onerror = F(this._chunkError, this)), y.open(this._config.downloadRequestBody ? "POST" : "GET", this._input, !i), this._config.downloadRequestHeaders) {
            var z = this._config.downloadRequestHeaders;
            for (var I in z)
              y.setRequestHeader(I, z[I]);
          }
          if (this._config.chunkSize) {
            var O = this._start + this._config.chunkSize - 1;
            y.setRequestHeader("Range", "bytes=" + this._start + "-" + O);
          }
          try {
            y.send(this._config.downloadRequestBody);
          } catch (Q) {
            this._chunkError(Q.message);
          }
          i && y.status === 0 && this._chunkError();
        }
      }, this._chunkLoaded = function() {
        y.readyState === 4 && (y.status < 200 || 400 <= y.status ? this._chunkError() : (this._start += this._config.chunkSize ? this._config.chunkSize : y.responseText.length, this._finished = !this._config.chunkSize || this._start >= function(z) {
          var I = z.getResponseHeader("Content-Range");
          return I === null ? -1 : parseInt(I.substring(I.lastIndexOf("/") + 1));
        }(y), this.parseChunk(y.responseText)));
      }, this._chunkError = function(z) {
        var I = y.statusText || z;
        this._sendError(new Error(I));
      };
    }
    function h(x) {
      var y, z;
      (x = x || {}).chunkSize || (x.chunkSize = l.LocalChunkSize), u.call(this, x);
      var I = typeof FileReader < "u";
      this.stream = function(O) {
        this._input = O, z = O.slice || O.webkitSlice || O.mozSlice, I ? ((y = new FileReader()).onload = F(this._chunkLoaded, this), y.onerror = F(this._chunkError, this)) : y = new FileReaderSync(), this._nextChunk();
      }, this._nextChunk = function() {
        this._finished || this._config.preview && !(this._rowCount < this._config.preview) || this._readChunk();
      }, this._readChunk = function() {
        var O = this._input;
        if (this._config.chunkSize) {
          var Q = Math.min(this._start + this._config.chunkSize, this._input.size);
          O = z.call(O, this._start, Q);
        }
        var H = y.readAsText(O, this._config.encoding);
        I || this._chunkLoaded({ target: { result: H } });
      }, this._chunkLoaded = function(O) {
        this._start += this._config.chunkSize, this._finished = !this._config.chunkSize || this._start >= this._input.size, this.parseChunk(O.target.result);
      }, this._chunkError = function() {
        this._sendError(y.error);
      };
    }
    function m(x) {
      var y;
      u.call(this, x = x || {}), this.stream = function(z) {
        return y = z, this._nextChunk();
      }, this._nextChunk = function() {
        if (!this._finished) {
          var z, I = this._config.chunkSize;
          return I ? (z = y.substring(0, I), y = y.substring(I)) : (z = y, y = ""), this._finished = !y, this.parseChunk(z);
        }
      };
    }
    function w(x) {
      u.call(this, x = x || {});
      var y = [], z = !0, I = !1;
      this.pause = function() {
        u.prototype.pause.apply(this, arguments), this._input.pause();
      }, this.resume = function() {
        u.prototype.resume.apply(this, arguments), this._input.resume();
      }, this.stream = function(O) {
        this._input = O, this._input.on("data", this._streamData), this._input.on("end", this._streamEnd), this._input.on("error", this._streamError);
      }, this._checkIsFinished = function() {
        I && y.length === 1 && (this._finished = !0);
      }, this._nextChunk = function() {
        this._checkIsFinished(), y.length ? this.parseChunk(y.shift()) : z = !0;
      }, this._streamData = F(function(O) {
        try {
          y.push(typeof O == "string" ? O : O.toString(this._config.encoding)), z && (z = !1, this._checkIsFinished(), this.parseChunk(y.shift()));
        } catch (Q) {
          this._streamError(Q);
        }
      }, this), this._streamError = F(function(O) {
        this._streamCleanUp(), this._sendError(O);
      }, this), this._streamEnd = F(function() {
        this._streamCleanUp(), I = !0, this._streamData("");
      }, this), this._streamCleanUp = F(function() {
        this._input.removeListener("data", this._streamData), this._input.removeListener("end", this._streamEnd), this._input.removeListener("error", this._streamError);
      }, this);
    }
    function g(x) {
      var y, z, I, O = Math.pow(2, 53), Q = -O, H = /^\s*-?(\d+\.?|\.\d+|\d+\.\d+)([eE][-+]?\d+)?\s*$/, S = /^((\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)))$/, M = this, P = 0, B = 0, V = !1, X = !1, q = [], $ = { data: [], errors: [], meta: {} };
      if (T(x.step)) {
        var W = x.step;
        x.step = function(ne) {
          if ($ = ne, se())
            U();
          else {
            if (U(), $.data.length === 0)
              return;
            P += ne.data.length, x.preview && P > x.preview ? z.abort() : ($.data = $.data[0], W($, M));
          }
        };
      }
      function ee(ne) {
        return x.skipEmptyLines === "greedy" ? ne.join("").trim() === "" : ne.length === 1 && ne[0].length === 0;
      }
      function U() {
        return $ && I && (le("Delimiter", "UndetectableDelimiter", "Unable to auto-detect delimiting character; defaulted to '" + l.DefaultDelimiter + "'"), I = !1), x.skipEmptyLines && ($.data = $.data.filter(function(ne) {
          return !ee(ne);
        })), se() && function() {
          if (!$)
            return;
          function ne(ke, Le) {
            T(x.transformHeader) && (ke = x.transformHeader(ke, Le)), q.push(ke);
          }
          if (Array.isArray($.data[0])) {
            for (var he = 0; se() && he < $.data.length; he++)
              $.data[he].forEach(ne);
            $.data.splice(0, 1);
          } else
            $.data.forEach(ne);
        }(), function() {
          if (!$ || !x.header && !x.dynamicTyping && !x.transform)
            return $;
          function ne(ke, Le) {
            var ge, Oe = x.header ? {} : [];
            for (ge = 0; ge < ke.length; ge++) {
              var ue = ge, ye = ke[ge];
              x.header && (ue = ge >= q.length ? "__parsed_extra" : q[ge]), x.transform && (ye = x.transform(ye, ue)), ye = de(ue, ye), ue === "__parsed_extra" ? (Oe[ue] = Oe[ue] || [], Oe[ue].push(ye)) : Oe[ue] = ye;
            }
            return x.header && (ge > q.length ? le("FieldMismatch", "TooManyFields", "Too many fields: expected " + q.length + " fields but parsed " + ge, B + Le) : ge < q.length && le("FieldMismatch", "TooFewFields", "Too few fields: expected " + q.length + " fields but parsed " + ge, B + Le)), Oe;
          }
          var he = 1;
          return !$.data.length || Array.isArray($.data[0]) ? ($.data = $.data.map(ne), he = $.data.length) : $.data = ne($.data, 0), x.header && $.meta && ($.meta.fields = q), B += he, $;
        }();
      }
      function se() {
        return x.header && q.length === 0;
      }
      function de(ne, he) {
        return ke = ne, x.dynamicTypingFunction && x.dynamicTyping[ke] === void 0 && (x.dynamicTyping[ke] = x.dynamicTypingFunction(ke)), (x.dynamicTyping[ke] || x.dynamicTyping) === !0 ? he === "true" || he === "TRUE" || he !== "false" && he !== "FALSE" && (function(Le) {
          if (H.test(Le)) {
            var ge = parseFloat(Le);
            if (Q < ge && ge < O)
              return !0;
          }
          return !1;
        }(he) ? parseFloat(he) : S.test(he) ? new Date(he) : he === "" ? null : he) : he;
        var ke;
      }
      function le(ne, he, ke, Le) {
        var ge = { type: ne, code: he, message: ke };
        Le !== void 0 && (ge.row = Le), $.errors.push(ge);
      }
      this.parse = function(ne, he, ke) {
        var Le = x.quoteChar || '"';
        if (x.newline || (x.newline = function(ue, ye) {
          ue = ue.substring(0, 1048576);
          var Re = new RegExp(p(ye) + "([^]*?)" + p(ye), "gm"), qe = (ue = ue.replace(Re, "")).split("\r"), Ke = ue.split(`
`), ot = 1 < Ke.length && Ke[0].length < qe[0].length;
          if (qe.length === 1 || ot)
            return `
`;
          for (var Ze = 0, Ce = 0; Ce < qe.length; Ce++)
            qe[Ce][0] === `
` && Ze++;
          return Ze >= qe.length / 2 ? `\r
` : "\r";
        }(ne, Le)), I = !1, x.delimiter)
          T(x.delimiter) && (x.delimiter = x.delimiter(ne), $.meta.delimiter = x.delimiter);
        else {
          var ge = function(ue, ye, Re, qe, Ke) {
            var ot, Ze, Ce, Be;
            Ke = Ke || [",", "	", "|", ";", l.RECORD_SEP, l.UNIT_SEP];
            for (var Y = 0; Y < Ke.length; Y++) {
              var j = Ke[Y], be = 0, Ee = 0, rt = 0;
              Ce = void 0;
              for (var rn = new v({ comments: qe, delimiter: j, newline: ye, preview: 10 }).parse(ue), sn = 0; sn < rn.data.length; sn++)
                if (Re && ee(rn.data[sn]))
                  rt++;
                else {
                  var on = rn.data[sn].length;
                  Ee += on, Ce !== void 0 ? 0 < on && (be += Math.abs(on - Ce), Ce = on) : Ce = on;
                }
              0 < rn.data.length && (Ee /= rn.data.length - rt), (Ze === void 0 || be <= Ze) && (Be === void 0 || Be < Ee) && 1.99 < Ee && (Ze = be, ot = j, Be = Ee);
            }
            return { successful: !!(x.delimiter = ot), bestDelimiter: ot };
          }(ne, x.newline, x.skipEmptyLines, x.comments, x.delimitersToGuess);
          ge.successful ? x.delimiter = ge.bestDelimiter : (I = !0, x.delimiter = l.DefaultDelimiter), $.meta.delimiter = x.delimiter;
        }
        var Oe = E(x);
        return x.preview && x.header && Oe.preview++, y = ne, z = new v(Oe), $ = z.parse(y, he, ke), U(), V ? { meta: { paused: !0 } } : $ || { meta: { paused: !1 } };
      }, this.paused = function() {
        return V;
      }, this.pause = function() {
        V = !0, z.abort(), y = T(x.chunk) ? "" : y.substring(z.getCharIndex());
      }, this.resume = function() {
        M.streamer._halted ? (V = !1, M.streamer.parseChunk(y, !0)) : setTimeout(M.resume, 3);
      }, this.aborted = function() {
        return X;
      }, this.abort = function() {
        X = !0, z.abort(), $.meta.aborted = !0, T(x.complete) && x.complete($), y = "";
      };
    }
    function p(x) {
      return x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
    function v(x) {
      var y, z = (x = x || {}).delimiter, I = x.newline, O = x.comments, Q = x.step, H = x.preview, S = x.fastMode, M = y = x.quoteChar === void 0 || x.quoteChar === null ? '"' : x.quoteChar;
      if (x.escapeChar !== void 0 && (M = x.escapeChar), (typeof z != "string" || -1 < l.BAD_DELIMITERS.indexOf(z)) && (z = ","), O === z)
        throw new Error("Comment character same as delimiter");
      O === !0 ? O = "#" : (typeof O != "string" || -1 < l.BAD_DELIMITERS.indexOf(O)) && (O = !1), I !== `
` && I !== "\r" && I !== `\r
` && (I = `
`);
      var P = 0, B = !1;
      this.parse = function(V, X, q) {
        if (typeof V != "string")
          throw new Error("Input must be a string");
        var $ = V.length, W = z.length, ee = I.length, U = O.length, se = T(Q), de = [], le = [], ne = [], he = P = 0;
        if (!V)
          return yt();
        if (x.header && !X) {
          var ke = V.split(I)[0].split(z), Le = [], ge = {}, Oe = !1;
          for (var ue in ke) {
            var ye = ke[ue];
            T(x.transformHeader) && (ye = x.transformHeader(ye, ue));
            var Re = ye, qe = ge[ye] || 0;
            for (0 < qe && (Oe = !0, Re = ye + "_" + qe), ge[ye] = qe + 1; Le.includes(Re); )
              Re = Re + "_" + qe;
            Le.push(Re);
          }
          if (Oe) {
            var Ke = V.split(I);
            Ke[0] = Le.join(z), V = Ke.join(I);
          }
        }
        if (S || S !== !1 && V.indexOf(y) === -1) {
          for (var ot = V.split(I), Ze = 0; Ze < ot.length; Ze++) {
            if (ne = ot[Ze], P += ne.length, Ze !== ot.length - 1)
              P += I.length;
            else if (q)
              return yt();
            if (!O || ne.substring(0, U) !== O) {
              if (se) {
                if (de = [], rt(ne.split(z)), li(), B)
                  return yt();
              } else
                rt(ne.split(z));
              if (H && H <= Ze)
                return de = de.slice(0, H), yt(!0);
            }
          }
          return yt();
        }
        for (var Ce = V.indexOf(z, P), Be = V.indexOf(I, P), Y = new RegExp(p(M) + p(y), "g"), j = V.indexOf(y, P); ; )
          if (V[P] !== y)
            if (O && ne.length === 0 && V.substring(P, P + U) === O) {
              if (Be === -1)
                return yt();
              P = Be + ee, Be = V.indexOf(I, P), Ce = V.indexOf(z, P);
            } else if (Ce !== -1 && (Ce < Be || Be === -1))
              ne.push(V.substring(P, Ce)), P = Ce + W, Ce = V.indexOf(z, P);
            else {
              if (Be === -1)
                break;
              if (ne.push(V.substring(P, Be)), on(Be + ee), se && (li(), B))
                return yt();
              if (H && de.length >= H)
                return yt(!0);
            }
          else
            for (j = P, P++; ; ) {
              if ((j = V.indexOf(y, j + 1)) === -1)
                return q || le.push({ type: "Quotes", code: "MissingQuotes", message: "Quoted field unterminated", row: de.length, index: P }), sn();
              if (j === $ - 1)
                return sn(V.substring(P, j).replace(Y, y));
              if (y !== M || V[j + 1] !== M) {
                if (y === M || j === 0 || V[j - 1] !== M) {
                  Ce !== -1 && Ce < j + 1 && (Ce = V.indexOf(z, j + 1)), Be !== -1 && Be < j + 1 && (Be = V.indexOf(I, j + 1));
                  var be = rn(Be === -1 ? Ce : Math.min(Ce, Be));
                  if (V.substr(j + 1 + be, W) === z) {
                    ne.push(V.substring(P, j).replace(Y, y)), V[P = j + 1 + be + W] !== y && (j = V.indexOf(y, P)), Ce = V.indexOf(z, P), Be = V.indexOf(I, P);
                    break;
                  }
                  var Ee = rn(Be);
                  if (V.substring(j + 1 + Ee, j + 1 + Ee + ee) === I) {
                    if (ne.push(V.substring(P, j).replace(Y, y)), on(j + 1 + Ee + ee), Ce = V.indexOf(z, P), j = V.indexOf(y, P), se && (li(), B))
                      return yt();
                    if (H && de.length >= H)
                      return yt(!0);
                    break;
                  }
                  le.push({ type: "Quotes", code: "InvalidQuotes", message: "Trailing quote on quoted field is malformed", row: de.length, index: P }), j++;
                }
              } else
                j++;
            }
        return sn();
        function rt(xt) {
          de.push(xt), he = P;
        }
        function rn(xt) {
          var sa = 0;
          if (xt !== -1) {
            var bs = V.substring(j + 1, xt);
            bs && bs.trim() === "" && (sa = bs.length);
          }
          return sa;
        }
        function sn(xt) {
          return q || (xt === void 0 && (xt = V.substring(P)), ne.push(xt), P = $, rt(ne), se && li()), yt();
        }
        function on(xt) {
          P = xt, rt(ne), ne = [], Be = V.indexOf(I, P);
        }
        function yt(xt) {
          return { data: de, errors: le, meta: { delimiter: z, linebreak: I, aborted: B, truncated: !!xt, cursor: he + (X || 0) } };
        }
        function li() {
          Q(yt()), de = [], le = [];
        }
      }, this.abort = function() {
        B = !0;
      }, this.getCharIndex = function() {
        return P;
      };
    }
    function b(x) {
      var y = x.data, z = o[y.workerId], I = !1;
      if (y.error)
        z.userError(y.error, y.file);
      else if (y.results && y.results.data) {
        var O = { abort: function() {
          I = !0, C(y.workerId, { data: [], errors: [], meta: { aborted: !0 } });
        }, pause: _, resume: _ };
        if (T(z.userStep)) {
          for (var Q = 0; Q < y.results.data.length && (z.userStep({ data: y.results.data[Q], errors: y.results.errors, meta: y.results.meta }, O), !I); Q++)
            ;
          delete y.results;
        } else
          T(z.userChunk) && (z.userChunk(y.results, O, y.file), delete y.results);
      }
      y.finished && !I && C(y.workerId, y.results);
    }
    function C(x, y) {
      var z = o[x];
      T(z.userComplete) && z.userComplete(y), z.terminate(), delete o[x];
    }
    function _() {
      throw new Error("Not implemented.");
    }
    function E(x) {
      if (typeof x != "object" || x === null)
        return x;
      var y = Array.isArray(x) ? [] : {};
      for (var z in x)
        y[z] = E(x[z]);
      return y;
    }
    function F(x, y) {
      return function() {
        x.apply(y, arguments);
      };
    }
    function T(x) {
      return typeof x == "function";
    }
    return s && (r.onmessage = function(x) {
      var y = x.data;
      if (l.WORKER_ID === void 0 && y && (l.WORKER_ID = y.workerId), typeof y.input == "string")
        r.postMessage({ workerId: l.WORKER_ID, results: l.parse(y.input, y.config), finished: !0 });
      else if (r.File && y.input instanceof File || y.input instanceof Object) {
        var z = l.parse(y.input, y.config);
        z && r.postMessage({ workerId: l.WORKER_ID, results: z, finished: !0 });
      }
    }), (f.prototype = Object.create(u.prototype)).constructor = f, (h.prototype = Object.create(u.prototype)).constructor = h, (m.prototype = Object.create(m.prototype)).constructor = m, (w.prototype = Object.create(u.prototype)).constructor = w, l;
  });
})(Ud);
var r4 = Ud.exports;
const i4 = /* @__PURE__ */ oc(r4);
var s4 = /* @__PURE__ */ L('<div class="tw-relative tw-aspect-video"><div class="tw-absolute tw-inset-0 tw-aspect-video tw-w-full tw-overflow-auto tw-rounded-sm tw-border tw-border-border">'), o4 = /* @__PURE__ */ L('<div><div class="tw-my-auto tw-flex tw-aspect-video tw-max-h-48 tw-w-full tw-flex-col tw-items-center tw-justify-center tw-text-foreground/50"><div><div class="tw-flex tw-flex-col tw-items-center tw-gap-1"><div class=tw-text-md>'), a4 = /* @__PURE__ */ L("<div class=tw-line-clamp-1>");
const l4 = async (t) => new Promise((e, n) => i4.parse(t, {
  header: !0,
  skipEmptyLines: !0,
  complete: function(r) {
    r.errors.length !== 0 && n(r.errors[0].message), e(r.data);
  }
})), c4 = (t) => {
  const e = ht(), n = async (i) => {
    const s = await l4(i[i.length - 1]);
    t.onValueChange(s);
  }, r = () => {
    e.openConfirmModal({
      title: A("delete.file"),
      labels: {
        confirm: A("yes")
      },
      children: () => A("delete.file.confirmation"),
      onConfirm: () => (t.onValueChange([]), e.closeAll())
    });
  };
  return d(Me, D(t, {
    get children() {
      return [d(te, {
        get when() {
          return t.answer === void 0 || t.answer.length === 0;
        },
        get children() {
          return d(na, {
            accept: "text/csv",
            setFiles: n,
            get disabled() {
              return t.disabled;
            },
            onOpenFileBrowser: (i) => $e.has("file-open") ? $e.emit("file-open", t.dataKey, {
              accept: i.accept,
              maxFiles: i.maxFiles
            }) : i.defaultAction(),
            children: ({
              isAccepted: i,
              isDragActive: s,
              openFileBrowser: o,
              disabled: a
            }) => (() => {
              var l = o4(), c = l.firstChild, u = c.firstChild, f = u.firstChild, h = f.firstChild;
              return k(f, d(vb, {
                class: "tw-size-12 tw-stroke-1"
              }), h), k(h, () => A("drag.drop.csv")), k(u, d(re, {
                size: "sm",
                disabled: a,
                onClick: o,
                get children() {
                  return A("browse");
                }
              }), null), oe((m) => {
                var w = G("tw-w-full tw-rounded-lg tw-border tw-border-border tw-bg-muted tw-p-2 tw-transition-all tw-duration-200", i() === !1 && "border-destructive ring-1 ring-destructive", s() && "border-primary ring-1 ring-primary"), g = G("tw-flex tw-flex-col tw-items-center tw-gap-3", s() && "tw-text-primary", i() === !1 && "tw-text-destructive");
                return w !== m.e && De(l, m.e = w), g !== m.t && De(u, m.t = g), m;
              }, {
                e: void 0,
                t: void 0
              }), l;
            })()
          });
        }
      }), d(te, {
        get when() {
          return t.answer && t.answer.length !== 0;
        },
        get children() {
          var i = s4(), s = i.firstChild;
          return k(s, d(td, {
            class: "tw-table tw-gap-2",
            get children() {
              return [d(nd, {
                get children() {
                  return d(Vr, {
                    get children() {
                      return d(xe, {
                        get each() {
                          return Object.keys(t.answer[0]);
                        },
                        children: (o) => d(Si, {
                          class: "tw-text-nowrap",
                          children: o
                        })
                      });
                    }
                  });
                }
              }), d(rd, {
                get children() {
                  return d(xe, {
                    get each() {
                      return t.answer;
                    },
                    children: (o) => d(Vr, {
                      class: "even:tw-bg-muted/75",
                      get children() {
                        return d(xe, {
                          get each() {
                            return Object.keys(o);
                          },
                          children: (a) => d($r, {
                            get children() {
                              var l = a4();
                              return k(l, () => o[a]), l;
                            }
                          })
                        });
                      }
                    })
                  });
                }
              })];
            }
          })), k(i, d(te, {
            get when() {
              return !t.disabled;
            },
            get children() {
              return d(re, {
                size: "icon",
                onClick: r,
                variant: "destructive",
                class: "tw-absolute tw--right-1 tw--top-1 tw-rounded-full",
                get children() {
                  return d(yn, {});
                }
              });
            }
          }), null), i;
        }
      })];
    }
  }));
}, u4 = (t = "IDR", e = "en-US") => {
  const i = new Intl.NumberFormat(e, {
    style: "currency",
    currency: t
  }).formatToParts(0).find((s) => s.type === "currency");
  return i == null ? void 0 : i.value;
}, d4 = (t) => {
  const e = () => tn() || "en";
  return d(Me, D(t, {
    get children() {
      return d(gs, {
        get locale() {
          return e();
        },
        get value() {
          return t.answer;
        },
        get onBlur() {
          return t.onBlur;
        },
        get readOnly() {
          return t.disabled;
        },
        get min() {
          var n;
          return (n = t.rangeInput) == null ? void 0 : n.min;
        },
        get max() {
          var n;
          return (n = t.rangeInput) == null ? void 0 : n.max;
        },
        get step() {
          var n;
          return ((n = t.rangeInput) == null ? void 0 : n.step) || 1;
        },
        get suffix() {
          return t.suffix;
        },
        get prefix() {
          return u4(t.currency, e());
        },
        onChange: (n) => t.onValueChange(n),
        get class() {
          return G(Qe(t.validationState));
        }
      });
    }
  }));
};
var kr = /* @__PURE__ */ L("<div class=tw-flex>");
const Cr = () => ({
  now: A("now"),
  today: A("today"),
  thisWeek: A("this.week"),
  thisMonth: A("this.month"),
  thisYear: A("this.year"),
  reset: A("reset")
}), f4 = (t) => d(Me, D(t, {
  get children() {
    var e = kr();
    return k(e, d(Y3, {
      get label() {
        return Cr();
      },
      get value() {
        return t.answer;
      },
      get locale() {
        return tn();
      },
      get readOnly() {
        return t.disabled;
      },
      setValue: (n) => t.onValueChange(n),
      get class() {
        return G("tw-w-full", Qe(t.validationState));
      }
    })), e;
  }
})), h4 = (t) => d(Me, D(t, {
  get children() {
    var e = kr();
    return k(e, d(Q3, {
      get label() {
        return Cr();
      },
      get value() {
        return t.answer;
      },
      get locale() {
        return tn();
      },
      get disabled() {
        return t.disabled;
      },
      get readOnly() {
        return t.disabled;
      },
      setValue: (n) => t.onValueChange(n),
      get class() {
        return G("tw-w-full", Qe(t.validationState));
      }
    })), e;
  }
})), g4 = (t) => d(Me, D(t, {
  get children() {
    var e = kr();
    return k(e, d(X3, {
      get label() {
        return Cr();
      },
      get value() {
        return t.answer;
      },
      get locale() {
        return tn();
      },
      get readOnly() {
        return t.disabled;
      },
      setValue: (n) => t.onValueChange(n),
      get class() {
        return G("tw-w-full", Qe(t.validationState));
      }
    })), e;
  }
})), m4 = (t) => d(Me, D(t, {
  get children() {
    var e = kr();
    return k(e, d(J3, {
      get label() {
        return Cr();
      },
      get value() {
        return t.answer;
      },
      get locale() {
        return tn();
      },
      get readOnly() {
        return t.disabled;
      },
      setValue: (n) => t.onValueChange(n),
      get class() {
        return G("tw-w-full", Qe(t.validationState));
      }
    })), e;
  }
})), w4 = (t) => d(Me, D(t, {
  get children() {
    var e = kr();
    return k(e, d(Z3, {
      get label() {
        return Cr();
      },
      get value() {
        return t.answer;
      },
      get readOnly() {
        return t.disabled;
      },
      setValue: (n) => t.onValueChange(n),
      get class() {
        return G("tw-w-full", Qe(t.validationState));
      }
    })), e;
  }
})), p4 = (t) => d(Me, D(t, {
  get children() {
    var e = kr();
    return k(e, d(e5, {
      get label() {
        return Cr();
      },
      get value() {
        return t.answer;
      },
      get locale() {
        return tn();
      },
      get readOnly() {
        return t.disabled;
      },
      setValue: (n) => t.onValueChange(n),
      get class() {
        return G("tw-w-full", Qe(t.validationState));
      }
    })), e;
  }
})), v4 = (t) => d(Me, D(t, {
  get children() {
    return d(gs, {
      get value() {
        return t.answer;
      },
      get onBlur() {
        return t.onBlur;
      },
      get prefix() {
        return t.prefix;
      },
      get suffix() {
        return t.suffix;
      },
      get onChange() {
        return t.onValueChange;
      },
      get readOnly() {
        return t.disabled;
      },
      get max() {
        var e;
        return (e = t.rangeInput) == null ? void 0 : e.max;
      },
      get min() {
        var e;
        return (e = t.rangeInput) == null ? void 0 : e.min;
      },
      get step() {
        var e;
        return ((e = t.rangeInput) == null ? void 0 : e.step) || 1;
      },
      get locale() {
        return tn() || "en";
      },
      fixedDecimalScale: !0,
      get decimalScale() {
        return t.decimalLength || 2;
      },
      get class() {
        return G(Qe(t.validationState));
      }
    });
  }
}));
var b4 = /* @__PURE__ */ L('<div class="tw-border-b tw-border-border tw-py-1">'), y4 = /* @__PURE__ */ L('<div class="tw-my-auto tw-flex tw-aspect-video tw-max-h-48 tw-w-full tw-flex-col tw-items-center tw-justify-center tw-text-foreground/50"><div><div class="tw-flex tw-flex-col tw-items-center tw-gap-1"><div class=tw-text-md>'), x4 = /* @__PURE__ */ L('<div><div class="tw-flex tw-w-full tw-@container/file-input"><div class="tw-flex tw-w-full tw-flex-col tw-gap-2 @xl/file-input:tw-grid @xl/file-input:tw-grid-cols-2">'), Pl = /* @__PURE__ */ L("<span>"), k4 = /* @__PURE__ */ L('<div class="tw-flex tw-flex-row tw-items-center tw-gap-1"><span class=tw-text-xs>'), C4 = /* @__PURE__ */ L('<div class="tw-flex tw-h-min tw-flex-row tw-gap-2 tw-rounded-sm tw-border tw-bg-background tw-p-2"><div class="tw-flex tw-aspect-square tw-w-12 tw-select-none tw-items-center tw-justify-center tw-rounded-sm tw-border tw-border-border"></div><div class="tw-flex tw-flex-1 tw-flex-col tw-gap-2"><div><span class="tw-line-clamp-1 tw-font-semibold"></span></div><div class="tw-flex tw-w-full tw-flex-row tw-justify-between tw-gap-2">');
const _4 = (t) => {
  const e = ht(), [n, r] = N([]);
  Z(() => t.answer ? r(t.answer) : r([]));
  const i = () => {
    var l;
    return t.answer === void 0 || ((l = t.answer) == null ? void 0 : l.length) === 0 ? !0 : t.disabled && t.answer.length > 0 ? !1 : t.maxFiles && t.maxFiles > 1 && t.answer.length < t.maxFiles;
  }, s = (l) => t.onValueChange(l.map((c) => c instanceof File ? Ao(c, t.dataKey) : c)), o = (l) => {
    e.openConfirmModal({
      title: A("upload.file"),
      labels: {
        confirm: A("yes")
      },
      children: () => A("upload.file.confirmation"),
      onConfirm: () => (t.answer && $e.emit("upload-begin", t.dataKey, t.answer[l]), e.closeAll())
    });
  }, a = (l) => {
    e.openConfirmModal({
      title: A("delete.file"),
      labels: {
        confirm: A("yes")
      },
      children: () => A("delete.file.confirmation"),
      onConfirm: () => {
        var c;
        return t.onValueChange((c = t.answer) == null ? void 0 : c.filter((u, f) => f !== l)), e.closeAll();
      }
    });
  };
  return d(Me, D(t, {
    get children() {
      return d(na, {
        get accept() {
          return t.accept;
        },
        setFiles: s,
        get files() {
          return n();
        },
        get disabled() {
          return t.disabled;
        },
        get maxFiles() {
          return t.maxFiles;
        },
        onOpenFileBrowser: (l) => $e.has("file-open") ? $e.emit("file-open", t.dataKey, {
          accept: l.accept,
          maxFiles: l.maxFiles
        }) : l.defaultAction(),
        children: ({
          isAccepted: l,
          isDragActive: c,
          openFileBrowser: u,
          disabled: f
        }) => (() => {
          var h = x4(), m = h.firstChild, w = m.firstChild;
          return k(w, d(xe, {
            get each() {
              return t.answer;
            },
            children: (g, p) => (() => {
              var v = C4(), b = v.firstChild, C = b.nextSibling, _ = C.firstChild, E = _.firstChild, F = _.nextSibling;
              return k(b, d(Cb, {
                class: "tw-size-10 tw-stroke-1"
              })), k(E, () => g.filename), k(F, d(te, {
                when: !f,
                get children() {
                  return d(re, {
                    size: "sm",
                    variant: "outline",
                    onClick: () => a(p()),
                    class: "tw-border-destructive tw-text-destructive hover:tw-bg-destructive",
                    get children() {
                      var T = Pl();
                      return k(T, () => A("delete")), T;
                    }
                  });
                }
              }), null), k(F, d(te, {
                get when() {
                  return !g.url;
                },
                get children() {
                  return d(re, {
                    size: "sm",
                    variant: "default",
                    onClick: () => o(p()),
                    get children() {
                      var T = Pl();
                      return k(T, () => A("upload")), T;
                    }
                  });
                }
              }), null), k(F, d(te, {
                get when() {
                  return g.url;
                },
                get children() {
                  var T = k4(), x = T.firstChild;
                  return k(T, d(ld, {
                    class: "tw-stroke-primary"
                  }), x), k(x, () => A("uploaded")), T;
                }
              }), null), v;
            })()
          })), k(h, d(te, {
            get when() {
              return i();
            },
            get children() {
              return [d(te, {
                get when() {
                  return t.answer && t.answer.length >= 1;
                },
                get children() {
                  return b4();
                }
              }), (() => {
                var g = y4(), p = g.firstChild, v = p.firstChild, b = v.firstChild;
                return k(v, d(kb, {
                  class: "tw-size-12 tw-stroke-1"
                }), b), k(b, () => A("drag.drop.file")), k(p, d(re, {
                  size: "sm",
                  disabled: f,
                  onClick: u,
                  get children() {
                    return A("browse");
                  }
                }), null), oe(() => De(p, G("tw-flex tw-flex-col tw-items-center tw-gap-3", c() && "tw-text-primary", l() === !1 && "tw-text-destructive"))), g;
              })()];
            }
          }), null), oe(() => De(h, G("tw-w-full tw-rounded-lg tw-border tw-border-border tw-bg-muted tw-p-2 tw-transition-all tw-duration-200", Qe(t.validationState), c() && "border-primary ring-1 ring-primary", l() === !1 && "border-destructive ring-1 ring-destructive"))), h;
        })()
      });
    }
  }));
};
var S4 = /* @__PURE__ */ L("<div><div class=tw-h-2>"), M4 = /* @__PURE__ */ L('<span class="tw-text-xs tw-font-normal">'), O4 = /* @__PURE__ */ L('<div class="tw-flex tw-flex-col tw-gap-3"><div>'), E4 = /* @__PURE__ */ L("<div><iframe width=100% title=map>");
const I4 = (t) => d(Me, D(t, {
  get children() {
    var e = O4(), n = e.firstChild;
    return k(e, d(te, {
      get when() {
        return t.answer;
      },
      get children() {
        var r = S4(), i = r.firstChild;
        return k(r, d(P4, {
          get answer() {
            return t.answer;
          }
        }), i), k(r, d(Ot, {
          get children() {
            return d(jt, {
              type: "text",
              readOnly: !0,
              get value() {
                return Jg(t.answer);
              },
              get class() {
                return G(Qe(t.validationState));
              }
            });
          }
        }), null), r;
      }
    }), n), k(n, d(re, {
      size: "sm",
      class: "tw-rounded-lg",
      get disabled() {
        return t.disabled;
      },
      onClick: () => $e.emit("geolocation-request", t.dataKey),
      get children() {
        return [d(Sb, {
          class: "tw-mr-2"
        }), (() => {
          var r = M4();
          return k(r, () => A("get.location")), r;
        })()];
      }
    })), e;
  }
})), P4 = (t) => {
  const e = () => so(t.answer) + "&output=embed";
  return (() => {
    var n = E4(), r = n.firstChild;
    return oe((i) => {
      var s = G("tw-pointer-events-none tw-h-48 tw-w-full", je.theme.isDark && "tw-hue-rotate-180 tw-invert"), o = e();
      return s !== i.e && De(r, i.e = s), o !== i.t && Xe(r, "src", i.t = o), i;
    }, {
      e: void 0,
      t: void 0
    }), n;
  })();
};
var D4 = /* @__PURE__ */ L("<div class=tw-py-2>");
const $4 = (t) => (() => {
  var e = D4();
  return oe(() => e.innerHTML = A(t.label)), e;
})(), qd = () => {
  const t = ht();
  return {
    confirm: (n, r, i) => {
      t.openConfirmModal({
        title: A("delete.nested"),
        children: () => A("delete.nested.confirmation", {
          name: n.label
        }),
        labels: {
          confirm: A("yes")
        },
        onConfirm: () => {
          r(), t.close();
        },
        onCancel: () => {
          i == null || i(), t.close();
        }
      });
    }
  };
};
var T4 = /* @__PURE__ */ L('<div class="tw-flex tw-flex-col tw-gap-2">'), A4 = /* @__PURE__ */ L('<div class="tw-flex tw-gap-1.5">');
const L4 = (t) => d(si, {
  class: "tw-w-full",
  sameWidth: !0,
  get value() {
    return t.answer;
  },
  get options() {
    return t.options || [];
  },
  optionValue: "value",
  optionLabel: (n) => A(n.label),
  optionTextValue: (n) => A(n.label),
  onChange: (n) => {
    t.onValueChange(n);
  },
  get readOnly() {
    return t.disabled;
  }
}), F4 = (t) => {
  const {
    options: e
  } = ai(t), [n] = K(t, ["answer", "dataKey"]), {
    confirm: r
  } = qd(), i = () => {
    n.answer && n.answer.push({
      value: "",
      label: ""
    });
  }, s = (l) => {
    if (!n.answer)
      return;
    const c = hn(n.answer);
    c.splice(l, 1), t.onValueChange(c);
  }, o = (l, c) => {
    if (!n.answer)
      return;
    const u = hn(n.answer);
    l ? u[c] = l : u.splice(c, 1), t.onValueChange(u);
  }, a = (l, c) => l.filter((u) => {
    var f;
    return !((f = n.answer) != null && f.find((h) => h.value === u.value && h.value !== (c == null ? void 0 : c.value)));
  });
  return d(Me, D(t, {
    get children() {
      var l = T4();
      return k(l, d(xe, {
        get each() {
          return n.answer;
        },
        children: (c, u) => d(te, {
          get when() {
            return !Li(c);
          },
          get children() {
            var f = A4();
            return k(f, d(L4, {
              get options() {
                return a(e(), c);
              },
              get index() {
                return u();
              },
              answer: c,
              onValueChange: (h) => o(h, u()),
              get disabled() {
                return t.disabled;
              }
            }), null), k(f, d(re, {
              get disabled() {
                return t.disabled;
              },
              variant: "ghost",
              onClick: () => r(c, s.bind(null, u())),
              get children() {
                return d(yn, {
                  class: "tw-size-4"
                });
              }
            }), null), f;
          }
        })
      }), null), k(l, d(re, {
        size: "sm",
        onClick: i,
        get disabled() {
          var c, u, f;
          return !((f = (u = n.answer) == null ? void 0 : u[((c = n.answer) == null ? void 0 : c.length) - 1]) != null && f.label) || t.disabled;
        },
        get children() {
          return [d(cd, {
            class: "tw-mr-2 tw-size-4"
          }), J(() => A("add.item"))];
        }
      }), null), l;
    }
  }));
};
var z4 = /* @__PURE__ */ L('<div class="tw-flex tw-flex-col tw-gap-2">'), R4 = /* @__PURE__ */ L('<div class="tw-flex tw-gap-1.5">');
const V4 = (t) => {
  const e = (n) => {
    t.onValueChange({
      ...t.answer,
      label: n.target.value
    });
  };
  return d(Ot, {
    class: "tw-grid tw-w-full tw-gap-1.5",
    get children() {
      return d(jt, {
        get readOnly() {
          return t.disabled;
        },
        type: "text",
        get value() {
          return A(t.answer.label);
        },
        onChange: e
      });
    }
  });
}, N4 = (t) => {
  const [e] = K(t, ["answer", "dataKey"]), {
    confirm: n
  } = qd(), r = () => {
    var c;
    if (!e.answer)
      return;
    const a = Sa(e.answer), l = ((c = t.answer) == null ? void 0 : c.findIndex((u) => Li(u))) ?? -1;
    e.answer[l].label = `lastId#${a + 1}`;
  }, i = () => {
    if (!e.answer)
      return;
    const a = Sa(e.answer);
    e.answer.push({
      value: a + 1,
      label: ""
    }), r();
  }, s = (a) => {
    if (!e.answer)
      return;
    const l = hn(e.answer);
    l.splice(l.findIndex((c) => c.value === a.value), 1), t.onValueChange(l);
  }, o = (a) => {
    if (!e.answer)
      return;
    const l = hn(e.answer), c = l.findIndex((u) => u.value === a.value);
    l[c] = a, t.onValueChange(l);
  };
  return d(Me, D(t, {
    get children() {
      var a = z4();
      return k(a, d(xe, {
        get each() {
          return e.answer;
        },
        children: (l) => d(te, {
          get when() {
            return !Li(l);
          },
          get children() {
            var c = R4();
            return k(c, d(V4, {
              answer: l,
              onValueChange: o,
              get disabled() {
                return t.disabled || t.isEditableList === !1 && l.label !== "";
              }
            }), null), k(c, d(re, {
              variant: "ghost",
              onClick: () => n(l, s.bind(null, l)),
              get disabled() {
                return t.disabled;
              },
              get children() {
                return d(yn, {
                  class: "tw-size-4"
                });
              }
            }), null), c;
          }
        })
      }), null), k(a, d(re, {
        size: "sm",
        variant: "default",
        onClick: i,
        get disabled() {
          var l, c;
          return !((c = e.answer) != null && c[((l = e.answer) == null ? void 0 : l.length) - 1].label) || t.disabled;
        },
        get children() {
          return [d(cd, {
            class: "tw-mr-2 tw-size-4"
          }), J(() => A("add.item"))];
        }
      }), null), a;
    }
  }));
};
var K4 = {
  9: /\d/,
  0: /\d?/,
  a: /[a-z]/i,
  o: /[a-z]?/i,
  "*": /\w/,
  "?": /\w?/
}, B4 = (t, e = K4) => [...t].map((n) => e[n] || n), j4 = (t, e) => (n, r) => [
  n.replace(t, (...i) => {
    const s = e(...i), o = i[i.length - 2];
    return r[0] += o < r[0] ? 0 : (s.length - i[0].length) / i[0].length * Math.max(r[0] - o, i[0].length), r[1] += o < r[1] ? 0 : (s.length - i[0].length) / i[0].length * Math.max(r[1] - o, i[0].length), s;
  }),
  r
], W4 = (t) => (e, n) => {
  let r = 0;
  return t.forEach((i) => {
    if (e.length >= r + 1) {
      if (typeof i == "string") {
        e.slice(r).indexOf(i) !== 0 && (e = e.slice(0, r) + i + e.slice(r), n[0] += (n[0] > r) * i.length, n[1] += (n[1] > r) * i.length), r += i.length;
        return;
      }
      const s = e.slice(r).match(i);
      if (!s || s.index === void 0) {
        e = e.slice(0, r);
        return;
      } else
        s.index > 0 && (e = e.slice(0, r) + e.slice(r + s.index), r -= s.index - 1, n[0] -= (n[0] > r) * s.index, n[1] -= (n[1] > r) * s.index);
      r += s[0].length;
    }
  }), [e.slice(0, r), n];
}, Gd = (t, e) => typeof t == "function" ? t : typeof t[1] == "function" && t[0] instanceof RegExp ? j4(t[0], t[1]) : W4(
  Array.isArray(t) ? t : B4(t, e)
), H4 = (t, e) => {
  const n = Gd(t, e);
  return (i) => {
    const s = i.currentTarget || i.target, [o, a] = n(s.value, [
      s.selectionStart || s.value.length,
      s.selectionEnd || s.value.length
    ]);
    return s.value = o, s.setSelectionRange(...a), o;
  };
}, U4 = (t, e) => (r) => {
  const i = t(r), o = (r.currentTarget || r.target).previousElementSibling, a = i === "" ? "removeAttribute" : "setAttribute";
  return o[a]("data-mask-value", i), o[a]("data-mask-pattern", e(i).slice(i.length)), i;
};
const q4 = (t) => {
  const e = U4(H4(t.maskingFormat), () => El(t.maskingFormat));
  return d(Me, D(t, {
    get children() {
      return d(Ot, {
        class: "tw-grid tw-w-full tw-gap-1.5",
        get children() {
          return d(jt, {
            type: "text",
            onInput: e,
            get onBlur() {
              return t.onBlur;
            },
            get readOnly() {
              return t.disabled;
            },
            get class() {
              return G(Qe(t.validationState));
            },
            get placeholder() {
              return El(t.maskingFormat);
            },
            onChange: (n) => t.onValueChange(t5(n.target.value)),
            get value() {
              return Gd(t.maskingFormat)(t.answer ?? "", [0, 0])[0];
            }
          });
        }
      });
    }
  }));
};
var G4 = /* @__PURE__ */ L("<div>"), Y4 = /* @__PURE__ */ L('<div class="tw-text-sm tw-text-muted-foreground">');
const X4 = (t) => {
  const [e] = K(t, ["answer"]), {
    options: n
  } = ai(t), r = (i) => {
    const s = Zg(i, e.answer);
    t.onValueChange(s);
  };
  return d(Me, D(t, {
    get children() {
      return d(vs, D(t, {
        get children() {
          return d(si, {
            virtualized: !0,
            sameWidth: !0,
            fitViewport: !0,
            clearable: !0,
            multiple: !0,
            get readOnly() {
              return t.disabled;
            },
            get placeholder() {
              return A("select.options");
            },
            get value() {
              return e.answer;
            },
            itemKeys: [(i) => A(i.label), (i) => A(i.description)],
            onChange: r,
            get options() {
              return n() ?? [];
            },
            optionValue: (i) => i.value,
            optionLabel: (i) => A(i.label),
            optionTextValue: (i) => A(i.label),
            noOptions: () => A("no.options.found"),
            itemRenderer: (i, s) => d(ra, {
              get children() {
                return [(() => {
                  var o = G4();
                  return oe(() => o.innerHTML = A((s == null ? void 0 : s[0]) ?? (i == null ? void 0 : i.label))), o;
                })(), (() => {
                  var o = Y4();
                  return oe(() => o.innerHTML = A((s == null ? void 0 : s[1]) ?? (i == null ? void 0 : i.description))), o;
                })()];
              }
            })
          });
        }
      }));
    }
  }));
};
var Q4 = /* @__PURE__ */ L('<div class="tw-flex tw-flex-col tw-space-y-2">'), J4 = /* @__PURE__ */ L('<div class="tw-flex tw-items-center tw-justify-between tw-space-x-2 tw-rounded-md tw-border tw-px-2 tw-py-1"><span>');
const Z4 = (t) => {
  const e = (n) => Mt({
    activeDataKey: n
  });
  return (() => {
    var n = Q4();
    return k(n, d(xe, {
      get each() {
        return Lo(t);
      },
      children: (r) => d(te, {
        get when() {
          return r.enable;
        },
        get children() {
          var i = J4(), s = i.firstChild;
          return k(s, () => A(r.answer.label)), k(i, d(re, {
            size: "sm",
            class: "tw-rounded-lg",
            onClick: () => e(r.dataKey),
            get children() {
              return [d(pb, {
                class: "tw-mr-2"
              }), J(() => A("view"))];
            }
          }), null), i;
        }
      })
    })), n;
  })();
};
var ex = /* @__PURE__ */ L("<div>"), tx = /* @__PURE__ */ L('<span class="tw-text-xs tw-font-normal">'), nx = /* @__PURE__ */ L('<div class="tw-flex tw-flex-col tw-gap-3"><div>');
const rx = (t) => {
  const e = ht(), n = () => e.openConfirmModal({
    title: A("get.time"),
    children: () => A("get.time.confirmation"),
    labels: {
      confirm: A("yes")
    },
    onConfirm: () => {
      const i = We(/* @__PURE__ */ new Date(), "yyyy-MM-dd'T'HH:mm:ss");
      t.onValueChange(i), e.closeAll();
    }
  }), r = () => {
    if (t.answer)
      return We(t.answer, "yyyy-MM-dd'T'HH:mm:ss");
  };
  return d(Me, D(t, {
    get children() {
      var i = nx(), s = i.firstChild;
      return k(i, d(te, {
        get when() {
          return t.answer;
        },
        get children() {
          var o = ex();
          return k(o, d(Ot, {
            get children() {
              return d(jt, {
                type: "text",
                readOnly: !0,
                get value() {
                  return r();
                },
                get class() {
                  return G(Qe(t.validationState));
                }
              });
            }
          })), o;
        }
      }), s), k(s, d(re, {
        size: "sm",
        class: "tw-rounded-lg",
        onClick: n,
        get disabled() {
          return t.disabled;
        },
        get children() {
          return [d(gb, {
            class: "tw-mr-2"
          }), (() => {
            var o = tx();
            return k(o, () => A("get.time")), o;
          })()];
        }
      })), i;
    }
  }));
}, ix = (t) => d(Me, D(t, {
  get children() {
    return d(gs, {
      decimalScale: 0,
      get onBlur() {
        return t.onBlur;
      },
      get suffix() {
        return t.suffix;
      },
      get prefix() {
        return t.prefix;
      },
      get readOnly() {
        return t.disabled;
      },
      get min() {
        var e;
        return (e = t.rangeInput) == null ? void 0 : e.min;
      },
      get max() {
        var e;
        return (e = t.rangeInput) == null ? void 0 : e.max;
      },
      get step() {
        var e;
        return ((e = t.rangeInput) == null ? void 0 : e.step) || 1;
      },
      get onChange() {
        return t.onValueChange;
      },
      get value() {
        return t.answer;
      },
      get locale() {
        return tn() || "en";
      },
      get class() {
        return G(Qe(t.validationState));
      }
    });
  }
}));
var Ki = /* @__PURE__ */ L("<span>"), sx = /* @__PURE__ */ L('<div class="tw-flex tw-flex-col tw-gap-2"><div class="tw-relative tw-flex tw-flex-col tw-rounded-sm tw-border tw-border-border tw-bg-background tw-bg-clip-border"><div class="tw-absolute tw-inset-0 tw-m-0 tw-size-full tw-rounded-sm tw-bg-foreground/50"></div><img class="tw-aspect-video tw-w-full tw-select-none tw-overflow-hidden tw-rounded-sm tw-object-cover tw-object-center"><div class="tw-absolute tw-bottom-0 tw-flex tw-w-full tw-flex-row tw-gap-2 tw-p-2 tw-text-background"><div class=tw-flex-1><span class="tw-line-clamp-1 tw-font-semibold"></span><span class="tw-line-clamp-1 tw-text-xs tw-italic">'), ox = /* @__PURE__ */ L('<div class="tw-flex tw-w-full tw-@container/file-input"><div class="tw-flex tw-w-full tw-flex-col tw-gap-2 @xl/file-input:tw-grid @xl/file-input:tw-grid-cols-2">'), ax = /* @__PURE__ */ L('<img class="tw-aspect-square tw-h-full tw-w-16 tw-select-none tw-rounded-sm tw-border tw-border-border tw-object-cover tw-transition-all tw-duration-200 hover:tw-opacity-50">'), lx = /* @__PURE__ */ L('<div class="tw-flex tw-flex-row tw-items-center tw-gap-1"><span class=tw-text-xs>'), cx = /* @__PURE__ */ L('<div class="tw-flex tw-h-min tw-flex-row tw-gap-2 tw-rounded-sm tw-border tw-bg-background tw-p-2"><div class="tw-flex tw-flex-1 tw-flex-col tw-gap-2"><div><span class="tw-line-clamp-1 tw-font-semibold"></span><span class="tw-line-clamp-1 tw-text-xs tw-italic"></span></div><div class="tw-flex tw-w-full tw-justify-between tw-gap-2"><div class="tw-flex tw-items-center tw-gap-2">'), ux = /* @__PURE__ */ L('<div class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-overflow-hidden"><div class="tw-w-full tw-content-center tw-overflow-auto tw-rounded-md tw-border tw-border-border tw-bg-muted tw-object-center"><img class=tw-w-full>'), dx = /* @__PURE__ */ L('<div class="tw-border-b tw-border-border tw-py-1">'), fx = /* @__PURE__ */ L('<div class="tw-my-auto tw-flex tw-aspect-video tw-max-h-48 tw-w-full tw-flex-col tw-items-center tw-justify-center tw-text-foreground/50"><div><div class="tw-flex tw-flex-col tw-items-center tw-gap-1"><div class=tw-text-md>'), hx = /* @__PURE__ */ L("<div>");
const gx = (t) => (() => {
  var e = sx(), n = e.firstChild, r = n.firstChild, i = r.nextSibling, s = i.nextSibling, o = s.firstChild, a = o.firstChild, l = a.nextSibling;
  return k(n, d(te, {
    get when() {
      return !t.disabled;
    },
    get children() {
      return d(re, {
        size: "icon",
        variant: "destructive",
        get title() {
          return A("delete");
        },
        get "aria-label"() {
          return A("delete");
        },
        onClick: () => t.onRemove(0),
        class: "tw-absolute -tw-right-2 tw--top-2 tw-rounded-full",
        get children() {
          return d(yn, {});
        }
      });
    }
  }), s), k(a, () => t.file.filename), k(l, () => t.file.url ? "loaded from server" : "loaded from local file"), k(s, d(re, {
    size: "sm",
    variant: "ghost",
    class: "tw-font-semibold",
    get title() {
      return A("view");
    },
    get "aria-label"() {
      return A("view");
    },
    onClick: () => t.onView(t.file),
    get children() {
      var c = Ki();
      return k(c, () => A("view")), c;
    }
  }), null), k(e, d(te, {
    get when() {
      return !t.file.url;
    },
    get children() {
      return d(re, {
        size: "sm",
        class: "tw-w-full",
        variant: "default",
        onClick: () => t.onUpload(0),
        get title() {
          return A("upload.photo");
        },
        get "aria-label"() {
          return A("upload.photo");
        },
        get children() {
          var c = Ki();
          return k(c, () => A("upload")), c;
        }
      });
    }
  }), null), oe((c) => {
    var u = t.file.filename, f = t.file.url || t.file.uri;
    return u !== c.e && Xe(i, "alt", c.e = u), f !== c.t && Xe(i, "src", c.t = f), c;
  }, {
    e: void 0,
    t: void 0
  }), e;
})(), mx = (t) => (() => {
  var e = ox(), n = e.firstChild;
  return k(n, d(xe, {
    get each() {
      return t.files;
    },
    children: (r, i) => (() => {
      var s = cx(), o = s.firstChild, a = o.firstChild, l = a.firstChild, c = l.nextSibling, u = a.nextSibling, f = u.firstChild;
      return k(s, d(re, {
        size: "sm",
        variant: "ghost",
        onClick: () => t.onView(r),
        class: "tw-flex tw-h-full tw-w-16 tw-p-0 tw-transition-all tw-duration-200 hover:tw-p-0.5",
        get children() {
          var h = ax();
          return oe((m) => {
            var w = r.filename, g = r.url || r.uri;
            return w !== m.e && Xe(h, "alt", m.e = w), g !== m.t && Xe(h, "src", m.t = g), m;
          }, {
            e: void 0,
            t: void 0
          }), h;
        }
      }), o), k(l, () => r.filename), k(c, () => r.url ? "loaded from server" : "loaded from local"), k(f, d(te, {
        get when() {
          return !t.disabled;
        },
        get children() {
          return d(re, {
            size: "sm",
            variant: "outline",
            onClick: () => t.onRemove(i()),
            class: "tw-border-destructive tw-text-destructive hover:tw-bg-destructive",
            get children() {
              var h = Ki();
              return k(h, () => A("delete")), h;
            }
          });
        }
      })), k(u, d(te, {
        get when() {
          return !r.url;
        },
        get children() {
          return d(re, {
            size: "sm",
            variant: "default",
            onClick: () => t.onUpload(i()),
            get children() {
              var h = Ki();
              return k(h, () => A("upload")), h;
            }
          });
        }
      }), null), k(u, d(te, {
        get when() {
          return r.url;
        },
        get children() {
          var h = lx(), m = h.firstChild;
          return k(h, d(ld, {
            class: "tw-stroke-primary"
          }), m), k(m, () => A("uploaded")), h;
        }
      }), null), s;
    })()
  })), e;
})(), wx = (t) => {
  const e = ht(), [n, r] = N([]);
  Z(() => t.answer ? r(t.answer) : r([]));
  const i = () => {
    var c;
    return t.answer === void 0 || ((c = t.answer) == null ? void 0 : c.length) === 0 ? !0 : t.disabled && t.answer.length > 0 ? !1 : t.maxFiles && t.maxFiles > 1 && t.answer.length < t.maxFiles;
  }, s = (c) => t.onValueChange(c.map((u) => u instanceof File ? Ao(u, t.dataKey) : u)), o = (c) => {
    e.openConfirmModal({
      title: A("upload.photo"),
      labels: {
        confirm: A("yes")
      },
      children: () => A("upload.photo.confirmation"),
      onConfirm: () => (t.answer && $e.emit("upload-begin", t.dataKey, t.answer[c]), e.closeAll())
    });
  }, a = (c) => {
    e.openConfirmModal({
      title: A("delete.photo"),
      labels: {
        confirm: A("yes")
      },
      children: () => A("delete.photo.confirmation"),
      onConfirm: () => {
        var u;
        return t.onValueChange((u = t.answer) == null ? void 0 : u.filter((f, h) => h !== c)), e.closeAll();
      }
    });
  }, l = (c) => e.open({
    title: A("preview.photo"),
    children: () => (() => {
      var u = ux(), f = u.firstChild, h = f.firstChild;
      return oe((m) => {
        var w = c.filename, g = c.url || c.uri;
        return w !== m.e && Xe(h, "alt", m.e = w), g !== m.t && Xe(h, "src", m.t = g), m;
      }, {
        e: void 0,
        t: void 0
      }), u;
    })()
  });
  return d(Me, D(t, {
    get children() {
      return d(na, {
        accept: "image/*",
        setFiles: s,
        get disabled() {
          return t.disabled;
        },
        get files() {
          return n();
        },
        get maxFiles() {
          return t.maxFiles;
        },
        onOpenFileBrowser: (c) => $e.has("file-open") ? $e.emit("file-open", t.dataKey, {
          accept: c.accept,
          maxFiles: c.maxFiles
        }) : c.defaultAction(),
        children: ({
          isAccepted: c,
          isDragActive: u,
          openFileBrowser: f,
          disabled: h
        }) => (() => {
          var m = hx();
          return k(m, d(te, {
            get when() {
              var w;
              return ((w = t.answer) == null ? void 0 : w.length) === 1;
            },
            get children() {
              return d(gx, {
                onView: l,
                disabled: h,
                onRemove: a,
                onUpload: o,
                get file() {
                  return t.answer[0];
                }
              });
            }
          }), null), k(m, d(te, {
            get when() {
              var w;
              return (((w = t.answer) == null ? void 0 : w.length) || 0) > 1;
            },
            get children() {
              return d(mx, {
                onView: l,
                disabled: h,
                get files() {
                  return t.answer;
                },
                onRemove: a,
                onUpload: o
              });
            }
          }), null), k(m, d(te, {
            get when() {
              return i();
            },
            get children() {
              return [d(te, {
                get when() {
                  return t.answer && t.answer.length >= 1;
                },
                get children() {
                  return dx();
                }
              }), (() => {
                var w = fx(), g = w.firstChild, p = g.firstChild, v = p.firstChild;
                return k(p, d(yb, {
                  class: "tw-size-12 tw-stroke-1"
                }), v), k(v, () => A("drag.drop.photo")), k(g, d(re, {
                  size: "sm",
                  disabled: h,
                  onClick: f,
                  get children() {
                    return A("browse");
                  }
                }), null), oe(() => De(g, G("tw-flex tw-flex-col tw-items-center tw-gap-3", u() && "tw-text-primary", c() === !1 && "tw-text-destructive"))), w;
              })()];
            }
          }), null), oe(() => De(m, G("tw-w-full tw-rounded-lg tw-border tw-border-border tw-bg-muted tw-p-2 tw-transition-all tw-duration-200", u() && "border-primary ring-1 ring-primary", c() === !1 && "border-destructive ring-1 ring-destructive", Qe(t.validationState)))), m;
        })()
      });
    }
  }));
};
var px = /* @__PURE__ */ L('<div class="tw-flex tw-flex-col tw-gap-3">');
const vx = (t) => {
  const {
    options: e
  } = ai(t), n = (r) => t.onValueChange([Ur(e()).find((i) => i.value === r)]);
  return d(Me, D(t, {
    get children() {
      return d(vs, D(t, {
        get children() {
          return d(md, {
            get disabled() {
              return t.disabled;
            },
            onChange: n,
            get value() {
              var r;
              return (r = t.answer) == null ? void 0 : r[0].value.toString();
            },
            get class() {
              return G(Wd(t.cols ?? 1), "tw-gap-2 @md/form:tw-gap-3");
            },
            get children() {
              return d(xe, {
                get each() {
                  return Hd(e(), t.cols ?? 1);
                },
                children: (r) => (() => {
                  var i = px();
                  return k(i, d(xe, {
                    each: r,
                    children: (s) => d(wd, {
                      get value() {
                        return s.value.toString();
                      },
                      get class() {
                        return G("tw-flex tw-items-start tw-space-x-2", t.disabled && "tw-text-muted-foreground");
                      },
                      get children() {
                        return [d(pd, {}), d(dy, {}), d(gd, {
                          get class() {
                            return G("tw--mt-[2px] tw-cursor-pointer tw-truncate tw-text-pretty", t.disabled && "tw-cursor-default tw-text-muted-foreground");
                          },
                          get innerHTML() {
                            return A(s.label);
                          }
                        })];
                      }
                    })
                  })), i;
                })()
              });
            }
          });
        }
      }));
    }
  }));
};
var bx = /* @__PURE__ */ L('<span class="tw-absolute tw-mt-4">');
const yx = (t) => {
  const e = () => {
    var r;
    return !t.answer || t.answer < (((r = t.rangeInput) == null ? void 0 : r.min) ?? 0) ? t.rangeInput.min : t.answer > (t.rangeInput.max ?? 0) ? t.rangeInput.max : t.answer;
  }, n = (r) => {
    t.onValueChange(r[1]);
  };
  return d(Me, D(t, {
    get children() {
      return d(hy, {
        get readOnly() {
          return t.disabled;
        },
        get minValue() {
          return t.rangeInput.min;
        },
        get maxValue() {
          return t.rangeInput.max;
        },
        get step() {
          return t.rangeInput.step ?? 1;
        },
        get defaultValue() {
          return [t.rangeInput.min ?? 0, e() ?? 0];
        },
        onChangeEnd: n,
        getValueLabel: (r) => r.values[1].toString(),
        class: "tw-pr-2",
        get children() {
          return d(gy, {
            class: "tw-mt-2",
            get children() {
              return [d(my, {
                class: "tw-rounded"
              }), d(Cl, {
                class: "tw-invisible tw-hidden"
              }), d(Cl, {
                class: "tw-bg-background",
                get children() {
                  var r = bx();
                  return k(r, e), r;
                }
              })];
            }
          });
        }
      });
    }
  }));
};
var xx = /* @__PURE__ */ L('<div class="tw-flex tw-justify-start">');
const kx = (t) => {
  const [e, n] = N(0), r = () => t.options.findIndex((s) => {
    var o;
    return s.value === ((o = t.answer) == null ? void 0 : o[0].value);
  }) || 0, i = (s) => t.onValueChange([t.options.find((o) => o.value === s)]);
  return d(Me, D(t, {
    get children() {
      var s = xx();
      return k(s, d(md, {
        onChange: i,
        get disabled() {
          return t.disabled;
        },
        get class() {
          return G("tw-grid tw-grid-cols-5 tw-gap-4", t.disabled && "cursor-default opacity-75");
        },
        onMouseLeave: () => n(-1),
        get value() {
          var o;
          return (o = t.answer) == null ? void 0 : o[0].value.toString();
        },
        get children() {
          return d(xe, {
            get each() {
              return t.options;
            },
            children: (o, a) => d(wd, {
              get value() {
                return o.value.toString();
              },
              onMouseEnter: () => !t.disabled && n(a()),
              class: "tw-flex tw-flex-1 tw-flex-col tw-items-center tw-gap-2 tw-text-center",
              get children() {
                return [d(pd, {
                  class: "tw-group tw-size-10 tw-border-none tw-shadow-none data-[checked]:tw-bg-transparent",
                  get children() {
                    return d(Ab, {
                      get class() {
                        return G("tw-size-10 tw-stroke-1", !t.disabled && "hover:tw-fill-primary-300 hover:tw-stroke-primary/50", e() === -1 && a() <= r() && "tw-fill-primary", a() < e() && "tw-fill-primary");
                      }
                    });
                  }
                }), d(gd, {
                  class: "tw-text-xs",
                  get innerHTML() {
                    return A(o.label);
                  }
                })];
              }
            })
          });
        }
      })), s;
    }
  }));
};
var Cx = /* @__PURE__ */ L("<div>"), _x = /* @__PURE__ */ L('<div class="tw-text-sm tw-text-muted-foreground">');
const Sx = (t) => {
  const [e] = K(t, ["answer"]), {
    options: n
  } = ai(t);
  return d(Me, D(t, {
    get children() {
      return d(vs, D(t, {
        get options() {
          return n();
        },
        get children() {
          return d(si, {
            virtualized: !0,
            sameWidth: !0,
            fitViewport: !0,
            clearable: !0,
            get readOnly() {
              return t.disabled;
            },
            get placeholder() {
              return A("select.option");
            },
            get value() {
              var r;
              return (r = e.answer) == null ? void 0 : r[0];
            },
            get options() {
              return n() ?? [];
            },
            itemKeys: [(r) => A(r.label), (r) => A(r.description)],
            optionValue: (r) => r.value,
            optionLabel: (r) => A(r.label),
            optionTextValue: (r) => A(r.label),
            onChange: (r) => r !== void 0 ? t.onValueChange([r]) : t.onValueChange(void 0),
            noOptions: () => A("no.options.found"),
            itemRenderer: (r, i) => d(ra, {
              get children() {
                return [(() => {
                  var s = Cx();
                  return oe(() => s.innerHTML = A((i == null ? void 0 : i[0]) ?? (r == null ? void 0 : r.label))), s;
                })(), (() => {
                  var s = _x();
                  return oe(() => s.innerHTML = A((i == null ? void 0 : i[1]) ?? (r == null ? void 0 : r.description))), s;
                })()];
              }
            })
          });
        }
      }));
    }
  }));
};
/*!
 * Signature Pad v4.2.0 | https://github.com/szimek/signature_pad
 * (c) 2024 Szymon Nowak | Released under the MIT license
 */
class Bi {
  constructor(e, n, r, i) {
    if (isNaN(e) || isNaN(n))
      throw new Error(`Point is invalid: (${e}, ${n})`);
    this.x = +e, this.y = +n, this.pressure = r || 0, this.time = i || Date.now();
  }
  distanceTo(e) {
    return Math.sqrt(Math.pow(this.x - e.x, 2) + Math.pow(this.y - e.y, 2));
  }
  equals(e) {
    return this.x === e.x && this.y === e.y && this.pressure === e.pressure && this.time === e.time;
  }
  velocityFrom(e) {
    return this.time !== e.time ? this.distanceTo(e) / (this.time - e.time) : 0;
  }
}
class ia {
  static fromPoints(e, n) {
    const r = this.calculateControlPoints(e[0], e[1], e[2]).c2, i = this.calculateControlPoints(e[1], e[2], e[3]).c1;
    return new ia(e[1], r, i, e[2], n.start, n.end);
  }
  static calculateControlPoints(e, n, r) {
    const i = e.x - n.x, s = e.y - n.y, o = n.x - r.x, a = n.y - r.y, l = { x: (e.x + n.x) / 2, y: (e.y + n.y) / 2 }, c = { x: (n.x + r.x) / 2, y: (n.y + r.y) / 2 }, u = Math.sqrt(i * i + s * s), f = Math.sqrt(o * o + a * a), h = l.x - c.x, m = l.y - c.y, w = f / (u + f), g = { x: c.x + h * w, y: c.y + m * w }, p = n.x - g.x, v = n.y - g.y;
    return {
      c1: new Bi(l.x + p, l.y + v),
      c2: new Bi(c.x + p, c.y + v)
    };
  }
  constructor(e, n, r, i, s, o) {
    this.startPoint = e, this.control2 = n, this.control1 = r, this.endPoint = i, this.startWidth = s, this.endWidth = o;
  }
  length() {
    let n = 0, r, i;
    for (let s = 0; s <= 10; s += 1) {
      const o = s / 10, a = this.point(o, this.startPoint.x, this.control1.x, this.control2.x, this.endPoint.x), l = this.point(o, this.startPoint.y, this.control1.y, this.control2.y, this.endPoint.y);
      if (s > 0) {
        const c = a - r, u = l - i;
        n += Math.sqrt(c * c + u * u);
      }
      r = a, i = l;
    }
    return n;
  }
  point(e, n, r, i, s) {
    return n * (1 - e) * (1 - e) * (1 - e) + 3 * r * (1 - e) * (1 - e) * e + 3 * i * (1 - e) * e * e + s * e * e * e;
  }
}
class Mx {
  constructor() {
    try {
      this._et = new EventTarget();
    } catch {
      this._et = document;
    }
  }
  addEventListener(e, n, r) {
    this._et.addEventListener(e, n, r);
  }
  dispatchEvent(e) {
    return this._et.dispatchEvent(e);
  }
  removeEventListener(e, n, r) {
    this._et.removeEventListener(e, n, r);
  }
}
function Ox(t, e = 250) {
  let n = 0, r = null, i, s, o;
  const a = () => {
    n = Date.now(), r = null, i = t.apply(s, o), r || (s = null, o = []);
  };
  return function(...c) {
    const u = Date.now(), f = e - (u - n);
    return s = this, o = c, f <= 0 || f > e ? (r && (clearTimeout(r), r = null), n = u, i = t.apply(s, o), r || (s = null, o = [])) : r || (r = window.setTimeout(a, f)), i;
  };
}
class ji extends Mx {
  constructor(e, n = {}) {
    super(), this.canvas = e, this._drawingStroke = !1, this._isEmpty = !0, this._lastPoints = [], this._data = [], this._lastVelocity = 0, this._lastWidth = 0, this._handleMouseDown = (r) => {
      r.buttons === 1 && this._strokeBegin(r);
    }, this._handleMouseMove = (r) => {
      this._strokeMoveUpdate(r);
    }, this._handleMouseUp = (r) => {
      r.buttons === 1 && this._strokeEnd(r);
    }, this._handleTouchStart = (r) => {
      if (r.cancelable && r.preventDefault(), r.targetTouches.length === 1) {
        const i = r.changedTouches[0];
        this._strokeBegin(i);
      }
    }, this._handleTouchMove = (r) => {
      r.cancelable && r.preventDefault();
      const i = r.targetTouches[0];
      this._strokeMoveUpdate(i);
    }, this._handleTouchEnd = (r) => {
      if (r.target === this.canvas) {
        r.cancelable && r.preventDefault();
        const s = r.changedTouches[0];
        this._strokeEnd(s);
      }
    }, this._handlePointerStart = (r) => {
      r.preventDefault(), this._strokeBegin(r);
    }, this._handlePointerMove = (r) => {
      this._strokeMoveUpdate(r);
    }, this._handlePointerEnd = (r) => {
      this._drawingStroke && (r.preventDefault(), this._strokeEnd(r));
    }, this.velocityFilterWeight = n.velocityFilterWeight || 0.7, this.minWidth = n.minWidth || 0.5, this.maxWidth = n.maxWidth || 2.5, this.throttle = "throttle" in n ? n.throttle : 16, this.minDistance = "minDistance" in n ? n.minDistance : 5, this.dotSize = n.dotSize || 0, this.penColor = n.penColor || "black", this.backgroundColor = n.backgroundColor || "rgba(0,0,0,0)", this.compositeOperation = n.compositeOperation || "source-over", this.canvasContextOptions = "canvasContextOptions" in n ? n.canvasContextOptions : {}, this._strokeMoveUpdate = this.throttle ? Ox(ji.prototype._strokeUpdate, this.throttle) : ji.prototype._strokeUpdate, this._ctx = e.getContext("2d", this.canvasContextOptions), this.clear(), this.on();
  }
  clear() {
    const { _ctx: e, canvas: n } = this;
    e.fillStyle = this.backgroundColor, e.clearRect(0, 0, n.width, n.height), e.fillRect(0, 0, n.width, n.height), this._data = [], this._reset(this._getPointGroupOptions()), this._isEmpty = !0;
  }
  fromDataURL(e, n = {}) {
    return new Promise((r, i) => {
      const s = new Image(), o = n.ratio || window.devicePixelRatio || 1, a = n.width || this.canvas.width / o, l = n.height || this.canvas.height / o, c = n.xOffset || 0, u = n.yOffset || 0;
      this._reset(this._getPointGroupOptions()), s.onload = () => {
        this._ctx.drawImage(s, c, u, a, l), r();
      }, s.onerror = (f) => {
        i(f);
      }, s.crossOrigin = "anonymous", s.src = e, this._isEmpty = !1;
    });
  }
  toDataURL(e = "image/png", n) {
    switch (e) {
      case "image/svg+xml":
        return typeof n != "object" && (n = void 0), `data:image/svg+xml;base64,${btoa(this.toSVG(n))}`;
      default:
        return typeof n != "number" && (n = void 0), this.canvas.toDataURL(e, n);
    }
  }
  on() {
    this.canvas.style.touchAction = "none", this.canvas.style.msTouchAction = "none", this.canvas.style.userSelect = "none";
    const e = /Macintosh/.test(navigator.userAgent) && "ontouchstart" in document;
    window.PointerEvent && !e ? this._handlePointerEvents() : (this._handleMouseEvents(), "ontouchstart" in window && this._handleTouchEvents());
  }
  off() {
    this.canvas.style.touchAction = "auto", this.canvas.style.msTouchAction = "auto", this.canvas.style.userSelect = "auto", this.canvas.removeEventListener("pointerdown", this._handlePointerStart), this.canvas.removeEventListener("pointermove", this._handlePointerMove), this.canvas.ownerDocument.removeEventListener("pointerup", this._handlePointerEnd), this.canvas.removeEventListener("mousedown", this._handleMouseDown), this.canvas.removeEventListener("mousemove", this._handleMouseMove), this.canvas.ownerDocument.removeEventListener("mouseup", this._handleMouseUp), this.canvas.removeEventListener("touchstart", this._handleTouchStart), this.canvas.removeEventListener("touchmove", this._handleTouchMove), this.canvas.removeEventListener("touchend", this._handleTouchEnd);
  }
  isEmpty() {
    return this._isEmpty;
  }
  fromData(e, { clear: n = !0 } = {}) {
    n && this.clear(), this._fromData(e, this._drawCurve.bind(this), this._drawDot.bind(this)), this._data = this._data.concat(e);
  }
  toData() {
    return this._data;
  }
  _getPointGroupOptions(e) {
    return {
      penColor: e && "penColor" in e ? e.penColor : this.penColor,
      dotSize: e && "dotSize" in e ? e.dotSize : this.dotSize,
      minWidth: e && "minWidth" in e ? e.minWidth : this.minWidth,
      maxWidth: e && "maxWidth" in e ? e.maxWidth : this.maxWidth,
      velocityFilterWeight: e && "velocityFilterWeight" in e ? e.velocityFilterWeight : this.velocityFilterWeight,
      compositeOperation: e && "compositeOperation" in e ? e.compositeOperation : this.compositeOperation
    };
  }
  _strokeBegin(e) {
    if (!this.dispatchEvent(new CustomEvent("beginStroke", { detail: e, cancelable: !0 })))
      return;
    this._drawingStroke = !0;
    const r = this._getPointGroupOptions(), i = Object.assign(Object.assign({}, r), { points: [] });
    this._data.push(i), this._reset(r), this._strokeUpdate(e);
  }
  _strokeUpdate(e) {
    if (!this._drawingStroke)
      return;
    if (this._data.length === 0) {
      this._strokeBegin(e);
      return;
    }
    this.dispatchEvent(new CustomEvent("beforeUpdateStroke", { detail: e }));
    const n = e.clientX, r = e.clientY, i = e.pressure !== void 0 ? e.pressure : e.force !== void 0 ? e.force : 0, s = this._createPoint(n, r, i), o = this._data[this._data.length - 1], a = o.points, l = a.length > 0 && a[a.length - 1], c = l ? s.distanceTo(l) <= this.minDistance : !1, u = this._getPointGroupOptions(o);
    if (!l || !(l && c)) {
      const f = this._addPoint(s, u);
      l ? f && this._drawCurve(f, u) : this._drawDot(s, u), a.push({
        time: s.time,
        x: s.x,
        y: s.y,
        pressure: s.pressure
      });
    }
    this.dispatchEvent(new CustomEvent("afterUpdateStroke", { detail: e }));
  }
  _strokeEnd(e) {
    this._drawingStroke && (this._strokeUpdate(e), this._drawingStroke = !1, this.dispatchEvent(new CustomEvent("endStroke", { detail: e })));
  }
  _handlePointerEvents() {
    this._drawingStroke = !1, this.canvas.addEventListener("pointerdown", this._handlePointerStart), this.canvas.addEventListener("pointermove", this._handlePointerMove), this.canvas.ownerDocument.addEventListener("pointerup", this._handlePointerEnd);
  }
  _handleMouseEvents() {
    this._drawingStroke = !1, this.canvas.addEventListener("mousedown", this._handleMouseDown), this.canvas.addEventListener("mousemove", this._handleMouseMove), this.canvas.ownerDocument.addEventListener("mouseup", this._handleMouseUp);
  }
  _handleTouchEvents() {
    this.canvas.addEventListener("touchstart", this._handleTouchStart), this.canvas.addEventListener("touchmove", this._handleTouchMove), this.canvas.addEventListener("touchend", this._handleTouchEnd);
  }
  _reset(e) {
    this._lastPoints = [], this._lastVelocity = 0, this._lastWidth = (e.minWidth + e.maxWidth) / 2, this._ctx.fillStyle = e.penColor, this._ctx.globalCompositeOperation = e.compositeOperation;
  }
  _createPoint(e, n, r) {
    const i = this.canvas.getBoundingClientRect();
    return new Bi(e - i.left, n - i.top, r, (/* @__PURE__ */ new Date()).getTime());
  }
  _addPoint(e, n) {
    const { _lastPoints: r } = this;
    if (r.push(e), r.length > 2) {
      r.length === 3 && r.unshift(r[0]);
      const i = this._calculateCurveWidths(r[1], r[2], n), s = ia.fromPoints(r, i);
      return r.shift(), s;
    }
    return null;
  }
  _calculateCurveWidths(e, n, r) {
    const i = r.velocityFilterWeight * n.velocityFrom(e) + (1 - r.velocityFilterWeight) * this._lastVelocity, s = this._strokeWidth(i, r), o = {
      end: s,
      start: this._lastWidth
    };
    return this._lastVelocity = i, this._lastWidth = s, o;
  }
  _strokeWidth(e, n) {
    return Math.max(n.maxWidth / (e + 1), n.minWidth);
  }
  _drawCurveSegment(e, n, r) {
    const i = this._ctx;
    i.moveTo(e, n), i.arc(e, n, r, 0, 2 * Math.PI, !1), this._isEmpty = !1;
  }
  _drawCurve(e, n) {
    const r = this._ctx, i = e.endWidth - e.startWidth, s = Math.ceil(e.length()) * 2;
    r.beginPath(), r.fillStyle = n.penColor;
    for (let o = 0; o < s; o += 1) {
      const a = o / s, l = a * a, c = l * a, u = 1 - a, f = u * u, h = f * u;
      let m = h * e.startPoint.x;
      m += 3 * f * a * e.control1.x, m += 3 * u * l * e.control2.x, m += c * e.endPoint.x;
      let w = h * e.startPoint.y;
      w += 3 * f * a * e.control1.y, w += 3 * u * l * e.control2.y, w += c * e.endPoint.y;
      const g = Math.min(e.startWidth + c * i, n.maxWidth);
      this._drawCurveSegment(m, w, g);
    }
    r.closePath(), r.fill();
  }
  _drawDot(e, n) {
    const r = this._ctx, i = n.dotSize > 0 ? n.dotSize : (n.minWidth + n.maxWidth) / 2;
    r.beginPath(), this._drawCurveSegment(e.x, e.y, i), r.closePath(), r.fillStyle = n.penColor, r.fill();
  }
  _fromData(e, n, r) {
    for (const i of e) {
      const { points: s } = i, o = this._getPointGroupOptions(i);
      if (s.length > 1)
        for (let a = 0; a < s.length; a += 1) {
          const l = s[a], c = new Bi(l.x, l.y, l.pressure, l.time);
          a === 0 && this._reset(o);
          const u = this._addPoint(c, o);
          u && n(u, o);
        }
      else
        this._reset(o), r(s[0], o);
    }
  }
  toSVG({ includeBackgroundColor: e = !1 } = {}) {
    const n = this._data, r = Math.max(window.devicePixelRatio || 1, 1), i = 0, s = 0, o = this.canvas.width / r, a = this.canvas.height / r, l = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    if (l.setAttribute("xmlns", "http://www.w3.org/2000/svg"), l.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink"), l.setAttribute("viewBox", `${i} ${s} ${o} ${a}`), l.setAttribute("width", o.toString()), l.setAttribute("height", a.toString()), e && this.backgroundColor) {
      const c = document.createElement("rect");
      c.setAttribute("width", "100%"), c.setAttribute("height", "100%"), c.setAttribute("fill", this.backgroundColor), l.appendChild(c);
    }
    return this._fromData(n, (c, { penColor: u }) => {
      const f = document.createElement("path");
      if (!isNaN(c.control1.x) && !isNaN(c.control1.y) && !isNaN(c.control2.x) && !isNaN(c.control2.y)) {
        const h = `M ${c.startPoint.x.toFixed(3)},${c.startPoint.y.toFixed(3)} C ${c.control1.x.toFixed(3)},${c.control1.y.toFixed(3)} ${c.control2.x.toFixed(3)},${c.control2.y.toFixed(3)} ${c.endPoint.x.toFixed(3)},${c.endPoint.y.toFixed(3)}`;
        f.setAttribute("d", h), f.setAttribute("stroke-width", (c.endWidth * 2.25).toFixed(3)), f.setAttribute("stroke", u), f.setAttribute("fill", "none"), f.setAttribute("stroke-linecap", "round"), l.appendChild(f);
      }
    }, (c, { penColor: u, dotSize: f, minWidth: h, maxWidth: m }) => {
      const w = document.createElement("circle"), g = f > 0 ? f : (h + m) / 2;
      w.setAttribute("r", g.toString()), w.setAttribute("cx", c.x.toString()), w.setAttribute("cy", c.y.toString()), w.setAttribute("fill", u), l.appendChild(w);
    }), l.outerHTML;
  }
}
var Dl = /* @__PURE__ */ L("<span>"), Ex = /* @__PURE__ */ L('<div class="tw-flex tw-flex-col tw-gap-2"><canvas class="tw-h-42 tw-relative tw-aspect-[2/1] tw-w-full tw-rounded-lg tw-border tw-border-border tw-bg-muted"></canvas><div class="tw-flex tw-gap-2">');
const Ix = (t) => {
  let e, n;
  en(() => {
    var s, o;
    n = new ji(e), (s = t.answer) != null && s[0] && n.fromData((o = t.answer) == null ? void 0 : o[0].signature);
  });
  const r = () => {
    const s = [{
      type: "image/png",
      value: e.toDataURL(),
      signature: Tt(n.toData())
    }];
    t.onValueChange(s);
  }, i = () => {
    n.clear(), r();
  };
  return Z(() => {
    var a, l, c;
    const s = e, o = Math.max(window.devicePixelRatio || 1, 1);
    s && (e.width = e.offsetWidth * o, e.height = e.width * 0.5, (a = s.getContext("2d")) == null || a.scale(o, o), (l = t.answer) != null && l[0] && n.fromData((c = t.answer) == null ? void 0 : c[0].signature));
  }), d(Me, D(t, {
    get children() {
      var s = Ex(), o = s.firstChild, a = o.nextSibling;
      return vt((l) => {
        e = l;
      }, o), k(a, d(re, {
        title: "Save",
        variant: "default",
        onClick: r,
        class: "tw-flex tw-flex-1 tw-gap-2",
        get children() {
          return [(() => {
            var l = Dl();
            return k(l, () => A("save")), l;
          })(), d(mb, {})];
        }
      }), null), k(a, d(re, {
        title: "Clear",
        variant: "destructive",
        onClick: i,
        class: "tw-flex tw-flex-1 tw-gap-2",
        get children() {
          return [(() => {
            var l = Dl();
            return k(l, () => A("reset")), l;
          })(), d($b, {})];
        }
      }), null), s;
    }
  }));
};
var Px = /* @__PURE__ */ L('<div class="tw-grid tw-leading-none">'), Dx = /* @__PURE__ */ L('<div class="tw-flex tw-flex-col tw-gap-1"><div class=tw-ml-6>');
const $x = (t) => {
  const e = (n) => t.onValueChange(n);
  return (() => {
    var n = Dx(), r = n.firstChild;
    return k(n, d(yd, {
      get checked() {
        return !!t.answer;
      },
      onChange: e,
      class: "tw-flex tw-items-start tw-gap-2",
      get children() {
        return [d(xd, {
          class: "tw-mt-1 tw-size-4"
        }), d(bd, {}), (() => {
          var i = Px();
          return k(i, d(vd, {
            class: "tw-text-sm tw-font-medium tw-leading-normal peer-disabled:tw-cursor-not-allowed peer-disabled:tw-opacity-70",
            get children() {
              return d(Bd, t);
            }
          })), i;
        })()];
      }
    }), r), k(r, d(jd, {
      get message() {
        return t.validationMessage;
      },
      get params() {
        return t.validationParams;
      },
      get state() {
        return t.validationState;
      }
    })), n;
  })();
}, Tx = (t) => d(Me, D(t, {
  get children() {
    return d(Ot, {
      class: "tw-grid tw-w-full tw-gap-1.5",
      get children() {
        return d(id, {
          get class() {
            return G(Qe(t.validationState));
          },
          get rows() {
            return t.rows;
          },
          get readOnly() {
            return t.disabled;
          },
          get value() {
            return t.answer;
          },
          get onBlur() {
            return t.onBlur;
          },
          onChange: (e) => t.onValueChange(e.target.value),
          onInput: (e) => {
            t.isCapital && (e.target.value = e.target.value.toUpperCase());
          }
        });
      }
    });
  }
})), $l = (t) => d(Me, D(t, {
  get children() {
    return d(Ot, {
      get children() {
        return d(jt, {
          type: "text",
          get onBlur() {
            return t.onBlur;
          },
          get prefix() {
            return t.prefix;
          },
          get suffix() {
            return t.suffix;
          },
          get readOnly() {
            return t.disabled;
          },
          get inputMode() {
            return t.inputMode;
          },
          get value() {
            return t.answer;
          },
          onChange: (e) => t.onValueChange(e.target.value),
          get class() {
            return G(Qe(t.validationState));
          },
          onInput: (e) => {
            t.isCapital && (e.target.value = e.target.value.toUpperCase());
          }
        });
      }
    });
  }
})), Ax = (t) => {
  const e = (n) => t.onValueChange(n);
  return d(Me, D(t, {
    get children() {
      return d(Ju, {
        get disabled() {
          return t.disabled;
        },
        get checked() {
          return !!t.answer;
        },
        onChange: e,
        get children() {
          return d(Zu, {
            get children() {
              return d(ed, {
                class: "tw-size-4"
              });
            }
          });
        }
      });
    }
  }));
}, Lx = (t) => {
  const e = (r) => {
    const i = t.answer === void 0 ? [{
      value: void 0,
      unit: r
    }] : [{
      value: t.answer[0].value,
      unit: r
    }];
    t.onValueChange(i);
  }, n = (r) => {
    const i = fd(r) ? Number(r) : void 0, s = t.answer === void 0 ? [{
      value: i,
      unit: void 0
    }] : [{
      value: i,
      unit: t.answer[0].unit
    }];
    t.onValueChange(s);
  };
  return d(Me, D(t, {
    get children() {
      return d(gs, {
        decimalScale: 0,
        get onBlur() {
          return t.onBlur;
        },
        get readOnly() {
          return t.disabled;
        },
        get min() {
          var r;
          return (r = t.rangeInput) == null ? void 0 : r.min;
        },
        get suffix() {
          return d(si, {
            disallowEmptySelection: !0,
            get readOnly() {
              return t.disabled;
            },
            get value() {
              var r;
              return ((r = t.answer) == null ? void 0 : r[0].unit) ?? t.options[0];
            },
            get defaultValue() {
              return t.options[0];
            },
            get options() {
              return t.options ?? [];
            },
            onOpenChange: (r) => !r && t.onBlur(),
            onChange: e,
            optionLabel: (r) => A(r.label),
            optionValue: (r) => r.value
          });
        },
        get max() {
          var r;
          return (r = t.rangeInput) == null ? void 0 : r.max;
        },
        onChange: n,
        get value() {
          var r;
          return (r = t.answer) == null ? void 0 : r[0].value;
        },
        get locale() {
          return tn() || "en";
        },
        get class() {
          return G(Qe(t.validationState));
        }
      });
    }
  }));
}, Fx = (t) => d(Me, D(t, {
  get children() {
    return d(Ot, {
      get children() {
        return d(jt, {
          type: "url",
          get onBlur() {
            return t.onBlur;
          },
          get prefix() {
            return t.prefix;
          },
          get suffix() {
            return t.suffix;
          },
          get readOnly() {
            return t.disabled;
          },
          get value() {
            return t.answer;
          },
          onChange: (e) => t.onValueChange(e.target.value),
          get class() {
            return G(Qe(t.validationState));
          }
        });
      }
    });
  }
}));
var zx = /* @__PURE__ */ L('<div class="tw-flex tw-flex-col tw-gap-2">'), Rx = /* @__PURE__ */ L("<div>");
const Vx = (t) => d(Me, D(t, {
  get children() {
    return d(ff, {
      get children() {
        return [d(ks, {
          get when() {
            return t.renderType === xi.SingleValue;
          },
          get children() {
            return d(Ot, {
              class: "tw-grid tw-w-full tw-gap-1.5",
              get children() {
                return d(jt, {
                  type: "text",
                  class: "tw-bg-muted",
                  get value() {
                    return A(t.answer ?? "");
                  },
                  readOnly: !0
                });
              }
            });
          }
        }), d(ks, {
          get when() {
            return t.renderType === xi.MultiValue;
          },
          get children() {
            var e = zx();
            return k(e, d(xe, {
              get each() {
                return n5(t.answer);
              },
              children: (n) => d(Ot, {
                class: "tw-grid tw-w-full tw-gap-1.5",
                get children() {
                  return d(jt, {
                    type: "text",
                    class: "tw-bg-muted",
                    get value() {
                      return A(n || "");
                    },
                    readOnly: !0
                  });
                }
              })
            })), e;
          }
        }), d(ks, {
          get when() {
            return t.renderType === xi.HTML;
          },
          get children() {
            var e = Rx();
            return oe(() => e.innerHTML = A(t.answer || "")), e;
          }
        })];
      }
    });
  }
}));
var Nx = /* @__PURE__ */ L('<div><div class="tw-flex tw-items-center tw-bg-destructive tw-px-4 tw-py-2 tw-text-background"><span>The component with type <strong></strong> is not yet implemented.'), Kx = /* @__PURE__ */ L("<div>");
const Bx = /* @__PURE__ */ new Map([[ie.UrlInput, Fx], [ie.GpsInput, I4], [ie.NowInput, rx], [ie.CsvInput, c4], [ie.FileInput, _4], [ie.InnerHTML, $4], [ie.TextInput, $l], [ie.DateInput, f4], [ie.WeekInput, m4], [ie.YearInput, p4], [ie.TimeInput, g4], [ie.EmailInput, $l], [ie.MonthInput, w4], [ie.RadioInput, vx], [ie.PhotoInput, wx], [ie.SelectInput, Sx], [ie.RatingInput, kx], [ie.NumberInput, ix], [ie.ToggleInput, Ax], [ie.NestedInput, Z4], [ie.MaskingInput, q4], [ie.DecimalInput, v4], [ie.TextAreaInput, Tx], [ie.VariableInput, Vx], [ie.CheckboxInput, n4], [ie.CurrencyInput, d4], [ie.SignatureInput, Ix], [ie.DateTimeLocalInput, h4], [ie.SingleCheckInput, $x], [ie.RangeSliderInput, yx], [ie.MultipleSelectInput, X4], [ie.ListTextInputRepeat, N4], [ie.ListSelectInputRepeat, F4], [ie.UnitInput, Lx]]), jx = (t) => {
  const e = () => Bx.get(t.type), n = (o) => R2(t.dataKey, o), r = () => N2(t.dataKey), i = () => e ? t.type === ie.VariableInput ? t.render === !0 && t.enable === !0 : t.enable === !0 : !1, s = () => ae.config.formMode === Nt.Close ? !0 : ae.config.formMode === Nt.Review ? (t.isEditable ?? !1) === !1 : ae.config.initialMode === kc.Initial ? t.disableInitial ?? !1 : t.disableInput ?? !1;
  return [d(te, {
    get when() {
      return !e();
    },
    get children() {
      var o = Nx(), a = o.firstChild, l = a.firstChild, c = l.firstChild, u = c.nextSibling;
      return k(a, d(sd, {
        class: "tw-mr-2 tw-size-4"
      }), l), k(u, () => t.type), oe(() => Xe(o, "id", t.dataKey)), o;
    }
  }), d(te, {
    get when() {
      return i();
    },
    get children() {
      var o = Kx();
      return k(o, d(yi, D({
        get disabled() {
          return s();
        },
        get component() {
          return e();
        },
        onValueChange: n,
        onBlur: r
      }, t))), oe(() => Xe(o, "id", t.dataKey)), o;
    }
  })];
}, Wx = () => {
  Z(He(() => je.activeDataKey, () => t())), Z(He(() => je.focusedDataKey, () => n()));
  const t = () => {
    e(), $e.emit("save", ae.getOutput());
  }, e = () => {
    var r;
    (r = je.container) == null || r.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, n = () => {
    const r = document.getElementById(je.focusedDataKey);
    if (!r)
      return e();
    r.classList.add("tw-animate-blink-blink"), setTimeout(() => {
      r.classList.remove("tw-animate-blink-blink");
    }, 2e3), r.scrollIntoView({
      behavior: "smooth"
    });
  };
};
var Hx = /* @__PURE__ */ L('<div class="tw-relative tw-flex-1 tw-overflow-auto tw-py-2"><div class="tw-container tw-m-auto tw-flex tw-flex-col tw-space-y-4 tw-px-4 tw-@container/form"><div class=tw-h-24>');
const Ux = () => (Wx(), (() => {
  var t = Hx(), e = t.firstChild, n = e.firstChild;
  return vt((r) => Mt({
    container: r
  }), t), k(e, d(xe, {
    get each() {
      var r;
      return ((r = Fo()) == null ? void 0 : r.components) ?? [];
    },
    children: (r) => d(jx, r)
  }), n), t;
})()), qx = () => {
  const t = ht(), e = Gc(), n = (o, a) => {
    t.openConfirmModal({
      title: A("get.location"),
      children: () => A("get.location.confirmation"),
      labels: {
        confirm: A("yes")
      },
      onConfirm: () => (ae.saveAnswer(o, Qg(Nr(a))), e.show(A("get.location.acquired")), t.closeAll())
    });
  }, r = (o, a) => {
    const l = [];
    Nr(a).forEach((c) => c instanceof File ? l.push(Ao(c, o)) : l.push(c)), ae.saveAnswer(o, l);
  }, i = (o, a) => {
    if (!a) {
      e.destructive(A("upload.file.failed"));
      return;
    }
    a = Nr(a);
    const l = ae.getAnswer(o).map((c) => c.filename === a.filename ? a : c);
    ae.saveAnswer(o, l), e.show(A("uploaded"));
  }, s = () => $e.emit("save", ae.getOutput());
  $e.on("geolocation-request", async (o) => {
    const a = await Bf();
    $e.emit("geolocation-acquired", o, {
      latitude: a.coords.latitude,
      longitude: a.coords.longitude,
      accuracy: a.coords.accuracy
    });
  }), $e.on("show-message", (o) => e.show(o)), $e.on("show-error-message", (o) => e.destructive(o)), $e.on("geolocation-acquired", n), $e.on("file-selected", r), $e.on("upload-finished", i), $e.on("trigger-save", s), me(() => {
    $e.off("geolocation-acquired", n), $e.off("file-selected", r), $e.off("upload-finished", i), $e.off("trigger-save", s);
  });
};
var Gx = /* @__PURE__ */ L('<div class="tw-absolute tw-inset-0 tw-flex tw-size-full tw-flex-row tw-overflow-hidden tw-bg-background tw-@container/main"><div class="tw-relative tw-flex tw-flex-1 tw-flex-col tw-font-sans tw-text-sm">'), Yx = /* @__PURE__ */ L("<div id=fasih-form>");
const Xx = () => (p1(), qx(), (() => {
  var t = Gx(), e = t.firstChild;
  return k(t, d(P5, {}), e), k(e, d(p5, {}), null), k(e, d(Ux, {}), null), k(e, d(A5, {}), null), t;
})()), Qx = () => (() => {
  var t = Yx();
  return k(t, d(om, {
    get children() {
      return d(qb, {
        get label() {
          return {
            cancel: A("cancel"),
            confirm: A("confirm")
          };
        },
        get children() {
          return d(Xx, {});
        }
      });
    }
  })), t;
})(), Jx = (t, e) => {
  z2(e);
  const n = document.querySelector(t);
  if (!n)
    throw new Error("failed to mount fasih-form, no element found");
  return {
    event: $e,
    render: () => Cf(() => d(Qx, {}), n)
  };
};
window.FasihForm || (window.FasihForm = Jx);
export {
  Jx as FasihForm
};
