import { parseTime } from './base.js';

/**
 * 表格时间格式化
 * @param {Date|string|number} cellValue - 需要格式化的日期值，可以是Date对象、日期字符串或时间戳
 * @returns {string} 返回格式化的日期时间字符串，格式为"YYYY-MM-DD HH:MM:SS"
 */
export function formatDate(cellValue) {
  if (cellValue == null || cellValue == '') return '';
  var date = new Date(cellValue);
  var year = date.getFullYear();
  var month =
    date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1;
  var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  var minutes =
    date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  var seconds =
    date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  return (
    year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
  );
}

/**
 * 格式化时间戳为相对时间或指定格式的日期时间字符串。
 * @param {number|string} time - 时间戳，可以是秒或毫秒。
 * @param {string} [option] - 可选的日期时间格式化字符串。
 * @returns {string} - 格式化后的时间字符串。
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000;
  } else {
    time = +time;
  }
  const d = new Date(time);
  const now = Date.now();

  const diff = (now - d) / 1000;

  if (diff < 30) {
    return '刚刚';
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前';
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前';
  } else if (diff < 3600 * 24 * 2) {
    return '1天前';
  }
  if (option) {
    return parseTime(time, option);
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    );
  }
}

/**
 * 解析URL中的查询字符串并返回一个包含参数键值对的对象。
 * @param {string} [url] - 可选的URL字符串，如果不提供则使用当前页面的URL。
 * @returns {Object} - 包含查询参数键值对的对象。
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url;
  const search = url.substring(url.lastIndexOf('?') + 1);
  const obj = {};
  const reg = /([^?&=]+)=([^?&=]*)/g;
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1);
    let val = decodeURIComponent($2);
    val = String(val);
    obj[name] = val;
    return rs;
  });
  return obj;
}

/**
 * 计算UTF-8编码字符串的字节长度。
 * @param {string} str - 要计算字节长度的字符串。
 * @returns {number} - 字符串的字节长度。
 */
export function byteLength(str) {
  // 初始化长度为字符串的字符数
  let s = str.length;
  // 遍历字符串的每个字符
  for (let i = str.length - 1; i >= 0; i--) {
    // 获取当前字符的Unicode编码
    const code = str.charCodeAt(i);
    // 如果字符编码在0x80到0x7ff之间，说明需要2个字节
    if (code > 0x7f && code <= 0x7ff) s++;
    // 如果字符编码在0x800到0xffff之间，说明需要3个字节
    else if (code > 0x7ff && code <= 0xffff) s += 2;
    // 如果字符是代理对的一部分（用于表示4字节字符），则不增加字节长度
    // 并且需要跳过代理对的前一个字符
    if (code >= 0xdc00 && code <= 0xdfff) i--;
  }
  // 返回计算出的字节长度
  return s;
}

/**
 * 清理数组，移除所有假值（如undefined, null, 0, false, 空字符串等）。
 * @param {Array} actual - 需要清理的数组。
 * @returns {Array} - 清理后的新数组，只包含真值。
 */
export function cleanArray(actual) {
  const newArray = []; // 初始化一个空数组来存放清理后的真值
  for (let i = 0; i < actual.length; i++) {
    // 遍历传入的数组
    if (actual[i]) {
      // 检查当前元素是否是真值
      newArray.push(actual[i]); // 如果是真值，则添加到新数组中
    }
  }
  return newArray; // 返回清理后的新数组
}

/**
 * 将JSON对象转换为URL查询字符串。
 * @param {Object} json - 需要转换的JSON对象。
 * @returns {string} - 转换后的URL查询字符串。
 */
export function param(json) {
  if (!json) return '';
  return cleanArray(
    Object.keys(json).map((key) => {
      if (json[key] === undefined) return '';
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
    }),
  ).join('&');
}

/**
 * 将URL查询字符串转换为JSON对象。
 * @param {string} url - 包含查询字符串的URL。
 * @returns {Object} - 转换后的JSON对象。
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ');
  if (!search) {
    return {};
  }
  const obj = {};
  const searchArr = search.split('&');
  searchArr.forEach((v) => {
    const index = v.indexOf('=');
    if (index !== -1) {
      const name = v.substring(0, index);
      const val = v.substring(index + 1, v.length);
      obj[name] = val;
    }
  });
  return obj;
}

/**
 * 将HTML字符串转换为纯文本字符串。
 * @param {string} val - 要转换的HTML字符串。
 * @returns {string} - 转换后的纯文本字符串。
 */
export function html2Text(val) {
  const div = document.createElement('div');
  div.innerHTML = val;
  return div.textContent || div.innerText;
}

/**
 * 合并两个对象，给最后一个优先
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
  if (typeof target !== 'object') {
    target = {};
  }
  if (Array.isArray(source)) {
    return source.slice();
  }
  Object.keys(source).forEach((property) => {
    const sourceProperty = source[property];
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty);
    } else {
      target[property] = sourceProperty;
    }
  });
  return target;
}

/**
 * 切换元素上指定的类名。
 * 如果类名不存在，则添加；如果已存在，则移除。
 * @param {Element} element - 需要操作的DOM元素。
 * @param {string} className - 要切换的类名。
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return;
  }
  let classString = element.className;
  const nameIndex = classString.indexOf(className);
  if (nameIndex === -1) {
    classString += '' + className;
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length);
  }
  element.className = classString;
}

/**
 * 根据传入的类型获取时间戳。
 * @param {string} type - 指定获取的时间类型，可以是'start'或'end'。
 * @returns {number} - 返回对应类型的时间戳。
 */
export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90;
  } else {
    return new Date(new Date().toDateString());
  }
}

/**
 * 函数防抖
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result;

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp;

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function (...args) {
    context = this;
    timestamp = +new Date();
    const callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}

/**
 * 这只是一个简单的版本的深拷贝
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone');
  }
  const targetObj = source.constructor === Array ? [] : {};
  Object.keys(source).forEach((keys) => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys]);
    } else {
      targetObj[keys] = source[keys];
    }
  });
  return targetObj;
}

/**
 * 从数组中去除重复的元素并返回一个新的数组。
 * @param {Array} arr - 需要去重的数组。
 * @returns {Array} - 去重后的数组。
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr));
}

/**
 * 生成一个唯一的字符串。
 * @returns {string} - 生成的唯一字符串。
 */
export function createUniqueString() {
  const timestamp = +new Date() + '';
  const randomNum = parseInt((1 + Math.random()) * 65536) + '';
  return (+(randomNum + timestamp)).toString(32);
}

/**
 * 检查元素是否具有类
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

/**
 * 将类添加到元素
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls;
}

/**
 * 从元素中删除类
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
    ele.className = ele.className.replace(reg, ' ');
  }
}

/**
 * 根据给定的字符串创建一个映射，用于检查值是否在给定的字符串列表中。
 * @param {string} str - 逗号分隔的值列表。
 * @param {boolean} [expectsLowerCase=false] - 是否期望小写的值。
 * @returns {Function} - 一个检查函数，接受一个值作为参数。
 */
export function makeMap(str, expectsLowerCase) {
  const map = Object.create(null);
  const list = str.split(',');
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase ? (val) => map[val.toLowerCase()] : (val) => map[val];
}

/**
 * export default是一个关键字，用于导出模块中的默认值
 * */
export const exportDefault = 'export default ';

export const beautifierConf = {
  html: {
    indent_size: '2',
    indent_char: ' ',
    max_preserve_newlines: '-1',
    preserve_newlines: false,
    keep_array_indentation: false,
    break_chained_methods: false,
    indent_scripts: 'separate',
    brace_style: 'end-expand',
    space_before_conditional: true,
    unescape_strings: false,
    jslint_happy: false,
    end_with_newline: true,
    wrap_line_length: '110',
    indent_inner_html: true,
    comma_first: false,
    e4x: true,
    indent_empty_lines: true,
  },
  js: {
    indent_size: '2',
    indent_char: ' ',
    max_preserve_newlines: '-1',
    preserve_newlines: false,
    keep_array_indentation: false,
    break_chained_methods: false,
    indent_scripts: 'normal',
    brace_style: 'end-expand',
    space_before_conditional: true,
    unescape_strings: false,
    jslint_happy: true,
    end_with_newline: true,
    wrap_line_length: '110',
    indent_inner_html: true,
    comma_first: false,
    e4x: true,
    indent_empty_lines: true,
  },
};

/**
 * 首字母大小
 * */
export function titleCase(str) {
  return str.replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
}

/**
 * 下划转驼峰
 * */
export function camelCase(str) {
  return str.replace(/_[a-z]/g, (str1) => str1.substr(-1).toUpperCase());
}

/**
 * 检查字符串是否是一个有效的数字字符串。
 * @param {string} str - 要检查的字符串。
 * @returns {boolean} - 如果字符串是有效的数字字符串，则返回true；否则返回false。
 */
export function isNumberStr(str) {
  return /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g.test(str);
}
