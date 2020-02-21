/* global document CustomEvent window */

import { Utils } from '../utils/Utils';

class Element {
  constructor(tag, className = '') {
    if (typeof tag === 'string') {
      this.el = document.createElement(tag);
      this.el.className = className;
    } else {
      this.el = tag;
    }
    this.el.data = [];
  }

  data(key, value) {
    if (value !== undefined) {
      this.el.data[key] = value;
      return this;
    }
    return this.el.data[key];
  }

  on(eventNames, handler) {
    const [fen, ...oen] = eventNames.split('.');
    let eventName = fen;
    if (eventName === 'mousewheel' && /Firefox/i.test(window.navigator.userAgent)) {
      eventName = 'DOMMouseScroll';
    }
    this.el.addEventListener(eventName, (evt) => {
      handler(evt);
      for (let i = 0; i < oen.length; i += 1) {
        const k = oen[i];
        if (k === 'left' && evt.button !== 0) {
          return;
        }
        if (k === 'right' && evt.button !== 2) {
          return;
        }
        if (k === 'stop') {
          evt.stopPropagation();
        }
      }
    });
    return this;
  }

  offset(value) {
    if (value !== undefined) {
      Object.keys(value).forEach((k) => {
        this.css(k, `${value[k]}px`);
      });
      return this;
    }
    const {
      offsetTop, offsetLeft, offsetHeight, offsetWidth,
    } = this.el;
    return {
      top: offsetTop,
      left: offsetLeft,
      height: offsetHeight,
      width: offsetWidth,
    };
  }

  scroll(v) {
    const { el } = this;
    if (v !== undefined) {
      if (v.left !== undefined) {
        el.scrollLeft = v.left;
      }
      if (v.top !== undefined) {
        el.scrollTop = v.top;
      }
    }
    return { left: el.scrollLeft, top: el.scrollTop };
  }

  scrollTop() {
    return this.el.scrollTop;
  }

  clientHeight() {
    return this.el.clientHeight;
  }

  box() {
    return this.el.getBoundingClientRect();
  }

  parent() {
    return new Element(this.el.parentNode);
  }

  children(...args) {
    if (arguments.length === 0) {
      return this.el.childNodes;
    }
    args.forEach(ele => this.child(ele));
    return this;
  }

  first() {
    return this.el.firstChild;
  }

  last() {
    return this.el.lastChild;
  }

  remove(ele) {
    return this.el.removeChild(ele.el || ele);
  }

  prepend(ele) {
    const { el } = this;
    if (el.children.length > 0) {
      el.insertBefore(ele, el.firstChild);
    } else {
      el.appendChild(ele);
    }
    return this;
  }

  prev() {
    return this.el.previousSibling;
  }

  next() {
    return this.el.nextSibling;
  }

  child(arg) {
    let ele = arg;
    if (typeof arg === 'string') {
      ele = document.createTextNode(arg);
    } else if (arg instanceof Element) {
      ele = arg.el;
    }
    this.el.appendChild(ele);
    return this;
  }

  contains(ele) {
    return this.el.contains(ele);
  }

  className(v) {
    if (v !== undefined) {
      this.el.className = v;
      return this;
    }
    return this.el.className;
  }

  addClass(name) {
    this.el.classList.add(name);
    return this;
  }

  hasClass(name) {
    return this.el.classList.contains(name);
  }

  removeClass(name) {
    this.el.classList.remove(name);
    return this;
  }

  toggle(cls = 'active') {
    return this.toggleClass(cls);
  }

  toggleClass(name) {
    return this.el.classList.toggle(name);
  }

  active(flag = true, cls = 'active') {
    if (flag) this.addClass(cls);
    else this.removeClass(cls);
    return this;
  }

  checked(flag = true) {
    this.active(flag, 'checked');
    return this;
  }

  disabled(flag = true) {
    if (flag) this.addClass('disabled');
    else this.removeClass('disabled');
    return this;
  }

  attr(key, value) {
    if (value !== undefined) {
      this.el.setAttribute(key, value);
    } else {
      if (typeof key === 'string') {
        return this.el.getAttribute(key);
      }
      Object.keys(key).forEach((k) => {
        this.el.setAttribute(k, key[k]);
      });
    }
    return this;
  }

  removeAttr(key) {
    this.el.removeAttribute(key);
    return this;
  }

  html(content) {
    if (content !== undefined) {
      this.el.innerHTML = content;
      return this;
    }
    return this.el.innerHTML;
  }

  val(v) {
    if (v !== undefined) {
      this.el.value = v;
      return this;
    }
    return this.el.value;
  }

  cssRemoveKeys(...keys) {
    keys.forEach(k => this.el.style.removeProperty(k));
    return this;
  }

  /**
   * set or get style attr
   * @param name
   * @param value
   * @returns {String|Element}
   */
  css(name, value) {
    if (value === undefined && typeof name !== 'string') {
      Object.keys(name).forEach((k) => {
        this.el.style[k] = name[k];
      });
      return this;
    }
    if (value !== undefined) {
      this.el.style[name] = value;
      return this;
    }
    return this.el.style[name];
  }

  computedStyle() {
    return window.getComputedStyle(this.el, null);
  }

  show() {
    const style = this.computedStyle();
    if (style && style.display !== 'block') {
      this.css('display', 'block');
    }
    return this;
  }

  hide() {
    const style = this.computedStyle();
    if (style && style.display !== 'none') {
      this.css('display', 'none');
    }
    return this;
  }

  display(on) {
    if (on) this.show(); else this.hide();
  }

  text(val) {
    if (val === undefined) return this.el.innerText;
    this.el.innerText = val;
    return val;
  }

  sibling() {
    let sibling = this.el;
    const result = [];
    // eslint-disable-next-line no-cond-assign
    while ((sibling = sibling.previousElementSibling) !== null) result.push(new Element(sibling));
    sibling = this.el;
    // eslint-disable-next-line no-cond-assign
    while ((sibling = sibling.nextElementSibling) !== null) result.push(new Element(sibling));
    return result;
  }

  position() {
    let top = 0; let left = 0; const right = 0; const bottom = 0;
    if (this.el.style.position) {
      if (this.el.top) {
        top = this.el.style.top
          .replace('%', '')
          .repeat('px', '');
      }
      if (this.el.left) {
        left = this.el.style.left
          .replace('%', '')
          .repeat('px', '');
      }
      if (this.el.right) {
        top = this.el.style.right
          .replace('%', '')
          .repeat('px', '');
      }
      if (this.el.bottom) {
        top = this.el.style.bottom
          .replace('%', '')
          .repeat('px', '');
      }
    }
    return {
      top: Utils.parseFloat(top),
      left: Utils.parseFloat(left),
      right: Utils.parseFloat(right),
      bottom: Utils.parseFloat(bottom),
    };
  }

  trigger(type, message) {
    const event = new CustomEvent(type, {
      detail: message,
      bubbles: true,
      cancelable: false,
    });
    this.el.dispatchEvent(event);
  }

  focus() {
    this.el.focus();
  }

  find(select) {
    const result = this.el.querySelectorAll(select);
    if (result && result.length === 1) {
      return new Element(result[0]);
    }
    const eleArray = [];
    if (result) {
      // eslint-disable-next-line no-restricted-syntax
      for (const item of result) {
        eleArray.push(new Element(item));
      }
    }
    return eleArray;
  }

  isChild(target) {
    let targetEl = target || target.el;
    while (targetEl !== undefined && targetEl !== null && targetEl !== document.body) {
      if (targetEl === this.el) return true;
      targetEl = targetEl.parentNode;
    }
    return false;
  }
}

const h = (tag, className = '') => new Element(tag, className);

export {
  Element,
  h,
};
