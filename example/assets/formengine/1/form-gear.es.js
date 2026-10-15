var ca = Object.defineProperty, ua = Object.defineProperties;
var ga = Object.getOwnPropertyDescriptors;
var ri = Object.getOwnPropertySymbols;
var ha = Object.prototype.hasOwnProperty, fa = Object.prototype.propertyIsEnumerable;
var On = (e, t, n) => t in e ? ca(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, Ce = (e, t) => {
  for (var n in t || (t = {}))
    ha.call(t, n) && On(e, n, t[n]);
  if (ri)
    for (var n of ri(t))
      fa.call(t, n) && On(e, n, t[n]);
  return e;
}, Xe = (e, t) => ua(e, ga(t));
var Ie = (e, t, n) => On(e, typeof t != "symbol" ? t + "" : t, n);
var de = (e, t, n) => new Promise((i, r) => {
  var a = (c) => {
    try {
      l(n.next(c));
    } catch (o) {
      r(o);
    }
  }, s = (c) => {
    try {
      l(n.throw(c));
    } catch (o) {
      r(o);
    }
  }, l = (c) => c.done ? i(c.value) : Promise.resolve(c.value).then(a, s);
  l((n = n.apply(e, t)).next());
});
const ma = (e, t) => e === t, ot = /* @__PURE__ */ Symbol("solid-proxy"), qi = typeof Proxy == "function", Vn = /* @__PURE__ */ Symbol("solid-track"), hn = {
  equals: ma
};
let Gi = er;
const xt = 1, fn = 2, Yi = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
}, An = {};
var Ee = null;
let Rn = null, va = null, Ae = null, He = null, mt = null, pn = 0;
function tn(e, t) {
  const n = Ae, i = Ee, r = e.length === 0, a = t === void 0 ? i : t, s = r ? Yi : {
    owned: null,
    cleanups: null,
    context: a ? a.context : null,
    owner: a
  }, l = r ? e : () => e(() => qe(() => Ft(s)));
  Ee = s, Ae = null;
  try {
    return vt(l, !0);
  } finally {
    Ae = n, Ee = i;
  }
}
function z(e, t) {
  t = t ? Object.assign({}, hn, t) : hn;
  const n = {
    value: e,
    observers: null,
    observerSlots: null,
    comparator: t.equals || void 0
  }, i = (r) => (typeof r == "function" && (r = r(n.value)), Xi(n, r));
  return [Zi.bind(n), i];
}
function ba(e, t, n) {
  const i = kn(e, t, !0, xt);
  Rt(i);
}
function P(e, t, n) {
  const i = kn(e, t, !1, xt);
  Rt(i);
}
function $e(e, t, n) {
  Gi = $a;
  const i = kn(e, t, !1, xt);
  i.user = !0, mt ? mt.push(i) : Rt(i);
}
function Me(e, t, n) {
  n = n ? Object.assign({}, hn, n) : hn;
  const i = kn(e, t, !0, 0);
  return i.observers = null, i.observerSlots = null, i.comparator = n.equals || void 0, Rt(i), Zi.bind(i);
}
function wa(e) {
  return e && typeof e == "object" && "then" in e;
}
function Ut(e, t, n) {
  let i, r, a;
  typeof t == "function" ? (i = e, r = t, a = {}) : (i = !0, r = e, a = t || {});
  let s = null, l = An, c = !1, o = "initialValue" in a, d = typeof i == "function" && Me(i);
  const f = /* @__PURE__ */ new Set(), [w, k] = (a.storage || z)(a.initialValue), [C, m] = z(void 0), [u, x] = z(void 0, {
    equals: !1
  }), [$, S] = z(o ? "ready" : "unresolved");
  function _(b, O, E, M) {
    return s === b && (s = null, M !== void 0 && (o = !0), (b === l || O === l) && a.onHydrated && queueMicrotask(() => a.onHydrated(M, {
      value: O
    })), l = An, L(O, E)), O;
  }
  function L(b, O) {
    vt(() => {
      O === void 0 && k(() => b), S(O !== void 0 ? "errored" : o ? "ready" : "unresolved"), m(O);
      for (const E of f.keys()) E.decrement();
      f.clear();
    }, !1);
  }
  function V() {
    const b = ya, O = w(), E = C();
    if (E !== void 0 && !s) throw E;
    return Ae && Ae.user, O;
  }
  function v(b = !0) {
    if (b !== !1 && c) return;
    c = !1;
    const O = d ? d() : i;
    if (O == null || O === !1) {
      _(s, qe(w));
      return;
    }
    let E;
    const M = l !== An ? l : qe(() => {
      try {
        return r(O, {
          value: w(),
          refetching: b
        });
      } catch (I) {
        E = I;
      }
    });
    if (E !== void 0) {
      _(s, void 0, nn(E), O);
      return;
    } else if (!wa(M))
      return _(s, M, void 0, O), M;
    return s = M, "v" in M ? (M.s === 1 ? _(s, M.v, void 0, O) : _(s, void 0, nn(M.v), O), M) : (c = !0, queueMicrotask(() => c = !1), vt(() => {
      S(o ? "refreshing" : "pending"), x();
    }, !1), M.then((I) => _(M, I, void 0, O), (I) => _(M, void 0, nn(I), O)));
  }
  Object.defineProperties(V, {
    state: {
      get: () => $()
    },
    error: {
      get: () => C()
    },
    loading: {
      get() {
        const b = $();
        return b === "pending" || b === "refreshing";
      }
    },
    latest: {
      get() {
        if (!o) return V();
        const b = C();
        if (b && !s) throw b;
        return w();
      }
    }
  });
  let h = Ee;
  return d ? ba(() => (h = Ee, v(!1))) : v(!1), [V, {
    refetch: (b) => xa(h, () => v(b)),
    mutate: k
  }];
}
function Tn(e) {
  return vt(e, !1);
}
function qe(e) {
  if (Ae === null) return e();
  const t = Ae;
  Ae = null;
  try {
    return e();
  } finally {
    Ae = t;
  }
}
function yt(e, t, n) {
  const i = Array.isArray(e);
  let r, a = n && n.defer;
  return (s) => {
    let l;
    if (i) {
      l = Array(e.length);
      for (let o = 0; o < e.length; o++) l[o] = e[o]();
    } else l = e();
    if (a)
      return a = !1, s;
    const c = qe(() => t(l, r, s));
    return r = l, c;
  };
}
function zn(e) {
  $e(() => qe(e));
}
function _t(e) {
  return Ee === null || (Ee.cleanups === null ? Ee.cleanups = [e] : Ee.cleanups.push(e)), e;
}
function Pn() {
  return Ae;
}
function xa(e, t) {
  const n = Ee, i = Ae;
  Ee = e, Ae = null;
  try {
    return vt(t, !0);
  } catch (r) {
    Fn(r);
  } finally {
    Ee = n, Ae = i;
  }
}
const [wm, xm] = /* @__PURE__ */ z(!1);
function Jt(e, t) {
  const n = /* @__PURE__ */ Symbol("context");
  return {
    id: n,
    Provider: _a(n),
    defaultValue: e
  };
}
function Wt(e) {
  let t;
  return Ee && Ee.context && (t = Ee.context[e.id]) !== void 0 ? t : e.defaultValue;
}
function Qi(e) {
  const t = Me(e), n = Me(() => Dn(t()));
  return n.toArray = () => {
    const i = n();
    return Array.isArray(i) ? i : i != null ? [i] : [];
  }, n;
}
let ya;
function Zi() {
  if (this.sources && this.state)
    if (this.state === xt) Rt(this);
    else {
      const e = He;
      He = null, vt(() => vn(this), !1), He = e;
    }
  if (Ae) {
    const e = this.observers ? this.observers.length : 0;
    Ae.sources ? (Ae.sources.push(this), Ae.sourceSlots.push(e)) : (Ae.sources = [this], Ae.sourceSlots = [e]), this.observers ? (this.observers.push(Ae), this.observerSlots.push(Ae.sources.length - 1)) : (this.observers = [Ae], this.observerSlots = [Ae.sources.length - 1]);
  }
  return this.value;
}
function Xi(e, t, n) {
  let i = e.value;
  return (!e.comparator || !e.comparator(i, t)) && (e.value = t, e.observers && e.observers.length && vt(() => {
    for (let r = 0; r < e.observers.length; r += 1) {
      const a = e.observers[r], s = Rn && Rn.running;
      s && Rn.disposed.has(a), (s ? !a.tState : !a.state) && (a.pure ? He.push(a) : mt.push(a), a.observers && tr(a)), s || (a.state = xt);
    }
    if (He.length > 1e6)
      throw He = [], new Error();
  }, !1)), t;
}
function Rt(e) {
  if (!e.fn) return;
  Ft(e);
  const t = pn;
  pa(e, e.value, t);
}
function pa(e, t, n) {
  let i;
  const r = Ee, a = Ae;
  Ae = Ee = e;
  try {
    i = e.fn(t);
  } catch (s) {
    return e.pure && (e.state = xt, e.owned && e.owned.forEach(Ft), e.owned = null), e.updatedAt = n + 1, Fn(s);
  } finally {
    Ae = a, Ee = r;
  }
  (!e.updatedAt || e.updatedAt <= n) && (e.updatedAt != null && "observers" in e ? Xi(e, i) : e.value = i, e.updatedAt = n);
}
function kn(e, t, n, i = xt, r) {
  const a = {
    fn: e,
    state: i,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: t,
    owner: Ee,
    context: Ee ? Ee.context : null,
    pure: n
  };
  return Ee === null || Ee !== Yi && (Ee.owned ? Ee.owned.push(a) : Ee.owned = [a]), a;
}
function mn(e) {
  if (e.state === 0) return;
  if (e.state === fn) return vn(e);
  if (e.suspense && qe(e.suspense.inFallback)) return e.suspense.effects.push(e);
  const t = [e];
  for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < pn); )
    e.state && t.push(e);
  for (let n = t.length - 1; n >= 0; n--)
    if (e = t[n], e.state === xt)
      Rt(e);
    else if (e.state === fn) {
      const i = He;
      He = null, vt(() => vn(e, t[0]), !1), He = i;
    }
}
function vt(e, t) {
  if (He) return e();
  let n = !1;
  t || (He = []), mt ? n = !0 : mt = [], pn++;
  try {
    const i = e();
    return ka(n), i;
  } catch (i) {
    n || (mt = null), He = null, Fn(i);
  }
}
function ka(e) {
  if (He && (er(He), He = null), e) return;
  const t = mt;
  mt = null, t.length && vt(() => Gi(t), !1);
}
function er(e) {
  for (let t = 0; t < e.length; t++) mn(e[t]);
}
function $a(e) {
  let t, n = 0;
  for (t = 0; t < e.length; t++) {
    const i = e[t];
    i.user ? e[n++] = i : mn(i);
  }
  for (t = 0; t < n; t++) mn(e[t]);
}
function vn(e, t) {
  e.state = 0;
  for (let n = 0; n < e.sources.length; n += 1) {
    const i = e.sources[n];
    if (i.sources) {
      const r = i.state;
      r === xt ? i !== t && (!i.updatedAt || i.updatedAt < pn) && mn(i) : r === fn && vn(i, t);
    }
  }
}
function tr(e) {
  for (let t = 0; t < e.observers.length; t += 1) {
    const n = e.observers[t];
    n.state || (n.state = fn, n.pure ? He.push(n) : mt.push(n), n.observers && tr(n));
  }
}
function Ft(e) {
  let t;
  if (e.sources)
    for (; e.sources.length; ) {
      const n = e.sources.pop(), i = e.sourceSlots.pop(), r = n.observers;
      if (r && r.length) {
        const a = r.pop(), s = n.observerSlots.pop();
        i < r.length && (a.sourceSlots[s] = i, r[i] = a, n.observerSlots[i] = s);
      }
    }
  if (e.tOwned) {
    for (t = e.tOwned.length - 1; t >= 0; t--) Ft(e.tOwned[t]);
    delete e.tOwned;
  }
  if (e.owned) {
    for (t = e.owned.length - 1; t >= 0; t--) Ft(e.owned[t]);
    e.owned = null;
  }
  if (e.cleanups) {
    for (t = e.cleanups.length - 1; t >= 0; t--) e.cleanups[t]();
    e.cleanups = null;
  }
  e.state = 0;
}
function nn(e) {
  return e instanceof Error ? e : new Error(typeof e == "string" ? e : "Unknown error", {
    cause: e
  });
}
function Fn(e, t = Ee) {
  throw nn(e);
}
function Dn(e) {
  if (typeof e == "function" && !e.length) return Dn(e());
  if (Array.isArray(e)) {
    const t = [];
    for (let n = 0; n < e.length; n++) {
      const i = Dn(e[n]);
      Array.isArray(i) ? t.push.apply(t, i) : t.push(i);
    }
    return t;
  }
  return e;
}
function _a(e, t) {
  return function(i) {
    let r;
    return P(() => r = qe(() => (Ee.context = Xe(Ce({}, Ee.context), {
      [e]: i.value
    }), Qi(() => i.children))), void 0), r;
  };
}
const Sa = /* @__PURE__ */ Symbol("fallback");
function ai(e) {
  for (let t = 0; t < e.length; t++) e[t]();
}
function Ca(e, t, n = {}) {
  let i = [], r = [], a = [], s = 0, l = t.length > 1 ? [] : null;
  return _t(() => ai(a)), () => {
    let c = e() || [], o = c.length, d, f;
    return c[Vn], qe(() => {
      let k, C, m, u, x, $, S, _, L;
      if (o === 0)
        s !== 0 && (ai(a), a = [], i = [], r = [], s = 0, l && (l = [])), n.fallback && (i = [Sa], r[0] = tn((V) => (a[0] = V, n.fallback())), s = 1);
      else if (s === 0) {
        for (r = new Array(o), f = 0; f < o; f++)
          i[f] = c[f], r[f] = tn(w);
        s = o;
      } else {
        for (m = new Array(o), u = new Array(o), l && (x = new Array(o)), $ = 0, S = Math.min(s, o); $ < S && i[$] === c[$]; $++) ;
        for (S = s - 1, _ = o - 1; S >= $ && _ >= $ && i[S] === c[_]; S--, _--)
          m[_] = r[S], u[_] = a[S], l && (x[_] = l[S]);
        for (k = /* @__PURE__ */ new Map(), C = new Array(_ + 1), f = _; f >= $; f--)
          L = c[f], d = k.get(L), C[f] = d === void 0 ? -1 : d, k.set(L, f);
        for (d = $; d <= S; d++)
          L = i[d], f = k.get(L), f !== void 0 && f !== -1 ? (m[f] = r[d], u[f] = a[d], l && (x[f] = l[d]), f = C[f], k.set(L, f)) : a[d]();
        for (f = $; f < o; f++)
          f in m ? (r[f] = m[f], a[f] = u[f], l && (l[f] = x[f], l[f](f))) : r[f] = tn(w);
        r = r.slice(0, s = o), i = c.slice(0);
      }
      return r;
    });
    function w(k) {
      if (a[f] = k, l) {
        const [C, m] = z(f);
        return l[f] = m, t(c[f], C);
      }
      return t(c[f]);
    }
  };
}
function g(e, t) {
  return qe(() => e(t || {}));
}
function Yt() {
  return !0;
}
const jn = {
  get(e, t, n) {
    return t === ot ? n : e.get(t);
  },
  has(e, t) {
    return t === ot ? !0 : e.has(t);
  },
  set: Yt,
  deleteProperty: Yt,
  getOwnPropertyDescriptor(e, t) {
    return {
      configurable: !0,
      enumerable: !0,
      get() {
        return e.get(t);
      },
      set: Yt,
      deleteProperty: Yt
    };
  },
  ownKeys(e) {
    return e.keys();
  }
};
function Nn(e) {
  return (e = typeof e == "function" ? e() : e) ? e : {};
}
function Ma() {
  for (let e = 0, t = this.length; e < t; ++e) {
    const n = this[e]();
    if (n !== void 0) return n;
  }
}
function et(...e) {
  let t = !1;
  for (let s = 0; s < e.length; s++) {
    const l = e[s];
    t = t || !!l && ot in l, e[s] = typeof l == "function" ? (t = !0, Me(l)) : l;
  }
  if (qi && t)
    return new Proxy({
      get(s) {
        for (let l = e.length - 1; l >= 0; l--) {
          const c = Nn(e[l])[s];
          if (c !== void 0) return c;
        }
      },
      has(s) {
        for (let l = e.length - 1; l >= 0; l--)
          if (s in Nn(e[l])) return !0;
        return !1;
      },
      keys() {
        const s = [];
        for (let l = 0; l < e.length; l++) s.push(...Object.keys(Nn(e[l])));
        return [...new Set(s)];
      }
    }, jn);
  const n = {}, i = /* @__PURE__ */ Object.create(null);
  for (let s = e.length - 1; s >= 0; s--) {
    const l = e[s];
    if (!l) continue;
    const c = Object.getOwnPropertyNames(l);
    for (let o = c.length - 1; o >= 0; o--) {
      const d = c[o];
      if (d === "__proto__" || d === "constructor") continue;
      const f = Object.getOwnPropertyDescriptor(l, d);
      if (!i[d])
        i[d] = f.get ? {
          enumerable: !0,
          configurable: !0,
          get: Ma.bind(n[d] = [f.get.bind(l)])
        } : f.value !== void 0 ? f : void 0;
      else {
        const w = n[d];
        w && (f.get ? w.push(f.get.bind(l)) : f.value !== void 0 && w.push(() => f.value));
      }
    }
  }
  const r = {}, a = Object.keys(i);
  for (let s = a.length - 1; s >= 0; s--) {
    const l = a[s], c = i[l];
    c && c.get ? Object.defineProperty(r, l, c) : r[l] = c ? c.value : void 0;
  }
  return r;
}
function Bn(e, ...t) {
  const n = t.length;
  if (qi && ot in e) {
    const r = n > 1 ? t.flat() : t[0], a = t.map((s) => new Proxy({
      get(l) {
        return s.includes(l) ? e[l] : void 0;
      },
      has(l) {
        return s.includes(l) && l in e;
      },
      keys() {
        return s.filter((l) => l in e);
      }
    }, jn));
    return a.push(new Proxy({
      get(s) {
        return r.includes(s) ? void 0 : e[s];
      },
      has(s) {
        return r.includes(s) ? !1 : s in e;
      },
      keys() {
        return Object.keys(e).filter((s) => !r.includes(s));
      }
    }, jn)), a;
  }
  const i = [];
  for (let r = 0; r <= n; r++)
    i[r] = {};
  for (const r of Object.getOwnPropertyNames(e)) {
    let a = n;
    for (let c = 0; c < t.length; c++)
      if (t[c].includes(r)) {
        a = c;
        break;
      }
    const s = Object.getOwnPropertyDescriptor(e, r);
    !s.get && !s.set && s.enumerable && s.writable && s.configurable ? i[a][r] = s.value : Object.defineProperty(i[a], r, s);
  }
  return i;
}
const nr = (e) => `Stale read from <${e}>.`;
function ce(e) {
  const t = "fallback" in e && {
    fallback: () => e.fallback
  };
  return Me(Ca(() => e.each, e.children, t || void 0));
}
function D(e) {
  const t = e.keyed, n = Me(() => e.when, void 0, void 0), i = t ? n : Me(n, void 0, {
    equals: (r, a) => !r == !a
  });
  return Me(() => {
    const r = i();
    if (r) {
      const a = e.children;
      return typeof a == "function" && a.length > 0 ? qe(() => a(t ? r : () => {
        if (!qe(i)) throw nr("Show");
        return n();
      })) : a;
    }
    return e.fallback;
  }, void 0, void 0);
}
function we(e) {
  const t = Qi(() => e.children), n = Me(() => {
    const i = t(), r = Array.isArray(i) ? i : [i];
    let a = () => {
    };
    for (let s = 0; s < r.length; s++) {
      const l = s, c = r[s], o = a, d = Me(() => o() ? void 0 : c.when, void 0, void 0), f = c.keyed ? d : Me(d, void 0, {
        equals: (w, k) => !w == !k
      });
      a = () => o() || (f() ? [l, d, c] : void 0);
    }
    return a;
  });
  return Me(() => {
    const i = n()();
    if (!i) return e.fallback;
    const [r, a, s] = i, l = s.children;
    return typeof l == "function" && l.length > 0 ? qe(() => l(s.keyed ? a() : () => {
      var o;
      if (((o = qe(n)()) == null ? void 0 : o[0]) !== r) throw nr("Match");
      return a();
    })) : l;
  }, void 0, void 0);
}
function te(e) {
  return e;
}
const Ia = [
  "allowfullscreen",
  "async",
  "alpha",
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
  "selected",
  "adauctionheaders",
  "browsingtopics",
  "credentialless",
  "defaultchecked",
  "defaultmuted",
  "defaultselected",
  "defer",
  "disablepictureinpicture",
  "disableremoteplayback",
  "preservespitch",
  "shadowrootclonable",
  "shadowrootcustomelementregistry",
  "shadowrootdelegatesfocus",
  "shadowrootserializable",
  "sharedstoragewritable"
], Ea = /* @__PURE__ */ new Set([
  "className",
  "value",
  "readOnly",
  "noValidate",
  "formNoValidate",
  "isMap",
  "noModule",
  "playsInline",
  "adAuctionHeaders",
  "allowFullscreen",
  "browsingTopics",
  "defaultChecked",
  "defaultMuted",
  "defaultSelected",
  "disablePictureInPicture",
  "disableRemotePlayback",
  "preservesPitch",
  "shadowRootClonable",
  "shadowRootCustomElementRegistry",
  "shadowRootDelegatesFocus",
  "shadowRootSerializable",
  "sharedStorageWritable",
  ...Ia
]), La = /* @__PURE__ */ new Set(["innerHTML", "textContent", "innerText", "children"]), Oa = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(null), {
  className: "class",
  htmlFor: "for"
}), Aa = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(null), {
  class: "className",
  novalidate: {
    $: "noValidate",
    FORM: 1
  },
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
  },
  adauctionheaders: {
    $: "adAuctionHeaders",
    IFRAME: 1
  },
  allowfullscreen: {
    $: "allowFullscreen",
    IFRAME: 1
  },
  browsingtopics: {
    $: "browsingTopics",
    IMG: 1
  },
  defaultchecked: {
    $: "defaultChecked",
    INPUT: 1
  },
  defaultmuted: {
    $: "defaultMuted",
    AUDIO: 1,
    VIDEO: 1
  },
  defaultselected: {
    $: "defaultSelected",
    OPTION: 1
  },
  disablepictureinpicture: {
    $: "disablePictureInPicture",
    VIDEO: 1
  },
  disableremoteplayback: {
    $: "disableRemotePlayback",
    AUDIO: 1,
    VIDEO: 1
  },
  preservespitch: {
    $: "preservesPitch",
    AUDIO: 1,
    VIDEO: 1
  },
  shadowrootclonable: {
    $: "shadowRootClonable",
    TEMPLATE: 1
  },
  shadowrootdelegatesfocus: {
    $: "shadowRootDelegatesFocus",
    TEMPLATE: 1
  },
  shadowrootserializable: {
    $: "shadowRootSerializable",
    TEMPLATE: 1
  },
  sharedstoragewritable: {
    $: "sharedStorageWritable",
    IFRAME: 1,
    IMG: 1
  }
});
function Ra(e, t) {
  const n = Aa[e];
  return typeof n == "object" ? n[t] ? n.$ : void 0 : n;
}
const Na = /* @__PURE__ */ new Set(["beforeinput", "click", "dblclick", "contextmenu", "focusin", "focusout", "input", "keydown", "keyup", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "pointerdown", "pointermove", "pointerout", "pointerover", "pointerup", "touchend", "touchmove", "touchstart"]), Va = {
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace"
}, _e = (e) => Me(() => e());
function Ta(e, t, n) {
  let i = n.length, r = t.length, a = i, s = 0, l = 0, c = t[r - 1].nextSibling, o = null;
  for (; s < r || l < a; ) {
    if (t[s] === n[l]) {
      s++, l++;
      continue;
    }
    for (; t[r - 1] === n[a - 1]; )
      r--, a--;
    if (r === s) {
      const d = a < i ? l ? n[l - 1].nextSibling : n[a - l] : c;
      for (; l < a; ) e.insertBefore(n[l++], d);
    } else if (a === l)
      for (; s < r; )
        (!o || !o.has(t[s])) && t[s].remove(), s++;
    else if (t[s] === n[a - 1] && n[l] === t[r - 1]) {
      const d = t[--r].nextSibling;
      e.insertBefore(n[l++], t[s++].nextSibling), e.insertBefore(n[--a], d), t[r] = n[a];
    } else {
      if (!o) {
        o = /* @__PURE__ */ new Map();
        let f = l;
        for (; f < a; ) o.set(n[f], f++);
      }
      const d = o.get(t[s]);
      if (d != null)
        if (l < d && d < a) {
          let f = s, w = 1, k;
          for (; ++f < r && f < a && !((k = o.get(t[f])) == null || k !== d + w); )
            w++;
          if (w > d - l) {
            const C = t[s];
            for (; l < d; ) e.insertBefore(n[l++], C);
          } else e.replaceChild(n[l++], t[s++]);
        } else s++;
      else t[s++].remove();
    }
  }
}
const li = "_$DX_DELEGATE";
function Pa(e, t, n, i = {}) {
  let r;
  return tn((a) => {
    r = a, t === document ? e() : p(t, e(), t.firstChild ? null : void 0, n);
  }, i.owner), () => {
    r(), t.textContent = "";
  };
}
function y(e, t, n, i) {
  let r;
  const a = () => {
    const l = document.createElement("template");
    return l.innerHTML = e, l.content.firstChild;
  }, s = () => (r || (r = a())).cloneNode(!0);
  return s.cloneNode = s, s;
}
function he(e, t = window.document) {
  const n = t[li] || (t[li] = /* @__PURE__ */ new Set());
  for (let i = 0, r = e.length; i < r; i++) {
    const a = e[i];
    n.has(a) || (n.add(a), t.addEventListener(a, Ba));
  }
}
function U(e, t, n) {
  n == null ? e.removeAttribute(t) : e.setAttribute(t, n);
}
function Da(e, t, n, i) {
  i == null ? e.removeAttributeNS(t, n) : e.setAttributeNS(t, n, i);
}
function ja(e, t, n) {
  n ? e.setAttribute(t, "") : e.removeAttribute(t);
}
function st(e, t) {
  t == null ? e.removeAttribute("class") : e.className = t;
}
function Te(e, t, n, i) {
  if (i)
    Array.isArray(n) ? (e[`$$${t}`] = n[0], e[`$$${t}Data`] = n[1]) : e[`$$${t}`] = n;
  else if (Array.isArray(n)) {
    const r = n[0];
    e.addEventListener(t, n[0] = (a) => r.call(e, n[1], a));
  } else e.addEventListener(t, n, typeof n != "function" && n);
}
function X(e, t, n = {}) {
  const i = Object.keys(t || {}), r = Object.keys(n);
  let a, s;
  for (a = 0, s = r.length; a < s; a++) {
    const l = r[a];
    !l || l === "undefined" || t[l] || (si(e, l, !1), delete n[l]);
  }
  for (a = 0, s = i.length; a < s; a++) {
    const l = i[a], c = !!t[l];
    !l || l === "undefined" || n[l] === c || !c || (si(e, l, !0), n[l] = c);
  }
  return n;
}
function Ka(e, t, n) {
  if (!t) return n ? U(e, "style") : t;
  const i = e.style;
  if (typeof t == "string") return i.cssText = t;
  typeof n == "string" && (i.cssText = n = void 0), n || (n = {}), t || (t = {});
  let r, a;
  for (a in n)
    t[a] == null && i.removeProperty(a), delete n[a];
  for (a in t)
    r = t[a], r !== n[a] && (i.setProperty(a, r), n[a] = r);
  return n;
}
function Hn(e, t = {}, n, i) {
  const r = {};
  return i || P(() => r.children = Bt(e, t.children, r.children)), P(() => typeof t.ref == "function" && nt(t.ref, e)), P(() => za(e, t, n, !0, r, !0)), r;
}
function nt(e, t, n) {
  return qe(() => e(t, n));
}
function p(e, t, n, i) {
  if (n !== void 0 && !i && (i = []), typeof t != "function") return Bt(e, t, i, n);
  P((r) => Bt(e, t(), r, n), i);
}
function za(e, t, n, i, r = {}, a = !1) {
  t || (t = {});
  for (const s in r)
    if (!(s in t)) {
      if (s === "children") continue;
      r[s] = oi(e, s, null, r[s], n, a, t);
    }
  for (const s in t) {
    if (s === "children")
      continue;
    const l = t[s];
    r[s] = oi(e, s, l, r[s], n, a, t);
  }
}
function Fa(e) {
  return e.toLowerCase().replace(/-([a-z])/g, (t, n) => n.toUpperCase());
}
function si(e, t, n) {
  const i = t.trim().split(/\s+/);
  for (let r = 0, a = i.length; r < a; r++) e.classList.toggle(i[r], n);
}
function oi(e, t, n, i, r, a, s) {
  let l, c, o, d, f;
  if (t === "style") return Ka(e, n, i);
  if (t === "classList") return X(e, n, i);
  if (n === i) return i;
  if (t === "ref")
    a || n(e);
  else if (t.slice(0, 3) === "on:") {
    const w = t.slice(3);
    i && e.removeEventListener(w, i, typeof i != "function" && i), n && e.addEventListener(w, n, typeof n != "function" && n);
  } else if (t.slice(0, 10) === "oncapture:") {
    const w = t.slice(10);
    i && e.removeEventListener(w, i, !0), n && e.addEventListener(w, n, !0);
  } else if (t.slice(0, 2) === "on") {
    const w = t.slice(2).toLowerCase(), k = Na.has(w);
    if (!k && i) {
      const C = Array.isArray(i) ? i[0] : i;
      e.removeEventListener(w, C);
    }
    (k || n) && (Te(e, w, n, k), k && he([w]));
  } else if (t.slice(0, 5) === "attr:")
    U(e, t.slice(5), n);
  else if (t.slice(0, 5) === "bool:")
    ja(e, t.slice(5), n);
  else if ((f = t.slice(0, 5) === "prop:") || (o = La.has(t)) || !r && ((d = Ra(t, e.tagName)) || (c = Ea.has(t))) || (l = e.nodeName.includes("-") || "is" in s))
    f && (t = t.slice(5), c = !0), t === "class" || t === "className" ? st(e, n) : l && !c && !o ? e[Fa(t)] = n : e[d || t] = n;
  else {
    const w = r && t.indexOf(":") > -1 && Va[t.split(":")[0]];
    w ? Da(e, w, t, n) : U(e, Oa[t] || t, n);
  }
  return n;
}
function Ba(e) {
  let t = e.target;
  const n = `$$${e.type}`, i = e.target, r = e.currentTarget, a = (c) => Object.defineProperty(e, "target", {
    configurable: !0,
    value: c
  }), s = () => {
    const c = t[n];
    if (c && !t.disabled) {
      const o = t[`${n}Data`];
      if (o !== void 0 ? c.call(t, o, e) : c.call(t, e), e.cancelBubble) return;
    }
    return t.host && typeof t.host != "string" && !t.host._$host && t.contains(e.target) && a(t.host), !0;
  }, l = () => {
    for (; s() && (t = t._$host || t.parentNode || t.host); ) ;
  };
  if (Object.defineProperty(e, "currentTarget", {
    configurable: !0,
    get() {
      return t || document;
    }
  }), e.composedPath) {
    const c = e.composedPath();
    a(c[0]);
    for (let o = 0; o < c.length - 2 && (t = c[o], !!s()); o++) {
      if (t._$host) {
        t = t._$host, l();
        break;
      }
      if (t.parentNode === r)
        break;
    }
  } else l();
  a(i);
}
function Bt(e, t, n, i, r) {
  for (; typeof n == "function"; ) n = n();
  if (t === n) return n;
  const a = typeof t, s = i !== void 0;
  if (e = s && n[0] && n[0].parentNode || e, a === "string" || a === "number") {
    if (a === "number" && (t = t.toString(), t === n))
      return n;
    if (s) {
      let l = n[0];
      l && l.nodeType === 3 ? l.data !== t && (l.data = t) : l = document.createTextNode(t), n = St(e, n, i, l);
    } else
      n !== "" && typeof n == "string" ? n = e.firstChild.data = t : n = e.textContent = t;
  } else if (t == null || a === "boolean")
    n = St(e, n, i);
  else {
    if (a === "function")
      return P(() => {
        let l = t();
        for (; typeof l == "function"; ) l = l();
        n = Bt(e, l, n, i);
      }), () => n;
    if (Array.isArray(t)) {
      const l = [], c = n && Array.isArray(n);
      if (Kn(l, t, n, r))
        return P(() => n = Bt(e, l, n, i, !0)), () => n;
      if (l.length === 0) {
        if (n = St(e, n, i), s) return n;
      } else c ? n.length === 0 ? di(e, l, i) : Ta(e, n, l) : (n && St(e), di(e, l));
      n = l;
    } else if (t.nodeType) {
      if (Array.isArray(n)) {
        if (s) return n = St(e, n, i, t);
        St(e, n, null, t);
      } else n == null || n === "" || !e.firstChild ? e.appendChild(t) : e.replaceChild(t, e.firstChild);
      n = t;
    }
  }
  return n;
}
function Kn(e, t, n, i) {
  let r = !1;
  for (let a = 0, s = t.length; a < s; a++) {
    let l = t[a], c = n && n[e.length], o;
    if (!(l == null || l === !0 || l === !1)) if ((o = typeof l) == "object" && l.nodeType)
      e.push(l);
    else if (Array.isArray(l))
      r = Kn(e, l, c) || r;
    else if (o === "function")
      if (i) {
        for (; typeof l == "function"; ) l = l();
        r = Kn(e, Array.isArray(l) ? l : [l], Array.isArray(c) ? c : [c]) || r;
      } else
        e.push(l), r = !0;
    else {
      const d = String(l);
      c && c.nodeType === 3 && c.data === d ? e.push(c) : e.push(document.createTextNode(d));
    }
  }
  return r;
}
function di(e, t, n = null) {
  for (let i = 0, r = t.length; i < r; i++) e.insertBefore(t[i], n);
}
function St(e, t, n, i) {
  if (n === void 0) return e.textContent = "";
  const r = i || document.createTextNode("");
  if (t.length) {
    let a = !1;
    for (let s = t.length - 1; s >= 0; s--) {
      const l = t[s];
      if (r !== l) {
        const c = l.parentNode === e;
        !a && !s ? c ? e.replaceChild(r, l) : e.insertBefore(r, n) : c && l.remove();
      } else a = !0;
    }
  } else e.insertBefore(r, n);
  return [r];
}
var ir = /* @__PURE__ */ ((e) => (e[e.CAWI = 1] = "CAWI", e[e.CAPI = 2] = "CAPI", e))(ir || {}), rr = /* @__PURE__ */ ((e) => (e[e.OPEN = 1] = "OPEN", e[e.REVIEW = 2] = "REVIEW", e[e.CLOSE = 3] = "CLOSE", e))(rr || {}), ar = /* @__PURE__ */ ((e) => (e[e.INITIAL = 1] = "INITIAL", e[e.ASSIGN = 2] = "ASSIGN", e))(ar || {}), lr = /* @__PURE__ */ ((e) => (e[e.ONLINE = 1] = "ONLINE", e[e.OFFLINE = 2] = "OFFLINE", e))(lr || {}), Ha = /* @__PURE__ */ ((e) => (e[e.TEMPLATE = 1] = "TEMPLATE", e[e.API = 2] = "API", e[e.COMPONENT = 3] = "COMPONENT", e[e.OFFLINE = 4] = "OFFLINE", e))(Ha || {}), Ua = /* @__PURE__ */ ((e) => (e[e.WARNING = 1] = "WARNING", e[e.ERROR = 2] = "ERROR", e))(Ua || {}), Ja = /* @__PURE__ */ ((e) => (e[e.Section = 1] = "Section", e[e.NestedInput = 2] = "NestedInput", e[e.InnerHTML = 3] = "InnerHTML", e[e.VariableInput = 4] = "VariableInput", e[e.DateInput = 11] = "DateInput", e[e.DateTimeLocalInput = 12] = "DateTimeLocalInput", e[e.TimeInput = 13] = "TimeInput", e[e.MonthInput = 14] = "MonthInput", e[e.WeekInput = 15] = "WeekInput", e[e.SingleCheckInput = 16] = "SingleCheckInput", e[e.ToggleInput = 17] = "ToggleInput", e[e.RangeSliderInput = 18] = "RangeSliderInput", e[e.UrlInput = 19] = "UrlInput", e[e.CurrencyInput = 20] = "CurrencyInput", e[e.ListTextInputRepeat = 21] = "ListTextInputRepeat", e[e.ListSelectInputRepeat = 22] = "ListSelectInputRepeat", e[e.MultipleSelectInput = 23] = "MultipleSelectInput", e[e.MaskingInput = 24] = "MaskingInput", e[e.TextInput = 25] = "TextInput", e[e.RadioInput = 26] = "RadioInput", e[e.SelectInput = 27] = "SelectInput", e[e.NumberInput = 28] = "NumberInput", e[e.CheckboxInput = 29] = "CheckboxInput", e[e.TextAreaInput = 30] = "TextAreaInput", e[e.EmailInput = 31] = "EmailInput", e[e.PhotoInput = 32] = "PhotoInput", e[e.GpsInput = 33] = "GpsInput", e[e.CsvInput = 34] = "CsvInput", e[e.NowInput = 35] = "NowInput", e[e.SignatureInput = 36] = "SignatureInput", e[e.UnitInput = 37] = "UnitInput", e[e.DecimalInput = 38] = "DecimalInput", e))(Ja || {});
const Wa = {
  clientMode: ir.CAWI,
  formMode: rr.OPEN,
  initialMode: ar.INITIAL,
  lookupMode: lr.ONLINE,
  lookupKey: "keys",
  lookupValue: "values"
}, bn = /* @__PURE__ */ Symbol("store-raw"), Mt = /* @__PURE__ */ Symbol("store-node"), ft = /* @__PURE__ */ Symbol("store-has"), sr = /* @__PURE__ */ Symbol("store-self");
function or(e) {
  let t = e[ot];
  if (!t && (Object.defineProperty(e, ot, {
    value: t = new Proxy(e, Ya)
  }), !Array.isArray(e))) {
    const n = Object.keys(e), i = Object.getOwnPropertyDescriptors(e);
    for (let r = 0, a = n.length; r < a; r++) {
      const s = n[r];
      i[s].get && Object.defineProperty(e, s, {
        enumerable: i[s].enumerable,
        get: i[s].get.bind(t)
      });
    }
  }
  return t;
}
function It(e) {
  let t;
  return e != null && typeof e == "object" && (e[ot] || !(t = Object.getPrototypeOf(e)) || t === Object.prototype || Array.isArray(e));
}
function Et(e, t = /* @__PURE__ */ new Set()) {
  let n, i, r, a;
  if (n = e != null && e[bn]) return n;
  if (!It(e) || t.has(e)) return e;
  if (Array.isArray(e)) {
    Object.isFrozen(e) ? e = e.slice(0) : t.add(e);
    for (let s = 0, l = e.length; s < l; s++)
      r = e[s], (i = Et(r, t)) !== r && (e[s] = i);
  } else {
    Object.isFrozen(e) ? e = Object.assign({}, e) : t.add(e);
    const s = Object.keys(e), l = Object.getOwnPropertyDescriptors(e);
    for (let c = 0, o = s.length; c < o; c++)
      a = s[c], !l[a].get && (r = e[a], (i = Et(r, t)) !== r && (e[a] = i));
  }
  return e;
}
function wn(e, t) {
  let n = e[t];
  return n || Object.defineProperty(e, t, {
    value: n = /* @__PURE__ */ Object.create(null)
  }), n;
}
function Ht(e, t, n) {
  if (e[t]) return e[t];
  const [i, r] = z(n, {
    equals: !1,
    internal: !0
  });
  return i.$ = r, e[t] = i;
}
function qa(e, t) {
  const n = Reflect.getOwnPropertyDescriptor(e, t);
  return !n || n.get || !n.configurable || t === ot || t === Mt || (delete n.value, delete n.writable, n.get = () => e[ot][t]), n;
}
function dr(e) {
  Pn() && Ht(wn(e, Mt), sr)();
}
function Ga(e) {
  return dr(e), Reflect.ownKeys(e);
}
const Ya = {
  get(e, t, n) {
    if (t === bn) return e;
    if (t === ot) return n;
    if (t === Vn)
      return dr(e), n;
    const i = wn(e, Mt), r = i[t];
    let a = r ? r() : e[t];
    if (t === Mt || t === ft || t === "__proto__") return a;
    if (!r) {
      const s = Object.getOwnPropertyDescriptor(e, t);
      Pn() && (typeof a != "function" || e.hasOwnProperty(t)) && !(s && s.get) && (a = Ht(i, t, a)());
    }
    return It(a) ? or(a) : a;
  },
  has(e, t) {
    return t === bn || t === ot || t === Vn || t === Mt || t === ft || t === "__proto__" ? !0 : (Pn() && Ht(wn(e, ft), t)(), t in e);
  },
  set() {
    return !0;
  },
  deleteProperty() {
    return !0;
  },
  ownKeys: Ga,
  getOwnPropertyDescriptor: qa
};
function Lt(e, t, n, i = !1) {
  if (!i && e[t] === n) return;
  const r = e[t], a = e.length;
  n === void 0 ? (delete e[t], e[ft] && e[ft][t] && r !== void 0 && e[ft][t].$()) : (e[t] = n, e[ft] && e[ft][t] && r === void 0 && e[ft][t].$());
  let s = wn(e, Mt), l;
  if ((l = Ht(s, t, r)) && l.$(() => n), Array.isArray(e) && e.length !== a) {
    for (let c = e.length; c < a; c++) (l = s[c]) && l.$();
    (l = Ht(s, "length", a)) && l.$(e.length);
  }
  (l = s[sr]) && l.$();
}
function cr(e, t) {
  const n = Object.keys(t);
  for (let i = 0; i < n.length; i += 1) {
    const r = n[i];
    Lt(e, r, t[r]);
  }
}
function Qa(e, t) {
  if (typeof t == "function" && (t = t(e)), t = Et(t), Array.isArray(t)) {
    if (e === t) return;
    let n = 0, i = t.length;
    for (; n < i; n++) {
      const r = t[n];
      e[n] !== r && Lt(e, n, r);
    }
    Lt(e, "length", i);
  } else cr(e, t);
}
function Dt(e, t, n = []) {
  let i, r = e;
  if (t.length > 1) {
    i = t.shift();
    const s = typeof i, l = Array.isArray(e);
    if (Array.isArray(i)) {
      for (let c = 0; c < i.length; c++)
        Dt(e, [i[c]].concat(t), n);
      return;
    } else if (l && s === "function") {
      for (let c = 0; c < e.length; c++)
        i(e[c], c) && Dt(e, [c].concat(t), n);
      return;
    } else if (l && s === "object") {
      const {
        from: c = 0,
        to: o = e.length - 1,
        by: d = 1
      } = i;
      for (let f = c; f <= o; f += d)
        Dt(e, [f].concat(t), n);
      return;
    } else if (t.length > 1) {
      Dt(e[i], t, [i].concat(n));
      return;
    }
    r = e[i], n = [i].concat(n);
  }
  let a = t[0];
  typeof a == "function" && (a = a(r, n), a === r) || i === void 0 && a == null || (a = Et(a), i === void 0 || It(r) && It(a) && !Array.isArray(a) ? cr(r, a) : Lt(e, i, a));
}
function Un(...[e, t]) {
  const n = Et(e || {}), i = Array.isArray(n), r = or(n);
  function a(...s) {
    Tn(() => {
      i && s.length === 1 ? Qa(n, s[0]) : Dt(n, s);
    });
  }
  return [r, a];
}
const xn = /* @__PURE__ */ new WeakMap(), ur = {
  get(e, t) {
    if (t === bn) return e;
    const n = e[t];
    let i;
    return It(n) ? xn.get(n) || (xn.set(n, i = new Proxy(n, ur)), i) : n;
  },
  set(e, t, n) {
    return Lt(e, t, Et(n)), !0;
  },
  deleteProperty(e, t) {
    return Lt(e, t, void 0, !0), !0;
  }
};
function ci(e) {
  return (t) => {
    if (It(t)) {
      let n;
      (n = xn.get(t)) || xn.set(t, n = new Proxy(t, ur)), e(n);
    }
    return t;
  };
}
const gr = Jt();
function Za(e) {
  const [t, n] = Un({
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
  return g(gr.Provider, {
    value: i,
    get children() {
      return e.children;
    }
  });
}
function hr() {
  return Wt(gr);
}
const fr = Jt(), Xa = (e) => g(fr.Provider, {
  get value() {
    return e.stores;
  },
  get children() {
    return e.children;
  }
});
function Ze() {
  const e = Wt(fr);
  if (!e)
    throw new Error("useStores must be used within a StoreProvider. Make sure your component is wrapped with <StoreProvider stores={...}>.");
  return e;
}
function it() {
  return Ze().reference;
}
function mr() {
  return Ze().response;
}
function vr() {
  return Ze().template;
}
function br() {
  return Ze().media;
}
function wr() {
  return Ze().remark;
}
function Jn() {
  return Ze().sidebar;
}
function rt() {
  return Ze().locale;
}
function xr() {
  return Ze().summary;
}
function yr() {
  return Ze().counter;
}
function pr() {
  return Ze().note;
}
function kr() {
  return Ze().principal;
}
function el() {
  return Ze().referenceHistoryEnable;
}
function $r() {
  return Ze().referenceEnableFalse;
}
var be = /* @__PURE__ */ ((e) => (e[e.SECTION = 1] = "SECTION", e[e.NESTED = 2] = "NESTED", e[e.INNER_HTML = 3] = "INNER_HTML", e[e.VARIABLE = 4] = "VARIABLE", e[e.DATE = 11] = "DATE", e[e.DATETIME = 12] = "DATETIME", e[e.TIME = 13] = "TIME", e[e.MONTH = 14] = "MONTH", e[e.WEEK = 15] = "WEEK", e[e.SINGLE_CHECK = 16] = "SINGLE_CHECK", e[e.TOGGLE = 17] = "TOGGLE", e[e.RANGE_SLIDER = 18] = "RANGE_SLIDER", e[e.URL = 19] = "URL", e[e.CURRENCY = 20] = "CURRENCY", e[e.LIST_TEXT_REPEAT = 21] = "LIST_TEXT_REPEAT", e[e.LIST_SELECT_REPEAT = 22] = "LIST_SELECT_REPEAT", e[e.MULTIPLE_SELECT = 23] = "MULTIPLE_SELECT", e[e.MASKING = 24] = "MASKING", e[e.TEXT = 25] = "TEXT", e[e.RADIO = 26] = "RADIO", e[e.SELECT = 27] = "SELECT", e[e.NUMBER = 28] = "NUMBER", e[e.CHECKBOX = 29] = "CHECKBOX", e[e.TEXTAREA = 30] = "TEXTAREA", e[e.EMAIL = 31] = "EMAIL", e[e.PHOTO = 32] = "PHOTO", e[e.GPS = 33] = "GPS", e[e.CSV = 34] = "CSV", e[e.NOW = 35] = "NOW", e[e.SIGNATURE = 36] = "SIGNATURE", e[e.UNIT = 37] = "UNIT", e[e.DECIMAL = 38] = "DECIMAL", e[e.AUDIO = 39] = "AUDIO", e[e.BARCODE = 40] = "BARCODE", e[e.VIDEO = 41] = "VIDEO", e[e.FILE = 42] = "FILE", e))(be || {}), De = /* @__PURE__ */ ((e) => (e[e.VALID = 0] = "VALID", e[e.WARNING = 1] = "WARNING", e[e.ERROR = 2] = "ERROR", e))(De || {}), ut = /* @__PURE__ */ ((e) => (e[e.CAWI = 1] = "CAWI", e[e.CAPI = 2] = "CAPI", e[e.PAPI = 3] = "PAPI", e))(ut || {});
const Ue = {
  /**
   * Email validation pattern
   * Supports standard email format with TLD
   */
  EMAIL: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  /**
   * Nested dataKey separator
   */
  NESTED_SEPARATOR: "#"
}, tl = {
  /** Default enable condition result */
  ENABLE_CONDITION: !0
};
new Set(
  Object.values(be).filter(
    (e) => typeof e == "number" && e > 4
  )
);
var nl = /* @__PURE__ */ y('<div><div class="grid md:grid-cols-12 dark:border-gray-200/[.10] p-2"><div class="font-light text-sm pb-2.5 px-2 col-start-2 col-end-12 space-y-4 transition-all delay-100">'), ui = /* @__PURE__ */ y('<input type=text class="w-full font-light cursor-pointer px-4 py-2.5 text-sm text-gray-700 bg-blue-50 bg-clip-padding dark:bg-gray-300 border border-solid border-blue-100 rounded-full rounded-tl-none transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"disabled>'), il = /* @__PURE__ */ y('<div class="grid grid-cols-12 "><div class="col-span-10 mr-2 "></div><div class="col-span-2 -ml-12 space-x-1 flex justify-evenly -z-0"><button class="bg-blue-800 hover:bg-blue-700 text-white text-justify justify-center text-xs w-full py-2 rounded-tl-none rounded-full focus:outline-none group inline-flex items-center">&nbsp;&nbsp;<svg xmlns=http://www.w3.org/2000/svg class="h-4 w-5"viewBox="0 0 20 20"fill=currentColor><path fill-rule=evenodd d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"clip-rule=evenodd>');
const _r = (e) => {
  const [t] = it(), n = e.config, [i] = z(n.formMode > 1 ? "VIEW" : "ENTRY");
  let r = Me(() => String(t.details.findIndex((l) => l.dataKey === e.component.sourceQuestion))), a = Me(() => {
    let l = [];
    if (e.component.sourceQuestion !== "") {
      const c = t.details.findIndex((o) => o.dataKey === e.component.sourceQuestion);
      if (c !== -1 && t.details[c])
        if (typeof t.details[c].answer == "object" && t.details[c].answer !== null) {
          const o = t.details[c].answer;
          if (l = o == null || o === "" ? [] : o, t.details[c].type === be.LIST_TEXT_REPEAT || t.details[c].type === be.LIST_SELECT_REPEAT) {
            let d = JSON.parse(JSON.stringify(l));
            d.splice(0, 1), l = d;
          }
          l = l.map((d) => {
            var f, w;
            return Xe(Ce({}, d), {
              label: (w = (f = d.label) != null ? f : d.value) != null ? w : ""
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
          l = d;
        }
    }
    return l;
  }), s = (l) => {
    e.onUserClick(e.component.dataKey + "#" + l);
  };
  return (() => {
    var l = nl(), c = l.firstChild, o = c.firstChild;
    return p(o, g(ce, {
      get each() {
        return a();
      },
      children: (d, f) => (() => {
        var w = il(), k = w.firstChild, C = k.nextSibling, m = C.firstChild, u = m.firstChild, x = u.nextSibling;
        return w.$$click = ($) => s(d.value), p(k, g(we, {
          get children() {
            return [g(te, {
              get when() {
                return t.details[r()].type === be.NUMBER || t.details[r()].type === be.VARIABLE && t.details[r()].renderType === 1 || t.details[r()].type === be.TEXT;
              },
              get children() {
                var $ = ui();
                return P(() => $.value = e.component.label + "  ____ # " + d.label), $;
              }
            }), g(te, {
              get when() {
                return t.details[r()].type !== 28;
              },
              get children() {
                var $ = ui();
                return P(() => $.value = d.label), $;
              }
            })];
          }
        })), m.$$click = ($) => s(d.value), p(m, i, x), P(() => U(m, "id", `nestedButton-${e.component.dataKey}-${f()}`)), w;
      })()
    })), P((d) => X(c, {
      "border-b border-gray-300/[.40]": a().length > 0
    }, d)), l;
  })();
};
he(["click"]);
var rl = /* @__PURE__ */ y('<span class="absolute top-0 right-0 inline-flex items-center justify-center h-6 w-6 text-xs font-semibold text-white transform translate-x-1/2 -translate-y-1/4 bg-pink-600/80 rounded-full">'), al = /* @__PURE__ */ y('<button type=button><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z">');
const Re = (e) => {
  const [t, n] = Bn(e, ["comments", "class"]);
  return (() => {
    var i = al();
    return i.firstChild, Hn(i, et({
      get class() {
        var r;
        return ["relative inline-block bg-white dark:bg-gray-800 p-2 h-10 w-10 text-gray-500 rounded-full", "hover:bg-yellow-100 hover:text-yellow-400 hover:border-yellow-100", "border-2 border-gray-300", "disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400", (r = t.class) != null ? r : ""].join(" ");
      }
    }, n), !1, !0), p(i, g(D, {
      get when() {
        return _e(() => !!t.comments)() && t.comments > 0;
      },
      get children() {
        var r = rl();
        return p(r, () => t.comments), r;
      }
    }), null), i;
  })();
};
var ll = /* @__PURE__ */ y("<span class=text-pink-600>*"), sl = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), ol = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), dl = /* @__PURE__ */ y('<div class=" flex justify-end ">'), cl = /* @__PURE__ */ y('<div class="grid md:grid-cols-3 border-b border-gray-300/[.50] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm space-x-2 py-2.5 px-2 md:col-span-2 grid grid-cols-12"><div class><div class=cursor-pointer><div class="grid font-light text-sm col-span-2 content-start">'), ul = /* @__PURE__ */ y('<div class=flex-1><input type=text class="w-full font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400">'), gl = /* @__PURE__ */ y("<div class=flex-1>"), hl = /* @__PURE__ */ y('<div class="font-light text-sm py-2.5 px-4 flex items-start gap-2 cursor-pointer"><label class="cursor-pointer text-sm shrink-0 mt-0.5"><input type=radio class="checked:disabled:bg-gray-500 checked:dark:disabled:bg-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400">'), fl = /* @__PURE__ */ y('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), ml = /* @__PURE__ */ y('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), vl = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="grid grid-cols-12"><div class="col-span-11 text-justify mr-1">');
const bl = (e) => {
  const [t] = it(), n = e.config, [i] = z(n.formMode > 1 ? !0 : e.component.disableInput);
  let r = e.value && e.value.length > 0 ? e.value[0].value : e.value, a = (C, m) => {
    let u = JSON.parse(JSON.stringify(e.value));
    u = [], u.push({
      value: C,
      label: m
    }), e.onValueChange(u);
  }, s = (C) => {
    let m = `radio-${e.component.dataKey}-${C}`;
    document.getElementById(m).click();
  }, l = Me(() => {
    if (e.component.sourceOption !== void 0 && e.component.typeOption === 3) {
      let C = e.component.sourceOption.split("@");
      const m = t.details.findIndex((u) => u.dataKey === C[0]);
      return t.details[m].type, t.details[m].answer;
    }
    return [];
  });
  const [c] = z(e.component.sourceOption !== void 0 ? l() : e.component.options), [o, d] = z(!1), f = () => {
    o() ? d(!1) : d(!0);
  }, [w] = z(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [k] = z(n.formMode > 2 && e.comments == 0);
  return (() => {
    var C = cl(), m = C.firstChild, u = m.firstChild, x = u.firstChild, $ = u.nextSibling, S = m.nextSibling, _ = S.firstChild, L = _.firstChild, V = L.firstChild;
    return p(u, g(D, {
      get when() {
        return e.component.required;
      },
      get children() {
        return ll();
      }
    }), null), p(u, g(D, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var v = sl();
        return v.$$click = f, v;
      }
    }), null), p($, g(D, {
      get when() {
        return o();
      },
      get children() {
        var v = ol();
        return P(() => v.innerHTML = e.component.hint), v;
      }
    })), p(V, g(ce, {
      get each() {
        return c();
      },
      children: (v, h) => (() => {
        var b = hl(), O = b.firstChild, E = O.firstChild;
        return b.$$click = () => s(h()), E.addEventListener("change", (M) => a(M.currentTarget.value, v.label)), p(b, g(we, {
          get children() {
            return [g(te, {
              get when() {
                return _e(() => !!v.open)() && r === v.value;
              },
              get children() {
                var M = ul(), I = M.firstChild;
                return I.addEventListener("change", (A) => a(v.value, A.currentTarget.value)), P((A) => {
                  var R = e.component.dataKey, N = e.component.dataKey, K = i();
                  return R !== A.e && U(I, "name", A.e = R), N !== A.t && U(I, "id", A.t = N), K !== A.a && (I.disabled = A.a = K), A;
                }, {
                  e: void 0,
                  t: void 0,
                  a: void 0
                }), P(() => I.value = e.value && e.value.length > 0 ? e.value[0].label : v.label), M;
              }
            }), g(te, {
              get when() {
                return !v.open || r !== v.value;
              },
              get children() {
                var M = gl();
                return P(() => M.innerHTML = v.label), M;
              }
            })];
          }
        }), null), P((M) => {
          var I = e.component.dataKey + h(), A = e.component.dataKey, R = "radio-" + e.component.dataKey + "-" + h(), N = i();
          return I !== M.e && U(O, "for", M.e = I), A !== M.t && U(E, "name", M.t = A), R !== M.a && U(E, "id", M.a = R), N !== M.o && (E.disabled = M.o = N), M;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0
        }), P(() => E.checked = r === v.value), P(() => E.value = v.value), b;
      })()
    })), p(_, g(D, {
      get when() {
        var v;
        return ((v = e.validationMessage) == null ? void 0 : v.length) > 0;
      },
      get children() {
        return g(ce, {
          get each() {
            return e.validationMessage;
          },
          children: (v) => (() => {
            var h = vl(), b = h.firstChild, O = b.firstChild;
            return p(b, g(we, {
              get children() {
                return [g(te, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return fl();
                  }
                }), g(te, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return ml();
                  }
                })];
              }
            }), O), O.innerHTML = v, P((E) => X(b, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, E)), h;
          })()
        });
      }
    }), null), p(S, g(D, {
      get when() {
        return w();
      },
      get children() {
        var v = dl();
        return p(v, g(Re, {
          get disabled() {
            return k();
          },
          onClick: () => e.openRemark(e.component.dataKey),
          get comments() {
            return e.comments;
          }
        })), v;
      }
    }), null), P((v) => {
      var h = e.component.label, b = {
        "col-span-11 lg:-mr-4": w(),
        "col-span-12": !w()
      }, O = {
        " border-b border-orange-500 pb-3 ": e.classValidation === 1,
        " border-b border-pink-600 pb-3 ": e.classValidation === 2
      }, E = e.component.cols === 1 || e.component.cols === void 0, M = e.component.cols === 2, I = e.component.cols === 3, A = e.component.cols === 4, R = e.component.cols === 5;
      return h !== v.e && (x.innerHTML = v.e = h), v.t = X(_, b, v.t), v.a = X(L, O, v.a), E !== v.o && V.classList.toggle("grid-cols-1", v.o = E), M !== v.i && V.classList.toggle("grid-cols-2", v.i = M), I !== v.n && V.classList.toggle("grid-cols-3", v.n = I), A !== v.s && V.classList.toggle("grid-cols-4", v.s = A), R !== v.h && V.classList.toggle("grid-cols-5", v.h = R), v;
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
he(["click"]);
var wl = /* @__PURE__ */ y("<span class=text-pink-600>*"), xl = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), yl = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), gi = /* @__PURE__ */ y('<input type=text class="w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"placeholder>'), pl = /* @__PURE__ */ y("<div class=shrink-0>"), kl = /* @__PURE__ */ y('<div class="grid md:grid-cols-3 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 md:col-span-2 flex items-start gap-2"><div class=flex-1>'), $l = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), _l = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Sl = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="flex-1 text-justify">');
const Cl = (e) => {
  const t = e.config, [n] = z(t.formMode > 1 && t.initialMode == 2 ? !0 : t.initialMode == 1 && e.component.disableInitial !== void 0 ? e.component.disableInitial : e.component.disableInput), [i, r] = z(!1), a = () => {
    i() ? r(!1) : r(!0);
  }, [s] = z(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [l] = z(t.formMode > 2 && e.comments == 0);
  return (() => {
    var c = kl(), o = c.firstChild, d = o.firstChild, f = d.firstChild, w = d.nextSibling, k = o.nextSibling, C = k.firstChild;
    return p(d, g(D, {
      get when() {
        return e.component.required;
      },
      get children() {
        return wl();
      }
    }), null), p(d, g(D, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var m = xl();
        return m.$$click = a, m;
      }
    }), null), p(w, g(D, {
      get when() {
        return i();
      },
      get children() {
        var m = yl();
        return P(() => m.innerHTML = e.component.hint), m;
      }
    })), p(C, g(D, {
      get when() {
        return e.component.lengthInput === void 0;
      },
      get children() {
        var m = gi();
        return m.addEventListener("change", (u) => {
          e.onValueChange(u.currentTarget.value);
        }), P((u) => {
          var x = e.component.dataKey, $ = {
            " border border-solid border-gray-300 ": e.classValidation === 0,
            " border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
            " border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
          }, S = n();
          return x !== u.e && U(m, "name", u.e = x), u.t = X(m, $, u.t), S !== u.a && (m.disabled = u.a = S), u;
        }, {
          e: void 0,
          t: void 0,
          a: void 0
        }), P(() => m.value = e.value), m;
      }
    }), null), p(C, g(D, {
      get when() {
        return _e(() => e.component.lengthInput !== void 0)() && e.component.lengthInput.length > 0;
      },
      get children() {
        var m = gi();
        return m.addEventListener("change", (u) => {
          e.onValueChange(u.currentTarget.value);
        }), P((u) => {
          var x = e.component.dataKey, $ = {
            " border border-solid border-gray-300 ": e.classValidation === 0,
            " border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
            " border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
          }, S = n(), _ = e.component.lengthInput[0].maxlength !== void 0 ? e.component.lengthInput[0].maxlength : "", L = e.component.lengthInput[0].minlength !== void 0 ? e.component.lengthInput[0].minlength : "";
          return x !== u.e && U(m, "name", u.e = x), u.t = X(m, $, u.t), S !== u.a && (m.disabled = u.a = S), _ !== u.o && U(m, "maxlength", u.o = _), L !== u.i && U(m, "minlength", u.i = L), u;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0,
          i: void 0
        }), P(() => m.value = e.value), m;
      }
    }), null), p(C, g(D, {
      get when() {
        var m;
        return ((m = e.validationMessage) == null ? void 0 : m.length) > 0;
      },
      get children() {
        return g(ce, {
          get each() {
            return e.validationMessage;
          },
          children: (m) => (() => {
            var u = Sl(), x = u.firstChild, $ = x.firstChild;
            return p(x, g(we, {
              get children() {
                return [g(te, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return $l();
                  }
                }), g(te, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return _l();
                  }
                })];
              }
            }), $), $.innerHTML = m, P((S) => X(x, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, S)), u;
          })()
        });
      }
    }), null), p(k, g(D, {
      get when() {
        return s();
      },
      get children() {
        var m = pl();
        return p(m, g(Re, {
          get disabled() {
            return l();
          },
          onClick: () => e.openRemark(e.component.dataKey),
          get comments() {
            return e.comments;
          }
        })), m;
      }
    }), null), P(() => f.innerHTML = e.component.label), c;
  })();
};
he(["click"]);
const Ml = (e) => {
  const t = et({
    multiple: !1,
    disabled: !1,
    optionToValue: (j) => j,
    isOptionDisabled: (j) => !1
  }, e), n = (j) => {
    if (t.multiple && Array.isArray(j))
      return j;
    if (!t.multiple && !Array.isArray(j))
      return j !== null ? [j] : [];
    throw new Error(`Incompatible value type for ${t.multiple ? "multple" : "single"} select.`);
  }, [i, r] = z(t.initialValue ? n(t.initialValue) : []), a = () => t.multiple ? i() : i()[0] || null, s = (j) => r(n(j)), l = () => r([]), c = () => !!(t.multiple ? a().length : a());
  $e(yt(i, () => {
    var j;
    return (j = t.onChange) == null ? void 0 : j.call(t, a());
  }, {
    defer: !0
  }));
  const [o, d] = z(""), f = () => d("");
  $e(yt(o, (j) => {
    var F;
    return (F = t.onInput) == null ? void 0 : F.call(t, j);
  }, {
    defer: !0
  })), $e(yt(o, (j) => {
    j && !S() && L();
  }, {
    defer: !0
  }));
  const w = typeof t.options == "function" ? Me(() => t.options(o()), t.options(o())) : () => t.options, k = () => w().length, C = (j) => {
    if (t.isOptionDisabled(j)) return;
    const F = t.optionToValue(j);
    t.multiple ? s([...i(), F]) : (s(F), $()), V();
  }, [m, u] = z(!1), x = () => u(!1), $ = () => u(!0), [S, _] = z(!1), L = () => _(!0), V = () => _(!1), v = () => _(!S()), h = () => t.disabled, [b, O] = z(-1), E = () => w()[b()], M = (j) => j === E(), I = (j) => {
    k() || O(-1);
    const F = k() - 1, J = j === "next" ? 1 : -1;
    let B = b() + J;
    B > F && (B = 0), B < 0 && (B = F), O(B);
  }, A = () => I("previous"), R = () => I("next");
  $e(yt(w, (j) => {
    S() && O(Math.min(0, j.length - 1));
  }, {
    defer: !0
  })), $e(yt(h, (j) => {
    j && S() && V();
  })), $e(yt(S, (j) => {
    j ? (b() === -1 && R(), x()) : (b() > -1 && O(-1), f());
  }, {
    defer: !0
  })), $e(yt(b, (j) => {
    j > -1 && !S() && L();
  }, {
    defer: !0
  }));
  const N = {
    containerRef: null,
    inputRef: null,
    listRef: null
  }, K = (j) => {
    N.containerRef = j, j.getAttribute("tabIndex") || (j.tabIndex = -1), j.addEventListener("focusin", () => {
      x();
    }), j.addEventListener("focusout", (F) => {
      const J = F.relatedTarget;
      for (const B of Object.values(N))
        if (B != null && B.contains(J)) {
          F.preventDefault(), F.stopPropagation();
          return;
        }
      V();
    }), j.addEventListener("pointerdown", (F) => {
      N.inputRef && F.target !== N.inputRef && F.preventDefault();
    }), j.addEventListener("click", (F) => {
      (!N.listRef || !N.listRef.contains(F.target)) && (N.inputRef && N.inputRef.focus(), v());
    });
  }, H = (j) => {
    N.inputRef = j, j.getAttribute("tabIndex") || (j.tabIndex = -1), P(() => j.value = o()), j.addEventListener("input", (F) => {
      d(F.target.value);
    }), P(() => {
      j.style.setProperty("opacity", m() ? "0" : "1");
    }), j.addEventListener("focus", (F) => {
      t.onFocus && t.onFocus(F);
    }), j.addEventListener("blur", (F) => {
      t.onBlur && t.onBlur(F);
    }), j.addEventListener("keydown", (F) => {
      switch (F.key) {
        case "ArrowDown":
          R();
          break;
        case "ArrowUp":
          A();
          break;
        case "Enter":
          if (S() && E()) {
            C(E());
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
            const J = a();
            s([...J.slice(0, -1)]);
          } else
            l();
          break;
        case " ":
          if (o())
            return;
          S() ? E() && C(E()) : L();
          break;
        case "Tab":
          if (E() && S()) {
            C(E());
            break;
          }
          return;
        default:
          return;
      }
      F.preventDefault(), F.stopPropagation();
    });
  }, T = (j) => {
    N.listRef = j, j.getAttribute("tabIndex") || (j.tabIndex = -1), j.addEventListener("pointerdown", (F) => {
      F.preventDefault(), F.stopPropagation();
    });
  };
  return {
    get value() {
      return a();
    },
    get hasValue() {
      return c();
    },
    setValue: s,
    get options() {
      return w();
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
    containerRef: K,
    inputRef: H,
    listRef: T
  };
};
var Il = /* @__PURE__ */ y("<mark>");
const Ct = {
  NO_MATCH: 0,
  MATCH: 1,
  WORD_START: 2,
  START: 3
}, El = (e, t) => {
  let n = Ct.NO_MATCH, i = [];
  if (e.length <= t.length) {
    const r = Array.from(e.toLocaleLowerCase()), a = Array.from(t.toLocaleLowerCase());
    let s = Ct.START;
    e: for (let l = 0, c = 0; l < r.length; l++) {
      for (; c < a.length; )
        if (a[c] === r[l]) {
          i[c] = !0, s === Ct.MATCH && a[c - 1] === " " && a[c] !== " " && (s = Ct.WORD_START), n += s, s++, c++;
          continue e;
        } else
          s = Ct.MATCH, c++;
      n = Ct.NO_MATCH, i.length = 0;
    }
  }
  return {
    target: t,
    score: n,
    matches: i
  };
}, Ll = (e, t = (n) => (() => {
  var i = Il();
  return p(i, n), i;
})()) => {
  const n = e.target, i = e.matches, r = "\0", a = [];
  let s = !1;
  for (let l = 0; l < n.length; l++) {
    const c = n[l], o = i[l];
    !s && o ? (a.push(r), s = !0) : s && !o && (a.push(r), s = !1), a.push(c);
  }
  return s && (a.push(r), s = !1), _e(() => a.join("").split(r).map((l, c) => c % 2 ? t(l) : l));
}, Ol = (e, t, n) => {
  const i = [];
  for (let r = 0; r < t.length; r++) {
    const a = t[r], s = a[n], l = El(e, s);
    l.score && i.push(Xe(Ce({}, l), {
      item: a,
      index: r
    }));
  }
  return i.sort((r, a) => {
    let s = a.score - r.score;
    return s === 0 && (s = r.index - a.index), s;
  }), i;
};
var Al = /* @__PURE__ */ y("<mark>");
const Ot = (e, t) => {
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
      if (n.filterable && c && (d = Ol(c, d, "label").map((f) => Xe(Ce({}, f.item), {
        label: Ll(f)
      }))), n.createable !== void 0) {
        const f = c.trim(), w = d.some((k) => Rl(c, i(k.value)));
        if (f && !w) {
          let k;
          typeof n.createable == "function" ? k = n.createable(f) : k = n.key ? {
            [n.key]: f
          } : f;
          const C = {
            label: ["Create ", (() => {
              var m = Al();
              return p(m, () => i(k)), m;
            })()],
            value: k,
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
}, Rl = (e, t) => e.localeCompare(t, void 0, {
  sensitivity: "base"
}) === 0;
var Nl = /* @__PURE__ */ y("<div>"), Vl = /* @__PURE__ */ y("<div class=solid-select-control>"), Tl = /* @__PURE__ */ y("<div class=solid-select-placeholder>"), Pl = /* @__PURE__ */ y("<div class=solid-select-single-value>"), Dl = /* @__PURE__ */ y("<div class=solid-select-multi-value><button type=button class=solid-select-multi-value-remove>⨯"), jl = /* @__PURE__ */ y("<input class=solid-select-input type=text tabindex=0 autocomplete=off autocapitalize=none size=1>"), Kl = /* @__PURE__ */ y("<div class=solid-select-list>"), zl = /* @__PURE__ */ y("<div class=solid-select-option>");
const At = (e) => {
  const [t, n] = Bn(et({
    format: (r, a) => r,
    placeholder: "Select...",
    readonly: typeof e.options != "function"
  }, e), ["options", "optionToValue", "isOptionDisabled", "initialValue", "multiple", "disabled", "onInput", "onChange", "onBlur"]), i = Ml(t);
  return g(Fl, {
    get class() {
      return n.class;
    },
    ref(r) {
      var a = i.containerRef;
      typeof a == "function" ? a(r) : i.containerRef = r;
    },
    get disabled() {
      return i.disabled;
    },
    get children() {
      return [g(Bl, {
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
      }), g(ql, {
        ref(r) {
          var a = i.listRef;
          typeof a == "function" ? a(r) : i.listRef = r;
        },
        get isOpen() {
          return i.isOpen;
        },
        get options() {
          return i.options;
        },
        children: (r) => g(Gl, {
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
}, Fl = (e) => (() => {
  var t = Nl(), n = e.ref;
  return typeof n == "function" ? nt(n, t) : e.ref = t, p(t, () => e.children), P((i) => {
    var r = `solid-select-container ${e.class !== void 0 ? e.class : ""}`, a = e.disabled;
    return r !== i.e && st(t, i.e = r), a !== i.t && U(t, "data-disabled", i.t = a), i;
  }, {
    e: void 0,
    t: void 0
  }), t;
})(), Bl = (e) => {
  const t = (n) => {
    const i = e.value;
    e.setValue([...i.slice(0, n), ...i.slice(n + 1)]);
  };
  return (() => {
    var n = Vl();
    return p(n, g(D, {
      get when() {
        return _e(() => !e.hasValue)() && !e.inputValue;
      },
      get children() {
        return g(Hl, {
          get children() {
            return e.placeholder;
          }
        });
      }
    }), null), p(n, g(D, {
      get when() {
        return _e(() => !!(e.hasValue && !e.multiple))() && !e.inputValue;
      },
      get children() {
        return g(Ul, {
          get children() {
            return e.format(e.value, "value");
          }
        });
      }
    }), null), p(n, g(D, {
      get when() {
        return _e(() => !!e.hasValue)() && e.multiple;
      },
      get children() {
        return g(ce, {
          get each() {
            return e.value;
          },
          children: (i, r) => g(Jl, {
            onRemove: () => t(r()),
            get children() {
              return e.format(i, "value");
            }
          })
        });
      }
    }), null), p(n, g(Wl, {
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
    }), null), P((i) => {
      var r = e.multiple, a = e.hasValue, s = e.disabled;
      return r !== i.e && U(n, "data-multiple", i.e = r), a !== i.t && U(n, "data-has-value", i.t = a), s !== i.a && U(n, "data-disabled", i.a = s), i;
    }, {
      e: void 0,
      t: void 0,
      a: void 0
    }), n;
  })();
}, Hl = (e) => (() => {
  var t = Tl();
  return p(t, () => e.children), t;
})(), Ul = (e) => (() => {
  var t = Pl();
  return p(t, () => e.children), t;
})(), Jl = (e) => (() => {
  var t = Dl(), n = t.firstChild;
  return p(t, () => e.children, n), Te(n, "click", (i) => {
    i.stopPropagation(), e.onRemove();
  }), t;
})(), Wl = (e) => (() => {
  var t = jl();
  t.$$keydown = (i) => {
    i.key === "Escape" && (i.preventDefault(), i.stopPropagation(), i.target.blur());
  };
  var n = e.ref;
  return typeof n == "function" ? nt(n, t) : e.ref = t, P((i) => {
    var r = e.id, a = e.name, s = e.autofocus, l = e.readonly, c = e.disabled;
    return r !== i.e && U(t, "id", i.e = r), a !== i.t && U(t, "name", i.t = a), s !== i.a && (t.autofocus = i.a = s), l !== i.o && (t.readOnly = i.o = l), c !== i.i && (t.disabled = i.i = c), i;
  }, {
    e: void 0,
    t: void 0,
    a: void 0,
    o: void 0,
    i: void 0
  }), t;
})(), ql = (e) => g(D, {
  get when() {
    return e.isOpen;
  },
  get children() {
    var t = Kl(), n = e.ref;
    return typeof n == "function" ? nt(n, t) : e.ref = t, p(t, g(ce, {
      get each() {
        return e.options;
      },
      fallback: "No options",
      get children() {
        return e.children;
      }
    })), t;
  }
}), Gl = (e) => (() => {
  var t = zl();
  return Te(t, "click", e.pickOption, !0), p(t, () => e.children), P((n) => {
    var i = e.isDisabled, r = e.isFocused;
    return i !== n.e && U(t, "data-disabled", n.e = i), r !== n.t && U(t, "data-focused", n.t = r), n;
  }, {
    e: void 0,
    t: void 0
  }), t;
})();
he(["keydown", "click"]);
function Nt(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var rn = { exports: {} };
var Yl = rn.exports, hi;
function Ql() {
  return hi || (hi = 1, (function(e) {
    (function(t, n) {
      e.exports ? e.exports = n() : t.Toastify = n();
    })(Yl, function(t) {
      var n = function(s) {
        return new n.lib.init(s);
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
        init: function(s) {
          return s || (s = {}), this.options = {}, this.toastElement = null, this.options.text = s.text || n.defaults.text, this.options.node = s.node || n.defaults.node, this.options.duration = s.duration === 0 ? 0 : s.duration || n.defaults.duration, this.options.selector = s.selector || n.defaults.selector, this.options.callback = s.callback || n.defaults.callback, this.options.destination = s.destination || n.defaults.destination, this.options.newWindow = s.newWindow || n.defaults.newWindow, this.options.close = s.close || n.defaults.close, this.options.gravity = s.gravity === "bottom" ? "toastify-bottom" : n.defaults.gravity, this.options.positionLeft = s.positionLeft || n.defaults.positionLeft, this.options.position = s.position || n.defaults.position, this.options.backgroundColor = s.backgroundColor || n.defaults.backgroundColor, this.options.avatar = s.avatar || n.defaults.avatar, this.options.className = s.className || n.defaults.className, this.options.stopOnFocus = s.stopOnFocus === void 0 ? n.defaults.stopOnFocus : s.stopOnFocus, this.options.onClick = s.onClick || n.defaults.onClick, this.options.offset = s.offset || n.defaults.offset, this.options.escapeMarkup = s.escapeMarkup !== void 0 ? s.escapeMarkup : n.defaults.escapeMarkup, this.options.ariaLive = s.ariaLive || n.defaults.ariaLive, this.options.style = s.style || n.defaults.style, s.backgroundColor && (this.options.style.background = s.backgroundColor), this;
        },
        // Building the DOM element
        buildToast: function() {
          if (!this.options)
            throw "Toastify is not initialized";
          var s = document.createElement("div");
          s.className = "toastify on " + this.options.className, this.options.position ? s.className += " toastify-" + this.options.position : this.options.positionLeft === !0 ? s.className += " toastify-left" : s.className += " toastify-right", s.className += " " + this.options.gravity, this.options.backgroundColor;
          for (var l in this.options.style)
            s.style[l] = this.options.style[l];
          if (this.options.ariaLive && s.setAttribute("aria-live", this.options.ariaLive), this.options.node && this.options.node.nodeType === Node.ELEMENT_NODE)
            s.appendChild(this.options.node);
          else if (this.options.escapeMarkup ? s.innerText = this.options.text : s.innerHTML = this.options.text, this.options.avatar !== "") {
            var c = document.createElement("img");
            c.src = this.options.avatar, c.className = "toastify-avatar", this.options.position == "left" || this.options.positionLeft === !0 ? s.appendChild(c) : s.insertAdjacentElement("afterbegin", c);
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
            (this.options.position == "left" || this.options.positionLeft === !0) && d > 360 ? s.insertAdjacentElement("afterbegin", o) : s.appendChild(o);
          }
          if (this.options.stopOnFocus && this.options.duration > 0) {
            var f = this;
            s.addEventListener(
              "mouseover",
              function(u) {
                window.clearTimeout(s.timeOutValue);
              }
            ), s.addEventListener(
              "mouseleave",
              function() {
                s.timeOutValue = window.setTimeout(
                  function() {
                    f.removeElement(s);
                  },
                  f.options.duration
                );
              }
            );
          }
          if (typeof this.options.destination != "undefined" && s.addEventListener(
            "click",
            function(u) {
              u.stopPropagation(), this.options.newWindow === !0 ? window.open(this.options.destination, "_blank") : window.location = this.options.destination;
            }.bind(this)
          ), typeof this.options.onClick == "function" && typeof this.options.destination == "undefined" && s.addEventListener(
            "click",
            function(u) {
              u.stopPropagation(), this.options.onClick();
            }.bind(this)
          ), typeof this.options.offset == "object") {
            var w = r("x", this.options), k = r("y", this.options), C = this.options.position == "left" ? w : "-" + w, m = this.options.gravity == "toastify-top" ? k : "-" + k;
            s.style.transform = "translate(" + C + "," + m + ")";
          }
          return s;
        },
        // Displaying the toast
        showToast: function() {
          this.toastElement = this.buildToast();
          var s;
          if (typeof this.options.selector == "string" ? s = document.getElementById(this.options.selector) : this.options.selector instanceof HTMLElement || typeof ShadowRoot != "undefined" && this.options.selector instanceof ShadowRoot ? s = this.options.selector : s = document.body, !s)
            throw "Root element is not defined";
          var l = n.defaults.oldestFirst ? s.firstChild : s.lastChild;
          return s.insertBefore(this.toastElement, l), n.reposition(), this.options.duration > 0 && (this.toastElement.timeOutValue = window.setTimeout(
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
        removeElement: function(s) {
          s.className = s.className.replace(" on", ""), window.setTimeout(
            function() {
              this.options.node && this.options.node.parentNode && this.options.node.parentNode.removeChild(this.options.node), s.parentNode && s.parentNode.removeChild(s), this.options.callback.call(s), n.reposition();
            }.bind(this),
            400
          );
        }
      }, n.reposition = function() {
        for (var s = {
          top: 15,
          bottom: 15
        }, l = {
          top: 15,
          bottom: 15
        }, c = {
          top: 15,
          bottom: 15
        }, o = document.getElementsByClassName("toastify"), d, f = 0; f < o.length; f++) {
          a(o[f], "toastify-top") === !0 ? d = "toastify-top" : d = "toastify-bottom";
          var w = o[f].offsetHeight;
          d = d.substr(9, d.length - 1);
          var k = 15, C = window.innerWidth > 0 ? window.innerWidth : screen.width;
          C <= 360 ? (o[f].style[d] = c[d] + "px", c[d] += w + k) : a(o[f], "toastify-left") === !0 ? (o[f].style[d] = s[d] + "px", s[d] += w + k) : (o[f].style[d] = l[d] + "px", l[d] += w + k);
        }
        return this;
      };
      function r(s, l) {
        return l.offset[s] ? isNaN(l.offset[s]) ? l.offset[s] : l.offset[s] + "px" : "0px";
      }
      function a(s, l) {
        return !s || typeof l != "string" ? !1 : !!(s.className && s.className.trim().split(/\s+/gi).indexOf(l) > -1);
      }
      return n.lib.init.prototype = n.lib, n;
    });
  })(rn)), rn.exports;
}
var Zl = Ql();
const Xl = /* @__PURE__ */ Nt(Zl), $n = {
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
    gravity: "top",
    position: "right",
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
function _n(e) {
  const {
    message: t,
    duration: n = 3e3,
    className: i = "bg-blue-600/80",
    text: r = "",
    position: a = "right",
    gravity: s = "bottom",
    closeOnClick: l = !0,
    style: c
  } = e;
  Xl({
    text: t + r,
    duration: n,
    gravity: s,
    position: a,
    close: l,
    className: i,
    style: Ce({}, c)
  }).showToast();
}
function Ke(e, t = 3e3, n = "", i = "bg-blue-600/80") {
  _n(Ce({
    message: e,
    duration: t,
    text: n,
    className: i
  }, $n.info));
}
function tt(e, t = 3e3) {
  _n(Ce({
    message: e,
    duration: t
  }, $n.success));
}
function es(e, t = 4e3) {
  _n(Ce({
    message: e,
    duration: t
  }, $n.warning));
}
function me(e, t = 5e3) {
  _n(Ce({
    message: e,
    duration: t
  }, $n.error));
}
const se = {
  log: (e, t, ...n) => {
  },
  warn: (e, t, ...n) => {
  },
  error: (e, t, ...n) => {
  }
};
class ts {
  constructor(t) {
    Ie(this, "stores");
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
    var s;
    const [n] = this.stores.referenceMap, r = n()[t];
    if (r !== void 0) {
      const [l] = this.stores.reference;
      if (l.details[r] && l.details[r].dataKey === t)
        return r;
    }
    return this.rebuildIndexMap(), (s = n()[t]) != null ? s : -1;
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
    const i = n.split(Ue.NESTED_SEPARATOR), r = [];
    for (let s = 1; s < i.length; s++) {
      const l = i[s].match(/@(\d+)/);
      l && r.push(parseInt(l[1], 10));
    }
    let a = t;
    return a.includes("@$ROW$") && r.length > 0 && (a = a.replace("@$ROW$", `@${r[r.length - 1]}`)), a.includes("@$ROW1$") && r.length > 1 && (a = a.replace("@$ROW1$", `@${r[r.length - 2]}`)), a.includes("@$ROW2$") && r.length > 2 && (a = a.replace("@$ROW2$", `@${r[r.length - 3]}`)), a;
  }
  /**
   * Extract row index from a nested dataKey.
   *
   * @param dataKey - The nested dataKey
   * @param level - Which level of nesting (0 = current, 1 = parent, etc.)
   * @returns The row index at that level, or 0 if not found
   */
  getRowIndex(t, n = 0) {
    const i = t.split(Ue.NESTED_SEPARATOR), r = [];
    for (let s = 1; s < i.length; s++) {
      const l = i[s].match(/@(\d+)/);
      l && r.push(parseInt(l[1], 10));
    }
    const a = r.length - 1 - n;
    return a >= 0 ? r[a] : 0;
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
      const a = t.details[r];
      a && a.dataKey && (i[a.dataKey] = r);
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
    const [, n] = this.stores.compEnableMap, [, i] = this.stores.compValidMap, [, r] = this.stores.compVarMap, [, a] = this.stores.compSourceOptionMap, [, s] = this.stores.compSourceQuestionMap, l = {}, c = {}, o = {}, d = {}, f = {};
    for (const w of t) {
      if (w.componentEnable)
        for (const k of w.componentEnable) {
          const C = this.getBaseDataKey(k);
          l[C] || (l[C] = []), l[C].includes(w.dataKey) || l[C].push(w.dataKey);
        }
      if (w.componentValidation)
        for (const k of w.componentValidation) {
          const C = this.getBaseDataKey(k);
          c[C] || (c[C] = []), c[C].includes(w.dataKey) || c[C].push(w.dataKey);
        }
      if (w.componentVar && w.type === be.VARIABLE)
        for (const k of w.componentVar)
          o[k] || (o[k] = []), o[k].includes(w.dataKey) || o[k].push(w.dataKey);
      if (w.sourceOption) {
        const k = this.getBaseDataKey(w.sourceOption);
        d[k] || (d[k] = []), d[k].includes(w.dataKey) || d[k].push(w.dataKey);
      }
      w.sourceQuestion && w.type === be.NESTED && (f[w.sourceQuestion] || (f[w.sourceQuestion] = []), f[w.sourceQuestion].includes(w.dataKey) || f[w.sourceQuestion].push(w.dataKey));
    }
    n(l), i(c), r(o), a(d), s(f);
  }
  /**
   * Get base dataKey without row markers.
   *
   * @param dataKey - The dataKey possibly with @$ROW$ markers
   * @returns The base dataKey
   */
  getBaseDataKey(t) {
    return t.split("@")[0].split(Ue.NESTED_SEPARATOR)[0];
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
    return se.log("ReferenceService", "getVariableDependents:", {
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
    return se.log("ReferenceService", "getNestedDependents:", {
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
    const [, a] = this.stores.reference;
    a("details", r, n, i);
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
    for (const [a, s] of Object.entries(n))
      r("details", i, a, s);
  }
  /**
   * Register newly created components in dependency maps.
   * Called when nested components are dynamically created.
   *
   * @param components - The newly created components to register
   */
  registerDynamicComponents(t) {
    se.log("ReferenceService", "registerDynamicComponents called with", t.length, "components");
    const [n, i] = this.stores.compEnableMap, [r, a] = this.stores.compValidMap, [s, l] = this.stores.compVarMap, [c, o] = this.stores.compSourceOptionMap, [d, f] = this.stores.compSourceQuestionMap, w = Ce({}, n()), k = Ce({}, r()), C = Ce({}, s()), m = Ce({}, c()), u = Ce({}, d());
    for (const x of t) {
      if (x.componentEnable)
        for (const $ of x.componentEnable) {
          const S = this.getBaseDataKey($);
          w[S] || (w[S] = []), w[S].includes(x.dataKey) || w[S].push(x.dataKey);
        }
      if (x.componentValidation)
        for (const $ of x.componentValidation) {
          const S = this.getBaseDataKey($);
          k[S] || (k[S] = []), k[S].includes(x.dataKey) || k[S].push(x.dataKey);
        }
      if (x.componentVar && x.type === be.VARIABLE) {
        se.log("ReferenceService", "Registering variable component:", {
          dataKey: x.dataKey,
          componentVar: x.componentVar,
          type: x.type
        });
        for (const $ of x.componentVar)
          se.log("ReferenceService", "Adding varMap entry:", $, "->", x.dataKey), C[$] || (C[$] = []), C[$].includes(x.dataKey) || C[$].push(x.dataKey);
      }
      if (x.sourceOption) {
        const $ = this.getBaseDataKey(x.sourceOption);
        m[$] || (m[$] = []), m[$].includes(x.dataKey) || m[$].push(x.dataKey);
      }
      x.sourceQuestion && x.type === be.NESTED && (se.log("ReferenceService", "Registering nested dependency:", {
        sourceQuestion: x.sourceQuestion,
        dataKey: x.dataKey
      }), u[x.sourceQuestion] || (u[x.sourceQuestion] = []), u[x.sourceQuestion].includes(x.dataKey) || u[x.sourceQuestion].push(x.dataKey));
    }
    i(w), a(k), l(C), o(m), f(u);
  }
}
const fi = {
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
class ns {
  constructor(t, n, i) {
    Ie(this, "stores");
    Ie(this, "referenceService");
    Ie(this, "config");
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
  evaluateEnableCondition(t, n, i = tl.ENABLE_CONDITION) {
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
      return "";
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
    const { defaultValue: r, logErrors: a = !0, silent: s = !1 } = i;
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
    } catch (l) {
      const c = l instanceof Error ? l.message : String(l);
      return {
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
      ...Object.keys(fi)
    ], r = [
      n.getValue,
      n.getRowIndex,
      n.getProp,
      n.answer,
      n.getRowIndex(0),
      // rowIndex shorthand
      ...Object.values(fi)
    ], a = `
      'use strict';
      return (${t});
    `;
    try {
      const s = new Function(...i, a);
      return () => s(...r);
    } catch (s) {
      throw new Error(
        `Syntax error in expression "${t}": ${s instanceof Error ? s.message : String(s)}`
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
var an = { exports: {} }, is = an.exports, mi;
function rs() {
  return mi || (mi = 1, (function(e, t) {
    (function(n, i) {
      e.exports = i();
    })(is, (function() {
      var n = 1e3, i = 6e4, r = 36e5, a = "millisecond", s = "second", l = "minute", c = "hour", o = "day", d = "week", f = "month", w = "quarter", k = "year", C = "date", m = "Invalid Date", u = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, x = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, $ = { name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), ordinal: function(A) {
        var R = ["th", "st", "nd", "rd"], N = A % 100;
        return "[" + A + (R[(N - 20) % 10] || R[N] || R[0]) + "]";
      } }, S = function(A, R, N) {
        var K = String(A);
        return !K || K.length >= R ? A : "" + Array(R + 1 - K.length).join(N) + A;
      }, _ = { s: S, z: function(A) {
        var R = -A.utcOffset(), N = Math.abs(R), K = Math.floor(N / 60), H = N % 60;
        return (R <= 0 ? "+" : "-") + S(K, 2, "0") + ":" + S(H, 2, "0");
      }, m: function A(R, N) {
        if (R.date() < N.date()) return -A(N, R);
        var K = 12 * (N.year() - R.year()) + (N.month() - R.month()), H = R.clone().add(K, f), T = N - H < 0, j = R.clone().add(K + (T ? -1 : 1), f);
        return +(-(K + (N - H) / (T ? H - j : j - H)) || 0);
      }, a: function(A) {
        return A < 0 ? Math.ceil(A) || 0 : Math.floor(A);
      }, p: function(A) {
        return { M: f, y: k, w: d, d: o, D: C, h: c, m: l, s, ms: a, Q: w }[A] || String(A || "").toLowerCase().replace(/s$/, "");
      }, u: function(A) {
        return A === void 0;
      } }, L = "en", V = {};
      V[L] = $;
      var v = "$isDayjsObject", h = function(A) {
        return A instanceof M || !(!A || !A[v]);
      }, b = function A(R, N, K) {
        var H;
        if (!R) return L;
        if (typeof R == "string") {
          var T = R.toLowerCase();
          V[T] && (H = T), N && (V[T] = N, H = T);
          var j = R.split("-");
          if (!H && j.length > 1) return A(j[0]);
        } else {
          var F = R.name;
          V[F] = R, H = F;
        }
        return !K && H && (L = H), H || !K && L;
      }, O = function(A, R) {
        if (h(A)) return A.clone();
        var N = typeof R == "object" ? R : {};
        return N.date = A, N.args = arguments, new M(N);
      }, E = _;
      E.l = b, E.i = h, E.w = function(A, R) {
        return O(A, { locale: R.$L, utc: R.$u, x: R.$x, $offset: R.$offset });
      };
      var M = (function() {
        function A(N) {
          this.$L = b(N.locale, null, !0), this.parse(N), this.$x = this.$x || N.x || {}, this[v] = !0;
        }
        var R = A.prototype;
        return R.parse = function(N) {
          this.$d = (function(K) {
            var H = K.date, T = K.utc;
            if (H === null) return /* @__PURE__ */ new Date(NaN);
            if (E.u(H)) return /* @__PURE__ */ new Date();
            if (H instanceof Date) return new Date(H);
            if (typeof H == "string" && !/Z$/i.test(H)) {
              var j = H.match(u);
              if (j) {
                var F = j[2] - 1 || 0, J = (j[7] || "0").substring(0, 3);
                return T ? new Date(Date.UTC(j[1], F, j[3] || 1, j[4] || 0, j[5] || 0, j[6] || 0, J)) : new Date(j[1], F, j[3] || 1, j[4] || 0, j[5] || 0, j[6] || 0, J);
              }
            }
            return new Date(H);
          })(N), this.init();
        }, R.init = function() {
          var N = this.$d;
          this.$y = N.getFullYear(), this.$M = N.getMonth(), this.$D = N.getDate(), this.$W = N.getDay(), this.$H = N.getHours(), this.$m = N.getMinutes(), this.$s = N.getSeconds(), this.$ms = N.getMilliseconds();
        }, R.$utils = function() {
          return E;
        }, R.isValid = function() {
          return this.$d.toString() !== m;
        }, R.isSame = function(N, K) {
          var H = O(N);
          return this.startOf(K) <= H && H <= this.endOf(K);
        }, R.isAfter = function(N, K) {
          return O(N) < this.startOf(K);
        }, R.isBefore = function(N, K) {
          return this.endOf(K) < O(N);
        }, R.$g = function(N, K, H) {
          return E.u(N) ? this[K] : this.set(H, N);
        }, R.unix = function() {
          return Math.floor(this.valueOf() / 1e3);
        }, R.valueOf = function() {
          return this.$d.getTime();
        }, R.startOf = function(N, K) {
          var H = this, T = !!E.u(K) || K, j = E.p(N), F = function(Y, W) {
            var q = E.w(H.$u ? Date.UTC(H.$y, W, Y) : new Date(H.$y, W, Y), H);
            return T ? q : q.endOf(o);
          }, J = function(Y, W) {
            return E.w(H.toDate()[Y].apply(H.toDate("s"), (T ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(W)), H);
          }, B = this.$W, Z = this.$M, G = this.$D, ne = "set" + (this.$u ? "UTC" : "");
          switch (j) {
            case k:
              return T ? F(1, 0) : F(31, 11);
            case f:
              return T ? F(1, Z) : F(0, Z + 1);
            case d:
              var ae = this.$locale().weekStart || 0, Q = (B < ae ? B + 7 : B) - ae;
              return F(T ? G - Q : G + (6 - Q), Z);
            case o:
            case C:
              return J(ne + "Hours", 0);
            case c:
              return J(ne + "Minutes", 1);
            case l:
              return J(ne + "Seconds", 2);
            case s:
              return J(ne + "Milliseconds", 3);
            default:
              return this.clone();
          }
        }, R.endOf = function(N) {
          return this.startOf(N, !1);
        }, R.$set = function(N, K) {
          var H, T = E.p(N), j = "set" + (this.$u ? "UTC" : ""), F = (H = {}, H[o] = j + "Date", H[C] = j + "Date", H[f] = j + "Month", H[k] = j + "FullYear", H[c] = j + "Hours", H[l] = j + "Minutes", H[s] = j + "Seconds", H[a] = j + "Milliseconds", H)[T], J = T === o ? this.$D + (K - this.$W) : K;
          if (T === f || T === k) {
            var B = this.clone().set(C, 1);
            B.$d[F](J), B.init(), this.$d = B.set(C, Math.min(this.$D, B.daysInMonth())).$d;
          } else F && this.$d[F](J);
          return this.init(), this;
        }, R.set = function(N, K) {
          return this.clone().$set(N, K);
        }, R.get = function(N) {
          return this[E.p(N)]();
        }, R.add = function(N, K) {
          var H, T = this;
          N = Number(N);
          var j = E.p(K), F = function(Z) {
            var G = O(T);
            return E.w(G.date(G.date() + Math.round(Z * N)), T);
          };
          if (j === f) return this.set(f, this.$M + N);
          if (j === k) return this.set(k, this.$y + N);
          if (j === o) return F(1);
          if (j === d) return F(7);
          var J = (H = {}, H[l] = i, H[c] = r, H[s] = n, H)[j] || 1, B = this.$d.getTime() + N * J;
          return E.w(B, this);
        }, R.subtract = function(N, K) {
          return this.add(-1 * N, K);
        }, R.format = function(N) {
          var K = this, H = this.$locale();
          if (!this.isValid()) return H.invalidDate || m;
          var T = N || "YYYY-MM-DDTHH:mm:ssZ", j = E.z(this), F = this.$H, J = this.$m, B = this.$M, Z = H.weekdays, G = H.months, ne = H.meridiem, ae = function(W, q, le, re) {
            return W && (W[q] || W(K, T)) || le[q].slice(0, re);
          }, Q = function(W) {
            return E.s(F % 12 || 12, W, "0");
          }, Y = ne || function(W, q, le) {
            var re = W < 12 ? "AM" : "PM";
            return le ? re.toLowerCase() : re;
          };
          return T.replace(x, (function(W, q) {
            return q || (function(le) {
              switch (le) {
                case "YY":
                  return String(K.$y).slice(-2);
                case "YYYY":
                  return E.s(K.$y, 4, "0");
                case "M":
                  return B + 1;
                case "MM":
                  return E.s(B + 1, 2, "0");
                case "MMM":
                  return ae(H.monthsShort, B, G, 3);
                case "MMMM":
                  return ae(G, B);
                case "D":
                  return K.$D;
                case "DD":
                  return E.s(K.$D, 2, "0");
                case "d":
                  return String(K.$W);
                case "dd":
                  return ae(H.weekdaysMin, K.$W, Z, 2);
                case "ddd":
                  return ae(H.weekdaysShort, K.$W, Z, 3);
                case "dddd":
                  return Z[K.$W];
                case "H":
                  return String(F);
                case "HH":
                  return E.s(F, 2, "0");
                case "h":
                  return Q(1);
                case "hh":
                  return Q(2);
                case "a":
                  return Y(F, J, !0);
                case "A":
                  return Y(F, J, !1);
                case "m":
                  return String(J);
                case "mm":
                  return E.s(J, 2, "0");
                case "s":
                  return String(K.$s);
                case "ss":
                  return E.s(K.$s, 2, "0");
                case "SSS":
                  return E.s(K.$ms, 3, "0");
                case "Z":
                  return j;
              }
              return null;
            })(W) || j.replace(":", "");
          }));
        }, R.utcOffset = function() {
          return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
        }, R.diff = function(N, K, H) {
          var T, j = this, F = E.p(K), J = O(N), B = (J.utcOffset() - this.utcOffset()) * i, Z = this - J, G = function() {
            return E.m(j, J);
          };
          switch (F) {
            case k:
              T = G() / 12;
              break;
            case f:
              T = G();
              break;
            case w:
              T = G() / 3;
              break;
            case d:
              T = (Z - B) / 6048e5;
              break;
            case o:
              T = (Z - B) / 864e5;
              break;
            case c:
              T = Z / r;
              break;
            case l:
              T = Z / i;
              break;
            case s:
              T = Z / n;
              break;
            default:
              T = Z;
          }
          return H ? T : E.a(T);
        }, R.daysInMonth = function() {
          return this.endOf(f).$D;
        }, R.$locale = function() {
          return V[this.$L];
        }, R.locale = function(N, K) {
          if (!N) return this.$L;
          var H = this.clone(), T = b(N, K, !0);
          return T && (H.$L = T), H;
        }, R.clone = function() {
          return E.w(this.$d, this);
        }, R.toDate = function() {
          return new Date(this.valueOf());
        }, R.toJSON = function() {
          return this.isValid() ? this.toISOString() : null;
        }, R.toISOString = function() {
          return this.$d.toISOString();
        }, R.toString = function() {
          return this.$d.toUTCString();
        }, A;
      })(), I = M.prototype;
      return O.prototype = I, [["$ms", a], ["$s", s], ["$m", l], ["$H", c], ["$W", o], ["$M", f], ["$y", k], ["$D", C]].forEach((function(A) {
        I[A[1]] = function(R) {
          return this.$g(R, A[0], A[1]);
        };
      })), O.extend = function(A, R) {
        return A.$i || (A(R, M, O), A.$i = !0), O;
      }, O.locale = b, O.isDayjs = h, O.unix = function(A) {
        return O(1e3 * A);
      }, O.en = V[L], O.Ls = V, O.p = {}, O;
    }));
  })(an)), an.exports;
}
var as = rs();
const We = /* @__PURE__ */ Nt(as);
function ls(e, t) {
  return e.replace(/\$(\w*)/g, (n, i) => Object.prototype.hasOwnProperty.call(t, i) ? String(t[i]) : "");
}
function ss(e) {
  if (!e || e.trim() === "")
    return !1;
  const t = new Date(e);
  return t.toString() !== "Invalid Date" && !isNaN(t.getTime());
}
function vi(e, t = "DD/MM/YYYY") {
  return We(e).format(t);
}
class os {
  constructor(t, n, i, r) {
    Ie(this, "stores");
    Ie(this, "referenceService");
    Ie(this, "expressionService");
    Ie(this, "config");
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
      return { state: De.VALID, messages: [] };
    if (n.hasRemark)
      return { state: De.VALID, messages: [] };
    const i = {
      state: De.VALID,
      messages: []
    };
    return this.runExpressionValidations(n, i), this.runLengthValidations(n, i), this.runRangeValidations(n, i), this.runPatternValidations(n, i), this.config.clientMode === ut.PAPI && this.runPapiValidations(n, i), this.updateValidationState(t, i), i;
  }
  /**
   * Run URL-based validation for a component.
   * This is async and updates the component state when complete.
   *
   * @param dataKey - The component's dataKey
   */
  validateUrl(t) {
    return de(this, null, function* () {
      const n = this.referenceService.getComponent(t);
      if (!(!n || !n.urlValidation || ![
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
          const a = yield r.json();
          if (!a.result) {
            const s = a.message || this.getLocaleString("validationApi");
            this.addValidationMessage(t, s, De.ERROR);
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
      validationState: De.VALID,
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
    for (const a of t.details) {
      if (!a.enable) continue;
      switch (this.validateComponent(a.dataKey).state) {
        case De.VALID:
          n++;
          break;
        case De.WARNING:
          i++;
          break;
        case De.ERROR:
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
    ), n.state = De.ERROR), r.min !== void 0 && i.length < r.min && (n.messages.push(
      `${this.getLocaleString("validationMinLength")} ${r.min}`
    ), n.state = De.ERROR);
  }
  /**
   * Run range validations (min, max).
   */
  runRangeValidations(t, n) {
    if (!t.rangeInput || t.answer === void 0 || t.answer === null || typeof t.answer == "object") return;
    const i = Number(t.answer), r = t.rangeInput;
    r.max !== void 0 && i > Number(r.max) && (n.messages.push(
      `${this.getLocaleString("validationMax")} ${r.max}`
    ), n.state = De.ERROR), r.min !== void 0 && i < Number(r.min) && (n.messages.push(
      `${this.getLocaleString("validationMin")} ${r.min}`
    ), n.state = De.ERROR);
  }
  /**
   * Run pattern validations (email, URL).
   */
  runPatternValidations(t, n) {
    if (t.answer === void 0 || t.answer === null || typeof t.answer == "object") return;
    const i = String(t.answer);
    t.type === be.URL && i && (Ue.EMAIL.test(i) || (n.messages.push(this.getLocaleString("validationEmail")), n.state = De.ERROR)), t.type, be.EMAIL;
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
    const i = t.options.map((a) => a.value), r = t.answer;
    if (r[0] && !i.includes(r[0].value)) {
      const a = ls(this.getLocaleString("validationInclude"), {
        values: i.join(",")
      });
      n.messages.push(a), n.state = De.ERROR;
    }
  }
  /**
   * Validate date input for PAPI mode.
   */
  validateDateInput(t, n) {
    const i = String(t.answer);
    if (!ss(i)) {
      n.messages.push(this.getLocaleString("validationDate")), n.state = De.ERROR;
      return;
    }
    const r = new Date(i), a = t.rangeInput;
    if ((a == null ? void 0 : a.max) !== void 0) {
      const s = a.max === "today" ? /* @__PURE__ */ new Date() : new Date(a.max);
      r.getTime() > s.getTime() && (n.messages.push(
        `${this.getLocaleString("validationMax")} ${vi(s)}`
      ), n.state = De.ERROR);
    }
    if ((a == null ? void 0 : a.min) !== void 0) {
      const s = a.min === "today" ? /* @__PURE__ */ new Date() : new Date(a.min);
      r.getTime() < s.getTime() && (n.messages.push(
        `${this.getLocaleString("validationMin")} ${vi(s)}`
      ), n.state = De.ERROR);
    }
  }
  /**
   * Validate range slider for PAPI mode.
   */
  validateRangeSlider(t, n) {
    var a;
    const i = (a = t.rangeInput) == null ? void 0 : a.step;
    if (i === void 0) return;
    Number(t.answer) % i !== 0 && (n.messages.push(
      `${this.getLocaleString("validationStep")} ${i}`
    ), n.state = De.ERROR);
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
      De.ERROR
    );
  }
  /**
   * Add a validation message to a component.
   */
  addValidationMessage(t, n, i) {
    const r = this.referenceService.getComponent(t);
    if (!r) return;
    const a = [...r.validationMessage || [], n], s = Math.max(r.validationState, i);
    this.referenceService.updateComponentBatch(t, {
      validationMessage: a,
      validationState: s
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
    var r, a;
    const [n] = this.stores.locale, i = (a = (r = n.details) == null ? void 0 : r.language) == null ? void 0 : a[0];
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
class ds {
  constructor(t, n, i, r) {
    Ie(this, "stores");
    Ie(this, "referenceService");
    Ie(this, "expressionService");
    Ie(this, "config");
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
      const a = n.details[r];
      if (!a.componentEnable || !this.isEnableDependent(
        a.componentEnable,
        t
      )) continue;
      const l = a.enable, c = this.expressionService.evaluateEnableCondition(
        a.enableCondition || "",
        a.dataKey
      );
      i("details", r, "enable", c), c !== l && this.updateSectionComponents(a, c);
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
    const i = t.split("@"), r = i[0], a = i[1];
    if (!a) return t;
    const s = r.split(Ue.NESTED_SEPARATOR), l = s.length;
    switch (a) {
      case "$ROW$":
        return r;
      case "$ROW1$":
        return l > 2 && (s.length = l - 1), s.join(Ue.NESTED_SEPARATOR);
      case "$ROW2$":
        return l > 3 && (s.length = l - 2), s.join(Ue.NESTED_SEPARATOR);
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
      const a = this.referenceService.getIndex(r.dataKey);
      if (a !== -1)
        if (!n)
          this.referenceService.updateComponent(r.dataKey, "enable", !1);
        else {
          const s = i.details[a];
          if (s.type === be.VARIABLE)
            continue;
          let l = !0;
          s.enableCondition && s.enableCondition.trim() !== "" && (l = this.expressionService.evaluateEnableCondition(
            s.enableCondition,
            s.dataKey
          )), this.referenceService.updateComponent(s.dataKey, "enable", l);
        }
    }
  }
  /**
   * Disable all children of a parent component.
   */
  disableChildren(t) {
    const [n] = this.stores.reference;
    for (const i of n.details)
      (i.parent === t || i.dataKey.startsWith(t + Ue.NESTED_SEPARATOR)) && this.referenceService.updateComponent(i.dataKey, "enable", !1);
  }
  /**
   * Re-evaluate enable conditions for all children of a parent.
   */
  reevaluateChildren(t) {
    const [n] = this.stores.reference;
    for (const i of n.details)
      (i.parent === t || i.dataKey.startsWith(t + Ue.NESTED_SEPARATOR)) && (i.enableCondition ? this.evaluateEnable(i.dataKey) : this.referenceService.updateComponent(i.dataKey, "enable", !0));
  }
  /**
   * Update the disabled sections cache (referenceEnableFalse).
   * This updates the list of disabled sidebar sections for navigation.
   */
  updateDisabledSectionsCache() {
    const [t] = this.stores.sidebar, [, n] = this.stores.referenceEnableFalse, i = [];
    for (const r of t.details)
      if (!r.enable) {
        const a = JSON.parse(JSON.stringify(r.index));
        i.push({ parentIndex: a });
      }
    n(i);
  }
}
class cs {
  constructor(t, n, i, r) {
    Ie(this, "stores");
    Ie(this, "referenceService");
    Ie(this, "expressionService");
    Ie(this, "config");
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
    se.log("NestedService", "insertFromArray called:", { dataKey: t, answer: n, sidebarPosition: i });
    let r = this.referenceService.getComponent(t);
    se.log("NestedService", "Parent component from reference:", r);
    let a = r == null ? void 0 : r.components;
    se.log("NestedService", "Component components:", a);
    const [s] = this.stores.nested, l = s.details;
    se.log("NestedService", "Looking for dataKey in nested store:", t);
    const c = l.find((m) => m.dataKey === t);
    if (se.log("NestedService", "Nested store entry:", c), c && (a || (a = c.components), r && (r = Xe(Ce({}, r), {
      level: (C = c.level) != null ? C : r.level,
      // Keep the reference component's index - it's the actual instance index
      // label and name from nested store are fallbacks if reference doesn't have them
      label: r.label || c.label,
      name: r.name || c.name
    }), se.log("NestedService", "Updated component with nested store values:", {
      level: r.level,
      index: r.index
    }))), !a) {
      const [m] = this.stores.sidebar, u = m.details.find(
        (x) => x.dataKey === t
      );
      se.log("NestedService", "Sidebar entry (fallback):", u), a = u == null ? void 0 : u.components;
    }
    if (!r || !a) {
      se.log("NestedService", "No component or no components array, returning");
      return;
    }
    const [o] = this.stores.sidebar;
    let d = r.index;
    const f = o.details.find((m) => {
      var x;
      return (x = m.components) != null && x[0] ? m.components[0].some(($) => $.dataKey === t) : !1;
    });
    if (f) {
      const u = f.components[0].findIndex((x) => x.dataKey === t);
      d = [...f.index, 0, u], se.log("NestedService", "Found parent sidebar, computed runtime index:", {
        parentSidebarDataKey: f.dataKey,
        parentSidebarIndex: JSON.stringify(f.index),
        compPosition: u,
        runtimeIndex: JSON.stringify(d)
      });
    }
    const w = Xe(Ce({}, r), {
      components: a,
      index: d
    });
    se.log("NestedService", "Component with components:", w);
    const k = this.createNestedComponents(
      w,
      Number(n.value),
      i,
      n.label
    );
    if (se.log("NestedService", "Created new components:", k.length), k.length !== 0)
      try {
        se.log("NestedService", "About to insertIntoReference"), this.insertIntoReference(k, w), se.log("NestedService", "insertIntoReference completed"), se.log("NestedService", "About to insertIntoSidebar"), this.insertIntoSidebar(w, n, k, i), se.log("NestedService", "insertIntoSidebar completed"), se.log("NestedService", "About to initializeNestedAnswers"), this.initializeNestedAnswers(k, i), se.log("NestedService", "initializeNestedAnswers completed"), se.log("NestedService", "insertFromArray completed successfully");
      } catch (m) {
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
    const a = [...r.index, Number(n.value)];
    this.removeFromReference(a), this.removeFromSidebar(a, i);
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
    const a = [];
    for (const l of n)
      i.some(
        (o) => Number(o.value) === Number(l.value)
      ) || a.push(l);
    const s = [];
    for (const l of i)
      n.some(
        (o) => Number(o.value) === Number(l.value)
      ) || s.push(l);
    if (a.length === 0 && s.length === 0) {
      this.handleLabelChange(t, n, i);
      return;
    }
    for (const l of a)
      this.insertFromArray(t, l, r);
    for (const l of s)
      this.deleteFromArray(t, l, r);
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
    se.log("NestedService", "insertFromNumber called:", { dataKey: t, targetCount: n, currentCount: i, sidebarPosition: r });
    let a = this.referenceService.getComponent(t);
    se.log("NestedService", "Parent component from reference:", a);
    let s = a == null ? void 0 : a.components;
    se.log("NestedService", "Component components:", s);
    const [l] = this.stores.nested, c = l.details;
    se.log("NestedService", "Looking for dataKey in nested store:", t);
    const o = c.find((m) => m.dataKey === t);
    if (se.log("NestedService", "Nested store entry:", o), o && (s || (s = o.components), a && (a = Xe(Ce({}, a), {
      level: (C = o.level) != null ? C : a.level,
      // Keep the reference component's index - it's the actual instance index
      // label and name from nested store are fallbacks if reference doesn't have them
      label: a.label || o.label,
      name: a.name || o.name
    }), se.log("NestedService", "Updated component with nested store values:", {
      level: a.level,
      index: a.index
    }))), !s) {
      const [m] = this.stores.sidebar, u = m.details.find(
        (x) => x.dataKey === t
      );
      se.log("NestedService", "Sidebar entry (fallback):", u), s = u == null ? void 0 : u.components;
    }
    if (!a || !s) {
      se.log("NestedService", "No component or no components array, returning");
      return;
    }
    const [d] = this.stores.sidebar;
    let f = a.index;
    const w = d.details.find((m) => {
      var x;
      return (x = m.components) != null && x[0] ? m.components[0].some(($) => $.dataKey === t) : !1;
    });
    if (w) {
      const u = w.components[0].findIndex((x) => x.dataKey === t);
      f = [...w.index, 0, u], se.log("NestedService", "Found parent sidebar, computed runtime index:", {
        parentSidebarDataKey: w.dataKey,
        parentSidebarIndex: JSON.stringify(w.index),
        compPosition: u,
        runtimeIndex: JSON.stringify(f)
      });
    }
    const k = Xe(Ce({}, a), {
      components: s,
      index: f
    });
    se.log("NestedService", "Component with components:", k);
    for (let m = i + 1; m <= n; m++) {
      const u = this.createNestedComponents(
        k,
        m,
        r,
        String(m)
      );
      if (se.log("NestedService", "Created new components:", u.length), u.length !== 0)
        try {
          se.log("NestedService", "About to insertIntoReference"), this.insertIntoReference(u, k), se.log("NestedService", "insertIntoReference completed"), se.log("NestedService", "About to insertIntoSidebar"), this.insertIntoSidebar(
            k,
            { label: `<i>___________ # ${m}</i>`, value: m },
            u,
            r
          ), se.log("NestedService", "insertIntoSidebar completed"), se.log("NestedService", "About to initializeNestedAnswers"), this.initializeNestedAnswers(u, r), se.log("NestedService", "initializeNestedAnswers completed"), se.log("NestedService", "insertFromNumber iteration completed successfully for i:", m);
        } catch (x) {
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
    const a = this.referenceService.getComponent(t);
    if (a)
      for (let s = i; s > n; s--) {
        const l = [...a.index, s];
        this.removeFromReference(l), this.removeFromSidebar(l, r);
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
    const a = this.referenceService.getComponent(t);
    if (!(!a || a.type !== be.NESTED || !a.sourceQuestion || !this.referenceService.getComponent(
      a.sourceQuestion
    ))) {
      if (Array.isArray(n)) {
        const l = n || [], c = i || [];
        if (l.length > c.length) {
          const o = l.filter(
            (d) => !c.some((f) => f.value === d.value)
          );
          for (const d of o)
            this.insertFromArray(t, d, r);
        } else if (l.length < c.length) {
          const o = c.filter(
            (d) => !l.some((f) => f.value === d.value)
          );
          for (const d of o)
            this.deleteFromArray(t, d, r);
        } else
          this.changeFromArray(
            t,
            l,
            c,
            r
          );
      } else if (typeof n == "number") {
        const l = n, c = i || 0;
        l > c ? this.insertFromNumber(
          t,
          l,
          c,
          r
        ) : l < c && this.deleteFromNumber(
          t,
          l,
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
    var l, c, o;
    const i = JSON.parse(JSON.stringify(t));
    i.dataKey = `${t.dataKey}${Ue.NESTED_SEPARATOR}${n.nestedPosition}`;
    const r = t.name || t.dataKey;
    i.name = `${r}${Ue.NESTED_SEPARATOR}${n.nestedPosition}`, t.type === be.PHOTO ? i.answer = [{ label: "lastId#0", value: 0 }] : i.answer || (i.answer = ""), !i.index || !Array.isArray(i.index) ? i.index = [0, n.nestedPosition, 0, n.componentPosition] : n.parentIndex.length === 0 ? (i.index = [...i.index], i.index.length >= 2 && (i.index[i.index.length - 2] = n.nestedPosition)) : i.index = [...n.parentIndex, 0, n.componentPosition], n.parentName && (i.label = i.label.replace("$NAME$", n.parentName)), i.sourceQuestion && (i.sourceQuestion = `${i.sourceQuestion}${Ue.NESTED_SEPARATOR}${n.nestedPosition}`), i.sourceOption = this.updateRowMarkerReference(
      i.sourceOption,
      n.nestedPosition
    );
    const a = i.componentVar || [];
    if (i.componentVar = this.updateRowMarkerReferences(
      a,
      n.nestedPosition
    ), se.log("NestedService", "Updated componentVar:", {
      dataKey: i.dataKey,
      type: i.type,
      originalCompVar: a,
      newCompVar: i.componentVar
    }), i.expression && a.length > 0) {
      let d = i.expression;
      for (let f = 0; f < a.length; f++)
        d = d.replace(
          a[f],
          i.componentVar[f]
        );
      i.expression = d;
    }
    const s = i.componentEnable || [];
    if (i.componentEnable = this.updateRowMarkerReferences(
      s,
      n.nestedPosition
    ), i.enableCondition && s.length > 0) {
      let d = i.enableCondition;
      for (let f = 0; f < s.length; f++)
        d = d.replace(
          s[f],
          i.componentEnable[f]
        );
      i.enableCondition = d;
    }
    if (i.enable = this.evaluateComponentEnable(i), i.hasRemark = !1, t.type === be.NESTED && n.parentLevel !== void 0 && (i.level = n.parentLevel + 1, se.log("NestedService", "Set nested component level:", {
      dataKey: i.dataKey,
      parentLevel: n.parentLevel,
      newLevel: i.level
    })), (t.type === be.SECTION || t.type === be.NESTED) && ((l = t.components) != null && l[0])) {
      const d = [], f = t.components[0], w = (o = i.level) != null ? o : ((c = n.parentLevel) != null ? c : 0) + 1;
      for (let k = 0; k < f.length; k++) {
        const C = {
          dataKey: f[k].dataKey,
          nestedPosition: n.nestedPosition,
          componentPosition: k,
          sidebarPosition: n.sidebarPosition,
          parentIndex: [...i.index],
          parentName: null,
          parentLevel: w
          // Pass current level so grandchildren get correct level
        };
        d.push(
          this.createNestedComponent(f[k], C)
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
    const a = [];
    se.log("NestedService", "createNestedComponents parent:", {
      dataKey: t.dataKey,
      level: t.level,
      index: t.index
    });
    const s = (d = t.components) == null ? void 0 : d[0];
    if (se.log("NestedService", "templateComponents:", s == null ? void 0 : s.length), !s)
      return se.log("NestedService", "No templateComponents, returning empty array"), a;
    const l = (f = t.level) != null ? f : 1, c = l >= 2, o = c ? [...t.index, n] : [];
    se.log("NestedService", "Index strategy:", {
      parentLevel: l,
      shouldUseParentIndex: c,
      parentIndexForChildren: JSON.stringify(o)
    });
    for (let w = 0; w < s.length; w++)
      try {
        se.log("NestedService", `Creating component ${w}:`, s[w].dataKey);
        const k = {
          dataKey: s[w].dataKey,
          nestedPosition: n,
          componentPosition: w,
          sidebarPosition: i,
          parentIndex: o,
          parentName: r,
          parentLevel: l
          // Pass parent level so children get correct level
        }, C = this.createNestedComponent(s[w], k);
        se.log("NestedService", `Created component ${w}:`, C.dataKey, "level:", C.level), a.push(C);
      } catch (k) {
      }
    return se.log("NestedService", "createNestedComponents returning", a.length, "components"), a;
  }
  // ===========================================================================
  // Private Store Operations
  // ===========================================================================
  /**
   * Insert components into the reference store.
   */
  insertIntoReference(t, n) {
    if (t.length === 0) return;
    const [i, r] = this.stores.reference, [a] = this.stores.referenceMap, s = this.findInsertPosition(
      t[0].index,
      i.details
    ), l = [...i.details];
    let c = s;
    const o = a(), d = [];
    for (const f of t)
      f.dataKey in o || (l.splice(c, 0, f), d.push(f), c++);
    Tn(() => {
      r("details", l), this.referenceService.rebuildIndexMap(), d.length > 0 && this.referenceService.registerDynamicComponents(d);
    });
  }
  /**
   * Remove components from the reference store.
   */
  removeFromReference(t) {
    const [n, i] = this.stores.reference, r = n.details.filter((a) => {
      const s = [...a.index];
      return s.length = t.length, JSON.stringify(s) !== JSON.stringify(t);
    });
    Tn(() => {
      i("details", r), this.referenceService.rebuildIndexMap();
    });
  }
  /**
   * Insert a sidebar entry.
   */
  insertIntoSidebar(t, n, i, r) {
    var f, w;
    const [a, s] = this.stores.sidebar;
    se.log("NestedService", "insertIntoSidebar:", {
      parentDataKey: t.dataKey,
      parentLevel: t.level,
      parentIndex: JSON.stringify(t.index),
      answer: n.value
    });
    const l = {
      dataKey: `${t.dataKey}${Ue.NESTED_SEPARATOR}${n.value}`,
      name: t.name,
      label: t.label,
      description: n.label,
      level: (f = t.level) != null ? f : 1,
      index: [...t.index, Number(n.value)],
      components: [i],
      sourceQuestion: t.sourceQuestion,
      enable: (w = t.enable) != null ? w : !0,
      enableCondition: t.enableCondition,
      componentEnable: t.componentEnable
    };
    if (se.log("NestedService", "Creating sidebar entry:", {
      dataKey: l.dataKey,
      level: l.level,
      index: JSON.stringify(l.index),
      parentIndex: JSON.stringify(t.index),
      label: l.label
    }), a.details.some((k) => k.dataKey === l.dataKey)) {
      se.log("NestedService", "Sidebar entry already exists, skipping:", l.dataKey);
      return;
    }
    const o = this.findSidebarInsertPosition(
      l.index,
      a.details,
      r
    );
    se.log("NestedService", "Inserting sidebar at position:", {
      insertPos: o,
      currentSidebarLength: a.details.length
    });
    const d = [...a.details];
    d.splice(o, 0, l), se.log("NestedService", "Sidebar after insert:", {
      newLength: d.length,
      entries: d.map((k) => ({
        dataKey: k.dataKey,
        level: k.level,
        index: JSON.stringify(k.index)
      }))
    }), s("details", d), this.registerNestedComponentsInStore(i);
  }
  /**
   * Register nested components (type 2) in the nested store.
   * This ensures their templates are available for deeper nested levels.
   *
   * @param components - The components to scan for nested types
   */
  registerNestedComponentsInStore(t) {
    const [n, i] = this.stores.nested, r = [...n.details];
    for (const a of t)
      a.type === be.NESTED && a.components && (r.some((l) => l.dataKey === a.dataKey) || (se.log("NestedService", "Registering nested component in store:", a.dataKey, "level:", a.level), r.push({
        dataKey: a.dataKey,
        components: a.components,
        level: a.level,
        // Use component's level (set in createNestedComponent)
        index: a.index,
        label: a.label,
        name: a.name,
        description: a.description,
        sourceQuestion: a.sourceQuestion,
        enable: a.enable,
        enableCondition: a.enableCondition,
        componentEnable: a.componentEnable
      })));
    r.length > n.details.length && i("details", r);
  }
  /**
   * Remove a sidebar entry.
   */
  removeFromSidebar(t, n) {
    const [i, r] = this.stores.sidebar, a = i.details.filter((s) => {
      const l = [...s.index];
      return l.length = t.length, JSON.stringify(l) !== JSON.stringify(t);
    });
    r("details", a);
  }
  /**
   * Initialize answers for newly created nested components.
   */
  initializeNestedAnswers(t, n) {
    const [i] = this.stores.response, [r] = this.stores.preset;
    for (const a of t) {
      let s = a.answer || "";
      if (a.type === be.VARIABLE)
        s = this.expressionService.evaluateVariable(
          a.expression || "",
          a.dataKey
        );
      else {
        const l = i.details.answers.find(
          (c) => c.dataKey === a.dataKey
        );
        if (l)
          s = l.answer;
        else {
          const c = r.details.predata.find(
            (o) => o.dataKey === a.dataKey
          );
          c && this.shouldUsePreset(a) && (s = c.answer);
        }
      }
      this.referenceService.updateComponent(a.dataKey, "answer", s);
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
    return ["$ROW$", "$ROW1$", "$ROW2$"].includes(r) ? `${i[0]}${Ue.NESTED_SEPARATOR}${n}` : t;
  }
  /**
   * Update an array of references with row markers.
   * Transforms dataKey@$ROW$ -> dataKey#nestedPosition
   */
  updateRowMarkerReferences(t, n) {
    return t.map((i) => {
      const r = i.split("@");
      if (r.length < 2) return i;
      const a = r[1];
      return ["$ROW$", "$ROW1$", "$ROW2$"].includes(a) ? `${r[0]}${Ue.NESTED_SEPARATOR}${n}` : i;
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
      const a = t.slice(0, r);
      for (let s = n.length - 1; s >= 0; s--) {
        const l = n[s].index.slice(0, r);
        if (JSON.stringify(l) === JSON.stringify(a))
          return s + 1;
      }
    }
    return n.length;
  }
  /**
   * Find the correct position to insert a new sidebar entry.
   */
  findSidebarInsertPosition(t, n, i) {
    var a, s;
    const r = t.length;
    for (let l = r; l > 1; l--) {
      const c = t.slice(0, l);
      for (let o = n.length - 1; o >= i; o--) {
        if (!n[o]) continue;
        const d = n[o].index.slice(0, l);
        if (JSON.stringify(d) === JSON.stringify(c)) {
          const f = (a = t[l]) != null ? a : 0, w = (s = n[o].index[l]) != null ? s : 0;
          if (l === r - 1 || f >= w)
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
    var l;
    const [r, a] = this.stores.sidebar, s = this.referenceService.getComponent(t);
    if (s)
      for (const c of n) {
        if (!i.find(
          (m) => m.value === c.value && m.label !== c.label
        )) continue;
        const d = [...s.index, Number(c.value)], f = r.details.findIndex(
          (m) => JSON.stringify(m.index) === JSON.stringify(d)
        );
        if (f === -1) continue;
        const w = r.details[f].description, k = c.label, C = Ce({}, r.details[f]);
        if (C.description = k, (l = C.components) != null && l[0]) {
          const m = C.components[0].map((u) => Xe(Ce({}, u), {
            label: u.label.replace(w || "", k)
          }));
          C.components = [m];
        }
        a("details", f, C);
      }
  }
}
class us {
  constructor(t, n, i, r, a, s, l) {
    Ie(this, "stores");
    Ie(this, "referenceService");
    Ie(this, "expressionService");
    Ie(this, "validationService");
    Ie(this, "enableService");
    Ie(this, "nestedService");
    Ie(this, "historyService", null);
    Ie(this, "config");
    this.stores = t, this.referenceService = n, this.expressionService = i, this.validationService = r, this.enableService = a, this.nestedService = s, this.config = l;
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
      skipCascade: a = !1,
      isInitial: s = !1,
      activePosition: l = 0
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
    }), this.referenceService.updateComponent(t, "answer", n), !r && !s && this.validationService.validateComponent(t), this.hasAnswerChanged(o, n) && (a || this.runCascadingUpdates(t, n, o, l));
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
    se.log("AnswerService", "runCascadingUpdates called:", { dataKey: t, value: n, beforeAnswer: i, activePosition: r });
    const a = this.referenceService.getComponent(t);
    if (!a) {
      se.log("AnswerService", "No component found for dataKey:", t);
      return;
    }
    if (this.enableService.evaluateDependents(t), !a.enable) {
      se.log("AnswerService", "Component is disabled, stopping cascade");
      return;
    }
    this.validationService.validateDependents(t), this.updateSourceOptionDependents(t, n), this.updateVariableDependents(t), se.log("AnswerService", "About to call handleNestedUpdates"), this.handleNestedUpdates(t, n, i, r), this.updateDisabledSections();
  }
  /**
   * Update components that use this dataKey as sourceOption.
   */
  updateSourceOptionDependents(t, n) {
    if (!Array.isArray(n)) return;
    const i = this.referenceService.getSourceOptionDependents(t);
    for (const r of i) {
      const a = this.referenceService.getComponent(r);
      if (!a || !a.enable || !a.answer) continue;
      const s = a.answer.filter(
        (l) => n.some((c) => c.value === l.value)
      );
      s.length !== a.answer.length && this.saveAnswer(r, s);
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
        this.saveAnswer(t, void 0, { isInitial: !0 });
      }
  }
  /**
   * Handle updates for nested components.
   */
  handleNestedUpdates(t, n, i, r) {
    const a = this.referenceService.getNestedDependents(t);
    se.log("AnswerService", "handleNestedUpdates:", {
      dataKey: t,
      value: n,
      beforeAnswer: i,
      nestedDependents: Array.from(a)
    });
    for (const s of a) {
      const l = this.referenceService.getComponent(s);
      se.log("AnswerService", "Processing nested:", { nestedKey: s, nested: l, type: l == null ? void 0 : l.type }), !(!l || l.type !== be.NESTED) && (typeof n == "number" || typeof n == "string" ? (se.log("AnswerService", "Handling number-based nested"), this.handleNumberBasedNested(
        s,
        Number(n),
        Number(i) || 0,
        r
      )) : Array.isArray(n) && (se.log("AnswerService", "Handling array-based nested"), this.handleArrayBasedNested(
        s,
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
    const a = this.cleanNestedOptions(n), s = this.cleanNestedOptions(i);
    se.log("AnswerService", "handleArrayBasedNested:", {
      nestedKey: t,
      cleanCurrent: a,
      cleanPrevious: s,
      currentLength: a.length,
      previousLength: s.length
    });
    for (const l of a) {
      const c = s.some((o) => o.value === l.value);
      if (!c) {
        const [o] = this.stores.sidebar, d = o.details.some(
          (f) => f.dataKey === `${t}#${l.value}`
        );
        se.log("AnswerService", "Checking item to add:", { item: l, existsInPrevious: c, existsInSidebar: d }), d || (se.log("AnswerService", "Calling insertFromArray for:", l), this.nestedService.insertFromArray(t, l, r));
      }
    }
    for (const l of s)
      a.some((o) => o.value === l.value) || (se.log("AnswerService", "Removing item:", l), this.nestedService.deleteFromArray(t, l, r));
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
class gs {
  constructor(t, n) {
    Ie(this, "stores");
    Ie(this, "referenceService");
    Ie(this, "enabled", !0);
    Ie(this, "referenceHistory", []);
    Ie(this, "sidebarHistory", []);
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
    for (let a = this.referenceHistory.length - 1; a >= 0; a--) {
      const s = this.referenceHistory[a];
      switch (s.type) {
        case "insert_ref_detail":
          r = this.undoInsert(r, s.value);
          break;
        case "delete_ref_detail":
          r = this.undoDelete(r, s.value);
          break;
        case "saveAnswer":
          r = this.undoSaveAnswer(
            r,
            s.dataKey,
            s.position,
            s.attribute,
            s.value
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
      const a = n[r];
      let s = a.pos;
      if (((i = t[s]) == null ? void 0 : i.dataKey) !== a.data) {
        const l = t.findIndex((c) => c.dataKey === a.data);
        l !== -1 && (s = l);
      }
      s !== -1 && s < t.length && t.splice(s, 1);
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
  undoSaveAnswer(t, n, i, r, a) {
    var s;
    if (((s = t[i]) == null ? void 0 : s.dataKey) !== n) {
      const l = t.findIndex((c) => c.dataKey === n);
      l !== -1 && (i = l);
    }
    if (i === -1 || i >= t.length)
      return t;
    if (r === "answer")
      t[i].answer = a;
    else if (r === "enable")
      t[i].enable = a;
    else if (r === "validate") {
      const l = a;
      t[i].validationState = l.validationState, t[i].validationMessage = JSON.parse(
        JSON.stringify(l.validationMessage)
      );
    }
    return t;
  }
}
function hs(e, t) {
  const n = new ts(e), i = new ns(e, n, t), r = new os(e, n, i, t), a = new ds(e, n, i, t), s = new cs(e, n, i, t), l = new gs(e, n), c = new us(e, n, i, r, a, s, t);
  return c.setHistoryService(l), {
    reference: n,
    expression: i,
    validation: r,
    enable: a,
    nested: s,
    answer: c,
    history: l
  };
}
const Sr = Jt(), fs = (e) => g(Sr.Provider, {
  get value() {
    return e.services;
  },
  get children() {
    return e.children;
  }
});
function gt() {
  const e = Wt(Sr);
  if (!e)
    throw new Error("useServices must be used within a ServiceProvider. Make sure your component is wrapped with <ServiceProvider services={...}>.");
  return e;
}
function ym() {
  return gt().reference;
}
function pm() {
  return gt().expression;
}
function km() {
  return gt().validation;
}
function $m() {
  return gt().enable;
}
function _m() {
  return gt().nested;
}
function Sm() {
  return gt().answer;
}
function Cm() {
  return gt().history;
}
var ms = /* @__PURE__ */ y("<span class=text-pink-600>*"), vs = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), bs = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), ws = /* @__PURE__ */ y("<div class=flex-1><div>"), xs = /* @__PURE__ */ y("<div class=shrink-0>"), ys = /* @__PURE__ */ y('<div class="grid md:grid-cols-3 border-b border-gray-300/[.50] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 md:col-span-2 flex items-start gap-2">'), ps = /* @__PURE__ */ y('<div class="w-full mx-auto flex-1"><div class="animate-pulse flex space-x-4"><div class="flex-1 space-y-3 py-1"><div class="h-3 bg-gray-100 rounded-full"></div><div class="h-3 bg-gray-100 rounded-full"></div><div class="h-3 bg-gray-100 rounded-full">'), ks = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), $s = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), _s = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="flex-1 text-justify">');
const Ss = (e) => {
  const t = gt(), [n] = it(), [i] = rt(), [r] = Jn(), [a, s] = z(""), [l, c] = z(!1), [o, d] = z([]), [f, w] = z(""), k = e.config, [C, m] = z(k.formMode > 1 ? !0 : e.component.disableInput);
  switch (e.component.typeOption) {
    case 1: {
      try {
        let v = e.component.options.map((b, O) => ({
          value: b.value,
          label: b.label
        })), h = e.value && e.value != "" ? e.value[0].value : "";
        $e(() => {
          s(e.component.label), d(v);
          let b = v.filter((O) => O.value.includes(h))[0] && h != "" ? v.filter((O) => O.value.includes(h))[0].label : "";
          w(b), c(!0);
        });
      } catch (v) {
        me(i.details.language[0].fetchFailed);
      }
      break;
    }
    case 2: {
      try {
        if (k.lookupMode === 1) {
          let v = e.component.sourceAPI[0], h = `${v.baseUrl}`;
          if (v.filterDependencies !== void 0 && v.filterDependencies.length > 0) {
            let I, A, R = h;
            I = v.filterDependencies.map((N, K) => {
              let H = N.sourceAnswer.split("@"), T = n.details.find((j) => j.dataKey == H[0]);
              if (T.answer) {
                const j = T.answer;
                if (j.length > 0) {
                  let F = encodeURI(j[j.length - 1].value);
                  A = `${N.params}=${F}`;
                }
              } else
                m(!0);
              return A;
            }).join("&"), h = `${R}?${I}`;
          }
          if (v.subResourceDependencies !== void 0 && v.subResourceDependencies.length > 0) {
            let I, A, R = h;
            I = v.subResourceDependencies.map((N, K) => {
              let H = N.sourceAnswer.split("@"), T = n.details.find((j) => j.dataKey == H[0]);
              if (T.answer) {
                const j = T.answer;
                j.length > 0 && (A = `${encodeURI(j[j.length - 1].value)}/${N.params}`);
              } else
                m(!0);
              return A;
            }).join("/"), h = `${R}/${I}`;
          }
          const b = {
            headers: v.headers,
            method: "GET"
          }, O = (I) => de(null, null, function* () {
            return yield fetch(I, b).catch((A) => ({
              success: !1,
              data: {},
              message: "500"
            })).then((A) => de(null, null, function* () {
              if (A.status === 200) {
                let R = yield A.json(), N = new Object();
                return N.success = !0, N.data = v.data !== "" ? R[v.data] : R, N.message = R.msg, N;
              } else
                return {
                  success: !1,
                  data: {},
                  message: A.status
                };
            })).then((A) => A);
          }), [E] = Ut(() => h, O);
          let M = e.value && e.value != "" ? e.value[0].value : "";
          $e(() => {
            if (s(e.component.label), E())
              if (!E().success)
                me(i.details.language[0].fetchFailed);
              else {
                let I = [];
                E().data.map((R, N) => {
                  I.push({
                    value: R[v.value],
                    label: R[v.label]
                  });
                });
                let A = I.find((R) => R.value == M) && M != "" ? I.find((R) => R.value == M).label : "";
                d(I), w(A), c(!0);
              }
          });
        } else if (k.lookupMode === 2) {
          let v, h = [];
          v = e.component.sourceAPI;
          let b = v[0].id, O = v[0].version;
          v[0].parentCondition.length > 0 && v[0].parentCondition.map((I, A) => {
            let R = I.value.split("@"), N = n.details.find((K) => K.dataKey == R[0]);
            if (N.answer) {
              const K = N.answer;
              if (K.length > 0) {
                let H = K[K.length - 1].value.toString();
                h.push({
                  key: I.key,
                  value: H
                });
              }
            }
          });
          let E = (I) => {
            let A = [];
            if (I.data.length > 0) {
              let R = v[0].value, N = v[0].label, K = e.value && e.value != "" ? e.value[0].value : "";
              I.data.map((T, j) => {
                A.push({
                  value: T[R],
                  label: T[N]
                });
              });
              let H = A.find((T) => T.value == K) && K != "" ? A.find((T) => T.value == K).label : "";
              s(e.component.label), d(A), w(H), c(!0);
            }
          };
          const M = e.MobileOfflineSearch(b, O, h, E);
        }
      } catch (v) {
        me(i.details.language[0].fetchFailed);
      }
      break;
    }
    case 3: {
      try {
        let v, h, b = e.value && e.value != "" ? e.value[0].value : "";
        if (e.component.sourceOption !== void 0 && e.component.typeOption === 3) {
          const E = n.details.findIndex((M) => M.dataKey === e.component.sourceOption);
          n.details[E].type, v = n.details[E].answer, v != null ? h = v.filter((M, I) => M.value != 0).map((M, I) => ({
            value: M.value,
            label: M.label
          })) : h = [];
        }
        let O = h.find((E) => E.value == b) && b != "" ? h.find((E) => E.value == b).label : "";
        $e(() => {
          s(e.component.label), d(h), w(O), c(!0);
        });
      } catch (v) {
        me(i.details.language[0].fetchFailed);
      }
      break;
    }
    default: {
      try {
        let v;
        e.component.options ? v = e.component.options.map((b, O) => ({
          value: b.value,
          label: b.label
        })) : v = [];
        let h = e.value && e.value != "" ? e.value[0].value : "";
        $e(() => {
          s(e.component.label), d(v);
          let b = v.filter((O) => O.value.includes(h))[0] && h != "" ? v.filter((O) => O.value.includes(h))[0].label : "";
          w(b), c(!0);
        });
      } catch (v) {
        me(i.details.language[0].fetchFailed);
      }
      break;
    }
  }
  let u = (v) => {
    n.details.map((h) => {
      h.sourceAPI && h.sourceAPI.length > 0 && (h.sourceAPI[0].filterDependencies !== void 0 && h.sourceAPI[0].filterDependencies.length > 0 && h.sourceAPI[0].filterDependencies.map((O) => {
        if (O.sourceAnswer == v && h.answer != null) {
          let E = r.details.findIndex((M, I) => M.components[0].findIndex((R, N) => (R.dataKey, h.dataKey, N)) == -1 ? 0 : I);
          t.answer.saveAnswer(h.dataKey, null, {
            activePosition: E
          }), u(h.dataKey);
        } else
          return;
      }), h.sourceAPI[0].subResourceDependencies !== void 0 && h.sourceAPI[0].subResourceDependencies.length > 0 && h.sourceAPI[0].subResourceDependencies.map((O) => {
        if (O.sourceAnswer == v && h.answer != null) {
          let E = r.details.findIndex((M, I) => M.components[0].findIndex((R, N) => (R.dataKey, h.dataKey, N)) == -1 ? 0 : I);
          t.answer.saveAnswer(h.dataKey, null, {
            activePosition: E
          }), u(h.dataKey);
        } else
          return;
      }));
    });
  }, x = (v, h) => {
    if (v != "" && v != null) {
      let b = JSON.parse(JSON.stringify(e.value));
      b = [], b.push({
        value: v,
        label: h
      }), e.onValueChange(b), u(e.component.dataKey);
    }
  };
  const [$, S] = z(!1), _ = () => {
    $() ? S(!1) : S(!0);
  }, [L] = z(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [V] = z(k.formMode > 2 && e.comments == 0);
  return (() => {
    var v = ys(), h = v.firstChild, b = h.firstChild, O = b.firstChild, E = b.nextSibling, M = h.nextSibling;
    return p(b, g(D, {
      get when() {
        return e.component.required;
      },
      get children() {
        return ms();
      }
    }), null), p(b, g(D, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var I = vs();
        return I.$$click = _, I;
      }
    }), null), p(E, g(D, {
      get when() {
        return $();
      },
      get children() {
        var I = bs();
        return P(() => I.innerHTML = e.component.hint), I;
      }
    })), p(M, g(D, {
      get when() {
        return l();
      },
      get fallback() {
        return ps();
      },
      get children() {
        var I = ws(), A = I.firstChild;
        return p(A, g(At, et({
          class: "formgear-select w-full rounded font-light text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-0 border-transparent focus:outline-none  disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
        }, () => Ot(o() || [], {
          key: "label",
          filterable: !0
        }), {
          get disabled() {
            return C();
          },
          onChange: (R) => x(R ? R.value : "", R ? R.label : ""),
          get initialValue() {
            return {
              value: e.value && e.value != "" ? e.value[0].value : "",
              label: f
            };
          }
        }))), p(I, g(D, {
          get when() {
            var R;
            return ((R = e.validationMessage) == null ? void 0 : R.length) > 0;
          },
          get children() {
            return g(ce, {
              get each() {
                return e.validationMessage;
              },
              children: (R) => (() => {
                var N = _s(), K = N.firstChild, H = K.firstChild;
                return p(K, g(we, {
                  get children() {
                    return [g(te, {
                      get when() {
                        return e.classValidation === 1;
                      },
                      get children() {
                        return ks();
                      }
                    }), g(te, {
                      get when() {
                        return e.classValidation === 2;
                      },
                      get children() {
                        return $s();
                      }
                    })];
                  }
                }), H), H.innerHTML = R, P((T) => X(K, {
                  " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
                  " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
                }, T)), N;
              })()
            });
          }
        }), null), P((R) => X(A, {
          " border rounded border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
          " border rounded border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
        }, R)), I;
      }
    }), null), p(M, g(D, {
      get when() {
        return L();
      },
      get children() {
        var I = xs();
        return p(I, g(Re, {
          get disabled() {
            return V();
          },
          onClick: () => e.openRemark(e.component.dataKey),
          get comments() {
            return e.comments;
          }
        })), I;
      }
    }), null), P(() => O.innerHTML = a()), v;
  })();
};
he(["click"]);
var Cs = /* @__PURE__ */ y("<span class=text-pink-600>*"), Ms = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Is = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), bi = /* @__PURE__ */ y('<input type=number class="w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"placeholder>'), Es = /* @__PURE__ */ y("<div class=shrink-0>"), Ls = /* @__PURE__ */ y('<div class="grid md:grid-cols-3 p-2 border-b border-gray-300/[.40] dark:border-gray-200/[.10]"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 md:col-span-2 flex items-start gap-2"><div class=flex-1>'), Os = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), As = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Rs = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="flex-1 text-justify">');
const Ns = (e) => {
  const t = e.config, [n] = z(t.formMode > 1 ? !0 : e.component.disableInput), [i, r] = z(!1), a = () => {
    i() ? r(!1) : r(!0);
  }, [s] = z(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [l] = z(t.formMode > 2 && e.comments == 0);
  return (() => {
    var c = Ls(), o = c.firstChild, d = o.firstChild, f = d.firstChild, w = d.nextSibling, k = o.nextSibling, C = k.firstChild;
    return p(d, g(D, {
      get when() {
        return e.component.required;
      },
      get children() {
        return Cs();
      }
    }), null), p(d, g(D, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var m = Ms();
        return m.$$click = a, m;
      }
    }), null), p(w, g(D, {
      get when() {
        return i();
      },
      get children() {
        var m = Is();
        return P(() => m.innerHTML = e.component.hint), m;
      }
    })), p(C, g(D, {
      get when() {
        return e.component.lengthInput === void 0;
      },
      get children() {
        var m = bi();
        return m.addEventListener("change", (u) => {
          e.onValueChange(parseInt(u.currentTarget.value));
        }), P((u) => {
          var x = e.component.dataKey, $ = {
            " border border-solid border-gray-300 ": e.classValidation === 0,
            " border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
            " border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
          }, S = n();
          return x !== u.e && U(m, "name", u.e = x), u.t = X(m, $, u.t), S !== u.a && (m.disabled = u.a = S), u;
        }, {
          e: void 0,
          t: void 0,
          a: void 0
        }), P(() => m.value = e.value), m;
      }
    }), null), p(C, g(D, {
      get when() {
        return _e(() => e.component.lengthInput !== void 0)() && e.component.lengthInput.length > 0;
      },
      get children() {
        var m = bi();
        return m.$$input = (u) => {
          const x = u.currentTarget;
          x.value.length > x.maxLength && (x.value = x.value.slice(0, x.maxLength));
        }, m.addEventListener("change", (u) => {
          e.onValueChange(parseInt(u.currentTarget.value));
        }), P((u) => {
          var x = e.component.dataKey, $ = {
            " border border-solid border-gray-300 ": e.classValidation === 0,
            " border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
            " border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
          }, S = n(), _ = e.component.lengthInput[0].maxlength !== void 0 ? e.component.lengthInput[0].maxlength : "", L = e.component.lengthInput[0].minlength !== void 0 ? e.component.lengthInput[0].minlength : "", V = e.component.rangeInput && e.component.rangeInput[0].max !== void 0 ? e.component.rangeInput[0].max : "", v = e.component.rangeInput && e.component.rangeInput[0].min !== void 0 ? e.component.rangeInput[0].min : "";
          return x !== u.e && U(m, "name", u.e = x), u.t = X(m, $, u.t), S !== u.a && (m.disabled = u.a = S), _ !== u.o && U(m, "maxlength", u.o = _), L !== u.i && U(m, "minlength", u.i = L), V !== u.n && U(m, "max", u.n = V), v !== u.s && U(m, "min", u.s = v), u;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0,
          i: void 0,
          n: void 0,
          s: void 0
        }), P(() => m.value = e.value), m;
      }
    }), null), p(C, g(D, {
      get when() {
        var m;
        return ((m = e.validationMessage) == null ? void 0 : m.length) > 0;
      },
      get children() {
        return g(ce, {
          get each() {
            return e.validationMessage;
          },
          children: (m) => (() => {
            var u = Rs(), x = u.firstChild, $ = x.firstChild;
            return p(x, g(we, {
              get children() {
                return [g(te, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return Os();
                  }
                }), g(te, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return As();
                  }
                })];
              }
            }), $), $.innerHTML = m, P((S) => X(x, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, S)), u;
          })()
        });
      }
    }), null), p(k, g(D, {
      get when() {
        return s();
      },
      get children() {
        var m = Es();
        return p(m, g(Re, {
          get disabled() {
            return l();
          },
          onClick: () => e.openRemark(e.component.dataKey),
          get comments() {
            return e.comments;
          }
        })), m;
      }
    }), null), P(() => f.innerHTML = e.component.label), c;
  })();
};
he(["click", "input"]);
var Vs = /* @__PURE__ */ y("<span class=text-pink-600>*"), Ts = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Ps = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), Ds = /* @__PURE__ */ y("<div class=shrink-0>"), js = /* @__PURE__ */ y('<div class="grid md:grid-cols-3 border-b border-gray-300/[.50] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 md:col-span-2 flex items-start gap-2"><div class=flex-1><div class=cursor-pointer><div class="grid font-light text-sm col-span-2 content-start">'), Ks = /* @__PURE__ */ y('<div class="font-light text-sm py-2.5 px-4 flex items-start gap-3"><input class="appearance-none h-4 w-4 min-w-4 min-h-4 border border-gray-300 rounded bg-white mt-2.5 checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 bg-no-repeat bg-center bg-contain cursor-pointer"type=checkbox><input type=text class="flex-1 font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none">'), zs = /* @__PURE__ */ y('<div class="font-light text-sm py-2.5 px-4 flex items-start gap-3 cursor-pointer"><input class="appearance-none h-4 w-4 min-w-4 min-h-4 border border-gray-300 rounded bg-white mt-0.5 checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 bg-no-repeat bg-center bg-contain cursor-pointer checked:disabled:bg-gray-500 checked:dark:disabled:bg-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"type=checkbox><span class=flex-1>'), Fs = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), Bs = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Hs = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="flex-1 text-justify">');
const Us = (e) => {
  const [t] = it(), n = e.config, [i] = z(n.formMode > 1 ? !0 : e.component.disableInput);
  let r = (m, u, x) => {
    let $ = JSON.parse(JSON.stringify(e.value));
    if (e.value)
      if (e.value.some((S) => String(S.value) === String(m)))
        if (x) {
          let S = o().findIndex((_) => _.value == m);
          $ = $.filter((_) => _.value != m), o()[S].label !== u && $.push({
            value: m,
            label: u,
            open: !0
          });
        } else
          $ = $.filter((S) => S.value != m);
      else
        $.splice($.length, 0, {
          value: m,
          label: u
        });
    else
      $ = [], $.push({
        value: m,
        label: u
      });
    e.onValueChange($);
  }, a = (m) => {
    let u = "checkbox-" + e.component.dataKey + "-" + m;
    document.getElementById(u).click();
  }, s = (m) => e.value ? !!e.value.some((u) => String(u.value) === String(m)) : !1, l = (m) => {
    let u = e.value.findIndex((x) => String(x.value) === String(m));
    return e.value[u].label;
  }, c = Me(() => {
    if (e.component.sourceOption !== void 0 && e.component.typeOption === 3) {
      let m = e.component.sourceOption.split("@");
      const u = t.details.findIndex((x) => x.dataKey === m[0]);
      return t.details[u].type, t.details[u].answer;
    }
    return [];
  });
  const [o] = z(e.component.sourceOption !== void 0 ? c() : e.component.options), [d, f] = z(!1), w = () => {
    d() ? f(!1) : f(!0);
  }, [k] = z(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [C] = z(n.formMode > 2 && e.comments == 0);
  return (() => {
    var m = js(), u = m.firstChild, x = u.firstChild, $ = x.firstChild, S = x.nextSibling, _ = u.nextSibling, L = _.firstChild, V = L.firstChild, v = V.firstChild;
    return p(x, g(D, {
      get when() {
        return e.component.required;
      },
      get children() {
        return Vs();
      }
    }), null), p(x, g(D, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var h = Ts();
        return h.$$click = w, h;
      }
    }), null), p(S, g(D, {
      get when() {
        return d();
      },
      get children() {
        var h = Ps();
        return P(() => h.innerHTML = e.component.hint), h;
      }
    })), p(v, g(ce, {
      get each() {
        return o();
      },
      children: (h, b) => g(we, {
        get children() {
          return [g(te, {
            get when() {
              return _e(() => !!h.open)() && s(h.value);
            },
            get children() {
              var O = Ks(), E = O.firstChild, M = E.nextSibling;
              return E.addEventListener("change", (I) => r(I.currentTarget.value, h.label, h.open)), M.addEventListener("change", (I) => r(h.value, I.currentTarget.value, h.open)), P(() => U(E, "id", "checkbox-" + e.component.dataKey + "-" + b())), P(() => E.value = h.value), P(() => E.checked = h.value ? s(h.value) : !1), P(() => M.value = l(h.value)), O;
            }
          }), g(te, {
            get when() {
              return !h.open || !s(h.value);
            },
            get children() {
              var O = zs(), E = O.firstChild, M = E.nextSibling;
              return O.$$click = () => a(b()), E.addEventListener("change", (I) => r(I.currentTarget.value, h.label, h.open)), P((I) => {
                var A = i(), R = "checkbox-" + e.component.dataKey + "-" + b(), N = h.label;
                return A !== I.e && (E.disabled = I.e = A), R !== I.t && U(E, "id", I.t = R), N !== I.a && (M.innerHTML = I.a = N), I;
              }, {
                e: void 0,
                t: void 0,
                a: void 0
              }), P(() => E.value = h.value), P(() => E.checked = h.value ? s(h.value) : !1), O;
            }
          })];
        }
      })
    })), p(L, g(D, {
      get when() {
        var h;
        return ((h = e.validationMessage) == null ? void 0 : h.length) > 0;
      },
      get children() {
        return g(ce, {
          get each() {
            return e.validationMessage;
          },
          children: (h) => (() => {
            var b = Hs(), O = b.firstChild, E = O.firstChild;
            return p(O, g(we, {
              get children() {
                return [g(te, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return Fs();
                  }
                }), g(te, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return Bs();
                  }
                })];
              }
            }), E), E.innerHTML = h, P((M) => X(O, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, M)), b;
          })()
        });
      }
    }), null), p(_, g(D, {
      get when() {
        return k();
      },
      get children() {
        var h = Ds();
        return p(h, g(Re, {
          get disabled() {
            return C();
          },
          onClick: () => e.openRemark(e.component.dataKey),
          get comments() {
            return e.comments;
          }
        })), h;
      }
    }), null), P((h) => {
      var b = e.component.label, O = {
        " border-b border-orange-500 pb-3 ": e.classValidation === 1,
        " border-b border-pink-600 pb-3 ": e.classValidation === 2
      }, E = e.component.cols === 1 || e.component.cols === void 0, M = e.component.cols === 2, I = e.component.cols === 3, A = e.component.cols === 4, R = e.component.cols === 5;
      return b !== h.e && ($.innerHTML = h.e = b), h.t = X(V, O, h.t), E !== h.a && v.classList.toggle("grid-cols-1", h.a = E), M !== h.o && v.classList.toggle("grid-cols-2", h.o = M), I !== h.i && v.classList.toggle("grid-cols-3", h.i = I), A !== h.n && v.classList.toggle("grid-cols-4", h.n = A), R !== h.s && v.classList.toggle("grid-cols-5", h.s = R), h;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0,
      n: void 0,
      s: void 0
    }), m;
  })();
};
he(["click"]);
var Js = /* @__PURE__ */ y("<span class=text-pink-600>*"), Ws = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), qs = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), wi = /* @__PURE__ */ y('<textarea class="w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400">'), Gs = /* @__PURE__ */ y("<div class=shrink-0>"), Ys = /* @__PURE__ */ y('<div class="grid md:grid-cols-3 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 md:col-span-2 flex items-start gap-2"><div class=flex-1>'), Qs = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), Zs = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Xs = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="flex-1 text-justify">');
const eo = (e) => {
  const t = e.config, [n] = z(t.formMode > 1 ? !0 : e.component.disableInput), [i, r] = z(!1), a = () => {
    i() ? r(!1) : r(!0);
  }, [s] = z(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [l] = z(t.formMode > 2 && e.comments == 0);
  return (() => {
    var c = Ys(), o = c.firstChild, d = o.firstChild, f = d.firstChild, w = d.nextSibling, k = o.nextSibling, C = k.firstChild;
    return p(d, g(D, {
      get when() {
        return e.component.required;
      },
      get children() {
        return Js();
      }
    }), null), p(d, g(D, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var m = Ws();
        return m.$$click = a, m;
      }
    }), null), p(w, g(D, {
      get when() {
        return i();
      },
      get children() {
        var m = qs();
        return P(() => m.innerHTML = e.component.hint), m;
      }
    })), p(C, g(D, {
      get when() {
        return e.component.lengthInput === void 0;
      },
      get children() {
        var m = wi();
        return m.addEventListener("change", (u) => {
          e.onValueChange(u.currentTarget.value);
        }), P((u) => {
          var x = e.component.rows || 2, $ = {
            " border border-solid border-gray-300 ": e.classValidation === 0,
            " border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
            " border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
          }, S = n();
          return x !== u.e && U(m, "rows", u.e = x), u.t = X(m, $, u.t), S !== u.a && (m.disabled = u.a = S), u;
        }, {
          e: void 0,
          t: void 0,
          a: void 0
        }), P(() => m.value = e.value), m;
      }
    }), null), p(C, g(D, {
      get when() {
        return _e(() => e.component.lengthInput !== void 0)() && e.component.lengthInput.length > 0;
      },
      get children() {
        var m = wi();
        return m.addEventListener("change", (u) => {
          e.onValueChange(u.currentTarget.value);
        }), P((u) => {
          var x = e.component.rows || 2, $ = {
            " border border-solid border-gray-300 ": e.classValidation === 0,
            " border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
            " border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
          }, S = n(), _ = e.component.lengthInput[0].maxlength !== void 0 ? e.component.lengthInput[0].maxlength : "", L = e.component.lengthInput[0].minlength !== void 0 ? e.component.lengthInput[0].minlength : "";
          return x !== u.e && U(m, "rows", u.e = x), u.t = X(m, $, u.t), S !== u.a && (m.disabled = u.a = S), _ !== u.o && U(m, "maxlength", u.o = _), L !== u.i && U(m, "minlength", u.i = L), u;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0,
          i: void 0
        }), P(() => m.value = e.value), m;
      }
    }), null), p(C, g(D, {
      get when() {
        var m;
        return ((m = e.validationMessage) == null ? void 0 : m.length) > 0;
      },
      get children() {
        return g(ce, {
          get each() {
            return e.validationMessage;
          },
          children: (m) => (() => {
            var u = Xs(), x = u.firstChild, $ = x.firstChild;
            return p(x, g(we, {
              get children() {
                return [g(te, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return Qs();
                  }
                }), g(te, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return Zs();
                  }
                })];
              }
            }), $), $.innerHTML = m, P((S) => X(x, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, S)), u;
          })()
        });
      }
    }), null), p(k, g(D, {
      get when() {
        return s();
      },
      get children() {
        var m = Gs();
        return p(m, g(Re, {
          get disabled() {
            return l();
          },
          onClick: () => e.openRemark(e.component.dataKey),
          get comments() {
            return e.comments;
          }
        })), m;
      }
    }), null), P(() => f.innerHTML = e.component.label), c;
  })();
};
he(["click"]);
var to = /* @__PURE__ */ y("<span class=text-pink-600>*"), no = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), io = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), ro = /* @__PURE__ */ y("<div class=shrink-0>"), ao = /* @__PURE__ */ y('<div class="md:grid md:grid-cols-3 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 md:col-span-2 flex items-start gap-2"><div class=flex-1><input type=email placeholder>'), lo = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), so = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), oo = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="flex-1 text-justify">');
const Cr = (e) => {
  const t = e.config, [n] = z(t.formMode > 1 ? !0 : e.component.disableInput);
  let i = "w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400";
  const [r, a] = z(!1), s = () => {
    r() ? a(!1) : a(!0);
  }, [l] = z(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [c] = z(t.formMode > 2 && e.comments == 0);
  return (() => {
    var o = ao(), d = o.firstChild, f = d.firstChild, w = f.firstChild, k = f.nextSibling, C = d.nextSibling, m = C.firstChild, u = m.firstChild;
    return p(f, g(D, {
      get when() {
        return e.component.required;
      },
      get children() {
        return to();
      }
    }), null), p(f, g(D, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var x = no();
        return x.$$click = s, x;
      }
    }), null), p(k, g(D, {
      get when() {
        return r();
      },
      get children() {
        var x = io();
        return P(() => x.innerHTML = e.component.hint), x;
      }
    })), u.addEventListener("change", (x) => {
      e.onValueChange(x.currentTarget.value);
    }), p(m, g(D, {
      get when() {
        var x;
        return ((x = e.validationMessage) == null ? void 0 : x.length) > 0;
      },
      get children() {
        return g(ce, {
          get each() {
            return e.validationMessage;
          },
          children: (x) => (() => {
            var $ = oo(), S = $.firstChild, _ = S.firstChild;
            return p(S, g(we, {
              get children() {
                return [g(te, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return lo();
                  }
                }), g(te, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return so();
                  }
                })];
              }
            }), _), _.innerHTML = x, P((L) => X(S, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, L)), $;
          })()
        });
      }
    }), null), p(C, g(D, {
      get when() {
        return l();
      },
      get children() {
        var x = ro();
        return p(x, g(Re, {
          get disabled() {
            return c();
          },
          onClick: () => e.openRemark(e.component.dataKey),
          get comments() {
            return e.comments;
          }
        })), x;
      }
    }), null), P((x) => {
      var $ = e.component.label, S = e.component.dataKey, _ = i + e.classValidation, L = {
        " border border-solid border-gray-300 ": e.classValidation === 0,
        " border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
        " border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
      }, V = n();
      return $ !== x.e && (w.innerHTML = x.e = $), S !== x.t && U(u, "name", x.t = S), _ !== x.a && st(u, x.a = _), x.o = X(u, L, x.o), V !== x.i && (u.disabled = x.i = V), x;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0
    }), P(() => u.value = e.value), o;
  })();
};
he(["click"]);
var co = /* @__PURE__ */ y("<span class=text-pink-600>*"), uo = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), go = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), ho = /* @__PURE__ */ y("<div class=shrink-0>"), fo = /* @__PURE__ */ y('<div class="md:grid md:grid-cols-3 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 md:col-span-2 flex items-start gap-2"><div class=flex-1><input type=url class="w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"placeholder>'), mo = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), vo = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), bo = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="flex-1 text-justify">');
const Mr = (e) => {
  const t = e.config, [n] = z(t.formMode > 1 ? !0 : e.component.disableInput), [i, r] = z(!1), a = () => {
    i() ? r(!1) : r(!0);
  }, [s] = z(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [l] = z(t.formMode > 2 && e.comments == 0);
  return (() => {
    var c = fo(), o = c.firstChild, d = o.firstChild, f = d.firstChild, w = d.nextSibling, k = o.nextSibling, C = k.firstChild, m = C.firstChild;
    return p(d, g(D, {
      get when() {
        return e.component.required;
      },
      get children() {
        return co();
      }
    }), null), p(d, g(D, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var u = uo();
        return u.$$click = a, u;
      }
    }), null), p(w, g(D, {
      get when() {
        return i();
      },
      get children() {
        var u = go();
        return P(() => u.innerHTML = e.component.hint), u;
      }
    })), m.addEventListener("change", (u) => {
      e.onValueChange(u.currentTarget.value);
    }), p(C, g(D, {
      get when() {
        var u;
        return ((u = e.validationMessage) == null ? void 0 : u.length) > 0;
      },
      get children() {
        return g(ce, {
          get each() {
            return e.validationMessage;
          },
          children: (u) => (() => {
            var x = bo(), $ = x.firstChild, S = $.firstChild;
            return p($, g(we, {
              get children() {
                return [g(te, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return mo();
                  }
                }), g(te, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return vo();
                  }
                })];
              }
            }), S), S.innerHTML = u, P((_) => X($, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, _)), x;
          })()
        });
      }
    }), null), p(k, g(D, {
      get when() {
        return s();
      },
      get children() {
        var u = ho();
        return p(u, g(Re, {
          get disabled() {
            return l();
          },
          onClick: () => e.openRemark(e.component.dataKey),
          get comments() {
            return e.comments;
          }
        })), u;
      }
    }), null), P((u) => {
      var x = e.component.label, $ = e.component.dataKey, S = {
        " border border-solid border-gray-300 ": e.classValidation === 0,
        " border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
        " border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
      }, _ = n();
      return x !== u.e && (f.innerHTML = u.e = x), $ !== u.t && U(m, "name", u.t = $), u.a = X(m, S, u.a), _ !== u.o && (m.disabled = u.o = _), u;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0
    }), P(() => m.value = e.value), c;
  })();
};
he(["click"]);
var wo = /* @__PURE__ */ y("<span class=text-pink-600>*"), xo = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), yo = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), po = /* @__PURE__ */ y('<span class="absolute top-0 right-0 inline-flex items-center justify-center h-6 w-6 text-xs font-semibold text-white transform translate-x-1/2 -translate-y-1/4 bg-pink-600/80 rounded-full">'), ko = /* @__PURE__ */ y('<div class=shrink-0><button class="relative inline-block bg-white p-2 h-10 w-10 text-gray-500 rounded-full hover:bg-yellow-100 hover:text-yellow-400 hover:border-yellow-100 border-2 border-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z">'), $o = /* @__PURE__ */ y('<div class="md:grid md:grid-cols-3 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 md:col-span-2 flex items-start gap-2"><div class=flex-1><input type=date class="w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"placeholder>'), _o = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), So = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Co = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="flex-1 text-justify">');
const Mo = (e) => {
  const t = e.config, [n] = z(t.formMode > 1 ? !0 : e.component.disableInput), [i, r] = z(!1), a = () => {
    i() ? r(!1) : r(!0);
  }, [s] = z(t.formMode > 2 && e.comments == 0), [l] = z(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0);
  let c = /* @__PURE__ */ new Date(), o = String(c.getDate()), d = String(c.getMonth() + 1), f = String(c.getFullYear());
  Number(o) < 10 && (o = "0" + o), Number(d) < 10 && (d = "0" + d);
  let w = f + "-" + d + "-" + o, k, C;
  return Me(() => {
    e.component.rangeInput && (k = e.component.rangeInput[0].min !== void 0 ? e.component.rangeInput[0].min === "today" ? w : e.component.rangeInput[0].min : "", C = e.component.rangeInput[0].max !== void 0 ? e.component.rangeInput[0].max === "today" ? w : e.component.rangeInput[0].max : "");
  }), (() => {
    var m = $o(), u = m.firstChild, x = u.firstChild, $ = x.firstChild, S = x.nextSibling, _ = u.nextSibling, L = _.firstChild, V = L.firstChild;
    return p(x, g(D, {
      get when() {
        return e.component.required;
      },
      get children() {
        return wo();
      }
    }), null), p(x, g(D, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var v = xo();
        return v.$$click = a, v;
      }
    }), null), p(S, g(D, {
      get when() {
        return i();
      },
      get children() {
        var v = yo();
        return P(() => v.innerHTML = e.component.hint), v;
      }
    })), V.addEventListener("change", (v) => {
      e.onValueChange(v.currentTarget.value);
    }), U(V, "min", k), U(V, "max", C), p(L, g(D, {
      get when() {
        var v;
        return ((v = e.validationMessage) == null ? void 0 : v.length) > 0;
      },
      get children() {
        return g(ce, {
          get each() {
            return e.validationMessage;
          },
          children: (v) => (() => {
            var h = Co(), b = h.firstChild, O = b.firstChild;
            return p(b, g(we, {
              get children() {
                return [g(te, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return _o();
                  }
                }), g(te, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return So();
                  }
                })];
              }
            }), O), O.innerHTML = v, P((E) => X(b, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, E)), h;
          })()
        });
      }
    }), null), p(_, g(D, {
      get when() {
        return l();
      },
      get children() {
        var v = ko(), h = v.firstChild;
        return h.firstChild, h.$$click = (b) => e.openRemark(e.component.dataKey), p(h, g(D, {
          get when() {
            return _e(() => !!e.comments)() && e.comments > 0;
          },
          get children() {
            var b = po();
            return p(b, () => e.comments), b;
          }
        }), null), P(() => h.disabled = s()), v;
      }
    }), null), P((v) => {
      var h = e.component.label, b = e.component.dataKey, O = {
        " border border-solid border-gray-300 ": e.classValidation === 0,
        " border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
        " border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
      }, E = n();
      return h !== v.e && ($.innerHTML = v.e = h), b !== v.t && U(V, "name", v.t = b), v.a = X(V, O, v.a), E !== v.o && (V.disabled = v.o = E), v;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0
    }), P(() => V.value = e.value), m;
  })();
};
he(["click"]);
var Io = /* @__PURE__ */ y("<span class=text-pink-600>*"), Eo = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Lo = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), Oo = /* @__PURE__ */ y('<span class="absolute top-0 right-0 inline-flex items-center justify-center h-6 w-6 text-xs font-semibold text-white transform translate-x-1/2 -translate-y-1/4 bg-pink-600/80 rounded-full">'), Ao = /* @__PURE__ */ y('<div class=shrink-0><button class="relative inline-block bg-white p-2 h-10 w-10 text-gray-500 rounded-full hover:bg-yellow-100 hover:text-yellow-400 hover:border-yellow-100 border-2 border-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z">'), Ro = /* @__PURE__ */ y('<div class="md:grid md:grid-cols-3 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 md:col-span-2 flex items-start gap-2"><div class=flex-1><input type=datetime-local class="w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"placeholder>'), No = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), Vo = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), To = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="flex-1 text-justify">');
const Po = (e) => {
  const t = e.config, [n] = z(t.formMode > 1 ? !0 : e.component.disableInput), [i, r] = z(!1), a = () => {
    i() ? r(!1) : r(!0);
  }, [s] = z(t.formMode > 2 && e.comments == 0), [l] = z(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0);
  let c = /* @__PURE__ */ new Date(), o = String(c.getDate()), d = String(c.getMonth() + 1), f = String(c.getFullYear());
  Number(o) < 10 && (o = "0" + o), Number(d) < 10 && (d = "0" + d);
  let w = f + "-" + d + "-" + o, k, C;
  return Me(() => {
    e.component.rangeInput && (k = e.component.rangeInput[0].min !== void 0 ? e.component.rangeInput[0].min === "today" ? w : e.component.rangeInput[0].min : "", C = e.component.rangeInput[0].max !== void 0 ? e.component.rangeInput[0].max === "today" ? w : e.component.rangeInput[0].max : "");
  }), (() => {
    var m = Ro(), u = m.firstChild, x = u.firstChild, $ = x.firstChild, S = x.nextSibling, _ = u.nextSibling, L = _.firstChild, V = L.firstChild;
    return p(x, g(D, {
      get when() {
        return e.component.required;
      },
      get children() {
        return Io();
      }
    }), null), p(x, g(D, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var v = Eo();
        return v.$$click = a, v;
      }
    }), null), p(S, g(D, {
      get when() {
        return i();
      },
      get children() {
        var v = Lo();
        return P(() => v.innerHTML = e.component.hint), v;
      }
    })), V.addEventListener("change", (v) => {
      e.onValueChange(v.currentTarget.value);
    }), U(V, "min", k + "T00:00"), U(V, "max", C + "T23:59"), p(L, g(D, {
      get when() {
        var v;
        return ((v = e.validationMessage) == null ? void 0 : v.length) > 0;
      },
      get children() {
        return g(ce, {
          get each() {
            return e.validationMessage;
          },
          children: (v) => (() => {
            var h = To(), b = h.firstChild, O = b.firstChild;
            return p(b, g(we, {
              get children() {
                return [g(te, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return No();
                  }
                }), g(te, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return Vo();
                  }
                })];
              }
            }), O), O.innerHTML = v, P((E) => X(b, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, E)), h;
          })()
        });
      }
    }), null), p(_, g(D, {
      get when() {
        return l();
      },
      get children() {
        var v = Ao(), h = v.firstChild;
        return h.firstChild, h.$$click = (b) => e.openRemark(e.component.dataKey), p(h, g(D, {
          get when() {
            return _e(() => !!e.comments)() && e.comments > 0;
          },
          get children() {
            var b = Oo();
            return p(b, () => e.comments), b;
          }
        }), null), P(() => h.disabled = s()), v;
      }
    }), null), P((v) => {
      var h = e.component.label, b = e.component.dataKey, O = {
        " border border-solid border-gray-300 ": e.classValidation === 0,
        " border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
        " border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
      }, E = n();
      return h !== v.e && ($.innerHTML = v.e = h), b !== v.t && U(V, "name", v.t = b), v.a = X(V, O, v.a), E !== v.o && (V.disabled = v.o = E), v;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0
    }), P(() => V.value = e.value), m;
  })();
};
he(["click"]);
var Do = /* @__PURE__ */ y("<span class=text-pink-600>*"), jo = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Ko = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), zo = /* @__PURE__ */ y("<div class=shrink-0>"), Fo = /* @__PURE__ */ y('<div class="grid md:grid-cols-3 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 md:col-span-2 flex items-start gap-2"><div class=flex-1><input type=time class="w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"placeholder>'), Bo = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), Ho = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Uo = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="flex-1 text-justify">');
const Ir = (e) => {
  const t = e.config, [n] = z(t.formMode > 1 ? !0 : e.component.disableInput), [i, r] = z(!1), a = () => {
    i() ? r(!1) : r(!0);
  }, [s] = z(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [l] = z(t.formMode > 2 && e.comments == 0);
  return (() => {
    var c = Fo(), o = c.firstChild, d = o.firstChild, f = d.firstChild, w = d.nextSibling, k = o.nextSibling, C = k.firstChild, m = C.firstChild;
    return p(d, g(D, {
      get when() {
        return e.component.required;
      },
      get children() {
        return Do();
      }
    }), null), p(d, g(D, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var u = jo();
        return u.$$click = a, u;
      }
    }), null), p(w, g(D, {
      get when() {
        return i();
      },
      get children() {
        var u = Ko();
        return P(() => u.innerHTML = e.component.hint), u;
      }
    })), m.addEventListener("change", (u) => {
      e.onValueChange(u.currentTarget.value);
    }), p(C, g(D, {
      get when() {
        var u;
        return ((u = e.validationMessage) == null ? void 0 : u.length) > 0;
      },
      get children() {
        return g(ce, {
          get each() {
            return e.validationMessage;
          },
          children: (u) => (() => {
            var x = Uo(), $ = x.firstChild, S = $.firstChild;
            return p($, g(we, {
              get children() {
                return [g(te, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return Bo();
                  }
                }), g(te, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return Ho();
                  }
                })];
              }
            }), S), S.innerHTML = u, P((_) => X($, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, _)), x;
          })()
        });
      }
    }), null), p(k, g(D, {
      get when() {
        return s();
      },
      get children() {
        var u = zo();
        return p(u, g(Re, {
          get disabled() {
            return l();
          },
          onClick: () => e.openRemark(e.component.dataKey),
          get comments() {
            return e.comments;
          }
        })), u;
      }
    }), null), P((u) => {
      var x = e.component.label, $ = e.component.dataKey, S = {
        " border border-solid border-gray-300 ": e.classValidation === 0,
        " border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
        " border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
      }, _ = n();
      return x !== u.e && (f.innerHTML = u.e = x), $ !== u.t && U(m, "name", u.t = $), u.a = X(m, S, u.a), _ !== u.o && (m.disabled = u.o = _), u;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0
    }), P(() => m.value = e.value), c;
  })();
};
he(["click"]);
var Jo = /* @__PURE__ */ y("<span class=text-pink-600>*"), Wo = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), qo = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), Go = /* @__PURE__ */ y("<div class=shrink-0>"), Yo = /* @__PURE__ */ y('<div class="md:grid md:grid-cols-3 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 md:col-span-2 flex items-start gap-2"><div class=flex-1><input type=month class="w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"placeholder>'), Qo = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), Zo = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Xo = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="flex-1 text-justify">');
const Er = (e) => {
  const t = e.config, [n] = z(t.formMode > 1 ? !0 : e.component.disableInput), [i, r] = z(!1), a = () => {
    i() ? r(!1) : r(!0);
  }, [s] = z(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [l] = z(t.formMode > 2 && e.comments == 0);
  return (() => {
    var c = Yo(), o = c.firstChild, d = o.firstChild, f = d.firstChild, w = d.nextSibling, k = o.nextSibling, C = k.firstChild, m = C.firstChild;
    return p(d, g(D, {
      get when() {
        return e.component.required;
      },
      get children() {
        return Jo();
      }
    }), null), p(d, g(D, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var u = Wo();
        return u.$$click = a, u;
      }
    }), null), p(w, g(D, {
      get when() {
        return i();
      },
      get children() {
        var u = qo();
        return P(() => u.innerHTML = e.component.hint), u;
      }
    })), m.addEventListener("change", (u) => {
      e.onValueChange(u.currentTarget.value);
    }), p(C, g(D, {
      get when() {
        var u;
        return ((u = e.validationMessage) == null ? void 0 : u.length) > 0;
      },
      get children() {
        return g(ce, {
          get each() {
            return e.validationMessage;
          },
          children: (u) => (() => {
            var x = Xo(), $ = x.firstChild, S = $.firstChild;
            return p($, g(we, {
              get children() {
                return [g(te, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return Qo();
                  }
                }), g(te, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return Zo();
                  }
                })];
              }
            }), S), S.innerHTML = u, P((_) => X($, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, _)), x;
          })()
        });
      }
    }), null), p(k, g(D, {
      get when() {
        return s();
      },
      get children() {
        var u = Go();
        return p(u, g(Re, {
          get disabled() {
            return l();
          },
          onClick: () => e.openRemark(e.component.dataKey),
          get comments() {
            return e.comments;
          }
        })), u;
      }
    }), null), P((u) => {
      var x = e.component.label, $ = e.component.dataKey, S = {
        " border border-solid border-gray-300 ": e.classValidation === 0,
        " border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
        " border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
      }, _ = n();
      return x !== u.e && (f.innerHTML = u.e = x), $ !== u.t && U(m, "name", u.t = $), u.a = X(m, S, u.a), _ !== u.o && (m.disabled = u.o = _), u;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0
    }), P(() => m.value = e.value), c;
  })();
};
he(["click"]);
var ed = /* @__PURE__ */ y("<span class=text-pink-600>*"), td = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), nd = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), id = /* @__PURE__ */ y("<div class=shrink-0>"), rd = /* @__PURE__ */ y('<div class="md:grid md:grid-cols-3 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 md:col-span-2 flex items-start gap-2"><div class=flex-1><input type=week class="w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"placeholder>'), ad = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), ld = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), sd = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="flex-1 text-justify">');
const Lr = (e) => {
  const t = e.config, [n] = z(t.formMode > 1 ? !0 : e.component.disableInput), [i, r] = z(!1), a = () => {
    i() ? r(!1) : r(!0);
  }, [s] = z(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [l] = z(t.formMode > 2 && e.comments == 0);
  return (() => {
    var c = rd(), o = c.firstChild, d = o.firstChild, f = d.firstChild, w = d.nextSibling, k = o.nextSibling, C = k.firstChild, m = C.firstChild;
    return p(d, g(D, {
      get when() {
        return e.component.required;
      },
      get children() {
        return ed();
      }
    }), null), p(d, g(D, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var u = td();
        return u.$$click = a, u;
      }
    }), null), p(w, g(D, {
      get when() {
        return i();
      },
      get children() {
        var u = nd();
        return P(() => u.innerHTML = e.component.hint), u;
      }
    })), m.addEventListener("change", (u) => {
      e.onValueChange(u.currentTarget.value);
    }), p(C, g(D, {
      get when() {
        var u;
        return ((u = e.validationMessage) == null ? void 0 : u.length) > 0;
      },
      get children() {
        return g(ce, {
          get each() {
            return e.validationMessage;
          },
          children: (u) => (() => {
            var x = sd(), $ = x.firstChild, S = $.firstChild;
            return p($, g(we, {
              get children() {
                return [g(te, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return ad();
                  }
                }), g(te, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return ld();
                  }
                })];
              }
            }), S), S.innerHTML = u, P((_) => X($, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, _)), x;
          })()
        });
      }
    }), null), p(k, g(D, {
      get when() {
        return s();
      },
      get children() {
        var u = id();
        return p(u, g(Re, {
          get disabled() {
            return l();
          },
          onClick: () => e.openRemark(e.component.dataKey),
          get comments() {
            return e.comments;
          }
        })), u;
      }
    }), null), P((u) => {
      var x = e.component.label, $ = e.component.dataKey, S = {
        " border border-solid border-gray-300 ": e.classValidation === 0,
        " border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
        " border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
      }, _ = n();
      return x !== u.e && (f.innerHTML = u.e = x), $ !== u.t && U(m, "name", u.t = $), u.a = X(m, S, u.a), _ !== u.o && (m.disabled = u.o = _), u;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0
    }), P(() => m.value = e.value), c;
  })();
};
he(["click"]);
var od = /* @__PURE__ */ y("<span class=text-pink-600>*"), dd = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), cd = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), ud = /* @__PURE__ */ y('<div class="border-b border-gray-300/[.50] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm py-2.5 px-2"><div><div class="flex items-start gap-2"><input class="appearance-none h-5 w-5 min-w-5 min-h-5 border-2 mt-0.5 shrink-0 border-gray-300 rounded bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 bg-no-repeat bg-center bg-contain cursor-pointer"type=checkbox><div class=flex-1><div class="inline-flex space-x-2 flex-wrap"><div class=cursor-pointer></div></div></div></div><div class="flex mt-2 ml-7">'), gd = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), hd = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), fd = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class=text-justify>');
const Or = (e) => {
  const t = e.config, [n] = z(t.formMode > 1 ? !0 : e.component.disableInput), [i, r] = z(e.value !== "" ? e.value : !1), [a, s] = z(!1), l = () => {
    a() ? s(!1) : s(!0);
  };
  let c = () => {
    let o = "singlecheck-" + e.component.dataKey + "_id";
    document.getElementById(o).click();
  };
  return (() => {
    var o = ud(), d = o.firstChild, f = d.firstChild, w = f.firstChild, k = w.firstChild, C = k.nextSibling, m = C.firstChild, u = m.firstChild, x = w.nextSibling;
    return k.addEventListener("change", ($) => {
      r($.target.checked), e.onValueChange($.target.checked);
    }), u.$$click = ($) => c(), p(m, g(D, {
      get when() {
        return e.component.required;
      },
      get children() {
        return od();
      }
    }), null), p(m, g(D, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var $ = dd();
        return $.$$click = l, $;
      }
    }), null), p(x, g(D, {
      get when() {
        return a();
      },
      get children() {
        var $ = cd();
        return P(() => $.innerHTML = e.component.hint), $;
      }
    })), p(d, g(D, {
      get when() {
        var $;
        return (($ = e.validationMessage) == null ? void 0 : $.length) > 0;
      },
      get children() {
        return g(ce, {
          get each() {
            return e.validationMessage;
          },
          children: ($) => (() => {
            var S = fd(), _ = S.firstChild, L = _.firstChild;
            return p(_, g(we, {
              get children() {
                return [g(te, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return gd();
                  }
                }), g(te, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return hd();
                  }
                })];
              }
            }), L), L.innerHTML = $, P((V) => X(_, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, V)), S;
          })()
        });
      }
    }), null), P(($) => {
      var S = {
        " border-b border-orange-500 pb-3 ": e.classValidation === 1,
        " border-b border-pink-600 pb-3 ": e.classValidation === 2
      }, _ = "singlecheck-" + e.component.dataKey + "_id", L = n(), V = e.component.label;
      return $.e = X(f, S, $.e), _ !== $.t && U(k, "id", $.t = _), L !== $.a && (k.disabled = $.a = L), V !== $.o && (u.innerHTML = $.o = V), $;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0
    }), P(() => k.checked = i() === !0), o;
  })();
};
he(["click"]);
var md = /* @__PURE__ */ y("<span class=text-pink-600>*"), vd = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), bd = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), wd = /* @__PURE__ */ y('<div class="grid md:grid-cols-8 grid-cols-8 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2 col-span-7"><div><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div></div><div class="font-light text-sm space-x-2 py-2.5 px-2 flex justify-end"><button type=button class="relative inline-flex flex-shrink-0 h-7 w-12 border border-gray-300 rounded-full cursor-pointer shadow transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"><span class="relative inline-block h-6 w-6 ring-0 rounded-full transform bg-white shadow transition duration-200 ease-in-out pointer-events-none"><span class="absolute inset-0 h-full w-full flex justify-center items-center transition-opacity"><svg class="h-3 w-3 text-gray-400"fill=none viewBox="0 0 12 12"><path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round></path></svg></span><span class=" absolute inset-0 h-full w-full flex items-center justify-center transition-opacity "><svg class="h-3 w-3 text-blue-600"fill=currentColor viewBox="0 0 12 12"><path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z">'), xd = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), yd = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), pd = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="flex-1 text-justify">');
const Ar = (e) => {
  const t = e.config, [n] = z(t.formMode > 1 ? !0 : e.component.disableInput), [i, r] = z(e.value !== "" ? e.value : !1), [a, s] = z(!1), l = () => {
    a() ? s(!1) : s(!0);
  };
  let c = () => {
    let o = "toggle-" + e.component.dataKey + "_id";
    document.getElementById(o).click();
  };
  return (() => {
    var o = wd(), d = o.firstChild, f = d.firstChild, w = f.firstChild, k = w.firstChild, C = w.nextSibling, m = d.nextSibling, u = m.firstChild, x = u.firstChild, $ = x.firstChild, S = $.nextSibling;
    return k.$$click = (_) => c(), p(w, g(D, {
      get when() {
        return e.component.required;
      },
      get children() {
        return md();
      }
    }), null), p(w, g(D, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var _ = vd();
        return _.$$click = l, _;
      }
    }), null), p(C, g(D, {
      get when() {
        return a();
      },
      get children() {
        var _ = bd();
        return P(() => _.innerHTML = e.component.hint), _;
      }
    })), p(d, g(D, {
      get when() {
        var _;
        return ((_ = e.validationMessage) == null ? void 0 : _.length) > 0;
      },
      get children() {
        return g(ce, {
          get each() {
            return e.validationMessage;
          },
          children: (_) => (() => {
            var L = pd(), V = L.firstChild, v = V.firstChild;
            return p(V, g(we, {
              get children() {
                return [g(te, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return xd();
                  }
                }), g(te, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return yd();
                  }
                })];
              }
            }), v), v.innerHTML = _, P((h) => X(V, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, h)), L;
          })()
        });
      }
    }), null), u.$$click = (_) => {
      const L = !i();
      r(L), e.onValueChange(L);
    }, P((_) => {
      var L = {
        " border-b border-orange-500 pb-3 ": e.classValidation === 1,
        " border-b border-pink-600 pb-3 ": e.classValidation === 2
      }, V = e.component.label, v = i() === !0, h = i() === !1, b = "toggle-" + e.component.dataKey + "_id", O = n(), E = i() === !0, M = i() === !1, I = {
        "opacity-0 ease-out duration-100": i() === !0,
        "opacity-100 ease-in duration-200": i() === !1
      }, A = {
        "opacity-100 ease-in duration-200": i() === !0,
        "opacity-0 ease-out duration-100": i() === !1
      };
      return _.e = X(f, L, _.e), V !== _.t && (k.innerHTML = _.t = V), v !== _.a && u.classList.toggle("bg-blue-600", _.a = v), h !== _.o && u.classList.toggle("bg-gray-200", _.o = h), b !== _.i && U(u, "id", _.i = b), O !== _.n && (u.disabled = _.n = O), E !== _.s && x.classList.toggle("translate-x-5", _.s = E), M !== _.h && x.classList.toggle("translate-x-0", _.h = M), _.r = X($, I, _.r), _.d = X(S, A, _.d), _;
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
he(["click"]);
var kd = /* @__PURE__ */ y("<span class=text-pink-600>*"), $d = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), _d = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), Sd = /* @__PURE__ */ y("<div class=shrink-0>"), Cd = /* @__PURE__ */ y('<div class="md:grid md:grid-cols-3 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 md:col-span-2 flex items-start gap-2"><div class=flex-1><div class=" grid grid-cols-12"><div class=col-span-10><input type=range class="form-range w-full font-light px-2 text-sm text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"></div><div class="col-span-1 text-center">'), Md = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), Id = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Ed = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="flex-1 text-justify">');
const Ld = (e) => {
  const t = e.config, [n] = z(t.formMode > 1 ? !0 : e.component.disableInput), [i, r] = z(!1), a = () => {
    i() ? r(!1) : r(!0);
  }, [s] = z(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [l] = z(t.formMode > 2 && e.comments == 0);
  return (() => {
    var c = Cd(), o = c.firstChild, d = o.firstChild, f = d.firstChild, w = d.nextSibling, k = o.nextSibling, C = k.firstChild, m = C.firstChild, u = m.firstChild, x = u.firstChild, $ = u.nextSibling;
    return p(d, g(D, {
      get when() {
        return e.component.required;
      },
      get children() {
        return kd();
      }
    }), null), p(d, g(D, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var S = $d();
        return S.$$click = a, S;
      }
    }), null), p(w, g(D, {
      get when() {
        return i();
      },
      get children() {
        var S = _d();
        return P(() => S.innerHTML = e.component.hint), S;
      }
    })), x.addEventListener("change", (S) => e.onValueChange(S.currentTarget.value)), p($, () => e.value || 0), p(C, g(D, {
      get when() {
        var S;
        return ((S = e.validationMessage) == null ? void 0 : S.length) > 0;
      },
      get children() {
        return g(ce, {
          get each() {
            return e.validationMessage;
          },
          children: (S) => (() => {
            var _ = Ed(), L = _.firstChild, V = L.firstChild;
            return p(L, g(we, {
              get children() {
                return [g(te, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return Md();
                  }
                }), g(te, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return Id();
                  }
                })];
              }
            }), V), V.innerHTML = S, P((v) => X(L, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, v)), _;
          })()
        });
      }
    }), null), p(k, g(D, {
      get when() {
        return s();
      },
      get children() {
        var S = Sd();
        return p(S, g(Re, {
          get disabled() {
            return l();
          },
          onClick: () => e.openRemark(e.component.dataKey),
          get comments() {
            return e.comments;
          }
        })), S;
      }
    }), null), P((S) => {
      var _ = e.component.label, L = {
        " border-b border-orange-500 pb-5 ": e.classValidation === 1,
        " border-b border-pink-600 pb-5 ": e.classValidation === 2
      }, V = e.component.rangeInput[0].min, v = e.component.rangeInput[0].max, h = e.component.rangeInput[0].step, b = n();
      return _ !== S.e && (f.innerHTML = S.e = _), S.t = X(m, L, S.t), V !== S.a && U(x, "min", S.a = V), v !== S.o && U(x, "max", S.o = v), h !== S.i && U(x, "step", S.i = h), b !== S.n && (x.disabled = S.n = b), S;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0,
      n: void 0
    }), P(() => x.value = e.value || 0), c;
  })();
};
he(["click"]);
var Od = /* @__PURE__ */ y("<div>");
const Rr = (e) => {
  let t;
  return zn(() => {
    if (t) {
      const n = t.attachShadow({
        mode: "open"
      });
      document.querySelectorAll('style, link[rel="stylesheet"]').forEach((a) => {
        n.appendChild(a.cloneNode(!0));
      });
      const r = document.createElement("div");
      r.innerHTML = e.component.label, n.appendChild(r);
    }
  }), (() => {
    var n = Od(), i = t;
    return typeof i == "function" ? nt(i, n) : t = n, n;
  })();
};
function Ad(e, t) {
  let n;
  const i = () => clearTimeout(n);
  return _t(i), Object.assign(function(...a) {
    n !== void 0 && i(), n = setTimeout(() => e(...a), t);
  }, { clear: i });
}
var Wn = Ad, Rd = /* @__PURE__ */ y("<span class=text-pink-600>*"), Nd = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Vd = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), Td = /* @__PURE__ */ y("<div class=shrink-0>"), Pd = /* @__PURE__ */ y('<div class="grid md:grid-cols-3 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 md:col-span-2 flex items-start gap-2"><div class=flex-1><input type=text class="w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"placeholder>'), Dd = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), jd = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Kd = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="flex-1 text-justify">');
const zd = (e) => {
  const t = e.config, [n] = z(t.formMode > 1 ? !0 : e.component.disableInput);
  let i = (w) => {
    let k = String.fromCharCode(w.charCode ? w.charCode : w.which), C = e.component.separatorFormat === "id-ID" ? /^\d{1,99}(?:\,\d{0,10})?$/ : /^\d{1,99}(?:\.\d{0,10})?$/, m = document.getElementById("currencyInput" + e.index).value, u = a(m);
    C.test(u + k) || (w.preventDefault ? w.preventDefault() : w.returnValue = !1);
  }, r = Wn((w) => {
    let k = a(w), C = e.component.separatorFormat === "id-ID" ? k.replace(",", ".") : k;
    e.onValueChange(C);
  }, 1500), a = (w) => {
    let k, C;
    return e.component.separatorFormat === "id-ID" ? (k = e.component.isDecimal ? w.indexOf(",00") != -1 ? w.substring(0, w.indexOf(",00")) : w : w.indexOf(",") != -1 ? w.substring(0, w.indexOf(",")) : w, C = "0123456789,") : e.component.separatorFormat === "en-US" && (k = e.component.isDecimal ? w.indexOf(".00") != -1 ? w.substring(0, w.indexOf(".00")) : w : w.indexOf(".") != -1 ? w.substring(0, w.indexOf(".")) : w, C = "0123456789."), Array.from(k).filter((m) => C.includes(m)).join("");
  }, s = Number(e.value).toLocaleString(e.component.separatorFormat, {
    style: "currency",
    currency: e.component.currency,
    minimumFractionDigits: 0
  });
  const [l, c] = z(!1), o = () => {
    l() ? c(!1) : c(!0);
  }, [d] = z(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [f] = z(t.formMode > 2 && e.comments == 0);
  return (() => {
    var w = Pd(), k = w.firstChild, C = k.firstChild, m = C.firstChild, u = C.nextSibling, x = k.nextSibling, $ = x.firstChild, S = $.firstChild;
    return p(C, g(D, {
      get when() {
        return e.component.required;
      },
      get children() {
        return Rd();
      }
    }), null), p(C, g(D, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var _ = Nd();
        return _.$$click = o, _;
      }
    }), null), p(u, g(D, {
      get when() {
        return l();
      },
      get children() {
        var _ = Vd();
        return P(() => _.innerHTML = e.component.hint), _;
      }
    })), S.$$keyup = (_) => r(_.currentTarget.value), S.addEventListener("keypress", (_) => i(_)), p($, g(D, {
      get when() {
        var _;
        return ((_ = e.validationMessage) == null ? void 0 : _.length) > 0;
      },
      get children() {
        return g(ce, {
          get each() {
            return e.validationMessage;
          },
          children: (_) => (() => {
            var L = Kd(), V = L.firstChild, v = V.firstChild;
            return p(V, g(we, {
              get children() {
                return [g(te, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return Dd();
                  }
                }), g(te, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return jd();
                  }
                })];
              }
            }), v), v.innerHTML = _, P((h) => X(V, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, h)), L;
          })()
        });
      }
    }), null), p(x, g(D, {
      get when() {
        return d();
      },
      get children() {
        var _ = Td();
        return p(_, g(Re, {
          get disabled() {
            return f();
          },
          onClick: () => e.openRemark(e.component.dataKey),
          get comments() {
            return e.comments;
          }
        })), _;
      }
    }), null), P((_) => {
      var L = e.component.label, V = e.component.dataKey, v = {
        " border border-solid border-gray-300 ": e.classValidation === 0,
        " border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
        " border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
      }, h = n(), b = "currencyInput" + e.index, O = e.component.rangeInput && e.component.rangeInput[0].max !== void 0 ? e.component.rangeInput[0].max : "", E = e.component.rangeInput && e.component.rangeInput[0].min !== void 0 ? e.component.rangeInput[0].min : "";
      return L !== _.e && (m.innerHTML = _.e = L), V !== _.t && U(S, "name", _.t = V), _.a = X(S, v, _.a), h !== _.o && (S.disabled = _.o = h), b !== _.i && U(S, "id", _.i = b), O !== _.n && U(S, "max", _.n = O), E !== _.s && U(S, "min", _.s = E), _;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0,
      n: void 0,
      s: void 0
    }), P(() => S.value = e.component.separatorFormat === "id-ID" ? s.replace(",00", "") : s.replace("IDR", "Rp")), w;
  })();
};
he(["click", "keyup"]);
var Fd = /* @__PURE__ */ y('<div class="modal-delete fixed z-10 inset-0 overflow-y-auto"aria-labelledby=modal-title role=dialog aria-modal=true><div class="flex items-center justify-center min-h-screen pt-4 px-4 text-center sm:block sm:p-0"><div class="fixed inset-0 bg-gray-500/75 transition-opacity"aria-hidden=true></div><span class="hidden sm:inline-block sm:align-middle sm:h-screen"aria-hidden=true>&#8203;</span><div class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"><div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4"><div class="sm:flex sm:items-start"><div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"><svg class="h-6 w-6 text-red-600"xmlns=http://www.w3.org/2000/svg fill=none viewBox="0 0 24 24"stroke=currentColor aria-hidden=true><path stroke-linecap=round stroke-linejoin=round stroke-width=2 d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg></div><div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left"><h3 class="text-lg leading-6 font-medium text-gray-900"id=titleModalDelete>Deactivate account</h3><div class=mt-2><p class="text-sm text-gray-500"id=contentModalDelete>Are you sure you want to deactivate your account? All of your data will be permanently removed. This action cannot be undonssse.</p></div></div></div></div><div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"><button type=button class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">Delete</button><button type=button class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Cancel'), Bd = /* @__PURE__ */ y("<span class=text-pink-600>*"), Hd = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Ud = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), Jd = /* @__PURE__ */ y('<div class="grid grid-cols-12 "><div class="col-span-10 mr-2"><input type=text class="w-full font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"></div><div class="col-span-2 flex justify-evenly p-1 space-x-1 "><button class="bg-teal-400 text-white p-2 rounded-full focus:outline-none hover:bg-teal-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"viewBox="0 0 20 20"fill=currentColor><path fill-rule=evenodd d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"clip-rule=evenodd></path></svg></button><button class="bg-gray-500 text-white p-2 rounded-full focus:outline-none hover:bg-gray-400 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"viewBox="0 0 20 20"fill=currentColor><path fill-rule=evenodd d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"clip-rule=evenodd>'), Wd = /* @__PURE__ */ y('<div><div class="grid grid-cols-6 p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2 col-span-5"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm space-x-2 pt-2.5 px-2 flex justify-end "><button class="bg-pink-600 text-white p-2 rounded-full focus:outline-none h-10 w-10 hover:bg-pink-500 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-6 w-6"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 4v16m8-8H4"></path></svg></button></div></div><div class="grid md:grid-cols-12 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm pb-2.5 px-2 col-start-2 col-end-12 space-y-4 transition-all delay-100"></div><div class=col-span-12></div><div class="col-span-12 pb-4">'), qd = /* @__PURE__ */ y('<div class="grid grid-cols-12"><div class="col-span-10 mr-2"><input type=text class="w-full font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"></div><div class="col-span-2 flex justify-evenly p-1 space-x-1 "><button class="bg-teal-400 text-white p-2 rounded-full focus:outline-none hover:bg-teal-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"viewBox="0 0 20 20"fill=currentColor><path fill-rule=evenodd d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"clip-rule=evenodd></path></svg></button><button class="bg-gray-500 text-white p-2 rounded-full focus:outline-none hover:bg-gray-400 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"viewBox="0 0 20 20"fill=currentColor><path fill-rule=evenodd d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"clip-rule=evenodd>'), Gd = /* @__PURE__ */ y('<div class="grid grid-cols-12"><div class="col-span-10 mr-2"><input type=text class="w-full font-light px-4 py-2.5 text-sm text-gray-700 bg-gray-200 bg-clip-padding dark:bg-gray-300 border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"disabled></div><div class="col-span-2 flex justify-evenly p-1 space-x-1 "><button class="bg-orange-400 text-white p-2 rounded-full focus:outline-none hover:bg-orange-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"viewBox="0 0 20 20"fill=currentColor><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg></button><button class="bg-red-600 text-white p-2 rounded-full focus:outline-none hover:bg-red-500 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"viewBox="0 0 20 20"fill=currentColor><path fill-rule=evenodd d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"clip-rule=evenodd>'), Yd = /* @__PURE__ */ y('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), Qd = /* @__PURE__ */ y('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Zd = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="grid grid-cols-12"><div class="col-span-11 text-justify mr-1">');
const Nr = (e) => {
  const [t] = rt(), [n, i] = z(0), [r, a] = z(0), [s, l] = z(JSON.parse(JSON.stringify(e.value))), [c, o] = z(""), d = e.config, [f] = z(d.formMode > 1 ? !0 : e.component.disableInput);
  let w = Me(() => {
    const v = e.value[0].label.split("#");
    return Number(v[1]);
  }), k = () => {
    n() === 0 && r() === 0 ? (i(1), a(0)) : Ke(t.details.language[0].componentNotAllowed);
  }, C = (v) => {
    n() === 0 && r() === 0 ? (i(1), a(v)) : Ke(t.details.language[0].componentNotAllowed);
  }, m = (v) => {
    i(0), a(0), o("");
  }, u = (v) => {
    if (n() === 0 && r() === 0)
      i(2), a(v), S();
    else if (n() === 1)
      Ke("Only 1 component is allowed to edit");
    else if (n() === 2) {
      let h = JSON.parse(JSON.stringify(s())), b = h.findIndex((O) => O.value == v);
      h.splice(b, 1), e.onValueChange(h), Ke(t.details.language[0].componentDeleted), i(0), a(0);
    }
  }, x = (v) => {
    if (c() !== "") {
      let h = JSON.parse(JSON.stringify(s()));
      if (r() === 0)
        h = [...h, {
          value: v,
          label: c()
        }], h[0].label = "lastId#" + v;
      else {
        let b = h.findIndex((O) => O.value == v);
        h[b].label = c();
      }
      e.onValueChange(h), r() === 0 ? Ke(t.details.language[0].componentAdded) : Ke(t.details.language[0].componentEdited), i(0), a(0);
    } else
      r() === 0 ? Ke(t.details.language[0].componentEmpty) : (i(0), a(0));
  }, $ = (v) => {
    o(v.target.value.trim());
  };
  const S = () => {
    let v = document.querySelector("#titleModalDelete"), h = document.querySelector("#contentModalDelete");
    v.innerHTML = e.component.titleModalDelete !== void 0 ? e.component.titleModalDelete : "Confirm Delete?", h.innerHTML = e.component.contentModalDelete !== void 0 ? e.component.contentModalDelete : "Deletion will also delete related components, including child components from this parent.";
  }, [_, L] = z(!1), V = () => {
    _() ? L(!1) : L(!0);
  };
  return (() => {
    var v = Wd(), h = v.firstChild, b = h.firstChild, O = b.firstChild, E = O.firstChild, M = O.nextSibling, I = b.nextSibling, A = I.firstChild, R = h.nextSibling, N = R.firstChild, K = N.nextSibling, H = K.nextSibling;
    return p(v, g(D, {
      get when() {
        return n() == 2;
      },
      get children() {
        var T = Fd(), j = T.firstChild, F = j.firstChild, J = F.nextSibling, B = J.nextSibling, Z = B.firstChild, G = Z.nextSibling, ne = G.firstChild, ae = ne.nextSibling;
        return ne.$$click = (Q) => u(r()), ae.$$click = (Q) => m(r()), T;
      }
    }), h), p(O, g(D, {
      get when() {
        return e.component.required;
      },
      get children() {
        return Bd();
      }
    }), null), p(O, g(D, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var T = Hd();
        return T.$$click = V, T;
      }
    }), null), p(M, g(D, {
      get when() {
        return _();
      },
      get children() {
        var T = Ud();
        return P(() => T.innerHTML = e.component.hint), T;
      }
    })), A.$$click = (T) => k(), p(N, g(ce, {
      get each() {
        return s();
      },
      children: (T, j) => g(we, {
        get children() {
          return [g(te, {
            get when() {
              return _e(() => Number(T.value) > 0)() && Number(T.value) === r();
            },
            get children() {
              var F = qd(), J = F.firstChild, B = J.firstChild, Z = J.nextSibling, G = Z.firstChild, ne = G.nextSibling;
              return B.addEventListener("change", (ae) => $(ae)), G.$$click = (ae) => x(Number(T.value)), ne.$$click = (ae) => m(Number(T.value)), P((ae) => {
                var Q = e.component.dataKey + "_input_" + Number(T.value), Y = f(), W = f();
                return Q !== ae.e && U(B, "id", ae.e = Q), Y !== ae.t && (G.disabled = ae.t = Y), W !== ae.a && (ne.disabled = ae.a = W), ae;
              }, {
                e: void 0,
                t: void 0,
                a: void 0
              }), P(() => B.value = T.label), F;
            }
          }), g(te, {
            get when() {
              return _e(() => Number(T.value) > 0)() && Number(T.value) !== r();
            },
            get children() {
              var F = Gd(), J = F.firstChild, B = J.firstChild, Z = J.nextSibling, G = Z.firstChild, ne = G.nextSibling;
              return G.$$click = (ae) => C(Number(T.value)), ne.$$click = (ae) => u(Number(T.value)), P((ae) => {
                var Q = e.component.dataKey + "_input_" + Number(T.value), Y = f(), W = f();
                return Q !== ae.e && U(B, "id", ae.e = Q), Y !== ae.t && (G.disabled = ae.t = Y), W !== ae.a && (ne.disabled = ae.a = W), ae;
              }, {
                e: void 0,
                t: void 0,
                a: void 0
              }), P(() => B.value = T.label), F;
            }
          })];
        }
      })
    }), null), p(N, g(D, {
      get when() {
        return _e(() => n() == 1)() && r() == 0;
      },
      get children() {
        var T = Jd(), j = T.firstChild, F = j.firstChild, J = j.nextSibling, B = J.firstChild, Z = B.nextSibling;
        return F.addEventListener("change", (G) => $(G)), B.$$click = (G) => x(w() + 1), Z.$$click = (G) => m(w() + 1), P((G) => {
          var ne = e.component.dataKey + "_input_" + (w() + 1), ae = f(), Q = f();
          return ne !== G.e && U(F, "id", G.e = ne), ae !== G.t && (B.disabled = G.t = ae), Q !== G.a && (Z.disabled = G.a = Q), G;
        }, {
          e: void 0,
          t: void 0,
          a: void 0
        }), T;
      }
    }), null), p(H, g(D, {
      get when() {
        var T;
        return ((T = e.validationMessage) == null ? void 0 : T.length) > 0;
      },
      get children() {
        return g(ce, {
          get each() {
            return e.validationMessage;
          },
          children: (T) => (() => {
            var j = Zd(), F = j.firstChild, J = F.firstChild;
            return p(F, g(we, {
              get children() {
                return [g(te, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return Yd();
                  }
                }), g(te, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return Qd();
                  }
                })];
              }
            }), J), J.innerHTML = T, P((B) => X(F, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, B)), j;
          })()
        });
      }
    })), P((T) => {
      var j = e.component.label, F = f(), J = {
        " border-b border-orange-500 pb-3 ": e.classValidation === 1,
        " border-b border-pink-600 pb-3 ": e.classValidation === 2
      };
      return j !== T.e && (E.innerHTML = T.e = j), F !== T.t && (A.disabled = T.t = F), T.a = X(K, J, T.a), T;
    }, {
      e: void 0,
      t: void 0,
      a: void 0
    }), v;
  })();
};
he(["click"]);
var Xd = /* @__PURE__ */ y('<div class="modal-delete fixed z-10 inset-0 overflow-y-auto"aria-labelledby=modal-title role=dialog aria-modal=true><div class="flex items-center justify-center min-h-screen pt-4 px-4 text-center sm:block sm:p-0"><div class="fixed inset-0 bg-gray-500/75 transition-opacity"aria-hidden=true></div><span class="hidden sm:inline-block sm:align-middle sm:h-screen"aria-hidden=true>&#8203;</span><div class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"><div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4"><div class="sm:flex sm:items-start"><div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"><svg class="h-6 w-6 text-red-600"xmlns=http://www.w3.org/2000/svg fill=none viewBox="0 0 24 24"stroke=currentColor aria-hidden=true><path stroke-linecap=round stroke-linejoin=round stroke-width=2 d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg></div><div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left"><h3 class="text-lg leading-6 font-medium text-gray-900"id=titleModalDelete>Deactivate account</h3><div class=mt-2><p class="text-sm text-gray-500"id=contentModalDelete>Are you sure you want to deactivate your account? All of your data will be permanently removed. This action cannot be undone.</p></div></div></div></div><div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"><button type=button class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">Delete</button><button type=button class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Cancel'), ec = /* @__PURE__ */ y("<span class=text-pink-600>*"), tc = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), nc = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), ic = /* @__PURE__ */ y('<div class="font-light text-sm space-x-2 pt-2.5 px-2 flex justify-end"><button class="bg-pink-600 text-white p-2 rounded-full focus:outline-none h-10 w-10 hover:bg-pink-500 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-6 w-6"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 4v16m8-8H4">'), rc = /* @__PURE__ */ y('<div class="grid grid-cols-12 "><div class="col-span-10 mr-2"></div><div class="col-span-2 flex justify-evenly p-1 space-x-1 "><button class="bg-teal-400 text-white p-2 rounded-full focus:outline-none hover:bg-teal-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"viewBox="0 0 20 20"fill=currentColor><path fill-rule=evenodd d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"clip-rule=evenodd></path></svg></button><button class="bg-gray-500 text-white p-2 rounded-full focus:outline-none hover:bg-gray-400 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"viewBox="0 0 20 20"fill=currentColor><path fill-rule=evenodd d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"clip-rule=evenodd>'), ac = /* @__PURE__ */ y('<div><div class="grid grid-cols-6 p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2 col-span-5"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div></div><div class="grid md:grid-cols-12 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm pb-2.5 px-2 col-start-2 col-end-12 space-y-4"></div><div class=col-span-12></div><div class="col-span-12 pb-4">'), lc = /* @__PURE__ */ y('<div class="grid grid-cols-12"><div class="col-span-10 mr-2"></div><div class="col-span-2 flex justify-evenly p-1 space-x-1 "><button class="bg-teal-400 text-white p-2 rounded-full focus:outline-none hover:bg-teal-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"viewBox="0 0 20 20"fill=currentColor><path fill-rule=evenodd d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"clip-rule=evenodd></path></svg></button><button class="bg-gray-500 text-white p-2 rounded-full focus:outline-none hover:bg-gray-400 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"viewBox="0 0 20 20"fill=currentColor><path fill-rule=evenodd d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"clip-rule=evenodd>'), sc = /* @__PURE__ */ y('<div class="grid grid-cols-12"><div class="col-span-10 mr-2"><input type=text class="w-full font-light px-4 py-2.5 text-sm text-gray-700 bg-gray-200 bg-clip-padding dark:bg-gray-300 border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"disabled></div><div class="col-span-2 flex justify-evenly p-1 space-x-1 "><button class="bg-orange-400 text-white p-2 rounded-full focus:outline-none hover:bg-orange-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"viewBox="0 0 20 20"fill=currentColor><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg></button><button class="bg-red-600 text-white p-2 rounded-full focus:outline-none hover:bg-red-500 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"viewBox="0 0 20 20"fill=currentColor><path fill-rule=evenodd d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"clip-rule=evenodd>'), oc = /* @__PURE__ */ y('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), dc = /* @__PURE__ */ y('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), cc = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="grid grid-cols-12"><div class="col-span-11 text-justify mr-1">');
const Vr = (e) => {
  const [t] = it(), [n] = rt(), [i, r] = z(0), [a, s] = z(0), [l, c] = z(JSON.parse(JSON.stringify(e.value))), [o, d] = z({
    value: 0,
    label: ""
  }), [f, w] = z(!1), k = e.config, [C, m] = z(k.formMode > 1 ? !0 : e.component.disableInput);
  let u = Me(() => 0), x, $;
  switch (e.component.typeOption) {
    case 1: {
      try {
        $ = Me(() => {
          let I = JSON.parse(JSON.stringify(e.component.options));
          const A = l().length;
          let R = 0;
          for (l()[0] !== void 0 && (R = l()[0].value == 0 ? 1 : 0), R; R < A; R++)
            if (a() === 0 || a() !== Number(l()[R].value)) {
              let N = I.findIndex((K) => K.value == l()[R].value);
              I.splice(N, 1);
            }
          return I;
        });
      } catch (I) {
        w(!0), me(n.details.language[0].fetchFailed);
      }
      break;
    }
    case 2: {
      try {
        if (k.lookupMode === 1) {
          let I = e.component.sourceAPI[0], A = `${I.baseUrl}`;
          if (I.filterDependencies !== void 0 && I.filterDependencies.length > 0) {
            let H, T, j = A;
            H = I.filterDependencies.map((F, J) => {
              let B = F.sourceAnswer.split("@"), Z = t.details.find((G) => G.dataKey == B[0]);
              if (Z.answer) {
                const G = Z.answer;
                if (G.length > 0) {
                  let ne = encodeURI(G[G.length - 1].value);
                  T = `${F.params}=${ne}`;
                }
              } else
                m(!0);
              return T;
            }).join("&"), A = `${j}?${H}`;
          }
          if (I.subResourceDependencies !== void 0 && I.subResourceDependencies.length > 0) {
            let H, T, j = A;
            H = I.subResourceDependencies.map((F, J) => {
              let B = F.sourceAnswer.split("@"), Z = t.details.find((G) => G.dataKey == B[0]);
              if (Z.answer) {
                const G = Z.answer;
                G.length > 0 && (T = `${encodeURI(G[G.length - 1].value)}/${F.params}`);
              } else
                m(!0);
              return T;
            }).join("/"), A = `${j}/${H}`;
          }
          const R = {
            headers: I.headers,
            method: "GET"
          }, N = (H) => de(null, null, function* () {
            return yield fetch(H, R).catch((T) => ({
              success: !1,
              data: {},
              message: "500"
            })).then((T) => de(null, null, function* () {
              if (T.status === 200) {
                let j = yield T.json(), F = new Object();
                return F.success = !0, F.data = I.data !== "" ? j[I.data] : j, F.message = j.msg, F;
              } else
                return {
                  success: !1,
                  data: {},
                  message: T.status
                };
            })).then((T) => T);
          }), [K] = Ut(() => A, N);
          $ = Me(() => {
            if (K())
              if (!K().success)
                w(!0), me(n.details.language[0].fetchFailed);
              else {
                let H = [];
                K().data.map((F, J) => {
                  H.push({
                    value: F[I.value],
                    label: F[I.label]
                  });
                }), x = H;
                const T = l().length;
                let j = 0;
                for (l()[0] !== void 0 && (j = l()[0].value == 0 ? 1 : 0), j; j < T; j++)
                  if (a() === 0 || a() !== Number(l()[j].value)) {
                    let F = x.findIndex((J) => J.value == l()[j].value);
                    x.splice(F, 1);
                  }
                return x;
              }
          });
        } else if (k.lookupMode === 2) {
          let I, A = [];
          I = e.component.sourceSelect;
          let R = I[0].id, N = I[0].version;
          I[0].parentCondition.length > 0 && I[0].parentCondition.map((T, j) => {
            let F = T.value.split("@"), J = t.details.find((B) => B.dataKey == F[0]);
            if (J.answer) {
              const B = J.answer;
              if (B.length > 0) {
                let Z = B[B.length - 1].value.toString();
                A.push({
                  key: T.key,
                  value: Z
                });
              }
            }
          });
          let K = (T) => {
            $ = Me(() => {
              if (!T.success)
                w(!0), me(n.details.language[0].fetchFailed);
              else {
                let j = [];
                if (T.data.length > 0) {
                  let F = I[0].value, J = I[0].desc;
                  T.data.map((G, ne) => {
                    j.push({
                      value: G[F],
                      label: G[J]
                    });
                  }), x = j;
                  const B = l().length;
                  let Z = 0;
                  for (l()[0] !== void 0 && (Z = l()[0].value == 0 ? 1 : 0), Z; Z < B; Z++)
                    if (a() === 0 || a() !== Number(l()[Z].value)) {
                      let G = x.findIndex((ne) => ne.value == l()[Z].value);
                      x.splice(G, 1);
                    }
                  return x;
                }
              }
            });
          };
          const H = e.MobileOfflineSearch(R, N, A, K);
        }
      } catch (I) {
        w(!0), me(n.details.language[0].fetchFailed);
      }
      break;
    }
    case 3: {
      try {
        $ = Me(() => {
          let I = e.component.sourceOption !== void 0 ? [] : JSON.parse(JSON.stringify(e.component.options));
          if (e.component.sourceOption !== void 0) {
            const N = t.details.findIndex((K) => K.dataKey === e.component.sourceOption);
            t.details[N].type, t.details[N].answer ? I = JSON.parse(JSON.stringify(t.details[N].answer)) : I = [];
          }
          const A = l().length;
          let R = 0;
          for (l()[0] !== void 0 && (R = l()[0].value == 0 ? 1 : 0), R; R < A; R++)
            if (a() === 0 || a() !== Number(l()[R].value)) {
              let N = I.findIndex((K) => K.value == l()[R].value);
              I.splice(N, 1);
            }
          return I;
        });
      } catch (I) {
        w(!0), me(n.details.language[0].fetchFailed);
      }
      break;
    }
    default: {
      try {
        $ = Me(() => {
          let I;
          if (e.component.options) {
            I = JSON.parse(JSON.stringify(e.component.options));
            const A = l().length;
            let R = 0;
            for (l()[0] !== void 0 && (R = l()[0].value == 0 ? 1 : 0), R; R < A; R++)
              if (a() === 0 || a() !== Number(l()[R].value)) {
                let N = I.findIndex((K) => K.value == l()[R].value);
                I.splice(N, 1);
              }
          } else
            I = [];
          return I;
        });
      } catch (I) {
        w(!0), me(n.details.language[0].fetchFailed);
      }
      break;
    }
  }
  let S = () => {
    i() === 0 && a() === 0 ? (r(1), s(0)) : Ke(n.details.language[0].componentNotAllowed);
  }, _ = (I) => {
    i() === 0 && a() === 0 ? (r(1), s(I)) : Ke(n.details.language[0].componentNotAllowed);
  }, L = (I) => {
    r(0), s(0), d({
      value: 0,
      label: ""
    });
  }, V = (I) => {
    if (i() === 0 && a() === 0)
      r(2), s(I), b();
    else if (i() === 1)
      Ke(n.details.language[0].componentNotAllowed);
    else if (i() === 2) {
      let A = JSON.parse(JSON.stringify(l())), R = A.findIndex((N) => N.value == I);
      A.splice(R, 1), e.onValueChange(A), Ke(n.details.language[0].componentDeleted), r(0), s(0);
    }
  }, v = (I) => {
    if (o().value !== 0) {
      let A = JSON.parse(JSON.stringify(l()));
      if (a() === 0)
        A.length == 0 && (A = [...A, {
          label: "lastId#0",
          value: "0"
        }]), A = [...A, o()];
      else {
        let R = A.findIndex((N) => N.value == I);
        A.splice(R, 1, o());
      }
      e.onValueChange(A), a() === 0 ? Ke(n.details.language[0].componentAdded) : Ke(n.details.language[0].componentEdited), r(0), s(0);
    } else
      a() === 0 ? Ke(n.details.language[0].componentEmpty) : (r(0), s(0));
  }, h = (I) => {
    d(I);
  };
  const b = () => {
    let I = document.querySelector("#titleModalDelete"), A = document.querySelector("#contentModalDelete");
    I.innerHTML = e.component.titleModalDelete !== void 0 ? e.component.titleModalDelete : "Confirm Delete?", A.innerHTML = e.component.contentModalDelete !== void 0 ? e.component.contentModalDelete : "Deletion will also delete related components, including child components from this parent.";
  }, [O, E] = z(!1), M = () => {
    O() ? E(!1) : E(!0);
  };
  return (() => {
    var I = ac(), A = I.firstChild, R = A.firstChild, N = R.firstChild, K = N.firstChild, H = N.nextSibling, T = A.nextSibling, j = T.firstChild, F = j.nextSibling, J = F.nextSibling;
    return p(I, g(D, {
      get when() {
        return i() == 2;
      },
      get children() {
        var B = Xd(), Z = B.firstChild, G = Z.firstChild, ne = G.nextSibling, ae = ne.nextSibling, Q = ae.firstChild, Y = Q.nextSibling, W = Y.firstChild, q = W.nextSibling;
        return W.$$click = (le) => V(a()), q.$$click = (le) => L(a()), B;
      }
    }), A), p(N, g(D, {
      get when() {
        return e.component.required;
      },
      get children() {
        return ec();
      }
    }), null), p(N, g(D, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var B = tc();
        return B.$$click = M, B;
      }
    }), null), p(H, g(D, {
      get when() {
        return O();
      },
      get children() {
        var B = nc();
        return P(() => B.innerHTML = e.component.hint), B;
      }
    })), p(A, g(D, {
      get when() {
        return !f();
      },
      get children() {
        var B = ic(), Z = B.firstChild;
        return Z.$$click = (G) => S(), P(() => Z.disabled = C()), B;
      }
    }), null), p(j, g(ce, {
      get each() {
        return l();
      },
      children: (B, Z) => g(we, {
        get children() {
          return [g(te, {
            get when() {
              return _e(() => Number(B.value) > 0)() && Number(B.value) === a();
            },
            get children() {
              var G = lc(), ne = G.firstChild, ae = ne.nextSibling, Q = ae.firstChild, Y = Q.nextSibling;
              return p(ne, g(At, et({
                class: "formgear-select w-full rounded font-light text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-0 border-transparent focus:outline-none"
              }, () => Ot($(), {
                key: "label",
                filterable: !0
              }), {
                onChange: (W) => h(W),
                initialValue: B
              }))), Q.$$click = (W) => v(Number(B.value)), Y.$$click = (W) => L(Number(B.value)), P((W) => {
                var q = C(), le = C();
                return q !== W.e && (Q.disabled = W.e = q), le !== W.t && (Y.disabled = W.t = le), W;
              }, {
                e: void 0,
                t: void 0
              }), G;
            }
          }), g(te, {
            get when() {
              return _e(() => Number(B.value) > 0)() && Number(B.value) !== a();
            },
            get children() {
              var G = sc(), ne = G.firstChild, ae = ne.firstChild, Q = ne.nextSibling, Y = Q.firstChild, W = Y.nextSibling;
              return Y.$$click = (q) => _(Number(B.value)), W.$$click = (q) => V(Number(B.value)), P((q) => {
                var le = e.component.dataKey + "_input_" + Number(B.value), re = C(), fe = C();
                return le !== q.e && U(ae, "id", q.e = le), re !== q.t && (Y.disabled = q.t = re), fe !== q.a && (W.disabled = q.a = fe), q;
              }, {
                e: void 0,
                t: void 0,
                a: void 0
              }), P(() => ae.value = B.label), G;
            }
          })];
        }
      })
    }), null), p(j, g(D, {
      get when() {
        return _e(() => i() == 1)() && a() == 0;
      },
      get children() {
        var B = rc(), Z = B.firstChild, G = Z.nextSibling, ne = G.firstChild, ae = ne.nextSibling;
        return p(Z, g(At, et({
          class: "formgear-select w-full rounded font-light text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-0 border-transparent focus:outline-none"
        }, () => Ot($(), {
          key: "label",
          filterable: !0
        }), {
          onChange: (Q) => h(Q)
        }))), ne.$$click = (Q) => v(u()), ae.$$click = (Q) => L(u()), P((Q) => {
          var Y = C(), W = C();
          return Y !== Q.e && (ne.disabled = Q.e = Y), W !== Q.t && (ae.disabled = Q.t = W), Q;
        }, {
          e: void 0,
          t: void 0
        }), B;
      }
    }), null), p(J, g(D, {
      get when() {
        var B;
        return ((B = e.validationMessage) == null ? void 0 : B.length) > 0;
      },
      get children() {
        return g(ce, {
          get each() {
            return e.validationMessage;
          },
          children: (B) => (() => {
            var Z = cc(), G = Z.firstChild, ne = G.firstChild;
            return p(G, g(we, {
              get children() {
                return [g(te, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return oc();
                  }
                }), g(te, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return dc();
                  }
                })];
              }
            }), ne), ne.innerHTML = B, P((ae) => X(G, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, ae)), Z;
          })()
        });
      }
    })), P((B) => {
      var Z = e.component.label, G = {
        " border-b border-orange-500 pb-3 ": e.classValidation === 1,
        " border-b border-pink-600 pb-3 ": e.classValidation === 2
      };
      return Z !== B.e && (K.innerHTML = B.e = Z), B.t = X(F, G, B.t), B;
    }, {
      e: void 0,
      t: void 0
    }), I;
  })();
};
he(["click"]);
var uc = /* @__PURE__ */ y("<span class=text-pink-600>*"), gc = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), hc = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), fc = /* @__PURE__ */ y("<div class=shrink-0>"), mc = /* @__PURE__ */ y('<div class="grid md:grid-cols-3 border-b border-gray-300/[.50] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 md:col-span-2 flex items-start gap-2"><div class=flex-1><div>'), vc = /* @__PURE__ */ y('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), bc = /* @__PURE__ */ y('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), wc = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="grid grid-cols-12"><div class="col-span-11 text-justify mr-1">');
const xc = (e) => {
  const [t] = it(), [n] = rt(), [i, r] = z([]), a = e.config, [s, l] = z(a.formMode > 1 ? !0 : e.component.disableInput);
  let c;
  switch (e.component.typeOption) {
    case 1: {
      try {
        c = JSON.parse(JSON.stringify(e.component.options)), $e(() => {
          r(c);
        });
      } catch (m) {
        me(n.details.language[0].fetchFailed);
      }
      break;
    }
    case 2: {
      try {
        if (a.lookupMode === 1) {
          let m = e.component.sourceAPI[0], u = `${m.baseUrl}`;
          if (m.filterDependencies !== void 0 && m.filterDependencies.length > 0) {
            let L, V, v = u;
            L = m.filterDependencies.map((h, b) => {
              let O = h.sourceAnswer.split("@"), E = t.details.find((M) => M.dataKey == O[0]);
              if (E.answer) {
                const M = E.answer;
                if (M.length > 0) {
                  let I = encodeURI(M[M.length - 1].value);
                  V = `${h.params}=${I}`;
                }
              } else
                l(!0);
              return V;
            }).join("&"), u = `${v}?${L}`;
          }
          if (m.subResourceDependencies !== void 0 && m.subResourceDependencies.length > 0) {
            let L, V, v = u;
            L = m.subResourceDependencies.map((h, b) => {
              let O = h.sourceAnswer.split("@"), E = t.details.find((M) => M.dataKey == O[0]);
              if (E.answer) {
                const M = E.answer;
                M.length > 0 && (V = `${encodeURI(M[M.length - 1].value)}/${h.params}`);
              } else
                l(!0);
              return V;
            }).join("/"), u = `${v}/${L}`;
          }
          const x = {
            headers: m.headers,
            method: "GET"
          }, $ = (L) => de(null, null, function* () {
            return yield fetch(L, x).catch((V) => ({
              success: !1,
              data: {},
              message: "500"
            })).then((V) => de(null, null, function* () {
              if (V.status === 200) {
                let v = yield V.json(), h = new Object();
                return h.success = !0, h.data = m.data !== "" ? v[m.data] : v, h.message = v.msg, h;
              } else
                return {
                  success: !1,
                  data: {},
                  message: V.status
                };
            })).then((V) => V);
          }), [S] = Ut(() => u, $);
          let _ = e.value && e.value != "" ? e.value[0].value : "";
          $e(() => {
            if (S())
              if (!S().success)
                me(n.details.language[0].fetchFailed);
              else {
                let L = [];
                S().data.map((V, v) => {
                  L.push({
                    value: V[m.value],
                    label: V[m.label]
                  });
                }), r(L);
              }
          });
        } else if (a.lookupMode === 2) {
          let m, u = [];
          m = e.component.sourceSelect;
          let x = m[0].id, $ = m[0].version;
          m[0].parentCondition.length > 0 && m[0].parentCondition.map((L, V) => {
            let v = L.value.split("@"), h = t.details.find((b) => b.dataKey == v[0]);
            if (h.answer) {
              const b = h.answer;
              if (b.length > 0) {
                let O = b[b.length - 1].value.toString();
                u.push({
                  key: L.key,
                  value: O
                });
              }
            }
          });
          let S = (L) => {
            if (!L.success)
              me(n.details.language[0].fetchFailed);
            else {
              let V = [];
              if (L.data.length > 0) {
                let v = m[0].value, h = m[0].desc;
                L.data.map((b, O) => {
                  V.push({
                    value: b[v],
                    label: b[h]
                  });
                }), r(V);
              }
            }
          };
          const _ = e.MobileOfflineSearch(x, $, u, S);
        }
      } catch (m) {
        me(n.details.language[0].fetchFailed);
      }
      break;
    }
    case 3: {
      try {
        if (c = e.component.sourceOption !== void 0 ? [] : JSON.parse(JSON.stringify(e.component.options)), e.component.sourceOption !== void 0) {
          let m = e.component.sourceOption.split("@");
          const u = t.details.findIndex((x) => x.dataKey === m[0]);
          t.details[u].type, t.details[u].answer ? c = JSON.parse(JSON.stringify(t.details[u].answer)) : c = [];
        }
        $e(() => {
          r(c);
        });
      } catch (m) {
        me(n.details.language[0].fetchFailed);
      }
      break;
    }
    default: {
      try {
        let m;
        e.component.options ? m = JSON.parse(JSON.stringify(e.component.options)) : m = [], $e(() => {
          r(m);
        });
      } catch (m) {
        me(n.details.language[0].fetchFailed);
      }
      break;
    }
  }
  let o = (m) => {
    if (m != "" && m != null && Array.isArray(m)) {
      let u = JSON.parse(JSON.stringify(e.value));
      if (e.value.length > m.length)
        u = m;
      else {
        let x = m[m.length - 1];
        e.value ? u.push({
          value: x.value,
          label: x.label
        }) : (u = [], u.push({
          value: x.value,
          label: x.label
        }));
      }
      e.onValueChange(u);
    } else {
      let u = JSON.parse(JSON.stringify(e.value));
      u = [], e.onValueChange(u);
    }
  };
  const [d, f] = z(!1), w = () => {
    d() ? f(!1) : f(!0);
  }, [k] = z(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [C] = z(a.formMode > 2 && e.comments == 0);
  return (() => {
    var m = mc(), u = m.firstChild, x = u.firstChild, $ = x.firstChild, S = x.nextSibling, _ = u.nextSibling, L = _.firstChild, V = L.firstChild;
    return p(x, g(D, {
      get when() {
        return e.component.required;
      },
      get children() {
        return uc();
      }
    }), null), p(x, g(D, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var v = gc();
        return v.$$click = w, v;
      }
    }), null), p(S, g(D, {
      get when() {
        return d();
      },
      get children() {
        var v = hc();
        return P(() => v.innerHTML = e.component.hint), v;
      }
    })), p(V, g(At, et({
      multiple: !0,
      class: "formgear-select w-full rounded font-light text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-0 border-transparent focus:outline-none  disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
    }, () => Ot(e.value == "" ? i : i().filter((v) => !e.value.some((h) => h.value == v.value)), {
      key: "label",
      filterable: !0
    }), {
      get disabled() {
        return s();
      },
      onChange: (v) => o(v),
      get initialValue() {
        return e.value;
      }
    }))), p(L, g(D, {
      get when() {
        var v;
        return ((v = e.validationMessage) == null ? void 0 : v.length) > 0;
      },
      get children() {
        return g(ce, {
          get each() {
            return e.validationMessage;
          },
          children: (v) => (() => {
            var h = wc(), b = h.firstChild, O = b.firstChild;
            return p(b, g(we, {
              get children() {
                return [g(te, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return vc();
                  }
                }), g(te, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return bc();
                  }
                })];
              }
            }), O), O.innerHTML = v, P((E) => X(b, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, E)), h;
          })()
        });
      }
    }), null), p(_, g(D, {
      get when() {
        return k();
      },
      get children() {
        var v = fc();
        return p(v, g(Re, {
          get disabled() {
            return C();
          },
          onClick: () => e.openRemark(e.component.dataKey),
          get comments() {
            return e.comments;
          }
        })), v;
      }
    }), null), P((v) => {
      var h = e.component.label, b = {
        " border rounded border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
        " border rounded border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
      };
      return h !== v.e && ($.innerHTML = v.e = h), v.t = X(V, b, v.t), v;
    }, {
      e: void 0,
      t: void 0
    }), m;
  })();
};
he(["click"]);
var yc = (e) => [...e].map((t) => ({
  9: /\d/,
  a: /[a-z]/i,
  "*": /\w/
})[t] || t), pc = (e) => (t, n) => {
  let i = 0;
  return e.forEach((r) => {
    if (!(t.length < i + 1)) {
      if (typeof r == "string")
        t.slice(i).indexOf(r) !== 0 && (t = t.slice(0, i) + r + t.slice(i), n[0] > i && (n[0] += r.length), n[1] > i && (n[1] += r.length)), i += r.length;
      else if (r instanceof RegExp) {
        const a = t.slice(i).match(r);
        if (!a || a.index === void 0) {
          t = t.slice(0, i);
          return;
        } else a.index > 0 && (t = t.slice(0, i) + t.slice(i + a.index), i -= a.index - 1, n[0] > i && (n[0] -= a.index), n[1] > i && (n[1] -= a.index));
        i += a[0].length;
      }
    }
  }), [t.slice(0, i), n];
}, kc = (e) => typeof e == "function" ? e : pc(Array.isArray(e) ? e : yc(e)), Sn = (e) => {
  const t = kc(e);
  return (i) => {
    const r = i.currentTarget || i.target, [a, s] = t(r.value, [
      r.selectionStart || r.value.length,
      r.selectionEnd || r.value.length
    ]);
    return r.value = a, r.setSelectionRange(...s), a;
  };
}, $c = /* @__PURE__ */ y("<span class=text-pink-600>*"), _c = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Sc = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), Cc = /* @__PURE__ */ y("<div class=shrink-0>"), Mc = /* @__PURE__ */ y('<div class="md:grid md:grid-cols-3 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 md:col-span-2 flex items-start gap-2"><div class=flex-1><input type=text class="w-full border-gray-300 rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400">'), Ic = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), Ec = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Lc = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="flex-1 text-justify">');
const Oc = (e) => {
  const t = e.config, [n] = z(t.formMode > 1 ? !0 : e.component.disableInput), i = Sn(e.component.maskingFormat), a = {
    ref: void 0
  };
  let s = (w) => {
    e.onValueChange(w);
  };
  $e(() => {
    document.getElementById("inputMask" + e.component.dataKey).click();
  });
  const [l, c] = z(!1), o = () => {
    l() ? c(!1) : c(!0);
  }, [d] = z(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [f] = z(t.formMode > 2 && e.comments == 0);
  return (() => {
    var w = Mc(), k = w.firstChild, C = k.firstChild, m = C.firstChild, u = C.nextSibling, x = k.nextSibling, $ = x.firstChild, S = $.firstChild;
    p(C, g(D, {
      get when() {
        return e.component.required;
      },
      get children() {
        return $c();
      }
    }), null), p(C, g(D, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var L = _c();
        return L.$$click = o, L;
      }
    }), null), p(u, g(D, {
      get when() {
        return l();
      },
      get children() {
        var L = Sc();
        return P(() => L.innerHTML = e.component.hint), L;
      }
    })), S.addEventListener("paste", () => i({
      currentTarget: a.ref
    })), Te(S, "input", i, !0), S.$$click = () => i({
      currentTarget: a.ref
    }), S.addEventListener("change", (L) => s(L.currentTarget.value));
    var _ = a.ref;
    return typeof _ == "function" ? nt(_, S) : a.ref = S, p($, g(D, {
      get when() {
        var L;
        return ((L = e.validationMessage) == null ? void 0 : L.length) > 0;
      },
      get children() {
        return g(ce, {
          get each() {
            return e.validationMessage;
          },
          children: (L) => (() => {
            var V = Lc(), v = V.firstChild, h = v.firstChild;
            return p(v, g(we, {
              get children() {
                return [g(te, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return Ic();
                  }
                }), g(te, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return Ec();
                  }
                })];
              }
            }), h), h.innerHTML = L, P((b) => X(v, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, b)), V;
          })()
        });
      }
    }), null), p(x, g(D, {
      get when() {
        return d();
      },
      get children() {
        var L = Cc();
        return p(L, g(Re, {
          get disabled() {
            return f();
          },
          onClick: () => e.openRemark(e.component.dataKey),
          get comments() {
            return e.comments;
          }
        })), L;
      }
    }), null), P((L) => {
      var V = e.component.label, v = "inputMask" + e.component.dataKey, h = e.component.maskingFormat.replace(/[a]/g, "__").replace(/[9]/g, "#"), b = n();
      return V !== L.e && (m.innerHTML = L.e = V), v !== L.t && U(S, "id", L.t = v), h !== L.a && U(S, "placeholder", L.a = h), b !== L.o && (S.disabled = L.o = b), L;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0
    }), P(() => S.value = e.value), w;
  })();
};
he(["click", "input"]);
var xi = /* @__PURE__ */ y('<input type=text class="w-full font-light px-4 py-2.5 text-sm text-gray-700 bg-gray-200 bg-clip-padding dark:bg-gray-300 border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"disabled>'), Ac = /* @__PURE__ */ y("<small>"), Rc = /* @__PURE__ */ y('<div class="grid space-y-4">'), Nc = /* @__PURE__ */ y('<div class="grid md:grid-cols-3 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-x-2 py-2.5 px-2"><div></div></div><div class="font-light text-sm space-x-2 py-2.5 px-2 md:col-span-2">');
const Tr = (e) => {
  const t = e.config, [n] = z(t.formMode > 1 ? !0 : e.component.disableInput), [i, r] = z(e.value);
  return $e(() => {
    r(e.value);
  }), g(D, {
    get when() {
      return e.component.render;
    },
    get children() {
      var a = Nc(), s = a.firstChild, l = s.firstChild, c = s.nextSibling;
      return p(c, g(we, {
        get children() {
          return [g(te, {
            get when() {
              return _e(() => !!e.component.render)() && e.component.renderType <= 1;
            },
            get children() {
              return [(() => {
                var o = xi();
                return P(() => U(o, "name", e.component.dataKey)), P(() => o.value = e.value), o;
              })(), (() => {
                var o = Ac();
                return p(o, () => e.validationMessage), o;
              })()];
            }
          }), g(te, {
            get when() {
              return _e(() => !!e.component.render)() && e.component.renderType === 2;
            },
            get children() {
              var o = Rc();
              return p(o, g(ce, {
                get each() {
                  return e.value;
                },
                children: (d, f) => (() => {
                  var w = xi();
                  return P(() => w.value = d.label), w;
                })()
              })), o;
            }
          })];
        }
      })), P(() => l.innerHTML = e.component.label), a;
    }
  });
};
var Vc = /* @__PURE__ */ y("<button type=button>");
const Tc = {
  pink: "hover:bg-pink-200    hover:text-pink-400    hover:border-pink-200",
  teal: "hover:bg-teal-200    hover:text-teal-400    hover:border-teal-200",
  sky: "hover:bg-sky-200     hover:text-sky-400     hover:border-sky-200",
  amber: "hover:bg-amber-100   hover:text-amber-400   hover:border-amber-100",
  fuchsia: "hover:bg-fuchsia-200 hover:text-fuchsia-400 hover:border-fuchsia-200"
}, je = (e) => {
  const [t, n] = Bn(e, ["color", "class", "children"]);
  return (() => {
    var i = Vc();
    return Hn(i, et({
      get class() {
        var r, a;
        return ["bg-white dark:bg-gray-800 text-gray-500 p-2 rounded-full focus:outline-none", "h-10 w-10 border-2 border-gray-300", "disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400", Tc[(r = t.color) != null ? r : "pink"], (a = t.class) != null ? a : ""].join(" ");
      }
    }, n), !1, !0), p(i, () => t.children), i;
  })();
};
var Pc = /* @__PURE__ */ y("<span class=text-pink-600>*"), Dc = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), jc = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), Kc = /* @__PURE__ */ y("<input class=hidden>"), yi = /* @__PURE__ */ y('<svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z">'), zc = /* @__PURE__ */ y('<input type=file accept=image/* class="hidden w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"style=color:transparent>'), Fc = /* @__PURE__ */ y('<div class="font-light text-sm space-x-2 py-2.5 px-2 col-span-12 space-y-4"><div class=preview-class><div class="container mx-auto"><img class=rounded-md style=width:100%;height:100%>'), Bc = /* @__PURE__ */ y('<div><div class="grid grid-cols-12 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2 col-span-11"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm space-x-2 py-2.5 px-2 space-y-4 flex justify-end -mt-2"></div><div class=col-span-12></div><div class="col-span-12 pb-4">'), Hc = /* @__PURE__ */ y('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), Uc = /* @__PURE__ */ y('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Jc = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="grid grid-cols-12"><div class="col-span-11 text-justify mr-1">');
const Wc = (e) => {
  const [t] = rt(), [n, i] = z(""), [r, a] = z("");
  let s = new FileReader();
  const l = e.config, [c] = z(l.formMode > 1 ? !0 : e.component.disableInput);
  $e(() => {
    if (i(e.component.label), e.value[0]) {
      let $ = e.value[0].value;
      a($);
    }
  });
  let o = (S) => {
    var S = JSON.parse(S);
    let _ = JSON.parse(JSON.stringify(e.value));
    _ = [], _.push({
      value: S.image,
      label: S.label,
      type: S.type
    }), e.onValueChange(_), tt("Image uploaded successfully!");
  }, d = ($) => {
    o($);
  }, f = () => {
    e.MobileUploadHandler(d);
  }, w = ($) => {
    let S = JSON.parse(JSON.stringify(e.value));
    if ($.target.files && $.target.files[0]) {
      var _ = ["jpeg", "jpg", "png", "gif"];
      let L = $.target.files[0], V = L.name.split(".").pop().toLowerCase();
      _.includes(V) ? (s.readAsDataURL(L), s.onload = (v) => {
        var h = L.name;
        S = [], URL.createObjectURL(L), S.push({
          value: v.target.result,
          label: h,
          type: $.target.files[0].type
        }), e.onValueChange(S), tt("Image uploaded successfully!");
      }) : me("Please submit the appropriate format!");
    }
  };
  const [k, C] = z(!1), m = () => {
    k() ? C(!1) : C(!0);
  }, [u] = z(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [x] = z(l.formMode > 2 && e.comments == 0);
  return (() => {
    var $ = Bc(), S = $.firstChild, _ = S.firstChild, L = _.firstChild, V = L.firstChild, v = L.nextSibling, h = _.nextSibling, b = h.nextSibling, O = b.nextSibling;
    return p(L, g(D, {
      get when() {
        return e.component.required;
      },
      get children() {
        return Pc();
      }
    }), null), p(L, g(D, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var E = Dc();
        return E.$$click = m, E;
      }
    }), null), p(v, g(D, {
      get when() {
        return k();
      },
      get children() {
        var E = jc();
        return P(() => E.innerHTML = e.component.hint), E;
      }
    })), p(h, g(we, {
      get children() {
        return [g(te, {
          get when() {
            return l.clientMode == 2;
          },
          get children() {
            return [Kc(), g(je, {
              color: "pink",
              get disabled() {
                return c();
              },
              onClick: () => f(),
              get children() {
                return yi();
              }
            })];
          }
        }), g(te, {
          get when() {
            return l.clientMode == 1;
          },
          get children() {
            return [(() => {
              var E = zc();
              return E.addEventListener("change", (M) => {
                w(M);
              }), P((M) => {
                var I = "inputFile_" + e.component.dataKey, A = e.component.dataKey;
                return I !== M.e && U(E, "id", M.e = I), A !== M.t && U(E, "name", M.t = A), M;
              }, {
                e: void 0,
                t: void 0
              }), E;
            })(), g(je, {
              color: "pink",
              get disabled() {
                return c();
              },
              onClick: (E) => {
                document.getElementById("inputFile_" + e.component.dataKey).click();
              },
              get title() {
                return t.details.language[0].uploadImage;
              },
              get children() {
                return yi();
              }
            })];
          }
        })];
      }
    }), null), p(h, g(D, {
      get when() {
        return u();
      },
      get children() {
        return g(Re, {
          get disabled() {
            return x();
          },
          onClick: () => e.openRemark(e.component.dataKey),
          get comments() {
            return e.comments;
          }
        });
      }
    }), null), p(S, g(D, {
      get when() {
        return r() != "";
      },
      get children() {
        var E = Fc(), M = E.firstChild, I = M.firstChild, A = I.firstChild;
        return P((R) => {
          var N = r(), K = "img-preview" + e.component.dataKey;
          return N !== R.e && U(A, "src", R.e = N), K !== R.t && U(A, "id", R.t = K), R;
        }, {
          e: void 0,
          t: void 0
        }), E;
      }
    }), b), p(O, g(D, {
      get when() {
        var E;
        return ((E = e.validationMessage) == null ? void 0 : E.length) > 0;
      },
      get children() {
        return g(ce, {
          get each() {
            return e.validationMessage;
          },
          children: (E) => (() => {
            var M = Jc(), I = M.firstChild, A = I.firstChild;
            return p(I, g(we, {
              get children() {
                return [g(te, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return Hc();
                  }
                }), g(te, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return Uc();
                  }
                })];
              }
            }), A), A.innerHTML = E, P((R) => X(I, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, R)), M;
          })()
        });
      }
    })), P((E) => {
      var M = e.component.label, I = {
        " border-b border-orange-500 pb-3 ": e.classValidation === 1,
        " border-b border-pink-600 pb-3 ": e.classValidation === 2
      };
      return M !== E.e && (V.innerHTML = E.e = M), E.t = X(b, I, E.t), E;
    }, {
      e: void 0,
      t: void 0
    }), $;
  })();
};
he(["click"]);
var qc = /* @__PURE__ */ y("<span class=text-pink-600>*"), Gc = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Yc = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), pi = /* @__PURE__ */ y('<svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7">'), ki = /* @__PURE__ */ y('<svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap=round stroke-linejoin=round d="M15 11a3 3 0 11-6 0 3 3 0 016 0z">'), Qc = /* @__PURE__ */ y('<div class="font-light text-sm space-x-2 py-2.5 px-2 space-y-4"><div class=preview-class><div class="container mx-auto space-y-3"><iframe class="border-2 rounded-md mb-2"style=width:100%;height:100%;pointer-events:none></iframe><span class="bg-red-100 text-red-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-800"></span><span class="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">'), Zc = /* @__PURE__ */ y('<div><div class="border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="flex items-start gap-2"><div class="font-light text-sm space-y-2 py-2.5 px-2 flex-1"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 flex items-center gap-2 shrink-0"></div></div><div></div><div class=pb-4>'), Xc = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), eu = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), tu = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="text-justify mr-1">');
const Pr = (e) => {
  const [t] = rt(), [n, i] = z(""), [r, a] = z(""), [s, l] = z({
    latitude: null,
    longitude: null
  }), c = e.config, [o] = z(c.formMode > 1 ? !0 : e.component.disableInput);
  $e(() => {
    if (i(e.component.label), e.value[0]) {
      let $ = e.value[0].value, S = `https://maps.google.com/maps?q=${$.latitude},${$.longitude}&output=embed`;
      a(S), l({
        latitude: $.latitude,
        longitude: $.longitude
      });
    }
  });
  let d = ($) => {
    let S = JSON.parse(JSON.stringify(e.value));
    S = [];
    let _;
    $.coordinat && (_ = `https://maps.google.com/maps?q=${$.coordinat.latitude},${$.coordinat.longitude}&output=embed`, a(_)), Ke(t.details.language[0].locationAcquired), S.push({
      value: {
        latitude: $.coordinat.latitude,
        longitude: $.coordinat.longitude
      },
      label: _
    }), S.push({
      label: "map",
      value: _
    }), S.push({
      label: "latitude",
      value: $.coordinat.latitude
    }), S.push({
      label: "longitude",
      value: $.coordinat.longitude
    }), e.onValueChange(S);
  }, f = () => {
    e.MobileGpsHandler(d);
  }, w = () => {
    var $ = {
      enableHighAccuracy: !0,
      timeout: 5e3,
      maximumAge: 0
    };
    function S(L) {
      if (L.coords, L.coords) {
        let V = JSON.parse(JSON.stringify(e.value));
        V = [];
        let v = `https://maps.google.com/maps?q=${L.coords.latitude},${L.coords.longitude}&output=embed`;
        a(v), V.push({
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
        }), Ke(t.details.language[0].locationAcquired), e.onValueChange(V);
      }
    }
    function _(L) {
    }
    navigator.geolocation.getCurrentPosition(S, _, $);
  };
  const [k, C] = z(!1), m = () => {
    k() ? C(!1) : C(!0);
  }, [u] = z(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [x] = z(c.formMode > 2 && e.comments == 0);
  return (() => {
    var $ = Zc(), S = $.firstChild, _ = S.firstChild, L = _.firstChild, V = L.firstChild, v = V.firstChild, h = V.nextSibling, b = L.nextSibling, O = _.nextSibling, E = O.nextSibling;
    return p(V, g(D, {
      get when() {
        return e.component.required;
      },
      get children() {
        return qc();
      }
    }), null), p(V, g(D, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var M = Gc();
        return M.$$click = m, M;
      }
    }), null), p(h, g(D, {
      get when() {
        return k();
      },
      get children() {
        var M = Yc();
        return P(() => M.innerHTML = e.component.hint), M;
      }
    })), p(b, g(D, {
      get when() {
        return r() != "";
      },
      get children() {
        return g(we, {
          get children() {
            return [g(te, {
              get when() {
                return c.clientMode === 2;
              },
              get children() {
                return g(je, {
                  color: "sky",
                  onClick: (M) => e.MobileOpenMap(e.value[0].value),
                  get children() {
                    return pi();
                  }
                });
              }
            }), g(te, {
              get when() {
                return c.clientMode === 1;
              },
              get children() {
                return g(je, {
                  color: "sky",
                  onClick: (M) => window.open("https://maps.google.com/maps?q=loc:" + s().latitude + "," + s().longitude, "_blank"),
                  get children() {
                    return pi();
                  }
                });
              }
            })];
          }
        });
      }
    }), null), p(b, g(we, {
      get children() {
        return [g(te, {
          get when() {
            return c.clientMode === 2;
          },
          get children() {
            return g(je, {
              color: "teal",
              get disabled() {
                return o();
              },
              onClick: () => f(),
              get children() {
                return ki();
              }
            });
          }
        }), g(te, {
          get when() {
            return c.clientMode === 1;
          },
          get children() {
            return g(je, {
              color: "teal",
              get disabled() {
                return o();
              },
              onClick: () => w(),
              get children() {
                return ki();
              }
            });
          }
        })];
      }
    }), null), p(b, g(D, {
      get when() {
        return u();
      },
      get children() {
        return g(Re, {
          get disabled() {
            return x();
          },
          onClick: () => e.openRemark(e.component.dataKey),
          get comments() {
            return e.comments;
          }
        });
      }
    }), null), p(S, g(D, {
      get when() {
        return r() != "";
      },
      get children() {
        var M = Qc(), I = M.firstChild, A = I.firstChild, R = A.firstChild, N = R.nextSibling, K = N.nextSibling;
        return p(N, () => "lon : " + s().longitude), p(K, () => "lat : " + s().latitude), P(() => U(R, "src", r())), M;
      }
    }), O), p(E, g(D, {
      get when() {
        var M;
        return ((M = e.validationMessage) == null ? void 0 : M.length) > 0;
      },
      get children() {
        return g(ce, {
          get each() {
            return e.validationMessage;
          },
          children: (M) => (() => {
            var I = tu(), A = I.firstChild, R = A.firstChild;
            return p(A, g(we, {
              get children() {
                return [g(te, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return Xc();
                  }
                }), g(te, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return eu();
                  }
                })];
              }
            }), R), R.innerHTML = M, P((N) => X(A, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, N)), I;
          })()
        });
      }
    })), P((M) => {
      var I = e.component.label, A = {
        " border-b border-orange-500 pb-3 ": e.classValidation === 1,
        " border-b border-pink-600 pb-3 ": e.classValidation === 2
      };
      return I !== M.e && (v.innerHTML = M.e = I), M.t = X(O, A, M.t), M;
    }, {
      e: void 0,
      t: void 0
    }), $;
  })();
};
he(["click"]);
var ln = { exports: {} };
var nu = ln.exports, $i;
function iu() {
  return $i || ($i = 1, (function(e, t) {
    ((n, i) => {
      e.exports = i();
    })(nu, function n() {
      var i = typeof self != "undefined" ? self : typeof window != "undefined" ? window : i !== void 0 ? i : {}, r, a = !i.document && !!i.postMessage, s = i.IS_PAPA_WORKER || !1, l = {}, c = 0, o = {};
      function d(h) {
        this._handle = null, this._finished = !1, this._completed = !1, this._halted = !1, this._input = null, this._baseIndex = 0, this._partialLine = "", this._rowCount = 0, this._start = 0, this._nextChunk = null, this.isFirstChunk = !0, this._completeResults = { data: [], errors: [], meta: {} }, function(b) {
          var O = L(b);
          O.chunkSize = parseInt(O.chunkSize), b.step || b.chunk || (O.chunkSize = null), this._handle = new m(O), (this._handle.streamer = this)._config = O;
        }.call(this, h), this.parseChunk = function(b, O) {
          var E = parseInt(this._config.skipFirstNLines) || 0;
          if (this.isFirstChunk && 0 < E) {
            let I = this._config.newline;
            I || (M = this._config.quoteChar || '"', I = this._handle.guessLineEndings(b, M)), b = [...b.split(I).slice(E)].join(I);
          }
          this.isFirstChunk && v(this._config.beforeFirstChunk) && (M = this._config.beforeFirstChunk(b)) !== void 0 && (b = M), this.isFirstChunk = !1, this._halted = !1;
          var E = this._partialLine + b, M = (this._partialLine = "", this._handle.parse(E, this._baseIndex, !this._finished));
          if (!this._handle.paused() && !this._handle.aborted()) {
            if (b = M.meta.cursor, E = (this._finished || (this._partialLine = E.substring(b - this._baseIndex), this._baseIndex = b), M && M.data && (this._rowCount += M.data.length), this._finished || this._config.preview && this._rowCount >= this._config.preview), s) i.postMessage({ results: M, workerId: o.WORKER_ID, finished: E });
            else if (v(this._config.chunk) && !O) {
              if (this._config.chunk(M, this._handle), this._handle.paused() || this._handle.aborted()) return void (this._halted = !0);
              this._completeResults = M = void 0;
            }
            return this._config.step || this._config.chunk || (this._completeResults.data = this._completeResults.data.concat(M.data), this._completeResults.errors = this._completeResults.errors.concat(M.errors), this._completeResults.meta = M.meta), this._completed || !E || !v(this._config.complete) || M && M.meta.aborted || (this._config.complete(this._completeResults, this._input), this._completed = !0), E || M && M.meta.paused || this._nextChunk(), M;
          }
          this._halted = !0;
        }, this._sendError = function(b) {
          v(this._config.error) ? this._config.error(b) : s && this._config.error && i.postMessage({ workerId: o.WORKER_ID, error: b, finished: !1 });
        };
      }
      function f(h) {
        var b;
        (h = h || {}).chunkSize || (h.chunkSize = o.RemoteChunkSize), d.call(this, h), this._nextChunk = a ? function() {
          this._readChunk(), this._chunkLoaded();
        } : function() {
          this._readChunk();
        }, this.stream = function(O) {
          this._input = O, this._nextChunk();
        }, this._readChunk = function() {
          if (this._finished) this._chunkLoaded();
          else {
            if (b = new XMLHttpRequest(), this._config.withCredentials && (b.withCredentials = this._config.withCredentials), a || (b.onload = V(this._chunkLoaded, this), b.onerror = V(this._chunkError, this)), b.open(this._config.downloadRequestBody ? "POST" : "GET", this._input, !a), this._config.downloadRequestHeaders) {
              var O, E = this._config.downloadRequestHeaders;
              for (O in E) b.setRequestHeader(O, E[O]);
            }
            var M;
            this._config.chunkSize && (M = this._start + this._config.chunkSize - 1, b.setRequestHeader("Range", "bytes=" + this._start + "-" + M));
            try {
              b.send(this._config.downloadRequestBody);
            } catch (I) {
              this._chunkError(I.message);
            }
            a && b.status === 0 && this._chunkError();
          }
        }, this._chunkLoaded = function() {
          b.readyState === 4 && (b.status < 200 || 400 <= b.status ? this._chunkError() : (this._start += this._config.chunkSize || b.responseText.length, this._finished = !this._config.chunkSize || this._start >= ((O) => (O = O.getResponseHeader("Content-Range")) !== null ? parseInt(O.substring(O.lastIndexOf("/") + 1)) : -1)(b), this.parseChunk(b.responseText)));
        }, this._chunkError = function(O) {
          O = b.statusText || O, this._sendError(new Error(O));
        };
      }
      function w(h) {
        (h = h || {}).chunkSize || (h.chunkSize = o.LocalChunkSize), d.call(this, h);
        var b, O, E = typeof FileReader != "undefined";
        this.stream = function(M) {
          this._input = M, O = M.slice || M.webkitSlice || M.mozSlice, E ? ((b = new FileReader()).onload = V(this._chunkLoaded, this), b.onerror = V(this._chunkError, this)) : b = new FileReaderSync(), this._nextChunk();
        }, this._nextChunk = function() {
          this._finished || this._config.preview && !(this._rowCount < this._config.preview) || this._readChunk();
        }, this._readChunk = function() {
          var M = this._input, I = (this._config.chunkSize && (I = Math.min(this._start + this._config.chunkSize, this._input.size), M = O.call(M, this._start, I)), b.readAsText(M, this._config.encoding));
          E || this._chunkLoaded({ target: { result: I } });
        }, this._chunkLoaded = function(M) {
          this._start += this._config.chunkSize, this._finished = !this._config.chunkSize || this._start >= this._input.size, this.parseChunk(M.target.result);
        }, this._chunkError = function() {
          this._sendError(b.error);
        };
      }
      function k(h) {
        var b;
        d.call(this, h = h || {}), this.stream = function(O) {
          return b = O, this._nextChunk();
        }, this._nextChunk = function() {
          var O, E;
          if (!this._finished) return O = this._config.chunkSize, b = O ? (E = b.substring(0, O), b.substring(O)) : (E = b, ""), this._finished = !b, this.parseChunk(E);
        };
      }
      function C(h) {
        d.call(this, h = h || {});
        var b = [], O = !0, E = !1;
        this.pause = function() {
          d.prototype.pause.apply(this, arguments), this._input.pause();
        }, this.resume = function() {
          d.prototype.resume.apply(this, arguments), this._input.resume();
        }, this.stream = function(M) {
          this._input = M, this._input.on("data", this._streamData), this._input.on("end", this._streamEnd), this._input.on("error", this._streamError);
        }, this._checkIsFinished = function() {
          E && b.length === 1 && (this._finished = !0);
        }, this._nextChunk = function() {
          this._checkIsFinished(), b.length ? this.parseChunk(b.shift()) : O = !0;
        }, this._streamData = V(function(M) {
          try {
            b.push(typeof M == "string" ? M : M.toString(this._config.encoding)), O && (O = !1, this._checkIsFinished(), this.parseChunk(b.shift()));
          } catch (I) {
            this._streamError(I);
          }
        }, this), this._streamError = V(function(M) {
          this._streamCleanUp(), this._sendError(M);
        }, this), this._streamEnd = V(function() {
          this._streamCleanUp(), E = !0, this._streamData("");
        }, this), this._streamCleanUp = V(function() {
          this._input.removeListener("data", this._streamData), this._input.removeListener("end", this._streamEnd), this._input.removeListener("error", this._streamError);
        }, this);
      }
      function m(h) {
        var b, O, E, M, I = Math.pow(2, 53), A = -I, R = /^\s*-?(\d+\.?|\.\d+|\d+\.\d+)([eE][-+]?\d+)?\s*$/, N = /^((\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)))$/, K = this, H = 0, T = 0, j = !1, F = !1, J = [], B = { data: [], errors: [], meta: {} };
        function Z(Q) {
          return h.skipEmptyLines === "greedy" ? Q.join("").trim() === "" : Q.length === 1 && Q[0].length === 0;
        }
        function G() {
          if (B && E && (ae("Delimiter", "UndetectableDelimiter", "Unable to auto-detect delimiting character; defaulted to '" + o.DefaultDelimiter + "'"), E = !1), h.skipEmptyLines && (B.data = B.data.filter(function(q) {
            return !Z(q);
          })), ne()) {
            let q = function(le, re) {
              v(h.transformHeader) && (le = h.transformHeader(le, re)), J.push(le);
            };
            if (B) if (Array.isArray(B.data[0])) {
              for (var Q = 0; ne() && Q < B.data.length; Q++) B.data[Q].forEach(q);
              B.data.splice(0, 1);
            } else B.data.forEach(q);
          }
          function Y(q, le) {
            for (var re = h.header ? {} : [], fe = 0; fe < q.length; fe++) {
              var ve = fe, ye = q[fe], ye = ((Se, ue) => ((ke) => (h.dynamicTypingFunction && h.dynamicTyping[ke] === void 0 && (h.dynamicTyping[ke] = h.dynamicTypingFunction(ke)), (h.dynamicTyping[ke] || h.dynamicTyping) === !0))(Se) ? ue === "true" || ue === "TRUE" || ue !== "false" && ue !== "FALSE" && (((ke) => {
                if (R.test(ke) && (ke = parseFloat(ke), A < ke && ke < I))
                  return 1;
              })(ue) ? parseFloat(ue) : N.test(ue) ? new Date(ue) : ue === "" ? null : ue) : ue)(ve = h.header ? fe >= J.length ? "__parsed_extra" : J[fe] : ve, ye = h.transform ? h.transform(ye, ve) : ye);
              ve === "__parsed_extra" ? (re[ve] = re[ve] || [], re[ve].push(ye)) : re[ve] = ye;
            }
            return h.header && (fe > J.length ? ae("FieldMismatch", "TooManyFields", "Too many fields: expected " + J.length + " fields but parsed " + fe, T + le) : fe < J.length && ae("FieldMismatch", "TooFewFields", "Too few fields: expected " + J.length + " fields but parsed " + fe, T + le)), re;
          }
          var W;
          B && (h.header || h.dynamicTyping || h.transform) && (W = 1, !B.data.length || Array.isArray(B.data[0]) ? (B.data = B.data.map(Y), W = B.data.length) : B.data = Y(B.data, 0), h.header && B.meta && (B.meta.fields = J), T += W);
        }
        function ne() {
          return h.header && J.length === 0;
        }
        function ae(Q, Y, W, q) {
          Q = { type: Q, code: Y, message: W }, q !== void 0 && (Q.row = q), B.errors.push(Q);
        }
        v(h.step) && (M = h.step, h.step = function(Q) {
          B = Q, ne() ? G() : (G(), B.data.length !== 0 && (H += Q.data.length, h.preview && H > h.preview ? O.abort() : (B.data = B.data[0], M(B, K))));
        }), this.parse = function(Q, Y, W) {
          var q = h.quoteChar || '"', q = (h.newline || (h.newline = this.guessLineEndings(Q, q)), E = !1, h.delimiter ? v(h.delimiter) && (h.delimiter = h.delimiter(Q), B.meta.delimiter = h.delimiter) : ((q = ((le, re, fe, ve, ye) => {
            var Se, ue, ke, Ne;
            ye = ye || [",", "	", "|", ";", o.RECORD_SEP, o.UNIT_SEP];
            for (var ze = 0; ze < ye.length; ze++) {
              for (var Le, Je = ye[ze], Ve = 0, Ge = 0, Pe = 0, Be = (ke = void 0, new x({ comments: ve, delimiter: Je, newline: re, preview: 10 }).parse(le)), Ye = 0; Ye < Be.data.length; Ye++) fe && Z(Be.data[Ye]) ? Pe++ : (Le = Be.data[Ye].length, Ge += Le, ke === void 0 ? ke = Le : 0 < Le && (Ve += Math.abs(Le - ke), ke = Le));
              0 < Be.data.length && (Ge /= Be.data.length - Pe), (ue === void 0 || Ve <= ue) && (Ne === void 0 || Ne < Ge) && 1.99 < Ge && (ue = Ve, Se = Je, Ne = Ge);
            }
            return { successful: !!(h.delimiter = Se), bestDelimiter: Se };
          })(Q, h.newline, h.skipEmptyLines, h.comments, h.delimitersToGuess)).successful ? h.delimiter = q.bestDelimiter : (E = !0, h.delimiter = o.DefaultDelimiter), B.meta.delimiter = h.delimiter), L(h));
          return h.preview && h.header && q.preview++, b = Q, O = new x(q), B = O.parse(b, Y, W), G(), j ? { meta: { paused: !0 } } : B || { meta: { paused: !1 } };
        }, this.paused = function() {
          return j;
        }, this.pause = function() {
          j = !0, O.abort(), b = v(h.chunk) ? "" : b.substring(O.getCharIndex());
        }, this.resume = function() {
          K.streamer._halted ? (j = !1, K.streamer.parseChunk(b, !0)) : setTimeout(K.resume, 3);
        }, this.aborted = function() {
          return F;
        }, this.abort = function() {
          F = !0, O.abort(), B.meta.aborted = !0, v(h.complete) && h.complete(B), b = "";
        }, this.guessLineEndings = function(le, q) {
          le = le.substring(0, 1048576);
          var q = new RegExp(u(q) + "([^]*?)" + u(q), "gm"), W = (le = le.replace(q, "")).split("\r"), q = le.split(`
`), le = 1 < q.length && q[0].length < W[0].length;
          if (W.length === 1 || le) return `
`;
          for (var re = 0, fe = 0; fe < W.length; fe++) W[fe][0] === `
` && re++;
          return re >= W.length / 2 ? `\r
` : "\r";
        };
      }
      function u(h) {
        return h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
      function x(h) {
        var b = (h = h || {}).delimiter, O = h.newline, E = h.comments, M = h.step, I = h.preview, A = h.fastMode, R = null, N = !1, K = h.quoteChar == null ? '"' : h.quoteChar, H = K;
        if (h.escapeChar !== void 0 && (H = h.escapeChar), (typeof b != "string" || -1 < o.BAD_DELIMITERS.indexOf(b)) && (b = ","), E === b) throw new Error("Comment character same as delimiter");
        E === !0 ? E = "#" : (typeof E != "string" || -1 < o.BAD_DELIMITERS.indexOf(E)) && (E = !1), O !== `
` && O !== "\r" && O !== `\r
` && (O = `
`);
        var T = 0, j = !1;
        this.parse = function(F, J, B) {
          if (typeof F != "string") throw new Error("Input must be a string");
          var Z = F.length, G = b.length, ne = O.length, ae = E.length, Q = v(M), Y = [], W = [], q = [], le = T = 0;
          if (!F) return Ve();
          if (A || A !== !1 && F.indexOf(K) === -1) {
            for (var re = F.split(O), fe = 0; fe < re.length; fe++) {
              if (q = re[fe], T += q.length, fe !== re.length - 1) T += O.length;
              else if (B) return Ve();
              if (!E || q.substring(0, ae) !== E) {
                if (Q) {
                  if (Y = [], Ne(q.split(b)), Ge(), j) return Ve();
                } else Ne(q.split(b));
                if (I && I <= fe) return Y = Y.slice(0, I), Ve(!0);
              }
            }
            return Ve();
          }
          for (var ve = F.indexOf(b, T), ye = F.indexOf(O, T), Se = new RegExp(u(H) + u(K), "g"), ue = F.indexOf(K, T); ; ) if (F[T] === K) for (ue = T, T++; ; ) {
            if ((ue = F.indexOf(K, ue + 1)) === -1) return B || W.push({ type: "Quotes", code: "MissingQuotes", message: "Quoted field unterminated", row: Y.length, index: T }), Le();
            if (ue === Z - 1) return Le(F.substring(T, ue).replace(Se, K));
            if (K === H && F[ue + 1] === H) ue++;
            else if (K === H || ue === 0 || F[ue - 1] !== H) {
              ve !== -1 && ve < ue + 1 && (ve = F.indexOf(b, ue + 1));
              var ke = ze((ye = ye !== -1 && ye < ue + 1 ? F.indexOf(O, ue + 1) : ye) === -1 ? ve : Math.min(ve, ye));
              if (F.substr(ue + 1 + ke, G) === b) {
                q.push(F.substring(T, ue).replace(Se, K)), F[T = ue + 1 + ke + G] !== K && (ue = F.indexOf(K, T)), ve = F.indexOf(b, T), ye = F.indexOf(O, T);
                break;
              }
              if (ke = ze(ye), F.substring(ue + 1 + ke, ue + 1 + ke + ne) === O) {
                if (q.push(F.substring(T, ue).replace(Se, K)), Je(ue + 1 + ke + ne), ve = F.indexOf(b, T), ue = F.indexOf(K, T), Q && (Ge(), j)) return Ve();
                if (I && Y.length >= I) return Ve(!0);
                break;
              }
              W.push({ type: "Quotes", code: "InvalidQuotes", message: "Trailing quote on quoted field is malformed", row: Y.length, index: T }), ue++;
            }
          }
          else if (E && q.length === 0 && F.substring(T, T + ae) === E) {
            if (ye === -1) return Ve();
            T = ye + ne, ye = F.indexOf(O, T), ve = F.indexOf(b, T);
          } else if (ve !== -1 && (ve < ye || ye === -1)) q.push(F.substring(T, ve)), T = ve + G, ve = F.indexOf(b, T);
          else {
            if (ye === -1) break;
            if (q.push(F.substring(T, ye)), Je(ye + ne), Q && (Ge(), j)) return Ve();
            if (I && Y.length >= I) return Ve(!0);
          }
          return Le();
          function Ne(Pe) {
            Y.push(Pe), le = T;
          }
          function ze(Pe) {
            var Be = 0;
            return Be = Pe !== -1 && (Pe = F.substring(ue + 1, Pe)) && Pe.trim() === "" ? Pe.length : Be;
          }
          function Le(Pe) {
            return B || (Pe === void 0 && (Pe = F.substring(T)), q.push(Pe), T = Z, Ne(q), Q && Ge()), Ve();
          }
          function Je(Pe) {
            T = Pe, Ne(q), q = [], ye = F.indexOf(O, T);
          }
          function Ve(Pe) {
            if (h.header && !J && Y.length && !N) {
              var Be = Y[0], Ye = /* @__PURE__ */ Object.create(null), Tt = new Set(Be);
              let qt = !1;
              for (let ht = 0; ht < Be.length; ht++) {
                let Qe = Be[ht];
                if (Ye[Qe = v(h.transformHeader) ? h.transformHeader(Qe, ht) : Qe]) {
                  let dt, lt = Ye[Qe];
                  for (; dt = Qe + "_" + lt, lt++, Tt.has(dt); ) ;
                  Tt.add(dt), Be[ht] = dt, Ye[Qe]++, qt = !0, (R = R === null ? {} : R)[dt] = Qe;
                } else Ye[Qe] = 1, Be[ht] = Qe;
                Tt.add(Qe);
              }
              N = !0;
            }
            return { data: Y, errors: W, meta: { delimiter: b, linebreak: O, aborted: j, truncated: !!Pe, cursor: le + (J || 0), renamedHeaders: R } };
          }
          function Ge() {
            M(Ve()), Y = [], W = [];
          }
        }, this.abort = function() {
          j = !0;
        }, this.getCharIndex = function() {
          return T;
        };
      }
      function $(h) {
        var b = h.data, O = l[b.workerId], E = !1;
        if (b.error) O.userError(b.error, b.file);
        else if (b.results && b.results.data) {
          var M = { abort: function() {
            E = !0, S(b.workerId, { data: [], errors: [], meta: { aborted: !0 } });
          }, pause: _, resume: _ };
          if (v(O.userStep)) {
            for (var I = 0; I < b.results.data.length && (O.userStep({ data: b.results.data[I], errors: b.results.errors, meta: b.results.meta }, M), !E); I++) ;
            delete b.results;
          } else v(O.userChunk) && (O.userChunk(b.results, M, b.file), delete b.results);
        }
        b.finished && !E && S(b.workerId, b.results);
      }
      function S(h, b) {
        var O = l[h];
        v(O.userComplete) && O.userComplete(b), O.terminate(), delete l[h];
      }
      function _() {
        throw new Error("Not implemented.");
      }
      function L(h) {
        if (typeof h != "object" || h === null) return h;
        var b, O = Array.isArray(h) ? [] : {};
        for (b in h) O[b] = L(h[b]);
        return O;
      }
      function V(h, b) {
        return function() {
          h.apply(b, arguments);
        };
      }
      function v(h) {
        return typeof h == "function";
      }
      return o.parse = function(h, b) {
        var O = (b = b || {}).dynamicTyping || !1;
        if (v(O) && (b.dynamicTypingFunction = O, O = {}), b.dynamicTyping = O, b.transform = !!v(b.transform) && b.transform, !b.worker || !o.WORKERS_SUPPORTED) return O = null, o.NODE_STREAM_INPUT, typeof h == "string" ? (h = ((E) => E.charCodeAt(0) !== 65279 ? E : E.slice(1))(h), O = new (b.download ? f : k)(b)) : h.readable === !0 && v(h.read) && v(h.on) ? O = new C(b) : (i.File && h instanceof File || h instanceof Object) && (O = new w(b)), O.stream(h);
        (O = (() => {
          var E;
          return !!o.WORKERS_SUPPORTED && (E = (() => {
            var M = i.URL || i.webkitURL || null, I = n.toString();
            return o.BLOB_URL || (o.BLOB_URL = M.createObjectURL(new Blob(["var global = (function() { if (typeof self !== 'undefined') { return self; } if (typeof window !== 'undefined') { return window; } if (typeof global !== 'undefined') { return global; } return {}; })(); global.IS_PAPA_WORKER=true; ", "(", I, ")();"], { type: "text/javascript" })));
          })(), (E = new i.Worker(E)).onmessage = $, E.id = c++, l[E.id] = E);
        })()).userStep = b.step, O.userChunk = b.chunk, O.userComplete = b.complete, O.userError = b.error, b.step = v(b.step), b.chunk = v(b.chunk), b.complete = v(b.complete), b.error = v(b.error), delete b.worker, O.postMessage({ input: h, config: b, workerId: O.id });
      }, o.unparse = function(h, b) {
        var O = !1, E = !0, M = ",", I = `\r
`, A = '"', R = A + A, N = !1, K = null, H = !1, T = ((() => {
          if (typeof b == "object") {
            if (typeof b.delimiter != "string" || o.BAD_DELIMITERS.filter(function(J) {
              return b.delimiter.indexOf(J) !== -1;
            }).length || (M = b.delimiter), typeof b.quotes != "boolean" && typeof b.quotes != "function" && !Array.isArray(b.quotes) || (O = b.quotes), typeof b.skipEmptyLines != "boolean" && typeof b.skipEmptyLines != "string" || (N = b.skipEmptyLines), typeof b.newline == "string" && (I = b.newline), typeof b.quoteChar == "string" && (A = b.quoteChar), typeof b.header == "boolean" && (E = b.header), Array.isArray(b.columns)) {
              if (b.columns.length === 0) throw new Error("Option columns is empty");
              K = b.columns;
            }
            b.escapeChar !== void 0 && (R = b.escapeChar + A), b.escapeFormulae instanceof RegExp ? H = b.escapeFormulae : typeof b.escapeFormulae == "boolean" && b.escapeFormulae && (H = /^[=+\-@\t\r].*$/);
          }
        })(), new RegExp(u(A), "g"));
        if (typeof h == "string" && (h = JSON.parse(h)), Array.isArray(h)) {
          if (!h.length || Array.isArray(h[0])) return j(null, h, N);
          if (typeof h[0] == "object") return j(K || Object.keys(h[0]), h, N);
        } else if (typeof h == "object") return typeof h.data == "string" && (h.data = JSON.parse(h.data)), Array.isArray(h.data) && (h.fields || (h.fields = h.meta && h.meta.fields || K), h.fields || (h.fields = Array.isArray(h.data[0]) ? h.fields : typeof h.data[0] == "object" ? Object.keys(h.data[0]) : []), Array.isArray(h.data[0]) || typeof h.data[0] == "object" || (h.data = [h.data])), j(h.fields || [], h.data || [], N);
        throw new Error("Unable to serialize unrecognized input");
        function j(J, B, Z) {
          var G = "", ne = (typeof J == "string" && (J = JSON.parse(J)), typeof B == "string" && (B = JSON.parse(B)), Array.isArray(J) && 0 < J.length), ae = !Array.isArray(B[0]);
          if (ne && E) {
            for (var Q = 0; Q < J.length; Q++) 0 < Q && (G += M), G += F(J[Q], Q);
            0 < B.length && (G += I);
          }
          for (var Y = 0; Y < B.length; Y++) {
            var W = (ne ? J : B[Y]).length, q = !1, le = ne ? Object.keys(B[Y]).length === 0 : B[Y].length === 0;
            if (Z && !ne && (q = Z === "greedy" ? B[Y].join("").trim() === "" : B[Y].length === 1 && B[Y][0].length === 0), Z === "greedy" && ne) {
              for (var re = [], fe = 0; fe < W; fe++) {
                var ve = ae ? J[fe] : fe;
                re.push(B[Y][ve]);
              }
              q = re.join("").trim() === "";
            }
            if (!q) {
              for (var ye = 0; ye < W; ye++) {
                0 < ye && !le && (G += M);
                var Se = ne && ae ? J[ye] : ye;
                G += F(B[Y][Se], ye);
              }
              Y < B.length - 1 && (!Z || 0 < W && !le) && (G += I);
            }
          }
          return G;
        }
        function F(J, B) {
          var Z, G;
          return J == null ? "" : J.constructor === Date ? JSON.stringify(J).slice(1, 25) : (G = !1, H && typeof J == "string" && H.test(J) && (J = "'" + J, G = !0), Z = J.toString().replace(T, R), (G = G || O === !0 || typeof O == "function" && O(J, B) || Array.isArray(O) && O[B] || ((ne, ae) => {
            for (var Q = 0; Q < ae.length; Q++) if (-1 < ne.indexOf(ae[Q])) return !0;
            return !1;
          })(Z, o.BAD_DELIMITERS) || -1 < Z.indexOf(M) || Z.charAt(0) === " " || Z.charAt(Z.length - 1) === " ") ? A + Z + A : Z);
        }
      }, o.RECORD_SEP = "", o.UNIT_SEP = "", o.BYTE_ORDER_MARK = "\uFEFF", o.BAD_DELIMITERS = ["\r", `
`, '"', o.BYTE_ORDER_MARK], o.WORKERS_SUPPORTED = !a && !!i.Worker, o.NODE_STREAM_INPUT = 1, o.LocalChunkSize = 10485760, o.RemoteChunkSize = 5242880, o.DefaultDelimiter = ",", o.Parser = x, o.ParserHandle = m, o.NetworkStreamer = f, o.FileStreamer = w, o.StringStreamer = k, o.ReadableStreamStreamer = C, i.jQuery && ((r = i.jQuery).fn.parse = function(h) {
        var b = h.config || {}, O = [];
        return this.each(function(I) {
          if (!(r(this).prop("tagName").toUpperCase() === "INPUT" && r(this).attr("type").toLowerCase() === "file" && i.FileReader) || !this.files || this.files.length === 0) return !0;
          for (var A = 0; A < this.files.length; A++) O.push({ file: this.files[A], inputElem: this, instanceConfig: r.extend({}, b) });
        }), E(), this;
        function E() {
          if (O.length === 0) v(h.complete) && h.complete();
          else {
            var I, A, R, N, K = O[0];
            if (v(h.before)) {
              var H = h.before(K.file, K.inputElem);
              if (typeof H == "object") {
                if (H.action === "abort") return I = "AbortError", A = K.file, R = K.inputElem, N = H.reason, void (v(h.error) && h.error({ name: I }, A, R, N));
                if (H.action === "skip") return void M();
                typeof H.config == "object" && (K.instanceConfig = r.extend(K.instanceConfig, H.config));
              } else if (H === "skip") return void M();
            }
            var T = K.instanceConfig.complete;
            K.instanceConfig.complete = function(j) {
              v(T) && T(j, K.file, K.inputElem), M();
            }, o.parse(K.file, K.instanceConfig);
          }
        }
        function M() {
          O.splice(0, 1), E();
        }
      }), s && (i.onmessage = function(h) {
        h = h.data, o.WORKER_ID === void 0 && h && (o.WORKER_ID = h.workerId), typeof h.input == "string" ? i.postMessage({ workerId: o.WORKER_ID, results: o.parse(h.input, h.config), finished: !0 }) : (i.File && h.input instanceof File || h.input instanceof Object) && (h = o.parse(h.input, h.config)) && i.postMessage({ workerId: o.WORKER_ID, results: h, finished: !0 });
      }), (f.prototype = Object.create(d.prototype)).constructor = f, (w.prototype = Object.create(d.prototype)).constructor = w, (k.prototype = Object.create(k.prototype)).constructor = k, (C.prototype = Object.create(d.prototype)).constructor = C, o;
    });
  })(ln)), ln.exports;
}
var ru = iu();
const _i = /* @__PURE__ */ Nt(ru);
var au = /* @__PURE__ */ y('<div class="backdrop-blur-sm overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex"><svg class="w-20 h-20 animate-spin"xmlns=http://www.w3.org/2000/svg viewBox="0 0 94.53 98.372"><circle cx=23.536 cy=16.331 r=8.646 style=fill:#0a77e8></circle><circle cx=8.646 cy=36.698 r=8.646 style=fill:#0f9af0></circle><circle cx=8.646 cy=61.867 r=8.646 style=fill:#0f9af0></circle><circle cx=23.536 cy=82.233 r=8.646 style=fill:#13bdf7></circle><circle cx=47.361 cy=89.726 r=8.646 style=fill:#13bdf7></circle><circle cx=71.282 cy=82.233 r=8.646 style=fill:#18e0ff></circle><circle cx=85.884 cy=61.867 r=8.646 style=fill:#65eaff></circle><circle cx=85.884 cy=36.698 r=8.646 style=fill:#b2f5ff></circle><circle cx=47.361 cy=8.646 r=8.646 style=fill:#1d4970>'), lu = /* @__PURE__ */ y("<span class=text-pink-600>*"), su = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), ou = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), du = /* @__PURE__ */ y('<svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4">'), cu = /* @__PURE__ */ y('<svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">'), uu = /* @__PURE__ */ y('<div class="font-light text-sm space-x-2 py-2.5 px-2 col-span-12 space-y-4"><div class=preview-class><div class="container mx-auto"><div class="scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-50 dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-500 overflow-x-scroll scrollbar-thumb-rounded-full scrollbar-track-rounded-full"><table class="table-auto w-full"><thead class="text-xs font-semibold uppercase text-gray-400 bg-gray-50"><tr></tr></thead><tbody class="text-sm divide-y divide-gray-100"></tbody></table></div><br><span class="bg-red-100 text-red-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-800"></span><span class="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">'), gu = /* @__PURE__ */ y('<div><div class="grid grid-cols-12 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2 col-span-11"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm space-x-2 py-2.5 px-2 space-y-4 flex justify-end -mt-2"><input type=file accept=.csv class="hidden w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"style=color:transparent></div><div class=col-span-12></div><div class="col-span-12 pb-4">'), hu = /* @__PURE__ */ y('<th class="p-2 whitespace-nowrap"><div class="font-semibold text-left">'), fu = /* @__PURE__ */ y("<tr>"), mu = /* @__PURE__ */ y('<td class="p-2 whitespace-nowrap"><div class=text-left>'), vu = /* @__PURE__ */ y('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), bu = /* @__PURE__ */ y('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), wu = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="grid grid-cols-12"><div class="col-span-11 text-justify mr-1">');
const Dr = (e) => {
  const [t] = rt(), [n, i] = z([]), [r, a] = z([]), [s, l] = z(""), [c, o] = z(!1), [d, f] = z("");
  let w = new FileReader();
  const k = e.config, [C] = z(k.formMode > 1 ? !0 : e.component.disableInput);
  $e(() => {
    e.value && (i(Object.keys(e.value[0])), a([Object.values(e.value[0]), Object.values(e.value[1]), Object.values(e.value[2]), Object.values(e.value[3]), Object.values(e.value[4])]));
  });
  let m = (v) => {
    if (o(!0), JSON.parse(JSON.stringify(e.value)), v.target.files && v.target.files[0]) {
      var h = ["csv", "txt"];
      let b = v.target.files[0], O = b.name.split(".").pop().toLowerCase();
      if (!h.includes(O))
        me(t.details.language[0].fileInvalidFormat);
      else {
        let E = (b.size / 1048576).toFixed(2), M = !0, I = !0;
        e.component.sizeInput && (M = e.component.sizeInput[0].min !== void 0 ? Number(E) > Number(e.component.sizeInput[0].min) : !0, I = e.component.sizeInput[0].max !== void 0 ? Number(E) < Number(e.component.sizeInput[0].max) : !0, !I && me(t.details.language[0].fileInvalidMaxSize + e.component.sizeInput[0].max), !M && me(t.details.language[0].fileInvalidMinSize + e.component.sizeInput[0].min), o(!1)), M && I && (w.readAsDataURL(b), w.onload = (A) => {
          _i.parse(b, {
            download: !0,
            delimiter: "",
            // auto-detect
            complete: function(R) {
              let N = R.data[0], K = [R.data[1], R.data[2], R.data[3], R.data[4], R.data[5]], H = R.data.slice(1).map((T) => {
                var j = {};
                return N.forEach((F, J) => {
                  j[F] = T[J];
                }), j;
              });
              i(N), a(K), o(!1), e.onValueChange(H), Ke(t.details.language[0].fileUploaded);
            }
          });
        });
      }
    }
  };
  const u = ({
    data: v,
    fileName: h,
    fileType: b
  }) => {
    const O = new Blob([v], {
      type: b
    }), E = document.createElement("a");
    E.download = h, E.href = window.URL.createObjectURL(O);
    const M = new MouseEvent("click", {
      view: window,
      bubbles: !0,
      cancelable: !0
    });
    E.dispatchEvent(M), E.remove();
  }, x = (v) => {
    v.preventDefault(), u({
      data: _i.unparse(e.value, {
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
  }, [$, S] = z(!1), _ = () => {
    $() ? S(!1) : S(!0);
  }, [L] = z(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [V] = z(k.formMode > 2 && e.comments == 0);
  return (() => {
    var v = gu(), h = v.firstChild, b = h.firstChild, O = b.firstChild, E = O.firstChild, M = O.nextSibling, I = b.nextSibling, A = I.firstChild, R = I.nextSibling, N = R.nextSibling;
    return p(v, g(D, {
      get when() {
        return c();
      },
      get children() {
        return au();
      }
    }), h), p(O, g(D, {
      get when() {
        return e.component.required;
      },
      get children() {
        return lu();
      }
    }), null), p(O, g(D, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var K = su();
        return K.$$click = _, K;
      }
    }), null), p(M, g(D, {
      get when() {
        return $();
      },
      get children() {
        var K = ou();
        return P(() => K.innerHTML = e.component.hint), K;
      }
    })), A.addEventListener("change", (K) => {
      m(K);
    }), p(I, g(D, {
      get when() {
        return e.value;
      },
      get children() {
        return g(je, {
          color: "teal",
          onClick: (K) => x(K),
          get children() {
            return du();
          }
        });
      }
    }), null), p(I, g(je, {
      color: "fuchsia",
      get disabled() {
        return C();
      },
      onClick: (K) => {
        document.getElementById("inputFile_" + e.component.dataKey).click();
      },
      get title() {
        return t.details.language[0].uploadCsv;
      },
      get children() {
        return cu();
      }
    }), null), p(I, g(D, {
      get when() {
        return L();
      },
      get children() {
        return g(Re, {
          get disabled() {
            return V();
          },
          onClick: () => e.openRemark(e.component.dataKey),
          get comments() {
            return e.comments;
          }
        });
      }
    }), null), p(h, g(D, {
      get when() {
        return e.value;
      },
      get children() {
        var K = uu(), H = K.firstChild, T = H.firstChild, j = T.firstChild, F = j.firstChild, J = F.firstChild, B = J.firstChild, Z = J.nextSibling, G = j.nextSibling, ne = G.nextSibling, ae = ne.nextSibling;
        return p(B, g(ce, {
          get each() {
            return n();
          },
          children: (Q, Y) => (() => {
            var W = hu(), q = W.firstChild;
            return p(q, Q), W;
          })()
        })), p(Z, g(ce, {
          get each() {
            return r();
          },
          children: (Q, Y) => (() => {
            var W = fu();
            return p(W, g(ce, {
              each: Q,
              children: (q, le) => (() => {
                var re = mu(), fe = re.firstChild;
                return p(fe, q), re;
              })()
            })), W;
          })()
        })), p(ne, () => "rows : " + Number(e.value.length + 1)), p(ae, () => "cols : " + n().length), K;
      }
    }), R), p(N, g(D, {
      get when() {
        var K;
        return ((K = e.validationMessage) == null ? void 0 : K.length) > 0;
      },
      get children() {
        return g(ce, {
          get each() {
            return e.validationMessage;
          },
          children: (K) => (() => {
            var H = wu(), T = H.firstChild, j = T.firstChild;
            return p(T, g(we, {
              get children() {
                return [g(te, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return vu();
                  }
                }), g(te, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return bu();
                  }
                })];
              }
            }), j), j.innerHTML = K, P((F) => X(T, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, F)), H;
          })()
        });
      }
    })), P((K) => {
      var H = e.component.label, T = "inputFile_" + e.component.dataKey, j = e.component.dataKey, F = {
        " border-b border-orange-500 pb-3 ": e.classValidation === 1,
        " border-b border-pink-600 pb-3 ": e.classValidation === 2
      };
      return H !== K.e && (E.innerHTML = K.e = H), T !== K.t && U(A, "id", K.t = T), j !== K.a && U(A, "name", K.a = j), K.o = X(R, F, K.o), K;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0
    }), v;
  })();
};
he(["click"]);
var xu = /* @__PURE__ */ y('<div class="modal-confirmation fixed z-10 inset-0 overflow-y-auto"aria-labelledby=modal-title role=dialog aria-modal=true><div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"><div class="fixed inset-0 bg-gray-500/75 transition-opacity"aria-hidden=true></div><span class="hidden sm:inline-block sm:align-middle sm:h-screen"aria-hidden=true>&#8203;</span><div class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"><div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4"><div class="sm:flex sm:items-start"><div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"><svg xmlns=http://www.w3.org/2000/svg class="h-6 w-6 text-red-600"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div><div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left"><h3 class="text-lg leading-6 font-medium text-gray-900"id=titleModalConfirmation>Confirmation</h3><div class=mt-2><p class="text-sm text-gray-500"id=contentModalConfirmation>Are you sure you want to get present time?</p></div></div></div></div><div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"><button type=button class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">Get Time</button><button type=button class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Cancel'), yu = /* @__PURE__ */ y("<span class=text-pink-600>*"), pu = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), ku = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), $u = /* @__PURE__ */ y('<svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z">'), _u = /* @__PURE__ */ y('<div class="font-light text-sm space-x-2 py-2.5 px-2 col-span-12 space-y-4 -mt-2"><span class="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">'), Su = /* @__PURE__ */ y('<div><div class="grid grid-cols-12 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2 col-span-11"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm space-x-2 py-2.5 px-2 space-y-4 flex justify-end items-end -mt-2"></div><div class=col-span-12></div><div class="col-span-12 pb-4">'), Cu = /* @__PURE__ */ y('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), Mu = /* @__PURE__ */ y('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Iu = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="grid grid-cols-12"><div class="col-span-11 text-justify mr-1">');
const jr = (e) => {
  const t = e.config, [n, i] = z(0), [r] = z(t.formMode > 1 ? !0 : e.component.disableInput), [a, s] = z(!1), l = () => {
    a() ? s(!1) : s(!0);
  }, [c] = z(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [o] = z(t.formMode > 2 && e.comments == 0), d = () => {
    i(1), k();
  }, f = () => {
    let C = We().format("YYYY-MM-DD HH:mm:ss");
    e.onValueChange(C);
  };
  let w = () => {
    i(0);
  };
  const k = () => {
    let C = document.querySelector("#titleModalConfirmation"), m = document.querySelector("#contentModalConfirmation");
    C.innerHTML = e.component.titleModalConfirmation !== void 0 ? e.component.titleModalConfirmation : "Confirmation", m.innerHTML = e.component.contentModalConfirmation !== void 0 ? e.component.contentModalConfirmation : "Are you certain to generate the current time?";
  };
  return (() => {
    var C = Su(), m = C.firstChild, u = m.firstChild, x = u.firstChild, $ = x.firstChild, S = x.nextSibling, _ = u.nextSibling, L = _.nextSibling, V = L.nextSibling;
    return p(C, g(D, {
      get when() {
        return n() == 1;
      },
      get children() {
        var v = xu(), h = v.firstChild, b = h.firstChild, O = b.nextSibling, E = O.nextSibling, M = E.firstChild, I = M.nextSibling, A = I.firstChild, R = A.nextSibling;
        return A.$$click = (N) => f(), R.$$click = (N) => w(), v;
      }
    }), m), p(x, g(D, {
      get when() {
        return e.component.required;
      },
      get children() {
        return yu();
      }
    }), null), p(x, g(D, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var v = pu();
        return v.$$click = l, v;
      }
    }), null), p(S, g(D, {
      get when() {
        return a();
      },
      get children() {
        var v = ku();
        return P(() => v.innerHTML = e.component.hint), v;
      }
    })), p(_, g(je, {
      color: "teal",
      onClick: () => d(),
      get disabled() {
        return r();
      },
      get children() {
        return $u();
      }
    }), null), p(_, g(D, {
      get when() {
        return c();
      },
      get children() {
        return g(Re, {
          get disabled() {
            return o();
          },
          onClick: () => e.openRemark(e.component.dataKey),
          get comments() {
            return e.comments;
          }
        });
      }
    }), null), p(m, g(D, {
      get when() {
        return e.value !== "";
      },
      get children() {
        var v = _u(), h = v.firstChild;
        return p(h, () => e.value), v;
      }
    }), L), p(V, g(D, {
      get when() {
        var v;
        return ((v = e.validationMessage) == null ? void 0 : v.length) > 0;
      },
      get children() {
        return g(ce, {
          get each() {
            return e.validationMessage;
          },
          children: (v) => (() => {
            var h = Iu(), b = h.firstChild, O = b.firstChild;
            return p(b, g(we, {
              get children() {
                return [g(te, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return Cu();
                  }
                }), g(te, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return Mu();
                  }
                })];
              }
            }), O), O.innerHTML = v, P((E) => X(b, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, E)), h;
          })()
        });
      }
    })), P((v) => {
      var h = e.component.label, b = {
        " border-b border-orange-500 pb-3 ": e.classValidation === 1,
        " border-b border-pink-600 pb-3 ": e.classValidation === 2
      };
      return h !== v.e && ($.innerHTML = v.e = h), v.t = X(L, b, v.t), v;
    }, {
      e: void 0,
      t: void 0
    }), C;
  })();
};
he(["click"]);
class yn {
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
class qn {
  static fromPoints(t, n) {
    const i = this.calculateControlPoints(t[0], t[1], t[2]).c2, r = this.calculateControlPoints(t[1], t[2], t[3]).c1;
    return new qn(t[1], i, r, t[2], n.start, n.end);
  }
  static calculateControlPoints(t, n, i) {
    const r = t.x - n.x, a = t.y - n.y, s = n.x - i.x, l = n.y - i.y, c = { x: (t.x + n.x) / 2, y: (t.y + n.y) / 2 }, o = { x: (n.x + i.x) / 2, y: (n.y + i.y) / 2 }, d = Math.sqrt(r * r + a * a), f = Math.sqrt(s * s + l * l), w = c.x - o.x, k = c.y - o.y, C = f / (d + f), m = { x: o.x + w * C, y: o.y + k * C }, u = n.x - m.x, x = n.y - m.y;
    return {
      c1: new yn(c.x + u, c.y + x),
      c2: new yn(o.x + u, o.y + x)
    };
  }
  constructor(t, n, i, r, a, s) {
    this.startPoint = t, this.control2 = n, this.control1 = i, this.endPoint = r, this.startWidth = a, this.endWidth = s;
  }
  length() {
    let n = 0, i, r;
    for (let a = 0; a <= 10; a += 1) {
      const s = a / 10, l = this.point(s, this.startPoint.x, this.control1.x, this.control2.x, this.endPoint.x), c = this.point(s, this.startPoint.y, this.control1.y, this.control2.y, this.endPoint.y);
      if (a > 0) {
        const o = l - i, d = c - r;
        n += Math.sqrt(o * o + d * d);
      }
      i = l, r = c;
    }
    return n;
  }
  point(t, n, i, r, a) {
    return n * (1 - t) * (1 - t) * (1 - t) + 3 * i * (1 - t) * (1 - t) * t + 3 * r * (1 - t) * t * t + a * t * t * t;
  }
}
class Eu {
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
function Lu(e, t = 250) {
  let n = 0, i = null, r, a, s;
  const l = () => {
    n = Date.now(), i = null, r = e.apply(a, s), i || (a = null, s = []);
  };
  return function(...o) {
    const d = Date.now(), f = t - (d - n);
    return a = this, s = o, f <= 0 || f > t ? (i && (clearTimeout(i), i = null), n = d, r = e.apply(a, s), i || (a = null, s = [])) : i || (i = window.setTimeout(l, f)), r;
  };
}
class $t extends Eu {
  constructor(t, n = {}) {
    super(), this.canvas = t, this._drawingStroke = !1, this._isEmpty = !0, this._lastPoints = [], this._data = [], this._lastVelocity = 0, this._lastWidth = 0, this._handleMouseDown = (i) => {
      i.buttons === 1 && this._strokeBegin(i);
    }, this._handleMouseMove = (i) => {
      this._strokeMoveUpdate(i);
    }, this._handleMouseUp = (i) => {
      i.buttons === 1 && this._strokeEnd(i);
    }, this._handleTouchStart = (i) => {
      if (i.cancelable && i.preventDefault(), i.targetTouches.length === 1) {
        const r = i.changedTouches[0];
        this._strokeBegin(r);
      }
    }, this._handleTouchMove = (i) => {
      i.cancelable && i.preventDefault();
      const r = i.targetTouches[0];
      this._strokeMoveUpdate(r);
    }, this._handleTouchEnd = (i) => {
      if (i.target === this.canvas) {
        i.cancelable && i.preventDefault();
        const a = i.changedTouches[0];
        this._strokeEnd(a);
      }
    }, this._handlePointerStart = (i) => {
      i.preventDefault(), this._strokeBegin(i);
    }, this._handlePointerMove = (i) => {
      this._strokeMoveUpdate(i);
    }, this._handlePointerEnd = (i) => {
      this._drawingStroke && (i.preventDefault(), this._strokeEnd(i));
    }, this.velocityFilterWeight = n.velocityFilterWeight || 0.7, this.minWidth = n.minWidth || 0.5, this.maxWidth = n.maxWidth || 2.5, this.throttle = "throttle" in n ? n.throttle : 16, this.minDistance = "minDistance" in n ? n.minDistance : 5, this.dotSize = n.dotSize || 0, this.penColor = n.penColor || "black", this.backgroundColor = n.backgroundColor || "rgba(0,0,0,0)", this.compositeOperation = n.compositeOperation || "source-over", this.canvasContextOptions = "canvasContextOptions" in n ? n.canvasContextOptions : {}, this._strokeMoveUpdate = this.throttle ? Lu($t.prototype._strokeUpdate, this.throttle) : $t.prototype._strokeUpdate, this._ctx = t.getContext("2d", this.canvasContextOptions), this.clear(), this.on();
  }
  clear() {
    const { _ctx: t, canvas: n } = this;
    t.fillStyle = this.backgroundColor, t.clearRect(0, 0, n.width, n.height), t.fillRect(0, 0, n.width, n.height), this._data = [], this._reset(this._getPointGroupOptions()), this._isEmpty = !0;
  }
  fromDataURL(t, n = {}) {
    return new Promise((i, r) => {
      const a = new Image(), s = n.ratio || window.devicePixelRatio || 1, l = n.width || this.canvas.width / s, c = n.height || this.canvas.height / s, o = n.xOffset || 0, d = n.yOffset || 0;
      this._reset(this._getPointGroupOptions()), a.onload = () => {
        this._ctx.drawImage(a, o, d, l, c), i();
      }, a.onerror = (f) => {
        r(f);
      }, a.crossOrigin = "anonymous", a.src = t, this._isEmpty = !1;
    });
  }
  toDataURL(t = "image/png", n) {
    return t === "image/svg+xml" ? (typeof n != "object" && (n = void 0), `data:image/svg+xml;base64,${btoa(this.toSVG(n))}`) : (typeof n != "number" && (n = void 0), this.canvas.toDataURL(t, n));
  }
  on() {
    this.canvas.style.touchAction = "none", this.canvas.style.msTouchAction = "none", this.canvas.style.userSelect = "none";
    const t = /Macintosh/.test(navigator.userAgent) && "ontouchstart" in document;
    window.PointerEvent && !t ? this._handlePointerEvents() : (this._handleMouseEvents(), "ontouchstart" in window && this._handleTouchEvents());
  }
  off() {
    this.canvas.style.touchAction = "auto", this.canvas.style.msTouchAction = "auto", this.canvas.style.userSelect = "auto", this.canvas.removeEventListener("pointerdown", this._handlePointerStart), this.canvas.removeEventListener("pointermove", this._handlePointerMove), this.canvas.ownerDocument.removeEventListener("pointerup", this._handlePointerEnd), this.canvas.removeEventListener("mousedown", this._handleMouseDown), this.canvas.removeEventListener("mousemove", this._handleMouseMove), this.canvas.ownerDocument.removeEventListener("mouseup", this._handleMouseUp), this.canvas.removeEventListener("touchstart", this._handleTouchStart), this.canvas.removeEventListener("touchmove", this._handleTouchMove), this.canvas.removeEventListener("touchend", this._handleTouchEnd);
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
  _getPointGroupOptions(t) {
    return {
      penColor: t && "penColor" in t ? t.penColor : this.penColor,
      dotSize: t && "dotSize" in t ? t.dotSize : this.dotSize,
      minWidth: t && "minWidth" in t ? t.minWidth : this.minWidth,
      maxWidth: t && "maxWidth" in t ? t.maxWidth : this.maxWidth,
      velocityFilterWeight: t && "velocityFilterWeight" in t ? t.velocityFilterWeight : this.velocityFilterWeight,
      compositeOperation: t && "compositeOperation" in t ? t.compositeOperation : this.compositeOperation
    };
  }
  _strokeBegin(t) {
    if (!this.dispatchEvent(new CustomEvent("beginStroke", { detail: t, cancelable: !0 })))
      return;
    this._drawingStroke = !0;
    const i = this._getPointGroupOptions(), r = Object.assign(Object.assign({}, i), { points: [] });
    this._data.push(r), this._reset(i), this._strokeUpdate(t);
  }
  _strokeUpdate(t) {
    if (!this._drawingStroke)
      return;
    if (this._data.length === 0) {
      this._strokeBegin(t);
      return;
    }
    this.dispatchEvent(new CustomEvent("beforeUpdateStroke", { detail: t }));
    const n = t.clientX, i = t.clientY, r = t.pressure !== void 0 ? t.pressure : t.force !== void 0 ? t.force : 0, a = this._createPoint(n, i, r), s = this._data[this._data.length - 1], l = s.points, c = l.length > 0 && l[l.length - 1], o = c ? a.distanceTo(c) <= this.minDistance : !1, d = this._getPointGroupOptions(s);
    if (!c || !(c && o)) {
      const f = this._addPoint(a, d);
      c ? f && this._drawCurve(f, d) : this._drawDot(a, d), l.push({
        time: a.time,
        x: a.x,
        y: a.y,
        pressure: a.pressure
      });
    }
    this.dispatchEvent(new CustomEvent("afterUpdateStroke", { detail: t }));
  }
  _strokeEnd(t) {
    this._drawingStroke && (this._strokeUpdate(t), this._drawingStroke = !1, this.dispatchEvent(new CustomEvent("endStroke", { detail: t })));
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
  _reset(t) {
    this._lastPoints = [], this._lastVelocity = 0, this._lastWidth = (t.minWidth + t.maxWidth) / 2, this._ctx.fillStyle = t.penColor, this._ctx.globalCompositeOperation = t.compositeOperation;
  }
  _createPoint(t, n, i) {
    const r = this.canvas.getBoundingClientRect();
    return new yn(t - r.left, n - r.top, i, (/* @__PURE__ */ new Date()).getTime());
  }
  _addPoint(t, n) {
    const { _lastPoints: i } = this;
    if (i.push(t), i.length > 2) {
      i.length === 3 && i.unshift(i[0]);
      const r = this._calculateCurveWidths(i[1], i[2], n), a = qn.fromPoints(i, r);
      return i.shift(), a;
    }
    return null;
  }
  _calculateCurveWidths(t, n, i) {
    const r = i.velocityFilterWeight * n.velocityFrom(t) + (1 - i.velocityFilterWeight) * this._lastVelocity, a = this._strokeWidth(r, i), s = {
      end: a,
      start: this._lastWidth
    };
    return this._lastVelocity = r, this._lastWidth = a, s;
  }
  _strokeWidth(t, n) {
    return Math.max(n.maxWidth / (t + 1), n.minWidth);
  }
  _drawCurveSegment(t, n, i) {
    const r = this._ctx;
    r.moveTo(t, n), r.arc(t, n, i, 0, 2 * Math.PI, !1), this._isEmpty = !1;
  }
  _drawCurve(t, n) {
    const i = this._ctx, r = t.endWidth - t.startWidth, a = Math.ceil(t.length()) * 2;
    i.beginPath(), i.fillStyle = n.penColor;
    for (let s = 0; s < a; s += 1) {
      const l = s / a, c = l * l, o = c * l, d = 1 - l, f = d * d, w = f * d;
      let k = w * t.startPoint.x;
      k += 3 * f * l * t.control1.x, k += 3 * d * c * t.control2.x, k += o * t.endPoint.x;
      let C = w * t.startPoint.y;
      C += 3 * f * l * t.control1.y, C += 3 * d * c * t.control2.y, C += o * t.endPoint.y;
      const m = Math.min(t.startWidth + o * r, n.maxWidth);
      this._drawCurveSegment(k, C, m);
    }
    i.closePath(), i.fill();
  }
  _drawDot(t, n) {
    const i = this._ctx, r = n.dotSize > 0 ? n.dotSize : (n.minWidth + n.maxWidth) / 2;
    i.beginPath(), this._drawCurveSegment(t.x, t.y, r), i.closePath(), i.fillStyle = n.penColor, i.fill();
  }
  _fromData(t, n, i) {
    for (const r of t) {
      const { points: a } = r, s = this._getPointGroupOptions(r);
      if (a.length > 1)
        for (let l = 0; l < a.length; l += 1) {
          const c = a[l], o = new yn(c.x, c.y, c.pressure, c.time);
          l === 0 && this._reset(s);
          const d = this._addPoint(o, s);
          d && n(d, s);
        }
      else
        this._reset(s), i(a[0], s);
    }
  }
  toSVG({ includeBackgroundColor: t = !1 } = {}) {
    const n = this._data, i = Math.max(window.devicePixelRatio || 1, 1), r = 0, a = 0, s = this.canvas.width / i, l = this.canvas.height / i, c = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    if (c.setAttribute("xmlns", "http://www.w3.org/2000/svg"), c.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink"), c.setAttribute("viewBox", `${r} ${a} ${s} ${l}`), c.setAttribute("width", s.toString()), c.setAttribute("height", l.toString()), t && this.backgroundColor) {
      const o = document.createElement("rect");
      o.setAttribute("width", "100%"), o.setAttribute("height", "100%"), o.setAttribute("fill", this.backgroundColor), c.appendChild(o);
    }
    return this._fromData(n, (o, { penColor: d }) => {
      const f = document.createElement("path");
      if (!isNaN(o.control1.x) && !isNaN(o.control1.y) && !isNaN(o.control2.x) && !isNaN(o.control2.y)) {
        const w = `M ${o.startPoint.x.toFixed(3)},${o.startPoint.y.toFixed(3)} C ${o.control1.x.toFixed(3)},${o.control1.y.toFixed(3)} ${o.control2.x.toFixed(3)},${o.control2.y.toFixed(3)} ${o.endPoint.x.toFixed(3)},${o.endPoint.y.toFixed(3)}`;
        f.setAttribute("d", w), f.setAttribute("stroke-width", (o.endWidth * 2.25).toFixed(3)), f.setAttribute("stroke", d), f.setAttribute("fill", "none"), f.setAttribute("stroke-linecap", "round"), c.appendChild(f);
      }
    }, (o, { penColor: d, dotSize: f, minWidth: w, maxWidth: k }) => {
      const C = document.createElement("circle"), m = f > 0 ? f : (w + k) / 2;
      C.setAttribute("r", m.toString()), C.setAttribute("cx", o.x.toString()), C.setAttribute("cy", o.y.toString()), C.setAttribute("fill", d), c.appendChild(C);
    }), c.outerHTML;
  }
}
var Ou = /* @__PURE__ */ y("<span class=text-pink-600>*"), Au = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Ru = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), Nu = /* @__PURE__ */ y('<svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4">'), Vu = /* @__PURE__ */ y('<svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M5 13l4 4L19 7">'), Tu = /* @__PURE__ */ y('<svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">'), Pu = /* @__PURE__ */ y('<div><div class="border-b border-gray-300/40 dark:border-gray-200/10 p-2"><div class="flex items-start gap-2"><div class="font-light text-sm space-y-2 py-2.5 px-2 flex-1"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 flex items-center gap-2 shrink-0"></div></div><div class="font-light text-sm space-x-2 py-2.5 px-2 space-y-4"><div class=preview-class><div class="container mx-auto space-y-3 "><canvas id=signature-pad class="relative rounded-lg w-full bg-white border-b-8 border-gray-100 border"></canvas></div></div></div><div></div><div class=pb-4>'), Du = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), ju = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Ku = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="text-justify mr-1">');
const Kr = (e) => {
  const [t, n] = z(""), [i, r] = z([]), [a, s] = z(""), [l, c] = z(!0), o = e.config, [d] = z(o.formMode > 1 ? !0 : e.component.disableInput), [f, w] = z(!1), k = () => {
    f() ? w(!1) : w(!0);
  }, [C] = z(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [m] = z(o.formMode > 2 && e.comments == 0);
  $e(() => {
    const _ = document.querySelector("canvas"), L = new $t(_);
    if (L.clear(), r(L.toData()), s(L.toDataURL("image/png")), e.value[0]) {
      c(!1), e.value[0].value;
      let V = e.value[0].signature;
      const v = new $t(_);
      v.clear(), v.fromData(V);
    }
  });
  const u = () => {
    $e(() => {
      const _ = document.querySelector("canvas");
      let L = Math.max(window.devicePixelRatio || 1, 1);
      if (_ && (_.width = _.offsetWidth * L, _.height = _.width * (window.innerWidth < 720 ? 0.28 : 0.18), _.getContext("2d").scale(L, L), e.value[0])) {
        c(!1);
        let V = e.value[0].value, v = e.value[0].signature;
        const h = new $t(_);
        h.clear(), h.fromData(v), n(V);
      }
    });
  };
  window.onresize = u, u();
  const x = (_) => {
    const L = document.querySelector("canvas");
    new $t(L).clear(), c(!0);
    let v = JSON.parse(JSON.stringify(e.value));
    v = [], e.onValueChange(v);
  }, $ = (_) => {
    const V = document.querySelector("canvas").toDataURL();
    if (i().length > 0) {
      let v = JSON.parse(JSON.stringify(e.value));
      v = [], v.push({
        value: V,
        type: "image/png",
        signature: i()
      }), e.onValueChange(v), Ke("Signature acquired!");
    } else
      me("Please provide the appropriate signature!");
  }, S = (_) => {
    if (_.preventDefault(), e.value[0]) {
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
    var _ = Pu(), L = _.firstChild, V = L.firstChild, v = V.firstChild, h = v.firstChild, b = h.firstChild, O = h.nextSibling, E = v.nextSibling, M = V.nextSibling, I = M.nextSibling, A = I.nextSibling;
    return p(h, g(D, {
      get when() {
        return e.component.required;
      },
      get children() {
        return Ou();
      }
    }), null), p(h, g(D, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var R = Au();
        return R.$$click = k, R;
      }
    }), null), p(O, g(D, {
      get when() {
        return f();
      },
      get children() {
        var R = Ru();
        return P(() => R.innerHTML = e.component.hint), R;
      }
    })), p(E, g(D, {
      get when() {
        return e.value[0];
      },
      get children() {
        return g(je, {
          color: "teal",
          onClick: (R) => S(R),
          get children() {
            return Nu();
          }
        });
      }
    }), null), p(E, g(D, {
      get when() {
        return l();
      },
      get children() {
        return g(je, {
          color: "teal",
          onClick: (R) => $(),
          get children() {
            return Vu();
          }
        });
      }
    }), null), p(E, g(je, {
      color: "amber",
      onClick: (R) => x(),
      get children() {
        return Tu();
      }
    }), null), p(E, g(D, {
      get when() {
        return C();
      },
      get children() {
        return g(Re, {
          get disabled() {
            return m();
          },
          onClick: () => e.openRemark(e.component.dataKey),
          get comments() {
            return e.comments;
          }
        });
      }
    }), null), p(A, g(D, {
      get when() {
        var R;
        return ((R = e.validationMessage) == null ? void 0 : R.length) > 0;
      },
      get children() {
        return g(ce, {
          get each() {
            return e.validationMessage;
          },
          children: (R) => (() => {
            var N = Ku(), K = N.firstChild, H = K.firstChild;
            return p(K, g(we, {
              get children() {
                return [g(te, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return Du();
                  }
                }), g(te, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return ju();
                  }
                })];
              }
            }), H), H.innerHTML = R, P((T) => X(K, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, T)), N;
          })()
        });
      }
    })), P((R) => {
      var N = e.component.label, K = {
        " border-b border-orange-500 pb-3 ": e.classValidation === 1,
        " border-b border-pink-600 pb-3 ": e.classValidation === 2
      };
      return N !== R.e && (b.innerHTML = R.e = N), R.t = X(I, K, R.t), R;
    }, {
      e: void 0,
      t: void 0
    }), _;
  })();
};
he(["click"]);
var zu = /* @__PURE__ */ y("<svg>");
function Fu(e, t) {
  return (() => {
    var n = zu();
    return Hn(n, et(() => e.a, t, {
      get color() {
        return t.color || "currentColor";
      },
      get height() {
        return t.size || "1em";
      },
      get width() {
        return t.size || "1em";
      },
      xmlns: "http://www.w3.org/2000/svg",
      get style() {
        return Xe(Ce({}, typeof t.style == "object" ? t.style : {}), {
          overflow: "visible"
        });
      },
      get innerHTML() {
        return _e(() => !!t.title)() ? `${e.c}<title>${t.title}</title>` : e.c;
      },
      src: void 0
    }), !0, !1), n;
  })();
}
function zr(e) {
  return Fu({ a: { fill: "none", stroke: "currentColor", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", viewBox: "0 0 24 24" }, c: '<path d="M6 9 12 15 18 9"/>' }, e);
}
var Bu = /* @__PURE__ */ y("<span class=text-pink-600>*"), Hu = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Uu = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), Si = /* @__PURE__ */ y('<input type=number class="w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400block pr-20"placeholder>'), Ju = /* @__PURE__ */ y("<div class=shrink-0>"), Wu = /* @__PURE__ */ y('<div class="grid md:grid-cols-3 p-2 border-b border-gray-300/[.40] dark:border-gray-200/[.10]"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 md:col-span-2 flex items-start gap-2"><div class="flex-1 relative"><div class="absolute inset-y-0 right-0 flex items-center">'), qu = /* @__PURE__ */ y('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), Gu = /* @__PURE__ */ y('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Yu = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="grid grid-cols-12"><div class="col-span-11 text-justify mr-1">');
const Qu = (e) => {
  const [t] = it(), [n] = rt(), i = e.config, [r, a] = z(i.formMode > 1 ? !0 : e.component.disableInput), [s, l] = z(""), [c, o] = z(!1), [d, f] = z([]), [w, k] = z(""), [C, m] = z(!1), u = () => {
    C() ? m(!1) : m(!0);
  }, [x] = z(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [$] = z(i.formMode > 2 && e.comments == 0);
  let S = (_, L, V) => {
    if (V == 2 && L.value != "" && L.value != null) {
      let v = JSON.parse(JSON.stringify(e.value));
      v = [], v.push({
        value: _,
        unit: L
      }), e.onValueChange(v);
    } else {
      let v = JSON.parse(JSON.stringify(e.value));
      v = [], v.push({
        value: _,
        unit: L
      }), e.onValueChange(v);
    }
  };
  switch (e.component.typeOption) {
    case 1: {
      try {
        let _ = e.component.options.map((V, v) => ({
          value: V.value,
          label: V.label
        })), L = e.value && e.value != "" && e.value[0].unit && e.value[0].unit.value && e.value[0].unit.value != "" ? e.value[0].unit.value : "";
        $e(() => {
          l(e.component.label), f(_);
          let V = _.filter((v) => v.value.includes(L))[0] && L != "" ? _.filter((v) => v.value.includes(L))[0].label : "Select Unit";
          k(V), o(!0);
        });
      } catch (_) {
        me(n.details.language[0].fetchFailed);
      }
      break;
    }
    case 2: {
      try {
        if (i.lookupMode === 1) {
          let _ = e.component.sourceAPI[0], L = `${_.baseUrl}`;
          if (_.filterDependencies !== void 0 && _.filterDependencies.length > 0) {
            let O, E, M = L;
            O = _.filterDependencies.map((I, A) => {
              let R = I.sourceAnswer.split("@"), N = t.details.find((K) => K.dataKey == R[0]);
              if (N.answer) {
                const K = N.answer;
                if (K.length > 0) {
                  let H = encodeURI(K[K.length - 1].value);
                  E = `${I.params}=${H}`;
                }
              } else
                a(!0);
              return E;
            }).join("&"), L = `${M}?${O}`;
          }
          if (_.subResourceDependencies !== void 0 && _.subResourceDependencies.length > 0) {
            let O, E, M = L;
            O = _.subResourceDependencies.map((I, A) => {
              let R = I.sourceAnswer.split("@"), N = t.details.find((K) => K.dataKey == R[0]);
              if (N.answer) {
                const K = N.answer;
                K.length > 0 && (E = `${encodeURI(K[K.length - 1].value)}/${I.params}`);
              } else
                a(!0);
              return E;
            }).join("/"), L = `${M}/${O}`;
          }
          const V = {
            headers: _.headers,
            method: "GET"
          }, v = (O) => de(null, null, function* () {
            return yield fetch(O, V).catch((E) => ({
              success: !1,
              data: {},
              message: "500"
            })).then((E) => de(null, null, function* () {
              if (E.status === 200) {
                let M = yield E.json(), I = new Object();
                return I.success = !0, I.data = _.data !== "" ? M[_.data] : M, I.message = M.msg, I;
              } else
                return {
                  success: !1,
                  data: {},
                  message: E.status
                };
            })).then((E) => E);
          }), [h] = Ut(() => L, v);
          let b = e.value && e.value != "" && e.value[0].unit && e.value[0].unit.value && e.value[0].unit.value != "" ? e.value[0].unit.value : "";
          $e(() => {
            if (l(e.component.label), h())
              if (!h().success)
                me(n.details.language[0].fetchFailed);
              else {
                let O = [];
                h().data.map((M, I) => {
                  O.push({
                    value: M[_.value],
                    label: M[_.label]
                  });
                });
                let E = O.find((M) => M.value == b) && b != "" ? O.find((M) => M.value == b).label : "Select Unit";
                f(O), k(E), o(!0);
              }
          });
        } else if (i.lookupMode === 2) {
          let _, L = [];
          _ = e.component.sourceSelect;
          let V = _[0].id, v = _[0].version;
          _[0].parentCondition.length > 0 && _[0].parentCondition.map((O, E) => {
            let M = O.value.split("@"), I = t.details.find((A) => A.dataKey == M[0]);
            if (I.answer) {
              const A = I.answer;
              if (A.length > 0) {
                let R = A[A.length - 1].value.toString();
                L.push({
                  key: O.key,
                  value: R
                });
              }
            }
          });
          let h = (O) => {
            let E = [];
            if (O.data.length > 0) {
              let M = _[0].value, I = _[0].desc, A = e.value && e.value != "" && e.value[0].unit && e.value[0].unit.value && e.value[0].unit.value != "" ? e.value[0].unit.value : "";
              O.data.map((N, K) => {
                E.push({
                  value: N[M],
                  label: N[I]
                });
              });
              let R = E.find((N) => N.value == A) && A != "" ? E.find((N) => N.value == A).label : "Select Unit";
              l(e.component.label), f(E), k(R), o(!0);
            }
          };
          const b = e.MobileOfflineSearch(V, v, L, h);
        }
      } catch (_) {
        me(n.details.language[0].fetchFailed);
      }
      break;
    }
    case 3: {
      try {
        let _, L, V = e.value && e.value != "" && e.value[0].unit && e.value[0].unit.value && e.value[0].unit.value != "" ? e.value[0].unit.value : "";
        if (e.component.sourceOption !== void 0 && e.component.typeOption === 3) {
          const h = t.details.findIndex((b) => b.dataKey === e.component.sourceOption);
          t.details[h].type, _ = t.details[h].answer, _ != null ? L = _.filter((b, O) => b.value != 0).map((b, O) => ({
            value: b.value,
            label: b.label
          })) : L = [];
        }
        let v = L.find((h) => h.value == V) && V != "" ? L.find((h) => h.value == V).label : "Select Unit";
        $e(() => {
          l(e.component.label), f(L), k(v), o(!0);
        });
      } catch (_) {
        me(n.details.language[0].fetchFailed);
      }
      break;
    }
    default: {
      try {
        let _;
        e.component.options ? _ = e.component.options.map((V, v) => ({
          value: V.value,
          label: V.label
        })) : _ = [];
        let L = e.value && e.value != "" && e.value[0].unit && e.value[0].unit.value && e.value[0].unit.value != "" ? e.value[0].unit.value : "";
        $e(() => {
          l(e.component.label), f(_);
          let V = _.filter((v) => v.value.includes(L))[0] && L != "" ? _.filter((v) => v.value.includes(L))[0].label : "Select Unit";
          k(V), o(!0);
        });
      } catch (_) {
        me(n.details.language[0].fetchFailed);
      }
      break;
    }
  }
  return (() => {
    var _ = Wu(), L = _.firstChild, V = L.firstChild, v = V.firstChild, h = V.nextSibling, b = L.nextSibling, O = b.firstChild, E = O.firstChild;
    return p(V, g(D, {
      get when() {
        return e.component.required;
      },
      get children() {
        return Bu();
      }
    }), null), p(V, g(D, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var M = Hu();
        return M.$$click = u, M;
      }
    }), null), p(h, g(D, {
      get when() {
        return C();
      },
      get children() {
        var M = Uu();
        return P(() => M.innerHTML = e.component.hint), M;
      }
    })), p(O, g(D, {
      get when() {
        return e.component.lengthInput === void 0;
      },
      get children() {
        var M = Si();
        return M.addEventListener("change", (I) => {
          S(I ? I.currentTarget.value : "", e.value != null && e.value != "" ? e.value[0].unit ? e.value[0].unit : {
            value: "",
            label: ""
          } : {
            value: "",
            label: ""
          }, 1);
        }), P((I) => {
          var A = e.component.dataKey, R = {
            " border border-solid border-gray-300 ": e.classValidation === 0,
            " border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
            " border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
          }, N = r();
          return A !== I.e && U(M, "name", I.e = A), I.t = X(M, R, I.t), N !== I.a && (M.disabled = I.a = N), I;
        }, {
          e: void 0,
          t: void 0,
          a: void 0
        }), P(() => M.value = e.value != null && e.value != "" ? e.value[0].value : ""), M;
      }
    }), E), p(O, g(D, {
      get when() {
        return _e(() => e.component.lengthInput !== void 0)() && e.component.lengthInput.length > 0;
      },
      get children() {
        var M = Si();
        return M.$$input = (I) => {
          const A = I.currentTarget;
          A.value.length > A.maxLength && (A.value = A.value.slice(0, A.maxLength));
        }, M.addEventListener("change", (I) => {
          S(I ? I.currentTarget.value : "", e.value != null && e.value != "" ? e.value[0].unit ? e.value[0].unit : {
            value: "",
            label: ""
          } : {
            value: "",
            label: ""
          }, 1);
        }), P((I) => {
          var A = e.component.dataKey, R = {
            " border border-solid border-gray-300 ": e.classValidation === 0,
            " border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
            " border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
          }, N = r(), K = e.component.lengthInput[0].maxlength !== void 0 ? e.component.lengthInput[0].maxlength : "", H = e.component.lengthInput[0].minlength !== void 0 ? e.component.lengthInput[0].minlength : "", T = e.component.rangeInput && e.component.rangeInput[0].max !== void 0 ? e.component.rangeInput[0].max : "", j = e.component.rangeInput && e.component.rangeInput[0].min !== void 0 ? e.component.rangeInput[0].min : "";
          return A !== I.e && U(M, "name", I.e = A), I.t = X(M, R, I.t), N !== I.a && (M.disabled = I.a = N), K !== I.o && U(M, "maxlength", I.o = K), H !== I.i && U(M, "minlength", I.i = H), T !== I.n && U(M, "max", I.n = T), j !== I.s && U(M, "min", I.s = j), I;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0,
          i: void 0,
          n: void 0,
          s: void 0
        }), P(() => M.value = e.value != null && e.value != "" ? e.value[0].value : ""), M;
      }
    }), E), p(O, g(D, {
      get when() {
        var M;
        return ((M = e.validationMessage) == null ? void 0 : M.length) > 0;
      },
      get children() {
        return g(ce, {
          get each() {
            return e.validationMessage;
          },
          children: (M) => (() => {
            var I = Yu(), A = I.firstChild, R = A.firstChild;
            return p(A, g(we, {
              get children() {
                return [g(te, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return qu();
                  }
                }), g(te, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return Gu();
                  }
                })];
              }
            }), R), R.innerHTML = M, P((N) => X(A, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, N)), I;
          })()
        });
      }
    }), E), p(E, g(At, et({
      class: "formgear-select-unit  w-full rounded font-light text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-0 border-transparent focus:outline-none  disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
    }, () => Ot(d() || [], {
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
          label: w
        };
      }
    })), null), p(E, g(zr, {
      size: 20,
      class: "text-gray-400  mr-3"
    }), null), p(b, g(D, {
      get when() {
        return x();
      },
      get children() {
        var M = Ju();
        return p(M, g(Re, {
          get disabled() {
            return $();
          },
          onClick: () => e.openRemark(e.component.dataKey),
          get comments() {
            return e.comments;
          }
        })), M;
      }
    }), null), P(() => v.innerHTML = e.component.label), _;
  })();
};
he(["click", "input"]);
var Zu = /* @__PURE__ */ y("<span class=text-pink-600>*"), Xu = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), e0 = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), Ci = /* @__PURE__ */ y('<input type=number class="w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"placeholder>'), t0 = /* @__PURE__ */ y("<div class=shrink-0>"), n0 = /* @__PURE__ */ y('<div class="grid md:grid-cols-3 p-2 border-b border-gray-300/[.40] dark:border-gray-200/[.10]"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 md:col-span-2 flex items-start gap-2"><div class=flex-1>'), i0 = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), r0 = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), a0 = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="flex-1 text-justify">');
const Fr = (e) => {
  const t = e.config, [n] = z(t.formMode > 1 ? !0 : e.component.disableInput), [i, r] = z(!1), a = () => {
    i() ? r(!1) : r(!0);
  };
  let s = Wn((o) => {
    let d = e.component.decimalLength ? e.component.decimalLength : 2;
    e.onValueChange(parseFloat(o).toFixed(d));
  }, 1e3);
  const [l] = z(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [c] = z(t.formMode > 2 && e.comments == 0);
  return (() => {
    var o = n0(), d = o.firstChild, f = d.firstChild, w = f.firstChild, k = f.nextSibling, C = d.nextSibling, m = C.firstChild;
    return p(f, g(D, {
      get when() {
        return e.component.required;
      },
      get children() {
        return Zu();
      }
    }), null), p(f, g(D, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var u = Xu();
        return u.$$click = a, u;
      }
    }), null), p(k, g(D, {
      get when() {
        return i();
      },
      get children() {
        var u = e0();
        return P(() => u.innerHTML = e.component.hint), u;
      }
    })), p(m, g(D, {
      get when() {
        return e.component.lengthInput === void 0;
      },
      get children() {
        var u = Ci();
        return u.$$keyup = (x) => s(x.currentTarget.value), P((x) => {
          var $ = e.component.dataKey, S = {
            " border border-solid border-gray-300 ": e.classValidation === 0,
            " border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
            " border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
          }, _ = n();
          return $ !== x.e && U(u, "name", x.e = $), x.t = X(u, S, x.t), _ !== x.a && (u.disabled = x.a = _), x;
        }, {
          e: void 0,
          t: void 0,
          a: void 0
        }), P(() => u.value = e.value), u;
      }
    }), null), p(m, g(D, {
      get when() {
        return _e(() => e.component.lengthInput !== void 0)() && e.component.lengthInput.length > 0;
      },
      get children() {
        var u = Ci();
        return u.$$input = (x) => {
          const $ = x.currentTarget;
          $.value.length > $.maxLength && ($.value = $.value.slice(0, $.maxLength));
        }, u.$$keyup = (x) => s(x.currentTarget.value), P((x) => {
          var $ = e.component.dataKey, S = {
            " border border-solid border-gray-300 ": e.classValidation === 0,
            " border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
            " border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
          }, _ = n(), L = e.component.lengthInput[0].maxlength !== void 0 ? e.component.lengthInput[0].maxlength : "", V = e.component.lengthInput[0].minlength !== void 0 ? e.component.lengthInput[0].minlength : "", v = e.component.rangeInput && e.component.rangeInput[0].max !== void 0 ? e.component.rangeInput[0].max : "", h = e.component.rangeInput && e.component.rangeInput[0].min !== void 0 ? e.component.rangeInput[0].min : "";
          return $ !== x.e && U(u, "name", x.e = $), x.t = X(u, S, x.t), _ !== x.a && (u.disabled = x.a = _), L !== x.o && U(u, "maxlength", x.o = L), V !== x.i && U(u, "minlength", x.i = V), v !== x.n && U(u, "max", x.n = v), h !== x.s && U(u, "min", x.s = h), x;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0,
          i: void 0,
          n: void 0,
          s: void 0
        }), P(() => u.value = e.value), u;
      }
    }), null), p(m, g(D, {
      get when() {
        var u;
        return ((u = e.validationMessage) == null ? void 0 : u.length) > 0;
      },
      get children() {
        return g(ce, {
          get each() {
            return e.validationMessage;
          },
          children: (u) => (() => {
            var x = a0(), $ = x.firstChild, S = $.firstChild;
            return p($, g(we, {
              get children() {
                return [g(te, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return i0();
                  }
                }), g(te, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return r0();
                  }
                })];
              }
            }), S), S.innerHTML = u, P((_) => X($, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, _)), x;
          })()
        });
      }
    }), null), p(C, g(D, {
      get when() {
        return l();
      },
      get children() {
        var u = t0();
        return p(u, g(Re, {
          get disabled() {
            return c();
          },
          onClick: () => e.openRemark(e.component.dataKey),
          get comments() {
            return e.comments;
          }
        })), u;
      }
    }), null), P(() => w.innerHTML = e.component.label), o;
  })();
};
he(["click", "keyup", "input"]);
var l0 = /* @__PURE__ */ y("<span class=text-pink-600>*"), s0 = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), o0 = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400">'), d0 = /* @__PURE__ */ y('<svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z">'), c0 = /* @__PURE__ */ y('<div class="col-span-12 px-2 pb-2"><div class="flex items-start gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4 shrink-0 mt-0.5 text-red-500"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg><p class="text-xs text-red-600 dark:text-red-400">Microphone access denied. To enable recording, allow microphone access in your browser settings and reload the page.'), u0 = /* @__PURE__ */ y('<div class="col-span-12 px-2 pb-2"><div class="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2"><span class="h-2 w-2 rounded-full bg-red-500 animate-pulse shrink-0"></span><span class="text-xs font-medium text-red-600 dark:text-red-400">Recording '), g0 = /* @__PURE__ */ y('<button class="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"title="Remove recording"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">'), h0 = /* @__PURE__ */ y('<svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"viewBox="0 0 24 24"fill=currentColor><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z">'), f0 = /* @__PURE__ */ y('<div class="col-span-12 px-2 py-2"><div class="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-3"><div class="flex items-center gap-2"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4 shrink-0 text-gray-400"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg><span class="text-xs font-medium text-gray-600 dark:text-gray-300 truncate flex-1"></span></div><audio></audio><div class="flex items-center gap-3"><button class="flex-shrink-0 w-9 h-9 rounded-full bg-pink-500 hover:bg-pink-600 text-white flex items-center justify-center transition-colors shadow-sm"></button><div class="flex-1 flex flex-col gap-1"><input type=range min=0 class="w-full h-1.5 rounded-full accent-pink-500 cursor-pointer"><div class="flex justify-between text-xs text-gray-400 tabular-nums"><span></span><span>'), m0 = /* @__PURE__ */ y('<div><div class="grid grid-cols-12 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2 col-span-11"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm space-x-2 py-2.5 px-2 space-y-4 flex justify-end -mt-2"></div><div class=col-span-12></div><div class="col-span-12 pb-4">'), v0 = /* @__PURE__ */ y('<svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><rect x=6 y=6 width=12 height=12 rx=2 stroke-linecap=round stroke-linejoin=round>'), b0 = /* @__PURE__ */ y('<svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4 ml-0.5"viewBox="0 0 24 24"fill=currentColor><path d="M8 5v14l11-7z">'), w0 = /* @__PURE__ */ y('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), x0 = /* @__PURE__ */ y('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), y0 = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="grid grid-cols-12"><div class="col-span-11 text-justify mr-1">');
const Br = (e) => {
  const [t, n] = z(""), [i, r] = z(""), [a, s] = z(!1), [l, c] = z(0), [o, d] = z(0);
  let f;
  const w = e.config, [k] = z(w.formMode > 1 ? !0 : e.component.disableInput), [C, m] = z("unknown");
  navigator.permissions && navigator.permissions.query({
    name: "microphone"
  }).then((T) => {
    m(T.state), T.onchange = () => m(T.state);
  }).catch(() => m("unknown")), $e(() => {
    e.value[0] ? (n(e.value[0].value), r(e.value[0].label || "")) : (n(""), r(""));
  });
  const [u, x] = z(!1), [$, S] = z(0);
  let _ = null, L = [], V = null, v = null;
  _t(() => {
    v && v.getTracks().forEach((T) => T.stop()), V && clearInterval(V);
  });
  const h = () => de(null, null, function* () {
    try {
      const T = yield navigator.mediaDevices.getUserMedia({
        audio: !0
      });
      v = T, m("granted"), L = [], _ = new MediaRecorder(T), _.ondataavailable = (j) => {
        j.data.size > 0 && L.push(j.data);
      }, _.onstop = () => {
        var G;
        const j = (_ == null ? void 0 : _.mimeType) || "audio/webm", F = new Blob(L, {
          type: j
        }), J = ((G = j.split("/")[1]) == null ? void 0 : G.split(";")[0]) || "webm", B = `recording_${Date.now()}.${J}`, Z = new FileReader();
        Z.readAsDataURL(F), Z.onload = (ne) => {
          const ae = ne.target.result;
          e.onValueChange([{
            value: ae,
            label: B,
            type: j
          }]), tt("Audio recorded successfully!");
        }, T.getTracks().forEach((ne) => ne.stop()), v = null;
      }, _.start(), x(!0), S(0), V = setInterval(() => S((j) => j + 1), 1e3);
    } catch (T) {
      (T == null ? void 0 : T.name) === "NotAllowedError" || (T == null ? void 0 : T.name) === "PermissionDeniedError" ? (m("denied"), me("Microphone permission denied. Please allow microphone access in your browser settings.")) : me("Microphone not available.");
    }
  }), b = () => {
    _ == null || _.stop(), x(!1), V && (clearInterval(V), V = null);
  }, O = () => {
    f && !f.paused && f.pause(), s(!1), c(0), d(0), e.onValueChange([]);
  }, E = () => {
    a() ? (f.pause(), s(!1)) : (f.play(), s(!0));
  }, M = (T) => {
    if (!isFinite(T) || isNaN(T)) return "0:00";
    const j = Math.floor(T / 60).toString().padStart(2, "0"), F = Math.floor(T % 60).toString().padStart(2, "0");
    return `${j}:${F}`;
  }, I = () => {
    const T = $(), j = Math.floor(T / 60).toString().padStart(2, "0"), F = (T % 60).toString().padStart(2, "0");
    return `${j}:${F}`;
  }, [A, R] = z(!1), N = () => R((T) => !T), [K] = z(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [H] = z(w.formMode > 2 && e.comments == 0);
  return (() => {
    var T = m0(), j = T.firstChild, F = j.firstChild, J = F.firstChild, B = J.firstChild, Z = J.nextSibling, G = F.nextSibling, ne = G.nextSibling, ae = ne.nextSibling;
    return p(J, g(D, {
      get when() {
        return e.component.required;
      },
      get children() {
        return l0();
      }
    }), null), p(J, g(D, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var Q = s0();
        return Q.$$click = N, Q;
      }
    }), null), p(Z, g(D, {
      get when() {
        return A();
      },
      get children() {
        var Q = o0();
        return P(() => Q.innerHTML = e.component.hint), Q;
      }
    })), p(G, g(D, {
      get when() {
        return C() !== "denied";
      },
      get children() {
        return g(D, {
          get when() {
            return !u();
          },
          get fallback() {
            return g(je, {
              color: "amber",
              disabled: !1,
              onClick: b,
              get children() {
                return v0();
              }
            });
          },
          get children() {
            return g(je, {
              color: "pink",
              get disabled() {
                return k();
              },
              onClick: h,
              get children() {
                return d0();
              }
            });
          }
        });
      }
    }), null), p(G, g(D, {
      get when() {
        return K();
      },
      get children() {
        return g(Re, {
          get disabled() {
            return H();
          },
          onClick: () => e.openRemark(e.component.dataKey),
          get comments() {
            return e.comments;
          }
        });
      }
    }), null), p(j, g(D, {
      get when() {
        return C() === "denied";
      },
      get children() {
        return c0();
      }
    }), ne), p(j, g(D, {
      get when() {
        return u();
      },
      get children() {
        var Q = u0(), Y = Q.firstChild, W = Y.firstChild, q = W.nextSibling;
        return q.firstChild, p(q, I, null), Q;
      }
    }), ne), p(j, g(D, {
      get when() {
        return t() != "";
      },
      get children() {
        var Q = f0(), Y = Q.firstChild, W = Y.firstChild, q = W.firstChild, le = q.nextSibling, re = W.nextSibling, fe = re.nextSibling, ve = fe.firstChild, ye = ve.nextSibling, Se = ye.firstChild, ue = Se.nextSibling, ke = ue.firstChild, Ne = ke.nextSibling;
        p(le, i), p(W, g(D, {
          get when() {
            return !k();
          },
          get children() {
            var Le = g0();
            return Le.$$click = O, Le;
          }
        }), null), re.addEventListener("ended", () => s(!1)), re.addEventListener("loadedmetadata", () => d(f.duration)), re.addEventListener("timeupdate", () => c(f.currentTime));
        var ze = f;
        return typeof ze == "function" ? nt(ze, re) : f = re, ve.$$click = E, p(ve, g(D, {
          get when() {
            return a();
          },
          get fallback() {
            return b0();
          },
          get children() {
            return h0();
          }
        })), Se.$$input = (Le) => {
          const Je = +Le.target.value;
          f.currentTime = Je, c(Je);
        }, p(ke, () => M(l())), p(Ne, () => M(o())), P((Le) => {
          var Je = t(), Ve = o() || 0;
          return Je !== Le.e && U(re, "src", Le.e = Je), Ve !== Le.t && U(Se, "max", Le.t = Ve), Le;
        }, {
          e: void 0,
          t: void 0
        }), P(() => Se.value = l()), Q;
      }
    }), ne), p(ae, g(D, {
      get when() {
        var Q;
        return ((Q = e.validationMessage) == null ? void 0 : Q.length) > 0;
      },
      get children() {
        return g(ce, {
          get each() {
            return e.validationMessage;
          },
          children: (Q) => (() => {
            var Y = y0(), W = Y.firstChild, q = W.firstChild;
            return p(W, g(we, {
              get children() {
                return [g(te, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return w0();
                  }
                }), g(te, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return x0();
                  }
                })];
              }
            }), q), q.innerHTML = Q, P((le) => X(W, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, le)), Y;
          })()
        });
      }
    })), P((Q) => {
      var Y = e.component.label, W = {
        " border-b border-orange-500 pb-3 ": e.classValidation === 1,
        " border-b border-pink-600 pb-3 ": e.classValidation === 2
      };
      return Y !== Q.e && (B.innerHTML = Q.e = Y), Q.t = X(ne, W, Q.t), Q;
    }, {
      e: void 0,
      t: void 0
    }), T;
  })();
};
he(["click", "input"]);
var p0 = /* @__PURE__ */ y("<span class=text-pink-600>*"), k0 = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), $0 = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400">'), _0 = /* @__PURE__ */ y('<svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z">'), S0 = /* @__PURE__ */ y('<div class="col-span-12 px-2 pb-2"><div class="flex items-start gap-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg px-3 py-2"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4 shrink-0 mt-0.5 text-yellow-500"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg><p class="text-xs text-yellow-700 dark:text-yellow-300">Barcode scanning is not supported in this browser. Please use Chrome or Edge on Android.'), C0 = /* @__PURE__ */ y('<div class="col-span-12 px-2 pb-2"><div class="flex items-start gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4 shrink-0 mt-0.5 text-red-500"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg><p class="text-xs text-red-600 dark:text-red-400">Camera access denied. To enable barcode scanning, allow camera access in your browser settings and reload the page.'), M0 = /* @__PURE__ */ y('<div class="col-span-12 px-2 pb-2"><div class="relative bg-black rounded-lg overflow-hidden"><video muted playsinline class="w-full max-h-64 object-cover"></video><div class="absolute inset-0 flex items-center justify-center pointer-events-none"><div class="w-48 h-48 border-2 border-pink-400 rounded-lg opacity-80"></div></div><div class="absolute bottom-2 left-0 right-0 flex justify-center"><span class="text-xs text-white bg-black/60 rounded-full px-3 py-1">Point camera at barcode'), I0 = /* @__PURE__ */ y('<div class="col-span-12 px-2 py-2"><div class="flex items-start gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-3 py-2"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4 shrink-0 mt-0.5 text-green-500 dark:text-green-400"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span class="font-mono text-xs text-gray-700 dark:text-gray-200 break-all">'), E0 = /* @__PURE__ */ y('<div><div class="grid grid-cols-12 border-b border-gray-300/40 dark:border-gray-200/10 p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2 col-span-11"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm space-x-2 py-2.5 px-2 space-y-4 flex justify-end -mt-2"></div><div class=col-span-12></div><div class="col-span-12 pb-4">'), L0 = /* @__PURE__ */ y('<svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><rect x=6 y=6 width=12 height=12 rx=2 stroke-linecap=round stroke-linejoin=round>'), O0 = /* @__PURE__ */ y('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), A0 = /* @__PURE__ */ y('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), R0 = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="grid grid-cols-12"><div class="col-span-11 text-justify mr-1">');
const Hr = (e) => {
  const [t, n] = z(""), i = e.config, [r] = z(i.formMode > 1 ? !0 : e.component.disableInput);
  $e(() => {
    e.value[0] && n(e.value[0].value || "");
  });
  const a = "BarcodeDetector" in window, [s, l] = z("unknown");
  navigator.permissions && navigator.permissions.query({
    name: "camera"
  }).then((L) => {
    l(L.state), L.onchange = () => l(L.state);
  }).catch(() => l("unknown"));
  const [c, o] = z(!1);
  let d = null, f, w = null;
  _t(() => {
    w !== null && cancelAnimationFrame(w), d && d.getTracks().forEach((L) => L.stop());
  });
  const k = () => {
    w !== null && (cancelAnimationFrame(w), w = null), d && (d.getTracks().forEach((L) => L.stop()), d = null), f && (f.srcObject = null), o(!1);
  }, C = () => de(null, null, function* () {
    try {
      d = yield navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment"
        }
      }), l("granted"), o(!0);
    } catch (L) {
      (L == null ? void 0 : L.name) === "NotAllowedError" || (L == null ? void 0 : L.name) === "PermissionDeniedError" ? (l("denied"), me("Camera permission denied. Please allow camera access in your browser settings.")) : me("Camera not available.");
    }
  }), m = (L) => {
    f = L, d && (L.srcObject = d, L.play().then(() => {
      const V = new window.BarcodeDetector({
        formats: ["qr_code", "ean_13", "ean_8", "code_128", "code_39", "upc_a", "upc_e", "itf", "pdf417", "aztec", "data_matrix"]
      }), v = () => de(null, null, function* () {
        if (c()) {
          try {
            const h = yield V.detect(L);
            if (h.length > 0) {
              const b = h[0].rawValue;
              e.onValueChange([{
                value: b,
                label: b,
                type: h[0].format
              }]), n(b), tt("Barcode scanned successfully!"), k();
              return;
            }
          } catch (h) {
          }
          w = requestAnimationFrame(v);
        }
      });
      w = requestAnimationFrame(v);
    }));
  }, [u, x] = z(!1), $ = () => x((L) => !L), [S] = z(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [_] = z(i.formMode > 2 && e.comments == 0);
  return (() => {
    var L = E0(), V = L.firstChild, v = V.firstChild, h = v.firstChild, b = h.firstChild, O = h.nextSibling, E = v.nextSibling, M = E.nextSibling, I = M.nextSibling;
    return p(h, g(D, {
      get when() {
        return e.component.required;
      },
      get children() {
        return p0();
      }
    }), null), p(h, g(D, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var A = k0();
        return A.$$click = $, A;
      }
    }), null), p(O, g(D, {
      get when() {
        return u();
      },
      get children() {
        var A = $0();
        return P(() => A.innerHTML = e.component.hint), A;
      }
    })), p(E, g(D, {
      get when() {
        return a && s() !== "denied";
      },
      get children() {
        return g(D, {
          get when() {
            return !c();
          },
          get fallback() {
            return g(je, {
              color: "amber",
              disabled: !1,
              onClick: k,
              get children() {
                return L0();
              }
            });
          },
          get children() {
            return g(je, {
              color: "pink",
              get disabled() {
                return r();
              },
              onClick: C,
              get children() {
                return _0();
              }
            });
          }
        });
      }
    }), null), p(E, g(D, {
      get when() {
        return S();
      },
      get children() {
        return g(Re, {
          get disabled() {
            return _();
          },
          onClick: () => e.openRemark(e.component.dataKey),
          get comments() {
            return e.comments;
          }
        });
      }
    }), null), p(V, g(D, {
      when: !a,
      get children() {
        return S0();
      }
    }), M), p(V, g(D, {
      get when() {
        return a && s() === "denied";
      },
      get children() {
        return C0();
      }
    }), M), p(V, g(D, {
      get when() {
        return c();
      },
      get children() {
        var A = M0(), R = A.firstChild, N = R.firstChild;
        return nt((K) => m(K), N), A;
      }
    }), M), p(V, g(D, {
      get when() {
        return t() != "";
      },
      get children() {
        var A = I0(), R = A.firstChild, N = R.firstChild, K = N.nextSibling;
        return p(K, t), A;
      }
    }), M), p(I, g(D, {
      get when() {
        var A;
        return ((A = e.validationMessage) == null ? void 0 : A.length) > 0;
      },
      get children() {
        return g(ce, {
          get each() {
            return e.validationMessage;
          },
          children: (A) => (() => {
            var R = R0(), N = R.firstChild, K = N.firstChild;
            return p(N, g(we, {
              get children() {
                return [g(te, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return O0();
                  }
                }), g(te, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return A0();
                  }
                })];
              }
            }), K), K.innerHTML = A, P((H) => X(N, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, H)), R;
          })()
        });
      }
    })), P((A) => {
      var R = e.component.label, N = {
        " border-b border-orange-500 pb-3 ": e.classValidation === 1,
        " border-b border-pink-600 pb-3 ": e.classValidation === 2
      };
      return R !== A.e && (b.innerHTML = A.e = R), A.t = X(M, N, A.t), A;
    }, {
      e: void 0,
      t: void 0
    }), L;
  })();
};
he(["click"]);
var N0 = /* @__PURE__ */ y("<span class=text-pink-600>*"), V0 = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), T0 = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400">'), P0 = /* @__PURE__ */ y('<svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z">'), D0 = /* @__PURE__ */ y('<div class="col-span-12 px-2 pb-2"><div class="flex items-start gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4 shrink-0 mt-0.5 text-red-500"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg><p class="text-xs text-red-600 dark:text-red-400">Camera access denied. To enable video recording, allow camera access in your browser settings and reload the page.'), j0 = /* @__PURE__ */ y('<div class="col-span-12 px-2 pb-2"><div class="relative bg-black rounded-lg overflow-hidden"><video muted playsinline class="w-full max-h-64 object-cover"></video><div class="absolute top-2 left-2 flex items-center gap-1.5 bg-black/60 rounded-full px-2 py-1"><span class="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span><span class="text-xs font-medium text-white tabular-nums">'), K0 = /* @__PURE__ */ y('<button class="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"title="Remove recording"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">'), z0 = /* @__PURE__ */ y('<div class="col-span-12 px-2 py-2"><div class="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"><video controls class="w-full max-h-64"></video><div class="flex items-center gap-2 px-3 py-2 text-gray-500 dark:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4 shrink-0"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg><span class="text-xs font-medium text-gray-600 dark:text-gray-300 truncate flex-1">'), F0 = /* @__PURE__ */ y('<div><div class="grid grid-cols-12 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2 col-span-11"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm space-x-2 py-2.5 px-2 space-y-4 flex justify-end -mt-2"></div><div class=col-span-12></div><div class="col-span-12 pb-4">'), B0 = /* @__PURE__ */ y('<svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><rect x=6 y=6 width=12 height=12 rx=2 stroke-linecap=round stroke-linejoin=round>'), H0 = /* @__PURE__ */ y('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), U0 = /* @__PURE__ */ y('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), J0 = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="grid grid-cols-12"><div class="col-span-11 text-justify mr-1">');
const Ur = (e) => {
  const [t, n] = z(""), [i, r] = z(""), a = e.config, [s] = z(a.formMode > 1 ? !0 : e.component.disableInput), [l, c] = z("unknown");
  navigator.permissions && navigator.permissions.query({
    name: "camera"
  }).then((E) => {
    c(E.state), E.onchange = () => c(E.state);
  }).catch(() => c("unknown")), $e(() => {
    e.value[0] ? (n(e.value[0].value), r(e.value[0].label || "")) : (n(""), r(""));
  });
  const [o, d] = z(!1), [f, w] = z(0);
  let k = null, C = [], m = null, u = null, x;
  _t(() => {
    u && u.getTracks().forEach((E) => E.stop()), m && clearInterval(m);
  });
  const $ = () => de(null, null, function* () {
    try {
      const E = yield navigator.mediaDevices.getUserMedia({
        video: !0,
        audio: !0
      });
      u = E, C = [], x && (x.srcObject = E, x.play()), k = new MediaRecorder(E), k.ondataavailable = (M) => {
        M.data.size > 0 && C.push(M.data);
      }, k.onstop = () => {
        var K;
        const M = (k == null ? void 0 : k.mimeType) || "video/webm", I = new Blob(C, {
          type: M
        }), A = ((K = M.split("/")[1]) == null ? void 0 : K.split(";")[0]) || "webm", R = `video_${Date.now()}.${A}`, N = new FileReader();
        N.readAsDataURL(I), N.onload = (H) => {
          const T = H.target.result;
          e.onValueChange([{
            value: T,
            label: R,
            type: M
          }]), tt("Video recorded successfully!");
        }, E.getTracks().forEach((H) => H.stop()), u = null, x && (x.srcObject = null);
      }, k.start(), d(!0), w(0), c("granted"), m = setInterval(() => w((M) => M + 1), 1e3);
    } catch (E) {
      (E == null ? void 0 : E.name) === "NotAllowedError" || (E == null ? void 0 : E.name) === "PermissionDeniedError" ? (c("denied"), me("Camera permission denied. Please allow camera access in your browser settings.")) : me("Camera not available.");
    }
  }), S = () => {
    k == null || k.stop(), d(!1), m && (clearInterval(m), m = null);
  }, _ = () => {
    e.onValueChange([]);
  }, L = () => {
    const E = f(), M = Math.floor(E / 60).toString().padStart(2, "0"), I = (E % 60).toString().padStart(2, "0");
    return `${M}:${I}`;
  }, [V, v] = z(!1), h = () => v((E) => !E), [b] = z(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [O] = z(a.formMode > 2 && e.comments == 0);
  return (() => {
    var E = F0(), M = E.firstChild, I = M.firstChild, A = I.firstChild, R = A.firstChild, N = A.nextSibling, K = I.nextSibling, H = K.nextSibling, T = H.nextSibling;
    return p(A, g(D, {
      get when() {
        return e.component.required;
      },
      get children() {
        return N0();
      }
    }), null), p(A, g(D, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var j = V0();
        return j.$$click = h, j;
      }
    }), null), p(N, g(D, {
      get when() {
        return V();
      },
      get children() {
        var j = T0();
        return P(() => j.innerHTML = e.component.hint), j;
      }
    })), p(K, g(D, {
      get when() {
        return l() !== "denied";
      },
      get children() {
        return g(D, {
          get when() {
            return !o();
          },
          get fallback() {
            return g(je, {
              color: "amber",
              disabled: !1,
              onClick: S,
              get children() {
                return B0();
              }
            });
          },
          get children() {
            return g(je, {
              color: "pink",
              get disabled() {
                return s();
              },
              onClick: $,
              get children() {
                return P0();
              }
            });
          }
        });
      }
    }), null), p(K, g(D, {
      get when() {
        return b();
      },
      get children() {
        return g(Re, {
          get disabled() {
            return O();
          },
          onClick: () => e.openRemark(e.component.dataKey),
          get comments() {
            return e.comments;
          }
        });
      }
    }), null), p(M, g(D, {
      get when() {
        return l() === "denied";
      },
      get children() {
        return D0();
      }
    }), H), p(M, g(D, {
      get when() {
        return o();
      },
      get children() {
        var j = j0(), F = j.firstChild, J = F.firstChild, B = J.nextSibling, Z = B.firstChild, G = Z.nextSibling;
        return nt((ne) => {
          x = ne, u && (ne.srcObject = u, ne.play());
        }, J), p(G, L), j;
      }
    }), H), p(M, g(D, {
      get when() {
        return t() != "";
      },
      get children() {
        var j = z0(), F = j.firstChild, J = F.firstChild, B = J.nextSibling, Z = B.firstChild, G = Z.nextSibling;
        return p(G, i), p(B, g(D, {
          get when() {
            return !s();
          },
          get children() {
            var ne = K0();
            return ne.$$click = _, ne;
          }
        }), null), P(() => U(J, "src", t())), j;
      }
    }), H), p(T, g(D, {
      get when() {
        var j;
        return ((j = e.validationMessage) == null ? void 0 : j.length) > 0;
      },
      get children() {
        return g(ce, {
          get each() {
            return e.validationMessage;
          },
          children: (j) => (() => {
            var F = J0(), J = F.firstChild, B = J.firstChild;
            return p(J, g(we, {
              get children() {
                return [g(te, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return H0();
                  }
                }), g(te, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return U0();
                  }
                })];
              }
            }), B), B.innerHTML = j, P((Z) => X(J, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, Z)), F;
          })()
        });
      }
    })), P((j) => {
      var F = e.component.label, J = {
        " border-b border-orange-500 pb-3 ": e.classValidation === 1,
        " border-b border-pink-600 pb-3 ": e.classValidation === 2
      };
      return F !== j.e && (R.innerHTML = j.e = F), j.t = X(H, J, j.t), j;
    }, {
      e: void 0,
      t: void 0
    }), E;
  })();
};
he(["click"]);
var W0 = /* @__PURE__ */ y("<span class=text-pink-600>*"), q0 = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), G0 = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400">'), Mi = /* @__PURE__ */ y('<svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13">'), Y0 = /* @__PURE__ */ y("<input type=file class=hidden>"), Q0 = /* @__PURE__ */ y('<div class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"><img class=w-full><div class="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4 shrink-0"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg><span class="text-xs font-medium text-gray-600 dark:text-gray-300 truncate">'), Z0 = /* @__PURE__ */ y('<div class="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-2"><div class="flex items-center gap-2 text-gray-500 dark:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4 shrink-0"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg><span class="text-xs font-medium text-gray-600 dark:text-gray-300 truncate"></span></div><audio controls class=w-full>'), X0 = /* @__PURE__ */ y('<div class="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"><video controls class="w-full max-h-64"></video><div class="flex items-center gap-2 px-3 py-2 text-gray-500 dark:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4 shrink-0"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg><span class="text-xs font-medium text-gray-600 dark:text-gray-300 truncate">'), eg = /* @__PURE__ */ y('<div class="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"><svg xmlns=http://www.w3.org/2000/svg class="h-6 w-6 text-gray-400 shrink-0"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg><span class="text-xs text-gray-600 dark:text-gray-300 truncate">'), tg = /* @__PURE__ */ y('<div class="font-light text-sm px-2 py-2.5 col-span-12 space-y-2">'), ng = /* @__PURE__ */ y('<div><div class="grid grid-cols-12 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2 col-span-11"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm space-x-2 py-2.5 px-2 space-y-4 flex justify-end -mt-2"></div><div class=col-span-12></div><div class="col-span-12 pb-4">'), ig = /* @__PURE__ */ y('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), rg = /* @__PURE__ */ y('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), ag = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="grid grid-cols-12"><div class="col-span-11 text-justify mr-1">');
const Jr = (e) => {
  const [t, n] = z(""), [i, r] = z(""), [a, s] = z(""), l = e.config, [c] = z(l.formMode > 1 ? !0 : e.component.disableInput);
  $e(() => {
    e.value[0] && (r(e.value[0].value || ""), n(e.value[0].label || ""), s(e.value[0].type || ""));
  });
  const o = (_) => {
    try {
      const L = JSON.parse(_), V = [{
        value: L.value,
        label: L.label,
        type: L.type
      }];
      e.onValueChange(V), tt("File selected successfully!");
    } catch (L) {
      me("Failed to process file result");
    }
  }, d = () => {
    e.MobileFileHandler(o);
  }, f = (_) => {
    const L = _.target;
    if (L.files && L.files[0]) {
      const V = L.files[0], v = new FileReader();
      v.readAsDataURL(V), v.onload = (h) => {
        const b = [{
          value: h.target.result,
          label: V.name,
          type: V.type
        }];
        e.onValueChange(b), tt("File uploaded successfully!");
      };
    }
  }, w = () => a().startsWith("image/"), k = () => a().startsWith("audio/"), C = () => a().startsWith("video/"), [m, u] = z(!1), x = () => u((_) => !_), [$] = z(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [S] = z(l.formMode > 2 && e.comments == 0);
  return (() => {
    var _ = ng(), L = _.firstChild, V = L.firstChild, v = V.firstChild, h = v.firstChild, b = v.nextSibling, O = V.nextSibling, E = O.nextSibling, M = E.nextSibling;
    return p(v, g(D, {
      get when() {
        return e.component.required;
      },
      get children() {
        return W0();
      }
    }), null), p(v, g(D, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var I = q0();
        return I.$$click = x, I;
      }
    }), null), p(b, g(D, {
      get when() {
        return m();
      },
      get children() {
        var I = G0();
        return P(() => I.innerHTML = e.component.hint), I;
      }
    })), p(O, g(we, {
      get children() {
        return [g(te, {
          get when() {
            return l.clientMode == 2;
          },
          get children() {
            return g(je, {
              color: "pink",
              get disabled() {
                return c();
              },
              onClick: d,
              get children() {
                return Mi();
              }
            });
          }
        }), g(te, {
          get when() {
            return l.clientMode == 1;
          },
          get children() {
            return [(() => {
              var I = Y0();
              return I.addEventListener("change", f), P(() => U(I, "id", "genericFile_" + e.component.dataKey)), I;
            })(), g(je, {
              color: "pink",
              get disabled() {
                return c();
              },
              onClick: () => document.getElementById("genericFile_" + e.component.dataKey).click(),
              get children() {
                return Mi();
              }
            })];
          }
        })];
      }
    }), null), p(O, g(D, {
      get when() {
        return $();
      },
      get children() {
        return g(Re, {
          get disabled() {
            return S();
          },
          onClick: () => e.openRemark(e.component.dataKey),
          get comments() {
            return e.comments;
          }
        });
      }
    }), null), p(L, g(D, {
      get when() {
        return i() != "";
      },
      get children() {
        var I = tg();
        return p(I, g(we, {
          get children() {
            return [g(te, {
              get when() {
                return w();
              },
              get children() {
                var A = Q0(), R = A.firstChild, N = R.nextSibling, K = N.firstChild, H = K.nextSibling;
                return p(H, t), P((T) => {
                  var j = i(), F = t();
                  return j !== T.e && U(R, "src", T.e = j), F !== T.t && U(R, "alt", T.t = F), T;
                }, {
                  e: void 0,
                  t: void 0
                }), A;
              }
            }), g(te, {
              get when() {
                return k();
              },
              get children() {
                var A = Z0(), R = A.firstChild, N = R.firstChild, K = N.nextSibling, H = R.nextSibling;
                return p(K, t), P(() => U(H, "src", i())), A;
              }
            }), g(te, {
              get when() {
                return C();
              },
              get children() {
                var A = X0(), R = A.firstChild, N = R.nextSibling, K = N.firstChild, H = K.nextSibling;
                return p(H, t), P(() => U(R, "src", i())), A;
              }
            }), g(te, {
              when: !0,
              get children() {
                var A = eg(), R = A.firstChild, N = R.nextSibling;
                return p(N, t), A;
              }
            })];
          }
        })), I;
      }
    }), E), p(M, g(D, {
      get when() {
        var I;
        return ((I = e.validationMessage) == null ? void 0 : I.length) > 0;
      },
      get children() {
        return g(ce, {
          get each() {
            return e.validationMessage;
          },
          children: (I) => (() => {
            var A = ag(), R = A.firstChild, N = R.firstChild;
            return p(R, g(we, {
              get children() {
                return [g(te, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return ig();
                  }
                }), g(te, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return rg();
                  }
                })];
              }
            }), N), N.innerHTML = I, P((K) => X(R, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, K)), A;
          })()
        });
      }
    })), P((I) => {
      var A = e.component.label, R = {
        " border-b border-orange-500 pb-3 ": e.classValidation === 1,
        " border-b border-pink-600 pb-3 ": e.classValidation === 2
      };
      return A !== I.e && (h.innerHTML = I.e = A), I.t = X(E, R, I.t), I;
    }, {
      e: void 0,
      t: void 0
    }), _;
  })();
};
he(["click"]);
var lg = /* @__PURE__ */ y("<span class=text-pink-600>*"), sg = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), og = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), dg = /* @__PURE__ */ y('<div class="grid md:grid-cols-2 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm space-x-2 py-2.5 px-2 md:col-span-1 grid grid-cols-12"><div class=col-span-12>'), cg = /* @__PURE__ */ y('<div class=mr-2><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), ug = /* @__PURE__ */ y('<div class=mr-2><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), gg = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class=flex><div>');
const at = (e) => {
  const [t, n] = z(!1), i = () => {
    t() ? n(!1) : n(!0);
  };
  return (() => {
    var r = dg(), a = r.firstChild, s = a.firstChild, l = s.firstChild, c = s.nextSibling, o = a.nextSibling, d = o.firstChild;
    return p(s, g(D, {
      get when() {
        return e.component.required;
      },
      get children() {
        return lg();
      }
    }), null), p(s, g(D, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var f = sg();
        return f.$$click = i, f;
      }
    }), null), p(c, g(D, {
      get when() {
        return t();
      },
      get children() {
        var f = og();
        return P(() => f.innerHTML = e.component.hint), f;
      }
    }), null), p(c, (() => {
      var f = _e(() => typeof e.optionSection == "function");
      return () => f() ? e.optionSection() : e.optionSection;
    })(), null), p(d, () => e.children, null), p(d, g(D, {
      get when() {
        var f;
        return ((f = e.validationMessage) == null ? void 0 : f.length) > 0;
      },
      get children() {
        return g(ce, {
          get each() {
            return e.validationMessage;
          },
          children: (f) => (() => {
            var w = gg(), k = w.firstChild, C = k.firstChild;
            return p(k, g(we, {
              get children() {
                return [g(te, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return cg();
                  }
                }), g(te, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return ug();
                  }
                })];
              }
            }), C), C.innerHTML = f, P((m) => X(k, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, m)), w;
          })()
        });
      }
    }), null), P(() => l.innerHTML = e.component.label), r;
  })();
};
he(["click"]);
const hg = (e, t) => {
  if (t == null && (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) ? t = document.querySelector(".mobile-component-div") : t = document.querySelector(".component-div")), !t) return;
  const n = t.clientHeight / 2, i = e.offsetTop, r = t.clientWidth / 2, a = e.offsetLeft;
  (a > r || i > n) && t.scrollTo({
    top: i - n,
    left: a - r,
    behavior: "smooth"
  });
}, fg = (e, t) => {
  let n = [];
  const i = [...t].sort((r, a) => a - r);
  if (t.includes(e))
    n.push(e);
  else {
    let r = e;
    for (let a = 0; a < i.length; a++)
      i[a] <= r && (n.push(i[a]), r -= i[a]);
    r !== 0 && (n = []);
  }
  return n;
}, mg = (e) => e.reduce((t, n) => t + Number(n), 0), Ii = (e) => e.map((t, n) => Xe(Ce({}, t), {
  checkboxValue: Math.pow(2, n)
})), bt = (e, t) => {
  if (t.config.clientMode == ut.PAPI) {
    const n = t.isNestedInput ? e.target.offsetParent : e.target, i = t.isNestedInput ? document.querySelector(".nested-container") : null;
    t.setInput && t.setInput("currentDataKey", t.component.dataKey), hg(n, i);
  }
}, wt = (e, t) => {
  vg(e);
}, vg = (e, t) => {
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
var bg = /* @__PURE__ */ y('<div class="grid font-light text-sm content-start">'), wg = /* @__PURE__ */ y('<div class=col-span-11><input type=text class="w-full font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400">'), xg = /* @__PURE__ */ y("<div class=col-span-11>"), yg = /* @__PURE__ */ y('<div class="font-light text-sm space-x-2 py-2.5 px-4 grid grid-cols-12"><div class="col-span-1 text-center"><label class="cursor-pointer text-sm"><input type=radio class="checked:disabled:bg-gray-500 checked:dark:disabled:bg-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"disabled>');
const pg = (e) => (() => {
  var t = bg();
  return p(t, g(ce, {
    get each() {
      return e.options;
    },
    children: (n, i) => (() => {
      var r = yg(), a = r.firstChild, s = a.firstChild, l = s.firstChild;
      return p(r, g(we, {
        get children() {
          return [g(te, {
            get when() {
              return _e(() => !!n.open)() && e.settedValue === n.value;
            },
            get children() {
              var c = wg(), o = c.firstChild;
              return o.addEventListener("change", (d) => e.onValueChange(n.value, d.currentTarget.value, n.open)), o.addEventListener("focus", (d) => bt(d, e)), o.$$keydown = (d) => wt(d), P((d) => {
                var f = e.component.dataKey, w = e.component.dataKey, k = e.disableInput;
                return f !== d.e && U(o, "name", d.e = f), w !== d.t && U(o, "id", d.t = w), k !== d.a && (o.disabled = d.a = k), d;
              }, {
                e: void 0,
                t: void 0,
                a: void 0
              }), P(() => o.value = e.value && e.value.length > 0 ? e.value[0].label : n.label), c;
            }
          }), g(te, {
            get when() {
              return !n.open || e.settedValue !== n.value;
            },
            get children() {
              var c = xg();
              return P(() => c.innerHTML = n.label), c;
            }
          })];
        }
      }), null), P((c) => {
        var o = e.component.dataKey + i(), d = e.component.dataKey, f = "radio-" + e.component.dataKey + "-" + i();
        return o !== c.e && U(s, "for", c.e = o), d !== c.t && U(l, "name", c.t = d), f !== c.a && U(l, "id", c.a = f), c;
      }, {
        e: void 0,
        t: void 0,
        a: void 0
      }), P(() => l.checked = e.settedValue === n.value), P(() => l.value = n.value), r;
    })()
  })), P((n) => {
    var i = e.component.cols === 1 || e.component.cols === void 0, r = e.component.cols === 2, a = e.component.cols === 3, s = e.component.cols === 4, l = e.component.cols === 5;
    return i !== n.e && t.classList.toggle("grid-cols-1", n.e = i), r !== n.t && t.classList.toggle("grid-cols-2", n.t = r), a !== n.a && t.classList.toggle("grid-cols-3", n.a = a), s !== n.o && t.classList.toggle("grid-cols-4", n.o = s), l !== n.i && t.classList.toggle("grid-cols-5", n.i = l), n;
  }, {
    e: void 0,
    t: void 0,
    a: void 0,
    o: void 0,
    i: void 0
  }), t;
})();
he(["keydown"]);
var Ei = /* @__PURE__ */ y("<input type=text class=formgear-input-papi placeholder>"), kg = /* @__PURE__ */ y('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), $g = /* @__PURE__ */ y('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), _g = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="grid grid-cols-12"><div class="col-span-11 text-justify mr-1">');
const Sg = (e) => {
  const t = e.config, [n] = z(t.formMode > 1 && t.initialMode == 2 ? !0 : t.initialMode == 1 && e.component.disableInitial !== void 0 ? e.component.disableInitial : e.component.disableInput);
  return g(at, {
    get component() {
      return e.component;
    },
    get children() {
      return [g(D, {
        get when() {
          return e.component.lengthInput === void 0;
        },
        get children() {
          var i = Ei();
          return i.addEventListener("change", (r) => {
            e.onValueChange(r.currentTarget.value);
          }), P((r) => {
            var a = e.component.dataKey, s = {
              ["formgear-input-papi-validation-" + e.classValidation]: !0
            }, l = n();
            return a !== r.e && U(i, "name", r.e = a), r.t = X(i, s, r.t), l !== r.a && (i.disabled = r.a = l), r;
          }, {
            e: void 0,
            t: void 0,
            a: void 0
          }), P(() => i.value = e.value), i;
        }
      }), g(D, {
        get when() {
          return _e(() => e.component.lengthInput !== void 0)() && e.component.lengthInput.length > 0;
        },
        get children() {
          var i = Ei();
          return i.addEventListener("change", (r) => {
            e.onValueChange(r.currentTarget.value);
          }), P((r) => {
            var a = e.component.dataKey, s = {
              ["formgear-input-papi-validation-" + e.classValidation]: !0
            }, l = n(), c = e.component.lengthInput[0].maxlength !== void 0 ? e.component.lengthInput[0].maxlength : "", o = e.component.lengthInput[0].minlength !== void 0 ? e.component.lengthInput[0].minlength : "";
            return a !== r.e && U(i, "name", r.e = a), r.t = X(i, s, r.t), l !== r.a && (i.disabled = r.a = l), c !== r.o && U(i, "maxlength", r.o = c), o !== r.i && U(i, "minlength", r.i = o), r;
          }, {
            e: void 0,
            t: void 0,
            a: void 0,
            o: void 0,
            i: void 0
          }), P(() => i.value = e.value), i;
        }
      }), g(D, {
        get when() {
          var i;
          return ((i = e.validationMessage) == null ? void 0 : i.length) > 0;
        },
        get children() {
          return g(ce, {
            get each() {
              return e.validationMessage;
            },
            children: (i) => (() => {
              var r = _g(), a = r.firstChild, s = a.firstChild;
              return p(a, g(we, {
                get children() {
                  return [g(te, {
                    get when() {
                      return e.classValidation === 1;
                    },
                    get children() {
                      return kg();
                    }
                  }), g(te, {
                    get when() {
                      return e.classValidation === 2;
                    },
                    get children() {
                      return $g();
                    }
                  })];
                }
              }), s), s.innerHTML = i, P((l) => X(a, {
                " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
                " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
              }, l)), r;
            })()
          });
        }
      })];
    }
  });
};
var Li = /* @__PURE__ */ y("<input type=text class=formgear-input-papi placeholder>");
const Oi = (e) => {
  const [t] = it(), n = e.config, [i] = z(n.formMode > 1 ? !0 : e.component.disableInput);
  let r = e.value && e.value.length > 0 ? e.value[0].value : e.value, a = (o, d) => {
    var w;
    let f = [];
    d == null && (d = (w = l().find((k) => k.value == o)) == null ? void 0 : w.label), f = [{
      value: o,
      label: d
    }], e.onValueChange([...f]);
  }, s = Me(() => {
    if (e.component.sourceOption !== void 0 && e.component.typeOption === 3) {
      let o = e.component.sourceOption.split("@");
      const d = t.details.findIndex((f) => f.dataKey === o[0]);
      return t.details[d].type, t.details[d].answer;
    }
    return [];
  });
  const [l] = z(e.component.sourceOption !== void 0 ? s() : e.component.options);
  return g(at, {
    get classValidation() {
      return e.classValidation;
    },
    get validationMessage() {
      return e.validationMessage;
    },
    get component() {
      return e.component;
    },
    optionSection: () => g(pg, {
      get component() {
        return e.component;
      },
      get options() {
        return l();
      },
      settedValue: r,
      onValueChange: a,
      get disableInput() {
        return i();
      },
      get value() {
        return e.value;
      }
    }),
    get children() {
      return [g(D, {
        get when() {
          return e.component.lengthInput === void 0;
        },
        get children() {
          var o = Li();
          return o.$$keydown = (d) => wt(d), o.addEventListener("focus", (d) => bt(d, e)), o.addEventListener("change", (d) => {
            a(d.currentTarget.value);
          }), o.value = r, P((d) => {
            var f = e.component.dataKey, w = {
              ["formgear-input-papi-validation-" + e.classValidation]: !0
            }, k = i();
            return f !== d.e && U(o, "name", d.e = f), d.t = X(o, w, d.t), k !== d.a && (o.disabled = d.a = k), d;
          }, {
            e: void 0,
            t: void 0,
            a: void 0
          }), o;
        }
      }), g(D, {
        get when() {
          return _e(() => e.component.lengthInput !== void 0)() && e.component.lengthInput.length > 0;
        },
        get children() {
          var o = Li();
          return o.$$keydown = (d) => wt(d), o.addEventListener("focus", (d) => bt(d, e)), o.addEventListener("change", (d) => {
            e.onValueChange(d.currentTarget.value);
          }), o.value = r, P((d) => {
            var f = e.component.dataKey, w = {
              ["formgear-input-papi-validation-" + e.classValidation]: !0
            }, k = i(), C = e.component.lengthInput[0].maxlength !== void 0 ? e.component.lengthInput[0].maxlength : "", m = e.component.lengthInput[0].minlength !== void 0 ? e.component.lengthInput[0].minlength : "";
            return f !== d.e && U(o, "name", d.e = f), d.t = X(o, w, d.t), k !== d.a && (o.disabled = d.a = k), C !== d.o && U(o, "maxlength", d.o = C), m !== d.i && U(o, "minlength", d.i = m), d;
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
he(["keydown"]);
var Ai = /* @__PURE__ */ y("<input type=number class=formgear-input-papi placeholder>");
const Cg = (e) => {
  const t = e.config, [n] = z(t.formMode > 1 ? !0 : e.component.disableInput);
  return g(at, {
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
      return [g(D, {
        get when() {
          return e.component.lengthInput === void 0;
        },
        get children() {
          var i = Ai();
          return i.$$keydown = (r) => wt(r), i.addEventListener("focus", (r) => bt(r, e)), i.addEventListener("change", (r) => {
            e.onValueChange(r.currentTarget.value);
          }), P((r) => {
            var a = e.component.dataKey, s = {
              ["formgear-input-papi-validation-" + e.classValidation]: !0
            }, l = n();
            return a !== r.e && U(i, "name", r.e = a), r.t = X(i, s, r.t), l !== r.a && (i.disabled = r.a = l), r;
          }, {
            e: void 0,
            t: void 0,
            a: void 0
          }), P(() => i.value = e.value), i;
        }
      }), g(D, {
        get when() {
          return _e(() => e.component.lengthInput !== void 0)() && e.component.lengthInput.length > 0;
        },
        get children() {
          var i = Ai();
          return i.$$input = (r) => {
            const a = r.currentTarget;
            a.value.length > a.maxLength && (a.value = a.value.slice(0, a.maxLength));
          }, i.$$keydown = (r) => wt(r), i.addEventListener("focus", (r) => bt(r, e)), i.addEventListener("change", (r) => {
            e.onValueChange(r.currentTarget.value);
          }), P((r) => {
            var a = e.component.dataKey, s = {
              ["formgear-input-papi-validation-" + e.classValidation]: !0
            }, l = n(), c = e.component.lengthInput[0].maxlength !== void 0 ? e.component.lengthInput[0].maxlength : "", o = e.component.lengthInput[0].minlength !== void 0 ? e.component.lengthInput[0].minlength : "", d = e.component.rangeInput && e.component.rangeInput[0].max !== void 0 ? e.component.rangeInput[0].max : "", f = e.component.rangeInput && e.component.rangeInput[0].min !== void 0 ? e.component.rangeInput[0].min : "";
            return a !== r.e && U(i, "name", r.e = a), r.t = X(i, s, r.t), l !== r.a && (i.disabled = r.a = l), c !== r.o && U(i, "maxlength", r.o = c), o !== r.i && U(i, "minlength", r.i = o), d !== r.n && U(i, "max", r.n = d), f !== r.s && U(i, "min", r.s = f), r;
          }, {
            e: void 0,
            t: void 0,
            a: void 0,
            o: void 0,
            i: void 0,
            n: void 0,
            s: void 0
          }), P(() => i.value = e.value), i;
        }
      })];
    }
  });
};
he(["keydown", "input"]);
var Ri = /* @__PURE__ */ y("<textarea class=formgear-input-papi>");
const Mg = (e) => {
  const t = e.config, [n] = z(t.formMode > 1 ? !0 : e.component.disableInput);
  return g(at, {
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
      return [g(D, {
        get when() {
          return e.component.lengthInput === void 0;
        },
        get children() {
          var i = Ri();
          return i.addEventListener("change", (r) => {
            e.onValueChange(r.currentTarget.value);
          }), P((r) => {
            var a = e.component.rows || 2, s = {
              ["formgear-input-papi-validation-" + e.classValidation]: !0
            }, l = n();
            return a !== r.e && U(i, "rows", r.e = a), r.t = X(i, s, r.t), l !== r.a && (i.disabled = r.a = l), r;
          }, {
            e: void 0,
            t: void 0,
            a: void 0
          }), P(() => i.value = e.value), i;
        }
      }), g(D, {
        get when() {
          return _e(() => e.component.lengthInput !== void 0)() && e.component.lengthInput.length > 0;
        },
        get children() {
          var i = Ri();
          return i.addEventListener("change", (r) => {
            e.onValueChange(r.currentTarget.value);
          }), P((r) => {
            var a = e.component.rows || 2, s = {
              ["formgear-input-papi-validation-" + e.classValidation]: !0
            }, l = n(), c = e.component.lengthInput[0].maxlength !== void 0 ? e.component.lengthInput[0].maxlength : "", o = e.component.lengthInput[0].minlength !== void 0 ? e.component.lengthInput[0].minlength : "";
            return a !== r.e && U(i, "rows", r.e = a), r.t = X(i, s, r.t), l !== r.a && (i.disabled = r.a = l), c !== r.o && U(i, "maxlength", r.o = c), o !== r.i && U(i, "minlength", r.i = o), r;
          }, {
            e: void 0,
            t: void 0,
            a: void 0,
            o: void 0,
            i: void 0
          }), P(() => i.value = e.value), i;
        }
      })];
    }
  });
};
var sn = { exports: {} }, Ig = sn.exports, Ni;
function Eg() {
  return Ni || (Ni = 1, (function(e, t) {
    (function(n, i) {
      e.exports = i();
    })(Ig, (function() {
      var n = { LTS: "h:mm:ss A", LT: "h:mm A", L: "MM/DD/YYYY", LL: "MMMM D, YYYY", LLL: "MMMM D, YYYY h:mm A", LLLL: "dddd, MMMM D, YYYY h:mm A" }, i = /(\[[^[]*\])|([-_:/.,()\s]+)|(A|a|Q|YYYY|YY?|ww?|MM?M?M?|Do|DD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g, r = /\d/, a = /\d\d/, s = /\d\d?/, l = /\d*[^-_:/,()\s\d]+/, c = {}, o = function(u) {
        return (u = +u) + (u > 68 ? 1900 : 2e3);
      }, d = function(u) {
        return function(x) {
          this[u] = +x;
        };
      }, f = [/[+-]\d\d:?(\d\d)?|Z/, function(u) {
        (this.zone || (this.zone = {})).offset = (function(x) {
          if (!x || x === "Z") return 0;
          var $ = x.match(/([+-]|\d\d)/g), S = 60 * $[1] + (+$[2] || 0);
          return S === 0 ? 0 : $[0] === "+" ? -S : S;
        })(u);
      }], w = function(u) {
        var x = c[u];
        return x && (x.indexOf ? x : x.s.concat(x.f));
      }, k = function(u, x) {
        var $, S = c.meridiem;
        if (S) {
          for (var _ = 1; _ <= 24; _ += 1) if (u.indexOf(S(_, 0, x)) > -1) {
            $ = _ > 12;
            break;
          }
        } else $ = u === (x ? "pm" : "PM");
        return $;
      }, C = { A: [l, function(u) {
        this.afternoon = k(u, !1);
      }], a: [l, function(u) {
        this.afternoon = k(u, !0);
      }], Q: [r, function(u) {
        this.month = 3 * (u - 1) + 1;
      }], S: [r, function(u) {
        this.milliseconds = 100 * +u;
      }], SS: [a, function(u) {
        this.milliseconds = 10 * +u;
      }], SSS: [/\d{3}/, function(u) {
        this.milliseconds = +u;
      }], s: [s, d("seconds")], ss: [s, d("seconds")], m: [s, d("minutes")], mm: [s, d("minutes")], H: [s, d("hours")], h: [s, d("hours")], HH: [s, d("hours")], hh: [s, d("hours")], D: [s, d("day")], DD: [a, d("day")], Do: [l, function(u) {
        var x = c.ordinal, $ = u.match(/\d+/);
        if (this.day = $[0], x) for (var S = 1; S <= 31; S += 1) x(S).replace(/\[|\]/g, "") === u && (this.day = S);
      }], w: [s, d("week")], ww: [a, d("week")], M: [s, d("month")], MM: [a, d("month")], MMM: [l, function(u) {
        var x = w("months"), $ = (w("monthsShort") || x.map((function(S) {
          return S.slice(0, 3);
        }))).indexOf(u) + 1;
        if ($ < 1) throw new Error();
        this.month = $ % 12 || $;
      }], MMMM: [l, function(u) {
        var x = w("months").indexOf(u) + 1;
        if (x < 1) throw new Error();
        this.month = x % 12 || x;
      }], Y: [/[+-]?\d+/, d("year")], YY: [a, function(u) {
        this.year = o(u);
      }], YYYY: [/\d{4}/, d("year")], Z: f, ZZ: f };
      function m(u) {
        var x, $;
        x = u, $ = c && c.formats;
        for (var S = (u = x.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g, (function(O, E, M) {
          var I = M && M.toUpperCase();
          return E || $[M] || n[M] || $[I].replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g, (function(A, R, N) {
            return R || N.slice(1);
          }));
        }))).match(i), _ = S.length, L = 0; L < _; L += 1) {
          var V = S[L], v = C[V], h = v && v[0], b = v && v[1];
          S[L] = b ? { regex: h, parser: b } : V.replace(/^\[|\]$/g, "");
        }
        return function(O) {
          for (var E = {}, M = 0, I = 0; M < _; M += 1) {
            var A = S[M];
            if (typeof A == "string") I += A.length;
            else {
              var R = A.regex, N = A.parser, K = O.slice(I), H = R.exec(K)[0];
              N.call(E, H), O = O.replace(H, "");
            }
          }
          return (function(T) {
            var j = T.afternoon;
            if (j !== void 0) {
              var F = T.hours;
              j ? F < 12 && (T.hours += 12) : F === 12 && (T.hours = 0), delete T.afternoon;
            }
          })(E), E;
        };
      }
      return function(u, x, $) {
        $.p.customParseFormat = !0, u && u.parseTwoDigitYear && (o = u.parseTwoDigitYear);
        var S = x.prototype, _ = S.parse;
        S.parse = function(L) {
          var V = L.date, v = L.utc, h = L.args;
          this.$u = v;
          var b = h[1];
          if (typeof b == "string") {
            var O = h[2] === !0, E = h[3] === !0, M = O || E, I = h[2];
            E && (I = h[2]), c = this.$locale(), !O && I && (c = $.Ls[I]), this.$d = (function(K, H, T, j) {
              try {
                if (["x", "X"].indexOf(H) > -1) return new Date((H === "X" ? 1e3 : 1) * K);
                var F = m(H)(K), J = F.year, B = F.month, Z = F.day, G = F.hours, ne = F.minutes, ae = F.seconds, Q = F.milliseconds, Y = F.zone, W = F.week, q = /* @__PURE__ */ new Date(), le = Z || (J || B ? 1 : q.getDate()), re = J || q.getFullYear(), fe = 0;
                J && !B || (fe = B > 0 ? B - 1 : q.getMonth());
                var ve, ye = G || 0, Se = ne || 0, ue = ae || 0, ke = Q || 0;
                return Y ? new Date(Date.UTC(re, fe, le, ye, Se, ue, ke + 60 * Y.offset * 1e3)) : T ? new Date(Date.UTC(re, fe, le, ye, Se, ue, ke)) : (ve = new Date(re, fe, le, ye, Se, ue, ke), W && (ve = j(ve).week(W).toDate()), ve);
              } catch (Ne) {
                return /* @__PURE__ */ new Date("");
              }
            })(V, b, v, $), this.init(), I && I !== !0 && (this.$L = this.locale(I).$L), M && V != this.format(b) && (this.$d = /* @__PURE__ */ new Date("")), c = {};
          } else if (b instanceof Array) for (var A = b.length, R = 1; R <= A; R += 1) {
            h[1] = b[R - 1];
            var N = $.apply(this, h);
            if (N.isValid()) {
              this.$d = N.$d, this.$L = N.$L, this.init();
              break;
            }
            R === A && (this.$d = /* @__PURE__ */ new Date(""));
          }
          else _.call(this, L);
        };
      };
    }));
  })(sn)), sn.exports;
}
var Lg = Eg();
const Wr = /* @__PURE__ */ Nt(Lg);
var Og = /* @__PURE__ */ y("<input type=text class=formgear-input-papi>");
We.extend(Wr);
const Ag = (e) => {
  const t = e.config, [n] = z(t.formMode > 1 ? !0 : e.component.disableInput), i = "DD/MM/YYYY", r = "99/99/9999", a = Sn(r), l = {
    ref: void 0
  };
  let c = (d) => {
    d = We(d, i, !0).format("YYYY-MM-DD"), e.onValueChange(d);
  }, o = e.value ? We(e.value).format(i) : "";
  return g(at, {
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
      var d = Og();
      d.addEventListener("paste", () => a({
        currentTarget: l.ref
      })), Te(d, "input", a, !0), d.$$click = () => a({
        currentTarget: l.ref
      }), d.addEventListener("change", (w) => c(w.currentTarget.value)), d.addEventListener("focus", (w) => bt(w, e)), d.$$keydown = (w) => wt(w);
      var f = l.ref;
      return typeof f == "function" ? nt(f, d) : l.ref = d, d.value = o, P((w) => {
        var k = "inputMask" + e.component.dataKey, C = {
          ["formgear-input-papi-validation-" + e.classValidation]: !0
        }, m = r.replace(/[a]/g, "__").replace(/[9]/g, "#"), u = n();
        return k !== w.e && U(d, "id", w.e = k), w.t = X(d, C, w.t), m !== w.a && U(d, "placeholder", w.a = m), u !== w.o && (d.disabled = w.o = u), w;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0
      }), d;
    }
  });
};
he(["keydown", "click", "input"]);
var Rg = /* @__PURE__ */ y("<input type=text class=formgear-input-papi>");
We.extend(Wr);
const Ng = (e) => {
  const t = e.config, [n] = z(t.formMode > 1 ? !0 : e.component.disableInput), i = "DD/MM/YYYY HH:mm:ss", r = "99/99/9999 99:99:99", a = Sn(r), l = {
    ref: void 0
  };
  let c = (d) => {
    d = We(d, i, !0).format("YYYY-MM-DD HH:mm:ss"), e.onValueChange(d);
  }, o = e.value ? We(e.value).format(i) : "";
  return g(at, {
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
      var d = Rg();
      d.addEventListener("paste", () => a({
        currentTarget: l.ref
      })), Te(d, "input", a, !0), d.$$click = () => a({
        currentTarget: l.ref
      }), d.addEventListener("change", (w) => c(w.currentTarget.value)), d.addEventListener("focus", (w) => bt(w, e)), d.$$keydown = (w) => wt(w);
      var f = l.ref;
      return typeof f == "function" ? nt(f, d) : l.ref = d, d.value = o, P((w) => {
        var k = "inputMask" + e.component.dataKey, C = {
          ["formgear-input-papi-validation-" + e.classValidation]: !0
        }, m = r.replace(/[a]/g, "__").replace(/[9]/g, "#"), u = n();
        return k !== w.e && U(d, "id", w.e = k), w.t = X(d, C, w.t), m !== w.a && U(d, "placeholder", w.a = m), u !== w.o && (d.disabled = w.o = u), w;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0
      }), d;
    }
  });
};
he(["keydown", "click", "input"]);
var Vg = /* @__PURE__ */ y("<input type=number class=formgear-input-papi>");
const Tg = (e) => {
  const t = e.config, [n] = z(t.formMode > 1 ? !0 : e.component.disableInput);
  return g(at, {
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
      var i = Vg();
      return i.addEventListener("change", (r) => e.onValueChange(r.currentTarget.value)), P((r) => {
        var a = {
          ["formgear-input-papi-validation-" + e.classValidation]: !0
        }, s = e.component.rangeInput[0].min, l = e.component.rangeInput[0].max, c = e.component.rangeInput[0].step, o = n();
        return r.e = X(i, a, r.e), s !== r.t && U(i, "min", r.t = s), l !== r.a && U(i, "max", r.a = l), c !== r.o && U(i, "step", r.o = c), o !== r.i && (i.disabled = r.i = o), r;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0,
        i: void 0
      }), P(() => i.value = e.value || 0), i;
    }
  });
};
var Vi = /* @__PURE__ */ y('<input type=number class="formgear-input-papi block pr-20"placeholder>'), Pg = /* @__PURE__ */ y('<div class=relative><div class="absolute inset-y-0 right-0 flex items-center">');
const Dg = (e) => {
  const [t] = it(), [n] = rt(), i = e.config, [r] = z(i.formMode > 1 ? !0 : e.component.disableInput), [a, s] = z(""), [l, c] = z(!1), [o, d] = z([]), [f, w] = z(""), k = !1;
  let C = (m, u, x) => {
    if (x == 2 && u.value != "" && u.value != null) {
      let $ = JSON.parse(JSON.stringify(e.value));
      $ = [], $.push({
        value: m,
        unit: u
      }), e.onValueChange($);
    } else {
      let $ = JSON.parse(JSON.stringify(e.value));
      $ = [], $.push({
        value: m,
        unit: u
      }), e.onValueChange($);
    }
  };
  switch (e.component.typeOption) {
    case 1: {
      try {
        let m = e.component.options.map((x, $) => ({
          value: x.value,
          label: x.label
        })), u = e.value && e.value != "" && e.value[0].unit && e.value[0].unit.value && e.value[0].unit.value != "" ? e.value[0].unit.value : "";
        $e(() => {
          s(e.component.label), d(m);
          let x = m.filter(($) => $.value.includes(u))[0] && u != "" ? m.filter(($) => $.value.includes(u))[0].label : "Select Unit";
          w(x), c(!0);
        });
      } catch (m) {
        me(n.details.language[0].fetchFailed);
      }
      break;
    }
    case 2: {
      try {
        if (i.lookupMode === 1) {
          let m, u, x, $;
          k || (u = e.component.sourceSelect, m = `${i.baseUrl}/${u[0].id}/filter?version=${u[0].version}`, u[0].parentCondition.length > 0 && (x = m, $ = u[0].parentCondition.map((L, V) => {
            let v = L.value.split("@"), h = t.details.find((b) => b.dataKey == v[0]);
            if (h.answer) {
              const b = h.answer;
              if (b.length > 0) {
                let O = encodeURI(b[b.length - 1].value);
                m = `${i.lookupKey}=${L.key}&${i.lookupValue}=${O}`;
              }
            } else
              m = `${i.lookupKey}=${L.key}&${i.lookupValue}=''`;
            return m;
          }).join("&"), m = `${x}&${$}`));
          const [S] = Ut(() => m, e.MobileOnlineSearch);
          let _ = e.value && e.value != "" && e.value[0].unit && e.value[0].unit.value && e.value[0].unit.value != "" ? e.value[0].unit.value : "";
          $e(() => {
            if (s(e.component.label), S())
              if (!S().success)
                me(n.details.language[0].fetchFailed);
              else {
                let L;
                if (!k) {
                  L = [];
                  let v = u[0].value, h = u[0].desc;
                  S().data.map((b, O) => {
                    L.push({
                      value: b[v],
                      label: b[h]
                    });
                  });
                }
                let V = L.find((v) => v.value == _) && _ != "" ? L.find((v) => v.value == _).label : "Select Unit";
                d(L), w(V), c(!0);
              }
          });
        } else if (i.lookupMode === 2) {
          let m, u = [];
          m = e.component.sourceSelect;
          let x = m[0].id, $ = m[0].version;
          m[0].parentCondition.length > 0 && m[0].parentCondition.map((L, V) => {
            let v = L.value.split("@"), h = t.details.find((b) => b.dataKey == v[0]);
            if (h.answer) {
              const b = h.answer;
              if (b.length > 0) {
                let O = b[b.length - 1].value.toString();
                u.push({
                  key: L.key,
                  value: O
                });
              }
            }
          });
          let S = (L) => {
            let V = [];
            if (L.data.length > 0) {
              let v = m[0].value, h = m[0].desc, b = e.value && e.value != "" && e.value[0].unit && e.value[0].unit.value && e.value[0].unit.value != "" ? e.value[0].unit.value : "";
              L.data.map((E, M) => {
                V.push({
                  value: E[v],
                  label: E[h]
                });
              });
              let O = V.find((E) => E.value == b) && b != "" ? V.find((E) => E.value == b).label : "Select Unit";
              s(e.component.label), d(V), w(O), c(!0);
            }
          };
          const _ = e.MobileOfflineSearch(x, $, u, S);
        }
      } catch (m) {
        me(n.details.language[0].fetchFailed);
      }
      break;
    }
    case 3: {
      try {
        let m, u, x = e.value && e.value != "" && e.value[0].unit && e.value[0].unit.value && e.value[0].unit.value != "" ? e.value[0].unit.value : "";
        if (e.component.sourceOption !== void 0 && e.component.typeOption === 3) {
          const S = t.details.findIndex((_) => _.dataKey === e.component.sourceOption);
          t.details[S].type, m = t.details[S].answer, m != null ? u = m.filter((_, L) => _.value != 0).map((_, L) => ({
            value: _.value,
            label: _.label
          })) : u = [];
        }
        let $ = u.find((S) => S.value == x) && x != "" ? u.find((S) => S.value == x).label : "Select Unit";
        $e(() => {
          s(e.component.label), d(u), w($), c(!0);
        });
      } catch (m) {
        me(n.details.language[0].fetchFailed);
      }
      break;
    }
    default: {
      try {
        let m;
        e.component.options ? m = e.component.options.map((x, $) => ({
          value: x.value,
          label: x.label
        })) : m = [];
        let u = e.value && e.value != "" && e.value[0].unit && e.value[0].unit.value && e.value[0].unit.value != "" ? e.value[0].unit.value : "";
        $e(() => {
          s(e.component.label), d(m);
          let x = m.filter(($) => $.value.includes(u))[0] && u != "" ? m.filter(($) => $.value.includes(u))[0].label : "Select Unit";
          w(x), c(!0);
        });
      } catch (m) {
        me(n.details.language[0].fetchFailed);
      }
      break;
    }
  }
  return g(at, {
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
      var m = Pg(), u = m.firstChild;
      return p(m, g(D, {
        get when() {
          return e.component.lengthInput === void 0;
        },
        get children() {
          var x = Vi();
          return x.addEventListener("change", ($) => {
            C($ ? $.currentTarget.value : "", e.value != null && e.value != "" ? e.value[0].unit ? e.value[0].unit : {
              value: "",
              label: ""
            } : {
              value: "",
              label: ""
            }, 1);
          }), P(($) => {
            var S = e.component.dataKey, _ = {
              ["formgear-input-papi-validation-" + e.classValidation]: !0
            }, L = r();
            return S !== $.e && U(x, "name", $.e = S), $.t = X(x, _, $.t), L !== $.a && (x.disabled = $.a = L), $;
          }, {
            e: void 0,
            t: void 0,
            a: void 0
          }), P(() => x.value = e.value != null && e.value != "" ? e.value[0].value : ""), x;
        }
      }), u), p(m, g(D, {
        get when() {
          return _e(() => e.component.lengthInput !== void 0)() && e.component.lengthInput.length > 0;
        },
        get children() {
          var x = Vi();
          return x.$$input = ($) => {
            const S = $.currentTarget;
            S.value.length > S.maxLength && (S.value = S.value.slice(0, S.maxLength));
          }, x.addEventListener("change", ($) => {
            C($ ? $.currentTarget.value : "", e.value != null && e.value != "" ? e.value[0].unit ? e.value[0].unit : {
              value: "",
              label: ""
            } : {
              value: "",
              label: ""
            }, 1);
          }), P(($) => {
            var S = e.component.dataKey, _ = {
              ["formgear-input-papi-validation-" + e.classValidation]: !0
            }, L = r(), V = e.component.lengthInput[0].maxlength !== void 0 ? e.component.lengthInput[0].maxlength : "", v = e.component.lengthInput[0].minlength !== void 0 ? e.component.lengthInput[0].minlength : "", h = e.component.rangeInput && e.component.rangeInput[0].max !== void 0 ? e.component.rangeInput[0].max : "", b = e.component.rangeInput && e.component.rangeInput[0].min !== void 0 ? e.component.rangeInput[0].min : "";
            return S !== $.e && U(x, "name", $.e = S), $.t = X(x, _, $.t), L !== $.a && (x.disabled = $.a = L), V !== $.o && U(x, "maxlength", $.o = V), v !== $.i && U(x, "minlength", $.i = v), h !== $.n && U(x, "max", $.n = h), b !== $.s && U(x, "min", $.s = b), $;
          }, {
            e: void 0,
            t: void 0,
            a: void 0,
            o: void 0,
            i: void 0,
            n: void 0,
            s: void 0
          }), P(() => x.value = e.value != null && e.value != "" ? e.value[0].value : ""), x;
        }
      }), u), p(u, g(At, et({
        class: "formgear-select-unit  w-full rounded font-light text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-0 border-transparent focus:outline-none  disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
      }, () => Ot(o() || [], {
        key: "label",
        filterable: !0
      }), {
        get disabled() {
          return r();
        },
        placeholder: "Unit",
        onChange: (x) => C(e.value != null && e.value != "" ? e.value[0].value : "", {
          value: x ? x.value : "",
          label: x ? x.label : ""
        }, 2),
        get initialValue() {
          return {
            value: e.value && e.value != "" && e.value[0].unit && e.value[0].unit.value && e.value[0].unit.value != "" ? e.value[0].unit.value : "",
            label: f
          };
        }
      })), null), p(u, g(zr, {
        size: 20,
        class: "text-gray-400  mr-3"
      }), null), m;
    }
  });
};
he(["input"]);
var jg = /* @__PURE__ */ y("<input type=text class=formgear-input-papi placeholder>");
const Kg = (e) => {
  const t = e.config, [n] = z(t.formMode > 1 ? !0 : e.component.disableInput);
  let i = (l) => {
    let c = String.fromCharCode(l.charCode ? l.charCode : l.which), o = e.component.separatorFormat === "id-ID" ? /^\d{1,99}(?:\,\d{0,10})?$/ : /^\d{1,99}(?:\.\d{0,10})?$/, d = document.getElementById("currencyInput" + e.index).value, f = a(d);
    o.test(f + c) || (l.preventDefault ? l.preventDefault() : l.returnValue = !1);
  }, r = Wn((l) => {
    let c = a(l), o = e.component.separatorFormat === "id-ID" ? c.replace(",", ".") : c;
    e.onValueChange(o);
  }, 1e3), a = (l) => {
    let c, o;
    return e.component.separatorFormat === "id-ID" ? (c = e.component.isDecimal ? l.indexOf(",00") != -1 ? l.substring(0, l.indexOf(",00")) : l : l.indexOf(",") != -1 ? l.substring(0, l.indexOf(",")) : l, o = "0123456789,") : e.component.separatorFormat === "en-US" && (c = e.component.isDecimal ? l.indexOf(".00") != -1 ? l.substring(0, l.indexOf(".00")) : l : l.indexOf(".") != -1 ? l.substring(0, l.indexOf(".")) : l, o = "0123456789."), Array.from(c).filter((d) => o.includes(d)).join("");
  }, s = Number(e.value).toLocaleString(e.component.separatorFormat, {
    style: "currency",
    currency: e.component.currency,
    minimumFractionDigits: 0
  });
  return g(at, {
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
      var l = jg();
      return l.$$keyup = (c) => r(c.currentTarget.value), l.addEventListener("keypress", (c) => i(c)), P((c) => {
        var o = e.component.dataKey, d = {
          ["formgear-input-papi-validation-" + e.classValidation]: !0
        }, f = n(), w = "currencyInput" + e.index, k = e.component.rangeInput && e.component.rangeInput[0].max !== void 0 ? e.component.rangeInput[0].max : "", C = e.component.rangeInput && e.component.rangeInput[0].min !== void 0 ? e.component.rangeInput[0].min : "";
        return o !== c.e && U(l, "name", c.e = o), c.t = X(l, d, c.t), f !== c.a && (l.disabled = c.a = f), w !== c.o && U(l, "id", c.o = w), k !== c.i && U(l, "max", c.i = k), C !== c.n && U(l, "min", c.n = C), c;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0,
        i: void 0,
        n: void 0
      }), P(() => l.value = e.component.separatorFormat === "id-ID" ? s.replace(",00", "") : s.replace("IDR", "Rp")), l;
    }
  });
};
he(["keyup"]);
var zg = /* @__PURE__ */ y('<input type=text class="w-full border-gray-300 rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400">');
const Fg = (e) => {
  const t = e.config, [n] = z(t.formMode > 1 ? !0 : e.component.disableInput), i = Sn(e.component.maskingFormat), a = {
    ref: void 0
  };
  let s = (l) => {
    e.onValueChange(l);
  };
  return $e(() => {
    document.getElementById("inputMask" + e.component.dataKey).click();
  }), g(at, {
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
      var l = zg();
      l.addEventListener("paste", () => i({
        currentTarget: a.ref
      })), Te(l, "input", i, !0), l.$$click = () => i({
        currentTarget: a.ref
      }), l.addEventListener("change", (o) => s(o.currentTarget.value));
      var c = a.ref;
      return typeof c == "function" ? nt(c, l) : a.ref = l, P((o) => {
        var d = "inputMask" + e.component.dataKey, f = e.component.maskingFormat.replace(/[a]/g, "__").replace(/[9]/g, "#"), w = n();
        return d !== o.e && U(l, "id", o.e = d), f !== o.t && U(l, "placeholder", o.t = f), w !== o.a && (l.disabled = o.a = w), o;
      }, {
        e: void 0,
        t: void 0,
        a: void 0
      }), P(() => l.value = e.value), l;
    }
  });
};
he(["click", "input"]);
var Bg = /* @__PURE__ */ y('<div class="grid font-light text-sm content-start">'), Hg = /* @__PURE__ */ y('<div class="font-light text-sm space-x-2 py-2.5 px-4 grid grid-cols-12"><div class=col-span-1><label class="cursor-pointer text-sm"><input class="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer checked:disabled:bg-gray-500 checked:dark:disabled:bg-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"type=checkbox disabled></label></div><div class=col-span-11><input type=text class="w-full font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none">'), Ug = /* @__PURE__ */ y('<div class="font-light text-sm space-x-2 py-2.5 px-4 grid grid-cols-12"><div class=col-span-1><label class="cursor-pointer text-sm"><input class="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer checked:disabled:bg-gray-500 checked:dark:disabled:bg-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"type=checkbox disabled></label></div><div class=col-span-11>');
const Jg = (e) => {
  const t = (i) => e.value ? !!e.value.some((r) => String(r.value) === String(i)) : !1, n = (i) => {
    let r = e.value.findIndex((a) => String(a.value) === String(i));
    return e.value[r].label;
  };
  return (() => {
    var i = Bg();
    return p(i, g(ce, {
      get each() {
        return e.options;
      },
      children: (r, a) => g(we, {
        get children() {
          return [g(te, {
            get when() {
              return _e(() => !!r.open)() && t(r.value);
            },
            get children() {
              var s = Hg(), l = s.firstChild, c = l.firstChild, o = c.firstChild, d = l.nextSibling, f = d.firstChild;
              return f.addEventListener("change", (w) => e.onValueChange(r.value, w.currentTarget.value, r.open)), P((w) => {
                var k = "chexbox" + a(), C = "checkbox-" + e.component.dataKey + "-" + a();
                return k !== w.e && U(c, "for", w.e = k), C !== w.t && U(o, "id", w.t = C), w;
              }, {
                e: void 0,
                t: void 0
              }), P(() => o.value = r.value), P(() => o.checked = r.value ? t(r.value) : !1), P(() => f.value = n(r.value)), s;
            }
          }), g(te, {
            get when() {
              return !r.open || !t(r.value);
            },
            get children() {
              var s = Ug(), l = s.firstChild, c = l.firstChild, o = c.firstChild, d = l.nextSibling;
              return P((f) => {
                var w = "checkbox-" + e.component.dataKey + "-" + a(), k = r.label;
                return w !== f.e && U(o, "id", f.e = w), k !== f.t && (d.innerHTML = f.t = k), f;
              }, {
                e: void 0,
                t: void 0
              }), P(() => o.value = r.value), P(() => o.checked = r.value ? t(r.value) : !1), s;
            }
          })];
        }
      })
    })), P((r) => {
      var a = e.component.cols === 1 || e.component.cols === void 0, s = e.component.cols === 2, l = e.component.cols === 3, c = e.component.cols === 4, o = e.component.cols === 5;
      return a !== r.e && i.classList.toggle("grid-cols-1", r.e = a), s !== r.t && i.classList.toggle("grid-cols-2", r.t = s), l !== r.a && i.classList.toggle("grid-cols-3", r.a = l), c !== r.o && i.classList.toggle("grid-cols-4", r.o = c), o !== r.i && i.classList.toggle("grid-cols-5", r.i = o), r;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0
    }), i;
  })();
};
var Ti = /* @__PURE__ */ y("<input type=text class=formgear-input-papi placeholder>");
const Pi = (e) => {
  const [t] = it(), n = e.config, [i] = z(n.formMode > 1 ? !0 : e.component.disableInput);
  let r = Me(() => {
    if (e.component.sourceOption !== void 0 && e.component.typeOption === 3) {
      let d = e.component.sourceOption.split("@");
      const f = t.details.findIndex((w) => w.dataKey === d[0]);
      return t.details[f].type, t.details[f].answer;
    }
    return [];
  });
  const [a] = z(e.component.sourceOption !== void 0 ? r() : e.component.options);
  let s = (d, f, w) => {
    let k;
    if (w == null) {
      const C = Ii(a()), m = C.map((x) => Number(x.checkboxValue)), u = fg(Number(d), m);
      u.length > 0 && (k = C.filter((x) => u.includes(Number(x.checkboxValue))).map((x) => (delete x.checkboxValue, x)));
    } else if (k = JSON.parse(JSON.stringify(l())), k)
      if (e.value.some((C) => String(C.value) === String(d)))
        if (w) {
          let C = a().findIndex((m) => m.value == d);
          k = k.filter((m) => m.value != d), a()[C].label !== f && k.push({
            value: d,
            label: f
          });
        } else
          k = k.filter((C) => C.value != d);
      else
        k.splice(k.length, 0, {
          value: d,
          label: f
        });
    else
      k = [], k.push({
        value: d,
        label: f
      });
    e.onValueChange(k);
  };
  const l = Me(() => {
    var d;
    return ((d = e.value) == null ? void 0 : d.length) > 0 ? Ii(a()).filter((f) => e.value.find((w) => f.value === w.value)) : [];
  }), c = Me(() => {
    var d;
    return ((d = e.value) == null ? void 0 : d.length) > 0 ? mg(l().map((f) => f.checkboxValue)) : e.value;
  });
  return g(at, {
    get validationMessage() {
      return e.validationMessage;
    },
    get component() {
      return e.component;
    },
    optionSection: () => g(Jg, {
      get component() {
        return e.component;
      },
      get options() {
        return a();
      },
      get settedValue() {
        return c();
      },
      onValueChange: s,
      get disableInput() {
        return i();
      },
      get value() {
        return e.value;
      }
    }),
    get children() {
      return [g(D, {
        get when() {
          return e.component.lengthInput === void 0;
        },
        get children() {
          var d = Ti();
          return d.$$keydown = (f) => wt(f), d.addEventListener("focus", (f) => bt(f, e)), d.addEventListener("change", (f) => {
            s(f.currentTarget.value);
          }), P((f) => {
            var w = e.component.dataKey, k = {
              ["formgear-input-papi-validation-" + e.classValidation]: !0
            }, C = i();
            return w !== f.e && U(d, "name", f.e = w), f.t = X(d, k, f.t), C !== f.a && (d.disabled = f.a = C), f;
          }, {
            e: void 0,
            t: void 0,
            a: void 0
          }), P(() => d.value = c()), d;
        }
      }), g(D, {
        get when() {
          return _e(() => e.component.lengthInput !== void 0)() && e.component.lengthInput.length > 0;
        },
        get children() {
          var d = Ti();
          return d.$$keydown = (f) => wt(f), d.addEventListener("focus", (f) => bt(f, e)), d.addEventListener("change", (f) => {
            e.onValueChange(f.currentTarget.value);
          }), P((f) => {
            var w = e.component.dataKey, k = {
              ["formgear-input-papi-validation-" + e.classValidation]: !0
            }, C = i(), m = e.component.lengthInput[0].maxlength !== void 0 ? e.component.lengthInput[0].maxlength : "", u = e.component.lengthInput[0].minlength !== void 0 ? e.component.lengthInput[0].minlength : "";
            return w !== f.e && U(d, "name", f.e = w), f.t = X(d, k, f.t), C !== f.a && (d.disabled = f.a = C), m !== f.o && U(d, "maxlength", f.o = m), u !== f.i && U(d, "minlength", f.i = u), f;
          }, {
            e: void 0,
            t: void 0,
            a: void 0,
            o: void 0,
            i: void 0
          }), P(() => d.value = c()), d;
        }
      })];
    }
  });
};
he(["keydown"]);
var Wg = /* @__PURE__ */ y('<input type=file accept=image/* class="hidden w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"style=color:transparent>'), qg = /* @__PURE__ */ y('<button class="formgear-input-papi flex"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5 mr-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z">'), Gg = /* @__PURE__ */ y('<div class="font-light text-sm space-x-2 py-2.5 px-2 col-span-12 space-y-4"><div class=preview-class><div class="container mx-auto"><img class=rounded-md style=width:100%;height:100%>');
const Yg = (e) => {
  const [t] = rt(), [n, i] = z(""), [r, a] = z(""), [s] = z(e.config.formMode > 1 ? !0 : e.component.disableInput);
  let l = new FileReader();
  $e(() => {
    if (i(e.component.label), e.value[0]) {
      let o = e.value[0].value;
      a(o);
    }
  });
  let c = (o) => {
    let d = JSON.parse(JSON.stringify(e.value));
    if (o.target.files && o.target.files[0]) {
      var f = ["jpeg", "jpg", "png", "gif"];
      let w = o.target.files[0], k = w.name.split(".").pop().toLowerCase();
      f.includes(k) ? (l.readAsDataURL(w), l.onload = (C) => {
        var m = w.name;
        d = [], URL.createObjectURL(w), d.push({
          value: C.target.result,
          label: m,
          type: o.target.files[0].type
        }), e.onValueChange(d), tt("Image uploaded successfully!");
      }) : me("Please submit the appropriate format!");
    }
  };
  return g(at, {
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
        var o = Wg();
        return o.addEventListener("change", (d) => {
          c(d);
        }), P((d) => {
          var f = "inputFile_" + e.component.dataKey, w = e.component.dataKey;
          return f !== d.e && U(o, "id", d.e = f), w !== d.t && U(o, "name", d.t = w), d;
        }, {
          e: void 0,
          t: void 0
        }), o;
      })(), (() => {
        var o = qg();
        return o.firstChild, o.$$click = (d) => {
          document.getElementById("inputFile_" + e.component.dataKey).click();
        }, p(o, () => t.details.language[0].uploadImage, null), P((d) => {
          var f = {
            ["formgear-input-papi-validation-" + e.classValidation]: !0
          }, w = s(), k = t.details.language[0].uploadImage;
          return d.e = X(o, f, d.e), w !== d.t && (o.disabled = d.t = w), k !== d.a && U(o, "title", d.a = k), d;
        }, {
          e: void 0,
          t: void 0,
          a: void 0
        }), o;
      })(), g(D, {
        get when() {
          return r() != "";
        },
        get children() {
          var o = Gg(), d = o.firstChild, f = d.firstChild, w = f.firstChild;
          return P((k) => {
            var C = r(), m = "img-preview" + e.component.dataKey;
            return C !== k.e && U(w, "src", k.e = C), m !== k.t && U(w, "id", k.t = m), k;
          }, {
            e: void 0,
            t: void 0
          }), o;
        }
      })];
    }
  });
};
he(["click"]);
const Qg = /* @__PURE__ */ new Map([[2, _r], [25, Cl], [26, bl], [27, Ss], [28, Ns], [29, Us], [30, eo], [31, Cr], [19, Mr], [11, Mo], [12, Po], [13, Ir], [14, Er], [15, Lr], [16, Or], [17, Ar], [18, Ld], [3, Rr], [20, zd], [21, Nr], [22, Vr], [23, xc], [24, Oc], [4, Tr], [32, Wc], [33, Pr], [34, Dr], [35, jr], [36, Kr], [37, Qu], [38, Fr], [39, Br], [40, Hr], [41, Ur], [42, Jr]]), Zg = /* @__PURE__ */ new Map([[2, _r], [25, Sg], [26, Oi], [27, Oi], [28, Cg], [29, Pi], [30, Mg], [31, Cr], [19, Mr], [11, Ag], [12, Ng], [13, Ir], [14, Er], [15, Lr], [16, Or], [17, Ar], [18, Tg], [3, Rr], [20, Kg], [21, Nr], [22, Vr], [23, Pi], [24, Fg], [4, Tr], [32, Yg], [33, Pr], [34, Dr], [35, jr], [36, Kr], [37, Dg], [38, Fr], [39, Br], [40, Hr], [41, Ur], [42, Jr]]), qr = Jt(), Gr = Jt(), Xg = {
  loader: []
}, eh = (e) => {
  const [t, n] = Un(Xg);
  function i(a) {
    n("loader", ci((s) => {
      s.push({
        id: 1
      });
    }));
  }
  const r = (a) => () => {
    n("loader", ci((s) => {
      const l = s.findIndex((c) => c.id === a);
      l > -1 && s.splice(l, 1);
    }));
  };
  return g(qr.Provider, {
    value: t,
    get children() {
      return g(Gr.Provider, {
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
}, th = () => Wt(qr), Gn = () => Wt(Gr);
var nh = /* @__PURE__ */ y('<div class="modal-loading fixed z-10 inset-0 overflow-y-auto"aria-labelledby=modal-title role=dialog aria-modal=true><div class="flex items-center justify-center min-h-screen pt-4 px-4 text-center sm:block sm:p-0"><div class="fixed inset-0 bg-gray-500/75 transition-opacity"aria-hidden=true></div><span class="hidden sm:inline-block sm:align-middle sm:h-screen"aria-hidden=true>&#8203;</span><div class="relative inline-block overflow-hidden transform transition-all items-center"><svg class="animate-spin h-16 w-16 text-zinc-300"xmlns=http://www.w3.org/2000/svg fill=none viewBox="0 0 24 24"><circle class=opacity-25 cx=12 cy=12 r=10 stroke=currentColor stroke-width=4></circle><path class=opacity-75 fill=currentColor d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">'), ih = /* @__PURE__ */ y('<div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4"><div class="grid grid-cols-8"><div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full text-yellow-400 bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10"><svg xmlns=http://www.w3.org/2000/svg class="h-6 w-6 "fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path></svg></div><div class="mt-1 text-left col-span-7 "><textarea rows=2 class="w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 border border-solid border-gray-300 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"placeholder>'), rh = /* @__PURE__ */ y('<div class="bg-white px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"><button type=button class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">&nbsp;&nbsp;Save&nbsp;&nbsp;</button><button type=button class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Cancel'), ah = /* @__PURE__ */ y('<div class="bg-white px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"><button type=button class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Close'), lh = /* @__PURE__ */ y('<div class="modal-remark fixed z-10 inset-0 overflow-y-auto"aria-labelledby=modal-title role=dialog aria-modal=true><div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"><div class="fixed inset-0 bg-gray-500/75 transition-opacity"aria-hidden=true></div><span class="hidden sm:inline-block sm:align-middle sm:h-screen"aria-hidden=true>&#8203;</span><div class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"><div class="bg-gray-50 p-8 space-y-5">'), sh = /* @__PURE__ */ y("<div><div>"), oh = /* @__PURE__ */ y('<div class="bg-white p-4 grid grid-cols-8 rounded-lg"><div class="text-xs font-normal text-gray-400 col-span-5"></div><div class="text-xs font-light text-indigo-700 col-span-3 text-right italic"></div><div class="text-xs text-gray-700 py-2 -mb-2 col-span-12 text-justify">');
const dh = (e) => {
  const t = gt(), [n, {
    setActiveComponent: i
  }] = hr(), {
    setLoader: r,
    removeLoader: a
  } = Gn(), [s] = rt(), [l, c] = pr(), [o, d] = kr(), [f, w] = it(), [k, C] = wr(), [m] = br(), [u, x] = mr(), [$] = Jn(), [S] = xr(), [_] = vr(), [L] = yr(), [V] = $r(), [v, h] = z(""), [b, O] = z([]), [E, M] = z(""), [I, A] = z("E"), [R, N] = z(!1), K = (Y) => {
    var q;
    const W = f.details.findIndex((le) => le.dataKey === Y);
    return W !== -1 && (q = f.details[W].enable) != null ? q : !0;
  }, H = () => {
    const Y = [], W = [], q = [];
    f.details.forEach((re) => {
      re.type > be.INNER_HTML && re.enable && re.answer !== void 0 && re.answer !== "" && re.answer !== null && V().findIndex((ve) => ve.parentIndex.toString() === re.index.slice(0, -2).toString()) == -1 && ((re.type === be.PHOTO || re.type === be.SIGNATURE) && W.push({
        dataKey: re.dataKey,
        name: re.name,
        answer: re.answer
      }), Y.push({
        dataKey: re.dataKey,
        name: re.name,
        answer: re.answer
      }), re.principal !== void 0 && q.push({
        dataKey: re.dataKey,
        name: re.name,
        answer: re.answer,
        principal: re.principal,
        columnName: re.columnName
      }));
    }), x("details", "answers", Y), x("details", "templateDataKey", _.details.dataKey), x("details", "gearVersion", ct), x("details", "templateVersion", cn), x("details", "validationVersion", un), x("details", "docState", I()), x("details", "summary", JSON.parse(JSON.stringify(S))), x("details", "counter", [JSON.parse(JSON.stringify(L))]);
    let le = We().format("YYYY-MM-DD HH:mm:ss");
    u.details.createdBy === void 0 || u.details.createdBy !== void 0 && u.details.createdBy === "" ? x("details", "createdBy", e.config.username) : x("details", "updatedBy", e.config.username), u.details.createdAt === void 0 || u.details.createdAt !== void 0 && u.details.createdAt === "" ? x("details", "createdAt", le) : x("details", "updatedAt", le), d("details", "principals", q), d("details", "templateDataKey", _.details.dataKey), d("details", "gearVersion", ct), d("details", "templateVersion", cn), d("details", "validationVersion", un), o.details.createdBy === void 0 || o.details.createdBy !== void 0 && o.details.createdBy === "" ? d("details", "createdBy", e.config.username) : d("details", "updatedBy", e.config.username), o.details.createdAt === void 0 || o.details.createdAt !== void 0 && o.details.createdAt === "" ? d("details", "createdAt", le) : d("details", "updatedAt", le), C("details", "notes", JSON.parse(JSON.stringify(l.details.notes))), C("details", "templateDataKey", _.details.dataKey), C("details", "gearVersion", ct), C("details", "templateVersion", cn), C("details", "validationVersion", un), k.details.createdBy === void 0 || k.details.createdBy !== void 0 && k.details.createdBy === "" ? C("details", "createdBy", e.config.username) : C("details", "updatedBy", e.config.username), k.details.createdAt === void 0 || k.details.createdAt !== void 0 && k.details.createdAt === "" ? C("details", "createdAt", le) : C("details", "updatedAt", le), w("sidebar", $.details);
  }, T = (Y) => {
    if (H(), e.setResponseMobile(u.details, m.details, k.details, o.details, f), /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
      var W = document.querySelector(".mobile-component-div");
    else
      var W = document.querySelector(".component-div");
    const q = $.details.findIndex((le) => le.dataKey === Y);
    q === -1 || !$.details[q] || (i({
      dataKey: Y,
      label: $.details[q].label,
      index: JSON.parse(JSON.stringify($.details[q].index)),
      position: q
    }), window.scrollTo({
      top: 0,
      behavior: "smooth"
    }), W.scrollTo({
      top: 0,
      behavior: "smooth"
    }));
  }, j = (Y) => {
    r({}), setTimeout(() => {
      try {
        t.history.clear(), t.answer.saveAnswer(e.component.dataKey, Y, {
          activePosition: n.activeComponent.position
        });
      } catch (W) {
        me(s.details.language[0].errorSaving + e.component.dataKey, 3e3), t.history.reloadFromHistory();
      } finally {
        t.history.clear();
      }
    }, 50);
  };
  let F = Me(() => {
    const Y = f.details.findIndex((W) => W.dataKey === e.component.dataKey);
    return f.details[Y] ? f.details[Y].validationState : 0;
  });
  const J = (Y) => {
    const W = f.details.findIndex((q) => q.dataKey === e.component.dataKey);
    return f.details[W] ? f.details[W].validationMessage : [];
  }, B = () => {
    if (E().length !== 0) {
      let Y = [];
      Y.push({
        sender: e.config.username,
        datetime: We().format("YYYY-MM-DD HH:mm:ss"),
        comment: E()
      });
      let W = JSON.parse(JSON.stringify(l.details.notes));
      if (W.length == 0)
        W = [...W, {
          dataKey: v(),
          comments: Y
        }];
      else {
        let re = W.findIndex((fe) => fe.dataKey == v());
        re == -1 ? W = [...W, {
          dataKey: v(),
          comments: Y
        }] : W[re].comments.push(Y[0]);
      }
      let q = f.details.findIndex((re) => re.dataKey === v());
      w("details", q, "hasRemark", !0), w("details", q, "validationState", 0), w("details", q, "validationMessage", []), c("details", "notes", W), M("");
      const le = document.querySelector(".modal-remark");
      le ? (le.classList.add("closing"), setTimeout(() => {
        h(""), tt(s.details.language[0].remarkAdded, 500);
      }, 200)) : (h(""), tt(s.details.language[0].remarkAdded, 500)), H(), e.setResponseMobile(u.details, k.details, o.details, f);
    } else
      me(s.details.language[0].remarkEmpty, 500);
  }, Z = (Y) => {
    G(Y);
  }, G = (Y) => {
    if (v() === "") {
      h(Y);
      let W = JSON.parse(JSON.stringify(l.details.notes)), q = W.findIndex((le) => le.dataKey == Y);
      O(W[q] !== void 0 ? W[q].comments : []);
    } else
      h(Y);
  }, ne = () => {
    const Y = document.querySelector(".modal-remark");
    Y ? (Y.classList.add("closing"), setTimeout(() => {
      h("");
    }, 200)) : h("");
  }, ae = (Y) => {
    let W = JSON.parse(JSON.stringify(l.details.notes)), q = W.findIndex((le) => le.dataKey == Y);
    return W[q] !== void 0 ? W[q].comments.length : 0;
  }, Q = e.config.clientMode === ut.PAPI ? Zg : Qg;
  return (() => {
    var Y = sh(), W = Y.firstChild;
    return p(Y, g(D, {
      get when() {
        return R();
      },
      get children() {
        return nh();
      }
    }), null), p(Y, g(D, {
      get when() {
        return v() !== "";
      },
      get children() {
        var q = lh(), le = q.firstChild, re = le.firstChild, fe = re.nextSibling, ve = fe.nextSibling, ye = ve.firstChild;
        return re.$$click = ne, p(ye, g(ce, {
          get each() {
            return b();
          },
          children: (Se, ue) => (() => {
            var ke = oh(), Ne = ke.firstChild, ze = Ne.nextSibling, Le = ze.nextSibling;
            return p(Ne, () => Se.sender), p(ze, () => Se.datetime), p(Le, () => Se.comment), ke;
          })()
        })), p(ve, g(D, {
          get when() {
            return e.config.formMode < 3;
          },
          get children() {
            return [(() => {
              var Se = ih(), ue = Se.firstChild, ke = ue.firstChild, Ne = ke.nextSibling, ze = Ne.firstChild;
              return ze.addEventListener("change", (Le) => {
                M(Le.currentTarget.value);
              }), Se;
            })(), (() => {
              var Se = rh(), ue = Se.firstChild, ke = ue.nextSibling;
              return ue.$$click = (Ne) => B(), ke.$$click = ne, Se;
            })()];
          }
        }), null), p(ve, g(D, {
          get when() {
            return e.config.formMode == 3;
          },
          get children() {
            var Se = ah(), ue = Se.firstChild;
            return ue.$$click = ne, Se;
          }
        }), null), P(() => ye.classList.toggle("hidden", b().length == 0)), q;
      }
    }), null), p(Y, g(we, {
      get children() {
        return g(ce, {
          get each() {
            return Array.from(Q.keys());
          },
          children: (q) => g(te, {
            get when() {
              return _e(() => e.component.type === q)() && K(e.component.dataKey);
            },
            get children() {
              return Q.get(q)({
                onMobile: e.onMobile,
                component: e.component,
                index: e.index,
                onValueChange: j,
                onUserClick: T,
                value: t.reference.getValue(e.component.dataKey),
                config: e.config,
                classValidation: F(),
                comments: ae(e.component.dataKey),
                MobileUploadHandler: e.MobileUploadHandler,
                validationMessage: J(e.component.dataKey),
                openRemark: Z,
                MobileGpsHandler: e.MobileGpsHandler,
                MobileOfflineSearch: e.MobileOfflineSearch,
                MobileOnlineSearch: e.MobileOnlineSearch,
                MobileOpenMap: e.MobileOpenMap,
                MobileAudioHandler: e.MobileAudioHandler,
                MobileBarcodeHandler: e.MobileBarcodeHandler,
                MobileVideoHandler: e.MobileVideoHandler,
                MobileFileHandler: e.MobileFileHandler
              });
            }
          })
        });
      }
    }), null), P(() => U(W, "id", e.component.dataKey + "___scrollView")), Y;
  })();
};
he(["click"]);
var ch = /* @__PURE__ */ y('<div class="flex-grow bg-white dark:bg-gray-900 overflow-y-auto mb-20"><div class="space-y-3 sm:p-7 p-3">');
const uh = (e) => (() => {
  var t = ch(), n = t.firstChild;
  return p(n, g(ce, {
    get each() {
      return e.components;
    },
    children: (i, r) => dh({
      onMobile: e.onMobile,
      component: i,
      index: r(),
      config: e.config,
      MobileUploadHandler: e.uploadHandler,
      MobileGpsHandler: e.GpsHandler,
      MobileOfflineSearch: e.offlineSearch,
      MobileOnlineSearch: e.onlineSearch,
      MobileOpenMap: e.openMap,
      MobileAudioHandler: e.audioHandler,
      MobileBarcodeHandler: e.barcodeHandler,
      MobileVideoHandler: e.videoHandler,
      MobileFileHandler: e.fileHandler,
      setResponseMobile: e.setResponseMobile
    })
  })), t;
})();
var on = { exports: {} }, gh = on.exports, Di;
function hh() {
  return Di || (Di = 1, (function(e, t) {
    (function(n, i) {
      e.exports = i();
    })(gh, (function() {
      var n = { year: 0, month: 1, day: 2, hour: 3, minute: 4, second: 5 }, i = {};
      return function(r, a, s) {
        var l, c = function(w, k, C) {
          C === void 0 && (C = {});
          var m = new Date(w), u = (function(x, $) {
            $ === void 0 && ($ = {});
            var S = $.timeZoneName || "short", _ = x + "|" + S, L = i[_];
            return L || (L = new Intl.DateTimeFormat("en-US", { hour12: !1, timeZone: x, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", timeZoneName: S }), i[_] = L), L;
          })(k, C);
          return u.formatToParts(m);
        }, o = function(w, k) {
          for (var C = c(w, k), m = [], u = 0; u < C.length; u += 1) {
            var x = C[u], $ = x.type, S = x.value, _ = n[$];
            _ >= 0 && (m[_] = parseInt(S, 10));
          }
          var L = m[3], V = L === 24 ? 0 : L, v = m[0] + "-" + m[1] + "-" + m[2] + " " + V + ":" + m[4] + ":" + m[5] + ":000", h = +w;
          return (s.utc(v).valueOf() - (h -= h % 1e3)) / 6e4;
        }, d = a.prototype;
        d.tz = function(w, k) {
          w === void 0 && (w = l);
          var C, m = this.utcOffset(), u = this.toDate(), x = u.toLocaleString("en-US", { timeZone: w }), $ = Math.round((u - new Date(x)) / 1e3 / 60), S = 15 * -Math.round(u.getTimezoneOffset() / 15) - $;
          if (!Number(S)) C = this.utcOffset(0, k);
          else if (C = s(x, { locale: this.$L }).$set("millisecond", this.$ms).utcOffset(S, !0), k) {
            var _ = C.utcOffset();
            C = C.add(m - _, "minute");
          }
          return C.$x.$timezone = w, C;
        }, d.offsetName = function(w) {
          var k = this.$x.$timezone || s.tz.guess(), C = c(this.valueOf(), k, { timeZoneName: w }).find((function(m) {
            return m.type.toLowerCase() === "timezonename";
          }));
          return C && C.value;
        };
        var f = d.startOf;
        d.startOf = function(w, k) {
          if (!this.$x || !this.$x.$timezone) return f.call(this, w, k);
          var C = s(this.format("YYYY-MM-DD HH:mm:ss:SSS"), { locale: this.$L });
          return f.call(C, w, k).tz(this.$x.$timezone, !0);
        }, s.tz = function(w, k, C) {
          var m = C && k, u = C || k || l, x = o(+s(), u);
          if (typeof w != "string") return s(w).tz(u);
          var $ = (function(V, v, h) {
            var b = V - 60 * v * 1e3, O = o(b, h);
            if (v === O) return [b, v];
            var E = o(b -= 60 * (O - v) * 1e3, h);
            return O === E ? [b, O] : [V - 60 * Math.min(O, E) * 1e3, Math.max(O, E)];
          })(s.utc(w, m).valueOf(), x, u), S = $[0], _ = $[1], L = s(S).utcOffset(_);
          return L.$x.$timezone = u, L;
        }, s.tz.guess = function() {
          return Intl.DateTimeFormat().resolvedOptions().timeZone;
        }, s.tz.setDefault = function(w) {
          l = w;
        };
      };
    }));
  })(on)), on.exports;
}
var fh = hh();
const mh = /* @__PURE__ */ Nt(fh);
var dn = { exports: {} }, vh = dn.exports, ji;
function bh() {
  return ji || (ji = 1, (function(e, t) {
    (function(n, i) {
      e.exports = i();
    })(vh, (function() {
      var n = "minute", i = /[+-]\d\d(?::?\d\d)?/g, r = /([+-]|\d\d)/g;
      return function(a, s, l) {
        var c = s.prototype;
        l.utc = function(m) {
          var u = { date: m, utc: !0, args: arguments };
          return new s(u);
        }, c.utc = function(m) {
          var u = l(this.toDate(), { locale: this.$L, utc: !0 });
          return m ? u.add(this.utcOffset(), n) : u;
        }, c.local = function() {
          return l(this.toDate(), { locale: this.$L, utc: !1 });
        };
        var o = c.parse;
        c.parse = function(m) {
          m.utc && (this.$u = !0), this.$utils().u(m.$offset) || (this.$offset = m.$offset), o.call(this, m);
        };
        var d = c.init;
        c.init = function() {
          if (this.$u) {
            var m = this.$d;
            this.$y = m.getUTCFullYear(), this.$M = m.getUTCMonth(), this.$D = m.getUTCDate(), this.$W = m.getUTCDay(), this.$H = m.getUTCHours(), this.$m = m.getUTCMinutes(), this.$s = m.getUTCSeconds(), this.$ms = m.getUTCMilliseconds();
          } else d.call(this);
        };
        var f = c.utcOffset;
        c.utcOffset = function(m, u) {
          var x = this.$utils().u;
          if (x(m)) return this.$u ? 0 : x(this.$offset) ? f.call(this) : this.$offset;
          if (typeof m == "string" && (m = (function(L) {
            L === void 0 && (L = "");
            var V = L.match(i);
            if (!V) return null;
            var v = ("" + V[0]).match(r) || ["-", 0, 0], h = v[0], b = 60 * +v[1] + +v[2];
            return b === 0 ? 0 : h === "+" ? b : -b;
          })(m), m === null)) return this;
          var $ = Math.abs(m) <= 16 ? 60 * m : m;
          if ($ === 0) return this.utc(u);
          var S = this.clone();
          if (u) return S.$offset = $, S.$u = !1, S;
          var _ = this.$u ? this.toDate().getTimezoneOffset() : -1 * this.utcOffset();
          return (S = this.local().add($ + _, n)).$offset = $, S.$x.$localOffset = _, S;
        };
        var w = c.format;
        c.format = function(m) {
          var u = m || (this.$u ? "YYYY-MM-DDTHH:mm:ss[Z]" : "");
          return w.call(this, u);
        }, c.valueOf = function() {
          var m = this.$utils().u(this.$offset) ? 0 : this.$offset + (this.$x.$localOffset || this.$d.getTimezoneOffset());
          return this.$d.valueOf() - 6e4 * m;
        }, c.isUTC = function() {
          return !!this.$u;
        }, c.toISOString = function() {
          return this.toDate().toISOString();
        }, c.toString = function() {
          return this.toDate().toUTCString();
        };
        var k = c.toDate;
        c.toDate = function(m) {
          return m === "s" && this.$offset ? l(this.format("YYYY-MM-DD HH:mm:ss:SSS")).toDate() : k.call(this);
        };
        var C = c.diff;
        c.diff = function(m, u, x) {
          if (m && this.$u === m.$u) return C.call(this, m, u, x);
          var $ = this.local(), S = l(m).local();
          return C.call($, S, u, x);
        };
      };
    }));
  })(dn)), dn.exports;
}
var wh = bh();
const xh = /* @__PURE__ */ Nt(wh), Ki = {
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
function Yr(e, t, n = {}) {
  const { defaultValue: i, logErrors: r = !0 } = n;
  if (!e || e.trim() === "")
    return {
      success: !0,
      value: i
    };
  try {
    return {
      success: !0,
      value: yh(e, t)()
    };
  } catch (a) {
    const s = a instanceof Error ? a.message : String(a);
    return {
      success: !1,
      value: i,
      error: s
    };
  }
}
function yh(e, t) {
  const n = [
    "getValue",
    "getRowIndex",
    "getProp",
    "answer",
    "rowIndex",
    ...Object.keys(Ki)
  ], i = [
    t.getValue,
    t.getRowIndex,
    t.getProp,
    t.answer,
    t.getRowIndex(0),
    // rowIndex shorthand
    ...Object.values(Ki)
  ], r = `
    'use strict';
    return (${e});
  `, a = new Function(...n, r);
  return () => a(...i);
}
function ph(e, t, n = !0) {
  return !e || e.trim() === "" ? !0 : Yr(e, t, {
    defaultValue: n,
    logErrors: !0
  }).value;
}
function kh(e, t) {
  return !e || e.trim() === "" ? void 0 : Yr(e, t, {
    defaultValue: void 0,
    logErrors: !0
  }).value;
}
function zi(e) {
  return (t) => {
    const n = e.split("@")[0].split("#"), i = n.length, r = t + 1;
    return i - r < 1 ? Number(n[1]) || 0 : Number(n[i - r]) || 0;
  };
}
const $h = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i, jt = () => typeof navigator == "undefined" ? !1 : $h.test(navigator.userAgent), _h = 300, Sh = {
  behavior: "smooth",
  block: "start",
  delay: _h
}, Ch = () => document.querySelector(".component-div"), Kt = () => {
  const e = Ch();
  e && (e.scrollTop = 0), window.scrollTo({ top: 0, behavior: "smooth" });
}, Mh = (e, t = {}) => {
  const { behavior: n, block: i, delay: r } = Ce(Ce({}, Sh), t);
  setTimeout(() => {
    const a = document.getElementById(`${e}___scrollView`);
    a && a.scrollIntoView({ behavior: n, block: i });
  }, r);
}, Ih = (e, t) => e.findIndex(
  (n) => n.index.toString() === t.toString()
), Qr = 200, Cn = (e, t, n = Qr) => {
  const i = e.split(" ").filter(Boolean).map((a) => `.${a}`).join(""), r = document.querySelector(i);
  r ? (r.classList.add("closing"), setTimeout(() => {
    t(!1), r.classList.remove("closing");
  }, n)) : t(!1);
}, Eh = (e, t = Qr) => {
  const n = (i) => i.split(" ").filter(Boolean).map((r) => `.${r}`).join("");
  e.forEach(({ className: i }) => {
    const r = document.querySelector(n(i));
    r && r.classList.add("closing");
  }), setTimeout(() => {
    e.forEach(({ className: i, setShowFn: r }) => {
      const a = document.querySelector(n(i));
      a && a.classList.remove("closing"), r(!1);
    });
  }, t);
}, zt = {
  ERROR: "modal-error",
  REMARK: "modal-remark",
  BLANK: "modal-blank",
  CONFIRMATION: "modal-confirmation"
};
var Lh = /* @__PURE__ */ y('<th class="p-2 whitespace-nowrap font-semibold text-left w-5/12">'), Oh = /* @__PURE__ */ y('<div aria-labelledby=modal-title role=dialog aria-modal=true><div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"><div class="fixed inset-0 bg-gray-500/75 transition-opacity"aria-hidden=true></div><span class="hidden sm:inline-block sm:align-middle sm:h-screen"aria-hidden=true>&#8203;</span><div class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full"><div class="bg-white px-4 pt-5 pb-4 sm:p-6"><div class="sm:flex sm:items-start mt-6"><div></div><div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left"><h3 class="text-lg leading-6 font-medium text-gray-900"><span class="text-sm font-normal text-gray-500 ml-2">(<!>-<!> of <!>)</span></h3><div class="relative overflow-auto"><div class="shadow-sm overflow-auto my-6"><table class="border-collapse table-fixed w-full text-sm"><thead class="text-sm font-semibold text-gray-600 bg-gray-50"><tr><th class="p-2 whitespace-nowrap font-semibold text-left w-1/12">No</th><th>Field</th><th></th></tr></thead><tbody class="text-sm divide-y divide-gray-100"></tbody></table></div></div></div></div></div><div class="bg-white px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"><button type=button class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Close'), Ah = /* @__PURE__ */ y('<td class="border-b border-slate-100 align-top pb-2">'), Rh = /* @__PURE__ */ y('<tr class=text-gray-600><td class="border-b border-slate-100 p-2 align-top"><div class="text-left text-sm font-light">&nbsp;&nbsp;</div></td><td class="border-b border-slate-100 p-2 align-top"><div class="text-left text-sm font-light"></div></td><td class="border-b border-slate-100 align-top p-2"><button class="bg-transparent text-gray-500 rounded-full focus:outline-none h-5 w-5 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"viewBox="0 0 20 20"fill=currentColor stroke-width=2><path fill-rule=evenodd d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z"clip-rule=evenodd>'), Nh = /* @__PURE__ */ y('<div class="grid grid-cols-12 text-sm font-light mt-1"><div class="col-span-1 flex justify-center items-start">-</div><div class="col-span-11 text-justify mr-1">'), Vh = /* @__PURE__ */ y('<div class="flex justify-center items-center gap-2 py-3 border-t border-gray-100"><button type=button class="inline-flex items-center justify-center w-8 h-8 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all duration-200"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"viewBox="0 0 20 20"fill=currentColor><path fill-rule=evenodd d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"clip-rule=evenodd></path></svg></button><div class="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 font-medium"><span class=text-gray-900></span><span class=text-gray-400>/</span><span class=text-gray-500></span></div><button type=button class="inline-flex items-center justify-center w-8 h-8 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all duration-200"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"viewBox="0 0 20 20"fill=currentColor><path fill-rule=evenodd d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"clip-rule=evenodd>');
const Qt = 3, Fi = (e) => {
  const t = () => {
    Cn(e.modalClass, e.setShow);
  }, n = (s) => s + 1 + (e.currentPage * Qt - Qt), i = () => e.totalItems || 0, r = () => i() > 0 ? (e.currentPage - 1) * Qt + 1 : 0, a = () => i() > 0 ? Math.min(e.currentPage * Qt, i()) : 0;
  return g(D, {
    get when() {
      return e.show;
    },
    get children() {
      var s = Oh(), l = s.firstChild, c = l.firstChild, o = c.nextSibling, d = o.nextSibling, f = d.firstChild, w = f.firstChild, k = w.firstChild, C = k.nextSibling, m = C.firstChild, u = m.firstChild, x = u.firstChild, $ = x.nextSibling, S = $.nextSibling, _ = S.nextSibling, L = _.nextSibling, V = L.nextSibling;
      V.nextSibling;
      var v = m.nextSibling, h = v.firstChild, b = h.firstChild, O = b.firstChild, E = O.firstChild, M = E.firstChild, I = M.nextSibling, A = I.nextSibling, R = O.nextSibling, N = f.nextSibling, K = N.firstChild;
      return c.$$click = t, p(k, () => e.icon), p(m, () => e.title, u), p(u, r, $), p(u, a, _), p(u, () => e.totalItems, V), p(E, g(D, {
        get when() {
          return e.showMessages;
        },
        get children() {
          var H = Lh();
          return p(H, () => e.messageColumnTitle || "Messages"), H;
        }
      }), A), p(R, g(ce, {
        get each() {
          return e.items;
        },
        children: (H, T) => (() => {
          var j = Rh(), F = j.firstChild, J = F.firstChild;
          J.firstChild;
          var B = F.nextSibling, Z = B.firstChild, G = B.nextSibling, ne = G.firstChild;
          return p(J, () => n(T()), null), p(j, g(D, {
            get when() {
              return _e(() => !!e.showMessages)() && H.message;
            },
            get children() {
              var ae = Ah();
              return p(ae, g(ce, {
                get each() {
                  return H.message;
                },
                children: (Q) => (() => {
                  var Y = Nh(), W = Y.firstChild, q = W.nextSibling;
                  return p(q, Q), Y;
                })()
              })), ae;
            }
          }), G), ne.$$click = (ae) => e.onItemClick(ae, H.sideIndex, H.dataKey), P(() => Z.innerHTML = H.label), j;
        })()
      })), p(v, g(Th, {
        get currentPage() {
          return e.currentPage;
        },
        get maxPage() {
          return e.maxPage;
        },
        get onPageChange() {
          return e.onPageChange;
        }
      }), null), K.$$click = t, P((H) => {
        var T = `${e.modalClass} fixed z-10 inset-0 overflow-y-auto`, j = `mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 ${e.iconBgClass}`, F = `p-2 whitespace-nowrap font-semibold text-left ${e.showMessages ? "w-4/12" : "w-5/12"}`, J = `p-2 whitespace-nowrap font-semibold text-left ${e.showMessages ? "w-2/12" : "w-1/12"}`;
        return T !== H.e && st(s, H.e = T), j !== H.t && st(k, H.t = j), F !== H.a && st(I, H.a = F), J !== H.o && st(A, H.o = J), H;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0
      }), s;
    }
  });
}, Th = (e) => {
  const t = () => e.currentPage === 1, n = () => e.currentPage >= e.maxPage, i = () => e.maxPage > 1;
  return g(D, {
    get when() {
      return i();
    },
    get children() {
      var r = Vh(), a = r.firstChild, s = a.nextSibling, l = s.firstChild, c = l.nextSibling, o = c.nextSibling, d = s.nextSibling;
      return a.$$click = () => e.onPageChange(e.currentPage - 1), p(l, () => e.currentPage), p(o, () => e.maxPage), d.$$click = () => e.onPageChange(e.currentPage + 1), P((f) => {
        var w = t(), k = n();
        return w !== f.e && (a.disabled = f.e = w), k !== f.t && (d.disabled = f.t = k), f;
      }, {
        e: void 0,
        t: void 0
      }), r;
    }
  });
};
he(["click"]);
var Ph = /* @__PURE__ */ y('<div class="modal-confirmation fixed z-10 inset-0 overflow-y-auto"aria-labelledby=modal-title role=dialog aria-modal=true><div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"><div class="fixed inset-0 bg-gray-500/75 transition-opacity"aria-hidden=true></div><span class="hidden sm:inline-block sm:align-middle sm:h-screen"aria-hidden=true>&#8203;</span><div class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"><div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4"><div class="sm:flex sm:items-start"><div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-teal-200 sm:mx-0 sm:h-10 sm:w-10 text-teal-500"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg></div><div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left"><h3 class="text-lg leading-6 font-medium text-gray-900"id=titleModalDelete>Confirmation submission</h3><div class=mt-2><p class="text-sm text-gray-500"id=contentModalDelete>Thank you for completing the survey. Please provide this final verification to complete the submission!</p></div><div class="mt-4 flex space-y-2 space-x-2 items-center justify-center md:items-end md:justify-start"><span class="rounded-lg text-3xl italic font-mono cursor-not-allowed text-slate-600 p-2 bg-gradient-to-r from-teal-500 to-teal-50 text-justify line-through pointer-events-none select-none"></span><button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-5 w-5 flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-3 w-3"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg></button></div><div class="mt-4 flex space-y-2 space-x-2 items-center justify-center"><input type=number class="w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 border border-solid border-gray-300 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"placeholder></div></div></div></div><div class="bg-white px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"><button type=button class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-teal-600 text-base font-medium text-white hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">Submit</button><button type=button class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Cancel');
const Dh = (e) => {
  const t = () => {
    Cn("modal-confirmation", e.setShow);
  };
  return g(D, {
    get when() {
      return e.show;
    },
    get children() {
      var n = Ph(), i = n.firstChild, r = i.firstChild, a = r.nextSibling, s = a.nextSibling, l = s.firstChild, c = l.firstChild, o = c.firstChild, d = o.nextSibling, f = d.firstChild, w = f.nextSibling, k = w.nextSibling, C = k.firstChild, m = C.nextSibling, u = k.nextSibling, x = u.firstChild, $ = l.nextSibling, S = $.firstChild, _ = S.nextSibling;
      return r.$$click = t, p(C, () => e.captcha), Te(m, "click", e.onRefreshCaptcha, !0), x.addEventListener("change", (L) => e.onCaptchaChange(L.currentTarget.value)), Te(S, "click", e.onSubmit, !0), _.$$click = t, n;
    }
  });
};
he(["click"]);
var jh = /* @__PURE__ */ y('<svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Kh = /* @__PURE__ */ y('<svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), zh = /* @__PURE__ */ y('<svg xmlns=http://www.w3.org/2000/svg class="h-6 w-6"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z">'), Fh = /* @__PURE__ */ y('<svg xmlns=http://www.w3.org/2000/svg class="h-6 w-6"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Bh = /* @__PURE__ */ y('<svg xmlns=http://www.w3.org/2000/svg class="h-6 w-6"fill=none viewBox="0 0 24 24"stroke=currentColor><path stroke-linecap=round stroke-linejoin=round stroke-width=2 d="M4 6h16M4 12h16M4 18h16">'), Hh = /* @__PURE__ */ y('<svg class="bg-white h-3 w-3 text-gray-400"fill=currentColor viewBox="0 0 20 20"xmlns=http://www.w3.org/2000/svg><path fill-rule=evenodd d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"clip-rule=evenodd>'), Uh = /* @__PURE__ */ y('<svg class="bg-white h-3 w-3 text-indigo-600"width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path fill-rule=evenodd clip-rule=evenodd d="M12.2256 2.00253C9.59172 1.94346 6.93894 2.9189 4.92893 4.92891C1.02369 8.83415 1.02369 15.1658 4.92893 19.071C8.83418 22.9763 15.1658 22.9763 19.0711 19.071C21.0811 17.061 22.0565 14.4082 21.9975 11.7743C21.9796 10.9772 21.8669 10.1818 21.6595 9.40643C21.0933 9.9488 20.5078 10.4276 19.9163 10.8425C18.5649 11.7906 17.1826 12.4053 15.9301 12.6837C14.0241 13.1072 12.7156 12.7156 12 12C11.2844 11.2844 10.8928 9.97588 11.3163 8.0699C11.5947 6.81738 12.2094 5.43511 13.1575 4.08368C13.5724 3.49221 14.0512 2.90664 14.5935 2.34046C13.8182 2.13305 13.0228 2.02041 12.2256 2.00253ZM17.6569 17.6568C18.9081 16.4056 19.6582 14.8431 19.9072 13.2186C16.3611 15.2643 12.638 15.4664 10.5858 13.4142C8.53361 11.362 8.73568 7.63895 10.7814 4.09281C9.1569 4.34184 7.59434 5.09193 6.34315 6.34313C3.21895 9.46732 3.21895 14.5326 6.34315 17.6568C9.46734 20.781 14.5327 20.781 17.6569 17.6568Z"fill=currentColor>'), Jh = /* @__PURE__ */ y('<svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"viewBox="0 0 20 20"fill=currentColor stroke-width=2><path fill-rule=evenodd d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z"clip-rule=evenodd>');
const Wh = () => jh(), qh = () => Kh(), Gh = () => zh(), Yh = () => Fh(), Qh = () => Bh(), Zh = () => Hh(), Xh = () => Uh(), ef = () => Jh();
var tf = /* @__PURE__ */ y('<div class="modal-confirmation modal-error fixed z-10 inset-0 overflow-y-auto"aria-labelledby=modal-title role=dialog aria-modal=true><div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"><div class="fixed inset-0 bg-gray-500/75 transition-opacity"aria-hidden=true></div><span class="hidden sm:inline-block sm:align-middle sm:h-screen"aria-hidden=true>&#8203;</span><div class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full"><div class="bg-white px-4 pt-5 pb-4 sm:p-6"></div><div class="bg-white px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"><button type=button class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Close'), nf = /* @__PURE__ */ y('<div class="flex justify-center items-center gap-2 py-3 border-t border-gray-100"><button type=button class="inline-flex items-center justify-center w-8 h-8 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all duration-200"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"viewBox="0 0 20 20"fill=currentColor><path fill-rule=evenodd d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"clip-rule=evenodd></path></svg></button><div class="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 font-medium"><span class=text-gray-900></span><span class=text-gray-400>/</span><span class=text-gray-500></span></div><button type=button class="inline-flex items-center justify-center w-8 h-8 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all duration-200"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"viewBox="0 0 20 20"fill=currentColor><path fill-rule=evenodd d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"clip-rule=evenodd>'), rf = /* @__PURE__ */ y('<div class="sm:flex sm:items-start"><div></div><div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left"><h3 class="text-lg leading-6 font-medium text-gray-900"><span class="text-sm font-normal text-gray-500 ml-2">(<!>-<!> of <!>)</span></h3><div class="relative overflow-auto"><div class="shadow-sm overflow-auto my-6"><table class="border-collapse table-fixed w-full text-sm"><thead class="text-sm font-semibold text-gray-600 bg-gray-50"><tr><th class="p-2 whitespace-nowrap font-semibold text-left w-1/12">No</th><th class="p-2 whitespace-nowrap font-semibold text-left w-4/12">Field</th><th class="p-2 whitespace-nowrap font-semibold text-left w-5/12"></th><th class="p-2 whitespace-nowrap font-semibold text-left w-2/12"></th></tr></thead><tbody class="text-sm divide-y divide-gray-100">'), af = /* @__PURE__ */ y('<tr class=text-gray-600><td class="border-b border-slate-100 p-2 align-top"><div class="text-left text-sm font-light">&nbsp;&nbsp;</div></td><td class="border-b border-slate-100 p-2 align-top"><div class="text-left text-sm font-light"></div></td><td class="border-b border-slate-100 align-top pb-2"></td><td class="border-b border-slate-100 align-top p-2"><button class="bg-transparent text-gray-500 rounded-full focus:outline-none h-5 w-5 hover:bg-gray-400 hover:text-white flex justify-center items-center">'), lf = /* @__PURE__ */ y('<div class="grid grid-cols-12 text-sm font-light mt-1"><div class="col-span-1 flex justify-center items-start">-</div><div class="col-span-11 text-justify mr-1">');
const sf = (e) => {
  const t = () => {
    Cn(zt.ERROR, e.setShow);
  };
  return g(D, {
    get when() {
      return e.show;
    },
    get children() {
      var n = tf(), i = n.firstChild, r = i.firstChild, a = r.nextSibling, s = a.nextSibling, l = s.firstChild, c = l.nextSibling, o = c.firstChild;
      return r.$$click = t, p(l, g(Bi, {
        title: "List Error",
        get icon() {
          return g(Wh, {});
        },
        iconBgClass: "bg-red-200 text-red-500",
        get items() {
          return e.errorItems;
        },
        get totalItems() {
          return e.errorTotalItems;
        },
        get currentPage() {
          return e.errorCurrentPage;
        },
        get maxPage() {
          return e.errorMaxPage;
        },
        get onPageChange() {
          return e.onErrorPageChange;
        },
        get onItemClick() {
          return e.onItemClick;
        },
        messageColumnTitle: "Error Messages"
      }), null), p(l, g(D, {
        get when() {
          return e.warningItems.length > 0;
        },
        get children() {
          return g(Bi, {
            title: "List Warning",
            get icon() {
              return g(qh, {});
            },
            iconBgClass: "bg-yellow-200 text-yellow-500",
            get items() {
              return e.warningItems;
            },
            get totalItems() {
              return e.warningTotalItems;
            },
            get currentPage() {
              return e.warningCurrentPage;
            },
            get maxPage() {
              return e.warningMaxPage;
            },
            get onPageChange() {
              return e.onWarningPageChange;
            },
            get onItemClick() {
              return e.onItemClick;
            },
            messageColumnTitle: "Warning Messages",
            isNested: !0
          });
        }
      }), null), o.$$click = t, n;
    }
  });
}, Zt = 3, Bi = (e) => {
  const t = (c) => c + 1 + (e.currentPage * Zt - Zt), n = () => e.totalItems || 0, i = () => n() > 0 ? (e.currentPage - 1) * Zt + 1 : 0, r = () => n() > 0 ? Math.min(e.currentPage * Zt, n()) : 0, a = () => e.currentPage === 1, s = () => e.currentPage >= e.maxPage, l = () => e.maxPage > 1;
  return (() => {
    var c = rf(), o = c.firstChild, d = o.nextSibling, f = d.firstChild, w = f.firstChild, k = w.firstChild, C = k.nextSibling, m = C.nextSibling, u = m.nextSibling, x = u.nextSibling, $ = x.nextSibling;
    $.nextSibling;
    var S = f.nextSibling, _ = S.firstChild, L = _.firstChild, V = L.firstChild, v = V.firstChild, h = v.firstChild, b = h.nextSibling, O = b.nextSibling, E = V.nextSibling;
    return p(o, () => e.icon), p(f, () => e.title, w), p(w, i, C), p(w, r, u), p(w, n, $), p(O, () => e.messageColumnTitle), p(E, g(ce, {
      get each() {
        return e.items;
      },
      children: (M, I) => (() => {
        var A = af(), R = A.firstChild, N = R.firstChild;
        N.firstChild;
        var K = R.nextSibling, H = K.firstChild, T = K.nextSibling, j = T.nextSibling, F = j.firstChild;
        return p(N, () => t(I()), null), p(T, g(ce, {
          get each() {
            return M.message;
          },
          children: (J) => (() => {
            var B = lf(), Z = B.firstChild, G = Z.nextSibling;
            return p(G, J), B;
          })()
        })), F.$$click = (J) => e.onItemClick(J, M.sideIndex, M.dataKey), p(F, g(ef, {})), P(() => H.innerHTML = M.label), A;
      })()
    })), p(S, g(D, {
      get when() {
        return l();
      },
      get children() {
        var M = nf(), I = M.firstChild, A = I.nextSibling, R = A.firstChild, N = R.nextSibling, K = N.nextSibling, H = A.nextSibling;
        return I.$$click = () => e.onPageChange(e.currentPage - 1), p(R, () => e.currentPage), p(K, () => e.maxPage), H.$$click = () => e.onPageChange(e.currentPage + 1), P((T) => {
          var j = a(), F = s();
          return j !== T.e && (I.disabled = T.e = j), F !== T.t && (H.disabled = T.t = F), T;
        }, {
          e: void 0,
          t: void 0
        }), M;
      }
    }), null), P((M) => {
      var I = !!e.isNested, A = `mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 ${e.iconBgClass}`;
      return I !== M.e && c.classList.toggle("mt-6", M.e = I), A !== M.t && st(o, M.t = A), M;
    }, {
      e: void 0,
      t: void 0
    }), c;
  })();
};
he(["click"]);
var of = /* @__PURE__ */ y('<div class="font-light text-xs"><div>'), df = /* @__PURE__ */ y('<a class="block py-2 px-4 rounded font-medium space-x-2 hover:bg-blue-700 hover:text-white"href=javascript:void(0);>'), cf = /* @__PURE__ */ y('<ul class="border-l border-gray-300 dark:border-slate-500 ml-4"><li>'), uf = /* @__PURE__ */ y("<ul class=formgear-sidebar><li>");
const gf = (e) => {
  const t = (s, l, c) => {
    Kt(), jt() && e.onSidebarCollapse(s), e.onWriteResponse(), e.onSelect(l.dataKey, l.label, JSON.parse(JSON.stringify(l.index)), c);
  }, n = (s) => e.allItems.findIndex((l) => l.dataKey === s.dataKey), i = (s) => s.dataKey === e.activeDataKey, r = (s, l) => e.allItems.filter((c) => {
    if (c.level !== l || !c.enable) return !1;
    switch (l) {
      case 1:
        return s.index[1] === c.index[1];
      case 2:
        return s.index[1] === c.index[1] && s.index[3] === c.index[3] && s.index[4] === c.index[4];
      case 3:
        return s.index[1] === c.index[1] && s.index[3] === c.index[3] && s.index[5] === c.index[5] && s.index[6] === c.index[6];
      default:
        return !1;
    }
  }), a = (s, l) => [(() => {
    var c = df();
    return c.$$click = (o) => t(o, s, n(s)), p(c, () => s.label, null), p(c, g(D, {
      get when() {
        return s.description;
      },
      get children() {
        var o = of(), d = o.firstChild;
        return P(() => d.innerHTML = s.description), o;
      }
    }), null), P((o) => X(c, {
      "bg-blue-800 text-white": i(s)
    }, o)), c;
  })(), g(D, {
    when: l < 3,
    get children() {
      return g(ce, {
        get each() {
          return r(s, l + 1);
        },
        children: (c) => (() => {
          var o = cf(), d = o.firstChild;
          return p(d, () => a(c, l + 1)), P(() => o.classList.toggle("show", e.item.index[1] === e.activeIndex[1])), o;
        })()
      });
    }
  })];
  return g(D, {
    get when() {
      return _e(() => e.item.level === 0)() && e.item.enable;
    },
    get children() {
      var s = uf(), l = s.firstChild;
      return p(l, () => a(e.item, 0)), s;
    }
  });
};
he(["click"]);
var hf = /* @__PURE__ */ y('<div class="sidebar-overlay fixed inset-0 bg-black/80 backdrop-blur-sm z-10 md:hidden opacity-0 pointer-events-none transition-all duration-300 ease-in-out">'), ff = /* @__PURE__ */ y('<div class="bg-white dark:bg-gray-900 w-72 flex-shrink-0 border-r border-gray-200 dark:border-gray-800 h-screen p-5 sidebar-span fixed inset-y-0 left-0 -translate-x-full transition-all duration-300 ease-in-out md:relative md:translate-x-0 z-20 md:z-auto"><div class="sm:min-h-[7rem] py-3 text-gray-400 tracking-wider flex justify-between"><button type=button class="md:hidden p-2 mobile-menu-button"><svg xmlns=http://www.w3.org/2000/svg class="h-6 w-6"fill=none viewBox="0 0 24 24"stroke=currentColor><path stroke-linecap=round stroke-linejoin=round stroke-width=2 d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></button></div><div class="h-3/6 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-50 dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-500 overflow-y-scroll scrollbar-thumb-rounded-full scrollbar-track-rounded-full"><div></div><div class="sticky bottom-0 bg-gradient-to-t from-white dark:from-slate-900 pt-14">'), Hi = /* @__PURE__ */ y('<div class="text-lg block px-4 py-3 text-gray-600 dark:text-white font-bold sm:text-xl">'), mf = /* @__PURE__ */ y('<button class="bg-teal-300 dark:bg-teal-500 hover:bg-teal-200 dark:hover:bg-teal-400 text-teal-100 p-3 w-full rounded-md shadow font-medium">Submit'), vf = /* @__PURE__ */ y('<button class="bg-red-500 hover:bg-red-400 text-teal-100 p-3 w-full rounded-md shadow font-medium">List Error'), bf = /* @__PURE__ */ y('<div class=h-2/6><div class="bg-white px-8 p-5 w-full flex flex-col dark:bg-gray-900 space-y-4 absolute bottom-0 left-0"><div class="grid grid-cols-2 gap-y-4 sm:pb-3"></div><div>'), wf = /* @__PURE__ */ y('<div class="h-auto text-5xl text-center sm:flex flex-col flex-coltext-white font-medium"><div class="font-light text-xs">');
const xf = (e) => g(D, {
  get when() {
    return e.clientMode !== ut.PAPI;
  },
  get children() {
    return [(() => {
      var t = hf();
      return Te(t, "click", e.onSidebarCollapse, !0), t;
    })(), (() => {
      var t = ff(), n = t.firstChild, i = n.firstChild, r = n.nextSibling, a = r.firstChild;
      return p(n, g(yf, {
        get acronym() {
          return e.templateAcronym;
        },
        get templateVersion() {
          return e.templateVersion;
        },
        get validationVersion() {
          return e.validationVersion;
        },
        get clientMode() {
          return e.clientMode;
        }
      }), i), Te(i, "click", e.onSidebarCollapse, !0), p(a, g(ce, {
        get each() {
          return e.sidebarDetails;
        },
        children: (s) => g(gf, {
          item: s,
          get allItems() {
            return e.sidebarDetails;
          },
          get activeDataKey() {
            return e.activeDataKey;
          },
          get activeIndex() {
            return e.activeIndex;
          },
          get onSelect() {
            return e.onSelect;
          },
          get onSidebarCollapse() {
            return e.onSidebarCollapse;
          },
          get onWriteResponse() {
            return e.onWriteResponse;
          }
        })
      })), p(t, g(pf, {
        get summary() {
          return e.summary;
        },
        get locale() {
          return e.locale;
        },
        get formMode() {
          return e.formMode;
        },
        get onShowBlank() {
          return e.onShowBlank;
        },
        get onShowError() {
          return e.onShowError;
        },
        get onShowRemark() {
          return e.onShowRemark;
        },
        get onSubmit() {
          return e.onSubmit;
        }
      }), null), t;
    })()];
  }
}), yf = (e) => g(D, {
  get when() {
    return e.clientMode !== ut.CAWI;
  },
  get fallback() {
    return (() => {
      var t = Hi();
      return P(() => t.innerHTML = e.acronym), t;
    })();
  },
  get children() {
    var t = Hi();
    return P(() => t.innerHTML = `${e.acronym}<div class="text-xs font-light text-gray-600 dark:text-gray-400">🚀${ct} 📋${e.templateVersion} ✔️${e.validationVersion}</div>`), t;
  }
}), pf = (e) => (() => {
  var t = bf(), n = t.firstChild, i = n.firstChild, r = i.nextSibling;
  return p(i, g(Xt, {
    get value() {
      return e.summary.answer;
    },
    get label() {
      return e.locale.summaryAnswer;
    }
  }), null), p(i, g(Xt, {
    get value() {
      return e.summary.blank;
    },
    get label() {
      return e.locale.summaryBlank;
    },
    get onClick() {
      return e.onShowBlank;
    }
  }), null), p(i, g(Xt, {
    get value() {
      return e.summary.error;
    },
    get label() {
      return e.locale.summaryError;
    },
    get onClick() {
      return e.onShowError;
    }
  }), null), p(i, g(Xt, {
    get value() {
      return e.summary.remark;
    },
    get label() {
      return e.locale.summaryRemark;
    },
    get onClick() {
      return e.onShowRemark;
    }
  }), null), p(r, g(D, {
    get when() {
      return _e(() => e.summary.error === 0)() && e.formMode === 1;
    },
    get children() {
      var a = mf();
      return Te(a, "click", e.onSubmit, !0), a;
    }
  }), null), p(r, g(D, {
    get when() {
      return _e(() => e.summary.error > 0)() && e.formMode < 3;
    },
    get children() {
      var a = vf();
      return Te(a, "click", e.onShowError, !0), a;
    }
  }), null), t;
})(), Xt = (e) => (() => {
  var t = wf(), n = t.firstChild;
  return Te(t, "click", e.onClick, !0), p(t, () => e.value, n), p(n, () => e.label), P(() => t.classList.toggle("cursor-pointer", !!e.onClick)), t;
})();
he(["click"]);
var kf = /* @__PURE__ */ y('<div class="flex justify-end items-center col-start-6 pr-5 transition"><button class="bg-teal-500 text-white p-2 rounded-full focus:outline-none items-center h-10 w-10 hover:bg-teal-400"><svg xmlns=http://www.w3.org/2000/svg class="h-6 w-6"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z">'), $f = /* @__PURE__ */ y('<div class="grid grid-cols-6 w-full justify-end items-end"><div class="flex justify-center items-center py-2 rounded-full bg-gray-200/80 dark:bg-gray-800/90"><button><svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 20 20"fill=currentColor><path fill-rule=evenodd d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"clip-rule=evenodd></path></svg></button><div class="flex justify-center items-center text-center"></div><div><button class="absolute inset-0 bg-red-200 text-red-500 rounded-full focus:outline-none flex justify-center items-center transition-all duration-300 ease-in-out"><svg xmlns=http://www.w3.org/2000/svg fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></button><button class="absolute inset-0 bg-teal-200 text-teal-500 rounded-full focus:outline-none flex justify-center items-center transition-all duration-300 ease-in-out"><svg xmlns=http://www.w3.org/2000/svg fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg></button><button class="absolute inset-0 bg-blue-700 text-white p-2 rounded-full focus:outline-none hover:bg-blue-600 flex justify-center items-center transition-all duration-300 ease-in-out"><svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 20 20"fill=currentColor><path fill-rule=evenodd d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"clip-rule=evenodd></path></svg></button></div></div><div class="flex justify-end items-center transition-all duration-300 ease-in-out"><button><svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 20 20"fill=currentColor><path fill-rule=evenodd d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"clip-rule=evenodd>');
const Ui = (e) => {
  const t = () => !e.hasNext, n = () => t() && e.hasErrors, i = () => t() && !e.hasErrors && e.formMode === 1, r = () => e.hasNext, a = e.isMobile ? "h-8 w-8" : "h-10 w-10", s = e.isMobile ? "h-4 w-4" : "h-5 w-5", l = e.isMobile ? "h-10 w-10" : "h-12 w-12", c = e.isMobile ? "h-6 w-6" : "h-8 w-8";
  return (() => {
    var o = $f(), d = o.firstChild, f = d.firstChild, w = f.firstChild, k = f.nextSibling, C = k.nextSibling, m = C.firstChild, u = m.firstChild, x = m.nextSibling, $ = x.firstChild, S = x.nextSibling, _ = S.firstChild, L = d.nextSibling, V = L.firstChild, v = V.firstChild;
    return Te(f, "click", e.onPrevious, !0), st(f, `bg-blue-700 text-white p-2 rounded-full focus:outline-none items-center hover:bg-blue-600 group inline-flex justify-center text-xs transition-all duration-300 ease-in-out overflow-hidden ${a}`), U(w, "class", `${s} shrink-0`), p(k, () => e.activeLabel), st(C, `relative ${a}`), Te(m, "click", e.onShowError, !0), U(u, "class", s), Te(x, "click", e.onSubmit, !0), U($, "class", s), Te(S, "click", e.onNext, !0), U(_, "class", s), Te(V, "click", e.onScrollTop, !0), st(V, `scrolltotop-div bg-yellow-400 text-white p-2 rounded-full focus:outline-none items-center hover:bg-yellow-300 transition-transform hover:scale-110 ${l}`), U(v, "class", c), p(o, g(D, {
      get when() {
        return _e(() => !!(e.isMobile && e.onSave))() && e.formMode < 3;
      },
      get children() {
        var h = kf(), b = h.firstChild;
        return Te(b, "click", e.onSave, !0), h;
      }
    }), null), P((h) => {
      var b = {
        "bottom-4 right-0 sticky": !e.isMobile,
        "pb-4 pt-2 bottom-0 mt-10 bg-gray-100/10 dark:bg-gray-900/70 backdrop-blur-md sticky": e.isMobile
      }, O = {
        "space-x-10 mx-10 col-start-2 col-end-6": !e.isMobile,
        "space-x-4 col-start-1 col-end-5 ml-4 mr-4": e.isMobile
      }, E = {
        "opacity-100": e.hasPrevious,
        "opacity-0 w-0 p-0": !e.hasPrevious
      }, M = !!e.isMobile, I = {
        "opacity-100 scale-100": n(),
        "opacity-0 scale-0 pointer-events-none": !n()
      }, A = {
        "opacity-100 scale-100": i(),
        "opacity-0 scale-0 pointer-events-none": !i()
      }, R = {
        "opacity-100 scale-100": r(),
        "opacity-0 scale-0 pointer-events-none": !r()
      }, N = {
        "pr-8": !e.isMobile,
        "pr-2": e.isMobile,
        "opacity-100 translate-y-0": e.showScrollTop,
        "opacity-0 translate-y-4 pointer-events-none": !e.showScrollTop
      };
      return h.e = X(o, b, h.e), h.t = X(d, O, h.t), h.a = X(f, E, h.a), M !== h.o && k.classList.toggle("text-xs", h.o = M), h.i = X(m, I, h.i), h.n = X(x, A, h.n), h.s = X(S, R, h.s), h.h = X(L, N, h.h), h;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0,
      n: void 0,
      s: void 0,
      h: void 0
    }), o;
  })();
};
he(["click"]);
var _f = /* @__PURE__ */ y('<button type=button class="button-switch relative inline-flex flex-shrink-0 bg-gray-200 dark:bg-gray-700 h-6 w-11 border-2 border-transparent rounded-full cusrsor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"><span class="outer-span relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 pointer-events-none"><span class="light-switch absolute inset-0 h-full w-full flex items-center justify-center transition-opacity opacity-100 dark:opacity-0 ease-out duration-100"></span><span class="dark-switch absolute inset-0 h-full w-full flex items-center justify-center transition-opacity opacity-0 dark:opacity-100 ease-in duration-200">');
const Sf = (e) => (() => {
  var t = _f(), n = t.firstChild, i = n.firstChild, r = i.nextSibling;
  return Te(t, "click", e.onToggle, !0), p(i, g(Zh, {})), p(r, g(Xh, {})), t;
})();
he(["click"]);
var Cf = /* @__PURE__ */ y('<div class="text-xs font-light text-gray-600"> ± <!> ms'), Mf = /* @__PURE__ */ y('<div class="flex relative flex-none min-w-full px-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-50 dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-500 scrollbar-thumb-rounded-full scrollbar-track-rounded-full"><ul class="flex text-sm leading-6 text-slate-400 pt-4">'), If = /* @__PURE__ */ y('<div class="sm:px-7 sm:pt-7 px-4 pt-4 flex flex-col w-full border-b border-gray-200 bg-white dark:bg-gray-900 dark:text-white dark:border-gray-800 z-10 sticky"><div class="flex w-full items-center"><div class="ml-3 w-4/6 md:w-auto md:text-2xl md:text-left font-medium text-left text-base text-gray-900 dark:text-white mt-1"><div></div><div class="text-sm font-light md:text-lg text-gray-600 dark:text-gray-400"></div></div><div class="ml-auto w-1/6 md:w-auto sm:flex items-center p-2"></div><div class="ml-auto w-1/6 md:w-auto sm:flex md:hidden items-center"><button type=button class="p-4 mobile-menu-button focus:outline-none focus:bg-gray-200 dark:focus:bg-gray-800"></button></div></div><div class="flex items-center space-x-3 sm:mt-7 mt-4">'), Ef = /* @__PURE__ */ y('<li class=flex-none><a class="block py-2 mb-1.5 px-4 rounded font-medium space-x-2 hover:bg-blue-700 hover:text-white"href=javascript:void(0);>');
const Lf = (e) => (() => {
  var t = If(), n = t.firstChild, i = n.firstChild, r = i.firstChild, a = r.nextSibling, s = i.nextSibling, l = s.nextSibling, c = l.firstChild;
  return n.nextSibling, p(i, g(D, {
    get when() {
      return e.config.clientMode === 2;
    },
    get children() {
      var o = Cf(), d = o.firstChild, f = d.nextSibling;
      return f.nextSibling, p(o, () => e.renderGear, d), p(o, () => e.timeDiff, f), o;
    }
  }), null), p(s, g(Sf, {
    get onToggle() {
      return e.onToggleTheme;
    }
  })), Te(c, "click", e.onSidebarCollapse, !0), p(c, g(Qh, {})), p(t, g(D, {
    get when() {
      return e.config.clientMode === ut.PAPI;
    },
    get children() {
      var o = Mf(), d = o.firstChild;
      return p(d, g(ce, {
        get each() {
          return e.sidebar.details;
        },
        children: (f, w) => (() => {
          var k = Ef(), C = k.firstChild;
          return C.$$click = () => e.onSelectTab(f.dataKey, f.label, f.index, w()), p(C, () => f.label), P((m) => {
            var u = {
              "border-b-4 border-blue-800": f.dataKey === e.form.activeComponent.dataKey
            }, x = {
              "bg-blue-800 text-white": f.dataKey === e.form.activeComponent.dataKey
            };
            return m.e = X(k, u, m.e), m.t = X(C, x, m.t), m;
          }, {
            e: void 0,
            t: void 0
          }), k;
        })()
      })), o;
    }
  }), null), P((o) => {
    var d = e.config.clientMode !== ut.PAPI, f = e.config.clientMode === ut.PAPI, w = e.template.details.title, k = e.template.details.description, C = !e.onMobile, m = !!e.onMobile;
    return d !== o.e && t.classList.toggle("top-0", o.e = d), f !== o.t && t.classList.toggle("-top-[121px]", o.t = f), w !== o.a && (r.innerHTML = o.a = w), k !== o.o && (a.innerHTML = o.o = k), C !== o.i && a.classList.toggle("flex", o.i = C), m !== o.n && a.classList.toggle("hidden", o.n = m), o;
  }, {
    e: void 0,
    t: void 0,
    a: void 0,
    o: void 0,
    i: void 0,
    n: void 0
  }), t;
})();
he(["click"]);
var Of = /* @__PURE__ */ y('<div class="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900"><div class="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md"><svg class="mx-auto h-16 w-16 text-red-500 mb-4"fill=none viewBox="0 0 24 24"stroke=currentColor><path stroke-linecap=round stroke-linejoin=round stroke-width=2 d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg><h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">Form Configuration Error</h2><p class="text-gray-600 dark:text-gray-300 mb-4">No sections found in the template. Please ensure your template JSON has at least one section with type 1.</p><p class="text-sm text-gray-500 dark:text-gray-400">Check the browser console for more details.');
const Af = () => Of(), Rf = 3;
function en(e = Rf) {
  const [t, n] = z([]), [i, r] = z([]), [a, s] = z(1), [l, c] = z(1), o = (k, C) => {
    const m = k.length, u = Math.max(1, Math.ceil(m / e)), x = Math.min(Math.max(1, C), u), $ = (x - 1) * e, S = $ + e;
    return {
      pageItems: k.slice($, S),
      currentPage: x,
      maxPage: u
    };
  };
  return {
    items: t,
    pageItems: i,
    totalItems: () => t().length,
    currentPage: a,
    maxPage: l,
    setItems: (k) => {
      n(k);
      const C = o(k, 1);
      r(C.pageItems), s(C.currentPage), c(C.maxPage);
    },
    setPage: (k) => {
      const C = t(), m = o(C, k);
      r(m.pageItems), s(m.currentPage);
    }
  };
}
function Nf(e, t, n, i) {
  const { getValue: r, getProp: a } = i, { sidebar: s, reference: l, setReference: c } = t;
  e.tmpVarComp.forEach((o) => {
    let d = s.details.findIndex((C) => C.components[0].findIndex((u) => {
      u.dataKey, o.dataKey;
    }) == -1 ? 0 : d);
    const f = zi(o.dataKey), w = {
      getValue: r,
      getRowIndex: f,
      getProp: a,
      dataKey: o.dataKey
    };
    let k = kh(o.expression, w);
    k !== void 0 && n.answer.saveAnswer(o.dataKey, k, { isInitial: !0, activePosition: d });
  }), e.preset.details.predata.forEach((o, d) => {
    let f = n.reference.getIndex(o.dataKey);
    if (f !== -1 && (e.config.initialMode == 1 && l.details[f].presetMaster !== void 0 && l.details[f].presetMaster || e.config.initialMode == 2)) {
      let w = s.details.findIndex((C) => C.components[0].findIndex((u) => u.dataKey === o.dataKey) == -1 ? 0 : d), k = typeof o.answer == "object" ? JSON.parse(JSON.stringify(o.answer)) : o.answer;
      n.answer.saveAnswer(o.dataKey, k, { isInitial: !0, activePosition: w });
    }
  }), e.response.details.answers.forEach((o, d) => {
    if (!o.dataKey.includes("#") && n.reference.getIndex(o.dataKey) !== -1) {
      let w = s.details.findIndex((C) => C.components[0].findIndex((u) => u.dataKey === o.dataKey) == -1 ? 0 : d), k = typeof o.answer == "object" ? JSON.parse(JSON.stringify(o.answer)) : o.answer;
      k !== void 0 && n.answer.saveAnswer(o.dataKey, k, { isInitial: !0, activePosition: w });
    }
  }), e.tmpEnableComp.forEach((o) => {
    const d = zi(o.dataKey), f = {
      getValue: r,
      getRowIndex: d,
      getProp: a,
      dataKey: o.dataKey
    };
    let k = ph(o.enableCondition, f, !0), C = k === void 0 ? !1 : k;
    n.answer.saveEnable(o.dataKey, C);
  });
  for (let o = 0; o < l.details.length; o++) {
    let d = l.details[o];
    if (!(d.index[d.index.length - 2] === 0 && d.level > 1) && (d.enable && d.componentValidation !== void 0 && n.validation.validateComponent(d.dataKey), d.enable && d.sourceOption !== void 0)) {
      let f = d.sourceOption.split("@"), w = n.reference.getIndex(f[0]), k = w !== -1 ? l.details[w] : null;
      if (d.answer && k && k.answer) {
        let C = [];
        d.answer.forEach((m) => {
          k.answer.forEach((u) => {
            m.value == u.value && C.push(u);
          });
        }), c("details", o, "answer", C);
      }
    }
  }
}
function Vf(e, t) {
  const { reference: n, note: i, setNote: r } = e;
  n.details.forEach((a) => {
    let s = t.details.notes.findIndex((l) => l.dataKey === a.dataKey);
    if (s !== -1) {
      let l = t.details.notes[s], c = JSON.parse(JSON.stringify(i.details.notes));
      c.push(l), r("details", "notes", c);
    }
  });
}
var Tf = /* @__PURE__ */ y('<div class="bg-gray-200 dark:bg-[#181f30] h-screen"><div class=overflow-hidden><div class="bg-gray-50 dark:bg-gray-900 dark:text-white h-screen shadow-xl text-gray-600 flex overflow-hidden text-sm font-sans xl:rounded-xl dark:shadow-gray-800"><div class="flex-grow overflow-hidden h-full flex flex-col bg-white dark:bg-gray-900 z-0"><div class="mobile-component-div relative h-screen md:flex md:overflow-hidden scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-50 dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-500 overflow-y-scroll scrollbar-thumb-rounded-full scrollbar-track-rounded-full"><div class="component-div min-h-screen flex-grow bg-white dark:bg-gray-900 z-10 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-50 dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-500 overflow-y-visible md:overflow-y-scroll scrollbar-thumb-rounded-full scrollbar-track-rounded-full">');
const Pf = (e) => {
  const t = gt(), [n, i] = rt(), [r, a] = pr(), [s, l] = kr(), [c, o] = it(), [d, f] = wr(), [w, k] = mr(), [C] = Jn(), [m, u] = xr(), [x] = vr(), [$] = yr(), [S, _] = br(), [L] = $r(), [, V] = el(), v = (ie) => {
    const oe = c.details.findIndex((ge) => ge.dataKey === ie);
    let ee = "";
    return oe !== -1 && c.details[oe].answer && c.details[oe].enable && (ee = c.details[oe].answer), ee;
  }, h = () => e.config, b = (ie) => {
    switch (ie) {
      case "clientMode":
        return e.config.clientMode;
      case "baseUrl":
        return e.config.baseUrl;
    }
  }, [O, E] = z("FormGear-" + ct + " 🚀:"), {
    setLoader: M,
    removeLoader: I
  } = Gn(), [A, R] = z(h()), [N, {
    setActiveComponent: K
  }] = hr(), [H, T] = z(!1), [j, F] = z(!1), [J, B] = z(!1), [Z, G] = z(!1), [ne, ae] = z(""), [Q, Y] = z(""), [W, q] = z("E"), le = en(), re = en(), fe = en(), ve = en(), [ye, Se] = z(!1), [ue, ke] = z(!1), [Ne, ze] = z(jt()), [Le, Je] = z([]);
  if (e.template.details.language !== void 0 && e.template.details.language.length > 0) {
    const ie = Object.keys(n.details.language[0]), oe = JSON.parse(JSON.stringify(n.details.language[0]));
    ie.forEach((ee) => {
      e.template.details.language[0].hasOwnProperty(ee) && (oe[ee] = e.template.details.language[0][ee]);
    }), i("details", "language", [oe]);
  }
  const Ve = (ie) => {
    var ee, ge;
    const oe = C.details.findIndex((pe) => pe.dataKey === ie);
    return (ge = (ee = C.details[oe]) == null ? void 0 : ee.components[0]) != null ? ge : [];
  };
  if (!C.details || C.details.length === 0)
    return me("Form configuration error: No sections found in template", 5e3), g(Af, {});
  const Ge = {
    dataKey: C.details[0].dataKey,
    label: C.details[0].label,
    index: JSON.parse(JSON.stringify(C.details[0].index)),
    position: 0
  };
  K(Ge), history.replaceState(Ge, ""), Je(Ve(C.details[0].dataKey)), e.runAll == 0 ? Nf({
    config: e.config,
    tmpVarComp: e.tmpVarComp,
    tmpEnableComp: e.tmpEnableComp,
    preset: e.preset,
    response: e.response,
    remark: e.remark
  }, {
    sidebar: C,
    reference: c,
    setReference: o
  }, {
    answer: t.answer,
    reference: t.reference,
    validation: t.validation
  }, {
    getValue: v,
    getProp: b
  }) : (Vf({
    reference: c,
    note: r,
    setNote: a
  }, e.remark), E("FormGear-" + ct + " ♻️:")), V(!0);
  const Pe = () => {
    window.innerWidth < 768 ? ze(!0) : ze(!1);
  };
  $e(() => {
    var pe;
    Je(Ve(N.activeComponent.dataKey));
    let ie = 0, oe = 0, ee = 0, ge = 0;
    c.details.forEach((xe) => {
      if (L().findIndex((Oe) => Oe.parentIndex.toString() === xe.index.slice(0, -2).toString()) == -1 && xe.type > be.VARIABLE && xe.enable) {
        xe.answer !== void 0 && xe.answer !== "" && xe.answer !== null && (ie += 1, xe.validationState != 1 && xe.validationState != 2 && (ge += 1));
        const Oe = xe.answer === void 0 || xe.answer === "" || xe.type === be.LIST_TEXT_REPEAT && Array.isArray(xe.answer) && xe.answer.length === 1 || xe.type === be.LIST_SELECT_REPEAT && Array.isArray(xe.answer) && xe.answer.length === 1, Gt = JSON.parse(JSON.stringify(xe.index[xe.index.length - 2])) === 0 && xe.level > 1;
        Oe && !Gt && (ee += 1), xe.validationState == 2 && (oe += 1);
      }
    }), u({
      answer: ie,
      blank: ee,
      error: oe,
      remark: r.details.notes.length,
      clean: ge
    }), h().clientMode != 2 && window.addEventListener("resize", Pe), (pe = document.getElementById("FormGear-loader")) == null || pe.classList.add("hidden");
  });
  const Be = () => {
    var ie, oe, ee, ge;
    document.documentElement.classList.toggle("dark"), (ie = document.querySelector(".outer-span")) == null || ie.classList.toggle("translate-x-5"), (oe = document.querySelector(".button-switch")) == null || oe.classList.toggle("bg-gray-800"), (ee = document.querySelector(".light-switch")) == null || ee.classList.toggle("opacity-100"), (ge = document.querySelector(".dark-switch")) == null || ge.classList.toggle("opacity-100");
  }, Ye = (ie) => {
    const oe = document.querySelector(".sidebar-span"), ee = document.querySelector(".sidebar-overlay");
    oe == null || oe.classList.toggle("-translate-x-full"), oe == null || oe.classList.toggle("translate-x-0"), ee == null || ee.classList.toggle("opacity-0"), ee == null || ee.classList.toggle("opacity-100"), ee == null || ee.classList.toggle("pointer-events-none"), ee == null || ee.classList.toggle("pointer-events-auto");
  }, Tt = () => {
    const ie = document.querySelector(".component-div");
    Se(ie ? ie.scrollTop > 100 : !1);
  }, qt = () => {
    if (jt()) {
      const ie = document.querySelector(".mobile-component-div");
      ke(ie ? ie.scrollTop > 100 : !1);
    }
  }, ht = () => {
    const ie = jt() ? document.querySelector(".mobile-component-div") : document.querySelector(".component-div");
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    }), ie == null || ie.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, Qe = () => {
    const ie = [], oe = [], ee = [];
    M({}), setTimeout(() => t.enable.updateDisabledSectionsCache(), 50), c.details.forEach((Oe) => {
      Oe.type > 3 && Oe.enable && Oe.answer !== void 0 && Oe.answer !== "" && Oe.answer !== null && L().findIndex((Ln) => Ln.parentIndex.toString() === Oe.index.slice(0, -2).toString()) == -1 && ((Oe.type === be.PHOTO || Oe.type === be.SIGNATURE) && oe.push({
        dataKey: Oe.dataKey,
        name: Oe.name,
        answer: Oe.answer
      }), ie.push({
        dataKey: Oe.dataKey,
        name: Oe.name,
        answer: Oe.answer
      }), Oe.principal !== void 0 && ee.push({
        dataKey: Oe.dataKey,
        name: Oe.name,
        answer: Oe.answer,
        principal: Oe.principal,
        columnName: Oe.columnName
      }));
    }), k("details", "answers", ie), k("details", "templateDataKey", x.details.dataKey), k("details", "gearVersion", ct), k("details", "templateVersion", e.template.details.version || "0.0.0"), k("details", "validationVersion", e.validation.details.version || "0.0.0"), k("details", "docState", W()), k("details", "summary", JSON.parse(JSON.stringify(m))), k("details", "counter", [JSON.parse(JSON.stringify($))]);
    const ge = We().format("YYYY-MM-DD HH:mm:ss"), xe = Number((/* @__PURE__ */ new Date()).getTimezoneOffset() / 60 * -1);
    We.extend(mh), We.extend(xh);
    const Fe = We.tz.guess();
    dt(k, w, Fe, xe, ge), dt(_, s, Fe, xe, ge), dt(l, s, Fe, xe, ge), dt(f, d, Fe, xe, ge), _("details", "media", oe), _("details", "templateDataKey", x.details.dataKey), _("details", "gearVersion", ct), _("details", "templateVersion", e.template.details.version || "0.0.0"), _("details", "validationVersion", e.validation.details.version || "0.0.0"), l("details", "principals", ee), l("details", "templateDataKey", x.details.dataKey), l("details", "gearVersion", ct), l("details", "templateVersion", e.template.details.version || "0.0.0"), l("details", "validationVersion", e.validation.details.version || "0.0.0"), f("details", "notes", JSON.parse(JSON.stringify(r.details.notes))), f("details", "templateDataKey", x.details.dataKey), f("details", "gearVersion", ct), f("details", "templateVersion", e.template.details.version || "0.0.0"), f("details", "validationVersion", e.validation.details.version || "0.0.0"), o("sidebar", C.details);
  };
  function dt(ie, oe, ee, ge, pe) {
    oe.details.createdBy === void 0 || oe.details.createdBy === "" ? (ie("details", "createdBy", h().username), ie("details", "createdAt", pe), ie("details", "createdAtTimezone", ee.toString()), ie("details", "createdAtGMT", ge)) : (ie("details", "updatedBy", h().username), ie("details", "updatedAt", pe), ie("details", "updatedAtTimezone", ee.toString()), ie("details", "updatedAtGMT", ge), oe.details.createdAtTimezone || (ie("details", "createdAtTimezone", ee.toString()), ie("details", "createdAtGMT", ge)));
  }
  const lt = () => {
    Qe(), e.setResponseMobile(w.details, S.details, d.details, s.details, c);
  }, Xr = () => {
    Qe(), e.setSubmitMobile(w.details, S.details, d.details, s.details, c);
  };
  e.mobileExit(lt);
  const ea = (ie) => typeof ie == "object" && ie !== null && typeof ie.dataKey == "string" && typeof ie.label == "string" && Array.isArray(ie.index) && typeof ie.position == "number", Pt = (ie) => {
    K(ie), history.pushState(
      ie,
      ""
      /* title param: deprecated, ignored by browsers */
    );
  }, Zn = (ie) => {
    ea(ie.state) && (lt(), M({}), setTimeout(() => {
      K(ie.state), Kt();
    }, 50));
  };
  zn(() => {
    window.mobileBack = () => C.details.filter((oe, ee) => oe.enable && ee < N.activeComponent.position).length > 0 ? (history.back(), !0) : !1, window.addEventListener("popstate", Zn), _t(() => {
      delete window.mobileBack, window.removeEventListener("popstate", Zn);
    });
  });
  const Xn = () => C.details.filter((ie, oe) => ie.enable && oe < N.activeComponent.position).length > 0, ei = () => C.details.filter((ie, oe) => ie.enable && oe > N.activeComponent.position).length > 0, ti = (ie) => {
    lt();
    const oe = C.details.filter((pe, xe) => pe.enable && xe < N.activeComponent.position);
    if (oe.length === 0) return;
    const ee = oe[oe.length - 1], ge = C.details.findIndex((pe) => pe.dataKey === ee.dataKey);
    M({}), setTimeout(() => {
      Pt({
        dataKey: ee.dataKey,
        label: ee.label,
        index: JSON.parse(JSON.stringify(ee.index)),
        position: ge
      });
    }, 50), Kt();
  }, ni = (ie) => {
    lt();
    const oe = C.details.filter((pe, xe) => pe.enable && xe > N.activeComponent.position);
    if (oe.length === 0) return;
    const ee = oe[0], ge = C.details.findIndex((pe) => pe.dataKey === ee.dataKey);
    M({}), setTimeout(() => {
      Pt({
        dataKey: ee.dataKey,
        label: ee.label,
        index: JSON.parse(JSON.stringify(ee.index)),
        position: ge
      });
    }, 50), Kt();
  }, ta = (ie, oe, ee, ge) => {
    const pe = document.querySelector(".component-div");
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    }), pe == null || pe.scrollTo({
      top: 0,
      behavior: "smooth"
    }), lt(), M({}), setTimeout(() => Pt({
      dataKey: ie,
      label: oe,
      index: JSON.parse(JSON.stringify(ee)),
      position: ge
    }), 50);
  }, Mn = (ie, oe, ee) => {
    const ge = Ih(C.details, oe), pe = C.details[ge];
    Eh([{
      className: zt.ERROR,
      setShowFn: F
    }, {
      className: zt.REMARK,
      setShowFn: B
    }, {
      className: zt.BLANK,
      setShowFn: G
    }]);
    const xe = document.querySelector(".sidebar-span"), Fe = xe == null ? void 0 : xe.classList.contains("translate-x-0");
    jt() && Fe && Ye(), M({}), setTimeout(() => {
      Pt({
        dataKey: pe.dataKey,
        label: pe.label,
        index: JSON.parse(JSON.stringify(pe.index)),
        position: ge
      }), Mh(ee);
    }, 250);
  }, In = (ie) => {
    const oe = [], ee = [];
    c.details.forEach((ge) => {
      if (L().findIndex((xe) => xe.parentIndex.toString() === ge.index.slice(0, -2).toString()) == -1) {
        const xe = ge.level > 1 ? ge.index.slice(0, -1) : ge.index.slice(0, -2);
        ge.type > 4 && ge.enable && ge.validationState == 2 && oe.push({
          label: ge.label,
          message: ge.validationMessage,
          sideIndex: xe,
          dataKey: ge.dataKey
        }), ge.type > 4 && ge.enable && ge.validationState == 1 && ee.push({
          label: ge.label,
          message: ge.validationMessage,
          sideIndex: xe,
          dataKey: ge.dataKey
        });
      }
    }), le.setItems(oe), re.setItems(ee), F(!0);
  }, na = (ie) => {
    const oe = [];
    r.details.notes.forEach((ee) => {
      const ge = c.details.find((pe) => pe.dataKey == ee.dataKey);
      if (ge) {
        const pe = ge.level > 1 ? ge.index.slice(0, -1) : ge.index.slice(0, -2);
        oe.push({
          label: ge.label,
          sideIndex: pe,
          dataKey: ge.dataKey
        });
      }
    }), ve.setItems(oe), B(!0);
  }, ia = (ie) => {
    const oe = [];
    c.details.forEach((ee) => {
      if (L().findIndex((pe) => pe.parentIndex.toString() === ee.index.slice(0, -2).toString()) == -1 && ee.type > be.VARIABLE && ee.enable && (ee.answer === void 0 || ee.answer === "" || ee.type === be.LIST_TEXT_REPEAT && Array.isArray(ee.answer) && ee.answer.length === 1 || ee.type === be.LIST_SELECT_REPEAT && Array.isArray(ee.answer) && ee.answer.length === 1) && !(JSON.parse(JSON.stringify(ee.index[ee.index.length - 2])) === 0 && ee.level > 1)) {
        const pe = ee.level > 1 ? ee.index.slice(0, -1) : ee.index.slice(0, -2);
        oe.push({
          label: ee.label,
          sideIndex: pe,
          dataKey: ee.dataKey
        });
      }
    }), fe.setItems(oe), G(!0);
  }, ra = () => {
    c.details.forEach((ie, oe) => {
      const ee = JSON.parse(JSON.stringify(ie));
      if (L().findIndex((pe) => pe.parentIndex.toString() === ee.index.slice(0, -2).toString()) == -1 && ee.enable && ee.required) {
        const xe = ee.dataKey.split("@")[0].split("#");
        if (ee.level < 2 || ee.level > 1 && xe[1] !== void 0) {
          const Fe = typeof ee.answer;
          (ee.answer === void 0 || Fe === "string" && ee.answer === "" || Fe === "number" && ee.answer == 0 || Fe === "object" && Number(ee.type) == 21 && ee.answer.length < 2 || Fe === "object" && Number(ee.type) == 22 && ee.answer.length < 2 || Fe === "object" && ee.type > 22 && ee.answer.length == 0 || Fe === "object" && !isNaN(ee.answer) || Fe === "number" && isNaN(ee.answer) || JSON.stringify(ee.answer) === "[]") && (ee.validationMessage.push(n.details.language[0].validationRequired), ee.validationState = 2), o("details", oe, ee);
        }
      }
    });
  }, aa = (ie) => {
    M({}), setTimeout(() => t.enable.updateDisabledSectionsCache(), 50), m.error > 0 && In();
  }, la = () => {
    m.error > 0 ? q("E") : c.details.filter((ie) => Number(ie.validationState) === 1).length > 0 ? q("W") : q("C");
  }, ii = () => {
    const ie = [];
    for (let oe = 0; oe < 6; oe++)
      ie[oe] = Math.floor(Math.random() * 10);
    ae(ie.join(""));
  }, sa = (ie) => {
    M({}), setTimeout(() => t.enable.updateDisabledSectionsCache(), 50), lt(), tt("Data saved", 1500);
  }, En = (ie) => {
    ii(), la(), W() === "E" ? me(n.details.language[0].submitInvalid, 3e3) : (M({}), setTimeout(() => t.enable.updateDisabledSectionsCache(), 50), ra(), m.error === 0 ? (W() === "W" && es(n.details.language[0].submitWarning, 3e3), T(!0)) : me(n.details.language[0].submitEmpty, 3e3));
  }, oa = (ie) => {
    Q().length !== 0 && Q() === ne() ? (Xr(), Cn(zt.CONFIRMATION, T), tt(n.details.language[0].verificationSubmitted, 3e3)) : me(n.details.language[0].verificationInvalid, 3e3);
  }, da = (/* @__PURE__ */ new Date()).getTime() - e.timeStart.getTime();
  return (() => {
    var ie = Tf(), oe = ie.firstChild, ee = oe.firstChild, ge = ee.firstChild, pe = ge.firstChild, xe = pe.firstChild;
    return p(ie, g(Dh, {
      get show() {
        return H();
      },
      setShow: T,
      get captcha() {
        return ne();
      },
      onRefreshCaptcha: ii,
      onCaptchaChange: Y,
      onSubmit: oa
    }), oe), p(ie, g(Fi, {
      get show() {
        return J();
      },
      setShow: B,
      modalClass: "modal-remark",
      title: "List Remark",
      get icon() {
        return g(Gh, {});
      },
      iconBgClass: "text-yellow-400 bg-yellow-100",
      get items() {
        return ve.pageItems();
      },
      get totalItems() {
        return ve.totalItems();
      },
      get currentPage() {
        return ve.currentPage();
      },
      get maxPage() {
        return ve.maxPage();
      },
      get onPageChange() {
        return ve.setPage;
      },
      onItemClick: Mn
    }), oe), p(ie, g(Fi, {
      get show() {
        return Z();
      },
      setShow: G,
      modalClass: "modal-confirmation modal-blank",
      title: "List Blank",
      get icon() {
        return g(Yh, {});
      },
      iconBgClass: "bg-gray-200 text-gray-500",
      get items() {
        return fe.pageItems();
      },
      get totalItems() {
        return fe.totalItems();
      },
      get currentPage() {
        return fe.currentPage();
      },
      get maxPage() {
        return fe.maxPage();
      },
      get onPageChange() {
        return fe.setPage;
      },
      onItemClick: Mn
    }), oe), p(ie, g(sf, {
      get show() {
        return j();
      },
      setShow: F,
      get errorItems() {
        return le.pageItems();
      },
      get errorTotalItems() {
        return le.totalItems();
      },
      get errorCurrentPage() {
        return le.currentPage();
      },
      get errorMaxPage() {
        return le.maxPage();
      },
      get onErrorPageChange() {
        return le.setPage;
      },
      get warningItems() {
        return re.pageItems();
      },
      get warningTotalItems() {
        return re.totalItems();
      },
      get warningCurrentPage() {
        return re.currentPage();
      },
      get warningMaxPage() {
        return re.maxPage();
      },
      get onWarningPageChange() {
        return re.setPage;
      },
      onItemClick: Mn
    }), oe), pe.addEventListener("scroll", qt), p(pe, g(xf, {
      get sidebarDetails() {
        return C.details;
      },
      get activeDataKey() {
        return N.activeComponent.dataKey;
      },
      get activeIndex() {
        return N.activeComponent.index;
      },
      get templateAcronym() {
        return e.template.details.acronym;
      },
      get templateVersion() {
        return e.template.details.version || "0.0.0";
      },
      get validationVersion() {
        return e.validation.details.version || "0.0.0";
      },
      get clientMode() {
        return h().clientMode;
      },
      summary: m,
      get locale() {
        return n.details.language[0];
      },
      get formMode() {
        return A().formMode;
      },
      onSelect: ta,
      onSidebarCollapse: Ye,
      onWriteResponse: lt,
      onShowBlank: ia,
      onShowError: aa,
      onShowRemark: na,
      onSubmit: En
    }), xe), xe.addEventListener("scroll", Tt), p(xe, g(Lf, {
      get template() {
        return e.template;
      },
      get config() {
        return h();
      },
      get onMobile() {
        return Ne();
      },
      get renderGear() {
        return O();
      },
      timeDiff: da,
      onToggleTheme: Be,
      onSidebarCollapse: Ye,
      sidebar: C,
      form: N,
      onSelectTab: (Fe, Oe, Gt, Ln) => {
        Kt(), h().clientMode === ut.CAPI && lt(), M({}), setTimeout(() => Pt({
          dataKey: Fe,
          label: Oe,
          index: JSON.parse(JSON.stringify(Gt)),
          position: Ln
        }), 50);
      }
    }), null), p(xe, g(uh, {
      get onMobile() {
        return Ne();
      },
      get components() {
        return Le();
      },
      get dataKey() {
        return N.activeComponent.dataKey;
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
      },
      get audioHandler() {
        return e.audioHandler;
      },
      get barcodeHandler() {
        return e.barcodeHandler;
      },
      get videoHandler() {
        return e.videoHandler;
      },
      get fileHandler() {
        return e.fileHandler;
      }
    }), null), p(xe, g(D, {
      get when() {
        return !Ne();
      },
      get children() {
        return g(Ui, {
          get activeLabel() {
            return N.activeComponent.label;
          },
          get hasPrevious() {
            return Xn();
          },
          get hasNext() {
            return ei();
          },
          get hasErrors() {
            return m.error > 0;
          },
          get canSubmit() {
            return m.error === 0;
          },
          isMobile: !1,
          get showScrollTop() {
            return ye();
          },
          get formMode() {
            return A().formMode;
          },
          onPrevious: ti,
          onNext: ni,
          onShowError: In,
          onSubmit: En,
          onScrollTop: ht
        });
      }
    }), null), p(pe, g(D, {
      get when() {
        return Ne();
      },
      get children() {
        return g(Ui, {
          get activeLabel() {
            return N.activeComponent.label;
          },
          get hasPrevious() {
            return Xn();
          },
          get hasNext() {
            return ei();
          },
          get hasErrors() {
            return m.error > 0;
          },
          get canSubmit() {
            return m.error === 0;
          },
          isMobile: !0,
          get showScrollTop() {
            return ue();
          },
          get formMode() {
            return A().formMode;
          },
          onPrevious: ti,
          onNext: ni,
          onShowError: In,
          onSubmit: En,
          onScrollTop: ht,
          onSave: sa
        });
      }
    }), null), ie;
  })();
};
var Df = /* @__PURE__ */ y('<div class="backdrop-blur-sm overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex"><svg class="w-20 h-20 animate-spin"xmlns=http://www.w3.org/2000/svg viewBox="0 0 94.53 98.372"><circle cx=47.361 cy=8.646 r=8.646 style=fill:#1d4970></circle><circle cx=23.536 cy=16.331 r=8.646 style=fill:#0a77e8></circle><circle cx=8.646 cy=36.698 r=8.646 style=fill:#0f9af0></circle><circle cx=8.646 cy=61.867 r=8.646 style=fill:#0f9af0></circle><circle cx=23.536 cy=82.233 r=8.646 style=fill:#13bdf7></circle><circle cx=47.361 cy=89.726 r=8.646 style=fill:#13bdf7></circle><circle cx=71.282 cy=82.233 r=8.646 style=fill:#18e0ff></circle><circle cx=85.884 cy=61.867 r=8.646 style=fill:#65eaff></circle><circle cx=85.884 cy=36.698 r=8.646 style=fill:#b2f5ff>');
function jf(e) {
  let t = et({
    type: "success",
    autoHideDuration: 70
  }, e), n;
  return zn(() => {
    n = setTimeout(() => t.remove(), t.autoHideDuration);
  }), _t(() => {
    n && clearTimeout(n);
  }), Df();
}
var Kf = /* @__PURE__ */ y("<div>");
function zf() {
  const {
    loader: e
  } = th(), {
    removeLoader: t
  } = Gn();
  return (() => {
    var n = Kf();
    return p(n, () => e.map((i) => g(jf, {
      get remove() {
        return t(i.id);
      }
    }))), n;
  })();
}
const Ff = {
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
function Bf(e) {
  const t = [];
  function n(R) {
    const [N, K] = Un(R);
    return [N, K];
  }
  function i(R) {
    const [N, K] = z(R);
    return [N, K];
  }
  const r = n({
    details: [],
    sidebar: []
  }), a = n({
    status: 1,
    details: Ce({
      dataKey: "",
      answers: [],
      summary: [],
      counter: []
    }, e == null ? void 0 : e.response)
  }), s = n({
    status: 1,
    details: Ce({
      description: "",
      dataKey: "",
      acronym: "",
      title: "",
      version: "",
      components: []
    }, e == null ? void 0 : e.template)
  }), l = n({
    status: 1,
    details: Ce({
      description: "",
      dataKey: "",
      version: "",
      testFunctions: []
    }, e == null ? void 0 : e.validation)
  }), c = n({
    status: 1,
    details: Ce({
      description: "",
      dataKey: "",
      predata: []
    }, e == null ? void 0 : e.preset)
  }), o = n({
    status: 1,
    details: Ce({
      dataKey: "",
      media: []
    }, e == null ? void 0 : e.media)
  }), d = n({
    status: 1,
    details: Ce({
      dataKey: "",
      notes: []
    }, e == null ? void 0 : e.remark)
  }), f = n({
    details: []
  }), w = n(
    (e == null ? void 0 : e.locale) || Ff
  ), k = n({
    answer: 0,
    blank: 0,
    error: 0,
    remark: 0,
    clean: 0
  }), C = n({
    render: 0,
    validate: 0
  }), m = n({
    currentDataKey: ""
  }), u = n({
    details: []
  }), x = n({
    status: 1,
    details: {
      dataKey: "",
      notes: []
    }
  }), $ = n({
    status: 1,
    details: {
      principals: []
    }
  }), S = i({}), _ = i({}), L = i({}), V = i({}), v = i({}), h = i({}), b = i(
    {}
  ), O = i(!1), E = i([]), M = i([]), I = i([]);
  return {
    // Main stores
    reference: r,
    response: a,
    template: s,
    validation: l,
    preset: c,
    media: o,
    remark: d,
    sidebar: f,
    locale: w,
    // Helper stores
    summary: k,
    counter: C,
    input: m,
    nested: u,
    note: x,
    principal: $,
    // Signals
    referenceMap: S,
    sidebarIndexMap: _,
    compEnableMap: L,
    compValidMap: V,
    compSourceOptionMap: v,
    compVarMap: h,
    compSourceQuestionMap: b,
    referenceHistoryEnable: O,
    referenceHistory: E,
    sidebarHistory: M,
    referenceEnableFalse: I,
    // Cleanup
    dispose: () => {
      t.forEach((R) => R()), t.length = 0, r[1]({ details: [], sidebar: [] }), a[1]({ status: 1, details: { dataKey: "", answers: [], summary: [], counter: [] } }), s[1]({ status: 1, details: { description: "", dataKey: "", acronym: "", title: "", version: "", components: [] } }), l[1]({ status: 1, details: { description: "", dataKey: "", version: "", testFunctions: [] } }), c[1]({ status: 1, details: { description: "", dataKey: "", predata: [] } }), o[1]({ status: 1, details: { dataKey: "", media: [] } }), d[1]({ status: 1, details: { dataKey: "", notes: [] } }), f[1]({ details: [] }), k[1]({ answer: 0, blank: 0, error: 0, remark: 0, clean: 0 }), C[1]({ render: 0, validate: 0 }), m[1]({ currentDataKey: "" }), u[1]({ details: [] }), x[1]({ status: 1, details: { dataKey: "", notes: [] } }), $[1]({ status: 1, details: { principals: [] } }), S[1]({}), _[1]({}), L[1]({}), V[1]({}), v[1]({}), h[1]({}), b[1]({}), O[1](!1), E[1]([]), M[1]([]), I[1]([]);
    }
  };
}
const Hf = "", Uf = [], Jf = {
  dataKey: Hf,
  media: Uf
}, Wf = "", qf = "", Gf = [], Yf = {
  description: Wf,
  dataKey: qf,
  predata: Gf
}, Qf = "", Zf = [], Xf = {
  dataKey: Qf,
  notes: Zf
}, em = "", tm = "", nm = [], im = {
  description: em,
  dataKey: tm,
  answers: nm
}, ct = "2.0.0";
let cn = "0.0.0", un = "0.0.0";
function rm(e, t, n, i, r) {
  const a = [], s = [], l = [], c = [], o = [], d = [], [f, w] = e.note, k = t.components;
  if (!k || !Array.isArray(k) || k.length === 0)
    return {
      referenceList: a,
      sidebarList: s,
      nestedList: l,
      tmpVarComp: c,
      tmpEnableComp: o
    };
  const C = k[0];
  if (!Array.isArray(C) || C.length === 0)
    return {
      referenceList: a,
      sidebarList: s,
      nestedList: l,
      tmpVarComp: c,
      tmpEnableComp: o
    };
  const m = ($) => {
    if (!(n != null && n.testFunctions)) return {
      vals: void 0,
      compVal: void 0
    };
    const S = n.testFunctions.findIndex((_) => _.dataKey === $);
    return S !== -1 ? {
      vals: n.testFunctions[S].validations,
      compVal: n.testFunctions[S].componentValidation
    } : {
      vals: void 0,
      compVal: void 0
    };
  }, u = ($) => {
    if (($.enableRemark === void 0 || $.enableRemark) && i != null && i.notes) {
      const S = i.notes.findIndex((_) => _.dataKey === $.dataKey);
      if (S !== -1) {
        const _ = i.notes[S], L = [...f.details.notes, _];
        return w("details", "notes", L), !0;
      }
    }
    return !1;
  }, x = ($, S, _, L) => {
    for (let V = 0; V < $.length; V++) {
      const v = $[V], h = v.type;
      if (h !== 1 && h !== 3) {
        if (d.includes(v.dataKey))
          throw new Error(`Duplicate dataKey on ${v.dataKey}`);
        d.push(v.dataKey);
      }
      let b = v.answer;
      h === 21 || h === 22 ? b = JSON.parse(JSON.stringify(b)) : h === 4 && _ < 2 && b === void 0 && !L && c.push(JSON.parse(JSON.stringify(v)));
      let O = v.components;
      if (h === 1) {
        let A = L;
        v.enableCondition !== void 0 ? (o.push(JSON.parse(JSON.stringify(v))), A = !1) : A = !0, s.push({
          dataKey: v.dataKey,
          name: v.name,
          label: v.label,
          description: v.description,
          level: _,
          index: [...S, V],
          components: O,
          sourceQuestion: v.sourceQuestion || "",
          enable: A,
          enableCondition: v.enableCondition || "",
          componentEnable: v.componentEnable || []
        });
      }
      h === 2 && l.push({
        dataKey: v.dataKey,
        name: v.name,
        label: v.label,
        description: v.description,
        level: _,
        index: [...S, V],
        components: O,
        sourceQuestion: v.sourceQuestion || "",
        enable: L,
        enableCondition: v.enableCondition || "",
        componentEnable: v.componentEnable || []
      }), h > 2 && v.enableCondition !== void 0 && !L && o.push(JSON.parse(JSON.stringify(v)));
      const {
        vals: E,
        compVal: M
      } = m(v.dataKey), I = u(v);
      if (a.push({
        dataKey: v.dataKey,
        name: v.name,
        label: v.label,
        hint: v.hint || "",
        description: v.description,
        type: h,
        answer: b,
        index: [...S, V],
        level: _,
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
        validations: E,
        componentValidation: M,
        hasRemark: I,
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
      }), O && Array.isArray(O))
        for (let A = 0; A < O.length; A++)
          Array.isArray(O[A]) && x(O[A], [...S, V, A], _ + 1, L);
    }
  };
  for (let $ = 0; $ < C.length; $++) {
    const S = C[$];
    let _ = !1;
    S.enableCondition !== void 0 && (o.push(JSON.parse(JSON.stringify(S))), _ = !0), s.push({
      dataKey: S.dataKey,
      name: S.name,
      label: S.label,
      description: S.description,
      level: 0,
      index: [0, $],
      components: S.components,
      sourceQuestion: S.sourceQuestion || "",
      enable: !_,
      enableCondition: S.enableCondition || "",
      componentEnable: S.componentEnable || []
    }), a.push({
      dataKey: S.dataKey,
      name: S.name,
      label: S.label,
      hint: S.hint || "",
      description: S.description,
      type: S.type,
      index: [0, $],
      level: 0,
      options: S.options,
      sourceQuestion: S.sourceQuestion,
      enable: !0,
      enableCondition: S.enableCondition || "",
      componentEnable: S.componentEnable || [],
      enableRemark: S.enableRemark !== void 0 ? S.enableRemark : !0,
      validationState: 0,
      validationMessage: []
    }), S.components && S.components[0] && x(S.components[0], [0, $, 0], 1, _);
  }
  return {
    referenceList: a,
    sidebarList: s,
    nestedList: l,
    tmpVarComp: c,
    tmpEnableComp: o
  };
}
function Mm(e) {
  const {
    data: t,
    config: n,
    mobileHandlers: i = {},
    callbacks: r = {}
  } = e, a = Ce(Ce({}, Wa), n);
  t.reference;
  const s = t.template || {}, l = t.preset || Yf, c = t.response || im, o = t.validation || {}, d = t.media || Jf, f = t.remark || Xf;
  cn = s.version || "0.0.0", un = o.version || "0.0.0";
  const w = i.uploadHandler || (() => {
  }), k = i.gpsHandler || (() => {
  }), C = i.offlineSearch || (() => {
  }), m = i.onlineSearch || (() => de(null, null, function* () {
    return {};
  })), u = i.exitHandler || ((F) => F && F()), x = i.openMap || (() => {
  }), $ = i.audioHandler || (() => {
  }), S = i.barcodeHandler || (() => {
  }), _ = i.videoHandler || (() => {
  }), L = i.fileHandler || (() => {
  }), V = r.onSave || (() => {
  }), v = r.onSubmit || (() => {
  }), h = s;
  if (!h.components || !Array.isArray(h.components) || h.components.length === 0)
    throw me("Template configuration error: No components found", 5e3), new Error("Template configuration error: No components found");
  if (!Array.isArray(h.components[0]) || h.components[0].length === 0)
    throw me("Template configuration error: No sections defined", 5e3), new Error("Template configuration error: No sections defined");
  const b = Bf({
    template: s,
    validation: o,
    preset: l,
    response: c,
    media: d,
    remark: f
  }), {
    referenceList: O,
    sidebarList: E,
    nestedList: M,
    tmpVarComp: I,
    tmpEnableComp: A
  } = rm(b, s, o, f);
  b.reference[1]("details", O), b.sidebar[1]("details", E), b.nested[1]("details", M);
  const R = {
    clientMode: a.clientMode,
    formMode: a.formMode,
    initialMode: a.initialMode,
    lookupMode: a.lookupMode,
    username: a.username || "",
    token: a.token || "",
    baseUrl: a.baseUrl || "",
    lookupKey: a.lookupKey || "keys",
    lookupValue: a.lookupValue || "values"
  }, N = hs(b, R);
  N.reference.initializeMaps(), N.enable.initializeEnableStates();
  const K = {
    clientMode: a.clientMode,
    formMode: a.formMode,
    initialMode: a.initialMode,
    lookupMode: a.lookupMode,
    username: a.username || "",
    token: a.token || "",
    baseUrl: a.baseUrl || "",
    lookupKey: a.lookupKey || "keys",
    lookupValue: a.lookupValue || "values"
  }, H = /* @__PURE__ */ new Date(), T = document.getElementById("FormGear-root");
  if (!T)
    throw me("Mount point not found: FormGear-root", 5e3), new Error("Mount point not found: FormGear-root");
  return Pa(() => g(Xa, {
    stores: b,
    get children() {
      return g(fs, {
        services: N,
        get children() {
          return g(Za, {
            get children() {
              return g(eh, {
                get children() {
                  return [g(Pf, {
                    config: K,
                    timeStart: H,
                    runAll: 0,
                    tmpEnableComp: A,
                    tmpVarComp: I,
                    template: {
                      details: s
                    },
                    preset: {
                      details: l
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
                    uploadHandler: w,
                    GpsHandler: k,
                    offlineSearch: C,
                    onlineSearch: m,
                    mobileExit: u,
                    setResponseMobile: V,
                    setSubmitMobile: v,
                    openMap: x,
                    audioHandler: $,
                    barcodeHandler: S,
                    videoHandler: _,
                    fileHandler: L
                  }), g(zf, {})];
                }
              });
            }
          });
        }
      });
    }
  }), T), {
    getResponse() {
      return b.response[0].details;
    },
    getMedia() {
      return b.media[0].details;
    },
    getRemarks() {
      return b.remark[0].details;
    },
    getPrincipal() {
      return b.reference[0].details.filter((B) => B.principal !== void 0 && B.principal > 0).sort((B, Z) => (B.principal || 0) - (Z.principal || 0)).map((B) => ({
        dataKey: B.dataKey,
        name: B.name,
        answer: B.answer,
        principal: B.principal,
        columnName: B.columnName
      }));
    },
    getReference() {
      return b.reference[0];
    },
    getSummary() {
      const F = b.summary[0];
      return {
        answer: F.answer,
        blank: F.blank,
        error: F.error,
        remark: F.remark
      };
    },
    validate() {
      return !b.reference[0].details.some((B) => B.validationState === 2);
    },
    setValue(F, J) {
      const Z = b.reference[0].details.findIndex((G) => G.dataKey === F);
      Z !== -1 && b.reference[1]("details", Z, "answer", J);
    },
    getValue(F) {
      const B = b.reference[0].details.find((Z) => Z.dataKey === F);
      return B == null ? void 0 : B.answer;
    },
    save() {
      V(b.response[0].details, b.media[0].details, b.remark[0].details, this.getPrincipal(), b.reference[0]);
    },
    submit() {
      v(b.response[0].details, b.media[0].details, b.remark[0].details, this.getPrincipal(), b.reference[0]);
    },
    destroy() {
      T && (T.innerHTML = ""), b.dispose();
    }
  };
}
function am(e = {}) {
  const { debug: t = !1 } = e, n = (l, c) => {
  }, i = (l, c, ...o) => {
    try {
      const d = window.Android;
      if (!d)
        return n(`Android interface not available for ${l}`), c;
      const f = d[l];
      if (typeof f != "function")
        return n(`Method ${l} not found on Android interface`), c;
      const w = f.apply(d, o);
      return n(`${l} called`, { args: o, result: w }), w;
    } catch (d) {
      return c;
    }
  }, r = (l, c) => {
    if (!l) return c;
    try {
      return JSON.parse(l);
    } catch (o) {
      return c;
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
      return de(this, null, function* () {
        return i("openCamera", "");
      });
    },
    openCameraWithGps(l) {
      return de(this, null, function* () {
        const c = i("openCameraWithGps", "", l);
        return r(c, {
          latitude: 0,
          longitude: 0,
          accuracy: 0
        });
      });
    },
    uploadFile(l) {
      return de(this, null, function* () {
        const c = i("uploadFile", "", l);
        return r(c, {
          path: "",
          name: "",
          mimeType: "",
          size: 0
        });
      });
    },
    scanBarcode() {
      return de(this, null, function* () {
        const l = i("scanBarcode", "");
        return r(l, {
          value: "",
          format: ""
        });
      });
    },
    // =========================================================================
    // Location
    // =========================================================================
    getCurrentLocation() {
      return de(this, null, function* () {
        const l = i("getCurrentLocation", "");
        return r(l, {
          latitude: 0,
          longitude: 0
        });
      });
    },
    openMap(l) {
      i(
        "openMap",
        void 0,
        l.latitude,
        l.longitude
      );
    },
    // =========================================================================
    // Data Persistence
    // =========================================================================
    saveResponse(l) {
      return de(this, null, function* () {
        const c = JSON.stringify(l);
        i("saveResponse", void 0, c);
      });
    },
    submitResponse(l) {
      return de(this, null, function* () {
        const c = JSON.stringify(l);
        i("submitResponse", void 0, c);
      });
    },
    // =========================================================================
    // Offline Data
    // =========================================================================
    searchOffline(l, c, o) {
      return de(this, null, function* () {
        const d = i(
          "searchOffline",
          "[]",
          l,
          c,
          JSON.stringify(o)
        );
        return r(d, []);
      });
    },
    // =========================================================================
    // Lifecycle
    // =========================================================================
    exit(l) {
      l && l(), i("exit", void 0);
    },
    showToast(l, c = 3e3) {
      i("showToast", void 0, l, c);
    },
    showConfirmDialog(l, c) {
      return de(this, null, function* () {
        return i("showConfirmDialog", !1, l, c);
      });
    },
    // =========================================================================
    // Logging
    // =========================================================================
    log(l, c, o) {
      const d = o ? JSON.stringify(o) : "";
      i("log", void 0, l, c, d);
    }
  };
}
function lm() {
  return typeof window != "undefined" && typeof window.Android != "undefined";
}
typeof window != "undefined" && !window.__formgear_callbacks__ && (window.__formgear_callbacks__ = {});
let sm = 0;
function om() {
  return `cb_${Date.now()}_${++sm}`;
}
function dm(e = {}) {
  const { timeout: t = 3e4, debug: n = !1 } = e, i = (o, d) => {
  }, r = () => {
    var o, d;
    return (d = (o = window.webkit) == null ? void 0 : o.messageHandlers) == null ? void 0 : d.FormGearHandler;
  }, a = (o, d) => new Promise((f, w) => {
    var x;
    const k = r();
    if (!k) {
      w(new Error("iOS handler not available"));
      return;
    }
    const C = om(), m = setTimeout(() => {
      var $;
      ($ = window.__formgear_callbacks__) == null || delete $[C], w(new Error(`Timeout waiting for ${o} response`));
    }, t);
    window.__formgear_callbacks__ && (window.__formgear_callbacks__[C] = ($) => {
      var S;
      clearTimeout(m), (S = window.__formgear_callbacks__) == null || delete S[C], f($);
    });
    const u = {
      action: o,
      callbackId: C,
      data: d
    };
    try {
      k.postMessage(u);
    } catch ($) {
      clearTimeout(m), (x = window.__formgear_callbacks__) == null || delete x[C], w($);
    }
  }), s = (o, d) => {
    const f = r();
    if (!f)
      return;
    const w = {
      action: o,
      callbackId: "",
      // Empty for no-response messages
      data: d
    };
    try {
      f.postMessage(w), i(`Sent no-response message: ${o}`, d);
    } catch (k) {
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
      return de(this, null, function* () {
        try {
          return yield a("openCamera");
        } catch (o) {
          return "";
        }
      });
    },
    openCameraWithGps(o) {
      return de(this, null, function* () {
        try {
          return yield a("openCameraWithGps", { needPhoto: o });
        } catch (d) {
          return { latitude: 0, longitude: 0, accuracy: 0 };
        }
      });
    },
    uploadFile(o) {
      return de(this, null, function* () {
        try {
          return yield a("uploadFile", { accept: o });
        } catch (d) {
          return { path: "", name: "", mimeType: "", size: 0 };
        }
      });
    },
    scanBarcode() {
      return de(this, null, function* () {
        try {
          return yield a("scanBarcode");
        } catch (o) {
          return { value: "", format: "" };
        }
      });
    },
    // =========================================================================
    // Location
    // =========================================================================
    getCurrentLocation() {
      return de(this, null, function* () {
        try {
          return yield a("getCurrentLocation");
        } catch (o) {
          return { latitude: 0, longitude: 0 };
        }
      });
    },
    openMap(o) {
      s("openMap", o);
    },
    // =========================================================================
    // Data Persistence
    // =========================================================================
    saveResponse(o) {
      return de(this, null, function* () {
        try {
          yield a("saveResponse", o);
        } catch (d) {
        }
      });
    },
    submitResponse(o) {
      return de(this, null, function* () {
        try {
          yield a("submitResponse", o);
        } catch (d) {
        }
      });
    },
    // =========================================================================
    // Offline Data
    // =========================================================================
    searchOffline(o, d, f) {
      return de(this, null, function* () {
        try {
          return yield a("searchOffline", {
            lookupId: o,
            version: d,
            conditions: f
          });
        } catch (w) {
          return [];
        }
      });
    },
    // =========================================================================
    // Lifecycle
    // =========================================================================
    exit(o) {
      o && o(), s("exit");
    },
    showToast(o, d = 3e3) {
      s("showToast", { message: o, duration: d });
    },
    showConfirmDialog(o, d) {
      return de(this, null, function* () {
        try {
          return yield a("showConfirmDialog", { title: o, message: d });
        } catch (f) {
          return !1;
        }
      });
    },
    // =========================================================================
    // Logging
    // =========================================================================
    log(o, d, f) {
      s("log", { level: o, message: d, data: f });
    }
  };
}
function cm() {
  var e, t;
  return typeof window != "undefined" && typeof ((t = (e = window.webkit) == null ? void 0 : e.messageHandlers) == null ? void 0 : t.FormGearHandler) != "undefined";
}
typeof window != "undefined" && (window.__formgear_resolve_callback__ = (e, t) => {
  var i;
  const n = (i = window.__formgear_callbacks__) == null ? void 0 : i[e];
  n && n(t);
});
typeof window != "undefined" && !window.__formgear_callbacks__ && (window.__formgear_callbacks__ = {});
let um = 0;
function gm() {
  return `flutter_cb_${Date.now()}_${++um}`;
}
function hm(e = {}) {
  const { timeout: t = 3e4, debug: n = !1 } = e, i = (l, c) => de(null, null, function* () {
    const o = window.flutter_inappwebview;
    if (!o)
      throw new Error("Flutter InAppWebView not available");
    const d = new Promise((w, k) => {
      setTimeout(
        () => k(new Error(`Timeout calling ${l}`)),
        t
      );
    }), f = o.callHandler(
      l,
      c
    );
    return Promise.race([f, d]);
  }), r = (l, c, o) => de(null, null, function* () {
    try {
      return yield i(l, o);
    } catch (d) {
      return c;
    }
  });
  return {
    platform: "flutter",
    get isAvailable() {
      return typeof window.flutter_inappwebview != "undefined";
    },
    // Camera & Media
    openCamera() {
      return de(this, null, function* () {
        return r("openCamera", "");
      });
    },
    openCameraWithGps(l) {
      return de(this, null, function* () {
        return r("openCameraWithGps", { latitude: 0, longitude: 0, accuracy: 0 }, l);
      });
    },
    uploadFile(l) {
      return de(this, null, function* () {
        return r("uploadFile", { path: "", name: "", mimeType: "", size: 0 }, l);
      });
    },
    scanBarcode() {
      return de(this, null, function* () {
        return r("scanBarcode", { value: "", format: "" });
      });
    },
    // Location
    getCurrentLocation() {
      return de(this, null, function* () {
        return r("getCurrentLocation", { latitude: 0, longitude: 0 });
      });
    },
    openMap(l) {
      r("openMap", void 0, l);
    },
    // Data Persistence
    saveResponse(l) {
      return de(this, null, function* () {
        yield r("saveResponse", void 0, l);
      });
    },
    submitResponse(l) {
      return de(this, null, function* () {
        yield r("submitResponse", void 0, l);
      });
    },
    // Offline Data
    searchOffline(l, c, o) {
      return de(this, null, function* () {
        return r("searchOffline", [], { lookupId: l, version: c, conditions: o });
      });
    },
    // Lifecycle
    exit(l) {
      l && l(), r("exit", void 0);
    },
    showToast(l, c = 3e3) {
      r("showToast", void 0, { message: l, duration: c });
    },
    showConfirmDialog(l, c) {
      return de(this, null, function* () {
        return r("showConfirmDialog", !1, { title: l, message: c });
      });
    },
    // Logging
    log(l, c, o) {
      r("log", void 0, { level: l, message: c, data: o });
    }
  };
}
function fm(e = {}) {
  const { timeout: t = 3e4, debug: n = !1 } = e, i = (o, d) => {
  }, r = (o, d) => new Promise((f, w) => {
    var x;
    const k = window.FormGearChannel;
    if (!k) {
      w(new Error("Flutter channel not available"));
      return;
    }
    const C = gm(), m = setTimeout(() => {
      var $;
      ($ = window.__formgear_callbacks__) == null || delete $[C], w(new Error(`Timeout waiting for ${o} response`));
    }, t);
    window.__formgear_callbacks__ && (window.__formgear_callbacks__[C] = ($) => {
      var S;
      clearTimeout(m), (S = window.__formgear_callbacks__) == null || delete S[C], f($);
    });
    const u = {
      method: o,
      args: d,
      callbackId: C
    };
    try {
      k.postMessage(JSON.stringify(u));
    } catch ($) {
      clearTimeout(m), (x = window.__formgear_callbacks__) == null || delete x[C], w($);
    }
  }), a = (o, d) => {
    const f = window.FormGearChannel;
    if (!f)
      return;
    const w = { method: o, args: d };
    try {
      f.postMessage(JSON.stringify(w)), i(`Sent no-response message: ${o}`, d);
    } catch (k) {
    }
  }, s = (o, d, f) => de(null, null, function* () {
    try {
      return yield r(o, f);
    } catch (w) {
      return d;
    }
  });
  return {
    platform: "flutter",
    get isAvailable() {
      return typeof window.FormGearChannel != "undefined";
    },
    // Camera & Media
    openCamera() {
      return de(this, null, function* () {
        return s("openCamera", "");
      });
    },
    openCameraWithGps(o) {
      return de(this, null, function* () {
        return s("openCameraWithGps", { latitude: 0, longitude: 0, accuracy: 0 }, { needPhoto: o });
      });
    },
    uploadFile(o) {
      return de(this, null, function* () {
        return s("uploadFile", { path: "", name: "", mimeType: "", size: 0 }, { accept: o });
      });
    },
    scanBarcode() {
      return de(this, null, function* () {
        return s("scanBarcode", { value: "", format: "" });
      });
    },
    // Location
    getCurrentLocation() {
      return de(this, null, function* () {
        return s("getCurrentLocation", { latitude: 0, longitude: 0 });
      });
    },
    openMap(o) {
      a("openMap", o);
    },
    // Data Persistence
    saveResponse(o) {
      return de(this, null, function* () {
        yield s("saveResponse", void 0, o);
      });
    },
    submitResponse(o) {
      return de(this, null, function* () {
        yield s("submitResponse", void 0, o);
      });
    },
    // Offline Data
    searchOffline(o, d, f) {
      return de(this, null, function* () {
        return s("searchOffline", [], { lookupId: o, version: d, conditions: f });
      });
    },
    // Lifecycle
    exit(o) {
      o && o(), a("exit");
    },
    showToast(o, d = 3e3) {
      a("showToast", { message: o, duration: d });
    },
    showConfirmDialog(o, d) {
      return de(this, null, function* () {
        return s("showConfirmDialog", !1, { title: o, message: d });
      });
    },
    // Logging
    log(o, d, f) {
      a("log", { level: o, message: d, data: f });
    }
  };
}
function Vt() {
  return typeof window != "undefined" && typeof window.flutter_inappwebview != "undefined";
}
function Yn() {
  return typeof window != "undefined" && typeof window.FormGearChannel != "undefined";
}
function Im() {
  return Vt() || Yn();
}
typeof window != "undefined" && (window.__formgear_flutter_callback__ = (e, t) => {
  var i;
  const n = (i = window.__formgear_callbacks__) == null ? void 0 : i[e];
  n && n(t);
});
function Ji(e = {}) {
  const { debug: t = !1 } = e, n = (a, s) => {
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
      return de(this, null, function* () {
        return new Promise((a) => {
          const s = document.createElement("input");
          s.type = "file", s.accept = "image/*", s.capture = "environment", s.onchange = () => {
            var c;
            const l = (c = s.files) == null ? void 0 : c[0];
            if (l) {
              const o = new FileReader();
              o.onload = () => {
                a(o.result);
              }, o.onerror = () => a(""), o.readAsDataURL(l);
            } else
              a("");
          }, s.oncancel = () => a(""), s.click();
        });
      });
    },
    openCameraWithGps(a) {
      return de(this, null, function* () {
        const s = {
          latitude: 0,
          longitude: 0,
          accuracy: 0,
          timestamp: Date.now()
        };
        try {
          const l = yield new Promise(
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
          s.latitude = l.coords.latitude, s.longitude = l.coords.longitude, s.accuracy = l.coords.accuracy, s.timestamp = l.timestamp;
        } catch (l) {
        }
        if (a) {
          const l = yield this.openCamera();
          s.photo = l;
        }
        return s;
      });
    },
    uploadFile(a) {
      return de(this, null, function* () {
        return new Promise((s) => {
          const l = document.createElement("input");
          l.type = "file", l.accept = a, l.onchange = () => {
            var o;
            const c = (o = l.files) == null ? void 0 : o[0];
            if (c) {
              const d = new FileReader();
              d.onload = () => {
                s({
                  path: URL.createObjectURL(c),
                  name: c.name,
                  mimeType: c.type,
                  size: c.size,
                  base64: d.result
                });
              }, d.onerror = () => {
                s({
                  path: "",
                  name: "",
                  mimeType: "",
                  size: 0
                });
              }, d.readAsDataURL(c);
            } else
              s({
                path: "",
                name: "",
                mimeType: "",
                size: 0
              });
          }, l.oncancel = () => {
            s({
              path: "",
              name: "",
              mimeType: "",
              size: 0
            });
          }, l.click();
        });
      });
    },
    scanBarcode() {
      return de(this, null, function* () {
        if ("BarcodeDetector" in window)
          try {
            const a = window.BarcodeDetector, s = new a();
          } catch (a) {
          }
        return { value: "", format: "" };
      });
    },
    // =========================================================================
    // Location
    // =========================================================================
    getCurrentLocation() {
      return de(this, null, function* () {
        try {
          const a = yield new Promise(
            (s, l) => {
              if (!navigator.geolocation) {
                l(new Error("Geolocation not supported"));
                return;
              }
              navigator.geolocation.getCurrentPosition(s, l, {
                enableHighAccuracy: !0,
                timeout: 3e4,
                maximumAge: 0
              });
            }
          );
          return {
            latitude: a.coords.latitude,
            longitude: a.coords.longitude
          };
        } catch (a) {
          return { latitude: 0, longitude: 0 };
        }
      });
    },
    openMap(a) {
      const s = `https://www.google.com/maps?q=${a.latitude},${a.longitude}`;
      window.open(s, "_blank");
    },
    // =========================================================================
    // Data Persistence
    // =========================================================================
    saveResponse(a) {
      return de(this, null, function* () {
        try {
          localStorage.setItem("formgear_draft", JSON.stringify(a)), n("Response saved to localStorage");
        } catch (s) {
        }
      });
    },
    submitResponse(a) {
      return de(this, null, function* () {
      });
    },
    // =========================================================================
    // Offline Data
    // =========================================================================
    searchOffline(a, s, l) {
      return de(this, null, function* () {
        try {
          const c = `formgear_lookup_${a}_${s}`, o = localStorage.getItem(c);
          if (o) {
            const d = JSON.parse(o);
            return Array.isArray(d) ? d : [];
          }
        } catch (c) {
        }
        return [];
      });
    },
    // =========================================================================
    // Lifecycle
    // =========================================================================
    exit(a) {
      a && a();
    },
    showToast(a, s = 3e3) {
      const l = window.Toastify;
      if (l) {
        l({
          text: a,
          duration: s,
          gravity: "bottom",
          position: "center"
        }).showToast();
        return;
      }
    },
    showConfirmDialog(a, s) {
      return de(this, null, function* () {
        return window.confirm(`${a}

${s}`);
      });
    },
    // =========================================================================
    // Logging
    // =========================================================================
    log(a, s, l) {
    }
  };
}
function Em() {
  return typeof window != "undefined";
}
const pt = {
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
function kt(r, a, s) {
  return de(this, arguments, function* (e, t, n, i = {}) {
    const { debug: l = !1, timeout: c = 3e4 } = i;
    if (!Vt())
      return n;
    try {
      const o = new Promise((w, k) => {
        setTimeout(() => k(new Error(`Timeout calling ${e}`)), c);
      }), d = window.flutter_inappwebview.callHandler(
        e,
        t
      );
      return yield Promise.race([d, o]);
    } catch (o) {
      return n;
    }
  });
}
function Zr(e = {}) {
  const { debug: t = !1 } = e;
  return {
    /**
     * Upload handler - calls Flutter's openCamera or uploadFile handler
     */
    uploadHandler: (n) => {
      kt(pt.OPEN_CAMERA, void 0, "", e).then((i) => {
        i && n(i);
      }).catch((i) => {
      });
    },
    /**
     * GPS handler - calls Flutter's openCameraWithGps handler
     */
    gpsHandler: (n, i) => {
      kt(
        pt.OPEN_CAMERA_WITH_GPS,
        i != null ? i : !1,
        { latitude: 0, longitude: 0, accuracy: 0 },
        e
      ).then((r) => {
        n(r, r.remark || "");
      }).catch((r) => {
        n({ latitude: 0, longitude: 0, accuracy: 0 }, "");
      });
    },
    /**
     * Offline search handler - calls Flutter's searchOffline handler
     */
    offlineSearch: (n, i, r, a) => {
      kt(
        pt.SEARCH_OFFLINE,
        { lookupId: n, version: i, conditions: r },
        [],
        e
      ).then((s) => {
        a(s);
      }).catch((s) => {
        a([]);
      });
    },
    /**
     * Online search handler - not typically used in Flutter (offline-first)
     * But provided for compatibility
     */
    onlineSearch: (n) => de(null, null, function* () {
      try {
        return yield (yield fetch(n)).json();
      } catch (i) {
        return {};
      }
    }),
    /**
     * Exit handler - calls Flutter's mobileExit handler
     */
    exitHandler: (n) => {
      n && n(), kt(pt.EXIT, void 0, void 0, e).catch((i) => {
      });
    },
    /**
     * Open map handler - calls Flutter's openMap handler
     */
    openMap: (n) => {
      var a, s, l, c;
      const i = (s = (a = n.lat) != null ? a : n.latitude) != null ? s : 0, r = (c = (l = n.long) != null ? l : n.longitude) != null ? c : 0;
      kt(
        pt.OPEN_MAP,
        { latitude: i, longitude: r },
        void 0,
        e
      ).catch((o) => {
      });
    }
  };
}
function Lm(e = {}) {
  if (Vt())
    return e.debug, Zr(e);
  e.debug;
}
function mm(e = {}) {
  return {
    onSave: (t, n, i, r, a) => de(null, null, function* () {
      yield kt(
        pt.SAVE_RESPONSE,
        { response: t, media: n, remark: i, principal: r, reference: a },
        void 0,
        e
      );
    }),
    onSubmit: (t, n, i, r, a) => de(null, null, function* () {
      yield kt(
        pt.SUBMIT_RESPONSE,
        { response: t, media: n, remark: i, principal: r, reference: a },
        void 0,
        e
      );
    })
  };
}
function Om(e = {}) {
  const t = Vt();
  return e.debug, t ? {
    isFlutter: !0,
    mobileHandlers: Zr(e),
    callbacks: mm(e)
  } : {
    isFlutter: !1,
    mobileHandlers: void 0,
    callbacks: void 0
  };
}
function Qn() {
  if (typeof window == "undefined")
    return {
      platform: "web",
      confidence: "fallback",
      details: "Server-side rendering detected"
    };
  if (Vt())
    return {
      platform: "flutter",
      confidence: "definite",
      details: "Flutter InAppWebView detected (flutter_inappwebview)"
    };
  if (Yn())
    return {
      platform: "flutter",
      confidence: "definite",
      details: "Flutter channel detected (webview_flutter)"
    };
  if (lm())
    return {
      platform: "android",
      confidence: "definite",
      details: "Android WebView detected (window.Android)"
    };
  if (cm())
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
function vm(e = {}) {
  const { forcePlatform: t, debug: n = !1 } = e;
  if (t)
    return Wi(t, e);
  const i = Qn();
  return Wi(i.platform, e);
}
function Wi(e, t) {
  switch (e) {
    case "android":
      return am(t);
    case "ios":
      return dm(t);
    case "flutter":
      return Vt() ? hm(t) : Yn() ? fm(t) : Ji(t);
    default:
      return Ji(t);
  }
}
let gn = null;
function Am(e) {
  return gn || (gn = vm(e)), gn;
}
function Rm() {
  gn = null;
}
function Nm() {
  const e = Qn();
  return e.platform !== "web" && e.confidence === "definite";
}
function Vm() {
  if (typeof window == "undefined") return !1;
  const e = navigator.userAgent.toLowerCase();
  return e.includes("android") || e.includes("iphone") || e.includes("ipad") || e.includes("ipod") || e.includes("mobile");
}
function Tm() {
  switch (Qn().platform) {
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
  ir as ClientMode,
  Ja as ControlType,
  Wa as DEFAULT_CONFIG,
  pt as FLUTTER_HANDLER_NAMES,
  rr as FormMode,
  ar as InitialMode,
  lr as LookupMode,
  Ha as OptionType,
  fs as ServiceProvider,
  Ua as ValidationType,
  am as createAndroidBridge,
  vm as createBridge,
  mm as createFlutterCallbacks,
  fm as createFlutterChannelBridge,
  hm as createFlutterInAppWebViewBridge,
  Zr as createFlutterMobileHandlers,
  Mm as createFormGear,
  hs as createFormServices,
  dm as createIOSBridge,
  Ji as createWebBridge,
  Lm as detectFlutterHandlers,
  Qn as detectPlatform,
  ct as gearVersion,
  Am as getBridge,
  Tm as getPlatformName,
  Om as initFlutterIntegration,
  lm as isAndroidAvailable,
  Im as isFlutterAvailable,
  Yn as isFlutterChannelAvailable,
  Vt as isFlutterInAppWebViewAvailable,
  cm as isIOSAvailable,
  Vm as isMobile,
  Nm as isNativeApp,
  Em as isWebAvailable,
  Rm as resetBridge,
  Sm as useAnswerService,
  $m as useEnableService,
  pm as useExpressionService,
  Cm as useHistoryService,
  _m as useNestedService,
  ym as useReferenceService,
  gt as useServices,
  km as useValidationService
};
//# sourceMappingURL=form-gear.es.js.map
