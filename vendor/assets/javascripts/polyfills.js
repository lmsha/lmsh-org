if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1),
    fToBind = this,
    fNOP = function () {},
    fBound = function () {
      return fToBind.apply(this instanceof fNOP && oThis
      ? this
      : oThis,
      aArgs.concat(Array.prototype.slice.call(arguments)));
    };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}

if ( !Array.prototype.forEach ) {
  Array.prototype.forEach = function(fn, scope) {
    for(var i = 0, len = this.length; i < len; ++i) {
      fn.call(scope, this[i], i, this);
    }
  };
}

if (!Array.prototype.filter)
{
  Array.prototype.filter = function(fun /*, thisArg */)
  {
    "use strict";

    if (this === void 0 || this === null)
      throw new TypeError();

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function")
      throw new TypeError();

    var res = [];
    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++)
    {
      if (i in t)
      {
        var val = t[i];

        // NOTE: Technically this should Object.defineProperty at
        //       the next index, as push can be affected by
        //       properties on Object.prototype and Array.prototype.
        //       But that method's new, and collisions should be
        //       rare, so use the more-compatible alternative.
        if (fun.call(thisArg, val, i, t))
          res.push(val);
      }
    }

    return res;
  };
}

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement, fromIndex) {
      if ( this === undefined || this === null ) {
        throw new TypeError( '"this" is null or not defined' );
      }

      var length = this.length >>> 0; // Hack to convert object.length to a UInt32

      fromIndex = +fromIndex || 0;

      if (Math.abs(fromIndex) === Infinity) {
        fromIndex = 0;
      }

      if (fromIndex < 0) {
        fromIndex += length;
        if (fromIndex < 0) {
          fromIndex = 0;
        }
      }

      for (;fromIndex < length; fromIndex++) {
        if (this[fromIndex] === searchElement) {
          return fromIndex;
        }
      }

      return -1;
    };
  }


if (Element && !Element.prototype.matches) {
    var proto = Element.prototype;
    proto.matches = proto.matchesSelector ||
        proto.mozMatchesSelector || proto.msMatchesSelector ||
        proto.oMatchesSelector || proto.webkitMatchesSelector || function(selector){
          return (Array.prototype.indexOf.call(document.documentElement.querySelectorAll(selector), this)>-1);
        };
}


/*
 * classList.js: Cross-browser full element.classList implementation.
 * 2012-11-15
 *
 * By Eli Grey, http://eligrey.com
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js*/

if (typeof document !== "undefined" && !("classList" in document.createElement("a"))) {

  (function (view) {

    "use strict";

if (!('HTMLElement' in view) && !('Element' in view)) return;

   var
   classListProp = "classList"
   , protoProp = "prototype"
   , elemCtrProto = (view.HTMLElement || view.Element)[protoProp]
   , objCtr = Object
   , strTrim = String[protoProp].trim || function () {
     return this.replace(/^\s+|\s+$/g, "");
   }
   , arrIndexOf = Array[protoProp].indexOf || function (item) {
     var
     i = 0
     , len = this.length
     ;
     for (; i < len; i++) {
       if (i in this && this[i] === item) {
         return i;
       }
     }
     return -1;
   }
   // Vendors: please allow content code to instantiate DOMExceptions
   , DOMEx = function (type, message) {
     this.name = type;
     this.code = DOMException[type];
     this.message = message;
   }
   , checkTokenAndGetIndex = function (classList, token) {
     if (token === "") {
       throw new DOMEx(
         "SYNTAX_ERR"
         , "An invalid or illegal string was specified"
       );
     }
     if (/\s/.test(token)) {
        throw new DOMEx(
          "INVALID_CHARACTER_ERR"
          , "String contains an invalid character"
        );
     }
     return arrIndexOf.call(classList, token);
   }
   , ClassList = function (elem) {
     var
     trimmedClasses = strTrim.call(elem.className)
     , classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
     , i = 0
     , len = classes.length
     ;
     for (; i < len; i++) {
       this.push(classes[i]);
     }
     this._updateClassName = function () {
       elem.className = this.toString();
     };
   }
   , classListProto = ClassList[protoProp] = []
   , classListGetter = function () {
     return new ClassList(this);
   }
   ;
   // Most DOMException implementations don't allow calling DOMException's toString()
   // on non-DOMExceptions. Error's toString() is sufficient here.
   DOMEx[protoProp] = Error[protoProp];
   classListProto.item = function (i) {
     return this[i] || null;
   };
   classListProto.contains = function (token) {
     token += "";
     return checkTokenAndGetIndex(this, token) !== -1;
   };
   classListProto.add = function () {
     var
     tokens = arguments
     , i = 0
     , l = tokens.length
     , token
     , updated = false
     ;
     do {
       token = tokens[i] + "";
       if (checkTokenAndGetIndex(this, token) === -1) {
         this.push(token);
         updated = true;
       }
     }
     while (++i < l);

                                                       if (updated) {
                                                         this._updateClassName();
                                                       }
   };
   classListProto.remove = function () {
     var
     tokens = arguments
     , i = 0
     , l = tokens.length
     , token
     , updated = false
     ;
     do {
       token = tokens[i] + "";
       var index = checkTokenAndGetIndex(this, token);
       if (index !== -1) {
         this.splice(index, 1);
         updated = true;
       }
     }
     while (++i < l);

                                                       if (updated) {
                                                         this._updateClassName();
                                                       }
   };
   classListProto.toggle = function (token, forse) {
     token += "";

     var
     result = this.contains(token)
     , method = result ?
     forse !== true && "remove"
       :
       forse !== false && "add"
         ;

       if (method) {
         this[method](token);
       }

       return !result;
   };
   classListProto.toString = function () {
     return this.join(" ");
   };

   if (objCtr.defineProperty) {
     var classListPropDesc = {
       get: classListGetter
       , enumerable: true
       , configurable: true
     };
     try {
       objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
     } catch (ex) { // IE 8 doesn't support enumerable:true
       if (ex.number === -0x7FF5EC54) {
         classListPropDesc.enumerable = false;
         objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
       }
   }
  } else if (objCtr[protoProp].__defineGetter__) {
    elemCtrProto.__defineGetter__(classListProp, classListGetter);
  }

}(self));

}