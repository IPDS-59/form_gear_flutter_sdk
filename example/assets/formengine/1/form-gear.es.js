var ga = Object.defineProperty, ha = Object.defineProperties;
var fa = Object.getOwnPropertyDescriptors;
var ri = Object.getOwnPropertySymbols;
var ma = Object.prototype.hasOwnProperty, va = Object.prototype.propertyIsEnumerable;
var On = (e, t, n) => t in e ? ga(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, Se = (e, t) => {
  for (var n in t || (t = {}))
    ma.call(t, n) && On(e, n, t[n]);
  if (ri)
    for (var n of ri(t))
      va.call(t, n) && On(e, n, t[n]);
  return e;
}, Xe = (e, t) => ha(e, fa(t));
var Ie = (e, t, n) => On(e, typeof t != "symbol" ? t + "" : t, n);
var de = (e, t, n) => new Promise((i, r) => {
  var a = (c) => {
    try {
      s(n.next(c));
    } catch (o) {
      r(o);
    }
  }, l = (c) => {
    try {
      s(n.throw(c));
    } catch (o) {
      r(o);
    }
  }, s = (c) => c.done ? i(c.value) : Promise.resolve(c.value).then(a, l);
  s((n = n.apply(e, t)).next());
});
const ba = (e, t) => e === t, lt = /* @__PURE__ */ Symbol("solid-proxy"), Yi = typeof Proxy == "function", Nn = /* @__PURE__ */ Symbol("solid-track"), gn = {
  equals: ba
};
let Qi = nr;
const wt = 1, hn = 2, Zi = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
}, An = {};
var Ee = null;
let Rn = null, wa = null, Oe = null, Be = null, ft = null, yn = 0;
function en(e, t) {
  const n = Oe, i = Ee, r = e.length === 0, a = t === void 0 ? i : t, l = r ? Zi : {
    owned: null,
    cleanups: null,
    context: a ? a.context : null,
    owner: a
  }, s = r ? e : () => e(() => qe(() => zt(l)));
  Ee = l, Oe = null;
  try {
    return mt(s, !0);
  } finally {
    Oe = n, Ee = i;
  }
}
function j(e, t) {
  t = t ? Object.assign({}, gn, t) : gn;
  const n = {
    value: e,
    observers: null,
    observerSlots: null,
    comparator: t.equals || void 0
  }, i = (r) => (typeof r == "function" && (r = r(n.value)), tr(n, r));
  return [er.bind(n), i];
}
function xa(e, t, n) {
  const i = kn(e, t, !0, wt);
  At(i);
}
function V(e, t, n) {
  const i = kn(e, t, !1, wt);
  At(i);
}
function $e(e, t, n) {
  Qi = Sa;
  const i = kn(e, t, !1, wt);
  i.user = !0, ft ? ft.push(i) : At(i);
}
function Ce(e, t, n) {
  n = n ? Object.assign({}, gn, n) : gn;
  const i = kn(e, t, !0, 0);
  return i.observers = null, i.observerSlots = null, i.comparator = n.equals || void 0, At(i), er.bind(i);
}
function ya(e) {
  return e && typeof e == "object" && "then" in e;
}
function Ht(e, t, n) {
  let i, r, a;
  typeof t == "function" ? (i = e, r = t, a = {}) : (i = !0, r = e, a = t || {});
  let l = null, s = An, c = !1, o = "initialValue" in a, d = typeof i == "function" && Ce(i);
  const f = /* @__PURE__ */ new Set(), [x, $] = (a.storage || j)(a.initialValue), [M, v] = j(void 0), [u, w] = j(void 0, {
    equals: !1
  }), [p, _] = j(o ? "ready" : "unresolved");
  function S(b, C, L, E) {
    return l === b && (l = null, E !== void 0 && (o = !0), (b === s || C === s) && a.onHydrated && queueMicrotask(() => a.onHydrated(E, {
      value: C
    })), s = An, O(C, L)), C;
  }
  function O(b, C) {
    mt(() => {
      C === void 0 && $(() => b), _(C !== void 0 ? "errored" : o ? "ready" : "unresolved"), v(C);
      for (const L of f.keys()) L.decrement();
      f.clear();
    }, !1);
  }
  function N() {
    const b = ka, C = x(), L = M();
    if (L !== void 0 && !l) throw L;
    return Oe && Oe.user, C;
  }
  function m(b = !0) {
    if (b !== !1 && c) return;
    c = !1;
    const C = d ? d() : i;
    if (C == null || C === !1) {
      S(l, qe(x));
      return;
    }
    let L;
    const E = s !== An ? s : qe(() => {
      try {
        return r(C, {
          value: x(),
          refetching: b
        });
      } catch (I) {
        L = I;
      }
    });
    if (L !== void 0) {
      S(l, void 0, tn(L), C);
      return;
    } else if (!ya(E))
      return S(l, E, void 0, C), E;
    return l = E, "v" in E ? (E.s === 1 ? S(l, E.v, void 0, C) : S(l, void 0, tn(E.v), C), E) : (c = !0, queueMicrotask(() => c = !1), mt(() => {
      _(o ? "refreshing" : "pending"), w();
    }, !1), E.then((I) => S(E, I, void 0, C), (I) => S(E, void 0, tn(I), C)));
  }
  Object.defineProperties(N, {
    state: {
      get: () => p()
    },
    error: {
      get: () => M()
    },
    loading: {
      get() {
        const b = p();
        return b === "pending" || b === "refreshing";
      }
    },
    latest: {
      get() {
        if (!o) return N();
        const b = M();
        if (b && !l) throw b;
        return x();
      }
    }
  });
  let h = Ee;
  return d ? xa(() => (h = Ee, m(!1))) : m(!1), [N, {
    refetch: (b) => pa(h, () => m(b)),
    mutate: $
  }];
}
function Tn(e) {
  return mt(e, !1);
}
function qe(e) {
  if (Oe === null) return e();
  const t = Oe;
  Oe = null;
  try {
    return e();
  } finally {
    Oe = t;
  }
}
function yt(e, t, n) {
  const i = Array.isArray(e);
  let r, a = n && n.defer;
  return (l) => {
    let s;
    if (i) {
      s = Array(e.length);
      for (let o = 0; o < e.length; o++) s[o] = e[o]();
    } else s = e();
    if (a)
      return a = !1, l;
    const c = qe(() => t(s, r, l));
    return r = s, c;
  };
}
function zn(e) {
  $e(() => qe(e));
}
function pn(e) {
  return Ee === null || (Ee.cleanups === null ? Ee.cleanups = [e] : Ee.cleanups.push(e)), e;
}
function Pn() {
  return Oe;
}
function pa(e, t) {
  const n = Ee, i = Oe;
  Ee = e, Oe = null;
  try {
    return mt(t, !0);
  } catch (r) {
    Fn(r);
  } finally {
    Ee = n, Oe = i;
  }
}
const [gm, hm] = /* @__PURE__ */ j(!1);
function Ut(e, t) {
  const n = /* @__PURE__ */ Symbol("context");
  return {
    id: n,
    Provider: Ca(n),
    defaultValue: e
  };
}
function Jt(e) {
  let t;
  return Ee && Ee.context && (t = Ee.context[e.id]) !== void 0 ? t : e.defaultValue;
}
function Xi(e) {
  const t = Ce(e), n = Ce(() => Dn(t()));
  return n.toArray = () => {
    const i = n();
    return Array.isArray(i) ? i : i != null ? [i] : [];
  }, n;
}
let ka;
function er() {
  if (this.sources && this.state)
    if (this.state === wt) At(this);
    else {
      const e = Be;
      Be = null, mt(() => mn(this), !1), Be = e;
    }
  if (Oe) {
    const e = this.observers ? this.observers.length : 0;
    Oe.sources ? (Oe.sources.push(this), Oe.sourceSlots.push(e)) : (Oe.sources = [this], Oe.sourceSlots = [e]), this.observers ? (this.observers.push(Oe), this.observerSlots.push(Oe.sources.length - 1)) : (this.observers = [Oe], this.observerSlots = [Oe.sources.length - 1]);
  }
  return this.value;
}
function tr(e, t, n) {
  let i = e.value;
  return (!e.comparator || !e.comparator(i, t)) && (e.value = t, e.observers && e.observers.length && mt(() => {
    for (let r = 0; r < e.observers.length; r += 1) {
      const a = e.observers[r], l = Rn && Rn.running;
      l && Rn.disposed.has(a), (l ? !a.tState : !a.state) && (a.pure ? Be.push(a) : ft.push(a), a.observers && ir(a)), l || (a.state = wt);
    }
    if (Be.length > 1e6)
      throw Be = [], new Error();
  }, !1)), t;
}
function At(e) {
  if (!e.fn) return;
  zt(e);
  const t = yn;
  $a(e, e.value, t);
}
function $a(e, t, n) {
  let i;
  const r = Ee, a = Oe;
  Oe = Ee = e;
  try {
    i = e.fn(t);
  } catch (l) {
    return e.pure && (e.state = wt, e.owned && e.owned.forEach(zt), e.owned = null), e.updatedAt = n + 1, Fn(l);
  } finally {
    Oe = a, Ee = r;
  }
  (!e.updatedAt || e.updatedAt <= n) && (e.updatedAt != null && "observers" in e ? tr(e, i) : e.value = i, e.updatedAt = n);
}
function kn(e, t, n, i = wt, r) {
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
  return Ee === null || Ee !== Zi && (Ee.owned ? Ee.owned.push(a) : Ee.owned = [a]), a;
}
function fn(e) {
  if (e.state === 0) return;
  if (e.state === hn) return mn(e);
  if (e.suspense && qe(e.suspense.inFallback)) return e.suspense.effects.push(e);
  const t = [e];
  for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < yn); )
    e.state && t.push(e);
  for (let n = t.length - 1; n >= 0; n--)
    if (e = t[n], e.state === wt)
      At(e);
    else if (e.state === hn) {
      const i = Be;
      Be = null, mt(() => mn(e, t[0]), !1), Be = i;
    }
}
function mt(e, t) {
  if (Be) return e();
  let n = !1;
  t || (Be = []), ft ? n = !0 : ft = [], yn++;
  try {
    const i = e();
    return _a(n), i;
  } catch (i) {
    n || (ft = null), Be = null, Fn(i);
  }
}
function _a(e) {
  if (Be && (nr(Be), Be = null), e) return;
  const t = ft;
  ft = null, t.length && mt(() => Qi(t), !1);
}
function nr(e) {
  for (let t = 0; t < e.length; t++) fn(e[t]);
}
function Sa(e) {
  let t, n = 0;
  for (t = 0; t < e.length; t++) {
    const i = e[t];
    i.user ? e[n++] = i : fn(i);
  }
  for (t = 0; t < n; t++) fn(e[t]);
}
function mn(e, t) {
  e.state = 0;
  for (let n = 0; n < e.sources.length; n += 1) {
    const i = e.sources[n];
    if (i.sources) {
      const r = i.state;
      r === wt ? i !== t && (!i.updatedAt || i.updatedAt < yn) && fn(i) : r === hn && mn(i, t);
    }
  }
}
function ir(e) {
  for (let t = 0; t < e.observers.length; t += 1) {
    const n = e.observers[t];
    n.state || (n.state = hn, n.pure ? Be.push(n) : ft.push(n), n.observers && ir(n));
  }
}
function zt(e) {
  let t;
  if (e.sources)
    for (; e.sources.length; ) {
      const n = e.sources.pop(), i = e.sourceSlots.pop(), r = n.observers;
      if (r && r.length) {
        const a = r.pop(), l = n.observerSlots.pop();
        i < r.length && (a.sourceSlots[l] = i, r[i] = a, n.observerSlots[i] = l);
      }
    }
  if (e.tOwned) {
    for (t = e.tOwned.length - 1; t >= 0; t--) zt(e.tOwned[t]);
    delete e.tOwned;
  }
  if (e.owned) {
    for (t = e.owned.length - 1; t >= 0; t--) zt(e.owned[t]);
    e.owned = null;
  }
  if (e.cleanups) {
    for (t = e.cleanups.length - 1; t >= 0; t--) e.cleanups[t]();
    e.cleanups = null;
  }
  e.state = 0;
}
function tn(e) {
  return e instanceof Error ? e : new Error(typeof e == "string" ? e : "Unknown error", {
    cause: e
  });
}
function Fn(e, t = Ee) {
  throw tn(e);
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
function Ca(e, t) {
  return function(i) {
    let r;
    return V(() => r = qe(() => (Ee.context = Xe(Se({}, Ee.context), {
      [e]: i.value
    }), Xi(() => i.children))), void 0), r;
  };
}
const Ma = /* @__PURE__ */ Symbol("fallback");
function ai(e) {
  for (let t = 0; t < e.length; t++) e[t]();
}
function Ia(e, t, n = {}) {
  let i = [], r = [], a = [], l = 0, s = t.length > 1 ? [] : null;
  return pn(() => ai(a)), () => {
    let c = e() || [], o = c.length, d, f;
    return c[Nn], qe(() => {
      let $, M, v, u, w, p, _, S, O;
      if (o === 0)
        l !== 0 && (ai(a), a = [], i = [], r = [], l = 0, s && (s = [])), n.fallback && (i = [Ma], r[0] = en((N) => (a[0] = N, n.fallback())), l = 1);
      else if (l === 0) {
        for (r = new Array(o), f = 0; f < o; f++)
          i[f] = c[f], r[f] = en(x);
        l = o;
      } else {
        for (v = new Array(o), u = new Array(o), s && (w = new Array(o)), p = 0, _ = Math.min(l, o); p < _ && i[p] === c[p]; p++) ;
        for (_ = l - 1, S = o - 1; _ >= p && S >= p && i[_] === c[S]; _--, S--)
          v[S] = r[_], u[S] = a[_], s && (w[S] = s[_]);
        for ($ = /* @__PURE__ */ new Map(), M = new Array(S + 1), f = S; f >= p; f--)
          O = c[f], d = $.get(O), M[f] = d === void 0 ? -1 : d, $.set(O, f);
        for (d = p; d <= _; d++)
          O = i[d], f = $.get(O), f !== void 0 && f !== -1 ? (v[f] = r[d], u[f] = a[d], s && (w[f] = s[d]), f = M[f], $.set(O, f)) : a[d]();
        for (f = p; f < o; f++)
          f in v ? (r[f] = v[f], a[f] = u[f], s && (s[f] = w[f], s[f](f))) : r[f] = en(x);
        r = r.slice(0, l = o), i = c.slice(0);
      }
      return r;
    });
    function x($) {
      if (a[f] = $, s) {
        const [M, v] = j(f);
        return s[f] = v, t(c[f], M);
      }
      return t(c[f]);
    }
  };
}
function g(e, t) {
  return qe(() => e(t || {}));
}
function Gt() {
  return !0;
}
const jn = {
  get(e, t, n) {
    return t === lt ? n : e.get(t);
  },
  has(e, t) {
    return t === lt ? !0 : e.has(t);
  },
  set: Gt,
  deleteProperty: Gt,
  getOwnPropertyDescriptor(e, t) {
    return {
      configurable: !0,
      enumerable: !0,
      get() {
        return e.get(t);
      },
      set: Gt,
      deleteProperty: Gt
    };
  },
  ownKeys(e) {
    return e.keys();
  }
};
function Vn(e) {
  return (e = typeof e == "function" ? e() : e) ? e : {};
}
function Ea() {
  for (let e = 0, t = this.length; e < t; ++e) {
    const n = this[e]();
    if (n !== void 0) return n;
  }
}
function et(...e) {
  let t = !1;
  for (let l = 0; l < e.length; l++) {
    const s = e[l];
    t = t || !!s && lt in s, e[l] = typeof s == "function" ? (t = !0, Ce(s)) : s;
  }
  if (Yi && t)
    return new Proxy({
      get(l) {
        for (let s = e.length - 1; s >= 0; s--) {
          const c = Vn(e[s])[l];
          if (c !== void 0) return c;
        }
      },
      has(l) {
        for (let s = e.length - 1; s >= 0; s--)
          if (l in Vn(e[s])) return !0;
        return !1;
      },
      keys() {
        const l = [];
        for (let s = 0; s < e.length; s++) l.push(...Object.keys(Vn(e[s])));
        return [...new Set(l)];
      }
    }, jn);
  const n = {}, i = /* @__PURE__ */ Object.create(null);
  for (let l = e.length - 1; l >= 0; l--) {
    const s = e[l];
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
          get: Ea.bind(n[d] = [f.get.bind(s)])
        } : f.value !== void 0 ? f : void 0;
      else {
        const x = n[d];
        x && (f.get ? x.push(f.get.bind(s)) : f.value !== void 0 && x.push(() => f.value));
      }
    }
  }
  const r = {}, a = Object.keys(i);
  for (let l = a.length - 1; l >= 0; l--) {
    const s = a[l], c = i[s];
    c && c.get ? Object.defineProperty(r, s, c) : r[s] = c ? c.value : void 0;
  }
  return r;
}
function Bn(e, ...t) {
  const n = t.length;
  if (Yi && lt in e) {
    const r = n > 1 ? t.flat() : t[0], a = t.map((l) => new Proxy({
      get(s) {
        return l.includes(s) ? e[s] : void 0;
      },
      has(s) {
        return l.includes(s) && s in e;
      },
      keys() {
        return l.filter((s) => s in e);
      }
    }, jn));
    return a.push(new Proxy({
      get(l) {
        return r.includes(l) ? void 0 : e[l];
      },
      has(l) {
        return r.includes(l) ? !1 : l in e;
      },
      keys() {
        return Object.keys(e).filter((l) => !r.includes(l));
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
    const l = Object.getOwnPropertyDescriptor(e, r);
    !l.get && !l.set && l.enumerable && l.writable && l.configurable ? i[a][r] = l.value : Object.defineProperty(i[a], r, l);
  }
  return i;
}
const rr = (e) => `Stale read from <${e}>.`;
function ce(e) {
  const t = "fallback" in e && {
    fallback: () => e.fallback
  };
  return Ce(Ia(() => e.each, e.children, t || void 0));
}
function P(e) {
  const t = e.keyed, n = Ce(() => e.when, void 0, void 0), i = t ? n : Ce(n, void 0, {
    equals: (r, a) => !r == !a
  });
  return Ce(() => {
    const r = i();
    if (r) {
      const a = e.children;
      return typeof a == "function" && a.length > 0 ? qe(() => a(t ? r : () => {
        if (!qe(i)) throw rr("Show");
        return n();
      })) : a;
    }
    return e.fallback;
  }, void 0, void 0);
}
function me(e) {
  const t = Xi(() => e.children), n = Ce(() => {
    const i = t(), r = Array.isArray(i) ? i : [i];
    let a = () => {
    };
    for (let l = 0; l < r.length; l++) {
      const s = l, c = r[l], o = a, d = Ce(() => o() ? void 0 : c.when, void 0, void 0), f = c.keyed ? d : Ce(d, void 0, {
        equals: (x, $) => !x == !$
      });
      a = () => o() || (f() ? [s, d, c] : void 0);
    }
    return a;
  });
  return Ce(() => {
    const i = n()();
    if (!i) return e.fallback;
    const [r, a, l] = i, s = l.children;
    return typeof s == "function" && s.length > 0 ? qe(() => s(l.keyed ? a() : () => {
      var o;
      if (((o = qe(n)()) == null ? void 0 : o[0]) !== r) throw rr("Match");
      return a();
    })) : s;
  }, void 0, void 0);
}
function Q(e) {
  return e;
}
const La = [
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
], Oa = /* @__PURE__ */ new Set([
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
  ...La
]), Aa = /* @__PURE__ */ new Set(["innerHTML", "textContent", "innerText", "children"]), Ra = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(null), {
  className: "class",
  htmlFor: "for"
}), Va = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(null), {
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
function Na(e, t) {
  const n = Va[e];
  return typeof n == "object" ? n[t] ? n.$ : void 0 : n;
}
const Ta = /* @__PURE__ */ new Set(["beforeinput", "click", "dblclick", "contextmenu", "focusin", "focusout", "input", "keydown", "keyup", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "pointerdown", "pointermove", "pointerout", "pointerover", "pointerup", "touchend", "touchmove", "touchstart"]), Pa = {
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace"
}, ke = (e) => Ce(() => e());
function Da(e, t, n) {
  let i = n.length, r = t.length, a = i, l = 0, s = 0, c = t[r - 1].nextSibling, o = null;
  for (; l < r || s < a; ) {
    if (t[l] === n[s]) {
      l++, s++;
      continue;
    }
    for (; t[r - 1] === n[a - 1]; )
      r--, a--;
    if (r === l) {
      const d = a < i ? s ? n[s - 1].nextSibling : n[a - s] : c;
      for (; s < a; ) e.insertBefore(n[s++], d);
    } else if (a === s)
      for (; l < r; )
        (!o || !o.has(t[l])) && t[l].remove(), l++;
    else if (t[l] === n[a - 1] && n[s] === t[r - 1]) {
      const d = t[--r].nextSibling;
      e.insertBefore(n[s++], t[l++].nextSibling), e.insertBefore(n[--a], d), t[r] = n[a];
    } else {
      if (!o) {
        o = /* @__PURE__ */ new Map();
        let f = s;
        for (; f < a; ) o.set(n[f], f++);
      }
      const d = o.get(t[l]);
      if (d != null)
        if (s < d && d < a) {
          let f = l, x = 1, $;
          for (; ++f < r && f < a && !(($ = o.get(t[f])) == null || $ !== d + x); )
            x++;
          if (x > d - s) {
            const M = t[l];
            for (; s < d; ) e.insertBefore(n[s++], M);
          } else e.replaceChild(n[s++], t[l++]);
        } else l++;
      else t[l++].remove();
    }
  }
}
const li = "_$DX_DELEGATE";
function ja(e, t, n, i = {}) {
  let r;
  return en((a) => {
    r = a, t === document ? e() : k(t, e(), t.firstChild ? null : void 0, n);
  }, i.owner), () => {
    r(), t.textContent = "";
  };
}
function y(e, t, n, i) {
  let r;
  const a = () => {
    const s = document.createElement("template");
    return s.innerHTML = e, s.content.firstChild;
  }, l = () => (r || (r = a())).cloneNode(!0);
  return l.cloneNode = l, l;
}
function ge(e, t = window.document) {
  const n = t[li] || (t[li] = /* @__PURE__ */ new Set());
  for (let i = 0, r = e.length; i < r; i++) {
    const a = e[i];
    n.has(a) || (n.add(a), t.addEventListener(a, Ua));
  }
}
function U(e, t, n) {
  n == null ? e.removeAttribute(t) : e.setAttribute(t, n);
}
function Ka(e, t, n, i) {
  i == null ? e.removeAttributeNS(t, n) : e.setAttributeNS(t, n, i);
}
function za(e, t, n) {
  n ? e.setAttribute(t, "") : e.removeAttribute(t);
}
function at(e, t) {
  t == null ? e.removeAttribute("class") : e.className = t;
}
function Re(e, t, n, i) {
  if (i)
    Array.isArray(n) ? (e[`$$${t}`] = n[0], e[`$$${t}Data`] = n[1]) : e[`$$${t}`] = n;
  else if (Array.isArray(n)) {
    const r = n[0];
    e.addEventListener(t, n[0] = (a) => r.call(e, n[1], a));
  } else e.addEventListener(t, n, typeof n != "function" && n);
}
function Z(e, t, n = {}) {
  const i = Object.keys(t || {}), r = Object.keys(n);
  let a, l;
  for (a = 0, l = r.length; a < l; a++) {
    const s = r[a];
    !s || s === "undefined" || t[s] || (si(e, s, !1), delete n[s]);
  }
  for (a = 0, l = i.length; a < l; a++) {
    const s = i[a], c = !!t[s];
    !s || s === "undefined" || n[s] === c || !c || (si(e, s, !0), n[s] = c);
  }
  return n;
}
function Fa(e, t, n) {
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
  return i || V(() => r.children = Ft(e, t.children, r.children)), V(() => typeof t.ref == "function" && ct(t.ref, e)), V(() => Ba(e, t, n, !0, r, !0)), r;
}
function ct(e, t, n) {
  return qe(() => e(t, n));
}
function k(e, t, n, i) {
  if (n !== void 0 && !i && (i = []), typeof t != "function") return Ft(e, t, i, n);
  V((r) => Ft(e, t(), r, n), i);
}
function Ba(e, t, n, i, r = {}, a = !1) {
  t || (t = {});
  for (const l in r)
    if (!(l in t)) {
      if (l === "children") continue;
      r[l] = oi(e, l, null, r[l], n, a, t);
    }
  for (const l in t) {
    if (l === "children")
      continue;
    const s = t[l];
    r[l] = oi(e, l, s, r[l], n, a, t);
  }
}
function Ha(e) {
  return e.toLowerCase().replace(/-([a-z])/g, (t, n) => n.toUpperCase());
}
function si(e, t, n) {
  const i = t.trim().split(/\s+/);
  for (let r = 0, a = i.length; r < a; r++) e.classList.toggle(i[r], n);
}
function oi(e, t, n, i, r, a, l) {
  let s, c, o, d, f;
  if (t === "style") return Fa(e, n, i);
  if (t === "classList") return Z(e, n, i);
  if (n === i) return i;
  if (t === "ref")
    a || n(e);
  else if (t.slice(0, 3) === "on:") {
    const x = t.slice(3);
    i && e.removeEventListener(x, i, typeof i != "function" && i), n && e.addEventListener(x, n, typeof n != "function" && n);
  } else if (t.slice(0, 10) === "oncapture:") {
    const x = t.slice(10);
    i && e.removeEventListener(x, i, !0), n && e.addEventListener(x, n, !0);
  } else if (t.slice(0, 2) === "on") {
    const x = t.slice(2).toLowerCase(), $ = Ta.has(x);
    if (!$ && i) {
      const M = Array.isArray(i) ? i[0] : i;
      e.removeEventListener(x, M);
    }
    ($ || n) && (Re(e, x, n, $), $ && ge([x]));
  } else if (t.slice(0, 5) === "attr:")
    U(e, t.slice(5), n);
  else if (t.slice(0, 5) === "bool:")
    za(e, t.slice(5), n);
  else if ((f = t.slice(0, 5) === "prop:") || (o = Aa.has(t)) || !r && ((d = Na(t, e.tagName)) || (c = Oa.has(t))) || (s = e.nodeName.includes("-") || "is" in l))
    f && (t = t.slice(5), c = !0), t === "class" || t === "className" ? at(e, n) : s && !c && !o ? e[Ha(t)] = n : e[d || t] = n;
  else {
    const x = r && t.indexOf(":") > -1 && Pa[t.split(":")[0]];
    x ? Ka(e, x, t, n) : U(e, Ra[t] || t, n);
  }
  return n;
}
function Ua(e) {
  let t = e.target;
  const n = `$$${e.type}`, i = e.target, r = e.currentTarget, a = (c) => Object.defineProperty(e, "target", {
    configurable: !0,
    value: c
  }), l = () => {
    const c = t[n];
    if (c && !t.disabled) {
      const o = t[`${n}Data`];
      if (o !== void 0 ? c.call(t, o, e) : c.call(t, e), e.cancelBubble) return;
    }
    return t.host && typeof t.host != "string" && !t.host._$host && t.contains(e.target) && a(t.host), !0;
  }, s = () => {
    for (; l() && (t = t._$host || t.parentNode || t.host); ) ;
  };
  if (Object.defineProperty(e, "currentTarget", {
    configurable: !0,
    get() {
      return t || document;
    }
  }), e.composedPath) {
    const c = e.composedPath();
    a(c[0]);
    for (let o = 0; o < c.length - 2 && (t = c[o], !!l()); o++) {
      if (t._$host) {
        t = t._$host, s();
        break;
      }
      if (t.parentNode === r)
        break;
    }
  } else s();
  a(i);
}
function Ft(e, t, n, i, r) {
  for (; typeof n == "function"; ) n = n();
  if (t === n) return n;
  const a = typeof t, l = i !== void 0;
  if (e = l && n[0] && n[0].parentNode || e, a === "string" || a === "number") {
    if (a === "number" && (t = t.toString(), t === n))
      return n;
    if (l) {
      let s = n[0];
      s && s.nodeType === 3 ? s.data !== t && (s.data = t) : s = document.createTextNode(t), n = _t(e, n, i, s);
    } else
      n !== "" && typeof n == "string" ? n = e.firstChild.data = t : n = e.textContent = t;
  } else if (t == null || a === "boolean")
    n = _t(e, n, i);
  else {
    if (a === "function")
      return V(() => {
        let s = t();
        for (; typeof s == "function"; ) s = s();
        n = Ft(e, s, n, i);
      }), () => n;
    if (Array.isArray(t)) {
      const s = [], c = n && Array.isArray(n);
      if (Kn(s, t, n, r))
        return V(() => n = Ft(e, s, n, i, !0)), () => n;
      if (s.length === 0) {
        if (n = _t(e, n, i), l) return n;
      } else c ? n.length === 0 ? di(e, s, i) : Da(e, n, s) : (n && _t(e), di(e, s));
      n = s;
    } else if (t.nodeType) {
      if (Array.isArray(n)) {
        if (l) return n = _t(e, n, i, t);
        _t(e, n, null, t);
      } else n == null || n === "" || !e.firstChild ? e.appendChild(t) : e.replaceChild(t, e.firstChild);
      n = t;
    }
  }
  return n;
}
function Kn(e, t, n, i) {
  let r = !1;
  for (let a = 0, l = t.length; a < l; a++) {
    let s = t[a], c = n && n[e.length], o;
    if (!(s == null || s === !0 || s === !1)) if ((o = typeof s) == "object" && s.nodeType)
      e.push(s);
    else if (Array.isArray(s))
      r = Kn(e, s, c) || r;
    else if (o === "function")
      if (i) {
        for (; typeof s == "function"; ) s = s();
        r = Kn(e, Array.isArray(s) ? s : [s], Array.isArray(c) ? c : [c]) || r;
      } else
        e.push(s), r = !0;
    else {
      const d = String(s);
      c && c.nodeType === 3 && c.data === d ? e.push(c) : e.push(document.createTextNode(d));
    }
  }
  return r;
}
function di(e, t, n = null) {
  for (let i = 0, r = t.length; i < r; i++) e.insertBefore(t[i], n);
}
function _t(e, t, n, i) {
  if (n === void 0) return e.textContent = "";
  const r = i || document.createTextNode("");
  if (t.length) {
    let a = !1;
    for (let l = t.length - 1; l >= 0; l--) {
      const s = t[l];
      if (r !== s) {
        const c = s.parentNode === e;
        !a && !l ? c ? e.replaceChild(r, s) : e.insertBefore(r, n) : c && s.remove();
      } else a = !0;
    }
  } else e.insertBefore(r, n);
  return [r];
}
var ar = /* @__PURE__ */ ((e) => (e[e.CAWI = 1] = "CAWI", e[e.CAPI = 2] = "CAPI", e))(ar || {}), lr = /* @__PURE__ */ ((e) => (e[e.OPEN = 1] = "OPEN", e[e.REVIEW = 2] = "REVIEW", e[e.CLOSE = 3] = "CLOSE", e))(lr || {}), sr = /* @__PURE__ */ ((e) => (e[e.INITIAL = 1] = "INITIAL", e[e.ASSIGN = 2] = "ASSIGN", e))(sr || {}), or = /* @__PURE__ */ ((e) => (e[e.ONLINE = 1] = "ONLINE", e[e.OFFLINE = 2] = "OFFLINE", e))(or || {}), Ja = /* @__PURE__ */ ((e) => (e[e.TEMPLATE = 1] = "TEMPLATE", e[e.API = 2] = "API", e[e.COMPONENT = 3] = "COMPONENT", e[e.OFFLINE = 4] = "OFFLINE", e))(Ja || {}), Wa = /* @__PURE__ */ ((e) => (e[e.WARNING = 1] = "WARNING", e[e.ERROR = 2] = "ERROR", e))(Wa || {}), qa = /* @__PURE__ */ ((e) => (e[e.Section = 1] = "Section", e[e.NestedInput = 2] = "NestedInput", e[e.InnerHTML = 3] = "InnerHTML", e[e.VariableInput = 4] = "VariableInput", e[e.DateInput = 11] = "DateInput", e[e.DateTimeLocalInput = 12] = "DateTimeLocalInput", e[e.TimeInput = 13] = "TimeInput", e[e.MonthInput = 14] = "MonthInput", e[e.WeekInput = 15] = "WeekInput", e[e.SingleCheckInput = 16] = "SingleCheckInput", e[e.ToggleInput = 17] = "ToggleInput", e[e.RangeSliderInput = 18] = "RangeSliderInput", e[e.UrlInput = 19] = "UrlInput", e[e.CurrencyInput = 20] = "CurrencyInput", e[e.ListTextInputRepeat = 21] = "ListTextInputRepeat", e[e.ListSelectInputRepeat = 22] = "ListSelectInputRepeat", e[e.MultipleSelectInput = 23] = "MultipleSelectInput", e[e.MaskingInput = 24] = "MaskingInput", e[e.TextInput = 25] = "TextInput", e[e.RadioInput = 26] = "RadioInput", e[e.SelectInput = 27] = "SelectInput", e[e.NumberInput = 28] = "NumberInput", e[e.CheckboxInput = 29] = "CheckboxInput", e[e.TextAreaInput = 30] = "TextAreaInput", e[e.EmailInput = 31] = "EmailInput", e[e.PhotoInput = 32] = "PhotoInput", e[e.GpsInput = 33] = "GpsInput", e[e.CsvInput = 34] = "CsvInput", e[e.NowInput = 35] = "NowInput", e[e.SignatureInput = 36] = "SignatureInput", e[e.UnitInput = 37] = "UnitInput", e[e.DecimalInput = 38] = "DecimalInput", e))(qa || {});
const Ga = {
  clientMode: ar.CAWI,
  formMode: lr.OPEN,
  initialMode: sr.INITIAL,
  lookupMode: or.ONLINE,
  lookupKey: "keys",
  lookupValue: "values"
}, vn = /* @__PURE__ */ Symbol("store-raw"), Ct = /* @__PURE__ */ Symbol("store-node"), ht = /* @__PURE__ */ Symbol("store-has"), dr = /* @__PURE__ */ Symbol("store-self");
function cr(e) {
  let t = e[lt];
  if (!t && (Object.defineProperty(e, lt, {
    value: t = new Proxy(e, Za)
  }), !Array.isArray(e))) {
    const n = Object.keys(e), i = Object.getOwnPropertyDescriptors(e);
    for (let r = 0, a = n.length; r < a; r++) {
      const l = n[r];
      i[l].get && Object.defineProperty(e, l, {
        enumerable: i[l].enumerable,
        get: i[l].get.bind(t)
      });
    }
  }
  return t;
}
function Mt(e) {
  let t;
  return e != null && typeof e == "object" && (e[lt] || !(t = Object.getPrototypeOf(e)) || t === Object.prototype || Array.isArray(e));
}
function It(e, t = /* @__PURE__ */ new Set()) {
  let n, i, r, a;
  if (n = e != null && e[vn]) return n;
  if (!Mt(e) || t.has(e)) return e;
  if (Array.isArray(e)) {
    Object.isFrozen(e) ? e = e.slice(0) : t.add(e);
    for (let l = 0, s = e.length; l < s; l++)
      r = e[l], (i = It(r, t)) !== r && (e[l] = i);
  } else {
    Object.isFrozen(e) ? e = Object.assign({}, e) : t.add(e);
    const l = Object.keys(e), s = Object.getOwnPropertyDescriptors(e);
    for (let c = 0, o = l.length; c < o; c++)
      a = l[c], !s[a].get && (r = e[a], (i = It(r, t)) !== r && (e[a] = i));
  }
  return e;
}
function bn(e, t) {
  let n = e[t];
  return n || Object.defineProperty(e, t, {
    value: n = /* @__PURE__ */ Object.create(null)
  }), n;
}
function Bt(e, t, n) {
  if (e[t]) return e[t];
  const [i, r] = j(n, {
    equals: !1,
    internal: !0
  });
  return i.$ = r, e[t] = i;
}
function Ya(e, t) {
  const n = Reflect.getOwnPropertyDescriptor(e, t);
  return !n || n.get || !n.configurable || t === lt || t === Ct || (delete n.value, delete n.writable, n.get = () => e[lt][t]), n;
}
function ur(e) {
  Pn() && Bt(bn(e, Ct), dr)();
}
function Qa(e) {
  return ur(e), Reflect.ownKeys(e);
}
const Za = {
  get(e, t, n) {
    if (t === vn) return e;
    if (t === lt) return n;
    if (t === Nn)
      return ur(e), n;
    const i = bn(e, Ct), r = i[t];
    let a = r ? r() : e[t];
    if (t === Ct || t === ht || t === "__proto__") return a;
    if (!r) {
      const l = Object.getOwnPropertyDescriptor(e, t);
      Pn() && (typeof a != "function" || e.hasOwnProperty(t)) && !(l && l.get) && (a = Bt(i, t, a)());
    }
    return Mt(a) ? cr(a) : a;
  },
  has(e, t) {
    return t === vn || t === lt || t === Nn || t === Ct || t === ht || t === "__proto__" ? !0 : (Pn() && Bt(bn(e, ht), t)(), t in e);
  },
  set() {
    return !0;
  },
  deleteProperty() {
    return !0;
  },
  ownKeys: Qa,
  getOwnPropertyDescriptor: Ya
};
function Et(e, t, n, i = !1) {
  if (!i && e[t] === n) return;
  const r = e[t], a = e.length;
  n === void 0 ? (delete e[t], e[ht] && e[ht][t] && r !== void 0 && e[ht][t].$()) : (e[t] = n, e[ht] && e[ht][t] && r === void 0 && e[ht][t].$());
  let l = bn(e, Ct), s;
  if ((s = Bt(l, t, r)) && s.$(() => n), Array.isArray(e) && e.length !== a) {
    for (let c = e.length; c < a; c++) (s = l[c]) && s.$();
    (s = Bt(l, "length", a)) && s.$(e.length);
  }
  (s = l[dr]) && s.$();
}
function gr(e, t) {
  const n = Object.keys(t);
  for (let i = 0; i < n.length; i += 1) {
    const r = n[i];
    Et(e, r, t[r]);
  }
}
function Xa(e, t) {
  if (typeof t == "function" && (t = t(e)), t = It(t), Array.isArray(t)) {
    if (e === t) return;
    let n = 0, i = t.length;
    for (; n < i; n++) {
      const r = t[n];
      e[n] !== r && Et(e, n, r);
    }
    Et(e, "length", i);
  } else gr(e, t);
}
function Pt(e, t, n = []) {
  let i, r = e;
  if (t.length > 1) {
    i = t.shift();
    const l = typeof i, s = Array.isArray(e);
    if (Array.isArray(i)) {
      for (let c = 0; c < i.length; c++)
        Pt(e, [i[c]].concat(t), n);
      return;
    } else if (s && l === "function") {
      for (let c = 0; c < e.length; c++)
        i(e[c], c) && Pt(e, [c].concat(t), n);
      return;
    } else if (s && l === "object") {
      const {
        from: c = 0,
        to: o = e.length - 1,
        by: d = 1
      } = i;
      for (let f = c; f <= o; f += d)
        Pt(e, [f].concat(t), n);
      return;
    } else if (t.length > 1) {
      Pt(e[i], t, [i].concat(n));
      return;
    }
    r = e[i], n = [i].concat(n);
  }
  let a = t[0];
  typeof a == "function" && (a = a(r, n), a === r) || i === void 0 && a == null || (a = It(a), i === void 0 || Mt(r) && Mt(a) && !Array.isArray(a) ? gr(r, a) : Et(e, i, a));
}
function Un(...[e, t]) {
  const n = It(e || {}), i = Array.isArray(n), r = cr(n);
  function a(...l) {
    Tn(() => {
      i && l.length === 1 ? Xa(n, l[0]) : Pt(n, l);
    });
  }
  return [r, a];
}
const wn = /* @__PURE__ */ new WeakMap(), hr = {
  get(e, t) {
    if (t === vn) return e;
    const n = e[t];
    let i;
    return Mt(n) ? wn.get(n) || (wn.set(n, i = new Proxy(n, hr)), i) : n;
  },
  set(e, t, n) {
    return Et(e, t, It(n)), !0;
  },
  deleteProperty(e, t) {
    return Et(e, t, void 0, !0), !0;
  }
};
function ci(e) {
  return (t) => {
    if (Mt(t)) {
      let n;
      (n = wn.get(t)) || wn.set(t, n = new Proxy(t, hr)), e(n);
    }
    return t;
  };
}
const fr = Ut();
function el(e) {
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
  return g(fr.Provider, {
    value: i,
    get children() {
      return e.children;
    }
  });
}
function mr() {
  return Jt(fr);
}
const vr = Ut(), tl = (e) => g(vr.Provider, {
  get value() {
    return e.stores;
  },
  get children() {
    return e.children;
  }
});
function Ze() {
  const e = Jt(vr);
  if (!e)
    throw new Error("useStores must be used within a StoreProvider. Make sure your component is wrapped with <StoreProvider stores={...}>.");
  return e;
}
function tt() {
  return Ze().reference;
}
function br() {
  return Ze().response;
}
function wr() {
  return Ze().template;
}
function xr() {
  return Ze().media;
}
function yr() {
  return Ze().remark;
}
function Jn() {
  return Ze().sidebar;
}
function nt() {
  return Ze().locale;
}
function pr() {
  return Ze().summary;
}
function kr() {
  return Ze().counter;
}
function $r() {
  return Ze().note;
}
function _r() {
  return Ze().principal;
}
function nl() {
  return Ze().referenceHistoryEnable;
}
function Sr() {
  return Ze().referenceEnableFalse;
}
var be = /* @__PURE__ */ ((e) => (e[e.SECTION = 1] = "SECTION", e[e.NESTED = 2] = "NESTED", e[e.INNER_HTML = 3] = "INNER_HTML", e[e.VARIABLE = 4] = "VARIABLE", e[e.DATE = 11] = "DATE", e[e.DATETIME = 12] = "DATETIME", e[e.TIME = 13] = "TIME", e[e.MONTH = 14] = "MONTH", e[e.WEEK = 15] = "WEEK", e[e.SINGLE_CHECK = 16] = "SINGLE_CHECK", e[e.TOGGLE = 17] = "TOGGLE", e[e.RANGE_SLIDER = 18] = "RANGE_SLIDER", e[e.URL = 19] = "URL", e[e.CURRENCY = 20] = "CURRENCY", e[e.LIST_TEXT_REPEAT = 21] = "LIST_TEXT_REPEAT", e[e.LIST_SELECT_REPEAT = 22] = "LIST_SELECT_REPEAT", e[e.MULTIPLE_SELECT = 23] = "MULTIPLE_SELECT", e[e.MASKING = 24] = "MASKING", e[e.TEXT = 25] = "TEXT", e[e.RADIO = 26] = "RADIO", e[e.SELECT = 27] = "SELECT", e[e.NUMBER = 28] = "NUMBER", e[e.CHECKBOX = 29] = "CHECKBOX", e[e.TEXTAREA = 30] = "TEXTAREA", e[e.EMAIL = 31] = "EMAIL", e[e.PHOTO = 32] = "PHOTO", e[e.GPS = 33] = "GPS", e[e.CSV = 34] = "CSV", e[e.NOW = 35] = "NOW", e[e.SIGNATURE = 36] = "SIGNATURE", e[e.UNIT = 37] = "UNIT", e[e.DECIMAL = 38] = "DECIMAL", e[e.AUDIO = 39] = "AUDIO", e[e.BARCODE = 40] = "BARCODE", e[e.VIDEO = 41] = "VIDEO", e[e.FILE = 42] = "FILE", e))(be || {}), Te = /* @__PURE__ */ ((e) => (e[e.VALID = 0] = "VALID", e[e.WARNING = 1] = "WARNING", e[e.ERROR = 2] = "ERROR", e))(Te || {}), dt = /* @__PURE__ */ ((e) => (e[e.CAWI = 1] = "CAWI", e[e.CAPI = 2] = "CAPI", e[e.PAPI = 3] = "PAPI", e))(dt || {});
const He = {
  /**
   * Email validation pattern
   * Supports standard email format with TLD
   */
  EMAIL: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  /**
   * Nested dataKey separator
   */
  NESTED_SEPARATOR: "#"
}, il = {
  /** Default enable condition result */
  ENABLE_CONDITION: !0
};
new Set(
  Object.values(be).filter(
    (e) => typeof e == "number" && e > 4
  )
);
var rl = /* @__PURE__ */ y('<div><div class="grid md:grid-cols-12 dark:border-gray-200/[.10] p-2"><div class="font-light text-sm pb-2.5 px-2 col-start-2 col-end-12 space-y-4 transition-all delay-100">'), ui = /* @__PURE__ */ y('<input type=text class="w-full font-light cursor-pointer px-4 py-2.5 text-sm text-gray-700 bg-blue-50 bg-clip-padding dark:bg-gray-300 border border-solid border-blue-100 rounded-full rounded-tl-none transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"disabled>'), al = /* @__PURE__ */ y('<div class="grid grid-cols-12 "><div class="col-span-10 mr-2 "></div><div class="col-span-2 -ml-12 space-x-1 flex justify-evenly -z-0"><button class="bg-blue-800 hover:bg-blue-700 text-white text-justify justify-center text-xs w-full py-2 rounded-tl-none rounded-full focus:outline-none group inline-flex items-center">&nbsp;&nbsp;<svg xmlns=http://www.w3.org/2000/svg class="h-4 w-5"viewBox="0 0 20 20"fill=currentColor><path fill-rule=evenodd d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"clip-rule=evenodd>');
const Cr = (e) => {
  const [t] = tt(), n = e.config, [i] = j(n.formMode > 1 ? "VIEW" : "ENTRY");
  let r = Ce(() => String(t.details.findIndex((s) => s.dataKey === e.component.sourceQuestion))), a = Ce(() => {
    let s = [];
    if (e.component.sourceQuestion !== "") {
      const c = t.details.findIndex((o) => o.dataKey === e.component.sourceQuestion);
      if (c !== -1 && t.details[c])
        if (typeof t.details[c].answer == "object" && t.details[c].answer !== null) {
          const o = t.details[c].answer;
          if (s = o == null || o === "" ? [] : o, t.details[c].type === be.LIST_TEXT_REPEAT || t.details[c].type === be.LIST_SELECT_REPEAT) {
            let d = JSON.parse(JSON.stringify(s));
            d.splice(0, 1), s = d;
          }
          s = s.map((d) => {
            var f, x;
            return Xe(Se({}, d), {
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
  }), l = (s) => {
    e.onUserClick(e.component.dataKey + "#" + s);
  };
  return (() => {
    var s = rl(), c = s.firstChild, o = c.firstChild;
    return k(o, g(ce, {
      get each() {
        return a();
      },
      children: (d, f) => (() => {
        var x = al(), $ = x.firstChild, M = $.nextSibling, v = M.firstChild, u = v.firstChild, w = u.nextSibling;
        return x.$$click = (p) => l(d.value), k($, g(me, {
          get children() {
            return [g(Q, {
              get when() {
                return t.details[r()].type === be.NUMBER || t.details[r()].type === be.VARIABLE && t.details[r()].renderType === 1 || t.details[r()].type === be.TEXT;
              },
              get children() {
                var p = ui();
                return V(() => p.value = e.component.label + "  ____ # " + d.label), p;
              }
            }), g(Q, {
              get when() {
                return t.details[r()].type !== 28;
              },
              get children() {
                var p = ui();
                return V(() => p.value = d.label), p;
              }
            })];
          }
        })), v.$$click = (p) => l(d.value), k(v, i, w), V(() => U(v, "id", `nestedButton-${e.component.dataKey}-${f()}`)), x;
      })()
    })), V((d) => Z(c, {
      "border-b border-gray-300/[.40]": a().length > 0
    }, d)), s;
  })();
};
ge(["click"]);
var ll = /* @__PURE__ */ y('<span class="absolute top-0 right-0 inline-flex items-center justify-center h-6 w-6 text-xs font-semibold text-white transform translate-x-1/2 -translate-y-1/4 bg-pink-600/80 rounded-full">'), sl = /* @__PURE__ */ y('<button type=button><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z">');
const Ae = (e) => {
  const [t, n] = Bn(e, ["comments", "class"]);
  return (() => {
    var i = sl();
    return i.firstChild, Hn(i, et({
      get class() {
        var r;
        return ["relative inline-block bg-white dark:bg-gray-800 p-2 h-10 w-10 text-gray-500 rounded-full", "hover:bg-yellow-100 hover:text-yellow-400 hover:border-yellow-100", "border-2 border-gray-300", "disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400", (r = t.class) != null ? r : ""].join(" ");
      }
    }, n), !1, !0), k(i, g(P, {
      get when() {
        return ke(() => !!t.comments)() && t.comments > 0;
      },
      get children() {
        var r = ll();
        return k(r, () => t.comments), r;
      }
    }), null), i;
  })();
};
var ol = /* @__PURE__ */ y("<span class=text-pink-600>*"), dl = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), cl = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), ul = /* @__PURE__ */ y('<div class=" flex justify-end ">'), gl = /* @__PURE__ */ y('<div class="grid md:grid-cols-3 border-b border-gray-300/[.50] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm space-x-2 py-2.5 px-2 md:col-span-2 grid grid-cols-12"><div class><div class=cursor-pointer><div class="grid font-light text-sm col-span-2 content-start">'), hl = /* @__PURE__ */ y('<div class=flex-1><input type=text class="w-full font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400">'), fl = /* @__PURE__ */ y("<div class=flex-1>"), ml = /* @__PURE__ */ y('<div class="font-light text-sm py-2.5 px-4 flex items-start gap-2 cursor-pointer"><label class="cursor-pointer text-sm shrink-0 mt-0.5"><input type=radio class="checked:disabled:bg-gray-500 checked:dark:disabled:bg-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400">'), vl = /* @__PURE__ */ y('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), bl = /* @__PURE__ */ y('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), wl = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="grid grid-cols-12"><div class="col-span-11 text-justify mr-1">');
const xl = (e) => {
  const [t] = tt(), n = e.config, [i] = j(n.formMode > 1 ? !0 : e.component.disableInput);
  let r = e.value && e.value.length > 0 ? e.value[0].value : e.value, a = (M, v) => {
    let u = JSON.parse(JSON.stringify(e.value));
    u = [], u.push({
      value: M,
      label: v
    }), e.onValueChange(u);
  }, l = (M) => {
    let v = `radio-${e.component.dataKey}-${M}`;
    document.getElementById(v).click();
  }, s = Ce(() => {
    if (e.component.sourceOption !== void 0 && e.component.typeOption === 3) {
      let M = e.component.sourceOption.split("@");
      const v = t.details.findIndex((u) => u.dataKey === M[0]);
      return t.details[v].type, t.details[v].answer;
    }
    return [];
  });
  const [c] = j(e.component.sourceOption !== void 0 ? s() : e.component.options), [o, d] = j(!1), f = () => {
    o() ? d(!1) : d(!0);
  }, [x] = j(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [$] = j(n.formMode > 2 && e.comments == 0);
  return (() => {
    var M = gl(), v = M.firstChild, u = v.firstChild, w = u.firstChild, p = u.nextSibling, _ = v.nextSibling, S = _.firstChild, O = S.firstChild, N = O.firstChild;
    return k(u, g(P, {
      get when() {
        return e.component.required;
      },
      get children() {
        return ol();
      }
    }), null), k(u, g(P, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var m = dl();
        return m.$$click = f, m;
      }
    }), null), k(p, g(P, {
      get when() {
        return o();
      },
      get children() {
        var m = cl();
        return V(() => m.innerHTML = e.component.hint), m;
      }
    })), k(N, g(ce, {
      get each() {
        return c();
      },
      children: (m, h) => (() => {
        var b = ml(), C = b.firstChild, L = C.firstChild;
        return b.$$click = () => l(h()), L.addEventListener("change", (E) => a(E.currentTarget.value, m.label)), k(b, g(me, {
          get children() {
            return [g(Q, {
              get when() {
                return ke(() => !!m.open)() && r === m.value;
              },
              get children() {
                var E = hl(), I = E.firstChild;
                return I.addEventListener("change", (R) => a(m.value, R.currentTarget.value)), V((R) => {
                  var A = e.component.dataKey, T = e.component.dataKey, K = i();
                  return A !== R.e && U(I, "name", R.e = A), T !== R.t && U(I, "id", R.t = T), K !== R.a && (I.disabled = R.a = K), R;
                }, {
                  e: void 0,
                  t: void 0,
                  a: void 0
                }), V(() => I.value = e.value && e.value.length > 0 ? e.value[0].label : m.label), E;
              }
            }), g(Q, {
              get when() {
                return !m.open || r !== m.value;
              },
              get children() {
                var E = fl();
                return V(() => E.innerHTML = m.label), E;
              }
            })];
          }
        }), null), V((E) => {
          var I = e.component.dataKey + h(), R = e.component.dataKey, A = "radio-" + e.component.dataKey + "-" + h(), T = i();
          return I !== E.e && U(C, "for", E.e = I), R !== E.t && U(L, "name", E.t = R), A !== E.a && U(L, "id", E.a = A), T !== E.o && (L.disabled = E.o = T), E;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0
        }), V(() => L.checked = r === m.value), V(() => L.value = m.value), b;
      })()
    })), k(S, g(P, {
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
            var h = wl(), b = h.firstChild, C = b.firstChild;
            return k(b, g(me, {
              get children() {
                return [g(Q, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return vl();
                  }
                }), g(Q, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return bl();
                  }
                })];
              }
            }), C), C.innerHTML = m, V((L) => Z(b, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, L)), h;
          })()
        });
      }
    }), null), k(_, g(P, {
      get when() {
        return x();
      },
      get children() {
        var m = ul();
        return k(m, g(Ae, {
          get disabled() {
            return $();
          },
          onClick: () => e.openRemark(e.component.dataKey),
          get comments() {
            return e.comments;
          }
        })), m;
      }
    }), null), V((m) => {
      var h = e.component.label, b = {
        "col-span-11 lg:-mr-4": x(),
        "col-span-12": !x()
      }, C = {
        " border-b border-orange-500 pb-3 ": e.classValidation === 1,
        " border-b border-pink-600 pb-3 ": e.classValidation === 2
      }, L = e.component.cols === 1 || e.component.cols === void 0, E = e.component.cols === 2, I = e.component.cols === 3, R = e.component.cols === 4, A = e.component.cols === 5;
      return h !== m.e && (w.innerHTML = m.e = h), m.t = Z(S, b, m.t), m.a = Z(O, C, m.a), L !== m.o && N.classList.toggle("grid-cols-1", m.o = L), E !== m.i && N.classList.toggle("grid-cols-2", m.i = E), I !== m.n && N.classList.toggle("grid-cols-3", m.n = I), R !== m.s && N.classList.toggle("grid-cols-4", m.s = R), A !== m.h && N.classList.toggle("grid-cols-5", m.h = A), m;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0,
      n: void 0,
      s: void 0,
      h: void 0
    }), M;
  })();
};
ge(["click"]);
var yl = /* @__PURE__ */ y("<span class=text-pink-600>*"), pl = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), kl = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), gi = /* @__PURE__ */ y('<input type=text class="w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"placeholder>'), $l = /* @__PURE__ */ y("<div class=shrink-0>"), _l = /* @__PURE__ */ y('<div class="grid md:grid-cols-3 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 md:col-span-2 flex items-start gap-2"><div class=flex-1>'), Sl = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), Cl = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Ml = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="flex-1 text-justify">');
const Il = (e) => {
  const t = e.config, [n] = j(t.formMode > 1 && t.initialMode == 2 ? !0 : t.initialMode == 1 && e.component.disableInitial !== void 0 ? e.component.disableInitial : e.component.disableInput), [i, r] = j(!1), a = () => {
    i() ? r(!1) : r(!0);
  }, [l] = j(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [s] = j(t.formMode > 2 && e.comments == 0);
  return (() => {
    var c = _l(), o = c.firstChild, d = o.firstChild, f = d.firstChild, x = d.nextSibling, $ = o.nextSibling, M = $.firstChild;
    return k(d, g(P, {
      get when() {
        return e.component.required;
      },
      get children() {
        return yl();
      }
    }), null), k(d, g(P, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var v = pl();
        return v.$$click = a, v;
      }
    }), null), k(x, g(P, {
      get when() {
        return i();
      },
      get children() {
        var v = kl();
        return V(() => v.innerHTML = e.component.hint), v;
      }
    })), k(M, g(P, {
      get when() {
        return e.component.lengthInput === void 0;
      },
      get children() {
        var v = gi();
        return v.addEventListener("change", (u) => {
          e.onValueChange(u.currentTarget.value);
        }), V((u) => {
          var w = e.component.dataKey, p = {
            " border border-solid border-gray-300 ": e.classValidation === 0,
            " border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
            " border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
          }, _ = n();
          return w !== u.e && U(v, "name", u.e = w), u.t = Z(v, p, u.t), _ !== u.a && (v.disabled = u.a = _), u;
        }, {
          e: void 0,
          t: void 0,
          a: void 0
        }), V(() => v.value = e.value), v;
      }
    }), null), k(M, g(P, {
      get when() {
        return ke(() => e.component.lengthInput !== void 0)() && e.component.lengthInput.length > 0;
      },
      get children() {
        var v = gi();
        return v.addEventListener("change", (u) => {
          e.onValueChange(u.currentTarget.value);
        }), V((u) => {
          var w = e.component.dataKey, p = {
            " border border-solid border-gray-300 ": e.classValidation === 0,
            " border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
            " border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
          }, _ = n(), S = e.component.lengthInput[0].maxlength !== void 0 ? e.component.lengthInput[0].maxlength : "", O = e.component.lengthInput[0].minlength !== void 0 ? e.component.lengthInput[0].minlength : "";
          return w !== u.e && U(v, "name", u.e = w), u.t = Z(v, p, u.t), _ !== u.a && (v.disabled = u.a = _), S !== u.o && U(v, "maxlength", u.o = S), O !== u.i && U(v, "minlength", u.i = O), u;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0,
          i: void 0
        }), V(() => v.value = e.value), v;
      }
    }), null), k(M, g(P, {
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
            var u = Ml(), w = u.firstChild, p = w.firstChild;
            return k(w, g(me, {
              get children() {
                return [g(Q, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return Sl();
                  }
                }), g(Q, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return Cl();
                  }
                })];
              }
            }), p), p.innerHTML = v, V((_) => Z(w, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, _)), u;
          })()
        });
      }
    }), null), k($, g(P, {
      get when() {
        return l();
      },
      get children() {
        var v = $l();
        return k(v, g(Ae, {
          get disabled() {
            return s();
          },
          onClick: () => e.openRemark(e.component.dataKey),
          get comments() {
            return e.comments;
          }
        })), v;
      }
    }), null), V(() => f.innerHTML = e.component.label), c;
  })();
};
ge(["click"]);
const El = (e) => {
  const t = et({
    multiple: !1,
    disabled: !1,
    optionToValue: (z) => z,
    isOptionDisabled: (z) => !1
  }, e), n = (z) => {
    if (t.multiple && Array.isArray(z))
      return z;
    if (!t.multiple && !Array.isArray(z))
      return z !== null ? [z] : [];
    throw new Error(`Incompatible value type for ${t.multiple ? "multple" : "single"} select.`);
  }, [i, r] = j(t.initialValue ? n(t.initialValue) : []), a = () => t.multiple ? i() : i()[0] || null, l = (z) => r(n(z)), s = () => r([]), c = () => !!(t.multiple ? a().length : a());
  $e(yt(i, () => {
    var z;
    return (z = t.onChange) == null ? void 0 : z.call(t, a());
  }, {
    defer: !0
  }));
  const [o, d] = j(""), f = () => d("");
  $e(yt(o, (z) => {
    var B;
    return (B = t.onInput) == null ? void 0 : B.call(t, z);
  }, {
    defer: !0
  })), $e(yt(o, (z) => {
    z && !_() && O();
  }, {
    defer: !0
  }));
  const x = typeof t.options == "function" ? Ce(() => t.options(o()), t.options(o())) : () => t.options, $ = () => x().length, M = (z) => {
    if (t.isOptionDisabled(z)) return;
    const B = t.optionToValue(z);
    t.multiple ? l([...i(), B]) : (l(B), p()), N();
  }, [v, u] = j(!1), w = () => u(!1), p = () => u(!0), [_, S] = j(!1), O = () => S(!0), N = () => S(!1), m = () => S(!_()), h = () => t.disabled, [b, C] = j(-1), L = () => x()[b()], E = (z) => z === L(), I = (z) => {
    $() || C(-1);
    const B = $() - 1, J = z === "next" ? 1 : -1;
    let H = b() + J;
    H > B && (H = 0), H < 0 && (H = B), C(H);
  }, R = () => I("previous"), A = () => I("next");
  $e(yt(x, (z) => {
    _() && C(Math.min(0, z.length - 1));
  }, {
    defer: !0
  })), $e(yt(h, (z) => {
    z && _() && N();
  })), $e(yt(_, (z) => {
    z ? (b() === -1 && A(), w()) : (b() > -1 && C(-1), f());
  }, {
    defer: !0
  })), $e(yt(b, (z) => {
    z > -1 && !_() && O();
  }, {
    defer: !0
  }));
  const T = {
    containerRef: null,
    inputRef: null,
    listRef: null
  }, K = (z) => {
    T.containerRef = z, z.getAttribute("tabIndex") || (z.tabIndex = -1), z.addEventListener("focusin", () => {
      w();
    }), z.addEventListener("focusout", (B) => {
      const J = B.relatedTarget;
      for (const H of Object.values(T))
        if (H != null && H.contains(J)) {
          B.preventDefault(), B.stopPropagation();
          return;
        }
      N();
    }), z.addEventListener("pointerdown", (B) => {
      T.inputRef && B.target !== T.inputRef && B.preventDefault();
    }), z.addEventListener("click", (B) => {
      (!T.listRef || !T.listRef.contains(B.target)) && (T.inputRef && T.inputRef.focus(), m());
    });
  }, F = (z) => {
    T.inputRef = z, z.getAttribute("tabIndex") || (z.tabIndex = -1), V(() => z.value = o()), z.addEventListener("input", (B) => {
      d(B.target.value);
    }), V(() => {
      z.style.setProperty("opacity", v() ? "0" : "1");
    }), z.addEventListener("focus", (B) => {
      t.onFocus && t.onFocus(B);
    }), z.addEventListener("blur", (B) => {
      t.onBlur && t.onBlur(B);
    }), z.addEventListener("keydown", (B) => {
      switch (B.key) {
        case "ArrowDown":
          A();
          break;
        case "ArrowUp":
          R();
          break;
        case "Enter":
          if (_() && L()) {
            M(L());
            break;
          }
          return;
        case "Escape":
          if (_()) {
            N();
            break;
          }
          return;
        case "Delete":
        case "Backspace":
          if (o())
            return;
          if (t.multiple) {
            const J = a();
            l([...J.slice(0, -1)]);
          } else
            s();
          break;
        case " ":
          if (o())
            return;
          _() ? L() && M(L()) : O();
          break;
        case "Tab":
          if (L() && _()) {
            M(L());
            break;
          }
          return;
        default:
          return;
      }
      B.preventDefault(), B.stopPropagation();
    });
  }, D = (z) => {
    T.listRef = z, z.getAttribute("tabIndex") || (z.tabIndex = -1), z.addEventListener("pointerdown", (B) => {
      B.preventDefault(), B.stopPropagation();
    });
  };
  return {
    get value() {
      return a();
    },
    get hasValue() {
      return c();
    },
    setValue: l,
    get options() {
      return x();
    },
    get inputValue() {
      return o();
    },
    get isOpen() {
      return _();
    },
    multiple: t.multiple,
    get disabled() {
      return h();
    },
    pickOption: M,
    isOptionFocused: E,
    isOptionDisabled: t.isOptionDisabled,
    containerRef: K,
    inputRef: F,
    listRef: D
  };
};
var Ll = /* @__PURE__ */ y("<mark>");
const St = {
  NO_MATCH: 0,
  MATCH: 1,
  WORD_START: 2,
  START: 3
}, Ol = (e, t) => {
  let n = St.NO_MATCH, i = [];
  if (e.length <= t.length) {
    const r = Array.from(e.toLocaleLowerCase()), a = Array.from(t.toLocaleLowerCase());
    let l = St.START;
    e: for (let s = 0, c = 0; s < r.length; s++) {
      for (; c < a.length; )
        if (a[c] === r[s]) {
          i[c] = !0, l === St.MATCH && a[c - 1] === " " && a[c] !== " " && (l = St.WORD_START), n += l, l++, c++;
          continue e;
        } else
          l = St.MATCH, c++;
      n = St.NO_MATCH, i.length = 0;
    }
  }
  return {
    target: t,
    score: n,
    matches: i
  };
}, Al = (e, t = (n) => (() => {
  var i = Ll();
  return k(i, n), i;
})()) => {
  const n = e.target, i = e.matches, r = "\0", a = [];
  let l = !1;
  for (let s = 0; s < n.length; s++) {
    const c = n[s], o = i[s];
    !l && o ? (a.push(r), l = !0) : l && !o && (a.push(r), l = !1), a.push(c);
  }
  return l && (a.push(r), l = !1), ke(() => a.join("").split(r).map((s, c) => c % 2 ? t(s) : s));
}, Rl = (e, t, n) => {
  const i = [];
  for (let r = 0; r < t.length; r++) {
    const a = t[r], l = a[n], s = Ol(e, l);
    s.score && i.push(Xe(Se({}, s), {
      item: a,
      index: r
    }));
  }
  return i.sort((r, a) => {
    let l = a.score - r.score;
    return l === 0 && (l = r.index - a.index), l;
  }), i;
};
var Vl = /* @__PURE__ */ y("<mark>");
const Lt = (e, t) => {
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
      if (n.filterable && c && (d = Rl(c, d, "label").map((f) => Xe(Se({}, f.item), {
        label: Al(f)
      }))), n.createable !== void 0) {
        const f = c.trim(), x = d.some(($) => Nl(c, i($.value)));
        if (f && !x) {
          let $;
          typeof n.createable == "function" ? $ = n.createable(f) : $ = n.key ? {
            [n.key]: f
          } : f;
          const M = {
            label: ["Create ", (() => {
              var v = Vl();
              return k(v, () => i($)), v;
            })()],
            value: $,
            disabled: !1
          };
          d = [...d, M];
        }
      }
      return d;
    },
    optionToValue: (c) => c.value,
    isOptionDisabled: (c) => c.disabled,
    format: (c, o) => o === "option" ? c.label : i(c)
  };
}, Nl = (e, t) => e.localeCompare(t, void 0, {
  sensitivity: "base"
}) === 0;
var Tl = /* @__PURE__ */ y("<div>"), Pl = /* @__PURE__ */ y("<div class=solid-select-control>"), Dl = /* @__PURE__ */ y("<div class=solid-select-placeholder>"), jl = /* @__PURE__ */ y("<div class=solid-select-single-value>"), Kl = /* @__PURE__ */ y("<div class=solid-select-multi-value><button type=button class=solid-select-multi-value-remove>⨯"), zl = /* @__PURE__ */ y("<input class=solid-select-input type=text tabindex=0 autocomplete=off autocapitalize=none size=1>"), Fl = /* @__PURE__ */ y("<div class=solid-select-list>"), Bl = /* @__PURE__ */ y("<div class=solid-select-option>");
const Ot = (e) => {
  const [t, n] = Bn(et({
    format: (r, a) => r,
    placeholder: "Select...",
    readonly: typeof e.options != "function"
  }, e), ["options", "optionToValue", "isOptionDisabled", "initialValue", "multiple", "disabled", "onInput", "onChange", "onBlur"]), i = El(t);
  return g(Hl, {
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
      return [g(Ul, {
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
      }), g(Yl, {
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
        children: (r) => g(Ql, {
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
}, Hl = (e) => (() => {
  var t = Tl(), n = e.ref;
  return typeof n == "function" ? ct(n, t) : e.ref = t, k(t, () => e.children), V((i) => {
    var r = `solid-select-container ${e.class !== void 0 ? e.class : ""}`, a = e.disabled;
    return r !== i.e && at(t, i.e = r), a !== i.t && U(t, "data-disabled", i.t = a), i;
  }, {
    e: void 0,
    t: void 0
  }), t;
})(), Ul = (e) => {
  const t = (n) => {
    const i = e.value;
    e.setValue([...i.slice(0, n), ...i.slice(n + 1)]);
  };
  return (() => {
    var n = Pl();
    return k(n, g(P, {
      get when() {
        return ke(() => !e.hasValue)() && !e.inputValue;
      },
      get children() {
        return g(Jl, {
          get children() {
            return e.placeholder;
          }
        });
      }
    }), null), k(n, g(P, {
      get when() {
        return ke(() => !!(e.hasValue && !e.multiple))() && !e.inputValue;
      },
      get children() {
        return g(Wl, {
          get children() {
            return e.format(e.value, "value");
          }
        });
      }
    }), null), k(n, g(P, {
      get when() {
        return ke(() => !!e.hasValue)() && e.multiple;
      },
      get children() {
        return g(ce, {
          get each() {
            return e.value;
          },
          children: (i, r) => g(ql, {
            onRemove: () => t(r()),
            get children() {
              return e.format(i, "value");
            }
          })
        });
      }
    }), null), k(n, g(Gl, {
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
    }), null), V((i) => {
      var r = e.multiple, a = e.hasValue, l = e.disabled;
      return r !== i.e && U(n, "data-multiple", i.e = r), a !== i.t && U(n, "data-has-value", i.t = a), l !== i.a && U(n, "data-disabled", i.a = l), i;
    }, {
      e: void 0,
      t: void 0,
      a: void 0
    }), n;
  })();
}, Jl = (e) => (() => {
  var t = Dl();
  return k(t, () => e.children), t;
})(), Wl = (e) => (() => {
  var t = jl();
  return k(t, () => e.children), t;
})(), ql = (e) => (() => {
  var t = Kl(), n = t.firstChild;
  return k(t, () => e.children, n), Re(n, "click", (i) => {
    i.stopPropagation(), e.onRemove();
  }), t;
})(), Gl = (e) => (() => {
  var t = zl();
  t.$$keydown = (i) => {
    i.key === "Escape" && (i.preventDefault(), i.stopPropagation(), i.target.blur());
  };
  var n = e.ref;
  return typeof n == "function" ? ct(n, t) : e.ref = t, V((i) => {
    var r = e.id, a = e.name, l = e.autofocus, s = e.readonly, c = e.disabled;
    return r !== i.e && U(t, "id", i.e = r), a !== i.t && U(t, "name", i.t = a), l !== i.a && (t.autofocus = i.a = l), s !== i.o && (t.readOnly = i.o = s), c !== i.i && (t.disabled = i.i = c), i;
  }, {
    e: void 0,
    t: void 0,
    a: void 0,
    o: void 0,
    i: void 0
  }), t;
})(), Yl = (e) => g(P, {
  get when() {
    return e.isOpen;
  },
  get children() {
    var t = Fl(), n = e.ref;
    return typeof n == "function" ? ct(n, t) : e.ref = t, k(t, g(ce, {
      get each() {
        return e.options;
      },
      fallback: "No options",
      get children() {
        return e.children;
      }
    })), t;
  }
}), Ql = (e) => (() => {
  var t = Bl();
  return Re(t, "click", e.pickOption, !0), k(t, () => e.children), V((n) => {
    var i = e.isDisabled, r = e.isFocused;
    return i !== n.e && U(t, "data-disabled", n.e = i), r !== n.t && U(t, "data-focused", n.t = r), n;
  }, {
    e: void 0,
    t: void 0
  }), t;
})();
ge(["keydown", "click"]);
function Rt(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var nn = { exports: {} };
var Zl = nn.exports, hi;
function Xl() {
  return hi || (hi = 1, (function(e) {
    (function(t, n) {
      e.exports ? e.exports = n() : t.Toastify = n();
    })(Zl, function(t) {
      var n = function(l) {
        return new n.lib.init(l);
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
        init: function(l) {
          return l || (l = {}), this.options = {}, this.toastElement = null, this.options.text = l.text || n.defaults.text, this.options.node = l.node || n.defaults.node, this.options.duration = l.duration === 0 ? 0 : l.duration || n.defaults.duration, this.options.selector = l.selector || n.defaults.selector, this.options.callback = l.callback || n.defaults.callback, this.options.destination = l.destination || n.defaults.destination, this.options.newWindow = l.newWindow || n.defaults.newWindow, this.options.close = l.close || n.defaults.close, this.options.gravity = l.gravity === "bottom" ? "toastify-bottom" : n.defaults.gravity, this.options.positionLeft = l.positionLeft || n.defaults.positionLeft, this.options.position = l.position || n.defaults.position, this.options.backgroundColor = l.backgroundColor || n.defaults.backgroundColor, this.options.avatar = l.avatar || n.defaults.avatar, this.options.className = l.className || n.defaults.className, this.options.stopOnFocus = l.stopOnFocus === void 0 ? n.defaults.stopOnFocus : l.stopOnFocus, this.options.onClick = l.onClick || n.defaults.onClick, this.options.offset = l.offset || n.defaults.offset, this.options.escapeMarkup = l.escapeMarkup !== void 0 ? l.escapeMarkup : n.defaults.escapeMarkup, this.options.ariaLive = l.ariaLive || n.defaults.ariaLive, this.options.style = l.style || n.defaults.style, l.backgroundColor && (this.options.style.background = l.backgroundColor), this;
        },
        // Building the DOM element
        buildToast: function() {
          if (!this.options)
            throw "Toastify is not initialized";
          var l = document.createElement("div");
          l.className = "toastify on " + this.options.className, this.options.position ? l.className += " toastify-" + this.options.position : this.options.positionLeft === !0 ? l.className += " toastify-left" : l.className += " toastify-right", l.className += " " + this.options.gravity, this.options.backgroundColor;
          for (var s in this.options.style)
            l.style[s] = this.options.style[s];
          if (this.options.ariaLive && l.setAttribute("aria-live", this.options.ariaLive), this.options.node && this.options.node.nodeType === Node.ELEMENT_NODE)
            l.appendChild(this.options.node);
          else if (this.options.escapeMarkup ? l.innerText = this.options.text : l.innerHTML = this.options.text, this.options.avatar !== "") {
            var c = document.createElement("img");
            c.src = this.options.avatar, c.className = "toastify-avatar", this.options.position == "left" || this.options.positionLeft === !0 ? l.appendChild(c) : l.insertAdjacentElement("afterbegin", c);
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
            (this.options.position == "left" || this.options.positionLeft === !0) && d > 360 ? l.insertAdjacentElement("afterbegin", o) : l.appendChild(o);
          }
          if (this.options.stopOnFocus && this.options.duration > 0) {
            var f = this;
            l.addEventListener(
              "mouseover",
              function(u) {
                window.clearTimeout(l.timeOutValue);
              }
            ), l.addEventListener(
              "mouseleave",
              function() {
                l.timeOutValue = window.setTimeout(
                  function() {
                    f.removeElement(l);
                  },
                  f.options.duration
                );
              }
            );
          }
          if (typeof this.options.destination != "undefined" && l.addEventListener(
            "click",
            function(u) {
              u.stopPropagation(), this.options.newWindow === !0 ? window.open(this.options.destination, "_blank") : window.location = this.options.destination;
            }.bind(this)
          ), typeof this.options.onClick == "function" && typeof this.options.destination == "undefined" && l.addEventListener(
            "click",
            function(u) {
              u.stopPropagation(), this.options.onClick();
            }.bind(this)
          ), typeof this.options.offset == "object") {
            var x = r("x", this.options), $ = r("y", this.options), M = this.options.position == "left" ? x : "-" + x, v = this.options.gravity == "toastify-top" ? $ : "-" + $;
            l.style.transform = "translate(" + M + "," + v + ")";
          }
          return l;
        },
        // Displaying the toast
        showToast: function() {
          this.toastElement = this.buildToast();
          var l;
          if (typeof this.options.selector == "string" ? l = document.getElementById(this.options.selector) : this.options.selector instanceof HTMLElement || typeof ShadowRoot != "undefined" && this.options.selector instanceof ShadowRoot ? l = this.options.selector : l = document.body, !l)
            throw "Root element is not defined";
          var s = n.defaults.oldestFirst ? l.firstChild : l.lastChild;
          return l.insertBefore(this.toastElement, s), n.reposition(), this.options.duration > 0 && (this.toastElement.timeOutValue = window.setTimeout(
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
        removeElement: function(l) {
          l.className = l.className.replace(" on", ""), window.setTimeout(
            function() {
              this.options.node && this.options.node.parentNode && this.options.node.parentNode.removeChild(this.options.node), l.parentNode && l.parentNode.removeChild(l), this.options.callback.call(l), n.reposition();
            }.bind(this),
            400
          );
        }
      }, n.reposition = function() {
        for (var l = {
          top: 15,
          bottom: 15
        }, s = {
          top: 15,
          bottom: 15
        }, c = {
          top: 15,
          bottom: 15
        }, o = document.getElementsByClassName("toastify"), d, f = 0; f < o.length; f++) {
          a(o[f], "toastify-top") === !0 ? d = "toastify-top" : d = "toastify-bottom";
          var x = o[f].offsetHeight;
          d = d.substr(9, d.length - 1);
          var $ = 15, M = window.innerWidth > 0 ? window.innerWidth : screen.width;
          M <= 360 ? (o[f].style[d] = c[d] + "px", c[d] += x + $) : a(o[f], "toastify-left") === !0 ? (o[f].style[d] = l[d] + "px", l[d] += x + $) : (o[f].style[d] = s[d] + "px", s[d] += x + $);
        }
        return this;
      };
      function r(l, s) {
        return s.offset[l] ? isNaN(s.offset[l]) ? s.offset[l] : s.offset[l] + "px" : "0px";
      }
      function a(l, s) {
        return !l || typeof s != "string" ? !1 : !!(l.className && l.className.trim().split(/\s+/gi).indexOf(s) > -1);
      }
      return n.lib.init.prototype = n.lib, n;
    });
  })(nn)), nn.exports;
}
var es = Xl();
const ts = /* @__PURE__ */ Rt(es), $n = {
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
    gravity: l = "bottom",
    closeOnClick: s = !0,
    style: c
  } = e;
  ts({
    text: t + r,
    duration: n,
    gravity: l,
    position: a,
    close: s,
    className: i,
    style: Se({}, c)
  }).showToast();
}
function je(e, t = 3e3, n = "", i = "bg-blue-600/80") {
  _n(Se({
    message: e,
    duration: t,
    text: n,
    className: i
  }, $n.info));
}
function Ue(e, t = 3e3) {
  _n(Se({
    message: e,
    duration: t
  }, $n.success));
}
function ns(e, t = 4e3) {
  _n(Se({
    message: e,
    duration: t
  }, $n.warning));
}
function ve(e, t = 5e3) {
  _n(Se({
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
class is {
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
    var l;
    const [n] = this.stores.referenceMap, r = n()[t];
    if (r !== void 0) {
      const [s] = this.stores.reference;
      if (s.details[r] && s.details[r].dataKey === t)
        return r;
    }
    return this.rebuildIndexMap(), (l = n()[t]) != null ? l : -1;
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
    const i = n.split(He.NESTED_SEPARATOR), r = [];
    for (let l = 1; l < i.length; l++) {
      const s = i[l].match(/@(\d+)/);
      s && r.push(parseInt(s[1], 10));
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
    const i = t.split(He.NESTED_SEPARATOR), r = [];
    for (let l = 1; l < i.length; l++) {
      const s = i[l].match(/@(\d+)/);
      s && r.push(parseInt(s[1], 10));
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
    const [, n] = this.stores.compEnableMap, [, i] = this.stores.compValidMap, [, r] = this.stores.compVarMap, [, a] = this.stores.compSourceOptionMap, [, l] = this.stores.compSourceQuestionMap, s = {}, c = {}, o = {}, d = {}, f = {};
    for (const x of t) {
      if (x.componentEnable)
        for (const $ of x.componentEnable) {
          const M = this.getBaseDataKey($);
          s[M] || (s[M] = []), s[M].includes(x.dataKey) || s[M].push(x.dataKey);
        }
      if (x.componentValidation)
        for (const $ of x.componentValidation) {
          const M = this.getBaseDataKey($);
          c[M] || (c[M] = []), c[M].includes(x.dataKey) || c[M].push(x.dataKey);
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
    n(s), i(c), r(o), a(d), l(f);
  }
  /**
   * Get base dataKey without row markers.
   *
   * @param dataKey - The dataKey possibly with @$ROW$ markers
   * @returns The base dataKey
   */
  getBaseDataKey(t) {
    return t.split("@")[0].split(He.NESTED_SEPARATOR)[0];
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
    for (const [a, l] of Object.entries(n))
      r("details", i, a, l);
  }
  /**
   * Register newly created components in dependency maps.
   * Called when nested components are dynamically created.
   *
   * @param components - The newly created components to register
   */
  registerDynamicComponents(t) {
    se.log("ReferenceService", "registerDynamicComponents called with", t.length, "components");
    const [n, i] = this.stores.compEnableMap, [r, a] = this.stores.compValidMap, [l, s] = this.stores.compVarMap, [c, o] = this.stores.compSourceOptionMap, [d, f] = this.stores.compSourceQuestionMap, x = Se({}, n()), $ = Se({}, r()), M = Se({}, l()), v = Se({}, c()), u = Se({}, d());
    for (const w of t) {
      if (w.componentEnable)
        for (const p of w.componentEnable) {
          const _ = this.getBaseDataKey(p);
          x[_] || (x[_] = []), x[_].includes(w.dataKey) || x[_].push(w.dataKey);
        }
      if (w.componentValidation)
        for (const p of w.componentValidation) {
          const _ = this.getBaseDataKey(p);
          $[_] || ($[_] = []), $[_].includes(w.dataKey) || $[_].push(w.dataKey);
        }
      if (w.componentVar && w.type === be.VARIABLE) {
        se.log("ReferenceService", "Registering variable component:", {
          dataKey: w.dataKey,
          componentVar: w.componentVar,
          type: w.type
        });
        for (const p of w.componentVar)
          se.log("ReferenceService", "Adding varMap entry:", p, "->", w.dataKey), M[p] || (M[p] = []), M[p].includes(w.dataKey) || M[p].push(w.dataKey);
      }
      if (w.sourceOption) {
        const p = this.getBaseDataKey(w.sourceOption);
        v[p] || (v[p] = []), v[p].includes(w.dataKey) || v[p].push(w.dataKey);
      }
      w.sourceQuestion && w.type === be.NESTED && (se.log("ReferenceService", "Registering nested dependency:", {
        sourceQuestion: w.sourceQuestion,
        dataKey: w.dataKey
      }), u[w.sourceQuestion] || (u[w.sourceQuestion] = []), u[w.sourceQuestion].includes(w.dataKey) || u[w.sourceQuestion].push(w.dataKey));
    }
    i(x), a($), s(M), o(v), f(u);
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
class rs {
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
  evaluateEnableCondition(t, n, i = il.ENABLE_CONDITION) {
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
    const { defaultValue: r, logErrors: a = !0, silent: l = !1 } = i;
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
      const l = new Function(...i, a);
      return () => l(...r);
    } catch (l) {
      throw new Error(
        `Syntax error in expression "${t}": ${l instanceof Error ? l.message : String(l)}`
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
var rn = { exports: {} }, as = rn.exports, mi;
function ls() {
  return mi || (mi = 1, (function(e, t) {
    (function(n, i) {
      e.exports = i();
    })(as, (function() {
      var n = 1e3, i = 6e4, r = 36e5, a = "millisecond", l = "second", s = "minute", c = "hour", o = "day", d = "week", f = "month", x = "quarter", $ = "year", M = "date", v = "Invalid Date", u = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, w = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, p = { name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), ordinal: function(R) {
        var A = ["th", "st", "nd", "rd"], T = R % 100;
        return "[" + R + (A[(T - 20) % 10] || A[T] || A[0]) + "]";
      } }, _ = function(R, A, T) {
        var K = String(R);
        return !K || K.length >= A ? R : "" + Array(A + 1 - K.length).join(T) + R;
      }, S = { s: _, z: function(R) {
        var A = -R.utcOffset(), T = Math.abs(A), K = Math.floor(T / 60), F = T % 60;
        return (A <= 0 ? "+" : "-") + _(K, 2, "0") + ":" + _(F, 2, "0");
      }, m: function R(A, T) {
        if (A.date() < T.date()) return -R(T, A);
        var K = 12 * (T.year() - A.year()) + (T.month() - A.month()), F = A.clone().add(K, f), D = T - F < 0, z = A.clone().add(K + (D ? -1 : 1), f);
        return +(-(K + (T - F) / (D ? F - z : z - F)) || 0);
      }, a: function(R) {
        return R < 0 ? Math.ceil(R) || 0 : Math.floor(R);
      }, p: function(R) {
        return { M: f, y: $, w: d, d: o, D: M, h: c, m: s, s: l, ms: a, Q: x }[R] || String(R || "").toLowerCase().replace(/s$/, "");
      }, u: function(R) {
        return R === void 0;
      } }, O = "en", N = {};
      N[O] = p;
      var m = "$isDayjsObject", h = function(R) {
        return R instanceof E || !(!R || !R[m]);
      }, b = function R(A, T, K) {
        var F;
        if (!A) return O;
        if (typeof A == "string") {
          var D = A.toLowerCase();
          N[D] && (F = D), T && (N[D] = T, F = D);
          var z = A.split("-");
          if (!F && z.length > 1) return R(z[0]);
        } else {
          var B = A.name;
          N[B] = A, F = B;
        }
        return !K && F && (O = F), F || !K && O;
      }, C = function(R, A) {
        if (h(R)) return R.clone();
        var T = typeof A == "object" ? A : {};
        return T.date = R, T.args = arguments, new E(T);
      }, L = S;
      L.l = b, L.i = h, L.w = function(R, A) {
        return C(R, { locale: A.$L, utc: A.$u, x: A.$x, $offset: A.$offset });
      };
      var E = (function() {
        function R(T) {
          this.$L = b(T.locale, null, !0), this.parse(T), this.$x = this.$x || T.x || {}, this[m] = !0;
        }
        var A = R.prototype;
        return A.parse = function(T) {
          this.$d = (function(K) {
            var F = K.date, D = K.utc;
            if (F === null) return /* @__PURE__ */ new Date(NaN);
            if (L.u(F)) return /* @__PURE__ */ new Date();
            if (F instanceof Date) return new Date(F);
            if (typeof F == "string" && !/Z$/i.test(F)) {
              var z = F.match(u);
              if (z) {
                var B = z[2] - 1 || 0, J = (z[7] || "0").substring(0, 3);
                return D ? new Date(Date.UTC(z[1], B, z[3] || 1, z[4] || 0, z[5] || 0, z[6] || 0, J)) : new Date(z[1], B, z[3] || 1, z[4] || 0, z[5] || 0, z[6] || 0, J);
              }
            }
            return new Date(F);
          })(T), this.init();
        }, A.init = function() {
          var T = this.$d;
          this.$y = T.getFullYear(), this.$M = T.getMonth(), this.$D = T.getDate(), this.$W = T.getDay(), this.$H = T.getHours(), this.$m = T.getMinutes(), this.$s = T.getSeconds(), this.$ms = T.getMilliseconds();
        }, A.$utils = function() {
          return L;
        }, A.isValid = function() {
          return this.$d.toString() !== v;
        }, A.isSame = function(T, K) {
          var F = C(T);
          return this.startOf(K) <= F && F <= this.endOf(K);
        }, A.isAfter = function(T, K) {
          return C(T) < this.startOf(K);
        }, A.isBefore = function(T, K) {
          return this.endOf(K) < C(T);
        }, A.$g = function(T, K, F) {
          return L.u(T) ? this[K] : this.set(F, T);
        }, A.unix = function() {
          return Math.floor(this.valueOf() / 1e3);
        }, A.valueOf = function() {
          return this.$d.getTime();
        }, A.startOf = function(T, K) {
          var F = this, D = !!L.u(K) || K, z = L.p(T), B = function(Y, q) {
            var W = L.w(F.$u ? Date.UTC(F.$y, q, Y) : new Date(F.$y, q, Y), F);
            return D ? W : W.endOf(o);
          }, J = function(Y, q) {
            return L.w(F.toDate()[Y].apply(F.toDate("s"), (D ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(q)), F);
          }, H = this.$W, ee = this.$M, G = this.$D, le = "set" + (this.$u ? "UTC" : "");
          switch (z) {
            case $:
              return D ? B(1, 0) : B(31, 11);
            case f:
              return D ? B(1, ee) : B(0, ee + 1);
            case d:
              var re = this.$locale().weekStart || 0, te = (H < re ? H + 7 : H) - re;
              return B(D ? G - te : G + (6 - te), ee);
            case o:
            case M:
              return J(le + "Hours", 0);
            case c:
              return J(le + "Minutes", 1);
            case s:
              return J(le + "Seconds", 2);
            case l:
              return J(le + "Milliseconds", 3);
            default:
              return this.clone();
          }
        }, A.endOf = function(T) {
          return this.startOf(T, !1);
        }, A.$set = function(T, K) {
          var F, D = L.p(T), z = "set" + (this.$u ? "UTC" : ""), B = (F = {}, F[o] = z + "Date", F[M] = z + "Date", F[f] = z + "Month", F[$] = z + "FullYear", F[c] = z + "Hours", F[s] = z + "Minutes", F[l] = z + "Seconds", F[a] = z + "Milliseconds", F)[D], J = D === o ? this.$D + (K - this.$W) : K;
          if (D === f || D === $) {
            var H = this.clone().set(M, 1);
            H.$d[B](J), H.init(), this.$d = H.set(M, Math.min(this.$D, H.daysInMonth())).$d;
          } else B && this.$d[B](J);
          return this.init(), this;
        }, A.set = function(T, K) {
          return this.clone().$set(T, K);
        }, A.get = function(T) {
          return this[L.p(T)]();
        }, A.add = function(T, K) {
          var F, D = this;
          T = Number(T);
          var z = L.p(K), B = function(ee) {
            var G = C(D);
            return L.w(G.date(G.date() + Math.round(ee * T)), D);
          };
          if (z === f) return this.set(f, this.$M + T);
          if (z === $) return this.set($, this.$y + T);
          if (z === o) return B(1);
          if (z === d) return B(7);
          var J = (F = {}, F[s] = i, F[c] = r, F[l] = n, F)[z] || 1, H = this.$d.getTime() + T * J;
          return L.w(H, this);
        }, A.subtract = function(T, K) {
          return this.add(-1 * T, K);
        }, A.format = function(T) {
          var K = this, F = this.$locale();
          if (!this.isValid()) return F.invalidDate || v;
          var D = T || "YYYY-MM-DDTHH:mm:ssZ", z = L.z(this), B = this.$H, J = this.$m, H = this.$M, ee = F.weekdays, G = F.months, le = F.meridiem, re = function(q, W, ie, ae) {
            return q && (q[W] || q(K, D)) || ie[W].slice(0, ae);
          }, te = function(q) {
            return L.s(B % 12 || 12, q, "0");
          }, Y = le || function(q, W, ie) {
            var ae = q < 12 ? "AM" : "PM";
            return ie ? ae.toLowerCase() : ae;
          };
          return D.replace(w, (function(q, W) {
            return W || (function(ie) {
              switch (ie) {
                case "YY":
                  return String(K.$y).slice(-2);
                case "YYYY":
                  return L.s(K.$y, 4, "0");
                case "M":
                  return H + 1;
                case "MM":
                  return L.s(H + 1, 2, "0");
                case "MMM":
                  return re(F.monthsShort, H, G, 3);
                case "MMMM":
                  return re(G, H);
                case "D":
                  return K.$D;
                case "DD":
                  return L.s(K.$D, 2, "0");
                case "d":
                  return String(K.$W);
                case "dd":
                  return re(F.weekdaysMin, K.$W, ee, 2);
                case "ddd":
                  return re(F.weekdaysShort, K.$W, ee, 3);
                case "dddd":
                  return ee[K.$W];
                case "H":
                  return String(B);
                case "HH":
                  return L.s(B, 2, "0");
                case "h":
                  return te(1);
                case "hh":
                  return te(2);
                case "a":
                  return Y(B, J, !0);
                case "A":
                  return Y(B, J, !1);
                case "m":
                  return String(J);
                case "mm":
                  return L.s(J, 2, "0");
                case "s":
                  return String(K.$s);
                case "ss":
                  return L.s(K.$s, 2, "0");
                case "SSS":
                  return L.s(K.$ms, 3, "0");
                case "Z":
                  return z;
              }
              return null;
            })(q) || z.replace(":", "");
          }));
        }, A.utcOffset = function() {
          return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
        }, A.diff = function(T, K, F) {
          var D, z = this, B = L.p(K), J = C(T), H = (J.utcOffset() - this.utcOffset()) * i, ee = this - J, G = function() {
            return L.m(z, J);
          };
          switch (B) {
            case $:
              D = G() / 12;
              break;
            case f:
              D = G();
              break;
            case x:
              D = G() / 3;
              break;
            case d:
              D = (ee - H) / 6048e5;
              break;
            case o:
              D = (ee - H) / 864e5;
              break;
            case c:
              D = ee / r;
              break;
            case s:
              D = ee / i;
              break;
            case l:
              D = ee / n;
              break;
            default:
              D = ee;
          }
          return F ? D : L.a(D);
        }, A.daysInMonth = function() {
          return this.endOf(f).$D;
        }, A.$locale = function() {
          return N[this.$L];
        }, A.locale = function(T, K) {
          if (!T) return this.$L;
          var F = this.clone(), D = b(T, K, !0);
          return D && (F.$L = D), F;
        }, A.clone = function() {
          return L.w(this.$d, this);
        }, A.toDate = function() {
          return new Date(this.valueOf());
        }, A.toJSON = function() {
          return this.isValid() ? this.toISOString() : null;
        }, A.toISOString = function() {
          return this.$d.toISOString();
        }, A.toString = function() {
          return this.$d.toUTCString();
        }, R;
      })(), I = E.prototype;
      return C.prototype = I, [["$ms", a], ["$s", l], ["$m", s], ["$H", c], ["$W", o], ["$M", f], ["$y", $], ["$D", M]].forEach((function(R) {
        I[R[1]] = function(A) {
          return this.$g(A, R[0], R[1]);
        };
      })), C.extend = function(R, A) {
        return R.$i || (R(A, E, C), R.$i = !0), C;
      }, C.locale = b, C.isDayjs = h, C.unix = function(R) {
        return C(1e3 * R);
      }, C.en = N[O], C.Ls = N, C.p = {}, C;
    }));
  })(rn)), rn.exports;
}
var ss = ls();
const We = /* @__PURE__ */ Rt(ss);
function os(e, t) {
  return e.replace(/\$(\w*)/g, (n, i) => Object.prototype.hasOwnProperty.call(t, i) ? String(t[i]) : "");
}
function ds(e) {
  if (!e || e.trim() === "")
    return !1;
  const t = new Date(e);
  return t.toString() !== "Invalid Date" && !isNaN(t.getTime());
}
function vi(e, t = "DD/MM/YYYY") {
  return We(e).format(t);
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
      return { state: Te.VALID, messages: [] };
    if (n.hasRemark)
      return { state: Te.VALID, messages: [] };
    const i = {
      state: Te.VALID,
      messages: []
    };
    return this.runExpressionValidations(n, i), this.runLengthValidations(n, i), this.runRangeValidations(n, i), this.runPatternValidations(n, i), this.config.clientMode === dt.PAPI && this.runPapiValidations(n, i), this.updateValidationState(t, i), i;
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
            const l = a.message || this.getLocaleString("validationApi");
            this.addValidationMessage(t, l, Te.ERROR);
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
      validationState: Te.VALID,
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
        case Te.VALID:
          n++;
          break;
        case Te.WARNING:
          i++;
          break;
        case Te.ERROR:
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
    ), n.state = Te.ERROR), r.min !== void 0 && i.length < r.min && (n.messages.push(
      `${this.getLocaleString("validationMinLength")} ${r.min}`
    ), n.state = Te.ERROR);
  }
  /**
   * Run range validations (min, max).
   */
  runRangeValidations(t, n) {
    if (!t.rangeInput || t.answer === void 0 || t.answer === null || typeof t.answer == "object") return;
    const i = Number(t.answer), r = t.rangeInput;
    r.max !== void 0 && i > Number(r.max) && (n.messages.push(
      `${this.getLocaleString("validationMax")} ${r.max}`
    ), n.state = Te.ERROR), r.min !== void 0 && i < Number(r.min) && (n.messages.push(
      `${this.getLocaleString("validationMin")} ${r.min}`
    ), n.state = Te.ERROR);
  }
  /**
   * Run pattern validations (email, URL).
   */
  runPatternValidations(t, n) {
    if (t.answer === void 0 || t.answer === null || typeof t.answer == "object") return;
    const i = String(t.answer);
    t.type === be.URL && i && (He.EMAIL.test(i) || (n.messages.push(this.getLocaleString("validationEmail")), n.state = Te.ERROR)), t.type, be.EMAIL;
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
      const a = os(this.getLocaleString("validationInclude"), {
        values: i.join(",")
      });
      n.messages.push(a), n.state = Te.ERROR;
    }
  }
  /**
   * Validate date input for PAPI mode.
   */
  validateDateInput(t, n) {
    const i = String(t.answer);
    if (!ds(i)) {
      n.messages.push(this.getLocaleString("validationDate")), n.state = Te.ERROR;
      return;
    }
    const r = new Date(i), a = t.rangeInput;
    if ((a == null ? void 0 : a.max) !== void 0) {
      const l = a.max === "today" ? /* @__PURE__ */ new Date() : new Date(a.max);
      r.getTime() > l.getTime() && (n.messages.push(
        `${this.getLocaleString("validationMax")} ${vi(l)}`
      ), n.state = Te.ERROR);
    }
    if ((a == null ? void 0 : a.min) !== void 0) {
      const l = a.min === "today" ? /* @__PURE__ */ new Date() : new Date(a.min);
      r.getTime() < l.getTime() && (n.messages.push(
        `${this.getLocaleString("validationMin")} ${vi(l)}`
      ), n.state = Te.ERROR);
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
    ), n.state = Te.ERROR);
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
      Te.ERROR
    );
  }
  /**
   * Add a validation message to a component.
   */
  addValidationMessage(t, n, i) {
    const r = this.referenceService.getComponent(t);
    if (!r) return;
    const a = [...r.validationMessage || [], n], l = Math.max(r.validationState, i);
    this.referenceService.updateComponentBatch(t, {
      validationMessage: a,
      validationState: l
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
class us {
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
      const s = a.enable, c = this.expressionService.evaluateEnableCondition(
        a.enableCondition || "",
        a.dataKey
      );
      i("details", r, "enable", c), c !== s && this.updateSectionComponents(a, c);
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
    const l = r.split(He.NESTED_SEPARATOR), s = l.length;
    switch (a) {
      case "$ROW$":
        return r;
      case "$ROW1$":
        return s > 2 && (l.length = s - 1), l.join(He.NESTED_SEPARATOR);
      case "$ROW2$":
        return s > 3 && (l.length = s - 2), l.join(He.NESTED_SEPARATOR);
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
          const l = i.details[a];
          if (l.type === be.VARIABLE)
            continue;
          let s = !0;
          l.enableCondition && l.enableCondition.trim() !== "" && (s = this.expressionService.evaluateEnableCondition(
            l.enableCondition,
            l.dataKey
          )), this.referenceService.updateComponent(l.dataKey, "enable", s);
        }
    }
  }
  /**
   * Disable all children of a parent component.
   */
  disableChildren(t) {
    const [n] = this.stores.reference;
    for (const i of n.details)
      (i.parent === t || i.dataKey.startsWith(t + He.NESTED_SEPARATOR)) && this.referenceService.updateComponent(i.dataKey, "enable", !1);
  }
  /**
   * Re-evaluate enable conditions for all children of a parent.
   */
  reevaluateChildren(t) {
    const [n] = this.stores.reference;
    for (const i of n.details)
      (i.parent === t || i.dataKey.startsWith(t + He.NESTED_SEPARATOR)) && (i.enableCondition ? this.evaluateEnable(i.dataKey) : this.referenceService.updateComponent(i.dataKey, "enable", !0));
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
class gs {
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
    var M;
    se.log("NestedService", "insertFromArray called:", { dataKey: t, answer: n, sidebarPosition: i });
    let r = this.referenceService.getComponent(t);
    se.log("NestedService", "Parent component from reference:", r);
    let a = r == null ? void 0 : r.components;
    se.log("NestedService", "Component components:", a);
    const [l] = this.stores.nested, s = l.details;
    se.log("NestedService", "Looking for dataKey in nested store:", t);
    const c = s.find((v) => v.dataKey === t);
    if (se.log("NestedService", "Nested store entry:", c), c && (a || (a = c.components), r && (r = Xe(Se({}, r), {
      level: (M = c.level) != null ? M : r.level,
      // Keep the reference component's index - it's the actual instance index
      // label and name from nested store are fallbacks if reference doesn't have them
      label: r.label || c.label,
      name: r.name || c.name
    }), se.log("NestedService", "Updated component with nested store values:", {
      level: r.level,
      index: r.index
    }))), !a) {
      const [v] = this.stores.sidebar, u = v.details.find(
        (w) => w.dataKey === t
      );
      se.log("NestedService", "Sidebar entry (fallback):", u), a = u == null ? void 0 : u.components;
    }
    if (!r || !a) {
      se.log("NestedService", "No component or no components array, returning");
      return;
    }
    const [o] = this.stores.sidebar;
    let d = r.index;
    const f = o.details.find((v) => {
      var w;
      return (w = v.components) != null && w[0] ? v.components[0].some((p) => p.dataKey === t) : !1;
    });
    if (f) {
      const u = f.components[0].findIndex((w) => w.dataKey === t);
      d = [...f.index, 0, u], se.log("NestedService", "Found parent sidebar, computed runtime index:", {
        parentSidebarDataKey: f.dataKey,
        parentSidebarIndex: JSON.stringify(f.index),
        compPosition: u,
        runtimeIndex: JSON.stringify(d)
      });
    }
    const x = Xe(Se({}, r), {
      components: a,
      index: d
    });
    se.log("NestedService", "Component with components:", x);
    const $ = this.createNestedComponents(
      x,
      Number(n.value),
      i,
      n.label
    );
    if (se.log("NestedService", "Created new components:", $.length), $.length !== 0)
      try {
        se.log("NestedService", "About to insertIntoReference"), this.insertIntoReference($, x), se.log("NestedService", "insertIntoReference completed"), se.log("NestedService", "About to insertIntoSidebar"), this.insertIntoSidebar(x, n, $, i), se.log("NestedService", "insertIntoSidebar completed"), se.log("NestedService", "About to initializeNestedAnswers"), this.initializeNestedAnswers($, i), se.log("NestedService", "initializeNestedAnswers completed"), se.log("NestedService", "insertFromArray completed successfully");
      } catch (v) {
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
    for (const s of n)
      i.some(
        (o) => Number(o.value) === Number(s.value)
      ) || a.push(s);
    const l = [];
    for (const s of i)
      n.some(
        (o) => Number(o.value) === Number(s.value)
      ) || l.push(s);
    if (a.length === 0 && l.length === 0) {
      this.handleLabelChange(t, n, i);
      return;
    }
    for (const s of a)
      this.insertFromArray(t, s, r);
    for (const s of l)
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
    var M;
    se.log("NestedService", "insertFromNumber called:", { dataKey: t, targetCount: n, currentCount: i, sidebarPosition: r });
    let a = this.referenceService.getComponent(t);
    se.log("NestedService", "Parent component from reference:", a);
    let l = a == null ? void 0 : a.components;
    se.log("NestedService", "Component components:", l);
    const [s] = this.stores.nested, c = s.details;
    se.log("NestedService", "Looking for dataKey in nested store:", t);
    const o = c.find((v) => v.dataKey === t);
    if (se.log("NestedService", "Nested store entry:", o), o && (l || (l = o.components), a && (a = Xe(Se({}, a), {
      level: (M = o.level) != null ? M : a.level,
      // Keep the reference component's index - it's the actual instance index
      // label and name from nested store are fallbacks if reference doesn't have them
      label: a.label || o.label,
      name: a.name || o.name
    }), se.log("NestedService", "Updated component with nested store values:", {
      level: a.level,
      index: a.index
    }))), !l) {
      const [v] = this.stores.sidebar, u = v.details.find(
        (w) => w.dataKey === t
      );
      se.log("NestedService", "Sidebar entry (fallback):", u), l = u == null ? void 0 : u.components;
    }
    if (!a || !l) {
      se.log("NestedService", "No component or no components array, returning");
      return;
    }
    const [d] = this.stores.sidebar;
    let f = a.index;
    const x = d.details.find((v) => {
      var w;
      return (w = v.components) != null && w[0] ? v.components[0].some((p) => p.dataKey === t) : !1;
    });
    if (x) {
      const u = x.components[0].findIndex((w) => w.dataKey === t);
      f = [...x.index, 0, u], se.log("NestedService", "Found parent sidebar, computed runtime index:", {
        parentSidebarDataKey: x.dataKey,
        parentSidebarIndex: JSON.stringify(x.index),
        compPosition: u,
        runtimeIndex: JSON.stringify(f)
      });
    }
    const $ = Xe(Se({}, a), {
      components: l,
      index: f
    });
    se.log("NestedService", "Component with components:", $);
    for (let v = i + 1; v <= n; v++) {
      const u = this.createNestedComponents(
        $,
        v,
        r,
        String(v)
      );
      if (se.log("NestedService", "Created new components:", u.length), u.length !== 0)
        try {
          se.log("NestedService", "About to insertIntoReference"), this.insertIntoReference(u, $), se.log("NestedService", "insertIntoReference completed"), se.log("NestedService", "About to insertIntoSidebar"), this.insertIntoSidebar(
            $,
            { label: `<i>___________ # ${v}</i>`, value: v },
            u,
            r
          ), se.log("NestedService", "insertIntoSidebar completed"), se.log("NestedService", "About to initializeNestedAnswers"), this.initializeNestedAnswers(u, r), se.log("NestedService", "initializeNestedAnswers completed"), se.log("NestedService", "insertFromNumber iteration completed successfully for i:", v);
        } catch (w) {
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
      for (let l = i; l > n; l--) {
        const s = [...a.index, l];
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
    const a = this.referenceService.getComponent(t);
    if (!(!a || a.type !== be.NESTED || !a.sourceQuestion || !this.referenceService.getComponent(
      a.sourceQuestion
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
    i.dataKey = `${t.dataKey}${He.NESTED_SEPARATOR}${n.nestedPosition}`;
    const r = t.name || t.dataKey;
    i.name = `${r}${He.NESTED_SEPARATOR}${n.nestedPosition}`, t.type === be.PHOTO ? i.answer = [{ label: "lastId#0", value: 0 }] : i.answer || (i.answer = ""), !i.index || !Array.isArray(i.index) ? i.index = [0, n.nestedPosition, 0, n.componentPosition] : n.parentIndex.length === 0 ? (i.index = [...i.index], i.index.length >= 2 && (i.index[i.index.length - 2] = n.nestedPosition)) : i.index = [...n.parentIndex, 0, n.componentPosition], n.parentName && (i.label = i.label.replace("$NAME$", n.parentName)), i.sourceQuestion && (i.sourceQuestion = `${i.sourceQuestion}${He.NESTED_SEPARATOR}${n.nestedPosition}`), i.sourceOption = this.updateRowMarkerReference(
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
    const l = i.componentEnable || [];
    if (i.componentEnable = this.updateRowMarkerReferences(
      l,
      n.nestedPosition
    ), i.enableCondition && l.length > 0) {
      let d = i.enableCondition;
      for (let f = 0; f < l.length; f++)
        d = d.replace(
          l[f],
          i.componentEnable[f]
        );
      i.enableCondition = d;
    }
    if (i.enable = this.evaluateComponentEnable(i), i.hasRemark = !1, t.type === be.NESTED && n.parentLevel !== void 0 && (i.level = n.parentLevel + 1, se.log("NestedService", "Set nested component level:", {
      dataKey: i.dataKey,
      parentLevel: n.parentLevel,
      newLevel: i.level
    })), (t.type === be.SECTION || t.type === be.NESTED) && ((s = t.components) != null && s[0])) {
      const d = [], f = t.components[0], x = (o = i.level) != null ? o : ((c = n.parentLevel) != null ? c : 0) + 1;
      for (let $ = 0; $ < f.length; $++) {
        const M = {
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
          this.createNestedComponent(f[$], M)
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
    const l = (d = t.components) == null ? void 0 : d[0];
    if (se.log("NestedService", "templateComponents:", l == null ? void 0 : l.length), !l)
      return se.log("NestedService", "No templateComponents, returning empty array"), a;
    const s = (f = t.level) != null ? f : 1, c = s >= 2, o = c ? [...t.index, n] : [];
    se.log("NestedService", "Index strategy:", {
      parentLevel: s,
      shouldUseParentIndex: c,
      parentIndexForChildren: JSON.stringify(o)
    });
    for (let x = 0; x < l.length; x++)
      try {
        se.log("NestedService", `Creating component ${x}:`, l[x].dataKey);
        const $ = {
          dataKey: l[x].dataKey,
          nestedPosition: n,
          componentPosition: x,
          sidebarPosition: i,
          parentIndex: o,
          parentName: r,
          parentLevel: s
          // Pass parent level so children get correct level
        }, M = this.createNestedComponent(l[x], $);
        se.log("NestedService", `Created component ${x}:`, M.dataKey, "level:", M.level), a.push(M);
      } catch ($) {
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
    const [i, r] = this.stores.reference, [a] = this.stores.referenceMap, l = this.findInsertPosition(
      t[0].index,
      i.details
    ), s = [...i.details];
    let c = l;
    const o = a(), d = [];
    for (const f of t)
      f.dataKey in o || (s.splice(c, 0, f), d.push(f), c++);
    Tn(() => {
      r("details", s), this.referenceService.rebuildIndexMap(), d.length > 0 && this.referenceService.registerDynamicComponents(d);
    });
  }
  /**
   * Remove components from the reference store.
   */
  removeFromReference(t) {
    const [n, i] = this.stores.reference, r = n.details.filter((a) => {
      const l = [...a.index];
      return l.length = t.length, JSON.stringify(l) !== JSON.stringify(t);
    });
    Tn(() => {
      i("details", r), this.referenceService.rebuildIndexMap();
    });
  }
  /**
   * Insert a sidebar entry.
   */
  insertIntoSidebar(t, n, i, r) {
    var f, x;
    const [a, l] = this.stores.sidebar;
    se.log("NestedService", "insertIntoSidebar:", {
      parentDataKey: t.dataKey,
      parentLevel: t.level,
      parentIndex: JSON.stringify(t.index),
      answer: n.value
    });
    const s = {
      dataKey: `${t.dataKey}${He.NESTED_SEPARATOR}${n.value}`,
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
    if (se.log("NestedService", "Creating sidebar entry:", {
      dataKey: s.dataKey,
      level: s.level,
      index: JSON.stringify(s.index),
      parentIndex: JSON.stringify(t.index),
      label: s.label
    }), a.details.some(($) => $.dataKey === s.dataKey)) {
      se.log("NestedService", "Sidebar entry already exists, skipping:", s.dataKey);
      return;
    }
    const o = this.findSidebarInsertPosition(
      s.index,
      a.details,
      r
    );
    se.log("NestedService", "Inserting sidebar at position:", {
      insertPos: o,
      currentSidebarLength: a.details.length
    });
    const d = [...a.details];
    d.splice(o, 0, s), se.log("NestedService", "Sidebar after insert:", {
      newLength: d.length,
      entries: d.map(($) => ({
        dataKey: $.dataKey,
        level: $.level,
        index: JSON.stringify($.index)
      }))
    }), l("details", d), this.registerNestedComponentsInStore(i);
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
      a.type === be.NESTED && a.components && (r.some((s) => s.dataKey === a.dataKey) || (se.log("NestedService", "Registering nested component in store:", a.dataKey, "level:", a.level), r.push({
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
    const [i, r] = this.stores.sidebar, a = i.details.filter((l) => {
      const s = [...l.index];
      return s.length = t.length, JSON.stringify(s) !== JSON.stringify(t);
    });
    r("details", a);
  }
  /**
   * Initialize answers for newly created nested components.
   */
  initializeNestedAnswers(t, n) {
    const [i] = this.stores.response, [r] = this.stores.preset;
    for (const a of t) {
      let l = a.answer || "";
      if (a.type === be.VARIABLE)
        l = this.expressionService.evaluateVariable(
          a.expression || "",
          a.dataKey
        );
      else {
        const s = i.details.answers.find(
          (c) => c.dataKey === a.dataKey
        );
        if (s)
          l = s.answer;
        else {
          const c = r.details.predata.find(
            (o) => o.dataKey === a.dataKey
          );
          c && this.shouldUsePreset(a) && (l = c.answer);
        }
      }
      this.referenceService.updateComponent(a.dataKey, "answer", l);
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
    return ["$ROW$", "$ROW1$", "$ROW2$"].includes(r) ? `${i[0]}${He.NESTED_SEPARATOR}${n}` : t;
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
      return ["$ROW$", "$ROW1$", "$ROW2$"].includes(a) ? `${r[0]}${He.NESTED_SEPARATOR}${n}` : i;
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
      for (let l = n.length - 1; l >= 0; l--) {
        const s = n[l].index.slice(0, r);
        if (JSON.stringify(s) === JSON.stringify(a))
          return l + 1;
      }
    }
    return n.length;
  }
  /**
   * Find the correct position to insert a new sidebar entry.
   */
  findSidebarInsertPosition(t, n, i) {
    var a, l;
    const r = t.length;
    for (let s = r; s > 1; s--) {
      const c = t.slice(0, s);
      for (let o = n.length - 1; o >= i; o--) {
        if (!n[o]) continue;
        const d = n[o].index.slice(0, s);
        if (JSON.stringify(d) === JSON.stringify(c)) {
          const f = (a = t[s]) != null ? a : 0, x = (l = n[o].index[s]) != null ? l : 0;
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
    const [r, a] = this.stores.sidebar, l = this.referenceService.getComponent(t);
    if (l)
      for (const c of n) {
        if (!i.find(
          (v) => v.value === c.value && v.label !== c.label
        )) continue;
        const d = [...l.index, Number(c.value)], f = r.details.findIndex(
          (v) => JSON.stringify(v.index) === JSON.stringify(d)
        );
        if (f === -1) continue;
        const x = r.details[f].description, $ = c.label, M = Se({}, r.details[f]);
        if (M.description = $, (s = M.components) != null && s[0]) {
          const v = M.components[0].map((u) => Xe(Se({}, u), {
            label: u.label.replace(x || "", $)
          }));
          M.components = [v];
        }
        a("details", f, M);
      }
  }
}
class hs {
  constructor(t, n, i, r, a, l, s) {
    Ie(this, "stores");
    Ie(this, "referenceService");
    Ie(this, "expressionService");
    Ie(this, "validationService");
    Ie(this, "enableService");
    Ie(this, "nestedService");
    Ie(this, "historyService", null);
    Ie(this, "config");
    this.stores = t, this.referenceService = n, this.expressionService = i, this.validationService = r, this.enableService = a, this.nestedService = l, this.config = s;
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
      isInitial: l = !1,
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
    }), this.referenceService.updateComponent(t, "answer", n), !r && !l && this.validationService.validateComponent(t), this.hasAnswerChanged(o, n) && (a || this.runCascadingUpdates(t, n, o, s));
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
      const l = a.answer.filter(
        (s) => n.some((c) => c.value === s.value)
      );
      l.length !== a.answer.length && this.saveAnswer(r, l);
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
    for (const l of a) {
      const s = this.referenceService.getComponent(l);
      se.log("AnswerService", "Processing nested:", { nestedKey: l, nested: s, type: s == null ? void 0 : s.type }), !(!s || s.type !== be.NESTED) && (typeof n == "number" || typeof n == "string" ? (se.log("AnswerService", "Handling number-based nested"), this.handleNumberBasedNested(
        l,
        Number(n),
        Number(i) || 0,
        r
      )) : Array.isArray(n) && (se.log("AnswerService", "Handling array-based nested"), this.handleArrayBasedNested(
        l,
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
    const a = this.cleanNestedOptions(n), l = this.cleanNestedOptions(i);
    se.log("AnswerService", "handleArrayBasedNested:", {
      nestedKey: t,
      cleanCurrent: a,
      cleanPrevious: l,
      currentLength: a.length,
      previousLength: l.length
    });
    for (const s of a) {
      const c = l.some((o) => o.value === s.value);
      if (!c) {
        const [o] = this.stores.sidebar, d = o.details.some(
          (f) => f.dataKey === `${t}#${s.value}`
        );
        se.log("AnswerService", "Checking item to add:", { item: s, existsInPrevious: c, existsInSidebar: d }), d || (se.log("AnswerService", "Calling insertFromArray for:", s), this.nestedService.insertFromArray(t, s, r));
      }
    }
    for (const s of l)
      a.some((o) => o.value === s.value) || (se.log("AnswerService", "Removing item:", s), this.nestedService.deleteFromArray(t, s, r));
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
class fs {
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
      const l = this.referenceHistory[a];
      switch (l.type) {
        case "insert_ref_detail":
          r = this.undoInsert(r, l.value);
          break;
        case "delete_ref_detail":
          r = this.undoDelete(r, l.value);
          break;
        case "saveAnswer":
          r = this.undoSaveAnswer(
            r,
            l.dataKey,
            l.position,
            l.attribute,
            l.value
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
      let l = a.pos;
      if (((i = t[l]) == null ? void 0 : i.dataKey) !== a.data) {
        const s = t.findIndex((c) => c.dataKey === a.data);
        s !== -1 && (l = s);
      }
      l !== -1 && l < t.length && t.splice(l, 1);
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
    var l;
    if (((l = t[i]) == null ? void 0 : l.dataKey) !== n) {
      const s = t.findIndex((c) => c.dataKey === n);
      s !== -1 && (i = s);
    }
    if (i === -1 || i >= t.length)
      return t;
    if (r === "answer")
      t[i].answer = a;
    else if (r === "enable")
      t[i].enable = a;
    else if (r === "validate") {
      const s = a;
      t[i].validationState = s.validationState, t[i].validationMessage = JSON.parse(
        JSON.stringify(s.validationMessage)
      );
    }
    return t;
  }
}
function ms(e, t) {
  const n = new is(e), i = new rs(e, n, t), r = new cs(e, n, i, t), a = new us(e, n, i, t), l = new gs(e, n, i, t), s = new fs(e, n), c = new hs(e, n, i, r, a, l, t);
  return c.setHistoryService(s), {
    reference: n,
    expression: i,
    validation: r,
    enable: a,
    nested: l,
    answer: c,
    history: s
  };
}
const Mr = Ut(), vs = (e) => g(Mr.Provider, {
  get value() {
    return e.services;
  },
  get children() {
    return e.children;
  }
});
function ut() {
  const e = Jt(Mr);
  if (!e)
    throw new Error("useServices must be used within a ServiceProvider. Make sure your component is wrapped with <ServiceProvider services={...}>.");
  return e;
}
function fm() {
  return ut().reference;
}
function mm() {
  return ut().expression;
}
function vm() {
  return ut().validation;
}
function bm() {
  return ut().enable;
}
function wm() {
  return ut().nested;
}
function xm() {
  return ut().answer;
}
function ym() {
  return ut().history;
}
var bs = /* @__PURE__ */ y("<span class=text-pink-600>*"), ws = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), xs = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), ys = /* @__PURE__ */ y("<div class=flex-1><div>"), ps = /* @__PURE__ */ y("<div class=shrink-0>"), ks = /* @__PURE__ */ y('<div class="grid md:grid-cols-3 border-b border-gray-300/[.50] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 md:col-span-2 flex items-start gap-2">'), $s = /* @__PURE__ */ y('<div class="w-full mx-auto flex-1"><div class="animate-pulse flex space-x-4"><div class="flex-1 space-y-3 py-1"><div class="h-3 bg-gray-100 rounded-full"></div><div class="h-3 bg-gray-100 rounded-full"></div><div class="h-3 bg-gray-100 rounded-full">'), _s = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), Ss = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Cs = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="flex-1 text-justify">');
const Ms = (e) => {
  const t = ut(), [n] = tt(), [i] = nt(), [r] = Jn(), [a, l] = j(""), [s, c] = j(!1), [o, d] = j([]), [f, x] = j(""), $ = e.config, [M, v] = j($.formMode > 1 ? !0 : e.component.disableInput);
  switch (e.component.typeOption) {
    case 1: {
      try {
        let m = e.component.options.map((b, C) => ({
          value: b.value,
          label: b.label
        })), h = e.value && e.value != "" ? e.value[0].value : "";
        $e(() => {
          l(e.component.label), d(m);
          let b = m.filter((C) => C.value.includes(h))[0] && h != "" ? m.filter((C) => C.value.includes(h))[0].label : "";
          x(b), c(!0);
        });
      } catch (m) {
        ve(i.details.language[0].fetchFailed);
      }
      break;
    }
    case 2: {
      try {
        if ($.lookupMode === 1) {
          let m = e.component.sourceAPI[0], h = `${m.baseUrl}`;
          if (m.filterDependencies !== void 0 && m.filterDependencies.length > 0) {
            let I, R, A = h;
            I = m.filterDependencies.map((T, K) => {
              let F = T.sourceAnswer.split("@"), D = n.details.find((z) => z.dataKey == F[0]);
              if (D.answer) {
                const z = D.answer;
                if (z.length > 0) {
                  let B = encodeURI(z[z.length - 1].value);
                  R = `${T.params}=${B}`;
                }
              } else
                v(!0);
              return R;
            }).join("&"), h = `${A}?${I}`;
          }
          if (m.subResourceDependencies !== void 0 && m.subResourceDependencies.length > 0) {
            let I, R, A = h;
            I = m.subResourceDependencies.map((T, K) => {
              let F = T.sourceAnswer.split("@"), D = n.details.find((z) => z.dataKey == F[0]);
              if (D.answer) {
                const z = D.answer;
                z.length > 0 && (R = `${encodeURI(z[z.length - 1].value)}/${T.params}`);
              } else
                v(!0);
              return R;
            }).join("/"), h = `${A}/${I}`;
          }
          const b = {
            headers: m.headers,
            method: "GET"
          }, C = (I) => de(null, null, function* () {
            return yield fetch(I, b).catch((R) => ({
              success: !1,
              data: {},
              message: "500"
            })).then((R) => de(null, null, function* () {
              if (R.status === 200) {
                let A = yield R.json(), T = new Object();
                return T.success = !0, T.data = m.data !== "" ? A[m.data] : A, T.message = A.msg, T;
              } else
                return {
                  success: !1,
                  data: {},
                  message: R.status
                };
            })).then((R) => R);
          }), [L] = Ht(() => h, C);
          let E = e.value && e.value != "" ? e.value[0].value : "";
          $e(() => {
            if (l(e.component.label), L())
              if (!L().success)
                ve(i.details.language[0].fetchFailed);
              else {
                let I = [];
                L().data.map((A, T) => {
                  I.push({
                    value: A[m.value],
                    label: A[m.label]
                  });
                });
                let R = I.find((A) => A.value == E) && E != "" ? I.find((A) => A.value == E).label : "";
                d(I), x(R), c(!0);
              }
          });
        } else if ($.lookupMode === 2) {
          let m, h = [];
          m = e.component.sourceAPI;
          let b = m[0].id, C = m[0].version;
          m[0].parentCondition.length > 0 && m[0].parentCondition.map((I, R) => {
            let A = I.value.split("@"), T = n.details.find((K) => K.dataKey == A[0]);
            if (T.answer) {
              const K = T.answer;
              if (K.length > 0) {
                let F = K[K.length - 1].value.toString();
                h.push({
                  key: I.key,
                  value: F
                });
              }
            }
          });
          let L = (I) => {
            let R = [];
            if (I.data.length > 0) {
              let A = m[0].value, T = m[0].label, K = e.value && e.value != "" ? e.value[0].value : "";
              I.data.map((D, z) => {
                R.push({
                  value: D[A],
                  label: D[T]
                });
              });
              let F = R.find((D) => D.value == K) && K != "" ? R.find((D) => D.value == K).label : "";
              l(e.component.label), d(R), x(F), c(!0);
            }
          };
          const E = e.MobileOfflineSearch(b, C, h, L);
        }
      } catch (m) {
        ve(i.details.language[0].fetchFailed);
      }
      break;
    }
    case 3: {
      try {
        let m, h, b = e.value && e.value != "" ? e.value[0].value : "";
        if (e.component.sourceOption !== void 0 && e.component.typeOption === 3) {
          const L = n.details.findIndex((E) => E.dataKey === e.component.sourceOption);
          n.details[L].type, m = n.details[L].answer, m != null ? h = m.filter((E, I) => E.value != 0).map((E, I) => ({
            value: E.value,
            label: E.label
          })) : h = [];
        }
        let C = h.find((L) => L.value == b) && b != "" ? h.find((L) => L.value == b).label : "";
        $e(() => {
          l(e.component.label), d(h), x(C), c(!0);
        });
      } catch (m) {
        ve(i.details.language[0].fetchFailed);
      }
      break;
    }
    default: {
      try {
        let m;
        e.component.options ? m = e.component.options.map((b, C) => ({
          value: b.value,
          label: b.label
        })) : m = [];
        let h = e.value && e.value != "" ? e.value[0].value : "";
        $e(() => {
          l(e.component.label), d(m);
          let b = m.filter((C) => C.value.includes(h))[0] && h != "" ? m.filter((C) => C.value.includes(h))[0].label : "";
          x(b), c(!0);
        });
      } catch (m) {
        ve(i.details.language[0].fetchFailed);
      }
      break;
    }
  }
  let u = (m) => {
    n.details.map((h) => {
      h.sourceAPI && h.sourceAPI.length > 0 && (h.sourceAPI[0].filterDependencies !== void 0 && h.sourceAPI[0].filterDependencies.length > 0 && h.sourceAPI[0].filterDependencies.map((C) => {
        if (C.sourceAnswer == m && h.answer != null) {
          let L = r.details.findIndex((E, I) => E.components[0].findIndex((A, T) => (A.dataKey, h.dataKey, T)) == -1 ? 0 : I);
          t.answer.saveAnswer(h.dataKey, null, {
            activePosition: L
          }), u(h.dataKey);
        } else
          return;
      }), h.sourceAPI[0].subResourceDependencies !== void 0 && h.sourceAPI[0].subResourceDependencies.length > 0 && h.sourceAPI[0].subResourceDependencies.map((C) => {
        if (C.sourceAnswer == m && h.answer != null) {
          let L = r.details.findIndex((E, I) => E.components[0].findIndex((A, T) => (A.dataKey, h.dataKey, T)) == -1 ? 0 : I);
          t.answer.saveAnswer(h.dataKey, null, {
            activePosition: L
          }), u(h.dataKey);
        } else
          return;
      }));
    });
  }, w = (m, h) => {
    if (m != "" && m != null) {
      let b = JSON.parse(JSON.stringify(e.value));
      b = [], b.push({
        value: m,
        label: h
      }), e.onValueChange(b), u(e.component.dataKey);
    }
  };
  const [p, _] = j(!1), S = () => {
    p() ? _(!1) : _(!0);
  }, [O] = j(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [N] = j($.formMode > 2 && e.comments == 0);
  return (() => {
    var m = ks(), h = m.firstChild, b = h.firstChild, C = b.firstChild, L = b.nextSibling, E = h.nextSibling;
    return k(b, g(P, {
      get when() {
        return e.component.required;
      },
      get children() {
        return bs();
      }
    }), null), k(b, g(P, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var I = ws();
        return I.$$click = S, I;
      }
    }), null), k(L, g(P, {
      get when() {
        return p();
      },
      get children() {
        var I = xs();
        return V(() => I.innerHTML = e.component.hint), I;
      }
    })), k(E, g(P, {
      get when() {
        return s();
      },
      get fallback() {
        return $s();
      },
      get children() {
        var I = ys(), R = I.firstChild;
        return k(R, g(Ot, et({
          class: "formgear-select w-full rounded font-light text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-0 border-transparent focus:outline-none  disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
        }, () => Lt(o() || [], {
          key: "label",
          filterable: !0
        }), {
          get disabled() {
            return M();
          },
          onChange: (A) => w(A ? A.value : "", A ? A.label : ""),
          get initialValue() {
            return {
              value: e.value && e.value != "" ? e.value[0].value : "",
              label: f
            };
          }
        }))), k(I, g(P, {
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
                var T = Cs(), K = T.firstChild, F = K.firstChild;
                return k(K, g(me, {
                  get children() {
                    return [g(Q, {
                      get when() {
                        return e.classValidation === 1;
                      },
                      get children() {
                        return _s();
                      }
                    }), g(Q, {
                      get when() {
                        return e.classValidation === 2;
                      },
                      get children() {
                        return Ss();
                      }
                    })];
                  }
                }), F), F.innerHTML = A, V((D) => Z(K, {
                  " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
                  " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
                }, D)), T;
              })()
            });
          }
        }), null), V((A) => Z(R, {
          " border rounded border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
          " border rounded border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
        }, A)), I;
      }
    }), null), k(E, g(P, {
      get when() {
        return O();
      },
      get children() {
        var I = ps();
        return k(I, g(Ae, {
          get disabled() {
            return N();
          },
          onClick: () => e.openRemark(e.component.dataKey),
          get comments() {
            return e.comments;
          }
        })), I;
      }
    }), null), V(() => C.innerHTML = a()), m;
  })();
};
ge(["click"]);
var Is = /* @__PURE__ */ y("<span class=text-pink-600>*"), Es = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Ls = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), bi = /* @__PURE__ */ y('<input type=number class="w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"placeholder>'), Os = /* @__PURE__ */ y("<div class=shrink-0>"), As = /* @__PURE__ */ y('<div class="grid md:grid-cols-3 p-2 border-b border-gray-300/[.40] dark:border-gray-200/[.10]"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 md:col-span-2 flex items-start gap-2"><div class=flex-1>'), Rs = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), Vs = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Ns = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="flex-1 text-justify">');
const Ts = (e) => {
  const t = e.config, [n] = j(t.formMode > 1 ? !0 : e.component.disableInput), [i, r] = j(!1), a = () => {
    i() ? r(!1) : r(!0);
  }, [l] = j(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [s] = j(t.formMode > 2 && e.comments == 0);
  return (() => {
    var c = As(), o = c.firstChild, d = o.firstChild, f = d.firstChild, x = d.nextSibling, $ = o.nextSibling, M = $.firstChild;
    return k(d, g(P, {
      get when() {
        return e.component.required;
      },
      get children() {
        return Is();
      }
    }), null), k(d, g(P, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var v = Es();
        return v.$$click = a, v;
      }
    }), null), k(x, g(P, {
      get when() {
        return i();
      },
      get children() {
        var v = Ls();
        return V(() => v.innerHTML = e.component.hint), v;
      }
    })), k(M, g(P, {
      get when() {
        return e.component.lengthInput === void 0;
      },
      get children() {
        var v = bi();
        return v.addEventListener("change", (u) => {
          e.onValueChange(parseInt(u.currentTarget.value));
        }), V((u) => {
          var w = e.component.dataKey, p = {
            " border border-solid border-gray-300 ": e.classValidation === 0,
            " border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
            " border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
          }, _ = n();
          return w !== u.e && U(v, "name", u.e = w), u.t = Z(v, p, u.t), _ !== u.a && (v.disabled = u.a = _), u;
        }, {
          e: void 0,
          t: void 0,
          a: void 0
        }), V(() => v.value = e.value), v;
      }
    }), null), k(M, g(P, {
      get when() {
        return ke(() => e.component.lengthInput !== void 0)() && e.component.lengthInput.length > 0;
      },
      get children() {
        var v = bi();
        return v.$$input = (u) => {
          const w = u.currentTarget;
          w.value.length > w.maxLength && (w.value = w.value.slice(0, w.maxLength));
        }, v.addEventListener("change", (u) => {
          e.onValueChange(parseInt(u.currentTarget.value));
        }), V((u) => {
          var w = e.component.dataKey, p = {
            " border border-solid border-gray-300 ": e.classValidation === 0,
            " border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
            " border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
          }, _ = n(), S = e.component.lengthInput[0].maxlength !== void 0 ? e.component.lengthInput[0].maxlength : "", O = e.component.lengthInput[0].minlength !== void 0 ? e.component.lengthInput[0].minlength : "", N = e.component.rangeInput && e.component.rangeInput[0].max !== void 0 ? e.component.rangeInput[0].max : "", m = e.component.rangeInput && e.component.rangeInput[0].min !== void 0 ? e.component.rangeInput[0].min : "";
          return w !== u.e && U(v, "name", u.e = w), u.t = Z(v, p, u.t), _ !== u.a && (v.disabled = u.a = _), S !== u.o && U(v, "maxlength", u.o = S), O !== u.i && U(v, "minlength", u.i = O), N !== u.n && U(v, "max", u.n = N), m !== u.s && U(v, "min", u.s = m), u;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0,
          i: void 0,
          n: void 0,
          s: void 0
        }), V(() => v.value = e.value), v;
      }
    }), null), k(M, g(P, {
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
            var u = Ns(), w = u.firstChild, p = w.firstChild;
            return k(w, g(me, {
              get children() {
                return [g(Q, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return Rs();
                  }
                }), g(Q, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return Vs();
                  }
                })];
              }
            }), p), p.innerHTML = v, V((_) => Z(w, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, _)), u;
          })()
        });
      }
    }), null), k($, g(P, {
      get when() {
        return l();
      },
      get children() {
        var v = Os();
        return k(v, g(Ae, {
          get disabled() {
            return s();
          },
          onClick: () => e.openRemark(e.component.dataKey),
          get comments() {
            return e.comments;
          }
        })), v;
      }
    }), null), V(() => f.innerHTML = e.component.label), c;
  })();
};
ge(["click", "input"]);
var Ps = /* @__PURE__ */ y("<span class=text-pink-600>*"), Ds = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), js = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), Ks = /* @__PURE__ */ y("<div class=shrink-0>"), zs = /* @__PURE__ */ y('<div class="grid md:grid-cols-3 border-b border-gray-300/[.50] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 md:col-span-2 flex items-start gap-2"><div class=flex-1><div class=cursor-pointer><div class="grid font-light text-sm col-span-2 content-start">'), Fs = /* @__PURE__ */ y('<div class="font-light text-sm py-2.5 px-4 flex items-start gap-3"><input class="appearance-none h-4 w-4 min-w-4 min-h-4 border border-gray-300 rounded bg-white mt-2.5 checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 bg-no-repeat bg-center bg-contain cursor-pointer"type=checkbox><input type=text class="flex-1 font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none">'), Bs = /* @__PURE__ */ y('<div class="font-light text-sm py-2.5 px-4 flex items-start gap-3 cursor-pointer"><input class="appearance-none h-4 w-4 min-w-4 min-h-4 border border-gray-300 rounded bg-white mt-0.5 checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 bg-no-repeat bg-center bg-contain cursor-pointer checked:disabled:bg-gray-500 checked:dark:disabled:bg-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"type=checkbox><span class=flex-1>'), Hs = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), Us = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Js = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="flex-1 text-justify">');
const Ws = (e) => {
  const [t] = tt(), n = e.config, [i] = j(n.formMode > 1 ? !0 : e.component.disableInput);
  let r = (v, u, w) => {
    let p = JSON.parse(JSON.stringify(e.value));
    if (e.value)
      if (e.value.some((_) => String(_.value) === String(v)))
        if (w) {
          let _ = o().findIndex((S) => S.value == v);
          p = p.filter((S) => S.value != v), o()[_].label !== u && p.push({
            value: v,
            label: u,
            open: !0
          });
        } else
          p = p.filter((_) => _.value != v);
      else
        p.splice(p.length, 0, {
          value: v,
          label: u
        });
    else
      p = [], p.push({
        value: v,
        label: u
      });
    e.onValueChange(p);
  }, a = (v) => {
    let u = "checkbox-" + e.component.dataKey + "-" + v;
    document.getElementById(u).click();
  }, l = (v) => e.value ? !!e.value.some((u) => String(u.value) === String(v)) : !1, s = (v) => {
    let u = e.value.findIndex((w) => String(w.value) === String(v));
    return e.value[u].label;
  }, c = Ce(() => {
    if (e.component.sourceOption !== void 0 && e.component.typeOption === 3) {
      let v = e.component.sourceOption.split("@");
      const u = t.details.findIndex((w) => w.dataKey === v[0]);
      return t.details[u].type, t.details[u].answer;
    }
    return [];
  });
  const [o] = j(e.component.sourceOption !== void 0 ? c() : e.component.options), [d, f] = j(!1), x = () => {
    d() ? f(!1) : f(!0);
  }, [$] = j(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [M] = j(n.formMode > 2 && e.comments == 0);
  return (() => {
    var v = zs(), u = v.firstChild, w = u.firstChild, p = w.firstChild, _ = w.nextSibling, S = u.nextSibling, O = S.firstChild, N = O.firstChild, m = N.firstChild;
    return k(w, g(P, {
      get when() {
        return e.component.required;
      },
      get children() {
        return Ps();
      }
    }), null), k(w, g(P, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var h = Ds();
        return h.$$click = x, h;
      }
    }), null), k(_, g(P, {
      get when() {
        return d();
      },
      get children() {
        var h = js();
        return V(() => h.innerHTML = e.component.hint), h;
      }
    })), k(m, g(ce, {
      get each() {
        return o();
      },
      children: (h, b) => g(me, {
        get children() {
          return [g(Q, {
            get when() {
              return ke(() => !!h.open)() && l(h.value);
            },
            get children() {
              var C = Fs(), L = C.firstChild, E = L.nextSibling;
              return L.addEventListener("change", (I) => r(I.currentTarget.value, h.label, h.open)), E.addEventListener("change", (I) => r(h.value, I.currentTarget.value, h.open)), V(() => U(L, "id", "checkbox-" + e.component.dataKey + "-" + b())), V(() => L.value = h.value), V(() => L.checked = h.value ? l(h.value) : !1), V(() => E.value = s(h.value)), C;
            }
          }), g(Q, {
            get when() {
              return !h.open || !l(h.value);
            },
            get children() {
              var C = Bs(), L = C.firstChild, E = L.nextSibling;
              return C.$$click = () => a(b()), L.addEventListener("change", (I) => r(I.currentTarget.value, h.label, h.open)), V((I) => {
                var R = i(), A = "checkbox-" + e.component.dataKey + "-" + b(), T = h.label;
                return R !== I.e && (L.disabled = I.e = R), A !== I.t && U(L, "id", I.t = A), T !== I.a && (E.innerHTML = I.a = T), I;
              }, {
                e: void 0,
                t: void 0,
                a: void 0
              }), V(() => L.value = h.value), V(() => L.checked = h.value ? l(h.value) : !1), C;
            }
          })];
        }
      })
    })), k(O, g(P, {
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
            var b = Js(), C = b.firstChild, L = C.firstChild;
            return k(C, g(me, {
              get children() {
                return [g(Q, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return Hs();
                  }
                }), g(Q, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return Us();
                  }
                })];
              }
            }), L), L.innerHTML = h, V((E) => Z(C, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, E)), b;
          })()
        });
      }
    }), null), k(S, g(P, {
      get when() {
        return $();
      },
      get children() {
        var h = Ks();
        return k(h, g(Ae, {
          get disabled() {
            return M();
          },
          onClick: () => e.openRemark(e.component.dataKey),
          get comments() {
            return e.comments;
          }
        })), h;
      }
    }), null), V((h) => {
      var b = e.component.label, C = {
        " border-b border-orange-500 pb-3 ": e.classValidation === 1,
        " border-b border-pink-600 pb-3 ": e.classValidation === 2
      }, L = e.component.cols === 1 || e.component.cols === void 0, E = e.component.cols === 2, I = e.component.cols === 3, R = e.component.cols === 4, A = e.component.cols === 5;
      return b !== h.e && (p.innerHTML = h.e = b), h.t = Z(N, C, h.t), L !== h.a && m.classList.toggle("grid-cols-1", h.a = L), E !== h.o && m.classList.toggle("grid-cols-2", h.o = E), I !== h.i && m.classList.toggle("grid-cols-3", h.i = I), R !== h.n && m.classList.toggle("grid-cols-4", h.n = R), A !== h.s && m.classList.toggle("grid-cols-5", h.s = A), h;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0,
      n: void 0,
      s: void 0
    }), v;
  })();
};
ge(["click"]);
var qs = /* @__PURE__ */ y("<span class=text-pink-600>*"), Gs = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Ys = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), wi = /* @__PURE__ */ y('<textarea class="w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400">'), Qs = /* @__PURE__ */ y("<div class=shrink-0>"), Zs = /* @__PURE__ */ y('<div class="grid md:grid-cols-3 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 md:col-span-2 flex items-start gap-2"><div class=flex-1>'), Xs = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), eo = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), to = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="flex-1 text-justify">');
const no = (e) => {
  const t = e.config, [n] = j(t.formMode > 1 ? !0 : e.component.disableInput), [i, r] = j(!1), a = () => {
    i() ? r(!1) : r(!0);
  }, [l] = j(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [s] = j(t.formMode > 2 && e.comments == 0);
  return (() => {
    var c = Zs(), o = c.firstChild, d = o.firstChild, f = d.firstChild, x = d.nextSibling, $ = o.nextSibling, M = $.firstChild;
    return k(d, g(P, {
      get when() {
        return e.component.required;
      },
      get children() {
        return qs();
      }
    }), null), k(d, g(P, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var v = Gs();
        return v.$$click = a, v;
      }
    }), null), k(x, g(P, {
      get when() {
        return i();
      },
      get children() {
        var v = Ys();
        return V(() => v.innerHTML = e.component.hint), v;
      }
    })), k(M, g(P, {
      get when() {
        return e.component.lengthInput === void 0;
      },
      get children() {
        var v = wi();
        return v.addEventListener("change", (u) => {
          e.onValueChange(u.currentTarget.value);
        }), V((u) => {
          var w = e.component.rows || 2, p = {
            " border border-solid border-gray-300 ": e.classValidation === 0,
            " border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
            " border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
          }, _ = n();
          return w !== u.e && U(v, "rows", u.e = w), u.t = Z(v, p, u.t), _ !== u.a && (v.disabled = u.a = _), u;
        }, {
          e: void 0,
          t: void 0,
          a: void 0
        }), V(() => v.value = e.value), v;
      }
    }), null), k(M, g(P, {
      get when() {
        return ke(() => e.component.lengthInput !== void 0)() && e.component.lengthInput.length > 0;
      },
      get children() {
        var v = wi();
        return v.addEventListener("change", (u) => {
          e.onValueChange(u.currentTarget.value);
        }), V((u) => {
          var w = e.component.rows || 2, p = {
            " border border-solid border-gray-300 ": e.classValidation === 0,
            " border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
            " border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
          }, _ = n(), S = e.component.lengthInput[0].maxlength !== void 0 ? e.component.lengthInput[0].maxlength : "", O = e.component.lengthInput[0].minlength !== void 0 ? e.component.lengthInput[0].minlength : "";
          return w !== u.e && U(v, "rows", u.e = w), u.t = Z(v, p, u.t), _ !== u.a && (v.disabled = u.a = _), S !== u.o && U(v, "maxlength", u.o = S), O !== u.i && U(v, "minlength", u.i = O), u;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0,
          i: void 0
        }), V(() => v.value = e.value), v;
      }
    }), null), k(M, g(P, {
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
            var u = to(), w = u.firstChild, p = w.firstChild;
            return k(w, g(me, {
              get children() {
                return [g(Q, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return Xs();
                  }
                }), g(Q, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return eo();
                  }
                })];
              }
            }), p), p.innerHTML = v, V((_) => Z(w, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, _)), u;
          })()
        });
      }
    }), null), k($, g(P, {
      get when() {
        return l();
      },
      get children() {
        var v = Qs();
        return k(v, g(Ae, {
          get disabled() {
            return s();
          },
          onClick: () => e.openRemark(e.component.dataKey),
          get comments() {
            return e.comments;
          }
        })), v;
      }
    }), null), V(() => f.innerHTML = e.component.label), c;
  })();
};
ge(["click"]);
var io = /* @__PURE__ */ y("<span class=text-pink-600>*"), ro = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), ao = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), lo = /* @__PURE__ */ y("<div class=shrink-0>"), so = /* @__PURE__ */ y('<div class="md:grid md:grid-cols-3 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 md:col-span-2 flex items-start gap-2"><div class=flex-1><input type=email placeholder>'), oo = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), co = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), uo = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="flex-1 text-justify">');
const Ir = (e) => {
  const t = e.config, [n] = j(t.formMode > 1 ? !0 : e.component.disableInput);
  let i = "w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400";
  const [r, a] = j(!1), l = () => {
    r() ? a(!1) : a(!0);
  }, [s] = j(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [c] = j(t.formMode > 2 && e.comments == 0);
  return (() => {
    var o = so(), d = o.firstChild, f = d.firstChild, x = f.firstChild, $ = f.nextSibling, M = d.nextSibling, v = M.firstChild, u = v.firstChild;
    return k(f, g(P, {
      get when() {
        return e.component.required;
      },
      get children() {
        return io();
      }
    }), null), k(f, g(P, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var w = ro();
        return w.$$click = l, w;
      }
    }), null), k($, g(P, {
      get when() {
        return r();
      },
      get children() {
        var w = ao();
        return V(() => w.innerHTML = e.component.hint), w;
      }
    })), u.addEventListener("change", (w) => {
      e.onValueChange(w.currentTarget.value);
    }), k(v, g(P, {
      get when() {
        var w;
        return ((w = e.validationMessage) == null ? void 0 : w.length) > 0;
      },
      get children() {
        return g(ce, {
          get each() {
            return e.validationMessage;
          },
          children: (w) => (() => {
            var p = uo(), _ = p.firstChild, S = _.firstChild;
            return k(_, g(me, {
              get children() {
                return [g(Q, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return oo();
                  }
                }), g(Q, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return co();
                  }
                })];
              }
            }), S), S.innerHTML = w, V((O) => Z(_, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, O)), p;
          })()
        });
      }
    }), null), k(M, g(P, {
      get when() {
        return s();
      },
      get children() {
        var w = lo();
        return k(w, g(Ae, {
          get disabled() {
            return c();
          },
          onClick: () => e.openRemark(e.component.dataKey),
          get comments() {
            return e.comments;
          }
        })), w;
      }
    }), null), V((w) => {
      var p = e.component.label, _ = e.component.dataKey, S = i + e.classValidation, O = {
        " border border-solid border-gray-300 ": e.classValidation === 0,
        " border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
        " border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
      }, N = n();
      return p !== w.e && (x.innerHTML = w.e = p), _ !== w.t && U(u, "name", w.t = _), S !== w.a && at(u, w.a = S), w.o = Z(u, O, w.o), N !== w.i && (u.disabled = w.i = N), w;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0
    }), V(() => u.value = e.value), o;
  })();
};
ge(["click"]);
var go = /* @__PURE__ */ y("<span class=text-pink-600>*"), ho = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), fo = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), mo = /* @__PURE__ */ y("<div class=shrink-0>"), vo = /* @__PURE__ */ y('<div class="md:grid md:grid-cols-3 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 md:col-span-2 flex items-start gap-2"><div class=flex-1><input type=url class="w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"placeholder>'), bo = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), wo = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), xo = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="flex-1 text-justify">');
const Er = (e) => {
  const t = e.config, [n] = j(t.formMode > 1 ? !0 : e.component.disableInput), [i, r] = j(!1), a = () => {
    i() ? r(!1) : r(!0);
  }, [l] = j(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [s] = j(t.formMode > 2 && e.comments == 0);
  return (() => {
    var c = vo(), o = c.firstChild, d = o.firstChild, f = d.firstChild, x = d.nextSibling, $ = o.nextSibling, M = $.firstChild, v = M.firstChild;
    return k(d, g(P, {
      get when() {
        return e.component.required;
      },
      get children() {
        return go();
      }
    }), null), k(d, g(P, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var u = ho();
        return u.$$click = a, u;
      }
    }), null), k(x, g(P, {
      get when() {
        return i();
      },
      get children() {
        var u = fo();
        return V(() => u.innerHTML = e.component.hint), u;
      }
    })), v.addEventListener("change", (u) => {
      e.onValueChange(u.currentTarget.value);
    }), k(M, g(P, {
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
            var w = xo(), p = w.firstChild, _ = p.firstChild;
            return k(p, g(me, {
              get children() {
                return [g(Q, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return bo();
                  }
                }), g(Q, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return wo();
                  }
                })];
              }
            }), _), _.innerHTML = u, V((S) => Z(p, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, S)), w;
          })()
        });
      }
    }), null), k($, g(P, {
      get when() {
        return l();
      },
      get children() {
        var u = mo();
        return k(u, g(Ae, {
          get disabled() {
            return s();
          },
          onClick: () => e.openRemark(e.component.dataKey),
          get comments() {
            return e.comments;
          }
        })), u;
      }
    }), null), V((u) => {
      var w = e.component.label, p = e.component.dataKey, _ = {
        " border border-solid border-gray-300 ": e.classValidation === 0,
        " border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
        " border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
      }, S = n();
      return w !== u.e && (f.innerHTML = u.e = w), p !== u.t && U(v, "name", u.t = p), u.a = Z(v, _, u.a), S !== u.o && (v.disabled = u.o = S), u;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0
    }), V(() => v.value = e.value), c;
  })();
};
ge(["click"]);
var yo = /* @__PURE__ */ y("<span class=text-pink-600>*"), po = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), ko = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), $o = /* @__PURE__ */ y('<span class="absolute top-0 right-0 inline-flex items-center justify-center h-6 w-6 text-xs font-semibold text-white transform translate-x-1/2 -translate-y-1/4 bg-pink-600/80 rounded-full">'), _o = /* @__PURE__ */ y('<div class=shrink-0><button class="relative inline-block bg-white p-2 h-10 w-10 text-gray-500 rounded-full hover:bg-yellow-100 hover:text-yellow-400 hover:border-yellow-100 border-2 border-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z">'), So = /* @__PURE__ */ y('<div class="md:grid md:grid-cols-3 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 md:col-span-2 flex items-start gap-2"><div class=flex-1><input type=date class="w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"placeholder>'), Co = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), Mo = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Io = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="flex-1 text-justify">');
const Eo = (e) => {
  const t = e.config, [n] = j(t.formMode > 1 ? !0 : e.component.disableInput), [i, r] = j(!1), a = () => {
    i() ? r(!1) : r(!0);
  }, [l] = j(t.formMode > 2 && e.comments == 0), [s] = j(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0);
  let c = /* @__PURE__ */ new Date(), o = String(c.getDate()), d = String(c.getMonth() + 1), f = String(c.getFullYear());
  Number(o) < 10 && (o = "0" + o), Number(d) < 10 && (d = "0" + d);
  let x = f + "-" + d + "-" + o, $, M;
  return Ce(() => {
    e.component.rangeInput && ($ = e.component.rangeInput[0].min !== void 0 ? e.component.rangeInput[0].min === "today" ? x : e.component.rangeInput[0].min : "", M = e.component.rangeInput[0].max !== void 0 ? e.component.rangeInput[0].max === "today" ? x : e.component.rangeInput[0].max : "");
  }), (() => {
    var v = So(), u = v.firstChild, w = u.firstChild, p = w.firstChild, _ = w.nextSibling, S = u.nextSibling, O = S.firstChild, N = O.firstChild;
    return k(w, g(P, {
      get when() {
        return e.component.required;
      },
      get children() {
        return yo();
      }
    }), null), k(w, g(P, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var m = po();
        return m.$$click = a, m;
      }
    }), null), k(_, g(P, {
      get when() {
        return i();
      },
      get children() {
        var m = ko();
        return V(() => m.innerHTML = e.component.hint), m;
      }
    })), N.addEventListener("change", (m) => {
      e.onValueChange(m.currentTarget.value);
    }), U(N, "min", $), U(N, "max", M), k(O, g(P, {
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
            var h = Io(), b = h.firstChild, C = b.firstChild;
            return k(b, g(me, {
              get children() {
                return [g(Q, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return Co();
                  }
                }), g(Q, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return Mo();
                  }
                })];
              }
            }), C), C.innerHTML = m, V((L) => Z(b, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, L)), h;
          })()
        });
      }
    }), null), k(S, g(P, {
      get when() {
        return s();
      },
      get children() {
        var m = _o(), h = m.firstChild;
        return h.firstChild, h.$$click = (b) => e.openRemark(e.component.dataKey), k(h, g(P, {
          get when() {
            return ke(() => !!e.comments)() && e.comments > 0;
          },
          get children() {
            var b = $o();
            return k(b, () => e.comments), b;
          }
        }), null), V(() => h.disabled = l()), m;
      }
    }), null), V((m) => {
      var h = e.component.label, b = e.component.dataKey, C = {
        " border border-solid border-gray-300 ": e.classValidation === 0,
        " border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
        " border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
      }, L = n();
      return h !== m.e && (p.innerHTML = m.e = h), b !== m.t && U(N, "name", m.t = b), m.a = Z(N, C, m.a), L !== m.o && (N.disabled = m.o = L), m;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0
    }), V(() => N.value = e.value), v;
  })();
};
ge(["click"]);
var Lo = /* @__PURE__ */ y("<span class=text-pink-600>*"), Oo = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Ao = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), Ro = /* @__PURE__ */ y('<span class="absolute top-0 right-0 inline-flex items-center justify-center h-6 w-6 text-xs font-semibold text-white transform translate-x-1/2 -translate-y-1/4 bg-pink-600/80 rounded-full">'), Vo = /* @__PURE__ */ y('<div class=shrink-0><button class="relative inline-block bg-white p-2 h-10 w-10 text-gray-500 rounded-full hover:bg-yellow-100 hover:text-yellow-400 hover:border-yellow-100 border-2 border-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z">'), No = /* @__PURE__ */ y('<div class="md:grid md:grid-cols-3 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 md:col-span-2 flex items-start gap-2"><div class=flex-1><input type=datetime-local class="w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"placeholder>'), To = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), Po = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Do = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="flex-1 text-justify">');
const jo = (e) => {
  const t = e.config, [n] = j(t.formMode > 1 ? !0 : e.component.disableInput), [i, r] = j(!1), a = () => {
    i() ? r(!1) : r(!0);
  }, [l] = j(t.formMode > 2 && e.comments == 0), [s] = j(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0);
  let c = /* @__PURE__ */ new Date(), o = String(c.getDate()), d = String(c.getMonth() + 1), f = String(c.getFullYear());
  Number(o) < 10 && (o = "0" + o), Number(d) < 10 && (d = "0" + d);
  let x = f + "-" + d + "-" + o, $, M;
  return Ce(() => {
    e.component.rangeInput && ($ = e.component.rangeInput[0].min !== void 0 ? e.component.rangeInput[0].min === "today" ? x : e.component.rangeInput[0].min : "", M = e.component.rangeInput[0].max !== void 0 ? e.component.rangeInput[0].max === "today" ? x : e.component.rangeInput[0].max : "");
  }), (() => {
    var v = No(), u = v.firstChild, w = u.firstChild, p = w.firstChild, _ = w.nextSibling, S = u.nextSibling, O = S.firstChild, N = O.firstChild;
    return k(w, g(P, {
      get when() {
        return e.component.required;
      },
      get children() {
        return Lo();
      }
    }), null), k(w, g(P, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var m = Oo();
        return m.$$click = a, m;
      }
    }), null), k(_, g(P, {
      get when() {
        return i();
      },
      get children() {
        var m = Ao();
        return V(() => m.innerHTML = e.component.hint), m;
      }
    })), N.addEventListener("change", (m) => {
      e.onValueChange(m.currentTarget.value);
    }), U(N, "min", $ + "T00:00"), U(N, "max", M + "T23:59"), k(O, g(P, {
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
            var h = Do(), b = h.firstChild, C = b.firstChild;
            return k(b, g(me, {
              get children() {
                return [g(Q, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return To();
                  }
                }), g(Q, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return Po();
                  }
                })];
              }
            }), C), C.innerHTML = m, V((L) => Z(b, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, L)), h;
          })()
        });
      }
    }), null), k(S, g(P, {
      get when() {
        return s();
      },
      get children() {
        var m = Vo(), h = m.firstChild;
        return h.firstChild, h.$$click = (b) => e.openRemark(e.component.dataKey), k(h, g(P, {
          get when() {
            return ke(() => !!e.comments)() && e.comments > 0;
          },
          get children() {
            var b = Ro();
            return k(b, () => e.comments), b;
          }
        }), null), V(() => h.disabled = l()), m;
      }
    }), null), V((m) => {
      var h = e.component.label, b = e.component.dataKey, C = {
        " border border-solid border-gray-300 ": e.classValidation === 0,
        " border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
        " border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
      }, L = n();
      return h !== m.e && (p.innerHTML = m.e = h), b !== m.t && U(N, "name", m.t = b), m.a = Z(N, C, m.a), L !== m.o && (N.disabled = m.o = L), m;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0
    }), V(() => N.value = e.value), v;
  })();
};
ge(["click"]);
var Ko = /* @__PURE__ */ y("<span class=text-pink-600>*"), zo = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Fo = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), Bo = /* @__PURE__ */ y("<div class=shrink-0>"), Ho = /* @__PURE__ */ y('<div class="grid md:grid-cols-3 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 md:col-span-2 flex items-start gap-2"><div class=flex-1><input type=time class="w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"placeholder>'), Uo = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), Jo = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Wo = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="flex-1 text-justify">');
const Lr = (e) => {
  const t = e.config, [n] = j(t.formMode > 1 ? !0 : e.component.disableInput), [i, r] = j(!1), a = () => {
    i() ? r(!1) : r(!0);
  }, [l] = j(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [s] = j(t.formMode > 2 && e.comments == 0);
  return (() => {
    var c = Ho(), o = c.firstChild, d = o.firstChild, f = d.firstChild, x = d.nextSibling, $ = o.nextSibling, M = $.firstChild, v = M.firstChild;
    return k(d, g(P, {
      get when() {
        return e.component.required;
      },
      get children() {
        return Ko();
      }
    }), null), k(d, g(P, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var u = zo();
        return u.$$click = a, u;
      }
    }), null), k(x, g(P, {
      get when() {
        return i();
      },
      get children() {
        var u = Fo();
        return V(() => u.innerHTML = e.component.hint), u;
      }
    })), v.addEventListener("change", (u) => {
      e.onValueChange(u.currentTarget.value);
    }), k(M, g(P, {
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
            var w = Wo(), p = w.firstChild, _ = p.firstChild;
            return k(p, g(me, {
              get children() {
                return [g(Q, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return Uo();
                  }
                }), g(Q, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return Jo();
                  }
                })];
              }
            }), _), _.innerHTML = u, V((S) => Z(p, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, S)), w;
          })()
        });
      }
    }), null), k($, g(P, {
      get when() {
        return l();
      },
      get children() {
        var u = Bo();
        return k(u, g(Ae, {
          get disabled() {
            return s();
          },
          onClick: () => e.openRemark(e.component.dataKey),
          get comments() {
            return e.comments;
          }
        })), u;
      }
    }), null), V((u) => {
      var w = e.component.label, p = e.component.dataKey, _ = {
        " border border-solid border-gray-300 ": e.classValidation === 0,
        " border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
        " border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
      }, S = n();
      return w !== u.e && (f.innerHTML = u.e = w), p !== u.t && U(v, "name", u.t = p), u.a = Z(v, _, u.a), S !== u.o && (v.disabled = u.o = S), u;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0
    }), V(() => v.value = e.value), c;
  })();
};
ge(["click"]);
var qo = /* @__PURE__ */ y("<span class=text-pink-600>*"), Go = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Yo = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), Qo = /* @__PURE__ */ y("<div class=shrink-0>"), Zo = /* @__PURE__ */ y('<div class="md:grid md:grid-cols-3 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 md:col-span-2 flex items-start gap-2"><div class=flex-1><input type=month class="w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"placeholder>'), Xo = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), ed = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), td = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="flex-1 text-justify">');
const Or = (e) => {
  const t = e.config, [n] = j(t.formMode > 1 ? !0 : e.component.disableInput), [i, r] = j(!1), a = () => {
    i() ? r(!1) : r(!0);
  }, [l] = j(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [s] = j(t.formMode > 2 && e.comments == 0);
  return (() => {
    var c = Zo(), o = c.firstChild, d = o.firstChild, f = d.firstChild, x = d.nextSibling, $ = o.nextSibling, M = $.firstChild, v = M.firstChild;
    return k(d, g(P, {
      get when() {
        return e.component.required;
      },
      get children() {
        return qo();
      }
    }), null), k(d, g(P, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var u = Go();
        return u.$$click = a, u;
      }
    }), null), k(x, g(P, {
      get when() {
        return i();
      },
      get children() {
        var u = Yo();
        return V(() => u.innerHTML = e.component.hint), u;
      }
    })), v.addEventListener("change", (u) => {
      e.onValueChange(u.currentTarget.value);
    }), k(M, g(P, {
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
            var w = td(), p = w.firstChild, _ = p.firstChild;
            return k(p, g(me, {
              get children() {
                return [g(Q, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return Xo();
                  }
                }), g(Q, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return ed();
                  }
                })];
              }
            }), _), _.innerHTML = u, V((S) => Z(p, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, S)), w;
          })()
        });
      }
    }), null), k($, g(P, {
      get when() {
        return l();
      },
      get children() {
        var u = Qo();
        return k(u, g(Ae, {
          get disabled() {
            return s();
          },
          onClick: () => e.openRemark(e.component.dataKey),
          get comments() {
            return e.comments;
          }
        })), u;
      }
    }), null), V((u) => {
      var w = e.component.label, p = e.component.dataKey, _ = {
        " border border-solid border-gray-300 ": e.classValidation === 0,
        " border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
        " border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
      }, S = n();
      return w !== u.e && (f.innerHTML = u.e = w), p !== u.t && U(v, "name", u.t = p), u.a = Z(v, _, u.a), S !== u.o && (v.disabled = u.o = S), u;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0
    }), V(() => v.value = e.value), c;
  })();
};
ge(["click"]);
var nd = /* @__PURE__ */ y("<span class=text-pink-600>*"), id = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), rd = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), ad = /* @__PURE__ */ y("<div class=shrink-0>"), ld = /* @__PURE__ */ y('<div class="md:grid md:grid-cols-3 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 md:col-span-2 flex items-start gap-2"><div class=flex-1><input type=week class="w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"placeholder>'), sd = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), od = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), dd = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="flex-1 text-justify">');
const Ar = (e) => {
  const t = e.config, [n] = j(t.formMode > 1 ? !0 : e.component.disableInput), [i, r] = j(!1), a = () => {
    i() ? r(!1) : r(!0);
  }, [l] = j(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [s] = j(t.formMode > 2 && e.comments == 0);
  return (() => {
    var c = ld(), o = c.firstChild, d = o.firstChild, f = d.firstChild, x = d.nextSibling, $ = o.nextSibling, M = $.firstChild, v = M.firstChild;
    return k(d, g(P, {
      get when() {
        return e.component.required;
      },
      get children() {
        return nd();
      }
    }), null), k(d, g(P, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var u = id();
        return u.$$click = a, u;
      }
    }), null), k(x, g(P, {
      get when() {
        return i();
      },
      get children() {
        var u = rd();
        return V(() => u.innerHTML = e.component.hint), u;
      }
    })), v.addEventListener("change", (u) => {
      e.onValueChange(u.currentTarget.value);
    }), k(M, g(P, {
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
            var w = dd(), p = w.firstChild, _ = p.firstChild;
            return k(p, g(me, {
              get children() {
                return [g(Q, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return sd();
                  }
                }), g(Q, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return od();
                  }
                })];
              }
            }), _), _.innerHTML = u, V((S) => Z(p, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, S)), w;
          })()
        });
      }
    }), null), k($, g(P, {
      get when() {
        return l();
      },
      get children() {
        var u = ad();
        return k(u, g(Ae, {
          get disabled() {
            return s();
          },
          onClick: () => e.openRemark(e.component.dataKey),
          get comments() {
            return e.comments;
          }
        })), u;
      }
    }), null), V((u) => {
      var w = e.component.label, p = e.component.dataKey, _ = {
        " border border-solid border-gray-300 ": e.classValidation === 0,
        " border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
        " border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
      }, S = n();
      return w !== u.e && (f.innerHTML = u.e = w), p !== u.t && U(v, "name", u.t = p), u.a = Z(v, _, u.a), S !== u.o && (v.disabled = u.o = S), u;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0
    }), V(() => v.value = e.value), c;
  })();
};
ge(["click"]);
var cd = /* @__PURE__ */ y("<span class=text-pink-600>*"), ud = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), gd = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), hd = /* @__PURE__ */ y('<div class="border-b border-gray-300/[.50] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm py-2.5 px-2"><div><div class="flex items-start gap-2"><input class="appearance-none h-5 w-5 min-w-5 min-h-5 border-2 mt-0.5 shrink-0 border-gray-300 rounded bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 bg-no-repeat bg-center bg-contain cursor-pointer"type=checkbox><div class=flex-1><div class="inline-flex space-x-2 flex-wrap"><div class=cursor-pointer></div></div></div></div><div class="flex mt-2 ml-7">'), fd = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), md = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), vd = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class=text-justify>');
const Rr = (e) => {
  const t = e.config, [n] = j(t.formMode > 1 ? !0 : e.component.disableInput), [i, r] = j(e.value !== "" ? e.value : !1), [a, l] = j(!1), s = () => {
    a() ? l(!1) : l(!0);
  };
  let c = () => {
    let o = "singlecheck-" + e.component.dataKey + "_id";
    document.getElementById(o).click();
  };
  return (() => {
    var o = hd(), d = o.firstChild, f = d.firstChild, x = f.firstChild, $ = x.firstChild, M = $.nextSibling, v = M.firstChild, u = v.firstChild, w = x.nextSibling;
    return $.addEventListener("change", (p) => {
      r(p.target.checked), e.onValueChange(p.target.checked);
    }), u.$$click = (p) => c(), k(v, g(P, {
      get when() {
        return e.component.required;
      },
      get children() {
        return cd();
      }
    }), null), k(v, g(P, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var p = ud();
        return p.$$click = s, p;
      }
    }), null), k(w, g(P, {
      get when() {
        return a();
      },
      get children() {
        var p = gd();
        return V(() => p.innerHTML = e.component.hint), p;
      }
    })), k(d, g(P, {
      get when() {
        var p;
        return ((p = e.validationMessage) == null ? void 0 : p.length) > 0;
      },
      get children() {
        return g(ce, {
          get each() {
            return e.validationMessage;
          },
          children: (p) => (() => {
            var _ = vd(), S = _.firstChild, O = S.firstChild;
            return k(S, g(me, {
              get children() {
                return [g(Q, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return fd();
                  }
                }), g(Q, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return md();
                  }
                })];
              }
            }), O), O.innerHTML = p, V((N) => Z(S, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, N)), _;
          })()
        });
      }
    }), null), V((p) => {
      var _ = {
        " border-b border-orange-500 pb-3 ": e.classValidation === 1,
        " border-b border-pink-600 pb-3 ": e.classValidation === 2
      }, S = "singlecheck-" + e.component.dataKey + "_id", O = n(), N = e.component.label;
      return p.e = Z(f, _, p.e), S !== p.t && U($, "id", p.t = S), O !== p.a && ($.disabled = p.a = O), N !== p.o && (u.innerHTML = p.o = N), p;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0
    }), V(() => $.checked = i() === !0), o;
  })();
};
ge(["click"]);
var bd = /* @__PURE__ */ y("<span class=text-pink-600>*"), wd = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), xd = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), yd = /* @__PURE__ */ y('<div class="grid md:grid-cols-8 grid-cols-8 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2 col-span-7"><div><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div></div><div class="font-light text-sm space-x-2 py-2.5 px-2 flex justify-end"><button type=button class="relative inline-flex flex-shrink-0 h-7 w-12 border border-gray-300 rounded-full cursor-pointer shadow transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"><span class="relative inline-block h-6 w-6 ring-0 rounded-full transform bg-white shadow transition duration-200 ease-in-out pointer-events-none"><span class="absolute inset-0 h-full w-full flex justify-center items-center transition-opacity"><svg class="h-3 w-3 text-gray-400"fill=none viewBox="0 0 12 12"><path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round></path></svg></span><span class=" absolute inset-0 h-full w-full flex items-center justify-center transition-opacity "><svg class="h-3 w-3 text-blue-600"fill=currentColor viewBox="0 0 12 12"><path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z">'), pd = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), kd = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), $d = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="flex-1 text-justify">');
const Vr = (e) => {
  const t = e.config, [n] = j(t.formMode > 1 ? !0 : e.component.disableInput), [i, r] = j(e.value !== "" ? e.value : !1), [a, l] = j(!1), s = () => {
    a() ? l(!1) : l(!0);
  };
  let c = () => {
    let o = "toggle-" + e.component.dataKey + "_id";
    document.getElementById(o).click();
  };
  return (() => {
    var o = yd(), d = o.firstChild, f = d.firstChild, x = f.firstChild, $ = x.firstChild, M = x.nextSibling, v = d.nextSibling, u = v.firstChild, w = u.firstChild, p = w.firstChild, _ = p.nextSibling;
    return $.$$click = (S) => c(), k(x, g(P, {
      get when() {
        return e.component.required;
      },
      get children() {
        return bd();
      }
    }), null), k(x, g(P, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var S = wd();
        return S.$$click = s, S;
      }
    }), null), k(M, g(P, {
      get when() {
        return a();
      },
      get children() {
        var S = xd();
        return V(() => S.innerHTML = e.component.hint), S;
      }
    })), k(d, g(P, {
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
            var O = $d(), N = O.firstChild, m = N.firstChild;
            return k(N, g(me, {
              get children() {
                return [g(Q, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return pd();
                  }
                }), g(Q, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return kd();
                  }
                })];
              }
            }), m), m.innerHTML = S, V((h) => Z(N, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, h)), O;
          })()
        });
      }
    }), null), u.$$click = (S) => {
      const O = !i();
      r(O), e.onValueChange(O);
    }, V((S) => {
      var O = {
        " border-b border-orange-500 pb-3 ": e.classValidation === 1,
        " border-b border-pink-600 pb-3 ": e.classValidation === 2
      }, N = e.component.label, m = i() === !0, h = i() === !1, b = "toggle-" + e.component.dataKey + "_id", C = n(), L = i() === !0, E = i() === !1, I = {
        "opacity-0 ease-out duration-100": i() === !0,
        "opacity-100 ease-in duration-200": i() === !1
      }, R = {
        "opacity-100 ease-in duration-200": i() === !0,
        "opacity-0 ease-out duration-100": i() === !1
      };
      return S.e = Z(f, O, S.e), N !== S.t && ($.innerHTML = S.t = N), m !== S.a && u.classList.toggle("bg-blue-600", S.a = m), h !== S.o && u.classList.toggle("bg-gray-200", S.o = h), b !== S.i && U(u, "id", S.i = b), C !== S.n && (u.disabled = S.n = C), L !== S.s && w.classList.toggle("translate-x-5", S.s = L), E !== S.h && w.classList.toggle("translate-x-0", S.h = E), S.r = Z(p, I, S.r), S.d = Z(_, R, S.d), S;
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
ge(["click"]);
var _d = /* @__PURE__ */ y("<span class=text-pink-600>*"), Sd = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Cd = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), Md = /* @__PURE__ */ y("<div class=shrink-0>"), Id = /* @__PURE__ */ y('<div class="md:grid md:grid-cols-3 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 md:col-span-2 flex items-start gap-2"><div class=flex-1><div class=" grid grid-cols-12"><div class=col-span-10><input type=range class="form-range w-full font-light px-2 text-sm text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"></div><div class="col-span-1 text-center">'), Ed = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), Ld = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Od = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="flex-1 text-justify">');
const Ad = (e) => {
  const t = e.config, [n] = j(t.formMode > 1 ? !0 : e.component.disableInput), [i, r] = j(!1), a = () => {
    i() ? r(!1) : r(!0);
  }, [l] = j(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [s] = j(t.formMode > 2 && e.comments == 0);
  return (() => {
    var c = Id(), o = c.firstChild, d = o.firstChild, f = d.firstChild, x = d.nextSibling, $ = o.nextSibling, M = $.firstChild, v = M.firstChild, u = v.firstChild, w = u.firstChild, p = u.nextSibling;
    return k(d, g(P, {
      get when() {
        return e.component.required;
      },
      get children() {
        return _d();
      }
    }), null), k(d, g(P, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var _ = Sd();
        return _.$$click = a, _;
      }
    }), null), k(x, g(P, {
      get when() {
        return i();
      },
      get children() {
        var _ = Cd();
        return V(() => _.innerHTML = e.component.hint), _;
      }
    })), w.addEventListener("change", (_) => e.onValueChange(_.currentTarget.value)), k(p, () => e.value || 0), k(M, g(P, {
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
            var S = Od(), O = S.firstChild, N = O.firstChild;
            return k(O, g(me, {
              get children() {
                return [g(Q, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return Ed();
                  }
                }), g(Q, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return Ld();
                  }
                })];
              }
            }), N), N.innerHTML = _, V((m) => Z(O, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, m)), S;
          })()
        });
      }
    }), null), k($, g(P, {
      get when() {
        return l();
      },
      get children() {
        var _ = Md();
        return k(_, g(Ae, {
          get disabled() {
            return s();
          },
          onClick: () => e.openRemark(e.component.dataKey),
          get comments() {
            return e.comments;
          }
        })), _;
      }
    }), null), V((_) => {
      var S = e.component.label, O = {
        " border-b border-orange-500 pb-5 ": e.classValidation === 1,
        " border-b border-pink-600 pb-5 ": e.classValidation === 2
      }, N = e.component.rangeInput[0].min, m = e.component.rangeInput[0].max, h = e.component.rangeInput[0].step, b = n();
      return S !== _.e && (f.innerHTML = _.e = S), _.t = Z(v, O, _.t), N !== _.a && U(w, "min", _.a = N), m !== _.o && U(w, "max", _.o = m), h !== _.i && U(w, "step", _.i = h), b !== _.n && (w.disabled = _.n = b), _;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0,
      n: void 0
    }), V(() => w.value = e.value || 0), c;
  })();
};
ge(["click"]);
var Rd = /* @__PURE__ */ y("<div>");
const Nr = (e) => {
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
    var n = Rd(), i = t;
    return typeof i == "function" ? ct(i, n) : t = n, n;
  })();
};
function Vd(e, t) {
  let n;
  const i = () => clearTimeout(n);
  return pn(i), Object.assign(function(...a) {
    n !== void 0 && i(), n = setTimeout(() => e(...a), t);
  }, { clear: i });
}
var Wn = Vd, Nd = /* @__PURE__ */ y("<span class=text-pink-600>*"), Td = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Pd = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), Dd = /* @__PURE__ */ y("<div class=shrink-0>"), jd = /* @__PURE__ */ y('<div class="grid md:grid-cols-3 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 md:col-span-2 flex items-start gap-2"><div class=flex-1><input type=text class="w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"placeholder>'), Kd = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), zd = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Fd = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="flex-1 text-justify">');
const Bd = (e) => {
  const t = e.config, [n] = j(t.formMode > 1 ? !0 : e.component.disableInput);
  let i = (x) => {
    let $ = String.fromCharCode(x.charCode ? x.charCode : x.which), M = e.component.separatorFormat === "id-ID" ? /^\d{1,99}(?:\,\d{0,10})?$/ : /^\d{1,99}(?:\.\d{0,10})?$/, v = document.getElementById("currencyInput" + e.index).value, u = a(v);
    M.test(u + $) || (x.preventDefault ? x.preventDefault() : x.returnValue = !1);
  }, r = Wn((x) => {
    let $ = a(x), M = e.component.separatorFormat === "id-ID" ? $.replace(",", ".") : $;
    e.onValueChange(M);
  }, 1500), a = (x) => {
    let $, M;
    return e.component.separatorFormat === "id-ID" ? ($ = e.component.isDecimal ? x.indexOf(",00") != -1 ? x.substring(0, x.indexOf(",00")) : x : x.indexOf(",") != -1 ? x.substring(0, x.indexOf(",")) : x, M = "0123456789,") : e.component.separatorFormat === "en-US" && ($ = e.component.isDecimal ? x.indexOf(".00") != -1 ? x.substring(0, x.indexOf(".00")) : x : x.indexOf(".") != -1 ? x.substring(0, x.indexOf(".")) : x, M = "0123456789."), Array.from($).filter((v) => M.includes(v)).join("");
  }, l = Number(e.value).toLocaleString(e.component.separatorFormat, {
    style: "currency",
    currency: e.component.currency,
    minimumFractionDigits: 0
  });
  const [s, c] = j(!1), o = () => {
    s() ? c(!1) : c(!0);
  }, [d] = j(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [f] = j(t.formMode > 2 && e.comments == 0);
  return (() => {
    var x = jd(), $ = x.firstChild, M = $.firstChild, v = M.firstChild, u = M.nextSibling, w = $.nextSibling, p = w.firstChild, _ = p.firstChild;
    return k(M, g(P, {
      get when() {
        return e.component.required;
      },
      get children() {
        return Nd();
      }
    }), null), k(M, g(P, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var S = Td();
        return S.$$click = o, S;
      }
    }), null), k(u, g(P, {
      get when() {
        return s();
      },
      get children() {
        var S = Pd();
        return V(() => S.innerHTML = e.component.hint), S;
      }
    })), _.$$keyup = (S) => r(S.currentTarget.value), _.addEventListener("keypress", (S) => i(S)), k(p, g(P, {
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
            var O = Fd(), N = O.firstChild, m = N.firstChild;
            return k(N, g(me, {
              get children() {
                return [g(Q, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return Kd();
                  }
                }), g(Q, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return zd();
                  }
                })];
              }
            }), m), m.innerHTML = S, V((h) => Z(N, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, h)), O;
          })()
        });
      }
    }), null), k(w, g(P, {
      get when() {
        return d();
      },
      get children() {
        var S = Dd();
        return k(S, g(Ae, {
          get disabled() {
            return f();
          },
          onClick: () => e.openRemark(e.component.dataKey),
          get comments() {
            return e.comments;
          }
        })), S;
      }
    }), null), V((S) => {
      var O = e.component.label, N = e.component.dataKey, m = {
        " border border-solid border-gray-300 ": e.classValidation === 0,
        " border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
        " border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
      }, h = n(), b = "currencyInput" + e.index, C = e.component.rangeInput && e.component.rangeInput[0].max !== void 0 ? e.component.rangeInput[0].max : "", L = e.component.rangeInput && e.component.rangeInput[0].min !== void 0 ? e.component.rangeInput[0].min : "";
      return O !== S.e && (v.innerHTML = S.e = O), N !== S.t && U(_, "name", S.t = N), S.a = Z(_, m, S.a), h !== S.o && (_.disabled = S.o = h), b !== S.i && U(_, "id", S.i = b), C !== S.n && U(_, "max", S.n = C), L !== S.s && U(_, "min", S.s = L), S;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0,
      n: void 0,
      s: void 0
    }), V(() => _.value = e.component.separatorFormat === "id-ID" ? l.replace(",00", "") : l.replace("IDR", "Rp")), x;
  })();
};
ge(["click", "keyup"]);
var Hd = /* @__PURE__ */ y('<div class="modal-delete fixed z-10 inset-0 overflow-y-auto"aria-labelledby=modal-title role=dialog aria-modal=true><div class="flex items-center justify-center min-h-screen pt-4 px-4 text-center sm:block sm:p-0"><div class="fixed inset-0 bg-gray-500/75 transition-opacity"aria-hidden=true></div><span class="hidden sm:inline-block sm:align-middle sm:h-screen"aria-hidden=true>&#8203;</span><div class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"><div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4"><div class="sm:flex sm:items-start"><div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"><svg class="h-6 w-6 text-red-600"xmlns=http://www.w3.org/2000/svg fill=none viewBox="0 0 24 24"stroke=currentColor aria-hidden=true><path stroke-linecap=round stroke-linejoin=round stroke-width=2 d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg></div><div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left"><h3 class="text-lg leading-6 font-medium text-gray-900"id=titleModalDelete>Deactivate account</h3><div class=mt-2><p class="text-sm text-gray-500"id=contentModalDelete>Are you sure you want to deactivate your account? All of your data will be permanently removed. This action cannot be undonssse.</p></div></div></div></div><div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"><button type=button class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">Delete</button><button type=button class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Cancel'), Ud = /* @__PURE__ */ y("<span class=text-pink-600>*"), Jd = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Wd = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), qd = /* @__PURE__ */ y('<div class="grid grid-cols-12 "><div class="col-span-10 mr-2"><input type=text class="w-full font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"></div><div class="col-span-2 flex justify-evenly p-1 space-x-1 "><button class="bg-teal-400 text-white p-2 rounded-full focus:outline-none hover:bg-teal-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"viewBox="0 0 20 20"fill=currentColor><path fill-rule=evenodd d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"clip-rule=evenodd></path></svg></button><button class="bg-gray-500 text-white p-2 rounded-full focus:outline-none hover:bg-gray-400 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"viewBox="0 0 20 20"fill=currentColor><path fill-rule=evenodd d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"clip-rule=evenodd>'), Gd = /* @__PURE__ */ y('<div><div class="grid grid-cols-6 p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2 col-span-5"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm space-x-2 pt-2.5 px-2 flex justify-end "><button class="bg-pink-600 text-white p-2 rounded-full focus:outline-none h-10 w-10 hover:bg-pink-500 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-6 w-6"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 4v16m8-8H4"></path></svg></button></div></div><div class="grid md:grid-cols-12 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm pb-2.5 px-2 col-start-2 col-end-12 space-y-4 transition-all delay-100"></div><div class=col-span-12></div><div class="col-span-12 pb-4">'), Yd = /* @__PURE__ */ y('<div class="grid grid-cols-12"><div class="col-span-10 mr-2"><input type=text class="w-full font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"></div><div class="col-span-2 flex justify-evenly p-1 space-x-1 "><button class="bg-teal-400 text-white p-2 rounded-full focus:outline-none hover:bg-teal-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"viewBox="0 0 20 20"fill=currentColor><path fill-rule=evenodd d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"clip-rule=evenodd></path></svg></button><button class="bg-gray-500 text-white p-2 rounded-full focus:outline-none hover:bg-gray-400 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"viewBox="0 0 20 20"fill=currentColor><path fill-rule=evenodd d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"clip-rule=evenodd>'), Qd = /* @__PURE__ */ y('<div class="grid grid-cols-12"><div class="col-span-10 mr-2"><input type=text class="w-full font-light px-4 py-2.5 text-sm text-gray-700 bg-gray-200 bg-clip-padding dark:bg-gray-300 border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"disabled></div><div class="col-span-2 flex justify-evenly p-1 space-x-1 "><button class="bg-orange-400 text-white p-2 rounded-full focus:outline-none hover:bg-orange-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"viewBox="0 0 20 20"fill=currentColor><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg></button><button class="bg-red-600 text-white p-2 rounded-full focus:outline-none hover:bg-red-500 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"viewBox="0 0 20 20"fill=currentColor><path fill-rule=evenodd d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"clip-rule=evenodd>'), Zd = /* @__PURE__ */ y('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), Xd = /* @__PURE__ */ y('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), ec = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="grid grid-cols-12"><div class="col-span-11 text-justify mr-1">');
const Tr = (e) => {
  const [t] = nt(), [n, i] = j(0), [r, a] = j(0), [l, s] = j(JSON.parse(JSON.stringify(e.value))), [c, o] = j(""), d = e.config, [f] = j(d.formMode > 1 ? !0 : e.component.disableInput);
  let x = Ce(() => {
    const m = e.value[0].label.split("#");
    return Number(m[1]);
  }), $ = () => {
    n() === 0 && r() === 0 ? (i(1), a(0)) : je(t.details.language[0].componentNotAllowed);
  }, M = (m) => {
    n() === 0 && r() === 0 ? (i(1), a(m)) : je(t.details.language[0].componentNotAllowed);
  }, v = (m) => {
    i(0), a(0), o("");
  }, u = (m) => {
    if (n() === 0 && r() === 0)
      i(2), a(m), _();
    else if (n() === 1)
      je("Only 1 component is allowed to edit");
    else if (n() === 2) {
      let h = JSON.parse(JSON.stringify(l())), b = h.findIndex((C) => C.value == m);
      h.splice(b, 1), e.onValueChange(h), je(t.details.language[0].componentDeleted), i(0), a(0);
    }
  }, w = (m) => {
    if (c() !== "") {
      let h = JSON.parse(JSON.stringify(l()));
      if (r() === 0)
        h = [...h, {
          value: m,
          label: c()
        }], h[0].label = "lastId#" + m;
      else {
        let b = h.findIndex((C) => C.value == m);
        h[b].label = c();
      }
      e.onValueChange(h), r() === 0 ? je(t.details.language[0].componentAdded) : je(t.details.language[0].componentEdited), i(0), a(0);
    } else
      r() === 0 ? je(t.details.language[0].componentEmpty) : (i(0), a(0));
  }, p = (m) => {
    o(m.target.value.trim());
  };
  const _ = () => {
    let m = document.querySelector("#titleModalDelete"), h = document.querySelector("#contentModalDelete");
    m.innerHTML = e.component.titleModalDelete !== void 0 ? e.component.titleModalDelete : "Confirm Delete?", h.innerHTML = e.component.contentModalDelete !== void 0 ? e.component.contentModalDelete : "Deletion will also delete related components, including child components from this parent.";
  }, [S, O] = j(!1), N = () => {
    S() ? O(!1) : O(!0);
  };
  return (() => {
    var m = Gd(), h = m.firstChild, b = h.firstChild, C = b.firstChild, L = C.firstChild, E = C.nextSibling, I = b.nextSibling, R = I.firstChild, A = h.nextSibling, T = A.firstChild, K = T.nextSibling, F = K.nextSibling;
    return k(m, g(P, {
      get when() {
        return n() == 2;
      },
      get children() {
        var D = Hd(), z = D.firstChild, B = z.firstChild, J = B.nextSibling, H = J.nextSibling, ee = H.firstChild, G = ee.nextSibling, le = G.firstChild, re = le.nextSibling;
        return le.$$click = (te) => u(r()), re.$$click = (te) => v(r()), D;
      }
    }), h), k(C, g(P, {
      get when() {
        return e.component.required;
      },
      get children() {
        return Ud();
      }
    }), null), k(C, g(P, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var D = Jd();
        return D.$$click = N, D;
      }
    }), null), k(E, g(P, {
      get when() {
        return S();
      },
      get children() {
        var D = Wd();
        return V(() => D.innerHTML = e.component.hint), D;
      }
    })), R.$$click = (D) => $(), k(T, g(ce, {
      get each() {
        return l();
      },
      children: (D, z) => g(me, {
        get children() {
          return [g(Q, {
            get when() {
              return ke(() => Number(D.value) > 0)() && Number(D.value) === r();
            },
            get children() {
              var B = Yd(), J = B.firstChild, H = J.firstChild, ee = J.nextSibling, G = ee.firstChild, le = G.nextSibling;
              return H.addEventListener("change", (re) => p(re)), G.$$click = (re) => w(Number(D.value)), le.$$click = (re) => v(Number(D.value)), V((re) => {
                var te = e.component.dataKey + "_input_" + Number(D.value), Y = f(), q = f();
                return te !== re.e && U(H, "id", re.e = te), Y !== re.t && (G.disabled = re.t = Y), q !== re.a && (le.disabled = re.a = q), re;
              }, {
                e: void 0,
                t: void 0,
                a: void 0
              }), V(() => H.value = D.label), B;
            }
          }), g(Q, {
            get when() {
              return ke(() => Number(D.value) > 0)() && Number(D.value) !== r();
            },
            get children() {
              var B = Qd(), J = B.firstChild, H = J.firstChild, ee = J.nextSibling, G = ee.firstChild, le = G.nextSibling;
              return G.$$click = (re) => M(Number(D.value)), le.$$click = (re) => u(Number(D.value)), V((re) => {
                var te = e.component.dataKey + "_input_" + Number(D.value), Y = f(), q = f();
                return te !== re.e && U(H, "id", re.e = te), Y !== re.t && (G.disabled = re.t = Y), q !== re.a && (le.disabled = re.a = q), re;
              }, {
                e: void 0,
                t: void 0,
                a: void 0
              }), V(() => H.value = D.label), B;
            }
          })];
        }
      })
    }), null), k(T, g(P, {
      get when() {
        return ke(() => n() == 1)() && r() == 0;
      },
      get children() {
        var D = qd(), z = D.firstChild, B = z.firstChild, J = z.nextSibling, H = J.firstChild, ee = H.nextSibling;
        return B.addEventListener("change", (G) => p(G)), H.$$click = (G) => w(x() + 1), ee.$$click = (G) => v(x() + 1), V((G) => {
          var le = e.component.dataKey + "_input_" + (x() + 1), re = f(), te = f();
          return le !== G.e && U(B, "id", G.e = le), re !== G.t && (H.disabled = G.t = re), te !== G.a && (ee.disabled = G.a = te), G;
        }, {
          e: void 0,
          t: void 0,
          a: void 0
        }), D;
      }
    }), null), k(F, g(P, {
      get when() {
        var D;
        return ((D = e.validationMessage) == null ? void 0 : D.length) > 0;
      },
      get children() {
        return g(ce, {
          get each() {
            return e.validationMessage;
          },
          children: (D) => (() => {
            var z = ec(), B = z.firstChild, J = B.firstChild;
            return k(B, g(me, {
              get children() {
                return [g(Q, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return Zd();
                  }
                }), g(Q, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return Xd();
                  }
                })];
              }
            }), J), J.innerHTML = D, V((H) => Z(B, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, H)), z;
          })()
        });
      }
    })), V((D) => {
      var z = e.component.label, B = f(), J = {
        " border-b border-orange-500 pb-3 ": e.classValidation === 1,
        " border-b border-pink-600 pb-3 ": e.classValidation === 2
      };
      return z !== D.e && (L.innerHTML = D.e = z), B !== D.t && (R.disabled = D.t = B), D.a = Z(K, J, D.a), D;
    }, {
      e: void 0,
      t: void 0,
      a: void 0
    }), m;
  })();
};
ge(["click"]);
var tc = /* @__PURE__ */ y('<div class="modal-delete fixed z-10 inset-0 overflow-y-auto"aria-labelledby=modal-title role=dialog aria-modal=true><div class="flex items-center justify-center min-h-screen pt-4 px-4 text-center sm:block sm:p-0"><div class="fixed inset-0 bg-gray-500/75 transition-opacity"aria-hidden=true></div><span class="hidden sm:inline-block sm:align-middle sm:h-screen"aria-hidden=true>&#8203;</span><div class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"><div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4"><div class="sm:flex sm:items-start"><div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"><svg class="h-6 w-6 text-red-600"xmlns=http://www.w3.org/2000/svg fill=none viewBox="0 0 24 24"stroke=currentColor aria-hidden=true><path stroke-linecap=round stroke-linejoin=round stroke-width=2 d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg></div><div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left"><h3 class="text-lg leading-6 font-medium text-gray-900"id=titleModalDelete>Deactivate account</h3><div class=mt-2><p class="text-sm text-gray-500"id=contentModalDelete>Are you sure you want to deactivate your account? All of your data will be permanently removed. This action cannot be undone.</p></div></div></div></div><div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"><button type=button class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">Delete</button><button type=button class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Cancel'), nc = /* @__PURE__ */ y("<span class=text-pink-600>*"), ic = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), rc = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), ac = /* @__PURE__ */ y('<div class="font-light text-sm space-x-2 pt-2.5 px-2 flex justify-end"><button class="bg-pink-600 text-white p-2 rounded-full focus:outline-none h-10 w-10 hover:bg-pink-500 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-6 w-6"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 4v16m8-8H4">'), lc = /* @__PURE__ */ y('<div class="grid grid-cols-12 "><div class="col-span-10 mr-2"></div><div class="col-span-2 flex justify-evenly p-1 space-x-1 "><button class="bg-teal-400 text-white p-2 rounded-full focus:outline-none hover:bg-teal-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"viewBox="0 0 20 20"fill=currentColor><path fill-rule=evenodd d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"clip-rule=evenodd></path></svg></button><button class="bg-gray-500 text-white p-2 rounded-full focus:outline-none hover:bg-gray-400 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"viewBox="0 0 20 20"fill=currentColor><path fill-rule=evenodd d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"clip-rule=evenodd>'), sc = /* @__PURE__ */ y('<div><div class="grid grid-cols-6 p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2 col-span-5"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div></div><div class="grid md:grid-cols-12 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm pb-2.5 px-2 col-start-2 col-end-12 space-y-4"></div><div class=col-span-12></div><div class="col-span-12 pb-4">'), oc = /* @__PURE__ */ y('<div class="grid grid-cols-12"><div class="col-span-10 mr-2"></div><div class="col-span-2 flex justify-evenly p-1 space-x-1 "><button class="bg-teal-400 text-white p-2 rounded-full focus:outline-none hover:bg-teal-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"viewBox="0 0 20 20"fill=currentColor><path fill-rule=evenodd d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"clip-rule=evenodd></path></svg></button><button class="bg-gray-500 text-white p-2 rounded-full focus:outline-none hover:bg-gray-400 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"viewBox="0 0 20 20"fill=currentColor><path fill-rule=evenodd d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"clip-rule=evenodd>'), dc = /* @__PURE__ */ y('<div class="grid grid-cols-12"><div class="col-span-10 mr-2"><input type=text class="w-full font-light px-4 py-2.5 text-sm text-gray-700 bg-gray-200 bg-clip-padding dark:bg-gray-300 border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"disabled></div><div class="col-span-2 flex justify-evenly p-1 space-x-1 "><button class="bg-orange-400 text-white p-2 rounded-full focus:outline-none hover:bg-orange-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"viewBox="0 0 20 20"fill=currentColor><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg></button><button class="bg-red-600 text-white p-2 rounded-full focus:outline-none hover:bg-red-500 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"viewBox="0 0 20 20"fill=currentColor><path fill-rule=evenodd d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"clip-rule=evenodd>'), cc = /* @__PURE__ */ y('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), uc = /* @__PURE__ */ y('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), gc = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="grid grid-cols-12"><div class="col-span-11 text-justify mr-1">');
const Pr = (e) => {
  const [t] = tt(), [n] = nt(), [i, r] = j(0), [a, l] = j(0), [s, c] = j(JSON.parse(JSON.stringify(e.value))), [o, d] = j({
    value: 0,
    label: ""
  }), [f, x] = j(!1), $ = e.config, [M, v] = j($.formMode > 1 ? !0 : e.component.disableInput);
  let u = Ce(() => 0), w, p;
  switch (e.component.typeOption) {
    case 1: {
      try {
        p = Ce(() => {
          let I = JSON.parse(JSON.stringify(e.component.options));
          const R = s().length;
          let A = 0;
          for (s()[0] !== void 0 && (A = s()[0].value == 0 ? 1 : 0), A; A < R; A++)
            if (a() === 0 || a() !== Number(s()[A].value)) {
              let T = I.findIndex((K) => K.value == s()[A].value);
              I.splice(T, 1);
            }
          return I;
        });
      } catch (I) {
        x(!0), ve(n.details.language[0].fetchFailed);
      }
      break;
    }
    case 2: {
      try {
        if ($.lookupMode === 1) {
          let I = e.component.sourceAPI[0], R = `${I.baseUrl}`;
          if (I.filterDependencies !== void 0 && I.filterDependencies.length > 0) {
            let F, D, z = R;
            F = I.filterDependencies.map((B, J) => {
              let H = B.sourceAnswer.split("@"), ee = t.details.find((G) => G.dataKey == H[0]);
              if (ee.answer) {
                const G = ee.answer;
                if (G.length > 0) {
                  let le = encodeURI(G[G.length - 1].value);
                  D = `${B.params}=${le}`;
                }
              } else
                v(!0);
              return D;
            }).join("&"), R = `${z}?${F}`;
          }
          if (I.subResourceDependencies !== void 0 && I.subResourceDependencies.length > 0) {
            let F, D, z = R;
            F = I.subResourceDependencies.map((B, J) => {
              let H = B.sourceAnswer.split("@"), ee = t.details.find((G) => G.dataKey == H[0]);
              if (ee.answer) {
                const G = ee.answer;
                G.length > 0 && (D = `${encodeURI(G[G.length - 1].value)}/${B.params}`);
              } else
                v(!0);
              return D;
            }).join("/"), R = `${z}/${F}`;
          }
          const A = {
            headers: I.headers,
            method: "GET"
          }, T = (F) => de(null, null, function* () {
            return yield fetch(F, A).catch((D) => ({
              success: !1,
              data: {},
              message: "500"
            })).then((D) => de(null, null, function* () {
              if (D.status === 200) {
                let z = yield D.json(), B = new Object();
                return B.success = !0, B.data = I.data !== "" ? z[I.data] : z, B.message = z.msg, B;
              } else
                return {
                  success: !1,
                  data: {},
                  message: D.status
                };
            })).then((D) => D);
          }), [K] = Ht(() => R, T);
          p = Ce(() => {
            if (K())
              if (!K().success)
                x(!0), ve(n.details.language[0].fetchFailed);
              else {
                let F = [];
                K().data.map((B, J) => {
                  F.push({
                    value: B[I.value],
                    label: B[I.label]
                  });
                }), w = F;
                const D = s().length;
                let z = 0;
                for (s()[0] !== void 0 && (z = s()[0].value == 0 ? 1 : 0), z; z < D; z++)
                  if (a() === 0 || a() !== Number(s()[z].value)) {
                    let B = w.findIndex((J) => J.value == s()[z].value);
                    w.splice(B, 1);
                  }
                return w;
              }
          });
        } else if ($.lookupMode === 2) {
          let I, R = [];
          I = e.component.sourceSelect;
          let A = I[0].id, T = I[0].version;
          I[0].parentCondition.length > 0 && I[0].parentCondition.map((D, z) => {
            let B = D.value.split("@"), J = t.details.find((H) => H.dataKey == B[0]);
            if (J.answer) {
              const H = J.answer;
              if (H.length > 0) {
                let ee = H[H.length - 1].value.toString();
                R.push({
                  key: D.key,
                  value: ee
                });
              }
            }
          });
          let K = (D) => {
            p = Ce(() => {
              if (!D.success)
                x(!0), ve(n.details.language[0].fetchFailed);
              else {
                let z = [];
                if (D.data.length > 0) {
                  let B = I[0].value, J = I[0].desc;
                  D.data.map((G, le) => {
                    z.push({
                      value: G[B],
                      label: G[J]
                    });
                  }), w = z;
                  const H = s().length;
                  let ee = 0;
                  for (s()[0] !== void 0 && (ee = s()[0].value == 0 ? 1 : 0), ee; ee < H; ee++)
                    if (a() === 0 || a() !== Number(s()[ee].value)) {
                      let G = w.findIndex((le) => le.value == s()[ee].value);
                      w.splice(G, 1);
                    }
                  return w;
                }
              }
            });
          };
          const F = e.MobileOfflineSearch(A, T, R, K);
        }
      } catch (I) {
        x(!0), ve(n.details.language[0].fetchFailed);
      }
      break;
    }
    case 3: {
      try {
        p = Ce(() => {
          let I = e.component.sourceOption !== void 0 ? [] : JSON.parse(JSON.stringify(e.component.options));
          if (e.component.sourceOption !== void 0) {
            const T = t.details.findIndex((K) => K.dataKey === e.component.sourceOption);
            t.details[T].type, t.details[T].answer ? I = JSON.parse(JSON.stringify(t.details[T].answer)) : I = [];
          }
          const R = s().length;
          let A = 0;
          for (s()[0] !== void 0 && (A = s()[0].value == 0 ? 1 : 0), A; A < R; A++)
            if (a() === 0 || a() !== Number(s()[A].value)) {
              let T = I.findIndex((K) => K.value == s()[A].value);
              I.splice(T, 1);
            }
          return I;
        });
      } catch (I) {
        x(!0), ve(n.details.language[0].fetchFailed);
      }
      break;
    }
    default: {
      try {
        p = Ce(() => {
          let I;
          if (e.component.options) {
            I = JSON.parse(JSON.stringify(e.component.options));
            const R = s().length;
            let A = 0;
            for (s()[0] !== void 0 && (A = s()[0].value == 0 ? 1 : 0), A; A < R; A++)
              if (a() === 0 || a() !== Number(s()[A].value)) {
                let T = I.findIndex((K) => K.value == s()[A].value);
                I.splice(T, 1);
              }
          } else
            I = [];
          return I;
        });
      } catch (I) {
        x(!0), ve(n.details.language[0].fetchFailed);
      }
      break;
    }
  }
  let _ = () => {
    i() === 0 && a() === 0 ? (r(1), l(0)) : je(n.details.language[0].componentNotAllowed);
  }, S = (I) => {
    i() === 0 && a() === 0 ? (r(1), l(I)) : je(n.details.language[0].componentNotAllowed);
  }, O = (I) => {
    r(0), l(0), d({
      value: 0,
      label: ""
    });
  }, N = (I) => {
    if (i() === 0 && a() === 0)
      r(2), l(I), b();
    else if (i() === 1)
      je(n.details.language[0].componentNotAllowed);
    else if (i() === 2) {
      let R = JSON.parse(JSON.stringify(s())), A = R.findIndex((T) => T.value == I);
      R.splice(A, 1), e.onValueChange(R), je(n.details.language[0].componentDeleted), r(0), l(0);
    }
  }, m = (I) => {
    if (o().value !== 0) {
      let R = JSON.parse(JSON.stringify(s()));
      if (a() === 0)
        R.length == 0 && (R = [...R, {
          label: "lastId#0",
          value: "0"
        }]), R = [...R, o()];
      else {
        let A = R.findIndex((T) => T.value == I);
        R.splice(A, 1, o());
      }
      e.onValueChange(R), a() === 0 ? je(n.details.language[0].componentAdded) : je(n.details.language[0].componentEdited), r(0), l(0);
    } else
      a() === 0 ? je(n.details.language[0].componentEmpty) : (r(0), l(0));
  }, h = (I) => {
    d(I);
  };
  const b = () => {
    let I = document.querySelector("#titleModalDelete"), R = document.querySelector("#contentModalDelete");
    I.innerHTML = e.component.titleModalDelete !== void 0 ? e.component.titleModalDelete : "Confirm Delete?", R.innerHTML = e.component.contentModalDelete !== void 0 ? e.component.contentModalDelete : "Deletion will also delete related components, including child components from this parent.";
  }, [C, L] = j(!1), E = () => {
    C() ? L(!1) : L(!0);
  };
  return (() => {
    var I = sc(), R = I.firstChild, A = R.firstChild, T = A.firstChild, K = T.firstChild, F = T.nextSibling, D = R.nextSibling, z = D.firstChild, B = z.nextSibling, J = B.nextSibling;
    return k(I, g(P, {
      get when() {
        return i() == 2;
      },
      get children() {
        var H = tc(), ee = H.firstChild, G = ee.firstChild, le = G.nextSibling, re = le.nextSibling, te = re.firstChild, Y = te.nextSibling, q = Y.firstChild, W = q.nextSibling;
        return q.$$click = (ie) => N(a()), W.$$click = (ie) => O(a()), H;
      }
    }), R), k(T, g(P, {
      get when() {
        return e.component.required;
      },
      get children() {
        return nc();
      }
    }), null), k(T, g(P, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var H = ic();
        return H.$$click = E, H;
      }
    }), null), k(F, g(P, {
      get when() {
        return C();
      },
      get children() {
        var H = rc();
        return V(() => H.innerHTML = e.component.hint), H;
      }
    })), k(R, g(P, {
      get when() {
        return !f();
      },
      get children() {
        var H = ac(), ee = H.firstChild;
        return ee.$$click = (G) => _(), V(() => ee.disabled = M()), H;
      }
    }), null), k(z, g(ce, {
      get each() {
        return s();
      },
      children: (H, ee) => g(me, {
        get children() {
          return [g(Q, {
            get when() {
              return ke(() => Number(H.value) > 0)() && Number(H.value) === a();
            },
            get children() {
              var G = oc(), le = G.firstChild, re = le.nextSibling, te = re.firstChild, Y = te.nextSibling;
              return k(le, g(Ot, et({
                class: "formgear-select w-full rounded font-light text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-0 border-transparent focus:outline-none"
              }, () => Lt(p(), {
                key: "label",
                filterable: !0
              }), {
                onChange: (q) => h(q),
                initialValue: H
              }))), te.$$click = (q) => m(Number(H.value)), Y.$$click = (q) => O(Number(H.value)), V((q) => {
                var W = M(), ie = M();
                return W !== q.e && (te.disabled = q.e = W), ie !== q.t && (Y.disabled = q.t = ie), q;
              }, {
                e: void 0,
                t: void 0
              }), G;
            }
          }), g(Q, {
            get when() {
              return ke(() => Number(H.value) > 0)() && Number(H.value) !== a();
            },
            get children() {
              var G = dc(), le = G.firstChild, re = le.firstChild, te = le.nextSibling, Y = te.firstChild, q = Y.nextSibling;
              return Y.$$click = (W) => S(Number(H.value)), q.$$click = (W) => N(Number(H.value)), V((W) => {
                var ie = e.component.dataKey + "_input_" + Number(H.value), ae = M(), fe = M();
                return ie !== W.e && U(re, "id", W.e = ie), ae !== W.t && (Y.disabled = W.t = ae), fe !== W.a && (q.disabled = W.a = fe), W;
              }, {
                e: void 0,
                t: void 0,
                a: void 0
              }), V(() => re.value = H.label), G;
            }
          })];
        }
      })
    }), null), k(z, g(P, {
      get when() {
        return ke(() => i() == 1)() && a() == 0;
      },
      get children() {
        var H = lc(), ee = H.firstChild, G = ee.nextSibling, le = G.firstChild, re = le.nextSibling;
        return k(ee, g(Ot, et({
          class: "formgear-select w-full rounded font-light text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-0 border-transparent focus:outline-none"
        }, () => Lt(p(), {
          key: "label",
          filterable: !0
        }), {
          onChange: (te) => h(te)
        }))), le.$$click = (te) => m(u()), re.$$click = (te) => O(u()), V((te) => {
          var Y = M(), q = M();
          return Y !== te.e && (le.disabled = te.e = Y), q !== te.t && (re.disabled = te.t = q), te;
        }, {
          e: void 0,
          t: void 0
        }), H;
      }
    }), null), k(J, g(P, {
      get when() {
        var H;
        return ((H = e.validationMessage) == null ? void 0 : H.length) > 0;
      },
      get children() {
        return g(ce, {
          get each() {
            return e.validationMessage;
          },
          children: (H) => (() => {
            var ee = gc(), G = ee.firstChild, le = G.firstChild;
            return k(G, g(me, {
              get children() {
                return [g(Q, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return cc();
                  }
                }), g(Q, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return uc();
                  }
                })];
              }
            }), le), le.innerHTML = H, V((re) => Z(G, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, re)), ee;
          })()
        });
      }
    })), V((H) => {
      var ee = e.component.label, G = {
        " border-b border-orange-500 pb-3 ": e.classValidation === 1,
        " border-b border-pink-600 pb-3 ": e.classValidation === 2
      };
      return ee !== H.e && (K.innerHTML = H.e = ee), H.t = Z(B, G, H.t), H;
    }, {
      e: void 0,
      t: void 0
    }), I;
  })();
};
ge(["click"]);
var hc = /* @__PURE__ */ y("<span class=text-pink-600>*"), fc = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), mc = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), vc = /* @__PURE__ */ y("<div class=shrink-0>"), bc = /* @__PURE__ */ y('<div class="grid md:grid-cols-3 border-b border-gray-300/[.50] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 md:col-span-2 flex items-start gap-2"><div class=flex-1><div>'), wc = /* @__PURE__ */ y('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), xc = /* @__PURE__ */ y('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), yc = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="grid grid-cols-12"><div class="col-span-11 text-justify mr-1">');
const pc = (e) => {
  const [t] = tt(), [n] = nt(), [i, r] = j([]), a = e.config, [l, s] = j(a.formMode > 1 ? !0 : e.component.disableInput);
  let c;
  switch (e.component.typeOption) {
    case 1: {
      try {
        c = JSON.parse(JSON.stringify(e.component.options)), $e(() => {
          r(c);
        });
      } catch (v) {
        ve(n.details.language[0].fetchFailed);
      }
      break;
    }
    case 2: {
      try {
        if (a.lookupMode === 1) {
          let v = e.component.sourceAPI[0], u = `${v.baseUrl}`;
          if (v.filterDependencies !== void 0 && v.filterDependencies.length > 0) {
            let O, N, m = u;
            O = v.filterDependencies.map((h, b) => {
              let C = h.sourceAnswer.split("@"), L = t.details.find((E) => E.dataKey == C[0]);
              if (L.answer) {
                const E = L.answer;
                if (E.length > 0) {
                  let I = encodeURI(E[E.length - 1].value);
                  N = `${h.params}=${I}`;
                }
              } else
                s(!0);
              return N;
            }).join("&"), u = `${m}?${O}`;
          }
          if (v.subResourceDependencies !== void 0 && v.subResourceDependencies.length > 0) {
            let O, N, m = u;
            O = v.subResourceDependencies.map((h, b) => {
              let C = h.sourceAnswer.split("@"), L = t.details.find((E) => E.dataKey == C[0]);
              if (L.answer) {
                const E = L.answer;
                E.length > 0 && (N = `${encodeURI(E[E.length - 1].value)}/${h.params}`);
              } else
                s(!0);
              return N;
            }).join("/"), u = `${m}/${O}`;
          }
          const w = {
            headers: v.headers,
            method: "GET"
          }, p = (O) => de(null, null, function* () {
            return yield fetch(O, w).catch((N) => ({
              success: !1,
              data: {},
              message: "500"
            })).then((N) => de(null, null, function* () {
              if (N.status === 200) {
                let m = yield N.json(), h = new Object();
                return h.success = !0, h.data = v.data !== "" ? m[v.data] : m, h.message = m.msg, h;
              } else
                return {
                  success: !1,
                  data: {},
                  message: N.status
                };
            })).then((N) => N);
          }), [_] = Ht(() => u, p);
          let S = e.value && e.value != "" ? e.value[0].value : "";
          $e(() => {
            if (_())
              if (!_().success)
                ve(n.details.language[0].fetchFailed);
              else {
                let O = [];
                _().data.map((N, m) => {
                  O.push({
                    value: N[v.value],
                    label: N[v.label]
                  });
                }), r(O);
              }
          });
        } else if (a.lookupMode === 2) {
          let v, u = [];
          v = e.component.sourceSelect;
          let w = v[0].id, p = v[0].version;
          v[0].parentCondition.length > 0 && v[0].parentCondition.map((O, N) => {
            let m = O.value.split("@"), h = t.details.find((b) => b.dataKey == m[0]);
            if (h.answer) {
              const b = h.answer;
              if (b.length > 0) {
                let C = b[b.length - 1].value.toString();
                u.push({
                  key: O.key,
                  value: C
                });
              }
            }
          });
          let _ = (O) => {
            if (!O.success)
              ve(n.details.language[0].fetchFailed);
            else {
              let N = [];
              if (O.data.length > 0) {
                let m = v[0].value, h = v[0].desc;
                O.data.map((b, C) => {
                  N.push({
                    value: b[m],
                    label: b[h]
                  });
                }), r(N);
              }
            }
          };
          const S = e.MobileOfflineSearch(w, p, u, _);
        }
      } catch (v) {
        ve(n.details.language[0].fetchFailed);
      }
      break;
    }
    case 3: {
      try {
        if (c = e.component.sourceOption !== void 0 ? [] : JSON.parse(JSON.stringify(e.component.options)), e.component.sourceOption !== void 0) {
          let v = e.component.sourceOption.split("@");
          const u = t.details.findIndex((w) => w.dataKey === v[0]);
          t.details[u].type, t.details[u].answer ? c = JSON.parse(JSON.stringify(t.details[u].answer)) : c = [];
        }
        $e(() => {
          r(c);
        });
      } catch (v) {
        ve(n.details.language[0].fetchFailed);
      }
      break;
    }
    default: {
      try {
        let v;
        e.component.options ? v = JSON.parse(JSON.stringify(e.component.options)) : v = [], $e(() => {
          r(v);
        });
      } catch (v) {
        ve(n.details.language[0].fetchFailed);
      }
      break;
    }
  }
  let o = (v) => {
    if (v != "" && v != null && Array.isArray(v)) {
      let u = JSON.parse(JSON.stringify(e.value));
      if (e.value.length > v.length)
        u = v;
      else {
        let w = v[v.length - 1];
        e.value ? u.push({
          value: w.value,
          label: w.label
        }) : (u = [], u.push({
          value: w.value,
          label: w.label
        }));
      }
      e.onValueChange(u);
    } else {
      let u = JSON.parse(JSON.stringify(e.value));
      u = [], e.onValueChange(u);
    }
  };
  const [d, f] = j(!1), x = () => {
    d() ? f(!1) : f(!0);
  }, [$] = j(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [M] = j(a.formMode > 2 && e.comments == 0);
  return (() => {
    var v = bc(), u = v.firstChild, w = u.firstChild, p = w.firstChild, _ = w.nextSibling, S = u.nextSibling, O = S.firstChild, N = O.firstChild;
    return k(w, g(P, {
      get when() {
        return e.component.required;
      },
      get children() {
        return hc();
      }
    }), null), k(w, g(P, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var m = fc();
        return m.$$click = x, m;
      }
    }), null), k(_, g(P, {
      get when() {
        return d();
      },
      get children() {
        var m = mc();
        return V(() => m.innerHTML = e.component.hint), m;
      }
    })), k(N, g(Ot, et({
      multiple: !0,
      class: "formgear-select w-full rounded font-light text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-0 border-transparent focus:outline-none  disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
    }, () => Lt(e.value == "" ? i : i().filter((m) => !e.value.some((h) => h.value == m.value)), {
      key: "label",
      filterable: !0
    }), {
      get disabled() {
        return l();
      },
      onChange: (m) => o(m),
      get initialValue() {
        return e.value;
      }
    }))), k(O, g(P, {
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
            var h = yc(), b = h.firstChild, C = b.firstChild;
            return k(b, g(me, {
              get children() {
                return [g(Q, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return wc();
                  }
                }), g(Q, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return xc();
                  }
                })];
              }
            }), C), C.innerHTML = m, V((L) => Z(b, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, L)), h;
          })()
        });
      }
    }), null), k(S, g(P, {
      get when() {
        return $();
      },
      get children() {
        var m = vc();
        return k(m, g(Ae, {
          get disabled() {
            return M();
          },
          onClick: () => e.openRemark(e.component.dataKey),
          get comments() {
            return e.comments;
          }
        })), m;
      }
    }), null), V((m) => {
      var h = e.component.label, b = {
        " border rounded border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
        " border rounded border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
      };
      return h !== m.e && (p.innerHTML = m.e = h), m.t = Z(N, b, m.t), m;
    }, {
      e: void 0,
      t: void 0
    }), v;
  })();
};
ge(["click"]);
var kc = (e) => [...e].map((t) => ({
  9: /\d/,
  a: /[a-z]/i,
  "*": /\w/
})[t] || t), $c = (e) => (t, n) => {
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
}, _c = (e) => typeof e == "function" ? e : $c(Array.isArray(e) ? e : kc(e)), Sn = (e) => {
  const t = _c(e);
  return (i) => {
    const r = i.currentTarget || i.target, [a, l] = t(r.value, [
      r.selectionStart || r.value.length,
      r.selectionEnd || r.value.length
    ]);
    return r.value = a, r.setSelectionRange(...l), a;
  };
}, Sc = /* @__PURE__ */ y("<span class=text-pink-600>*"), Cc = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Mc = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), Ic = /* @__PURE__ */ y("<div class=shrink-0>"), Ec = /* @__PURE__ */ y('<div class="md:grid md:grid-cols-3 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 md:col-span-2 flex items-start gap-2"><div class=flex-1><input type=text class="w-full border-gray-300 rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400">'), Lc = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), Oc = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Ac = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="flex-1 text-justify">');
const Rc = (e) => {
  const t = e.config, [n] = j(t.formMode > 1 ? !0 : e.component.disableInput), i = Sn(e.component.maskingFormat), a = {
    ref: void 0
  };
  let l = (x) => {
    e.onValueChange(x);
  };
  $e(() => {
    document.getElementById("inputMask" + e.component.dataKey).click();
  });
  const [s, c] = j(!1), o = () => {
    s() ? c(!1) : c(!0);
  }, [d] = j(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [f] = j(t.formMode > 2 && e.comments == 0);
  return (() => {
    var x = Ec(), $ = x.firstChild, M = $.firstChild, v = M.firstChild, u = M.nextSibling, w = $.nextSibling, p = w.firstChild, _ = p.firstChild;
    k(M, g(P, {
      get when() {
        return e.component.required;
      },
      get children() {
        return Sc();
      }
    }), null), k(M, g(P, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var O = Cc();
        return O.$$click = o, O;
      }
    }), null), k(u, g(P, {
      get when() {
        return s();
      },
      get children() {
        var O = Mc();
        return V(() => O.innerHTML = e.component.hint), O;
      }
    })), _.addEventListener("paste", () => i({
      currentTarget: a.ref
    })), Re(_, "input", i, !0), _.$$click = () => i({
      currentTarget: a.ref
    }), _.addEventListener("change", (O) => l(O.currentTarget.value));
    var S = a.ref;
    return typeof S == "function" ? ct(S, _) : a.ref = _, k(p, g(P, {
      get when() {
        var O;
        return ((O = e.validationMessage) == null ? void 0 : O.length) > 0;
      },
      get children() {
        return g(ce, {
          get each() {
            return e.validationMessage;
          },
          children: (O) => (() => {
            var N = Ac(), m = N.firstChild, h = m.firstChild;
            return k(m, g(me, {
              get children() {
                return [g(Q, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return Lc();
                  }
                }), g(Q, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return Oc();
                  }
                })];
              }
            }), h), h.innerHTML = O, V((b) => Z(m, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, b)), N;
          })()
        });
      }
    }), null), k(w, g(P, {
      get when() {
        return d();
      },
      get children() {
        var O = Ic();
        return k(O, g(Ae, {
          get disabled() {
            return f();
          },
          onClick: () => e.openRemark(e.component.dataKey),
          get comments() {
            return e.comments;
          }
        })), O;
      }
    }), null), V((O) => {
      var N = e.component.label, m = "inputMask" + e.component.dataKey, h = e.component.maskingFormat.replace(/[a]/g, "__").replace(/[9]/g, "#"), b = n();
      return N !== O.e && (v.innerHTML = O.e = N), m !== O.t && U(_, "id", O.t = m), h !== O.a && U(_, "placeholder", O.a = h), b !== O.o && (_.disabled = O.o = b), O;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0
    }), V(() => _.value = e.value), x;
  })();
};
ge(["click", "input"]);
var xi = /* @__PURE__ */ y('<input type=text class="w-full font-light px-4 py-2.5 text-sm text-gray-700 bg-gray-200 bg-clip-padding dark:bg-gray-300 border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"disabled>'), Vc = /* @__PURE__ */ y("<small>"), Nc = /* @__PURE__ */ y('<div class="grid space-y-4">'), Tc = /* @__PURE__ */ y('<div class="grid md:grid-cols-3 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-x-2 py-2.5 px-2"><div></div></div><div class="font-light text-sm space-x-2 py-2.5 px-2 md:col-span-2">');
const Dr = (e) => {
  const t = e.config, [n] = j(t.formMode > 1 ? !0 : e.component.disableInput), [i, r] = j(e.value);
  return $e(() => {
    r(e.value);
  }), g(P, {
    get when() {
      return e.component.render;
    },
    get children() {
      var a = Tc(), l = a.firstChild, s = l.firstChild, c = l.nextSibling;
      return k(c, g(me, {
        get children() {
          return [g(Q, {
            get when() {
              return ke(() => !!e.component.render)() && e.component.renderType <= 1;
            },
            get children() {
              return [(() => {
                var o = xi();
                return V(() => U(o, "name", e.component.dataKey)), V(() => o.value = e.value), o;
              })(), (() => {
                var o = Vc();
                return k(o, () => e.validationMessage), o;
              })()];
            }
          }), g(Q, {
            get when() {
              return ke(() => !!e.component.render)() && e.component.renderType === 2;
            },
            get children() {
              var o = Nc();
              return k(o, g(ce, {
                get each() {
                  return e.value;
                },
                children: (d, f) => (() => {
                  var x = xi();
                  return V(() => x.value = d.label), x;
                })()
              })), o;
            }
          })];
        }
      })), V(() => s.innerHTML = e.component.label), a;
    }
  });
};
var Pc = /* @__PURE__ */ y("<button type=button>");
const Dc = {
  pink: "hover:bg-pink-200    hover:text-pink-400    hover:border-pink-200",
  teal: "hover:bg-teal-200    hover:text-teal-400    hover:border-teal-200",
  sky: "hover:bg-sky-200     hover:text-sky-400     hover:border-sky-200",
  amber: "hover:bg-amber-100   hover:text-amber-400   hover:border-amber-100",
  fuchsia: "hover:bg-fuchsia-200 hover:text-fuchsia-400 hover:border-fuchsia-200"
}, Pe = (e) => {
  const [t, n] = Bn(e, ["color", "class", "children"]);
  return (() => {
    var i = Pc();
    return Hn(i, et({
      get class() {
        var r, a;
        return ["bg-white dark:bg-gray-800 text-gray-500 p-2 rounded-full focus:outline-none", "h-10 w-10 border-2 border-gray-300", "disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400", Dc[(r = t.color) != null ? r : "pink"], (a = t.class) != null ? a : ""].join(" ");
      }
    }, n), !1, !0), k(i, () => t.children), i;
  })();
};
var jc = /* @__PURE__ */ y("<span class=text-pink-600>*"), Kc = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), zc = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), Fc = /* @__PURE__ */ y("<input class=hidden>"), yi = /* @__PURE__ */ y('<svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z">'), Bc = /* @__PURE__ */ y('<input type=file accept=image/* class="hidden w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"style=color:transparent>'), Hc = /* @__PURE__ */ y('<div class="font-light text-sm space-x-2 py-2.5 px-2 col-span-12 space-y-4"><div class=preview-class><div class="container mx-auto"><img class=rounded-md style=width:100%;height:100%>'), Uc = /* @__PURE__ */ y('<div><div class="grid grid-cols-12 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2 col-span-11"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm space-x-2 py-2.5 px-2 space-y-4 flex justify-end -mt-2"></div><div class=col-span-12></div><div class="col-span-12 pb-4">'), Jc = /* @__PURE__ */ y('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), Wc = /* @__PURE__ */ y('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), qc = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="grid grid-cols-12"><div class="col-span-11 text-justify mr-1">');
const Gc = (e) => {
  const [t] = nt(), [n, i] = j(""), [r, a] = j("");
  let l = new FileReader();
  const s = e.config, [c] = j(s.formMode > 1 ? !0 : e.component.disableInput);
  $e(() => {
    if (i(e.component.label), e.value[0]) {
      let p = e.value[0].value;
      a(p);
    }
  });
  let o = (_) => {
    var _ = JSON.parse(_);
    let S = JSON.parse(JSON.stringify(e.value));
    S = [], S.push({
      value: _.image,
      label: _.label,
      type: _.type
    }), e.onValueChange(S), Ue("Image uploaded successfully!");
  }, d = (p) => {
    o(p);
  }, f = () => {
    e.MobileUploadHandler(d);
  }, x = (p) => {
    let _ = JSON.parse(JSON.stringify(e.value));
    if (p.target.files && p.target.files[0]) {
      var S = ["jpeg", "jpg", "png", "gif"];
      let O = p.target.files[0], N = O.name.split(".").pop().toLowerCase();
      S.includes(N) ? (l.readAsDataURL(O), l.onload = (m) => {
        var h = O.name;
        _ = [], URL.createObjectURL(O), _.push({
          value: m.target.result,
          label: h,
          type: p.target.files[0].type
        }), e.onValueChange(_), Ue("Image uploaded successfully!");
      }) : ve("Please submit the appropriate format!");
    }
  };
  const [$, M] = j(!1), v = () => {
    $() ? M(!1) : M(!0);
  }, [u] = j(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [w] = j(s.formMode > 2 && e.comments == 0);
  return (() => {
    var p = Uc(), _ = p.firstChild, S = _.firstChild, O = S.firstChild, N = O.firstChild, m = O.nextSibling, h = S.nextSibling, b = h.nextSibling, C = b.nextSibling;
    return k(O, g(P, {
      get when() {
        return e.component.required;
      },
      get children() {
        return jc();
      }
    }), null), k(O, g(P, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var L = Kc();
        return L.$$click = v, L;
      }
    }), null), k(m, g(P, {
      get when() {
        return $();
      },
      get children() {
        var L = zc();
        return V(() => L.innerHTML = e.component.hint), L;
      }
    })), k(h, g(me, {
      get children() {
        return [g(Q, {
          get when() {
            return s.clientMode == 2;
          },
          get children() {
            return [Fc(), g(Pe, {
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
        }), g(Q, {
          get when() {
            return s.clientMode == 1;
          },
          get children() {
            return [(() => {
              var L = Bc();
              return L.addEventListener("change", (E) => {
                x(E);
              }), V((E) => {
                var I = "inputFile_" + e.component.dataKey, R = e.component.dataKey;
                return I !== E.e && U(L, "id", E.e = I), R !== E.t && U(L, "name", E.t = R), E;
              }, {
                e: void 0,
                t: void 0
              }), L;
            })(), g(Pe, {
              color: "pink",
              get disabled() {
                return c();
              },
              onClick: (L) => {
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
    }), null), k(h, g(P, {
      get when() {
        return u();
      },
      get children() {
        return g(Ae, {
          get disabled() {
            return w();
          },
          onClick: () => e.openRemark(e.component.dataKey),
          get comments() {
            return e.comments;
          }
        });
      }
    }), null), k(_, g(P, {
      get when() {
        return r() != "";
      },
      get children() {
        var L = Hc(), E = L.firstChild, I = E.firstChild, R = I.firstChild;
        return V((A) => {
          var T = r(), K = "img-preview" + e.component.dataKey;
          return T !== A.e && U(R, "src", A.e = T), K !== A.t && U(R, "id", A.t = K), A;
        }, {
          e: void 0,
          t: void 0
        }), L;
      }
    }), b), k(C, g(P, {
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
            var E = qc(), I = E.firstChild, R = I.firstChild;
            return k(I, g(me, {
              get children() {
                return [g(Q, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return Jc();
                  }
                }), g(Q, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return Wc();
                  }
                })];
              }
            }), R), R.innerHTML = L, V((A) => Z(I, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, A)), E;
          })()
        });
      }
    })), V((L) => {
      var E = e.component.label, I = {
        " border-b border-orange-500 pb-3 ": e.classValidation === 1,
        " border-b border-pink-600 pb-3 ": e.classValidation === 2
      };
      return E !== L.e && (N.innerHTML = L.e = E), L.t = Z(b, I, L.t), L;
    }, {
      e: void 0,
      t: void 0
    }), p;
  })();
};
ge(["click"]);
var Yc = /* @__PURE__ */ y("<span class=text-pink-600>*"), Qc = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Zc = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), pi = /* @__PURE__ */ y('<svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7">'), ki = /* @__PURE__ */ y('<svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap=round stroke-linejoin=round d="M15 11a3 3 0 11-6 0 3 3 0 016 0z">'), Xc = /* @__PURE__ */ y('<div class="font-light text-sm space-x-2 py-2.5 px-2 space-y-4"><div class=preview-class><div class="container mx-auto space-y-3"><iframe class="border-2 rounded-md mb-2"style=width:100%;height:100%;pointer-events:none></iframe><span class="bg-red-100 text-red-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-800"></span><span class="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">'), eu = /* @__PURE__ */ y('<div><div class="border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="flex items-start gap-2"><div class="font-light text-sm space-y-2 py-2.5 px-2 flex-1"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 flex items-center gap-2 shrink-0"></div></div><div></div><div class=pb-4>'), tu = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), nu = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), iu = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="text-justify mr-1">');
const jr = (e) => {
  const [t] = nt(), [n, i] = j(""), [r, a] = j(""), [l, s] = j({
    latitude: null,
    longitude: null
  }), c = e.config, [o] = j(c.formMode > 1 ? !0 : e.component.disableInput);
  $e(() => {
    if (i(e.component.label), e.value[0]) {
      let p = e.value[0].value, _ = `https://maps.google.com/maps?q=${p.latitude},${p.longitude}&output=embed`;
      a(_), s({
        latitude: p.latitude,
        longitude: p.longitude
      });
    }
  });
  let d = (p) => {
    let _ = JSON.parse(JSON.stringify(e.value));
    _ = [];
    let S;
    p.coordinat && (S = `https://maps.google.com/maps?q=${p.coordinat.latitude},${p.coordinat.longitude}&output=embed`, a(S)), je(t.details.language[0].locationAcquired), _.push({
      value: {
        latitude: p.coordinat.latitude,
        longitude: p.coordinat.longitude
      },
      label: S
    }), _.push({
      label: "map",
      value: S
    }), _.push({
      label: "latitude",
      value: p.coordinat.latitude
    }), _.push({
      label: "longitude",
      value: p.coordinat.longitude
    }), e.onValueChange(_);
  }, f = () => {
    e.MobileGpsHandler(d);
  }, x = () => {
    var p = {
      enableHighAccuracy: !0,
      timeout: 5e3,
      maximumAge: 0
    };
    function _(O) {
      if (O.coords, O.coords) {
        let N = JSON.parse(JSON.stringify(e.value));
        N = [];
        let m = `https://maps.google.com/maps?q=${O.coords.latitude},${O.coords.longitude}&output=embed`;
        a(m), N.push({
          value: {
            latitude: O.coords.latitude,
            longitude: O.coords.longitude
          },
          label: m
        }), N.push({
          label: "map",
          value: m
        }), N.push({
          label: "latitude",
          value: O.coords.latitude
        }), N.push({
          label: "longitude",
          value: O.coords.longitude
        }), je(t.details.language[0].locationAcquired), e.onValueChange(N);
      }
    }
    function S(O) {
    }
    navigator.geolocation.getCurrentPosition(_, S, p);
  };
  const [$, M] = j(!1), v = () => {
    $() ? M(!1) : M(!0);
  }, [u] = j(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [w] = j(c.formMode > 2 && e.comments == 0);
  return (() => {
    var p = eu(), _ = p.firstChild, S = _.firstChild, O = S.firstChild, N = O.firstChild, m = N.firstChild, h = N.nextSibling, b = O.nextSibling, C = S.nextSibling, L = C.nextSibling;
    return k(N, g(P, {
      get when() {
        return e.component.required;
      },
      get children() {
        return Yc();
      }
    }), null), k(N, g(P, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var E = Qc();
        return E.$$click = v, E;
      }
    }), null), k(h, g(P, {
      get when() {
        return $();
      },
      get children() {
        var E = Zc();
        return V(() => E.innerHTML = e.component.hint), E;
      }
    })), k(b, g(P, {
      get when() {
        return r() != "";
      },
      get children() {
        return g(me, {
          get children() {
            return [g(Q, {
              get when() {
                return c.clientMode === 2;
              },
              get children() {
                return g(Pe, {
                  color: "sky",
                  onClick: (E) => e.MobileOpenMap(e.value[0].value),
                  get children() {
                    return pi();
                  }
                });
              }
            }), g(Q, {
              get when() {
                return c.clientMode === 1;
              },
              get children() {
                return g(Pe, {
                  color: "sky",
                  onClick: (E) => window.open("https://maps.google.com/maps?q=loc:" + l().latitude + "," + l().longitude, "_blank"),
                  get children() {
                    return pi();
                  }
                });
              }
            })];
          }
        });
      }
    }), null), k(b, g(me, {
      get children() {
        return [g(Q, {
          get when() {
            return c.clientMode === 2;
          },
          get children() {
            return g(Pe, {
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
        }), g(Q, {
          get when() {
            return c.clientMode === 1;
          },
          get children() {
            return g(Pe, {
              color: "teal",
              get disabled() {
                return o();
              },
              onClick: () => x(),
              get children() {
                return ki();
              }
            });
          }
        })];
      }
    }), null), k(b, g(P, {
      get when() {
        return u();
      },
      get children() {
        return g(Ae, {
          get disabled() {
            return w();
          },
          onClick: () => e.openRemark(e.component.dataKey),
          get comments() {
            return e.comments;
          }
        });
      }
    }), null), k(_, g(P, {
      get when() {
        return r() != "";
      },
      get children() {
        var E = Xc(), I = E.firstChild, R = I.firstChild, A = R.firstChild, T = A.nextSibling, K = T.nextSibling;
        return k(T, () => "lon : " + l().longitude), k(K, () => "lat : " + l().latitude), V(() => U(A, "src", r())), E;
      }
    }), C), k(L, g(P, {
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
            var I = iu(), R = I.firstChild, A = R.firstChild;
            return k(R, g(me, {
              get children() {
                return [g(Q, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return tu();
                  }
                }), g(Q, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return nu();
                  }
                })];
              }
            }), A), A.innerHTML = E, V((T) => Z(R, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, T)), I;
          })()
        });
      }
    })), V((E) => {
      var I = e.component.label, R = {
        " border-b border-orange-500 pb-3 ": e.classValidation === 1,
        " border-b border-pink-600 pb-3 ": e.classValidation === 2
      };
      return I !== E.e && (m.innerHTML = E.e = I), E.t = Z(C, R, E.t), E;
    }, {
      e: void 0,
      t: void 0
    }), p;
  })();
};
ge(["click"]);
var an = { exports: {} };
var ru = an.exports, $i;
function au() {
  return $i || ($i = 1, (function(e, t) {
    ((n, i) => {
      e.exports = i();
    })(ru, function n() {
      var i = typeof self != "undefined" ? self : typeof window != "undefined" ? window : i !== void 0 ? i : {}, r, a = !i.document && !!i.postMessage, l = i.IS_PAPA_WORKER || !1, s = {}, c = 0, o = {};
      function d(h) {
        this._handle = null, this._finished = !1, this._completed = !1, this._halted = !1, this._input = null, this._baseIndex = 0, this._partialLine = "", this._rowCount = 0, this._start = 0, this._nextChunk = null, this.isFirstChunk = !0, this._completeResults = { data: [], errors: [], meta: {} }, function(b) {
          var C = O(b);
          C.chunkSize = parseInt(C.chunkSize), b.step || b.chunk || (C.chunkSize = null), this._handle = new v(C), (this._handle.streamer = this)._config = C;
        }.call(this, h), this.parseChunk = function(b, C) {
          var L = parseInt(this._config.skipFirstNLines) || 0;
          if (this.isFirstChunk && 0 < L) {
            let I = this._config.newline;
            I || (E = this._config.quoteChar || '"', I = this._handle.guessLineEndings(b, E)), b = [...b.split(I).slice(L)].join(I);
          }
          this.isFirstChunk && m(this._config.beforeFirstChunk) && (E = this._config.beforeFirstChunk(b)) !== void 0 && (b = E), this.isFirstChunk = !1, this._halted = !1;
          var L = this._partialLine + b, E = (this._partialLine = "", this._handle.parse(L, this._baseIndex, !this._finished));
          if (!this._handle.paused() && !this._handle.aborted()) {
            if (b = E.meta.cursor, L = (this._finished || (this._partialLine = L.substring(b - this._baseIndex), this._baseIndex = b), E && E.data && (this._rowCount += E.data.length), this._finished || this._config.preview && this._rowCount >= this._config.preview), l) i.postMessage({ results: E, workerId: o.WORKER_ID, finished: L });
            else if (m(this._config.chunk) && !C) {
              if (this._config.chunk(E, this._handle), this._handle.paused() || this._handle.aborted()) return void (this._halted = !0);
              this._completeResults = E = void 0;
            }
            return this._config.step || this._config.chunk || (this._completeResults.data = this._completeResults.data.concat(E.data), this._completeResults.errors = this._completeResults.errors.concat(E.errors), this._completeResults.meta = E.meta), this._completed || !L || !m(this._config.complete) || E && E.meta.aborted || (this._config.complete(this._completeResults, this._input), this._completed = !0), L || E && E.meta.paused || this._nextChunk(), E;
          }
          this._halted = !0;
        }, this._sendError = function(b) {
          m(this._config.error) ? this._config.error(b) : l && this._config.error && i.postMessage({ workerId: o.WORKER_ID, error: b, finished: !1 });
        };
      }
      function f(h) {
        var b;
        (h = h || {}).chunkSize || (h.chunkSize = o.RemoteChunkSize), d.call(this, h), this._nextChunk = a ? function() {
          this._readChunk(), this._chunkLoaded();
        } : function() {
          this._readChunk();
        }, this.stream = function(C) {
          this._input = C, this._nextChunk();
        }, this._readChunk = function() {
          if (this._finished) this._chunkLoaded();
          else {
            if (b = new XMLHttpRequest(), this._config.withCredentials && (b.withCredentials = this._config.withCredentials), a || (b.onload = N(this._chunkLoaded, this), b.onerror = N(this._chunkError, this)), b.open(this._config.downloadRequestBody ? "POST" : "GET", this._input, !a), this._config.downloadRequestHeaders) {
              var C, L = this._config.downloadRequestHeaders;
              for (C in L) b.setRequestHeader(C, L[C]);
            }
            var E;
            this._config.chunkSize && (E = this._start + this._config.chunkSize - 1, b.setRequestHeader("Range", "bytes=" + this._start + "-" + E));
            try {
              b.send(this._config.downloadRequestBody);
            } catch (I) {
              this._chunkError(I.message);
            }
            a && b.status === 0 && this._chunkError();
          }
        }, this._chunkLoaded = function() {
          b.readyState === 4 && (b.status < 200 || 400 <= b.status ? this._chunkError() : (this._start += this._config.chunkSize || b.responseText.length, this._finished = !this._config.chunkSize || this._start >= ((C) => (C = C.getResponseHeader("Content-Range")) !== null ? parseInt(C.substring(C.lastIndexOf("/") + 1)) : -1)(b), this.parseChunk(b.responseText)));
        }, this._chunkError = function(C) {
          C = b.statusText || C, this._sendError(new Error(C));
        };
      }
      function x(h) {
        (h = h || {}).chunkSize || (h.chunkSize = o.LocalChunkSize), d.call(this, h);
        var b, C, L = typeof FileReader != "undefined";
        this.stream = function(E) {
          this._input = E, C = E.slice || E.webkitSlice || E.mozSlice, L ? ((b = new FileReader()).onload = N(this._chunkLoaded, this), b.onerror = N(this._chunkError, this)) : b = new FileReaderSync(), this._nextChunk();
        }, this._nextChunk = function() {
          this._finished || this._config.preview && !(this._rowCount < this._config.preview) || this._readChunk();
        }, this._readChunk = function() {
          var E = this._input, I = (this._config.chunkSize && (I = Math.min(this._start + this._config.chunkSize, this._input.size), E = C.call(E, this._start, I)), b.readAsText(E, this._config.encoding));
          L || this._chunkLoaded({ target: { result: I } });
        }, this._chunkLoaded = function(E) {
          this._start += this._config.chunkSize, this._finished = !this._config.chunkSize || this._start >= this._input.size, this.parseChunk(E.target.result);
        }, this._chunkError = function() {
          this._sendError(b.error);
        };
      }
      function $(h) {
        var b;
        d.call(this, h = h || {}), this.stream = function(C) {
          return b = C, this._nextChunk();
        }, this._nextChunk = function() {
          var C, L;
          if (!this._finished) return C = this._config.chunkSize, b = C ? (L = b.substring(0, C), b.substring(C)) : (L = b, ""), this._finished = !b, this.parseChunk(L);
        };
      }
      function M(h) {
        d.call(this, h = h || {});
        var b = [], C = !0, L = !1;
        this.pause = function() {
          d.prototype.pause.apply(this, arguments), this._input.pause();
        }, this.resume = function() {
          d.prototype.resume.apply(this, arguments), this._input.resume();
        }, this.stream = function(E) {
          this._input = E, this._input.on("data", this._streamData), this._input.on("end", this._streamEnd), this._input.on("error", this._streamError);
        }, this._checkIsFinished = function() {
          L && b.length === 1 && (this._finished = !0);
        }, this._nextChunk = function() {
          this._checkIsFinished(), b.length ? this.parseChunk(b.shift()) : C = !0;
        }, this._streamData = N(function(E) {
          try {
            b.push(typeof E == "string" ? E : E.toString(this._config.encoding)), C && (C = !1, this._checkIsFinished(), this.parseChunk(b.shift()));
          } catch (I) {
            this._streamError(I);
          }
        }, this), this._streamError = N(function(E) {
          this._streamCleanUp(), this._sendError(E);
        }, this), this._streamEnd = N(function() {
          this._streamCleanUp(), L = !0, this._streamData("");
        }, this), this._streamCleanUp = N(function() {
          this._input.removeListener("data", this._streamData), this._input.removeListener("end", this._streamEnd), this._input.removeListener("error", this._streamError);
        }, this);
      }
      function v(h) {
        var b, C, L, E, I = Math.pow(2, 53), R = -I, A = /^\s*-?(\d+\.?|\.\d+|\d+\.\d+)([eE][-+]?\d+)?\s*$/, T = /^((\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)))$/, K = this, F = 0, D = 0, z = !1, B = !1, J = [], H = { data: [], errors: [], meta: {} };
        function ee(te) {
          return h.skipEmptyLines === "greedy" ? te.join("").trim() === "" : te.length === 1 && te[0].length === 0;
        }
        function G() {
          if (H && L && (re("Delimiter", "UndetectableDelimiter", "Unable to auto-detect delimiting character; defaulted to '" + o.DefaultDelimiter + "'"), L = !1), h.skipEmptyLines && (H.data = H.data.filter(function(W) {
            return !ee(W);
          })), le()) {
            let W = function(ie, ae) {
              m(h.transformHeader) && (ie = h.transformHeader(ie, ae)), J.push(ie);
            };
            if (H) if (Array.isArray(H.data[0])) {
              for (var te = 0; le() && te < H.data.length; te++) H.data[te].forEach(W);
              H.data.splice(0, 1);
            } else H.data.forEach(W);
          }
          function Y(W, ie) {
            for (var ae = h.header ? {} : [], fe = 0; fe < W.length; fe++) {
              var xe = fe, ye = W[fe], ye = ((Me, he) => ((_e) => (h.dynamicTypingFunction && h.dynamicTyping[_e] === void 0 && (h.dynamicTyping[_e] = h.dynamicTypingFunction(_e)), (h.dynamicTyping[_e] || h.dynamicTyping) === !0))(Me) ? he === "true" || he === "TRUE" || he !== "false" && he !== "FALSE" && (((_e) => {
                if (A.test(_e) && (_e = parseFloat(_e), R < _e && _e < I))
                  return 1;
              })(he) ? parseFloat(he) : T.test(he) ? new Date(he) : he === "" ? null : he) : he)(xe = h.header ? fe >= J.length ? "__parsed_extra" : J[fe] : xe, ye = h.transform ? h.transform(ye, xe) : ye);
              xe === "__parsed_extra" ? (ae[xe] = ae[xe] || [], ae[xe].push(ye)) : ae[xe] = ye;
            }
            return h.header && (fe > J.length ? re("FieldMismatch", "TooManyFields", "Too many fields: expected " + J.length + " fields but parsed " + fe, D + ie) : fe < J.length && re("FieldMismatch", "TooFewFields", "Too few fields: expected " + J.length + " fields but parsed " + fe, D + ie)), ae;
          }
          var q;
          H && (h.header || h.dynamicTyping || h.transform) && (q = 1, !H.data.length || Array.isArray(H.data[0]) ? (H.data = H.data.map(Y), q = H.data.length) : H.data = Y(H.data, 0), h.header && H.meta && (H.meta.fields = J), D += q);
        }
        function le() {
          return h.header && J.length === 0;
        }
        function re(te, Y, q, W) {
          te = { type: te, code: Y, message: q }, W !== void 0 && (te.row = W), H.errors.push(te);
        }
        m(h.step) && (E = h.step, h.step = function(te) {
          H = te, le() ? G() : (G(), H.data.length !== 0 && (F += te.data.length, h.preview && F > h.preview ? C.abort() : (H.data = H.data[0], E(H, K))));
        }), this.parse = function(te, Y, q) {
          var W = h.quoteChar || '"', W = (h.newline || (h.newline = this.guessLineEndings(te, W)), L = !1, h.delimiter ? m(h.delimiter) && (h.delimiter = h.delimiter(te), H.meta.delimiter = h.delimiter) : ((W = ((ie, ae, fe, xe, ye) => {
            var Me, he, _e, Ve;
            ye = ye || [",", "	", "|", ";", o.RECORD_SEP, o.UNIT_SEP];
            for (var Je = 0; Je < ye.length; Je++) {
              for (var ze, xt = ye[Je], De = 0, Ge = 0, Ne = 0, Fe = (_e = void 0, new w({ comments: xe, delimiter: xt, newline: ae, preview: 10 }).parse(ie)), Ye = 0; Ye < Fe.data.length; Ye++) fe && ee(Fe.data[Ye]) ? Ne++ : (ze = Fe.data[Ye].length, Ge += ze, _e === void 0 ? _e = ze : 0 < ze && (De += Math.abs(ze - _e), _e = ze));
              0 < Fe.data.length && (Ge /= Fe.data.length - Ne), (he === void 0 || De <= he) && (Ve === void 0 || Ve < Ge) && 1.99 < Ge && (he = De, Me = xt, Ve = Ge);
            }
            return { successful: !!(h.delimiter = Me), bestDelimiter: Me };
          })(te, h.newline, h.skipEmptyLines, h.comments, h.delimitersToGuess)).successful ? h.delimiter = W.bestDelimiter : (L = !0, h.delimiter = o.DefaultDelimiter), H.meta.delimiter = h.delimiter), O(h));
          return h.preview && h.header && W.preview++, b = te, C = new w(W), H = C.parse(b, Y, q), G(), z ? { meta: { paused: !0 } } : H || { meta: { paused: !1 } };
        }, this.paused = function() {
          return z;
        }, this.pause = function() {
          z = !0, C.abort(), b = m(h.chunk) ? "" : b.substring(C.getCharIndex());
        }, this.resume = function() {
          K.streamer._halted ? (z = !1, K.streamer.parseChunk(b, !0)) : setTimeout(K.resume, 3);
        }, this.aborted = function() {
          return B;
        }, this.abort = function() {
          B = !0, C.abort(), H.meta.aborted = !0, m(h.complete) && h.complete(H), b = "";
        }, this.guessLineEndings = function(ie, W) {
          ie = ie.substring(0, 1048576);
          var W = new RegExp(u(W) + "([^]*?)" + u(W), "gm"), q = (ie = ie.replace(W, "")).split("\r"), W = ie.split(`
`), ie = 1 < W.length && W[0].length < q[0].length;
          if (q.length === 1 || ie) return `
`;
          for (var ae = 0, fe = 0; fe < q.length; fe++) q[fe][0] === `
` && ae++;
          return ae >= q.length / 2 ? `\r
` : "\r";
        };
      }
      function u(h) {
        return h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
      function w(h) {
        var b = (h = h || {}).delimiter, C = h.newline, L = h.comments, E = h.step, I = h.preview, R = h.fastMode, A = null, T = !1, K = h.quoteChar == null ? '"' : h.quoteChar, F = K;
        if (h.escapeChar !== void 0 && (F = h.escapeChar), (typeof b != "string" || -1 < o.BAD_DELIMITERS.indexOf(b)) && (b = ","), L === b) throw new Error("Comment character same as delimiter");
        L === !0 ? L = "#" : (typeof L != "string" || -1 < o.BAD_DELIMITERS.indexOf(L)) && (L = !1), C !== `
` && C !== "\r" && C !== `\r
` && (C = `
`);
        var D = 0, z = !1;
        this.parse = function(B, J, H) {
          if (typeof B != "string") throw new Error("Input must be a string");
          var ee = B.length, G = b.length, le = C.length, re = L.length, te = m(E), Y = [], q = [], W = [], ie = D = 0;
          if (!B) return De();
          if (R || R !== !1 && B.indexOf(K) === -1) {
            for (var ae = B.split(C), fe = 0; fe < ae.length; fe++) {
              if (W = ae[fe], D += W.length, fe !== ae.length - 1) D += C.length;
              else if (H) return De();
              if (!L || W.substring(0, re) !== L) {
                if (te) {
                  if (Y = [], Ve(W.split(b)), Ge(), z) return De();
                } else Ve(W.split(b));
                if (I && I <= fe) return Y = Y.slice(0, I), De(!0);
              }
            }
            return De();
          }
          for (var xe = B.indexOf(b, D), ye = B.indexOf(C, D), Me = new RegExp(u(F) + u(K), "g"), he = B.indexOf(K, D); ; ) if (B[D] === K) for (he = D, D++; ; ) {
            if ((he = B.indexOf(K, he + 1)) === -1) return H || q.push({ type: "Quotes", code: "MissingQuotes", message: "Quoted field unterminated", row: Y.length, index: D }), ze();
            if (he === ee - 1) return ze(B.substring(D, he).replace(Me, K));
            if (K === F && B[he + 1] === F) he++;
            else if (K === F || he === 0 || B[he - 1] !== F) {
              xe !== -1 && xe < he + 1 && (xe = B.indexOf(b, he + 1));
              var _e = Je((ye = ye !== -1 && ye < he + 1 ? B.indexOf(C, he + 1) : ye) === -1 ? xe : Math.min(xe, ye));
              if (B.substr(he + 1 + _e, G) === b) {
                W.push(B.substring(D, he).replace(Me, K)), B[D = he + 1 + _e + G] !== K && (he = B.indexOf(K, D)), xe = B.indexOf(b, D), ye = B.indexOf(C, D);
                break;
              }
              if (_e = Je(ye), B.substring(he + 1 + _e, he + 1 + _e + le) === C) {
                if (W.push(B.substring(D, he).replace(Me, K)), xt(he + 1 + _e + le), xe = B.indexOf(b, D), he = B.indexOf(K, D), te && (Ge(), z)) return De();
                if (I && Y.length >= I) return De(!0);
                break;
              }
              q.push({ type: "Quotes", code: "InvalidQuotes", message: "Trailing quote on quoted field is malformed", row: Y.length, index: D }), he++;
            }
          }
          else if (L && W.length === 0 && B.substring(D, D + re) === L) {
            if (ye === -1) return De();
            D = ye + le, ye = B.indexOf(C, D), xe = B.indexOf(b, D);
          } else if (xe !== -1 && (xe < ye || ye === -1)) W.push(B.substring(D, xe)), D = xe + G, xe = B.indexOf(b, D);
          else {
            if (ye === -1) break;
            if (W.push(B.substring(D, ye)), xt(ye + le), te && (Ge(), z)) return De();
            if (I && Y.length >= I) return De(!0);
          }
          return ze();
          function Ve(Ne) {
            Y.push(Ne), ie = D;
          }
          function Je(Ne) {
            var Fe = 0;
            return Fe = Ne !== -1 && (Ne = B.substring(he + 1, Ne)) && Ne.trim() === "" ? Ne.length : Fe;
          }
          function ze(Ne) {
            return H || (Ne === void 0 && (Ne = B.substring(D)), W.push(Ne), D = ee, Ve(W), te && Ge()), De();
          }
          function xt(Ne) {
            D = Ne, Ve(W), W = [], ye = B.indexOf(C, D);
          }
          function De(Ne) {
            if (h.header && !J && Y.length && !T) {
              var Fe = Y[0], Ye = /* @__PURE__ */ Object.create(null), Nt = new Set(Fe);
              let Wt = !1;
              for (let gt = 0; gt < Fe.length; gt++) {
                let Qe = Fe[gt];
                if (Ye[Qe = m(h.transformHeader) ? h.transformHeader(Qe, gt) : Qe]) {
                  let st, rt = Ye[Qe];
                  for (; st = Qe + "_" + rt, rt++, Nt.has(st); ) ;
                  Nt.add(st), Fe[gt] = st, Ye[Qe]++, Wt = !0, (A = A === null ? {} : A)[st] = Qe;
                } else Ye[Qe] = 1, Fe[gt] = Qe;
                Nt.add(Qe);
              }
              T = !0;
            }
            return { data: Y, errors: q, meta: { delimiter: b, linebreak: C, aborted: z, truncated: !!Ne, cursor: ie + (J || 0), renamedHeaders: A } };
          }
          function Ge() {
            E(De()), Y = [], q = [];
          }
        }, this.abort = function() {
          z = !0;
        }, this.getCharIndex = function() {
          return D;
        };
      }
      function p(h) {
        var b = h.data, C = s[b.workerId], L = !1;
        if (b.error) C.userError(b.error, b.file);
        else if (b.results && b.results.data) {
          var E = { abort: function() {
            L = !0, _(b.workerId, { data: [], errors: [], meta: { aborted: !0 } });
          }, pause: S, resume: S };
          if (m(C.userStep)) {
            for (var I = 0; I < b.results.data.length && (C.userStep({ data: b.results.data[I], errors: b.results.errors, meta: b.results.meta }, E), !L); I++) ;
            delete b.results;
          } else m(C.userChunk) && (C.userChunk(b.results, E, b.file), delete b.results);
        }
        b.finished && !L && _(b.workerId, b.results);
      }
      function _(h, b) {
        var C = s[h];
        m(C.userComplete) && C.userComplete(b), C.terminate(), delete s[h];
      }
      function S() {
        throw new Error("Not implemented.");
      }
      function O(h) {
        if (typeof h != "object" || h === null) return h;
        var b, C = Array.isArray(h) ? [] : {};
        for (b in h) C[b] = O(h[b]);
        return C;
      }
      function N(h, b) {
        return function() {
          h.apply(b, arguments);
        };
      }
      function m(h) {
        return typeof h == "function";
      }
      return o.parse = function(h, b) {
        var C = (b = b || {}).dynamicTyping || !1;
        if (m(C) && (b.dynamicTypingFunction = C, C = {}), b.dynamicTyping = C, b.transform = !!m(b.transform) && b.transform, !b.worker || !o.WORKERS_SUPPORTED) return C = null, o.NODE_STREAM_INPUT, typeof h == "string" ? (h = ((L) => L.charCodeAt(0) !== 65279 ? L : L.slice(1))(h), C = new (b.download ? f : $)(b)) : h.readable === !0 && m(h.read) && m(h.on) ? C = new M(b) : (i.File && h instanceof File || h instanceof Object) && (C = new x(b)), C.stream(h);
        (C = (() => {
          var L;
          return !!o.WORKERS_SUPPORTED && (L = (() => {
            var E = i.URL || i.webkitURL || null, I = n.toString();
            return o.BLOB_URL || (o.BLOB_URL = E.createObjectURL(new Blob(["var global = (function() { if (typeof self !== 'undefined') { return self; } if (typeof window !== 'undefined') { return window; } if (typeof global !== 'undefined') { return global; } return {}; })(); global.IS_PAPA_WORKER=true; ", "(", I, ")();"], { type: "text/javascript" })));
          })(), (L = new i.Worker(L)).onmessage = p, L.id = c++, s[L.id] = L);
        })()).userStep = b.step, C.userChunk = b.chunk, C.userComplete = b.complete, C.userError = b.error, b.step = m(b.step), b.chunk = m(b.chunk), b.complete = m(b.complete), b.error = m(b.error), delete b.worker, C.postMessage({ input: h, config: b, workerId: C.id });
      }, o.unparse = function(h, b) {
        var C = !1, L = !0, E = ",", I = `\r
`, R = '"', A = R + R, T = !1, K = null, F = !1, D = ((() => {
          if (typeof b == "object") {
            if (typeof b.delimiter != "string" || o.BAD_DELIMITERS.filter(function(J) {
              return b.delimiter.indexOf(J) !== -1;
            }).length || (E = b.delimiter), typeof b.quotes != "boolean" && typeof b.quotes != "function" && !Array.isArray(b.quotes) || (C = b.quotes), typeof b.skipEmptyLines != "boolean" && typeof b.skipEmptyLines != "string" || (T = b.skipEmptyLines), typeof b.newline == "string" && (I = b.newline), typeof b.quoteChar == "string" && (R = b.quoteChar), typeof b.header == "boolean" && (L = b.header), Array.isArray(b.columns)) {
              if (b.columns.length === 0) throw new Error("Option columns is empty");
              K = b.columns;
            }
            b.escapeChar !== void 0 && (A = b.escapeChar + R), b.escapeFormulae instanceof RegExp ? F = b.escapeFormulae : typeof b.escapeFormulae == "boolean" && b.escapeFormulae && (F = /^[=+\-@\t\r].*$/);
          }
        })(), new RegExp(u(R), "g"));
        if (typeof h == "string" && (h = JSON.parse(h)), Array.isArray(h)) {
          if (!h.length || Array.isArray(h[0])) return z(null, h, T);
          if (typeof h[0] == "object") return z(K || Object.keys(h[0]), h, T);
        } else if (typeof h == "object") return typeof h.data == "string" && (h.data = JSON.parse(h.data)), Array.isArray(h.data) && (h.fields || (h.fields = h.meta && h.meta.fields || K), h.fields || (h.fields = Array.isArray(h.data[0]) ? h.fields : typeof h.data[0] == "object" ? Object.keys(h.data[0]) : []), Array.isArray(h.data[0]) || typeof h.data[0] == "object" || (h.data = [h.data])), z(h.fields || [], h.data || [], T);
        throw new Error("Unable to serialize unrecognized input");
        function z(J, H, ee) {
          var G = "", le = (typeof J == "string" && (J = JSON.parse(J)), typeof H == "string" && (H = JSON.parse(H)), Array.isArray(J) && 0 < J.length), re = !Array.isArray(H[0]);
          if (le && L) {
            for (var te = 0; te < J.length; te++) 0 < te && (G += E), G += B(J[te], te);
            0 < H.length && (G += I);
          }
          for (var Y = 0; Y < H.length; Y++) {
            var q = (le ? J : H[Y]).length, W = !1, ie = le ? Object.keys(H[Y]).length === 0 : H[Y].length === 0;
            if (ee && !le && (W = ee === "greedy" ? H[Y].join("").trim() === "" : H[Y].length === 1 && H[Y][0].length === 0), ee === "greedy" && le) {
              for (var ae = [], fe = 0; fe < q; fe++) {
                var xe = re ? J[fe] : fe;
                ae.push(H[Y][xe]);
              }
              W = ae.join("").trim() === "";
            }
            if (!W) {
              for (var ye = 0; ye < q; ye++) {
                0 < ye && !ie && (G += E);
                var Me = le && re ? J[ye] : ye;
                G += B(H[Y][Me], ye);
              }
              Y < H.length - 1 && (!ee || 0 < q && !ie) && (G += I);
            }
          }
          return G;
        }
        function B(J, H) {
          var ee, G;
          return J == null ? "" : J.constructor === Date ? JSON.stringify(J).slice(1, 25) : (G = !1, F && typeof J == "string" && F.test(J) && (J = "'" + J, G = !0), ee = J.toString().replace(D, A), (G = G || C === !0 || typeof C == "function" && C(J, H) || Array.isArray(C) && C[H] || ((le, re) => {
            for (var te = 0; te < re.length; te++) if (-1 < le.indexOf(re[te])) return !0;
            return !1;
          })(ee, o.BAD_DELIMITERS) || -1 < ee.indexOf(E) || ee.charAt(0) === " " || ee.charAt(ee.length - 1) === " ") ? R + ee + R : ee);
        }
      }, o.RECORD_SEP = "", o.UNIT_SEP = "", o.BYTE_ORDER_MARK = "\uFEFF", o.BAD_DELIMITERS = ["\r", `
`, '"', o.BYTE_ORDER_MARK], o.WORKERS_SUPPORTED = !a && !!i.Worker, o.NODE_STREAM_INPUT = 1, o.LocalChunkSize = 10485760, o.RemoteChunkSize = 5242880, o.DefaultDelimiter = ",", o.Parser = w, o.ParserHandle = v, o.NetworkStreamer = f, o.FileStreamer = x, o.StringStreamer = $, o.ReadableStreamStreamer = M, i.jQuery && ((r = i.jQuery).fn.parse = function(h) {
        var b = h.config || {}, C = [];
        return this.each(function(I) {
          if (!(r(this).prop("tagName").toUpperCase() === "INPUT" && r(this).attr("type").toLowerCase() === "file" && i.FileReader) || !this.files || this.files.length === 0) return !0;
          for (var R = 0; R < this.files.length; R++) C.push({ file: this.files[R], inputElem: this, instanceConfig: r.extend({}, b) });
        }), L(), this;
        function L() {
          if (C.length === 0) m(h.complete) && h.complete();
          else {
            var I, R, A, T, K = C[0];
            if (m(h.before)) {
              var F = h.before(K.file, K.inputElem);
              if (typeof F == "object") {
                if (F.action === "abort") return I = "AbortError", R = K.file, A = K.inputElem, T = F.reason, void (m(h.error) && h.error({ name: I }, R, A, T));
                if (F.action === "skip") return void E();
                typeof F.config == "object" && (K.instanceConfig = r.extend(K.instanceConfig, F.config));
              } else if (F === "skip") return void E();
            }
            var D = K.instanceConfig.complete;
            K.instanceConfig.complete = function(z) {
              m(D) && D(z, K.file, K.inputElem), E();
            }, o.parse(K.file, K.instanceConfig);
          }
        }
        function E() {
          C.splice(0, 1), L();
        }
      }), l && (i.onmessage = function(h) {
        h = h.data, o.WORKER_ID === void 0 && h && (o.WORKER_ID = h.workerId), typeof h.input == "string" ? i.postMessage({ workerId: o.WORKER_ID, results: o.parse(h.input, h.config), finished: !0 }) : (i.File && h.input instanceof File || h.input instanceof Object) && (h = o.parse(h.input, h.config)) && i.postMessage({ workerId: o.WORKER_ID, results: h, finished: !0 });
      }), (f.prototype = Object.create(d.prototype)).constructor = f, (x.prototype = Object.create(d.prototype)).constructor = x, ($.prototype = Object.create($.prototype)).constructor = $, (M.prototype = Object.create(d.prototype)).constructor = M, o;
    });
  })(an)), an.exports;
}
var lu = au();
const _i = /* @__PURE__ */ Rt(lu);
var su = /* @__PURE__ */ y('<div class="backdrop-blur-sm overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex"><svg class="w-20 h-20 animate-spin"xmlns=http://www.w3.org/2000/svg viewBox="0 0 94.53 98.372"><circle cx=23.536 cy=16.331 r=8.646 style=fill:#0a77e8></circle><circle cx=8.646 cy=36.698 r=8.646 style=fill:#0f9af0></circle><circle cx=8.646 cy=61.867 r=8.646 style=fill:#0f9af0></circle><circle cx=23.536 cy=82.233 r=8.646 style=fill:#13bdf7></circle><circle cx=47.361 cy=89.726 r=8.646 style=fill:#13bdf7></circle><circle cx=71.282 cy=82.233 r=8.646 style=fill:#18e0ff></circle><circle cx=85.884 cy=61.867 r=8.646 style=fill:#65eaff></circle><circle cx=85.884 cy=36.698 r=8.646 style=fill:#b2f5ff></circle><circle cx=47.361 cy=8.646 r=8.646 style=fill:#1d4970>'), ou = /* @__PURE__ */ y("<span class=text-pink-600>*"), du = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), cu = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), uu = /* @__PURE__ */ y('<svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4">'), gu = /* @__PURE__ */ y('<svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">'), hu = /* @__PURE__ */ y('<div class="font-light text-sm space-x-2 py-2.5 px-2 col-span-12 space-y-4"><div class=preview-class><div class="container mx-auto"><div class="scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-50 dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-500 overflow-x-scroll scrollbar-thumb-rounded-full scrollbar-track-rounded-full"><table class="table-auto w-full"><thead class="text-xs font-semibold uppercase text-gray-400 bg-gray-50"><tr></tr></thead><tbody class="text-sm divide-y divide-gray-100"></tbody></table></div><br><span class="bg-red-100 text-red-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-800"></span><span class="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">'), fu = /* @__PURE__ */ y('<div><div class="grid grid-cols-12 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2 col-span-11"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm space-x-2 py-2.5 px-2 space-y-4 flex justify-end -mt-2"><input type=file accept=.csv class="hidden w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"style=color:transparent></div><div class=col-span-12></div><div class="col-span-12 pb-4">'), mu = /* @__PURE__ */ y('<th class="p-2 whitespace-nowrap"><div class="font-semibold text-left">'), vu = /* @__PURE__ */ y("<tr>"), bu = /* @__PURE__ */ y('<td class="p-2 whitespace-nowrap"><div class=text-left>'), wu = /* @__PURE__ */ y('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), xu = /* @__PURE__ */ y('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), yu = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="grid grid-cols-12"><div class="col-span-11 text-justify mr-1">');
const Kr = (e) => {
  const [t] = nt(), [n, i] = j([]), [r, a] = j([]), [l, s] = j(""), [c, o] = j(!1), [d, f] = j("");
  let x = new FileReader();
  const $ = e.config, [M] = j($.formMode > 1 ? !0 : e.component.disableInput);
  $e(() => {
    e.value && (i(Object.keys(e.value[0])), a([Object.values(e.value[0]), Object.values(e.value[1]), Object.values(e.value[2]), Object.values(e.value[3]), Object.values(e.value[4])]));
  });
  let v = (m) => {
    if (o(!0), JSON.parse(JSON.stringify(e.value)), m.target.files && m.target.files[0]) {
      var h = ["csv", "txt"];
      let b = m.target.files[0], C = b.name.split(".").pop().toLowerCase();
      if (!h.includes(C))
        ve(t.details.language[0].fileInvalidFormat);
      else {
        let L = (b.size / 1048576).toFixed(2), E = !0, I = !0;
        e.component.sizeInput && (E = e.component.sizeInput[0].min !== void 0 ? Number(L) > Number(e.component.sizeInput[0].min) : !0, I = e.component.sizeInput[0].max !== void 0 ? Number(L) < Number(e.component.sizeInput[0].max) : !0, !I && ve(t.details.language[0].fileInvalidMaxSize + e.component.sizeInput[0].max), !E && ve(t.details.language[0].fileInvalidMinSize + e.component.sizeInput[0].min), o(!1)), E && I && (x.readAsDataURL(b), x.onload = (R) => {
          _i.parse(b, {
            download: !0,
            delimiter: "",
            // auto-detect
            complete: function(A) {
              let T = A.data[0], K = [A.data[1], A.data[2], A.data[3], A.data[4], A.data[5]], F = A.data.slice(1).map((D) => {
                var z = {};
                return T.forEach((B, J) => {
                  z[B] = D[J];
                }), z;
              });
              i(T), a(K), o(!1), e.onValueChange(F), je(t.details.language[0].fileUploaded);
            }
          });
        });
      }
    }
  };
  const u = ({
    data: m,
    fileName: h,
    fileType: b
  }) => {
    const C = new Blob([m], {
      type: b
    }), L = document.createElement("a");
    L.download = h, L.href = window.URL.createObjectURL(C);
    const E = new MouseEvent("click", {
      view: window,
      bubbles: !0,
      cancelable: !0
    });
    L.dispatchEvent(E), L.remove();
  }, w = (m) => {
    m.preventDefault(), u({
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
  }, [p, _] = j(!1), S = () => {
    p() ? _(!1) : _(!0);
  }, [O] = j(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [N] = j($.formMode > 2 && e.comments == 0);
  return (() => {
    var m = fu(), h = m.firstChild, b = h.firstChild, C = b.firstChild, L = C.firstChild, E = C.nextSibling, I = b.nextSibling, R = I.firstChild, A = I.nextSibling, T = A.nextSibling;
    return k(m, g(P, {
      get when() {
        return c();
      },
      get children() {
        return su();
      }
    }), h), k(C, g(P, {
      get when() {
        return e.component.required;
      },
      get children() {
        return ou();
      }
    }), null), k(C, g(P, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var K = du();
        return K.$$click = S, K;
      }
    }), null), k(E, g(P, {
      get when() {
        return p();
      },
      get children() {
        var K = cu();
        return V(() => K.innerHTML = e.component.hint), K;
      }
    })), R.addEventListener("change", (K) => {
      v(K);
    }), k(I, g(P, {
      get when() {
        return e.value;
      },
      get children() {
        return g(Pe, {
          color: "teal",
          onClick: (K) => w(K),
          get children() {
            return uu();
          }
        });
      }
    }), null), k(I, g(Pe, {
      color: "fuchsia",
      get disabled() {
        return M();
      },
      onClick: (K) => {
        document.getElementById("inputFile_" + e.component.dataKey).click();
      },
      get title() {
        return t.details.language[0].uploadCsv;
      },
      get children() {
        return gu();
      }
    }), null), k(I, g(P, {
      get when() {
        return O();
      },
      get children() {
        return g(Ae, {
          get disabled() {
            return N();
          },
          onClick: () => e.openRemark(e.component.dataKey),
          get comments() {
            return e.comments;
          }
        });
      }
    }), null), k(h, g(P, {
      get when() {
        return e.value;
      },
      get children() {
        var K = hu(), F = K.firstChild, D = F.firstChild, z = D.firstChild, B = z.firstChild, J = B.firstChild, H = J.firstChild, ee = J.nextSibling, G = z.nextSibling, le = G.nextSibling, re = le.nextSibling;
        return k(H, g(ce, {
          get each() {
            return n();
          },
          children: (te, Y) => (() => {
            var q = mu(), W = q.firstChild;
            return k(W, te), q;
          })()
        })), k(ee, g(ce, {
          get each() {
            return r();
          },
          children: (te, Y) => (() => {
            var q = vu();
            return k(q, g(ce, {
              each: te,
              children: (W, ie) => (() => {
                var ae = bu(), fe = ae.firstChild;
                return k(fe, W), ae;
              })()
            })), q;
          })()
        })), k(le, () => "rows : " + Number(e.value.length + 1)), k(re, () => "cols : " + n().length), K;
      }
    }), A), k(T, g(P, {
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
            var F = yu(), D = F.firstChild, z = D.firstChild;
            return k(D, g(me, {
              get children() {
                return [g(Q, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return wu();
                  }
                }), g(Q, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return xu();
                  }
                })];
              }
            }), z), z.innerHTML = K, V((B) => Z(D, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, B)), F;
          })()
        });
      }
    })), V((K) => {
      var F = e.component.label, D = "inputFile_" + e.component.dataKey, z = e.component.dataKey, B = {
        " border-b border-orange-500 pb-3 ": e.classValidation === 1,
        " border-b border-pink-600 pb-3 ": e.classValidation === 2
      };
      return F !== K.e && (L.innerHTML = K.e = F), D !== K.t && U(R, "id", K.t = D), z !== K.a && U(R, "name", K.a = z), K.o = Z(A, B, K.o), K;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0
    }), m;
  })();
};
ge(["click"]);
var pu = /* @__PURE__ */ y('<div class="modal-confirmation fixed z-10 inset-0 overflow-y-auto"aria-labelledby=modal-title role=dialog aria-modal=true><div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"><div class="fixed inset-0 bg-gray-500/75 transition-opacity"aria-hidden=true></div><span class="hidden sm:inline-block sm:align-middle sm:h-screen"aria-hidden=true>&#8203;</span><div class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"><div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4"><div class="sm:flex sm:items-start"><div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"><svg xmlns=http://www.w3.org/2000/svg class="h-6 w-6 text-red-600"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div><div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left"><h3 class="text-lg leading-6 font-medium text-gray-900"id=titleModalConfirmation>Confirmation</h3><div class=mt-2><p class="text-sm text-gray-500"id=contentModalConfirmation>Are you sure you want to get present time?</p></div></div></div></div><div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"><button type=button class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">Get Time</button><button type=button class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Cancel'), ku = /* @__PURE__ */ y("<span class=text-pink-600>*"), $u = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), _u = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), Su = /* @__PURE__ */ y('<svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z">'), Cu = /* @__PURE__ */ y('<div class="font-light text-sm space-x-2 py-2.5 px-2 col-span-12 space-y-4 -mt-2"><span class="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">'), Mu = /* @__PURE__ */ y('<div><div class="grid grid-cols-12 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2 col-span-11"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm space-x-2 py-2.5 px-2 space-y-4 flex justify-end items-end -mt-2"></div><div class=col-span-12></div><div class="col-span-12 pb-4">'), Iu = /* @__PURE__ */ y('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), Eu = /* @__PURE__ */ y('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Lu = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="grid grid-cols-12"><div class="col-span-11 text-justify mr-1">');
const zr = (e) => {
  const t = e.config, [n, i] = j(0), [r] = j(t.formMode > 1 ? !0 : e.component.disableInput), [a, l] = j(!1), s = () => {
    a() ? l(!1) : l(!0);
  }, [c] = j(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [o] = j(t.formMode > 2 && e.comments == 0), d = () => {
    i(1), $();
  }, f = () => {
    let M = We().format("YYYY-MM-DD HH:mm:ss");
    e.onValueChange(M);
  };
  let x = () => {
    i(0);
  };
  const $ = () => {
    let M = document.querySelector("#titleModalConfirmation"), v = document.querySelector("#contentModalConfirmation");
    M.innerHTML = e.component.titleModalConfirmation !== void 0 ? e.component.titleModalConfirmation : "Confirmation", v.innerHTML = e.component.contentModalConfirmation !== void 0 ? e.component.contentModalConfirmation : "Are you certain to generate the current time?";
  };
  return (() => {
    var M = Mu(), v = M.firstChild, u = v.firstChild, w = u.firstChild, p = w.firstChild, _ = w.nextSibling, S = u.nextSibling, O = S.nextSibling, N = O.nextSibling;
    return k(M, g(P, {
      get when() {
        return n() == 1;
      },
      get children() {
        var m = pu(), h = m.firstChild, b = h.firstChild, C = b.nextSibling, L = C.nextSibling, E = L.firstChild, I = E.nextSibling, R = I.firstChild, A = R.nextSibling;
        return R.$$click = (T) => f(), A.$$click = (T) => x(), m;
      }
    }), v), k(w, g(P, {
      get when() {
        return e.component.required;
      },
      get children() {
        return ku();
      }
    }), null), k(w, g(P, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var m = $u();
        return m.$$click = s, m;
      }
    }), null), k(_, g(P, {
      get when() {
        return a();
      },
      get children() {
        var m = _u();
        return V(() => m.innerHTML = e.component.hint), m;
      }
    })), k(S, g(Pe, {
      color: "teal",
      onClick: () => d(),
      get disabled() {
        return r();
      },
      get children() {
        return Su();
      }
    }), null), k(S, g(P, {
      get when() {
        return c();
      },
      get children() {
        return g(Ae, {
          get disabled() {
            return o();
          },
          onClick: () => e.openRemark(e.component.dataKey),
          get comments() {
            return e.comments;
          }
        });
      }
    }), null), k(v, g(P, {
      get when() {
        return e.value !== "";
      },
      get children() {
        var m = Cu(), h = m.firstChild;
        return k(h, () => e.value), m;
      }
    }), O), k(N, g(P, {
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
            var h = Lu(), b = h.firstChild, C = b.firstChild;
            return k(b, g(me, {
              get children() {
                return [g(Q, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return Iu();
                  }
                }), g(Q, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return Eu();
                  }
                })];
              }
            }), C), C.innerHTML = m, V((L) => Z(b, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, L)), h;
          })()
        });
      }
    })), V((m) => {
      var h = e.component.label, b = {
        " border-b border-orange-500 pb-3 ": e.classValidation === 1,
        " border-b border-pink-600 pb-3 ": e.classValidation === 2
      };
      return h !== m.e && (p.innerHTML = m.e = h), m.t = Z(O, b, m.t), m;
    }, {
      e: void 0,
      t: void 0
    }), M;
  })();
};
ge(["click"]);
class xn {
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
    const r = t.x - n.x, a = t.y - n.y, l = n.x - i.x, s = n.y - i.y, c = { x: (t.x + n.x) / 2, y: (t.y + n.y) / 2 }, o = { x: (n.x + i.x) / 2, y: (n.y + i.y) / 2 }, d = Math.sqrt(r * r + a * a), f = Math.sqrt(l * l + s * s), x = c.x - o.x, $ = c.y - o.y, M = f / (d + f), v = { x: o.x + x * M, y: o.y + $ * M }, u = n.x - v.x, w = n.y - v.y;
    return {
      c1: new xn(c.x + u, c.y + w),
      c2: new xn(o.x + u, o.y + w)
    };
  }
  constructor(t, n, i, r, a, l) {
    this.startPoint = t, this.control2 = n, this.control1 = i, this.endPoint = r, this.startWidth = a, this.endWidth = l;
  }
  length() {
    let n = 0, i, r;
    for (let a = 0; a <= 10; a += 1) {
      const l = a / 10, s = this.point(l, this.startPoint.x, this.control1.x, this.control2.x, this.endPoint.x), c = this.point(l, this.startPoint.y, this.control1.y, this.control2.y, this.endPoint.y);
      if (a > 0) {
        const o = s - i, d = c - r;
        n += Math.sqrt(o * o + d * d);
      }
      i = s, r = c;
    }
    return n;
  }
  point(t, n, i, r, a) {
    return n * (1 - t) * (1 - t) * (1 - t) + 3 * i * (1 - t) * (1 - t) * t + 3 * r * (1 - t) * t * t + a * t * t * t;
  }
}
class Ou {
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
function Au(e, t = 250) {
  let n = 0, i = null, r, a, l;
  const s = () => {
    n = Date.now(), i = null, r = e.apply(a, l), i || (a = null, l = []);
  };
  return function(...o) {
    const d = Date.now(), f = t - (d - n);
    return a = this, l = o, f <= 0 || f > t ? (i && (clearTimeout(i), i = null), n = d, r = e.apply(a, l), i || (a = null, l = [])) : i || (i = window.setTimeout(s, f)), r;
  };
}
class $t extends Ou {
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
    }, this.velocityFilterWeight = n.velocityFilterWeight || 0.7, this.minWidth = n.minWidth || 0.5, this.maxWidth = n.maxWidth || 2.5, this.throttle = "throttle" in n ? n.throttle : 16, this.minDistance = "minDistance" in n ? n.minDistance : 5, this.dotSize = n.dotSize || 0, this.penColor = n.penColor || "black", this.backgroundColor = n.backgroundColor || "rgba(0,0,0,0)", this.compositeOperation = n.compositeOperation || "source-over", this.canvasContextOptions = "canvasContextOptions" in n ? n.canvasContextOptions : {}, this._strokeMoveUpdate = this.throttle ? Au($t.prototype._strokeUpdate, this.throttle) : $t.prototype._strokeUpdate, this._ctx = t.getContext("2d", this.canvasContextOptions), this.clear(), this.on();
  }
  clear() {
    const { _ctx: t, canvas: n } = this;
    t.fillStyle = this.backgroundColor, t.clearRect(0, 0, n.width, n.height), t.fillRect(0, 0, n.width, n.height), this._data = [], this._reset(this._getPointGroupOptions()), this._isEmpty = !0;
  }
  fromDataURL(t, n = {}) {
    return new Promise((i, r) => {
      const a = new Image(), l = n.ratio || window.devicePixelRatio || 1, s = n.width || this.canvas.width / l, c = n.height || this.canvas.height / l, o = n.xOffset || 0, d = n.yOffset || 0;
      this._reset(this._getPointGroupOptions()), a.onload = () => {
        this._ctx.drawImage(a, o, d, s, c), i();
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
    const n = t.clientX, i = t.clientY, r = t.pressure !== void 0 ? t.pressure : t.force !== void 0 ? t.force : 0, a = this._createPoint(n, i, r), l = this._data[this._data.length - 1], s = l.points, c = s.length > 0 && s[s.length - 1], o = c ? a.distanceTo(c) <= this.minDistance : !1, d = this._getPointGroupOptions(l);
    if (!c || !(c && o)) {
      const f = this._addPoint(a, d);
      c ? f && this._drawCurve(f, d) : this._drawDot(a, d), s.push({
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
    return new xn(t - r.left, n - r.top, i, (/* @__PURE__ */ new Date()).getTime());
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
    const r = i.velocityFilterWeight * n.velocityFrom(t) + (1 - i.velocityFilterWeight) * this._lastVelocity, a = this._strokeWidth(r, i), l = {
      end: a,
      start: this._lastWidth
    };
    return this._lastVelocity = r, this._lastWidth = a, l;
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
    for (let l = 0; l < a; l += 1) {
      const s = l / a, c = s * s, o = c * s, d = 1 - s, f = d * d, x = f * d;
      let $ = x * t.startPoint.x;
      $ += 3 * f * s * t.control1.x, $ += 3 * d * c * t.control2.x, $ += o * t.endPoint.x;
      let M = x * t.startPoint.y;
      M += 3 * f * s * t.control1.y, M += 3 * d * c * t.control2.y, M += o * t.endPoint.y;
      const v = Math.min(t.startWidth + o * r, n.maxWidth);
      this._drawCurveSegment($, M, v);
    }
    i.closePath(), i.fill();
  }
  _drawDot(t, n) {
    const i = this._ctx, r = n.dotSize > 0 ? n.dotSize : (n.minWidth + n.maxWidth) / 2;
    i.beginPath(), this._drawCurveSegment(t.x, t.y, r), i.closePath(), i.fillStyle = n.penColor, i.fill();
  }
  _fromData(t, n, i) {
    for (const r of t) {
      const { points: a } = r, l = this._getPointGroupOptions(r);
      if (a.length > 1)
        for (let s = 0; s < a.length; s += 1) {
          const c = a[s], o = new xn(c.x, c.y, c.pressure, c.time);
          s === 0 && this._reset(l);
          const d = this._addPoint(o, l);
          d && n(d, l);
        }
      else
        this._reset(l), i(a[0], l);
    }
  }
  toSVG({ includeBackgroundColor: t = !1 } = {}) {
    const n = this._data, i = Math.max(window.devicePixelRatio || 1, 1), r = 0, a = 0, l = this.canvas.width / i, s = this.canvas.height / i, c = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    if (c.setAttribute("xmlns", "http://www.w3.org/2000/svg"), c.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink"), c.setAttribute("viewBox", `${r} ${a} ${l} ${s}`), c.setAttribute("width", l.toString()), c.setAttribute("height", s.toString()), t && this.backgroundColor) {
      const o = document.createElement("rect");
      o.setAttribute("width", "100%"), o.setAttribute("height", "100%"), o.setAttribute("fill", this.backgroundColor), c.appendChild(o);
    }
    return this._fromData(n, (o, { penColor: d }) => {
      const f = document.createElement("path");
      if (!isNaN(o.control1.x) && !isNaN(o.control1.y) && !isNaN(o.control2.x) && !isNaN(o.control2.y)) {
        const x = `M ${o.startPoint.x.toFixed(3)},${o.startPoint.y.toFixed(3)} C ${o.control1.x.toFixed(3)},${o.control1.y.toFixed(3)} ${o.control2.x.toFixed(3)},${o.control2.y.toFixed(3)} ${o.endPoint.x.toFixed(3)},${o.endPoint.y.toFixed(3)}`;
        f.setAttribute("d", x), f.setAttribute("stroke-width", (o.endWidth * 2.25).toFixed(3)), f.setAttribute("stroke", d), f.setAttribute("fill", "none"), f.setAttribute("stroke-linecap", "round"), c.appendChild(f);
      }
    }, (o, { penColor: d, dotSize: f, minWidth: x, maxWidth: $ }) => {
      const M = document.createElement("circle"), v = f > 0 ? f : (x + $) / 2;
      M.setAttribute("r", v.toString()), M.setAttribute("cx", o.x.toString()), M.setAttribute("cy", o.y.toString()), M.setAttribute("fill", d), c.appendChild(M);
    }), c.outerHTML;
  }
}
var Ru = /* @__PURE__ */ y("<span class=text-pink-600>*"), Vu = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Nu = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), Tu = /* @__PURE__ */ y('<svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4">'), Pu = /* @__PURE__ */ y('<svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M5 13l4 4L19 7">'), Du = /* @__PURE__ */ y('<svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">'), ju = /* @__PURE__ */ y('<div><div class="border-b border-gray-300/40 dark:border-gray-200/10 p-2"><div class="flex items-start gap-2"><div class="font-light text-sm space-y-2 py-2.5 px-2 flex-1"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 flex items-center gap-2 shrink-0"></div></div><div class="font-light text-sm space-x-2 py-2.5 px-2 space-y-4"><div class=preview-class><div class="container mx-auto space-y-3 "><canvas id=signature-pad class="relative rounded-lg w-full bg-white border-b-8 border-gray-100 border"></canvas></div></div></div><div></div><div class=pb-4>'), Ku = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), zu = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Fu = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="text-justify mr-1">');
const Fr = (e) => {
  const [t, n] = j(""), [i, r] = j([]), [a, l] = j(""), [s, c] = j(!0), o = e.config, [d] = j(o.formMode > 1 ? !0 : e.component.disableInput), [f, x] = j(!1), $ = () => {
    f() ? x(!1) : x(!0);
  }, [M] = j(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [v] = j(o.formMode > 2 && e.comments == 0);
  $e(() => {
    const S = document.querySelector("canvas"), O = new $t(S);
    if (O.clear(), r(O.toData()), l(O.toDataURL("image/png")), e.value[0]) {
      c(!1), e.value[0].value;
      let N = e.value[0].signature;
      const m = new $t(S);
      m.clear(), m.fromData(N);
    }
  });
  const u = () => {
    $e(() => {
      const S = document.querySelector("canvas");
      let O = Math.max(window.devicePixelRatio || 1, 1);
      if (S && (S.width = S.offsetWidth * O, S.height = S.width * (window.innerWidth < 720 ? 0.28 : 0.18), S.getContext("2d").scale(O, O), e.value[0])) {
        c(!1);
        let N = e.value[0].value, m = e.value[0].signature;
        const h = new $t(S);
        h.clear(), h.fromData(m), n(N);
      }
    });
  };
  window.onresize = u, u();
  const w = (S) => {
    const O = document.querySelector("canvas");
    new $t(O).clear(), c(!0);
    let m = JSON.parse(JSON.stringify(e.value));
    m = [], e.onValueChange(m);
  }, p = (S) => {
    const N = document.querySelector("canvas").toDataURL();
    if (i().length > 0) {
      let m = JSON.parse(JSON.stringify(e.value));
      m = [], m.push({
        value: N,
        type: "image/png",
        signature: i()
      }), e.onValueChange(m), je("Signature acquired!");
    } else
      ve("Please provide the appropriate signature!");
  }, _ = (S) => {
    if (S.preventDefault(), e.value[0]) {
      const O = document.createElement("a");
      O.download = e.component.dataKey + ".png", O.href = e.value[0].value;
      const N = new MouseEvent("click", {
        view: window,
        bubbles: !0,
        cancelable: !0
      });
      O.dispatchEvent(N), O.remove();
    }
  };
  return (() => {
    var S = ju(), O = S.firstChild, N = O.firstChild, m = N.firstChild, h = m.firstChild, b = h.firstChild, C = h.nextSibling, L = m.nextSibling, E = N.nextSibling, I = E.nextSibling, R = I.nextSibling;
    return k(h, g(P, {
      get when() {
        return e.component.required;
      },
      get children() {
        return Ru();
      }
    }), null), k(h, g(P, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var A = Vu();
        return A.$$click = $, A;
      }
    }), null), k(C, g(P, {
      get when() {
        return f();
      },
      get children() {
        var A = Nu();
        return V(() => A.innerHTML = e.component.hint), A;
      }
    })), k(L, g(P, {
      get when() {
        return e.value[0];
      },
      get children() {
        return g(Pe, {
          color: "teal",
          onClick: (A) => _(A),
          get children() {
            return Tu();
          }
        });
      }
    }), null), k(L, g(P, {
      get when() {
        return s();
      },
      get children() {
        return g(Pe, {
          color: "teal",
          onClick: (A) => p(),
          get children() {
            return Pu();
          }
        });
      }
    }), null), k(L, g(Pe, {
      color: "amber",
      onClick: (A) => w(),
      get children() {
        return Du();
      }
    }), null), k(L, g(P, {
      get when() {
        return M();
      },
      get children() {
        return g(Ae, {
          get disabled() {
            return v();
          },
          onClick: () => e.openRemark(e.component.dataKey),
          get comments() {
            return e.comments;
          }
        });
      }
    }), null), k(R, g(P, {
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
            var T = Fu(), K = T.firstChild, F = K.firstChild;
            return k(K, g(me, {
              get children() {
                return [g(Q, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return Ku();
                  }
                }), g(Q, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return zu();
                  }
                })];
              }
            }), F), F.innerHTML = A, V((D) => Z(K, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, D)), T;
          })()
        });
      }
    })), V((A) => {
      var T = e.component.label, K = {
        " border-b border-orange-500 pb-3 ": e.classValidation === 1,
        " border-b border-pink-600 pb-3 ": e.classValidation === 2
      };
      return T !== A.e && (b.innerHTML = A.e = T), A.t = Z(I, K, A.t), A;
    }, {
      e: void 0,
      t: void 0
    }), S;
  })();
};
ge(["click"]);
var Bu = /* @__PURE__ */ y("<svg>");
function Hu(e, t) {
  return (() => {
    var n = Bu();
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
        return Xe(Se({}, typeof t.style == "object" ? t.style : {}), {
          overflow: "visible"
        });
      },
      get innerHTML() {
        return ke(() => !!t.title)() ? `${e.c}<title>${t.title}</title>` : e.c;
      },
      src: void 0
    }), !0, !1), n;
  })();
}
function Br(e) {
  return Hu({ a: { fill: "none", stroke: "currentColor", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", viewBox: "0 0 24 24" }, c: '<path d="M6 9 12 15 18 9"/>' }, e);
}
var Uu = /* @__PURE__ */ y("<span class=text-pink-600>*"), Ju = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Wu = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), Si = /* @__PURE__ */ y('<input type=number class="w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400block pr-20"placeholder>'), qu = /* @__PURE__ */ y("<div class=shrink-0>"), Gu = /* @__PURE__ */ y('<div class="grid md:grid-cols-3 p-2 border-b border-gray-300/[.40] dark:border-gray-200/[.10]"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 md:col-span-2 flex items-start gap-2"><div class="flex-1 relative"><div class="absolute inset-y-0 right-0 flex items-center">'), Yu = /* @__PURE__ */ y('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), Qu = /* @__PURE__ */ y('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Zu = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="grid grid-cols-12"><div class="col-span-11 text-justify mr-1">');
const Xu = (e) => {
  const [t] = tt(), [n] = nt(), i = e.config, [r, a] = j(i.formMode > 1 ? !0 : e.component.disableInput), [l, s] = j(""), [c, o] = j(!1), [d, f] = j([]), [x, $] = j(""), [M, v] = j(!1), u = () => {
    M() ? v(!1) : v(!0);
  }, [w] = j(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [p] = j(i.formMode > 2 && e.comments == 0);
  let _ = (S, O, N) => {
    if (N == 2 && O.value != "" && O.value != null) {
      let m = JSON.parse(JSON.stringify(e.value));
      m = [], m.push({
        value: S,
        unit: O
      }), e.onValueChange(m);
    } else {
      let m = JSON.parse(JSON.stringify(e.value));
      m = [], m.push({
        value: S,
        unit: O
      }), e.onValueChange(m);
    }
  };
  switch (e.component.typeOption) {
    case 1: {
      try {
        let S = e.component.options.map((N, m) => ({
          value: N.value,
          label: N.label
        })), O = e.value && e.value != "" && e.value[0].unit && e.value[0].unit.value && e.value[0].unit.value != "" ? e.value[0].unit.value : "";
        $e(() => {
          s(e.component.label), f(S);
          let N = S.filter((m) => m.value.includes(O))[0] && O != "" ? S.filter((m) => m.value.includes(O))[0].label : "Select Unit";
          $(N), o(!0);
        });
      } catch (S) {
        ve(n.details.language[0].fetchFailed);
      }
      break;
    }
    case 2: {
      try {
        if (i.lookupMode === 1) {
          let S = e.component.sourceAPI[0], O = `${S.baseUrl}`;
          if (S.filterDependencies !== void 0 && S.filterDependencies.length > 0) {
            let C, L, E = O;
            C = S.filterDependencies.map((I, R) => {
              let A = I.sourceAnswer.split("@"), T = t.details.find((K) => K.dataKey == A[0]);
              if (T.answer) {
                const K = T.answer;
                if (K.length > 0) {
                  let F = encodeURI(K[K.length - 1].value);
                  L = `${I.params}=${F}`;
                }
              } else
                a(!0);
              return L;
            }).join("&"), O = `${E}?${C}`;
          }
          if (S.subResourceDependencies !== void 0 && S.subResourceDependencies.length > 0) {
            let C, L, E = O;
            C = S.subResourceDependencies.map((I, R) => {
              let A = I.sourceAnswer.split("@"), T = t.details.find((K) => K.dataKey == A[0]);
              if (T.answer) {
                const K = T.answer;
                K.length > 0 && (L = `${encodeURI(K[K.length - 1].value)}/${I.params}`);
              } else
                a(!0);
              return L;
            }).join("/"), O = `${E}/${C}`;
          }
          const N = {
            headers: S.headers,
            method: "GET"
          }, m = (C) => de(null, null, function* () {
            return yield fetch(C, N).catch((L) => ({
              success: !1,
              data: {},
              message: "500"
            })).then((L) => de(null, null, function* () {
              if (L.status === 200) {
                let E = yield L.json(), I = new Object();
                return I.success = !0, I.data = S.data !== "" ? E[S.data] : E, I.message = E.msg, I;
              } else
                return {
                  success: !1,
                  data: {},
                  message: L.status
                };
            })).then((L) => L);
          }), [h] = Ht(() => O, m);
          let b = e.value && e.value != "" && e.value[0].unit && e.value[0].unit.value && e.value[0].unit.value != "" ? e.value[0].unit.value : "";
          $e(() => {
            if (s(e.component.label), h())
              if (!h().success)
                ve(n.details.language[0].fetchFailed);
              else {
                let C = [];
                h().data.map((E, I) => {
                  C.push({
                    value: E[S.value],
                    label: E[S.label]
                  });
                });
                let L = C.find((E) => E.value == b) && b != "" ? C.find((E) => E.value == b).label : "Select Unit";
                f(C), $(L), o(!0);
              }
          });
        } else if (i.lookupMode === 2) {
          let S, O = [];
          S = e.component.sourceSelect;
          let N = S[0].id, m = S[0].version;
          S[0].parentCondition.length > 0 && S[0].parentCondition.map((C, L) => {
            let E = C.value.split("@"), I = t.details.find((R) => R.dataKey == E[0]);
            if (I.answer) {
              const R = I.answer;
              if (R.length > 0) {
                let A = R[R.length - 1].value.toString();
                O.push({
                  key: C.key,
                  value: A
                });
              }
            }
          });
          let h = (C) => {
            let L = [];
            if (C.data.length > 0) {
              let E = S[0].value, I = S[0].desc, R = e.value && e.value != "" && e.value[0].unit && e.value[0].unit.value && e.value[0].unit.value != "" ? e.value[0].unit.value : "";
              C.data.map((T, K) => {
                L.push({
                  value: T[E],
                  label: T[I]
                });
              });
              let A = L.find((T) => T.value == R) && R != "" ? L.find((T) => T.value == R).label : "Select Unit";
              s(e.component.label), f(L), $(A), o(!0);
            }
          };
          const b = e.MobileOfflineSearch(N, m, O, h);
        }
      } catch (S) {
        ve(n.details.language[0].fetchFailed);
      }
      break;
    }
    case 3: {
      try {
        let S, O, N = e.value && e.value != "" && e.value[0].unit && e.value[0].unit.value && e.value[0].unit.value != "" ? e.value[0].unit.value : "";
        if (e.component.sourceOption !== void 0 && e.component.typeOption === 3) {
          const h = t.details.findIndex((b) => b.dataKey === e.component.sourceOption);
          t.details[h].type, S = t.details[h].answer, S != null ? O = S.filter((b, C) => b.value != 0).map((b, C) => ({
            value: b.value,
            label: b.label
          })) : O = [];
        }
        let m = O.find((h) => h.value == N) && N != "" ? O.find((h) => h.value == N).label : "Select Unit";
        $e(() => {
          s(e.component.label), f(O), $(m), o(!0);
        });
      } catch (S) {
        ve(n.details.language[0].fetchFailed);
      }
      break;
    }
    default: {
      try {
        let S;
        e.component.options ? S = e.component.options.map((N, m) => ({
          value: N.value,
          label: N.label
        })) : S = [];
        let O = e.value && e.value != "" && e.value[0].unit && e.value[0].unit.value && e.value[0].unit.value != "" ? e.value[0].unit.value : "";
        $e(() => {
          s(e.component.label), f(S);
          let N = S.filter((m) => m.value.includes(O))[0] && O != "" ? S.filter((m) => m.value.includes(O))[0].label : "Select Unit";
          $(N), o(!0);
        });
      } catch (S) {
        ve(n.details.language[0].fetchFailed);
      }
      break;
    }
  }
  return (() => {
    var S = Gu(), O = S.firstChild, N = O.firstChild, m = N.firstChild, h = N.nextSibling, b = O.nextSibling, C = b.firstChild, L = C.firstChild;
    return k(N, g(P, {
      get when() {
        return e.component.required;
      },
      get children() {
        return Uu();
      }
    }), null), k(N, g(P, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var E = Ju();
        return E.$$click = u, E;
      }
    }), null), k(h, g(P, {
      get when() {
        return M();
      },
      get children() {
        var E = Wu();
        return V(() => E.innerHTML = e.component.hint), E;
      }
    })), k(C, g(P, {
      get when() {
        return e.component.lengthInput === void 0;
      },
      get children() {
        var E = Si();
        return E.addEventListener("change", (I) => {
          _(I ? I.currentTarget.value : "", e.value != null && e.value != "" ? e.value[0].unit ? e.value[0].unit : {
            value: "",
            label: ""
          } : {
            value: "",
            label: ""
          }, 1);
        }), V((I) => {
          var R = e.component.dataKey, A = {
            " border border-solid border-gray-300 ": e.classValidation === 0,
            " border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
            " border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
          }, T = r();
          return R !== I.e && U(E, "name", I.e = R), I.t = Z(E, A, I.t), T !== I.a && (E.disabled = I.a = T), I;
        }, {
          e: void 0,
          t: void 0,
          a: void 0
        }), V(() => E.value = e.value != null && e.value != "" ? e.value[0].value : ""), E;
      }
    }), L), k(C, g(P, {
      get when() {
        return ke(() => e.component.lengthInput !== void 0)() && e.component.lengthInput.length > 0;
      },
      get children() {
        var E = Si();
        return E.$$input = (I) => {
          const R = I.currentTarget;
          R.value.length > R.maxLength && (R.value = R.value.slice(0, R.maxLength));
        }, E.addEventListener("change", (I) => {
          _(I ? I.currentTarget.value : "", e.value != null && e.value != "" ? e.value[0].unit ? e.value[0].unit : {
            value: "",
            label: ""
          } : {
            value: "",
            label: ""
          }, 1);
        }), V((I) => {
          var R = e.component.dataKey, A = {
            " border border-solid border-gray-300 ": e.classValidation === 0,
            " border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
            " border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
          }, T = r(), K = e.component.lengthInput[0].maxlength !== void 0 ? e.component.lengthInput[0].maxlength : "", F = e.component.lengthInput[0].minlength !== void 0 ? e.component.lengthInput[0].minlength : "", D = e.component.rangeInput && e.component.rangeInput[0].max !== void 0 ? e.component.rangeInput[0].max : "", z = e.component.rangeInput && e.component.rangeInput[0].min !== void 0 ? e.component.rangeInput[0].min : "";
          return R !== I.e && U(E, "name", I.e = R), I.t = Z(E, A, I.t), T !== I.a && (E.disabled = I.a = T), K !== I.o && U(E, "maxlength", I.o = K), F !== I.i && U(E, "minlength", I.i = F), D !== I.n && U(E, "max", I.n = D), z !== I.s && U(E, "min", I.s = z), I;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0,
          i: void 0,
          n: void 0,
          s: void 0
        }), V(() => E.value = e.value != null && e.value != "" ? e.value[0].value : ""), E;
      }
    }), L), k(C, g(P, {
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
            var I = Zu(), R = I.firstChild, A = R.firstChild;
            return k(R, g(me, {
              get children() {
                return [g(Q, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return Yu();
                  }
                }), g(Q, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return Qu();
                  }
                })];
              }
            }), A), A.innerHTML = E, V((T) => Z(R, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, T)), I;
          })()
        });
      }
    }), L), k(L, g(Ot, et({
      class: "formgear-select-unit  w-full rounded font-light text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-0 border-transparent focus:outline-none  disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
    }, () => Lt(d() || [], {
      key: "label",
      filterable: !0
    }), {
      get disabled() {
        return r();
      },
      placeholder: "Unit",
      onChange: (E) => _(e.value != null && e.value != "" ? e.value[0].value : "", {
        value: E ? E.value : "",
        label: E ? E.label : ""
      }, 2),
      get initialValue() {
        return {
          value: e.value && e.value != "" && e.value[0].unit && e.value[0].unit.value && e.value[0].unit.value != "" ? e.value[0].unit.value : "",
          label: x
        };
      }
    })), null), k(L, g(Br, {
      size: 20,
      class: "text-gray-400  mr-3"
    }), null), k(b, g(P, {
      get when() {
        return w();
      },
      get children() {
        var E = qu();
        return k(E, g(Ae, {
          get disabled() {
            return p();
          },
          onClick: () => e.openRemark(e.component.dataKey),
          get comments() {
            return e.comments;
          }
        })), E;
      }
    }), null), V(() => m.innerHTML = e.component.label), S;
  })();
};
ge(["click", "input"]);
var e0 = /* @__PURE__ */ y("<span class=text-pink-600>*"), t0 = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), n0 = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), Ci = /* @__PURE__ */ y('<input type=number class="w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"placeholder>'), i0 = /* @__PURE__ */ y("<div class=shrink-0>"), r0 = /* @__PURE__ */ y('<div class="grid md:grid-cols-3 p-2 border-b border-gray-300/[.40] dark:border-gray-200/[.10]"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm py-2.5 px-2 md:col-span-2 flex items-start gap-2"><div class=flex-1>'), a0 = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), l0 = /* @__PURE__ */ y('<div class="flex justify-center items-start shrink-0"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), s0 = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="flex gap-2"><div class="flex-1 text-justify">');
const Hr = (e) => {
  const t = e.config, [n] = j(t.formMode > 1 ? !0 : e.component.disableInput), [i, r] = j(!1), a = () => {
    i() ? r(!1) : r(!0);
  };
  let l = Wn((o) => {
    let d = e.component.decimalLength ? e.component.decimalLength : 2;
    e.onValueChange(parseFloat(o).toFixed(d));
  }, 1e3);
  const [s] = j(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [c] = j(t.formMode > 2 && e.comments == 0);
  return (() => {
    var o = r0(), d = o.firstChild, f = d.firstChild, x = f.firstChild, $ = f.nextSibling, M = d.nextSibling, v = M.firstChild;
    return k(f, g(P, {
      get when() {
        return e.component.required;
      },
      get children() {
        return e0();
      }
    }), null), k(f, g(P, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var u = t0();
        return u.$$click = a, u;
      }
    }), null), k($, g(P, {
      get when() {
        return i();
      },
      get children() {
        var u = n0();
        return V(() => u.innerHTML = e.component.hint), u;
      }
    })), k(v, g(P, {
      get when() {
        return e.component.lengthInput === void 0;
      },
      get children() {
        var u = Ci();
        return u.$$keyup = (w) => l(w.currentTarget.value), V((w) => {
          var p = e.component.dataKey, _ = {
            " border border-solid border-gray-300 ": e.classValidation === 0,
            " border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
            " border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
          }, S = n();
          return p !== w.e && U(u, "name", w.e = p), w.t = Z(u, _, w.t), S !== w.a && (u.disabled = w.a = S), w;
        }, {
          e: void 0,
          t: void 0,
          a: void 0
        }), V(() => u.value = e.value), u;
      }
    }), null), k(v, g(P, {
      get when() {
        return ke(() => e.component.lengthInput !== void 0)() && e.component.lengthInput.length > 0;
      },
      get children() {
        var u = Ci();
        return u.$$input = (w) => {
          const p = w.currentTarget;
          p.value.length > p.maxLength && (p.value = p.value.slice(0, p.maxLength));
        }, u.$$keyup = (w) => l(w.currentTarget.value), V((w) => {
          var p = e.component.dataKey, _ = {
            " border border-solid border-gray-300 ": e.classValidation === 0,
            " border-orange-500 dark:bg-orange-100 ": e.classValidation === 1,
            " border-pink-600 dark:bg-pink-100 ": e.classValidation === 2
          }, S = n(), O = e.component.lengthInput[0].maxlength !== void 0 ? e.component.lengthInput[0].maxlength : "", N = e.component.lengthInput[0].minlength !== void 0 ? e.component.lengthInput[0].minlength : "", m = e.component.rangeInput && e.component.rangeInput[0].max !== void 0 ? e.component.rangeInput[0].max : "", h = e.component.rangeInput && e.component.rangeInput[0].min !== void 0 ? e.component.rangeInput[0].min : "";
          return p !== w.e && U(u, "name", w.e = p), w.t = Z(u, _, w.t), S !== w.a && (u.disabled = w.a = S), O !== w.o && U(u, "maxlength", w.o = O), N !== w.i && U(u, "minlength", w.i = N), m !== w.n && U(u, "max", w.n = m), h !== w.s && U(u, "min", w.s = h), w;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0,
          i: void 0,
          n: void 0,
          s: void 0
        }), V(() => u.value = e.value), u;
      }
    }), null), k(v, g(P, {
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
            var w = s0(), p = w.firstChild, _ = p.firstChild;
            return k(p, g(me, {
              get children() {
                return [g(Q, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return a0();
                  }
                }), g(Q, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return l0();
                  }
                })];
              }
            }), _), _.innerHTML = u, V((S) => Z(p, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, S)), w;
          })()
        });
      }
    }), null), k(M, g(P, {
      get when() {
        return s();
      },
      get children() {
        var u = i0();
        return k(u, g(Ae, {
          get disabled() {
            return c();
          },
          onClick: () => e.openRemark(e.component.dataKey),
          get comments() {
            return e.comments;
          }
        })), u;
      }
    }), null), V(() => x.innerHTML = e.component.label), o;
  })();
};
ge(["click", "keyup", "input"]);
var o0 = /* @__PURE__ */ y("<span class=text-pink-600>*"), d0 = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), c0 = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400">'), Mi = /* @__PURE__ */ y('<svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z">'), u0 = /* @__PURE__ */ y("<input type=file accept=audio/* class=hidden>"), g0 = /* @__PURE__ */ y('<button class="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"title="Remove recording"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">'), h0 = /* @__PURE__ */ y('<svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"viewBox="0 0 24 24"fill=currentColor><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z">'), f0 = /* @__PURE__ */ y('<div class="col-span-12 px-2 py-2"><div class="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-3"><div class="flex items-center gap-2"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4 shrink-0 text-gray-400"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg><span class="text-xs font-medium text-gray-600 dark:text-gray-300 truncate flex-1"></span></div><audio></audio><div class="flex items-center gap-3"><button class="flex-shrink-0 w-9 h-9 rounded-full bg-pink-500 hover:bg-pink-600 text-white flex items-center justify-center transition-colors shadow-sm"></button><div class="flex-1 flex flex-col gap-1"><input type=range min=0 class="w-full h-1.5 rounded-full accent-pink-500 cursor-pointer"><div class="flex justify-between text-xs text-gray-400 tabular-nums"><span></span><span>'), m0 = /* @__PURE__ */ y('<div><div class="grid grid-cols-12 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2 col-span-11"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm space-x-2 py-2.5 px-2 space-y-4 flex justify-end -mt-2"></div><div class=col-span-12></div><div class="col-span-12 pb-4">'), v0 = /* @__PURE__ */ y('<svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4 ml-0.5"viewBox="0 0 24 24"fill=currentColor><path d="M8 5v14l11-7z">'), b0 = /* @__PURE__ */ y('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), w0 = /* @__PURE__ */ y('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), x0 = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="grid grid-cols-12"><div class="col-span-11 text-justify mr-1">');
const Ur = (e) => {
  const [t, n] = j(""), [i, r] = j(""), [a, l] = j(!1), [s, c] = j(0), [o, d] = j(0);
  let f;
  const x = e.config, [$] = j(x.formMode > 1 ? !0 : e.component.disableInput);
  $e(() => {
    e.value[0] ? (n(e.value[0].value), r(e.value[0].label || "")) : (n(""), r(""));
  });
  const M = (b) => {
    try {
      const C = JSON.parse(b), L = [{
        value: C.value,
        label: C.label,
        type: C.type
      }];
      e.onValueChange(L), Ue("Audio recorded successfully!");
    } catch (C) {
      ve("Failed to process audio result");
    }
  }, v = () => {
    e.MobileAudioHandler(M);
  }, u = (b) => {
    var L;
    const C = b.target;
    if (C.files && C.files[0]) {
      const E = ["mp3", "mp4", "m4a", "wav", "ogg", "webm", "aac"], I = C.files[0], R = ((L = I.name.split(".").pop()) == null ? void 0 : L.toLowerCase()) || "";
      if (!E.includes(R)) {
        ve("Please submit a valid audio format!");
        return;
      }
      const A = new FileReader();
      A.readAsDataURL(I), A.onload = (T) => {
        const K = [{
          value: T.target.result,
          label: I.name,
          type: I.type
        }];
        e.onValueChange(K), Ue("Audio uploaded successfully!");
      };
    }
  }, w = () => {
    f && !f.paused && f.pause(), l(!1), c(0), d(0), e.onValueChange([]);
  }, p = () => {
    a() ? (f.pause(), l(!1)) : (f.play(), l(!0));
  }, _ = (b) => {
    if (!isFinite(b) || isNaN(b)) return "0:00";
    const C = Math.floor(b / 60).toString().padStart(2, "0"), L = Math.floor(b % 60).toString().padStart(2, "0");
    return `${C}:${L}`;
  }, [S, O] = j(!1), N = () => O((b) => !b), [m] = j(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [h] = j(x.formMode > 2 && e.comments == 0);
  return (() => {
    var b = m0(), C = b.firstChild, L = C.firstChild, E = L.firstChild, I = E.firstChild, R = E.nextSibling, A = L.nextSibling, T = A.nextSibling, K = T.nextSibling;
    return k(E, g(P, {
      get when() {
        return e.component.required;
      },
      get children() {
        return o0();
      }
    }), null), k(E, g(P, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var F = d0();
        return F.$$click = N, F;
      }
    }), null), k(R, g(P, {
      get when() {
        return S();
      },
      get children() {
        var F = c0();
        return V(() => F.innerHTML = e.component.hint), F;
      }
    })), k(A, g(me, {
      get children() {
        return [g(Q, {
          get when() {
            return x.clientMode == 2;
          },
          get children() {
            return g(Pe, {
              color: "pink",
              get disabled() {
                return $();
              },
              onClick: v,
              get children() {
                return Mi();
              }
            });
          }
        }), g(Q, {
          get when() {
            return x.clientMode == 1;
          },
          get children() {
            return [(() => {
              var F = u0();
              return F.addEventListener("change", u), V(() => U(F, "id", "audioFile_" + e.component.dataKey)), F;
            })(), g(Pe, {
              color: "pink",
              get disabled() {
                return $();
              },
              onClick: () => document.getElementById("audioFile_" + e.component.dataKey).click(),
              get children() {
                return Mi();
              }
            })];
          }
        })];
      }
    }), null), k(A, g(P, {
      get when() {
        return m();
      },
      get children() {
        return g(Ae, {
          get disabled() {
            return h();
          },
          onClick: () => e.openRemark(e.component.dataKey),
          get comments() {
            return e.comments;
          }
        });
      }
    }), null), k(C, g(P, {
      get when() {
        return t() != "";
      },
      get children() {
        var F = f0(), D = F.firstChild, z = D.firstChild, B = z.firstChild, J = B.nextSibling, H = z.nextSibling, ee = H.nextSibling, G = ee.firstChild, le = G.nextSibling, re = le.firstChild, te = re.nextSibling, Y = te.firstChild, q = Y.nextSibling;
        k(J, i), k(z, g(P, {
          get when() {
            return !$();
          },
          get children() {
            var ie = g0();
            return ie.$$click = w, ie;
          }
        }), null), H.addEventListener("ended", () => l(!1)), H.addEventListener("loadedmetadata", () => d(f.duration)), H.addEventListener("timeupdate", () => c(f.currentTime));
        var W = f;
        return typeof W == "function" ? ct(W, H) : f = H, G.$$click = p, k(G, g(P, {
          get when() {
            return a();
          },
          get fallback() {
            return v0();
          },
          get children() {
            return h0();
          }
        })), re.$$input = (ie) => {
          const ae = +ie.target.value;
          f.currentTime = ae, c(ae);
        }, k(Y, () => _(s())), k(q, () => _(o())), V((ie) => {
          var ae = t(), fe = o() || 0;
          return ae !== ie.e && U(H, "src", ie.e = ae), fe !== ie.t && U(re, "max", ie.t = fe), ie;
        }, {
          e: void 0,
          t: void 0
        }), V(() => re.value = s()), F;
      }
    }), T), k(K, g(P, {
      get when() {
        var F;
        return ((F = e.validationMessage) == null ? void 0 : F.length) > 0;
      },
      get children() {
        return g(ce, {
          get each() {
            return e.validationMessage;
          },
          children: (F) => (() => {
            var D = x0(), z = D.firstChild, B = z.firstChild;
            return k(z, g(me, {
              get children() {
                return [g(Q, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return b0();
                  }
                }), g(Q, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return w0();
                  }
                })];
              }
            }), B), B.innerHTML = F, V((J) => Z(z, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, J)), D;
          })()
        });
      }
    })), V((F) => {
      var D = e.component.label, z = {
        " border-b border-orange-500 pb-3 ": e.classValidation === 1,
        " border-b border-pink-600 pb-3 ": e.classValidation === 2
      };
      return D !== F.e && (I.innerHTML = F.e = D), F.t = Z(T, z, F.t), F;
    }, {
      e: void 0,
      t: void 0
    }), b;
  })();
};
ge(["click", "input"]);
var y0 = /* @__PURE__ */ y("<span class=text-pink-600>*"), p0 = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), k0 = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400">'), $0 = /* @__PURE__ */ y('<svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z">'), _0 = /* @__PURE__ */ y('<svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">'), S0 = /* @__PURE__ */ y('<div class="col-span-12 px-2 pb-2 flex gap-2"><input type=text class="flex-1 border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-pink-400"placeholder="Enter barcode / QR value"><button class="bg-pink-500 text-white text-xs px-3 py-1.5 rounded-md hover:bg-pink-600">OK'), C0 = /* @__PURE__ */ y('<div class="col-span-12 px-2 py-2"><div class="flex items-start gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-3 py-2"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4 shrink-0 mt-0.5 text-green-500 dark:text-green-400"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span class="font-mono text-xs text-gray-700 dark:text-gray-200 break-all">'), M0 = /* @__PURE__ */ y('<div><div class="grid grid-cols-12 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2 col-span-11"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm space-x-2 py-2.5 px-2 space-y-4 flex justify-end -mt-2"></div><div class=col-span-12></div><div class="col-span-12 pb-4">'), I0 = /* @__PURE__ */ y('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), E0 = /* @__PURE__ */ y('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), L0 = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="grid grid-cols-12"><div class="col-span-11 text-justify mr-1">');
const Jr = (e) => {
  const [t, n] = j(""), i = e.config, [r] = j(i.formMode > 1 ? !0 : e.component.disableInput);
  $e(() => {
    e.value[0] && n(e.value[0].value || "");
  });
  const a = (w) => {
    try {
      const p = JSON.parse(w), _ = [{
        value: p.value,
        label: p.label,
        type: p.type
      }];
      e.onValueChange(_), Ue("Barcode scanned successfully!");
    } catch (p) {
      ve("Failed to process barcode result");
    }
  }, l = () => {
    e.MobileBarcodeHandler(a);
  }, [s, c] = j(!1), [o, d] = j(""), f = () => {
    const w = o().trim();
    if (!w) {
      ve("Please enter a barcode value!");
      return;
    }
    const p = [{
      value: w,
      label: w,
      type: "barcode"
    }];
    e.onValueChange(p), d(""), Ue("Barcode value saved!");
  }, [x, $] = j(!1), M = () => $((w) => !w), [v] = j(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [u] = j(i.formMode > 2 && e.comments == 0);
  return (() => {
    var w = M0(), p = w.firstChild, _ = p.firstChild, S = _.firstChild, O = S.firstChild, N = S.nextSibling, m = _.nextSibling, h = m.nextSibling, b = h.nextSibling;
    return k(S, g(P, {
      get when() {
        return e.component.required;
      },
      get children() {
        return y0();
      }
    }), null), k(S, g(P, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var C = p0();
        return C.$$click = M, C;
      }
    }), null), k(N, g(P, {
      get when() {
        return x();
      },
      get children() {
        var C = k0();
        return V(() => C.innerHTML = e.component.hint), C;
      }
    })), k(m, g(me, {
      get children() {
        return [g(Q, {
          get when() {
            return i.clientMode == 2;
          },
          get children() {
            return g(Pe, {
              color: "pink",
              get disabled() {
                return r();
              },
              onClick: l,
              get children() {
                return $0();
              }
            });
          }
        }), g(Q, {
          get when() {
            return i.clientMode == 1;
          },
          get children() {
            return g(Pe, {
              color: "pink",
              get disabled() {
                return r();
              },
              onClick: () => c((C) => !C),
              get children() {
                return _0();
              }
            });
          }
        })];
      }
    }), null), k(m, g(P, {
      get when() {
        return v();
      },
      get children() {
        return g(Ae, {
          get disabled() {
            return u();
          },
          onClick: () => e.openRemark(e.component.dataKey),
          get comments() {
            return e.comments;
          }
        });
      }
    }), null), k(p, g(P, {
      get when() {
        return ke(() => i.clientMode == 1)() && s();
      },
      get children() {
        var C = S0(), L = C.firstChild, E = L.nextSibling;
        return L.$$keydown = (I) => {
          I.key === "Enter" && f();
        }, L.$$input = (I) => d(I.target.value), E.$$click = f, V(() => L.value = o()), C;
      }
    }), h), k(p, g(P, {
      get when() {
        return t() != "";
      },
      get children() {
        var C = C0(), L = C.firstChild, E = L.firstChild, I = E.nextSibling;
        return k(I, t), C;
      }
    }), h), k(b, g(P, {
      get when() {
        var C;
        return ((C = e.validationMessage) == null ? void 0 : C.length) > 0;
      },
      get children() {
        return g(ce, {
          get each() {
            return e.validationMessage;
          },
          children: (C) => (() => {
            var L = L0(), E = L.firstChild, I = E.firstChild;
            return k(E, g(me, {
              get children() {
                return [g(Q, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return I0();
                  }
                }), g(Q, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return E0();
                  }
                })];
              }
            }), I), I.innerHTML = C, V((R) => Z(E, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, R)), L;
          })()
        });
      }
    })), V((C) => {
      var L = e.component.label, E = {
        " border-b border-orange-500 pb-3 ": e.classValidation === 1,
        " border-b border-pink-600 pb-3 ": e.classValidation === 2
      };
      return L !== C.e && (O.innerHTML = C.e = L), C.t = Z(h, E, C.t), C;
    }, {
      e: void 0,
      t: void 0
    }), w;
  })();
};
ge(["click", "input", "keydown"]);
var O0 = /* @__PURE__ */ y("<span class=text-pink-600>*"), A0 = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), R0 = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400">'), Ii = /* @__PURE__ */ y('<svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z">'), V0 = /* @__PURE__ */ y("<input type=file accept=video/* class=hidden>"), N0 = /* @__PURE__ */ y('<button class="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"title="Remove recording"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">'), T0 = /* @__PURE__ */ y('<div class="col-span-12 px-2 py-2"><div class="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"><video controls class="w-full max-h-64"></video><div class="flex items-center gap-2 px-3 py-2 text-gray-500 dark:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4 shrink-0"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg><span class="text-xs font-medium text-gray-600 dark:text-gray-300 truncate flex-1">'), P0 = /* @__PURE__ */ y('<div><div class="grid grid-cols-12 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2 col-span-11"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm space-x-2 py-2.5 px-2 space-y-4 flex justify-end -mt-2"></div><div class=col-span-12></div><div class="col-span-12 pb-4">'), D0 = /* @__PURE__ */ y('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), j0 = /* @__PURE__ */ y('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), K0 = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="grid grid-cols-12"><div class="col-span-11 text-justify mr-1">');
const Wr = (e) => {
  const [t, n] = j(""), [i, r] = j(""), a = e.config, [l] = j(a.formMode > 1 ? !0 : e.component.disableInput);
  $e(() => {
    e.value[0] ? (n(e.value[0].value), r(e.value[0].label || "")) : (n(""), r(""));
  });
  const s = () => {
    e.onValueChange([]);
  }, c = (u) => {
    try {
      const w = JSON.parse(u), p = [{
        value: w.value,
        label: w.label,
        type: w.type
      }];
      e.onValueChange(p), Ue("Video recorded successfully!");
    } catch (w) {
      ve("Failed to process video result");
    }
  }, o = () => {
    e.MobileVideoHandler(c);
  }, d = (u) => {
    var p;
    const w = u.target;
    if (w.files && w.files[0]) {
      const _ = ["mp4", "mov", "avi", "mkv", "webm", "3gp"], S = w.files[0], O = ((p = S.name.split(".").pop()) == null ? void 0 : p.toLowerCase()) || "";
      if (!_.includes(O)) {
        ve("Please submit a valid video format!");
        return;
      }
      const N = new FileReader();
      N.readAsDataURL(S), N.onload = (m) => {
        const h = m.target.result;
        n(h), r(S.name);
        const b = [{
          value: h,
          label: S.name,
          type: S.type
        }];
        e.onValueChange(b), Ue("Video uploaded successfully!");
      };
    }
  }, [f, x] = j(!1), $ = () => x((u) => !u), [M] = j(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [v] = j(a.formMode > 2 && e.comments == 0);
  return (() => {
    var u = P0(), w = u.firstChild, p = w.firstChild, _ = p.firstChild, S = _.firstChild, O = _.nextSibling, N = p.nextSibling, m = N.nextSibling, h = m.nextSibling;
    return k(_, g(P, {
      get when() {
        return e.component.required;
      },
      get children() {
        return O0();
      }
    }), null), k(_, g(P, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var b = A0();
        return b.$$click = $, b;
      }
    }), null), k(O, g(P, {
      get when() {
        return f();
      },
      get children() {
        var b = R0();
        return V(() => b.innerHTML = e.component.hint), b;
      }
    })), k(N, g(me, {
      get children() {
        return [g(Q, {
          get when() {
            return a.clientMode == 2;
          },
          get children() {
            return g(Pe, {
              color: "pink",
              get disabled() {
                return l();
              },
              onClick: o,
              get children() {
                return Ii();
              }
            });
          }
        }), g(Q, {
          get when() {
            return a.clientMode == 1;
          },
          get children() {
            return [(() => {
              var b = V0();
              return b.addEventListener("change", d), V(() => U(b, "id", "videoFile_" + e.component.dataKey)), b;
            })(), g(Pe, {
              color: "pink",
              get disabled() {
                return l();
              },
              onClick: () => document.getElementById("videoFile_" + e.component.dataKey).click(),
              get children() {
                return Ii();
              }
            })];
          }
        })];
      }
    }), null), k(N, g(P, {
      get when() {
        return M();
      },
      get children() {
        return g(Ae, {
          get disabled() {
            return v();
          },
          onClick: () => e.openRemark(e.component.dataKey),
          get comments() {
            return e.comments;
          }
        });
      }
    }), null), k(w, g(P, {
      get when() {
        return t() != "";
      },
      get children() {
        var b = T0(), C = b.firstChild, L = C.firstChild, E = L.nextSibling, I = E.firstChild, R = I.nextSibling;
        return k(R, i), k(E, g(P, {
          get when() {
            return !l();
          },
          get children() {
            var A = N0();
            return A.$$click = s, A;
          }
        }), null), V(() => U(L, "src", t())), b;
      }
    }), m), k(h, g(P, {
      get when() {
        var b;
        return ((b = e.validationMessage) == null ? void 0 : b.length) > 0;
      },
      get children() {
        return g(ce, {
          get each() {
            return e.validationMessage;
          },
          children: (b) => (() => {
            var C = K0(), L = C.firstChild, E = L.firstChild;
            return k(L, g(me, {
              get children() {
                return [g(Q, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return D0();
                  }
                }), g(Q, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return j0();
                  }
                })];
              }
            }), E), E.innerHTML = b, V((I) => Z(L, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, I)), C;
          })()
        });
      }
    })), V((b) => {
      var C = e.component.label, L = {
        " border-b border-orange-500 pb-3 ": e.classValidation === 1,
        " border-b border-pink-600 pb-3 ": e.classValidation === 2
      };
      return C !== b.e && (S.innerHTML = b.e = C), b.t = Z(m, L, b.t), b;
    }, {
      e: void 0,
      t: void 0
    }), u;
  })();
};
ge(["click"]);
var z0 = /* @__PURE__ */ y("<span class=text-pink-600>*"), F0 = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), B0 = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400">'), Ei = /* @__PURE__ */ y('<svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13">'), H0 = /* @__PURE__ */ y("<input type=file class=hidden>"), U0 = /* @__PURE__ */ y('<div class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"><img class=w-full><div class="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4 shrink-0"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg><span class="text-xs font-medium text-gray-600 dark:text-gray-300 truncate">'), J0 = /* @__PURE__ */ y('<div class="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-2"><div class="flex items-center gap-2 text-gray-500 dark:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4 shrink-0"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg><span class="text-xs font-medium text-gray-600 dark:text-gray-300 truncate"></span></div><audio controls class=w-full>'), W0 = /* @__PURE__ */ y('<div class="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"><video controls class="w-full max-h-64"></video><div class="flex items-center gap-2 px-3 py-2 text-gray-500 dark:text-gray-400"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4 shrink-0"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg><span class="text-xs font-medium text-gray-600 dark:text-gray-300 truncate">'), q0 = /* @__PURE__ */ y('<div class="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"><svg xmlns=http://www.w3.org/2000/svg class="h-6 w-6 text-gray-400 shrink-0"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg><span class="text-xs text-gray-600 dark:text-gray-300 truncate">'), G0 = /* @__PURE__ */ y('<div class="font-light text-sm px-2 py-2.5 col-span-12 space-y-2">'), Y0 = /* @__PURE__ */ y('<div><div class="grid grid-cols-12 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2 col-span-11"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm space-x-2 py-2.5 px-2 space-y-4 flex justify-end -mt-2"></div><div class=col-span-12></div><div class="col-span-12 pb-4">'), Q0 = /* @__PURE__ */ y('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), Z0 = /* @__PURE__ */ y('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), X0 = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="grid grid-cols-12"><div class="col-span-11 text-justify mr-1">');
const qr = (e) => {
  const [t, n] = j(""), [i, r] = j(""), [a, l] = j(""), s = e.config, [c] = j(s.formMode > 1 ? !0 : e.component.disableInput);
  $e(() => {
    e.value[0] && (r(e.value[0].value || ""), n(e.value[0].label || ""), l(e.value[0].type || ""));
  });
  const o = (S) => {
    try {
      const O = JSON.parse(S), N = [{
        value: O.value,
        label: O.label,
        type: O.type
      }];
      e.onValueChange(N), Ue("File selected successfully!");
    } catch (O) {
      ve("Failed to process file result");
    }
  }, d = () => {
    e.MobileFileHandler(o);
  }, f = (S) => {
    const O = S.target;
    if (O.files && O.files[0]) {
      const N = O.files[0], m = new FileReader();
      m.readAsDataURL(N), m.onload = (h) => {
        const b = [{
          value: h.target.result,
          label: N.name,
          type: N.type
        }];
        e.onValueChange(b), Ue("File uploaded successfully!");
      };
    }
  }, x = () => a().startsWith("image/"), $ = () => a().startsWith("audio/"), M = () => a().startsWith("video/"), [v, u] = j(!1), w = () => u((S) => !S), [p] = j(e.component.enableRemark !== void 0 ? e.component.enableRemark : !0), [_] = j(s.formMode > 2 && e.comments == 0);
  return (() => {
    var S = Y0(), O = S.firstChild, N = O.firstChild, m = N.firstChild, h = m.firstChild, b = m.nextSibling, C = N.nextSibling, L = C.nextSibling, E = L.nextSibling;
    return k(m, g(P, {
      get when() {
        return e.component.required;
      },
      get children() {
        return z0();
      }
    }), null), k(m, g(P, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var I = F0();
        return I.$$click = w, I;
      }
    }), null), k(b, g(P, {
      get when() {
        return v();
      },
      get children() {
        var I = B0();
        return V(() => I.innerHTML = e.component.hint), I;
      }
    })), k(C, g(me, {
      get children() {
        return [g(Q, {
          get when() {
            return s.clientMode == 2;
          },
          get children() {
            return g(Pe, {
              color: "pink",
              get disabled() {
                return c();
              },
              onClick: d,
              get children() {
                return Ei();
              }
            });
          }
        }), g(Q, {
          get when() {
            return s.clientMode == 1;
          },
          get children() {
            return [(() => {
              var I = H0();
              return I.addEventListener("change", f), V(() => U(I, "id", "genericFile_" + e.component.dataKey)), I;
            })(), g(Pe, {
              color: "pink",
              get disabled() {
                return c();
              },
              onClick: () => document.getElementById("genericFile_" + e.component.dataKey).click(),
              get children() {
                return Ei();
              }
            })];
          }
        })];
      }
    }), null), k(C, g(P, {
      get when() {
        return p();
      },
      get children() {
        return g(Ae, {
          get disabled() {
            return _();
          },
          onClick: () => e.openRemark(e.component.dataKey),
          get comments() {
            return e.comments;
          }
        });
      }
    }), null), k(O, g(P, {
      get when() {
        return i() != "";
      },
      get children() {
        var I = G0();
        return k(I, g(me, {
          get children() {
            return [g(Q, {
              get when() {
                return x();
              },
              get children() {
                var R = U0(), A = R.firstChild, T = A.nextSibling, K = T.firstChild, F = K.nextSibling;
                return k(F, t), V((D) => {
                  var z = i(), B = t();
                  return z !== D.e && U(A, "src", D.e = z), B !== D.t && U(A, "alt", D.t = B), D;
                }, {
                  e: void 0,
                  t: void 0
                }), R;
              }
            }), g(Q, {
              get when() {
                return $();
              },
              get children() {
                var R = J0(), A = R.firstChild, T = A.firstChild, K = T.nextSibling, F = A.nextSibling;
                return k(K, t), V(() => U(F, "src", i())), R;
              }
            }), g(Q, {
              get when() {
                return M();
              },
              get children() {
                var R = W0(), A = R.firstChild, T = A.nextSibling, K = T.firstChild, F = K.nextSibling;
                return k(F, t), V(() => U(A, "src", i())), R;
              }
            }), g(Q, {
              when: !0,
              get children() {
                var R = q0(), A = R.firstChild, T = A.nextSibling;
                return k(T, t), R;
              }
            })];
          }
        })), I;
      }
    }), L), k(E, g(P, {
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
            var R = X0(), A = R.firstChild, T = A.firstChild;
            return k(A, g(me, {
              get children() {
                return [g(Q, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return Q0();
                  }
                }), g(Q, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return Z0();
                  }
                })];
              }
            }), T), T.innerHTML = I, V((K) => Z(A, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, K)), R;
          })()
        });
      }
    })), V((I) => {
      var R = e.component.label, A = {
        " border-b border-orange-500 pb-3 ": e.classValidation === 1,
        " border-b border-pink-600 pb-3 ": e.classValidation === 2
      };
      return R !== I.e && (h.innerHTML = I.e = R), I.t = Z(L, A, I.t), I;
    }, {
      e: void 0,
      t: void 0
    }), S;
  })();
};
ge(["click"]);
var eg = /* @__PURE__ */ y("<span class=text-pink-600>*"), tg = /* @__PURE__ */ y('<button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), ng = /* @__PURE__ */ y('<div class="italic text-xs font-extralight text-zinc-400 ">'), ig = /* @__PURE__ */ y('<div class="grid md:grid-cols-2 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2"><div class="font-light text-sm space-y-2 py-2.5 px-2"><div class="inline-flex space-x-2"><div></div></div><div class="flex mt-2"></div></div><div class="font-light text-sm space-x-2 py-2.5 px-2 md:col-span-1 grid grid-cols-12"><div class=col-span-12>'), rg = /* @__PURE__ */ y('<div class=mr-2><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), ag = /* @__PURE__ */ y('<div class=mr-2><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), lg = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class=flex><div>');
const it = (e) => {
  const [t, n] = j(!1), i = () => {
    t() ? n(!1) : n(!0);
  };
  return (() => {
    var r = ig(), a = r.firstChild, l = a.firstChild, s = l.firstChild, c = l.nextSibling, o = a.nextSibling, d = o.firstChild;
    return k(l, g(P, {
      get when() {
        return e.component.required;
      },
      get children() {
        return eg();
      }
    }), null), k(l, g(P, {
      get when() {
        return e.component.hint;
      },
      get children() {
        var f = tg();
        return f.$$click = i, f;
      }
    }), null), k(c, g(P, {
      get when() {
        return t();
      },
      get children() {
        var f = ng();
        return V(() => f.innerHTML = e.component.hint), f;
      }
    }), null), k(c, (() => {
      var f = ke(() => typeof e.optionSection == "function");
      return () => f() ? e.optionSection() : e.optionSection;
    })(), null), k(d, () => e.children, null), k(d, g(P, {
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
            var x = lg(), $ = x.firstChild, M = $.firstChild;
            return k($, g(me, {
              get children() {
                return [g(Q, {
                  get when() {
                    return e.classValidation === 1;
                  },
                  get children() {
                    return rg();
                  }
                }), g(Q, {
                  get when() {
                    return e.classValidation === 2;
                  },
                  get children() {
                    return ag();
                  }
                })];
              }
            }), M), M.innerHTML = f, V((v) => Z($, {
              " text-orange-500 dark:text-orange-200 ": e.classValidation === 1,
              " text-pink-600 dark:text-pink-200 ": e.classValidation === 2
            }, v)), x;
          })()
        });
      }
    }), null), V(() => s.innerHTML = e.component.label), r;
  })();
};
ge(["click"]);
const sg = (e, t) => {
  if (t == null && (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) ? t = document.querySelector(".mobile-component-div") : t = document.querySelector(".component-div")), !t) return;
  const n = t.clientHeight / 2, i = e.offsetTop, r = t.clientWidth / 2, a = e.offsetLeft;
  (a > r || i > n) && t.scrollTo({
    top: i - n,
    left: a - r,
    behavior: "smooth"
  });
}, og = (e, t) => {
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
}, dg = (e) => e.reduce((t, n) => t + Number(n), 0), Li = (e) => e.map((t, n) => Xe(Se({}, t), {
  checkboxValue: Math.pow(2, n)
})), vt = (e, t) => {
  if (t.config.clientMode == dt.PAPI) {
    const n = t.isNestedInput ? e.target.offsetParent : e.target, i = t.isNestedInput ? document.querySelector(".nested-container") : null;
    t.setInput && t.setInput("currentDataKey", t.component.dataKey), sg(n, i);
  }
}, bt = (e, t) => {
  cg(e);
}, cg = (e, t) => {
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
var ug = /* @__PURE__ */ y('<div class="grid font-light text-sm content-start">'), gg = /* @__PURE__ */ y('<div class=col-span-11><input type=text class="w-full font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400">'), hg = /* @__PURE__ */ y("<div class=col-span-11>"), fg = /* @__PURE__ */ y('<div class="font-light text-sm space-x-2 py-2.5 px-4 grid grid-cols-12"><div class="col-span-1 text-center"><label class="cursor-pointer text-sm"><input type=radio class="checked:disabled:bg-gray-500 checked:dark:disabled:bg-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"disabled>');
const mg = (e) => (() => {
  var t = ug();
  return k(t, g(ce, {
    get each() {
      return e.options;
    },
    children: (n, i) => (() => {
      var r = fg(), a = r.firstChild, l = a.firstChild, s = l.firstChild;
      return k(r, g(me, {
        get children() {
          return [g(Q, {
            get when() {
              return ke(() => !!n.open)() && e.settedValue === n.value;
            },
            get children() {
              var c = gg(), o = c.firstChild;
              return o.addEventListener("change", (d) => e.onValueChange(n.value, d.currentTarget.value, n.open)), o.addEventListener("focus", (d) => vt(d, e)), o.$$keydown = (d) => bt(d), V((d) => {
                var f = e.component.dataKey, x = e.component.dataKey, $ = e.disableInput;
                return f !== d.e && U(o, "name", d.e = f), x !== d.t && U(o, "id", d.t = x), $ !== d.a && (o.disabled = d.a = $), d;
              }, {
                e: void 0,
                t: void 0,
                a: void 0
              }), V(() => o.value = e.value && e.value.length > 0 ? e.value[0].label : n.label), c;
            }
          }), g(Q, {
            get when() {
              return !n.open || e.settedValue !== n.value;
            },
            get children() {
              var c = hg();
              return V(() => c.innerHTML = n.label), c;
            }
          })];
        }
      }), null), V((c) => {
        var o = e.component.dataKey + i(), d = e.component.dataKey, f = "radio-" + e.component.dataKey + "-" + i();
        return o !== c.e && U(l, "for", c.e = o), d !== c.t && U(s, "name", c.t = d), f !== c.a && U(s, "id", c.a = f), c;
      }, {
        e: void 0,
        t: void 0,
        a: void 0
      }), V(() => s.checked = e.settedValue === n.value), V(() => s.value = n.value), r;
    })()
  })), V((n) => {
    var i = e.component.cols === 1 || e.component.cols === void 0, r = e.component.cols === 2, a = e.component.cols === 3, l = e.component.cols === 4, s = e.component.cols === 5;
    return i !== n.e && t.classList.toggle("grid-cols-1", n.e = i), r !== n.t && t.classList.toggle("grid-cols-2", n.t = r), a !== n.a && t.classList.toggle("grid-cols-3", n.a = a), l !== n.o && t.classList.toggle("grid-cols-4", n.o = l), s !== n.i && t.classList.toggle("grid-cols-5", n.i = s), n;
  }, {
    e: void 0,
    t: void 0,
    a: void 0,
    o: void 0,
    i: void 0
  }), t;
})();
ge(["keydown"]);
var Oi = /* @__PURE__ */ y("<input type=text class=formgear-input-papi placeholder>"), vg = /* @__PURE__ */ y('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), bg = /* @__PURE__ */ y('<div class="col-span-1 flex justify-center items-start"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), wg = /* @__PURE__ */ y('<div class="text-xs font-light mt-1"><div class="grid grid-cols-12"><div class="col-span-11 text-justify mr-1">');
const xg = (e) => {
  const t = e.config, [n] = j(t.formMode > 1 && t.initialMode == 2 ? !0 : t.initialMode == 1 && e.component.disableInitial !== void 0 ? e.component.disableInitial : e.component.disableInput);
  return g(it, {
    get component() {
      return e.component;
    },
    get children() {
      return [g(P, {
        get when() {
          return e.component.lengthInput === void 0;
        },
        get children() {
          var i = Oi();
          return i.addEventListener("change", (r) => {
            e.onValueChange(r.currentTarget.value);
          }), V((r) => {
            var a = e.component.dataKey, l = {
              ["formgear-input-papi-validation-" + e.classValidation]: !0
            }, s = n();
            return a !== r.e && U(i, "name", r.e = a), r.t = Z(i, l, r.t), s !== r.a && (i.disabled = r.a = s), r;
          }, {
            e: void 0,
            t: void 0,
            a: void 0
          }), V(() => i.value = e.value), i;
        }
      }), g(P, {
        get when() {
          return ke(() => e.component.lengthInput !== void 0)() && e.component.lengthInput.length > 0;
        },
        get children() {
          var i = Oi();
          return i.addEventListener("change", (r) => {
            e.onValueChange(r.currentTarget.value);
          }), V((r) => {
            var a = e.component.dataKey, l = {
              ["formgear-input-papi-validation-" + e.classValidation]: !0
            }, s = n(), c = e.component.lengthInput[0].maxlength !== void 0 ? e.component.lengthInput[0].maxlength : "", o = e.component.lengthInput[0].minlength !== void 0 ? e.component.lengthInput[0].minlength : "";
            return a !== r.e && U(i, "name", r.e = a), r.t = Z(i, l, r.t), s !== r.a && (i.disabled = r.a = s), c !== r.o && U(i, "maxlength", r.o = c), o !== r.i && U(i, "minlength", r.i = o), r;
          }, {
            e: void 0,
            t: void 0,
            a: void 0,
            o: void 0,
            i: void 0
          }), V(() => i.value = e.value), i;
        }
      }), g(P, {
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
              var r = wg(), a = r.firstChild, l = a.firstChild;
              return k(a, g(me, {
                get children() {
                  return [g(Q, {
                    get when() {
                      return e.classValidation === 1;
                    },
                    get children() {
                      return vg();
                    }
                  }), g(Q, {
                    get when() {
                      return e.classValidation === 2;
                    },
                    get children() {
                      return bg();
                    }
                  })];
                }
              }), l), l.innerHTML = i, V((s) => Z(a, {
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
var Ai = /* @__PURE__ */ y("<input type=text class=formgear-input-papi placeholder>");
const Ri = (e) => {
  const [t] = tt(), n = e.config, [i] = j(n.formMode > 1 ? !0 : e.component.disableInput);
  let r = e.value && e.value.length > 0 ? e.value[0].value : e.value, a = (o, d) => {
    var x;
    let f = [];
    d == null && (d = (x = s().find(($) => $.value == o)) == null ? void 0 : x.label), f = [{
      value: o,
      label: d
    }], e.onValueChange([...f]);
  }, l = Ce(() => {
    if (e.component.sourceOption !== void 0 && e.component.typeOption === 3) {
      let o = e.component.sourceOption.split("@");
      const d = t.details.findIndex((f) => f.dataKey === o[0]);
      return t.details[d].type, t.details[d].answer;
    }
    return [];
  });
  const [s] = j(e.component.sourceOption !== void 0 ? l() : e.component.options);
  return g(it, {
    get classValidation() {
      return e.classValidation;
    },
    get validationMessage() {
      return e.validationMessage;
    },
    get component() {
      return e.component;
    },
    optionSection: () => g(mg, {
      get component() {
        return e.component;
      },
      get options() {
        return s();
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
      return [g(P, {
        get when() {
          return e.component.lengthInput === void 0;
        },
        get children() {
          var o = Ai();
          return o.$$keydown = (d) => bt(d), o.addEventListener("focus", (d) => vt(d, e)), o.addEventListener("change", (d) => {
            a(d.currentTarget.value);
          }), o.value = r, V((d) => {
            var f = e.component.dataKey, x = {
              ["formgear-input-papi-validation-" + e.classValidation]: !0
            }, $ = i();
            return f !== d.e && U(o, "name", d.e = f), d.t = Z(o, x, d.t), $ !== d.a && (o.disabled = d.a = $), d;
          }, {
            e: void 0,
            t: void 0,
            a: void 0
          }), o;
        }
      }), g(P, {
        get when() {
          return ke(() => e.component.lengthInput !== void 0)() && e.component.lengthInput.length > 0;
        },
        get children() {
          var o = Ai();
          return o.$$keydown = (d) => bt(d), o.addEventListener("focus", (d) => vt(d, e)), o.addEventListener("change", (d) => {
            e.onValueChange(d.currentTarget.value);
          }), o.value = r, V((d) => {
            var f = e.component.dataKey, x = {
              ["formgear-input-papi-validation-" + e.classValidation]: !0
            }, $ = i(), M = e.component.lengthInput[0].maxlength !== void 0 ? e.component.lengthInput[0].maxlength : "", v = e.component.lengthInput[0].minlength !== void 0 ? e.component.lengthInput[0].minlength : "";
            return f !== d.e && U(o, "name", d.e = f), d.t = Z(o, x, d.t), $ !== d.a && (o.disabled = d.a = $), M !== d.o && U(o, "maxlength", d.o = M), v !== d.i && U(o, "minlength", d.i = v), d;
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
ge(["keydown"]);
var Vi = /* @__PURE__ */ y("<input type=number class=formgear-input-papi placeholder>");
const yg = (e) => {
  const t = e.config, [n] = j(t.formMode > 1 ? !0 : e.component.disableInput);
  return g(it, {
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
      return [g(P, {
        get when() {
          return e.component.lengthInput === void 0;
        },
        get children() {
          var i = Vi();
          return i.$$keydown = (r) => bt(r), i.addEventListener("focus", (r) => vt(r, e)), i.addEventListener("change", (r) => {
            e.onValueChange(r.currentTarget.value);
          }), V((r) => {
            var a = e.component.dataKey, l = {
              ["formgear-input-papi-validation-" + e.classValidation]: !0
            }, s = n();
            return a !== r.e && U(i, "name", r.e = a), r.t = Z(i, l, r.t), s !== r.a && (i.disabled = r.a = s), r;
          }, {
            e: void 0,
            t: void 0,
            a: void 0
          }), V(() => i.value = e.value), i;
        }
      }), g(P, {
        get when() {
          return ke(() => e.component.lengthInput !== void 0)() && e.component.lengthInput.length > 0;
        },
        get children() {
          var i = Vi();
          return i.$$input = (r) => {
            const a = r.currentTarget;
            a.value.length > a.maxLength && (a.value = a.value.slice(0, a.maxLength));
          }, i.$$keydown = (r) => bt(r), i.addEventListener("focus", (r) => vt(r, e)), i.addEventListener("change", (r) => {
            e.onValueChange(r.currentTarget.value);
          }), V((r) => {
            var a = e.component.dataKey, l = {
              ["formgear-input-papi-validation-" + e.classValidation]: !0
            }, s = n(), c = e.component.lengthInput[0].maxlength !== void 0 ? e.component.lengthInput[0].maxlength : "", o = e.component.lengthInput[0].minlength !== void 0 ? e.component.lengthInput[0].minlength : "", d = e.component.rangeInput && e.component.rangeInput[0].max !== void 0 ? e.component.rangeInput[0].max : "", f = e.component.rangeInput && e.component.rangeInput[0].min !== void 0 ? e.component.rangeInput[0].min : "";
            return a !== r.e && U(i, "name", r.e = a), r.t = Z(i, l, r.t), s !== r.a && (i.disabled = r.a = s), c !== r.o && U(i, "maxlength", r.o = c), o !== r.i && U(i, "minlength", r.i = o), d !== r.n && U(i, "max", r.n = d), f !== r.s && U(i, "min", r.s = f), r;
          }, {
            e: void 0,
            t: void 0,
            a: void 0,
            o: void 0,
            i: void 0,
            n: void 0,
            s: void 0
          }), V(() => i.value = e.value), i;
        }
      })];
    }
  });
};
ge(["keydown", "input"]);
var Ni = /* @__PURE__ */ y("<textarea class=formgear-input-papi>");
const pg = (e) => {
  const t = e.config, [n] = j(t.formMode > 1 ? !0 : e.component.disableInput);
  return g(it, {
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
      return [g(P, {
        get when() {
          return e.component.lengthInput === void 0;
        },
        get children() {
          var i = Ni();
          return i.addEventListener("change", (r) => {
            e.onValueChange(r.currentTarget.value);
          }), V((r) => {
            var a = e.component.rows || 2, l = {
              ["formgear-input-papi-validation-" + e.classValidation]: !0
            }, s = n();
            return a !== r.e && U(i, "rows", r.e = a), r.t = Z(i, l, r.t), s !== r.a && (i.disabled = r.a = s), r;
          }, {
            e: void 0,
            t: void 0,
            a: void 0
          }), V(() => i.value = e.value), i;
        }
      }), g(P, {
        get when() {
          return ke(() => e.component.lengthInput !== void 0)() && e.component.lengthInput.length > 0;
        },
        get children() {
          var i = Ni();
          return i.addEventListener("change", (r) => {
            e.onValueChange(r.currentTarget.value);
          }), V((r) => {
            var a = e.component.rows || 2, l = {
              ["formgear-input-papi-validation-" + e.classValidation]: !0
            }, s = n(), c = e.component.lengthInput[0].maxlength !== void 0 ? e.component.lengthInput[0].maxlength : "", o = e.component.lengthInput[0].minlength !== void 0 ? e.component.lengthInput[0].minlength : "";
            return a !== r.e && U(i, "rows", r.e = a), r.t = Z(i, l, r.t), s !== r.a && (i.disabled = r.a = s), c !== r.o && U(i, "maxlength", r.o = c), o !== r.i && U(i, "minlength", r.i = o), r;
          }, {
            e: void 0,
            t: void 0,
            a: void 0,
            o: void 0,
            i: void 0
          }), V(() => i.value = e.value), i;
        }
      })];
    }
  });
};
var ln = { exports: {} }, kg = ln.exports, Ti;
function $g() {
  return Ti || (Ti = 1, (function(e, t) {
    (function(n, i) {
      e.exports = i();
    })(kg, (function() {
      var n = { LTS: "h:mm:ss A", LT: "h:mm A", L: "MM/DD/YYYY", LL: "MMMM D, YYYY", LLL: "MMMM D, YYYY h:mm A", LLLL: "dddd, MMMM D, YYYY h:mm A" }, i = /(\[[^[]*\])|([-_:/.,()\s]+)|(A|a|Q|YYYY|YY?|ww?|MM?M?M?|Do|DD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g, r = /\d/, a = /\d\d/, l = /\d\d?/, s = /\d*[^-_:/,()\s\d]+/, c = {}, o = function(u) {
        return (u = +u) + (u > 68 ? 1900 : 2e3);
      }, d = function(u) {
        return function(w) {
          this[u] = +w;
        };
      }, f = [/[+-]\d\d:?(\d\d)?|Z/, function(u) {
        (this.zone || (this.zone = {})).offset = (function(w) {
          if (!w || w === "Z") return 0;
          var p = w.match(/([+-]|\d\d)/g), _ = 60 * p[1] + (+p[2] || 0);
          return _ === 0 ? 0 : p[0] === "+" ? -_ : _;
        })(u);
      }], x = function(u) {
        var w = c[u];
        return w && (w.indexOf ? w : w.s.concat(w.f));
      }, $ = function(u, w) {
        var p, _ = c.meridiem;
        if (_) {
          for (var S = 1; S <= 24; S += 1) if (u.indexOf(_(S, 0, w)) > -1) {
            p = S > 12;
            break;
          }
        } else p = u === (w ? "pm" : "PM");
        return p;
      }, M = { A: [s, function(u) {
        this.afternoon = $(u, !1);
      }], a: [s, function(u) {
        this.afternoon = $(u, !0);
      }], Q: [r, function(u) {
        this.month = 3 * (u - 1) + 1;
      }], S: [r, function(u) {
        this.milliseconds = 100 * +u;
      }], SS: [a, function(u) {
        this.milliseconds = 10 * +u;
      }], SSS: [/\d{3}/, function(u) {
        this.milliseconds = +u;
      }], s: [l, d("seconds")], ss: [l, d("seconds")], m: [l, d("minutes")], mm: [l, d("minutes")], H: [l, d("hours")], h: [l, d("hours")], HH: [l, d("hours")], hh: [l, d("hours")], D: [l, d("day")], DD: [a, d("day")], Do: [s, function(u) {
        var w = c.ordinal, p = u.match(/\d+/);
        if (this.day = p[0], w) for (var _ = 1; _ <= 31; _ += 1) w(_).replace(/\[|\]/g, "") === u && (this.day = _);
      }], w: [l, d("week")], ww: [a, d("week")], M: [l, d("month")], MM: [a, d("month")], MMM: [s, function(u) {
        var w = x("months"), p = (x("monthsShort") || w.map((function(_) {
          return _.slice(0, 3);
        }))).indexOf(u) + 1;
        if (p < 1) throw new Error();
        this.month = p % 12 || p;
      }], MMMM: [s, function(u) {
        var w = x("months").indexOf(u) + 1;
        if (w < 1) throw new Error();
        this.month = w % 12 || w;
      }], Y: [/[+-]?\d+/, d("year")], YY: [a, function(u) {
        this.year = o(u);
      }], YYYY: [/\d{4}/, d("year")], Z: f, ZZ: f };
      function v(u) {
        var w, p;
        w = u, p = c && c.formats;
        for (var _ = (u = w.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g, (function(C, L, E) {
          var I = E && E.toUpperCase();
          return L || p[E] || n[E] || p[I].replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g, (function(R, A, T) {
            return A || T.slice(1);
          }));
        }))).match(i), S = _.length, O = 0; O < S; O += 1) {
          var N = _[O], m = M[N], h = m && m[0], b = m && m[1];
          _[O] = b ? { regex: h, parser: b } : N.replace(/^\[|\]$/g, "");
        }
        return function(C) {
          for (var L = {}, E = 0, I = 0; E < S; E += 1) {
            var R = _[E];
            if (typeof R == "string") I += R.length;
            else {
              var A = R.regex, T = R.parser, K = C.slice(I), F = A.exec(K)[0];
              T.call(L, F), C = C.replace(F, "");
            }
          }
          return (function(D) {
            var z = D.afternoon;
            if (z !== void 0) {
              var B = D.hours;
              z ? B < 12 && (D.hours += 12) : B === 12 && (D.hours = 0), delete D.afternoon;
            }
          })(L), L;
        };
      }
      return function(u, w, p) {
        p.p.customParseFormat = !0, u && u.parseTwoDigitYear && (o = u.parseTwoDigitYear);
        var _ = w.prototype, S = _.parse;
        _.parse = function(O) {
          var N = O.date, m = O.utc, h = O.args;
          this.$u = m;
          var b = h[1];
          if (typeof b == "string") {
            var C = h[2] === !0, L = h[3] === !0, E = C || L, I = h[2];
            L && (I = h[2]), c = this.$locale(), !C && I && (c = p.Ls[I]), this.$d = (function(K, F, D, z) {
              try {
                if (["x", "X"].indexOf(F) > -1) return new Date((F === "X" ? 1e3 : 1) * K);
                var B = v(F)(K), J = B.year, H = B.month, ee = B.day, G = B.hours, le = B.minutes, re = B.seconds, te = B.milliseconds, Y = B.zone, q = B.week, W = /* @__PURE__ */ new Date(), ie = ee || (J || H ? 1 : W.getDate()), ae = J || W.getFullYear(), fe = 0;
                J && !H || (fe = H > 0 ? H - 1 : W.getMonth());
                var xe, ye = G || 0, Me = le || 0, he = re || 0, _e = te || 0;
                return Y ? new Date(Date.UTC(ae, fe, ie, ye, Me, he, _e + 60 * Y.offset * 1e3)) : D ? new Date(Date.UTC(ae, fe, ie, ye, Me, he, _e)) : (xe = new Date(ae, fe, ie, ye, Me, he, _e), q && (xe = z(xe).week(q).toDate()), xe);
              } catch (Ve) {
                return /* @__PURE__ */ new Date("");
              }
            })(N, b, m, p), this.init(), I && I !== !0 && (this.$L = this.locale(I).$L), E && N != this.format(b) && (this.$d = /* @__PURE__ */ new Date("")), c = {};
          } else if (b instanceof Array) for (var R = b.length, A = 1; A <= R; A += 1) {
            h[1] = b[A - 1];
            var T = p.apply(this, h);
            if (T.isValid()) {
              this.$d = T.$d, this.$L = T.$L, this.init();
              break;
            }
            A === R && (this.$d = /* @__PURE__ */ new Date(""));
          }
          else S.call(this, O);
        };
      };
    }));
  })(ln)), ln.exports;
}
var _g = $g();
const Gr = /* @__PURE__ */ Rt(_g);
var Sg = /* @__PURE__ */ y("<input type=text class=formgear-input-papi>");
We.extend(Gr);
const Cg = (e) => {
  const t = e.config, [n] = j(t.formMode > 1 ? !0 : e.component.disableInput), i = "DD/MM/YYYY", r = "99/99/9999", a = Sn(r), s = {
    ref: void 0
  };
  let c = (d) => {
    d = We(d, i, !0).format("YYYY-MM-DD"), e.onValueChange(d);
  }, o = e.value ? We(e.value).format(i) : "";
  return g(it, {
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
      var d = Sg();
      d.addEventListener("paste", () => a({
        currentTarget: s.ref
      })), Re(d, "input", a, !0), d.$$click = () => a({
        currentTarget: s.ref
      }), d.addEventListener("change", (x) => c(x.currentTarget.value)), d.addEventListener("focus", (x) => vt(x, e)), d.$$keydown = (x) => bt(x);
      var f = s.ref;
      return typeof f == "function" ? ct(f, d) : s.ref = d, d.value = o, V((x) => {
        var $ = "inputMask" + e.component.dataKey, M = {
          ["formgear-input-papi-validation-" + e.classValidation]: !0
        }, v = r.replace(/[a]/g, "__").replace(/[9]/g, "#"), u = n();
        return $ !== x.e && U(d, "id", x.e = $), x.t = Z(d, M, x.t), v !== x.a && U(d, "placeholder", x.a = v), u !== x.o && (d.disabled = x.o = u), x;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0
      }), d;
    }
  });
};
ge(["keydown", "click", "input"]);
var Mg = /* @__PURE__ */ y("<input type=text class=formgear-input-papi>");
We.extend(Gr);
const Ig = (e) => {
  const t = e.config, [n] = j(t.formMode > 1 ? !0 : e.component.disableInput), i = "DD/MM/YYYY HH:mm:ss", r = "99/99/9999 99:99:99", a = Sn(r), s = {
    ref: void 0
  };
  let c = (d) => {
    d = We(d, i, !0).format("YYYY-MM-DD HH:mm:ss"), e.onValueChange(d);
  }, o = e.value ? We(e.value).format(i) : "";
  return g(it, {
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
      var d = Mg();
      d.addEventListener("paste", () => a({
        currentTarget: s.ref
      })), Re(d, "input", a, !0), d.$$click = () => a({
        currentTarget: s.ref
      }), d.addEventListener("change", (x) => c(x.currentTarget.value)), d.addEventListener("focus", (x) => vt(x, e)), d.$$keydown = (x) => bt(x);
      var f = s.ref;
      return typeof f == "function" ? ct(f, d) : s.ref = d, d.value = o, V((x) => {
        var $ = "inputMask" + e.component.dataKey, M = {
          ["formgear-input-papi-validation-" + e.classValidation]: !0
        }, v = r.replace(/[a]/g, "__").replace(/[9]/g, "#"), u = n();
        return $ !== x.e && U(d, "id", x.e = $), x.t = Z(d, M, x.t), v !== x.a && U(d, "placeholder", x.a = v), u !== x.o && (d.disabled = x.o = u), x;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0
      }), d;
    }
  });
};
ge(["keydown", "click", "input"]);
var Eg = /* @__PURE__ */ y("<input type=number class=formgear-input-papi>");
const Lg = (e) => {
  const t = e.config, [n] = j(t.formMode > 1 ? !0 : e.component.disableInput);
  return g(it, {
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
      var i = Eg();
      return i.addEventListener("change", (r) => e.onValueChange(r.currentTarget.value)), V((r) => {
        var a = {
          ["formgear-input-papi-validation-" + e.classValidation]: !0
        }, l = e.component.rangeInput[0].min, s = e.component.rangeInput[0].max, c = e.component.rangeInput[0].step, o = n();
        return r.e = Z(i, a, r.e), l !== r.t && U(i, "min", r.t = l), s !== r.a && U(i, "max", r.a = s), c !== r.o && U(i, "step", r.o = c), o !== r.i && (i.disabled = r.i = o), r;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0,
        i: void 0
      }), V(() => i.value = e.value || 0), i;
    }
  });
};
var Pi = /* @__PURE__ */ y('<input type=number class="formgear-input-papi block pr-20"placeholder>'), Og = /* @__PURE__ */ y('<div class=relative><div class="absolute inset-y-0 right-0 flex items-center">');
const Ag = (e) => {
  const [t] = tt(), [n] = nt(), i = e.config, [r] = j(i.formMode > 1 ? !0 : e.component.disableInput), [a, l] = j(""), [s, c] = j(!1), [o, d] = j([]), [f, x] = j(""), $ = !1;
  let M = (v, u, w) => {
    if (w == 2 && u.value != "" && u.value != null) {
      let p = JSON.parse(JSON.stringify(e.value));
      p = [], p.push({
        value: v,
        unit: u
      }), e.onValueChange(p);
    } else {
      let p = JSON.parse(JSON.stringify(e.value));
      p = [], p.push({
        value: v,
        unit: u
      }), e.onValueChange(p);
    }
  };
  switch (e.component.typeOption) {
    case 1: {
      try {
        let v = e.component.options.map((w, p) => ({
          value: w.value,
          label: w.label
        })), u = e.value && e.value != "" && e.value[0].unit && e.value[0].unit.value && e.value[0].unit.value != "" ? e.value[0].unit.value : "";
        $e(() => {
          l(e.component.label), d(v);
          let w = v.filter((p) => p.value.includes(u))[0] && u != "" ? v.filter((p) => p.value.includes(u))[0].label : "Select Unit";
          x(w), c(!0);
        });
      } catch (v) {
        ve(n.details.language[0].fetchFailed);
      }
      break;
    }
    case 2: {
      try {
        if (i.lookupMode === 1) {
          let v, u, w, p;
          $ || (u = e.component.sourceSelect, v = `${i.baseUrl}/${u[0].id}/filter?version=${u[0].version}`, u[0].parentCondition.length > 0 && (w = v, p = u[0].parentCondition.map((O, N) => {
            let m = O.value.split("@"), h = t.details.find((b) => b.dataKey == m[0]);
            if (h.answer) {
              const b = h.answer;
              if (b.length > 0) {
                let C = encodeURI(b[b.length - 1].value);
                v = `${i.lookupKey}=${O.key}&${i.lookupValue}=${C}`;
              }
            } else
              v = `${i.lookupKey}=${O.key}&${i.lookupValue}=''`;
            return v;
          }).join("&"), v = `${w}&${p}`));
          const [_] = Ht(() => v, e.MobileOnlineSearch);
          let S = e.value && e.value != "" && e.value[0].unit && e.value[0].unit.value && e.value[0].unit.value != "" ? e.value[0].unit.value : "";
          $e(() => {
            if (l(e.component.label), _())
              if (!_().success)
                ve(n.details.language[0].fetchFailed);
              else {
                let O;
                if (!$) {
                  O = [];
                  let m = u[0].value, h = u[0].desc;
                  _().data.map((b, C) => {
                    O.push({
                      value: b[m],
                      label: b[h]
                    });
                  });
                }
                let N = O.find((m) => m.value == S) && S != "" ? O.find((m) => m.value == S).label : "Select Unit";
                d(O), x(N), c(!0);
              }
          });
        } else if (i.lookupMode === 2) {
          let v, u = [];
          v = e.component.sourceSelect;
          let w = v[0].id, p = v[0].version;
          v[0].parentCondition.length > 0 && v[0].parentCondition.map((O, N) => {
            let m = O.value.split("@"), h = t.details.find((b) => b.dataKey == m[0]);
            if (h.answer) {
              const b = h.answer;
              if (b.length > 0) {
                let C = b[b.length - 1].value.toString();
                u.push({
                  key: O.key,
                  value: C
                });
              }
            }
          });
          let _ = (O) => {
            let N = [];
            if (O.data.length > 0) {
              let m = v[0].value, h = v[0].desc, b = e.value && e.value != "" && e.value[0].unit && e.value[0].unit.value && e.value[0].unit.value != "" ? e.value[0].unit.value : "";
              O.data.map((L, E) => {
                N.push({
                  value: L[m],
                  label: L[h]
                });
              });
              let C = N.find((L) => L.value == b) && b != "" ? N.find((L) => L.value == b).label : "Select Unit";
              l(e.component.label), d(N), x(C), c(!0);
            }
          };
          const S = e.MobileOfflineSearch(w, p, u, _);
        }
      } catch (v) {
        ve(n.details.language[0].fetchFailed);
      }
      break;
    }
    case 3: {
      try {
        let v, u, w = e.value && e.value != "" && e.value[0].unit && e.value[0].unit.value && e.value[0].unit.value != "" ? e.value[0].unit.value : "";
        if (e.component.sourceOption !== void 0 && e.component.typeOption === 3) {
          const _ = t.details.findIndex((S) => S.dataKey === e.component.sourceOption);
          t.details[_].type, v = t.details[_].answer, v != null ? u = v.filter((S, O) => S.value != 0).map((S, O) => ({
            value: S.value,
            label: S.label
          })) : u = [];
        }
        let p = u.find((_) => _.value == w) && w != "" ? u.find((_) => _.value == w).label : "Select Unit";
        $e(() => {
          l(e.component.label), d(u), x(p), c(!0);
        });
      } catch (v) {
        ve(n.details.language[0].fetchFailed);
      }
      break;
    }
    default: {
      try {
        let v;
        e.component.options ? v = e.component.options.map((w, p) => ({
          value: w.value,
          label: w.label
        })) : v = [];
        let u = e.value && e.value != "" && e.value[0].unit && e.value[0].unit.value && e.value[0].unit.value != "" ? e.value[0].unit.value : "";
        $e(() => {
          l(e.component.label), d(v);
          let w = v.filter((p) => p.value.includes(u))[0] && u != "" ? v.filter((p) => p.value.includes(u))[0].label : "Select Unit";
          x(w), c(!0);
        });
      } catch (v) {
        ve(n.details.language[0].fetchFailed);
      }
      break;
    }
  }
  return g(it, {
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
      var v = Og(), u = v.firstChild;
      return k(v, g(P, {
        get when() {
          return e.component.lengthInput === void 0;
        },
        get children() {
          var w = Pi();
          return w.addEventListener("change", (p) => {
            M(p ? p.currentTarget.value : "", e.value != null && e.value != "" ? e.value[0].unit ? e.value[0].unit : {
              value: "",
              label: ""
            } : {
              value: "",
              label: ""
            }, 1);
          }), V((p) => {
            var _ = e.component.dataKey, S = {
              ["formgear-input-papi-validation-" + e.classValidation]: !0
            }, O = r();
            return _ !== p.e && U(w, "name", p.e = _), p.t = Z(w, S, p.t), O !== p.a && (w.disabled = p.a = O), p;
          }, {
            e: void 0,
            t: void 0,
            a: void 0
          }), V(() => w.value = e.value != null && e.value != "" ? e.value[0].value : ""), w;
        }
      }), u), k(v, g(P, {
        get when() {
          return ke(() => e.component.lengthInput !== void 0)() && e.component.lengthInput.length > 0;
        },
        get children() {
          var w = Pi();
          return w.$$input = (p) => {
            const _ = p.currentTarget;
            _.value.length > _.maxLength && (_.value = _.value.slice(0, _.maxLength));
          }, w.addEventListener("change", (p) => {
            M(p ? p.currentTarget.value : "", e.value != null && e.value != "" ? e.value[0].unit ? e.value[0].unit : {
              value: "",
              label: ""
            } : {
              value: "",
              label: ""
            }, 1);
          }), V((p) => {
            var _ = e.component.dataKey, S = {
              ["formgear-input-papi-validation-" + e.classValidation]: !0
            }, O = r(), N = e.component.lengthInput[0].maxlength !== void 0 ? e.component.lengthInput[0].maxlength : "", m = e.component.lengthInput[0].minlength !== void 0 ? e.component.lengthInput[0].minlength : "", h = e.component.rangeInput && e.component.rangeInput[0].max !== void 0 ? e.component.rangeInput[0].max : "", b = e.component.rangeInput && e.component.rangeInput[0].min !== void 0 ? e.component.rangeInput[0].min : "";
            return _ !== p.e && U(w, "name", p.e = _), p.t = Z(w, S, p.t), O !== p.a && (w.disabled = p.a = O), N !== p.o && U(w, "maxlength", p.o = N), m !== p.i && U(w, "minlength", p.i = m), h !== p.n && U(w, "max", p.n = h), b !== p.s && U(w, "min", p.s = b), p;
          }, {
            e: void 0,
            t: void 0,
            a: void 0,
            o: void 0,
            i: void 0,
            n: void 0,
            s: void 0
          }), V(() => w.value = e.value != null && e.value != "" ? e.value[0].value : ""), w;
        }
      }), u), k(u, g(Ot, et({
        class: "formgear-select-unit  w-full rounded font-light text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-0 border-transparent focus:outline-none  disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
      }, () => Lt(o() || [], {
        key: "label",
        filterable: !0
      }), {
        get disabled() {
          return r();
        },
        placeholder: "Unit",
        onChange: (w) => M(e.value != null && e.value != "" ? e.value[0].value : "", {
          value: w ? w.value : "",
          label: w ? w.label : ""
        }, 2),
        get initialValue() {
          return {
            value: e.value && e.value != "" && e.value[0].unit && e.value[0].unit.value && e.value[0].unit.value != "" ? e.value[0].unit.value : "",
            label: f
          };
        }
      })), null), k(u, g(Br, {
        size: 20,
        class: "text-gray-400  mr-3"
      }), null), v;
    }
  });
};
ge(["input"]);
var Rg = /* @__PURE__ */ y("<input type=text class=formgear-input-papi placeholder>");
const Vg = (e) => {
  const t = e.config, [n] = j(t.formMode > 1 ? !0 : e.component.disableInput);
  let i = (s) => {
    let c = String.fromCharCode(s.charCode ? s.charCode : s.which), o = e.component.separatorFormat === "id-ID" ? /^\d{1,99}(?:\,\d{0,10})?$/ : /^\d{1,99}(?:\.\d{0,10})?$/, d = document.getElementById("currencyInput" + e.index).value, f = a(d);
    o.test(f + c) || (s.preventDefault ? s.preventDefault() : s.returnValue = !1);
  }, r = Wn((s) => {
    let c = a(s), o = e.component.separatorFormat === "id-ID" ? c.replace(",", ".") : c;
    e.onValueChange(o);
  }, 1e3), a = (s) => {
    let c, o;
    return e.component.separatorFormat === "id-ID" ? (c = e.component.isDecimal ? s.indexOf(",00") != -1 ? s.substring(0, s.indexOf(",00")) : s : s.indexOf(",") != -1 ? s.substring(0, s.indexOf(",")) : s, o = "0123456789,") : e.component.separatorFormat === "en-US" && (c = e.component.isDecimal ? s.indexOf(".00") != -1 ? s.substring(0, s.indexOf(".00")) : s : s.indexOf(".") != -1 ? s.substring(0, s.indexOf(".")) : s, o = "0123456789."), Array.from(c).filter((d) => o.includes(d)).join("");
  }, l = Number(e.value).toLocaleString(e.component.separatorFormat, {
    style: "currency",
    currency: e.component.currency,
    minimumFractionDigits: 0
  });
  return g(it, {
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
      var s = Rg();
      return s.$$keyup = (c) => r(c.currentTarget.value), s.addEventListener("keypress", (c) => i(c)), V((c) => {
        var o = e.component.dataKey, d = {
          ["formgear-input-papi-validation-" + e.classValidation]: !0
        }, f = n(), x = "currencyInput" + e.index, $ = e.component.rangeInput && e.component.rangeInput[0].max !== void 0 ? e.component.rangeInput[0].max : "", M = e.component.rangeInput && e.component.rangeInput[0].min !== void 0 ? e.component.rangeInput[0].min : "";
        return o !== c.e && U(s, "name", c.e = o), c.t = Z(s, d, c.t), f !== c.a && (s.disabled = c.a = f), x !== c.o && U(s, "id", c.o = x), $ !== c.i && U(s, "max", c.i = $), M !== c.n && U(s, "min", c.n = M), c;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0,
        i: void 0,
        n: void 0
      }), V(() => s.value = e.component.separatorFormat === "id-ID" ? l.replace(",00", "") : l.replace("IDR", "Rp")), s;
    }
  });
};
ge(["keyup"]);
var Ng = /* @__PURE__ */ y('<input type=text class="w-full border-gray-300 rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400">');
const Tg = (e) => {
  const t = e.config, [n] = j(t.formMode > 1 ? !0 : e.component.disableInput), i = Sn(e.component.maskingFormat), a = {
    ref: void 0
  };
  let l = (s) => {
    e.onValueChange(s);
  };
  return $e(() => {
    document.getElementById("inputMask" + e.component.dataKey).click();
  }), g(it, {
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
      var s = Ng();
      s.addEventListener("paste", () => i({
        currentTarget: a.ref
      })), Re(s, "input", i, !0), s.$$click = () => i({
        currentTarget: a.ref
      }), s.addEventListener("change", (o) => l(o.currentTarget.value));
      var c = a.ref;
      return typeof c == "function" ? ct(c, s) : a.ref = s, V((o) => {
        var d = "inputMask" + e.component.dataKey, f = e.component.maskingFormat.replace(/[a]/g, "__").replace(/[9]/g, "#"), x = n();
        return d !== o.e && U(s, "id", o.e = d), f !== o.t && U(s, "placeholder", o.t = f), x !== o.a && (s.disabled = o.a = x), o;
      }, {
        e: void 0,
        t: void 0,
        a: void 0
      }), V(() => s.value = e.value), s;
    }
  });
};
ge(["click", "input"]);
var Pg = /* @__PURE__ */ y('<div class="grid font-light text-sm content-start">'), Dg = /* @__PURE__ */ y('<div class="font-light text-sm space-x-2 py-2.5 px-4 grid grid-cols-12"><div class=col-span-1><label class="cursor-pointer text-sm"><input class="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer checked:disabled:bg-gray-500 checked:dark:disabled:bg-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"type=checkbox disabled></label></div><div class=col-span-11><input type=text class="w-full font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none">'), jg = /* @__PURE__ */ y('<div class="font-light text-sm space-x-2 py-2.5 px-4 grid grid-cols-12"><div class=col-span-1><label class="cursor-pointer text-sm"><input class="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer checked:disabled:bg-gray-500 checked:dark:disabled:bg-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"type=checkbox disabled></label></div><div class=col-span-11>');
const Kg = (e) => {
  const t = (i) => e.value ? !!e.value.some((r) => String(r.value) === String(i)) : !1, n = (i) => {
    let r = e.value.findIndex((a) => String(a.value) === String(i));
    return e.value[r].label;
  };
  return (() => {
    var i = Pg();
    return k(i, g(ce, {
      get each() {
        return e.options;
      },
      children: (r, a) => g(me, {
        get children() {
          return [g(Q, {
            get when() {
              return ke(() => !!r.open)() && t(r.value);
            },
            get children() {
              var l = Dg(), s = l.firstChild, c = s.firstChild, o = c.firstChild, d = s.nextSibling, f = d.firstChild;
              return f.addEventListener("change", (x) => e.onValueChange(r.value, x.currentTarget.value, r.open)), V((x) => {
                var $ = "chexbox" + a(), M = "checkbox-" + e.component.dataKey + "-" + a();
                return $ !== x.e && U(c, "for", x.e = $), M !== x.t && U(o, "id", x.t = M), x;
              }, {
                e: void 0,
                t: void 0
              }), V(() => o.value = r.value), V(() => o.checked = r.value ? t(r.value) : !1), V(() => f.value = n(r.value)), l;
            }
          }), g(Q, {
            get when() {
              return !r.open || !t(r.value);
            },
            get children() {
              var l = jg(), s = l.firstChild, c = s.firstChild, o = c.firstChild, d = s.nextSibling;
              return V((f) => {
                var x = "checkbox-" + e.component.dataKey + "-" + a(), $ = r.label;
                return x !== f.e && U(o, "id", f.e = x), $ !== f.t && (d.innerHTML = f.t = $), f;
              }, {
                e: void 0,
                t: void 0
              }), V(() => o.value = r.value), V(() => o.checked = r.value ? t(r.value) : !1), l;
            }
          })];
        }
      })
    })), V((r) => {
      var a = e.component.cols === 1 || e.component.cols === void 0, l = e.component.cols === 2, s = e.component.cols === 3, c = e.component.cols === 4, o = e.component.cols === 5;
      return a !== r.e && i.classList.toggle("grid-cols-1", r.e = a), l !== r.t && i.classList.toggle("grid-cols-2", r.t = l), s !== r.a && i.classList.toggle("grid-cols-3", r.a = s), c !== r.o && i.classList.toggle("grid-cols-4", r.o = c), o !== r.i && i.classList.toggle("grid-cols-5", r.i = o), r;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0
    }), i;
  })();
};
var Di = /* @__PURE__ */ y("<input type=text class=formgear-input-papi placeholder>");
const ji = (e) => {
  const [t] = tt(), n = e.config, [i] = j(n.formMode > 1 ? !0 : e.component.disableInput);
  let r = Ce(() => {
    if (e.component.sourceOption !== void 0 && e.component.typeOption === 3) {
      let d = e.component.sourceOption.split("@");
      const f = t.details.findIndex((x) => x.dataKey === d[0]);
      return t.details[f].type, t.details[f].answer;
    }
    return [];
  });
  const [a] = j(e.component.sourceOption !== void 0 ? r() : e.component.options);
  let l = (d, f, x) => {
    let $;
    if (x == null) {
      const M = Li(a()), v = M.map((w) => Number(w.checkboxValue)), u = og(Number(d), v);
      u.length > 0 && ($ = M.filter((w) => u.includes(Number(w.checkboxValue))).map((w) => (delete w.checkboxValue, w)));
    } else if ($ = JSON.parse(JSON.stringify(s())), $)
      if (e.value.some((M) => String(M.value) === String(d)))
        if (x) {
          let M = a().findIndex((v) => v.value == d);
          $ = $.filter((v) => v.value != d), a()[M].label !== f && $.push({
            value: d,
            label: f
          });
        } else
          $ = $.filter((M) => M.value != d);
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
  const s = Ce(() => {
    var d;
    return ((d = e.value) == null ? void 0 : d.length) > 0 ? Li(a()).filter((f) => e.value.find((x) => f.value === x.value)) : [];
  }), c = Ce(() => {
    var d;
    return ((d = e.value) == null ? void 0 : d.length) > 0 ? dg(s().map((f) => f.checkboxValue)) : e.value;
  });
  return g(it, {
    get validationMessage() {
      return e.validationMessage;
    },
    get component() {
      return e.component;
    },
    optionSection: () => g(Kg, {
      get component() {
        return e.component;
      },
      get options() {
        return a();
      },
      get settedValue() {
        return c();
      },
      onValueChange: l,
      get disableInput() {
        return i();
      },
      get value() {
        return e.value;
      }
    }),
    get children() {
      return [g(P, {
        get when() {
          return e.component.lengthInput === void 0;
        },
        get children() {
          var d = Di();
          return d.$$keydown = (f) => bt(f), d.addEventListener("focus", (f) => vt(f, e)), d.addEventListener("change", (f) => {
            l(f.currentTarget.value);
          }), V((f) => {
            var x = e.component.dataKey, $ = {
              ["formgear-input-papi-validation-" + e.classValidation]: !0
            }, M = i();
            return x !== f.e && U(d, "name", f.e = x), f.t = Z(d, $, f.t), M !== f.a && (d.disabled = f.a = M), f;
          }, {
            e: void 0,
            t: void 0,
            a: void 0
          }), V(() => d.value = c()), d;
        }
      }), g(P, {
        get when() {
          return ke(() => e.component.lengthInput !== void 0)() && e.component.lengthInput.length > 0;
        },
        get children() {
          var d = Di();
          return d.$$keydown = (f) => bt(f), d.addEventListener("focus", (f) => vt(f, e)), d.addEventListener("change", (f) => {
            e.onValueChange(f.currentTarget.value);
          }), V((f) => {
            var x = e.component.dataKey, $ = {
              ["formgear-input-papi-validation-" + e.classValidation]: !0
            }, M = i(), v = e.component.lengthInput[0].maxlength !== void 0 ? e.component.lengthInput[0].maxlength : "", u = e.component.lengthInput[0].minlength !== void 0 ? e.component.lengthInput[0].minlength : "";
            return x !== f.e && U(d, "name", f.e = x), f.t = Z(d, $, f.t), M !== f.a && (d.disabled = f.a = M), v !== f.o && U(d, "maxlength", f.o = v), u !== f.i && U(d, "minlength", f.i = u), f;
          }, {
            e: void 0,
            t: void 0,
            a: void 0,
            o: void 0,
            i: void 0
          }), V(() => d.value = c()), d;
        }
      })];
    }
  });
};
ge(["keydown"]);
var zg = /* @__PURE__ */ y('<input type=file accept=image/* class="hidden w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"style=color:transparent>'), Fg = /* @__PURE__ */ y('<button class="formgear-input-papi flex"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5 mr-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z">'), Bg = /* @__PURE__ */ y('<div class="font-light text-sm space-x-2 py-2.5 px-2 col-span-12 space-y-4"><div class=preview-class><div class="container mx-auto"><img class=rounded-md style=width:100%;height:100%>');
const Hg = (e) => {
  const [t] = nt(), [n, i] = j(""), [r, a] = j(""), [l] = j(e.config.formMode > 1 ? !0 : e.component.disableInput);
  let s = new FileReader();
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
      let x = o.target.files[0], $ = x.name.split(".").pop().toLowerCase();
      f.includes($) ? (s.readAsDataURL(x), s.onload = (M) => {
        var v = x.name;
        d = [], URL.createObjectURL(x), d.push({
          value: M.target.result,
          label: v,
          type: o.target.files[0].type
        }), e.onValueChange(d), Ue("Image uploaded successfully!");
      }) : ve("Please submit the appropriate format!");
    }
  };
  return g(it, {
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
        var o = zg();
        return o.addEventListener("change", (d) => {
          c(d);
        }), V((d) => {
          var f = "inputFile_" + e.component.dataKey, x = e.component.dataKey;
          return f !== d.e && U(o, "id", d.e = f), x !== d.t && U(o, "name", d.t = x), d;
        }, {
          e: void 0,
          t: void 0
        }), o;
      })(), (() => {
        var o = Fg();
        return o.firstChild, o.$$click = (d) => {
          document.getElementById("inputFile_" + e.component.dataKey).click();
        }, k(o, () => t.details.language[0].uploadImage, null), V((d) => {
          var f = {
            ["formgear-input-papi-validation-" + e.classValidation]: !0
          }, x = l(), $ = t.details.language[0].uploadImage;
          return d.e = Z(o, f, d.e), x !== d.t && (o.disabled = d.t = x), $ !== d.a && U(o, "title", d.a = $), d;
        }, {
          e: void 0,
          t: void 0,
          a: void 0
        }), o;
      })(), g(P, {
        get when() {
          return r() != "";
        },
        get children() {
          var o = Bg(), d = o.firstChild, f = d.firstChild, x = f.firstChild;
          return V(($) => {
            var M = r(), v = "img-preview" + e.component.dataKey;
            return M !== $.e && U(x, "src", $.e = M), v !== $.t && U(x, "id", $.t = v), $;
          }, {
            e: void 0,
            t: void 0
          }), o;
        }
      })];
    }
  });
};
ge(["click"]);
const Ug = /* @__PURE__ */ new Map([[2, Cr], [25, Il], [26, xl], [27, Ms], [28, Ts], [29, Ws], [30, no], [31, Ir], [19, Er], [11, Eo], [12, jo], [13, Lr], [14, Or], [15, Ar], [16, Rr], [17, Vr], [18, Ad], [3, Nr], [20, Bd], [21, Tr], [22, Pr], [23, pc], [24, Rc], [4, Dr], [32, Gc], [33, jr], [34, Kr], [35, zr], [36, Fr], [37, Xu], [38, Hr], [39, Ur], [40, Jr], [41, Wr], [42, qr]]), Jg = /* @__PURE__ */ new Map([[2, Cr], [25, xg], [26, Ri], [27, Ri], [28, yg], [29, ji], [30, pg], [31, Ir], [19, Er], [11, Cg], [12, Ig], [13, Lr], [14, Or], [15, Ar], [16, Rr], [17, Vr], [18, Lg], [3, Nr], [20, Vg], [21, Tr], [22, Pr], [23, ji], [24, Tg], [4, Dr], [32, Hg], [33, jr], [34, Kr], [35, zr], [36, Fr], [37, Ag], [38, Hr], [39, Ur], [40, Jr], [41, Wr], [42, qr]]), Yr = Ut(), Qr = Ut(), Wg = {
  loader: []
}, qg = (e) => {
  const [t, n] = Un(Wg);
  function i(a) {
    n("loader", ci((l) => {
      l.push({
        id: 1
      });
    }));
  }
  const r = (a) => () => {
    n("loader", ci((l) => {
      const s = l.findIndex((c) => c.id === a);
      s > -1 && l.splice(s, 1);
    }));
  };
  return g(Yr.Provider, {
    value: t,
    get children() {
      return g(Qr.Provider, {
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
}, Gg = () => Jt(Yr), Gn = () => Jt(Qr);
var Yg = /* @__PURE__ */ y('<div class="modal-loading fixed z-10 inset-0 overflow-y-auto"aria-labelledby=modal-title role=dialog aria-modal=true><div class="flex items-center justify-center min-h-screen pt-4 px-4 text-center sm:block sm:p-0"><div class="fixed inset-0 bg-gray-500/75 transition-opacity"aria-hidden=true></div><span class="hidden sm:inline-block sm:align-middle sm:h-screen"aria-hidden=true>&#8203;</span><div class="relative inline-block overflow-hidden transform transition-all items-center"><svg class="animate-spin h-16 w-16 text-zinc-300"xmlns=http://www.w3.org/2000/svg fill=none viewBox="0 0 24 24"><circle class=opacity-25 cx=12 cy=12 r=10 stroke=currentColor stroke-width=4></circle><path class=opacity-75 fill=currentColor d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">'), Qg = /* @__PURE__ */ y('<div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4"><div class="grid grid-cols-8"><div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full text-yellow-400 bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10"><svg xmlns=http://www.w3.org/2000/svg class="h-6 w-6 "fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path></svg></div><div class="mt-1 text-left col-span-7 "><textarea rows=2 class="w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 border border-solid border-gray-300 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"placeholder>'), Zg = /* @__PURE__ */ y('<div class="bg-white px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"><button type=button class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">&nbsp;&nbsp;Save&nbsp;&nbsp;</button><button type=button class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Cancel'), Xg = /* @__PURE__ */ y('<div class="bg-white px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"><button type=button class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Close'), eh = /* @__PURE__ */ y('<div class="modal-remark fixed z-10 inset-0 overflow-y-auto"aria-labelledby=modal-title role=dialog aria-modal=true><div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"><div class="fixed inset-0 bg-gray-500/75 transition-opacity"aria-hidden=true></div><span class="hidden sm:inline-block sm:align-middle sm:h-screen"aria-hidden=true>&#8203;</span><div class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"><div class="bg-gray-50 p-8 space-y-5">'), th = /* @__PURE__ */ y("<div><div>"), nh = /* @__PURE__ */ y('<div class="bg-white p-4 grid grid-cols-8 rounded-lg"><div class="text-xs font-normal text-gray-400 col-span-5"></div><div class="text-xs font-light text-indigo-700 col-span-3 text-right italic"></div><div class="text-xs text-gray-700 py-2 -mb-2 col-span-12 text-justify">');
const ih = (e) => {
  const t = ut(), [n, {
    setActiveComponent: i
  }] = mr(), {
    setLoader: r,
    removeLoader: a
  } = Gn(), [l] = nt(), [s, c] = $r(), [o, d] = _r(), [f, x] = tt(), [$, M] = yr(), [v] = xr(), [u, w] = br(), [p] = Jn(), [_] = pr(), [S] = wr(), [O] = kr(), [N] = Sr(), [m, h] = j(""), [b, C] = j([]), [L, E] = j(""), [I, R] = j("E"), [A, T] = j(!1), K = (Y) => {
    var W;
    const q = f.details.findIndex((ie) => ie.dataKey === Y);
    return q !== -1 && (W = f.details[q].enable) != null ? W : !0;
  }, F = () => {
    const Y = [], q = [], W = [];
    f.details.forEach((ae) => {
      ae.type > be.INNER_HTML && ae.enable && ae.answer !== void 0 && ae.answer !== "" && ae.answer !== null && N().findIndex((xe) => xe.parentIndex.toString() === ae.index.slice(0, -2).toString()) == -1 && ((ae.type === be.PHOTO || ae.type === be.SIGNATURE) && q.push({
        dataKey: ae.dataKey,
        name: ae.name,
        answer: ae.answer
      }), Y.push({
        dataKey: ae.dataKey,
        name: ae.name,
        answer: ae.answer
      }), ae.principal !== void 0 && W.push({
        dataKey: ae.dataKey,
        name: ae.name,
        answer: ae.answer,
        principal: ae.principal,
        columnName: ae.columnName
      }));
    }), w("details", "answers", Y), w("details", "templateDataKey", S.details.dataKey), w("details", "gearVersion", ot), w("details", "templateVersion", dn), w("details", "validationVersion", cn), w("details", "docState", I()), w("details", "summary", JSON.parse(JSON.stringify(_))), w("details", "counter", [JSON.parse(JSON.stringify(O))]);
    let ie = We().format("YYYY-MM-DD HH:mm:ss");
    u.details.createdBy === void 0 || u.details.createdBy !== void 0 && u.details.createdBy === "" ? w("details", "createdBy", e.config.username) : w("details", "updatedBy", e.config.username), u.details.createdAt === void 0 || u.details.createdAt !== void 0 && u.details.createdAt === "" ? w("details", "createdAt", ie) : w("details", "updatedAt", ie), d("details", "principals", W), d("details", "templateDataKey", S.details.dataKey), d("details", "gearVersion", ot), d("details", "templateVersion", dn), d("details", "validationVersion", cn), o.details.createdBy === void 0 || o.details.createdBy !== void 0 && o.details.createdBy === "" ? d("details", "createdBy", e.config.username) : d("details", "updatedBy", e.config.username), o.details.createdAt === void 0 || o.details.createdAt !== void 0 && o.details.createdAt === "" ? d("details", "createdAt", ie) : d("details", "updatedAt", ie), M("details", "notes", JSON.parse(JSON.stringify(s.details.notes))), M("details", "templateDataKey", S.details.dataKey), M("details", "gearVersion", ot), M("details", "templateVersion", dn), M("details", "validationVersion", cn), $.details.createdBy === void 0 || $.details.createdBy !== void 0 && $.details.createdBy === "" ? M("details", "createdBy", e.config.username) : M("details", "updatedBy", e.config.username), $.details.createdAt === void 0 || $.details.createdAt !== void 0 && $.details.createdAt === "" ? M("details", "createdAt", ie) : M("details", "updatedAt", ie), x("sidebar", p.details);
  }, D = (Y) => {
    if (F(), e.setResponseMobile(u.details, v.details, $.details, o.details, f), /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
      var q = document.querySelector(".mobile-component-div");
    else
      var q = document.querySelector(".component-div");
    const W = p.details.findIndex((ie) => ie.dataKey === Y);
    W === -1 || !p.details[W] || (i({
      dataKey: Y,
      label: p.details[W].label,
      index: JSON.parse(JSON.stringify(p.details[W].index)),
      position: W
    }), window.scrollTo({
      top: 0,
      behavior: "smooth"
    }), q.scrollTo({
      top: 0,
      behavior: "smooth"
    }));
  }, z = (Y) => {
    r({}), setTimeout(() => {
      try {
        t.history.clear(), t.answer.saveAnswer(e.component.dataKey, Y, {
          activePosition: n.activeComponent.position
        });
      } catch (q) {
        ve(l.details.language[0].errorSaving + e.component.dataKey, 3e3), t.history.reloadFromHistory();
      } finally {
        t.history.clear();
      }
    }, 50);
  };
  let B = Ce(() => {
    const Y = f.details.findIndex((q) => q.dataKey === e.component.dataKey);
    return f.details[Y] ? f.details[Y].validationState : 0;
  });
  const J = (Y) => {
    const q = f.details.findIndex((W) => W.dataKey === e.component.dataKey);
    return f.details[q] ? f.details[q].validationMessage : [];
  }, H = () => {
    if (L().length !== 0) {
      let Y = [];
      Y.push({
        sender: e.config.username,
        datetime: We().format("YYYY-MM-DD HH:mm:ss"),
        comment: L()
      });
      let q = JSON.parse(JSON.stringify(s.details.notes));
      if (q.length == 0)
        q = [...q, {
          dataKey: m(),
          comments: Y
        }];
      else {
        let ae = q.findIndex((fe) => fe.dataKey == m());
        ae == -1 ? q = [...q, {
          dataKey: m(),
          comments: Y
        }] : q[ae].comments.push(Y[0]);
      }
      let W = f.details.findIndex((ae) => ae.dataKey === m());
      x("details", W, "hasRemark", !0), x("details", W, "validationState", 0), x("details", W, "validationMessage", []), c("details", "notes", q), E("");
      const ie = document.querySelector(".modal-remark");
      ie ? (ie.classList.add("closing"), setTimeout(() => {
        h(""), Ue(l.details.language[0].remarkAdded, 500);
      }, 200)) : (h(""), Ue(l.details.language[0].remarkAdded, 500)), F(), e.setResponseMobile(u.details, $.details, o.details, f);
    } else
      ve(l.details.language[0].remarkEmpty, 500);
  }, ee = (Y) => {
    G(Y);
  }, G = (Y) => {
    if (m() === "") {
      h(Y);
      let q = JSON.parse(JSON.stringify(s.details.notes)), W = q.findIndex((ie) => ie.dataKey == Y);
      C(q[W] !== void 0 ? q[W].comments : []);
    } else
      h(Y);
  }, le = () => {
    const Y = document.querySelector(".modal-remark");
    Y ? (Y.classList.add("closing"), setTimeout(() => {
      h("");
    }, 200)) : h("");
  }, re = (Y) => {
    let q = JSON.parse(JSON.stringify(s.details.notes)), W = q.findIndex((ie) => ie.dataKey == Y);
    return q[W] !== void 0 ? q[W].comments.length : 0;
  }, te = e.config.clientMode === dt.PAPI ? Jg : Ug;
  return (() => {
    var Y = th(), q = Y.firstChild;
    return k(Y, g(P, {
      get when() {
        return A();
      },
      get children() {
        return Yg();
      }
    }), null), k(Y, g(P, {
      get when() {
        return m() !== "";
      },
      get children() {
        var W = eh(), ie = W.firstChild, ae = ie.firstChild, fe = ae.nextSibling, xe = fe.nextSibling, ye = xe.firstChild;
        return ae.$$click = le, k(ye, g(ce, {
          get each() {
            return b();
          },
          children: (Me, he) => (() => {
            var _e = nh(), Ve = _e.firstChild, Je = Ve.nextSibling, ze = Je.nextSibling;
            return k(Ve, () => Me.sender), k(Je, () => Me.datetime), k(ze, () => Me.comment), _e;
          })()
        })), k(xe, g(P, {
          get when() {
            return e.config.formMode < 3;
          },
          get children() {
            return [(() => {
              var Me = Qg(), he = Me.firstChild, _e = he.firstChild, Ve = _e.nextSibling, Je = Ve.firstChild;
              return Je.addEventListener("change", (ze) => {
                E(ze.currentTarget.value);
              }), Me;
            })(), (() => {
              var Me = Zg(), he = Me.firstChild, _e = he.nextSibling;
              return he.$$click = (Ve) => H(), _e.$$click = le, Me;
            })()];
          }
        }), null), k(xe, g(P, {
          get when() {
            return e.config.formMode == 3;
          },
          get children() {
            var Me = Xg(), he = Me.firstChild;
            return he.$$click = le, Me;
          }
        }), null), V(() => ye.classList.toggle("hidden", b().length == 0)), W;
      }
    }), null), k(Y, g(me, {
      get children() {
        return g(ce, {
          get each() {
            return Array.from(te.keys());
          },
          children: (W) => g(Q, {
            get when() {
              return ke(() => e.component.type === W)() && K(e.component.dataKey);
            },
            get children() {
              return te.get(W)({
                onMobile: e.onMobile,
                component: e.component,
                index: e.index,
                onValueChange: z,
                onUserClick: D,
                value: t.reference.getValue(e.component.dataKey),
                config: e.config,
                classValidation: B(),
                comments: re(e.component.dataKey),
                MobileUploadHandler: e.MobileUploadHandler,
                validationMessage: J(e.component.dataKey),
                openRemark: ee,
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
    }), null), V(() => U(q, "id", e.component.dataKey + "___scrollView")), Y;
  })();
};
ge(["click"]);
var rh = /* @__PURE__ */ y('<div class="flex-grow bg-white dark:bg-gray-900 overflow-y-auto mb-20"><div class="space-y-3 sm:p-7 p-3">');
const ah = (e) => (() => {
  var t = rh(), n = t.firstChild;
  return k(n, g(ce, {
    get each() {
      return e.components;
    },
    children: (i, r) => ih({
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
var sn = { exports: {} }, lh = sn.exports, Ki;
function sh() {
  return Ki || (Ki = 1, (function(e, t) {
    (function(n, i) {
      e.exports = i();
    })(lh, (function() {
      var n = { year: 0, month: 1, day: 2, hour: 3, minute: 4, second: 5 }, i = {};
      return function(r, a, l) {
        var s, c = function(x, $, M) {
          M === void 0 && (M = {});
          var v = new Date(x), u = (function(w, p) {
            p === void 0 && (p = {});
            var _ = p.timeZoneName || "short", S = w + "|" + _, O = i[S];
            return O || (O = new Intl.DateTimeFormat("en-US", { hour12: !1, timeZone: w, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", timeZoneName: _ }), i[S] = O), O;
          })($, M);
          return u.formatToParts(v);
        }, o = function(x, $) {
          for (var M = c(x, $), v = [], u = 0; u < M.length; u += 1) {
            var w = M[u], p = w.type, _ = w.value, S = n[p];
            S >= 0 && (v[S] = parseInt(_, 10));
          }
          var O = v[3], N = O === 24 ? 0 : O, m = v[0] + "-" + v[1] + "-" + v[2] + " " + N + ":" + v[4] + ":" + v[5] + ":000", h = +x;
          return (l.utc(m).valueOf() - (h -= h % 1e3)) / 6e4;
        }, d = a.prototype;
        d.tz = function(x, $) {
          x === void 0 && (x = s);
          var M, v = this.utcOffset(), u = this.toDate(), w = u.toLocaleString("en-US", { timeZone: x }), p = Math.round((u - new Date(w)) / 1e3 / 60), _ = 15 * -Math.round(u.getTimezoneOffset() / 15) - p;
          if (!Number(_)) M = this.utcOffset(0, $);
          else if (M = l(w, { locale: this.$L }).$set("millisecond", this.$ms).utcOffset(_, !0), $) {
            var S = M.utcOffset();
            M = M.add(v - S, "minute");
          }
          return M.$x.$timezone = x, M;
        }, d.offsetName = function(x) {
          var $ = this.$x.$timezone || l.tz.guess(), M = c(this.valueOf(), $, { timeZoneName: x }).find((function(v) {
            return v.type.toLowerCase() === "timezonename";
          }));
          return M && M.value;
        };
        var f = d.startOf;
        d.startOf = function(x, $) {
          if (!this.$x || !this.$x.$timezone) return f.call(this, x, $);
          var M = l(this.format("YYYY-MM-DD HH:mm:ss:SSS"), { locale: this.$L });
          return f.call(M, x, $).tz(this.$x.$timezone, !0);
        }, l.tz = function(x, $, M) {
          var v = M && $, u = M || $ || s, w = o(+l(), u);
          if (typeof x != "string") return l(x).tz(u);
          var p = (function(N, m, h) {
            var b = N - 60 * m * 1e3, C = o(b, h);
            if (m === C) return [b, m];
            var L = o(b -= 60 * (C - m) * 1e3, h);
            return C === L ? [b, C] : [N - 60 * Math.min(C, L) * 1e3, Math.max(C, L)];
          })(l.utc(x, v).valueOf(), w, u), _ = p[0], S = p[1], O = l(_).utcOffset(S);
          return O.$x.$timezone = u, O;
        }, l.tz.guess = function() {
          return Intl.DateTimeFormat().resolvedOptions().timeZone;
        }, l.tz.setDefault = function(x) {
          s = x;
        };
      };
    }));
  })(sn)), sn.exports;
}
var oh = sh();
const dh = /* @__PURE__ */ Rt(oh);
var on = { exports: {} }, ch = on.exports, zi;
function uh() {
  return zi || (zi = 1, (function(e, t) {
    (function(n, i) {
      e.exports = i();
    })(ch, (function() {
      var n = "minute", i = /[+-]\d\d(?::?\d\d)?/g, r = /([+-]|\d\d)/g;
      return function(a, l, s) {
        var c = l.prototype;
        s.utc = function(v) {
          var u = { date: v, utc: !0, args: arguments };
          return new l(u);
        }, c.utc = function(v) {
          var u = s(this.toDate(), { locale: this.$L, utc: !0 });
          return v ? u.add(this.utcOffset(), n) : u;
        }, c.local = function() {
          return s(this.toDate(), { locale: this.$L, utc: !1 });
        };
        var o = c.parse;
        c.parse = function(v) {
          v.utc && (this.$u = !0), this.$utils().u(v.$offset) || (this.$offset = v.$offset), o.call(this, v);
        };
        var d = c.init;
        c.init = function() {
          if (this.$u) {
            var v = this.$d;
            this.$y = v.getUTCFullYear(), this.$M = v.getUTCMonth(), this.$D = v.getUTCDate(), this.$W = v.getUTCDay(), this.$H = v.getUTCHours(), this.$m = v.getUTCMinutes(), this.$s = v.getUTCSeconds(), this.$ms = v.getUTCMilliseconds();
          } else d.call(this);
        };
        var f = c.utcOffset;
        c.utcOffset = function(v, u) {
          var w = this.$utils().u;
          if (w(v)) return this.$u ? 0 : w(this.$offset) ? f.call(this) : this.$offset;
          if (typeof v == "string" && (v = (function(O) {
            O === void 0 && (O = "");
            var N = O.match(i);
            if (!N) return null;
            var m = ("" + N[0]).match(r) || ["-", 0, 0], h = m[0], b = 60 * +m[1] + +m[2];
            return b === 0 ? 0 : h === "+" ? b : -b;
          })(v), v === null)) return this;
          var p = Math.abs(v) <= 16 ? 60 * v : v;
          if (p === 0) return this.utc(u);
          var _ = this.clone();
          if (u) return _.$offset = p, _.$u = !1, _;
          var S = this.$u ? this.toDate().getTimezoneOffset() : -1 * this.utcOffset();
          return (_ = this.local().add(p + S, n)).$offset = p, _.$x.$localOffset = S, _;
        };
        var x = c.format;
        c.format = function(v) {
          var u = v || (this.$u ? "YYYY-MM-DDTHH:mm:ss[Z]" : "");
          return x.call(this, u);
        }, c.valueOf = function() {
          var v = this.$utils().u(this.$offset) ? 0 : this.$offset + (this.$x.$localOffset || this.$d.getTimezoneOffset());
          return this.$d.valueOf() - 6e4 * v;
        }, c.isUTC = function() {
          return !!this.$u;
        }, c.toISOString = function() {
          return this.toDate().toISOString();
        }, c.toString = function() {
          return this.toDate().toUTCString();
        };
        var $ = c.toDate;
        c.toDate = function(v) {
          return v === "s" && this.$offset ? s(this.format("YYYY-MM-DD HH:mm:ss:SSS")).toDate() : $.call(this);
        };
        var M = c.diff;
        c.diff = function(v, u, w) {
          if (v && this.$u === v.$u) return M.call(this, v, u, w);
          var p = this.local(), _ = s(v).local();
          return M.call(p, _, u, w);
        };
      };
    }));
  })(on)), on.exports;
}
var gh = uh();
const hh = /* @__PURE__ */ Rt(gh), Fi = {
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
function Zr(e, t, n = {}) {
  const { defaultValue: i, logErrors: r = !0 } = n;
  if (!e || e.trim() === "")
    return {
      success: !0,
      value: i
    };
  try {
    return {
      success: !0,
      value: fh(e, t)()
    };
  } catch (a) {
    const l = a instanceof Error ? a.message : String(a);
    return {
      success: !1,
      value: i,
      error: l
    };
  }
}
function fh(e, t) {
  const n = [
    "getValue",
    "getRowIndex",
    "getProp",
    "answer",
    "rowIndex",
    ...Object.keys(Fi)
  ], i = [
    t.getValue,
    t.getRowIndex,
    t.getProp,
    t.answer,
    t.getRowIndex(0),
    // rowIndex shorthand
    ...Object.values(Fi)
  ], r = `
    'use strict';
    return (${e});
  `, a = new Function(...n, r);
  return () => a(...i);
}
function mh(e, t, n = !0) {
  return !e || e.trim() === "" ? !0 : Zr(e, t, {
    defaultValue: n,
    logErrors: !0
  }).value;
}
function vh(e, t) {
  return !e || e.trim() === "" ? void 0 : Zr(e, t, {
    defaultValue: void 0,
    logErrors: !0
  }).value;
}
function Bi(e) {
  return (t) => {
    const n = e.split("@")[0].split("#"), i = n.length, r = t + 1;
    return i - r < 1 ? Number(n[1]) || 0 : Number(n[i - r]) || 0;
  };
}
const bh = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i, Dt = () => typeof navigator == "undefined" ? !1 : bh.test(navigator.userAgent), wh = 300, xh = {
  behavior: "smooth",
  block: "start",
  delay: wh
}, yh = () => document.querySelector(".component-div"), jt = () => {
  const e = yh();
  e && (e.scrollTop = 0), window.scrollTo({ top: 0, behavior: "smooth" });
}, ph = (e, t = {}) => {
  const { behavior: n, block: i, delay: r } = Se(Se({}, xh), t);
  setTimeout(() => {
    const a = document.getElementById(`${e}___scrollView`);
    a && a.scrollIntoView({ behavior: n, block: i });
  }, r);
}, kh = (e, t) => e.findIndex(
  (n) => n.index.toString() === t.toString()
), Xr = 200, Cn = (e, t, n = Xr) => {
  const i = e.split(" ").filter(Boolean).map((a) => `.${a}`).join(""), r = document.querySelector(i);
  r ? (r.classList.add("closing"), setTimeout(() => {
    t(!1), r.classList.remove("closing");
  }, n)) : t(!1);
}, $h = (e, t = Xr) => {
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
}, Kt = {
  ERROR: "modal-error",
  REMARK: "modal-remark",
  BLANK: "modal-blank",
  CONFIRMATION: "modal-confirmation"
};
var _h = /* @__PURE__ */ y('<th class="p-2 whitespace-nowrap font-semibold text-left w-5/12">'), Sh = /* @__PURE__ */ y('<div aria-labelledby=modal-title role=dialog aria-modal=true><div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"><div class="fixed inset-0 bg-gray-500/75 transition-opacity"aria-hidden=true></div><span class="hidden sm:inline-block sm:align-middle sm:h-screen"aria-hidden=true>&#8203;</span><div class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full"><div class="bg-white px-4 pt-5 pb-4 sm:p-6"><div class="sm:flex sm:items-start mt-6"><div></div><div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left"><h3 class="text-lg leading-6 font-medium text-gray-900"><span class="text-sm font-normal text-gray-500 ml-2">(<!>-<!> of <!>)</span></h3><div class="relative overflow-auto"><div class="shadow-sm overflow-auto my-6"><table class="border-collapse table-fixed w-full text-sm"><thead class="text-sm font-semibold text-gray-600 bg-gray-50"><tr><th class="p-2 whitespace-nowrap font-semibold text-left w-1/12">No</th><th>Field</th><th></th></tr></thead><tbody class="text-sm divide-y divide-gray-100"></tbody></table></div></div></div></div></div><div class="bg-white px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"><button type=button class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Close'), Ch = /* @__PURE__ */ y('<td class="border-b border-slate-100 align-top pb-2">'), Mh = /* @__PURE__ */ y('<tr class=text-gray-600><td class="border-b border-slate-100 p-2 align-top"><div class="text-left text-sm font-light">&nbsp;&nbsp;</div></td><td class="border-b border-slate-100 p-2 align-top"><div class="text-left text-sm font-light"></div></td><td class="border-b border-slate-100 align-top p-2"><button class="bg-transparent text-gray-500 rounded-full focus:outline-none h-5 w-5 hover:bg-gray-400 hover:text-white flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"viewBox="0 0 20 20"fill=currentColor stroke-width=2><path fill-rule=evenodd d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z"clip-rule=evenodd>'), Ih = /* @__PURE__ */ y('<div class="grid grid-cols-12 text-sm font-light mt-1"><div class="col-span-1 flex justify-center items-start">-</div><div class="col-span-11 text-justify mr-1">'), Eh = /* @__PURE__ */ y('<div class="flex justify-center items-center gap-2 py-3 border-t border-gray-100"><button type=button class="inline-flex items-center justify-center w-8 h-8 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all duration-200"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"viewBox="0 0 20 20"fill=currentColor><path fill-rule=evenodd d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"clip-rule=evenodd></path></svg></button><div class="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 font-medium"><span class=text-gray-900></span><span class=text-gray-400>/</span><span class=text-gray-500></span></div><button type=button class="inline-flex items-center justify-center w-8 h-8 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all duration-200"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"viewBox="0 0 20 20"fill=currentColor><path fill-rule=evenodd d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"clip-rule=evenodd>');
const Yt = 3, Hi = (e) => {
  const t = () => {
    Cn(e.modalClass, e.setShow);
  }, n = (l) => l + 1 + (e.currentPage * Yt - Yt), i = () => e.totalItems || 0, r = () => i() > 0 ? (e.currentPage - 1) * Yt + 1 : 0, a = () => i() > 0 ? Math.min(e.currentPage * Yt, i()) : 0;
  return g(P, {
    get when() {
      return e.show;
    },
    get children() {
      var l = Sh(), s = l.firstChild, c = s.firstChild, o = c.nextSibling, d = o.nextSibling, f = d.firstChild, x = f.firstChild, $ = x.firstChild, M = $.nextSibling, v = M.firstChild, u = v.firstChild, w = u.firstChild, p = w.nextSibling, _ = p.nextSibling, S = _.nextSibling, O = S.nextSibling, N = O.nextSibling;
      N.nextSibling;
      var m = v.nextSibling, h = m.firstChild, b = h.firstChild, C = b.firstChild, L = C.firstChild, E = L.firstChild, I = E.nextSibling, R = I.nextSibling, A = C.nextSibling, T = f.nextSibling, K = T.firstChild;
      return c.$$click = t, k($, () => e.icon), k(v, () => e.title, u), k(u, r, p), k(u, a, S), k(u, () => e.totalItems, N), k(L, g(P, {
        get when() {
          return e.showMessages;
        },
        get children() {
          var F = _h();
          return k(F, () => e.messageColumnTitle || "Messages"), F;
        }
      }), R), k(A, g(ce, {
        get each() {
          return e.items;
        },
        children: (F, D) => (() => {
          var z = Mh(), B = z.firstChild, J = B.firstChild;
          J.firstChild;
          var H = B.nextSibling, ee = H.firstChild, G = H.nextSibling, le = G.firstChild;
          return k(J, () => n(D()), null), k(z, g(P, {
            get when() {
              return ke(() => !!e.showMessages)() && F.message;
            },
            get children() {
              var re = Ch();
              return k(re, g(ce, {
                get each() {
                  return F.message;
                },
                children: (te) => (() => {
                  var Y = Ih(), q = Y.firstChild, W = q.nextSibling;
                  return k(W, te), Y;
                })()
              })), re;
            }
          }), G), le.$$click = (re) => e.onItemClick(re, F.sideIndex, F.dataKey), V(() => ee.innerHTML = F.label), z;
        })()
      })), k(m, g(Lh, {
        get currentPage() {
          return e.currentPage;
        },
        get maxPage() {
          return e.maxPage;
        },
        get onPageChange() {
          return e.onPageChange;
        }
      }), null), K.$$click = t, V((F) => {
        var D = `${e.modalClass} fixed z-10 inset-0 overflow-y-auto`, z = `mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 ${e.iconBgClass}`, B = `p-2 whitespace-nowrap font-semibold text-left ${e.showMessages ? "w-4/12" : "w-5/12"}`, J = `p-2 whitespace-nowrap font-semibold text-left ${e.showMessages ? "w-2/12" : "w-1/12"}`;
        return D !== F.e && at(l, F.e = D), z !== F.t && at($, F.t = z), B !== F.a && at(I, F.a = B), J !== F.o && at(R, F.o = J), F;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0
      }), l;
    }
  });
}, Lh = (e) => {
  const t = () => e.currentPage === 1, n = () => e.currentPage >= e.maxPage, i = () => e.maxPage > 1;
  return g(P, {
    get when() {
      return i();
    },
    get children() {
      var r = Eh(), a = r.firstChild, l = a.nextSibling, s = l.firstChild, c = s.nextSibling, o = c.nextSibling, d = l.nextSibling;
      return a.$$click = () => e.onPageChange(e.currentPage - 1), k(s, () => e.currentPage), k(o, () => e.maxPage), d.$$click = () => e.onPageChange(e.currentPage + 1), V((f) => {
        var x = t(), $ = n();
        return x !== f.e && (a.disabled = f.e = x), $ !== f.t && (d.disabled = f.t = $), f;
      }, {
        e: void 0,
        t: void 0
      }), r;
    }
  });
};
ge(["click"]);
var Oh = /* @__PURE__ */ y('<div class="modal-confirmation fixed z-10 inset-0 overflow-y-auto"aria-labelledby=modal-title role=dialog aria-modal=true><div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"><div class="fixed inset-0 bg-gray-500/75 transition-opacity"aria-hidden=true></div><span class="hidden sm:inline-block sm:align-middle sm:h-screen"aria-hidden=true>&#8203;</span><div class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"><div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4"><div class="sm:flex sm:items-start"><div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-teal-200 sm:mx-0 sm:h-10 sm:w-10 text-teal-500"><svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg></div><div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left"><h3 class="text-lg leading-6 font-medium text-gray-900"id=titleModalDelete>Confirmation submission</h3><div class=mt-2><p class="text-sm text-gray-500"id=contentModalDelete>Thank you for completing the survey. Please provide this final verification to complete the submission!</p></div><div class="mt-4 flex space-y-2 space-x-2 items-center justify-center md:items-end md:justify-start"><span class="rounded-lg text-3xl italic font-mono cursor-not-allowed text-slate-600 p-2 bg-gradient-to-r from-teal-500 to-teal-50 text-justify line-through pointer-events-none select-none"></span><button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-5 w-5 flex justify-center items-center"><svg xmlns=http://www.w3.org/2000/svg class="h-3 w-3"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg></button></div><div class="mt-4 flex space-y-2 space-x-2 items-center justify-center"><input type=number class="w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 border border-solid border-gray-300 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"placeholder></div></div></div></div><div class="bg-white px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"><button type=button class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-teal-600 text-base font-medium text-white hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">Submit</button><button type=button class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Cancel');
const Ah = (e) => {
  const t = () => {
    Cn("modal-confirmation", e.setShow);
  };
  return g(P, {
    get when() {
      return e.show;
    },
    get children() {
      var n = Oh(), i = n.firstChild, r = i.firstChild, a = r.nextSibling, l = a.nextSibling, s = l.firstChild, c = s.firstChild, o = c.firstChild, d = o.nextSibling, f = d.firstChild, x = f.nextSibling, $ = x.nextSibling, M = $.firstChild, v = M.nextSibling, u = $.nextSibling, w = u.firstChild, p = s.nextSibling, _ = p.firstChild, S = _.nextSibling;
      return r.$$click = t, k(M, () => e.captcha), Re(v, "click", e.onRefreshCaptcha, !0), w.addEventListener("change", (O) => e.onCaptchaChange(O.currentTarget.value)), Re(_, "click", e.onSubmit, !0), S.$$click = t, n;
    }
  });
};
ge(["click"]);
var Rh = /* @__PURE__ */ y('<svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Vh = /* @__PURE__ */ y('<svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), Nh = /* @__PURE__ */ y('<svg xmlns=http://www.w3.org/2000/svg class="h-6 w-6"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z">'), Th = /* @__PURE__ */ y('<svg xmlns=http://www.w3.org/2000/svg class="h-6 w-6"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">'), Ph = /* @__PURE__ */ y('<svg xmlns=http://www.w3.org/2000/svg class="h-6 w-6"fill=none viewBox="0 0 24 24"stroke=currentColor><path stroke-linecap=round stroke-linejoin=round stroke-width=2 d="M4 6h16M4 12h16M4 18h16">'), Dh = /* @__PURE__ */ y('<svg class="bg-white h-3 w-3 text-gray-400"fill=currentColor viewBox="0 0 20 20"xmlns=http://www.w3.org/2000/svg><path fill-rule=evenodd d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"clip-rule=evenodd>'), jh = /* @__PURE__ */ y('<svg class="bg-white h-3 w-3 text-indigo-600"width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path fill-rule=evenodd clip-rule=evenodd d="M12.2256 2.00253C9.59172 1.94346 6.93894 2.9189 4.92893 4.92891C1.02369 8.83415 1.02369 15.1658 4.92893 19.071C8.83418 22.9763 15.1658 22.9763 19.0711 19.071C21.0811 17.061 22.0565 14.4082 21.9975 11.7743C21.9796 10.9772 21.8669 10.1818 21.6595 9.40643C21.0933 9.9488 20.5078 10.4276 19.9163 10.8425C18.5649 11.7906 17.1826 12.4053 15.9301 12.6837C14.0241 13.1072 12.7156 12.7156 12 12C11.2844 11.2844 10.8928 9.97588 11.3163 8.0699C11.5947 6.81738 12.2094 5.43511 13.1575 4.08368C13.5724 3.49221 14.0512 2.90664 14.5935 2.34046C13.8182 2.13305 13.0228 2.02041 12.2256 2.00253ZM17.6569 17.6568C18.9081 16.4056 19.6582 14.8431 19.9072 13.2186C16.3611 15.2643 12.638 15.4664 10.5858 13.4142C8.53361 11.362 8.73568 7.63895 10.7814 4.09281C9.1569 4.34184 7.59434 5.09193 6.34315 6.34313C3.21895 9.46732 3.21895 14.5326 6.34315 17.6568C9.46734 20.781 14.5327 20.781 17.6569 17.6568Z"fill=currentColor>'), Kh = /* @__PURE__ */ y('<svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"viewBox="0 0 20 20"fill=currentColor stroke-width=2><path fill-rule=evenodd d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z"clip-rule=evenodd>');
const zh = () => Rh(), Fh = () => Vh(), Bh = () => Nh(), Hh = () => Th(), Uh = () => Ph(), Jh = () => Dh(), Wh = () => jh(), qh = () => Kh();
var Gh = /* @__PURE__ */ y('<div class="modal-confirmation modal-error fixed z-10 inset-0 overflow-y-auto"aria-labelledby=modal-title role=dialog aria-modal=true><div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"><div class="fixed inset-0 bg-gray-500/75 transition-opacity"aria-hidden=true></div><span class="hidden sm:inline-block sm:align-middle sm:h-screen"aria-hidden=true>&#8203;</span><div class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full"><div class="bg-white px-4 pt-5 pb-4 sm:p-6"></div><div class="bg-white px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"><button type=button class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Close'), Yh = /* @__PURE__ */ y('<div class="flex justify-center items-center gap-2 py-3 border-t border-gray-100"><button type=button class="inline-flex items-center justify-center w-8 h-8 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all duration-200"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"viewBox="0 0 20 20"fill=currentColor><path fill-rule=evenodd d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"clip-rule=evenodd></path></svg></button><div class="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 font-medium"><span class=text-gray-900></span><span class=text-gray-400>/</span><span class=text-gray-500></span></div><button type=button class="inline-flex items-center justify-center w-8 h-8 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all duration-200"><svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"viewBox="0 0 20 20"fill=currentColor><path fill-rule=evenodd d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"clip-rule=evenodd>'), Qh = /* @__PURE__ */ y('<div class="sm:flex sm:items-start"><div></div><div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left"><h3 class="text-lg leading-6 font-medium text-gray-900"><span class="text-sm font-normal text-gray-500 ml-2">(<!>-<!> of <!>)</span></h3><div class="relative overflow-auto"><div class="shadow-sm overflow-auto my-6"><table class="border-collapse table-fixed w-full text-sm"><thead class="text-sm font-semibold text-gray-600 bg-gray-50"><tr><th class="p-2 whitespace-nowrap font-semibold text-left w-1/12">No</th><th class="p-2 whitespace-nowrap font-semibold text-left w-4/12">Field</th><th class="p-2 whitespace-nowrap font-semibold text-left w-5/12"></th><th class="p-2 whitespace-nowrap font-semibold text-left w-2/12"></th></tr></thead><tbody class="text-sm divide-y divide-gray-100">'), Zh = /* @__PURE__ */ y('<tr class=text-gray-600><td class="border-b border-slate-100 p-2 align-top"><div class="text-left text-sm font-light">&nbsp;&nbsp;</div></td><td class="border-b border-slate-100 p-2 align-top"><div class="text-left text-sm font-light"></div></td><td class="border-b border-slate-100 align-top pb-2"></td><td class="border-b border-slate-100 align-top p-2"><button class="bg-transparent text-gray-500 rounded-full focus:outline-none h-5 w-5 hover:bg-gray-400 hover:text-white flex justify-center items-center">'), Xh = /* @__PURE__ */ y('<div class="grid grid-cols-12 text-sm font-light mt-1"><div class="col-span-1 flex justify-center items-start">-</div><div class="col-span-11 text-justify mr-1">');
const ef = (e) => {
  const t = () => {
    Cn(Kt.ERROR, e.setShow);
  };
  return g(P, {
    get when() {
      return e.show;
    },
    get children() {
      var n = Gh(), i = n.firstChild, r = i.firstChild, a = r.nextSibling, l = a.nextSibling, s = l.firstChild, c = s.nextSibling, o = c.firstChild;
      return r.$$click = t, k(s, g(Ui, {
        title: "List Error",
        get icon() {
          return g(zh, {});
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
      }), null), k(s, g(P, {
        get when() {
          return e.warningItems.length > 0;
        },
        get children() {
          return g(Ui, {
            title: "List Warning",
            get icon() {
              return g(Fh, {});
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
}, Qt = 3, Ui = (e) => {
  const t = (c) => c + 1 + (e.currentPage * Qt - Qt), n = () => e.totalItems || 0, i = () => n() > 0 ? (e.currentPage - 1) * Qt + 1 : 0, r = () => n() > 0 ? Math.min(e.currentPage * Qt, n()) : 0, a = () => e.currentPage === 1, l = () => e.currentPage >= e.maxPage, s = () => e.maxPage > 1;
  return (() => {
    var c = Qh(), o = c.firstChild, d = o.nextSibling, f = d.firstChild, x = f.firstChild, $ = x.firstChild, M = $.nextSibling, v = M.nextSibling, u = v.nextSibling, w = u.nextSibling, p = w.nextSibling;
    p.nextSibling;
    var _ = f.nextSibling, S = _.firstChild, O = S.firstChild, N = O.firstChild, m = N.firstChild, h = m.firstChild, b = h.nextSibling, C = b.nextSibling, L = N.nextSibling;
    return k(o, () => e.icon), k(f, () => e.title, x), k(x, i, M), k(x, r, u), k(x, n, p), k(C, () => e.messageColumnTitle), k(L, g(ce, {
      get each() {
        return e.items;
      },
      children: (E, I) => (() => {
        var R = Zh(), A = R.firstChild, T = A.firstChild;
        T.firstChild;
        var K = A.nextSibling, F = K.firstChild, D = K.nextSibling, z = D.nextSibling, B = z.firstChild;
        return k(T, () => t(I()), null), k(D, g(ce, {
          get each() {
            return E.message;
          },
          children: (J) => (() => {
            var H = Xh(), ee = H.firstChild, G = ee.nextSibling;
            return k(G, J), H;
          })()
        })), B.$$click = (J) => e.onItemClick(J, E.sideIndex, E.dataKey), k(B, g(qh, {})), V(() => F.innerHTML = E.label), R;
      })()
    })), k(_, g(P, {
      get when() {
        return s();
      },
      get children() {
        var E = Yh(), I = E.firstChild, R = I.nextSibling, A = R.firstChild, T = A.nextSibling, K = T.nextSibling, F = R.nextSibling;
        return I.$$click = () => e.onPageChange(e.currentPage - 1), k(A, () => e.currentPage), k(K, () => e.maxPage), F.$$click = () => e.onPageChange(e.currentPage + 1), V((D) => {
          var z = a(), B = l();
          return z !== D.e && (I.disabled = D.e = z), B !== D.t && (F.disabled = D.t = B), D;
        }, {
          e: void 0,
          t: void 0
        }), E;
      }
    }), null), V((E) => {
      var I = !!e.isNested, R = `mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 ${e.iconBgClass}`;
      return I !== E.e && c.classList.toggle("mt-6", E.e = I), R !== E.t && at(o, E.t = R), E;
    }, {
      e: void 0,
      t: void 0
    }), c;
  })();
};
ge(["click"]);
var tf = /* @__PURE__ */ y('<div class="font-light text-xs"><div>'), nf = /* @__PURE__ */ y('<a class="block py-2 px-4 rounded font-medium space-x-2 hover:bg-blue-700 hover:text-white"href=javascript:void(0);>'), rf = /* @__PURE__ */ y('<ul class="border-l border-gray-300 dark:border-slate-500 ml-4"><li>'), af = /* @__PURE__ */ y("<ul class=formgear-sidebar><li>");
const lf = (e) => {
  const t = (l, s, c) => {
    jt(), Dt() && e.onSidebarCollapse(l), e.onWriteResponse(), e.onSelect(s.dataKey, s.label, JSON.parse(JSON.stringify(s.index)), c);
  }, n = (l) => e.allItems.findIndex((s) => s.dataKey === l.dataKey), i = (l) => l.dataKey === e.activeDataKey, r = (l, s) => e.allItems.filter((c) => {
    if (c.level !== s || !c.enable) return !1;
    switch (s) {
      case 1:
        return l.index[1] === c.index[1];
      case 2:
        return l.index[1] === c.index[1] && l.index[3] === c.index[3] && l.index[4] === c.index[4];
      case 3:
        return l.index[1] === c.index[1] && l.index[3] === c.index[3] && l.index[5] === c.index[5] && l.index[6] === c.index[6];
      default:
        return !1;
    }
  }), a = (l, s) => [(() => {
    var c = nf();
    return c.$$click = (o) => t(o, l, n(l)), k(c, () => l.label, null), k(c, g(P, {
      get when() {
        return l.description;
      },
      get children() {
        var o = tf(), d = o.firstChild;
        return V(() => d.innerHTML = l.description), o;
      }
    }), null), V((o) => Z(c, {
      "bg-blue-800 text-white": i(l)
    }, o)), c;
  })(), g(P, {
    when: s < 3,
    get children() {
      return g(ce, {
        get each() {
          return r(l, s + 1);
        },
        children: (c) => (() => {
          var o = rf(), d = o.firstChild;
          return k(d, () => a(c, s + 1)), V(() => o.classList.toggle("show", e.item.index[1] === e.activeIndex[1])), o;
        })()
      });
    }
  })];
  return g(P, {
    get when() {
      return ke(() => e.item.level === 0)() && e.item.enable;
    },
    get children() {
      var l = af(), s = l.firstChild;
      return k(s, () => a(e.item, 0)), l;
    }
  });
};
ge(["click"]);
var sf = /* @__PURE__ */ y('<div class="sidebar-overlay fixed inset-0 bg-black/80 backdrop-blur-sm z-10 md:hidden opacity-0 pointer-events-none transition-all duration-300 ease-in-out">'), of = /* @__PURE__ */ y('<div class="bg-white dark:bg-gray-900 w-72 flex-shrink-0 border-r border-gray-200 dark:border-gray-800 h-screen p-5 sidebar-span fixed inset-y-0 left-0 -translate-x-full transition-all duration-300 ease-in-out md:relative md:translate-x-0 z-20 md:z-auto"><div class="sm:min-h-[7rem] py-3 text-gray-400 tracking-wider flex justify-between"><button type=button class="md:hidden p-2 mobile-menu-button"><svg xmlns=http://www.w3.org/2000/svg class="h-6 w-6"fill=none viewBox="0 0 24 24"stroke=currentColor><path stroke-linecap=round stroke-linejoin=round stroke-width=2 d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></button></div><div class="h-3/6 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-50 dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-500 overflow-y-scroll scrollbar-thumb-rounded-full scrollbar-track-rounded-full"><div></div><div class="sticky bottom-0 bg-gradient-to-t from-white dark:from-slate-900 pt-14">'), Ji = /* @__PURE__ */ y('<div class="text-lg block px-4 py-3 text-gray-600 dark:text-white font-bold sm:text-xl">'), df = /* @__PURE__ */ y('<button class="bg-teal-300 dark:bg-teal-500 hover:bg-teal-200 dark:hover:bg-teal-400 text-teal-100 p-3 w-full rounded-md shadow font-medium">Submit'), cf = /* @__PURE__ */ y('<button class="bg-red-500 hover:bg-red-400 text-teal-100 p-3 w-full rounded-md shadow font-medium">List Error'), uf = /* @__PURE__ */ y('<div class=h-2/6><div class="bg-white px-8 p-5 w-full flex flex-col dark:bg-gray-900 space-y-4 absolute bottom-0 left-0"><div class="grid grid-cols-2 gap-y-4 sm:pb-3"></div><div>'), gf = /* @__PURE__ */ y('<div class="h-auto text-5xl text-center sm:flex flex-col flex-coltext-white font-medium"><div class="font-light text-xs">');
const hf = (e) => g(P, {
  get when() {
    return e.clientMode !== dt.PAPI;
  },
  get children() {
    return [(() => {
      var t = sf();
      return Re(t, "click", e.onSidebarCollapse, !0), t;
    })(), (() => {
      var t = of(), n = t.firstChild, i = n.firstChild, r = n.nextSibling, a = r.firstChild;
      return k(n, g(ff, {
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
      }), i), Re(i, "click", e.onSidebarCollapse, !0), k(a, g(ce, {
        get each() {
          return e.sidebarDetails;
        },
        children: (l) => g(lf, {
          item: l,
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
      })), k(t, g(mf, {
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
}), ff = (e) => g(P, {
  get when() {
    return e.clientMode !== dt.CAWI;
  },
  get fallback() {
    return (() => {
      var t = Ji();
      return V(() => t.innerHTML = e.acronym), t;
    })();
  },
  get children() {
    var t = Ji();
    return V(() => t.innerHTML = `${e.acronym}<div class="text-xs font-light text-gray-600 dark:text-gray-400">🚀${ot} 📋${e.templateVersion} ✔️${e.validationVersion}</div>`), t;
  }
}), mf = (e) => (() => {
  var t = uf(), n = t.firstChild, i = n.firstChild, r = i.nextSibling;
  return k(i, g(Zt, {
    get value() {
      return e.summary.answer;
    },
    get label() {
      return e.locale.summaryAnswer;
    }
  }), null), k(i, g(Zt, {
    get value() {
      return e.summary.blank;
    },
    get label() {
      return e.locale.summaryBlank;
    },
    get onClick() {
      return e.onShowBlank;
    }
  }), null), k(i, g(Zt, {
    get value() {
      return e.summary.error;
    },
    get label() {
      return e.locale.summaryError;
    },
    get onClick() {
      return e.onShowError;
    }
  }), null), k(i, g(Zt, {
    get value() {
      return e.summary.remark;
    },
    get label() {
      return e.locale.summaryRemark;
    },
    get onClick() {
      return e.onShowRemark;
    }
  }), null), k(r, g(P, {
    get when() {
      return ke(() => e.summary.error === 0)() && e.formMode === 1;
    },
    get children() {
      var a = df();
      return Re(a, "click", e.onSubmit, !0), a;
    }
  }), null), k(r, g(P, {
    get when() {
      return ke(() => e.summary.error > 0)() && e.formMode < 3;
    },
    get children() {
      var a = cf();
      return Re(a, "click", e.onShowError, !0), a;
    }
  }), null), t;
})(), Zt = (e) => (() => {
  var t = gf(), n = t.firstChild;
  return Re(t, "click", e.onClick, !0), k(t, () => e.value, n), k(n, () => e.label), V(() => t.classList.toggle("cursor-pointer", !!e.onClick)), t;
})();
ge(["click"]);
var vf = /* @__PURE__ */ y('<div class="flex justify-end items-center col-start-6 pr-5 transition"><button class="bg-teal-500 text-white p-2 rounded-full focus:outline-none items-center h-10 w-10 hover:bg-teal-400"><svg xmlns=http://www.w3.org/2000/svg class="h-6 w-6"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z">'), bf = /* @__PURE__ */ y('<div class="grid grid-cols-6 w-full justify-end items-end"><div class="flex justify-center items-center py-2 rounded-full bg-gray-200/80 dark:bg-gray-800/90"><button><svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 20 20"fill=currentColor><path fill-rule=evenodd d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"clip-rule=evenodd></path></svg></button><div class="flex justify-center items-center text-center"></div><div><button class="absolute inset-0 bg-red-200 text-red-500 rounded-full focus:outline-none flex justify-center items-center transition-all duration-300 ease-in-out"><svg xmlns=http://www.w3.org/2000/svg fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></button><button class="absolute inset-0 bg-teal-200 text-teal-500 rounded-full focus:outline-none flex justify-center items-center transition-all duration-300 ease-in-out"><svg xmlns=http://www.w3.org/2000/svg fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2><path stroke-linecap=round stroke-linejoin=round d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg></button><button class="absolute inset-0 bg-blue-700 text-white p-2 rounded-full focus:outline-none hover:bg-blue-600 flex justify-center items-center transition-all duration-300 ease-in-out"><svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 20 20"fill=currentColor><path fill-rule=evenodd d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"clip-rule=evenodd></path></svg></button></div></div><div class="flex justify-end items-center transition-all duration-300 ease-in-out"><button><svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 20 20"fill=currentColor><path fill-rule=evenodd d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"clip-rule=evenodd>');
const Wi = (e) => {
  const t = () => !e.hasNext, n = () => t() && e.hasErrors, i = () => t() && !e.hasErrors && e.formMode === 1, r = () => e.hasNext, a = e.isMobile ? "h-8 w-8" : "h-10 w-10", l = e.isMobile ? "h-4 w-4" : "h-5 w-5", s = e.isMobile ? "h-10 w-10" : "h-12 w-12", c = e.isMobile ? "h-6 w-6" : "h-8 w-8";
  return (() => {
    var o = bf(), d = o.firstChild, f = d.firstChild, x = f.firstChild, $ = f.nextSibling, M = $.nextSibling, v = M.firstChild, u = v.firstChild, w = v.nextSibling, p = w.firstChild, _ = w.nextSibling, S = _.firstChild, O = d.nextSibling, N = O.firstChild, m = N.firstChild;
    return Re(f, "click", e.onPrevious, !0), at(f, `bg-blue-700 text-white p-2 rounded-full focus:outline-none items-center hover:bg-blue-600 group inline-flex justify-center text-xs transition-all duration-300 ease-in-out overflow-hidden ${a}`), U(x, "class", `${l} shrink-0`), k($, () => e.activeLabel), at(M, `relative ${a}`), Re(v, "click", e.onShowError, !0), U(u, "class", l), Re(w, "click", e.onSubmit, !0), U(p, "class", l), Re(_, "click", e.onNext, !0), U(S, "class", l), Re(N, "click", e.onScrollTop, !0), at(N, `scrolltotop-div bg-yellow-400 text-white p-2 rounded-full focus:outline-none items-center hover:bg-yellow-300 transition-transform hover:scale-110 ${s}`), U(m, "class", c), k(o, g(P, {
      get when() {
        return ke(() => !!(e.isMobile && e.onSave))() && e.formMode < 3;
      },
      get children() {
        var h = vf(), b = h.firstChild;
        return Re(b, "click", e.onSave, !0), h;
      }
    }), null), V((h) => {
      var b = {
        "bottom-4 right-0 sticky": !e.isMobile,
        "pb-4 pt-2 bottom-0 mt-10 bg-gray-100/10 dark:bg-gray-900/70 backdrop-blur-md sticky": e.isMobile
      }, C = {
        "space-x-10 mx-10 col-start-2 col-end-6": !e.isMobile,
        "space-x-4 col-start-1 col-end-5 ml-4 mr-4": e.isMobile
      }, L = {
        "opacity-100": e.hasPrevious,
        "opacity-0 w-0 p-0": !e.hasPrevious
      }, E = !!e.isMobile, I = {
        "opacity-100 scale-100": n(),
        "opacity-0 scale-0 pointer-events-none": !n()
      }, R = {
        "opacity-100 scale-100": i(),
        "opacity-0 scale-0 pointer-events-none": !i()
      }, A = {
        "opacity-100 scale-100": r(),
        "opacity-0 scale-0 pointer-events-none": !r()
      }, T = {
        "pr-8": !e.isMobile,
        "pr-2": e.isMobile,
        "opacity-100 translate-y-0": e.showScrollTop,
        "opacity-0 translate-y-4 pointer-events-none": !e.showScrollTop
      };
      return h.e = Z(o, b, h.e), h.t = Z(d, C, h.t), h.a = Z(f, L, h.a), E !== h.o && $.classList.toggle("text-xs", h.o = E), h.i = Z(v, I, h.i), h.n = Z(w, R, h.n), h.s = Z(_, A, h.s), h.h = Z(O, T, h.h), h;
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
ge(["click"]);
var wf = /* @__PURE__ */ y('<button type=button class="button-switch relative inline-flex flex-shrink-0 bg-gray-200 dark:bg-gray-700 h-6 w-11 border-2 border-transparent rounded-full cusrsor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"><span class="outer-span relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 pointer-events-none"><span class="light-switch absolute inset-0 h-full w-full flex items-center justify-center transition-opacity opacity-100 dark:opacity-0 ease-out duration-100"></span><span class="dark-switch absolute inset-0 h-full w-full flex items-center justify-center transition-opacity opacity-0 dark:opacity-100 ease-in duration-200">');
const xf = (e) => (() => {
  var t = wf(), n = t.firstChild, i = n.firstChild, r = i.nextSibling;
  return Re(t, "click", e.onToggle, !0), k(i, g(Jh, {})), k(r, g(Wh, {})), t;
})();
ge(["click"]);
var yf = /* @__PURE__ */ y('<div class="text-xs font-light text-gray-600"> ± <!> ms'), pf = /* @__PURE__ */ y('<div class="flex relative flex-none min-w-full px-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-50 dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-500 scrollbar-thumb-rounded-full scrollbar-track-rounded-full"><ul class="flex text-sm leading-6 text-slate-400 pt-4">'), kf = /* @__PURE__ */ y('<div class="sm:px-7 sm:pt-7 px-4 pt-4 flex flex-col w-full border-b border-gray-200 bg-white dark:bg-gray-900 dark:text-white dark:border-gray-800 z-10 sticky"><div class="flex w-full items-center"><div class="ml-3 w-4/6 md:w-auto md:text-2xl md:text-left font-medium text-left text-base text-gray-900 dark:text-white mt-1"><div></div><div class="text-sm font-light md:text-lg text-gray-600 dark:text-gray-400"></div></div><div class="ml-auto w-1/6 md:w-auto sm:flex items-center p-2"></div><div class="ml-auto w-1/6 md:w-auto sm:flex md:hidden items-center"><button type=button class="p-4 mobile-menu-button focus:outline-none focus:bg-gray-200 dark:focus:bg-gray-800"></button></div></div><div class="flex items-center space-x-3 sm:mt-7 mt-4">'), $f = /* @__PURE__ */ y('<li class=flex-none><a class="block py-2 mb-1.5 px-4 rounded font-medium space-x-2 hover:bg-blue-700 hover:text-white"href=javascript:void(0);>');
const _f = (e) => (() => {
  var t = kf(), n = t.firstChild, i = n.firstChild, r = i.firstChild, a = r.nextSibling, l = i.nextSibling, s = l.nextSibling, c = s.firstChild;
  return n.nextSibling, k(i, g(P, {
    get when() {
      return e.config.clientMode === 2;
    },
    get children() {
      var o = yf(), d = o.firstChild, f = d.nextSibling;
      return f.nextSibling, k(o, () => e.renderGear, d), k(o, () => e.timeDiff, f), o;
    }
  }), null), k(l, g(xf, {
    get onToggle() {
      return e.onToggleTheme;
    }
  })), Re(c, "click", e.onSidebarCollapse, !0), k(c, g(Uh, {})), k(t, g(P, {
    get when() {
      return e.config.clientMode === dt.PAPI;
    },
    get children() {
      var o = pf(), d = o.firstChild;
      return k(d, g(ce, {
        get each() {
          return e.sidebar.details;
        },
        children: (f, x) => (() => {
          var $ = $f(), M = $.firstChild;
          return M.$$click = () => e.onSelectTab(f.dataKey, f.label, f.index, x()), k(M, () => f.label), V((v) => {
            var u = {
              "border-b-4 border-blue-800": f.dataKey === e.form.activeComponent.dataKey
            }, w = {
              "bg-blue-800 text-white": f.dataKey === e.form.activeComponent.dataKey
            };
            return v.e = Z($, u, v.e), v.t = Z(M, w, v.t), v;
          }, {
            e: void 0,
            t: void 0
          }), $;
        })()
      })), o;
    }
  }), null), V((o) => {
    var d = e.config.clientMode !== dt.PAPI, f = e.config.clientMode === dt.PAPI, x = e.template.details.title, $ = e.template.details.description, M = !e.onMobile, v = !!e.onMobile;
    return d !== o.e && t.classList.toggle("top-0", o.e = d), f !== o.t && t.classList.toggle("-top-[121px]", o.t = f), x !== o.a && (r.innerHTML = o.a = x), $ !== o.o && (a.innerHTML = o.o = $), M !== o.i && a.classList.toggle("flex", o.i = M), v !== o.n && a.classList.toggle("hidden", o.n = v), o;
  }, {
    e: void 0,
    t: void 0,
    a: void 0,
    o: void 0,
    i: void 0,
    n: void 0
  }), t;
})();
ge(["click"]);
var Sf = /* @__PURE__ */ y('<div class="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900"><div class="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md"><svg class="mx-auto h-16 w-16 text-red-500 mb-4"fill=none viewBox="0 0 24 24"stroke=currentColor><path stroke-linecap=round stroke-linejoin=round stroke-width=2 d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg><h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">Form Configuration Error</h2><p class="text-gray-600 dark:text-gray-300 mb-4">No sections found in the template. Please ensure your template JSON has at least one section with type 1.</p><p class="text-sm text-gray-500 dark:text-gray-400">Check the browser console for more details.');
const Cf = () => Sf(), Mf = 3;
function Xt(e = Mf) {
  const [t, n] = j([]), [i, r] = j([]), [a, l] = j(1), [s, c] = j(1), o = ($, M) => {
    const v = $.length, u = Math.max(1, Math.ceil(v / e)), w = Math.min(Math.max(1, M), u), p = (w - 1) * e, _ = p + e;
    return {
      pageItems: $.slice(p, _),
      currentPage: w,
      maxPage: u
    };
  };
  return {
    items: t,
    pageItems: i,
    totalItems: () => t().length,
    currentPage: a,
    maxPage: s,
    setItems: ($) => {
      n($);
      const M = o($, 1);
      r(M.pageItems), l(M.currentPage), c(M.maxPage);
    },
    setPage: ($) => {
      const M = t(), v = o(M, $);
      r(v.pageItems), l(v.currentPage);
    }
  };
}
function If(e, t, n, i) {
  const { getValue: r, getProp: a } = i, { sidebar: l, reference: s, setReference: c } = t;
  e.tmpVarComp.forEach((o) => {
    let d = l.details.findIndex((M) => M.components[0].findIndex((u) => {
      u.dataKey, o.dataKey;
    }) == -1 ? 0 : d);
    const f = Bi(o.dataKey), x = {
      getValue: r,
      getRowIndex: f,
      getProp: a,
      dataKey: o.dataKey
    };
    let $ = vh(o.expression, x);
    $ !== void 0 && n.answer.saveAnswer(o.dataKey, $, { isInitial: !0, activePosition: d });
  }), e.preset.details.predata.forEach((o, d) => {
    let f = n.reference.getIndex(o.dataKey);
    if (f !== -1 && (e.config.initialMode == 1 && s.details[f].presetMaster !== void 0 && s.details[f].presetMaster || e.config.initialMode == 2)) {
      let x = l.details.findIndex((M) => M.components[0].findIndex((u) => u.dataKey === o.dataKey) == -1 ? 0 : d), $ = typeof o.answer == "object" ? JSON.parse(JSON.stringify(o.answer)) : o.answer;
      n.answer.saveAnswer(o.dataKey, $, { isInitial: !0, activePosition: x });
    }
  }), e.response.details.answers.forEach((o, d) => {
    if (!o.dataKey.includes("#") && n.reference.getIndex(o.dataKey) !== -1) {
      let x = l.details.findIndex((M) => M.components[0].findIndex((u) => u.dataKey === o.dataKey) == -1 ? 0 : d), $ = typeof o.answer == "object" ? JSON.parse(JSON.stringify(o.answer)) : o.answer;
      $ !== void 0 && n.answer.saveAnswer(o.dataKey, $, { isInitial: !0, activePosition: x });
    }
  }), e.tmpEnableComp.forEach((o) => {
    const d = Bi(o.dataKey), f = {
      getValue: r,
      getRowIndex: d,
      getProp: a,
      dataKey: o.dataKey
    };
    let $ = mh(o.enableCondition, f, !0), M = $ === void 0 ? !1 : $;
    n.answer.saveEnable(o.dataKey, M);
  });
  for (let o = 0; o < s.details.length; o++) {
    let d = s.details[o];
    if (!(d.index[d.index.length - 2] === 0 && d.level > 1) && (d.enable && d.componentValidation !== void 0 && n.validation.validateComponent(d.dataKey), d.enable && d.sourceOption !== void 0)) {
      let f = d.sourceOption.split("@"), x = n.reference.getIndex(f[0]), $ = x !== -1 ? s.details[x] : null;
      if (d.answer && $ && $.answer) {
        let M = [];
        d.answer.forEach((v) => {
          $.answer.forEach((u) => {
            v.value == u.value && M.push(u);
          });
        }), c("details", o, "answer", M);
      }
    }
  }
}
function Ef(e, t) {
  const { reference: n, note: i, setNote: r } = e;
  n.details.forEach((a) => {
    let l = t.details.notes.findIndex((s) => s.dataKey === a.dataKey);
    if (l !== -1) {
      let s = t.details.notes[l], c = JSON.parse(JSON.stringify(i.details.notes));
      c.push(s), r("details", "notes", c);
    }
  });
}
var Lf = /* @__PURE__ */ y('<div class="bg-gray-200 dark:bg-[#181f30] h-screen"><div class=overflow-hidden><div class="bg-gray-50 dark:bg-gray-900 dark:text-white h-screen shadow-xl text-gray-600 flex overflow-hidden text-sm font-sans xl:rounded-xl dark:shadow-gray-800"><div class="flex-grow overflow-hidden h-full flex flex-col bg-white dark:bg-gray-900 z-0"><div class="mobile-component-div relative h-screen md:flex md:overflow-hidden scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-50 dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-500 overflow-y-scroll scrollbar-thumb-rounded-full scrollbar-track-rounded-full"><div class="component-div min-h-screen flex-grow bg-white dark:bg-gray-900 z-10 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-50 dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-500 overflow-y-visible md:overflow-y-scroll scrollbar-thumb-rounded-full scrollbar-track-rounded-full">');
const Of = (e) => {
  const t = ut(), [n, i] = nt(), [r, a] = $r(), [l, s] = _r(), [c, o] = tt(), [d, f] = yr(), [x, $] = br(), [M] = Jn(), [v, u] = pr(), [w] = wr(), [p] = kr(), [_, S] = xr(), [O] = Sr(), [, N] = nl(), m = (ne) => {
    const oe = c.details.findIndex((ue) => ue.dataKey === ne);
    let X = "";
    return oe !== -1 && c.details[oe].answer && c.details[oe].enable && (X = c.details[oe].answer), X;
  }, h = () => e.config, b = (ne) => {
    switch (ne) {
      case "clientMode":
        return e.config.clientMode;
      case "baseUrl":
        return e.config.baseUrl;
    }
  }, [C, L] = j("FormGear-" + ot + " 🚀:"), {
    setLoader: E,
    removeLoader: I
  } = Gn(), [R, A] = j(h()), [T, {
    setActiveComponent: K
  }] = mr(), [F, D] = j(!1), [z, B] = j(!1), [J, H] = j(!1), [ee, G] = j(!1), [le, re] = j(""), [te, Y] = j(""), [q, W] = j("E"), ie = Xt(), ae = Xt(), fe = Xt(), xe = Xt(), [ye, Me] = j(!1), [he, _e] = j(!1), [Ve, Je] = j(Dt()), [ze, xt] = j([]);
  if (e.template.details.language !== void 0 && e.template.details.language.length > 0) {
    const ne = Object.keys(n.details.language[0]), oe = JSON.parse(JSON.stringify(n.details.language[0]));
    ne.forEach((X) => {
      e.template.details.language[0].hasOwnProperty(X) && (oe[X] = e.template.details.language[0][X]);
    }), i("details", "language", [oe]);
  }
  const De = (ne) => {
    var X, ue;
    const oe = M.details.findIndex((pe) => pe.dataKey === ne);
    return (ue = (X = M.details[oe]) == null ? void 0 : X.components[0]) != null ? ue : [];
  };
  if (!M.details || M.details.length === 0)
    return ve("Form configuration error: No sections found in template", 5e3), g(Cf, {});
  const Ge = {
    dataKey: M.details[0].dataKey,
    label: M.details[0].label,
    index: JSON.parse(JSON.stringify(M.details[0].index)),
    position: 0
  };
  K(Ge), history.replaceState(Ge, ""), xt(De(M.details[0].dataKey)), e.runAll == 0 ? If({
    config: e.config,
    tmpVarComp: e.tmpVarComp,
    tmpEnableComp: e.tmpEnableComp,
    preset: e.preset,
    response: e.response,
    remark: e.remark
  }, {
    sidebar: M,
    reference: c,
    setReference: o
  }, {
    answer: t.answer,
    reference: t.reference,
    validation: t.validation
  }, {
    getValue: m,
    getProp: b
  }) : (Ef({
    reference: c,
    note: r,
    setNote: a
  }, e.remark), L("FormGear-" + ot + " ♻️:")), N(!0);
  const Ne = () => {
    window.innerWidth < 768 ? Je(!0) : Je(!1);
  };
  $e(() => {
    var pe;
    xt(De(T.activeComponent.dataKey));
    let ne = 0, oe = 0, X = 0, ue = 0;
    c.details.forEach((we) => {
      if (O().findIndex((Le) => Le.parentIndex.toString() === we.index.slice(0, -2).toString()) == -1 && we.type > be.VARIABLE && we.enable) {
        we.answer !== void 0 && we.answer !== "" && we.answer !== null && (ne += 1, we.validationState != 1 && we.validationState != 2 && (ue += 1));
        const Le = we.answer === void 0 || we.answer === "" || we.type === be.LIST_TEXT_REPEAT && Array.isArray(we.answer) && we.answer.length === 1 || we.type === be.LIST_SELECT_REPEAT && Array.isArray(we.answer) && we.answer.length === 1, qt = JSON.parse(JSON.stringify(we.index[we.index.length - 2])) === 0 && we.level > 1;
        Le && !qt && (X += 1), we.validationState == 2 && (oe += 1);
      }
    }), u({
      answer: ne,
      blank: X,
      error: oe,
      remark: r.details.notes.length,
      clean: ue
    }), h().clientMode != 2 && window.addEventListener("resize", Ne), (pe = document.getElementById("FormGear-loader")) == null || pe.classList.add("hidden");
  });
  const Fe = () => {
    var ne, oe, X, ue;
    document.documentElement.classList.toggle("dark"), (ne = document.querySelector(".outer-span")) == null || ne.classList.toggle("translate-x-5"), (oe = document.querySelector(".button-switch")) == null || oe.classList.toggle("bg-gray-800"), (X = document.querySelector(".light-switch")) == null || X.classList.toggle("opacity-100"), (ue = document.querySelector(".dark-switch")) == null || ue.classList.toggle("opacity-100");
  }, Ye = (ne) => {
    const oe = document.querySelector(".sidebar-span"), X = document.querySelector(".sidebar-overlay");
    oe == null || oe.classList.toggle("-translate-x-full"), oe == null || oe.classList.toggle("translate-x-0"), X == null || X.classList.toggle("opacity-0"), X == null || X.classList.toggle("opacity-100"), X == null || X.classList.toggle("pointer-events-none"), X == null || X.classList.toggle("pointer-events-auto");
  }, Nt = () => {
    const ne = document.querySelector(".component-div");
    Me(ne ? ne.scrollTop > 100 : !1);
  }, Wt = () => {
    if (Dt()) {
      const ne = document.querySelector(".mobile-component-div");
      _e(ne ? ne.scrollTop > 100 : !1);
    }
  }, gt = () => {
    const ne = Dt() ? document.querySelector(".mobile-component-div") : document.querySelector(".component-div");
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    }), ne == null || ne.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, Qe = () => {
    const ne = [], oe = [], X = [];
    E({}), setTimeout(() => t.enable.updateDisabledSectionsCache(), 50), c.details.forEach((Le) => {
      Le.type > 3 && Le.enable && Le.answer !== void 0 && Le.answer !== "" && Le.answer !== null && O().findIndex((Ln) => Ln.parentIndex.toString() === Le.index.slice(0, -2).toString()) == -1 && ((Le.type === be.PHOTO || Le.type === be.SIGNATURE) && oe.push({
        dataKey: Le.dataKey,
        name: Le.name,
        answer: Le.answer
      }), ne.push({
        dataKey: Le.dataKey,
        name: Le.name,
        answer: Le.answer
      }), Le.principal !== void 0 && X.push({
        dataKey: Le.dataKey,
        name: Le.name,
        answer: Le.answer,
        principal: Le.principal,
        columnName: Le.columnName
      }));
    }), $("details", "answers", ne), $("details", "templateDataKey", w.details.dataKey), $("details", "gearVersion", ot), $("details", "templateVersion", e.template.details.version || "0.0.0"), $("details", "validationVersion", e.validation.details.version || "0.0.0"), $("details", "docState", q()), $("details", "summary", JSON.parse(JSON.stringify(v))), $("details", "counter", [JSON.parse(JSON.stringify(p))]);
    const ue = We().format("YYYY-MM-DD HH:mm:ss"), we = Number((/* @__PURE__ */ new Date()).getTimezoneOffset() / 60 * -1);
    We.extend(dh), We.extend(hh);
    const Ke = We.tz.guess();
    st($, x, Ke, we, ue), st(S, l, Ke, we, ue), st(s, l, Ke, we, ue), st(f, d, Ke, we, ue), S("details", "media", oe), S("details", "templateDataKey", w.details.dataKey), S("details", "gearVersion", ot), S("details", "templateVersion", e.template.details.version || "0.0.0"), S("details", "validationVersion", e.validation.details.version || "0.0.0"), s("details", "principals", X), s("details", "templateDataKey", w.details.dataKey), s("details", "gearVersion", ot), s("details", "templateVersion", e.template.details.version || "0.0.0"), s("details", "validationVersion", e.validation.details.version || "0.0.0"), f("details", "notes", JSON.parse(JSON.stringify(r.details.notes))), f("details", "templateDataKey", w.details.dataKey), f("details", "gearVersion", ot), f("details", "templateVersion", e.template.details.version || "0.0.0"), f("details", "validationVersion", e.validation.details.version || "0.0.0"), o("sidebar", M.details);
  };
  function st(ne, oe, X, ue, pe) {
    oe.details.createdBy === void 0 || oe.details.createdBy === "" ? (ne("details", "createdBy", h().username), ne("details", "createdAt", pe), ne("details", "createdAtTimezone", X.toString()), ne("details", "createdAtGMT", ue)) : (ne("details", "updatedBy", h().username), ne("details", "updatedAt", pe), ne("details", "updatedAtTimezone", X.toString()), ne("details", "updatedAtGMT", ue), oe.details.createdAtTimezone || (ne("details", "createdAtTimezone", X.toString()), ne("details", "createdAtGMT", ue)));
  }
  const rt = () => {
    Qe(), e.setResponseMobile(x.details, _.details, d.details, l.details, c);
  }, ta = () => {
    Qe(), e.setSubmitMobile(x.details, _.details, d.details, l.details, c);
  };
  e.mobileExit(rt);
  const na = (ne) => typeof ne == "object" && ne !== null && typeof ne.dataKey == "string" && typeof ne.label == "string" && Array.isArray(ne.index) && typeof ne.position == "number", Tt = (ne) => {
    K(ne), history.pushState(
      ne,
      ""
      /* title param: deprecated, ignored by browsers */
    );
  }, Zn = (ne) => {
    na(ne.state) && (rt(), E({}), setTimeout(() => {
      K(ne.state), jt();
    }, 50));
  };
  zn(() => {
    window.mobileBack = () => M.details.filter((oe, X) => oe.enable && X < T.activeComponent.position).length > 0 ? (history.back(), !0) : !1, window.addEventListener("popstate", Zn), pn(() => {
      delete window.mobileBack, window.removeEventListener("popstate", Zn);
    });
  });
  const Xn = () => M.details.filter((ne, oe) => ne.enable && oe < T.activeComponent.position).length > 0, ei = () => M.details.filter((ne, oe) => ne.enable && oe > T.activeComponent.position).length > 0, ti = (ne) => {
    rt();
    const oe = M.details.filter((pe, we) => pe.enable && we < T.activeComponent.position);
    if (oe.length === 0) return;
    const X = oe[oe.length - 1], ue = M.details.findIndex((pe) => pe.dataKey === X.dataKey);
    E({}), setTimeout(() => {
      Tt({
        dataKey: X.dataKey,
        label: X.label,
        index: JSON.parse(JSON.stringify(X.index)),
        position: ue
      });
    }, 50), jt();
  }, ni = (ne) => {
    rt();
    const oe = M.details.filter((pe, we) => pe.enable && we > T.activeComponent.position);
    if (oe.length === 0) return;
    const X = oe[0], ue = M.details.findIndex((pe) => pe.dataKey === X.dataKey);
    E({}), setTimeout(() => {
      Tt({
        dataKey: X.dataKey,
        label: X.label,
        index: JSON.parse(JSON.stringify(X.index)),
        position: ue
      });
    }, 50), jt();
  }, ia = (ne, oe, X, ue) => {
    const pe = document.querySelector(".component-div");
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    }), pe == null || pe.scrollTo({
      top: 0,
      behavior: "smooth"
    }), rt(), E({}), setTimeout(() => Tt({
      dataKey: ne,
      label: oe,
      index: JSON.parse(JSON.stringify(X)),
      position: ue
    }), 50);
  }, Mn = (ne, oe, X) => {
    const ue = kh(M.details, oe), pe = M.details[ue];
    $h([{
      className: Kt.ERROR,
      setShowFn: B
    }, {
      className: Kt.REMARK,
      setShowFn: H
    }, {
      className: Kt.BLANK,
      setShowFn: G
    }]);
    const we = document.querySelector(".sidebar-span"), Ke = we == null ? void 0 : we.classList.contains("translate-x-0");
    Dt() && Ke && Ye(), E({}), setTimeout(() => {
      Tt({
        dataKey: pe.dataKey,
        label: pe.label,
        index: JSON.parse(JSON.stringify(pe.index)),
        position: ue
      }), ph(X);
    }, 250);
  }, In = (ne) => {
    const oe = [], X = [];
    c.details.forEach((ue) => {
      if (O().findIndex((we) => we.parentIndex.toString() === ue.index.slice(0, -2).toString()) == -1) {
        const we = ue.level > 1 ? ue.index.slice(0, -1) : ue.index.slice(0, -2);
        ue.type > 4 && ue.enable && ue.validationState == 2 && oe.push({
          label: ue.label,
          message: ue.validationMessage,
          sideIndex: we,
          dataKey: ue.dataKey
        }), ue.type > 4 && ue.enable && ue.validationState == 1 && X.push({
          label: ue.label,
          message: ue.validationMessage,
          sideIndex: we,
          dataKey: ue.dataKey
        });
      }
    }), ie.setItems(oe), ae.setItems(X), B(!0);
  }, ra = (ne) => {
    const oe = [];
    r.details.notes.forEach((X) => {
      const ue = c.details.find((pe) => pe.dataKey == X.dataKey);
      if (ue) {
        const pe = ue.level > 1 ? ue.index.slice(0, -1) : ue.index.slice(0, -2);
        oe.push({
          label: ue.label,
          sideIndex: pe,
          dataKey: ue.dataKey
        });
      }
    }), xe.setItems(oe), H(!0);
  }, aa = (ne) => {
    const oe = [];
    c.details.forEach((X) => {
      if (O().findIndex((pe) => pe.parentIndex.toString() === X.index.slice(0, -2).toString()) == -1 && X.type > be.VARIABLE && X.enable && (X.answer === void 0 || X.answer === "" || X.type === be.LIST_TEXT_REPEAT && Array.isArray(X.answer) && X.answer.length === 1 || X.type === be.LIST_SELECT_REPEAT && Array.isArray(X.answer) && X.answer.length === 1) && !(JSON.parse(JSON.stringify(X.index[X.index.length - 2])) === 0 && X.level > 1)) {
        const pe = X.level > 1 ? X.index.slice(0, -1) : X.index.slice(0, -2);
        oe.push({
          label: X.label,
          sideIndex: pe,
          dataKey: X.dataKey
        });
      }
    }), fe.setItems(oe), G(!0);
  }, la = () => {
    c.details.forEach((ne, oe) => {
      const X = JSON.parse(JSON.stringify(ne));
      if (O().findIndex((pe) => pe.parentIndex.toString() === X.index.slice(0, -2).toString()) == -1 && X.enable && X.required) {
        const we = X.dataKey.split("@")[0].split("#");
        if (X.level < 2 || X.level > 1 && we[1] !== void 0) {
          const Ke = typeof X.answer;
          (X.answer === void 0 || Ke === "string" && X.answer === "" || Ke === "number" && X.answer == 0 || Ke === "object" && Number(X.type) == 21 && X.answer.length < 2 || Ke === "object" && Number(X.type) == 22 && X.answer.length < 2 || Ke === "object" && X.type > 22 && X.answer.length == 0 || Ke === "object" && !isNaN(X.answer) || Ke === "number" && isNaN(X.answer) || JSON.stringify(X.answer) === "[]") && (X.validationMessage.push(n.details.language[0].validationRequired), X.validationState = 2), o("details", oe, X);
        }
      }
    });
  }, sa = (ne) => {
    E({}), setTimeout(() => t.enable.updateDisabledSectionsCache(), 50), v.error > 0 && In();
  }, oa = () => {
    v.error > 0 ? W("E") : c.details.filter((ne) => Number(ne.validationState) === 1).length > 0 ? W("W") : W("C");
  }, ii = () => {
    const ne = [];
    for (let oe = 0; oe < 6; oe++)
      ne[oe] = Math.floor(Math.random() * 10);
    re(ne.join(""));
  }, da = (ne) => {
    E({}), setTimeout(() => t.enable.updateDisabledSectionsCache(), 50), rt(), Ue("Data saved", 1500);
  }, En = (ne) => {
    ii(), oa(), q() === "E" ? ve(n.details.language[0].submitInvalid, 3e3) : (E({}), setTimeout(() => t.enable.updateDisabledSectionsCache(), 50), la(), v.error === 0 ? (q() === "W" && ns(n.details.language[0].submitWarning, 3e3), D(!0)) : ve(n.details.language[0].submitEmpty, 3e3));
  }, ca = (ne) => {
    te().length !== 0 && te() === le() ? (ta(), Cn(Kt.CONFIRMATION, D), Ue(n.details.language[0].verificationSubmitted, 3e3)) : ve(n.details.language[0].verificationInvalid, 3e3);
  }, ua = (/* @__PURE__ */ new Date()).getTime() - e.timeStart.getTime();
  return (() => {
    var ne = Lf(), oe = ne.firstChild, X = oe.firstChild, ue = X.firstChild, pe = ue.firstChild, we = pe.firstChild;
    return k(ne, g(Ah, {
      get show() {
        return F();
      },
      setShow: D,
      get captcha() {
        return le();
      },
      onRefreshCaptcha: ii,
      onCaptchaChange: Y,
      onSubmit: ca
    }), oe), k(ne, g(Hi, {
      get show() {
        return J();
      },
      setShow: H,
      modalClass: "modal-remark",
      title: "List Remark",
      get icon() {
        return g(Bh, {});
      },
      iconBgClass: "text-yellow-400 bg-yellow-100",
      get items() {
        return xe.pageItems();
      },
      get totalItems() {
        return xe.totalItems();
      },
      get currentPage() {
        return xe.currentPage();
      },
      get maxPage() {
        return xe.maxPage();
      },
      get onPageChange() {
        return xe.setPage;
      },
      onItemClick: Mn
    }), oe), k(ne, g(Hi, {
      get show() {
        return ee();
      },
      setShow: G,
      modalClass: "modal-confirmation modal-blank",
      title: "List Blank",
      get icon() {
        return g(Hh, {});
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
    }), oe), k(ne, g(ef, {
      get show() {
        return z();
      },
      setShow: B,
      get errorItems() {
        return ie.pageItems();
      },
      get errorTotalItems() {
        return ie.totalItems();
      },
      get errorCurrentPage() {
        return ie.currentPage();
      },
      get errorMaxPage() {
        return ie.maxPage();
      },
      get onErrorPageChange() {
        return ie.setPage;
      },
      get warningItems() {
        return ae.pageItems();
      },
      get warningTotalItems() {
        return ae.totalItems();
      },
      get warningCurrentPage() {
        return ae.currentPage();
      },
      get warningMaxPage() {
        return ae.maxPage();
      },
      get onWarningPageChange() {
        return ae.setPage;
      },
      onItemClick: Mn
    }), oe), pe.addEventListener("scroll", Wt), k(pe, g(hf, {
      get sidebarDetails() {
        return M.details;
      },
      get activeDataKey() {
        return T.activeComponent.dataKey;
      },
      get activeIndex() {
        return T.activeComponent.index;
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
      summary: v,
      get locale() {
        return n.details.language[0];
      },
      get formMode() {
        return R().formMode;
      },
      onSelect: ia,
      onSidebarCollapse: Ye,
      onWriteResponse: rt,
      onShowBlank: aa,
      onShowError: sa,
      onShowRemark: ra,
      onSubmit: En
    }), we), we.addEventListener("scroll", Nt), k(we, g(_f, {
      get template() {
        return e.template;
      },
      get config() {
        return h();
      },
      get onMobile() {
        return Ve();
      },
      get renderGear() {
        return C();
      },
      timeDiff: ua,
      onToggleTheme: Fe,
      onSidebarCollapse: Ye,
      sidebar: M,
      form: T,
      onSelectTab: (Ke, Le, qt, Ln) => {
        jt(), h().clientMode === dt.CAPI && rt(), E({}), setTimeout(() => Tt({
          dataKey: Ke,
          label: Le,
          index: JSON.parse(JSON.stringify(qt)),
          position: Ln
        }), 50);
      }
    }), null), k(we, g(ah, {
      get onMobile() {
        return Ve();
      },
      get components() {
        return ze();
      },
      get dataKey() {
        return T.activeComponent.dataKey;
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
    }), null), k(we, g(P, {
      get when() {
        return !Ve();
      },
      get children() {
        return g(Wi, {
          get activeLabel() {
            return T.activeComponent.label;
          },
          get hasPrevious() {
            return Xn();
          },
          get hasNext() {
            return ei();
          },
          get hasErrors() {
            return v.error > 0;
          },
          get canSubmit() {
            return v.error === 0;
          },
          isMobile: !1,
          get showScrollTop() {
            return ye();
          },
          get formMode() {
            return R().formMode;
          },
          onPrevious: ti,
          onNext: ni,
          onShowError: In,
          onSubmit: En,
          onScrollTop: gt
        });
      }
    }), null), k(pe, g(P, {
      get when() {
        return Ve();
      },
      get children() {
        return g(Wi, {
          get activeLabel() {
            return T.activeComponent.label;
          },
          get hasPrevious() {
            return Xn();
          },
          get hasNext() {
            return ei();
          },
          get hasErrors() {
            return v.error > 0;
          },
          get canSubmit() {
            return v.error === 0;
          },
          isMobile: !0,
          get showScrollTop() {
            return he();
          },
          get formMode() {
            return R().formMode;
          },
          onPrevious: ti,
          onNext: ni,
          onShowError: In,
          onSubmit: En,
          onScrollTop: gt,
          onSave: da
        });
      }
    }), null), ne;
  })();
};
var Af = /* @__PURE__ */ y('<div class="backdrop-blur-sm overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex"><svg class="w-20 h-20 animate-spin"xmlns=http://www.w3.org/2000/svg viewBox="0 0 94.53 98.372"><circle cx=47.361 cy=8.646 r=8.646 style=fill:#1d4970></circle><circle cx=23.536 cy=16.331 r=8.646 style=fill:#0a77e8></circle><circle cx=8.646 cy=36.698 r=8.646 style=fill:#0f9af0></circle><circle cx=8.646 cy=61.867 r=8.646 style=fill:#0f9af0></circle><circle cx=23.536 cy=82.233 r=8.646 style=fill:#13bdf7></circle><circle cx=47.361 cy=89.726 r=8.646 style=fill:#13bdf7></circle><circle cx=71.282 cy=82.233 r=8.646 style=fill:#18e0ff></circle><circle cx=85.884 cy=61.867 r=8.646 style=fill:#65eaff></circle><circle cx=85.884 cy=36.698 r=8.646 style=fill:#b2f5ff>');
function Rf(e) {
  let t = et({
    type: "success",
    autoHideDuration: 70
  }, e), n;
  return zn(() => {
    n = setTimeout(() => t.remove(), t.autoHideDuration);
  }), pn(() => {
    n && clearTimeout(n);
  }), Af();
}
var Vf = /* @__PURE__ */ y("<div>");
function Nf() {
  const {
    loader: e
  } = Gg(), {
    removeLoader: t
  } = Gn();
  return (() => {
    var n = Vf();
    return k(n, () => e.map((i) => g(Rf, {
      get remove() {
        return t(i.id);
      }
    }))), n;
  })();
}
const Tf = {
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
function Pf(e) {
  const t = [];
  function n(A) {
    const [T, K] = Un(A);
    return [T, K];
  }
  function i(A) {
    const [T, K] = j(A);
    return [T, K];
  }
  const r = n({
    details: [],
    sidebar: []
  }), a = n({
    status: 1,
    details: Se({
      dataKey: "",
      answers: [],
      summary: [],
      counter: []
    }, e == null ? void 0 : e.response)
  }), l = n({
    status: 1,
    details: Se({
      description: "",
      dataKey: "",
      acronym: "",
      title: "",
      version: "",
      components: []
    }, e == null ? void 0 : e.template)
  }), s = n({
    status: 1,
    details: Se({
      description: "",
      dataKey: "",
      version: "",
      testFunctions: []
    }, e == null ? void 0 : e.validation)
  }), c = n({
    status: 1,
    details: Se({
      description: "",
      dataKey: "",
      predata: []
    }, e == null ? void 0 : e.preset)
  }), o = n({
    status: 1,
    details: Se({
      dataKey: "",
      media: []
    }, e == null ? void 0 : e.media)
  }), d = n({
    status: 1,
    details: Se({
      dataKey: "",
      notes: []
    }, e == null ? void 0 : e.remark)
  }), f = n({
    details: []
  }), x = n(
    (e == null ? void 0 : e.locale) || Tf
  ), $ = n({
    answer: 0,
    blank: 0,
    error: 0,
    remark: 0,
    clean: 0
  }), M = n({
    render: 0,
    validate: 0
  }), v = n({
    currentDataKey: ""
  }), u = n({
    details: []
  }), w = n({
    status: 1,
    details: {
      dataKey: "",
      notes: []
    }
  }), p = n({
    status: 1,
    details: {
      principals: []
    }
  }), _ = i({}), S = i({}), O = i({}), N = i({}), m = i({}), h = i({}), b = i(
    {}
  ), C = i(!1), L = i([]), E = i([]), I = i([]);
  return {
    // Main stores
    reference: r,
    response: a,
    template: l,
    validation: s,
    preset: c,
    media: o,
    remark: d,
    sidebar: f,
    locale: x,
    // Helper stores
    summary: $,
    counter: M,
    input: v,
    nested: u,
    note: w,
    principal: p,
    // Signals
    referenceMap: _,
    sidebarIndexMap: S,
    compEnableMap: O,
    compValidMap: N,
    compSourceOptionMap: m,
    compVarMap: h,
    compSourceQuestionMap: b,
    referenceHistoryEnable: C,
    referenceHistory: L,
    sidebarHistory: E,
    referenceEnableFalse: I,
    // Cleanup
    dispose: () => {
      t.forEach((A) => A()), t.length = 0, r[1]({ details: [], sidebar: [] }), a[1]({ status: 1, details: { dataKey: "", answers: [], summary: [], counter: [] } }), l[1]({ status: 1, details: { description: "", dataKey: "", acronym: "", title: "", version: "", components: [] } }), s[1]({ status: 1, details: { description: "", dataKey: "", version: "", testFunctions: [] } }), c[1]({ status: 1, details: { description: "", dataKey: "", predata: [] } }), o[1]({ status: 1, details: { dataKey: "", media: [] } }), d[1]({ status: 1, details: { dataKey: "", notes: [] } }), f[1]({ details: [] }), $[1]({ answer: 0, blank: 0, error: 0, remark: 0, clean: 0 }), M[1]({ render: 0, validate: 0 }), v[1]({ currentDataKey: "" }), u[1]({ details: [] }), w[1]({ status: 1, details: { dataKey: "", notes: [] } }), p[1]({ status: 1, details: { principals: [] } }), _[1]({}), S[1]({}), O[1]({}), N[1]({}), m[1]({}), h[1]({}), b[1]({}), C[1](!1), L[1]([]), E[1]([]), I[1]([]);
    }
  };
}
const Df = "", jf = [], Kf = {
  dataKey: Df,
  media: jf
}, zf = "", Ff = "", Bf = [], Hf = {
  description: zf,
  dataKey: Ff,
  predata: Bf
}, Uf = "", Jf = [], Wf = {
  dataKey: Uf,
  notes: Jf
}, qf = "", Gf = "", Yf = [], Qf = {
  description: qf,
  dataKey: Gf,
  answers: Yf
}, ot = "2.0.0";
let dn = "0.0.0", cn = "0.0.0";
function Zf(e, t, n, i, r) {
  const a = [], l = [], s = [], c = [], o = [], d = [], [f, x] = e.note, $ = t.components;
  if (!$ || !Array.isArray($) || $.length === 0)
    return {
      referenceList: a,
      sidebarList: l,
      nestedList: s,
      tmpVarComp: c,
      tmpEnableComp: o
    };
  const M = $[0];
  if (!Array.isArray(M) || M.length === 0)
    return {
      referenceList: a,
      sidebarList: l,
      nestedList: s,
      tmpVarComp: c,
      tmpEnableComp: o
    };
  const v = (p) => {
    if (!(n != null && n.testFunctions)) return {
      vals: void 0,
      compVal: void 0
    };
    const _ = n.testFunctions.findIndex((S) => S.dataKey === p);
    return _ !== -1 ? {
      vals: n.testFunctions[_].validations,
      compVal: n.testFunctions[_].componentValidation
    } : {
      vals: void 0,
      compVal: void 0
    };
  }, u = (p) => {
    if ((p.enableRemark === void 0 || p.enableRemark) && i != null && i.notes) {
      const _ = i.notes.findIndex((S) => S.dataKey === p.dataKey);
      if (_ !== -1) {
        const S = i.notes[_], O = [...f.details.notes, S];
        return x("details", "notes", O), !0;
      }
    }
    return !1;
  }, w = (p, _, S, O) => {
    for (let N = 0; N < p.length; N++) {
      const m = p[N], h = m.type;
      if (h !== 1 && h !== 3) {
        if (d.includes(m.dataKey))
          throw new Error(`Duplicate dataKey on ${m.dataKey}`);
        d.push(m.dataKey);
      }
      let b = m.answer;
      h === 21 || h === 22 ? b = JSON.parse(JSON.stringify(b)) : h === 4 && S < 2 && b === void 0 && !O && c.push(JSON.parse(JSON.stringify(m)));
      let C = m.components;
      if (h === 1) {
        let R = O;
        m.enableCondition !== void 0 ? (o.push(JSON.parse(JSON.stringify(m))), R = !1) : R = !0, l.push({
          dataKey: m.dataKey,
          name: m.name,
          label: m.label,
          description: m.description,
          level: S,
          index: [..._, N],
          components: C,
          sourceQuestion: m.sourceQuestion || "",
          enable: R,
          enableCondition: m.enableCondition || "",
          componentEnable: m.componentEnable || []
        });
      }
      h === 2 && s.push({
        dataKey: m.dataKey,
        name: m.name,
        label: m.label,
        description: m.description,
        level: S,
        index: [..._, N],
        components: C,
        sourceQuestion: m.sourceQuestion || "",
        enable: O,
        enableCondition: m.enableCondition || "",
        componentEnable: m.componentEnable || []
      }), h > 2 && m.enableCondition !== void 0 && !O && o.push(JSON.parse(JSON.stringify(m)));
      const {
        vals: L,
        compVal: E
      } = v(m.dataKey), I = u(m);
      if (a.push({
        dataKey: m.dataKey,
        name: m.name,
        label: m.label,
        hint: m.hint || "",
        description: m.description,
        type: h,
        answer: b,
        index: [..._, N],
        level: S,
        options: m.options,
        sourceQuestion: m.sourceQuestion,
        urlValidation: m.urlValidation,
        currency: m.currency,
        source: m.source,
        urlPath: m.path,
        parent: m.parent,
        separatorFormat: m.separatorFormat,
        isDecimal: m.isDecimal,
        maskingFormat: m.maskingFormat,
        expression: m.expression,
        componentVar: m.componentVar,
        render: m.render,
        renderType: m.renderType,
        enable: !0,
        enableCondition: m.enableCondition || "",
        componentEnable: m.componentEnable || [],
        enableRemark: m.enableRemark !== void 0 ? m.enableRemark : !0,
        client: m.client,
        titleModalDelete: m.titleModalDelete,
        sourceOption: m.sourceOption,
        sourceAPI: m.sourceAPI,
        typeOption: m.typeOption,
        contentModalDelete: m.contentModalDelete,
        validationState: m.validationState || 0,
        validationMessage: m.validationMessage || [],
        validations: L,
        componentValidation: E,
        hasRemark: I,
        rows: m.rows,
        cols: m.cols,
        rangeInput: m.rangeInput,
        lengthInput: m.lengthInput,
        principal: m.principal,
        columnName: m.columnName || "",
        titleModalConfirmation: m.titleModalConfirmation,
        contentModalConfirmation: m.contentModalConfirmation,
        required: m.required,
        presetMaster: m.presetMaster,
        disableInput: m.disableInput,
        decimalLength: m.decimalLength,
        disableInitial: m.disableInitial,
        sizeInput: m.sizeInput
      }), C && Array.isArray(C))
        for (let R = 0; R < C.length; R++)
          Array.isArray(C[R]) && w(C[R], [..._, N, R], S + 1, O);
    }
  };
  for (let p = 0; p < M.length; p++) {
    const _ = M[p];
    let S = !1;
    _.enableCondition !== void 0 && (o.push(JSON.parse(JSON.stringify(_))), S = !0), l.push({
      dataKey: _.dataKey,
      name: _.name,
      label: _.label,
      description: _.description,
      level: 0,
      index: [0, p],
      components: _.components,
      sourceQuestion: _.sourceQuestion || "",
      enable: !S,
      enableCondition: _.enableCondition || "",
      componentEnable: _.componentEnable || []
    }), a.push({
      dataKey: _.dataKey,
      name: _.name,
      label: _.label,
      hint: _.hint || "",
      description: _.description,
      type: _.type,
      index: [0, p],
      level: 0,
      options: _.options,
      sourceQuestion: _.sourceQuestion,
      enable: !0,
      enableCondition: _.enableCondition || "",
      componentEnable: _.componentEnable || [],
      enableRemark: _.enableRemark !== void 0 ? _.enableRemark : !0,
      validationState: 0,
      validationMessage: []
    }), _.components && _.components[0] && w(_.components[0], [0, p, 0], 1, S);
  }
  return {
    referenceList: a,
    sidebarList: l,
    nestedList: s,
    tmpVarComp: c,
    tmpEnableComp: o
  };
}
function pm(e) {
  const {
    data: t,
    config: n,
    mobileHandlers: i = {},
    callbacks: r = {}
  } = e, a = Se(Se({}, Ga), n);
  t.reference;
  const l = t.template || {}, s = t.preset || Hf, c = t.response || Qf, o = t.validation || {}, d = t.media || Kf, f = t.remark || Wf;
  dn = l.version || "0.0.0", cn = o.version || "0.0.0";
  const x = i.uploadHandler || (() => {
  }), $ = i.gpsHandler || (() => {
  }), M = i.offlineSearch || (() => {
  }), v = i.onlineSearch || (() => de(null, null, function* () {
    return {};
  })), u = i.exitHandler || ((B) => B && B()), w = i.openMap || (() => {
  }), p = i.audioHandler || (() => {
  }), _ = i.barcodeHandler || (() => {
  }), S = i.videoHandler || (() => {
  }), O = i.fileHandler || (() => {
  }), N = r.onSave || (() => {
  }), m = r.onSubmit || (() => {
  }), h = l;
  if (!h.components || !Array.isArray(h.components) || h.components.length === 0)
    throw ve("Template configuration error: No components found", 5e3), new Error("Template configuration error: No components found");
  if (!Array.isArray(h.components[0]) || h.components[0].length === 0)
    throw ve("Template configuration error: No sections defined", 5e3), new Error("Template configuration error: No sections defined");
  const b = Pf({
    template: l,
    validation: o,
    preset: s,
    response: c,
    media: d,
    remark: f
  }), {
    referenceList: C,
    sidebarList: L,
    nestedList: E,
    tmpVarComp: I,
    tmpEnableComp: R
  } = Zf(b, l, o, f);
  b.reference[1]("details", C), b.sidebar[1]("details", L), b.nested[1]("details", E);
  const A = {
    clientMode: a.clientMode,
    formMode: a.formMode,
    initialMode: a.initialMode,
    lookupMode: a.lookupMode,
    username: a.username || "",
    token: a.token || "",
    baseUrl: a.baseUrl || "",
    lookupKey: a.lookupKey || "keys",
    lookupValue: a.lookupValue || "values"
  }, T = ms(b, A);
  T.reference.initializeMaps(), T.enable.initializeEnableStates();
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
  }, F = /* @__PURE__ */ new Date(), D = document.getElementById("FormGear-root");
  if (!D)
    throw ve("Mount point not found: FormGear-root", 5e3), new Error("Mount point not found: FormGear-root");
  return ja(() => g(tl, {
    stores: b,
    get children() {
      return g(vs, {
        services: T,
        get children() {
          return g(el, {
            get children() {
              return g(qg, {
                get children() {
                  return [g(Of, {
                    config: K,
                    timeStart: F,
                    runAll: 0,
                    tmpEnableComp: R,
                    tmpVarComp: I,
                    template: {
                      details: l
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
                    offlineSearch: M,
                    onlineSearch: v,
                    mobileExit: u,
                    setResponseMobile: N,
                    setSubmitMobile: m,
                    openMap: w,
                    audioHandler: p,
                    barcodeHandler: _,
                    videoHandler: S,
                    fileHandler: O
                  }), g(Nf, {})];
                }
              });
            }
          });
        }
      });
    }
  }), D), {
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
      return b.reference[0].details.filter((H) => H.principal !== void 0 && H.principal > 0).sort((H, ee) => (H.principal || 0) - (ee.principal || 0)).map((H) => ({
        dataKey: H.dataKey,
        name: H.name,
        answer: H.answer,
        principal: H.principal,
        columnName: H.columnName
      }));
    },
    getReference() {
      return b.reference[0];
    },
    getSummary() {
      const B = b.summary[0];
      return {
        answer: B.answer,
        blank: B.blank,
        error: B.error,
        remark: B.remark
      };
    },
    validate() {
      return !b.reference[0].details.some((H) => H.validationState === 2);
    },
    setValue(B, J) {
      const ee = b.reference[0].details.findIndex((G) => G.dataKey === B);
      ee !== -1 && b.reference[1]("details", ee, "answer", J);
    },
    getValue(B) {
      const H = b.reference[0].details.find((ee) => ee.dataKey === B);
      return H == null ? void 0 : H.answer;
    },
    save() {
      N(b.response[0].details, b.media[0].details, b.remark[0].details, this.getPrincipal(), b.reference[0]);
    },
    submit() {
      m(b.response[0].details, b.media[0].details, b.remark[0].details, this.getPrincipal(), b.reference[0]);
    },
    destroy() {
      D && (D.innerHTML = ""), b.dispose();
    }
  };
}
function Xf(e = {}) {
  const { debug: t = !1 } = e, n = (s, c) => {
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
      return c;
    }
  }, r = (s, c) => {
    if (!s) return c;
    try {
      return JSON.parse(s);
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
    openCameraWithGps(s) {
      return de(this, null, function* () {
        const c = i("openCameraWithGps", "", s);
        return r(c, {
          latitude: 0,
          longitude: 0,
          accuracy: 0
        });
      });
    },
    uploadFile(s) {
      return de(this, null, function* () {
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
      return de(this, null, function* () {
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
      return de(this, null, function* () {
        const s = i("getCurrentLocation", "");
        return r(s, {
          latitude: 0,
          longitude: 0
        });
      });
    },
    openMap(s) {
      i(
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
      return de(this, null, function* () {
        const c = JSON.stringify(s);
        i("saveResponse", void 0, c);
      });
    },
    submitResponse(s) {
      return de(this, null, function* () {
        const c = JSON.stringify(s);
        i("submitResponse", void 0, c);
      });
    },
    // =========================================================================
    // Offline Data
    // =========================================================================
    searchOffline(s, c, o) {
      return de(this, null, function* () {
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
      s && s(), i("exit", void 0);
    },
    showToast(s, c = 3e3) {
      i("showToast", void 0, s, c);
    },
    showConfirmDialog(s, c) {
      return de(this, null, function* () {
        return i("showConfirmDialog", !1, s, c);
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
function em() {
  return typeof window != "undefined" && typeof window.Android != "undefined";
}
typeof window != "undefined" && !window.__formgear_callbacks__ && (window.__formgear_callbacks__ = {});
let tm = 0;
function nm() {
  return `cb_${Date.now()}_${++tm}`;
}
function im(e = {}) {
  const { timeout: t = 3e4, debug: n = !1 } = e, i = (o, d) => {
  }, r = () => {
    var o, d;
    return (d = (o = window.webkit) == null ? void 0 : o.messageHandlers) == null ? void 0 : d.FormGearHandler;
  }, a = (o, d) => new Promise((f, x) => {
    var w;
    const $ = r();
    if (!$) {
      x(new Error("iOS handler not available"));
      return;
    }
    const M = nm(), v = setTimeout(() => {
      var p;
      (p = window.__formgear_callbacks__) == null || delete p[M], x(new Error(`Timeout waiting for ${o} response`));
    }, t);
    window.__formgear_callbacks__ && (window.__formgear_callbacks__[M] = (p) => {
      var _;
      clearTimeout(v), (_ = window.__formgear_callbacks__) == null || delete _[M], f(p);
    });
    const u = {
      action: o,
      callbackId: M,
      data: d
    };
    try {
      $.postMessage(u);
    } catch (p) {
      clearTimeout(v), (w = window.__formgear_callbacks__) == null || delete w[M], x(p);
    }
  }), l = (o, d) => {
    const f = r();
    if (!f)
      return;
    const x = {
      action: o,
      callbackId: "",
      // Empty for no-response messages
      data: d
    };
    try {
      f.postMessage(x), i(`Sent no-response message: ${o}`, d);
    } catch ($) {
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
      l("openMap", o);
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
        } catch (x) {
          return [];
        }
      });
    },
    // =========================================================================
    // Lifecycle
    // =========================================================================
    exit(o) {
      o && o(), l("exit");
    },
    showToast(o, d = 3e3) {
      l("showToast", { message: o, duration: d });
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
      l("log", { level: o, message: d, data: f });
    }
  };
}
function rm() {
  var e, t;
  return typeof window != "undefined" && typeof ((t = (e = window.webkit) == null ? void 0 : e.messageHandlers) == null ? void 0 : t.FormGearHandler) != "undefined";
}
typeof window != "undefined" && (window.__formgear_resolve_callback__ = (e, t) => {
  var i;
  const n = (i = window.__formgear_callbacks__) == null ? void 0 : i[e];
  n && n(t);
});
typeof window != "undefined" && !window.__formgear_callbacks__ && (window.__formgear_callbacks__ = {});
let am = 0;
function lm() {
  return `flutter_cb_${Date.now()}_${++am}`;
}
function sm(e = {}) {
  const { timeout: t = 3e4, debug: n = !1 } = e, i = (s, c) => de(null, null, function* () {
    const o = window.flutter_inappwebview;
    if (!o)
      throw new Error("Flutter InAppWebView not available");
    const d = new Promise((x, $) => {
      setTimeout(
        () => $(new Error(`Timeout calling ${s}`)),
        t
      );
    }), f = o.callHandler(
      s,
      c
    );
    return Promise.race([f, d]);
  }), r = (s, c, o) => de(null, null, function* () {
    try {
      return yield i(s, o);
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
    openCameraWithGps(s) {
      return de(this, null, function* () {
        return r("openCameraWithGps", { latitude: 0, longitude: 0, accuracy: 0 }, s);
      });
    },
    uploadFile(s) {
      return de(this, null, function* () {
        return r("uploadFile", { path: "", name: "", mimeType: "", size: 0 }, s);
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
    openMap(s) {
      r("openMap", void 0, s);
    },
    // Data Persistence
    saveResponse(s) {
      return de(this, null, function* () {
        yield r("saveResponse", void 0, s);
      });
    },
    submitResponse(s) {
      return de(this, null, function* () {
        yield r("submitResponse", void 0, s);
      });
    },
    // Offline Data
    searchOffline(s, c, o) {
      return de(this, null, function* () {
        return r("searchOffline", [], { lookupId: s, version: c, conditions: o });
      });
    },
    // Lifecycle
    exit(s) {
      s && s(), r("exit", void 0);
    },
    showToast(s, c = 3e3) {
      r("showToast", void 0, { message: s, duration: c });
    },
    showConfirmDialog(s, c) {
      return de(this, null, function* () {
        return r("showConfirmDialog", !1, { title: s, message: c });
      });
    },
    // Logging
    log(s, c, o) {
      r("log", void 0, { level: s, message: c, data: o });
    }
  };
}
function om(e = {}) {
  const { timeout: t = 3e4, debug: n = !1 } = e, i = (o, d) => {
  }, r = (o, d) => new Promise((f, x) => {
    var w;
    const $ = window.FormGearChannel;
    if (!$) {
      x(new Error("Flutter channel not available"));
      return;
    }
    const M = lm(), v = setTimeout(() => {
      var p;
      (p = window.__formgear_callbacks__) == null || delete p[M], x(new Error(`Timeout waiting for ${o} response`));
    }, t);
    window.__formgear_callbacks__ && (window.__formgear_callbacks__[M] = (p) => {
      var _;
      clearTimeout(v), (_ = window.__formgear_callbacks__) == null || delete _[M], f(p);
    });
    const u = {
      method: o,
      args: d,
      callbackId: M
    };
    try {
      $.postMessage(JSON.stringify(u));
    } catch (p) {
      clearTimeout(v), (w = window.__formgear_callbacks__) == null || delete w[M], x(p);
    }
  }), a = (o, d) => {
    const f = window.FormGearChannel;
    if (!f)
      return;
    const x = { method: o, args: d };
    try {
      f.postMessage(JSON.stringify(x)), i(`Sent no-response message: ${o}`, d);
    } catch ($) {
    }
  }, l = (o, d, f) => de(null, null, function* () {
    try {
      return yield r(o, f);
    } catch (x) {
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
        return l("openCamera", "");
      });
    },
    openCameraWithGps(o) {
      return de(this, null, function* () {
        return l("openCameraWithGps", { latitude: 0, longitude: 0, accuracy: 0 }, { needPhoto: o });
      });
    },
    uploadFile(o) {
      return de(this, null, function* () {
        return l("uploadFile", { path: "", name: "", mimeType: "", size: 0 }, { accept: o });
      });
    },
    scanBarcode() {
      return de(this, null, function* () {
        return l("scanBarcode", { value: "", format: "" });
      });
    },
    // Location
    getCurrentLocation() {
      return de(this, null, function* () {
        return l("getCurrentLocation", { latitude: 0, longitude: 0 });
      });
    },
    openMap(o) {
      a("openMap", o);
    },
    // Data Persistence
    saveResponse(o) {
      return de(this, null, function* () {
        yield l("saveResponse", void 0, o);
      });
    },
    submitResponse(o) {
      return de(this, null, function* () {
        yield l("submitResponse", void 0, o);
      });
    },
    // Offline Data
    searchOffline(o, d, f) {
      return de(this, null, function* () {
        return l("searchOffline", [], { lookupId: o, version: d, conditions: f });
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
        return l("showConfirmDialog", !1, { title: o, message: d });
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
function km() {
  return Vt() || Yn();
}
typeof window != "undefined" && (window.__formgear_flutter_callback__ = (e, t) => {
  var i;
  const n = (i = window.__formgear_callbacks__) == null ? void 0 : i[e];
  n && n(t);
});
function qi(e = {}) {
  const { debug: t = !1 } = e, n = (a, l) => {
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
          const l = document.createElement("input");
          l.type = "file", l.accept = "image/*", l.capture = "environment", l.onchange = () => {
            var c;
            const s = (c = l.files) == null ? void 0 : c[0];
            if (s) {
              const o = new FileReader();
              o.onload = () => {
                a(o.result);
              }, o.onerror = () => a(""), o.readAsDataURL(s);
            } else
              a("");
          }, l.oncancel = () => a(""), l.click();
        });
      });
    },
    openCameraWithGps(a) {
      return de(this, null, function* () {
        const l = {
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
          l.latitude = s.coords.latitude, l.longitude = s.coords.longitude, l.accuracy = s.coords.accuracy, l.timestamp = s.timestamp;
        } catch (s) {
        }
        if (a) {
          const s = yield this.openCamera();
          l.photo = s;
        }
        return l;
      });
    },
    uploadFile(a) {
      return de(this, null, function* () {
        return new Promise((l) => {
          const s = document.createElement("input");
          s.type = "file", s.accept = a, s.onchange = () => {
            var o;
            const c = (o = s.files) == null ? void 0 : o[0];
            if (c) {
              const d = new FileReader();
              d.onload = () => {
                l({
                  path: URL.createObjectURL(c),
                  name: c.name,
                  mimeType: c.type,
                  size: c.size,
                  base64: d.result
                });
              }, d.onerror = () => {
                l({
                  path: "",
                  name: "",
                  mimeType: "",
                  size: 0
                });
              }, d.readAsDataURL(c);
            } else
              l({
                path: "",
                name: "",
                mimeType: "",
                size: 0
              });
          }, s.oncancel = () => {
            l({
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
      return de(this, null, function* () {
        if ("BarcodeDetector" in window)
          try {
            const a = window.BarcodeDetector, l = new a();
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
            (l, s) => {
              if (!navigator.geolocation) {
                s(new Error("Geolocation not supported"));
                return;
              }
              navigator.geolocation.getCurrentPosition(l, s, {
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
      const l = `https://www.google.com/maps?q=${a.latitude},${a.longitude}`;
      window.open(l, "_blank");
    },
    // =========================================================================
    // Data Persistence
    // =========================================================================
    saveResponse(a) {
      return de(this, null, function* () {
        try {
          localStorage.setItem("formgear_draft", JSON.stringify(a)), n("Response saved to localStorage");
        } catch (l) {
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
    searchOffline(a, l, s) {
      return de(this, null, function* () {
        try {
          const c = `formgear_lookup_${a}_${l}`, o = localStorage.getItem(c);
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
    showToast(a, l = 3e3) {
      const s = window.Toastify;
      if (s) {
        s({
          text: a,
          duration: l,
          gravity: "bottom",
          position: "center"
        }).showToast();
        return;
      }
    },
    showConfirmDialog(a, l) {
      return de(this, null, function* () {
        return window.confirm(`${a}

${l}`);
      });
    },
    // =========================================================================
    // Logging
    // =========================================================================
    log(a, l, s) {
    }
  };
}
function $m() {
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
function kt(r, a, l) {
  return de(this, arguments, function* (e, t, n, i = {}) {
    const { debug: s = !1, timeout: c = 3e4 } = i;
    if (!Vt())
      return n;
    try {
      const o = new Promise((x, $) => {
        setTimeout(() => $(new Error(`Timeout calling ${e}`)), c);
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
function ea(e = {}) {
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
      ).then((l) => {
        a(l);
      }).catch((l) => {
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
      var a, l, s, c;
      const i = (l = (a = n.lat) != null ? a : n.latitude) != null ? l : 0, r = (c = (s = n.long) != null ? s : n.longitude) != null ? c : 0;
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
function _m(e = {}) {
  if (Vt())
    return e.debug, ea(e);
  e.debug;
}
function dm(e = {}) {
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
function Sm(e = {}) {
  const t = Vt();
  return e.debug, t ? {
    isFlutter: !0,
    mobileHandlers: ea(e),
    callbacks: dm(e)
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
  if (em())
    return {
      platform: "android",
      confidence: "definite",
      details: "Android WebView detected (window.Android)"
    };
  if (rm())
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
function cm(e = {}) {
  const { forcePlatform: t, debug: n = !1 } = e;
  if (t)
    return Gi(t, e);
  const i = Qn();
  return Gi(i.platform, e);
}
function Gi(e, t) {
  switch (e) {
    case "android":
      return Xf(t);
    case "ios":
      return im(t);
    case "flutter":
      return Vt() ? sm(t) : Yn() ? om(t) : qi(t);
    default:
      return qi(t);
  }
}
let un = null;
function Cm(e) {
  return un || (un = cm(e)), un;
}
function Mm() {
  un = null;
}
function Im() {
  const e = Qn();
  return e.platform !== "web" && e.confidence === "definite";
}
function Em() {
  if (typeof window == "undefined") return !1;
  const e = navigator.userAgent.toLowerCase();
  return e.includes("android") || e.includes("iphone") || e.includes("ipad") || e.includes("ipod") || e.includes("mobile");
}
function Lm() {
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
  ar as ClientMode,
  qa as ControlType,
  Ga as DEFAULT_CONFIG,
  pt as FLUTTER_HANDLER_NAMES,
  lr as FormMode,
  sr as InitialMode,
  or as LookupMode,
  Ja as OptionType,
  vs as ServiceProvider,
  Wa as ValidationType,
  Xf as createAndroidBridge,
  cm as createBridge,
  dm as createFlutterCallbacks,
  om as createFlutterChannelBridge,
  sm as createFlutterInAppWebViewBridge,
  ea as createFlutterMobileHandlers,
  pm as createFormGear,
  ms as createFormServices,
  im as createIOSBridge,
  qi as createWebBridge,
  _m as detectFlutterHandlers,
  Qn as detectPlatform,
  ot as gearVersion,
  Cm as getBridge,
  Lm as getPlatformName,
  Sm as initFlutterIntegration,
  em as isAndroidAvailable,
  km as isFlutterAvailable,
  Yn as isFlutterChannelAvailable,
  Vt as isFlutterInAppWebViewAvailable,
  rm as isIOSAvailable,
  Em as isMobile,
  Im as isNativeApp,
  $m as isWebAvailable,
  Mm as resetBridge,
  xm as useAnswerService,
  bm as useEnableService,
  mm as useExpressionService,
  ym as useHistoryService,
  wm as useNestedService,
  fm as useReferenceService,
  ut as useServices,
  vm as useValidationService
};
//# sourceMappingURL=form-gear.es.js.map
