var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.getGlobal = function(h) {
    return "undefined" != typeof window && window === h ? h : "undefined" != typeof global && null != global ? global : h
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.checkEs6ConformanceViaProxy = function() {
    try {
        var h = {},
            g = Object.create(new $jscomp.global.Proxy(h, {
                get: function(p, a, r) {
                    return p == h && "q" == a && r == g
                }
            }));
        return !0 === g.q
    } catch (p) {
        return !1
    }
};
$jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS = !1;
$jscomp.ES6_CONFORMANCE = $jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS && $jscomp.checkEs6ConformanceViaProxy();
$jscomp.arrayIteratorImpl = function(h) {
    var g = 0;
    return function() {
        return g < h.length ? {
            done: !1,
            value: h[g++]
        } : {
            done: !0
        }
    }
};
$jscomp.arrayIterator = function(h) {
    return {
        next: $jscomp.arrayIteratorImpl(h)
    }
};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.SIMPLE_FROUND_POLYFILL = !1;
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function(h, g, p) {
    h != Array.prototype && h != Object.prototype && (h[g] = p.value)
};
$jscomp.SYMBOL_PREFIX = "jscomp_symbol_";
$jscomp.initSymbol = function() {
    $jscomp.initSymbol = function() {};
    $jscomp.global.Symbol || ($jscomp.global.Symbol = $jscomp.Symbol)
};
$jscomp.SymbolClass = function(h, g) {
    this.$jscomp$symbol$id_ = h;
    $jscomp.defineProperty(this, "description", {
        configurable: !0,
        writable: !0,
        value: g
    })
};
$jscomp.SymbolClass.prototype.toString = function() {
    return this.$jscomp$symbol$id_
};
$jscomp.Symbol = function() {
    function h(p) {
        if (this instanceof h) throw new TypeError("Symbol is not a constructor");
        return new $jscomp.SymbolClass($jscomp.SYMBOL_PREFIX + (p || "") + "_" + g++, p)
    }
    var g = 0;
    return h
}();
$jscomp.initSymbolIterator = function() {
    $jscomp.initSymbol();
    var h = $jscomp.global.Symbol.iterator;
    h || (h = $jscomp.global.Symbol.iterator = $jscomp.global.Symbol("Symbol.iterator"));
    "function" != typeof Array.prototype[h] && $jscomp.defineProperty(Array.prototype, h, {
        configurable: !0,
        writable: !0,
        value: function() {
            return $jscomp.iteratorPrototype($jscomp.arrayIteratorImpl(this))
        }
    });
    $jscomp.initSymbolIterator = function() {}
};
$jscomp.initSymbolAsyncIterator = function() {
    $jscomp.initSymbol();
    var h = $jscomp.global.Symbol.asyncIterator;
    h || (h = $jscomp.global.Symbol.asyncIterator = $jscomp.global.Symbol("Symbol.asyncIterator"));
    $jscomp.initSymbolAsyncIterator = function() {}
};
$jscomp.iteratorPrototype = function(h) {
    $jscomp.initSymbolIterator();
    h = {
        next: h
    };
    h[$jscomp.global.Symbol.iterator] = function() {
        return this
    };
    return h
};
$jscomp.makeIterator = function(h) {
    var g = "undefined" != typeof Symbol && Symbol.iterator && h[Symbol.iterator];
    return g ? g.call(h) : $jscomp.arrayIterator(h)
};
$jscomp.owns = function(h, g) {
    return Object.prototype.hasOwnProperty.call(h, g)
};
$jscomp.polyfill = function(h, g, p, a) {
    if (g) {
        p = $jscomp.global;
        h = h.split(".");
        for (a = 0; a < h.length - 1; a++) {
            var r = h[a];
            r in p || (p[r] = {});
            p = p[r]
        }
        h = h[h.length - 1];
        a = p[h];
        g = g(a);
        g != a && null != g && $jscomp.defineProperty(p, h, {
            configurable: !0,
            writable: !0,
            value: g
        })
    }
};
$jscomp.polyfill("WeakMap", function(h) {
    function g() {
        if (!h || !Object.seal) return !1;
        try {
            var a = Object.seal({}),
                d = Object.seal({}),
                g = new h([
                    [a, 2],
                    [d, 3]
                ]);
            if (2 != g.get(a) || 3 != g.get(d)) return !1;
            g.delete(a);
            g.set(d, 4);
            return !g.has(a) && 4 == g.get(d)
        } catch (f) {
            return !1
        }
    }

    function p() {}

    function a(a) {
        var d = typeof a;
        return "object" === d && null !== a || "function" === d
    }

    function r(a) {
        if (!$jscomp.owns(a, d)) {
            var g = new p;
            $jscomp.defineProperty(a, d, {
                value: g
            })
        }
    }

    function v(a) {
        var d = Object[a];
        d && (Object[a] = function(a) {
            if (a instanceof p) return a;
            r(a);
            return d(a)
        })
    }
    if ($jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS) {
        if (h && $jscomp.ES6_CONFORMANCE) return h
    } else if (g()) return h;
    var d = "$jscomp_hidden_" + Math.random();
    v("freeze");
    v("preventExtensions");
    v("seal");
    var k = 0,
        n = function(a) {
            this.id_ = (k += Math.random() + 1).toString();
            if (a) {
                a = $jscomp.makeIterator(a);
                for (var d; !(d = a.next()).done;) d = d.value, this.set(d[0], d[1])
            }
        };
    n.prototype.set = function(g, k) {
        if (!a(g)) throw Error("Invalid WeakMap key");
        r(g);
        if (!$jscomp.owns(g, d)) throw Error("WeakMap key fail: " +
            g);
        g[d][this.id_] = k;
        return this
    };
    n.prototype.get = function(g) {
        return a(g) && $jscomp.owns(g, d) ? g[d][this.id_] : void 0
    };
    n.prototype.has = function(g) {
        return a(g) && $jscomp.owns(g, d) && $jscomp.owns(g[d], this.id_)
    };
    n.prototype.delete = function(g) {
        return a(g) && $jscomp.owns(g, d) && $jscomp.owns(g[d], this.id_) ? delete g[d][this.id_] : !1
    };
    return n
}, "es6", "es3");
$jscomp.MapEntry = function() {};
$jscomp.polyfill("Map", function(h) {
    function g() {
        if ($jscomp.ASSUME_NO_NATIVE_MAP || !h || "function" != typeof h || !h.prototype.entries || "function" != typeof Object.seal) return !1;
        try {
            var a = Object.seal({
                    x: 4
                }),
                d = new h($jscomp.makeIterator([
                    [a, "s"]
                ]));
            if ("s" != d.get(a) || 1 != d.size || d.get({
                    x: 4
                }) || d.set({
                    x: 4
                }, "t") != d || 2 != d.size) return !1;
            var g = d.entries(),
                k = g.next();
            if (k.done || k.value[0] != a || "s" != k.value[1]) return !1;
            k = g.next();
            return k.done || 4 != k.value[0].x || "t" != k.value[1] || !g.next().done ? !1 : !0
        } catch (f) {
            return !1
        }
    }
    if ($jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS) {
        if (h && $jscomp.ES6_CONFORMANCE) return h
    } else if (g()) return h;
    $jscomp.initSymbolIterator();
    var p = new WeakMap,
        a = function(a) {
            this.data_ = {};
            this.head_ = d();
            this.size = 0;
            if (a) {
                a = $jscomp.makeIterator(a);
                for (var g; !(g = a.next()).done;) g = g.value, this.set(g[0], g[1])
            }
        };
    a.prototype.set = function(a, d) {
        a = 0 === a ? 0 : a;
        var g = r(this, a);
        g.list || (g.list = this.data_[g.id] = []);
        g.entry ? g.entry.value = d : (g.entry = {
            next: this.head_,
            previous: this.head_.previous,
            head: this.head_,
            key: a,
            value: d
        }, g.list.push(g.entry), this.head_.previous.next = g.entry, this.head_.previous = g.entry, this.size++);
        return this
    };
    a.prototype.delete = function(a) {
        a = r(this, a);
        return a.entry && a.list ? (a.list.splice(a.index, 1), a.list.length || delete this.data_[a.id], a.entry.previous.next = a.entry.next, a.entry.next.previous = a.entry.previous, a.entry.head = null, this.size--, !0) : !1
    };
    a.prototype.clear = function() {
        this.data_ = {};
        this.head_ = this.head_.previous = d();
        this.size = 0
    };
    a.prototype.has = function(a) {
        return !!r(this, a).entry
    };
    a.prototype.get = function(a) {
        return (a = r(this, a).entry) && a.value
    };
    a.prototype.entries = function() {
        return v(this, function(a) {
            return [a.key, a.value]
        })
    };
    a.prototype.keys = function() {
        return v(this, function(a) {
            return a.key
        })
    };
    a.prototype.values = function() {
        return v(this, function(a) {
            return a.value
        })
    };
    a.prototype.forEach = function(a, d) {
        for (var g = this.entries(), k; !(k = g.next()).done;) k = k.value, a.call(d, k[1], k[0], this)
    };
    a.prototype[Symbol.iterator] = a.prototype.entries;
    var r = function(a, d) {
            var g = d && typeof d;
            "object" ==
            g || "function" == g ? p.has(d) ? g = p.get(d) : (g = "" + ++k, p.set(d, g)) : g = "p_" + d;
            var h = a.data_[g];
            if (h && $jscomp.owns(a.data_, g))
                for (a = 0; a < h.length; a++) {
                    var f = h[a];
                    if (d !== d && f.key !== f.key || d === f.key) return {
                        id: g,
                        list: h,
                        index: a,
                        entry: f
                    }
                }
            return {
                id: g,
                list: h,
                index: -1,
                entry: void 0
            }
        },
        v = function(a, d) {
            var g = a.head_;
            return $jscomp.iteratorPrototype(function() {
                if (g) {
                    for (; g.head != a.head_;) g = g.previous;
                    for (; g.next != g.head;) return g = g.next, {
                        done: !1,
                        value: d(g)
                    };
                    g = null
                }
                return {
                    done: !0,
                    value: void 0
                }
            })
        },
        d = function() {
            var a = {};
            return a.previous =
                a.next = a.head = a
        },
        k = 0;
    return a
}, "es6", "es3");
$jscomp.polyfill("Set", function(h) {
    function g() {
        if ($jscomp.ASSUME_NO_NATIVE_SET || !h || "function" != typeof h || !h.prototype.entries || "function" != typeof Object.seal) return !1;
        try {
            var a = Object.seal({
                    x: 4
                }),
                g = new h($jscomp.makeIterator([a]));
            if (!g.has(a) || 1 != g.size || g.add(a) != g || 1 != g.size || g.add({
                    x: 4
                }) != g || 2 != g.size) return !1;
            var p = g.entries(),
                d = p.next();
            if (d.done || d.value[0] != a || d.value[1] != a) return !1;
            d = p.next();
            return d.done || d.value[0] == a || 4 != d.value[0].x || d.value[1] != d.value[0] ? !1 : p.next().done
        } catch (k) {
            return !1
        }
    }
    if ($jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS) {
        if (h && $jscomp.ES6_CONFORMANCE) return h
    } else if (g()) return h;
    $jscomp.initSymbolIterator();
    var p = function(a) {
        this.map_ = new Map;
        if (a) {
            a = $jscomp.makeIterator(a);
            for (var g; !(g = a.next()).done;) this.add(g.value)
        }
        this.size = this.map_.size
    };
    p.prototype.add = function(a) {
        a = 0 === a ? 0 : a;
        this.map_.set(a, a);
        this.size = this.map_.size;
        return this
    };
    p.prototype.delete = function(a) {
        a = this.map_.delete(a);
        this.size = this.map_.size;
        return a
    };
    p.prototype.clear = function() {
        this.map_.clear();
        this.size = 0
    };
    p.prototype.has = function(a) {
        return this.map_.has(a)
    };
    p.prototype.entries = function() {
        return this.map_.entries()
    };
    p.prototype.values = function() {
        return this.map_.values()
    };
    p.prototype.keys = p.prototype.values;
    p.prototype[Symbol.iterator] = p.prototype.values;
    p.prototype.forEach = function(a, g) {
        var h = this;
        this.map_.forEach(function(d) {
            return a.call(g, d, d, h)
        })
    };
    return p
}, "es6", "es3");
$jscomp.FORCE_POLYFILL_PROMISE = !1;
$jscomp.polyfill("Promise", function(h) {
    function g() {
        this.batch_ = null
    }

    function p(a) {
        return a instanceof r ? a : new r(function(d, g) {
            d(a)
        })
    }
    if (h && !$jscomp.FORCE_POLYFILL_PROMISE) return h;
    g.prototype.asyncExecute = function(a) {
        if (null == this.batch_) {
            this.batch_ = [];
            var d = this;
            this.asyncExecuteFunction(function() {
                d.executeBatch_()
            })
        }
        this.batch_.push(a)
    };
    var a = $jscomp.global.setTimeout;
    g.prototype.asyncExecuteFunction = function(d) {
        a(d, 0)
    };
    g.prototype.executeBatch_ = function() {
        for (; this.batch_ && this.batch_.length;) {
            var a =
                this.batch_;
            this.batch_ = [];
            for (var g = 0; g < a.length; ++g) {
                var h = a[g];
                a[g] = null;
                try {
                    h()
                } catch (u) {
                    this.asyncThrow_(u)
                }
            }
        }
        this.batch_ = null
    };
    g.prototype.asyncThrow_ = function(a) {
        this.asyncExecuteFunction(function() {
            throw a;
        })
    };
    var r = function(a) {
        this.state_ = 0;
        this.result_ = void 0;
        this.onSettledCallbacks_ = [];
        var d = this.createResolveAndReject_();
        try {
            a(d.resolve, d.reject)
        } catch (n) {
            d.reject(n)
        }
    };
    r.prototype.createResolveAndReject_ = function() {
        function a(a) {
            return function(d) {
                h || (h = !0, a.call(g, d))
            }
        }
        var g = this,
            h = !1;
        return {
            resolve: a(this.resolveTo_),
            reject: a(this.reject_)
        }
    };
    r.prototype.resolveTo_ = function(a) {
        if (a === this) this.reject_(new TypeError("A Promise cannot resolve to itself"));
        else if (a instanceof r) this.settleSameAsPromise_(a);
        else {
            a: switch (typeof a) {
                case "object":
                    var d = null != a;
                    break a;
                case "function":
                    d = !0;
                    break a;
                default:
                    d = !1
            }
            d ? this.resolveToNonPromiseObj_(a) : this.fulfill_(a)
        }
    };
    r.prototype.resolveToNonPromiseObj_ = function(a) {
        var d = void 0;
        try {
            d = a.then
        } catch (n) {
            this.reject_(n);
            return
        }
        "function" == typeof d ?
            this.settleSameAsThenable_(d, a) : this.fulfill_(a)
    };
    r.prototype.reject_ = function(a) {
        this.settle_(2, a)
    };
    r.prototype.fulfill_ = function(a) {
        this.settle_(1, a)
    };
    r.prototype.settle_ = function(a, g) {
        if (0 != this.state_) throw Error("Cannot settle(" + a + ", " + g + "): Promise already settled in state" + this.state_);
        this.state_ = a;
        this.result_ = g;
        this.executeOnSettledCallbacks_()
    };
    r.prototype.executeOnSettledCallbacks_ = function() {
        if (null != this.onSettledCallbacks_) {
            for (var a = 0; a < this.onSettledCallbacks_.length; ++a) v.asyncExecute(this.onSettledCallbacks_[a]);
            this.onSettledCallbacks_ = null
        }
    };
    var v = new g;
    r.prototype.settleSameAsPromise_ = function(a) {
        var d = this.createResolveAndReject_();
        a.callWhenSettled_(d.resolve, d.reject)
    };
    r.prototype.settleSameAsThenable_ = function(a, g) {
        var d = this.createResolveAndReject_();
        try {
            a.call(g, d.resolve, d.reject)
        } catch (u) {
            d.reject(u)
        }
    };
    r.prototype.then = function(a, g) {
        function d(a, d) {
            return "function" == typeof a ? function(d) {
                try {
                    k(a(d))
                } catch (q) {
                    h(q)
                }
            } : d
        }
        var k, h, p = new r(function(a, d) {
            k = a;
            h = d
        });
        this.callWhenSettled_(d(a, k), d(g, h));
        return p
    };
    r.prototype.catch = function(a) {
        return this.then(void 0, a)
    };
    r.prototype.callWhenSettled_ = function(a, g) {
        function d() {
            switch (k.state_) {
                case 1:
                    a(k.result_);
                    break;
                case 2:
                    g(k.result_);
                    break;
                default:
                    throw Error("Unexpected state: " + k.state_);
            }
        }
        var k = this;
        null == this.onSettledCallbacks_ ? v.asyncExecute(d) : this.onSettledCallbacks_.push(d)
    };
    r.resolve = p;
    r.reject = function(a) {
        return new r(function(d, g) {
            g(a)
        })
    };
    r.race = function(a) {
        return new r(function(d, g) {
            for (var k = $jscomp.makeIterator(a), h = k.next(); !h.done; h = k.next()) p(h.value).callWhenSettled_(d,
                g)
        })
    };
    r.all = function(a) {
        var d = $jscomp.makeIterator(a),
            g = d.next();
        return g.done ? p([]) : new r(function(a, k) {
            function h(d) {
                return function(g) {
                    f[d] = g;
                    n--;
                    0 == n && a(f)
                }
            }
            var f = [],
                n = 0;
            do f.push(void 0), n++, p(g.value).callWhenSettled_(h(f.length - 1), k), g = d.next(); while (!g.done)
        })
    };
    return r
}, "es6", "es3");
$jscomp.iteratorFromArray = function(h, g) {
    $jscomp.initSymbolIterator();
    h instanceof String && (h += "");
    var p = 0,
        a = {
            next: function() {
                if (p < h.length) {
                    var r = p++;
                    return {
                        value: g(r, h[r]),
                        done: !1
                    }
                }
                a.next = function() {
                    return {
                        done: !0,
                        value: void 0
                    }
                };
                return a.next()
            }
        };
    a[Symbol.iterator] = function() {
        return a
    };
    return a
};
$jscomp.polyfill("Array.prototype.keys", function(h) {
    return h ? h : function() {
        return $jscomp.iteratorFromArray(this, function(g) {
            return g
        })
    }
}, "es6", "es3");
$jscomp.checkStringArgs = function(h, g, p) {
    if (null == h) throw new TypeError("The 'this' value for String.prototype." + p + " must not be null or undefined");
    if (g instanceof RegExp) throw new TypeError("First argument to String.prototype." + p + " must not be a regular expression");
    return h + ""
};
$jscomp.polyfill("String.prototype.startsWith", function(h) {
    return h ? h : function(g, h) {
        var a = $jscomp.checkStringArgs(this, g, "startsWith");
        g += "";
        var p = a.length,
            v = g.length;
        h = Math.max(0, Math.min(h | 0, a.length));
        for (var d = 0; d < v && h < p;)
            if (a[h++] != g[d++]) return !1;
        return d >= v
    }
}, "es6", "es3");
$jscomp.polyfill("Array.from", function(h) {
    return h ? h : function(g, h, a) {
        h = null != h ? h : function(a) {
            return a
        };
        var p = [],
            v = "undefined" != typeof Symbol && Symbol.iterator && g[Symbol.iterator];
        if ("function" == typeof v) {
            g = v.call(g);
            for (var d = 0; !(v = g.next()).done;) p.push(h.call(a, v.value, d++))
        } else
            for (v = g.length, d = 0; d < v; d++) p.push(h.call(a, g[d], d));
        return p
    }
}, "es6", "es3");
$jscomp.polyfill("String.prototype.endsWith", function(h) {
    return h ? h : function(g, h) {
        var a = $jscomp.checkStringArgs(this, g, "endsWith");
        g += "";
        void 0 === h && (h = a.length);
        h = Math.max(0, Math.min(h | 0, a.length));
        for (var p = g.length; 0 < p && 0 < h;)
            if (a[--h] != g[--p]) return !1;
        return 0 >= p
    }
}, "es6", "es3");
(function(h) {
    var g = h._trnDebugMode || h._trnLogMode,
        p = h._logFiltersEnabled ? h._logFiltersEnabled : {};
    h.utils = h.utils ? h.utils : {};
    h.utils.warn = function(a, h) {
        h || (h = a, a = "default");
        g && p[a] && console.warn(a + ": " + h)
    };
    h.utils.log = function(a, h) {
        h || (h = a, a = "default");
        g && p[a] && console.log(a + ": " + h)
    };
    h.utils.error = function(a) {
        g && console.error(a);
        throw Error(a);
    };
    h.info = function(a, g) {
        h.utils.log(a, g)
    };
    h.warn = function(a, g) {
        h.utils.warn(a, g)
    };
    h.error = function(a) {
        h.utils.error(a)
    }
})("undefined" === typeof window ? this : window);
(function(h) {
    h.MessageHandler = function(g, p) {
        this.name = g;
        this.comObj = p;
        this.callbackIndex = 1;
        this.postMessageTransfers = !0;
        this.callbacksCapabilities = {};
        g = this.actionHandler = {};
        this.actionHandlerAsync = {};
        this.nextAsync = null;
        this.userCallbacks = {};
        this.pdfnetCommandChain = null;
        this.pdfnetActiveCommands = new Set;
        g.console_log = [function(a) {
            h.utils.log(a)
        }];
        g.console_error = [function(a) {
            h.utils.error(a)
        }];
        g.workerLoaded = [function(a) {}];
        p.addEventListener("message", this.handleMessage.bind(this));
        p.addEventListener("userCallback",
            this.handleUserCallBack.bind(this))
    };
    h.MessageHandler.prototype = {
        on: function(g, p, a) {
            var r = this.actionHandler;
            r[g] && h.utils.error('There is already an actionName called "' + g + '"');
            r[g] = [p, a]
        },
        replace: function(g, h, a) {
            this.actionHandler[g] = [h, a]
        },
        onAsync: function(g, p, a) {
            var r = this.actionHandlerAsync;
            r[g] && h.utils.error('There is already an actionName called "' + g + '"');
            r[g] = [p, a]
        },
        replaceAsync: function(g, h, a) {
            var p = this.actionHandlerAsync,
                v = this.actionHandler;
            v[g] && delete v[g];
            p[g] = [h, a]
        },
        onNextAsync: function(g) {
            this.nextAsync =
                g
        },
        send: function(g, h) {
            this.postMessage({
                action: g,
                data: h
            })
        },
        getNextId: function() {
            return this.callbackIndex++
        },
        sendWithPromise: function(g, h, a) {
            var p = this.getNextId();
            g = {
                action: g,
                data: h,
                callbackId: p,
                priority: a
            };
            h = createPromiseCapability();
            this.callbacksCapabilities[p] = h;
            try {
                this.postMessage(g)
            } catch (v) {
                h.reject(v)
            }
            return h.promise
        },
        sendWithPromiseReturnId: function(g, h, a) {
            var p = this.getNextId();
            g = {
                action: g,
                data: h,
                callbackId: p,
                priority: a
            };
            h = createPromiseCapability();
            this.callbacksCapabilities[p] = h;
            try {
                this.postMessage(g)
            } catch (v) {
                h.reject(v)
            }
            return {
                promise: h.promise,
                callbackId: p
            }
        },
        sendWithPromiseWithId: function(g, p, a, r) {
            p > this.callbackIndex && h.utils.error("Can't reuse callbackId " + p + " lesser than callbackIndex " + this.callbackIndex);
            p in this.callbacksCapabilities && h.utils.error("Can't reuse callbackId " + p + ". There is a capability waiting to be resolved. ");
            g = {
                action: g,
                data: a,
                callbackId: p
            };
            a = createPromiseCapability();
            this.callbacksCapabilities[p] = a;
            try {
                this.postMessage(g)
            } catch (v) {
                a.reject(v)
            }
            return a.promise
        },
        sendError: function(g, h) {
            if (g.message || g.errorData) {
                g.message &&
                    g.message.message && (g.message = g.message.message);
                var a = g.errorData;
                g = {
                    type: g.type ? g.type : "JavascriptError",
                    message: g.message
                };
                if (a)
                    for (var p in a) a.hasOwnProperty(p) && (g[p] = a[p])
            }
            this.postMessage({
                isReply: !0,
                callbackId: h,
                error: g
            })
        },
        getPromise: function(g) {
            if (g in this.callbacksCapabilities) return this.callbacksCapabilities[g];
            h.utils.error("Cannot get promise for callback " + g)
        },
        cancelPromise: function(g) {
            if (g in this.callbacksCapabilities) {
                var p = this.callbacksCapabilities[g];
                delete this.callbacksCapabilities[g];
                this.pdfnetActiveCommands.has(g) && this.pdfnetActiveCommands.delete(g);
                p.reject({
                    type: "Cancelled",
                    message: "Request has been cancelled."
                });
                this.postMessage({
                    action: "actionCancel",
                    data: {
                        callbackId: g
                    }
                })
            } else h.utils.warn("Cannot cancel callback " + g)
        },
        postMessage: function(g) {
            if (this.postMessageTransfers) {
                var h = this.getTransfersArray(g);
                this.comObj.postMessage(g, h)
            } else this.comObj.postMessage(g)
        },
        getObjectTransfers: function(g, h) {
            if ("object" === typeof g)
                if (g instanceof Uint8Array) h.push(g.buffer);
                else if (g instanceof ArrayBuffer) h.push(g);
            else
                for (var a in g) g.hasOwnProperty(a) && this.getObjectTransfers(g[a], h)
        },
        getTransfersArray: function(g) {
            var h = [];
            this.getObjectTransfers(g, h);
            return 0 === h.length ? void 0 : h
        },
        handleMessage: function(g) {
            var p = this,
                a = g.data,
                r = this.actionHandler,
                v = this.actionHandlerAsync;
            g = this.callbacksCapabilities;
            var d = this.pdfnetActiveCommands;
            if (a.isReply) r = a.callbackId, r in g ? (v = g[r], delete g[r], d.has(r) && d.delete(r), "error" in a ? v.reject(a.error) : v.resolve(a.data)) : h.utils.warn("Cannot resolve callback " +
                r);
            else if (a.action in r) {
                var k = r[a.action];
                a.callbackId ? Promise.resolve().then(function() {
                    return k[0].call(k[1], a.data)
                }).then(function(d) {
                    p.postMessage({
                        isReply: !0,
                        callbackId: a.callbackId,
                        data: d
                    })
                }, function(d) {
                    p.sendError(d, a.callbackId)
                }) : k[0].call(k[1], a.data)
            } else a.action in v ? (k = v[a.action], a.callbackId ? k[0].call(k[1], a).then(function(d) {
                p.postMessage({
                    isReply: !0,
                    callbackId: a.callbackId,
                    data: d
                });
                p.nextAsync()
            }, function(d) {
                p.sendError(d, a.callbackId);
                p.nextAsync()
            }) : k[0].call(k[1], a).then(function() {
                    p.nextAsync()
                },
                function() {
                    p.nextAsync()
                })) : h.utils.error("Unknown action from worker: " + a.action)
        },
        handleUserCallBack: function(g) {
            g = g.data;
            var h = this.userCallbacks[g.callback_name];
            h.callback(g.args, h.data)
        }
    }
})("undefined" === typeof window ? this : window);
(function(h) {
    h.utils = h.utils || {};
    h.utils.isJSWorker = !0;
    h.utils.isNodeJS = !0;
    h.jsworker = {
        loadWorker: function() {
            try {
                var g = require("./addon")
            } catch (p) {
                if ("object" === typeof p && Object.keys(p).length) throw p;
                throw {
                    addon: "" + p
                };
            }
            g.getWorkerType = function() {
                return "node"
            };
            return g
        },
        utils: {
            getResourcesDir: function(g) {
                g(null, "./pdfnet.res")
            }
        }
    }
})("undefined" === typeof window ? this : window);
var XMLHttpRequest = require("xhr2").XMLHttpRequest;
(function(h) {
    function g() {
        return {
            putBool: function(a, c, e) {
                if (!1 !== e && !0 !== e) throw new TypeError("An boolean value is expected for putBool");
                a[c] = e
            },
            putNumber: function(a, c, e) {
                a[c] = 0 + e
            },
            jsColorToNumber: function(a) {
                return 4278190080 + 65536 * Math.floor(a.R) + 256 * Math.floor(a.G) + Math.floor(a.B)
            },
            jsColorFromNumber: function(a) {
                return {
                    A: 5.9604644775390625E-8 * a & 255,
                    R: ((a | 0) & 16711680) >>> 16,
                    G: ((a | 0) & 65280) >>> 8,
                    B: (a | 0) & 255
                }
            }
        }
    }

    function p(a) {
        function b(c) {
            c = a.next(c);
            var e = c.value;
            return c.done ? c.value : e.then(b)
        }
        return Promise.resolve().then(b)
    }
    var a = h.PDFNet ? h.PDFNet : {};
    a.Convert = h.PDFNet && h.PDFNet.Convert ? h.PDFNet.Convert : {};
    a.Optimizer = {};
    h.CoreControls && h.CoreControls.enableFullPDF();
    h.isArrayBuffer = function(a) {
        return a instanceof ArrayBuffer || null != a && null != a.constructor && "ArrayBuffer" === a.constructor.name && "number" === typeof a.byteLength
    };
    a.Destroyable = function() {
        if (this.constructor === a.Destroyable) throw Error("Can't instantiate abstract class!");
    };
    a.Destroyable.prototype.takeOwnership = function() {
        t(this.id)
    };
    a.Destroyable.prototype.destroy =
        function() {
            this.takeOwnership();
            return a.sendWithPromise(this.name + ".destroy", {
                auto_dealloc_obj: this.id
            })
        };
    a.Action = function(a) {
        this.name = "Action";
        this.id = a
    };
    a.ActionParameter = function(a) {
        this.name = "ActionParameter";
        this.id = a
    };
    a.ActionParameter.prototype = Object.create(a.Destroyable.prototype);
    a.AdvancedImagingModule = function(a) {
        this.name = "AdvancedImagingModule";
        this.id = a
    };
    a.Annot = function(a) {
        this.name = "Annot";
        this.id = a
    };
    a.AnnotBorderStyle = function(a) {
        this.name = "AnnotBorderStyle";
        this.id = a
    };
    a.AnnotBorderStyle.prototype =
        Object.create(a.Destroyable.prototype);
    a.AttrObj = function(a) {
        this.name = "AttrObj";
        this.id = a
    };
    a.Bookmark = function(a) {
        this.name = "Bookmark";
        this.id = a
    };
    a.ByteRange = function(b, c) {
        this.name = "ByteRange";
        if (b && "undefined" === typeof c) q(b, this);
        else return "undefined" === typeof b && (b = 0), "undefined" === typeof c && (c = 0), new a.ByteRange({
            m_offset: b,
            m_size: c
        })
    };
    a.CADModule = function(a) {
        this.name = "CADModule";
        this.id = a
    };
    a.CaretAnnot = function(a) {
        this.name = "CaretAnnot";
        this.id = a
    };
    a.CheckBoxWidget = function(a) {
        this.name = "CheckBoxWidget";
        this.id = a
    };
    a.ChunkRenderer = function(a) {
        this.name = "ChunkRenderer";
        this.id = a
    };
    a.CircleAnnot = function(a) {
        this.name = "CircleAnnot";
        this.id = a
    };
    a.ClassMap = function(a) {
        this.name = "ClassMap";
        this.id = a
    };
    a.ColorPt = function(a) {
        this.name = "ColorPt";
        this.id = a
    };
    a.ColorPt.prototype = Object.create(a.Destroyable.prototype);
    a.ColorSpace = function(a) {
        this.name = "ColorSpace";
        this.id = a
    };
    a.ColorSpace.prototype = Object.create(a.Destroyable.prototype);
    a.ComboBoxWidget = function(a) {
        this.name = "ComboBoxWidget";
        this.id = a
    };
    a.ContentItem =
        function(b, c) {
            this.name = "ContentItem";
            if (b && "undefined" === typeof c) q(b, this);
            else return "undefined" === typeof b && (b = "0"), "undefined" === typeof c && (c = "0"), new a.ContentItem({
                o: b,
                p: c
            })
        };
    a.ContentReplacer = function(a) {
        this.name = "ContentReplacer";
        this.id = a
    };
    a.ContentReplacer.prototype = Object.create(a.Destroyable.prototype);
    a.ConversionMonitor = function(a) {
        this.name = "ConversionMonitor";
        this.id = a
    };
    a.ConversionMonitor.prototype = Object.create(a.Destroyable.prototype);
    a.Date = function(b, c, e, d, w, f, g, h, k, l) {
        this.name =
            "Date";
        if (b && "undefined" === typeof c) q(b, this);
        else return "undefined" === typeof b && (b = 0), "undefined" === typeof c && (c = 0), "undefined" === typeof e && (e = 0), "undefined" === typeof d && (d = 0), "undefined" === typeof w && (w = 0), "undefined" === typeof f && (f = 0), "undefined" === typeof g && (g = 0), "undefined" === typeof h && (h = 0), "undefined" === typeof k && (k = 0), "undefined" === typeof l && (l = "0"), new a.Date({
            year: b,
            month: c,
            day: e,
            hour: d,
            minute: w,
            second: f,
            UT: g,
            UT_hour: h,
            UT_minutes: k,
            mp_obj: l
        })
    };
    a.Destination = function(a) {
        this.name = "Destination";
        this.id = a
    };
    a.DictIterator = function(a) {
        this.name = "DictIterator";
        this.id = a
    };
    a.DictIterator.prototype = Object.create(a.Destroyable.prototype);
    a.DigestAlgorithm = function(a) {
        this.name = "DigestAlgorithm";
        this.id = a
    };
    a.DigitalSignatureField = function(b) {
        this.name = "DigitalSignatureField";
        if ("object" === typeof b) q(b, this);
        else if ("undefined" !== typeof b) return new a.DigitalSignatureField({
            mp_field_dict_obj: b
        })
    };
    a.DisallowedChange = function(a) {
        this.name = "DisallowedChange";
        this.id = a
    };
    a.DisallowedChange.prototype = Object.create(a.Destroyable.prototype);
    a.DocSnapshot = function(a) {
        this.name = "DocSnapshot";
        this.id = a
    };
    a.DocSnapshot.prototype = Object.create(a.Destroyable.prototype);
    a.DocumentConversion = function(a) {
        this.name = "DocumentConversion";
        this.id = a
    };
    a.DocumentConversion.prototype = Object.create(a.Destroyable.prototype);
    a.Element = function(a) {
        this.name = "Element";
        this.id = a
    };
    a.ElementBuilder = function(a) {
        this.name = "ElementBuilder";
        this.id = a
    };
    a.ElementBuilder.prototype = Object.create(a.Destroyable.prototype);
    a.ElementReader = function(a) {
        this.name = "ElementReader";
        this.id = a
    };
    a.ElementReader.prototype = Object.create(a.Destroyable.prototype);
    a.ElementWriter = function(a) {
        this.name = "ElementWriter";
        this.id = a
    };
    a.ElementWriter.prototype = Object.create(a.Destroyable.prototype);
    a.EmbeddedTimestampVerificationResult = function(a) {
        this.name = "EmbeddedTimestampVerificationResult";
        this.id = a
    };
    a.EmbeddedTimestampVerificationResult.prototype = Object.create(a.Destroyable.prototype);
    a.FDFDoc = function(a) {
        this.name = "FDFDoc";
        this.id = a
    };
    a.FDFDoc.prototype = Object.create(a.Destroyable.prototype);
    a.FDFField = function(b, c) {
        this.name = "FDFField";
        if (b && "undefined" === typeof c) q(b, this);
        else return "undefined" === typeof b && (b = "0"), "undefined" === typeof c && (c = "0"), new a.FDFField({
            mp_leaf_node: b,
            mp_root_array: c
        })
    };
    a.Field = function(b, c) {
        this.name = "Field";
        if (b && "undefined" === typeof c) q(b, this);
        else return "undefined" === typeof b && (b = "0"), "undefined" === typeof c && (c = "0"), new a.Field({
            leaf_node: b,
            builder: c
        })
    };
    a.FileAttachmentAnnot = function(a) {
        this.name = "FileAttachmentAnnot";
        this.id = a
    };
    a.FileSpec = function(a) {
        this.name =
            "FileSpec";
        this.id = a
    };
    a.Filter = function(a) {
        this.name = "Filter";
        this.id = a
    };
    a.Filter.prototype = Object.create(a.Destroyable.prototype);
    a.FilterReader = function(a) {
        this.name = "FilterReader";
        this.id = a
    };
    a.FilterReader.prototype = Object.create(a.Destroyable.prototype);
    a.FilterWriter = function(a) {
        this.name = "FilterWriter";
        this.id = a
    };
    a.FilterWriter.prototype = Object.create(a.Destroyable.prototype);
    a.Flattener = function(a) {
        this.name = "Flattener";
        this.id = a
    };
    a.Flattener.prototype = Object.create(a.Destroyable.prototype);
    a.Font = function(a) {
        this.name = "Font";
        this.id = a
    };
    a.Font.prototype = Object.create(a.Destroyable.prototype);
    a.FreeTextAnnot = function(a) {
        this.name = "FreeTextAnnot";
        this.id = a
    };
    a.Function = function(a) {
        this.name = "Function";
        this.id = a
    };
    a.Function.prototype = Object.create(a.Destroyable.prototype);
    a.GState = function(a) {
        this.name = "GState";
        this.id = a
    };
    a.GeometryCollection = function(a) {
        this.name = "GeometryCollection";
        this.id = a
    };
    a.GeometryCollection.prototype = Object.create(a.Destroyable.prototype);
    a.HTML2PDF = function(a) {
        this.name =
            "HTML2PDF";
        this.id = a
    };
    a.HTML2PDF.prototype = Object.create(a.Destroyable.prototype);
    a.HTML2PDF.Proxy = function(a) {
        this.name = "HTML2PDF.Proxy";
        this.id = a
    };
    a.HTML2PDF.Proxy.prototype = Object.create(a.Destroyable.prototype);
    a.HTML2PDF.TOCSettings = function(a) {
        this.name = "HTML2PDF.TOCSettings";
        this.id = a
    };
    a.HTML2PDF.TOCSettings.prototype = Object.create(a.Destroyable.prototype);
    a.HTML2PDF.WebPageSettings = function(a) {
        this.name = "HTML2PDF.WebPageSettings";
        this.id = a
    };
    a.HTML2PDF.WebPageSettings.prototype = Object.create(a.Destroyable.prototype);
    a.HighlightAnnot = function(a) {
        this.name = "HighlightAnnot";
        this.id = a
    };
    a.Highlights = function(a) {
        this.name = "Highlights";
        this.id = a
    };
    a.Highlights.prototype = Object.create(a.Destroyable.prototype);
    a.Image = function(a) {
        this.name = "Image";
        this.id = a
    };
    a.InkAnnot = function(a) {
        this.name = "InkAnnot";
        this.id = a
    };
    a.Iterator = function(a, c) {
        this.name = "Iterator";
        this.id = a;
        this.type = c
    };
    a.Iterator.prototype = Object.create(a.Destroyable.prototype);
    a.KeyStrokeActionResult = function(a) {
        this.name = "KeyStrokeActionResult";
        this.id = a
    };
    a.KeyStrokeActionResult.prototype = Object.create(a.Destroyable.prototype);
    a.KeyStrokeEventData = function(a) {
        this.name = "KeyStrokeEventData";
        this.id = a
    };
    a.KeyStrokeEventData.prototype = Object.create(a.Destroyable.prototype);
    a.LineAnnot = function(a) {
        this.name = "LineAnnot";
        this.id = a
    };
    a.LinkAnnot = function(a) {
        this.name = "LinkAnnot";
        this.id = a
    };
    a.ListBoxWidget = function(a) {
        this.name = "ListBoxWidget";
        this.id = a
    };
    a.MarkupAnnot = function(a) {
        this.name = "MarkupAnnot";
        this.id = a
    };
    a.Matrix2D = function(b, c, e, d, f, g) {
        this.name =
            "Matrix2D";
        if (b && "undefined" === typeof c) q(b, this);
        else return "undefined" === typeof b && (b = 0), "undefined" === typeof c && (c = 0), "undefined" === typeof e && (e = 0), "undefined" === typeof d && (d = 0), "undefined" === typeof f && (f = 0), "undefined" === typeof g && (g = 0), new a.Matrix2D({
            m_a: b,
            m_b: c,
            m_c: e,
            m_d: d,
            m_h: f,
            m_v: g
        })
    };
    a.MovieAnnot = function(a) {
        this.name = "MovieAnnot";
        this.id = a
    };
    a.NameTree = function(a) {
        this.name = "NameTree";
        this.id = a
    };
    a.NumberTree = function(a) {
        this.name = "NumberTree";
        this.id = a
    };
    a.OCG = function(a) {
        this.name = "OCG";
        this.id = a
    };
    a.OCGConfig = function(a) {
        this.name = "OCGConfig";
        this.id = a
    };
    a.OCGContext = function(a) {
        this.name = "OCGContext";
        this.id = a
    };
    a.OCGContext.prototype = Object.create(a.Destroyable.prototype);
    a.OCMD = function(a) {
        this.name = "OCMD";
        this.id = a
    };
    a.OCRModule = function(a) {
        this.name = "OCRModule";
        this.id = a
    };
    a.Obj = function(a) {
        this.name = "Obj";
        this.id = a
    };
    a.ObjSet = function(a) {
        this.name = "ObjSet";
        this.id = a
    };
    a.ObjSet.prototype = Object.create(a.Destroyable.prototype);
    a.ObjectIdentifier = function(a) {
        this.name = "ObjectIdentifier";
        this.id = a
    };
    a.ObjectIdentifier.prototype = Object.create(a.Destroyable.prototype);
    a.OwnedBitmap = function(a) {
        this.name = "OwnedBitmap";
        this.id = a
    };
    a.PDF2HtmlReflowParagraphsModule = function(a) {
        this.name = "PDF2HtmlReflowParagraphsModule";
        this.id = a
    };
    a.PDF2WordModule = function(a) {
        this.name = "PDF2WordModule";
        this.id = a
    };
    a.PDFACompliance = function(a) {
        this.name = "PDFACompliance";
        this.id = a
    };
    a.PDFACompliance.prototype = Object.create(a.Destroyable.prototype);
    a.PDFDC = function(a) {
        this.name = "PDFDC";
        this.id = a
    };
    a.PDFDCEX = function(a) {
        this.name =
            "PDFDCEX";
        this.id = a
    };
    a.PDFDoc = function(a) {
        this.name = "PDFDoc";
        this.id = a
    };
    a.PDFDoc.prototype = Object.create(a.Destroyable.prototype);
    a.PDFDocInfo = function(a) {
        this.name = "PDFDocInfo";
        this.id = a
    };
    a.PDFDocViewPrefs = function(a) {
        this.name = "PDFDocViewPrefs";
        this.id = a
    };
    a.PDFDraw = function(a) {
        this.name = "PDFDraw";
        this.id = a
    };
    a.PDFDraw.prototype = Object.create(a.Destroyable.prototype);
    a.PDFRasterizer = function(a) {
        this.name = "PDFRasterizer";
        this.id = a
    };
    a.PDFRasterizer.prototype = Object.create(a.Destroyable.prototype);
    a.PDFTronCustomSecurityHandler =
        function(a) {
            this.name = "PDFTronCustomSecurityHandler";
            this.id = a
        };
    a.PDFView = function(a) {
        this.name = "PDFView";
        this.id = a
    };
    a.PDFViewCtrl = function(a) {
        this.name = "PDFViewCtrl";
        this.id = a
    };
    a.Page = function(a) {
        this.name = "Page";
        this.id = a
    };
    a.PageLabel = function(b, c, e) {
        this.name = "PageLabel";
        if (b && "undefined" === typeof c) q(b, this);
        else return "undefined" === typeof b && (b = "0"), "undefined" === typeof c && (c = 0), "undefined" === typeof e && (e = 0), new a.PageLabel({
            mp_obj: b,
            m_first_page: c,
            m_last_page: e
        })
    };
    a.PageSet = function(a) {
        this.name =
            "PageSet";
        this.id = a
    };
    a.PageSet.prototype = Object.create(a.Destroyable.prototype);
    a.PatternColor = function(a) {
        this.name = "PatternColor";
        this.id = a
    };
    a.PatternColor.prototype = Object.create(a.Destroyable.prototype);
    a.PolyLineAnnot = function(a) {
        this.name = "PolyLineAnnot";
        this.id = a
    };
    a.PolygonAnnot = function(a) {
        this.name = "PolygonAnnot";
        this.id = a
    };
    a.PopupAnnot = function(a) {
        this.name = "PopupAnnot";
        this.id = a
    };
    a.PrinterMode = function(a) {
        this.name = "PrinterMode";
        this.id = a
    };
    a.PushButtonWidget = function(a) {
        this.name = "PushButtonWidget";
        this.id = a
    };
    a.RadioButtonGroup = function(a) {
        this.name = "RadioButtonGroup";
        this.id = a
    };
    a.RadioButtonGroup.prototype = Object.create(a.Destroyable.prototype);
    a.RadioButtonWidget = function(a) {
        this.name = "RadioButtonWidget";
        this.id = a
    };
    a.Rect = function(b, c, e, d, f) {
        this.name = "Rect";
        if (b && "undefined" === typeof c) q(b, this);
        else return "undefined" === typeof b && (b = 0), "undefined" === typeof c && (c = 0), "undefined" === typeof e && (e = 0), "undefined" === typeof d && (d = 0), "undefined" === typeof f && (f = "0"), new a.Rect({
            x1: b,
            y1: c,
            x2: e,
            y2: d,
            mp_rect: f
        })
    };
    a.Redaction = function(a) {
        this.name = "Redaction";
        this.id = a
    };
    a.RedactionAnnot = function(a) {
        this.name = "RedactionAnnot";
        this.id = a
    };
    a.Redactor = function(a) {
        this.name = "Redactor";
        this.id = a
    };
    a.Reflow = function(a) {
        this.name = "Reflow";
        this.id = a
    };
    a.Reflow.prototype = Object.create(a.Destroyable.prototype);
    a.ResultSnapshot = function(a) {
        this.name = "ResultSnapshot";
        this.id = a
    };
    a.ResultSnapshot.prototype = Object.create(a.Destroyable.prototype);
    a.RoleMap = function(a) {
        this.name = "RoleMap";
        this.id = a
    };
    a.RubberStampAnnot =
        function(a) {
            this.name = "RubberStampAnnot";
            this.id = a
        };
    a.SDFDoc = function(a) {
        this.name = "SDFDoc";
        this.id = a
    };
    a.SElement = function(b, c) {
        this.name = "SElement";
        if (b && "undefined" === typeof c) q(b, this);
        else return "undefined" === typeof b && (b = "0"), "undefined" === typeof c && (c = "0"), new a.SElement({
            obj: b,
            k: c
        })
    };
    a.STree = function(a) {
        this.name = "STree";
        this.id = a
    };
    a.ScreenAnnot = function(a) {
        this.name = "ScreenAnnot";
        this.id = a
    };
    a.SecurityHandler = function(a) {
        this.name = "SecurityHandler";
        this.id = a
    };
    a.SecurityHandler.prototype = Object.create(a.Destroyable.prototype);
    a.Shading = function(a) {
        this.name = "Shading";
        this.id = a
    };
    a.Shading.prototype = Object.create(a.Destroyable.prototype);
    a.ShapedText = function(a) {
        this.name = "ShapedText";
        this.id = a
    };
    a.ShapedText.prototype = Object.create(a.Destroyable.prototype);
    a.SignatureHandler = function(a) {
        this.name = "SignatureHandler";
        this.id = a
    };
    a.SignatureWidget = function(a) {
        this.name = "SignatureWidget";
        this.id = a
    };
    a.SoundAnnot = function(a) {
        this.name = "SoundAnnot";
        this.id = a
    };
    a.SquareAnnot = function(a) {
        this.name = "SquareAnnot";
        this.id = a
    };
    a.SquigglyAnnot =
        function(a) {
            this.name = "SquigglyAnnot";
            this.id = a
        };
    a.Stamper = function(a) {
        this.name = "Stamper";
        this.id = a
    };
    a.Stamper.prototype = Object.create(a.Destroyable.prototype);
    a.StrikeOutAnnot = function(a) {
        this.name = "StrikeOutAnnot";
        this.id = a
    };
    a.StructuredOutputModule = function(a) {
        this.name = "StructuredOutputModule";
        this.id = a
    };
    a.TemplateDocument = function(a) {
        this.name = "TemplateDocument";
        this.id = a
    };
    a.TemplateDocument.prototype = Object.create(a.Destroyable.prototype);
    a.TextAnnot = function(a) {
        this.name = "TextAnnot";
        this.id =
            a
    };
    a.TextExtractor = function(a) {
        this.name = "TextExtractor";
        this.id = a
    };
    a.TextExtractor.prototype = Object.create(a.Destroyable.prototype);
    a.TextExtractorLine = function(b, c, e, d, f, g) {
        this.name = "TextExtractorLine";
        if (b && "undefined" === typeof c) q(b, this);
        else return "undefined" === typeof b && (b = "0"), "undefined" === typeof c && (c = "0"), "undefined" === typeof e && (e = 0), "undefined" === typeof d && (d = 0), "undefined" === typeof f && (f = 0), "undefined" === typeof g && (g = "0"), new a.TextExtractorLine({
            line: b,
            uni: c,
            num: e,
            cur_num: d,
            m_direction: f,
            mp_bld: g
        })
    };
    a.TextExtractorStyle = function(b) {
        this.name = "TextExtractorStyle";
        if ("object" === typeof b) q(b, this);
        else if ("undefined" !== typeof b) return new a.TextExtractorStyle({
            mp_imp: b
        })
    };
    a.TextExtractorWord = function(b, c, e, d, f, g) {
        this.name = "TextExtractorWord";
        if (b && "undefined" === typeof c) q(b, this);
        else return "undefined" === typeof b && (b = "0"), "undefined" === typeof c && (c = "0"), "undefined" === typeof e && (e = "0"), "undefined" === typeof d && (d = 0), "undefined" === typeof f && (f = 0), "undefined" === typeof g && (g = "0"), new a.TextExtractorWord({
            line: b,
            word: c,
            uni: e,
            num: d,
            cur_num: f,
            mp_bld: g
        })
    };
    a.TextMarkupAnnot = function(a) {
        this.name = "TextMarkupAnnot";
        this.id = a
    };
    a.TextRange = function(a) {
        this.name = "TextRange";
        this.id = a
    };
    a.TextSearch = function(a) {
        this.name = "TextSearch";
        this.id = a
    };
    a.TextSearch.prototype = Object.create(a.Destroyable.prototype);
    a.TextWidget = function(a) {
        this.name = "TextWidget";
        this.id = a
    };
    a.TimestampingConfiguration = function(a) {
        this.name = "TimestampingConfiguration";
        this.id = a
    };
    a.TimestampingConfiguration.prototype = Object.create(a.Destroyable.prototype);
    a.TimestampingResult = function(a) {
        this.name = "TimestampingResult";
        this.id = a
    };
    a.TimestampingResult.prototype = Object.create(a.Destroyable.prototype);
    a.TrustVerificationResult = function(a) {
        this.name = "TrustVerificationResult";
        this.id = a
    };
    a.TrustVerificationResult.prototype = Object.create(a.Destroyable.prototype);
    a.UnderlineAnnot = function(a) {
        this.name = "UnderlineAnnot";
        this.id = a
    };
    a.UndoManager = function(a) {
        this.name = "UndoManager";
        this.id = a
    };
    a.UndoManager.prototype = Object.create(a.Destroyable.prototype);
    a.VerificationOptions =
        function(a) {
            this.name = "VerificationOptions";
            this.id = a
        };
    a.VerificationOptions.prototype = Object.create(a.Destroyable.prototype);
    a.VerificationResult = function(a) {
        this.name = "VerificationResult";
        this.id = a
    };
    a.VerificationResult.prototype = Object.create(a.Destroyable.prototype);
    a.ViewChangeCollection = function(a) {
        this.name = "ViewChangeCollection";
        this.id = a
    };
    a.ViewChangeCollection.prototype = Object.create(a.Destroyable.prototype);
    a.WatermarkAnnot = function(a) {
        this.name = "WatermarkAnnot";
        this.id = a
    };
    a.WebFontDownloader =
        function(a) {
            this.name = "WebFontDownloader";
            this.id = a
        };
    a.WidgetAnnot = function(a) {
        this.name = "WidgetAnnot";
        this.id = a
    };
    a.X501AttributeTypeAndValue = function(a) {
        this.name = "X501AttributeTypeAndValue";
        this.id = a
    };
    a.X501AttributeTypeAndValue.prototype = Object.create(a.Destroyable.prototype);
    a.X501DistinguishedName = function(a) {
        this.name = "X501DistinguishedName";
        this.id = a
    };
    a.X501DistinguishedName.prototype = Object.create(a.Destroyable.prototype);
    a.X509Certificate = function(a) {
        this.name = "X509Certificate";
        this.id = a
    };
    a.X509Certificate.prototype = Object.create(a.Destroyable.prototype);
    a.X509Extension = function(a) {
        this.name = "X509Extension";
        this.id = a
    };
    a.X509Extension.prototype = Object.create(a.Destroyable.prototype);
    a.PDFDoc.createRefreshOptions = function() {
        return Promise.resolve(new a.PDFDoc.RefreshOptions)
    };
    a.PDFDoc.RefreshOptions = function() {
        this.mImpl = {};
        this.mHelpers = g()
    };
    a.PDFDoc.RefreshOptions.prototype.getDrawBackgroundOnly = function() {
        return "DrawBackgroundOnly" in mImpl ? !!mImpl.DrawBackgroundOnly : !0
    };
    a.PDFDoc.RefreshOptions.prototype.setDrawBackgroundOnly =
        function(a) {
            mHelpers.putBool(mImpl, "DrawBackgroundOnly", a);
            return this
        };
    a.PDFDoc.RefreshOptions.prototype.getRefreshExisting = function() {
        return "RefreshExisting" in mImpl ? !!mImpl.RefreshExisting : !0
    };
    a.PDFDoc.RefreshOptions.prototype.setRefreshExisting = function(a) {
        mHelpers.putBool(mImpl, "RefreshExisting", a);
        return this
    };
    a.PDFDoc.RefreshOptions.prototype.getUseNonStandardRotation = function() {
        return "UseNonStandardRotation" in mImpl ? !!mImpl.UseNonStandardRotation : !1
    };
    a.PDFDoc.RefreshOptions.prototype.setUseNonStandardRotation =
        function(a) {
            mHelpers.putBool(mImpl, "UseNonStandardRotation", a);
            return this
        };
    a.PDFDoc.RefreshOptions.prototype.getUseRoundedCorners = function() {
        return "UseRoundedCorners" in mImpl ? !!mImpl.UseRoundedCorners : !1
    };
    a.PDFDoc.RefreshOptions.prototype.setUseRoundedCorners = function(a) {
        mHelpers.putBool(mImpl, "UseRoundedCorners", a);
        return this
    };
    a.PDFDoc.RefreshOptions.prototype.getJsonString = function() {
        return JSON.stringify(this.mImpl)
    };
    a.createRefreshOptions = a.PDFDoc.createRefreshOptions;
    a.RefreshOptions = a.PDFDoc.RefreshOptions;
    a.PDFDoc.createDiffOptions = function() {
        return Promise.resolve(new a.PDFDoc.DiffOptions)
    };
    a.PDFDoc.DiffOptions = function() {
        this.mImpl = {};
        this.mHelpers = g()
    };
    a.PDFDoc.DiffOptions.prototype.getAddGroupAnnots = function() {
        return "AddGroupAnnots" in this.mImpl ? !!this.mImpl.AddGroupAnnots : !1
    };
    a.PDFDoc.DiffOptions.prototype.setAddGroupAnnots = function(a) {
        this.mHelpers.putBool(this.mImpl, "AddGroupAnnots", a);
        return this
    };
    a.PDFDoc.DiffOptions.prototype.getBlendMode = function() {
        return "BlendMode" in this.mImpl ? this.mImpl.BlendMode :
            5
    };
    a.PDFDoc.DiffOptions.prototype.setBlendMode = function(a) {
        this.mHelpers.putNumber(this.mImpl, "BlendMode", a);
        return this
    };
    a.PDFDoc.DiffOptions.prototype.getColorA = function() {
        return "ColorA" in this.mImpl ? this.mHelpers.jsColorFromNumber(this.mImpl.ColorA) : this.mHelpers.jsColorFromNumber(4291559424)
    };
    a.PDFDoc.DiffOptions.prototype.setColorA = function(a) {
        this.mHelpers.putNumber(this.mImpl, "ColorA", this.mHelpers.jsColorToNumber(a));
        return this
    };
    a.PDFDoc.DiffOptions.prototype.getColorB = function() {
        return "ColorB" in
            this.mImpl ? this.mHelpers.jsColorFromNumber(this.mImpl.ColorB) : this.mHelpers.jsColorFromNumber(4278242508)
    };
    a.PDFDoc.DiffOptions.prototype.setColorB = function(a) {
        this.mHelpers.putNumber(this.mImpl, "ColorB", this.mHelpers.jsColorToNumber(a));
        return this
    };
    a.PDFDoc.DiffOptions.prototype.getLuminosityCompression = function() {
        return "LuminosityCompression" in this.mImpl ? this.mImpl.LuminosityCompression : 10
    };
    a.PDFDoc.DiffOptions.prototype.setLuminosityCompression = function(a) {
        this.mHelpers.putNumber(this.mImpl,
            "LuminosityCompression", a);
        return this
    };
    a.PDFDoc.DiffOptions.prototype.getJsonString = function() {
        return JSON.stringify(this.mImpl)
    };
    a.createDiffOptions = a.PDFDoc.createDiffOptions;
    a.DiffOptions = a.PDFDoc.DiffOptions;
    a.PDFDoc.createTextDiffOptions = function() {
        return Promise.resolve(new a.PDFDoc.TextDiffOptions)
    };
    a.PDFDoc.TextDiffOptions = function() {
        this.name = "PDFNet.PDFDoc.TextDiffOptions";
        this.mImpl = {};
        this.mHelpers = g()
    };
    a.PDFDoc.TextDiffOptions.prototype.getColorA = function() {
        return "ColorA" in this.mImpl ?
            this.mHelpers.jsColorFromNumber(this.mImpl.ColorA) : this.mHelpers.jsColorFromNumber(4293284423)
    };
    a.PDFDoc.TextDiffOptions.prototype.setColorA = function(a) {
        this.mHelpers.putNumber(this.mImpl, "ColorA", this.mHelpers.jsColorToNumber(a));
        return this
    };
    a.PDFDoc.TextDiffOptions.prototype.getOpacityA = function() {
        return "OpacityA" in this.mImpl ? this.mImpl.OpacityA : .5
    };
    a.PDFDoc.TextDiffOptions.prototype.setOpacityA = function(a) {
        this.mHelpers.putNumber(this.mImpl, "OpacityA", a);
        return this
    };
    a.PDFDoc.TextDiffOptions.prototype.getColorB =
        function() {
            return "ColorB" in this.mImpl ? this.mHelpers.jsColorFromNumber(this.mImpl.ColorB) : this.mHelpers.jsColorFromNumber(4284278322)
        };
    a.PDFDoc.TextDiffOptions.prototype.setColorB = function(a) {
        this.mHelpers.putNumber(this.mImpl, "ColorB", this.mHelpers.jsColorToNumber(a));
        return this
    };
    a.PDFDoc.TextDiffOptions.prototype.getCompareUsingZOrder = function() {
        return "CompareUsingZOrder" in this.mImpl ? !!this.mImpl.CompareUsingZOrder : !1
    };
    a.PDFDoc.TextDiffOptions.prototype.setCompareUsingZOrder = function(a) {
        this.mHelpers.putBool(this.mImpl,
            "CompareUsingZOrder", a);
        return this
    };
    a.PDFDoc.TextDiffOptions.prototype.getOpacityB = function() {
        return "OpacityB" in this.mImpl ? this.mImpl.OpacityB : .5
    };
    a.PDFDoc.TextDiffOptions.prototype.setOpacityB = function(a) {
        this.mHelpers.putNumber(this.mImpl, "OpacityB", a);
        return this
    };
    a.PDFDoc.TextDiffOptions.prototype.addZonesForPage = function(a, c, e) {
        "undefined" === typeof this.mImpl[a] && (this.mImpl[a] = []);
        if (this.mImpl[a].length < e)
            for (var b = this.mImpl[a].length; b < e; b++) this.mImpl[a].push([]);
        c = c.map(function(a) {
            return [a.x1,
                a.y1, a.x2, a.y2
            ]
        });
        this.mImpl[a][e - 1] = c
    };
    a.PDFDoc.TextDiffOptions.prototype.addIgnoreZonesForPage = function(a, c) {
        this.addZonesForPage("IgnoreZones", a, c);
        return this
    };
    a.PDFDoc.TextDiffOptions.prototype.getJsonString = function() {
        return JSON.stringify(this.mImpl)
    };
    a.FDFDoc.createXFDFExportOptions = function() {
        return Promise.resolve(new a.FDFDoc.XFDFExportOptions)
    };
    a.FDFDoc.XFDFExportOptions = function() {
        this.name = "PDFNet.FDFDoc.XFDFExportOptions";
        this.mImpl = {};
        this.mHelpers = g()
    };
    a.FDFDoc.XFDFExportOptions.prototype.getWriteAnnotationAppearance =
        function() {
            return "WriteAnnotationAppearance" in this.mImpl ? !!this.mImpl.WriteAnnotationAppearance : !1
        };
    a.FDFDoc.XFDFExportOptions.prototype.setWriteAnnotationAppearance = function(a) {
        this.mHelpers.putBool(this.mImpl, "WriteAnnotationAppearance", a);
        return this
    };
    a.FDFDoc.XFDFExportOptions.prototype.getWriteImagedata = function() {
        return "WriteImagedata" in this.mImpl ? !!this.mImpl.WriteImagedata : !0
    };
    a.FDFDoc.XFDFExportOptions.prototype.setWriteImagedata = function(a) {
        this.mHelpers.putBool(this.mImpl, "WriteImagedata",
            a);
        return this
    };
    a.FDFDoc.XFDFExportOptions.prototype.getJsonString = function() {
        return JSON.stringify(this.mImpl)
    };
    a.Convert.createAdvancedImagingConvertOptions = function() {
        return Promise.resolve(new a.Convert.AdvancedImagingConvertOptions)
    };
    a.Convert.AdvancedImagingConvertOptions = function() {
        this.name = "PDFNet.Convert.AdvancedImagingConvertOptions";
        this.mImpl = {};
        this.mHelpers = g()
    };
    a.Convert.AdvancedImagingConvertOptions.prototype.getDefaultDPI = function() {
        return "DefaultDPI" in this.mImpl ? this.mImpl.DefaultDPI :
            72
    };
    a.Convert.AdvancedImagingConvertOptions.prototype.setDefaultDPI = function(a) {
        this.mHelpers.putNumber(this.mImpl, "DefaultDPI", a);
        return this
    };
    a.Convert.AdvancedImagingConvertOptions.prototype.getEnableAutoLevel = function() {
        return "EnableAutoLevel" in this.mImpl ? !!this.mImpl.EnableAutoLevel : !1
    };
    a.Convert.AdvancedImagingConvertOptions.prototype.setEnableAutoLevel = function(a) {
        this.mHelpers.putBool(this.mImpl, "EnableAutoLevel", a);
        return this
    };
    a.PDFDoc.createMergeXFDFOptions = function() {
        return Promise.resolve(new a.PDFDoc.MergeXFDFOptions)
    };
    a.PDFDoc.MergeXFDFOptions = function() {
        this.name = "PDFNet.PDFDoc.MergeXFDFOptions";
        this.mImpl = {};
        this.mHelpers = g()
    };
    a.PDFDoc.MergeXFDFOptions.prototype.getForce = function() {
        return "Force" in this.mImpl ? !!this.mImpl.Force : !1
    };
    a.PDFDoc.MergeXFDFOptions.prototype.setForce = function(a) {
        this.mHelpers.putBool(this.mImpl, "Force", a);
        return this
    };
    a.PDFDoc.MergeXFDFOptions.prototype.getJsonString = function() {
        return JSON.stringify(this.mImpl)
    };
    a.QuadPoint = function(b, c, e, d, f, g, h, k) {
        this.name = "QuadPoint";
        if (b && "undefined" ===
            typeof c) q(b, this);
        else return "undefined" === typeof b && (b = 0), "undefined" === typeof c && (c = 0), "undefined" === typeof e && (e = 0), "undefined" === typeof d && (d = 0), "undefined" === typeof f && (f = 0), "undefined" === typeof g && (g = 0), "undefined" === typeof h && (h = 0), "undefined" === typeof k && (k = 0), new a.QuadPoint({
            p1x: b,
            p1y: c,
            p2x: e,
            p2y: d,
            p3x: f,
            p3y: g,
            p4x: h,
            p4y: k
        })
    };
    a.Point = function(b, c) {
        this.name = "Point";
        if (b && "undefined" === typeof c) q(b, this);
        else return "undefined" === typeof b && (b = 0), "undefined" === typeof c && (c = 0), new a.Point({
            x: b,
            y: c
        })
    };
    a.CharData = function(a) {
        if ("undefined" === typeof a) throw new TypeError("CharData requires an object to construct with.");
        this.name = "CharData";
        q(a, this)
    };
    a.Separation = function(a) {
        if ("undefined" === typeof a) throw new TypeError("Separation requires an object to construct with.");
        this.name = "Separation";
        q(a, this)
    };
    a.Optimizer.createImageSettings = function() {
        return Promise.resolve(new a.Optimizer.ImageSettings)
    };
    a.Optimizer.ImageSettings = function() {
        this.m_max_pixels = 4294967295;
        this.m_max_dpi = 225;
        this.m_resample_dpi =
            150;
        this.m_quality = 5;
        this.m_compression_mode = a.Optimizer.ImageSettings.CompressionMode.e_retain;
        this.m_downsample_mode = a.Optimizer.ImageSettings.DownsampleMode.e_default;
        this.m_force_changes = this.m_force_recompression = !1
    };
    a.Optimizer.ImageSettings.prototype.setImageDPI = function(a, c) {
        this.m_max_dpi = a;
        this.m_resample_dpi = c;
        return this
    };
    a.Optimizer.ImageSettings.prototype.setCompressionMode = function(a) {
        this.m_compression_mode = a;
        return this
    };
    a.Optimizer.ImageSettings.prototype.setDownsampleMode = function(a) {
        this.m_downsample_mode =
            a;
        return this
    };
    a.Optimizer.ImageSettings.prototype.setQuality = function(a) {
        this.m_quality = a;
        return this
    };
    a.Optimizer.ImageSettings.prototype.forceRecompression = function(a) {
        this.m_force_recompression = a;
        return this
    };
    a.Optimizer.ImageSettings.prototype.forceChanges = function(a) {
        this.m_force_changes = a;
        return this
    };
    a.Optimizer.createMonoImageSettings = function() {
        return Promise.resolve(new a.Optimizer.MonoImageSettings)
    };
    a.Optimizer.MonoImageSettings = function() {
        this.m_max_pixels = 4294967295;
        this.m_max_dpi =
            450;
        this.m_resample_dpi = 300;
        this.m_jbig2_threshold = 8.5;
        this.m_compression_mode = a.Optimizer.ImageSettings.CompressionMode.e_retain;
        this.m_downsample_mode = a.Optimizer.ImageSettings.DownsampleMode.e_default;
        this.m_force_changes = this.m_force_recompression = !1
    };
    a.Optimizer.MonoImageSettings.prototype.setImageDPI = function(a, c) {
        this.m_max_dpi = a;
        this.m_resample_dpi = c;
        return this
    };
    a.Optimizer.MonoImageSettings.prototype.setCompressionMode = function(a) {
        this.m_compression_mode = a;
        return this
    };
    a.Optimizer.MonoImageSettings.prototype.setDownsampleMode =
        function(a) {
            this.m_downsample_mode = a;
            return this
        };
    a.Optimizer.MonoImageSettings.prototype.setJBIG2Threshold = function(a) {
        this.m_jbig2_threshold = quality;
        return this
    };
    a.Optimizer.MonoImageSettings.prototype.forceRecompression = function(a) {
        this.m_force_recompression = a;
        return this
    };
    a.Optimizer.MonoImageSettings.prototype.forceChanges = function(a) {
        this.m_force_changes = a;
        return this
    };
    a.Optimizer.createTextSettings = function() {
        return Promise.resolve(new a.Optimizer.TextSettings)
    };
    a.Optimizer.TextSettings = function() {
        this.m_embed_fonts =
            this.m_subset_fonts = !1
    };
    a.Optimizer.TextSettings.prototype.subsetFonts = function(a) {
        this.m_subset_fonts = a;
        return this
    };
    a.Optimizer.TextSettings.prototype.embedFonts = function(a) {
        this.m_embed_fonts = a;
        return this
    };
    a.Optimizer.createOptimizerSettings = function() {
        return Promise.resolve(new a.Optimizer.OptimizerSettings)
    };
    a.Optimizer.OptimizerSettings = function() {
        this.color_image_settings = new a.Optimizer.ImageSettings;
        this.grayscale_image_settings = new a.Optimizer.ImageSettings;
        this.mono_image_settings = new a.Optimizer.MonoImageSettings;
        this.text_settings = new a.Optimizer.TextSettings;
        this.remove_custom = !0
    };
    a.Optimizer.OptimizerSettings.prototype.setColorImageSettings = function(a) {
        this.color_image_settings = a;
        return this
    };
    a.Optimizer.OptimizerSettings.prototype.setGrayscaleImageSettings = function(a) {
        this.grayscale_image_settings = a;
        return this
    };
    a.Optimizer.OptimizerSettings.prototype.setMonoImageSettings = function(a) {
        this.mono_image_settings = a;
        return this
    };
    a.Optimizer.OptimizerSettings.prototype.setTextSettings = function(a) {
        this.text_settings =
            a;
        return this
    };
    a.Optimizer.OptimizerSettings.prototype.removeCustomEntries = function(a) {
        this.remove_custom = a;
        return this
    };
    a.Optimizer.ImageSettings.CompressionMode = {
        e_retain: 0,
        e_flate: 1,
        e_jpeg: 2,
        e_jpeg2000: 3,
        e_none: 4
    };
    a.Optimizer.ImageSettings.DownsampleMode = {
        e_off: 0,
        e_default: 1
    };
    a.Optimizer.MonoImageSettings.CompressionMode = {
        e_jbig2: 0,
        e_flate: 1,
        e_none: 2
    };
    a.Optimizer.MonoImageSettings.DownsampleMode = {
        e_off: 0,
        e_default: 1
    };
    a.Convert.ConversionOptions = function(a) {
        this.name = "PDFNet.Convert.ConversionOptions";
        a && q(JSON.parse(a), this)
    };
    a.Convert.createOfficeToPDFOptions = function(b) {
        return Promise.resolve(new a.Convert.OfficeToPDFOptions(b))
    };
    a.Convert.OfficeToPDFOptions = function(b) {
        a.Convert.ConversionOptions.call(this, b)
    };
    a.Convert.OfficeToPDFOptions.prototype.setApplyPageBreaksToSheet = function(a) {
        this.ApplyPageBreaksToSheet = a;
        return this
    };
    a.Convert.OfficeToPDFOptions.prototype.setDisplayChangeTracking = function(a) {
        this.DisplayChangeTracking = a;
        return this
    };
    a.Convert.OfficeToPDFOptions.prototype.setExcelDefaultCellBorderWidth =
        function(a) {
            this.ExcelDefaultCellBorderWidth = a;
            return this
        };
    a.Convert.OfficeToPDFOptions.prototype.setExcelMaxAllowedCellCount = function(a) {
        this.ExcelMaxAllowedCellCount = a;
        return this
    };
    a.Convert.OfficeToPDFOptions.prototype.setLocale = function(a) {
        this.Locale = a;
        return this
    };
    a.Convert.OfficeToPDFOptions.prototype.setTemplateParamsJson = function(a) {
        this.TemplateParamsJson = a;
        return this
    };
    a.Convert.OverprintPreviewMode = {
        e_op_off: 0,
        e_op_on: 1,
        e_op_pdfx_on: 2
    };
    a.Convert.XPSOutputCommonOptions = function() {
        this.name =
            "PDFNet.Convert.XPSOutputCommonOptions"
    };
    a.Convert.XPSOutputCommonOptions.prototype.setPrintMode = function(a) {
        this.PRINTMODE = a;
        return this
    };
    a.Convert.XPSOutputCommonOptions.prototype.setDPI = function(a) {
        this.DPI = a;
        return this
    };
    a.Convert.XPSOutputCommonOptions.prototype.setRenderPages = function(a) {
        this.RENDER = a;
        return this
    };
    a.Convert.XPSOutputCommonOptions.prototype.setThickenLines = function(a) {
        this.THICKENLINES = a;
        return this
    };
    a.Convert.XPSOutputCommonOptions.prototype.generateURLLinks = function(a) {
        this.URL_LINKS =
            a;
        return this
    };
    a.Convert.XPSOutputCommonOptions.prototype.setOverprint = function(b) {
        switch (b) {
            case a.Convert.OverprintPreviewMode.e_op_off:
                this.OVERPRINT_MODE = "OFF";
                break;
            case a.Convert.OverprintPreviewMode.e_op_on:
                this.OVERPRINT_MODE = "ON";
                break;
            case a.Convert.OverprintPreviewMode.e_op_pdfx_on:
                this.OVERPRINT_MODE = "PDFX";
                break;
            default:
                console.log("unrecognized PDFNet.Convert.OverprintPreviewMode type: " + b)
        }
        return this
    };
    a.Convert.createXPSOutputOptions = function() {
        return Promise.resolve(new a.Convert.XPSOutputOptions)
    };
    a.Convert.XPSOutputOptions = function() {
        this.name = "PDFNet.Convert.XPSOutputOptions"
    };
    a.Convert.XPSOutputOptions.prototype = Object.create(a.Convert.XPSOutputCommonOptions.prototype);
    a.Convert.XPSOutputOptions.prototype.setOpenXps = function(a) {
        this.OPENXPS = a;
        return this
    };
    a.Convert.FlattenFlag = {
        e_off: 0,
        e_simple: 1,
        e_fast: 2,
        e_high_quality: 3
    };
    a.Convert.FlattenThresholdFlag = {
        e_very_strict: 0,
        e_strict: 1,
        e_default: 2,
        e_keep_most: 3,
        e_keep_all: 4
    };
    a.Convert.AnnotationOutputFlag = {
        e_internal_xfdf: 0,
        e_external_xfdf: 1,
        e_flatten: 2
    };
    a.Convert.createXODOutputOptions = function() {
        return Promise.resolve(new a.Convert.XODOutputOptions)
    };
    a.Convert.XODOutputOptions = function() {
        this.name = "PDFNet.Convert.XODOutputOptions"
    };
    a.Convert.XODOutputOptions.prototype = Object.create(a.Convert.XPSOutputCommonOptions.prototype);
    a.Convert.XODOutputOptions.prototype.setExtractUsingZorder = function(a) {
        this.USEZORDER = a;
        return this
    };
    a.Convert.XODOutputOptions.prototype.setOutputThumbnails = function(a) {
        this.NOTHUMBS = a;
        return this
    };
    a.Convert.XODOutputOptions.prototype.setThumbnailSize =
        function(a, c) {
            this.THUMB_SIZE = a;
            this.LARGE_THUMB_SIZE = c ? c : a;
            return this
        };
    a.Convert.XODOutputOptions.prototype.setElementLimit = function(a) {
        this.ELEMENTLIMIT = a;
        return this
    };
    a.Convert.XODOutputOptions.prototype.setOpacityMaskWorkaround = function(a) {
        this.MASKRENDER = a;
        return this
    };
    a.Convert.XODOutputOptions.prototype.setMaximumImagePixels = function(a) {
        this.MAX_IMAGE_PIXELS = a;
        return this
    };
    a.Convert.XODOutputOptions.prototype.setFlattenContent = function(b) {
        switch (b) {
            case a.Convert.FlattenFlag.e_off:
                this.FLATTEN_CONTENT =
                    "OFF";
                break;
            case a.Convert.FlattenFlag.e_simple:
                this.FLATTEN_CONTENT = "SIMPLE";
                break;
            case a.Convert.FlattenFlag.e_fast:
                this.FLATTEN_CONTENT = "FAST";
                break;
            case a.Convert.FlattenFlag.e_high_quality:
                this.FLATTEN_CONTENT = "HIGH_QUALITY";
                break;
            default:
                console.log("unrecognized PDFNet.Convert.FlattenFlag type: " + b)
        }
        return this
    };
    a.Convert.XODOutputOptions.prototype.setFlattenThreshold = function(b) {
        switch (b) {
            case a.Convert.FlattenThresholdFlag.e_very_strict:
                this.FLATTEN_THRESHOLD = "VERY_STRICT";
                break;
            case a.Convert.FlattenThresholdFlag.e_strict:
                this.FLATTEN_THRESHOLD =
                    "STRICT";
                break;
            case a.Convert.FlattenThresholdFlag.e_default:
                this.FLATTEN_THRESHOLD = "DEFAULT";
                break;
            case a.Convert.FlattenThresholdFlag.e_keep_most:
                this.FLATTEN_THRESHOLD = "KEEP_MOST";
                break;
            case a.Convert.FlattenThresholdFlag.e_keep_all:
                this.FLATTEN_THRESHOLD = "KEEP_ALL";
                break;
            default:
                console.log("unrecognized PDFNet.Convert.FlattenThresholdFlag type: " + b)
        }
        return this
    };
    a.Convert.XODOutputOptions.prototype.setPreferJPG = function(a) {
        this.PREFER_JPEG = a;
        return this
    };
    a.Convert.XODOutputOptions.prototype.setJPGQuality =
        function(a) {
            this.JPEG_QUALITY = a;
            return this
        };
    a.Convert.XODOutputOptions.prototype.setSilverlightTextWorkaround = function(a) {
        this.REMOVE_ROTATED_TEXT = a;
        return this
    };
    a.Convert.XODOutputOptions.prototype.setAnnotationOutput = function(b) {
        switch (b) {
            case a.Convert.AnnotationOutputFlag.e_internal_xfdf:
                this.ANNOTATION_OUTPUT = "INTERNAL";
                break;
            case a.Convert.AnnotationOutputFlag.e_external_xfdf:
                this.ANNOTATION_OUTPUT = "EXTERNAL";
                break;
            case a.Convert.AnnotationOutputFlag.e_flatten:
                this.ANNOTATION_OUTPUT = "FLATTEN";
                break;
            default:
                console.log("unrecognized PDFNet.Convert.AnnotationOutputFlag type: " + b)
        }
        return this
    };
    a.Convert.XODOutputOptions.prototype.setExternalParts = function(a) {
        this.EXTERNAL_PARTS = a;
        return this
    };
    a.Convert.XODOutputOptions.prototype.setEncryptPassword = function(a) {
        this.ENCRYPT_PASSWORD = a;
        return this
    };
    a.Convert.XODOutputOptions.prototype.useSilverlightFlashCompatible = function(a) {
        this.COMPATIBLE_XOD = a;
        return this
    };
    a.Convert.createTiffOutputOptions = function() {
        return Promise.resolve(new a.Convert.TiffOutputOptions)
    };
    a.Convert.TiffOutputOptions = function() {
        this.name = "PDFNet.Convert.TiffOutputOptions"
    };
    a.Convert.TiffOutputOptions.prototype.setBox = function(b) {
        switch (b) {
            case a.Page.Box.e_media:
                this.BOX = "media";
                break;
            case a.Page.Box.e_crop:
                this.BOX = "crop";
                break;
            case a.Page.Box.e_bleed:
                this.BOX = "bleed";
                break;
            case a.Page.Box.e_trim:
                this.BOX = "trim";
                break;
            case a.Page.Box.e_art:
                this.BOX = "art";
                break;
            default:
                console.log("unrecognized PDFNet.Page.Box type: " + b)
        }
        return this
    };
    a.Convert.TiffOutputOptions.prototype.setRotate =
        function(b) {
            switch (b) {
                case a.Page.Box.e_0:
                    this.ROTATE = "0";
                    break;
                case a.Page.Box.e_90:
                    this.ROTATE = "90";
                    break;
                case a.Page.Box.e_180:
                    this.ROTATE = "180";
                    break;
                case a.Page.Box.e_270:
                    this.ROTATE = "270";
                    break;
                default:
                    console.log("unrecognized PDFNet.Page.Rotate type: " + b)
            }
            return this
        };
    a.Convert.TiffOutputOptions.prototype.setClip = function(a, c, e, d) {
        this.CLIP_X1 = a;
        this.CLIP_Y1 = c;
        this.CLIP_X2 = e;
        this.CLIP_Y2 = d;
        return this
    };
    a.Convert.TiffOutputOptions.prototype.setPages = function(a) {
        this.PAGES = a;
        return this
    };
    a.Convert.TiffOutputOptions.prototype.setOverprint =
        function(b) {
            switch (b) {
                case a.PDFRasterizer.OverprintPreviewMode.e_op_off:
                    this.OVERPRINT_MODE = "OFF";
                    break;
                case a.PDFRasterizer.OverprintPreviewMode.e_op_on:
                    this.OVERPRINT_MODE = "ON";
                    break;
                case a.PDFRasterizer.OverprintPreviewMode.e_op_pdfx_on:
                    this.OVERPRINT_MODE = "PDFX";
                    break;
                default:
                    console.log("unrecognized PDFNet.PDFRasterizer.OverprintPreviewMode type: " + b)
            }
            return this
        };
    a.Convert.TiffOutputOptions.prototype.setCMYK = function(a) {
        this.CMYK = a;
        return this
    };
    a.Convert.TiffOutputOptions.prototype.setDither =
        function(a) {
            this.DITHER = a;
            return this
        };
    a.Convert.TiffOutputOptions.prototype.setGray = function(a) {
        this.GRAY = a;
        return this
    };
    a.Convert.TiffOutputOptions.prototype.setMono = function(a) {
        this.MONO = a;
        return this
    };
    a.Convert.TiffOutputOptions.prototype.setAnnots = function(a) {
        this.ANNOTS = a;
        return this
    };
    a.Convert.TiffOutputOptions.prototype.setSmooth = function(a) {
        this.SMOOTH = a;
        return this
    };
    a.Convert.TiffOutputOptions.prototype.setPrintmode = function(a) {
        this.PRINTMODE = a;
        return this
    };
    a.Convert.TiffOutputOptions.prototype.setTransparentPage =
        function(a) {
            this.TRANSPARENT_PAGE = a;
            return this
        };
    a.Convert.TiffOutputOptions.prototype.setPalettized = function(a) {
        this.PALETTIZED = a;
        return this
    };
    a.Convert.TiffOutputOptions.prototype.setDPI = function(a) {
        this.DPI = a;
        return this
    };
    a.Convert.TiffOutputOptions.prototype.setGamma = function(a) {
        this.GAMMA = a;
        return this
    };
    a.Convert.TiffOutputOptions.prototype.setHRes = function(a) {
        this.HRES = a;
        return this
    };
    a.Convert.TiffOutputOptions.prototype.setVRes = function(a) {
        this.VRES = a;
        return this
    };
    a.Convert.createHTMLOutputOptions =
        function() {
            return Promise.resolve(new a.Convert.HTMLOutputOptions)
        };
    a.Convert.HTMLOutputOptions = function() {
        this.name = "PDFNet.Convert.HTMLOutputOptions"
    };
    a.Convert.HTMLOutputOptions.prototype.setPreferJPG = function(a) {
        this.PREFER_JPEG = a;
        return this
    };
    a.Convert.HTMLOutputOptions.prototype.setJPGQuality = function(a) {
        this.JPEG_QUALITY = a;
        return this
    };
    a.Convert.HTMLOutputOptions.prototype.setDPI = function(a) {
        this.DPI = a;
        return this
    };
    a.Convert.HTMLOutputOptions.prototype.setMaximumImagePixels = function(a) {
        this.MAX_IMAGE_PIXELS =
            a;
        return this
    };
    a.Convert.HTMLOutputOptions.prototype.setScale = function(a) {
        this.SCALE = a;
        return this
    };
    a.Convert.HTMLOutputOptions.prototype.setExternalLinks = function(a) {
        this.EXTERNAL_LINKS = a;
        return this
    };
    a.Convert.HTMLOutputOptions.prototype.setInternalLinks = function(a) {
        this.INTERNAL_LINKS = a;
        return this
    };
    a.Convert.HTMLOutputOptions.prototype.setSimplifyText = function(a) {
        this.SIMPLIFY_TEXT = a;
        return this
    };
    a.Convert.createEPUBOutputOptions = function() {
        return Promise.resolve(new a.Convert.EPUBOutputOptions)
    };
    a.Convert.EPUBOutputOptions = function() {
        this.name = "PDFNet.Convert.EPUBOutputOptions"
    };
    a.Convert.EPUBOutputOptions.prototype.setExpanded = function(a) {
        this.EPUB_EXPANDED = a;
        return this
    };
    a.Convert.EPUBOutputOptions.prototype.setReuseCover = function(a) {
        this.EPUB_REUSE_COVER = a;
        return this
    };
    a.Convert.createSVGOutputOptions = function() {
        return Promise.resolve(new a.Convert.SVGOutputOptions)
    };
    a.Convert.SVGOutputOptions = function() {
        this.name = "PDFNet.Convert.SVGOutputOptions"
    };
    a.Convert.SVGOutputOptions.prototype.setEmbedImages =
        function(a) {
            this.EMBEDIMAGES = a;
            return this
        };
    a.Convert.SVGOutputOptions.prototype.setNoFonts = function(a) {
        this.NOFONTS = a;
        return this
    };
    a.Convert.SVGOutputOptions.prototype.setSvgFonts = function(a) {
        this.SVGFONTS = a;
        return this
    };
    a.Convert.SVGOutputOptions.prototype.setEmbedFonts = function(a) {
        this.EMBEDFONTS = a;
        return this
    };
    a.Convert.SVGOutputOptions.prototype.setNoUnicode = function(a) {
        this.NOUNICODE = a;
        return this
    };
    a.Convert.SVGOutputOptions.prototype.setIndividualCharPlacement = function(a) {
        this.INDIVIDUALCHARPLACEMENT =
            a;
        return this
    };
    a.Convert.SVGOutputOptions.prototype.setRemoveCharPlacement = function(a) {
        this.REMOVECHARPLACEMENT = a;
        return this
    };
    a.Convert.SVGOutputOptions.prototype.setFlattenContent = function(b) {
        switch (b) {
            case a.Convert.FlattenFlag.e_off:
                this.FLATTEN_CONTENT = "OFF";
                break;
            case a.Convert.FlattenFlag.e_simple:
                this.FLATTEN_CONTENT = "SIMPLE";
                break;
            case a.Convert.FlattenFlag.e_fast:
                this.FLATTEN_CONTENT = "FAST";
                break;
            case a.Convert.FlattenFlag.e_high_quality:
                this.FLATTEN_CONTENT = "HIGH_QUALITY";
                break;
            default:
                console.log("unrecognized PDFNet.Convert.FlattenFlag type: " +
                    b)
        }
        return this
    };
    a.Convert.SVGOutputOptions.prototype.setFlattenThreshold = function(b) {
        switch (b) {
            case a.Convert.FlattenThresholdFlag.e_very_strict:
                this.FLATTEN_THRESHOLD = "VERY_STRICT";
                break;
            case a.Convert.FlattenThresholdFlag.e_strict:
                this.FLATTEN_THRESHOLD = "STRICT";
                break;
            case a.Convert.FlattenThresholdFlag.e_default:
                this.FLATTEN_THRESHOLD = "DEFAULT";
                break;
            case a.Convert.FlattenThresholdFlag.e_keep_most:
                this.FLATTEN_THRESHOLD = "KEEP_MOST";
                break;
            case a.Convert.FlattenThresholdFlag.e_keep_all:
                this.FLATTEN_THRESHOLD =
                    "KEEP_ALL";
                break;
            default:
                console.log("unrecognized PDFNet.Convert.FlattenThresholdFlag type: " + b)
        }
        return this
    };
    a.Convert.SVGOutputOptions.prototype.setFlattenDPI = function(a) {
        this.DPI = a;
        return this
    };
    a.Convert.SVGOutputOptions.prototype.setFlattenMaximumImagePixels = function(a) {
        this.MAX_IMAGE_PIXELS = a;
        return this
    };
    a.Convert.SVGOutputOptions.prototype.setCompress = function(a) {
        this.SVGZ = a;
        return this
    };
    a.Convert.SVGOutputOptions.prototype.setOutputThumbnails = function(a) {
        this.NOTHUMBS = a;
        return this
    };
    a.Convert.SVGOutputOptions.prototype.setThumbnailSize =
        function(a) {
            this.THUMB_SIZE = a;
            return this
        };
    a.Convert.SVGOutputOptions.prototype.setCreateXmlWrapper = function(a) {
        this.NOXMLDOC = a;
        return this
    };
    a.Convert.SVGOutputOptions.prototype.setDtd = function(a) {
        this.OMITDTD = a;
        return this
    };
    a.Convert.SVGOutputOptions.prototype.setAnnots = function(a) {
        this.NOANNOTS = a;
        return this
    };
    a.Convert.SVGOutputOptions.prototype.setOverprint = function(b) {
        switch (b) {
            case a.PDFRasterizer.OverprintPreviewMode.e_op_off:
                this.OVERPRINT_MODE = "OFF";
                break;
            case a.PDFRasterizer.OverprintPreviewMode.e_op_on:
                this.OVERPRINT_MODE =
                    "ON";
                break;
            case a.PDFRasterizer.OverprintPreviewMode.e_op_pdfx_on:
                this.OVERPRINT_MODE = "PDFX";
                break;
            default:
                console.log("unrecognized PDFNet.PDFRasterizer.OverprintPreviewMode type: " + b)
        }
        return this
    };
    a.PDFDoc.createViewerOptimizedOptions = function() {
        return Promise.resolve(new a.PDFDoc.ViewerOptimizedOptions)
    };
    a.PDFDoc.ViewerOptimizedOptions = function() {
        this.name = "PDFNet.PDFDoc.ViewerOptimizedOptions"
    };
    a.PDFDoc.ViewerOptimizedOptions.prototype.setThumbnailRenderingThreshold = function(a) {
        this.COMPLEXITY_THRESHOLD =
            a;
        return this
    };
    a.PDFDoc.ViewerOptimizedOptions.prototype.setMinimumInitialThumbnails = function(a) {
        this.MINIMUM_INITIAL_THUMBNAILS = a;
        return this
    };
    a.PDFDoc.ViewerOptimizedOptions.prototype.setThumbnailSize = function(a) {
        this.THUMB_SIZE = a;
        return this
    };
    a.PDFDoc.ViewerOptimizedOptions.prototype.setOverprint = function(b) {
        switch (b) {
            case a.PDFRasterizer.OverprintPreviewMode.e_op_off:
                this.OVERPRINT_MODE = "OFF";
                break;
            case a.PDFRasterizer.OverprintPreviewMode.e_op_on:
                this.OVERPRINT_MODE = "ON";
                break;
            case a.PDFRasterizer.OverprintPreviewMode.e_op_pdfx_on:
                this.OVERPRINT_MODE =
                    "PDFX";
                break;
            default:
                console.log("unrecognized PDFNet.PDFRasterizer.OverprintPreviewMode type: " + b)
        }
        return this
    };
    a.Convert.createCADConvertOptions = function() {
        return Promise.resolve(new a.Convert.CADConvertOptions)
    };
    a.Convert.CADConvertOptions = function() {
        this.name = "PDFNet.Convert.CADConvertOptions";
        this.mImpl = {};
        this.mHelpers = g()
    };
    a.Convert.CADConvertOptions.prototype.getAllowThinLines = function() {
        return "AllowThinLines" in this.mImpl ? !!this.mImpl.AllowThinLines : !0
    };
    a.Convert.CADConvertOptions.prototype.setAllowThinLines =
        function(a) {
            this.mHelpers.putBool(this.mImpl, "AllowThinLines", a);
            return this
        };
    a.Convert.CADConvertOptions.prototype.getAutoRotate = function() {
        return "AutoRotate" in this.mImpl ? !!this.mImpl.AutoRotate : !1
    };
    a.Convert.CADConvertOptions.prototype.setAutoRotate = function(a) {
        this.mHelpers.putBool(this.mImpl, "AutoRotate", a);
        return this
    };
    a.Convert.CADConvertOptions.prototype.getBackgroundColor = function() {
        return "BackgroundColor" in this.mImpl ? mHelpers.jsColorFromNumber(this.mImpl.BackgroundColor) : mHelpers.jsColorFromNumber(4294967295)
    };
    a.Convert.CADConvertOptions.prototype.setBackgroundColor = function(a) {
        this.mHelpers.putNumber(this.mImpl, "BackgroundColor", mHelpers.jsColorToNumber(a));
        return this
    };
    a.Convert.CADConvertOptions.prototype.getColorMode = function() {
        return "ColorMode" in this.mImpl ? this.mImpl.ColorMode : "Original"
    };
    a.Convert.CADConvertOptions.prototype.setColorMode = function(a) {
        this.mHelpers.putRect(this.mImpl, "ColorMode", "" + a);
        return this
    };
    a.Convert.CADConvertOptions.prototype.getIncludeModel = function() {
        return "IncludeModel" in
            this.mImpl ? !!this.mImpl.IncludeModel : !0
    };
    a.Convert.CADConvertOptions.prototype.setIncludeModel = function(a) {
        this.mHelpers.putBool(this.mImpl, "IncludeModel", a);
        return this
    };
    a.Convert.CADConvertOptions.prototype.getMaxXrefDepth = function() {
        return "MaxXrefDepth" in this.mImpl ? 0 | this.mImpl.MaxXrefDepth : 1E3
    };
    a.Convert.CADConvertOptions.prototype.setMaxXrefDepth = function(a) {
        this.mHelpers.putNumber(this.mImpl, "MaxXrefDepth", a);
        return this
    };
    a.Convert.CADConvertOptions.prototype.getPageHeight = function() {
        return "PageHeight" in
            this.mImpl ? this.mImpl.PageHeight : 594
    };
    a.Convert.CADConvertOptions.prototype.setPageHeight = function(a) {
        this.mHelpers.putNumber(this.mImpl, "PageHeight", a);
        return this
    };
    a.Convert.CADConvertOptions.prototype.getPageWidth = function() {
        return "PageWidth" in this.mImpl ? this.mImpl.PageWidth : 840
    };
    a.Convert.CADConvertOptions.prototype.setPageWidth = function(a) {
        this.mHelpers.putNumber(this.mImpl, "PageWidth", a);
        return this
    };
    a.Convert.CADConvertOptions.prototype.getRasterDPI = function() {
        return "RasterDPI" in this.mImpl ?
            this.mImpl.RasterDPI : 72
    };
    a.Convert.CADConvertOptions.prototype.setRasterDPI = function(a) {
        this.mHelpers.putNumber(this.mImpl, "RasterDPI", a);
        return this
    };
    a.Convert.CADConvertOptions.prototype.AddSheets = function(a) {
        this.mHelpers.pushBackRect(this.mImpl, "Sheets", a);
        return this
    };
    a.Convert.CADConvertOptions.prototype.getUseScaleFromDocument = function() {
        return "UseScaleFromDocument" in this.mImpl ? !!this.mImpl.UseScaleFromDocument : !1
    };
    a.Convert.CADConvertOptions.prototype.setUseScaleFromDocument = function(a) {
        this.mHelpers.putBool(this.mImpl,
            "UseScaleFromDocument", a);
        return this
    };
    a.Convert.CADConvertOptions.prototype.getZoomToExtents = function() {
        return "ZoomToExtents" in this.mImpl ? !!this.mImpl.ZoomToExtents : !0
    };
    a.Convert.CADConvertOptions.prototype.setZoomToExtents = function(a) {
        this.mHelpers.putBool(this.mImpl, "ZoomToExtents", a);
        return this
    };
    a.Convert.CADConvertOptions.prototype.getJsonString = function() {
        return JSON.stringify(this.mImpl)
    };
    a.Convert.OfficeToPDFOptions.prototype.setLayoutResourcesPluginPath = function(a) {
        this.LayoutResourcesPluginPath =
            a;
        return this
    };
    a.Convert.OfficeToPDFOptions.prototype.setResourceDocPath = function(a) {
        this.ResourceDocPath = a;
        return this
    };
    a.Convert.OfficeToPDFOptions.prototype.setSmartSubstitutionPluginPath = function(a) {
        this.SmartSubstitutionPluginPath = a;
        return this
    };
    a.Convert.OutputOptionsOCR = {};
    a.Convert.OutputOptionsOCR.LanguageChoice = {
        e_lang_auto: 0,
        e_lang_catalan: 1,
        e_lang_danish: 2,
        e_lang_german: 3,
        e_lang_english: 4,
        e_lang_spanish: 5,
        e_lang_finnish: 6,
        e_lang_french: 7,
        e_lang_italian: 8,
        e_lang_dutch: 9,
        e_lang_norwegian: 10,
        e_lang_portuguese: 11,
        e_lang_polish: 12,
        e_lang_romanian: 13,
        e_lang_russian: 14,
        e_lang_slovenian: 15,
        e_lang_swedish: 16,
        e_lang_turkish: 17
    };
    a.Convert.OutputOptionsOCR.languageChoiceToString = function(b) {
        switch (reflow) {
            case a.Convert.OutputOptionsOCR.LanguageChoice.e_lang_auto:
                return "au";
            case a.Convert.OutputOptionsOCR.LanguageChoice.e_lang_catalan:
                return "ca";
            case a.Convert.OutputOptionsOCR.LanguageChoice.e_lang_danish:
                return "da";
            case a.Convert.OutputOptionsOCR.LanguageChoice.e_lang_german:
                return "de";
            case a.Convert.OutputOptionsOCR.LanguageChoice.e_lang_english:
                return "en";
            case a.Convert.OutputOptionsOCR.LanguageChoice.e_lang_spanish:
                return "es";
            case a.Convert.OutputOptionsOCR.LanguageChoice.e_lang_finnish:
                return "fi";
            case a.Convert.OutputOptionsOCR.LanguageChoice.e_lang_french:
                return "fr";
            case a.Convert.OutputOptionsOCR.LanguageChoice.e_lang_italian:
                return "it";
            case a.Convert.OutputOptionsOCR.LanguageChoice.e_lang_dutch:
                return "nl";
            case a.Convert.OutputOptionsOCR.LanguageChoice.e_lang_norwegian:
                return "no";
            case a.Convert.OutputOptionsOCR.LanguageChoice.e_lang_portuguese:
                return "pt";
            case a.Convert.OutputOptionsOCR.LanguageChoice.e_lang_polish:
                return "pl";
            case a.Convert.OutputOptionsOCR.LanguageChoice.e_lang_romanian:
                return "ro";
            case a.Convert.OutputOptionsOCR.LanguageChoice.e_lang_russian:
                return "ru";
            case a.Convert.OutputOptionsOCR.LanguageChoice.e_lang_slovenian:
                return "sl";
            case a.Convert.OutputOptionsOCR.LanguageChoice.e_lang_swedish:
                return "sv";
            case a.Convert.OutputOptionsOCR.LanguageChoice.e_lang_turkish:
                return "tr";
            default:
                return console.log("unrecognized * PDFNet.Convert.OutputOptionsOCR.LanguageChoice type: " +
                    setting), "au"
        }
    };
    a.Convert.HTMLOutputOptions.ContentReflowSetting = {
        e_fixed_position: 0,
        e_reflow_paragraphs: 1,
        e_reflow_full: 2
    };
    a.Convert.HTMLOutputOptions.prototype.setContentReflowSetting = function(b) {
        switch (b) {
            case a.Convert.HTMLOutputOptions.ContentReflowSetting.e_fixed_position:
                this.REFLOW = "FIXED_POSITION";
                break;
            case a.Convert.HTMLOutputOptions.ContentReflowSetting.e_reflow_paragraphs:
                this.REFLOW = "REFLOW_PARAGRAPHS";
                break;
            case a.Convert.HTMLOutputOptions.ContentReflowSetting.e_reflow_full:
                this.REFLOW =
                    "REFLOW_FULL";
                break;
            default:
                console.log("unrecognized PDFNet.Convert.HTMLOutputOptions.ContentReflowSetting type: " + setting)
        }
        return this
    };
    a.Convert.HTMLOutputOptions.prototype.setReportFile = function(a) {
        this.REPORT_FILE = a;
        return this
    };
    a.Convert.HTMLOutputOptions.prototype.setTitle = function(a) {
        this.TITLE = a;
        return this
    };
    a.Convert.HTMLOutputOptions.prototype.setImageDPI = function(a) {
        this.IMAGE_DPI = a;
        return this
    };
    a.Convert.HTMLOutputOptions.prototype.setEmbedImages = function(a) {
        this.EMBED_IMAGES = a;
        return this
    };
    a.Convert.HTMLOutputOptions.prototype.setFileConversionTimeoutSeconds = function(a) {
        this.FILE_TIMEOUT = a;
        return this
    };
    a.Convert.HTMLOutputOptions.prototype.setPages = function(a, c) {
        this.PAGE_FROM = a;
        this.PAGE_TO = c;
        return this
    };
    a.Convert.HTMLOutputOptions.prototype.setPDFPassword = function(a) {
        this.PASSWORD = a;
        return this
    };
    a.Convert.HTMLOutputOptions.SearchableImageSetting = {
        e_ocr_image_text: 0,
        e_ocr_image: 1,
        e_ocr_text: 2,
        e_ocr_off: 3,
        e_ocr_always: 4
    };
    a.Convert.HTMLOutputOptions.prototype.setSearchableImageSetting =
        function(b) {
            switch (b) {
                case a.Convert.HTMLOutputOptions.SearchableImageSetting.e_ocr_image_text:
                    this.OCRED = "IMAGE+TEXT";
                    break;
                case a.Convert.HTMLOutputOptions.SearchableImageSetting.e_ocr_image:
                    this.OCRED = "IMAGE";
                    break;
                case a.Convert.HTMLOutputOptions.SearchableImageSetting.e_ocr_text:
                    this.OCRED = "TEXT";
                    break;
                case a.Convert.HTMLOutputOptions.SearchableImageSetting.e_ocr_always:
                    this.OCRED = "ALWAYS";
                    break;
                case a.Convert.HTMLOutputOptions.SearchableImageSetting.e_ocr_off:
                    this.OCRED = "OFF";
                    break;
                default:
                    console.log("unrecognized PDFNet.Convert.HTMLOutputOptions.SearchableImageSetting type: " +
                        b)
            }
            return this
        };
    a.Convert.HTMLOutputOptions.prototype.setSimpleLists = function(a) {
        this.SIMPLE_LISTS = a;
        return this
    };
    a.Convert.HTMLOutputOptions.prototype.setConnectHyphens = function(a) {
        this.CONNECT_HYPHENS = a;
        return this
    };
    a.Convert.HTMLOutputOptions.prototype.setDisableVerticalSplit = function(a) {
        this.DISABLE_VERTICAL_SPLIT = a;
        return this
    };
    a.Convert.HTMLOutputOptions.prototype.setNoPageWidth = function(a) {
        this.NO_PAGE_WIDTH = a;
        return this
    };
    a.Convert.HTMLOutputOptions.prototype.setLanguage = function(b) {
        this.LANGUAGE =
            a.Convert.OutputOptionsOCR.languageChoiceToString(b);
        return this
    };
    a.Convert.createWordOutputOptions = function() {
        return Promise.resolve(new a.Convert.WordOutputOptions)
    };
    a.Convert.WordOutputOptions = function() {
        this.name = "PDFNet.Convert.WordOutputOptions"
    };
    a.Convert.WordOutputOptions.WordOutputFormat = {
        e_wof_docx: 0,
        e_wof_doc: 1,
        e_wof_rtf: 2,
        e_wof_txt: 3
    };
    a.Convert.WordOutputOptions.prototype.setWordOutputFormat = function(b) {
        switch (b) {
            case a.Convert.WordOutputOptions.WordOutputFormat.e_wof_docx:
                this.OUTPUT_FORMAT =
                    "DOCX";
                break;
            case a.Convert.WordOutputOptions.WordOutputFormat.e_wof_doc:
                this.OUTPUT_FORMAT = "DOC";
                break;
            case a.Convert.WordOutputOptions.WordOutputFormat.e_wof_rtf:
                this.OUTPUT_FORMAT = "RTF";
                break;
            case a.Convert.WordOutputOptions.WordOutputFormat.e_wof_txt:
                this.OUTPUT_FORMAT = "TXT";
                break;
            default:
                console.log("unrecognized PDFNet.Convert.WordOutputOptions.WordOutputFormat type: " + b)
        }
        return this
    };
    a.Convert.WordOutputOptions.prototype.setPages = function(a, c) {
        this.PAGE_FROM = a;
        this.PAGE_TO = c;
        return this
    };
    a.Convert.WordOutputOptions.prototype.setPDFPassword =
        function(a) {
            this.PASSWORD = a;
            return this
        };
    a.Convert.WordOutputOptions.SearchableImageSetting = {
        e_ocr_image_text: 0,
        e_ocr_image: 1,
        e_ocr_text: 2,
        e_ocr_off: 3,
        e_ocr_always: 4
    };
    a.Convert.WordOutputOptions.prototype.setSearchableImageSetting = function(b) {
        switch (b) {
            case a.Convert.WordOutputOptions.SearchableImageSetting.e_ocr_image_text:
                this.OCRED = "IMAGE+TEXT";
                break;
            case a.Convert.WordOutputOptions.SearchableImageSetting.e_ocr_image:
                this.OCRED = "IMAGE";
                break;
            case a.Convert.WordOutputOptions.SearchableImageSetting.e_ocr_text:
                this.OCRED =
                    "TEXT";
                break;
            case a.Convert.WordOutputOptions.SearchableImageSetting.e_ocr_always:
                this.OCRED = "ALWAYS";
                break;
            case a.Convert.WordOutputOptions.SearchableImageSetting.e_ocr_off:
                this.OCRED = "OFF";
                break;
            default:
                console.log("unrecognized PDFNet.Convert.WordOutputOptions.SearchableImageSetting type: " + b)
        }
        return this
    };
    a.Convert.WordOutputOptions.prototype.setConnectHyphens = function(a) {
        this.CONNECT_HYPHENS = a;
        return this
    };
    a.Convert.WordOutputOptions.prototype.setLanguage = function(b) {
        this.LANGUAGE = a.Convert.OutputOptionsOCR.languageChoiceToString(b);
        return this
    };
    a.Convert.WordOutputOptions.prototype.setPrioritizeVisualAppearance = function(a) {
        this.VISUAL_REPLICA = a;
        return this
    };
    a.Convert.createExcelOutputOptions = function() {
        return Promise.resolve(new a.Convert.ExcelOutputOptions)
    };
    a.Convert.ExcelOutputOptions = function() {
        this.name = "PDFNet.Convert.ExcelOutputOptions"
    };
    a.Convert.ExcelOutputOptions.prototype.setPages = function(a, c) {
        this.PAGE_FROM = a;
        this.PAGE_TO = c;
        return this
    };
    a.Convert.ExcelOutputOptions.prototype.setPDFPassword = function(a) {
        this.PASSWORD =
            a;
        return this
    };
    a.Convert.ExcelOutputOptions.prototype.setLanguage = function(b) {
        this.LANGUAGE = a.Convert.OutputOptionsOCR.languageChoiceToString(b);
        return this
    };
    a.Convert.ExcelOutputOptions.prototype.setNonTableContent = function(a) {
        this.NON_TABLES = a;
        return this
    };
    a.Convert.ExcelOutputOptions.prototype.setSingleSheet = function(a) {
        this.SINGLE_SHEET = a;
        return this
    };
    a.Convert.createPowerPointOutputOptions = function() {
        return Promise.resolve(new a.Convert.PowerPointOutputOptions)
    };
    a.Convert.PowerPointOutputOptions =
        function() {
            this.name = "PDFNet.Convert.PowerPointOutputOptions"
        };
    a.Convert.PowerPointOutputOptions.prototype.setPages = function(a, c) {
        this.PAGE_FROM = a;
        this.PAGE_TO = c;
        return this
    };
    a.Convert.PowerPointOutputOptions.prototype.setPDFPassword = function(a) {
        this.PASSWORD = a;
        return this
    };
    a.Convert.PowerPointOutputOptions.prototype.setLanguage = function(b) {
        this.LANGUAGE = a.Convert.OutputOptionsOCR.languageChoiceToString(b);
        return this
    };
    a.OCRModule.createOCROptions = function() {
        return Promise.resolve(new a.OCRModule.OCROptions)
    };
    a.OCRModule.OCROptions = function() {
        this.name = "PDFNet.OCRModule.OCROptions"
    };
    a.OCRModule.OCROptions.prototype.addZonesForPage = function(a, c, e) {
        "undefined" === typeof this[a] && (this[a] = []);
        if (this[a].length < e)
            for (var b = this[a].length; b < e; b++) this[a].push([]);
        c = c.map(function(a) {
            return [a.x1, a.y1, a.x2, a.y2]
        });
        this[a][e - 1] = c
    };
    a.OCRModule.OCROptions.prototype.addIgnoreZonesForPage = function(a, c) {
        this.addZonesForPage("IgnoreZones", a, c);
        return this
    };
    a.OCRModule.OCROptions.prototype.addLang = function(a) {
        "undefined" ===
        typeof this.Langs && (this.Langs = []);
        this.Langs.push(a);
        return this
    };
    a.OCRModule.OCROptions.prototype.addTextZonesForPage = function(a, c) {
        this.addZonesForPage("TextZones", a, c);
        return this
    };
    a.OCRModule.OCROptions.prototype.addDPI = function(a) {
        this.DPI = a;
        return this
    };
    a.OCRModule.OCROptions.prototype.setUsePDFPageCoords = function(a) {
        this.UsePDFPageCoords = a;
        return this
    };
    a.OCRModule.OCROptions.prototype.setIgnoreExistingText = function(a) {
        this.IgnoreExistingText = a;
        return this
    };
    a.OCRModule.OCROptions.prototype.setOCREngine =
        function(a) {
            this.OCREngine = a;
            return this
        };
    a.MarkupAnnot.prototype = new a.Annot;
    a.TextMarkupAnnot.prototype = new a.MarkupAnnot;
    a.CaretAnnot.prototype = new a.MarkupAnnot;
    a.LineAnnot.prototype = new a.MarkupAnnot;
    a.CircleAnnot.prototype = new a.MarkupAnnot;
    a.FileAttachmentAnnot.prototype = new a.MarkupAnnot;
    a.FreeTextAnnot.prototype = new a.MarkupAnnot;
    a.HighlightAnnot.prototype = new a.TextMarkupAnnot;
    a.InkAnnot.prototype = new a.MarkupAnnot;
    a.LinkAnnot.prototype = new a.Annot;
    a.MovieAnnot.prototype = new a.Annot;
    a.PolyLineAnnot.prototype =
        new a.LineAnnot;
    a.PolygonAnnot.prototype = new a.PolyLineAnnot;
    a.PopupAnnot.prototype = new a.Annot;
    a.RedactionAnnot.prototype = new a.MarkupAnnot;
    a.RubberStampAnnot.prototype = new a.MarkupAnnot;
    a.ScreenAnnot.prototype = new a.Annot;
    a.SoundAnnot.prototype = new a.MarkupAnnot;
    a.SquareAnnot.prototype = new a.MarkupAnnot;
    a.SquigglyAnnot.prototype = new a.TextMarkupAnnot;
    a.StrikeOutAnnot.prototype = new a.TextMarkupAnnot;
    a.TextAnnot.prototype = new a.MarkupAnnot;
    a.UnderlineAnnot.prototype = new a.TextMarkupAnnot;
    a.WatermarkAnnot.prototype =
        new a.Annot;
    a.WidgetAnnot.prototype = new a.Annot;
    a.SignatureWidget.prototype = new a.WidgetAnnot;
    a.ComboBoxWidget.prototype = new a.WidgetAnnot;
    a.ListBoxWidget.prototype = new a.WidgetAnnot;
    a.TextWidget.prototype = new a.WidgetAnnot;
    a.CheckBoxWidget.prototype = new a.WidgetAnnot;
    a.RadioButtonWidget.prototype = new a.WidgetAnnot;
    a.PushButtonWidget.prototype = new a.WidgetAnnot;
    a.PrinterMode.PaperSize = {
        e_custom: 0,
        e_letter: 1,
        e_letter_small: 2,
        e_tabloid: 3,
        e_ledger: 4,
        e_legal: 5,
        e_statement: 6,
        e_executive: 7,
        e_a3: 8,
        e_a4: 9,
        e_a4_mall: 10,
        e_a5: 11,
        e_b4_jis: 12,
        e_b5_jis: 13,
        e_folio: 14,
        e_quarto: 15,
        e_10x14: 16,
        e_11x17: 17,
        e_note: 18,
        e_envelope_9: 19,
        e_envelope_10: 20,
        e_envelope_11: 21,
        e_envelope_12: 22,
        e_envelope_14: 23,
        e_c_size_sheet: 24,
        e_d_size_sheet: 25,
        e_e_size_sheet: 26,
        e_envelope_dl: 27,
        e_envelope_c5: 28,
        e_envelope_c3: 29,
        e_envelope_c4: 30,
        e_envelope_c6: 31,
        e_envelope_c65: 32,
        e_envelope_b4: 33,
        e_envelope_b5: 34,
        e_envelope_b6: 35,
        e_envelope_italy: 36,
        e_envelope_monarch: 37,
        e_6_3_quarters_envelope: 38,
        e_us_std_fanfold: 39,
        e_german_std_fanfold: 40,
        e_german_legal_fanfold: 41,
        e_b4_iso: 42,
        e_japanese_postcard: 43,
        e_9x11: 44,
        e_10x11: 45,
        e_15x11: 46,
        e_envelope_invite: 47,
        e_reserved_48: 48,
        e_reserved_49: 49,
        e_letter_extra: 50,
        e_legal_extra: 51,
        e_tabloid_extra: 52,
        e_a4_extra: 53,
        e_letter_transverse: 54,
        e_a4_transverse: 55,
        e_letter_extra_transverse: 56,
        e_supera_supera_a4: 57,
        e_Superb_Superb_a3: 58,
        e_letter_plus: 59,
        e_a4_plus: 60,
        e_a5_transverse: 61,
        e_b5_jis_transverse: 62,
        e_a3_extra: 63,
        e_a5_extra: 64,
        e_b5_iso_extra: 65,
        e_a2: 66,
        e_a3_transverse: 67,
        e_a3_extra_transverse: 68,
        e_japanese_double_postcard: 69,
        e_a6: 70,
        e_japanese_envelope_kaku_2: 71,
        e_japanese_envelope_kaku_3: 72,
        e_japanese_envelope_chou_3: 73,
        e_japanese_envelope_chou_4: 74,
        e_letter_rotated: 75,
        e_a3_rotated: 76,
        e_a4_rotated: 77,
        e_a5_rotated: 78,
        e_b4_jis_rotated: 79,
        e_b5_jis_rotated: 80,
        e_japanese_postcard_rotated: 81,
        e_double_japanese_postcard_rotated: 82,
        e_a6_rotated: 83,
        e_japanese_envelope_kaku_2_rotated: 84,
        e_japanese_envelope_kaku_3_rotated: 85,
        e_japanese_envelope_chou_3_rotated: 86,
        e_japanese_envelope_chou_4_rotated: 87,
        e_b6_jis: 88,
        e_b6_jis_rotated: 89,
        e_12x11: 90,
        e_japanese_envelope_you_4: 91,
        e_japanese_envelope_you_4_rotated: 92,
        e_PrinterMode_prc_16k: 93,
        e_prc_32k: 94,
        e_prc_32k_big: 95,
        e_prc_envelop_1: 96,
        e_prc_envelop_2: 97,
        e_prc_envelop_3: 98,
        e_prc_envelop_4: 99,
        e_prc_envelop_5: 100,
        e_prc_envelop_6: 101,
        e_prc_envelop_7: 102,
        e_prc_envelop_8: 103,
        e_prc_envelop_9: 104,
        e_prc_envelop_10: 105,
        e_prc_16k_rotated: 106,
        e_prc_32k_rotated: 107,
        e_prc_32k_big__rotated: 108,
        e_prc_envelop_1_rotated: 109,
        e_prc_envelop_2_rotated: 110,
        e_prc_envelop_3_rotated: 111,
        e_prc_envelop_4_rotated: 112,
        e_prc_envelop_5_rotated: 113,
        e_prc_envelop_6_rotated: 114,
        e_prc_envelop_7_rotated: 115,
        e_prc_envelop_8_rotated: 116,
        e_prc_envelop_9_rotated: 117,
        e_prc_envelop_10_rotated: 118
    };
    a.Field.EventType = {
        e_action_trigger_keystroke: 13,
        e_action_trigger_format: 14,
        e_action_trigger_validate: 15,
        e_action_trigger_calculate: 16
    };
    a.Field.Type = {
        e_button: 0,
        e_check: 1,
        e_radio: 2,
        e_text: 3,
        e_choice: 4,
        e_signature: 5,
        e_null: 6
    };
    a.Field.Flag = {
        e_read_only: 0,
        e_required: 1,
        e_no_export: 2,
        e_pushbutton_flag: 3,
        e_radio_flag: 4,
        e_toggle_to_off: 5,
        e_radios_in_unison: 6,
        e_multiline: 7,
        e_password: 8,
        e_file_select: 9,
        e_no_spellcheck: 10,
        e_no_scroll: 11,
        e_comb: 12,
        e_rich_text: 13,
        e_combo: 14,
        e_edit: 15,
        e_sort: 16,
        e_multiselect: 17,
        e_commit_on_sel_change: 18
    };
    a.Field.TextJustification = {
        e_left_justified: 0,
        e_centered: 1,
        e_right_justified: 2
    };
    a.Filter.StdFileOpenMode = {
        e_read_mode: 0,
        e_write_mode: 1,
        e_append_mode: 2
    };
    a.Filter.ReferencePos = {
        e_begin: 0,
        e_end: 2,
        e_cur: 1
    };
    a.OCGContext.OCDrawMode = {
        e_VisibleOC: 0,
        e_AllOC: 1,
        e_NoOC: 2
    };
    a.OCMD.VisibilityPolicyType = {
        e_AllOn: 0,
        e_AnyOn: 1,
        e_AnyOff: 2,
        e_AllOff: 3
    };
    a.PDFACompliance.Conformance = {
        e_Level1A: 1,
        e_Level1B: 2,
        e_Level2A: 3,
        e_Level2B: 4,
        e_Level2U: 5,
        e_Level3A: 6,
        e_Level3B: 7,
        e_Level3U: 8
    };
    a.PDFACompliance.ErrorCode = {
        e_PDFA0_1_0: 10,
        e_PDFA0_1_1: 11,
        e_PDFA0_1_2: 12,
        e_PDFA0_1_3: 13,
        e_PDFA0_1_4: 14,
        e_PDFA0_1_5: 15,
        e_PDFA1_2_1: 121,
        e_PDFA1_2_2: 122,
        e_PDFA1_3_1: 131,
        e_PDFA1_3_2: 132,
        e_PDFA1_3_3: 133,
        e_PDFA1_3_4: 134,
        e_PDFA1_4_1: 141,
        e_PDFA1_4_2: 142,
        e_PDFA1_6_1: 161,
        e_PDFA1_7_1: 171,
        e_PDFA1_7_2: 172,
        e_PDFA1_7_3: 173,
        e_PDFA1_7_4: 174,
        e_PDFA1_8_1: 181,
        e_PDFA1_8_2: 182,
        e_PDFA1_8_3: 183,
        e_PDFA1_8_4: 184,
        e_PDFA1_8_5: 185,
        e_PDFA1_8_6: 186,
        e_PDFA1_10_1: 1101,
        e_PDFA1_11_1: 1111,
        e_PDFA1_11_2: 1112,
        e_PDFA1_12_1: 1121,
        e_PDFA1_12_2: 1122,
        e_PDFA1_12_3: 1123,
        e_PDFA1_12_4: 1124,
        e_PDFA1_12_5: 1125,
        e_PDFA1_12_6: 1126,
        e_PDFA1_13_1: 1131,
        e_PDFA2_2_1: 221,
        e_PDFA2_3_2: 232,
        e_PDFA2_3_3: 233,
        e_PDFA2_3_3_1: 2331,
        e_PDFA2_3_3_2: 2332,
        e_PDFA2_3_4_1: 2341,
        e_PDFA2_4_1: 241,
        e_PDFA2_4_2: 242,
        e_PDFA2_4_3: 243,
        e_PDFA2_4_4: 244,
        e_PDFA2_5_1: 251,
        e_PDFA2_5_2: 252,
        e_PDFA2_6_1: 261,
        e_PDFA2_7_1: 271,
        e_PDFA2_8_1: 281,
        e_PDFA2_9_1: 291,
        e_PDFA2_10_1: 2101,
        e_PDFA3_2_1: 321,
        e_PDFA3_3_1: 331,
        e_PDFA3_3_2: 332,
        e_PDFA3_3_3_1: 3331,
        e_PDFA3_3_3_2: 3332,
        e_PDFA3_4_1: 341,
        e_PDFA3_5_1: 351,
        e_PDFA3_5_2: 352,
        e_PDFA3_5_3: 353,
        e_PDFA3_5_4: 354,
        e_PDFA3_5_5: 355,
        e_PDFA3_5_6: 356,
        e_PDFA3_6_1: 361,
        e_PDFA3_7_1: 371,
        e_PDFA3_7_2: 372,
        e_PDFA3_7_3: 373,
        e_PDFA4_1: 41,
        e_PDFA4_2: 42,
        e_PDFA4_3: 43,
        e_PDFA4_4: 44,
        e_PDFA4_5: 45,
        e_PDFA4_6: 46,
        e_PDFA5_2_1: 521,
        e_PDFA5_2_2: 522,
        e_PDFA5_2_3: 523,
        e_PDFA5_2_4: 524,
        e_PDFA5_2_5: 525,
        e_PDFA5_2_6: 526,
        e_PDFA5_2_7: 527,
        e_PDFA5_2_8: 528,
        e_PDFA5_2_9: 529,
        e_PDFA5_2_10: 5210,
        e_PDFA5_2_11: 5211,
        e_PDFA5_3_1: 531,
        e_PDFA5_3_2_1: 5321,
        e_PDFA5_3_2_2: 5322,
        e_PDFA5_3_2_3: 5323,
        e_PDFA5_3_2_4: 5324,
        e_PDFA5_3_2_5: 5325,
        e_PDFA5_3_3_1: 5331,
        e_PDFA5_3_3_2: 5332,
        e_PDFA5_3_3_3: 5333,
        e_PDFA5_3_3_4: 5334,
        e_PDFA5_3_4_0: 5340,
        e_PDFA5_3_4_1: 5341,
        e_PDFA5_3_4_2: 5342,
        e_PDFA5_3_4_3: 5343,
        e_PDFA6_1_1: 611,
        e_PDFA6_1_2: 612,
        e_PDFA6_2_1: 621,
        e_PDFA6_2_2: 622,
        e_PDFA6_2_3: 623,
        e_PDFA7_2_1: 721,
        e_PDFA7_2_2: 722,
        e_PDFA7_2_3: 723,
        e_PDFA7_2_4: 724,
        e_PDFA7_2_5: 725,
        e_PDFA7_3_1: 731,
        e_PDFA7_3_2: 732,
        e_PDFA7_3_3: 733,
        e_PDFA7_3_4: 734,
        e_PDFA7_3_5: 735,
        e_PDFA7_3_6: 736,
        e_PDFA7_3_7: 737,
        e_PDFA7_3_8: 738,
        e_PDFA7_3_9: 739,
        e_PDFA7_5_1: 751,
        e_PDFA7_8_1: 781,
        e_PDFA7_8_2: 782,
        e_PDFA7_8_3: 783,
        e_PDFA7_8_4: 784,
        e_PDFA7_8_5: 785,
        e_PDFA7_8_6: 786,
        e_PDFA7_8_7: 787,
        e_PDFA7_8_8: 788,
        e_PDFA7_8_9: 789,
        e_PDFA7_8_10: 7810,
        e_PDFA7_8_11: 7811,
        e_PDFA7_8_12: 7812,
        e_PDFA7_8_13: 7813,
        e_PDFA7_8_14: 7814,
        e_PDFA7_8_15: 7815,
        e_PDFA7_8_16: 7816,
        e_PDFA7_8_17: 7817,
        e_PDFA7_8_18: 7818,
        e_PDFA7_8_19: 7819,
        e_PDFA7_8_20: 7820,
        e_PDFA7_8_21: 7821,
        e_PDFA7_8_22: 7822,
        e_PDFA7_8_23: 7823,
        e_PDFA7_8_24: 7824,
        e_PDFA7_8_25: 7825,
        e_PDFA7_8_26: 7826,
        e_PDFA7_8_27: 7827,
        e_PDFA7_8_28: 7828,
        e_PDFA7_8_29: 7829,
        e_PDFA7_8_30: 7830,
        e_PDFA7_8_31: 7831,
        e_PDFA7_11_1: 7111,
        e_PDFA7_11_2: 7112,
        e_PDFA7_11_3: 7113,
        e_PDFA7_11_4: 7114,
        e_PDFA7_11_5: 7115,
        e_PDFA9_1: 91,
        e_PDFA9_2: 92,
        e_PDFA9_3: 93,
        e_PDFA9_4: 94,
        e_PDFA3_8_1: 381,
        e_PDFA8_2_2: 822,
        e_PDFA8_3_3_1: 8331,
        e_PDFA8_3_3_2: 8332,
        e_PDFA8_3_4_1: 8341,
        e_PDFA1_2_3: 123,
        e_PDFA1_10_2: 1102,
        e_PDFA1_10_3: 1103,
        e_PDFA1_12_10: 11210,
        e_PDFA1_13_5: 1135,
        e_PDFA2_3_10: 2310,
        e_PDFA2_4_2_10: 24220,
        e_PDFA2_4_2_11: 24221,
        e_PDFA2_4_2_12: 24222,
        e_PDFA2_4_2_13: 24223,
        e_PDFA2_5_10: 2510,
        e_PDFA2_5_11: 2511,
        e_PDFA2_5_12: 2512,
        e_PDFA2_8_3_1: 2831,
        e_PDFA2_8_3_2: 2832,
        e_PDFA2_8_3_3: 2833,
        e_PDFA2_8_3_4: 2834,
        e_PDFA2_8_3_5: 2835,
        e_PDFA2_10_20: 21020,
        e_PDFA2_10_21: 21021,
        e_PDFA11_0_0: 11E3,
        e_PDFA6_2_11_8: 62118,
        e_PDFA8_1: 81,
        e_PDFA_3E1: 1,
        e_PDFA_3E2: 2,
        e_PDFA_3E3: 3,
        e_PDFA_LAST: 4
    };
    a.ContentItem.Type = {
        e_MCR: 0,
        e_MCID: 1,
        e_OBJR: 2,
        e_Unknown: 3
    };
    a.Action.Type = {
        e_GoTo: 0,
        e_GoToR: 1,
        e_GoToE: 2,
        e_Launch: 3,
        e_Thread: 4,
        e_URI: 5,
        e_Sound: 6,
        e_Movie: 7,
        e_Hide: 8,
        e_Named: 9,
        e_SubmitForm: 10,
        e_ResetForm: 11,
        e_ImportData: 12,
        e_JavaScript: 13,
        e_SetOCGState: 14,
        e_Rendition: 15,
        e_Trans: 16,
        e_GoTo3DView: 17,
        e_RichMediaExecute: 18,
        e_Unknown: 19
    };
    a.Action.FormActionFlag = {
        e_exclude: 0,
        e_include_no_value_fields: 1,
        e_export_format: 2,
        e_get_method: 3,
        e_submit_coordinates: 4,
        e_xfdf: 5,
        e_include_append_saves: 6,
        e_include_annotations: 7,
        e_submit_pdf: 8,
        e_canonical_format: 9,
        e_excl_non_user_annots: 10,
        e_excl_F_key: 11,
        e_embed_form: 13
    };
    a.Page.EventType = {
        e_action_trigger_page_open: 11,
        e_action_trigger_page_close: 12
    };
    a.Page.Box = {
        e_media: 0,
        e_crop: 1,
        e_bleed: 2,
        e_trim: 3,
        e_art: 4,
        e_user_crop: 5
    };
    a.Page.Rotate = {
        e_0: 0,
        e_90: 1,
        e_180: 2,
        e_270: 3
    };
    a.Annot.EventType = {
        e_action_trigger_activate: 0,
        e_action_trigger_annot_enter: 1,
        e_action_trigger_annot_exit: 2,
        e_action_trigger_annot_down: 3,
        e_action_trigger_annot_up: 4,
        e_action_trigger_annot_focus: 5,
        e_action_trigger_annot_blur: 6,
        e_action_trigger_annot_page_open: 7,
        e_action_trigger_annot_page_close: 8,
        e_action_trigger_annot_page_visible: 9,
        e_action_trigger_annot_page_invisible: 10
    };
    a.Annot.Type = {
        e_Text: 0,
        e_Link: 1,
        e_FreeText: 2,
        e_Line: 3,
        e_Square: 4,
        e_Circle: 5,
        e_Polygon: 6,
        e_Polyline: 7,
        e_Highlight: 8,
        e_Underline: 9,
        e_Squiggly: 10,
        e_StrikeOut: 11,
        e_Stamp: 12,
        e_Caret: 13,
        e_Ink: 14,
        e_Popup: 15,
        e_FileAttachment: 16,
        e_Sound: 17,
        e_Movie: 18,
        e_Widget: 19,
        e_Screen: 20,
        e_PrinterMark: 21,
        e_TrapNet: 22,
        e_Watermark: 23,
        e_3D: 24,
        e_Redact: 25,
        e_Projection: 26,
        e_RichMedia: 27,
        e_Unknown: 28
    };
    a.Annot.Flag = {
        e_invisible: 0,
        e_hidden: 1,
        e_print: 2,
        e_no_zoom: 3,
        e_no_rotate: 4,
        e_no_view: 5,
        e_annot_read_only: 6,
        e_locked: 7,
        e_toggle_no_view: 8,
        e_locked_contents: 9
    };
    a.AnnotBorderStyle.Style = {
        e_solid: 0,
        e_dashed: 1,
        e_beveled: 2,
        e_inset: 3,
        e_underline: 4
    };
    a.Annot.State = {
        e_normal: 0,
        e_rollover: 1,
        e_down: 2
    };
    a.LineAnnot.EndingStyle = {
        e_Square: 0,
        e_Circle: 1,
        e_Diamond: 2,
        e_OpenArrow: 3,
        e_ClosedArrow: 4,
        e_Butt: 5,
        e_ROpenArrow: 6,
        e_RClosedArrow: 7,
        e_Slash: 8,
        e_None: 9,
        e_Unknown: 10
    };
    a.LineAnnot.IntentType = {
        e_LineArrow: 0,
        e_LineDimension: 1,
        e_null: 2
    };
    a.LineAnnot.CapPos = {
        e_Inline: 0,
        e_Top: 1
    };
    a.FileAttachmentAnnot.Icon = {
        e_Graph: 0,
        e_PushPin: 1,
        e_Paperclip: 2,
        e_Tag: 3,
        e_Unknown: 4
    };
    a.FreeTextAnnot.IntentName = {
        e_FreeText: 0,
        e_FreeTextCallout: 1,
        e_FreeTextTypeWriter: 2,
        e_Unknown: 3
    };
    a.LinkAnnot.HighlightingMode = {
        e_none: 0,
        e_invert: 1,
        e_outline: 2,
        e_push: 3
    };
    a.MarkupAnnot.BorderEffect = {
        e_None: 0,
        e_Cloudy: 1
    };
    a.PolyLineAnnot.IntentType = {
        e_PolygonCloud: 0,
        e_PolyLineDimension: 1,
        e_PolygonDimension: 2,
        e_Unknown: 3
    };
    a.RedactionAnnot.QuadForm = {
        e_LeftJustified: 0,
        e_Centered: 1,
        e_RightJustified: 2,
        e_None: 3
    };
    a.RubberStampAnnot.Icon = {
        e_Approved: 0,
        e_Experimental: 1,
        e_NotApproved: 2,
        e_AsIs: 3,
        e_Expired: 4,
        e_NotForPublicRelease: 5,
        e_Confidential: 6,
        e_Final: 7,
        e_Sold: 8,
        e_Departmental: 9,
        e_ForComment: 10,
        e_TopSecret: 11,
        e_ForPublicRelease: 12,
        e_Draft: 13,
        e_Unknown: 14
    };
    a.ScreenAnnot.ScaleType = {
        e_Anamorphic: 0,
        e_Proportional: 1
    };
    a.ScreenAnnot.ScaleCondition = {
        e_Always: 0,
        e_WhenBigger: 1,
        e_WhenSmaller: 2,
        e_Never: 3
    };
    a.ScreenAnnot.IconCaptionRelation = {
        e_NoIcon: 0,
        e_NoCaption: 1,
        e_CBelowI: 2,
        e_CAboveI: 3,
        e_CRightILeft: 4,
        e_CLeftIRight: 5,
        e_COverlayI: 6
    };
    a.SoundAnnot.Icon = {
        e_Speaker: 0,
        e_Mic: 1,
        e_Unknown: 2
    };
    a.TextAnnot.Icon = {
        e_Comment: 0,
        e_Key: 1,
        e_Help: 2,
        e_NewParagraph: 3,
        e_Paragraph: 4,
        e_Insert: 5,
        e_Note: 6,
        e_Unknown: 7
    };
    a.WidgetAnnot.HighlightingMode = {
        e_none: 0,
        e_invert: 1,
        e_outline: 2,
        e_push: 3,
        e_toggle: 4
    };
    a.WidgetAnnot.ScaleType = {
        e_Anamorphic: 0,
        e_Proportional: 1
    };
    a.WidgetAnnot.IconCaptionRelation = {
        e_NoIcon: 0,
        e_NoCaption: 1,
        e_CBelowI: 2,
        e_CAboveI: 3,
        e_CRightILeft: 4,
        e_CLeftIRight: 5,
        e_COverlayI: 6
    };
    a.WidgetAnnot.ScaleCondition = {
        e_Always: 0,
        e_WhenBigger: 1,
        e_WhenSmaller: 2,
        e_Never: 3
    };
    a.ColorSpace.Type = {
        e_device_gray: 0,
        e_device_rgb: 1,
        e_device_cmyk: 2,
        e_cal_gray: 3,
        e_cal_rgb: 4,
        e_lab: 5,
        e_icc: 6,
        e_indexed: 7,
        e_pattern: 8,
        e_separation: 9,
        e_device_n: 10,
        e_null: 11
    };
    a.DocumentConversion.Result = {
        e_Success: 0,
        e_Incomplete: 1,
        e_Failure: 2
    };
    a.TemplateDocument.Result = {
        e_Success: 0,
        e_Incomplete: 1,
        e_Failure: 2
    };
    a.Convert.PrinterMode = {
        e_auto: 0,
        e_interop_only: 1,
        e_printer_only: 2,
        e_prefer_builtin_converter: 3
    };
    a.Destination.FitType = {
        e_XYZ: 0,
        e_Fit: 1,
        e_FitH: 2,
        e_FitV: 3,
        e_FitR: 4,
        e_FitB: 5,
        e_FitBH: 6,
        e_FitBV: 7
    };
    a.GState.Attribute = {
        e_transform: 0,
        e_rendering_intent: 1,
        e_stroke_cs: 2,
        e_stroke_color: 3,
        e_fill_cs: 4,
        e_fill_color: 5,
        e_line_width: 6,
        e_line_cap: 7,
        e_line_join: 8,
        e_flatness: 9,
        e_miter_limit: 10,
        e_dash_pattern: 11,
        e_char_spacing: 12,
        e_word_spacing: 13,
        e_horizontal_scale: 14,
        e_leading: 15,
        e_font: 16,
        e_font_size: 17,
        e_text_render_mode: 18,
        e_text_rise: 19,
        e_text_knockout: 20,
        e_text_pos_offset: 21,
        e_blend_mode: 22,
        e_opacity_fill: 23,
        e_opacity_stroke: 24,
        e_alpha_is_shape: 25,
        e_soft_mask: 26,
        e_smoothnes: 27,
        e_auto_stoke_adjust: 28,
        e_stroke_overprint: 29,
        e_fill_overprint: 30,
        e_overprint_mode: 31,
        e_transfer_funct: 32,
        e_BG_funct: 33,
        e_UCR_funct: 34,
        e_halftone: 35,
        e_null: 36
    };
    a.GState.LineCap = {
        e_butt_cap: 0,
        e_round_cap: 1,
        e_square_cap: 2
    };
    a.GState.LineJoin = {
        e_miter_join: 0,
        e_round_join: 1,
        e_bevel_join: 2
    };
    a.GState.TextRenderingMode = {
        e_fill_text: 0,
        e_stroke_text: 1,
        e_fill_stroke_text: 2,
        e_invisible_text: 3,
        e_fill_clip_text: 4,
        e_stroke_clip_text: 5,
        e_fill_stroke_clip_text: 6,
        e_clip_text: 7
    };
    a.GState.RenderingIntent = {
        e_absolute_colorimetric: 0,
        e_relative_colorimetric: 1,
        e_saturation: 2,
        e_perceptual: 3
    };
    a.GState.BlendMode = {
        e_bl_compatible: 0,
        e_bl_normal: 1,
        e_bl_multiply: 2,
        e_bl_screen: 3,
        e_bl_difference: 4,
        e_bl_darken: 5,
        e_bl_lighten: 6,
        e_bl_color_dodge: 7,
        e_bl_color_burn: 8,
        e_bl_exclusion: 9,
        e_bl_hard_light: 10,
        e_bl_overlay: 11,
        e_bl_soft_light: 12,
        e_bl_luminosity: 13,
        e_bl_hue: 14,
        e_bl_saturation: 15,
        e_bl_color: 16
    };
    a.Element.Type = {
        e_null: 0,
        e_path: 1,
        e_text_begin: 2,
        e_text: 3,
        e_text_new_line: 4,
        e_text_end: 5,
        e_image: 6,
        e_inline_image: 7,
        e_shading: 8,
        e_form: 9,
        e_group_begin: 10,
        e_group_end: 11,
        e_marked_content_begin: 12,
        e_marked_content_end: 13,
        e_marked_content_point: 14
    };
    a.Element.PathSegmentType = {
        e_moveto: 1,
        e_lineto: 2,
        e_cubicto: 3,
        e_conicto: 4,
        e_rect: 5,
        e_closepath: 6
    };
    a.ShapedText.ShapingStatus = {
        e_FullShaping: 0,
        e_PartialShaping: 1,
        e_NoShaping: 2
    };
    a.ShapedText.FailureReason = {
        e_NoFailure: 0,
        e_UnsupportedFontType: 1,
        e_NotIndexEncoded: 2,
        e_FontDataNotFound: 3
    };
    a.ElementWriter.WriteMode = {
        e_underlay: 0,
        e_overlay: 1,
        e_replacement: 2
    };
    a.Flattener.Threshold = {
        e_very_strict: 0,
        e_strict: 1,
        e_default: 2,
        e_keep_most: 3,
        e_keep_all: 4
    };
    a.Flattener.Mode = {
        e_simple: 0,
        e_fast: 1
    };
    a.Font.StandardType1Font = {
        e_times_roman: 0,
        e_times_bold: 1,
        e_times_italic: 2,
        e_times_bold_italic: 3,
        e_helvetica: 4,
        e_helvetica_bold: 5,
        e_helvetica_oblique: 6,
        e_helvetica_bold_oblique: 7,
        e_courier: 8,
        e_courier_bold: 9,
        e_courier_oblique: 10,
        e_courier_bold_oblique: 11,
        e_symbol: 12,
        e_zapf_dingbats: 13,
        e_null: 14
    };
    a.Font.Encoding = {
        e_IdentityH: 0,
        e_Indices: 1
    };
    a.Font.Type = {
        e_Type1: 0,
        e_TrueType: 1,
        e_MMType1: 2,
        e_Type3: 3,
        e_Type0: 4,
        e_CIDType0: 5,
        e_CIDType2: 6
    };
    a.Function.Type = {
        e_sampled: 0,
        e_exponential: 2,
        e_stitching: 3,
        e_postscript: 4
    };
    a.HTML2PDF.WebPageSettings.ErrorHandling = {
        e_abort: 0,
        e_skip: 1,
        e_ignore: 2
    };
    a.HTML2PDF.Proxy.Type = {
        e_default: 0,
        e_none: 1,
        e_http: 2,
        e_socks5: 3
    };
    a.Image.InputFilter = {
        e_none: 0,
        e_jpeg: 1,
        e_jp2: 2,
        e_flate: 3,
        e_g3: 4,
        e_g4: 5,
        e_ascii_hex: 6
    };
    a.PageLabel.Style = {
        e_decimal: 0,
        e_roman_uppercase: 1,
        e_roman_lowercase: 2,
        e_alphabetic_uppercase: 3,
        e_alphabetic_lowercase: 4,
        e_none: 5
    };
    a.PageSet.Filter = {
        e_all: 0,
        e_even: 1,
        e_odd: 2
    };
    a.PatternColor.Type = {
        e_uncolored_tiling_pattern: 0,
        e_colored_tiling_pattern: 1,
        e_shading: 2,
        e_null: 3
    };
    a.PatternColor.TilingType = {
        e_constant_spacing: 0,
        e_no_distortion: 1,
        e_constant_spacing_fast_fill: 2
    };
    a.GeometryCollection.SnappingMode = {
        e_DefaultSnapMode: 14,
        e_PointOnLine: 1,
        e_LineMidpoint: 2,
        e_LineIntersection: 4,
        e_PathEndpoint: 8
    };
    a.DigestAlgorithm.Type = {
        e_SHA1: 0,
        e_SHA256: 1,
        e_SHA384: 2,
        e_SHA512: 3,
        e_RIPEMD160: 4,
        e_unknown_digest_algorithm: 5
    };
    a.ObjectIdentifier.Predefined = {
        e_commonName: 0,
        e_surname: 1,
        e_countryName: 2,
        e_localityName: 3,
        e_stateOrProvinceName: 4,
        e_streetAddress: 5,
        e_organizationName: 6,
        e_organizationalUnitName: 7,
        e_SHA1: 8,
        e_SHA256: 9,
        e_SHA384: 10,
        e_SHA512: 11,
        e_RIPEMD160: 12,
        e_RSA_encryption_PKCS1: 13
    };
    a.DigitalSignatureField.SubFilterType = {
        e_adbe_x509_rsa_sha1: 0,
        e_adbe_pkcs7_detached: 1,
        e_adbe_pkcs7_sha1: 2,
        e_ETSI_CAdES_detached: 3,
        e_ETSI_RFC3161: 4,
        e_unknown: 5,
        e_absent: 6
    };
    a.DigitalSignatureField.DocumentPermissions = {
        e_no_changes_allowed: 1,
        e_formfilling_signing_allowed: 2,
        e_annotating_formfilling_signing_allowed: 3,
        e_unrestricted: 4
    };
    a.DigitalSignatureField.FieldPermissions = {
        e_lock_all: 0,
        e_include: 1,
        e_exclude: 2
    };
    a.PDFDoc.EventType = {
        e_action_trigger_doc_will_close: 17,
        e_action_trigger_doc_will_save: 18,
        e_action_trigger_doc_did_save: 19,
        e_action_trigger_doc_will_print: 20,
        e_action_trigger_doc_did_print: 21
    };
    a.PDFDoc.InsertFlag = {
        e_none: 0,
        e_insert_bookmark: 1
    };
    a.PDFDoc.ExtractFlag = {
        e_forms_only: 0,
        e_annots_only: 1,
        e_both: 2
    };
    a.PDFDoc.SignaturesVerificationStatus = {
        e_unsigned: 0,
        e_failure: 1,
        e_untrusted: 2,
        e_unsupported: 3,
        e_verified: 4
    };
    a.PDFDocViewPrefs.PageMode = {
        e_UseNone: 0,
        e_UseThumbs: 1,
        e_UseBookmarks: 2,
        e_FullScreen: 3,
        e_UseOC: 4,
        e_UseAttachments: 5
    };
    a.PDFDocViewPrefs.PageLayout = {
        e_Default: 0,
        e_SinglePage: 1,
        e_OneColumn: 2,
        e_TwoColumnLeft: 3,
        e_TwoColumnRight: 4,
        e_TwoPageLeft: 5,
        e_TwoPageRight: 6
    };
    a.PDFDocViewPrefs.ViewerPref = {
        e_HideToolbar: 0,
        e_HideMenubar: 1,
        e_HideWindowUI: 2,
        e_FitWindow: 3,
        e_CenterWindow: 4,
        e_DisplayDocTitle: 5
    };
    a.PDFRasterizer.Type = {
        e_BuiltIn: 0,
        e_GDIPlus: 1
    };
    a.PDFRasterizer.OverprintPreviewMode = {
        e_op_off: 0,
        e_op_on: 1,
        e_op_pdfx_on: 2
    };
    a.PDFRasterizer.ColorPostProcessMode = {
        e_postprocess_none: 0,
        e_postprocess_invert: 1,
        e_postprocess_gradient_map: 2,
        e_postprocess_night_mode: 3
    };
    a.PDFDraw.PixelFormat = {
        e_rgba: 0,
        e_bgra: 1,
        e_rgb: 2,
        e_bgr: 3,
        e_gray: 4,
        e_gray_alpha: 5,
        e_cmyk: 6
    };
    a.CMSType = {
        e_lcms: 0,
        e_icm: 1,
        e_no_cms: 2
    };
    a.CharacterOrdering = {
        e_Identity: 0,
        e_Japan1: 1,
        e_Japan2: 2,
        e_GB1: 3,
        e_CNS1: 4,
        e_Korea1: 5
    };
    a.LogLevel = {
        e_LogLevel_Off: -1,
        e_LogLevel_Fatal: 5,
        e_LogLevel_Error: 4,
        e_LogLevel_Warning: 3,
        e_LogLevel_Info: 2,
        e_LogLevel_Trace: 1,
        e_LogLevel_Debug: 0
    };
    a.ConnectionErrorHandlingMode = {
        e_continue: 0,
        e_continue_unless_switching_to_demo: 1,
        e_stop: 2
    };
    a.Shading.Type = {
        e_function_shading: 0,
        e_axial_shading: 1,
        e_radial_shading: 2,
        e_free_gouraud_shading: 3,
        e_lattice_gouraud_shading: 4,
        e_coons_shading: 5,
        e_tensor_shading: 6,
        e_null: 7
    };
    a.Stamper.SizeType = {
        e_relative_scale: 1,
        e_absolute_size: 2,
        e_font_size: 3
    };
    a.Stamper.TextAlignment = {
        e_align_left: -1,
        e_align_center: 0,
        e_align_right: 1
    };
    a.Stamper.HorizontalAlignment = {
        e_horizontal_left: -1,
        e_horizontal_center: 0,
        e_horizontal_right: 1
    };
    a.Stamper.VerticalAlignment = {
        e_vertical_bottom: -1,
        e_vertical_center: 0,
        e_vertical_top: 1
    };
    a.TextExtractor.ProcessingFlags = {
        e_no_ligature_exp: 1,
        e_no_dup_remove: 2,
        e_punct_break: 4,
        e_remove_hidden_text: 8,
        e_no_invisible_text: 16,
        e_no_watermarks: 128,
        e_extract_using_zorder: 256
    };
    a.TextExtractor.XMLOutputFlags = {
        e_words_as_elements: 1,
        e_output_bbox: 2,
        e_output_style_info: 4
    };
    a.TextSearch.ResultCode = {
        e_done: 0,
        e_page: 1,
        e_found: 2
    };
    a.TextSearch.Mode = {
        e_reg_expression: 1,
        e_case_sensitive: 2,
        e_whole_word: 4,
        e_search_up: 8,
        e_page_stop: 16,
        e_highlight: 32,
        e_ambient_string: 64
    };
    a.Obj.Type = {
        e_null: 0,
        e_bool: 1,
        e_number: 2,
        e_name: 3,
        e_string: 4,
        e_dict: 5,
        e_array: 6,
        e_stream: 7
    };
    a.SDFDoc.SaveOptions = {
        e_incremental: 1,
        e_remove_unused: 2,
        e_hex_strings: 4,
        e_omit_xref: 8,
        e_linearized: 16,
        e_compatibility: 32
    };
    a.SecurityHandler.Permission = {
        e_owner: 1,
        e_doc_open: 2,
        e_doc_modify: 3,
        e_print: 4,
        e_print_high: 5,
        e_extract_content: 6,
        e_mod_annot: 7,
        e_fill_forms: 8,
        e_access_support: 9,
        e_assemble_doc: 10
    };
    a.SecurityHandler.AlgorithmType = {
        e_RC4_40: 1,
        e_RC4_128: 2,
        e_AES: 3,
        e_AES_256: 4
    };
    a.VerificationOptions.SecurityLevel = {
        e_compatibility_and_archiving: 0,
        e_maximum: 1
    };
    a.VerificationOptions.TimeMode = {
        e_signing: 0,
        e_timestamp: 1,
        e_current: 2
    };
    a.VerificationOptions.CertificateTrustFlag = {
        e_signing_trust: 1,
        e_certification_trust: 2,
        e_dynamic_content: 4,
        e_javascript: 16,
        e_identity: 32,
        e_trust_anchor: 64,
        e_default_trust: 97,
        e_complete_trust: 119
    };
    a.VerificationResult.DocumentStatus = {
        e_no_error: 0,
        e_corrupt_file: 1,
        e_unsigned: 2,
        e_bad_byteranges: 3,
        e_corrupt_cryptographic_contents: 4
    };
    a.VerificationResult.DigestStatus = {
        e_digest_invalid: 0,
        e_digest_verified: 1,
        e_digest_verification_disabled: 2,
        e_weak_digest_algorithm_but_digest_verifiable: 3,
        e_no_digest_status: 4,
        e_unsupported_encoding: 5
    };
    a.VerificationResult.TrustStatus = {
        e_trust_verified: 0,
        e_untrusted: 1,
        e_trust_verification_disabled: 2,
        e_no_trust_status: 3
    };
    a.VerificationResult.ModificationPermissionsStatus = {
        e_invalidated_by_disallowed_changes: 0,
        e_has_allowed_changes: 1,
        e_unmodified: 2,
        e_permissions_verification_disabled: 3,
        e_no_permissions_status: 4
    };
    a.DisallowedChange.Type = {
        e_form_filled: 0,
        e_digital_signature_signed: 1,
        e_page_template_instantiated: 2,
        e_annotation_created_or_updated_or_deleted: 3,
        e_other: 4,
        e_unknown: 5
    };
    a.Iterator.prototype.hasNext = function() {
        return a.sendWithPromise("Iterator.hasNext", {
            itr: this.id
        })
    };
    a.Iterator.prototype.next = function() {
        return a.sendWithPromise("Iterator.next", {
            itr: this.id
        })
    };
    a.DictIterator.prototype.hasNext = function() {
        return a.sendWithPromise("DictIterator.hasNext", {
            itr: this.id
        })
    };
    a.DictIterator.prototype.key = function() {
        return a.sendWithPromise("DictIterator.key", {
            itr: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.DictIterator.prototype.value = function() {
        return a.sendWithPromise("DictIterator.value", {
            itr: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.DictIterator.prototype.next =
        function() {
            return a.sendWithPromise("DictIterator.next", {
                itr: this.id
            })
        };
    a.Matrix2D.prototype.copy = function() {
        k("copy", this.yieldFunction);
        return a.sendWithPromise("Matrix2D.copy", {
            m: this
        }).then(function(b) {
            return new a.Matrix2D(b)
        })
    };
    a.Matrix2D.prototype.set = function(b, c, e, m, f, g) {
        d(arguments.length, 6, "set", "(number, number, number, number, number, number)", [
            [b, "number"],
            [c, "number"],
            [e, "number"],
            [m, "number"],
            [f, "number"],
            [g, "number"]
        ]);
        k("set", this.yieldFunction);
        var w = this;
        this.yieldFunction = "Matrix2D.set";
        return a.sendWithPromise("Matrix2D.set", {
            matrix: this,
            a: b,
            b: c,
            c: e,
            d: m,
            h: f,
            v: g
        }).then(function(a) {
            w.yieldFunction = void 0;
            q(a, w)
        })
    };
    a.Matrix2D.prototype.concat = function(b, c, e, m, f, g) {
        d(arguments.length, 6, "concat", "(number, number, number, number, number, number)", [
            [b, "number"],
            [c, "number"],
            [e, "number"],
            [m, "number"],
            [f, "number"],
            [g, "number"]
        ]);
        k("concat", this.yieldFunction);
        var w = this;
        this.yieldFunction = "Matrix2D.concat";
        return a.sendWithPromise("Matrix2D.concat", {
            matrix: this,
            a: b,
            b: c,
            c: e,
            d: m,
            h: f,
            v: g
        }).then(function(a) {
            w.yieldFunction =
                void 0;
            q(a, w)
        })
    };
    a.Matrix2D.prototype.equals = function(b) {
        d(arguments.length, 1, "equals", "(PDFNet.Matrix2D)", [
            [b, "Structure", a.Matrix2D, "Matrix2D"]
        ]);
        k("equals", this.yieldFunction);
        n("equals", [
            [b, 0]
        ]);
        return a.sendWithPromise("Matrix2D.equals", {
            m1: this,
            m2: b
        })
    };
    a.Matrix2D.prototype.inverse = function() {
        k("inverse", this.yieldFunction);
        return a.sendWithPromise("Matrix2D.inverse", {
            matrix: this
        }).then(function(b) {
            return new a.Matrix2D(b)
        })
    };
    a.Matrix2D.prototype.translate = function(b, c) {
        d(arguments.length, 2,
            "translate", "(number, number)", [
                [b, "number"],
                [c, "number"]
            ]);
        k("translate", this.yieldFunction);
        var e = this;
        this.yieldFunction = "Matrix2D.translate";
        return a.sendWithPromise("Matrix2D.translate", {
            matrix: this,
            h: b,
            v: c
        }).then(function(a) {
            e.yieldFunction = void 0;
            q(a, e)
        })
    };
    a.Matrix2D.prototype.preTranslate = function(b, c) {
        d(arguments.length, 2, "preTranslate", "(number, number)", [
            [b, "number"],
            [c, "number"]
        ]);
        k("preTranslate", this.yieldFunction);
        var e = this;
        this.yieldFunction = "Matrix2D.preTranslate";
        return a.sendWithPromise("Matrix2D.preTranslate", {
            matrix: this,
            h: b,
            v: c
        }).then(function(a) {
            e.yieldFunction = void 0;
            q(a, e)
        })
    };
    a.Matrix2D.prototype.postTranslate = function(b, c) {
        d(arguments.length, 2, "postTranslate", "(number, number)", [
            [b, "number"],
            [c, "number"]
        ]);
        k("postTranslate", this.yieldFunction);
        var e = this;
        this.yieldFunction = "Matrix2D.postTranslate";
        return a.sendWithPromise("Matrix2D.postTranslate", {
            matrix: this,
            h: b,
            v: c
        }).then(function(a) {
            e.yieldFunction = void 0;
            q(a, e)
        })
    };
    a.Matrix2D.prototype.scale = function(b, c) {
        d(arguments.length, 2, "scale", "(number, number)",
            [
                [b, "number"],
                [c, "number"]
            ]);
        k("scale", this.yieldFunction);
        var e = this;
        this.yieldFunction = "Matrix2D.scale";
        return a.sendWithPromise("Matrix2D.scale", {
            matrix: this,
            h: b,
            v: c
        }).then(function(a) {
            e.yieldFunction = void 0;
            q(a, e)
        })
    };
    a.Matrix2D.createZeroMatrix = function() {
        return a.sendWithPromise("matrix2DCreateZeroMatrix", {}).then(function(b) {
            return new a.Matrix2D(b)
        })
    };
    a.Matrix2D.createIdentityMatrix = function() {
        return a.sendWithPromise("matrix2DCreateIdentityMatrix", {}).then(function(b) {
            return new a.Matrix2D(b)
        })
    };
    a.Matrix2D.createRotationMatrix = function(b) {
        d(arguments.length, 1, "createRotationMatrix", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("matrix2DCreateRotationMatrix", {
            angle: b
        }).then(function(b) {
            return new a.Matrix2D(b)
        })
    };
    a.Matrix2D.prototype.multiply = function(b) {
        d(arguments.length, 1, "multiply", "(PDFNet.Matrix2D)", [
            [b, "Structure", a.Matrix2D, "Matrix2D"]
        ]);
        k("multiply", this.yieldFunction);
        n("multiply", [
            [b, 0]
        ]);
        var c = this;
        this.yieldFunction = "Matrix2D.multiply";
        return a.sendWithPromise("Matrix2D.multiply", {
            matrix: this,
            m: b
        }).then(function(a) {
            c.yieldFunction = void 0;
            q(a, c)
        })
    };
    a.Field.create = function(b) {
        d(arguments.length, 1, "create", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("fieldCreate", {
            field_dict: b.id
        }).then(function(b) {
            return new a.Field(b)
        })
    };
    a.Field.prototype.isValid = function() {
        k("isValid", this.yieldFunction);
        return a.sendWithPromise("Field.isValid", {
            field: this
        })
    };
    a.Field.prototype.getType = function() {
        k("getType", this.yieldFunction);
        return a.sendWithPromise("Field.getType", {
            field: this
        })
    };
    a.Field.prototype.getValue = function() {
        k("getValue", this.yieldFunction);
        return a.sendWithPromise("Field.getValue", {
            field: this
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Field.prototype.getValueAsString = function() {
        k("getValueAsString", this.yieldFunction);
        return a.sendWithPromise("Field.getValueAsString", {
            field: this
        })
    };
    a.Field.prototype.getDefaultValueAsString = function() {
        k("getDefaultValueAsString", this.yieldFunction);
        return a.sendWithPromise("Field.getDefaultValueAsString", {
            field: this
        })
    };
    a.Field.prototype.setValueAsString = function(b) {
        d(arguments.length, 1, "setValueAsString", "(string)", [
            [b, "string"]
        ]);
        k("setValueAsString", this.yieldFunction);
        var c = this;
        this.yieldFunction = "Field.setValueAsString";
        return a.sendWithPromise("Field.setValueAsString", {
            field: this,
            value: b
        }).then(function(b) {
            c.yieldFunction = void 0;
            b.result = l(a.ViewChangeCollection, b.result);
            q(b.field, c);
            return b.result
        })
    };
    a.Field.prototype.setValue = function(b) {
        d(arguments.length, 1, "setValue", "(PDFNet.Obj)", [
            [b, "Object", a.Obj,
                "Obj"
            ]
        ]);
        k("setValue", this.yieldFunction);
        var c = this;
        this.yieldFunction = "Field.setValue";
        return a.sendWithPromise("Field.setValue", {
            field: this,
            value: b.id
        }).then(function(b) {
            c.yieldFunction = void 0;
            b.result = l(a.ViewChangeCollection, b.result);
            q(b.field, c);
            return b.result
        })
    };
    a.Field.prototype.setValueAsBool = function(b) {
        d(arguments.length, 1, "setValueAsBool", "(boolean)", [
            [b, "boolean"]
        ]);
        k("setValueAsBool", this.yieldFunction);
        var c = this;
        this.yieldFunction = "Field.setValueAsBool";
        return a.sendWithPromise("Field.setValueAsBool", {
            field: this,
            value: b
        }).then(function(b) {
            c.yieldFunction = void 0;
            b.result = l(a.ViewChangeCollection, b.result);
            q(b.field, c);
            return b.result
        })
    };
    a.Field.prototype.getTriggerAction = function(b) {
        d(arguments.length, 1, "getTriggerAction", "(number)", [
            [b, "number"]
        ]);
        k("getTriggerAction", this.yieldFunction);
        return a.sendWithPromise("Field.getTriggerAction", {
            field: this,
            trigger: b
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Field.prototype.getValueAsBool = function() {
        k("getValueAsBool", this.yieldFunction);
        return a.sendWithPromise("Field.getValueAsBool", {
            field: this
        })
    };
    a.Field.prototype.refreshAppearance = function() {
        k("refreshAppearance", this.yieldFunction);
        var b = this;
        this.yieldFunction = "Field.refreshAppearance";
        return a.sendWithPromise("Field.refreshAppearance", {
            field: this
        }).then(function(a) {
            b.yieldFunction = void 0;
            q(a, b)
        })
    };
    a.Field.prototype.eraseAppearance = function() {
        k("eraseAppearance", this.yieldFunction);
        var b = this;
        this.yieldFunction = "Field.eraseAppearance";
        return a.sendWithPromise("Field.eraseAppearance", {
            field: this
        }).then(function(a) {
            b.yieldFunction =
                void 0;
            q(a, b)
        })
    };
    a.Field.prototype.getDefaultValue = function() {
        k("getDefaultValue", this.yieldFunction);
        return a.sendWithPromise("Field.getDefaultValue", {
            field: this
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Field.prototype.getName = function() {
        k("getName", this.yieldFunction);
        return a.sendWithPromise("Field.getName", {
            field: this
        })
    };
    a.Field.prototype.getPartialName = function() {
        k("getPartialName", this.yieldFunction);
        return a.sendWithPromise("Field.getPartialName", {
            field: this
        })
    };
    a.Field.prototype.rename = function(b) {
        d(arguments.length,
            1, "rename", "(string)", [
                [b, "string"]
            ]);
        k("rename", this.yieldFunction);
        var c = this;
        this.yieldFunction = "Field.rename";
        return a.sendWithPromise("Field.rename", {
            field: this,
            field_name: b
        }).then(function(a) {
            c.yieldFunction = void 0;
            q(a, c)
        })
    };
    a.Field.prototype.isAnnot = function() {
        k("isAnnot", this.yieldFunction);
        return a.sendWithPromise("Field.isAnnot", {
            field: this
        })
    };
    a.Field.prototype.useSignatureHandler = function(b) {
        d(arguments.length, 1, "useSignatureHandler", "(number)", [
            [b, "number"]
        ]);
        k("useSignatureHandler", this.yieldFunction);
        var c = this;
        this.yieldFunction = "Field.useSignatureHandler";
        return a.sendWithPromise("Field.useSignatureHandler", {
            field: this,
            signature_handler_id: b
        }).then(function(b) {
            c.yieldFunction = void 0;
            b.result = f(a.Obj, b.result);
            q(b.field, c);
            return b.result
        })
    };
    a.Field.prototype.getFlag = function(b) {
        d(arguments.length, 1, "getFlag", "(number)", [
            [b, "number"]
        ]);
        k("getFlag", this.yieldFunction);
        return a.sendWithPromise("Field.getFlag", {
            field: this,
            flag: b
        })
    };
    a.Field.prototype.setFlag = function(b, c) {
        d(arguments.length, 2, "setFlag",
            "(number, boolean)", [
                [b, "number"],
                [c, "boolean"]
            ]);
        k("setFlag", this.yieldFunction);
        var e = this;
        this.yieldFunction = "Field.setFlag";
        return a.sendWithPromise("Field.setFlag", {
            field: this,
            flag: b,
            value: c
        }).then(function(a) {
            e.yieldFunction = void 0;
            q(a, e)
        })
    };
    a.Field.prototype.getJustification = function() {
        k("getJustification", this.yieldFunction);
        var b = this;
        this.yieldFunction = "Field.getJustification";
        return a.sendWithPromise("Field.getJustification", {
            field: this
        }).then(function(a) {
            b.yieldFunction = void 0;
            q(a.field,
                b);
            return a.result
        })
    };
    a.Field.prototype.setJustification = function(b) {
        d(arguments.length, 1, "setJustification", "(number)", [
            [b, "number"]
        ]);
        k("setJustification", this.yieldFunction);
        var c = this;
        this.yieldFunction = "Field.setJustification";
        return a.sendWithPromise("Field.setJustification", {
            field: this,
            j: b
        }).then(function(a) {
            c.yieldFunction = void 0;
            q(a, c)
        })
    };
    a.Field.prototype.setMaxLen = function(b) {
        d(arguments.length, 1, "setMaxLen", "(number)", [
            [b, "number"]
        ]);
        k("setMaxLen", this.yieldFunction);
        var c = this;
        this.yieldFunction =
            "Field.setMaxLen";
        return a.sendWithPromise("Field.setMaxLen", {
            field: this,
            max_len: b
        }).then(function(a) {
            c.yieldFunction = void 0;
            q(a, c)
        })
    };
    a.Field.prototype.getMaxLen = function() {
        k("getMaxLen", this.yieldFunction);
        return a.sendWithPromise("Field.getMaxLen", {
            field: this
        })
    };
    a.Field.prototype.getDefaultAppearance = function() {
        k("getDefaultAppearance", this.yieldFunction);
        var b = this;
        this.yieldFunction = "Field.getDefaultAppearance";
        return a.sendWithPromise("Field.getDefaultAppearance", {
            field: this
        }).then(function(c) {
            b.yieldFunction =
                void 0;
            c.result = f(a.GState, c.result);
            q(c.field, b);
            return c.result
        })
    };
    a.Field.prototype.getUpdateRect = function() {
        k("getUpdateRect", this.yieldFunction);
        return a.sendWithPromise("Field.getUpdateRect", {
            field: this
        }).then(function(b) {
            return new a.Rect(b)
        })
    };
    a.Field.prototype.flatten = function(b) {
        d(arguments.length, 1, "flatten", "(PDFNet.Page)", [
            [b, "Object", a.Page, "Page"]
        ]);
        k("flatten", this.yieldFunction);
        var c = this;
        this.yieldFunction = "Field.flatten";
        return a.sendWithPromise("Field.flatten", {
            field: this,
            page: b.id
        }).then(function(a) {
            c.yieldFunction =
                void 0;
            q(a, c)
        })
    };
    a.Field.prototype.findInheritedAttribute = function(b) {
        d(arguments.length, 1, "findInheritedAttribute", "(string)", [
            [b, "string"]
        ]);
        k("findInheritedAttribute", this.yieldFunction);
        return a.sendWithPromise("Field.findInheritedAttribute", {
            field: this,
            attrib: b
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Field.prototype.getSDFObj = function() {
        k("getSDFObj", this.yieldFunction);
        return a.sendWithPromise("Field.getSDFObj", {
            field: this
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Field.prototype.getOptCount =
        function() {
            k("getOptCount", this.yieldFunction);
            return a.sendWithPromise("Field.getOptCount", {
                field: this
            })
        };
    a.Field.prototype.getOpt = function(b) {
        d(arguments.length, 1, "getOpt", "(number)", [
            [b, "number"]
        ]);
        k("getOpt", this.yieldFunction);
        return a.sendWithPromise("Field.getOpt", {
            field: this,
            index: b
        })
    };
    a.Field.prototype.isLockedByDigitalSignature = function() {
        k("isLockedByDigitalSignature", this.yieldFunction);
        return a.sendWithPromise("Field.isLockedByDigitalSignature", {
            field: this
        })
    };
    a.FDFDoc.create = function() {
        return a.sendWithPromise("fdfDocCreate", {}).then(function(b) {
            return l(a.FDFDoc, b)
        })
    };
    a.FDFDoc.createFromFilePath = function(b) {
        d(arguments.length, 1, "createFromFilePath", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("fdfDocCreateFromFilePath", {
            filepath: b
        }).then(function(b) {
            return l(a.FDFDoc, b)
        })
    };
    a.FDFDoc.createFromUFilePath = function(b) {
        d(arguments.length, 1, "createFromUFilePath", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("fdfDocCreateFromUFilePath", {
            filepath: b
        }).then(function(b) {
            return l(a.FDFDoc, b)
        })
    };
    a.FDFDoc.createFromStream =
        function(b) {
            d(arguments.length, 1, "createFromStream", "(PDFNet.Filter)", [
                [b, "Object", a.Filter, "Filter"]
            ]);
            0 != b.id && t(b.id);
            return a.sendWithPromise("fdfDocCreateFromStream", {
                no_own_stream: b.id
            }).then(function(b) {
                return l(a.FDFDoc, b)
            })
        };
    a.FDFDoc.createFromMemoryBuffer = function(b) {
        d(arguments.length, 1, "createFromMemoryBuffer", "(ArrayBuffer|TypedArray)", [
            [b, "ArrayBuffer"]
        ]);
        var c = u(b, !1);
        return a.sendWithPromise("fdfDocCreateFromMemoryBuffer", {
            buf: c
        }).then(function(b) {
            return l(a.FDFDoc, b)
        })
    };
    a.FDFDoc.prototype.isModified =
        function() {
            return a.sendWithPromise("FDFDoc.isModified", {
                doc: this.id
            })
        };
    a.FDFDoc.prototype.save = function(b) {
        d(arguments.length, 1, "save", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("FDFDoc.save", {
            doc: this.id,
            path: b
        })
    };
    a.FDFDoc.prototype.saveMemoryBuffer = function() {
        return a.sendWithPromise("FDFDoc.saveMemoryBuffer", {
            doc: this.id
        }).then(function(a) {
            return new Uint8Array(a)
        })
    };
    a.FDFDoc.prototype.getTrailer = function() {
        return a.sendWithPromise("FDFDoc.getTrailer", {
            doc: this.id
        }).then(function(b) {
            return f(a.Obj,
                b)
        })
    };
    a.FDFDoc.prototype.getRoot = function() {
        return a.sendWithPromise("FDFDoc.getRoot", {
            doc: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.FDFDoc.prototype.getFDF = function() {
        return a.sendWithPromise("FDFDoc.getFDF", {
            doc: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.FDFDoc.prototype.getPDFFileName = function() {
        return a.sendWithPromise("FDFDoc.getPDFFileName", {
            doc: this.id
        })
    };
    a.FDFDoc.prototype.setPDFFileName = function(b) {
        d(arguments.length, 1, "setPDFFileName", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("FDFDoc.setPDFFileName", {
            doc: this.id,
            filepath: b
        })
    };
    a.FDFDoc.prototype.getID = function() {
        return a.sendWithPromise("FDFDoc.getID", {
            doc: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.FDFDoc.prototype.setID = function(b) {
        d(arguments.length, 1, "setID", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("FDFDoc.setID", {
            doc: this.id,
            id: b.id
        })
    };
    a.FDFDoc.prototype.getFieldIteratorBegin = function() {
        return a.sendWithPromise("FDFDoc.getFieldIteratorBegin", {
            doc: this.id
        }).then(function(b) {
            return l(a.Iterator, b, "FDFField")
        })
    };
    a.FDFDoc.prototype.getFieldIterator = function(b) {
        d(arguments.length, 1, "getFieldIterator", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("FDFDoc.getFieldIterator", {
            doc: this.id,
            field_name: b
        }).then(function(b) {
            return l(a.Iterator, b, "FDFField")
        })
    };
    a.FDFDoc.prototype.getField = function(b) {
        d(arguments.length, 1, "getField", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("FDFDoc.getField", {
            doc: this.id,
            field_name: b
        }).then(function(b) {
            return new a.FDFField(b)
        })
    };
    a.FDFDoc.prototype.fieldCreate = function(b,
        c, e) {
        "undefined" === typeof e && (e = new a.Obj("0"));
        d(arguments.length, 2, "fieldCreate", "(string, number, PDFNet.Obj)", [
            [b, "string"],
            [c, "number"],
            [e, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("FDFDoc.fieldCreate", {
            doc: this.id,
            field_name: b,
            type: c,
            field_value: e.id
        }).then(function(b) {
            return new a.FDFField(b)
        })
    };
    a.FDFDoc.prototype.fieldCreateFromString = function(b, c, e) {
        d(arguments.length, 3, "fieldCreateFromString", "(string, number, string)", [
            [b, "string"],
            [c, "number"],
            [e, "string"]
        ]);
        return a.sendWithPromise("FDFDoc.fieldCreateFromString", {
            doc: this.id,
            field_name: b,
            type: c,
            field_value: e
        }).then(function(b) {
            return new a.FDFField(b)
        })
    };
    a.FDFDoc.prototype.getSDFDoc = function() {
        return a.sendWithPromise("FDFDoc.getSDFDoc", {
            doc: this.id
        }).then(function(b) {
            return f(a.SDFDoc, b)
        })
    };
    a.FDFDoc.createFromXFDF = function(b) {
        d(arguments.length, 1, "createFromXFDF", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("fdfDocCreateFromXFDF", {
            file_name: b
        }).then(function(b) {
            return l(a.FDFDoc, b)
        })
    };
    a.FDFDoc.prototype.saveAsXFDF = function(b) {
        d(arguments.length, 1,
            "saveAsXFDF", "(string)", [
                [b, "string"]
            ]);
        return a.sendWithPromise("FDFDoc.saveAsXFDF", {
            doc: this.id,
            filepath: b
        })
    };
    a.FDFDoc.prototype.saveAsXFDFWithOptions = function(b, c) {
        "undefined" === typeof c && (c = null);
        d(arguments.length, 1, "saveAsXFDFWithOptions", "(string, PDFNet.OptionBase)", [
            [b, "string"],
            [c, "OptionBase"]
        ]);
        n("saveAsXFDFWithOptions", [
            [c, 1]
        ]);
        c = c ? c.getJsonString() : "{}";
        return a.sendWithPromise("FDFDoc.saveAsXFDFWithOptions", {
            doc: this.id,
            filepath: b,
            opts: c
        })
    };
    a.FDFDoc.prototype.saveAsXFDFAsString = function() {
        return a.sendWithPromise("FDFDoc.saveAsXFDFAsString", {
            doc: this.id
        })
    };
    a.FDFDoc.prototype.saveAsXFDFAsStringWithOptions = function(b) {
        "undefined" === typeof b && (b = null);
        d(arguments.length, 0, "saveAsXFDFAsStringWithOptions", "(PDFNet.OptionBase)", [
            [b, "OptionBase"]
        ]);
        n("saveAsXFDFAsStringWithOptions", [
            [b, 0]
        ]);
        b = b ? b.getJsonString() : "{}";
        return a.sendWithPromise("FDFDoc.saveAsXFDFAsStringWithOptions", {
            doc: this.id,
            opts: b
        })
    };
    a.FDFDoc.prototype.mergeAnnots = function(b, c) {
        "undefined" === typeof c && (c = "");
        d(arguments.length, 1, "mergeAnnots", "(string, string)", [
            [b, "string"],
            [c, "string"]
        ]);
        return a.sendWithPromise("FDFDoc.mergeAnnots", {
            doc: this.id,
            command_file: b,
            permitted_user: c
        })
    };
    a.FDFField.create = function(b, c) {
        "undefined" === typeof b && (b = new a.Obj("0"));
        "undefined" === typeof c && (c = new a.Obj("0"));
        d(arguments.length, 0, "create", "(PDFNet.Obj, PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"],
            [c, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("fdfFieldCreate", {
            field_dict: b.id,
            fdf_dict: c.id
        }).then(function(b) {
            return new a.FDFField(b)
        })
    };
    a.FDFField.prototype.getValue = function() {
        k("getValue",
            this.yieldFunction);
        var b = this;
        this.yieldFunction = "FDFField.getValue";
        return a.sendWithPromise("FDFField.getValue", {
            field: this
        }).then(function(c) {
            b.yieldFunction = void 0;
            c.result = f(a.Obj, c.result);
            q(c.field, b);
            return c.result
        })
    };
    a.FDFField.prototype.setValue = function(b) {
        d(arguments.length, 1, "setValue", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        k("setValue", this.yieldFunction);
        var c = this;
        this.yieldFunction = "FDFField.setValue";
        return a.sendWithPromise("FDFField.setValue", {
            field: this,
            value: b.id
        }).then(function(a) {
            c.yieldFunction =
                void 0;
            q(a, c)
        })
    };
    a.FDFField.prototype.getName = function() {
        k("getName", this.yieldFunction);
        var b = this;
        this.yieldFunction = "FDFField.getName";
        return a.sendWithPromise("FDFField.getName", {
            field: this
        }).then(function(a) {
            b.yieldFunction = void 0;
            q(a.field, b);
            return a.result
        })
    };
    a.FDFField.prototype.getPartialName = function() {
        k("getPartialName", this.yieldFunction);
        var b = this;
        this.yieldFunction = "FDFField.getPartialName";
        return a.sendWithPromise("FDFField.getPartialName", {
            field: this
        }).then(function(a) {
            b.yieldFunction =
                void 0;
            q(a.field, b);
            return a.result
        })
    };
    a.FDFField.prototype.getSDFObj = function() {
        k("getSDFObj", this.yieldFunction);
        return a.sendWithPromise("FDFField.getSDFObj", {
            field: this
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.FDFField.prototype.findAttribute = function(b) {
        d(arguments.length, 1, "findAttribute", "(string)", [
            [b, "string"]
        ]);
        k("findAttribute", this.yieldFunction);
        return a.sendWithPromise("FDFField.findAttribute", {
            field: this,
            attrib: b
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Filter.prototype.createASCII85Encode =
        function(b, c) {
            d(arguments.length, 2, "createASCII85Encode", "(number, number)", [
                [b, "number"],
                [c, "number"]
            ]);
            return a.sendWithPromise("Filter.createASCII85Encode", {
                no_own_input_filter: this.id,
                line_width: b,
                buf_sz: c
            }).then(function(b) {
                return l(a.Filter, b)
            })
        };
    a.Filter.createMappedFileFromUString = function(b) {
        d(arguments.length, 1, "createMappedFileFromUString", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("filterCreateMappedFileFromUString", {
            filename: b
        }).then(function(b) {
            return l(a.Filter, b)
        })
    };
    a.Filter.createMemoryFilter =
        function(b, c) {
            d(arguments.length, 2, "createMemoryFilter", "(number, boolean)", [
                [b, "number"],
                [c, "boolean"]
            ]);
            return a.sendWithPromise("filterCreateMemoryFilter", {
                buf_sz: b,
                is_input: c
            }).then(function(b) {
                return l(a.Filter, b)
            })
        };
    a.Filter.createImage2RGBFromElement = function(b) {
        d(arguments.length, 1, "createImage2RGBFromElement", "(PDFNet.Element)", [
            [b, "Object", a.Element, "Element"]
        ]);
        return a.sendWithPromise("filterCreateImage2RGBFromElement", {
            elem: b.id
        }).then(function(b) {
            return l(a.Filter, b)
        })
    };
    a.Filter.createImage2RGBFromObj =
        function(b) {
            d(arguments.length, 1, "createImage2RGBFromObj", "(PDFNet.Obj)", [
                [b, "Object", a.Obj, "Obj"]
            ]);
            return a.sendWithPromise("filterCreateImage2RGBFromObj", {
                obj: b.id
            }).then(function(b) {
                return l(a.Filter, b)
            })
        };
    a.Filter.createImage2RGB = function(b) {
        d(arguments.length, 1, "createImage2RGB", "(PDFNet.Image)", [
            [b, "Object", a.Image, "Image"]
        ]);
        return a.sendWithPromise("filterCreateImage2RGB", {
            img: b.id
        }).then(function(b) {
            return l(a.Filter, b)
        })
    };
    a.Filter.createImage2RGBAFromElement = function(b, c) {
        d(arguments.length,
            2, "createImage2RGBAFromElement", "(PDFNet.Element, boolean)", [
                [b, "Object", a.Element, "Element"],
                [c, "boolean"]
            ]);
        return a.sendWithPromise("filterCreateImage2RGBAFromElement", {
            elem: b.id,
            premultiply: c
        }).then(function(b) {
            return l(a.Filter, b)
        })
    };
    a.Filter.createImage2RGBAFromObj = function(b, c) {
        d(arguments.length, 2, "createImage2RGBAFromObj", "(PDFNet.Obj, boolean)", [
            [b, "Object", a.Obj, "Obj"],
            [c, "boolean"]
        ]);
        return a.sendWithPromise("filterCreateImage2RGBAFromObj", {
            obj: b.id,
            premultiply: c
        }).then(function(b) {
            return l(a.Filter,
                b)
        })
    };
    a.Filter.createImage2RGBA = function(b, c) {
        d(arguments.length, 2, "createImage2RGBA", "(PDFNet.Image, boolean)", [
            [b, "Object", a.Image, "Image"],
            [c, "boolean"]
        ]);
        return a.sendWithPromise("filterCreateImage2RGBA", {
            img: b.id,
            premultiply: c
        }).then(function(b) {
            return l(a.Filter, b)
        })
    };
    a.Filter.prototype.mappedFileFileSize = function() {
        return a.sendWithPromise("Filter.mappedFileFileSize", {
            filter: this.id
        })
    };
    a.Filter.prototype.mappedFileCompare = function(b) {
        d(arguments.length, 1, "mappedFileCompare", "(PDFNet.Filter)",
            [
                [b, "Object", a.Filter, "Filter"]
            ]);
        return a.sendWithPromise("Filter.mappedFileCompare", {
            mf1: this.id,
            mf2: b.id
        })
    };
    a.Filter.prototype.attachFilter = function(b) {
        d(arguments.length, 1, "attachFilter", "(PDFNet.Filter)", [
            [b, "Object", a.Filter, "Filter"]
        ]);
        0 != b.id && t(b.id);
        return a.sendWithPromise("Filter.attachFilter", {
            filter: this.id,
            no_own_attach_filter: b.id
        })
    };
    a.Filter.prototype.releaseAttachedFilter = function() {
        return a.sendWithPromise("Filter.releaseAttachedFilter", {
            filter: this.id
        }).then(function(b) {
            return l(a.Filter,
                b)
        })
    };
    a.Filter.prototype.getAttachedFilter = function() {
        return a.sendWithPromise("Filter.getAttachedFilter", {
            filter: this.id
        }).then(function(b) {
            return f(a.Filter, b)
        })
    };
    a.Filter.prototype.getSourceFilter = function() {
        return a.sendWithPromise("Filter.getSourceFilter", {
            filter: this.id
        }).then(function(b) {
            return f(a.Filter, b)
        })
    };
    a.Filter.prototype.getName = function() {
        return a.sendWithPromise("Filter.getName", {
            filter: this.id
        })
    };
    a.Filter.prototype.getDecodeName = function() {
        return a.sendWithPromise("Filter.getDecodeName", {
            filter: this.id
        })
    };
    a.Filter.prototype.begin = function() {
        return a.sendWithPromise("Filter.begin", {
            filter: this.id
        })
    };
    a.Filter.prototype.size = function() {
        return a.sendWithPromise("Filter.size", {
            filter: this.id
        })
    };
    a.Filter.prototype.consume = function(b) {
        d(arguments.length, 1, "consume", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("Filter.consume", {
            filter: this.id,
            num_bytes: b
        })
    };
    a.Filter.prototype.count = function() {
        return a.sendWithPromise("Filter.count", {
            filter: this.id
        })
    };
    a.Filter.prototype.setCount = function(b) {
        d(arguments.length,
            1, "setCount", "(number)", [
                [b, "number"]
            ]);
        return a.sendWithPromise("Filter.setCount", {
            filter: this.id,
            new_count: b
        })
    };
    a.Filter.prototype.setStreamLength = function(b) {
        d(arguments.length, 1, "setStreamLength", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("Filter.setStreamLength", {
            filter: this.id,
            bytes: b
        })
    };
    a.Filter.prototype.flush = function() {
        return a.sendWithPromise("Filter.flush", {
            filter: this.id
        })
    };
    a.Filter.prototype.flushAll = function() {
        return a.sendWithPromise("Filter.flushAll", {
            filter: this.id
        })
    };
    a.Filter.prototype.isInputFilter =
        function() {
            return a.sendWithPromise("Filter.isInputFilter", {
                filter: this.id
            })
        };
    a.Filter.prototype.canSeek = function() {
        return a.sendWithPromise("Filter.canSeek", {
            filter: this.id
        })
    };
    a.Filter.prototype.writeToFile = function(b, c) {
        d(arguments.length, 2, "writeToFile", "(string, boolean)", [
            [b, "string"],
            [c, "boolean"]
        ]);
        return a.sendWithPromise("Filter.writeToFile", {
            filter: this.id,
            path: b,
            append: c
        })
    };
    a.Filter.prototype.seek = function(b, c) {
        d(arguments.length, 2, "seek", "(number, number)", [
            [b, "number"],
            [c, "number"]
        ]);
        return a.sendWithPromise("Filter.seek", {
            filter: this.id,
            offset: b,
            origin: c
        })
    };
    a.Filter.prototype.tell = function() {
        return a.sendWithPromise("Filter.tell", {
            filter: this.id
        })
    };
    a.Filter.prototype.createInputIterator = function() {
        return a.sendWithPromise("Filter.createInputIterator", {
            filter: this.id
        }).then(function(b) {
            return l(a.Filter, b)
        })
    };
    a.Filter.prototype.getFilePath = function() {
        return a.sendWithPromise("Filter.getFilePath", {
            filter: this.id
        })
    };
    a.Filter.prototype.memoryFilterGetBuffer = function() {
        return a.sendWithPromise("Filter.memoryFilterGetBuffer", {
            filter: this.id
        })
    };
    a.Filter.prototype.memoryFilterSetAsInputFilter = function() {
        return a.sendWithPromise("Filter.memoryFilterSetAsInputFilter", {
            filter: this.id
        })
    };
    a.Filter.prototype.memoryFilterReset = function() {
        return a.sendWithPromise("Filter.memoryFilterReset", {
            filter: this.id
        })
    };
    a.FilterReader.create = function(b) {
        d(arguments.length, 1, "create", "(PDFNet.Filter)", [
            [b, "Object", a.Filter, "Filter"]
        ]);
        return a.sendWithPromise("filterReaderCreate", {
            filter: b.id
        }).then(function(b) {
            return l(a.FilterReader, b)
        })
    };
    a.FilterReader.prototype.attachFilter = function(b) {
        d(arguments.length, 1, "attachFilter", "(PDFNet.Filter)", [
            [b, "Object", a.Filter, "Filter"]
        ]);
        return a.sendWithPromise("FilterReader.attachFilter", {
            reader: this.id,
            filter: b.id
        })
    };
    a.FilterReader.prototype.getAttachedFilter = function() {
        return a.sendWithPromise("FilterReader.getAttachedFilter", {
            reader: this.id
        }).then(function(b) {
            return f(a.Filter, b)
        })
    };
    a.FilterReader.prototype.seek = function(b, c) {
        d(arguments.length, 2, "seek", "(number, number)", [
            [b, "number"],
            [c,
                "number"
            ]
        ]);
        return a.sendWithPromise("FilterReader.seek", {
            reader: this.id,
            offset: b,
            origin: c
        })
    };
    a.FilterReader.prototype.tell = function() {
        return a.sendWithPromise("FilterReader.tell", {
            reader: this.id
        })
    };
    a.FilterReader.prototype.count = function() {
        return a.sendWithPromise("FilterReader.count", {
            reader: this.id
        })
    };
    a.FilterReader.prototype.flush = function() {
        return a.sendWithPromise("FilterReader.flush", {
            reader: this.id
        })
    };
    a.FilterReader.prototype.flushAll = function() {
        return a.sendWithPromise("FilterReader.flushAll", {
            reader: this.id
        })
    };
    a.FilterReader.prototype.get = function() {
        return a.sendWithPromise("FilterReader.get", {
            reader: this.id
        })
    };
    a.FilterReader.prototype.peek = function() {
        return a.sendWithPromise("FilterReader.peek", {
            reader: this.id
        })
    };
    a.FilterWriter.create = function(b) {
        d(arguments.length, 1, "create", "(PDFNet.Filter)", [
            [b, "Object", a.Filter, "Filter"]
        ]);
        return a.sendWithPromise("filterWriterCreate", {
            filter: b.id
        }).then(function(b) {
            return l(a.FilterWriter, b)
        })
    };
    a.FilterWriter.prototype.attachFilter = function(b) {
        d(arguments.length,
            1, "attachFilter", "(PDFNet.Filter)", [
                [b, "Object", a.Filter, "Filter"]
            ]);
        return a.sendWithPromise("FilterWriter.attachFilter", {
            writer: this.id,
            filter: b.id
        })
    };
    a.FilterWriter.prototype.getAttachedFilter = function() {
        return a.sendWithPromise("FilterWriter.getAttachedFilter", {
            writer: this.id
        }).then(function(b) {
            return f(a.Filter, b)
        })
    };
    a.FilterWriter.prototype.seek = function(b, c) {
        d(arguments.length, 2, "seek", "(number, number)", [
            [b, "number"],
            [c, "number"]
        ]);
        return a.sendWithPromise("FilterWriter.seek", {
            writer: this.id,
            offset: b,
            origin: c
        })
    };
    a.FilterWriter.prototype.tell = function() {
        return a.sendWithPromise("FilterWriter.tell", {
            writer: this.id
        })
    };
    a.FilterWriter.prototype.count = function() {
        return a.sendWithPromise("FilterWriter.count", {
            writer: this.id
        })
    };
    a.FilterWriter.prototype.flush = function() {
        return a.sendWithPromise("FilterWriter.flush", {
            writer: this.id
        })
    };
    a.FilterWriter.prototype.flushAll = function() {
        return a.sendWithPromise("FilterWriter.flushAll", {
            writer: this.id
        })
    };
    a.FilterWriter.prototype.writeUChar = function(b) {
        d(arguments.length,
            1, "writeUChar", "(number)", [
                [b, "number"]
            ]);
        return a.sendWithPromise("FilterWriter.writeUChar", {
            writer: this.id,
            ch: b
        })
    };
    a.FilterWriter.prototype.writeInt16 = function(b) {
        d(arguments.length, 1, "writeInt16", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("FilterWriter.writeInt16", {
            writer: this.id,
            num: b
        })
    };
    a.FilterWriter.prototype.writeUInt16 = function(b) {
        d(arguments.length, 1, "writeUInt16", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("FilterWriter.writeUInt16", {
            writer: this.id,
            num: b
        })
    };
    a.FilterWriter.prototype.writeInt32 =
        function(b) {
            d(arguments.length, 1, "writeInt32", "(number)", [
                [b, "number"]
            ]);
            return a.sendWithPromise("FilterWriter.writeInt32", {
                writer: this.id,
                num: b
            })
        };
    a.FilterWriter.prototype.writeUInt32 = function(b) {
        d(arguments.length, 1, "writeUInt32", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("FilterWriter.writeUInt32", {
            writer: this.id,
            num: b
        })
    };
    a.FilterWriter.prototype.writeInt64 = function(b) {
        d(arguments.length, 1, "writeInt64", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("FilterWriter.writeInt64", {
            writer: this.id,
            num: b
        })
    };
    a.FilterWriter.prototype.writeUInt64 = function(b) {
        d(arguments.length, 1, "writeUInt64", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("FilterWriter.writeUInt64", {
            writer: this.id,
            num: b
        })
    };
    a.FilterWriter.prototype.writeString = function(b) {
        d(arguments.length, 1, "writeString", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("FilterWriter.writeString", {
            writer: this.id,
            str: b
        })
    };
    a.FilterWriter.prototype.writeFilter = function(b) {
        d(arguments.length, 1, "writeFilter", "(PDFNet.FilterReader)", [
            [b, "Object",
                a.FilterReader, "FilterReader"
            ]
        ]);
        return a.sendWithPromise("FilterWriter.writeFilter", {
            writer: this.id,
            reader: b.id
        })
    };
    a.FilterWriter.prototype.writeLine = function(b, c) {
        "undefined" === typeof c && (c = 13);
        d(arguments.length, 1, "writeLine", "(string, number)", [
            [b, "const char* = 0"],
            [c, "number"]
        ]);
        return a.sendWithPromise("FilterWriter.writeLine", {
            writer: this.id,
            line: b,
            eol: c
        })
    };
    a.FilterWriter.prototype.writeBuffer = function(b) {
        d(arguments.length, 1, "writeBuffer", "(ArrayBuffer|TypedArray)", [
            [b, "ArrayBuffer"]
        ]);
        var c =
            u(b, !1);
        return a.sendWithPromise("FilterWriter.writeBuffer", {
            writer: this.id,
            buf: c
        })
    };
    a.OCG.create = function(b, c) {
        d(arguments.length, 2, "create", "(PDFNet.PDFDoc, string)", [
            [b, "PDFDoc"],
            [c, "string"]
        ]);
        return a.sendWithPromise("ocgCreate", {
            pdfdoc: b.id,
            name: c
        }).then(function(b) {
            return f(a.OCG, b)
        })
    };
    a.OCG.createFromObj = function(b) {
        d(arguments.length, 1, "createFromObj", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("ocgCreateFromObj", {
            ocg_dict: b.id
        }).then(function(b) {
            return f(a.OCG, b)
        })
    };
    a.OCG.prototype.copy = function() {
        return a.sendWithPromise("OCG.copy", {
            ocg: this.id
        }).then(function(b) {
            return f(a.OCG, b)
        })
    };
    a.OCG.prototype.getSDFObj = function() {
        return a.sendWithPromise("OCG.getSDFObj", {
            ocg: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.OCG.prototype.isValid = function() {
        return a.sendWithPromise("OCG.isValid", {
            ocg: this.id
        })
    };
    a.OCG.prototype.getName = function() {
        return a.sendWithPromise("OCG.getName", {
            c: this.id
        })
    };
    a.OCG.prototype.setName = function(b) {
        d(arguments.length, 1, "setName", "(string)",
            [
                [b, "string"]
            ]);
        return a.sendWithPromise("OCG.setName", {
            c: this.id,
            value: b
        })
    };
    a.OCG.prototype.getIntent = function() {
        return a.sendWithPromise("OCG.getIntent", {
            c: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.OCG.prototype.setIntent = function(b) {
        d(arguments.length, 1, "setIntent", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("OCG.setIntent", {
            c: this.id,
            value: b.id
        })
    };
    a.OCG.prototype.hasUsage = function() {
        return a.sendWithPromise("OCG.hasUsage", {
            c: this.id
        })
    };
    a.OCG.prototype.getUsage =
        function(b) {
            d(arguments.length, 1, "getUsage", "(string)", [
                [b, "string"]
            ]);
            return a.sendWithPromise("OCG.getUsage", {
                c: this.id,
                key: b
            }).then(function(b) {
                return f(a.Obj, b)
            })
        };
    a.OCG.prototype.getCurrentState = function(b) {
        d(arguments.length, 1, "getCurrentState", "(PDFNet.OCGContext)", [
            [b, "Object", a.OCGContext, "OCGContext"]
        ]);
        return a.sendWithPromise("OCG.getCurrentState", {
            c: this.id,
            ctx: b.id
        })
    };
    a.OCG.prototype.setCurrentState = function(b, c) {
        d(arguments.length, 2, "setCurrentState", "(PDFNet.OCGContext, boolean)",
            [
                [b, "Object", a.OCGContext, "OCGContext"],
                [c, "boolean"]
            ]);
        return a.sendWithPromise("OCG.setCurrentState", {
            c: this.id,
            ctx: b.id,
            state: c
        })
    };
    a.OCG.prototype.getInitialState = function(b) {
        d(arguments.length, 1, "getInitialState", "(PDFNet.OCGConfig)", [
            [b, "Object", a.OCGConfig, "OCGConfig"]
        ]);
        return a.sendWithPromise("OCG.getInitialState", {
            c: this.id,
            cfg: b.id
        })
    };
    a.OCG.prototype.setInitialState = function(b, c) {
        d(arguments.length, 2, "setInitialState", "(PDFNet.OCGConfig, boolean)", [
            [b, "Object", a.OCGConfig, "OCGConfig"],
            [c, "boolean"]
        ]);
        return a.sendWithPromise("OCG.setInitialState", {
            c: this.id,
            cfg: b.id,
            state: c
        })
    };
    a.OCG.prototype.isLocked = function(b) {
        d(arguments.length, 1, "isLocked", "(PDFNet.OCGConfig)", [
            [b, "Object", a.OCGConfig, "OCGConfig"]
        ]);
        return a.sendWithPromise("OCG.isLocked", {
            c: this.id,
            cfg: b.id
        })
    };
    a.OCG.prototype.setLocked = function(b, c) {
        d(arguments.length, 2, "setLocked", "(PDFNet.OCGConfig, boolean)", [
            [b, "Object", a.OCGConfig, "OCGConfig"],
            [c, "boolean"]
        ]);
        return a.sendWithPromise("OCG.setLocked", {
            c: this.id,
            cfg: b.id,
            state: c
        })
    };
    a.OCGConfig.createFromObj = function(b) {
        d(arguments.length, 1, "createFromObj", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("ocgConfigCreateFromObj", {
            dict: b.id
        }).then(function(b) {
            return f(a.OCGConfig, b)
        })
    };
    a.OCGConfig.create = function(b, c) {
        d(arguments.length, 2, "create", "(PDFNet.PDFDoc, boolean)", [
            [b, "PDFDoc"],
            [c, "boolean"]
        ]);
        return a.sendWithPromise("ocgConfigCreate", {
            pdfdoc: b.id,
            default_config: c
        }).then(function(b) {
            return f(a.OCGConfig, b)
        })
    };
    a.OCGConfig.prototype.copy =
        function() {
            return a.sendWithPromise("OCGConfig.copy", {
                c: this.id
            }).then(function(b) {
                return f(a.OCGConfig, b)
            })
        };
    a.OCGConfig.prototype.getSDFObj = function() {
        return a.sendWithPromise("OCGConfig.getSDFObj", {
            c: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.OCGConfig.prototype.getOrder = function() {
        return a.sendWithPromise("OCGConfig.getOrder", {
            c: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.OCGConfig.prototype.setOrder = function(b) {
        d(arguments.length, 1, "setOrder", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("OCGConfig.setOrder", {
            c: this.id,
            value: b.id
        })
    };
    a.OCGConfig.prototype.getName = function() {
        return a.sendWithPromise("OCGConfig.getName", {
            c: this.id
        })
    };
    a.OCGConfig.prototype.setName = function(b) {
        d(arguments.length, 1, "setName", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("OCGConfig.setName", {
            c: this.id,
            value: b
        })
    };
    a.OCGConfig.prototype.getCreator = function() {
        return a.sendWithPromise("OCGConfig.getCreator", {
            c: this.id
        })
    };
    a.OCGConfig.prototype.setCreator = function(b) {
        d(arguments.length,
            1, "setCreator", "(string)", [
                [b, "string"]
            ]);
        return a.sendWithPromise("OCGConfig.setCreator", {
            c: this.id,
            value: b
        })
    };
    a.OCGConfig.prototype.getInitBaseState = function() {
        return a.sendWithPromise("OCGConfig.getInitBaseState", {
            c: this.id
        })
    };
    a.OCGConfig.prototype.setInitBaseState = function(b) {
        "undefined" === typeof b && (b = "ON");
        d(arguments.length, 0, "setInitBaseState", "(string)", [
            [b, "const char* = 0"]
        ]);
        return a.sendWithPromise("OCGConfig.setInitBaseState", {
            c: this.id,
            value: b
        })
    };
    a.OCGConfig.prototype.getInitOnStates =
        function() {
            return a.sendWithPromise("OCGConfig.getInitOnStates", {
                c: this.id
            }).then(function(b) {
                return f(a.Obj, b)
            })
        };
    a.OCGConfig.prototype.setInitOnStates = function(b) {
        d(arguments.length, 1, "setInitOnStates", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("OCGConfig.setInitOnStates", {
            c: this.id,
            value: b.id
        })
    };
    a.OCGConfig.prototype.getInitOffStates = function() {
        return a.sendWithPromise("OCGConfig.getInitOffStates", {
            c: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.OCGConfig.prototype.setInitOffStates =
        function(b) {
            d(arguments.length, 1, "setInitOffStates", "(PDFNet.Obj)", [
                [b, "Object", a.Obj, "Obj"]
            ]);
            return a.sendWithPromise("OCGConfig.setInitOffStates", {
                c: this.id,
                value: b.id
            })
        };
    a.OCGConfig.prototype.getIntent = function() {
        return a.sendWithPromise("OCGConfig.getIntent", {
            c: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.OCGConfig.prototype.setIntent = function(b) {
        d(arguments.length, 1, "setIntent", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("OCGConfig.setIntent", {
            c: this.id,
            value: b.id
        })
    };
    a.OCGConfig.prototype.getLockedOCGs = function() {
        return a.sendWithPromise("OCGConfig.getLockedOCGs", {
            c: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.OCGConfig.prototype.setLockedOCGs = function(b) {
        d(arguments.length, 1, "setLockedOCGs", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("OCGConfig.setLockedOCGs", {
            c: this.id,
            value: b.id
        })
    };
    a.OCGContext.createFromConfig = function(b) {
        d(arguments.length, 1, "createFromConfig", "(PDFNet.OCGConfig)", [
            [b, "Object", a.OCGConfig, "OCGConfig"]
        ]);
        return a.sendWithPromise("ocgContextCreateFromConfig", {
            cfg: b.id
        }).then(function(b) {
            return l(a.OCGContext, b)
        })
    };
    a.OCGContext.prototype.copy = function() {
        return a.sendWithPromise("OCGContext.copy", {
            c: this.id
        }).then(function(b) {
            return l(a.OCGContext, b)
        })
    };
    a.OCGContext.prototype.getState = function(b) {
        d(arguments.length, 1, "getState", "(PDFNet.OCG)", [
            [b, "Object", a.OCG, "OCG"]
        ]);
        return a.sendWithPromise("OCGContext.getState", {
            c: this.id,
            grp: b.id
        })
    };
    a.OCGContext.prototype.setState = function(b, c) {
        d(arguments.length, 2, "setState", "(PDFNet.OCG, boolean)", [
            [b, "Object",
                a.OCG, "OCG"
            ],
            [c, "boolean"]
        ]);
        return a.sendWithPromise("OCGContext.setState", {
            c: this.id,
            grp: b.id,
            state: c
        })
    };
    a.OCGContext.prototype.resetStates = function(b) {
        d(arguments.length, 1, "resetStates", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("OCGContext.resetStates", {
            c: this.id,
            all_on: b
        })
    };
    a.OCGContext.prototype.setNonOCDrawing = function(b) {
        d(arguments.length, 1, "setNonOCDrawing", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("OCGContext.setNonOCDrawing", {
            c: this.id,
            draw_non_OC: b
        })
    };
    a.OCGContext.prototype.getNonOCDrawing =
        function() {
            return a.sendWithPromise("OCGContext.getNonOCDrawing", {
                c: this.id
            })
        };
    a.OCGContext.prototype.setOCDrawMode = function(b) {
        d(arguments.length, 1, "setOCDrawMode", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("OCGContext.setOCDrawMode", {
            c: this.id,
            oc_draw_mode: b
        })
    };
    a.OCGContext.prototype.getOCMode = function() {
        return a.sendWithPromise("OCGContext.getOCMode", {
            c: this.id
        })
    };
    a.OCMD.createFromObj = function(b) {
        d(arguments.length, 1, "createFromObj", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("ocmdCreateFromObj", {
            ocmd_dict: b.id
        }).then(function(b) {
            return f(a.OCMD, b)
        })
    };
    a.OCMD.create = function(b, c, e) {
        d(arguments.length, 3, "create", "(PDFNet.PDFDoc, PDFNet.Obj, number)", [
            [b, "PDFDoc"],
            [c, "Object", a.Obj, "Obj"],
            [e, "number"]
        ]);
        return a.sendWithPromise("ocmdCreate", {
            pdfdoc: b.id,
            ocgs: c.id,
            vis_policy: e
        }).then(function(b) {
            return f(a.OCMD, b)
        })
    };
    a.OCMD.prototype.copy = function() {
        return a.sendWithPromise("OCMD.copy", {
            ocmd: this.id
        }).then(function(b) {
            return f(a.OCMD, b)
        })
    };
    a.OCMD.prototype.getSDFObj = function() {
        return a.sendWithPromise("OCMD.getSDFObj", {
            ocmd: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.OCMD.prototype.getOCGs = function() {
        return a.sendWithPromise("OCMD.getOCGs", {
            ocmd: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.OCMD.prototype.getVisibilityExpression = function() {
        return a.sendWithPromise("OCMD.getVisibilityExpression", {
            ocmd: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.OCMD.prototype.isValid = function() {
        return a.sendWithPromise("OCMD.isValid", {
            ocmd: this.id
        })
    };
    a.OCMD.prototype.isCurrentlyVisible = function(b) {
        d(arguments.length,
            1, "isCurrentlyVisible", "(PDFNet.OCGContext)", [
                [b, "Object", a.OCGContext, "OCGContext"]
            ]);
        return a.sendWithPromise("OCMD.isCurrentlyVisible", {
            ocmd: this.id,
            ctx: b.id
        })
    };
    a.OCMD.prototype.getVisibilityPolicy = function() {
        return a.sendWithPromise("OCMD.getVisibilityPolicy", {
            ocmd: this.id
        })
    };
    a.OCMD.prototype.setVisibilityPolicy = function(b) {
        d(arguments.length, 1, "setVisibilityPolicy", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("OCMD.setVisibilityPolicy", {
            ocmd: this.id,
            vis_policy: b
        })
    };
    a.PDFACompliance.prototype.getErrorCount =
        function() {
            return a.sendWithPromise("PDFACompliance.getErrorCount", {
                pdfac: this.id
            })
        };
    a.PDFACompliance.prototype.getError = function(b) {
        d(arguments.length, 1, "getError", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("PDFACompliance.getError", {
            pdfac: this.id,
            idx: b
        })
    };
    a.PDFACompliance.prototype.getRefObjCount = function(b) {
        d(arguments.length, 1, "getRefObjCount", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("PDFACompliance.getRefObjCount", {
            pdfac: this.id,
            id: b
        })
    };
    a.PDFACompliance.prototype.getRefObj =
        function(b, c) {
            d(arguments.length, 2, "getRefObj", "(number, number)", [
                [b, "number"],
                [c, "number"]
            ]);
            return a.sendWithPromise("PDFACompliance.getRefObj", {
                pdfac: this.id,
                id: b,
                err_idx: c
            })
        };
    a.PDFACompliance.getPDFAErrorMessage = function(b) {
        d(arguments.length, 1, "getPDFAErrorMessage", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("pdfaComplianceGetPDFAErrorMessage", {
            id: b
        })
    };
    a.PDFACompliance.getDeclaredConformance = function(b) {
        d(arguments.length, 1, "getDeclaredConformance", "(PDFNet.PDFDoc)", [
            [b, "PDFDoc"]
        ]);
        return a.sendWithPromise("pdfaComplianceGetDeclaredConformance", {
            doc: b.id
        })
    };
    a.PDFACompliance.prototype.saveAsFromFileName = function(b, c) {
        "undefined" === typeof c && (c = !1);
        d(arguments.length, 1, "saveAsFromFileName", "(string, boolean)", [
            [b, "string"],
            [c, "boolean"]
        ]);
        return a.sendWithPromise("PDFACompliance.saveAsFromFileName", {
            pdfac: this.id,
            file_path: b,
            linearized: c
        })
    };
    a.PDFACompliance.prototype.saveAsFromBuffer = function(b) {
        "undefined" === typeof b && (b = !1);
        d(arguments.length, 0, "saveAsFromBuffer", "(boolean)",
            [
                [b, "boolean"]
            ]);
        return a.sendWithPromise("PDFACompliance.saveAsFromBuffer", {
            pdfac: this.id,
            linearized: b
        }).then(function(a) {
            return new Uint8Array(a)
        })
    };
    a.AttrObj.create = function(b) {
        "undefined" === typeof b && (b = new a.Obj("0"));
        d(arguments.length, 0, "create", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("attrObjCreate", {
            dict: b.id
        }).then(function(b) {
            return f(a.AttrObj, b)
        })
    };
    a.AttrObj.prototype.copy = function() {
        return a.sendWithPromise("AttrObj.copy", {
            a: this.id
        }).then(function(b) {
            return f(a.AttrObj,
                b)
        })
    };
    a.AttrObj.prototype.getOwner = function() {
        return a.sendWithPromise("AttrObj.getOwner", {
            obj: this.id
        })
    };
    a.AttrObj.prototype.getSDFObj = function() {
        return a.sendWithPromise("AttrObj.getSDFObj", {
            obj: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.ClassMap.create = function(b) {
        "undefined" === typeof b && (b = new a.Obj("0"));
        d(arguments.length, 0, "create", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("classMapCreate", {
            dict: b.id
        }).then(function(b) {
            return f(a.ClassMap, b)
        })
    };
    a.ClassMap.prototype.copy =
        function() {
            return a.sendWithPromise("ClassMap.copy", {
                p: this.id
            }).then(function(b) {
                return f(a.ClassMap, b)
            })
        };
    a.ClassMap.prototype.isValid = function() {
        return a.sendWithPromise("ClassMap.isValid", {
            map: this.id
        })
    };
    a.ClassMap.prototype.getSDFObj = function() {
        return a.sendWithPromise("ClassMap.getSDFObj", {
            map: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.ContentItem.prototype.copy = function() {
        k("copy", this.yieldFunction);
        return a.sendWithPromise("ContentItem.copy", {
            c: this
        }).then(function(b) {
            return new a.ContentItem(b)
        })
    };
    a.ContentItem.prototype.getType = function() {
        k("getType", this.yieldFunction);
        return a.sendWithPromise("ContentItem.getType", {
            item: this
        })
    };
    a.ContentItem.prototype.getParent = function() {
        k("getParent", this.yieldFunction);
        var b = this;
        this.yieldFunction = "ContentItem.getParent";
        return a.sendWithPromise("ContentItem.getParent", {
            item: this
        }).then(function(c) {
            b.yieldFunction = void 0;
            c.result = new a.SElement(c.result);
            q(c.item, b);
            return c.result
        })
    };
    a.ContentItem.prototype.getPage = function() {
        k("getPage", this.yieldFunction);
        var b = this;
        this.yieldFunction = "ContentItem.getPage";
        return a.sendWithPromise("ContentItem.getPage", {
            item: this
        }).then(function(c) {
            b.yieldFunction = void 0;
            c.result = f(a.Page, c.result);
            q(c.item, b);
            return c.result
        })
    };
    a.ContentItem.prototype.getSDFObj = function() {
        k("getSDFObj", this.yieldFunction);
        return a.sendWithPromise("ContentItem.getSDFObj", {
            item: this
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.ContentItem.prototype.getMCID = function() {
        k("getMCID", this.yieldFunction);
        return a.sendWithPromise("ContentItem.getMCID", {
            item: this
        })
    };
    a.ContentItem.prototype.getContainingStm = function() {
        k("getContainingStm", this.yieldFunction);
        return a.sendWithPromise("ContentItem.getContainingStm", {
            item: this
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.ContentItem.prototype.getStmOwner = function() {
        k("getStmOwner", this.yieldFunction);
        return a.sendWithPromise("ContentItem.getStmOwner", {
            item: this
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.ContentItem.prototype.getRefObj = function() {
        k("getRefObj", this.yieldFunction);
        return a.sendWithPromise("ContentItem.getRefObj", {
            item: this
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.RoleMap.create = function(b) {
        d(arguments.length, 1, "create", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("roleMapCreate", {
            dict: b.id
        }).then(function(b) {
            return f(a.RoleMap, b)
        })
    };
    a.RoleMap.prototype.copy = function() {
        return a.sendWithPromise("RoleMap.copy", {
            p: this.id
        }).then(function(b) {
            return f(a.RoleMap, b)
        })
    };
    a.RoleMap.prototype.isValid = function() {
        return a.sendWithPromise("RoleMap.isValid", {
            map: this.id
        })
    };
    a.RoleMap.prototype.getDirectMap =
        function(b) {
            d(arguments.length, 1, "getDirectMap", "(string)", [
                [b, "string"]
            ]);
            return a.sendWithPromise("RoleMap.getDirectMap", {
                map: this.id,
                type: b
            })
        };
    a.RoleMap.prototype.getSDFObj = function() {
        return a.sendWithPromise("RoleMap.getSDFObj", {
            map: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.SElement.create = function(b) {
        "undefined" === typeof b && (b = new a.Obj("0"));
        d(arguments.length, 0, "create", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("sElementCreate", {
            dict: b.id
        }).then(function(b) {
            return new a.SElement(b)
        })
    };
    a.SElement.createFromPDFDoc = function(b, c) {
        d(arguments.length, 2, "createFromPDFDoc", "(PDFNet.PDFDoc, string)", [
            [b, "PDFDoc"],
            [c, "string"]
        ]);
        return a.sendWithPromise("sElementCreateFromPDFDoc", {
            doc: b.id,
            struct_type: c
        }).then(function(b) {
            return new a.SElement(b)
        })
    };
    a.SElement.prototype.insert = function(b, c) {
        d(arguments.length, 2, "insert", "(PDFNet.SElement, number)", [
            [b, "Structure", a.SElement, "SElement"],
            [c, "number"]
        ]);
        k("insert", this.yieldFunction);
        n("insert", [
            [b, 0]
        ]);
        var e = this;
        this.yieldFunction = "SElement.insert";
        b.yieldFunction = "SElement.insert";
        return a.sendWithPromise("SElement.insert", {
            e: this,
            kid: b,
            insert_before: c
        }).then(function(a) {
            e.yieldFunction = void 0;
            b.yieldFunction = void 0;
            q(a.e, e);
            q(a.kid, b)
        })
    };
    a.SElement.prototype.createContentItem = function(b, c, e) {
        "undefined" === typeof e && (e = -1);
        d(arguments.length, 2, "createContentItem", "(PDFNet.PDFDoc, PDFNet.Page, number)", [
            [b, "PDFDoc"],
            [c, "Object", a.Page, "Page"],
            [e, "number"]
        ]);
        k("createContentItem", this.yieldFunction);
        var m = this;
        this.yieldFunction = "SElement.createContentItem";
        return a.sendWithPromise("SElement.createContentItem", {
            e: this,
            doc: b.id,
            page: c.id,
            insert_before: e
        }).then(function(a) {
            m.yieldFunction = void 0;
            q(a.e, m);
            return a.result
        })
    };
    a.SElement.prototype.isValid = function() {
        k("isValid", this.yieldFunction);
        return a.sendWithPromise("SElement.isValid", {
            e: this
        })
    };
    a.SElement.prototype.getType = function() {
        k("getType", this.yieldFunction);
        return a.sendWithPromise("SElement.getType", {
            e: this
        })
    };
    a.SElement.prototype.getNumKids = function() {
        k("getNumKids", this.yieldFunction);
        return a.sendWithPromise("SElement.getNumKids", {
            e: this
        })
    };
    a.SElement.prototype.isContentItem = function(b) {
        d(arguments.length, 1, "isContentItem", "(number)", [
            [b, "number"]
        ]);
        k("isContentItem", this.yieldFunction);
        return a.sendWithPromise("SElement.isContentItem", {
            e: this,
            index: b
        })
    };
    a.SElement.prototype.getAsContentItem = function(b) {
        d(arguments.length, 1, "getAsContentItem", "(number)", [
            [b, "number"]
        ]);
        k("getAsContentItem", this.yieldFunction);
        return a.sendWithPromise("SElement.getAsContentItem", {
            e: this,
            index: b
        }).then(function(b) {
            return new a.ContentItem(b)
        })
    };
    a.SElement.prototype.getAsStructElem = function(b) {
        d(arguments.length, 1, "getAsStructElem", "(number)", [
            [b, "number"]
        ]);
        k("getAsStructElem", this.yieldFunction);
        return a.sendWithPromise("SElement.getAsStructElem", {
            e: this,
            index: b
        }).then(function(b) {
            return new a.SElement(b)
        })
    };
    a.SElement.prototype.getParent = function() {
        k("getParent", this.yieldFunction);
        return a.sendWithPromise("SElement.getParent", {
            e: this
        }).then(function(b) {
            return new a.SElement(b)
        })
    };
    a.SElement.prototype.getStructTreeRoot = function() {
        k("getStructTreeRoot",
            this.yieldFunction);
        return a.sendWithPromise("SElement.getStructTreeRoot", {
            e: this
        }).then(function(b) {
            return f(a.STree, b)
        })
    };
    a.SElement.prototype.hasTitle = function() {
        k("hasTitle", this.yieldFunction);
        return a.sendWithPromise("SElement.hasTitle", {
            e: this
        })
    };
    a.SElement.prototype.getTitle = function() {
        k("getTitle", this.yieldFunction);
        return a.sendWithPromise("SElement.getTitle", {
            e: this
        })
    };
    a.SElement.prototype.getID = function() {
        k("getID", this.yieldFunction);
        return a.sendWithPromise("SElement.getID", {
            e: this
        }).then(function(b) {
            return f(a.Obj,
                b)
        })
    };
    a.SElement.prototype.hasActualText = function() {
        k("hasActualText", this.yieldFunction);
        return a.sendWithPromise("SElement.hasActualText", {
            e: this
        })
    };
    a.SElement.prototype.getActualText = function() {
        k("getActualText", this.yieldFunction);
        return a.sendWithPromise("SElement.getActualText", {
            e: this
        })
    };
    a.SElement.prototype.hasAlt = function() {
        k("hasAlt", this.yieldFunction);
        return a.sendWithPromise("SElement.hasAlt", {
            e: this
        })
    };
    a.SElement.prototype.getAlt = function() {
        k("getAlt", this.yieldFunction);
        return a.sendWithPromise("SElement.getAlt", {
            e: this
        })
    };
    a.SElement.prototype.getSDFObj = function() {
        k("getSDFObj", this.yieldFunction);
        return a.sendWithPromise("SElement.getSDFObj", {
            e: this
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.STree.create = function(b) {
        d(arguments.length, 1, "create", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("sTreeCreate", {
            struct_dict: b.id
        }).then(function(b) {
            return f(a.STree, b)
        })
    };
    a.STree.createFromPDFDoc = function(b) {
        d(arguments.length, 1, "createFromPDFDoc", "(PDFNet.PDFDoc)", [
            [b, "PDFDoc"]
        ]);
        return a.sendWithPromise("sTreeCreateFromPDFDoc", {
            doc: b.id
        }).then(function(b) {
            return f(a.STree, b)
        })
    };
    a.STree.prototype.insert = function(b, c) {
        d(arguments.length, 2, "insert", "(PDFNet.SElement, number)", [
            [b, "Structure", a.SElement, "SElement"],
            [c, "number"]
        ]);
        n("insert", [
            [b, 0]
        ]);
        b.yieldFunction = "STree.insert";
        return a.sendWithPromise("STree.insert", {
            tree: this.id,
            kid: b,
            insert_before: c
        }).then(function(a) {
            b.yieldFunction = void 0;
            q(a, b)
        })
    };
    a.STree.prototype.copy = function() {
        return a.sendWithPromise("STree.copy", {
            c: this.id
        }).then(function(b) {
            return f(a.STree,
                b)
        })
    };
    a.STree.prototype.isValid = function() {
        return a.sendWithPromise("STree.isValid", {
            tree: this.id
        })
    };
    a.STree.prototype.getNumKids = function() {
        return a.sendWithPromise("STree.getNumKids", {
            tree: this.id
        })
    };
    a.STree.prototype.getKid = function(b) {
        d(arguments.length, 1, "getKid", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("STree.getKid", {
            tree: this.id,
            index: b
        }).then(function(b) {
            return new a.SElement(b)
        })
    };
    a.STree.prototype.getRoleMap = function() {
        return a.sendWithPromise("STree.getRoleMap", {
            tree: this.id
        }).then(function(b) {
            return f(a.RoleMap,
                b)
        })
    };
    a.STree.prototype.getClassMap = function() {
        return a.sendWithPromise("STree.getClassMap", {
            tree: this.id
        }).then(function(b) {
            return f(a.ClassMap, b)
        })
    };
    a.STree.prototype.getSDFObj = function() {
        return a.sendWithPromise("STree.getSDFObj", {
            tree: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Action.createGoto = function(b) {
        d(arguments.length, 1, "createGoto", "(PDFNet.Destination)", [
            [b, "Object", a.Destination, "Destination"]
        ]);
        return a.sendWithPromise("actionCreateGoto", {
            dest: b.id
        }).then(function(b) {
            return f(a.Action,
                b)
        })
    };
    a.Action.createGotoWithKey = function(b, c) {
        d(arguments.length, 2, "createGotoWithKey", "(string, PDFNet.Destination)", [
            [b, "string"],
            [c, "Object", a.Destination, "Destination"]
        ]);
        return a.sendWithPromise("actionCreateGotoWithKey", {
            key: b,
            dest: c.id
        }).then(function(b) {
            return f(a.Action, b)
        })
    };
    a.Action.createGotoRemote = function(b, c) {
        d(arguments.length, 2, "createGotoRemote", "(PDFNet.FileSpec, number)", [
            [b, "Object", a.FileSpec, "FileSpec"],
            [c, "number"]
        ]);
        return a.sendWithPromise("actionCreateGotoRemote", {
            file: b.id,
            page_num: c
        }).then(function(b) {
            return f(a.Action, b)
        })
    };
    a.Action.createGotoRemoteSetNewWindow = function(b, c, e) {
        d(arguments.length, 3, "createGotoRemoteSetNewWindow", "(PDFNet.FileSpec, number, boolean)", [
            [b, "Object", a.FileSpec, "FileSpec"],
            [c, "number"],
            [e, "boolean"]
        ]);
        return a.sendWithPromise("actionCreateGotoRemoteSetNewWindow", {
            file: b.id,
            page_num: c,
            new_window: e
        }).then(function(b) {
            return f(a.Action, b)
        })
    };
    a.Action.createURI = function(b, c) {
        d(arguments.length, 2, "createURI", "(PDFNet.SDFDoc, string)", [
            [b, "SDFDoc"],
            [c, "string"]
        ]);
        return a.sendWithPromise("actionCreateURI", {
            sdfdoc: b.id,
            uri: c
        }).then(function(b) {
            return f(a.Action, b)
        })
    };
    a.Action.createURIWithUString = function(b, c) {
        d(arguments.length, 2, "createURIWithUString", "(PDFNet.SDFDoc, string)", [
            [b, "SDFDoc"],
            [c, "string"]
        ]);
        return a.sendWithPromise("actionCreateURIWithUString", {
            sdfdoc: b.id,
            uri: c
        }).then(function(b) {
            return f(a.Action, b)
        })
    };
    a.Action.createSubmitForm = function(b) {
        d(arguments.length, 1, "createSubmitForm", "(PDFNet.FileSpec)", [
            [b, "Object", a.FileSpec,
                "FileSpec"
            ]
        ]);
        return a.sendWithPromise("actionCreateSubmitForm", {
            url: b.id
        }).then(function(b) {
            return f(a.Action, b)
        })
    };
    a.Action.createLaunch = function(b, c) {
        d(arguments.length, 2, "createLaunch", "(PDFNet.SDFDoc, string)", [
            [b, "SDFDoc"],
            [c, "string"]
        ]);
        return a.sendWithPromise("actionCreateLaunch", {
            sdfdoc: b.id,
            path: c
        }).then(function(b) {
            return f(a.Action, b)
        })
    };
    a.Action.createHideField = function(b, c) {
        d(arguments.length, 2, "createHideField", "(PDFNet.SDFDoc, Array<string>)", [
            [b, "SDFDoc"],
            [c, "Array"]
        ]);
        return a.sendWithPromise("actionCreateHideField", {
            sdfdoc: b.id,
            field_names_list: c
        }).then(function(b) {
            return f(a.Action, b)
        })
    };
    a.Action.createImportData = function(b, c) {
        d(arguments.length, 2, "createImportData", "(PDFNet.SDFDoc, string)", [
            [b, "SDFDoc"],
            [c, "string"]
        ]);
        return a.sendWithPromise("actionCreateImportData", {
            sdfdoc: b.id,
            path: c
        }).then(function(b) {
            return f(a.Action, b)
        })
    };
    a.Action.createResetForm = function(b) {
        d(arguments.length, 1, "createResetForm", "(PDFNet.SDFDoc)", [
            [b, "SDFDoc"]
        ]);
        return a.sendWithPromise("actionCreateResetForm", {
            sdfdoc: b.id
        }).then(function(b) {
            return f(a.Action,
                b)
        })
    };
    a.Action.createJavaScript = function(b, c) {
        d(arguments.length, 2, "createJavaScript", "(PDFNet.SDFDoc, string)", [
            [b, "SDFDoc"],
            [c, "string"]
        ]);
        return a.sendWithPromise("actionCreateJavaScript", {
            sdfdoc: b.id,
            script: c
        }).then(function(b) {
            return f(a.Action, b)
        })
    };
    a.Action.create = function(b) {
        "undefined" === typeof b && (b = new a.Obj("0"));
        d(arguments.length, 0, "create", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("actionCreate", {
            in_obj: b.id
        }).then(function(b) {
            return f(a.Action, b)
        })
    };
    a.Action.prototype.copy =
        function() {
            return a.sendWithPromise("Action.copy", {
                in_action: this.id
            }).then(function(b) {
                return f(a.Action, b)
            })
        };
    a.Action.prototype.compare = function(b) {
        d(arguments.length, 1, "compare", "(PDFNet.Action)", [
            [b, "Object", a.Action, "Action"]
        ]);
        return a.sendWithPromise("Action.compare", {
            action: this.id,
            in_action: b.id
        })
    };
    a.Action.prototype.isValid = function() {
        return a.sendWithPromise("Action.isValid", {
            action: this.id
        })
    };
    a.Action.prototype.getType = function() {
        return a.sendWithPromise("Action.getType", {
            action: this.id
        })
    };
    a.Action.prototype.getDest = function() {
        return a.sendWithPromise("Action.getDest", {
            action: this.id
        }).then(function(b) {
            return f(a.Destination, b)
        })
    };
    a.Action.prototype.getNext = function() {
        return a.sendWithPromise("Action.getNext", {
            action: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Action.prototype.getSDFObj = function() {
        return a.sendWithPromise("Action.getSDFObj", {
            action: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Action.prototype.getFormActionFlag = function(b) {
        d(arguments.length, 1, "getFormActionFlag",
            "(number)", [
                [b, "number"]
            ]);
        return a.sendWithPromise("Action.getFormActionFlag", {
            action: this.id,
            flag: b
        })
    };
    a.Action.prototype.setFormActionFlag = function(b, c) {
        d(arguments.length, 2, "setFormActionFlag", "(number, boolean)", [
            [b, "number"],
            [c, "boolean"]
        ]);
        return a.sendWithPromise("Action.setFormActionFlag", {
            action: this.id,
            flag: b,
            value: c
        })
    };
    a.Action.prototype.needsWriteLock = function() {
        return a.sendWithPromise("Action.needsWriteLock", {
            action: this.id
        })
    };
    a.Action.prototype.execute = function() {
        return a.sendWithPromise("Action.execute", {
            action: this.id
        })
    };
    a.Action.prototype.executeKeyStrokeAction = function(b) {
        d(arguments.length, 1, "executeKeyStrokeAction", "(PDFNet.KeyStrokeEventData)", [
            [b, "Object", a.KeyStrokeEventData, "KeyStrokeEventData"]
        ]);
        return a.sendWithPromise("Action.executeKeyStrokeAction", {
            action: this.id,
            data: b.id
        }).then(function(b) {
            return l(a.KeyStrokeActionResult, b)
        })
    };
    a.KeyStrokeActionResult.prototype.isValid = function() {
        return a.sendWithPromise("KeyStrokeActionResult.isValid", {
            action_ret: this.id
        })
    };
    a.KeyStrokeActionResult.prototype.getText =
        function() {
            return a.sendWithPromise("KeyStrokeActionResult.getText", {
                action_ret: this.id
            })
        };
    a.KeyStrokeActionResult.prototype.copy = function() {
        return a.sendWithPromise("KeyStrokeActionResult.copy", {
            action_ret: this.id
        }).then(function(b) {
            return l(a.KeyStrokeActionResult, b)
        })
    };
    a.KeyStrokeEventData.create = function(b, c, e, m, f) {
        d(arguments.length, 5, "create", "(string, string, string, number, number)", [
            [b, "string"],
            [c, "string"],
            [e, "string"],
            [m, "number"],
            [f, "number"]
        ]);
        return a.sendWithPromise("keyStrokeEventDataCreate", {
            field_name: b,
            current: c,
            change: e,
            selection_start: m,
            selection_end: f
        }).then(function(b) {
            return l(a.KeyStrokeEventData, b)
        })
    };
    a.KeyStrokeEventData.prototype.copy = function() {
        return a.sendWithPromise("KeyStrokeEventData.copy", {
            data: this.id
        }).then(function(b) {
            return l(a.KeyStrokeEventData, b)
        })
    };
    a.Page.create = function(b) {
        "undefined" === typeof b && (b = new a.Obj("0"));
        d(arguments.length, 0, "create", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("pageCreate", {
            page_dict: b.id
        }).then(function(b) {
            return f(a.Page,
                b)
        })
    };
    a.Page.prototype.copy = function() {
        return a.sendWithPromise("Page.copy", {
            p: this.id
        }).then(function(b) {
            return f(a.Page, b)
        })
    };
    a.Page.prototype.isValid = function() {
        return a.sendWithPromise("Page.isValid", {
            page: this.id
        })
    };
    a.Page.prototype.getIndex = function() {
        return a.sendWithPromise("Page.getIndex", {
            page: this.id
        })
    };
    a.Page.prototype.getTriggerAction = function(b) {
        d(arguments.length, 1, "getTriggerAction", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("Page.getTriggerAction", {
            page: this.id,
            trigger: b
        }).then(function(b) {
            return f(a.Obj,
                b)
        })
    };
    a.Page.prototype.getBox = function(b) {
        d(arguments.length, 1, "getBox", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("Page.getBox", {
            page: this.id,
            type: b
        }).then(function(b) {
            return new a.Rect(b)
        })
    };
    a.Page.prototype.setBox = function(b, c) {
        d(arguments.length, 2, "setBox", "(number, PDFNet.Rect)", [
            [b, "number"],
            [c, "Structure", a.Rect, "Rect"]
        ]);
        n("setBox", [
            [c, 1]
        ]);
        return a.sendWithPromise("Page.setBox", {
            page: this.id,
            type: b,
            box: c
        })
    };
    a.Page.prototype.getCropBox = function() {
        return a.sendWithPromise("Page.getCropBox", {
            page: this.id
        }).then(function(b) {
            return new a.Rect(b)
        })
    };
    a.Page.prototype.setCropBox = function(b) {
        d(arguments.length, 1, "setCropBox", "(PDFNet.Rect)", [
            [b, "Structure", a.Rect, "Rect"]
        ]);
        n("setCropBox", [
            [b, 0]
        ]);
        return a.sendWithPromise("Page.setCropBox", {
            page: this.id,
            box: b
        })
    };
    a.Page.prototype.getMediaBox = function() {
        return a.sendWithPromise("Page.getMediaBox", {
            page: this.id
        }).then(function(b) {
            return new a.Rect(b)
        })
    };
    a.Page.prototype.setMediaBox = function(b) {
        d(arguments.length, 1, "setMediaBox", "(PDFNet.Rect)",
            [
                [b, "Structure", a.Rect, "Rect"]
            ]);
        n("setMediaBox", [
            [b, 0]
        ]);
        return a.sendWithPromise("Page.setMediaBox", {
            page: this.id,
            box: b
        })
    };
    a.Page.prototype.getVisibleContentBox = function() {
        return a.sendWithPromise("Page.getVisibleContentBox", {
            page: this.id
        }).then(function(b) {
            return new a.Rect(b)
        })
    };
    a.Page.prototype.getRotation = function() {
        return a.sendWithPromise("Page.getRotation", {
            page: this.id
        })
    };
    a.Page.prototype.setRotation = function(b) {
        d(arguments.length, 1, "setRotation", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("Page.setRotation", {
            page: this.id,
            angle: b
        })
    };
    a.Page.addRotations = function(b, c) {
        d(arguments.length, 2, "addRotations", "(number, number)", [
            [b, "number"],
            [c, "number"]
        ]);
        return a.sendWithPromise("pageAddRotations", {
            r0: b,
            r1: c
        })
    };
    a.Page.subtractRotations = function(b, c) {
        d(arguments.length, 2, "subtractRotations", "(number, number)", [
            [b, "number"],
            [c, "number"]
        ]);
        return a.sendWithPromise("pageSubtractRotations", {
            r0: b,
            r1: c
        })
    };
    a.Page.rotationToDegree = function(b) {
        d(arguments.length, 1, "rotationToDegree", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("pageRotationToDegree", {
            r: b
        })
    };
    a.Page.degreeToRotation = function(b) {
        d(arguments.length, 1, "degreeToRotation", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("pageDegreeToRotation", {
            r: b
        })
    };
    a.Page.prototype.getPageWidth = function(b) {
        "undefined" === typeof b && (b = a.Page.Box.e_crop);
        d(arguments.length, 0, "getPageWidth", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("Page.getPageWidth", {
            page: this.id,
            box_type: b
        })
    };
    a.Page.prototype.getPageHeight = function(b) {
        "undefined" === typeof b && (b = a.Page.Box.e_crop);
        d(arguments.length, 0,
            "getPageHeight", "(number)", [
                [b, "number"]
            ]);
        return a.sendWithPromise("Page.getPageHeight", {
            page: this.id,
            box_type: b
        })
    };
    a.Page.prototype.getDefaultMatrix = function(b, c, e) {
        "undefined" === typeof b && (b = !1);
        "undefined" === typeof c && (c = a.Page.Box.e_crop);
        "undefined" === typeof e && (e = a.Page.Rotate.e_0);
        d(arguments.length, 0, "getDefaultMatrix", "(boolean, number, number)", [
            [b, "boolean"],
            [c, "number"],
            [e, "number"]
        ]);
        return a.sendWithPromise("Page.getDefaultMatrix", {
            page: this.id,
            flip_y: b,
            box_type: c,
            angle: e
        }).then(function(b) {
            return new a.Matrix2D(b)
        })
    };
    a.Page.prototype.getAnnots = function() {
        return a.sendWithPromise("Page.getAnnots", {
            page: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Page.prototype.getNumAnnots = function() {
        return a.sendWithPromise("Page.getNumAnnots", {
            page: this.id
        })
    };
    a.Page.prototype.getAnnot = function(b) {
        d(arguments.length, 1, "getAnnot", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("Page.getAnnot", {
            page: this.id,
            index: b
        }).then(function(b) {
            return f(a.Annot, b)
        })
    };
    a.Page.prototype.annotInsert = function(b, c) {
        d(arguments.length,
            2, "annotInsert", "(number, PDFNet.Annot)", [
                [b, "number"],
                [c, "Object", a.Annot, "Annot"]
            ]);
        return a.sendWithPromise("Page.annotInsert", {
            page: this.id,
            pos: b,
            annot: c.id
        })
    };
    a.Page.prototype.annotPushBack = function(b) {
        d(arguments.length, 1, "annotPushBack", "(PDFNet.Annot)", [
            [b, "Object", a.Annot, "Annot"]
        ]);
        return a.sendWithPromise("Page.annotPushBack", {
            page: this.id,
            annot: b.id
        })
    };
    a.Page.prototype.annotPushFront = function(b) {
        d(arguments.length, 1, "annotPushFront", "(PDFNet.Annot)", [
            [b, "Object", a.Annot, "Annot"]
        ]);
        return a.sendWithPromise("Page.annotPushFront", {
            page: this.id,
            annot: b.id
        })
    };
    a.Page.prototype.annotRemove = function(b) {
        d(arguments.length, 1, "annotRemove", "(PDFNet.Annot)", [
            [b, "Object", a.Annot, "Annot"]
        ]);
        return a.sendWithPromise("Page.annotRemove", {
            page: this.id,
            annot: b.id
        })
    };
    a.Page.prototype.annotRemoveByIndex = function(b) {
        d(arguments.length, 1, "annotRemoveByIndex", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("Page.annotRemoveByIndex", {
            page: this.id,
            index: b
        })
    };
    a.Page.prototype.scale = function(b) {
        d(arguments.length, 1, "scale", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("Page.scale", {
            page: this.id,
            scale: b
        })
    };
    a.Page.prototype.flattenField = function(b) {
        d(arguments.length, 1, "flattenField", "(PDFNet.Field)", [
            [b, "Structure", a.Field, "Field"]
        ]);
        n("flattenField", [
            [b, 0]
        ]);
        b.yieldFunction = "Page.flattenField";
        return a.sendWithPromise("Page.flattenField", {
            page: this.id,
            field_to_flatten: b
        }).then(function(a) {
            b.yieldFunction = void 0;
            q(a, b)
        })
    };
    a.Page.prototype.hasTransition = function() {
        return a.sendWithPromise("Page.hasTransition", {
            page: this.id
        })
    };
    a.Page.prototype.getUserUnitSize =
        function() {
            return a.sendWithPromise("Page.getUserUnitSize", {
                page: this.id
            })
        };
    a.Page.prototype.setUserUnitSize = function(b) {
        d(arguments.length, 1, "setUserUnitSize", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("Page.setUserUnitSize", {
            page: this.id,
            unit_size: b
        })
    };
    a.Page.prototype.getResourceDict = function() {
        return a.sendWithPromise("Page.getResourceDict", {
            page: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Page.prototype.getContents = function() {
        return a.sendWithPromise("Page.getContents", {
            page: this.id
        }).then(function(b) {
            return f(a.Obj,
                b)
        })
    };
    a.Page.prototype.getThumb = function() {
        return a.sendWithPromise("Page.getThumb", {
            page: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Page.prototype.getSDFObj = function() {
        return a.sendWithPromise("Page.getSDFObj", {
            page: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Page.prototype.findInheritedAttribute = function(b) {
        d(arguments.length, 1, "findInheritedAttribute", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("Page.findInheritedAttribute", {
            page: this.id,
            attrib: b
        }).then(function(b) {
            return f(a.Obj,
                b)
        })
    };
    a.Annot.create = function(b, c, e) {
        d(arguments.length, 3, "create", "(PDFNet.SDFDoc, number, PDFNet.Rect)", [
            [b, "SDFDoc"],
            [c, "number"],
            [e, "Structure", a.Rect, "Rect"]
        ]);
        n("create", [
            [e, 2]
        ]);
        return a.sendWithPromise("annotCreate", {
            doc: b.id,
            type: c,
            pos: e
        }).then(function(b) {
            return f(a.Annot, b)
        })
    };
    a.Annot.createFromObj = function(b) {
        "undefined" === typeof b && (b = new a.Obj("0"));
        d(arguments.length, 0, "createFromObj", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("annotCreateFromObj", {
            d: b.id
        }).then(function(b) {
            return f(a.Annot,
                b)
        })
    };
    a.Annot.prototype.copy = function() {
        return a.sendWithPromise("Annot.copy", {
            d: this.id
        }).then(function(b) {
            return f(a.Annot, b)
        })
    };
    a.Annot.prototype.compare = function(b) {
        d(arguments.length, 1, "compare", "(PDFNet.Annot)", [
            [b, "Object", a.Annot, "Annot"]
        ]);
        return a.sendWithPromise("Annot.compare", {
            annot: this.id,
            d: b.id
        })
    };
    a.Annot.prototype.isValid = function() {
        return a.sendWithPromise("Annot.isValid", {
            annot: this.id
        })
    };
    a.Annot.prototype.getSDFObj = function() {
        return a.sendWithPromise("Annot.getSDFObj", {
            annot: this.id
        }).then(function(b) {
            return f(a.Obj,
                b)
        })
    };
    a.Annot.prototype.getType = function() {
        return a.sendWithPromise("Annot.getType", {
            annot: this.id
        })
    };
    a.Annot.prototype.isMarkup = function() {
        return a.sendWithPromise("Annot.isMarkup", {
            annot: this.id
        })
    };
    a.Annot.prototype.getRect = function() {
        return a.sendWithPromise("Annot.getRect", {
            annot: this.id
        }).then(function(b) {
            return new a.Rect(b)
        })
    };
    a.Annot.prototype.getVisibleContentBox = function() {
        return a.sendWithPromise("Annot.getVisibleContentBox", {
            annot: this.id
        }).then(function(b) {
            return new a.Rect(b)
        })
    };
    a.Annot.prototype.setRect =
        function(b) {
            d(arguments.length, 1, "setRect", "(PDFNet.Rect)", [
                [b, "Structure", a.Rect, "Rect"]
            ]);
            n("setRect", [
                [b, 0]
            ]);
            return a.sendWithPromise("Annot.setRect", {
                annot: this.id,
                pos: b
            })
        };
    a.Annot.prototype.resize = function(b) {
        d(arguments.length, 1, "resize", "(PDFNet.Rect)", [
            [b, "Structure", a.Rect, "Rect"]
        ]);
        n("resize", [
            [b, 0]
        ]);
        return a.sendWithPromise("Annot.resize", {
            annot: this.id,
            newrect: b
        })
    };
    a.Annot.prototype.setContents = function(b) {
        d(arguments.length, 1, "setContents", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("Annot.setContents", {
            annot: this.id,
            contents: b
        })
    };
    a.Annot.prototype.getContents = function() {
        return a.sendWithPromise("Annot.getContents", {
            annot: this.id
        })
    };
    a.Annot.prototype.getTriggerAction = function(b) {
        d(arguments.length, 1, "getTriggerAction", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("Annot.getTriggerAction", {
            annot: this.id,
            trigger: b
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Annot.prototype.getCustomData = function(b) {
        d(arguments.length, 1, "getCustomData", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("Annot.getCustomData", {
            annot: this.id,
            key: b
        })
    };
    a.Annot.prototype.setCustomData = function(b, c) {
        d(arguments.length, 2, "setCustomData", "(string, string)", [
            [b, "string"],
            [c, "string"]
        ]);
        return a.sendWithPromise("Annot.setCustomData", {
            annot: this.id,
            key: b,
            value: c
        })
    };
    a.Annot.prototype.deleteCustomData = function(b) {
        d(arguments.length, 1, "deleteCustomData", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("Annot.deleteCustomData", {
            annot: this.id,
            key: b
        })
    };
    a.Annot.prototype.getPage = function() {
        return a.sendWithPromise("Annot.getPage", {
            annot: this.id
        }).then(function(b) {
            return f(a.Page,
                b)
        })
    };
    a.Annot.prototype.setPage = function(b) {
        d(arguments.length, 1, "setPage", "(PDFNet.Page)", [
            [b, "Object", a.Page, "Page"]
        ]);
        return a.sendWithPromise("Annot.setPage", {
            annot: this.id,
            page: b.id
        })
    };
    a.Annot.prototype.getUniqueID = function() {
        return a.sendWithPromise("Annot.getUniqueID", {
            annot: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Annot.prototype.setUniqueID = function(b) {
        d(arguments.length, 1, "setUniqueID", "(ArrayBuffer|TypedArray)", [
            [b, "ArrayBuffer"]
        ]);
        var c = u(b, !1);
        return a.sendWithPromise("Annot.setUniqueID", {
            annot: this.id,
            id_buf: c
        })
    };
    a.Annot.prototype.getDate = function() {
        return a.sendWithPromise("Annot.getDate", {
            annot: this.id
        }).then(function(b) {
            return new a.Date(b)
        })
    };
    a.Annot.prototype.setDate = function(b) {
        d(arguments.length, 1, "setDate", "(PDFNet.Date)", [
            [b, "Structure", a.Date, "Date"]
        ]);
        n("setDate", [
            [b, 0]
        ]);
        return a.sendWithPromise("Annot.setDate", {
            annot: this.id,
            date: b
        })
    };
    a.Annot.prototype.getFlag = function(b) {
        d(arguments.length, 1, "getFlag", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("Annot.getFlag", {
            annot: this.id,
            flag: b
        })
    };
    a.Annot.prototype.setFlag = function(b, c) {
        d(arguments.length, 2, "setFlag", "(number, boolean)", [
            [b, "number"],
            [c, "boolean"]
        ]);
        return a.sendWithPromise("Annot.setFlag", {
            annot: this.id,
            flag: b,
            value: c
        })
    };
    a.AnnotBorderStyle.create = function(b, c, e, m) {
        "undefined" === typeof e && (e = 0);
        "undefined" === typeof m && (m = 0);
        d(arguments.length, 2, "create", "(number, number, number, number)", [
            [b, "number"],
            [c, "number"],
            [e, "number"],
            [m, "number"]
        ]);
        return a.sendWithPromise("annotBorderStyleCreate", {
            s: b,
            b_width: c,
            b_hr: e,
            b_vr: m
        }).then(function(b) {
            return l(a.AnnotBorderStyle, b)
        })
    };
    a.AnnotBorderStyle.createWithDashPattern = function(b, c, e, m, f) {
        d(arguments.length, 5, "createWithDashPattern", "(number, number, number, number, Array<number>)", [
            [b, "number"],
            [c, "number"],
            [e, "number"],
            [m, "number"],
            [f, "Array"]
        ]);
        return a.sendWithPromise("annotBorderStyleCreateWithDashPattern", {
            s: b,
            b_width: c,
            b_hr: e,
            b_vr: m,
            b_dash_list: f
        }).then(function(b) {
            return l(a.AnnotBorderStyle, b)
        })
    };
    a.AnnotBorderStyle.prototype.copy = function() {
        return a.sendWithPromise("AnnotBorderStyle.copy", {
            bs: this.id
        }).then(function(b) {
            return l(a.AnnotBorderStyle, b)
        })
    };
    a.AnnotBorderStyle.prototype.getStyle = function() {
        return a.sendWithPromise("AnnotBorderStyle.getStyle", {
            bs: this.id
        })
    };
    a.AnnotBorderStyle.prototype.setStyle = function(b) {
        d(arguments.length, 1, "setStyle", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("AnnotBorderStyle.setStyle", {
            bs: this.id,
            style: b
        })
    };
    a.Annot.prototype.getAppearance = function(b, c) {
        "undefined" === typeof b && (b = a.Annot.State.e_normal);
        "undefined" === typeof c && (c = null);
        d(arguments.length,
            0, "getAppearance", "(number, string)", [
                [b, "number"],
                [c, "const char* = 0"]
            ]);
        return a.sendWithPromise("Annot.getAppearance", {
            annot: this.id,
            annot_state: b,
            app_state: c
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Annot.prototype.setAppearance = function(b, c, e) {
        "undefined" === typeof c && (c = a.Annot.State.e_normal);
        "undefined" === typeof e && (e = null);
        d(arguments.length, 1, "setAppearance", "(PDFNet.Obj, number, string)", [
            [b, "Object", a.Obj, "Obj"],
            [c, "number"],
            [e, "const char* = 0"]
        ]);
        return a.sendWithPromise("Annot.setAppearance", {
            annot: this.id,
            app_stream: b.id,
            annot_state: c,
            app_state: e
        })
    };
    a.Annot.prototype.removeAppearance = function(b, c) {
        "undefined" === typeof b && (b = a.Annot.State.e_normal);
        "undefined" === typeof c && (c = null);
        d(arguments.length, 0, "removeAppearance", "(number, string)", [
            [b, "number"],
            [c, "const char* = 0"]
        ]);
        return a.sendWithPromise("Annot.removeAppearance", {
            annot: this.id,
            annot_state: b,
            app_state: c
        })
    };
    a.Annot.prototype.flatten = function(b) {
        d(arguments.length, 1, "flatten", "(PDFNet.Page)", [
            [b, "Object", a.Page, "Page"]
        ]);
        return a.sendWithPromise("Annot.flatten", {
            annot: this.id,
            page: b.id
        })
    };
    a.Annot.prototype.getActiveAppearanceState = function() {
        return a.sendWithPromise("Annot.getActiveAppearanceState", {
            annot: this.id
        })
    };
    a.Annot.prototype.setActiveAppearanceState = function(b) {
        d(arguments.length, 1, "setActiveAppearanceState", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("Annot.setActiveAppearanceState", {
            annot: this.id,
            astate: b
        })
    };
    a.Annot.prototype.getColor = function() {
        return a.sendWithPromise("Annot.getColor", {
            annot: this.id
        }).then(function(b) {
            return l(a.ColorPt,
                b)
        })
    };
    a.Annot.prototype.getColorAsRGB = function() {
        return a.sendWithPromise("Annot.getColorAsRGB", {
            annot: this.id
        }).then(function(b) {
            return l(a.ColorPt, b)
        })
    };
    a.Annot.prototype.getColorAsCMYK = function() {
        return a.sendWithPromise("Annot.getColorAsCMYK", {
            annot: this.id
        }).then(function(b) {
            return l(a.ColorPt, b)
        })
    };
    a.Annot.prototype.getColorAsGray = function() {
        return a.sendWithPromise("Annot.getColorAsGray", {
            annot: this.id
        }).then(function(b) {
            return l(a.ColorPt, b)
        })
    };
    a.Annot.prototype.getColorCompNum = function() {
        return a.sendWithPromise("Annot.getColorCompNum", {
            annot: this.id
        })
    };
    a.Annot.prototype.setColorDefault = function(b) {
        d(arguments.length, 1, "setColorDefault", "(PDFNet.ColorPt)", [
            [b, "Object", a.ColorPt, "ColorPt"]
        ]);
        return a.sendWithPromise("Annot.setColorDefault", {
            annot: this.id,
            col: b.id
        })
    };
    a.Annot.prototype.setColor = function(b, c) {
        "undefined" === typeof c && (c = 3);
        d(arguments.length, 1, "setColor", "(PDFNet.ColorPt, number)", [
            [b, "Object", a.ColorPt, "ColorPt"],
            [c, "number"]
        ]);
        return a.sendWithPromise("Annot.setColor", {
            annot: this.id,
            col: b.id,
            numcomp: c
        })
    };
    a.Annot.prototype.getStructParent =
        function() {
            return a.sendWithPromise("Annot.getStructParent", {
                annot: this.id
            })
        };
    a.Annot.prototype.setStructParent = function(b) {
        d(arguments.length, 1, "setStructParent", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("Annot.setStructParent", {
            annot: this.id,
            parkeyval: b
        })
    };
    a.Annot.prototype.getOptionalContent = function() {
        return a.sendWithPromise("Annot.getOptionalContent", {
            annot: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Annot.prototype.setOptionalContent = function(b) {
        d(arguments.length, 1, "setOptionalContent",
            "(PDFNet.Obj)", [
                [b, "Object", a.Obj, "Obj"]
            ]);
        return a.sendWithPromise("Annot.setOptionalContent", {
            annot: this.id,
            content: b.id
        })
    };
    a.Annot.prototype.refreshAppearance = function() {
        return a.sendWithPromise("Annot.refreshAppearance", {
            annot: this.id
        })
    };
    a.Annot.prototype.refreshAppearanceRefreshOptions = function(b) {
        "undefined" === typeof b && (b = null);
        d(arguments.length, 0, "refreshAppearanceRefreshOptions", "(PDFNet.OptionBase)", [
            [b, "OptionBase"]
        ]);
        n("refreshAppearanceRefreshOptions", [
            [b, 0]
        ]);
        b = b ? b.getJsonString() :
            "{}";
        return a.sendWithPromise("Annot.refreshAppearanceRefreshOptions", {
            annot: this.id,
            options: b
        })
    };
    a.Annot.prototype.getRotation = function() {
        return a.sendWithPromise("Annot.getRotation", {
            annot: this.id
        })
    };
    a.Annot.prototype.setRotation = function(b) {
        d(arguments.length, 1, "setRotation", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("Annot.setRotation", {
            annot: this.id,
            angle: b
        })
    };
    a.AnnotBorderStyle.prototype.getWidth = function() {
        return a.sendWithPromise("AnnotBorderStyle.getWidth", {
            bs: this.id
        })
    };
    a.AnnotBorderStyle.prototype.setWidth =
        function(b) {
            d(arguments.length, 1, "setWidth", "(number)", [
                [b, "number"]
            ]);
            return a.sendWithPromise("AnnotBorderStyle.setWidth", {
                bs: this.id,
                width: b
            })
        };
    a.AnnotBorderStyle.prototype.getHR = function() {
        return a.sendWithPromise("AnnotBorderStyle.getHR", {
            bs: this.id
        })
    };
    a.AnnotBorderStyle.prototype.setHR = function(b) {
        d(arguments.length, 1, "setHR", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("AnnotBorderStyle.setHR", {
            bs: this.id,
            horizontal_radius: b
        })
    };
    a.AnnotBorderStyle.prototype.getVR = function() {
        return a.sendWithPromise("AnnotBorderStyle.getVR", {
            bs: this.id
        })
    };
    a.AnnotBorderStyle.prototype.setVR = function(b) {
        d(arguments.length, 1, "setVR", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("AnnotBorderStyle.setVR", {
            bs: this.id,
            vertical_radius: b
        })
    };
    a.AnnotBorderStyle.prototype.getDashPattern = function() {
        return a.sendWithPromise("AnnotBorderStyle.getDashPattern", {
            bs: this.id
        }).then(function(a) {
            return new Float64Array(a)
        })
    };
    a.Annot.prototype.getBorderStyle = function() {
        return a.sendWithPromise("Annot.getBorderStyle", {
            annot: this.id
        }).then(function(b) {
            return l(a.AnnotBorderStyle,
                b)
        })
    };
    a.Annot.prototype.setBorderStyle = function(b, c) {
        "undefined" === typeof c && (c = !1);
        d(arguments.length, 1, "setBorderStyle", "(PDFNet.AnnotBorderStyle, boolean)", [
            [b, "Object", a.AnnotBorderStyle, "AnnotBorderStyle"],
            [c, "boolean"]
        ]);
        return a.sendWithPromise("Annot.setBorderStyle", {
            annot: this.id,
            bs: b.id,
            oldStyleOnly: c
        })
    };
    a.Annot.getBorderStyleStyle = function(b) {
        d(arguments.length, 1, "getBorderStyleStyle", "(PDFNet.AnnotBorderStyle)", [
            [b, "Object", a.AnnotBorderStyle, "AnnotBorderStyle"]
        ]);
        return a.sendWithPromise("annotGetBorderStyleStyle", {
            bs: b.id
        })
    };
    a.Annot.setBorderStyleStyle = function(b, c) {
        d(arguments.length, 2, "setBorderStyleStyle", "(PDFNet.AnnotBorderStyle, number)", [
            [b, "Object", a.AnnotBorderStyle, "AnnotBorderStyle"],
            [c, "number"]
        ]);
        return a.sendWithPromise("annotSetBorderStyleStyle", {
            bs: b.id,
            bst: c
        })
    };
    a.AnnotBorderStyle.prototype.compare = function(b) {
        d(arguments.length, 1, "compare", "(PDFNet.AnnotBorderStyle)", [
            [b, "Object", a.AnnotBorderStyle, "AnnotBorderStyle"]
        ]);
        return a.sendWithPromise("AnnotBorderStyle.compare", {
            a: this.id,
            b: b.id
        })
    };
    a.CaretAnnot.createFromObj = function(b) {
        "undefined" === typeof b && (b = new a.Obj("0"));
        d(arguments.length, 0, "createFromObj", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("caretAnnotCreateFromObj", {
            d: b.id
        }).then(function(b) {
            return f(a.CaretAnnot, b)
        })
    };
    a.CaretAnnot.createFromAnnot = function(b) {
        d(arguments.length, 1, "createFromAnnot", "(PDFNet.Annot)", [
            [b, "Object", a.Annot, "Annot"]
        ]);
        return a.sendWithPromise("caretAnnotCreateFromAnnot", {
            ann: b.id
        }).then(function(b) {
            return f(a.CaretAnnot,
                b)
        })
    };
    a.CaretAnnot.create = function(b, c) {
        d(arguments.length, 2, "create", "(PDFNet.SDFDoc, PDFNet.Rect)", [
            [b, "SDFDoc"],
            [c, "Structure", a.Rect, "Rect"]
        ]);
        n("create", [
            [c, 1]
        ]);
        return a.sendWithPromise("caretAnnotCreate", {
            doc: b.id,
            pos: c
        }).then(function(b) {
            return f(a.CaretAnnot, b)
        })
    };
    a.CaretAnnot.prototype.getSymbol = function() {
        return a.sendWithPromise("CaretAnnot.getSymbol", {
            caret: this.id
        })
    };
    a.CaretAnnot.prototype.setSymbol = function(b) {
        d(arguments.length, 1, "setSymbol", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("CaretAnnot.setSymbol", {
            caret: this.id,
            symbol: b
        })
    };
    a.LineAnnot.createFromObj = function(b) {
        "undefined" === typeof b && (b = new a.Obj("0"));
        d(arguments.length, 0, "createFromObj", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("lineAnnotCreateFromObj", {
            d: b.id
        }).then(function(b) {
            return f(a.LineAnnot, b)
        })
    };
    a.LineAnnot.createFromAnnot = function(b) {
        d(arguments.length, 1, "createFromAnnot", "(PDFNet.Annot)", [
            [b, "Object", a.Annot, "Annot"]
        ]);
        return a.sendWithPromise("lineAnnotCreateFromAnnot", {
            ann: b.id
        }).then(function(b) {
            return f(a.LineAnnot,
                b)
        })
    };
    a.LineAnnot.create = function(b, c) {
        d(arguments.length, 2, "create", "(PDFNet.SDFDoc, PDFNet.Rect)", [
            [b, "SDFDoc"],
            [c, "Structure", a.Rect, "Rect"]
        ]);
        n("create", [
            [c, 1]
        ]);
        return a.sendWithPromise("lineAnnotCreate", {
            doc: b.id,
            pos: c
        }).then(function(b) {
            return f(a.LineAnnot, b)
        })
    };
    a.LineAnnot.prototype.getStartPoint = function() {
        return a.sendWithPromise("LineAnnot.getStartPoint", {
            line: this.id
        })
    };
    a.LineAnnot.prototype.setStartPoint = function(b) {
        d(arguments.length, 1, "setStartPoint", "(PDFNet.Point)", [
            [b, "Structure",
                a.Point, "Point"
            ]
        ]);
        n("setStartPoint", [
            [b, 0]
        ]);
        return a.sendWithPromise("LineAnnot.setStartPoint", {
            line: this.id,
            sp: b
        })
    };
    a.LineAnnot.prototype.getEndPoint = function() {
        return a.sendWithPromise("LineAnnot.getEndPoint", {
            line: this.id
        })
    };
    a.LineAnnot.prototype.setEndPoint = function(b) {
        d(arguments.length, 1, "setEndPoint", "(PDFNet.Point)", [
            [b, "Structure", a.Point, "Point"]
        ]);
        n("setEndPoint", [
            [b, 0]
        ]);
        return a.sendWithPromise("LineAnnot.setEndPoint", {
            line: this.id,
            ep: b
        })
    };
    a.LineAnnot.prototype.getStartStyle = function() {
        return a.sendWithPromise("LineAnnot.getStartStyle", {
            line: this.id
        })
    };
    a.LineAnnot.prototype.setStartStyle = function(b) {
        d(arguments.length, 1, "setStartStyle", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("LineAnnot.setStartStyle", {
            line: this.id,
            ss: b
        })
    };
    a.LineAnnot.prototype.getEndStyle = function() {
        return a.sendWithPromise("LineAnnot.getEndStyle", {
            line: this.id
        })
    };
    a.LineAnnot.prototype.setEndStyle = function(b) {
        d(arguments.length, 1, "setEndStyle", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("LineAnnot.setEndStyle", {
            line: this.id,
            es: b
        })
    };
    a.LineAnnot.prototype.getLeaderLineLength =
        function() {
            return a.sendWithPromise("LineAnnot.getLeaderLineLength", {
                line: this.id
            })
        };
    a.LineAnnot.prototype.setLeaderLineLength = function(b) {
        d(arguments.length, 1, "setLeaderLineLength", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("LineAnnot.setLeaderLineLength", {
            line: this.id,
            length: b
        })
    };
    a.LineAnnot.prototype.getLeaderLineExtensionLength = function() {
        return a.sendWithPromise("LineAnnot.getLeaderLineExtensionLength", {
            line: this.id
        })
    };
    a.LineAnnot.prototype.setLeaderLineExtensionLength = function(b) {
        d(arguments.length,
            1, "setLeaderLineExtensionLength", "(number)", [
                [b, "number"]
            ]);
        return a.sendWithPromise("LineAnnot.setLeaderLineExtensionLength", {
            line: this.id,
            length: b
        })
    };
    a.LineAnnot.prototype.getShowCaption = function() {
        return a.sendWithPromise("LineAnnot.getShowCaption", {
            line: this.id
        })
    };
    a.LineAnnot.prototype.setShowCaption = function(b) {
        d(arguments.length, 1, "setShowCaption", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("LineAnnot.setShowCaption", {
            line: this.id,
            showCaption: b
        })
    };
    a.LineAnnot.prototype.getIntentType =
        function() {
            return a.sendWithPromise("LineAnnot.getIntentType", {
                line: this.id
            })
        };
    a.LineAnnot.prototype.setIntentType = function(b) {
        d(arguments.length, 1, "setIntentType", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("LineAnnot.setIntentType", {
            line: this.id,
            it: b
        })
    };
    a.LineAnnot.prototype.getCapPos = function() {
        return a.sendWithPromise("LineAnnot.getCapPos", {
            line: this.id
        })
    };
    a.LineAnnot.prototype.setCapPos = function(b) {
        d(arguments.length, 1, "setCapPos", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("LineAnnot.setCapPos", {
            line: this.id,
            it: b
        })
    };
    a.LineAnnot.prototype.getLeaderLineOffset = function() {
        return a.sendWithPromise("LineAnnot.getLeaderLineOffset", {
            line: this.id
        })
    };
    a.LineAnnot.prototype.setLeaderLineOffset = function(b) {
        d(arguments.length, 1, "setLeaderLineOffset", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("LineAnnot.setLeaderLineOffset", {
            line: this.id,
            length: b
        })
    };
    a.LineAnnot.prototype.getTextHOffset = function() {
        return a.sendWithPromise("LineAnnot.getTextHOffset", {
            line: this.id
        })
    };
    a.LineAnnot.prototype.setTextHOffset =
        function(b) {
            d(arguments.length, 1, "setTextHOffset", "(number)", [
                [b, "number"]
            ]);
            return a.sendWithPromise("LineAnnot.setTextHOffset", {
                line: this.id,
                offset: b
            })
        };
    a.LineAnnot.prototype.getTextVOffset = function() {
        return a.sendWithPromise("LineAnnot.getTextVOffset", {
            line: this.id
        })
    };
    a.LineAnnot.prototype.setTextVOffset = function(b) {
        d(arguments.length, 1, "setTextVOffset", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("LineAnnot.setTextVOffset", {
            line: this.id,
            offset: b
        })
    };
    a.CircleAnnot.createFromObj = function(b) {
        "undefined" ===
        typeof b && (b = new a.Obj("0"));
        d(arguments.length, 0, "createFromObj", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("circleAnnotCreateFromObj", {
            d: b.id
        }).then(function(b) {
            return f(a.CircleAnnot, b)
        })
    };
    a.CircleAnnot.createFromAnnot = function(b) {
        d(arguments.length, 1, "createFromAnnot", "(PDFNet.Annot)", [
            [b, "Object", a.Annot, "Annot"]
        ]);
        return a.sendWithPromise("circleAnnotCreateFromAnnot", {
            circle: b.id
        }).then(function(b) {
            return f(a.CircleAnnot, b)
        })
    };
    a.CircleAnnot.create = function(b, c) {
        d(arguments.length,
            2, "create", "(PDFNet.SDFDoc, PDFNet.Rect)", [
                [b, "SDFDoc"],
                [c, "Structure", a.Rect, "Rect"]
            ]);
        n("create", [
            [c, 1]
        ]);
        return a.sendWithPromise("circleAnnotCreate", {
            doc: b.id,
            pos: c
        }).then(function(b) {
            return f(a.CircleAnnot, b)
        })
    };
    a.CircleAnnot.prototype.getInteriorColor = function() {
        return a.sendWithPromise("CircleAnnot.getInteriorColor", {
            circle: this.id
        }).then(function(b) {
            return l(a.ColorPt, b)
        })
    };
    a.CircleAnnot.prototype.getInteriorColorCompNum = function() {
        return a.sendWithPromise("CircleAnnot.getInteriorColorCompNum", {
            circle: this.id
        })
    };
    a.CircleAnnot.prototype.setInteriorColorDefault = function(b) {
        d(arguments.length, 1, "setInteriorColorDefault", "(PDFNet.ColorPt)", [
            [b, "Object", a.ColorPt, "ColorPt"]
        ]);
        return a.sendWithPromise("CircleAnnot.setInteriorColorDefault", {
            circle: this.id,
            col: b.id
        })
    };
    a.CircleAnnot.prototype.setInteriorColor = function(b, c) {
        d(arguments.length, 2, "setInteriorColor", "(PDFNet.ColorPt, number)", [
            [b, "Object", a.ColorPt, "ColorPt"],
            [c, "number"]
        ]);
        return a.sendWithPromise("CircleAnnot.setInteriorColor", {
            circle: this.id,
            col: b.id,
            numcomp: c
        })
    };
    a.CircleAnnot.prototype.getContentRect = function() {
        return a.sendWithPromise("CircleAnnot.getContentRect", {
            circle: this.id
        }).then(function(b) {
            return new a.Rect(b)
        })
    };
    a.CircleAnnot.prototype.setContentRect = function(b) {
        d(arguments.length, 1, "setContentRect", "(PDFNet.Rect)", [
            [b, "Structure", a.Rect, "Rect"]
        ]);
        n("setContentRect", [
            [b, 0]
        ]);
        return a.sendWithPromise("CircleAnnot.setContentRect", {
            circle: this.id,
            cr: b
        })
    };
    a.CircleAnnot.prototype.getPadding = function() {
        return a.sendWithPromise("CircleAnnot.getPadding", {
            circle: this.id
        }).then(function(b) {
            return new a.Rect(b)
        })
    };
    a.CircleAnnot.prototype.setPadding = function(b) {
        d(arguments.length, 1, "setPadding", "(PDFNet.Rect)", [
            [b, "Structure", a.Rect, "Rect"]
        ]);
        n("setPadding", [
            [b, 0]
        ]);
        return a.sendWithPromise("CircleAnnot.setPadding", {
            circle: this.id,
            cr: b
        })
    };
    a.FileAttachmentAnnot.createFromObj = function(b) {
        "undefined" === typeof b && (b = new a.Obj("0"));
        d(arguments.length, 0, "createFromObj", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("fileAttachmentAnnotCreateFromObj", {
            d: b.id
        }).then(function(b) {
            return f(a.FileAttachmentAnnot, b)
        })
    };
    a.FileAttachmentAnnot.prototype.export = function(b) {
        "undefined" === typeof b && (b = "");
        d(arguments.length, 0, "export", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("FileAttachmentAnnot.export", {
            fileatt: this.id,
            save_as: b
        })
    };
    a.FileAttachmentAnnot.prototype.createFromAnnot = function() {
        return a.sendWithPromise("FileAttachmentAnnot.createFromAnnot", {
            fileatt: this.id
        }).then(function(b) {
            return f(a.Annot, b)
        })
    };
    a.FileAttachmentAnnot.createWithFileSpec =
        function(b, c, e, m) {
            "undefined" === typeof m && (m = a.FileAttachmentAnnot.Icon.e_PushPin);
            d(arguments.length, 3, "createWithFileSpec", "(PDFNet.SDFDoc, PDFNet.Rect, PDFNet.FileSpec, number)", [
                [b, "SDFDoc"],
                [c, "Structure", a.Rect, "Rect"],
                [e, "Object", a.FileSpec, "FileSpec"],
                [m, "number"]
            ]);
            n("createWithFileSpec", [
                [c, 1]
            ]);
            return a.sendWithPromise("fileAttachmentAnnotCreateWithFileSpec", {
                doc: b.id,
                pos: c,
                fs: e.id,
                icon_name: m
            }).then(function(b) {
                return f(a.FileAttachmentAnnot, b)
            })
        };
    a.FileAttachmentAnnot.createDefault = function(b,
        c, e) {
        d(arguments.length, 3, "createDefault", "(PDFNet.SDFDoc, PDFNet.Rect, string)", [
            [b, "SDFDoc"],
            [c, "Structure", a.Rect, "Rect"],
            [e, "string"]
        ]);
        n("createDefault", [
            [c, 1]
        ]);
        return a.sendWithPromise("fileAttachmentAnnotCreateDefault", {
            doc: b.id,
            pos: c,
            path: e
        }).then(function(b) {
            return f(a.FileAttachmentAnnot, b)
        })
    };
    a.FileAttachmentAnnot.prototype.getFileSpec = function() {
        return a.sendWithPromise("FileAttachmentAnnot.getFileSpec", {
            fileatt: this.id
        }).then(function(b) {
            return f(a.FileSpec, b)
        })
    };
    a.FileAttachmentAnnot.prototype.setFileSpec =
        function(b) {
            d(arguments.length, 1, "setFileSpec", "(PDFNet.FileSpec)", [
                [b, "Object", a.FileSpec, "FileSpec"]
            ]);
            return a.sendWithPromise("FileAttachmentAnnot.setFileSpec", {
                fileatt: this.id,
                file: b.id
            })
        };
    a.FileAttachmentAnnot.prototype.getIcon = function() {
        return a.sendWithPromise("FileAttachmentAnnot.getIcon", {
            fileatt: this.id
        })
    };
    a.FileAttachmentAnnot.prototype.setIcon = function(b) {
        "undefined" === typeof b && (b = a.FileAttachmentAnnot.Icon.e_PushPin);
        d(arguments.length, 0, "setIcon", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("FileAttachmentAnnot.setIcon", {
            fileatt: this.id,
            type: b
        })
    };
    a.FileAttachmentAnnot.prototype.getIconName = function() {
        return a.sendWithPromise("FileAttachmentAnnot.getIconName", {
            fileatt: this.id
        })
    };
    a.FileAttachmentAnnot.prototype.setIconName = function(b) {
        d(arguments.length, 1, "setIconName", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("FileAttachmentAnnot.setIconName", {
            fileatt: this.id,
            iname: b
        })
    };
    a.FreeTextAnnot.createFromObj = function(b) {
        "undefined" === typeof b && (b = new a.Obj("0"));
        d(arguments.length, 0, "createFromObj", "(PDFNet.Obj)",
            [
                [b, "Object", a.Obj, "Obj"]
            ]);
        return a.sendWithPromise("freeTextAnnotCreateFromObj", {
            d: b.id
        }).then(function(b) {
            return f(a.FreeTextAnnot, b)
        })
    };
    a.FreeTextAnnot.createFromAnnot = function(b) {
        d(arguments.length, 1, "createFromAnnot", "(PDFNet.Annot)", [
            [b, "Object", a.Annot, "Annot"]
        ]);
        return a.sendWithPromise("freeTextAnnotCreateFromAnnot", {
            ann: b.id
        }).then(function(b) {
            return f(a.FreeTextAnnot, b)
        })
    };
    a.FreeTextAnnot.create = function(b, c) {
        d(arguments.length, 2, "create", "(PDFNet.SDFDoc, PDFNet.Rect)", [
            [b, "SDFDoc"],
            [c,
                "Structure", a.Rect, "Rect"
            ]
        ]);
        n("create", [
            [c, 1]
        ]);
        return a.sendWithPromise("freeTextAnnotCreate", {
            doc: b.id,
            pos: c
        }).then(function(b) {
            return f(a.FreeTextAnnot, b)
        })
    };
    a.FreeTextAnnot.prototype.getDefaultAppearance = function() {
        return a.sendWithPromise("FreeTextAnnot.getDefaultAppearance", {
            ft: this.id
        })
    };
    a.FreeTextAnnot.prototype.setDefaultAppearance = function(b) {
        d(arguments.length, 1, "setDefaultAppearance", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("FreeTextAnnot.setDefaultAppearance", {
            ft: this.id,
            app_str: b
        })
    };
    a.FreeTextAnnot.prototype.getQuaddingFormat = function() {
        return a.sendWithPromise("FreeTextAnnot.getQuaddingFormat", {
            ft: this.id
        })
    };
    a.FreeTextAnnot.prototype.setQuaddingFormat = function(b) {
        d(arguments.length, 1, "setQuaddingFormat", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("FreeTextAnnot.setQuaddingFormat", {
            ft: this.id,
            format: b
        })
    };
    a.FreeTextAnnot.prototype.getCalloutLinePoints = function() {
        return a.sendWithPromise("FreeTextAnnot.getCalloutLinePoints", {
            ft: this.id
        })
    };
    a.FreeTextAnnot.prototype.setCalloutLinePoints =
        function(b, c, e) {
            d(arguments.length, 3, "setCalloutLinePoints", "(PDFNet.Point, PDFNet.Point, PDFNet.Point)", [
                [b, "Structure", a.Point, "Point"],
                [c, "Structure", a.Point, "Point"],
                [e, "Structure", a.Point, "Point"]
            ]);
            n("setCalloutLinePoints", [
                [b, 0],
                [c, 1],
                [e, 2]
            ]);
            return a.sendWithPromise("FreeTextAnnot.setCalloutLinePoints", {
                ft: this.id,
                p1: b,
                p2: c,
                p3: e
            })
        };
    a.FreeTextAnnot.prototype.setCalloutLinePointsTwo = function(b, c) {
        d(arguments.length, 2, "setCalloutLinePointsTwo", "(PDFNet.Point, PDFNet.Point)", [
            [b, "Structure", a.Point,
                "Point"
            ],
            [c, "Structure", a.Point, "Point"]
        ]);
        n("setCalloutLinePointsTwo", [
            [b, 0],
            [c, 1]
        ]);
        return a.sendWithPromise("FreeTextAnnot.setCalloutLinePointsTwo", {
            ft: this.id,
            p1: b,
            p2: c
        })
    };
    a.FreeTextAnnot.prototype.getIntentName = function() {
        return a.sendWithPromise("FreeTextAnnot.getIntentName", {
            ft: this.id
        })
    };
    a.FreeTextAnnot.prototype.setIntentName = function(b) {
        "undefined" === typeof b && (b = a.FreeTextAnnot.IntentName.e_FreeText);
        d(arguments.length, 0, "setIntentName", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("FreeTextAnnot.setIntentName", {
            ft: this.id,
            mode: b
        })
    };
    a.FreeTextAnnot.prototype.setIntentNameDefault = function() {
        return a.sendWithPromise("FreeTextAnnot.setIntentNameDefault", {
            ft: this.id
        })
    };
    a.FreeTextAnnot.prototype.getEndingStyle = function() {
        return a.sendWithPromise("FreeTextAnnot.getEndingStyle", {
            ft: this.id
        })
    };
    a.FreeTextAnnot.prototype.setEndingStyle = function(b) {
        d(arguments.length, 1, "setEndingStyle", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("FreeTextAnnot.setEndingStyle", {
            ft: this.id,
            style: b
        })
    };
    a.FreeTextAnnot.prototype.setEndingStyleName =
        function(b) {
            d(arguments.length, 1, "setEndingStyleName", "(string)", [
                [b, "string"]
            ]);
            return a.sendWithPromise("FreeTextAnnot.setEndingStyleName", {
                ft: this.id,
                est: b
            })
        };
    a.FreeTextAnnot.prototype.setTextColor = function(b, c) {
        d(arguments.length, 2, "setTextColor", "(PDFNet.ColorPt, number)", [
            [b, "Object", a.ColorPt, "ColorPt"],
            [c, "number"]
        ]);
        return a.sendWithPromise("FreeTextAnnot.setTextColor", {
            ft: this.id,
            color: b.id,
            col_comp: c
        })
    };
    a.FreeTextAnnot.prototype.getTextColor = function() {
        return a.sendWithPromise("FreeTextAnnot.getTextColor", {
            ft: this.id
        }).then(function(b) {
            b.color = l(a.ColorPt, b.color);
            return b
        })
    };
    a.FreeTextAnnot.prototype.setLineColor = function(b, c) {
        d(arguments.length, 2, "setLineColor", "(PDFNet.ColorPt, number)", [
            [b, "Object", a.ColorPt, "ColorPt"],
            [c, "number"]
        ]);
        return a.sendWithPromise("FreeTextAnnot.setLineColor", {
            ft: this.id,
            color: b.id,
            col_comp: c
        })
    };
    a.FreeTextAnnot.prototype.getLineColor = function() {
        return a.sendWithPromise("FreeTextAnnot.getLineColor", {
            ft: this.id
        }).then(function(b) {
            b.color = l(a.ColorPt, b.color);
            return b
        })
    };
    a.FreeTextAnnot.prototype.setFontName = function(b) {
        d(arguments.length, 1, "setFontName", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("FreeTextAnnot.setFontName", {
            ft: this.id,
            fontName: b
        })
    };
    a.FreeTextAnnot.prototype.setFontSize = function(b) {
        d(arguments.length, 1, "setFontSize", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("FreeTextAnnot.setFontSize", {
            ft: this.id,
            font_size: b
        })
    };
    a.FreeTextAnnot.prototype.getFontSize = function() {
        return a.sendWithPromise("FreeTextAnnot.getFontSize", {
            ft: this.id
        })
    };
    a.HighlightAnnot.createFromObj =
        function(b) {
            d(arguments.length, 1, "createFromObj", "(PDFNet.Obj)", [
                [b, "Object", a.Obj, "Obj"]
            ]);
            return a.sendWithPromise("highlightAnnotCreateFromObj", {
                d: b.id
            }).then(function(b) {
                return f(a.HighlightAnnot, b)
            })
        };
    a.HighlightAnnot.createFromAnnot = function(b) {
        d(arguments.length, 1, "createFromAnnot", "(PDFNet.Annot)", [
            [b, "Object", a.Annot, "Annot"]
        ]);
        return a.sendWithPromise("highlightAnnotCreateFromAnnot", {
            ann: b.id
        }).then(function(b) {
            return f(a.HighlightAnnot, b)
        })
    };
    a.HighlightAnnot.create = function(b, c) {
        d(arguments.length,
            2, "create", "(PDFNet.SDFDoc, PDFNet.Rect)", [
                [b, "SDFDoc"],
                [c, "Structure", a.Rect, "Rect"]
            ]);
        n("create", [
            [c, 1]
        ]);
        return a.sendWithPromise("highlightAnnotCreate", {
            doc: b.id,
            pos: c
        }).then(function(b) {
            return f(a.HighlightAnnot, b)
        })
    };
    a.InkAnnot.createFromObj = function(b) {
        "undefined" === typeof b && (b = new a.Obj("0"));
        d(arguments.length, 0, "createFromObj", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("inkAnnotCreateFromObj", {
            d: b.id
        }).then(function(b) {
            return f(a.InkAnnot, b)
        })
    };
    a.InkAnnot.createFromAnnot =
        function(b) {
            d(arguments.length, 1, "createFromAnnot", "(PDFNet.Annot)", [
                [b, "Object", a.Annot, "Annot"]
            ]);
            return a.sendWithPromise("inkAnnotCreateFromAnnot", {
                ann: b.id
            }).then(function(b) {
                return f(a.InkAnnot, b)
            })
        };
    a.InkAnnot.create = function(b, c) {
        d(arguments.length, 2, "create", "(PDFNet.SDFDoc, PDFNet.Rect)", [
            [b, "SDFDoc"],
            [c, "Structure", a.Rect, "Rect"]
        ]);
        n("create", [
            [c, 1]
        ]);
        return a.sendWithPromise("inkAnnotCreate", {
            doc: b.id,
            pos: c
        }).then(function(b) {
            return f(a.InkAnnot, b)
        })
    };
    a.InkAnnot.prototype.getPathCount =
        function() {
            return a.sendWithPromise("InkAnnot.getPathCount", {
                ink: this.id
            })
        };
    a.InkAnnot.prototype.getPointCount = function(b) {
        d(arguments.length, 1, "getPointCount", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("InkAnnot.getPointCount", {
            ink: this.id,
            pathindex: b
        })
    };
    a.InkAnnot.prototype.getPoint = function(b, c) {
        d(arguments.length, 2, "getPoint", "(number, number)", [
            [b, "number"],
            [c, "number"]
        ]);
        return a.sendWithPromise("InkAnnot.getPoint", {
            ink: this.id,
            pathindex: b,
            pointindex: c
        })
    };
    a.InkAnnot.prototype.setPoint =
        function(b, c, e) {
            d(arguments.length, 3, "setPoint", "(number, number, PDFNet.Point)", [
                [b, "number"],
                [c, "number"],
                [e, "Structure", a.Point, "Point"]
            ]);
            n("setPoint", [
                [e, 2]
            ]);
            return a.sendWithPromise("InkAnnot.setPoint", {
                ink: this.id,
                pathindex: b,
                pointindex: c,
                pt: e
            })
        };
    a.InkAnnot.prototype.erase = function(b, c, e) {
        d(arguments.length, 3, "erase", "(PDFNet.Point, PDFNet.Point, number)", [
            [b, "Structure", a.Point, "Point"],
            [c, "Structure", a.Point, "Point"],
            [e, "number"]
        ]);
        n("erase", [
            [b, 0],
            [c, 1]
        ]);
        return a.sendWithPromise("InkAnnot.erase", {
            ink: this.id,
            pt1: b,
            pt2: c,
            width: e
        })
    };
    a.InkAnnot.prototype.getHighlightIntent = function() {
        return a.sendWithPromise("InkAnnot.getHighlightIntent", {
            ink: this.id
        })
    };
    a.InkAnnot.prototype.setHighlightIntent = function(b) {
        d(arguments.length, 1, "setHighlightIntent", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("InkAnnot.setHighlightIntent", {
            ink: this.id,
            highlight: b
        })
    };
    a.LinkAnnot.createFromObj = function(b) {
        "undefined" === typeof b && (b = new a.Obj("0"));
        d(arguments.length, 0, "createFromObj", "(PDFNet.Obj)", [
            [b,
                "Object", a.Obj, "Obj"
            ]
        ]);
        return a.sendWithPromise("linkAnnotCreateFromObj", {
            d: b.id
        }).then(function(b) {
            return f(a.LinkAnnot, b)
        })
    };
    a.LinkAnnot.createFromAnnot = function(b) {
        d(arguments.length, 1, "createFromAnnot", "(PDFNet.Annot)", [
            [b, "Object", a.Annot, "Annot"]
        ]);
        return a.sendWithPromise("linkAnnotCreateFromAnnot", {
            ann: b.id
        }).then(function(b) {
            return f(a.LinkAnnot, b)
        })
    };
    a.LinkAnnot.create = function(b, c) {
        d(arguments.length, 2, "create", "(PDFNet.SDFDoc, PDFNet.Rect)", [
            [b, "SDFDoc"],
            [c, "Structure", a.Rect, "Rect"]
        ]);
        n("create", [
            [c, 1]
        ]);
        return a.sendWithPromise("linkAnnotCreate", {
            doc: b.id,
            pos: c
        }).then(function(b) {
            return f(a.LinkAnnot, b)
        })
    };
    a.LinkAnnot.prototype.removeAction = function() {
        return a.sendWithPromise("LinkAnnot.removeAction", {
            link: this.id
        })
    };
    a.LinkAnnot.prototype.getAction = function() {
        return a.sendWithPromise("LinkAnnot.getAction", {
            link: this.id
        }).then(function(b) {
            return f(a.Action, b)
        })
    };
    a.LinkAnnot.prototype.setAction = function(b) {
        d(arguments.length, 1, "setAction", "(PDFNet.Action)", [
            [b, "Object", a.Action,
                "Action"
            ]
        ]);
        return a.sendWithPromise("LinkAnnot.setAction", {
            link: this.id,
            action: b.id
        })
    };
    a.LinkAnnot.prototype.getHighlightingMode = function() {
        return a.sendWithPromise("LinkAnnot.getHighlightingMode", {
            link: this.id
        })
    };
    a.LinkAnnot.prototype.setHighlightingMode = function(b) {
        d(arguments.length, 1, "setHighlightingMode", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("LinkAnnot.setHighlightingMode", {
            link: this.id,
            value: b
        })
    };
    a.LinkAnnot.prototype.getQuadPointCount = function() {
        return a.sendWithPromise("LinkAnnot.getQuadPointCount", {
            link: this.id
        })
    };
    a.LinkAnnot.prototype.getQuadPoint = function(b) {
        d(arguments.length, 1, "getQuadPoint", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("LinkAnnot.getQuadPoint", {
            link: this.id,
            idx: b
        })
    };
    a.LinkAnnot.prototype.setQuadPoint = function(b, c) {
        d(arguments.length, 2, "setQuadPoint", "(number, PDFNet.QuadPoint)", [
            [b, "number"],
            [c, "Structure", a.QuadPoint, "QuadPoint"]
        ]);
        n("setQuadPoint", [
            [c, 1]
        ]);
        return a.sendWithPromise("LinkAnnot.setQuadPoint", {
            link: this.id,
            idx: b,
            qp: c
        })
    };
    a.getNormalizedUrl = function(b) {
        d(arguments.length,
            1, "getNormalizedUrl", "(string)", [
                [b, "string"]
            ]);
        return a.sendWithPromise("getNormalizedUrl", {
            url: b
        })
    };
    a.MarkupAnnot.createFromObj = function(b) {
        "undefined" === typeof b && (b = new a.Obj("0"));
        d(arguments.length, 0, "createFromObj", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("markupAnnotCreateFromObj", {
            d: b.id
        }).then(function(b) {
            return f(a.MarkupAnnot, b)
        })
    };
    a.MarkupAnnot.createFromAnnot = function(b) {
        d(arguments.length, 1, "createFromAnnot", "(PDFNet.Annot)", [
            [b, "Object", a.Annot, "Annot"]
        ]);
        return a.sendWithPromise("markupAnnotCreateFromAnnot", {
            ann: b.id
        }).then(function(b) {
            return f(a.MarkupAnnot, b)
        })
    };
    a.MarkupAnnot.prototype.getTitle = function() {
        return a.sendWithPromise("MarkupAnnot.getTitle", {
            markup: this.id
        })
    };
    a.MarkupAnnot.prototype.setTitle = function(b) {
        d(arguments.length, 1, "setTitle", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("MarkupAnnot.setTitle", {
            markup: this.id,
            title: b
        })
    };
    a.MarkupAnnot.prototype.setTitleUString = function(b) {
        d(arguments.length, 1, "setTitleUString", "(string)",
            [
                [b, "string"]
            ]);
        return a.sendWithPromise("MarkupAnnot.setTitleUString", {
            markup: this.id,
            title: b
        })
    };
    a.MarkupAnnot.prototype.getPopup = function() {
        return a.sendWithPromise("MarkupAnnot.getPopup", {
            markup: this.id
        }).then(function(b) {
            return f(a.Annot, b)
        })
    };
    a.MarkupAnnot.prototype.setPopup = function(b) {
        d(arguments.length, 1, "setPopup", "(PDFNet.Annot)", [
            [b, "Object", a.Annot, "Annot"]
        ]);
        return a.sendWithPromise("MarkupAnnot.setPopup", {
            markup: this.id,
            ppup: b.id
        })
    };
    a.MarkupAnnot.prototype.getOpacity = function() {
        return a.sendWithPromise("MarkupAnnot.getOpacity", {
            markup: this.id
        })
    };
    a.MarkupAnnot.prototype.setOpacity = function(b) {
        d(arguments.length, 1, "setOpacity", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("MarkupAnnot.setOpacity", {
            markup: this.id,
            op: b
        })
    };
    a.MarkupAnnot.prototype.getSubject = function() {
        return a.sendWithPromise("MarkupAnnot.getSubject", {
            markup: this.id
        })
    };
    a.MarkupAnnot.prototype.setSubject = function(b) {
        d(arguments.length, 1, "setSubject", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("MarkupAnnot.setSubject", {
            markup: this.id,
            contents: b
        })
    };
    a.MarkupAnnot.prototype.getCreationDates = function() {
        return a.sendWithPromise("MarkupAnnot.getCreationDates", {
            markup: this.id
        }).then(function(b) {
            return new a.Date(b)
        })
    };
    a.MarkupAnnot.prototype.getBorderEffect = function() {
        return a.sendWithPromise("MarkupAnnot.getBorderEffect", {
            markup: this.id
        })
    };
    a.MarkupAnnot.prototype.setBorderEffect = function(b) {
        "undefined" === typeof b && (b = a.MarkupAnnot.BorderEffect.e_None);
        d(arguments.length, 0, "setBorderEffect", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("MarkupAnnot.setBorderEffect", {
            markup: this.id,
            effect: b
        })
    };
    a.MarkupAnnot.prototype.getBorderEffectIntensity = function() {
        return a.sendWithPromise("MarkupAnnot.getBorderEffectIntensity", {
            markup: this.id
        })
    };
    a.MarkupAnnot.prototype.setBorderEffectIntensity = function(b) {
        "undefined" === typeof b && (b = 0);
        d(arguments.length, 0, "setBorderEffectIntensity", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("MarkupAnnot.setBorderEffectIntensity", {
            markup: this.id,
            intensity: b
        })
    };
    a.MarkupAnnot.prototype.setCreationDates = function(b) {
        d(arguments.length,
            1, "setCreationDates", "(PDFNet.Date)", [
                [b, "Structure", a.Date, "Date"]
            ]);
        n("setCreationDates", [
            [b, 0]
        ]);
        return a.sendWithPromise("MarkupAnnot.setCreationDates", {
            markup: this.id,
            dt: b
        })
    };
    a.MarkupAnnot.prototype.getInteriorColor = function() {
        return a.sendWithPromise("MarkupAnnot.getInteriorColor", {
            markup: this.id
        }).then(function(b) {
            return l(a.ColorPt, b)
        })
    };
    a.MarkupAnnot.prototype.getInteriorColorCompNum = function() {
        return a.sendWithPromise("MarkupAnnot.getInteriorColorCompNum", {
            markup: this.id
        })
    };
    a.MarkupAnnot.prototype.setInteriorColorRGB =
        function(b) {
            d(arguments.length, 1, "setInteriorColorRGB", "(PDFNet.ColorPt)", [
                [b, "Object", a.ColorPt, "ColorPt"]
            ]);
            return a.sendWithPromise("MarkupAnnot.setInteriorColorRGB", {
                markup: this.id,
                col: b.id
            })
        };
    a.MarkupAnnot.prototype.setInteriorColor = function(b, c) {
        d(arguments.length, 2, "setInteriorColor", "(PDFNet.ColorPt, number)", [
            [b, "Object", a.ColorPt, "ColorPt"],
            [c, "number"]
        ]);
        return a.sendWithPromise("MarkupAnnot.setInteriorColor", {
            markup: this.id,
            c: b.id,
            CompNum: c
        })
    };
    a.MarkupAnnot.prototype.getContentRect = function() {
        return a.sendWithPromise("MarkupAnnot.getContentRect", {
            markup: this.id
        }).then(function(b) {
            return new a.Rect(b)
        })
    };
    a.MarkupAnnot.prototype.setContentRect = function(b) {
        d(arguments.length, 1, "setContentRect", "(PDFNet.Rect)", [
            [b, "Structure", a.Rect, "Rect"]
        ]);
        n("setContentRect", [
            [b, 0]
        ]);
        return a.sendWithPromise("MarkupAnnot.setContentRect", {
            markup: this.id,
            cr: b
        })
    };
    a.MarkupAnnot.prototype.getPadding = function() {
        return a.sendWithPromise("MarkupAnnot.getPadding", {
            markup: this.id
        }).then(function(b) {
            return new a.Rect(b)
        })
    };
    a.MarkupAnnot.prototype.setPadding = function(b) {
        d(arguments.length,
            1, "setPadding", "(PDFNet.Rect)", [
                [b, "Structure", a.Rect, "Rect"]
            ]);
        n("setPadding", [
            [b, 0]
        ]);
        return a.sendWithPromise("MarkupAnnot.setPadding", {
            markup: this.id,
            rd: b
        })
    };
    a.MarkupAnnot.prototype.rotateAppearance = function(b) {
        d(arguments.length, 1, "rotateAppearance", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("MarkupAnnot.rotateAppearance", {
            markup: this.id,
            angle: b
        })
    };
    a.MovieAnnot.createFromObj = function(b) {
        "undefined" === typeof b && (b = new a.Obj("0"));
        d(arguments.length, 0, "createFromObj", "(PDFNet.Obj)", [
            [b,
                "Object", a.Obj, "Obj"
            ]
        ]);
        return a.sendWithPromise("movieAnnotCreateFromObj", {
            d: b.id
        }).then(function(b) {
            return f(a.MovieAnnot, b)
        })
    };
    a.MovieAnnot.createFromAnnot = function(b) {
        d(arguments.length, 1, "createFromAnnot", "(PDFNet.Annot)", [
            [b, "Object", a.Annot, "Annot"]
        ]);
        return a.sendWithPromise("movieAnnotCreateFromAnnot", {
            ann: b.id
        }).then(function(b) {
            return f(a.MovieAnnot, b)
        })
    };
    a.MovieAnnot.create = function(b, c) {
        d(arguments.length, 2, "create", "(PDFNet.SDFDoc, PDFNet.Rect)", [
            [b, "SDFDoc"],
            [c, "Structure", a.Rect, "Rect"]
        ]);
        n("create", [
            [c, 1]
        ]);
        return a.sendWithPromise("movieAnnotCreate", {
            doc: b.id,
            pos: c
        }).then(function(b) {
            return f(a.MovieAnnot, b)
        })
    };
    a.MovieAnnot.prototype.getTitle = function() {
        return a.sendWithPromise("MovieAnnot.getTitle", {
            movie: this.id
        })
    };
    a.MovieAnnot.prototype.setTitle = function(b) {
        d(arguments.length, 1, "setTitle", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("MovieAnnot.setTitle", {
            movie: this.id,
            title: b
        })
    };
    a.MovieAnnot.prototype.isToBePlayed = function() {
        return a.sendWithPromise("MovieAnnot.isToBePlayed", {
            movie: this.id
        })
    };
    a.MovieAnnot.prototype.setToBePlayed = function(b) {
        "undefined" === typeof b && (b = !0);
        d(arguments.length, 0, "setToBePlayed", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("MovieAnnot.setToBePlayed", {
            movie: this.id,
            isplay: b
        })
    };
    a.PolyLineAnnot.createFromObj = function(b) {
        "undefined" === typeof b && (b = new a.Obj("0"));
        d(arguments.length, 0, "createFromObj", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("polyLineAnnotCreateFromObj", {
            d: b.id
        }).then(function(b) {
            return f(a.PolyLineAnnot,
                b)
        })
    };
    a.PolyLineAnnot.createFromAnnot = function(b) {
        d(arguments.length, 1, "createFromAnnot", "(PDFNet.Annot)", [
            [b, "Object", a.Annot, "Annot"]
        ]);
        return a.sendWithPromise("polyLineAnnotCreateFromAnnot", {
            ann: b.id
        }).then(function(b) {
            return f(a.PolyLineAnnot, b)
        })
    };
    a.PolyLineAnnot.create = function(b, c) {
        d(arguments.length, 2, "create", "(PDFNet.SDFDoc, PDFNet.Rect)", [
            [b, "SDFDoc"],
            [c, "Structure", a.Rect, "Rect"]
        ]);
        n("create", [
            [c, 1]
        ]);
        return a.sendWithPromise("polyLineAnnotCreate", {
            doc: b.id,
            pos: c
        }).then(function(b) {
            return f(a.PolyLineAnnot,
                b)
        })
    };
    a.PolyLineAnnot.prototype.getVertexCount = function() {
        return a.sendWithPromise("PolyLineAnnot.getVertexCount", {
            polyline: this.id
        })
    };
    a.PolyLineAnnot.prototype.getVertex = function(b) {
        d(arguments.length, 1, "getVertex", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("PolyLineAnnot.getVertex", {
            polyline: this.id,
            idx: b
        })
    };
    a.PolyLineAnnot.prototype.setVertex = function(b, c) {
        d(arguments.length, 2, "setVertex", "(number, PDFNet.Point)", [
            [b, "number"],
            [c, "Structure", a.Point, "Point"]
        ]);
        n("setVertex", [
            [c, 1]
        ]);
        return a.sendWithPromise("PolyLineAnnot.setVertex", {
            polyline: this.id,
            idx: b,
            pt: c
        })
    };
    a.PolyLineAnnot.prototype.getStartStyle = function() {
        return a.sendWithPromise("PolyLineAnnot.getStartStyle", {
            polyline: this.id
        })
    };
    a.PolyLineAnnot.prototype.setStartStyle = function(b) {
        d(arguments.length, 1, "setStartStyle", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("PolyLineAnnot.setStartStyle", {
            polyline: this.id,
            style: b
        })
    };
    a.PolyLineAnnot.prototype.getEndStyle = function() {
        return a.sendWithPromise("PolyLineAnnot.getEndStyle", {
            polyline: this.id
        })
    };
    a.PolyLineAnnot.prototype.setEndStyle =
        function(b) {
            d(arguments.length, 1, "setEndStyle", "(number)", [
                [b, "number"]
            ]);
            return a.sendWithPromise("PolyLineAnnot.setEndStyle", {
                polyline: this.id,
                style: b
            })
        };
    a.PolyLineAnnot.prototype.getIntentName = function() {
        return a.sendWithPromise("PolyLineAnnot.getIntentName", {
            polyline: this.id
        })
    };
    a.PolyLineAnnot.prototype.setIntentName = function(b) {
        d(arguments.length, 1, "setIntentName", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("PolyLineAnnot.setIntentName", {
            polyline: this.id,
            mode: b
        })
    };
    a.PolygonAnnot.createFromObj =
        function(b) {
            "undefined" === typeof b && (b = new a.Obj("0"));
            d(arguments.length, 0, "createFromObj", "(PDFNet.Obj)", [
                [b, "Object", a.Obj, "Obj"]
            ]);
            return a.sendWithPromise("polygonAnnotCreateFromObj", {
                d: b.id
            }).then(function(b) {
                return f(a.PolygonAnnot, b)
            })
        };
    a.PolygonAnnot.createFromAnnot = function(b) {
        d(arguments.length, 1, "createFromAnnot", "(PDFNet.Annot)", [
            [b, "Object", a.Annot, "Annot"]
        ]);
        return a.sendWithPromise("polygonAnnotCreateFromAnnot", {
            ann: b.id
        }).then(function(b) {
            return f(a.PolygonAnnot, b)
        })
    };
    a.PolygonAnnot.create =
        function(b, c) {
            d(arguments.length, 2, "create", "(PDFNet.SDFDoc, PDFNet.Rect)", [
                [b, "SDFDoc"],
                [c, "Structure", a.Rect, "Rect"]
            ]);
            n("create", [
                [c, 1]
            ]);
            return a.sendWithPromise("polygonAnnotCreate", {
                doc: b.id,
                pos: c
            }).then(function(b) {
                return f(a.PolygonAnnot, b)
            })
        };
    a.PopupAnnot.createFromObj = function(b) {
        "undefined" === typeof b && (b = new a.Obj("0"));
        d(arguments.length, 0, "createFromObj", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("popupAnnotCreateFromObj", {
            d: b.id
        }).then(function(b) {
            return f(a.PopupAnnot,
                b)
        })
    };
    a.PopupAnnot.createFromAnnot = function(b) {
        d(arguments.length, 1, "createFromAnnot", "(PDFNet.Annot)", [
            [b, "Object", a.Annot, "Annot"]
        ]);
        return a.sendWithPromise("popupAnnotCreateFromAnnot", {
            ann: b.id
        }).then(function(b) {
            return f(a.PopupAnnot, b)
        })
    };
    a.PopupAnnot.create = function(b, c) {
        d(arguments.length, 2, "create", "(PDFNet.SDFDoc, PDFNet.Rect)", [
            [b, "SDFDoc"],
            [c, "Structure", a.Rect, "Rect"]
        ]);
        n("create", [
            [c, 1]
        ]);
        return a.sendWithPromise("popupAnnotCreate", {
            doc: b.id,
            pos: c
        }).then(function(b) {
            return f(a.PopupAnnot,
                b)
        })
    };
    a.PopupAnnot.prototype.getParent = function() {
        return a.sendWithPromise("PopupAnnot.getParent", {
            popup: this.id
        }).then(function(b) {
            return f(a.Annot, b)
        })
    };
    a.PopupAnnot.prototype.setParent = function(b) {
        d(arguments.length, 1, "setParent", "(PDFNet.Annot)", [
            [b, "Object", a.Annot, "Annot"]
        ]);
        return a.sendWithPromise("PopupAnnot.setParent", {
            popup: this.id,
            parent: b.id
        })
    };
    a.PopupAnnot.prototype.isOpen = function() {
        return a.sendWithPromise("PopupAnnot.isOpen", {
            popup: this.id
        })
    };
    a.PopupAnnot.prototype.setOpen = function(b) {
        d(arguments.length,
            1, "setOpen", "(boolean)", [
                [b, "boolean"]
            ]);
        return a.sendWithPromise("PopupAnnot.setOpen", {
            popup: this.id,
            isopen: b
        })
    };
    a.RedactionAnnot.createFromObj = function(b) {
        "undefined" === typeof b && (b = new a.Obj("0"));
        d(arguments.length, 0, "createFromObj", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("redactionAnnotCreateFromObj", {
            d: b.id
        }).then(function(b) {
            return f(a.RedactionAnnot, b)
        })
    };
    a.RedactionAnnot.createFromAnnot = function(b) {
        d(arguments.length, 1, "createFromAnnot", "(PDFNet.Annot)", [
            [b, "Object",
                a.Annot, "Annot"
            ]
        ]);
        return a.sendWithPromise("redactionAnnotCreateFromAnnot", {
            ann: b.id
        }).then(function(b) {
            return f(a.RedactionAnnot, b)
        })
    };
    a.RedactionAnnot.create = function(b, c) {
        d(arguments.length, 2, "create", "(PDFNet.SDFDoc, PDFNet.Rect)", [
            [b, "SDFDoc"],
            [c, "Structure", a.Rect, "Rect"]
        ]);
        n("create", [
            [c, 1]
        ]);
        return a.sendWithPromise("redactionAnnotCreate", {
            doc: b.id,
            pos: c
        }).then(function(b) {
            return f(a.RedactionAnnot, b)
        })
    };
    a.RedactionAnnot.prototype.getQuadPointCount = function() {
        return a.sendWithPromise("RedactionAnnot.getQuadPointCount", {
            redaction: this.id
        })
    };
    a.RedactionAnnot.prototype.getQuadPoint = function(b) {
        d(arguments.length, 1, "getQuadPoint", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("RedactionAnnot.getQuadPoint", {
            redaction: this.id,
            idx: b
        })
    };
    a.RedactionAnnot.prototype.setQuadPoint = function(b, c) {
        d(arguments.length, 2, "setQuadPoint", "(number, PDFNet.QuadPoint)", [
            [b, "number"],
            [c, "Structure", a.QuadPoint, "QuadPoint"]
        ]);
        n("setQuadPoint", [
            [c, 1]
        ]);
        return a.sendWithPromise("RedactionAnnot.setQuadPoint", {
            redaction: this.id,
            idx: b,
            qp: c
        })
    };
    a.RedactionAnnot.prototype.setAppFormXO = function(b) {
        d(arguments.length, 1, "setAppFormXO", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("RedactionAnnot.setAppFormXO", {
            redaction: this.id,
            formxo: b.id
        })
    };
    a.RedactionAnnot.prototype.getOverlayText = function() {
        return a.sendWithPromise("RedactionAnnot.getOverlayText", {
            redaction: this.id
        })
    };
    a.RedactionAnnot.prototype.setOverlayText = function(b) {
        d(arguments.length, 1, "setOverlayText", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("RedactionAnnot.setOverlayText", {
            redaction: this.id,
            title: b
        })
    };
    a.RedactionAnnot.prototype.getUseRepeat = function() {
        return a.sendWithPromise("RedactionAnnot.getUseRepeat", {
            redaction: this.id
        })
    };
    a.RedactionAnnot.prototype.setUseRepeat = function(b) {
        "undefined" === typeof b && (b = !1);
        d(arguments.length, 0, "setUseRepeat", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("RedactionAnnot.setUseRepeat", {
            redaction: this.id,
            userepeat: b
        })
    };
    a.RedactionAnnot.prototype.getOverlayTextAppearance = function() {
        return a.sendWithPromise("RedactionAnnot.getOverlayTextAppearance", {
            redaction: this.id
        })
    };
    a.RedactionAnnot.prototype.setOverlayTextAppearance = function(b) {
        d(arguments.length, 1, "setOverlayTextAppearance", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("RedactionAnnot.setOverlayTextAppearance", {
            redaction: this.id,
            app: b
        })
    };
    a.RedactionAnnot.prototype.getQuadForm = function() {
        return a.sendWithPromise("RedactionAnnot.getQuadForm", {
            redaction: this.id
        })
    };
    a.RedactionAnnot.prototype.setQuadForm = function(b) {
        "undefined" === typeof b && (b = a.RedactionAnnot.QuadForm.e_LeftJustified);
        d(arguments.length, 0, "setQuadForm", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("RedactionAnnot.setQuadForm", {
            redaction: this.id,
            form: b
        })
    };
    a.RedactionAnnot.prototype.getAppFormXO = function() {
        return a.sendWithPromise("RedactionAnnot.getAppFormXO", {
            redaction: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.RubberStampAnnot.createFromObj = function(b) {
        "undefined" === typeof b && (b = new a.Obj("0"));
        d(arguments.length, 0, "createFromObj", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("rubberStampAnnotCreateFromObj", {
            d: b.id
        }).then(function(b) {
            return f(a.RubberStampAnnot, b)
        })
    };
    a.RubberStampAnnot.createFromAnnot = function(b) {
        d(arguments.length, 1, "createFromAnnot", "(PDFNet.Annot)", [
            [b, "Object", a.Annot, "Annot"]
        ]);
        return a.sendWithPromise("rubberStampAnnotCreateFromAnnot", {
            ann: b.id
        }).then(function(b) {
            return f(a.RubberStampAnnot, b)
        })
    };
    a.RubberStampAnnot.create = function(b, c) {
        d(arguments.length, 2, "create", "(PDFNet.SDFDoc, PDFNet.Rect)", [
            [b, "SDFDoc"],
            [c, "Structure", a.Rect, "Rect"]
        ]);
        n("create", [
            [c, 1]
        ]);
        return a.sendWithPromise("rubberStampAnnotCreate", {
            doc: b.id,
            pos: c
        }).then(function(b) {
            return f(a.RubberStampAnnot, b)
        })
    };
    a.RubberStampAnnot.createCustom = function(b, c, e) {
        d(arguments.length, 3, "createCustom", "(PDFNet.SDFDoc, PDFNet.Rect, PDFNet.Obj)", [
            [b, "SDFDoc"],
            [c, "Structure", a.Rect, "Rect"],
            [e, "Object", a.Obj, "Obj"]
        ]);
        n("createCustom", [
            [c, 1]
        ]);
        return a.sendWithPromise("rubberStampAnnotCreateCustom", {
            doc: b.id,
            pos: c,
            form_xobject: e.id
        }).then(function(b) {
            return f(a.RubberStampAnnot, b)
        })
    };
    a.RubberStampAnnot.prototype.getIcon = function() {
        return a.sendWithPromise("RubberStampAnnot.getIcon", {
            stamp: this.id
        })
    };
    a.RubberStampAnnot.prototype.setIcon = function(b) {
        "undefined" === typeof b && (b = a.RubberStampAnnot.Icon.e_Draft);
        d(arguments.length, 0, "setIcon", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("RubberStampAnnot.setIcon", {
            stamp: this.id,
            type: b
        })
    };
    a.RubberStampAnnot.prototype.setIconDefault = function() {
        return a.sendWithPromise("RubberStampAnnot.setIconDefault", {
            stamp: this.id
        })
    };
    a.RubberStampAnnot.prototype.getIconName = function() {
        return a.sendWithPromise("RubberStampAnnot.getIconName", {
            stamp: this.id
        })
    };
    a.RubberStampAnnot.prototype.setIconName = function(b) {
        d(arguments.length, 1, "setIconName", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("RubberStampAnnot.setIconName", {
            stamp: this.id,
            iconstring: b
        })
    };
    a.ScreenAnnot.createFromObj = function(b) {
        "undefined" === typeof b && (b = new a.Obj("0"));
        d(arguments.length, 0, "createFromObj", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("screenAnnotCreateFromObj", {
            d: b.id
        }).then(function(b) {
            return f(a.ScreenAnnot, b)
        })
    };
    a.ScreenAnnot.createFromAnnot =
        function(b) {
            d(arguments.length, 1, "createFromAnnot", "(PDFNet.Annot)", [
                [b, "Object", a.Annot, "Annot"]
            ]);
            return a.sendWithPromise("screenAnnotCreateFromAnnot", {
                ann: b.id
            }).then(function(b) {
                return f(a.ScreenAnnot, b)
            })
        };
    a.ScreenAnnot.prototype.getTitle = function() {
        return a.sendWithPromise("ScreenAnnot.getTitle", {
            s: this.id
        })
    };
    a.ScreenAnnot.prototype.setTitle = function(b) {
        d(arguments.length, 1, "setTitle", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("ScreenAnnot.setTitle", {
            s: this.id,
            title: b
        })
    };
    a.ScreenAnnot.create =
        function(b, c) {
            d(arguments.length, 2, "create", "(PDFNet.SDFDoc, PDFNet.Rect)", [
                [b, "SDFDoc"],
                [c, "Structure", a.Rect, "Rect"]
            ]);
            n("create", [
                [c, 1]
            ]);
            return a.sendWithPromise("screenAnnotCreate", {
                doc: b.id,
                pos: c
            }).then(function(b) {
                return f(a.ScreenAnnot, b)
            })
        };
    a.ScreenAnnot.prototype.getAction = function() {
        return a.sendWithPromise("ScreenAnnot.getAction", {
            s: this.id
        }).then(function(b) {
            return f(a.Action, b)
        })
    };
    a.ScreenAnnot.prototype.setAction = function(b) {
        d(arguments.length, 1, "setAction", "(PDFNet.Action)", [
            [b, "Object",
                a.Action, "Action"
            ]
        ]);
        return a.sendWithPromise("ScreenAnnot.setAction", {
            s: this.id,
            action: b.id
        })
    };
    a.ScreenAnnot.prototype.getBorderColor = function() {
        return a.sendWithPromise("ScreenAnnot.getBorderColor", {
            s: this.id
        }).then(function(b) {
            return l(a.ColorPt, b)
        })
    };
    a.ScreenAnnot.prototype.setBorderColor = function(b, c) {
        d(arguments.length, 2, "setBorderColor", "(PDFNet.ColorPt, number)", [
            [b, "Object", a.ColorPt, "ColorPt"],
            [c, "number"]
        ]);
        return a.sendWithPromise("ScreenAnnot.setBorderColor", {
            s: this.id,
            col: b.id,
            numcomp: c
        })
    };
    a.ScreenAnnot.prototype.getBorderColorCompNum = function() {
        return a.sendWithPromise("ScreenAnnot.getBorderColorCompNum", {
            s: this.id
        })
    };
    a.ScreenAnnot.prototype.getBackgroundColorCompNum = function() {
        return a.sendWithPromise("ScreenAnnot.getBackgroundColorCompNum", {
            s: this.id
        })
    };
    a.ScreenAnnot.prototype.getBackgroundColor = function() {
        return a.sendWithPromise("ScreenAnnot.getBackgroundColor", {
            s: this.id
        }).then(function(b) {
            return l(a.ColorPt, b)
        })
    };
    a.ScreenAnnot.prototype.setBackgroundColor = function(b, c) {
        d(arguments.length,
            2, "setBackgroundColor", "(PDFNet.ColorPt, number)", [
                [b, "Object", a.ColorPt, "ColorPt"],
                [c, "number"]
            ]);
        return a.sendWithPromise("ScreenAnnot.setBackgroundColor", {
            s: this.id,
            col: b.id,
            numcomp: c
        })
    };
    a.ScreenAnnot.prototype.getStaticCaptionText = function() {
        return a.sendWithPromise("ScreenAnnot.getStaticCaptionText", {
            s: this.id
        })
    };
    a.ScreenAnnot.prototype.setStaticCaptionText = function(b) {
        d(arguments.length, 1, "setStaticCaptionText", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("ScreenAnnot.setStaticCaptionText", {
            s: this.id,
            contents: b
        })
    };
    a.ScreenAnnot.prototype.getRolloverCaptionText = function() {
        return a.sendWithPromise("ScreenAnnot.getRolloverCaptionText", {
            s: this.id
        })
    };
    a.ScreenAnnot.prototype.setRolloverCaptionText = function(b) {
        d(arguments.length, 1, "setRolloverCaptionText", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("ScreenAnnot.setRolloverCaptionText", {
            s: this.id,
            contents: b
        })
    };
    a.ScreenAnnot.prototype.getMouseDownCaptionText = function() {
        return a.sendWithPromise("ScreenAnnot.getMouseDownCaptionText", {
            s: this.id
        })
    };
    a.ScreenAnnot.prototype.setMouseDownCaptionText = function(b) {
        d(arguments.length, 1, "setMouseDownCaptionText", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("ScreenAnnot.setMouseDownCaptionText", {
            s: this.id,
            contents: b
        })
    };
    a.ScreenAnnot.prototype.getStaticIcon = function() {
        return a.sendWithPromise("ScreenAnnot.getStaticIcon", {
            s: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.ScreenAnnot.prototype.setStaticIcon = function(b) {
        d(arguments.length, 1, "setStaticIcon", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("ScreenAnnot.setStaticIcon", {
            s: this.id,
            icon: b.id
        })
    };
    a.ScreenAnnot.prototype.getRolloverIcon = function() {
        return a.sendWithPromise("ScreenAnnot.getRolloverIcon", {
            s: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.ScreenAnnot.prototype.setRolloverIcon = function(b) {
        d(arguments.length, 1, "setRolloverIcon", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("ScreenAnnot.setRolloverIcon", {
            s: this.id,
            icon: b.id
        })
    };
    a.ScreenAnnot.prototype.getMouseDownIcon = function() {
        return a.sendWithPromise("ScreenAnnot.getMouseDownIcon", {
            s: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.ScreenAnnot.prototype.setMouseDownIcon = function(b) {
        d(arguments.length, 1, "setMouseDownIcon", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("ScreenAnnot.setMouseDownIcon", {
            s: this.id,
            icon: b.id
        })
    };
    a.ScreenAnnot.prototype.getScaleType = function() {
        return a.sendWithPromise("ScreenAnnot.getScaleType", {
            s: this.id
        })
    };
    a.ScreenAnnot.prototype.setScaleType = function(b) {
        d(arguments.length, 1, "setScaleType", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("ScreenAnnot.setScaleType", {
            s: this.id,
            st: b
        })
    };
    a.ScreenAnnot.prototype.getIconCaptionRelation = function() {
        return a.sendWithPromise("ScreenAnnot.getIconCaptionRelation", {
            s: this.id
        })
    };
    a.ScreenAnnot.prototype.setIconCaptionRelation = function(b) {
        d(arguments.length, 1, "setIconCaptionRelation", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("ScreenAnnot.setIconCaptionRelation", {
            s: this.id,
            icr: b
        })
    };
    a.ScreenAnnot.prototype.getScaleCondition = function() {
        return a.sendWithPromise("ScreenAnnot.getScaleCondition", {
            s: this.id
        })
    };
    a.ScreenAnnot.prototype.setScaleCondition =
        function(b) {
            d(arguments.length, 1, "setScaleCondition", "(number)", [
                [b, "number"]
            ]);
            return a.sendWithPromise("ScreenAnnot.setScaleCondition", {
                s: this.id,
                sc: b
            })
        };
    a.ScreenAnnot.prototype.getFitFull = function() {
        return a.sendWithPromise("ScreenAnnot.getFitFull", {
            s: this.id
        })
    };
    a.ScreenAnnot.prototype.setFitFull = function(b) {
        d(arguments.length, 1, "setFitFull", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("ScreenAnnot.setFitFull", {
            s: this.id,
            ff: b
        })
    };
    a.ScreenAnnot.prototype.getHIconLeftOver = function() {
        return a.sendWithPromise("ScreenAnnot.getHIconLeftOver", {
            s: this.id
        })
    };
    a.ScreenAnnot.prototype.setHIconLeftOver = function(b) {
        d(arguments.length, 1, "setHIconLeftOver", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("ScreenAnnot.setHIconLeftOver", {
            s: this.id,
            hl: b
        })
    };
    a.ScreenAnnot.prototype.getVIconLeftOver = function() {
        return a.sendWithPromise("ScreenAnnot.getVIconLeftOver", {
            s: this.id
        })
    };
    a.ScreenAnnot.prototype.setVIconLeftOver = function(b) {
        d(arguments.length, 1, "setVIconLeftOver", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("ScreenAnnot.setVIconLeftOver", {
            s: this.id,
            vl: b
        })
    };
    a.SoundAnnot.createFromObj = function(b) {
        "undefined" === typeof b && (b = new a.Obj("0"));
        d(arguments.length, 0, "createFromObj", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("soundAnnotCreateFromObj", {
            d: b.id
        }).then(function(b) {
            return f(a.SoundAnnot, b)
        })
    };
    a.SoundAnnot.createFromAnnot = function(b) {
        d(arguments.length, 1, "createFromAnnot", "(PDFNet.Annot)", [
            [b, "Object", a.Annot, "Annot"]
        ]);
        return a.sendWithPromise("soundAnnotCreateFromAnnot", {
            ann: b.id
        }).then(function(b) {
            return f(a.SoundAnnot,
                b)
        })
    };
    a.SoundAnnot.create = function(b, c) {
        d(arguments.length, 2, "create", "(PDFNet.SDFDoc, PDFNet.Rect)", [
            [b, "SDFDoc"],
            [c, "Structure", a.Rect, "Rect"]
        ]);
        n("create", [
            [c, 1]
        ]);
        return a.sendWithPromise("soundAnnotCreate", {
            doc: b.id,
            pos: c
        }).then(function(b) {
            return f(a.SoundAnnot, b)
        })
    };
    a.SoundAnnot.createWithData = function(b, c, e, m, w, g) {
        d(arguments.length, 6, "createWithData", "(PDFNet.SDFDoc, PDFNet.Rect, PDFNet.Filter, number, number, number)", [
            [b, "SDFDoc"],
            [c, "Structure", a.Rect, "Rect"],
            [e, "Object", a.Filter, "Filter"],
            [m, "number"],
            [w, "number"],
            [g, "number"]
        ]);
        n("createWithData", [
            [c, 1]
        ]);
        0 != e.id && t(e.id);
        return a.sendWithPromise("soundAnnotCreateWithData", {
            doc: b.id,
            pos: c,
            no_own_stream: e.id,
            sample_bits: m,
            sample_freq: w,
            num_channels: g
        }).then(function(b) {
            return f(a.SoundAnnot, b)
        })
    };
    a.SoundAnnot.createAtPoint = function(b, c) {
        d(arguments.length, 2, "createAtPoint", "(PDFNet.SDFDoc, PDFNet.Point)", [
            [b, "SDFDoc"],
            [c, "Structure", a.Point, "Point"]
        ]);
        n("createAtPoint", [
            [c, 1]
        ]);
        return a.sendWithPromise("soundAnnotCreateAtPoint", {
            doc: b.id,
            pos: c
        }).then(function(b) {
            return f(a.SoundAnnot, b)
        })
    };
    a.SoundAnnot.prototype.getSoundStream = function() {
        return a.sendWithPromise("SoundAnnot.getSoundStream", {
            sound: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.SoundAnnot.prototype.setSoundStream = function(b) {
        d(arguments.length, 1, "setSoundStream", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("SoundAnnot.setSoundStream", {
            sound: this.id,
            icon: b.id
        })
    };
    a.SoundAnnot.prototype.getIcon = function() {
        return a.sendWithPromise("SoundAnnot.getIcon", {
            sound: this.id
        })
    };
    a.SoundAnnot.prototype.setIcon = function(b) {
        "undefined" === typeof b && (b = a.SoundAnnot.Icon.e_Speaker);
        d(arguments.length, 0, "setIcon", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("SoundAnnot.setIcon", {
            sound: this.id,
            type: b
        })
    };
    a.SoundAnnot.prototype.getIconName = function() {
        return a.sendWithPromise("SoundAnnot.getIconName", {
            sound: this.id
        })
    };
    a.SoundAnnot.prototype.setIconName = function(b) {
        d(arguments.length, 1, "setIconName", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("SoundAnnot.setIconName", {
            sound: this.id,
            type: b
        })
    };
    a.SquareAnnot.createFromObj = function(b) {
        "undefined" === typeof b && (b = new a.Obj("0"));
        d(arguments.length, 0, "createFromObj", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("squareAnnotCreateFromObj", {
            d: b.id
        }).then(function(b) {
            return f(a.SquareAnnot, b)
        })
    };
    a.SquareAnnot.createFromAnnot = function(b) {
        d(arguments.length, 1, "createFromAnnot", "(PDFNet.Annot)", [
            [b, "Object", a.Annot, "Annot"]
        ]);
        return a.sendWithPromise("squareAnnotCreateFromAnnot", {
            ann: b.id
        }).then(function(b) {
            return f(a.SquareAnnot,
                b)
        })
    };
    a.SquareAnnot.create = function(b, c) {
        d(arguments.length, 2, "create", "(PDFNet.SDFDoc, PDFNet.Rect)", [
            [b, "SDFDoc"],
            [c, "Structure", a.Rect, "Rect"]
        ]);
        n("create", [
            [c, 1]
        ]);
        return a.sendWithPromise("squareAnnotCreate", {
            doc: b.id,
            pos: c
        }).then(function(b) {
            return f(a.SquareAnnot, b)
        })
    };
    a.SquareAnnot.prototype.getInteriorColor = function() {
        return a.sendWithPromise("SquareAnnot.getInteriorColor", {
            square: this.id
        }).then(function(b) {
            return l(a.ColorPt, b)
        })
    };
    a.SquareAnnot.prototype.getInteriorColorCompNum = function() {
        return a.sendWithPromise("SquareAnnot.getInteriorColorCompNum", {
            square: this.id
        })
    };
    a.SquareAnnot.prototype.setInteriorColorDefault = function(b) {
        d(arguments.length, 1, "setInteriorColorDefault", "(PDFNet.ColorPt)", [
            [b, "Object", a.ColorPt, "ColorPt"]
        ]);
        return a.sendWithPromise("SquareAnnot.setInteriorColorDefault", {
            square: this.id,
            col: b.id
        })
    };
    a.SquareAnnot.prototype.setInteriorColor = function(b, c) {
        d(arguments.length, 2, "setInteriorColor", "(PDFNet.ColorPt, number)", [
            [b, "Object", a.ColorPt, "ColorPt"],
            [c, "number"]
        ]);
        return a.sendWithPromise("SquareAnnot.setInteriorColor", {
            square: this.id,
            col: b.id,
            numcomp: c
        })
    };
    a.SquareAnnot.prototype.getContentRect = function() {
        return a.sendWithPromise("SquareAnnot.getContentRect", {
            square: this.id
        }).then(function(b) {
            return new a.Rect(b)
        })
    };
    a.SquareAnnot.prototype.setContentRect = function(b) {
        d(arguments.length, 1, "setContentRect", "(PDFNet.Rect)", [
            [b, "Structure", a.Rect, "Rect"]
        ]);
        n("setContentRect", [
            [b, 0]
        ]);
        return a.sendWithPromise("SquareAnnot.setContentRect", {
            square: this.id,
            cr: b
        })
    };
    a.SquareAnnot.prototype.getPadding = function() {
        return a.sendWithPromise("SquareAnnot.getPadding", {
            square: this.id
        }).then(function(b) {
            return new a.Rect(b)
        })
    };
    a.SquareAnnot.prototype.setPadding = function(b) {
        d(arguments.length, 1, "setPadding", "(PDFNet.Rect)", [
            [b, "Structure", a.Rect, "Rect"]
        ]);
        n("setPadding", [
            [b, 0]
        ]);
        return a.sendWithPromise("SquareAnnot.setPadding", {
            square: this.id,
            cr: b
        })
    };
    a.SquigglyAnnot.createFromObj = function(b) {
        d(arguments.length, 1, "createFromObj", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("squigglyAnnotCreateFromObj", {
            d: b.id
        }).then(function(b) {
            return f(a.SquigglyAnnot,
                b)
        })
    };
    a.SquigglyAnnot.createFromAnnot = function(b) {
        d(arguments.length, 1, "createFromAnnot", "(PDFNet.Annot)", [
            [b, "Object", a.Annot, "Annot"]
        ]);
        return a.sendWithPromise("squigglyAnnotCreateFromAnnot", {
            ann: b.id
        }).then(function(b) {
            return f(a.SquigglyAnnot, b)
        })
    };
    a.SquigglyAnnot.create = function(b, c) {
        d(arguments.length, 2, "create", "(PDFNet.SDFDoc, PDFNet.Rect)", [
            [b, "SDFDoc"],
            [c, "Structure", a.Rect, "Rect"]
        ]);
        n("create", [
            [c, 1]
        ]);
        return a.sendWithPromise("squigglyAnnotCreate", {
            doc: b.id,
            pos: c
        }).then(function(b) {
            return f(a.SquigglyAnnot,
                b)
        })
    };
    a.StrikeOutAnnot.createFromObj = function(b) {
        d(arguments.length, 1, "createFromObj", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("strikeOutAnnotCreateFromObj", {
            d: b.id
        }).then(function(b) {
            return f(a.StrikeOutAnnot, b)
        })
    };
    a.StrikeOutAnnot.createFromAnnot = function(b) {
        d(arguments.length, 1, "createFromAnnot", "(PDFNet.Annot)", [
            [b, "Object", a.Annot, "Annot"]
        ]);
        return a.sendWithPromise("strikeOutAnnotCreateFromAnnot", {
            ann: b.id
        }).then(function(b) {
            return f(a.StrikeOutAnnot, b)
        })
    };
    a.StrikeOutAnnot.create =
        function(b, c) {
            d(arguments.length, 2, "create", "(PDFNet.SDFDoc, PDFNet.Rect)", [
                [b, "SDFDoc"],
                [c, "Structure", a.Rect, "Rect"]
            ]);
            n("create", [
                [c, 1]
            ]);
            return a.sendWithPromise("strikeOutAnnotCreate", {
                doc: b.id,
                pos: c
            }).then(function(b) {
                return f(a.StrikeOutAnnot, b)
            })
        };
    a.TextAnnot.createFromObj = function(b) {
        "undefined" === typeof b && (b = new a.Obj("0"));
        d(arguments.length, 0, "createFromObj", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("textAnnotCreateFromObj", {
            d: b.id
        }).then(function(b) {
            return f(a.TextAnnot,
                b)
        })
    };
    a.TextAnnot.createFromAnnot = function(b) {
        d(arguments.length, 1, "createFromAnnot", "(PDFNet.Annot)", [
            [b, "Object", a.Annot, "Annot"]
        ]);
        return a.sendWithPromise("textAnnotCreateFromAnnot", {
            ann: b.id
        }).then(function(b) {
            return f(a.TextAnnot, b)
        })
    };
    a.TextAnnot.createAtPoint = function(b, c) {
        d(arguments.length, 2, "createAtPoint", "(PDFNet.SDFDoc, PDFNet.Point)", [
            [b, "SDFDoc"],
            [c, "Structure", a.Point, "Point"]
        ]);
        n("createAtPoint", [
            [c, 1]
        ]);
        return a.sendWithPromise("textAnnotCreateAtPoint", {
            doc: b.id,
            pos: c
        }).then(function(b) {
            return f(a.TextAnnot,
                b)
        })
    };
    a.TextAnnot.create = function(b, c) {
        d(arguments.length, 2, "create", "(PDFNet.SDFDoc, PDFNet.Rect)", [
            [b, "SDFDoc"],
            [c, "Structure", a.Rect, "Rect"]
        ]);
        n("create", [
            [c, 1]
        ]);
        return a.sendWithPromise("textAnnotCreate", {
            doc: b.id,
            pos: c
        }).then(function(b) {
            return f(a.TextAnnot, b)
        })
    };
    a.TextAnnot.prototype.isOpen = function() {
        return a.sendWithPromise("TextAnnot.isOpen", {
            text: this.id
        })
    };
    a.TextAnnot.prototype.setOpen = function(b) {
        d(arguments.length, 1, "setOpen", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("TextAnnot.setOpen", {
            text: this.id,
            isopen: b
        })
    };
    a.TextAnnot.prototype.getIcon = function() {
        return a.sendWithPromise("TextAnnot.getIcon", {
            text: this.id
        })
    };
    a.TextAnnot.prototype.setIcon = function(b) {
        "undefined" === typeof b && (b = a.TextAnnot.Icon.e_Note);
        d(arguments.length, 0, "setIcon", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("TextAnnot.setIcon", {
            text: this.id,
            icon: b
        })
    };
    a.TextAnnot.prototype.setIconDefault = function() {
        return a.sendWithPromise("TextAnnot.setIconDefault", {
            text: this.id
        })
    };
    a.TextAnnot.prototype.getIconName =
        function() {
            return a.sendWithPromise("TextAnnot.getIconName", {
                text: this.id
            })
        };
    a.TextAnnot.prototype.setIconName = function(b) {
        d(arguments.length, 1, "setIconName", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("TextAnnot.setIconName", {
            text: this.id,
            icon: b
        })
    };
    a.TextAnnot.prototype.getState = function() {
        return a.sendWithPromise("TextAnnot.getState", {
            text: this.id
        })
    };
    a.TextAnnot.prototype.setState = function(b) {
        "undefined" === typeof b && (b = "");
        d(arguments.length, 0, "setState", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("TextAnnot.setState", {
            text: this.id,
            state: b
        })
    };
    a.TextAnnot.prototype.getStateModel = function() {
        return a.sendWithPromise("TextAnnot.getStateModel", {
            text: this.id
        })
    };
    a.TextAnnot.prototype.setStateModel = function(b) {
        d(arguments.length, 1, "setStateModel", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("TextAnnot.setStateModel", {
            text: this.id,
            sm: b
        })
    };
    a.TextAnnot.prototype.getAnchorPosition = function(b) {
        d(arguments.length, 1, "getAnchorPosition", "(PDFNet.Point)", [
            [b, "Structure", a.Point, "Point"]
        ]);
        n("getAnchorPosition", [
            [b, 0]
        ]);
        b.yieldFunction = "TextAnnot.getAnchorPosition";
        return a.sendWithPromise("TextAnnot.getAnchorPosition", {
            text: this.id,
            anchor: b
        }).then(function(a) {
            b.yieldFunction = void 0;
            q(a, b)
        })
    };
    a.TextAnnot.prototype.setAnchorPosition = function(b) {
        d(arguments.length, 1, "setAnchorPosition", "(PDFNet.Point)", [
            [b, "Structure", a.Point, "Point"]
        ]);
        n("setAnchorPosition", [
            [b, 0]
        ]);
        return a.sendWithPromise("TextAnnot.setAnchorPosition", {
            text: this.id,
            anchor: b
        })
    };
    a.UnderlineAnnot.createFromObj = function(b) {
        d(arguments.length, 1, "createFromObj",
            "(PDFNet.Obj)", [
                [b, "Object", a.Obj, "Obj"]
            ]);
        return a.sendWithPromise("underlineAnnotCreateFromObj", {
            d: b.id
        }).then(function(b) {
            return f(a.UnderlineAnnot, b)
        })
    };
    a.UnderlineAnnot.createFromAnnot = function(b) {
        d(arguments.length, 1, "createFromAnnot", "(PDFNet.Annot)", [
            [b, "Object", a.Annot, "Annot"]
        ]);
        return a.sendWithPromise("underlineAnnotCreateFromAnnot", {
            ann: b.id
        }).then(function(b) {
            return f(a.UnderlineAnnot, b)
        })
    };
    a.UnderlineAnnot.create = function(b, c) {
        d(arguments.length, 2, "create", "(PDFNet.SDFDoc, PDFNet.Rect)",
            [
                [b, "SDFDoc"],
                [c, "Structure", a.Rect, "Rect"]
            ]);
        n("create", [
            [c, 1]
        ]);
        return a.sendWithPromise("underlineAnnotCreate", {
            doc: b.id,
            pos: c
        }).then(function(b) {
            return f(a.UnderlineAnnot, b)
        })
    };
    a.WatermarkAnnot.createFromObj = function(b) {
        "undefined" === typeof b && (b = new a.Obj("0"));
        d(arguments.length, 0, "createFromObj", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("watermarkAnnotCreateFromObj", {
            d: b.id
        }).then(function(b) {
            return f(a.WatermarkAnnot, b)
        })
    };
    a.WatermarkAnnot.createFromAnnot = function(b) {
        d(arguments.length,
            1, "createFromAnnot", "(PDFNet.Annot)", [
                [b, "Object", a.Annot, "Annot"]
            ]);
        return a.sendWithPromise("watermarkAnnotCreateFromAnnot", {
            ann: b.id
        }).then(function(b) {
            return f(a.WatermarkAnnot, b)
        })
    };
    a.WatermarkAnnot.create = function(b, c) {
        d(arguments.length, 2, "create", "(PDFNet.SDFDoc, PDFNet.Rect)", [
            [b, "SDFDoc"],
            [c, "Structure", a.Rect, "Rect"]
        ]);
        n("create", [
            [c, 1]
        ]);
        return a.sendWithPromise("watermarkAnnotCreate", {
            doc: b.id,
            pos: c
        }).then(function(b) {
            return f(a.WatermarkAnnot, b)
        })
    };
    a.TextMarkupAnnot.createFromObj = function(b) {
        d(arguments.length,
            1, "createFromObj", "(PDFNet.Obj)", [
                [b, "Object", a.Obj, "Obj"]
            ]);
        return a.sendWithPromise("textMarkupAnnotCreateFromObj", {
            d: b.id
        }).then(function(b) {
            return f(a.TextMarkupAnnot, b)
        })
    };
    a.TextMarkupAnnot.createFromAnnot = function(b) {
        d(arguments.length, 1, "createFromAnnot", "(PDFNet.Annot)", [
            [b, "Object", a.Annot, "Annot"]
        ]);
        return a.sendWithPromise("textMarkupAnnotCreateFromAnnot", {
            ann: b.id
        }).then(function(b) {
            return f(a.TextMarkupAnnot, b)
        })
    };
    a.TextMarkupAnnot.prototype.getQuadPointCount = function() {
        return a.sendWithPromise("TextMarkupAnnot.getQuadPointCount", {
            textmarkup: this.id
        })
    };
    a.TextMarkupAnnot.prototype.getQuadPoint = function(b) {
        d(arguments.length, 1, "getQuadPoint", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("TextMarkupAnnot.getQuadPoint", {
            textmarkup: this.id,
            idx: b
        })
    };
    a.TextMarkupAnnot.prototype.setQuadPoint = function(b, c) {
        d(arguments.length, 2, "setQuadPoint", "(number, PDFNet.QuadPoint)", [
            [b, "number"],
            [c, "Structure", a.QuadPoint, "QuadPoint"]
        ]);
        n("setQuadPoint", [
            [c, 1]
        ]);
        return a.sendWithPromise("TextMarkupAnnot.setQuadPoint", {
            textmarkup: this.id,
            idx: b,
            qp: c
        })
    };
    a.WidgetAnnot.create = function(b, c, e) {
        d(arguments.length, 3, "create", "(PDFNet.SDFDoc, PDFNet.Rect, PDFNet.Field)", [
            [b, "SDFDoc"],
            [c, "Structure", a.Rect, "Rect"],
            [e, "Structure", a.Field, "Field"]
        ]);
        n("create", [
            [c, 1],
            [e, 2]
        ]);
        e.yieldFunction = "WidgetAnnot.create";
        return a.sendWithPromise("widgetAnnotCreate", {
            doc: b.id,
            pos: c,
            field: e
        }).then(function(b) {
            e.yieldFunction = void 0;
            b.result = f(a.WidgetAnnot, b.result);
            q(b.field, e);
            return b.result
        })
    };
    a.WidgetAnnot.createFromObj = function(b) {
        "undefined" === typeof b &&
            (b = new a.Obj("0"));
        d(arguments.length, 0, "createFromObj", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("widgetAnnotCreateFromObj", {
            d: b.id
        }).then(function(b) {
            return f(a.WidgetAnnot, b)
        })
    };
    a.WidgetAnnot.createFromAnnot = function(b) {
        d(arguments.length, 1, "createFromAnnot", "(PDFNet.Annot)", [
            [b, "Object", a.Annot, "Annot"]
        ]);
        return a.sendWithPromise("widgetAnnotCreateFromAnnot", {
            ann: b.id
        }).then(function(b) {
            return f(a.WidgetAnnot, b)
        })
    };
    a.WidgetAnnot.prototype.getField = function() {
        return a.sendWithPromise("WidgetAnnot.getField", {
            widget: this.id
        }).then(function(b) {
            return new a.Field(b)
        })
    };
    a.WidgetAnnot.prototype.getHighlightingMode = function() {
        return a.sendWithPromise("WidgetAnnot.getHighlightingMode", {
            widget: this.id
        })
    };
    a.WidgetAnnot.prototype.setHighlightingMode = function(b) {
        "undefined" === typeof b && (b = a.WidgetAnnot.HighlightingMode.e_invert);
        d(arguments.length, 0, "setHighlightingMode", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("WidgetAnnot.setHighlightingMode", {
            widget: this.id,
            value: b
        })
    };
    a.WidgetAnnot.prototype.getAction =
        function() {
            return a.sendWithPromise("WidgetAnnot.getAction", {
                widget: this.id
            }).then(function(b) {
                return f(a.Action, b)
            })
        };
    a.WidgetAnnot.prototype.setAction = function(b) {
        d(arguments.length, 1, "setAction", "(PDFNet.Action)", [
            [b, "Object", a.Action, "Action"]
        ]);
        return a.sendWithPromise("WidgetAnnot.setAction", {
            widget: this.id,
            action: b.id
        })
    };
    a.WidgetAnnot.prototype.getBorderColor = function() {
        return a.sendWithPromise("WidgetAnnot.getBorderColor", {
            widget: this.id
        }).then(function(b) {
            return l(a.ColorPt, b)
        })
    };
    a.WidgetAnnot.prototype.setBorderColor =
        function(b, c) {
            d(arguments.length, 2, "setBorderColor", "(PDFNet.ColorPt, number)", [
                [b, "Object", a.ColorPt, "ColorPt"],
                [c, "number"]
            ]);
            return a.sendWithPromise("WidgetAnnot.setBorderColor", {
                widget: this.id,
                col: b.id,
                compnum: c
            })
        };
    a.WidgetAnnot.prototype.getBorderColorCompNum = function() {
        return a.sendWithPromise("WidgetAnnot.getBorderColorCompNum", {
            widget: this.id
        })
    };
    a.WidgetAnnot.prototype.getBackgroundColorCompNum = function() {
        return a.sendWithPromise("WidgetAnnot.getBackgroundColorCompNum", {
            widget: this.id
        })
    };
    a.WidgetAnnot.prototype.getBackgroundColor = function() {
        return a.sendWithPromise("WidgetAnnot.getBackgroundColor", {
            widget: this.id
        }).then(function(b) {
            return l(a.ColorPt, b)
        })
    };
    a.WidgetAnnot.prototype.setBackgroundColor = function(b, c) {
        d(arguments.length, 2, "setBackgroundColor", "(PDFNet.ColorPt, number)", [
            [b, "Object", a.ColorPt, "ColorPt"],
            [c, "number"]
        ]);
        return a.sendWithPromise("WidgetAnnot.setBackgroundColor", {
            widget: this.id,
            col: b.id,
            compnum: c
        })
    };
    a.WidgetAnnot.prototype.getStaticCaptionText = function() {
        return a.sendWithPromise("WidgetAnnot.getStaticCaptionText", {
            widget: this.id
        })
    };
    a.WidgetAnnot.prototype.setStaticCaptionText = function(b) {
        d(arguments.length, 1, "setStaticCaptionText", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("WidgetAnnot.setStaticCaptionText", {
            widget: this.id,
            contents: b
        })
    };
    a.WidgetAnnot.prototype.getRolloverCaptionText = function() {
        return a.sendWithPromise("WidgetAnnot.getRolloverCaptionText", {
            widget: this.id
        })
    };
    a.WidgetAnnot.prototype.setRolloverCaptionText = function(b) {
        d(arguments.length, 1, "setRolloverCaptionText", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("WidgetAnnot.setRolloverCaptionText", {
            widget: this.id,
            contents: b
        })
    };
    a.WidgetAnnot.prototype.getMouseDownCaptionText = function() {
        return a.sendWithPromise("WidgetAnnot.getMouseDownCaptionText", {
            widget: this.id
        })
    };
    a.WidgetAnnot.prototype.setMouseDownCaptionText = function(b) {
        d(arguments.length, 1, "setMouseDownCaptionText", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("WidgetAnnot.setMouseDownCaptionText", {
            widget: this.id,
            contents: b
        })
    };
    a.WidgetAnnot.prototype.getStaticIcon = function() {
        return a.sendWithPromise("WidgetAnnot.getStaticIcon", {
            widget: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.WidgetAnnot.prototype.setStaticIcon = function(b) {
        d(arguments.length, 1, "setStaticIcon", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("WidgetAnnot.setStaticIcon", {
            widget: this.id,
            icon: b.id
        })
    };
    a.WidgetAnnot.prototype.getRolloverIcon = function() {
        return a.sendWithPromise("WidgetAnnot.getRolloverIcon", {
            widget: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.WidgetAnnot.prototype.setRolloverIcon = function(b) {
        d(arguments.length,
            1, "setRolloverIcon", "(PDFNet.Obj)", [
                [b, "Object", a.Obj, "Obj"]
            ]);
        return a.sendWithPromise("WidgetAnnot.setRolloverIcon", {
            widget: this.id,
            icon: b.id
        })
    };
    a.WidgetAnnot.prototype.getMouseDownIcon = function() {
        return a.sendWithPromise("WidgetAnnot.getMouseDownIcon", {
            widget: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.WidgetAnnot.prototype.setMouseDownIcon = function(b) {
        d(arguments.length, 1, "setMouseDownIcon", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("WidgetAnnot.setMouseDownIcon", {
            widget: this.id,
            icon: b.id
        })
    };
    a.WidgetAnnot.prototype.getScaleType = function() {
        return a.sendWithPromise("WidgetAnnot.getScaleType", {
            widget: this.id
        })
    };
    a.WidgetAnnot.prototype.setScaleType = function(b) {
        d(arguments.length, 1, "setScaleType", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("WidgetAnnot.setScaleType", {
            widget: this.id,
            st: b
        })
    };
    a.WidgetAnnot.prototype.getIconCaptionRelation = function() {
        return a.sendWithPromise("WidgetAnnot.getIconCaptionRelation", {
            widget: this.id
        })
    };
    a.WidgetAnnot.prototype.setIconCaptionRelation =
        function(b) {
            d(arguments.length, 1, "setIconCaptionRelation", "(number)", [
                [b, "number"]
            ]);
            return a.sendWithPromise("WidgetAnnot.setIconCaptionRelation", {
                widget: this.id,
                icr: b
            })
        };
    a.WidgetAnnot.prototype.getScaleCondition = function() {
        return a.sendWithPromise("WidgetAnnot.getScaleCondition", {
            widget: this.id
        })
    };
    a.WidgetAnnot.prototype.setScaleCondition = function(b) {
        d(arguments.length, 1, "setScaleCondition", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("WidgetAnnot.setScaleCondition", {
            widget: this.id,
            sd: b
        })
    };
    a.WidgetAnnot.prototype.getFitFull = function() {
        return a.sendWithPromise("WidgetAnnot.getFitFull", {
            widget: this.id
        })
    };
    a.WidgetAnnot.prototype.setFitFull = function(b) {
        d(arguments.length, 1, "setFitFull", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("WidgetAnnot.setFitFull", {
            widget: this.id,
            ff: b
        })
    };
    a.WidgetAnnot.prototype.getHIconLeftOver = function() {
        return a.sendWithPromise("WidgetAnnot.getHIconLeftOver", {
            widget: this.id
        })
    };
    a.WidgetAnnot.prototype.setHIconLeftOver = function(b) {
        d(arguments.length, 1, "setHIconLeftOver",
            "(number)", [
                [b, "number"]
            ]);
        return a.sendWithPromise("WidgetAnnot.setHIconLeftOver", {
            widget: this.id,
            hl: b
        })
    };
    a.WidgetAnnot.prototype.getVIconLeftOver = function() {
        return a.sendWithPromise("WidgetAnnot.getVIconLeftOver", {
            widget: this.id
        })
    };
    a.WidgetAnnot.prototype.setVIconLeftOver = function(b) {
        d(arguments.length, 1, "setVIconLeftOver", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("WidgetAnnot.setVIconLeftOver", {
            widget: this.id,
            vl: b
        })
    };
    a.WidgetAnnot.prototype.setFontSize = function(b) {
        d(arguments.length,
            1, "setFontSize", "(number)", [
                [b, "number"]
            ]);
        return a.sendWithPromise("WidgetAnnot.setFontSize", {
            widget: this.id,
            font_size: b
        })
    };
    a.WidgetAnnot.prototype.setTextColor = function(b, c) {
        d(arguments.length, 2, "setTextColor", "(PDFNet.ColorPt, number)", [
            [b, "Object", a.ColorPt, "ColorPt"],
            [c, "number"]
        ]);
        return a.sendWithPromise("WidgetAnnot.setTextColor", {
            widget: this.id,
            color: b.id,
            col_comp: c
        })
    };
    a.WidgetAnnot.prototype.setFont = function(b) {
        d(arguments.length, 1, "setFont", "(PDFNet.Font)", [
            [b, "Object", a.Font, "Font"]
        ]);
        return a.sendWithPromise("WidgetAnnot.setFont", {
            widget: this.id,
            font: b.id
        })
    };
    a.WidgetAnnot.prototype.getFontSize = function() {
        return a.sendWithPromise("WidgetAnnot.getFontSize", {
            widget: this.id
        })
    };
    a.WidgetAnnot.prototype.getTextColor = function() {
        return a.sendWithPromise("WidgetAnnot.getTextColor", {
            widget: this.id
        }).then(function(b) {
            b.col = l(a.ColorPt, b.col);
            return b
        })
    };
    a.WidgetAnnot.prototype.getFont = function() {
        return a.sendWithPromise("WidgetAnnot.getFont", {
            widget: this.id
        }).then(function(b) {
            return l(a.Font,
                b)
        })
    };
    a.SignatureWidget.create = function(b, c, e) {
        "undefined" === typeof e && (e = "");
        d(arguments.length, 2, "create", "(PDFNet.PDFDoc, PDFNet.Rect, string)", [
            [b, "PDFDoc"],
            [c, "Structure", a.Rect, "Rect"],
            [e, "string"]
        ]);
        n("create", [
            [c, 1]
        ]);
        return a.sendWithPromise("signatureWidgetCreate", {
            doc: b.id,
            pos: c,
            field_name: e
        }).then(function(b) {
            return f(a.SignatureWidget, b)
        })
    };
    a.SignatureWidget.createWithField = function(b, c, e) {
        d(arguments.length, 3, "createWithField", "(PDFNet.PDFDoc, PDFNet.Rect, PDFNet.Field)", [
            [b, "PDFDoc"],
            [c, "Structure", a.Rect, "Rect"],
            [e, "Structure", a.Field, "Field"]
        ]);
        n("createWithField", [
            [c, 1],
            [e, 2]
        ]);
        return a.sendWithPromise("signatureWidgetCreateWithField", {
            doc: b.id,
            pos: c,
            field: e
        }).then(function(b) {
            return f(a.SignatureWidget, b)
        })
    };
    a.SignatureWidget.createWithDigitalSignatureField = function(b, c, e) {
        d(arguments.length, 3, "createWithDigitalSignatureField", "(PDFNet.PDFDoc, PDFNet.Rect, PDFNet.DigitalSignatureField)", [
            [b, "PDFDoc"],
            [c, "Structure", a.Rect, "Rect"],
            [e, "Structure", a.DigitalSignatureField, "DigitalSignatureField"]
        ]);
        n("createWithDigitalSignatureField", [
            [c, 1],
            [e, 2]
        ]);
        return a.sendWithPromise("signatureWidgetCreateWithDigitalSignatureField", {
            doc: b.id,
            pos: c,
            field: e
        }).then(function(b) {
            return f(a.SignatureWidget, b)
        })
    };
    a.SignatureWidget.createFromObj = function(b) {
        "undefined" === typeof b && (b = new a.Obj("0"));
        d(arguments.length, 0, "createFromObj", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("signatureWidgetCreateFromObj", {
            d: b.id
        }).then(function(b) {
            return f(a.SignatureWidget, b)
        })
    };
    a.SignatureWidget.createFromAnnot =
        function(b) {
            d(arguments.length, 1, "createFromAnnot", "(PDFNet.Annot)", [
                [b, "Object", a.Annot, "Annot"]
            ]);
            return a.sendWithPromise("signatureWidgetCreateFromAnnot", {
                annot: b.id
            }).then(function(b) {
                return f(a.SignatureWidget, b)
            })
        };
    a.SignatureWidget.prototype.createSignatureAppearance = function(b) {
        d(arguments.length, 1, "createSignatureAppearance", "(PDFNet.Image)", [
            [b, "Object", a.Image, "Image"]
        ]);
        return a.sendWithPromise("SignatureWidget.createSignatureAppearance", {
            self: this.id,
            img: b.id
        })
    };
    a.SignatureWidget.prototype.getDigitalSignatureField =
        function() {
            return a.sendWithPromise("SignatureWidget.getDigitalSignatureField", {
                self: this.id
            }).then(function(b) {
                return new a.DigitalSignatureField(b)
            })
        };
    a.ComboBoxWidget.create = function(b, c, e) {
        "undefined" === typeof e && (e = "");
        d(arguments.length, 2, "create", "(PDFNet.PDFDoc, PDFNet.Rect, string)", [
            [b, "PDFDoc"],
            [c, "Structure", a.Rect, "Rect"],
            [e, "string"]
        ]);
        n("create", [
            [c, 1]
        ]);
        return a.sendWithPromise("comboBoxWidgetCreate", {
            doc: b.id,
            pos: c,
            field_name: e
        }).then(function(b) {
            return f(a.ComboBoxWidget, b)
        })
    };
    a.ComboBoxWidget.createWithField =
        function(b, c, e) {
            d(arguments.length, 3, "createWithField", "(PDFNet.PDFDoc, PDFNet.Rect, PDFNet.Field)", [
                [b, "PDFDoc"],
                [c, "Structure", a.Rect, "Rect"],
                [e, "Structure", a.Field, "Field"]
            ]);
            n("createWithField", [
                [c, 1],
                [e, 2]
            ]);
            return a.sendWithPromise("comboBoxWidgetCreateWithField", {
                doc: b.id,
                pos: c,
                field: e
            }).then(function(b) {
                return f(a.ComboBoxWidget, b)
            })
        };
    a.ComboBoxWidget.createFromObj = function(b) {
        "undefined" === typeof b && (b = new a.Obj("0"));
        d(arguments.length, 0, "createFromObj", "(PDFNet.Obj)", [
            [b, "Object", a.Obj,
                "Obj"
            ]
        ]);
        return a.sendWithPromise("comboBoxWidgetCreateFromObj", {
            d: b.id
        }).then(function(b) {
            return f(a.ComboBoxWidget, b)
        })
    };
    a.ComboBoxWidget.createFromAnnot = function(b) {
        d(arguments.length, 1, "createFromAnnot", "(PDFNet.Annot)", [
            [b, "Object", a.Annot, "Annot"]
        ]);
        return a.sendWithPromise("comboBoxWidgetCreateFromAnnot", {
            annot: b.id
        }).then(function(b) {
            return f(a.ComboBoxWidget, b)
        })
    };
    a.ComboBoxWidget.prototype.addOption = function(b) {
        d(arguments.length, 1, "addOption", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("ComboBoxWidget.addOption", {
            combobox: this.id,
            value: b
        })
    };
    a.ComboBoxWidget.prototype.addOptions = function(b) {
        d(arguments.length, 1, "addOptions", "(Array<string>)", [
            [b, "Array"]
        ]);
        return a.sendWithPromise("ComboBoxWidget.addOptions", {
            combobox: this.id,
            opts_list: b
        })
    };
    a.ComboBoxWidget.prototype.setSelectedOption = function(b) {
        d(arguments.length, 1, "setSelectedOption", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("ComboBoxWidget.setSelectedOption", {
            combobox: this.id,
            value: b
        })
    };
    a.ComboBoxWidget.prototype.getSelectedOption = function() {
        return a.sendWithPromise("ComboBoxWidget.getSelectedOption", {
            combobox: this.id
        })
    };
    a.ComboBoxWidget.prototype.replaceOptions = function(b) {
        d(arguments.length, 1, "replaceOptions", "(Array<string>)", [
            [b, "Array"]
        ]);
        return a.sendWithPromise("ComboBoxWidget.replaceOptions", {
            combobox: this.id,
            new_opts_list: b
        })
    };
    a.ComboBoxWidget.prototype.removeOption = function(b) {
        d(arguments.length, 1, "removeOption", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("ComboBoxWidget.removeOption", {
            combobox: this.id,
            value: b
        })
    };
    a.ListBoxWidget.create = function(b, c, e) {
        "undefined" === typeof e &&
            (e = "");
        d(arguments.length, 2, "create", "(PDFNet.PDFDoc, PDFNet.Rect, string)", [
            [b, "PDFDoc"],
            [c, "Structure", a.Rect, "Rect"],
            [e, "string"]
        ]);
        n("create", [
            [c, 1]
        ]);
        return a.sendWithPromise("listBoxWidgetCreate", {
            doc: b.id,
            pos: c,
            field_name: e
        }).then(function(b) {
            return f(a.ListBoxWidget, b)
        })
    };
    a.ListBoxWidget.createWithField = function(b, c, e) {
        d(arguments.length, 3, "createWithField", "(PDFNet.PDFDoc, PDFNet.Rect, PDFNet.Field)", [
            [b, "PDFDoc"],
            [c, "Structure", a.Rect, "Rect"],
            [e, "Structure", a.Field, "Field"]
        ]);
        n("createWithField",
            [
                [c, 1],
                [e, 2]
            ]);
        return a.sendWithPromise("listBoxWidgetCreateWithField", {
            doc: b.id,
            pos: c,
            field: e
        }).then(function(b) {
            return f(a.ListBoxWidget, b)
        })
    };
    a.ListBoxWidget.createFromObj = function(b) {
        "undefined" === typeof b && (b = new a.Obj("0"));
        d(arguments.length, 0, "createFromObj", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("listBoxWidgetCreateFromObj", {
            d: b.id
        }).then(function(b) {
            return f(a.ListBoxWidget, b)
        })
    };
    a.ListBoxWidget.createFromAnnot = function(b) {
        d(arguments.length, 1, "createFromAnnot",
            "(PDFNet.Annot)", [
                [b, "Object", a.Annot, "Annot"]
            ]);
        return a.sendWithPromise("listBoxWidgetCreateFromAnnot", {
            annot: b.id
        }).then(function(b) {
            return f(a.ListBoxWidget, b)
        })
    };
    a.ListBoxWidget.prototype.addOption = function(b) {
        d(arguments.length, 1, "addOption", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("ListBoxWidget.addOption", {
            listbox: this.id,
            value: b
        })
    };
    a.ListBoxWidget.prototype.addOptions = function(b) {
        d(arguments.length, 1, "addOptions", "(Array<string>)", [
            [b, "Array"]
        ]);
        return a.sendWithPromise("ListBoxWidget.addOptions", {
            listbox: this.id,
            opts_list: b
        })
    };
    a.ListBoxWidget.prototype.setSelectedOptions = function(b) {
        d(arguments.length, 1, "setSelectedOptions", "(Array<string>)", [
            [b, "Array"]
        ]);
        return a.sendWithPromise("ListBoxWidget.setSelectedOptions", {
            listbox: this.id,
            selected_opts_list: b
        })
    };
    a.ListBoxWidget.prototype.replaceOptions = function(b) {
        d(arguments.length, 1, "replaceOptions", "(Array<string>)", [
            [b, "Array"]
        ]);
        return a.sendWithPromise("ListBoxWidget.replaceOptions", {
            listbox: this.id,
            new_opts_list: b
        })
    };
    a.ListBoxWidget.prototype.removeOption =
        function(b) {
            d(arguments.length, 1, "removeOption", "(string)", [
                [b, "string"]
            ]);
            return a.sendWithPromise("ListBoxWidget.removeOption", {
                listbox: this.id,
                value: b
            })
        };
    a.TextWidget.create = function(b, c, e) {
        "undefined" === typeof e && (e = "");
        d(arguments.length, 2, "create", "(PDFNet.PDFDoc, PDFNet.Rect, string)", [
            [b, "PDFDoc"],
            [c, "Structure", a.Rect, "Rect"],
            [e, "string"]
        ]);
        n("create", [
            [c, 1]
        ]);
        return a.sendWithPromise("textWidgetCreate", {
            doc: b.id,
            pos: c,
            field_name: e
        }).then(function(b) {
            return f(a.TextWidget, b)
        })
    };
    a.TextWidget.createWithField =
        function(b, c, e) {
            d(arguments.length, 3, "createWithField", "(PDFNet.PDFDoc, PDFNet.Rect, PDFNet.Field)", [
                [b, "PDFDoc"],
                [c, "Structure", a.Rect, "Rect"],
                [e, "Structure", a.Field, "Field"]
            ]);
            n("createWithField", [
                [c, 1],
                [e, 2]
            ]);
            return a.sendWithPromise("textWidgetCreateWithField", {
                doc: b.id,
                pos: c,
                field: e
            }).then(function(b) {
                return f(a.TextWidget, b)
            })
        };
    a.TextWidget.createFromObj = function(b) {
        "undefined" === typeof b && (b = new a.Obj("0"));
        d(arguments.length, 0, "createFromObj", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("textWidgetCreateFromObj", {
            d: b.id
        }).then(function(b) {
            return f(a.TextWidget, b)
        })
    };
    a.TextWidget.createFromAnnot = function(b) {
        d(arguments.length, 1, "createFromAnnot", "(PDFNet.Annot)", [
            [b, "Object", a.Annot, "Annot"]
        ]);
        return a.sendWithPromise("textWidgetCreateFromAnnot", {
            annot: b.id
        }).then(function(b) {
            return f(a.TextWidget, b)
        })
    };
    a.TextWidget.prototype.setText = function(b) {
        d(arguments.length, 1, "setText", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("TextWidget.setText", {
            widget: this.id,
            text: b
        })
    };
    a.TextWidget.prototype.getText = function() {
        return a.sendWithPromise("TextWidget.getText", {
            widget: this.id
        })
    };
    a.CheckBoxWidget.create = function(b, c, e) {
        "undefined" === typeof e && (e = "");
        d(arguments.length, 2, "create", "(PDFNet.PDFDoc, PDFNet.Rect, string)", [
            [b, "PDFDoc"],
            [c, "Structure", a.Rect, "Rect"],
            [e, "string"]
        ]);
        n("create", [
            [c, 1]
        ]);
        return a.sendWithPromise("checkBoxWidgetCreate", {
            doc: b.id,
            pos: c,
            field_name: e
        }).then(function(b) {
            return f(a.CheckBoxWidget, b)
        })
    };
    a.CheckBoxWidget.createWithField = function(b, c, e) {
        d(arguments.length, 3, "createWithField", "(PDFNet.PDFDoc, PDFNet.Rect, PDFNet.Field)", [
            [b,
                "PDFDoc"
            ],
            [c, "Structure", a.Rect, "Rect"],
            [e, "Structure", a.Field, "Field"]
        ]);
        n("createWithField", [
            [c, 1],
            [e, 2]
        ]);
        return a.sendWithPromise("checkBoxWidgetCreateWithField", {
            doc: b.id,
            pos: c,
            field: e
        }).then(function(b) {
            return f(a.CheckBoxWidget, b)
        })
    };
    a.CheckBoxWidget.createFromObj = function(b) {
        "undefined" === typeof b && (b = new a.Obj("0"));
        d(arguments.length, 0, "createFromObj", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("checkBoxWidgetCreateFromObj", {
            d: b.id
        }).then(function(b) {
            return f(a.CheckBoxWidget,
                b)
        })
    };
    a.CheckBoxWidget.createFromAnnot = function(b) {
        d(arguments.length, 1, "createFromAnnot", "(PDFNet.Annot)", [
            [b, "Object", a.Annot, "Annot"]
        ]);
        return a.sendWithPromise("checkBoxWidgetCreateFromAnnot", {
            annot: b.id
        }).then(function(b) {
            return f(a.CheckBoxWidget, b)
        })
    };
    a.CheckBoxWidget.prototype.isChecked = function() {
        return a.sendWithPromise("CheckBoxWidget.isChecked", {
            button: this.id
        })
    };
    a.CheckBoxWidget.prototype.setChecked = function(b) {
        d(arguments.length, 1, "setChecked", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("CheckBoxWidget.setChecked", {
            button: this.id,
            checked: b
        })
    };
    a.RadioButtonWidget.createFromObj = function(b) {
        "undefined" === typeof b && (b = new a.Obj("0"));
        d(arguments.length, 0, "createFromObj", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("radioButtonWidgetCreateFromObj", {
            d: b.id
        }).then(function(b) {
            return f(a.RadioButtonWidget, b)
        })
    };
    a.RadioButtonWidget.createFromAnnot = function(b) {
        d(arguments.length, 1, "createFromAnnot", "(PDFNet.Annot)", [
            [b, "Object", a.Annot, "Annot"]
        ]);
        return a.sendWithPromise("radioButtonWidgetCreateFromAnnot", {
            annot: b.id
        }).then(function(b) {
            return f(a.RadioButtonWidget, b)
        })
    };
    a.RadioButtonWidget.prototype.isEnabled = function() {
        return a.sendWithPromise("RadioButtonWidget.isEnabled", {
            button: this.id
        })
    };
    a.RadioButtonWidget.prototype.enableButton = function() {
        return a.sendWithPromise("RadioButtonWidget.enableButton", {
            button: this.id
        })
    };
    a.RadioButtonWidget.prototype.getGroup = function() {
        return a.sendWithPromise("RadioButtonWidget.getGroup", {
            button: this.id
        }).then(function(b) {
            return l(a.RadioButtonGroup, b)
        })
    };
    a.PushButtonWidget.create =
        function(b, c, e) {
            "undefined" === typeof e && (e = "");
            d(arguments.length, 2, "create", "(PDFNet.PDFDoc, PDFNet.Rect, string)", [
                [b, "PDFDoc"],
                [c, "Structure", a.Rect, "Rect"],
                [e, "string"]
            ]);
            n("create", [
                [c, 1]
            ]);
            return a.sendWithPromise("pushButtonWidgetCreate", {
                doc: b.id,
                pos: c,
                field_name: e
            }).then(function(b) {
                return f(a.PushButtonWidget, b)
            })
        };
    a.PushButtonWidget.createWithField = function(b, c, e) {
        d(arguments.length, 3, "createWithField", "(PDFNet.PDFDoc, PDFNet.Rect, PDFNet.Field)", [
            [b, "PDFDoc"],
            [c, "Structure", a.Rect, "Rect"],
            [e, "Structure", a.Field, "Field"]
        ]);
        n("createWithField", [
            [c, 1],
            [e, 2]
        ]);
        return a.sendWithPromise("pushButtonWidgetCreateWithField", {
            doc: b.id,
            pos: c,
            field: e
        }).then(function(b) {
            return f(a.PushButtonWidget, b)
        })
    };
    a.PushButtonWidget.createFromObj = function(b) {
        "undefined" === typeof b && (b = new a.Obj("0"));
        d(arguments.length, 0, "createFromObj", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("pushButtonWidgetCreateFromObj", {
            obj: b.id
        }).then(function(b) {
            return f(a.PushButtonWidget, b)
        })
    };
    a.PushButtonWidget.createFromAnnot =
        function(b) {
            d(arguments.length, 1, "createFromAnnot", "(PDFNet.Annot)", [
                [b, "Object", a.Annot, "Annot"]
            ]);
            return a.sendWithPromise("pushButtonWidgetCreateFromAnnot", {
                annot: b.id
            }).then(function(b) {
                return f(a.PushButtonWidget, b)
            })
        };
    a.Bookmark.create = function(b, c) {
        d(arguments.length, 2, "create", "(PDFNet.PDFDoc, string)", [
            [b, "PDFDoc"],
            [c, "string"]
        ]);
        return a.sendWithPromise("bookmarkCreate", {
            in_doc: b.id,
            in_title: c
        }).then(function(b) {
            return f(a.Bookmark, b)
        })
    };
    a.Bookmark.createFromObj = function(b) {
        d(arguments.length,
            1, "createFromObj", "(PDFNet.Obj)", [
                [b, "Object", a.Obj, "Obj"]
            ]);
        return a.sendWithPromise("bookmarkCreateFromObj", {
            in_bookmark_dict: b.id
        }).then(function(b) {
            return f(a.Bookmark, b)
        })
    };
    a.Bookmark.prototype.copy = function() {
        return a.sendWithPromise("Bookmark.copy", {
            in_bookmark: this.id
        }).then(function(b) {
            return f(a.Bookmark, b)
        })
    };
    a.Bookmark.prototype.compare = function(b) {
        d(arguments.length, 1, "compare", "(PDFNet.Bookmark)", [
            [b, "Object", a.Bookmark, "Bookmark"]
        ]);
        return a.sendWithPromise("Bookmark.compare", {
            bm: this.id,
            in_bookmark: b.id
        })
    };
    a.Bookmark.prototype.isValid = function() {
        return a.sendWithPromise("Bookmark.isValid", {
            bm: this.id
        })
    };
    a.Bookmark.prototype.hasChildren = function() {
        return a.sendWithPromise("Bookmark.hasChildren", {
            bm: this.id
        })
    };
    a.Bookmark.prototype.getNext = function() {
        return a.sendWithPromise("Bookmark.getNext", {
            bm: this.id
        }).then(function(b) {
            return f(a.Bookmark, b)
        })
    };
    a.Bookmark.prototype.getPrev = function() {
        return a.sendWithPromise("Bookmark.getPrev", {
            bm: this.id
        }).then(function(b) {
            return f(a.Bookmark,
                b)
        })
    };
    a.Bookmark.prototype.getFirstChild = function() {
        return a.sendWithPromise("Bookmark.getFirstChild", {
            bm: this.id
        }).then(function(b) {
            return f(a.Bookmark, b)
        })
    };
    a.Bookmark.prototype.getLastChild = function() {
        return a.sendWithPromise("Bookmark.getLastChild", {
            bm: this.id
        }).then(function(b) {
            return f(a.Bookmark, b)
        })
    };
    a.Bookmark.prototype.getParent = function() {
        return a.sendWithPromise("Bookmark.getParent", {
            bm: this.id
        }).then(function(b) {
            return f(a.Bookmark, b)
        })
    };
    a.Bookmark.prototype.find = function(b) {
        d(arguments.length,
            1, "find", "(string)", [
                [b, "string"]
            ]);
        return a.sendWithPromise("Bookmark.find", {
            bm: this.id,
            in_title: b
        }).then(function(b) {
            return f(a.Bookmark, b)
        })
    };
    a.Bookmark.prototype.addNewChild = function(b) {
        d(arguments.length, 1, "addNewChild", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("Bookmark.addNewChild", {
            bm: this.id,
            in_title: b
        }).then(function(b) {
            return f(a.Bookmark, b)
        })
    };
    a.Bookmark.prototype.addChild = function(b) {
        d(arguments.length, 1, "addChild", "(PDFNet.Bookmark)", [
            [b, "Object", a.Bookmark, "Bookmark"]
        ]);
        return a.sendWithPromise("Bookmark.addChild", {
            bm: this.id,
            in_bookmark: b.id
        })
    };
    a.Bookmark.prototype.addNewNext = function(b) {
        d(arguments.length, 1, "addNewNext", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("Bookmark.addNewNext", {
            bm: this.id,
            in_title: b
        }).then(function(b) {
            return f(a.Bookmark, b)
        })
    };
    a.Bookmark.prototype.addNext = function(b) {
        d(arguments.length, 1, "addNext", "(PDFNet.Bookmark)", [
            [b, "Object", a.Bookmark, "Bookmark"]
        ]);
        return a.sendWithPromise("Bookmark.addNext", {
            bm: this.id,
            in_bookmark: b.id
        })
    };
    a.Bookmark.prototype.addNewPrev = function(b) {
        d(arguments.length,
            1, "addNewPrev", "(string)", [
                [b, "string"]
            ]);
        return a.sendWithPromise("Bookmark.addNewPrev", {
            bm: this.id,
            in_title: b
        }).then(function(b) {
            return f(a.Bookmark, b)
        })
    };
    a.Bookmark.prototype.addPrev = function(b) {
        d(arguments.length, 1, "addPrev", "(PDFNet.Bookmark)", [
            [b, "Object", a.Bookmark, "Bookmark"]
        ]);
        return a.sendWithPromise("Bookmark.addPrev", {
            bm: this.id,
            in_bookmark: b.id
        })
    };
    a.Bookmark.prototype.delete = function() {
        return a.sendWithPromise("Bookmark.delete", {
            bm: this.id
        })
    };
    a.Bookmark.prototype.unlink = function() {
        return a.sendWithPromise("Bookmark.unlink", {
            bm: this.id
        })
    };
    a.Bookmark.prototype.getIndent = function() {
        return a.sendWithPromise("Bookmark.getIndent", {
            bm: this.id
        })
    };
    a.Bookmark.prototype.isOpen = function() {
        return a.sendWithPromise("Bookmark.isOpen", {
            bm: this.id
        })
    };
    a.Bookmark.prototype.setOpen = function(b) {
        d(arguments.length, 1, "setOpen", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("Bookmark.setOpen", {
            bm: this.id,
            in_open: b
        })
    };
    a.Bookmark.prototype.getOpenCount = function() {
        return a.sendWithPromise("Bookmark.getOpenCount", {
            bm: this.id
        })
    };
    a.Bookmark.prototype.getTitle =
        function() {
            return a.sendWithPromise("Bookmark.getTitle", {
                bm: this.id
            })
        };
    a.Bookmark.prototype.getTitleObj = function() {
        return a.sendWithPromise("Bookmark.getTitleObj", {
            bm: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Bookmark.prototype.setTitle = function(b) {
        d(arguments.length, 1, "setTitle", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("Bookmark.setTitle", {
            bm: this.id,
            title: b
        })
    };
    a.Bookmark.prototype.getAction = function() {
        return a.sendWithPromise("Bookmark.getAction", {
            bm: this.id
        }).then(function(b) {
            return f(a.Action,
                b)
        })
    };
    a.Bookmark.prototype.setAction = function(b) {
        d(arguments.length, 1, "setAction", "(PDFNet.Action)", [
            [b, "Object", a.Action, "Action"]
        ]);
        return a.sendWithPromise("Bookmark.setAction", {
            bm: this.id,
            in_action: b.id
        })
    };
    a.Bookmark.prototype.removeAction = function() {
        return a.sendWithPromise("Bookmark.removeAction", {
            bm: this.id
        })
    };
    a.Bookmark.prototype.getFlags = function() {
        return a.sendWithPromise("Bookmark.getFlags", {
            bm: this.id
        })
    };
    a.Bookmark.prototype.setFlags = function(b) {
        d(arguments.length, 1, "setFlags", "(number)",
            [
                [b, "number"]
            ]);
        return a.sendWithPromise("Bookmark.setFlags", {
            bm: this.id,
            in_flags: b
        })
    };
    a.Bookmark.prototype.getColor = function() {
        return a.sendWithPromise("Bookmark.getColor", {
            bm: this.id
        })
    };
    a.Bookmark.prototype.setColor = function(b, c, e) {
        "undefined" === typeof b && (b = 0);
        "undefined" === typeof c && (c = 0);
        "undefined" === typeof e && (e = 0);
        d(arguments.length, 0, "setColor", "(number, number, number)", [
            [b, "number"],
            [c, "number"],
            [e, "number"]
        ]);
        return a.sendWithPromise("Bookmark.setColor", {
            bm: this.id,
            in_r: b,
            in_g: c,
            in_b: e
        })
    };
    a.Bookmark.prototype.getSDFObj = function() {
        return a.sendWithPromise("Bookmark.getSDFObj", {
            bm: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.ColorPt.init = function(b, c, e, m) {
        "undefined" === typeof b && (b = 0);
        "undefined" === typeof c && (c = 0);
        "undefined" === typeof e && (e = 0);
        "undefined" === typeof m && (m = 0);
        d(arguments.length, 0, "init", "(number, number, number, number)", [
            [b, "number"],
            [c, "number"],
            [e, "number"],
            [m, "number"]
        ]);
        return a.sendWithPromise("colorPtInit", {
            x: b,
            y: c,
            z: e,
            w: m
        }).then(function(b) {
            return l(a.ColorPt,
                b)
        })
    };
    a.ColorPt.prototype.compare = function(b) {
        d(arguments.length, 1, "compare", "(PDFNet.ColorPt)", [
            [b, "Object", a.ColorPt, "ColorPt"]
        ]);
        return a.sendWithPromise("ColorPt.compare", {
            left: this.id,
            right: b.id
        })
    };
    a.ColorPt.prototype.set = function(b, c, e, m) {
        "undefined" === typeof b && (b = 0);
        "undefined" === typeof c && (c = 0);
        "undefined" === typeof e && (e = 0);
        "undefined" === typeof m && (m = 0);
        d(arguments.length, 0, "set", "(number, number, number, number)", [
            [b, "number"],
            [c, "number"],
            [e, "number"],
            [m, "number"]
        ]);
        return a.sendWithPromise("ColorPt.set", {
            cp: this.id,
            x: b,
            y: c,
            z: e,
            w: m
        })
    };
    a.ColorPt.prototype.setByIndex = function(b, c) {
        d(arguments.length, 2, "setByIndex", "(number, number)", [
            [b, "number"],
            [c, "number"]
        ]);
        return a.sendWithPromise("ColorPt.setByIndex", {
            cp: this.id,
            colorant_index: b,
            colorant_value: c
        })
    };
    a.ColorPt.prototype.get = function(b) {
        d(arguments.length, 1, "get", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("ColorPt.get", {
            cp: this.id,
            colorant_index: b
        })
    };
    a.ColorPt.prototype.setColorantNum = function(b) {
        d(arguments.length, 1, "setColorantNum", "(number)",
            [
                [b, "number"]
            ]);
        return a.sendWithPromise("ColorPt.setColorantNum", {
            cp: this.id,
            num: b
        })
    };
    a.ColorSpace.createDeviceGray = function() {
        return a.sendWithPromise("colorSpaceCreateDeviceGray", {}).then(function(b) {
            return l(a.ColorSpace, b)
        })
    };
    a.ColorSpace.createDeviceRGB = function() {
        return a.sendWithPromise("colorSpaceCreateDeviceRGB", {}).then(function(b) {
            return l(a.ColorSpace, b)
        })
    };
    a.ColorSpace.createDeviceCMYK = function() {
        return a.sendWithPromise("colorSpaceCreateDeviceCMYK", {}).then(function(b) {
            return l(a.ColorSpace,
                b)
        })
    };
    a.ColorSpace.createPattern = function() {
        return a.sendWithPromise("colorSpaceCreatePattern", {}).then(function(b) {
            return l(a.ColorSpace, b)
        })
    };
    a.ColorSpace.create = function(b) {
        "undefined" === typeof b && (b = new a.Obj("0"));
        d(arguments.length, 0, "create", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("colorSpaceCreate", {
            color_space: b.id
        }).then(function(b) {
            return l(a.ColorSpace, b)
        })
    };
    a.ColorSpace.createICCFromFile = function(b, c) {
        d(arguments.length, 2, "createICCFromFile", "(PDFNet.SDFDoc, string)",
            [
                [b, "SDFDoc"],
                [c, "string"]
            ]);
        return a.sendWithPromise("colorSpaceCreateICCFromFile", {
            doc: b.id,
            filepath: c
        }).then(function(b) {
            return l(a.ColorSpace, b)
        })
    };
    a.ColorSpace.createICCFromFilter = function(b, c) {
        d(arguments.length, 2, "createICCFromFilter", "(PDFNet.SDFDoc, PDFNet.Filter)", [
            [b, "SDFDoc"],
            [c, "Object", a.Filter, "Filter"]
        ]);
        0 != c.id && t(c.id);
        return a.sendWithPromise("colorSpaceCreateICCFromFilter", {
            doc: b.id,
            no_own_filter: c.id
        }).then(function(b) {
            return l(a.ColorSpace, b)
        })
    };
    a.ColorSpace.createICCFromBuffer =
        function(b, c) {
            d(arguments.length, 2, "createICCFromBuffer", "(PDFNet.SDFDoc, ArrayBuffer|TypedArray)", [
                [b, "SDFDoc"],
                [c, "ArrayBuffer"]
            ]);
            var e = u(c, !1);
            return a.sendWithPromise("colorSpaceCreateICCFromBuffer", {
                doc: b.id,
                buf: e
            }).then(function(b) {
                return l(a.ColorSpace, b)
            })
        };
    a.ColorSpace.getComponentNumFromObj = function(b, c) {
        d(arguments.length, 2, "getComponentNumFromObj", "(number, PDFNet.Obj)", [
            [b, "number"],
            [c, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("colorSpaceGetComponentNumFromObj", {
            cs_type: b,
            cs_obj: c.id
        })
    };
    a.ColorSpace.getTypeFromObj = function(b) {
        d(arguments.length, 1, "getTypeFromObj", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("colorSpaceGetTypeFromObj", {
            cs_obj: b.id
        })
    };
    a.ColorSpace.prototype.getType = function() {
        return a.sendWithPromise("ColorSpace.getType", {
            cs: this.id
        })
    };
    a.ColorSpace.prototype.getSDFObj = function() {
        return a.sendWithPromise("ColorSpace.getSDFObj", {
            cs: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.ColorSpace.prototype.getComponentNum = function() {
        return a.sendWithPromise("ColorSpace.getComponentNum", {
            cs: this.id
        })
    };
    a.ColorSpace.prototype.initColor = function() {
        return a.sendWithPromise("ColorSpace.initColor", {
            cs: this.id
        }).then(function(b) {
            return l(a.ColorPt, b)
        })
    };
    a.ColorSpace.prototype.initComponentRanges = function(b) {
        d(arguments.length, 1, "initComponentRanges", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("ColorSpace.initComponentRanges", {
            cs: this.id,
            num_comps: b
        })
    };
    a.ColorSpace.prototype.convert2Gray = function(b) {
        d(arguments.length, 1, "convert2Gray", "(PDFNet.ColorPt)", [
            [b, "Object", a.ColorPt, "ColorPt"]
        ]);
        return a.sendWithPromise("ColorSpace.convert2Gray", {
            cs: this.id,
            in_color: b.id
        }).then(function(b) {
            return l(a.ColorPt, b)
        })
    };
    a.ColorSpace.prototype.convert2RGB = function(b) {
        d(arguments.length, 1, "convert2RGB", "(PDFNet.ColorPt)", [
            [b, "Object", a.ColorPt, "ColorPt"]
        ]);
        return a.sendWithPromise("ColorSpace.convert2RGB", {
            cs: this.id,
            in_color: b.id
        }).then(function(b) {
            return l(a.ColorPt, b)
        })
    };
    a.ColorSpace.prototype.convert2CMYK = function(b) {
        d(arguments.length, 1, "convert2CMYK", "(PDFNet.ColorPt)", [
            [b, "Object", a.ColorPt,
                "ColorPt"
            ]
        ]);
        return a.sendWithPromise("ColorSpace.convert2CMYK", {
            cs: this.id,
            in_color: b.id
        }).then(function(b) {
            return l(a.ColorPt, b)
        })
    };
    a.ColorSpace.prototype.getAlternateColorSpace = function() {
        return a.sendWithPromise("ColorSpace.getAlternateColorSpace", {
            cs: this.id
        }).then(function(b) {
            return l(a.ColorSpace, b)
        })
    };
    a.ColorSpace.prototype.getBaseColorSpace = function() {
        return a.sendWithPromise("ColorSpace.getBaseColorSpace", {
            cs: this.id
        }).then(function(b) {
            return l(a.ColorSpace, b)
        })
    };
    a.ColorSpace.prototype.getHighVal =
        function() {
            return a.sendWithPromise("ColorSpace.getHighVal", {
                cs: this.id
            })
        };
    a.ColorSpace.prototype.getLookupTable = function() {
        return a.sendWithPromise("ColorSpace.getLookupTable", {
            cs: this.id
        })
    };
    a.ColorSpace.prototype.getBaseColor = function(b) {
        d(arguments.length, 1, "getBaseColor", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("ColorSpace.getBaseColor", {
            cs: this.id,
            color_idx: b
        }).then(function(b) {
            return l(a.ColorPt, b)
        })
    };
    a.ColorSpace.prototype.getTintFunction = function() {
        return a.sendWithPromise("ColorSpace.getTintFunction", {
            cs: this.id
        }).then(function(b) {
            return l(a.Function, b)
        })
    };
    a.ColorSpace.prototype.isAll = function() {
        return a.sendWithPromise("ColorSpace.isAll", {
            cs: this.id
        })
    };
    a.ColorSpace.prototype.isNone = function() {
        return a.sendWithPromise("ColorSpace.isNone", {
            cs: this.id
        })
    };
    a.ContentReplacer.create = function() {
        return a.sendWithPromise("contentReplacerCreate", {}).then(function(b) {
            return l(a.ContentReplacer, b)
        })
    };
    a.ContentReplacer.prototype.addImage = function(b, c) {
        d(arguments.length, 2, "addImage", "(PDFNet.Rect, PDFNet.Obj)",
            [
                [b, "Structure", a.Rect, "Rect"],
                [c, "Object", a.Obj, "Obj"]
            ]);
        n("addImage", [
            [b, 0]
        ]);
        return a.sendWithPromise("ContentReplacer.addImage", {
            cr: this.id,
            target_region: b,
            replacement_image: c.id
        })
    };
    a.ContentReplacer.prototype.addText = function(b, c) {
        d(arguments.length, 2, "addText", "(PDFNet.Rect, string)", [
            [b, "Structure", a.Rect, "Rect"],
            [c, "string"]
        ]);
        n("addText", [
            [b, 0]
        ]);
        return a.sendWithPromise("ContentReplacer.addText", {
            cr: this.id,
            target_region: b,
            replacement_text: c
        })
    };
    a.ContentReplacer.prototype.addString = function(b,
        c) {
        d(arguments.length, 2, "addString", "(string, string)", [
            [b, "string"],
            [c, "string"]
        ]);
        return a.sendWithPromise("ContentReplacer.addString", {
            cr: this.id,
            template_text: b,
            replacement_text: c
        })
    };
    a.ContentReplacer.prototype.setMatchStrings = function(b, c) {
        d(arguments.length, 2, "setMatchStrings", "(string, string)", [
            [b, "string"],
            [c, "string"]
        ]);
        return a.sendWithPromise("ContentReplacer.setMatchStrings", {
            cr: this.id,
            start_str: b,
            end_str: c
        })
    };
    a.ContentReplacer.prototype.process = function(b) {
        d(arguments.length, 1, "process",
            "(PDFNet.Page)", [
                [b, "Object", a.Page, "Page"]
            ]);
        return a.sendWithPromise("ContentReplacer.process", {
            cr: this.id,
            page: b.id
        })
    };
    a.Reflow.prototype.getHtml = function() {
        return a.sendWithPromise("Reflow.getHtml", {
            self: this.id
        })
    };
    a.Reflow.prototype.getAnnot = function(b) {
        d(arguments.length, 1, "getAnnot", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("Reflow.getAnnot", {
            self: this.id,
            in_id: b
        })
    };
    a.Reflow.prototype.setAnnot = function(b) {
        d(arguments.length, 1, "setAnnot", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("Reflow.setAnnot", {
            self: this.id,
            in_json: b
        })
    };
    a.Reflow.prototype.setIncludeImages = function(b) {
        d(arguments.length, 1, "setIncludeImages", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("Reflow.setIncludeImages", {
            self: this.id,
            include: b
        })
    };
    a.Reflow.prototype.setHTMLOutputTextMarkup = function(b) {
        d(arguments.length, 1, "setHTMLOutputTextMarkup", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("Reflow.setHTMLOutputTextMarkup", {
            self: this.id,
            include: b
        })
    };
    a.Reflow.prototype.setMessageWhenNoReflowContent = function(b) {
        d(arguments.length,
            1, "setMessageWhenNoReflowContent", "(string)", [
                [b, "string"]
            ]);
        return a.sendWithPromise("Reflow.setMessageWhenNoReflowContent", {
            self: this.id,
            content: b
        })
    };
    a.Reflow.prototype.setMessageWhenReflowFailed = function(b) {
        d(arguments.length, 1, "setMessageWhenReflowFailed", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("Reflow.setMessageWhenReflowFailed", {
            self: this.id,
            content: b
        })
    };
    a.Reflow.prototype.setHideBackgroundImages = function(b) {
        d(arguments.length, 1, "setHideBackgroundImages", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("Reflow.setHideBackgroundImages", {
            self: this.id,
            hide_background_images: b
        })
    };
    a.Reflow.prototype.setHideImagesUnderText = function(b) {
        d(arguments.length, 1, "setHideImagesUnderText", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("Reflow.setHideImagesUnderText", {
            self: this.id,
            hide_images_under_text: b
        })
    };
    a.Reflow.prototype.setHideImagesUnderInvisibleText = function(b) {
        d(arguments.length, 1, "setHideImagesUnderInvisibleText", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("Reflow.setHideImagesUnderInvisibleText", {
            self: this.id,
            hide_images_under_invisible_text: b
        })
    };
    a.Reflow.prototype.setDoNotReflowTextOverImages = function(b) {
        d(arguments.length, 1, "setDoNotReflowTextOverImages", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("Reflow.setDoNotReflowTextOverImages", {
            self: this.id,
            do_not_reflow_text_over_images: b
        })
    };
    a.Reflow.prototype.setFontOverrideName = function(b) {
        d(arguments.length, 1, "setFontOverrideName", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("Reflow.setFontOverrideName", {
            self: this.id,
            font_family: b
        })
    };
    a.Reflow.prototype.setCustomStyles = function(b) {
        d(arguments.length, 1, "setCustomStyles", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("Reflow.setCustomStyles", {
            self: this.id,
            styles: b
        })
    };
    a.Reflow.prototype.setIncludeBBoxForRecognizedZones = function(b) {
        d(arguments.length, 1, "setIncludeBBoxForRecognizedZones", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("Reflow.setIncludeBBoxForRecognizedZones", {
            self: this.id,
            include: b
        })
    };
    a.DocumentConversion.prototype.tryConvert = function() {
        return a.sendWithPromise("DocumentConversion.tryConvert", {
            self: this.id
        })
    };
    a.DocumentConversion.prototype.convert = function() {
        return a.sendWithPromise("DocumentConversion.convert", {
            self: this.id
        })
    };
    a.DocumentConversion.prototype.convertNextPage = function() {
        return a.sendWithPromise("DocumentConversion.convertNextPage", {
            self: this.id
        })
    };
    a.DocumentConversion.prototype.getDoc = function() {
        return a.sendWithPromise("DocumentConversion.getDoc", {
            self: this.id
        }).then(function(b) {
            return l(a.PDFDoc, b)
        })
    };
    a.DocumentConversion.prototype.getConversionStatus = function() {
        return a.sendWithPromise("DocumentConversion.getConversionStatus", {
            self: this.id
        })
    };
    a.DocumentConversion.prototype.cancelConversion = function() {
        return a.sendWithPromise("DocumentConversion.cancelConversion", {
            self: this.id
        })
    };
    a.DocumentConversion.prototype.isCancelled = function() {
        return a.sendWithPromise("DocumentConversion.isCancelled", {
            self: this.id
        })
    };
    a.DocumentConversion.prototype.hasProgressTracking = function() {
        return a.sendWithPromise("DocumentConversion.hasProgressTracking", {
            self: this.id
        })
    };
    a.DocumentConversion.prototype.getProgress = function() {
        return a.sendWithPromise("DocumentConversion.getProgress", {
            self: this.id
        })
    };
    a.DocumentConversion.prototype.getProgressLabel = function() {
        return a.sendWithPromise("DocumentConversion.getProgressLabel", {
            self: this.id
        })
    };
    a.DocumentConversion.prototype.getNumConvertedPages = function() {
        return a.sendWithPromise("DocumentConversion.getNumConvertedPages", {
            self: this.id
        })
    };
    a.DocumentConversion.prototype.getErrorString = function() {
        return a.sendWithPromise("DocumentConversion.getErrorString", {
            self: this.id
        })
    };
    a.DocumentConversion.prototype.getNumWarnings = function() {
        return a.sendWithPromise("DocumentConversion.getNumWarnings", {
            self: this.id
        })
    };
    a.DocumentConversion.prototype.getWarningString = function(b) {
        d(arguments.length, 1, "getWarningString", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("DocumentConversion.getWarningString", {
            self: this.id,
            index: b
        })
    };
    a.TemplateDocument.prototype.fillTemplateJson = function(b) {
        d(arguments.length, 1, "fillTemplateJson", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("TemplateDocument.fillTemplateJson", {
            self: this.id,
            json: b
        }).then(function(b) {
            return l(a.PDFDoc, b)
        })
    };
    a.TemplateDocument.prototype.getTemplateKeysJson =
        function() {
            return a.sendWithPromise("TemplateDocument.getTemplateKeysJson", {
                self: this.id
            })
        };
    a.TemplateDocument.prototype.getErrorString = function() {
        return a.sendWithPromise("TemplateDocument.getErrorString", {
            self: this.id
        })
    };
    a.TemplateDocument.prototype.getConversionStatus = function() {
        return a.sendWithPromise("TemplateDocument.getConversionStatus", {
            self: this.id
        })
    };
    a.TemplateDocument.prototype.cancelConversion = function() {
        return a.sendWithPromise("TemplateDocument.cancelConversion", {
            self: this.id
        })
    };
    a.TemplateDocument.prototype.isCancelled =
        function() {
            return a.sendWithPromise("TemplateDocument.isCancelled", {
                self: this.id
            })
        };
    a.TemplateDocument.prototype.getNumWarnings = function() {
        return a.sendWithPromise("TemplateDocument.getNumWarnings", {
            self: this.id
        })
    };
    a.TemplateDocument.prototype.getWarningString = function(b) {
        d(arguments.length, 1, "getWarningString", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("TemplateDocument.getWarningString", {
            self: this.id,
            index: b
        })
    };
    a.Convert.fromXps = function(b, c) {
        d(arguments.length, 2, "fromXps", "(PDFNet.PDFDoc, string)",
            [
                [b, "PDFDoc"],
                [c, "string"]
            ]);
        return a.sendWithPromise("convertFromXps", {
            in_pdfdoc: b.id,
            in_filename: c
        })
    };
    a.Convert.fromXpsMem = function(b, c) {
        d(arguments.length, 2, "fromXpsMem", "(PDFNet.PDFDoc, ArrayBuffer|TypedArray)", [
            [b, "PDFDoc"],
            [c, "ArrayBuffer"]
        ]);
        var e = u(c, !1);
        return a.sendWithPromise("convertFromXpsMem", {
            in_pdfdoc: b.id,
            buf: e
        })
    };
    a.Convert.createReflow = function(b, c) {
        d(arguments.length, 2, "createReflow", "(PDFNet.Page, string)", [
            [b, "Object", a.Page, "Page"],
            [c, "string"]
        ]);
        return a.sendWithPromise("convertCreateReflow", {
            in_page: b.id,
            json_zones: c
        }).then(function(b) {
            return l(a.Reflow, b)
        })
    };
    a.Convert.fromEmf = function(b, c) {
        d(arguments.length, 2, "fromEmf", "(PDFNet.PDFDoc, string)", [
            [b, "PDFDoc"],
            [c, "string"]
        ]);
        return a.sendWithPromise("convertFromEmf", {
            in_pdfdoc: b.id,
            in_filename: c
        })
    };
    a.Convert.pageToEmf = function(b, c) {
        d(arguments.length, 2, "pageToEmf", "(PDFNet.Page, string)", [
            [b, "Object", a.Page, "Page"],
            [c, "string"]
        ]);
        return a.sendWithPromise("convertPageToEmf", {
            in_page: b.id,
            in_filename: c
        })
    };
    a.Convert.docToEmf = function(b,
        c) {
        d(arguments.length, 2, "docToEmf", "(PDFNet.PDFDoc, string)", [
            [b, "PDFDoc"],
            [c, "string"]
        ]);
        return a.sendWithPromise("convertDocToEmf", {
            in_pdfdoc: b.id,
            in_filename: c
        })
    };
    a.Convert.fromText = function(b, c, e) {
        "undefined" === typeof e && (e = new a.Obj("0"));
        d(arguments.length, 2, "fromText", "(PDFNet.PDFDoc, string, PDFNet.Obj)", [
            [b, "PDFDoc"],
            [c, "string"],
            [e, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("convertFromText", {
            in_pdfdoc: b.id,
            in_filename: c,
            options: e.id
        })
    };
    a.Convert.fromTextWithBuffer = function(b, c, e) {
        "undefined" ===
        typeof e && (e = new a.Obj("0"));
        d(arguments.length, 2, "fromTextWithBuffer", "(PDFNet.PDFDoc, ArrayBuffer|TypedArray, PDFNet.Obj)", [
            [b, "PDFDoc"],
            [c, "ArrayBuffer"],
            [e, "Object", a.Obj, "Obj"]
        ]);
        c = u(c, !1);
        return a.sendWithPromise("convertFromTextWithBuffer", {
            in_pdfdoc: b.id,
            in_filename: c,
            options: e.id
        })
    };
    a.Convert.pageToSvg = function(b, c) {
        d(arguments.length, 2, "pageToSvg", "(PDFNet.Page, string)", [
            [b, "Object", a.Page, "Page"],
            [c, "string"]
        ]);
        return a.sendWithPromise("convertPageToSvg", {
            in_page: b.id,
            output_filename: c
        })
    };
    a.Convert.pageToSvgWithOptions = function(b, c, e) {
        "undefined" === typeof e && (e = new a.Obj("0"));
        d(arguments.length, 2, "pageToSvgWithOptions", "(PDFNet.Page, string, PDFNet.Obj)", [
            [b, "Object", a.Page, "Page"],
            [c, "string"],
            [e, "OptionObject", a.Obj, "Obj", "PDFNet.Convert.SVGOutputOptions"]
        ]);
        if ("PDFNet.Convert.SVGOutputOptions" === e.name) {
            var m = e;
            e = a.ObjSet.create().then(function(a) {
                return a.createFromJson(JSON.stringify(m))
            })
        } else e = Promise.resolve(e);
        return e.then(function(e) {
            return a.sendWithPromise("convertPageToSvgWithOptions", {
                in_page: b.id,
                output_filename: c,
                options: e.id
            })
        })
    };
    a.Convert.docToSvg = function(b, c) {
        d(arguments.length, 2, "docToSvg", "(PDFNet.PDFDoc, string)", [
            [b, "PDFDoc"],
            [c, "string"]
        ]);
        return a.sendWithPromise("convertDocToSvg", {
            in_pdfdoc: b.id,
            in_filename: c
        })
    };
    a.Convert.docToSvgWithOptions = function(b, c, e) {
        "undefined" === typeof e && (e = new a.Obj("0"));
        d(arguments.length, 2, "docToSvgWithOptions", "(PDFNet.PDFDoc, string, PDFNet.Obj)", [
            [b, "PDFDoc"],
            [c, "string"],
            [e, "OptionObject", a.Obj, "Obj", "PDFNet.Convert.SVGOutputOptions"]
        ]);
        if ("PDFNet.Convert.SVGOutputOptions" === e.name) {
            var m = e;
            e = a.ObjSet.create().then(function(a) {
                return a.createFromJson(JSON.stringify(m))
            })
        } else e = Promise.resolve(e);
        return e.then(function(e) {
            return a.sendWithPromise("convertDocToSvgWithOptions", {
                in_pdfdoc: b.id,
                in_filename: c,
                options: e.id
            })
        })
    };
    a.Convert.toXps = function(b, c, e) {
        "undefined" === typeof e && (e = new a.Obj("0"));
        d(arguments.length, 2, "toXps", "(PDFNet.PDFDoc, string, PDFNet.Obj)", [
            [b, "PDFDoc"],
            [c, "string"],
            [e, "OptionObject", a.Obj, "Obj", "PDFNet.Convert.XPSOutputOptions"]
        ]);
        if ("PDFNet.Convert.XPSOutputOptions" === e.name) {
            var m = e;
            e = a.ObjSet.create().then(function(a) {
                return a.createFromJson(JSON.stringify(m))
            })
        } else e = Promise.resolve(e);
        return e.then(function(e) {
            return a.sendWithPromise("convertToXps", {
                in_pdfdoc: b.id,
                output_filename: c,
                options: e.id
            })
        })
    };
    a.Convert.toXpsBuffer = function(b, c) {
        "undefined" === typeof c && (c = new a.Obj("0"));
        d(arguments.length, 1, "toXpsBuffer", "(PDFNet.PDFDoc, PDFNet.Obj)", [
            [b, "PDFDoc"],
            [c, "OptionObject", a.Obj, "Obj", "PDFNet.Convert.XPSOutputOptions"]
        ]);
        if ("PDFNet.Convert.XPSOutputOptions" === c.name) {
            var e = c;
            c = a.ObjSet.create().then(function(a) {
                return a.createFromJson(JSON.stringify(e))
            })
        } else c = Promise.resolve(c);
        return c.then(function(c) {
            return a.sendWithPromise("convertToXpsBuffer", {
                in_pdfdoc: b.id,
                options: c.id
            }).then(function(a) {
                return new Uint8Array(a)
            })
        })
    };
    a.Convert.fileToXps = function(b, c, e) {
        "undefined" === typeof e && (e = new a.Obj("0"));
        d(arguments.length, 2, "fileToXps", "(string, string, PDFNet.Obj)", [
            [b, "string"],
            [c, "string"],
            [e, "OptionObject",
                a.Obj, "Obj", "PDFNet.Convert.XPSOutputOptions"
            ]
        ]);
        if ("PDFNet.Convert.XPSOutputOptions" === e.name) {
            var m = e;
            e = a.ObjSet.create().then(function(a) {
                return a.createFromJson(JSON.stringify(m))
            })
        } else e = Promise.resolve(e);
        return e.then(function(e) {
            return a.sendWithPromise("convertFileToXps", {
                in_inputFilename: b,
                in_outputFilename: c,
                options: e.id
            })
        })
    };
    a.Convert.fileToXpsWithBuffer = function(b, c, e) {
        "undefined" === typeof e && (e = new a.Obj("0"));
        d(arguments.length, 2, "fileToXpsWithBuffer", "(ArrayBuffer|TypedArray, string, PDFNet.Obj)",
            [
                [b, "ArrayBuffer"],
                [c, "string"],
                [e, "OptionObject", a.Obj, "Obj", "PDFNet.Convert.XPSOutputOptions"]
            ]);
        c.startsWith(".") || (c = "." + c);
        b = u(b, !1);
        if ("PDFNet.Convert.XPSOutputOptions" === e.name) {
            var m = e;
            e = a.ObjSet.create().then(function(a) {
                return a.createFromJson(JSON.stringify(m))
            })
        } else e = Promise.resolve(e);
        return e.then(function(e) {
            return a.sendWithPromise("convertFileToXpsWithBuffer", {
                in_inputFilename: b,
                in_inputFilename_extension: c,
                options: e.id
            }).then(function(a) {
                return new Uint8Array(a)
            })
        })
    };
    a.Convert.fileToXod =
        function(b, c, e) {
            "undefined" === typeof e && (e = new a.Obj("0"));
            d(arguments.length, 2, "fileToXod", "(string, string, PDFNet.Obj)", [
                [b, "string"],
                [c, "string"],
                [e, "OptionObject", a.Obj, "Obj", "PDFNet.Convert.XODOutputOptions"]
            ]);
            if ("PDFNet.Convert.XODOutputOptions" === e.name) {
                var m = e;
                e = a.ObjSet.create().then(function(a) {
                    return a.createFromJson(JSON.stringify(m))
                })
            } else e = Promise.resolve(e);
            return e.then(function(e) {
                return a.sendWithPromise("convertFileToXod", {
                    in_filename: b,
                    output_filename: c,
                    options: e.id
                })
            })
        };
    a.Convert.fileToXodWithBuffer = function(b, c, e) {
        "undefined" === typeof e && (e = new a.Obj("0"));
        d(arguments.length, 2, "fileToXodWithBuffer", "(ArrayBuffer|TypedArray, string, PDFNet.Obj)", [
            [b, "ArrayBuffer"],
            [c, "string"],
            [e, "OptionObject", a.Obj, "Obj", "PDFNet.Convert.XODOutputOptions"]
        ]);
        c.startsWith(".") || (c = "." + c);
        b = u(b, !1);
        if ("PDFNet.Convert.XODOutputOptions" === e.name) {
            var m = e;
            e = a.ObjSet.create().then(function(a) {
                return a.createFromJson(JSON.stringify(m))
            })
        } else e = Promise.resolve(e);
        return e.then(function(e) {
            return a.sendWithPromise("convertFileToXodWithBuffer", {
                in_filename: b,
                in_filename_extension: c,
                options: e.id
            }).then(function(a) {
                return new Uint8Array(a)
            })
        })
    };
    a.Convert.toXod = function(b, c, e) {
        "undefined" === typeof e && (e = new a.Obj("0"));
        d(arguments.length, 2, "toXod", "(PDFNet.PDFDoc, string, PDFNet.Obj)", [
            [b, "PDFDoc"],
            [c, "string"],
            [e, "OptionObject", a.Obj, "Obj", "PDFNet.Convert.XODOutputOptions"]
        ]);
        if ("PDFNet.Convert.XODOutputOptions" === e.name) {
            var m = e;
            e = a.ObjSet.create().then(function(a) {
                return a.createFromJson(JSON.stringify(m))
            })
        } else e = Promise.resolve(e);
        return e.then(function(e) {
            return a.sendWithPromise("convertToXod", {
                in_pdfdoc: b.id,
                output_filename: c,
                options: e.id
            })
        })
    };
    a.Convert.toXodBuffer = function(b, c) {
        "undefined" === typeof c && (c = new a.Obj("0"));
        d(arguments.length, 1, "toXodBuffer", "(PDFNet.PDFDoc, PDFNet.Obj)", [
            [b, "PDFDoc"],
            [c, "OptionObject", a.Obj, "Obj", "PDFNet.Convert.XODOutputOptions"]
        ]);
        if ("PDFNet.Convert.XODOutputOptions" === c.name) {
            var e = c;
            c = a.ObjSet.create().then(function(a) {
                return a.createFromJson(JSON.stringify(e))
            })
        } else c = Promise.resolve(c);
        return c.then(function(c) {
            return a.sendWithPromise("convertToXodBuffer", {
                in_pdfdoc: b.id,
                options: c.id
            }).then(function(a) {
                return new Uint8Array(a)
            })
        })
    };
    a.Convert.fileToXodStream = function(b, c) {
        "undefined" === typeof c && (c = new a.Obj("0"));
        d(arguments.length, 1, "fileToXodStream", "(string, PDFNet.Obj)", [
            [b, "string"],
            [c, "OptionObject", a.Obj, "Obj", "PDFNet.Convert.XODOutputOptions"]
        ]);
        if ("PDFNet.Convert.XODOutputOptions" === c.name) {
            var e = c;
            c = a.ObjSet.create().then(function(a) {
                return a.createFromJson(JSON.stringify(e))
            })
        } else c = Promise.resolve(c);
        return c.then(function(c) {
            return a.sendWithPromise("convertFileToXodStream", {
                in_filename: b,
                options: c.id
            }).then(function(b) {
                return l(a.Filter, b)
            })
        })
    };
    a.Convert.toXodStream = function(b, c) {
        "undefined" === typeof c && (c = new a.Obj("0"));
        d(arguments.length, 1, "toXodStream", "(PDFNet.PDFDoc, PDFNet.Obj)", [
            [b, "PDFDoc"],
            [c, "OptionObject", a.Obj, "Obj", "PDFNet.Convert.XODOutputOptions"]
        ]);
        if ("PDFNet.Convert.XODOutputOptions" === c.name) {
            var e = c;
            c = a.ObjSet.create().then(function(a) {
                return a.createFromJson(JSON.stringify(e))
            })
        } else c = Promise.resolve(c);
        return c.then(function(c) {
            return a.sendWithPromise("convertToXodStream", {
                in_pdfdoc: b.id,
                options: c.id
            }).then(function(b) {
                return l(a.Filter, b)
            })
        })
    };
    a.ConversionMonitor.prototype.next = function() {
        return a.sendWithPromise("ConversionMonitor.next", {
            conversionMonitor: this.id
        })
    };
    a.ConversionMonitor.prototype.ready = function() {
        return a.sendWithPromise("ConversionMonitor.ready", {
            conversionMonitor: this.id
        })
    };
    a.ConversionMonitor.prototype.progress = function() {
        return a.sendWithPromise("ConversionMonitor.progress", {
            conversionMonitor: this.id
        })
    };
    a.ConversionMonitor.prototype.filter = function() {
        return a.sendWithPromise("ConversionMonitor.filter", {
            conversionMonitor: this.id
        }).then(function(b) {
            return l(a.Filter, b)
        })
    };
    a.Convert.officeToPdfWithPath = function(b, c, e) {
        "undefined" === typeof e && (e = new a.Obj("0"));
        d(arguments.length, 2, "officeToPdfWithPath", "(PDFNet.PDFDoc, string, PDFNet.Obj)", [
            [b, "PDFDoc"],
            [c, "string"],
            [e, "OptionObject", a.Obj, "Obj", "PDFNet.Convert.ConversionOptions"]
        ]);
        if ("PDFNet.Convert.ConversionOptions" === e.name) {
            var m = e;
            e = a.ObjSet.create().then(function(a) {
                return a.createFromJson(JSON.stringify(m))
            })
        } else e = Promise.resolve(e);
        return e.then(function(e) {
            return a.sendWithPromise("convertOfficeToPdfWithPath", {
                in_pdfdoc: b.id,
                in_filename: c,
                options: e.id
            })
        })
    };
    a.Convert.streamingPdfConversionWithPath = function(b, c) {
        "undefined" === typeof c && (c = new a.Obj("0"));
        d(arguments.length, 1, "streamingPdfConversionWithPath", "(string, PDFNet.Obj)", [
            [b, "string"],
            [c, "OptionObject", a.Obj, "Obj", "PDFNet.Convert.ConversionOptions"]
        ]);
        if ("PDFNet.Convert.ConversionOptions" === c.name) {
            var e = c;
            c = a.ObjSet.create().then(function(a) {
                return a.createFromJson(JSON.stringify(e))
            })
        } else c = Promise.resolve(c);
        return c.then(function(c) {
            return a.sendWithPromise("convertStreamingPdfConversionWithPath", {
                in_filename: b,
                options: c.id
            }).then(function(b) {
                return l(a.DocumentConversion, b)
            })
        })
    };
    a.Convert.streamingPdfConversionWithPdfAndPath = function(b, c, e) {
        "undefined" === typeof e && (e = new a.Obj("0"));
        d(arguments.length, 2, "streamingPdfConversionWithPdfAndPath", "(PDFNet.PDFDoc, string, PDFNet.Obj)", [
            [b, "PDFDoc"],
            [c, "string"],
            [e, "OptionObject", a.Obj, "Obj", "PDFNet.Convert.ConversionOptions"]
        ]);
        if ("PDFNet.Convert.ConversionOptions" === e.name) {
            var m = e;
            e = a.ObjSet.create().then(function(a) {
                return a.createFromJson(JSON.stringify(m))
            })
        } else e =
            Promise.resolve(e);
        return e.then(function(e) {
            return a.sendWithPromise("convertStreamingPdfConversionWithPdfAndPath", {
                in_pdfdoc: b.id,
                in_filename: c,
                options: e.id
            }).then(function(b) {
                return l(a.DocumentConversion, b)
            })
        })
    };
    a.Convert.officeToPdfWithFilter = function(b, c, e) {
        "undefined" === typeof e && (e = new a.Obj("0"));
        d(arguments.length, 2, "officeToPdfWithFilter", "(PDFNet.PDFDoc, PDFNet.Filter, PDFNet.Obj)", [
            [b, "PDFDoc"],
            [c, "Object", a.Filter, "Filter"],
            [e, "OptionObject", a.Obj, "Obj", "PDFNet.Convert.ConversionOptions"]
        ]);
        0 != c.id && t(c.id);
        if ("PDFNet.Convert.ConversionOptions" === e.name) {
            var m = e;
            e = a.ObjSet.create().then(function(a) {
                return a.createFromJson(JSON.stringify(m))
            })
        } else e = Promise.resolve(e);
        return e.then(function(e) {
            return a.sendWithPromise("convertOfficeToPdfWithFilter", {
                in_pdfdoc: b.id,
                no_own_in_stream: c.id,
                options: e.id
            })
        })
    };
    a.Convert.streamingPdfConversionWithFilter = function(b, c) {
        "undefined" === typeof c && (c = new a.Obj("0"));
        d(arguments.length, 1, "streamingPdfConversionWithFilter", "(PDFNet.Filter, PDFNet.Obj)",
            [
                [b, "Object", a.Filter, "Filter"],
                [c, "OptionObject", a.Obj, "Obj", "PDFNet.Convert.ConversionOptions"]
            ]);
        if ("PDFNet.Convert.ConversionOptions" === c.name) {
            var e = c;
            c = a.ObjSet.create().then(function(a) {
                return a.createFromJson(JSON.stringify(e))
            })
        } else c = Promise.resolve(c);
        return c.then(function(c) {
            return a.sendWithPromise("convertStreamingPdfConversionWithFilter", {
                in_stream: b.id,
                options: c.id
            }).then(function(b) {
                return l(a.DocumentConversion, b)
            })
        })
    };
    a.Convert.streamingPdfConversionWithPdfAndFilter = function(b,
        c, e) {
        "undefined" === typeof e && (e = new a.Obj("0"));
        d(arguments.length, 2, "streamingPdfConversionWithPdfAndFilter", "(PDFNet.PDFDoc, PDFNet.Filter, PDFNet.Obj)", [
            [b, "PDFDoc"],
            [c, "Object", a.Filter, "Filter"],
            [e, "OptionObject", a.Obj, "Obj", "PDFNet.Convert.ConversionOptions"]
        ]);
        if ("PDFNet.Convert.ConversionOptions" === e.name) {
            var m = e;
            e = a.ObjSet.create().then(function(a) {
                return a.createFromJson(JSON.stringify(m))
            })
        } else e = Promise.resolve(e);
        return e.then(function(e) {
            return a.sendWithPromise("convertStreamingPdfConversionWithPdfAndFilter", {
                in_pdfdoc: b.id,
                in_stream: c.id,
                options: e.id
            }).then(function(b) {
                return l(a.DocumentConversion, b)
            })
        })
    };
    a.Convert.createOfficeTemplateWithPath = function(b, c) {
        "undefined" === typeof c && (c = new a.Obj("0"));
        d(arguments.length, 1, "createOfficeTemplateWithPath", "(string, PDFNet.Obj)", [
            [b, "string"],
            [c, "OptionObject", a.Obj, "Obj", "PDFNet.Convert.ConversionOptions"]
        ]);
        if ("PDFNet.Convert.ConversionOptions" === c.name) {
            var e = c;
            c = a.ObjSet.create().then(function(a) {
                return a.createFromJson(JSON.stringify(e))
            })
        } else c = Promise.resolve(c);
        return c.then(function(c) {
            return a.sendWithPromise("convertCreateOfficeTemplateWithPath", {
                in_filename: b,
                options: c.id
            }).then(function(b) {
                return l(a.TemplateDocument, b)
            })
        })
    };
    a.Convert.createOfficeTemplateWithFilter = function(b, c) {
        "undefined" === typeof c && (c = new a.Obj("0"));
        d(arguments.length, 1, "createOfficeTemplateWithFilter", "(PDFNet.Filter, PDFNet.Obj)", [
            [b, "Object", a.Filter, "Filter"],
            [c, "OptionObject", a.Obj, "Obj", "PDFNet.Convert.ConversionOptions"]
        ]);
        if ("PDFNet.Convert.ConversionOptions" === c.name) {
            var e =
                c;
            c = a.ObjSet.create().then(function(a) {
                return a.createFromJson(JSON.stringify(e))
            })
        } else c = Promise.resolve(c);
        return c.then(function(c) {
            return a.sendWithPromise("convertCreateOfficeTemplateWithFilter", {
                in_stream: b.id,
                options: c.id
            }).then(function(b) {
                return l(a.TemplateDocument, b)
            })
        })
    };
    a.Convert.toPdf = function(b, c) {
        d(arguments.length, 2, "toPdf", "(PDFNet.PDFDoc, string)", [
            [b, "PDFDoc"],
            [c, "string"]
        ]);
        return a.sendWithPromise("convertToPdf", {
            in_pdfdoc: b.id,
            in_filename: c
        })
    };
    a.Convert.toPdfWithBuffer = function(b,
        c, e) {
        d(arguments.length, 3, "toPdfWithBuffer", "(PDFNet.PDFDoc, ArrayBuffer|TypedArray, string)", [
            [b, "PDFDoc"],
            [c, "ArrayBuffer"],
            [e, "string"]
        ]);
        e.startsWith(".") || (e = "." + e);
        c = u(c, !1);
        return a.sendWithPromise("convertToPdfWithBuffer", {
            in_pdfdoc: b.id,
            in_filename: c,
            in_filename_extension: e
        })
    };
    a.Convert.fromCAD = function(b, c, e) {
        "undefined" === typeof e && (e = new a.Obj("0"));
        d(arguments.length, 2, "fromCAD", "(PDFNet.PDFDoc, string, PDFNet.Obj)", [
            [b, "PDFDoc"],
            [c, "string"],
            [e, "OptionObject", a.Obj, "Obj", "PDFNet.Convert.CADConvertOptions"]
        ]);
        if ("PDFNet.Convert.CADConvertOptions" === e.name) {
            var m = e;
            e = a.ObjSet.create().then(function(a) {
                return a.createFromJson(JSON.stringify(m))
            })
        } else e = Promise.resolve(e);
        return e.then(function(e) {
            return a.sendWithPromise("convertFromCAD", {
                in_pdfdoc: b.id,
                in_filename: c,
                opts: e.id
            })
        })
    };
    a.Convert.fromDICOM = function(b, c, e) {
        "undefined" === typeof e && (e = new a.Obj("0"));
        d(arguments.length, 2, "fromDICOM", "(PDFNet.PDFDoc, string, PDFNet.Obj)", [
            [b, "PDFDoc"],
            [c, "string"],
            [e, "OptionObject", a.Obj, "Obj", "PDFNet.Convert.AdvancedImagingConvertOptions"]
        ]);
        if ("PDFNet.Convert.AdvancedImagingConvertOptions" === e.name) {
            var m = e;
            e = a.ObjSet.create().then(function(a) {
                return a.createFromJson(JSON.stringify(m))
            })
        } else e = Promise.resolve(e);
        return e.then(function(e) {
            return a.sendWithPromise("convertFromDICOM", {
                in_pdfdoc: b.id,
                in_filename: c,
                opts: e.id
            })
        })
    };
    a.Convert.fromTiff = function(b, c) {
        d(arguments.length, 2, "fromTiff", "(PDFNet.PDFDoc, PDFNet.Filter)", [
            [b, "PDFDoc"],
            [c, "Object", a.Filter, "Filter"]
        ]);
        return a.sendWithPromise("convertFromTiff", {
            in_pdfdoc: b.id,
            in_data: c.id
        })
    };
    a.Convert.requiresPrinter = function(b) {
        d(arguments.length, 1, "requiresPrinter", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("convertRequiresPrinter", {
            in_filename: b
        })
    };
    a.Convert.printerInstall = function(b) {
        "undefined" === typeof b && (b = "PDFTron PDFNet");
        d(arguments.length, 0, "printerInstall", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("convertPrinterInstall", {
            in_printerName: b
        })
    };
    a.Convert.printerUninstall = function() {
        return a.sendWithPromise("convertPrinterUninstall", {})
    };
    a.Convert.printerGetPrinterName =
        function() {
            return a.sendWithPromise("convertPrinterGetPrinterName", {})
        };
    a.Convert.printerSetPrinterName = function(b) {
        "undefined" === typeof b && (b = "PDFTron PDFNet");
        d(arguments.length, 0, "printerSetPrinterName", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("convertPrinterSetPrinterName", {
            in_printerName: b
        })
    };
    a.Convert.printerIsInstalled = function(b) {
        "undefined" === typeof b && (b = "PDFTron PDFNet");
        d(arguments.length, 0, "printerIsInstalled", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("convertPrinterIsInstalled", {
            in_printerName: b
        })
    };
    a.Convert.printerSetMode = function(b) {
        d(arguments.length, 1, "printerSetMode", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("convertPrinterSetMode", {
            print_mode: b
        })
    };
    a.Convert.printerGetMode = function() {
        return a.sendWithPromise("convertPrinterGetMode", {})
    };
    a.Convert.pageToHtml = function(b) {
        d(arguments.length, 1, "pageToHtml", "(PDFNet.Page)", [
            [b, "Object", a.Page, "Page"]
        ]);
        return a.sendWithPromise("convertPageToHtml", {
            page: b.id
        })
    };
    a.Convert.pageToHtmlZoned = function(b, c) {
        d(arguments.length,
            2, "pageToHtmlZoned", "(PDFNet.Page, string)", [
                [b, "Object", a.Page, "Page"],
                [c, "string"]
            ]);
        return a.sendWithPromise("convertPageToHtmlZoned", {
            page: b.id,
            json_zones: c
        })
    };
    a.Convert.fileToHtml = function(b, c, e) {
        "undefined" === typeof e && (e = new a.Obj("0"));
        d(arguments.length, 2, "fileToHtml", "(string, string, PDFNet.Obj)", [
            [b, "string"],
            [c, "string"],
            [e, "OptionObject", a.Obj, "Obj", "PDFNet.Convert.HTMLOutputOptions"]
        ]);
        if ("PDFNet.Convert.HTMLOutputOptions" === e.name) {
            var m = e;
            e = a.ObjSet.create().then(function(a) {
                return a.createFromJson(JSON.stringify(m))
            })
        } else e =
            Promise.resolve(e);
        return e.then(function(e) {
            return a.sendWithPromise("convertFileToHtml", {
                in_filename: b,
                output_path: c,
                options: e.id
            })
        })
    };
    a.Convert.toHtml = function(b, c, e) {
        "undefined" === typeof e && (e = new a.Obj("0"));
        d(arguments.length, 2, "toHtml", "(PDFNet.PDFDoc, string, PDFNet.Obj)", [
            [b, "PDFDoc"],
            [c, "string"],
            [e, "OptionObject", a.Obj, "Obj", "PDFNet.Convert.HTMLOutputOptions"]
        ]);
        if ("PDFNet.Convert.HTMLOutputOptions" === e.name) {
            var m = e;
            e = a.ObjSet.create().then(function(a) {
                return a.createFromJson(JSON.stringify(m))
            })
        } else e =
            Promise.resolve(e);
        return e.then(function(e) {
            return a.sendWithPromise("convertToHtml", {
                in_pdfdoc: b.id,
                output_path: c,
                options: e.id
            })
        })
    };
    a.Convert.fileToWord = function(b, c, e) {
        "undefined" === typeof e && (e = new a.Obj("0"));
        d(arguments.length, 2, "fileToWord", "(string, string, PDFNet.Obj)", [
            [b, "string"],
            [c, "string"],
            [e, "OptionObject", a.Obj, "Obj", "PDFNet.Convert.WordOutputOptions"]
        ]);
        if ("PDFNet.Convert.WordOutputOptions" === e.name) {
            var m = e;
            e = a.ObjSet.create().then(function(a) {
                return a.createFromJson(JSON.stringify(m))
            })
        } else e =
            Promise.resolve(e);
        return e.then(function(e) {
            return a.sendWithPromise("convertFileToWord", {
                in_filename: b,
                output_path: c,
                options: e.id
            })
        })
    };
    a.Convert.toWord = function(b, c, e) {
        "undefined" === typeof e && (e = new a.Obj("0"));
        d(arguments.length, 2, "toWord", "(PDFNet.PDFDoc, string, PDFNet.Obj)", [
            [b, "PDFDoc"],
            [c, "string"],
            [e, "OptionObject", a.Obj, "Obj", "PDFNet.Convert.WordOutputOptions"]
        ]);
        if ("PDFNet.Convert.WordOutputOptions" === e.name) {
            var m = e;
            e = a.ObjSet.create().then(function(a) {
                return a.createFromJson(JSON.stringify(m))
            })
        } else e =
            Promise.resolve(e);
        return e.then(function(e) {
            return a.sendWithPromise("convertToWord", {
                in_pdfdoc: b.id,
                output_path: c,
                options: e.id
            })
        })
    };
    a.Convert.fileToExcel = function(b, c, e) {
        "undefined" === typeof e && (e = new a.Obj("0"));
        d(arguments.length, 2, "fileToExcel", "(string, string, PDFNet.Obj)", [
            [b, "string"],
            [c, "string"],
            [e, "OptionObject", a.Obj, "Obj", "PDFNet.Convert.ExcelOutputOptions"]
        ]);
        if ("PDFNet.Convert.ExcelOutputOptions" === e.name) {
            var m = e;
            e = a.ObjSet.create().then(function(a) {
                return a.createFromJson(JSON.stringify(m))
            })
        } else e =
            Promise.resolve(e);
        return e.then(function(e) {
            return a.sendWithPromise("convertFileToExcel", {
                in_filename: b,
                output_path: c,
                options: e.id
            })
        })
    };
    a.Convert.toExcel = function(b, c, e) {
        "undefined" === typeof e && (e = new a.Obj("0"));
        d(arguments.length, 2, "toExcel", "(PDFNet.PDFDoc, string, PDFNet.Obj)", [
            [b, "PDFDoc"],
            [c, "string"],
            [e, "OptionObject", a.Obj, "Obj", "PDFNet.Convert.ExcelOutputOptions"]
        ]);
        if ("PDFNet.Convert.ExcelOutputOptions" === e.name) {
            var m = e;
            e = a.ObjSet.create().then(function(a) {
                return a.createFromJson(JSON.stringify(m))
            })
        } else e =
            Promise.resolve(e);
        return e.then(function(e) {
            return a.sendWithPromise("convertToExcel", {
                in_pdfdoc: b.id,
                output_path: c,
                options: e.id
            })
        })
    };
    a.Convert.fileToPowerPoint = function(b, c, e) {
        "undefined" === typeof e && (e = new a.Obj("0"));
        d(arguments.length, 2, "fileToPowerPoint", "(string, string, PDFNet.Obj)", [
            [b, "string"],
            [c, "string"],
            [e, "OptionObject", a.Obj, "Obj", "PDFNet.Convert.PowerPointOutputOptions"]
        ]);
        if ("PDFNet.Convert.PowerPointOutputOptions" === e.name) {
            var m = e;
            e = a.ObjSet.create().then(function(a) {
                return a.createFromJson(JSON.stringify(m))
            })
        } else e =
            Promise.resolve(e);
        return e.then(function(e) {
            return a.sendWithPromise("convertFileToPowerPoint", {
                in_filename: b,
                output_path: c,
                options: e.id
            })
        })
    };
    a.Convert.toPowerPoint = function(b, c, e) {
        "undefined" === typeof e && (e = new a.Obj("0"));
        d(arguments.length, 2, "toPowerPoint", "(PDFNet.PDFDoc, string, PDFNet.Obj)", [
            [b, "PDFDoc"],
            [c, "string"],
            [e, "OptionObject", a.Obj, "Obj", "PDFNet.Convert.PowerPointOutputOptions"]
        ]);
        if ("PDFNet.Convert.PowerPointOutputOptions" === e.name) {
            var m = e;
            e = a.ObjSet.create().then(function(a) {
                return a.createFromJson(JSON.stringify(m))
            })
        } else e =
            Promise.resolve(e);
        return e.then(function(e) {
            return a.sendWithPromise("convertToPowerPoint", {
                in_pdfdoc: b.id,
                output_path: c,
                options: e.id
            })
        })
    };
    a.Convert.fileToEpub = function(b, c, e, m) {
        "undefined" === typeof e && (e = new a.Obj("0"));
        "undefined" === typeof m && (m = new a.Obj("0"));
        d(arguments.length, 2, "fileToEpub", "(string, string, PDFNet.Obj, PDFNet.Obj)", [
            [b, "string"],
            [c, "string"],
            [e, "OptionObject", a.Obj, "Obj", "PDFNet.Convert.HTMLOutputOptions"],
            [m, "OptionObject", a.Obj, "Obj", "PDFNet.Convert.EPUBOutputOptions"]
        ]);
        if ("PDFNet.Convert.HTMLOutputOptions" === e.name) {
            var f = e;
            e = a.ObjSet.create().then(function(a) {
                return a.createFromJson(JSON.stringify(f))
            })
        } else e = Promise.resolve(e);
        if ("PDFNet.Convert.EPUBOutputOptions" === m.name) {
            var g = m;
            m = a.ObjSet.create().then(function(a) {
                return a.createFromJson(JSON.stringify(g))
            })
        } else m = Promise.resolve(m);
        return Promise.all([e, m]).then(function(d) {
            e = d[0];
            m = d[1];
            return a.sendWithPromise("convertFileToEpub", {
                in_filename: b,
                output_path: c,
                html_options: e.id,
                epub_options: m.id
            })
        })
    };
    a.Convert.toEpub =
        function(b, c, e, m) {
            "undefined" === typeof e && (e = new a.Obj("0"));
            "undefined" === typeof m && (m = new a.Obj("0"));
            d(arguments.length, 2, "toEpub", "(PDFNet.PDFDoc, string, PDFNet.Obj, PDFNet.Obj)", [
                [b, "PDFDoc"],
                [c, "string"],
                [e, "OptionObject", a.Obj, "Obj", "PDFNet.Convert.HTMLOutputOptions"],
                [m, "OptionObject", a.Obj, "Obj", "PDFNet.Convert.EPUBOutputOptions"]
            ]);
            if ("PDFNet.Convert.HTMLOutputOptions" === e.name) {
                var f = e;
                e = a.ObjSet.create().then(function(a) {
                    return a.createFromJson(JSON.stringify(f))
                })
            } else e = Promise.resolve(e);
            if ("PDFNet.Convert.EPUBOutputOptions" === m.name) {
                var g = m;
                m = a.ObjSet.create().then(function(a) {
                    return a.createFromJson(JSON.stringify(g))
                })
            } else m = Promise.resolve(m);
            return Promise.all([e, m]).then(function(d) {
                e = d[0];
                m = d[1];
                return a.sendWithPromise("convertToEpub", {
                    in_pdfdoc: b.id,
                    output_path: c,
                    html_options: e.id,
                    epub_options: m.id
                })
            })
        };
    a.Convert.fileToTiff = function(b, c, e) {
        "undefined" === typeof e && (e = new a.Obj("0"));
        d(arguments.length, 2, "fileToTiff", "(string, string, PDFNet.Obj)", [
            [b, "string"],
            [c, "string"],
            [e, "OptionObject", a.Obj, "Obj", "PDFNet.Convert.TiffOutputOptions"]
        ]);
        if ("PDFNet.Convert.TiffOutputOptions" === e.name) {
            var m = e;
            e = a.ObjSet.create().then(function(a) {
                return a.createFromJson(JSON.stringify(m))
            })
        } else e = Promise.resolve(e);
        return e.then(function(e) {
            return a.sendWithPromise("convertFileToTiff", {
                in_filename: b,
                output_path: c,
                options: e.id
            })
        })
    };
    a.Convert.fileToTiffWithBuffer = function(b, c, e) {
        "undefined" === typeof e && (e = new a.Obj("0"));
        d(arguments.length, 2, "fileToTiffWithBuffer", "(ArrayBuffer|TypedArray, string, PDFNet.Obj)",
            [
                [b, "ArrayBuffer"],
                [c, "string"],
                [e, "OptionObject", a.Obj, "Obj", "PDFNet.Convert.TiffOutputOptions"]
            ]);
        c.startsWith(".") || (c = "." + c);
        b = u(b, !1);
        if ("PDFNet.Convert.TiffOutputOptions" === e.name) {
            var m = e;
            e = a.ObjSet.create().then(function(a) {
                return a.createFromJson(JSON.stringify(m))
            })
        } else e = Promise.resolve(e);
        return e.then(function(e) {
            return a.sendWithPromise("convertFileToTiffWithBuffer", {
                in_filename: b,
                in_filename_extension: c,
                options: e.id
            }).then(function(a) {
                return new Uint8Array(a)
            })
        })
    };
    a.Convert.toTiff =
        function(b, c, e) {
            "undefined" === typeof e && (e = new a.Obj("0"));
            d(arguments.length, 2, "toTiff", "(PDFNet.PDFDoc, string, PDFNet.Obj)", [
                [b, "PDFDoc"],
                [c, "string"],
                [e, "OptionObject", a.Obj, "Obj", "PDFNet.Convert.TiffOutputOptions"]
            ]);
            if ("PDFNet.Convert.TiffOutputOptions" === e.name) {
                var m = e;
                e = a.ObjSet.create().then(function(a) {
                    return a.createFromJson(JSON.stringify(m))
                })
            } else e = Promise.resolve(e);
            return e.then(function(e) {
                return a.sendWithPromise("convertToTiff", {
                    in_pdfdoc: b.id,
                    output_path: c,
                    options: e.id
                })
            })
        };
    a.Convert.toTiffBuffer = function(b, c) {
        "undefined" === typeof c && (c = new a.Obj("0"));
        d(arguments.length, 1, "toTiffBuffer", "(PDFNet.PDFDoc, PDFNet.Obj)", [
            [b, "PDFDoc"],
            [c, "OptionObject", a.Obj, "Obj", "PDFNet.Convert.TiffOutputOptions"]
        ]);
        if ("PDFNet.Convert.TiffOutputOptions" === c.name) {
            var e = c;
            c = a.ObjSet.create().then(function(a) {
                return a.createFromJson(JSON.stringify(e))
            })
        } else c = Promise.resolve(c);
        return c.then(function(c) {
            return a.sendWithPromise("convertToTiffBuffer", {
                in_pdfdoc: b.id,
                options: c.id
            }).then(function(a) {
                return new Uint8Array(a)
            })
        })
    };
    a.Date.init = function(b, c, e, m, f, g) {
        d(arguments.length, 6, "init", "(number, number, number, number, number, number)", [
            [b, "number"],
            [c, "number"],
            [e, "number"],
            [m, "number"],
            [f, "number"],
            [g, "number"]
        ]);
        return a.sendWithPromise("dateInit", {
            year: b,
            month: c,
            day: e,
            hour: m,
            minute: f,
            second: g
        }).then(function(b) {
            return new a.Date(b)
        })
    };
    a.Date.prototype.isValid = function() {
        k("isValid", this.yieldFunction);
        return a.sendWithPromise("Date.isValid", {
            date: this
        })
    };
    a.Date.prototype.attach = function(b) {
        d(arguments.length, 1, "attach",
            "(PDFNet.Obj)", [
                [b, "Object", a.Obj, "Obj"]
            ]);
        k("attach", this.yieldFunction);
        var c = this;
        this.yieldFunction = "Date.attach";
        return a.sendWithPromise("Date.attach", {
            date: this,
            d: b.id
        }).then(function(a) {
            c.yieldFunction = void 0;
            q(a, c)
        })
    };
    a.Date.prototype.update = function(b) {
        "undefined" === typeof b && (b = new a.Obj("__null"));
        d(arguments.length, 0, "update", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        k("update", this.yieldFunction);
        var c = this;
        this.yieldFunction = "Date.update";
        return a.sendWithPromise("Date.update", {
            date: this,
            d: b.id
        }).then(function(a) {
            c.yieldFunction = void 0;
            q(a.date, c);
            return a.result
        })
    };
    a.Date.prototype.setCurrentTime = function() {
        k("setCurrentTime", this.yieldFunction);
        var b = this;
        this.yieldFunction = "Date.setCurrentTime";
        return a.sendWithPromise("Date.setCurrentTime", {
            date: this
        }).then(function(a) {
            b.yieldFunction = void 0;
            q(a, b)
        })
    };
    a.Destination.createXYZ = function(b, c, e, m) {
        d(arguments.length, 4, "createXYZ", "(PDFNet.Page, number, number, number)", [
            [b, "Object", a.Page, "Page"],
            [c, "number"],
            [e, "number"],
            [m, "number"]
        ]);
        return a.sendWithPromise("destinationCreateXYZ", {
            page: b.id,
            left: c,
            top: e,
            zoom: m
        }).then(function(b) {
            return f(a.Destination, b)
        })
    };
    a.Destination.createFit = function(b) {
        d(arguments.length, 1, "createFit", "(PDFNet.Page)", [
            [b, "Object", a.Page, "Page"]
        ]);
        return a.sendWithPromise("destinationCreateFit", {
            page: b.id
        }).then(function(b) {
            return f(a.Destination, b)
        })
    };
    a.Destination.createFitH = function(b, c) {
        d(arguments.length, 2, "createFitH", "(PDFNet.Page, number)", [
            [b, "Object", a.Page, "Page"],
            [c, "number"]
        ]);
        return a.sendWithPromise("destinationCreateFitH", {
            page: b.id,
            top: c
        }).then(function(b) {
            return f(a.Destination, b)
        })
    };
    a.Destination.createFitV = function(b, c) {
        d(arguments.length, 2, "createFitV", "(PDFNet.Page, number)", [
            [b, "Object", a.Page, "Page"],
            [c, "number"]
        ]);
        return a.sendWithPromise("destinationCreateFitV", {
            page: b.id,
            left: c
        }).then(function(b) {
            return f(a.Destination, b)
        })
    };
    a.Destination.createFitR = function(b, c, e, m, g) {
        d(arguments.length, 5, "createFitR", "(PDFNet.Page, number, number, number, number)", [
            [b, "Object", a.Page, "Page"],
            [c, "number"],
            [e, "number"],
            [m, "number"],
            [g, "number"]
        ]);
        return a.sendWithPromise("destinationCreateFitR", {
            page: b.id,
            left: c,
            bottom: e,
            right: m,
            top: g
        }).then(function(b) {
            return f(a.Destination, b)
        })
    };
    a.Destination.createFitB = function(b) {
        d(arguments.length, 1, "createFitB", "(PDFNet.Page)", [
            [b, "Object", a.Page, "Page"]
        ]);
        return a.sendWithPromise("destinationCreateFitB", {
            page: b.id
        }).then(function(b) {
            return f(a.Destination, b)
        })
    };
    a.Destination.createFitBH = function(b, c) {
        d(arguments.length, 2, "createFitBH", "(PDFNet.Page, number)", [
            [b, "Object",
                a.Page, "Page"
            ],
            [c, "number"]
        ]);
        return a.sendWithPromise("destinationCreateFitBH", {
            page: b.id,
            top: c
        }).then(function(b) {
            return f(a.Destination, b)
        })
    };
    a.Destination.createFitBV = function(b, c) {
        d(arguments.length, 2, "createFitBV", "(PDFNet.Page, number)", [
            [b, "Object", a.Page, "Page"],
            [c, "number"]
        ]);
        return a.sendWithPromise("destinationCreateFitBV", {
            page: b.id,
            left: c
        }).then(function(b) {
            return f(a.Destination, b)
        })
    };
    a.Destination.create = function(b) {
        d(arguments.length, 1, "create", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("destinationCreate", {
            dest: b.id
        }).then(function(b) {
            return f(a.Destination, b)
        })
    };
    a.Destination.prototype.copy = function() {
        return a.sendWithPromise("Destination.copy", {
            d: this.id
        }).then(function(b) {
            return f(a.Destination, b)
        })
    };
    a.Destination.prototype.isValid = function() {
        return a.sendWithPromise("Destination.isValid", {
            dest: this.id
        })
    };
    a.Destination.prototype.getFitType = function() {
        return a.sendWithPromise("Destination.getFitType", {
            dest: this.id
        })
    };
    a.Destination.prototype.getPage = function() {
        return a.sendWithPromise("Destination.getPage", {
            dest: this.id
        }).then(function(b) {
            return f(a.Page, b)
        })
    };
    a.Destination.prototype.setPage = function(b) {
        d(arguments.length, 1, "setPage", "(PDFNet.Page)", [
            [b, "Object", a.Page, "Page"]
        ]);
        return a.sendWithPromise("Destination.setPage", {
            dest: this.id,
            page: b.id
        })
    };
    a.Destination.prototype.getSDFObj = function() {
        return a.sendWithPromise("Destination.getSDFObj", {
            dest: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Destination.prototype.getExplicitDestObj = function() {
        return a.sendWithPromise("Destination.getExplicitDestObj", {
            dest: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.GState.prototype.getTransform = function() {
        return a.sendWithPromise("GState.getTransform", {
            gs: this.id
        }).then(function(b) {
            return new a.Matrix2D(b)
        })
    };
    a.GState.prototype.getStrokeColorSpace = function() {
        return a.sendWithPromise("GState.getStrokeColorSpace", {
            gs: this.id
        }).then(function(b) {
            return l(a.ColorSpace, b)
        })
    };
    a.GState.prototype.getFillColorSpace = function() {
        return a.sendWithPromise("GState.getFillColorSpace", {
            gs: this.id
        }).then(function(b) {
            return l(a.ColorSpace,
                b)
        })
    };
    a.GState.prototype.getStrokeColor = function() {
        return a.sendWithPromise("GState.getStrokeColor", {
            gs: this.id
        }).then(function(b) {
            return l(a.ColorPt, b)
        })
    };
    a.GState.prototype.getStrokePattern = function() {
        return a.sendWithPromise("GState.getStrokePattern", {
            gs: this.id
        }).then(function(b) {
            return l(a.PatternColor, b)
        })
    };
    a.GState.prototype.getFillColor = function() {
        return a.sendWithPromise("GState.getFillColor", {
            gs: this.id
        }).then(function(b) {
            return l(a.ColorPt, b)
        })
    };
    a.GState.prototype.getFillPattern = function() {
        return a.sendWithPromise("GState.getFillPattern", {
            gs: this.id
        }).then(function(b) {
            return l(a.PatternColor, b)
        })
    };
    a.GState.prototype.getFlatness = function() {
        return a.sendWithPromise("GState.getFlatness", {
            gs: this.id
        })
    };
    a.GState.prototype.getLineCap = function() {
        return a.sendWithPromise("GState.getLineCap", {
            gs: this.id
        })
    };
    a.GState.prototype.getLineJoin = function() {
        return a.sendWithPromise("GState.getLineJoin", {
            gs: this.id
        })
    };
    a.GState.prototype.getLineWidth = function() {
        return a.sendWithPromise("GState.getLineWidth", {
            gs: this.id
        })
    };
    a.GState.prototype.getMiterLimit =
        function() {
            return a.sendWithPromise("GState.getMiterLimit", {
                gs: this.id
            })
        };
    a.GState.prototype.getPhase = function() {
        return a.sendWithPromise("GState.getPhase", {
            gs: this.id
        })
    };
    a.GState.prototype.getCharSpacing = function() {
        return a.sendWithPromise("GState.getCharSpacing", {
            gs: this.id
        })
    };
    a.GState.prototype.getWordSpacing = function() {
        return a.sendWithPromise("GState.getWordSpacing", {
            gs: this.id
        })
    };
    a.GState.prototype.getHorizontalScale = function() {
        return a.sendWithPromise("GState.getHorizontalScale", {
            gs: this.id
        })
    };
    a.GState.prototype.getLeading = function() {
        return a.sendWithPromise("GState.getLeading", {
            gs: this.id
        })
    };
    a.GState.prototype.getFont = function() {
        return a.sendWithPromise("GState.getFont", {
            gs: this.id
        }).then(function(b) {
            return l(a.Font, b)
        })
    };
    a.GState.prototype.getFontSize = function() {
        return a.sendWithPromise("GState.getFontSize", {
            gs: this.id
        })
    };
    a.GState.prototype.getTextRenderMode = function() {
        return a.sendWithPromise("GState.getTextRenderMode", {
            gs: this.id
        })
    };
    a.GState.prototype.getTextRise = function() {
        return a.sendWithPromise("GState.getTextRise", {
            gs: this.id
        })
    };
    a.GState.prototype.isTextKnockout = function() {
        return a.sendWithPromise("GState.isTextKnockout", {
            gs: this.id
        })
    };
    a.GState.prototype.getRenderingIntent = function() {
        return a.sendWithPromise("GState.getRenderingIntent", {
            gs: this.id
        })
    };
    a.GState.getRenderingIntentType = function(b) {
        d(arguments.length, 1, "getRenderingIntentType", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("gStateGetRenderingIntentType", {
            name: b
        })
    };
    a.GState.prototype.getBlendMode = function() {
        return a.sendWithPromise("GState.getBlendMode", {
            gs: this.id
        })
    };
    a.GState.prototype.getFillOpacity = function() {
        return a.sendWithPromise("GState.getFillOpacity", {
            gs: this.id
        })
    };
    a.GState.prototype.getStrokeOpacity = function() {
        return a.sendWithPromise("GState.getStrokeOpacity", {
            gs: this.id
        })
    };
    a.GState.prototype.getAISFlag = function() {
        return a.sendWithPromise("GState.getAISFlag", {
            gs: this.id
        })
    };
    a.GState.prototype.getSoftMask = function() {
        return a.sendWithPromise("GState.getSoftMask", {
            gs: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.GState.prototype.getSoftMaskTransform =
        function() {
            return a.sendWithPromise("GState.getSoftMaskTransform", {
                gs: this.id
            }).then(function(b) {
                return new a.Matrix2D(b)
            })
        };
    a.GState.prototype.getStrokeOverprint = function() {
        return a.sendWithPromise("GState.getStrokeOverprint", {
            gs: this.id
        })
    };
    a.GState.prototype.getFillOverprint = function() {
        return a.sendWithPromise("GState.getFillOverprint", {
            gs: this.id
        })
    };
    a.GState.prototype.getOverprintMode = function() {
        return a.sendWithPromise("GState.getOverprintMode", {
            gs: this.id
        })
    };
    a.GState.prototype.getAutoStrokeAdjust =
        function() {
            return a.sendWithPromise("GState.getAutoStrokeAdjust", {
                gs: this.id
            })
        };
    a.GState.prototype.getSmoothnessTolerance = function() {
        return a.sendWithPromise("GState.getSmoothnessTolerance", {
            gs: this.id
        })
    };
    a.GState.prototype.getTransferFunct = function() {
        return a.sendWithPromise("GState.getTransferFunct", {
            gs: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.GState.prototype.getBlackGenFunct = function() {
        return a.sendWithPromise("GState.getBlackGenFunct", {
            gs: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.GState.prototype.getUCRFunct = function() {
        return a.sendWithPromise("GState.getUCRFunct", {
            gs: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.GState.prototype.getHalftone = function() {
        return a.sendWithPromise("GState.getHalftone", {
            gs: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.GState.prototype.setTransformMatrix = function(b) {
        d(arguments.length, 1, "setTransformMatrix", "(PDFNet.Matrix2D)", [
            [b, "Structure", a.Matrix2D, "Matrix2D"]
        ]);
        n("setTransformMatrix", [
            [b, 0]
        ]);
        return a.sendWithPromise("GState.setTransformMatrix", {
            gs: this.id,
            mtx: b
        })
    };
    a.GState.prototype.setTransform = function(b, c, e, m, f, g) {
        d(arguments.length, 6, "setTransform", "(number, number, number, number, number, number)", [
            [b, "number"],
            [c, "number"],
            [e, "number"],
            [m, "number"],
            [f, "number"],
            [g, "number"]
        ]);
        return a.sendWithPromise("GState.setTransform", {
            gs: this.id,
            a: b,
            b: c,
            c: e,
            d: m,
            h: f,
            v: g
        })
    };
    a.GState.prototype.concatMatrix = function(b) {
        d(arguments.length, 1, "concatMatrix", "(PDFNet.Matrix2D)", [
            [b, "Structure", a.Matrix2D, "Matrix2D"]
        ]);
        n("concatMatrix", [
            [b, 0]
        ]);
        return a.sendWithPromise("GState.concatMatrix", {
            gs: this.id,
            mtx: b
        })
    };
    a.GState.prototype.concat = function(b, c, e, m, f, g) {
        d(arguments.length, 6, "concat", "(number, number, number, number, number, number)", [
            [b, "number"],
            [c, "number"],
            [e, "number"],
            [m, "number"],
            [f, "number"],
            [g, "number"]
        ]);
        return a.sendWithPromise("GState.concat", {
            gs: this.id,
            a: b,
            b: c,
            c: e,
            d: m,
            h: f,
            v: g
        })
    };
    a.GState.prototype.setStrokeColorSpace = function(b) {
        d(arguments.length, 1, "setStrokeColorSpace", "(PDFNet.ColorSpace)", [
            [b, "Object", a.ColorSpace, "ColorSpace"]
        ]);
        return a.sendWithPromise("GState.setStrokeColorSpace", {
            gs: this.id,
            cs: b.id
        })
    };
    a.GState.prototype.setFillColorSpace = function(b) {
        d(arguments.length, 1, "setFillColorSpace", "(PDFNet.ColorSpace)", [
            [b, "Object", a.ColorSpace, "ColorSpace"]
        ]);
        return a.sendWithPromise("GState.setFillColorSpace", {
            gs: this.id,
            cs: b.id
        })
    };
    a.GState.prototype.setStrokeColorWithColorPt = function(b) {
        d(arguments.length, 1, "setStrokeColorWithColorPt", "(PDFNet.ColorPt)", [
            [b, "Object", a.ColorPt, "ColorPt"]
        ]);
        return a.sendWithPromise("GState.setStrokeColorWithColorPt", {
            gs: this.id,
            c: b.id
        })
    };
    a.GState.prototype.setStrokeColorWithPattern =
        function(b) {
            d(arguments.length, 1, "setStrokeColorWithPattern", "(PDFNet.PatternColor)", [
                [b, "Object", a.PatternColor, "PatternColor"]
            ]);
            return a.sendWithPromise("GState.setStrokeColorWithPattern", {
                gs: this.id,
                pattern: b.id
            })
        };
    a.GState.prototype.setStrokeColor = function(b, c) {
        d(arguments.length, 2, "setStrokeColor", "(PDFNet.PatternColor, PDFNet.ColorPt)", [
            [b, "Object", a.PatternColor, "PatternColor"],
            [c, "Object", a.ColorPt, "ColorPt"]
        ]);
        return a.sendWithPromise("GState.setStrokeColor", {
            gs: this.id,
            pattern: b.id,
            c: c.id
        })
    };
    a.GState.prototype.setFillColorWithColorPt = function(b) {
        d(arguments.length, 1, "setFillColorWithColorPt", "(PDFNet.ColorPt)", [
            [b, "Object", a.ColorPt, "ColorPt"]
        ]);
        return a.sendWithPromise("GState.setFillColorWithColorPt", {
            gs: this.id,
            c: b.id
        })
    };
    a.GState.prototype.setFillColorWithPattern = function(b) {
        d(arguments.length, 1, "setFillColorWithPattern", "(PDFNet.PatternColor)", [
            [b, "Object", a.PatternColor, "PatternColor"]
        ]);
        return a.sendWithPromise("GState.setFillColorWithPattern", {
            gs: this.id,
            pattern: b.id
        })
    };
    a.GState.prototype.setFillColor =
        function(b, c) {
            d(arguments.length, 2, "setFillColor", "(PDFNet.PatternColor, PDFNet.ColorPt)", [
                [b, "Object", a.PatternColor, "PatternColor"],
                [c, "Object", a.ColorPt, "ColorPt"]
            ]);
            return a.sendWithPromise("GState.setFillColor", {
                gs: this.id,
                pattern: b.id,
                c: c.id
            })
        };
    a.GState.prototype.setFlatness = function(b) {
        d(arguments.length, 1, "setFlatness", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("GState.setFlatness", {
            gs: this.id,
            flatness: b
        })
    };
    a.GState.prototype.setLineCap = function(b) {
        d(arguments.length, 1, "setLineCap",
            "(number)", [
                [b, "number"]
            ]);
        return a.sendWithPromise("GState.setLineCap", {
            gs: this.id,
            cap: b
        })
    };
    a.GState.prototype.setLineJoin = function(b) {
        d(arguments.length, 1, "setLineJoin", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("GState.setLineJoin", {
            gs: this.id,
            join: b
        })
    };
    a.GState.prototype.setLineWidth = function(b) {
        d(arguments.length, 1, "setLineWidth", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("GState.setLineWidth", {
            gs: this.id,
            width: b
        })
    };
    a.GState.prototype.setMiterLimit = function(b) {
        d(arguments.length,
            1, "setMiterLimit", "(number)", [
                [b, "number"]
            ]);
        return a.sendWithPromise("GState.setMiterLimit", {
            gs: this.id,
            miter_limit: b
        })
    };
    a.GState.prototype.setDashPattern = function(b, c) {
        d(arguments.length, 2, "setDashPattern", "(Array<number>, number)", [
            [b, "Array"],
            [c, "number"]
        ]);
        return a.sendWithPromise("GState.setDashPattern", {
            gs: this.id,
            dash_array: b,
            phase: c
        })
    };
    a.GState.prototype.setCharSpacing = function(b) {
        d(arguments.length, 1, "setCharSpacing", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("GState.setCharSpacing", {
            gs: this.id,
            char_spacing: b
        })
    };
    a.GState.prototype.setWordSpacing = function(b) {
        d(arguments.length, 1, "setWordSpacing", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("GState.setWordSpacing", {
            gs: this.id,
            word_spacing: b
        })
    };
    a.GState.prototype.setHorizontalScale = function(b) {
        d(arguments.length, 1, "setHorizontalScale", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("GState.setHorizontalScale", {
            gs: this.id,
            hscale: b
        })
    };
    a.GState.prototype.setLeading = function(b) {
        d(arguments.length, 1, "setLeading", "(number)",
            [
                [b, "number"]
            ]);
        return a.sendWithPromise("GState.setLeading", {
            gs: this.id,
            leading: b
        })
    };
    a.GState.prototype.setFont = function(b, c) {
        d(arguments.length, 2, "setFont", "(PDFNet.Font, number)", [
            [b, "Object", a.Font, "Font"],
            [c, "number"]
        ]);
        return a.sendWithPromise("GState.setFont", {
            gs: this.id,
            font: b.id,
            font_sz: c
        })
    };
    a.GState.prototype.setTextRenderMode = function(b) {
        d(arguments.length, 1, "setTextRenderMode", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("GState.setTextRenderMode", {
            gs: this.id,
            rmode: b
        })
    };
    a.GState.prototype.setTextRise =
        function(b) {
            d(arguments.length, 1, "setTextRise", "(number)", [
                [b, "number"]
            ]);
            return a.sendWithPromise("GState.setTextRise", {
                gs: this.id,
                rise: b
            })
        };
    a.GState.prototype.setTextKnockout = function(b) {
        d(arguments.length, 1, "setTextKnockout", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("GState.setTextKnockout", {
            gs: this.id,
            knockout: b
        })
    };
    a.GState.prototype.setRenderingIntent = function(b) {
        d(arguments.length, 1, "setRenderingIntent", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("GState.setRenderingIntent", {
            gs: this.id,
            intent: b
        })
    };
    a.GState.prototype.setBlendMode = function(b) {
        d(arguments.length, 1, "setBlendMode", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("GState.setBlendMode", {
            gs: this.id,
            BM: b
        })
    };
    a.GState.prototype.setFillOpacity = function(b) {
        d(arguments.length, 1, "setFillOpacity", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("GState.setFillOpacity", {
            gs: this.id,
            ca: b
        })
    };
    a.GState.prototype.setStrokeOpacity = function(b) {
        d(arguments.length, 1, "setStrokeOpacity", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("GState.setStrokeOpacity", {
            gs: this.id,
            ca: b
        })
    };
    a.GState.prototype.setAISFlag = function(b) {
        d(arguments.length, 1, "setAISFlag", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("GState.setAISFlag", {
            gs: this.id,
            AIS: b
        })
    };
    a.GState.prototype.setSoftMask = function(b) {
        d(arguments.length, 1, "setSoftMask", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("GState.setSoftMask", {
            gs: this.id,
            SM: b.id
        })
    };
    a.GState.prototype.setStrokeOverprint = function(b) {
        d(arguments.length, 1, "setStrokeOverprint", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("GState.setStrokeOverprint", {
            gs: this.id,
            OP: b
        })
    };
    a.GState.prototype.setFillOverprint = function(b) {
        d(arguments.length, 1, "setFillOverprint", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("GState.setFillOverprint", {
            gs: this.id,
            op: b
        })
    };
    a.GState.prototype.setOverprintMode = function(b) {
        d(arguments.length, 1, "setOverprintMode", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("GState.setOverprintMode", {
            gs: this.id,
            OPM: b
        })
    };
    a.GState.prototype.setAutoStrokeAdjust = function(b) {
        d(arguments.length,
            1, "setAutoStrokeAdjust", "(boolean)", [
                [b, "boolean"]
            ]);
        return a.sendWithPromise("GState.setAutoStrokeAdjust", {
            gs: this.id,
            SA: b
        })
    };
    a.GState.prototype.setSmoothnessTolerance = function(b) {
        d(arguments.length, 1, "setSmoothnessTolerance", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("GState.setSmoothnessTolerance", {
            gs: this.id,
            SM: b
        })
    };
    a.GState.prototype.setBlackGenFunct = function(b) {
        d(arguments.length, 1, "setBlackGenFunct", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("GState.setBlackGenFunct", {
            gs: this.id,
            BG: b.id
        })
    };
    a.GState.prototype.setUCRFunct = function(b) {
        d(arguments.length, 1, "setUCRFunct", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("GState.setUCRFunct", {
            gs: this.id,
            UCR: b.id
        })
    };
    a.GState.prototype.setTransferFunct = function(b) {
        d(arguments.length, 1, "setTransferFunct", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("GState.setTransferFunct", {
            gs: this.id,
            TR: b.id
        })
    };
    a.GState.prototype.setHalftone = function(b) {
        d(arguments.length, 1, "setHalftone", "(PDFNet.Obj)",
            [
                [b, "Object", a.Obj, "Obj"]
            ]);
        return a.sendWithPromise("GState.setHalftone", {
            gs: this.id,
            HT: b.id
        })
    };
    a.Element.prototype.getType = function() {
        return a.sendWithPromise("Element.getType", {
            e: this.id
        })
    };
    a.Element.prototype.getGState = function() {
        return a.sendWithPromise("Element.getGState", {
            e: this.id
        }).then(function(b) {
            return f(a.GState, b)
        })
    };
    a.Element.prototype.getCTM = function() {
        return a.sendWithPromise("Element.getCTM", {
            e: this.id
        }).then(function(b) {
            return new a.Matrix2D(b)
        })
    };
    a.Element.prototype.getParentStructElement =
        function() {
            return a.sendWithPromise("Element.getParentStructElement", {
                e: this.id
            }).then(function(b) {
                return new a.SElement(b)
            })
        };
    a.Element.prototype.getStructMCID = function() {
        return a.sendWithPromise("Element.getStructMCID", {
            e: this.id
        })
    };
    a.Element.prototype.isOCVisible = function() {
        return a.sendWithPromise("Element.isOCVisible", {
            e: this.id
        })
    };
    a.Element.prototype.isClippingPath = function() {
        return a.sendWithPromise("Element.isClippingPath", {
            e: this.id
        })
    };
    a.Element.prototype.isStroked = function() {
        return a.sendWithPromise("Element.isStroked", {
            e: this.id
        })
    };
    a.Element.prototype.isFilled = function() {
        return a.sendWithPromise("Element.isFilled", {
            e: this.id
        })
    };
    a.Element.prototype.isWindingFill = function() {
        return a.sendWithPromise("Element.isWindingFill", {
            e: this.id
        })
    };
    a.Element.prototype.isClipWindingFill = function() {
        return a.sendWithPromise("Element.isClipWindingFill", {
            e: this.id
        })
    };
    a.Element.prototype.setPathClip = function(b) {
        d(arguments.length, 1, "setPathClip", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("Element.setPathClip", {
            e: this.id,
            clip: b
        })
    };
    a.Element.prototype.setPathStroke = function(b) {
        d(arguments.length, 1, "setPathStroke", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("Element.setPathStroke", {
            e: this.id,
            stroke: b
        })
    };
    a.Element.prototype.setPathFill = function(b) {
        d(arguments.length, 1, "setPathFill", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("Element.setPathFill", {
            e: this.id,
            fill: b
        })
    };
    a.Element.prototype.setWindingFill = function(b) {
        d(arguments.length, 1, "setWindingFill", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("Element.setWindingFill", {
            e: this.id,
            winding_rule: b
        })
    };
    a.Element.prototype.setClipWindingFill = function(b) {
        d(arguments.length, 1, "setClipWindingFill", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("Element.setClipWindingFill", {
            e: this.id,
            winding_rule: b
        })
    };
    a.Element.prototype.setPathTypes = function(b, c) {
        d(arguments.length, 2, "setPathTypes", "(string, number)", [
            [b, "string"],
            [c, "number"]
        ]);
        return a.sendWithPromise("Element.setPathTypes", {
            e: this.id,
            in_seg_types: b,
            count: c
        })
    };
    a.Element.prototype.getXObject = function() {
        return a.sendWithPromise("Element.getXObject", {
            e: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Element.prototype.getImageData = function() {
        return a.sendWithPromise("Element.getImageData", {
            e: this.id
        }).then(function(b) {
            return f(a.Filter, b)
        })
    };
    a.Element.prototype.getImageDataSize = function() {
        return a.sendWithPromise("Element.getImageDataSize", {
            e: this.id
        })
    };
    a.Element.prototype.getImageColorSpace = function() {
        return a.sendWithPromise("Element.getImageColorSpace", {
            e: this.id
        }).then(function(b) {
            return l(a.ColorSpace, b)
        })
    };
    a.Element.prototype.getImageWidth =
        function() {
            return a.sendWithPromise("Element.getImageWidth", {
                e: this.id
            })
        };
    a.Element.prototype.getImageHeight = function() {
        return a.sendWithPromise("Element.getImageHeight", {
            e: this.id
        })
    };
    a.Element.prototype.getDecodeArray = function() {
        return a.sendWithPromise("Element.getDecodeArray", {
            e: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Element.prototype.getBitsPerComponent = function() {
        return a.sendWithPromise("Element.getBitsPerComponent", {
            e: this.id
        })
    };
    a.Element.prototype.getComponentNum = function() {
        return a.sendWithPromise("Element.getComponentNum", {
            e: this.id
        })
    };
    a.Element.prototype.isImageMask = function() {
        return a.sendWithPromise("Element.isImageMask", {
            e: this.id
        })
    };
    a.Element.prototype.isImageInterpolate = function() {
        return a.sendWithPromise("Element.isImageInterpolate", {
            e: this.id
        })
    };
    a.Element.prototype.getMask = function() {
        return a.sendWithPromise("Element.getMask", {
            e: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Element.prototype.getImageRenderingIntent = function() {
        return a.sendWithPromise("Element.getImageRenderingIntent", {
            e: this.id
        })
    };
    a.Element.prototype.getTextString =
        function() {
            return a.sendWithPromise("Element.getTextString", {
                e: this.id
            })
        };
    a.Element.prototype.getTextMatrix = function() {
        return a.sendWithPromise("Element.getTextMatrix", {
            e: this.id
        }).then(function(b) {
            return new a.Matrix2D(b)
        })
    };
    a.Element.prototype.getCharIterator = function() {
        return a.sendWithPromise("Element.getCharIterator", {
            e: this.id
        }).then(function(b) {
            return l(a.Iterator, b, "CharData")
        })
    };
    a.Element.prototype.getTextLength = function() {
        return a.sendWithPromise("Element.getTextLength", {
            e: this.id
        })
    };
    a.Element.prototype.getPosAdjustment =
        function() {
            return a.sendWithPromise("Element.getPosAdjustment", {
                e: this.id
            })
        };
    a.Element.prototype.getNewTextLineOffset = function() {
        return a.sendWithPromise("Element.getNewTextLineOffset", {
            e: this.id
        })
    };
    a.Element.prototype.hasTextMatrix = function() {
        return a.sendWithPromise("Element.hasTextMatrix", {
            e: this.id
        })
    };
    a.Element.prototype.setTextData = function(b) {
        d(arguments.length, 1, "setTextData", "(ArrayBuffer|TypedArray)", [
            [b, "ArrayBuffer"]
        ]);
        var c = u(b, !1);
        return a.sendWithPromise("Element.setTextData", {
            e: this.id,
            buf_text_data: c
        })
    };
    a.Element.prototype.setTextMatrix = function(b) {
        d(arguments.length, 1, "setTextMatrix", "(PDFNet.Matrix2D)", [
            [b, "Structure", a.Matrix2D, "Matrix2D"]
        ]);
        n("setTextMatrix", [
            [b, 0]
        ]);
        return a.sendWithPromise("Element.setTextMatrix", {
            e: this.id,
            mtx: b
        })
    };
    a.Element.prototype.setTextMatrixEntries = function(b, c, e, m, f, g) {
        d(arguments.length, 6, "setTextMatrixEntries", "(number, number, number, number, number, number)", [
            [b, "number"],
            [c, "number"],
            [e, "number"],
            [m, "number"],
            [f, "number"],
            [g, "number"]
        ]);
        return a.sendWithPromise("Element.setTextMatrixEntries", {
            e: this.id,
            a: b,
            b: c,
            c: e,
            d: m,
            h: f,
            v: g
        })
    };
    a.Element.prototype.setPosAdjustment = function(b) {
        d(arguments.length, 1, "setPosAdjustment", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("Element.setPosAdjustment", {
            e: this.id,
            adjust: b
        })
    };
    a.Element.prototype.updateTextMetrics = function() {
        return a.sendWithPromise("Element.updateTextMetrics", {
            e: this.id
        })
    };
    a.Element.prototype.setNewTextLineOffset = function(b, c) {
        d(arguments.length, 2, "setNewTextLineOffset", "(number, number)", [
            [b, "number"],
            [c, "number"]
        ]);
        return a.sendWithPromise("Element.setNewTextLineOffset", {
            e: this.id,
            dx: b,
            dy: c
        })
    };
    a.Element.prototype.getShading = function() {
        return a.sendWithPromise("Element.getShading", {
            e: this.id
        }).then(function(b) {
            return l(a.Shading, b)
        })
    };
    a.Element.prototype.getMCPropertyDict = function() {
        return a.sendWithPromise("Element.getMCPropertyDict", {
            e: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Element.prototype.getMCTag = function() {
        return a.sendWithPromise("Element.getMCTag", {
            e: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.ShapedText.prototype.getScale = function() {
        return a.sendWithPromise("ShapedText.getScale", {
            self: this.id
        })
    };
    a.ShapedText.prototype.getShapingStatus = function() {
        return a.sendWithPromise("ShapedText.getShapingStatus", {
            self: this.id
        })
    };
    a.ShapedText.prototype.getFailureReason = function() {
        return a.sendWithPromise("ShapedText.getFailureReason", {
            self: this.id
        })
    };
    a.ShapedText.prototype.getText = function() {
        return a.sendWithPromise("ShapedText.getText", {
            self: this.id
        })
    };
    a.ShapedText.prototype.getNumGlyphs = function() {
        return a.sendWithPromise("ShapedText.getNumGlyphs", {
            self: this.id
        })
    };
    a.ShapedText.prototype.getGlyph =
        function(b) {
            d(arguments.length, 1, "getGlyph", "(number)", [
                [b, "number"]
            ]);
            return a.sendWithPromise("ShapedText.getGlyph", {
                self: this.id,
                index: b
            })
        };
    a.ShapedText.prototype.getGlyphXPos = function(b) {
        d(arguments.length, 1, "getGlyphXPos", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("ShapedText.getGlyphXPos", {
            self: this.id,
            index: b
        })
    };
    a.ShapedText.prototype.getGlyphYPos = function(b) {
        d(arguments.length, 1, "getGlyphYPos", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("ShapedText.getGlyphYPos", {
            self: this.id,
            index: b
        })
    };
    a.ElementBuilder.create = function() {
        return a.sendWithPromise("elementBuilderCreate", {}).then(function(b) {
            return l(a.ElementBuilder, b)
        })
    };
    a.ElementBuilder.prototype.reset = function(b) {
        "undefined" === typeof b && (b = new a.GState("0"));
        d(arguments.length, 0, "reset", "(PDFNet.GState)", [
            [b, "Object", a.GState, "GState"]
        ]);
        return a.sendWithPromise("ElementBuilder.reset", {
            b: this.id,
            gs: b.id
        })
    };
    a.ElementBuilder.prototype.createImage = function(b) {
        d(arguments.length, 1, "createImage", "(PDFNet.Image)", [
            [b, "Object",
                a.Image, "Image"
            ]
        ]);
        return a.sendWithPromise("ElementBuilder.createImage", {
            b: this.id,
            img: b.id
        }).then(function(b) {
            return f(a.Element, b)
        })
    };
    a.ElementBuilder.prototype.createImageFromMatrix = function(b, c) {
        d(arguments.length, 2, "createImageFromMatrix", "(PDFNet.Image, PDFNet.Matrix2D)", [
            [b, "Object", a.Image, "Image"],
            [c, "Structure", a.Matrix2D, "Matrix2D"]
        ]);
        n("createImageFromMatrix", [
            [c, 1]
        ]);
        return a.sendWithPromise("ElementBuilder.createImageFromMatrix", {
            b: this.id,
            img: b.id,
            mtx: c
        }).then(function(b) {
            return f(a.Element,
                b)
        })
    };
    a.ElementBuilder.prototype.createImageScaled = function(b, c, e, m, g) {
        d(arguments.length, 5, "createImageScaled", "(PDFNet.Image, number, number, number, number)", [
            [b, "Object", a.Image, "Image"],
            [c, "number"],
            [e, "number"],
            [m, "number"],
            [g, "number"]
        ]);
        return a.sendWithPromise("ElementBuilder.createImageScaled", {
            b: this.id,
            img: b.id,
            x: c,
            y: e,
            hscale: m,
            vscale: g
        }).then(function(b) {
            return f(a.Element, b)
        })
    };
    a.ElementBuilder.prototype.createGroupBegin = function() {
        return a.sendWithPromise("ElementBuilder.createGroupBegin", {
            b: this.id
        }).then(function(b) {
            return f(a.Element, b)
        })
    };
    a.ElementBuilder.prototype.createGroupEnd = function() {
        return a.sendWithPromise("ElementBuilder.createGroupEnd", {
            b: this.id
        }).then(function(b) {
            return f(a.Element, b)
        })
    };
    a.ElementBuilder.prototype.createShading = function(b) {
        d(arguments.length, 1, "createShading", "(PDFNet.Shading)", [
            [b, "Object", a.Shading, "Shading"]
        ]);
        return a.sendWithPromise("ElementBuilder.createShading", {
            b: this.id,
            sh: b.id
        }).then(function(b) {
            return f(a.Element, b)
        })
    };
    a.ElementBuilder.prototype.createFormFromStream =
        function(b) {
            d(arguments.length, 1, "createFormFromStream", "(PDFNet.Obj)", [
                [b, "Object", a.Obj, "Obj"]
            ]);
            return a.sendWithPromise("ElementBuilder.createFormFromStream", {
                b: this.id,
                form: b.id
            }).then(function(b) {
                return f(a.Element, b)
            })
        };
    a.ElementBuilder.prototype.createFormFromPage = function(b) {
        d(arguments.length, 1, "createFormFromPage", "(PDFNet.Page)", [
            [b, "Object", a.Page, "Page"]
        ]);
        return a.sendWithPromise("ElementBuilder.createFormFromPage", {
            b: this.id,
            page: b.id
        }).then(function(b) {
            return f(a.Element, b)
        })
    };
    a.ElementBuilder.prototype.createFormFromDoc =
        function(b, c) {
            d(arguments.length, 2, "createFormFromDoc", "(PDFNet.Page, PDFNet.PDFDoc)", [
                [b, "Object", a.Page, "Page"],
                [c, "PDFDoc"]
            ]);
            return a.sendWithPromise("ElementBuilder.createFormFromDoc", {
                b: this.id,
                page: b.id,
                doc: c.id
            }).then(function(b) {
                return f(a.Element, b)
            })
        };
    a.ElementBuilder.prototype.createTextBeginWithFont = function(b, c) {
        d(arguments.length, 2, "createTextBeginWithFont", "(PDFNet.Font, number)", [
            [b, "Object", a.Font, "Font"],
            [c, "number"]
        ]);
        return a.sendWithPromise("ElementBuilder.createTextBeginWithFont", {
            b: this.id,
            font: b.id,
            font_sz: c
        }).then(function(b) {
            return f(a.Element, b)
        })
    };
    a.ElementBuilder.prototype.createTextBegin = function() {
        return a.sendWithPromise("ElementBuilder.createTextBegin", {
            b: this.id
        }).then(function(b) {
            return f(a.Element, b)
        })
    };
    a.ElementBuilder.prototype.createTextEnd = function() {
        return a.sendWithPromise("ElementBuilder.createTextEnd", {
            b: this.id
        }).then(function(b) {
            return f(a.Element, b)
        })
    };
    a.ElementBuilder.prototype.createTextRun = function(b, c, e) {
        d(arguments.length, 3, "createTextRun", "(string, PDFNet.Font, number)",
            [
                [b, "string"],
                [c, "Object", a.Font, "Font"],
                [e, "number"]
            ]);
        return a.sendWithPromise("ElementBuilder.createTextRun", {
            b: this.id,
            text_data: b,
            font: c.id,
            font_sz: e
        }).then(function(b) {
            return f(a.Element, b)
        })
    };
    a.ElementBuilder.prototype.createTextRunUnsigned = function(b, c, e) {
        d(arguments.length, 3, "createTextRunUnsigned", "(string, PDFNet.Font, number)", [
            [b, "string"],
            [c, "Object", a.Font, "Font"],
            [e, "number"]
        ]);
        return a.sendWithPromise("ElementBuilder.createTextRunUnsigned", {
            b: this.id,
            text_data: b,
            font: c.id,
            font_sz: e
        }).then(function(b) {
            return f(a.Element,
                b)
        })
    };
    a.ElementBuilder.prototype.createNewTextRun = function(b) {
        d(arguments.length, 1, "createNewTextRun", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("ElementBuilder.createNewTextRun", {
            b: this.id,
            text_data: b
        }).then(function(b) {
            return f(a.Element, b)
        })
    };
    a.ElementBuilder.prototype.createNewTextRunUnsigned = function(b) {
        d(arguments.length, 1, "createNewTextRunUnsigned", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("ElementBuilder.createNewTextRunUnsigned", {
            b: this.id,
            text_data: b
        }).then(function(b) {
            return f(a.Element,
                b)
        })
    };
    a.ElementBuilder.prototype.createShapedTextRun = function(b) {
        d(arguments.length, 1, "createShapedTextRun", "(PDFNet.ShapedText)", [
            [b, "Object", a.ShapedText, "ShapedText"]
        ]);
        return a.sendWithPromise("ElementBuilder.createShapedTextRun", {
            b: this.id,
            text_data: b.id
        }).then(function(b) {
            return f(a.Element, b)
        })
    };
    a.ElementBuilder.prototype.createTextNewLineWithOffset = function(b, c) {
        d(arguments.length, 2, "createTextNewLineWithOffset", "(number, number)", [
            [b, "number"],
            [c, "number"]
        ]);
        return a.sendWithPromise("ElementBuilder.createTextNewLineWithOffset", {
            b: this.id,
            dx: b,
            dy: c
        }).then(function(b) {
            return f(a.Element, b)
        })
    };
    a.ElementBuilder.prototype.createTextNewLine = function() {
        return a.sendWithPromise("ElementBuilder.createTextNewLine", {
            b: this.id
        }).then(function(b) {
            return f(a.Element, b)
        })
    };
    a.ElementBuilder.prototype.createPath = function(b, c) {
        d(arguments.length, 2, "createPath", "(Array<number>, ArrayBuffer|TypedArray)", [
            [b, "Array"],
            [c, "ArrayBuffer"]
        ]);
        var e = u(c, !1);
        return a.sendWithPromise("ElementBuilder.createPath", {
            b: this.id,
            points_list: b,
            buf_seg_types: e
        }).then(function(b) {
            return f(a.Element,
                b)
        })
    };
    a.ElementBuilder.prototype.createRect = function(b, c, e, m) {
        d(arguments.length, 4, "createRect", "(number, number, number, number)", [
            [b, "number"],
            [c, "number"],
            [e, "number"],
            [m, "number"]
        ]);
        return a.sendWithPromise("ElementBuilder.createRect", {
            b: this.id,
            x: b,
            y: c,
            width: e,
            height: m
        }).then(function(b) {
            return f(a.Element, b)
        })
    };
    a.ElementBuilder.prototype.createEllipse = function(b, c, e, m) {
        d(arguments.length, 4, "createEllipse", "(number, number, number, number)", [
            [b, "number"],
            [c, "number"],
            [e, "number"],
            [m, "number"]
        ]);
        return a.sendWithPromise("ElementBuilder.createEllipse", {
            b: this.id,
            x: b,
            y: c,
            width: e,
            height: m
        }).then(function(b) {
            return f(a.Element, b)
        })
    };
    a.ElementBuilder.prototype.pathBegin = function() {
        return a.sendWithPromise("ElementBuilder.pathBegin", {
            b: this.id
        })
    };
    a.ElementBuilder.prototype.pathEnd = function() {
        return a.sendWithPromise("ElementBuilder.pathEnd", {
            b: this.id
        }).then(function(b) {
            return f(a.Element, b)
        })
    };
    a.ElementBuilder.prototype.rect = function(b, c, e, m) {
        d(arguments.length, 4, "rect", "(number, number, number, number)",
            [
                [b, "number"],
                [c, "number"],
                [e, "number"],
                [m, "number"]
            ]);
        return a.sendWithPromise("ElementBuilder.rect", {
            b: this.id,
            x: b,
            y: c,
            width: e,
            height: m
        })
    };
    a.ElementBuilder.prototype.ellipse = function(b, c, e, m) {
        d(arguments.length, 4, "ellipse", "(number, number, number, number)", [
            [b, "number"],
            [c, "number"],
            [e, "number"],
            [m, "number"]
        ]);
        return a.sendWithPromise("ElementBuilder.ellipse", {
            b: this.id,
            x: b,
            y: c,
            width: e,
            height: m
        })
    };
    a.ElementBuilder.prototype.moveTo = function(b, c) {
        d(arguments.length, 2, "moveTo", "(number, number)",
            [
                [b, "number"],
                [c, "number"]
            ]);
        return a.sendWithPromise("ElementBuilder.moveTo", {
            b: this.id,
            x: b,
            y: c
        })
    };
    a.ElementBuilder.prototype.lineTo = function(b, c) {
        d(arguments.length, 2, "lineTo", "(number, number)", [
            [b, "number"],
            [c, "number"]
        ]);
        return a.sendWithPromise("ElementBuilder.lineTo", {
            b: this.id,
            x: b,
            y: c
        })
    };
    a.ElementBuilder.prototype.curveTo = function(b, c, e, m, f, g) {
        d(arguments.length, 6, "curveTo", "(number, number, number, number, number, number)", [
            [b, "number"],
            [c, "number"],
            [e, "number"],
            [m, "number"],
            [f, "number"],
            [g, "number"]
        ]);
        return a.sendWithPromise("ElementBuilder.curveTo", {
            b: this.id,
            cx1: b,
            cy1: c,
            cx2: e,
            cy2: m,
            x2: f,
            y2: g
        })
    };
    a.ElementBuilder.prototype.arcTo = function(b, c, e, m, f, g) {
        d(arguments.length, 6, "arcTo", "(number, number, number, number, number, number)", [
            [b, "number"],
            [c, "number"],
            [e, "number"],
            [m, "number"],
            [f, "number"],
            [g, "number"]
        ]);
        return a.sendWithPromise("ElementBuilder.arcTo", {
            b: this.id,
            x: b,
            y: c,
            width: e,
            height: m,
            start: f,
            extent: g
        })
    };
    a.ElementBuilder.prototype.arcTo2 = function(b, c, e, m, f, g, h) {
        d(arguments.length,
            7, "arcTo2", "(number, number, number, boolean, boolean, number, number)", [
                [b, "number"],
                [c, "number"],
                [e, "number"],
                [m, "boolean"],
                [f, "boolean"],
                [g, "number"],
                [h, "number"]
            ]);
        return a.sendWithPromise("ElementBuilder.arcTo2", {
            b: this.id,
            xr: b,
            yr: c,
            rx: e,
            isLargeArc: m,
            sweep: f,
            endX: g,
            endY: h
        })
    };
    a.ElementBuilder.prototype.closePath = function() {
        return a.sendWithPromise("ElementBuilder.closePath", {
            b: this.id
        })
    };
    a.ElementBuilder.prototype.createMarkedContentBeginInlineProperties = function(b) {
        d(arguments.length, 1, "createMarkedContentBeginInlineProperties",
            "(string)", [
                [b, "string"]
            ]);
        return a.sendWithPromise("ElementBuilder.createMarkedContentBeginInlineProperties", {
            b: this.id,
            tag: b
        }).then(function(b) {
            return f(a.Element, b)
        })
    };
    a.ElementBuilder.prototype.createMarkedContentBegin = function(b, c) {
        d(arguments.length, 2, "createMarkedContentBegin", "(string, PDFNet.Obj)", [
            [b, "string"],
            [c, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("ElementBuilder.createMarkedContentBegin", {
            b: this.id,
            tag: b,
            property_dict: c.id
        }).then(function(b) {
            return f(a.Element, b)
        })
    };
    a.ElementBuilder.prototype.createMarkedContentEnd =
        function() {
            return a.sendWithPromise("ElementBuilder.createMarkedContentEnd", {
                b: this.id
            }).then(function(b) {
                return f(a.Element, b)
            })
        };
    a.ElementBuilder.prototype.createMarkedContentPointInlineProperties = function(b) {
        d(arguments.length, 1, "createMarkedContentPointInlineProperties", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("ElementBuilder.createMarkedContentPointInlineProperties", {
            b: this.id,
            tag: b
        }).then(function(b) {
            return f(a.Element, b)
        })
    };
    a.ElementBuilder.prototype.createMarkedContentPoint = function(b,
        c) {
        d(arguments.length, 2, "createMarkedContentPoint", "(string, PDFNet.Obj)", [
            [b, "string"],
            [c, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("ElementBuilder.createMarkedContentPoint", {
            b: this.id,
            tag: b,
            property_dict: c.id
        }).then(function(b) {
            return f(a.Element, b)
        })
    };
    a.ElementReader.create = function() {
        return a.sendWithPromise("elementReaderCreate", {}).then(function(b) {
            return l(a.ElementReader, b)
        })
    };
    a.ElementReader.prototype.beginOnPage = function(b, c) {
        "undefined" === typeof c && (c = new a.OCGContext("0"));
        d(arguments.length,
            1, "beginOnPage", "(PDFNet.Page, PDFNet.OCGContext)", [
                [b, "Object", a.Page, "Page"],
                [c, "Object", a.OCGContext, "OCGContext"]
            ]);
        return a.sendWithPromise("ElementReader.beginOnPage", {
            r: this.id,
            page: b.id,
            ctx: c.id
        })
    };
    a.ElementReader.prototype.begin = function(b, c, e) {
        "undefined" === typeof c && (c = new a.Obj("0"));
        "undefined" === typeof e && (e = new a.OCGContext("0"));
        d(arguments.length, 1, "begin", "(PDFNet.Obj, PDFNet.Obj, PDFNet.OCGContext)", [
            [b, "Object", a.Obj, "Obj"],
            [c, "Object", a.Obj, "Obj"],
            [e, "Object", a.OCGContext, "OCGContext"]
        ]);
        return a.sendWithPromise("ElementReader.begin", {
            r: this.id,
            content_stream: b.id,
            resource_dict: c.id,
            ctx: e.id
        })
    };
    a.ElementReader.prototype.appendResource = function(b) {
        d(arguments.length, 1, "appendResource", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("ElementReader.appendResource", {
            r: this.id,
            res: b.id
        })
    };
    a.ElementReader.prototype.next = function() {
        return a.sendWithPromise("ElementReader.next", {
            r: this.id
        }).then(function(b) {
            return f(a.Element, b)
        })
    };
    a.ElementReader.prototype.current = function() {
        return a.sendWithPromise("ElementReader.current", {
            r: this.id
        }).then(function(b) {
            return f(a.Element, b)
        })
    };
    a.ElementReader.prototype.formBegin = function() {
        return a.sendWithPromise("ElementReader.formBegin", {
            r: this.id
        })
    };
    a.ElementReader.prototype.patternBegin = function(b, c) {
        "undefined" === typeof c && (c = !1);
        d(arguments.length, 1, "patternBegin", "(boolean, boolean)", [
            [b, "boolean"],
            [c, "boolean"]
        ]);
        return a.sendWithPromise("ElementReader.patternBegin", {
            r: this.id,
            fill_pattern: b,
            reset_ctm_tfm: c
        })
    };
    a.ElementReader.prototype.type3FontBegin = function(b, c) {
        "undefined" ===
        typeof c && (c = new a.Obj("0"));
        d(arguments.length, 1, "type3FontBegin", "(PDFNet.CharData, PDFNet.Obj)", [
            [b, "Structure", a.CharData, "CharData"],
            [c, "Object", a.Obj, "Obj"]
        ]);
        n("type3FontBegin", [
            [b, 0]
        ]);
        b.yieldFunction = "ElementReader.type3FontBegin";
        return a.sendWithPromise("ElementReader.type3FontBegin", {
            r: this.id,
            char_data: b,
            resource_dict: c.id
        }).then(function(a) {
            b.yieldFunction = void 0;
            q(a, b)
        })
    };
    a.ElementReader.prototype.end = function() {
        return a.sendWithPromise("ElementReader.end", {
            r: this.id
        })
    };
    a.ElementReader.prototype.getChangesIterator =
        function() {
            return a.sendWithPromise("ElementReader.getChangesIterator", {
                r: this.id
            }).then(function(b) {
                return l(a.Iterator, b, "Int")
            })
        };
    a.ElementReader.prototype.isChanged = function(b) {
        d(arguments.length, 1, "isChanged", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("ElementReader.isChanged", {
            r: this.id,
            attrib: b
        })
    };
    a.ElementReader.prototype.clearChangeList = function() {
        return a.sendWithPromise("ElementReader.clearChangeList", {
            r: this.id
        })
    };
    a.ElementReader.prototype.getFont = function(b) {
        d(arguments.length,
            1, "getFont", "(string)", [
                [b, "string"]
            ]);
        return a.sendWithPromise("ElementReader.getFont", {
            r: this.id,
            name: b
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.ElementReader.prototype.getXObject = function(b) {
        d(arguments.length, 1, "getXObject", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("ElementReader.getXObject", {
            r: this.id,
            name: b
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.ElementReader.prototype.getShading = function(b) {
        d(arguments.length, 1, "getShading", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("ElementReader.getShading", {
            r: this.id,
            name: b
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.ElementReader.prototype.getColorSpace = function(b) {
        d(arguments.length, 1, "getColorSpace", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("ElementReader.getColorSpace", {
            r: this.id,
            name: b
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.ElementReader.prototype.getPattern = function(b) {
        d(arguments.length, 1, "getPattern", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("ElementReader.getPattern", {
            r: this.id,
            name: b
        }).then(function(b) {
            return f(a.Obj,
                b)
        })
    };
    a.ElementReader.prototype.getExtGState = function(b) {
        d(arguments.length, 1, "getExtGState", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("ElementReader.getExtGState", {
            r: this.id,
            name: b
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.ElementWriter.create = function() {
        return a.sendWithPromise("elementWriterCreate", {}).then(function(b) {
            return l(a.ElementWriter, b)
        })
    };
    a.ElementWriter.prototype.beginOnPage = function(b, c, e, m, f) {
        "undefined" === typeof c && (c = a.ElementWriter.WriteMode.e_overlay);
        "undefined" ===
        typeof e && (e = !0);
        "undefined" === typeof m && (m = !0);
        "undefined" === typeof f && (f = new a.Obj("0"));
        d(arguments.length, 1, "beginOnPage", "(PDFNet.Page, number, boolean, boolean, PDFNet.Obj)", [
            [b, "Object", a.Page, "Page"],
            [c, "number"],
            [e, "boolean"],
            [m, "boolean"],
            [f, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("ElementWriter.beginOnPage", {
            w: this.id,
            page: b.id,
            placement: c,
            page_coord_sys: e,
            compress: m,
            resources: f.id
        })
    };
    a.ElementWriter.prototype.begin = function(b, c) {
        "undefined" === typeof c && (c = !0);
        d(arguments.length,
            1, "begin", "(PDFNet.SDFDoc, boolean)", [
                [b, "SDFDoc"],
                [c, "boolean"]
            ]);
        return a.sendWithPromise("ElementWriter.begin", {
            w: this.id,
            doc: b.id,
            compress: c
        })
    };
    a.ElementWriter.prototype.beginOnObj = function(b, c, e) {
        "undefined" === typeof c && (c = !0);
        "undefined" === typeof e && (e = new a.Obj("0"));
        d(arguments.length, 1, "beginOnObj", "(PDFNet.Obj, boolean, PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"],
            [c, "boolean"],
            [e, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("ElementWriter.beginOnObj", {
            w: this.id,
            stream_obj_to_update: b.id,
            compress: c,
            resources: e.id
        })
    };
    a.ElementWriter.prototype.end = function() {
        return a.sendWithPromise("ElementWriter.end", {
            w: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.ElementWriter.prototype.writeElement = function(b) {
        d(arguments.length, 1, "writeElement", "(PDFNet.Element)", [
            [b, "Object", a.Element, "Element"]
        ]);
        return a.sendWithPromise("ElementWriter.writeElement", {
            w: this.id,
            element: b.id
        })
    };
    a.ElementWriter.prototype.writePlacedElement = function(b) {
        d(arguments.length, 1, "writePlacedElement", "(PDFNet.Element)",
            [
                [b, "Object", a.Element, "Element"]
            ]);
        return a.sendWithPromise("ElementWriter.writePlacedElement", {
            w: this.id,
            element: b.id
        })
    };
    a.ElementWriter.prototype.flush = function() {
        return a.sendWithPromise("ElementWriter.flush", {
            w: this.id
        })
    };
    a.ElementWriter.prototype.writeBuffer = function(b) {
        d(arguments.length, 1, "writeBuffer", "(ArrayBuffer|TypedArray)", [
            [b, "ArrayBuffer"]
        ]);
        var c = u(b, !1);
        return a.sendWithPromise("ElementWriter.writeBuffer", {
            w: this.id,
            data_buf: c
        })
    };
    a.ElementWriter.prototype.writeString = function(b) {
        d(arguments.length,
            1, "writeString", "(string)", [
                [b, "string"]
            ]);
        return a.sendWithPromise("ElementWriter.writeString", {
            w: this.id,
            str: b
        })
    };
    a.ElementWriter.prototype.setDefaultGState = function(b) {
        d(arguments.length, 1, "setDefaultGState", "(PDFNet.ElementReader)", [
            [b, "Object", a.ElementReader, "ElementReader"]
        ]);
        return a.sendWithPromise("ElementWriter.setDefaultGState", {
            w: this.id,
            reader: b.id
        })
    };
    a.ElementWriter.prototype.writeGStateChanges = function(b) {
        d(arguments.length, 1, "writeGStateChanges", "(PDFNet.Element)", [
            [b, "Object", a.Element,
                "Element"
            ]
        ]);
        return a.sendWithPromise("ElementWriter.writeGStateChanges", {
            w: this.id,
            element: b.id
        })
    };
    a.FileSpec.create = function(b, c, e) {
        "undefined" === typeof e && (e = !0);
        d(arguments.length, 2, "create", "(PDFNet.SDFDoc, string, boolean)", [
            [b, "SDFDoc"],
            [c, "string"],
            [e, "boolean"]
        ]);
        return a.sendWithPromise("fileSpecCreate", {
            doc: b.id,
            path: c,
            embed: e
        }).then(function(b) {
            return f(a.FileSpec, b)
        })
    };
    a.FileSpec.createURL = function(b, c) {
        d(arguments.length, 2, "createURL", "(PDFNet.SDFDoc, string)", [
            [b, "SDFDoc"],
            [c, "string"]
        ]);
        return a.sendWithPromise("fileSpecCreateURL", {
            doc: b.id,
            url: c
        }).then(function(b) {
            return f(a.FileSpec, b)
        })
    };
    a.FileSpec.createFromObj = function(b) {
        d(arguments.length, 1, "createFromObj", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("fileSpecCreateFromObj", {
            f: b.id
        }).then(function(b) {
            return f(a.FileSpec, b)
        })
    };
    a.FileSpec.prototype.copy = function() {
        return a.sendWithPromise("FileSpec.copy", {
            d: this.id
        }).then(function(b) {
            return f(a.FileSpec, b)
        })
    };
    a.FileSpec.prototype.compare = function(b) {
        d(arguments.length,
            1, "compare", "(PDFNet.FileSpec)", [
                [b, "Object", a.FileSpec, "FileSpec"]
            ]);
        return a.sendWithPromise("FileSpec.compare", {
            fs: this.id,
            d: b.id
        })
    };
    a.FileSpec.prototype.isValid = function() {
        return a.sendWithPromise("FileSpec.isValid", {
            fs: this.id
        })
    };
    a.FileSpec.prototype.export = function(b) {
        "undefined" === typeof b && (b = "");
        d(arguments.length, 0, "export", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("FileSpec.export", {
            fs: this.id,
            save_as: b
        })
    };
    a.FileSpec.prototype.getFileData = function() {
        return a.sendWithPromise("FileSpec.getFileData", {
            fs: this.id
        }).then(function(b) {
            return f(a.Filter, b)
        })
    };
    a.FileSpec.prototype.getFilePath = function() {
        return a.sendWithPromise("FileSpec.getFilePath", {
            fs: this.id
        })
    };
    a.FileSpec.prototype.setDesc = function(b) {
        d(arguments.length, 1, "setDesc", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("FileSpec.setDesc", {
            fs: this.id,
            desc: b
        })
    };
    a.FileSpec.prototype.getSDFObj = function() {
        return a.sendWithPromise("FileSpec.getSDFObj", {
            fs: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Flattener.create = function() {
        return a.sendWithPromise("flattenerCreate", {}).then(function(b) {
            return l(a.Flattener, b)
        })
    };
    a.Flattener.prototype.setDPI = function(b) {
        d(arguments.length, 1, "setDPI", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("Flattener.setDPI", {
            flattener: this.id,
            dpi: b
        })
    };
    a.Flattener.prototype.setThreshold = function(b) {
        d(arguments.length, 1, "setThreshold", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("Flattener.setThreshold", {
            flattener: this.id,
            threshold: b
        })
    };
    a.Flattener.prototype.setMaximumImagePixels = function(b) {
        d(arguments.length, 1, "setMaximumImagePixels",
            "(number)", [
                [b, "number"]
            ]);
        return a.sendWithPromise("Flattener.setMaximumImagePixels", {
            flattener: this.id,
            max_pixels: b
        })
    };
    a.Flattener.prototype.setPreferJPG = function(b) {
        d(arguments.length, 1, "setPreferJPG", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("Flattener.setPreferJPG", {
            flattener: this.id,
            jpg: b
        })
    };
    a.Flattener.prototype.setJPGQuality = function(b) {
        d(arguments.length, 1, "setJPGQuality", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("Flattener.setJPGQuality", {
            flattener: this.id,
            quality: b
        })
    };
    a.Flattener.prototype.setPathHinting = function(b) {
        d(arguments.length, 1, "setPathHinting", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("Flattener.setPathHinting", {
            flattener: this.id,
            hinting: b
        })
    };
    a.Flattener.prototype.process = function(b, c) {
        d(arguments.length, 2, "process", "(PDFNet.PDFDoc, number)", [
            [b, "PDFDoc"],
            [c, "number"]
        ]);
        return a.sendWithPromise("Flattener.process", {
            flattener: this.id,
            doc: b.id,
            mode: c
        })
    };
    a.Flattener.prototype.processPage = function(b, c) {
        d(arguments.length, 2, "processPage", "(PDFNet.Page, number)",
            [
                [b, "Object", a.Page, "Page"],
                [c, "number"]
            ]);
        return a.sendWithPromise("Flattener.processPage", {
            flattener: this.id,
            page: b.id,
            mode: c
        })
    };
    a.Font.createFromObj = function(b) {
        "undefined" === typeof b && (b = new a.Obj("0"));
        d(arguments.length, 0, "createFromObj", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("fontCreateFromObj", {
            font_dict: b.id
        }).then(function(b) {
            return l(a.Font, b)
        })
    };
    a.Font.create = function(b, c) {
        d(arguments.length, 2, "create", "(PDFNet.SDFDoc, number)", [
            [b, "SDFDoc"],
            [c, "number"]
        ]);
        return a.sendWithPromise("fontCreate", {
            doc: b.id,
            type: c
        }).then(function(b) {
            return l(a.Font, b)
        })
    };
    a.Font.createFromFontDescriptor = function(b, c, e) {
        d(arguments.length, 3, "createFromFontDescriptor", "(PDFNet.SDFDoc, PDFNet.Font, string)", [
            [b, "SDFDoc"],
            [c, "Object", a.Font, "Font"],
            [e, "string"]
        ]);
        return a.sendWithPromise("fontCreateFromFontDescriptor", {
            doc: b.id,
            from: c.id,
            char_set: e
        }).then(function(b) {
            return l(a.Font, b)
        })
    };
    a.Font.createFromName = function(b, c, e) {
        d(arguments.length, 3, "createFromName", "(PDFNet.SDFDoc, string, string)",
            [
                [b, "SDFDoc"],
                [c, "string"],
                [e, "string"]
            ]);
        return a.sendWithPromise("fontCreateFromName", {
            doc: b.id,
            name: c,
            char_set: e
        }).then(function(b) {
            return l(a.Font, b)
        })
    };
    a.Font.createAndEmbed = function(b, c) {
        d(arguments.length, 2, "createAndEmbed", "(PDFNet.SDFDoc, number)", [
            [b, "SDFDoc"],
            [c, "number"]
        ]);
        return a.sendWithPromise("fontCreateAndEmbed", {
            doc: b.id,
            type: c
        }).then(function(b) {
            return l(a.Font, b)
        })
    };
    a.Font.createTrueTypeFont = function(b, c, e, m) {
        "undefined" === typeof e && (e = !0);
        "undefined" === typeof m && (m = !0);
        d(arguments.length,
            2, "createTrueTypeFont", "(PDFNet.SDFDoc, string, boolean, boolean)", [
                [b, "SDFDoc"],
                [c, "string"],
                [e, "boolean"],
                [m, "boolean"]
            ]);
        return a.sendWithPromise("fontCreateTrueTypeFont", {
            doc: b.id,
            font_path: c,
            embed: e,
            subset: m
        }).then(function(b) {
            return l(a.Font, b)
        })
    };
    a.Font.createTrueTypeFontWithBuffer = function(b, c, e, m) {
        "undefined" === typeof e && (e = !0);
        "undefined" === typeof m && (m = !0);
        d(arguments.length, 2, "createTrueTypeFontWithBuffer", "(PDFNet.SDFDoc, ArrayBuffer|TypedArray, boolean, boolean)", [
            [b, "SDFDoc"],
            [c, "ArrayBuffer"],
            [e, "boolean"],
            [m, "boolean"]
        ]);
        c = u(c, !1);
        return a.sendWithPromise("fontCreateTrueTypeFontWithBuffer", {
            doc: b.id,
            font_path: c,
            embed: e,
            subset: m
        }).then(function(b) {
            return l(a.Font, b)
        })
    };
    a.Font.createCIDTrueTypeFont = function(b, c, e, m, f, g) {
        "undefined" === typeof e && (e = !0);
        "undefined" === typeof m && (m = !0);
        "undefined" === typeof f && (f = a.Font.Encoding.e_IdentityH);
        "undefined" === typeof g && (g = 0);
        d(arguments.length, 2, "createCIDTrueTypeFont", "(PDFNet.SDFDoc, string, boolean, boolean, number, number)", [
            [b, "SDFDoc"],
            [c,
                "string"
            ],
            [e, "boolean"],
            [m, "boolean"],
            [f, "number"],
            [g, "number"]
        ]);
        return a.sendWithPromise("fontCreateCIDTrueTypeFont", {
            doc: b.id,
            font_path: c,
            embed: e,
            subset: m,
            encoding: f,
            ttc_font_index: g
        }).then(function(b) {
            return l(a.Font, b)
        })
    };
    a.Font.createCIDTrueTypeFontWithBuffer = function(b, c, e, m, f, g) {
        "undefined" === typeof e && (e = !0);
        "undefined" === typeof m && (m = !0);
        "undefined" === typeof f && (f = a.Font.Encoding.e_IdentityH);
        "undefined" === typeof g && (g = 0);
        d(arguments.length, 2, "createCIDTrueTypeFontWithBuffer", "(PDFNet.SDFDoc, ArrayBuffer|TypedArray, boolean, boolean, number, number)",
            [
                [b, "SDFDoc"],
                [c, "ArrayBuffer"],
                [e, "boolean"],
                [m, "boolean"],
                [f, "number"],
                [g, "number"]
            ]);
        c = u(c, !1);
        return a.sendWithPromise("fontCreateCIDTrueTypeFontWithBuffer", {
            doc: b.id,
            font_path: c,
            embed: e,
            subset: m,
            encoding: f,
            ttc_font_index: g
        }).then(function(b) {
            return l(a.Font, b)
        })
    };
    a.Font.createType1Font = function(b, c, e) {
        "undefined" === typeof e && (e = !0);
        d(arguments.length, 2, "createType1Font", "(PDFNet.SDFDoc, string, boolean)", [
            [b, "SDFDoc"],
            [c, "string"],
            [e, "boolean"]
        ]);
        return a.sendWithPromise("fontCreateType1Font", {
            doc: b.id,
            font_path: c,
            embed: e
        }).then(function(b) {
            return l(a.Font, b)
        })
    };
    a.Font.createType1FontWithBuffer = function(b, c, e) {
        "undefined" === typeof e && (e = !0);
        d(arguments.length, 2, "createType1FontWithBuffer", "(PDFNet.SDFDoc, ArrayBuffer|TypedArray, boolean)", [
            [b, "SDFDoc"],
            [c, "ArrayBuffer"],
            [e, "boolean"]
        ]);
        c = u(c, !1);
        return a.sendWithPromise("fontCreateType1FontWithBuffer", {
            doc: b.id,
            font_path: c,
            embed: e
        }).then(function(b) {
            return l(a.Font, b)
        })
    };
    a.Font.prototype.getType = function() {
        return a.sendWithPromise("Font.getType", {
            font: this.id
        })
    };
    a.Font.prototype.isSimple = function() {
        return a.sendWithPromise("Font.isSimple", {
            font: this.id
        })
    };
    a.Font.getTypeFromObj = function(b) {
        d(arguments.length, 1, "getTypeFromObj", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("fontGetTypeFromObj", {
            font_dict: b.id
        })
    };
    a.Font.prototype.getSDFObj = function() {
        return a.sendWithPromise("Font.getSDFObj", {
            font: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Font.prototype.getDescriptor = function() {
        return a.sendWithPromise("Font.getDescriptor", {
            font: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Font.prototype.getName = function() {
        return a.sendWithPromise("Font.getName", {
            font: this.id
        })
    };
    a.Font.prototype.getFamilyName = function() {
        return a.sendWithPromise("Font.getFamilyName", {
            font: this.id
        })
    };
    a.Font.prototype.isFixedWidth = function() {
        return a.sendWithPromise("Font.isFixedWidth", {
            font: this.id
        })
    };
    a.Font.prototype.isSerif = function() {
        return a.sendWithPromise("Font.isSerif", {
            font: this.id
        })
    };
    a.Font.prototype.isSymbolic = function() {
        return a.sendWithPromise("Font.isSymbolic", {
            font: this.id
        })
    };
    a.Font.prototype.isItalic = function() {
        return a.sendWithPromise("Font.isItalic", {
            font: this.id
        })
    };
    a.Font.prototype.isAllCap = function() {
        return a.sendWithPromise("Font.isAllCap", {
            font: this.id
        })
    };
    a.Font.prototype.isForceBold = function() {
        return a.sendWithPromise("Font.isForceBold", {
            font: this.id
        })
    };
    a.Font.prototype.isHorizontalMode = function() {
        return a.sendWithPromise("Font.isHorizontalMode", {
            font: this.id
        })
    };
    a.Font.prototype.getWidth = function(b) {
        d(arguments.length, 1, "getWidth", "(number)", [
            [b,
                "number"
            ]
        ]);
        return a.sendWithPromise("Font.getWidth", {
            font: this.id,
            char_code: b
        })
    };
    a.Font.prototype.getMaxWidth = function() {
        return a.sendWithPromise("Font.getMaxWidth", {
            font: this.id
        })
    };
    a.Font.prototype.getMissingWidth = function() {
        return a.sendWithPromise("Font.getMissingWidth", {
            font: this.id
        })
    };
    a.Font.prototype.getCharCodeIterator = function() {
        return a.sendWithPromise("Font.getCharCodeIterator", {
            font: this.id
        }).then(function(b) {
            return l(a.Iterator, b, "Int")
        })
    };
    a.Font.prototype.getShapedText = function(b) {
        d(arguments.length,
            1, "getShapedText", "(string)", [
                [b, "string"]
            ]);
        return a.sendWithPromise("Font.getShapedText", {
            font: this.id,
            text_to_shape: b
        }).then(function(b) {
            return l(a.ShapedText, b)
        })
    };
    a.Font.prototype.getEncoding = function() {
        return a.sendWithPromise("Font.getEncoding", {
            font: this.id
        })
    };
    a.Font.prototype.isEmbedded = function() {
        return a.sendWithPromise("Font.isEmbedded", {
            font: this.id
        })
    };
    a.Font.prototype.getEmbeddedFontName = function() {
        return a.sendWithPromise("Font.getEmbeddedFontName", {
            font: this.id
        })
    };
    a.Font.prototype.getEmbeddedFont =
        function() {
            return a.sendWithPromise("Font.getEmbeddedFont", {
                font: this.id
            }).then(function(b) {
                return f(a.Obj, b)
            })
        };
    a.Font.prototype.getEmbeddedFontBufSize = function() {
        return a.sendWithPromise("Font.getEmbeddedFontBufSize", {
            font: this.id
        })
    };
    a.Font.prototype.getUnitsPerEm = function() {
        return a.sendWithPromise("Font.getUnitsPerEm", {
            font: this.id
        })
    };
    a.Font.prototype.getBBox = function() {
        return a.sendWithPromise("Font.getBBox", {
            font: this.id
        }).then(function(b) {
            return new a.Rect(b)
        })
    };
    a.Font.prototype.getAscent =
        function() {
            return a.sendWithPromise("Font.getAscent", {
                font: this.id
            })
        };
    a.Font.prototype.getDescent = function() {
        return a.sendWithPromise("Font.getDescent", {
            font: this.id
        })
    };
    a.Font.prototype.getStandardType1FontType = function() {
        return a.sendWithPromise("Font.getStandardType1FontType", {
            font: this.id
        })
    };
    a.Font.prototype.isCFF = function() {
        return a.sendWithPromise("Font.isCFF", {
            font: this.id
        })
    };
    a.Font.prototype.getType3FontMatrix = function() {
        return a.sendWithPromise("Font.getType3FontMatrix", {
            font: this.id
        }).then(function(b) {
            return new a.Matrix2D(b)
        })
    };
    a.Font.prototype.getType3GlyphStream = function(b) {
        d(arguments.length, 1, "getType3GlyphStream", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("Font.getType3GlyphStream", {
            font: this.id,
            char_code: b
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Font.prototype.getVerticalAdvance = function(b) {
        d(arguments.length, 1, "getVerticalAdvance", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("Font.getVerticalAdvance", {
            font: this.id,
            char_code: b
        })
    };
    a.Font.prototype.getDescendant = function() {
        return a.sendWithPromise("Font.getDescendant", {
            font: this.id
        }).then(function(b) {
            return l(a.Font, b)
        })
    };
    a.Font.prototype.mapToCID = function(b) {
        d(arguments.length, 1, "mapToCID", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("Font.mapToCID", {
            font: this.id,
            char_code: b
        })
    };
    a.Function.create = function(b) {
        "undefined" === typeof b && (b = new a.Obj("0"));
        d(arguments.length, 0, "create", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("functionCreate", {
            funct_dict: b.id
        }).then(function(b) {
            return l(a.Function, b)
        })
    };
    a.Function.prototype.getType =
        function() {
            return a.sendWithPromise("Function.getType", {
                f: this.id
            })
        };
    a.Function.prototype.getInputCardinality = function() {
        return a.sendWithPromise("Function.getInputCardinality", {
            f: this.id
        })
    };
    a.Function.prototype.getOutputCardinality = function() {
        return a.sendWithPromise("Function.getOutputCardinality", {
            f: this.id
        })
    };
    a.Function.prototype.eval = function(b, c) {
        d(arguments.length, 2, "eval", "(number, number)", [
            [b, "number"],
            [c, "number"]
        ]);
        return a.sendWithPromise("Function.eval", {
            f: this.id,
            inval: b,
            outval: c
        })
    };
    a.Function.prototype.getSDFObj = function() {
        return a.sendWithPromise("Function.getSDFObj", {
            f: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Highlights.create = function() {
        return a.sendWithPromise("highlightsCreate", {}).then(function(b) {
            return l(a.Highlights, b)
        })
    };
    a.Highlights.prototype.copyCtor = function() {
        return a.sendWithPromise("Highlights.copyCtor", {
            hlts: this.id
        }).then(function(b) {
            return l(a.Highlights, b)
        })
    };
    a.Highlights.prototype.add = function(b) {
        d(arguments.length, 1, "add", "(PDFNet.Highlights)",
            [
                [b, "Object", a.Highlights, "Highlights"]
            ]);
        return a.sendWithPromise("Highlights.add", {
            hlts2: this.id,
            hlts: b.id
        })
    };
    a.Highlights.prototype.load = function(b) {
        d(arguments.length, 1, "load", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("Highlights.load", {
            hlts: this.id,
            file_name: b
        })
    };
    a.Highlights.prototype.save = function(b) {
        d(arguments.length, 1, "save", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("Highlights.save", {
            hlts: this.id,
            file_name: b
        })
    };
    a.Highlights.prototype.saveToString = function() {
        return a.sendWithPromise("Highlights.saveToString", {
            hlts: this.id
        })
    };
    a.Highlights.prototype.clear = function() {
        return a.sendWithPromise("Highlights.clear", {
            hlts: this.id
        })
    };
    a.Highlights.prototype.begin = function(b) {
        d(arguments.length, 1, "begin", "(PDFNet.PDFDoc)", [
            [b, "PDFDoc"]
        ]);
        return a.sendWithPromise("Highlights.begin", {
            hlts: this.id,
            doc: b.id
        })
    };
    a.Highlights.prototype.hasNext = function() {
        return a.sendWithPromise("Highlights.hasNext", {
            hlts: this.id
        })
    };
    a.Highlights.prototype.next = function() {
        return a.sendWithPromise("Highlights.next", {
            hlts: this.id
        })
    };
    a.Highlights.prototype.getCurrentPageNumber =
        function() {
            return a.sendWithPromise("Highlights.getCurrentPageNumber", {
                hlts: this.id
            })
        };
    a.Highlights.prototype.getCurrentTextRange = function() {
        return a.sendWithPromise("Highlights.getCurrentTextRange", {
            hlts: this.id
        }).then(function(b) {
            return f(a.TextRange, b)
        })
    };
    a.HTML2PDF.Proxy.create = function() {
        return a.sendWithPromise("HTML2PDF.proxyCreate", {}).then(function(b) {
            return l(a.HTML2PDF.Proxy, b)
        })
    };
    a.HTML2PDF.Proxy.prototype.setType = function(b) {
        d(arguments.length, 1, "setType", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("HTML2PDF.Proxy.setType", {
            proxy: this.id,
            type: b
        })
    };
    a.HTML2PDF.Proxy.prototype.setPort = function(b) {
        d(arguments.length, 1, "setPort", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("HTML2PDF.Proxy.setPort", {
            proxy: this.id,
            port: b
        })
    };
    a.HTML2PDF.Proxy.prototype.setHost = function(b) {
        d(arguments.length, 1, "setHost", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("HTML2PDF.Proxy.setHost", {
            proxy: this.id,
            host: b
        })
    };
    a.HTML2PDF.Proxy.prototype.setUsername = function(b) {
        d(arguments.length, 1, "setUsername", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("HTML2PDF.Proxy.setUsername", {
            proxy: this.id,
            username: b
        })
    };
    a.HTML2PDF.Proxy.prototype.setPassword = function(b) {
        d(arguments.length, 1, "setPassword", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("HTML2PDF.Proxy.setPassword", {
            proxy: this.id,
            password: b
        })
    };
    a.HTML2PDF.WebPageSettings.create = function() {
        return a.sendWithPromise("HTML2PDF.webPageSettingsCreate", {}).then(function(b) {
            return l(a.HTML2PDF.WebPageSettings, b)
        })
    };
    a.HTML2PDF.WebPageSettings.prototype.setPrintBackground = function(b) {
        d(arguments.length, 1, "setPrintBackground",
            "(boolean)", [
                [b, "boolean"]
            ]);
        return a.sendWithPromise("HTML2PDF.WebPageSettings.setPrintBackground", {
            settings: this.id,
            background: b
        })
    };
    a.HTML2PDF.WebPageSettings.prototype.setLoadImages = function(b) {
        d(arguments.length, 1, "setLoadImages", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("HTML2PDF.WebPageSettings.setLoadImages", {
            settings: this.id,
            load: b
        })
    };
    a.HTML2PDF.WebPageSettings.prototype.setAllowJavaScript = function(b) {
        d(arguments.length, 1, "setAllowJavaScript", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("HTML2PDF.WebPageSettings.setAllowJavaScript", {
            settings: this.id,
            enable: b
        })
    };
    a.HTML2PDF.WebPageSettings.prototype.setSmartShrinking = function(b) {
        d(arguments.length, 1, "setSmartShrinking", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("HTML2PDF.WebPageSettings.setSmartShrinking", {
            settings: this.id,
            enable: b
        })
    };
    a.HTML2PDF.WebPageSettings.prototype.setMinimumFontSize = function(b) {
        d(arguments.length, 1, "setMinimumFontSize", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("HTML2PDF.WebPageSettings.setMinimumFontSize", {
            settings: this.id,
            size: b
        })
    };
    a.HTML2PDF.WebPageSettings.prototype.setDefaultEncoding = function(b) {
        d(arguments.length, 1, "setDefaultEncoding", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("HTML2PDF.WebPageSettings.setDefaultEncoding", {
            settings: this.id,
            encoding: b
        })
    };
    a.HTML2PDF.WebPageSettings.prototype.setUserStyleSheet = function(b) {
        d(arguments.length, 1, "setUserStyleSheet", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("HTML2PDF.WebPageSettings.setUserStyleSheet", {
            settings: this.id,
            url: b
        })
    };
    a.HTML2PDF.WebPageSettings.prototype.setAllowPlugins =
        function(b) {
            d(arguments.length, 1, "setAllowPlugins", "(boolean)", [
                [b, "boolean"]
            ]);
            return a.sendWithPromise("HTML2PDF.WebPageSettings.setAllowPlugins", {
                settings: this.id,
                enable: b
            })
        };
    a.HTML2PDF.WebPageSettings.prototype.setPrintMediaType = function(b) {
        d(arguments.length, 1, "setPrintMediaType", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("HTML2PDF.WebPageSettings.setPrintMediaType", {
            settings: this.id,
            print: b
        })
    };
    a.HTML2PDF.WebPageSettings.prototype.setIncludeInOutline = function(b) {
        d(arguments.length,
            1, "setIncludeInOutline", "(boolean)", [
                [b, "boolean"]
            ]);
        return a.sendWithPromise("HTML2PDF.WebPageSettings.setIncludeInOutline", {
            settings: this.id,
            include: b
        })
    };
    a.HTML2PDF.WebPageSettings.prototype.setUsername = function(b) {
        d(arguments.length, 1, "setUsername", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("HTML2PDF.WebPageSettings.setUsername", {
            settings: this.id,
            username: b
        })
    };
    a.HTML2PDF.WebPageSettings.prototype.setPassword = function(b) {
        d(arguments.length, 1, "setPassword", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("HTML2PDF.WebPageSettings.setPassword", {
            settings: this.id,
            password: b
        })
    };
    a.HTML2PDF.WebPageSettings.prototype.setJavaScriptDelay = function(b) {
        d(arguments.length, 1, "setJavaScriptDelay", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("HTML2PDF.WebPageSettings.setJavaScriptDelay", {
            settings: this.id,
            msec: b
        })
    };
    a.HTML2PDF.WebPageSettings.prototype.setTimeout = function(b) {
        d(arguments.length, 1, "setTimeout", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("HTML2PDF.WebPageSettings.setTimeout", {
            settings: this.id,
            msec: b
        })
    };
    a.HTML2PDF.WebPageSettings.prototype.setZoom =
        function(b) {
            d(arguments.length, 1, "setZoom", "(number)", [
                [b, "number"]
            ]);
            return a.sendWithPromise("HTML2PDF.WebPageSettings.setZoom", {
                settings: this.id,
                zoom: b
            })
        };
    a.HTML2PDF.WebPageSettings.prototype.setBlockLocalFileAccess = function(b) {
        d(arguments.length, 1, "setBlockLocalFileAccess", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("HTML2PDF.WebPageSettings.setBlockLocalFileAccess", {
            settings: this.id,
            block: b
        })
    };
    a.HTML2PDF.WebPageSettings.prototype.setStopSlowScripts = function(b) {
        d(arguments.length, 1,
            "setStopSlowScripts", "(boolean)", [
                [b, "boolean"]
            ]);
        return a.sendWithPromise("HTML2PDF.WebPageSettings.setStopSlowScripts", {
            settings: this.id,
            stop: b
        })
    };
    a.HTML2PDF.WebPageSettings.prototype.setDebugJavaScriptOutput = function(b) {
        d(arguments.length, 1, "setDebugJavaScriptOutput", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("HTML2PDF.WebPageSettings.setDebugJavaScriptOutput", {
            settings: this.id,
            forward: b
        })
    };
    a.HTML2PDF.WebPageSettings.prototype.setLoadErrorHandling = function(b) {
        d(arguments.length, 1, "setLoadErrorHandling",
            "(number)", [
                [b, "number"]
            ]);
        return a.sendWithPromise("HTML2PDF.WebPageSettings.setLoadErrorHandling", {
            settings: this.id,
            val: b
        })
    };
    a.HTML2PDF.WebPageSettings.prototype.setExternalLinks = function(b) {
        d(arguments.length, 1, "setExternalLinks", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("HTML2PDF.WebPageSettings.setExternalLinks", {
            settings: this.id,
            convert: b
        })
    };
    a.HTML2PDF.WebPageSettings.prototype.setInternalLinks = function(b) {
        d(arguments.length, 1, "setInternalLinks", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("HTML2PDF.WebPageSettings.setInternalLinks", {
            settings: this.id,
            convert: b
        })
    };
    a.HTML2PDF.WebPageSettings.prototype.setProduceForms = function(b) {
        d(arguments.length, 1, "setProduceForms", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("HTML2PDF.WebPageSettings.setProduceForms", {
            settings: this.id,
            forms: b
        })
    };
    a.HTML2PDF.WebPageSettings.prototype.setProxy = function(b) {
        d(arguments.length, 1, "setProxy", "(PDFNet.HTML2PDF.Proxy)", [
            [b, "Object", a.HTML2PDF.Proxy, "HTML2PDF.Proxy"]
        ]);
        return a.sendWithPromise("HTML2PDF.WebPageSettings.setProxy", {
            settings: this.id,
            proxy: b.id
        })
    };
    a.HTML2PDF.TOCSettings.create = function() {
        return a.sendWithPromise("HTML2PDF.tocSettingsCreate", {}).then(function(b) {
            return l(a.HTML2PDF.TOCSettings, b)
        })
    };
    a.HTML2PDF.TOCSettings.prototype.setDottedLines = function(b) {
        d(arguments.length, 1, "setDottedLines", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("HTML2PDF.TOCSettings.setDottedLines", {
            settings: this.id,
            enable: b
        })
    };
    a.HTML2PDF.TOCSettings.prototype.setLinks = function(b) {
        d(arguments.length, 1, "setLinks", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("HTML2PDF.TOCSettings.setLinks", {
            settings: this.id,
            enable: b
        })
    };
    a.HTML2PDF.TOCSettings.prototype.setCaptionText = function(b) {
        d(arguments.length, 1, "setCaptionText", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("HTML2PDF.TOCSettings.setCaptionText", {
            settings: this.id,
            caption: b
        })
    };
    a.HTML2PDF.TOCSettings.prototype.setLevelIndentation = function(b) {
        d(arguments.length, 1, "setLevelIndentation", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("HTML2PDF.TOCSettings.setLevelIndentation", {
            settings: this.id,
            indentation: b
        })
    };
    a.HTML2PDF.TOCSettings.prototype.setTextSizeShrink = function(b) {
        d(arguments.length, 1, "setTextSizeShrink", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("HTML2PDF.TOCSettings.setTextSizeShrink", {
            settings: this.id,
            shrink: b
        })
    };
    a.HTML2PDF.TOCSettings.prototype.setXsl = function(b) {
        d(arguments.length, 1, "setXsl", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("HTML2PDF.TOCSettings.setXsl", {
            settings: this.id,
            style_sheet: b
        })
    };
    a.HTML2PDF.staticConvert = function(b, c) {
        d(arguments.length,
            2, "staticConvert", "(PDFNet.PDFDoc, string)", [
                [b, "PDFDoc"],
                [c, "string"]
            ]);
        return a.sendWithPromise("htmL2PDFStaticConvert", {
            doc: b.id,
            url: c
        })
    };
    a.HTML2PDF.staticConvert2 = function(b, c, e) {
        d(arguments.length, 3, "staticConvert2", "(PDFNet.PDFDoc, string, PDFNet.HTML2PDF.WebPageSettings)", [
            [b, "PDFDoc"],
            [c, "string"],
            [e, "Object", a.HTML2PDF.WebPageSettings, "HTML2PDF.WebPageSettings"]
        ]);
        return a.sendWithPromise("htmL2PDFStaticConvert2", {
            doc: b.id,
            url: c,
            settings: e.id
        })
    };
    a.HTML2PDF.create = function() {
        return a.sendWithPromise("htmL2PDFCreate", {}).then(function(b) {
            return l(a.HTML2PDF, b)
        })
    };
    a.HTML2PDF.prototype.insertFromUrl = function(b) {
        d(arguments.length, 1, "insertFromUrl", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("HTML2PDF.insertFromUrl", {
            html2pdf: this.id,
            url: b
        })
    };
    a.HTML2PDF.prototype.insertFromUrl2 = function(b, c) {
        d(arguments.length, 2, "insertFromUrl2", "(string, PDFNet.HTML2PDF.WebPageSettings)", [
            [b, "string"],
            [c, "Object", a.HTML2PDF.WebPageSettings, "HTML2PDF.WebPageSettings"]
        ]);
        return a.sendWithPromise("HTML2PDF.insertFromUrl2", {
            html2pdf: this.id,
            url: b,
            settings: c.id
        })
    };
    a.HTML2PDF.prototype.insertFromHtmlString = function(b) {
        d(arguments.length, 1, "insertFromHtmlString", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("HTML2PDF.insertFromHtmlString", {
            html2pdf: this.id,
            html: b
        })
    };
    a.HTML2PDF.prototype.insertFromHtmlString2 = function(b, c) {
        d(arguments.length, 2, "insertFromHtmlString2", "(string, PDFNet.HTML2PDF.WebPageSettings)", [
            [b, "string"],
            [c, "Object", a.HTML2PDF.WebPageSettings, "HTML2PDF.WebPageSettings"]
        ]);
        return a.sendWithPromise("HTML2PDF.insertFromHtmlString2", {
            html2pdf: this.id,
            html: b,
            settings: c.id
        })
    };
    a.HTML2PDF.prototype.insertTOC = function() {
        return a.sendWithPromise("HTML2PDF.insertTOC", {
            html2pdf: this.id
        })
    };
    a.HTML2PDF.prototype.insertTOC2 = function(b) {
        d(arguments.length, 1, "insertTOC2", "(PDFNet.HTML2PDF.TOCSettings)", [
            [b, "Object", a.HTML2PDF.TOCSettings, "HTML2PDF.TOCSettings"]
        ]);
        return a.sendWithPromise("HTML2PDF.insertTOC2", {
            html2pdf: this.id,
            settings: b.id
        })
    };
    a.HTML2PDF.prototype.convert = function(b) {
        d(arguments.length, 1, "convert", "(PDFNet.PDFDoc)", [
            [b, "PDFDoc"]
        ]);
        return a.sendWithPromise("HTML2PDF.convert", {
            html2pdf: this.id,
            doc: b.id
        })
    };
    a.HTML2PDF.prototype.getHttpErrorCode = function() {
        return a.sendWithPromise("HTML2PDF.getHttpErrorCode", {
            html2pdf: this.id
        })
    };
    a.HTML2PDF.prototype.getLog = function() {
        return a.sendWithPromise("HTML2PDF.getLog", {
            html2pdf: this.id
        })
    };
    a.HTML2PDF.prototype.setPaperSize = function(b) {
        d(arguments.length, 1, "setPaperSize", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("HTML2PDF.setPaperSize", {
            html2pdf: this.id,
            size: b
        })
    };
    a.HTML2PDF.prototype.setPaperSize2 =
        function(b, c) {
            d(arguments.length, 2, "setPaperSize2", "(string, string)", [
                [b, "string"],
                [c, "string"]
            ]);
            return a.sendWithPromise("HTML2PDF.setPaperSize2", {
                html2pdf: this.id,
                width: b,
                height: c
            })
        };
    a.HTML2PDF.prototype.setLandscape = function(b) {
        d(arguments.length, 1, "setLandscape", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("HTML2PDF.setLandscape", {
            html2pdf: this.id,
            enable: b
        })
    };
    a.HTML2PDF.prototype.setDPI = function(b) {
        d(arguments.length, 1, "setDPI", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("HTML2PDF.setDPI", {
            html2pdf: this.id,
            dpi: b
        })
    };
    a.HTML2PDF.prototype.setOutline = function(b, c) {
        "undefined" === typeof c && (c = 4);
        d(arguments.length, 1, "setOutline", "(boolean, number)", [
            [b, "boolean"],
            [c, "number"]
        ]);
        return a.sendWithPromise("HTML2PDF.setOutline", {
            html2pdf: this.id,
            enable: b,
            depth: c
        })
    };
    a.HTML2PDF.prototype.dumpOutline = function(b) {
        d(arguments.length, 1, "dumpOutline", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("HTML2PDF.dumpOutline", {
            html2pdf: this.id,
            xml_file: b
        })
    };
    a.HTML2PDF.prototype.setPDFCompression = function(b) {
        d(arguments.length,
            1, "setPDFCompression", "(boolean)", [
                [b, "boolean"]
            ]);
        return a.sendWithPromise("HTML2PDF.setPDFCompression", {
            html2pdf: this.id,
            enable: b
        })
    };
    a.HTML2PDF.prototype.setMargins = function(b, c, e, m) {
        d(arguments.length, 4, "setMargins", "(string, string, string, string)", [
            [b, "string"],
            [c, "string"],
            [e, "string"],
            [m, "string"]
        ]);
        return a.sendWithPromise("HTML2PDF.setMargins", {
            html2pdf: this.id,
            top: b,
            bottom: c,
            left: e,
            right: m
        })
    };
    a.HTML2PDF.prototype.setHeader = function(b) {
        d(arguments.length, 1, "setHeader", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("HTML2PDF.setHeader", {
            html2pdf: this.id,
            header: b
        })
    };
    a.HTML2PDF.prototype.setFooter = function(b) {
        d(arguments.length, 1, "setFooter", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("HTML2PDF.setFooter", {
            html2pdf: this.id,
            footer: b
        })
    };
    a.HTML2PDF.prototype.setImageDPI = function(b) {
        d(arguments.length, 1, "setImageDPI", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("HTML2PDF.setImageDPI", {
            html2pdf: this.id,
            dpi: b
        })
    };
    a.HTML2PDF.prototype.setImageQuality = function(b) {
        d(arguments.length,
            1, "setImageQuality", "(number)", [
                [b, "number"]
            ]);
        return a.sendWithPromise("HTML2PDF.setImageQuality", {
            html2pdf: this.id,
            quality: b
        })
    };
    a.HTML2PDF.prototype.setCookieJar = function(b) {
        d(arguments.length, 1, "setCookieJar", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("HTML2PDF.setCookieJar", {
            html2pdf: this.id,
            path: b
        })
    };
    a.HTML2PDF.prototype.setQuiet = function(b) {
        d(arguments.length, 1, "setQuiet", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("HTML2PDF.setQuiet", {
            html2pdf: this.id,
            quiet: b
        })
    };
    a.HTML2PDF.setModulePath =
        function(b) {
            d(arguments.length, 1, "setModulePath", "(string)", [
                [b, "string"]
            ]);
            return a.sendWithPromise("htmL2PDFSetModulePath", {
                path: b
            })
        };
    a.HTML2PDF.isModuleAvailable = function() {
        return a.sendWithPromise("htmL2PDFIsModuleAvailable", {})
    };
    a.HTML2PDF.prototype.addCookie = function(b, c) {
        d(arguments.length, 2, "addCookie", "(string, string)", [
            [b, "string"],
            [c, "string"]
        ]);
        return a.sendWithPromise("HTML2PDF.addCookie", {
            self: this.id,
            name: b,
            value: c
        })
    };
    a.Image.createFromFile = function(b, c, e) {
        "undefined" === typeof e &&
            (e = new a.Obj("0"));
        d(arguments.length, 2, "createFromFile", "(PDFNet.SDFDoc, string, PDFNet.Obj)", [
            [b, "SDFDoc"],
            [c, "string"],
            [e, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("imageCreateFromFile", {
            doc: b.id,
            filename: c,
            encoder_hints: e.id
        }).then(function(b) {
            return f(a.Image, b)
        })
    };
    a.Image.createFromMemory = function(b, c, e, m, g, h, k) {
        "undefined" === typeof k && (k = new a.Obj("0"));
        d(arguments.length, 6, "createFromMemory", "(PDFNet.SDFDoc, ArrayBuffer|TypedArray, number, number, number, PDFNet.ColorSpace, PDFNet.Obj)",
            [
                [b, "SDFDoc"],
                [c, "ArrayBuffer"],
                [e, "number"],
                [m, "number"],
                [g, "number"],
                [h, "Object", a.ColorSpace, "ColorSpace"],
                [k, "Object", a.Obj, "Obj"]
            ]);
        var w = u(c, !1);
        return a.sendWithPromise("imageCreateFromMemory", {
            doc: b.id,
            buf: w,
            width: e,
            height: m,
            bpc: g,
            color_space: h.id,
            encoder_hints: k.id
        }).then(function(b) {
            return f(a.Image, b)
        })
    };
    a.Image.createFromMemory2 = function(b, c, e) {
        "undefined" === typeof e && (e = new a.Obj("0"));
        d(arguments.length, 2, "createFromMemory2", "(PDFNet.SDFDoc, ArrayBuffer|TypedArray, PDFNet.Obj)", [
            [b,
                "SDFDoc"
            ],
            [c, "ArrayBuffer"],
            [e, "Object", a.Obj, "Obj"]
        ]);
        var m = u(c, !1);
        return a.sendWithPromise("imageCreateFromMemory2", {
            doc: b.id,
            buf: m,
            encoder_hints: e.id
        }).then(function(b) {
            return f(a.Image, b)
        })
    };
    a.Image.createFromStream = function(b, c, e, m, g, h, k) {
        "undefined" === typeof k && (k = new a.Obj("0"));
        d(arguments.length, 6, "createFromStream", "(PDFNet.SDFDoc, PDFNet.FilterReader, number, number, number, PDFNet.ColorSpace, PDFNet.Obj)", [
            [b, "SDFDoc"],
            [c, "Object", a.FilterReader, "FilterReader"],
            [e, "number"],
            [m, "number"],
            [g, "number"],
            [h, "Object", a.ColorSpace, "ColorSpace"],
            [k, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("imageCreateFromStream", {
            doc: b.id,
            image_data: c.id,
            width: e,
            height: m,
            bpc: g,
            color_space: h.id,
            encoder_hints: k.id
        }).then(function(b) {
            return f(a.Image, b)
        })
    };
    a.Image.createFromStream2 = function(b, c, e) {
        "undefined" === typeof e && (e = new a.Obj("0"));
        d(arguments.length, 2, "createFromStream2", "(PDFNet.SDFDoc, PDFNet.Filter, PDFNet.Obj)", [
            [b, "SDFDoc"],
            [c, "Object", a.Filter, "Filter"],
            [e, "Object", a.Obj, "Obj"]
        ]);
        0 !=
            c.id && t(c.id);
        return a.sendWithPromise("imageCreateFromStream2", {
            doc: b.id,
            no_own_image_data: c.id,
            encoder_hints: e.id
        }).then(function(b) {
            return f(a.Image, b)
        })
    };
    a.Image.createImageMask = function(b, c, e, m, g) {
        "undefined" === typeof g && (g = new a.Obj("0"));
        d(arguments.length, 4, "createImageMask", "(PDFNet.SDFDoc, ArrayBuffer|TypedArray, number, number, PDFNet.Obj)", [
            [b, "SDFDoc"],
            [c, "ArrayBuffer"],
            [e, "number"],
            [m, "number"],
            [g, "Object", a.Obj, "Obj"]
        ]);
        var h = u(c, !1);
        return a.sendWithPromise("imageCreateImageMask", {
            doc: b.id,
            buf: h,
            width: e,
            height: m,
            encoder_hints: g.id
        }).then(function(b) {
            return f(a.Image, b)
        })
    };
    a.Image.createImageMaskFromStream = function(b, c, e, m, g) {
        "undefined" === typeof g && (g = new a.Obj("0"));
        d(arguments.length, 4, "createImageMaskFromStream", "(PDFNet.SDFDoc, PDFNet.FilterReader, number, number, PDFNet.Obj)", [
            [b, "SDFDoc"],
            [c, "Object", a.FilterReader, "FilterReader"],
            [e, "number"],
            [m, "number"],
            [g, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("imageCreateImageMaskFromStream", {
            doc: b.id,
            image_data: c.id,
            width: e,
            height: m,
            encoder_hints: g.id
        }).then(function(b) {
            return f(a.Image, b)
        })
    };
    a.Image.createSoftMask = function(b, c, e, m, g, h) {
        "undefined" === typeof h && (h = new a.Obj("0"));
        d(arguments.length, 5, "createSoftMask", "(PDFNet.SDFDoc, ArrayBuffer|TypedArray, number, number, number, PDFNet.Obj)", [
            [b, "SDFDoc"],
            [c, "ArrayBuffer"],
            [e, "number"],
            [m, "number"],
            [g, "number"],
            [h, "Object", a.Obj, "Obj"]
        ]);
        var k = u(c, !1);
        return a.sendWithPromise("imageCreateSoftMask", {
            doc: b.id,
            buf: k,
            width: e,
            height: m,
            bpc: g,
            encoder_hints: h.id
        }).then(function(b) {
            return f(a.Image,
                b)
        })
    };
    a.Image.createSoftMaskFromStream = function(b, c, e, m, g, h) {
        "undefined" === typeof h && (h = new a.Obj("0"));
        d(arguments.length, 5, "createSoftMaskFromStream", "(PDFNet.SDFDoc, PDFNet.FilterReader, number, number, number, PDFNet.Obj)", [
            [b, "SDFDoc"],
            [c, "Object", a.FilterReader, "FilterReader"],
            [e, "number"],
            [m, "number"],
            [g, "number"],
            [h, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("imageCreateSoftMaskFromStream", {
            doc: b.id,
            image_data: c.id,
            width: e,
            height: m,
            bpc: g,
            encoder_hints: h.id
        }).then(function(b) {
            return f(a.Image,
                b)
        })
    };
    a.Image.createDirectFromMemory = function(b, c, e, m, g, h, k) {
        d(arguments.length, 7, "createDirectFromMemory", "(PDFNet.SDFDoc, ArrayBuffer|TypedArray, number, number, number, PDFNet.ColorSpace, number)", [
            [b, "SDFDoc"],
            [c, "ArrayBuffer"],
            [e, "number"],
            [m, "number"],
            [g, "number"],
            [h, "Object", a.ColorSpace, "ColorSpace"],
            [k, "number"]
        ]);
        var w = u(c, !1);
        return a.sendWithPromise("imageCreateDirectFromMemory", {
            doc: b.id,
            buf: w,
            width: e,
            height: m,
            bpc: g,
            color_space: h.id,
            input_format: k
        }).then(function(b) {
            return f(a.Image,
                b)
        })
    };
    a.Image.createDirectFromStream = function(b, c, e, m, g, h, k) {
        d(arguments.length, 7, "createDirectFromStream", "(PDFNet.SDFDoc, PDFNet.FilterReader, number, number, number, PDFNet.ColorSpace, number)", [
            [b, "SDFDoc"],
            [c, "Object", a.FilterReader, "FilterReader"],
            [e, "number"],
            [m, "number"],
            [g, "number"],
            [h, "Object", a.ColorSpace, "ColorSpace"],
            [k, "number"]
        ]);
        return a.sendWithPromise("imageCreateDirectFromStream", {
            doc: b.id,
            image_data: c.id,
            width: e,
            height: m,
            bpc: g,
            color_space: h.id,
            input_format: k
        }).then(function(b) {
            return f(a.Image,
                b)
        })
    };
    a.Image.createFromObj = function(b) {
        "undefined" === typeof b && (b = new a.Obj("0"));
        d(arguments.length, 0, "createFromObj", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("imageCreateFromObj", {
            image_xobject: b.id
        }).then(function(b) {
            return f(a.Image, b)
        })
    };
    a.Image.prototype.copy = function() {
        return a.sendWithPromise("Image.copy", {
            c: this.id
        }).then(function(b) {
            return f(a.Image, b)
        })
    };
    a.Image.prototype.getSDFObj = function() {
        return a.sendWithPromise("Image.getSDFObj", {
            img: this.id
        }).then(function(b) {
            return f(a.Obj,
                b)
        })
    };
    a.Image.prototype.isValid = function() {
        return a.sendWithPromise("Image.isValid", {
            img: this.id
        })
    };
    a.Image.prototype.getImageData = function() {
        return a.sendWithPromise("Image.getImageData", {
            img: this.id
        }).then(function(b) {
            return f(a.Filter, b)
        })
    };
    a.Image.prototype.getImageDataSize = function() {
        return a.sendWithPromise("Image.getImageDataSize", {
            img: this.id
        })
    };
    a.Image.prototype.getImageColorSpace = function() {
        return a.sendWithPromise("Image.getImageColorSpace", {
            img: this.id
        }).then(function(b) {
            return l(a.ColorSpace,
                b)
        })
    };
    a.Image.prototype.getImageWidth = function() {
        return a.sendWithPromise("Image.getImageWidth", {
            img: this.id
        })
    };
    a.Image.prototype.getImageHeight = function() {
        return a.sendWithPromise("Image.getImageHeight", {
            img: this.id
        })
    };
    a.Image.prototype.getDecodeArray = function() {
        return a.sendWithPromise("Image.getDecodeArray", {
            img: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Image.prototype.getBitsPerComponent = function() {
        return a.sendWithPromise("Image.getBitsPerComponent", {
            img: this.id
        })
    };
    a.Image.prototype.getComponentNum =
        function() {
            return a.sendWithPromise("Image.getComponentNum", {
                img: this.id
            })
        };
    a.Image.prototype.isImageMask = function() {
        return a.sendWithPromise("Image.isImageMask", {
            img: this.id
        })
    };
    a.Image.prototype.isImageInterpolate = function() {
        return a.sendWithPromise("Image.isImageInterpolate", {
            img: this.id
        })
    };
    a.Image.prototype.getMask = function() {
        return a.sendWithPromise("Image.getMask", {
            img: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Image.prototype.setMask = function(b) {
        d(arguments.length, 1, "setMask", "(PDFNet.Image)",
            [
                [b, "Object", a.Image, "Image"]
            ]);
        return a.sendWithPromise("Image.setMask", {
            img: this.id,
            image_mask: b.id
        })
    };
    a.Image.prototype.setMaskWithObj = function(b) {
        d(arguments.length, 1, "setMaskWithObj", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("Image.setMaskWithObj", {
            img: this.id,
            mask: b.id
        })
    };
    a.Image.prototype.getSoftMask = function() {
        return a.sendWithPromise("Image.getSoftMask", {
            img: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Image.prototype.setSoftMask = function(b) {
        d(arguments.length,
            1, "setSoftMask", "(PDFNet.Image)", [
                [b, "Object", a.Image, "Image"]
            ]);
        return a.sendWithPromise("Image.setSoftMask", {
            img: this.id,
            soft_mask: b.id
        })
    };
    a.Image.prototype.getImageRenderingIntent = function() {
        return a.sendWithPromise("Image.getImageRenderingIntent", {
            img: this.id
        })
    };
    a.Image.prototype.export = function(b) {
        d(arguments.length, 1, "export", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("Image.export", {
            img: this.id,
            filename: b
        })
    };
    a.Image.prototype.exportFromStream = function(b) {
        d(arguments.length, 1, "exportFromStream",
            "(PDFNet.FilterWriter)", [
                [b, "Object", a.FilterWriter, "FilterWriter"]
            ]);
        return a.sendWithPromise("Image.exportFromStream", {
            img: this.id,
            writer: b.id
        })
    };
    a.Image.prototype.exportAsTiff = function(b) {
        d(arguments.length, 1, "exportAsTiff", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("Image.exportAsTiff", {
            img: this.id,
            filename: b
        })
    };
    a.Image.prototype.exportAsTiffFromStream = function(b) {
        d(arguments.length, 1, "exportAsTiffFromStream", "(PDFNet.FilterWriter)", [
            [b, "Object", a.FilterWriter, "FilterWriter"]
        ]);
        return a.sendWithPromise("Image.exportAsTiffFromStream", {
            img: this.id,
            writer: b.id
        })
    };
    a.Image.prototype.exportAsPng = function(b) {
        d(arguments.length, 1, "exportAsPng", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("Image.exportAsPng", {
            img: this.id,
            filename: b
        })
    };
    a.Image.prototype.exportAsPngFromStream = function(b) {
        d(arguments.length, 1, "exportAsPngFromStream", "(PDFNet.FilterWriter)", [
            [b, "Object", a.FilterWriter, "FilterWriter"]
        ]);
        return a.sendWithPromise("Image.exportAsPngFromStream", {
            img: this.id,
            writer: b.id
        })
    };
    a.PageLabel.create = function(b, c, e, m) {
        "undefined" ===
        typeof e && (e = "");
        "undefined" === typeof m && (m = 1);
        d(arguments.length, 2, "create", "(PDFNet.SDFDoc, number, string, number)", [
            [b, "SDFDoc"],
            [c, "number"],
            [e, "string"],
            [m, "number"]
        ]);
        return a.sendWithPromise("pageLabelCreate", {
            doc: b.id,
            style: c,
            prefix: e,
            start_at: m
        }).then(function(b) {
            return new a.PageLabel(b)
        })
    };
    a.PageLabel.createFromObj = function(b, c, e) {
        "undefined" === typeof b && (b = new a.Obj("0"));
        "undefined" === typeof c && (c = -1);
        "undefined" === typeof e && (e = -1);
        d(arguments.length, 0, "createFromObj", "(PDFNet.Obj, number, number)",
            [
                [b, "Object", a.Obj, "Obj"],
                [c, "number"],
                [e, "number"]
            ]);
        return a.sendWithPromise("pageLabelCreateFromObj", {
            l: b.id,
            first_page: c,
            last_page: e
        }).then(function(b) {
            return new a.PageLabel(b)
        })
    };
    a.PageLabel.prototype.compare = function(b) {
        d(arguments.length, 1, "compare", "(PDFNet.PageLabel)", [
            [b, "Structure", a.PageLabel, "PageLabel"]
        ]);
        k("compare", this.yieldFunction);
        n("compare", [
            [b, 0]
        ]);
        var c = this;
        this.yieldFunction = "PageLabel.compare";
        return a.sendWithPromise("PageLabel.compare", {
            l: this,
            d: b
        }).then(function(a) {
            c.yieldFunction =
                void 0;
            q(a.l, c);
            return a.result
        })
    };
    a.PageLabel.prototype.isValid = function() {
        k("isValid", this.yieldFunction);
        return a.sendWithPromise("PageLabel.isValid", {
            l: this
        })
    };
    a.PageLabel.prototype.getLabelTitle = function(b) {
        d(arguments.length, 1, "getLabelTitle", "(number)", [
            [b, "number"]
        ]);
        k("getLabelTitle", this.yieldFunction);
        var c = this;
        this.yieldFunction = "PageLabel.getLabelTitle";
        return a.sendWithPromise("PageLabel.getLabelTitle", {
            l: this,
            page_num: b
        }).then(function(a) {
            c.yieldFunction = void 0;
            q(a.l, c);
            return a.result
        })
    };
    a.PageLabel.prototype.setStyle = function(b) {
        d(arguments.length, 1, "setStyle", "(number)", [
            [b, "number"]
        ]);
        k("setStyle", this.yieldFunction);
        var c = this;
        this.yieldFunction = "PageLabel.setStyle";
        return a.sendWithPromise("PageLabel.setStyle", {
            l: this,
            style: b
        }).then(function(a) {
            c.yieldFunction = void 0;
            q(a, c)
        })
    };
    a.PageLabel.prototype.getStyle = function() {
        k("getStyle", this.yieldFunction);
        return a.sendWithPromise("PageLabel.getStyle", {
            l: this
        })
    };
    a.PageLabel.prototype.getPrefix = function() {
        k("getPrefix", this.yieldFunction);
        return a.sendWithPromise("PageLabel.getPrefix", {
            l: this
        })
    };
    a.PageLabel.prototype.setPrefix = function(b) {
        d(arguments.length, 1, "setPrefix", "(string)", [
            [b, "string"]
        ]);
        k("setPrefix", this.yieldFunction);
        var c = this;
        this.yieldFunction = "PageLabel.setPrefix";
        return a.sendWithPromise("PageLabel.setPrefix", {
            l: this,
            prefix: b
        }).then(function(a) {
            c.yieldFunction = void 0;
            q(a, c)
        })
    };
    a.PageLabel.prototype.getStart = function() {
        k("getStart", this.yieldFunction);
        return a.sendWithPromise("PageLabel.getStart", {
            l: this
        })
    };
    a.PageLabel.prototype.setStart =
        function(b) {
            d(arguments.length, 1, "setStart", "(number)", [
                [b, "number"]
            ]);
            k("setStart", this.yieldFunction);
            var c = this;
            this.yieldFunction = "PageLabel.setStart";
            return a.sendWithPromise("PageLabel.setStart", {
                l: this,
                start_at: b
            }).then(function(a) {
                c.yieldFunction = void 0;
                q(a, c)
            })
        };
    a.PageLabel.prototype.getFirstPageNum = function() {
        k("getFirstPageNum", this.yieldFunction);
        var b = this;
        this.yieldFunction = "PageLabel.getFirstPageNum";
        return a.sendWithPromise("PageLabel.getFirstPageNum", {
            l: this
        }).then(function(a) {
            b.yieldFunction =
                void 0;
            q(a.l, b);
            return a.result
        })
    };
    a.PageLabel.prototype.getLastPageNum = function() {
        k("getLastPageNum", this.yieldFunction);
        var b = this;
        this.yieldFunction = "PageLabel.getLastPageNum";
        return a.sendWithPromise("PageLabel.getLastPageNum", {
            l: this
        }).then(function(a) {
            b.yieldFunction = void 0;
            q(a.l, b);
            return a.result
        })
    };
    a.PageLabel.prototype.getSDFObj = function() {
        k("getSDFObj", this.yieldFunction);
        return a.sendWithPromise("PageLabel.getSDFObj", {
            l: this
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.PageSet.create = function() {
        return a.sendWithPromise("pageSetCreate", {}).then(function(b) {
            return l(a.PageSet, b)
        })
    };
    a.PageSet.createSinglePage = function(b) {
        d(arguments.length, 1, "createSinglePage", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("pageSetCreateSinglePage", {
            one_page: b
        }).then(function(b) {
            return l(a.PageSet, b)
        })
    };
    a.PageSet.createRange = function(b, c) {
        d(arguments.length, 2, "createRange", "(number, number)", [
            [b, "number"],
            [c, "number"]
        ]);
        return a.sendWithPromise("pageSetCreateRange", {
            range_start: b,
            range_end: c
        }).then(function(b) {
            return l(a.PageSet, b)
        })
    };
    a.PageSet.createFilteredRange =
        function(b, c, e) {
            "undefined" === typeof e && (e = a.PageSet.Filter.e_all);
            d(arguments.length, 2, "createFilteredRange", "(number, number, number)", [
                [b, "number"],
                [c, "number"],
                [e, "number"]
            ]);
            return a.sendWithPromise("pageSetCreateFilteredRange", {
                range_start: b,
                range_end: c,
                filter: e
            }).then(function(b) {
                return l(a.PageSet, b)
            })
        };
    a.PageSet.prototype.addPage = function(b) {
        d(arguments.length, 1, "addPage", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("PageSet.addPage", {
            page_set: this.id,
            one_page: b
        })
    };
    a.PageSet.prototype.addRange =
        function(b, c, e) {
            "undefined" === typeof e && (e = a.PageSet.Filter.e_all);
            d(arguments.length, 2, "addRange", "(number, number, number)", [
                [b, "number"],
                [c, "number"],
                [e, "number"]
            ]);
            return a.sendWithPromise("PageSet.addRange", {
                page_set: this.id,
                range_start: b,
                range_end: c,
                filter: e
            })
        };
    a.PatternColor.create = function(b) {
        d(arguments.length, 1, "create", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("patternColorCreate", {
            pattern: b.id
        }).then(function(b) {
            return l(a.PatternColor, b)
        })
    };
    a.PatternColor.getTypeFromObj =
        function(b) {
            d(arguments.length, 1, "getTypeFromObj", "(PDFNet.Obj)", [
                [b, "Object", a.Obj, "Obj"]
            ]);
            return a.sendWithPromise("patternColorGetTypeFromObj", {
                pattern: b.id
            })
        };
    a.PatternColor.prototype.getType = function() {
        return a.sendWithPromise("PatternColor.getType", {
            pc: this.id
        })
    };
    a.PatternColor.prototype.getSDFObj = function() {
        return a.sendWithPromise("PatternColor.getSDFObj", {
            pc: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.PatternColor.prototype.getMatrix = function() {
        return a.sendWithPromise("PatternColor.getMatrix", {
            pc: this.id
        }).then(function(b) {
            return new a.Matrix2D(b)
        })
    };
    a.PatternColor.prototype.getShading = function() {
        return a.sendWithPromise("PatternColor.getShading", {
            pc: this.id
        }).then(function(b) {
            return l(a.Shading, b)
        })
    };
    a.PatternColor.prototype.getTilingType = function() {
        return a.sendWithPromise("PatternColor.getTilingType", {
            pc: this.id
        })
    };
    a.PatternColor.prototype.getBBox = function() {
        return a.sendWithPromise("PatternColor.getBBox", {
            pc: this.id
        }).then(function(b) {
            return new a.Rect(b)
        })
    };
    a.PatternColor.prototype.getXStep =
        function() {
            return a.sendWithPromise("PatternColor.getXStep", {
                pc: this.id
            })
        };
    a.PatternColor.prototype.getYStep = function() {
        return a.sendWithPromise("PatternColor.getYStep", {
            pc: this.id
        })
    };
    a.GeometryCollection.prototype.snapToNearest = function(b, c, e) {
        d(arguments.length, 3, "snapToNearest", "(number, number, number)", [
            [b, "number"],
            [c, "number"],
            [e, "number"]
        ]);
        return a.sendWithPromise("GeometryCollection.snapToNearest", {
            self: this.id,
            x: b,
            y: c,
            mode: e
        })
    };
    a.GeometryCollection.prototype.snapToNearestPixel = function(b,
        c, e, m) {
        d(arguments.length, 4, "snapToNearestPixel", "(number, number, number, number)", [
            [b, "number"],
            [c, "number"],
            [e, "number"],
            [m, "number"]
        ]);
        return a.sendWithPromise("GeometryCollection.snapToNearestPixel", {
            self: this.id,
            x: b,
            y: c,
            dpi: e,
            mode: m
        })
    };
    a.DigestAlgorithm.calculateDigest = function(b, c) {
        d(arguments.length, 2, "calculateDigest", "(number, ArrayBuffer|TypedArray)", [
            [b, "number"],
            [c, "ArrayBuffer"]
        ]);
        var e = u(c, !1);
        return a.sendWithPromise("digestAlgorithmCalculateDigest", {
            in_algorithm: b,
            in_buffer: e
        }).then(function(a) {
            return new Uint8Array(a)
        })
    };
    a.ObjectIdentifier.createFromPredefined = function(b) {
        d(arguments.length, 1, "createFromPredefined", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("objectIdentifierCreateFromPredefined", {
            in_oid_enum: b
        }).then(function(b) {
            return l(a.ObjectIdentifier, b)
        })
    };
    a.ObjectIdentifier.createFromIntArray = function(b) {
        d(arguments.length, 1, "createFromIntArray", "(Array<number>)", [
            [b, "Array"]
        ]);
        return a.sendWithPromise("objectIdentifierCreateFromIntArray", {
            in_list: b
        }).then(function(b) {
            return l(a.ObjectIdentifier, b)
        })
    };
    a.ObjectIdentifier.createFromDigestAlgorithm = function(b) {
        d(arguments.length, 1, "createFromDigestAlgorithm", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("objectIdentifierCreateFromDigestAlgorithm", {
            in_algorithm: b
        }).then(function(b) {
            return l(a.ObjectIdentifier, b)
        })
    };
    a.ObjectIdentifier.prototype.getRawValue = function() {
        return a.sendWithPromise("ObjectIdentifier.getRawValue", {
            self: this.id
        })
    };
    a.X501DistinguishedName.prototype.hasAttribute = function(b) {
        d(arguments.length, 1, "hasAttribute", "(PDFNet.ObjectIdentifier)",
            [
                [b, "Object", a.ObjectIdentifier, "ObjectIdentifier"]
            ]);
        return a.sendWithPromise("X501DistinguishedName.hasAttribute", {
            self: this.id,
            in_oid: b.id
        })
    };
    a.X501DistinguishedName.prototype.getStringValuesForAttribute = function(b) {
        d(arguments.length, 1, "getStringValuesForAttribute", "(PDFNet.ObjectIdentifier)", [
            [b, "Object", a.ObjectIdentifier, "ObjectIdentifier"]
        ]);
        return a.sendWithPromise("X501DistinguishedName.getStringValuesForAttribute", {
            self: this.id,
            in_oid: b.id
        })
    };
    a.X501DistinguishedName.prototype.getAllAttributesAndValues =
        function() {
            return a.sendWithPromise("X501DistinguishedName.getAllAttributesAndValues", {
                self: this.id
            }).then(function(b) {
                for (var c = [], e = 0; e < b.length; ++e) {
                    var d = b[e];
                    if ("0" === d) return null;
                    d = new a.X501AttributeTypeAndValue(d);
                    c.push(d);
                    createdObjects.push({
                        name: d.name,
                        id: d.id
                    })
                }
                return c
            })
        };
    a.X509Certificate.createFromBuffer = function(b) {
        d(arguments.length, 1, "createFromBuffer", "(ArrayBuffer|TypedArray)", [
            [b, "ArrayBuffer"]
        ]);
        var c = u(b, !1);
        return a.sendWithPromise("x509CertificateCreateFromBuffer", {
            in_cert_buf: c
        }).then(function(b) {
            return l(a.X509Certificate,
                b)
        })
    };
    a.X509Certificate.createFromFile = function(b) {
        d(arguments.length, 1, "createFromFile", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("x509CertificateCreateFromFile", {
            in_filepath: b
        }).then(function(b) {
            return l(a.X509Certificate, b)
        })
    };
    a.X509Certificate.prototype.getIssuerField = function() {
        return a.sendWithPromise("X509Certificate.getIssuerField", {
            self: this.id
        }).then(function(b) {
            return l(a.X501DistinguishedName, b)
        })
    };
    a.X509Certificate.prototype.getSubjectField = function() {
        return a.sendWithPromise("X509Certificate.getSubjectField", {
            self: this.id
        }).then(function(b) {
            return l(a.X501DistinguishedName, b)
        })
    };
    a.X509Certificate.prototype.getNotBeforeEpochTime = function() {
        return a.sendWithPromise("X509Certificate.getNotBeforeEpochTime", {
            self: this.id
        })
    };
    a.X509Certificate.prototype.getNotAfterEpochTime = function() {
        return a.sendWithPromise("X509Certificate.getNotAfterEpochTime", {
            self: this.id
        })
    };
    a.X509Certificate.prototype.getRawX509VersionNumber = function() {
        return a.sendWithPromise("X509Certificate.getRawX509VersionNumber", {
            self: this.id
        })
    };
    a.X509Certificate.prototype.toString = function() {
        return a.sendWithPromise("X509Certificate.toString", {
            self: this.id
        })
    };
    a.X509Certificate.prototype.getFingerprint = function(b) {
        "undefined" === typeof b && (b = a.DigestAlgorithm.Type.e_SHA256);
        d(arguments.length, 0, "getFingerprint", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("X509Certificate.getFingerprint", {
            self: this.id,
            in_digest_algorithm: b
        })
    };
    a.X509Certificate.prototype.getSerialNumber = function() {
        return a.sendWithPromise("X509Certificate.getSerialNumber", {
            self: this.id
        }).then(function(a) {
            return new Uint8Array(a)
        })
    };
    a.X509Certificate.prototype.getExtensions = function() {
        return a.sendWithPromise("X509Certificate.getExtensions", {
            self: this.id
        }).then(function(b) {
            for (var c = [], e = 0; e < b.length; ++e) {
                var d = b[e];
                if ("0" === d) return null;
                d = new a.X509Extension(d);
                c.push(d);
                createdObjects.push({
                    name: d.name,
                    id: d.id
                })
            }
            return c
        })
    };
    a.X509Certificate.prototype.getData = function() {
        return a.sendWithPromise("X509Certificate.getData", {
            self: this.id
        }).then(function(a) {
            return new Uint8Array(a)
        })
    };
    a.TimestampingConfiguration.createFromURL = function(b) {
        d(arguments.length, 1, "createFromURL", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("timestampingConfigurationCreateFromURL", {
            in_url: b
        }).then(function(b) {
            return l(a.TimestampingConfiguration, b)
        })
    };
    a.TimestampingConfiguration.prototype.setTimestampAuthorityServerURL = function(b) {
        d(arguments.length, 1, "setTimestampAuthorityServerURL", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("TimestampingConfiguration.setTimestampAuthorityServerURL", {
            self: this.id,
            in_url: b
        })
    };
    a.TimestampingConfiguration.prototype.setTimestampAuthorityServerUsername = function(b) {
        d(arguments.length, 1, "setTimestampAuthorityServerUsername", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("TimestampingConfiguration.setTimestampAuthorityServerUsername", {
            self: this.id,
            in_username: b
        })
    };
    a.TimestampingConfiguration.prototype.setTimestampAuthorityServerPassword = function(b) {
        d(arguments.length, 1, "setTimestampAuthorityServerPassword", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("TimestampingConfiguration.setTimestampAuthorityServerPassword", {
            self: this.id,
            in_password: b
        })
    };
    a.TimestampingConfiguration.prototype.setUseNonce = function(b) {
        d(arguments.length, 1, "setUseNonce", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("TimestampingConfiguration.setUseNonce", {
            self: this.id,
            in_use_nonce: b
        })
    };
    a.TimestampingConfiguration.prototype.testConfiguration = function(b) {
        d(arguments.length, 1, "testConfiguration", "(PDFNet.VerificationOptions)", [
            [b, "Object", a.VerificationOptions, "VerificationOptions"]
        ]);
        return a.sendWithPromise("TimestampingConfiguration.testConfiguration", {
            self: this.id,
            in_opts: b.id
        }).then(function(b) {
            return l(a.TimestampingResult, b)
        })
    };
    a.DigitalSignatureField.prototype.hasCryptographicSignature = function() {
        k("hasCryptographicSignature", this.yieldFunction);
        return a.sendWithPromise("DigitalSignatureField.hasCryptographicSignature", {
            self: this
        })
    };
    a.DigitalSignatureField.prototype.getSubFilter = function() {
        k("getSubFilter", this.yieldFunction);
        return a.sendWithPromise("DigitalSignatureField.getSubFilter", {
            self: this
        })
    };
    a.DigitalSignatureField.prototype.getSignatureName =
        function() {
            k("getSignatureName", this.yieldFunction);
            return a.sendWithPromise("DigitalSignatureField.getSignatureName", {
                self: this
            })
        };
    a.DigitalSignatureField.prototype.getLocation = function() {
        k("getLocation", this.yieldFunction);
        return a.sendWithPromise("DigitalSignatureField.getLocation", {
            self: this
        })
    };
    a.DigitalSignatureField.prototype.getReason = function() {
        k("getReason", this.yieldFunction);
        return a.sendWithPromise("DigitalSignatureField.getReason", {
            self: this
        })
    };
    a.DigitalSignatureField.prototype.getContactInfo =
        function() {
            k("getContactInfo", this.yieldFunction);
            return a.sendWithPromise("DigitalSignatureField.getContactInfo", {
                self: this
            })
        };
    a.DigitalSignatureField.prototype.getCertCount = function() {
        k("getCertCount", this.yieldFunction);
        return a.sendWithPromise("DigitalSignatureField.getCertCount", {
            self: this
        })
    };
    a.DigitalSignatureField.prototype.hasVisibleAppearance = function() {
        k("hasVisibleAppearance", this.yieldFunction);
        return a.sendWithPromise("DigitalSignatureField.hasVisibleAppearance", {
            self: this
        })
    };
    a.DigitalSignatureField.prototype.setContactInfo =
        function(b) {
            d(arguments.length, 1, "setContactInfo", "(string)", [
                [b, "string"]
            ]);
            k("setContactInfo", this.yieldFunction);
            var c = this;
            this.yieldFunction = "DigitalSignatureField.setContactInfo";
            return a.sendWithPromise("DigitalSignatureField.setContactInfo", {
                self: this,
                in_contact_info: b
            }).then(function(a) {
                c.yieldFunction = void 0;
                q(a, c)
            })
        };
    a.DigitalSignatureField.prototype.setLocation = function(b) {
        d(arguments.length, 1, "setLocation", "(string)", [
            [b, "string"]
        ]);
        k("setLocation", this.yieldFunction);
        var c = this;
        this.yieldFunction =
            "DigitalSignatureField.setLocation";
        return a.sendWithPromise("DigitalSignatureField.setLocation", {
            self: this,
            in_location: b
        }).then(function(a) {
            c.yieldFunction = void 0;
            q(a, c)
        })
    };
    a.DigitalSignatureField.prototype.setReason = function(b) {
        d(arguments.length, 1, "setReason", "(string)", [
            [b, "string"]
        ]);
        k("setReason", this.yieldFunction);
        var c = this;
        this.yieldFunction = "DigitalSignatureField.setReason";
        return a.sendWithPromise("DigitalSignatureField.setReason", {
            self: this,
            in_reason: b
        }).then(function(a) {
            c.yieldFunction =
                void 0;
            q(a, c)
        })
    };
    a.DigitalSignatureField.prototype.setDocumentPermissions = function(b) {
        d(arguments.length, 1, "setDocumentPermissions", "(number)", [
            [b, "number"]
        ]);
        k("setDocumentPermissions", this.yieldFunction);
        var c = this;
        this.yieldFunction = "DigitalSignatureField.setDocumentPermissions";
        return a.sendWithPromise("DigitalSignatureField.setDocumentPermissions", {
            self: this,
            in_perms: b
        }).then(function(a) {
            c.yieldFunction = void 0;
            q(a, c)
        })
    };
    a.DigitalSignatureField.prototype.signOnNextSave = function(b, c) {
        d(arguments.length,
            2, "signOnNextSave", "(string, string)", [
                [b, "string"],
                [c, "string"]
            ]);
        k("signOnNextSave", this.yieldFunction);
        var e = this;
        this.yieldFunction = "DigitalSignatureField.signOnNextSave";
        return a.sendWithPromise("DigitalSignatureField.signOnNextSave", {
            self: this,
            in_pkcs12_keyfile_path: b,
            in_password: c
        }).then(function(a) {
            e.yieldFunction = void 0;
            q(a, e)
        })
    };
    a.DigitalSignatureField.prototype.certifyOnNextSave = function(b, c) {
        d(arguments.length, 2, "certifyOnNextSave", "(string, string)", [
            [b, "string"],
            [c, "string"]
        ]);
        k("certifyOnNextSave",
            this.yieldFunction);
        var e = this;
        this.yieldFunction = "DigitalSignatureField.certifyOnNextSave";
        return a.sendWithPromise("DigitalSignatureField.certifyOnNextSave", {
            self: this,
            in_pkcs12_keyfile_path: b,
            in_password: c
        }).then(function(a) {
            e.yieldFunction = void 0;
            q(a, e)
        })
    };
    a.DigitalSignatureField.prototype.isLockedByDigitalSignature = function() {
        k("isLockedByDigitalSignature", this.yieldFunction);
        return a.sendWithPromise("DigitalSignatureField.isLockedByDigitalSignature", {
            self: this
        })
    };
    a.DigitalSignatureField.prototype.getDocumentPermissions =
        function() {
            k("getDocumentPermissions", this.yieldFunction);
            return a.sendWithPromise("DigitalSignatureField.getDocumentPermissions", {
                self: this
            })
        };
    a.DigitalSignatureField.prototype.clearSignature = function() {
        k("clearSignature", this.yieldFunction);
        var b = this;
        this.yieldFunction = "DigitalSignatureField.clearSignature";
        return a.sendWithPromise("DigitalSignatureField.clearSignature", {
            self: this
        }).then(function(a) {
            b.yieldFunction = void 0;
            q(a, b)
        })
    };
    a.DigitalSignatureField.createFromField = function(b) {
        d(arguments.length,
            1, "createFromField", "(PDFNet.Field)", [
                [b, "Structure", a.Field, "Field"]
            ]);
        n("createFromField", [
            [b, 0]
        ]);
        return a.sendWithPromise("digitalSignatureFieldCreateFromField", {
            in_field: b
        }).then(function(b) {
            return new a.DigitalSignatureField(b)
        })
    };
    a.DigitalSignatureField.prototype.getSigningTime = function() {
        k("getSigningTime", this.yieldFunction);
        return a.sendWithPromise("DigitalSignatureField.getSigningTime", {
            self: this
        }).then(function(b) {
            return new a.Date(b)
        })
    };
    a.DigitalSignatureField.prototype.getCert = function(b) {
        d(arguments.length,
            1, "getCert", "(number)", [
                [b, "number"]
            ]);
        k("getCert", this.yieldFunction);
        return a.sendWithPromise("DigitalSignatureField.getCert", {
            self: this,
            in_index: b
        }).then(function(a) {
            return new Uint8Array(a)
        })
    };
    a.DigitalSignatureField.prototype.setFieldPermissions = function(b, c) {
        "undefined" === typeof c && (c = []);
        d(arguments.length, 1, "setFieldPermissions", "(number, Array<string>)", [
            [b, "number"],
            [c, "Array"]
        ]);
        k("setFieldPermissions", this.yieldFunction);
        var e = this;
        this.yieldFunction = "DigitalSignatureField.setFieldPermissions";
        return a.sendWithPromise("DigitalSignatureField.setFieldPermissions", {
            self: this,
            in_action: b,
            in_field_names_list: c
        }).then(function(a) {
            e.yieldFunction = void 0;
            q(a, e)
        })
    };
    a.DigitalSignatureField.prototype.signOnNextSaveFromBuffer = function(b, c) {
        d(arguments.length, 2, "signOnNextSaveFromBuffer", "(ArrayBuffer|TypedArray, string)", [
            [b, "ArrayBuffer"],
            [c, "string"]
        ]);
        k("signOnNextSaveFromBuffer", this.yieldFunction);
        var e = this;
        this.yieldFunction = "DigitalSignatureField.signOnNextSaveFromBuffer";
        var f = u(b, !1);
        return a.sendWithPromise("DigitalSignatureField.signOnNextSaveFromBuffer", {
            self: this,
            in_pkcs12_buffer: f,
            in_password: c
        }).then(function(a) {
            e.yieldFunction = void 0;
            q(a, e)
        })
    };
    a.DigitalSignatureField.prototype.signOnNextSaveWithCustomHandler = function(b) {
        d(arguments.length, 1, "signOnNextSaveWithCustomHandler", "(number)", [
            [b, "number"]
        ]);
        k("signOnNextSaveWithCustomHandler", this.yieldFunction);
        var c = this;
        this.yieldFunction = "DigitalSignatureField.signOnNextSaveWithCustomHandler";
        return a.sendWithPromise("DigitalSignatureField.signOnNextSaveWithCustomHandler", {
            self: this,
            in_signature_handler_id: b
        }).then(function(a) {
            c.yieldFunction =
                void 0;
            q(a, c)
        })
    };
    a.DigitalSignatureField.prototype.certifyOnNextSaveFromBuffer = function(b, c) {
        d(arguments.length, 2, "certifyOnNextSaveFromBuffer", "(ArrayBuffer|TypedArray, string)", [
            [b, "ArrayBuffer"],
            [c, "string"]
        ]);
        k("certifyOnNextSaveFromBuffer", this.yieldFunction);
        var e = this;
        this.yieldFunction = "DigitalSignatureField.certifyOnNextSaveFromBuffer";
        var f = u(b, !1);
        return a.sendWithPromise("DigitalSignatureField.certifyOnNextSaveFromBuffer", {
            self: this,
            in_pkcs12_buffer: f,
            in_password: c
        }).then(function(a) {
            e.yieldFunction =
                void 0;
            q(a, e)
        })
    };
    a.DigitalSignatureField.prototype.certifyOnNextSaveWithCustomHandler = function(b) {
        d(arguments.length, 1, "certifyOnNextSaveWithCustomHandler", "(number)", [
            [b, "number"]
        ]);
        k("certifyOnNextSaveWithCustomHandler", this.yieldFunction);
        var c = this;
        this.yieldFunction = "DigitalSignatureField.certifyOnNextSaveWithCustomHandler";
        return a.sendWithPromise("DigitalSignatureField.certifyOnNextSaveWithCustomHandler", {
            self: this,
            in_signature_handler_id: b
        }).then(function(a) {
            c.yieldFunction = void 0;
            q(a, c)
        })
    };
    a.DigitalSignatureField.prototype.getSDFObj = function() {
        k("getSDFObj", this.yieldFunction);
        return a.sendWithPromise("DigitalSignatureField.getSDFObj", {
            self: this
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.DigitalSignatureField.prototype.getLockedFields = function() {
        k("getLockedFields", this.yieldFunction);
        return a.sendWithPromise("DigitalSignatureField.getLockedFields", {
            self: this
        })
    };
    a.DigitalSignatureField.prototype.verify = function(b) {
        d(arguments.length, 1, "verify", "(PDFNet.VerificationOptions)", [
            [b, "Object",
                a.VerificationOptions, "VerificationOptions"
            ]
        ]);
        k("verify", this.yieldFunction);
        return a.sendWithPromise("DigitalSignatureField.verify", {
            self: this,
            in_opts: b.id
        }).then(function(b) {
            return l(a.VerificationResult, b)
        })
    };
    a.DigitalSignatureField.prototype.isCertification = function() {
        k("isCertification", this.yieldFunction);
        return a.sendWithPromise("DigitalSignatureField.isCertification", {
            self: this
        })
    };
    a.DigitalSignatureField.prototype.getSignerCertFromCMS = function() {
        k("getSignerCertFromCMS", this.yieldFunction);
        return a.sendWithPromise("DigitalSignatureField.getSignerCertFromCMS", {
            self: this
        }).then(function(b) {
            return l(a.X509Certificate, b)
        })
    };
    a.DigitalSignatureField.prototype.getByteRanges = function() {
        k("getByteRanges", this.yieldFunction);
        return a.sendWithPromise("DigitalSignatureField.getByteRanges", {
            self: this
        }).then(function(b) {
            for (var c = [], e = 0; e < b.length; ++e) {
                var d = b[e];
                if ("0" === d) return null;
                d = new a.ByteRange(d);
                c.push(d)
            }
            return c
        })
    };
    a.DigitalSignatureField.prototype.enableLTVOfflineVerification = function(b) {
        d(arguments.length,
            1, "enableLTVOfflineVerification", "(PDFNet.VerificationResult)", [
                [b, "Object", a.VerificationResult, "VerificationResult"]
            ]);
        k("enableLTVOfflineVerification", this.yieldFunction);
        return a.sendWithPromise("DigitalSignatureField.enableLTVOfflineVerification", {
            self: this,
            in_verification_result: b.id
        })
    };
    a.DigitalSignatureField.prototype.timestampOnNextSave = function(b, c) {
        d(arguments.length, 2, "timestampOnNextSave", "(PDFNet.TimestampingConfiguration, PDFNet.VerificationOptions)", [
            [b, "Object", a.TimestampingConfiguration,
                "TimestampingConfiguration"
            ],
            [c, "Object", a.VerificationOptions, "VerificationOptions"]
        ]);
        k("timestampOnNextSave", this.yieldFunction);
        return a.sendWithPromise("DigitalSignatureField.timestampOnNextSave", {
            self: this,
            in_timestamping_config: b.id,
            in_timestamp_response_verification_options: c.id
        })
    };
    a.DigitalSignatureField.prototype.generateContentsWithEmbeddedTimestamp = function(b, c) {
        d(arguments.length, 2, "generateContentsWithEmbeddedTimestamp", "(PDFNet.TimestampingConfiguration, PDFNet.VerificationOptions)",
            [
                [b, "Object", a.TimestampingConfiguration, "TimestampingConfiguration"],
                [c, "Object", a.VerificationOptions, "VerificationOptions"]
            ]);
        k("generateContentsWithEmbeddedTimestamp", this.yieldFunction);
        return a.sendWithPromise("DigitalSignatureField.generateContentsWithEmbeddedTimestamp", {
            self: this,
            in_timestamping_config: b.id,
            in_timestamp_response_verification_options: c.id
        }).then(function(b) {
            return l(a.TimestampingResult, b)
        })
    };
    a.DigitalSignatureField.prototype.useSubFilter = function(b, c) {
        "undefined" === typeof c &&
            (c = !0);
        d(arguments.length, 1, "useSubFilter", "(number, boolean)", [
            [b, "number"],
            [c, "boolean"]
        ]);
        k("useSubFilter", this.yieldFunction);
        var e = this;
        this.yieldFunction = "DigitalSignatureField.useSubFilter";
        return a.sendWithPromise("DigitalSignatureField.useSubFilter", {
            self: this,
            in_subfilter_type: b,
            in_make_mandatory: c
        }).then(function(a) {
            e.yieldFunction = void 0;
            q(a, e)
        })
    };
    a.DigitalSignatureField.prototype.calculateDigest = function(b) {
        "undefined" === typeof b && (b = a.DigestAlgorithm.Type.e_SHA256);
        d(arguments.length,
            0, "calculateDigest", "(number)", [
                [b, "number"]
            ]);
        k("calculateDigest", this.yieldFunction);
        var c = this;
        this.yieldFunction = "DigitalSignatureField.calculateDigest";
        return a.sendWithPromise("DigitalSignatureField.calculateDigest", {
            self: this,
            in_digest_algorithm_type: b
        }).then(function(a) {
            c.yieldFunction = void 0;
            a.result = new Uint8Array(a.result);
            q(a.self, c);
            return a.result
        })
    };
    a.DigitalSignatureField.prototype.setPreferredDigestAlgorithm = function(b, c) {
        "undefined" === typeof c && (c = !0);
        d(arguments.length, 1, "setPreferredDigestAlgorithm",
            "(number, boolean)", [
                [b, "number"],
                [c, "boolean"]
            ]);
        k("setPreferredDigestAlgorithm", this.yieldFunction);
        var e = this;
        this.yieldFunction = "DigitalSignatureField.setPreferredDigestAlgorithm";
        return a.sendWithPromise("DigitalSignatureField.setPreferredDigestAlgorithm", {
            self: this,
            in_digest_algorithm_type: b,
            in_make_mandatory: c
        }).then(function(a) {
            e.yieldFunction = void 0;
            q(a, e)
        })
    };
    a.DigitalSignatureField.prototype.createSigDictForCustomCertification = function(b, c, e) {
        d(arguments.length, 3, "createSigDictForCustomCertification",
            "(string, number, number)", [
                [b, "string"],
                [c, "number"],
                [e, "number"]
            ]);
        k("createSigDictForCustomCertification", this.yieldFunction);
        var f = this;
        this.yieldFunction = "DigitalSignatureField.createSigDictForCustomCertification";
        return a.sendWithPromise("DigitalSignatureField.createSigDictForCustomCertification", {
            self: this,
            in_filter_name: b,
            in_subfilter_type: c,
            in_contents_size_to_reserve: e
        }).then(function(a) {
            f.yieldFunction = void 0;
            q(a, f)
        })
    };
    a.DigitalSignatureField.prototype.createSigDictForCustomSigning = function(b,
        c, e) {
        d(arguments.length, 3, "createSigDictForCustomSigning", "(string, number, number)", [
            [b, "string"],
            [c, "number"],
            [e, "number"]
        ]);
        k("createSigDictForCustomSigning", this.yieldFunction);
        var f = this;
        this.yieldFunction = "DigitalSignatureField.createSigDictForCustomSigning";
        return a.sendWithPromise("DigitalSignatureField.createSigDictForCustomSigning", {
            self: this,
            in_filter_name: b,
            in_subfilter_type: c,
            in_contents_size_to_reserve: e
        }).then(function(a) {
            f.yieldFunction = void 0;
            q(a, f)
        })
    };
    a.DigitalSignatureField.prototype.setSigDictTimeOfSigning =
        function(b) {
            d(arguments.length, 1, "setSigDictTimeOfSigning", "(PDFNet.Date)", [
                [b, "Structure", a.Date, "Date"]
            ]);
            k("setSigDictTimeOfSigning", this.yieldFunction);
            n("setSigDictTimeOfSigning", [
                [b, 0]
            ]);
            var c = this;
            this.yieldFunction = "DigitalSignatureField.setSigDictTimeOfSigning";
            return a.sendWithPromise("DigitalSignatureField.setSigDictTimeOfSigning", {
                self: this,
                in_date: b
            }).then(function(a) {
                c.yieldFunction = void 0;
                q(a, c)
            })
        };
    a.DigitalSignatureField.signDigestPath = function(b, c, e, f, g) {
        d(arguments.length, 5, "signDigestPath",
            "(ArrayBuffer|TypedArray, string, string, boolean, number)", [
                [b, "ArrayBuffer"],
                [c, "string"],
                [e, "string"],
                [f, "boolean"],
                [g, "number"]
            ]);
        var m = u(b, !1);
        return a.sendWithPromise("digitalSignatureFieldSignDigestPath", {
            in_digest_buf: m,
            in_pkcs12_keyfile_path: c,
            in_keyfile_password: e,
            in_pades_mode: f,
            in_digest_algorithm_type: g
        }).then(function(a) {
            return new Uint8Array(a)
        })
    };
    a.DigitalSignatureField.signDigestBuffer = function(b, c, e, f, g) {
        d(arguments.length, 5, "signDigestBuffer", "(ArrayBuffer|TypedArray, ArrayBuffer|TypedArray, string, boolean, number)",
            [
                [b, "ArrayBuffer"],
                [c, "ArrayBuffer"],
                [e, "string"],
                [f, "boolean"],
                [g, "number"]
            ]);
        var m = u(b, !1),
            h = u(c, !1);
        return a.sendWithPromise("digitalSignatureFieldSignDigestBuffer", {
            in_digest_buf: m,
            in_pkcs12_buffer: h,
            in_keyfile_password: e,
            in_pades_mode: f,
            in_digest_algorithm_type: g
        }).then(function(a) {
            return new Uint8Array(a)
        })
    };
    a.DigitalSignatureField.generateESSSigningCertPAdESAttribute = function(b, c) {
        d(arguments.length, 2, "generateESSSigningCertPAdESAttribute", "(PDFNet.X509Certificate, number)", [
            [b, "Object", a.X509Certificate,
                "X509Certificate"
            ],
            [c, "number"]
        ]);
        return a.sendWithPromise("digitalSignatureFieldGenerateESSSigningCertPAdESAttribute", {
            in_signer_cert: b.id,
            in_digest_algorithm_type: c
        }).then(function(a) {
            return new Uint8Array(a)
        })
    };
    a.DigitalSignatureField.generateCMSSignedAttributes = function(b, c) {
        "undefined" === typeof c && (c = new ArrayBuffer(0));
        d(arguments.length, 1, "generateCMSSignedAttributes", "(ArrayBuffer|TypedArray, ArrayBuffer|TypedArray)", [
            [b, "ArrayBuffer"],
            [c, "ArrayBuffer"]
        ]);
        var e = u(b, !1),
            f = u(c, !1);
        return a.sendWithPromise("digitalSignatureFieldGenerateCMSSignedAttributes", {
            in_digest_buf: e,
            in_custom_signedattributes_buf: f
        }).then(function(a) {
            return new Uint8Array(a)
        })
    };
    a.DigitalSignatureField.generateCMSSignature = function(b, c, e, f, g, h) {
        d(arguments.length, 6, "generateCMSSignature", "(PDFNet.X509Certificate, Array<PDFNet.X509Certificate>, PDFNet.ObjectIdentifier, PDFNet.ObjectIdentifier, ArrayBuffer|TypedArray, ArrayBuffer|TypedArray)", [
            [b, "Object", a.X509Certificate, "X509Certificate"],
            [c, "Array"],
            [e, "Object", a.ObjectIdentifier, "ObjectIdentifier"],
            [f, "Object", a.ObjectIdentifier,
                "ObjectIdentifier"
            ],
            [g, "ArrayBuffer"],
            [h, "ArrayBuffer"]
        ]);
        var m = u(g, !1),
            k = u(h, !1);
        c = Array.from(c, function(a) {
            return a.id
        });
        return a.sendWithPromise("digitalSignatureFieldGenerateCMSSignature", {
            in_signer_cert: b.id,
            in_chain_certs_list: c,
            in_digest_algorithm_oid: e.id,
            in_signature_algorithm_oid: f.id,
            in_signature_value_buf: m,
            in_signedattributes_buf: k
        }).then(function(a) {
            return new Uint8Array(a)
        })
    };
    a.PDFDoc.prototype.getTriggerAction = function(b) {
        d(arguments.length, 1, "getTriggerAction", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("PDFDoc.getTriggerAction", {
            doc: this.id,
            trigger: b
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.PDFDoc.prototype.isXFA = function() {
        return a.sendWithPromise("PDFDoc.isXFA", {
            doc: this.id
        })
    };
    a.PDFDoc.create = function() {
        return a.sendWithPromise("pdfDocCreate", {}).then(function(b) {
            return l(a.PDFDoc, b)
        })
    };
    a.PDFDoc.createFromUFilePath = function(b) {
        d(arguments.length, 1, "createFromUFilePath", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("pdfDocCreateFromUFilePath", {
            filepath: b
        }).then(function(b) {
            return l(a.PDFDoc,
                b)
        })
    };
    a.PDFDoc.createFromFilePath = function(b) {
        d(arguments.length, 1, "createFromFilePath", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("pdfDocCreateFromFilePath", {
            filepath: b
        }).then(function(b) {
            return l(a.PDFDoc, b)
        })
    };
    a.PDFDoc.createFromFilter = function(b) {
        d(arguments.length, 1, "createFromFilter", "(PDFNet.Filter)", [
            [b, "Object", a.Filter, "Filter"]
        ]);
        0 != b.id && t(b.id);
        return a.sendWithPromise("pdfDocCreateFromFilter", {
            no_own_stream: b.id
        }).then(function(b) {
            return l(a.PDFDoc, b)
        })
    };
    a.PDFDoc.createFromBuffer =
        function(b) {
            d(arguments.length, 1, "createFromBuffer", "(ArrayBuffer|TypedArray)", [
                [b, "ArrayBuffer"]
            ]);
            var c = u(b, !1);
            return a.sendWithPromise("pdfDocCreateFromBuffer", {
                buf: c
            }).then(function(b) {
                return l(a.PDFDoc, b)
            })
        };
    a.PDFDoc.createFromLayoutEls = function(b) {
        d(arguments.length, 1, "createFromLayoutEls", "(ArrayBuffer|TypedArray)", [
            [b, "ArrayBuffer"]
        ]);
        var c = u(b, !1);
        return a.sendWithPromise("pdfDocCreateFromLayoutEls", {
            buf: c
        }).then(function(b) {
            return l(a.PDFDoc, b)
        })
    };
    a.PDFDoc.prototype.createShallowCopy = function() {
        return a.sendWithPromise("PDFDoc.createShallowCopy", {
            source: this.id
        }).then(function(b) {
            return l(a.PDFDoc, b)
        })
    };
    a.PDFDoc.prototype.isEncrypted = function() {
        return a.sendWithPromise("PDFDoc.isEncrypted", {
            doc: this.id
        })
    };
    a.PDFDoc.prototype.initStdSecurityHandlerUString = function(b) {
        d(arguments.length, 1, "initStdSecurityHandlerUString", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("PDFDoc.initStdSecurityHandlerUString", {
            doc: this.id,
            password: b
        })
    };
    a.PDFDoc.prototype.initStdSecurityHandlerBuffer = function(b) {
        d(arguments.length, 1, "initStdSecurityHandlerBuffer",
            "(ArrayBuffer|TypedArray)", [
                [b, "ArrayBuffer"]
            ]);
        var c = u(b, !1);
        return a.sendWithPromise("PDFDoc.initStdSecurityHandlerBuffer", {
            doc: this.id,
            password_buf: c
        })
    };
    a.PDFDoc.prototype.getSecurityHandler = function() {
        return a.sendWithPromise("PDFDoc.getSecurityHandler", {
            doc: this.id
        }).then(function(b) {
            return f(a.SecurityHandler, b)
        })
    };
    a.PDFDoc.prototype.setSecurityHandler = function(b) {
        d(arguments.length, 1, "setSecurityHandler", "(PDFNet.SecurityHandler)", [
            [b, "Object", a.SecurityHandler, "SecurityHandler"]
        ]);
        0 != b.id &&
            t(b.id);
        return a.sendWithPromise("PDFDoc.setSecurityHandler", {
            doc: this.id,
            no_own_handler: b.id
        })
    };
    a.PDFDoc.prototype.removeSecurity = function() {
        return a.sendWithPromise("PDFDoc.removeSecurity", {
            doc: this.id
        })
    };
    a.PDFDoc.prototype.getDocInfo = function() {
        return a.sendWithPromise("PDFDoc.getDocInfo", {
            doc: this.id
        }).then(function(b) {
            return f(a.PDFDocInfo, b)
        })
    };
    a.PDFDoc.prototype.getViewPrefs = function() {
        return a.sendWithPromise("PDFDoc.getViewPrefs", {
            doc: this.id
        }).then(function(b) {
            return f(a.PDFDocViewPrefs,
                b)
        })
    };
    a.PDFDoc.prototype.isModified = function() {
        return a.sendWithPromise("PDFDoc.isModified", {
            doc: this.id
        })
    };
    a.PDFDoc.prototype.hasRepairedXRef = function() {
        return a.sendWithPromise("PDFDoc.hasRepairedXRef", {
            doc: this.id
        })
    };
    a.PDFDoc.prototype.isLinearized = function() {
        return a.sendWithPromise("PDFDoc.isLinearized", {
            doc: this.id
        })
    };
    a.PDFDoc.prototype.save = function(b, c) {
        d(arguments.length, 2, "save", "(string, number)", [
            [b, "string"],
            [c, "number"]
        ]);
        return a.sendWithPromise("PDFDoc.save", {
            doc: this.id,
            path: b,
            flags: c
        })
    };
    a.PDFDoc.prototype.saveMemoryBuffer = function(b) {
        d(arguments.length, 1, "saveMemoryBuffer", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("PDFDoc.saveMemoryBuffer", {
            doc: this.id,
            flags: b
        }).then(function(a) {
            return new Uint8Array(a)
        })
    };
    a.PDFDoc.prototype.saveStream = function(b, c) {
        d(arguments.length, 2, "saveStream", "(PDFNet.Filter, number)", [
            [b, "Object", a.Filter, "Filter"],
            [c, "number"]
        ]);
        return a.sendWithPromise("PDFDoc.saveStream", {
            doc: this.id,
            stream: b.id,
            flags: c
        })
    };
    a.PDFDoc.prototype.saveCustomSignature =
        function(b, c, e) {
            d(arguments.length, 3, "saveCustomSignature", "(ArrayBuffer|TypedArray, PDFNet.DigitalSignatureField, string)", [
                [b, "ArrayBuffer"],
                [c, "Structure", a.DigitalSignatureField, "DigitalSignatureField"],
                [e, "string"]
            ]);
            n("saveCustomSignature", [
                [c, 1]
            ]);
            var f = u(b, !1);
            return a.sendWithPromise("PDFDoc.saveCustomSignature", {
                doc: this.id,
                in_signature_buf: f,
                in_field: c,
                in_path: e
            })
        };
    a.PDFDoc.prototype.saveCustomSignatureBuffer = function(b, c) {
        d(arguments.length, 2, "saveCustomSignatureBuffer", "(ArrayBuffer|TypedArray, PDFNet.DigitalSignatureField)",
            [
                [b, "ArrayBuffer"],
                [c, "Structure", a.DigitalSignatureField, "DigitalSignatureField"]
            ]);
        n("saveCustomSignatureBuffer", [
            [c, 1]
        ]);
        var e = u(b, !1);
        return a.sendWithPromise("PDFDoc.saveCustomSignatureBuffer", {
            doc: this.id,
            in_signature_buf: e,
            in_field: c
        }).then(function(a) {
            return new Uint8Array(a)
        })
    };
    a.PDFDoc.prototype.saveCustomSignatureStream = function(b, c) {
        d(arguments.length, 2, "saveCustomSignatureStream", "(ArrayBuffer|TypedArray, PDFNet.DigitalSignatureField)", [
            [b, "ArrayBuffer"],
            [c, "Structure", a.DigitalSignatureField,
                "DigitalSignatureField"
            ]
        ]);
        n("saveCustomSignatureStream", [
            [c, 1]
        ]);
        var e = u(b, !1);
        return a.sendWithPromise("PDFDoc.saveCustomSignatureStream", {
            doc: this.id,
            in_signature_buf: e,
            in_field: c
        }).then(function(b) {
            return l(a.Filter, b)
        })
    };
    a.PDFDoc.prototype.getPageIterator = function(b) {
        "undefined" === typeof b && (b = 1);
        d(arguments.length, 0, "getPageIterator", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("PDFDoc.getPageIterator", {
            doc: this.id,
            page_number: b
        }).then(function(b) {
            return l(a.Iterator, b, "Page")
        })
    };
    a.PDFDoc.prototype.getPage =
        function(b) {
            d(arguments.length, 1, "getPage", "(number)", [
                [b, "number"]
            ]);
            return a.sendWithPromise("PDFDoc.getPage", {
                doc: this.id,
                page_number: b
            }).then(function(b) {
                return f(a.Page, b)
            })
        };
    a.PDFDoc.prototype.pageRemove = function(b) {
        d(arguments.length, 1, "pageRemove", "(PDFNet.Iterator)", [
            [b, "Object", a.Iterator, "Iterator"]
        ]);
        return a.sendWithPromise("PDFDoc.pageRemove", {
            doc: this.id,
            page_itr: b.id
        })
    };
    a.PDFDoc.prototype.pageInsert = function(b, c) {
        d(arguments.length, 2, "pageInsert", "(PDFNet.Iterator, PDFNet.Page)", [
            [b,
                "Object", a.Iterator, "Iterator"
            ],
            [c, "Object", a.Page, "Page"]
        ]);
        return a.sendWithPromise("PDFDoc.pageInsert", {
            doc: this.id,
            where: b.id,
            page: c.id
        })
    };
    a.PDFDoc.prototype.insertPages = function(b, c, e, f, g) {
        d(arguments.length, 5, "insertPages", "(number, PDFNet.PDFDoc, number, number, number)", [
            [b, "number"],
            [c, "PDFDoc"],
            [e, "number"],
            [f, "number"],
            [g, "number"]
        ]);
        return a.sendWithPromise("PDFDoc.insertPages", {
            dest_doc: this.id,
            insert_before_page_number: b,
            src_doc: c.id,
            start_page: e,
            end_page: f,
            flag: g
        })
    };
    a.PDFDoc.prototype.insertPageSet =
        function(b, c, e, f) {
            d(arguments.length, 4, "insertPageSet", "(number, PDFNet.PDFDoc, PDFNet.PageSet, number)", [
                [b, "number"],
                [c, "PDFDoc"],
                [e, "Object", a.PageSet, "PageSet"],
                [f, "number"]
            ]);
            return a.sendWithPromise("PDFDoc.insertPageSet", {
                dest_doc: this.id,
                insert_before_page_number: b,
                src_doc: c.id,
                source_page_set: e.id,
                flag: f
            })
        };
    a.PDFDoc.prototype.movePages = function(b, c, e, f, g) {
        d(arguments.length, 5, "movePages", "(number, PDFNet.PDFDoc, number, number, number)", [
            [b, "number"],
            [c, "PDFDoc"],
            [e, "number"],
            [f, "number"],
            [g, "number"]
        ]);
        return a.sendWithPromise("PDFDoc.movePages", {
            dest_doc: this.id,
            move_before_page_number: b,
            src_doc: c.id,
            start_page: e,
            end_page: f,
            flag: g
        })
    };
    a.PDFDoc.prototype.movePageSet = function(b, c, e, f) {
        d(arguments.length, 4, "movePageSet", "(number, PDFNet.PDFDoc, PDFNet.PageSet, number)", [
            [b, "number"],
            [c, "PDFDoc"],
            [e, "Object", a.PageSet, "PageSet"],
            [f, "number"]
        ]);
        return a.sendWithPromise("PDFDoc.movePageSet", {
            dest_doc: this.id,
            move_before_page_number: b,
            src_doc: c.id,
            source_page_set: e.id,
            flag: f
        })
    };
    a.PDFDoc.prototype.pagePushFront =
        function(b) {
            d(arguments.length, 1, "pagePushFront", "(PDFNet.Page)", [
                [b, "Object", a.Page, "Page"]
            ]);
            return a.sendWithPromise("PDFDoc.pagePushFront", {
                doc: this.id,
                page: b.id
            })
        };
    a.PDFDoc.prototype.pagePushBack = function(b) {
        d(arguments.length, 1, "pagePushBack", "(PDFNet.Page)", [
            [b, "Object", a.Page, "Page"]
        ]);
        return a.sendWithPromise("PDFDoc.pagePushBack", {
            doc: this.id,
            page: b.id
        })
    };
    a.PDFDoc.prototype.pageCreate = function(b) {
        "undefined" === typeof b && (b = new a.Rect(0, 0, 612, 792));
        d(arguments.length, 0, "pageCreate", "(PDFNet.Rect)",
            [
                [b, "Structure", a.Rect, "Rect"]
            ]);
        n("pageCreate", [
            [b, 0]
        ]);
        return a.sendWithPromise("PDFDoc.pageCreate", {
            doc: this.id,
            media_box: b
        }).then(function(b) {
            return f(a.Page, b)
        })
    };
    a.PDFDoc.prototype.appendTextDiffPage = function(b, c) {
        d(arguments.length, 2, "appendTextDiffPage", "(PDFNet.Page, PDFNet.Page)", [
            [b, "Object", a.Page, "Page"],
            [c, "Object", a.Page, "Page"]
        ]);
        return a.sendWithPromise("PDFDoc.appendTextDiffPage", {
            doc: this.id,
            page1: b.id,
            page2: c.id
        })
    };
    a.PDFDoc.prototype.appendTextDiffDoc = function(b, c, e) {
        "undefined" ===
        typeof e && (e = null);
        d(arguments.length, 2, "appendTextDiffDoc", "(PDFNet.PDFDoc, PDFNet.PDFDoc, PDFNet.OptionBase)", [
            [b, "PDFDoc"],
            [c, "PDFDoc"],
            [e, "OptionBase"]
        ]);
        n("appendTextDiffDoc", [
            [e, 2]
        ]);
        e = e ? e.getJsonString() : "{}";
        return a.sendWithPromise("PDFDoc.appendTextDiffDoc", {
            doc: this.id,
            doc1: b.id,
            doc2: c.id,
            options: e
        })
    };
    a.PDFDoc.highlightTextDiff = function(b, c, e) {
        "undefined" === typeof e && (e = null);
        d(arguments.length, 2, "highlightTextDiff", "(PDFNet.PDFDoc, PDFNet.PDFDoc, PDFNet.OptionBase)", [
            [b, "PDFDoc"],
            [c, "PDFDoc"],
            [e, "OptionBase"]
        ]);
        n("highlightTextDiff", [
            [e, 2]
        ]);
        e = e ? e.getJsonString() : "{}";
        return a.sendWithPromise("pdfDocHighlightTextDiff", {
            doc1: b.id,
            doc2: c.id,
            options: e
        })
    };
    a.PDFDoc.prototype.getFirstBookmark = function() {
        return a.sendWithPromise("PDFDoc.getFirstBookmark", {
            doc: this.id
        }).then(function(b) {
            return f(a.Bookmark, b)
        })
    };
    a.PDFDoc.prototype.addRootBookmark = function(b) {
        d(arguments.length, 1, "addRootBookmark", "(PDFNet.Bookmark)", [
            [b, "Object", a.Bookmark, "Bookmark"]
        ]);
        return a.sendWithPromise("PDFDoc.addRootBookmark", {
            doc: this.id,
            root_bookmark: b.id
        })
    };
    a.PDFDoc.prototype.getTrailer = function() {
        return a.sendWithPromise("PDFDoc.getTrailer", {
            doc: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.PDFDoc.prototype.getRoot = function() {
        return a.sendWithPromise("PDFDoc.getRoot", {
            doc: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.PDFDoc.prototype.jsContextInitialize = function() {
        return a.sendWithPromise("PDFDoc.jsContextInitialize", {
            doc: this.id
        })
    };
    a.PDFDoc.prototype.getPages = function() {
        return a.sendWithPromise("PDFDoc.getPages", {
            doc: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.PDFDoc.prototype.getPageCount = function() {
        return a.sendWithPromise("PDFDoc.getPageCount", {
            doc: this.id
        })
    };
    a.PDFDoc.prototype.getDownloadedByteCount = function() {
        return a.sendWithPromise("PDFDoc.getDownloadedByteCount", {
            doc: this.id
        })
    };
    a.PDFDoc.prototype.getTotalRemoteByteCount = function() {
        return a.sendWithPromise("PDFDoc.getTotalRemoteByteCount", {
            doc: this.id
        })
    };
    a.PDFDoc.prototype.getFieldIteratorBegin = function() {
        return a.sendWithPromise("PDFDoc.getFieldIteratorBegin", {
            doc: this.id
        }).then(function(b) {
            return l(a.Iterator, b, "Field")
        })
    };
    a.PDFDoc.prototype.getFieldIterator = function(b) {
        d(arguments.length, 1, "getFieldIterator", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("PDFDoc.getFieldIterator", {
            doc: this.id,
            field_name: b
        }).then(function(b) {
            return l(a.Iterator, b, "Field")
        })
    };
    a.PDFDoc.prototype.getField = function(b) {
        d(arguments.length, 1, "getField", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("PDFDoc.getField", {
            doc: this.id,
            field_name: b
        }).then(function(b) {
            return new a.Field(b)
        })
    };
    a.PDFDoc.prototype.fieldCreate = function(b, c, e, f) {
        "undefined" === typeof e && (e = new a.Obj("0"));
        "undefined" === typeof f && (f = new a.Obj("0"));
        d(arguments.length, 2, "fieldCreate", "(string, number, PDFNet.Obj, PDFNet.Obj)", [
            [b, "string"],
            [c, "number"],
            [e, "Object", a.Obj, "Obj"],
            [f, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("PDFDoc.fieldCreate", {
            doc: this.id,
            field_name: b,
            type: c,
            field_value: e.id,
            def_field_value: f.id
        }).then(function(b) {
            return new a.Field(b)
        })
    };
    a.PDFDoc.prototype.fieldCreateFromStrings = function(b,
        c, e, f) {
        "undefined" === typeof f && (f = "");
        d(arguments.length, 3, "fieldCreateFromStrings", "(string, number, string, string)", [
            [b, "string"],
            [c, "number"],
            [e, "string"],
            [f, "string"]
        ]);
        return a.sendWithPromise("PDFDoc.fieldCreateFromStrings", {
            doc: this.id,
            field_name: b,
            type: c,
            field_value: e,
            def_field_value: f
        }).then(function(b) {
            return new a.Field(b)
        })
    };
    a.PDFDoc.prototype.refreshFieldAppearances = function() {
        return a.sendWithPromise("PDFDoc.refreshFieldAppearances", {
            doc: this.id
        })
    };
    a.PDFDoc.prototype.refreshAnnotAppearances =
        function(b) {
            "undefined" === typeof b && (b = null);
            d(arguments.length, 0, "refreshAnnotAppearances", "(PDFNet.OptionBase)", [
                [b, "OptionBase"]
            ]);
            n("refreshAnnotAppearances", [
                [b, 0]
            ]);
            b = b ? b.getJsonString() : "{}";
            return a.sendWithPromise("PDFDoc.refreshAnnotAppearances", {
                doc: this.id,
                options: b
            })
        };
    a.PDFDoc.prototype.flattenAnnotations = function(b) {
        "undefined" === typeof b && (b = !1);
        d(arguments.length, 0, "flattenAnnotations", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("PDFDoc.flattenAnnotations", {
            doc: this.id,
            forms_only: b
        })
    };
    a.PDFDoc.prototype.flattenAnnotationsAdvanced = function(b) {
        d(arguments.length, 1, "flattenAnnotationsAdvanced", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("PDFDoc.flattenAnnotationsAdvanced", {
            doc: this.id,
            flags: b
        })
    };
    a.PDFDoc.prototype.getAcroForm = function() {
        return a.sendWithPromise("PDFDoc.getAcroForm", {
            doc: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.PDFDoc.prototype.fdfExtract = function(b) {
        "undefined" === typeof b && (b = a.PDFDoc.ExtractFlag.e_forms_only);
        d(arguments.length, 0, "fdfExtract", "(number)",
            [
                [b, "number"]
            ]);
        return a.sendWithPromise("PDFDoc.fdfExtract", {
            doc: this.id,
            flag: b
        }).then(function(b) {
            return l(a.FDFDoc, b)
        })
    };
    a.PDFDoc.prototype.fdfExtractPageSet = function(b, c) {
        "undefined" === typeof c && (c = a.PDFDoc.ExtractFlag.e_forms_only);
        d(arguments.length, 1, "fdfExtractPageSet", "(PDFNet.PageSet, number)", [
            [b, "Object", a.PageSet, "PageSet"],
            [c, "number"]
        ]);
        return a.sendWithPromise("PDFDoc.fdfExtractPageSet", {
            doc: this.id,
            pages_to_extract: b.id,
            flag: c
        }).then(function(b) {
            return l(a.FDFDoc, b)
        })
    };
    a.PDFDoc.prototype.fdfMerge =
        function(b) {
            d(arguments.length, 1, "fdfMerge", "(PDFNet.FDFDoc)", [
                [b, "FDFDoc"]
            ]);
            return a.sendWithPromise("PDFDoc.fdfMerge", {
                doc: this.id,
                fdf_doc: b.id
            })
        };
    a.PDFDoc.prototype.fdfUpdate = function(b) {
        d(arguments.length, 1, "fdfUpdate", "(PDFNet.FDFDoc)", [
            [b, "FDFDoc"]
        ]);
        return a.sendWithPromise("PDFDoc.fdfUpdate", {
            doc: this.id,
            fdf_doc: b.id
        })
    };
    a.PDFDoc.prototype.getOpenAction = function() {
        return a.sendWithPromise("PDFDoc.getOpenAction", {
            doc: this.id
        }).then(function(b) {
            return f(a.Action, b)
        })
    };
    a.PDFDoc.prototype.setOpenAction =
        function(b) {
            d(arguments.length, 1, "setOpenAction", "(PDFNet.Action)", [
                [b, "Object", a.Action, "Action"]
            ]);
            return a.sendWithPromise("PDFDoc.setOpenAction", {
                doc: this.id,
                action: b.id
            })
        };
    a.PDFDoc.prototype.addFileAttachment = function(b, c) {
        d(arguments.length, 2, "addFileAttachment", "(string, PDFNet.FileSpec)", [
            [b, "string"],
            [c, "Object", a.FileSpec, "FileSpec"]
        ]);
        return a.sendWithPromise("PDFDoc.addFileAttachment", {
            doc: this.id,
            file_key: b,
            embedded_file: c.id
        })
    };
    a.PDFDoc.prototype.getPageLabel = function(b) {
        d(arguments.length,
            1, "getPageLabel", "(number)", [
                [b, "number"]
            ]);
        return a.sendWithPromise("PDFDoc.getPageLabel", {
            doc: this.id,
            page_num: b
        }).then(function(b) {
            return new a.PageLabel(b)
        })
    };
    a.PDFDoc.prototype.setPageLabel = function(b, c) {
        d(arguments.length, 2, "setPageLabel", "(number, PDFNet.PageLabel)", [
            [b, "number"],
            [c, "Structure", a.PageLabel, "PageLabel"]
        ]);
        n("setPageLabel", [
            [c, 1]
        ]);
        return a.sendWithPromise("PDFDoc.setPageLabel", {
            doc: this.id,
            page_num: b,
            label: c
        })
    };
    a.PDFDoc.prototype.removePageLabel = function(b) {
        d(arguments.length,
            1, "removePageLabel", "(number)", [
                [b, "number"]
            ]);
        return a.sendWithPromise("PDFDoc.removePageLabel", {
            doc: this.id,
            page_num: b
        })
    };
    a.PDFDoc.prototype.getStructTree = function() {
        return a.sendWithPromise("PDFDoc.getStructTree", {
            doc: this.id
        }).then(function(b) {
            return f(a.STree, b)
        })
    };
    a.PDFDoc.prototype.hasOC = function() {
        return a.sendWithPromise("PDFDoc.hasOC", {
            doc: this.id
        })
    };
    a.PDFDoc.prototype.getOCGs = function() {
        return a.sendWithPromise("PDFDoc.getOCGs", {
            doc: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.PDFDoc.prototype.getOCGConfig =
        function() {
            return a.sendWithPromise("PDFDoc.getOCGConfig", {
                doc: this.id
            }).then(function(b) {
                return f(a.OCGConfig, b)
            })
        };
    a.PDFDoc.prototype.createIndirectName = function(b) {
        d(arguments.length, 1, "createIndirectName", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("PDFDoc.createIndirectName", {
            doc: this.id,
            name: b
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.PDFDoc.prototype.createIndirectArray = function() {
        return a.sendWithPromise("PDFDoc.createIndirectArray", {
            doc: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.PDFDoc.prototype.createIndirectBool = function(b) {
        d(arguments.length, 1, "createIndirectBool", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("PDFDoc.createIndirectBool", {
            doc: this.id,
            value: b
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.PDFDoc.prototype.createIndirectDict = function() {
        return a.sendWithPromise("PDFDoc.createIndirectDict", {
            doc: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.PDFDoc.prototype.createIndirectNull = function() {
        return a.sendWithPromise("PDFDoc.createIndirectNull", {
            doc: this.id
        }).then(function(b) {
            return f(a.Obj,
                b)
        })
    };
    a.PDFDoc.prototype.createIndirectNumber = function(b) {
        d(arguments.length, 1, "createIndirectNumber", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("PDFDoc.createIndirectNumber", {
            doc: this.id,
            value: b
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.PDFDoc.prototype.createIndirectString = function(b, c) {
        d(arguments.length, 2, "createIndirectString", "(number, number)", [
            [b, "number"],
            [c, "number"]
        ]);
        return a.sendWithPromise("PDFDoc.createIndirectString", {
            doc: this.id,
            value: b,
            buf_size: c
        }).then(function(b) {
            return f(a.Obj,
                b)
        })
    };
    a.PDFDoc.prototype.createIndirectStringFromUString = function(b) {
        d(arguments.length, 1, "createIndirectStringFromUString", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("PDFDoc.createIndirectStringFromUString", {
            doc: this.id,
            str: b
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.PDFDoc.prototype.createIndirectStreamFromFilter = function(b, c) {
        "undefined" === typeof c && (c = new a.Filter("0"));
        d(arguments.length, 1, "createIndirectStreamFromFilter", "(PDFNet.FilterReader, PDFNet.Filter)", [
            [b, "Object", a.FilterReader,
                "FilterReader"
            ],
            [c, "Object", a.Filter, "Filter"]
        ]);
        0 != c.id && t(c.id);
        return a.sendWithPromise("PDFDoc.createIndirectStreamFromFilter", {
            doc: this.id,
            data: b.id,
            no_own_filter_chain: c.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.PDFDoc.prototype.createIndirectStream = function(b, c) {
        d(arguments.length, 2, "createIndirectStream", "(ArrayBuffer|TypedArray, PDFNet.Filter)", [
            [b, "ArrayBuffer"],
            [c, "Object", a.Filter, "Filter"]
        ]);
        var e = u(b, !1);
        0 != c.id && t(c.id);
        return a.sendWithPromise("PDFDoc.createIndirectStream", {
            doc: this.id,
            data_buf: e,
            no_own_filter_chain: c.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.PDFDoc.prototype.getSDFDoc = function() {
        return a.sendWithPromise("PDFDoc.getSDFDoc", {
            doc: this.id
        }).then(function(b) {
            return f(a.SDFDoc, b)
        })
    };
    a.PDFDoc.prototype.unlock = function() {
        var b = this;
        return a.sendWithPromise("PDFDoc.unlock", {
            doc: this.id
        }).then(function() {
            y(b)
        })
    };
    a.PDFDoc.prototype.unlockRead = function() {
        var b = this;
        return a.sendWithPromise("PDFDoc.unlockRead", {
            doc: this.id
        }).then(function() {
            y(b)
        })
    };
    a.PDFDoc.prototype.addHighlights =
        function(b) {
            d(arguments.length, 1, "addHighlights", "(string)", [
                [b, "string"]
            ]);
            return a.sendWithPromise("PDFDoc.addHighlights", {
                doc: this.id,
                hilite: b
            })
        };
    a.PDFDoc.prototype.isTagged = function() {
        return a.sendWithPromise("PDFDoc.isTagged", {
            doc: this.id
        })
    };
    a.PDFDoc.prototype.hasSignatures = function() {
        return a.sendWithPromise("PDFDoc.hasSignatures", {
            doc: this.id
        })
    };
    a.PDFDoc.prototype.addSignatureHandler = function(b) {
        d(arguments.length, 1, "addSignatureHandler", "(PDFNet.SignatureHandler)", [
            [b, "Object", a.SignatureHandler,
                "SignatureHandler"
            ]
        ]);
        return a.sendWithPromise("PDFDoc.addSignatureHandler", {
            doc: this.id,
            signature_handler: b.id
        })
    };
    a.PDFDoc.prototype.addStdSignatureHandlerFromFile = function(b, c) {
        d(arguments.length, 2, "addStdSignatureHandlerFromFile", "(string, string)", [
            [b, "string"],
            [c, "string"]
        ]);
        return a.sendWithPromise("PDFDoc.addStdSignatureHandlerFromFile", {
            doc: this.id,
            pkcs12_file: b,
            pkcs12_pass: c
        })
    };
    a.PDFDoc.prototype.addStdSignatureHandlerFromBuffer = function(b, c) {
        d(arguments.length, 2, "addStdSignatureHandlerFromBuffer",
            "(ArrayBuffer|TypedArray, string)", [
                [b, "ArrayBuffer"],
                [c, "string"]
            ]);
        var e = u(b, !1);
        return a.sendWithPromise("PDFDoc.addStdSignatureHandlerFromBuffer", {
            doc: this.id,
            pkcs12_buffer: e,
            pkcs12_pass: c
        })
    };
    a.PDFDoc.prototype.removeSignatureHandler = function(b) {
        d(arguments.length, 1, "removeSignatureHandler", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("PDFDoc.removeSignatureHandler", {
            doc: this.id,
            signature_handler_id: b
        })
    };
    a.PDFDoc.prototype.getSignatureHandler = function(b) {
        d(arguments.length, 1, "getSignatureHandler",
            "(number)", [
                [b, "number"]
            ]);
        return a.sendWithPromise("PDFDoc.getSignatureHandler", {
            doc: this.id,
            signature_handler_id: b
        }).then(function(b) {
            return f(a.SignatureHandler, b)
        })
    };
    a.PDFDoc.prototype.generateThumbnails = function(b) {
        d(arguments.length, 1, "generateThumbnails", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("PDFDoc.generateThumbnails", {
            doc: this.id,
            size: b
        })
    };
    a.PDFDoc.prototype.appendVisualDiff = function(b, c, e) {
        "undefined" === typeof e && (e = null);
        d(arguments.length, 2, "appendVisualDiff", "(PDFNet.Page, PDFNet.Page, PDFNet.OptionBase)",
            [
                [b, "Object", a.Page, "Page"],
                [c, "Object", a.Page, "Page"],
                [e, "OptionBase"]
            ]);
        n("appendVisualDiff", [
            [e, 2]
        ]);
        e = e ? e.getJsonString() : "{}";
        return a.sendWithPromise("PDFDoc.appendVisualDiff", {
            doc: this.id,
            p1: b.id,
            p2: c.id,
            opts: e
        })
    };
    a.PDFDoc.prototype.getGeometryCollectionForPage = function(b) {
        d(arguments.length, 1, "getGeometryCollectionForPage", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("PDFDoc.getGeometryCollectionForPage", {
            in_pdfdoc: this.id,
            page_num: b
        }).then(function(b) {
            return l(a.GeometryCollection,
                b)
        })
    };
    a.PDFDoc.prototype.getUndoManager = function() {
        return a.sendWithPromise("PDFDoc.getUndoManager", {
            doc: this.id
        }).then(function(b) {
            return l(a.UndoManager, b)
        })
    };
    a.PDFDoc.prototype.createDigitalSignatureField = function(b) {
        "undefined" === typeof b && (b = "");
        d(arguments.length, 0, "createDigitalSignatureField", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("PDFDoc.createDigitalSignatureField", {
            doc: this.id,
            in_sig_field_name: b
        }).then(function(b) {
            return new a.DigitalSignatureField(b)
        })
    };
    a.PDFDoc.prototype.getDigitalSignatureFieldIteratorBegin =
        function() {
            return a.sendWithPromise("PDFDoc.getDigitalSignatureFieldIteratorBegin", {
                doc: this.id
            }).then(function(b) {
                return l(a.Iterator, b, "DigitalSignatureField")
            })
        };
    a.PDFDoc.prototype.getDigitalSignaturePermissions = function() {
        return a.sendWithPromise("PDFDoc.getDigitalSignaturePermissions", {
            doc: this.id
        })
    };
    a.PDFDoc.prototype.saveViewerOptimized = function(b, c) {
        d(arguments.length, 2, "saveViewerOptimized", "(string, PDFNet.Obj)", [
            [b, "string"],
            [c, "OptionObject", a.Obj, "Obj", "PDFNet.PDFDoc.ViewerOptimizedOptions"]
        ]);
        if ("PDFNet.PDFDoc.ViewerOptimizedOptions" === c.name) {
            var e = c;
            c = a.ObjSet.create().then(function(a) {
                return a.createFromJson(JSON.stringify(e))
            })
        } else c = Promise.resolve(c);
        var f = this;
        return c.then(function(c) {
            return a.sendWithPromise("PDFDoc.saveViewerOptimized", {
                doc: f.id,
                path: b,
                opts: c.id
            })
        })
    };
    a.PDFDoc.prototype.saveViewerOptimizedBuffer = function(b) {
        d(arguments.length, 1, "saveViewerOptimizedBuffer", "(PDFNet.Obj)", [
            [b, "OptionObject", a.Obj, "Obj", "PDFNet.PDFDoc.ViewerOptimizedOptions"]
        ]);
        if ("PDFNet.PDFDoc.ViewerOptimizedOptions" ===
            b.name) {
            var c = b;
            b = a.ObjSet.create().then(function(a) {
                return a.createFromJson(JSON.stringify(c))
            })
        } else b = Promise.resolve(b);
        var e = this;
        return b.then(function(b) {
            return a.sendWithPromise("PDFDoc.saveViewerOptimizedBuffer", {
                doc: e.id,
                opts: b.id
            }).then(function(a) {
                return new Uint8Array(a)
            })
        })
    };
    a.PDFDoc.prototype.verifySignedDigitalSignatures = function(b) {
        d(arguments.length, 1, "verifySignedDigitalSignatures", "(PDFNet.VerificationOptions)", [
            [b, "Object", a.VerificationOptions, "VerificationOptions"]
        ]);
        return a.sendWithPromise("PDFDoc.verifySignedDigitalSignatures", {
            doc: this.id,
            opts: b.id
        })
    };
    a.convertPageToAnnotAppearance = function(b, c, e, f) {
        d(arguments.length, 4, "convertPageToAnnotAppearance", "(PDFNet.PDFDoc, number, number, string)", [
            [b, "PDFDoc"],
            [c, "number"],
            [e, "number"],
            [f, "string"]
        ]);
        return a.sendWithPromise("convertPageToAnnotAppearance", {
            docWithAppearance: b.id,
            objNum: c,
            annot_state: e,
            appearance_state: f
        })
    };
    a.PDFDoc.prototype.mergeXFDF = function(b, c) {
        "undefined" === typeof c && (c = null);
        d(arguments.length, 1, "mergeXFDF", "(PDFNet.Filter, PDFNet.OptionBase)", [
            [b, "Object",
                a.Filter, "Filter"
            ],
            [c, "OptionBase"]
        ]);
        n("mergeXFDF", [
            [c, 1]
        ]);
        c = c ? c.getJsonString() : "{}";
        return a.sendWithPromise("PDFDoc.mergeXFDF", {
            doc: this.id,
            stream: b.id,
            options: c
        })
    };
    a.PDFDoc.prototype.mergeXFDFString = function(b, c) {
        "undefined" === typeof c && (c = null);
        d(arguments.length, 1, "mergeXFDFString", "(string, PDFNet.OptionBase)", [
            [b, "string"],
            [c, "OptionBase"]
        ]);
        n("mergeXFDFString", [
            [c, 1]
        ]);
        c = c ? c.getJsonString() : "{}";
        return a.sendWithPromise("PDFDoc.mergeXFDFString", {
            doc: this.id,
            xfdf: b,
            options: c
        })
    };
    a.PDFDocInfo.prototype.getTitle =
        function() {
            return a.sendWithPromise("PDFDocInfo.getTitle", {
                info: this.id
            })
        };
    a.PDFDocInfo.prototype.getTitleObj = function() {
        return a.sendWithPromise("PDFDocInfo.getTitleObj", {
            info: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.PDFDocInfo.prototype.setTitle = function(b) {
        d(arguments.length, 1, "setTitle", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("PDFDocInfo.setTitle", {
            info: this.id,
            title: b
        })
    };
    a.PDFDocInfo.prototype.getAuthor = function() {
        return a.sendWithPromise("PDFDocInfo.getAuthor", {
            info: this.id
        })
    };
    a.PDFDocInfo.prototype.getAuthorObj = function() {
        return a.sendWithPromise("PDFDocInfo.getAuthorObj", {
            info: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.PDFDocInfo.prototype.setAuthor = function(b) {
        d(arguments.length, 1, "setAuthor", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("PDFDocInfo.setAuthor", {
            info: this.id,
            author: b
        })
    };
    a.PDFDocInfo.prototype.getSubject = function() {
        return a.sendWithPromise("PDFDocInfo.getSubject", {
            info: this.id
        })
    };
    a.PDFDocInfo.prototype.getSubjectObj = function() {
        return a.sendWithPromise("PDFDocInfo.getSubjectObj", {
            info: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.PDFDocInfo.prototype.setSubject = function(b) {
        d(arguments.length, 1, "setSubject", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("PDFDocInfo.setSubject", {
            info: this.id,
            subject: b
        })
    };
    a.PDFDocInfo.prototype.getKeywords = function() {
        return a.sendWithPromise("PDFDocInfo.getKeywords", {
            info: this.id
        })
    };
    a.PDFDocInfo.prototype.getKeywordsObj = function() {
        return a.sendWithPromise("PDFDocInfo.getKeywordsObj", {
            info: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.PDFDocInfo.prototype.setKeywords = function(b) {
        d(arguments.length, 1, "setKeywords", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("PDFDocInfo.setKeywords", {
            info: this.id,
            keywords: b
        })
    };
    a.PDFDocInfo.prototype.getCreator = function() {
        return a.sendWithPromise("PDFDocInfo.getCreator", {
            info: this.id
        })
    };
    a.PDFDocInfo.prototype.getCreatorObj = function() {
        return a.sendWithPromise("PDFDocInfo.getCreatorObj", {
            info: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.PDFDocInfo.prototype.setCreator = function(b) {
        d(arguments.length,
            1, "setCreator", "(string)", [
                [b, "string"]
            ]);
        return a.sendWithPromise("PDFDocInfo.setCreator", {
            info: this.id,
            creator: b
        })
    };
    a.PDFDocInfo.prototype.getProducer = function() {
        return a.sendWithPromise("PDFDocInfo.getProducer", {
            info: this.id
        })
    };
    a.PDFDocInfo.prototype.getProducerObj = function() {
        return a.sendWithPromise("PDFDocInfo.getProducerObj", {
            info: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.PDFDocInfo.prototype.setProducer = function(b) {
        d(arguments.length, 1, "setProducer", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("PDFDocInfo.setProducer", {
            info: this.id,
            producer: b
        })
    };
    a.PDFDocInfo.prototype.getCreationDate = function() {
        return a.sendWithPromise("PDFDocInfo.getCreationDate", {
            info: this.id
        }).then(function(b) {
            return new a.Date(b)
        })
    };
    a.PDFDocInfo.prototype.setCreationDate = function(b) {
        d(arguments.length, 1, "setCreationDate", "(PDFNet.Date)", [
            [b, "Structure", a.Date, "Date"]
        ]);
        n("setCreationDate", [
            [b, 0]
        ]);
        return a.sendWithPromise("PDFDocInfo.setCreationDate", {
            info: this.id,
            creation_date: b
        })
    };
    a.PDFDocInfo.prototype.getModDate = function() {
        return a.sendWithPromise("PDFDocInfo.getModDate", {
            info: this.id
        }).then(function(b) {
            return new a.Date(b)
        })
    };
    a.PDFDocInfo.prototype.setModDate = function(b) {
        d(arguments.length, 1, "setModDate", "(PDFNet.Date)", [
            [b, "Structure", a.Date, "Date"]
        ]);
        n("setModDate", [
            [b, 0]
        ]);
        return a.sendWithPromise("PDFDocInfo.setModDate", {
            info: this.id,
            mod_date: b
        })
    };
    a.PDFDocInfo.prototype.getSDFObj = function() {
        return a.sendWithPromise("PDFDocInfo.getSDFObj", {
            info: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.PDFDocInfo.create = function(b) {
        d(arguments.length, 1, "create", "(PDFNet.Obj)",
            [
                [b, "Object", a.Obj, "Obj"]
            ]);
        return a.sendWithPromise("pdfDocInfoCreate", {
            tr: b.id
        }).then(function(b) {
            return f(a.PDFDocInfo, b)
        })
    };
    a.PDFDocInfo.prototype.copy = function() {
        return a.sendWithPromise("PDFDocInfo.copy", {
            info: this.id
        }).then(function(b) {
            return f(a.PDFDocInfo, b)
        })
    };
    a.PDFDocViewPrefs.prototype.setInitialPage = function(b) {
        d(arguments.length, 1, "setInitialPage", "(PDFNet.Destination)", [
            [b, "Object", a.Destination, "Destination"]
        ]);
        return a.sendWithPromise("PDFDocViewPrefs.setInitialPage", {
            p: this.id,
            dest: b.id
        })
    };
    a.PDFDocViewPrefs.prototype.setPageMode = function(b) {
        d(arguments.length, 1, "setPageMode", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("PDFDocViewPrefs.setPageMode", {
            p: this.id,
            mode: b
        })
    };
    a.PDFDocViewPrefs.prototype.getPageMode = function() {
        return a.sendWithPromise("PDFDocViewPrefs.getPageMode", {
            p: this.id
        })
    };
    a.PDFDocViewPrefs.prototype.setLayoutMode = function(b) {
        d(arguments.length, 1, "setLayoutMode", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("PDFDocViewPrefs.setLayoutMode", {
            p: this.id,
            mode: b
        })
    };
    a.PDFDocViewPrefs.prototype.getLayoutMode = function() {
        return a.sendWithPromise("PDFDocViewPrefs.getLayoutMode", {
            p: this.id
        })
    };
    a.PDFDocViewPrefs.prototype.setPref = function(b, c) {
        d(arguments.length, 2, "setPref", "(number, boolean)", [
            [b, "number"],
            [c, "boolean"]
        ]);
        return a.sendWithPromise("PDFDocViewPrefs.setPref", {
            p: this.id,
            pref: b,
            value: c
        })
    };
    a.PDFDocViewPrefs.prototype.getPref = function(b) {
        d(arguments.length, 1, "getPref", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("PDFDocViewPrefs.getPref", {
            p: this.id,
            pref: b
        })
    };
    a.PDFDocViewPrefs.prototype.setNonFullScreenPageMode = function(b) {
        d(arguments.length, 1, "setNonFullScreenPageMode", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("PDFDocViewPrefs.setNonFullScreenPageMode", {
            p: this.id,
            mode: b
        })
    };
    a.PDFDocViewPrefs.prototype.getNonFullScreenPageMode = function() {
        return a.sendWithPromise("PDFDocViewPrefs.getNonFullScreenPageMode", {
            p: this.id
        })
    };
    a.PDFDocViewPrefs.prototype.setDirection = function(b) {
        d(arguments.length, 1, "setDirection", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("PDFDocViewPrefs.setDirection", {
            p: this.id,
            left_to_right: b
        })
    };
    a.PDFDocViewPrefs.prototype.getDirection = function() {
        return a.sendWithPromise("PDFDocViewPrefs.getDirection", {
            p: this.id
        })
    };
    a.PDFDocViewPrefs.prototype.setViewArea = function(b) {
        d(arguments.length, 1, "setViewArea", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("PDFDocViewPrefs.setViewArea", {
            p: this.id,
            box: b
        })
    };
    a.PDFDocViewPrefs.prototype.getViewArea = function() {
        return a.sendWithPromise("PDFDocViewPrefs.getViewArea", {
            p: this.id
        })
    };
    a.PDFDocViewPrefs.prototype.setViewClip = function(b) {
        d(arguments.length, 1, "setViewClip", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("PDFDocViewPrefs.setViewClip", {
            p: this.id,
            box: b
        })
    };
    a.PDFDocViewPrefs.prototype.getViewClip = function() {
        return a.sendWithPromise("PDFDocViewPrefs.getViewClip", {
            p: this.id
        })
    };
    a.PDFDocViewPrefs.prototype.setPrintArea = function(b) {
        d(arguments.length, 1, "setPrintArea", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("PDFDocViewPrefs.setPrintArea", {
            p: this.id,
            box: b
        })
    };
    a.PDFDocViewPrefs.prototype.getPrintArea = function() {
        return a.sendWithPromise("PDFDocViewPrefs.getPrintArea", {
            p: this.id
        })
    };
    a.PDFDocViewPrefs.prototype.setPrintClip = function(b) {
        d(arguments.length, 1, "setPrintClip", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("PDFDocViewPrefs.setPrintClip", {
            p: this.id,
            box: b
        })
    };
    a.PDFDocViewPrefs.prototype.getPrintClip = function() {
        return a.sendWithPromise("PDFDocViewPrefs.getPrintClip", {
            p: this.id
        })
    };
    a.PDFDocViewPrefs.prototype.getSDFObj = function() {
        return a.sendWithPromise("PDFDocViewPrefs.getSDFObj", {
            p: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.PDFDocViewPrefs.create = function(b) {
        d(arguments.length, 1, "create", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("pdfDocViewPrefsCreate", {
            tr: b.id
        }).then(function(b) {
            return f(a.PDFDocViewPrefs, b)
        })
    };
    a.PDFDocViewPrefs.prototype.copy = function() {
        return a.sendWithPromise("PDFDocViewPrefs.copy", {
            prefs: this.id
        }).then(function(b) {
            return f(a.PDFDocViewPrefs, b)
        })
    };
    a.PDFRasterizer.create = function(b) {
        "undefined" === typeof b && (b = a.PDFRasterizer.Type.e_BuiltIn);
        d(arguments.length, 0, "create", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("pdfRasterizerCreate", {
            type: b
        }).then(function(b) {
            return l(a.PDFRasterizer, b)
        })
    };
    a.PDFRasterizer.prototype.getChunkRendererPath = function(b, c, e, g, h, k, l, p, q) {
        d(arguments.length, 9, "getChunkRendererPath", "(PDFNet.Page, string, number, number, boolean, PDFNet.Matrix2D, PDFNet.Rect, PDFNet.Rect, boolean)", [
            [b, "Object", a.Page, "Page"],
            [c, "string"],
            [e, "number"],
            [g, "number"],
            [h, "boolean"],
            [k, "Structure", a.Matrix2D, "Matrix2D"],
            [l, "Structure", a.Rect, "Rect"],
            [p, "Structure", a.Rect, "Rect"],
            [q, "boolean"]
        ]);
        n("getChunkRendererPath", [
            [k, 5],
            [l, 6],
            [p, 7]
        ]);
        return a.sendWithPromise("PDFRasterizer.getChunkRendererPath", {
            r: this.id,
            page: b.id,
            file_path: c,
            width: e,
            height: g,
            demult: h,
            device_mtx: k,
            clip: l,
            scrl_clp_regions: p,
            cancel: q
        }).then(function(b) {
            return f(a.ChunkRenderer, b)
        })
    };
    a.PDFRasterizer.prototype.setDrawAnnotations = function(b) {
        d(arguments.length, 1, "setDrawAnnotations", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("PDFRasterizer.setDrawAnnotations", {
            r: this.id,
            render_annots: b
        })
    };
    a.PDFRasterizer.prototype.setHighlightFields = function(b) {
        d(arguments.length, 1, "setHighlightFields", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("PDFRasterizer.setHighlightFields", {
            r: this.id,
            highlight: b
        })
    };
    a.PDFRasterizer.prototype.setAntiAliasing = function(b) {
        d(arguments.length, 1, "setAntiAliasing", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("PDFRasterizer.setAntiAliasing", {
            r: this.id,
            enable_aa: b
        })
    };
    a.PDFRasterizer.prototype.setPathHinting = function(b) {
        d(arguments.length,
            1, "setPathHinting", "(boolean)", [
                [b, "boolean"]
            ]);
        return a.sendWithPromise("PDFRasterizer.setPathHinting", {
            r: this.id,
            enable_hinting: b
        })
    };
    a.PDFRasterizer.prototype.setThinLineAdjustment = function(b, c) {
        d(arguments.length, 2, "setThinLineAdjustment", "(boolean, boolean)", [
            [b, "boolean"],
            [c, "boolean"]
        ]);
        return a.sendWithPromise("PDFRasterizer.setThinLineAdjustment", {
            r: this.id,
            grid_fit: b,
            stroke_adjust: c
        })
    };
    a.PDFRasterizer.prototype.setGamma = function(b) {
        d(arguments.length, 1, "setGamma", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("PDFRasterizer.setGamma", {
            r: this.id,
            expgamma: b
        })
    };
    a.PDFRasterizer.prototype.setOCGContext = function(b) {
        d(arguments.length, 1, "setOCGContext", "(PDFNet.OCGContext)", [
            [b, "Object", a.OCGContext, "OCGContext"]
        ]);
        return a.sendWithPromise("PDFRasterizer.setOCGContext", {
            r: this.id,
            ctx: b.id
        })
    };
    a.PDFRasterizer.prototype.setPrintMode = function(b) {
        d(arguments.length, 1, "setPrintMode", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("PDFRasterizer.setPrintMode", {
            r: this.id,
            is_printing: b
        })
    };
    a.PDFRasterizer.prototype.setImageSmoothing = function(b, c) {
        "undefined" === typeof b && (b = !0);
        "undefined" === typeof c && (c = !1);
        d(arguments.length, 0, "setImageSmoothing", "(boolean, boolean)", [
            [b, "boolean"],
            [c, "boolean"]
        ]);
        return a.sendWithPromise("PDFRasterizer.setImageSmoothing", {
            r: this.id,
            smoothing_enabled: b,
            hq_image_resampling: c
        })
    };
    a.PDFRasterizer.prototype.setOverprint = function(b) {
        d(arguments.length, 1, "setOverprint", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("PDFRasterizer.setOverprint", {
            r: this.id,
            op: b
        })
    };
    a.PDFRasterizer.prototype.setCaching = function(b) {
        "undefined" === typeof b && (b = !0);
        d(arguments.length, 0, "setCaching", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("PDFRasterizer.setCaching", {
            r: this.id,
            enabled: b
        })
    };
    a.PDFDraw.prototype.setOCGContext = function(b) {
        d(arguments.length, 1, "setOCGContext", "(PDFNet.OCGContext)", [
            [b, "Object", a.OCGContext, "OCGContext"]
        ]);
        return a.sendWithPromise("PDFDraw.setOCGContext", {
            r: this.id,
            ctx: b.id
        })
    };
    a.PDFRasterizer.prototype.setAnnotationState = function(b,
        c) {
        d(arguments.length, 2, "setAnnotationState", "(PDFNet.Annot, number)", [
            [b, "Object", a.Annot, "Annot"],
            [c, "number"]
        ]);
        return a.sendWithPromise("PDFRasterizer.setAnnotationState", {
            r: this.id,
            annot: b.id,
            new_view_state: c
        })
    };
    a.PDFRasterizer.prototype.setRasterizerType = function(b) {
        d(arguments.length, 1, "setRasterizerType", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("PDFRasterizer.setRasterizerType", {
            r: this.id,
            type: b
        })
    };
    a.PDFRasterizer.prototype.getRasterizerType = function() {
        return a.sendWithPromise("PDFRasterizer.getRasterizerType", {
            r: this.id
        })
    };
    a.PDFRasterizer.prototype.setColorPostProcessMode = function(b) {
        d(arguments.length, 1, "setColorPostProcessMode", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("PDFRasterizer.setColorPostProcessMode", {
            r: this.id,
            mode: b
        })
    };
    a.PDFRasterizer.prototype.getColorPostProcessMode = function() {
        return a.sendWithPromise("PDFRasterizer.getColorPostProcessMode", {
            r: this.id
        })
    };
    a.PDFRasterizer.prototype.enableDisplayListCaching = function(b) {
        d(arguments.length, 1, "enableDisplayListCaching", "(boolean)", [
            [b,
                "boolean"
            ]
        ]);
        return a.sendWithPromise("PDFRasterizer.enableDisplayListCaching", {
            r: this.id,
            enabled: b
        })
    };
    a.PDFRasterizer.prototype.updateBuffer = function() {
        return a.sendWithPromise("PDFRasterizer.updateBuffer", {
            r: this.id
        })
    };
    a.PDFRasterizer.prototype.rasterizeAnnot = function(b, c, e, g, h) {
        d(arguments.length, 5, "rasterizeAnnot", "(PDFNet.Annot, PDFNet.Page, PDFNet.Matrix2D, boolean, boolean)", [
            [b, "Object", a.Annot, "Annot"],
            [c, "Object", a.Page, "Page"],
            [e, "Structure", a.Matrix2D, "Matrix2D"],
            [g, "boolean"],
            [h, "boolean"]
        ]);
        n("rasterizeAnnot", [
            [e, 2]
        ]);
        return a.sendWithPromise("PDFRasterizer.rasterizeAnnot", {
            r: this.id,
            annot: b.id,
            page: c.id,
            device_mtx: e,
            demult: g,
            cancel: h
        }).then(function(b) {
            return f(a.OwnedBitmap, b)
        })
    };
    a.PDFRasterizer.prototype.rasterizeSeparations = function(b, c, e, f, g, h) {
        d(arguments.length, 6, "rasterizeSeparations", "(PDFNet.Page, number, number, PDFNet.Matrix2D, PDFNet.Rect, boolean)", [
            [b, "Object", a.Page, "Page"],
            [c, "number"],
            [e, "number"],
            [f, "Structure", a.Matrix2D, "Matrix2D"],
            [g, "Structure", a.Rect, "Rect"],
            [h, "boolean"]
        ]);
        n("rasterizeSeparations", [
            [f, 3],
            [g, 4]
        ]);
        return a.sendWithPromise("PDFRasterizer.rasterizeSeparations", {
            r: this.id,
            page: b.id,
            width: c,
            height: e,
            mtx: f,
            clip: g,
            cancel: h
        }).then(function(b) {
            for (var c = [], e = 0; e < b.length; ++e) {
                var d = b[e];
                if ("0" === d) return null;
                d = new a.Separation(d);
                c.push(d)
            }
            return c
        })
    };
    a.PDFDraw.create = function(b) {
        "undefined" === typeof b && (b = 92);
        d(arguments.length, 0, "create", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("pdfDrawCreate", {
            dpi: b
        }).then(function(b) {
            return l(a.PDFDraw,
                b)
        })
    };
    a.PDFDraw.prototype.setRasterizerType = function(b) {
        d(arguments.length, 1, "setRasterizerType", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("PDFDraw.setRasterizerType", {
            d: this.id,
            type: b
        })
    };
    a.PDFDraw.prototype.setDPI = function(b) {
        d(arguments.length, 1, "setDPI", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("PDFDraw.setDPI", {
            d: this.id,
            dpi: b
        })
    };
    a.PDFDraw.prototype.setImageSize = function(b, c, e) {
        "undefined" === typeof e && (e = !0);
        d(arguments.length, 2, "setImageSize", "(number, number, boolean)", [
            [b,
                "number"
            ],
            [c, "number"],
            [e, "boolean"]
        ]);
        return a.sendWithPromise("PDFDraw.setImageSize", {
            d: this.id,
            width: b,
            height: c,
            preserve_aspect_ratio: e
        })
    };
    a.PDFDraw.prototype.setPageBox = function(b) {
        d(arguments.length, 1, "setPageBox", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("PDFDraw.setPageBox", {
            d: this.id,
            region: b
        })
    };
    a.PDFDraw.prototype.setClipRect = function(b) {
        d(arguments.length, 1, "setClipRect", "(PDFNet.Rect)", [
            [b, "Structure", a.Rect, "Rect"]
        ]);
        n("setClipRect", [
            [b, 0]
        ]);
        return a.sendWithPromise("PDFDraw.setClipRect", {
            d: this.id,
            rect: b
        })
    };
    a.PDFDraw.prototype.setFlipYAxis = function(b) {
        d(arguments.length, 1, "setFlipYAxis", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("PDFDraw.setFlipYAxis", {
            d: this.id,
            flip_y: b
        })
    };
    a.PDFDraw.prototype.setRotate = function(b) {
        d(arguments.length, 1, "setRotate", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("PDFDraw.setRotate", {
            d: this.id,
            r: b
        })
    };
    a.PDFDraw.prototype.setDrawAnnotations = function(b) {
        d(arguments.length, 1, "setDrawAnnotations", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("PDFDraw.setDrawAnnotations", {
            d: this.id,
            render_annots: b
        })
    };
    a.PDFDraw.prototype.setHighlightFields = function(b) {
        d(arguments.length, 1, "setHighlightFields", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("PDFDraw.setHighlightFields", {
            d: this.id,
            highlight: b
        })
    };
    a.PDFDraw.prototype.setAntiAliasing = function(b) {
        d(arguments.length, 1, "setAntiAliasing", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("PDFDraw.setAntiAliasing", {
            d: this.id,
            enable_aa: b
        })
    };
    a.PDFDraw.prototype.setPathHinting = function(b) {
        d(arguments.length, 1, "setPathHinting",
            "(boolean)", [
                [b, "boolean"]
            ]);
        return a.sendWithPromise("PDFDraw.setPathHinting", {
            d: this.id,
            enable_hinting: b
        })
    };
    a.PDFDraw.prototype.setThinLineAdjustment = function(b, c) {
        d(arguments.length, 2, "setThinLineAdjustment", "(boolean, boolean)", [
            [b, "boolean"],
            [c, "boolean"]
        ]);
        return a.sendWithPromise("PDFDraw.setThinLineAdjustment", {
            d: this.id,
            grid_fit: b,
            stroke_adjust: c
        })
    };
    a.PDFDraw.prototype.setGamma = function(b) {
        d(arguments.length, 1, "setGamma", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("PDFDraw.setGamma", {
            d: this.id,
            exp: b
        })
    };
    a.PDFDraw.prototype.setPrintMode = function(b) {
        d(arguments.length, 1, "setPrintMode", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("PDFDraw.setPrintMode", {
            d: this.id,
            is_printing: b
        })
    };
    a.PDFDraw.prototype.setPageTransparent = function(b) {
        d(arguments.length, 1, "setPageTransparent", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("PDFDraw.setPageTransparent", {
            d: this.id,
            is_transparent: b
        })
    };
    a.PDFDraw.prototype.setDefaultPageColor = function(b, c, e) {
        d(arguments.length, 3, "setDefaultPageColor",
            "(number, number, number)", [
                [b, "number"],
                [c, "number"],
                [e, "number"]
            ]);
        return a.sendWithPromise("PDFDraw.setDefaultPageColor", {
            d: this.id,
            r: b,
            g: c,
            b: e
        })
    };
    a.PDFDraw.prototype.setOverprint = function(b) {
        d(arguments.length, 1, "setOverprint", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("PDFDraw.setOverprint", {
            d: this.id,
            op: b
        })
    };
    a.PDFDraw.prototype.setImageSmoothing = function(b, c) {
        "undefined" === typeof b && (b = !0);
        "undefined" === typeof c && (c = !1);
        d(arguments.length, 0, "setImageSmoothing", "(boolean, boolean)",
            [
                [b, "boolean"],
                [c, "boolean"]
            ]);
        return a.sendWithPromise("PDFDraw.setImageSmoothing", {
            d: this.id,
            smoothing_enabled: b,
            hq_image_resampling: c
        })
    };
    a.PDFDraw.prototype.setCaching = function(b) {
        "undefined" === typeof b && (b = !0);
        d(arguments.length, 0, "setCaching", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("PDFDraw.setCaching", {
            d: this.id,
            enabled: b
        })
    };
    a.PDFDraw.prototype.export = function(b, c, e, f) {
        "undefined" === typeof e && (e = "PNG");
        "undefined" === typeof f && (f = new a.Obj("0"));
        d(arguments.length, 2, "export", "(PDFNet.Page, string, string, PDFNet.Obj)",
            [
                [b, "Object", a.Page, "Page"],
                [c, "string"],
                [e, "const char* = 0"],
                [f, "Object", a.Obj, "Obj"]
            ]);
        return a.sendWithPromise("PDFDraw.export", {
            d: this.id,
            page: b.id,
            filename: c,
            format: e,
            encoder_params: f.id
        })
    };
    a.PDFDraw.prototype.setColorPostProcessMode = function(b) {
        d(arguments.length, 1, "setColorPostProcessMode", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("PDFDraw.setColorPostProcessMode", {
            d: this.id,
            mode: b
        })
    };
    a.PDFDraw.prototype.getSeparationBitmaps = function(b) {
        d(arguments.length, 1, "getSeparationBitmaps",
            "(PDFNet.Page)", [
                [b, "Object", a.Page, "Page"]
            ]);
        return a.sendWithPromise("PDFDraw.getSeparationBitmaps", {
            d: this.id,
            page: b.id
        }).then(function(b) {
            for (var c = [], d = 0; d < b.length; ++d) {
                var f = b[d];
                if ("0" === f) return null;
                f = new a.Separation(f);
                c.push(f)
            }
            return c
        })
    };
    a.enableJavaScript = function(b) {
        d(arguments.length, 1, "enableJavaScript", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("pdfNetEnableJavaScript", {
            enable: b
        })
    };
    a.isJavaScriptEnabled = function() {
        return a.sendWithPromise("pdfNetIsJavaScriptEnabled", {})
    };
    a.terminateEx = function(b) {
        d(arguments.length, 1, "terminateEx", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("pdfNetTerminateEx", {
            termination_level: b
        })
    };
    a.setResourcesPath = function(b) {
        d(arguments.length, 1, "setResourcesPath", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("pdfNetSetResourcesPath", {
            path: b
        })
    };
    a.addResourceSearchPath = function(b) {
        d(arguments.length, 1, "addResourceSearchPath", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("pdfNetAddResourceSearchPath", {
            path: b
        })
    };
    a.setColorManagement =
        function(b) {
            "undefined" === typeof b && (b = a.CMSType.e_lcms);
            d(arguments.length, 0, "setColorManagement", "(number)", [
                [b, "number"]
            ]);
            return a.sendWithPromise("pdfNetSetColorManagement", {
                t: b
            })
        };
    a.setDefaultDeviceRGBProfile = function(b) {
        d(arguments.length, 1, "setDefaultDeviceRGBProfile", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("pdfNetSetDefaultDeviceRGBProfile", {
            icc_filename: b
        })
    };
    a.setDefaultDeviceCMYKProfileFromFilter = function(b) {
        d(arguments.length, 1, "setDefaultDeviceCMYKProfileFromFilter", "(PDFNet.Filter)",
            [
                [b, "Object", a.Filter, "Filter"]
            ]);
        return a.sendWithPromise("pdfNetSetDefaultDeviceCMYKProfileFromFilter", {
            stream: b.id
        })
    };
    a.setDefaultDeviceRGBProfileFromFilter = function(b) {
        d(arguments.length, 1, "setDefaultDeviceRGBProfileFromFilter", "(PDFNet.Filter)", [
            [b, "Object", a.Filter, "Filter"]
        ]);
        return a.sendWithPromise("pdfNetSetDefaultDeviceRGBProfileFromFilter", {
            stream: b.id
        })
    };
    a.setDefaultFlateCompressionLevel = function(b) {
        d(arguments.length, 1, "setDefaultFlateCompressionLevel", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("pdfNetSetDefaultFlateCompressionLevel", {
            level: b
        })
    };
    a.setViewerCache = function(b, c) {
        d(arguments.length, 2, "setViewerCache", "(number, boolean)", [
            [b, "number"],
            [c, "boolean"]
        ]);
        return a.sendWithPromise("pdfNetSetViewerCache", {
            max_cache_size: b,
            on_disk: c
        })
    };
    a.addFontSubstFromName = function(b, c) {
        d(arguments.length, 2, "addFontSubstFromName", "(string, string)", [
            [b, "string"],
            [c, "string"]
        ]);
        return a.sendWithPromise("pdfNetAddFontSubstFromName", {
            fontname: b,
            fontpath: c
        })
    };
    a.getVersion = function() {
        return a.sendWithPromise("pdfNetGetVersion", {})
    };
    a.setLogLevel =
        function(b) {
            "undefined" === typeof b && (b = a.LogLevel.e_LogLevel_Fatal);
            d(arguments.length, 0, "setLogLevel", "(number)", [
                [b, "number"]
            ]);
            return a.sendWithPromise("pdfNetSetLogLevel", {
                level: b
            })
        };
    a.getSystemFontList = function() {
        return a.sendWithPromise("pdfNetGetSystemFontList", {})
    };
    a.addPDFTronCustomHandler = function(b) {
        d(arguments.length, 1, "addPDFTronCustomHandler", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("pdfNetAddPDFTronCustomHandler", {
            custom_id: b
        })
    };
    a.getVersionString = function() {
        return a.sendWithPromise("pdfNetGetVersionString", {})
    };
    a.setConnectionErrorHandlingMode = function(b) {
        d(arguments.length, 1, "setConnectionErrorHandlingMode", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("pdfNetSetConnectionErrorHandlingMode", {
            mode: b
        })
    };
    a.Rect.init = function(b, c, e, f) {
        d(arguments.length, 4, "init", "(number, number, number, number)", [
            [b, "number"],
            [c, "number"],
            [e, "number"],
            [f, "number"]
        ]);
        return a.sendWithPromise("rectInit", {
            x1: b,
            y1: c,
            x2: e,
            y2: f
        }).then(function(b) {
            return new a.Rect(b)
        })
    };
    a.Rect.prototype.attach = function(b) {
        d(arguments.length,
            1, "attach", "(PDFNet.Obj)", [
                [b, "Object", a.Obj, "Obj"]
            ]);
        k("attach", this.yieldFunction);
        var c = this;
        this.yieldFunction = "Rect.attach";
        return a.sendWithPromise("Rect.attach", {
            rect: this,
            obj: b.id
        }).then(function(a) {
            c.yieldFunction = void 0;
            q(a, c)
        })
    };
    a.Rect.prototype.update = function(b) {
        "undefined" === typeof b && (b = new a.Obj("__null"));
        d(arguments.length, 0, "update", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        k("update", this.yieldFunction);
        var c = this;
        this.yieldFunction = "Rect.update";
        return a.sendWithPromise("Rect.update", {
            rect: this,
            obj: b.id
        }).then(function(a) {
            c.yieldFunction = void 0;
            q(a.rect, c);
            return a.result
        })
    };
    a.Rect.prototype.get = function() {
        k("get", this.yieldFunction);
        return a.sendWithPromise("Rect.get", {
            rect: this
        })
    };
    a.Rect.prototype.set = function(b, c, e, f) {
        d(arguments.length, 4, "set", "(number, number, number, number)", [
            [b, "number"],
            [c, "number"],
            [e, "number"],
            [f, "number"]
        ]);
        k("set", this.yieldFunction);
        var g = this;
        this.yieldFunction = "Rect.set";
        return a.sendWithPromise("Rect.set", {
            rect: this,
            x1: b,
            y1: c,
            x2: e,
            y2: f
        }).then(function(a) {
            g.yieldFunction =
                void 0;
            q(a, g)
        })
    };
    a.Rect.prototype.width = function() {
        k("width", this.yieldFunction);
        return a.sendWithPromise("Rect.width", {
            rect: this
        })
    };
    a.Rect.prototype.height = function() {
        k("height", this.yieldFunction);
        return a.sendWithPromise("Rect.height", {
            rect: this
        })
    };
    a.Rect.prototype.contains = function(b, c) {
        d(arguments.length, 2, "contains", "(number, number)", [
            [b, "number"],
            [c, "number"]
        ]);
        k("contains", this.yieldFunction);
        return a.sendWithPromise("Rect.contains", {
            rect: this,
            x: b,
            y: c
        })
    };
    a.Rect.prototype.intersectRect = function(b,
        c) {
        d(arguments.length, 2, "intersectRect", "(PDFNet.Rect, PDFNet.Rect)", [
            [b, "Structure", a.Rect, "Rect"],
            [c, "Structure", a.Rect, "Rect"]
        ]);
        k("intersectRect", this.yieldFunction);
        n("intersectRect", [
            [b, 0],
            [c, 1]
        ]);
        var e = this;
        this.yieldFunction = "Rect.intersectRect";
        return a.sendWithPromise("Rect.intersectRect", {
            rect: this,
            rect1: b,
            rect2: c
        }).then(function(a) {
            e.yieldFunction = void 0;
            q(a.rect, e);
            return a.result
        })
    };
    a.Rect.prototype.normalize = function() {
        k("normalize", this.yieldFunction);
        var b = this;
        this.yieldFunction =
            "Rect.normalize";
        return a.sendWithPromise("Rect.normalize", {
            rect: this
        }).then(function(a) {
            b.yieldFunction = void 0;
            q(a, b)
        })
    };
    a.Rect.prototype.inflate1 = function(b) {
        d(arguments.length, 1, "inflate1", "(number)", [
            [b, "number"]
        ]);
        k("inflate1", this.yieldFunction);
        var c = this;
        this.yieldFunction = "Rect.inflate1";
        return a.sendWithPromise("Rect.inflate1", {
            rect: this,
            amount: b
        }).then(function(a) {
            c.yieldFunction = void 0;
            q(a, c)
        })
    };
    a.Rect.prototype.inflate2 = function(b, c) {
        d(arguments.length, 2, "inflate2", "(number, number)",
            [
                [b, "number"],
                [c, "number"]
            ]);
        k("inflate2", this.yieldFunction);
        var e = this;
        this.yieldFunction = "Rect.inflate2";
        return a.sendWithPromise("Rect.inflate2", {
            rect: this,
            x: b,
            y: c
        }).then(function(a) {
            e.yieldFunction = void 0;
            q(a, e)
        })
    };
    a.Redactor.redactionCreate = function(b, c, e, g) {
        d(arguments.length, 4, "redactionCreate", "(number, PDFNet.Rect, boolean, string)", [
            [b, "number"],
            [c, "Structure", a.Rect, "Rect"],
            [e, "boolean"],
            [g, "string"]
        ]);
        n("redactionCreate", [
            [c, 1]
        ]);
        return a.sendWithPromise("Redactor.redactionCreate", {
            page_num: b,
            bbox: c,
            negative: e,
            text: g
        }).then(function(b) {
            return f(a.Redaction, b)
        })
    };
    a.Redactor.redactionDestroy = function(b) {
        d(arguments.length, 1, "redactionDestroy", "(PDFNet.Redaction)", [
            [b, "Object", a.Redaction, "Redaction"]
        ]);
        return a.sendWithPromise("Redactor.redactionDestroy", {
            redaction: b.id
        })
    };
    a.Redactor.redactionCopy = function(b) {
        d(arguments.length, 1, "redactionCopy", "(PDFNet.Redaction)", [
            [b, "Object", a.Redaction, "Redaction"]
        ]);
        return a.sendWithPromise("Redactor.redactionCopy", {
            other: b.id
        }).then(function(b) {
            return f(a.Redaction,
                b)
        })
    };
    a.Shading.create = function(b) {
        "undefined" === typeof b && (b = new a.Obj("0"));
        d(arguments.length, 0, "create", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("shadingCreate", {
            shading_dict: b.id
        }).then(function(b) {
            return l(a.Shading, b)
        })
    };
    a.Shading.getTypeFromObj = function(b) {
        d(arguments.length, 1, "getTypeFromObj", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("shadingGetTypeFromObj", {
            shading_dict: b.id
        })
    };
    a.Shading.prototype.getType = function() {
        return a.sendWithPromise("Shading.getType", {
            s: this.id
        })
    };
    a.Shading.prototype.getSDFObj = function() {
        return a.sendWithPromise("Shading.getSDFObj", {
            s: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Shading.prototype.getBaseColorSpace = function() {
        return a.sendWithPromise("Shading.getBaseColorSpace", {
            s: this.id
        }).then(function(b) {
            return l(a.ColorSpace, b)
        })
    };
    a.Shading.prototype.hasBBox = function() {
        return a.sendWithPromise("Shading.hasBBox", {
            s: this.id
        })
    };
    a.Shading.prototype.getBBox = function() {
        return a.sendWithPromise("Shading.getBBox", {
            s: this.id
        }).then(function(b) {
            return new a.Rect(b)
        })
    };
    a.Shading.prototype.hasBackground = function() {
        return a.sendWithPromise("Shading.hasBackground", {
            s: this.id
        })
    };
    a.Shading.prototype.getBackground = function() {
        return a.sendWithPromise("Shading.getBackground", {
            s: this.id
        }).then(function(b) {
            return l(a.ColorPt, b)
        })
    };
    a.Shading.prototype.getAntialias = function() {
        return a.sendWithPromise("Shading.getAntialias", {
            s: this.id
        })
    };
    a.Shading.prototype.getParamStart = function() {
        return a.sendWithPromise("Shading.getParamStart", {
            s: this.id
        })
    };
    a.Shading.prototype.getParamEnd =
        function() {
            return a.sendWithPromise("Shading.getParamEnd", {
                s: this.id
            })
        };
    a.Shading.prototype.isExtendStart = function() {
        return a.sendWithPromise("Shading.isExtendStart", {
            s: this.id
        })
    };
    a.Shading.prototype.isExtendEnd = function() {
        return a.sendWithPromise("Shading.isExtendEnd", {
            s: this.id
        })
    };
    a.Shading.prototype.getColor = function(b) {
        d(arguments.length, 1, "getColor", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("Shading.getColor", {
            s: this.id,
            t: b
        }).then(function(b) {
            return l(a.ColorPt, b)
        })
    };
    a.Shading.prototype.getCoords =
        function() {
            return a.sendWithPromise("Shading.getCoords", {
                s: this.id
            })
        };
    a.Shading.prototype.getCoordsRadial = function() {
        return a.sendWithPromise("Shading.getCoordsRadial", {
            s: this.id
        })
    };
    a.Shading.prototype.getDomain = function() {
        return a.sendWithPromise("Shading.getDomain", {
            s: this.id
        })
    };
    a.Shading.prototype.getMatrix = function() {
        return a.sendWithPromise("Shading.getMatrix", {
            s: this.id
        }).then(function(b) {
            return new a.Matrix2D(b)
        })
    };
    a.Shading.prototype.getColorForFunction = function(b, c) {
        d(arguments.length, 2,
            "getColorForFunction", "(number, number)", [
                [b, "number"],
                [c, "number"]
            ]);
        return a.sendWithPromise("Shading.getColorForFunction", {
            s: this.id,
            t1: b,
            t2: c
        }).then(function(b) {
            return l(a.ColorPt, b)
        })
    };
    a.Stamper.create = function(b, c, e) {
        d(arguments.length, 3, "create", "(number, number, number)", [
            [b, "number"],
            [c, "number"],
            [e, "number"]
        ]);
        return a.sendWithPromise("stamperCreate", {
            size_type: b,
            a: c,
            b: e
        }).then(function(b) {
            return l(a.Stamper, b)
        })
    };
    a.Stamper.prototype.stampImage = function(b, c, e) {
        d(arguments.length, 3, "stampImage",
            "(PDFNet.PDFDoc, PDFNet.Image, PDFNet.PageSet)", [
                [b, "PDFDoc"],
                [c, "Object", a.Image, "Image"],
                [e, "Object", a.PageSet, "PageSet"]
            ]);
        return a.sendWithPromise("Stamper.stampImage", {
            stamp: this.id,
            dest_doc: b.id,
            img: c.id,
            dest_pages: e.id
        })
    };
    a.Stamper.prototype.stampPage = function(b, c, e) {
        d(arguments.length, 3, "stampPage", "(PDFNet.PDFDoc, PDFNet.Page, PDFNet.PageSet)", [
            [b, "PDFDoc"],
            [c, "Object", a.Page, "Page"],
            [e, "Object", a.PageSet, "PageSet"]
        ]);
        return a.sendWithPromise("Stamper.stampPage", {
            stamp: this.id,
            dest_doc: b.id,
            page: c.id,
            dest_pages: e.id
        })
    };
    a.Stamper.prototype.stampText = function(b, c, e) {
        d(arguments.length, 3, "stampText", "(PDFNet.PDFDoc, string, PDFNet.PageSet)", [
            [b, "PDFDoc"],
            [c, "string"],
            [e, "Object", a.PageSet, "PageSet"]
        ]);
        return a.sendWithPromise("Stamper.stampText", {
            stamp: this.id,
            dest_doc: b.id,
            txt: c,
            dest_pages: e.id
        })
    };
    a.Stamper.prototype.setFont = function(b) {
        d(arguments.length, 1, "setFont", "(PDFNet.Font)", [
            [b, "Object", a.Font, "Font"]
        ]);
        return a.sendWithPromise("Stamper.setFont", {
            stamp: this.id,
            font: b.id
        })
    };
    a.Stamper.prototype.setFontColor =
        function(b) {
            d(arguments.length, 1, "setFontColor", "(PDFNet.ColorPt)", [
                [b, "Object", a.ColorPt, "ColorPt"]
            ]);
            return a.sendWithPromise("Stamper.setFontColor", {
                stamp: this.id,
                font_color: b.id
            })
        };
    a.Stamper.prototype.setTextAlignment = function(b) {
        d(arguments.length, 1, "setTextAlignment", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("Stamper.setTextAlignment", {
            stamp: this.id,
            text_alignment: b
        })
    };
    a.Stamper.prototype.setOpacity = function(b) {
        d(arguments.length, 1, "setOpacity", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("Stamper.setOpacity", {
            stamp: this.id,
            opacity: b
        })
    };
    a.Stamper.prototype.setRotation = function(b) {
        d(arguments.length, 1, "setRotation", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("Stamper.setRotation", {
            stamp: this.id,
            rotation: b
        })
    };
    a.Stamper.prototype.setAsBackground = function(b) {
        d(arguments.length, 1, "setAsBackground", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("Stamper.setAsBackground", {
            stamp: this.id,
            background: b
        })
    };
    a.Stamper.prototype.setAsAnnotation = function(b) {
        d(arguments.length, 1, "setAsAnnotation", "(boolean)",
            [
                [b, "boolean"]
            ]);
        return a.sendWithPromise("Stamper.setAsAnnotation", {
            stamp: this.id,
            annotation: b
        })
    };
    a.Stamper.prototype.showsOnScreen = function(b) {
        d(arguments.length, 1, "showsOnScreen", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("Stamper.showsOnScreen", {
            stamp: this.id,
            on_screen: b
        })
    };
    a.Stamper.prototype.showsOnPrint = function(b) {
        d(arguments.length, 1, "showsOnPrint", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("Stamper.showsOnPrint", {
            stamp: this.id,
            on_print: b
        })
    };
    a.Stamper.prototype.setAlignment =
        function(b, c) {
            d(arguments.length, 2, "setAlignment", "(number, number)", [
                [b, "number"],
                [c, "number"]
            ]);
            return a.sendWithPromise("Stamper.setAlignment", {
                stamp: this.id,
                horizontal_alignment: b,
                vertical_alignment: c
            })
        };
    a.Stamper.prototype.setPosition = function(b, c, e) {
        "undefined" === typeof e && (e = !1);
        d(arguments.length, 2, "setPosition", "(number, number, boolean)", [
            [b, "number"],
            [c, "number"],
            [e, "boolean"]
        ]);
        return a.sendWithPromise("Stamper.setPosition", {
            stamp: this.id,
            horizontal_distance: b,
            vertical_distance: c,
            use_percentage: e
        })
    };
    a.Stamper.prototype.setSize = function(b, c, e) {
        d(arguments.length, 3, "setSize", "(number, number, number)", [
            [b, "number"],
            [c, "number"],
            [e, "number"]
        ]);
        return a.sendWithPromise("Stamper.setSize", {
            stamp: this.id,
            size_type: b,
            a: c,
            b: e
        })
    };
    a.Stamper.deleteStamps = function(b, c) {
        d(arguments.length, 2, "deleteStamps", "(PDFNet.PDFDoc, PDFNet.PageSet)", [
            [b, "PDFDoc"],
            [c, "Object", a.PageSet, "PageSet"]
        ]);
        return a.sendWithPromise("stamperDeleteStamps", {
            doc: b.id,
            page_set: c.id
        })
    };
    a.Stamper.hasStamps = function(b, c) {
        d(arguments.length,
            2, "hasStamps", "(PDFNet.PDFDoc, PDFNet.PageSet)", [
                [b, "PDFDoc"],
                [c, "Object", a.PageSet, "PageSet"]
            ]);
        return a.sendWithPromise("stamperHasStamps", {
            doc: b.id,
            page_set: c.id
        })
    };
    a.TextExtractor.create = function() {
        return a.sendWithPromise("textExtractorCreate", {}).then(function(b) {
            return l(a.TextExtractor, b)
        })
    };
    a.TextExtractor.prototype.setOCGContext = function(b) {
        d(arguments.length, 1, "setOCGContext", "(PDFNet.OCGContext)", [
            [b, "Object", a.OCGContext, "OCGContext"]
        ]);
        return a.sendWithPromise("TextExtractor.setOCGContext", {
            te: this.id,
            ctx: b.id
        })
    };
    a.TextExtractor.prototype.begin = function(b, c, e) {
        "undefined" === typeof c && (c = null);
        "undefined" === typeof e && (e = 0);
        d(arguments.length, 1, "begin", "(PDFNet.Page, PDFNet.Rect, number)", [
            [b, "Object", a.Page, "Page"],
            [c, "Structure", a.Rect, "Rect"],
            [e, "number"]
        ]);
        n("begin", [
            [c, 1]
        ]);
        return a.sendWithPromise("TextExtractor.begin", {
            te: this.id,
            page: b.id,
            clip_ptr: c,
            flags: e
        })
    };
    a.TextExtractor.prototype.getWordCount = function() {
        return a.sendWithPromise("TextExtractor.getWordCount", {
            te: this.id
        })
    };
    a.TextExtractor.prototype.setRightToLeftLanguage = function(b) {
        d(arguments.length, 1, "setRightToLeftLanguage", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("TextExtractor.setRightToLeftLanguage", {
            te: this.id,
            rtl: b
        })
    };
    a.TextExtractor.prototype.getRightToLeftLanguage = function() {
        return a.sendWithPromise("TextExtractor.getRightToLeftLanguage", {
            te: this.id
        })
    };
    a.TextExtractor.prototype.getAsText = function(b) {
        "undefined" === typeof b && (b = !0);
        d(arguments.length, 0, "getAsText", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("TextExtractor.getAsText", {
            te: this.id,
            dehyphen: b
        })
    };
    a.TextExtractor.prototype.getTextUnderAnnot = function(b) {
        d(arguments.length, 1, "getTextUnderAnnot", "(PDFNet.Annot)", [
            [b, "Object", a.Annot, "Annot"]
        ]);
        return a.sendWithPromise("TextExtractor.getTextUnderAnnot", {
            te: this.id,
            annot: b.id
        })
    };
    a.TextExtractor.prototype.getAsXML = function(b) {
        "undefined" === typeof b && (b = 0);
        d(arguments.length, 0, "getAsXML", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("TextExtractor.getAsXML", {
            te: this.id,
            xml_output_flags: b
        })
    };
    a.TextExtractorStyle.prototype.getFont = function() {
        k("getFont", this.yieldFunction);
        var b = this;
        this.yieldFunction = "TextExtractorStyle.getFont";
        return a.sendWithPromise("TextExtractorStyle.getFont", {
            tes: this
        }).then(function(c) {
            b.yieldFunction = void 0;
            c.result = f(a.Obj, c.result);
            q(c.tes, b);
            return c.result
        })
    };
    a.TextExtractorStyle.prototype.getFontName = function() {
        k("getFontName", this.yieldFunction);
        var b = this;
        this.yieldFunction = "TextExtractorStyle.getFontName";
        return a.sendWithPromise("TextExtractorStyle.getFontName", {
            tes: this
        }).then(function(a) {
            b.yieldFunction = void 0;
            q(a.tes, b);
            return a.result
        })
    };
    a.TextExtractorStyle.prototype.getFontSize = function() {
        k("getFontSize", this.yieldFunction);
        var b = this;
        this.yieldFunction = "TextExtractorStyle.getFontSize";
        return a.sendWithPromise("TextExtractorStyle.getFontSize", {
            tes: this
        }).then(function(a) {
            b.yieldFunction = void 0;
            q(a.tes, b);
            return a.result
        })
    };
    a.TextExtractorStyle.prototype.getWeight = function() {
        k("getWeight", this.yieldFunction);
        var b = this;
        this.yieldFunction = "TextExtractorStyle.getWeight";
        return a.sendWithPromise("TextExtractorStyle.getWeight", {
            tes: this
        }).then(function(a) {
            b.yieldFunction = void 0;
            q(a.tes, b);
            return a.result
        })
    };
    a.TextExtractorStyle.prototype.isItalic = function() {
        k("isItalic", this.yieldFunction);
        var b = this;
        this.yieldFunction = "TextExtractorStyle.isItalic";
        return a.sendWithPromise("TextExtractorStyle.isItalic", {
            tes: this
        }).then(function(a) {
            b.yieldFunction = void 0;
            q(a.tes, b);
            return a.result
        })
    };
    a.TextExtractorStyle.prototype.isSerif = function() {
        k("isSerif", this.yieldFunction);
        var b = this;
        this.yieldFunction = "TextExtractorStyle.isSerif";
        return a.sendWithPromise("TextExtractorStyle.isSerif", {
            tes: this
        }).then(function(a) {
            b.yieldFunction = void 0;
            q(a.tes, b);
            return a.result
        })
    };
    a.TextExtractorStyle.prototype.compare = function(b) {
        d(arguments.length, 1, "compare", "(PDFNet.TextExtractorStyle)", [
            [b, "Structure", a.TextExtractorStyle, "TextExtractorStyle"]
        ]);
        k("compare", this.yieldFunction);
        n("compare", [
            [b, 0]
        ]);
        return a.sendWithPromise("TextExtractorStyle.compare", {
            tes: this,
            s: b
        })
    };
    a.TextExtractorStyle.create =
        function() {
            return a.sendWithPromise("textExtractorStyleCreate", {}).then(function(b) {
                return new a.TextExtractorStyle(b)
            })
        };
    a.TextExtractorStyle.prototype.copy = function() {
        k("copy", this.yieldFunction);
        var b = this;
        this.yieldFunction = "TextExtractorStyle.copy";
        return a.sendWithPromise("TextExtractorStyle.copy", {
            s: this
        }).then(function(c) {
            b.yieldFunction = void 0;
            c.result = new a.TextExtractorStyle(c.result);
            q(c.s, b);
            return c.result
        })
    };
    a.TextExtractorWord.prototype.getNumGlyphs = function() {
        k("getNumGlyphs", this.yieldFunction);
        var b = this;
        this.yieldFunction = "TextExtractorWord.getNumGlyphs";
        return a.sendWithPromise("TextExtractorWord.getNumGlyphs", {
            tew: this
        }).then(function(a) {
            b.yieldFunction = void 0;
            q(a.tew, b);
            return a.result
        })
    };
    a.TextExtractorWord.prototype.getCharStyle = function(b) {
        d(arguments.length, 1, "getCharStyle", "(number)", [
            [b, "number"]
        ]);
        k("getCharStyle", this.yieldFunction);
        var c = this;
        this.yieldFunction = "TextExtractorWord.getCharStyle";
        return a.sendWithPromise("TextExtractorWord.getCharStyle", {
            tew: this,
            char_idx: b
        }).then(function(b) {
            c.yieldFunction =
                void 0;
            b.result = new a.TextExtractorStyle(b.result);
            q(b.tew, c);
            return b.result
        })
    };
    a.TextExtractorWord.prototype.getStyle = function() {
        k("getStyle", this.yieldFunction);
        var b = this;
        this.yieldFunction = "TextExtractorWord.getStyle";
        return a.sendWithPromise("TextExtractorWord.getStyle", {
            tew: this
        }).then(function(c) {
            b.yieldFunction = void 0;
            c.result = new a.TextExtractorStyle(c.result);
            q(c.tew, b);
            return c.result
        })
    };
    a.TextExtractorWord.prototype.getStringLen = function() {
        k("getStringLen", this.yieldFunction);
        var b = this;
        this.yieldFunction = "TextExtractorWord.getStringLen";
        return a.sendWithPromise("TextExtractorWord.getStringLen", {
            tew: this
        }).then(function(a) {
            b.yieldFunction = void 0;
            q(a.tew, b);
            return a.result
        })
    };
    a.TextExtractorWord.prototype.getNextWord = function() {
        k("getNextWord", this.yieldFunction);
        var b = this;
        this.yieldFunction = "TextExtractorWord.getNextWord";
        return a.sendWithPromise("TextExtractorWord.getNextWord", {
            tew: this
        }).then(function(c) {
            b.yieldFunction = void 0;
            c.result = new a.TextExtractorWord(c.result);
            q(c.tew,
                b);
            return c.result
        })
    };
    a.TextExtractorWord.prototype.getCurrentNum = function() {
        k("getCurrentNum", this.yieldFunction);
        var b = this;
        this.yieldFunction = "TextExtractorWord.getCurrentNum";
        return a.sendWithPromise("TextExtractorWord.getCurrentNum", {
            tew: this
        }).then(function(a) {
            b.yieldFunction = void 0;
            q(a.tew, b);
            return a.result
        })
    };
    a.TextExtractorWord.prototype.compare = function(b) {
        d(arguments.length, 1, "compare", "(PDFNet.TextExtractorWord)", [
            [b, "Structure", a.TextExtractorWord, "TextExtractorWord"]
        ]);
        k("compare",
            this.yieldFunction);
        n("compare", [
            [b, 0]
        ]);
        return a.sendWithPromise("TextExtractorWord.compare", {
            tew: this,
            word: b
        })
    };
    a.TextExtractorWord.create = function() {
        return a.sendWithPromise("textExtractorWordCreate", {}).then(function(b) {
            return new a.TextExtractorWord(b)
        })
    };
    a.TextExtractorWord.prototype.isValid = function() {
        k("isValid", this.yieldFunction);
        var b = this;
        this.yieldFunction = "TextExtractorWord.isValid";
        return a.sendWithPromise("TextExtractorWord.isValid", {
            tew: this
        }).then(function(a) {
            b.yieldFunction = void 0;
            q(a.tew, b);
            return a.result
        })
    };
    a.TextExtractorLine.prototype.getNumWords = function() {
        k("getNumWords", this.yieldFunction);
        var b = this;
        this.yieldFunction = "TextExtractorLine.getNumWords";
        return a.sendWithPromise("TextExtractorLine.getNumWords", {
            line: this
        }).then(function(a) {
            b.yieldFunction = void 0;
            q(a.line, b);
            return a.result
        })
    };
    a.TextExtractorLine.prototype.isSimpleLine = function() {
        k("isSimpleLine", this.yieldFunction);
        var b = this;
        this.yieldFunction = "TextExtractorLine.isSimpleLine";
        return a.sendWithPromise("TextExtractorLine.isSimpleLine", {
            line: this
        }).then(function(a) {
            b.yieldFunction = void 0;
            q(a.line, b);
            return a.result
        })
    };
    a.TextExtractorLine.prototype.getFirstWord = function() {
        k("getFirstWord", this.yieldFunction);
        var b = this;
        this.yieldFunction = "TextExtractorLine.getFirstWord";
        return a.sendWithPromise("TextExtractorLine.getFirstWord", {
            line: this
        }).then(function(c) {
            b.yieldFunction = void 0;
            c.result = new a.TextExtractorWord(c.result);
            q(c.line, b);
            return c.result
        })
    };
    a.TextExtractorLine.prototype.getWord = function(b) {
        d(arguments.length, 1, "getWord",
            "(number)", [
                [b, "number"]
            ]);
        k("getWord", this.yieldFunction);
        var c = this;
        this.yieldFunction = "TextExtractorLine.getWord";
        return a.sendWithPromise("TextExtractorLine.getWord", {
            line: this,
            word_idx: b
        }).then(function(b) {
            c.yieldFunction = void 0;
            b.result = new a.TextExtractorWord(b.result);
            q(b.line, c);
            return b.result
        })
    };
    a.TextExtractorLine.prototype.getNextLine = function() {
        k("getNextLine", this.yieldFunction);
        var b = this;
        this.yieldFunction = "TextExtractorLine.getNextLine";
        return a.sendWithPromise("TextExtractorLine.getNextLine", {
            line: this
        }).then(function(c) {
            b.yieldFunction = void 0;
            c.result = new a.TextExtractorLine(c.result);
            q(c.line, b);
            return c.result
        })
    };
    a.TextExtractorLine.prototype.getCurrentNum = function() {
        k("getCurrentNum", this.yieldFunction);
        var b = this;
        this.yieldFunction = "TextExtractorLine.getCurrentNum";
        return a.sendWithPromise("TextExtractorLine.getCurrentNum", {
            line: this
        }).then(function(a) {
            b.yieldFunction = void 0;
            q(a.line, b);
            return a.result
        })
    };
    a.TextExtractorLine.prototype.getStyle = function() {
        k("getStyle", this.yieldFunction);
        var b = this;
        this.yieldFunction = "TextExtractorLine.getStyle";
        return a.sendWithPromise("TextExtractorLine.getStyle", {
            line: this
        }).then(function(c) {
            b.yieldFunction = void 0;
            c.result = new a.TextExtractorStyle(c.result);
            q(c.line, b);
            return c.result
        })
    };
    a.TextExtractorLine.prototype.getParagraphID = function() {
        k("getParagraphID", this.yieldFunction);
        var b = this;
        this.yieldFunction = "TextExtractorLine.getParagraphID";
        return a.sendWithPromise("TextExtractorLine.getParagraphID", {
            line: this
        }).then(function(a) {
            b.yieldFunction =
                void 0;
            q(a.line, b);
            return a.result
        })
    };
    a.TextExtractorLine.prototype.getFlowID = function() {
        k("getFlowID", this.yieldFunction);
        var b = this;
        this.yieldFunction = "TextExtractorLine.getFlowID";
        return a.sendWithPromise("TextExtractorLine.getFlowID", {
            line: this
        }).then(function(a) {
            b.yieldFunction = void 0;
            q(a.line, b);
            return a.result
        })
    };
    a.TextExtractorLine.prototype.endsWithHyphen = function() {
        k("endsWithHyphen", this.yieldFunction);
        var b = this;
        this.yieldFunction = "TextExtractorLine.endsWithHyphen";
        return a.sendWithPromise("TextExtractorLine.endsWithHyphen", {
            line: this
        }).then(function(a) {
            b.yieldFunction = void 0;
            q(a.line, b);
            return a.result
        })
    };
    a.TextExtractorLine.prototype.compare = function(b) {
        d(arguments.length, 1, "compare", "(PDFNet.TextExtractorLine)", [
            [b, "Structure", a.TextExtractorLine, "TextExtractorLine"]
        ]);
        k("compare", this.yieldFunction);
        n("compare", [
            [b, 0]
        ]);
        return a.sendWithPromise("TextExtractorLine.compare", {
            line: this,
            line2: b
        })
    };
    a.TextExtractorLine.create = function() {
        return a.sendWithPromise("textExtractorLineCreate", {}).then(function(b) {
            return new a.TextExtractorLine(b)
        })
    };
    a.TextExtractorLine.prototype.isValid = function() {
        k("isValid", this.yieldFunction);
        var b = this;
        this.yieldFunction = "TextExtractorLine.isValid";
        return a.sendWithPromise("TextExtractorLine.isValid", {
            line: this
        }).then(function(a) {
            b.yieldFunction = void 0;
            q(a.line, b);
            return a.result
        })
    };
    a.TextExtractor.prototype.getNumLines = function() {
        return a.sendWithPromise("TextExtractor.getNumLines", {
            te: this.id
        })
    };
    a.TextExtractor.prototype.getFirstLine = function() {
        return a.sendWithPromise("TextExtractor.getFirstLine", {
            te: this.id
        }).then(function(b) {
            return new a.TextExtractorLine(b)
        })
    };
    a.TextExtractor.prototype.getQuads = function(b, c, e) {
        d(arguments.length, 3, "getQuads", "(PDFNet.Matrix2D, number, number)", [
            [b, "Structure", a.Matrix2D, "Matrix2D"],
            [c, "number"],
            [e, "number"]
        ]);
        n("getQuads", [
            [b, 0]
        ]);
        return a.sendWithPromise("TextExtractor.getQuads", {
            te: this.id,
            mtx: b,
            quads: c,
            quads_size: e
        })
    };
    a.TextSearch.create = function() {
        return a.sendWithPromise("textSearchCreate", {}).then(function(b) {
            return l(a.TextSearch, b)
        })
    };
    a.TextSearch.prototype.begin = function(b, c, e, f, g) {
        "undefined" === typeof f && (f = -1);
        "undefined" === typeof g && (g = -1);
        d(arguments.length, 3, "begin", "(PDFNet.PDFDoc, string, number, number, number)", [
            [b, "PDFDoc"],
            [c, "string"],
            [e, "number"],
            [f, "number"],
            [g, "number"]
        ]);
        return a.sendWithPromise("TextSearch.begin", {
            ts: this.id,
            doc: b.id,
            pattern: c,
            mode: e,
            start_page: f,
            end_page: g
        })
    };
    a.TextSearch.prototype.setPattern = function(b) {
        d(arguments.length, 1, "setPattern", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("TextSearch.setPattern", {
            ts: this.id,
            pattern: b
        })
    };
    a.TextSearch.prototype.getMode = function() {
        return a.sendWithPromise("TextSearch.getMode", {
            ts: this.id
        })
    };
    a.TextSearch.prototype.setMode = function(b) {
        d(arguments.length, 1, "setMode", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("TextSearch.setMode", {
            ts: this.id,
            mode: b
        })
    };
    a.TextSearch.prototype.setRightToLeftLanguage = function(b) {
        d(arguments.length, 1, "setRightToLeftLanguage", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("TextSearch.setRightToLeftLanguage", {
            ts: this.id,
            flag: b
        })
    };
    a.TextSearch.prototype.getCurrentPage = function() {
        return a.sendWithPromise("TextSearch.getCurrentPage", {
            ts: this.id
        })
    };
    a.TextSearch.prototype.setOCGContext = function(b) {
        d(arguments.length, 1, "setOCGContext", "(PDFNet.OCGContext)", [
            [b, "Object", a.OCGContext, "OCGContext"]
        ]);
        return a.sendWithPromise("TextSearch.setOCGContext", {
            te: this.id,
            ctx: b.id
        })
    };
    a.NameTree.create = function(b, c) {
        d(arguments.length, 2, "create", "(PDFNet.SDFDoc, string)", [
            [b, "SDFDoc"],
            [c, "string"]
        ]);
        return a.sendWithPromise("nameTreeCreate", {
            doc: b.id,
            name: c
        }).then(function(b) {
            return f(a.NameTree, b)
        })
    };
    a.NameTree.find = function(b, c) {
        d(arguments.length,
            2, "find", "(PDFNet.SDFDoc, string)", [
                [b, "SDFDoc"],
                [c, "string"]
            ]);
        return a.sendWithPromise("nameTreeFind", {
            doc: b.id,
            name: c
        }).then(function(b) {
            return f(a.NameTree, b)
        })
    };
    a.NameTree.createFromObj = function(b) {
        d(arguments.length, 1, "createFromObj", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("nameTreeCreateFromObj", {
            name_tree: b.id
        }).then(function(b) {
            return f(a.NameTree, b)
        })
    };
    a.NameTree.prototype.copy = function() {
        return a.sendWithPromise("NameTree.copy", {
            d: this.id
        }).then(function(b) {
            return f(a.NameTree,
                b)
        })
    };
    a.NameTree.prototype.isValid = function() {
        return a.sendWithPromise("NameTree.isValid", {
            tree: this.id
        })
    };
    a.NameTree.prototype.getIterator = function(b) {
        d(arguments.length, 1, "getIterator", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("NameTree.getIterator", {
            tree: this.id,
            key: b
        }).then(function(b) {
            return l(a.DictIterator, b)
        })
    };
    a.NameTree.prototype.getValue = function(b) {
        d(arguments.length, 1, "getValue", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("NameTree.getValue", {
            tree: this.id,
            key: b
        }).then(function(b) {
            return f(a.Obj,
                b)
        })
    };
    a.NameTree.prototype.getIteratorBegin = function() {
        return a.sendWithPromise("NameTree.getIteratorBegin", {
            tree: this.id
        }).then(function(b) {
            return l(a.DictIterator, b)
        })
    };
    a.NameTree.prototype.put = function(b, c) {
        d(arguments.length, 2, "put", "(string, PDFNet.Obj)", [
            [b, "string"],
            [c, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("NameTree.put", {
            tree: this.id,
            key: b,
            value: c.id
        })
    };
    a.NameTree.prototype.eraseKey = function(b) {
        d(arguments.length, 1, "eraseKey", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("NameTree.eraseKey", {
            tree: this.id,
            key: b
        })
    };
    a.NameTree.prototype.erase = function(b) {
        d(arguments.length, 1, "erase", "(PDFNet.DictIterator)", [
            [b, "Object", a.DictIterator, "DictIterator"]
        ]);
        return a.sendWithPromise("NameTree.erase", {
            tree: this.id,
            pos: b.id
        })
    };
    a.NameTree.prototype.getSDFObj = function() {
        return a.sendWithPromise("NameTree.getSDFObj", {
            tree: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.NumberTree.create = function(b) {
        d(arguments.length, 1, "create", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("numberTreeCreate", {
            number_tree: b.id
        }).then(function(b) {
            return f(a.NumberTree, b)
        })
    };
    a.NumberTree.prototype.copy = function() {
        return a.sendWithPromise("NumberTree.copy", {
            tree: this.id
        }).then(function(b) {
            return f(a.NumberTree, b)
        })
    };
    a.NumberTree.prototype.isValid = function() {
        return a.sendWithPromise("NumberTree.isValid", {
            tree: this.id
        })
    };
    a.NumberTree.prototype.getIterator = function(b) {
        d(arguments.length, 1, "getIterator", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("NumberTree.getIterator", {
            tree: this.id,
            key: b
        }).then(function(b) {
            return l(a.DictIterator,
                b)
        })
    };
    a.NumberTree.prototype.getValue = function(b) {
        d(arguments.length, 1, "getValue", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("NumberTree.getValue", {
            tree: this.id,
            key: b
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.NumberTree.prototype.getIteratorBegin = function() {
        return a.sendWithPromise("NumberTree.getIteratorBegin", {
            tree: this.id
        }).then(function(b) {
            return l(a.DictIterator, b)
        })
    };
    a.NumberTree.prototype.put = function(b, c) {
        d(arguments.length, 2, "put", "(number, PDFNet.Obj)", [
            [b, "number"],
            [c, "Object",
                a.Obj, "Obj"
            ]
        ]);
        return a.sendWithPromise("NumberTree.put", {
            tree: this.id,
            key: b,
            value: c.id
        })
    };
    a.NumberTree.prototype.eraseKey = function(b) {
        d(arguments.length, 1, "eraseKey", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("NumberTree.eraseKey", {
            tree: this.id,
            key: b
        })
    };
    a.NumberTree.prototype.erase = function(b) {
        d(arguments.length, 1, "erase", "(PDFNet.DictIterator)", [
            [b, "Object", a.DictIterator, "DictIterator"]
        ]);
        return a.sendWithPromise("NumberTree.erase", {
            tree: this.id,
            pos: b.id
        })
    };
    a.NumberTree.prototype.getSDFObj =
        function() {
            return a.sendWithPromise("NumberTree.getSDFObj", {
                tree: this.id
            }).then(function(b) {
                return f(a.Obj, b)
            })
        };
    a.Obj.prototype.getType = function() {
        return a.sendWithPromise("Obj.getType", {
            o: this.id
        })
    };
    a.Obj.prototype.getDoc = function() {
        return a.sendWithPromise("Obj.getDoc", {
            o: this.id
        }).then(function(b) {
            return f(a.SDFDoc, b)
        })
    };
    a.Obj.prototype.write = function(b) {
        d(arguments.length, 1, "write", "(PDFNet.FilterWriter)", [
            [b, "Object", a.FilterWriter, "FilterWriter"]
        ]);
        return a.sendWithPromise("Obj.write", {
            o: this.id,
            stream: b.id
        })
    };
    a.Obj.prototype.isEqual = function(b) {
        d(arguments.length, 1, "isEqual", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("Obj.isEqual", {
            o: this.id,
            to: b.id
        })
    };
    a.Obj.prototype.isBool = function() {
        return a.sendWithPromise("Obj.isBool", {
            o: this.id
        })
    };
    a.Obj.prototype.getBool = function() {
        return a.sendWithPromise("Obj.getBool", {
            o: this.id
        })
    };
    a.Obj.prototype.setBool = function(b) {
        d(arguments.length, 1, "setBool", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("Obj.setBool", {
            o: this.id,
            b: b
        })
    };
    a.Obj.prototype.isNumber = function() {
        return a.sendWithPromise("Obj.isNumber", {
            o: this.id
        })
    };
    a.Obj.prototype.getNumber = function() {
        return a.sendWithPromise("Obj.getNumber", {
            o: this.id
        })
    };
    a.Obj.prototype.setNumber = function(b) {
        d(arguments.length, 1, "setNumber", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("Obj.setNumber", {
            o: this.id,
            n: b
        })
    };
    a.Obj.prototype.isNull = function() {
        return a.sendWithPromise("Obj.isNull", {
            o: this.id
        })
    };
    a.Obj.prototype.isString = function() {
        return a.sendWithPromise("Obj.isString", {
            o: this.id
        })
    };
    a.Obj.prototype.getBuffer = function() {
        return a.sendWithPromise("Obj.getBuffer", {
            o: this.id
        })
    };
    a.Obj.prototype.setString = function(b) {
        d(arguments.length, 1, "setString", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("Obj.setString", {
            o: this.id,
            value: b
        })
    };
    a.Obj.prototype.setUString = function(b) {
        d(arguments.length, 1, "setUString", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("Obj.setUString", {
            o: this.id,
            value: b
        })
    };
    a.Obj.prototype.isName = function() {
        return a.sendWithPromise("Obj.isName", {
            o: this.id
        })
    };
    a.Obj.prototype.getName = function() {
        return a.sendWithPromise("Obj.getName", {
            o: this.id
        })
    };
    a.Obj.prototype.setName = function(b) {
        d(arguments.length, 1, "setName", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("Obj.setName", {
            o: this.id,
            name: b
        })
    };
    a.Obj.prototype.isIndirect = function() {
        return a.sendWithPromise("Obj.isIndirect", {
            o: this.id
        })
    };
    a.Obj.prototype.getObjNum = function() {
        return a.sendWithPromise("Obj.getObjNum", {
            o: this.id
        })
    };
    a.Obj.prototype.getGenNum = function() {
        return a.sendWithPromise("Obj.getGenNum", {
            o: this.id
        })
    };
    a.Obj.prototype.getOffset = function() {
        return a.sendWithPromise("Obj.getOffset", {
            o: this.id
        })
    };
    a.Obj.prototype.isFree = function() {
        return a.sendWithPromise("Obj.isFree", {
            o: this.id
        })
    };
    a.Obj.prototype.setMark = function(b) {
        d(arguments.length, 1, "setMark", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("Obj.setMark", {
            o: this.id,
            mark: b
        })
    };
    a.Obj.prototype.isMarked = function() {
        return a.sendWithPromise("Obj.isMarked", {
            o: this.id
        })
    };
    a.Obj.prototype.isLoaded = function() {
        return a.sendWithPromise("Obj.isLoaded", {
            o: this.id
        })
    };
    a.Obj.prototype.isContainer = function() {
        return a.sendWithPromise("Obj.isContainer", {
            o: this.id
        })
    };
    a.Obj.prototype.size = function() {
        return a.sendWithPromise("Obj.size", {
            o: this.id
        })
    };
    a.Obj.prototype.getDictIterator = function() {
        return a.sendWithPromise("Obj.getDictIterator", {
            o: this.id
        }).then(function(b) {
            return l(a.DictIterator, b)
        })
    };
    a.Obj.prototype.isDict = function() {
        return a.sendWithPromise("Obj.isDict", {
            o: this.id
        })
    };
    a.Obj.prototype.find = function(b) {
        d(arguments.length, 1, "find", "(string)", [
            [b,
                "string"
            ]
        ]);
        return a.sendWithPromise("Obj.find", {
            o: this.id,
            key: b
        }).then(function(b) {
            return l(a.DictIterator, b)
        })
    };
    a.Obj.prototype.findObj = function(b) {
        d(arguments.length, 1, "findObj", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("Obj.findObj", {
            o: this.id,
            key: b
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Obj.prototype.get = function(b) {
        d(arguments.length, 1, "get", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("Obj.get", {
            o: this.id,
            key: b
        }).then(function(b) {
            return l(a.DictIterator, b)
        })
    };
    a.Obj.prototype.putName =
        function(b, c) {
            d(arguments.length, 2, "putName", "(string, string)", [
                [b, "string"],
                [c, "string"]
            ]);
            return a.sendWithPromise("Obj.putName", {
                o: this.id,
                key: b,
                name: c
            }).then(function(b) {
                return f(a.Obj, b)
            })
        };
    a.Obj.prototype.putArray = function(b) {
        d(arguments.length, 1, "putArray", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("Obj.putArray", {
            o: this.id,
            key: b
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Obj.prototype.putBool = function(b, c) {
        d(arguments.length, 2, "putBool", "(string, boolean)", [
            [b, "string"],
            [c, "boolean"]
        ]);
        return a.sendWithPromise("Obj.putBool", {
            o: this.id,
            key: b,
            value: c
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Obj.prototype.putDict = function(b) {
        d(arguments.length, 1, "putDict", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("Obj.putDict", {
            o: this.id,
            key: b
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Obj.prototype.putNumber = function(b, c) {
        d(arguments.length, 2, "putNumber", "(string, number)", [
            [b, "string"],
            [c, "number"]
        ]);
        return a.sendWithPromise("Obj.putNumber", {
            o: this.id,
            key: b,
            value: c
        }).then(function(b) {
            return f(a.Obj,
                b)
        })
    };
    a.Obj.prototype.putString = function(b, c) {
        d(arguments.length, 2, "putString", "(string, string)", [
            [b, "string"],
            [c, "string"]
        ]);
        return a.sendWithPromise("Obj.putString", {
            o: this.id,
            key: b,
            value: c
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Obj.prototype.putText = function(b, c) {
        d(arguments.length, 2, "putText", "(string, string)", [
            [b, "string"],
            [c, "string"]
        ]);
        return a.sendWithPromise("Obj.putText", {
            o: this.id,
            key: b,
            t: c
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Obj.prototype.putNull = function(b) {
        d(arguments.length,
            1, "putNull", "(string)", [
                [b, "string"]
            ]);
        return a.sendWithPromise("Obj.putNull", {
            o: this.id,
            key: b
        })
    };
    a.Obj.prototype.put = function(b, c) {
        d(arguments.length, 2, "put", "(string, PDFNet.Obj)", [
            [b, "string"],
            [c, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("Obj.put", {
            o: this.id,
            key: b,
            input_obj: c.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Obj.prototype.putRect = function(b, c, e, g, h) {
        d(arguments.length, 5, "putRect", "(string, number, number, number, number)", [
            [b, "string"],
            [c, "number"],
            [e, "number"],
            [g, "number"],
            [h, "number"]
        ]);
        return a.sendWithPromise("Obj.putRect", {
            o: this.id,
            key: b,
            x1: c,
            y1: e,
            x2: g,
            y2: h
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Obj.prototype.putMatrix = function(b, c) {
        d(arguments.length, 2, "putMatrix", "(string, PDFNet.Matrix2D)", [
            [b, "string"],
            [c, "Structure", a.Matrix2D, "Matrix2D"]
        ]);
        n("putMatrix", [
            [c, 1]
        ]);
        return a.sendWithPromise("Obj.putMatrix", {
            o: this.id,
            key: b,
            mtx: c
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Obj.prototype.eraseFromKey = function(b) {
        d(arguments.length, 1, "eraseFromKey", "(string)",
            [
                [b, "string"]
            ]);
        return a.sendWithPromise("Obj.eraseFromKey", {
            o: this.id,
            key: b
        })
    };
    a.Obj.prototype.erase = function(b) {
        d(arguments.length, 1, "erase", "(PDFNet.DictIterator)", [
            [b, "Object", a.DictIterator, "DictIterator"]
        ]);
        return a.sendWithPromise("Obj.erase", {
            o: this.id,
            pos: b.id
        })
    };
    a.Obj.prototype.rename = function(b, c) {
        d(arguments.length, 2, "rename", "(string, string)", [
            [b, "string"],
            [c, "string"]
        ]);
        return a.sendWithPromise("Obj.rename", {
            o: this.id,
            old_key: b,
            new_key: c
        })
    };
    a.Obj.prototype.isArray = function() {
        return a.sendWithPromise("Obj.isArray", {
            o: this.id
        })
    };
    a.Obj.prototype.getAt = function(b) {
        d(arguments.length, 1, "getAt", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("Obj.getAt", {
            o: this.id,
            index: b
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Obj.prototype.insertName = function(b, c) {
        d(arguments.length, 2, "insertName", "(number, string)", [
            [b, "number"],
            [c, "string"]
        ]);
        return a.sendWithPromise("Obj.insertName", {
            o: this.id,
            pos: b,
            name: c
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Obj.prototype.insertArray = function(b) {
        d(arguments.length, 1, "insertArray",
            "(number)", [
                [b, "number"]
            ]);
        return a.sendWithPromise("Obj.insertArray", {
            o: this.id,
            pos: b
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Obj.prototype.insertBool = function(b, c) {
        d(arguments.length, 2, "insertBool", "(number, boolean)", [
            [b, "number"],
            [c, "boolean"]
        ]);
        return a.sendWithPromise("Obj.insertBool", {
            o: this.id,
            pos: b,
            value: c
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Obj.prototype.insertDict = function(b) {
        d(arguments.length, 1, "insertDict", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("Obj.insertDict", {
            o: this.id,
            pos: b
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Obj.prototype.insertNumber = function(b, c) {
        d(arguments.length, 2, "insertNumber", "(number, number)", [
            [b, "number"],
            [c, "number"]
        ]);
        return a.sendWithPromise("Obj.insertNumber", {
            o: this.id,
            pos: b,
            value: c
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Obj.prototype.insertString = function(b, c) {
        d(arguments.length, 2, "insertString", "(number, string)", [
            [b, "number"],
            [c, "string"]
        ]);
        return a.sendWithPromise("Obj.insertString", {
            o: this.id,
            pos: b,
            value: c
        }).then(function(b) {
            return f(a.Obj,
                b)
        })
    };
    a.Obj.prototype.insertText = function(b, c) {
        d(arguments.length, 2, "insertText", "(number, string)", [
            [b, "number"],
            [c, "string"]
        ]);
        return a.sendWithPromise("Obj.insertText", {
            o: this.id,
            pos: b,
            t: c
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Obj.prototype.insertNull = function(b) {
        d(arguments.length, 1, "insertNull", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("Obj.insertNull", {
            o: this.id,
            pos: b
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Obj.prototype.insert = function(b, c) {
        d(arguments.length, 2, "insert", "(number, PDFNet.Obj)",
            [
                [b, "number"],
                [c, "Object", a.Obj, "Obj"]
            ]);
        return a.sendWithPromise("Obj.insert", {
            o: this.id,
            pos: b,
            input_obj: c.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Obj.prototype.insertRect = function(b, c, e, g, h) {
        d(arguments.length, 5, "insertRect", "(number, number, number, number, number)", [
            [b, "number"],
            [c, "number"],
            [e, "number"],
            [g, "number"],
            [h, "number"]
        ]);
        return a.sendWithPromise("Obj.insertRect", {
            o: this.id,
            pos: b,
            x1: c,
            y1: e,
            x2: g,
            y2: h
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Obj.prototype.insertMatrix = function(b,
        c) {
        d(arguments.length, 2, "insertMatrix", "(number, PDFNet.Matrix2D)", [
            [b, "number"],
            [c, "Structure", a.Matrix2D, "Matrix2D"]
        ]);
        n("insertMatrix", [
            [c, 1]
        ]);
        return a.sendWithPromise("Obj.insertMatrix", {
            o: this.id,
            pos: b,
            mtx: c
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Obj.prototype.pushBackName = function(b) {
        d(arguments.length, 1, "pushBackName", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("Obj.pushBackName", {
            o: this.id,
            name: b
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Obj.prototype.pushBackArray = function() {
        return a.sendWithPromise("Obj.pushBackArray", {
            o: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Obj.prototype.pushBackBool = function(b) {
        d(arguments.length, 1, "pushBackBool", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("Obj.pushBackBool", {
            o: this.id,
            value: b
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Obj.prototype.pushBackDict = function() {
        return a.sendWithPromise("Obj.pushBackDict", {
            o: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Obj.prototype.pushBackNumber = function(b) {
        d(arguments.length, 1, "pushBackNumber", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("Obj.pushBackNumber", {
            o: this.id,
            value: b
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Obj.prototype.pushBackString = function(b) {
        d(arguments.length, 1, "pushBackString", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("Obj.pushBackString", {
            o: this.id,
            value: b
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Obj.prototype.pushBackText = function(b) {
        d(arguments.length, 1, "pushBackText", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("Obj.pushBackText", {
            o: this.id,
            t: b
        }).then(function(b) {
            return f(a.Obj,
                b)
        })
    };
    a.Obj.prototype.pushBackNull = function() {
        return a.sendWithPromise("Obj.pushBackNull", {
            o: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Obj.prototype.pushBack = function(b) {
        d(arguments.length, 1, "pushBack", "(PDFNet.Obj)", [
            [b, "Object", a.Obj, "Obj"]
        ]);
        return a.sendWithPromise("Obj.pushBack", {
            o: this.id,
            input_obj: b.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Obj.prototype.pushBackRect = function(b, c, e, g) {
        d(arguments.length, 4, "pushBackRect", "(number, number, number, number)", [
            [b, "number"],
            [c, "number"],
            [e, "number"],
            [g, "number"]
        ]);
        return a.sendWithPromise("Obj.pushBackRect", {
            o: this.id,
            x1: b,
            y1: c,
            x2: e,
            y2: g
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Obj.prototype.pushBackMatrix = function(b) {
        d(arguments.length, 1, "pushBackMatrix", "(PDFNet.Matrix2D)", [
            [b, "Structure", a.Matrix2D, "Matrix2D"]
        ]);
        n("pushBackMatrix", [
            [b, 0]
        ]);
        return a.sendWithPromise("Obj.pushBackMatrix", {
            o: this.id,
            mtx: b
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.Obj.prototype.eraseAt = function(b) {
        d(arguments.length, 1, "eraseAt", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("Obj.eraseAt", {
            o: this.id,
            pos: b
        })
    };
    a.Obj.prototype.isStream = function() {
        return a.sendWithPromise("Obj.isStream", {
            o: this.id
        })
    };
    a.Obj.prototype.getRawStreamLength = function() {
        return a.sendWithPromise("Obj.getRawStreamLength", {
            o: this.id
        })
    };
    a.Obj.prototype.setStreamData = function(b) {
        d(arguments.length, 1, "setStreamData", "(ArrayBuffer|TypedArray)", [
            [b, "ArrayBuffer"]
        ]);
        var c = u(b, !1);
        return a.sendWithPromise("Obj.setStreamData", {
            obj: this.id,
            data_buf: c
        })
    };
    a.Obj.prototype.setStreamDataWithFilter =
        function(b, c) {
            d(arguments.length, 2, "setStreamDataWithFilter", "(ArrayBuffer|TypedArray, PDFNet.Filter)", [
                [b, "ArrayBuffer"],
                [c, "Object", a.Filter, "Filter"]
            ]);
            var e = u(b, !1);
            0 != c.id && t(c.id);
            return a.sendWithPromise("Obj.setStreamDataWithFilter", {
                obj: this.id,
                data_buf: e,
                no_own_filter_chain: c.id
            })
        };
    a.Obj.prototype.getRawStream = function(b) {
        d(arguments.length, 1, "getRawStream", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("Obj.getRawStream", {
            o: this.id,
            decrypt: b
        }).then(function(b) {
            return f(a.Filter,
                b)
        })
    };
    a.Obj.prototype.getDecodedStream = function() {
        return a.sendWithPromise("Obj.getDecodedStream", {
            o: this.id
        }).then(function(b) {
            return f(a.Filter, b)
        })
    };
    a.ObjSet.create = function() {
        return a.sendWithPromise("objSetCreate", {}).then(function(b) {
            return l(a.ObjSet, b)
        })
    };
    a.ObjSet.prototype.createName = function(b) {
        d(arguments.length, 1, "createName", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("ObjSet.createName", {
            set: this.id,
            name: b
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.ObjSet.prototype.createArray =
        function() {
            return a.sendWithPromise("ObjSet.createArray", {
                set: this.id
            }).then(function(b) {
                return f(a.Obj, b)
            })
        };
    a.ObjSet.prototype.createBool = function(b) {
        d(arguments.length, 1, "createBool", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("ObjSet.createBool", {
            set: this.id,
            value: b
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.ObjSet.prototype.createDict = function() {
        return a.sendWithPromise("ObjSet.createDict", {
            set: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.ObjSet.prototype.createNull = function() {
        return a.sendWithPromise("ObjSet.createNull", {
            set: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.ObjSet.prototype.createNumber = function(b) {
        d(arguments.length, 1, "createNumber", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("ObjSet.createNumber", {
            set: this.id,
            value: b
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.ObjSet.prototype.createString = function(b) {
        d(arguments.length, 1, "createString", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("ObjSet.createString", {
            set: this.id,
            value: b
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.ObjSet.prototype.createFromJson =
        function(b) {
            d(arguments.length, 1, "createFromJson", "(string)", [
                [b, "string"]
            ]);
            return a.sendWithPromise("ObjSet.createFromJson", {
                set: this.id,
                json: b
            }).then(function(b) {
                return f(a.Obj, b)
            })
        };
    a.SDFDoc.createFromFileUString = function(b) {
        d(arguments.length, 1, "createFromFileUString", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("sdfDocCreateFromFileUString", {
            filepath: b
        }).then(function(b) {
            return f(a.SDFDoc, b)
        })
    };
    a.SDFDoc.createFromFileString = function(b) {
        d(arguments.length, 1, "createFromFileString", "(string)",
            [
                [b, "string"]
            ]);
        return a.sendWithPromise("sdfDocCreateFromFileString", {
            filepath: b
        }).then(function(b) {
            return f(a.SDFDoc, b)
        })
    };
    a.SDFDoc.prototype.createShallowCopy = function() {
        return a.sendWithPromise("SDFDoc.createShallowCopy", {
            source: this.id
        }).then(function(b) {
            return f(a.SDFDoc, b)
        })
    };
    a.SDFDoc.prototype.releaseFileHandles = function() {
        return a.sendWithPromise("SDFDoc.releaseFileHandles", {
            doc: this.id
        })
    };
    a.SDFDoc.prototype.isEncrypted = function() {
        return a.sendWithPromise("SDFDoc.isEncrypted", {
            doc: this.id
        })
    };
    a.SDFDoc.prototype.initStdSecurityHandlerUString = function(b) {
        d(arguments.length, 1, "initStdSecurityHandlerUString", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("SDFDoc.initStdSecurityHandlerUString", {
            doc: this.id,
            password: b
        })
    };
    a.SDFDoc.prototype.isModified = function() {
        return a.sendWithPromise("SDFDoc.isModified", {
            doc: this.id
        })
    };
    a.SDFDoc.prototype.hasRepairedXRef = function() {
        return a.sendWithPromise("SDFDoc.hasRepairedXRef", {
            doc: this.id
        })
    };
    a.SDFDoc.prototype.isFullSaveRequired = function() {
        return a.sendWithPromise("SDFDoc.isFullSaveRequired", {
            doc: this.id
        })
    };
    a.SDFDoc.prototype.getTrailer = function() {
        return a.sendWithPromise("SDFDoc.getTrailer", {
            doc: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.SDFDoc.prototype.getObj = function(b) {
        d(arguments.length, 1, "getObj", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("SDFDoc.getObj", {
            doc: this.id,
            obj_num: b
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.SDFDoc.prototype.importObj = function(b, c) {
        d(arguments.length, 2, "importObj", "(PDFNet.Obj, boolean)", [
            [b, "Object", a.Obj, "Obj"],
            [c, "boolean"]
        ]);
        return a.sendWithPromise("SDFDoc.importObj", {
            doc: this.id,
            obj: b.id,
            deep_copy: c
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.SDFDoc.prototype.importObjsWithExcludeList = function(b, c) {
        d(arguments.length, 2, "importObjsWithExcludeList", "(Array<PDFNet.Obj>, Array<PDFNet.Obj>)", [
            [b, "Array"],
            [c, "Array"]
        ]);
        b = Array.from(b, function(a) {
            return a.id
        });
        c = Array.from(c, function(a) {
            return a.id
        });
        return a.sendWithPromise("SDFDoc.importObjsWithExcludeList", {
            doc: this.id,
            obj_list: b,
            exclude_list: c
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.SDFDoc.prototype.xRefSize = function() {
        return a.sendWithPromise("SDFDoc.xRefSize", {
            doc: this.id
        })
    };
    a.SDFDoc.prototype.clearMarks = function() {
        return a.sendWithPromise("SDFDoc.clearMarks", {
            doc: this.id
        })
    };
    a.SDFDoc.prototype.save = function(b, c, e) {
        d(arguments.length, 3, "save", "(string, number, string)", [
            [b, "string"],
            [c, "number"],
            [e, "string"]
        ]);
        return a.sendWithPromise("SDFDoc.save", {
            doc: this.id,
            path: b,
            flags: c,
            header: e
        })
    };
    a.SDFDoc.prototype.saveMemory = function(b, c) {
        d(arguments.length, 2, "saveMemory", "(number, string)", [
            [b, "number"],
            [c, "string"]
        ]);
        return a.sendWithPromise("SDFDoc.saveMemory", {
            doc: this.id,
            flags: b,
            header: c
        }).then(function(a) {
            return new Uint8Array(a)
        })
    };
    a.SDFDoc.prototype.saveStream = function(b, c, e) {
        d(arguments.length, 3, "saveStream", "(PDFNet.Filter, number, string)", [
            [b, "Object", a.Filter, "Filter"],
            [c, "number"],
            [e, "string"]
        ]);
        return a.sendWithPromise("SDFDoc.saveStream", {
            doc: this.id,
            stream: b.id,
            flags: c,
            header: e
        })
    };
    a.SDFDoc.prototype.getHeader = function() {
        return a.sendWithPromise("SDFDoc.getHeader", {
            doc: this.id
        })
    };
    a.SDFDoc.prototype.getSecurityHandler = function() {
        return a.sendWithPromise("SDFDoc.getSecurityHandler", {
            doc: this.id
        }).then(function(b) {
            return f(a.SecurityHandler, b)
        })
    };
    a.SDFDoc.prototype.setSecurityHandler = function(b) {
        d(arguments.length, 1, "setSecurityHandler", "(PDFNet.SecurityHandler)", [
            [b, "Object", a.SecurityHandler, "SecurityHandler"]
        ]);
        0 != b.id && t(b.id);
        return a.sendWithPromise("SDFDoc.setSecurityHandler", {
            doc: this.id,
            no_own_handler: b.id
        })
    };
    a.SDFDoc.prototype.removeSecurity = function() {
        return a.sendWithPromise("SDFDoc.removeSecurity", {
            doc: this.id
        })
    };
    a.SDFDoc.prototype.swap = function(b, c) {
        d(arguments.length,
            2, "swap", "(number, number)", [
                [b, "number"],
                [c, "number"]
            ]);
        return a.sendWithPromise("SDFDoc.swap", {
            doc: this.id,
            obj_num1: b,
            obj_num2: c
        })
    };
    a.SDFDoc.prototype.isLinearized = function() {
        return a.sendWithPromise("SDFDoc.isLinearized", {
            doc: this.id
        })
    };
    a.SDFDoc.prototype.getLinearizationDict = function() {
        return a.sendWithPromise("SDFDoc.getLinearizationDict", {
            doc: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.SDFDoc.prototype.getHintStream = function() {
        return a.sendWithPromise("SDFDoc.getHintStream", {
            doc: this.id
        }).then(function(b) {
            return f(a.Obj,
                b)
        })
    };
    a.SDFDoc.prototype.enableDiskCaching = function(b) {
        d(arguments.length, 1, "enableDiskCaching", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("SDFDoc.enableDiskCaching", {
            doc: this.id,
            use_cache_flag: b
        })
    };
    a.SDFDoc.prototype.lock = function() {
        var b = this;
        return a.sendWithPromise("SDFDoc.lock", {
            doc: this.id
        }).then(function() {
            lockedObjects.push({
                name: "SDFDoc",
                id: b.id,
                unlocktype: "unlock"
            })
        })
    };
    a.SDFDoc.prototype.unlock = function() {
        var b = this;
        return a.sendWithPromise("SDFDoc.unlock", {
            doc: this.id
        }).then(function() {
            y(b)
        })
    };
    a.SDFDoc.prototype.lockRead = function() {
        var b = this;
        return a.sendWithPromise("SDFDoc.lockRead", {
            doc: this.id
        }).then(function() {
            lockedObjects.push({
                name: "SDFDoc",
                id: b.id,
                unlocktype: "unlockRead"
            })
        })
    };
    a.SDFDoc.prototype.unlockRead = function() {
        var b = this;
        return a.sendWithPromise("SDFDoc.unlockRead", {
            doc: this.id
        }).then(function() {
            y(b)
        })
    };
    a.SDFDoc.prototype.tryLock = function() {
        var b = this;
        return a.sendWithPromise("SDFDoc.tryLock", {
            doc: this.id
        }).then(function(a) {
            a && lockedObjects.push({
                name: "SDFDoc",
                id: b.id,
                unlocktype: "unlock"
            })
        })
    };
    a.SDFDoc.prototype.tryLockRead = function() {
        var b = this;
        return a.sendWithPromise("SDFDoc.tryLockRead", {
            doc: this.id
        }).then(function(a) {
            a && lockedObjects.push({
                name: "SDFDoc",
                id: b.id,
                unlocktype: "unlockRead"
            })
        })
    };
    a.SDFDoc.prototype.getFileName = function() {
        return a.sendWithPromise("SDFDoc.getFileName", {
            doc: this.id
        })
    };
    a.SDFDoc.prototype.createIndirectName = function(b) {
        d(arguments.length, 1, "createIndirectName", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("SDFDoc.createIndirectName", {
            doc: this.id,
            name: b
        }).then(function(b) {
            return f(a.Obj,
                b)
        })
    };
    a.SDFDoc.prototype.createIndirectArray = function() {
        return a.sendWithPromise("SDFDoc.createIndirectArray", {
            doc: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.SDFDoc.prototype.createIndirectBool = function(b) {
        d(arguments.length, 1, "createIndirectBool", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("SDFDoc.createIndirectBool", {
            doc: this.id,
            value: b
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.SDFDoc.prototype.createIndirectDict = function() {
        return a.sendWithPromise("SDFDoc.createIndirectDict", {
            doc: this.id
        }).then(function(b) {
            return f(a.Obj,
                b)
        })
    };
    a.SDFDoc.prototype.createIndirectNull = function() {
        return a.sendWithPromise("SDFDoc.createIndirectNull", {
            doc: this.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.SDFDoc.prototype.createIndirectNumber = function(b) {
        d(arguments.length, 1, "createIndirectNumber", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("SDFDoc.createIndirectNumber", {
            doc: this.id,
            value: b
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.SDFDoc.prototype.createIndirectString = function(b) {
        d(arguments.length, 1, "createIndirectString", "(ArrayBuffer|TypedArray)",
            [
                [b, "ArrayBuffer"]
            ]);
        var c = u(b, !1);
        return a.sendWithPromise("SDFDoc.createIndirectString", {
            doc: this.id,
            buf_value: c
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.SDFDoc.prototype.createIndirectStringFromUString = function(b) {
        d(arguments.length, 1, "createIndirectStringFromUString", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("SDFDoc.createIndirectStringFromUString", {
            doc: this.id,
            str: b
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.SDFDoc.prototype.createIndirectStreamFromFilter = function(b, c) {
        "undefined" ===
        typeof c && (c = new a.Filter("0"));
        d(arguments.length, 1, "createIndirectStreamFromFilter", "(PDFNet.FilterReader, PDFNet.Filter)", [
            [b, "Object", a.FilterReader, "FilterReader"],
            [c, "Object", a.Filter, "Filter"]
        ]);
        0 != c.id && t(c.id);
        return a.sendWithPromise("SDFDoc.createIndirectStreamFromFilter", {
            doc: this.id,
            data: b.id,
            no_own_filter_chain: c.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.SDFDoc.prototype.createIndirectStream = function(b, c) {
        d(arguments.length, 2, "createIndirectStream", "(ArrayBuffer|TypedArray, PDFNet.Filter)",
            [
                [b, "ArrayBuffer"],
                [c, "Object", a.Filter, "Filter"]
            ]);
        var e = u(b, !1);
        0 != c.id && t(c.id);
        return a.sendWithPromise("SDFDoc.createIndirectStream", {
            doc: this.id,
            data_buf: e,
            no_own_filter_chain: c.id
        }).then(function(b) {
            return f(a.Obj, b)
        })
    };
    a.SecurityHandler.prototype.getPermission = function(b) {
        d(arguments.length, 1, "getPermission", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("SecurityHandler.getPermission", {
            sh: this.id,
            p: b
        })
    };
    a.SecurityHandler.prototype.getKeyLength = function() {
        return a.sendWithPromise("SecurityHandler.getKeyLength", {
            sh: this.id
        })
    };
    a.SecurityHandler.prototype.getEncryptionAlgorithmID = function() {
        return a.sendWithPromise("SecurityHandler.getEncryptionAlgorithmID", {
            sh: this.id
        })
    };
    a.SecurityHandler.prototype.getHandlerDocName = function() {
        return a.sendWithPromise("SecurityHandler.getHandlerDocName", {
            sh: this.id
        })
    };
    a.SecurityHandler.prototype.isModified = function() {
        return a.sendWithPromise("SecurityHandler.isModified", {
            sh: this.id
        })
    };
    a.SecurityHandler.prototype.setModified = function(b) {
        "undefined" === typeof b && (b = !0);
        d(arguments.length,
            0, "setModified", "(boolean)", [
                [b, "boolean"]
            ]);
        return a.sendWithPromise("SecurityHandler.setModified", {
            sh: this.id,
            is_modified: b
        })
    };
    a.SecurityHandler.create = function(b) {
        d(arguments.length, 1, "create", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("securityHandlerCreate", {
            crypt_type: b
        }).then(function(b) {
            return l(a.SecurityHandler, b)
        })
    };
    a.SecurityHandler.createFromEncCode = function(b, c, e) {
        d(arguments.length, 3, "createFromEncCode", "(string, number, number)", [
            [b, "string"],
            [c, "number"],
            [e, "number"]
        ]);
        return a.sendWithPromise("securityHandlerCreateFromEncCode", {
            name: b,
            key_len: c,
            enc_code: e
        }).then(function(b) {
            return l(a.SecurityHandler, b)
        })
    };
    a.SecurityHandler.createDefault = function() {
        return a.sendWithPromise("securityHandlerCreateDefault", {}).then(function(b) {
            return l(a.SecurityHandler, b)
        })
    };
    a.SecurityHandler.prototype.setPermission = function(b, c) {
        d(arguments.length, 2, "setPermission", "(number, boolean)", [
            [b, "number"],
            [c, "boolean"]
        ]);
        return a.sendWithPromise("SecurityHandler.setPermission", {
            sh: this.id,
            perm: b,
            value: c
        })
    };
    a.SecurityHandler.prototype.changeRevisionNumber =
        function(b) {
            d(arguments.length, 1, "changeRevisionNumber", "(number)", [
                [b, "number"]
            ]);
            return a.sendWithPromise("SecurityHandler.changeRevisionNumber", {
                sh: this.id,
                rev_num: b
            })
        };
    a.SecurityHandler.prototype.setEncryptMetadata = function(b) {
        d(arguments.length, 1, "setEncryptMetadata", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("SecurityHandler.setEncryptMetadata", {
            sh: this.id,
            encrypt_metadata: b
        })
    };
    a.SecurityHandler.prototype.getRevisionNumber = function() {
        return a.sendWithPromise("SecurityHandler.getRevisionNumber", {
            sh: this.id
        })
    };
    a.SecurityHandler.prototype.isUserPasswordRequired = function() {
        return a.sendWithPromise("SecurityHandler.isUserPasswordRequired", {
            sh: this.id
        })
    };
    a.SecurityHandler.prototype.isMasterPasswordRequired = function() {
        return a.sendWithPromise("SecurityHandler.isMasterPasswordRequired", {
            sh: this.id
        })
    };
    a.SecurityHandler.prototype.isAES = function() {
        return a.sendWithPromise("SecurityHandler.isAES", {
            sh: this.id
        })
    };
    a.SecurityHandler.prototype.isAESObj = function(b) {
        d(arguments.length, 1, "isAESObj", "(PDFNet.Obj)",
            [
                [b, "Object", a.Obj, "Obj"]
            ]);
        return a.sendWithPromise("SecurityHandler.isAESObj", {
            sh: this.id,
            stream: b.id
        })
    };
    a.SecurityHandler.prototype.isRC4 = function() {
        return a.sendWithPromise("SecurityHandler.isRC4", {
            sh: this.id
        })
    };
    a.SecurityHandler.prototype.changeUserPasswordUString = function(b) {
        d(arguments.length, 1, "changeUserPasswordUString", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("SecurityHandler.changeUserPasswordUString", {
            sh: this.id,
            password: b
        })
    };
    a.SecurityHandler.prototype.changeUserPasswordBuffer =
        function(b) {
            d(arguments.length, 1, "changeUserPasswordBuffer", "(ArrayBuffer|TypedArray)", [
                [b, "ArrayBuffer"]
            ]);
            var c = u(b, !1);
            return a.sendWithPromise("SecurityHandler.changeUserPasswordBuffer", {
                sh: this.id,
                password_buf: c
            })
        };
    a.SecurityHandler.prototype.changeMasterPasswordUString = function(b) {
        d(arguments.length, 1, "changeMasterPasswordUString", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("SecurityHandler.changeMasterPasswordUString", {
            sh: this.id,
            password: b
        })
    };
    a.SecurityHandler.prototype.changeMasterPasswordBuffer =
        function(b) {
            d(arguments.length, 1, "changeMasterPasswordBuffer", "(ArrayBuffer|TypedArray)", [
                [b, "ArrayBuffer"]
            ]);
            var c = u(b, !1);
            return a.sendWithPromise("SecurityHandler.changeMasterPasswordBuffer", {
                sh: this.id,
                password_buf: c
            })
        };
    a.SecurityHandler.prototype.initPasswordUString = function(b) {
        d(arguments.length, 1, "initPasswordUString", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("SecurityHandler.initPasswordUString", {
            sh: this.id,
            password: b
        })
    };
    a.SecurityHandler.prototype.initPasswordBuffer = function(b) {
        d(arguments.length,
            1, "initPasswordBuffer", "(ArrayBuffer|TypedArray)", [
                [b, "ArrayBuffer"]
            ]);
        var c = u(b, !1);
        return a.sendWithPromise("SecurityHandler.initPasswordBuffer", {
            sh: this.id,
            password_buf: c
        })
    };
    a.SignatureHandler.prototype.getName = function() {
        return a.sendWithPromise("SignatureHandler.getName", {
            signature_handler: this.id
        })
    };
    a.SignatureHandler.prototype.reset = function() {
        return a.sendWithPromise("SignatureHandler.reset", {
            signature_handler: this.id
        })
    };
    a.SignatureHandler.prototype.destructor = function() {
        return a.sendWithPromise("SignatureHandler.destructor", {
            signature_handler: this.id
        })
    };
    a.UndoManager.prototype.discardAllSnapshots = function() {
        return a.sendWithPromise("UndoManager.discardAllSnapshots", {
            self: this.id
        }).then(function(b) {
            return l(a.DocSnapshot, b)
        })
    };
    a.UndoManager.prototype.undo = function() {
        return a.sendWithPromise("UndoManager.undo", {
            self: this.id
        }).then(function(b) {
            return l(a.ResultSnapshot, b)
        })
    };
    a.UndoManager.prototype.canUndo = function() {
        return a.sendWithPromise("UndoManager.canUndo", {
            self: this.id
        })
    };
    a.UndoManager.prototype.getNextUndoSnapshot =
        function() {
            return a.sendWithPromise("UndoManager.getNextUndoSnapshot", {
                self: this.id
            }).then(function(b) {
                return l(a.DocSnapshot, b)
            })
        };
    a.UndoManager.prototype.redo = function() {
        return a.sendWithPromise("UndoManager.redo", {
            self: this.id
        }).then(function(b) {
            return l(a.ResultSnapshot, b)
        })
    };
    a.UndoManager.prototype.canRedo = function() {
        return a.sendWithPromise("UndoManager.canRedo", {
            self: this.id
        })
    };
    a.UndoManager.prototype.getNextRedoSnapshot = function() {
        return a.sendWithPromise("UndoManager.getNextRedoSnapshot", {
            self: this.id
        }).then(function(b) {
            return l(a.DocSnapshot, b)
        })
    };
    a.UndoManager.prototype.takeSnapshot = function() {
        return a.sendWithPromise("UndoManager.takeSnapshot", {
            self: this.id
        }).then(function(b) {
            return l(a.ResultSnapshot, b)
        })
    };
    a.ResultSnapshot.prototype.currentState = function() {
        return a.sendWithPromise("ResultSnapshot.currentState", {
            self: this.id
        }).then(function(b) {
            return l(a.DocSnapshot, b)
        })
    };
    a.ResultSnapshot.prototype.previousState = function() {
        return a.sendWithPromise("ResultSnapshot.previousState", {
            self: this.id
        }).then(function(b) {
            return l(a.DocSnapshot, b)
        })
    };
    a.ResultSnapshot.prototype.isOk = function() {
        return a.sendWithPromise("ResultSnapshot.isOk", {
            self: this.id
        })
    };
    a.ResultSnapshot.prototype.isNullTransition = function() {
        return a.sendWithPromise("ResultSnapshot.isNullTransition", {
            self: this.id
        })
    };
    a.DocSnapshot.prototype.getHash = function() {
        return a.sendWithPromise("DocSnapshot.getHash", {
            self: this.id
        })
    };
    a.DocSnapshot.prototype.isValid = function() {
        return a.sendWithPromise("DocSnapshot.isValid", {
            self: this.id
        })
    };
    a.DocSnapshot.prototype.equals = function(b) {
        d(arguments.length, 1, "equals", "(PDFNet.DocSnapshot)", [
            [b, "Object", a.DocSnapshot, "DocSnapshot"]
        ]);
        return a.sendWithPromise("DocSnapshot.equals", {
            self: this.id,
            snapshot: b.id
        })
    };
    a.CADModule.isModuleAvailable = function() {
        return a.sendWithPromise("cadModuleIsModuleAvailable", {})
    };
    a.OCRModule.isModuleAvailable = function() {
        return a.sendWithPromise("ocrModuleIsModuleAvailable", {})
    };
    a.OCRModule.isIRISModuleAvailable = function() {
        return a.sendWithPromise("ocrModuleIsIRISModuleAvailable", {})
    };
    a.OCRModule.imageToPDF = function(b, c, e) {
        "undefined" === typeof e && (e = new a.Obj("0"));
        d(arguments.length, 2, "imageToPDF", "(PDFNet.PDFDoc, string, PDFNet.Obj)", [
            [b, "PDFDoc"],
            [c, "string"],
            [e, "OptionObject", a.Obj, "Obj", "PDFNet.OCRModule.OCROptions"]
        ]);
        if ("PDFNet.OCRModule.OCROptions" === e.name) {
            var f = e;
            e = a.ObjSet.create().then(function(a) {
                return a.createFromJson(JSON.stringify(f))
            })
        } else e = Promise.resolve(e);
        return e.then(function(d) {
            return a.sendWithPromise("ocrModuleImageToPDF", {
                dst: b.id,
                src: c,
                options: d.id
            })
        })
    };
    a.OCRModule.processPDF = function(b, c) {
        "undefined" === typeof c && (c = new a.Obj("0"));
        d(arguments.length, 1, "processPDF", "(PDFNet.PDFDoc, PDFNet.Obj)", [
            [b, "PDFDoc"],
            [c, "OptionObject", a.Obj, "Obj", "PDFNet.OCRModule.OCROptions"]
        ]);
        if ("PDFNet.OCRModule.OCROptions" === c.name) {
            var e = c;
            c = a.ObjSet.create().then(function(a) {
                return a.createFromJson(JSON.stringify(e))
            })
        } else c = Promise.resolve(c);
        return c.then(function(c) {
            return a.sendWithPromise("ocrModuleProcessPDF", {
                dst: b.id,
                options: c.id
            })
        })
    };
    a.OCRModule.getOCRJsonFromImage =
        function(b, c, e) {
            "undefined" === typeof e && (e = new a.Obj("0"));
            d(arguments.length, 2, "getOCRJsonFromImage", "(PDFNet.PDFDoc, string, PDFNet.Obj)", [
                [b, "PDFDoc"],
                [c, "string"],
                [e, "OptionObject", a.Obj, "Obj", "PDFNet.OCRModule.OCROptions"]
            ]);
            if ("PDFNet.OCRModule.OCROptions" === e.name) {
                var f = e;
                e = a.ObjSet.create().then(function(a) {
                    return a.createFromJson(JSON.stringify(f))
                })
            } else e = Promise.resolve(e);
            return e.then(function(d) {
                return a.sendWithPromise("ocrModuleGetOCRJsonFromImage", {
                    dst: b.id,
                    src: c,
                    options: d.id
                })
            })
        };
    a.OCRModule.getOCRJsonFromPDF = function(b, c) {
        "undefined" === typeof c && (c = new a.Obj("0"));
        d(arguments.length, 1, "getOCRJsonFromPDF", "(PDFNet.PDFDoc, PDFNet.Obj)", [
            [b, "PDFDoc"],
            [c, "OptionObject", a.Obj, "Obj", "PDFNet.OCRModule.OCROptions"]
        ]);
        if ("PDFNet.OCRModule.OCROptions" === c.name) {
            var e = c;
            c = a.ObjSet.create().then(function(a) {
                return a.createFromJson(JSON.stringify(e))
            })
        } else c = Promise.resolve(c);
        return c.then(function(c) {
            return a.sendWithPromise("ocrModuleGetOCRJsonFromPDF", {
                src: b.id,
                options: c.id
            })
        })
    };
    a.OCRModule.applyOCRJsonToPDF = function(b, c) {
        d(arguments.length, 2, "applyOCRJsonToPDF", "(PDFNet.PDFDoc, string)", [
            [b, "PDFDoc"],
            [c, "string"]
        ]);
        return a.sendWithPromise("ocrModuleApplyOCRJsonToPDF", {
            dst: b.id,
            json: c
        })
    };
    a.OCRModule.getOCRXmlFromImage = function(b, c, e) {
        "undefined" === typeof e && (e = new a.Obj("0"));
        d(arguments.length, 2, "getOCRXmlFromImage", "(PDFNet.PDFDoc, string, PDFNet.Obj)", [
            [b, "PDFDoc"],
            [c, "string"],
            [e, "OptionObject", a.Obj, "Obj", "PDFNet.OCRModule.OCROptions"]
        ]);
        if ("PDFNet.OCRModule.OCROptions" ===
            e.name) {
            var f = e;
            e = a.ObjSet.create().then(function(a) {
                return a.createFromJson(JSON.stringify(f))
            })
        } else e = Promise.resolve(e);
        return e.then(function(d) {
            return a.sendWithPromise("ocrModuleGetOCRXmlFromImage", {
                dst: b.id,
                src: c,
                options: d.id
            })
        })
    };
    a.OCRModule.getOCRXmlFromPDF = function(b, c) {
        "undefined" === typeof c && (c = new a.Obj("0"));
        d(arguments.length, 1, "getOCRXmlFromPDF", "(PDFNet.PDFDoc, PDFNet.Obj)", [
            [b, "PDFDoc"],
            [c, "OptionObject", a.Obj, "Obj", "PDFNet.OCRModule.OCROptions"]
        ]);
        if ("PDFNet.OCRModule.OCROptions" ===
            c.name) {
            var e = c;
            c = a.ObjSet.create().then(function(a) {
                return a.createFromJson(JSON.stringify(e))
            })
        } else c = Promise.resolve(c);
        return c.then(function(c) {
            return a.sendWithPromise("ocrModuleGetOCRXmlFromPDF", {
                src: b.id,
                options: c.id
            })
        })
    };
    a.OCRModule.applyOCRXmlToPDF = function(b, c) {
        d(arguments.length, 2, "applyOCRXmlToPDF", "(PDFNet.PDFDoc, string)", [
            [b, "PDFDoc"],
            [c, "string"]
        ]);
        return a.sendWithPromise("ocrModuleApplyOCRXmlToPDF", {
            dst: b.id,
            xml: c
        })
    };
    a.VerificationOptions.create = function(b) {
        d(arguments.length,
            1, "create", "(number)", [
                [b, "number"]
            ]);
        return a.sendWithPromise("verificationOptionsCreate", {
            in_level: b
        }).then(function(b) {
            return l(a.VerificationOptions, b)
        })
    };
    a.VerificationOptions.prototype.addTrustedCertificate = function(b, c) {
        "undefined" === typeof c && (c = a.VerificationOptions.CertificateTrustFlag.e_default_trust);
        d(arguments.length, 1, "addTrustedCertificate", "(ArrayBuffer|TypedArray, number)", [
            [b, "ArrayBuffer"],
            [c, "number"]
        ]);
        var e = u(b, !1);
        return a.sendWithPromise("VerificationOptions.addTrustedCertificate", {
            self: this.id,
            in_certificate_buf: e,
            in_trust_flags: c
        })
    };
    a.VerificationOptions.prototype.addTrustedCertificateUString = function(b, c) {
        "undefined" === typeof c && (c = a.VerificationOptions.CertificateTrustFlag.e_default_trust);
        d(arguments.length, 1, "addTrustedCertificateUString", "(string, number)", [
            [b, "string"],
            [c, "number"]
        ]);
        return a.sendWithPromise("VerificationOptions.addTrustedCertificateUString", {
            self: this.id,
            in_filepath: b,
            in_trust_flags: c
        })
    };
    a.VerificationOptions.prototype.addTrustedCertificates = function(b) {
        d(arguments.length,
            1, "addTrustedCertificates", "(ArrayBuffer|TypedArray)", [
                [b, "ArrayBuffer"]
            ]);
        var c = u(b, !1);
        return a.sendWithPromise("VerificationOptions.addTrustedCertificates", {
            self: this.id,
            in_P7C_binary_DER_certificates_file_data_buf: c
        })
    };
    a.VerificationOptions.prototype.loadTrustList = function(b) {
        d(arguments.length, 1, "loadTrustList", "(PDFNet.FDFDoc)", [
            [b, "FDFDoc"]
        ]);
        return a.sendWithPromise("VerificationOptions.loadTrustList", {
            self: this.id,
            in_fdf_cert_exchange_data: b.id
        })
    };
    a.VerificationOptions.prototype.enableModificationVerification =
        function(b) {
            d(arguments.length, 1, "enableModificationVerification", "(boolean)", [
                [b, "boolean"]
            ]);
            return a.sendWithPromise("VerificationOptions.enableModificationVerification", {
                self: this.id,
                in_on_or_off: b
            })
        };
    a.VerificationOptions.prototype.enableDigestVerification = function(b) {
        d(arguments.length, 1, "enableDigestVerification", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("VerificationOptions.enableDigestVerification", {
            self: this.id,
            in_on_or_off: b
        })
    };
    a.VerificationOptions.prototype.enableTrustVerification =
        function(b) {
            d(arguments.length, 1, "enableTrustVerification", "(boolean)", [
                [b, "boolean"]
            ]);
            return a.sendWithPromise("VerificationOptions.enableTrustVerification", {
                self: this.id,
                in_on_or_off: b
            })
        };
    a.VerificationOptions.prototype.setRevocationProxyPrefix = function(b) {
        d(arguments.length, 1, "setRevocationProxyPrefix", "(string)", [
            [b, "string"]
        ]);
        return a.sendWithPromise("VerificationOptions.setRevocationProxyPrefix", {
            self: this.id,
            in_str: b
        })
    };
    a.VerificationOptions.prototype.setRevocationTimeout = function(b) {
        d(arguments.length,
            1, "setRevocationTimeout", "(number)", [
                [b, "number"]
            ]);
        return a.sendWithPromise("VerificationOptions.setRevocationTimeout", {
            self: this.id,
            in_revocation_timeout_milliseconds: b
        })
    };
    a.VerificationOptions.prototype.enableOnlineCRLRevocationChecking = function(b) {
        d(arguments.length, 1, "enableOnlineCRLRevocationChecking", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("VerificationOptions.enableOnlineCRLRevocationChecking", {
            self: this.id,
            in_on_or_off: b
        })
    };
    a.VerificationOptions.prototype.enableOnlineOCSPRevocationChecking =
        function(b) {
            d(arguments.length, 1, "enableOnlineOCSPRevocationChecking", "(boolean)", [
                [b, "boolean"]
            ]);
            return a.sendWithPromise("VerificationOptions.enableOnlineOCSPRevocationChecking", {
                self: this.id,
                in_on_or_off: b
            })
        };
    a.VerificationOptions.prototype.enableOnlineRevocationChecking = function(b) {
        d(arguments.length, 1, "enableOnlineRevocationChecking", "(boolean)", [
            [b, "boolean"]
        ]);
        return a.sendWithPromise("VerificationOptions.enableOnlineRevocationChecking", {
            self: this.id,
            in_on_or_off: b
        })
    };
    a.VerificationResult.prototype.getDigitalSignatureField =
        function() {
            return a.sendWithPromise("VerificationResult.getDigitalSignatureField", {
                self: this.id
            }).then(function(b) {
                return new a.DigitalSignatureField(b)
            })
        };
    a.VerificationResult.prototype.getVerificationStatus = function() {
        return a.sendWithPromise("VerificationResult.getVerificationStatus", {
            self: this.id
        })
    };
    a.VerificationResult.prototype.getDocumentStatus = function() {
        return a.sendWithPromise("VerificationResult.getDocumentStatus", {
            self: this.id
        })
    };
    a.VerificationResult.prototype.getDigestStatus = function() {
        return a.sendWithPromise("VerificationResult.getDigestStatus", {
            self: this.id
        })
    };
    a.VerificationResult.prototype.getTrustStatus = function() {
        return a.sendWithPromise("VerificationResult.getTrustStatus", {
            self: this.id
        })
    };
    a.VerificationResult.prototype.getPermissionsStatus = function() {
        return a.sendWithPromise("VerificationResult.getPermissionsStatus", {
            self: this.id
        })
    };
    a.VerificationResult.prototype.getTrustVerificationResult = function() {
        return a.sendWithPromise("VerificationResult.getTrustVerificationResult", {
            self: this.id
        }).then(function(b) {
            return l(a.TrustVerificationResult,
                b)
        })
    };
    a.VerificationResult.prototype.hasTrustVerificationResult = function() {
        return a.sendWithPromise("VerificationResult.hasTrustVerificationResult", {
            self: this.id
        })
    };
    a.VerificationResult.prototype.getDisallowedChanges = function() {
        return a.sendWithPromise("VerificationResult.getDisallowedChanges", {
            self: this.id
        }).then(function(b) {
            for (var c = [], d = 0; d < b.length; ++d) {
                var f = b[d];
                if ("0" === f) return null;
                f = new a.DisallowedChange(f);
                c.push(f);
                createdObjects.push({
                    name: f.name,
                    id: f.id
                })
            }
            return c
        })
    };
    a.VerificationResult.prototype.getDigestAlgorithm =
        function() {
            return a.sendWithPromise("VerificationResult.getDigestAlgorithm", {
                self: this.id
            })
        };
    a.VerificationResult.prototype.getDocumentStatusAsString = function() {
        return a.sendWithPromise("VerificationResult.getDocumentStatusAsString", {
            self: this.id
        })
    };
    a.VerificationResult.prototype.getDigestStatusAsString = function() {
        return a.sendWithPromise("VerificationResult.getDigestStatusAsString", {
            self: this.id
        })
    };
    a.VerificationResult.prototype.getTrustStatusAsString = function() {
        return a.sendWithPromise("VerificationResult.getTrustStatusAsString", {
            self: this.id
        })
    };
    a.VerificationResult.prototype.getPermissionsStatusAsString = function() {
        return a.sendWithPromise("VerificationResult.getPermissionsStatusAsString", {
            self: this.id
        })
    };
    a.VerificationResult.prototype.getUnsupportedFeatures = function() {
        return a.sendWithPromise("VerificationResult.getUnsupportedFeatures", {
            self: this.id
        })
    };
    a.EmbeddedTimestampVerificationResult.prototype.getVerificationStatus = function() {
        return a.sendWithPromise("EmbeddedTimestampVerificationResult.getVerificationStatus", {
            self: this.id
        })
    };
    a.EmbeddedTimestampVerificationResult.prototype.getCMSDigestStatus = function() {
        return a.sendWithPromise("EmbeddedTimestampVerificationResult.getCMSDigestStatus", {
            self: this.id
        })
    };
    a.EmbeddedTimestampVerificationResult.prototype.getMessageImprintDigestStatus = function() {
        return a.sendWithPromise("EmbeddedTimestampVerificationResult.getMessageImprintDigestStatus", {
            self: this.id
        })
    };
    a.EmbeddedTimestampVerificationResult.prototype.getTrustStatus = function() {
        return a.sendWithPromise("EmbeddedTimestampVerificationResult.getTrustStatus", {
            self: this.id
        })
    };
    a.EmbeddedTimestampVerificationResult.prototype.getCMSDigestStatusAsString = function() {
        return a.sendWithPromise("EmbeddedTimestampVerificationResult.getCMSDigestStatusAsString", {
            self: this.id
        })
    };
    a.EmbeddedTimestampVerificationResult.prototype.getMessageImprintDigestStatusAsString = function() {
        return a.sendWithPromise("EmbeddedTimestampVerificationResult.getMessageImprintDigestStatusAsString", {
            self: this.id
        })
    };
    a.EmbeddedTimestampVerificationResult.prototype.getTrustStatusAsString = function() {
        return a.sendWithPromise("EmbeddedTimestampVerificationResult.getTrustStatusAsString", {
            self: this.id
        })
    };
    a.EmbeddedTimestampVerificationResult.prototype.hasTrustVerificationResult = function() {
        return a.sendWithPromise("EmbeddedTimestampVerificationResult.hasTrustVerificationResult", {
            self: this.id
        })
    };
    a.EmbeddedTimestampVerificationResult.prototype.getTrustVerificationResult = function() {
        return a.sendWithPromise("EmbeddedTimestampVerificationResult.getTrustVerificationResult", {
            self: this.id
        }).then(function(b) {
            return l(a.TrustVerificationResult, b)
        })
    };
    a.EmbeddedTimestampVerificationResult.prototype.getCMSSignatureDigestAlgorithm =
        function() {
            return a.sendWithPromise("EmbeddedTimestampVerificationResult.getCMSSignatureDigestAlgorithm", {
                self: this.id
            })
        };
    a.EmbeddedTimestampVerificationResult.prototype.getMessageImprintDigestAlgorithm = function() {
        return a.sendWithPromise("EmbeddedTimestampVerificationResult.getMessageImprintDigestAlgorithm", {
            self: this.id
        })
    };
    a.EmbeddedTimestampVerificationResult.prototype.getUnsupportedFeatures = function() {
        return a.sendWithPromise("EmbeddedTimestampVerificationResult.getUnsupportedFeatures", {
            self: this.id
        })
    };
    a.TrustVerificationResult.prototype.wasSuccessful = function() {
        return a.sendWithPromise("TrustVerificationResult.wasSuccessful", {
            self: this.id
        })
    };
    a.TrustVerificationResult.prototype.getResultString = function() {
        return a.sendWithPromise("TrustVerificationResult.getResultString", {
            self: this.id
        })
    };
    a.TrustVerificationResult.prototype.getTimeOfTrustVerification = function() {
        return a.sendWithPromise("TrustVerificationResult.getTimeOfTrustVerification", {
            self: this.id
        })
    };
    a.TrustVerificationResult.prototype.getTimeOfTrustVerificationEnum =
        function() {
            return a.sendWithPromise("TrustVerificationResult.getTimeOfTrustVerificationEnum", {
                self: this.id
            })
        };
    a.TrustVerificationResult.prototype.hasEmbeddedTimestampVerificationResult = function() {
        return a.sendWithPromise("TrustVerificationResult.hasEmbeddedTimestampVerificationResult", {
            self: this.id
        })
    };
    a.TrustVerificationResult.prototype.getEmbeddedTimestampVerificationResult = function() {
        return a.sendWithPromise("TrustVerificationResult.getEmbeddedTimestampVerificationResult", {
            self: this.id
        }).then(function(b) {
            return l(a.EmbeddedTimestampVerificationResult,
                b)
        })
    };
    a.TrustVerificationResult.prototype.getCertPath = function() {
        return a.sendWithPromise("TrustVerificationResult.getCertPath", {
            self: this.id
        }).then(function(b) {
            for (var c = [], d = 0; d < b.length; ++d) {
                var f = b[d];
                if ("0" === f) return null;
                f = new a.X509Certificate(f);
                c.push(f);
                createdObjects.push({
                    name: f.name,
                    id: f.id
                })
            }
            return c
        })
    };
    a.DisallowedChange.prototype.getObjNum = function() {
        return a.sendWithPromise("DisallowedChange.getObjNum", {
            self: this.id
        })
    };
    a.DisallowedChange.prototype.getType = function() {
        return a.sendWithPromise("DisallowedChange.getType", {
            self: this.id
        })
    };
    a.DisallowedChange.prototype.getTypeAsString = function() {
        return a.sendWithPromise("DisallowedChange.getTypeAsString", {
            self: this.id
        })
    };
    a.X509Extension.prototype.isCritical = function() {
        return a.sendWithPromise("X509Extension.isCritical", {
            self: this.id
        })
    };
    a.X509Extension.prototype.getObjectIdentifier = function() {
        return a.sendWithPromise("X509Extension.getObjectIdentifier", {
            self: this.id
        }).then(function(b) {
            return l(a.ObjectIdentifier, b)
        })
    };
    a.X509Extension.prototype.toString = function() {
        return a.sendWithPromise("X509Extension.toString", {
            self: this.id
        })
    };
    a.X509Extension.prototype.getData = function() {
        return a.sendWithPromise("X509Extension.getData", {
            self: this.id
        }).then(function(a) {
            return new Uint8Array(a)
        })
    };
    a.X501AttributeTypeAndValue.prototype.getAttributeTypeOID = function() {
        return a.sendWithPromise("X501AttributeTypeAndValue.getAttributeTypeOID", {
            self: this.id
        }).then(function(b) {
            return l(a.ObjectIdentifier, b)
        })
    };
    a.X501AttributeTypeAndValue.prototype.getStringValue = function() {
        return a.sendWithPromise("X501AttributeTypeAndValue.getStringValue", {
            self: this.id
        })
    };
    a.ByteRange.prototype.getStartOffset = function() {
        k("getStartOffset", this.yieldFunction);
        return a.sendWithPromise("ByteRange.getStartOffset", {
            self: this
        })
    };
    a.ByteRange.prototype.getEndOffset = function() {
        k("getEndOffset", this.yieldFunction);
        return a.sendWithPromise("ByteRange.getEndOffset", {
            self: this
        })
    };
    a.ByteRange.prototype.getSize = function() {
        k("getSize", this.yieldFunction);
        return a.sendWithPromise("ByteRange.getSize", {
            self: this
        })
    };
    a.TimestampingResult.prototype.getStatus = function() {
        return a.sendWithPromise("TimestampingResult.getStatus", {
            self: this.id
        })
    };
    a.TimestampingResult.prototype.getString = function() {
        return a.sendWithPromise("TimestampingResult.getString", {
            self: this.id
        })
    };
    a.TimestampingResult.prototype.hasResponseVerificationResult = function() {
        return a.sendWithPromise("TimestampingResult.hasResponseVerificationResult", {
            self: this.id
        })
    };
    a.TimestampingResult.prototype.getResponseVerificationResult = function() {
        return a.sendWithPromise("TimestampingResult.getResponseVerificationResult", {
            self: this.id
        }).then(function(b) {
            return l(a.EmbeddedTimestampVerificationResult,
                b)
        })
    };
    a.TimestampingResult.prototype.getData = function() {
        return a.sendWithPromise("TimestampingResult.getData", {
            self: this.id
        }).then(function(a) {
            return new Uint8Array(a)
        })
    };
    a.ActionParameter.create = function(b) {
        d(arguments.length, 1, "create", "(PDFNet.Action)", [
            [b, "Object", a.Action, "Action"]
        ]);
        return a.sendWithPromise("actionParameterCreate", {
            action: b.id
        }).then(function(b) {
            return l(a.ActionParameter, b)
        })
    };
    a.Action.prototype.parameterCreateWithField = function(b) {
        d(arguments.length, 1, "parameterCreateWithField",
            "(PDFNet.Field)", [
                [b, "Structure", a.Field, "Field"]
            ]);
        n("parameterCreateWithField", [
            [b, 0]
        ]);
        return a.sendWithPromise("Action.parameterCreateWithField", {
            action: this.id,
            field: b
        }).then(function(b) {
            return l(a.ActionParameter, b)
        })
    };
    a.Action.prototype.parameterCreateWithAnnot = function(b) {
        d(arguments.length, 1, "parameterCreateWithAnnot", "(PDFNet.Annot)", [
            [b, "Object", a.Annot, "Annot"]
        ]);
        return a.sendWithPromise("Action.parameterCreateWithAnnot", {
            action: this.id,
            annot: b.id
        }).then(function(b) {
            return l(a.ActionParameter,
                b)
        })
    };
    a.Action.prototype.parameterCreateWithPage = function(b) {
        d(arguments.length, 1, "parameterCreateWithPage", "(PDFNet.Page)", [
            [b, "Object", a.Page, "Page"]
        ]);
        return a.sendWithPromise("Action.parameterCreateWithPage", {
            action: this.id,
            page: b.id
        }).then(function(b) {
            return l(a.ActionParameter, b)
        })
    };
    a.ActionParameter.prototype.getAction = function() {
        return a.sendWithPromise("ActionParameter.getAction", {
            ap: this.id
        }).then(function(b) {
            return f(a.Action, b)
        })
    };
    a.ViewChangeCollection.create = function() {
        return a.sendWithPromise("viewChangeCollectionCreate", {}).then(function(b) {
            return l(a.ViewChangeCollection, b)
        })
    };
    a.RadioButtonGroup.createFromField = function(b) {
        d(arguments.length, 1, "createFromField", "(PDFNet.Field)", [
            [b, "Structure", a.Field, "Field"]
        ]);
        n("createFromField", [
            [b, 0]
        ]);
        return a.sendWithPromise("radioButtonGroupCreateFromField", {
            field: b
        }).then(function(b) {
            return l(a.RadioButtonGroup, b)
        })
    };
    a.RadioButtonGroup.create = function(b, c) {
        "undefined" === typeof c && (c = "");
        d(arguments.length, 1, "create", "(PDFNet.PDFDoc, string)", [
            [b, "PDFDoc"],
            [c, "string"]
        ]);
        return a.sendWithPromise("radioButtonGroupCreate", {
            doc: b.id,
            field_name: c
        }).then(function(b) {
            return l(a.RadioButtonGroup, b)
        })
    };
    a.RadioButtonGroup.prototype.copy = function() {
        return a.sendWithPromise("RadioButtonGroup.copy", {
            group: this.id
        }).then(function(b) {
            return l(a.RadioButtonGroup, b)
        })
    };
    a.RadioButtonGroup.prototype.add = function(b, c) {
        "undefined" === typeof c && (c = "");
        d(arguments.length, 1, "add", "(PDFNet.Rect, string)", [
            [b, "Structure", a.Rect, "Rect"],
            [c, "const char* = 0"]
        ]);
        n("add", [
            [b, 0]
        ]);
        return a.sendWithPromise("RadioButtonGroup.add", {
            group: this.id,
            pos: b,
            onstate: c
        }).then(function(b) {
            return f(a.RadioButtonWidget, b)
        })
    };
    a.RadioButtonGroup.prototype.getNumButtons = function() {
        return a.sendWithPromise("RadioButtonGroup.getNumButtons", {
            group: this.id
        })
    };
    a.RadioButtonGroup.prototype.getButton = function(b) {
        d(arguments.length, 1, "getButton", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("RadioButtonGroup.getButton", {
            group: this.id,
            index: b
        }).then(function(b) {
            return f(a.RadioButtonWidget, b)
        })
    };
    a.RadioButtonGroup.prototype.getField = function() {
        return a.sendWithPromise("RadioButtonGroup.getField", {
            group: this.id
        }).then(function(b) {
            return new a.Field(b)
        })
    };
    a.RadioButtonGroup.prototype.addGroupButtonsToPage = function(b) {
        d(arguments.length, 1, "addGroupButtonsToPage", "(PDFNet.Page)", [
            [b, "Object", a.Page, "Page"]
        ]);
        return a.sendWithPromise("RadioButtonGroup.addGroupButtonsToPage", {
            group: this.id,
            page: b.id
        })
    };
    a.PDFTronCustomSecurityHandler.create = function(b) {
        d(arguments.length, 1, "create", "(number)", [
            [b, "number"]
        ]);
        return a.sendWithPromise("pdfTronCustomSecurityHandlerCreate", {
            custom_id: b
        }).then(function(b) {
            return l(a.SecurityHandler,
                b)
        })
    };
    a.PDF2WordModule.isModuleAvailable = function() {
        return a.sendWithPromise("pdF2WordModuleIsModuleAvailable", {})
    };
    a.PDF2HtmlReflowParagraphsModule.isModuleAvailable = function() {
        return a.sendWithPromise("pdF2HtmlReflowParagraphsModuleIsModuleAvailable", {})
    };
    a.AdvancedImagingModule.isModuleAvailable = function() {
        return a.sendWithPromise("advancedImagingModuleIsModuleAvailable", {})
    };
    a.WebFontDownloader.isAvailable = function() {
        return a.sendWithPromise("webFontDownloaderIsAvailable", {})
    };
    a.WebFontDownloader.enableDownloads =
        function() {
            return a.sendWithPromise("webFontDownloaderEnableDownloads", {})
        };
    a.WebFontDownloader.disableDownloads = function() {
        return a.sendWithPromise("webFontDownloaderDisableDownloads", {})
    };
    a.WebFontDownloader.preCacheAsync = function() {
        return a.sendWithPromise("webFontDownloaderPreCacheAsync", {})
    };
    a.WebFontDownloader.clearCache = function() {
        return a.sendWithPromise("webFontDownloaderClearCache", {})
    };
    a.WebFontDownloader.setCustomWebFontURL = function(b) {
        d(arguments.length, 1, "setCustomWebFontURL", "(string)",
            [
                [b, "string"]
            ]);
        return a.sendWithPromise("webFontDownloaderSetCustomWebFontURL", {
            url: b
        })
    };
    a.StructuredOutputModule.isModuleAvailable = function() {
        return a.sendWithPromise("structuredOutputModuleIsModuleAvailable", {})
    };
    var r = function(a, c) {
            c = c || {};
            var b = new XMLHttpRequest;
            return new Promise(function(d, e) {
                b.open("GET", a, !0);
                b.responseType = "arraybuffer";
                c.withCredentials && (b.withCredentials = c.withCredentials);
                b.onerror = function() {
                    e(Error("Network error occurred"))
                };
                b.onload = function(a) {
                    200 == this.status ?
                        (a = new Uint8Array(b.response), d(a)) : e(Error("Download Failed"))
                };
                var f = c.customHeaders;
                if (f)
                    for (var g in f) b.setRequestHeader(g, f[g]);
                b.send()
            }, function() {
                b.abort()
            })
        },
        v = function(a) {
            return 0 === a ? "1st" : 1 === a ? "2nd" : 2 === a ? "3rd" : a + 1 + "th"
        },
        d = function(b, c, d, f, g) {
            maxNum = g.length;
            if (c === maxNum) {
                if (b !== c) throw new RangeError(b + " arguments passed into function '" + d + "'. Expected " + c + " argument. Function Signature: " + d + f);
            } else if (0 >= c) {
                if (b > maxNum) throw new RangeError(b + " arguments passed into function '" + d +
                    "'. Expected at most " + maxNum + " arguments. Function Signature: " + d + f);
            } else if (b < c || b > maxNum) throw new RangeError(b + " arguments passed into function '" + d + "'. Expected " + c + " to " + maxNum + " arguments. Function Signature: " + d + f);
            var e = function(a, b, c) {
                throw new TypeError(v(a) + " input argument in function '" + d + "' is of type '" + b + "'. Expected type '" + c + "'. Function Signature: " + d + f);
            };
            b = function(a, b, c) {
                "object" === typeof a && a.name ? e(b, a.name, c) : e(b, typeof a, c)
            };
            for (c = 0; c < maxNum; c++) {
                var m = g[c],
                    k = m[0],
                    l = m[1];
                if (k instanceof Promise) throw new TypeError(v(c) + " input argument in function '" + d + "' is a Promise object. Promises require a 'yield' statement before being accessed.");
                if ("OptionBase" === l) {
                    if (k)
                        if ("object" === typeof k) {
                            if ("function" !== typeof k.getJsonString) throw new TypeError(v(c) + " input argument in function '" + d + "' is an 'oject' which is expected to have the 'getJsonString' function");
                        } else e(c, k.name, "object")
                } else "Array" === l ? k.constructor !== Array && b(k, c, "Array") : "ArrayBuffer" === l ? h.isArrayBuffer(k) ||
                    h.isArrayBuffer(k.buffer) || b(k, c, "ArrayBuffer|TypedArray") : "ArrayAsBuffer" === l ? k.constructor === Array || h.isArrayBuffer(k) || h.isArrayBuffer(k.buffer) || b(k, c, "ArrayBuffer|TypedArray") : "PDFDoc" === l || "SDFDoc" === l || "FDFDoc" === l ? k instanceof a.PDFDoc || k instanceof a.SDFDoc || k instanceof a.FDFDoc || b(k, c, "PDFDoc|SDFDoc|FDFDoc") : "Structure" === l ? k instanceof m[2] || !k || k.name === m[3] || b(k, c, m[3]) : "OptionObject" === l ? k instanceof m[2] || ("object" === typeof k && k.name ? k.name !== m[4] && e(c, k.name, m[3]) : e(c, typeof k, m[3])) :
                    "Object" === l ? k instanceof m[2] || b(k, c, m[3]) : "const char* = 0" === l ? "string" !== typeof k && null !== k && e(c, typeof k, "string") : typeof k !== l && e(c, typeof k, l)
            }
        },
        k = function(a, c) {
            if ("undefined" !== typeof c) throw Error("Function " + c + " recently altered a struct object without yielding. That object is now being accessed by function '" + a + "'. Perhaps a yield statement is required for " + c + "?");
        },
        n = function(a, c) {
            for (var b = 0; b < c.length; b++) {
                var d = c[b],
                    f = d[0];
                if (f && "undefined" !== typeof f.yieldFunction) throw Error("Function '" +
                    f.yieldFunction + "' recently altered a struct object without yielding. That object is now being accessed by the " + v(d[1]) + " input argument in function '" + a + "'. Perhaps a yield statement is required for '" + f.yieldFunction + "'?");
            }
        },
        u = function(a, c) {
            var b = a;
            c && a.constructor === Array && (b = new Float64Array(a));
            h.isArrayBuffer(b) || (b = b.buffer, a.byteLength < b.byteLength && (b = b.slice(a.byteOffset, a.byteOffset + a.byteLength)));
            return b
        };
    createdObjects = [];
    lockedObjects = [];
    stackCallCounter = beginOperationCounter = 0;
    deallocStackCounter = [];
    unlockStackCounter = [];
    var z;
    h.PDFTron && PDFTron.WebViewer && PDFTron.WebViewer.prototype && PDFTron.WebViewer.prototype.version && !PDFTron.skipPDFNetWebViewerWarning && console.warn("PDFNet.js and WebViewer.js have been included in the same context. See pdftron.com/kb_same_context for an explanation of why this could be an error in your application.");
    var l = function(a, c, d) {
            if ("0" === c) return null;
            a = new a(c, d);
            createdObjects.push({
                name: a.name,
                id: a.id
            });
            return a
        },
        f = function(a, c, d) {
            return "0" ===
                c ? null : new a(c, d)
        },
        y = function(a) {
            for (var b = -1, d = lockedObjects.length - 1; 0 <= d; d--)
                if (lockedObjects[d].id == a.id) {
                    b = d;
                    break
                } if (-1 != b)
                for (lockedObjects.splice(b, 1), d = unlockStackCounter.length - 1; 0 <= d; d--)
                    if (b < unlockStackCounter[d]) --unlockStackCounter[d];
                    else break;
            else console.log("[WARNING], the object to be unlocked was not found in the unlock list. Unlocking may cause errors.")
        },
        t = function(a) {
            for (var b = -1, d = createdObjects.length - 1; 0 <= d; d--)
                if (createdObjects[d].id == a) {
                    b = d;
                    break
                } if (-1 != b)
                for (createdObjects.splice(b,
                        1), d = deallocStackCounter.length - 1; 0 <= d; d--)
                    if (b < deallocStackCounter[d]) --deallocStackCounter[d];
                    else break;
            else console.log("[WARNING], the object was not found in the deallocation list. Deallocating may cause errors.")
        };
    a.messageHandler = {
        sendWithPromiseReturnId: function() {
            throw Error("PDFNet.initialize must be called and finish resolving before any other PDFNetJS function calls.");
        }
    };
    a.userPriority = 2;
    a.sendWithPromise = function(a, c) {
        var b = this.messageHandler,
            d = b.sendWithPromiseReturnId(a, c, this.userPriority);
        b.pdfnetCommandChain = 0 == b.pdfnetActiveCommands.size ? d.promise : b.pdfnetCommandChain.then(function() {
            return d.promise
        });
        b.pdfnetActiveCommands.add(d.callbackId);
        return b.pdfnetCommandChain
    };
    var q = function(a, c) {
        for (var b in a) c[b] = a[b]
    };
    a.runGeneratorWithoutCleanup = function(b, c) {
        return a.runWithoutCleanup(function() {
            return p(b)
        }, c)
    };
    a.runGeneratorWithCleanup = function(b, c) {
        return a.runWithCleanup(function() {
            return p(b)
        }, c)
    };
    var A = Promise.resolve();
    a.displayAllocatedObjects = function() {
        console.log("List of created but not yet deallocated objects:");
        if (0 == createdObjects.length) console.log("~~None~~ (nothing to deallocate)");
        else
            for (var a = 0; a < createdObjects.length; a++) console.log(createdObjects[a]);
        return createdObjects.length
    };
    a.getAllocatedObjectsCount = function() {
        return createdObjects.length
    };
    a.startDeallocateStack = function() {
        stackCallCounter += 1;
        deallocStackCounter.push(createdObjects.length);
        unlockStackCounter.push(lockedObjects.length);
        return Promise.resolve()
    };
    a.endDeallocateStack = function() {
        if (0 === stackCallCounter) return console.log("Warning, no startDeallocateStack() instances remain."),
            Promise.resolve();
        var b = deallocStackCounter.pop(),
            c = unlockStackCounter.pop(),
            d = [],
            f = [];
        var g = 0;
        if ("undefined" !== typeof c && 0 !== lockedObjects.length && lockedObjects.length !== c)
            for (; lockedObjects.length > c;) {
                var h = lockedObjects.pop();
                h = a.sendWithPromise(h.name + "." + h.unlocktype, {
                    doc: h.id
                });
                h = h.catch(function(a) {
                    console.log(a)
                });
                d.push(h);
                g++
            }
        c = 0;
        if ("undefined" !== typeof b && 0 !== createdObjects.length && createdObjects.length !== b)
            for (; createdObjects.length > b;) g = createdObjects.pop(), g = a.sendWithPromise(g.name +
                ".destroy", {
                    auto_dealloc_obj: g.id
                }), g = g.catch(function(a) {
                console.log(a)
            }), f.push(g), c++;
        --stackCallCounter;
        return Promise.all(d).then(function() {
            return Promise.all(f)
        })
    };
    a.getStackCount = function() {
        return Promise.resolve(stackCallCounter)
    };
    a.deallocateAllObjects = function() {
        if (0 == createdObjects.length) {
            console.log("~~None~~ (nothing to deallocate)");
            var b = createPromiseCapability();
            b.resolve();
            return b.promise
        }
        b = [];
        for (deallocStackCounter = []; lockedObjects.length;) objToUnlock = lockedObjects.pop(), unlockPromise =
            a.sendWithPromise(objToUnlock.name + "." + objToUnlock.unlocktype, {
                doc: objToUnlock.id
            }), unlockPromise = unlockPromise.catch(function(a) {
                console.log(a)
            }), b.push(unlockPromise);
        for (; createdObjects.length;) {
            var c = createdObjects.pop();
            c = a.sendWithPromise(c.name + ".destroy", {
                auto_dealloc_obj: c.id
            });
            c = c.catch(function(a) {
                console.log(a)
            });
            b.push(c)
        }
        return Promise.all(b)
    };
    a.Redactor.redact = function(b, c, d, f, g) {
        "undefined" === typeof d && (d = {});
        "undefined" === typeof d.redaction_overlay && (d.redaction_overlay = !0);
        "undefined" ===
        typeof d.positive_overlay_color ? d.positive_overlay_color = void 0 : "undefined" !== typeof d.positive_overlay_color.id && (d.positive_overlay_color = d.positive_overlay_color.id);
        "undefined" === typeof d.negative_overlay_color ? d.negative_overlay_color = void 0 : "undefined" !== typeof d.negative_overlay_color.id && (d.negative_overlay_color = d.negative_overlay_color.id);
        "undefined" === typeof d.border && (d.border = !0);
        "undefined" === typeof d.use_overlay_text && (d.use_overlay_text = !0);
        "undefined" === typeof d.font ? d.font = void 0 :
            "undefined" !== typeof d.font.id && (d.font = d.font.id);
        "undefined" === typeof d.min_font_size && (d.min_font_size = 2);
        "undefined" === typeof d.max_font_size && (d.max_font_size = 24);
        "undefined" === typeof d.text_color ? d.text_color = void 0 : "undefined" !== typeof d.text_color.id && (d.text_color = d.text_color.id);
        "undefined" === typeof d.horiz_text_alignment && (d.horiz_text_alignment = -1);
        "undefined" === typeof d.vert_text_alignment && (d.vert_text_alignment = 1);
        "undefined" === typeof d.show_redacted_content_regions && (d.show_redacted_content_regions = !1);
        "undefined" === typeof d.redacted_content_color ? d.redacted_content_color = void 0 : "undefined" !== typeof d.redacted_content_color.id && (d.redacted_content_color = d.redacted_content_color.id);
        "undefined" === typeof f && (f = !0);
        "undefined" === typeof g && (g = !0);
        if (2 > arguments.length || 5 < arguments.length) throw new RangeError(arguments.length + " arguments passed into function 'redact'. Expected 2 to 5 arguments. Function Signature: redact(PDFDoc, Array of Redaction Objects, Object, boolean=true, boolean=true)");
        if (b instanceof Promise) throw new TypeError("Received a Promise object in 1st input argument of function 'redact'. Promises require a 'yield' statement before being accessed.");
        if (!(b instanceof a.PDFDoc || b instanceof a.SDFDoc || b instanceof a.FDFDoc)) {
            if ("object" == typeof b) throw new TypeError("1st input argument in function 'redact' is of type '" + b.name + "'. Expected type 'PDFDoc'. Function Signature: redact(PDFDoc, Array of Redaction Objects, Object, boolean=true, boolean=true).");
            throw new TypeError("1st input argument '" +
                b + "' in function 'redact' is of type '" + typeof b + "'. Expected type 'PDFDoc'. Function Signature: redact(PDFDoc, Array of Redaction Objects, Object, boolean=true, boolean=true).");
        }
        if (c instanceof Promise) throw new TypeError("Received a Promise object in 2nd input argument in function 'redact'. Promises require a 'yield' statement before being accessed.");
        if (!(c instanceof Array)) {
            if ("object" == typeof c) throw new TypeError("2nd input argument in function 'redact' is of type '" + c.name + "'. Expected an array of 'Redaction' objects. Function Signature: redact(PDFDoc, Array of Redaction Objects, Object, boolean, boolean).");
            throw new TypeError("2nd input argument '" + c + "' in function 'redact' is of type '" + typeof c + "'. Expected type 'Redaction'. Function Signature: redact(PDFDoc, Array of Redaction Objects, Object, boolean, boolean).");
        }
        if (d instanceof Promise) throw new TypeError("Received a Promise object in 3rd input argument in function 'redact'. Promises require a 'yield' statement before being accessed.");
        if ("object" !== typeof d) throw new TypeError("3nd input argument in function 'redact' is of type '" + d.name + "'. Expected a javascript object. Function Signature: redact(PDFDoc, Array of Redaction Objects, Object, boolean, boolean).");
        if (f instanceof Promise) throw new TypeError("Received a Promise object in 4th input argument in function 'redact'. Promises require a 'yield' statement before being accessed.");
        if ("boolean" != typeof f) throw new TypeError("4th input argument '" + f + "' in function 'redact' is of type '" + typeof f + "'. Expected type 'boolean'. Function Signature: redact(PDFDoc, Array of Redaction Objects, Object, boolean=true, boolean=true).");
        if (g instanceof Promise) throw new TypeError("Received a Promise object in 5th input argument in function 'redact'. Promises require a 'yield' statement before being accessed.");
        if ("boolean" != typeof g) throw new TypeError("5th input argument '" + g + "' in function 'redact' is of type '" + typeof g + "'. Expected type 'boolean'. Function Signature: redact(PDFDoc, Array of Redaction Objects, Object, boolean=true, boolean=true).");
        return a.sendWithPromise("redactorRedact", {
            doc: b.id,
            red_arr: c,
            appearance: d,
            ext_neg_mode: f,
            page_coord_sys: g
        })
    };
    a.Highlights.prototype.getCurrentQuads = function() {
        return a.sendWithPromise("Highlights.getCurrentQuads", {
            hlts: this.id
        }).then(function(b) {
            b = new Float64Array(b);
            for (var c = [], d, f = 0; f < b.length; f += 8) d = a.QuadPoint(b[f + 0], b[f + 1], b[f + 2], b[f + 3], b[f + 4], b[f + 5], b[f + 6], b[f + 7]), c.push(d);
            return c
        })
    };
    a.TextSearch.prototype.run = function() {
        if (0 != arguments.length) throw new RangeError(arguments.length + " arguments passed into function 'run'. Expected 0 arguments. Function Signature: run()");
        return a.sendWithPromise("TextSearch.run", {
            ts: this.id
        }).then(function(b) {
            b.highlights = new a.Highlights(b.highlights);
            if ("0" == b.highlights.id) return b;
            createdObjects.push({
                name: b.highlights.name,
                id: b.highlights.id
            });
            return b
        })
    };
    a.Iterator.prototype.current = function() {
        if (0 != arguments.length) throw new RangeError(arguments.length + " arguments passed into function 'fillEncryptDict'. Expected 0 argument.");
        var b = this;
        this.yieldFunction = "Iterator.current";
        var c = a.sendWithPromise("Iterator.current", {
            itr: this.id,
            type: this.type
        });
        b.yieldFunction = void 0;
        "Int" != this.type && (c = c.then(function(c) {
            return new a[b.type](c)
        }));
        return c
    };
    a.PDFDoc.prototype.getFileData = function(a) {
        a({
            type: "id",
            id: this.id
        })
    };
    a.PDFDoc.prototype.getFile = function(a) {
        return null
    };
    a.PDFDoc.createFromURL = function(b, c) {
        if (1 > arguments.length || 2 < arguments.length) throw new RangeError(arguments.length + " arguments passed into function 'createFromURL'. Expected 1 to 2 arguments. Function Signature: createFromURL(string, Obj)");
        if (b instanceof Promise) throw new TypeError("Received a Promise object in 1st input argument 'createFromURL'. Promises require a 'yield' statement before being accessed.");
        if ("string" != typeof b) throw new TypeError("1st input argument '" +
            b + "' in function 'createFromURL' is of type '" + typeof b + "'. Expected type 'string'. Function Signature: createFromURL(string).");
        return r(b, c).then(function(b) {
            return a.PDFDoc.createFromBuffer(b)
        })
    };
    a.PDFDraw.prototype.exportBuffer = function(b, c, d) {
        "undefined" == typeof c && (c = "PNG");
        "undefined" == typeof d && (d = new a.Obj("0"));
        if (1 > arguments.length || 3 < arguments.length) throw new RangeError(arguments.length + " arguments passed into function 'exportBuffer'. Expected 1 to 3 arguments. Function Signature: exportBuffer(Page, string, Obj)");
        if (b instanceof Promise) throw new TypeError("Received a Promise object in 1st input argument 'exportBuffer'. Promises require a 'yield' statement before being accessed.");
        if (!(b instanceof a.Page)) {
            if ("object" == typeof b) throw new TypeError("1st input argument in function 'exportBuffer' is of type '" + b.name + "'. Expected type 'Page'. Function Signature: exportBuffer(Page, string, Obj).");
            throw new TypeError("1st input argument '" + b + "' in function 'exportBuffer' is of type '" + typeof b + "'. Expected type 'Page'. Function Signature: exportBuffer(Page, string, Obj).");
        }
        if (c instanceof Promise) throw new TypeError("Received a Promise object in 1st input argument 'exportBuffer'. Promises require a 'yield' statement before being accessed.");
        if ("string" != typeof c) throw new TypeError("2nd input argument '" + c + "' in function 'exportBuffer' is of type '" + typeof c + "'. Expected type 'string'. Function Signature: exportBuffer(Page, string, Obj).");
        if (d instanceof Promise) throw new TypeError("Received a Promise object in 1st input argument 'exportBuffer'. Promises require a 'yield' statement before being accessed.");
        if (!(d instanceof a.Obj)) {
            if ("object" == typeof d) throw new TypeError("3rd input argument in function 'exportBuffer' is of type '" + d.name + "'. Expected type 'Obj'. Function Signature: exportBuffer(Page, string, Obj).");
            throw new TypeError("3rd input argument '" + d + "' in function 'exportBuffer' is of type '" + typeof d + "'. Expected type 'Obj'. Function Signature: exportBuffer(Page, string, Obj).");
        }
        return a.sendWithPromise("PDFDraw.exportBuffer", {
            d: this.id,
            page: b.id,
            format: c,
            encoder_params: d.id
        }).then(function(a) {
            return "0" ==
                a ? null : new Uint8Array(a)
        })
    };
    a.PDFDraw.prototype.exportStream = a.PDFDraw.prototype.exportBuffer;
    a.Element.prototype.getTextData = function() {
        if (0 != arguments.length) throw new RangeError(arguments.length + " arguments passed into function 'getTextData'. Expected 0 arguments. Function Signature: getTextData()");
        return a.sendWithPromise("Element.getTextData", {
            e: this.id
        })
    };
    a.Element.prototype.getPathData = function() {
        if (0 != arguments.length) throw new RangeError(arguments.length + " arguments passed into function 'getPathData'. Expected 0 arguments. Function Signature: getPathData()");
        return a.sendWithPromise("Element.getPathData", {
            e: this.id
        }).then(function(a) {
            a.operators = new Uint8Array(a.operators);
            a.points = new Float64Array(a.points);
            return a
        })
    };
    a.PDFDoc.prototype.convertToXod = function(b) {
        "undefined" === typeof b && (b = {});
        return a.sendWithPromise("PDFDoc.convertToXod", {
            doc: this.id,
            optionsObject: b
        }).then(function(a) {
            return "0" == a ? null : new Uint8Array(a)
        })
    };
    a.PDFDoc.prototype.convertToXodStream = function(b) {
        "undefined" === typeof b && (b = {});
        return a.sendWithPromise("PDFDoc.convertToXodStream", {
            doc: this.id,
            optionsObject: b
        }).then(function(b) {
            return "0" == b ? null : new a.Filter(b)
        })
    };
    a.FilterReader.prototype.read = function(b) {
        if (1 != arguments.length) throw new RangeError(arguments.length + " arguments passed into function 'read'. Expected 1 argument. Function Signature: read(number).");
        if (b instanceof Promise) throw new TypeError("Received a Promise object in 1st input argument 'read'. Promises require a 'yield' statement before being accessed.");
        if ("number" != typeof b) throw new TypeError("1st input argument '" +
            b + "' in function 'read' is of type '" + typeof b + "'. Expected type 'number'. Function Signature: read(number).");
        return a.sendWithPromise("FilterReader.read", {
            reader: this.id,
            buf_size: b
        }).then(function(a) {
            return "0" == a ? null : new Uint8Array(a)
        })
    };
    a.FilterReader.prototype.readAllIntoBuffer = function() {
        if (0 != arguments.length) throw new RangeError(arguments.length + " arguments passed into function 'readAllIntoBuffer'. Expected 0 arguments. Function Signature: readAllIntoBuffer()");
        return a.sendWithPromise("FilterReader.readAllIntoBuffer", {
            reader: this.id
        }).then(function(a) {
            return "0" == a ? null : new Uint8Array(a)
        })
    };
    a.bitmapInfo = function(a) {
        q(a, this)
    };
    a.PDFDraw.prototype.getBitmap = function(b, c, d) {
        if (3 != arguments.length) throw new RangeError(arguments.length + " arguments passed into function 'getBitmap'. Expected 3 arguments. Function Signature: getBitmap(Page, PixelFormat, boolean).");
        if (b instanceof Promise) throw new TypeError("Received a Promise object in 1st input argument 'getBitmap'. Promises require a 'yield' statement before being accessed.");
        if (!(b instanceof a.Page)) {
            if ("object" == typeof b) throw new TypeError("1st input argument in function 'getBitmap' is of type '" + b.name + "'. Expected type 'Page'. Function Signature: getBitmap(Page, PixelFormat, boolean).");
            throw new TypeError("1st input argument '" + b + "' in function 'getBitmap' is of type '" + typeof b + "'. Expected type 'Page'. Function Signature: getBitmap(Page, PixelFormat, boolean).");
        }
        if (c instanceof Promise) throw new TypeError("Received a Promise object in 1st input argument 'getBitmap'. Promises require a 'yield' statement before being accessed.");
        if ("number" != typeof c) throw new TypeError("2nd input argument '" + c + "' in function 'getBitmap' is of type '" + typeof c + "'. Expected type 'number'. Function Signature: getBitmap(Page, PixelFormat, boolean).");
        if (d instanceof Promise) throw new TypeError("Received a Promise object in 1st input argument 'getBitmap'. Promises require a 'yield' statement before being accessed.");
        if ("boolean" != typeof d) throw new TypeError("3rd input argument '" + d + "' in function 'getBitmap' is of type '" + typeof d + "'. Expected type 'boolean'. Function Signature: getBitmap(Page, PixelFormat, boolean).");
        return a.sendWithPromise("PDFDraw.getBitmap", {
            d: this.id,
            page: b.id,
            pix_fmt: c,
            demult: d
        }).then(function(b) {
            return "0" == b ? null : new a.bitmapInfo(b)
        })
    };
    a.Matrix2D.create = function(b, c, d, f, g, h) {
        void 0 == b && (b = 0);
        void 0 == c && (c = 0);
        void 0 == d && (d = 0);
        void 0 == f && (f = 0);
        void 0 == g && (g = 0);
        void 0 == h && (h = 0);
        if (6 < arguments.length) throw new RangeError(arguments.length + " arguments passed into function 'Matrix2D.create'. Expected 6 or fewer arguments. Function Signature: create(number, number, number, number, number, number).");
        if (b instanceof Promise) throw new TypeError("Received a Promise object in 1st input argument 'Matrix2D.create'. Promises require a 'yield' statement before being accessed.");
        if ("number" != typeof b) throw new TypeError("1st input argument '" + b + "' in function 'Matrix2D.create' is of type '" + typeof b + "'. Expected type 'number'. Function Signature: create(number, number, number, number, number, number).");
        if (c instanceof Promise) throw new TypeError("Received a Promise object in 2nd input argument 'Matrix2D.create'. Promises require a 'yield' statement before being accessed.");
        if ("number" != typeof c) throw new TypeError("2nd input argument '" + c + "' in function 'Matrix2D.create' is of type '" + typeof c + "'. Expected type 'number'. Function Signature: create(number, number, number, number, number, number).");
        if (d instanceof Promise) throw new TypeError("Received a Promise object in 3rd input argument 'Matrix2D.create'. Promises require a 'yield' statement before being accessed.");
        if ("number" != typeof d) throw new TypeError("3rd input argument '" + d + "' in function 'Matrix2D.create' is of type '" +
            typeof d + "'. Expected type 'number'. Function Signature: create(number, number, number, number, number, number).");
        if (f instanceof Promise) throw new TypeError("Received a Promise object in 4th input argument 'Matrix2D.create'. Promises require a 'yield' statement before being accessed.");
        if ("number" != typeof f) throw new TypeError("4th input argument '" + f + "' in function 'Matrix2D.create' is of type '" + typeof f + "'. Expected type 'number'. Function Signature: create(number, number, number, number, number, number).");
        if (g instanceof Promise) throw new TypeError("Received a Promise object in 5th input argument 'Matrix2D.create'. Promises require a 'yield' statement before being accessed.");
        if ("number" != typeof g) throw new TypeError("5th input argument '" + g + "' in function 'Matrix2D.create' is of type '" + typeof g + "'. Expected type 'number'. Function Signature: create(number, number, number, number, number, number).");
        if (h instanceof Promise) throw new TypeError("Received a Promise object in 6th input argument 'Matrix2D.create'. Promises require a 'yield' statement before being accessed.");
        if ("number" != typeof h) throw new TypeError("6th input argument '" + h + "' in function 'Matrix2D.create' is of type '" + typeof h + "'. Expected type 'number'. Function Signature: create(number, number, number, number, number, number).");
        var e = createPromiseCapability(),
            m = new a.Matrix2D({
                m_a: b,
                m_b: c,
                m_c: d,
                m_d: f,
                m_h: g,
                m_v: h
            });
        e.resolve(m);
        return e.promise
    };
    a.PDFDoc.prototype.getPDFDoc = function() {
        return a.sendWithPromise("GetPDFDoc", {
            doc: this.id
        }).then(function(b) {
            return "0" == b ? null : new a.PDFDoc(b)
        })
    };
    a.TextExtractorLine.prototype.getBBox =
        function() {
            if (0 != arguments.length) throw new RangeError(arguments.length + " arguments passed into function 'getBBox'. Expected 0 arguments. Function Signature: getBBox()");
            if ("undefined" !== typeof this.yieldFunction) throw Error("Function " + this.yieldFunction + " recently altered a struct object without yielding. That object is now being accessed by function 'getBBox'. Perhaps a yield statement is required for " + this.yieldFunction + "?");
            var b = this;
            this.yieldFunction = "TextExtractorLine.getBBox";
            return a.sendWithPromise("TextExtractorLine.getBBox", {
                line: this
            }).then(function(c) {
                b.yieldFunction = void 0;
                return new a.Rect(c.result.x1, c.result.y1, c.result.x2, c.result.y2, c.result.mp_rect)
            })
        };
    a.TextExtractorLine.prototype.getQuad = function() {
        if (0 != arguments.length) throw new RangeError(arguments.length + " arguments passed into function 'getQuad'. Expected 0 arguments. Function Signature: getQuad()");
        if ("undefined" !== typeof this.yieldFunction) throw Error("Function " + this.yieldFunction + " recently altered a struct object without yielding. That object is now being accessed by function 'getQuad'. Perhaps a yield statement is required for " +
            this.yieldFunction + "?");
        var b = this;
        this.yieldFunction = "TextExtractorLine.getQuad";
        return a.sendWithPromise("TextExtractorLine.getQuad", {
            line: this
        }).then(function(c) {
            b.yieldFunction = void 0;
            return new a.QuadPoint(c.result.p1x, c.result.p1y, c.result.p2x, c.result.p2y, c.result.p3x, c.result.p3y, c.result.p4x, c.result.p4y)
        })
    };
    a.TextExtractorWord.prototype.getBBox = function() {
        if (0 != arguments.length) throw new RangeError(arguments.length + " arguments passed into function 'getBBox'. Expected 0 arguments. Function Signature: getBBox()");
        if ("undefined" !== typeof this.yieldFunction) throw Error("Function " + this.yieldFunction + " recently altered a struct object without yielding. That object is now being accessed by function 'getBBox'. Perhaps a yield statement is required for " + this.yieldFunction + "?");
        var b = this;
        this.yieldFunction = "TextExtractorWord.getBBox";
        return a.sendWithPromise("TextExtractorWord.getBBox", {
            tew: this
        }).then(function(c) {
            b.yieldFunction = void 0;
            return new a.Rect(c.result.x1, c.result.y1, c.result.x2, c.result.y2, c.result.mp_rect)
        })
    };
    a.TextExtractorWord.prototype.getQuad = function() {
        if (0 != arguments.length) throw new RangeError(arguments.length + " arguments passed into function 'getQuad'. Expected 0 arguments. Function Signature: getQuad()");
        if ("undefined" !== typeof this.yieldFunction) throw Error("Function " + this.yieldFunction + " recently altered a struct object without yielding. That object is now being accessed by function 'getQuad'. Perhaps a yield statement is required for " + this.yieldFunction + "?");
        var b = this;
        this.yieldFunction =
            "TextExtractorWord.getQuad";
        return a.sendWithPromise("TextExtractorWord.getQuad", {
            tew: this
        }).then(function(c) {
            b.yieldFunction = void 0;
            return new a.QuadPoint(c.result.p1x, c.result.p1y, c.result.p2x, c.result.p2y, c.result.p3x, c.result.p3y, c.result.p4x, c.result.p4y)
        })
    };
    a.TextExtractorWord.prototype.getGlyphQuad = function(b) {
        if (1 != arguments.length) throw new RangeError(arguments.length + " arguments passed into function 'getGlyphQuad'. Expected 1 argument. Function Signature: getGlyphQuad(number)");
        if (b instanceof Promise) throw new TypeError("Received a Promise object in 1st input argument 'getGlyphQuad'. Promises require a 'yield' statement before being accessed.");
        if ("number" != typeof b) throw new TypeError("1st input argument '" + b + "' in function 'getGlyphQuad' is of type '" + typeof b + "'. Expected type 'number'. Function Signature: getGlyphQuad(number).");
        if ("undefined" !== typeof this.yieldFunction) throw Error("Function " + this.yieldFunction + " recently altered a struct object without yielding. That object is now being accessed by function 'getGlyphQuad'. Perhaps a yield statement is required for " +
            this.yieldFunction + "?");
        var c = this;
        this.yieldFunction = "TextExtractorWord.getGlyphQuad";
        return a.sendWithPromise("TextExtractorWord.getGlyphQuad", {
            tew: this,
            glyph_idx: b
        }).then(function(b) {
            c.yieldFunction = void 0;
            return new a.QuadPoint(b.result.p1x, b.result.p1y, b.result.p2x, b.result.p2y, b.result.p3x, b.result.p3y, b.result.p4x, b.result.p4y)
        })
    };
    a.TextExtractorStyle.prototype.getColor = function() {
        if (0 != arguments.length) throw new RangeError(arguments.length + " arguments passed into function 'getColor'. Expected 0 arguments. Function Signature: getColor()");
        if ("undefined" !== typeof this.yieldFunction) throw Error("Function " + this.yieldFunction + " recently altered a struct object without yielding. That object is now being accessed by function 'getColor'. Perhaps a yield statement is required for " + this.yieldFunction + "?");
        var b = this;
        this.yieldFunction = "TextExtractorStyle.getColor";
        return a.sendWithPromise("TextExtractorStyle.getColor", {
            tes: this
        }).then(function(c) {
            b.yieldFunction = void 0;
            return "0" == c ? null : new a.ColorPt(c)
        })
    };
    a.TextExtractorWord.prototype.getString =
        function() {
            if (0 != arguments.length) throw new RangeError(arguments.length + " arguments passed into function 'getString'. Expected 0 arguments. Function Signature: getString()");
            if ("undefined" !== typeof this.yieldFunction) throw Error("Function " + this.yieldFunction + " recently altered a struct object without yielding. That object is now being accessed by function 'getString'. Perhaps a yield statement is required for " + this.yieldFunction + "?");
            var b = this;
            this.yieldFunction = "TextExtractorWord.getString";
            return a.sendWithPromise("TextExtractorWord.getString", {
                tew: this
            }).then(function(a) {
                b.yieldFunction = void 0;
                return a
            })
        };
    a.TextExtractor.prototype.getHighlights = function(b) {
        d(arguments.length, 1, "getHighlights", "(Array<object>)", [
            [b, "Array"]
        ]);
        return a.sendWithPromise("TextExtractor.getHighlights", {
            te: this.id,
            char_ranges: b
        }).then(function(b) {
            return "0" == b ? null : new a.Highlights(b)
        })
    };
    a.SecurityHandler.prototype.changeUserPasswordNonAscii = function(b) {
        if (1 != arguments.length) throw new RangeError(arguments.length + " arguments passed into function 'changeUserPasswordNonAscii'. Expected 1 argument. Function Signature: changeUserPasswordNonAscii(string)");
        if (b instanceof Promise) throw new TypeError("Received a Promise object in 1st input argument 'changeUserPasswordNonAscii'. Promises require a 'yield' statement before being accessed.");
        if ("string" != typeof b) throw new TypeError("1st input argument '" + b + "' in function 'changeUserPasswordNonAscii' is of type '" + typeof b + "'. Expected type 'string'. Function Signature: changeUserPasswordNonAscii(string).");
        return a.sendWithPromise("SecurityHandler.changeUserPasswordNonAscii", {
            sh: this.id,
            password: b,
            pwd_length: b.length
        })
    };
    a.SecurityHandler.prototype.changeMasterPasswordNonAscii = function(b) {
        if (1 != arguments.length) throw new RangeError(arguments.length + " arguments passed into function 'changeMasterPasswordNonAscii'. Expected 1 argument. Function Signature: changeMasterPasswordNonAscii(string)");
        if (b instanceof Promise) throw new TypeError("Received a Promise object in 1st input argument 'changeMasterPasswordNonAscii'. Promises require a 'yield' statement before being accessed.");
        if ("string" != typeof b) throw new TypeError("1st input argument '" +
            b + "' in function 'changeMasterPasswordNonAscii' is of type '" + typeof b + "'. Expected type 'string'. Function Signature: changeMasterPasswordNonAscii(string).");
        return a.sendWithPromise("SecurityHandler.changeMasterPasswordNonAscii", {
            sh: this.id,
            password: b,
            pwd_length: b.length
        })
    };
    a.SecurityHandler.prototype.initPassword = function(b) {
        if (1 != arguments.length) throw new RangeError(arguments.length + " arguments passed into function 'initPassword'. Expected 1 argument. Function Signature: initPassword(string)");
        if (b instanceof Promise) throw new TypeError("Received a Promise object in 1st input argument 'initPassword'. Promises require a 'yield' statement before being accessed.");
        if ("string" != typeof b) throw new TypeError("1st input argument '" + b + "' in function 'initPassword' is of type '" + typeof b + "'. Expected type 'string'. Function Signature: initPassword(string).");
        return a.sendWithPromise("SecurityHandler.initPassword", {
            sh: this.id,
            password: b
        })
    };
    a.SecurityHandler.prototype.initPasswordNonAscii = function(b) {
        if (1 !=
            arguments.length) throw new RangeError(arguments.length + " arguments passed into function 'initPasswordNonAscii'. Expected 1 argument. Function Signature: initPasswordNonAscii(string)");
        if (b instanceof Promise) throw new TypeError("Received a Promise object in 1st input argument 'initPasswordNonAscii'. Promises require a 'yield' statement before being accessed.");
        if ("string" != typeof b) throw new TypeError("1st input argument '" + b + "' in function 'initPasswordNonAscii' is of type '" + typeof b + "'. Expected type 'string'. Function Signature: initPasswordNonAscii(string).");
        return a.sendWithPromise("SecurityHandler.initPasswordNonAscii", {
            sh: this.id,
            password: b,
            pwd_length: b.length
        })
    };
    a.Element.prototype.getBBox = function() {
        if (0 != arguments.length) throw new RangeError(arguments.length + " arguments passed into function 'getBBox'. Expected 0 arguments. Function Signature: getBBox()");
        var b = this;
        this.yieldFunction = "Element.getBBox";
        return a.sendWithPromise("Element.getBBox", {
            e: this.id
        }).then(function(c) {
            b.yieldFunction = void 0;
            return new a.Rect(c)
        })
    };
    a.Matrix2D.prototype.mult =
        function(b, c) {
            if (2 != arguments.length) throw new RangeError(arguments.length + " arguments passed into function 'mult'. Expected 2 arguments. Function Signature: mult(number, number)");
            if (b instanceof Promise) throw new TypeError("1st input argument in function 'mult' is a Promise object. Promises require a 'yield' statement before being accessed.");
            if ("number" != typeof b) throw new TypeError("1st input argument '" + b + "' in function 'mult' is of type '" + typeof b + "'. Expected type 'number'. Function Signature: mult(number, number).");
            if (c instanceof Promise) throw new TypeError("2nd input argument in function 'mult' is a Promise object. Promises require a 'yield' statement before being accessed.");
            if ("number" != typeof c) throw new TypeError("2nd input argument '" + c + "' in function 'mult' is of type '" + typeof c + "'. Expected type 'number'. Function Signature: mult(number, number).");
            if ("undefined" !== typeof this.yieldFunction) throw Error("Function " + this.yieldFunction + " recently altered a struct object without yielding. That object is now being accessed by function 'mult'. Perhaps a yield statement is required for " +
                this.yieldFunction + "?");
            return a.sendWithPromise("Matrix2D.mult", {
                matrix: this,
                x: b,
                y: c
            })
        };
    a.Obj.prototype.getAsPDFText = function() {
        if (0 != arguments.length) throw new RangeError(arguments.length + " arguments passed into function 'getAsPDFText'. Expected 0 arguments. Function Signature: getAsPDFText()");
        return a.sendWithPromise("Obj.getAsPDFText", {
            o: this.id
        })
    };
    a.PDFDoc.prototype.initSecurityHandler = function(b) {
        "undefined" === typeof b && (b = 0);
        if (1 < arguments.length) throw new RangeError(arguments.length + " arguments passed into function 'initSecurityHandler'. Expected at most 1 arguments. Function Signature: initSecurityHandler(void*)");
        return a.sendWithPromise("PDFDoc.initSecurityHandler", {
            doc: this.id,
            custom_data: b
        })
    };
    a.PDFDoc.prototype.initStdSecurityHandler = a.PDFDoc.prototype.initStdSecurityHandlerUString;
    a.SDFDoc.prototype.initSecurityHandler = function(b) {
        "undefined" === typeof b && (b = 0);
        if (1 < arguments.length) throw new RangeError(arguments.length + " arguments passed into function 'initSecurityHandler'. Expected at most 1 arguments. Function Signature: initSecurityHandler(void*)");
        return a.sendWithPromise("SDFDoc.initSecurityHandler", {
            doc: this.id,
            custom_data: b
        })
    };
    a.SDFDoc.prototype.initStdSecurityHandler = a.SDFDoc.prototype.initStdSecurityHandlerUString;
    a.Image.createFromURL = function(b, c, d, f) {
        "undefined" === typeof d && (d = new a.Obj("0"));
        if (2 > arguments.length || 4 < arguments.length) throw new RangeError(arguments.length + " arguments passed into function 'createFromURL'. Expected 2 to 4 arguments. Function Signature: createFromURL(PDFDoc, string, Obj)");
        if (b instanceof Promise) throw new TypeError("Received a Promise object in 1st input argument 'createFromURL'. Promises require a 'yield' statement before being accessed.");
        if (!(b instanceof a.PDFDoc || b instanceof a.SDFDoc || b instanceof a.FDFDoc)) {
            if ("object" == typeof b) throw new TypeError("1st input argument in function 'createFromURL' is of type '" + b.name + "'. Expected type 'Page'. Function Signature: createFromURL(PDFDoc, string, Obj).");
            throw new TypeError("1st input argument '" + b + "' in function 'createFromURL' is of type '" + typeof b + "'. Expected type 'Page'. Function Signature: createFromURL(PDFDoc, string, Obj).");
        }
        if (c instanceof Promise) throw new TypeError("Received a Promise object in 1st input argument 'createFromURL'. Promises require a 'yield' statement before being accessed.");
        if ("string" != typeof c) throw new TypeError("2nd input argument '" + c + "' in function 'createFromURL' is of type '" + typeof c + "'. Expected type 'string'. Function Signature: createFromURL(PDFDoc, string, Obj).");
        if (d instanceof Promise) throw new TypeError("Received a Promise object in 1st input argument 'createFromURL'. Promises require a 'yield' statement before being accessed.");
        if (!(d instanceof a.Obj)) {
            if ("object" == typeof d) throw new TypeError("3rd input argument in function 'createFromURL' is of type '" +
                d.name + "'. Expected type 'Obj'. Function Signature: createFromURL(PDFDoc, string, Obj).");
            throw new TypeError("3rd input argument '" + d + "' in function 'createFromURL' is of type '" + typeof d + "'. Expected type 'Obj'. Function Signature: createFromURL(PDFDoc, string, Obj).");
        }
        return r(c, f).then(function(c) {
            return a.Image.createFromMemory2(b, c, d)
        })
    };
    a.PDFDoc.prototype.addStdSignatureHandlerFromURL = function(a, c) {
        if (2 != arguments.length) throw new RangeError(arguments.length + " arguments passed into function 'addStdSignatureHandlerFromURL'. Expected 2 arguments. Function Signature: addStdSignatureHandlerFromURL(string, string)");
        if (a instanceof Promise) throw new TypeError("1st input argument in function 'addStdSignatureHandlerFromURL' is a Promise object. Promises require a 'yield' statement before being accessed.");
        if ("string" != typeof a) throw new TypeError("1st input argument '" + a + "' in function 'addStdSignatureHandlerFromURL' is of type '" + typeof a + "'. Expected type 'string'. Function Signature: addStdSignatureHandlerFromURL(string, string).");
        if (c instanceof Promise) throw new TypeError("2nd input argument in function 'addStdSignatureHandlerFromURL' is a Promise object. Promises require a 'yield' statement before being accessed.");
        if ("string" != typeof c) throw new TypeError("2nd input argument '" + c + "' in function 'addStdSignatureHandlerFromURL' is of type '" + typeof c + "'. Expected type 'string'. Function Signature: addStdSignatureHandlerFromURL(string, string).");
        var b = this;
        return r(a).then(function(a) {
            return b.addStdSignatureHandlerFromBufferWithDoc(a, c, b)
        })
    };
    a.PDFDoc.prototype.addStdSignatureHandlerFromBufferWithDoc = function(b, c, d) {
        if (3 != arguments.length) throw new RangeError(arguments.length + " arguments passed into function 'addStdSignatureHandlerFromBuffer'. Expected 3 arguments. Function Signature: addStdSignatureHandlerFromBuffer(ArrayBuffer, string, PDFDoc)");
        if (d instanceof Promise) throw new TypeError("1st input argument in function 'addStdSignatureHandlerFromBuffer' is a Promise object. Promises require a 'yield' statement before being accessed.");
        if (b instanceof Promise) throw new TypeError("2nd input argument in function 'addStdSignatureHandlerFromBuffer' is a Promise object. Promises require a 'yield' statement before being accessed.");
        if (!h.isArrayBuffer(b.buffer)) {
            if ("object" == typeof b) throw new TypeError("2nd input argument in function 'addStdSignatureHandlerFromBuffer' is of type '" +
                b.name + "'. Expected type 'ArrayBuffer'. Function Signature: addStdSignatureHandlerFromBuffer(ArrayBuffer, string, PDFDoc).");
            throw new TypeError("2nd input argument '" + b + "' in function 'addStdSignatureHandlerFromBuffer' is of type '" + typeof b + "'. Expected type 'ArrayBuffer'. Function Signature: addStdSignatureHandlerFromBuffer(ArrayBuffer, string, PDFDoc).");
        }
        if (c instanceof Promise) throw new TypeError("3rd input argument in function 'addStdSignatureHandlerFromBuffer' is a Promise object. Promises require a 'yield' statement before being accessed.");
        if ("string" != typeof c) throw new TypeError("3rd input argument '" + c + "' in function 'addStdSignatureHandlerFromBuffer' is of type '" + typeof c + "'. Expected type 'string'. Function Signature: addStdSignatureHandlerFromBuffer(ArrayBuffer, string, PDFDoc).");
        return a.sendWithPromise("PDFDoc.addStdSignatureHandlerFromBuffer", {
            doc: d.id,
            pkcs12_buffer: b.buffer,
            pkcs12_pass: c
        })
    };
    a.Filter.createFromMemory = function(b) {
        h.isArrayBuffer(b) || (b = b.buffer);
        return a.sendWithPromise("filterCreateFromMemory", {
            buf: b
        }).then(function(b) {
            if ("0" ==
                b) return null;
            b = new a.Filter(b);
            createdObjects.push({
                name: b.name,
                id: b.id
            });
            return b
        })
    };
    a.Filter.createURLFilter = function(b, c) {
        if (1 > arguments.length || 2 < arguments.length) throw new RangeError(arguments.length + " arguments passed into function 'createURLFilter'. Expected 1 to 2 arguments. Function Signature: createURLFilter(string, Obj)");
        if (b instanceof Promise) throw new TypeError("Received a Promise object in 1st input argument 'createURLFilter'. Promises require a 'yield' statement before being accessed.");
        if ("string" != typeof b) throw new TypeError("1st input argument '" + b + "' in function 'createURLFilter' is of type '" + typeof b + "'. Expected type 'string'. Function Signature: createURLFilter(string, Obj).");
        return r(b, c).then(function(b) {
            return a.Filter.createFromMemory(b)
        })
    };
    a.Filter.createFlateEncode = function(b, c, d) {
        "undefined" === typeof b && (b = new a.Filter("0"));
        "undefined" === typeof c && (c = -1);
        "undefined" === typeof d && (d = 256);
        if (3 < arguments.length) throw new RangeError(arguments.length + " arguments passed into function 'createFlateEncode'. Expected at most 3 arguments. Function Signature: createFlateEncode(Filter, number, number)");
        if (b instanceof Promise) throw new TypeError("1st input argument in function 'createFlateEncode' is a Promise object. Promises require a 'yield' statement before being accessed.");
        if (!(b instanceof a.Filter)) {
            if ("object" == typeof b) throw new TypeError("1st input argument in function 'createFlateEncode' is of type '" + b.name + "'. Expected type 'Filter'. Function Signature: createFlateEncode(Filter, number, number).");
            throw new TypeError("1st input argument '" + b + "' in function 'createFlateEncode' is of type '" +
                typeof b + "'. Expected type 'Filter'. Function Signature: createFlateEncode(Filter, number, number).");
        }
        if (c instanceof Promise) throw new TypeError("2nd input argument in function 'createFlateEncode' is a Promise object. Promises require a 'yield' statement before being accessed.");
        if ("number" != typeof c) throw new TypeError("2nd input argument '" + c + "' in function 'createFlateEncode' is of type '" + typeof c + "'. Expected type 'number'. Function Signature: createFlateEncode(Filter, number, number).");
        if (d instanceof Promise) throw new TypeError("3rd input argument in function 'createFlateEncode' is a Promise object. Promises require a 'yield' statement before being accessed.");
        if ("number" != typeof d) throw new TypeError("3rd input argument '" + d + "' in function 'createFlateEncode' is of type '" + typeof d + "'. Expected type 'number'. Function Signature: createFlateEncode(Filter, number, number).");
        return a.sendWithPromise("Filter.createFlateEncode", {
            input_filter: b.id,
            compression_level: c,
            buf_sz: d
        }).then(function(b) {
            if ("0" ==
                b) return null;
            b = new a.Filter(b);
            createdObjects.push({
                name: b.name,
                id: b.id
            });
            return b
        })
    };
    a.PDFDoc.prototype.importPages = function(b, c) {
        "undefined" === typeof c && (c = !1);
        if (1 > arguments.length || 2 < arguments.length) throw new RangeError(arguments.length + " arguments passed into function 'importPages'. Expected 1 to 2 arguments. Function Signature: importPages(Array, boolean)");
        if (b instanceof Promise) throw new TypeError("1st input argument in function 'importPages' is a Promise object. Promises require a 'yield' statement before being accessed.");
        if (!(b instanceof Array)) {
            if ("object" == typeof b) throw new TypeError("1st input argument in function 'importPages' is of type '" + b.name + "'. Expected type 'Array'. Function Signature: importPages(Array, boolean).");
            throw new TypeError("1st input argument '" + b + "' in function 'importPages' is of type '" + typeof b + "'. Expected type 'Array'. Function Signature: importPages(Array, boolean).");
        }
        if (c instanceof Promise) throw new TypeError("3rd input argument in function 'importPages' is a Promise object. Promises require a 'yield' statement before being accessed.");
        if ("boolean" != typeof c) throw new TypeError("3rd input argument '" + c + "' in function 'importPages' is of type '" + typeof c + "'. Expected type 'boolean'. Function Signature: importPages(Array, boolean).");
        b = b.map(function(a) {
            return a.id
        });
        return a.sendWithPromise("PDFDoc.importPages", {
            doc: this.id,
            page_arr: b,
            import_bookmarks: c
        }).then(function(b) {
            return b ? b.map(function(b) {
                return new a.Page(b)
            }) : null
        })
    };
    a.SDFDoc.prototype.applyCustomQuery = function(b) {
        if (1 != arguments.length) throw new RangeError(arguments.length +
            " arguments passed into function 'applyCustomQuery'. Expected only 1");
        if ("object" != typeof b) throw new TypeError("input argument '" + b + "' in function 'applyCustomQuery' must be an object");
        return a.sendWithPromise("SDFDoc.applyCustomQuery", {
            doc: this.id,
            query: JSON.stringify(b)
        }).then(function(a) {
            return JSON.parse(a)
        })
    };
    var C = a.PDFDoc.prototype.saveMemoryBuffer,
        D = a.PDFDoc.prototype.saveStream;
    a.PDFDoc.prototype.saveMemoryBuffer = function(a) {
        var b = this;
        return Promise.resolve(b.documentCompletePromise).then(function() {
            return C.call(b,
                a)
        })
    };
    a.PDFDoc.prototype.saveStream = function(a) {
        var b = this;
        return Promise.resolve(b.documentCompletePromise).then(function() {
            return D.call(b, a)
        })
    };
    a.PDFACompliance.createFromUrl = function(b, c, d, f, g, h, k) {
        if (2 > arguments.length || 7 < arguments.length) throw new RangeError(arguments.length + " arguments passed into function 'createFromUrl'. Expected 7 arguments. Function Signature: createFromUrl(convert, url, pwd, conform, excep, max_ref_objs, first_stop)");
        "undefined" === typeof d && (d = "");
        "undefined" === typeof f &&
            (f = a.PDFACompliance.Conformance.e_Level1B);
        "undefined" === typeof g && (g = new Int32Array(0));
        "undefined" === typeof h && (h = 10);
        "undefined" === typeof k && (k = !1);
        if (b instanceof Promise) throw new TypeError("1st input argument in function 'createFromUrl' is a Promise object. Promises require a 'yield' statement before being accessed.");
        if ("boolean" != typeof b) throw new TypeError("1st input argument '" + b + "' in function 'createFromUrl' is of type '" + typeof b + "'. Expected type 'number'. Function Signature: createFromUrl(convert, url, pwd, conform, excep, max_ref_objs, first_stop).");
        if (c instanceof Promise) throw new TypeError("Received a Promise object in 1st input argument 'createFromURL'. Promises require a 'yield' statement before being accessed.");
        if ("string" != typeof c) throw new TypeError("2nd input argument '" + c + "' in function 'createFromURL' is of type '" + typeof c + "'. Expected type 'string'. Function Signature: createFromURL(PDFDoc, string, Obj).");
        if (d instanceof Promise) throw new TypeError("3rd input argument in function 'createFromUrl' is a Promise object. Promises require a 'yield' statement before being accessed.");
        if ("string" != typeof d) throw new TypeError("3rd input argument '" + d + "' in function 'createFromUrl' is of type '" + typeof d + "'. Expected type 'string'. Function Signature: createFromUrl(convert, url, pwd, conform, excep, max_ref_objs, first_stop).");
        if (f instanceof Promise) throw new TypeError("4th input argument in function 'createFromUrl' is a Promise object. Promises require a 'yield' statement before being accessed.");
        if ("number" != typeof f) throw new TypeError("4th input argument '" + f + "' in function 'createFromUrl' is of type '" +
            typeof f + "'. Expected type 'number'. Function Signature: createFromUrl(convert, url, pwd, conform, excep, max_ref_objs, first_stop).");
        if (g instanceof Promise) throw new TypeError("5th input argument in function 'createFromUrl' is a Promise object. Promises require a 'yield' statement before being accessed.");
        if (h instanceof Promise) throw new TypeError("6th input argument in function 'createFromUrl' is a Promise object. Promises require a 'yield' statement before being accessed.");
        if (k instanceof Promise) throw new TypeError("7th input argument in function 'createFromUrl' is a Promise object. Promises require a 'yield' statement before being accessed.");
        return r(c).then(function(c) {
            return a.PDFACompliance.createFromBuffer(b, c, d, f, g, h, k)
        })
    };
    a.PDFACompliance.createFromBuffer = function(b, c, d, f, g, k, l) {
        "undefined" === typeof d && (d = "");
        "undefined" === typeof f && (f = a.PDFACompliance.Conformance.e_Level1B);
        "undefined" === typeof g && (g = new Int32Array(0));
        "undefined" === typeof k && (k = 10);
        "undefined" === typeof l && (l = !1);
        var e = c;
        h.isArrayBuffer(e) || (e = e.buffer);
        if (2 > arguments.length || 7 < arguments.length) throw new RangeError(arguments.length + " arguments passed into function 'createFromBuffer'. Expected 7 arguments. Function Signature: createFromBuffer(convert, buf, pwd, conform, excep, max_ref_objs, first_stop)");
        if (b instanceof Promise) throw new TypeError("1st input argument in function 'createFromBuffer' is a Promise object. Promises require a 'yield' statement before being accessed.");
        if ("boolean" != typeof b) throw new TypeError("1st input argument '" + b + "' in function 'createFromBuffer' is of type '" + typeof b + "'. Expected type 'number'. Function Signature: createFromBuffer(convert, buf, pwd, conform, excep, max_ref_objs, first_stop).");
        if (c instanceof Promise) throw new TypeError("2nd input argument in function 'createFromBuffer' is a Promise object. Promises require a 'yield' statement before being accessed.");
        if (!h.isArrayBuffer(e)) {
            if ("object" == typeof c && c.name) throw new TypeError("2nd input argument in function 'createFromBuffer' is of type '" + c.name + "'. Expected ArrayBuffer|TypedArray. Function Signature: createFromBuffer(convert, buf, pwd, conform, excep, max_ref_objs, first_stop).");
            throw new TypeError("2nd input argument '" + c + "' in function 'createFromBuffer' is of type '" + typeof c + "'. Expected ArrayBuffer|TypedArray. Function Signature: createFromBuffer(convert, buf, pwd, conform, excep, max_ref_objs, first_stop).");
        }
        if (d instanceof Promise) throw new TypeError("3rd input argument in function 'createFromBuffer' is a Promise object. Promises require a 'yield' statement before being accessed.");
        if ("string" != typeof d) throw new TypeError("3rd input argument '" + d + "' in function 'createFromBuffer' is of type '" + typeof d + "'. Expected type 'string'. Function Signature: createFromBuffer(convert, buf, pwd, conform, excep, max_ref_objs, first_stop).");
        if (f instanceof Promise) throw new TypeError("4th input argument in function 'createFromBuffer' is a Promise object. Promises require a 'yield' statement before being accessed.");
        if ("number" != typeof f) throw new TypeError("4th input argument '" + f + "' in function 'createFromBuffer' is of type '" + typeof f + "'. Expected type 'number'. Function Signature: createFromBuffer(convert, buf, pwd, conform, excep, max_ref_objs, first_stop).");
        if (g instanceof Promise) throw new TypeError("5th input argument in function 'createFromBuffer' is a Promise object. Promises require a 'yield' statement before being accessed.");
        if (!h.isArrayBuffer(g.buffer)) {
            if ("object" == typeof g) throw new TypeError("5th input argument in function 'createFromBuffer' is of type '" +
                g.name + "'. Expected typed array. Function Signature: createFromBuffer(convert, buf, pwd, conform, excep, max_ref_objs, first_stop).");
            throw new TypeError("5th input argument '" + g + "' in function 'createFromBuffer' is of type '" + typeof g + "'. Expected typed array. Function Signature: createFromBuffer(convert, buf, pwd, conform, excep, max_ref_objs, first_stop).");
        }
        if (k instanceof Promise) throw new TypeError("6th input argument in function 'createFromBuffer' is a Promise object. Promises require a 'yield' statement before being accessed.");
        if ("number" != typeof k) throw new TypeError("6th input argument '" + k + "' in function 'createFromBuffer' is of type '" + typeof k + "'. Expected type 'number'. Function Signature: createFromBuffer(convert, buf, pwd, conform, excep, max_ref_objs, first_stop).");
        if (l instanceof Promise) throw new TypeError("7th input argument in function 'createFromBuffer' is a Promise object. Promises require a 'yield' statement before being accessed.");
        if ("boolean" != typeof l) throw new TypeError("7th input argument '" + l + "' in function 'createFromBuffer' is of type '" +
            typeof l + "'. Expected type 'number'. Function Signature: createFromBuffer(convert, buf, pwd, conform, excep, max_ref_objs, first_stop).");
        return a.sendWithPromise("pdfaComplianceCreateFromBuffer", {
            convert: b,
            buf: e,
            password: d,
            conform: f,
            excep: g.buffer,
            max_ref_objs: k,
            first_stop: l
        }).then(function(b) {
            b = new a.PDFACompliance(b);
            createdObjects.push({
                name: b.name,
                id: b.id
            });
            return b
        })
    };
    a.PDFDoc.prototype.lock = function() {
        if (0 != arguments.length) throw new RangeError(arguments.length + " arguments passed into function 'lock'. Expected 0 arguments. Function Signature: lock()");
        lockedObjects.push({
            name: "PDFDoc",
            id: this.id,
            unlocktype: "unlock"
        });
        return a.sendWithPromise("PDFDoc.lock", {
            doc: this.id
        })
    };
    a.PDFDoc.prototype.lockRead = function() {
        if (0 != arguments.length) throw new RangeError(arguments.length + " arguments passed into function 'lockRead'. Expected 0 arguments. Function Signature: lockRead()");
        lockedObjects.push({
            name: "PDFDoc",
            id: this.id,
            unlocktype: "unlockRead"
        });
        return a.sendWithPromise("PDFDoc.lockRead", {
            doc: this.id
        })
    };
    a.PDFDoc.prototype.tryLock = function() {
        if (0 != arguments.length) throw new RangeError(arguments.length +
            " arguments passed into function 'tryLock'. Expected 0 arguments. Function Signature: tryLock()");
        var b = lockedObjects.length;
        lockedObjects.push({
            name: "PDFDoc",
            id: this.id,
            unlocktype: "unlock"
        });
        return a.sendWithPromise("PDFDoc.tryLock", {
            doc: this.id
        }).then(function(a) {
            a || lockedObjects.splice(b, 1)
        })
    };
    a.PDFDoc.prototype.timedLock = function(b) {
        if (1 < arguments.length) throw new RangeError(arguments.length + " arguments passed into function 'timedLock'. Expected at most 1 arguments. Function Signature: timedLock(number)");
        if (b instanceof Promise) throw new TypeError("1st input argument in function 'timedLock' is a Promise object. Promises require a 'yield' statement before being accessed.");
        if ("number" != typeof b) throw new TypeError("1st input argument '" + b + "' in function 'timedLock' is of type '" + typeof b + "'. Expected type 'number'. Function Signature: timedLock(number).");
        var c = lockedObjects.length;
        lockedObjects.push({
            name: "PDFDoc",
            id: this.id,
            unlocktype: "unlock"
        });
        return a.sendWithPromise("PDFDoc.timedLock", {
            doc: this.id,
            milliseconds: b
        }).then(function(a) {
            a || lockedObjects.splice(c, 1)
        })
    };
    a.PDFDoc.prototype.tryLockRead = function() {
        if (0 != arguments.length) throw new RangeError(arguments.length + " arguments passed into function 'tryLockRead'. Expected 0 arguments. Function Signature: tryLockRead()");
        var b = lockedObjects.length;
        lockedObjects.push({
            name: "PDFDoc",
            id: this.id,
            unlocktype: "unlockRead"
        });
        return a.sendWithPromise("PDFDoc.tryLockRead", {
            doc: this.id
        }).then(function(a) {
            a || lockedObjects.splice(b, 1)
        })
    };
    a.PDFDoc.prototype.timedLockRead =
        function(b) {
            if (1 < arguments.length) throw new RangeError(arguments.length + " arguments passed into function 'timedLockRead'. Expected at most 1 arguments. Function Signature: timedLockRead(number)");
            if (b instanceof Promise) throw new TypeError("1st input argument in function 'timedLockRead' is a Promise object. Promises require a 'yield' statement before being accessed.");
            if ("number" != typeof b) throw new TypeError("1st input argument '" + b + "' in function 'timedLockRead' is of type '" + typeof b + "'. Expected type 'number'. Function Signature: timedLockRead(number).");
            var c = lockedObjects.length;
            lockedObjects.push({
                name: "PDFDoc",
                id: this.id,
                unlocktype: "unlockRead"
            });
            return a.sendWithPromise("PDFDoc.timedLockRead", {
                doc: this.id,
                milliseconds: b
            }).then(function(a) {
                a || lockedObjects.splice(c, 1)
            })
        };
    a.hasFullApi = !0;
    a.Optimizer.optimize = function(b, c) {
        if (1 > arguments.length || 2 < arguments.length) throw new RangeError(arguments.length + " arguments passed into function 'Optimizer.optimize'. Expected 1 to 2 arguments. Function Signature: optimize(PDFDoc, OptimizerSettings)");
        if (b instanceof Promise) throw new TypeError("1st input argument in function 'optimize' is a Promise object. Promises require a 'yield' statement before being accessed.");
        if (!(b instanceof a.PDFDoc || b instanceof a.SDFDoc || b instanceof a.FDFDoc)) {
            if ("object" == typeof b) throw new TypeError("1st input argument in function 'optimize' is of type '" + b.name + "'. Expected type 'PDFDoc'. Function Signature: optimize(PDFDoc, OptimizerSettings).");
            throw new TypeError("1st input argument '" + b + "' in function 'optimize' is of type '" +
                typeof b + "'. Expected type 'PDFDoc'. Function Signature: optimize(PDFDoc, OptimizerSettings).");
        }
        if ("undefined" === typeof c) c = new a.Optimizer.OptimizerSettings;
        else {
            if (c instanceof Promise) throw new TypeError("2nd input argument in function 'optimize' is a Promise object. Promises require a 'yield' statement before being accessed.");
            if ("object" !== typeof c) throw new TypeError("2nd input argument in function 'optimize' is of type '" + c.name + "'. Expected type 'Object'. Function Signature: optimize(PDFDoc, OptimizerSettings).");
        }
        return a.sendWithPromise("optimizerOptimize", {
            doc: b.id,
            color_image_settings: c.color_image_settings,
            grayscale_image_settings: c.grayscale_image_settings,
            mono_image_settings: c.mono_image_settings,
            text_settings: c.text_settings,
            remove_custom: c.remove_custom
        })
    };
    a.VerificationOptions.prototype.addTrustedCertificateFromURL = function(b, c, e) {
        "undefined" === typeof c && (c = {});
        "undefined" === typeof e && (e = a.VerificationOptions.CertificateTrustFlag.e_default_trust);
        d(arguments.length, 1, "addTrustedCertificateFromURL",
            "(string, object, number)", [
                [b, "string"],
                [c, "object"],
                [e, "number"]
            ]);
        var f = this;
        return r(b, c).then(function(a) {
            return f.addTrustedCertificate(a, e)
        })
    };
    a.DigitalSignatureField.prototype.certifyOnNextSaveFromURL = function(a, c, e) {
        "undefined" === typeof e && (e = {});
        d(arguments.length, 2, "certifyOnNextSaveFromURL", "(string, string, object)", [
            [a, "string"],
            [c, "string"],
            [e, "object"]
        ]);
        var b = this;
        return r(a, e).then(function(a) {
            return b.certifyOnNextSaveFromBuffer(a, c)
        })
    };
    a.DigitalSignatureField.prototype.signOnNextSaveFromURL =
        function(a, c, e) {
            "undefined" === typeof e && (e = {});
            d(arguments.length, 2, "signOnNextSaveFromURL", "(string, string, object)", [
                [a, "string"],
                [c, "string"],
                [e, "object"]
            ]);
            var b = this;
            return r(a, e).then(function(a) {
                return b.signOnNextSaveFromBuffer(a, c)
            })
        };
    a.PDFRasterizer.prototype.rasterize = function(b, c, e, f, g, h, k, l, p) {
        "undefined" === typeof l && (l = null);
        "undefined" === typeof p && (p = null);
        d(arguments.length, 7, "rasterize", "(PDFNet.Page, number, number, number, number, boolean, PDFNet.Matrix2D, PDFNet.Rect, PDFNet.Rect)",
            [
                [b, "Object", a.Page, "Page"],
                [c, "number"],
                [e, "number"],
                [f, "number"],
                [g, "number"],
                [h, "boolean"],
                [k, "Structure", a.Matrix2D, "Matrix2D"],
                [l, "Structure", a.Rect, "Rect"],
                [p, "Structure", a.Rect, "Rect"]
            ]);
        n("rasterize", [
            [k, 6],
            [l, 7],
            [p, 8]
        ]);
        return a.sendWithPromise("PDFRasterizer.rasterize", {
            r: this.id,
            page: b.id,
            width: c,
            height: e,
            stride: f,
            num_comps: g,
            demult: h,
            device_mtx: k,
            clip: l,
            scrl_clp_regions: p
        })
    };
    a.ElementBuilder.prototype.createUnicodeTextRun = function(b) {
        d(arguments.length, 1, "createUnicodeTextRun", "(string)",
            [
                [b, "string"]
            ]);
        return a.sendWithPromise("ElementBuilder.createUnicodeTextRun", {
            b: this.id,
            text_data: b
        }).then(function(b) {
            return f(a.Element, b)
        })
    };
    a.DigitalSignatureField.prototype.getCertPathsFromCMS = function() {
        k("getCertPathsFromCMS", this.yieldFunction);
        return a.sendWithPromise("DigitalSignatureField.getCertPathsFromCMS", {
            self: this
        }).then(function(b) {
            for (var c = [], d = 0; d < b.length; ++d) {
                for (var f = b[d], g = [], h = 0; h < f.length; ++h) {
                    var k = f[h];
                    if ("0" === k) return null;
                    k = new a.X509Certificate(k);
                    g.push(k);
                    createdObjects.push({
                        name: k.name,
                        id: k.id
                    })
                }
                c.push(g)
            }
            return c
        })
    };
    var F = a.Convert.officeToPdfWithPath;
    a.Convert.officeToPdfWithPath = function(b, c) {
        var d;
        return a.PDFDoc.create().then(function(a) {
            d = a;
            return d.initSecurityHandler()
        }).then(function() {
            return F(d, b, c)
        }).then(function() {
            return d
        })
    };
    var E = a.Convert.officeToPdfWithFilter;
    a.Convert.officeToPdfWithFilter = function(b, c) {
        var d;
        return a.PDFDoc.create().then(function(a) {
            d = a;
            return d.initSecurityHandler()
        }).then(function() {
            return E(d, b, c)
        }).then(function() {
            return d
        })
    };
    a.Convert.office2PDF =
        function(b, c) {
            var d = null;
            d = "string" === typeof b ? a.Filter.createURLFilter(b) : a.Filter.createFromMemory(b);
            return d.then(function(b) {
                return a.Convert.officeToPdfWithFilter(b, c)
            })
        };
    a.Convert.office2PDFBuffer = function(b, c) {
        return a.Convert.office2PDF(b, c).then(function(b) {
            return b.saveMemoryBuffer(a.SDFDoc.SaveOptions.e_linearized).then(function(a) {
                return b.destroy().then(function() {
                    return a
                })
            })
        })
    };
    a.PDFACompliance.createFromFile = function(b, c, d, f, g, k, l) {
        "undefined" === typeof d && (d = "");
        "undefined" === typeof f &&
            (f = a.PDFACompliance.Conformance.e_Level1B);
        "undefined" === typeof g && (g = new Int32Array(0));
        "undefined" === typeof k && (k = 10);
        "undefined" === typeof l && (l = !1);
        if (2 > arguments.length || 7 < arguments.length) throw new RangeError(arguments.length + " arguments passed into function 'createFromFile'. Expected 7 arguments. Function Signature: createFromFile(convert, buf, pwd, conform, excep, max_ref_objs, first_stop)");
        if (b instanceof Promise) throw new TypeError("1st input argument in function 'createFromFile' is a Promise object. Promises require a 'yield' statement before being accessed.");
        if ("boolean" != typeof b) throw new TypeError("1st input argument '" + b + "' in function 'createFromFile' is of type '" + typeof b + "'. Expected type 'number'. Function Signature: createFromFile(convert, buf, pwd, conform, excep, max_ref_objs, first_stop).");
        if (c instanceof Promise) throw new TypeError("2nd input argument in function 'createFromFile' is a Promise object. Promises require a 'yield' statement before being accessed.");
        if ("string" != typeof c) throw new TypeError("2nd input argument '" + c + "' in function 'createFromFile' is of type '" +
            typeof c + "'. Expected type 'string'. Function Signature: createFromFile(boolean, string, string, number, number, number, number, boolean).");
        if (d instanceof Promise) throw new TypeError("3rd input argument in function 'createFromFile' is a Promise object. Promises require a 'yield' statement before being accessed.");
        if ("string" != typeof d) throw new TypeError("3rd input argument '" + d + "' in function 'createFromFile' is of type '" + typeof d + "'. Expected type 'string'. Function Signature: createFromFile(convert, buf, pwd, conform, excep, max_ref_objs, first_stop).");
        if (f instanceof Promise) throw new TypeError("4th input argument in function 'createFromFile' is a Promise object. Promises require a 'yield' statement before being accessed.");
        if ("number" != typeof f) throw new TypeError("4th input argument '" + f + "' in function 'createFromFile' is of type '" + typeof f + "'. Expected type 'number'. Function Signature: createFromFile(convert, buf, pwd, conform, excep, max_ref_objs, first_stop).");
        if (g instanceof Promise) throw new TypeError("5th input argument in function 'createFromFile' is a Promise object. Promises require a 'yield' statement before being accessed.");
        if (!h.isArrayBuffer(g.buffer)) {
            if ("object" == typeof g) throw new TypeError("5th input argument in function 'createFromFile' is of type '" + g.name + "'. Expected typed array. Function Signature: createFromFile(convert, buf, pwd, conform, excep, max_ref_objs, first_stop).");
            throw new TypeError("5th input argument '" + g + "' in function 'createFromFile' is of type '" + typeof g + "'. Expected typed array. Function Signature: createFromFile(convert, buf, pwd, conform, excep, max_ref_objs, first_stop).");
        }
        if (k instanceof Promise) throw new TypeError("6th input argument in function 'createFromFile' is a Promise object. Promises require a 'yield' statement before being accessed.");
        if ("number" != typeof k) throw new TypeError("6th input argument '" + k + "' in function 'createFromFile' is of type '" + typeof k + "'. Expected type 'number'. Function Signature: createFromFile(convert, buf, pwd, conform, excep, max_ref_objs, first_stop).");
        if (l instanceof Promise) throw new TypeError("7th input argument in function 'createFromFile' is a Promise object. Promises require a 'yield' statement before being accessed.");
        if ("boolean" != typeof l) throw new TypeError("7th input argument '" + l + "' in function 'createFromFile' is of type '" + typeof l + "'. Expected type 'number'. Function Signature: createFromFile(convert, buf, pwd, conform, excep, max_ref_objs, first_stop).");
        return a.sendWithPromise("pdfaComplianceCreateFromFile", {
            convert: b,
            file_path: c,
            password: d,
            conform: f,
            excep: g.buffer,
            max_ref_objs: k,
            first_stop: l
        }).then(function(b) {
            b = new a.PDFACompliance(b);
            createdObjects.push({
                name: b.name,
                id: b.id
            });
            return b
        })
    };
    var x = !1,
        B = function(a, c, d, f) {
            // if (!a) throw a = "License key is required for function '" + d + "'.\nPlease go to https://www.pdftron.com/pws/get-key to obtain a demo license or https://www.pdftron.com/form/contact-sales to obtain a production key.", console.error(a), Error(a);
            if ("string" !== typeof a) throw new TypeError(c + " input argument in function '" + d + "' is of type '" + typeof a + "'. Expected type 'string'. Function Signature: " + d + f + ".");
        };
    a.initialize = function(b, c) {
        if (!z) {
            B(b, "First", "PDFNet.initialize", "(licenseKey, options)");
            var d = {
                emsWorkerError: function(a, b) {
                    console.log("EmsWorkerError: " + a + ", " + b)
                }
            };
            z = createPromiseCapability();
            h.CoreControls.getDefaultBackendType().then(function(e) {
                h.CoreControls.preloadPDFWorker(e, d);
                h.CoreControls.initPDFWorkerTransports(e, d, b, c).then(function(b) {
                    a.messageHandler = b.messageHandler;
                    z.resolve()
                }, function(a) {
                    z.reject(a)
                })
            }, function(a) {
                z.reject(a)
            })
        }
        x && (a.messageHandler.comObj.addEventListener("message", a.messageHandler.handleMessage.bind(a.messageHandler)), a.messageHandler.comObj.addEventListener("userCallback",
            a.messageHandler.handleMessage.bind(a.messageHandler)), x = !1);
        return z.promise
    };
    a.shutdown = function() {
        if (0 != arguments.length) throw new RangeError(arguments.length + " arguments passed into function 'shutdown'. Expected 0 arguments. Function Signature: shutdown()");
        if (x) return Promise.resolve();
        if (a.messageHandler.comObj) return a.terminate(1).then(function() {
            a.messageHandler.comObj.shutdown();
            x = !0
        });
        x = !0;
        return Promise.resolve()
    };
    a.beginOperation = function(a) {
        return Promise.resolve()
    };
    a.finishOperation =
        function() {
            return Promise.resolve()
        };
    a.runWithCleanup = function(b, c, d) {
        z || B(c, "Second", "PDFNet.runWithCleanup", "(callback, licenseKey)");
        var e, f = !1;
        return A = A.then(function() {}, function() {}).then(function() {
            return a.initialize(c, d)
        }).then(function() {
            f = !0;
            a.startDeallocateStack();
            return b()
        }).then(function(b) {
            e = b;
            f = !1;
            return a.endDeallocateStack()
        }).then(function() {
            if (0 < stackCallCounter) throw Error('Detected not yet deallocated stack. You may have called "PDFNet.startDeallocateStack()" somewhere without calling "PDFNet.endDeallocateStack()" afterwards.');
            return e
        }).catch(function(b) {
            f && a.endDeallocateStack();
            throw b;
        })
    };
    a.runWithoutCleanup = function(b, c, d) {
        z || B(c, "Second", "PDFNet.runWithoutCleanup", "(callback, licenseKey)");
        return A = A.then(function() {}, function() {}).then(function() {
            return a.initialize(c, d)
        }).then(function() {
            return b()
        }).then(function(a) {
            return a
        })
    };
    a.PDFRasterizer.prototype.setErrorReportProc = function(b, c) {
        d(arguments.length, 2, "setErrorReportProc", "(function, object)", [
            [b, "function"],
            [c, "object"]
        ]);
        a.messageHandler.userCallbacks["PDFRasterizer.setErrorReportProc"] = {
            callback: function(a, c) {
                b(a.message, c)
            },
            data: c
        };
        return a.sendWithPromise("PDFRasterizer.setErrorReportProc", {
            r: this.id
        })
    };
    a.setConnectionErrorProc = function(b, c) {
        d(arguments.length, 2, "setConnectionErrorProc", "(function, object)", [
            [b, "function"],
            [c, "object"]
        ]);
        a.messageHandler.userCallbacks.pdfNetSetConnectionErrorProc = {
            callback: function(a, c) {
                b(a.message, a.error_code, a.switch_to_demo, c)
            },
            data: c
        };
        return a.sendWithPromise("pdfNetSetConnectionErrorProc", {})
    };
    a.terminate = function(b) {
        d(arguments.length,
            1, "terminate", "(number)", [
                [b, "number"]
            ]);
        return a.sendWithPromise("pdfNetTerminate", {
            termination_level: b
        })
    };
    h.PDFNet = a
})("undefined" === typeof window ? this : window);
var _ = require("underscore");
(function(h) {
    function g(b, e, g, l, n) {
        if (_.isUndefined(b)) return null;
        var c;
        e = new Promise(function(a, e) {
            f(function() {
                e(new WorkerError("The worker has encountered an error", h.utils.ie ? "error.EmsWorkerErrorIE" : "error.EmsWorkerError"))
            });
            var m = {};
            r && (m.workerHeapSize = r);
            d && (m.pdfResourcePath = d);
            k && (m.pdfAsmPath = k);
            if (!h.utils.isJSWorker) {
                var l = h.location.href,
                    p = l.lastIndexOf("#");
                p = l.lastIndexOf("/", p); - 1 !== p && (m.parentUrl = l.substring(0, p + 1))
            }
            c = new h.WorkerTransport(b, g, m);
            c.backendType = t.getCurrentPDFBackendType();
            c.workerInitializedPromise.then(function() {
                a()
            }, function(a) {
                e(a)
            })
        });
        var m = new Promise(function(a, b) {
            if (h.utils.isJSWorker && h.jsworker && h.jsworker.utils) h.jsworker.utils.getResourcesDir ? h.jsworker.utils.getResourcesDir(function(c, d) {
                c ? b(c) : a(d)
            }) : h.jsworker.utils.getHTMLContentPath ? h.jsworker.utils.getHTMLContentPath(function(c) {
                c ? (c.endsWith("/") || (c += "/"), a(c + "js/html5/pdf/")) : b(new WorkerError("Couldn't fetch resource file path."))
            }) : b(new WorkerError("Some functions required for fetching resources are not defined."));
            else {
                var c = new XMLHttpRequest;
                c.open("GET", h.CoreControls.getPDFResourcePath() + "pdfnet.res", !0);
                c.responseType = "arraybuffer";
                c.onload = function() {
                    200 === c.status ? a(c.response) : b(new WorkerError("Couldn't fetch resource file.", "error.ResourceLoadError"))
                };
                c.onerror = function() {
                    b(new WorkerError("Network error", "error.ResourceLoadError"))
                };
                c.send(null)
            }
        });
        return Promise.all([e, m]).then(function(a) {
            return h.utils.isJSWorker && h.jsworker && h.jsworker.utils ? c.loadResourceFileFromPath(a[1], l, n) : c.loadResourceFile(a[1],
                l)
        }).then(function() {
            "undefined" !== typeof p && c.setColorManagement(p);
            "undefined" !== typeof a && c.setCustomFontURL(a);
            return c
        }).catch(function(a) {
            c.messageHandler.comObj.shutdown();
            a.message && -1 !== a.message.indexOf("Bad License Key") && (a.userMessage = "error.InvalidLicenseKey");
            throw a;
        })
    }
    var p, a, r;
    h.subzeroEnabled = h.utils.chromeHasSubzero;
    var v, d, k, n = {},
        u, z = [],
        l = [],
        f = function(a) {
            z.push(a);
            for (var b = 0; b < l.length; ++b) a(l[b])
        },
        y = _.throttle(function(a) {
                var b = z.length;
                l.push(a);
                for (var c = 0; c < b; ++c) z[c](a)
            },
            100, {
                trailing: !1
            });
    h.CoreControls = h.CoreControls || {};
    var t = h.CoreControls,
        q;
    t.getCurrentL = function() {
        return q
    };
    t.setL = function(a) {
        q = a
    };
    t.getParentL = function() {
        return new Promise(function(a) {
            try {
                var b = h.parent && h.parent.WebViewer ? h.parent.WebViewer.l() : void 0;
                a(b)
            } catch (m) {
                h.parent.postMessage("requestl", "*"), $(h).on("message.l", function(b) {
                    b = b.originalEvent;
                    "object" === typeof b.data && "responsel" === b.data.type && (a(b.data.value), $(h).off("message.l"))
                })
            }
        })
    };
    t.getLPromise = function(a) {
        return a ? Promise.resolve(a) :
            h._trnDebugMode ? Promise.resolve() : ("" + h.location).split("").reverse().join("").match(/(moc\.nortfdp\.[^.]+\/\/|moc\.nortfdp\/\/)/) || h.jsworker ? Promise.resolve("") : t.getParentL().then(function(a) {
                return a ? a : null
            })
    };
    var A = {};
    t.setWorkerTransportPromise = function(a) {
        a.pdf && (A.pdf = a.pdf);
        a.office && (A.office = a.office)
    };
    t.getWorkerTransportPromise = function() {
        return A
    };
    t.setColorManagement = function(a) {
        p = a;
        t.getWorkerTransportPromise().pdf && t.getWorkerTransportPromise().pdf.then(function(b) {
            b.setColorManagement(a)
        })
    };
    t.setCustomFontURL = function(b) {
        a = b;
        t.getWorkerTransportPromise().pdf && t.getWorkerTransportPromise().pdf.then(function(b) {
            b.setCustomFontURL(a)
        })
    };
    t.enableSubzero = function(a) {
        h.utils.chromeHasSubzero && (h.subzeroEnabled = a)
    };
    t.isSubzeroEnabled = function() {
        return h.subzeroEnabled
    };
    var C = h.PDFNet && h.PDFNet.hasFullAPI;
    t.enableFullPDF = function(a) {
        C = a
    };
    t.isFullPDFEnabled = function() {
        return C
    };
    t.setPDFWorkerPath = function(a) {
        a.lastIndexOf("/") !== a.length - 1 && (a += "/");
        v = a
    };
    t.getPDFAsmPath = function() {
        return k ||
            t.getWorkerPath() + "pdf/" + (t.isFullPDFEnabled() ? "full/" : "lean/")
    };
    t.setPDFAsmPath = function(a) {
        a.lastIndexOf("/") !== a.length - 1 && (a += "/");
        k = a
    };
    t.getPDFWorkerPath = function() {
        return v || t.getWorkerPath() + "pdf/" + (t.isFullPDFEnabled() ? "full/" : "lean/")
    };
    t.setPDFResourcePath = function(a) {
        a.lastIndexOf("/") !== a.length - 1 && (a += "/");
        d = a
    };
    t.getPDFResourcePath = function() {
        return d || t.getWorkerPath() + "pdf/"
    };
    t.forceBackendType = function(a) {
        u = a
    };
    var D;
    t.setExternalPath = function(a) {
        a.lastIndexOf("/") !== a.length - 1 && (a +=
            "/");
        D = a
    };
    t.getExternalPath = function() {
        return D
    };
    var F;
    t.setLocalWorkerPath = function(a, b) {
        b || a.lastIndexOf("/") === a.length - 1 || (a += "/");
        F = a
    };
    t.getLocalWorkerPath = function() {
        return F || t.getWorkerPath()
    };
    t.setEmscriptenHeapSize = function(a) {
        r = a
    };
    var E, x, B;
    t.getPostMessageTransfers = function() {
        return x
    };
    t.getDefaultBackendType = function() {
        B || (B = new Promise(function(a) {
            if (u) a(u);
            else if (h.utils.isJSWorker && h.jsworker) a("jsworker");
            else if (h.utils.isPdfjs) a(void 0);
            else if (h.utils.isChrome) {
                var b = !0,
                    c = $('<embed name="simple_module" id="simple_module" width=0 height=0 src="' +
                        h.CoreControls.getPDFResourcePath() + 'SimpleWorker.nmf" type="application/x-pnacl" style="position:absolute" />'),
                    d = c[0];
                d.addEventListener("error", function() {
                    b && (console.log("PNaClError: PNaCl failed to load. Falling back to Emscripten."), b = !1);
                    a("ems")
                }, !0);
                $(document.body).prepend(c);
                var f = !1,
                    g = function(b) {
                        f || (a(b), clearTimeout(l), c.remove(), f = !0)
                    };
                if ("undefined" === typeof d.postMessage) b && (console.log("PNaClError: PNaCl seems to be disabled. Falling back to Emscripten."), b = !1), g("ems");
                else {
                    var k =
                        function() {
                            b && (console.log("PNaClError: PNaCl Timed out. Falling back to Emscripten."), b = !1);
                            g("ems")
                        };
                    d.addEventListener("progress", function() {
                        clearTimeout(l);
                        l = setTimeout(k, 5E3)
                    });
                    d.addEventListener("message", function(a) {
                        clearTimeout(l);
                        "T" === a.data ? g("pnacl") : (console.log("PNaClError: PNaCl responded incorrectly. Falling back to Emscripten."), g("ems"))
                    });
                    d.postMessage("T");
                    var l = setTimeout(k, 5E3)
                }
            } else a("ems")
        }));
        return B
    };
    t.getCurrentPDFBackendType = function() {
        return n.backendType
    };
    var b = function() {
        n.loadingBackendTypeCapability ||
            (n.loadingBackendTypeCapability = createPromiseCapability());
        return n.loadingBackendTypeCapability
    };
    t.getLoadingPDFBackendType = function() {
        return b().promise
    };
    t.preloadPDFWorker = function(a, e, f) {
        t.getWorkerTransportPromise().pdf && a === t.getCurrentPDFBackendType() || (b().resolve(a), _.isUndefined(f) && (f = {}), h.utils.isJSWorker || (f.workerId = "pdf_pnacl_module", f.pnaclWorkerPath = h.CoreControls.getPDFWorkerPath() + (h.subzeroEnabled ? "PDFWorkerSubzero.nmf" : "PDFWorker.nmf"), f.emsWorkerPath = h.CoreControls.getPDFResourcePath() +
            (r || d || k ? "CommUtil/ResizableWorker.js" : "CommUtil/PDFworker.js"), f.externalPath = h.CoreControls.getExternalPath()), f.workerState = n, v && (f.pdfWorkerPath = v), E = t.preloadWorker(a, e, f))
    };
    t.preloadWorker = function(a, b, d) {
        d = d || {};
        var c;
        return new Promise(function(e, g) {
            var k = function(a, b) {
                    e(a);
                    d.workerState.backendType = b
                },
                m = function(a) {
                    f(function() {
                        g(new WorkerError("The worker has encountered an error", h.utils.ie ? "error.EmsWorkerErrorIE" : "error.EmsWorkerError"))
                    });
                    var b = d.emsWorkerPath.toLowerCase().startsWith("http"),
                        c = d.externalPath ? "&externalPath=" + encodeURIComponent(d.externalPath) : "";
                    if (b) {
                        b = h.CoreControls.getPDFWorkerPath().slice(0, -9);
                        var e = new Worker(h.CoreControls.getLocalWorkerPath() + "CORSWorker.js#isfull=" + t.isFullPDFEnabled() + "&file=" + encodeURIComponent(d.emsWorkerPath) + "&path=" + encodeURIComponent(b))
                    } else e = d.pdfWorkerPath ? new Worker(d.emsWorkerPath + "?isfull=" + t.isFullPDFEnabled() + "&pdfWorkerPath=" + encodeURIComponent(d.pdfWorkerPath) + c) : new Worker(d.emsWorkerPath + "?isfull=" + t.isFullPDFEnabled() + c);
                    e.onerror = y;
                    x = !0;
                    var k = function(b) {
                        "object" === typeof b.data && "action" in b.data && "workerLoaded" === b.data.action && (a.workerLoadingProgress && a.workerLoadingProgress(1), e.removeEventListener("message", k))
                    };
                    e.addEventListener("message", k, !1);
                    b = t.GetCachingLevel();
                    t.setProgressiveTimeInternal(b ? 18E3 / b : 0);
                    return e
                };
            if ("jsworker" === a) h.utils.isJSWorker && (c = h.jsworker.loadWorker()), x = !1, k(c, "jsworker");
            else if ("pnacl" === a) {
                _.isUndefined(d.useEmscriptenWhileLoading) && (d.useEmscriptenWhileLoading = !t.isSubzeroEnabled());
                x = !1;
                var l = $('<embed name="' + d.workerId + '" id="' + d.workerId + '" width=0 height=0 src="' + d.pnaclWorkerPath + '" type="application/x-pnacl" style="position:absolute" />');
                $(document.body).prepend(l);
                var p = function(a) {
                        a.lengthComputable && (d.useEmscriptenWhileLoading ? (c.removeEventListener("progress", p, !0), c.removeEventListener("loadend", n, !0), c.removeEventListener("crash", q, !0), c.removeEventListener("error", r, !0), k(m(b), "ems"), c.addEventListener("loadend", function() {
                            x = !1;
                            d.workerState.backendType = "pnacl";
                            b.pnaclComplete && b.pnaclComplete(c)
                        })) : b.workerLoadingProgress && b.workerLoadingProgress(a.loaded / a.total))
                    },
                    n = function() {
                        b.workerLoadingProgress && b.workerLoadingProgress(1);
                        t.setProgressiveTimeInternal(1E3);
                        k(c, "pnacl")
                    },
                    q = function() {
                        g(new WorkerError("The Worker has Crashed.", "error.PNaClCrashError"))
                    },
                    r = function() {
                        console.log("PNaClError: Main worker encountered an error. Falling back to Emscripten.");
                        k(m(b), "ems")
                    };
                c = l[0];
                c.addEventListener("progress", p, !0);
                c.addEventListener("loadend", n, !0);
                c.addEventListener("crash",
                    q, !0);
                c.addEventListener("error", r, !0)
            } else "ems" === a && k(m(b), "ems")
        })
    };
    t.resetWorker = function() {
        E = null;
        A.pdf = null;
        A.office = null;
        n.loadingBackendTypeCapability = null
    };
    t.initPDFWorkerTransports = function(a, b, d, f) {
        E || t.getWorkerTransportPromise().pdf || t.preloadPDFWorker(a, b);
        t.getCurrentL() || t.setL(d);
        d = d || t.getCurrentL();
        t.getWorkerTransportPromise().pdf || (a = Promise.all([t.getLPromise(d), E]).then(function(a) {
            return g(a[1], b, x, a[0], f)
        }), t.setWorkerTransportPromise({
            pdf: a
        }));
        return t.getWorkerTransportPromise().pdf
    };
    t.attachErrorCallback = f
})("undefined" === typeof window ? this : window);
(function(h) {
    function g() {
        for (var a = 0; a < x.length; a++) x[a][0](x[a][1]);
        x = [];
        B = !1
    }

    function p(a, c) {
        x.push([a, c]);
        B || (B = !0, E(g, 0))
    }

    function a(a, c) {
        function b(a) {
            d(c, a)
        }

        function f(a) {
            n(c, a)
        }
        try {
            a(b, f)
        } catch (w) {
            f(w)
        }
    }

    function r(a) {
        var b = a.owner,
            e = b.state_;
        b = b.data_;
        var f = a[e];
        a = a.then;
        if ("function" === typeof f) {
            e = C;
            try {
                b = f(b)
            } catch (w) {
                n(a, w)
            }
        }
        v(a, b) || (e === C && d(a, b), e === D && n(a, b))
    }

    function v(a, c) {
        var b;
        try {
            if (a === c) throw new TypeError("A promises callback cannot return that same promise.");
            if (c && ("function" ===
                    typeof c || "object" === typeof c)) {
                var f = c.then;
                if ("function" === typeof f) return f.call(c, function(e) {
                    b || (b = !0, c !== e ? d(a, e) : k(a, e))
                }, function(c) {
                    b || (b = !0, n(a, c))
                }), !0
            }
        } catch (w) {
            return b || n(a, w), !0
        }
        return !1
    }

    function d(a, c) {
        a !== c && v(a, c) || k(a, c)
    }

    function k(a, c) {
        a.state_ === q && (a.state_ = A, a.data_ = c, p(z, a))
    }

    function n(a, c) {
        a.state_ === q && (a.state_ = A, a.data_ = c, p(l, a))
    }

    function u(a) {
        var b = a.then_;
        a.then_ = void 0;
        for (a = 0; a < b.length; a++) r(b[a])
    }

    function z(a) {
        a.state_ = C;
        u(a)
    }

    function l(a) {
        a.state_ = D;
        u(a)
    }

    function f(b) {
        if ("function" !==
            typeof b) throw new TypeError("Promise constructor takes a function argument");
        if (!1 === this instanceof f) throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
        this.then_ = [];
        a(b, this)
    }
    h.createPromiseCapability = function() {
        var a = {},
            c = new f(function(b, c) {
                a.resolve = b;
                a.reject = c
            });
        a.promise = c;
        return a
    };
    var y = h.Promise,
        t = y && "resolve" in y && "reject" in y && "all" in y && "race" in y && function() {
            var a;
            new y(function(b) {
                a = b
            });
            return "function" ===
                typeof a
        }();
    "undefined" !== typeof exports && exports ? (exports.Promise = t ? y : f, exports.Polyfill = f) : "function" == typeof define && define.amd ? define(function() {
        return t ? y : f
    }) : t || (h.Promise = f);
    var q = "pending",
        A = "sealed",
        C = "fulfilled",
        D = "rejected",
        F = function() {},
        E = "undefined" !== typeof setImmediate ? setImmediate : setTimeout,
        x = [],
        B;
    f.prototype = {
        constructor: f,
        state_: q,
        then_: null,
        data_: void 0,
        then: function(a, c) {
            a = {
                owner: this,
                then: new this.constructor(F),
                fulfilled: a,
                rejected: c
            };
            this.state_ === C || this.state_ === D ? p(r, a) :
                this.then_.push(a);
            return a.then
        },
        "catch": function(a) {
            return this.then(null, a)
        }
    };
    f.all = function(a) {
        if ("[object Array]" !== Object.prototype.toString.call(a)) throw new TypeError("You must pass an array to Promise.all().");
        return new this(function(b, d) {
            function c(a) {
                f++;
                return function(c) {
                    e[a] = c;
                    --f || b(e)
                }
            }
            for (var e = [], f = 0, g = 0, h; g < a.length; g++)(h = a[g]) && "function" === typeof h.then ? h.then(c(g), d) : e[g] = h;
            f || b(e)
        })
    };
    f.race = function(a) {
        if ("[object Array]" !== Object.prototype.toString.call(a)) throw new TypeError("You must pass an array to Promise.race().");
        return new this(function(b, d) {
            for (var c = 0, e; c < a.length; c++)(e = a[c]) && "function" === typeof e.then ? e.then(b, d) : b(e)
        })
    };
    f.resolve = function(a) {
        return a && "object" === typeof a && a.constructor === this ? a : new this(function(b) {
            b(a)
        })
    };
    f.reject = function(a) {
        return new this(function(b, d) {
            d(a)
        })
    }
})("undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this);
(function(h) {
    var g = function(g, a) {
        var h = Error.apply(this, arguments);
        h.name = this.name = "WorkerError";
        this.stack = h.stack;
        this.message = h.message;
        this.userMessage = a
    };
    g.prototype = Object.create(Error.prototype, {
        constructor: {
            value: g,
            writable: !0,
            configurable: !0
        }
    });
    h.WorkerError = g
})("undefined" === typeof window ? this : window);
this.DOWNLOADER_CHUNK_MAX = 50;
var globalScope = this;
globalScope.WorkerTransport = function() {
    function h(g, h, a) {
        var p = this;
        this.progressCallback = null;
        this.pageCache = [];
        this.pagePromises = [];
        this.eventListeners = {};
        this.earlyEvents = {};
        this.downloadInfoCapability = createPromiseCapability();
        this.workerInitializedPromise = new Promise(function(r, d) {
            if (globalScope.utils.isJSWorker || "undefined" !== typeof Worker) try {
                var k = new globalScope.MessageHandler("main", g);
                k.postMessageTransfers = h;
                p.messageHandler = k;
                k.on("test", function(a) {
                    a && a.supportTypedArray ? (a.supportTransfers ||
                        (k.postMessageTransfers = !1), p.setupMessageHandler(k), r()) : d(new globalScope.WorkerError("Typed arrays are not supported. Can't start a worker.", "error.WorkerInitError"));
                    globalScope.utils.isJSWorker && setTimeout(function() {}, 0)
                });
                var n = {
                    array: new Uint8Array([255])
                };
                try {
                    n.options = a ? a : {}, n.options.chunkMax = globalScope.DOWNLOADER_CHUNK_MAX, k.send("test", n)
                } catch (u) {
                    globalScope.utils.log("Cannot use postMessage transfers"), k.postMessageTransfers = !1, n.array[0] = 0, k.send("test", n)
                }
                return
            } catch (u) {
                d(new globalScope.WorkerError("The worker has been disabled.",
                    "error.WorkerInitError"))
            }
            d(new globalScope.WorkerError("Can't start a worker", "error.WorkerInitError"))
        })
    }
    h.prototype = {
        renderPriority: 0,
        textPriority: 1,
        userRequestPriority: 2,
        immediatePriority: 3,
        setupMessageHandler: function(g) {
            this.messageHandler = g;
            g.on("event", this.runEventListener, this)
        },
        runEventListener: function(g) {
            var h = g.docId;
            if (this.eventListeners[h]) this.eventListeners[h](g);
            else h in this.earlyEvents ? this.earlyEvents[h].push(g) : this.earlyEvents[h] = [g]
        },
        addEventListener: function(g, h) {
            if (this.eventListeners[g]) globalScope.utils.error("Event listener already set for " +
                g);
            else if (this.eventListeners[g] = h, g in this.earlyEvents) {
                h = this.earlyEvents[g];
                for (var a = 0; a < h.length; ++a) this.runEventListener(h[a]);
                delete this.earlyEvents[g]
            }
        },
        clearEventListener: function(g) {
            delete this.eventListeners[g]
        },
        fetchDocument: function(g) {
            return this.messageHandler.sendWithPromise("NewDoc", g, this.immediatePriority)
        },
        loadResourceFile: function(g, h) {
            g = {
                array: g,
                workerPath: globalScope.CoreControls.getWorkerPath(),
                json_str: '{"language":"Nodejs"}'
            };
            h && (g.l = h);
            return this.messageHandler.sendWithPromise("LoadRes",
                g, this.immediatePriority)
        },
        loadResourceFileFromPath: function(g, h, a) {
            g = {
                path: g,
                json_str: '{"language":"Nodejs"}'
            };
            h && (g.l = h);
            a && (g.options = a);
            return this.messageHandler.sendWithPromise("LoadResFromPath", g, this.immediatePriority)
        },
        getCanvas: function(g, h, a, r, v, d, k, n) {
            return "undefined" === typeof n ? this.messageHandler.sendWithPromiseReturnId("GetCanvas", {
                docId: g,
                pageIndex: h,
                width: a,
                height: r,
                rotation: v,
                layers: d,
                overprintMode: k
            }, this.renderPriority) : this.messageHandler.sendWithPromiseReturnId("GetCanvasPartial", {
                docId: g,
                pageIndex: h,
                width: a,
                height: r,
                rotation: v,
                layers: d,
                bbox: [n.x1, n.y1, n.x2, n.y2],
                overprintMode: k
            }, this.renderPriority)
        },
        getCanvasFilepath: function(g, h, a, r, v, d, k, n, u) {
            return "undefined" === typeof n ? this.messageHandler.sendWithPromiseReturnId("GetCanvas", {
                docId: g,
                pageIndex: h,
                width: a,
                height: r,
                rotation: v,
                layers: d,
                filePath: u,
                overprintMode: k
            }, this.renderPriority) : this.messageHandler.sendWithPromiseReturnId("GetCanvasPartial", {
                docId: g,
                pageIndex: h,
                width: a,
                height: r,
                rotation: v,
                layers: d,
                bbox: [n.x1, n.y1, n.x2,
                    n.y2
                ],
                filePath: u,
                overprintMode: k
            }, this.renderPriority)
        },
        getCanvasProgressive: function(g, h) {
            return "undefined" !== typeof h ? this.messageHandler.sendWithPromise("GetCanvasProgressive", {
                callbackId: g,
                filePath: h
            }, this.renderPriority) : this.messageHandler.sendWithPromise("GetCanvasProgressive", {
                callbackId: g
            }, this.renderPriority)
        },
        getDocumentThumbnail: function(g) {
            return this.messageHandler.sendWithPromise("ThumbCacheGet", {
                filePath: g
            }, this.renderPriority)
        },
        cancelAllDocumentThumbnailRequests: function(g) {
            return this.messageHandler.send("ThumbCacheCancelAll")
        },
        loadTextData: function(g, h) {
            return this.messageHandler.sendWithPromise("LoadText", {
                docId: g,
                pageIndex: h
            }, this.textPriority)
        },
        loadBookmarks: function(g) {
            return this.messageHandler.sendWithPromise("LoadBookmarks", {
                docId: g
            }, this.immediatePriority)
        },
        loadAnnotations: function(g, h) {
            g = {
                docId: g
            };
            h && (g.pages = h);
            return this.messageHandler.sendWithPromise("LoadAnnotations", g, this.immediatePriority)
        },
        mergeXFDF: function(g, h) {
            return this.messageHandler.sendWithPromise("MergeXFDF", {
                docId: g,
                xfdf: h
            }, this.userRequestPriority)
        },
        saveFile: function(g) {
            return this.messageHandler.sendWithPromise("SaveDoc", g, this.userRequestPriority)
        },
        saveDocFromFixedElements: function(g) {
            return this.messageHandler.sendWithPromise("SaveDocFromFixedElements", g, this.userRequestPriority)
        },
        saveFileAs: function(g) {
            return this.messageHandler.sendWithPromise("SaveDocAs", g, this.userRequestPriority)
        },
        printFile: function(g, h) {
            console.log("[WorkerTransport.printFile] printOptions " + h);
            return this.messageHandler.sendWithPromise("PrintDoc", {
                    docId: g,
                    printOptions: h
                },
                this.userRequestPriority)
        },
        updatePassword: function(g, h) {
            return this.messageHandler.sendWithPromise("UpdatePassword", {
                docId: g,
                password: h
            }, this.immediatePriority)
        },
        insertBlankPages: function(g, h, a, r) {
            return this.messageHandler.sendWithPromise("InsertBlankPages", {
                docId: g,
                width: a,
                height: r,
                pageArray: h
            }, this.userRequestPriority)
        },
        insertPages: function(g, h, a, r, v) {
            return this.messageHandler.sendWithPromise("InsertPages", {
                docId: g,
                doc: h,
                pageArray: a,
                destPos: r,
                insertBookmarks: v
            }, this.userRequestPriority)
        },
        movePages: function(g,
            h, a) {
            return this.messageHandler.sendWithPromise("MovePages", {
                docId: g,
                pageArray: h,
                destPos: a
            }, this.userRequestPriority)
        },
        removePages: function(g, h) {
            return this.messageHandler.sendWithPromise("RemovePages", {
                docId: g,
                pageArray: h
            }, this.userRequestPriority)
        },
        rotatePages: function(g, h, a) {
            return this.messageHandler.sendWithPromise("RotatePages", {
                docId: g,
                pageArray: h,
                rotation: a
            }, this.userRequestPriority)
        },
        getPDFDoc: function(g) {
            return this.messageHandler.sendWithPromise("GetPDFDoc", {
                docId: g
            }, this.userRequestPriority)
        },
        extractPages: function(g, h, a, r) {
            return this.messageHandler.sendWithPromise("ExtractPages", {
                docId: g,
                pageArray: h,
                xfdfString: a,
                watermarks: r
            }, this.userRequestPriority)
        },
        cropPages: function(g, h, a, r, v, d) {
            return this.messageHandler.sendWithPromise("CropPages", {
                docId: g,
                pageArray: h,
                topMargin: a,
                botMargin: r,
                leftMargin: v,
                rightMargin: d
            }, this.userRequestPriority)
        },
        sendDownloaderHint: function(g, h) {
            return this.messageHandler.sendWithPromise("DownloaderHint", {
                docId: g,
                hint: h
            }, this.userRequestPriority)
        },
        isLinearizationValid: function(g) {
            return this.messageHandler.sendWithPromise("IsLinearized", {
                docId: g
            }, this.userRequestPriority)
        },
        getLayersArray: function(g) {
            return this.messageHandler.sendWithPromise("GetLayers", {
                docId: g
            }, this.userRequestPriority)
        },
        extractPDFNetLayersContext: function(g, h) {
            return this.messageHandler.sendWithPromise("ExtractPDFNetLayersContext", {
                docId: g,
                layers: h
            }, this.userRequestPriority)
        },
        getAnnotationAppearance: function(g) {
            return this.messageHandler.sendWithPromise("RenderAnnotAppearance", g, this.userRequestPriority)
        },
        getNextId: function() {
            return this.messageHandler.getNextId()
        },
        deleteDocument: function(g) {
            return this.messageHandler.sendWithPromise("DeleteDocument", {
                docId: g
            }, this.userRequestPriority)
        },
        setColorManagement: function(g) {
            return this.messageHandler.sendWithPromise("SetColorManagement", {
                value: g
            }, this.immediatePriority)
        },
        setCustomFontURL: function(g) {
            return this.messageHandler.sendWithPromise("SetCustomFontURL", {
                fontURL: g
            }, this.immediatePriority)
        },
        getWorkerType: function() {
            return this.messageHandler.comObj && "function" === typeof this.messageHandler.comObj.getWorkerType ?
                this.messageHandler.comObj.getWorkerType() : globalScope.IsWorker(this.messageHandler.comObj) ? "ems" : "pnacl"
        },
        requirePage: function(g, h) {
            return this.messageHandler.sendWithPromise("RequirePage", {
                docId: g,
                pageNum: h
            }, this.immediatePriority)
        },
        sendWithPromise: function(g, h, a) {
            return this.messageHandler.sendWithPromise(g, h, a)
        },
        cancelRequest: function(g) {
            this.messageHandler.cancelPromise(g)
        },
        getAppearanceDocument: function(g, h) {
            return this.messageHandler.sendWithPromise("GetAnnotationAppearances", {
                    docId: g,
                    references: h
                },
                this.textPriority)
        }
    };
    return h
}();