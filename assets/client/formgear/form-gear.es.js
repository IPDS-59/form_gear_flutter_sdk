var $a = Object.defineProperty, _a = Object.defineProperties;
var Sa = Object.getOwnPropertyDescriptors;
var sr = Object.getOwnPropertySymbols;
var Ca = Object.prototype.hasOwnProperty, Ma = Object.prototype.propertyIsEnumerable;
var Ei = (e, t, n) => t in e ? $a(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, Ae = (e, t) => {
  for (var n in t || (t = {}))
    Ca.call(t, n) && Ei(e, n, t[n]);
  if (sr)
    for (var n of sr(t))
      Ma.call(t, n) && Ei(e, n, t[n]);
  return e;
}, Ct = (e, t) => _a(e, Sa(t));
var Ne = (e, t, n) => Ei(e, typeof t != "symbol" ? t + "" : t, n);
var ce = (e, t, n) => new Promise((i, r) => {
  var l = (c) => {
    try {
      s(n.next(c));
    } catch (o) {
      r(o);
    }
  }, a = (c) => {
    try {
      s(n.throw(c));
    } catch (o) {
      r(o);
    }
  }, s = (c) => c.done ? i(c.value) : Promise.resolve(c.value).then(l, a);
  s((n = n.apply(e, t)).next());
});
const Ia = (e, t) => e === t, Tt = /* @__PURE__ */ Symbol("solid-proxy"), Ur = typeof Proxy == "function", Ri = /* @__PURE__ */ Symbol("solid-track"), si = {
  equals: Ia
};
let Wr = Xr;
const Xt = 1, oi = 2, qr = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
}, Oi = {};
var Te = null;
let Li = null, Ea = null, Pe = null, dt = null, Gt = null, mi = 0;
function Yn(e, t) {
  const n = Pe, i = Te, r = e.length === 0, l = t === void 0 ? i : t, a = r ? qr : {
    owned: null,
    cleanups: null,
    context: l ? l.context : null,
    owner: l
  }, s = r ? e : () => e(() => mt(() => Vn(a)));
  Te = a, Pe = null;
  try {
    return Yt(s, !0);
  } finally {
    Pe = n, Te = i;
  }
}
function K(e, t) {
  t = t ? Object.assign({}, si, t) : si;
  const n = {
    value: e,
    observers: null,
    observerSlots: null,
    comparator: t.equals || void 0
  }, i = (r) => (typeof r == "function" && (r = r(n.value)), Zr(n, r));
  return [Qr.bind(n), i];
}
function Oa(e, t, n) {
  const i = wi(e, t, !0, Xt);
  In(i);
}
function R(e, t, n) {
  const i = wi(e, t, !1, Xt);
  In(i);
}
function Me(e, t, n) {
  Wr = Ta;
  const i = wi(e, t, !1, Xt);
  i.user = !0, Gt ? Gt.push(i) : In(i);
}
function Ee(e, t, n) {
  n = n ? Object.assign({}, si, n) : si;
  const i = wi(e, t, !0, 0);
  return i.observers = null, i.observerSlots = null, i.comparator = n.equals || void 0, In(i), Qr.bind(i);
}
function La(e) {
  return e && typeof e == "object" && "then" in e;
}
function Dn(e, t, n) {
  let i, r, l;
  typeof t == "function" ? (i = e, r = t, l = {}) : (i = !0, r = e, l = t || {});
  let a = null, s = Oi, c = !1, o = "initialValue" in l, d = typeof i == "function" && Ee(i);
  const f = /* @__PURE__ */ new Set(), [x, $] = (l.storage || K)(l.initialValue), [C, g] = K(void 0), [u, b] = K(void 0, {
    equals: !1
  }), [y, S] = K(o ? "ready" : "unresolved");
  function p(w, E, I, M) {
    return a === w && (a = null, M !== void 0 && (o = !0), (w === s || E === s) && l.onHydrated && queueMicrotask(() => l.onHydrated(M, {
      value: E
    })), s = Oi, L(E, I)), E;
  }
  function L(w, E) {
    Yt(() => {
      E === void 0 && $(() => w), S(E !== void 0 ? "errored" : o ? "ready" : "unresolved"), g(E);
      for (const I of f.keys()) I.decrement();
      f.clear();
    }, !1);
  }
  function V() {
    const w = Ra, E = x(), I = C();
    if (I !== void 0 && !a) throw I;
    return Pe && Pe.user, E;
  }
  function v(w = !0) {
    if (w !== !1 && c) return;
    c = !1;
    const E = d ? d() : i;
    if (E == null || E === !1) {
      p(a, mt(x));
      return;
    }
    let I;
    const M = s !== Oi ? s : mt(() => {
      try {
        return r(E, {
          value: x(),
          refetching: w
        });
      } catch (O) {
        I = O;
      }
    });
    if (I !== void 0) {
      p(a, void 0, Qn(I), E);
      return;
    } else if (!La(M))
      return p(a, M, void 0, E), M;
    return a = M, "v" in M ? (M.s === 1 ? p(a, M.v, void 0, E) : p(a, void 0, Qn(M.v), E), M) : (c = !0, queueMicrotask(() => c = !1), Yt(() => {
      S(o ? "refreshing" : "pending"), b();
    }, !1), M.then((O) => p(M, O, void 0, E), (O) => p(M, void 0, Qn(O), E)));
  }
  Object.defineProperties(V, {
    state: {
      get: () => y()
    },
    error: {
      get: () => C()
    },
    loading: {
      get() {
        const w = y();
        return w === "pending" || w === "refreshing";
      }
    },
    latest: {
      get() {
        if (!o) return V();
        const w = C();
        if (w && !a) throw w;
        return x();
      }
    }
  });
  let h = Te;
  return d ? Oa(() => (h = Te, v(!1))) : v(!1), [V, {
    refetch: (w) => Aa(h, () => v(w)),
    mutate: $
  }];
}
function Ni(e) {
  return Yt(e, !1);
}
function mt(e) {
  if (Pe === null) return e();
  const t = Pe;
  Pe = null;
  try {
    return e();
  } finally {
    Pe = t;
  }
}
function un(e, t, n) {
  const i = Array.isArray(e);
  let r, l = n && n.defer;
  return (a) => {
    let s;
    if (i) {
      s = Array(e.length);
      for (let o = 0; o < e.length; o++) s[o] = e[o]();
    } else s = e();
    if (l)
      return l = !1, a;
    const c = mt(() => t(s, r, a));
    return r = s, c;
  };
}
function Gr(e) {
  Me(() => mt(e));
}
function bi(e) {
  return Te === null || (Te.cleanups === null ? Te.cleanups = [e] : Te.cleanups.push(e)), e;
}
function Vi() {
  return Pe;
}
function Aa(e, t) {
  const n = Te, i = Pe;
  Te = e, Pe = null;
  try {
    return Yt(t, !0);
  } catch (r) {
    Pi(r);
  } finally {
    Te = n, Pe = i;
  }
}
const [mv, bv] = /* @__PURE__ */ K(!1);
function Pn(e, t) {
  const n = /* @__PURE__ */ Symbol("context");
  return {
    id: n,
    Provider: ja(n),
    defaultValue: e
  };
}
function Kn(e) {
  let t;
  return Te && Te.context && (t = Te.context[e.id]) !== void 0 ? t : e.defaultValue;
}
function Yr(e) {
  const t = Ee(e), n = Ee(() => Ti(t()));
  return n.toArray = () => {
    const i = n();
    return Array.isArray(i) ? i : i != null ? [i] : [];
  }, n;
}
let Ra;
function Qr() {
  if (this.sources && this.state)
    if (this.state === Xt) In(this);
    else {
      const e = dt;
      dt = null, Yt(() => ci(this), !1), dt = e;
    }
  if (Pe) {
    const e = this.observers ? this.observers.length : 0;
    Pe.sources ? (Pe.sources.push(this), Pe.sourceSlots.push(e)) : (Pe.sources = [this], Pe.sourceSlots = [e]), this.observers ? (this.observers.push(Pe), this.observerSlots.push(Pe.sources.length - 1)) : (this.observers = [Pe], this.observerSlots = [Pe.sources.length - 1]);
  }
  return this.value;
}
function Zr(e, t, n) {
  let i = e.value;
  return (!e.comparator || !e.comparator(i, t)) && (e.value = t, e.observers && e.observers.length && Yt(() => {
    for (let r = 0; r < e.observers.length; r += 1) {
      const l = e.observers[r], a = Li && Li.running;
      a && Li.disposed.has(l), (a ? !l.tState : !l.state) && (l.pure ? dt.push(l) : Gt.push(l), l.observers && el(l)), a || (l.state = Xt);
    }
    if (dt.length > 1e6)
      throw dt = [], new Error();
  }, !1)), t;
}
function In(e) {
  if (!e.fn) return;
  Vn(e);
  const t = mi;
  Na(e, e.value, t);
}
function Na(e, t, n) {
  let i;
  const r = Te, l = Pe;
  Pe = Te = e;
  try {
    i = e.fn(t);
  } catch (a) {
    return e.pure && (e.state = Xt, e.owned && e.owned.forEach(Vn), e.owned = null), e.updatedAt = n + 1, Pi(a);
  } finally {
    Pe = l, Te = r;
  }
  (!e.updatedAt || e.updatedAt <= n) && (e.updatedAt != null && "observers" in e ? Zr(e, i) : e.value = i, e.updatedAt = n);
}
function wi(e, t, n, i = Xt, r) {
  const l = {
    fn: e,
    state: i,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: t,
    owner: Te,
    context: Te ? Te.context : null,
    pure: n
  };
  return Te === null || Te !== qr && (Te.owned ? Te.owned.push(l) : Te.owned = [l]), l;
}
function di(e) {
  if (e.state === 0) return;
  if (e.state === oi) return ci(e);
  if (e.suspense && mt(e.suspense.inFallback)) return e.suspense.effects.push(e);
  const t = [e];
  for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < mi); )
    e.state && t.push(e);
  for (let n = t.length - 1; n >= 0; n--)
    if (e = t[n], e.state === Xt)
      In(e);
    else if (e.state === oi) {
      const i = dt;
      dt = null, Yt(() => ci(e, t[0]), !1), dt = i;
    }
}
function Yt(e, t) {
  if (dt) return e();
  let n = !1;
  t || (dt = []), Gt ? n = !0 : Gt = [], mi++;
  try {
    const i = e();
    return Va(n), i;
  } catch (i) {
    n || (Gt = null), dt = null, Pi(i);
  }
}
function Va(e) {
  if (dt && (Xr(dt), dt = null), e) return;
  const t = Gt;
  Gt = null, t.length && Yt(() => Wr(t), !1);
}
function Xr(e) {
  for (let t = 0; t < e.length; t++) di(e[t]);
}
function Ta(e) {
  let t, n = 0;
  for (t = 0; t < e.length; t++) {
    const i = e[t];
    i.user ? e[n++] = i : di(i);
  }
  for (t = 0; t < n; t++) di(e[t]);
}
function ci(e, t) {
  e.state = 0;
  for (let n = 0; n < e.sources.length; n += 1) {
    const i = e.sources[n];
    if (i.sources) {
      const r = i.state;
      r === Xt ? i !== t && (!i.updatedAt || i.updatedAt < mi) && di(i) : r === oi && ci(i, t);
    }
  }
}
function el(e) {
  for (let t = 0; t < e.observers.length; t += 1) {
    const n = e.observers[t];
    n.state || (n.state = oi, n.pure ? dt.push(n) : Gt.push(n), n.observers && el(n));
  }
}
function Vn(e) {
  let t;
  if (e.sources)
    for (; e.sources.length; ) {
      const n = e.sources.pop(), i = e.sourceSlots.pop(), r = n.observers;
      if (r && r.length) {
        const l = r.pop(), a = n.observerSlots.pop();
        i < r.length && (l.sourceSlots[a] = i, r[i] = l, n.observerSlots[i] = a);
      }
    }
  if (e.tOwned) {
    for (t = e.tOwned.length - 1; t >= 0; t--) Vn(e.tOwned[t]);
    delete e.tOwned;
  }
  if (e.owned) {
    for (t = e.owned.length - 1; t >= 0; t--) Vn(e.owned[t]);
    e.owned = null;
  }
  if (e.cleanups) {
    for (t = e.cleanups.length - 1; t >= 0; t--) e.cleanups[t]();
    e.cleanups = null;
  }
  e.state = 0;
}
function Qn(e) {
  return e instanceof Error ? e : new Error(typeof e == "string" ? e : "Unknown error", {
    cause: e
  });
}
function Pi(e, t = Te) {
  throw Qn(e);
}
function Ti(e) {
  if (typeof e == "function" && !e.length) return Ti(e());
  if (Array.isArray(e)) {
    const t = [];
    for (let n = 0; n < e.length; n++) {
      const i = Ti(e[n]);
      Array.isArray(i) ? t.push.apply(t, i) : t.push(i);
    }
    return t;
  }
  return e;
}
function ja(e, t) {
  return function(i) {
    let r;
    return R(() => r = mt(() => (Te.context = Ct(Ae({}, Te.context), {
      [e]: i.value
    }), Yr(() => i.children))), void 0), r;
  };
}
const Da = /* @__PURE__ */ Symbol("fallback");
function or(e) {
  for (let t = 0; t < e.length; t++) e[t]();
}
function Pa(e, t, n = {}) {
  let i = [], r = [], l = [], a = 0, s = t.length > 1 ? [] : null;
  return bi(() => or(l)), () => {
    let c = e() || [], o = c.length, d, f;
    return c[Ri], mt(() => {
      let $, C, g, u, b, y, S, p, L;
      if (o === 0)
        a !== 0 && (or(l), l = [], i = [], r = [], a = 0, s && (s = [])), n.fallback && (i = [Da], r[0] = Yn((V) => (l[0] = V, n.fallback())), a = 1);
      else if (a === 0) {
        for (r = new Array(o), f = 0; f < o; f++)
          i[f] = c[f], r[f] = Yn(x);
        a = o;
      } else {
        for (g = new Array(o), u = new Array(o), s && (b = new Array(o)), y = 0, S = Math.min(a, o); y < S && i[y] === c[y]; y++) ;
        for (S = a - 1, p = o - 1; S >= y && p >= y && i[S] === c[p]; S--, p--)
          g[p] = r[S], u[p] = l[S], s && (b[p] = s[S]);
        for ($ = /* @__PURE__ */ new Map(), C = new Array(p + 1), f = p; f >= y; f--)
          L = c[f], d = $.get(L), C[f] = d === void 0 ? -1 : d, $.set(L, f);
        for (d = y; d <= S; d++)
          L = i[d], f = $.get(L), f !== void 0 && f !== -1 ? (g[f] = r[d], u[f] = l[d], s && (b[f] = s[d]), f = C[f], $.set(L, f)) : l[d]();
        for (f = y; f < o; f++)
          f in g ? (r[f] = g[f], l[f] = u[f], s && (s[f] = b[f], s[f](f))) : r[f] = Yn(x);
        r = r.slice(0, a = o), i = c.slice(0);
      }
      return r;
    });
    function x($) {
      if (l[f] = $, s) {
        const [C, g] = K(f);
        return s[f] = g, t(c[f], C);
      }
      return t(c[f]);
    }
  };
}
function m(e, t) {
  return mt(() => e(t || {}));
}
function Gn() {
  return !0;
}
const ji = {
  get(e, t, n) {
    return t === Tt ? n : e.get(t);
  },
  has(e, t) {
    return t === Tt ? !0 : e.has(t);
  },
  set: Gn,
  deleteProperty: Gn,
  getOwnPropertyDescriptor(e, t) {
    return {
      configurable: !0,
      enumerable: !0,
      get() {
        return e.get(t);
      },
      set: Gn,
      deleteProperty: Gn
    };
  },
  ownKeys(e) {
    return e.keys();
  }
};
function Ai(e) {
  return (e = typeof e == "function" ? e() : e) ? e : {};
}
function Ka() {
  for (let e = 0, t = this.length; e < t; ++e) {
    const n = this[e]();
    if (n !== void 0) return n;
  }
}
function jt(...e) {
  let t = !1;
  for (let a = 0; a < e.length; a++) {
    const s = e[a];
    t = t || !!s && Tt in s, e[a] = typeof s == "function" ? (t = !0, Ee(s)) : s;
  }
  if (Ur && t)
    return new Proxy({
      get(a) {
        for (let s = e.length - 1; s >= 0; s--) {
          const c = Ai(e[s])[a];
          if (c !== void 0) return c;
        }
      },
      has(a) {
        for (let s = e.length - 1; s >= 0; s--)
          if (a in Ai(e[s])) return !0;
        return !1;
      },
      keys() {
        const a = [];
        for (let s = 0; s < e.length; s++) a.push(...Object.keys(Ai(e[s])));
        return [...new Set(a)];
      }
    }, ji);
  const n = {}, i = /* @__PURE__ */ Object.create(null);
  for (let a = e.length - 1; a >= 0; a--) {
    const s = e[a];
    if (!s) continue;
    const c = Object.getOwnPropertyNames(s);
    for (let o = c.length - 1; o >= 0; o--) {
      const d = c[o];
      if (d === "__proto__" || d === "constructor") continue;
      const f = Object.getOwnPropertyDescriptor(s, d);
      if (!i[d])
        i[d] = f.get ? {
          enumerable: !0,
          configurable: !0,
          get: Ka.bind(n[d] = [f.get.bind(s)])
        } : f.value !== void 0 ? f : void 0;
      else {
        const x = n[d];
        x && (f.get ? x.push(f.get.bind(s)) : f.value !== void 0 && x.push(() => f.value));
      }
    }
  }
  const r = {}, l = Object.keys(i);
  for (let a = l.length - 1; a >= 0; a--) {
    const s = l[a], c = i[s];
    c && c.get ? Object.defineProperty(r, s, c) : r[s] = c ? c.value : void 0;
  }
  return r;
}
function tl(e, ...t) {
  const n = t.length;
  if (Ur && Tt in e) {
    const r = n > 1 ? t.flat() : t[0], l = t.map((a) => new Proxy({
      get(s) {
        return a.includes(s) ? e[s] : void 0;
      },
      has(s) {
        return a.includes(s) && s in e;
      },
      keys() {
        return a.filter((s) => s in e);
      }
    }, ji));
    return l.push(new Proxy({
      get(a) {
        return r.includes(a) ? void 0 : e[a];
      },
      has(a) {
        return r.includes(a) ? !1 : a in e;
      },
      keys() {
        return Object.keys(e).filter((a) => !r.includes(a));
      }
    }, ji)), l;
  }
  const i = [];
  for (let r = 0; r <= n; r++)
    i[r] = {};
  for (const r of Object.getOwnPropertyNames(e)) {
    let l = n;
    for (let c = 0; c < t.length; c++)
      if (t[c].includes(r)) {
        l = c;
        break;
      }
    const a = Object.getOwnPropertyDescriptor(e, r);
    !a.get && !a.set && a.enumerable && a.writable && a.configurable ? i[l][r] = a.value : Object.defineProperty(i[l], r, a);
  }
  return i;
}
const nl = (e) => `Stale read from <${e}>.`;
function fe(e) {
  const t = "fallback" in e && {
    fallback: () => e.fallback
  };
  return Ee(Pa(() => e.each, e.children, t || void 0));
}
function j(e) {
  const t = e.keyed, n = Ee(() => e.when, void 0, void 0), i = t ? n : Ee(n, void 0, {
    equals: (r, l) => !r == !l
  });
  return Ee(() => {
    const r = i();
    if (r) {
      const l = e.children;
      return typeof l == "function" && l.length > 0 ? mt(() => l(t ? r : () => {
        if (!mt(i)) throw nl("Show");
        return n();
      })) : l;
    }
    return e.fallback;
  }, void 0, void 0);
}
function we(e) {
  const t = Yr(() => e.children), n = Ee(() => {
    const i = t(), r = Array.isArray(i) ? i : [i];
    let l = () => {
    };
    for (let a = 0; a < r.length; a++) {
      const s = a, c = r[a], o = l, d = Ee(() => o() ? void 0 : c.when, void 0, void 0), f = c.keyed ? d : Ee(d, void 0, {
        equals: (x, $) => !x == !$
      });
      l = () => o() || (f() ? [s, d, c] : void 0);
    }
    return l;
  });
  return Ee(() => {
    const i = n()();
    if (!i) return e.fallback;
    const [r, l, a] = i, s = a.children;
    return typeof s == "function" && s.length > 0 ? mt(() => s(a.keyed ? l() : () => {
      var o;
      if (((o = mt(n)()) == null ? void 0 : o[0]) !== r) throw nl("Match");
      return l();
    })) : s;
  }, void 0, void 0);
}
function ee(e) {
  return e;
}
const Ba = /* @__PURE__ */ new Set(["innerHTML", "textContent", "innerText", "children"]), za = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(null), {
  className: "class",
  htmlFor: "for"
}), Fa = /* @__PURE__ */ new Set(["beforeinput", "click", "dblclick", "contextmenu", "focusin", "focusout", "input", "keydown", "keyup", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "pointerdown", "pointermove", "pointerout", "pointerover", "pointerup", "touchend", "touchmove", "touchstart"]), Ha = {
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace"
}, ue = (e) => Ee(() => e());
function Ja(e, t, n) {
  let i = n.length, r = t.length, l = i, a = 0, s = 0, c = t[r - 1].nextSibling, o = null;
  for (; a < r || s < l; ) {
    if (t[a] === n[s]) {
      a++, s++;
      continue;
    }
    for (; t[r - 1] === n[l - 1]; )
      r--, l--;
    if (r === a) {
      const d = l < i ? s ? n[s - 1].nextSibling : n[l - s] : c;
      for (; s < l; ) e.insertBefore(n[s++], d);
    } else if (l === s)
      for (; a < r; )
        (!o || !o.has(t[a])) && t[a].remove(), a++;
    else if (t[a] === n[l - 1] && n[s] === t[r - 1]) {
      const d = t[--r].nextSibling;
      e.insertBefore(n[s++], t[a++].nextSibling), e.insertBefore(n[--l], d), t[r] = n[l];
    } else {
      if (!o) {
        o = /* @__PURE__ */ new Map();
        let f = s;
        for (; f < l; ) o.set(n[f], f++);
      }
      const d = o.get(t[a]);
      if (d != null)
        if (s < d && d < l) {
          let f = a, x = 1, $;
          for (; ++f < r && f < l && !(($ = o.get(t[f])) == null || $ !== d + x); )
            x++;
          if (x > d - s) {
            const C = t[a];
            for (; s < d; ) e.insertBefore(n[s++], C);
          } else e.replaceChild(n[s++], t[a++]);
        } else a++;
      else t[a++].remove();
    }
  }
}
const dr = "_$DX_DELEGATE";
function Ua(e, t, n, i = {}) {
  let r;
  return Yn((l) => {
    r = l, t === document ? e() : _(t, e(), t.firstChild ? null : void 0, n);
  }, i.owner), () => {
    r(), t.textContent = "";
  };
}
function k(e, t, n, i) {
  let r;
  const l = () => {
    const s = document.createElement("template");
    return s.innerHTML = e, s.content.firstChild;
  }, a = () => (r || (r = l())).cloneNode(!0);
  return a.cloneNode = a, a;
}
function ye(e, t = window.document) {
  const n = t[dr] || (t[dr] = /* @__PURE__ */ new Set());
  for (let i = 0, r = e.length; i < r; i++) {
    const l = e[i];
    n.has(l) || (n.add(l), t.addEventListener(l, Xa));
  }
}
function J(e, t, n) {
  n == null ? e.removeAttribute(t) : e.setAttribute(t, n);
}
function Wa(e, t, n, i) {
  i == null ? e.removeAttributeNS(t, n) : e.setAttributeNS(t, n, i);
}
function qa(e, t, n) {
  n ? e.setAttribute(t, "") : e.removeAttribute(t);
}
function Ki(e, t) {
  t == null ? e.removeAttribute("class") : e.className = t;
}
function gt(e, t, n, i) {
  if (i)
    Array.isArray(n) ? (e[`$$${t}`] = n[0], e[`$$${t}Data`] = n[1]) : e[`$$${t}`] = n;
  else if (Array.isArray(n)) {
    const r = n[0];
    e.addEventListener(t, n[0] = (l) => r.call(e, n[1], l));
  } else e.addEventListener(t, n, typeof n != "function" && n);
}
function te(e, t, n = {}) {
  const i = Object.keys(t || {}), r = Object.keys(n);
  let l, a;
  for (l = 0, a = r.length; l < a; l++) {
    const s = r[l];
    !s || s === "undefined" || t[s] || (cr(e, s, !1), delete n[s]);
  }
  for (l = 0, a = i.length; l < a; l++) {
    const s = i[l], c = !!t[s];
    !s || s === "undefined" || n[s] === c || !c || (cr(e, s, !0), n[s] = c);
  }
  return n;
}
function Ga(e, t, n) {
  if (!t) return n ? J(e, "style") : t;
  const i = e.style;
  if (typeof t == "string") return i.cssText = t;
  typeof n == "string" && (i.cssText = n = void 0), n || (n = {}), t || (t = {});
  let r, l;
  for (l in n)
    t[l] == null && i.removeProperty(l), delete n[l];
  for (l in t)
    r = t[l], r !== n[l] && (i.setProperty(l, r), n[l] = r);
  return n;
}
function Ya(e, t = {}, n, i) {
  const r = {};
  return R(() => typeof t.ref == "function" && en(t.ref, e)), R(() => Qa(e, t, n, !0, r, !0)), r;
}
function en(e, t, n) {
  return mt(() => e(t, n));
}
function _(e, t, n, i) {
  if (n !== void 0 && !i && (i = []), typeof t != "function") return ui(e, t, i, n);
  R((r) => ui(e, t(), r, n), i);
}
function Qa(e, t, n, i, r = {}, l = !1) {
  t || (t = {});
  for (const a in r)
    if (!(a in t)) {
      if (a === "children") continue;
      r[a] = ur(e, a, null, r[a], n, l, t);
    }
  for (const a in t) {
    if (a === "children")
      continue;
    const s = t[a];
    r[a] = ur(e, a, s, r[a], n, l, t);
  }
}
function Za(e) {
  return e.toLowerCase().replace(/-([a-z])/g, (t, n) => n.toUpperCase());
}
function cr(e, t, n) {
  const i = t.trim().split(/\s+/);
  for (let r = 0, l = i.length; r < l; r++) e.classList.toggle(i[r], n);
}
function ur(e, t, n, i, r, l, a) {
  let s, c, o, d;
  if (t === "style") return Ga(e, n, i);
  if (t === "classList") return te(e, n, i);
  if (n === i) return i;
  if (t === "ref")
    l || n(e);
  else if (t.slice(0, 3) === "on:") {
    const f = t.slice(3);
    i && e.removeEventListener(f, i, typeof i != "function" && i), n && e.addEventListener(f, n, typeof n != "function" && n);
  } else if (t.slice(0, 10) === "oncapture:") {
    const f = t.slice(10);
    i && e.removeEventListener(f, i, !0), n && e.addEventListener(f, n, !0);
  } else if (t.slice(0, 2) === "on") {
    const f = t.slice(2).toLowerCase(), x = Fa.has(f);
    if (!x && i) {
      const $ = Array.isArray(i) ? i[0] : i;
      e.removeEventListener(f, $);
    }
    (x || n) && (gt(e, f, n, x), x && ye([f]));
  } else if (t.slice(0, 5) === "attr:")
    J(e, t.slice(5), n);
  else if (t.slice(0, 5) === "bool:")
    qa(e, t.slice(5), n);
  else if ((d = t.slice(0, 5) === "prop:") || (o = Ba.has(t)) || (s = e.nodeName.includes("-") || "is" in a))
    d && (t = t.slice(5), c = !0), t === "class" || t === "className" ? Ki(e, n) : s && !c && !o ? e[Za(t)] = n : e[t] = n;
  else {
    const f = t.indexOf(":") > -1 && Ha[t.split(":")[0]];
    f ? Wa(e, f, t, n) : J(e, za[t] || t, n);
  }
  return n;
}
function Xa(e) {
  let t = e.target;
  const n = `$$${e.type}`, i = e.target, r = e.currentTarget, l = (c) => Object.defineProperty(e, "target", {
    configurable: !0,
    value: c
  }), a = () => {
    const c = t[n];
    if (c && !t.disabled) {
      const o = t[`${n}Data`];
      if (o !== void 0 ? c.call(t, o, e) : c.call(t, e), e.cancelBubble) return;
    }
    return t.host && typeof t.host != "string" && !t.host._$host && t.contains(e.target) && l(t.host), !0;
  }, s = () => {
    for (; a() && (t = t._$host || t.parentNode || t.host); ) ;
  };
  if (Object.defineProperty(e, "currentTarget", {
    configurable: !0,
    get() {
      return t || document;
    }
  }), e.composedPath) {
    const c = e.composedPath();
    l(c[0]);
    for (let o = 0; o < c.length - 2 && (t = c[o], !!a()); o++) {
      if (t._$host) {
        t = t._$host, s();
        break;
      }
      if (t.parentNode === r)
        break;
    }
  } else s();
  l(i);
}
function ui(e, t, n, i, r) {
  for (; typeof n == "function"; ) n = n();
  if (t === n) return n;
  const l = typeof t, a = i !== void 0;
  if (e = a && n[0] && n[0].parentNode || e, l === "string" || l === "number") {
    if (l === "number" && (t = t.toString(), t === n))
      return n;
    if (a) {
      let s = n[0];
      s && s.nodeType === 3 ? s.data !== t && (s.data = t) : s = document.createTextNode(t), n = yn(e, n, i, s);
    } else
      n !== "" && typeof n == "string" ? n = e.firstChild.data = t : n = e.textContent = t;
  } else if (t == null || l === "boolean")
    n = yn(e, n, i);
  else {
    if (l === "function")
      return R(() => {
        let s = t();
        for (; typeof s == "function"; ) s = s();
        n = ui(e, s, n, i);
      }), () => n;
    if (Array.isArray(t)) {
      const s = [], c = n && Array.isArray(n);
      if (Di(s, t, n, r))
        return R(() => n = ui(e, s, n, i, !0)), () => n;
      if (s.length === 0) {
        if (n = yn(e, n, i), a) return n;
      } else c ? n.length === 0 ? hr(e, s, i) : Ja(e, n, s) : (n && yn(e), hr(e, s));
      n = s;
    } else if (t.nodeType) {
      if (Array.isArray(n)) {
        if (a) return n = yn(e, n, i, t);
        yn(e, n, null, t);
      } else n == null || n === "" || !e.firstChild ? e.appendChild(t) : e.replaceChild(t, e.firstChild);
      n = t;
    }
  }
  return n;
}
function Di(e, t, n, i) {
  let r = !1;
  for (let l = 0, a = t.length; l < a; l++) {
    let s = t[l], c = n && n[e.length], o;
    if (!(s == null || s === !0 || s === !1)) if ((o = typeof s) == "object" && s.nodeType)
      e.push(s);
    else if (Array.isArray(s))
      r = Di(e, s, c) || r;
    else if (o === "function")
      if (i) {
        for (; typeof s == "function"; ) s = s();
        r = Di(e, Array.isArray(s) ? s : [s], Array.isArray(c) ? c : [c]) || r;
      } else
        e.push(s), r = !0;
    else {
      const d = String(s);
      c && c.nodeType === 3 && c.data === d ? e.push(c) : e.push(document.createTextNode(d));
    }
  }
  return r;
}
function hr(e, t, n = null) {
  for (let i = 0, r = t.length; i < r; i++) e.insertBefore(t[i], n);
}
function yn(e, t, n, i) {
  if (n === void 0) return e.textContent = "";
  const r = i || document.createTextNode("");
  if (t.length) {
    let l = !1;
    for (let a = t.length - 1; a >= 0; a--) {
      const s = t[a];
      if (r !== s) {
        const c = s.parentNode === e;
        !l && !a ? c ? e.replaceChild(r, s) : e.insertBefore(r, n) : c && s.remove();
      } else l = !0;
    }
  } else e.insertBefore(r, n);
  return [r];
}
const es = !1;
var il = /* @__PURE__ */ ((e) => (e[e.CAWI = 1] = "CAWI", e[e.CAPI = 2] = "CAPI", e))(il || {}), rl = /* @__PURE__ */ ((e) => (e[e.OPEN = 1] = "OPEN", e[e.REVIEW = 2] = "REVIEW", e[e.CLOSE = 3] = "CLOSE", e))(rl || {}), ll = /* @__PURE__ */ ((e) => (e[e.INITIAL = 1] = "INITIAL", e[e.ASSIGN = 2] = "ASSIGN", e))(ll || {}), al = /* @__PURE__ */ ((e) => (e[e.ONLINE = 1] = "ONLINE", e[e.OFFLINE = 2] = "OFFLINE", e))(al || {}), ts = /* @__PURE__ */ ((e) => (e[e.TEMPLATE = 1] = "TEMPLATE", e[e.API = 2] = "API", e[e.COMPONENT = 3] = "COMPONENT", e[e.OFFLINE = 4] = "OFFLINE", e))(ts || {}), ns = /* @__PURE__ */ ((e) => (e[e.WARNING = 1] = "WARNING", e[e.ERROR = 2] = "ERROR", e))(ns || {}), is = /* @__PURE__ */ ((e) => (e[e.Section = 1] = "Section", e[e.NestedInput = 2] = "NestedInput", e[e.InnerHTML = 3] = "InnerHTML", e[e.VariableInput = 4] = "VariableInput", e[e.DateInput = 11] = "DateInput", e[e.DateTimeLocalInput = 12] = "DateTimeLocalInput", e[e.TimeInput = 13] = "TimeInput", e[e.MonthInput = 14] = "MonthInput", e[e.WeekInput = 15] = "WeekInput", e[e.SingleCheckInput = 16] = "SingleCheckInput", e[e.ToggleInput = 17] = "ToggleInput", e[e.RangeSliderInput = 18] = "RangeSliderInput", e[e.UrlInput = 19] = "UrlInput", e[e.CurrencyInput = 20] = "CurrencyInput", e[e.ListTextInputRepeat = 21] = "ListTextInputRepeat", e[e.ListSelectInputRepeat = 22] = "ListSelectInputRepeat", e[e.MultipleSelectInput = 23] = "MultipleSelectInput", e[e.MaskingInput = 24] = "MaskingInput", e[e.TextInput = 25] = "TextInput", e[e.RadioInput = 26] = "RadioInput", e[e.SelectInput = 27] = "SelectInput", e[e.NumberInput = 28] = "NumberInput", e[e.CheckboxInput = 29] = "CheckboxInput", e[e.TextAreaInput = 30] = "TextAreaInput", e[e.EmailInput = 31] = "EmailInput", e[e.PhotoInput = 32] = "PhotoInput", e[e.GpsInput = 33] = "GpsInput", e[e.CsvInput = 34] = "CsvInput", e[e.NowInput = 35] = "NowInput", e[e.SignatureInput = 36] = "SignatureInput", e[e.UnitInput = 37] = "UnitInput", e[e.DecimalInput = 38] = "DecimalInput", e))(is || {});
const rs = {
  clientMode: il.CAWI,
  formMode: rl.OPEN,
  initialMode: ll.INITIAL,
  lookupMode: al.ONLINE,
  lookupKey: "keys",
  lookupValue: "values"
}, hi = /* @__PURE__ */ Symbol("store-raw"), kn = /* @__PURE__ */ Symbol("store-node"), qt = /* @__PURE__ */ Symbol("store-has"), sl = /* @__PURE__ */ Symbol("store-self");
function ol(e) {
  let t = e[Tt];
  if (!t && (Object.defineProperty(e, Tt, {
    value: t = new Proxy(e, ss)
  }), !Array.isArray(e))) {
    const n = Object.keys(e), i = Object.getOwnPropertyDescriptors(e);
    for (let r = 0, l = n.length; r < l; r++) {
      const a = n[r];
      i[a].get && Object.defineProperty(e, a, {
        enumerable: i[a].enumerable,
        get: i[a].get.bind(t)
      });
    }
  }
  return t;
}
function $n(e) {
  let t;
  return e != null && typeof e == "object" && (e[Tt] || !(t = Object.getPrototypeOf(e)) || t === Object.prototype || Array.isArray(e));
}
function _n(e, t = /* @__PURE__ */ new Set()) {
  let n, i, r, l;
  if (n = e != null && e[hi]) return n;
  if (!$n(e) || t.has(e)) return e;
  if (Array.isArray(e)) {
    Object.isFrozen(e) ? e = e.slice(0) : t.add(e);
    for (let a = 0, s = e.length; a < s; a++)
      r = e[a], (i = _n(r, t)) !== r && (e[a] = i);
  } else {
    Object.isFrozen(e) ? e = Object.assign({}, e) : t.add(e);
    const a = Object.keys(e), s = Object.getOwnPropertyDescriptors(e);
    for (let c = 0, o = a.length; c < o; c++)
      l = a[c], !s[l].get && (r = e[l], (i = _n(r, t)) !== r && (e[l] = i));
  }
  return e;
}
function gi(e, t) {
  let n = e[t];
  return n || Object.defineProperty(e, t, {
    value: n = /* @__PURE__ */ Object.create(null)
  }), n;
}
function Tn(e, t, n) {
  if (e[t]) return e[t];
  const [i, r] = K(n, {
    equals: !1,
    internal: !0
  });
  return i.$ = r, e[t] = i;
}
function ls(e, t) {
  const n = Reflect.getOwnPropertyDescriptor(e, t);
  return !n || n.get || !n.configurable || t === Tt || t === kn || (delete n.value, delete n.writable, n.get = () => e[Tt][t]), n;
}
function dl(e) {
  Vi() && Tn(gi(e, kn), sl)();
}
function as(e) {
  return dl(e), Reflect.ownKeys(e);
}
const ss = {
  get(e, t, n) {
    if (t === hi) return e;
    if (t === Tt) return n;
    if (t === Ri)
      return dl(e), n;
    const i = gi(e, kn), r = i[t];
    let l = r ? r() : e[t];
    if (t === kn || t === qt || t === "__proto__") return l;
    if (!r) {
      const a = Object.getOwnPropertyDescriptor(e, t);
      Vi() && (typeof l != "function" || e.hasOwnProperty(t)) && !(a && a.get) && (l = Tn(i, t, l)());
    }
    return $n(l) ? ol(l) : l;
  },
  has(e, t) {
    return t === hi || t === Tt || t === Ri || t === kn || t === qt || t === "__proto__" ? !0 : (Vi() && Tn(gi(e, qt), t)(), t in e);
  },
  set() {
    return !0;
  },
  deleteProperty() {
    return !0;
  },
  ownKeys: as,
  getOwnPropertyDescriptor: ls
};
function Sn(e, t, n, i = !1) {
  if (!i && e[t] === n) return;
  const r = e[t], l = e.length;
  n === void 0 ? (delete e[t], e[qt] && e[qt][t] && r !== void 0 && e[qt][t].$()) : (e[t] = n, e[qt] && e[qt][t] && r === void 0 && e[qt][t].$());
  let a = gi(e, kn), s;
  if ((s = Tn(a, t, r)) && s.$(() => n), Array.isArray(e) && e.length !== l) {
    for (let c = e.length; c < l; c++) (s = a[c]) && s.$();
    (s = Tn(a, "length", l)) && s.$(e.length);
  }
  (s = a[sl]) && s.$();
}
function cl(e, t) {
  const n = Object.keys(t);
  for (let i = 0; i < n.length; i += 1) {
    const r = n[i];
    Sn(e, r, t[r]);
  }
}
function os(e, t) {
  if (typeof t == "function" && (t = t(e)), t = _n(t), Array.isArray(t)) {
    if (e === t) return;
    let n = 0, i = t.length;
    for (; n < i; n++) {
      const r = t[n];
      e[n] !== r && Sn(e, n, r);
    }
    Sn(e, "length", i);
  } else cl(e, t);
}
function Nn(e, t, n = []) {
  let i, r = e;
  if (t.length > 1) {
    i = t.shift();
    const a = typeof i, s = Array.isArray(e);
    if (Array.isArray(i)) {
      for (let c = 0; c < i.length; c++)
        Nn(e, [i[c]].concat(t), n);
      return;
    } else if (s && a === "function") {
      for (let c = 0; c < e.length; c++)
        i(e[c], c) && Nn(e, [c].concat(t), n);
      return;
    } else if (s && a === "object") {
      const {
        from: c = 0,
        to: o = e.length - 1,
        by: d = 1
      } = i;
      for (let f = c; f <= o; f += d)
        Nn(e, [f].concat(t), n);
      return;
    } else if (t.length > 1) {
      Nn(e[i], t, [i].concat(n));
      return;
    }
    r = e[i], n = [i].concat(n);
  }
  let l = t[0];
  typeof l == "function" && (l = l(r, n), l === r) || i === void 0 && l == null || (l = _n(l), i === void 0 || $n(r) && $n(l) && !Array.isArray(l) ? cl(r, l) : Sn(e, i, l));
}
function Bi(...[e, t]) {
  const n = _n(e || {}), i = Array.isArray(n), r = ol(n);
  function l(...a) {
    Ni(() => {
      i && a.length === 1 ? os(n, a[0]) : Nn(n, a);
    });
  }
  return [r, l];
}
const fi = /* @__PURE__ */ new WeakMap(), ul = {
  get(e, t) {
    if (t === hi) return e;
    const n = e[t];
    let i;
    return $n(n) ? fi.get(n) || (fi.set(n, i = new Proxy(n, ul)), i) : n;
  },
  set(e, t, n) {
    return Sn(e, t, _n(n)), !0;
  },
  deleteProperty(e, t) {
    return Sn(e, t, void 0, !0), !0;
  }
};
function gr(e) {
  return (t) => {
    if ($n(t)) {
      let n;
      (n = fi.get(t)) || fi.set(t, n = new Proxy(t, ul)), e(n);
    }
    return t;
  };
}
const hl = Pn();
function ds(e) {
  const [t, n] = Bi({
    activeComponent: {
      dataKey: "",
      label: "",
      index: [],
      position: 0
    }
  });
  let i = [t, {
    setActiveComponent(r) {
      n("activeComponent", r);
    }
  }];
  return m(hl.Provider, {
    value: i,
    get children() {
      return e.children;
    }
  });
}
function gl() {
  return Kn(hl);
}
const fl = Pn(), cs = (e) => m(fl.Provider, {
  get value() {
    return e.stores;
  },
  get children() {
    return e.children;
  }
});
function pt() {
  const e = Kn(fl);
  if (!e)
    throw new Error("useStores must be used within a StoreProvider. Make sure your component is wrapped with <StoreProvider stores={...}>.");
  return e;
}
function It() {
  return pt().reference;
}
function vl() {
  return pt().response;
}
function ml() {
  return pt().template;
}
function bl() {
  return pt().media;
}
function wl() {
  return pt().remark;
}
function zi() {
  return pt().sidebar;
}
function Et() {
  return pt().locale;
}
function xl() {
  return pt().summary;
}
function yl() {
  return pt().counter;
}
function pl() {
  return pt().note;
}
function kl() {
  return pt().principal;
}
function us() {
  return pt().referenceHistoryEnable;
}
function $l() {
  return pt().referenceEnableFalse;
}
var be = /* @__PURE__ */ ((e) => (e[e.SECTION = 1] = "SECTION", e[e.NESTED = 2] = "NESTED", e[e.INNER_HTML = 3] = "INNER_HTML", e[e.VARIABLE = 4] = "VARIABLE", e[e.DATE = 11] = "DATE", e[e.DATETIME = 12] = "DATETIME", e[e.TIME = 13] = "TIME", e[e.MONTH = 14] = "MONTH", e[e.WEEK = 15] = "WEEK", e[e.SINGLE_CHECK = 16] = "SINGLE_CHECK", e[e.TOGGLE = 17] = "TOGGLE", e[e.RANGE_SLIDER = 18] = "RANGE_SLIDER", e[e.URL = 19] = "URL", e[e.CURRENCY = 20] = "CURRENCY", e[e.LIST_TEXT_REPEAT = 21] = "LIST_TEXT_REPEAT", e[e.LIST_SELECT_REPEAT = 22] = "LIST_SELECT_REPEAT", e[e.MULTIPLE_SELECT = 23] = "MULTIPLE_SELECT", e[e.MASKING = 24] = "MASKING", e[e.TEXT = 25] = "TEXT", e[e.RADIO = 26] = "RADIO", e[e.SELECT = 27] = "SELECT", e[e.NUMBER = 28] = "NUMBER", e[e.CHECKBOX = 29] = "CHECKBOX", e[e.TEXTAREA = 30] = "TEXTAREA", e[e.EMAIL = 31] = "EMAIL", e[e.PHOTO = 32] = "PHOTO", e[e.GPS = 33] = "GPS", e[e.CSV = 34] = "CSV", e[e.NOW = 35] = "NOW", e[e.SIGNATURE = 36] = "SIGNATURE", e[e.UNIT = 37] = "UNIT", e[e.DECIMAL = 38] = "DECIMAL", e))(be || {}), Ue = /* @__PURE__ */ ((e) => (e[e.VALID = 0] = "VALID", e[e.WARNING = 1] = "WARNING", e[e.ERROR = 2] = "ERROR", e))(Ue || {}), Mt = /* @__PURE__ */ ((e) => (e[e.CAWI = 1] = "CAWI", e[e.CAPI = 2] = "CAPI", e[e.PAPI = 3] = "PAPI", e))(Mt || {});
const ht = {
  /**
   * Email validation pattern
   * Supports standard email format with TLD
   */
  EMAIL: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  /**
   * Nested dataKey separator
   */
  NESTED_SEPARATOR: "#"
}, hs = {
  /** Default enable condition result */
  ENABLE_CONDITION: !0
};
new Set(
  Object.values(be).filter(
    (e) => typeof e == "number" && e > 4
  )
);
var gs = /* @__PURE__ */ k('<div><div class="grid md:grid-cols-12 dark:border-gray-200/[.10] p-2"><div class="font-light text-sm pb-2.5 px-2 col-start-2 col-end-12 space-y-4 transition-all delay-100">'), fr = /* @__PURE__ */ k('<input type=text class="w-full font-light cursor-pointer px-4 py-2.5 text-sm text-gray-700 bg-blue-50 bg-clip-padding dark:bg-gray-300 border border-solid border-blue-100 rounded-full rounded-tl-none transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"disabled>'), fs = /* @__PURE__ */ k('<div class="grid grid-cols-12 "><div class="col-span-10 mr-2 "></div><div class="col-span-2 -ml-12 space-x-1 flex justify-evenly -z-0"><button class="bg-blue-800 hover:bg-blue-700 text-white text-justify justify-center text-xs w-full py-2 rounded-tl-none rounded-full focus:outline-none group inline-flex items-center">&nbsp;&nbsp;<svg xmlns=http://www.w3.org/2000/svg class="h-4 w-5"viewBox="0 0 20 20"fill=currentColor><path fill-rule=evenodd d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"clip-rule=evenodd>');
const _l = (e) => {
  const [t] = It(), n = e.config, [i] = K(n.formMode > 1 ? "VIEW" : "ENTRY");
  let r = Ee(() => String(t.details.findIndex((s) => s.dataKey === e.component.sourceQuestion))), l = Ee(() => {
    let s = [];
    if (e.component.sourceQuestion !== "") {
      const c = t.details.findIndex((o) => o.dataKey === e.component.sourceQuestion);
      if (c !== -1 && t.details[c])
        if (typeof t.details[c].answer == "object") {
          const o = t.details[c].answer;
          if (s = o == null || o === "" ? [] : o, t.details[c].type === be.LIST_TEXT_REPEAT || t.details[c].type === be.LIST_SELECT_REPEAT) {
            let d = JSON.parse(JSON.stringify(s));
            d.splice(0, 1), s = d;
          }
          s = s.map((d) => {
            var f, x;
            return Ct(Ae({}, d), {
              label: (x = (f = d.label) != null ? f : d.value) != null ? x : ""
            });
          });
        } else {
          const o = t.details[c].answer == "" ? 0 : t.details[c].answer;
          let d = [];
          for (let f = 1; f <= Number(o); f++)
            d.push({
              value: f,
              label: String(f)
            });
          s = d;
        }
    }
    return s;
  }), a = (s) => {
    e.onUserClick(e.component.dataKey + "#" + s);
  };
  return (() => {
    var s = gs(), c = s.firstChild, o = c.firstChild;
    return _(o, m(fe, {
      get each() {
        return l();
      },
      children: (d, f) => (() => {
        var x = fs(), $ = x.firstChild, C = $.nextSibling, g = C.firstChild, u = g.firstChild, b = u.nextSibling;
        return x.$$click = (y) => a(d.value), _($, m(we, {
          get children() {
            return [m(ee, {
              get when() {
                return t.details[r()].type === be.NUMBER || t.details[r()].type === be.VARIABLE && t.details[r()].renderType === 1 || t.details[r()].type === be.TEXT;
              },
              get children() {
                var y = fr();
                return R(() => y.value = e.component.label + "  ____ # " + d.label), y;
              }
            }), m(ee, {
              get when() {
                return t.details[r()].type !== 28;
              },
              get children() {
                var y = fr();
                return R(() => y.value = d.label), y;
              }
            })];
          }
        })), g.$$click = (y) => a(d.value), _(g, i, b), R(() => J(g, "id", `nestedButton-${e.component.dataKey}-${f()}`)), x;
      })()
    })), R((d) => te(c, {
      "border-b border-gray-300/[.40]": l().length > 0
    }, d)), s;
  })();
};
ye(["click"]);
var vs = /* @__PURE__ */ k("<span class=text-pink-600>*"), ms = /* @__PURE__ */ k('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), bs = /* @__PURE__ */ k('<div class="italic text-xs font-extralight text-zinc-400 ">'), ws = /* @__PURE__ */ k('<span class="absolute top-0 right-0 inline-flex items-center justify-center h-6 w-6 text-xs font-semibold text-white transform translate-x-1/2 -translate-y-1/4 bg-pink-600/80 rounded-full">'), xs = /* @__PURE__ */ k('<div class=" flex justify-end "><button class="relative inline-block bg-white p-2 h-10 w-10 text-gray-500 rounded-full hover:bg-yellow-100 hover:text-yellow-400 hover:border-yellow-100 border-2 border-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z">'), ys = /* @__PURE__ */ k('<div class="grid md:grid-cols-3 border-b border-gray-300/[.50] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm space-x-2 py-2.5 px-2 md:col-span-2 grid grid-cols-12"><div class><div class=cursor-pointer><div class="grid font-light text-sm col-span-2 content-start">'), ps = /* @__PURE__ */ k('<div class=flex-1><input type=text class="w-full font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400">'), ks = /* @__PURE__ */ k("<div class=flex-1>"), $s = /* @__PURE__ */ k('<div class="font-light text-sm py-2.5 px-4 flex items-start gap-2 cursor-pointer"><label class="cursor-pointer text-sm shrink-0 mt-0.5"><input type=radio class="checked:disabled:bg-gray-500 checked:dark:disabled:bg-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400">'), _s = /* @__PURE__ */ k('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), Ss = /* @__PURE__ */ k('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Cs = /* @__PURE__ */ k('<div class="text-xs font-light mt-1"><div class="grid grid-cols-12"><div class="col-span-11 text-justify mr-1">');
const Ms = (e) => {
  const [t] = It(), n = e.config, [i] = K(n.formMode > 1 ? !0 : e.component.disableInput);
  let r = e.value && e.value.length > 0 ? e.value[0].value : e.value, l = (C, g) => {
    let u = JSON.parse(JSON.stringify(e.value));
    u = [], u.push({
      value: C,
      label: g
    }), e.onValueChange(u);
  }, a = (C) => {
    let g = `radio-${e.component.dataKey}-${C}`;
    document.getElementById(g).click();
  }, s = Ee(() => {
    if (e.component.sourceOption !== void 0 && e.component.typeOption === 3) {
      let C = e.component.sourceOption.split("@");
      const g = t.details.findIndex((u) => u.dataKey === C[0]);
      return t.details[g].type, t.details[g].answer;
    }
    return [];
  });
  const [c] = K(e.component.sourceOption !== void 0 ? s() : e.component.options), [o, d] = K(!1), f = () => {
    o() ? d(!1) : d(!0);
  }, [x] = K(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [$] = K(n.formMode > 2 && e.comments == 0);
  return (() => {
    var C = ys(), g = C.firstChild, u = g.firstChild, b = u.firstChild, y = u.nextSibling, S = g.nextSibling, p = S.firstChild, L = p.firstChild, V = L.firstChild;
    return _(u, m(j, {
      get when() {
        return e.component.required;
      },
      get children() {
        return vs();
      }
    }), null), _(u, m(j, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var v = ms();
        return v.$$click = f, v;
      }
    }), null), _(y, m(j, {
      get when() {
        return o();
      },
      get children() {
        var v = bs();
        return R(() => v.innerHTML = e.component.hint), v;
      }
    })), _(V, m(fe, {
      get each() {
        return c();
      },
      children: (v, h) => (() => {
        var w = $s(), E = w.firstChild, I = E.firstChild;
        return w.$$click = () => a(h()), I.addEventListener("change", (M) => l(M.currentTarget.value, v.label)), _(w, m(we, {
          get children() {
            return [m(ee, {
              get when() {
                return ue(() => !!v.open)() && r === v.value;
              },
              get children() {
                var M = ps(), O = M.firstChild;
                return O.addEventListener("change", (N) => l(v.value, N.currentTarget.value)), R((N) => {
                  var T = e.component.dataKey, A = e.component.dataKey, z = i();
                  return T !== N.e && J(O, "name", N.e = T), A !== N.t && J(O, "id", N.t = A), z !== N.a && (O.disabled = N.a = z), N;
                }, {
                  e: void 0,
                  t: void 0,
                  a: void 0
                }), R(() => O.value = e.value && e.value.length > 0 ? e.value[0].label : v.label), M;
              }
            }), m(ee, {
              get when() {
                return !v.open || r !== v.value;
              },
              get children() {
                var M = ks();
                return R(() => M.innerHTML = v.label), M;
              }
            })];
          }
        }), null), R((M) => {
          var O = e.component.dataKey + h(), N = e.component.dataKey, T = "radio-" + e.component.dataKey + "-" + h(), A = i();
          return O !== M.e && J(E, "for", M.e = O), N !== M.t && J(I, "name", M.t = N), T !== M.a && J(I, "id", M.a = T), A !== M.o && (I.disabled = M.o = A), M;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0
        }), R(() => I.checked = r === v.value), R(() => I.value = v.value), w;
      })()
    })), _(p, m(j, {
      get when() {
        var v;
        return ((v = e.validationMessage) == null ? void 0 : v.length) > 0;
      },
      get children() {
        return m(fe, {
          get each() {
            return e.validationMessage;
          },
          children: (v) => (() => {
            var h = Cs(), w = h.firstChild, E = w.firstChild;
            return _(w, m(we, {
              get children() {
                return [m(ee, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return _s();
                  }
                }), m(ee, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return Ss();
                  }
                })];
              }
            }), E), E.innerHTML = v, R((I) => te(w, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, I)), h;
          })()
        });
      }
    }), null), _(S, m(j, {
      get when() {
        return x();
      },
      get children() {
        var v = xs(), h = v.firstChild;
        return h.firstChild, h.$$click = (w) => e.openRemark(e.component.dataKey), _(h, m(j, {
          get when() {
            return ue(() => !!e.comments)() && e.comments > 0;
          },
          get children() {
            var w = ws();
            return _(w, () => e.comments), w;
          }
        }), null), R(() => h.disabled = $()), v;
      }
    }), null), R((v) => {
      var h = e.component.label, w = {
        "col-span-11 lg:-mr-4": x(),
        "col-span-12": !x()
      }, E = {
        " border-b border-orange-500 pb-3 ": e.classValidation === 1,
        " border-b border-pink-600 pb-3 ": e.classValidation === 2
      }, I = e.component.cols === 1 || e.component.cols === void 0, M = e.component.cols === 2, O = e.component.cols === 3, N = e.component.cols === 4, T = e.component.cols === 5;
      return h !== v.e && (b.innerHTML = v.e = h), v.t = te(p, w, v.t), v.a = te(L, E, v.a), I !== v.o && V.classList.toggle("grid-cols-1", v.o = I), M !== v.i && V.classList.toggle("grid-cols-2", v.i = M), O !== v.n && V.classList.toggle("grid-cols-3", v.n = O), N !== v.s && V.classList.toggle("grid-cols-4", v.s = N), T !== v.h && V.classList.toggle("grid-cols-5", v.h = T), v;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0,
      n: void 0,
      s: void 0,
      h: void 0
    }), C;
  })();
};
ye(["click"]);
var Is = /* @__PURE__ */ k("<span class=text-pink-600>*"), Es = /* @__PURE__ */ k('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Os = /* @__PURE__ */ k('<div class="italic text-xs font-extralight text-zinc-400 ">'), vr = /* @__PURE__ */ k('<input type=text class="w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"placeholder>'), Ls = /* @__PURE__ */ k('<span class="absolute top-0 right-0 inline-flex items-center justify-center h-6 w-6 text-xs font-semibold text-white transform translate-x-1/2 -translate-y-1/4 bg-pink-600/80 rounded-full">'), As = /* @__PURE__ */ k('<div class=shrink-0><button class="relative inline-block bg-white p-2 h-10 w-10 text-gray-500 rounded-full hover:bg-yellow-100 hover:text-yellow-400 hover:border-yellow-100 border-2 border-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z">'), Rs = /* @__PURE__ */ k('<div class="grid md:grid-cols-3 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 md:col-span-2 flex items-start gap-2"><div class=flex-1>'), Ns = /* @__PURE__ */ k('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), Vs = /* @__PURE__ */ k('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Ts = /* @__PURE__ */ k('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="flex-1 text-justify">');
const js = (e) => {
  const t = e.config, [n] = K(t.formMode > 1 && t.initialMode == 2 ? !0 : t.initialMode == 1 && e.component.disableInitial !== void 0 ? e.component.disableInitial : e.component.disableInput), [i, r] = K(!1), l = () => {
    i() ? r(!1) : r(!0);
  }, [a] = K(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [s] = K(t.formMode > 2 && e.comments == 0);
  return (() => {
    var c = Rs(), o = c.firstChild, d = o.firstChild, f = d.firstChild, x = d.nextSibling, $ = o.nextSibling, C = $.firstChild;
    return _(d, m(j, {
      get when() {
        return e.component.required;
      },
      get children() {
        return Is();
      }
    }), null), _(d, m(j, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var g = Es();
        return g.$$click = l, g;
      }
    }), null), _(x, m(j, {
      get when() {
        return i();
      },
      get children() {
        var g = Os();
        return R(() => g.innerHTML = e.component.hint), g;
      }
    })), _(C, m(j, {
      get when() {
        return e.component.lengthInput === void 0;
      },
      get children() {
        var g = vr();
        return g.addEventListener("change", (u) => {
          e.onValueChange(u.currentTarget.value);
        }), R((u) => {
          var b = e.component.dataKey, y = {
            " border border-solid border-gray-300 ": e.classValidation === 0,
            " border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
            " border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
          }, S = n();
          return b !== u.e && J(g, "name", u.e = b), u.t = te(g, y, u.t), S !== u.a && (g.disabled = u.a = S), u;
        }, {
          e: void 0,
          t: void 0,
          a: void 0
        }), R(() => g.value = e.value), g;
      }
    }), null), _(C, m(j, {
      get when() {
        return ue(() => e.component.lengthInput !== void 0)() && e.component.lengthInput.length > 0;
      },
      get children() {
        var g = vr();
        return g.addEventListener("change", (u) => {
          e.onValueChange(u.currentTarget.value);
        }), R((u) => {
          var b = e.component.dataKey, y = {
            " border border-solid border-gray-300 ": e.classValidation === 0,
            " border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
            " border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
          }, S = n(), p = e.component.lengthInput[0].maxlength !== void 0 ? e.component.lengthInput[0].maxlength : "", L = e.component.lengthInput[0].minlength !== void 0 ? e.component.lengthInput[0].minlength : "";
          return b !== u.e && J(g, "name", u.e = b), u.t = te(g, y, u.t), S !== u.a && (g.disabled = u.a = S), p !== u.o && J(g, "maxlength", u.o = p), L !== u.i && J(g, "minlength", u.i = L), u;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0,
          i: void 0
        }), R(() => g.value = e.value), g;
      }
    }), null), _(C, m(j, {
      get when() {
        var g;
        return ((g = e.validationMessage) == null ? void 0 : g.length) > 0;
      },
      get children() {
        return m(fe, {
          get each() {
            return e.validationMessage;
          },
          children: (g) => (() => {
            var u = Ts(), b = u.firstChild, y = b.firstChild;
            return _(b, m(we, {
              get children() {
                return [m(ee, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return Ns();
                  }
                }), m(ee, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return Vs();
                  }
                })];
              }
            }), y), y.innerHTML = g, R((S) => te(b, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, S)), u;
          })()
        });
      }
    }), null), _($, m(j, {
      get when() {
        return a();
      },
      get children() {
        var g = As(), u = g.firstChild;
        return u.firstChild, u.$$click = (b) => e.openRemark(e.component.dataKey), _(u, m(j, {
          get when() {
            return ue(() => !!e.comments)() && e.comments > 0;
          },
          get children() {
            var b = Ls();
            return _(b, () => e.comments), b;
          }
        }), null), R(() => u.disabled = s()), g;
      }
    }), null), R(() => f.innerHTML = e.component.label), c;
  })();
};
ye(["click"]);
const Ds = (e) => {
  const t = jt({
    multiple: !1,
    disabled: !1,
    optionToValue: (B) => B,
    isOptionDisabled: (B) => !1
  }, e), n = (B) => {
    if (t.multiple && Array.isArray(B))
      return B;
    if (!t.multiple && !Array.isArray(B))
      return B !== null ? [B] : [];
    throw new Error(`Incompatible value type for ${t.multiple ? "multple" : "single"} select.`);
  }, [i, r] = K(t.initialValue ? n(t.initialValue) : []), l = () => t.multiple ? i() : i()[0] || null, a = (B) => r(n(B)), s = () => r([]), c = () => !!(t.multiple ? l().length : l());
  Me(un(i, () => {
    var B;
    return (B = t.onChange) == null ? void 0 : B.call(t, l());
  }, {
    defer: !0
  }));
  const [o, d] = K(""), f = () => d("");
  Me(un(o, (B) => {
    var F;
    return (F = t.onInput) == null ? void 0 : F.call(t, B);
  }, {
    defer: !0
  })), Me(un(o, (B) => {
    B && !S() && L();
  }, {
    defer: !0
  }));
  const x = typeof t.options == "function" ? Ee(() => t.options(o()), t.options(o())) : () => t.options, $ = () => x().length, C = (B) => {
    if (t.isOptionDisabled(B)) return;
    const F = t.optionToValue(B);
    t.multiple ? a([...i(), F]) : (a(F), y()), V();
  }, [g, u] = K(!1), b = () => u(!1), y = () => u(!0), [S, p] = K(!1), L = () => p(!0), V = () => p(!1), v = () => p(!S()), h = () => t.disabled, [w, E] = K(-1), I = () => x()[w()], M = (B) => B === I(), O = (B) => {
    $() || E(-1);
    const F = $() - 1, U = B === "next" ? 1 : -1;
    let H = w() + U;
    H > F && (H = 0), H < 0 && (H = F), E(H);
  }, N = () => O("previous"), T = () => O("next");
  Me(un(x, (B) => {
    S() && E(Math.min(0, B.length - 1));
  }, {
    defer: !0
  })), Me(un(h, (B) => {
    B && S() && V();
  })), Me(un(S, (B) => {
    B ? (w() === -1 && T(), b()) : (w() > -1 && E(-1), f());
  }, {
    defer: !0
  })), Me(un(w, (B) => {
    B > -1 && !S() && L();
  }, {
    defer: !0
  }));
  const A = {
    containerRef: null,
    inputRef: null,
    listRef: null
  }, z = (B) => {
    A.containerRef = B, B.getAttribute("tabIndex") || (B.tabIndex = -1), B.addEventListener("focusin", () => {
      b();
    }), B.addEventListener("focusout", (F) => {
      const U = F.relatedTarget;
      for (const H of Object.values(A))
        if (H != null && H.contains(U)) {
          F.preventDefault(), F.stopPropagation();
          return;
        }
      V();
    }), B.addEventListener("pointerdown", (F) => {
      A.inputRef && F.target !== A.inputRef && F.preventDefault();
    }), B.addEventListener("click", (F) => {
      (!A.listRef || !A.listRef.contains(F.target)) && (A.inputRef && A.inputRef.focus(), v());
    });
  }, D = (B) => {
    A.inputRef = B, B.getAttribute("tabIndex") || (B.tabIndex = -1), R(() => B.value = o()), B.addEventListener("input", (F) => {
      d(F.target.value);
    }), R(() => {
      B.style.setProperty("opacity", g() ? "0" : "1");
    }), B.addEventListener("focus", (F) => {
      t.onFocus && t.onFocus(F);
    }), B.addEventListener("blur", (F) => {
      t.onBlur && t.onBlur(F);
    }), B.addEventListener("keydown", (F) => {
      switch (F.key) {
        case "ArrowDown":
          T();
          break;
        case "ArrowUp":
          N();
          break;
        case "Enter":
          if (S() && I()) {
            C(I());
            break;
          }
          return;
        case "Escape":
          if (S()) {
            V();
            break;
          }
          return;
        case "Delete":
        case "Backspace":
          if (o())
            return;
          if (t.multiple) {
            const U = l();
            a([...U.slice(0, -1)]);
          } else
            s();
          break;
        case " ":
          if (o())
            return;
          S() ? I() && C(I()) : L();
          break;
        case "Tab":
          if (I() && S()) {
            C(I());
            break;
          }
          return;
        default:
          return;
      }
      F.preventDefault(), F.stopPropagation();
    });
  }, P = (B) => {
    A.listRef = B, B.getAttribute("tabIndex") || (B.tabIndex = -1), B.addEventListener("pointerdown", (F) => {
      F.preventDefault(), F.stopPropagation();
    });
  };
  return {
    get value() {
      return l();
    },
    get hasValue() {
      return c();
    },
    setValue: a,
    get options() {
      return x();
    },
    get inputValue() {
      return o();
    },
    get isOpen() {
      return S();
    },
    multiple: t.multiple,
    get disabled() {
      return h();
    },
    pickOption: C,
    isOptionFocused: M,
    isOptionDisabled: t.isOptionDisabled,
    containerRef: z,
    inputRef: D,
    listRef: P
  };
};
var Ps = /* @__PURE__ */ k("<mark>");
const pn = {
  NO_MATCH: 0,
  MATCH: 1,
  WORD_START: 2,
  START: 3
}, Ks = (e, t) => {
  let n = pn.NO_MATCH, i = [];
  if (e.length <= t.length) {
    const r = Array.from(e.toLocaleLowerCase()), l = Array.from(t.toLocaleLowerCase());
    let a = pn.START;
    e: for (let s = 0, c = 0; s < r.length; s++) {
      for (; c < l.length; )
        if (l[c] === r[s]) {
          i[c] = !0, a === pn.MATCH && l[c - 1] === " " && l[c] !== " " && (a = pn.WORD_START), n += a, a++, c++;
          continue e;
        } else
          a = pn.MATCH, c++;
      n = pn.NO_MATCH, i.length = 0;
    }
  }
  return {
    target: t,
    score: n,
    matches: i
  };
}, Bs = (e, t = (n) => (() => {
  var i = Ps();
  return _(i, n), i;
})()) => {
  const n = e.target, i = e.matches, r = "\0", l = [];
  let a = !1;
  for (let s = 0; s < n.length; s++) {
    const c = n[s], o = i[s];
    !a && o ? (l.push(r), a = !0) : a && !o && (l.push(r), a = !1), l.push(c);
  }
  return a && (l.push(r), a = !1), ue(() => l.join("").split(r).map((s, c) => c % 2 ? t(s) : s));
}, zs = (e, t, n) => {
  const i = [];
  for (let r = 0; r < t.length; r++) {
    const l = t[r], a = l[n], s = Ks(e, a);
    s.score && i.push(Ct(Ae({}, s), {
      item: l,
      index: r
    }));
  }
  return i.sort((r, l) => {
    let a = l.score - r.score;
    return a === 0 && (a = r.index - l.index), a;
  }), i;
};
var Fs = /* @__PURE__ */ k("<mark>");
const Cn = (e, t) => {
  const n = Object.assign({
    filterable: !0,
    disable: () => !1
  }, t || {}), i = (c) => (n == null ? void 0 : n.key) !== void 0 ? c[n.key] : c;
  return {
    options: (c) => {
      let d = (typeof e == "function" ? e(c) : e).map((f) => ({
        label: i(f),
        value: f,
        disabled: n.disable(f)
      }));
      if (n.filterable && c && (d = zs(c, d, "label").map((f) => Ct(Ae({}, f.item), {
        label: Bs(f)
      }))), n.createable !== void 0) {
        const f = c.trim(), x = d.some(($) => Hs(c, i($.value)));
        if (f && !x) {
          let $;
          typeof n.createable == "function" ? $ = n.createable(f) : $ = n.key ? {
            [n.key]: f
          } : f;
          const C = {
            label: ["Create ", (() => {
              var g = Fs();
              return _(g, () => i($)), g;
            })()],
            value: $,
            disabled: !1
          };
          d = [...d, C];
        }
      }
      return d;
    },
    optionToValue: (c) => c.value,
    isOptionDisabled: (c) => c.disabled,
    format: (c, o) => o === "option" ? c.label : i(c)
  };
}, Hs = (e, t) => e.localeCompare(t, void 0, {
  sensitivity: "base"
}) === 0;
var Js = /* @__PURE__ */ k("<div>"), Us = /* @__PURE__ */ k("<div class=solid-select-control>"), Ws = /* @__PURE__ */ k("<div class=solid-select-placeholder>"), qs = /* @__PURE__ */ k("<div class=solid-select-single-value>"), Gs = /* @__PURE__ */ k("<div class=solid-select-multi-value><button type=button class=solid-select-multi-value-remove>⨯"), Ys = /* @__PURE__ */ k("<input class=solid-select-input type=text tabindex=0 autocomplete=off autocapitalize=none size=1>"), Qs = /* @__PURE__ */ k("<div class=solid-select-list>"), Zs = /* @__PURE__ */ k("<div class=solid-select-option>");
const Mn = (e) => {
  const [t, n] = tl(jt({
    format: (r, l) => r,
    placeholder: "Select...",
    readonly: typeof e.options != "function"
  }, e), ["options", "optionToValue", "isOptionDisabled", "initialValue", "multiple", "disabled", "onInput", "onChange", "onBlur"]), i = Ds(t);
  return m(Xs, {
    get class() {
      return n.class;
    },
    ref(r) {
      var l = i.containerRef;
      typeof l == "function" ? l(r) : i.containerRef = r;
    },
    get disabled() {
      return i.disabled;
    },
    get children() {
      return [m(eo, {
        get format() {
          return n.format;
        },
        get placeholder() {
          return n.placeholder;
        },
        get id() {
          return n.id;
        },
        get name() {
          return n.name;
        },
        get autofocus() {
          return n.autofocus;
        },
        get readonly() {
          return n.readonly;
        },
        get disabled() {
          return i.disabled;
        },
        get value() {
          return i.value;
        },
        get hasValue() {
          return i.hasValue;
        },
        get setValue() {
          return i.setValue;
        },
        get inputValue() {
          return i.inputValue;
        },
        get inputRef() {
          return i.inputRef;
        },
        get multiple() {
          return i.multiple;
        }
      }), m(lo, {
        ref(r) {
          var l = i.listRef;
          typeof l == "function" ? l(r) : i.listRef = r;
        },
        get isOpen() {
          return i.isOpen;
        },
        get options() {
          return i.options;
        },
        children: (r) => m(ao, {
          get isDisabled() {
            return i.isOptionDisabled(r);
          },
          get isFocused() {
            return i.isOptionFocused(r);
          },
          get pickOption() {
            return [i.pickOption, r];
          },
          get children() {
            return n.format(r, "option");
          }
        })
      })];
    }
  });
}, Xs = (e) => (() => {
  var t = Js(), n = e.ref;
  return typeof n == "function" ? en(n, t) : e.ref = t, _(t, () => e.children), R((i) => {
    var r = `solid-select-container ${e.class !== void 0 ? e.class : ""}`, l = e.disabled;
    return r !== i.e && Ki(t, i.e = r), l !== i.t && J(t, "data-disabled", i.t = l), i;
  }, {
    e: void 0,
    t: void 0
  }), t;
})(), eo = (e) => {
  const t = (n) => {
    const i = e.value;
    e.setValue([...i.slice(0, n), ...i.slice(n + 1)]);
  };
  return (() => {
    var n = Us();
    return _(n, m(j, {
      get when() {
        return ue(() => !e.hasValue)() && !e.inputValue;
      },
      get children() {
        return m(to, {
          get children() {
            return e.placeholder;
          }
        });
      }
    }), null), _(n, m(j, {
      get when() {
        return ue(() => !!(e.hasValue && !e.multiple))() && !e.inputValue;
      },
      get children() {
        return m(no, {
          get children() {
            return e.format(e.value, "value");
          }
        });
      }
    }), null), _(n, m(j, {
      get when() {
        return ue(() => !!e.hasValue)() && e.multiple;
      },
      get children() {
        return m(fe, {
          get each() {
            return e.value;
          },
          children: (i, r) => m(io, {
            onRemove: () => t(r()),
            get children() {
              return e.format(i, "value");
            }
          })
        });
      }
    }), null), _(n, m(ro, {
      ref(i) {
        var r = e.inputRef;
        typeof r == "function" ? r(i) : e.inputRef = i;
      },
      get id() {
        return e.id;
      },
      get name() {
        return e.name;
      },
      get autofocus() {
        return e.autofocus;
      },
      get disabled() {
        return e.disabled;
      },
      get readonly() {
        return e.readonly;
      }
    }), null), R((i) => {
      var r = e.multiple, l = e.hasValue, a = e.disabled;
      return r !== i.e && J(n, "data-multiple", i.e = r), l !== i.t && J(n, "data-has-value", i.t = l), a !== i.a && J(n, "data-disabled", i.a = a), i;
    }, {
      e: void 0,
      t: void 0,
      a: void 0
    }), n;
  })();
}, to = (e) => (() => {
  var t = Ws();
  return _(t, () => e.children), t;
})(), no = (e) => (() => {
  var t = qs();
  return _(t, () => e.children), t;
})(), io = (e) => (() => {
  var t = Gs(), n = t.firstChild;
  return _(t, () => e.children, n), gt(n, "click", (i) => {
    i.stopPropagation(), e.onRemove();
  }), t;
})(), ro = (e) => (() => {
  var t = Ys();
  t.$$keydown = (i) => {
    i.key === "Escape" && (i.preventDefault(), i.stopPropagation(), i.target.blur());
  };
  var n = e.ref;
  return typeof n == "function" ? en(n, t) : e.ref = t, R((i) => {
    var r = e.id, l = e.name, a = e.autofocus, s = e.readonly, c = e.disabled;
    return r !== i.e && J(t, "id", i.e = r), l !== i.t && J(t, "name", i.t = l), a !== i.a && (t.autofocus = i.a = a), s !== i.o && (t.readOnly = i.o = s), c !== i.i && (t.disabled = i.i = c), i;
  }, {
    e: void 0,
    t: void 0,
    a: void 0,
    o: void 0,
    i: void 0
  }), t;
})(), lo = (e) => m(j, {
  get when() {
    return e.isOpen;
  },
  get children() {
    var t = Qs(), n = e.ref;
    return typeof n == "function" ? en(n, t) : e.ref = t, _(t, m(fe, {
      get each() {
        return e.options;
      },
      fallback: "No options",
      get children() {
        return e.children;
      }
    })), t;
  }
}), ao = (e) => (() => {
  var t = Zs();
  return gt(t, "click", e.pickOption, !0), _(t, () => e.children), R((n) => {
    var i = e.isDisabled, r = e.isFocused;
    return i !== n.e && J(t, "data-disabled", n.e = i), r !== n.t && J(t, "data-focused", n.t = r), n;
  }, {
    e: void 0,
    t: void 0
  }), t;
})();
ye(["keydown", "click"]);
function En(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Zn = { exports: {} };
var so = Zn.exports, mr;
function oo() {
  return mr || (mr = 1, (function(e) {
    (function(t, n) {
      e.exports ? e.exports = n() : t.Toastify = n();
    })(so, function(t) {
      var n = function(a) {
        return new n.lib.init(a);
      }, i = "1.12.0";
      n.defaults = {
        oldestFirst: !0,
        text: "Toastify is awesome!",
        node: void 0,
        duration: 3e3,
        selector: void 0,
        callback: function() {
        },
        destination: void 0,
        newWindow: !1,
        close: !1,
        gravity: "toastify-top",
        positionLeft: !1,
        position: "",
        backgroundColor: "",
        avatar: "",
        className: "",
        stopOnFocus: !0,
        onClick: function() {
        },
        offset: { x: 0, y: 0 },
        escapeMarkup: !0,
        ariaLive: "polite",
        style: { background: "" }
      }, n.lib = n.prototype = {
        toastify: i,
        constructor: n,
        // Initializing the object with required parameters
        init: function(a) {
          return a || (a = {}), this.options = {}, this.toastElement = null, this.options.text = a.text || n.defaults.text, this.options.node = a.node || n.defaults.node, this.options.duration = a.duration === 0 ? 0 : a.duration || n.defaults.duration, this.options.selector = a.selector || n.defaults.selector, this.options.callback = a.callback || n.defaults.callback, this.options.destination = a.destination || n.defaults.destination, this.options.newWindow = a.newWindow || n.defaults.newWindow, this.options.close = a.close || n.defaults.close, this.options.gravity = a.gravity === "bottom" ? "toastify-bottom" : n.defaults.gravity, this.options.positionLeft = a.positionLeft || n.defaults.positionLeft, this.options.position = a.position || n.defaults.position, this.options.backgroundColor = a.backgroundColor || n.defaults.backgroundColor, this.options.avatar = a.avatar || n.defaults.avatar, this.options.className = a.className || n.defaults.className, this.options.stopOnFocus = a.stopOnFocus === void 0 ? n.defaults.stopOnFocus : a.stopOnFocus, this.options.onClick = a.onClick || n.defaults.onClick, this.options.offset = a.offset || n.defaults.offset, this.options.escapeMarkup = a.escapeMarkup !== void 0 ? a.escapeMarkup : n.defaults.escapeMarkup, this.options.ariaLive = a.ariaLive || n.defaults.ariaLive, this.options.style = a.style || n.defaults.style, a.backgroundColor && (this.options.style.background = a.backgroundColor), this;
        },
        // Building the DOM element
        buildToast: function() {
          if (!this.options)
            throw "Toastify is not initialized";
          var a = document.createElement("div");
          a.className = "toastify on " + this.options.className, this.options.position ? a.className += " toastify-" + this.options.position : this.options.positionLeft === !0 ? (a.className += " toastify-left", console.warn("Property `positionLeft` will be depreciated in further versions. Please use `position` instead.")) : a.className += " toastify-right", a.className += " " + this.options.gravity, this.options.backgroundColor && console.warn('DEPRECATION NOTICE: "backgroundColor" is being deprecated. Please use the "style.background" property.');
          for (var s in this.options.style)
            a.style[s] = this.options.style[s];
          if (this.options.ariaLive && a.setAttribute("aria-live", this.options.ariaLive), this.options.node && this.options.node.nodeType === Node.ELEMENT_NODE)
            a.appendChild(this.options.node);
          else if (this.options.escapeMarkup ? a.innerText = this.options.text : a.innerHTML = this.options.text, this.options.avatar !== "") {
            var c = document.createElement("img");
            c.src = this.options.avatar, c.className = "toastify-avatar", this.options.position == "left" || this.options.positionLeft === !0 ? a.appendChild(c) : a.insertAdjacentElement("afterbegin", c);
          }
          if (this.options.close === !0) {
            var o = document.createElement("button");
            o.type = "button", o.setAttribute("aria-label", "Close"), o.className = "toast-close", o.innerHTML = "&#10006;", o.addEventListener(
              "click",
              function(u) {
                u.stopPropagation(), this.removeElement(this.toastElement), window.clearTimeout(this.toastElement.timeOutValue);
              }.bind(this)
            );
            var d = window.innerWidth > 0 ? window.innerWidth : screen.width;
            (this.options.position == "left" || this.options.positionLeft === !0) && d > 360 ? a.insertAdjacentElement("afterbegin", o) : a.appendChild(o);
          }
          if (this.options.stopOnFocus && this.options.duration > 0) {
            var f = this;
            a.addEventListener(
              "mouseover",
              function(u) {
                window.clearTimeout(a.timeOutValue);
              }
            ), a.addEventListener(
              "mouseleave",
              function() {
                a.timeOutValue = window.setTimeout(
                  function() {
                    f.removeElement(a);
                  },
                  f.options.duration
                );
              }
            );
          }
          if (typeof this.options.destination != "undefined" && a.addEventListener(
            "click",
            function(u) {
              u.stopPropagation(), this.options.newWindow === !0 ? window.open(this.options.destination, "_blank") : window.location = this.options.destination;
            }.bind(this)
          ), typeof this.options.onClick == "function" && typeof this.options.destination == "undefined" && a.addEventListener(
            "click",
            function(u) {
              u.stopPropagation(), this.options.onClick();
            }.bind(this)
          ), typeof this.options.offset == "object") {
            var x = r("x", this.options), $ = r("y", this.options), C = this.options.position == "left" ? x : "-" + x, g = this.options.gravity == "toastify-top" ? $ : "-" + $;
            a.style.transform = "translate(" + C + "," + g + ")";
          }
          return a;
        },
        // Displaying the toast
        showToast: function() {
          this.toastElement = this.buildToast();
          var a;
          if (typeof this.options.selector == "string" ? a = document.getElementById(this.options.selector) : this.options.selector instanceof HTMLElement || typeof ShadowRoot != "undefined" && this.options.selector instanceof ShadowRoot ? a = this.options.selector : a = document.body, !a)
            throw "Root element is not defined";
          var s = n.defaults.oldestFirst ? a.firstChild : a.lastChild;
          return a.insertBefore(this.toastElement, s), n.reposition(), this.options.duration > 0 && (this.toastElement.timeOutValue = window.setTimeout(
            function() {
              this.removeElement(this.toastElement);
            }.bind(this),
            this.options.duration
          )), this;
        },
        hideToast: function() {
          this.toastElement.timeOutValue && clearTimeout(this.toastElement.timeOutValue), this.removeElement(this.toastElement);
        },
        // Removing the element from the DOM
        removeElement: function(a) {
          a.className = a.className.replace(" on", ""), window.setTimeout(
            function() {
              this.options.node && this.options.node.parentNode && this.options.node.parentNode.removeChild(this.options.node), a.parentNode && a.parentNode.removeChild(a), this.options.callback.call(a), n.reposition();
            }.bind(this),
            400
          );
        }
      }, n.reposition = function() {
        for (var a = {
          top: 15,
          bottom: 15
        }, s = {
          top: 15,
          bottom: 15
        }, c = {
          top: 15,
          bottom: 15
        }, o = document.getElementsByClassName("toastify"), d, f = 0; f < o.length; f++) {
          l(o[f], "toastify-top") === !0 ? d = "toastify-top" : d = "toastify-bottom";
          var x = o[f].offsetHeight;
          d = d.substr(9, d.length - 1);
          var $ = 15, C = window.innerWidth > 0 ? window.innerWidth : screen.width;
          C <= 360 ? (o[f].style[d] = c[d] + "px", c[d] += x + $) : l(o[f], "toastify-left") === !0 ? (o[f].style[d] = a[d] + "px", a[d] += x + $) : (o[f].style[d] = s[d] + "px", s[d] += x + $);
        }
        return this;
      };
      function r(a, s) {
        return s.offset[a] ? isNaN(s.offset[a]) ? s.offset[a] : s.offset[a] + "px" : "0px";
      }
      function l(a, s) {
        return !a || typeof s != "string" ? !1 : !!(a.className && a.className.trim().split(/\s+/gi).indexOf(s) > -1);
      }
      return n.lib.init.prototype = n.lib, n;
    });
  })(Zn)), Zn.exports;
}
var co = oo();
const uo = /* @__PURE__ */ En(co), xi = {
  info: {
    className: "bg-blue-600/80",
    duration: 3e3,
    style: { background: "rgba(37, 99, 235, 0.8)" }
    // blue-600/80
  },
  success: {
    className: "bg-green-600/80",
    duration: 3e3,
    style: { background: "rgba(22, 163, 74, 0.8)" }
    // green-600/80
  },
  warning: {
    className: "bg-yellow-600/80",
    duration: 4e3,
    style: { background: "rgba(202, 138, 4, 0.8)" }
    // yellow-600/80
  },
  error: {
    className: "bg-pink-600/80",
    duration: 5e3,
    style: { background: "rgba(219, 39, 119, 0.8)" }
    // pink-600/80
  }
};
function yi(e) {
  const {
    message: t,
    duration: n = 3e3,
    className: i = "bg-blue-600/80",
    text: r = "",
    position: l = "right",
    gravity: a = "bottom",
    closeOnClick: s = !0,
    style: c
  } = e;
  uo({
    text: t + r,
    duration: n,
    gravity: a,
    position: l,
    close: s,
    className: i,
    style: Ae({}, c)
  }).showToast();
}
function Xe(e, t = 3e3, n = "", i = "bg-blue-600/80") {
  yi(Ae({
    message: e,
    duration: t,
    text: n,
    className: i
  }, xi.info));
}
function jn(e, t = 3e3) {
  yi(Ae({
    message: e,
    duration: t
  }, xi.success));
}
function ho(e, t = 4e3) {
  yi(Ae({
    message: e,
    duration: t
  }, xi.warning));
}
function ke(e, t = 5e3) {
  yi(Ae({
    message: e,
    duration: t
  }, xi.error));
}
class go {
  constructor(t) {
    Ne(this, "stores");
    this.stores = t;
  }
  // ===========================================================================
  // Index Lookup Methods
  // ===========================================================================
  /**
   * Look up a component's index by dataKey.
   *
   * @param dataKey - The component's dataKey
   * @returns The index in reference.details, or -1 if not found
   */
  getIndex(t) {
    var a;
    const [n] = this.stores.referenceMap, r = n()[t];
    if (r !== void 0) {
      const [s] = this.stores.reference;
      if (s.details[r] && s.details[r].dataKey === t)
        return r;
    }
    return this.rebuildIndexMap(), (a = n()[t]) != null ? a : -1;
  }
  /**
   * Get a component by dataKey.
   *
   * @param dataKey - The component's dataKey
   * @returns The component detail or undefined if not found
   */
  getComponent(t) {
    const n = this.getIndex(t);
    if (n === -1) return;
    const [i] = this.stores.reference;
    return i.details[n];
  }
  /**
   * Get a component's answer by dataKey.
   * Handles nested dataKey resolution with @$ROW$ markers.
   *
   * @param dataKey - The component's dataKey (may include row markers)
   * @param currentDataKey - The current context's dataKey for row resolution
   * @returns The answer value or empty string if not found/disabled
   */
  getValue(t, n) {
    const i = this.resolveDataKey(t, n), r = this.getComponent(i);
    return !r || !r.enable ? "" : r.answer !== void 0 && r.answer !== null ? r.answer : "";
  }
  /**
   * Resolve a dataKey that may contain row index markers.
   *
   * @param dataKey - The dataKey with potential @$ROW$ markers
   * @param currentDataKey - The current context's dataKey
   * @returns Resolved dataKey with actual row indices
   */
  resolveDataKey(t, n) {
    if (!n || !t.includes("@$ROW"))
      return t;
    const i = n.split(ht.NESTED_SEPARATOR), r = [];
    for (let a = 1; a < i.length; a++) {
      const s = i[a].match(/@(\d+)/);
      s && r.push(parseInt(s[1], 10));
    }
    let l = t;
    return l.includes("@$ROW$") && r.length > 0 && (l = l.replace("@$ROW$", `@${r[r.length - 1]}`)), l.includes("@$ROW1$") && r.length > 1 && (l = l.replace("@$ROW1$", `@${r[r.length - 2]}`)), l.includes("@$ROW2$") && r.length > 2 && (l = l.replace("@$ROW2$", `@${r[r.length - 3]}`)), l;
  }
  /**
   * Extract row index from a nested dataKey.
   *
   * @param dataKey - The nested dataKey
   * @param level - Which level of nesting (0 = current, 1 = parent, etc.)
   * @returns The row index at that level, or 0 if not found
   */
  getRowIndex(t, n = 0) {
    const i = t.split(ht.NESTED_SEPARATOR), r = [];
    for (let a = 1; a < i.length; a++) {
      const s = i[a].match(/@(\d+)/);
      s && r.push(parseInt(s[1], 10));
    }
    const l = r.length - 1 - n;
    return l >= 0 ? r[l] : 0;
  }
  // ===========================================================================
  // Index Map Management
  // ===========================================================================
  /**
   * Rebuild the index map from current reference data.
   * Called when cache is invalid or after reference changes.
   */
  rebuildIndexMap() {
    const [t] = this.stores.reference, [, n] = this.stores.referenceMap, i = {};
    for (let r = 0; r < t.details.length; r++) {
      const l = t.details[r];
      l && l.dataKey && (i[l.dataKey] = r);
    }
    n(i);
  }
  /**
   * Initialize or reinitialize the reference map.
   * Also builds component dependency maps.
   *
   * @param referenceList - The reference details array (optional, uses store if not provided)
   */
  initializeMaps(t) {
    const [n] = this.stores.reference, i = t != null ? t : n.details;
    this.rebuildIndexMap(), this.buildComponentMaps(i);
  }
  // ===========================================================================
  // Component Dependency Maps
  // ===========================================================================
  /**
   * Build all component dependency maps.
   *
   * @param details - The reference details to process
   */
  buildComponentMaps(t) {
    const [, n] = this.stores.compEnableMap, [, i] = this.stores.compValidMap, [, r] = this.stores.compVarMap, [, l] = this.stores.compSourceOptionMap, [, a] = this.stores.compSourceQuestionMap, s = {}, c = {}, o = {}, d = {}, f = {};
    for (const x of t) {
      if (x.componentEnable)
        for (const $ of x.componentEnable) {
          const C = this.getBaseDataKey($);
          s[C] || (s[C] = []), s[C].includes(x.dataKey) || s[C].push(x.dataKey);
        }
      if (x.componentValidation)
        for (const $ of x.componentValidation) {
          const C = this.getBaseDataKey($);
          c[C] || (c[C] = []), c[C].includes(x.dataKey) || c[C].push(x.dataKey);
        }
      if (x.componentVar && x.type === be.VARIABLE)
        for (const $ of x.componentVar)
          o[$] || (o[$] = []), o[$].includes(x.dataKey) || o[$].push(x.dataKey);
      if (x.sourceOption) {
        const $ = this.getBaseDataKey(x.sourceOption);
        d[$] || (d[$] = []), d[$].includes(x.dataKey) || d[$].push(x.dataKey);
      }
      x.sourceQuestion && x.type === be.NESTED && (f[x.sourceQuestion] || (f[x.sourceQuestion] = []), f[x.sourceQuestion].includes(x.dataKey) || f[x.sourceQuestion].push(x.dataKey));
    }
    n(s), i(c), r(o), l(d), a(f);
  }
  /**
   * Get base dataKey without row markers.
   *
   * @param dataKey - The dataKey possibly with @$ROW$ markers
   * @returns The base dataKey
   */
  getBaseDataKey(t) {
    return t.split("@")[0].split(ht.NESTED_SEPARATOR)[0];
  }
  // ===========================================================================
  // Dependency Lookup Methods
  // ===========================================================================
  /**
   * Get components that have enable conditions depending on this dataKey.
   *
   * @param dataKey - The dataKey to check dependencies for
   * @returns Set of dependent component dataKeys
   */
  getEnableDependents(t) {
    const [n] = this.stores.compEnableMap, r = n()[t];
    return new Set(r != null ? r : []);
  }
  /**
   * Get components that have validation depending on this dataKey.
   *
   * @param dataKey - The dataKey to check dependencies for
   * @returns Set of dependent component dataKeys
   */
  getValidationDependents(t) {
    const [n] = this.stores.compValidMap, i = n()[t];
    return new Set(i != null ? i : []);
  }
  /**
   * Get variable components that depend on this dataKey.
   *
   * @param dataKey - The dataKey to check dependencies for
   * @returns Set of dependent variable component dataKeys
   */
  getVariableDependents(t) {
    const [n] = this.stores.compVarMap, i = n(), r = i[t];
    return console.log("[ReferenceService] getVariableDependents:", {
      dataKey: t,
      dependents: r,
      allVarMapKeys: Object.keys(i)
    }), new Set(r != null ? r : []);
  }
  /**
   * Get components with sourceOption from this dataKey.
   *
   * @param dataKey - The dataKey to check dependencies for
   * @returns Set of dependent component dataKeys
   */
  getSourceOptionDependents(t) {
    const [n] = this.stores.compSourceOptionMap, i = n()[t];
    return new Set(i != null ? i : []);
  }
  /**
   * Get nested components using this dataKey as sourceQuestion.
   * Uses direct reference.details filtering like production GlobalFunction.tsx
   * to catch dynamically created nested components.
   *
   * @param dataKey - The dataKey to check dependencies for
   * @returns Set of nested component dataKeys
   */
  getNestedDependents(t) {
    const [n] = this.stores.reference, i = n.details.filter(
      (r) => r.type === be.NESTED && r.sourceQuestion === t
    );
    return console.log("[ReferenceService] getNestedDependents:", {
      dataKey: t,
      foundCount: i.length,
      dependentKeys: i.map((r) => r.dataKey)
    }), new Set(i.map((r) => r.dataKey));
  }
  // ===========================================================================
  // Store Update Helpers
  // ===========================================================================
  /**
   * Update a component's property in the reference store.
   *
   * @param dataKey - The component's dataKey
   * @param property - The property to update
   * @param value - The new value
   */
  updateComponent(t, n, i) {
    const r = this.getIndex(t);
    if (r === -1)
      return;
    const [, l] = this.stores.reference;
    l("details", r, n, i);
  }
  /**
   * Batch update multiple properties of a component.
   *
   * @param dataKey - The component's dataKey
   * @param updates - Object with properties to update
   */
  updateComponentBatch(t, n) {
    const i = this.getIndex(t);
    if (i === -1) return;
    const [, r] = this.stores.reference;
    for (const [l, a] of Object.entries(n))
      r("details", i, l, a);
  }
  /**
   * Register newly created components in dependency maps.
   * Called when nested components are dynamically created.
   *
   * @param components - The newly created components to register
   */
  registerDynamicComponents(t) {
    console.log("[ReferenceService] registerDynamicComponents called with", t.length, "components");
    const [n, i] = this.stores.compEnableMap, [r, l] = this.stores.compValidMap, [a, s] = this.stores.compVarMap, [c, o] = this.stores.compSourceOptionMap, [d, f] = this.stores.compSourceQuestionMap, x = Ae({}, n()), $ = Ae({}, r()), C = Ae({}, a()), g = Ae({}, c()), u = Ae({}, d());
    for (const b of t) {
      if (b.componentEnable)
        for (const y of b.componentEnable) {
          const S = this.getBaseDataKey(y);
          x[S] || (x[S] = []), x[S].includes(b.dataKey) || x[S].push(b.dataKey);
        }
      if (b.componentValidation)
        for (const y of b.componentValidation) {
          const S = this.getBaseDataKey(y);
          $[S] || ($[S] = []), $[S].includes(b.dataKey) || $[S].push(b.dataKey);
        }
      if (b.componentVar && b.type === be.VARIABLE) {
        console.log("[ReferenceService] Registering variable component:", {
          dataKey: b.dataKey,
          componentVar: b.componentVar,
          type: b.type
        });
        for (const y of b.componentVar)
          console.log("[ReferenceService] Adding varMap entry:", y, "->", b.dataKey), C[y] || (C[y] = []), C[y].includes(b.dataKey) || C[y].push(b.dataKey);
      }
      if (b.sourceOption) {
        const y = this.getBaseDataKey(b.sourceOption);
        g[y] || (g[y] = []), g[y].includes(b.dataKey) || g[y].push(b.dataKey);
      }
      b.sourceQuestion && b.type === be.NESTED && (console.log("[ReferenceService] Registering nested dependency:", {
        sourceQuestion: b.sourceQuestion,
        dataKey: b.dataKey
      }), u[b.sourceQuestion] || (u[b.sourceQuestion] = []), u[b.sourceQuestion].includes(b.dataKey) || u[b.sourceQuestion].push(b.dataKey));
    }
    i(x), l($), s(C), o(g), f(u);
  }
}
const br = {
  // Type conversion
  Number,
  String,
  Boolean,
  parseInt,
  parseFloat,
  isNaN,
  isFinite,
  // Math
  Math,
  // Array (for array methods on answers)
  Array,
  // Date (for date comparisons)
  Date,
  // JSON (for parsing/stringifying)
  JSON,
  // Regex (for pattern matching)
  RegExp,
  // Utility constants
  // Note: null, true, false are reserved keywords and available by default
  // They cannot be used as function parameter names
  undefined: void 0,
  NaN: NaN,
  Infinity: 1 / 0,
  // String utilities
  encodeURIComponent,
  decodeURIComponent
};
class fo {
  constructor(t, n, i) {
    Ne(this, "stores");
    Ne(this, "referenceService");
    Ne(this, "config");
    this.stores = t, this.referenceService = n, this.config = i;
  }
  // ===========================================================================
  // Public Evaluation Methods
  // ===========================================================================
  /**
   * Evaluate an enable condition expression.
   *
   * @param condition - The enable condition expression
   * @param dataKey - The component's dataKey for context
   * @param defaultValue - Value to return if evaluation fails (default: true)
   * @returns Boolean result of the condition
   */
  evaluateEnableCondition(t, n, i = hs.ENABLE_CONDITION) {
    if (!t || t.trim() === "")
      return !0;
    const r = this.createContext(n);
    return this.evaluate(t, r, {
      defaultValue: i,
      logErrors: !0
    }).value;
  }
  /**
   * Evaluate a validation expression.
   * Returns true if the validation TEST FAILS (i.e., there is an error).
   *
   * @param test - The validation test expression
   * @param dataKey - The component's dataKey for context
   * @param answer - The current answer value
   * @returns Boolean - true means validation error, false means valid
   */
  evaluateValidation(t, n, i) {
    if (!t || t.trim() === "")
      return !1;
    const r = this.createContext(n, i);
    return this.evaluate(t, r, {
      defaultValue: !1,
      // Default to no error
      logErrors: !0
    }).value;
  }
  /**
   * Evaluate a variable expression.
   *
   * @param expression - The variable expression
   * @param dataKey - The component's dataKey for context
   * @returns The evaluated value or undefined
   */
  evaluateVariable(t, n) {
    if (!t || t.trim() === "")
      return;
    const i = this.createContext(n);
    return this.evaluate(t, i, {
      defaultValue: void 0,
      logErrors: !0
    }).value;
  }
  /**
   * Evaluate a generic expression and return the full result.
   *
   * @param expression - The expression to evaluate
   * @param dataKey - The component's dataKey for context
   * @param options - Evaluation options
   * @returns Full evaluation result with success status
   */
  evaluateExpression(t, n, i = {}) {
    const r = this.createContext(n);
    return this.evaluate(t, r, i);
  }
  // ===========================================================================
  // Context Creation
  // ===========================================================================
  /**
   * Create an expression evaluation context.
   *
   * @param dataKey - The component's dataKey
   * @param answer - The current answer (for validation context)
   * @returns ExpressionContext object
   */
  createContext(t, n) {
    return {
      getValue: (i) => this.safeGetValue(i, t),
      getRowIndex: (i) => this.referenceService.getRowIndex(t, i != null ? i : 0),
      getProp: (i) => this.getProp(i),
      dataKey: t,
      answer: n
    };
  }
  // ===========================================================================
  // Private Helper Methods
  // ===========================================================================
  /**
   * Safe getValue that handles errors gracefully.
   */
  safeGetValue(t, n) {
    try {
      return this.referenceService.getValue(t, n);
    } catch (i) {
      return console.warn(`[Expression] Error getting value for ${t}:`, i), "";
    }
  }
  /**
   * Get a configuration property.
   */
  getProp(t) {
    var n, i, r;
    switch (t) {
      case "clientMode":
        return this.config.clientMode;
      case "formMode":
        return this.config.formMode;
      case "baseUrl":
        return (n = this.config.baseUrl) != null ? n : "";
      case "username":
        return (i = this.config.username) != null ? i : "";
      case "token":
        return (r = this.config.token) != null ? r : "";
      default:
        return;
    }
  }
  /**
   * Core expression evaluation using sandboxed Function constructor.
   */
  evaluate(t, n, i = {}) {
    const { defaultValue: r, logErrors: l = !0, silent: a = !1 } = i;
    if (!t || t.trim() === "")
      return {
        success: !0,
        value: r
      };
    try {
      return {
        success: !0,
        value: this.createSafeFunction(t, n)()
      };
    } catch (s) {
      const c = s instanceof Error ? s.message : String(s);
      return l && !a && console.error(
        `[Expression] Error evaluating "${t}" for ${n.dataKey}:`,
        c
      ), {
        success: !1,
        value: r,
        error: c
      };
    }
  }
  /**
   * Create a sandboxed function for expression evaluation.
   *
   * Uses Function constructor instead of eval() to:
   * 1. Create a controlled scope with only allowed globals
   * 2. Prevent access to window, document, etc.
   * 3. Provide clear error messages
   */
  createSafeFunction(t, n) {
    const i = [
      "getValue",
      "getRowIndex",
      "getProp",
      "answer",
      "rowIndex",
      ...Object.keys(br)
    ], r = [
      n.getValue,
      n.getRowIndex,
      n.getProp,
      n.answer,
      n.getRowIndex(0),
      // rowIndex shorthand
      ...Object.values(br)
    ], l = `
      'use strict';
      return (${t});
    `;
    try {
      const a = new Function(...i, l);
      return () => a(...r);
    } catch (a) {
      throw new Error(
        `Syntax error in expression "${t}": ${a instanceof Error ? a.message : String(a)}`
      );
    }
  }
  // ===========================================================================
  // Utility Methods
  // ===========================================================================
  /**
   * Validate that an expression is syntactically correct without executing it.
   *
   * @param expression - The expression to validate
   * @returns Object with isValid and optional error message
   */
  validateSyntax(t) {
    if (!t || t.trim() === "")
      return { isValid: !0 };
    try {
      return new Function(`return (${t})`), { isValid: !0 };
    } catch (n) {
      return {
        isValid: !1,
        error: n instanceof Error ? n.message : String(n)
      };
    }
  }
  /**
   * Extract variable references from an expression.
   * Useful for building dependency maps.
   *
   * @param expression - The expression to analyze
   * @returns Array of dataKeys referenced in the expression
   */
  extractReferences(t) {
    if (!t) return [];
    const n = [], i = /getValue\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
    let r;
    for (; (r = i.exec(t)) !== null; )
      n.push(r[1]);
    return [...new Set(n)];
  }
}
var Xn = { exports: {} }, vo = Xn.exports, wr;
function mo() {
  return wr || (wr = 1, (function(e, t) {
    (function(n, i) {
      e.exports = i();
    })(vo, (function() {
      var n = 1e3, i = 6e4, r = 36e5, l = "millisecond", a = "second", s = "minute", c = "hour", o = "day", d = "week", f = "month", x = "quarter", $ = "year", C = "date", g = "Invalid Date", u = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, b = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, y = { name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), ordinal: function(N) {
        var T = ["th", "st", "nd", "rd"], A = N % 100;
        return "[" + N + (T[(A - 20) % 10] || T[A] || T[0]) + "]";
      } }, S = function(N, T, A) {
        var z = String(N);
        return !z || z.length >= T ? N : "" + Array(T + 1 - z.length).join(A) + N;
      }, p = { s: S, z: function(N) {
        var T = -N.utcOffset(), A = Math.abs(T), z = Math.floor(A / 60), D = A % 60;
        return (T <= 0 ? "+" : "-") + S(z, 2, "0") + ":" + S(D, 2, "0");
      }, m: function N(T, A) {
        if (T.date() < A.date()) return -N(A, T);
        var z = 12 * (A.year() - T.year()) + (A.month() - T.month()), D = T.clone().add(z, f), P = A - D < 0, B = T.clone().add(z + (P ? -1 : 1), f);
        return +(-(z + (A - D) / (P ? D - B : B - D)) || 0);
      }, a: function(N) {
        return N < 0 ? Math.ceil(N) || 0 : Math.floor(N);
      }, p: function(N) {
        return { M: f, y: $, w: d, d: o, D: C, h: c, m: s, s: a, ms: l, Q: x }[N] || String(N || "").toLowerCase().replace(/s$/, "");
      }, u: function(N) {
        return N === void 0;
      } }, L = "en", V = {};
      V[L] = y;
      var v = "$isDayjsObject", h = function(N) {
        return N instanceof M || !(!N || !N[v]);
      }, w = function N(T, A, z) {
        var D;
        if (!T) return L;
        if (typeof T == "string") {
          var P = T.toLowerCase();
          V[P] && (D = P), A && (V[P] = A, D = P);
          var B = T.split("-");
          if (!D && B.length > 1) return N(B[0]);
        } else {
          var F = T.name;
          V[F] = T, D = F;
        }
        return !z && D && (L = D), D || !z && L;
      }, E = function(N, T) {
        if (h(N)) return N.clone();
        var A = typeof T == "object" ? T : {};
        return A.date = N, A.args = arguments, new M(A);
      }, I = p;
      I.l = w, I.i = h, I.w = function(N, T) {
        return E(N, { locale: T.$L, utc: T.$u, x: T.$x, $offset: T.$offset });
      };
      var M = (function() {
        function N(A) {
          this.$L = w(A.locale, null, !0), this.parse(A), this.$x = this.$x || A.x || {}, this[v] = !0;
        }
        var T = N.prototype;
        return T.parse = function(A) {
          this.$d = (function(z) {
            var D = z.date, P = z.utc;
            if (D === null) return /* @__PURE__ */ new Date(NaN);
            if (I.u(D)) return /* @__PURE__ */ new Date();
            if (D instanceof Date) return new Date(D);
            if (typeof D == "string" && !/Z$/i.test(D)) {
              var B = D.match(u);
              if (B) {
                var F = B[2] - 1 || 0, U = (B[7] || "0").substring(0, 3);
                return P ? new Date(Date.UTC(B[1], F, B[3] || 1, B[4] || 0, B[5] || 0, B[6] || 0, U)) : new Date(B[1], F, B[3] || 1, B[4] || 0, B[5] || 0, B[6] || 0, U);
              }
            }
            return new Date(D);
          })(A), this.init();
        }, T.init = function() {
          var A = this.$d;
          this.$y = A.getFullYear(), this.$M = A.getMonth(), this.$D = A.getDate(), this.$W = A.getDay(), this.$H = A.getHours(), this.$m = A.getMinutes(), this.$s = A.getSeconds(), this.$ms = A.getMilliseconds();
        }, T.$utils = function() {
          return I;
        }, T.isValid = function() {
          return this.$d.toString() !== g;
        }, T.isSame = function(A, z) {
          var D = E(A);
          return this.startOf(z) <= D && D <= this.endOf(z);
        }, T.isAfter = function(A, z) {
          return E(A) < this.startOf(z);
        }, T.isBefore = function(A, z) {
          return this.endOf(z) < E(A);
        }, T.$g = function(A, z, D) {
          return I.u(A) ? this[z] : this.set(D, A);
        }, T.unix = function() {
          return Math.floor(this.valueOf() / 1e3);
        }, T.valueOf = function() {
          return this.$d.getTime();
        }, T.startOf = function(A, z) {
          var D = this, P = !!I.u(z) || z, B = I.p(A), F = function(Y, Q) {
            var G = I.w(D.$u ? Date.UTC(D.$y, Q, Y) : new Date(D.$y, Q, Y), D);
            return P ? G : G.endOf(o);
          }, U = function(Y, Q) {
            return I.w(D.toDate()[Y].apply(D.toDate("s"), (P ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(Q)), D);
          }, H = this.$W, ne = this.$M, X = this.$D, oe = "set" + (this.$u ? "UTC" : "");
          switch (B) {
            case $:
              return P ? F(1, 0) : F(31, 11);
            case f:
              return P ? F(1, ne) : F(0, ne + 1);
            case d:
              var se = this.$locale().weekStart || 0, W = (H < se ? H + 7 : H) - se;
              return F(P ? X - W : X + (6 - W), ne);
            case o:
            case C:
              return U(oe + "Hours", 0);
            case c:
              return U(oe + "Minutes", 1);
            case s:
              return U(oe + "Seconds", 2);
            case a:
              return U(oe + "Milliseconds", 3);
            default:
              return this.clone();
          }
        }, T.endOf = function(A) {
          return this.startOf(A, !1);
        }, T.$set = function(A, z) {
          var D, P = I.p(A), B = "set" + (this.$u ? "UTC" : ""), F = (D = {}, D[o] = B + "Date", D[C] = B + "Date", D[f] = B + "Month", D[$] = B + "FullYear", D[c] = B + "Hours", D[s] = B + "Minutes", D[a] = B + "Seconds", D[l] = B + "Milliseconds", D)[P], U = P === o ? this.$D + (z - this.$W) : z;
          if (P === f || P === $) {
            var H = this.clone().set(C, 1);
            H.$d[F](U), H.init(), this.$d = H.set(C, Math.min(this.$D, H.daysInMonth())).$d;
          } else F && this.$d[F](U);
          return this.init(), this;
        }, T.set = function(A, z) {
          return this.clone().$set(A, z);
        }, T.get = function(A) {
          return this[I.p(A)]();
        }, T.add = function(A, z) {
          var D, P = this;
          A = Number(A);
          var B = I.p(z), F = function(ne) {
            var X = E(P);
            return I.w(X.date(X.date() + Math.round(ne * A)), P);
          };
          if (B === f) return this.set(f, this.$M + A);
          if (B === $) return this.set($, this.$y + A);
          if (B === o) return F(1);
          if (B === d) return F(7);
          var U = (D = {}, D[s] = i, D[c] = r, D[a] = n, D)[B] || 1, H = this.$d.getTime() + A * U;
          return I.w(H, this);
        }, T.subtract = function(A, z) {
          return this.add(-1 * A, z);
        }, T.format = function(A) {
          var z = this, D = this.$locale();
          if (!this.isValid()) return D.invalidDate || g;
          var P = A || "YYYY-MM-DDTHH:mm:ssZ", B = I.z(this), F = this.$H, U = this.$m, H = this.$M, ne = D.weekdays, X = D.months, oe = D.meridiem, se = function(Q, G, le, _e) {
            return Q && (Q[G] || Q(z, P)) || le[G].slice(0, _e);
          }, W = function(Q) {
            return I.s(F % 12 || 12, Q, "0");
          }, Y = oe || function(Q, G, le) {
            var _e = Q < 12 ? "AM" : "PM";
            return le ? _e.toLowerCase() : _e;
          };
          return P.replace(b, (function(Q, G) {
            return G || (function(le) {
              switch (le) {
                case "YY":
                  return String(z.$y).slice(-2);
                case "YYYY":
                  return I.s(z.$y, 4, "0");
                case "M":
                  return H + 1;
                case "MM":
                  return I.s(H + 1, 2, "0");
                case "MMM":
                  return se(D.monthsShort, H, X, 3);
                case "MMMM":
                  return se(X, H);
                case "D":
                  return z.$D;
                case "DD":
                  return I.s(z.$D, 2, "0");
                case "d":
                  return String(z.$W);
                case "dd":
                  return se(D.weekdaysMin, z.$W, ne, 2);
                case "ddd":
                  return se(D.weekdaysShort, z.$W, ne, 3);
                case "dddd":
                  return ne[z.$W];
                case "H":
                  return String(F);
                case "HH":
                  return I.s(F, 2, "0");
                case "h":
                  return W(1);
                case "hh":
                  return W(2);
                case "a":
                  return Y(F, U, !0);
                case "A":
                  return Y(F, U, !1);
                case "m":
                  return String(U);
                case "mm":
                  return I.s(U, 2, "0");
                case "s":
                  return String(z.$s);
                case "ss":
                  return I.s(z.$s, 2, "0");
                case "SSS":
                  return I.s(z.$ms, 3, "0");
                case "Z":
                  return B;
              }
              return null;
            })(Q) || B.replace(":", "");
          }));
        }, T.utcOffset = function() {
          return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
        }, T.diff = function(A, z, D) {
          var P, B = this, F = I.p(z), U = E(A), H = (U.utcOffset() - this.utcOffset()) * i, ne = this - U, X = function() {
            return I.m(B, U);
          };
          switch (F) {
            case $:
              P = X() / 12;
              break;
            case f:
              P = X();
              break;
            case x:
              P = X() / 3;
              break;
            case d:
              P = (ne - H) / 6048e5;
              break;
            case o:
              P = (ne - H) / 864e5;
              break;
            case c:
              P = ne / r;
              break;
            case s:
              P = ne / i;
              break;
            case a:
              P = ne / n;
              break;
            default:
              P = ne;
          }
          return D ? P : I.a(P);
        }, T.daysInMonth = function() {
          return this.endOf(f).$D;
        }, T.$locale = function() {
          return V[this.$L];
        }, T.locale = function(A, z) {
          if (!A) return this.$L;
          var D = this.clone(), P = w(A, z, !0);
          return P && (D.$L = P), D;
        }, T.clone = function() {
          return I.w(this.$d, this);
        }, T.toDate = function() {
          return new Date(this.valueOf());
        }, T.toJSON = function() {
          return this.isValid() ? this.toISOString() : null;
        }, T.toISOString = function() {
          return this.$d.toISOString();
        }, T.toString = function() {
          return this.$d.toUTCString();
        }, N;
      })(), O = M.prototype;
      return E.prototype = O, [["$ms", l], ["$s", a], ["$m", s], ["$H", c], ["$W", o], ["$M", f], ["$y", $], ["$D", C]].forEach((function(N) {
        O[N[1]] = function(T) {
          return this.$g(T, N[0], N[1]);
        };
      })), E.extend = function(N, T) {
        return N.$i || (N(T, M, E), N.$i = !0), E;
      }, E.locale = w, E.isDayjs = h, E.unix = function(N) {
        return E(1e3 * N);
      }, E.en = V[L], E.Ls = V, E.p = {}, E;
    }));
  })(Xn)), Xn.exports;
}
var bo = mo();
const vt = /* @__PURE__ */ En(bo);
function wo(e, t) {
  return e.replace(/\$(\w*)/g, (n, i) => Object.prototype.hasOwnProperty.call(t, i) ? String(t[i]) : "");
}
function xo(e) {
  if (!e || e.trim() === "")
    return !1;
  const t = new Date(e);
  return t.toString() !== "Invalid Date" && !isNaN(t.getTime());
}
function xr(e, t = "DD/MM/YYYY") {
  return vt(e).format(t);
}
class yo {
  constructor(t, n, i, r) {
    Ne(this, "stores");
    Ne(this, "referenceService");
    Ne(this, "expressionService");
    Ne(this, "config");
    this.stores = t, this.referenceService = n, this.expressionService = i, this.config = r;
  }
  // ===========================================================================
  // Public Validation Methods
  // ===========================================================================
  /**
   * Run all validations for a component.
   *
   * @param dataKey - The component's dataKey
   * @returns ValidationResult with state and messages
   */
  validateComponent(t) {
    const n = this.referenceService.getComponent(t);
    if (!n)
      return { state: Ue.VALID, messages: [] };
    if (n.hasRemark)
      return { state: Ue.VALID, messages: [] };
    const i = {
      state: Ue.VALID,
      messages: []
    };
    return this.runExpressionValidations(n, i), this.runLengthValidations(n, i), this.runRangeValidations(n, i), this.runPatternValidations(n, i), this.config.clientMode === Mt.PAPI && this.runPapiValidations(n, i), this.updateValidationState(t, i), i;
  }
  /**
   * Run URL-based validation for a component.
   * This is async and updates the component state when complete.
   *
   * @param dataKey - The component's dataKey
   */
  validateUrl(t) {
    return ce(this, null, function* () {
      const n = this.referenceService.getComponent(t);
      if (!(!n || !n.urlValidation || ![
        be.BUTTON,
        be.URL_BUTTON,
        be.DATE_RANGE,
        be.TEXTAREA,
        be.URL
      ].includes(n.type)))
        try {
          const r = yield fetch(n.urlValidation, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ answer: n.answer })
          });
          if (r.status !== 200) {
            this.addUrlValidationError(t);
            return;
          }
          const l = yield r.json();
          if (!l.result) {
            const a = l.message || this.getLocaleString("validationApi");
            this.addValidationMessage(t, a, Ue.ERROR);
          }
        } catch (r) {
          this.addUrlValidationError(t);
        }
    });
  }
  /**
   * Clear validation state for a component.
   *
   * @param dataKey - The component's dataKey
   */
  clearValidation(t) {
    this.referenceService.updateComponentBatch(t, {
      validationState: Ue.VALID,
      validationMessage: []
    });
  }
  /**
   * Validate all components and return summary.
   *
   * @returns Object with counts of valid, warning, and error components
   */
  validateAll() {
    const [t] = this.stores.reference;
    let n = 0, i = 0, r = 0;
    for (const l of t.details) {
      if (!l.enable) continue;
      switch (this.validateComponent(l.dataKey).state) {
        case Ue.VALID:
          n++;
          break;
        case Ue.WARNING:
          i++;
          break;
        case Ue.ERROR:
          r++;
          break;
      }
    }
    return { valid: n, warnings: i, errors: r };
  }
  // ===========================================================================
  // Private Validation Methods
  // ===========================================================================
  /**
   * Run expression-based validations from validation rules.
   */
  runExpressionValidations(t, n) {
    if (!(!t.validations || t.validations.length === 0))
      for (const i of t.validations)
        this.expressionService.evaluateValidation(
          i.test,
          t.dataKey,
          t.answer
        ) && (n.messages.push(i.message), n.state = Math.max(n.state, i.type));
  }
  /**
   * Run length validations (minlength, maxlength).
   */
  runLengthValidations(t, n) {
    if (!t.lengthInput || t.answer === void 0 || t.answer === null || typeof t.answer == "object") return;
    const i = String(t.answer), r = t.lengthInput;
    r.max !== void 0 && i.length > r.max && (n.messages.push(
      `${this.getLocaleString("validationMaxLength")} ${r.max}`
    ), n.state = Ue.ERROR), r.min !== void 0 && i.length < r.min && (n.messages.push(
      `${this.getLocaleString("validationMinLength")} ${r.min}`
    ), n.state = Ue.ERROR);
  }
  /**
   * Run range validations (min, max).
   */
  runRangeValidations(t, n) {
    if (!t.rangeInput || t.answer === void 0 || t.answer === null || typeof t.answer == "object") return;
    const i = Number(t.answer), r = t.rangeInput;
    r.max !== void 0 && i > r.max && (n.messages.push(
      `${this.getLocaleString("validationMax")} ${r.max}`
    ), n.state = Ue.ERROR), r.min !== void 0 && i < r.min && (n.messages.push(
      `${this.getLocaleString("validationMin")} ${r.min}`
    ), n.state = Ue.ERROR);
  }
  /**
   * Run pattern validations (email, URL).
   */
  runPatternValidations(t, n) {
    if (t.answer === void 0 || t.answer === null || typeof t.answer == "object") return;
    const i = String(t.answer);
    t.type === be.URL && i && (ht.EMAIL.test(i) || (n.messages.push(this.getLocaleString("validationEmail")), n.state = Ue.ERROR)), t.type, be.EMAIL;
  }
  /**
   * Run PAPI-specific validations.
   */
  runPapiValidations(t, n) {
    t.answer !== void 0 && (t.type === be.RADIO && this.validateRadioInput(t, n), (t.type === be.DATE || t.type === be.DATETIME) && this.validateDateInput(t, n), t.type === be.RANGE_SLIDER && this.validateRangeSlider(t, n));
  }
  /**
   * Validate radio input for PAPI mode.
   */
  validateRadioInput(t, n) {
    if (!t.options || !Array.isArray(t.answer)) return;
    const i = t.options.map((l) => l.value), r = t.answer;
    if (r[0] && !i.includes(r[0].value)) {
      const l = wo(this.getLocaleString("validationInclude"), {
        values: i.join(",")
      });
      n.messages.push(l), n.state = Ue.ERROR;
    }
  }
  /**
   * Validate date input for PAPI mode.
   */
  validateDateInput(t, n) {
    const i = String(t.answer);
    if (!xo(i)) {
      n.messages.push(this.getLocaleString("validationDate")), n.state = Ue.ERROR;
      return;
    }
    const r = new Date(i), l = t.rangeInput;
    if ((l == null ? void 0 : l.max) !== void 0) {
      const a = l.max === "today" ? /* @__PURE__ */ new Date() : new Date(l.max);
      r.getTime() > a.getTime() && (n.messages.push(
        `${this.getLocaleString("validationMax")} ${xr(a)}`
      ), n.state = Ue.ERROR);
    }
    if ((l == null ? void 0 : l.min) !== void 0) {
      const a = l.min === "today" ? /* @__PURE__ */ new Date() : new Date(l.min);
      r.getTime() < a.getTime() && (n.messages.push(
        `${this.getLocaleString("validationMin")} ${xr(a)}`
      ), n.state = Ue.ERROR);
    }
  }
  /**
   * Validate range slider for PAPI mode.
   */
  validateRangeSlider(t, n) {
    var l;
    const i = (l = t.rangeInput) == null ? void 0 : l.step;
    if (i === void 0) return;
    Number(t.answer) % i !== 0 && (n.messages.push(
      `${this.getLocaleString("validationStep")} ${i}`
    ), n.state = Ue.ERROR);
  }
  // ===========================================================================
  // Helper Methods
  // ===========================================================================
  /**
   * Add a URL validation error to the component.
   */
  addUrlValidationError(t) {
    this.addValidationMessage(
      t,
      this.getLocaleString("validationApi"),
      Ue.ERROR
    );
  }
  /**
   * Add a validation message to a component.
   */
  addValidationMessage(t, n, i) {
    const r = this.referenceService.getComponent(t);
    if (!r) return;
    const l = [...r.validationMessage || [], n], a = Math.max(r.validationState, i);
    this.referenceService.updateComponentBatch(t, {
      validationMessage: l,
      validationState: a
    });
  }
  /**
   * Update the validation state in the store.
   */
  updateValidationState(t, n) {
    this.referenceService.updateComponentBatch(t, {
      validationState: n.state,
      validationMessage: n.messages
    });
  }
  /**
   * Get a locale string by key.
   */
  getLocaleString(t) {
    var r, l;
    const [n] = this.stores.locale, i = (l = (r = n.details) == null ? void 0 : r.language) == null ? void 0 : l[0];
    return i && i[t] || t;
  }
  // ===========================================================================
  // Dependency Validation
  // ===========================================================================
  /**
   * Validate all components that depend on a given dataKey.
   *
   * @param sourceDataKey - The dataKey that was updated
   */
  validateDependents(t) {
    const n = this.referenceService.getValidationDependents(t);
    for (const i of n)
      this.validateComponent(i);
  }
}
class po {
  constructor(t, n, i, r) {
    Ne(this, "stores");
    Ne(this, "referenceService");
    Ne(this, "expressionService");
    Ne(this, "config");
    this.stores = t, this.referenceService = n, this.expressionService = i, this.config = r;
  }
  // ===========================================================================
  // Public Enable Methods
  // ===========================================================================
  /**
   * Evaluate and update the enable state for a component.
   *
   * @param dataKey - The component's dataKey
   * @returns The new enable state
   */
  evaluateEnable(t) {
    const n = this.referenceService.getComponent(t);
    if (!n || !n.enableCondition || n.enableCondition.trim() === "")
      return !0;
    const i = this.expressionService.evaluateEnableCondition(
      n.enableCondition,
      t
    );
    return this.referenceService.updateComponent(t, "enable", i), i;
  }
  /**
   * Re-evaluate enable conditions for all dependents of a dataKey.
   * Called when an answer changes that might affect enable conditions.
   *
   * @param sourceDataKey - The dataKey whose answer changed
   */
  evaluateDependents(t) {
    this.evaluateSidebarDependents(t), this.evaluateComponentDependents(t);
  }
  /**
   * Initialize enable states for all components.
   * Should be called during form initialization.
   */
  initializeEnableStates() {
    const [t] = this.stores.reference;
    for (const n of t.details)
      n.enableCondition && this.evaluateEnable(n.dataKey);
    this.updateDisabledSectionsCache();
  }
  /**
   * Set enable to false for a component and all its children.
   *
   * @param dataKey - The component's dataKey
   */
  disableComponent(t) {
    this.referenceService.updateComponent(t, "enable", !1);
    const n = this.referenceService.getComponent(t);
    n && (n.type === be.SECTION || n.type === be.NESTED) && this.disableChildren(t);
  }
  /**
   * Set enable to true for a component, re-evaluating children's conditions.
   *
   * @param dataKey - The component's dataKey
   */
  enableComponent(t) {
    this.referenceService.updateComponent(t, "enable", !0);
    const n = this.referenceService.getComponent(t);
    n && (n.type === be.SECTION || n.type === be.NESTED) && this.reevaluateChildren(t);
  }
  /**
   * Get indices of all disabled sections for sidebar navigation.
   * Used to grey out disabled sections in the sidebar.
   */
  getDisabledSectionIndices() {
    const [t] = this.stores.sidebar, n = [];
    for (const i of t.details)
      i.enable || n.push({
        parentIndex: [...i.index]
      });
    return n;
  }
  /**
   * Check if a component is enabled.
   *
   * @param dataKey - The component's dataKey
   * @returns Whether the component is enabled
   */
  isEnabled(t) {
    var i;
    const n = this.referenceService.getComponent(t);
    return (i = n == null ? void 0 : n.enable) != null ? i : !0;
  }
  // ===========================================================================
  // Private Enable Methods
  // ===========================================================================
  /**
   * Evaluate sidebar sections that depend on the source dataKey.
   */
  evaluateSidebarDependents(t) {
    const [n, i] = this.stores.sidebar;
    for (let r = 0; r < n.details.length; r++) {
      const l = n.details[r];
      if (!l.componentEnable || !this.isEnableDependent(
        l.componentEnable,
        t
      )) continue;
      const s = l.enable, c = this.expressionService.evaluateEnableCondition(
        l.enableCondition || "",
        l.dataKey
      );
      i("details", r, "enable", c), c !== s && this.updateSectionComponents(l, c);
    }
  }
  /**
   * Evaluate components that have enable conditions depending on source dataKey.
   */
  evaluateComponentDependents(t) {
    const n = this.referenceService.getEnableDependents(t);
    for (const i of n)
      this.evaluateEnable(i);
  }
  /**
   * Check if an enable dependency array includes the source dataKey.
   */
  isEnableDependent(t, n) {
    for (const i of t)
      if (this.normalizeDataKey(i, n) === n)
        return !0;
    return !1;
  }
  /**
   * Normalize a dataKey by resolving @$ROW$ markers.
   */
  normalizeDataKey(t, n) {
    const i = t.split("@"), r = i[0], l = i[1];
    if (!l) return t;
    const a = r.split(ht.NESTED_SEPARATOR), s = a.length;
    switch (l) {
      case "$ROW$":
        return r;
      case "$ROW1$":
        return s > 2 && (a.length = s - 1), a.join(ht.NESTED_SEPARATOR);
      case "$ROW2$":
        return s > 3 && (a.length = s - 2), a.join(ht.NESTED_SEPARATOR);
      default:
        return t;
    }
  }
  /**
   * Update all components in a section when the section's enable changes.
   */
  updateSectionComponents(t, n) {
    if (!t.components || !t.components[0]) return;
    const [i] = this.stores.reference;
    for (const r of t.components[0]) {
      const l = this.referenceService.getIndex(r.dataKey);
      if (l !== -1)
        if (!n)
          this.referenceService.updateComponent(r.dataKey, "enable", !1);
        else {
          const a = i.details[l];
          if (a.type === be.VARIABLE)
            continue;
          let s = !0;
          a.enableCondition && a.enableCondition.trim() !== "" && (s = this.expressionService.evaluateEnableCondition(
            a.enableCondition,
            a.dataKey
          )), this.referenceService.updateComponent(a.dataKey, "enable", s);
        }
    }
  }
  /**
   * Disable all children of a parent component.
   */
  disableChildren(t) {
    const [n] = this.stores.reference;
    for (const i of n.details)
      (i.parent === t || i.dataKey.startsWith(t + ht.NESTED_SEPARATOR)) && this.referenceService.updateComponent(i.dataKey, "enable", !1);
  }
  /**
   * Re-evaluate enable conditions for all children of a parent.
   */
  reevaluateChildren(t) {
    const [n] = this.stores.reference;
    for (const i of n.details)
      (i.parent === t || i.dataKey.startsWith(t + ht.NESTED_SEPARATOR)) && (i.enableCondition ? this.evaluateEnable(i.dataKey) : this.referenceService.updateComponent(i.dataKey, "enable", !0));
  }
  /**
   * Update the disabled sections cache (referenceEnableFalse).
   * This updates the list of disabled sidebar sections for navigation.
   */
  updateDisabledSectionsCache() {
    const [t] = this.stores.sidebar, [, n] = this.stores.referenceEnableFalse, i = [];
    for (const r of t.details)
      if (!r.enable) {
        const l = JSON.parse(JSON.stringify(r.index));
        i.push({ parentIndex: l });
      }
    n(i);
  }
}
class ko {
  constructor(t, n, i, r) {
    Ne(this, "stores");
    Ne(this, "referenceService");
    Ne(this, "expressionService");
    Ne(this, "config");
    this.stores = t, this.referenceService = n, this.expressionService = i, this.config = r;
  }
  // ===========================================================================
  // Public Nested Operations
  // ===========================================================================
  /**
   * Insert a nested component from an array-based selection (e.g., checkbox, multi-select).
   *
   * @param dataKey - The parent component's dataKey
   * @param answer - The selected option { label, value }
   * @param sidebarPosition - Current sidebar position for history
   */
  insertFromArray(t, n, i) {
    var C;
    console.log("[NestedService] insertFromArray called:", { dataKey: t, answer: n, sidebarPosition: i });
    let r = this.referenceService.getComponent(t);
    console.log("[NestedService] Parent component from reference:", r);
    let l = r == null ? void 0 : r.components;
    console.log("[NestedService] Component components:", l);
    const [a] = this.stores.nested, s = a.details;
    console.log("[NestedService] Looking for dataKey in nested store:", t);
    const c = s.find((g) => g.dataKey === t);
    if (console.log("[NestedService] Nested store entry:", c), c && (l || (l = c.components), r && (r = Ct(Ae({}, r), {
      level: (C = c.level) != null ? C : r.level,
      // Keep the reference component's index - it's the actual instance index
      // label and name from nested store are fallbacks if reference doesn't have them
      label: r.label || c.label,
      name: r.name || c.name
    }), console.log("[NestedService] Updated component with nested store values:", {
      level: r.level,
      index: r.index
    }))), !l) {
      const [g] = this.stores.sidebar, u = g.details.find(
        (b) => b.dataKey === t
      );
      console.log("[NestedService] Sidebar entry (fallback):", u), l = u == null ? void 0 : u.components;
    }
    if (!r || !l) {
      console.log("[NestedService] No component or no components array, returning");
      return;
    }
    const [o] = this.stores.sidebar;
    let d = r.index;
    const f = o.details.find((g) => {
      var b;
      return (b = g.components) != null && b[0] ? g.components[0].some((y) => y.dataKey === t) : !1;
    });
    if (f) {
      const u = f.components[0].findIndex((b) => b.dataKey === t);
      d = [...f.index, 0, u], console.log("[NestedService] Found parent sidebar, computed runtime index:", {
        parentSidebarDataKey: f.dataKey,
        parentSidebarIndex: JSON.stringify(f.index),
        compPosition: u,
        runtimeIndex: JSON.stringify(d)
      });
    }
    const x = Ct(Ae({}, r), {
      components: l,
      index: d
    });
    console.log("[NestedService] Component with components:", x);
    const $ = this.createNestedComponents(
      x,
      Number(n.value),
      i,
      n.label
    );
    if (console.log("[NestedService] Created new components:", $.length), $.length !== 0)
      try {
        console.log("[NestedService] About to insertIntoReference"), this.insertIntoReference($, x), console.log("[NestedService] insertIntoReference completed"), console.log("[NestedService] About to insertIntoSidebar"), this.insertIntoSidebar(x, n, $, i), console.log("[NestedService] insertIntoSidebar completed"), console.log("[NestedService] About to initializeNestedAnswers"), this.initializeNestedAnswers($, i), console.log("[NestedService] initializeNestedAnswers completed"), console.log("[NestedService] insertFromArray completed successfully");
      } catch (g) {
        console.error("[NestedService] Error in insertFromArray:", g);
      }
  }
  /**
   * Delete a nested component from an array-based selection.
   *
   * @param dataKey - The parent component's dataKey
   * @param beforeAnswer - The option being removed { label, value }
   * @param sidebarPosition - Current sidebar position for history
   */
  deleteFromArray(t, n, i) {
    const r = this.referenceService.getComponent(t);
    if (!r) return;
    const l = [...r.index, Number(n.value)];
    this.removeFromReference(l), this.removeFromSidebar(l, i);
  }
  /**
   * Handle changes to array-based nested selections.
   * Determines if items were added, removed, or just relabeled.
   *
   * @param dataKey - The parent component's dataKey
   * @param answer - Current selection
   * @param beforeAnswer - Previous selection
   * @param sidebarPosition - Current sidebar position
   */
  changeFromArray(t, n, i, r) {
    const l = [];
    for (const s of n)
      i.some(
        (o) => Number(o.value) === Number(s.value)
      ) || l.push(s);
    const a = [];
    for (const s of i)
      n.some(
        (o) => Number(o.value) === Number(s.value)
      ) || a.push(s);
    if (l.length === 0 && a.length === 0) {
      this.handleLabelChange(t, n, i);
      return;
    }
    for (const s of l)
      this.insertFromArray(t, s, r);
    for (const s of a)
      this.deleteFromArray(t, s, r);
  }
  /**
   * Insert nested components for a number-based source (e.g., number input).
   *
   * @param dataKey - The parent component's dataKey
   * @param targetCount - Target number of nested sections
   * @param currentCount - Current number of nested sections
   * @param sidebarPosition - Current sidebar position
   */
  insertFromNumber(t, n, i, r) {
    var C;
    console.log("[NestedService] insertFromNumber called:", { dataKey: t, targetCount: n, currentCount: i, sidebarPosition: r });
    let l = this.referenceService.getComponent(t);
    console.log("[NestedService] Parent component from reference:", l);
    let a = l == null ? void 0 : l.components;
    console.log("[NestedService] Component components:", a);
    const [s] = this.stores.nested, c = s.details;
    console.log("[NestedService] Looking for dataKey in nested store:", t);
    const o = c.find((g) => g.dataKey === t);
    if (console.log("[NestedService] Nested store entry:", o), o && (a || (a = o.components), l && (l = Ct(Ae({}, l), {
      level: (C = o.level) != null ? C : l.level,
      // Keep the reference component's index - it's the actual instance index
      // label and name from nested store are fallbacks if reference doesn't have them
      label: l.label || o.label,
      name: l.name || o.name
    }), console.log("[NestedService] Updated component with nested store values:", {
      level: l.level,
      index: l.index
    }))), !a) {
      const [g] = this.stores.sidebar, u = g.details.find(
        (b) => b.dataKey === t
      );
      console.log("[NestedService] Sidebar entry (fallback):", u), a = u == null ? void 0 : u.components;
    }
    if (!l || !a) {
      console.log("[NestedService] No component or no components array, returning");
      return;
    }
    const [d] = this.stores.sidebar;
    let f = l.index;
    const x = d.details.find((g) => {
      var b;
      return (b = g.components) != null && b[0] ? g.components[0].some((y) => y.dataKey === t) : !1;
    });
    if (x) {
      const u = x.components[0].findIndex((b) => b.dataKey === t);
      f = [...x.index, 0, u], console.log("[NestedService] Found parent sidebar, computed runtime index:", {
        parentSidebarDataKey: x.dataKey,
        parentSidebarIndex: JSON.stringify(x.index),
        compPosition: u,
        runtimeIndex: JSON.stringify(f)
      });
    }
    const $ = Ct(Ae({}, l), {
      components: a,
      index: f
    });
    console.log("[NestedService] Component with components:", $);
    for (let g = i + 1; g <= n; g++) {
      const u = this.createNestedComponents(
        $,
        g,
        r,
        String(g)
      );
      if (console.log("[NestedService] Created new components:", u.length), u.length !== 0)
        try {
          console.log("[NestedService] About to insertIntoReference"), this.insertIntoReference(u, $), console.log("[NestedService] insertIntoReference completed"), console.log("[NestedService] About to insertIntoSidebar"), this.insertIntoSidebar(
            $,
            { label: `<i>___________ # ${g}</i>`, value: g },
            u,
            r
          ), console.log("[NestedService] insertIntoSidebar completed"), console.log("[NestedService] About to initializeNestedAnswers"), this.initializeNestedAnswers(u, r), console.log("[NestedService] initializeNestedAnswers completed"), console.log("[NestedService] insertFromNumber iteration completed successfully for i:", g);
        } catch (b) {
          console.error("[NestedService] Error in insertFromNumber iteration:", b);
        }
    }
  }
  /**
   * Delete nested components for a number-based source.
   *
   * @param dataKey - The parent component's dataKey
   * @param targetCount - Target number of nested sections
   * @param currentCount - Current number of nested sections
   * @param sidebarPosition - Current sidebar position
   */
  deleteFromNumber(t, n, i, r) {
    const l = this.referenceService.getComponent(t);
    if (l)
      for (let a = i; a > n; a--) {
        const s = [...l.index, a];
        this.removeFromReference(s), this.removeFromSidebar(s, r);
      }
  }
  /**
   * Handle nested component updates based on answer type.
   *
   * @param dataKey - The component's dataKey
   * @param answer - New answer value
   * @param beforeAnswer - Previous answer value
   * @param sidebarPosition - Current sidebar position
   */
  handleNestedUpdate(t, n, i, r) {
    const l = this.referenceService.getComponent(t);
    if (!(!l || l.type !== be.NESTED || !l.sourceQuestion || !this.referenceService.getComponent(
      l.sourceQuestion
    ))) {
      if (Array.isArray(n)) {
        const s = n || [], c = i || [];
        if (s.length > c.length) {
          const o = s.filter(
            (d) => !c.some((f) => f.value === d.value)
          );
          for (const d of o)
            this.insertFromArray(t, d, r);
        } else if (s.length < c.length) {
          const o = c.filter(
            (d) => !s.some((f) => f.value === d.value)
          );
          for (const d of o)
            this.deleteFromArray(t, d, r);
        } else
          this.changeFromArray(
            t,
            s,
            c,
            r
          );
      } else if (typeof n == "number") {
        const s = n, c = i || 0;
        s > c ? this.insertFromNumber(
          t,
          s,
          c,
          r
        ) : s < c && this.deleteFromNumber(
          t,
          s,
          c,
          r
        );
      }
    }
  }
  // ===========================================================================
  // Private Component Creation
  // ===========================================================================
  /**
   * Create a component for a nested section.
   */
  createNestedComponent(t, n) {
    var s, c, o;
    const i = JSON.parse(JSON.stringify(t));
    i.dataKey = `${t.dataKey}${ht.NESTED_SEPARATOR}${n.nestedPosition}`;
    const r = t.name || t.dataKey;
    i.name = `${r}${ht.NESTED_SEPARATOR}${n.nestedPosition}`, t.type === be.PHOTO ? i.answer = [{ label: "lastId#0", value: 0 }] : i.answer || (i.answer = ""), !i.index || !Array.isArray(i.index) ? i.index = [0, n.nestedPosition, 0, n.componentPosition] : n.parentIndex.length === 0 ? (i.index = [...i.index], i.index.length >= 2 && (i.index[i.index.length - 2] = n.nestedPosition)) : i.index = [...n.parentIndex, 0, n.componentPosition], n.parentName && (i.label = i.label.replace("$NAME$", n.parentName)), i.sourceQuestion && (i.sourceQuestion = `${i.sourceQuestion}${ht.NESTED_SEPARATOR}${n.nestedPosition}`), i.sourceOption = this.updateRowMarkerReference(
      i.sourceOption,
      n.nestedPosition
    );
    const l = i.componentVar || [];
    if (i.componentVar = this.updateRowMarkerReferences(
      l,
      n.nestedPosition
    ), console.log("[NestedService] Updated componentVar:", {
      dataKey: i.dataKey,
      type: i.type,
      originalCompVar: l,
      newCompVar: i.componentVar
    }), i.expression && l.length > 0) {
      let d = i.expression;
      for (let f = 0; f < l.length; f++)
        d = d.replace(
          l[f],
          i.componentVar[f]
        );
      i.expression = d;
    }
    const a = i.componentEnable || [];
    if (i.componentEnable = this.updateRowMarkerReferences(
      a,
      n.nestedPosition
    ), i.enableCondition && a.length > 0) {
      let d = i.enableCondition;
      for (let f = 0; f < a.length; f++)
        d = d.replace(
          a[f],
          i.componentEnable[f]
        );
      i.enableCondition = d;
    }
    if (i.enable = this.evaluateComponentEnable(i), i.hasRemark = !1, t.type === be.NESTED && n.parentLevel !== void 0 && (i.level = n.parentLevel + 1, console.log("[NestedService] Set nested component level:", {
      dataKey: i.dataKey,
      parentLevel: n.parentLevel,
      newLevel: i.level
    })), (t.type === be.SECTION || t.type === be.NESTED) && ((s = t.components) != null && s[0])) {
      const d = [], f = t.components[0], x = (o = i.level) != null ? o : ((c = n.parentLevel) != null ? c : 0) + 1;
      for (let $ = 0; $ < f.length; $++) {
        const C = {
          dataKey: f[$].dataKey,
          nestedPosition: n.nestedPosition,
          componentPosition: $,
          sidebarPosition: n.sidebarPosition,
          parentIndex: [...i.index],
          parentName: null,
          parentLevel: x
          // Pass current level so grandchildren get correct level
        };
        d.push(
          this.createNestedComponent(f[$], C)
        );
      }
      i.components = [d];
    }
    return i;
  }
  /**
   * Create all nested components for a parent.
   */
  createNestedComponents(t, n, i, r) {
    var d, f;
    const l = [];
    console.log("[NestedService] createNestedComponents parent:", {
      dataKey: t.dataKey,
      level: t.level,
      index: t.index
    });
    const a = (d = t.components) == null ? void 0 : d[0];
    if (console.log("[NestedService] templateComponents:", a == null ? void 0 : a.length), !a)
      return console.log("[NestedService] No templateComponents, returning empty array"), l;
    const s = (f = t.level) != null ? f : 1, c = s >= 2, o = c ? [...t.index, n] : [];
    console.log("[NestedService] Index strategy:", {
      parentLevel: s,
      shouldUseParentIndex: c,
      parentIndexForChildren: JSON.stringify(o)
    });
    for (let x = 0; x < a.length; x++)
      try {
        console.log(`[NestedService] Creating component ${x}:`, a[x].dataKey);
        const $ = {
          dataKey: a[x].dataKey,
          nestedPosition: n,
          componentPosition: x,
          sidebarPosition: i,
          parentIndex: o,
          parentName: r,
          parentLevel: s
          // Pass parent level so children get correct level
        }, C = this.createNestedComponent(a[x], $);
        console.log(`[NestedService] Created component ${x}:`, C.dataKey, "level:", C.level), l.push(C);
      } catch ($) {
        console.error(`[NestedService] Error creating component ${x}:`, $);
      }
    return console.log("[NestedService] createNestedComponents returning", l.length, "components"), l;
  }
  // ===========================================================================
  // Private Store Operations
  // ===========================================================================
  /**
   * Insert components into the reference store.
   */
  insertIntoReference(t, n) {
    if (t.length === 0) return;
    const [i, r] = this.stores.reference, [l] = this.stores.referenceMap, a = this.findInsertPosition(
      t[0].index,
      i.details
    ), s = [...i.details];
    let c = a;
    const o = l(), d = [];
    for (const f of t)
      f.dataKey in o || (s.splice(c, 0, f), d.push(f), c++);
    Ni(() => {
      r("details", s), this.referenceService.rebuildIndexMap(), d.length > 0 && this.referenceService.registerDynamicComponents(d);
    });
  }
  /**
   * Remove components from the reference store.
   */
  removeFromReference(t) {
    const [n, i] = this.stores.reference, r = n.details.filter((l) => {
      const a = [...l.index];
      return a.length = t.length, JSON.stringify(a) !== JSON.stringify(t);
    });
    Ni(() => {
      i("details", r), this.referenceService.rebuildIndexMap();
    });
  }
  /**
   * Insert a sidebar entry.
   */
  insertIntoSidebar(t, n, i, r) {
    var f, x;
    const [l, a] = this.stores.sidebar;
    console.log("[NestedService] insertIntoSidebar:", {
      parentDataKey: t.dataKey,
      parentLevel: t.level,
      parentIndex: JSON.stringify(t.index),
      answer: n.value
    });
    const s = {
      dataKey: `${t.dataKey}${ht.NESTED_SEPARATOR}${n.value}`,
      name: t.name,
      label: t.label,
      description: n.label,
      level: (f = t.level) != null ? f : 1,
      index: [...t.index, Number(n.value)],
      components: [i],
      sourceQuestion: t.sourceQuestion,
      enable: (x = t.enable) != null ? x : !0,
      enableCondition: t.enableCondition,
      componentEnable: t.componentEnable
    };
    if (console.log("[NestedService] Creating sidebar entry:", {
      dataKey: s.dataKey,
      level: s.level,
      index: JSON.stringify(s.index),
      parentIndex: JSON.stringify(t.index),
      label: s.label
    }), l.details.some(($) => $.dataKey === s.dataKey)) {
      console.log("[NestedService] Sidebar entry already exists, skipping:", s.dataKey);
      return;
    }
    const o = this.findSidebarInsertPosition(
      s.index,
      l.details,
      r
    );
    console.log("[NestedService] Inserting sidebar at position:", {
      insertPos: o,
      currentSidebarLength: l.details.length
    });
    const d = [...l.details];
    d.splice(o, 0, s), console.log("[NestedService] Sidebar after insert:", {
      newLength: d.length,
      entries: d.map(($) => ({
        dataKey: $.dataKey,
        level: $.level,
        index: JSON.stringify($.index)
      }))
    }), a("details", d), this.registerNestedComponentsInStore(i);
  }
  /**
   * Register nested components (type 2) in the nested store.
   * This ensures their templates are available for deeper nested levels.
   *
   * @param components - The components to scan for nested types
   */
  registerNestedComponentsInStore(t) {
    const [n, i] = this.stores.nested, r = [...n.details];
    for (const l of t)
      l.type === be.NESTED && l.components && (r.some((s) => s.dataKey === l.dataKey) || (console.log("[NestedService] Registering nested component in store:", l.dataKey, "level:", l.level), r.push({
        dataKey: l.dataKey,
        components: l.components,
        level: l.level,
        // Use component's level (set in createNestedComponent)
        index: l.index,
        label: l.label,
        name: l.name,
        description: l.description,
        sourceQuestion: l.sourceQuestion,
        enable: l.enable,
        enableCondition: l.enableCondition,
        componentEnable: l.componentEnable
      })));
    r.length > n.details.length && i("details", r);
  }
  /**
   * Remove a sidebar entry.
   */
  removeFromSidebar(t, n) {
    const [i, r] = this.stores.sidebar, l = i.details.filter((a) => {
      const s = [...a.index];
      return s.length = t.length, JSON.stringify(s) !== JSON.stringify(t);
    });
    r("details", l);
  }
  /**
   * Initialize answers for newly created nested components.
   */
  initializeNestedAnswers(t, n) {
    const [i] = this.stores.response, [r] = this.stores.preset;
    for (const l of t) {
      let a = l.answer || "";
      if (l.type === be.VARIABLE)
        a = this.expressionService.evaluateVariable(
          l.expression || "",
          l.dataKey
        );
      else {
        const s = i.details.answers.find(
          (c) => c.dataKey === l.dataKey
        );
        if (s)
          a = s.answer;
        else {
          const c = r.details.predata.find(
            (o) => o.dataKey === l.dataKey
          );
          c && this.shouldUsePreset(l) && (a = c.answer);
        }
      }
      this.referenceService.updateComponent(l.dataKey, "answer", a);
    }
  }
  // ===========================================================================
  // Private Helper Methods
  // ===========================================================================
  /**
   * Update a reference string with row marker to include nested position.
   * Transforms dataKey@$ROW$ -> dataKey#nestedPosition
   */
  updateRowMarkerReference(t, n) {
    if (!t) return t;
    const i = t.split("@");
    if (i.length < 2) return t;
    const r = i[1];
    return ["$ROW$", "$ROW1$", "$ROW2$"].includes(r) ? `${i[0]}${ht.NESTED_SEPARATOR}${n}` : t;
  }
  /**
   * Update an array of references with row markers.
   * Transforms dataKey@$ROW$ -> dataKey#nestedPosition
   */
  updateRowMarkerReferences(t, n) {
    return t.map((i) => {
      const r = i.split("@");
      if (r.length < 2) return i;
      const l = r[1];
      return ["$ROW$", "$ROW1$", "$ROW2$"].includes(l) ? `${r[0]}${ht.NESTED_SEPARATOR}${n}` : i;
    });
  }
  /**
   * Evaluate if a component should be enabled.
   */
  evaluateComponentEnable(t) {
    return !t.enableCondition || t.enableCondition.trim() === "" ? !0 : this.expressionService.evaluateEnableCondition(
      t.enableCondition,
      t.dataKey
    );
  }
  /**
   * Check if preset should be used for a component.
   */
  shouldUsePreset(t) {
    const n = this.config;
    return n.initialMode === 2 || n.initialMode === 1 && !!t.presetMaster;
  }
  /**
   * Find the correct position to insert new reference components.
   */
  findInsertPosition(t, n) {
    const i = t.length;
    for (let r = i; r > 1; r--) {
      const l = t.slice(0, r);
      for (let a = n.length - 1; a >= 0; a--) {
        const s = n[a].index.slice(0, r);
        if (JSON.stringify(s) === JSON.stringify(l))
          return a + 1;
      }
    }
    return n.length;
  }
  /**
   * Find the correct position to insert a new sidebar entry.
   */
  findSidebarInsertPosition(t, n, i) {
    var l, a;
    const r = t.length;
    for (let s = r; s > 1; s--) {
      const c = t.slice(0, s);
      for (let o = n.length - 1; o >= i; o--) {
        if (!n[o]) continue;
        const d = n[o].index.slice(0, s);
        if (JSON.stringify(d) === JSON.stringify(c)) {
          const f = (l = t[s]) != null ? l : 0, x = (a = n[o].index[s]) != null ? a : 0;
          if (s === r - 1 || f >= x)
            return o + 1;
        }
      }
    }
    return n.length;
  }
  /**
   * Handle label changes in nested components (same values, different labels).
   */
  handleLabelChange(t, n, i) {
    var s;
    const [r, l] = this.stores.sidebar, a = this.referenceService.getComponent(t);
    if (a)
      for (const c of n) {
        if (!i.find(
          (g) => g.value === c.value && g.label !== c.label
        )) continue;
        const d = [...a.index, Number(c.value)], f = r.details.findIndex(
          (g) => JSON.stringify(g.index) === JSON.stringify(d)
        );
        if (f === -1) continue;
        const x = r.details[f].description, $ = c.label, C = Ae({}, r.details[f]);
        if (C.description = $, (s = C.components) != null && s[0]) {
          const g = C.components[0].map((u) => Ct(Ae({}, u), {
            label: u.label.replace(x || "", $)
          }));
          C.components = [g];
        }
        l("details", f, C);
      }
  }
}
class $o {
  constructor(t, n, i, r, l, a, s) {
    Ne(this, "stores");
    Ne(this, "referenceService");
    Ne(this, "expressionService");
    Ne(this, "validationService");
    Ne(this, "enableService");
    Ne(this, "nestedService");
    Ne(this, "historyService", null);
    Ne(this, "config");
    this.stores = t, this.referenceService = n, this.expressionService = i, this.validationService = r, this.enableService = l, this.nestedService = a, this.config = s;
  }
  /**
   * Set the history service (to avoid circular dependency).
   */
  setHistoryService(t) {
    this.historyService = t;
  }
  // ===========================================================================
  // Public Answer Methods
  // ===========================================================================
  /**
   * Save an answer for a component and trigger cascading updates.
   *
   * @param dataKey - The component's dataKey
   * @param value - The new answer value
   * @param options - Save options
   */
  saveAnswer(t, n, i = {}) {
    const {
      skipValidation: r = !1,
      skipCascade: l = !1,
      isInitial: a = !1,
      activePosition: s = 0
    } = i, c = this.referenceService.getComponent(t);
    if (!c)
      return;
    const o = this.getPreviousAnswer(c, n);
    this.historyService && this.historyService.addEntry({
      type: "saveAnswer",
      dataKey: t,
      position: this.referenceService.getIndex(t),
      attribute: "answer",
      value: c.answer,
      timestamp: Date.now()
    }), this.referenceService.updateComponent(t, "answer", n), !r && !a && this.validationService.validateComponent(t), this.hasAnswerChanged(o, n) && (l || this.runCascadingUpdates(t, n, o, s));
  }
  /**
   * Update the enable state for a component.
   *
   * @param dataKey - The component's dataKey
   * @param enable - The new enable state
   */
  saveEnable(t, n) {
    const i = this.referenceService.getComponent(t);
    i && i.enable !== n && (this.historyService && this.historyService.addEntry({
      type: "saveAnswer",
      dataKey: t,
      position: this.referenceService.getIndex(t),
      attribute: "enable",
      value: i.enable,
      timestamp: Date.now()
    }), this.referenceService.updateComponent(t, "enable", n));
  }
  /**
   * Get the current answer for a component.
   *
   * @param dataKey - The component's dataKey
   * @returns The answer value or undefined
   */
  getAnswer(t) {
    const n = this.referenceService.getComponent(t);
    return n == null ? void 0 : n.answer;
  }
  /**
   * Clear the answer for a component.
   *
   * @param dataKey - The component's dataKey
   */
  clearAnswer(t) {
    const n = this.referenceService.getComponent(t);
    if (!n) return;
    const i = this.getDefaultValue(n.type);
    this.saveAnswer(t, i);
  }
  /**
   * Set answers from a response object.
   *
   * @param answers - Array of { dataKey, answer } objects
   */
  loadAnswers(t) {
    for (const { dataKey: n, answer: i } of t)
      this.saveAnswer(n, i, {
        skipValidation: !0,
        skipCascade: !0,
        isInitial: !0
      });
  }
  // ===========================================================================
  // Private Cascading Methods
  // ===========================================================================
  /**
   * Run all cascading updates after an answer change.
   */
  runCascadingUpdates(t, n, i, r) {
    console.log("[AnswerService] runCascadingUpdates called:", { dataKey: t, value: n, beforeAnswer: i, activePosition: r });
    const l = this.referenceService.getComponent(t);
    if (!l) {
      console.log("[AnswerService] No component found for dataKey:", t);
      return;
    }
    if (this.enableService.evaluateDependents(t), !l.enable) {
      console.log("[AnswerService] Component is disabled, stopping cascade");
      return;
    }
    this.validationService.validateDependents(t), this.updateSourceOptionDependents(t, n), this.updateVariableDependents(t), console.log("[AnswerService] About to call handleNestedUpdates"), this.handleNestedUpdates(t, n, i, r), this.updateDisabledSections();
  }
  /**
   * Update components that use this dataKey as sourceOption.
   */
  updateSourceOptionDependents(t, n) {
    if (!Array.isArray(n)) return;
    const i = this.referenceService.getSourceOptionDependents(t);
    for (const r of i) {
      const l = this.referenceService.getComponent(r);
      if (!l || !l.enable || !l.answer) continue;
      const a = l.answer.filter(
        (s) => n.some((c) => c.value === s.value)
      );
      a.length !== l.answer.length && this.saveAnswer(r, a);
    }
  }
  /**
   * Update variable components that depend on this dataKey.
   */
  updateVariableDependents(t) {
    const n = this.referenceService.getVariableDependents(t);
    for (const i of n)
      this.evaluateVariableComponent(i);
  }
  /**
   * Evaluate and update a variable component.
   */
  evaluateVariableComponent(t) {
    const n = this.referenceService.getComponent(t);
    if (!(!n || n.type !== be.VARIABLE) && n.expression)
      try {
        const i = this.expressionService.evaluateVariable(
          n.expression,
          t
        );
        this.saveAnswer(t, i, { skipCascade: !1 });
      } catch (i) {
        console.error(`Error evaluating variable ${t}:`, i), this.saveAnswer(t, void 0, { isInitial: !0 });
      }
  }
  /**
   * Handle updates for nested components.
   */
  handleNestedUpdates(t, n, i, r) {
    const l = this.referenceService.getNestedDependents(t);
    console.log("[AnswerService] handleNestedUpdates:", {
      dataKey: t,
      value: n,
      beforeAnswer: i,
      nestedDependents: Array.from(l)
    });
    for (const a of l) {
      const s = this.referenceService.getComponent(a);
      console.log("[AnswerService] Processing nested:", { nestedKey: a, nested: s, type: s == null ? void 0 : s.type }), !(!s || s.type !== be.NESTED) && (typeof n == "number" || typeof n == "string" ? (console.log("[AnswerService] Handling number-based nested"), this.handleNumberBasedNested(
        a,
        Number(n),
        Number(i) || 0,
        r
      )) : Array.isArray(n) && (console.log("[AnswerService] Handling array-based nested"), this.handleArrayBasedNested(
        a,
        n,
        i || [],
        r
      )));
    }
  }
  /**
   * Handle number-based nested component updates.
   */
  handleNumberBasedNested(t, n, i, r) {
    n > i ? this.nestedService.insertFromNumber(
      t,
      n,
      i,
      r
    ) : n < i && this.nestedService.deleteFromNumber(
      t,
      n,
      i,
      r
    );
  }
  /**
   * Handle array-based nested component updates.
   */
  handleArrayBasedNested(t, n, i, r) {
    const l = this.cleanNestedOptions(n), a = this.cleanNestedOptions(i);
    console.log("[AnswerService] handleArrayBasedNested:", {
      nestedKey: t,
      cleanCurrent: l,
      cleanPrevious: a,
      currentLength: l.length,
      previousLength: a.length
    });
    for (const s of l) {
      const c = a.some((o) => o.value === s.value);
      if (!c) {
        const [o] = this.stores.sidebar, d = o.details.some(
          (f) => f.dataKey === `${t}#${s.value}`
        );
        console.log("[AnswerService] Checking item to add:", { item: s, existsInPrevious: c, existsInSidebar: d }), d || (console.log("[AnswerService] Calling insertFromArray for:", s), this.nestedService.insertFromArray(t, s, r));
      }
    }
    for (const s of a)
      l.some((o) => o.value === s.value) || (console.log("[AnswerService] Removing item:", s), this.nestedService.deleteFromArray(t, s, r));
  }
  /**
   * Clean nested options by removing invalid entries.
   */
  cleanNestedOptions(t) {
    return t.filter((n) => Number(n.value) === 0 ? !String(n.label).split("#")[1] : !0);
  }
  /**
   * Update the disabled sections cache.
   */
  updateDisabledSections() {
    this.enableService.getDisabledSectionIndices();
  }
  // ===========================================================================
  // Private Helper Methods
  // ===========================================================================
  /**
   * Get the previous answer value for change detection.
   */
  getPreviousAnswer(t, n) {
    return t.answer !== void 0 && t.answer !== "" ? t.answer : typeof n == "number" || typeof n == "string" ? 0 : [];
  }
  /**
   * Check if the answer has changed.
   */
  hasAnswerChanged(t, n) {
    return JSON.stringify(t) !== JSON.stringify(n);
  }
  /**
   * Get the default value for a component type.
   */
  getDefaultValue(t) {
    return t === be.CHECKBOX || t === be.MULTIPLE_SELECT || t === be.CSV ? [] : "";
  }
}
class _o {
  constructor(t, n) {
    Ne(this, "stores");
    Ne(this, "referenceService");
    Ne(this, "enabled", !0);
    Ne(this, "referenceHistory", []);
    Ne(this, "sidebarHistory", []);
    this.stores = t, this.referenceService = n;
  }
  // ===========================================================================
  // Public History Methods
  // ===========================================================================
  /**
   * Enable or disable history tracking.
   *
   * @param enabled - Whether to enable history
   */
  setEnabled(t) {
    this.enabled = t;
  }
  /**
   * Check if history is enabled.
   */
  isEnabled() {
    return this.enabled;
  }
  /**
   * Add a history entry.
   *
   * @param entry - The history entry to add
   */
  addEntry(t) {
    if (this.enabled)
      if (t.type === "update_sidebar") {
        if (this.sidebarHistory.length === 0) {
          const [n] = this.stores.sidebar;
          this.sidebarHistory = JSON.parse(JSON.stringify(n.details));
        }
      } else
        this.referenceHistory.push(t);
  }
  /**
   * Add a save answer history entry.
   *
   * @param dataKey - The component's dataKey
   * @param position - The position in reference.details
   * @param attribute - The attribute being changed ('answer', 'enable', 'validate')
   * @param previousValue - The previous value before the change
   */
  addSaveAnswerEntry(t, n, i, r) {
    this.enabled && this.addEntry({
      type: "saveAnswer",
      dataKey: t,
      position: n,
      attribute: i,
      value: r,
      timestamp: Date.now()
    });
  }
  /**
   * Add an insert reference detail history entry.
   *
   * @param position - The position of the parent component
   * @param items - Array of inserted items with position and dataKey
   */
  addInsertEntry(t, n) {
    this.enabled && this.addEntry({
      type: "insert_ref_detail",
      dataKey: null,
      position: t,
      attribute: null,
      value: n,
      timestamp: Date.now()
    });
  }
  /**
   * Add a delete reference detail history entry.
   *
   * @param position - The position of the parent component
   * @param items - Array of deleted items with position and full data
   */
  addDeleteEntry(t, n) {
    this.enabled && this.addEntry({
      type: "delete_ref_detail",
      dataKey: null,
      position: t,
      attribute: null,
      value: n,
      timestamp: Date.now()
    });
  }
  /**
   * Add a sidebar update history entry.
   */
  addSidebarEntry() {
    this.enabled && this.addEntry({
      type: "update_sidebar",
      dataKey: null,
      position: null,
      attribute: null,
      value: null,
      timestamp: Date.now()
    });
  }
  /**
   * Reload data from history (undo all changes).
   * Restores the form to its initial state.
   */
  reloadFromHistory() {
    const [, t] = this.stores.reference, [n] = this.stores.reference, [, i] = this.stores.sidebar;
    let r = JSON.parse(JSON.stringify(n.details));
    for (let l = this.referenceHistory.length - 1; l >= 0; l--) {
      const a = this.referenceHistory[l];
      switch (a.type) {
        case "insert_ref_detail":
          r = this.undoInsert(r, a.value);
          break;
        case "delete_ref_detail":
          r = this.undoDelete(r, a.value);
          break;
        case "saveAnswer":
          r = this.undoSaveAnswer(
            r,
            a.dataKey,
            a.position,
            a.attribute,
            a.value
          );
          break;
      }
    }
    t("details", r), this.referenceService.rebuildIndexMap(), this.sidebarHistory.length > 0 && i("details", JSON.parse(JSON.stringify(this.sidebarHistory)));
  }
  /**
   * Clear all history.
   */
  clear() {
    this.referenceHistory = [], this.sidebarHistory = [];
  }
  /**
   * Get the number of history entries.
   */
  getEntryCount() {
    return this.referenceHistory.length;
  }
  /**
   * Check if there is any history to undo.
   */
  canUndo() {
    return this.referenceHistory.length > 0;
  }
  // ===========================================================================
  // Private Undo Methods
  // ===========================================================================
  /**
   * Undo an insert operation.
   */
  undoInsert(t, n) {
    var i;
    for (let r = n.length - 1; r >= 0; r--) {
      const l = n[r];
      let a = l.pos;
      if (((i = t[a]) == null ? void 0 : i.dataKey) !== l.data) {
        const s = t.findIndex((c) => c.dataKey === l.data);
        s !== -1 && (a = s);
      }
      a !== -1 && a < t.length && t.splice(a, 1);
    }
    return t;
  }
  /**
   * Undo a delete operation.
   */
  undoDelete(t, n) {
    for (let i = n.length - 1; i >= 0; i--) {
      const r = n[i];
      t.splice(r.pos, 0, JSON.parse(JSON.stringify(r.data)));
    }
    return t;
  }
  /**
   * Undo a save answer operation.
   */
  undoSaveAnswer(t, n, i, r, l) {
    var a;
    if (((a = t[i]) == null ? void 0 : a.dataKey) !== n) {
      const s = t.findIndex((c) => c.dataKey === n);
      s !== -1 && (i = s);
    }
    if (i === -1 || i >= t.length)
      return t;
    if (r === "answer")
      t[i].answer = l;
    else if (r === "enable")
      t[i].enable = l;
    else if (r === "validate") {
      const s = l;
      t[i].validationState = s.validationState, t[i].validationMessage = JSON.parse(
        JSON.stringify(s.validationMessage)
      );
    }
    return t;
  }
}
function So(e, t) {
  const n = new go(e), i = new fo(e, n, t), r = new yo(e, n, i, t), l = new po(e, n, i, t), a = new ko(e, n, i, t), s = new _o(e, n), c = new $o(e, n, i, r, l, a, t);
  return c.setHistoryService(s), {
    reference: n,
    expression: i,
    validation: r,
    enable: l,
    nested: a,
    answer: c,
    history: s
  };
}
const Sl = Pn(), Co = (e) => m(Sl.Provider, {
  get value() {
    return e.services;
  },
  get children() {
    return e.children;
  }
});
function Bt() {
  const e = Kn(Sl);
  if (!e)
    throw new Error("useServices must be used within a ServiceProvider. Make sure your component is wrapped with <ServiceProvider services={...}>.");
  return e;
}
function wv() {
  return Bt().reference;
}
function xv() {
  return Bt().expression;
}
function yv() {
  return Bt().validation;
}
function pv() {
  return Bt().enable;
}
function kv() {
  return Bt().nested;
}
function $v() {
  return Bt().answer;
}
function _v() {
  return Bt().history;
}
var Mo = /* @__PURE__ */ k("<span class=text-pink-600>*"), Io = /* @__PURE__ */ k('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Eo = /* @__PURE__ */ k('<div class="italic text-xs font-extralight text-zinc-400 ">'), Oo = /* @__PURE__ */ k("<div class=flex-1><div>"), Lo = /* @__PURE__ */ k('<span class="absolute top-0 right-0 inline-flex items-center justify-center h-6 w-6 text-xs font-semibold text-white transform translate-x-1/2 -translate-y-1/4 bg-pink-600/80 rounded-full">'), Ao = /* @__PURE__ */ k('<div class=shrink-0><button class="relative inline-block bg-white p-2 h-10 w-10 text-gray-500 rounded-full hover:bg-yellow-100 hover:text-yellow-400 hover:border-yellow-100 border-2 border-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z">'), Ro = /* @__PURE__ */ k('<div class="grid md:grid-cols-3 border-b border-gray-300/[.50] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 md:col-span-2 flex items-start gap-2">'), No = /* @__PURE__ */ k('<div class="w-full mx-auto flex-1"><div class="animate-pulse flex space-x-4"><div class="flex-1 space-y-3 py-1"><div class="h-3 bg-gray-100 rounded-full"></div><div class="h-3 bg-gray-100 rounded-full"></div><div class="h-3 bg-gray-100 rounded-full">'), Vo = /* @__PURE__ */ k('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), To = /* @__PURE__ */ k('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), jo = /* @__PURE__ */ k('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="flex-1 text-justify">');
const Do = (e) => {
  const t = Bt(), [n] = It(), [i] = Et(), [r] = zi(), [l, a] = K(""), [s, c] = K(!1), [o, d] = K([]), [f, x] = K(""), $ = e.config, [C, g] = K($.formMode > 1 ? !0 : e.component.disableInput);
  switch (e.component.typeOption) {
    case 1: {
      try {
        let v = e.component.options.map((w, E) => ({
          value: w.value,
          label: w.label
        })), h = e.value && e.value != "" ? e.value[0].value : "";
        Me(() => {
          a(e.component.label), d(v);
          let w = v.filter((E) => E.value.includes(h))[0] && h != "" ? v.filter((E) => E.value.includes(h))[0].label : "";
          x(w), c(!0);
        });
      } catch (v) {
        ke(i.details.language[0].fetchFailed);
      }
      break;
    }
    case 2: {
      try {
        if ($.lookupMode === 1) {
          let v = e.component.sourceAPI[0], h = `${v.baseUrl}`;
          if (v.filterDependencies !== void 0 && v.filterDependencies.length > 0) {
            let O, N, T = h;
            O = v.filterDependencies.map((A, z) => {
              let D = A.sourceAnswer.split("@"), P = n.details.find((B) => B.dataKey == D[0]);
              if (P.answer) {
                if (P.answer.length > 0) {
                  let B = encodeURI(P.answer[P.answer.length - 1].value);
                  N = `${A.params}=${B}`;
                }
              } else
                g(!0);
              return N;
            }).join("&"), h = `${T}?${O}`;
          }
          if (v.subResourceDependencies !== void 0 && v.subResourceDependencies.length > 0) {
            let O, N, T = h;
            O = v.subResourceDependencies.map((A, z) => {
              let D = A.sourceAnswer.split("@"), P = n.details.find((B) => B.dataKey == D[0]);
              return P.answer ? P.answer.length > 0 && (N = `${encodeURI(P.answer[P.answer.length - 1].value)}/${A.params}`) : g(!0), N;
            }).join("/"), h = `${T}/${O}`;
          }
          let w = {
            headers: JSON.stringify(v.headers),
            method: "GET"
          };
          const E = (O) => ce(null, null, function* () {
            return yield fetch(O, {
              head: w
            }).catch((N) => ({
              success: !1,
              data: {},
              message: "500"
            })).then((N) => ce(null, null, function* () {
              if (N.status === 200) {
                let T = yield N.json(), A = new Object();
                return A.success = !0, A.data = v.data !== "" ? T[v.data] : T, A.message = T.msg, A;
              } else
                return {
                  success: !1,
                  data: {},
                  message: N.status
                };
            })).then((N) => N);
          }), [I] = Dn(() => h, E);
          let M = e.value && e.value != "" ? e.value[0].value : "";
          Me(() => {
            if (a(e.component.label), I())
              if (!I().success)
                ke(i.details.language[0].fetchFailed);
              else {
                let O = [];
                I().data.map((T, A) => {
                  O.push({
                    value: T[v.value],
                    label: T[v.label]
                  });
                });
                let N = O.find((T) => T.value == M) && M != "" ? O.find((T) => T.value == M).label : "";
                d(O), x(N), c(!0);
              }
          });
        } else if ($.lookupMode === 2) {
          let v, h = [];
          v = e.component.sourceAPI;
          let w = v[0].id, E = v[0].version;
          v[0].parentCondition.length > 0 && v[0].parentCondition.map((O, N) => {
            let T = O.value.split("@"), A = n.details.find((z) => z.dataKey == T[0]);
            if (A.answer && A.answer.length > 0) {
              let z = A.answer[A.answer.length - 1].value.toString();
              h.push({
                key: O.key,
                value: z
              });
            }
          });
          let I = (O) => {
            let N = [];
            if (O.data.length > 0) {
              let T = v[0].value, A = v[0].label, z = e.value && e.value != "" ? e.value[0].value : "";
              O.data.map((P, B) => {
                N.push({
                  value: P[T],
                  label: P[A]
                });
              });
              let D = N.find((P) => P.value == z) && z != "" ? N.find((P) => P.value == z).label : "";
              a(e.component.label), d(N), x(D), c(!0);
            }
          };
          const M = e.MobileOfflineSearch(w, E, h, I);
        }
      } catch (v) {
        ke(i.details.language[0].fetchFailed);
      }
      break;
    }
    case 3: {
      try {
        let v, h, w = e.value && e.value != "" ? e.value[0].value : "";
        if (e.component.sourceOption !== void 0 && e.component.typeOption === 3) {
          const I = n.details.findIndex((M) => M.dataKey === e.component.sourceOption);
          n.details[I].type, v = n.details[I].answer, v != null ? h = v.filter((M, O) => M.value != 0).map((M, O) => ({
            value: M.value,
            label: M.label
          })) : h = [];
        }
        let E = h.find((I) => I.value == w) && w != "" ? h.find((I) => I.value == w).label : "";
        Me(() => {
          a(e.component.label), d(h), x(E), c(!0);
        });
      } catch (v) {
        ke(i.details.language[0].fetchFailed);
      }
      break;
    }
    default: {
      try {
        let v;
        e.component.options ? v = e.component.options.map((w, E) => ({
          value: w.value,
          label: w.label
        })) : v = [];
        let h = e.value && e.value != "" ? e.value[0].value : "";
        Me(() => {
          a(e.component.label), d(v);
          let w = v.filter((E) => E.value.includes(h))[0] && h != "" ? v.filter((E) => E.value.includes(h))[0].label : "";
          x(w), c(!0);
        });
      } catch (v) {
        ke(i.details.language[0].fetchFailed);
      }
      break;
    }
  }
  let u = (v) => {
    n.details.map((h) => {
      h.sourceAPI && h.sourceAPI.length > 0 && (h.sourceAPI[0].filterDependencies !== void 0 && h.sourceAPI[0].filterDependencies.length > 0 && h.sourceAPI[0].filterDependencies.map((E) => {
        if (E.sourceAnswer == v && h.answer != null) {
          let I = r.details.findIndex((M, O) => M.components[0].findIndex((T, A) => (T.dataKey, h.dataKey, A)) == -1 ? 0 : O);
          t.answer.saveAnswer(h.dataKey, null, {
            activePosition: I
          }), u(h.dataKey);
        } else
          return;
      }), h.sourceAPI[0].subResourceDependencies !== void 0 && h.sourceAPI[0].subResourceDependencies.length > 0 && h.sourceAPI[0].subResourceDependencies.map((E) => {
        if (E.sourceAnswer == v && h.answer != null) {
          let I = r.details.findIndex((M, O) => M.components[0].findIndex((T, A) => (T.dataKey, h.dataKey, A)) == -1 ? 0 : O);
          t.answer.saveAnswer(h.dataKey, null, {
            activePosition: I
          }), u(h.dataKey);
        } else
          return;
      }));
    });
  }, b = (v, h) => {
    if (v != "" && v != null) {
      let w = JSON.parse(JSON.stringify(e.value));
      w = [], w.push({
        value: v,
        label: h
      }), e.onValueChange(w), u(e.component.dataKey);
    }
  };
  const [y, S] = K(!1), p = () => {
    y() ? S(!1) : S(!0);
  }, [L] = K(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [V] = K($.formMode > 2 && e.comments == 0);
  return (() => {
    var v = Ro(), h = v.firstChild, w = h.firstChild, E = w.firstChild, I = w.nextSibling, M = h.nextSibling;
    return _(w, m(j, {
      get when() {
        return e.component.required;
      },
      get children() {
        return Mo();
      }
    }), null), _(w, m(j, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var O = Io();
        return O.$$click = p, O;
      }
    }), null), _(I, m(j, {
      get when() {
        return y();
      },
      get children() {
        var O = Eo();
        return R(() => O.innerHTML = e.component.hint), O;
      }
    })), _(M, m(j, {
      get when() {
        return s();
      },
      get fallback() {
        return No();
      },
      get children() {
        var O = Oo(), N = O.firstChild;
        return _(N, m(Mn, jt({
          class: "formgear-select w-full rounded font-light text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-0 border-transparent focus:outline-none  disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
        }, () => Cn(o() || [], {
          key: "label",
          filterable: !0
        }), {
          get disabled() {
            return C();
          },
          onChange: (T) => b(T ? T.value : "", T ? T.label : ""),
          get initialValue() {
            return {
              value: e.value && e.value != "" ? e.value[0].value : "",
              label: f
            };
          }
        }))), _(O, m(j, {
          get when() {
            var T;
            return ((T = e.validationMessage) == null ? void 0 : T.length) > 0;
          },
          get children() {
            return m(fe, {
              get each() {
                return e.validationMessage;
              },
              children: (T) => (() => {
                var A = jo(), z = A.firstChild, D = z.firstChild;
                return _(z, m(we, {
                  get children() {
                    return [m(ee, {
                      get when() {
                        return e.classValidation === 1;
                      },
                      get children() {
                        return Vo();
                      }
                    }), m(ee, {
                      get when() {
                        return e.classValidation === 2;
                      },
                      get children() {
                        return To();
                      }
                    })];
                  }
                }), D), D.innerHTML = T, R((P) => te(z, {
                  " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
                  " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
                }, P)), A;
              })()
            });
          }
        }), null), R((T) => te(N, {
          " border rounded border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
          " border rounded border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
        }, T)), O;
      }
    }), null), _(M, m(j, {
      get when() {
        return L();
      },
      get children() {
        var O = Ao(), N = O.firstChild;
        return N.firstChild, N.$$click = (T) => e.openRemark(e.component.dataKey), _(N, m(j, {
          get when() {
            return ue(() => !!e.comments)() && e.comments > 0;
          },
          get children() {
            var T = Lo();
            return _(T, () => e.comments), T;
          }
        }), null), R(() => N.disabled = V()), O;
      }
    }), null), R(() => E.innerHTML = l()), v;
  })();
};
ye(["click"]);
var Po = /* @__PURE__ */ k("<span class=text-pink-600>*"), Ko = /* @__PURE__ */ k('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Bo = /* @__PURE__ */ k('<div class="italic text-xs font-extralight text-zinc-400 ">'), zo = /* @__PURE__ */ k('<input type=number class="w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"placeholder>'), Fo = /* @__PURE__ */ k('<input type=number class="w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"placeholder oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);">'), Ho = /* @__PURE__ */ k('<span class="absolute top-0 right-0 inline-flex items-center justify-center h-6 w-6 text-xs font-semibold text-white transform translate-x-1/2 -translate-y-1/4 bg-pink-600/80 rounded-full">'), Jo = /* @__PURE__ */ k('<div class=shrink-0><button class="relative inline-block bg-white p-2 h-10 w-10 text-gray-500 rounded-full hover:bg-yellow-100 hover:text-yellow-400 hover:border-yellow-100 border-2 border-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z">'), Uo = /* @__PURE__ */ k('<div class="grid md:grid-cols-3 p-2 border-b border-gray-300/[.40] dark:border-gray-200/[.10]"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 md:col-span-2 flex items-start gap-2"><div class=flex-1>'), Wo = /* @__PURE__ */ k('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), qo = /* @__PURE__ */ k('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Go = /* @__PURE__ */ k('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="flex-1 text-justify">');
const Yo = (e) => {
  const t = e.config, [n] = K(t.formMode > 1 ? !0 : e.component.disableInput), [i, r] = K(!1), l = () => {
    i() ? r(!1) : r(!0);
  }, [a] = K(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [s] = K(t.formMode > 2 && e.comments == 0);
  return (() => {
    var c = Uo(), o = c.firstChild, d = o.firstChild, f = d.firstChild, x = d.nextSibling, $ = o.nextSibling, C = $.firstChild;
    return _(d, m(j, {
      get when() {
        return e.component.required;
      },
      get children() {
        return Po();
      }
    }), null), _(d, m(j, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var g = Ko();
        return g.$$click = l, g;
      }
    }), null), _(x, m(j, {
      get when() {
        return i();
      },
      get children() {
        var g = Bo();
        return R(() => g.innerHTML = e.component.hint), g;
      }
    })), _(C, m(j, {
      get when() {
        return e.component.lengthInput === void 0;
      },
      get children() {
        var g = zo();
        return g.addEventListener("change", (u) => {
          e.onValueChange(parseInt(u.currentTarget.value));
        }), R((u) => {
          var b = e.component.dataKey, y = {
            " border border-solid border-gray-300 ": e.classValidation === 0,
            " border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
            " border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
          }, S = n();
          return b !== u.e && J(g, "name", u.e = b), u.t = te(g, y, u.t), S !== u.a && (g.disabled = u.a = S), u;
        }, {
          e: void 0,
          t: void 0,
          a: void 0
        }), R(() => g.value = e.value), g;
      }
    }), null), _(C, m(j, {
      get when() {
        return ue(() => e.component.lengthInput !== void 0)() && e.component.lengthInput.length > 0;
      },
      get children() {
        var g = Fo();
        return g.addEventListener("change", (u) => {
          e.onValueChange(parseInt(u.currentTarget.value));
        }), R((u) => {
          var b = e.component.dataKey, y = {
            " border border-solid border-gray-300 ": e.classValidation === 0,
            " border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
            " border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
          }, S = n(), p = e.component.lengthInput[0].maxlength !== void 0 ? e.component.lengthInput[0].maxlength : "", L = e.component.lengthInput[0].minlength !== void 0 ? e.component.lengthInput[0].minlength : "", V = e.component.rangeInput && e.component.rangeInput[0].max !== void 0 ? e.component.rangeInput[0].max : "", v = e.component.rangeInput && e.component.rangeInput[0].min !== void 0 ? e.component.rangeInput[0].min : "";
          return b !== u.e && J(g, "name", u.e = b), u.t = te(g, y, u.t), S !== u.a && (g.disabled = u.a = S), p !== u.o && J(g, "maxlength", u.o = p), L !== u.i && J(g, "minlength", u.i = L), V !== u.n && J(g, "max", u.n = V), v !== u.s && J(g, "min", u.s = v), u;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0,
          i: void 0,
          n: void 0,
          s: void 0
        }), R(() => g.value = e.value), g;
      }
    }), null), _(C, m(j, {
      get when() {
        var g;
        return ((g = e.validationMessage) == null ? void 0 : g.length) > 0;
      },
      get children() {
        return m(fe, {
          get each() {
            return e.validationMessage;
          },
          children: (g) => (() => {
            var u = Go(), b = u.firstChild, y = b.firstChild;
            return _(b, m(we, {
              get children() {
                return [m(ee, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return Wo();
                  }
                }), m(ee, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return qo();
                  }
                })];
              }
            }), y), y.innerHTML = g, R((S) => te(b, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, S)), u;
          })()
        });
      }
    }), null), _($, m(j, {
      get when() {
        return a();
      },
      get children() {
        var g = Jo(), u = g.firstChild;
        return u.firstChild, u.$$click = (b) => e.openRemark(e.component.dataKey), _(u, m(j, {
          get when() {
            return ue(() => !!e.comments)() && e.comments > 0;
          },
          get children() {
            var b = Ho();
            return _(b, () => e.comments), b;
          }
        }), null), R(() => u.disabled = s()), g;
      }
    }), null), R(() => f.innerHTML = e.component.label), c;
  })();
};
ye(["click"]);
var Qo = /* @__PURE__ */ k("<span class=text-pink-600>*"), Zo = /* @__PURE__ */ k('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Xo = /* @__PURE__ */ k('<div class="italic text-xs font-extralight text-zinc-400 ">'), ed = /* @__PURE__ */ k('<span class="absolute top-0 right-0 inline-flex items-center justify-center h-6 w-6 text-xs font-semibold text-white transform translate-x-1/2 -translate-y-1/4 bg-pink-600/80 rounded-full">'), td = /* @__PURE__ */ k('<div class=shrink-0><button class="relative inline-block bg-white p-2 h-10 w-10 text-gray-500 rounded-full hover:bg-yellow-100 hover:text-yellow-400 hover:border-yellow-100 border-2 border-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z">'), nd = /* @__PURE__ */ k('<div class="grid md:grid-cols-3 border-b border-gray-300/[.50] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 md:col-span-2 flex items-start gap-2"><div class=flex-1><div class=cursor-pointer><div class="grid font-light text-sm col-span-2 content-start">'), id = /* @__PURE__ */ k('<div class="font-light text-sm py-2.5 px-4 flex items-start gap-3"><input class="appearance-none h-4 w-4 min-w-4 min-h-4 border border-gray-300 rounded bg-white mt-2.5 checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 bg-no-repeat bg-center bg-contain cursor-pointer"type=checkbox><input type=text class="flex-1 font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none">'), rd = /* @__PURE__ */ k('<div class="font-light text-sm py-2.5 px-4 flex items-start gap-3 cursor-pointer"><input class="appearance-none h-4 w-4 min-w-4 min-h-4 border border-gray-300 rounded bg-white mt-0.5 checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 bg-no-repeat bg-center bg-contain cursor-pointer checked:disabled:bg-gray-500 checked:dark:disabled:bg-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"type=checkbox><span class=flex-1>'), ld = /* @__PURE__ */ k('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), ad = /* @__PURE__ */ k('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), sd = /* @__PURE__ */ k('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="flex-1 text-justify">');
const od = (e) => {
  const [t] = It(), n = e.config, [i] = K(n.formMode > 1 ? !0 : e.component.disableInput);
  let r = (g, u, b) => {
    let y = JSON.parse(JSON.stringify(e.value));
    if (e.value)
      if (e.value.some((S) => String(S.value) === String(g)))
        if (b) {
          let S = o().findIndex((p) => p.value == g);
          y = y.filter((p) => p.value != g), o()[S].label !== u && y.push({
            value: g,
            label: u,
            open: !0
          });
        } else
          y = y.filter((S) => S.value != g);
      else
        y.splice(y.length, 0, {
          value: g,
          label: u
        });
    else
      y = [], y.push({
        value: g,
        label: u
      });
    e.onValueChange(y);
  }, l = (g) => {
    let u = "checkbox-" + e.component.dataKey + "-" + g;
    document.getElementById(u).click();
  }, a = (g) => e.value ? !!e.value.some((u) => String(u.value) === String(g)) : !1, s = (g) => {
    let u = e.value.findIndex((b) => String(b.value) === String(g));
    return e.value[u].label;
  }, c = Ee(() => {
    if (e.component.sourceOption !== void 0 && e.component.typeOption === 3) {
      let g = e.component.sourceOption.split("@");
      const u = t.details.findIndex((b) => b.dataKey === g[0]);
      return t.details[u].type, t.details[u].answer;
    }
    return [];
  });
  const [o] = K(e.component.sourceOption !== void 0 ? c() : e.component.options), [d, f] = K(!1), x = () => {
    d() ? f(!1) : f(!0);
  }, [$] = K(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [C] = K(n.formMode > 2 && e.comments == 0);
  return (() => {
    var g = nd(), u = g.firstChild, b = u.firstChild, y = b.firstChild, S = b.nextSibling, p = u.nextSibling, L = p.firstChild, V = L.firstChild, v = V.firstChild;
    return _(b, m(j, {
      get when() {
        return e.component.required;
      },
      get children() {
        return Qo();
      }
    }), null), _(b, m(j, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var h = Zo();
        return h.$$click = x, h;
      }
    }), null), _(S, m(j, {
      get when() {
        return d();
      },
      get children() {
        var h = Xo();
        return R(() => h.innerHTML = e.component.hint), h;
      }
    })), _(v, m(fe, {
      get each() {
        return o();
      },
      children: (h, w) => m(we, {
        get children() {
          return [m(ee, {
            get when() {
              return ue(() => !!h.open)() && a(h.value);
            },
            get children() {
              var E = id(), I = E.firstChild, M = I.nextSibling;
              return I.addEventListener("change", (O) => r(O.currentTarget.value, h.label, h.open)), M.addEventListener("change", (O) => r(h.value, O.currentTarget.value, h.open)), R(() => J(I, "id", "checkbox-" + e.component.dataKey + "-" + w())), R(() => I.value = h.value), R(() => I.checked = h.value ? a(h.value) : !1), R(() => M.value = s(h.value)), E;
            }
          }), m(ee, {
            get when() {
              return !h.open || !a(h.value);
            },
            get children() {
              var E = rd(), I = E.firstChild, M = I.nextSibling;
              return E.$$click = () => l(w()), I.addEventListener("change", (O) => r(O.currentTarget.value, h.label, h.open)), R((O) => {
                var N = i(), T = "checkbox-" + e.component.dataKey + "-" + w(), A = h.label;
                return N !== O.e && (I.disabled = O.e = N), T !== O.t && J(I, "id", O.t = T), A !== O.a && (M.innerHTML = O.a = A), O;
              }, {
                e: void 0,
                t: void 0,
                a: void 0
              }), R(() => I.value = h.value), R(() => I.checked = h.value ? a(h.value) : !1), E;
            }
          })];
        }
      })
    })), _(L, m(j, {
      get when() {
        var h;
        return ((h = e.validationMessage) == null ? void 0 : h.length) > 0;
      },
      get children() {
        return m(fe, {
          get each() {
            return e.validationMessage;
          },
          children: (h) => (() => {
            var w = sd(), E = w.firstChild, I = E.firstChild;
            return _(E, m(we, {
              get children() {
                return [m(ee, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return ld();
                  }
                }), m(ee, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return ad();
                  }
                })];
              }
            }), I), I.innerHTML = h, R((M) => te(E, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, M)), w;
          })()
        });
      }
    }), null), _(p, m(j, {
      get when() {
        return $();
      },
      get children() {
        var h = td(), w = h.firstChild;
        return w.firstChild, w.$$click = (E) => e.openRemark(e.component.dataKey), _(w, m(j, {
          get when() {
            return ue(() => !!e.comments)() && e.comments > 0;
          },
          get children() {
            var E = ed();
            return _(E, () => e.comments), E;
          }
        }), null), R(() => w.disabled = C()), h;
      }
    }), null), R((h) => {
      var w = e.component.label, E = {
        " border-b border-orange-500 pb-3 ": e.classValidation === 1,
        " border-b border-pink-600 pb-3 ": e.classValidation === 2
      }, I = e.component.cols === 1 || e.component.cols === void 0, M = e.component.cols === 2, O = e.component.cols === 3, N = e.component.cols === 4, T = e.component.cols === 5;
      return w !== h.e && (y.innerHTML = h.e = w), h.t = te(V, E, h.t), I !== h.a && v.classList.toggle("grid-cols-1", h.a = I), M !== h.o && v.classList.toggle("grid-cols-2", h.o = M), O !== h.i && v.classList.toggle("grid-cols-3", h.i = O), N !== h.n && v.classList.toggle("grid-cols-4", h.n = N), T !== h.s && v.classList.toggle("grid-cols-5", h.s = T), h;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0,
      n: void 0,
      s: void 0
    }), g;
  })();
};
ye(["click"]);
var dd = /* @__PURE__ */ k("<span class=text-pink-600>*"), cd = /* @__PURE__ */ k('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), ud = /* @__PURE__ */ k('<div class="italic text-xs font-extralight text-zinc-400 ">'), yr = /* @__PURE__ */ k('<textarea class="w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400">'), hd = /* @__PURE__ */ k('<span class="absolute top-0 right-0 inline-flex items-center justify-center h-6 w-6 text-xs font-semibold text-white transform translate-x-1/2 -translate-y-1/4 bg-pink-600/80 rounded-full">'), gd = /* @__PURE__ */ k('<div class=shrink-0><button class="relative inline-block bg-white p-2 h-10 w-10 text-gray-500 rounded-full hover:bg-yellow-100 hover:text-yellow-400 hover:border-yellow-100 border-2 border-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z">'), fd = /* @__PURE__ */ k('<div class="grid md:grid-cols-3 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 md:col-span-2 flex items-start gap-2"><div class=flex-1>'), vd = /* @__PURE__ */ k('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), md = /* @__PURE__ */ k('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), bd = /* @__PURE__ */ k('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="flex-1 text-justify">');
const wd = (e) => {
  const t = e.config, [n] = K(t.formMode > 1 ? !0 : e.component.disableInput), [i, r] = K(!1), l = () => {
    i() ? r(!1) : r(!0);
  }, [a] = K(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [s] = K(t.formMode > 2 && e.comments == 0);
  return (() => {
    var c = fd(), o = c.firstChild, d = o.firstChild, f = d.firstChild, x = d.nextSibling, $ = o.nextSibling, C = $.firstChild;
    return _(d, m(j, {
      get when() {
        return e.component.required;
      },
      get children() {
        return dd();
      }
    }), null), _(d, m(j, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var g = cd();
        return g.$$click = l, g;
      }
    }), null), _(x, m(j, {
      get when() {
        return i();
      },
      get children() {
        var g = ud();
        return R(() => g.innerHTML = e.component.hint), g;
      }
    })), _(C, m(j, {
      get when() {
        return e.component.lengthInput === void 0;
      },
      get children() {
        var g = yr();
        return g.addEventListener("change", (u) => {
          e.onValueChange(u.currentTarget.value);
        }), R((u) => {
          var b = e.component.rows || 2, y = {
            " border border-solid border-gray-300 ": e.classValidation === 0,
            " border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
            " border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
          }, S = n();
          return b !== u.e && J(g, "rows", u.e = b), u.t = te(g, y, u.t), S !== u.a && (g.disabled = u.a = S), u;
        }, {
          e: void 0,
          t: void 0,
          a: void 0
        }), R(() => g.value = e.value), g;
      }
    }), null), _(C, m(j, {
      get when() {
        return ue(() => e.component.lengthInput !== void 0)() && e.component.lengthInput.length > 0;
      },
      get children() {
        var g = yr();
        return g.addEventListener("change", (u) => {
          e.onValueChange(u.currentTarget.value);
        }), R((u) => {
          var b = e.component.rows || 2, y = {
            " border border-solid border-gray-300 ": e.classValidation === 0,
            " border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
            " border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
          }, S = n(), p = e.component.lengthInput[0].maxlength !== void 0 ? e.component.lengthInput[0].maxlength : "", L = e.component.lengthInput[0].minlength !== void 0 ? e.component.lengthInput[0].minlength : "";
          return b !== u.e && J(g, "rows", u.e = b), u.t = te(g, y, u.t), S !== u.a && (g.disabled = u.a = S), p !== u.o && J(g, "maxlength", u.o = p), L !== u.i && J(g, "minlength", u.i = L), u;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0,
          i: void 0
        }), R(() => g.value = e.value), g;
      }
    }), null), _(C, m(j, {
      get when() {
        var g;
        return ((g = e.validationMessage) == null ? void 0 : g.length) > 0;
      },
      get children() {
        return m(fe, {
          get each() {
            return e.validationMessage;
          },
          children: (g) => (() => {
            var u = bd(), b = u.firstChild, y = b.firstChild;
            return _(b, m(we, {
              get children() {
                return [m(ee, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return vd();
                  }
                }), m(ee, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return md();
                  }
                })];
              }
            }), y), y.innerHTML = g, R((S) => te(b, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, S)), u;
          })()
        });
      }
    }), null), _($, m(j, {
      get when() {
        return a();
      },
      get children() {
        var g = gd(), u = g.firstChild;
        return u.firstChild, u.$$click = (b) => e.openRemark(e.component.dataKey), _(u, m(j, {
          get when() {
            return ue(() => !!e.comments)() && e.comments > 0;
          },
          get children() {
            var b = hd();
            return _(b, () => e.comments), b;
          }
        }), null), R(() => u.disabled = s()), g;
      }
    }), null), R(() => f.innerHTML = e.component.label), c;
  })();
};
ye(["click"]);
var xd = /* @__PURE__ */ k("<span class=text-pink-600>*"), yd = /* @__PURE__ */ k('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), pd = /* @__PURE__ */ k('<div class="italic text-xs font-extralight text-zinc-400 ">'), kd = /* @__PURE__ */ k('<span class="absolute top-0 right-0 inline-flex items-center justify-center h-6 w-6 text-xs font-semibold text-white transform translate-x-1/2 -translate-y-1/4 bg-pink-600/80 rounded-full">'), $d = /* @__PURE__ */ k('<div class=shrink-0><button class="relative inline-block bg-white p-2 h-10 w-10 text-gray-500 rounded-full hover:bg-yellow-100 hover:text-yellow-400 hover:border-yellow-100 border-2 border-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z">'), _d = /* @__PURE__ */ k('<div class="md:grid md:grid-cols-3 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 md:col-span-2 flex items-start gap-2"><div class=flex-1><input type=email placeholder>'), Sd = /* @__PURE__ */ k('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), Cd = /* @__PURE__ */ k('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Md = /* @__PURE__ */ k('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="flex-1 text-justify">');
const Cl = (e) => {
  const t = e.config, [n] = K(t.formMode > 1 ? !0 : e.component.disableInput);
  let i = "w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400";
  const [r, l] = K(!1), a = () => {
    r() ? l(!1) : l(!0);
  }, [s] = K(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [c] = K(t.formMode > 2 && e.comments == 0);
  return (() => {
    var o = _d(), d = o.firstChild, f = d.firstChild, x = f.firstChild, $ = f.nextSibling, C = d.nextSibling, g = C.firstChild, u = g.firstChild;
    return _(f, m(j, {
      get when() {
        return e.component.required;
      },
      get children() {
        return xd();
      }
    }), null), _(f, m(j, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var b = yd();
        return b.$$click = a, b;
      }
    }), null), _($, m(j, {
      get when() {
        return r();
      },
      get children() {
        var b = pd();
        return R(() => b.innerHTML = e.component.hint), b;
      }
    })), u.addEventListener("change", (b) => {
      e.onValueChange(b.currentTarget.value);
    }), _(g, m(j, {
      get when() {
        var b;
        return ((b = e.validationMessage) == null ? void 0 : b.length) > 0;
      },
      get children() {
        return m(fe, {
          get each() {
            return e.validationMessage;
          },
          children: (b) => (() => {
            var y = Md(), S = y.firstChild, p = S.firstChild;
            return _(S, m(we, {
              get children() {
                return [m(ee, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return Sd();
                  }
                }), m(ee, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return Cd();
                  }
                })];
              }
            }), p), p.innerHTML = b, R((L) => te(S, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, L)), y;
          })()
        });
      }
    }), null), _(C, m(j, {
      get when() {
        return s();
      },
      get children() {
        var b = $d(), y = b.firstChild;
        return y.firstChild, y.$$click = (S) => e.openRemark(e.component.dataKey), _(y, m(j, {
          get when() {
            return ue(() => !!e.comments)() && e.comments > 0;
          },
          get children() {
            var S = kd();
            return _(S, () => e.comments), S;
          }
        }), null), R(() => y.disabled = c()), b;
      }
    }), null), R((b) => {
      var y = e.component.label, S = e.component.dataKey, p = i + e.classValidation, L = {
        " border border-solid border-gray-300 ": e.classValidation === 0,
        " border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
        " border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
      }, V = n();
      return y !== b.e && (x.innerHTML = b.e = y), S !== b.t && J(u, "name", b.t = S), p !== b.a && Ki(u, b.a = p), b.o = te(u, L, b.o), V !== b.i && (u.disabled = b.i = V), b;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0
    }), R(() => u.value = e.value), o;
  })();
};
ye(["click"]);
var Id = /* @__PURE__ */ k("<span class=text-pink-600>*"), Ed = /* @__PURE__ */ k('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Od = /* @__PURE__ */ k('<div class="italic text-xs font-extralight text-zinc-400 ">'), Ld = /* @__PURE__ */ k('<span class="absolute top-0 right-0 inline-flex items-center justify-center h-6 w-6 text-xs font-semibold text-white transform translate-x-1/2 -translate-y-1/4 bg-pink-600/80 rounded-full">'), Ad = /* @__PURE__ */ k('<div class=shrink-0><button class="relative inline-block bg-white p-2 h-10 w-10 text-gray-500 rounded-full hover:bg-yellow-100 hover:text-yellow-400 hover:border-yellow-100 border-2 border-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z">'), Rd = /* @__PURE__ */ k('<div class="md:grid md:grid-cols-3 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 md:col-span-2 flex items-start gap-2"><div class=flex-1><input type=url class="w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"placeholder>'), Nd = /* @__PURE__ */ k('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), Vd = /* @__PURE__ */ k('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Td = /* @__PURE__ */ k('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="flex-1 text-justify">');
const Ml = (e) => {
  const t = e.config, [n] = K(t.formMode > 1 ? !0 : e.component.disableInput), [i, r] = K(!1), l = () => {
    i() ? r(!1) : r(!0);
  }, [a] = K(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [s] = K(t.formMode > 2 && e.comments == 0);
  return (() => {
    var c = Rd(), o = c.firstChild, d = o.firstChild, f = d.firstChild, x = d.nextSibling, $ = o.nextSibling, C = $.firstChild, g = C.firstChild;
    return _(d, m(j, {
      get when() {
        return e.component.required;
      },
      get children() {
        return Id();
      }
    }), null), _(d, m(j, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var u = Ed();
        return u.$$click = l, u;
      }
    }), null), _(x, m(j, {
      get when() {
        return i();
      },
      get children() {
        var u = Od();
        return R(() => u.innerHTML = e.component.hint), u;
      }
    })), g.addEventListener("change", (u) => {
      e.onValueChange(u.currentTarget.value);
    }), _(C, m(j, {
      get when() {
        var u;
        return ((u = e.validationMessage) == null ? void 0 : u.length) > 0;
      },
      get children() {
        return m(fe, {
          get each() {
            return e.validationMessage;
          },
          children: (u) => (() => {
            var b = Td(), y = b.firstChild, S = y.firstChild;
            return _(y, m(we, {
              get children() {
                return [m(ee, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return Nd();
                  }
                }), m(ee, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return Vd();
                  }
                })];
              }
            }), S), S.innerHTML = u, R((p) => te(y, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, p)), b;
          })()
        });
      }
    }), null), _($, m(j, {
      get when() {
        return a();
      },
      get children() {
        var u = Ad(), b = u.firstChild;
        return b.firstChild, b.$$click = (y) => e.openRemark(e.component.dataKey), _(b, m(j, {
          get when() {
            return ue(() => !!e.comments)() && e.comments > 0;
          },
          get children() {
            var y = Ld();
            return _(y, () => e.comments), y;
          }
        }), null), R(() => b.disabled = s()), u;
      }
    }), null), R((u) => {
      var b = e.component.label, y = e.component.dataKey, S = {
        " border border-solid border-gray-300 ": e.classValidation === 0,
        " border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
        " border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
      }, p = n();
      return b !== u.e && (f.innerHTML = u.e = b), y !== u.t && J(g, "name", u.t = y), u.a = te(g, S, u.a), p !== u.o && (g.disabled = u.o = p), u;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0
    }), R(() => g.value = e.value), c;
  })();
};
ye(["click"]);
var jd = /* @__PURE__ */ k("<span class=text-pink-600>*"), Dd = /* @__PURE__ */ k('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Pd = /* @__PURE__ */ k('<div class="italic text-xs font-extralight text-zinc-400 ">'), Kd = /* @__PURE__ */ k('<span class="absolute top-0 right-0 inline-flex items-center justify-center h-6 w-6 text-xs font-semibold text-white transform translate-x-1/2 -translate-y-1/4 bg-pink-600/80 rounded-full">'), Bd = /* @__PURE__ */ k('<div class=shrink-0><button class="relative inline-block bg-white p-2 h-10 w-10 text-gray-500 rounded-full hover:bg-yellow-100 hover:text-yellow-400 hover:border-yellow-100 border-2 border-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z">'), zd = /* @__PURE__ */ k('<div class="md:grid md:grid-cols-3 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 md:col-span-2 flex items-start gap-2"><div class=flex-1><input type=date class="w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"placeholder>'), Fd = /* @__PURE__ */ k('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), Hd = /* @__PURE__ */ k('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Jd = /* @__PURE__ */ k('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="flex-1 text-justify">');
const Ud = (e) => {
  const t = e.config, [n] = K(t.formMode > 1 ? !0 : e.component.disableInput), [i, r] = K(!1), l = () => {
    i() ? r(!1) : r(!0);
  }, [a] = K(t.formMode > 2 && e.comments == 0), [s] = K(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0);
  let c = /* @__PURE__ */ new Date(), o = String(c.getDate()), d = String(c.getMonth() + 1), f = String(c.getFullYear());
  Number(o) < 10 && (o = "0" + o), Number(d) < 10 && (d = "0" + d);
  let x = f + "-" + d + "-" + o, $, C;
  return Ee(() => {
    e.component.rangeInput && ($ = e.component.rangeInput[0].min !== void 0 ? e.component.rangeInput[0].min === "today" ? x : e.component.rangeInput[0].min : "", C = e.component.rangeInput[0].max !== void 0 ? e.component.rangeInput[0].max === "today" ? x : e.component.rangeInput[0].max : "");
  }), (() => {
    var g = zd(), u = g.firstChild, b = u.firstChild, y = b.firstChild, S = b.nextSibling, p = u.nextSibling, L = p.firstChild, V = L.firstChild;
    return _(b, m(j, {
      get when() {
        return e.component.required;
      },
      get children() {
        return jd();
      }
    }), null), _(b, m(j, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var v = Dd();
        return v.$$click = l, v;
      }
    }), null), _(S, m(j, {
      get when() {
        return i();
      },
      get children() {
        var v = Pd();
        return R(() => v.innerHTML = e.component.hint), v;
      }
    })), V.addEventListener("change", (v) => {
      e.onValueChange(v.currentTarget.value);
    }), J(V, "min", $), J(V, "max", C), _(L, m(j, {
      get when() {
        var v;
        return ((v = e.validationMessage) == null ? void 0 : v.length) > 0;
      },
      get children() {
        return m(fe, {
          get each() {
            return e.validationMessage;
          },
          children: (v) => (() => {
            var h = Jd(), w = h.firstChild, E = w.firstChild;
            return _(w, m(we, {
              get children() {
                return [m(ee, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return Fd();
                  }
                }), m(ee, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return Hd();
                  }
                })];
              }
            }), E), E.innerHTML = v, R((I) => te(w, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, I)), h;
          })()
        });
      }
    }), null), _(p, m(j, {
      get when() {
        return s();
      },
      get children() {
        var v = Bd(), h = v.firstChild;
        return h.firstChild, h.$$click = (w) => e.openRemark(e.component.dataKey), _(h, m(j, {
          get when() {
            return ue(() => !!e.comments)() && e.comments > 0;
          },
          get children() {
            var w = Kd();
            return _(w, () => e.comments), w;
          }
        }), null), R(() => h.disabled = a()), v;
      }
    }), null), R((v) => {
      var h = e.component.label, w = e.component.dataKey, E = {
        " border border-solid border-gray-300 ": e.classValidation === 0,
        " border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
        " border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
      }, I = n();
      return h !== v.e && (y.innerHTML = v.e = h), w !== v.t && J(V, "name", v.t = w), v.a = te(V, E, v.a), I !== v.o && (V.disabled = v.o = I), v;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0
    }), R(() => V.value = e.value), g;
  })();
};
ye(["click"]);
var Wd = /* @__PURE__ */ k("<span class=text-pink-600>*"), qd = /* @__PURE__ */ k('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Gd = /* @__PURE__ */ k('<div class="italic text-xs font-extralight text-zinc-400 ">'), Yd = /* @__PURE__ */ k('<span class="absolute top-0 right-0 inline-flex items-center justify-center h-6 w-6 text-xs font-semibold text-white transform translate-x-1/2 -translate-y-1/4 bg-pink-600/80 rounded-full">'), Qd = /* @__PURE__ */ k('<div class=shrink-0><button class="relative inline-block bg-white p-2 h-10 w-10 text-gray-500 rounded-full hover:bg-yellow-100 hover:text-yellow-400 hover:border-yellow-100 border-2 border-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z">'), Zd = /* @__PURE__ */ k('<div class="md:grid md:grid-cols-3 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 md:col-span-2 flex items-start gap-2"><div class=flex-1><input type=datetime-local class="w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"placeholder>'), Xd = /* @__PURE__ */ k('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), ec = /* @__PURE__ */ k('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), tc = /* @__PURE__ */ k('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="flex-1 text-justify">');
const nc = (e) => {
  const t = e.config, [n] = K(t.formMode > 1 ? !0 : e.component.disableInput), [i, r] = K(!1), l = () => {
    i() ? r(!1) : r(!0);
  }, [a] = K(t.formMode > 2 && e.comments == 0), [s] = K(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0);
  let c = /* @__PURE__ */ new Date(), o = String(c.getDate()), d = String(c.getMonth() + 1), f = String(c.getFullYear());
  Number(o) < 10 && (o = "0" + o), Number(d) < 10 && (d = "0" + d);
  let x = f + "-" + d + "-" + o, $, C;
  return Ee(() => {
    e.component.rangeInput && ($ = e.component.rangeInput[0].min !== void 0 ? e.component.rangeInput[0].min === "today" ? x : e.component.rangeInput[0].min : "", C = e.component.rangeInput[0].max !== void 0 ? e.component.rangeInput[0].max === "today" ? x : e.component.rangeInput[0].max : "");
  }), (() => {
    var g = Zd(), u = g.firstChild, b = u.firstChild, y = b.firstChild, S = b.nextSibling, p = u.nextSibling, L = p.firstChild, V = L.firstChild;
    return _(b, m(j, {
      get when() {
        return e.component.required;
      },
      get children() {
        return Wd();
      }
    }), null), _(b, m(j, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var v = qd();
        return v.$$click = l, v;
      }
    }), null), _(S, m(j, {
      get when() {
        return i();
      },
      get children() {
        var v = Gd();
        return R(() => v.innerHTML = e.component.hint), v;
      }
    })), V.addEventListener("change", (v) => {
      e.onValueChange(v.currentTarget.value);
    }), J(V, "min", $ + "T00:00"), J(V, "max", C + "T23:59"), _(L, m(j, {
      get when() {
        var v;
        return ((v = e.validationMessage) == null ? void 0 : v.length) > 0;
      },
      get children() {
        return m(fe, {
          get each() {
            return e.validationMessage;
          },
          children: (v) => (() => {
            var h = tc(), w = h.firstChild, E = w.firstChild;
            return _(w, m(we, {
              get children() {
                return [m(ee, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return Xd();
                  }
                }), m(ee, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return ec();
                  }
                })];
              }
            }), E), E.innerHTML = v, R((I) => te(w, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, I)), h;
          })()
        });
      }
    }), null), _(p, m(j, {
      get when() {
        return s();
      },
      get children() {
        var v = Qd(), h = v.firstChild;
        return h.firstChild, h.$$click = (w) => e.openRemark(e.component.dataKey), _(h, m(j, {
          get when() {
            return ue(() => !!e.comments)() && e.comments > 0;
          },
          get children() {
            var w = Yd();
            return _(w, () => e.comments), w;
          }
        }), null), R(() => h.disabled = a()), v;
      }
    }), null), R((v) => {
      var h = e.component.label, w = e.component.dataKey, E = {
        " border border-solid border-gray-300 ": e.classValidation === 0,
        " border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
        " border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
      }, I = n();
      return h !== v.e && (y.innerHTML = v.e = h), w !== v.t && J(V, "name", v.t = w), v.a = te(V, E, v.a), I !== v.o && (V.disabled = v.o = I), v;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0
    }), R(() => V.value = e.value), g;
  })();
};
ye(["click"]);
var ic = /* @__PURE__ */ k("<span class=text-pink-600>*"), rc = /* @__PURE__ */ k('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), lc = /* @__PURE__ */ k('<div class="italic text-xs font-extralight text-zinc-400 ">'), ac = /* @__PURE__ */ k('<span class="absolute top-0 right-0 inline-flex items-center justify-center h-6 w-6 text-xs font-semibold text-white transform translate-x-1/2 -translate-y-1/4 bg-pink-600/80 rounded-full">'), sc = /* @__PURE__ */ k('<div class=shrink-0><button class="relative inline-block bg-white p-2 h-10 w-10 text-gray-500 rounded-full hover:bg-yellow-100 hover:text-yellow-400 hover:border-yellow-100 border-2 border-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z">'), oc = /* @__PURE__ */ k('<div class="grid md:grid-cols-3 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 md:col-span-2 flex items-start gap-2"><div class=flex-1><input type=time class="w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"placeholder>'), dc = /* @__PURE__ */ k('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), cc = /* @__PURE__ */ k('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), uc = /* @__PURE__ */ k('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="flex-1 text-justify">');
const Il = (e) => {
  const t = e.config, [n] = K(t.formMode > 1 ? !0 : e.component.disableInput), [i, r] = K(!1), l = () => {
    i() ? r(!1) : r(!0);
  }, [a] = K(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [s] = K(t.formMode > 2 && e.comments == 0);
  return (() => {
    var c = oc(), o = c.firstChild, d = o.firstChild, f = d.firstChild, x = d.nextSibling, $ = o.nextSibling, C = $.firstChild, g = C.firstChild;
    return _(d, m(j, {
      get when() {
        return e.component.required;
      },
      get children() {
        return ic();
      }
    }), null), _(d, m(j, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var u = rc();
        return u.$$click = l, u;
      }
    }), null), _(x, m(j, {
      get when() {
        return i();
      },
      get children() {
        var u = lc();
        return R(() => u.innerHTML = e.component.hint), u;
      }
    })), g.addEventListener("change", (u) => {
      e.onValueChange(u.currentTarget.value);
    }), _(C, m(j, {
      get when() {
        var u;
        return ((u = e.validationMessage) == null ? void 0 : u.length) > 0;
      },
      get children() {
        return m(fe, {
          get each() {
            return e.validationMessage;
          },
          children: (u) => (() => {
            var b = uc(), y = b.firstChild, S = y.firstChild;
            return _(y, m(we, {
              get children() {
                return [m(ee, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return dc();
                  }
                }), m(ee, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return cc();
                  }
                })];
              }
            }), S), S.innerHTML = u, R((p) => te(y, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, p)), b;
          })()
        });
      }
    }), null), _($, m(j, {
      get when() {
        return a();
      },
      get children() {
        var u = sc(), b = u.firstChild;
        return b.firstChild, b.$$click = (y) => e.openRemark(e.component.dataKey), _(b, m(j, {
          get when() {
            return ue(() => !!e.comments)() && e.comments > 0;
          },
          get children() {
            var y = ac();
            return _(y, () => e.comments), y;
          }
        }), null), R(() => b.disabled = s()), u;
      }
    }), null), R((u) => {
      var b = e.component.label, y = e.component.dataKey, S = {
        " border border-solid border-gray-300 ": e.classValidation === 0,
        " border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
        " border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
      }, p = n();
      return b !== u.e && (f.innerHTML = u.e = b), y !== u.t && J(g, "name", u.t = y), u.a = te(g, S, u.a), p !== u.o && (g.disabled = u.o = p), u;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0
    }), R(() => g.value = e.value), c;
  })();
};
ye(["click"]);
var hc = /* @__PURE__ */ k("<span class=text-pink-600>*"), gc = /* @__PURE__ */ k('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), fc = /* @__PURE__ */ k('<div class="italic text-xs font-extralight text-zinc-400 ">'), vc = /* @__PURE__ */ k('<span class="absolute top-0 right-0 inline-flex items-center justify-center h-6 w-6 text-xs font-semibold text-white transform translate-x-1/2 -translate-y-1/4 bg-pink-600/80 rounded-full">'), mc = /* @__PURE__ */ k('<div class=shrink-0><button class="relative inline-block bg-white p-2 h-10 w-10 text-gray-500 rounded-full hover:bg-yellow-100 hover:text-yellow-400 hover:border-yellow-100 border-2 border-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z">'), bc = /* @__PURE__ */ k('<div class="md:grid md:grid-cols-3 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 md:col-span-2 flex items-start gap-2"><div class=flex-1><input type=month class="w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"placeholder>'), wc = /* @__PURE__ */ k('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), xc = /* @__PURE__ */ k('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), yc = /* @__PURE__ */ k('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="flex-1 text-justify">');
const El = (e) => {
  const t = e.config, [n] = K(t.formMode > 1 ? !0 : e.component.disableInput), [i, r] = K(!1), l = () => {
    i() ? r(!1) : r(!0);
  }, [a] = K(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [s] = K(t.formMode > 2 && e.comments == 0);
  return (() => {
    var c = bc(), o = c.firstChild, d = o.firstChild, f = d.firstChild, x = d.nextSibling, $ = o.nextSibling, C = $.firstChild, g = C.firstChild;
    return _(d, m(j, {
      get when() {
        return e.component.required;
      },
      get children() {
        return hc();
      }
    }), null), _(d, m(j, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var u = gc();
        return u.$$click = l, u;
      }
    }), null), _(x, m(j, {
      get when() {
        return i();
      },
      get children() {
        var u = fc();
        return R(() => u.innerHTML = e.component.hint), u;
      }
    })), g.addEventListener("change", (u) => {
      e.onValueChange(u.currentTarget.value);
    }), _(C, m(j, {
      get when() {
        var u;
        return ((u = e.validationMessage) == null ? void 0 : u.length) > 0;
      },
      get children() {
        return m(fe, {
          get each() {
            return e.validationMessage;
          },
          children: (u) => (() => {
            var b = yc(), y = b.firstChild, S = y.firstChild;
            return _(y, m(we, {
              get children() {
                return [m(ee, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return wc();
                  }
                }), m(ee, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return xc();
                  }
                })];
              }
            }), S), S.innerHTML = u, R((p) => te(y, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, p)), b;
          })()
        });
      }
    }), null), _($, m(j, {
      get when() {
        return a();
      },
      get children() {
        var u = mc(), b = u.firstChild;
        return b.firstChild, b.$$click = (y) => e.openRemark(e.component.dataKey), _(b, m(j, {
          get when() {
            return ue(() => !!e.comments)() && e.comments > 0;
          },
          get children() {
            var y = vc();
            return _(y, () => e.comments), y;
          }
        }), null), R(() => b.disabled = s()), u;
      }
    }), null), R((u) => {
      var b = e.component.label, y = e.component.dataKey, S = {
        " border border-solid border-gray-300 ": e.classValidation === 0,
        " border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
        " border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
      }, p = n();
      return b !== u.e && (f.innerHTML = u.e = b), y !== u.t && J(g, "name", u.t = y), u.a = te(g, S, u.a), p !== u.o && (g.disabled = u.o = p), u;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0
    }), R(() => g.value = e.value), c;
  })();
};
ye(["click"]);
var pc = /* @__PURE__ */ k("<span class=text-pink-600>*"), kc = /* @__PURE__ */ k('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), $c = /* @__PURE__ */ k('<div class="italic text-xs font-extralight text-zinc-400 ">'), _c = /* @__PURE__ */ k('<span class="absolute top-0 right-0 inline-flex items-center justify-center h-6 w-6 text-xs font-semibold text-white transform translate-x-1/2 -translate-y-1/4 bg-pink-600/80 rounded-full">'), Sc = /* @__PURE__ */ k('<div class=shrink-0><button class="relative inline-block bg-white p-2 h-10 w-10 text-gray-500 rounded-full hover:bg-yellow-100 hover:text-yellow-400 hover:border-yellow-100 border-2 border-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z">'), Cc = /* @__PURE__ */ k('<div class="md:grid md:grid-cols-3 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 md:col-span-2 flex items-start gap-2"><div class=flex-1><input type=week class="w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"placeholder>'), Mc = /* @__PURE__ */ k('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), Ic = /* @__PURE__ */ k('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Ec = /* @__PURE__ */ k('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="flex-1 text-justify">');
const Ol = (e) => {
  const t = e.config, [n] = K(t.formMode > 1 ? !0 : e.component.disableInput), [i, r] = K(!1), l = () => {
    i() ? r(!1) : r(!0);
  }, [a] = K(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [s] = K(t.formMode > 2 && e.comments == 0);
  return (() => {
    var c = Cc(), o = c.firstChild, d = o.firstChild, f = d.firstChild, x = d.nextSibling, $ = o.nextSibling, C = $.firstChild, g = C.firstChild;
    return _(d, m(j, {
      get when() {
        return e.component.required;
      },
      get children() {
        return pc();
      }
    }), null), _(d, m(j, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var u = kc();
        return u.$$click = l, u;
      }
    }), null), _(x, m(j, {
      get when() {
        return i();
      },
      get children() {
        var u = $c();
        return R(() => u.innerHTML = e.component.hint), u;
      }
    })), g.addEventListener("change", (u) => {
      e.onValueChange(u.currentTarget.value);
    }), _(C, m(j, {
      get when() {
        var u;
        return ((u = e.validationMessage) == null ? void 0 : u.length) > 0;
      },
      get children() {
        return m(fe, {
          get each() {
            return e.validationMessage;
          },
          children: (u) => (() => {
            var b = Ec(), y = b.firstChild, S = y.firstChild;
            return _(y, m(we, {
              get children() {
                return [m(ee, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return Mc();
                  }
                }), m(ee, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return Ic();
                  }
                })];
              }
            }), S), S.innerHTML = u, R((p) => te(y, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, p)), b;
          })()
        });
      }
    }), null), _($, m(j, {
      get when() {
        return a();
      },
      get children() {
        var u = Sc(), b = u.firstChild;
        return b.firstChild, b.$$click = (y) => e.openRemark(e.component.dataKey), _(b, m(j, {
          get when() {
            return ue(() => !!e.comments)() && e.comments > 0;
          },
          get children() {
            var y = _c();
            return _(y, () => e.comments), y;
          }
        }), null), R(() => b.disabled = s()), u;
      }
    }), null), R((u) => {
      var b = e.component.label, y = e.component.dataKey, S = {
        " border border-solid border-gray-300 ": e.classValidation === 0,
        " border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
        " border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
      }, p = n();
      return b !== u.e && (f.innerHTML = u.e = b), y !== u.t && J(g, "name", u.t = y), u.a = te(g, S, u.a), p !== u.o && (g.disabled = u.o = p), u;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0
    }), R(() => g.value = e.value), c;
  })();
};
ye(["click"]);
var Oc = /* @__PURE__ */ k("<span class=text-pink-600>*"), Lc = /* @__PURE__ */ k('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Ac = /* @__PURE__ */ k('<div class="italic text-xs font-extralight text-zinc-400 ">'), Rc = /* @__PURE__ */ k('<div class="border-b border-gray-300/[.50] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm py-2.5 px-2"><div><div class="flex items-start gap-2"><input class="appearance-none h-5 w-5 min-w-5 min-h-5 border-2 mt-0.5 shrink-0 border-gray-300 rounded bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 bg-no-repeat bg-center bg-contain cursor-pointer"type=checkbox><div class=flex-1><div class="inline-flex space-x-2 flex-wrap"><div class=cursor-pointer></div></div></div></div><div class="flex mt-2 ml-7">'), Nc = /* @__PURE__ */ k('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), Vc = /* @__PURE__ */ k('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Tc = /* @__PURE__ */ k('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class=text-justify>');
const Ll = (e) => {
  const t = e.config, [n] = K(t.formMode > 1 ? !0 : e.component.disableInput), [i, r] = K(e.value !== "" ? e.value : !1), [l, a] = K(!1), s = () => {
    l() ? a(!1) : a(!0);
  };
  let c = () => {
    let o = "singlecheck-" + e.component.dataKey + "_id";
    document.getElementById(o).click();
  };
  return (() => {
    var o = Rc(), d = o.firstChild, f = d.firstChild, x = f.firstChild, $ = x.firstChild, C = $.nextSibling, g = C.firstChild, u = g.firstChild, b = x.nextSibling;
    return $.addEventListener("change", (y) => {
      r(y.target.checked), e.onValueChange(y.target.checked);
    }), u.$$click = (y) => c(), _(g, m(j, {
      get when() {
        return e.component.required;
      },
      get children() {
        return Oc();
      }
    }), null), _(g, m(j, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var y = Lc();
        return y.$$click = s, y;
      }
    }), null), _(b, m(j, {
      get when() {
        return l();
      },
      get children() {
        var y = Ac();
        return R(() => y.innerHTML = e.component.hint), y;
      }
    })), _(d, m(j, {
      get when() {
        var y;
        return ((y = e.validationMessage) == null ? void 0 : y.length) > 0;
      },
      get children() {
        return m(fe, {
          get each() {
            return e.validationMessage;
          },
          children: (y) => (() => {
            var S = Tc(), p = S.firstChild, L = p.firstChild;
            return _(p, m(we, {
              get children() {
                return [m(ee, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return Nc();
                  }
                }), m(ee, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return Vc();
                  }
                })];
              }
            }), L), L.innerHTML = y, R((V) => te(p, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, V)), S;
          })()
        });
      }
    }), null), R((y) => {
      var S = {
        " border-b border-orange-500 pb-3 ": e.classValidation === 1,
        " border-b border-pink-600 pb-3 ": e.classValidation === 2
      }, p = "singlecheck-" + e.component.dataKey + "_id", L = n(), V = e.component.label;
      return y.e = te(f, S, y.e), p !== y.t && J($, "id", y.t = p), L !== y.a && ($.disabled = y.a = L), V !== y.o && (u.innerHTML = y.o = V), y;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0
    }), R(() => $.checked = i() === !0), o;
  })();
};
ye(["click"]);
var jc = /* @__PURE__ */ k("<span class=text-pink-600>*"), Dc = /* @__PURE__ */ k('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Pc = /* @__PURE__ */ k('<div class="italic text-xs font-extralight text-zinc-400 ">'), Kc = /* @__PURE__ */ k('<div class="grid md:grid-cols-8 grid-cols-8 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2 col-span-7"><div><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div></div><div class="font-light text-sm space-x-2 py-2.5 px-2 flex justify-end"><button type=button class="relative inline-flex flex-shrink-0 h-7 w-12 border border-gray-300 rounded-full cursor-pointer shadow transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"><span class="relative inline-block h-6 w-6 ring-0 rounded-full transform bg-white shadow transition duration-200 ease-in-out pointer-events-none"><span class="absolute inset-0 h-full w-full flex justify-center items-center transition-opacity"><svg class="h-3 w-3 text-gray-400"fill=none viewBox="0 0 12 12"><path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round></path></svg></span><span class=" absolute inset-0 h-full w-full flex items-center justify-center transition-opacity "><svg class="h-3 w-3 text-blue-600"fill=currentColor viewBox="0 0 12 12"><path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z">'), Bc = /* @__PURE__ */ k('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), zc = /* @__PURE__ */ k('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Fc = /* @__PURE__ */ k('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="flex-1 text-justify">');
const Al = (e) => {
  const t = e.config, [n] = K(t.formMode > 1 ? !0 : e.component.disableInput), [i, r] = K(e.value !== "" ? e.value : !1), [l, a] = K(!1), s = () => {
    l() ? a(!1) : a(!0);
  };
  let c = () => {
    let o = "toggle-" + e.component.dataKey + "_id";
    document.getElementById(o).click();
  };
  return (() => {
    var o = Kc(), d = o.firstChild, f = d.firstChild, x = f.firstChild, $ = x.firstChild, C = x.nextSibling, g = d.nextSibling, u = g.firstChild, b = u.firstChild, y = b.firstChild, S = y.nextSibling;
    return $.$$click = (p) => c(), _(x, m(j, {
      get when() {
        return e.component.required;
      },
      get children() {
        return jc();
      }
    }), null), _(x, m(j, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var p = Dc();
        return p.$$click = s, p;
      }
    }), null), _(C, m(j, {
      get when() {
        return l();
      },
      get children() {
        var p = Pc();
        return R(() => p.innerHTML = e.component.hint), p;
      }
    })), _(d, m(j, {
      get when() {
        var p;
        return ((p = e.validationMessage) == null ? void 0 : p.length) > 0;
      },
      get children() {
        return m(fe, {
          get each() {
            return e.validationMessage;
          },
          children: (p) => (() => {
            var L = Fc(), V = L.firstChild, v = V.firstChild;
            return _(V, m(we, {
              get children() {
                return [m(ee, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return Bc();
                  }
                }), m(ee, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return zc();
                  }
                })];
              }
            }), v), v.innerHTML = p, R((h) => te(V, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, h)), L;
          })()
        });
      }
    }), null), u.$$click = (p) => {
      const L = !i();
      r(L), e.onValueChange(L);
    }, R((p) => {
      var L = {
        " border-b border-orange-500 pb-3 ": e.classValidation === 1,
        " border-b border-pink-600 pb-3 ": e.classValidation === 2
      }, V = e.component.label, v = i() === !0, h = i() === !1, w = "toggle-" + e.component.dataKey + "_id", E = n(), I = i() === !0, M = i() === !1, O = {
        "opacity-0 ease-out duration-100": i() === !0,
        "opacity-100 ease-in duration-200": i() === !1
      }, N = {
        "opacity-100 ease-in duration-200": i() === !0,
        "opacity-0 ease-out duration-100": i() === !1
      };
      return p.e = te(f, L, p.e), V !== p.t && ($.innerHTML = p.t = V), v !== p.a && u.classList.toggle("bg-blue-600", p.a = v), h !== p.o && u.classList.toggle("bg-gray-200", p.o = h), w !== p.i && J(u, "id", p.i = w), E !== p.n && (u.disabled = p.n = E), I !== p.s && b.classList.toggle("translate-x-5", p.s = I), M !== p.h && b.classList.toggle("translate-x-0", p.h = M), p.r = te(y, O, p.r), p.d = te(S, N, p.d), p;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0,
      n: void 0,
      s: void 0,
      h: void 0,
      r: void 0,
      d: void 0
    }), o;
  })();
};
ye(["click"]);
var Hc = /* @__PURE__ */ k("<span class=text-pink-600>*"), Jc = /* @__PURE__ */ k('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Uc = /* @__PURE__ */ k('<div class="italic text-xs font-extralight text-zinc-400 ">'), Wc = /* @__PURE__ */ k('<span class="absolute top-0 right-0 inline-flex items-center justify-center h-6 w-6 text-xs font-semibold text-white transform translate-x-1/2 -translate-y-1/4 bg-pink-600/80 rounded-full">'), qc = /* @__PURE__ */ k('<div class=shrink-0><button class="relative inline-block bg-white p-2 h-10 w-10 text-gray-500 rounded-full hover:bg-yellow-100 hover:text-yellow-400 hover:border-yellow-100 border-2 border-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z">'), Gc = /* @__PURE__ */ k('<div class="md:grid md:grid-cols-3 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 md:col-span-2 flex items-start gap-2"><div class=flex-1><div class=" grid grid-cols-12"><div class=col-span-10><input type=range class="form-range w-full font-light px-2 text-sm text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"></div><div class="col-span-1 text-center">'), Yc = /* @__PURE__ */ k('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), Qc = /* @__PURE__ */ k('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Zc = /* @__PURE__ */ k('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="flex-1 text-justify">');
const Xc = (e) => {
  const t = e.config, [n] = K(t.formMode > 1 ? !0 : e.component.disableInput), [i, r] = K(!1), l = () => {
    i() ? r(!1) : r(!0);
  }, [a] = K(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [s] = K(t.formMode > 2 && e.comments == 0);
  return (() => {
    var c = Gc(), o = c.firstChild, d = o.firstChild, f = d.firstChild, x = d.nextSibling, $ = o.nextSibling, C = $.firstChild, g = C.firstChild, u = g.firstChild, b = u.firstChild, y = u.nextSibling;
    return _(d, m(j, {
      get when() {
        return e.component.required;
      },
      get children() {
        return Hc();
      }
    }), null), _(d, m(j, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var S = Jc();
        return S.$$click = l, S;
      }
    }), null), _(x, m(j, {
      get when() {
        return i();
      },
      get children() {
        var S = Uc();
        return R(() => S.innerHTML = e.component.hint), S;
      }
    })), b.addEventListener("change", (S) => e.onValueChange(S.currentTarget.value)), _(y, () => e.value || 0), _(C, m(j, {
      get when() {
        var S;
        return ((S = e.validationMessage) == null ? void 0 : S.length) > 0;
      },
      get children() {
        return m(fe, {
          get each() {
            return e.validationMessage;
          },
          children: (S) => (() => {
            var p = Zc(), L = p.firstChild, V = L.firstChild;
            return _(L, m(we, {
              get children() {
                return [m(ee, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return Yc();
                  }
                }), m(ee, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return Qc();
                  }
                })];
              }
            }), V), V.innerHTML = S, R((v) => te(L, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, v)), p;
          })()
        });
      }
    }), null), _($, m(j, {
      get when() {
        return a();
      },
      get children() {
        var S = qc(), p = S.firstChild;
        return p.firstChild, p.$$click = (L) => e.openRemark(e.component.dataKey), _(p, m(j, {
          get when() {
            return ue(() => !!e.comments)() && e.comments > 0;
          },
          get children() {
            var L = Wc();
            return _(L, () => e.comments), L;
          }
        }), null), R(() => p.disabled = s()), S;
      }
    }), null), R((S) => {
      var p = e.component.label, L = {
        " border-b border-orange-500 pb-5 ": e.classValidation === 1,
        " border-b border-pink-600 pb-5 ": e.classValidation === 2
      }, V = e.component.rangeInput[0].min, v = e.component.rangeInput[0].max, h = e.component.rangeInput[0].step, w = n();
      return p !== S.e && (f.innerHTML = S.e = p), S.t = te(g, L, S.t), V !== S.a && J(b, "min", S.a = V), v !== S.o && J(b, "max", S.o = v), h !== S.i && J(b, "step", S.i = h), w !== S.n && (b.disabled = S.n = w), S;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0,
      n: void 0
    }), R(() => b.value = e.value || 0), c;
  })();
};
ye(["click"]);
var eu = /* @__PURE__ */ k("<div>");
const Rl = (e) => {
  let t;
  return Gr(() => {
    if (t) {
      const n = t.attachShadow({
        mode: "open"
      });
      n.innerHTML = e.component.label;
    }
  }), (() => {
    var n = eu(), i = t;
    return typeof i == "function" ? en(i, n) : t = n, n;
  })();
};
function tu(e, t) {
  let n;
  const i = () => clearTimeout(n);
  return bi(i), Object.assign(function(...l) {
    n !== void 0 && i(), n = setTimeout(() => e(...l), t);
  }, { clear: i });
}
var Fi = tu, nu = /* @__PURE__ */ k("<span class=text-pink-600>*"), iu = /* @__PURE__ */ k('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), ru = /* @__PURE__ */ k('<div class="italic text-xs font-extralight text-zinc-400 ">'), lu = /* @__PURE__ */ k('<span class="absolute top-0 right-0 inline-flex items-center justify-center h-6 w-6 text-xs font-semibold text-white transform translate-x-1/2 -translate-y-1/4 bg-pink-600/80 rounded-full">'), au = /* @__PURE__ */ k('<div class=shrink-0><button class="relative inline-block bg-white p-2 h-10 w-10 text-gray-500 rounded-full hover:bg-yellow-100 hover:text-yellow-400 hover:border-yellow-100 border-2 border-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z">'), su = /* @__PURE__ */ k('<div class="grid md:grid-cols-3 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 md:col-span-2 flex items-start gap-2"><div class=flex-1><input type=text class="w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"placeholder>'), ou = /* @__PURE__ */ k('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), du = /* @__PURE__ */ k('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), cu = /* @__PURE__ */ k('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="flex-1 text-justify">');
const uu = (e) => {
  const t = e.config, [n] = K(t.formMode > 1 ? !0 : e.component.disableInput);
  let i = (x) => {
    let $ = String.fromCharCode(x.charCode ? x.charCode : x.which), C = e.component.separatorFormat === "id-ID" ? /^\d{1,99}(?:\,\d{0,10})?$/ : /^\d{1,99}(?:\.\d{0,10})?$/, g = document.getElementById("currencyInput" + e.index).value, u = l(g);
    C.test(u + $) || (x.preventDefault ? x.preventDefault() : x.returnValue = !1);
  }, r = Fi((x) => {
    let $ = l(x), C = e.component.separatorFormat === "id-ID" ? $.replace(",", ".") : $;
    e.onValueChange(C);
  }, 1500), l = (x) => {
    let $, C;
    return e.component.separatorFormat === "id-ID" ? ($ = e.component.isDecimal ? x.indexOf(",00") != -1 ? x.substring(0, x.indexOf(",00")) : x : x.indexOf(",") != -1 ? x.substring(0, x.indexOf(",")) : x, C = "0123456789,") : e.component.separatorFormat === "en-US" && ($ = e.component.isDecimal ? x.indexOf(".00") != -1 ? x.substring(0, x.indexOf(".00")) : x : x.indexOf(".") != -1 ? x.substring(0, x.indexOf(".")) : x, C = "0123456789."), Array.from($).filter((g) => C.includes(g)).join("");
  }, a = Number(e.value).toLocaleString(e.component.separatorFormat, {
    style: "currency",
    currency: e.component.currency,
    minimumFractionDigits: 0
  });
  const [s, c] = K(!1), o = () => {
    s() ? c(!1) : c(!0);
  }, [d] = K(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [f] = K(t.formMode > 2 && e.comments == 0);
  return (() => {
    var x = su(), $ = x.firstChild, C = $.firstChild, g = C.firstChild, u = C.nextSibling, b = $.nextSibling, y = b.firstChild, S = y.firstChild;
    return _(C, m(j, {
      get when() {
        return e.component.required;
      },
      get children() {
        return nu();
      }
    }), null), _(C, m(j, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var p = iu();
        return p.$$click = o, p;
      }
    }), null), _(u, m(j, {
      get when() {
        return s();
      },
      get children() {
        var p = ru();
        return R(() => p.innerHTML = e.component.hint), p;
      }
    })), S.$$keyup = (p) => r(p.currentTarget.value), S.addEventListener("keypress", (p) => i(p)), _(y, m(j, {
      get when() {
        var p;
        return ((p = e.validationMessage) == null ? void 0 : p.length) > 0;
      },
      get children() {
        return m(fe, {
          get each() {
            return e.validationMessage;
          },
          children: (p) => (() => {
            var L = cu(), V = L.firstChild, v = V.firstChild;
            return _(V, m(we, {
              get children() {
                return [m(ee, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return ou();
                  }
                }), m(ee, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return du();
                  }
                })];
              }
            }), v), v.innerHTML = p, R((h) => te(V, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, h)), L;
          })()
        });
      }
    }), null), _(b, m(j, {
      get when() {
        return d();
      },
      get children() {
        var p = au(), L = p.firstChild;
        return L.firstChild, L.$$click = (V) => e.openRemark(e.component.dataKey), _(L, m(j, {
          get when() {
            return ue(() => !!e.comments)() && e.comments > 0;
          },
          get children() {
            var V = lu();
            return _(V, () => e.comments), V;
          }
        }), null), R(() => L.disabled = f()), p;
      }
    }), null), R((p) => {
      var L = e.component.label, V = e.component.dataKey, v = {
        " border border-solid border-gray-300 ": e.classValidation === 0,
        " border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
        " border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
      }, h = n(), w = "currencyInput" + e.index, E = e.component.rangeInput && e.component.rangeInput[0].max !== void 0 ? e.component.rangeInput[0].max : "", I = e.component.rangeInput && e.component.rangeInput[0].min !== void 0 ? e.component.rangeInput[0].min : "";
      return L !== p.e && (g.innerHTML = p.e = L), V !== p.t && J(S, "name", p.t = V), p.a = te(S, v, p.a), h !== p.o && (S.disabled = p.o = h), w !== p.i && J(S, "id", p.i = w), E !== p.n && J(S, "max", p.n = E), I !== p.s && J(S, "min", p.s = I), p;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0,
      n: void 0,
      s: void 0
    }), R(() => S.value = e.component.separatorFormat === "id-ID" ? a.replace(",00", "") : a.replace("IDR", "Rp")), x;
  })();
};
ye(["click", "keyup"]);
var hu = /* @__PURE__ */ k('<div class="modal-delete fixed z-10 inset-0 overflow-y-auto"aria-labelledby=modal-title role=dialog aria-modal=true><div class="flex items-center justify-center min-h-screen pt-4 px-4 text-center sm:block sm:p-0"><div class="fixed inset-0 bg-gray-500/75 transition-opacity"aria-hidden=true></div><span class="hidden sm:inline-block sm:align-middle sm:h-screen"aria-hidden=true>&#8203;</span><div class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"><div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4"><div class="sm:flex sm:items-start"><div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"><svg class="h-6 w-6 text-red-600"xmlns=http://www.w3.org/2000/svg fill=none viewBox="0 0 24 24"stroke=currentColor aria-hidden=true><path stroke-linecap=round stroke-linejoin=round stroke-width=2 d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg></div><div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left"><h3 class="text-lg leading-6 font-medium text-gray-900"id=titleModalDelete>Deactivate account</h3><div class=mt-2><p class="text-sm text-gray-500"id=contentModalDelete>Are you sure you want to deactivate your account? All of your data will be permanently removed. This action cannot be undonssse.</p></div></div></div></div><div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"><button type=button class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">Delete</button><button type=button class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Cancel'), gu = /* @__PURE__ */ k("<span class=text-pink-600>*"), fu = /* @__PURE__ */ k('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), vu = /* @__PURE__ */ k('<div class="italic text-xs font-extralight text-zinc-400 ">'), mu = /* @__PURE__ */ k('<div class="grid grid-cols-12 "><div class="col-span-10 mr-2"><input type=text class="w-full font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"></div><div class="col-span-2 flex justify-evenly p-1 space-x-1 "><button class="bg-teal-400 text-white p-2 rounded-full focus:outline-none hover:bg-teal-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"viewBox="0 0 20 20"fill=currentColor><path fill-rule=evenodd d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"clip-rule=evenodd></path></svg></button><button class="bg-gray-500 text-white p-2 rounded-full focus:outline-none hover:bg-gray-400 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"viewBox="0 0 20 20"fill=currentColor><path fill-rule=evenodd d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"clip-rule=evenodd>'), bu = /* @__PURE__ */ k('<div><div class="grid grid-cols-6 p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2 col-span-5"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm space-x-2 pt-2.5 px-2 flex justify-end "><button class="bg-pink-600 text-white p-2 rounded-full focus:outline-none h-10 w-10 hover:bg-pink-500 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-6 w-6"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 4v16m8-8H4"></path></svg></button></div></div><div class="grid md:grid-cols-12 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm pb-2.5 px-2 col-start-2 col-end-12 space-y-4 transition-all delay-100"></div><div class=col-span-12></div><div class="col-span-12 pb-4">'), wu = /* @__PURE__ */ k('<div class="grid grid-cols-12"><div class="col-span-10 mr-2"><input type=text class="w-full font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"></div><div class="col-span-2 flex justify-evenly p-1 space-x-1 "><button class="bg-teal-400 text-white p-2 rounded-full focus:outline-none hover:bg-teal-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"viewBox="0 0 20 20"fill=currentColor><path fill-rule=evenodd d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"clip-rule=evenodd></path></svg></button><button class="bg-gray-500 text-white p-2 rounded-full focus:outline-none hover:bg-gray-400 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"viewBox="0 0 20 20"fill=currentColor><path fill-rule=evenodd d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"clip-rule=evenodd>'), xu = /* @__PURE__ */ k('<div class="grid grid-cols-12"><div class="col-span-10 mr-2"><input type=text class="w-full font-light px-4 py-2.5 text-sm text-gray-700 bg-gray-200 bg-clip-padding dark:bg-gray-300 border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"disabled></div><div class="col-span-2 flex justify-evenly p-1 space-x-1 "><button class="bg-orange-400 text-white p-2 rounded-full focus:outline-none hover:bg-orange-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"viewBox="0 0 20 20"fill=currentColor><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg></button><button class="bg-red-600 text-white p-2 rounded-full focus:outline-none hover:bg-red-500 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"viewBox="0 0 20 20"fill=currentColor><path fill-rule=evenodd d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"clip-rule=evenodd>'), yu = /* @__PURE__ */ k('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), pu = /* @__PURE__ */ k('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), ku = /* @__PURE__ */ k('<div class="text-xs font-light mt-1"><div class="grid grid-cols-12"><div class="col-span-11 text-justify mr-1">');
const Nl = (e) => {
  const [t] = Et(), [n, i] = K(0), [r, l] = K(0), [a, s] = K(JSON.parse(JSON.stringify(e.value))), [c, o] = K(""), d = e.config, [f] = K(d.formMode > 1 ? !0 : e.component.disableInput);
  let x = Ee(() => {
    const v = e.value[0].label.split("#");
    return Number(v[1]);
  }), $ = () => {
    n() === 0 && r() === 0 ? (i(1), l(0)) : Xe(t.details.language[0].componentNotAllowed);
  }, C = (v) => {
    n() === 0 && r() === 0 ? (i(1), l(v)) : Xe(t.details.language[0].componentNotAllowed);
  }, g = (v) => {
    i(0), l(0), o("");
  }, u = (v) => {
    if (n() === 0 && r() === 0)
      i(2), l(v), S();
    else if (n() === 1)
      Xe("Only 1 component is allowed to edit");
    else if (n() === 2) {
      let h = JSON.parse(JSON.stringify(a())), w = h.findIndex((E) => E.value == v);
      h.splice(w, 1), e.onValueChange(h), Xe(t.details.language[0].componentDeleted), i(0), l(0);
    }
  }, b = (v) => {
    if (c() !== "") {
      let h = JSON.parse(JSON.stringify(a()));
      if (r() === 0)
        h = [...h, {
          value: v,
          label: c()
        }], h[0].label = "lastId#" + v;
      else {
        let w = h.findIndex((E) => E.value == v);
        h[w].label = c();
      }
      e.onValueChange(h), r() === 0 ? Xe(t.details.language[0].componentAdded) : Xe(t.details.language[0].componentEdited), i(0), l(0);
    } else
      r() === 0 ? Xe(t.details.language[0].componentEmpty) : (i(0), l(0));
  }, y = (v) => {
    o(v.target.value.trim());
  };
  const S = () => {
    let v = document.querySelector("#titleModalDelete"), h = document.querySelector("#contentModalDelete");
    v.innerHTML = e.component.titleModalDelete !== void 0 ? e.component.titleModalDelete : "Confirm Delete?", h.innerHTML = e.component.contentModalDelete !== void 0 ? e.component.contentModalDelete : "Deletion will also delete related components, including child components from this parent.";
  }, [p, L] = K(!1), V = () => {
    p() ? L(!1) : L(!0);
  };
  return (() => {
    var v = bu(), h = v.firstChild, w = h.firstChild, E = w.firstChild, I = E.firstChild, M = E.nextSibling, O = w.nextSibling, N = O.firstChild, T = h.nextSibling, A = T.firstChild, z = A.nextSibling, D = z.nextSibling;
    return _(v, m(j, {
      get when() {
        return n() == 2;
      },
      get children() {
        var P = hu(), B = P.firstChild, F = B.firstChild, U = F.nextSibling, H = U.nextSibling, ne = H.firstChild, X = ne.nextSibling, oe = X.firstChild, se = oe.nextSibling;
        return oe.$$click = (W) => u(r()), se.$$click = (W) => g(r()), P;
      }
    }), h), _(E, m(j, {
      get when() {
        return e.component.required;
      },
      get children() {
        return gu();
      }
    }), null), _(E, m(j, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var P = fu();
        return P.$$click = V, P;
      }
    }), null), _(M, m(j, {
      get when() {
        return p();
      },
      get children() {
        var P = vu();
        return R(() => P.innerHTML = e.component.hint), P;
      }
    })), N.$$click = (P) => $(), _(A, m(fe, {
      get each() {
        return a();
      },
      children: (P, B) => m(we, {
        get children() {
          return [m(ee, {
            get when() {
              return ue(() => Number(P.value) > 0)() && Number(P.value) === r();
            },
            get children() {
              var F = wu(), U = F.firstChild, H = U.firstChild, ne = U.nextSibling, X = ne.firstChild, oe = X.nextSibling;
              return H.addEventListener("change", (se) => y(se)), X.$$click = (se) => b(Number(P.value)), oe.$$click = (se) => g(Number(P.value)), R((se) => {
                var W = e.component.dataKey + "_input_" + Number(P.value), Y = f(), Q = f();
                return W !== se.e && J(H, "id", se.e = W), Y !== se.t && (X.disabled = se.t = Y), Q !== se.a && (oe.disabled = se.a = Q), se;
              }, {
                e: void 0,
                t: void 0,
                a: void 0
              }), R(() => H.value = P.label), F;
            }
          }), m(ee, {
            get when() {
              return ue(() => Number(P.value) > 0)() && Number(P.value) !== r();
            },
            get children() {
              var F = xu(), U = F.firstChild, H = U.firstChild, ne = U.nextSibling, X = ne.firstChild, oe = X.nextSibling;
              return X.$$click = (se) => C(Number(P.value)), oe.$$click = (se) => u(Number(P.value)), R((se) => {
                var W = e.component.dataKey + "_input_" + Number(P.value), Y = f(), Q = f();
                return W !== se.e && J(H, "id", se.e = W), Y !== se.t && (X.disabled = se.t = Y), Q !== se.a && (oe.disabled = se.a = Q), se;
              }, {
                e: void 0,
                t: void 0,
                a: void 0
              }), R(() => H.value = P.label), F;
            }
          })];
        }
      })
    }), null), _(A, m(j, {
      get when() {
        return ue(() => n() == 1)() && r() == 0;
      },
      get children() {
        var P = mu(), B = P.firstChild, F = B.firstChild, U = B.nextSibling, H = U.firstChild, ne = H.nextSibling;
        return F.addEventListener("change", (X) => y(X)), H.$$click = (X) => b(x() + 1), ne.$$click = (X) => g(x() + 1), R((X) => {
          var oe = e.component.dataKey + "_input_" + (x() + 1), se = f(), W = f();
          return oe !== X.e && J(F, "id", X.e = oe), se !== X.t && (H.disabled = X.t = se), W !== X.a && (ne.disabled = X.a = W), X;
        }, {
          e: void 0,
          t: void 0,
          a: void 0
        }), P;
      }
    }), null), _(D, m(j, {
      get when() {
        var P;
        return ((P = e.validationMessage) == null ? void 0 : P.length) > 0;
      },
      get children() {
        return m(fe, {
          get each() {
            return e.validationMessage;
          },
          children: (P) => (() => {
            var B = ku(), F = B.firstChild, U = F.firstChild;
            return _(F, m(we, {
              get children() {
                return [m(ee, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return yu();
                  }
                }), m(ee, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return pu();
                  }
                })];
              }
            }), U), U.innerHTML = P, R((H) => te(F, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, H)), B;
          })()
        });
      }
    })), R((P) => {
      var B = e.component.label, F = f(), U = {
        " border-b border-orange-500 pb-3 ": e.classValidation === 1,
        " border-b border-pink-600 pb-3 ": e.classValidation === 2
      };
      return B !== P.e && (I.innerHTML = P.e = B), F !== P.t && (N.disabled = P.t = F), P.a = te(z, U, P.a), P;
    }, {
      e: void 0,
      t: void 0,
      a: void 0
    }), v;
  })();
};
ye(["click"]);
var $u = /* @__PURE__ */ k('<div class="modal-delete fixed z-10 inset-0 overflow-y-auto"aria-labelledby=modal-title role=dialog aria-modal=true><div class="flex items-center justify-center min-h-screen pt-4 px-4 text-center sm:block sm:p-0"><div class="fixed inset-0 bg-gray-500/75 transition-opacity"aria-hidden=true></div><span class="hidden sm:inline-block sm:align-middle sm:h-screen"aria-hidden=true>&#8203;</span><div class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"><div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4"><div class="sm:flex sm:items-start"><div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"><svg class="h-6 w-6 text-red-600"xmlns=http://www.w3.org/2000/svg fill=none viewBox="0 0 24 24"stroke=currentColor aria-hidden=true><path stroke-linecap=round stroke-linejoin=round stroke-width=2 d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg></div><div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left"><h3 class="text-lg leading-6 font-medium text-gray-900"id=titleModalDelete>Deactivate account</h3><div class=mt-2><p class="text-sm text-gray-500"id=contentModalDelete>Are you sure you want to deactivate your account? All of your data will be permanently removed. This action cannot be undone.</p></div></div></div></div><div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"><button type=button class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">Delete</button><button type=button class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Cancel'), _u = /* @__PURE__ */ k("<span class=text-pink-600>*"), Su = /* @__PURE__ */ k('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Cu = /* @__PURE__ */ k('<div class="italic text-xs font-extralight text-zinc-400 ">'), Mu = /* @__PURE__ */ k('<div class="font-light text-sm space-x-2 pt-2.5 px-2 flex justify-end"><button class="bg-pink-600 text-white p-2 rounded-full focus:outline-none h-10 w-10 hover:bg-pink-500 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-6 w-6"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 4v16m8-8H4">'), Iu = /* @__PURE__ */ k('<div class="grid grid-cols-12 "><div class="col-span-10 mr-2"></div><div class="col-span-2 flex justify-evenly p-1 space-x-1 "><button class="bg-teal-400 text-white p-2 rounded-full focus:outline-none hover:bg-teal-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"viewBox="0 0 20 20"fill=currentColor><path fill-rule=evenodd d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"clip-rule=evenodd></path></svg></button><button class="bg-gray-500 text-white p-2 rounded-full focus:outline-none hover:bg-gray-400 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"viewBox="0 0 20 20"fill=currentColor><path fill-rule=evenodd d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"clip-rule=evenodd>'), Eu = /* @__PURE__ */ k('<div><div class="grid grid-cols-6 p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2 col-span-5"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div></div><div class="grid md:grid-cols-12 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm pb-2.5 px-2 col-start-2 col-end-12 space-y-4"></div><div class=col-span-12></div><div class="col-span-12 pb-4">'), Ou = /* @__PURE__ */ k('<div class="grid grid-cols-12"><div class="col-span-10 mr-2"></div><div class="col-span-2 flex justify-evenly p-1 space-x-1 "><button class="bg-teal-400 text-white p-2 rounded-full focus:outline-none hover:bg-teal-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"viewBox="0 0 20 20"fill=currentColor><path fill-rule=evenodd d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"clip-rule=evenodd></path></svg></button><button class="bg-gray-500 text-white p-2 rounded-full focus:outline-none hover:bg-gray-400 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"viewBox="0 0 20 20"fill=currentColor><path fill-rule=evenodd d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"clip-rule=evenodd>'), Lu = /* @__PURE__ */ k('<div class="grid grid-cols-12"><div class="col-span-10 mr-2"><input type=text class="w-full font-light px-4 py-2.5 text-sm text-gray-700 bg-gray-200 bg-clip-padding dark:bg-gray-300 border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"disabled></div><div class="col-span-2 flex justify-evenly p-1 space-x-1 "><button class="bg-orange-400 text-white p-2 rounded-full focus:outline-none hover:bg-orange-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"viewBox="0 0 20 20"fill=currentColor><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg></button><button class="bg-red-600 text-white p-2 rounded-full focus:outline-none hover:bg-red-500 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"viewBox="0 0 20 20"fill=currentColor><path fill-rule=evenodd d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"clip-rule=evenodd>'), Au = /* @__PURE__ */ k('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), Ru = /* @__PURE__ */ k('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Nu = /* @__PURE__ */ k('<div class="text-xs font-light mt-1"><div class="grid grid-cols-12"><div class="col-span-11 text-justify mr-1">');
const Vl = (e) => {
  const [t] = It(), [n] = Et(), [i, r] = K(0), [l, a] = K(0), [s, c] = K(JSON.parse(JSON.stringify(e.value))), [o, d] = K({
    value: 0,
    label: ""
  }), [f, x] = K(!1), $ = e.config, [C, g] = K($.formMode > 1 ? !0 : e.component.disableInput);
  let u = Ee(() => 0), b, y;
  switch (e.component.typeOption) {
    case 1: {
      try {
        y = Ee(() => {
          let O = JSON.parse(JSON.stringify(e.component.options));
          const N = s().length;
          let T = 0;
          for (s()[0] !== void 0 && (T = s()[0].value == 0 ? 1 : 0), T; T < N; T++)
            if (l() === 0 || l() !== Number(s()[T].value)) {
              let A = O.findIndex((z) => z.value == s()[T].value);
              O.splice(A, 1);
            }
          return O;
        });
      } catch (O) {
        x(!0), ke(n.details.language[0].fetchFailed);
      }
      break;
    }
    case 2: {
      try {
        if ($.lookupMode === 1) {
          let O = e.component.sourceAPI[0], N = `${O.baseUrl}`;
          if (O.filterDependencies !== void 0 && O.filterDependencies.length > 0) {
            let D, P, B = N;
            D = O.filterDependencies.map((F, U) => {
              let H = F.sourceAnswer.split("@"), ne = t.details.find((X) => X.dataKey == H[0]);
              if (ne.answer) {
                if (ne.answer.length > 0) {
                  let X = encodeURI(ne.answer[ne.answer.length - 1].value);
                  P = `${F.params}=${X}`;
                }
              } else
                g(!0);
              return P;
            }).join("&"), N = `${B}?${D}`;
          }
          if (O.subResourceDependencies !== void 0 && O.subResourceDependencies.length > 0) {
            let D, P, B = N;
            D = O.subResourceDependencies.map((F, U) => {
              let H = F.sourceAnswer.split("@"), ne = t.details.find((X) => X.dataKey == H[0]);
              return ne.answer ? ne.answer.length > 0 && (P = `${encodeURI(ne.answer[ne.answer.length - 1].value)}/${F.params}`) : g(!0), P;
            }).join("/"), N = `${B}/${D}`;
          }
          let T = {
            headers: JSON.stringify(O.headers),
            method: "GET"
          };
          const A = (D) => ce(null, null, function* () {
            return yield fetch(D, {
              head: T
            }).catch((P) => ({
              success: !1,
              data: {},
              message: "500"
            })).then((P) => ce(null, null, function* () {
              if (P.status === 200) {
                let B = yield P.json(), F = new Object();
                return F.success = !0, F.data = O.data !== "" ? B[O.data] : B, F.message = B.msg, F;
              } else
                return {
                  success: !1,
                  data: {},
                  message: P.status
                };
            })).then((P) => P);
          }), [z] = Dn(() => N, A);
          y = Ee(() => {
            if (z())
              if (!z().success)
                x(!0), ke(n.details.language[0].fetchFailed);
              else {
                let D = [];
                z().data.map((F, U) => {
                  D.push({
                    value: F[O.value],
                    label: F[O.label]
                  });
                }), b = D;
                const P = s().length;
                let B = 0;
                for (s()[0] !== void 0 && (B = s()[0].value == 0 ? 1 : 0), B; B < P; B++)
                  if (l() === 0 || l() !== Number(s()[B].value)) {
                    let F = b.findIndex((U) => U.value == s()[B].value);
                    b.splice(F, 1);
                  }
                return b;
              }
          });
        } else if ($.lookupMode === 2) {
          let O, N = [];
          O = e.component.sourceSelect;
          let T = O[0].id, A = O[0].version;
          O[0].parentCondition.length > 0 && O[0].parentCondition.map((P, B) => {
            let F = P.value.split("@"), U = t.details.find((H) => H.dataKey == F[0]);
            if (U.answer && U.answer.length > 0) {
              let H = U.answer[U.answer.length - 1].value.toString();
              N.push({
                key: P.key,
                value: H
              });
            }
          });
          let z = (P) => {
            y = Ee(() => {
              if (!P.success)
                x(!0), ke(n.details.language[0].fetchFailed);
              else {
                let B = [];
                if (P.data.length > 0) {
                  let F = O[0].value, U = O[0].desc;
                  P.data.map((X, oe) => {
                    B.push({
                      value: X[F],
                      label: X[U]
                    });
                  }), b = B;
                  const H = s().length;
                  let ne = 0;
                  for (s()[0] !== void 0 && (ne = s()[0].value == 0 ? 1 : 0), ne; ne < H; ne++)
                    if (l() === 0 || l() !== Number(s()[ne].value)) {
                      let X = b.findIndex((oe) => oe.value == s()[ne].value);
                      b.splice(X, 1);
                    }
                  return b;
                }
              }
            });
          };
          const D = e.MobileOfflineSearch(T, A, N, z);
        }
      } catch (O) {
        x(!0), ke(n.details.language[0].fetchFailed);
      }
      break;
    }
    case 3: {
      try {
        y = Ee(() => {
          let O = e.component.sourceOption !== void 0 ? [] : JSON.parse(JSON.stringify(e.component.options));
          if (e.component.sourceOption !== void 0) {
            const A = t.details.findIndex((z) => z.dataKey === e.component.sourceOption);
            t.details[A].type, t.details[A].answer ? O = JSON.parse(JSON.stringify(t.details[A].answer)) : O = [];
          }
          const N = s().length;
          let T = 0;
          for (s()[0] !== void 0 && (T = s()[0].value == 0 ? 1 : 0), T; T < N; T++)
            if (l() === 0 || l() !== Number(s()[T].value)) {
              let A = O.findIndex((z) => z.value == s()[T].value);
              O.splice(A, 1);
            }
          return O;
        });
      } catch (O) {
        x(!0), ke(n.details.language[0].fetchFailed);
      }
      break;
    }
    default: {
      try {
        y = Ee(() => {
          let O;
          if (e.component.options) {
            O = JSON.parse(JSON.stringify(e.component.options));
            const N = s().length;
            let T = 0;
            for (s()[0] !== void 0 && (T = s()[0].value == 0 ? 1 : 0), T; T < N; T++)
              if (l() === 0 || l() !== Number(s()[T].value)) {
                let A = O.findIndex((z) => z.value == s()[T].value);
                O.splice(A, 1);
              }
          } else
            O = [];
          return O;
        });
      } catch (O) {
        x(!0), ke(n.details.language[0].fetchFailed);
      }
      break;
    }
  }
  let S = () => {
    i() === 0 && l() === 0 ? (r(1), a(0)) : Xe(n.details.language[0].componentNotAllowed);
  }, p = (O) => {
    i() === 0 && l() === 0 ? (r(1), a(O)) : Xe(n.details.language[0].componentNotAllowed);
  }, L = (O) => {
    r(0), a(0), d({
      value: 0,
      label: ""
    });
  }, V = (O) => {
    if (i() === 0 && l() === 0)
      r(2), a(O), w();
    else if (i() === 1)
      Xe(n.details.language[0].componentNotAllowed);
    else if (i() === 2) {
      let N = JSON.parse(JSON.stringify(s())), T = N.findIndex((A) => A.value == O);
      N.splice(T, 1), e.onValueChange(N), Xe(n.details.language[0].componentDeleted), r(0), a(0);
    }
  }, v = (O) => {
    if (o().value !== 0) {
      let N = JSON.parse(JSON.stringify(s()));
      if (l() === 0)
        N.length == 0 && (N = [...N, {
          label: "lastId#0",
          value: "0"
        }]), N = [...N, o()];
      else {
        let T = N.findIndex((A) => A.value == O);
        N.splice(T, 1, o());
      }
      e.onValueChange(N), l() === 0 ? Xe(n.details.language[0].componentAdded) : Xe(n.details.language[0].componentEdited), r(0), a(0);
    } else
      l() === 0 ? Xe(n.details.language[0].componentEmpty) : (r(0), a(0));
  }, h = (O) => {
    d(O);
  };
  const w = () => {
    let O = document.querySelector("#titleModalDelete"), N = document.querySelector("#contentModalDelete");
    O.innerHTML = e.component.titleModalDelete !== void 0 ? e.component.titleModalDelete : "Confirm Delete?", N.innerHTML = e.component.contentModalDelete !== void 0 ? e.component.contentModalDelete : "Deletion will also delete related components, including child components from this parent.";
  }, [E, I] = K(!1), M = () => {
    E() ? I(!1) : I(!0);
  };
  return (() => {
    var O = Eu(), N = O.firstChild, T = N.firstChild, A = T.firstChild, z = A.firstChild, D = A.nextSibling, P = N.nextSibling, B = P.firstChild, F = B.nextSibling, U = F.nextSibling;
    return _(O, m(j, {
      get when() {
        return i() == 2;
      },
      get children() {
        var H = $u(), ne = H.firstChild, X = ne.firstChild, oe = X.nextSibling, se = oe.nextSibling, W = se.firstChild, Y = W.nextSibling, Q = Y.firstChild, G = Q.nextSibling;
        return Q.$$click = (le) => V(l()), G.$$click = (le) => L(l()), H;
      }
    }), N), _(A, m(j, {
      get when() {
        return e.component.required;
      },
      get children() {
        return _u();
      }
    }), null), _(A, m(j, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var H = Su();
        return H.$$click = M, H;
      }
    }), null), _(D, m(j, {
      get when() {
        return E();
      },
      get children() {
        var H = Cu();
        return R(() => H.innerHTML = e.component.hint), H;
      }
    })), _(N, m(j, {
      get when() {
        return !f();
      },
      get children() {
        var H = Mu(), ne = H.firstChild;
        return ne.$$click = (X) => S(), R(() => ne.disabled = C()), H;
      }
    }), null), _(B, m(fe, {
      get each() {
        return s();
      },
      children: (H, ne) => m(we, {
        get children() {
          return [m(ee, {
            get when() {
              return ue(() => Number(H.value) > 0)() && Number(H.value) === l();
            },
            get children() {
              var X = Ou(), oe = X.firstChild, se = oe.nextSibling, W = se.firstChild, Y = W.nextSibling;
              return _(oe, m(Mn, jt({
                class: "formgear-select w-full rounded font-light text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-0 border-transparent focus:outline-none"
              }, () => Cn(y(), {
                key: "label",
                filterable: !0
              }), {
                onChange: (Q) => h(Q),
                initialValue: H
              }))), W.$$click = (Q) => v(Number(H.value)), Y.$$click = (Q) => L(Number(H.value)), R((Q) => {
                var G = C(), le = C();
                return G !== Q.e && (W.disabled = Q.e = G), le !== Q.t && (Y.disabled = Q.t = le), Q;
              }, {
                e: void 0,
                t: void 0
              }), X;
            }
          }), m(ee, {
            get when() {
              return ue(() => Number(H.value) > 0)() && Number(H.value) !== l();
            },
            get children() {
              var X = Lu(), oe = X.firstChild, se = oe.firstChild, W = oe.nextSibling, Y = W.firstChild, Q = Y.nextSibling;
              return Y.$$click = (G) => p(Number(H.value)), Q.$$click = (G) => V(Number(H.value)), R((G) => {
                var le = e.component.dataKey + "_input_" + Number(H.value), _e = C(), me = C();
                return le !== G.e && J(se, "id", G.e = le), _e !== G.t && (Y.disabled = G.t = _e), me !== G.a && (Q.disabled = G.a = me), G;
              }, {
                e: void 0,
                t: void 0,
                a: void 0
              }), R(() => se.value = H.label), X;
            }
          })];
        }
      })
    }), null), _(B, m(j, {
      get when() {
        return ue(() => i() == 1)() && l() == 0;
      },
      get children() {
        var H = Iu(), ne = H.firstChild, X = ne.nextSibling, oe = X.firstChild, se = oe.nextSibling;
        return _(ne, m(Mn, jt({
          class: "formgear-select w-full rounded font-light text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-0 border-transparent focus:outline-none"
        }, () => Cn(y(), {
          key: "label",
          filterable: !0
        }), {
          onChange: (W) => h(W)
        }))), oe.$$click = (W) => v(u()), se.$$click = (W) => L(u()), R((W) => {
          var Y = C(), Q = C();
          return Y !== W.e && (oe.disabled = W.e = Y), Q !== W.t && (se.disabled = W.t = Q), W;
        }, {
          e: void 0,
          t: void 0
        }), H;
      }
    }), null), _(U, m(j, {
      get when() {
        var H;
        return ((H = e.validationMessage) == null ? void 0 : H.length) > 0;
      },
      get children() {
        return m(fe, {
          get each() {
            return e.validationMessage;
          },
          children: (H) => (() => {
            var ne = Nu(), X = ne.firstChild, oe = X.firstChild;
            return _(X, m(we, {
              get children() {
                return [m(ee, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return Au();
                  }
                }), m(ee, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return Ru();
                  }
                })];
              }
            }), oe), oe.innerHTML = H, R((se) => te(X, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, se)), ne;
          })()
        });
      }
    })), R((H) => {
      var ne = e.component.label, X = {
        " border-b border-orange-500 pb-3 ": e.classValidation === 1,
        " border-b border-pink-600 pb-3 ": e.classValidation === 2
      };
      return ne !== H.e && (z.innerHTML = H.e = ne), H.t = te(F, X, H.t), H;
    }, {
      e: void 0,
      t: void 0
    }), O;
  })();
};
ye(["click"]);
var Vu = /* @__PURE__ */ k("<span class=text-pink-600>*"), Tu = /* @__PURE__ */ k('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), ju = /* @__PURE__ */ k('<div class="italic text-xs font-extralight text-zinc-400 ">'), Du = /* @__PURE__ */ k('<span class="absolute top-0 right-0 inline-flex items-center justify-center h-6 w-6 text-xs font-semibold text-white transform translate-x-1/2 -translate-y-1/4 bg-pink-600/80 rounded-full">'), Pu = /* @__PURE__ */ k('<div class=shrink-0><button class="relative inline-block bg-white p-2 h-10 w-10 text-gray-500 rounded-full hover:bg-yellow-100 hover:text-yellow-400 hover:border-yellow-100 border-2 border-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z">'), Ku = /* @__PURE__ */ k('<div class="grid md:grid-cols-3 border-b border-gray-300/[.50] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 md:col-span-2 flex items-start gap-2"><div class=flex-1><div>'), Bu = /* @__PURE__ */ k('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), zu = /* @__PURE__ */ k('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Fu = /* @__PURE__ */ k('<div class="text-xs font-light mt-1"><div class="grid grid-cols-12"><div class="col-span-11 text-justify mr-1">');
const Hu = (e) => {
  const [t] = It(), [n] = Et(), [i, r] = K([]), l = e.config, [a, s] = K(l.formMode > 1 ? !0 : e.component.disableInput);
  let c;
  switch (e.component.typeOption) {
    case 1: {
      try {
        c = JSON.parse(JSON.stringify(e.component.options)), Me(() => {
          r(c);
        });
      } catch (g) {
        ke(n.details.language[0].fetchFailed);
      }
      break;
    }
    case 2: {
      try {
        if (l.lookupMode === 1) {
          let g = e.component.sourceAPI[0], u = `${g.baseUrl}`;
          if (g.filterDependencies !== void 0 && g.filterDependencies.length > 0) {
            let L, V, v = u;
            L = g.filterDependencies.map((h, w) => {
              let E = h.sourceAnswer.split("@"), I = t.details.find((M) => M.dataKey == E[0]);
              if (I.answer) {
                if (I.answer.length > 0) {
                  let M = encodeURI(I.answer[I.answer.length - 1].value);
                  V = `${h.params}=${M}`;
                }
              } else
                s(!0);
              return V;
            }).join("&"), u = `${v}?${L}`;
          }
          if (g.subResourceDependencies !== void 0 && g.subResourceDependencies.length > 0) {
            let L, V, v = u;
            L = g.subResourceDependencies.map((h, w) => {
              let E = h.sourceAnswer.split("@"), I = t.details.find((M) => M.dataKey == E[0]);
              return I.answer ? I.answer.length > 0 && (V = `${encodeURI(I.answer[I.answer.length - 1].value)}/${h.params}`) : s(!0), V;
            }).join("/"), u = `${v}/${L}`;
          }
          let b = {
            headers: JSON.stringify(g.headers),
            method: "GET"
          };
          const y = (L) => ce(null, null, function* () {
            return yield fetch(L, {
              head: b
            }).catch((V) => ({
              success: !1,
              data: {},
              message: "500"
            })).then((V) => ce(null, null, function* () {
              if (V.status === 200) {
                let v = yield V.json(), h = new Object();
                return h.success = !0, h.data = g.data !== "" ? v[g.data] : v, h.message = v.msg, h;
              } else
                return {
                  success: !1,
                  data: {},
                  message: V.status
                };
            })).then((V) => V);
          }), [S] = Dn(() => u, y);
          let p = e.value && e.value != "" ? e.value[0].value : "";
          Me(() => {
            if (S())
              if (!S().success)
                ke(n.details.language[0].fetchFailed);
              else {
                let L = [];
                S().data.map((V, v) => {
                  L.push({
                    value: V[g.value],
                    label: V[g.label]
                  });
                }), r(L);
              }
          });
        } else if (l.lookupMode === 2) {
          let g, u = [];
          g = e.component.sourceSelect;
          let b = g[0].id, y = g[0].version;
          g[0].parentCondition.length > 0 && g[0].parentCondition.map((L, V) => {
            let v = L.value.split("@"), h = t.details.find((w) => w.dataKey == v[0]);
            if (h.answer && h.answer.length > 0) {
              let w = h.answer[h.answer.length - 1].value.toString();
              u.push({
                key: L.key,
                value: w
              });
            }
          });
          let S = (L) => {
            if (!L.success)
              ke(n.details.language[0].fetchFailed);
            else {
              let V = [];
              if (L.data.length > 0) {
                let v = g[0].value, h = g[0].desc;
                L.data.map((w, E) => {
                  V.push({
                    value: w[v],
                    label: w[h]
                  });
                }), r(V);
              }
            }
          };
          const p = e.MobileOfflineSearch(b, y, u, S);
        }
      } catch (g) {
        ke(n.details.language[0].fetchFailed);
      }
      break;
    }
    case 3: {
      try {
        if (c = e.component.sourceOption !== void 0 ? [] : JSON.parse(JSON.stringify(e.component.options)), e.component.sourceOption !== void 0) {
          let g = e.component.sourceOption.split("@");
          const u = t.details.findIndex((b) => b.dataKey === g[0]);
          t.details[u].type, t.details[u].answer ? c = JSON.parse(JSON.stringify(t.details[u].answer)) : c = [];
        }
        Me(() => {
          r(c);
        });
      } catch (g) {
        ke(n.details.language[0].fetchFailed);
      }
      break;
    }
    default: {
      try {
        let g;
        e.component.options ? g = JSON.parse(JSON.stringify(e.component.options)) : g = [], Me(() => {
          r(g);
        });
      } catch (g) {
        ke(n.details.language[0].fetchFailed);
      }
      break;
    }
  }
  let o = (g) => {
    if (g != "" && g != null && Array.isArray(g)) {
      let u = JSON.parse(JSON.stringify(e.value));
      if (e.value.length > g.length)
        u = g;
      else {
        let b = g[g.length - 1];
        e.value ? u.push({
          value: b.value,
          label: b.label
        }) : (u = [], u.push({
          value: b.value,
          label: b.label
        }));
      }
      e.onValueChange(u);
    } else {
      let u = JSON.parse(JSON.stringify(e.value));
      u = [], e.onValueChange(u);
    }
  };
  const [d, f] = K(!1), x = () => {
    d() ? f(!1) : f(!0);
  }, [$] = K(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [C] = K(l.formMode > 2 && e.comments == 0);
  return (() => {
    var g = Ku(), u = g.firstChild, b = u.firstChild, y = b.firstChild, S = b.nextSibling, p = u.nextSibling, L = p.firstChild, V = L.firstChild;
    return _(b, m(j, {
      get when() {
        return e.component.required;
      },
      get children() {
        return Vu();
      }
    }), null), _(b, m(j, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var v = Tu();
        return v.$$click = x, v;
      }
    }), null), _(S, m(j, {
      get when() {
        return d();
      },
      get children() {
        var v = ju();
        return R(() => v.innerHTML = e.component.hint), v;
      }
    })), _(V, m(Mn, jt({
      multiple: !0,
      class: "formgear-select w-full rounded font-light text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-0 border-transparent focus:outline-none  disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
    }, () => Cn(e.value == "" ? i : i().filter((v) => !e.value.some((h) => h.value == v.value)), {
      key: "label",
      filterable: !0
    }), {
      get disabled() {
        return a();
      },
      onChange: (v) => o(v),
      get initialValue() {
        return e.value;
      }
    }))), _(L, m(j, {
      get when() {
        var v;
        return ((v = e.validationMessage) == null ? void 0 : v.length) > 0;
      },
      get children() {
        return m(fe, {
          get each() {
            return e.validationMessage;
          },
          children: (v) => (() => {
            var h = Fu(), w = h.firstChild, E = w.firstChild;
            return _(w, m(we, {
              get children() {
                return [m(ee, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return Bu();
                  }
                }), m(ee, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return zu();
                  }
                })];
              }
            }), E), E.innerHTML = v, R((I) => te(w, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, I)), h;
          })()
        });
      }
    }), null), _(p, m(j, {
      get when() {
        return $();
      },
      get children() {
        var v = Pu(), h = v.firstChild;
        return h.firstChild, h.$$click = (w) => e.openRemark(e.component.dataKey), _(h, m(j, {
          get when() {
            return ue(() => !!e.comments)() && e.comments > 0;
          },
          get children() {
            var w = Du();
            return _(w, () => e.comments), w;
          }
        }), null), R(() => h.disabled = C()), v;
      }
    }), null), R((v) => {
      var h = e.component.label, w = {
        " border rounded border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
        " border rounded border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
      };
      return h !== v.e && (y.innerHTML = v.e = h), v.t = te(V, w, v.t), v;
    }, {
      e: void 0,
      t: void 0
    }), g;
  })();
};
ye(["click"]);
var Ju = (e) => [...e].map((t) => ({
  9: /\d/,
  a: /[a-z]/i,
  "*": /\w/
})[t] || t), Uu = (e) => (t, n) => {
  let i = 0;
  return e.forEach((r) => {
    if (!(t.length < i + 1)) {
      if (typeof r == "string")
        t.slice(i).indexOf(r) !== 0 && (t = t.slice(0, i) + r + t.slice(i), n[0] > i && (n[0] += r.length), n[1] > i && (n[1] += r.length)), i += r.length;
      else if (r instanceof RegExp) {
        const l = t.slice(i).match(r);
        if (!l || l.index === void 0) {
          t = t.slice(0, i);
          return;
        } else l.index > 0 && (t = t.slice(0, i) + t.slice(i + l.index), i -= l.index - 1, n[0] > i && (n[0] -= l.index), n[1] > i && (n[1] -= l.index));
        i += l[0].length;
      }
    }
  }), [t.slice(0, i), n];
}, Wu = (e) => typeof e == "function" ? e : Uu(Array.isArray(e) ? e : Ju(e)), pi = (e) => {
  const t = Wu(e);
  return (i) => {
    const r = i.currentTarget || i.target, [l, a] = t(r.value, [
      r.selectionStart || r.value.length,
      r.selectionEnd || r.value.length
    ]);
    return r.value = l, r.setSelectionRange(...a), l;
  };
}, qu = /* @__PURE__ */ k("<span class=text-pink-600>*"), Gu = /* @__PURE__ */ k('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Yu = /* @__PURE__ */ k('<div class="italic text-xs font-extralight text-zinc-400 ">'), Qu = /* @__PURE__ */ k('<span class="absolute top-0 right-0 inline-flex items-center justify-center h-6 w-6 text-xs font-semibold text-white transform translate-x-1/2 -translate-y-1/4 bg-pink-600/80 rounded-full">'), Zu = /* @__PURE__ */ k('<div class=shrink-0><button class="relative inline-block bg-white p-2 h-10 w-10 text-gray-500 rounded-full hover:bg-yellow-100 hover:text-yellow-400 hover:border-yellow-100 border-2 border-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z">'), Xu = /* @__PURE__ */ k('<div class="md:grid md:grid-cols-3 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 md:col-span-2 flex items-start gap-2"><div class=flex-1><input type=text class="w-full border-gray-300 rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400">'), e0 = /* @__PURE__ */ k('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), t0 = /* @__PURE__ */ k('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), n0 = /* @__PURE__ */ k('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="flex-1 text-justify">');
const i0 = (e) => {
  const t = e.config, [n] = K(t.formMode > 1 ? !0 : e.component.disableInput), i = pi(e.component.maskingFormat), l = {
    ref: void 0
  };
  let a = (x) => {
    e.onValueChange(x);
  };
  Me(() => {
    document.getElementById("inputMask" + e.component.dataKey).click();
  });
  const [s, c] = K(!1), o = () => {
    s() ? c(!1) : c(!0);
  }, [d] = K(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [f] = K(t.formMode > 2 && e.comments == 0);
  return (() => {
    var x = Xu(), $ = x.firstChild, C = $.firstChild, g = C.firstChild, u = C.nextSibling, b = $.nextSibling, y = b.firstChild, S = y.firstChild;
    _(C, m(j, {
      get when() {
        return e.component.required;
      },
      get children() {
        return qu();
      }
    }), null), _(C, m(j, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var L = Gu();
        return L.$$click = o, L;
      }
    }), null), _(u, m(j, {
      get when() {
        return s();
      },
      get children() {
        var L = Yu();
        return R(() => L.innerHTML = e.component.hint), L;
      }
    })), gt(S, "paste", i), gt(S, "input", i, !0), gt(S, "click", i, !0), S.addEventListener("change", (L) => a(L.currentTarget.value));
    var p = l.ref;
    return typeof p == "function" ? en(p, S) : l.ref = S, _(y, m(j, {
      get when() {
        var L;
        return ((L = e.validationMessage) == null ? void 0 : L.length) > 0;
      },
      get children() {
        return m(fe, {
          get each() {
            return e.validationMessage;
          },
          children: (L) => (() => {
            var V = n0(), v = V.firstChild, h = v.firstChild;
            return _(v, m(we, {
              get children() {
                return [m(ee, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return e0();
                  }
                }), m(ee, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return t0();
                  }
                })];
              }
            }), h), h.innerHTML = L, R((w) => te(v, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, w)), V;
          })()
        });
      }
    }), null), _(b, m(j, {
      get when() {
        return d();
      },
      get children() {
        var L = Zu(), V = L.firstChild;
        return V.firstChild, V.$$click = (v) => e.openRemark(e.component.dataKey), _(V, m(j, {
          get when() {
            return ue(() => !!e.comments)() && e.comments > 0;
          },
          get children() {
            var v = Qu();
            return _(v, () => e.comments), v;
          }
        }), null), R(() => V.disabled = f()), L;
      }
    }), null), R((L) => {
      var V = e.component.label, v = "inputMask" + e.component.dataKey, h = e.component.maskingFormat.replace(/[a]/g, "__").replace(/[9]/g, "#"), w = n();
      return V !== L.e && (g.innerHTML = L.e = V), v !== L.t && J(S, "id", L.t = v), h !== L.a && J(S, "placeholder", L.a = h), w !== L.o && (S.disabled = L.o = w), L;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0
    }), R(() => S.value = e.value), x;
  })();
};
ye(["click", "input"]);
var pr = /* @__PURE__ */ k('<input type=text class="w-full font-light px-4 py-2.5 text-sm text-gray-700 bg-gray-200 bg-clip-padding dark:bg-gray-300 border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"disabled>'), r0 = /* @__PURE__ */ k("<small>"), l0 = /* @__PURE__ */ k('<div class="grid space-y-4">'), a0 = /* @__PURE__ */ k('<div class="grid md:grid-cols-3 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-x-2 py-2.5 px-2"><div></div></div><div class="font-light text-sm space-x-2 py-2.5 px-2 md:col-span-2">');
const Tl = (e) => {
  const t = e.config, [n] = K(t.formMode > 1 ? !0 : e.component.disableInput), [i, r] = K(e.value);
  return Me(() => {
    r(e.value);
  }), m(j, {
    get when() {
      return e.component.render;
    },
    get children() {
      var l = a0(), a = l.firstChild, s = a.firstChild, c = a.nextSibling;
      return _(c, m(we, {
        get children() {
          return [m(ee, {
            get when() {
              return ue(() => !!e.component.render)() && e.component.renderType <= 1;
            },
            get children() {
              return [(() => {
                var o = pr();
                return R(() => J(o, "name", e.component.dataKey)), R(() => o.value = e.value), o;
              })(), (() => {
                var o = r0();
                return _(o, () => e.validationMessage), o;
              })()];
            }
          }), m(ee, {
            get when() {
              return ue(() => !!e.component.render)() && e.component.renderType === 2;
            },
            get children() {
              var o = l0();
              return _(o, m(fe, {
                get each() {
                  return e.value;
                },
                children: (d, f) => (() => {
                  var x = pr();
                  return R(() => x.value = d.label), x;
                })()
              })), o;
            }
          })];
        }
      })), R(() => s.innerHTML = e.component.label), l;
    }
  });
};
var s0 = /* @__PURE__ */ k("<span class=text-pink-600>*"), o0 = /* @__PURE__ */ k('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), d0 = /* @__PURE__ */ k('<div class="italic text-xs font-extralight text-zinc-400 ">'), c0 = /* @__PURE__ */ k("<input class=hidden>"), kr = /* @__PURE__ */ k('<button class="bg-white text-gray-500 p-2 mr-2 rounded-full focus:outline-none h-10 w-10 hover:bg-pink-200 hover:text-pink-400 hover:border-pink-200 border-2 border-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z">'), u0 = /* @__PURE__ */ k('<input type=file accept=image/* class="hidden w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"style=color:transparent>'), h0 = /* @__PURE__ */ k('<span class="absolute top-0 right-0 inline-flex items-center justify-center h-6 w-6 text-xs font-semibold text-white transform translate-x-1/2 -translate-y-1/4 bg-pink-600/80 rounded-full">'), g0 = /* @__PURE__ */ k('<button class="relative inline-block bg-white p-2 h-10 w-10 text-gray-500 rounded-full hover:bg-yellow-100 hover:text-yellow-400 hover:border-yellow-100 border-2 border-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z">'), f0 = /* @__PURE__ */ k('<div class="font-light text-sm space-x-2 py-2.5 px-2 col-span-12 space-y-4"><div class=preview-class><div class="container mx-auto"><img class=rounded-md style=width:100%;height:100%>'), v0 = /* @__PURE__ */ k('<div><div class="grid grid-cols-12 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2 col-span-11"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm space-x-2 py-2.5 px-2 space-y-4 flex justify-end -mt-2"></div><div class=col-span-12></div><div class="col-span-12 pb-4">'), m0 = /* @__PURE__ */ k('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), b0 = /* @__PURE__ */ k('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), w0 = /* @__PURE__ */ k('<div class="text-xs font-light mt-1"><div class="grid grid-cols-12"><div class="col-span-11 text-justify mr-1">');
const x0 = (e) => {
  const [t] = Et(), [n, i] = K(""), [r, l] = K("");
  let a = new FileReader();
  const s = e.config, [c] = K(s.formMode > 1 ? !0 : e.component.disableInput);
  Me(() => {
    if (i(e.component.label), e.value[0]) {
      let y = e.value[0].value;
      l(y);
    }
  });
  let o = (S) => {
    var S = JSON.parse(S);
    let p = JSON.parse(JSON.stringify(e.value));
    p = [], p.push({
      value: S.image,
      label: S.label,
      type: S.type
    }), e.onValueChange(p), jn("Image uploaded successfully!");
  }, d = (y) => {
    o(y);
  }, f = () => {
    e.MobileUploadHandler(d);
  }, x = (y) => {
    let S = JSON.parse(JSON.stringify(e.value));
    if (y.target.files && y.target.files[0]) {
      var p = ["jpeg", "jpg", "png", "gif"];
      let L = y.target.files[0], V = L.name.split(".").pop().toLowerCase();
      p.includes(V) ? (a.readAsDataURL(L), a.onload = (v) => {
        var h = L.name;
        S = [], URL.createObjectURL(L), S.push({
          value: v.target.result,
          label: h,
          type: y.target.files[0].type
        }), e.onValueChange(S), jn("Image uploaded successfully!");
      }) : ke("Please submit the appropriate format!");
    }
  };
  const [$, C] = K(!1), g = () => {
    $() ? C(!1) : C(!0);
  }, [u] = K(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [b] = K(s.formMode > 2 && e.comments == 0);
  return (() => {
    var y = v0(), S = y.firstChild, p = S.firstChild, L = p.firstChild, V = L.firstChild, v = L.nextSibling, h = p.nextSibling, w = h.nextSibling, E = w.nextSibling;
    return _(L, m(j, {
      get when() {
        return e.component.required;
      },
      get children() {
        return s0();
      }
    }), null), _(L, m(j, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var I = o0();
        return I.$$click = g, I;
      }
    }), null), _(v, m(j, {
      get when() {
        return $();
      },
      get children() {
        var I = d0();
        return R(() => I.innerHTML = e.component.hint), I;
      }
    })), _(h, m(we, {
      get children() {
        return [m(ee, {
          get when() {
            return s.clientMode == 2;
          },
          get children() {
            return [c0(), (() => {
              var I = kr();
              return I.$$click = () => f(), R(() => I.disabled = c()), I;
            })()];
          }
        }), m(ee, {
          get when() {
            return s.clientMode == 1;
          },
          get children() {
            return [(() => {
              var I = u0();
              return I.addEventListener("change", (M) => {
                x(M);
              }), R((M) => {
                var O = "inputFile_" + e.component.dataKey, N = e.component.dataKey;
                return O !== M.e && J(I, "id", M.e = O), N !== M.t && J(I, "name", M.t = N), M;
              }, {
                e: void 0,
                t: void 0
              }), I;
            })(), (() => {
              var I = kr();
              return I.$$click = (M) => {
                document.getElementById("inputFile_" + e.component.dataKey).click();
              }, R((M) => {
                var O = c(), N = t.details.language[0].uploadImage;
                return O !== M.e && (I.disabled = M.e = O), N !== M.t && J(I, "title", M.t = N), M;
              }, {
                e: void 0,
                t: void 0
              }), I;
            })()];
          }
        })];
      }
    }), null), _(h, m(j, {
      get when() {
        return u();
      },
      get children() {
        var I = g0();
        return I.firstChild, I.$$click = (M) => e.openRemark(e.component.dataKey), _(I, m(j, {
          get when() {
            return ue(() => !!e.comments)() && e.comments > 0;
          },
          get children() {
            var M = h0();
            return _(M, () => e.comments), M;
          }
        }), null), R(() => I.disabled = b()), I;
      }
    }), null), _(S, m(j, {
      get when() {
        return r() != "";
      },
      get children() {
        var I = f0(), M = I.firstChild, O = M.firstChild, N = O.firstChild;
        return R((T) => {
          var A = r(), z = "img-preview" + e.component.dataKey;
          return A !== T.e && J(N, "src", T.e = A), z !== T.t && J(N, "id", T.t = z), T;
        }, {
          e: void 0,
          t: void 0
        }), I;
      }
    }), w), _(E, m(j, {
      get when() {
        var I;
        return ((I = e.validationMessage) == null ? void 0 : I.length) > 0;
      },
      get children() {
        return m(fe, {
          get each() {
            return e.validationMessage;
          },
          children: (I) => (() => {
            var M = w0(), O = M.firstChild, N = O.firstChild;
            return _(O, m(we, {
              get children() {
                return [m(ee, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return m0();
                  }
                }), m(ee, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return b0();
                  }
                })];
              }
            }), N), N.innerHTML = I, R((T) => te(O, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, T)), M;
          })()
        });
      }
    })), R((I) => {
      var M = e.component.label, O = {
        " border-b border-orange-500 pb-3 ": e.classValidation === 1,
        " border-b border-pink-600 pb-3 ": e.classValidation === 2
      };
      return M !== I.e && (V.innerHTML = I.e = M), I.t = te(w, O, I.t), I;
    }, {
      e: void 0,
      t: void 0
    }), y;
  })();
};
ye(["click"]);
var y0 = /* @__PURE__ */ k("<span class=text-pink-600>*"), p0 = /* @__PURE__ */ k('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), k0 = /* @__PURE__ */ k('<div class="italic text-xs font-extralight text-zinc-400 ">'), $r = /* @__PURE__ */ k('<button class="bg-white text-gray-500 p-2 rounded-full focus:outline-none h-10 w-10 hover:bg-sky-200 hover:text-sky-400 hover:border-sky-200 border-2 border-gray-300 "><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7">'), _r = /* @__PURE__ */ k('<button class="bg-white text-gray-500 p-2 rounded-full focus:outline-none h-10 w-10 hover:bg-teal-200 hover:text-teal-400 hover:border-teal-200 border-2 border-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap=round stroke-linejoin=round d="M15 11a3 3 0 11-6 0 3 3 0 016 0z">'), $0 = /* @__PURE__ */ k('<span class="absolute top-0 right-0 inline-flex items-center justify-center h-6 w-6 text-xs font-semibold text-white transform translate-x-1/2 -translate-y-1/4 bg-pink-600/80 rounded-full">'), _0 = /* @__PURE__ */ k('<button class="relative inline-block bg-white p-2 h-10 w-10 text-gray-500 rounded-full hover:bg-yellow-100 hover:text-yellow-400 hover:border-yellow-100 border-2 border-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z">'), S0 = /* @__PURE__ */ k('<div class="font-light text-sm space-x-2 py-2.5 px-2 space-y-4"><div class=preview-class><div class="container mx-auto space-y-3"><iframe class="border-2 rounded-md mb-2"style=width:100%;height:100%;pointer-events:none></iframe><span class="bg-red-100 text-red-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-800"></span><span class="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">'), C0 = /* @__PURE__ */ k('<div><div class="border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="flex items-start gap-2"><div class="font-light text-sm space-y-2 py-2.5 px-2 flex-1"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 flex items-center gap-2 shrink-0"></div></div><div></div><div class=pb-4>'), M0 = /* @__PURE__ */ k('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), I0 = /* @__PURE__ */ k('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), E0 = /* @__PURE__ */ k('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="text-justify mr-1">');
const jl = (e) => {
  const [t] = Et(), [n, i] = K(""), [r, l] = K(""), [a, s] = K({
    latitude: null,
    longitude: null
  }), c = e.config, [o] = K(c.formMode > 1 ? !0 : e.component.disableInput);
  Me(() => {
    if (i(e.component.label), e.value[0]) {
      let y = e.value[0].value, S = `https://maps.google.com/maps?q=${y.latitude},${y.longitude}&output=embed`;
      l(S), s({
        latitude: y.latitude,
        longitude: y.longitude
      });
    }
  });
  let d = (y) => {
    let S = JSON.parse(JSON.stringify(e.value));
    S = [];
    let p;
    y.coordinat && (p = `https://maps.google.com/maps?q=${y.coordinat.latitude},${y.coordinat.longitude}&output=embed`, l(p)), Xe(t.details.language[0].locationAcquired), S.push({
      value: {
        latitude: y.coordinat.latitude,
        longitude: y.coordinat.longitude
      },
      label: p
    }), S.push({
      label: "map",
      value: p
    }), S.push({
      label: "latitude",
      value: y.coordinat.latitude
    }), S.push({
      label: "longitude",
      value: y.coordinat.longitude
    }), e.onValueChange(S);
  }, f = () => {
    e.MobileGpsHandler(d);
  }, x = () => {
    var y = {
      enableHighAccuracy: !0,
      timeout: 5e3,
      maximumAge: 0
    };
    function S(L) {
      if (L.coords, L.coords) {
        let V = JSON.parse(JSON.stringify(e.value));
        V = [];
        let v = `https://maps.google.com/maps?q=${L.coords.latitude},${L.coords.longitude}&output=embed`;
        l(v), V.push({
          value: {
            latitude: L.coords.latitude,
            longitude: L.coords.longitude
          },
          label: v
        }), V.push({
          label: "map",
          value: v
        }), V.push({
          label: "latitude",
          value: L.coords.latitude
        }), V.push({
          label: "longitude",
          value: L.coords.longitude
        }), Xe(t.details.language[0].locationAcquired), e.onValueChange(V);
      }
    }
    function p(L) {
    }
    navigator.geolocation.getCurrentPosition(S, p, y);
  };
  const [$, C] = K(!1), g = () => {
    $() ? C(!1) : C(!0);
  }, [u] = K(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [b] = K(c.formMode > 2 && e.comments == 0);
  return (() => {
    var y = C0(), S = y.firstChild, p = S.firstChild, L = p.firstChild, V = L.firstChild, v = V.firstChild, h = V.nextSibling, w = L.nextSibling, E = p.nextSibling, I = E.nextSibling;
    return _(V, m(j, {
      get when() {
        return e.component.required;
      },
      get children() {
        return y0();
      }
    }), null), _(V, m(j, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var M = p0();
        return M.$$click = g, M;
      }
    }), null), _(h, m(j, {
      get when() {
        return $();
      },
      get children() {
        var M = k0();
        return R(() => M.innerHTML = e.component.hint), M;
      }
    })), _(w, m(j, {
      get when() {
        return r() != "";
      },
      get children() {
        return m(we, {
          get children() {
            return [m(ee, {
              get when() {
                return c.clientMode === 2;
              },
              get children() {
                var M = $r();
                return M.$$click = (O) => e.MobileOpenMap(e.value[0].value), M;
              }
            }), m(ee, {
              get when() {
                return c.clientMode === 1;
              },
              get children() {
                var M = $r();
                return M.$$click = (O) => window.open("https://maps.google.com/maps?q=loc:" + a().latitude + "," + a().longitude, "_blank"), M;
              }
            })];
          }
        });
      }
    }), null), _(w, m(we, {
      get children() {
        return [m(ee, {
          get when() {
            return c.clientMode === 2;
          },
          get children() {
            var M = _r();
            return M.$$click = () => f(), R(() => M.disabled = o()), M;
          }
        }), m(ee, {
          get when() {
            return c.clientMode === 1;
          },
          get children() {
            var M = _r();
            return M.$$click = () => x(), R(() => M.disabled = o()), M;
          }
        })];
      }
    }), null), _(w, m(j, {
      get when() {
        return u();
      },
      get children() {
        var M = _0();
        return M.firstChild, M.$$click = (O) => e.openRemark(e.component.dataKey), _(M, m(j, {
          get when() {
            return ue(() => !!e.comments)() && e.comments > 0;
          },
          get children() {
            var O = $0();
            return _(O, () => e.comments), O;
          }
        }), null), R(() => M.disabled = b()), M;
      }
    }), null), _(S, m(j, {
      get when() {
        return r() != "";
      },
      get children() {
        var M = S0(), O = M.firstChild, N = O.firstChild, T = N.firstChild, A = T.nextSibling, z = A.nextSibling;
        return _(A, () => "lon : " + a().longitude), _(z, () => "lat : " + a().latitude), R(() => J(T, "src", r())), M;
      }
    }), E), _(I, m(j, {
      get when() {
        var M;
        return ((M = e.validationMessage) == null ? void 0 : M.length) > 0;
      },
      get children() {
        return m(fe, {
          get each() {
            return e.validationMessage;
          },
          children: (M) => (() => {
            var O = E0(), N = O.firstChild, T = N.firstChild;
            return _(N, m(we, {
              get children() {
                return [m(ee, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return M0();
                  }
                }), m(ee, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return I0();
                  }
                })];
              }
            }), T), T.innerHTML = M, R((A) => te(N, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, A)), O;
          })()
        });
      }
    })), R((M) => {
      var O = e.component.label, N = {
        " border-b border-orange-500 pb-3 ": e.classValidation === 1,
        " border-b border-pink-600 pb-3 ": e.classValidation === 2
      };
      return O !== M.e && (v.innerHTML = M.e = O), M.t = te(E, N, M.t), M;
    }, {
      e: void 0,
      t: void 0
    }), y;
  })();
};
ye(["click"]);
var ei = { exports: {} };
var O0 = ei.exports, Sr;
function L0() {
  return Sr || (Sr = 1, (function(e, t) {
    ((n, i) => {
      e.exports = i();
    })(O0, function n() {
      var i = typeof self != "undefined" ? self : typeof window != "undefined" ? window : i !== void 0 ? i : {}, r, l = !i.document && !!i.postMessage, a = i.IS_PAPA_WORKER || !1, s = {}, c = 0, o = {};
      function d(h) {
        this._handle = null, this._finished = !1, this._completed = !1, this._halted = !1, this._input = null, this._baseIndex = 0, this._partialLine = "", this._rowCount = 0, this._start = 0, this._nextChunk = null, this.isFirstChunk = !0, this._completeResults = { data: [], errors: [], meta: {} }, function(w) {
          var E = L(w);
          E.chunkSize = parseInt(E.chunkSize), w.step || w.chunk || (E.chunkSize = null), this._handle = new g(E), (this._handle.streamer = this)._config = E;
        }.call(this, h), this.parseChunk = function(w, E) {
          var I = parseInt(this._config.skipFirstNLines) || 0;
          if (this.isFirstChunk && 0 < I) {
            let O = this._config.newline;
            O || (M = this._config.quoteChar || '"', O = this._handle.guessLineEndings(w, M)), w = [...w.split(O).slice(I)].join(O);
          }
          this.isFirstChunk && v(this._config.beforeFirstChunk) && (M = this._config.beforeFirstChunk(w)) !== void 0 && (w = M), this.isFirstChunk = !1, this._halted = !1;
          var I = this._partialLine + w, M = (this._partialLine = "", this._handle.parse(I, this._baseIndex, !this._finished));
          if (!this._handle.paused() && !this._handle.aborted()) {
            if (w = M.meta.cursor, I = (this._finished || (this._partialLine = I.substring(w - this._baseIndex), this._baseIndex = w), M && M.data && (this._rowCount += M.data.length), this._finished || this._config.preview && this._rowCount >= this._config.preview), a) i.postMessage({ results: M, workerId: o.WORKER_ID, finished: I });
            else if (v(this._config.chunk) && !E) {
              if (this._config.chunk(M, this._handle), this._handle.paused() || this._handle.aborted()) return void (this._halted = !0);
              this._completeResults = M = void 0;
            }
            return this._config.step || this._config.chunk || (this._completeResults.data = this._completeResults.data.concat(M.data), this._completeResults.errors = this._completeResults.errors.concat(M.errors), this._completeResults.meta = M.meta), this._completed || !I || !v(this._config.complete) || M && M.meta.aborted || (this._config.complete(this._completeResults, this._input), this._completed = !0), I || M && M.meta.paused || this._nextChunk(), M;
          }
          this._halted = !0;
        }, this._sendError = function(w) {
          v(this._config.error) ? this._config.error(w) : a && this._config.error && i.postMessage({ workerId: o.WORKER_ID, error: w, finished: !1 });
        };
      }
      function f(h) {
        var w;
        (h = h || {}).chunkSize || (h.chunkSize = o.RemoteChunkSize), d.call(this, h), this._nextChunk = l ? function() {
          this._readChunk(), this._chunkLoaded();
        } : function() {
          this._readChunk();
        }, this.stream = function(E) {
          this._input = E, this._nextChunk();
        }, this._readChunk = function() {
          if (this._finished) this._chunkLoaded();
          else {
            if (w = new XMLHttpRequest(), this._config.withCredentials && (w.withCredentials = this._config.withCredentials), l || (w.onload = V(this._chunkLoaded, this), w.onerror = V(this._chunkError, this)), w.open(this._config.downloadRequestBody ? "POST" : "GET", this._input, !l), this._config.downloadRequestHeaders) {
              var E, I = this._config.downloadRequestHeaders;
              for (E in I) w.setRequestHeader(E, I[E]);
            }
            var M;
            this._config.chunkSize && (M = this._start + this._config.chunkSize - 1, w.setRequestHeader("Range", "bytes=" + this._start + "-" + M));
            try {
              w.send(this._config.downloadRequestBody);
            } catch (O) {
              this._chunkError(O.message);
            }
            l && w.status === 0 && this._chunkError();
          }
        }, this._chunkLoaded = function() {
          w.readyState === 4 && (w.status < 200 || 400 <= w.status ? this._chunkError() : (this._start += this._config.chunkSize || w.responseText.length, this._finished = !this._config.chunkSize || this._start >= ((E) => (E = E.getResponseHeader("Content-Range")) !== null ? parseInt(E.substring(E.lastIndexOf("/") + 1)) : -1)(w), this.parseChunk(w.responseText)));
        }, this._chunkError = function(E) {
          E = w.statusText || E, this._sendError(new Error(E));
        };
      }
      function x(h) {
        (h = h || {}).chunkSize || (h.chunkSize = o.LocalChunkSize), d.call(this, h);
        var w, E, I = typeof FileReader != "undefined";
        this.stream = function(M) {
          this._input = M, E = M.slice || M.webkitSlice || M.mozSlice, I ? ((w = new FileReader()).onload = V(this._chunkLoaded, this), w.onerror = V(this._chunkError, this)) : w = new FileReaderSync(), this._nextChunk();
        }, this._nextChunk = function() {
          this._finished || this._config.preview && !(this._rowCount < this._config.preview) || this._readChunk();
        }, this._readChunk = function() {
          var M = this._input, O = (this._config.chunkSize && (O = Math.min(this._start + this._config.chunkSize, this._input.size), M = E.call(M, this._start, O)), w.readAsText(M, this._config.encoding));
          I || this._chunkLoaded({ target: { result: O } });
        }, this._chunkLoaded = function(M) {
          this._start += this._config.chunkSize, this._finished = !this._config.chunkSize || this._start >= this._input.size, this.parseChunk(M.target.result);
        }, this._chunkError = function() {
          this._sendError(w.error);
        };
      }
      function $(h) {
        var w;
        d.call(this, h = h || {}), this.stream = function(E) {
          return w = E, this._nextChunk();
        }, this._nextChunk = function() {
          var E, I;
          if (!this._finished) return E = this._config.chunkSize, w = E ? (I = w.substring(0, E), w.substring(E)) : (I = w, ""), this._finished = !w, this.parseChunk(I);
        };
      }
      function C(h) {
        d.call(this, h = h || {});
        var w = [], E = !0, I = !1;
        this.pause = function() {
          d.prototype.pause.apply(this, arguments), this._input.pause();
        }, this.resume = function() {
          d.prototype.resume.apply(this, arguments), this._input.resume();
        }, this.stream = function(M) {
          this._input = M, this._input.on("data", this._streamData), this._input.on("end", this._streamEnd), this._input.on("error", this._streamError);
        }, this._checkIsFinished = function() {
          I && w.length === 1 && (this._finished = !0);
        }, this._nextChunk = function() {
          this._checkIsFinished(), w.length ? this.parseChunk(w.shift()) : E = !0;
        }, this._streamData = V(function(M) {
          try {
            w.push(typeof M == "string" ? M : M.toString(this._config.encoding)), E && (E = !1, this._checkIsFinished(), this.parseChunk(w.shift()));
          } catch (O) {
            this._streamError(O);
          }
        }, this), this._streamError = V(function(M) {
          this._streamCleanUp(), this._sendError(M);
        }, this), this._streamEnd = V(function() {
          this._streamCleanUp(), I = !0, this._streamData("");
        }, this), this._streamCleanUp = V(function() {
          this._input.removeListener("data", this._streamData), this._input.removeListener("end", this._streamEnd), this._input.removeListener("error", this._streamError);
        }, this);
      }
      function g(h) {
        var w, E, I, M, O = Math.pow(2, 53), N = -O, T = /^\s*-?(\d+\.?|\.\d+|\d+\.\d+)([eE][-+]?\d+)?\s*$/, A = /^((\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)))$/, z = this, D = 0, P = 0, B = !1, F = !1, U = [], H = { data: [], errors: [], meta: {} };
        function ne(W) {
          return h.skipEmptyLines === "greedy" ? W.join("").trim() === "" : W.length === 1 && W[0].length === 0;
        }
        function X() {
          if (H && I && (se("Delimiter", "UndetectableDelimiter", "Unable to auto-detect delimiting character; defaulted to '" + o.DefaultDelimiter + "'"), I = !1), h.skipEmptyLines && (H.data = H.data.filter(function(G) {
            return !ne(G);
          })), oe()) {
            let G = function(le, _e) {
              v(h.transformHeader) && (le = h.transformHeader(le, _e)), U.push(le);
            };
            if (H) if (Array.isArray(H.data[0])) {
              for (var W = 0; oe() && W < H.data.length; W++) H.data[W].forEach(G);
              H.data.splice(0, 1);
            } else H.data.forEach(G);
          }
          function Y(G, le) {
            for (var _e = h.header ? {} : [], me = 0; me < G.length; me++) {
              var Se = me, ve = G[me], ve = ((Ke, he) => ((Ce) => (h.dynamicTypingFunction && h.dynamicTyping[Ce] === void 0 && (h.dynamicTyping[Ce] = h.dynamicTypingFunction(Ce)), (h.dynamicTyping[Ce] || h.dynamicTyping) === !0))(Ke) ? he === "true" || he === "TRUE" || he !== "false" && he !== "FALSE" && (((Ce) => {
                if (T.test(Ce) && (Ce = parseFloat(Ce), N < Ce && Ce < O))
                  return 1;
              })(he) ? parseFloat(he) : A.test(he) ? new Date(he) : he === "" ? null : he) : he)(Se = h.header ? me >= U.length ? "__parsed_extra" : U[me] : Se, ve = h.transform ? h.transform(ve, Se) : ve);
              Se === "__parsed_extra" ? (_e[Se] = _e[Se] || [], _e[Se].push(ve)) : _e[Se] = ve;
            }
            return h.header && (me > U.length ? se("FieldMismatch", "TooManyFields", "Too many fields: expected " + U.length + " fields but parsed " + me, P + le) : me < U.length && se("FieldMismatch", "TooFewFields", "Too few fields: expected " + U.length + " fields but parsed " + me, P + le)), _e;
          }
          var Q;
          H && (h.header || h.dynamicTyping || h.transform) && (Q = 1, !H.data.length || Array.isArray(H.data[0]) ? (H.data = H.data.map(Y), Q = H.data.length) : H.data = Y(H.data, 0), h.header && H.meta && (H.meta.fields = U), P += Q);
        }
        function oe() {
          return h.header && U.length === 0;
        }
        function se(W, Y, Q, G) {
          W = { type: W, code: Y, message: Q }, G !== void 0 && (W.row = G), H.errors.push(W);
        }
        v(h.step) && (M = h.step, h.step = function(W) {
          H = W, oe() ? X() : (X(), H.data.length !== 0 && (D += W.data.length, h.preview && D > h.preview ? E.abort() : (H.data = H.data[0], M(H, z))));
        }), this.parse = function(W, Y, Q) {
          var G = h.quoteChar || '"', G = (h.newline || (h.newline = this.guessLineEndings(W, G)), I = !1, h.delimiter ? v(h.delimiter) && (h.delimiter = h.delimiter(W), H.meta.delimiter = h.delimiter) : ((G = ((le, _e, me, Se, ve) => {
            var Ke, he, Ce, it;
            ve = ve || [",", "	", "|", ";", o.RECORD_SEP, o.UNIT_SEP];
            for (var kt = 0; kt < ve.length; kt++) {
              for (var Ge, rn = ve[kt], Ye = 0, $t = 0, Be = 0, rt = (Ce = void 0, new b({ comments: Se, delimiter: rn, newline: _e, preview: 10 }).parse(le)), Lt = 0; Lt < rt.data.length; Lt++) me && ne(rt.data[Lt]) ? Be++ : (Ge = rt.data[Lt].length, $t += Ge, Ce === void 0 ? Ce = Ge : 0 < Ge && (Ye += Math.abs(Ge - Ce), Ce = Ge));
              0 < rt.data.length && ($t /= rt.data.length - Be), (he === void 0 || Ye <= he) && (it === void 0 || it < $t) && 1.99 < $t && (he = Ye, Ke = rn, it = $t);
            }
            return { successful: !!(h.delimiter = Ke), bestDelimiter: Ke };
          })(W, h.newline, h.skipEmptyLines, h.comments, h.delimitersToGuess)).successful ? h.delimiter = G.bestDelimiter : (I = !0, h.delimiter = o.DefaultDelimiter), H.meta.delimiter = h.delimiter), L(h));
          return h.preview && h.header && G.preview++, w = W, E = new b(G), H = E.parse(w, Y, Q), X(), B ? { meta: { paused: !0 } } : H || { meta: { paused: !1 } };
        }, this.paused = function() {
          return B;
        }, this.pause = function() {
          B = !0, E.abort(), w = v(h.chunk) ? "" : w.substring(E.getCharIndex());
        }, this.resume = function() {
          z.streamer._halted ? (B = !1, z.streamer.parseChunk(w, !0)) : setTimeout(z.resume, 3);
        }, this.aborted = function() {
          return F;
        }, this.abort = function() {
          F = !0, E.abort(), H.meta.aborted = !0, v(h.complete) && h.complete(H), w = "";
        }, this.guessLineEndings = function(le, G) {
          le = le.substring(0, 1048576);
          var G = new RegExp(u(G) + "([^]*?)" + u(G), "gm"), Q = (le = le.replace(G, "")).split("\r"), G = le.split(`
`), le = 1 < G.length && G[0].length < Q[0].length;
          if (Q.length === 1 || le) return `
`;
          for (var _e = 0, me = 0; me < Q.length; me++) Q[me][0] === `
` && _e++;
          return _e >= Q.length / 2 ? `\r
` : "\r";
        };
      }
      function u(h) {
        return h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
      function b(h) {
        var w = (h = h || {}).delimiter, E = h.newline, I = h.comments, M = h.step, O = h.preview, N = h.fastMode, T = null, A = !1, z = h.quoteChar == null ? '"' : h.quoteChar, D = z;
        if (h.escapeChar !== void 0 && (D = h.escapeChar), (typeof w != "string" || -1 < o.BAD_DELIMITERS.indexOf(w)) && (w = ","), I === w) throw new Error("Comment character same as delimiter");
        I === !0 ? I = "#" : (typeof I != "string" || -1 < o.BAD_DELIMITERS.indexOf(I)) && (I = !1), E !== `
` && E !== "\r" && E !== `\r
` && (E = `
`);
        var P = 0, B = !1;
        this.parse = function(F, U, H) {
          if (typeof F != "string") throw new Error("Input must be a string");
          var ne = F.length, X = w.length, oe = E.length, se = I.length, W = v(M), Y = [], Q = [], G = [], le = P = 0;
          if (!F) return Ye();
          if (N || N !== !1 && F.indexOf(z) === -1) {
            for (var _e = F.split(E), me = 0; me < _e.length; me++) {
              if (G = _e[me], P += G.length, me !== _e.length - 1) P += E.length;
              else if (H) return Ye();
              if (!I || G.substring(0, se) !== I) {
                if (W) {
                  if (Y = [], it(G.split(w)), $t(), B) return Ye();
                } else it(G.split(w));
                if (O && O <= me) return Y = Y.slice(0, O), Ye(!0);
              }
            }
            return Ye();
          }
          for (var Se = F.indexOf(w, P), ve = F.indexOf(E, P), Ke = new RegExp(u(D) + u(z), "g"), he = F.indexOf(z, P); ; ) if (F[P] === z) for (he = P, P++; ; ) {
            if ((he = F.indexOf(z, he + 1)) === -1) return H || Q.push({ type: "Quotes", code: "MissingQuotes", message: "Quoted field unterminated", row: Y.length, index: P }), Ge();
            if (he === ne - 1) return Ge(F.substring(P, he).replace(Ke, z));
            if (z === D && F[he + 1] === D) he++;
            else if (z === D || he === 0 || F[he - 1] !== D) {
              Se !== -1 && Se < he + 1 && (Se = F.indexOf(w, he + 1));
              var Ce = kt((ve = ve !== -1 && ve < he + 1 ? F.indexOf(E, he + 1) : ve) === -1 ? Se : Math.min(Se, ve));
              if (F.substr(he + 1 + Ce, X) === w) {
                G.push(F.substring(P, he).replace(Ke, z)), F[P = he + 1 + Ce + X] !== z && (he = F.indexOf(z, P)), Se = F.indexOf(w, P), ve = F.indexOf(E, P);
                break;
              }
              if (Ce = kt(ve), F.substring(he + 1 + Ce, he + 1 + Ce + oe) === E) {
                if (G.push(F.substring(P, he).replace(Ke, z)), rn(he + 1 + Ce + oe), Se = F.indexOf(w, P), he = F.indexOf(z, P), W && ($t(), B)) return Ye();
                if (O && Y.length >= O) return Ye(!0);
                break;
              }
              Q.push({ type: "Quotes", code: "InvalidQuotes", message: "Trailing quote on quoted field is malformed", row: Y.length, index: P }), he++;
            }
          }
          else if (I && G.length === 0 && F.substring(P, P + se) === I) {
            if (ve === -1) return Ye();
            P = ve + oe, ve = F.indexOf(E, P), Se = F.indexOf(w, P);
          } else if (Se !== -1 && (Se < ve || ve === -1)) G.push(F.substring(P, Se)), P = Se + X, Se = F.indexOf(w, P);
          else {
            if (ve === -1) break;
            if (G.push(F.substring(P, ve)), rn(ve + oe), W && ($t(), B)) return Ye();
            if (O && Y.length >= O) return Ye(!0);
          }
          return Ge();
          function it(Be) {
            Y.push(Be), le = P;
          }
          function kt(Be) {
            var rt = 0;
            return rt = Be !== -1 && (Be = F.substring(he + 1, Be)) && Be.trim() === "" ? Be.length : rt;
          }
          function Ge(Be) {
            return H || (Be === void 0 && (Be = F.substring(P)), G.push(Be), P = ne, it(G), W && $t()), Ye();
          }
          function rn(Be) {
            P = Be, it(G), G = [], ve = F.indexOf(E, P);
          }
          function Ye(Be) {
            if (h.header && !U && Y.length && !A) {
              var rt = Y[0], Lt = /* @__PURE__ */ Object.create(null), Ln = new Set(rt);
              let zt = !1;
              for (let tn = 0; tn < rt.length; tn++) {
                let _t = rt[tn];
                if (Lt[_t = v(h.transformHeader) ? h.transformHeader(_t, tn) : _t]) {
                  let ln, Ft = Lt[_t];
                  for (; ln = _t + "_" + Ft, Ft++, Ln.has(ln); ) ;
                  Ln.add(ln), rt[tn] = ln, Lt[_t]++, zt = !0, (T = T === null ? {} : T)[ln] = _t;
                } else Lt[_t] = 1, rt[tn] = _t;
                Ln.add(_t);
              }
              zt && console.warn("Duplicate headers found and renamed."), A = !0;
            }
            return { data: Y, errors: Q, meta: { delimiter: w, linebreak: E, aborted: B, truncated: !!Be, cursor: le + (U || 0), renamedHeaders: T } };
          }
          function $t() {
            M(Ye()), Y = [], Q = [];
          }
        }, this.abort = function() {
          B = !0;
        }, this.getCharIndex = function() {
          return P;
        };
      }
      function y(h) {
        var w = h.data, E = s[w.workerId], I = !1;
        if (w.error) E.userError(w.error, w.file);
        else if (w.results && w.results.data) {
          var M = { abort: function() {
            I = !0, S(w.workerId, { data: [], errors: [], meta: { aborted: !0 } });
          }, pause: p, resume: p };
          if (v(E.userStep)) {
            for (var O = 0; O < w.results.data.length && (E.userStep({ data: w.results.data[O], errors: w.results.errors, meta: w.results.meta }, M), !I); O++) ;
            delete w.results;
          } else v(E.userChunk) && (E.userChunk(w.results, M, w.file), delete w.results);
        }
        w.finished && !I && S(w.workerId, w.results);
      }
      function S(h, w) {
        var E = s[h];
        v(E.userComplete) && E.userComplete(w), E.terminate(), delete s[h];
      }
      function p() {
        throw new Error("Not implemented.");
      }
      function L(h) {
        if (typeof h != "object" || h === null) return h;
        var w, E = Array.isArray(h) ? [] : {};
        for (w in h) E[w] = L(h[w]);
        return E;
      }
      function V(h, w) {
        return function() {
          h.apply(w, arguments);
        };
      }
      function v(h) {
        return typeof h == "function";
      }
      return o.parse = function(h, w) {
        var E = (w = w || {}).dynamicTyping || !1;
        if (v(E) && (w.dynamicTypingFunction = E, E = {}), w.dynamicTyping = E, w.transform = !!v(w.transform) && w.transform, !w.worker || !o.WORKERS_SUPPORTED) return E = null, o.NODE_STREAM_INPUT, typeof h == "string" ? (h = ((I) => I.charCodeAt(0) !== 65279 ? I : I.slice(1))(h), E = new (w.download ? f : $)(w)) : h.readable === !0 && v(h.read) && v(h.on) ? E = new C(w) : (i.File && h instanceof File || h instanceof Object) && (E = new x(w)), E.stream(h);
        (E = (() => {
          var I;
          return !!o.WORKERS_SUPPORTED && (I = (() => {
            var M = i.URL || i.webkitURL || null, O = n.toString();
            return o.BLOB_URL || (o.BLOB_URL = M.createObjectURL(new Blob(["var global = (function() { if (typeof self !== 'undefined') { return self; } if (typeof window !== 'undefined') { return window; } if (typeof global !== 'undefined') { return global; } return {}; })(); global.IS_PAPA_WORKER=true; ", "(", O, ")();"], { type: "text/javascript" })));
          })(), (I = new i.Worker(I)).onmessage = y, I.id = c++, s[I.id] = I);
        })()).userStep = w.step, E.userChunk = w.chunk, E.userComplete = w.complete, E.userError = w.error, w.step = v(w.step), w.chunk = v(w.chunk), w.complete = v(w.complete), w.error = v(w.error), delete w.worker, E.postMessage({ input: h, config: w, workerId: E.id });
      }, o.unparse = function(h, w) {
        var E = !1, I = !0, M = ",", O = `\r
`, N = '"', T = N + N, A = !1, z = null, D = !1, P = ((() => {
          if (typeof w == "object") {
            if (typeof w.delimiter != "string" || o.BAD_DELIMITERS.filter(function(U) {
              return w.delimiter.indexOf(U) !== -1;
            }).length || (M = w.delimiter), typeof w.quotes != "boolean" && typeof w.quotes != "function" && !Array.isArray(w.quotes) || (E = w.quotes), typeof w.skipEmptyLines != "boolean" && typeof w.skipEmptyLines != "string" || (A = w.skipEmptyLines), typeof w.newline == "string" && (O = w.newline), typeof w.quoteChar == "string" && (N = w.quoteChar), typeof w.header == "boolean" && (I = w.header), Array.isArray(w.columns)) {
              if (w.columns.length === 0) throw new Error("Option columns is empty");
              z = w.columns;
            }
            w.escapeChar !== void 0 && (T = w.escapeChar + N), w.escapeFormulae instanceof RegExp ? D = w.escapeFormulae : typeof w.escapeFormulae == "boolean" && w.escapeFormulae && (D = /^[=+\-@\t\r].*$/);
          }
        })(), new RegExp(u(N), "g"));
        if (typeof h == "string" && (h = JSON.parse(h)), Array.isArray(h)) {
          if (!h.length || Array.isArray(h[0])) return B(null, h, A);
          if (typeof h[0] == "object") return B(z || Object.keys(h[0]), h, A);
        } else if (typeof h == "object") return typeof h.data == "string" && (h.data = JSON.parse(h.data)), Array.isArray(h.data) && (h.fields || (h.fields = h.meta && h.meta.fields || z), h.fields || (h.fields = Array.isArray(h.data[0]) ? h.fields : typeof h.data[0] == "object" ? Object.keys(h.data[0]) : []), Array.isArray(h.data[0]) || typeof h.data[0] == "object" || (h.data = [h.data])), B(h.fields || [], h.data || [], A);
        throw new Error("Unable to serialize unrecognized input");
        function B(U, H, ne) {
          var X = "", oe = (typeof U == "string" && (U = JSON.parse(U)), typeof H == "string" && (H = JSON.parse(H)), Array.isArray(U) && 0 < U.length), se = !Array.isArray(H[0]);
          if (oe && I) {
            for (var W = 0; W < U.length; W++) 0 < W && (X += M), X += F(U[W], W);
            0 < H.length && (X += O);
          }
          for (var Y = 0; Y < H.length; Y++) {
            var Q = (oe ? U : H[Y]).length, G = !1, le = oe ? Object.keys(H[Y]).length === 0 : H[Y].length === 0;
            if (ne && !oe && (G = ne === "greedy" ? H[Y].join("").trim() === "" : H[Y].length === 1 && H[Y][0].length === 0), ne === "greedy" && oe) {
              for (var _e = [], me = 0; me < Q; me++) {
                var Se = se ? U[me] : me;
                _e.push(H[Y][Se]);
              }
              G = _e.join("").trim() === "";
            }
            if (!G) {
              for (var ve = 0; ve < Q; ve++) {
                0 < ve && !le && (X += M);
                var Ke = oe && se ? U[ve] : ve;
                X += F(H[Y][Ke], ve);
              }
              Y < H.length - 1 && (!ne || 0 < Q && !le) && (X += O);
            }
          }
          return X;
        }
        function F(U, H) {
          var ne, X;
          return U == null ? "" : U.constructor === Date ? JSON.stringify(U).slice(1, 25) : (X = !1, D && typeof U == "string" && D.test(U) && (U = "'" + U, X = !0), ne = U.toString().replace(P, T), (X = X || E === !0 || typeof E == "function" && E(U, H) || Array.isArray(E) && E[H] || ((oe, se) => {
            for (var W = 0; W < se.length; W++) if (-1 < oe.indexOf(se[W])) return !0;
            return !1;
          })(ne, o.BAD_DELIMITERS) || -1 < ne.indexOf(M) || ne.charAt(0) === " " || ne.charAt(ne.length - 1) === " ") ? N + ne + N : ne);
        }
      }, o.RECORD_SEP = "", o.UNIT_SEP = "", o.BYTE_ORDER_MARK = "\uFEFF", o.BAD_DELIMITERS = ["\r", `
`, '"', o.BYTE_ORDER_MARK], o.WORKERS_SUPPORTED = !l && !!i.Worker, o.NODE_STREAM_INPUT = 1, o.LocalChunkSize = 10485760, o.RemoteChunkSize = 5242880, o.DefaultDelimiter = ",", o.Parser = b, o.ParserHandle = g, o.NetworkStreamer = f, o.FileStreamer = x, o.StringStreamer = $, o.ReadableStreamStreamer = C, i.jQuery && ((r = i.jQuery).fn.parse = function(h) {
        var w = h.config || {}, E = [];
        return this.each(function(O) {
          if (!(r(this).prop("tagName").toUpperCase() === "INPUT" && r(this).attr("type").toLowerCase() === "file" && i.FileReader) || !this.files || this.files.length === 0) return !0;
          for (var N = 0; N < this.files.length; N++) E.push({ file: this.files[N], inputElem: this, instanceConfig: r.extend({}, w) });
        }), I(), this;
        function I() {
          if (E.length === 0) v(h.complete) && h.complete();
          else {
            var O, N, T, A, z = E[0];
            if (v(h.before)) {
              var D = h.before(z.file, z.inputElem);
              if (typeof D == "object") {
                if (D.action === "abort") return O = "AbortError", N = z.file, T = z.inputElem, A = D.reason, void (v(h.error) && h.error({ name: O }, N, T, A));
                if (D.action === "skip") return void M();
                typeof D.config == "object" && (z.instanceConfig = r.extend(z.instanceConfig, D.config));
              } else if (D === "skip") return void M();
            }
            var P = z.instanceConfig.complete;
            z.instanceConfig.complete = function(B) {
              v(P) && P(B, z.file, z.inputElem), M();
            }, o.parse(z.file, z.instanceConfig);
          }
        }
        function M() {
          E.splice(0, 1), I();
        }
      }), a && (i.onmessage = function(h) {
        h = h.data, o.WORKER_ID === void 0 && h && (o.WORKER_ID = h.workerId), typeof h.input == "string" ? i.postMessage({ workerId: o.WORKER_ID, results: o.parse(h.input, h.config), finished: !0 }) : (i.File && h.input instanceof File || h.input instanceof Object) && (h = o.parse(h.input, h.config)) && i.postMessage({ workerId: o.WORKER_ID, results: h, finished: !0 });
      }), (f.prototype = Object.create(d.prototype)).constructor = f, (x.prototype = Object.create(d.prototype)).constructor = x, ($.prototype = Object.create($.prototype)).constructor = $, (C.prototype = Object.create(d.prototype)).constructor = C, o;
    });
  })(ei)), ei.exports;
}
var A0 = L0();
const Cr = /* @__PURE__ */ En(A0);
var R0 = /* @__PURE__ */ k('<div class="backdrop-blur-sm overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex"><svg class="w-20 h-20 animate-spin"xmlns=http://www.w3.org/2000/svg viewBox="0 0 94.53 98.372"><circle cx=23.536 cy=16.331 r=8.646 style=fill:#0a77e8></circle><circle cx=8.646 cy=36.698 r=8.646 style=fill:#0f9af0></circle><circle cx=8.646 cy=61.867 r=8.646 style=fill:#0f9af0></circle><circle cx=23.536 cy=82.233 r=8.646 style=fill:#13bdf7></circle><circle cx=47.361 cy=89.726 r=8.646 style=fill:#13bdf7></circle><circle cx=71.282 cy=82.233 r=8.646 style=fill:#18e0ff></circle><circle cx=85.884 cy=61.867 r=8.646 style=fill:#65eaff></circle><circle cx=85.884 cy=36.698 r=8.646 style=fill:#b2f5ff></circle><circle cx=47.361 cy=8.646 r=8.646 style=fill:#1d4970>'), N0 = /* @__PURE__ */ k("<span class=text-pink-600>*"), V0 = /* @__PURE__ */ k('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), T0 = /* @__PURE__ */ k('<div class="italic text-xs font-extralight text-zinc-400 ">'), j0 = /* @__PURE__ */ k('<button class="bg-white text-gray-500 p-2 rounded-full focus:outline-none h-10 w-10 hover:bg-teal-200 hover:text-teal-400 hover:border-teal-200 border-2 border-gray-300 "><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4">'), D0 = /* @__PURE__ */ k('<span class="absolute top-0 right-0 inline-flex items-center justify-center h-6 w-6 text-xs font-semibold text-white transform translate-x-1/2 -translate-y-1/4 bg-pink-600/80 rounded-full">'), P0 = /* @__PURE__ */ k('<button class="relative inline-block bg-white p-2 h-10 w-10 text-gray-500 rounded-full hover:bg-yellow-100 hover:text-yellow-400 hover:border-yellow-100 border-2 border-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z">'), K0 = /* @__PURE__ */ k('<div class="font-light text-sm space-x-2 py-2.5 px-2 col-span-12 space-y-4"><div class=preview-class><div class="container mx-auto"><div class="scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-50 dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-500 overflow-x-scroll scrollbar-thumb-rounded-full scrollbar-track-rounded-full"><table class="table-auto w-full"><thead class="text-xs font-semibold uppercase text-gray-400 bg-gray-50"><tr></tr></thead><tbody class="text-sm divide-y divide-gray-100"></tbody></table></div><br><span class="bg-red-100 text-red-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-800"></span><span class="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">'), B0 = /* @__PURE__ */ k('<div><div class="grid grid-cols-12 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2 col-span-11"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm space-x-2 py-2.5 px-2 space-y-4 flex justify-end -mt-2"><input type=file accept=.csv class="hidden w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"style=color:transparent><button class="bg-white text-gray-500 p-2 mr-2 rounded-full focus:outline-none h-10 w-10 hover:bg-fuchsia-200 hover:text-fuchsia-400 hover:border-fuchsia-200 border-2 border-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg></button></div><div class=col-span-12></div><div class="col-span-12 pb-4">'), z0 = /* @__PURE__ */ k('<th class="p-2 whitespace-nowrap"><div class="font-semibold text-left">'), F0 = /* @__PURE__ */ k("<tr>"), H0 = /* @__PURE__ */ k('<td class="p-2 whitespace-nowrap"><div class=text-left>'), J0 = /* @__PURE__ */ k('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), U0 = /* @__PURE__ */ k('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), W0 = /* @__PURE__ */ k('<div class="text-xs font-light mt-1"><div class="grid grid-cols-12"><div class="col-span-11 text-justify mr-1">');
const Dl = (e) => {
  const [t] = Et(), [n, i] = K([]), [r, l] = K([]), [a, s] = K(""), [c, o] = K(!1), [d, f] = K("");
  let x = new FileReader();
  const $ = e.config, [C] = K($.formMode > 1 ? !0 : e.component.disableInput);
  Me(() => {
    e.value && (i(Object.keys(e.value[0])), l([Object.values(e.value[0]), Object.values(e.value[1]), Object.values(e.value[2]), Object.values(e.value[3]), Object.values(e.value[4])]));
  });
  let g = (v) => {
    if (o(!0), JSON.parse(JSON.stringify(e.value)), v.target.files && v.target.files[0]) {
      var h = ["csv", "txt"];
      let w = v.target.files[0], E = w.name.split(".").pop().toLowerCase();
      if (!h.includes(E))
        ke(t.details.language[0].fileInvalidFormat);
      else {
        let I = (w.size / 1048576).toFixed(2), M = !0, O = !0;
        e.component.sizeInput && (M = e.component.sizeInput[0].min !== void 0 ? Number(I) > Number(e.component.sizeInput[0].min) : !0, O = e.component.sizeInput[0].max !== void 0 ? Number(I) < Number(e.component.sizeInput[0].max) : !0, !O && ke(t.details.language[0].fileInvalidMaxSize + e.component.sizeInput[0].max), !M && ke(t.details.language[0].fileInvalidMinSize + e.component.sizeInput[0].min), o(!1)), M && O && (x.readAsDataURL(w), x.onload = (N) => {
          Cr.parse(w, {
            download: !0,
            delimiter: "",
            // auto-detect
            complete: function(T) {
              let A = T.data[0], z = [T.data[1], T.data[2], T.data[3], T.data[4], T.data[5]], D = T.data.slice(1).map((P) => {
                var B = {};
                return A.forEach((F, U) => {
                  B[F] = P[U];
                }), B;
              });
              i(A), l(z), o(!1), e.onValueChange(D), Xe(t.details.language[0].fileUploaded);
            }
          });
        });
      }
    }
  };
  const u = ({
    data: v,
    fileName: h,
    fileType: w
  }) => {
    const E = new Blob([v], {
      type: w
    }), I = document.createElement("a");
    I.download = h, I.href = window.URL.createObjectURL(E);
    const M = new MouseEvent("click", {
      view: window,
      bubbles: !0,
      cancelable: !0
    });
    I.dispatchEvent(M), I.remove();
  }, b = (v) => {
    v.preventDefault(), u({
      data: Cr.unparse(e.value, {
        quotes: !1,
        //or array of booleans
        quoteChar: '"',
        escapeChar: '"',
        delimiter: "|",
        header: !0,
        newline: `\r
`,
        skipEmptyLines: !1,
        //other option is 'greedy', meaning skip delimiters, quotes, and whitespace.
        columns: null
        //or array of strings
      }),
      fileName: e.component.dataKey + ".csv",
      fileType: "text/csv"
    });
  }, [y, S] = K(!1), p = () => {
    y() ? S(!1) : S(!0);
  }, [L] = K(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [V] = K($.formMode > 2 && e.comments == 0);
  return (() => {
    var v = B0(), h = v.firstChild, w = h.firstChild, E = w.firstChild, I = E.firstChild, M = E.nextSibling, O = w.nextSibling, N = O.firstChild, T = N.nextSibling, A = O.nextSibling, z = A.nextSibling;
    return _(v, m(j, {
      get when() {
        return c();
      },
      get children() {
        return R0();
      }
    }), h), _(E, m(j, {
      get when() {
        return e.component.required;
      },
      get children() {
        return N0();
      }
    }), null), _(E, m(j, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var D = V0();
        return D.$$click = p, D;
      }
    }), null), _(M, m(j, {
      get when() {
        return y();
      },
      get children() {
        var D = T0();
        return R(() => D.innerHTML = e.component.hint), D;
      }
    })), N.addEventListener("change", (D) => {
      g(D);
    }), _(O, m(j, {
      get when() {
        return e.value;
      },
      get children() {
        var D = j0();
        return D.$$click = (P) => b(P), D;
      }
    }), T), T.$$click = (D) => {
      document.getElementById("inputFile_" + e.component.dataKey).click();
    }, _(O, m(j, {
      get when() {
        return L();
      },
      get children() {
        var D = P0();
        return D.firstChild, D.$$click = (P) => e.openRemark(e.component.dataKey), _(D, m(j, {
          get when() {
            return ue(() => !!e.comments)() && e.comments > 0;
          },
          get children() {
            var P = D0();
            return _(P, () => e.comments), P;
          }
        }), null), R(() => D.disabled = V()), D;
      }
    }), null), _(h, m(j, {
      get when() {
        return e.value;
      },
      get children() {
        var D = K0(), P = D.firstChild, B = P.firstChild, F = B.firstChild, U = F.firstChild, H = U.firstChild, ne = H.firstChild, X = H.nextSibling, oe = F.nextSibling, se = oe.nextSibling, W = se.nextSibling;
        return _(ne, m(fe, {
          get each() {
            return n();
          },
          children: (Y, Q) => (() => {
            var G = z0(), le = G.firstChild;
            return _(le, Y), G;
          })()
        })), _(X, m(fe, {
          get each() {
            return r();
          },
          children: (Y, Q) => (() => {
            var G = F0();
            return _(G, m(fe, {
              each: Y,
              children: (le, _e) => (() => {
                var me = H0(), Se = me.firstChild;
                return _(Se, le), me;
              })()
            })), G;
          })()
        })), _(se, () => "rows : " + Number(e.value.length + 1)), _(W, () => "cols : " + n().length), D;
      }
    }), A), _(z, m(j, {
      get when() {
        var D;
        return ((D = e.validationMessage) == null ? void 0 : D.length) > 0;
      },
      get children() {
        return m(fe, {
          get each() {
            return e.validationMessage;
          },
          children: (D) => (() => {
            var P = W0(), B = P.firstChild, F = B.firstChild;
            return _(B, m(we, {
              get children() {
                return [m(ee, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return J0();
                  }
                }), m(ee, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return U0();
                  }
                })];
              }
            }), F), F.innerHTML = D, R((U) => te(B, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, U)), P;
          })()
        });
      }
    })), R((D) => {
      var P = e.component.label, B = "inputFile_" + e.component.dataKey, F = e.component.dataKey, U = C(), H = t.details.language[0].uploadCsv, ne = {
        " border-b border-orange-500 pb-3 ": e.classValidation === 1,
        " border-b border-pink-600 pb-3 ": e.classValidation === 2
      };
      return P !== D.e && (I.innerHTML = D.e = P), B !== D.t && J(N, "id", D.t = B), F !== D.a && J(N, "name", D.a = F), U !== D.o && (T.disabled = D.o = U), H !== D.i && J(T, "title", D.i = H), D.n = te(A, ne, D.n), D;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0,
      n: void 0
    }), v;
  })();
};
ye(["click"]);
var q0 = /* @__PURE__ */ k('<div class="modal-confirmation fixed z-10 inset-0 overflow-y-auto"aria-labelledby=modal-title role=dialog aria-modal=true><div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"><div class="fixed inset-0 bg-gray-500/75 transition-opacity"aria-hidden=true></div><span class="hidden sm:inline-block sm:align-middle sm:h-screen"aria-hidden=true>&#8203;</span><div class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"><div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4"><div class="sm:flex sm:items-start"><div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"><svg xmlns=http://www.w3.org/2000/svg class="h-6 w-6 text-red-600"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div><div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left"><h3 class="text-lg leading-6 font-medium text-gray-900"id=titleModalConfirmation>Confirmation</h3><div class=mt-2><p class="text-sm text-gray-500"id=contentModalConfirmation>Are you sure you want to get present time?</p></div></div></div></div><div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"><button type=button class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">Get Time</button><button type=button class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Cancel'), G0 = /* @__PURE__ */ k("<span class=text-pink-600>*"), Y0 = /* @__PURE__ */ k('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Q0 = /* @__PURE__ */ k('<div class="italic text-xs font-extralight text-zinc-400 ">'), Z0 = /* @__PURE__ */ k('<span class="absolute top-0 right-0 inline-flex items-center justify-center h-6 w-6 text-xs font-semibold text-white transform translate-x-1/2 -translate-y-1/4 bg-pink-600/80 rounded-full">'), X0 = /* @__PURE__ */ k('<button class="relative inline-block bg-white p-2 h-10 w-10 text-gray-500 rounded-full hover:bg-yellow-100 hover:text-yellow-400 hover:border-yellow-100 border-2 border-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z">'), eh = /* @__PURE__ */ k('<div class="font-light text-sm space-x-2 py-2.5 px-2 col-span-12 space-y-4 -mt-2"><span class="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">'), th = /* @__PURE__ */ k('<div><div class="grid grid-cols-12 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2 col-span-11"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm space-x-2 py-2.5 px-2 space-y-4 flex justify-end items-end -mt-2"><button class="bg-white text-gray-500 p-2 rounded-full focus:outline-none h-10 w-10 hover:bg-teal-200 hover:text-teal-400 hover:border-teal-200 border-2 border-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></button></div><div class=col-span-12></div><div class="col-span-12 pb-4">'), nh = /* @__PURE__ */ k('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), ih = /* @__PURE__ */ k('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), rh = /* @__PURE__ */ k('<div class="text-xs font-light mt-1"><div class="grid grid-cols-12"><div class="col-span-11 text-justify mr-1">');
const Pl = (e) => {
  const t = e.config, [n, i] = K(0), [r] = K(t.formMode > 1 ? !0 : e.component.disableInput), [l, a] = K(!1), s = () => {
    l() ? a(!1) : a(!0);
  }, [c] = K(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [o] = K(t.formMode > 2 && e.comments == 0), d = () => {
    i(1), $();
  }, f = () => {
    let C = vt().format("YYYY-MM-DD HH:mm:ss");
    e.onValueChange(C);
  };
  let x = () => {
    i(0);
  };
  const $ = () => {
    let C = document.querySelector("#titleModalConfirmation"), g = document.querySelector("#contentModalConfirmation");
    C.innerHTML = e.component.titleModalConfirmation !== void 0 ? e.component.titleModalConfirmation : "Confirmation", g.innerHTML = e.component.contentModalConfirmation !== void 0 ? e.component.contentModalConfirmation : "Are you certain to generate the current time?";
  };
  return (() => {
    var C = th(), g = C.firstChild, u = g.firstChild, b = u.firstChild, y = b.firstChild, S = b.nextSibling, p = u.nextSibling, L = p.firstChild, V = p.nextSibling, v = V.nextSibling;
    return _(C, m(j, {
      get when() {
        return n() == 1;
      },
      get children() {
        var h = q0(), w = h.firstChild, E = w.firstChild, I = E.nextSibling, M = I.nextSibling, O = M.firstChild, N = O.nextSibling, T = N.firstChild, A = T.nextSibling;
        return T.$$click = (z) => f(), A.$$click = (z) => x(), h;
      }
    }), g), _(b, m(j, {
      get when() {
        return e.component.required;
      },
      get children() {
        return G0();
      }
    }), null), _(b, m(j, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var h = Y0();
        return h.$$click = s, h;
      }
    }), null), _(S, m(j, {
      get when() {
        return l();
      },
      get children() {
        var h = Q0();
        return R(() => h.innerHTML = e.component.hint), h;
      }
    })), L.$$click = () => d(), _(p, m(j, {
      get when() {
        return c();
      },
      get children() {
        var h = X0();
        return h.firstChild, h.$$click = (w) => e.openRemark(e.component.dataKey), _(h, m(j, {
          get when() {
            return ue(() => !!e.comments)() && e.comments > 0;
          },
          get children() {
            var w = Z0();
            return _(w, () => e.comments), w;
          }
        }), null), R(() => h.disabled = o()), h;
      }
    }), null), _(g, m(j, {
      get when() {
        return e.value !== "";
      },
      get children() {
        var h = eh(), w = h.firstChild;
        return _(w, () => e.value), h;
      }
    }), V), _(v, m(j, {
      get when() {
        var h;
        return ((h = e.validationMessage) == null ? void 0 : h.length) > 0;
      },
      get children() {
        return m(fe, {
          get each() {
            return e.validationMessage;
          },
          children: (h) => (() => {
            var w = rh(), E = w.firstChild, I = E.firstChild;
            return _(E, m(we, {
              get children() {
                return [m(ee, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return nh();
                  }
                }), m(ee, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return ih();
                  }
                })];
              }
            }), I), I.innerHTML = h, R((M) => te(E, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, M)), w;
          })()
        });
      }
    })), R((h) => {
      var w = e.component.label, E = r(), I = {
        " border-b border-orange-500 pb-3 ": e.classValidation === 1,
        " border-b border-pink-600 pb-3 ": e.classValidation === 2
      };
      return w !== h.e && (y.innerHTML = h.e = w), E !== h.t && (L.disabled = h.t = E), h.a = te(V, I, h.a), h;
    }, {
      e: void 0,
      t: void 0,
      a: void 0
    }), C;
  })();
};
ye(["click"]);
class vi {
  constructor(t, n, i, r) {
    if (isNaN(t) || isNaN(n))
      throw new Error(`Point is invalid: (${t}, ${n})`);
    this.x = +t, this.y = +n, this.pressure = i || 0, this.time = r || Date.now();
  }
  distanceTo(t) {
    return Math.sqrt(Math.pow(this.x - t.x, 2) + Math.pow(this.y - t.y, 2));
  }
  equals(t) {
    return this.x === t.x && this.y === t.y && this.pressure === t.pressure && this.time === t.time;
  }
  velocityFrom(t) {
    return this.time !== t.time ? this.distanceTo(t) / (this.time - t.time) : 0;
  }
}
class Hi {
  constructor(t, n, i, r, l, a) {
    this.startPoint = t, this.control2 = n, this.control1 = i, this.endPoint = r, this.startWidth = l, this.endWidth = a;
  }
  static fromPoints(t, n) {
    const i = this.calculateControlPoints(t[0], t[1], t[2]).c2, r = this.calculateControlPoints(t[1], t[2], t[3]).c1;
    return new Hi(t[1], i, r, t[2], n.start, n.end);
  }
  static calculateControlPoints(t, n, i) {
    const r = t.x - n.x, l = t.y - n.y, a = n.x - i.x, s = n.y - i.y, c = { x: (t.x + n.x) / 2, y: (t.y + n.y) / 2 }, o = { x: (n.x + i.x) / 2, y: (n.y + i.y) / 2 }, d = Math.sqrt(r * r + l * l), f = Math.sqrt(a * a + s * s), x = c.x - o.x, $ = c.y - o.y, C = f / (d + f), g = { x: o.x + x * C, y: o.y + $ * C }, u = n.x - g.x, b = n.y - g.y;
    return {
      c1: new vi(c.x + u, c.y + b),
      c2: new vi(o.x + u, o.y + b)
    };
  }
  length() {
    let n = 0, i, r;
    for (let l = 0; l <= 10; l += 1) {
      const a = l / 10, s = this.point(a, this.startPoint.x, this.control1.x, this.control2.x, this.endPoint.x), c = this.point(a, this.startPoint.y, this.control1.y, this.control2.y, this.endPoint.y);
      if (l > 0) {
        const o = s - i, d = c - r;
        n += Math.sqrt(o * o + d * d);
      }
      i = s, r = c;
    }
    return n;
  }
  point(t, n, i, r, l) {
    return n * (1 - t) * (1 - t) * (1 - t) + 3 * i * (1 - t) * (1 - t) * t + 3 * r * (1 - t) * t * t + l * t * t * t;
  }
}
class lh {
  constructor() {
    try {
      this._et = new EventTarget();
    } catch (t) {
      this._et = document;
    }
  }
  addEventListener(t, n, i) {
    this._et.addEventListener(t, n, i);
  }
  dispatchEvent(t) {
    return this._et.dispatchEvent(t);
  }
  removeEventListener(t, n, i) {
    this._et.removeEventListener(t, n, i);
  }
}
function ah(e, t = 250) {
  let n = 0, i = null, r, l, a;
  const s = () => {
    n = Date.now(), i = null, r = e.apply(l, a), i || (l = null, a = []);
  };
  return function(...o) {
    const d = Date.now(), f = t - (d - n);
    return l = this, a = o, f <= 0 || f > t ? (i && (clearTimeout(i), i = null), n = d, r = e.apply(l, a), i || (l = null, a = [])) : i || (i = window.setTimeout(s, f)), r;
  };
}
class fn extends lh {
  constructor(t, n = {}) {
    super(), this.canvas = t, this._handleMouseDown = (i) => {
      i.buttons === 1 && (this._drawningStroke = !0, this._strokeBegin(i));
    }, this._handleMouseMove = (i) => {
      this._drawningStroke && this._strokeMoveUpdate(i);
    }, this._handleMouseUp = (i) => {
      i.buttons === 1 && this._drawningStroke && (this._drawningStroke = !1, this._strokeEnd(i));
    }, this._handleTouchStart = (i) => {
      if (i.preventDefault(), i.targetTouches.length === 1) {
        const r = i.changedTouches[0];
        this._strokeBegin(r);
      }
    }, this._handleTouchMove = (i) => {
      i.preventDefault();
      const r = i.targetTouches[0];
      this._strokeMoveUpdate(r);
    }, this._handleTouchEnd = (i) => {
      if (i.target === this.canvas) {
        i.preventDefault();
        const l = i.changedTouches[0];
        this._strokeEnd(l);
      }
    }, this._handlePointerStart = (i) => {
      this._drawningStroke = !0, i.preventDefault(), this._strokeBegin(i);
    }, this._handlePointerMove = (i) => {
      this._drawningStroke && (i.preventDefault(), this._strokeMoveUpdate(i));
    }, this._handlePointerEnd = (i) => {
      this._drawningStroke && (i.preventDefault(), this._drawningStroke = !1, this._strokeEnd(i));
    }, this.velocityFilterWeight = n.velocityFilterWeight || 0.7, this.minWidth = n.minWidth || 0.5, this.maxWidth = n.maxWidth || 2.5, this.throttle = "throttle" in n ? n.throttle : 16, this.minDistance = "minDistance" in n ? n.minDistance : 5, this.dotSize = n.dotSize || 0, this.penColor = n.penColor || "black", this.backgroundColor = n.backgroundColor || "rgba(0,0,0,0)", this._strokeMoveUpdate = this.throttle ? ah(fn.prototype._strokeUpdate, this.throttle) : fn.prototype._strokeUpdate, this._ctx = t.getContext("2d"), this.clear(), this.on();
  }
  clear() {
    const { _ctx: t, canvas: n } = this;
    t.fillStyle = this.backgroundColor, t.clearRect(0, 0, n.width, n.height), t.fillRect(0, 0, n.width, n.height), this._data = [], this._reset(), this._isEmpty = !0;
  }
  fromDataURL(t, n = {}) {
    return new Promise((i, r) => {
      const l = new Image(), a = n.ratio || window.devicePixelRatio || 1, s = n.width || this.canvas.width / a, c = n.height || this.canvas.height / a, o = n.xOffset || 0, d = n.yOffset || 0;
      this._reset(), l.onload = () => {
        this._ctx.drawImage(l, o, d, s, c), i();
      }, l.onerror = (f) => {
        r(f);
      }, l.crossOrigin = "anonymous", l.src = t, this._isEmpty = !1;
    });
  }
  toDataURL(t = "image/png", n) {
    return t === "image/svg+xml" ? this._toSVG() : this.canvas.toDataURL(t, n);
  }
  on() {
    this.canvas.style.touchAction = "none", this.canvas.style.msTouchAction = "none", this.canvas.style.userSelect = "none";
    const t = /Macintosh/.test(navigator.userAgent) && "ontouchstart" in document;
    window.PointerEvent && !t ? this._handlePointerEvents() : (this._handleMouseEvents(), "ontouchstart" in window && this._handleTouchEvents());
  }
  off() {
    this.canvas.style.touchAction = "auto", this.canvas.style.msTouchAction = "auto", this.canvas.style.userSelect = "auto", this.canvas.removeEventListener("pointerdown", this._handlePointerStart), this.canvas.removeEventListener("pointermove", this._handlePointerMove), document.removeEventListener("pointerup", this._handlePointerEnd), this.canvas.removeEventListener("mousedown", this._handleMouseDown), this.canvas.removeEventListener("mousemove", this._handleMouseMove), document.removeEventListener("mouseup", this._handleMouseUp), this.canvas.removeEventListener("touchstart", this._handleTouchStart), this.canvas.removeEventListener("touchmove", this._handleTouchMove), this.canvas.removeEventListener("touchend", this._handleTouchEnd);
  }
  isEmpty() {
    return this._isEmpty;
  }
  fromData(t, { clear: n = !0 } = {}) {
    n && this.clear(), this._fromData(t, this._drawCurve.bind(this), this._drawDot.bind(this)), this._data = this._data.concat(t);
  }
  toData() {
    return this._data;
  }
  _strokeBegin(t) {
    this.dispatchEvent(new CustomEvent("beginStroke", { detail: t }));
    const n = {
      dotSize: this.dotSize,
      minWidth: this.minWidth,
      maxWidth: this.maxWidth,
      penColor: this.penColor,
      points: []
    };
    this._data.push(n), this._reset(), this._strokeUpdate(t);
  }
  _strokeUpdate(t) {
    if (this._data.length === 0) {
      this._strokeBegin(t);
      return;
    }
    this.dispatchEvent(new CustomEvent("beforeUpdateStroke", { detail: t }));
    const n = t.clientX, i = t.clientY, r = t.pressure !== void 0 ? t.pressure : t.force !== void 0 ? t.force : 0, l = this._createPoint(n, i, r), a = this._data[this._data.length - 1], s = a.points, c = s.length > 0 && s[s.length - 1], o = c ? l.distanceTo(c) <= this.minDistance : !1, { penColor: d, dotSize: f, minWidth: x, maxWidth: $ } = a;
    if (!c || !(c && o)) {
      const C = this._addPoint(l);
      c ? C && this._drawCurve(C, {
        penColor: d,
        dotSize: f,
        minWidth: x,
        maxWidth: $
      }) : this._drawDot(l, {
        penColor: d,
        dotSize: f,
        minWidth: x,
        maxWidth: $
      }), s.push({
        time: l.time,
        x: l.x,
        y: l.y,
        pressure: l.pressure
      });
    }
    this.dispatchEvent(new CustomEvent("afterUpdateStroke", { detail: t }));
  }
  _strokeEnd(t) {
    this._strokeUpdate(t), this.dispatchEvent(new CustomEvent("endStroke", { detail: t }));
  }
  _handlePointerEvents() {
    this._drawningStroke = !1, this.canvas.addEventListener("pointerdown", this._handlePointerStart), this.canvas.addEventListener("pointermove", this._handlePointerMove), document.addEventListener("pointerup", this._handlePointerEnd);
  }
  _handleMouseEvents() {
    this._drawningStroke = !1, this.canvas.addEventListener("mousedown", this._handleMouseDown), this.canvas.addEventListener("mousemove", this._handleMouseMove), document.addEventListener("mouseup", this._handleMouseUp);
  }
  _handleTouchEvents() {
    this.canvas.addEventListener("touchstart", this._handleTouchStart), this.canvas.addEventListener("touchmove", this._handleTouchMove), this.canvas.addEventListener("touchend", this._handleTouchEnd);
  }
  _reset() {
    this._lastPoints = [], this._lastVelocity = 0, this._lastWidth = (this.minWidth + this.maxWidth) / 2, this._ctx.fillStyle = this.penColor;
  }
  _createPoint(t, n, i) {
    const r = this.canvas.getBoundingClientRect();
    return new vi(t - r.left, n - r.top, i, (/* @__PURE__ */ new Date()).getTime());
  }
  _addPoint(t) {
    const { _lastPoints: n } = this;
    if (n.push(t), n.length > 2) {
      n.length === 3 && n.unshift(n[0]);
      const i = this._calculateCurveWidths(n[1], n[2]), r = Hi.fromPoints(n, i);
      return n.shift(), r;
    }
    return null;
  }
  _calculateCurveWidths(t, n) {
    const i = this.velocityFilterWeight * n.velocityFrom(t) + (1 - this.velocityFilterWeight) * this._lastVelocity, r = this._strokeWidth(i), l = {
      end: r,
      start: this._lastWidth
    };
    return this._lastVelocity = i, this._lastWidth = r, l;
  }
  _strokeWidth(t) {
    return Math.max(this.maxWidth / (t + 1), this.minWidth);
  }
  _drawCurveSegment(t, n, i) {
    const r = this._ctx;
    r.moveTo(t, n), r.arc(t, n, i, 0, 2 * Math.PI, !1), this._isEmpty = !1;
  }
  _drawCurve(t, n) {
    const i = this._ctx, r = t.endWidth - t.startWidth, l = Math.ceil(t.length()) * 2;
    i.beginPath(), i.fillStyle = n.penColor;
    for (let a = 0; a < l; a += 1) {
      const s = a / l, c = s * s, o = c * s, d = 1 - s, f = d * d, x = f * d;
      let $ = x * t.startPoint.x;
      $ += 3 * f * s * t.control1.x, $ += 3 * d * c * t.control2.x, $ += o * t.endPoint.x;
      let C = x * t.startPoint.y;
      C += 3 * f * s * t.control1.y, C += 3 * d * c * t.control2.y, C += o * t.endPoint.y;
      const g = Math.min(t.startWidth + o * r, n.maxWidth);
      this._drawCurveSegment($, C, g);
    }
    i.closePath(), i.fill();
  }
  _drawDot(t, n) {
    const i = this._ctx, r = n.dotSize > 0 ? n.dotSize : (n.minWidth + n.maxWidth) / 2;
    i.beginPath(), this._drawCurveSegment(t.x, t.y, r), i.closePath(), i.fillStyle = n.penColor, i.fill();
  }
  _fromData(t, n, i) {
    for (const r of t) {
      const { penColor: l, dotSize: a, minWidth: s, maxWidth: c, points: o } = r;
      if (o.length > 1)
        for (let d = 0; d < o.length; d += 1) {
          const f = o[d], x = new vi(f.x, f.y, f.pressure, f.time);
          this.penColor = l, d === 0 && this._reset();
          const $ = this._addPoint(x);
          $ && n($, {
            penColor: l,
            dotSize: a,
            minWidth: s,
            maxWidth: c
          });
        }
      else
        this._reset(), i(o[0], {
          penColor: l,
          dotSize: a,
          minWidth: s,
          maxWidth: c
        });
    }
  }
  _toSVG() {
    const t = this._data, n = Math.max(window.devicePixelRatio || 1, 1), i = 0, r = 0, l = this.canvas.width / n, a = this.canvas.height / n, s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    s.setAttribute("width", this.canvas.width.toString()), s.setAttribute("height", this.canvas.height.toString()), this._fromData(t, ($, { penColor: C }) => {
      const g = document.createElement("path");
      if (!isNaN($.control1.x) && !isNaN($.control1.y) && !isNaN($.control2.x) && !isNaN($.control2.y)) {
        const u = `M ${$.startPoint.x.toFixed(3)},${$.startPoint.y.toFixed(3)} C ${$.control1.x.toFixed(3)},${$.control1.y.toFixed(3)} ${$.control2.x.toFixed(3)},${$.control2.y.toFixed(3)} ${$.endPoint.x.toFixed(3)},${$.endPoint.y.toFixed(3)}`;
        g.setAttribute("d", u), g.setAttribute("stroke-width", ($.endWidth * 2.25).toFixed(3)), g.setAttribute("stroke", C), g.setAttribute("fill", "none"), g.setAttribute("stroke-linecap", "round"), s.appendChild(g);
      }
    }, ($, { penColor: C, dotSize: g, minWidth: u, maxWidth: b }) => {
      const y = document.createElement("circle"), S = g > 0 ? g : (u + b) / 2;
      y.setAttribute("r", S.toString()), y.setAttribute("cx", $.x.toString()), y.setAttribute("cy", $.y.toString()), y.setAttribute("fill", C), s.appendChild(y);
    });
    const c = "data:image/svg+xml;base64,", o = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="${i} ${r} ${this.canvas.width} ${this.canvas.height}" width="${l}" height="${a}">`;
    let d = s.innerHTML;
    if (d === void 0) {
      const $ = document.createElement("dummy"), C = s.childNodes;
      $.innerHTML = "";
      for (let g = 0; g < C.length; g += 1)
        $.appendChild(C[g].cloneNode(!0));
      d = $.innerHTML;
    }
    const x = o + d + "</svg>";
    return c + btoa(x);
  }
}
var sh = /* @__PURE__ */ k("<span class=text-pink-600>*"), oh = /* @__PURE__ */ k('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), dh = /* @__PURE__ */ k('<div class="italic text-xs font-extralight text-zinc-400 ">'), ch = /* @__PURE__ */ k('<button class="bg-white text-gray-500 p-2 rounded-full focus:outline-none h-10 w-10 hover:bg-teal-200 hover:text-teal-400 hover:border-teal-200 border-2 border-gray-300 "><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4">'), uh = /* @__PURE__ */ k('<button class="relative inline-block bg-white p-2 h-10 w-10 text-gray-500 rounded-full hover:bg-teal-100 hover:text-teal-400 hover:border-teal-100 border-2 border-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M5 13l4 4L19 7">'), hh = /* @__PURE__ */ k('<span class="absolute top-0 right-0 inline-flex items-center justify-center h-6 w-6 text-xs font-semibold text-white transform translate-x-1/2 -translate-y-1/4 bg-pink-600/80 rounded-full">'), gh = /* @__PURE__ */ k('<button class="relative inline-block bg-white p-2 h-10 w-10 text-gray-500 rounded-full hover:bg-yellow-100 hover:text-yellow-400 hover:border-yellow-100 border-2 border-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z">'), fh = /* @__PURE__ */ k('<div><div class="border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="flex items-start gap-2"><div class="font-light text-sm space-y-2 py-2.5 px-2 flex-1"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 flex items-center gap-2 shrink-0"><button class="relative inline-block bg-white p-2 h-10 w-10 text-gray-500 rounded-full hover:bg-amber-100 hover:text-amber-400 hover:border-amber-100 border-2 border-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg></button></div></div><div class="font-light text-sm space-x-2 py-2.5 px-2 space-y-4"><div class=preview-class><div class="container mx-auto space-y-3 "><canvas id=signature-pad class="relative rounded-lg w-full bg-white border-b-8 border-gray-100 border"></canvas></div></div></div><div></div><div class=pb-4>'), vh = /* @__PURE__ */ k('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), mh = /* @__PURE__ */ k('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), bh = /* @__PURE__ */ k('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="text-justify mr-1">');
const Kl = (e) => {
  const [t, n] = K(""), [i, r] = K([]), [l, a] = K(""), [s, c] = K(!0), o = e.config, [d] = K(o.formMode > 1 ? !0 : e.component.disableInput), [f, x] = K(!1), $ = () => {
    f() ? x(!1) : x(!0);
  }, [C] = K(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [g] = K(o.formMode > 2 && e.comments == 0);
  Me(() => {
    const p = document.querySelector("canvas"), L = new fn(p);
    if (L.clear(), r(L.toData()), a(L.toDataURL("image/png")), e.value[0]) {
      c(!1), e.value[0].value;
      let V = e.value[0].signature;
      const v = new fn(p);
      v.clear(), v.fromData(V);
    }
  });
  const u = () => {
    Me(() => {
      const p = document.querySelector("canvas");
      let L = Math.max(window.devicePixelRatio || 1, 1);
      if (p && (p.width = p.offsetWidth * L, p.height = p.width * (window.innerWidth < 720 ? 0.28 : 0.18), p.getContext("2d").scale(L, L), e.value[0])) {
        c(!1);
        let V = e.value[0].value, v = e.value[0].signature;
        const h = new fn(p);
        h.clear(), h.fromData(v), n(V);
      }
    });
  };
  window.onresize = u, u();
  const b = (p) => {
    const L = document.querySelector("canvas");
    new fn(L).clear(), c(!0);
    let v = JSON.parse(JSON.stringify(e.value));
    v = [], e.onValueChange(v);
  }, y = (p) => {
    const V = document.querySelector("canvas").toDataURL();
    if (i().length > 0) {
      let v = JSON.parse(JSON.stringify(e.value));
      v = [], v.push({
        value: V,
        type: "image/png",
        signature: i()
      }), e.onValueChange(v), Xe("Signature acquired!");
    } else
      ke("Please provide the appropriate signature!");
  }, S = (p) => {
    if (p.preventDefault(), e.value[0]) {
      const L = document.createElement("a");
      L.download = e.component.dataKey + ".png", L.href = e.value[0].value;
      const V = new MouseEvent("click", {
        view: window,
        bubbles: !0,
        cancelable: !0
      });
      L.dispatchEvent(V), L.remove();
    }
  };
  return (() => {
    var p = fh(), L = p.firstChild, V = L.firstChild, v = V.firstChild, h = v.firstChild, w = h.firstChild, E = h.nextSibling, I = v.nextSibling, M = I.firstChild, O = V.nextSibling, N = O.nextSibling, T = N.nextSibling;
    return _(h, m(j, {
      get when() {
        return e.component.required;
      },
      get children() {
        return sh();
      }
    }), null), _(h, m(j, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var A = oh();
        return A.$$click = $, A;
      }
    }), null), _(E, m(j, {
      get when() {
        return f();
      },
      get children() {
        var A = dh();
        return R(() => A.innerHTML = e.component.hint), A;
      }
    })), _(I, m(j, {
      get when() {
        return e.value[0];
      },
      get children() {
        var A = ch();
        return A.$$click = (z) => S(z), A;
      }
    }), M), _(I, m(j, {
      get when() {
        return s();
      },
      get children() {
        var A = uh();
        return A.$$click = (z) => y(), A;
      }
    }), M), M.$$click = (A) => b(), _(I, m(j, {
      get when() {
        return C();
      },
      get children() {
        var A = gh();
        return A.firstChild, A.$$click = (z) => e.openRemark(e.component.dataKey), _(A, m(j, {
          get when() {
            return ue(() => !!e.comments)() && e.comments > 0;
          },
          get children() {
            var z = hh();
            return _(z, () => e.comments), z;
          }
        }), null), R(() => A.disabled = g()), A;
      }
    }), null), _(T, m(j, {
      get when() {
        var A;
        return ((A = e.validationMessage) == null ? void 0 : A.length) > 0;
      },
      get children() {
        return m(fe, {
          get each() {
            return e.validationMessage;
          },
          children: (A) => (() => {
            var z = bh(), D = z.firstChild, P = D.firstChild;
            return _(D, m(we, {
              get children() {
                return [m(ee, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return vh();
                  }
                }), m(ee, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return mh();
                  }
                })];
              }
            }), P), P.innerHTML = A, R((B) => te(D, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, B)), z;
          })()
        });
      }
    })), R((A) => {
      var z = e.component.label, D = {
        " border-b border-orange-500 pb-3 ": e.classValidation === 1,
        " border-b border-pink-600 pb-3 ": e.classValidation === 2
      };
      return z !== A.e && (w.innerHTML = A.e = z), A.t = te(N, D, A.t), A;
    }, {
      e: void 0,
      t: void 0
    }), p;
  })();
};
ye(["click"]);
var wh = /* @__PURE__ */ k("<svg stroke-width=0>");
function xh(e, t) {
  const n = jt(e.a, t), [i, r] = tl(n, ["src"]), [l, a] = K(""), s = Ee(() => t.title ? `${e.c}<title>${t.title}</title>` : e.c);
  return Me(() => a(s())), bi(() => {
    a("");
  }), (() => {
    var c = wh();
    return Ya(c, jt({
      get stroke() {
        var o;
        return (o = e.a) == null ? void 0 : o.stroke;
      },
      get color() {
        return t.color || "currentColor";
      },
      get fill() {
        return t.color || "currentColor";
      },
      get style() {
        return Ct(Ae({}, t.style), {
          overflow: "visible"
        });
      }
    }, r, {
      get height() {
        return t.size || "1em";
      },
      get width() {
        return t.size || "1em";
      },
      xmlns: "http://www.w3.org/2000/svg",
      get innerHTML() {
        return l();
      }
    }), !0), _(c, () => es), c;
  })();
}
function Bl(e) {
  return xh({
    a: { fill: "none", stroke: "currentColor", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", viewBox: "0 0 24 24" },
    c: '<path d="M6 9 12 15 18 9"/>'
  }, e);
}
var yh = /* @__PURE__ */ k("<span class=text-pink-600>*"), ph = /* @__PURE__ */ k('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), kh = /* @__PURE__ */ k('<div class="italic text-xs font-extralight text-zinc-400 ">'), $h = /* @__PURE__ */ k('<input type=number class="w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400block pr-20"placeholder>'), _h = /* @__PURE__ */ k('<input type=number class="w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400block pr-20"placeholder oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);">'), Sh = /* @__PURE__ */ k('<span class="absolute top-0 right-0 inline-flex items-center justify-center h-6 w-6 text-xs font-semibold text-white transform translate-x-1/2 -translate-y-1/4 bg-pink-600/80 rounded-full">'), Ch = /* @__PURE__ */ k('<div class=shrink-0><button class="relative inline-block bg-white p-2 h-10 w-10 text-gray-500 rounded-full hover:bg-yellow-100 hover:text-yellow-400 hover:border-yellow-100 border-2 border-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z">'), Mh = /* @__PURE__ */ k('<div class="grid md:grid-cols-3 p-2 border-b border-gray-300/[.40] dark:border-gray-200/[.10]"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 md:col-span-2 flex items-start gap-2"><div class="flex-1 relative"><div class="absolute inset-y-0 right-0 flex items-center">'), Ih = /* @__PURE__ */ k('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), Eh = /* @__PURE__ */ k('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Oh = /* @__PURE__ */ k('<div class="text-xs font-light mt-1"><div class="grid grid-cols-12"><div class="col-span-11 text-justify mr-1">');
const Lh = (e) => {
  const [t] = It(), [n] = Et(), i = e.config, [r, l] = K(i.formMode > 1 ? !0 : e.component.disableInput), [a, s] = K(""), [c, o] = K(!1), [d, f] = K([]), [x, $] = K(""), [C, g] = K(!1), u = () => {
    C() ? g(!1) : g(!0);
  }, [b] = K(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [y] = K(i.formMode > 2 && e.comments == 0);
  let S = (p, L, V) => {
    if (V == 2 && L.value != "" && L.value != null) {
      let v = JSON.parse(JSON.stringify(e.value));
      v = [], v.push({
        value: p,
        unit: L
      }), e.onValueChange(v);
    } else {
      let v = JSON.parse(JSON.stringify(e.value));
      v = [], v.push({
        value: p,
        unit: L
      }), e.onValueChange(v);
    }
  };
  switch (e.component.typeOption) {
    case 1: {
      try {
        let p = e.component.options.map((V, v) => ({
          value: V.value,
          label: V.label
        })), L = e.value && e.value != "" && e.value[0].unit && e.value[0].unit.value && e.value[0].unit.value != "" ? e.value[0].unit.value : "";
        Me(() => {
          s(e.component.label), f(p);
          let V = p.filter((v) => v.value.includes(L))[0] && L != "" ? p.filter((v) => v.value.includes(L))[0].label : "Select Unit";
          $(V), o(!0);
        });
      } catch (p) {
        ke(n.details.language[0].fetchFailed);
      }
      break;
    }
    case 2: {
      try {
        if (i.lookupMode === 1) {
          let p = e.component.sourceAPI[0], L = `${p.baseUrl}`;
          if (p.filterDependencies !== void 0 && p.filterDependencies.length > 0) {
            let E, I, M = L;
            E = p.filterDependencies.map((O, N) => {
              let T = O.sourceAnswer.split("@"), A = t.details.find((z) => z.dataKey == T[0]);
              if (A.answer) {
                if (A.answer.length > 0) {
                  let z = encodeURI(A.answer[A.answer.length - 1].value);
                  I = `${O.params}=${z}`;
                }
              } else
                l(!0);
              return I;
            }).join("&"), L = `${M}?${E}`;
          }
          if (p.subResourceDependencies !== void 0 && p.subResourceDependencies.length > 0) {
            let E, I, M = L;
            E = p.subResourceDependencies.map((O, N) => {
              let T = O.sourceAnswer.split("@"), A = t.details.find((z) => z.dataKey == T[0]);
              return A.answer ? A.answer.length > 0 && (I = `${encodeURI(A.answer[A.answer.length - 1].value)}/${O.params}`) : l(!0), I;
            }).join("/"), L = `${M}/${E}`;
          }
          let V = {
            headers: JSON.stringify(p.headers),
            method: "GET"
          };
          const v = (E) => ce(null, null, function* () {
            return yield fetch(E, {
              head: V
            }).catch((I) => ({
              success: !1,
              data: {},
              message: "500"
            })).then((I) => ce(null, null, function* () {
              if (I.status === 200) {
                let M = yield I.json(), O = new Object();
                return O.success = !0, O.data = p.data !== "" ? M[p.data] : M, O.message = M.msg, O;
              } else
                return {
                  success: !1,
                  data: {},
                  message: I.status
                };
            })).then((I) => I);
          }), [h] = Dn(() => L, v);
          let w = e.value && e.value != "" && e.value[0].unit && e.value[0].unit.value && e.value[0].unit.value != "" ? e.value[0].unit.value : "";
          Me(() => {
            if (s(e.component.label), h())
              if (!h().success)
                ke(n.details.language[0].fetchFailed);
              else {
                let E = [];
                h().data.map((M, O) => {
                  E.push({
                    value: M[p.value],
                    label: M[p.label]
                  });
                });
                let I = E.find((M) => M.value == w) && w != "" ? E.find((M) => M.value == w).label : "Select Unit";
                f(E), $(I), o(!0);
              }
          });
        } else if (i.lookupMode === 2) {
          let p, L = [];
          p = e.component.sourceSelect;
          let V = p[0].id, v = p[0].version;
          p[0].parentCondition.length > 0 && p[0].parentCondition.map((E, I) => {
            let M = E.value.split("@"), O = t.details.find((N) => N.dataKey == M[0]);
            if (O.answer && O.answer.length > 0) {
              let N = O.answer[O.answer.length - 1].value.toString();
              L.push({
                key: E.key,
                value: N
              });
            }
          });
          let h = (E) => {
            let I = [];
            if (E.data.length > 0) {
              let M = p[0].value, O = p[0].desc, N = e.value && e.value != "" && e.value[0].unit && e.value[0].unit.value && e.value[0].unit.value != "" ? e.value[0].unit.value : "";
              E.data.map((A, z) => {
                I.push({
                  value: A[M],
                  label: A[O]
                });
              });
              let T = I.find((A) => A.value == N) && N != "" ? I.find((A) => A.value == N).label : "Select Unit";
              s(e.component.label), f(I), $(T), o(!0);
            }
          };
          const w = e.MobileOfflineSearch(V, v, L, h);
        }
      } catch (p) {
        ke(n.details.language[0].fetchFailed);
      }
      break;
    }
    case 3: {
      try {
        let p, L, V = e.value && e.value != "" && e.value[0].unit && e.value[0].unit.value && e.value[0].unit.value != "" ? e.value[0].unit.value : "";
        if (e.component.sourceOption !== void 0 && e.component.typeOption === 3) {
          const h = t.details.findIndex((w) => w.dataKey === e.component.sourceOption);
          t.details[h].type, p = t.details[h].answer, p != null ? L = p.filter((w, E) => w.value != 0).map((w, E) => ({
            value: w.value,
            label: w.label
          })) : L = [];
        }
        let v = L.find((h) => h.value == V) && V != "" ? L.find((h) => h.value == V).label : "Select Unit";
        Me(() => {
          s(e.component.label), f(L), $(v), o(!0);
        });
      } catch (p) {
        ke(n.details.language[0].fetchFailed);
      }
      break;
    }
    default: {
      try {
        let p;
        e.component.options ? p = e.component.options.map((V, v) => ({
          value: V.value,
          label: V.label
        })) : p = [];
        let L = e.value && e.value != "" && e.value[0].unit && e.value[0].unit.value && e.value[0].unit.value != "" ? e.value[0].unit.value : "";
        Me(() => {
          s(e.component.label), f(p);
          let V = p.filter((v) => v.value.includes(L))[0] && L != "" ? p.filter((v) => v.value.includes(L))[0].label : "Select Unit";
          $(V), o(!0);
        });
      } catch (p) {
        ke(n.details.language[0].fetchFailed);
      }
      break;
    }
  }
  return (() => {
    var p = Mh(), L = p.firstChild, V = L.firstChild, v = V.firstChild, h = V.nextSibling, w = L.nextSibling, E = w.firstChild, I = E.firstChild;
    return _(V, m(j, {
      get when() {
        return e.component.required;
      },
      get children() {
        return yh();
      }
    }), null), _(V, m(j, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var M = ph();
        return M.$$click = u, M;
      }
    }), null), _(h, m(j, {
      get when() {
        return C();
      },
      get children() {
        var M = kh();
        return R(() => M.innerHTML = e.component.hint), M;
      }
    })), _(E, m(j, {
      get when() {
        return e.component.lengthInput === void 0;
      },
      get children() {
        var M = $h();
        return M.addEventListener("change", (O) => {
          S(O ? O.currentTarget.value : "", e.value != null && e.value != "" ? e.value[0].unit ? e.value[0].unit : {
            value: "",
            label: ""
          } : {
            value: "",
            label: ""
          }, 1);
        }), R((O) => {
          var N = e.component.dataKey, T = {
            " border border-solid border-gray-300 ": e.classValidation === 0,
            " border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
            " border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
          }, A = r();
          return N !== O.e && J(M, "name", O.e = N), O.t = te(M, T, O.t), A !== O.a && (M.disabled = O.a = A), O;
        }, {
          e: void 0,
          t: void 0,
          a: void 0
        }), R(() => M.value = e.value != null && e.value != "" ? e.value[0].value : ""), M;
      }
    }), I), _(E, m(j, {
      get when() {
        return ue(() => e.component.lengthInput !== void 0)() && e.component.lengthInput.length > 0;
      },
      get children() {
        var M = _h();
        return M.addEventListener("change", (O) => {
          S(O ? O.currentTarget.value : "", e.value != null && e.value != "" ? e.value[0].unit ? e.value[0].unit : {
            value: "",
            label: ""
          } : {
            value: "",
            label: ""
          }, 1);
        }), R((O) => {
          var N = e.component.dataKey, T = {
            " border border-solid border-gray-300 ": e.classValidation === 0,
            " border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
            " border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
          }, A = r(), z = e.component.lengthInput[0].maxlength !== void 0 ? e.component.lengthInput[0].maxlength : "", D = e.component.lengthInput[0].minlength !== void 0 ? e.component.lengthInput[0].minlength : "", P = e.component.rangeInput && e.component.rangeInput[0].max !== void 0 ? e.component.rangeInput[0].max : "", B = e.component.rangeInput && e.component.rangeInput[0].min !== void 0 ? e.component.rangeInput[0].min : "";
          return N !== O.e && J(M, "name", O.e = N), O.t = te(M, T, O.t), A !== O.a && (M.disabled = O.a = A), z !== O.o && J(M, "maxlength", O.o = z), D !== O.i && J(M, "minlength", O.i = D), P !== O.n && J(M, "max", O.n = P), B !== O.s && J(M, "min", O.s = B), O;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0,
          i: void 0,
          n: void 0,
          s: void 0
        }), R(() => M.value = e.value != null && e.value != "" ? e.value[0].value : ""), M;
      }
    }), I), _(E, m(j, {
      get when() {
        var M;
        return ((M = e.validationMessage) == null ? void 0 : M.length) > 0;
      },
      get children() {
        return m(fe, {
          get each() {
            return e.validationMessage;
          },
          children: (M) => (() => {
            var O = Oh(), N = O.firstChild, T = N.firstChild;
            return _(N, m(we, {
              get children() {
                return [m(ee, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return Ih();
                  }
                }), m(ee, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return Eh();
                  }
                })];
              }
            }), T), T.innerHTML = M, R((A) => te(N, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, A)), O;
          })()
        });
      }
    }), I), _(I, m(Mn, jt({
      class: "formgear-select-unit  w-full rounded font-light text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-0 border-transparent focus:outline-none  disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
    }, () => Cn(d() || [], {
      key: "label",
      filterable: !0
    }), {
      get disabled() {
        return r();
      },
      placeholder: "Unit",
      onChange: (M) => S(e.value != null && e.value != "" ? e.value[0].value : "", {
        value: M ? M.value : "",
        label: M ? M.label : ""
      }, 2),
      get initialValue() {
        return {
          value: e.value && e.value != "" && e.value[0].unit && e.value[0].unit.value && e.value[0].unit.value != "" ? e.value[0].unit.value : "",
          label: x
        };
      }
    })), null), _(I, m(Bl, {
      size: 20,
      class: "text-gray-400  mr-3"
    }), null), _(w, m(j, {
      get when() {
        return b();
      },
      get children() {
        var M = Ch(), O = M.firstChild;
        return O.firstChild, O.$$click = (N) => e.openRemark(e.component.dataKey), _(O, m(j, {
          get when() {
            return ue(() => !!e.comments)() && e.comments > 0;
          },
          get children() {
            var N = Sh();
            return _(N, () => e.comments), N;
          }
        }), null), R(() => O.disabled = y()), M;
      }
    }), null), R(() => v.innerHTML = e.component.label), p;
  })();
};
ye(["click"]);
var Ah = /* @__PURE__ */ k("<span class=text-pink-600>*"), Rh = /* @__PURE__ */ k('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Nh = /* @__PURE__ */ k('<div class="italic text-xs font-extralight text-zinc-400 ">'), Vh = /* @__PURE__ */ k('<input type=number class="w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"placeholder>'), Th = /* @__PURE__ */ k('<input type=number class="w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"placeholder oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);">'), jh = /* @__PURE__ */ k('<span class="absolute top-0 right-0 inline-flex items-center justify-center h-6 w-6 text-xs font-semibold text-white transform translate-x-1/2 -translate-y-1/4 bg-pink-600/80 rounded-full">'), Dh = /* @__PURE__ */ k('<div class=shrink-0><button class="relative inline-block bg-white p-2 h-10 w-10 text-gray-500 rounded-full hover:bg-yellow-100 hover:text-yellow-400 hover:border-yellow-100 border-2 border-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z">'), Ph = /* @__PURE__ */ k('<div class="grid md:grid-cols-3 p-2 border-b border-gray-300/[.40] dark:border-gray-200/[.10]"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 md:col-span-2 flex items-start gap-2"><div class=flex-1>'), Kh = /* @__PURE__ */ k('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), Bh = /* @__PURE__ */ k('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), zh = /* @__PURE__ */ k('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="flex-1 text-justify">');
const zl = (e) => {
  const t = e.config, [n] = K(t.formMode > 1 ? !0 : e.component.disableInput), [i, r] = K(!1), l = () => {
    i() ? r(!1) : r(!0);
  };
  let a = Fi((o) => {
    let d = e.component.decimalLength ? e.component.decimalLength : 2;
    e.onValueChange(parseFloat(o).toFixed(d));
  }, 1e3);
  const [s] = K(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [c] = K(t.formMode > 2 && e.comments == 0);
  return (() => {
    var o = Ph(), d = o.firstChild, f = d.firstChild, x = f.firstChild, $ = f.nextSibling, C = d.nextSibling, g = C.firstChild;
    return _(f, m(j, {
      get when() {
        return e.component.required;
      },
      get children() {
        return Ah();
      }
    }), null), _(f, m(j, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var u = Rh();
        return u.$$click = l, u;
      }
    }), null), _($, m(j, {
      get when() {
        return i();
      },
      get children() {
        var u = Nh();
        return R(() => u.innerHTML = e.component.hint), u;
      }
    })), _(g, m(j, {
      get when() {
        return e.component.lengthInput === void 0;
      },
      get children() {
        var u = Vh();
        return u.$$keyup = (b) => a(b.currentTarget.value), R((b) => {
          var y = e.component.dataKey, S = {
            " border border-solid border-gray-300 ": e.classValidation === 0,
            " border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
            " border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
          }, p = n();
          return y !== b.e && J(u, "name", b.e = y), b.t = te(u, S, b.t), p !== b.a && (u.disabled = b.a = p), b;
        }, {
          e: void 0,
          t: void 0,
          a: void 0
        }), R(() => u.value = e.value), u;
      }
    }), null), _(g, m(j, {
      get when() {
        return ue(() => e.component.lengthInput !== void 0)() && e.component.lengthInput.length > 0;
      },
      get children() {
        var u = Th();
        return u.$$keyup = (b) => a(b.currentTarget.value), R((b) => {
          var y = e.component.dataKey, S = {
            " border border-solid border-gray-300 ": e.classValidation === 0,
            " border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
            " border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
          }, p = n(), L = e.component.lengthInput[0].maxlength !== void 0 ? e.component.lengthInput[0].maxlength : "", V = e.component.lengthInput[0].minlength !== void 0 ? e.component.lengthInput[0].minlength : "", v = e.component.rangeInput && e.component.rangeInput[0].max !== void 0 ? e.component.rangeInput[0].max : "", h = e.component.rangeInput && e.component.rangeInput[0].min !== void 0 ? e.component.rangeInput[0].min : "";
          return y !== b.e && J(u, "name", b.e = y), b.t = te(u, S, b.t), p !== b.a && (u.disabled = b.a = p), L !== b.o && J(u, "maxlength", b.o = L), V !== b.i && J(u, "minlength", b.i = V), v !== b.n && J(u, "max", b.n = v), h !== b.s && J(u, "min", b.s = h), b;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0,
          i: void 0,
          n: void 0,
          s: void 0
        }), R(() => u.value = e.value), u;
      }
    }), null), _(g, m(j, {
      get when() {
        var u;
        return ((u = e.validationMessage) == null ? void 0 : u.length) > 0;
      },
      get children() {
        return m(fe, {
          get each() {
            return e.validationMessage;
          },
          children: (u) => (() => {
            var b = zh(), y = b.firstChild, S = y.firstChild;
            return _(y, m(we, {
              get children() {
                return [m(ee, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return Kh();
                  }
                }), m(ee, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return Bh();
                  }
                })];
              }
            }), S), S.innerHTML = u, R((p) => te(y, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, p)), b;
          })()
        });
      }
    }), null), _(C, m(j, {
      get when() {
        return s();
      },
      get children() {
        var u = Dh(), b = u.firstChild;
        return b.firstChild, b.$$click = (y) => e.openRemark(e.component.dataKey), _(b, m(j, {
          get when() {
            return ue(() => !!e.comments)() && e.comments > 0;
          },
          get children() {
            var y = jh();
            return _(y, () => e.comments), y;
          }
        }), null), R(() => b.disabled = c()), u;
      }
    }), null), R(() => x.innerHTML = e.component.label), o;
  })();
};
ye(["click", "keyup"]);
var Fh = /* @__PURE__ */ k("<span class=text-pink-600>*"), Hh = /* @__PURE__ */ k('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Jh = /* @__PURE__ */ k('<div class="italic text-xs font-extralight text-zinc-400 ">'), Uh = /* @__PURE__ */ k('<div class="grid md:grid-cols-2 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm space-x-2 py-2.5 px-2 md:col-span-1 grid grid-cols-12"><div class=col-span-12>'), Wh = /* @__PURE__ */ k('<div class=mr-2><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), qh = /* @__PURE__ */ k('<div class=mr-2><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Gh = /* @__PURE__ */ k('<div class="text-xs font-light mt-1"><div class=flex><div>');
const Ot = (e) => {
  const [t, n] = K(!1), i = () => {
    t() ? n(!1) : n(!0);
  };
  return (() => {
    var r = Uh(), l = r.firstChild, a = l.firstChild, s = a.firstChild, c = a.nextSibling, o = l.nextSibling, d = o.firstChild;
    return _(a, m(j, {
      get when() {
        return e.component.required;
      },
      get children() {
        return Fh();
      }
    }), null), _(a, m(j, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var f = Hh();
        return f.$$click = i, f;
      }
    }), null), _(c, m(j, {
      get when() {
        return t();
      },
      get children() {
        var f = Jh();
        return R(() => f.innerHTML = e.component.hint), f;
      }
    }), null), _(c, () => e.optionSection, null), _(d, () => e.children, null), _(d, m(j, {
      get when() {
        var f;
        return ((f = e.validationMessage) == null ? void 0 : f.length) > 0;
      },
      get children() {
        return m(fe, {
          get each() {
            return e.validationMessage;
          },
          children: (f) => (() => {
            var x = Gh(), $ = x.firstChild, C = $.firstChild;
            return _($, m(we, {
              get children() {
                return [m(ee, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return Wh();
                  }
                }), m(ee, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return qh();
                  }
                })];
              }
            }), C), C.innerHTML = f, R((g) => te($, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, g)), x;
          })()
        });
      }
    }), null), R(() => s.innerHTML = e.component.label), r;
  })();
};
ye(["click"]);
const Yh = (e, t) => {
  if (t == null && (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) ? t = document.querySelector(".mobile-component-div") : t = document.querySelector(".component-div")), !t) return;
  const n = t.clientHeight / 2, i = e.offsetTop, r = t.clientWidth / 2, l = e.offsetLeft;
  (l > r || i > n) && t.scrollTo({
    top: i - n,
    left: l - r,
    behavior: "smooth"
  });
}, Qh = (e, t) => {
  let n = [];
  const i = [...t].sort((r, l) => l - r);
  if (t.includes(e))
    n.push(e);
  else {
    let r = e;
    for (let l = 0; l < i.length; l++)
      i[l] <= r && (n.push(i[l]), r -= i[l]);
    r !== 0 && (n = []);
  }
  return n;
}, Zh = (e) => e.reduce((t, n) => t + Number(n), 0), Mr = (e) => e.map((t, n) => Ct(Ae({}, t), {
  checkboxValue: Math.pow(2, n)
})), Qt = (e, t) => {
  if (t.config.clientMode == Mt.PAPI) {
    const n = t.isNestedInput ? e.target.offsetParent : e.target, i = t.isNestedInput ? document.querySelector(".nested-container") : null;
    t.setInput && t.setInput("currentDataKey", t.component.dataKey), Yh(n, i);
  }
}, Zt = (e, t) => {
  Xh(e);
}, Xh = (e, t) => {
  if (e.keyCode == 13) {
    if (e.shiftKey) {
      e.stopPropagation();
      return;
    }
    e.preventDefault();
    const n = Array.prototype.slice.call(document.querySelectorAll("input:not(:disabled),textarea:not(.hidden-input):not(:disabled)")), i = (n.indexOf(document.activeElement) + 1) % n.length, r = n[i];
    r.focus(), r.select();
  }
};
var eg = /* @__PURE__ */ k('<div class="grid font-light text-sm content-start">'), tg = /* @__PURE__ */ k('<div class=col-span-11><input type=text class="w-full font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400">'), ng = /* @__PURE__ */ k("<div class=col-span-11>"), ig = /* @__PURE__ */ k('<div class="font-light text-sm space-x-2 py-2.5 px-4 grid grid-cols-12"><div class="col-span-1 text-center"><label class="cursor-pointer text-sm"><input type=radio class="checked:disabled:bg-gray-500 checked:dark:disabled:bg-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"disabled>');
const rg = (e) => (() => {
  var t = eg();
  return _(t, m(fe, {
    get each() {
      return e.options;
    },
    children: (n, i) => (() => {
      var r = ig(), l = r.firstChild, a = l.firstChild, s = a.firstChild;
      return _(r, m(we, {
        get children() {
          return [m(ee, {
            get when() {
              return ue(() => !!n.open)() && e.settedValue === n.value;
            },
            get children() {
              var c = tg(), o = c.firstChild;
              return o.addEventListener("change", (d) => e.onValueChange(n.value, d.currentTarget.value, n.open)), o.addEventListener("focus", (d) => Qt(d, e)), o.$$keydown = (d) => Zt(d), R((d) => {
                var f = e.component.dataKey, x = e.component.dataKey, $ = e.disableInput;
                return f !== d.e && J(o, "name", d.e = f), x !== d.t && J(o, "id", d.t = x), $ !== d.a && (o.disabled = d.a = $), d;
              }, {
                e: void 0,
                t: void 0,
                a: void 0
              }), R(() => o.value = e.value && e.value.length > 0 ? e.value[0].label : n.label), c;
            }
          }), m(ee, {
            get when() {
              return !n.open || e.settedValue !== n.value;
            },
            get children() {
              var c = ng();
              return R(() => c.innerHTML = n.label), c;
            }
          })];
        }
      }), null), R((c) => {
        var o = e.component.dataKey + i(), d = e.component.dataKey, f = "radio-" + e.component.dataKey + "-" + i();
        return o !== c.e && J(a, "for", c.e = o), d !== c.t && J(s, "name", c.t = d), f !== c.a && J(s, "id", c.a = f), c;
      }, {
        e: void 0,
        t: void 0,
        a: void 0
      }), R(() => s.checked = e.settedValue === n.value), R(() => s.value = n.value), r;
    })()
  })), R((n) => {
    var i = e.component.cols === 1 || e.component.cols === void 0, r = e.component.cols === 2, l = e.component.cols === 3, a = e.component.cols === 4, s = e.component.cols === 5;
    return i !== n.e && t.classList.toggle("grid-cols-1", n.e = i), r !== n.t && t.classList.toggle("grid-cols-2", n.t = r), l !== n.a && t.classList.toggle("grid-cols-3", n.a = l), a !== n.o && t.classList.toggle("grid-cols-4", n.o = a), s !== n.i && t.classList.toggle("grid-cols-5", n.i = s), n;
  }, {
    e: void 0,
    t: void 0,
    a: void 0,
    o: void 0,
    i: void 0
  }), t;
})();
ye(["keydown"]);
var lg = /* @__PURE__ */ k("<input type=text class=formgear-input-papi placeholder>");
const ag = (e) => {
  const t = e.config, [n] = K(t.formMode > 1 ? !0 : e.component.disableInput);
  let i = (s) => {
    let c = String.fromCharCode(s.charCode ? s.charCode : s.which), o = e.component.separatorFormat === "id-ID" ? /^\d{1,99}(?:\,\d{0,10})?$/ : /^\d{1,99}(?:\.\d{0,10})?$/, d = document.getElementById("currencyInput" + e.index).value, f = l(d);
    o.test(f + c) || (s.preventDefault ? s.preventDefault() : s.returnValue = !1);
  }, r = Fi((s) => {
    let c = l(s), o = e.component.separatorFormat === "id-ID" ? c.replace(",", ".") : c;
    e.onValueChange(o);
  }, 1e3), l = (s) => {
    let c, o;
    return e.component.separatorFormat === "id-ID" ? (c = e.component.isDecimal ? s.indexOf(",00") != -1 ? s.substring(0, s.indexOf(",00")) : s : s.indexOf(",") != -1 ? s.substring(0, s.indexOf(",")) : s, o = "0123456789,") : e.component.separatorFormat === "en-US" && (c = e.component.isDecimal ? s.indexOf(".00") != -1 ? s.substring(0, s.indexOf(".00")) : s : s.indexOf(".") != -1 ? s.substring(0, s.indexOf(".")) : s, o = "0123456789."), Array.from(c).filter((d) => o.includes(d)).join("");
  }, a = Number(e.value).toLocaleString(e.component.separatorFormat, {
    style: "currency",
    currency: e.component.currency,
    minimumFractionDigits: 0
  });
  return m(Ot, {
    get component() {
      return e.component;
    },
    get classValidation() {
      return e.classValidation;
    },
    get validationMessage() {
      return e.validationMessage;
    },
    get children() {
      var s = lg();
      return s.$$keyup = (c) => r(c.currentTarget.value), s.addEventListener("keypress", (c) => i(c)), R((c) => {
        var o = e.component.dataKey, d = {
          ["formgear-input-papi-validation-" + e.classValidation]: !0
        }, f = n(), x = "currencyInput" + e.index, $ = e.component.rangeInput && e.component.rangeInput[0].max !== void 0 ? e.component.rangeInput[0].max : "", C = e.component.rangeInput && e.component.rangeInput[0].min !== void 0 ? e.component.rangeInput[0].min : "";
        return o !== c.e && J(s, "name", c.e = o), c.t = te(s, d, c.t), f !== c.a && (s.disabled = c.a = f), x !== c.o && J(s, "id", c.o = x), $ !== c.i && J(s, "max", c.i = $), C !== c.n && J(s, "min", c.n = C), c;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0,
        i: void 0,
        n: void 0
      }), R(() => s.value = e.component.separatorFormat === "id-ID" ? a.replace(",00", "") : a.replace("IDR", "Rp")), s;
    }
  });
};
ye(["keyup"]);
var ti = { exports: {} }, sg = ti.exports, Ir;
function og() {
  return Ir || (Ir = 1, (function(e, t) {
    (function(n, i) {
      e.exports = i();
    })(sg, (function() {
      var n = { LTS: "h:mm:ss A", LT: "h:mm A", L: "MM/DD/YYYY", LL: "MMMM D, YYYY", LLL: "MMMM D, YYYY h:mm A", LLLL: "dddd, MMMM D, YYYY h:mm A" }, i = /(\[[^[]*\])|([-_:/.,()\s]+)|(A|a|Q|YYYY|YY?|ww?|MM?M?M?|Do|DD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g, r = /\d/, l = /\d\d/, a = /\d\d?/, s = /\d*[^-_:/,()\s\d]+/, c = {}, o = function(u) {
        return (u = +u) + (u > 68 ? 1900 : 2e3);
      }, d = function(u) {
        return function(b) {
          this[u] = +b;
        };
      }, f = [/[+-]\d\d:?(\d\d)?|Z/, function(u) {
        (this.zone || (this.zone = {})).offset = (function(b) {
          if (!b || b === "Z") return 0;
          var y = b.match(/([+-]|\d\d)/g), S = 60 * y[1] + (+y[2] || 0);
          return S === 0 ? 0 : y[0] === "+" ? -S : S;
        })(u);
      }], x = function(u) {
        var b = c[u];
        return b && (b.indexOf ? b : b.s.concat(b.f));
      }, $ = function(u, b) {
        var y, S = c.meridiem;
        if (S) {
          for (var p = 1; p <= 24; p += 1) if (u.indexOf(S(p, 0, b)) > -1) {
            y = p > 12;
            break;
          }
        } else y = u === (b ? "pm" : "PM");
        return y;
      }, C = { A: [s, function(u) {
        this.afternoon = $(u, !1);
      }], a: [s, function(u) {
        this.afternoon = $(u, !0);
      }], Q: [r, function(u) {
        this.month = 3 * (u - 1) + 1;
      }], S: [r, function(u) {
        this.milliseconds = 100 * +u;
      }], SS: [l, function(u) {
        this.milliseconds = 10 * +u;
      }], SSS: [/\d{3}/, function(u) {
        this.milliseconds = +u;
      }], s: [a, d("seconds")], ss: [a, d("seconds")], m: [a, d("minutes")], mm: [a, d("minutes")], H: [a, d("hours")], h: [a, d("hours")], HH: [a, d("hours")], hh: [a, d("hours")], D: [a, d("day")], DD: [l, d("day")], Do: [s, function(u) {
        var b = c.ordinal, y = u.match(/\d+/);
        if (this.day = y[0], b) for (var S = 1; S <= 31; S += 1) b(S).replace(/\[|\]/g, "") === u && (this.day = S);
      }], w: [a, d("week")], ww: [l, d("week")], M: [a, d("month")], MM: [l, d("month")], MMM: [s, function(u) {
        var b = x("months"), y = (x("monthsShort") || b.map((function(S) {
          return S.slice(0, 3);
        }))).indexOf(u) + 1;
        if (y < 1) throw new Error();
        this.month = y % 12 || y;
      }], MMMM: [s, function(u) {
        var b = x("months").indexOf(u) + 1;
        if (b < 1) throw new Error();
        this.month = b % 12 || b;
      }], Y: [/[+-]?\d+/, d("year")], YY: [l, function(u) {
        this.year = o(u);
      }], YYYY: [/\d{4}/, d("year")], Z: f, ZZ: f };
      function g(u) {
        var b, y;
        b = u, y = c && c.formats;
        for (var S = (u = b.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g, (function(E, I, M) {
          var O = M && M.toUpperCase();
          return I || y[M] || n[M] || y[O].replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g, (function(N, T, A) {
            return T || A.slice(1);
          }));
        }))).match(i), p = S.length, L = 0; L < p; L += 1) {
          var V = S[L], v = C[V], h = v && v[0], w = v && v[1];
          S[L] = w ? { regex: h, parser: w } : V.replace(/^\[|\]$/g, "");
        }
        return function(E) {
          for (var I = {}, M = 0, O = 0; M < p; M += 1) {
            var N = S[M];
            if (typeof N == "string") O += N.length;
            else {
              var T = N.regex, A = N.parser, z = E.slice(O), D = T.exec(z)[0];
              A.call(I, D), E = E.replace(D, "");
            }
          }
          return (function(P) {
            var B = P.afternoon;
            if (B !== void 0) {
              var F = P.hours;
              B ? F < 12 && (P.hours += 12) : F === 12 && (P.hours = 0), delete P.afternoon;
            }
          })(I), I;
        };
      }
      return function(u, b, y) {
        y.p.customParseFormat = !0, u && u.parseTwoDigitYear && (o = u.parseTwoDigitYear);
        var S = b.prototype, p = S.parse;
        S.parse = function(L) {
          var V = L.date, v = L.utc, h = L.args;
          this.$u = v;
          var w = h[1];
          if (typeof w == "string") {
            var E = h[2] === !0, I = h[3] === !0, M = E || I, O = h[2];
            I && (O = h[2]), c = this.$locale(), !E && O && (c = y.Ls[O]), this.$d = (function(z, D, P, B) {
              try {
                if (["x", "X"].indexOf(D) > -1) return new Date((D === "X" ? 1e3 : 1) * z);
                var F = g(D)(z), U = F.year, H = F.month, ne = F.day, X = F.hours, oe = F.minutes, se = F.seconds, W = F.milliseconds, Y = F.zone, Q = F.week, G = /* @__PURE__ */ new Date(), le = ne || (U || H ? 1 : G.getDate()), _e = U || G.getFullYear(), me = 0;
                U && !H || (me = H > 0 ? H - 1 : G.getMonth());
                var Se, ve = X || 0, Ke = oe || 0, he = se || 0, Ce = W || 0;
                return Y ? new Date(Date.UTC(_e, me, le, ve, Ke, he, Ce + 60 * Y.offset * 1e3)) : P ? new Date(Date.UTC(_e, me, le, ve, Ke, he, Ce)) : (Se = new Date(_e, me, le, ve, Ke, he, Ce), Q && (Se = B(Se).week(Q).toDate()), Se);
              } catch (it) {
                return /* @__PURE__ */ new Date("");
              }
            })(V, w, v, y), this.init(), O && O !== !0 && (this.$L = this.locale(O).$L), M && V != this.format(w) && (this.$d = /* @__PURE__ */ new Date("")), c = {};
          } else if (w instanceof Array) for (var N = w.length, T = 1; T <= N; T += 1) {
            h[1] = w[T - 1];
            var A = y.apply(this, h);
            if (A.isValid()) {
              this.$d = A.$d, this.$L = A.$L, this.init();
              break;
            }
            T === N && (this.$d = /* @__PURE__ */ new Date(""));
          }
          else p.call(this, L);
        };
      };
    }));
  })(ti)), ti.exports;
}
var dg = og();
const Fl = /* @__PURE__ */ En(dg);
var cg = /* @__PURE__ */ k("<input type=text class=formgear-input-papi>");
vt.extend(Fl);
const ug = (e) => {
  const t = e.config, [n] = K(t.formMode > 1 ? !0 : e.component.disableInput), i = "DD/MM/YYYY", r = "99/99/9999", l = pi(r), s = {
    ref: void 0
  };
  let c = (d) => {
    d = vt(d, i, !0).format("YYYY-MM-DD"), e.onValueChange(d);
  }, o = e.value ? vt(e.value).format(i) : "";
  return m(Ot, {
    get component() {
      return e.component;
    },
    get classValidation() {
      return e.classValidation;
    },
    get validationMessage() {
      return e.validationMessage;
    },
    get children() {
      var d = cg();
      gt(d, "paste", l), gt(d, "input", l, !0), gt(d, "click", l, !0), d.addEventListener("change", (x) => c(x.currentTarget.value)), d.addEventListener("focus", (x) => Qt(x, e)), d.$$keydown = (x) => Zt(x);
      var f = s.ref;
      return typeof f == "function" ? en(f, d) : s.ref = d, d.value = o, R((x) => {
        var $ = "inputMask" + e.component.dataKey, C = {
          ["formgear-input-papi-validation-" + e.classValidation]: !0
        }, g = r.replace(/[a]/g, "__").replace(/[9]/g, "#"), u = n();
        return $ !== x.e && J(d, "id", x.e = $), x.t = te(d, C, x.t), g !== x.a && J(d, "placeholder", x.a = g), u !== x.o && (d.disabled = x.o = u), x;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0
      }), d;
    }
  });
};
ye(["keydown", "click", "input"]);
var hg = /* @__PURE__ */ k("<input type=text class=formgear-input-papi>");
vt.extend(Fl);
const gg = (e) => {
  const t = e.config, [n] = K(t.formMode > 1 ? !0 : e.component.disableInput), i = "DD/MM/YYYY HH:mm:ss", r = "99/99/9999 99:99:99", l = pi(r), s = {
    ref: void 0
  };
  let c = (d) => {
    d = vt(d, i, !0).format("YYYY-MM-DD HH:mm:ss"), e.onValueChange(d);
  }, o = e.value ? vt(e.value).format(i) : "";
  return m(Ot, {
    get component() {
      return e.component;
    },
    get classValidation() {
      return e.classValidation;
    },
    get validationMessage() {
      return e.validationMessage;
    },
    get children() {
      var d = hg();
      gt(d, "paste", l), gt(d, "input", l, !0), gt(d, "click", l, !0), d.addEventListener("change", (x) => c(x.currentTarget.value)), d.addEventListener("focus", (x) => Qt(x, e)), d.$$keydown = (x) => Zt(x);
      var f = s.ref;
      return typeof f == "function" ? en(f, d) : s.ref = d, d.value = o, R((x) => {
        var $ = "inputMask" + e.component.dataKey, C = {
          ["formgear-input-papi-validation-" + e.classValidation]: !0
        }, g = r.replace(/[a]/g, "__").replace(/[9]/g, "#"), u = n();
        return $ !== x.e && J(d, "id", x.e = $), x.t = te(d, C, x.t), g !== x.a && J(d, "placeholder", x.a = g), u !== x.o && (d.disabled = x.o = u), x;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0
      }), d;
    }
  });
};
ye(["keydown", "click", "input"]);
var fg = /* @__PURE__ */ k('<input type=text class="w-full border-gray-300 rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400">');
const vg = (e) => {
  const t = e.config, [n] = K(t.formMode > 1 ? !0 : e.component.disableInput), i = pi(e.component.maskingFormat), l = {
    ref: void 0
  };
  let a = (s) => {
    e.onValueChange(s);
  };
  return Me(() => {
    document.getElementById("inputMask" + e.component.dataKey).click();
  }), m(Ot, {
    get component() {
      return e.component;
    },
    get classValidation() {
      return e.classValidation;
    },
    get validationMessage() {
      return e.validationMessage;
    },
    get children() {
      var s = fg();
      gt(s, "paste", i), gt(s, "input", i, !0), gt(s, "click", i, !0), s.addEventListener("change", (o) => a(o.currentTarget.value));
      var c = l.ref;
      return typeof c == "function" ? en(c, s) : l.ref = s, R((o) => {
        var d = "inputMask" + e.component.dataKey, f = e.component.maskingFormat.replace(/[a]/g, "__").replace(/[9]/g, "#"), x = n();
        return d !== o.e && J(s, "id", o.e = d), f !== o.t && J(s, "placeholder", o.t = f), x !== o.a && (s.disabled = o.a = x), o;
      }, {
        e: void 0,
        t: void 0,
        a: void 0
      }), R(() => s.value = e.value), s;
    }
  });
};
ye(["click", "input"]);
var mg = /* @__PURE__ */ k('<div class="grid font-light text-sm content-start">'), bg = /* @__PURE__ */ k('<div class="font-light text-sm space-x-2 py-2.5 px-4 grid grid-cols-12"><div class=col-span-1><label class="cursor-pointer text-sm"><input class="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer checked:disabled:bg-gray-500 checked:dark:disabled:bg-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"type=checkbox disabled></label></div><div class=col-span-11><input type=text class="w-full font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none">'), wg = /* @__PURE__ */ k('<div class="font-light text-sm space-x-2 py-2.5 px-4 grid grid-cols-12"><div class=col-span-1><label class="cursor-pointer text-sm"><input class="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer checked:disabled:bg-gray-500 checked:dark:disabled:bg-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"type=checkbox disabled></label></div><div class=col-span-11>');
const xg = (e) => {
  const t = (i) => e.value ? !!e.value.some((r) => String(r.value) === String(i)) : !1, n = (i) => {
    let r = e.value.findIndex((l) => String(l.value) === String(i));
    return e.value[r].label;
  };
  return (() => {
    var i = mg();
    return _(i, m(fe, {
      get each() {
        return e.options;
      },
      children: (r, l) => m(we, {
        get children() {
          return [m(ee, {
            get when() {
              return ue(() => !!r.open)() && t(r.value);
            },
            get children() {
              var a = bg(), s = a.firstChild, c = s.firstChild, o = c.firstChild, d = s.nextSibling, f = d.firstChild;
              return f.addEventListener("change", (x) => e.onValueChange(r.value, x.currentTarget.value, r.open)), R((x) => {
                var $ = "chexbox" + l(), C = "checkbox-" + e.component.dataKey + "-" + l();
                return $ !== x.e && J(c, "for", x.e = $), C !== x.t && J(o, "id", x.t = C), x;
              }, {
                e: void 0,
                t: void 0
              }), R(() => o.value = r.value), R(() => o.checked = r.value ? t(r.value) : !1), R(() => f.value = n(r.value)), a;
            }
          }), m(ee, {
            get when() {
              return !r.open || !t(r.value);
            },
            get children() {
              var a = wg(), s = a.firstChild, c = s.firstChild, o = c.firstChild, d = s.nextSibling;
              return R((f) => {
                var x = "checkbox-" + e.component.dataKey + "-" + l(), $ = r.label;
                return x !== f.e && J(o, "id", f.e = x), $ !== f.t && (d.innerHTML = f.t = $), f;
              }, {
                e: void 0,
                t: void 0
              }), R(() => o.value = r.value), R(() => o.checked = r.value ? t(r.value) : !1), a;
            }
          })];
        }
      })
    })), R((r) => {
      var l = e.component.cols === 1 || e.component.cols === void 0, a = e.component.cols === 2, s = e.component.cols === 3, c = e.component.cols === 4, o = e.component.cols === 5;
      return l !== r.e && i.classList.toggle("grid-cols-1", r.e = l), a !== r.t && i.classList.toggle("grid-cols-2", r.t = a), s !== r.a && i.classList.toggle("grid-cols-3", r.a = s), c !== r.o && i.classList.toggle("grid-cols-4", r.o = c), o !== r.i && i.classList.toggle("grid-cols-5", r.i = o), r;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0
    }), i;
  })();
};
var Er = /* @__PURE__ */ k("<input type=text class=formgear-input-papi placeholder>");
const Or = (e) => {
  const [t] = It(), n = e.config, [i] = K(n.formMode > 1 ? !0 : e.component.disableInput);
  let r = Ee(() => {
    if (e.component.sourceOption !== void 0 && e.component.typeOption === 3) {
      let d = e.component.sourceOption.split("@");
      const f = t.details.findIndex((x) => x.dataKey === d[0]);
      return t.details[f].type, t.details[f].answer;
    }
    return [];
  });
  const [l] = K(e.component.sourceOption !== void 0 ? r() : e.component.options);
  let a = (d, f, x) => {
    let $;
    if (x == null) {
      const C = Mr(l()), g = C.map((b) => Number(b.checkboxValue)), u = Qh(Number(d), g);
      u.length > 0 && ($ = C.filter((b) => u.includes(Number(b.checkboxValue))).map((b) => (delete b.checkboxValue, b)));
    } else if ($ = JSON.parse(JSON.stringify(s())), $)
      if (e.value.some((C) => String(C.value) === String(d)))
        if (x) {
          let C = l().findIndex((g) => g.value == d);
          $ = $.filter((g) => g.value != d), l()[C].label !== f && $.push({
            value: d,
            label: f
          });
        } else
          $ = $.filter((C) => C.value != d);
      else
        $.splice($.length, 0, {
          value: d,
          label: f
        });
    else
      $ = [], $.push({
        value: d,
        label: f
      });
    e.onValueChange($);
  };
  const s = Ee(() => {
    var d;
    return ((d = e.value) == null ? void 0 : d.length) > 0 ? Mr(l()).filter((f) => e.value.find((x) => f.value === x.value)) : [];
  }), c = Ee(() => {
    var d;
    return ((d = e.value) == null ? void 0 : d.length) > 0 ? Zh(s().map((f) => f.checkboxValue)) : e.value;
  });
  return m(Ot, {
    get validationMessage() {
      return e.validationMessage;
    },
    get component() {
      return e.component;
    },
    optionSection: () => m(xg, {
      get component() {
        return e.component;
      },
      get options() {
        return l();
      },
      get settedValue() {
        return c();
      },
      onValueChange: a,
      get disableInput() {
        return i();
      },
      get value() {
        return e.value;
      }
    }),
    get children() {
      return [m(j, {
        get when() {
          return e.component.lengthInput === void 0;
        },
        get children() {
          var d = Er();
          return d.$$keydown = (f) => Zt(f), d.addEventListener("focus", (f) => Qt(f, e)), d.addEventListener("change", (f) => {
            a(f.currentTarget.value);
          }), R((f) => {
            var x = e.component.dataKey, $ = {
              ["formgear-input-papi-validation-" + e.classValidation]: !0
            }, C = i();
            return x !== f.e && J(d, "name", f.e = x), f.t = te(d, $, f.t), C !== f.a && (d.disabled = f.a = C), f;
          }, {
            e: void 0,
            t: void 0,
            a: void 0
          }), R(() => d.value = c()), d;
        }
      }), m(j, {
        get when() {
          return ue(() => e.component.lengthInput !== void 0)() && e.component.lengthInput.length > 0;
        },
        get children() {
          var d = Er();
          return d.$$keydown = (f) => Zt(f), d.addEventListener("focus", (f) => Qt(f, e)), d.addEventListener("change", (f) => {
            e.onValueChange(f.currentTarget.value);
          }), R((f) => {
            var x = e.component.dataKey, $ = {
              ["formgear-input-papi-validation-" + e.classValidation]: !0
            }, C = i(), g = e.component.lengthInput[0].maxlength !== void 0 ? e.component.lengthInput[0].maxlength : "", u = e.component.lengthInput[0].minlength !== void 0 ? e.component.lengthInput[0].minlength : "";
            return x !== f.e && J(d, "name", f.e = x), f.t = te(d, $, f.t), C !== f.a && (d.disabled = f.a = C), g !== f.o && J(d, "maxlength", f.o = g), u !== f.i && J(d, "minlength", f.i = u), f;
          }, {
            e: void 0,
            t: void 0,
            a: void 0,
            o: void 0,
            i: void 0
          }), R(() => d.value = c()), d;
        }
      })];
    }
  });
};
ye(["keydown"]);
var yg = /* @__PURE__ */ k("<input type=number class=formgear-input-papi placeholder>"), pg = /* @__PURE__ */ k('<input type=number class=formgear-input-papi placeholder oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);">');
const kg = (e) => {
  const t = e.config, [n] = K(t.formMode > 1 ? !0 : e.component.disableInput);
  return m(Ot, {
    get validationMessage() {
      return e.validationMessage;
    },
    get classValidation() {
      return e.classValidation;
    },
    get component() {
      return e.component;
    },
    get children() {
      return [m(j, {
        get when() {
          return e.component.lengthInput === void 0;
        },
        get children() {
          var i = yg();
          return i.$$keydown = (r) => Zt(r), i.addEventListener("focus", (r) => Qt(r, e)), i.addEventListener("change", (r) => {
            e.onValueChange(r.currentTarget.value);
          }), R((r) => {
            var l = e.component.dataKey, a = {
              ["formgear-input-papi-validation-" + e.classValidation]: !0
            }, s = n();
            return l !== r.e && J(i, "name", r.e = l), r.t = te(i, a, r.t), s !== r.a && (i.disabled = r.a = s), r;
          }, {
            e: void 0,
            t: void 0,
            a: void 0
          }), R(() => i.value = e.value), i;
        }
      }), m(j, {
        get when() {
          return ue(() => e.component.lengthInput !== void 0)() && e.component.lengthInput.length > 0;
        },
        get children() {
          var i = pg();
          return i.$$keydown = (r) => Zt(r), i.addEventListener("focus", (r) => Qt(r, e)), i.addEventListener("change", (r) => {
            e.onValueChange(r.currentTarget.value);
          }), R((r) => {
            var l = e.component.dataKey, a = {
              ["formgear-input-papi-validation-" + e.classValidation]: !0
            }, s = n(), c = e.component.lengthInput[0].maxlength !== void 0 ? e.component.lengthInput[0].maxlength : "", o = e.component.lengthInput[0].minlength !== void 0 ? e.component.lengthInput[0].minlength : "", d = e.component.rangeInput && e.component.rangeInput[0].max !== void 0 ? e.component.rangeInput[0].max : "", f = e.component.rangeInput && e.component.rangeInput[0].min !== void 0 ? e.component.rangeInput[0].min : "";
            return l !== r.e && J(i, "name", r.e = l), r.t = te(i, a, r.t), s !== r.a && (i.disabled = r.a = s), c !== r.o && J(i, "maxlength", r.o = c), o !== r.i && J(i, "minlength", r.i = o), d !== r.n && J(i, "max", r.n = d), f !== r.s && J(i, "min", r.s = f), r;
          }, {
            e: void 0,
            t: void 0,
            a: void 0,
            o: void 0,
            i: void 0,
            n: void 0,
            s: void 0
          }), R(() => i.value = e.value), i;
        }
      })];
    }
  });
};
ye(["keydown"]);
var $g = /* @__PURE__ */ k('<input type=file accept=image/* class="hidden w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"style=color:transparent>'), _g = /* @__PURE__ */ k('<button class="formgear-input-papi flex"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5 mr-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z">'), Sg = /* @__PURE__ */ k('<div class="font-light text-sm space-x-2 py-2.5 px-2 col-span-12 space-y-4"><div class=preview-class><div class="container mx-auto"><img class=rounded-md style=width:100%;height:100%>');
const Cg = (e) => {
  const [t] = Et(), [n, i] = K(""), [r, l] = K(""), [a] = K(e.config.formMode > 1 ? !0 : e.component.disableInput);
  let s = new FileReader();
  Me(() => {
    if (i(e.component.label), e.value[0]) {
      let o = e.value[0].value;
      l(o);
    }
  });
  let c = (o) => {
    let d = JSON.parse(JSON.stringify(e.value));
    if (o.target.files && o.target.files[0]) {
      var f = ["jpeg", "jpg", "png", "gif"];
      let x = o.target.files[0], $ = x.name.split(".").pop().toLowerCase();
      f.includes($) ? (s.readAsDataURL(x), s.onload = (C) => {
        var g = x.name;
        d = [], URL.createObjectURL(x), d.push({
          value: C.target.result,
          label: g,
          type: o.target.files[0].type
        }), e.onValueChange(d), jn("Image uploaded successfully!");
      }) : ke("Please submit the appropriate format!");
    }
  };
  return m(Ot, {
    get component() {
      return e.component;
    },
    get classValidation() {
      return e.classValidation;
    },
    get validationMessage() {
      return e.validationMessage;
    },
    get children() {
      return [(() => {
        var o = $g();
        return o.addEventListener("change", (d) => {
          c(d);
        }), R((d) => {
          var f = "inputFile_" + e.component.dataKey, x = e.component.dataKey;
          return f !== d.e && J(o, "id", d.e = f), x !== d.t && J(o, "name", d.t = x), d;
        }, {
          e: void 0,
          t: void 0
        }), o;
      })(), (() => {
        var o = _g();
        return o.firstChild, o.$$click = (d) => {
          document.getElementById("inputFile_" + e.component.dataKey).click();
        }, _(o, () => t.details.language[0].uploadImage, null), R((d) => {
          var f = {
            ["formgear-input-papi-validation-" + e.classValidation]: !0
          }, x = a(), $ = t.details.language[0].uploadImage;
          return d.e = te(o, f, d.e), x !== d.t && (o.disabled = d.t = x), $ !== d.a && J(o, "title", d.a = $), d;
        }, {
          e: void 0,
          t: void 0,
          a: void 0
        }), o;
      })(), m(j, {
        get when() {
          return r() != "";
        },
        get children() {
          var o = Sg(), d = o.firstChild, f = d.firstChild, x = f.firstChild;
          return R(($) => {
            var C = r(), g = "img-preview" + e.component.dataKey;
            return C !== $.e && J(x, "src", $.e = C), g !== $.t && J(x, "id", $.t = g), $;
          }, {
            e: void 0,
            t: void 0
          }), o;
        }
      })];
    }
  });
};
ye(["click"]);
var Mg = /* @__PURE__ */ k("<input type=number class=formgear-input-papi>");
const Ig = (e) => {
  const t = e.config, [n] = K(t.formMode > 1 ? !0 : e.component.disableInput);
  return m(Ot, {
    get component() {
      return e.component;
    },
    get classValidation() {
      return e.classValidation;
    },
    get validationMessage() {
      return e.validationMessage;
    },
    get children() {
      var i = Mg();
      return i.addEventListener("change", (r) => e.onValueChange(r.currentTarget.value)), R((r) => {
        var l = {
          ["formgear-input-papi-validation-" + e.classValidation]: !0
        }, a = e.component.rangeInput[0].min, s = e.component.rangeInput[0].max, c = e.component.rangeInput[0].step, o = n();
        return r.e = te(i, l, r.e), a !== r.t && J(i, "min", r.t = a), s !== r.a && J(i, "max", r.a = s), c !== r.o && J(i, "step", r.o = c), o !== r.i && (i.disabled = r.i = o), r;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0,
        i: void 0
      }), R(() => i.value = e.value || 0), i;
    }
  });
};
var Lr = /* @__PURE__ */ k("<input type=text class=formgear-input-papi placeholder>");
const Ar = (e) => {
  const [t] = It(), n = e.config, [i] = K(n.formMode > 1 ? !0 : e.component.disableInput);
  let r = e.value && e.value.length > 0 ? e.value[0].value : e.value, l = (o, d) => {
    var x;
    let f = [];
    d == null && (d = (x = s().find(($) => $.value == o)) == null ? void 0 : x.label), f = [{
      value: o,
      label: d
    }], e.onValueChange([...f]);
  }, a = Ee(() => {
    if (e.component.sourceOption !== void 0 && e.component.typeOption === 3) {
      let o = e.component.sourceOption.split("@");
      const d = t.details.findIndex((f) => f.dataKey === o[0]);
      return t.details[d].type, t.details[d].answer;
    }
    return [];
  });
  const [s] = K(e.component.sourceOption !== void 0 ? a() : e.component.options);
  return m(Ot, {
    get classValidation() {
      return e.classValidation;
    },
    get validationMessage() {
      return e.validationMessage;
    },
    get component() {
      return e.component;
    },
    optionSection: () => m(rg, {
      get component() {
        return e.component;
      },
      get options() {
        return s();
      },
      settedValue: r,
      onValueChange: l,
      get disableInput() {
        return i();
      },
      get value() {
        return e.value;
      }
    }),
    get children() {
      return [m(j, {
        get when() {
          return e.component.lengthInput === void 0;
        },
        get children() {
          var o = Lr();
          return o.$$keydown = (d) => Zt(d), o.addEventListener("focus", (d) => Qt(d, e)), o.addEventListener("change", (d) => {
            l(d.currentTarget.value);
          }), o.value = r, R((d) => {
            var f = e.component.dataKey, x = {
              ["formgear-input-papi-validation-" + e.classValidation]: !0
            }, $ = i();
            return f !== d.e && J(o, "name", d.e = f), d.t = te(o, x, d.t), $ !== d.a && (o.disabled = d.a = $), d;
          }, {
            e: void 0,
            t: void 0,
            a: void 0
          }), o;
        }
      }), m(j, {
        get when() {
          return ue(() => e.component.lengthInput !== void 0)() && e.component.lengthInput.length > 0;
        },
        get children() {
          var o = Lr();
          return o.$$keydown = (d) => Zt(d), o.addEventListener("focus", (d) => Qt(d, e)), o.addEventListener("change", (d) => {
            e.onValueChange(d.currentTarget.value);
          }), o.value = r, R((d) => {
            var f = e.component.dataKey, x = {
              ["formgear-input-papi-validation-" + e.classValidation]: !0
            }, $ = i(), C = e.component.lengthInput[0].maxlength !== void 0 ? e.component.lengthInput[0].maxlength : "", g = e.component.lengthInput[0].minlength !== void 0 ? e.component.lengthInput[0].minlength : "";
            return f !== d.e && J(o, "name", d.e = f), d.t = te(o, x, d.t), $ !== d.a && (o.disabled = d.a = $), C !== d.o && J(o, "maxlength", d.o = C), g !== d.i && J(o, "minlength", d.i = g), d;
          }, {
            e: void 0,
            t: void 0,
            a: void 0,
            o: void 0,
            i: void 0
          }), o;
        }
      })];
    }
  });
};
ye(["keydown"]);
var Rr = /* @__PURE__ */ k("<textarea class=formgear-input-papi>");
const Eg = (e) => {
  const t = e.config, [n] = K(t.formMode > 1 ? !0 : e.component.disableInput);
  return m(Ot, {
    get component() {
      return e.component;
    },
    get classValidation() {
      return e.classValidation;
    },
    get validationMessage() {
      return e.validationMessage;
    },
    get children() {
      return [m(j, {
        get when() {
          return e.component.lengthInput === void 0;
        },
        get children() {
          var i = Rr();
          return i.addEventListener("change", (r) => {
            e.onValueChange(r.currentTarget.value);
          }), R((r) => {
            var l = e.component.rows || 2, a = {
              ["formgear-input-papi-validation-" + e.classValidation]: !0
            }, s = n();
            return l !== r.e && J(i, "rows", r.e = l), r.t = te(i, a, r.t), s !== r.a && (i.disabled = r.a = s), r;
          }, {
            e: void 0,
            t: void 0,
            a: void 0
          }), R(() => i.value = e.value), i;
        }
      }), m(j, {
        get when() {
          return ue(() => e.component.lengthInput !== void 0)() && e.component.lengthInput.length > 0;
        },
        get children() {
          var i = Rr();
          return i.addEventListener("change", (r) => {
            e.onValueChange(r.currentTarget.value);
          }), R((r) => {
            var l = e.component.rows || 2, a = {
              ["formgear-input-papi-validation-" + e.classValidation]: !0
            }, s = n(), c = e.component.lengthInput[0].maxlength !== void 0 ? e.component.lengthInput[0].maxlength : "", o = e.component.lengthInput[0].minlength !== void 0 ? e.component.lengthInput[0].minlength : "";
            return l !== r.e && J(i, "rows", r.e = l), r.t = te(i, a, r.t), s !== r.a && (i.disabled = r.a = s), c !== r.o && J(i, "maxlength", r.o = c), o !== r.i && J(i, "minlength", r.i = o), r;
          }, {
            e: void 0,
            t: void 0,
            a: void 0,
            o: void 0,
            i: void 0
          }), R(() => i.value = e.value), i;
        }
      })];
    }
  });
};
var Nr = /* @__PURE__ */ k("<input type=text class=formgear-input-papi placeholder>"), Og = /* @__PURE__ */ k('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), Lg = /* @__PURE__ */ k('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Ag = /* @__PURE__ */ k('<div class="text-xs font-light mt-1"><div class="grid grid-cols-12"><div class="col-span-11 text-justify mr-1">');
const Rg = (e) => {
  const t = e.config, [n] = K(t.formMode > 1 && t.initialMode == 2 ? !0 : t.initialMode == 1 && e.component.disableInitial !== void 0 ? e.component.disableInitial : e.component.disableInput);
  return m(Ot, {
    get component() {
      return e.component;
    },
    get children() {
      return [m(j, {
        get when() {
          return e.component.lengthInput === void 0;
        },
        get children() {
          var i = Nr();
          return i.addEventListener("change", (r) => {
            e.onValueChange(r.currentTarget.value);
          }), R((r) => {
            var l = e.component.dataKey, a = {
              ["formgear-input-papi-validation-" + e.classValidation]: !0
            }, s = n();
            return l !== r.e && J(i, "name", r.e = l), r.t = te(i, a, r.t), s !== r.a && (i.disabled = r.a = s), r;
          }, {
            e: void 0,
            t: void 0,
            a: void 0
          }), R(() => i.value = e.value), i;
        }
      }), m(j, {
        get when() {
          return ue(() => e.component.lengthInput !== void 0)() && e.component.lengthInput.length > 0;
        },
        get children() {
          var i = Nr();
          return i.addEventListener("change", (r) => {
            e.onValueChange(r.currentTarget.value);
          }), R((r) => {
            var l = e.component.dataKey, a = {
              ["formgear-input-papi-validation-" + e.classValidation]: !0
            }, s = n(), c = e.component.lengthInput[0].maxlength !== void 0 ? e.component.lengthInput[0].maxlength : "", o = e.component.lengthInput[0].minlength !== void 0 ? e.component.lengthInput[0].minlength : "";
            return l !== r.e && J(i, "name", r.e = l), r.t = te(i, a, r.t), s !== r.a && (i.disabled = r.a = s), c !== r.o && J(i, "maxlength", r.o = c), o !== r.i && J(i, "minlength", r.i = o), r;
          }, {
            e: void 0,
            t: void 0,
            a: void 0,
            o: void 0,
            i: void 0
          }), R(() => i.value = e.value), i;
        }
      }), m(j, {
        get when() {
          var i;
          return ((i = e.validationMessage) == null ? void 0 : i.length) > 0;
        },
        get children() {
          return m(fe, {
            get each() {
              return e.validationMessage;
            },
            children: (i) => (() => {
              var r = Ag(), l = r.firstChild, a = l.firstChild;
              return _(l, m(we, {
                get children() {
                  return [m(ee, {
                    get when() {
                      return e.classValidation === 1;
                    },
                    get children() {
                      return Og();
                    }
                  }), m(ee, {
                    get when() {
                      return e.classValidation === 2;
                    },
                    get children() {
                      return Lg();
                    }
                  })];
                }
              }), a), a.innerHTML = i, R((s) => te(l, {
                " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
                " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
              }, s)), r;
            })()
          });
        }
      })];
    }
  });
};
var Ng = /* @__PURE__ */ k('<input type=number class="formgear-input-papi block pr-20"placeholder>'), Vg = /* @__PURE__ */ k('<input type=number class="formgear-input-papi block pr-20"placeholder oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);">'), Tg = /* @__PURE__ */ k('<div class=relative><div class="absolute inset-y-0 right-0 flex items-center">');
const jg = (e) => {
  const [t] = It(), [n] = Et(), i = e.config, [r] = K(i.formMode > 1 ? !0 : e.component.disableInput), [l, a] = K(""), [s, c] = K(!1), [o, d] = K([]), [f, x] = K(""), $ = !1;
  let C = (g, u, b) => {
    if (b == 2 && u.value != "" && u.value != null) {
      let y = JSON.parse(JSON.stringify(e.value));
      y = [], y.push({
        value: g,
        unit: u
      }), e.onValueChange(y);
    } else {
      let y = JSON.parse(JSON.stringify(e.value));
      y = [], y.push({
        value: g,
        unit: u
      }), e.onValueChange(y);
    }
  };
  switch (e.component.typeOption) {
    case 1: {
      try {
        let g = e.component.options.map((b, y) => ({
          value: b.value,
          label: b.label
        })), u = e.value && e.value != "" && e.value[0].unit && e.value[0].unit.value && e.value[0].unit.value != "" ? e.value[0].unit.value : "";
        Me(() => {
          a(e.component.label), d(g);
          let b = g.filter((y) => y.value.includes(u))[0] && u != "" ? g.filter((y) => y.value.includes(u))[0].label : "Select Unit";
          x(b), c(!0);
        });
      } catch (g) {
        ke(n.details.language[0].fetchFailed);
      }
      break;
    }
    case 2: {
      try {
        if (i.lookupMode === 1) {
          let g, u, b, y;
          $ || (u = e.component.sourceSelect, g = `${i.baseUrl}/${u[0].id}/filter?version=${u[0].version}`, u[0].parentCondition.length > 0 && (b = g, y = u[0].parentCondition.map((L, V) => {
            let v = L.value.split("@"), h = t.details.find((w) => w.dataKey == v[0]);
            if (h.answer) {
              if (h.answer.length > 0) {
                let w = encodeURI(h.answer[h.answer.length - 1].value);
                g = `${i.lookupKey}=${L.key}&${i.lookupValue}=${w}`;
              }
            } else
              g = `${i.lookupKey}=${L.key}&${i.lookupValue}=''`;
            return g;
          }).join("&"), g = `${b}&${y}`));
          const [S] = Dn(g, e.MobileOnlineSearch);
          let p = e.value && e.value != "" && e.value[0].unit && e.value[0].unit.value && e.value[0].unit.value != "" ? e.value[0].unit.value : "";
          Me(() => {
            if (a(e.component.label), S())
              if (!S().success)
                ke(n.details.language[0].fetchFailed);
              else {
                let L;
                if (!$) {
                  L = [];
                  let v = u[0].value, h = u[0].desc;
                  S().data.map((w, E) => {
                    L.push({
                      value: w[v],
                      label: w[h]
                    });
                  });
                }
                let V = L.find((v) => v.value == p) && p != "" ? L.find((v) => v.value == p).label : "Select Unit";
                d(L), x(V), c(!0);
              }
          });
        } else if (i.lookupMode === 2) {
          let g, u = [];
          g = e.component.sourceSelect;
          let b = g[0].id, y = g[0].version;
          g[0].parentCondition.length > 0 && g[0].parentCondition.map((L, V) => {
            let v = L.value.split("@"), h = t.details.find((w) => w.dataKey == v[0]);
            if (h.answer && h.answer.length > 0) {
              let w = h.answer[h.answer.length - 1].value.toString();
              u.push({
                key: L.key,
                value: w
              });
            }
          });
          let S = (L) => {
            let V = [];
            if (L.data.length > 0) {
              let v = g[0].value, h = g[0].desc, w = e.value && e.value != "" && e.value[0].unit && e.value[0].unit.value && e.value[0].unit.value != "" ? e.value[0].unit.value : "";
              L.data.map((I, M) => {
                V.push({
                  value: I[v],
                  label: I[h]
                });
              });
              let E = V.find((I) => I.value == w) && w != "" ? V.find((I) => I.value == w).label : "Select Unit";
              a(e.component.label), d(V), x(E), c(!0);
            }
          };
          const p = e.MobileOfflineSearch(b, y, u, S);
        }
      } catch (g) {
        ke(n.details.language[0].fetchFailed);
      }
      break;
    }
    case 3: {
      try {
        let g, u, b = e.value && e.value != "" && e.value[0].unit && e.value[0].unit.value && e.value[0].unit.value != "" ? e.value[0].unit.value : "";
        if (e.component.sourceOption !== void 0 && e.component.typeOption === 3) {
          const S = t.details.findIndex((p) => p.dataKey === e.component.sourceOption);
          t.details[S].type, g = t.details[S].answer, g != null ? u = g.filter((p, L) => p.value != 0).map((p, L) => ({
            value: p.value,
            label: p.label
          })) : u = [];
        }
        let y = u.find((S) => S.value == b) && b != "" ? u.find((S) => S.value == b).label : "Select Unit";
        Me(() => {
          a(e.component.label), d(u), x(y), c(!0);
        });
      } catch (g) {
        ke(n.details.language[0].fetchFailed);
      }
      break;
    }
    default: {
      try {
        let g;
        e.component.options ? g = e.component.options.map((b, y) => ({
          value: b.value,
          label: b.label
        })) : g = [];
        let u = e.value && e.value != "" && e.value[0].unit && e.value[0].unit.value && e.value[0].unit.value != "" ? e.value[0].unit.value : "";
        Me(() => {
          a(e.component.label), d(g);
          let b = g.filter((y) => y.value.includes(u))[0] && u != "" ? g.filter((y) => y.value.includes(u))[0].label : "Select Unit";
          x(b), c(!0);
        });
      } catch (g) {
        ke(n.details.language[0].fetchFailed);
      }
      break;
    }
  }
  return m(Ot, {
    get component() {
      return e.component;
    },
    get classValidation() {
      return e.classValidation;
    },
    get validationMessage() {
      return e.validationMessage;
    },
    get children() {
      var g = Tg(), u = g.firstChild;
      return _(g, m(j, {
        get when() {
          return e.component.lengthInput === void 0;
        },
        get children() {
          var b = Ng();
          return b.addEventListener("change", (y) => {
            C(y ? y.currentTarget.value : "", e.value != null && e.value != "" ? e.value[0].unit ? e.value[0].unit : {
              value: "",
              label: ""
            } : {
              value: "",
              label: ""
            }, 1);
          }), R((y) => {
            var S = e.component.dataKey, p = {
              ["formgear-input-papi-validation-" + e.classValidation]: !0
            }, L = r();
            return S !== y.e && J(b, "name", y.e = S), y.t = te(b, p, y.t), L !== y.a && (b.disabled = y.a = L), y;
          }, {
            e: void 0,
            t: void 0,
            a: void 0
          }), R(() => b.value = e.value != null && e.value != "" ? e.value[0].value : ""), b;
        }
      }), u), _(g, m(j, {
        get when() {
          return ue(() => e.component.lengthInput !== void 0)() && e.component.lengthInput.length > 0;
        },
        get children() {
          var b = Vg();
          return b.addEventListener("change", (y) => {
            C(y ? y.currentTarget.value : "", e.value != null && e.value != "" ? e.value[0].unit ? e.value[0].unit : {
              value: "",
              label: ""
            } : {
              value: "",
              label: ""
            }, 1);
          }), R((y) => {
            var S = e.component.dataKey, p = {
              ["formgear-input-papi-validation-" + e.classValidation]: !0
            }, L = r(), V = e.component.lengthInput[0].maxlength !== void 0 ? e.component.lengthInput[0].maxlength : "", v = e.component.lengthInput[0].minlength !== void 0 ? e.component.lengthInput[0].minlength : "", h = e.component.rangeInput && e.component.rangeInput[0].max !== void 0 ? e.component.rangeInput[0].max : "", w = e.component.rangeInput && e.component.rangeInput[0].min !== void 0 ? e.component.rangeInput[0].min : "";
            return S !== y.e && J(b, "name", y.e = S), y.t = te(b, p, y.t), L !== y.a && (b.disabled = y.a = L), V !== y.o && J(b, "maxlength", y.o = V), v !== y.i && J(b, "minlength", y.i = v), h !== y.n && J(b, "max", y.n = h), w !== y.s && J(b, "min", y.s = w), y;
          }, {
            e: void 0,
            t: void 0,
            a: void 0,
            o: void 0,
            i: void 0,
            n: void 0,
            s: void 0
          }), R(() => b.value = e.value != null && e.value != "" ? e.value[0].value : ""), b;
        }
      }), u), _(u, m(Mn, jt({
        class: "formgear-select-unit  w-full rounded font-light text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-0 border-transparent focus:outline-none  disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
      }, () => Cn(o() || [], {
        key: "label",
        filterable: !0
      }), {
        get disabled() {
          return r();
        },
        placeholder: "Unit",
        onChange: (b) => C(e.value != null && e.value != "" ? e.value[0].value : "", {
          value: b ? b.value : "",
          label: b ? b.label : ""
        }, 2),
        get initialValue() {
          return {
            value: e.value && e.value != "" && e.value[0].unit && e.value[0].unit.value && e.value[0].unit.value != "" ? e.value[0].unit.value : "",
            label: f
          };
        }
      })), null), _(u, m(Bl, {
        size: 20,
        class: "text-gray-400  mr-3"
      }), null), g;
    }
  });
}, Dg = /* @__PURE__ */ new Map([[2, _l], [25, js], [26, Ms], [27, Do], [28, Yo], [29, od], [30, wd], [31, Cl], [19, Ml], [11, Ud], [12, nc], [13, Il], [14, El], [15, Ol], [16, Ll], [17, Al], [18, Xc], [3, Rl], [20, uu], [21, Nl], [22, Vl], [23, Hu], [24, i0], [4, Tl], [32, x0], [33, jl], [34, Dl], [35, Pl], [36, Kl], [37, Lh], [38, zl]]), Pg = /* @__PURE__ */ new Map([[2, _l], [25, Rg], [26, Ar], [27, Ar], [28, kg], [29, Or], [30, Eg], [31, Cl], [19, Ml], [11, ug], [12, gg], [13, Il], [14, El], [15, Ol], [16, Ll], [17, Al], [18, Ig], [3, Rl], [20, ag], [21, Nl], [22, Vl], [23, Or], [24, vg], [4, Tl], [32, Cg], [33, jl], [34, Dl], [35, Pl], [36, Kl], [37, jg], [38, zl]]), Hl = Pn(), Jl = Pn(), Kg = {
  loader: []
};
function Bg(e) {
  const [t, n] = Bi(Kg);
  function i() {
    n("loader", gr((l) => {
      l.push({
        id: 1
      });
    }));
  }
  const r = (l) => () => {
    n("loader", gr((a) => {
      const s = a.findIndex((c) => c.id === l);
      s > -1 && a.splice(s, 1);
    }));
  };
  return m(Hl.Provider, {
    value: t,
    get children() {
      return m(Jl.Provider, {
        value: {
          setLoader: i,
          removeLoader: r
        },
        get children() {
          return e.children;
        }
      });
    }
  });
}
const zg = () => Kn(Hl), Ji = () => Kn(Jl);
var Fg = /* @__PURE__ */ k('<div class="modal-loading fixed z-10 inset-0 overflow-y-auto"aria-labelledby=modal-title role=dialog aria-modal=true><div class="flex items-center justify-center min-h-screen pt-4 px-4 text-center sm:block sm:p-0"><div class="fixed inset-0 bg-gray-500/75 transition-opacity"aria-hidden=true></div><span class="hidden sm:inline-block sm:align-middle sm:h-screen"aria-hidden=true>&#8203;</span><div class="relative inline-block overflow-hidden transform transition-all items-center"><svg class="animate-spin h-16 w-16 text-zinc-300"xmlns=http://www.w3.org/2000/svg fill=none viewBox="0 0 24 24"><circle class=opacity-25 cx=12 cy=12 r=10 stroke=currentColor stroke-width=4></circle><path class=opacity-75 fill=currentColor d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">'), Hg = /* @__PURE__ */ k('<div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4"><div class="grid grid-cols-8"><div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full text-yellow-400 bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10"><svg xmlns=http://www.w3.org/2000/svg class="h-6 w-6 "fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path></svg></div><div class="mt-1 text-left col-span-7 "><textarea rows=2 class="w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 border border-solid border-gray-300 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"placeholder>'), Jg = /* @__PURE__ */ k('<div class="bg-white px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"><button type=button class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">&nbsp;&nbsp;Save&nbsp;&nbsp;</button><button type=button class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Cancel'), Ug = /* @__PURE__ */ k('<div class="bg-white px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"><button type=button class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Close'), Wg = /* @__PURE__ */ k('<div class="modal-remark fixed z-10 inset-0 overflow-y-auto"aria-labelledby=modal-title role=dialog aria-modal=true><div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"><div class="fixed inset-0 bg-gray-500/75 transition-opacity"aria-hidden=true></div><span class="hidden sm:inline-block sm:align-middle sm:h-screen"aria-hidden=true>&#8203;</span><div class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"><div class="bg-gray-50 p-8 space-y-5">'), qg = /* @__PURE__ */ k("<div><div>"), Gg = /* @__PURE__ */ k('<div class="bg-white p-4 grid grid-cols-8 rounded-lg"><div class="text-xs font-normal text-gray-400 col-span-5"></div><div class="text-xs font-light text-indigo-700 col-span-3 text-right italic"></div><div class="text-xs text-gray-700 py-2 -mb-2 col-span-12 text-justify">');
const Yg = (e) => {
  const t = Bt(), [n, {
    setActiveComponent: i
  }] = gl(), {
    setLoader: r,
    removeLoader: l
  } = Ji(), [a] = Et(), [s, c] = pl(), [o, d] = kl(), [f, x] = It(), [$, C] = wl(), [g] = bl(), [u, b] = vl(), [y] = zi(), [S] = xl(), [p] = ml(), [L] = yl(), [V] = $l(), [v, h] = K(""), [w, E] = K([]), [I, M] = K(""), [O, N] = K("E"), [T, A] = K(!1), z = (W) => {
    var Q;
    const Y = f.details.findIndex((G) => G.dataKey === W);
    return Y !== -1 && (Q = f.details[Y].enable) != null ? Q : !0;
  }, D = () => {
    const W = [], Y = [], Q = [];
    f.details.forEach((le) => {
      le.type > be.INNER_HTML && le.enable && le.answer !== void 0 && le.answer !== "" && le.answer !== null && V().findIndex((me) => me.parentIndex.toString() === le.index.slice(0, -2).toString()) == -1 && ((le.type === be.PHOTO || le.type === be.SIGNATURE) && Y.push({
        dataKey: le.dataKey,
        name: le.name,
        answer: le.answer
      }), W.push({
        dataKey: le.dataKey,
        name: le.name,
        answer: le.answer
      }), le.principal !== void 0 && Q.push({
        dataKey: le.dataKey,
        name: le.name,
        answer: le.answer,
        principal: le.principal,
        columnName: le.columnName
      }));
    }), b("details", "answers", W), b("details", "templateDataKey", p.details.dataKey), b("details", "gearVersion", Vt), b("details", "templateVersion", ri), b("details", "validationVersion", li), b("details", "docState", O()), b("details", "summary", JSON.parse(JSON.stringify(S))), b("details", "counter", [JSON.parse(JSON.stringify(L))]);
    let G = vt().format("YYYY-MM-DD HH:mm:ss");
    u.details.createdBy === void 0 || u.details.createdBy !== void 0 && u.details.createdBy === "" ? b("details", "createdBy", e.config.username) : b("details", "updatedBy", e.config.username), u.details.createdAt === void 0 || u.details.createdAt !== void 0 && u.details.createdAt === "" ? b("details", "createdAt", G) : b("details", "updatedAt", G), d("details", "principals", Q), d("details", "templateDataKey", p.details.dataKey), d("details", "gearVersion", Vt), d("details", "templateVersion", ri), d("details", "validationVersion", li), o.details.createdBy === void 0 || o.details.createdBy !== void 0 && o.details.createdBy === "" ? d("details", "createdBy", e.config.username) : d("details", "updatedBy", e.config.username), o.details.createdAt === void 0 || o.details.createdAt !== void 0 && o.details.createdAt === "" ? d("details", "createdAt", G) : d("details", "updatedAt", G), C("details", "notes", JSON.parse(JSON.stringify(s.details.notes))), C("details", "templateDataKey", p.details.dataKey), C("details", "gearVersion", Vt), C("details", "templateVersion", ri), C("details", "validationVersion", li), $.details.createdBy === void 0 || $.details.createdBy !== void 0 && $.details.createdBy === "" ? C("details", "createdBy", e.config.username) : C("details", "updatedBy", e.config.username), $.details.createdAt === void 0 || $.details.createdAt !== void 0 && $.details.createdAt === "" ? C("details", "createdAt", G) : C("details", "updatedAt", G), x("sidebar", y.details);
  }, P = (W) => {
    if (D(), e.setResponseMobile(u.details, g.details, $.details, o.details, f), /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
      var Y = document.querySelector(".mobile-component-div");
    else
      var Y = document.querySelector(".component-div");
    const Q = y.details.findIndex((G) => G.dataKey === W);
    if (Q === -1 || !y.details[Q]) {
      console.warn("onUserClick: Could not find sidebar entry for dataKey:", W);
      return;
    }
    i({
      dataKey: W,
      label: y.details[Q].label,
      index: JSON.parse(JSON.stringify(y.details[Q].index)),
      position: Q
    }), window.scrollTo({
      top: 0,
      behavior: "smooth"
    }), Y.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, B = (W) => {
    r({}), setTimeout(() => {
      try {
        t.history.clear(), t.answer.saveAnswer(e.component.dataKey, W, {
          activePosition: n.activeComponent.position
        });
      } catch (Y) {
        ke(a.details.language[0].errorSaving + e.component.dataKey, 3e3), t.history.reloadFromHistory();
      } finally {
        t.history.clear();
      }
    }, 50);
  };
  let F = Ee(() => {
    const W = f.details.findIndex((Y) => Y.dataKey === e.component.dataKey);
    return f.details[W] ? f.details[W].validationState : 0;
  });
  const U = (W) => {
    const Y = f.details.findIndex((Q) => Q.dataKey === e.component.dataKey);
    return f.details[Y] ? f.details[Y].validationMessage : [];
  }, H = () => {
    if (I().length !== 0) {
      let W = [];
      W.push({
        sender: e.config.username,
        datetime: vt().format("YYYY-MM-DD HH:mm:ss"),
        comment: I()
      });
      let Y = JSON.parse(JSON.stringify(s.details.notes));
      if (Y.length == 0)
        Y = [...Y, {
          dataKey: v(),
          comments: W
        }];
      else {
        let G = Y.findIndex((le) => le.dataKey == v());
        G == -1 ? Y = [...Y, {
          dataKey: v(),
          comments: W
        }] : Y[G].comments.push(W[0]);
      }
      let Q = f.details.findIndex((G) => G.dataKey === v());
      x("details", Q, "hasRemark", !0), x("details", Q, "validationState", 0), x("details", Q, "validationMessage", []), c("details", "notes", Y), M(""), h(""), jn(a.details.language[0].remarkAdded, 500), D(), e.setResponseMobile(u.details, $.details, o.details, f);
    } else
      ke(a.details.language[0].remarkEmpty, 500);
  }, ne = (W) => {
    X(W);
  }, X = (W) => {
    if (v() === "") {
      h(W);
      let Y = JSON.parse(JSON.stringify(s.details.notes)), Q = Y.findIndex((G) => G.dataKey == W);
      E(Y[Q] !== void 0 ? Y[Q].comments : []);
    } else
      h(W);
  }, oe = (W) => {
    let Y = JSON.parse(JSON.stringify(s.details.notes)), Q = Y.findIndex((G) => G.dataKey == W);
    return Y[Q] !== void 0 ? Y[Q].comments.length : 0;
  }, se = e.config.clientMode === Mt.PAPI ? Pg : Dg;
  return (() => {
    var W = qg(), Y = W.firstChild;
    return _(W, m(j, {
      get when() {
        return T();
      },
      get children() {
        return Fg();
      }
    }), Y), _(W, m(j, {
      get when() {
        return v() !== "";
      },
      get children() {
        var Q = Wg(), G = Q.firstChild, le = G.firstChild, _e = le.nextSibling, me = _e.nextSibling, Se = me.firstChild;
        return le.$$click = (ve) => X(""), _(Se, m(fe, {
          get each() {
            return w();
          },
          children: (ve, Ke) => (() => {
            var he = Gg(), Ce = he.firstChild, it = Ce.nextSibling, kt = it.nextSibling;
            return _(Ce, () => ve.sender), _(it, () => ve.datetime), _(kt, () => ve.comment), he;
          })()
        })), _(me, m(j, {
          get when() {
            return e.config.formMode < 3;
          },
          get children() {
            return [(() => {
              var ve = Hg(), Ke = ve.firstChild, he = Ke.firstChild, Ce = he.nextSibling, it = Ce.firstChild;
              return it.addEventListener("change", (kt) => {
                M(kt.currentTarget.value);
              }), ve;
            })(), (() => {
              var ve = Jg(), Ke = ve.firstChild, he = Ke.nextSibling;
              return Ke.$$click = (Ce) => H(), he.$$click = (Ce) => X(""), ve;
            })()];
          }
        }), null), _(me, m(j, {
          get when() {
            return e.config.formMode == 3;
          },
          get children() {
            var ve = Ug(), Ke = ve.firstChild;
            return Ke.$$click = (he) => X(""), ve;
          }
        }), null), R(() => Se.classList.toggle("hidden", w().length == 0)), Q;
      }
    }), Y), _(W, m(we, {
      get children() {
        return m(fe, {
          get each() {
            return Array.from(se.keys());
          },
          children: (Q) => m(ee, {
            get when() {
              return ue(() => e.component.type === Q)() && z(e.component.dataKey);
            },
            get children() {
              return se.get(Q)({
                onMobile: e.onMobile,
                component: e.component,
                index: e.index,
                onValueChange: B,
                onUserClick: P,
                value: t.reference.getValue(e.component.dataKey),
                config: e.config,
                classValidation: F(),
                comments: oe(e.component.dataKey),
                MobileUploadHandler: e.MobileUploadHandler,
                validationMessage: U(e.component.dataKey),
                openRemark: ne,
                MobileGpsHandler: e.MobileGpsHandler,
                MobileOfflineSearch: e.MobileOfflineSearch,
                MobileOnlineSearch: e.MobileOnlineSearch,
                MobileOpenMap: e.MobileOpenMap
              });
            }
          })
        });
      }
    }), null), R(() => J(Y, "id", e.component.dataKey + "___scrollView")), W;
  })();
};
ye(["click"]);
var Qg = /* @__PURE__ */ k('<div class="flex-grow bg-white dark:bg-gray-900 overflow-y-auto mb-20"><div class="space-y-3 sm:p-7 p-3">');
const Zg = (e) => (() => {
  var t = Qg(), n = t.firstChild;
  return _(n, m(fe, {
    get each() {
      return e.components;
    },
    children: (i, r) => Yg({
      onMobile: e.onMobile,
      component: i,
      index: r(),
      config: e.config,
      MobileUploadHandler: e.uploadHandler,
      MobileGpsHandler: e.GpsHandler,
      MobileOfflineSearch: e.offlineSearch,
      MobileOnlineSearch: e.onlineSearch,
      MobileOpenMap: e.openMap,
      setResponseMobile: e.setResponseMobile
    })
  })), t;
})();
var ni = { exports: {} }, Xg = ni.exports, Vr;
function ef() {
  return Vr || (Vr = 1, (function(e, t) {
    (function(n, i) {
      e.exports = i();
    })(Xg, (function() {
      var n = { year: 0, month: 1, day: 2, hour: 3, minute: 4, second: 5 }, i = {};
      return function(r, l, a) {
        var s, c = function(x, $, C) {
          C === void 0 && (C = {});
          var g = new Date(x), u = (function(b, y) {
            y === void 0 && (y = {});
            var S = y.timeZoneName || "short", p = b + "|" + S, L = i[p];
            return L || (L = new Intl.DateTimeFormat("en-US", { hour12: !1, timeZone: b, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", timeZoneName: S }), i[p] = L), L;
          })($, C);
          return u.formatToParts(g);
        }, o = function(x, $) {
          for (var C = c(x, $), g = [], u = 0; u < C.length; u += 1) {
            var b = C[u], y = b.type, S = b.value, p = n[y];
            p >= 0 && (g[p] = parseInt(S, 10));
          }
          var L = g[3], V = L === 24 ? 0 : L, v = g[0] + "-" + g[1] + "-" + g[2] + " " + V + ":" + g[4] + ":" + g[5] + ":000", h = +x;
          return (a.utc(v).valueOf() - (h -= h % 1e3)) / 6e4;
        }, d = l.prototype;
        d.tz = function(x, $) {
          x === void 0 && (x = s);
          var C, g = this.utcOffset(), u = this.toDate(), b = u.toLocaleString("en-US", { timeZone: x }), y = Math.round((u - new Date(b)) / 1e3 / 60), S = 15 * -Math.round(u.getTimezoneOffset() / 15) - y;
          if (!Number(S)) C = this.utcOffset(0, $);
          else if (C = a(b, { locale: this.$L }).$set("millisecond", this.$ms).utcOffset(S, !0), $) {
            var p = C.utcOffset();
            C = C.add(g - p, "minute");
          }
          return C.$x.$timezone = x, C;
        }, d.offsetName = function(x) {
          var $ = this.$x.$timezone || a.tz.guess(), C = c(this.valueOf(), $, { timeZoneName: x }).find((function(g) {
            return g.type.toLowerCase() === "timezonename";
          }));
          return C && C.value;
        };
        var f = d.startOf;
        d.startOf = function(x, $) {
          if (!this.$x || !this.$x.$timezone) return f.call(this, x, $);
          var C = a(this.format("YYYY-MM-DD HH:mm:ss:SSS"), { locale: this.$L });
          return f.call(C, x, $).tz(this.$x.$timezone, !0);
        }, a.tz = function(x, $, C) {
          var g = C && $, u = C || $ || s, b = o(+a(), u);
          if (typeof x != "string") return a(x).tz(u);
          var y = (function(V, v, h) {
            var w = V - 60 * v * 1e3, E = o(w, h);
            if (v === E) return [w, v];
            var I = o(w -= 60 * (E - v) * 1e3, h);
            return E === I ? [w, E] : [V - 60 * Math.min(E, I) * 1e3, Math.max(E, I)];
          })(a.utc(x, g).valueOf(), b, u), S = y[0], p = y[1], L = a(S).utcOffset(p);
          return L.$x.$timezone = u, L;
        }, a.tz.guess = function() {
          return Intl.DateTimeFormat().resolvedOptions().timeZone;
        }, a.tz.setDefault = function(x) {
          s = x;
        };
      };
    }));
  })(ni)), ni.exports;
}
var tf = ef();
const nf = /* @__PURE__ */ En(tf);
var ii = { exports: {} }, rf = ii.exports, Tr;
function lf() {
  return Tr || (Tr = 1, (function(e, t) {
    (function(n, i) {
      e.exports = i();
    })(rf, (function() {
      var n = "minute", i = /[+-]\d\d(?::?\d\d)?/g, r = /([+-]|\d\d)/g;
      return function(l, a, s) {
        var c = a.prototype;
        s.utc = function(g) {
          var u = { date: g, utc: !0, args: arguments };
          return new a(u);
        }, c.utc = function(g) {
          var u = s(this.toDate(), { locale: this.$L, utc: !0 });
          return g ? u.add(this.utcOffset(), n) : u;
        }, c.local = function() {
          return s(this.toDate(), { locale: this.$L, utc: !1 });
        };
        var o = c.parse;
        c.parse = function(g) {
          g.utc && (this.$u = !0), this.$utils().u(g.$offset) || (this.$offset = g.$offset), o.call(this, g);
        };
        var d = c.init;
        c.init = function() {
          if (this.$u) {
            var g = this.$d;
            this.$y = g.getUTCFullYear(), this.$M = g.getUTCMonth(), this.$D = g.getUTCDate(), this.$W = g.getUTCDay(), this.$H = g.getUTCHours(), this.$m = g.getUTCMinutes(), this.$s = g.getUTCSeconds(), this.$ms = g.getUTCMilliseconds();
          } else d.call(this);
        };
        var f = c.utcOffset;
        c.utcOffset = function(g, u) {
          var b = this.$utils().u;
          if (b(g)) return this.$u ? 0 : b(this.$offset) ? f.call(this) : this.$offset;
          if (typeof g == "string" && (g = (function(L) {
            L === void 0 && (L = "");
            var V = L.match(i);
            if (!V) return null;
            var v = ("" + V[0]).match(r) || ["-", 0, 0], h = v[0], w = 60 * +v[1] + +v[2];
            return w === 0 ? 0 : h === "+" ? w : -w;
          })(g), g === null)) return this;
          var y = Math.abs(g) <= 16 ? 60 * g : g;
          if (y === 0) return this.utc(u);
          var S = this.clone();
          if (u) return S.$offset = y, S.$u = !1, S;
          var p = this.$u ? this.toDate().getTimezoneOffset() : -1 * this.utcOffset();
          return (S = this.local().add(y + p, n)).$offset = y, S.$x.$localOffset = p, S;
        };
        var x = c.format;
        c.format = function(g) {
          var u = g || (this.$u ? "YYYY-MM-DDTHH:mm:ss[Z]" : "");
          return x.call(this, u);
        }, c.valueOf = function() {
          var g = this.$utils().u(this.$offset) ? 0 : this.$offset + (this.$x.$localOffset || this.$d.getTimezoneOffset());
          return this.$d.valueOf() - 6e4 * g;
        }, c.isUTC = function() {
          return !!this.$u;
        }, c.toISOString = function() {
          return this.toDate().toISOString();
        }, c.toString = function() {
          return this.toDate().toUTCString();
        };
        var $ = c.toDate;
        c.toDate = function(g) {
          return g === "s" && this.$offset ? s(this.format("YYYY-MM-DD HH:mm:ss:SSS")).toDate() : $.call(this);
        };
        var C = c.diff;
        c.diff = function(g, u, b) {
          if (g && this.$u === g.$u) return C.call(this, g, u, b);
          var y = this.local(), S = s(g).local();
          return C.call(y, S, u, b);
        };
      };
    }));
  })(ii)), ii.exports;
}
var af = lf();
const sf = /* @__PURE__ */ En(af), jr = {
  // Type conversion
  Number,
  String,
  Boolean,
  parseInt,
  parseFloat,
  isNaN,
  isFinite,
  // Math
  Math,
  // Array methods (via the answer value, not direct Array access)
  Array,
  // Date (for date comparisons)
  Date,
  // JSON (for parsing/stringifying)
  JSON,
  // Regex (for pattern matching)
  RegExp,
  // Utility constants
  // Note: null, true, false are reserved keywords and available by default
  // They cannot be used as function parameter names
  undefined: void 0,
  NaN: NaN,
  Infinity: 1 / 0,
  // String utilities
  encodeURIComponent,
  decodeURIComponent
};
function Ul(e, t, n = {}) {
  const { defaultValue: i, logErrors: r = !0 } = n;
  if (!e || e.trim() === "")
    return {
      success: !0,
      value: i
    };
  try {
    return {
      success: !0,
      value: of(e, t)()
    };
  } catch (l) {
    const a = l instanceof Error ? l.message : String(l);
    return r && console.error(
      `[Expression] Error evaluating "${e}" for ${t.dataKey}:`,
      a
    ), {
      success: !1,
      value: i,
      error: a
    };
  }
}
function of(e, t) {
  const n = [
    "getValue",
    "getRowIndex",
    "getProp",
    "answer",
    "rowIndex",
    ...Object.keys(jr)
  ], i = [
    t.getValue,
    t.getRowIndex,
    t.getProp,
    t.answer,
    t.getRowIndex(0),
    // rowIndex shorthand
    ...Object.values(jr)
  ], r = `
    'use strict';
    return (${e});
  `, l = new Function(...n, r);
  return () => l(...i);
}
function df(e, t, n = !0) {
  return !e || e.trim() === "" ? !0 : Ul(e, t, {
    defaultValue: n,
    logErrors: !0
  }).value;
}
function cf(e, t) {
  return !e || e.trim() === "" ? void 0 : Ul(e, t, {
    defaultValue: void 0,
    logErrors: !0
  }).value;
}
function Dr(e) {
  return (t) => {
    const n = e.split("@")[0].split("#"), i = n.length, r = t + 1;
    return i - r < 1 ? Number(n[1]) || 0 : Number(n[i - r]) || 0;
  };
}
var uf = /* @__PURE__ */ k('<div class="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900"><div class="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md"><svg class="mx-auto h-16 w-16 text-red-500 mb-4"fill=none viewBox="0 0 24 24"stroke=currentColor><path stroke-linecap=round stroke-linejoin=round stroke-width=2 d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg><h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">Form Configuration Error</h2><p class="text-gray-600 dark:text-gray-300 mb-4">No sections found in the template. Please ensure your template JSON has at least one section with type 1.</p><p class="text-sm text-gray-500 dark:text-gray-400">Check the browser console for more details.'), hf = /* @__PURE__ */ k('<div class="modal-confirmation fixed z-10 inset-0 overflow-y-auto"aria-labelledby=modal-title role=dialog aria-modal=true><div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"><div class="fixed inset-0 bg-gray-500/75 transition-opacity"aria-hidden=true></div><span class="hidden sm:inline-block sm:align-middle sm:h-screen"aria-hidden=true>&#8203;</span><div class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"><div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4"><div class="sm:flex sm:items-start"><div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-teal-200 sm:mx-0 sm:h-10 sm:w-10 text-teal-500"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg></div><div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left"><h3 class="text-lg leading-6 font-medium text-gray-900"id=titleModalDelete>Confirmation submission</h3><div class=mt-2><p class="text-sm text-gray-500"id=contentModalDelete>Thank you for completing the survey. Please provide this final verification to complete the submission!</p></div><div class="mt-4 flex space-y-2 space-x-2 items-center justify-center md:items-end md:justify-start"><span class="rounded-lg text-3xl italic font-mono cursor-not-allowed text-slate-600 p-2 bg-gradient-to-r from-teal-500 to-teal-50 text-justify line-through pointer-events-none select-none "></span><button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-5 w-5 flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-3 w-3"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg></button></div><div class="mt-4 flex space-y-2 space-x-2 items-center justify-center"><input type=number class="w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 border border-solid border-gray-300 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"placeholder></div></div></div></div><div class="bg-white px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"><button type=button class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-teal-600 text-base font-medium text-white hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">Submit</button><button type=button class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Cancel'), gf = /* @__PURE__ */ k('<div class="modal-remark fixed z-10 inset-0 overflow-y-auto"aria-labelledby=modal-title role=dialog aria-modal=true><div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"><div class="fixed inset-0 bg-gray-500/75 transition-opacity"aria-hidden=true></div><span class="hidden sm:inline-block sm:align-middle sm:h-screen"aria-hidden=true>&#8203;</span><div class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full"><div class="bg-white px-4 pt-5 pb-4 sm:p-6"><div class="sm:flex sm:items-start mt-6"><div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full text-yellow-400 bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10"><svg xmlns=http://www.w3.org/2000/svg class="h-6 w-6 "fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path></svg></div><div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left"><h3 class="text-lg leading-6 font-medium text-gray-900"id=titleModalError>List Remark</h3><div class="relative overflow-auto"><div class="shadow-sm overflow-auto my-6"><table class="border-collapse table-fixed w-full text-sm"><thead class="text-sm font-semibold text-gray-600 bg-gray-50"><tr><th class="p-2 whitespace-nowrap font-semibold text-left w-1/12">No</th><th class="p-2 whitespace-nowrap font-semibold text-left w-5/12">Field</th><th class="p-2 whitespace-nowrap font-semibold text-left w-1/12"></th></tr></thead><tbody class="text-sm divide-y divide-gray-100 "></tbody></table></div><div class="flex justify-start items-center text-center font-light px-3 pb-3"><button type=button class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-light text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm">Prev</button><div class="text-center px-4 text-xs"></div><button type=button class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-light text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm">Next</button></div></div></div></div></div><div class="bg-white px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"><button type=button class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Close'), ff = /* @__PURE__ */ k('<div class="modal-confirmation fixed z-10 inset-0 overflow-y-auto"aria-labelledby=modal-title role=dialog aria-modal=true><div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"><div class="fixed inset-0 bg-gray-500/75 transition-opacity"aria-hidden=true></div><span class="hidden sm:inline-block sm:align-middle sm:h-screen"aria-hidden=true>&#8203;</span><div class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full"><div class="bg-white px-4 pt-5 pb-4 sm:p-6"><div class="sm:flex sm:items-start mt-6"><div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-gray-200 sm:mx-0 sm:h-10 sm:w-10 text-gray-500"><svg xmlns=http://www.w3.org/2000/svg class="h-6 w-6"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div><div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left"><h3 class="text-lg leading-6 font-medium text-gray-900"id=titleModalError>List Blank</h3><div class="relative overflow-auto"><div class="shadow-sm overflow-auto my-6"><table class="border-collapse table-fixed w-full text-sm"><thead class="text-sm font-semibold text-gray-600 bg-gray-50"><tr><th class="p-2 whitespace-nowrap font-semibold text-left w-1/12">No</th><th class="p-2 whitespace-nowrap font-semibold text-left w-5/12">Field</th><th class="p-2 whitespace-nowrap font-semibold text-left w-1/12"></th></tr></thead><tbody class="text-sm divide-y divide-gray-100 "></tbody></table></div><div class="flex justify-start items-center text-center font-light px-3 pb-3"><button type=button class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-light text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm">Prev</button><div class="text-center px-4 text-xs"></div><button type=button class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-light text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm">Next</button></div></div></div></div></div><div class="bg-white px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"><button type=button class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Close'), vf = /* @__PURE__ */ k('<div class="sm:flex sm:items-start mt-6"><div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-200 sm:mx-0 sm:h-10 sm:w-10 text-yellow-500"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg></div><div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left"><h3 class="text-lg leading-6 font-medium text-gray-900"id=titleModalError>List Warning</h3><div class="relative overflow-auto"><div class="shadow-sm overflow-auto my-6"><table class="border-collapse table-fixed w-full text-sm"><thead class="text-sm font-semibold text-gray-600 bg-gray-50"><tr><th class="p-2 whitespace-nowrap font-semibold text-left w-1/12">No</th><th class="p-2 whitespace-nowrap font-semibold text-left w-4/12">Field</th><th class="p-2 whitespace-nowrap font-semibold text-left w-5/12">Warning Messages</th><th class="p-2 whitespace-nowrap font-semibold text-left w-2/12"></th></tr></thead><tbody class="text-sm divide-y divide-gray-100 "></tbody></table></div><div class="flex justify-start items-center text-center font-light px-3 pb-3"><button type=button class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-light text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm">Prev</button><div class="text-center px-4 text-xs"></div><button type=button class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-light text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm">Next'), mf = /* @__PURE__ */ k('<div class="modal-confirmation fixed z-10 inset-0 overflow-y-auto"aria-labelledby=modal-title role=dialog aria-modal=true><div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"><div class="fixed inset-0 bg-gray-500/75 transition-opacity"aria-hidden=true></div><span class="hidden sm:inline-block sm:align-middle sm:h-screen"aria-hidden=true>&#8203;</span><div class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full"><div class="bg-white px-4 pt-5 pb-4 sm:p-6"><div class="sm:flex sm:items-start"><div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-200 sm:mx-0 sm:h-10 sm:w-10 text-red-500"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div><div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left"><h3 class="text-lg leading-6 font-medium text-gray-900"id=titleModalError>List Error</h3><div class="relative overflow-auto"><div class="shadow-sm overflow-auto my-6"><table class="border-collapse table-fixed w-full text-sm"><thead class="text-sm font-semibold text-gray-600 bg-gray-50"><tr><th class="p-2 whitespace-nowrap font-semibold text-left w-1/12">No</th><th class="p-2 whitespace-nowrap font-semibold text-left w-4/12">Field</th><th class="p-2 whitespace-nowrap font-semibold text-left w-5/12">Error Messages</th><th class="p-2 whitespace-nowrap font-semibold text-left w-2/12"></th></tr></thead><tbody class="text-sm divide-y divide-gray-100 "></tbody></table></div><div class="flex justify-start items-center text-center font-light px-3 pb-3"><button type=button class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-light text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm">Prev</button><div class="text-center px-4 text-xs"></div><button type=button class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-light text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm">Next</button></div></div></div></div></div><div class="bg-white px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"><button type=button class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Close'), Pr = /* @__PURE__ */ k('<div class="text-lg block px-4 py-3 text-gray-600 dark:text-white font-bold sm:text-xl">'), bf = /* @__PURE__ */ k('<button class="bg-teal-300 dark:bg-teal-500 hover:bg-teal-200 dark:hover:bg-teal-400 text-teal-100 p-3 w-full rounded-md shadow font-medium">Submit'), wf = /* @__PURE__ */ k('<button class="bg-red-500 hover:bg-red-400 text-teal-100 p-3 w-full rounded-md shadow font-medium">List Error'), xf = /* @__PURE__ */ k('<div class="bg-white dark:bg-gray-900 w-72 flex-shrink-0 border-r border-gray-200 dark:border-gray-800 max-h-screen p-5 sidebar-span absolute inset-y-0 left-0 transform -translate-x-full transition-transform duration-500 ease-in-out md:relative md:translate-x-0 z-10"><div class="sm:min-h-[7rem] py-3 text-gray-400 tracking-wider flex justify-between"><button type=button class="md:hidden p-2 mobile-menu-button "><svg xmlns=http://www.w3.org/2000/svg class="h-6 w-6"fill=none viewBox="0 0 24 24"stroke=currentColor><path stroke-linecap=round stroke-linejoin=round stroke-width=2 d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></button></div><div class="h-3/6 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-50 dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-500 overflow-y-scroll scrollbar-thumb-rounded-full scrollbar-track-rounded-full "><div class></div><div class="sticky bottom-0 bg-gradient-to-t from-white dark:from-slate-900 pt-14"></div></div><div class="h-2/6 "><div class="bg-white px-8 p-5 w-full flex flex-col dark:bg-gray-900 space-y-4 absolute bottom-0 left-0 "><div class="grid grid-cols-2 gap-y-4 sm:pb-3"><div class="h-auto text-5xl text-center sm:flex flex-col flex-coltext-white font-medium "><div class="font-light text-xs"></div></div><div class="h-auto text-5xl text-center sm:flex flex-col flex-coltext-white font-medium cursor-pointer"><div class="font-light text-xs"></div></div><div class="h-auto text-5xl text-center sm:flex flex-col flex-coltext-white font-medium cursor-pointer"><div class="font-light text-xs"></div></div><div class="h-auto text-5xl text-center sm:flex flex-col flex-coltext-white font-medium cursor-pointer"><div class="font-light text-xs"></div></div></div><div class>'), yf = /* @__PURE__ */ k('<div class="text-xs font-light text-gray-600 "> <!> &#177; <!> ms'), pf = /* @__PURE__ */ k('<div class="flex relative flex-none min-w-full px-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-50 dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-500 scrollbar-thumb-rounded-full scrollbar-track-rounded-full"><ul class="flex text-sm leading-6 text-slate-400 pt-4">'), kf = /* @__PURE__ */ k('<button class="bg-red-200 text-red-500 sm:h-10 sm:w-10 rounded-full focus:outline-none h-5 w-5 flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), $f = /* @__PURE__ */ k('<button class="bg-teal-200 text-teal-500 sm:h-10 sm:w-10 rounded-full focus:outline-none h-5 w-5 flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8">'), _f = /* @__PURE__ */ k('<button class="bg-blue-700 text-white p-2 rounded-full focus:outline-none items-center h-10 w-10 hover:bg-blue-600 group inline-flex justify-center text-xs"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"viewBox="0 0 20 20"fill=currentColor><path fill-rule=evenodd d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"clip-rule=evenodd>'), Sf = /* @__PURE__ */ k('<button class="bg-red-200 text-red-500 rounded-full focus:outline-none h-8 w-8 flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Cf = /* @__PURE__ */ k('<button class="bg-teal-200 text-teal-500 h-8 w-8 rounded-full focus:outline-none flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8">'), Mf = /* @__PURE__ */ k('<button class="bg-blue-700 text-white p-2 rounded-full focus:outline-none items-center h-8 w-8 hover:bg-blue-600 group inline-flex justify-center text-xs"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"viewBox="0 0 20 20"fill=currentColor><path fill-rule=evenodd d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"clip-rule=evenodd>'), If = /* @__PURE__ */ k('<button class=" bg-teal-500 text-white p-2 rounded-full focus:outline-none items-center h-10 w-10 hover:bg-teal-400"><svg xmlns=http://www.w3.org/2000/svg class="h-6 w-6"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z">'), Ef = /* @__PURE__ */ k('<div class="bg-gray-200 dark:bg-[#181f30] h-screen "><div class=" overflow-hidden"><div class="bg-gray-50 dark:bg-gray-900 dark:text-white h-screen shadow-xl text-gray-600 flex overflow-hidden text-sm font-montserrat xl:rounded-xl dark:shadow-gray-800"><div class="flex-grow overflow-hidden h-full flex flex-col bg-white dark:bg-gray-900 z-0"><div class="mobile-component-div relative h-screen md:flex md:overflow-hidden scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-50 dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-500 overflow-y-scroll scrollbar-thumb-rounded-full scrollbar-track-rounded-full "><div class="component-div min-h-screen flex-grow bg-white dark:bg-gray-900 z-10 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-50 dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-500 overflow-y-visible md:overflow-y-scroll scrollbar-thumb-rounded-full scrollbar-track-rounded-full "><div class="sm:px-7 sm:pt-7 px-4 pt-4 flex flex-col w-full border-b border-gray-200 bg-white dark:bg-gray-900 dark:text-white dark:border-gray-800 z-10 sticky"><div class="flex w-full items-center"><div class="ml-3 w-4/6 md:w-auto md:text-2xl md:text-left font-medium text-left text-base text-gray-900 dark:text-white mt-1"><div></div><div class="text-sm font-light md:text-lg text-gray-600 dark:text-gray-400"></div></div><div class="ml-auto w-1/6 md:w-auto sm:flex items-center p-2 "><button type=button class="button-switch relative inline-flex flex-shrink-0 bg-gray-200 dark:bg-gray-700 h-6 w-11 border-2 border-transparent rounded-full cusrsor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"><span class="outer-span relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 pointer-events-none"><span class="light-switch absolute inset-0 h-full w-full flex items-center justify-center transition-opacity opacity-100 dark:opacity-0 ease-out duration-100"><svg class="bg-white h-3 w-3 text-gray-400"fill=currentColor viewBox="0 0 20 20"xmlns=http://www.w3.org/2000/svg><path fill-rule=evenodd d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"clip-rule=evenodd></path></svg></span><span class="dark-switch absolute inset-0 h-full w-full flex items-center justify-center transition-opacity opacity-0 dark:opacity-100 ease-in duration-200"><svg class="bg-white h-3 w-3 text-indigo-600"width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path fill-rule=evenodd clip-rule=evenodd d="M12.2256 2.00253C9.59172 1.94346 6.93894 2.9189 4.92893 4.92891C1.02369 8.83415 1.02369 15.1658 4.92893 19.071C8.83418 22.9763 15.1658 22.9763 19.0711 19.071C21.0811 17.061 22.0565 14.4082 21.9975 11.7743C21.9796 10.9772 21.8669 10.1818 21.6595 9.40643C21.0933 9.9488 20.5078 10.4276 19.9163 10.8425C18.5649 11.7906 17.1826 12.4053 15.9301 12.6837C14.0241 13.1072 12.7156 12.7156 12 12C11.2844 11.2844 10.8928 9.97588 11.3163 8.0699C11.5947 6.81738 12.2094 5.43511 13.1575 4.08368C13.5724 3.49221 14.0512 2.90664 14.5935 2.34046C13.8182 2.13305 13.0228 2.02041 12.2256 2.00253ZM17.6569 17.6568C18.9081 16.4056 19.6582 14.8431 19.9072 13.2186C16.3611 15.2643 12.638 15.4664 10.5858 13.4142C8.53361 11.362 8.73568 7.63895 10.7814 4.09281C9.1569 4.34184 7.59434 5.09193 6.34315 6.34313C3.21895 9.46732 3.21895 14.5326 6.34315 17.6568C9.46734 20.781 14.5327 20.781 17.6569 17.6568Z"fill=currentColor></path></svg></span></span></button></div><div class="ml-auto w-1/6 md:w-auto sm:flex md:hidden items-center"><button type=button class="p-4 mobile-menu-button focus:outline-none focus:bg-gray-200 dark:focus:bg-gray-800"><svg xmlns=http://www.w3.org/2000/svg class="h-6 w-6"fill=none viewBox="0 0 24 24"stroke=currentColor><path stroke-linecap=round stroke-linejoin=round stroke-width=2 d="M4 6h16M4 12h16M4 18h16"></path></svg></button></div></div><div class="flex items-center space-x-3 sm:mt-7 mt-4"></div></div><div class="grid grid-cols-6 w-full justify-end items-end bottom-4 right-0"><div class=" flex justify-center items-center space-x-10 mx-10 col-start-2 col-end-6 py-2 rounded-full bg-gray-200/80 dark:bg-gray-800/90"><button class="bg-blue-700 text-white p-2 rounded-full focus:outline-none items-center h-10 w-10 hover:bg-blue-600 group inline-flex justify-center text-xs"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"viewBox="0 0 20 20"fill=currentColor><path fill-rule=evenodd d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"clip-rule=evenodd></path></svg></button><div class="flex justify-center items-center text-center"></div></div><div class=" justify-end items-center pr-8 transition"><button class="scrolltotop-div bg-yellow-400 text-white p-2 rounded-full focus:outline-none items-center h-12 w-12 hover:bg-yellow-300"><svg xmlns=http://www.w3.org/2000/svg class="h-8 w-8"viewBox="0 0 20 20"fill=currentColor><path fill-rule=evenodd d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"clip-rule=evenodd></path></svg></button></div></div></div><div class="grid grid-cols-6 sticky w-full justify-end bottom-4 mt-10"><div class=" flex justify-center items-center space-x-4 col-start-1 col-end-5 ml-4 mr-4 py-2 rounded-full bg-gray-200/80 dark:bg-gray-800/90"><button class="bg-blue-700 text-white p-2 rounded-full focus:outline-none items-center h-8 w-8 hover:bg-blue-600 group inline-flex justify-center text-xs"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"viewBox="0 0 20 20"fill=currentColor><path fill-rule=evenodd d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"clip-rule=evenodd></path></svg></button><div class="flex justify-center items-center text-center text-xs"></div></div><div class=" justify-end items-center pr-2 transition"><button class="scrolltotop-div bg-yellow-400 text-white p-2 rounded-full focus:outline-none items-center h-10 w-10 hover:bg-yellow-300"><svg xmlns=http://www.w3.org/2000/svg class="h-6 w-6"viewBox="0 0 20 20"fill=currentColor><path fill-rule=evenodd d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"clip-rule=evenodd></path></svg></button></div><div class="flex justify-end items-center col-start-6 pr-5 transition">'), Kr = /* @__PURE__ */ k('<tr class=text-gray-600><td class="border-b border-slate-100 p-2 align-top"><div class="text-left text-sm font-light">&nbsp;&nbsp;</div></td><td class="border-b border-slate-100 p-2 align-top"><div class="text-left text-sm font-light"></div></td><td class="border-b border-slate-100 align-top p-2"><button class="bg-transparent text-gray-500 rounded-full focus:outline-none h-5 w-5 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"viewBox="0 0 20 20"fill=currentColor stroke-width=2><path fill-rule=evenodd d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z"clip-rule=evenodd>'), Br = /* @__PURE__ */ k('<tr class=text-gray-600><td class="border-b border-slate-100 p-2 align-top"><div class="text-left text-sm font-light">&nbsp;&nbsp;</div></td><td class="border-b border-slate-100 p-2 align-top"><div class="text-left text-sm font-light"></div></td><td class="border-b border-slate-100 align-top pb-2"></td><td class="border-b border-slate-100 align-top p-2"><button class="bg-transparent text-gray-500 rounded-full focus:outline-none h-5 w-5 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"viewBox="0 0 20 20"fill=currentColor stroke-width=2><path fill-rule=evenodd d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z"clip-rule=evenodd>'), zr = /* @__PURE__ */ k('<div class="grid grid-cols-12 text-sm font-light mt-1"><div class="col-span-1 flex justify-center items-start">-</div><div class="col-span-11 text-justify mr-1">'), Of = /* @__PURE__ */ k('<ul class="formgear-sidebar "><li><a class="block py-2 px-4 rounded font-medium space-x-2 hover:bg-blue-700 hover:text-white"href=javascript:void(0);><div class="font-light text-xs"><div>'), Fr = /* @__PURE__ */ k('<ul class="border-l border-gray-300 dark:border-slate-500 ml-4"><li><a class="block py-2 px-4 rounded font-medium space-x-2 hover:bg-blue-700 hover:text-white"href=javascript:void(0);><div class="font-light text-xs"><div>'), Lf = /* @__PURE__ */ k('<ul class="border-l border-gray-300 dark:border-slate-500 ml-4 "><li><a class="block py-2 px-4 rounded font-medium space-x-2 hover:bg-blue-700 hover:text-white"href=javascript:void(0);><div class="font-light text-xs"><div>'), Af = /* @__PURE__ */ k('<li class=flex-none><a class="block py-2 mb-1.5 px-4 rounded font-medium space-x-2 hover:bg-blue-700 hover:text-white"href=javascript:void(0);>');
const Rf = () => {
  const e = document.querySelector('[data-last-focus="true"]');
  e && e.focus();
}, Nf = (e) => {
  const t = Bt(), [n, i] = Et(), [r, l] = pl(), [a, s] = kl(), [c, o] = It(), [d, f] = wl(), [x, $] = vl(), [C] = zi(), [g, u] = xl(), [b] = ml(), [y] = yl(), [S, p] = bl(), [L] = $l(), [, V] = us(), v = (ie) => {
    const re = c.details.findIndex((ae) => ae.dataKey === ie);
    let q = "";
    return re !== -1 && c.details[re].answer && c.details[re].enable && (q = c.details[re].answer), q;
  }, h = () => e.config, w = (ie) => {
    switch (ie) {
      case "clientMode":
        return e.config.clientMode;
      case "baseUrl":
        return e.config.baseUrl;
    }
  }, [E, I] = K("FormGear-" + Vt + " 🚀:"), {
    setLoader: M,
    removeLoader: O
  } = Ji(), [N, T] = K(w("")), [A, z] = K(h()), [D, {
    setActiveComponent: P
  }] = gl(), [B, F] = K(!1), [U, H] = K(""), [ne, X] = K(""), [oe, se] = K("E"), [W, Y] = K(!1), [Q, G] = K(!1), [le, _e] = K(!1), [me, Se] = K([]), [ve, Ke] = K([]), [he, Ce] = K(1), [it, kt] = K(1), [Ge, rn] = K([]), [Ye, $t] = K([]), [Be, rt] = K(1), [Lt, Ln] = K(1), [zt, tn] = K([]), [_t, ln] = K([]), [Ft, ql] = K(1), [Gl, Yl] = K(1), [vn, Ql] = K([]), [Zl, Xl] = K([]), [mn, ea] = K(1), [ta, na] = K(1);
  if (e.template.details.language !== void 0 && e.template.details.language.length > 0) {
    const ie = Object.keys(n.details.language[0]), re = JSON.parse(JSON.stringify(n.details.language[0]));
    ie.forEach((q) => {
      e.template.details.language[0].hasOwnProperty(q) && (re[q] = e.template.details.language[0][q]);
    }), i("details", "language", [re]);
  }
  const [ia, qi] = K([]), Gi = (ie) => {
    const re = C.details.findIndex((ae) => ae.dataKey === ie);
    return C.details[re] !== void 0 ? C.details[re].components[0] : "";
  };
  if (!C.details || C.details.length === 0)
    return console.error("FormGear Error: No sections found in sidebar. Please check your template configuration."), ke("Form configuration error: No sections found in template", 5e3), uf();
  if (P({
    dataKey: C.details[0].dataKey,
    label: C.details[0].label,
    index: JSON.parse(JSON.stringify(C.details[0].index)),
    position: 0
  }), qi(Gi(C.details[0].dataKey)), e.runAll == 0) {
    e.tmpVarComp.forEach((ie, re) => {
      let q = C.details.findIndex((xe, je) => xe.components[0].findIndex((An, bn) => (An.dataKey, ie.dataKey, bn)) == -1 ? 0 : je);
      const ae = Dr(ie.dataKey), de = {
        getValue: v,
        getRowIndex: ae,
        getProp: w,
        dataKey: ie.dataKey
      };
      let pe = cf(ie.expression, de);
      pe !== void 0 && t.answer.saveAnswer(ie.dataKey, pe, {
        isInitial: !0,
        activePosition: q
      });
    }), e.preset.details.predata.forEach((ie, re) => {
      let q = t.reference.getIndex(ie.dataKey);
      if (q !== -1 && (A().initialMode == 1 && c.details[q].presetMaster !== void 0 && c.details[q].presetMaster || A().initialMode == 2)) {
        let ae = C.details.findIndex((pe) => pe.components[0].findIndex((je) => je.dataKey === ie.dataKey) == -1 ? 0 : re), de = typeof ie.answer == "object" ? JSON.parse(JSON.stringify(ie.answer)) : ie.answer;
        t.answer.saveAnswer(ie.dataKey, de, {
          isInitial: !0,
          activePosition: ae
        });
      }
    }), e.response.details.answers.forEach((ie, re) => {
      if (!ie.dataKey.includes("#") && t.reference.getIndex(ie.dataKey) !== -1) {
        let ae = C.details.findIndex((pe) => pe.components[0].findIndex((je) => je.dataKey === ie.dataKey) == -1 ? 0 : re), de = typeof ie.answer == "object" ? JSON.parse(JSON.stringify(ie.answer)) : ie.answer;
        de !== void 0 && t.answer.saveAnswer(ie.dataKey, de, {
          isInitial: !0,
          activePosition: ae
        });
      }
    }), e.tmpEnableComp.forEach((ie) => {
      const re = Dr(ie.dataKey), q = {
        getValue: v,
        getRowIndex: re,
        getProp: w,
        dataKey: ie.dataKey
      };
      let de = df(ie.enableCondition, q, !0), pe = de === void 0 ? !1 : de;
      t.answer.saveEnable(ie.dataKey, pe);
    });
    for (let ie = 0; ie < c.details.length; ie++) {
      let re = c.details[ie];
      if (!(re.index[re.index.length - 2] === 0 && re.level > 1) && (re.enable && re.componentValidation !== void 0 && t.validation.validateComponent(re.dataKey), re.enable && re.sourceOption !== void 0)) {
        let q = re.sourceOption.split("@"), ae = t.reference.getIndex(q[0]), de = ae !== -1 ? c.details[ae] : null;
        if (re.answer && de && de.answer) {
          let pe = [];
          re.answer.forEach((xe) => {
            de.answer.forEach((je) => {
              xe.value == je.value && pe.push(je);
            });
          }), o("details", ie, "answer", pe);
        }
      }
    }
  } else
    c.details.forEach((ie) => {
      let re = d.details.notes.findIndex((q) => q.dataKey === ie.dataKey);
      if (re !== -1) {
        let q = d.details.notes[re], ae = JSON.parse(JSON.stringify(r.details.notes));
        ae.push(q), l("details", "notes", ae);
      }
    }), I("FormGear-" + Vt + " ♻️:");
  V(!0);
  const [an, Yi] = K(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)), ra = () => {
    window.innerWidth < 768 ? Yi(!0) : Yi(!1);
  };
  Me(() => {
    qi(Gi(D.activeComponent.dataKey));
    let ie = 0, re = 0, q = 0, ae = 0;
    c.details.forEach((de, pe) => {
      L().findIndex((je) => je.parentIndex.toString() === de.index.slice(0, -2).toString()) == -1 && de.type > be.VARIABLE && de.enable && (de.answer !== void 0 && de.answer !== "" && de.answer !== null && (ie += 1, (de.answer === void 0 || de.answer === "" || de.type === be.LIST_TEXT_REPEAT && Array.isArray(de.answer) && de.answer.length === 1 || de.type === be.LIST_SELECT_REPEAT && Array.isArray(de.answer) && de.answer.length === 1) && !(JSON.parse(JSON.stringify(de.index[de.index.length - 2])) == 0 && de.level > 1) && (q += 1), de.validationState != 1 && de.validationState != 2 && (ae += 1)), de.validationState == 2 && (re += 1));
    }), u({
      answer: ie,
      blank: q,
      error: re,
      remark: r.details.notes.length,
      clean: ae
    }), h().clientMode != 2 && window.addEventListener("resize", ra), document.getElementById("FormGear-loader").classList.add("hidden");
  });
  const la = (ie) => {
    document.documentElement.classList.toggle("dark");
    var re = document.querySelector(".button-switch"), q = document.querySelector(".outer-span"), ae = document.querySelector(".light-switch"), de = document.querySelector(".dark-switch");
    q.classList.toggle("translate-x-5"), re.classList.toggle("bg-gray-800"), ae.classList.toggle("opacity-100"), de.classList.toggle("opacity-100");
  }, sn = (ie) => {
    var re = document.querySelector(".sidebar-span");
    re.classList.toggle("-translate-x-full");
  }, Qi = () => {
    const ie = [], re = [], q = [];
    M({}), setTimeout(() => t.enable.updateDisabledSectionsCache(), 50), c.details.forEach((Re, An) => {
      Re.type > 3 && Re.enable && Re.answer !== void 0 && Re.answer !== "" && Re.answer !== null && L().findIndex((zn) => zn.parentIndex.toString() === Re.index.slice(0, -2).toString()) == -1 && ((Re.type === be.PHOTO || Re.type === be.SIGNATURE) && re.push({
        dataKey: Re.dataKey,
        name: Re.name,
        answer: Re.answer
      }), ie.push({
        dataKey: Re.dataKey,
        name: Re.name,
        answer: Re.answer
      }), Re.principal !== void 0 && q.push({
        dataKey: Re.dataKey,
        name: Re.name,
        answer: Re.answer,
        principal: Re.principal,
        columnName: Re.columnName
      }));
    }), $("details", "answers", ie), $("details", "templateDataKey", b.details.dataKey), $("details", "gearVersion", Vt), $("details", "templateVersion", e.template.details.version || "0.0.0"), $("details", "validationVersion", e.validation.details.version || "0.0.0"), $("details", "docState", oe()), $("details", "summary", JSON.parse(JSON.stringify(g))), $("details", "counter", [JSON.parse(JSON.stringify(y))]);
    let ae = vt().format("YYYY-MM-DD HH:mm:ss"), pe = (/* @__PURE__ */ new Date()).getTimezoneOffset(), xe = Number(pe / 60 * -1);
    vt.extend(nf), vt.extend(sf);
    let je = vt.tz.guess();
    x.details.createdBy === void 0 || x.details.createdBy !== void 0 && x.details.createdBy === "" ? $("details", "createdBy", h().username) : $("details", "updatedBy", h().username), x.details.createdAt === void 0 || x.details.createdAt !== void 0 && x.details.createdAt === "" ? ($("details", "createdAt", ae), $("details", "createdAtTimezone", je.toString()), $("details", "createdAtGMT", xe)) : ((x.details.createdAtTimezone === void 0 || x.details.createdAtTimezone !== void 0 && x.details.createdAtTimezone === "") && ($("details", "createdAtTimezone", je.toString()), $("details", "createdAtGMT", xe)), $("details", "updatedAt", ae), $("details", "updatedAtTimezone", je.toString()), $("details", "updatedAtGMT", xe)), p("details", "media", re), p("details", "templateDataKey", b.details.dataKey), p("details", "gearVersion", Vt), p("details", "templateVersion", e.template.details.version || "0.0.0"), p("details", "validationVersion", e.validation.details.version || "0.0.0"), a.details.createdBy === void 0 || a.details.createdBy !== void 0 && a.details.createdBy === "" ? p("details", "createdBy", h().username) : p("details", "updatedBy", h().username), a.details.createdAt === void 0 || a.details.createdAt !== void 0 && a.details.createdAt === "" ? (p("details", "createdAt", ae), p("details", "createdAtTimezone", je.toString()), p("details", "createdAtGMT", xe)) : ((a.details.createdAtTimezone === void 0 || a.details.createdAtTimezone !== void 0 && a.details.createdAtTimezone === "") && (p("details", "createdAtTimezone", je.toString()), p("details", "createdAtGMT", xe)), p("details", "updatedAt", ae), p("details", "updatedAtTimezone", je.toString()), p("details", "updatedAtGMT", xe)), s("details", "principals", q), s("details", "templateDataKey", b.details.dataKey), s("details", "gearVersion", Vt), s("details", "templateVersion", e.template.details.version || "0.0.0"), s("details", "validationVersion", e.validation.details.version || "0.0.0"), a.details.createdBy === void 0 || a.details.createdBy !== void 0 && a.details.createdBy === "" ? s("details", "createdBy", h().username) : s("details", "updatedBy", h().username), a.details.createdAt === void 0 || a.details.createdAt !== void 0 && a.details.createdAt === "" ? (s("details", "createdAt", ae), s("details", "createdAtTimezone", je.toString()), s("details", "createdAtGMT", xe)) : ((a.details.createdAtTimezone === void 0 || a.details.createdAtTimezone !== void 0 && a.details.createdAtTimezone === "") && (s("details", "createdAtTimezone", je.toString()), s("details", "createdAtGMT", xe)), s("details", "updatedAt", ae), s("details", "updatedAtTimezone", je.toString()), s("details", "updatedAtGMT", xe)), f("details", "notes", JSON.parse(JSON.stringify(r.details.notes))), f("details", "templateDataKey", b.details.dataKey), f("details", "gearVersion", Vt), f("details", "templateVersion", e.template.details.version || "0.0.0"), f("details", "validationVersion", e.validation.details.version || "0.0.0"), d.details.createdBy === void 0 || d.details.createdBy !== void 0 && d.details.createdBy === "" ? f("details", "createdBy", h().username) : f("details", "updatedBy", h().username), d.details.createdAt === void 0 || d.details.createdAt !== void 0 && d.details.createdAt === "" ? (f("details", "createdAt", ae), f("details", "createdAtTimezone", je.toString()), f("details", "createdAtGMT", xe)) : ((d.details.createdAtTimezone === void 0 || d.details.createdAtTimezone !== void 0 && d.details.createdAtTimezone === "") && (f("details", "createdAtTimezone", je.toString()), f("details", "createdAtGMT", xe)), f("details", "updatedAt", ae), f("details", "updatedAtTimezone", je.toString()), f("details", "updatedAtGMT", xe)), o("sidebar", C.details);
  }, Ht = () => {
    Qi(), e.setResponseMobile(x.details, S.details, d.details, a.details, c);
  };
  e.mobileExit(Ht);
  const aa = () => {
    Qi(), e.setSubmitMobile(x.details, S.details, d.details, a.details, c);
  }, Zi = (ie) => {
    if (Ht(), /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || h().clientMode === 2)
      var re = document.querySelector(".mobile-component-div");
    else
      var re = document.querySelector(".component-div");
    const q = C.details.filter((pe, xe) => pe.enable && xe < D.activeComponent.position);
    let ae = q.length;
    const de = C.details.findIndex((pe) => pe.dataKey === q[ae - 1].dataKey);
    M({}), setTimeout(() => P({
      dataKey: q[ae - 1].dataKey,
      label: q[ae - 1].label,
      index: JSON.parse(JSON.stringify(q[ae - 1].index)),
      position: de
    }), 50), window.scrollTo({
      top: 0,
      behavior: "smooth"
    }), re.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, Xi = (ie) => {
    if (Ht(), /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || h().clientMode === 2)
      var re = document.querySelector(".mobile-component-div");
    else
      var re = document.querySelector(".component-div");
    const q = C.details.filter((de, pe) => de.enable && pe > D.activeComponent.position), ae = C.details.findIndex((de) => de.dataKey === q[0].dataKey);
    M({}), setTimeout(() => P({
      dataKey: q[0].dataKey,
      label: q[0].label,
      index: JSON.parse(JSON.stringify(q[0].index)),
      position: ae
    }), 50), window.scrollTo({
      top: 0,
      behavior: "smooth"
    }), re.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, [er, tr] = K(!1), sa = () => {
    var ie = document.querySelector(".component-div");
    ie.scrollTop > 100 ? tr(!0) : ie.scrollTop <= 100 && tr(!1);
  }, [nr, ir] = K(!1), oa = () => {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      var ie = document.querySelector(".mobile-component-div");
      ie.scrollTop > 100 ? ir(!0) : ie.scrollTop <= 100 && ir(!1);
    }
  }, rr = (ie) => {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
      var re = document.querySelector(".mobile-component-div");
    else
      var re = document.querySelector(".component-div");
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    }), re.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, ki = (ie) => {
    let re = [], q = [];
    c.details.forEach((ae, de) => {
      if (L().findIndex((xe) => xe.parentIndex.toString() === ae.index.slice(0, -2).toString()) == -1) {
        if (ae.type > 4 && ae.enable && ae.validationState == 2) {
          let xe = ae.level > 1 ? ae.index.slice(0, -1) : ae.index.slice(0, -2);
          re.push({
            label: ae.label,
            message: ae.validationMessage,
            sideIndex: xe,
            dataKey: ae.dataKey
          });
        }
        if (ae.type > 4 && ae.enable && ae.validationState == 1) {
          let xe = ae.level > 1 ? ae.index.slice(0, -1) : ae.index.slice(0, -2);
          q.push({
            label: ae.label,
            message: ae.validationMessage,
            sideIndex: xe,
            dataKey: ae.dataKey
          });
        }
      }
    }), Se(JSON.parse(JSON.stringify(re))), rn(JSON.parse(JSON.stringify(q))), St(me().length, 3, 1, me(), 2), St(Ge().length, 3, 1, Ge(), 1), Y(!0);
  }, da = (ie) => {
    let re = [];
    r.details.notes.forEach((q) => {
      let ae = c.details.find((pe) => pe.dataKey == q.dataKey), de = ae.level > 1 ? ae.index.slice(0, -1) : ae.index.slice(0, -2);
      re.push({
        label: ae.label,
        sideIndex: de,
        dataKey: ae.dataKey
      });
    }), Ql(JSON.parse(JSON.stringify(re))), St(vn().length, 3, 1, vn(), 4), G(!0);
  }, ca = (ie) => {
    let re = [];
    c.details.forEach((q, ae) => {
      if (L().findIndex((pe) => pe.parentIndex.toString() === q.index.slice(0, -2).toString()) == -1 && q.type > be.VARIABLE && q.enable && (q.answer === void 0 || q.answer === "" || q.type === be.LIST_TEXT_REPEAT && Array.isArray(q.answer) && q.answer.length === 1 || q.type === be.LIST_SELECT_REPEAT && Array.isArray(q.answer) && q.answer.length === 1) && !(JSON.parse(JSON.stringify(q.index[q.index.length - 2])) === 0 && q.level > 1)) {
        let pe = q.level > 1 ? q.index.slice(0, -1) : q.index.slice(0, -2);
        re.push({
          label: q.label,
          sideIndex: pe,
          dataKey: q.dataKey
        });
      }
    }), tn(JSON.parse(JSON.stringify(re))), St(zt().length, 3, 1, zt(), 3), _e(!0);
  }, St = (ie, re, q, ae, de) => {
    let pe = Math.ceil(ie / re), xe = re * q - re, je = re * q, Re = ae.slice(xe, je);
    de == 2 ? (Ce(q), kt(pe), Ke(JSON.parse(JSON.stringify(Re)))) : de == 1 ? (rt(q), Ln(pe), $t(JSON.parse(JSON.stringify(Re)))) : de == 3 ? (ql(q), Yl(pe), ln(JSON.parse(JSON.stringify(Re)))) : de == 4 && (ea(q), na(pe), Xl(JSON.parse(JSON.stringify(Re))));
  }, Bn = (ie, re, q) => {
    const ae = C.details.findIndex((xe) => xe.index.toString() === re.toString());
    let de = C.details[ae];
    Y(!1), G(!1), _e(!1), /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && sn(), M({}), setTimeout(() => P({
      dataKey: de.dataKey,
      label: de.label,
      index: JSON.parse(JSON.stringify(de.index)),
      position: ae
    }), 50);
    var pe = document.getElementById(q + "___scrollView");
    pe.scrollIntoView({
      behavior: "smooth"
    });
  };
  function ua() {
    g.error > 0 ? se("E") : c.details.filter((ie) => Number(ie.validationState) === 1).length > 0 ? se("W") : se("C");
  }
  function lr() {
    let ie = [];
    for (let re = 0; re < 6; re++)
      re % 2, ie[re] = Math.floor(Math.random() * 10 + 0);
    H(ie.join(""));
  }
  const ar = (ie) => {
    M({}), setTimeout(() => t.enable.updateDisabledSectionsCache(), 50), g.error > 0 && ki();
  }, ha = () => {
    c.details.forEach((ie, re) => {
      let q = JSON.parse(JSON.stringify(ie));
      if (L().findIndex((de) => de.parentIndex.toString() === q.index.slice(0, -2).toString()) == -1 && q.enable && q.required !== void 0 && q.required) {
        let pe = q.dataKey.split("@")[0].split("#");
        if (q.level < 2 || q.level > 1 && pe[1] !== void 0) {
          let xe = typeof q.answer;
          (q.answer === void 0 || q.answer !== void 0 && xe === "string" && q.answer === "" || q.answer !== void 0 && xe === "number" && q.answer == 0 || q.answer !== void 0 && xe === "object" && Number(q.type) == 21 && q.answer.length < 2 || q.answer !== void 0 && xe === "object" && Number(q.type) == 22 && q.answer.length < 2 || q.answer !== void 0 && xe === "object" && q.type > 22 && q.answer.length == 0 || xe === "object" && !isNaN(q.answer) || xe === "number" && isNaN(q.answer) || JSON.stringify(q.answer) === "[]") && (q.validationMessage.push(n.details.language[0].validationRequired), q.validationState = 2), o("details", re, q);
        }
      }
    });
  }, $i = (ie) => {
    lr(), ua(), oe() === "E" ? ke(n.details.language[0].submitInvalid, 3e3) : (M({}), setTimeout(() => t.enable.updateDisabledSectionsCache(), 50), ha(), g.error === 0 ? (oe() === "W" && ho(n.details.language[0].submitWarning, 3e3), F(!0)) : ke(n.details.language[0].submitEmpty, 3e3));
  }, ga = (ie) => {
    ne().length !== 0 && ne() === U() ? (aa(), F(!1), jn(n.details.language[0].verificationSubmitted, 3e3)) : ke(n.details.language[0].verificationInvalid, 3e3);
  };
  let fa = (/* @__PURE__ */ new Date()).getTime() - e.timeStart.getTime();
  return (() => {
    var ie = Ef(), re = ie.firstChild, q = re.firstChild, ae = q.firstChild, de = ae.firstChild, pe = de.firstChild, xe = pe.firstChild, je = xe.firstChild, Re = je.firstChild, An = Re.firstChild, bn = An.nextSibling, zn = Re.nextSibling, va = zn.firstChild, ma = zn.nextSibling, ba = ma.firstChild;
    je.nextSibling;
    var wn = xe.nextSibling, _i = wn.firstChild, Fn = _i.firstChild, wa = Fn.nextSibling, Si = _i.nextSibling, xa = Si.firstChild, Ci = pe.nextSibling, Mi = Ci.firstChild, Hn = Mi.firstChild, ya = Hn.nextSibling, Jn = Mi.nextSibling, pa = Jn.firstChild, ka = Jn.nextSibling;
    return _(ie, m(j, {
      get when() {
        return B();
      },
      get children() {
        var Z = hf(), Oe = Z.firstChild, Ve = Oe.firstChild, et = Ve.nextSibling, We = et.nextSibling, Fe = We.firstChild, qe = Fe.firstChild, tt = qe.firstChild, lt = tt.nextSibling, bt = lt.firstChild, ct = bt.nextSibling, nt = ct.nextSibling, at = nt.firstChild, wt = at.nextSibling, ft = nt.nextSibling, xt = ft.firstChild, Qe = Fe.nextSibling, $e = Qe.firstChild, ut = $e.nextSibling;
        return Ve.$$click = (st) => F(!1), _(at, U), wt.$$click = lr, xt.addEventListener("change", (st) => {
          X(st.currentTarget.value);
        }), $e.$$click = (st) => ga(), ut.$$click = (st) => F(!1), Z;
      }
    }), re), _(ie, m(j, {
      get when() {
        return Q();
      },
      get children() {
        var Z = gf(), Oe = Z.firstChild, Ve = Oe.firstChild, et = Ve.nextSibling, We = et.nextSibling, Fe = We.firstChild, qe = Fe.firstChild, tt = qe.firstChild, lt = tt.nextSibling, bt = lt.firstChild, ct = bt.nextSibling, nt = ct.firstChild, at = nt.firstChild, wt = at.firstChild, ft = wt.nextSibling, xt = nt.nextSibling, Qe = xt.firstChild, $e = Qe.nextSibling, ut = $e.nextSibling, st = Fe.nextSibling, At = st.firstChild;
        return Ve.$$click = (ge) => G(!1), _(ft, m(fe, {
          get each() {
            return Zl();
          },
          children: (ge, De) => (() => {
            var He = Kr(), Ie = He.firstChild, ot = Ie.firstChild;
            ot.firstChild;
            var Ze = Ie.nextSibling, Dt = Ze.firstChild, yt = Ze.nextSibling, Pt = yt.firstChild;
            return _(ot, () => Number(De()) + 1 + (mn() * 3 - 3), null), Pt.$$click = (Jt) => {
              Bn(Jt, ge.sideIndex, ge.dataKey);
            }, R(() => Dt.innerHTML = ge.label), He;
          })()
        })), Qe.$$click = (ge) => St(vn().length, 3, mn() - 1, vn(), 4), _($e, mn), ut.$$click = (ge) => St(vn().length, 3, mn() + 1, vn(), 4), At.$$click = (ge) => G(!1), R((ge) => {
          var De = mn() == 1, He = mn() == ta();
          return De !== ge.e && (Qe.disabled = ge.e = De), He !== ge.t && (ut.disabled = ge.t = He), ge;
        }, {
          e: void 0,
          t: void 0
        }), Z;
      }
    }), re), _(ie, m(j, {
      get when() {
        return le();
      },
      get children() {
        var Z = ff(), Oe = Z.firstChild, Ve = Oe.firstChild, et = Ve.nextSibling, We = et.nextSibling, Fe = We.firstChild, qe = Fe.firstChild, tt = qe.firstChild, lt = tt.nextSibling, bt = lt.firstChild, ct = bt.nextSibling, nt = ct.firstChild, at = nt.firstChild, wt = at.firstChild, ft = wt.nextSibling, xt = nt.nextSibling, Qe = xt.firstChild, $e = Qe.nextSibling, ut = $e.nextSibling, st = Fe.nextSibling, At = st.firstChild;
        return Ve.$$click = (ge) => _e(!1), _(ft, m(fe, {
          get each() {
            return _t();
          },
          children: (ge, De) => (() => {
            var He = Kr(), Ie = He.firstChild, ot = Ie.firstChild;
            ot.firstChild;
            var Ze = Ie.nextSibling, Dt = Ze.firstChild, yt = Ze.nextSibling, Pt = yt.firstChild;
            return _(ot, () => Number(De()) + 1 + (Ft() * 3 - 3), null), Pt.$$click = (Jt) => {
              Bn(Jt, ge.sideIndex, ge.dataKey);
            }, R(() => Dt.innerHTML = ge.label), He;
          })()
        })), Qe.$$click = (ge) => St(zt().length, 3, Ft() - 1, zt(), 3), _($e, Ft), ut.$$click = (ge) => St(zt().length, 3, Ft() + 1, zt(), 3), At.$$click = (ge) => _e(!1), R((ge) => {
          var De = Ft() == 1, He = Ft() == Gl();
          return De !== ge.e && (Qe.disabled = ge.e = De), He !== ge.t && (ut.disabled = ge.t = He), ge;
        }, {
          e: void 0,
          t: void 0
        }), Z;
      }
    }), re), _(ie, m(j, {
      get when() {
        return W();
      },
      get children() {
        var Z = mf(), Oe = Z.firstChild, Ve = Oe.firstChild, et = Ve.nextSibling, We = et.nextSibling, Fe = We.firstChild, qe = Fe.firstChild, tt = qe.firstChild, lt = tt.nextSibling, bt = lt.firstChild, ct = bt.nextSibling, nt = ct.firstChild, at = nt.firstChild, wt = at.firstChild, ft = wt.nextSibling, xt = nt.nextSibling, Qe = xt.firstChild, $e = Qe.nextSibling, ut = $e.nextSibling, st = Fe.nextSibling, At = st.firstChild;
        return Ve.$$click = (ge) => Y(!1), _(ft, m(fe, {
          get each() {
            return ve();
          },
          children: (ge, De) => (() => {
            var He = Br(), Ie = He.firstChild, ot = Ie.firstChild;
            ot.firstChild;
            var Ze = Ie.nextSibling, Dt = Ze.firstChild, yt = Ze.nextSibling, Pt = yt.nextSibling, Jt = Pt.firstChild;
            return _(ot, () => Number(De()) + 1 + (he() * 3 - 3), null), _(yt, m(fe, {
              get each() {
                return ge.message;
              },
              children: (Le, Kt) => (() => {
                var Rt = zr(), Je = Rt.firstChild, Nt = Je.nextSibling;
                return _(Nt, Le), Rt;
              })()
            })), Jt.$$click = (Le) => {
              Bn(Le, ge.sideIndex, ge.dataKey);
            }, R(() => Dt.innerHTML = ge.label), He;
          })()
        })), Qe.$$click = (ge) => St(me().length, 3, he() - 1, me(), 2), _($e, he), ut.$$click = (ge) => St(me().length, 3, he() + 1, me(), 2), _(Fe, m(j, {
          get when() {
            return Ge().length > 0;
          },
          get children() {
            var ge = vf(), De = ge.firstChild, He = De.nextSibling, Ie = He.firstChild, ot = Ie.nextSibling, Ze = ot.firstChild, Dt = Ze.firstChild, yt = Dt.firstChild, Pt = yt.nextSibling, Jt = Ze.nextSibling, Le = Jt.firstChild, Kt = Le.nextSibling, Rt = Kt.nextSibling;
            return _(Pt, m(fe, {
              get each() {
                return Ye();
              },
              children: (Je, Nt) => (() => {
                var nn = Br(), Un = nn.firstChild, ze = Un.firstChild;
                ze.firstChild;
                var Ut = Un.nextSibling, on = Ut.firstChild, dn = Ut.nextSibling, xn = dn.nextSibling, Wn = xn.firstChild;
                return _(ze, () => Number(Nt()) + 1 + (Be() * 3 - 3), null), _(dn, m(fe, {
                  get each() {
                    return Je.message;
                  },
                  children: (Rn, Wt) => (() => {
                    var cn = zr(), Ii = cn.firstChild, qn = Ii.nextSibling;
                    return _(qn, Rn), cn;
                  })()
                })), Wn.$$click = (Rn) => {
                  Bn(Rn, Je.sideIndex, Je.dataKey);
                }, R(() => on.innerHTML = Je.label), nn;
              })()
            })), Le.$$click = (Je) => St(Ge().length, 3, Be() - 1, Ge(), 1), _(Kt, Be), Rt.$$click = (Je) => St(Ge().length, 3, Be() + 1, Ge(), 1), R((Je) => {
              var Nt = Be() == 1, nn = Be() == Lt();
              return Nt !== Je.e && (Le.disabled = Je.e = Nt), nn !== Je.t && (Rt.disabled = Je.t = nn), Je;
            }, {
              e: void 0,
              t: void 0
            }), ge;
          }
        }), null), At.$$click = (ge) => Y(!1), R((ge) => {
          var De = he() == 1, He = he() == it();
          return De !== ge.e && (Qe.disabled = ge.e = De), He !== ge.t && (ut.disabled = ge.t = He), ge;
        }, {
          e: void 0,
          t: void 0
        }), Z;
      }
    }), re), de.addEventListener("scroll", oa), _(de, m(j, {
      get when() {
        return w("clientMode") != Mt.PAPI;
      },
      get children() {
        var Z = xf(), Oe = Z.firstChild, Ve = Oe.firstChild, et = Oe.nextSibling, We = et.firstChild, Fe = et.nextSibling, qe = Fe.firstChild, tt = qe.firstChild, lt = tt.firstChild, bt = lt.firstChild, ct = lt.nextSibling, nt = ct.firstChild, at = ct.nextSibling, wt = at.firstChild, ft = at.nextSibling, xt = ft.firstChild, Qe = tt.nextSibling;
        return _(Oe, m(we, {
          get fallback() {
            return (() => {
              var $e = Pr();
              return R(() => $e.innerHTML = e.template.details.acronym + '<div class="text-xs font-light text-gray-600 dark:text-gray-400">🚀' + Vt + " 📋" + (e.template.details.version || "0.0.0") + " ✔️" + (e.validation.details.version || "0.0.0") + "</div>"), $e;
            })();
          },
          get children() {
            return m(ee, {
              get when() {
                return h().clientMode == Mt.CAWI;
              },
              get children() {
                var $e = Pr();
                return R(() => $e.innerHTML = e.template.details.acronym), $e;
              }
            });
          }
        }), Ve), Ve.$$click = sn, _(We, m(fe, {
          get each() {
            return C.details;
          },
          children: ($e, ut) => m(j, {
            get when() {
              return ue(() => $e.level == 0)() && $e.enable;
            },
            get children() {
              var st = Of(), At = st.firstChild, ge = At.firstChild, De = ge.firstChild, He = De.firstChild;
              return ge.$$click = (Ie) => {
                var ot = document.querySelector(".component-div");
                window.scrollTo({
                  top: 0,
                  behavior: "smooth"
                }), ot.scrollTo({
                  top: 0,
                  behavior: "smooth"
                }), /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && sn(), Ht(), M({}), setTimeout(() => P({
                  dataKey: $e.dataKey,
                  label: $e.label,
                  index: JSON.parse(JSON.stringify($e.index)),
                  position: ut()
                }), 50);
              }, _(ge, () => $e.label, De), _(At, m(fe, {
                get each() {
                  return C.details;
                },
                children: (Ie, ot) => m(j, {
                  get when() {
                    return ue(() => Ie.level == 1 && $e.index[1] == Ie.index[1])() && Ie.enable;
                  },
                  get children() {
                    var Ze = Fr(), Dt = Ze.firstChild, yt = Dt.firstChild, Pt = yt.firstChild, Jt = Pt.firstChild;
                    return yt.$$click = (Le) => {
                      var Kt = document.querySelector(".component-div");
                      window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                      }), Kt.scrollTo({
                        top: 0,
                        behavior: "smooth"
                      }), /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && sn(), Ht(), M({}), setTimeout(() => P({
                        dataKey: Ie.dataKey,
                        label: Ie.label,
                        index: JSON.parse(JSON.stringify(Ie.index)),
                        position: ot()
                      }), 50);
                    }, _(yt, () => Ie.label, Pt), _(Dt, m(fe, {
                      get each() {
                        return C.details;
                      },
                      children: (Le, Kt) => m(j, {
                        get when() {
                          return ue(() => Le.level == 2 && $e.index[1] == Ie.index[1] && Ie.index[1] == Le.index[1] && Ie.index[3] == Le.index[3] && Ie.index[4] == Le.index[4])() && Le.enable;
                        },
                        get children() {
                          var Rt = Lf(), Je = Rt.firstChild, Nt = Je.firstChild, nn = Nt.firstChild, Un = nn.firstChild;
                          return Nt.$$click = (ze) => {
                            var Ut = document.querySelector(".component-div");
                            window.scrollTo({
                              top: 0,
                              behavior: "smooth"
                            }), Ut.scrollTo({
                              top: 0,
                              behavior: "smooth"
                            }), /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && sn(), Ht(), M({}), setTimeout(() => P({
                              dataKey: Le.dataKey,
                              label: Le.label,
                              index: JSON.parse(JSON.stringify(Le.index)),
                              position: Kt()
                            }), 50);
                          }, _(Nt, () => Le.label, nn), _(Je, m(fe, {
                            get each() {
                              return C.details;
                            },
                            children: (ze, Ut) => m(j, {
                              get when() {
                                return ue(() => ze.level == 3 && $e.index[1] == Ie.index[1] && Ie.index[1] == Le.index[1] && Ie.index[3] == Le.index[3] && Le.index[5] == ze.index[5] && Le.index[6] == ze.index[6])() && ze.enable;
                              },
                              get children() {
                                var on = Fr(), dn = on.firstChild, xn = dn.firstChild, Wn = xn.firstChild, Rn = Wn.firstChild;
                                return xn.$$click = (Wt) => {
                                  var cn = document.querySelector(".component-div");
                                  window.scrollTo({
                                    top: 0,
                                    behavior: "smooth"
                                  }), cn.scrollTo({
                                    top: 0,
                                    behavior: "smooth"
                                  }), /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && sn(), Ht(), M({}), setTimeout(() => P({
                                    dataKey: ze.dataKey,
                                    label: ze.label,
                                    index: JSON.parse(JSON.stringify(ze.index)),
                                    position: Ut()
                                  }), 50);
                                }, _(xn, () => ze.label, Wn), R((Wt) => {
                                  var cn = $e.index[1] === D.activeComponent.index[1], Ii = {
                                    "bg-blue-800 text-white": ze.dataKey === D.activeComponent.dataKey
                                  }, qn = ze.description;
                                  return cn !== Wt.e && on.classList.toggle("show", Wt.e = cn), Wt.t = te(xn, Ii, Wt.t), qn !== Wt.a && (Rn.innerHTML = Wt.a = qn), Wt;
                                }, {
                                  e: void 0,
                                  t: void 0,
                                  a: void 0
                                }), on;
                              }
                            })
                          }), null), R((ze) => {
                            var Ut = $e.index[1] === D.activeComponent.index[1], on = {
                              "bg-blue-800 text-white": Le.dataKey === D.activeComponent.dataKey
                            }, dn = Le.description;
                            return Ut !== ze.e && Rt.classList.toggle("show", ze.e = Ut), ze.t = te(Nt, on, ze.t), dn !== ze.a && (Un.innerHTML = ze.a = dn), ze;
                          }, {
                            e: void 0,
                            t: void 0,
                            a: void 0
                          }), Rt;
                        }
                      })
                    }), null), R((Le) => {
                      var Kt = $e.index[1] === D.activeComponent.index[1], Rt = {
                        "bg-blue-800 text-white": Ie.dataKey === D.activeComponent.dataKey
                      }, Je = Ie.description;
                      return Kt !== Le.e && Ze.classList.toggle("show", Le.e = Kt), Le.t = te(yt, Rt, Le.t), Je !== Le.a && (Jt.innerHTML = Le.a = Je), Le;
                    }, {
                      e: void 0,
                      t: void 0,
                      a: void 0
                    }), Ze;
                  }
                })
              }), null), R((Ie) => {
                var ot = {
                  "bg-blue-800 text-white": $e.dataKey === D.activeComponent.dataKey
                }, Ze = $e.description;
                return Ie.e = te(ge, ot, Ie.e), Ze !== Ie.t && (He.innerHTML = Ie.t = Ze), Ie;
              }, {
                e: void 0,
                t: void 0
              }), st;
            }
          })
        })), _(lt, () => g.answer, bt), _(bt, () => n.details.language[0].summaryAnswer), ct.$$click = ca, _(ct, () => g.blank, nt), _(nt, () => n.details.language[0].summaryBlank), at.$$click = ar, _(at, () => g.error, wt), _(wt, () => n.details.language[0].summaryError), ft.$$click = da, _(ft, () => g.remark, xt), _(xt, () => n.details.language[0].summaryRemark), _(Qe, m(we, {
          get children() {
            return [m(ee, {
              get when() {
                return ue(() => g.error == 0)() && A().formMode == 1;
              },
              get children() {
                var $e = bf();
                return $e.$$click = $i, $e;
              }
            }), m(ee, {
              get when() {
                return ue(() => g.error > 0)() && A().formMode < 3;
              },
              get children() {
                var $e = wf();
                return $e.$$click = ar, $e;
              }
            })];
          }
        })), Z;
      }
    }), pe), pe.addEventListener("scroll", sa), _(Re, m(we, {
      get children() {
        return m(ee, {
          get when() {
            return h().clientMode == 2;
          },
          get children() {
            var Z = yf(), Oe = Z.firstChild, Ve = Oe.nextSibling, et = Ve.nextSibling, We = et.nextSibling;
            return We.nextSibling, _(Z, E, Ve), _(Z, fa, We), Z;
          }
        });
      }
    }), null), va.$$click = la, ba.$$click = sn, _(xe, m(j, {
      get when() {
        return w("clientMode") == Mt.PAPI;
      },
      get children() {
        var Z = pf(), Oe = Z.firstChild;
        return _(Oe, m(fe, {
          get each() {
            return C.details;
          },
          children: (Ve, et) => m(j, {
            when: !0,
            get children() {
              var We = Af(), Fe = We.firstChild;
              return Fe.$$click = (qe) => {
                var tt = document.querySelector(".component-div");
                window.scrollTo({
                  top: 0,
                  behavior: "smooth"
                }), tt.scrollTo({
                  top: 0,
                  behavior: "smooth"
                }), h().clientMode === Mt.CAPI && Ht(), M({}), setTimeout(() => P({
                  dataKey: Ve.dataKey,
                  label: Ve.label,
                  index: JSON.parse(JSON.stringify(Ve.index)),
                  position: et()
                }), 50), Rf();
              }, _(Fe, () => Ve.label), R((qe) => {
                var tt = {
                  " border-b-4 border-blue-800": Ve.dataKey === D.activeComponent.dataKey
                }, lt = {
                  "bg-blue-800 text-white": Ve.dataKey === D.activeComponent.dataKey
                };
                return qe.e = te(We, tt, qe.e), qe.t = te(Fe, lt, qe.t), qe;
              }, {
                e: void 0,
                t: void 0
              }), We;
            }
          })
        })), Z;
      }
    }), null), _(pe, m(Zg, {
      get onMobile() {
        return an();
      },
      get components() {
        return ia();
      },
      get dataKey() {
        return D.activeComponent.dataKey;
      },
      index: [0],
      get config() {
        return h();
      },
      get uploadHandler() {
        return e.uploadHandler;
      },
      get GpsHandler() {
        return e.GpsHandler;
      },
      get offlineSearch() {
        return e.offlineSearch;
      },
      get onlineSearch() {
        return e.onlineSearch;
      },
      get openMap() {
        return e.openMap;
      },
      get setResponseMobile() {
        return e.setResponseMobile;
      }
    }), wn), Fn.$$click = Zi, _(wa, () => D.activeComponent.label), _(_i, m(we, {
      get children() {
        return [m(ee, {
          get when() {
            return ue(() => C.details.filter((Z, Oe) => Z.enable && Oe > D.activeComponent.position).length === 0)() && g.error > 0;
          },
          get children() {
            var Z = kf();
            return Z.$$click = ki, Z;
          }
        }), m(ee, {
          get when() {
            return ue(() => C.details.filter((Z, Oe) => Z.enable && Oe > D.activeComponent.position).length === 0 && g.error == 0)() && A().formMode == 1;
          },
          get children() {
            var Z = $f();
            return Z.$$click = $i, Z;
          }
        }), m(ee, {
          get when() {
            return C.details.filter((Z, Oe) => Z.enable && Oe > D.activeComponent.position).length > 0;
          },
          get children() {
            var Z = _f();
            return Z.$$click = Xi, R(() => Z.classList.toggle("visible", C.details.filter((Oe, Ve) => Oe.enable && Ve > D.activeComponent.position).length > 0)), Z;
          }
        })];
      }
    }), null), xa.$$click = rr, Hn.$$click = Zi, _(ya, () => D.activeComponent.label), _(Mi, m(we, {
      get children() {
        return [m(ee, {
          get when() {
            return ue(() => C.details.filter((Z, Oe) => Z.enable && Oe > D.activeComponent.position).length === 0)() && g.error > 0;
          },
          get children() {
            var Z = Sf();
            return Z.$$click = ki, Z;
          }
        }), m(ee, {
          get when() {
            return ue(() => C.details.filter((Z, Oe) => Z.enable && Oe > D.activeComponent.position).length === 0 && g.error == 0)() && A().formMode == 1;
          },
          get children() {
            var Z = Cf();
            return Z.$$click = $i, Z;
          }
        }), m(ee, {
          get when() {
            return C.details.filter((Z, Oe) => Z.enable && Oe > D.activeComponent.position).length > 0;
          },
          get children() {
            var Z = Mf();
            return Z.$$click = Xi, Z;
          }
        })];
      }
    }), null), pa.$$click = rr, _(ka, m(j, {
      get when() {
        return A().formMode < 3;
      },
      get children() {
        var Z = If();
        return Z.$$click = Ht, Z;
      }
    })), R((Z) => {
      var Oe = h().clientMode !== Mt.PAPI, Ve = h().clientMode === Mt.PAPI, et = e.template.details.title, We = e.template.details.description, Fe = an() === !1, qe = an() === !0, tt = an() === !1, lt = an() === !0, bt = h().clientMode < Mt.PAPI, ct = h().clientMode == Mt.PAPI, nt = C.details.filter((ge, De) => ge.enable && De < D.activeComponent.position).length === 0, at = C.details.filter((ge, De) => ge.enable && De < D.activeComponent.position).length > 0, wt = er() === !0, ft = er() === !1, xt = an() === !0, Qe = an() === !1, $e = C.details.filter((ge, De) => ge.enable && De < D.activeComponent.position).length === 0, ut = C.details.filter((ge, De) => ge.enable && De < D.activeComponent.position).length > 0, st = nr() === !0, At = nr() === !1;
      return Oe !== Z.e && xe.classList.toggle("top-0", Z.e = Oe), Ve !== Z.t && xe.classList.toggle("-top-[121px]", Z.t = Ve), et !== Z.a && (An.innerHTML = Z.a = et), We !== Z.o && (bn.innerHTML = Z.o = We), Fe !== Z.i && bn.classList.toggle("flex", Z.i = Fe), qe !== Z.n && bn.classList.toggle("hidden", Z.n = qe), tt !== Z.s && wn.classList.toggle("flex", Z.s = tt), lt !== Z.h && wn.classList.toggle("hidden", Z.h = lt), bt !== Z.r && wn.classList.toggle("sticky", Z.r = bt), ct !== Z.d && wn.classList.toggle("absolute", Z.d = ct), nt !== Z.l && Fn.classList.toggle("hidden", Z.l = nt), at !== Z.u && Fn.classList.toggle("visible", Z.u = at), wt !== Z.c && Si.classList.toggle("flex", Z.c = wt), ft !== Z.w && Si.classList.toggle("hidden", Z.w = ft), xt !== Z.m && Ci.classList.toggle("flex", Z.m = xt), Qe !== Z.f && Ci.classList.toggle("hidden", Z.f = Qe), $e !== Z.y && Hn.classList.toggle("hidden", Z.y = $e), ut !== Z.g && Hn.classList.toggle("visible", Z.g = ut), st !== Z.p && Jn.classList.toggle("flex", Z.p = st), At !== Z.b && Jn.classList.toggle("hidden", Z.b = At), Z;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0,
      n: void 0,
      s: void 0,
      h: void 0,
      r: void 0,
      d: void 0,
      l: void 0,
      u: void 0,
      c: void 0,
      w: void 0,
      m: void 0,
      f: void 0,
      y: void 0,
      g: void 0,
      p: void 0,
      b: void 0
    }), ie;
  })();
};
ye(["click"]);
var Vf = /* @__PURE__ */ k('<div class="backdrop-blur-sm overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex"><svg class="w-20 h-20 animate-spin"xmlns=http://www.w3.org/2000/svg viewBox="0 0 94.53 98.372"><circle cx=23.536 cy=16.331 r=8.646 style=fill:#0a77e8></circle><circle cx=8.646 cy=36.698 r=8.646 style=fill:#0f9af0></circle><circle cx=8.646 cy=61.867 r=8.646 style=fill:#0f9af0></circle><circle cx=23.536 cy=82.233 r=8.646 style=fill:#13bdf7></circle><circle cx=47.361 cy=89.726 r=8.646 style=fill:#13bdf7></circle><circle cx=71.282 cy=82.233 r=8.646 style=fill:#18e0ff></circle><circle cx=85.884 cy=61.867 r=8.646 style=fill:#65eaff></circle><circle cx=85.884 cy=36.698 r=8.646 style=fill:#b2f5ff></circle><circle cx=47.361 cy=8.646 r=8.646 style=fill:#1d4970>');
function Tf(e) {
  let t = jt({
    type: "success",
    autoHideDuration: 70
  }, e), n;
  return Gr(() => {
    n = setTimeout(() => t.remove(), t.autoHideDuration);
  }), bi(() => {
    clearTimeout(n);
  }), Vf();
}
var jf = /* @__PURE__ */ k("<div>");
function Df() {
  const {
    loader: e
  } = zg(), {
    removeLoader: t
  } = Ji();
  return (() => {
    var n = jf();
    return _(n, () => e.map((i) => m(Tf, {
      get remove() {
        return t(i.id);
      }
    }))), n;
  })();
}
const Pf = {
  status: 1,
  details: {
    language: [
      {
        componentAdded: "The component was successfully added!",
        componentDeleted: "The component was successfully deleted!",
        componentEdited: "The component was successfully edited!",
        componentEmpty: "The component can not be empty",
        componentNotAllowed: "Only 1 component is allowed to edit",
        componentRendered: "Related components is rendering, please wait.",
        componentSelected: "This component has already being selected",
        fetchFailed: "Failed to fetch the data.",
        fileInvalidFormat: "Please submit the appropriate format!",
        fileInvalidMaxSize: "The maximum of allowed size is ",
        fileInvalidMinSize: "The minimum of allowed size is ",
        fileUploaded: "File uploaded successfully!",
        locationAcquired: "Location successfully acquired!",
        remarkAdded: "The remark was successfully added!",
        remarkEmpty: "The remark can not be empty!",
        submitEmpty: "Please make sure your submission is fully filled",
        submitInvalid: "Please make sure your submission is valid",
        submitWarning: "The submission you are about to submit still contains a warning",
        summaryAnswer: "Answer",
        summaryBlank: "Blank",
        summaryError: "Error",
        summaryRemark: "Remark",
        uploadCsv: "Upload CSV file",
        uploadImage: "Upload image file",
        validationDate: "Invalid date format",
        validationInclude: "Allowed values are $values",
        validationMax: "The biggest value is",
        validationMaxLength: "The maximum of allowed character is",
        validationMin: "The smallest value is",
        validationMinLength: "The minimum of allowed character is",
        validationRequired: "Required",
        validationStep: "The value must be a multiple of",
        verificationInvalid: "Please provide verification correctly",
        verificationSubmitted: "The data is now being submitted. Thank you!",
        validationUrl: "Invalid URL address, please provide with https://",
        validationEmail: "Invalid email address",
        validationApi: "Invalid input from api response",
        errorSaving: "Something went wrong while saving on component ",
        errorExpression: "Something went wrong while evaluating expression on component ",
        errorEnableExpression: "Something went wrong while evaluating enable on component ",
        errorValidationExpression: "Something went wrong while evaluating validation expression on component "
      }
    ]
  }
};
function Kf(e) {
  const t = [];
  function n(T) {
    const [A, z] = Bi(T);
    return [A, z];
  }
  function i(T) {
    const [A, z] = K(T);
    return [A, z];
  }
  const r = n({
    details: [],
    sidebar: []
  }), l = n({
    status: 1,
    details: Ae({
      dataKey: "",
      answers: [],
      summary: [],
      counter: []
    }, e == null ? void 0 : e.response)
  }), a = n({
    status: 1,
    details: Ae({
      description: "",
      dataKey: "",
      acronym: "",
      title: "",
      version: "",
      components: []
    }, e == null ? void 0 : e.template)
  }), s = n({
    status: 1,
    details: Ae({
      description: "",
      dataKey: "",
      version: "",
      testFunctions: []
    }, e == null ? void 0 : e.validation)
  }), c = n({
    status: 1,
    details: Ae({
      description: "",
      dataKey: "",
      predata: []
    }, e == null ? void 0 : e.preset)
  }), o = n({
    status: 1,
    details: Ae({
      dataKey: "",
      media: []
    }, e == null ? void 0 : e.media)
  }), d = n({
    status: 1,
    details: Ae({
      dataKey: "",
      notes: []
    }, e == null ? void 0 : e.remark)
  }), f = n({
    details: []
  }), x = n(
    (e == null ? void 0 : e.locale) || Pf
  ), $ = n({
    answer: 0,
    blank: 0,
    error: 0,
    remark: 0,
    clean: 0
  }), C = n({
    render: 0,
    validate: 0
  }), g = n({
    currentDataKey: ""
  }), u = n({
    details: []
  }), b = n({
    status: 1,
    details: {
      dataKey: "",
      notes: []
    }
  }), y = n({
    status: 1,
    details: {
      principals: []
    }
  }), S = i({}), p = i({}), L = i({}), V = i({}), v = i({}), h = i({}), w = i(
    {}
  ), E = i(!1), I = i([]), M = i([]), O = i([]);
  return {
    // Main stores
    reference: r,
    response: l,
    template: a,
    validation: s,
    preset: c,
    media: o,
    remark: d,
    sidebar: f,
    locale: x,
    // Helper stores
    summary: $,
    counter: C,
    input: g,
    nested: u,
    note: b,
    principal: y,
    // Signals
    referenceMap: S,
    sidebarIndexMap: p,
    compEnableMap: L,
    compValidMap: V,
    compSourceOptionMap: v,
    compVarMap: h,
    compSourceQuestionMap: w,
    referenceHistoryEnable: E,
    referenceHistory: I,
    sidebarHistory: M,
    referenceEnableFalse: O,
    // Cleanup
    dispose: () => {
      t.forEach((T) => T()), t.length = 0, r[1]({ details: [], sidebar: [] }), l[1]({ status: 1, details: { dataKey: "", answers: [], summary: [], counter: [] } }), a[1]({ status: 1, details: { description: "", dataKey: "", acronym: "", title: "", version: "", components: [] } }), s[1]({ status: 1, details: { description: "", dataKey: "", version: "", testFunctions: [] } }), c[1]({ status: 1, details: { description: "", dataKey: "", predata: [] } }), o[1]({ status: 1, details: { dataKey: "", media: [] } }), d[1]({ status: 1, details: { dataKey: "", notes: [] } }), f[1]({ details: [] }), $[1]({ answer: 0, blank: 0, error: 0, remark: 0, clean: 0 }), C[1]({ render: 0, validate: 0 }), g[1]({ currentDataKey: "" }), u[1]({ details: [] }), b[1]({ status: 1, details: { dataKey: "", notes: [] } }), y[1]({ status: 1, details: { principals: [] } }), S[1]({}), p[1]({}), L[1]({}), V[1]({}), v[1]({}), h[1]({}), w[1]({}), E[1](!1), I[1]([]), M[1]([]), O[1]([]), console.log("FormGear stores disposed");
    }
  };
}
const Bf = "", zf = [], Ff = {
  dataKey: Bf,
  media: zf
}, Hf = "", Jf = "", Uf = [], Wf = {
  description: Hf,
  dataKey: Jf,
  predata: Uf
}, qf = "", Gf = [], Yf = {
  dataKey: qf,
  notes: Gf
}, Qf = "", Zf = "", Xf = [], ev = {
  description: Qf,
  dataKey: Zf,
  answers: Xf
}, Vt = "2.0.0";
let ri = "0.0.0", li = "0.0.0";
function tv(e, t, n, i, r) {
  const l = [], a = [], s = [], c = [], o = [], d = [], [f, x] = e.note, $ = t.components;
  if (!$ || !Array.isArray($) || $.length === 0)
    return console.error("Template has no components array"), {
      referenceList: l,
      sidebarList: a,
      nestedList: s,
      tmpVarComp: c,
      tmpEnableComp: o
    };
  const C = $[0];
  if (!Array.isArray(C) || C.length === 0)
    return console.error("Template has no sections"), {
      referenceList: l,
      sidebarList: a,
      nestedList: s,
      tmpVarComp: c,
      tmpEnableComp: o
    };
  const g = (y) => {
    if (!(n != null && n.testFunctions)) return {
      vals: void 0,
      compVal: void 0
    };
    const S = n.testFunctions.findIndex((p) => p.dataKey === y);
    return S !== -1 ? {
      vals: n.testFunctions[S].validations,
      compVal: n.testFunctions[S].componentValidation
    } : {
      vals: void 0,
      compVal: void 0
    };
  }, u = (y) => {
    if ((y.enableRemark === void 0 || y.enableRemark) && i != null && i.notes) {
      const S = i.notes.findIndex((p) => p.dataKey === y.dataKey);
      if (S !== -1) {
        const p = i.notes[S], L = [...f.details.notes, p];
        return x("details", "notes", L), !0;
      }
    }
    return !1;
  }, b = (y, S, p, L) => {
    for (let V = 0; V < y.length; V++) {
      const v = y[V], h = v.type;
      if (h !== 1 && h !== 3) {
        if (d.includes(v.dataKey))
          throw new Error(`Duplicate dataKey on ${v.dataKey}`);
        d.push(v.dataKey);
      }
      let w = v.answer;
      h === 21 || h === 22 ? w = JSON.parse(JSON.stringify(w)) : h === 4 && p < 2 && w === void 0 && !L && c.push(JSON.parse(JSON.stringify(v)));
      let E = v.components;
      if (h === 1) {
        let N = L;
        v.enableCondition !== void 0 ? (o.push(JSON.parse(JSON.stringify(v))), N = !1) : N = !0, a.push({
          dataKey: v.dataKey,
          name: v.name,
          label: v.label,
          description: v.description,
          level: p,
          index: [...S, V],
          components: E,
          sourceQuestion: v.sourceQuestion || "",
          enable: N,
          enableCondition: v.enableCondition || "",
          componentEnable: v.componentEnable || []
        });
      }
      h === 2 && s.push({
        dataKey: v.dataKey,
        name: v.name,
        label: v.label,
        description: v.description,
        level: p,
        index: [...S, V],
        components: E,
        sourceQuestion: v.sourceQuestion || "",
        enable: L,
        enableCondition: v.enableCondition || "",
        componentEnable: v.componentEnable || []
      }), h > 2 && v.enableCondition !== void 0 && !L && o.push(JSON.parse(JSON.stringify(v)));
      const {
        vals: I,
        compVal: M
      } = g(v.dataKey), O = u(v);
      if (l.push({
        dataKey: v.dataKey,
        name: v.name,
        label: v.label,
        hint: v.hint || "",
        description: v.description,
        type: h,
        answer: w,
        index: [...S, V],
        level: p,
        options: v.options,
        sourceQuestion: v.sourceQuestion,
        urlValidation: v.urlValidation,
        currency: v.currency,
        source: v.source,
        urlPath: v.path,
        parent: v.parent,
        separatorFormat: v.separatorFormat,
        isDecimal: v.isDecimal,
        maskingFormat: v.maskingFormat,
        expression: v.expression,
        componentVar: v.componentVar,
        render: v.render,
        renderType: v.renderType,
        enable: !0,
        enableCondition: v.enableCondition || "",
        componentEnable: v.componentEnable || [],
        enableRemark: v.enableRemark !== void 0 ? v.enableRemark : !0,
        client: v.client,
        titleModalDelete: v.titleModalDelete,
        sourceOption: v.sourceOption,
        sourceAPI: v.sourceAPI,
        typeOption: v.typeOption,
        contentModalDelete: v.contentModalDelete,
        validationState: v.validationState || 0,
        validationMessage: v.validationMessage || [],
        validations: I,
        componentValidation: M,
        hasRemark: O,
        rows: v.rows,
        cols: v.cols,
        rangeInput: v.rangeInput,
        lengthInput: v.lengthInput,
        principal: v.principal,
        columnName: v.columnName || "",
        titleModalConfirmation: v.titleModalConfirmation,
        contentModalConfirmation: v.contentModalConfirmation,
        required: v.required,
        presetMaster: v.presetMaster,
        disableInput: v.disableInput,
        decimalLength: v.decimalLength,
        disableInitial: v.disableInitial,
        sizeInput: v.sizeInput
      }), E && Array.isArray(E))
        for (let N = 0; N < E.length; N++)
          Array.isArray(E[N]) && b(E[N], [...S, V, N], p + 1, L);
    }
  };
  for (let y = 0; y < C.length; y++) {
    const S = C[y];
    let p = !1;
    S.enableCondition !== void 0 && (o.push(JSON.parse(JSON.stringify(S))), p = !0), a.push({
      dataKey: S.dataKey,
      name: S.name,
      label: S.label,
      description: S.description,
      level: 0,
      index: [0, y],
      components: S.components,
      sourceQuestion: S.sourceQuestion || "",
      enable: !p,
      enableCondition: S.enableCondition || "",
      componentEnable: S.componentEnable || []
    }), l.push({
      dataKey: S.dataKey,
      name: S.name,
      label: S.label,
      hint: S.hint || "",
      description: S.description,
      type: S.type,
      index: [0, y],
      level: 0,
      options: S.options,
      sourceQuestion: S.sourceQuestion,
      enable: !0,
      enableCondition: S.enableCondition || "",
      componentEnable: S.componentEnable || [],
      enableRemark: S.enableRemark !== void 0 ? S.enableRemark : !0,
      validationState: 0,
      validationMessage: []
    }), S.components && S.components[0] && b(S.components[0], [0, y, 0], 1, p);
  }
  return {
    referenceList: l,
    sidebarList: a,
    nestedList: s,
    tmpVarComp: c,
    tmpEnableComp: o
  };
}
function Sv(e) {
  const {
    data: t,
    config: n,
    mobileHandlers: i = {},
    callbacks: r = {}
  } = e, l = Ae(Ae({}, rs), n);
  t.reference;
  const a = t.template || {}, s = t.preset || Wf, c = t.response || ev, o = t.validation || {}, d = t.media || Ff, f = t.remark || Yf;
  ri = a.version || "0.0.0", li = o.version || "0.0.0";
  const x = i.uploadHandler || (() => {
  }), $ = i.gpsHandler || (() => {
  }), C = i.offlineSearch || (() => {
  }), g = i.onlineSearch || (() => ce(null, null, function* () {
    return {};
  })), u = i.exitHandler || ((A) => A && A()), b = i.openMap || (() => {
  }), y = r.onSave || (() => {
  }), S = r.onSubmit || (() => {
  });
  if (!a.components || !Array.isArray(a.components) || a.components.length === 0)
    throw console.error("FormGear Error: Template components is empty or invalid"), ke("Template configuration error: No components found", 5e3), new Error("Template configuration error: No components found");
  if (!Array.isArray(a.components[0]) || a.components[0].length === 0)
    throw console.error("FormGear Error: Template has no sections"), ke("Template configuration error: No sections defined", 5e3), new Error("Template configuration error: No sections defined");
  const p = Kf({
    template: a,
    validation: o,
    preset: s,
    response: c,
    media: d,
    remark: f
  }), {
    referenceList: L,
    sidebarList: V,
    nestedList: v,
    tmpVarComp: h,
    tmpEnableComp: w
  } = tv(p, a, o, f);
  console.log("createFormGear: nestedList built with", v.length, "items:", v), p.reference[1]("details", L), p.sidebar[1]("details", V), p.nested[1]("details", v), console.log("FormGear: Reference built with", L.length, "items"), console.log("FormGear: Sidebar built with", V.length, "sections");
  const E = {
    clientMode: l.clientMode,
    formMode: l.formMode,
    initialMode: l.initialMode,
    lookupMode: l.lookupMode,
    username: l.username || "",
    token: l.token || "",
    baseUrl: l.baseUrl || "",
    lookupKey: l.lookupKey || "keys",
    lookupValue: l.lookupValue || "values"
  }, I = So(p, E);
  I.reference.initializeMaps(), I.enable.initializeEnableStates();
  const M = {
    clientMode: l.clientMode,
    formMode: l.formMode,
    initialMode: l.initialMode,
    lookupMode: l.lookupMode,
    username: l.username || "",
    token: l.token || "",
    baseUrl: l.baseUrl || "",
    lookupKey: l.lookupKey || "keys",
    lookupValue: l.lookupValue || "values"
  }, O = /* @__PURE__ */ new Date(), N = document.getElementById("FormGear-root");
  if (!N)
    throw console.error('FormGear Error: No element with id "FormGear-root" found'), ke("Mount point not found: FormGear-root", 5e3), new Error("Mount point not found: FormGear-root");
  return Ua(() => m(cs, {
    stores: p,
    get children() {
      return m(Co, {
        services: I,
        get children() {
          return m(ds, {
            get children() {
              return m(Bg, {
                get children() {
                  return [m(Nf, {
                    config: M,
                    timeStart: O,
                    runAll: 0,
                    tmpEnableComp: w,
                    tmpVarComp: h,
                    template: {
                      details: a
                    },
                    preset: {
                      details: s
                    },
                    response: {
                      details: c
                    },
                    validation: {
                      details: o
                    },
                    remark: {
                      details: f
                    },
                    uploadHandler: x,
                    GpsHandler: $,
                    offlineSearch: C,
                    onlineSearch: g,
                    mobileExit: u,
                    setResponseMobile: y,
                    setSubmitMobile: S,
                    openMap: b
                  }), m(Df, {})];
                }
              });
            }
          });
        }
      });
    }
  }), N), console.log(`FormGear ${Vt} initialized`), {
    getResponse() {
      return p.response[0].details;
    },
    getMedia() {
      return p.media[0].details;
    },
    getRemarks() {
      return p.remark[0].details;
    },
    getPrincipal() {
      return p.reference[0].details.filter((D) => D.principal !== void 0 && D.principal > 0).sort((D, P) => (D.principal || 0) - (P.principal || 0)).map((D) => ({
        dataKey: D.dataKey,
        name: D.name,
        answer: D.answer,
        principal: D.principal,
        columnName: D.columnName
      }));
    },
    getReference() {
      return p.reference[0];
    },
    getSummary() {
      const A = p.summary[0];
      return {
        answer: A.answer,
        blank: A.blank,
        error: A.error,
        remark: A.remark
      };
    },
    validate() {
      return !p.reference[0].details.some((D) => D.validationState === 2);
    },
    setValue(A, z) {
      const P = p.reference[0].details.findIndex((B) => B.dataKey === A);
      P !== -1 && p.reference[1]("details", P, "answer", z);
    },
    getValue(A) {
      const D = p.reference[0].details.find((P) => P.dataKey === A);
      return D == null ? void 0 : D.answer;
    },
    save() {
      y(p.response[0].details, p.media[0].details, p.remark[0].details, this.getPrincipal(), p.reference[0]);
    },
    submit() {
      S(p.response[0].details, p.media[0].details, p.remark[0].details, this.getPrincipal(), p.reference[0]);
    },
    destroy() {
      N && (N.innerHTML = ""), p.dispose(), console.log("FormGear instance destroyed");
    }
  };
}
function nv(e = {}) {
  const { debug: t = !1 } = e, n = (s, c) => {
    t && console.log(`[Android Bridge] ${s}`, c != null ? c : "");
  }, i = (s, c, ...o) => {
    try {
      const d = window.Android;
      if (!d)
        return n(`Android interface not available for ${s}`), c;
      const f = d[s];
      if (typeof f != "function")
        return n(`Method ${s} not found on Android interface`), c;
      const x = f.apply(d, o);
      return n(`${s} called`, { args: o, result: x }), x;
    } catch (d) {
      return console.error(`[Android Bridge] Error calling ${s}:`, d), c;
    }
  }, r = (s, c) => {
    if (!s) return c;
    try {
      return JSON.parse(s);
    } catch (o) {
      return n("Failed to parse Android result", s), c;
    }
  };
  return {
    platform: "android",
    get isAvailable() {
      return typeof window.Android != "undefined";
    },
    // =========================================================================
    // Camera & Media
    // =========================================================================
    openCamera() {
      return ce(this, null, function* () {
        return n("openCamera called"), i("openCamera", "");
      });
    },
    openCameraWithGps(s) {
      return ce(this, null, function* () {
        n("openCameraWithGps called", { needPhoto: s });
        const c = i("openCameraWithGps", "", s);
        return r(c, {
          latitude: 0,
          longitude: 0,
          accuracy: 0
        });
      });
    },
    uploadFile(s) {
      return ce(this, null, function* () {
        n("uploadFile called", { accept: s });
        const c = i("uploadFile", "", s);
        return r(c, {
          path: "",
          name: "",
          mimeType: "",
          size: 0
        });
      });
    },
    scanBarcode() {
      return ce(this, null, function* () {
        n("scanBarcode called");
        const s = i("scanBarcode", "");
        return r(s, {
          value: "",
          format: ""
        });
      });
    },
    // =========================================================================
    // Location
    // =========================================================================
    getCurrentLocation() {
      return ce(this, null, function* () {
        n("getCurrentLocation called");
        const s = i("getCurrentLocation", "");
        return r(s, {
          latitude: 0,
          longitude: 0
        });
      });
    },
    openMap(s) {
      n("openMap called", s), i(
        "openMap",
        void 0,
        s.latitude,
        s.longitude
      );
    },
    // =========================================================================
    // Data Persistence
    // =========================================================================
    saveResponse(s) {
      return ce(this, null, function* () {
        n("saveResponse called", s);
        const c = JSON.stringify(s);
        i("saveResponse", void 0, c);
      });
    },
    submitResponse(s) {
      return ce(this, null, function* () {
        n("submitResponse called", s);
        const c = JSON.stringify(s);
        i("submitResponse", void 0, c);
      });
    },
    // =========================================================================
    // Offline Data
    // =========================================================================
    searchOffline(s, c, o) {
      return ce(this, null, function* () {
        n("searchOffline called", { lookupId: s, version: c, conditions: o });
        const d = i(
          "searchOffline",
          "[]",
          s,
          c,
          JSON.stringify(o)
        );
        return r(d, []);
      });
    },
    // =========================================================================
    // Lifecycle
    // =========================================================================
    exit(s) {
      n("exit called"), s && s(), i("exit", void 0);
    },
    showToast(s, c = 3e3) {
      n("showToast called", { message: s, duration: c }), i("showToast", void 0, s, c);
    },
    showConfirmDialog(s, c) {
      return ce(this, null, function* () {
        return n("showConfirmDialog called", { title: s, message: c }), i("showConfirmDialog", !1, s, c);
      });
    },
    // =========================================================================
    // Logging
    // =========================================================================
    log(s, c, o) {
      const d = o ? JSON.stringify(o) : "";
      i("log", void 0, s, c, d);
    }
  };
}
function iv() {
  return typeof window != "undefined" && typeof window.Android != "undefined";
}
typeof window != "undefined" && !window.__formgear_callbacks__ && (window.__formgear_callbacks__ = {});
let rv = 0;
function lv() {
  return `cb_${Date.now()}_${++rv}`;
}
function av(e = {}) {
  const { timeout: t = 3e4, debug: n = !1 } = e, i = (o, d) => {
    n && console.log(`[iOS Bridge] ${o}`, d != null ? d : "");
  }, r = () => {
    var o, d;
    return (d = (o = window.webkit) == null ? void 0 : o.messageHandlers) == null ? void 0 : d.FormGearHandler;
  }, l = (o, d) => new Promise((f, x) => {
    var b;
    const $ = r();
    if (!$) {
      i(`iOS handler not available for ${o}`), x(new Error("iOS handler not available"));
      return;
    }
    const C = lv();
    i(`Sending message: ${o}`, { callbackId: C, data: d });
    const g = setTimeout(() => {
      var y;
      (y = window.__formgear_callbacks__) == null || delete y[C], x(new Error(`Timeout waiting for ${o} response`));
    }, t);
    window.__formgear_callbacks__ && (window.__formgear_callbacks__[C] = (y) => {
      var S;
      clearTimeout(g), (S = window.__formgear_callbacks__) == null || delete S[C], i(`Received callback for ${o}`, y), f(y);
    });
    const u = {
      action: o,
      callbackId: C,
      data: d
    };
    try {
      $.postMessage(u);
    } catch (y) {
      clearTimeout(g), (b = window.__formgear_callbacks__) == null || delete b[C], x(y);
    }
  }), a = (o, d) => {
    const f = r();
    if (!f) {
      i(`iOS handler not available for ${o}`);
      return;
    }
    const x = {
      action: o,
      callbackId: "",
      // Empty for no-response messages
      data: d
    };
    try {
      f.postMessage(x), i(`Sent no-response message: ${o}`, d);
    } catch ($) {
      console.error(`[iOS Bridge] Error sending ${o}:`, $);
    }
  };
  return {
    platform: "ios",
    get isAvailable() {
      var o, d;
      return typeof ((d = (o = window.webkit) == null ? void 0 : o.messageHandlers) == null ? void 0 : d.FormGearHandler) != "undefined";
    },
    // =========================================================================
    // Camera & Media
    // =========================================================================
    openCamera() {
      return ce(this, null, function* () {
        i("openCamera called");
        try {
          return yield l("openCamera");
        } catch (o) {
          return console.error("[iOS Bridge] openCamera error:", o), "";
        }
      });
    },
    openCameraWithGps(o) {
      return ce(this, null, function* () {
        i("openCameraWithGps called", { needPhoto: o });
        try {
          return yield l("openCameraWithGps", { needPhoto: o });
        } catch (d) {
          return console.error("[iOS Bridge] openCameraWithGps error:", d), { latitude: 0, longitude: 0, accuracy: 0 };
        }
      });
    },
    uploadFile(o) {
      return ce(this, null, function* () {
        i("uploadFile called", { accept: o });
        try {
          return yield l("uploadFile", { accept: o });
        } catch (d) {
          return console.error("[iOS Bridge] uploadFile error:", d), { path: "", name: "", mimeType: "", size: 0 };
        }
      });
    },
    scanBarcode() {
      return ce(this, null, function* () {
        i("scanBarcode called");
        try {
          return yield l("scanBarcode");
        } catch (o) {
          return console.error("[iOS Bridge] scanBarcode error:", o), { value: "", format: "" };
        }
      });
    },
    // =========================================================================
    // Location
    // =========================================================================
    getCurrentLocation() {
      return ce(this, null, function* () {
        i("getCurrentLocation called");
        try {
          return yield l("getCurrentLocation");
        } catch (o) {
          return console.error("[iOS Bridge] getCurrentLocation error:", o), { latitude: 0, longitude: 0 };
        }
      });
    },
    openMap(o) {
      i("openMap called", o), a("openMap", o);
    },
    // =========================================================================
    // Data Persistence
    // =========================================================================
    saveResponse(o) {
      return ce(this, null, function* () {
        i("saveResponse called", o);
        try {
          yield l("saveResponse", o);
        } catch (d) {
          console.error("[iOS Bridge] saveResponse error:", d);
        }
      });
    },
    submitResponse(o) {
      return ce(this, null, function* () {
        i("submitResponse called", o);
        try {
          yield l("submitResponse", o);
        } catch (d) {
          console.error("[iOS Bridge] submitResponse error:", d);
        }
      });
    },
    // =========================================================================
    // Offline Data
    // =========================================================================
    searchOffline(o, d, f) {
      return ce(this, null, function* () {
        i("searchOffline called", { lookupId: o, version: d, conditions: f });
        try {
          return yield l("searchOffline", {
            lookupId: o,
            version: d,
            conditions: f
          });
        } catch (x) {
          return console.error("[iOS Bridge] searchOffline error:", x), [];
        }
      });
    },
    // =========================================================================
    // Lifecycle
    // =========================================================================
    exit(o) {
      i("exit called"), o && o(), a("exit");
    },
    showToast(o, d = 3e3) {
      i("showToast called", { message: o, duration: d }), a("showToast", { message: o, duration: d });
    },
    showConfirmDialog(o, d) {
      return ce(this, null, function* () {
        i("showConfirmDialog called", { title: o, message: d });
        try {
          return yield l("showConfirmDialog", { title: o, message: d });
        } catch (f) {
          return console.error("[iOS Bridge] showConfirmDialog error:", f), !1;
        }
      });
    },
    // =========================================================================
    // Logging
    // =========================================================================
    log(o, d, f) {
      a("log", { level: o, message: d, data: f });
    }
  };
}
function sv() {
  var e, t;
  return typeof window != "undefined" && typeof ((t = (e = window.webkit) == null ? void 0 : e.messageHandlers) == null ? void 0 : t.FormGearHandler) != "undefined";
}
typeof window != "undefined" && (window.__formgear_resolve_callback__ = (e, t) => {
  var i;
  const n = (i = window.__formgear_callbacks__) == null ? void 0 : i[e];
  n && n(t);
});
typeof window != "undefined" && !window.__formgear_callbacks__ && (window.__formgear_callbacks__ = {});
let ov = 0;
function dv() {
  return `flutter_cb_${Date.now()}_${++ov}`;
}
function cv(e = {}) {
  const { timeout: t = 3e4, debug: n = !1 } = e, i = (c, o) => {
    n && console.log(`[Flutter InAppWebView Bridge] ${c}`, o != null ? o : "");
  }, r = (c, o) => ce(null, null, function* () {
    const d = window.flutter_inappwebview;
    if (!d)
      throw new Error("Flutter InAppWebView not available");
    i(`Calling handler: ${c}`, o);
    const f = new Promise(($, C) => {
      setTimeout(
        () => C(new Error(`Timeout calling ${c}`)),
        t
      );
    }), x = d.callHandler(
      c,
      o
    );
    return Promise.race([x, f]);
  }), l = (c, o, d) => ce(null, null, function* () {
    try {
      return yield r(c, d);
    } catch (f) {
      return console.error(
        `[Flutter InAppWebView Bridge] Error calling ${c}:`,
        f
      ), o;
    }
  });
  return {
    platform: "flutter",
    get isAvailable() {
      return typeof window.flutter_inappwebview != "undefined";
    },
    // Camera & Media
    openCamera() {
      return ce(this, null, function* () {
        return i("openCamera called"), l("openCamera", "");
      });
    },
    openCameraWithGps(c) {
      return ce(this, null, function* () {
        return i("openCameraWithGps called", { needPhoto: c }), l("openCameraWithGps", { latitude: 0, longitude: 0, accuracy: 0 }, c);
      });
    },
    uploadFile(c) {
      return ce(this, null, function* () {
        return i("uploadFile called", { accept: c }), l("uploadFile", { path: "", name: "", mimeType: "", size: 0 }, c);
      });
    },
    scanBarcode() {
      return ce(this, null, function* () {
        return i("scanBarcode called"), l("scanBarcode", { value: "", format: "" });
      });
    },
    // Location
    getCurrentLocation() {
      return ce(this, null, function* () {
        return i("getCurrentLocation called"), l("getCurrentLocation", { latitude: 0, longitude: 0 });
      });
    },
    openMap(c) {
      i("openMap called", c), l("openMap", void 0, c);
    },
    // Data Persistence
    saveResponse(c) {
      return ce(this, null, function* () {
        i("saveResponse called", c), yield l("saveResponse", void 0, c);
      });
    },
    submitResponse(c) {
      return ce(this, null, function* () {
        i("submitResponse called", c), yield l("submitResponse", void 0, c);
      });
    },
    // Offline Data
    searchOffline(c, o, d) {
      return ce(this, null, function* () {
        return i("searchOffline called", { lookupId: c, version: o, conditions: d }), l("searchOffline", [], { lookupId: c, version: o, conditions: d });
      });
    },
    // Lifecycle
    exit(c) {
      i("exit called"), c && c(), l("exit", void 0);
    },
    showToast(c, o = 3e3) {
      i("showToast called", { message: c, duration: o }), l("showToast", void 0, { message: c, duration: o });
    },
    showConfirmDialog(c, o) {
      return ce(this, null, function* () {
        return i("showConfirmDialog called", { title: c, message: o }), l("showConfirmDialog", !1, { title: c, message: o });
      });
    },
    // Logging
    log(c, o, d) {
      l("log", void 0, { level: c, message: o, data: d });
    }
  };
}
function uv(e = {}) {
  const { timeout: t = 3e4, debug: n = !1 } = e, i = (o, d) => {
    n && console.log(`[Flutter Channel Bridge] ${o}`, d != null ? d : "");
  }, r = (o, d) => new Promise((f, x) => {
    var b;
    const $ = window.FormGearChannel;
    if (!$) {
      x(new Error("Flutter channel not available"));
      return;
    }
    const C = dv();
    i(`Sending message: ${o}`, { callbackId: C, args: d });
    const g = setTimeout(() => {
      var y;
      (y = window.__formgear_callbacks__) == null || delete y[C], x(new Error(`Timeout waiting for ${o} response`));
    }, t);
    window.__formgear_callbacks__ && (window.__formgear_callbacks__[C] = (y) => {
      var S;
      clearTimeout(g), (S = window.__formgear_callbacks__) == null || delete S[C], i(`Received callback for ${o}`, y), f(y);
    });
    const u = {
      method: o,
      args: d,
      callbackId: C
    };
    try {
      $.postMessage(JSON.stringify(u));
    } catch (y) {
      clearTimeout(g), (b = window.__formgear_callbacks__) == null || delete b[C], x(y);
    }
  }), l = (o, d) => {
    const f = window.FormGearChannel;
    if (!f) {
      i(`Flutter channel not available for ${o}`);
      return;
    }
    const x = { method: o, args: d };
    try {
      f.postMessage(JSON.stringify(x)), i(`Sent no-response message: ${o}`, d);
    } catch ($) {
      console.error(`[Flutter Channel Bridge] Error sending ${o}:`, $);
    }
  }, a = (o, d, f) => ce(null, null, function* () {
    try {
      return yield r(o, f);
    } catch (x) {
      return console.error(`[Flutter Channel Bridge] Error calling ${o}:`, x), d;
    }
  });
  return {
    platform: "flutter",
    get isAvailable() {
      return typeof window.FormGearChannel != "undefined";
    },
    // Camera & Media
    openCamera() {
      return ce(this, null, function* () {
        return i("openCamera called"), a("openCamera", "");
      });
    },
    openCameraWithGps(o) {
      return ce(this, null, function* () {
        return i("openCameraWithGps called", { needPhoto: o }), a("openCameraWithGps", { latitude: 0, longitude: 0, accuracy: 0 }, { needPhoto: o });
      });
    },
    uploadFile(o) {
      return ce(this, null, function* () {
        return i("uploadFile called", { accept: o }), a("uploadFile", { path: "", name: "", mimeType: "", size: 0 }, { accept: o });
      });
    },
    scanBarcode() {
      return ce(this, null, function* () {
        return i("scanBarcode called"), a("scanBarcode", { value: "", format: "" });
      });
    },
    // Location
    getCurrentLocation() {
      return ce(this, null, function* () {
        return i("getCurrentLocation called"), a("getCurrentLocation", { latitude: 0, longitude: 0 });
      });
    },
    openMap(o) {
      i("openMap called", o), l("openMap", o);
    },
    // Data Persistence
    saveResponse(o) {
      return ce(this, null, function* () {
        i("saveResponse called", o), yield a("saveResponse", void 0, o);
      });
    },
    submitResponse(o) {
      return ce(this, null, function* () {
        i("submitResponse called", o), yield a("submitResponse", void 0, o);
      });
    },
    // Offline Data
    searchOffline(o, d, f) {
      return ce(this, null, function* () {
        return i("searchOffline called", { lookupId: o, version: d, conditions: f }), a("searchOffline", [], { lookupId: o, version: d, conditions: f });
      });
    },
    // Lifecycle
    exit(o) {
      i("exit called"), o && o(), l("exit");
    },
    showToast(o, d = 3e3) {
      i("showToast called", { message: o, duration: d }), l("showToast", { message: o, duration: d });
    },
    showConfirmDialog(o, d) {
      return ce(this, null, function* () {
        return i("showConfirmDialog called", { title: o, message: d }), a("showConfirmDialog", !1, { title: o, message: d });
      });
    },
    // Logging
    log(o, d, f) {
      l("log", { level: o, message: d, data: f });
    }
  };
}
function On() {
  return typeof window != "undefined" && typeof window.flutter_inappwebview != "undefined";
}
function Ui() {
  return typeof window != "undefined" && typeof window.FormGearChannel != "undefined";
}
function Cv() {
  return On() || Ui();
}
typeof window != "undefined" && (window.__formgear_flutter_callback__ = (e, t) => {
  var i;
  const n = (i = window.__formgear_callbacks__) == null ? void 0 : i[e];
  n && n(t);
});
function Hr(e = {}) {
  const { debug: t = !1 } = e, n = (l, a) => {
    t && console.log(`[Web Bridge] ${l}`, a != null ? a : "");
  };
  return {
    platform: "web",
    get isAvailable() {
      return !0;
    },
    // =========================================================================
    // Camera & Media
    // =========================================================================
    openCamera() {
      return ce(this, null, function* () {
        return n("openCamera called"), new Promise((l) => {
          const a = document.createElement("input");
          a.type = "file", a.accept = "image/*", a.capture = "environment", a.onchange = () => {
            var c;
            const s = (c = a.files) == null ? void 0 : c[0];
            if (s) {
              const o = new FileReader();
              o.onload = () => {
                l(o.result);
              }, o.onerror = () => l(""), o.readAsDataURL(s);
            } else
              l("");
          }, a.oncancel = () => l(""), a.click();
        });
      });
    },
    openCameraWithGps(l) {
      return ce(this, null, function* () {
        n("openCameraWithGps called", { needPhoto: l });
        const a = {
          latitude: 0,
          longitude: 0,
          accuracy: 0,
          timestamp: Date.now()
        };
        try {
          const s = yield new Promise(
            (c, o) => {
              if (!navigator.geolocation) {
                o(new Error("Geolocation not supported"));
                return;
              }
              navigator.geolocation.getCurrentPosition(c, o, {
                enableHighAccuracy: !0,
                timeout: 3e4,
                maximumAge: 0
              });
            }
          );
          a.latitude = s.coords.latitude, a.longitude = s.coords.longitude, a.accuracy = s.coords.accuracy, a.timestamp = s.timestamp;
        } catch (s) {
          console.warn("[Web Bridge] Geolocation error:", s);
        }
        if (l) {
          const s = yield this.openCamera();
          a.photo = s;
        }
        return a;
      });
    },
    uploadFile(l) {
      return ce(this, null, function* () {
        return n("uploadFile called", { accept: l }), new Promise((a) => {
          const s = document.createElement("input");
          s.type = "file", s.accept = l, s.onchange = () => {
            var o;
            const c = (o = s.files) == null ? void 0 : o[0];
            if (c) {
              const d = new FileReader();
              d.onload = () => {
                a({
                  path: URL.createObjectURL(c),
                  name: c.name,
                  mimeType: c.type,
                  size: c.size,
                  base64: d.result
                });
              }, d.onerror = () => {
                a({
                  path: "",
                  name: "",
                  mimeType: "",
                  size: 0
                });
              }, d.readAsDataURL(c);
            } else
              a({
                path: "",
                name: "",
                mimeType: "",
                size: 0
              });
          }, s.oncancel = () => {
            a({
              path: "",
              name: "",
              mimeType: "",
              size: 0
            });
          }, s.click();
        });
      });
    },
    scanBarcode() {
      return ce(this, null, function* () {
        if (n("scanBarcode called"), "BarcodeDetector" in window)
          try {
            const l = window.BarcodeDetector, a = new l();
            console.warn(
              "[Web Bridge] BarcodeDetector available but video stream not implemented"
            );
          } catch (l) {
          }
        return console.warn("[Web Bridge] Barcode scanning not supported in web browser"), { value: "", format: "" };
      });
    },
    // =========================================================================
    // Location
    // =========================================================================
    getCurrentLocation() {
      return ce(this, null, function* () {
        n("getCurrentLocation called");
        try {
          const l = yield new Promise(
            (a, s) => {
              if (!navigator.geolocation) {
                s(new Error("Geolocation not supported"));
                return;
              }
              navigator.geolocation.getCurrentPosition(a, s, {
                enableHighAccuracy: !0,
                timeout: 3e4,
                maximumAge: 0
              });
            }
          );
          return {
            latitude: l.coords.latitude,
            longitude: l.coords.longitude
          };
        } catch (l) {
          return console.warn("[Web Bridge] Geolocation error:", l), { latitude: 0, longitude: 0 };
        }
      });
    },
    openMap(l) {
      n("openMap called", l);
      const a = `https://www.google.com/maps?q=${l.latitude},${l.longitude}`;
      window.open(a, "_blank");
    },
    // =========================================================================
    // Data Persistence
    // =========================================================================
    saveResponse(l) {
      return ce(this, null, function* () {
        n("saveResponse called", l);
        try {
          localStorage.setItem("formgear_draft", JSON.stringify(l)), n("Response saved to localStorage");
        } catch (a) {
          console.error("[Web Bridge] Failed to save to localStorage:", a);
        }
      });
    },
    submitResponse(l) {
      return ce(this, null, function* () {
        n("submitResponse called", l), console.warn(
          "[Web Bridge] submitResponse called in web mode. Use callbacks for submission."
        );
      });
    },
    // =========================================================================
    // Offline Data
    // =========================================================================
    searchOffline(l, a, s) {
      return ce(this, null, function* () {
        n("searchOffline called", { lookupId: l, version: a, conditions: s });
        try {
          const c = `formgear_lookup_${l}_${a}`, o = localStorage.getItem(c);
          if (o) {
            const d = JSON.parse(o);
            return Array.isArray(d) ? d : [];
          }
        } catch (c) {
        }
        return console.warn("[Web Bridge] Offline search not available in web mode"), [];
      });
    },
    // =========================================================================
    // Lifecycle
    // =========================================================================
    exit(l) {
      n("exit called"), l && l(), console.warn("[Web Bridge] exit() called in web mode - no action taken");
    },
    showToast(l, a = 3e3) {
      n("showToast called", { message: l, duration: a });
      const s = window.Toastify;
      if (s) {
        s({
          text: l,
          duration: a,
          gravity: "bottom",
          position: "center"
        }).showToast();
        return;
      }
      console.log(`[Toast] ${l}`);
    },
    showConfirmDialog(l, a) {
      return ce(this, null, function* () {
        return n("showConfirmDialog called", { title: l, message: a }), window.confirm(`${l}

${a}`);
      });
    },
    // =========================================================================
    // Logging
    // =========================================================================
    log(l, a, s) {
      const c = "[FormGear]";
      switch (l) {
        case "debug":
          console.debug(c, a, s != null ? s : "");
          break;
        case "info":
          console.info(c, a, s != null ? s : "");
          break;
        case "warn":
          console.warn(c, a, s != null ? s : "");
          break;
        case "error":
          console.error(c, a, s != null ? s : "");
          break;
      }
    }
  };
}
function Mv() {
  return typeof window != "undefined";
}
const hn = {
  // Data handlers (sync - return string/JSON)
  GET_TEMPLATE: "getTemplate",
  GET_VALIDATION: "getValidation",
  GET_PRESET: "getPreset",
  GET_RESPONSE: "getResponse",
  GET_MEDIA: "getMedia",
  GET_REMARK: "getRemark",
  GET_REFERENCE: "getReference",
  GET_USER_NAME: "getUserName",
  GET_FORM_MODE: "getFormMode",
  GET_IS_NEW: "getIsNew",
  GET_PRINCIPAL_COLLECTION: "getPrincipalCollection",
  GET_USER_ROLE: "getUserRole",
  // Action handlers (async - return Promise)
  OPEN_CAMERA: "openCamera",
  OPEN_CAMERA_WITH_GPS: "openCameraWithGps",
  UPLOAD_FILE: "uploadFile",
  SCAN_BARCODE: "scanBarcode",
  GET_CURRENT_LOCATION: "getCurrentLocation",
  OPEN_MAP: "openMap",
  SEARCH_OFFLINE: "searchOffline",
  SAVE_RESPONSE: "saveResponse",
  SUBMIT_RESPONSE: "submitResponse",
  EXIT: "mobileExit",
  SHOW_TOAST: "showToast"
};
function gn(r, l, a) {
  return ce(this, arguments, function* (e, t, n, i = {}) {
    const { debug: s = !1, timeout: c = 3e4 } = i;
    if (!On())
      return s && console.warn(`[Flutter Adapter] flutter_inappwebview not available for ${e}`), n;
    try {
      const o = new Promise((x, $) => {
        setTimeout(() => $(new Error(`Timeout calling ${e}`)), c);
      }), d = window.flutter_inappwebview.callHandler(
        e,
        t
      ), f = yield Promise.race([d, o]);
      return s && console.log(`[Flutter Adapter] ${e} returned:`, f), f;
    } catch (o) {
      return console.error(`[Flutter Adapter] Error calling ${e}:`, o), n;
    }
  });
}
function Wl(e = {}) {
  const { debug: t = !1 } = e;
  return t && console.log("[Flutter Adapter] Creating Flutter mobile handlers"), {
    /**
     * Upload handler - calls Flutter's openCamera or uploadFile handler
     */
    uploadHandler: (n) => {
      gn(hn.OPEN_CAMERA, void 0, "", e).then((i) => {
        i && n(i);
      }).catch((i) => {
        console.error("[Flutter Adapter] uploadHandler error:", i);
      });
    },
    /**
     * GPS handler - calls Flutter's openCameraWithGps handler
     */
    gpsHandler: (n, i) => {
      gn(
        hn.OPEN_CAMERA_WITH_GPS,
        i != null ? i : !1,
        { latitude: 0, longitude: 0, accuracy: 0 },
        e
      ).then((r) => {
        n(r, r.remark || "");
      }).catch((r) => {
        console.error("[Flutter Adapter] gpsHandler error:", r), n({ latitude: 0, longitude: 0, accuracy: 0 }, "");
      });
    },
    /**
     * Offline search handler - calls Flutter's searchOffline handler
     */
    offlineSearch: (n, i, r, l) => {
      gn(
        hn.SEARCH_OFFLINE,
        { lookupId: n, version: i, conditions: r },
        [],
        e
      ).then((a) => {
        l(a);
      }).catch((a) => {
        console.error("[Flutter Adapter] offlineSearch error:", a), l([]);
      });
    },
    /**
     * Online search handler - not typically used in Flutter (offline-first)
     * But provided for compatibility
     */
    onlineSearch: (n) => ce(null, null, function* () {
      try {
        return yield (yield fetch(n)).json();
      } catch (i) {
        return console.error("[Flutter Adapter] onlineSearch error:", i), {};
      }
    }),
    /**
     * Exit handler - calls Flutter's mobileExit handler
     */
    exitHandler: (n) => {
      n && n(), gn(hn.EXIT, void 0, void 0, e).catch((i) => {
        console.error("[Flutter Adapter] exitHandler error:", i);
      });
    },
    /**
     * Open map handler - calls Flutter's openMap handler
     */
    openMap: (n) => {
      var l, a, s, c;
      const i = (a = (l = n.lat) != null ? l : n.latitude) != null ? a : 0, r = (c = (s = n.long) != null ? s : n.longitude) != null ? c : 0;
      gn(
        hn.OPEN_MAP,
        { latitude: i, longitude: r },
        void 0,
        e
      ).catch((o) => {
        console.error("[Flutter Adapter] openMap error:", o);
      });
    }
  };
}
function Iv(e = {}) {
  if (On())
    return e.debug && console.log("[Flutter Adapter] Flutter InAppWebView detected, creating handlers"), Wl(e);
  e.debug && console.log("[Flutter Adapter] Not running in Flutter WebView");
}
function hv(e = {}) {
  return {
    onSave: (t, n, i, r, l) => ce(null, null, function* () {
      yield gn(
        hn.SAVE_RESPONSE,
        { response: t, media: n, remark: i, principal: r, reference: l },
        void 0,
        e
      );
    }),
    onSubmit: (t, n, i, r, l) => ce(null, null, function* () {
      yield gn(
        hn.SUBMIT_RESPONSE,
        { response: t, media: n, remark: i, principal: r, reference: l },
        void 0,
        e
      );
    })
  };
}
function Ev(e = {}) {
  const t = On();
  return e.debug && console.log("[Flutter Adapter] Initializing Flutter integration:", { isFlutter: t }), t ? {
    isFlutter: !0,
    mobileHandlers: Wl(e),
    callbacks: hv(e)
  } : {
    isFlutter: !1,
    mobileHandlers: void 0,
    callbacks: void 0
  };
}
function Wi() {
  if (typeof window == "undefined")
    return {
      platform: "web",
      confidence: "fallback",
      details: "Server-side rendering detected"
    };
  if (On())
    return {
      platform: "flutter",
      confidence: "definite",
      details: "Flutter InAppWebView detected (flutter_inappwebview)"
    };
  if (Ui())
    return {
      platform: "flutter",
      confidence: "definite",
      details: "Flutter channel detected (webview_flutter)"
    };
  if (iv())
    return {
      platform: "android",
      confidence: "definite",
      details: "Android WebView detected (window.Android)"
    };
  if (sv())
    return {
      platform: "ios",
      confidence: "definite",
      details: "iOS WKWebView detected (webkit.messageHandlers)"
    };
  const e = navigator.userAgent.toLowerCase();
  return e.includes("android") ? {
    platform: "web",
    confidence: "likely",
    details: "Android browser detected (no native bridge)"
  } : e.includes("iphone") || e.includes("ipad") || e.includes("ipod") ? {
    platform: "web",
    confidence: "likely",
    details: "iOS browser detected (no native bridge)"
  } : {
    platform: "web",
    confidence: "fallback",
    details: "Standard web browser"
  };
}
function gv(e = {}) {
  const { forcePlatform: t, debug: n = !1 } = e;
  if (t)
    return n && console.log(`[Bridge] Forced platform: ${t}`), Jr(t, e);
  const i = Wi();
  return n && (console.log(`[Bridge] Detected: ${i.platform} (${i.confidence})`), console.log(`[Bridge] Details: ${i.details}`)), Jr(i.platform, e);
}
function Jr(e, t) {
  switch (e) {
    case "android":
      return nv(t);
    case "ios":
      return av(t);
    case "flutter":
      return On() ? cv(t) : Ui() ? uv(t) : Hr(t);
    default:
      return Hr(t);
  }
}
let ai = null;
function Ov(e) {
  return ai || (ai = gv(e)), ai;
}
function Lv() {
  ai = null;
}
function Av() {
  const e = Wi();
  return e.platform !== "web" && e.confidence === "definite";
}
function Rv() {
  if (typeof window == "undefined") return !1;
  const e = navigator.userAgent.toLowerCase();
  return e.includes("android") || e.includes("iphone") || e.includes("ipad") || e.includes("ipod") || e.includes("mobile");
}
function Nv() {
  switch (Wi().platform) {
    case "android":
      return "Android";
    case "ios":
      return "iOS";
    case "flutter":
      return "Flutter";
    case "web":
      return "Web Browser";
    default:
      return "Unknown";
  }
}
export {
  il as ClientMode,
  is as ControlType,
  rs as DEFAULT_CONFIG,
  hn as FLUTTER_HANDLER_NAMES,
  rl as FormMode,
  ll as InitialMode,
  al as LookupMode,
  ts as OptionType,
  Co as ServiceProvider,
  ns as ValidationType,
  nv as createAndroidBridge,
  gv as createBridge,
  hv as createFlutterCallbacks,
  uv as createFlutterChannelBridge,
  cv as createFlutterInAppWebViewBridge,
  Wl as createFlutterMobileHandlers,
  Sv as createFormGear,
  So as createFormServices,
  av as createIOSBridge,
  Hr as createWebBridge,
  Iv as detectFlutterHandlers,
  Wi as detectPlatform,
  Vt as gearVersion,
  Ov as getBridge,
  Nv as getPlatformName,
  Ev as initFlutterIntegration,
  iv as isAndroidAvailable,
  Cv as isFlutterAvailable,
  Ui as isFlutterChannelAvailable,
  On as isFlutterInAppWebViewAvailable,
  sv as isIOSAvailable,
  Rv as isMobile,
  Av as isNativeApp,
  Mv as isWebAvailable,
  Lv as resetBridge,
  $v as useAnswerService,
  pv as useEnableService,
  xv as useExpressionService,
  _v as useHistoryService,
  kv as useNestedService,
  wv as useReferenceService,
  Bt as useServices,
  yv as useValidationService
};
//# sourceMappingURL=form-gear.es.js.map
