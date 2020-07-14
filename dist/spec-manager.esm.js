import 'core-js/modules/es.array.filter';
import 'core-js/modules/es.array.for-each';
import 'core-js/modules/es.array.iterator';
import 'core-js/modules/es.array.join';
import 'core-js/modules/es.array.map';
import 'core-js/modules/es.object.assign';
import 'core-js/modules/es.object.entries';
import 'core-js/modules/es.object.to-string';
import 'core-js/modules/es.set';
import 'core-js/modules/es.string.iterator';
import 'core-js/modules/web.dom-collections.for-each';
import 'core-js/modules/web.dom-collections.iterator';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _createForOfIteratorHelper(o, allowArrayLike) {
  var it;

  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;

      var F = function () {};

      return {
        s: F,
        n: function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function (e) {
          throw e;
        },
        f: F
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var normalCompletion = true,
      didErr = false,
      err;
  return {
    s: function () {
      it = o[Symbol.iterator]();
    },
    n: function () {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function (e) {
      didErr = true;
      err = e;
    },
    f: function () {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

/**
 * 处理规格选择
 *
 * <S> 规格类型，例如后端传来的 { color: '红色', size: 'xxl' }
 */
var SpecHandler = /*#__PURE__*/function () {
  /** 配置信息 */

  /** 
   * 连线信息
   */

  /**
   * 规格数据
   * 例如:
   * {
   *   color_size: { color:  }
   * }
   */

  /** 
   * 规格原始数据
   */

  /**
   * meta数据中key到index的映射
   */

  /**
   * 当前选择的规格
   */
  function SpecHandler(options) {
    _classCallCheck(this, SpecHandler);

    _defineProperty(this, "options", void 0);

    _defineProperty(this, "map", {});

    _defineProperty(this, "lineMap", {});

    _defineProperty(this, "specMap", {});

    _defineProperty(this, "meta", []);

    _defineProperty(this, "metaMap", {});

    _defineProperty(this, "selected", {});

    this.options = Object.assign({
      minQuantity: 1
    }, options);
  }
  /**
   * 添加规格原始数据
   *
   * @param {SpecManager.SpecKey} specKey 规格字段名
   * @param {SpecManager.SpecName} name 规格名
   * @param list 所有规格
   */


  _createClass(SpecHandler, [{
    key: "addMeta",
    value: function addMeta(specKey, specName, list) {
      var self = this; // 已经添加过了

      if (self.metaMap[specKey] >= 0) {
        // todo: warn
        return;
      }

      self.metaMap[specKey] = self.meta.length;
      self.meta.push({
        key: specKey,
        name: specName,
        list: new Set(list || [])
      }); // todo: 考虑是否有必要

      if (list) {
        list.forEach(function (specName) {
          if (!self.map[specKey][specName]) {
            self.map[specKey][specName] = {
              quantity: 0,
              enable: true
            };
          }
        });
      } // tip: 帮助vue建立可观测的对象


      this.selected[specKey] = null;
    }
    /**
     * 为规格添加库存
     *
     * @param {SpecManager.SpecKey} specKey 规格key
     * @param {SpecManager.SpecName} specName 规格
     * @param {number} quantity 数量
     */

  }, {
    key: "addSpecQuantity",
    value: function addSpecQuantity(specKey, specName, quantity) {
      var map = this.map; // todo: 考虑是否要求先添加meta

      if (!map[specKey]) {
        map[specKey] = {};
      }

      if (!map[specKey][specName]) {
        map[specKey][specName] = {
          quantity: quantity || 0,
          enable: true
        };
      } else {
        map[specKey][specName].quantity += quantity;
      }
    }
    /**
     * 建立line
     */

  }, {
    key: "buildLine",
    value: function buildLine(item) {
      var keys = this.meta.map(function (item) {
        return item.key;
      });
      var l = keys.length;

      for (var x = 0; x < l; x++) {
        for (var y = 0; y < l; y++) {
          if (x === y) {
            continue;
          }

          var _key = item[keys[x]] + '_' + item[keys[y]]; // 根据quantity来创建spec


          if (item.quantity >= this.options.minQuantity) {
            this.lineMap[_key] = true;
          }
        }
      }
    }
    /**
     * 保存在specMap中
     *
     * @param spec 规格数据
     */

  }, {
    key: "storeSpecMap",
    value: function storeSpecMap(spec) {
      var keys = this.meta.map(function (item) {
        return item.key;
      });
      console.log('target5', keys);
      this.specMap[keys.map(function (key) {
        return spec[key];
      }).join('_')] = spec;
    }
    /**
     * 开启/关闭规格
     * @param {SpecManager.SpecKey} key 规格key
     * @param {SpecManager.SpecValue} spec 规格内容
     */

  }, {
    key: "toggleSpec",
    value: function toggleSpec(key, spec) {
      // toggle规格
      this.selected[key] = this.selected[key] === spec ? null : spec;
      this.refreshSpec();
    }
    /**
     * 刷新规格信息
     */

  }, {
    key: "refreshSpec",
    value: function refreshSpec() {
      var metaList = this.meta;
      var lineMap = this.lineMap; // tip: 不使用isUndef，是为了不引入lib/utils，因为引入会导致单元测试失败

      var selectedEntries = Object.entries(this.selected).filter(function (item) {
        return item[1] !== null && item[1] !== undefined;
      }); // 没有选中，全部重置

      var _iterator = _createForOfIteratorHelper(metaList),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var meta = _step.value;

          var _iterator2 = _createForOfIteratorHelper(meta.list),
              _step2;

          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var spec = _step2.value;
              var enable = true;

              var _iterator3 = _createForOfIteratorHelper(selectedEntries),
                  _step3;

              try {
                for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                  var _step3$value = _slicedToArray(_step3.value, 2),
                      sKey = _step3$value[0],
                      sSpec = _step3$value[1];

                  // 同key不检查
                  if (meta.key === sKey) {
                    continue;
                  }

                  enable = enable && !!lineMap[spec + '_' + sSpec];
                }
              } catch (err) {
                _iterator3.e(err);
              } finally {
                _iterator3.f();
              }

              this.map[meta.key][spec].enable = enable;
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
    /**
     * 使用spec数据
     */

  }, {
    key: "select",
    value: function select(spec) {
      var _this = this;

      this.meta.forEach(function (meta) {
        _this.selected[meta.key] = spec[meta.key];
      });
    }
    /**
     * 重置选择的内容
     */

  }, {
    key: "resetSelected",
    value: function resetSelected() {
      var _this2 = this;

      this.meta.forEach(function (meta) {
        _this2.selected[meta.key] = null;
      });
    }
    /**
     * 获取选中的规格信息
     */

  }, {
    key: "getSelectedSpecification",
    value: function getSelectedSpecification() {
      var _this3 = this;

      var keys = this.meta.map(function (item) {
        return item.key;
      });
      return this.specMap[keys.map(function (key) {
        return _this3.selected[key];
      }).join('_')];
    }
  }]);

  return SpecHandler;
}();

export { SpecHandler };
