var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

(function(context) {
  "use strict";
  var Nod, event_re, options_re, pi, utils, _str_reg;
  pi = context.pi = context.pi || {};
  utils = pi.utils;
  pi.config = {};
  Nod = pi.Nod;
  pi.API_DATA_KEY = "js_piece";
  pi._storage = {};
  pi.Base = (function(_super) {
    __extends(Base, _super);

    function Base(node, options) {
      this.node = node;
      this.options = options != null ? options : {};
      Base.__super__.constructor.apply(this, arguments);
      if (!this.node) {
        return;
      }
      this.pid = this.data('pi');
      this.visible = this.enabled = true;
      this.active = false;
      if (this.options.disabled || this.hasClass('is-disabled')) {
        this.disable();
      }
      if (this.options.hidden || this.hasClass('is-hidden')) {
        this.hide();
      }
      if (this.options.active || this.hasClass('is-active')) {
        this.activate();
      }
      this.initialize();
      this.setup_events();
      this.init_plugins();
    }

    Base.prototype.init_nod = function(target) {
      if (typeof target === "string") {
        target = Nod.root.find(target) || target;
      }
      return Nod.create(target);
    };

    Base.prototype.init_plugins = function() {
      var name, _i, _len, _ref, _results;
      if (this.options.plugins != null) {
        _ref = this.options.plugins;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          name = _ref[_i];
          _results.push(this.attach_plugin(name));
        }
        return _results;
      }
    };

    Base.prototype.attach_plugin = function(name) {
      name = utils.camelCase(name);
      if (pi[name] != null) {
        utils.debug("plugin attached " + name);
        return new pi[name](this);
      }
    };

    Base.prototype.initialize = function() {
      if (this.pid) {
        pi._storage[this.pid] = this;
      }
      return this._initialized = true;
    };

    Base.prototype.setup_events = function() {
      var event, handler, _ref, _results;
      _ref = this.options.events;
      _results = [];
      for (event in _ref) {
        handler = _ref[event];
        _results.push(this.on(event, pi.str_to_fun(handler, this)));
      }
      return _results;
    };

    Base.prototype.delegate = function(methods, to) {
      var method, _fn, _i, _len,
        _this = this;
      _fn = function(method) {
        _this[method] = function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          return _this[to][method].apply(_this, args);
        };
      };
      for (_i = 0, _len = methods.length; _i < _len; _i++) {
        method = methods[_i];
        _fn(method);
      }
    };

    Base.prototype.trigger = function(event, data) {
      if (this.enabled || event === 'disabled') {
        return Base.__super__.trigger.call(this, event, data);
      }
    };

    Base.prototype.show = function() {
      if (!this.visible) {
        this.removeClass('is-hidden');
        this.visible = true;
        this.trigger('shown');
      }
      return this;
    };

    Base.prototype.hide = function() {
      if (this.visible) {
        this.addClass('is-hidden');
        this.visible = false;
        this.trigger('hidden');
      }
      return this;
    };

    Base.prototype.enable = function() {
      if (!this.enabled) {
        this.removeClass('is-disabled');
        this.attr('disabled', null);
        this.enabled = true;
        this.trigger('enabled');
      }
      return this;
    };

    Base.prototype.disable = function() {
      if (this.enabled) {
        this.addClass('is-disabled');
        this.attr('disabled', 'disabled');
        this.enabled = false;
        this.trigger('disabled');
      }
      return this;
    };

    Base.prototype.activate = function() {
      if (!this.active) {
        this.addClass('is-active');
        this.active = true;
        this.trigger('active');
      }
      return this;
    };

    Base.prototype.deactivate = function() {
      if (this.active) {
        this.removeClass('is-active');
        this.active = false;
        this.trigger('inactive');
      }
      return this;
    };

    return Base;

  })(pi.Nod);
  options_re = new RegExp('option(\\w+)', 'i');
  event_re = new RegExp('event(\\w+)', 'i');
  pi.find = function(pid) {
    return pi._storage[pid];
  };
  pi.init_component = function(nod) {
    var component, component_name;
    component_name = utils.camelCase(nod.data('component') || 'base');
    component = pi[component_name];
    if ((component != null) && !nod.data(pi.API_DATA_KEY)) {
      utils.debug("component created: " + component_name);
      return new pi[component_name](nod.node, pi.gather_options(nod));
    } else {
      throw new ReferenceError('unknown or initialized component: ' + component_name);
    }
  };
  pi.piecify = function(context) {
    context = context instanceof Nod ? context : new Nod(context || document.documentElement);
    context.each(".pi", function(nod) {
      return pi.init_component(new Nod(nod));
    });
    return pi.event.trigger('piecified', {
      context: context
    });
  };
  pi.gather_options = function(el) {
    var key, matches, opts, val, _ref;
    el = el instanceof Nod ? el : new Nod(el);
    opts = {
      component: el.data('component') || 'base',
      plugins: el.data('plugins') ? el.data('plugins').split(/\s+/) : null,
      events: {}
    };
    _ref = el.data();
    for (key in _ref) {
      val = _ref[key];
      if (matches = key.match(options_re)) {
        opts[utils.snake_case(matches[1])] = utils.serialize(val);
        continue;
      }
      if (matches = key.match(event_re)) {
        opts.events[utils.snake_case(matches[1])] = utils.serialize(val);
      }
    }
    return opts;
  };
  pi.call = function(component, method_chain, args) {
    var arg, error, key_, method, method_, target, target_, target_chain, _ref, _ref1, _void;
    if (args == null) {
      args = [];
    }
    try {
      utils.debug("pi call: component - " + component + "; method chain - " + method_chain);
      target = typeof component === 'object' ? component : pi.find(component);
      _ref = (function() {
        var _fn, _i, _len, _ref, _ref1;
        if (method_chain.indexOf(".") < 0) {
          return [method_chain, target];
        } else {
          _ref = method_chain.match(/([\w\d\._]+)\.([\w\d_]+)/), _void = _ref[0], target_chain = _ref[1], method_ = _ref[2];
          target_ = target;
          _ref1 = target_chain.split('.');
          _fn = function(key_) {
            return target_ = target_[key_];
          };
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            key_ = _ref1[_i];
            _fn(key_);
          }
          return [method_, target_];
        }
      })(), method = _ref[0], target = _ref[1];
      if (((_ref1 = target[method]) != null ? _ref1.call : void 0) != null) {
        return target[method].apply(target, (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = args.length; _i < _len; _i++) {
            arg = args[_i];
            _results.push(typeof arg === 'function' ? arg.call(null) : arg);
          }
          return _results;
        })());
      } else {
        return target[method];
      }
    } catch (_error) {
      error = _error;
      return utils.error(error);
    }
  };
  _str_reg = /^['"].+['"]$/;
  pi.prepare_arg = function(arg, host) {
    if (arg[0] === "@") {
      return pi.str_to_fun(arg, host);
    } else {
      if (_str_reg.test(arg)) {
        return arg.slice(1, -1);
      } else {
        return utils.serialize(arg);
      }
    }
  };
  pi.str_to_fun = function(callstr, host) {
    var arg, matches, target;
    if (host == null) {
      host = null;
    }
    matches = callstr.match(/@([\w\d_]+)(?:\.([\w\d_\.]+)(?:\(([@\w\d\.\(\),'"-_]+)\))?)?/);
    target = matches[1] === 'this' ? host : matches[1];
    if (matches[2]) {
      return curry(pi.call, [
        target, matches[2], (matches[3] ? (function() {
          var _i, _len, _ref, _results;
          _ref = matches[3].split(",");
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            arg = _ref[_i];
            _results.push(pi.prepare_arg(arg, host));
          }
          return _results;
        })() : [])
      ]);
    } else {
      if (typeof target === 'object') {
        return function() {
          return target;
        };
      } else {
        return function() {
          return pi.find(target);
        };
      }
    }
  };
  pi.event = new pi.EventDispatcher();
  utils.extend(Nod.prototype, {
    piecify: function() {
      return pi.piecify(this);
    },
    pi_call: function(target, action) {
      if (!this._pi_call || this._pi_action !== action) {
        this._pi_action = action;
        this._pi_call = pi.str_to_fun(action, target);
      }
      return this._pi_call.call(null);
    }
  });
  Nod.root.ready(function() {
    return Nod.root.listen('a', 'click', function(e) {
      if (e.target.attr("href")[0] === "@") {
        utils.debug("handle pi click: " + (e.target.attr("href")));
        e.target.pi_call(e.target, e.target.attr("href"));
        e.cancel();
      }
    });
  });
  context.curry = utils.curry;
  context.delayed = utils.delayed;
  context.after = utils.after;
  context.debounce = utils.debounce;
  context.$ = function(q) {
    if (q[0] === '@') {
      return pi.find(q.slice(1));
    } else if (utils.is_html(q)) {
      return Nod.create(q);
    } else {
      return Nod.root.find(q);
    }
  };
})(this);
;var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

(function(context) {
  "use strict";
  var pi, utils, _ref;
  pi = context.pi = context.pi || {};
  utils = pi.utils;
  return pi.TextInput = (function(_super) {
    __extends(TextInput, _super);

    function TextInput() {
      _ref = TextInput.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    TextInput.prototype.initialize = function() {
      this.input = this.node.nodeName.toLowerCase() === 'input' ? this : this.find('input');
      this.editable = true;
      if (this.options.readonly || this.hasClass('is-readonly')) {
        this.make_readonly();
      }
      return TextInput.__super__.initialize.apply(this, arguments);
    };

    TextInput.prototype.make_editable = function() {
      if (!this.editable) {
        this.input.attr('readonly', null);
        this.removeClass('is-readonly');
        this.editable = true;
        this.trigger('editable');
      }
      return this;
    };

    TextInput.prototype.make_readonly = function() {
      if (this.editable) {
        this.input.attr('readonly', 'readonly');
        this.addClass('is-readonly');
        this.editable = false;
        this.trigger('readonly');
      }
      return this;
    };

    TextInput.prototype.value = function(val) {
      if (this === this.input) {
        return TextInput.__super__.value.apply(this, arguments);
      } else {
        if (val != null) {
          this.input.node.value = val;
          return this;
        } else {
          return this.input.node.value;
        }
      }
    };

    TextInput.prototype.clear = function() {
      return this.input.value('');
    };

    return TextInput;

  })(pi.Base);
})(this);
;var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

(function(context) {
  "use strict";
  var pi, utils, _ref;
  pi = context.pi = context.pi || {};
  utils = pi.utils;
  return pi.Button = (function(_super) {
    __extends(Button, _super);

    function Button() {
      _ref = Button.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Button.prototype.initialize = function() {
      return Button.__super__.initialize.apply(this, arguments);
    };

    return Button;

  })(pi.Base);
})(this);
;var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

(function(context) {
  "use strict";
  var item_klass, list_klass, pi, utils, _ref, _ref1, _ref2;
  pi = context.pi = context.pi || {};
  utils = pi.utils;
  list_klass = (((_ref = pi.config.list) != null ? _ref.list_klass : void 0) != null) || 'list';
  item_klass = (((_ref1 = pi.config.list) != null ? _ref1.item_klass : void 0) != null) || 'item';
  return pi.List = (function(_super) {
    __extends(List, _super);

    function List() {
      _ref2 = List.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    List.string_matcher = function(string) {
      var path, query, regexp, _ref3;
      if (string.indexOf(":") > 0) {
        _ref3 = string.split(":"), path = _ref3[0], query = _ref3[1];
        regexp = new RegExp(query, 'i');
        return function(item) {
          return !!item.nod.find(path).text().match(regexp);
        };
      } else {
        regexp = new RegExp(string, 'i');
        return function(item) {
          return !!item.nod.text().match(regexp);
        };
      }
    };

    List.prototype.initialize = function() {
      var _this = this;
      this.items_cont = this.find("." + list_klass);
      if (!this.items_cont) {
        this.items_cont = this;
      }
      this.item_renderer = this.options.renderer;
      if (this.item_renderer == null) {
        this.item_renderer = function(nod) {
          var item, key, val, _ref3;
          item = {};
          _ref3 = nod.data();
          for (key in _ref3) {
            if (!__hasProp.call(_ref3, key)) continue;
            val = _ref3[key];
            item[utils.snake_case(key)] = utils.serialize(val);
          }
          item.nod = nod;
          return item;
        };
      }
      this.items = [];
      this.buffer = document.createDocumentFragment();
      this.parse_html_items();
      this._check_empty();
      this.listen("." + item_klass, "click", function(e) {
        if (e.origTarget.nodeName !== 'A') {
          return _this._item_clicked(e.target);
        }
      });
      return List.__super__.initialize.apply(this, arguments);
    };

    List.prototype.parse_html_items = function() {
      var _this = this;
      this.items_cont.each("." + item_klass, function(node) {
        return _this.add_item(pi.Nod.create(node));
      });
      return this._flush_buffer(false);
    };

    List.prototype.data_provider = function(data) {
      var item, _i, _len;
      if (data == null) {
        data = null;
      }
      if (this.items.length) {
        this.clear();
      }
      if (!((data != null) && data.length)) {
        this._check_empty();
        return;
      }
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        item = data[_i];
        this.add_item(item, false);
      }
      return this.update();
    };

    List.prototype.add_item = function(data, update) {
      var item;
      if (update == null) {
        update = true;
      }
      item = this._create_item(data);
      this.items.push(item);
      this._check_empty();
      item.nod.data('listIndex', this.items.length - 1);
      if (update) {
        this.items_cont.append(item.nod);
      } else {
        this.buffer.appendChild(item.nod.node);
      }
      if (update) {
        return this.trigger('update', {
          type: 'item_added',
          item: item
        });
      }
    };

    List.prototype.add_item_at = function(data, index, update) {
      var item, _after;
      if (update == null) {
        update = true;
      }
      if (this.items.length - 1 < index) {
        this.add_item(data, update);
        return;
      }
      item = this._create_item(data);
      this.items.splice(index, 0, item);
      _after = this.items[index + 1];
      item.nod.data('listIndex', index);
      _after.nod.insertBefore(item.nod);
      this._need_update_indeces = true;
      if (update) {
        this._update_indeces();
        return this.trigger('update', {
          type: 'item_added',
          item: item
        });
      }
    };

    List.prototype.remove_item = function(item, update) {
      var index;
      if (update == null) {
        update = true;
      }
      index = this.items.indexOf(item);
      if (index > -1) {
        this.items.splice(index, 1);
        this._destroy_item(item);
        item.nod.data('listIndex', null);
        this._check_empty();
        this._need_update_indeces = true;
        if (update) {
          this._update_indeces();
          this.trigger('update', {
            type: 'item_removed',
            item: item
          });
        }
      }
    };

    List.prototype.remove_item_at = function(index, update) {
      var item;
      if (update == null) {
        update = true;
      }
      if (this.items.length - 1 < index) {
        return;
      }
      item = this.items[index];
      return this.remove_item(item, update);
    };

    List.prototype.where = function(query) {
      var item, matcher, _i, _len, _ref3, _results;
      matcher = typeof query === "string" ? this.constructor.string_matcher(query) : utils.object_matcher(query);
      _ref3 = this.items;
      _results = [];
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        item = _ref3[_i];
        if (matcher(item)) {
          _results.push(item);
        }
      }
      return _results;
    };

    List.prototype.size = function() {
      return this.items.length;
    };

    List.prototype.update = function() {
      this._flush_buffer();
      if (this._need_update_indeces) {
        this._update_indeces();
      }
      return this.trigger('update');
    };

    List.prototype.clear = function() {
      this.items_cont.detach_children();
      this.items.length = 0;
      return this.trigger('update', {
        type: 'clear'
      });
    };

    List.prototype._update_indeces = function() {
      var i, item, _i, _len, _ref3;
      _ref3 = this.items;
      for (i = _i = 0, _len = _ref3.length; _i < _len; i = ++_i) {
        item = _ref3[i];
        item.nod.data('listIndex', i);
      }
      return this._need_update_indeces = false;
    };

    List.prototype._check_empty = function() {
      if (!this.empty && this.items.length === 0) {
        this.addClass('is-empty');
        this.empty = true;
        return this.trigger('empty');
      } else if (this.empty && this.items.length > 0) {
        this.removeClass('is-empty');
        this.empty = false;
        return this.trigger('full');
      }
    };

    List.prototype._create_item = function(data) {
      if (data.nod instanceof pi.Nod) {
        return data;
      }
      return this.item_renderer(data);
    };

    List.prototype._destroy_item = function(item) {
      var _ref3;
      return (_ref3 = item.nod) != null ? typeof _ref3.remove === "function" ? _ref3.remove() : void 0 : void 0;
    };

    List.prototype._flush_buffer = function(append) {
      if (append == null) {
        append = true;
      }
      if (append) {
        this.items_cont.append(this.buffer);
      }
      return this.buffer.innerHTML = '';
    };

    List.prototype._item_clicked = function(target, e) {
      var item;
      if (target.data('listIndex') == null) {
        return;
      }
      item = this.items[target.data('listIndex')];
      return this.trigger('item_click', {
        item: item
      });
    };

    return List;

  })(pi.Base);
})(this);
;var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

(function(context) {
  "use strict";
  var $, VERSION, pi, utils, _ref, _swf_count;
  $ = context.$;
  pi = context.pi = context.pi || {};
  utils = pi.utils;
  _swf_count = 0;
  VERSION = (pi.config.swf_version != null) || '11.0.0';
  return pi.SwfPlayer = (function(_super) {
    __extends(SwfPlayer, _super);

    function SwfPlayer() {
      _ref = SwfPlayer.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    SwfPlayer.prototype.initialize = function() {
      var cont;
      cont = document.createElement('div');
      this.player_id = "swf_player_" + (++_swf_count);
      cont.id = this.player_id;
      this.append(cont);
      if ((this.options.url != null) && this.enabled) {
        this.load(this.options.url);
      }
      return SwfPlayer.__super__.initialize.apply(this, arguments);
    };

    SwfPlayer.prototype.load = function(url, params) {
      var key, val, _ref1;
      if (params == null) {
        params = {};
      }
      url || (url = this.options.url);
      _ref1 = this.options;
      for (key in _ref1) {
        val = _ref1[key];
        if (!params[key]) {
          params[key] = val;
        }
      }
      return swfobject.embedSWF(url, this.player_id, "100%", "100%", VERSION, "", params, {
        allowScriptAccess: true,
        wmode: 'transparent'
      });
    };

    SwfPlayer.prototype.clear = function() {
      return this.empty();
    };

    SwfPlayer.prototype.as3_call = function() {
      var args, method, obj, _ref1;
      method = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      obj = swfobject.getObjectById(this.player_id);
      if (obj) {
        return (_ref1 = obj[method]) != null ? _ref1.apply(obj, args) : void 0;
      }
    };

    SwfPlayer.prototype.as3_event = function(e) {
      utils.debug(e);
      return this.trigger('as3_event', e);
    };

    return SwfPlayer;

  })(pi.Base);
})(this);
;var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

(function(context) {
  "use strict";
  var pi, utils, _ref;
  pi = context.pi = context.pi || {};
  utils = pi.utils;
  return pi.TextArea = (function(_super) {
    __extends(TextArea, _super);

    function TextArea() {
      _ref = TextArea.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    TextArea.prototype.initialize = function() {
      this.input = this.node.nodeName.toLowerCase() === 'textarea' ? this : this.find('textarea');
      this.editable = true;
      if (this.options.readonly || this.hasClass('is-readonly')) {
        this.make_readonly();
      }
      if (this.options.autosize === true) {
        this.enable_autosize();
      }
      return pi.Base.prototype.initialize.apply(this);
    };

    TextArea.prototype.autosizer = function() {
      var _this = this;
      return this._autosizer || (this._autosizer = function() {
        return _this.input.style('height', _this.input.node.scrollHeight);
      });
    };

    TextArea.prototype.enable_autosize = function() {
      if (!this._autosizing) {
        this.input.on('change', this.autosizer());
        this._autosizing = true;
        this.autosizer()();
      }
      return this;
    };

    TextArea.prototype.disable_autosize = function() {
      if (this._autosizing) {
        this.input.style('height', null);
        this.input.off('change', this.autosizer());
        this._autosizing = false;
      }
      return this;
    };

    return TextArea;

  })(pi.TextInput);
})(this);
;(function(context) {
  "use strict";
  var pi, utils;
  pi = context.pi = context.pi || {};
  utils = pi.utils;
  return pi.DragSelect = (function() {
    function DragSelect(list) {
      this.list = list;
      if (this.list.selectable == null) {
        utils.error('Selectable plugin is required!');
        return;
      }
      this._direction = this.list.options.direction || 'y';
      this.list.on('mousedown', this.mouse_down_listener());
    }

    DragSelect.prototype._item_under_point = function(point) {
      return this._item_bisearch(0, point[this._direction], point);
    };

    DragSelect.prototype._item_bisearch = function(start, delta, point) {
      var index, index_shift, item, match;
      index_shift = ((delta / this._height) * this._len) | 0;
      if (index_shift === 0) {
        index_shift = delta > 0 ? 1 : -1;
      }
      index = start + index_shift;
      if (index < 0) {
        return 0;
      }
      if (index > this._len - 1) {
        return this._len - 1;
      }
      item = this.list.items[index];
      match = this._item_match_point(item.nod, point);
      if (match === 0) {
        return index;
      } else {
        return this._item_bisearch(index, match, point);
      }
    };

    DragSelect.prototype._item_match_point = function(item, point) {
      var item_x, item_y, param, pos, _ref;
      _ref = item.position(), item_x = _ref.x, item_y = _ref.y;
      pos = {
        x: item_x - this._offset.x,
        y: item_y - this._offset.y
      };
      param = this._direction === 'y' ? item.height() : item.width();
      if (point[this._direction] >= pos[this._direction] && pos[this._direction] + param > point[this._direction]) {
        return 0;
      } else {
        return point[this._direction] - pos[this._direction];
      }
    };

    DragSelect.prototype._update_range = function(index) {
      var below, downward;
      if (index === this._last_index) {
        return;
      }
      if ((this._last_index - this._start_index) * (index - this._start_index) < 0) {
        this._update_range(this._start_index);
      }
      utils.debug("next index: " + index + "; last index: " + this._last_index + "; start: " + this._start_index);
      downward = (index - this._last_index) > 0;
      below = this._last_index !== this._start_index ? (this._last_index - this._start_index) > 0 : downward;
      utils.debug("below: " + below + "; downward: " + downward);
      switch (false) {
        case !(downward && below):
          this._select_range(this._last_index + 1, index);
          break;
        case !(!downward && !below):
          this._select_range(index, this._last_index - 1);
          break;
        case !(downward && !below):
          this._clear_range(this._last_index, index - 1);
          break;
        default:
          this._clear_range(index + 1, this._last_index);
      }
      return this._last_index = index;
    };

    DragSelect.prototype._clear_range = function(from, to) {
      var item, _i, _len, _ref, _results;
      _ref = this.list.items.slice(from, +to + 1 || 9e9);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        _results.push(this.list._deselect(item));
      }
      return _results;
    };

    DragSelect.prototype._select_range = function(from, to) {
      var item, _i, _len, _ref, _results;
      _ref = this.list.items.slice(from, +to + 1 || 9e9);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        _results.push(this.list._select(item));
      }
      return _results;
    };

    DragSelect.prototype.mouse_down_listener = function() {
      var _this = this;
      if (this._mouse_down_listener) {
        return this._mouse_down_listener;
      }
      return this._mouse_down_listener = function(e) {
        var _ref, _x, _y;
        _ref = _this.list.items_cont.position(), _x = _ref.x, _y = _ref.y;
        _this._offset = {
          x: _x,
          y: _y
        };
        _this._start_point = {
          x: e.pageX - _x,
          y: e.pageY - _y
        };
        _this._wait_drag = after(300, function() {
          _this._height = _this.list.height();
          _this._len = _this.list.items.length;
          _this._start_index = _this._item_under_point(_this._start_point);
          _this._last_index = _this._start_index;
          _this.list._select(_this.list.items[_this._start_index]);
          if (_this.list.selected().length) {
            _this.list.trigger('selected');
          }
          _this.list.on('mousemove', _this.mouse_move_listener());
          return _this._dragging = true;
        });
        return pi.Nod.root.on('mouseup', _this.mouse_up_listener());
      };
    };

    DragSelect.prototype.mouse_up_listener = function() {
      var _this = this;
      if (this._mouse_up_listener) {
        return this._mouse_up_listener;
      }
      return this._mouse_up_listener = function(e) {
        pi.Nod.root.off('mouseup', _this.mouse_up_listener());
        if (_this._dragging) {
          _this.list.off('mousemove', _this.mouse_move_listener());
          _this._dragging = false;
          e.stopImmediatePropagation();
          return e.preventDefault();
        } else {
          return clearTimeout(_this._wait_drag);
        }
      };
    };

    DragSelect.prototype.mouse_move_listener = function() {
      var _this = this;
      if (this._mouse_move_listener) {
        return this._mouse_move_listener;
      }
      return this._mouse_move_listener = debounce(300, function(e) {
        var point;
        point = {
          x: e.pageX - _this._offset.x,
          y: e.pageY - _this._offset.y
        };
        return _this._update_range(_this._item_under_point(point));
      });
    };

    return DragSelect;

  })();
})(this);
;(function(context) {
  "use strict";
  var $, pi, utils;
  $ = context.jQuery;
  pi = context.pi = context.pi || {};
  utils = pi.utils;
  return pi.JstRenderer = (function() {
    function JstRenderer(list) {
      if (typeof list.item_renderer !== 'string') {
        utils.error('JST renderer name undefined');
        return;
      }
      list.jst_renderer = JST[list.item_renderer];
      list.item_renderer = function(data) {
        var item;
        item = utils.clone(data);
        item.nod = pi.Nod.create(list.jst_renderer(data));
        return item;
      };
    }

    return JstRenderer;

  })();
})(this);
;(function(context) {
  "use strict";
  var pi, utils;
  pi = context.pi = context.pi || {};
  utils = pi.utils;
  return pi.ScrollEnd = (function() {
    function ScrollEnd(list) {
      this.list = list;
      this.scroll_object = this.list.options.scroll_object === 'window' ? pi.Nod.root : this.list.items_cont;
      this.scroll_native_listener = this.list.options.scroll_object === 'window' ? pi.Nod.win : this.list.items_cont;
      this.list.scroll_end = this;
      this._prev_top = this.scroll_object.scrollTop();
      if (this.list.options.scroll_end !== false) {
        this.enable();
      }
      return;
    }

    ScrollEnd.prototype.enable = function() {
      if (this.enabled) {
        return;
      }
      this.scroll_native_listener.on('scroll', this.scroll_listener());
      return this.enabled = true;
    };

    ScrollEnd.prototype.disable = function() {
      if (!this.enabled) {
        return;
      }
      this.scroll_native_listener.off('scroll', this.scroll_listener());
      this._scroll_listener = null;
      return this.enabled = false;
    };

    ScrollEnd.prototype.scroll_listener = function() {
      var _this = this;
      if (this._scroll_listener != null) {
        return this._scroll_listener;
      }
      return this._scroll_listener = debounce(500, function(event) {
        if (_this._prev_top <= _this.scroll_object.scrollTop() && _this.list.height() - _this.scroll_object.scrollTop() - _this.scroll_object.height() < 50) {
          _this.list.trigger('scroll_end');
        }
        return _this._prev_top = _this.scroll_object.scrollTop();
      });
    };

    return ScrollEnd;

  })();
})(this);
;(function(context) {
  "use strict";
  var pi, utils, _clear_mark_regexp, _selector_regexp;
  pi = context.pi = context.pi || {};
  utils = pi.utils;
  _clear_mark_regexp = /<mark>([^<>]*)<\/mark>/gim;
  _selector_regexp = /[\.#a-z\s\[\]=\"-_]/i;
  return pi.Searchable = (function() {
    function Searchable(list) {
      this.list = list;
      this.update_scope(this.list.options.search_scope);
      this.list.searchable = this;
      this.list.delegate(['search', '_start_search', '_stop_search', '_highlight_item'], 'searchable');
      this.list.searching = false;
      return;
    }

    Searchable.prototype.update_scope = function(scope) {
      this.matcher_factory = this._matcher_from_scope(scope);
      if (scope && _selector_regexp.test(scope)) {
        return this.list._highlight_element = function(item) {
          return item.nod.find(scope);
        };
      } else {
        return this.list._highlight_element = function(item) {
          return item.nod;
        };
      }
    };

    Searchable.prototype._matcher_from_scope = function(scope) {
      var key, matches, obj;
      return this.matcher_factory = scope == null ? pi.List.string_matcher : (matches = scope.match(/^data:([\w\d_]+)/)) ? (obj = {}, key = matches[1], function(value) {
        obj[key] = value;
        return utils.object_matcher(obj);
      }) : function(value) {
        return pi.List.string_matcher(scope + ':' + value);
      };
    };

    Searchable.prototype._is_continuation = function(query) {
      var _ref;
      return ((_ref = query.match(this._prevq)) != null ? _ref.index : void 0) === 0;
    };

    Searchable.prototype._start_search = function() {
      if (this.searching) {
        return;
      }
      this.searching = true;
      this.addClass('is-searching');
      this._all_items = utils.clone(this.items);
      this.searchable._prevq = '';
      return this.trigger('search_start');
    };

    Searchable.prototype._stop_search = function() {
      if (!this.searching) {
        return;
      }
      this.searching = false;
      this.removeClass('is-searching');
      this.data_provider(this._all_items);
      this._all_items = null;
      return this.trigger('search_stop');
    };

    Searchable.prototype._highlight_item = function(query, item) {
      var nod, _raw_html, _regexp;
      nod = this._highlight_element(item);
      _raw_html = nod.html();
      _regexp = new RegExp("((?:^|>)[^<>]*?)(" + query + ")", "gim");
      _raw_html = _raw_html.replace(_clear_mark_regexp, "$1");
      if (query !== '') {
        _raw_html = _raw_html.replace(_regexp, '$1<mark>$2</mark>');
      }
      return nod.html(_raw_html);
    };

    Searchable.prototype.search = function(q, highlight) {
      var item, matcher, scope, _buffer, _i, _len;
      if (q == null) {
        q = '';
      }
      if (highlight == null) {
        highlight = false;
      }
      if (q === '') {
        return this._stop_search();
      }
      if (!this.searching) {
        this._start_search();
      }
      scope = this.searchable._is_continuation(q) ? this.items.slice() : utils.clone(this._all_items);
      this.searchable._prevq = q;
      matcher = this.searchable.matcher_factory(q);
      _buffer = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = scope.length; _i < _len; _i++) {
          item = scope[_i];
          if (matcher(item)) {
            _results.push(item);
          }
        }
        return _results;
      })();
      this.data_provider(_buffer);
      if (highlight) {
        for (_i = 0, _len = _buffer.length; _i < _len; _i++) {
          item = _buffer[_i];
          this._highlight_item(q, item);
        }
      }
      return this.trigger('search_update');
    };

    return Searchable;

  })();
})(this);
;(function(context) {
  "use strict";
  var pi, utils;
  pi = context.pi = context.pi || {};
  utils = pi.utils;
  return pi.Selectable = (function() {
    function Selectable(list) {
      var _this = this;
      this.list = list;
      this.type = this.list.options.select || 'radio';
      this.list.on('item_click', this.item_click_handler());
      this.list.on('update', this.update_handler());
      this.list.items_cont.each('.is-selected', function(node) {
        return _this.list.items[pi.Nod.create(node).data('listIndex')].selected = true;
      });
      this.list.selectable = this;
      this.list.delegate(['clear_selection', 'selected', 'selected_item', 'select_all', '_select', '_deselect', '_toggle_select'], 'selectable');
      return;
    }

    Selectable.prototype.item_click_handler = function() {
      var _this = this;
      if (this._item_click_handler) {
        return this._item_click_handler;
      }
      return this._item_click_handler = function(e) {
        if (_this.type.match('radio') && !e.data.item.selected) {
          _this.list.clear_selection(true);
          _this.list._select(e.data.item);
          _this.list.trigger('selected');
        } else if (_this.type.match('check')) {
          _this.list._toggle_select(e.data.item);
          if (_this.list.selected().length) {
            _this.list.trigger('selected');
          } else {
            _this.list.trigger('selection_cleared');
          }
        }
      };
    };

    Selectable.prototype.update_handler = function() {
      var _this = this;
      if (this._update_handler) {
        return this._update_handler;
      }
      return this._update_handler = function(e) {
        var _ref;
        if (!((((_ref = e.data) != null ? _ref.type : void 0) != null) && e.data.type === 'item_added')) {
          return _this._check_selected();
        }
      };
    };

    Selectable.prototype._check_selected = function() {
      if (!this.list.selected().length) {
        return this.list.trigger('selection_cleared');
      }
    };

    Selectable.prototype._select = function(item) {
      if (!item.selected) {
        item.selected = true;
        return item.nod.addClass('is-selected');
      }
    };

    Selectable.prototype._deselect = function(item) {
      if (item.selected) {
        item.selected = false;
        return item.nod.removeClass('is-selected');
      }
    };

    Selectable.prototype._toggle_select = function(item) {
      if (item.selected) {
        return this._deselect(item);
      } else {
        return this._select(item);
      }
    };

    Selectable.prototype.clear_selection = function(silent) {
      var item, _i, _len, _ref;
      if (silent == null) {
        silent = false;
      }
      _ref = this.items;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        this._deselect(item);
      }
      if (!silent) {
        return this.trigger('selection_cleared');
      }
    };

    Selectable.prototype.select_all = function() {
      var item, _i, _len, _ref;
      _ref = this.items;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        this._select(item);
      }
      if (this.selected().length) {
        return this.trigger('selected');
      }
    };

    Selectable.prototype.selected = function() {
      var item, _i, _len, _ref, _results;
      _ref = this.items;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        if (item.selected) {
          _results.push(item);
        }
      }
      return _results;
    };

    Selectable.prototype.selected_item = function() {
      var _ref;
      _ref = this.selected();
      if (_ref.length) {
        return _ref[0];
      } else {
        return null;
      }
    };

    return Selectable;

  })();
})(this);
;(function(context) {
  "use strict";
  var pi, utils;
  pi = context.pi = context.pi || {};
  utils = pi.utils;
  return pi.Sortable = (function() {
    function Sortable(list) {
      this.list = list;
      this.list.sortable = this;
      this.list.delegate(['sort'], 'sortable');
      return;
    }

    Sortable.prototype.sort = function(fields, reverse) {
      if (reverse == null) {
        reverse = false;
      }
      if (typeof fields === 'object') {
        utils.sort(this.items, fields, reverse);
      } else {
        utils.sort_by(this.items, fields, reverse);
      }
      this.data_provider(this.items.slice());
      return this.trigger('sort_update', {
        fields: fields,
        reverse: reverse
      });
    };

    return Sortable;

  })();
})(this);
;
//# sourceMappingURL=pieces.js.map