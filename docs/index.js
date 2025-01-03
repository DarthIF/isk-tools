// node_modules/svelte/src/runtime/internal/utils.js
function noop() {
}
function assign(tar, src) {
  for (const k in src) tar[k] = src[k];
  return (
    /** @type {T & S} */
    tar
  );
}
function run(fn) {
  return fn();
}
function blank_object() {
  return /* @__PURE__ */ Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === "function";
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || a && typeof a === "object" || typeof a === "function";
}
var src_url_equal_anchor;
function src_url_equal(element_src, url) {
  if (element_src === url) return true;
  if (!src_url_equal_anchor) {
    src_url_equal_anchor = document.createElement("a");
  }
  src_url_equal_anchor.href = url;
  return element_src === src_url_equal_anchor.href;
}
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}
function create_slot(definition, ctx, $$scope, fn) {
  if (definition) {
    const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
    return definition[0](slot_ctx);
  }
}
function get_slot_context(definition, ctx, $$scope, fn) {
  return definition[1] && fn ? assign($$scope.ctx.slice(), definition[1](fn(ctx))) : $$scope.ctx;
}
function get_slot_changes(definition, $$scope, dirty, fn) {
  if (definition[2] && fn) {
    const lets = definition[2](fn(dirty));
    if ($$scope.dirty === void 0) {
      return lets;
    }
    if (typeof lets === "object") {
      const merged = [];
      const len = Math.max($$scope.dirty.length, lets.length);
      for (let i = 0; i < len; i += 1) {
        merged[i] = $$scope.dirty[i] | lets[i];
      }
      return merged;
    }
    return $$scope.dirty | lets;
  }
  return $$scope.dirty;
}
function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
  if (slot_changes) {
    const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
    slot.p(slot_context, slot_changes);
  }
}
function get_all_dirty_from_scope($$scope) {
  if ($$scope.ctx.length > 32) {
    const dirty = [];
    const length = $$scope.ctx.length / 32;
    for (let i = 0; i < length; i++) {
      dirty[i] = -1;
    }
    return dirty;
  }
  return -1;
}

// node_modules/svelte/src/runtime/internal/globals.js
var globals = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : (
  // @ts-ignore Node typings have this
  global
);

// node_modules/svelte/src/runtime/internal/ResizeObserverSingleton.js
var ResizeObserverSingleton = class _ResizeObserverSingleton {
  /**
   * @private
   * @readonly
   * @type {WeakMap<Element, import('./private.js').Listener>}
   */
  _listeners = "WeakMap" in globals ? /* @__PURE__ */ new WeakMap() : void 0;
  /**
   * @private
   * @type {ResizeObserver}
   */
  _observer = void 0;
  /** @type {ResizeObserverOptions} */
  options;
  /** @param {ResizeObserverOptions} options */
  constructor(options) {
    this.options = options;
  }
  /**
   * @param {Element} element
   * @param {import('./private.js').Listener} listener
   * @returns {() => void}
   */
  observe(element2, listener) {
    this._listeners.set(element2, listener);
    this._getObserver().observe(element2, this.options);
    return () => {
      this._listeners.delete(element2);
      this._observer.unobserve(element2);
    };
  }
  /**
   * @private
   */
  _getObserver() {
    return this._observer ?? (this._observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        _ResizeObserverSingleton.entries.set(entry.target, entry);
        this._listeners.get(entry.target)?.(entry);
      }
    }));
  }
};
ResizeObserverSingleton.entries = "WeakMap" in globals ? /* @__PURE__ */ new WeakMap() : void 0;

// node_modules/svelte/src/runtime/internal/dom.js
var is_hydrating = false;
function start_hydrating() {
  is_hydrating = true;
}
function end_hydrating() {
  is_hydrating = false;
}
function append(target, node) {
  target.appendChild(node);
}
function insert(target, node, anchor) {
  target.insertBefore(node, anchor || null);
}
function detach(node) {
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
}
function element(name) {
  return document.createElement(name);
}
function text(data) {
  return document.createTextNode(data);
}
function space() {
  return text(" ");
}
function listen(node, event, handler, options) {
  node.addEventListener(event, handler, options);
  return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value) {
  if (value == null) node.removeAttribute(attribute);
  else if (node.getAttribute(attribute) !== value) node.setAttribute(attribute, value);
}
function to_number(value) {
  return value === "" ? null : +value;
}
function children(element2) {
  return Array.from(element2.childNodes);
}
function set_data(text2, data) {
  data = "" + data;
  if (text2.data === data) return;
  text2.data = /** @type {string} */
  data;
}
function set_input_value(input, value) {
  input.value = value == null ? "" : value;
}
function set_style(node, key, value, important) {
  if (value == null) {
    node.style.removeProperty(key);
  } else {
    node.style.setProperty(key, value, important ? "important" : "");
  }
}
function get_custom_elements_slots(element2) {
  const result = {};
  element2.childNodes.forEach(
    /** @param {Element} node */
    (node) => {
      result[node.slot || "default"] = true;
    }
  );
  return result;
}

// node_modules/svelte/src/runtime/internal/lifecycle.js
var current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component) throw new Error("Function called outside component initialization");
  return current_component;
}
function onMount(fn) {
  get_current_component().$$.on_mount.push(fn);
}
function bubble(component, event) {
  const callbacks = component.$$.callbacks[event.type];
  if (callbacks) {
    callbacks.slice().forEach((fn) => fn.call(this, event));
  }
}

// node_modules/svelte/src/runtime/internal/scheduler.js
var dirty_components = [];
var binding_callbacks = [];
var render_callbacks = [];
var flush_callbacks = [];
var resolved_promise = /* @__PURE__ */ Promise.resolve();
var update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
var seen_callbacks = /* @__PURE__ */ new Set();
var flushidx = 0;
function flush() {
  if (flushidx !== 0) {
    return;
  }
  const saved_component = current_component;
  do {
    try {
      while (flushidx < dirty_components.length) {
        const component = dirty_components[flushidx];
        flushidx++;
        set_current_component(component);
        update(component.$$);
      }
    } catch (e) {
      dirty_components.length = 0;
      flushidx = 0;
      throw e;
    }
    set_current_component(null);
    dirty_components.length = 0;
    flushidx = 0;
    while (binding_callbacks.length) binding_callbacks.pop()();
    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      if (!seen_callbacks.has(callback)) {
        seen_callbacks.add(callback);
        callback();
      }
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }
  update_scheduled = false;
  seen_callbacks.clear();
  set_current_component(saved_component);
}
function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}
function flush_render_callbacks(fns) {
  const filtered = [];
  const targets = [];
  render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
  targets.forEach((c) => c());
  render_callbacks = filtered;
}

// node_modules/svelte/src/runtime/internal/transitions.js
var outroing = /* @__PURE__ */ new Set();
var outros;
function transition_in(block, local) {
  if (block && block.i) {
    outroing.delete(block);
    block.i(local);
  }
}
function transition_out(block, local, detach2, callback) {
  if (block && block.o) {
    if (outroing.has(block)) return;
    outroing.add(block);
    outros.c.push(() => {
      outroing.delete(block);
      if (callback) {
        if (detach2) block.d(1);
        callback();
      }
    });
    block.o(local);
  } else if (callback) {
    callback();
  }
}

// node_modules/svelte/src/shared/boolean_attributes.js
var _boolean_attributes = (
  /** @type {const} */
  [
    "allowfullscreen",
    "allowpaymentrequest",
    "async",
    "autofocus",
    "autoplay",
    "checked",
    "controls",
    "default",
    "defer",
    "disabled",
    "formnovalidate",
    "hidden",
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
    "selected"
  ]
);
var boolean_attributes = /* @__PURE__ */ new Set([..._boolean_attributes]);

// node_modules/svelte/src/runtime/internal/Component.js
function create_component(block) {
  block && block.c();
}
function mount_component(component, target, anchor) {
  const { fragment, after_update } = component.$$;
  fragment && fragment.m(target, anchor);
  add_render_callback(() => {
    const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
    if (component.$$.on_destroy) {
      component.$$.on_destroy.push(...new_on_destroy);
    } else {
      run_all(new_on_destroy);
    }
    component.$$.on_mount = [];
  });
  after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    flush_render_callbacks($$.after_update);
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}
function make_dirty(component, i) {
  if (component.$$.dirty[0] === -1) {
    dirty_components.push(component);
    schedule_update();
    component.$$.dirty.fill(0);
  }
  component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
}
function init(component, options, instance6, create_fragment6, not_equal, props, append_styles = null, dirty = [-1]) {
  const parent_component = current_component;
  set_current_component(component);
  const $$ = component.$$ = {
    fragment: null,
    ctx: [],
    // state
    props,
    update: noop,
    not_equal,
    bound: blank_object(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
    // everything else
    callbacks: blank_object(),
    dirty,
    skip_bound: false,
    root: options.target || parent_component.$$.root
  };
  append_styles && append_styles($$.root);
  let ready = false;
  $$.ctx = instance6 ? instance6(component, options.props || {}, (i, ret, ...rest) => {
    const value = rest.length ? rest[0] : ret;
    if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
      if (!$$.skip_bound && $$.bound[i]) $$.bound[i](value);
      if (ready) make_dirty(component, i);
    }
    return ret;
  }) : [];
  $$.update();
  ready = true;
  run_all($$.before_update);
  $$.fragment = create_fragment6 ? create_fragment6($$.ctx) : false;
  if (options.target) {
    if (options.hydrate) {
      start_hydrating();
      const nodes = children(options.target);
      $$.fragment && $$.fragment.l(nodes);
      nodes.forEach(detach);
    } else {
      $$.fragment && $$.fragment.c();
    }
    if (options.intro) transition_in(component.$$.fragment);
    mount_component(component, options.target, options.anchor);
    end_hydrating();
    flush();
  }
  set_current_component(parent_component);
}
var SvelteElement;
if (typeof HTMLElement === "function") {
  SvelteElement = class extends HTMLElement {
    /** The Svelte component constructor */
    $$ctor;
    /** Slots */
    $$s;
    /** The Svelte component instance */
    $$c;
    /** Whether or not the custom element is connected */
    $$cn = false;
    /** Component props data */
    $$d = {};
    /** `true` if currently in the process of reflecting component props back to attributes */
    $$r = false;
    /** @type {Record<string, CustomElementPropDefinition>} Props definition (name, reflected, type etc) */
    $$p_d = {};
    /** @type {Record<string, Function[]>} Event listeners */
    $$l = {};
    /** @type {Map<Function, Function>} Event listener unsubscribe functions */
    $$l_u = /* @__PURE__ */ new Map();
    constructor($$componentCtor, $$slots, use_shadow_dom) {
      super();
      this.$$ctor = $$componentCtor;
      this.$$s = $$slots;
      if (use_shadow_dom) {
        this.attachShadow({ mode: "open" });
      }
    }
    addEventListener(type, listener, options) {
      this.$$l[type] = this.$$l[type] || [];
      this.$$l[type].push(listener);
      if (this.$$c) {
        const unsub = this.$$c.$on(type, listener);
        this.$$l_u.set(listener, unsub);
      }
      super.addEventListener(type, listener, options);
    }
    removeEventListener(type, listener, options) {
      super.removeEventListener(type, listener, options);
      if (this.$$c) {
        const unsub = this.$$l_u.get(listener);
        if (unsub) {
          unsub();
          this.$$l_u.delete(listener);
        }
      }
    }
    async connectedCallback() {
      this.$$cn = true;
      if (!this.$$c) {
        let create_slot2 = function(name) {
          return () => {
            let node;
            const obj = {
              c: function create() {
                node = element("slot");
                if (name !== "default") {
                  attr(node, "name", name);
                }
              },
              /**
               * @param {HTMLElement} target
               * @param {HTMLElement} [anchor]
               */
              m: function mount(target, anchor) {
                insert(target, node, anchor);
              },
              d: function destroy(detaching) {
                if (detaching) {
                  detach(node);
                }
              }
            };
            return obj;
          };
        };
        await Promise.resolve();
        if (!this.$$cn || this.$$c) {
          return;
        }
        const $$slots = {};
        const existing_slots = get_custom_elements_slots(this);
        for (const name of this.$$s) {
          if (name in existing_slots) {
            $$slots[name] = [create_slot2(name)];
          }
        }
        for (const attribute of this.attributes) {
          const name = this.$$g_p(attribute.name);
          if (!(name in this.$$d)) {
            this.$$d[name] = get_custom_element_value(name, attribute.value, this.$$p_d, "toProp");
          }
        }
        for (const key in this.$$p_d) {
          if (!(key in this.$$d) && this[key] !== void 0) {
            this.$$d[key] = this[key];
            delete this[key];
          }
        }
        this.$$c = new this.$$ctor({
          target: this.shadowRoot || this,
          props: {
            ...this.$$d,
            $$slots,
            $$scope: {
              ctx: []
            }
          }
        });
        const reflect_attributes = () => {
          this.$$r = true;
          for (const key in this.$$p_d) {
            this.$$d[key] = this.$$c.$$.ctx[this.$$c.$$.props[key]];
            if (this.$$p_d[key].reflect) {
              const attribute_value = get_custom_element_value(
                key,
                this.$$d[key],
                this.$$p_d,
                "toAttribute"
              );
              if (attribute_value == null) {
                this.removeAttribute(this.$$p_d[key].attribute || key);
              } else {
                this.setAttribute(this.$$p_d[key].attribute || key, attribute_value);
              }
            }
          }
          this.$$r = false;
        };
        this.$$c.$$.after_update.push(reflect_attributes);
        reflect_attributes();
        for (const type in this.$$l) {
          for (const listener of this.$$l[type]) {
            const unsub = this.$$c.$on(type, listener);
            this.$$l_u.set(listener, unsub);
          }
        }
        this.$$l = {};
      }
    }
    // We don't need this when working within Svelte code, but for compatibility of people using this outside of Svelte
    // and setting attributes through setAttribute etc, this is helpful
    attributeChangedCallback(attr2, _oldValue, newValue) {
      if (this.$$r) return;
      attr2 = this.$$g_p(attr2);
      this.$$d[attr2] = get_custom_element_value(attr2, newValue, this.$$p_d, "toProp");
      this.$$c?.$set({ [attr2]: this.$$d[attr2] });
    }
    disconnectedCallback() {
      this.$$cn = false;
      Promise.resolve().then(() => {
        if (!this.$$cn && this.$$c) {
          this.$$c.$destroy();
          this.$$c = void 0;
        }
      });
    }
    $$g_p(attribute_name) {
      return Object.keys(this.$$p_d).find(
        (key) => this.$$p_d[key].attribute === attribute_name || !this.$$p_d[key].attribute && key.toLowerCase() === attribute_name
      ) || attribute_name;
    }
  };
}
function get_custom_element_value(prop, value, props_definition, transform) {
  const type = props_definition[prop]?.type;
  value = type === "Boolean" && typeof value !== "boolean" ? value != null : value;
  if (!transform || !props_definition[prop]) {
    return value;
  } else if (transform === "toAttribute") {
    switch (type) {
      case "Object":
      case "Array":
        return value == null ? null : JSON.stringify(value);
      case "Boolean":
        return value ? "" : null;
      case "Number":
        return value == null ? null : value;
      default:
        return value;
    }
  } else {
    switch (type) {
      case "Object":
      case "Array":
        return value && JSON.parse(value);
      case "Boolean":
        return value;
      // conversion already handled above
      case "Number":
        return value != null ? +value : value;
      default:
        return value;
    }
  }
}
var SvelteComponent = class {
  /**
   * ### PRIVATE API
   *
   * Do not use, may change at any time
   *
   * @type {any}
   */
  $$ = void 0;
  /**
   * ### PRIVATE API
   *
   * Do not use, may change at any time
   *
   * @type {any}
   */
  $$set = void 0;
  /** @returns {void} */
  $destroy() {
    destroy_component(this, 1);
    this.$destroy = noop;
  }
  /**
   * @template {Extract<keyof Events, string>} K
   * @param {K} type
   * @param {((e: Events[K]) => void) | null | undefined} callback
   * @returns {() => void}
   */
  $on(type, callback) {
    if (!is_function(callback)) {
      return noop;
    }
    const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
    callbacks.push(callback);
    return () => {
      const index = callbacks.indexOf(callback);
      if (index !== -1) callbacks.splice(index, 1);
    };
  }
  /**
   * @param {Partial<Props>} props
   * @returns {void}
   */
  $set(props) {
    if (this.$$set && !is_empty(props)) {
      this.$$.skip_bound = true;
      this.$$set(props);
      this.$$.skip_bound = false;
    }
  }
};

// node_modules/svelte/src/shared/version.js
var PUBLIC_VERSION = "4";

// node_modules/svelte/src/runtime/internal/disclose-version/index.js
if (typeof window !== "undefined")
  (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(PUBLIC_VERSION);

// src/scripts/utils/rarity.ts
function getRarityColor(rarity) {
  switch (rarity) {
    case 0 /* SR */:
      return new RarityColor("rgba(171, 71, 188, 1)", "rgba(74, 20, 140, 1)");
    // Purple 400, Purple 900
    case 1 /* SSR */:
      return new RarityColor("rgba(255, 238, 88, 1)", "rgba(249, 168, 37, 1)");
    // Yellow 400, Yellow 800
    case 2 /* UR */:
      return new RarityColor("rgba(255, 167, 38, 1)", "rgba(230, 81, 0, 1)");
    // Orange 400, Orange 900
    default:
      return new RarityColor("rgba(255, 255, 255, 1)", "rgba(0, 0, 0, 1)");
  }
}
var RarityColor = class {
  light;
  dark;
  constructor(light, dark) {
    this.light = light;
    this.dark = dark;
  }
};

// src/scripts/utils/item.ts
var Item = class {
  name;
  rarity;
  image;
  constructor(name, rarity, image, color) {
    this.name = name;
    this.rarity = rarity;
    this.image = image;
  }
  getName() {
    return this.name;
  }
  getRarity() {
    return this.rarity;
  }
  getImage() {
    return this.image;
  }
  getRarityColor() {
    return getRarityColor(this.rarity);
  }
};

// src/scripts/utils/crystal.ts
var REFINED_TO_ORE = 20 * 50;
var CRYSTAL_TO_ORE = 20;
var color_red = "rgb(233, 30, 99)";
var color_blue = "rgb(3, 169, 244)";
var color_yellow = "rgb(255, 235, 59)";
var image_red = "/static/images/vermelho-removebg-preview.png";
var image_blue = "/static/images/azul-removebg-preview.png";
var image_yellow = "/static/images/amarelo-removebg-preview.png";
var Crystals = {
  CRYSTAL_ORE_RED: new Item("crystal_ore.red", 0 /* SR */, image_red, color_red),
  CRYSTAL_ORE_BLUE: new Item("crystal_ore.blue", 0 /* SR */, image_blue, color_blue),
  CRYSTAL_ORE_YELLOW: new Item("crystal_ore.yellow", 0 /* SR */, image_yellow, color_yellow),
  CRYSTAL_RED: new Item("crystal.red", 1 /* SSR */, image_red, color_red),
  CRYSTAL_BLUE: new Item("crystal.blue", 1 /* SSR */, image_blue, color_blue),
  CRYSTAL_YELLOW: new Item("crystal.yellow", 1 /* SSR */, image_yellow, color_yellow),
  REFINED_CRYSTAL_RED: new Item("refined_crystal.red", 2 /* UR */, image_red, color_red),
  REFINED_CRYSTAL_BLUE: new Item("refined_crystal.blue", 2 /* UR */, image_blue, color_blue),
  REFINED_CRYSTAL_YELLOW: new Item("refined_crystal.yellow", 2 /* UR */, image_yellow, color_yellow)
};

// src/scripts/utils/lang.ts
function getTranslation(lang, key) {
  switch (lang) {
    case 0 /* PT */:
      return pt[key] || key;
    case 1 /* EN */:
      return en[key] || key;
    default:
      return key;
  }
}
var en = {
  "app.title": "Isekai Slow Life - Crystal Collector",
  "app.header": "Which crystals do you need?",
  "app.days": "How many days will it take to get, just by buying?",
  "app.information": "Ores that can be bought per day:",
  "crystal_ore.red": "Bravery Crystal Ore",
  "crystal_ore.blue": "Wisdom Crystal Ore",
  "crystal_ore.yellow": "Hope Crystal Ore",
  "crystal.red": "Bravery Crystal",
  "crystal.blue": "Wisdom Crystal",
  "crystal.yellow": "Hope Crystal",
  "refined_crystal.red": "Refined Bravery Crystal",
  "refined_crystal.blue": "Refined Wisdom Crystal",
  "refined_crystal.yellow": "Refined Hope Crystal",
  "trading_post": "Trading Post",
  "challenge_shop": "Challenge Shop",
  "golemore_mine": "Golemore Mine",
  "guild": "Guild",
  "banquet": "Banquet"
};
var pt = {
  "app.title": "Isekai Slow Life - Crystal Collector",
  "app.header": "Quais cristais voc\xEA precisa?",
  "app.days": "Quantos dias voc\xEA vai levar para conseguir, apenas comprando?",
  "app.information": "Min\xE9rios que poder\xE3o ser comprados por dia:",
  "crystal_ore.red": "Min\xE9rio de Cristal de Bravura",
  "crystal_ore.blue": "Min\xE9rio de Cristal de Sabedoria",
  "crystal_ore.yellow": "Min\xE9rio de Cristal de Esperan\xE7a",
  "crystal.red": "Cristal de Bravura",
  "crystal.blue": "Cristal de Sabedoria",
  "crystal.yellow": "Cristal de Esperan\xE7a",
  "refined_crystal.red": "Bravery Cristal",
  "refined_crystal.blue": "Wisdom Cristal",
  "refined_crystal.yellow": "Hope Cristal",
  "trading_post": "Guilda dos Mercadores",
  "challenge_shop": "Loja de Desafios",
  "golemore_mine": "Mina de Golemore",
  "guild": "Guilda",
  "banquet": "Banquete"
};

// src/svelte/views/slot-view.svelte
function create_fragment(ctx) {
  let div1;
  let div0;
  let t;
  let img;
  let img_src_value;
  return {
    c() {
      div1 = element("div");
      div0 = element("div");
      t = space();
      img = element("img");
      attr(div0, "class", "inner-border svelte-5t5lvb");
      if (!src_url_equal(img.src, img_src_value = getImage(
        /*item*/
        ctx[0]
      ))) attr(img, "src", img_src_value);
      attr(img, "alt", "Item");
      attr(img, "class", "svelte-5t5lvb");
      attr(div1, "class", "slot slot-shine svelte-5t5lvb");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, div0);
      append(div1, t);
      append(div1, img);
      ctx[2](div1);
    },
    p(ctx2, [dirty]) {
      if (dirty & /*item*/
      1 && !src_url_equal(img.src, img_src_value = getImage(
        /*item*/
        ctx2[0]
      ))) {
        attr(img, "src", img_src_value);
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(div1);
      }
      ctx[2](null);
    }
  };
}
function getImage(item) {
  return item ? item.getImage() : "";
}
function instance($$self, $$props, $$invalidate) {
  function update2() {
    if (!el_slot) return;
    if (item === null) {
      el_slot.classList.remove("slot-shine");
      el_slot.style.setProperty("--color-light", "#ffffff");
      el_slot.style.setProperty("--color-dark", "#808080");
    } else {
      el_slot.classList.add("slot-shine");
      el_slot.style.setProperty("--color-light", item.getRarityColor().light);
      el_slot.style.setProperty("--color-dark", item.getRarityColor().dark);
    }
  }
  onMount(() => {
    update2();
  });
  let { item = null } = $$props;
  let el_slot;
  function div1_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      el_slot = $$value;
      $$invalidate(1, el_slot);
    });
  }
  $$self.$$set = ($$props2) => {
    if ("item" in $$props2) $$invalidate(0, item = $$props2.item);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*item*/
    1) {
      $: item, update2();
    }
  };
  return [item, el_slot, div1_binding];
}
var Slot_view = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, { item: 0 });
  }
};
var slot_view_default = Slot_view;

// src/svelte/views/crystal-editable-slot.svelte
function create_fragment2(ctx) {
  let div;
  let slotview;
  let t;
  let input;
  let current;
  let mounted;
  let dispose;
  slotview = new slot_view_default({ props: { item: (
    /*crystal*/
    ctx[1]
  ) } });
  return {
    c() {
      div = element("div");
      create_component(slotview.$$.fragment);
      t = space();
      input = element("input");
      attr(input, "type", "number");
      attr(input, "min", "0");
      attr(input, "class", "svelte-q9nxhc");
      attr(div, "class", "layout svelte-q9nxhc");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      mount_component(slotview, div, null);
      append(div, t);
      append(div, input);
      set_input_value(
        input,
        /*count*/
        ctx[0]
      );
      current = true;
      if (!mounted) {
        dispose = [
          listen(
            input,
            "input",
            /*input_input_handler*/
            ctx[3]
          ),
          listen(
            input,
            "change",
            /*change_handler*/
            ctx[4]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      const slotview_changes = {};
      if (dirty & /*crystal*/
      2) slotview_changes.item = /*crystal*/
      ctx2[1];
      slotview.$set(slotview_changes);
      if (dirty & /*count*/
      1 && to_number(input.value) !== /*count*/
      ctx2[0]) {
        set_input_value(
          input,
          /*count*/
          ctx2[0]
        );
      }
    },
    i(local) {
      if (current) return;
      transition_in(slotview.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(slotview.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      destroy_component(slotview);
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance2($$self, $$props, $$invalidate) {
  let { crystal } = $$props;
  let { count = 0 } = $$props;
  let { onChanged } = $$props;
  function input_input_handler() {
    count = to_number(this.value);
    $$invalidate(0, count);
  }
  const change_handler = (value) => {
    if (onChanged === null) return;
    const num = Number.parseInt(value.currentTarget.value || "0");
    onChanged(num);
  };
  $$self.$$set = ($$props2) => {
    if ("crystal" in $$props2) $$invalidate(1, crystal = $$props2.crystal);
    if ("count" in $$props2) $$invalidate(0, count = $$props2.count);
    if ("onChanged" in $$props2) $$invalidate(2, onChanged = $$props2.onChanged);
  };
  return [count, crystal, onChanged, input_input_handler, change_handler];
}
var Crystal_editable_slot = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance2, create_fragment2, safe_not_equal, { crystal: 1, count: 0, onChanged: 2 });
  }
};
var crystal_editable_slot_default = Crystal_editable_slot;

// src/svelte/views/footer.svelte
function create_fragment3(ctx) {
  let footer;
  return {
    c() {
      footer = element("footer");
      footer.innerHTML = `<p class="svelte-xsxslj">Develop by <a href="https://github.com/DarthIF" class="svelte-xsxslj">Darth IF</a></p>`;
      attr(footer, "class", "svelte-xsxslj");
    },
    m(target, anchor) {
      insert(target, footer, anchor);
    },
    p: noop,
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(footer);
      }
    }
  };
}
function instance3($$self) {
  "use strict";
  return [];
}
var Footer = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance3, create_fragment3, safe_not_equal, {});
  }
};
var footer_default = Footer;

// src/svelte/views/card/outlined-card.svelte
function create_fragment4(ctx) {
  let div;
  let current;
  let mounted;
  let dispose;
  const default_slot_template = (
    /*#slots*/
    ctx[4].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[3],
    null
  );
  return {
    c() {
      div = element("div");
      if (default_slot) default_slot.c();
      attr(div, "class", "outlined-card svelte-q7893m");
      attr(
        div,
        "style",
        /*style*/
        ctx[0]
      );
    },
    m(target, anchor) {
      insert(target, div, anchor);
      if (default_slot) {
        default_slot.m(div, null);
      }
      ctx[7](div);
      current = true;
      if (!mounted) {
        dispose = [
          listen(
            div,
            "click",
            /*click_handler*/
            ctx[5]
          ),
          listen(
            div,
            "keypress",
            /*keypress_handler*/
            ctx[6]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        8)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[3],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[3]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[3],
              dirty,
              null
            ),
            null
          );
        }
      }
      if (!current || dirty & /*style*/
      1) {
        attr(
          div,
          "style",
          /*style*/
          ctx2[0]
        );
      }
    },
    i(local) {
      if (current) return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      if (default_slot) default_slot.d(detaching);
      ctx[7](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance4($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  function getElement() {
    return element2;
  }
  let { style = "" } = $$props;
  let element2;
  function click_handler(event) {
    bubble.call(this, $$self, event);
  }
  function keypress_handler(event) {
    bubble.call(this, $$self, event);
  }
  function div_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      element2 = $$value;
      $$invalidate(1, element2);
    });
  }
  $$self.$$set = ($$props2) => {
    if ("style" in $$props2) $$invalidate(0, style = $$props2.style);
    if ("$$scope" in $$props2) $$invalidate(3, $$scope = $$props2.$$scope);
  };
  return [
    style,
    element2,
    getElement,
    $$scope,
    slots,
    click_handler,
    keypress_handler,
    div_binding
  ];
}
var Outlined_card = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance4, create_fragment4, safe_not_equal, { getElement: 2, style: 0 });
  }
  get getElement() {
    return this.$$.ctx[2];
  }
};
var outlined_card_default = Outlined_card;

// src/svelte/main.svelte
function create_default_slot(ctx) {
  let div6;
  let div5;
  let div0;
  let t0_value = getTranslation(
    /*lang*/
    ctx[1],
    "trading_post"
  ) + "";
  let t0;
  let t1;
  let input0;
  let t2;
  let div1;
  let t3_value = getTranslation(
    /*lang*/
    ctx[1],
    "challenge_shop"
  ) + "";
  let t3;
  let t4;
  let input1;
  let t5;
  let div2;
  let t6_value = getTranslation(
    /*lang*/
    ctx[1],
    "golemore_mine"
  ) + "";
  let t6;
  let t7;
  let input2;
  let t8;
  let div3;
  let t9_value = getTranslation(
    /*lang*/
    ctx[1],
    "guild"
  ) + "";
  let t9;
  let t10;
  let input3;
  let t11;
  let div4;
  let t12_value = getTranslation(
    /*lang*/
    ctx[1],
    "banquet"
  ) + "";
  let t12;
  let t13;
  let input4;
  let t14;
  let p0;
  let t15_value = getTranslation(
    /*lang*/
    ctx[1],
    "app.information"
  ) + "";
  let t15;
  let t16;
  let p1;
  let t17_value = (
    /*values*/
    ctx[0].expected_ores_per_day + ""
  );
  let t17;
  let mounted;
  let dispose;
  return {
    c() {
      div6 = element("div");
      div5 = element("div");
      div0 = element("div");
      t0 = text(t0_value);
      t1 = space();
      input0 = element("input");
      t2 = space();
      div1 = element("div");
      t3 = text(t3_value);
      t4 = space();
      input1 = element("input");
      t5 = space();
      div2 = element("div");
      t6 = text(t6_value);
      t7 = space();
      input2 = element("input");
      t8 = space();
      div3 = element("div");
      t9 = text(t9_value);
      t10 = space();
      input3 = element("input");
      t11 = space();
      div4 = element("div");
      t12 = text(t12_value);
      t13 = space();
      input4 = element("input");
      t14 = space();
      p0 = element("p");
      t15 = text(t15_value);
      t16 = space();
      p1 = element("p");
      t17 = text(t17_value);
      attr(input0, "type", "checkbox");
      attr(input0, "id", "trading_post");
      attr(div0, "class", "store-chip svelte-a3r742");
      attr(input1, "type", "checkbox");
      attr(input1, "id", "challenge_shop");
      attr(div1, "class", "store-chip svelte-a3r742");
      attr(input2, "type", "checkbox");
      attr(input2, "id", "golemore_mine");
      attr(div2, "class", "store-chip svelte-a3r742");
      attr(input3, "type", "checkbox");
      attr(input3, "id", "guild");
      attr(div3, "class", "store-chip svelte-a3r742");
      attr(input4, "type", "checkbox");
      attr(input4, "id", "banquet");
      attr(div4, "class", "store-chip svelte-a3r742");
      attr(div5, "class", "stores-group svelte-a3r742");
      attr(p0, "class", "svelte-a3r742");
      attr(p1, "class", "svelte-a3r742");
      attr(div6, "class", "card-stores-container svelte-a3r742");
    },
    m(target, anchor) {
      insert(target, div6, anchor);
      append(div6, div5);
      append(div5, div0);
      append(div0, t0);
      append(div0, t1);
      append(div0, input0);
      input0.checked = /*values*/
      ctx[0].trading_post;
      append(div5, t2);
      append(div5, div1);
      append(div1, t3);
      append(div1, t4);
      append(div1, input1);
      input1.checked = /*values*/
      ctx[0].challenge_shop;
      append(div5, t5);
      append(div5, div2);
      append(div2, t6);
      append(div2, t7);
      append(div2, input2);
      input2.checked = /*values*/
      ctx[0].golemore_mine;
      append(div5, t8);
      append(div5, div3);
      append(div3, t9);
      append(div3, t10);
      append(div3, input3);
      input3.checked = /*values*/
      ctx[0].guild;
      append(div5, t11);
      append(div5, div4);
      append(div4, t12);
      append(div4, t13);
      append(div4, input4);
      input4.checked = /*values*/
      ctx[0].banquet;
      append(div6, t14);
      append(div6, p0);
      append(p0, t15);
      append(div6, t16);
      append(div6, p1);
      append(p1, t17);
      if (!mounted) {
        dispose = [
          listen(
            input0,
            "change",
            /*input0_change_handler*/
            ctx[12]
          ),
          listen(input0, "click", stopMouseEvents),
          listen(
            input0,
            "change",
            /*change_handler*/
            ctx[13]
          ),
          listen(div0, "click", toggleChildCheckbox),
          listen(
            input1,
            "change",
            /*input1_change_handler*/
            ctx[14]
          ),
          listen(input1, "click", stopMouseEvents),
          listen(
            input1,
            "change",
            /*change_handler_1*/
            ctx[15]
          ),
          listen(div1, "click", toggleChildCheckbox),
          listen(
            input2,
            "change",
            /*input2_change_handler*/
            ctx[16]
          ),
          listen(input2, "click", stopMouseEvents),
          listen(
            input2,
            "change",
            /*change_handler_2*/
            ctx[17]
          ),
          listen(div2, "click", toggleChildCheckbox),
          listen(
            input3,
            "change",
            /*input3_change_handler*/
            ctx[18]
          ),
          listen(input3, "click", stopMouseEvents),
          listen(
            input3,
            "change",
            /*change_handler_3*/
            ctx[19]
          ),
          listen(div3, "click", toggleChildCheckbox),
          listen(
            input4,
            "change",
            /*input4_change_handler*/
            ctx[20]
          ),
          listen(input4, "click", stopMouseEvents),
          listen(
            input4,
            "change",
            /*change_handler_4*/
            ctx[21]
          ),
          listen(div4, "click", toggleChildCheckbox)
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty & /*lang*/
      2 && t0_value !== (t0_value = getTranslation(
        /*lang*/
        ctx2[1],
        "trading_post"
      ) + "")) set_data(t0, t0_value);
      if (dirty & /*values*/
      1) {
        input0.checked = /*values*/
        ctx2[0].trading_post;
      }
      if (dirty & /*lang*/
      2 && t3_value !== (t3_value = getTranslation(
        /*lang*/
        ctx2[1],
        "challenge_shop"
      ) + "")) set_data(t3, t3_value);
      if (dirty & /*values*/
      1) {
        input1.checked = /*values*/
        ctx2[0].challenge_shop;
      }
      if (dirty & /*lang*/
      2 && t6_value !== (t6_value = getTranslation(
        /*lang*/
        ctx2[1],
        "golemore_mine"
      ) + "")) set_data(t6, t6_value);
      if (dirty & /*values*/
      1) {
        input2.checked = /*values*/
        ctx2[0].golemore_mine;
      }
      if (dirty & /*lang*/
      2 && t9_value !== (t9_value = getTranslation(
        /*lang*/
        ctx2[1],
        "guild"
      ) + "")) set_data(t9, t9_value);
      if (dirty & /*values*/
      1) {
        input3.checked = /*values*/
        ctx2[0].guild;
      }
      if (dirty & /*lang*/
      2 && t12_value !== (t12_value = getTranslation(
        /*lang*/
        ctx2[1],
        "banquet"
      ) + "")) set_data(t12, t12_value);
      if (dirty & /*values*/
      1) {
        input4.checked = /*values*/
        ctx2[0].banquet;
      }
      if (dirty & /*lang*/
      2 && t15_value !== (t15_value = getTranslation(
        /*lang*/
        ctx2[1],
        "app.information"
      ) + "")) set_data(t15, t15_value);
      if (dirty & /*values*/
      1 && t17_value !== (t17_value = /*values*/
      ctx2[0].expected_ores_per_day + "")) set_data(t17, t17_value);
    },
    d(detaching) {
      if (detaching) {
        detach(div6);
      }
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_fragment5(ctx) {
  let main;
  let h10;
  let t0_value = getTranslation(
    /*lang*/
    ctx[1],
    "app.header"
  ) + "";
  let t0;
  let t1;
  let div0;
  let crystaleditableslot0;
  let t2;
  let crystaleditableslot1;
  let t3;
  let crystaleditableslot2;
  let t4;
  let crystaleditableslot3;
  let t5;
  let crystaleditableslot4;
  let t6;
  let crystaleditableslot5;
  let t7;
  let crystaleditableslot6;
  let t8;
  let crystaleditableslot7;
  let t9;
  let crystaleditableslot8;
  let t10;
  let div1;
  let h2;
  let t11_value = getTranslation(
    /*lang*/
    ctx[1],
    "app.days"
  ) + "";
  let t11;
  let t12;
  let h11;
  let t13_value = (Number.isNaN(
    /*values*/
    ctx[0].days
  ) === false ? (
    /*values*/
    ctx[0].days
  ) : "\u221E") + "";
  let t13;
  let t14;
  let outlinedcard;
  let t15;
  let footer;
  let current;
  crystaleditableslot0 = new crystal_editable_slot_default({
    props: {
      crystal: Crystals.CRYSTAL_ORE_RED,
      onChanged: (
        /*func*/
        ctx[3]
      )
    }
  });
  crystaleditableslot1 = new crystal_editable_slot_default({
    props: {
      crystal: Crystals.CRYSTAL_ORE_BLUE,
      onChanged: (
        /*func_1*/
        ctx[4]
      )
    }
  });
  crystaleditableslot2 = new crystal_editable_slot_default({
    props: {
      crystal: Crystals.CRYSTAL_ORE_YELLOW,
      onChanged: (
        /*func_2*/
        ctx[5]
      )
    }
  });
  crystaleditableslot3 = new crystal_editable_slot_default({
    props: {
      crystal: Crystals.CRYSTAL_RED,
      onChanged: (
        /*func_3*/
        ctx[6]
      )
    }
  });
  crystaleditableslot4 = new crystal_editable_slot_default({
    props: {
      crystal: Crystals.CRYSTAL_BLUE,
      onChanged: (
        /*func_4*/
        ctx[7]
      )
    }
  });
  crystaleditableslot5 = new crystal_editable_slot_default({
    props: {
      crystal: Crystals.CRYSTAL_YELLOW,
      onChanged: (
        /*func_5*/
        ctx[8]
      )
    }
  });
  crystaleditableslot6 = new crystal_editable_slot_default({
    props: {
      crystal: Crystals.REFINED_CRYSTAL_RED,
      onChanged: (
        /*func_6*/
        ctx[9]
      )
    }
  });
  crystaleditableslot7 = new crystal_editable_slot_default({
    props: {
      crystal: Crystals.REFINED_CRYSTAL_BLUE,
      onChanged: (
        /*func_7*/
        ctx[10]
      )
    }
  });
  crystaleditableslot8 = new crystal_editable_slot_default({
    props: {
      crystal: Crystals.REFINED_CRYSTAL_YELLOW,
      onChanged: (
        /*func_8*/
        ctx[11]
      )
    }
  });
  outlinedcard = new outlined_card_default({
    props: {
      style: "margin: 16px; 0",
      $$slots: { default: [create_default_slot] },
      $$scope: { ctx }
    }
  });
  footer = new footer_default({});
  return {
    c() {
      main = element("main");
      h10 = element("h1");
      t0 = text(t0_value);
      t1 = space();
      div0 = element("div");
      create_component(crystaleditableslot0.$$.fragment);
      t2 = space();
      create_component(crystaleditableslot1.$$.fragment);
      t3 = space();
      create_component(crystaleditableslot2.$$.fragment);
      t4 = space();
      create_component(crystaleditableslot3.$$.fragment);
      t5 = space();
      create_component(crystaleditableslot4.$$.fragment);
      t6 = space();
      create_component(crystaleditableslot5.$$.fragment);
      t7 = space();
      create_component(crystaleditableslot6.$$.fragment);
      t8 = space();
      create_component(crystaleditableslot7.$$.fragment);
      t9 = space();
      create_component(crystaleditableslot8.$$.fragment);
      t10 = space();
      div1 = element("div");
      h2 = element("h2");
      t11 = text(t11_value);
      t12 = space();
      h11 = element("h1");
      t13 = text(t13_value);
      t14 = space();
      create_component(outlinedcard.$$.fragment);
      t15 = space();
      create_component(footer.$$.fragment);
      set_style(h10, "margin", "auto");
      attr(h10, "class", "svelte-a3r742");
      attr(div0, "class", "crystal-group svelte-a3r742");
      attr(h2, "class", "svelte-a3r742");
      attr(h11, "class", "svelte-a3r742");
      attr(div1, "class", "days-group svelte-a3r742");
      attr(main, "class", "svelte-a3r742");
    },
    m(target, anchor) {
      insert(target, main, anchor);
      append(main, h10);
      append(h10, t0);
      append(main, t1);
      append(main, div0);
      mount_component(crystaleditableslot0, div0, null);
      append(div0, t2);
      mount_component(crystaleditableslot1, div0, null);
      append(div0, t3);
      mount_component(crystaleditableslot2, div0, null);
      append(div0, t4);
      mount_component(crystaleditableslot3, div0, null);
      append(div0, t5);
      mount_component(crystaleditableslot4, div0, null);
      append(div0, t6);
      mount_component(crystaleditableslot5, div0, null);
      append(div0, t7);
      mount_component(crystaleditableslot6, div0, null);
      append(div0, t8);
      mount_component(crystaleditableslot7, div0, null);
      append(div0, t9);
      mount_component(crystaleditableslot8, div0, null);
      append(main, t10);
      append(main, div1);
      append(div1, h2);
      append(h2, t11);
      append(div1, t12);
      append(div1, h11);
      append(h11, t13);
      append(main, t14);
      mount_component(outlinedcard, main, null);
      insert(target, t15, anchor);
      mount_component(footer, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      if ((!current || dirty & /*lang*/
      2) && t0_value !== (t0_value = getTranslation(
        /*lang*/
        ctx2[1],
        "app.header"
      ) + "")) set_data(t0, t0_value);
      const crystaleditableslot0_changes = {};
      if (dirty & /*values*/
      1) crystaleditableslot0_changes.onChanged = /*func*/
      ctx2[3];
      crystaleditableslot0.$set(crystaleditableslot0_changes);
      const crystaleditableslot1_changes = {};
      if (dirty & /*values*/
      1) crystaleditableslot1_changes.onChanged = /*func_1*/
      ctx2[4];
      crystaleditableslot1.$set(crystaleditableslot1_changes);
      const crystaleditableslot2_changes = {};
      if (dirty & /*values*/
      1) crystaleditableslot2_changes.onChanged = /*func_2*/
      ctx2[5];
      crystaleditableslot2.$set(crystaleditableslot2_changes);
      const crystaleditableslot3_changes = {};
      if (dirty & /*values*/
      1) crystaleditableslot3_changes.onChanged = /*func_3*/
      ctx2[6];
      crystaleditableslot3.$set(crystaleditableslot3_changes);
      const crystaleditableslot4_changes = {};
      if (dirty & /*values*/
      1) crystaleditableslot4_changes.onChanged = /*func_4*/
      ctx2[7];
      crystaleditableslot4.$set(crystaleditableslot4_changes);
      const crystaleditableslot5_changes = {};
      if (dirty & /*values*/
      1) crystaleditableslot5_changes.onChanged = /*func_5*/
      ctx2[8];
      crystaleditableslot5.$set(crystaleditableslot5_changes);
      const crystaleditableslot6_changes = {};
      if (dirty & /*values*/
      1) crystaleditableslot6_changes.onChanged = /*func_6*/
      ctx2[9];
      crystaleditableslot6.$set(crystaleditableslot6_changes);
      const crystaleditableslot7_changes = {};
      if (dirty & /*values*/
      1) crystaleditableslot7_changes.onChanged = /*func_7*/
      ctx2[10];
      crystaleditableslot7.$set(crystaleditableslot7_changes);
      const crystaleditableslot8_changes = {};
      if (dirty & /*values*/
      1) crystaleditableslot8_changes.onChanged = /*func_8*/
      ctx2[11];
      crystaleditableslot8.$set(crystaleditableslot8_changes);
      if ((!current || dirty & /*lang*/
      2) && t11_value !== (t11_value = getTranslation(
        /*lang*/
        ctx2[1],
        "app.days"
      ) + "")) set_data(t11, t11_value);
      if ((!current || dirty & /*values*/
      1) && t13_value !== (t13_value = (Number.isNaN(
        /*values*/
        ctx2[0].days
      ) === false ? (
        /*values*/
        ctx2[0].days
      ) : "\u221E") + "")) set_data(t13, t13_value);
      const outlinedcard_changes = {};
      if (dirty & /*$$scope, values, lang*/
      8388611) {
        outlinedcard_changes.$$scope = { dirty, ctx: ctx2 };
      }
      outlinedcard.$set(outlinedcard_changes);
    },
    i(local) {
      if (current) return;
      transition_in(crystaleditableslot0.$$.fragment, local);
      transition_in(crystaleditableslot1.$$.fragment, local);
      transition_in(crystaleditableslot2.$$.fragment, local);
      transition_in(crystaleditableslot3.$$.fragment, local);
      transition_in(crystaleditableslot4.$$.fragment, local);
      transition_in(crystaleditableslot5.$$.fragment, local);
      transition_in(crystaleditableslot6.$$.fragment, local);
      transition_in(crystaleditableslot7.$$.fragment, local);
      transition_in(crystaleditableslot8.$$.fragment, local);
      transition_in(outlinedcard.$$.fragment, local);
      transition_in(footer.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(crystaleditableslot0.$$.fragment, local);
      transition_out(crystaleditableslot1.$$.fragment, local);
      transition_out(crystaleditableslot2.$$.fragment, local);
      transition_out(crystaleditableslot3.$$.fragment, local);
      transition_out(crystaleditableslot4.$$.fragment, local);
      transition_out(crystaleditableslot5.$$.fragment, local);
      transition_out(crystaleditableslot6.$$.fragment, local);
      transition_out(crystaleditableslot7.$$.fragment, local);
      transition_out(crystaleditableslot8.$$.fragment, local);
      transition_out(outlinedcard.$$.fragment, local);
      transition_out(footer.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(main);
        detach(t15);
      }
      destroy_component(crystaleditableslot0);
      destroy_component(crystaleditableslot1);
      destroy_component(crystaleditableslot2);
      destroy_component(crystaleditableslot3);
      destroy_component(crystaleditableslot4);
      destroy_component(crystaleditableslot5);
      destroy_component(crystaleditableslot6);
      destroy_component(crystaleditableslot7);
      destroy_component(crystaleditableslot8);
      destroy_component(outlinedcard);
      destroy_component(footer, detaching);
    }
  };
}
function round(value, step) {
  step || (step = 1);
  const inverse = 1 / step;
  return Math.round(value * inverse) / inverse;
}
function toggleChildCheckbox(e) {
  e.currentTarget.querySelector("input")?.click();
}
function stopMouseEvents(e) {
  e.stopPropagation();
}
function instance5($$self, $$props, $$invalidate) {
  function update2() {
    $$invalidate(0, values.expected_ores_per_day = 0, values);
    if (values.trading_post) {
      DAILY_LIMIT.trading_post.forEach((pack_limit) => {
        $$invalidate(0, values.expected_ores_per_day += pack_limit, values);
      });
    }
    if (values.challenge_shop) {
      DAILY_LIMIT.challenge_shop.forEach((pack_limit) => {
        $$invalidate(0, values.expected_ores_per_day += pack_limit, values);
      });
    }
    if (values.golemore_mine) {
      DAILY_LIMIT.golemore_mine.forEach((pack_limit) => {
        $$invalidate(0, values.expected_ores_per_day += pack_limit, values);
      });
    }
    if (values.guild) {
      DAILY_LIMIT.guild.forEach((pack_limit) => {
        $$invalidate(0, values.expected_ores_per_day += pack_limit, values);
      });
    }
    if (values.banquet) {
      DAILY_LIMIT.banquet.forEach((pack_limit) => {
        $$invalidate(0, values.expected_ores_per_day += pack_limit, values);
      });
    }
    const total_red_ores = (() => {
      return values.ore.red + values.crystal.red * CRYSTAL_TO_ORE + values.refined.red * REFINED_TO_ORE;
    })();
    const total_blue_ores = (() => {
      return values.ore.blue + values.crystal.blue * CRYSTAL_TO_ORE + values.refined.blue * REFINED_TO_ORE;
    })();
    const total_yellow_ores = (() => {
      return values.ore.yellow + values.crystal.yellow * CRYSTAL_TO_ORE + values.refined.yellow * REFINED_TO_ORE;
    })();
    const single_max = Math.max(total_red_ores, total_blue_ores, total_yellow_ores);
    let days = round(single_max / values.expected_ores_per_day, 1);
    if (days === 0 && single_max > 0) {
      days = 1;
    }
    $$invalidate(0, values.days = days, values);
    console.log("---------------------------------");
    console.log("expected_per_day=" + values.expected_ores_per_day);
    console.log("total_red_ores=" + total_red_ores);
    console.log("total_blue_ores=" + total_blue_ores);
    console.log("total_yellow_ores=" + total_yellow_ores);
    console.log("single_max=" + single_max);
    console.log("days=" + days);
  }
  onMount(() => {
    if (navigator.language.startsWith("pt")) {
      $$invalidate(1, lang = 0 /* PT */);
    }
    update2();
  });
  const DAILY_LIMIT = {
    trading_post: [5, 5, 10],
    challenge_shop: [5, 5],
    golemore_mine: [10],
    guild: [3, 3],
    banquet: [40]
  };
  let values = {
    trading_post: true,
    challenge_shop: true,
    golemore_mine: false,
    guild: false,
    banquet: false,
    days: 0,
    expected_ores_per_day: 0,
    ore: { red: 0, blue: 0, yellow: 0 },
    crystal: { red: 0, blue: 0, yellow: 0 },
    refined: { red: 0, blue: 0, yellow: 0 }
  };
  let lang = 1 /* EN */;
  const func = (value) => {
    $$invalidate(0, values.ore.red = value, values);
    update2();
  };
  const func_1 = (value) => {
    $$invalidate(0, values.ore.blue = value, values);
    update2();
  };
  const func_2 = (value) => {
    $$invalidate(0, values.ore.yellow = value, values);
    update2();
  };
  const func_3 = (value) => {
    $$invalidate(0, values.crystal.red = value, values);
    update2();
  };
  const func_4 = (value) => {
    $$invalidate(0, values.crystal.blue = value, values);
    update2();
  };
  const func_5 = (value) => {
    $$invalidate(0, values.crystal.yellow = value, values);
    update2();
  };
  const func_6 = (value) => {
    $$invalidate(0, values.refined.red = value, values);
    update2();
  };
  const func_7 = (value) => {
    $$invalidate(0, values.refined.blue = value, values);
    update2();
  };
  const func_8 = (value) => {
    $$invalidate(0, values.refined.yellow = value, values);
    update2();
  };
  function input0_change_handler() {
    values.trading_post = this.checked;
    $$invalidate(0, values);
  }
  const change_handler = (e) => {
    $$invalidate(0, values.trading_post = e.currentTarget.checked, values);
    update2();
  };
  function input1_change_handler() {
    values.challenge_shop = this.checked;
    $$invalidate(0, values);
  }
  const change_handler_1 = (e) => {
    $$invalidate(0, values.challenge_shop = e.currentTarget.checked, values);
    update2();
  };
  function input2_change_handler() {
    values.golemore_mine = this.checked;
    $$invalidate(0, values);
  }
  const change_handler_2 = (e) => {
    $$invalidate(0, values.golemore_mine = e.currentTarget.checked, values);
    update2();
  };
  function input3_change_handler() {
    values.guild = this.checked;
    $$invalidate(0, values);
  }
  const change_handler_3 = (e) => {
    $$invalidate(0, values.guild = e.currentTarget.checked, values);
    update2();
  };
  function input4_change_handler() {
    values.banquet = this.checked;
    $$invalidate(0, values);
  }
  const change_handler_4 = (e) => {
    $$invalidate(0, values.banquet = e.currentTarget.checked, values);
    update2();
  };
  return [
    values,
    lang,
    update2,
    func,
    func_1,
    func_2,
    func_3,
    func_4,
    func_5,
    func_6,
    func_7,
    func_8,
    input0_change_handler,
    change_handler,
    input1_change_handler,
    change_handler_1,
    input2_change_handler,
    change_handler_2,
    input3_change_handler,
    change_handler_3,
    input4_change_handler,
    change_handler_4
  ];
}
var Main = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance5, create_fragment5, safe_not_equal, {});
  }
};
var main_default = Main;

// src/index.ts
console.log("Iniciando...");
var app = new main_default({ target: document.body });
