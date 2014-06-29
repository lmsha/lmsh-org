var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

(function(context) {
  "use strict";
  var FormerJS;
  FormerJS = (function() {
    function FormerJS(nod, options) {
      this.nod = nod;
      this.options = options != null ? options : {};
      if (this.options.rails === true) {
        this.options.name_transform = this._rails_name_transform;
      }
      if (this.options.serialize === true) {
        this.options.parse_value = this._serialize;
      }
    }

    FormerJS.parse = function(nod, options) {
      return (new FormerJS(nod, options)).parse();
    };

    FormerJS.fill = function(nod, options) {
      return (new FormerJS(nod, options)).fill();
    };

    FormerJS.clear = function(nod) {
      return (new FormerJS(nod)).clear();
    };

    FormerJS.prototype.parse = function() {
      return this._process_name_values(this._collect_name_values());
    };

    FormerJS.prototype.fill = function(data) {
      var _this = this;
      return this._traverse_input_nodes(this.nod, function(nod) {
        return _this._fill_nod(nod, data);
      });
    };

    FormerJS.prototype.clear = function() {
      var _this = this;
      return this._traverse_input_nodes(this.nod, function(nod) {
        return _this._clear_nod(nod);
      });
    };

    FormerJS.prototype._process_name_values = function(name_values) {
      var item, _arrays, _fn, _i, _len, _result,
        _this = this;
      _result = {};
      _arrays = {};
      _fn = function(item) {
        var i, len, name, name_part, value, _arr_fullname, _current, _j, _len1, _name_parts, _results;
        name = item.name, value = item.value;
        if (_this.options.skip_empty && (value === '' || value === null)) {
          return;
        }
        _arr_fullname = '';
        _current = _result;
        if (_this.options.name_transform != null) {
          name = _this.options.name_transform(name);
        }
        if (_this.options.parse_value != null) {
          value = _this.options.parse_value(value);
        }
        _name_parts = name.split(".");
        len = _name_parts.length;
        _results = [];
        for (i = _j = 0, _len1 = _name_parts.length; _j < _len1; i = ++_j) {
          name_part = _name_parts[i];
          _results.push((function(name_part) {
            var _arr_len, _arr_name, _array_item, _next_field;
            if (name_part.indexOf('[]') > -1) {
              _arr_name = name_part.substr(0, name_part.indexOf('['));
              _arr_fullname += _arr_name;
              _current[_arr_name] || (_current[_arr_name] = []);
              if (i === (len - 1)) {
                return _current[_arr_name].push(value);
              } else {
                _next_field = _name_parts[i + 1];
                _arrays[_arr_fullname] || (_arrays[_arr_fullname] = []);
                _arr_len = _arrays[_arr_fullname].length;
                if (!_arr_len || ((__indexOf.call(_arrays[_arr_fullname], _next_field) >= 0) && (_next_field.indexOf('[]') < 0 || _next_field !== _arrays[_arr_fullname][_arr_len - 1]))) {
                  _array_item = {};
                  _current[_arr_name].push(_array_item);
                  _arrays[_arr_fullname] = [];
                } else {
                  _array_item = _current[_arr_name][_current[_arr_name].length - 1];
                }
                _arrays[_arr_fullname].push(_next_field);
                return _current = _array_item;
              }
            } else {
              _arr_fullname += name_part;
              if (i < (len - 1)) {
                _current[name_part] || (_current[name_part] = {});
                return _current = _current[name_part];
              } else {
                return _current[name_part] = value;
              }
            }
          })(name_part));
        }
        return _results;
      };
      for (_i = 0, _len = name_values.length; _i < _len; _i++) {
        item = name_values[_i];
        _fn(item);
      }
      return _result;
    };

    FormerJS.prototype._collect_name_values = function() {
      var _this = this;
      return this._traverse_input_nodes(this.nod, function(nod) {
        return _this._parse_nod(nod);
      });
    };

    FormerJS.prototype._traverse_input_nodes = function(nod, callback) {
      var current, result;
      result = this._to_array(callback(nod));
      current = nod.firstChild;
      while ((current != null)) {
        result = result.concat(this._traverse_input_nodes(current, callback));
        current = current.nextSibling;
      }
      return result;
    };

    FormerJS.prototype._to_array = function(val) {
      if (val == null) {
        return [];
      } else if (val instanceof Array) {
        return val;
      } else {
        return [val];
      }
    };

    FormerJS.prototype._parse_nod = function(nod) {
      var val;
      if (this.options.disabled === false && nod.disabled) {
        return;
      }
      if (!/(input|select|textarea)/i.test(nod.nodeName)) {
        return;
      }
      if (!nod.name) {
        return;
      }
      val = this._parse_nod_value(nod);
      if (val == null) {
        return;
      }
      return {
        name: nod.name,
        value: val
      };
    };

    FormerJS.prototype._fill_nod = function(nod, data) {
      var type, value;
      if (!/(input|select|textarea)/i.test(nod.nodeName)) {
        return;
      }
      value = this._nod_data_value(nod.name, data);
      if (value == null) {
        return;
      }
      if (nod.nodeName.toLowerCase() === 'select') {
        this._fill_select(nod, value);
      } else {
        if (typeof value === 'object') {
          return;
        }
        type = nod.type.toLowerCase();
        switch (false) {
          case !(/(radio|checkbox)/.test(type) && value):
            nod.checked = true;
            break;
          case !(/(radio|checkbox)/.test(type) && !value):
            nod.checked = false;
            break;
          default:
            nod.value = value;
        }
      }
    };

    FormerJS.prototype._fill_select = function(nod, value) {
      var option, _i, _len, _ref, _results;
      value = value instanceof Array ? value : [value];
      _ref = nod.getElementsByTagName("option");
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        _results.push((function(option) {
          var _ref1;
          return option.selected = (_ref1 = option.value, __indexOf.call(value, _ref1) >= 0);
        })(option));
      }
      return _results;
    };

    FormerJS.prototype._clear_nod = function(nod) {
      var type;
      if (!/(input|select|textarea)/i.test(nod.nodeName)) {
        return;
      }
      if (nod.nodeName.toLowerCase() === 'select') {
        this._fill_select(nod, []);
      } else {
        type = nod.type.toLowerCase();
        switch (false) {
          case !/(radio|checkbox)/.test(type):
            nod.checked = false;
            break;
          default:
            nod.value = '';
        }
      }
    };

    FormerJS.prototype._nod_data_value = function(name, data) {
      var key, _i, _len, _ref;
      if (this.options.fill_prefix) {
        name = name.replace(this.options.fill_prefix, '');
      }
      if (this.options.name_transform != null) {
        name = this.options.name_transform(name);
      }
      if (name.indexOf('[]') > -1) {
        return;
      }
      _ref = name.split(".");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        data = data[key];
        if (data == null) {
          break;
        }
      }
      return data;
    };

    FormerJS.prototype._parse_nod_value = function(nod) {
      var type;
      if (nod.nodeName.toLowerCase() === 'select') {
        return this._parse_select_value(nod);
      } else {
        type = nod.type.toLowerCase();
        switch (false) {
          case !(/(radio|checkbox)/.test(type) && nod.checked):
            return nod.value;
          case !(/(radio|checkbox)/.test(type) && !nod.checked):
            return null;
          case !/(button|reset|submit|image)/.test(type):
            return null;
          default:
            return nod.value;
        }
      }
    };

    FormerJS.prototype._parse_select_value = function(nod) {
      var multiple, option, _i, _len, _ref, _results;
      multiple = nod.multiple;
      if (!multiple) {
        return nod.value;
      }
      _ref = nod.getElementsByTagName("option");
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        if (option.selected) {
          _results.push(option.value);
        }
      }
      return _results;
    };

    FormerJS.prototype._rails_name_transform = function(name) {
      return name.replace(/([a-z_\d\(\)\]])\[([^\]])/ig, "$1.$2").replace(/([a-z_\(\)\d])\]/ig, "$1");
    };

    FormerJS.prototype._serialize = function(val) {
      return val = (function() {
        switch (false) {
          case !((val == null) || val === ''):
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
    };

    return FormerJS;

  })();
  if (typeof define === 'function' && (define.amd != null)) {
    return define(FormerJS);
  } else if (typeof module === 'function') {
    return module.exports = FormerJS;
  } else {
    return context.FormerJS = FormerJS;
  }
})(this);
;
//# sourceMappingURL=former.js.map