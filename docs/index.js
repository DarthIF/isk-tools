// node_modules/svelte/src/runtime/internal/utils.js
function noop() {
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
function is_empty(obj) {
  return Object.keys(obj).length === 0;
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
function init(component, options, instance3, create_fragment3, not_equal, props, append_styles = null, dirty = [-1]) {
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
  $$.ctx = instance3 ? instance3(component, options.props || {}, (i, ret, ...rest) => {
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
  $$.fragment = create_fragment3 ? create_fragment3($$.ctx) : false;
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
        let create_slot = function(name) {
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
            $$slots[name] = [create_slot(name)];
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

// src/scripts/utils/crystal.ts
var REFINED_TO_ORE = 20 * 50;
var CRYSTAL_TO_ORE = 20;
function getCrystalRarity(crystal) {
  switch (crystal) {
    case "crystal_ore.red" /* CRYSTAL_ORE_RED */:
    case "crystal_ore.blue" /* CRYSTAL_ORE_BLUE */:
    case "crystal_ore.yellow" /* CRYSTAL_ORE_YELLOW */:
      return 0 /* SR */;
    case "crystal.red" /* CRYSTAL_RED */:
    case "crystal.blue" /* CRYSTAL_BLUE */:
    case "crystal.yellow" /* CRYSTAL_YELLOW */:
      return 1 /* SSR */;
    case "refined_crystal.red" /* REFINED_CRYSTAL_RED */:
    case "refined_crystal.blue" /* REFINED_CRYSTAL_BLUE */:
    case "refined_crystal.yellow" /* REFINED_CRYSTAL_YELLOW */:
      return 2 /* UR */;
  }
}
function getCrystalImageURL(crystal) {
  switch (crystal) {
    case "crystal_ore.red" /* CRYSTAL_ORE_RED */:
    case "crystal.red" /* CRYSTAL_RED */:
    case "refined_crystal.red" /* REFINED_CRYSTAL_RED */:
      return "/static/images/vermelho-removebg-preview.png";
    case "crystal_ore.blue" /* CRYSTAL_ORE_BLUE */:
    case "crystal.blue" /* CRYSTAL_BLUE */:
    case "refined_crystal.blue" /* REFINED_CRYSTAL_BLUE */:
      return "/static/images/azul-removebg-preview.png";
    case "crystal_ore.yellow" /* CRYSTAL_ORE_YELLOW */:
    case "crystal.yellow" /* CRYSTAL_YELLOW */:
    case "refined_crystal.yellow" /* REFINED_CRYSTAL_YELLOW */:
      return "/static/images/amarelo-removebg-preview.png";
    default:
      return "";
  }
}

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

// src/svelte/cristal-view/cristal-view.svelte
function create_fragment(ctx) {
  let div2;
  let div1;
  let div0;
  let t0;
  let img;
  let t1;
  let input;
  let mounted;
  let dispose;
  return {
    c() {
      div2 = element("div");
      div1 = element("div");
      div0 = element("div");
      t0 = space();
      img = element("img");
      t1 = space();
      input = element("input");
      attr(div0, "class", "card-inner-border svelte-17702vf");
      attr(img, "alt", "Crystal");
      attr(img, "class", "svelte-17702vf");
      attr(div1, "class", "card super-card svelte-17702vf");
      attr(input, "type", "number");
      attr(input, "min", "0");
      attr(input, "class", "svelte-17702vf");
      attr(div2, "class", "layout svelte-17702vf");
    },
    m(target, anchor) {
      insert(target, div2, anchor);
      append(div2, div1);
      append(div1, div0);
      append(div1, t0);
      append(div1, img);
      ctx[5](img);
      ctx[6](div1);
      append(div2, t1);
      append(div2, input);
      set_input_value(
        input,
        /*count*/
        ctx[0]
      );
      if (!mounted) {
        dispose = [
          listen(
            input,
            "input",
            /*input_input_handler*/
            ctx[7]
          ),
          listen(
            input,
            "change",
            /*change_handler*/
            ctx[8]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
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
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(div2);
      }
      ctx[5](null);
      ctx[6](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance($$self, $$props, $$invalidate) {
  onMount(() => {
    const crystal_image = getCrystalImageURL(crystal);
    const crystal_rarity = getCrystalRarity(crystal);
    const rarity_color = getRarityColor(crystal_rarity);
    $$invalidate(2, el_img.src = crystal_image, el_img);
    $$invalidate(3, el_card.style.background = `radial-gradient(circle, ${rarity_color.light} 0%, ${rarity_color.dark} 35%, rgba(0,0,0,1) 100%)`, el_card);
    if (getCrystalRarity(crystal) === 0 /* SR */) {
      el_card.classList.remove("super-card");
    }
  });
  let { crystal } = $$props;
  let { count = 0 } = $$props;
  let { onChanged } = $$props;
  let el_img;
  let el_card;
  function img_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      el_img = $$value;
      $$invalidate(2, el_img);
    });
  }
  function div1_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      el_card = $$value;
      $$invalidate(3, el_card);
    });
  }
  function input_input_handler() {
    count = to_number(this.value);
    $$invalidate(0, count);
  }
  const change_handler = (value) => {
    const num = Number.parseInt(value.currentTarget.value || "0");
    onChanged(num);
  };
  $$self.$$set = ($$props2) => {
    if ("crystal" in $$props2) $$invalidate(4, crystal = $$props2.crystal);
    if ("count" in $$props2) $$invalidate(0, count = $$props2.count);
    if ("onChanged" in $$props2) $$invalidate(1, onChanged = $$props2.onChanged);
  };
  return [
    count,
    onChanged,
    el_img,
    el_card,
    crystal,
    img_binding,
    div1_binding,
    input_input_handler,
    change_handler
  ];
}
var Cristal_view = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, { crystal: 4, count: 0, onChanged: 1 });
  }
};
var cristal_view_default = Cristal_view;

// src/svelte/main.svelte
function create_fragment2(ctx) {
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
  let cristalview0;
  let t2;
  let cristalview1;
  let t3;
  let cristalview2;
  let t4;
  let cristalview3;
  let t5;
  let cristalview4;
  let t6;
  let cristalview5;
  let t7;
  let cristalview6;
  let t8;
  let cristalview7;
  let t9;
  let cristalview8;
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
  let t13_value = (
    /*values*/
    ctx[0].days + ""
  );
  let t13;
  let t14;
  let div2;
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
  let t18;
  let div8;
  let div3;
  let label0;
  let t19_value = getTranslation(
    /*lang*/
    ctx[1],
    "trading_post"
  ) + "";
  let t19;
  let t20;
  let input0;
  let t21;
  let div4;
  let label1;
  let t22_value = getTranslation(
    /*lang*/
    ctx[1],
    "challenge_shop"
  ) + "";
  let t22;
  let t23;
  let input1;
  let t24;
  let div5;
  let label2;
  let t25_value = getTranslation(
    /*lang*/
    ctx[1],
    "golemore_mine"
  ) + "";
  let t25;
  let t26;
  let input2;
  let t27;
  let div6;
  let label3;
  let t28_value = getTranslation(
    /*lang*/
    ctx[1],
    "guild"
  ) + "";
  let t28;
  let t29;
  let input3;
  let t30;
  let div7;
  let label4;
  let t31_value = getTranslation(
    /*lang*/
    ctx[1],
    "banquet"
  ) + "";
  let t31;
  let t32;
  let input4;
  let current;
  let mounted;
  let dispose;
  cristalview0 = new cristal_view_default({
    props: {
      crystal: "crystal_ore.red" /* CRYSTAL_ORE_RED */,
      onChanged: (
        /*func*/
        ctx[3]
      )
    }
  });
  cristalview1 = new cristal_view_default({
    props: {
      crystal: "crystal_ore.blue" /* CRYSTAL_ORE_BLUE */,
      onChanged: (
        /*func_1*/
        ctx[4]
      )
    }
  });
  cristalview2 = new cristal_view_default({
    props: {
      crystal: "crystal_ore.yellow" /* CRYSTAL_ORE_YELLOW */,
      onChanged: (
        /*func_2*/
        ctx[5]
      )
    }
  });
  cristalview3 = new cristal_view_default({
    props: {
      crystal: "crystal.red" /* CRYSTAL_RED */,
      onChanged: (
        /*func_3*/
        ctx[6]
      )
    }
  });
  cristalview4 = new cristal_view_default({
    props: {
      crystal: "crystal.blue" /* CRYSTAL_BLUE */,
      onChanged: (
        /*func_4*/
        ctx[7]
      )
    }
  });
  cristalview5 = new cristal_view_default({
    props: {
      crystal: "crystal.yellow" /* CRYSTAL_YELLOW */,
      onChanged: (
        /*func_5*/
        ctx[8]
      )
    }
  });
  cristalview6 = new cristal_view_default({
    props: {
      crystal: "refined_crystal.red" /* REFINED_CRYSTAL_RED */,
      onChanged: (
        /*func_6*/
        ctx[9]
      )
    }
  });
  cristalview7 = new cristal_view_default({
    props: {
      crystal: "refined_crystal.blue" /* REFINED_CRYSTAL_BLUE */,
      onChanged: (
        /*func_7*/
        ctx[10]
      )
    }
  });
  cristalview8 = new cristal_view_default({
    props: {
      crystal: "refined_crystal.yellow" /* REFINED_CRYSTAL_YELLOW */,
      onChanged: (
        /*func_8*/
        ctx[11]
      )
    }
  });
  return {
    c() {
      main = element("main");
      h10 = element("h1");
      t0 = text(t0_value);
      t1 = space();
      div0 = element("div");
      create_component(cristalview0.$$.fragment);
      t2 = space();
      create_component(cristalview1.$$.fragment);
      t3 = space();
      create_component(cristalview2.$$.fragment);
      t4 = space();
      create_component(cristalview3.$$.fragment);
      t5 = space();
      create_component(cristalview4.$$.fragment);
      t6 = space();
      create_component(cristalview5.$$.fragment);
      t7 = space();
      create_component(cristalview6.$$.fragment);
      t8 = space();
      create_component(cristalview7.$$.fragment);
      t9 = space();
      create_component(cristalview8.$$.fragment);
      t10 = space();
      div1 = element("div");
      h2 = element("h2");
      t11 = text(t11_value);
      t12 = space();
      h11 = element("h1");
      t13 = text(t13_value);
      t14 = space();
      div2 = element("div");
      p0 = element("p");
      t15 = text(t15_value);
      t16 = space();
      p1 = element("p");
      t17 = text(t17_value);
      t18 = space();
      div8 = element("div");
      div3 = element("div");
      label0 = element("label");
      t19 = text(t19_value);
      t20 = space();
      input0 = element("input");
      t21 = space();
      div4 = element("div");
      label1 = element("label");
      t22 = text(t22_value);
      t23 = space();
      input1 = element("input");
      t24 = space();
      div5 = element("div");
      label2 = element("label");
      t25 = text(t25_value);
      t26 = space();
      input2 = element("input");
      t27 = space();
      div6 = element("div");
      label3 = element("label");
      t28 = text(t28_value);
      t29 = space();
      input3 = element("input");
      t30 = space();
      div7 = element("div");
      label4 = element("label");
      t31 = text(t31_value);
      t32 = space();
      input4 = element("input");
      set_style(h10, "margin", "auto");
      attr(h10, "class", "svelte-1idsn7m");
      attr(div0, "class", "crystal-group svelte-1idsn7m");
      attr(h2, "class", "svelte-1idsn7m");
      attr(h11, "class", "svelte-1idsn7m");
      attr(div1, "class", "days-group svelte-1idsn7m");
      attr(p0, "class", "svelte-1idsn7m");
      attr(p1, "class", "svelte-1idsn7m");
      attr(div2, "class", "information-group svelte-1idsn7m");
      attr(label0, "for", "trading_post");
      attr(input0, "type", "checkbox");
      attr(input0, "id", "trading_post");
      attr(div3, "class", "input-chip svelte-1idsn7m");
      attr(label1, "for", "challenge_shop");
      attr(input1, "type", "checkbox");
      attr(input1, "id", "challenge_shop");
      attr(div4, "class", "input-chip svelte-1idsn7m");
      attr(label2, "for", "golemore_mine");
      attr(input2, "type", "checkbox");
      attr(input2, "id", "golemore_mine");
      attr(div5, "class", "input-chip svelte-1idsn7m");
      attr(label3, "for", "guild");
      attr(input3, "type", "checkbox");
      attr(input3, "id", "guild");
      attr(div6, "class", "input-chip svelte-1idsn7m");
      attr(label4, "for", "banquet");
      attr(input4, "type", "checkbox");
      attr(input4, "id", "banquet");
      attr(div7, "class", "input-chip svelte-1idsn7m");
      attr(div8, "class", "options-group svelte-1idsn7m");
      attr(main, "class", "svelte-1idsn7m");
    },
    m(target, anchor) {
      insert(target, main, anchor);
      append(main, h10);
      append(h10, t0);
      append(main, t1);
      append(main, div0);
      mount_component(cristalview0, div0, null);
      append(div0, t2);
      mount_component(cristalview1, div0, null);
      append(div0, t3);
      mount_component(cristalview2, div0, null);
      append(div0, t4);
      mount_component(cristalview3, div0, null);
      append(div0, t5);
      mount_component(cristalview4, div0, null);
      append(div0, t6);
      mount_component(cristalview5, div0, null);
      append(div0, t7);
      mount_component(cristalview6, div0, null);
      append(div0, t8);
      mount_component(cristalview7, div0, null);
      append(div0, t9);
      mount_component(cristalview8, div0, null);
      append(main, t10);
      append(main, div1);
      append(div1, h2);
      append(h2, t11);
      append(div1, t12);
      append(div1, h11);
      append(h11, t13);
      append(main, t14);
      append(main, div2);
      append(div2, p0);
      append(p0, t15);
      append(div2, t16);
      append(div2, p1);
      append(p1, t17);
      append(main, t18);
      append(main, div8);
      append(div8, div3);
      append(div3, label0);
      append(label0, t19);
      append(div3, t20);
      append(div3, input0);
      input0.checked = /*values*/
      ctx[0].trading_post;
      append(div8, t21);
      append(div8, div4);
      append(div4, label1);
      append(label1, t22);
      append(div4, t23);
      append(div4, input1);
      input1.checked = /*values*/
      ctx[0].challenge_shop;
      append(div8, t24);
      append(div8, div5);
      append(div5, label2);
      append(label2, t25);
      append(div5, t26);
      append(div5, input2);
      input2.checked = /*values*/
      ctx[0].golemore_mine;
      append(div8, t27);
      append(div8, div6);
      append(div6, label3);
      append(label3, t28);
      append(div6, t29);
      append(div6, input3);
      input3.checked = /*values*/
      ctx[0].guild;
      append(div8, t30);
      append(div8, div7);
      append(div7, label4);
      append(label4, t31);
      append(div7, t32);
      append(div7, input4);
      input4.checked = /*values*/
      ctx[0].banquet;
      current = true;
      if (!mounted) {
        dispose = [
          listen(
            input0,
            "change",
            /*input0_change_handler*/
            ctx[12]
          ),
          listen(
            input0,
            "change",
            /*change_handler*/
            ctx[13]
          ),
          listen(
            input1,
            "change",
            /*input1_change_handler*/
            ctx[14]
          ),
          listen(
            input1,
            "change",
            /*change_handler_1*/
            ctx[15]
          ),
          listen(
            input2,
            "change",
            /*input2_change_handler*/
            ctx[16]
          ),
          listen(
            input2,
            "change",
            /*change_handler_2*/
            ctx[17]
          ),
          listen(
            input3,
            "change",
            /*input3_change_handler*/
            ctx[18]
          ),
          listen(
            input3,
            "change",
            /*change_handler_3*/
            ctx[19]
          ),
          listen(
            input4,
            "change",
            /*input4_change_handler*/
            ctx[20]
          ),
          listen(
            input4,
            "change",
            /*change_handler_4*/
            ctx[21]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if ((!current || dirty & /*lang*/
      2) && t0_value !== (t0_value = getTranslation(
        /*lang*/
        ctx2[1],
        "app.header"
      ) + "")) set_data(t0, t0_value);
      const cristalview0_changes = {};
      if (dirty & /*values*/
      1) cristalview0_changes.onChanged = /*func*/
      ctx2[3];
      cristalview0.$set(cristalview0_changes);
      const cristalview1_changes = {};
      if (dirty & /*values*/
      1) cristalview1_changes.onChanged = /*func_1*/
      ctx2[4];
      cristalview1.$set(cristalview1_changes);
      const cristalview2_changes = {};
      if (dirty & /*values*/
      1) cristalview2_changes.onChanged = /*func_2*/
      ctx2[5];
      cristalview2.$set(cristalview2_changes);
      const cristalview3_changes = {};
      if (dirty & /*values*/
      1) cristalview3_changes.onChanged = /*func_3*/
      ctx2[6];
      cristalview3.$set(cristalview3_changes);
      const cristalview4_changes = {};
      if (dirty & /*values*/
      1) cristalview4_changes.onChanged = /*func_4*/
      ctx2[7];
      cristalview4.$set(cristalview4_changes);
      const cristalview5_changes = {};
      if (dirty & /*values*/
      1) cristalview5_changes.onChanged = /*func_5*/
      ctx2[8];
      cristalview5.$set(cristalview5_changes);
      const cristalview6_changes = {};
      if (dirty & /*values*/
      1) cristalview6_changes.onChanged = /*func_6*/
      ctx2[9];
      cristalview6.$set(cristalview6_changes);
      const cristalview7_changes = {};
      if (dirty & /*values*/
      1) cristalview7_changes.onChanged = /*func_7*/
      ctx2[10];
      cristalview7.$set(cristalview7_changes);
      const cristalview8_changes = {};
      if (dirty & /*values*/
      1) cristalview8_changes.onChanged = /*func_8*/
      ctx2[11];
      cristalview8.$set(cristalview8_changes);
      if ((!current || dirty & /*lang*/
      2) && t11_value !== (t11_value = getTranslation(
        /*lang*/
        ctx2[1],
        "app.days"
      ) + "")) set_data(t11, t11_value);
      if ((!current || dirty & /*values*/
      1) && t13_value !== (t13_value = /*values*/
      ctx2[0].days + "")) set_data(t13, t13_value);
      if ((!current || dirty & /*lang*/
      2) && t15_value !== (t15_value = getTranslation(
        /*lang*/
        ctx2[1],
        "app.information"
      ) + "")) set_data(t15, t15_value);
      if ((!current || dirty & /*values*/
      1) && t17_value !== (t17_value = /*values*/
      ctx2[0].expected_ores_per_day + "")) set_data(t17, t17_value);
      if ((!current || dirty & /*lang*/
      2) && t19_value !== (t19_value = getTranslation(
        /*lang*/
        ctx2[1],
        "trading_post"
      ) + "")) set_data(t19, t19_value);
      if (dirty & /*values*/
      1) {
        input0.checked = /*values*/
        ctx2[0].trading_post;
      }
      if ((!current || dirty & /*lang*/
      2) && t22_value !== (t22_value = getTranslation(
        /*lang*/
        ctx2[1],
        "challenge_shop"
      ) + "")) set_data(t22, t22_value);
      if (dirty & /*values*/
      1) {
        input1.checked = /*values*/
        ctx2[0].challenge_shop;
      }
      if ((!current || dirty & /*lang*/
      2) && t25_value !== (t25_value = getTranslation(
        /*lang*/
        ctx2[1],
        "golemore_mine"
      ) + "")) set_data(t25, t25_value);
      if (dirty & /*values*/
      1) {
        input2.checked = /*values*/
        ctx2[0].golemore_mine;
      }
      if ((!current || dirty & /*lang*/
      2) && t28_value !== (t28_value = getTranslation(
        /*lang*/
        ctx2[1],
        "guild"
      ) + "")) set_data(t28, t28_value);
      if (dirty & /*values*/
      1) {
        input3.checked = /*values*/
        ctx2[0].guild;
      }
      if ((!current || dirty & /*lang*/
      2) && t31_value !== (t31_value = getTranslation(
        /*lang*/
        ctx2[1],
        "banquet"
      ) + "")) set_data(t31, t31_value);
      if (dirty & /*values*/
      1) {
        input4.checked = /*values*/
        ctx2[0].banquet;
      }
    },
    i(local) {
      if (current) return;
      transition_in(cristalview0.$$.fragment, local);
      transition_in(cristalview1.$$.fragment, local);
      transition_in(cristalview2.$$.fragment, local);
      transition_in(cristalview3.$$.fragment, local);
      transition_in(cristalview4.$$.fragment, local);
      transition_in(cristalview5.$$.fragment, local);
      transition_in(cristalview6.$$.fragment, local);
      transition_in(cristalview7.$$.fragment, local);
      transition_in(cristalview8.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(cristalview0.$$.fragment, local);
      transition_out(cristalview1.$$.fragment, local);
      transition_out(cristalview2.$$.fragment, local);
      transition_out(cristalview3.$$.fragment, local);
      transition_out(cristalview4.$$.fragment, local);
      transition_out(cristalview5.$$.fragment, local);
      transition_out(cristalview6.$$.fragment, local);
      transition_out(cristalview7.$$.fragment, local);
      transition_out(cristalview8.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(main);
      }
      destroy_component(cristalview0);
      destroy_component(cristalview1);
      destroy_component(cristalview2);
      destroy_component(cristalview3);
      destroy_component(cristalview4);
      destroy_component(cristalview5);
      destroy_component(cristalview6);
      destroy_component(cristalview7);
      destroy_component(cristalview8);
      mounted = false;
      run_all(dispose);
    }
  };
}
function round(value, step) {
  step || (step = 1);
  const inverse = 1 / step;
  return Math.round(value * inverse) / inverse;
}
function instance2($$self, $$props, $$invalidate) {
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
      $$invalidate(1, lang = 1 /* EN */);
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
    init(this, options, instance2, create_fragment2, safe_not_equal, {});
  }
};
var main_default = Main;

// src/index.ts
console.log("Iniciando...");
var app = new main_default({ target: document.body });
