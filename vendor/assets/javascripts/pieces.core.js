var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
  __slice = [].slice,
  __hasProp = {}.hasOwnProperty;

(function(context) {
  "use strict";
  var pi, _email_regexp, _html_regexp, _key_compare, _keys_compare, _uniq_id;
  pi = context.pi = context.pi || {};
  _email_regexp = /\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}\b/i;
  _html_regexp = /^<.+>$/m;
  _uniq_id = 100;
  _key_compare = function(a, b, key, reverse) {
    if (a[key] === b[key]) {
      return 0;
    }
    if (!a[key] || a[key] < b[key]) {
      return 1 + (-2 * reverse);
    } else {
      return -(1 + (-2 * reverse));
    }
  };
  _keys_compare = function(a, b, keys, reverse) {
    var i, key, r, _fn, _i, _len;
    r = 0;
    _fn = function(key, i) {
      var r_;
      r_ = _key_compare(a, b, key, (typeof reverse === 'object' ? reverse[i] : reverse));
      if (r === 0) {
        return r = r_;
      }
    };
    for (i = _i = 0, _len = keys.length; _i < _len; i = ++_i) {
      key = keys[i];
      _fn(key, i);
    }
    return r;
  };
  pi.utils = {
    uuid: function() {
      return "" + (++_uniq_id);
    },
    escapeRegexp: function(str) {
      return str.replace(/[-[\]{}()*+?.,\\^$|#]/g, "\\$&");
    },
    is_email: function(str) {
      return _email_regexp.test(str);
    },
    is_html: function(str) {
      return _html_regexp.test(str);
    },
    camelCase: function(string) {
      var word;
      string = string + "";
      if (string.length) {
        return ((function() {
          var _i, _len, _ref, _results;
          _ref = string.split('_');
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            word = _ref[_i];
            _results.push(pi.utils.capitalize(word));
          }
          return _results;
        })()).join('');
      } else {
        return string;
      }
    },
    snake_case: function(string) {
      var matches, word;
      string = string + "";
      if (string.length) {
        matches = string.match(/((?:^[^A-Z]|[A-Z])[^A-Z]*)/g);
        return ((function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = matches.length; _i < _len; _i++) {
            word = matches[_i];
            _results.push(word.toLowerCase());
          }
          return _results;
        })()).join('_');
      } else {
        return string;
      }
    },
    capitalize: function(word) {
      return word[0].toUpperCase() + word.slice(1);
    },
    serialize: function(val) {
      return val = (function() {
        switch (false) {
          case !(val == null):
            return null;
          case val !== 'true':
            return true;
          case val !== 'false':
            return false;
          case !isNaN(Number(val)):
            return val;
          default:
            return Number(val);
        }
      })();
    },
    clone: function(obj, except) {
      var flags, key, newInstance;
      if (except == null) {
        except = [];
      }
      if ((obj == null) || typeof obj !== 'object') {
        return obj;
      }
      if (obj instanceof Date) {
        return new Date(obj.getTime());
      }
      if (obj instanceof RegExp) {
        flags = '';
        if (obj.global != null) {
          flags += 'g';
        }
        if (obj.ignoreCase != null) {
          flags += 'i';
        }
        if (obj.multiline != null) {
          flags += 'm';
        }
        if (obj.sticky != null) {
          flags += 'y';
        }
        return new RegExp(obj.source, flags);
      }
      if (obj instanceof Element) {
        return obj.cloneNode(true);
      }
      newInstance = new obj.constructor();
      for (key in obj) {
        if ((__indexOf.call(except, key) < 0)) {
          newInstance[key] = pi.utils.clone(obj[key]);
        }
      }
      return newInstance;
    },
    sort: function(arr, keys, reverse) {
      if (reverse == null) {
        reverse = false;
      }
      return arr.sort(curry(_keys_compare, [keys, reverse], null, true));
    },
    sort_by: function(arr, key, reverse) {
      if (reverse == null) {
        reverse = false;
      }
      return arr.sort(curry(_key_compare, [key, reverse], null, true));
    },
    object_matcher: function(obj) {
      var key, val;
      for (key in obj) {
        val = obj[key];
        if (typeof val === "string") {
          obj[key] = function(value) {
            return !!value.match(new RegExp(val, 'i'));
          };
        } else if (val instanceof Object) {
          obj[key] = object_matcher(val);
        } else {
          obj[key] = function(value) {
            return val === value;
          };
        }
      }
      return function(item) {
        var matcher;
        for (key in obj) {
          matcher = obj[key];
          if (!((item[key] != null) && matcher(item[key]))) {
            return false;
          }
        }
        return true;
      };
    },
    debounce: function(period, fun, ths) {
      var _buf, _wait;
      if (ths == null) {
        ths = null;
      }
      _wait = false;
      _buf = null;
      return function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        if (_wait) {
          _buf = args;
          return;
        }
        pi.utils.after(period, function() {
          _wait = false;
          if (_buf != null) {
            return fun.apply(ths, _buf);
          }
        });
        _wait = true;
        if (_buf == null) {
          return fun.apply(ths, args);
        }
      };
    },
    curry: function(fun, args, ths, last) {
      if (args == null) {
        args = [];
      }
      if (ths == null) {
        ths = this;
      }
      if (last == null) {
        last = false;
      }
      fun = "function" === typeof fun ? fun : ths[fun];
      args = args instanceof Array ? args : [args];
      return function() {
        var rest;
        rest = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return fun.apply(ths, last ? rest.concat(args) : args.concat(rest));
      };
    },
    delayed: function(delay, fun, args, ths) {
      if (args == null) {
        args = [];
      }
      if (ths == null) {
        ths = this;
      }
      return function() {
        return setTimeout(pi.utils.curry(fun, args, ths), delay);
      };
    },
    after: function(delay, fun, ths) {
      return delayed(delay, fun, [], ths)();
    },
    merge: function(to, from) {
      var key, obj, prop;
      obj = pi.utils.clone(to);
      for (key in from) {
        if (!__hasProp.call(from, key)) continue;
        prop = from[key];
        obj[key] = prop;
      }
      return obj;
    },
    extend: function(target, data) {
      var key, prop;
      for (key in data) {
        if (!__hasProp.call(data, key)) continue;
        prop = data[key];
        if (target[key] == null) {
          target[key] = prop;
        }
      }
      return target;
    }
  };
})(this);
;(function(context) {
  "use strict";
  var pi, utils, _true;
  pi = context.pi = context.pi || {};
  utils = pi.utils;
  pi.Event = (function() {
    function Event(event) {
      if ((event != null) && typeof event === "object") {
        utils.extend(this, event);
      } else {
        this.type = event;
      }
      this.canceled = false;
    }

    Event.prototype.cancel = function() {
      return this.canceled = true;
    };

    return Event;

  })();
  _true = function() {
    return true;
  };
  pi.EventListener = (function() {
    function EventListener(type, handler, context, disposable, conditions) {
      this.type = type;
      this.handler = handler;
      this.context = context != null ? context : null;
      this.disposable = disposable != null ? disposable : false;
      this.conditions = conditions;
      if (this.handler._uuid == null) {
        this.handler._uuid = "fun" + utils.uuid();
      }
      this.uuid = "" + this.type + ":" + this.handler._uuid;
      if (typeof this.conditions !== 'function') {
        this.conditions = _true;
      }
      if (this.context != null) {
        if (this.context._uuid == null) {
          this.context._uuid = "obj" + utils.uuid();
        }
        this.uuid += ":" + this.context._uuid;
      }
    }

    EventListener.prototype.dispatch = function(event) {
      if (this.disposed || !this.conditions(event)) {
        return;
      }
      this.handler.call(this.context, event);
      if (this.disposable) {
        return this.dispose();
      }
    };

    EventListener.prototype.dispose = function() {
      this.handler = this.context = this.conditions = null;
      return this.disposed = true;
    };

    return EventListener;

  })();
  return pi.EventDispatcher = (function() {
    function EventDispatcher() {
      this.listeners = {};
      this.listeners_by_key = {};
    }

    EventDispatcher.prototype.on = function(event, callback, context, conditions) {
      return this.add_listener(new pi.EventListener(event, callback, context, false, conditions));
    };

    EventDispatcher.prototype.one = function(event, callback, context, conditions) {
      return this.add_listener(new pi.EventListener(event, callback, context, true, conditions));
    };

    EventDispatcher.prototype.off = function(event, callback, context, conditions) {
      return this.remove_listener(event, callback, context, conditions);
    };

    EventDispatcher.prototype.trigger = function(event, data) {
      var listener, _i, _len, _ref;
      if (!(event instanceof pi.Event)) {
        event = new pi.Event(event);
      }
      if (data != null) {
        event.data = data;
      }
      event.currentTarget = this;
      if (this.listeners[event.type] != null) {
        utils.debug("Event: " + event.type);
        _ref = this.listeners[event.type];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          listener = _ref[_i];
          listener.dispatch(event);
          if (event.canceled === true) {
            break;
          }
        }
        this.remove_disposed_listeners();
      }
    };

    EventDispatcher.prototype.add_listener = function(listener) {
      var _base, _name;
      (_base = this.listeners)[_name = listener.type] || (_base[_name] = []);
      this.listeners[listener.type].push(listener);
      return this.listeners_by_key[listener.uuid] = listener;
    };

    EventDispatcher.prototype.remove_listener = function(type, callback, context, conditions) {
      var listener, uuid, _i, _len, _ref;
      if (context == null) {
        context = null;
      }
      if (conditions == null) {
        conditions = null;
      }
      if (type == null) {
        return this.remove_all();
      }
      if (this.listeners[type] == null) {
        return;
      }
      if (callback == null) {
        _ref = this.listeners[type];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          listener = _ref[_i];
          listener.dispose();
        }
        this.remove_type(type);
        this.remove_disposed_listeners();
        return;
      }
      uuid = "" + type + ":" + callback._uuid;
      if (context != null) {
        uuid += ":" + context._uuid;
      }
      listener = this.listeners_by_key[uuid];
      if (listener != null) {
        delete this.listeners_by_key[uuid];
        this.remove_listener_from_list(type, listener);
      }
    };

    EventDispatcher.prototype.remove_listener_from_list = function(type, listener) {
      if ((this.listeners[type] != null) && this.listeners[type].indexOf(listener) > -1) {
        this.listeners[type] = this.listeners[type].filter(function(item) {
          return item !== listener;
        });
        if (!this.listeners[type].length) {
          return this.remove_type(type);
        }
      }
    };

    EventDispatcher.prototype.remove_disposed_listeners = function() {
      var key, listener, _ref, _results;
      _ref = this.listeners_by_key;
      _results = [];
      for (key in _ref) {
        listener = _ref[key];
        if (listener.disposed) {
          this.remove_listener_from_list(listener.type, listener);
          _results.push(delete this.listeners_by_key[key]);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    EventDispatcher.prototype.remove_type = function(type) {
      return delete this.listeners[type];
    };

    EventDispatcher.prototype.remove_all = function() {
      this.listeners = {};
      return this.listeners_by_key = {};
    };

    return EventDispatcher;

  })();
})(this);
;var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

(function(context) {
  "use strict";
  var Events, NodEvent, pi, utils, _mouse_regexp, _prepare_event, _selector, _selector_regexp;
  pi = context.pi = context.pi || {};
  utils = pi.utils;
  Events = pi.Events || {};
  pi.NodEvent = (function(_super) {
    __extends(NodEvent, _super);

    NodEvent.aliases = {};

    NodEvent.reversed_aliases = {};

    NodEvent.delegates = {};

    NodEvent.add = (function() {
      if (typeof Element.prototype.addEventListener === "undefined") {
        return function(nod, event, handler) {
          return nod.attachEvent("on" + event, handler);
        };
      } else {
        return function(nod, event, handler) {
          return nod.addEventListener(event, handler);
        };
      }
    })();

    NodEvent.remove = (function() {
      if (typeof Element.prototype.removeEventListener === "undefined") {
        return function(nod, event, handler) {
          return nod.detachEvent("on" + event, handler);
        };
      } else {
        return function(nod, event, handler) {
          return nod.removeEventListener(event, handler);
        };
      }
    })();

    NodEvent.register_delegate = function(type, delegate) {
      return this.delegates[type] = delegate;
    };

    NodEvent.has_delegate = function(type) {
      return !!this.delegates[type];
    };

    NodEvent.register_alias = function(from, to) {
      this.aliases[from] = to;
      return this.reversed_aliases[to] = from;
    };

    NodEvent.has_alias = function(type) {
      return !!this.aliases[type];
    };

    NodEvent.is_aliased = function(type) {
      return !!this.reversed_aliases[type];
    };

    function NodEvent(event) {
      this.event = event || window.event;
      this.origTarget = this.event.target || this.event.srcElement;
      this.target = pi.Nod.create(this.origTarget);
      this.type = this.constructor.is_aliased[event.type] ? this.constructor.reversed_aliases[event.type] : event.type;
      this.ctrlKey = this.event.ctrlKey;
      this.shiftKey = this.event.shiftKey;
      this.altKey = this.event.altKey;
      this.metaKey = this.event.metaKey;
      this.detail = this.event.detail;
    }

    NodEvent.prototype.stopPropagation = function() {
      if (this.event.stopPropagation) {
        return this.event.stopPropagation();
      } else {
        return this.event.cancelBubble = true;
      }
    };

    NodEvent.prototype.stopImmediatePropagation = function() {
      if (this.event.stopImmediatePropagation) {
        return this.event.stopImmediatePropagation();
      } else {
        this.event.cancelBubble = true;
        return this.event.cancel = true;
      }
    };

    NodEvent.prototype.preventDefault = function() {
      if (this.event.preventDefault) {
        return this.event.preventDefault();
      } else {
        return this.event.returnValue = false;
      }
    };

    NodEvent.prototype.cancel = function() {
      this.stopImmediatePropagation();
      this.preventDefault();
      return NodEvent.__super__.cancel.apply(this, arguments);
    };

    return NodEvent;

  })(pi.Event);
  NodEvent = pi.NodEvent;
  _mouse_regexp = /(click|mouse|contextmenu)/i;
  pi.MouseEvent = (function(_super) {
    __extends(MouseEvent, _super);

    function MouseEvent() {
      MouseEvent.__super__.constructor.apply(this, arguments);
      this.button = this.event.button;
      if (this.pageX == null) {
        this.pageX = this.event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        this.pageY = this.event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
      }
      if (this.offsetX == null) {
        this.offsetX = this.event.layerX - this.origTarget.offsetLeft;
        this.offsetY = this.event.layerY - this.origTarget.offsetTop;
      }
      this.wheelDelta = this.event.wheelDelta;
      if (this.wheelDelta == null) {
        this.wheelDelta = -this.event.detail * 40;
      }
    }

    return MouseEvent;

  })(NodEvent);
  _prepare_event = function(e) {
    if (_mouse_regexp.test(e.type)) {
      return new pi.MouseEvent(e);
    } else {
      return new NodEvent(e);
    }
  };
  _selector_regexp = /[\.#]/;
  _selector = function(s, parent) {
    if (!_selector_regexp.test(s)) {
      return function(e) {
        return e.target.node.matches(s);
      };
    } else {
      return function(e) {
        var node;
        parent || (parent = document);
        node = e.target.node;
        if (node.matches(s)) {
          return true;
        }
        while ((node = node.parentNode) !== parent) {
          if (node.matches(s)) {
            return (e.target = pi.Nod.create(node));
          }
        }
      };
    }
  };
  return pi.NodEventDispatcher = (function(_super) {
    __extends(NodEventDispatcher, _super);

    function NodEventDispatcher() {
      var _this = this;
      NodEventDispatcher.__super__.constructor.apply(this, arguments);
      this.native_event_listener = function(event) {
        return _this.trigger(_prepare_event(event));
      };
    }

    NodEventDispatcher.prototype.listen = function(selector, event, callback, context) {
      return this.on(event, callback, context, _selector(selector));
    };

    NodEventDispatcher.prototype.add_native_listener = function(type) {
      if (NodEvent.has_delegate(type)) {
        return NodEvent.delegates[type].add(this.node, this.native_event_listener);
      } else {
        return NodEvent.add(this.node, type, this.native_event_listener);
      }
    };

    NodEventDispatcher.prototype.remove_native_listener = function(type) {
      if (NodEvent.has_delegate(type)) {
        return NodEvent.delegates[type].remove(this.node);
      } else {
        return NodEvent.remove(this.node, type, this.native_event_listener);
      }
    };

    NodEventDispatcher.prototype.add_listener = function(listener) {
      if (!this.listeners[listener.type]) {
        this.add_native_listener(listener.type);
        if (NodEvent.has_alias(listener.type)) {
          this.add_native_listener(NodEvent.aliases[listener.type]);
        }
      }
      return NodEventDispatcher.__super__.add_listener.apply(this, arguments);
    };

    NodEventDispatcher.prototype.remove_type = function(type) {
      this.remove_native_listener(type);
      if (NodEvent.has_alias(type)) {
        this.remove_native_listener(NodEvent.aliases[type]);
      }
      return NodEventDispatcher.__super__.remove_type.apply(this, arguments);
    };

    NodEventDispatcher.prototype.remove_all = function() {
      var list, type, _fn, _ref,
        _this = this;
      _ref = this.listeners;
      _fn = function() {
        _this.remove_native_listener(type);
        if (NodEvent.has_alias(type)) {
          return _this.remove_native_listener(NodEvent.aliases[type]);
        }
      };
      for (type in _ref) {
        if (!__hasProp.call(_ref, type)) continue;
        list = _ref[type];
        _fn();
      }
      return NodEventDispatcher.__super__.remove_all.apply(this, arguments);
    };

    return NodEventDispatcher;

  })(pi.EventDispatcher);
})(this);
;var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

(function(context) {
  "use strict";
  var d, pi, prop, utils, _fragment, _from_dataCase, _geometry_styles, _i, _len, _node, _prop_hash, _ref, _to_dataCase;
  pi = context.pi = context.pi || {};
  utils = pi.utils;
  _prop_hash = function(method, callback) {
    return pi.Nod.prototype[method] = function(prop, val) {
      var k, p;
      if (typeof prop !== "object") {
        return callback.call(this, prop, val);
      }
      for (k in prop) {
        if (!__hasProp.call(prop, k)) continue;
        p = prop[k];
        callback.call(this, k, p);
      }
    };
  };
  _geometry_styles = function(sty) {
    var s, _fn, _i, _len;
    _fn = function() {
      var name;
      name = s;
      pi.Nod.prototype[name] = function(val) {
        if (val === void 0) {
          return this.node["offset" + (utils.capitalize(name))];
        }
        this.node.style[name] = Math.round(val) + "px";
        return this;
      };
    };
    for (_i = 0, _len = sty.length; _i < _len; _i++) {
      s = sty[_i];
      _fn();
    }
  };
  _node = function(n) {
    if (n instanceof pi.Nod) {
      return n.node;
    }
    if (typeof n === "string") {
      return _fragment(n);
    }
    return n;
  };
  _from_dataCase = function(str) {
    var w, words;
    words = str.split('-');
    return words[0] + ((function() {
      var _i, _len, _ref, _results;
      _ref = words.slice(1);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        w = _ref[_i];
        _results.push(utils.capitalize(w));
      }
      return _results;
    })()).join('');
  };
  _to_dataCase = function(str) {
    return utils.snake_case(str).replace('_', '-');
  };
  _fragment = function(html) {
    var f, node, temp, _i, _len, _ref;
    temp = document.createElement('div');
    temp.innerHTML = html;
    f = document.createDocumentFragment();
    _ref = temp.children;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      node = _ref[_i];
      f.appendChild(node);
    }
    return f;
  };
  pi.Nod = (function(_super) {
    __extends(Nod, _super);

    function Nod(node) {
      Nod.__super__.constructor.apply(this, arguments);
      this.node = node;
      if (this.node) {
        this.node._nod = this;
      }
    }

    Nod.create = function(node) {
      switch (false) {
        case !!node:
          return null;
        case !(node instanceof this):
          return node;
        case !(typeof node["_nod"] !== "undefined"):
          return node._nod;
        case !utils.is_html(node):
          return this.create_html(node);
        case typeof node !== "string":
          return new this(document.createElement(node));
        default:
          return new this(node);
      }
    };

    Nod.create_html = function(html) {
      var temp;
      temp = document.createElement('div');
      temp.innerHTML = html;
      return new this(temp.firstChild);
    };

    Nod.prototype.find = function(selector) {
      return pi.Nod.create(this.node.querySelector(selector));
    };

    Nod.prototype.all = function(selector) {
      return this.node.querySelectorAll(selector);
    };

    Nod.prototype.each = function(selector, callback) {
      var i, node, _i, _len, _ref, _results;
      i = 0;
      _ref = this.node.querySelectorAll(selector);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        if (callback.call(null, node, i) === true) {
          break;
        }
        _results.push(i++);
      }
      return _results;
    };

    Nod.prototype.first = function(selector) {
      return this.find(selector);
    };

    Nod.prototype.last = function(selector) {
      return this.find("" + selector + ":last-child");
    };

    Nod.prototype.nth = function(selector, n) {
      return this.find("" + selector + ":nth-child(" + n + ")");
    };

    Nod.prototype.parent = function() {
      return pi.Nod.create(this.node.parentNode);
    };

    Nod.prototype.children = function(callback) {
      var i, n, _i, _len, _ref;
      if (typeof callback === 'function') {
        i = 0;
        _ref = this.node.children;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          n = _ref[_i];
          if (callback.call(null, n, i) === true) {
            break;
          }
          i++;
        }
        return this;
      } else {
        return this.node.children;
      }
    };

    Nod.prototype.wrap = function() {
      var wrapper;
      wrapper = pi.Nod.create('div');
      this.node.parentNode.insertBefore(wrapper.node, this.node);
      wrapper.append(this.node);
      return pi.Nod.create(wrapper);
    };

    Nod.prototype.prepend = function(node) {
      node = _node(node);
      this.node.insertBefore(node, this.node.firstChild);
      return this;
    };

    Nod.prototype.append = function(node) {
      node = _node(node);
      this.node.appendChild(node);
      return this;
    };

    Nod.prototype.insertBefore = function(node) {
      node = _node(node);
      this.node.parentNode.insertBefore(node, this.node);
      return this;
    };

    Nod.prototype.insertAfter = function(node) {
      node = _node(node);
      this.node.parentNode.insertBefore(node, this.node.nextSibling);
      return this;
    };

    Nod.prototype.detach = function() {
      this.node.parentNode.removeChild(this.node);
      return this;
    };

    Nod.prototype.detach_children = function() {
      while (this.node.children.length) {
        this.node.removeChild(this.node.children[0]);
      }
      return this;
    };

    Nod.prototype.remove = function() {
      this.detach();
      this.html('');
      return this;
    };

    Nod.prototype.empty = function() {
      this.html('');
      return this;
    };

    Nod.prototype.clone = function() {
      var c;
      c = document.createElement(this.node.nameNode);
      c.innerHTML = this.node.outerHTML;
      return new pi.Nod(c.firstChild);
    };

    Nod.prototype.html = function(val) {
      if (val != null) {
        this.node.innerHTML = val;
        return this;
      } else {
        return this.node.innerHTML;
      }
    };

    Nod.prototype.text = function(val) {
      if (val != null) {
        this.node.textContent = val;
        return this;
      } else {
        return this.node.textContent;
      }
    };

    Nod.prototype.value = function(val) {
      if (val != null) {
        this.attr('value', val);
        return this;
      } else {
        return this.attr('value');
      }
    };

    Nod.prototype.addClass = function() {
      var c, _i, _len;
      for (_i = 0, _len = arguments.length; _i < _len; _i++) {
        c = arguments[_i];
        this.node.classList.add(c);
      }
      return this;
    };

    Nod.prototype.removeClass = function() {
      var c, _i, _len;
      for (_i = 0, _len = arguments.length; _i < _len; _i++) {
        c = arguments[_i];
        this.node.classList.remove(c);
      }
      return this;
    };

    Nod.prototype.toggleClass = function(c) {
      this.node.classList.toggle(c);
      return this;
    };

    Nod.prototype.hasClass = function(c) {
      return this.node.classList.contains(c);
    };

    Nod.prototype.x = function() {
      var node, offset;
      offset = this.node.offsetLeft;
      node = this.node;
      while ((node = node.offsetParent)) {
        offset += node.offsetLeft;
      }
      return offset;
    };

    Nod.prototype.y = function() {
      var node, offset;
      offset = this.node.offsetTop;
      node = this.node;
      while ((node = node.offsetParent)) {
        offset += node.offsetTop;
      }
      return offset;
    };

    Nod.prototype.move = function(x, y) {
      return this.style({
        left: x,
        top: y
      });
    };

    Nod.prototype.position = function() {
      return {
        x: this.x(),
        y: this.y()
      };
    };

    Nod.prototype.offset = function() {
      return {
        x: this.node.offsetLeft,
        y: this.node.offsetTop
      };
    };

    Nod.prototype.size = function(width, height) {
      var old_h, old_w;
      if (width == null) {
        width = null;
      }
      if (height == null) {
        height = null;
      }
      if (!((width != null) && (height != null))) {
        return {
          width: this.width(),
          height: this.height()
        };
      }
      if ((width != null) && (height != null)) {
        this.width(width);
        this.height(height);
      } else {
        old_h = this.height();
        old_w = this.width();
        if (width != null) {
          this.width(width);
          this.height(old_h * width / old_w);
        } else {
          this.height(height);
          this.width(old_w * height / old_h);
        }
      }
      this.trigger('resize');
    };

    Nod.prototype.show = function() {
      return this.nod.style.display = "block";
    };

    Nod.prototype.hide = function() {
      return this.nod.style.display = "none";
    };

    Nod.prototype.focus = function() {
      this.node.focus();
      return this;
    };

    Nod.prototype.blur = function() {
      this.node.blur();
      return this;
    };

    return Nod;

  })(pi.NodEventDispatcher);
  _prop_hash("data", (function() {
    if (typeof DOMStringMap === "undefined") {
      return function(prop, val) {
        var attr, dataset, _i, _len, _ref, _val;
        if (prop === void 0) {
          dataset = {};
          _ref = this.node.attributes;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            attr = _ref[_i];
            if (attr.name.indexOf('data-') === 0) {
              dataset[_from_dataCase(attr.name.slice(5))] = attr.value;
            }
          }
          return dataset;
        }
        prop = "data-" + _to_dataCase(prop);
        if (val == null) {
          _val = this.attr(prop);
          if (_val === null) {
            _val = void 0;
          }
          if (val === void 0) {
            return _val;
          }
          this.attr(prop, null);
          return _val;
        } else {
          return this.attr(prop, val);
        }
      };
    } else {
      return function(prop, val) {
        var data;
        if (prop === void 0) {
          return this.node.dataset;
        }
        data = this.node.dataset;
        if (val === void 0) {
          return data[prop];
        }
        if (val === null) {
          val = data[prop];
          delete data[prop];
          return val;
        } else {
          return data[prop] = val;
        }
      };
    }
  })());
  _prop_hash("style", function(prop, val) {
    if (val === void 0) {
      return this.node.style[prop];
    }
    return this.node.style[prop] = val;
  });
  _prop_hash("attr", function(prop, val) {
    if (val === void 0) {
      return this.node.getAttribute(prop);
    }
    if (val === null) {
      this.node.removeAttribute(prop);
    }
    return this.node.setAttribute(prop, val);
  });
  _geometry_styles(["top", "left", "width", "height"]);
  _ref = ["top", "left", "width", "height"];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    d = _ref[_i];
    prop = "scroll" + (utils.capitalize(d));
    pi.Nod.prototype[prop] = function() {
      return this.node[prop];
    };
  }
  pi.NodRoot = (function(_super) {
    __extends(NodRoot, _super);

    NodRoot.instance = null;

    function NodRoot() {
      if (pi.NodRoot.instance) {
        throw "NodRoot is already defined!";
      }
      pi.NodRoot.instance = this;
      NodRoot.__super__.constructor.call(this, document.documentElement);
    }

    NodRoot.prototype.initialize = function() {
      var load_handler, ready_handler, _ready_state,
        _this = this;
      _ready_state = document.attachEvent ? 'complete' : 'interactive';
      this._loaded = document.readyState === 'complete';
      if (!this._loaded) {
        this._loaded_callbacks = [];
        load_handler = function() {
          utils.debug('DOM loaded');
          _this._loaded = true;
          _this.fire_all();
          return pi.NodEvent.remove(window, 'load', load_handler);
        };
        pi.NodEvent.add(window, 'load', load_handler);
      }
      if (!this._ready) {
        if (document.addEventListener) {
          this._ready = document.readyState === _ready_state;
          if (this._ready) {
            return;
          }
          this._ready_callbacks = [];
          ready_handler = function() {
            utils.debug('DOM ready');
            _this._ready = true;
            _this.fire_ready();
            return document.removeEventListener('DOMContentLoaded', ready_handler);
          };
          return document.addEventListener('DOMContentLoaded', ready_handler);
        } else {
          this._ready = document.readyState === _ready_state;
          if (this._ready) {
            return;
          }
          this._ready_callbacks = [];
          ready_handler = function() {
            if (document.readyState === _ready_state) {
              utils.debug('DOM ready');
              _this._ready = true;
              _this.fire_ready();
              return document.detachEvent('onreadystatechange', ready_handler);
            }
          };
          return document.attachEvent('onreadystatechange', ready_handler);
        }
      }
    };

    NodRoot.prototype.ready = function(callback) {
      if (this._ready) {
        return callback.call(null);
      } else {
        return this._ready_callbacks.push(callback);
      }
    };

    NodRoot.prototype.loaded = function(callback) {
      if (this._loaded) {
        return callback.call(null);
      } else {
        return this._loaded_callbacks.push(callback);
      }
    };

    NodRoot.prototype.fire_all = function() {
      var callback;
      if (this._ready_callbacks) {
        this.fire_ready();
      }
      while (callback = this._loaded_callbacks.shift()) {
        callback.call(null);
      }
      return this._loaded_callbacks = null;
    };

    NodRoot.prototype.fire_ready = function() {
      var callback;
      while (callback = this._ready_callbacks.shift()) {
        callback.call(null);
      }
      return this._ready_callbacks = null;
    };

    NodRoot.prototype.scrollTop = function() {
      return this.node.scrollTop || document.body.scrollTop;
    };

    NodRoot.prototype.scrollLeft = function() {
      return this.node.scrollLeft || document.body.scrollLeft;
    };

    NodRoot.prototype.scrollHeight = function() {
      return this.node.scrollHeight;
    };

    NodRoot.prototype.scrollWidth = function() {
      return this.node.scrollWidth;
    };

    NodRoot.prototype.height = function() {
      return window.innerHeight || this.node.clientHeight;
    };

    NodRoot.prototype.width = function() {
      return window.innerWidth || this.node.clientWidth;
    };

    return NodRoot;

  })(pi.Nod);
  pi.Nod.root = new pi.NodRoot();
  pi.Nod.win = new pi.Nod(window);
  return pi.Nod.root.initialize();
})(this);
;(function(context) {
  "use strict";
  var pi, utils;
  pi = context.pi = context.pi || {};
  utils = pi.utils;
  return pi.NodEvent.register_alias('mousewheel', 'DOMMouseScroll');
})(this);
;(function(context) {
  "use strict";
  var level, pi, utils, val, _log_levels, _results, _show_log;
  pi = context.pi = context.pi || {};
  utils = pi.utils;
  pi.log_level || (pi.log_level = "info");
  _log_levels = {
    error: {
      color: "#dd0011",
      sort: 4
    },
    debug: {
      color: "#009922",
      sort: 0
    },
    info: {
      color: "#1122ff",
      sort: 1
    },
    warning: {
      color: "#ffaa33",
      sort: 2
    }
  };
  _show_log = function(level) {
    return _log_levels[pi.log_level].sort <= _log_levels[level].sort;
  };
  utils.log = function(level, message) {
    return _show_log(level) && console.log("%c " + (utils.time.now('%H:%M:%S:%L')) + " [" + level + "]", "color: " + _log_levels[level].color, message);
  };
  _results = [];
  for (level in _log_levels) {
    val = _log_levels[level];
    _results.push(utils[level] = utils.curry(utils.log, level));
  }
  return _results;
})(this);
;(function(context) {
  "use strict";
  var utils, _formatter, _pad, _reg, _splitter;
  utils = context.pi.utils;
  _reg = /%([a-zA-Z])/g;
  _splitter = (function() {
    if ("%a".split(_reg).length === 0) {
      return function(str) {
        var flag, len, matches, parts, res;
        matches = str.match(_reg);
        parts = str.split(_reg);
        res = [];
        if (str[0] === "%") {
          res.push("", matches.shift()[1]);
        }
        len = matches.length + parts.length;
        flag = false;
        while (len > 0) {
          res.push(flag ? matches.shift()[1] : parts.shift());
          flag = !flag;
          len--;
        }
        return res;
      };
    } else {
      return function(str) {
        return str.split(_reg);
      };
    }
  })();
  _pad = function(val, offset) {
    var n;
    if (offset == null) {
      offset = 1;
    }
    n = 10;
    while (offset) {
      if (val < n) {
        val = "0" + val;
      }
      n *= 10;
      offset--;
    }
    return val;
  };
  _formatter = {
    "H": function(d) {
      return _pad(d.getHours());
    },
    "k": function(d) {
      return d.getHours();
    },
    "I": function(d) {
      return _pad(_formatter.l(d));
    },
    "l": function(d) {
      var h;
      h = d.getHours();
      if (h > 12) {
        return h - 12;
      } else {
        return h;
      }
    },
    "M": function(d) {
      return _pad(d.getMinutes());
    },
    "S": function(d) {
      return _pad(d.getSeconds());
    },
    "L": function(d) {
      return _pad(d.getMilliseconds(), 2);
    },
    "z": function(d) {
      var offset, sign;
      offset = d.getTimezoneOffset();
      sign = offset > 0 ? "-" : "+";
      offset = Math.abs(offset);
      return sign + _pad(Math.floor(offset / 60)) + ":" + _pad(offset % 60);
    },
    "Y": function(d) {
      return d.getFullYear();
    },
    "y": function(d) {
      return (d.getFullYear() + "").slice(2);
    },
    "m": function(d) {
      return _pad(d.getMonth() + 1);
    },
    "d": function(d) {
      return _pad(d.getDate());
    },
    "P": function(d) {
      if (d.getHours() > 11) {
        return "PM";
      } else {
        return "AM";
      }
    },
    "p": function(d) {
      return _formatter.P(d).toLowerCase();
    }
  };
  return utils.time = {
    now: function(fmt) {
      return utils.time.format(new Date(), fmt);
    },
    format: function(t, fmt) {
      var flag, fmt_arr, i, res, _i, _len;
      if (fmt == null) {
        return t;
      }
      fmt_arr = _splitter(fmt);
      flag = false;
      res = "";
      for (_i = 0, _len = fmt_arr.length; _i < _len; _i++) {
        i = fmt_arr[_i];
        res += (flag ? _formatter[i].call(null, t) : i);
        flag = !flag;
      }
      return res;
    }
  };
})(this);
;
//# sourceMappingURL=pieces.core.js.map