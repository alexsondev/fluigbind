(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.fluigbind = factory());
}(this, (function () { 'use strict';

  var OPTIONS = ['prefix', 'templateDelimiters', 'rootInterface', 'preloadData', 'handler'];
  var EXTENSIONS = ['binders', 'formatters', 'adapters'];

  var PRIMITIVE = 0;
  var KEYPATH = 1;
  var TEXT = 0;
  var BINDING = 1;
  var QUOTED_STR = /^'.*'$|^".*"$/;

  // Parser and tokenizer for getting the type and value from a string.
  function parseType(string) {
    var type = PRIMITIVE;
    var value = string;
    if (QUOTED_STR.test(string)) {
      value = string.slice(1, -1);
    } else if (string === 'true') {
      value = true;
    } else if (string === 'false') {
      value = false;
    } else if (string === 'null') {
      value = null;
    } else if (string === 'undefined') {
      value = undefined;
    } else if (!isNaN(string)) {
      value = Number(string);
    } else {
      type = KEYPATH;
    }
    return {
      type: type,
      value: value
    };
  }

  // Template parser and tokenizer for mustache-style text content bindings.
  // Parses the template and returns a set of tokens, separating static portions
  // of text from binding declarations.
  function parseTemplate(template, delimiters) {
    var tokens;
    var length = template.length;
    var index = 0;
    var lastIndex = 0;
    var open = delimiters[0],
      close = delimiters[1];
    while (lastIndex < length) {
      index = template.indexOf(open, lastIndex);
      if (index < 0) {
        if (tokens) {
          tokens.push({
            type: TEXT,
            value: template.slice(lastIndex)
          });
        }
        break;
      } else {
        tokens || (tokens = []);
        if (index > 0 && lastIndex < index) {
          tokens.push({
            type: TEXT,
            value: template.slice(lastIndex, index)
          });
        }
        lastIndex = index + open.length;
        index = template.indexOf(close, lastIndex);
        if (index < 0) {
          var substring = template.slice(lastIndex - close.length);
          var lastToken = tokens[tokens.length - 1];
          if (lastToken && lastToken.type === TEXT) {
            lastToken.value += substring;
          } else {
            tokens.push({
              type: TEXT,
              value: substring
            });
          }
          break;
        }
        var value = template.slice(lastIndex, index).trim();
        tokens.push({
          type: BINDING,
          value: value
        });
        lastIndex = index + close.length;
      }
    }
    return tokens;
  }

  function _regeneratorRuntime() {
    _regeneratorRuntime = function () {
      return exports;
    };
    var exports = {},
      Op = Object.prototype,
      hasOwn = Op.hasOwnProperty,
      defineProperty = Object.defineProperty || function (obj, key, desc) {
        obj[key] = desc.value;
      },
      $Symbol = "function" == typeof Symbol ? Symbol : {},
      iteratorSymbol = $Symbol.iterator || "@@iterator",
      asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
      toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
    function define(obj, key, value) {
      return Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
      }), obj[key];
    }
    try {
      define({}, "");
    } catch (err) {
      define = function (obj, key, value) {
        return obj[key] = value;
      };
    }
    function wrap(innerFn, outerFn, self, tryLocsList) {
      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator,
        generator = Object.create(protoGenerator.prototype),
        context = new Context(tryLocsList || []);
      return defineProperty(generator, "_invoke", {
        value: makeInvokeMethod(innerFn, self, context)
      }), generator;
    }
    function tryCatch(fn, obj, arg) {
      try {
        return {
          type: "normal",
          arg: fn.call(obj, arg)
        };
      } catch (err) {
        return {
          type: "throw",
          arg: err
        };
      }
    }
    exports.wrap = wrap;
    var ContinueSentinel = {};
    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}
    var IteratorPrototype = {};
    define(IteratorPrototype, iteratorSymbol, function () {
      return this;
    });
    var getProto = Object.getPrototypeOf,
      NativeIteratorPrototype = getProto && getProto(getProto(values([])));
    NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
    var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
    function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function (method) {
        define(prototype, method, function (arg) {
          return this._invoke(method, arg);
        });
      });
    }
    function AsyncIterator(generator, PromiseImpl) {
      function invoke(method, arg, resolve, reject) {
        var record = tryCatch(generator[method], generator, arg);
        if ("throw" !== record.type) {
          var result = record.arg,
            value = result.value;
          return value && "object" == typeof value && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) {
            invoke("next", value, resolve, reject);
          }, function (err) {
            invoke("throw", err, resolve, reject);
          }) : PromiseImpl.resolve(value).then(function (unwrapped) {
            result.value = unwrapped, resolve(result);
          }, function (error) {
            return invoke("throw", error, resolve, reject);
          });
        }
        reject(record.arg);
      }
      var previousPromise;
      defineProperty(this, "_invoke", {
        value: function (method, arg) {
          function callInvokeWithMethodAndArg() {
            return new PromiseImpl(function (resolve, reject) {
              invoke(method, arg, resolve, reject);
            });
          }
          return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
        }
      });
    }
    function makeInvokeMethod(innerFn, self, context) {
      var state = "suspendedStart";
      return function (method, arg) {
        if ("executing" === state) throw new Error("Generator is already running");
        if ("completed" === state) {
          if ("throw" === method) throw arg;
          return doneResult();
        }
        for (context.method = method, context.arg = arg;;) {
          var delegate = context.delegate;
          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);
            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }
          if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) {
            if ("suspendedStart" === state) throw state = "completed", context.arg;
            context.dispatchException(context.arg);
          } else "return" === context.method && context.abrupt("return", context.arg);
          state = "executing";
          var record = tryCatch(innerFn, self, context);
          if ("normal" === record.type) {
            if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
            return {
              value: record.arg,
              done: context.done
            };
          }
          "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
        }
      };
    }
    function maybeInvokeDelegate(delegate, context) {
      var methodName = context.method,
        method = delegate.iterator[methodName];
      if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel;
      var record = tryCatch(method, delegate.iterator, context.arg);
      if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
      var info = record.arg;
      return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
    }
    function pushTryEntry(locs) {
      var entry = {
        tryLoc: locs[0]
      };
      1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
    }
    function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = "normal", delete record.arg, entry.completion = record;
    }
    function Context(tryLocsList) {
      this.tryEntries = [{
        tryLoc: "root"
      }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
    }
    function values(iterable) {
      if (iterable) {
        var iteratorMethod = iterable[iteratorSymbol];
        if (iteratorMethod) return iteratorMethod.call(iterable);
        if ("function" == typeof iterable.next) return iterable;
        if (!isNaN(iterable.length)) {
          var i = -1,
            next = function next() {
              for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;
              return next.value = undefined, next.done = !0, next;
            };
          return next.next = next;
        }
      }
      return {
        next: doneResult
      };
    }
    function doneResult() {
      return {
        value: undefined,
        done: !0
      };
    }
    return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", {
      value: GeneratorFunctionPrototype,
      configurable: !0
    }), defineProperty(GeneratorFunctionPrototype, "constructor", {
      value: GeneratorFunction,
      configurable: !0
    }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) {
      var ctor = "function" == typeof genFun && genFun.constructor;
      return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
    }, exports.mark = function (genFun) {
      return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
    }, exports.awrap = function (arg) {
      return {
        __await: arg
      };
    }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
      return this;
    }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
      void 0 === PromiseImpl && (PromiseImpl = Promise);
      var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
      return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
        return result.done ? result.value : iter.next();
      });
    }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () {
      return this;
    }), define(Gp, "toString", function () {
      return "[object Generator]";
    }), exports.keys = function (val) {
      var object = Object(val),
        keys = [];
      for (var key in object) keys.push(key);
      return keys.reverse(), function next() {
        for (; keys.length;) {
          var key = keys.pop();
          if (key in object) return next.value = key, next.done = !1, next;
        }
        return next.done = !0, next;
      };
    }, exports.values = values, Context.prototype = {
      constructor: Context,
      reset: function (skipTempReset) {
        if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
      },
      stop: function () {
        this.done = !0;
        var rootRecord = this.tryEntries[0].completion;
        if ("throw" === rootRecord.type) throw rootRecord.arg;
        return this.rval;
      },
      dispatchException: function (exception) {
        if (this.done) throw exception;
        var context = this;
        function handle(loc, caught) {
          return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught;
        }
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i],
            record = entry.completion;
          if ("root" === entry.tryLoc) return handle("end");
          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, "catchLoc"),
              hasFinally = hasOwn.call(entry, "finallyLoc");
            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
              if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
            } else {
              if (!hasFinally) throw new Error("try statement without catch or finally");
              if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
            }
          }
        }
      },
      abrupt: function (type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }
        finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
        var record = finallyEntry ? finallyEntry.completion : {};
        return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
      },
      complete: function (record, afterLoc) {
        if ("throw" === record.type) throw record.arg;
        return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
      },
      finish: function (finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
        }
      },
      catch: function (tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;
            if ("throw" === record.type) {
              var thrown = record.arg;
              resetTryEntry(entry);
            }
            return thrown;
          }
        }
        throw new Error("illegal catch attempt");
      },
      delegateYield: function (iterable, resultName, nextLoc) {
        return this.delegate = {
          iterator: values(iterable),
          resultName: resultName,
          nextLoc: nextLoc
        }, "next" === this.method && (this.arg = undefined), ContinueSentinel;
      }
    }, exports;
  }
  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }
  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
        args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);
        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }
        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }
        _next(undefined);
      });
    };
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    _setPrototypeOf(subClass, superClass);
  }
  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }
  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
    return _setPrototypeOf(o, p);
  }
  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }
  function _construct(Parent, args, Class) {
    if (_isNativeReflectConstruct()) {
      _construct = Reflect.construct.bind();
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }
    return _construct.apply(null, arguments);
  }
  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }
  function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;
    _wrapNativeSuper = function _wrapNativeSuper(Class) {
      if (Class === null || !_isNativeFunction(Class)) return Class;
      if (typeof Class !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }
      if (typeof _cache !== "undefined") {
        if (_cache.has(Class)) return _cache.get(Class);
        _cache.set(Class, Wrapper);
      }
      function Wrapper() {
        return _construct(Class, arguments, _getPrototypeOf(this).constructor);
      }
      Wrapper.prototype = Object.create(Class.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      return _setPrototypeOf(Wrapper, Class);
    };
    return _wrapNativeSuper(Class);
  }
  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }

  var Dataset = /*#__PURE__*/function () {
    function Dataset(datasetName) {
      this.datasetName = datasetName;
    }
    var _proto = Dataset.prototype;
    _proto.load = /*#__PURE__*/function () {
      var _load = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var datasetName, filterFields, constraints, content;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              datasetName = this.datasetName;
              if (datasetName) {
                _context.next = 3;
                break;
              }
              throw new Error("No dataset declared for " + this.name);
            case 3:
              filterFields = [];
              constraints = this.constraints;
              if (constraints) {
                Object.keys(constraints).forEach(function (field) {
                  var value = constraints[field];
                  filterFields.push(field);
                  filterFields.push(value);
                });
              }
              _context.next = 8;
              return [];
            case 8:
              content = _context.sent;
              return _context.abrupt("return", content);
            case 10:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function load() {
        return _load.apply(this, arguments);
      }
      return load;
    }();
    return Dataset;
  }();

  var Field = /*#__PURE__*/function () {
    function Field(label, type) {
      this.label = label;
      this.type = type;
    }

    /**
     * @param {any} data
     */
    var _proto = Field.prototype;
    _proto.init = function init() {};
    _proto.load = function load() {};
    _proto.reset = function reset() {};
    _proto.change = function change() {};
    _proto.validate = function validate() {};
    _proto.destroy = function destroy() {};
    _proto.clone = function clone() {
      var clone = Object.assign({}, this);
      return Object.setPrototypeOf(clone, Field.prototype);
    };
    _createClass(Field, [{
      key: "data",
      get: function get() {
        return this._data;
      }

      /**
       * @param {any} value
       */,
      set: function set(data) {
        this._data = data;
      }
    }, {
      key: "value",
      get: function get() {
        return this._value;
      }

      /**
       * @param {Boolean} visible
       */,
      set: function set(value) {
        this._value = value;
      }
    }, {
      key: "visible",
      get: function get() {
        return this._visible;
      }

      /**
       * @param {Boolean} mandatory
       */,
      set: function set(visible) {
        this._visible = visible;
      }
    }, {
      key: "mandatory",
      get: function get() {
        return this._mandatory;
      }

      /**
       * @param {Dataset} dataset
       */,
      set: function set(mandatory) {
        this._mandatory = mandatory;
      }
    }, {
      key: "dataset",
      get: function get() {
        return this._dataset;
      },
      set: function set(dataset) {
        this._dataset = dataset;
      }
    }]);
    return Field;
  }();

  var Section = /*#__PURE__*/function () {
    function Section(name) {
      this.name = name;
    }

    /**
     * @param {Boolean} visible
     */
    var _proto = Section.prototype;
    _proto.init = function init() {};
    _proto.load = function load() {};
    _proto.reset = function reset() {};
    _proto.change = function change() {};
    _proto.validate = function validate() {};
    _proto.destroy = function destroy() {};
    _createClass(Section, [{
      key: "visible",
      get: function get() {
        return this._visible;
      }

      /**
       * @param {String} title
       */,
      set: function set(visible) {
        this._visible = visible;
      }
    }, {
      key: "title",
      get: function get() {
        return this._title;
      }

      /**
       * @param {Field[]} fields
       */,
      set: function set(title) {
        this._title = title;
      }
    }, {
      key: "fields",
      get: function get() {
        return this._fields;
      },
      set: function set(fields) {
        this._fields = fields;
      }
    }]);
    return Section;
  }();

  var Table = /*#__PURE__*/function () {
    function Table(tablename) {
      this.tablename = tablename;
    }

    /**
     * @param {Field[]} fields
     */
    var _proto = Table.prototype;
    _proto.init = function init() {};
    _proto.load = function load() {};
    _proto.reset = function reset() {};
    _proto.validate = function validate() {};
    _proto.add = function add() {
      // this.children.push({})
    };
    _proto.remove = function remove() {};
    _createClass(Table, [{
      key: "fields",
      get: function get() {
        return this._fields;
      }

      /**
       * @param {Object[]} children
       */,
      set: function set(fields) {
        this._fields = fields;
      }
    }, {
      key: "children",
      get: function get() {
        return this._children;
      },
      set: function set(children) {
        this._children = children;
      }
    }]);
    return Table;
  }();

  var State = /*#__PURE__*/function () {
    function State(id, name) {
      this.id = id;
      this.name = name;
    }
    var _proto = State.prototype;
    _proto.init = function init() {};
    _proto.load = function load() {};
    return State;
  }();

  var fluigbind$1 = {
    State: State,
    Field: Field,
    Dataset: Dataset,
    Section: Section,
    Table: Table,
    // Global binders.
    binders: {},
    // Global formatters.
    formatters: {},
    // Global sightglass adapters.
    adapters: {},
    // Default attribute prefix.
    _prefix: 'flg',
    _fullPrefix: 'flg-',
    defaults: {
      locale: 'pt-BR',
      currency: 'BRL'
    },
    get prefix() {
      return this._prefix;
    },
    set prefix(value) {
      this._prefix = value;
      this._fullPrefix = value + '-';
    },
    parseTemplate: parseTemplate,
    parseType: parseType,
    // Default template delimiters.
    templateDelimiters: ['{', '}'],
    // Default sightglass root interface.
    rootInterface: '.',
    // Preload data by default.
    preloadData: true,
    // Default event handler.
    handler: function handler(context, ev, binding) {
      this.call(context, ev, binding.view.models);
    },
    // Sets the attribute on the element. If no binder above is matched it will fall
    // back to using this binder.
    fallbackBinder: function fallbackBinder(el, value) {
      if (value != null) {
        el.setAttribute(this.type, value);
      } else {
        el.removeAttribute(this.type);
      }
    },
    // Merges an object literal into the corresponding global options.
    configure: function configure(options) {
      var _this = this;
      if (!options) {
        return;
      }
      Object.keys(options).forEach(function (option) {
        var value = options[option];
        if (EXTENSIONS.indexOf(option) > -1) {
          Object.keys(value).forEach(function (key) {
            _this[option][key] = value[key];
          });
        } else {
          _this[option] = value;
        }
      });
    }
  };

  // Check if a value is an object than can be observed.
  function isObject(obj) {
    return typeof obj === 'object' && obj !== null;
  }

  // Error thrower.
  function error(message) {
    throw new Error("[Observer] " + message);
  }
  var adapters;
  var interfaces;
  var rootInterface;

  // Constructs a new keypath observer and kicks things off.
  var Observer = /*#__PURE__*/function () {
    Observer.updateOptions = function updateOptions(options) {
      adapters = options.adapters;
      interfaces = Object.keys(adapters);
      rootInterface = options.rootInterface;
    }

    // Tokenizes the provided keypath string into interface + path tokens for the
    // observer to work with.
    ;
    Observer.tokenize = function tokenize(keypath, root) {
      var tokens = [];
      var current = {
        i: root,
        path: ''
      };
      var index;
      var chr;
      for (index = 0; index < keypath.length; index++) {
        chr = keypath.charAt(index);
        if (!!~interfaces.indexOf(chr)) {
          tokens.push(current);
          current = {
            i: chr,
            path: ''
          };
        } else {
          current.path += chr;
        }
      }
      tokens.push(current);
      return tokens;
    };
    function Observer(obj, keypath, callback) {
      this.keypath = keypath;
      this.callback = callback;
      this.objectPath = [];
      this.parse();
      this.obj = this.getRootObject(obj);
      if (isObject(this.target = this.realize())) {
        this.set(true, this.key, this.target, this.callback);
      }
    }

    // Parses the keypath using the interfaces defined on the view. Sets variables
    // for the tokenized keypath as well as the end key.
    var _proto = Observer.prototype;
    _proto.parse = function parse() {
      var path;
      var root;
      if (!interfaces.length) {
        error('Must define at least one adapter interface.');
      }
      if (!!~interfaces.indexOf(this.keypath[0])) {
        root = this.keypath[0];
        path = this.keypath.substr(1);
      } else {
        root = rootInterface;
        path = this.keypath;
      }
      this.tokens = Observer.tokenize(path, root);
      this.key = this.tokens.pop();
    }

    // Realizes the full keypath, attaching observers for every key and correcting
    // old observers to any changed objects in the keypath.
    ;
    _proto.realize = function realize() {
      var current = this.obj;
      var unreached = -1;
      var prev;
      var token;
      for (var index = 0; index < this.tokens.length; index++) {
        token = this.tokens[index];
        if (isObject(current)) {
          if (typeof this.objectPath[index] !== 'undefined') {
            if (current !== (prev = this.objectPath[index])) {
              this.set(false, token, prev, this);
              this.set(true, token, current, this);
              this.objectPath[index] = current;
            }
          } else {
            this.set(true, token, current, this);
            this.objectPath[index] = current;
          }
          current = this.get(token, current);
        } else {
          if (unreached === -1) {
            unreached = index;
          }
          if (prev = this.objectPath[index]) {
            this.set(false, token, prev, this);
          }
        }
      }
      if (unreached !== -1) {
        this.objectPath.splice(unreached);
      }
      return current;
    }

    // Updates the keypath. This is called when any intermediary key is changed.
    ;
    _proto.sync = function sync() {
      var next;
      var oldValue;
      var newValue;
      if ((next = this.realize()) !== this.target) {
        if (isObject(this.target)) {
          this.set(false, this.key, this.target, this.callback);
        }
        if (isObject(next)) {
          this.set(true, this.key, next, this.callback);
        }
        oldValue = this.value();
        this.target = next;
        newValue = this.value();
        if (newValue !== oldValue || newValue instanceof Function) this.callback.sync();
      } else if (next instanceof Array) {
        this.callback.sync();
      }
    }

    // Reads the current end value of the observed keypath. Returns undefined if
    // the full keypath is unreachable.
    ;
    _proto.value = function value() {
      if (isObject(this.target)) {
        return this.get(this.key, this.target);
      }
    }

    // Sets the current end value of the observed keypath. Calling setValue when
    // the full keypath is unreachable is a no-op.
    ;
    _proto.setValue = function setValue(value) {
      if (isObject(this.target)) {
        adapters[this.key.i].set(this.target, this.key.path, value);
      }
    }

    // Gets the provided key on an object.
    ;
    _proto.get = function get(key, obj) {
      return adapters[key.i].get(obj, key.path);
    }

    // Observes or unobserves a callback on the object using the provided key.
    ;
    _proto.set = function set(active, key, obj, callback) {
      var action = active ? 'observe' : 'unobserve';
      adapters[key.i][action](obj, key.path, callback);
    }

    // Unobserves the entire keypath.
    ;
    _proto.unobserve = function unobserve() {
      var obj;
      var token;
      for (var index = 0; index < this.tokens.length; index++) {
        token = this.tokens[index];
        if (obj = this.objectPath[index]) {
          this.set(false, token, obj, this);
        }
      }
      if (isObject(this.target)) {
        this.set(false, this.key, this.target, this.callback);
      }
    }

    // traverse the scope chain to find the scope which has the root property
    // if the property is not found in chain, returns the root scope
    ;
    _proto.getRootObject = function getRootObject(obj) {
      var rootProp;
      var current;
      if (!obj.$parent) {
        return obj;
      }
      if (this.tokens.length) {
        rootProp = this.tokens[0].path;
      } else {
        rootProp = this.key.path;
      }
      current = obj;
      while (current.$parent && current[rootProp] === undefined) {
        current = current.$parent;
      }
      return current;
    };
    return Observer;
  }();

  function getInputValue(el) {
    if (el.type === 'checkbox') {
      return el.checked;
    } else if (el.type === 'select-multiple') {
      var results = [];
      var option;
      for (var i = 0; i < el.options.length; i++) {
        option = el.options[i];
        if (option.selected) {
          results.push(option.value);
        }
      }
      return results;
    } else {
      return el.value;
    }
  }
  var FORMATTER_ARGS = /[^\s']+|'([^']|'[^\s])*'|"([^"]|"[^\s])*"/g;
  var FORMATTER_SPLIT = /\s+/;

  // A single binding between a model attribute and a DOM element.
  var Binding = /*#__PURE__*/function () {
    // All information about the binding is passed into the constructor; the
    // containing view, the DOM node, the type of binding, the model object and the
    // keypath at which to listen for changes.
    function Binding(view, el, type, keypath, binder, arg, formatters) {
      this.view = view;
      this.el = el;
      this.type = type;
      this.keypath = keypath;
      this.binder = binder;
      this.arg = arg;
      this.formatters = formatters;
      this.formatterObservers = {};
      this.model = undefined;
    }

    // Observes the object keypath
    var _proto = Binding.prototype;
    _proto.observe = function observe(obj, keypath) {
      return new Observer(obj, keypath, this);
    };
    _proto.parseTarget = function parseTarget() {
      if (this.keypath) {
        var token = parseType(this.keypath);
        if (token.type === 0) {
          this.value = token.value;
        } else {
          this.observer = this.observe(this.view.models, this.keypath);
          this.model = this.observer.target;
        }
      } else {
        this.value = undefined;
      }
    };
    _proto.parseFormatterArguments = function parseFormatterArguments(args, formatterIndex) {
      var _this = this;
      return args.map(parseType).map(function (_ref, ai) {
        var type = _ref.type,
          value = _ref.value;
        if (type === 0) {
          return value;
        } else {
          if (!_this.formatterObservers[formatterIndex]) {
            _this.formatterObservers[formatterIndex] = {};
          }
          var observer = _this.formatterObservers[formatterIndex][ai];
          if (!observer) {
            observer = _this.observe(_this.view.models, value);
            _this.formatterObservers[formatterIndex][ai] = observer;
          }
          return observer.value();
        }
      });
    }

    // Applies all the current formatters to the supplied value and returns the
    // formatted value.
    ;
    _proto.formattedValue = function formattedValue(value) {
      var _this2 = this;
      return this.formatters.reduce(function (result, declaration, index) {
        var args = declaration.match(FORMATTER_ARGS);
        var id = args.shift();
        var formatter = _this2.view.options.formatters[id];
        var processedArgs = _this2.parseFormatterArguments(args, index);
        if (formatter && formatter.read instanceof Function) {
          result = formatter.read.apply(formatter, [result].concat(processedArgs));
        } else if (formatter instanceof Function) {
          result = formatter.apply(void 0, [result].concat(processedArgs));
        }
        return result;
      }, value);
    }

    // Returns an event handler for the binding around the supplied function.
    ;
    _proto.eventHandler = function eventHandler(fn) {
      var binding = this;
      var handler = binding.view.options.handler;
      return function (ev) {
        handler.call(fn, this, ev, binding);
      };
    }

    // Sets the value for the binding. This Basically just runs the binding routine
    // with the supplied value formatted.
    ;
    _proto.set = function set(value) {
      if (value instanceof Function && !this.binder.function) {
        value = this.formattedValue(value.call(this.model));
      } else {
        value = this.formattedValue(value);
      }
      var routineFn = this.binder.routine || this.binder;
      if (routineFn instanceof Function) {
        routineFn.call(this, this.el, value);
      }
    }

    // Syncs up the view binding with the model.
    ;
    _proto.sync = function sync() {
      if (this.observer) {
        this.model = this.observer.target;
        this.set(this.observer.value());
      } else {
        this.set(this.value);
      }
    }

    // Publishes the value currently set on the input element back to the model.
    ;
    _proto.publish = function publish() {
      var _this3 = this;
      if (this.observer) {
        var value = this.formatters.reduceRight(function (result, declaration, index) {
          var args = declaration.split(FORMATTER_SPLIT);
          var id = args.shift();
          var formatter = _this3.view.options.formatters[id];
          var processedArgs = _this3.parseFormatterArguments(args, index);
          if (formatter && formatter.publish) {
            result = formatter.publish.apply(formatter, [result].concat(processedArgs));
          }
          return result;
        }, this.getValue(this.el));
        this.observer.setValue(value);
      }
    }

    // Subscribes to the model for changes at the specified keypath. Bi-directional
    // routines will also listen for changes on the element to propagate them back
    // to the model.
    ;
    _proto.bind = function bind() {
      this.parseTarget();
      if (this.binder.hasOwnProperty('bind')) {
        this.binder.bind.call(this, this.el);
      }
      if (this.view.options.preloadData) {
        this.sync();
      }
    }

    // Unsubscribes from the model and the element.
    ;
    _proto.unbind = function unbind() {
      var _this4 = this;
      if (this.binder.unbind) {
        this.binder.unbind.call(this, this.el);
      }
      if (this.observer) {
        this.observer.unobserve();
      }
      Object.keys(this.formatterObservers).forEach(function (fi) {
        var args = _this4.formatterObservers[fi];
        Object.keys(args).forEach(function (ai) {
          args[ai].unobserve();
        });
      });
      this.formatterObservers = {};
    }

    // Updates the binding's model from what is currently set on the view. Unbinds
    // the old model first and then re-binds with the new model.
    ;
    _proto.update = function update(models) {
      if (models === void 0) {
        models = {};
      }
      if (this.observer) {
        this.model = this.observer.target;
      }
      if (this.binder.update) {
        this.binder.update.call(this, models);
      }
    }

    // Returns elements value
    ;
    _proto.getValue = function getValue(el) {
      if (this.binder && this.binder.getValue) {
        return this.binder.getValue.call(this, el);
      } else {
        return getInputValue(el);
      }
    };
    return Binding;
  }();

  var textBinder = {
    routine: function routine(node, value) {
      node.data = value != null ? value : '';
    }
  };
  var DECLARATION_SPLIT = /((?:'[^']*')*(?:(?:[^\|']*(?:'[^']*')+[^\|']*)+|[^\|]+))|^$/g;
  var parseNode = function parseNode(view, node) {
    var block = false;
    if (node.nodeType === 3) {
      var tokens = parseTemplate(node.data, fluigbind$1.templateDelimiters);
      if (tokens) {
        for (var i = 0; i < tokens.length; i++) {
          var token = tokens[i];
          var text = document.createTextNode(token.value);
          node.parentNode.insertBefore(text, node);
          if (token.type === 1) {
            view.buildBinding(text, null, token.value, textBinder, null);
          }
        }
        node.parentNode.removeChild(node);
      }
      block = true;
    } else if (node.nodeType === 1) {
      block = view.traverse(node);
    }
    if (!block) {
      for (var _i = 0; _i < node.childNodes.length; _i++) {
        parseNode(view, node.childNodes[_i]);
      }
    }
  };
  var bindingComparator = function bindingComparator(a, b) {
    var aPriority = a.binder ? a.binder.priority || 0 : 0;
    var bPriority = b.binder ? b.binder.priority || 0 : 0;
    return bPriority - aPriority;
  };
  var trimStr = function trimStr(str) {
    return str.trim();
  };

  // A collection of bindings built from a set of parent nodes.
  var View = /*#__PURE__*/function () {
    // The DOM elements and the model objects for binding are passed into the
    // constructor along with any local options that should be used throughout the
    // context of the view and it's bindings.
    function View(els, models, options) {
      if (els.jquery || els instanceof Array) {
        this.els = els;
      } else {
        this.els = [els];
      }
      this.models = models;
      this.options = options;
      this.build();
    }
    var _proto = View.prototype;
    _proto.buildBinding = function buildBinding(node, type, declaration, binder, arg) {
      var pipes = declaration.match(DECLARATION_SPLIT).map(trimStr);
      var keypath = pipes.shift();
      this.bindings.push(new Binding(this, node, type, keypath, binder, arg, pipes));
    }

    // Parses the DOM tree and builds `Binding` instances for every matched
    // binding declaration.
    ;
    _proto.build = function build() {
      this.bindings = [];
      var elements = this.els,
        i,
        len;
      for (i = 0, len = elements.length; i < len; i++) {
        parseNode(this, elements[i]);
      }
      this.bindings.sort(bindingComparator);
    };
    _proto.traverse = function traverse(node) {
      var bindingPrefix = fluigbind$1._fullPrefix;
      var block = node.nodeName === 'SCRIPT' || node.nodeName === 'STYLE';
      var attributes = node.attributes;
      var bindInfos = [];
      var starBinders = this.options.starBinders;
      var type, binder, identifier, arg;
      for (var i = 0, len = attributes.length; i < len; i++) {
        var attribute = attributes[i];
        if (attribute.name.indexOf(bindingPrefix) === 0) {
          type = attribute.name.slice(bindingPrefix.length);
          binder = this.options.binders[type];
          arg = undefined;
          if (!binder) {
            for (var k = 0; k < starBinders.length; k++) {
              identifier = starBinders[k];
              if (type.slice(0, identifier.length - 1) === identifier.slice(0, -1)) {
                binder = this.options.binders[identifier];
                arg = type.slice(identifier.length - 1);
                break;
              }
            }
          }
          if (!binder) {
            binder = fluigbind$1.fallbackBinder;
          }
          if (binder.block) {
            this.buildBinding(node, type, attribute.value, binder, arg);
            node.removeAttribute(attribute.name);
            return true;
          }
          bindInfos.push({
            attr: attribute,
            binder: binder,
            type: type,
            arg: arg
          });
        }
      }
      for (var _i2 = 0; _i2 < bindInfos.length; _i2++) {
        var bindInfo = bindInfos[_i2];
        this.buildBinding(node, bindInfo.type, bindInfo.attr.value, bindInfo.binder, bindInfo.arg);
        node.removeAttribute(bindInfo.attr.name);
      }
      return block;
    }

    // Binds all of the current bindings for this view.
    ;
    _proto.bind = function bind() {
      this.bindings.forEach(function (binding) {
        binding.bind();
      });
    }

    // Unbinds all of the current bindings for this view.
    ;
    _proto.unbind = function unbind() {
      this.bindings.forEach(function (binding) {
        binding.unbind();
      });
    }

    // Syncs up the view with the model by running the routines on all bindings.
    ;
    _proto.sync = function sync() {
      this.bindings.forEach(function (binding) {
        binding.sync();
      });
    }

    // Publishes the input values from the view back to the model (reverse sync).
    ;
    _proto.publish = function publish() {
      this.bindings.forEach(function (binding) {
        if (binding.binder && binding.binder.publishes) {
          binding.publish();
        }
      });
    }

    // Updates the view's models along with any affected bindings.
    ;
    _proto.update = function update(models) {
      var _this = this;
      if (models === void 0) {
        models = {};
      }
      Object.keys(models).forEach(function (key) {
        _this.models[key] = models[key];
      });
      this.bindings.forEach(function (binding) {
        if (binding.update) {
          binding.update(models);
        }
      });
    };
    return View;
  }();

  /**
   * The default `.` adapter that comes with fluigbind.js. 
   * Allows subscribing to properties on plain objects, implemented in 
   * ES5 natives using `Object.defineProperty`.
   *
   * @summary The default `.` adapter that comes with fluigbind.js
   * @author Alexson Ferreira
   *
   * Created at     : 2023-03-09 09:22:27 
   * Last modified  : 2023-03-10 09:27:15
   */

  var ARRAY_METHODS = ['push', 'pop', 'shift', 'unshift', 'sort', 'reverse', 'splice'];
  var adapter = {
    counter: 0,
    weakmap: {},
    weakReference: function weakReference(obj) {
      if (!obj.hasOwnProperty('__flg')) {
        var id = this.counter++;
        Object.defineProperty(obj, '__flg', {
          value: id
        });
      }
      if (!this.weakmap[obj.__flg]) {
        this.weakmap[obj.__flg] = {
          callbacks: {}
        };
      }
      return this.weakmap[obj.__flg];
    },
    cleanupWeakReference: function cleanupWeakReference(data, refId) {
      if (!Object.keys(data.callbacks).length) {
        if (!(data.pointers && Object.keys(data.pointers).length)) {
          delete this.weakmap[refId];
        }
      }
    },
    stubFunction: function stubFunction(obj, fn) {
      var original = obj[fn];
      var data = this.weakReference(obj);
      var weakmap = this.weakmap;
      obj[fn] = function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        var response = original.apply(obj, args);
        Object.keys(data.pointers).forEach(function (refId) {
          var k = data.pointers[refId];
          if (weakmap[refId]) {
            if (weakmap[refId].callbacks[k] instanceof Array) {
              weakmap[refId].callbacks[k].forEach(function (callback) {
                callback.sync();
              });
            }
          }
        });
        return response;
      };
    },
    observeArray: function observeArray(value, refId, keypath) {
      var _this = this;
      if (value instanceof Array) {
        var data = this.weakReference(value);
        if (!data.pointers) {
          data.pointers = {};
          ARRAY_METHODS.forEach(function (fn) {
            _this.stubFunction(value, fn);
          });
        }
        if (!data.pointers[refId]) {
          data.pointers[refId] = [];
        }
        if (data.pointers[refId].indexOf(keypath) === -1) {
          data.pointers[refId].push(keypath);
        }
      }
    },
    unobserveArray: function unobserveArray(value, refId, keypath) {
      if (value instanceof Array && value.__flg != null) {
        var data = this.weakmap[value.__flg];
        if (data) {
          var pointers = data.pointers[refId];
          if (pointers) {
            var idx = pointers.indexOf(keypath);
            if (idx > -1) {
              pointers.splice(idx, 1);
            }
            if (!pointers.length) {
              delete data.pointers[refId];
            }
            this.cleanupWeakReference(data, value.__flg);
          }
        }
      }
    },
    observe: function observe(obj, keypath, callback) {
      var _this2 = this;
      var value;
      var callbacks = this.weakReference(obj).callbacks;
      if (!callbacks[keypath]) {
        callbacks[keypath] = [];
        var desc = Object.getOwnPropertyDescriptor(obj, keypath);
        if (!desc || !(desc.get || desc.set || !desc.configurable)) {
          value = obj[keypath];
          Object.defineProperty(obj, keypath, {
            enumerable: true,
            get: function get() {
              return value;
            },
            set: function set(newValue) {
              if (newValue !== value) {
                _this2.unobserveArray(value, obj.__flg, keypath);
                value = newValue;
                var data = _this2.weakmap[obj.__flg];
                if (data) {
                  var _callbacks = data.callbacks[keypath];
                  if (_callbacks) {
                    _callbacks.forEach(function (cb) {
                      cb.sync();
                    });
                  }
                  _this2.observeArray(newValue, obj.__flg, keypath);
                }
              }
            }
          });
        }
      }
      if (callbacks[keypath].indexOf(callback) === -1) {
        callbacks[keypath].push(callback);
      }
      this.observeArray(obj[keypath], obj.__rv, keypath);
    },
    unobserve: function unobserve(obj, keypath, callback) {
      var data = this.weakmap[obj.__rv];
      if (data) {
        var callbacks = data.callbacks[keypath];
        if (callbacks) {
          var idx = callbacks.indexOf(callback);
          if (idx > -1) {
            callbacks.splice(idx, 1);
            if (!callbacks.length) {
              delete data.callbacks[keypath];
              this.unobserveArray(obj[keypath], obj.__flg, keypath);
            }
          }
          this.cleanupWeakReference(data, obj.__flg);
        }
      }
    },
    get: function get(obj, keypath) {
      return obj[keypath];
    },
    set: function set(obj, keypath, value) {
      obj[keypath] = value;
    }
  };

  var formatters = {
    watch: function watch(value) {
      return value;
    },
    not: function not(value) {
      return !value;
    },
    json: function json(value) {
      return JSON.stringify(value);
    },
    number: {
      read: function read(value, style, locale, currency) {
        style = style || 'decimal';
        // "decimal" for plain number formatting.
        // "currency" for currency formatting.
        // "percent" for percent formatting.
        // "unit" for unit formatting.

        locale = locale || fluigbind$1.defaults.locale;
        currency = currency || fluigbind$1.defaults.currency;
        return new Intl.NumberFormat(locale, {
          style: style,
          currency: currency
        }).format(value);
      },
      publish: function publish(value) {
        var exp = /^\w{0,3}\W?\s?(\d+)[.,](\d+)?,?(\d+)?$/g;
        var replacer = function replacer(f, group1, group2, group3) {
          return group3 ? "" + group1 + group2 + "." + group3 : group1 + "." + group2;
        };
        return parseFloat(value.replace(exp, replacer));
      }
    }
  };

  var Component = /*#__PURE__*/function (_HTMLElement) {
    _inheritsLoose(Component, _HTMLElement);
    function Component() {
      return _HTMLElement.apply(this, arguments) || this;
    }
    var _proto = Component.prototype;
    _proto.connectedCallback = function connectedCallback() {
      var nodes = this.constructor.__templateEl.content.cloneNode(true);
      this.__fluigbindView = fluigbind$1.bind(nodes, this);
      while (this.firstChild) {
        this.removeChild(this.firstChild);
      }
      this.appendChild(nodes);
    };
    _proto.disconnectedCallback = function disconnectedCallback() {
      this.__fluigbindView.unbind();
    };
    _proto.attributeChangedCallback = function attributeChangedCallback(name, old, value) {
      if (old !== value) {
        var propName = this.constructor.__propAttributeMap[name];
        this[propName] = value;
      }
    };
    _createClass(Component, null, [{
      key: "observedAttributes",
      get: function get() {
        var template = this.template;
        if (!template) {
          throw new Error("No template declared for " + this.name);
        }
        this.__templateEl = document.createElement('template');
        this.__templateEl.innerHTML = template;
        var propAttributeMap = this.__propAttributeMap = {};
        var attributes = [];
        var properties = this.properties;
        if (properties) {
          Object.keys(properties).forEach(function (propName) {
            var propConfig = properties[propName];
            var attrName = typeof propConfig === 'string' ? propConfig : propName;
            propAttributeMap[attrName] = propName;
            attributes.push(attrName);
          });
        }
        return attributes;
      }
    }]);
    return Component;
  }( /*#__PURE__*/_wrapNativeSuper(HTMLElement));

  var AutocompleteBinder = {
    publishes: true,
    bind: function bind(el) {
      var self = this;
      var data = this.model.data;
      this.callback = function (e) {
        self.publish();
        el.dispatchEvent(new Event("change"));
      };
      this.model.autocomplete = FLUIGC.autocomplete(el, {
        source: substringMatcher(this.model),
        maxTags: 1,
        templates: {
          tag: data.tplSelected || '',
          suggestion: data.tplList || '',
          tip: data.tplTip || ''
        },
        minLength: 0,
        displayKey: data.displaykey,
        tagClass: data.tagClass || 'col-xs-12',
        type: 'tagAutocomplete',
        tagMaxWidth: 800
      });
      if (this.model.value) {
        this.model.autocomplete.add(this.model.value);
      }
      this.model.autocomplete.on('fluig.autocomplete.itemAdded', this.callback);
      this.model.autocomplete.on('fluig.autocomplete.itemRemoved', this.callback);
    },
    routine: function routine(el, value) {
      var oldValue = this.model.autocomplete.items()[0];
      if (value != oldValue) {
        if (oldValue) {
          if (value) {
            this.model.autocomplete.removeAll();
          } else {
            try {
              this.model.autocomplete.input()[0].parentNode.previousElementSibling.children[0].children[0].style.color = "white";
            } catch (err) {}
          }
        }
        if (value) {
          this.model.autocomplete.add(value);
        }
      }
    },
    getValue: function getValue(el) {
      return this.model.autocomplete.items()[0];
    }
  };
  var substringMatcher = function substringMatcher(model) {
    return function (q, cb) {
      var adapter = fluigbind.adapters['.'];
      var name = model.displaykey;
      var items = adapter.get(model, 'items');
      var matches, substrRegex;
      matches = [];
      substrRegex = new RegExp(q, 'i');
      items.forEach(function (str) {
        if (substrRegex.test(str[name])) {
          matches.push(str);
        }
      });

      // $.each(items, function (i, str) {
      //   if (substrRegex.test(str[name])) {
      //     matches.push(str);
      //   }
      // });
      cb(matches);
    };
  };

  var CalendarBinder = {
    bind: function bind(el) {
      var _this = this;
      this.changeDate = function (e) {
        if (Date.parse(_this.model.value) !== _this.model.calendar.getTimestampDate()) {
          _this.model.value = _this.model.calendar.getDate().format('YYYY-MM-DD HH:MM:SS.s');
          el.dispatchEvent(new Event("change"));
        }
      };
      this.model.calendar = FLUIGC.calendar(el);
      el.addEventListener('focusout', this.changeDate);
    },
    unbind: function unbind(el) {
      el.removeEventListener('focusout', this.changeDate);
    },
    routine: function routine(el, value) {
      if (value) {
        var date = Date.parse(value);
        this.model.calendar.setDate(new Date(date));
      }
    }
  };

  var getString = function getString(value) {
    return value != null ? value.toString() : undefined;
  };
  var times = function times(n, cb) {
    for (var i = 0; i < n; i++) cb();
  };
  function createView(binding, data, anchorEl) {
    var template = binding.el.cloneNode(true);
    var view = new View(template, data, binding.view.options);
    view.bind();
    binding.marker.parentNode.insertBefore(template, anchorEl);
    return view;
  }
  var binders = {
    autocomplete: AutocompleteBinder,
    calendar: CalendarBinder,
    child: function child(el, index) {
      var name = el.name;
      if (name.indexOf('___') > 0) {
        name = name.split('___')[0];
      }
      el.name = name + "___" + (index + 1);
    },
    'on-*': {
      function: true,
      priority: 1000,
      unbind: function unbind(el) {
        if (this.handler) {
          el.removeEventListener(this.arg, this.handler);
        }
      },
      routine: function routine(el, value) {
        if (this.handler) {
          el.removeEventListener(this.arg, this.handler);
        }
        this.handler = this.eventHandler(value);
        el.addEventListener(this.arg, this.handler);
      }
    },
    // Appends bound instances of the element in place for each item in the array.
    'each-*': {
      block: true,
      priority: 4000,
      bind: function bind(el) {
        if (!this.marker) {
          this.marker = document.createComment(" fluigbind: " + this.type + " ");
          this.iterated = [];
          el.parentNode.insertBefore(this.marker, el);
          el.parentNode.removeChild(el);
        } else {
          this.iterated.forEach(function (view) {
            view.bind();
          });
        }
      },
      unbind: function unbind(el) {
        if (this.iterated) {
          this.iterated.forEach(function (view) {
            view.unbind();
          });
        }
      },
      routine: function routine(el, collection) {
        var _this = this;
        var modelName = this.arg;
        collection = collection || [];
        var indexProp = el.getAttribute('index-property') || '$index';
        collection.forEach(function (model, index) {
          var data = {
            $parent: _this.view.models
          };
          data[indexProp] = index;
          data[modelName] = model;
          var view = _this.iterated[index];
          if (!view) {
            var previous = _this.marker;
            if (_this.iterated.length) {
              previous = _this.iterated[_this.iterated.length - 1].els[0];
            }
            view = createView(_this, data, previous.nextSibling);
            _this.iterated.push(view);
          } else {
            if (view.models[modelName] !== model) {
              // search for a view that matches the model
              var matchIndex, nextView;
              for (var nextIndex = index + 1; nextIndex < _this.iterated.length; nextIndex++) {
                nextView = _this.iterated[nextIndex];
                if (nextView.models[modelName] === model) {
                  matchIndex = nextIndex;
                  break;
                }
              }
              if (matchIndex !== undefined) {
                // model is in other position
                // todo: consider avoiding the splice here by setting a flag
                // profile performance before implementing such change
                _this.iterated.splice(matchIndex, 1);
                _this.marker.parentNode.insertBefore(nextView.els[0], view.els[0]);
                nextView.models[indexProp] = index;
              } else {
                //new model
                nextView = createView(_this, data, view.els[0]);
              }
              _this.iterated.splice(index, 0, nextView);
            } else {
              view.models[indexProp] = index;
            }
          }
        });
        if (this.iterated.length > collection.length) {
          times(this.iterated.length - collection.length, function () {
            var view = _this.iterated.pop();
            view.unbind();
            _this.marker.parentNode.removeChild(view.els[0]);
          });
        }
        if (el.nodeName === 'OPTION') {
          this.view.bindings.forEach(function (binding) {
            if (binding.el === _this.marker.parentNode && binding.type === 'value') {
              binding.sync();
            }
          });
        }
      },
      update: function update(models) {
        var _this2 = this;
        var data = {};

        //todo: add test and fix if necessary

        Object.keys(models).forEach(function (key) {
          if (key !== _this2.arg) {
            data[key] = models[key];
          }
        });
        this.iterated.forEach(function (view) {
          view.update(data);
        });
      }
    },
    // Adds or removes the class from the element when value is true or false.
    'class-*': function _class(el, value) {
      var elClass = " " + el.className + " ";
      if (!value === elClass.indexOf(" " + this.arg + " ") > -1) {
        if (value) {
          el.className = el.className + " " + this.arg;
        } else {
          el.className = elClass.replace(" " + this.arg + " ", ' ').trim();
        }
      }
    },
    // Sets the element's text value.
    text: function text(el, value) {
      el.textContent = value != null ? value : '';
    },
    // Sets the element's HTML content.
    html: function html(el, value) {
      el.innerHTML = value != null ? value : '';
    },
    // Shows the element when value is true.
    show: function show(el, value) {
      el.style.display = value ? '' : 'none';
    },
    // Hides the element when value is true (negated version of `show` binder).
    hide: function hide(el, value) {
      el.style.display = value ? 'none' : '';
    },
    // Enables the element when value is true.
    enabled: function enabled(el, value) {
      el.disabled = !value;
    },
    // Disables the element when value is true (negated version of `enabled` binder).
    disabled: function disabled(el, value) {
      el.disabled = !!value;
    },
    // Checks a checkbox or radio input when the value is true. Also sets the model
    // property when the input is checked or unchecked (two-way binder).
    checked: {
      publishes: true,
      priority: 2000,
      bind: function bind(el) {
        var self = this;
        if (!this.callback) {
          this.callback = function () {
            self.publish();
          };
        }
        el.addEventListener('change', this.callback);
      },
      unbind: function unbind(el) {
        el.removeEventListener('change', this.callback);
      },
      routine: function routine(el, value) {
        if (el.type === 'radio') {
          el.checked = getString(el.value) === getString(value);
        } else {
          el.checked = !!value;
        }
      }
    },
    // Sets the element's value. Also sets the model property when the input changes
    // (two-way binder).
    value: {
      publishes: true,
      priority: 3000,
      bind: function bind(el) {
        this.isRadio = el.tagName === 'INPUT' && el.type === 'radio';
        if (!this.isRadio) {
          this.event = el.getAttribute('event-name') || (el.tagName === 'SELECT' ? 'change' : 'input');
          var self = this;
          if (!this.callback) {
            this.callback = function () {
              self.publish();
            };
          }
          el.addEventListener(this.event, this.callback);
        }
      },
      unbind: function unbind(el) {
        if (!this.isRadio) {
          el.removeEventListener(this.event, this.callback);
        }
      },
      routine: function routine(el, value) {
        if (this.isRadio) {
          el.setAttribute('value', value);
        } else {
          if (el.type === 'select-multiple') {
            if (value instanceof Array) {
              for (var i = 0; i < el.length; i++) {
                var option = el[i];
                option.selected = value.indexOf(option.value) > -1;
              }
            }
          } else if (getString(value) !== getString(el.value)) {
            el.value = value != null ? value : '';
          }
        }
      }
    },
    // Inserts and binds the element and it's child nodes into the DOM when true.
    if: {
      block: true,
      priority: 4000,
      bind: function bind(el) {
        if (!this.marker) {
          this.marker = document.createComment(' fluigbind: ' + this.type + ' ' + this.keypath + ' ');
          this.attached = false;
          el.parentNode.insertBefore(this.marker, el);
          el.parentNode.removeChild(el);
        } else if (this.bound === false && this.nested) {
          this.nested.bind();
        }
        this.bound = true;
      },
      unbind: function unbind() {
        if (this.nested) {
          this.nested.unbind();
          this.bound = false;
        }
      },
      routine: function routine(el, value) {
        if (!!value !== this.attached) {
          if (value) {
            if (!this.nested) {
              this.nested = new View(el, this.view.models, this.view.options);
              this.nested.bind();
            }
            this.marker.parentNode.insertBefore(el, this.marker.nextSibling);
            this.attached = true;
          } else {
            el.parentNode.removeChild(el);
            this.attached = false;
          }
        }
      },
      update: function update(models) {
        if (this.nested) {
          this.nested.update(models);
        }
      }
    }
  };

  var FluigAutocomplete = /*#__PURE__*/function (_Component) {
    _inheritsLoose(FluigAutocomplete, _Component);
    function FluigAutocomplete() {
      var _this;
      _this = _Component.call(this) || this;
      var self = _assertThisInitialized(_this);
      self.model = fields[self.getAttribute('field')];
      return _this;
    }
    _createClass(FluigAutocomplete, null, [{
      key: "template",
      get: function get() {
        return "\n      <div flg-show=\"model.visible\" flg-class-has-error=\"model.errors\" flg-class-has-warning=\"model.warnings\" class=\"form-group\">\n        <label class=\"control-label\">{model.label}</label>\n        <div flg-show=\"model.loading\" class=\"fs-skeleton-loader fs-skeleton-loader-input\"></div>\n        <input flg-autocomplete=\"model.value\" flg-enabled=\"model.editable\" flg-show=\"model.loading | !\" type=\"text\" rv-class=\"model.classes\" flg-on-change=\"model.change\">\n        <p class=\"help-block\" flg-if=\"model.errors\"><i class=\"flaticon flaticon-global-error icon-sm\" aria-hidden=\"true\"></i>{model.errors}</p>\n        <p class=\"help-block\" flg-if=\"model.warnings\"><i class=\"flaticon flaticon-alert icon-sm\" aria-hidden=\"true\"></i>{model.warnings}</p>\n      </div>\n    ";
      }
    }, {
      key: "properties",
      get: function get() {
        return {
          field: true
        };
      }
    }]);
    return FluigAutocomplete;
  }(Component);

  // customElements.define('fluig-autocomplete', FluigAutocomplete);

  var FluigCalendar = /*#__PURE__*/function (_Component) {
    _inheritsLoose(FluigCalendar, _Component);
    function FluigCalendar() {
      var _this;
      _this = _Component.call(this) || this;
      var self = _assertThisInitialized(_this);
      self.model = fields[self.getAttribute('field')];
      return _this;
    }
    _createClass(FluigCalendar, null, [{
      key: "template",
      get: function get() {
        return "\n    <div flg-class-has-error=\"model.errors\" flg-class-has-warning=\"model.warnings\" class=\"form-group fs-text-center\">\n      <label>In\xEDcio Previsto</label>\n      <input class=\"fs-text-center\" type=\"text\" flg-enabled=\"model.editable\" flg-on-change=\"model.change\" flg-calendar=\"model.value\" />\n      <p class=\"help-block\" flg-if=\"model.errors\">{model.errors}</p>\n      <p class=\"help-block\" flg-if=\"model.warnings\">{model.warnings}</p>\n    </div>\n    ";
      }
    }, {
      key: "properties",
      get: function get() {
        return {
          field: true
        };
      }
    }]);
    return FluigCalendar;
  }(Component);

  // customElements.define('fluig-autocomplete', FluigAutocomplete);

  var components = {
    // Binds an event handler on the element.
    autocomplete: FluigAutocomplete,
    calendar: FluigCalendar
  };

  // Returns the public interface.

  fluigbind$1.Component = Component;
  fluigbind$1.binders = binders;
  fluigbind$1.formatters = formatters;
  fluigbind$1.adapters['.'] = adapter;
  fluigbind$1.components = components;

  // Binds some data to a template / element. Returns a fluigbind.View instance.
  fluigbind$1.bind = function (el, models, options) {
    var viewOptions = {};
    models = models || {};
    options = options || {};
    EXTENSIONS.forEach(function (extensionType) {
      viewOptions[extensionType] = Object.create(null);
      if (options[extensionType]) {
        Object.keys(options[extensionType]).forEach(function (key) {
          viewOptions[extensionType][key] = options[extensionType][key];
        });
      }
      Object.keys(fluigbind$1[extensionType]).forEach(function (key) {
        if (!viewOptions[extensionType][key]) {
          viewOptions[extensionType][key] = fluigbind$1[extensionType][key];
        }
      });
    });
    OPTIONS.forEach(function (option) {
      var value = options[option];
      viewOptions[option] = value != null ? value : fluigbind$1[option];
    });
    viewOptions.starBinders = Object.keys(viewOptions.binders).filter(function (key) {
      return key.indexOf('*') > 0;
    });
    Observer.updateOptions(viewOptions);
    var view = new View(el, models, viewOptions);
    view.bind();
    return view;
  };

  return fluigbind$1;

})));
//# sourceMappingURL=fluigbind.js.map
