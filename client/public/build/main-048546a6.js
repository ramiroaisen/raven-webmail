
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
function noop() { }
const identity = x => x;
function assign(tar, src) {
    // @ts-ignore
    for (const k in src)
        tar[k] = src[k];
    return tar;
}
function add_location(element, file, line, column, char) {
    element.__svelte_meta = {
        loc: { file, line, column, char }
    };
}
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
function validate_store(store, name) {
    if (store != null && typeof store.subscribe !== 'function') {
        throw new Error(`'${name}' is not a store with a 'subscribe' method`);
    }
}
function subscribe(store, ...callbacks) {
    if (store == null) {
        return noop;
    }
    const unsub = store.subscribe(...callbacks);
    return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function component_subscribe(component, store, callback) {
    component.$$.on_destroy.push(subscribe(store, callback));
}
function create_slot(definition, ctx, $$scope, fn) {
    if (definition) {
        const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
        return definition[0](slot_ctx);
    }
}
function get_slot_context(definition, ctx, $$scope, fn) {
    return definition[1] && fn
        ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
        : $$scope.ctx;
}
function get_slot_changes(definition, $$scope, dirty, fn) {
    if (definition[2] && fn) {
        const lets = definition[2](fn(dirty));
        if ($$scope.dirty === undefined) {
            return lets;
        }
        if (typeof lets === 'object') {
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
function exclude_internal_props(props) {
    const result = {};
    for (const k in props)
        if (k[0] !== '$')
            result[k] = props[k];
    return result;
}
function null_to_empty(value) {
    return value == null ? '' : value;
}
function set_store_value(store, ret, value = ret) {
    store.set(value);
    return ret;
}
function action_destroyer(action_result) {
    return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
}

const is_client = typeof window !== 'undefined';
let now = is_client
    ? () => window.performance.now()
    : () => Date.now();
let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

const tasks = new Set();
function run_tasks(now) {
    tasks.forEach(task => {
        if (!task.c(now)) {
            tasks.delete(task);
            task.f();
        }
    });
    if (tasks.size !== 0)
        raf(run_tasks);
}
/**
 * Creates a new task that runs on each raf frame
 * until it returns a falsy value or is aborted
 */
function loop(callback) {
    let task;
    if (tasks.size === 0)
        raf(run_tasks);
    return {
        promise: new Promise(fulfill => {
            tasks.add(task = { c: callback, f: fulfill });
        }),
        abort() {
            tasks.delete(task);
        }
    };
}

function append(target, node) {
    target.appendChild(node);
}
function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
}
function detach(node) {
    node.parentNode.removeChild(node);
}
function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
        if (iterations[i])
            iterations[i].d(detaching);
    }
}
function element(name) {
    return document.createElement(name);
}
function svg_element(name) {
    return document.createElementNS('http://www.w3.org/2000/svg', name);
}
function text(data) {
    return document.createTextNode(data);
}
function space() {
    return text(' ');
}
function empty() {
    return text('');
}
function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}
function prevent_default(fn) {
    return function (event) {
        event.preventDefault();
        // @ts-ignore
        return fn.call(this, event);
    };
}
function stop_propagation(fn) {
    return function (event) {
        event.stopPropagation();
        // @ts-ignore
        return fn.call(this, event);
    };
}
function attr(node, attribute, value) {
    if (value == null)
        node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
        node.setAttribute(attribute, value);
}
function set_attributes(node, attributes) {
    // @ts-ignore
    const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
    for (const key in attributes) {
        if (attributes[key] == null) {
            node.removeAttribute(key);
        }
        else if (key === 'style') {
            node.style.cssText = attributes[key];
        }
        else if (key === '__value' || descriptors[key] && descriptors[key].set) {
            node[key] = attributes[key];
        }
        else {
            attr(node, key, attributes[key]);
        }
    }
}
function set_custom_element_data(node, prop, value) {
    if (prop in node) {
        node[prop] = value;
    }
    else {
        attr(node, prop, value);
    }
}
function children(element) {
    return Array.from(element.childNodes);
}
function set_input_value(input, value) {
    if (value != null || input.value) {
        input.value = value;
    }
}
function set_style(node, key, value, important) {
    node.style.setProperty(key, value, important ? 'important' : '');
}
function toggle_class(element, name, toggle) {
    element.classList[toggle ? 'add' : 'remove'](name);
}
function custom_event(type, detail) {
    const e = document.createEvent('CustomEvent');
    e.initCustomEvent(type, false, false, detail);
    return e;
}
class HtmlTag {
    constructor(html, anchor = null) {
        this.e = element('div');
        this.a = anchor;
        this.u(html);
    }
    m(target, anchor = null) {
        for (let i = 0; i < this.n.length; i += 1) {
            insert(target, this.n[i], anchor);
        }
        this.t = target;
    }
    u(html) {
        this.e.innerHTML = html;
        this.n = Array.from(this.e.childNodes);
    }
    p(html) {
        this.d();
        this.u(html);
        this.m(this.t, this.a);
    }
    d() {
        this.n.forEach(detach);
    }
}

const active_docs = new Set();
let active = 0;
// https://github.com/darkskyapp/string-hash/blob/master/index.js
function hash(str) {
    let hash = 5381;
    let i = str.length;
    while (i--)
        hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
    return hash >>> 0;
}
function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
    const step = 16.666 / duration;
    let keyframes = '{\n';
    for (let p = 0; p <= 1; p += step) {
        const t = a + (b - a) * ease(p);
        keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
    }
    const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
    const name = `__svelte_${hash(rule)}_${uid}`;
    const doc = node.ownerDocument;
    active_docs.add(doc);
    const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
    const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
    if (!current_rules[name]) {
        current_rules[name] = true;
        stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
    }
    const animation = node.style.animation || '';
    node.style.animation = `${animation ? `${animation}, ` : ``}${name} ${duration}ms linear ${delay}ms 1 both`;
    active += 1;
    return name;
}
function delete_rule(node, name) {
    const previous = (node.style.animation || '').split(', ');
    const next = previous.filter(name
        ? anim => anim.indexOf(name) < 0 // remove specific animation
        : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
    );
    const deleted = previous.length - next.length;
    if (deleted) {
        node.style.animation = next.join(', ');
        active -= deleted;
        if (!active)
            clear_rules();
    }
}
function clear_rules() {
    raf(() => {
        if (active)
            return;
        active_docs.forEach(doc => {
            const stylesheet = doc.__svelte_stylesheet;
            let i = stylesheet.cssRules.length;
            while (i--)
                stylesheet.deleteRule(i);
            doc.__svelte_rules = {};
        });
        active_docs.clear();
    });
}

function create_animation(node, from, fn, params) {
    if (!from)
        return noop;
    const to = node.getBoundingClientRect();
    if (from.left === to.left && from.right === to.right && from.top === to.top && from.bottom === to.bottom)
        return noop;
    const { delay = 0, duration = 300, easing = identity, 
    // @ts-ignore todo: should this be separated from destructuring? Or start/end added to public api and documentation?
    start: start_time = now() + delay, 
    // @ts-ignore todo:
    end = start_time + duration, tick = noop, css } = fn(node, { from, to }, params);
    let running = true;
    let started = false;
    let name;
    function start() {
        if (css) {
            name = create_rule(node, 0, 1, duration, delay, easing, css);
        }
        if (!delay) {
            started = true;
        }
    }
    function stop() {
        if (css)
            delete_rule(node, name);
        running = false;
    }
    loop(now => {
        if (!started && now >= start_time) {
            started = true;
        }
        if (started && now >= end) {
            tick(1, 0);
            stop();
        }
        if (!running) {
            return false;
        }
        if (started) {
            const p = now - start_time;
            const t = 0 + 1 * easing(p / duration);
            tick(t, 1 - t);
        }
        return true;
    });
    start();
    tick(0, 1);
    return stop;
}
function fix_position(node) {
    const style = getComputedStyle(node);
    if (style.position !== 'absolute' && style.position !== 'fixed') {
        const { width, height } = style;
        const a = node.getBoundingClientRect();
        node.style.position = 'absolute';
        node.style.width = width;
        node.style.height = height;
        add_transform(node, a);
    }
}
function add_transform(node, a) {
    const b = node.getBoundingClientRect();
    if (a.left !== b.left || a.top !== b.top) {
        const style = getComputedStyle(node);
        const transform = style.transform === 'none' ? '' : style.transform;
        node.style.transform = `${transform} translate(${a.left - b.left}px, ${a.top - b.top}px)`;
    }
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error(`Function called outside component initialization`);
    return current_component;
}
function beforeUpdate(fn) {
    get_current_component().$$.before_update.push(fn);
}
function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
}
function onDestroy(fn) {
    get_current_component().$$.on_destroy.push(fn);
}
function createEventDispatcher() {
    const component = get_current_component();
    return (type, detail) => {
        const callbacks = component.$$.callbacks[type];
        if (callbacks) {
            // TODO are there situations where events could be dispatched
            // in a server (non-DOM) environment?
            const event = custom_event(type, detail);
            callbacks.slice().forEach(fn => {
                fn.call(component, event);
            });
        }
    };
}
function setContext(key, context) {
    get_current_component().$$.context.set(key, context);
}
function getContext(key) {
    return get_current_component().$$.context.get(key);
}
// TODO figure out if we still want to support
// shorthand events, or if we want to implement
// a real bubbling mechanism
function bubble(component, event) {
    const callbacks = component.$$.callbacks[event.type];
    if (callbacks) {
        callbacks.slice().forEach(fn => fn(event));
    }
}

const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
    if (!update_scheduled) {
        update_scheduled = true;
        resolved_promise.then(flush);
    }
}
function tick() {
    schedule_update();
    return resolved_promise;
}
function add_render_callback(fn) {
    render_callbacks.push(fn);
}
function add_flush_callback(fn) {
    flush_callbacks.push(fn);
}
let flushing = false;
const seen_callbacks = new Set();
function flush() {
    if (flushing)
        return;
    flushing = true;
    do {
        // first, call beforeUpdate functions
        // and update components
        for (let i = 0; i < dirty_components.length; i += 1) {
            const component = dirty_components[i];
            set_current_component(component);
            update(component.$$);
        }
        dirty_components.length = 0;
        while (binding_callbacks.length)
            binding_callbacks.pop()();
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];
            if (!seen_callbacks.has(callback)) {
                // ...so guard against infinite loops
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
    flushing = false;
    seen_callbacks.clear();
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

let promise;
function wait() {
    if (!promise) {
        promise = Promise.resolve();
        promise.then(() => {
            promise = null;
        });
    }
    return promise;
}
function dispatch(node, direction, kind) {
    node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
}
const outroing = new Set();
let outros;
function group_outros() {
    outros = {
        r: 0,
        c: [],
        p: outros // parent group
    };
}
function check_outros() {
    if (!outros.r) {
        run_all(outros.c);
    }
    outros = outros.p;
}
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
}
function transition_out(block, local, detach, callback) {
    if (block && block.o) {
        if (outroing.has(block))
            return;
        outroing.add(block);
        outros.c.push(() => {
            outroing.delete(block);
            if (callback) {
                if (detach)
                    block.d(1);
                callback();
            }
        });
        block.o(local);
    }
}
const null_transition = { duration: 0 };
function create_in_transition(node, fn, params) {
    let config = fn(node, params);
    let running = false;
    let animation_name;
    let task;
    let uid = 0;
    function cleanup() {
        if (animation_name)
            delete_rule(node, animation_name);
    }
    function go() {
        const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
        if (css)
            animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
        tick(0, 1);
        const start_time = now() + delay;
        const end_time = start_time + duration;
        if (task)
            task.abort();
        running = true;
        add_render_callback(() => dispatch(node, true, 'start'));
        task = loop(now => {
            if (running) {
                if (now >= end_time) {
                    tick(1, 0);
                    dispatch(node, true, 'end');
                    cleanup();
                    return running = false;
                }
                if (now >= start_time) {
                    const t = easing((now - start_time) / duration);
                    tick(t, 1 - t);
                }
            }
            return running;
        });
    }
    let started = false;
    return {
        start() {
            if (started)
                return;
            delete_rule(node);
            if (is_function(config)) {
                config = config();
                wait().then(go);
            }
            else {
                go();
            }
        },
        invalidate() {
            started = false;
        },
        end() {
            if (running) {
                cleanup();
                running = false;
            }
        }
    };
}
function create_out_transition(node, fn, params) {
    let config = fn(node, params);
    let running = true;
    let animation_name;
    const group = outros;
    group.r += 1;
    function go() {
        const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
        if (css)
            animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
        const start_time = now() + delay;
        const end_time = start_time + duration;
        add_render_callback(() => dispatch(node, false, 'start'));
        loop(now => {
            if (running) {
                if (now >= end_time) {
                    tick(0, 1);
                    dispatch(node, false, 'end');
                    if (!--group.r) {
                        // this will result in `end()` being called,
                        // so we don't need to clean up here
                        run_all(group.c);
                    }
                    return false;
                }
                if (now >= start_time) {
                    const t = easing((now - start_time) / duration);
                    tick(1 - t, t);
                }
            }
            return running;
        });
    }
    if (is_function(config)) {
        wait().then(() => {
            // @ts-ignore
            config = config();
            go();
        });
    }
    else {
        go();
    }
    return {
        end(reset) {
            if (reset && config.tick) {
                config.tick(1, 0);
            }
            if (running) {
                if (animation_name)
                    delete_rule(node, animation_name);
                running = false;
            }
        }
    };
}
function create_bidirectional_transition(node, fn, params, intro) {
    let config = fn(node, params);
    let t = intro ? 0 : 1;
    let running_program = null;
    let pending_program = null;
    let animation_name = null;
    function clear_animation() {
        if (animation_name)
            delete_rule(node, animation_name);
    }
    function init(program, duration) {
        const d = program.b - t;
        duration *= Math.abs(d);
        return {
            a: t,
            b: program.b,
            d,
            duration,
            start: program.start,
            end: program.start + duration,
            group: program.group
        };
    }
    function go(b) {
        const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
        const program = {
            start: now() + delay,
            b
        };
        if (!b) {
            // @ts-ignore todo: improve typings
            program.group = outros;
            outros.r += 1;
        }
        if (running_program) {
            pending_program = program;
        }
        else {
            // if this is an intro, and there's a delay, we need to do
            // an initial tick and/or apply CSS animation immediately
            if (css) {
                clear_animation();
                animation_name = create_rule(node, t, b, duration, delay, easing, css);
            }
            if (b)
                tick(0, 1);
            running_program = init(program, duration);
            add_render_callback(() => dispatch(node, b, 'start'));
            loop(now => {
                if (pending_program && now > pending_program.start) {
                    running_program = init(pending_program, duration);
                    pending_program = null;
                    dispatch(node, running_program.b, 'start');
                    if (css) {
                        clear_animation();
                        animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                    }
                }
                if (running_program) {
                    if (now >= running_program.end) {
                        tick(t = running_program.b, 1 - t);
                        dispatch(node, running_program.b, 'end');
                        if (!pending_program) {
                            // we're done
                            if (running_program.b) {
                                // intro — we can tidy up immediately
                                clear_animation();
                            }
                            else {
                                // outro — needs to be coordinated
                                if (!--running_program.group.r)
                                    run_all(running_program.group.c);
                            }
                        }
                        running_program = null;
                    }
                    else if (now >= running_program.start) {
                        const p = now - running_program.start;
                        t = running_program.a + running_program.d * easing(p / running_program.duration);
                        tick(t, 1 - t);
                    }
                }
                return !!(running_program || pending_program);
            });
        }
    }
    return {
        run(b) {
            if (is_function(config)) {
                wait().then(() => {
                    // @ts-ignore
                    config = config();
                    go(b);
                });
            }
            else {
                go(b);
            }
        },
        end() {
            clear_animation();
            running_program = pending_program = null;
        }
    };
}

const globals = (typeof window !== 'undefined'
    ? window
    : typeof globalThis !== 'undefined'
        ? globalThis
        : global);
function outro_and_destroy_block(block, lookup) {
    transition_out(block, 1, 1, () => {
        lookup.delete(block.key);
    });
}
function fix_and_outro_and_destroy_block(block, lookup) {
    block.f();
    outro_and_destroy_block(block, lookup);
}
function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
    let o = old_blocks.length;
    let n = list.length;
    let i = o;
    const old_indexes = {};
    while (i--)
        old_indexes[old_blocks[i].key] = i;
    const new_blocks = [];
    const new_lookup = new Map();
    const deltas = new Map();
    i = n;
    while (i--) {
        const child_ctx = get_context(ctx, list, i);
        const key = get_key(child_ctx);
        let block = lookup.get(key);
        if (!block) {
            block = create_each_block(key, child_ctx);
            block.c();
        }
        else if (dynamic) {
            block.p(child_ctx, dirty);
        }
        new_lookup.set(key, new_blocks[i] = block);
        if (key in old_indexes)
            deltas.set(key, Math.abs(i - old_indexes[key]));
    }
    const will_move = new Set();
    const did_move = new Set();
    function insert(block) {
        transition_in(block, 1);
        block.m(node, next, lookup.has(block.key));
        lookup.set(block.key, block);
        next = block.first;
        n--;
    }
    while (o && n) {
        const new_block = new_blocks[n - 1];
        const old_block = old_blocks[o - 1];
        const new_key = new_block.key;
        const old_key = old_block.key;
        if (new_block === old_block) {
            // do nothing
            next = new_block.first;
            o--;
            n--;
        }
        else if (!new_lookup.has(old_key)) {
            // remove old block
            destroy(old_block, lookup);
            o--;
        }
        else if (!lookup.has(new_key) || will_move.has(new_key)) {
            insert(new_block);
        }
        else if (did_move.has(old_key)) {
            o--;
        }
        else if (deltas.get(new_key) > deltas.get(old_key)) {
            did_move.add(new_key);
            insert(new_block);
        }
        else {
            will_move.add(old_key);
            o--;
        }
    }
    while (o--) {
        const old_block = old_blocks[o];
        if (!new_lookup.has(old_block.key))
            destroy(old_block, lookup);
    }
    while (n)
        insert(new_blocks[n - 1]);
    return new_blocks;
}
function validate_each_keys(ctx, list, get_context, get_key) {
    const keys = new Set();
    for (let i = 0; i < list.length; i++) {
        const key = get_key(get_context(ctx, list, i));
        if (keys.has(key)) {
            throw new Error(`Cannot have duplicate keys in a keyed each`);
        }
        keys.add(key);
    }
}

function get_spread_update(levels, updates) {
    const update = {};
    const to_null_out = {};
    const accounted_for = { $$scope: 1 };
    let i = levels.length;
    while (i--) {
        const o = levels[i];
        const n = updates[i];
        if (n) {
            for (const key in o) {
                if (!(key in n))
                    to_null_out[key] = 1;
            }
            for (const key in n) {
                if (!accounted_for[key]) {
                    update[key] = n[key];
                    accounted_for[key] = 1;
                }
            }
            levels[i] = n;
        }
        else {
            for (const key in o) {
                accounted_for[key] = 1;
            }
        }
    }
    for (const key in to_null_out) {
        if (!(key in update))
            update[key] = undefined;
    }
    return update;
}
function get_spread_object(spread_props) {
    return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
}

function bind(component, name, callback) {
    const index = component.$$.props[name];
    if (index !== undefined) {
        component.$$.bound[index] = callback;
        callback(component.$$.ctx[index]);
    }
}
function create_component(block) {
    block && block.c();
}
function mount_component(component, target, anchor) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    // onMount happens before the initial afterUpdate
    add_render_callback(() => {
        const new_on_destroy = on_mount.map(run).filter(is_function);
        if (on_destroy) {
            on_destroy.push(...new_on_destroy);
        }
        else {
            // Edge case - component was destroyed immediately,
            // most likely as a result of a binding initialising
            run_all(new_on_destroy);
        }
        component.$$.on_mount = [];
    });
    after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
        run_all($$.on_destroy);
        $$.fragment && $$.fragment.d(detaching);
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
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
    component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
}
function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const prop_values = options.props || {};
    const $$ = component.$$ = {
        fragment: null,
        ctx: null,
        // state
        props,
        update: noop,
        not_equal,
        bound: blank_object(),
        // lifecycle
        on_mount: [],
        on_destroy: [],
        before_update: [],
        after_update: [],
        context: new Map(parent_component ? parent_component.$$.context : []),
        // everything else
        callbacks: blank_object(),
        dirty
    };
    let ready = false;
    $$.ctx = instance
        ? instance(component, prop_values, (i, ret, ...rest) => {
            const value = rest.length ? rest[0] : ret;
            if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                if ($$.bound[i])
                    $$.bound[i](value);
                if (ready)
                    make_dirty(component, i);
            }
            return ret;
        })
        : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
        if (options.hydrate) {
            const nodes = children(options.target);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.l(nodes);
            nodes.forEach(detach);
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.c();
        }
        if (options.intro)
            transition_in(component.$$.fragment);
        mount_component(component, options.target, options.anchor);
        flush();
    }
    set_current_component(parent_component);
}
class SvelteComponent {
    $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
    }
    $on(type, callback) {
        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
        callbacks.push(callback);
        return () => {
            const index = callbacks.indexOf(callback);
            if (index !== -1)
                callbacks.splice(index, 1);
        };
    }
    $set() {
        // overridden by instance, if it has props
    }
}

function dispatch_dev(type, detail) {
    document.dispatchEvent(custom_event(type, Object.assign({ version: '3.21.0' }, detail)));
}
function append_dev(target, node) {
    dispatch_dev("SvelteDOMInsert", { target, node });
    append(target, node);
}
function insert_dev(target, node, anchor) {
    dispatch_dev("SvelteDOMInsert", { target, node, anchor });
    insert(target, node, anchor);
}
function detach_dev(node) {
    dispatch_dev("SvelteDOMRemove", { node });
    detach(node);
}
function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
    const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
    if (has_prevent_default)
        modifiers.push('preventDefault');
    if (has_stop_propagation)
        modifiers.push('stopPropagation');
    dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
    const dispose = listen(node, event, handler, options);
    return () => {
        dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
        dispose();
    };
}
function attr_dev(node, attribute, value) {
    attr(node, attribute, value);
    if (value == null)
        dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
    else
        dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
}
function prop_dev(node, property, value) {
    node[property] = value;
    dispatch_dev("SvelteDOMSetProperty", { node, property, value });
}
function set_data_dev(text, data) {
    data = '' + data;
    if (text.data === data)
        return;
    dispatch_dev("SvelteDOMSetData", { node: text, data });
    text.data = data;
}
function validate_each_argument(arg) {
    if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
        let msg = '{#each} only iterates over array-like objects.';
        if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
            msg += ' You can use a spread to convert this iterable into an array.';
        }
        throw new Error(msg);
    }
}
function validate_slots(name, slot, keys) {
    for (const slot_key of Object.keys(slot)) {
        if (!~keys.indexOf(slot_key)) {
            console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
        }
    }
}
class SvelteComponentDev extends SvelteComponent {
    constructor(options) {
        if (!options || (!options.target && !options.$$inline)) {
            throw new Error(`'target' is a required option`);
        }
        super();
    }
    $destroy() {
        super.$destroy();
        this.$destroy = () => {
            console.warn(`Component was already destroyed`); // eslint-disable-line no-console
        };
    }
    $capture_state() { }
    $inject_state() { }
}

const writable = (value) => {
    const subs = [];
    let timer = null;
    const invalidate = async () => {
        timer && clearTimeout(timer);
        timer = setTimeout(() => {
            for (const sub of subs) {
                sub(value);
            }
        }, 1);
    };
    const get = () => value;
    const set = (n) => {
        if (value !== n || (typeof value === "object" && value !== null)) {
            value = n;
            invalidate();
        }
    };
    const update = (fn) => {
        set(fn(value));
    };
    const subscribe = (fn, onstart = true) => {
        subs.push(fn);
        onstart && fn(value);
        return () => {
            subs.splice(subs.indexOf(fn), 1);
        };
    };
    const clone = () => writable(value);
    return {
        get, set, update, subscribe, clone, invalidate,
        get value() { return value; }
    };
};
const readonly = (store) => {
    const { get, subscribe, clone, invalidate } = store;
    return {
        get,
        subscribe,
        clone: () => readonly(clone()),
        invalidate,
        get value() { return store.value; }
    };
};

const subscriber_queue = [];
/**
 * Creates a `Readable` store that allows reading by subscription.
 * @param value initial value
 * @param {StartStopNotifier}start start and stop notifications for subscriptions
 */
function readable(value, start) {
    return {
        subscribe: writable$1(value, start).subscribe,
    };
}
/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
 */
function writable$1(value, start = noop) {
    let stop;
    const subscribers = [];
    function set(new_value) {
        if (safe_not_equal(value, new_value)) {
            value = new_value;
            if (stop) { // store is ready
                const run_queue = !subscriber_queue.length;
                for (let i = 0; i < subscribers.length; i += 1) {
                    const s = subscribers[i];
                    s[1]();
                    subscriber_queue.push(s, value);
                }
                if (run_queue) {
                    for (let i = 0; i < subscriber_queue.length; i += 2) {
                        subscriber_queue[i][0](subscriber_queue[i + 1]);
                    }
                    subscriber_queue.length = 0;
                }
            }
        }
    }
    function update(fn) {
        set(fn(value));
    }
    function subscribe(run, invalidate = noop) {
        const subscriber = [run, invalidate];
        subscribers.push(subscriber);
        if (subscribers.length === 1) {
            stop = start(set) || noop;
        }
        run(value);
        return () => {
            const index = subscribers.indexOf(subscriber);
            if (index !== -1) {
                subscribers.splice(index, 1);
            }
            if (subscribers.length === 0) {
                stop();
                stop = null;
            }
        };
    }
    return { set, update, subscribe };
}
function derived(stores, fn, initial_value) {
    const single = !Array.isArray(stores);
    const stores_array = single
        ? [stores]
        : stores;
    const auto = fn.length < 2;
    return readable(initial_value, (set) => {
        let inited = false;
        const values = [];
        let pending = 0;
        let cleanup = noop;
        const sync = () => {
            if (pending) {
                return;
            }
            cleanup();
            const result = fn(single ? values[0] : values, set);
            if (auto) {
                set(result);
            }
            else {
                cleanup = is_function(result) ? result : noop;
            }
        };
        const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
            values[i] = value;
            pending &= ~(1 << i);
            if (inited) {
                sync();
            }
        }, () => {
            pending |= (1 << i);
        }));
        inited = true;
        sync();
        return function stop() {
            run_all(unsubscribers);
            cleanup();
        };
    });
}

let _uid = 0;
const uid = () => ++_uid;
const callbacks = new Map();
const awaiters = new Map();
const user = writable(null);
const ws = new Promise((resolve, reject) => {
    const url = new URL("/ws", location.href);
    url.protocol = location.protocol.replace("http", "ws");
    console.log("[WS] connecting");
    const ws = new WebSocket(url.href);
    ws.onerror = reject;
    ws.onopen = () => {
        console.log("[WS] open");
        setInterval(() => send({ id: uid(), type: "ping" }), 30000);
    };
    ws.onmessage = (m) => {
        console.log("[WS] first message received");
        const { user: $user } = JSON.parse(m.data);
        user.set($user);
        ws.onmessage = m => {
            const msg = JSON.parse(m.data);
            switch (msg.type) {
                case "resolve":
                    const awaiter = awaiters.get(msg.replyTo);
                    if (awaiter == null) {
                        console.warn("[WS] Call resolve to empty awaiter");
                    }
                    else {
                        const [resolve] = awaiter;
                        resolve(msg.arg);
                    }
                    awaiters.delete(msg.replyTo);
                    break;
                case "call":
                    const fn = callbacks.get(msg.callId);
                    if (fn == null) {
                        console.warn("[WS] Call call to empty callback");
                    }
                    else {
                        fn(msg.arg);
                    }
                    break;
                case "reject":
                    const aw = awaiters.get(msg.replyTo);
                    if (aw == null || aw[1] == null) {
                        console.warn("[WS] Call reject to empty awaiter");
                    }
                    else {
                        const [_, reject] = aw;
                        reject({ message: msg.message });
                    }
                    awaiters.delete(msg.replyTo);
                    break;
                case "error":
                    console.warn(`[WS] Error from backend: ${msg.message}`);
                    break;
                case "ping":
                    send({ id: uid(), type: "pong", replyTo: msg.id });
                    break;
                case "pong":
                    const aws = awaiters.get(msg.replyTo);
                    if (aws != null) {
                        const [resolve] = aws;
                        resolve(null);
                        awaiters.delete(msg.replyTo);
                    }
                    else {
                        console.warn("[Mailer] Call pong to empty receiver");
                    }
                    break;
            }
        };
        resolve(ws);
    };
});
const ready = ws.then(() => void 0);
const send = async (msg) => {
    (await ws).send(JSON.stringify(msg));
    return {
        then: (resolve, reject) => {
            awaiters.set(msg.id, [resolve, reject]);
        }
    };
};
const login = async ({ username, password }, goto = "/") => {
    const json = await fetch("/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username, password })
    }).then(res => res.json());
    if (json.error) {
        throw new Error(json.error.message);
    }
    location.replace(goto);
    return json;
};
const get = async (path) => {
    return send({ id: uid(), type: "get", path });
};
const post = async (path, body) => {
    return send({ id: uid(), type: "post", path, body });
};
const put = async (path, body) => {
    return send({ id: uid(), type: "put", path, body });
};
const del = async (path) => {
    return send({ id: uid(), type: "del", path });
};
const watchers = new Set();
let watching = false;
const watch = async (fn) => {
    watchers.add(fn);
    if (!watching) {
        watching = true;
        const onChange = (change) => {
            console.log("[WS] Change", change);
            for (const fn of watchers) {
                fn(change);
            }
        };
        const callbackId = uid();
        callbacks.set(callbackId, onChange);
        send({ id: uid(), type: "watch", callbackId });
    }
    return () => {
        watchers.delete(fn);
    };
};

/* node_modules/svelte-material-icons/Menu.svelte generated by Svelte v3.21.0 */

const file = "node_modules/svelte-material-icons/Menu.svelte";

function create_fragment(ctx) {
	let svg;
	let path;

	const block = {
		c: function create() {
			svg = svg_element("svg");
			path = svg_element("path");
			attr_dev(path, "d", "M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z");
			attr_dev(path, "fill", /*color*/ ctx[2]);
			add_location(path, file, 8, 59, 234);
			attr_dev(svg, "width", /*width*/ ctx[0]);
			attr_dev(svg, "height", /*height*/ ctx[1]);
			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			add_location(svg, file, 8, 0, 175);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, svg, anchor);
			append_dev(svg, path);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*color*/ 4) {
				attr_dev(path, "fill", /*color*/ ctx[2]);
			}

			if (dirty & /*width*/ 1) {
				attr_dev(svg, "width", /*width*/ ctx[0]);
			}

			if (dirty & /*height*/ 2) {
				attr_dev(svg, "height", /*height*/ ctx[1]);
			}

			if (dirty & /*viewBox*/ 8) {
				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(svg);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance($$self, $$props, $$invalidate) {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	const writable_props = ["size", "width", "height", "color", "viewBox"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Menu> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("Menu", $$slots, []);

	$$self.$set = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

	$$self.$inject_state = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [width, height, color, viewBox, size];
}

class Menu extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance, create_fragment, safe_not_equal, {
			size: 4,
			width: 0,
			height: 1,
			color: 2,
			viewBox: 3
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Menu",
			options,
			id: create_fragment.name
		});
	}

	get size() {
		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set size(value) {
		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get width() {
		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set width(value) {
		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get height() {
		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set height(value) {
		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get color() {
		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set color(value) {
		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get viewBox() {
		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set viewBox(value) {
		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

function cubicOut(t) {
    const f = t - 1.0;
    return f * f * f + 1.0;
}
function quadOut(t) {
    return -t * (t - 2.0);
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}
function fade(node, { delay = 0, duration = 400, easing = identity }) {
    const o = +getComputedStyle(node).opacity;
    return {
        delay,
        duration,
        easing,
        css: t => `opacity: ${t * o}`
    };
}
function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 }) {
    const style = getComputedStyle(node);
    const target_opacity = +style.opacity;
    const transform = style.transform === 'none' ? '' : style.transform;
    const od = target_opacity * (1 - opacity);
    return {
        delay,
        duration,
        easing,
        css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
    };
}
function slide(node, { delay = 0, duration = 400, easing = cubicOut }) {
    const style = getComputedStyle(node);
    const opacity = +style.opacity;
    const height = parseFloat(style.height);
    const padding_top = parseFloat(style.paddingTop);
    const padding_bottom = parseFloat(style.paddingBottom);
    const margin_top = parseFloat(style.marginTop);
    const margin_bottom = parseFloat(style.marginBottom);
    const border_top_width = parseFloat(style.borderTopWidth);
    const border_bottom_width = parseFloat(style.borderBottomWidth);
    return {
        delay,
        duration,
        easing,
        css: t => `overflow: hidden;` +
            `opacity: ${Math.min(t * 20, 1) * opacity};` +
            `height: ${t * height}px;` +
            `padding-top: ${t * padding_top}px;` +
            `padding-bottom: ${t * padding_bottom}px;` +
            `margin-top: ${t * margin_top}px;` +
            `margin-bottom: ${t * margin_bottom}px;` +
            `border-top-width: ${t * border_top_width}px;` +
            `border-bottom-width: ${t * border_bottom_width}px;`
    };
}
function scale(node, { delay = 0, duration = 400, easing = cubicOut, start = 0, opacity = 0 }) {
    const style = getComputedStyle(node);
    const target_opacity = +style.opacity;
    const transform = style.transform === 'none' ? '' : style.transform;
    const sd = 1 - start;
    const od = target_opacity * (1 - opacity);
    return {
        delay,
        duration,
        easing,
        css: (_t, u) => `
			transform: ${transform} scale(${1 - (sd * u)});
			opacity: ${target_opacity - (od * u)}
		`
    };
}
function crossfade(_a) {
    var { fallback } = _a, defaults = __rest(_a, ["fallback"]);
    const to_receive = new Map();
    const to_send = new Map();
    function crossfade(from, node, params) {
        const { delay = 0, duration = d => Math.sqrt(d) * 30, easing = cubicOut } = assign(assign({}, defaults), params);
        const to = node.getBoundingClientRect();
        const dx = from.left - to.left;
        const dy = from.top - to.top;
        const dw = from.width / to.width;
        const dh = from.height / to.height;
        const d = Math.sqrt(dx * dx + dy * dy);
        const style = getComputedStyle(node);
        const transform = style.transform === 'none' ? '' : style.transform;
        const opacity = +style.opacity;
        return {
            delay,
            duration: is_function(duration) ? duration(d) : duration,
            easing,
            css: (t, u) => `
				opacity: ${t * opacity};
				transform-origin: top left;
				transform: ${transform} translate(${u * dx}px,${u * dy}px) scale(${t + (1 - t) * dw}, ${t + (1 - t) * dh});
			`
        };
    }
    function transition(items, counterparts, intro) {
        return (node, params) => {
            items.set(params.key, {
                rect: node.getBoundingClientRect()
            });
            return () => {
                if (counterparts.has(params.key)) {
                    const { rect } = counterparts.get(params.key);
                    counterparts.delete(params.key);
                    return crossfade(rect, node, params);
                }
                // if the node is disappearing altogether
                // (i.e. wasn't claimed by the other list)
                // then we need to supply an outro
                items.delete(params.key);
                return fallback && fallback(node, params, intro);
            };
        };
    }
    return [
        transition(to_send, to_receive, false),
        transition(to_receive, to_send, true)
    ];
}

function ie(n){return l=>{const o=Object.keys(n.$$.callbacks),i=[];return o.forEach(o=>i.push(listen(l,o,e=>bubble(n,e)))),{destroy:()=>{i.forEach(e=>e());}}}}function se(){return "undefined"!=typeof window&&!(window.CSS&&window.CSS.supports&&window.CSS.supports("(--foo: red)"))}function re(e){var t;return "r"===e.charAt(0)?e=(t=(t=e).match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i))&&4===t.length?"#"+("0"+parseInt(t[1],10).toString(16)).slice(-2)+("0"+parseInt(t[2],10).toString(16)).slice(-2)+("0"+parseInt(t[3],10).toString(16)).slice(-2):"":"transparent"===e.toLowerCase()&&(e="#00000000"),e}const{document:ae}=globals;function ce(e){let t;return {c(){t=element("div"),attr(t,"class","ripple svelte-po4fcb");},m(n,l){insert(n,t,l),e[5](t);},p:noop,i:noop,o:noop,d(n){n&&detach(t),e[5](null);}}}function de(e,t){e.style.transform=t,e.style.webkitTransform=t;}function ue(e,t){e.style.opacity=t.toString();}const pe=function(e,t){const n=["touchcancel","mouseleave","dragstart"];let l=t.currentTarget||t.target;if(l&&!l.classList.contains("ripple")&&(l=l.querySelector(".ripple")),!l)return;const o=l.dataset.event;if(o&&o!==e)return;l.dataset.event=e;const i=document.createElement("span"),{radius:s,scale:r,x:a,y:c,centerX:d,centerY:u}=((e,t)=>{const n=t.getBoundingClientRect(),l=function(e){return "TouchEvent"===e.constructor.name}(e)?e.touches[e.touches.length-1]:e,o=l.clientX-n.left,i=l.clientY-n.top;let s=0,r=.3;const a=t.dataset.center;t.dataset.circle?(r=.15,s=t.clientWidth/2,s=a?s:s+Math.sqrt((o-s)**2+(i-s)**2)/4):s=Math.sqrt(t.clientWidth**2+t.clientHeight**2)/2;const c=`${(t.clientWidth-2*s)/2}px`,d=`${(t.clientHeight-2*s)/2}px`;return {radius:s,scale:r,x:a?c:`${o-s}px`,y:a?d:`${i-s}px`,centerX:c,centerY:d}})(t,l),p=l.dataset.color,f=`${2*s}px`;i.className="animation",i.style.width=f,i.style.height=f,i.style.background=p,i.classList.add("animation--enter"),i.classList.add("animation--visible"),de(i,`translate(${a}, ${c}) scale3d(${r},${r},${r})`),ue(i,0),i.dataset.activated=String(performance.now()),l.appendChild(i),setTimeout(()=>{i.classList.remove("animation--enter"),i.classList.add("animation--in"),de(i,`translate(${d}, ${u}) scale3d(1,1,1)`),ue(i,.25);},0);const v="mousedown"===e?"mouseup":"touchend",h=function(){document.removeEventListener(v,h),n.forEach(e=>{document.removeEventListener(e,h);});const e=performance.now()-Number(i.dataset.activated),t=Math.max(250-e,0);setTimeout(()=>{i.classList.remove("animation--in"),i.classList.add("animation--out"),ue(i,0),setTimeout(()=>{i&&l.removeChild(i),0===l.children.length&&delete l.dataset.event;},300);},t);};document.addEventListener(v,h),n.forEach(e=>{document.addEventListener(e,h,{passive:!0});});},fe=function(e){0===e.button&&pe(e.type,e);},ve=function(e){if(e.changedTouches)for(let t=0;t<e.changedTouches.length;++t)pe(e.type,e.changedTouches[t]);};function he(e,t,n){let l,o,{center:i=!1}=t,{circle:s=!1}=t,{color:r="currentColor"}=t;return onMount(async()=>{await tick();try{i&&n(0,l.dataset.center="true",l),s&&n(0,l.dataset.circle="true",l),n(0,l.dataset.color=r,l),o=l.parentElement;}catch(e){}if(!o)return void console.error("Ripple: Trigger element not found.");let e=window.getComputedStyle(o);0!==e.position.length&&"static"!==e.position||(o.style.position="relative"),o.addEventListener("touchstart",ve,{passive:!0}),o.addEventListener("mousedown",fe,{passive:!0});}),onDestroy(()=>{o&&(o.removeEventListener("mousedown",fe),o.removeEventListener("touchstart",ve));}),e.$set=e=>{"center"in e&&n(1,i=e.center),"circle"in e&&n(2,s=e.circle),"color"in e&&n(3,r=e.color);},[l,i,s,r,o,function(e){binding_callbacks[e?"unshift":"push"](()=>{n(0,l=e);});}]}class ge extends SvelteComponent{constructor(e){var t;super(),ae.getElementById("svelte-po4fcb-style")||((t=element("style")).id="svelte-po4fcb-style",t.textContent=".ripple.svelte-po4fcb{display:block;position:absolute;top:0;left:0;right:0;bottom:0;overflow:hidden;border-radius:inherit;color:inherit;pointer-events:none;z-index:0;contain:strict}.ripple.svelte-po4fcb .animation{color:inherit;position:absolute;top:0;left:0;border-radius:50%;opacity:0;pointer-events:none;overflow:hidden;will-change:transform, opacity}.ripple.svelte-po4fcb .animation--enter{transition:none}.ripple.svelte-po4fcb .animation--in{transition:opacity 0.1s cubic-bezier(0.4, 0, 0.2, 1);transition:transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),\n\t\t\topacity 0.1s cubic-bezier(0.4, 0, 0.2, 1)}.ripple.svelte-po4fcb .animation--out{transition:opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)}",append(ae.head,t)),init(this,e,he,ce,safe_not_equal,{center:1,circle:2,color:3});}}function me(e){let t;const n=new ge({props:{center:e[3],circle:e[3]}});return {c(){create_component(n.$$.fragment);},m(e,l){mount_component(n,e,l),t=!0;},p(e,t){const l={};8&t&&(l.center=e[3]),8&t&&(l.circle=e[3]),n.$set(l);},i(e){t||(transition_in(n.$$.fragment,e),t=!0);},o(e){transition_out(n.$$.fragment,e),t=!1;},d(e){destroy_component(n,e);}}}function be(t){let n,l,o,i,a;const d=t[22].default,p=create_slot(d,t,t[21],null);let v=t[10]&&me(t),h=[{class:t[1]},{style:t[2]},t[14]],b={};for(let e=0;e<h.length;e+=1)b=assign(b,h[e]);return {c(){n=element("button"),p&&p.c(),l=space(),v&&v.c(),set_attributes(n,b),toggle_class(n,"raised",t[6]),toggle_class(n,"outlined",t[8]&&!(t[6]||t[7])),toggle_class(n,"shaped",t[9]&&!t[3]),toggle_class(n,"dense",t[5]),toggle_class(n,"fab",t[4]&&t[3]),toggle_class(n,"icon-button",t[3]),toggle_class(n,"toggle",t[11]),toggle_class(n,"active",t[11]&&t[0]),toggle_class(n,"full-width",t[12]&&!t[3]),toggle_class(n,"svelte-6bcb3a",!0);},m(s,d){insert(s,n,d),p&&p.m(n,null),append(n,l),v&&v.m(n,null),t[23](n),i=!0,a=[listen(n,"click",t[16]),action_destroyer(o=t[15].call(null,n))];},p(e,[t]){p&&p.p&&2097152&t&&p.p(get_slot_context(d,e,e[21],null),get_slot_changes(d,e[21],t,null)),e[10]?v?(v.p(e,t),transition_in(v,1)):(v=me(e),v.c(),transition_in(v,1),v.m(n,null)):v&&(group_outros(),transition_out(v,1,1,()=>{v=null;}),check_outros()),set_attributes(n,get_spread_update(h,[2&t&&{class:e[1]},4&t&&{style:e[2]},16384&t&&e[14]])),toggle_class(n,"raised",e[6]),toggle_class(n,"outlined",e[8]&&!(e[6]||e[7])),toggle_class(n,"shaped",e[9]&&!e[3]),toggle_class(n,"dense",e[5]),toggle_class(n,"fab",e[4]&&e[3]),toggle_class(n,"icon-button",e[3]),toggle_class(n,"toggle",e[11]),toggle_class(n,"active",e[11]&&e[0]),toggle_class(n,"full-width",e[12]&&!e[3]),toggle_class(n,"svelte-6bcb3a",!0);},i(e){i||(transition_in(p,e),transition_in(v),i=!0);},o(e){transition_out(p,e),transition_out(v),i=!1;},d(e){e&&detach(n),p&&p.d(e),v&&v.d(),t[23](null),run_all(a);}}}function ye(e,t,n){const l=createEventDispatcher(),o=ie(current_component);let i,{class:s=""}=t,{style:r=null}=t,{icon:a=!1}=t,{fab:c=!1}=t,{dense:d=!1}=t,{raised:u=!1}=t,{unelevated:f=!1}=t,{outlined:v=!1}=t,{shaped:h=!1}=t,{color:g=null}=t,{ripple:m=!0}=t,{toggle:b=!1}=t,{active:x=!1}=t,{fullWidth:w=!1}=t,$={};beforeUpdate(()=>{if(!i)return;let e=i.getElementsByTagName("svg"),t=e.length;for(let n=0;n<t;n++)e[n].setAttribute("width",z+(b&&!a?2:0)),e[n].setAttribute("height",z+(b&&!a?2:0));n(13,i.style.backgroundColor=u||f?g:"transparent",i);let l=getComputedStyle(i).getPropertyValue("background-color");n(13,i.style.color=u||f?function(e="#ffffff"){let t,n,l,o,i,s;if(0===e.length&&(e="#ffffff"),e=re(e),e=String(e).replace(/[^0-9a-f]/gi,""),!new RegExp(/^(?:[0-9a-f]{3}){1,2}$/i).test(e))throw new Error("Invalid HEX color!");e.length<6&&(e=e[0]+e[0]+e[1]+e[1]+e[2]+e[2]);const r=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);return t=parseInt(r[1],16)/255,n=parseInt(r[2],16)/255,l=parseInt(r[3],16)/255,o=t<=.03928?t/12.92:Math.pow((t+.055)/1.055,2.4),i=n<=.03928?n/12.92:Math.pow((n+.055)/1.055,2.4),s=l<=.03928?l/12.92:Math.pow((l+.055)/1.055,2.4),.2126*o+.7152*i+.0722*s}(l)>.5?"#000":"#fff":g,i);});let z,{$$slots:k={},$$scope:D}=t;return e.$set=e=>{n(20,t=assign(assign({},t),exclude_internal_props(e))),"class"in e&&n(1,s=e.class),"style"in e&&n(2,r=e.style),"icon"in e&&n(3,a=e.icon),"fab"in e&&n(4,c=e.fab),"dense"in e&&n(5,d=e.dense),"raised"in e&&n(6,u=e.raised),"unelevated"in e&&n(7,f=e.unelevated),"outlined"in e&&n(8,v=e.outlined),"shaped"in e&&n(9,h=e.shaped),"color"in e&&n(17,g=e.color),"ripple"in e&&n(10,m=e.ripple),"toggle"in e&&n(11,b=e.toggle),"active"in e&&n(0,x=e.active),"fullWidth"in e&&n(12,w=e.fullWidth),"$$scope"in e&&n(21,D=e.$$scope);},e.$$.update=()=>{{const{style:e,icon:l,fab:o,dense:i,raised:s,unelevated:r,outlined:a,shaped:c,color:d,ripple:u,toggle:p,active:f,fullWidth:v,...h}=t;!h.disabled&&delete h.disabled,delete h.class,n(14,$=h);}56&e.$$.dirty&&(z=a?c?24:d?20:24:d?16:18),139264&e.$$.dirty&&("primary"===g?n(17,g=se()?"#1976d2":"var(--primary, #1976d2)"):"accent"==g?n(17,g=se()?"#f50057":"var(--accent, #f50057)"):!g&&i&&n(17,g=i.style.color||i.parentElement.style.color||(se()?"#333":"var(--color, #333)")));},t=exclude_internal_props(t),[x,s,r,a,c,d,u,f,v,h,m,b,w,i,$,o,function(e){b&&(n(0,x=!x),l("change",x));},g,z,l,t,D,k,function(e){binding_callbacks[e?"unshift":"push"](()=>{n(13,i=e);});}]}class xe extends SvelteComponent{constructor(e){var t;super(),document.getElementById("svelte-6bcb3a-style")||((t=element("style")).id="svelte-6bcb3a-style",t.textContent="button.svelte-6bcb3a:disabled{cursor:default}button.svelte-6bcb3a{cursor:pointer;font-family:Roboto, Helvetica, sans-serif;font-family:var(--button-font-family, Roboto, Helvetica, sans-serif);font-size:0.875rem;font-weight:500;letter-spacing:0.75px;text-decoration:none;text-transform:uppercase;will-change:transform, opacity;margin:0;padding:0 16px;display:-ms-inline-flexbox;display:inline-flex;position:relative;align-items:center;justify-content:center;box-sizing:border-box;height:36px;border:none;outline:none;line-height:inherit;user-select:none;overflow:hidden;vertical-align:middle;border-radius:4px}button.svelte-6bcb3a::-moz-focus-inner{border:0}button.svelte-6bcb3a:-moz-focusring{outline:none}button.svelte-6bcb3a:before{box-sizing:inherit;border-radius:inherit;color:inherit;bottom:0;content:'';left:0;opacity:0;pointer-events:none;position:absolute;right:0;top:0;transition:0.2s cubic-bezier(0.25, 0.8, 0.5, 1);will-change:background-color, opacity}.toggle.svelte-6bcb3a:before{box-sizing:content-box}.active.svelte-6bcb3a:before{background-color:currentColor;opacity:0.3}.raised.svelte-6bcb3a{box-shadow:0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),\n\t\t\t0 1px 5px 0 rgba(0, 0, 0, 0.12)}.outlined.svelte-6bcb3a{padding:0 14px;border-style:solid;border-width:2px}.shaped.svelte-6bcb3a{border-radius:18px}.dense.svelte-6bcb3a{height:32px}.icon-button.svelte-6bcb3a{line-height:0.5;border-radius:50%;padding:8px;width:40px;height:40px;vertical-align:middle}.icon-button.outlined.svelte-6bcb3a{padding:6px}.icon-button.fab.svelte-6bcb3a{border:none;width:56px;height:56px;box-shadow:0 3px 5px -1px rgba(0, 0, 0, 0.2), 0 6px 10px 0 rgba(0, 0, 0, 0.14),\n\t\t\t0 1px 18px 0 rgba(0, 0, 0, 0.12)}.icon-button.dense.svelte-6bcb3a{width:36px;height:36px}.icon-button.fab.dense.svelte-6bcb3a{width:40px;height:40px}.outlined.svelte-6bcb3a:not(.shaped) .ripple{border-radius:0 !important}.full-width.svelte-6bcb3a{width:100%}@media(hover: hover){button.svelte-6bcb3a:hover:not(.toggle):not([disabled]):not(.disabled):before{background-color:currentColor;opacity:0.15}button.focus-visible.svelte-6bcb3a:focus:not(.toggle):not([disabled]):not(.disabled):before{background-color:currentColor;opacity:0.3}button.focus-visible.toggle.svelte-6bcb3a:focus:not(.active):not([disabled]):not(.disabled):before{background-color:currentColor;opacity:0.15}}",append(document.head,t)),init(this,e,ye,be,safe_not_equal,{class:1,style:2,icon:3,fab:4,dense:5,raised:6,unelevated:7,outlined:8,shaped:9,color:17,ripple:10,toggle:11,active:0,fullWidth:12});}}function ke(e){let t;const n=e[13].default,l=create_slot(n,e,e[12],null);return {c(){l&&l.c();},m(e,n){l&&l.m(e,n),t=!0;},p(e,t){l&&l.p&&4096&t&&l.p(get_slot_context(n,e,e[12],null),get_slot_changes(n,e[12],t,null));},i(e){t||(transition_in(l,e),t=!0);},o(e){transition_out(l,e),t=!1;},d(e){l&&l.d(e);}}}function De(e){let t,n;return {c(){t=svg_element("svg"),n=svg_element("path"),attr(n,"d",e[1]),attr(t,"xmlns","http://www.w3.org/2000/svg"),attr(t,"viewBox",e[2]),attr(t,"class","svelte-h2unzw");},m(e,l){insert(e,t,l),append(t,n);},p(e,l){2&l&&attr(n,"d",e[1]),4&l&&attr(t,"viewBox",e[2]);},i:noop,o:noop,d(e){e&&detach(t);}}}function Ce(e){let t,n,l,o,i,r;const a=[De,ke],d=[];function p(e,t){return "string"==typeof e[1]?0:1}n=p(e),l=d[n]=a[n](e);let f=[{class:"icon "+e[0]},e[7]],v={};for(let e=0;e<f.length;e+=1)v=assign(v,f[e]);return {c(){t=element("i"),l.c(),set_attributes(t,v),toggle_class(t,"flip",e[3]&&"boolean"==typeof e[3]),toggle_class(t,"flip-h","h"===e[3]),toggle_class(t,"flip-v","v"===e[3]),toggle_class(t,"spin",e[4]),toggle_class(t,"pulse",e[5]&&!e[4]),toggle_class(t,"svelte-h2unzw",!0);},m(l,s){insert(l,t,s),d[n].m(t,null),e[14](t),i=!0,r=action_destroyer(o=e[8].call(null,t));},p(e,[o]){let i=n;n=p(e),n===i?d[n].p(e,o):(group_outros(),transition_out(d[i],1,1,()=>{d[i]=null;}),check_outros(),l=d[n],l||(l=d[n]=a[n](e),l.c()),transition_in(l,1),l.m(t,null)),set_attributes(t,get_spread_update(f,[1&o&&{class:"icon "+e[0]},128&o&&e[7]])),toggle_class(t,"flip",e[3]&&"boolean"==typeof e[3]),toggle_class(t,"flip-h","h"===e[3]),toggle_class(t,"flip-v","v"===e[3]),toggle_class(t,"spin",e[4]),toggle_class(t,"pulse",e[5]&&!e[4]),toggle_class(t,"svelte-h2unzw",!0);},i(e){i||(transition_in(l),i=!0);},o(e){transition_out(l),i=!1;},d(l){l&&detach(t),d[n].d(),e[14](null),r();}}}function Me(e,t,n){const l=ie(current_component);let o,{class:i=""}=t,{path:s=null}=t,{size:r=24}=t,{viewBox:a="0 0 24 24"}=t,{color:c="currentColor"}=t,{flip:d=!1}=t,{spin:u=!1}=t,{pulse:f=!1}=t,v={},{$$slots:h={},$$scope:g}=t;return e.$set=e=>{n(11,t=assign(assign({},t),exclude_internal_props(e))),"class"in e&&n(0,i=e.class),"path"in e&&n(1,s=e.path),"size"in e&&n(9,r=e.size),"viewBox"in e&&n(2,a=e.viewBox),"color"in e&&n(10,c=e.color),"flip"in e&&n(3,d=e.flip),"spin"in e&&n(4,u=e.spin),"pulse"in e&&n(5,f=e.pulse),"$$scope"in e&&n(12,g=e.$$scope);},e.$$.update=()=>{{const{path:e,size:l,viewBox:o,color:i,flip:s,spin:r,pulse:a,...c}=t;delete c.class,n(7,v=c);}1600&e.$$.dirty&&o&&(o.firstChild.setAttribute("width",r),o.firstChild.setAttribute("height",r),c&&o.firstChild.setAttribute("fill",c));},t=exclude_internal_props(t),[i,s,a,d,u,f,o,v,l,r,c,t,g,h,function(e){binding_callbacks[e?"unshift":"push"](()=>{n(6,o=e);});}]}class Le extends SvelteComponent{constructor(e){var t;super(),document.getElementById("svelte-h2unzw-style")||((t=element("style")).id="svelte-h2unzw-style",t.textContent=".icon.svelte-h2unzw.svelte-h2unzw{display:inline-block;position:relative;vertical-align:middle;line-height:0.5}.icon.svelte-h2unzw>svg.svelte-h2unzw{display:inline-block}.flip.svelte-h2unzw.svelte-h2unzw{transform:scale(-1, -1)}.flip-h.svelte-h2unzw.svelte-h2unzw{transform:scale(-1, 1)}.flip-v.svelte-h2unzw.svelte-h2unzw{transform:scale(1, -1)}.spin.svelte-h2unzw.svelte-h2unzw{animation:svelte-h2unzw-spin 1s 0s infinite linear}.pulse.svelte-h2unzw.svelte-h2unzw{animation:svelte-h2unzw-spin 1s infinite steps(8)}@keyframes svelte-h2unzw-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}",append(document.head,t)),init(this,e,Me,Ce,safe_not_equal,{class:0,path:1,size:9,viewBox:2,color:10,flip:3,spin:4,pulse:5});}}function Ln(t){let n,l,o,i,a;const d=t[10].default,p=create_slot(d,t,t[9],null);let v=t[1]&&Yn(),h=[{class:"menu-item "+t[0]},{tabindex:t[2]?"-1":"0"},t[4]],b={};for(let e=0;e<h.length;e+=1)b=assign(b,h[e]);return {c(){n=element("li"),p&&p.c(),l=space(),v&&v.c(),set_attributes(n,b),toggle_class(n,"svelte-mmrniu",!0);},m(s,d){insert(s,n,d),p&&p.m(n,null),append(n,l),v&&v.m(n,null),t[12](n),i=!0,a=[listen(n,"keydown",t[7]),action_destroyer(o=t[6].call(null,n))];},p(e,t){p&&p.p&&512&t&&p.p(get_slot_context(d,e,e[9],null),get_slot_changes(d,e[9],t,null)),e[1]?v?transition_in(v,1):(v=Yn(),v.c(),transition_in(v,1),v.m(n,null)):v&&(group_outros(),transition_out(v,1,1,()=>{v=null;}),check_outros()),set_attributes(n,get_spread_update(h,[1&t&&{class:"menu-item "+e[0]},4&t&&{tabindex:e[2]?"-1":"0"},16&t&&e[4]])),toggle_class(n,"svelte-mmrniu",!0);},i(e){i||(transition_in(p,e),transition_in(v),i=!0);},o(e){transition_out(p,e),transition_out(v),i=!1;},d(e){e&&detach(n),p&&p.d(e),v&&v.d(),t[12](null),run_all(a);}}}function En(t){let n,l,o,i,d,p;const v=t[10].default,h=create_slot(v,t,t[9],null);let b=t[1]&&jn(),Y=[{class:"menu-item "+t[0]},{href:t[3]},{tabindex:t[2]?"-1":"0"},t[4]],j={};for(let e=0;e<Y.length;e+=1)j=assign(j,Y[e]);return {c(){n=element("li"),l=element("a"),h&&h.c(),o=space(),b&&b.c(),set_attributes(l,j),toggle_class(l,"svelte-mmrniu",!0),attr(n,"class","svelte-mmrniu");},m(s,a){insert(s,n,a),append(n,l),h&&h.m(l,null),append(l,o),b&&b.m(l,null),t[11](l),d=!0,p=[listen(l,"keydown",t[7]),action_destroyer(i=t[6].call(null,l))];},p(e,t){h&&h.p&&512&t&&h.p(get_slot_context(v,e,e[9],null),get_slot_changes(v,e[9],t,null)),e[1]?b?transition_in(b,1):(b=jn(),b.c(),transition_in(b,1),b.m(l,null)):b&&(group_outros(),transition_out(b,1,1,()=>{b=null;}),check_outros()),set_attributes(l,get_spread_update(Y,[1&t&&{class:"menu-item "+e[0]},8&t&&{href:e[3]},4&t&&{tabindex:e[2]?"-1":"0"},16&t&&e[4]])),toggle_class(l,"svelte-mmrniu",!0);},i(e){d||(transition_in(h,e),transition_in(b),d=!0);},o(e){transition_out(h,e),transition_out(b),d=!1;},d(e){e&&detach(n),h&&h.d(e),b&&b.d(),t[11](null),run_all(p);}}}function Yn(e){let t;const n=new ge({});return {c(){create_component(n.$$.fragment);},m(e,l){mount_component(n,e,l),t=!0;},i(e){t||(transition_in(n.$$.fragment,e),t=!0);},o(e){transition_out(n.$$.fragment,e),t=!1;},d(e){destroy_component(n,e);}}}function jn(e){let t;const n=new ge({});return {c(){create_component(n.$$.fragment);},m(e,l){mount_component(n,e,l),t=!0;},i(e){t||(transition_in(n.$$.fragment,e),t=!0);},o(e){transition_out(n.$$.fragment,e),t=!1;},d(e){destroy_component(n,e);}}}function An(e){let t,n,l,o;const i=[En,Ln],s=[];function r(e,t){return e[3]?0:1}return t=r(e),n=s[t]=i[t](e),{c(){n.c(),l=empty();},m(e,n){s[t].m(e,n),insert(e,l,n),o=!0;},p(e,[o]){let a=t;t=r(e),t===a?s[t].p(e,o):(group_outros(),transition_out(s[a],1,1,()=>{s[a]=null;}),check_outros(),n=s[t],n||(n=s[t]=i[t](e),n.c()),transition_in(n,1),n.m(l.parentNode,l));},i(e){o||(transition_in(n),o=!0);},o(e){transition_out(n),o=!1;},d(e){s[t].d(e),e&&detach(l);}}}function Tn(e,t,n){const l=ie(current_component);let o,{class:i=""}=t,{ripple:s=!0}=t,r=!1,a=null,c={};let{$$slots:d={},$$scope:u}=t;return e.$set=e=>{n(8,t=assign(assign({},t),exclude_internal_props(e))),"class"in e&&n(0,i=e.class),"ripple"in e&&n(1,s=e.ripple),"$$scope"in e&&n(9,u=e.$$scope);},e.$$.update=()=>{{const{href:e,ripple:l,...o}=t;delete o.class,!1===o.disabled&&delete o.disabled,n(2,r=!!o.disabled),n(3,a=e&&!r?e:null),n(4,c=o);}},t=exclude_internal_props(t),[i,s,r,a,c,o,l,function(e){if(13===e.keyCode||32===e.keyCode){e.stopPropagation(),e.preventDefault();const t=new MouseEvent("click",{bubbles:!0,cancelable:!0});o.dispatchEvent(t),o.blur();}},t,u,d,function(e){binding_callbacks[e?"unshift":"push"](()=>{n(5,o=e);});},function(e){binding_callbacks[e?"unshift":"push"](()=>{n(5,o=e);});}]}class Nn extends SvelteComponent{constructor(e){var t;super(),document.getElementById("svelte-mmrniu-style")||((t=element("style")).id="svelte-mmrniu-style",t.textContent="li.svelte-mmrniu{display:block}a.svelte-mmrniu,a.svelte-mmrniu:hover{text-decoration:none}.menu-item.svelte-mmrniu{position:relative;color:inherit;cursor:pointer;height:44px;user-select:none;display:flex;align-items:center;padding:0 16px;white-space:nowrap}.menu-item.svelte-mmrniu:focus{outline:none}.menu-item.svelte-mmrniu::-moz-focus-inner{border:0}.menu-item.svelte-mmrniu:-moz-focusring{outline:none}.menu-item.svelte-mmrniu:before{background-color:currentColor;color:inherit;bottom:0;content:'';left:0;opacity:0;pointer-events:none;position:absolute;right:0;top:0;transition:0.3s cubic-bezier(0.25, 0.8, 0.5, 1)}@media(hover: hover){.menu-item.svelte-mmrniu:hover:not([disabled]):not(.disabled):before{opacity:0.15}.focus-visible.menu-item:focus:not([disabled]):not(.disabled):before{opacity:0.3}}",append(document.head,t)),init(this,e,Tn,An,safe_not_equal,{class:0,ripple:1});}}

/* src/comp/Dashboard/MenuButton.svelte generated by Svelte v3.21.0 */
const file$1 = "src/comp/Dashboard/MenuButton.svelte";

function create_fragment$1(ctx) {
	let x_menu_button;
	let t;
	let current;
	let dispose;
	const menu = new Menu({ $$inline: true });
	const ripple = new ge({ $$inline: true });

	const block = {
		c: function create() {
			x_menu_button = element("x-menu-button");
			create_component(menu.$$.fragment);
			t = space();
			create_component(ripple.$$.fragment);
			set_custom_element_data(x_menu_button, "class", "svelte-1beq3m4");
			toggle_class(x_menu_button, "hidden", /*hidden*/ ctx[2]);
			toggle_class(x_menu_button, "btn-light", /*light*/ ctx[0]);
			toggle_class(x_menu_button, "btn-dark", /*dark*/ ctx[1]);
			add_location(x_menu_button, file$1, 29, 0, 572);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor, remount) {
			insert_dev(target, x_menu_button, anchor);
			mount_component(menu, x_menu_button, null);
			append_dev(x_menu_button, t);
			mount_component(ripple, x_menu_button, null);
			current = true;
			if (remount) dispose();
			dispose = listen_dev(x_menu_button, "click", /*toggleDrawer*/ ctx[3], false, false, false);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*hidden*/ 4) {
				toggle_class(x_menu_button, "hidden", /*hidden*/ ctx[2]);
			}

			if (dirty & /*light*/ 1) {
				toggle_class(x_menu_button, "btn-light", /*light*/ ctx[0]);
			}

			if (dirty & /*dark*/ 2) {
				toggle_class(x_menu_button, "btn-dark", /*dark*/ ctx[1]);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(menu.$$.fragment, local);
			transition_in(ripple.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(menu.$$.fragment, local);
			transition_out(ripple.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(x_menu_button);
			destroy_component(menu);
			destroy_component(ripple);
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$1.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$1($$self, $$props, $$invalidate) {
	const { toggleDrawer } = getContext("dash");
	let { light } = $$props;
	let { dark } = $$props;
	let { hidden } = $$props;
	const writable_props = ["light", "dark", "hidden"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<MenuButton> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("MenuButton", $$slots, []);

	$$self.$set = $$props => {
		if ("light" in $$props) $$invalidate(0, light = $$props.light);
		if ("dark" in $$props) $$invalidate(1, dark = $$props.dark);
		if ("hidden" in $$props) $$invalidate(2, hidden = $$props.hidden);
	};

	$$self.$capture_state = () => ({
		getContext,
		Menu,
		Ripple: ge,
		toggleDrawer,
		light,
		dark,
		hidden
	});

	$$self.$inject_state = $$props => {
		if ("light" in $$props) $$invalidate(0, light = $$props.light);
		if ("dark" in $$props) $$invalidate(1, dark = $$props.dark);
		if ("hidden" in $$props) $$invalidate(2, hidden = $$props.hidden);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [light, dark, hidden, toggleDrawer];
}

class MenuButton extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$1, create_fragment$1, safe_not_equal, { light: 0, dark: 1, hidden: 2 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "MenuButton",
			options,
			id: create_fragment$1.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*light*/ ctx[0] === undefined && !("light" in props)) {
			console.warn("<MenuButton> was created without expected prop 'light'");
		}

		if (/*dark*/ ctx[1] === undefined && !("dark" in props)) {
			console.warn("<MenuButton> was created without expected prop 'dark'");
		}

		if (/*hidden*/ ctx[2] === undefined && !("hidden" in props)) {
			console.warn("<MenuButton> was created without expected prop 'hidden'");
		}
	}

	get light() {
		throw new Error("<MenuButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set light(value) {
		throw new Error("<MenuButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get dark() {
		throw new Error("<MenuButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set dark(value) {
		throw new Error("<MenuButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get hidden() {
		throw new Error("<MenuButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set hidden(value) {
		throw new Error("<MenuButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

// Thanks to @AlexxNB

function getEventsAction(component) {
	return (node) => {
		const events = Object.keys(component.$$.callbacks);
		const listeners = [];

		events.forEach((event) => listeners.push(listen(node, event, (e) => bubble(component, e))));

		return {
			destroy: () => {
				listeners.forEach((listener) => listener());
			},
		};
	};
}

function getFocusable(context = document) {
	const focusable = Array.prototype.slice
		.call(
			context.querySelectorAll(
				'button, [href], select, textarea, input:not([type="hidden"]), [tabindex]:not([tabindex="-1"])'
			)
		)
		.filter(function(item) {
			const style = window.getComputedStyle(item);

			return (
				!item.disabled &&
				!item.getAttribute('disabled') &&
				!item.classList.contains('disabled') &&
				style.display !== 'none' &&
				style.visibility !== 'hidden' &&
				style.opacity > 0
			);
		});

	return focusable;
}

function trapTabKey(e, context) {
	if (e.key !== 'Tab' && e.keyCode !== 9) {
		return;
	}

	let focusableItems = getFocusable(context);

	if (focusableItems.length === 0) {
		e.preventDefault();
		return;
	}

	let focusedItem = document.activeElement;

	let focusedItemIndex = focusableItems.indexOf(focusedItem);

	if (e.shiftKey) {
		if (focusedItemIndex <= 0) {
			focusableItems[focusableItems.length - 1].focus();
			e.preventDefault();
		}
	} else {
		if (focusedItemIndex >= focusableItems.length - 1) {
			focusableItems[0].focus();
			e.preventDefault();
		}
	}
}

/* node_modules/svelte-mui/src/Popover.svelte generated by Svelte v3.21.0 */

const { window: window_1 } = globals;
const file$2 = "node_modules/svelte-mui/src/Popover.svelte";

// (8:0) {#if visible}
function create_if_block(ctx) {
	let div;
	let div_class_value;
	let events_action;
	let div_intro;
	let div_outro;
	let current;
	let dispose;
	const default_slot_template = /*$$slots*/ ctx[23].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[22], null);

	const block = {
		c: function create() {
			div = element("div");
			if (default_slot) default_slot.c();
			attr_dev(div, "class", div_class_value = "" + (null_to_empty("popover " + /*className*/ ctx[1]) + " svelte-5k22n0"));
			attr_dev(div, "style", /*style*/ ctx[2]);
			attr_dev(div, "tabindex", "-1");
			add_location(div, file$2, 8, 1, 161);
		},
		m: function mount(target, anchor, remount) {
			insert_dev(target, div, anchor);

			if (default_slot) {
				default_slot.m(div, null);
			}

			/*div_binding*/ ctx[26](div);
			current = true;
			if (remount) run_all(dispose);

			dispose = [
				listen_dev(div, "introstart", /*introstart_handler*/ ctx[24], false, false, false),
				listen_dev(div, "introend", /*introend_handler*/ ctx[25], false, false, false),
				action_destroyer(events_action = /*events*/ ctx[4].call(null, div))
			];
		},
		p: function update(ctx, dirty) {
			if (default_slot) {
				if (default_slot.p && dirty & /*$$scope*/ 4194304) {
					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[22], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[22], dirty, null));
				}
			}

			if (!current || dirty & /*className*/ 2 && div_class_value !== (div_class_value = "" + (null_to_empty("popover " + /*className*/ ctx[1]) + " svelte-5k22n0"))) {
				attr_dev(div, "class", div_class_value);
			}

			if (!current || dirty & /*style*/ 4) {
				attr_dev(div, "style", /*style*/ ctx[2]);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);

			add_render_callback(() => {
				if (div_outro) div_outro.end(1);
				if (!div_intro) div_intro = create_in_transition(div, /*popoverIn*/ ctx[5], {});
				div_intro.start();
			});

			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			if (div_intro) div_intro.invalidate();
			div_outro = create_out_transition(div, /*popoverOut*/ ctx[6], {});
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (default_slot) default_slot.d(detaching);
			/*div_binding*/ ctx[26](null);
			if (detaching && div_outro) div_outro.end();
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block.name,
		type: "if",
		source: "(8:0) {#if visible}",
		ctx
	});

	return block;
}

function create_fragment$2(ctx) {
	let if_block_anchor;
	let current;
	let dispose;
	let if_block = /*visible*/ ctx[0] && create_if_block(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor, remount) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
			if (remount) run_all(dispose);

			dispose = [
				listen_dev(window_1, "scroll", /*onScroll*/ ctx[8], { passive: true }, false, false),
				listen_dev(window_1, "resize", /*onResize*/ ctx[9], { passive: true }, false, false),
				listen_dev(window_1, "keydown", /*onKeydown*/ ctx[10], true, false, false),
				listen_dev(window_1, "click", /*onclickOutside*/ ctx[11], true, false, false)
			];
		},
		p: function update(ctx, [dirty]) {
			if (/*visible*/ ctx[0]) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*visible*/ 1) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$2.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

const MARGIN = 8;

function iend({ target }) {
	target.style.transformOrigin = null;
	target.style.transitionDuration = null;
	target.style.transitionProperty = null;
	target.style.transform = null;

	// grab focus
	target.focus();
}

function instance$2($$self, $$props, $$invalidate) {
	const events = getEventsAction(current_component);
	const dispatch = createEventDispatcher();
	let { class: className = "" } = $$props;
	let { style = null } = $$props;
	let { origin = "top left" } = $$props;
	let { dx = 0 } = $$props;
	let { dy = 0 } = $$props;
	let { visible = false } = $$props;
	let { duration = 300 } = $$props;
	let popoverEl;
	let triggerEl;

	function popoverIn(target) {
		target.style.transformOrigin = origin;
		target.style.transform = "scale(0.6)";
		target.style.opacity = "0";
		return { duration: +duration };
	}

	function popoverOut(target) {
		target.style.transformOrigin = origin;
		target.style.transitionDuration = duration + "ms";
		target.style.transitionProperty = "opacity, transform";
		target.style.transform = "scale(0.6)";
		target.style.opacity = "0";
		return { duration: +duration };
	}

	async function istart({ target }) {
		setTimeout(
			() => {
				target.style.transitionDuration = duration + "ms";
				target.style.transitionProperty = "opacity, transform";
				target.style.transform = "scale(1)";
				target.style.opacity = null;
			},
			0
		);
	}

	function getLeftPosition(width, rc) {
		let left = 0;
		$$invalidate(12, dx = +dx);
		const maxLeft = window.innerWidth - MARGIN - width;
		const minLeft = MARGIN;

		left = origin.indexOf("left") >= 0
		? left = rc.left + dx
		: left = rc.left + rc.width - width - dx;

		left = Math.min(maxLeft, left);
		left = Math.max(minLeft, left);
		return left;
	}

	function getTopPosition(height, rc) {
		let top = 0;
		$$invalidate(13, dy = +dy);
		const maxTop = window.innerHeight - MARGIN - height;
		const minTop = MARGIN;

		top = origin.indexOf("top") >= 0
		? top = rc.top + dy
		: top = rc.top + rc.height - height - dy;

		top = Math.min(maxTop, top);
		top = Math.max(minTop, top);
		return top;
	}

	function setStyle() {
		if (!visible || !popoverEl || !triggerEl) return;
		const rect = triggerEl.getBoundingClientRect();

		if (rect.top < -rect.height || rect.top > window.innerHeight) {
			close("overflow");
			return;
		}

		$$invalidate(3, popoverEl.style.top = getTopPosition(popoverEl.offsetHeight, rect) + "px", popoverEl);
		$$invalidate(3, popoverEl.style.left = getLeftPosition(popoverEl.offsetWidth, rect) + "px", popoverEl);
	}

	beforeUpdate(() => {
		triggerEl = popoverEl ? popoverEl.parentElement : null;
		triggerEl && setStyle();
	});

	function close(params) {
		dispatch("close", params);
		$$invalidate(0, visible = false);
	}

	// window event handlers
	function onScroll() {
		setStyle();
	}

	function onResize() {
		setStyle();
	}

	function onKeydown(e) {
		if (visible) {
			if (e.keyCode === 27) {
				e.stopPropagation();
				close("escape");
			}

			trapTabKey(e, popoverEl);
		}
	}

	function onclickOutside(e) {
		if (visible && triggerEl && !triggerEl.contains(e.target)) {
			e.stopPropagation();
			close("clickOutside");
		}
	}

	const writable_props = ["class", "style", "origin", "dx", "dy", "visible", "duration"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Popover> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("Popover", $$slots, ['default']);
	const introstart_handler = e => istart(e);
	const introend_handler = e => iend(e);

	function div_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			$$invalidate(3, popoverEl = $$value);
		});
	}

	$$self.$set = $$props => {
		if ("class" in $$props) $$invalidate(1, className = $$props.class);
		if ("style" in $$props) $$invalidate(2, style = $$props.style);
		if ("origin" in $$props) $$invalidate(14, origin = $$props.origin);
		if ("dx" in $$props) $$invalidate(12, dx = $$props.dx);
		if ("dy" in $$props) $$invalidate(13, dy = $$props.dy);
		if ("visible" in $$props) $$invalidate(0, visible = $$props.visible);
		if ("duration" in $$props) $$invalidate(15, duration = $$props.duration);
		if ("$$scope" in $$props) $$invalidate(22, $$scope = $$props.$$scope);
	};

	$$self.$capture_state = () => ({
		current_component,
		beforeUpdate,
		createEventDispatcher,
		getEventsAction,
		trapTabKey,
		events,
		dispatch,
		className,
		style,
		origin,
		dx,
		dy,
		visible,
		duration,
		popoverEl,
		triggerEl,
		MARGIN,
		popoverIn,
		popoverOut,
		istart,
		iend,
		getLeftPosition,
		getTopPosition,
		setStyle,
		close,
		onScroll,
		onResize,
		onKeydown,
		onclickOutside
	});

	$$self.$inject_state = $$props => {
		if ("className" in $$props) $$invalidate(1, className = $$props.className);
		if ("style" in $$props) $$invalidate(2, style = $$props.style);
		if ("origin" in $$props) $$invalidate(14, origin = $$props.origin);
		if ("dx" in $$props) $$invalidate(12, dx = $$props.dx);
		if ("dy" in $$props) $$invalidate(13, dy = $$props.dy);
		if ("visible" in $$props) $$invalidate(0, visible = $$props.visible);
		if ("duration" in $$props) $$invalidate(15, duration = $$props.duration);
		if ("popoverEl" in $$props) $$invalidate(3, popoverEl = $$props.popoverEl);
		if ("triggerEl" in $$props) triggerEl = $$props.triggerEl;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		visible,
		className,
		style,
		popoverEl,
		events,
		popoverIn,
		popoverOut,
		istart,
		onScroll,
		onResize,
		onKeydown,
		onclickOutside,
		dx,
		dy,
		origin,
		duration,
		triggerEl,
		dispatch,
		getLeftPosition,
		getTopPosition,
		setStyle,
		close,
		$$scope,
		$$slots,
		introstart_handler,
		introend_handler,
		div_binding
	];
}

class Popover extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
			class: 1,
			style: 2,
			origin: 14,
			dx: 12,
			dy: 13,
			visible: 0,
			duration: 15
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Popover",
			options,
			id: create_fragment$2.name
		});
	}

	get class() {
		throw new Error("<Popover>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set class(value) {
		throw new Error("<Popover>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get style() {
		throw new Error("<Popover>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set style(value) {
		throw new Error("<Popover>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get origin() {
		throw new Error("<Popover>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set origin(value) {
		throw new Error("<Popover>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get dx() {
		throw new Error("<Popover>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set dx(value) {
		throw new Error("<Popover>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get dy() {
		throw new Error("<Popover>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set dy(value) {
		throw new Error("<Popover>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get visible() {
		throw new Error("<Popover>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set visible(value) {
		throw new Error("<Popover>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get duration() {
		throw new Error("<Popover>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set duration(value) {
		throw new Error("<Popover>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules/svelte-mui/src/Menu.svelte generated by Svelte v3.21.0 */

const { console: console_1 } = globals;
const file$3 = "node_modules/svelte-mui/src/Menu.svelte";
const get_activator_slot_changes = dirty => ({});
const get_activator_slot_context = ctx => ({});

// (2:24)    
function fallback_block(ctx) {
	let span;

	const block = {
		c: function create() {
			span = element("span");
			add_location(span, file$3, 2, 2, 104);
		},
		m: function mount(target, anchor) {
			insert_dev(target, span, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(span);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: fallback_block.name,
		type: "fallback",
		source: "(2:24)    ",
		ctx
	});

	return block;
}

// (6:1) <Popover class={className} {style} {origin} {dx} {dy} bind:visible on:click={onPopoverClick}>
function create_default_slot(ctx) {
	let ul;
	let ul_style_value;
	let current;
	const default_slot_template = /*$$slots*/ ctx[11].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[14], null);

	const block = {
		c: function create() {
			ul = element("ul");
			if (default_slot) default_slot.c();
			attr_dev(ul, "style", ul_style_value = `min-width: ${/*width*/ ctx[5]}px`);
			attr_dev(ul, "class", "svelte-1vc5q8h");
			add_location(ul, file$3, 6, 2, 220);
		},
		m: function mount(target, anchor) {
			insert_dev(target, ul, anchor);

			if (default_slot) {
				default_slot.m(ul, null);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (default_slot) {
				if (default_slot.p && dirty & /*$$scope*/ 16384) {
					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[14], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[14], dirty, null));
				}
			}

			if (!current || dirty & /*width*/ 32 && ul_style_value !== (ul_style_value = `min-width: ${/*width*/ ctx[5]}px`)) {
				attr_dev(ul, "style", ul_style_value);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(ul);
			if (default_slot) default_slot.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot.name,
		type: "slot",
		source: "(6:1) <Popover class={className} {style} {origin} {dx} {dy} bind:visible on:click={onPopoverClick}>",
		ctx
	});

	return block;
}

function create_fragment$3(ctx) {
	let div;
	let t;
	let updating_visible;
	let events_action;
	let current;
	let dispose;
	const activator_slot_template = /*$$slots*/ ctx[11].activator;
	const activator_slot = create_slot(activator_slot_template, ctx, /*$$scope*/ ctx[14], get_activator_slot_context);
	const activator_slot_or_fallback = activator_slot || fallback_block(ctx);

	function popover_visible_binding(value) {
		/*popover_visible_binding*/ ctx[12].call(null, value);
	}

	let popover_props = {
		class: /*className*/ ctx[0],
		style: /*style*/ ctx[1],
		origin: /*origin*/ ctx[4],
		dx: /*dx*/ ctx[2],
		dy: /*dy*/ ctx[3],
		$$slots: { default: [create_default_slot] },
		$$scope: { ctx }
	};

	if (/*visible*/ ctx[6] !== void 0) {
		popover_props.visible = /*visible*/ ctx[6];
	}

	const popover = new Popover({ props: popover_props, $$inline: true });
	binding_callbacks.push(() => bind(popover, "visible", popover_visible_binding));
	popover.$on("click", /*onPopoverClick*/ ctx[10]);

	const block = {
		c: function create() {
			div = element("div");
			if (activator_slot_or_fallback) activator_slot_or_fallback.c();
			t = space();
			create_component(popover.$$.fragment);
			attr_dev(div, "class", "menu svelte-1vc5q8h");
			add_location(div, file$3, 0, 0, 0);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor, remount) {
			insert_dev(target, div, anchor);

			if (activator_slot_or_fallback) {
				activator_slot_or_fallback.m(div, null);
			}

			append_dev(div, t);
			mount_component(popover, div, null);
			/*div_binding*/ ctx[13](div);
			current = true;
			if (remount) run_all(dispose);

			dispose = [
				listen_dev(div, "click", /*onActivatorClick*/ ctx[9], false, false, false),
				action_destroyer(events_action = /*events*/ ctx[8].call(null, div))
			];
		},
		p: function update(ctx, [dirty]) {
			if (activator_slot) {
				if (activator_slot.p && dirty & /*$$scope*/ 16384) {
					activator_slot.p(get_slot_context(activator_slot_template, ctx, /*$$scope*/ ctx[14], get_activator_slot_context), get_slot_changes(activator_slot_template, /*$$scope*/ ctx[14], dirty, get_activator_slot_changes));
				}
			}

			const popover_changes = {};
			if (dirty & /*className*/ 1) popover_changes.class = /*className*/ ctx[0];
			if (dirty & /*style*/ 2) popover_changes.style = /*style*/ ctx[1];
			if (dirty & /*origin*/ 16) popover_changes.origin = /*origin*/ ctx[4];
			if (dirty & /*dx*/ 4) popover_changes.dx = /*dx*/ ctx[2];
			if (dirty & /*dy*/ 8) popover_changes.dy = /*dy*/ ctx[3];

			if (dirty & /*$$scope, width*/ 16416) {
				popover_changes.$$scope = { dirty, ctx };
			}

			if (!updating_visible && dirty & /*visible*/ 64) {
				updating_visible = true;
				popover_changes.visible = /*visible*/ ctx[6];
				add_flush_callback(() => updating_visible = false);
			}

			popover.$set(popover_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(activator_slot_or_fallback, local);
			transition_in(popover.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(activator_slot_or_fallback, local);
			transition_out(popover.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (activator_slot_or_fallback) activator_slot_or_fallback.d(detaching);
			destroy_component(popover);
			/*div_binding*/ ctx[13](null);
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$3.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$3($$self, $$props, $$invalidate) {
	const events = getEventsAction(current_component);
	let { class: className = "" } = $$props;
	let { style = null } = $$props;
	let { dx = 0 } = $$props;
	let { dy = 0 } = $$props;
	let { origin = "top left" } = $$props; // 'bottom left', 'bottom right', 'top left', 'top right'
	let { width = 2 * 56 } = $$props;
	let visible = false;
	let menuEl;

	function onActivatorClick(e) {
		try {
			let triggerEl = menuEl.childNodes[0];

			if (triggerEl.contains(e.target)) {
				$$invalidate(6, visible = !visible);
			} else if (e.target === menuEl) {
				$$invalidate(6, visible = false);
			}
		} catch(err) {
			console.error(err);
		}
	}

	function onPopoverClick(e) {
		if (e.target.classList.contains("menu-item")) {
			$$invalidate(6, visible = false);
		}
	}

	const writable_props = ["class", "style", "dx", "dy", "origin", "width"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Menu> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("Menu", $$slots, ['activator','default']);

	function popover_visible_binding(value) {
		visible = value;
		$$invalidate(6, visible);
	}

	function div_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			$$invalidate(7, menuEl = $$value);
		});
	}

	$$self.$set = $$props => {
		if ("class" in $$props) $$invalidate(0, className = $$props.class);
		if ("style" in $$props) $$invalidate(1, style = $$props.style);
		if ("dx" in $$props) $$invalidate(2, dx = $$props.dx);
		if ("dy" in $$props) $$invalidate(3, dy = $$props.dy);
		if ("origin" in $$props) $$invalidate(4, origin = $$props.origin);
		if ("width" in $$props) $$invalidate(5, width = $$props.width);
		if ("$$scope" in $$props) $$invalidate(14, $$scope = $$props.$$scope);
	};

	$$self.$capture_state = () => ({
		current_component,
		getEventsAction,
		Popover,
		events,
		className,
		style,
		dx,
		dy,
		origin,
		width,
		visible,
		menuEl,
		onActivatorClick,
		onPopoverClick
	});

	$$self.$inject_state = $$props => {
		if ("className" in $$props) $$invalidate(0, className = $$props.className);
		if ("style" in $$props) $$invalidate(1, style = $$props.style);
		if ("dx" in $$props) $$invalidate(2, dx = $$props.dx);
		if ("dy" in $$props) $$invalidate(3, dy = $$props.dy);
		if ("origin" in $$props) $$invalidate(4, origin = $$props.origin);
		if ("width" in $$props) $$invalidate(5, width = $$props.width);
		if ("visible" in $$props) $$invalidate(6, visible = $$props.visible);
		if ("menuEl" in $$props) $$invalidate(7, menuEl = $$props.menuEl);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		className,
		style,
		dx,
		dy,
		origin,
		width,
		visible,
		menuEl,
		events,
		onActivatorClick,
		onPopoverClick,
		$$slots,
		popover_visible_binding,
		div_binding,
		$$scope
	];
}

class Menu$1 extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
			class: 0,
			style: 1,
			dx: 2,
			dy: 3,
			origin: 4,
			width: 5
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Menu",
			options,
			id: create_fragment$3.name
		});
	}

	get class() {
		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set class(value) {
		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get style() {
		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set style(value) {
		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get dx() {
		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set dx(value) {
		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get dy() {
		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set dy(value) {
		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get origin() {
		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set origin(value) {
		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get width() {
		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set width(value) {
		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src/comp/Dashboard/AccountButton.svelte generated by Svelte v3.21.0 */
const file$4 = "src/comp/Dashboard/AccountButton.svelte";

// (27:4) <Button color="#fff">
function create_default_slot_2(ctx) {
	let t_value = /*user*/ ctx[0].address + "";
	let t;

	const block = {
		c: function create() {
			t = text(t_value);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*user*/ 1 && t_value !== (t_value = /*user*/ ctx[0].address + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_2.name,
		type: "slot",
		source: "(27:4) <Button color=\\\"#fff\\\">",
		ctx
	});

	return block;
}

// (26:2) <div slot="activator" class="account-button">
function create_activator_slot(ctx) {
	let div;
	let current;

	const button = new xe({
			props: {
				color: "#fff",
				$$slots: { default: [create_default_slot_2] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			div = element("div");
			create_component(button.$$.fragment);
			attr_dev(div, "slot", "activator");
			attr_dev(div, "class", "account-button svelte-9npyec");
			add_location(div, file$4, 25, 2, 618);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			mount_component(button, div, null);
			current = true;
		},
		p: function update(ctx, dirty) {
			const button_changes = {};

			if (dirty & /*$$scope, user*/ 33) {
				button_changes.$$scope = { dirty, ctx };
			}

			button.$set(button_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(button.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(button.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_component(button);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_activator_slot.name,
		type: "slot",
		source: "(26:2) <div slot=\\\"activator\\\" class=\\\"account-button\\\">",
		ctx
	});

	return block;
}

// (30:2) <Menuitem on:click={() => location.replace("/logout")}>
function create_default_slot_1(ctx) {
	let t_value = /*locale*/ ctx[1].logout + "";
	let t;

	const block = {
		c: function create() {
			t = text(t_value);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*locale*/ 2 && t_value !== (t_value = /*locale*/ ctx[1].logout + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_1.name,
		type: "slot",
		source: "(30:2) <Menuitem on:click={() => location.replace(\\\"/logout\\\")}>",
		ctx
	});

	return block;
}

// (25:0) <Menu origin="top right" dy={40}>
function create_default_slot$1(ctx) {
	let t;
	let current;

	const menuitem = new Nn({
			props: {
				$$slots: { default: [create_default_slot_1] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	menuitem.$on("click", /*click_handler*/ ctx[4]);

	const block = {
		c: function create() {
			t = space();
			create_component(menuitem.$$.fragment);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
			mount_component(menuitem, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const menuitem_changes = {};

			if (dirty & /*$$scope, locale*/ 34) {
				menuitem_changes.$$scope = { dirty, ctx };
			}

			menuitem.$set(menuitem_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(menuitem.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(menuitem.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
			destroy_component(menuitem, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$1.name,
		type: "slot",
		source: "(25:0) <Menu origin=\\\"top right\\\" dy={40}>",
		ctx
	});

	return block;
}

function create_fragment$4(ctx) {
	let current;

	const menu = new Menu$1({
			props: {
				origin: "top right",
				dy: 40,
				$$slots: {
					default: [create_default_slot$1],
					activator: [create_activator_slot]
				},
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(menu.$$.fragment);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			mount_component(menu, target, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const menu_changes = {};

			if (dirty & /*$$scope, locale, user*/ 35) {
				menu_changes.$$scope = { dirty, ctx };
			}

			menu.$set(menu_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(menu.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(menu.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(menu, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$4.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$4($$self, $$props, $$invalidate) {
	let $l;
	let { user } = $$props;
	const { locale: l } = getContext("app");
	validate_store(l, "l");
	component_subscribe($$self, l, value => $$invalidate(3, $l = value));
	let { locale = $l.accountButton } = $$props;
	const writable_props = ["user", "locale"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<AccountButton> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("AccountButton", $$slots, []);
	const click_handler = () => location.replace("/logout");

	$$self.$set = $$props => {
		if ("user" in $$props) $$invalidate(0, user = $$props.user);
		if ("locale" in $$props) $$invalidate(1, locale = $$props.locale);
	};

	$$self.$capture_state = () => ({
		Button: xe,
		Menuitem: Nn,
		Menu: Menu$1,
		user,
		getContext,
		l,
		locale,
		$l
	});

	$$self.$inject_state = $$props => {
		if ("user" in $$props) $$invalidate(0, user = $$props.user);
		if ("locale" in $$props) $$invalidate(1, locale = $$props.locale);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [user, locale, l, $l, click_handler];
}

class AccountButton extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$4, create_fragment$4, safe_not_equal, { user: 0, locale: 1 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "AccountButton",
			options,
			id: create_fragment$4.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*user*/ ctx[0] === undefined && !("user" in props)) {
			console.warn("<AccountButton> was created without expected prop 'user'");
		}
	}

	get user() {
		throw new Error("<AccountButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set user(value) {
		throw new Error("<AccountButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get locale() {
		throw new Error("<AccountButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set locale(value) {
		throw new Error("<AccountButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules/svelte-material-icons/Close.svelte generated by Svelte v3.21.0 */

const file$5 = "node_modules/svelte-material-icons/Close.svelte";

function create_fragment$5(ctx) {
	let svg;
	let path;

	const block = {
		c: function create() {
			svg = svg_element("svg");
			path = svg_element("path");
			attr_dev(path, "d", "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z");
			attr_dev(path, "fill", /*color*/ ctx[2]);
			add_location(path, file$5, 8, 59, 234);
			attr_dev(svg, "width", /*width*/ ctx[0]);
			attr_dev(svg, "height", /*height*/ ctx[1]);
			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			add_location(svg, file$5, 8, 0, 175);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, svg, anchor);
			append_dev(svg, path);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*color*/ 4) {
				attr_dev(path, "fill", /*color*/ ctx[2]);
			}

			if (dirty & /*width*/ 1) {
				attr_dev(svg, "width", /*width*/ ctx[0]);
			}

			if (dirty & /*height*/ 2) {
				attr_dev(svg, "height", /*height*/ ctx[1]);
			}

			if (dirty & /*viewBox*/ 8) {
				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(svg);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$5.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$5($$self, $$props, $$invalidate) {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	const writable_props = ["size", "width", "height", "color", "viewBox"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Close> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("Close", $$slots, []);

	$$self.$set = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

	$$self.$inject_state = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [width, height, color, viewBox, size];
}

class Close extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
			size: 4,
			width: 0,
			height: 1,
			color: 2,
			viewBox: 3
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Close",
			options,
			id: create_fragment$5.name
		});
	}

	get size() {
		throw new Error("<Close>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set size(value) {
		throw new Error("<Close>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get width() {
		throw new Error("<Close>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set width(value) {
		throw new Error("<Close>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get height() {
		throw new Error("<Close>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set height(value) {
		throw new Error("<Close>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get color() {
		throw new Error("<Close>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set color(value) {
		throw new Error("<Close>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get viewBox() {
		throw new Error("<Close>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set viewBox(value) {
		throw new Error("<Close>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src/comp/Dashboard/Topbar.svelte generated by Svelte v3.21.0 */
const file$6 = "src/comp/Dashboard/Topbar.svelte";

// (40:2) {#if $user}
function create_if_block$1(ctx) {
	let div;
	let current;

	const accountbutton = new AccountButton({
			props: { user: /*$user*/ ctx[1], dark: true },
			$$inline: true
		});

	const block = {
		c: function create() {
			div = element("div");
			create_component(accountbutton.$$.fragment);
			attr_dev(div, "class", "account-button svelte-3e430v");
			add_location(div, file$6, 40, 4, 852);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			mount_component(accountbutton, div, null);
			current = true;
		},
		p: function update(ctx, dirty) {
			const accountbutton_changes = {};
			if (dirty & /*$user*/ 2) accountbutton_changes.user = /*$user*/ ctx[1];
			accountbutton.$set(accountbutton_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(accountbutton.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(accountbutton.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_component(accountbutton);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$1.name,
		type: "if",
		source: "(40:2) {#if $user}",
		ctx
	});

	return block;
}

function create_fragment$6(ctx) {
	let x_topbar;
	let t0;
	let x_logo;
	let t2;
	let current;

	const menubutton = new MenuButton({
			props: {
				light: true,
				hidden: !/*$hasDrawer*/ ctx[0]
			},
			$$inline: true
		});

	let if_block = /*$user*/ ctx[1] && create_if_block$1(ctx);

	const block = {
		c: function create() {
			x_topbar = element("x-topbar");
			create_component(menubutton.$$.fragment);
			t0 = space();
			x_logo = element("x-logo");
			x_logo.textContent = "Raven";
			t2 = space();
			if (if_block) if_block.c();
			set_custom_element_data(x_logo, "class", "svelte-3e430v");
			add_location(x_logo, file$6, 38, 2, 811);
			set_custom_element_data(x_topbar, "class", "svelte-3e430v");
			add_location(x_topbar, file$6, 36, 0, 754);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, x_topbar, anchor);
			mount_component(menubutton, x_topbar, null);
			append_dev(x_topbar, t0);
			append_dev(x_topbar, x_logo);
			append_dev(x_topbar, t2);
			if (if_block) if_block.m(x_topbar, null);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const menubutton_changes = {};
			if (dirty & /*$hasDrawer*/ 1) menubutton_changes.hidden = !/*$hasDrawer*/ ctx[0];
			menubutton.$set(menubutton_changes);

			if (/*$user*/ ctx[1]) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*$user*/ 2) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block$1(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(x_topbar, null);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(menubutton.$$.fragment, local);
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(menubutton.$$.fragment, local);
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(x_topbar);
			destroy_component(menubutton);
			if (if_block) if_block.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$6.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$6($$self, $$props, $$invalidate) {
	let $hasDrawer;
	let $user;
	validate_store(user, "user");
	component_subscribe($$self, user, $$value => $$invalidate(1, $user = $$value));
	const { toggleDrawer, hasDrawer } = getContext("dash");
	validate_store(hasDrawer, "hasDrawer");
	component_subscribe($$self, hasDrawer, value => $$invalidate(0, $hasDrawer = value));
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Topbar> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("Topbar", $$slots, []);

	$$self.$capture_state = () => ({
		getContext,
		toggleDrawer,
		hasDrawer,
		user,
		MenuButton,
		AccountButton,
		Menu,
		Close,
		$hasDrawer,
		$user
	});

	return [$hasDrawer, $user, hasDrawer];
}

class Topbar extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Topbar",
			options,
			id: create_fragment$6.name
		});
	}
}

const inbox = writable(null);
const sent = writable(null);
const drafts = writable(null);
const trash = writable(null);
const junk = writable(null);
const all = writable([]);
const others = writable([]);
let watching$1 = false;
const load = async () => {
    console.log("[WS] getting mailboxes");
    const res = await get("/users/me/mailboxes?counters=true");
    console.log("[WS] mailboxes received");
    const mailboxes = res.results;
    const $all = [];
    const $others = [];
    for (const box of mailboxes) {
        //const store = writable(box);
        let store;
        switch (box.specialUse) {
            case "\\Sent":
                sent.set(box);
                store = sent;
                break;
            case "\\Trash":
                trash.set(box);
                store = trash;
                break;
            case "\\Drafts":
                drafts.set(box);
                store = drafts;
                break;
            case "\\Junk":
                junk.set(box);
                store = junk;
                break;
            default:
                if (box.path === "INBOX") {
                    inbox.set(box);
                    store = inbox;
                }
                else {
                    store = writable(box);
                    $others.push(store);
                }
        }
        $all.push(store);
    }
    all.set($all);
    others.set($others);
    if (!watching$1) {
        watching$1 = true;
        watch((event) => {
            if (event.command === "COUNTERS") {
                const box = _get(event.mailbox);
                if (box && box.get()) {
                    box.update(box => ({ ...box, total: event.total, unseen: event.unseen }));
                }
            }
        });
    }
};
const _get = (id) => {
    return all.get().find(b => b.get().id === id);
};
const createMailbox = async (path) => {
    await post("/users/me/mailboxes", { path });
    await load();
};

var mailboxes = /*#__PURE__*/Object.freeze({
    __proto__: null,
    inbox: inbox,
    sent: sent,
    drafts: drafts,
    trash: trash,
    junk: junk,
    all: all,
    others: others,
    load: load,
    createMailbox: createMailbox,
    get: _get
});

/* node_modules/svelte-material-icons/InboxOutline.svelte generated by Svelte v3.21.0 */

const file$7 = "node_modules/svelte-material-icons/InboxOutline.svelte";

function create_fragment$7(ctx) {
	let svg;
	let path;

	const block = {
		c: function create() {
			svg = svg_element("svg");
			path = svg_element("path");
			attr_dev(path, "d", "M19 3H5A2 2 0 0 0 3 5V19A2 2 0 0 0 5 21H19A2 2 0 0 0 21 19V5A2 2 0 0 0 19 3M5 19V17H8.13A4.13 4.13 0 0 0 9.4 19M19 19H14.6A4.13 4.13 0 0 0 15.87 17H19M19 15H14V16A2 2 0 0 1 10 16V15H5V5H19Z");
			attr_dev(path, "fill", /*color*/ ctx[2]);
			add_location(path, file$7, 8, 59, 234);
			attr_dev(svg, "width", /*width*/ ctx[0]);
			attr_dev(svg, "height", /*height*/ ctx[1]);
			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			add_location(svg, file$7, 8, 0, 175);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, svg, anchor);
			append_dev(svg, path);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*color*/ 4) {
				attr_dev(path, "fill", /*color*/ ctx[2]);
			}

			if (dirty & /*width*/ 1) {
				attr_dev(svg, "width", /*width*/ ctx[0]);
			}

			if (dirty & /*height*/ 2) {
				attr_dev(svg, "height", /*height*/ ctx[1]);
			}

			if (dirty & /*viewBox*/ 8) {
				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(svg);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$7.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$7($$self, $$props, $$invalidate) {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	const writable_props = ["size", "width", "height", "color", "viewBox"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<InboxOutline> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("InboxOutline", $$slots, []);

	$$self.$set = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

	$$self.$inject_state = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [width, height, color, viewBox, size];
}

class InboxOutline extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$7, create_fragment$7, safe_not_equal, {
			size: 4,
			width: 0,
			height: 1,
			color: 2,
			viewBox: 3
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "InboxOutline",
			options,
			id: create_fragment$7.name
		});
	}

	get size() {
		throw new Error("<InboxOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set size(value) {
		throw new Error("<InboxOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get width() {
		throw new Error("<InboxOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set width(value) {
		throw new Error("<InboxOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get height() {
		throw new Error("<InboxOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set height(value) {
		throw new Error("<InboxOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get color() {
		throw new Error("<InboxOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set color(value) {
		throw new Error("<InboxOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get viewBox() {
		throw new Error("<InboxOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set viewBox(value) {
		throw new Error("<InboxOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules/svelte-material-icons/DeleteOutline.svelte generated by Svelte v3.21.0 */

const file$8 = "node_modules/svelte-material-icons/DeleteOutline.svelte";

function create_fragment$8(ctx) {
	let svg;
	let path;

	const block = {
		c: function create() {
			svg = svg_element("svg");
			path = svg_element("path");
			attr_dev(path, "d", "M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8,9H16V19H8V9M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z");
			attr_dev(path, "fill", /*color*/ ctx[2]);
			add_location(path, file$8, 8, 59, 234);
			attr_dev(svg, "width", /*width*/ ctx[0]);
			attr_dev(svg, "height", /*height*/ ctx[1]);
			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			add_location(svg, file$8, 8, 0, 175);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, svg, anchor);
			append_dev(svg, path);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*color*/ 4) {
				attr_dev(path, "fill", /*color*/ ctx[2]);
			}

			if (dirty & /*width*/ 1) {
				attr_dev(svg, "width", /*width*/ ctx[0]);
			}

			if (dirty & /*height*/ 2) {
				attr_dev(svg, "height", /*height*/ ctx[1]);
			}

			if (dirty & /*viewBox*/ 8) {
				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(svg);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$8.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$8($$self, $$props, $$invalidate) {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	const writable_props = ["size", "width", "height", "color", "viewBox"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<DeleteOutline> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("DeleteOutline", $$slots, []);

	$$self.$set = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

	$$self.$inject_state = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [width, height, color, viewBox, size];
}

class DeleteOutline extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
			size: 4,
			width: 0,
			height: 1,
			color: 2,
			viewBox: 3
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "DeleteOutline",
			options,
			id: create_fragment$8.name
		});
	}

	get size() {
		throw new Error("<DeleteOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set size(value) {
		throw new Error("<DeleteOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get width() {
		throw new Error("<DeleteOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set width(value) {
		throw new Error("<DeleteOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get height() {
		throw new Error("<DeleteOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set height(value) {
		throw new Error("<DeleteOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get color() {
		throw new Error("<DeleteOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set color(value) {
		throw new Error("<DeleteOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get viewBox() {
		throw new Error("<DeleteOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set viewBox(value) {
		throw new Error("<DeleteOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules/svelte-material-icons/SendOutline.svelte generated by Svelte v3.21.0 */

const file$9 = "node_modules/svelte-material-icons/SendOutline.svelte";

function create_fragment$9(ctx) {
	let svg;
	let path;

	const block = {
		c: function create() {
			svg = svg_element("svg");
			path = svg_element("path");
			attr_dev(path, "d", "M4 6.03L11.5 9.25L4 8.25L4 6.03M11.5 14.75L4 17.97V15.75L11.5 14.75M2 3L2 10L17 12L2 14L2 21L23 12L2 3Z");
			attr_dev(path, "fill", /*color*/ ctx[2]);
			add_location(path, file$9, 8, 59, 234);
			attr_dev(svg, "width", /*width*/ ctx[0]);
			attr_dev(svg, "height", /*height*/ ctx[1]);
			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			add_location(svg, file$9, 8, 0, 175);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, svg, anchor);
			append_dev(svg, path);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*color*/ 4) {
				attr_dev(path, "fill", /*color*/ ctx[2]);
			}

			if (dirty & /*width*/ 1) {
				attr_dev(svg, "width", /*width*/ ctx[0]);
			}

			if (dirty & /*height*/ 2) {
				attr_dev(svg, "height", /*height*/ ctx[1]);
			}

			if (dirty & /*viewBox*/ 8) {
				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(svg);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$9.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$9($$self, $$props, $$invalidate) {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	const writable_props = ["size", "width", "height", "color", "viewBox"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SendOutline> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("SendOutline", $$slots, []);

	$$self.$set = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

	$$self.$inject_state = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [width, height, color, viewBox, size];
}

class SendOutline extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$9, create_fragment$9, safe_not_equal, {
			size: 4,
			width: 0,
			height: 1,
			color: 2,
			viewBox: 3
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "SendOutline",
			options,
			id: create_fragment$9.name
		});
	}

	get size() {
		throw new Error("<SendOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set size(value) {
		throw new Error("<SendOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get width() {
		throw new Error("<SendOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set width(value) {
		throw new Error("<SendOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get height() {
		throw new Error("<SendOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set height(value) {
		throw new Error("<SendOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get color() {
		throw new Error("<SendOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set color(value) {
		throw new Error("<SendOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get viewBox() {
		throw new Error("<SendOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set viewBox(value) {
		throw new Error("<SendOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules/svelte-material-icons/AlertDecagramOutline.svelte generated by Svelte v3.21.0 */

const file$a = "node_modules/svelte-material-icons/AlertDecagramOutline.svelte";

function create_fragment$a(ctx) {
	let svg;
	let path;

	const block = {
		c: function create() {
			svg = svg_element("svg");
			path = svg_element("path");
			attr_dev(path, "d", "M23,12L20.56,14.78L20.9,18.46L17.29,19.28L15.4,22.46L12,21L8.6,22.47L6.71,19.29L3.1,18.47L3.44,14.78L1,12L3.44,9.21L3.1,5.53L6.71,4.72L8.6,1.54L12,3L15.4,1.54L17.29,4.72L20.9,5.54L20.56,9.22L23,12M20.33,12L18.5,9.89L18.74,7.1L16,6.5L14.58,4.07L12,5.18L9.42,4.07L8,6.5L5.26,7.09L5.5,9.88L3.67,12L5.5,14.1L5.26,16.9L8,17.5L9.42,19.93L12,18.81L14.58,19.92L16,17.5L18.74,16.89L18.5,14.1L20.33,12M11,15H13V17H11V15M11,7H13V13H11V7");
			attr_dev(path, "fill", /*color*/ ctx[2]);
			add_location(path, file$a, 8, 59, 234);
			attr_dev(svg, "width", /*width*/ ctx[0]);
			attr_dev(svg, "height", /*height*/ ctx[1]);
			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			add_location(svg, file$a, 8, 0, 175);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, svg, anchor);
			append_dev(svg, path);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*color*/ 4) {
				attr_dev(path, "fill", /*color*/ ctx[2]);
			}

			if (dirty & /*width*/ 1) {
				attr_dev(svg, "width", /*width*/ ctx[0]);
			}

			if (dirty & /*height*/ 2) {
				attr_dev(svg, "height", /*height*/ ctx[1]);
			}

			if (dirty & /*viewBox*/ 8) {
				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(svg);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$a.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$a($$self, $$props, $$invalidate) {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	const writable_props = ["size", "width", "height", "color", "viewBox"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<AlertDecagramOutline> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("AlertDecagramOutline", $$slots, []);

	$$self.$set = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

	$$self.$inject_state = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [width, height, color, viewBox, size];
}

class AlertDecagramOutline extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$a, create_fragment$a, safe_not_equal, {
			size: 4,
			width: 0,
			height: 1,
			color: 2,
			viewBox: 3
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "AlertDecagramOutline",
			options,
			id: create_fragment$a.name
		});
	}

	get size() {
		throw new Error("<AlertDecagramOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set size(value) {
		throw new Error("<AlertDecagramOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get width() {
		throw new Error("<AlertDecagramOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set width(value) {
		throw new Error("<AlertDecagramOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get height() {
		throw new Error("<AlertDecagramOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set height(value) {
		throw new Error("<AlertDecagramOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get color() {
		throw new Error("<AlertDecagramOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set color(value) {
		throw new Error("<AlertDecagramOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get viewBox() {
		throw new Error("<AlertDecagramOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set viewBox(value) {
		throw new Error("<AlertDecagramOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules/svelte-material-icons/FileDocumentEditOutline.svelte generated by Svelte v3.21.0 */

const file$b = "node_modules/svelte-material-icons/FileDocumentEditOutline.svelte";

function create_fragment$b(ctx) {
	let svg;
	let path;

	const block = {
		c: function create() {
			svg = svg_element("svg");
			path = svg_element("path");
			attr_dev(path, "d", "M8,12H16V14H8V12M10,20H6V4H13V9H18V12.1L20,10.1V8L14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H10V20M8,18H12.1L13,17.1V16H8V18M20.2,13C20.3,13 20.5,13.1 20.6,13.2L21.9,14.5C22.1,14.7 22.1,15.1 21.9,15.3L20.9,16.3L18.8,14.2L19.8,13.2C19.9,13.1 20,13 20.2,13M20.2,16.9L14.1,23H12V20.9L18.1,14.8L20.2,16.9Z");
			attr_dev(path, "fill", /*color*/ ctx[2]);
			add_location(path, file$b, 8, 59, 234);
			attr_dev(svg, "width", /*width*/ ctx[0]);
			attr_dev(svg, "height", /*height*/ ctx[1]);
			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			add_location(svg, file$b, 8, 0, 175);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, svg, anchor);
			append_dev(svg, path);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*color*/ 4) {
				attr_dev(path, "fill", /*color*/ ctx[2]);
			}

			if (dirty & /*width*/ 1) {
				attr_dev(svg, "width", /*width*/ ctx[0]);
			}

			if (dirty & /*height*/ 2) {
				attr_dev(svg, "height", /*height*/ ctx[1]);
			}

			if (dirty & /*viewBox*/ 8) {
				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(svg);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$b.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$b($$self, $$props, $$invalidate) {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	const writable_props = ["size", "width", "height", "color", "viewBox"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<FileDocumentEditOutline> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("FileDocumentEditOutline", $$slots, []);

	$$self.$set = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

	$$self.$inject_state = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [width, height, color, viewBox, size];
}

class FileDocumentEditOutline extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$b, create_fragment$b, safe_not_equal, {
			size: 4,
			width: 0,
			height: 1,
			color: 2,
			viewBox: 3
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "FileDocumentEditOutline",
			options,
			id: create_fragment$b.name
		});
	}

	get size() {
		throw new Error("<FileDocumentEditOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set size(value) {
		throw new Error("<FileDocumentEditOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get width() {
		throw new Error("<FileDocumentEditOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set width(value) {
		throw new Error("<FileDocumentEditOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get height() {
		throw new Error("<FileDocumentEditOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set height(value) {
		throw new Error("<FileDocumentEditOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get color() {
		throw new Error("<FileDocumentEditOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set color(value) {
		throw new Error("<FileDocumentEditOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get viewBox() {
		throw new Error("<FileDocumentEditOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set viewBox(value) {
		throw new Error("<FileDocumentEditOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules/svelte-material-icons/FolderOutline.svelte generated by Svelte v3.21.0 */

const file$c = "node_modules/svelte-material-icons/FolderOutline.svelte";

function create_fragment$c(ctx) {
	let svg;
	let path;

	const block = {
		c: function create() {
			svg = svg_element("svg");
			path = svg_element("path");
			attr_dev(path, "d", "M20,18H4V8H20M20,6H12L10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6Z");
			attr_dev(path, "fill", /*color*/ ctx[2]);
			add_location(path, file$c, 8, 59, 234);
			attr_dev(svg, "width", /*width*/ ctx[0]);
			attr_dev(svg, "height", /*height*/ ctx[1]);
			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			add_location(svg, file$c, 8, 0, 175);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, svg, anchor);
			append_dev(svg, path);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*color*/ 4) {
				attr_dev(path, "fill", /*color*/ ctx[2]);
			}

			if (dirty & /*width*/ 1) {
				attr_dev(svg, "width", /*width*/ ctx[0]);
			}

			if (dirty & /*height*/ 2) {
				attr_dev(svg, "height", /*height*/ ctx[1]);
			}

			if (dirty & /*viewBox*/ 8) {
				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(svg);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$c.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$c($$self, $$props, $$invalidate) {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	const writable_props = ["size", "width", "height", "color", "viewBox"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<FolderOutline> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("FolderOutline", $$slots, []);

	$$self.$set = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

	$$self.$inject_state = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [width, height, color, viewBox, size];
}

class FolderOutline extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$c, create_fragment$c, safe_not_equal, {
			size: 4,
			width: 0,
			height: 1,
			color: 2,
			viewBox: 3
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "FolderOutline",
			options,
			id: create_fragment$c.name
		});
	}

	get size() {
		throw new Error("<FolderOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set size(value) {
		throw new Error("<FolderOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get width() {
		throw new Error("<FolderOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set width(value) {
		throw new Error("<FolderOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get height() {
		throw new Error("<FolderOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set height(value) {
		throw new Error("<FolderOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get color() {
		throw new Error("<FolderOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set color(value) {
		throw new Error("<FolderOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get viewBox() {
		throw new Error("<FolderOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set viewBox(value) {
		throw new Error("<FolderOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

const inbox$1 = ["inbox", InboxOutline];
const map = {
    "\\Drafts": ["drafts", FileDocumentEditOutline],
    "\\Junk": ["junk", AlertDecagramOutline],
    "\\Sent": ["sent", SendOutline],
    "\\Trash": ["trash", DeleteOutline]
};
const mailboxMeta = (mailbox, labels) => {
    if (mailbox.path === "INBOX") {
        const [id, icon] = inbox$1;
        return { label: labels[id], icon };
    }
    else if (mailbox.specialUse && map[mailbox.specialUse] !== null) {
        const [id, icon] = map[mailbox.specialUse];
        return { label: labels[id], icon };
    }
    else {
        return { label: mailbox.name, icon: FolderOutline };
    }
};

/* src/comp/Dashboard/DrawerItem.svelte generated by Svelte v3.21.0 */
const file$d = "src/comp/Dashboard/DrawerItem.svelte";

// (54:4) {#if counter}
function create_if_block$2(ctx) {
	let span;
	let t;
	let span_transition;
	let current;

	const block = {
		c: function create() {
			span = element("span");
			t = text(/*counter*/ ctx[3]);
			attr_dev(span, "class", "count svelte-1pqdwww");
			add_location(span, file$d, 54, 8, 1200);
		},
		m: function mount(target, anchor) {
			insert_dev(target, span, anchor);
			append_dev(span, t);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (!current || dirty & /*counter*/ 8) set_data_dev(t, /*counter*/ ctx[3]);
		},
		i: function intro(local) {
			if (current) return;

			add_render_callback(() => {
				if (!span_transition) span_transition = create_bidirectional_transition(span, scale, { duration: 200 }, true);
				span_transition.run(1);
			});

			current = true;
		},
		o: function outro(local) {
			if (!span_transition) span_transition = create_bidirectional_transition(span, scale, { duration: 200 }, false);
			span_transition.run(0);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(span);
			if (detaching && span_transition) span_transition.end();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$2.name,
		type: "if",
		source: "(54:4) {#if counter}",
		ctx
	});

	return block;
}

function create_fragment$d(ctx) {
	let a;
	let span0;
	let t0;
	let span1;
	let t1;
	let t2;
	let t3;
	let current;
	let dispose;
	var switch_value = /*icon*/ ctx[2];

	function switch_props(ctx) {
		return { $$inline: true };
	}

	if (switch_value) {
		var switch_instance = new switch_value(switch_props());
	}

	let if_block = /*counter*/ ctx[3] && create_if_block$2(ctx);
	const ripple = new ge({ $$inline: true });

	const block = {
		c: function create() {
			a = element("a");
			span0 = element("span");
			if (switch_instance) create_component(switch_instance.$$.fragment);
			t0 = space();
			span1 = element("span");
			t1 = text(/*label*/ ctx[1]);
			t2 = space();
			if (if_block) if_block.c();
			t3 = space();
			create_component(ripple.$$.fragment);
			attr_dev(span0, "class", "icon svelte-1pqdwww");
			add_location(span0, file$d, 49, 2, 1068);
			attr_dev(span1, "class", "label svelte-1pqdwww");
			add_location(span1, file$d, 52, 4, 1139);
			attr_dev(a, "href", /*href*/ ctx[0]);
			attr_dev(a, "class", "na btn-dark svelte-1pqdwww");
			toggle_class(a, "current", /*current*/ ctx[4]);
			add_location(a, file$d, 48, 0, 967);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor, remount) {
			insert_dev(target, a, anchor);
			append_dev(a, span0);

			if (switch_instance) {
				mount_component(switch_instance, span0, null);
			}

			append_dev(a, t0);
			append_dev(a, span1);
			append_dev(span1, t1);
			append_dev(a, t2);
			if (if_block) if_block.m(a, null);
			append_dev(a, t3);
			mount_component(ripple, a, null);
			current = true;
			if (remount) run_all(dispose);

			dispose = [
				listen_dev(a, "click", /*click_handler*/ ctx[6], false, false, false),
				listen_dev(a, "click", /*click_handler_1*/ ctx[7], false, false, false)
			];
		},
		p: function update(ctx, [dirty]) {
			if (switch_value !== (switch_value = /*icon*/ ctx[2])) {
				if (switch_instance) {
					group_outros();
					const old_component = switch_instance;

					transition_out(old_component.$$.fragment, 1, 0, () => {
						destroy_component(old_component, 1);
					});

					check_outros();
				}

				if (switch_value) {
					switch_instance = new switch_value(switch_props());
					create_component(switch_instance.$$.fragment);
					transition_in(switch_instance.$$.fragment, 1);
					mount_component(switch_instance, span0, null);
				} else {
					switch_instance = null;
				}
			}

			if (!current || dirty & /*label*/ 2) set_data_dev(t1, /*label*/ ctx[1]);

			if (/*counter*/ ctx[3]) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*counter*/ 8) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block$2(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(a, t3);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}

			if (!current || dirty & /*href*/ 1) {
				attr_dev(a, "href", /*href*/ ctx[0]);
			}

			if (dirty & /*current*/ 16) {
				toggle_class(a, "current", /*current*/ ctx[4]);
			}
		},
		i: function intro(local) {
			if (current) return;
			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
			transition_in(if_block);
			transition_in(ripple.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
			transition_out(if_block);
			transition_out(ripple.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(a);
			if (switch_instance) destroy_component(switch_instance);
			if (if_block) if_block.d();
			destroy_component(ripple);
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$d.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$d($$self, $$props, $$invalidate) {
	const { drawerOpenMobile } = getContext("dash");
	let { href } = $$props;
	let { label } = $$props;
	let { icon } = $$props;
	let { counter = null } = $$props;
	let { current = false } = $$props;
	const writable_props = ["href", "label", "icon", "counter", "current"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<DrawerItem> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("DrawerItem", $$slots, []);

	function click_handler(event) {
		bubble($$self, event);
	}

	const click_handler_1 = () => drawerOpenMobile.set(false);

	$$self.$set = $$props => {
		if ("href" in $$props) $$invalidate(0, href = $$props.href);
		if ("label" in $$props) $$invalidate(1, label = $$props.label);
		if ("icon" in $$props) $$invalidate(2, icon = $$props.icon);
		if ("counter" in $$props) $$invalidate(3, counter = $$props.counter);
		if ("current" in $$props) $$invalidate(4, current = $$props.current);
	};

	$$self.$capture_state = () => ({
		getContext,
		scale,
		Ripple: ge,
		drawerOpenMobile,
		href,
		label,
		icon,
		counter,
		current
	});

	$$self.$inject_state = $$props => {
		if ("href" in $$props) $$invalidate(0, href = $$props.href);
		if ("label" in $$props) $$invalidate(1, label = $$props.label);
		if ("icon" in $$props) $$invalidate(2, icon = $$props.icon);
		if ("counter" in $$props) $$invalidate(3, counter = $$props.counter);
		if ("current" in $$props) $$invalidate(4, current = $$props.current);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		href,
		label,
		icon,
		counter,
		current,
		drawerOpenMobile,
		click_handler,
		click_handler_1
	];
}

class DrawerItem extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$d, create_fragment$d, safe_not_equal, {
			href: 0,
			label: 1,
			icon: 2,
			counter: 3,
			current: 4
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "DrawerItem",
			options,
			id: create_fragment$d.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*href*/ ctx[0] === undefined && !("href" in props)) {
			console.warn("<DrawerItem> was created without expected prop 'href'");
		}

		if (/*label*/ ctx[1] === undefined && !("label" in props)) {
			console.warn("<DrawerItem> was created without expected prop 'label'");
		}

		if (/*icon*/ ctx[2] === undefined && !("icon" in props)) {
			console.warn("<DrawerItem> was created without expected prop 'icon'");
		}
	}

	get href() {
		throw new Error("<DrawerItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set href(value) {
		throw new Error("<DrawerItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get label() {
		throw new Error("<DrawerItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set label(value) {
		throw new Error("<DrawerItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get icon() {
		throw new Error("<DrawerItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set icon(value) {
		throw new Error("<DrawerItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get counter() {
		throw new Error("<DrawerItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set counter(value) {
		throw new Error("<DrawerItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get current() {
		throw new Error("<DrawerItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set current(value) {
		throw new Error("<DrawerItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src/comp/Dashboard/MailboxList/MailboxItem.svelte generated by Svelte v3.21.0 */

function create_fragment$e(ctx) {
	let current;

	const draweritem = new DrawerItem({
			props: {
				href: "#!/mailbox/" + /*$mailbox*/ ctx[3].id,
				current: /*current*/ ctx[1],
				icon: /*meta*/ ctx[2].icon,
				label: /*meta*/ ctx[2].label,
				counter: /*$mailbox*/ ctx[3].unseen
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(draweritem.$$.fragment);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			mount_component(draweritem, target, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const draweritem_changes = {};
			if (dirty & /*$mailbox*/ 8) draweritem_changes.href = "#!/mailbox/" + /*$mailbox*/ ctx[3].id;
			if (dirty & /*current*/ 2) draweritem_changes.current = /*current*/ ctx[1];
			if (dirty & /*meta*/ 4) draweritem_changes.icon = /*meta*/ ctx[2].icon;
			if (dirty & /*meta*/ 4) draweritem_changes.label = /*meta*/ ctx[2].label;
			if (dirty & /*$mailbox*/ 8) draweritem_changes.counter = /*$mailbox*/ ctx[3].unseen;
			draweritem.$set(draweritem_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(draweritem.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(draweritem.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(draweritem, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$e.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$e($$self, $$props, $$invalidate) {
	let $page;

	let $mailbox,
		$$unsubscribe_mailbox = noop,
		$$subscribe_mailbox = () => ($$unsubscribe_mailbox(), $$unsubscribe_mailbox = subscribe(mailbox, $$value => $$invalidate(3, $mailbox = $$value)), mailbox);

	let $locale;
	$$self.$$.on_destroy.push(() => $$unsubscribe_mailbox());
	let { mailbox } = $$props;
	validate_store(mailbox, "mailbox");
	$$subscribe_mailbox();
	const { page } = getContext("router");
	validate_store(page, "page");
	component_subscribe($$self, page, value => $$invalidate(6, $page = value));
	const { locale } = getContext("app");
	validate_store(locale, "locale");
	component_subscribe($$self, locale, value => $$invalidate(7, $locale = value));
	let current, meta;
	const writable_props = ["mailbox"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<MailboxItem> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("MailboxItem", $$slots, []);

	$$self.$set = $$props => {
		if ("mailbox" in $$props) $$subscribe_mailbox($$invalidate(0, mailbox = $$props.mailbox));
	};

	$$self.$capture_state = () => ({
		getContext,
		mailboxMeta,
		mailbox,
		page,
		locale,
		current,
		meta,
		DrawerItem,
		$page,
		$mailbox,
		$locale
	});

	$$self.$inject_state = $$props => {
		if ("mailbox" in $$props) $$subscribe_mailbox($$invalidate(0, mailbox = $$props.mailbox));
		if ("current" in $$props) $$invalidate(1, current = $$props.current);
		if ("meta" in $$props) $$invalidate(2, meta = $$props.meta);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*$page, $mailbox*/ 72) {
			 $$invalidate(1, current = $page.params.mailbox === $mailbox.id);
		}

		if ($$self.$$.dirty & /*$mailbox, $locale*/ 136) {
			 $$invalidate(2, meta = mailboxMeta($mailbox, $locale.mailbox.title));
		}
	};

	return [mailbox, current, meta, $mailbox, page, locale];
}

class MailboxItem extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$e, create_fragment$e, safe_not_equal, { mailbox: 0 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "MailboxItem",
			options,
			id: create_fragment$e.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*mailbox*/ ctx[0] === undefined && !("mailbox" in props)) {
			console.warn("<MailboxItem> was created without expected prop 'mailbox'");
		}
	}

	get mailbox() {
		throw new Error("<MailboxItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set mailbox(value) {
		throw new Error("<MailboxItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src/comp/Dashboard/MailboxList/MailboxList.svelte generated by Svelte v3.21.0 */
const file$e = "src/comp/Dashboard/MailboxList/MailboxList.svelte";

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[6] = list[i];
	return child_ctx;
}

// (17:2) {#if $inbox}
function create_if_block_4(ctx) {
	let current;

	const mailboxitem = new MailboxItem({
			props: { mailbox: inbox },
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(mailboxitem.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(mailboxitem, target, anchor);
			current = true;
		},
		p: noop,
		i: function intro(local) {
			if (current) return;
			transition_in(mailboxitem.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(mailboxitem.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(mailboxitem, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_4.name,
		type: "if",
		source: "(17:2) {#if $inbox}",
		ctx
	});

	return block;
}

// (20:2) {#each $others as mailbox}
function create_each_block(ctx) {
	let current;

	const mailboxitem = new MailboxItem({
			props: { mailbox: /*mailbox*/ ctx[6] },
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(mailboxitem.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(mailboxitem, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const mailboxitem_changes = {};
			if (dirty & /*$others*/ 2) mailboxitem_changes.mailbox = /*mailbox*/ ctx[6];
			mailboxitem.$set(mailboxitem_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(mailboxitem.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(mailboxitem.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(mailboxitem, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block.name,
		type: "each",
		source: "(20:2) {#each $others as mailbox}",
		ctx
	});

	return block;
}

// (23:2) {#if $sent}
function create_if_block_3(ctx) {
	let current;
	const mailboxitem = new MailboxItem({ props: { mailbox: sent }, $$inline: true });

	const block = {
		c: function create() {
			create_component(mailboxitem.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(mailboxitem, target, anchor);
			current = true;
		},
		p: noop,
		i: function intro(local) {
			if (current) return;
			transition_in(mailboxitem.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(mailboxitem.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(mailboxitem, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_3.name,
		type: "if",
		source: "(23:2) {#if $sent}",
		ctx
	});

	return block;
}

// (26:2) {#if $drafts}
function create_if_block_2(ctx) {
	let current;

	const mailboxitem = new MailboxItem({
			props: { mailbox: drafts },
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(mailboxitem.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(mailboxitem, target, anchor);
			current = true;
		},
		p: noop,
		i: function intro(local) {
			if (current) return;
			transition_in(mailboxitem.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(mailboxitem.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(mailboxitem, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2.name,
		type: "if",
		source: "(26:2) {#if $drafts}",
		ctx
	});

	return block;
}

// (29:2) {#if $junk}
function create_if_block_1(ctx) {
	let current;
	const mailboxitem = new MailboxItem({ props: { mailbox: junk }, $$inline: true });

	const block = {
		c: function create() {
			create_component(mailboxitem.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(mailboxitem, target, anchor);
			current = true;
		},
		p: noop,
		i: function intro(local) {
			if (current) return;
			transition_in(mailboxitem.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(mailboxitem.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(mailboxitem, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1.name,
		type: "if",
		source: "(29:2) {#if $junk}",
		ctx
	});

	return block;
}

// (32:2) {#if $trash}
function create_if_block$3(ctx) {
	let current;

	const mailboxitem = new MailboxItem({
			props: { mailbox: trash },
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(mailboxitem.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(mailboxitem, target, anchor);
			current = true;
		},
		p: noop,
		i: function intro(local) {
			if (current) return;
			transition_in(mailboxitem.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(mailboxitem.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(mailboxitem, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$3.name,
		type: "if",
		source: "(32:2) {#if $trash}",
		ctx
	});

	return block;
}

function create_fragment$f(ctx) {
	let x_mailbox_list;
	let t0;
	let t1;
	let t2;
	let t3;
	let t4;
	let current;
	let if_block0 = /*$inbox*/ ctx[0] && create_if_block_4(ctx);
	let each_value = /*$others*/ ctx[1];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	let if_block1 = /*$sent*/ ctx[2] && create_if_block_3(ctx);
	let if_block2 = /*$drafts*/ ctx[3] && create_if_block_2(ctx);
	let if_block3 = /*$junk*/ ctx[4] && create_if_block_1(ctx);
	let if_block4 = /*$trash*/ ctx[5] && create_if_block$3(ctx);

	const block = {
		c: function create() {
			x_mailbox_list = element("x-mailbox-list");
			if (if_block0) if_block0.c();
			t0 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t1 = space();
			if (if_block1) if_block1.c();
			t2 = space();
			if (if_block2) if_block2.c();
			t3 = space();
			if (if_block3) if_block3.c();
			t4 = space();
			if (if_block4) if_block4.c();
			set_custom_element_data(x_mailbox_list, "class", "svelte-phrhx2");
			add_location(x_mailbox_list, file$e, 15, 0, 317);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, x_mailbox_list, anchor);
			if (if_block0) if_block0.m(x_mailbox_list, null);
			append_dev(x_mailbox_list, t0);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(x_mailbox_list, null);
			}

			append_dev(x_mailbox_list, t1);
			if (if_block1) if_block1.m(x_mailbox_list, null);
			append_dev(x_mailbox_list, t2);
			if (if_block2) if_block2.m(x_mailbox_list, null);
			append_dev(x_mailbox_list, t3);
			if (if_block3) if_block3.m(x_mailbox_list, null);
			append_dev(x_mailbox_list, t4);
			if (if_block4) if_block4.m(x_mailbox_list, null);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (/*$inbox*/ ctx[0]) {
				if (if_block0) {
					if_block0.p(ctx, dirty);

					if (dirty & /*$inbox*/ 1) {
						transition_in(if_block0, 1);
					}
				} else {
					if_block0 = create_if_block_4(ctx);
					if_block0.c();
					transition_in(if_block0, 1);
					if_block0.m(x_mailbox_list, t0);
				}
			} else if (if_block0) {
				group_outros();

				transition_out(if_block0, 1, 1, () => {
					if_block0 = null;
				});

				check_outros();
			}

			if (dirty & /*$others*/ 2) {
				each_value = /*$others*/ ctx[1];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(x_mailbox_list, t1);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}

			if (/*$sent*/ ctx[2]) {
				if (if_block1) {
					if_block1.p(ctx, dirty);

					if (dirty & /*$sent*/ 4) {
						transition_in(if_block1, 1);
					}
				} else {
					if_block1 = create_if_block_3(ctx);
					if_block1.c();
					transition_in(if_block1, 1);
					if_block1.m(x_mailbox_list, t2);
				}
			} else if (if_block1) {
				group_outros();

				transition_out(if_block1, 1, 1, () => {
					if_block1 = null;
				});

				check_outros();
			}

			if (/*$drafts*/ ctx[3]) {
				if (if_block2) {
					if_block2.p(ctx, dirty);

					if (dirty & /*$drafts*/ 8) {
						transition_in(if_block2, 1);
					}
				} else {
					if_block2 = create_if_block_2(ctx);
					if_block2.c();
					transition_in(if_block2, 1);
					if_block2.m(x_mailbox_list, t3);
				}
			} else if (if_block2) {
				group_outros();

				transition_out(if_block2, 1, 1, () => {
					if_block2 = null;
				});

				check_outros();
			}

			if (/*$junk*/ ctx[4]) {
				if (if_block3) {
					if_block3.p(ctx, dirty);

					if (dirty & /*$junk*/ 16) {
						transition_in(if_block3, 1);
					}
				} else {
					if_block3 = create_if_block_1(ctx);
					if_block3.c();
					transition_in(if_block3, 1);
					if_block3.m(x_mailbox_list, t4);
				}
			} else if (if_block3) {
				group_outros();

				transition_out(if_block3, 1, 1, () => {
					if_block3 = null;
				});

				check_outros();
			}

			if (/*$trash*/ ctx[5]) {
				if (if_block4) {
					if_block4.p(ctx, dirty);

					if (dirty & /*$trash*/ 32) {
						transition_in(if_block4, 1);
					}
				} else {
					if_block4 = create_if_block$3(ctx);
					if_block4.c();
					transition_in(if_block4, 1);
					if_block4.m(x_mailbox_list, null);
				}
			} else if (if_block4) {
				group_outros();

				transition_out(if_block4, 1, 1, () => {
					if_block4 = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block0);

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			transition_in(if_block1);
			transition_in(if_block2);
			transition_in(if_block3);
			transition_in(if_block4);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block0);
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			transition_out(if_block1);
			transition_out(if_block2);
			transition_out(if_block3);
			transition_out(if_block4);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(x_mailbox_list);
			if (if_block0) if_block0.d();
			destroy_each(each_blocks, detaching);
			if (if_block1) if_block1.d();
			if (if_block2) if_block2.d();
			if (if_block3) if_block3.d();
			if (if_block4) if_block4.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$f.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$f($$self, $$props, $$invalidate) {
	let $inbox;
	let $others;
	let $sent;
	let $drafts;
	let $junk;
	let $trash;
	validate_store(inbox, "inbox");
	component_subscribe($$self, inbox, $$value => $$invalidate(0, $inbox = $$value));
	validate_store(others, "others");
	component_subscribe($$self, others, $$value => $$invalidate(1, $others = $$value));
	validate_store(sent, "sent");
	component_subscribe($$self, sent, $$value => $$invalidate(2, $sent = $$value));
	validate_store(drafts, "drafts");
	component_subscribe($$self, drafts, $$value => $$invalidate(3, $drafts = $$value));
	validate_store(junk, "junk");
	component_subscribe($$self, junk, $$value => $$invalidate(4, $junk = $$value));
	validate_store(trash, "trash");
	component_subscribe($$self, trash, $$value => $$invalidate(5, $trash = $$value));
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<MailboxList> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("MailboxList", $$slots, []);

	$$self.$capture_state = () => ({
		inbox,
		sent,
		drafts,
		junk,
		trash,
		others,
		MailboxItem,
		$inbox,
		$others,
		$sent,
		$drafts,
		$junk,
		$trash
	});

	return [$inbox, $others, $sent, $drafts, $junk, $trash];
}

class MailboxList extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "MailboxList",
			options,
			id: create_fragment$f.name
		});
	}
}

/* node_modules/svelte-material-icons/FolderPlusOutline.svelte generated by Svelte v3.21.0 */

const file$f = "node_modules/svelte-material-icons/FolderPlusOutline.svelte";

function create_fragment$g(ctx) {
	let svg;
	let path;

	const block = {
		c: function create() {
			svg = svg_element("svg");
			path = svg_element("path");
			attr_dev(path, "d", "M12 12H14V10H16V12H18V14H16V16H14V14H12V12M22 8V18C22 19.11 21.11 20 20 20H4C2.89 20 2 19.11 2 18V6C2 4.89 2.89 4 4 4H10L12 6H20C21.11 6 22 6.89 22 8M20 8H4V18H20V8Z");
			attr_dev(path, "fill", /*color*/ ctx[2]);
			add_location(path, file$f, 8, 59, 234);
			attr_dev(svg, "width", /*width*/ ctx[0]);
			attr_dev(svg, "height", /*height*/ ctx[1]);
			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			add_location(svg, file$f, 8, 0, 175);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, svg, anchor);
			append_dev(svg, path);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*color*/ 4) {
				attr_dev(path, "fill", /*color*/ ctx[2]);
			}

			if (dirty & /*width*/ 1) {
				attr_dev(svg, "width", /*width*/ ctx[0]);
			}

			if (dirty & /*height*/ 2) {
				attr_dev(svg, "height", /*height*/ ctx[1]);
			}

			if (dirty & /*viewBox*/ 8) {
				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(svg);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$g.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$g($$self, $$props, $$invalidate) {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	const writable_props = ["size", "width", "height", "color", "viewBox"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<FolderPlusOutline> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("FolderPlusOutline", $$slots, []);

	$$self.$set = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

	$$self.$inject_state = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [width, height, color, viewBox, size];
}

class FolderPlusOutline extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$g, create_fragment$g, safe_not_equal, {
			size: 4,
			width: 0,
			height: 1,
			color: 2,
			viewBox: 3
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "FolderPlusOutline",
			options,
			id: create_fragment$g.name
		});
	}

	get size() {
		throw new Error("<FolderPlusOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set size(value) {
		throw new Error("<FolderPlusOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get width() {
		throw new Error("<FolderPlusOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set width(value) {
		throw new Error("<FolderPlusOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get height() {
		throw new Error("<FolderPlusOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set height(value) {
		throw new Error("<FolderPlusOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get color() {
		throw new Error("<FolderPlusOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set color(value) {
		throw new Error("<FolderPlusOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get viewBox() {
		throw new Error("<FolderPlusOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set viewBox(value) {
		throw new Error("<FolderPlusOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

function flip(node, animation, params) {
    const style = getComputedStyle(node);
    const transform = style.transform === 'none' ? '' : style.transform;
    const scaleX = animation.from.width / node.clientWidth;
    const scaleY = animation.from.height / node.clientHeight;
    const dx = (animation.from.left - animation.to.left) / scaleX;
    const dy = (animation.from.top - animation.to.top) / scaleY;
    const d = Math.sqrt(dx * dx + dy * dy);
    const { delay = 0, duration = (d) => Math.sqrt(d) * 120, easing = cubicOut } = params;
    return {
        delay,
        duration: is_function(duration) ? duration(d) : duration,
        easing,
        css: (_t, u) => `transform: ${transform} translate(${u * dx}px, ${u * dy}px);`
    };
}

/* src/comp/Button.svelte generated by Svelte v3.21.0 */

const file$g = "src/comp/Button.svelte";

// (187:0) {:else}
function create_else_block(ctx) {
	let button;
	let span;
	let button_class_value;
	let current;
	let dispose;
	const default_slot_template = /*$$slots*/ ctx[12].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);

	const block = {
		c: function create() {
			button = element("button");
			span = element("span");
			if (default_slot) default_slot.c();
			attr_dev(span, "class", "button-in svelte-1vr4zn8");
			add_location(span, file$g, 198, 4, 3352);
			attr_dev(button, "class", button_class_value = "" + (null_to_empty(/*cls*/ ctx[8]) + " svelte-1vr4zn8"));
			button.disabled = /*disabled*/ ctx[4];
			attr_dev(button, "tabindex", /*tabindex*/ ctx[3]);
			toggle_class(button, "disabled", /*disabled*/ ctx[4]);
			toggle_class(button, "rounded", /*rounded*/ ctx[5]);
			toggle_class(button, "fab", /*fab*/ ctx[6]);
			add_location(button, file$g, 187, 2, 3190);
		},
		m: function mount(target, anchor, remount) {
			insert_dev(target, button, anchor);
			append_dev(button, span);

			if (default_slot) {
				default_slot.m(span, null);
			}

			current = true;
			if (remount) run_all(dispose);

			dispose = [
				listen_dev(button, "click", /*click_handler_2*/ ctx[21], false, false, false),
				listen_dev(button, "focus", /*focus_handler_2*/ ctx[22], false, false, false),
				listen_dev(button, "blur", /*blur_handler_2*/ ctx[23], false, false, false),
				listen_dev(button, "change", /*change_handler_2*/ ctx[24], false, false, false)
			];
		},
		p: function update(ctx, dirty) {
			if (default_slot) {
				if (default_slot.p && dirty & /*$$scope*/ 2048) {
					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[11], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[11], dirty, null));
				}
			}

			if (!current || dirty & /*cls*/ 256 && button_class_value !== (button_class_value = "" + (null_to_empty(/*cls*/ ctx[8]) + " svelte-1vr4zn8"))) {
				attr_dev(button, "class", button_class_value);
			}

			if (!current || dirty & /*disabled*/ 16) {
				prop_dev(button, "disabled", /*disabled*/ ctx[4]);
			}

			if (!current || dirty & /*tabindex*/ 8) {
				attr_dev(button, "tabindex", /*tabindex*/ ctx[3]);
			}

			if (dirty & /*cls, disabled*/ 272) {
				toggle_class(button, "disabled", /*disabled*/ ctx[4]);
			}

			if (dirty & /*cls, rounded*/ 288) {
				toggle_class(button, "rounded", /*rounded*/ ctx[5]);
			}

			if (dirty & /*cls, fab*/ 320) {
				toggle_class(button, "fab", /*fab*/ ctx[6]);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(button);
			if (default_slot) default_slot.d(detaching);
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block.name,
		type: "else",
		source: "(187:0) {:else}",
		ctx
	});

	return block;
}

// (173:28) 
function create_if_block_1$1(ctx) {
	let input;
	let input_class_value;
	let dispose;

	const block = {
		c: function create() {
			input = element("input");
			attr_dev(input, "type", "submit");
			attr_dev(input, "class", input_class_value = "" + (null_to_empty(/*cls*/ ctx[8]) + " svelte-1vr4zn8"));
			input.value = /*value*/ ctx[2];
			input.disabled = /*disabled*/ ctx[4];
			attr_dev(input, "tabindex", /*tabindex*/ ctx[3]);
			toggle_class(input, "disabled", /*disabled*/ ctx[4]);
			toggle_class(input, "rounded", /*rounded*/ ctx[5]);
			toggle_class(input, "fab", /*fab*/ ctx[6]);
			add_location(input, file$g, 173, 2, 2991);
		},
		m: function mount(target, anchor, remount) {
			insert_dev(target, input, anchor);
			if (remount) run_all(dispose);

			dispose = [
				listen_dev(input, "click", /*click_handler_1*/ ctx[17], false, false, false),
				listen_dev(input, "focus", /*focus_handler_1*/ ctx[18], false, false, false),
				listen_dev(input, "blur", /*blur_handler_1*/ ctx[19], false, false, false),
				listen_dev(input, "change", /*change_handler_1*/ ctx[20], false, false, false)
			];
		},
		p: function update(ctx, dirty) {
			if (dirty & /*cls*/ 256 && input_class_value !== (input_class_value = "" + (null_to_empty(/*cls*/ ctx[8]) + " svelte-1vr4zn8"))) {
				attr_dev(input, "class", input_class_value);
			}

			if (dirty & /*value*/ 4) {
				prop_dev(input, "value", /*value*/ ctx[2]);
			}

			if (dirty & /*disabled*/ 16) {
				prop_dev(input, "disabled", /*disabled*/ ctx[4]);
			}

			if (dirty & /*tabindex*/ 8) {
				attr_dev(input, "tabindex", /*tabindex*/ ctx[3]);
			}

			if (dirty & /*cls, disabled*/ 272) {
				toggle_class(input, "disabled", /*disabled*/ ctx[4]);
			}

			if (dirty & /*cls, rounded*/ 288) {
				toggle_class(input, "rounded", /*rounded*/ ctx[5]);
			}

			if (dirty & /*cls, fab*/ 320) {
				toggle_class(input, "fab", /*fab*/ ctx[6]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(input);
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$1.name,
		type: "if",
		source: "(173:28) ",
		ctx
	});

	return block;
}

// (156:0) {#if href != null}
function create_if_block$4(ctx) {
	let a;
	let span;
	let a_class_value;
	let a_href_value;
	let current;
	let dispose;
	const default_slot_template = /*$$slots*/ ctx[12].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);

	const block = {
		c: function create() {
			a = element("a");
			span = element("span");
			if (default_slot) default_slot.c();
			attr_dev(span, "class", "button-in svelte-1vr4zn8");
			add_location(span, file$g, 168, 4, 2901);
			attr_dev(a, "class", a_class_value = "" + (null_to_empty(/*cls*/ ctx[8]) + " svelte-1vr4zn8"));
			attr_dev(a, "href", a_href_value = !/*disabled*/ ctx[4] && /*href*/ ctx[0]);
			attr_dev(a, "rel", /*rel*/ ctx[7]);
			attr_dev(a, "tabindex", /*tabindex*/ ctx[3]);
			toggle_class(a, "disabled", /*disabled*/ ctx[4]);
			toggle_class(a, "rounded", /*rounded*/ ctx[5]);
			toggle_class(a, "fab", /*fab*/ ctx[6]);
			add_location(a, file$g, 156, 2, 2720);
		},
		m: function mount(target, anchor, remount) {
			insert_dev(target, a, anchor);
			append_dev(a, span);

			if (default_slot) {
				default_slot.m(span, null);
			}

			current = true;
			if (remount) run_all(dispose);

			dispose = [
				listen_dev(a, "click", /*click_handler*/ ctx[13], false, false, false),
				listen_dev(a, "focus", /*focus_handler*/ ctx[14], false, false, false),
				listen_dev(a, "blur", /*blur_handler*/ ctx[15], false, false, false),
				listen_dev(a, "change", /*change_handler*/ ctx[16], false, false, false)
			];
		},
		p: function update(ctx, dirty) {
			if (default_slot) {
				if (default_slot.p && dirty & /*$$scope*/ 2048) {
					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[11], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[11], dirty, null));
				}
			}

			if (!current || dirty & /*cls*/ 256 && a_class_value !== (a_class_value = "" + (null_to_empty(/*cls*/ ctx[8]) + " svelte-1vr4zn8"))) {
				attr_dev(a, "class", a_class_value);
			}

			if (!current || dirty & /*disabled, href*/ 17 && a_href_value !== (a_href_value = !/*disabled*/ ctx[4] && /*href*/ ctx[0])) {
				attr_dev(a, "href", a_href_value);
			}

			if (!current || dirty & /*rel*/ 128) {
				attr_dev(a, "rel", /*rel*/ ctx[7]);
			}

			if (!current || dirty & /*tabindex*/ 8) {
				attr_dev(a, "tabindex", /*tabindex*/ ctx[3]);
			}

			if (dirty & /*cls, disabled*/ 272) {
				toggle_class(a, "disabled", /*disabled*/ ctx[4]);
			}

			if (dirty & /*cls, rounded*/ 288) {
				toggle_class(a, "rounded", /*rounded*/ ctx[5]);
			}

			if (dirty & /*cls, fab*/ 320) {
				toggle_class(a, "fab", /*fab*/ ctx[6]);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(a);
			if (default_slot) default_slot.d(detaching);
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$4.name,
		type: "if",
		source: "(156:0) {#if href != null}",
		ctx
	});

	return block;
}

function create_fragment$h(ctx) {
	let current_block_type_index;
	let if_block;
	let if_block_anchor;
	let current;
	const if_block_creators = [create_if_block$4, create_if_block_1$1, create_else_block];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*href*/ ctx[0] != null) return 0;
		if (/*type*/ ctx[1] === "submit") return 1;
		return 2;
	}

	current_block_type_index = select_block_type(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	const block = {
		c: function create() {
			if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if_blocks[current_block_type_index].m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				}

				transition_in(if_block, 1);
				if_block.m(if_block_anchor.parentNode, if_block_anchor);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if_blocks[current_block_type_index].d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$h.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$h($$self, $$props, $$invalidate) {
	let { class: className = "" } = $$props;
	let { href = null } = $$props;
	let { type = null } = $$props;
	let { value = null } = $$props;
	let { tabindex = null } = $$props;
	let { variant = "normal" } = $$props; // normal primary secondary add remove
	let { disabled = false } = $$props;
	let { rounded = false } = $$props;
	let { fab = false } = $$props;
	let { rel = null } = $$props;

	const writable_props = [
		"class",
		"href",
		"type",
		"value",
		"tabindex",
		"variant",
		"disabled",
		"rounded",
		"fab",
		"rel"
	];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Button> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("Button", $$slots, ['default']);

	function click_handler(event) {
		bubble($$self, event);
	}

	function focus_handler(event) {
		bubble($$self, event);
	}

	function blur_handler(event) {
		bubble($$self, event);
	}

	function change_handler(event) {
		bubble($$self, event);
	}

	function click_handler_1(event) {
		bubble($$self, event);
	}

	function focus_handler_1(event) {
		bubble($$self, event);
	}

	function blur_handler_1(event) {
		bubble($$self, event);
	}

	function change_handler_1(event) {
		bubble($$self, event);
	}

	function click_handler_2(event) {
		bubble($$self, event);
	}

	function focus_handler_2(event) {
		bubble($$self, event);
	}

	function blur_handler_2(event) {
		bubble($$self, event);
	}

	function change_handler_2(event) {
		bubble($$self, event);
	}

	$$self.$set = $$props => {
		if ("class" in $$props) $$invalidate(9, className = $$props.class);
		if ("href" in $$props) $$invalidate(0, href = $$props.href);
		if ("type" in $$props) $$invalidate(1, type = $$props.type);
		if ("value" in $$props) $$invalidate(2, value = $$props.value);
		if ("tabindex" in $$props) $$invalidate(3, tabindex = $$props.tabindex);
		if ("variant" in $$props) $$invalidate(10, variant = $$props.variant);
		if ("disabled" in $$props) $$invalidate(4, disabled = $$props.disabled);
		if ("rounded" in $$props) $$invalidate(5, rounded = $$props.rounded);
		if ("fab" in $$props) $$invalidate(6, fab = $$props.fab);
		if ("rel" in $$props) $$invalidate(7, rel = $$props.rel);
		if ("$$scope" in $$props) $$invalidate(11, $$scope = $$props.$$scope);
	};

	$$self.$capture_state = () => ({
		className,
		href,
		type,
		value,
		tabindex,
		variant,
		disabled,
		rounded,
		fab,
		rel,
		cls
	});

	$$self.$inject_state = $$props => {
		if ("className" in $$props) $$invalidate(9, className = $$props.className);
		if ("href" in $$props) $$invalidate(0, href = $$props.href);
		if ("type" in $$props) $$invalidate(1, type = $$props.type);
		if ("value" in $$props) $$invalidate(2, value = $$props.value);
		if ("tabindex" in $$props) $$invalidate(3, tabindex = $$props.tabindex);
		if ("variant" in $$props) $$invalidate(10, variant = $$props.variant);
		if ("disabled" in $$props) $$invalidate(4, disabled = $$props.disabled);
		if ("rounded" in $$props) $$invalidate(5, rounded = $$props.rounded);
		if ("fab" in $$props) $$invalidate(6, fab = $$props.fab);
		if ("rel" in $$props) $$invalidate(7, rel = $$props.rel);
		if ("cls" in $$props) $$invalidate(8, cls = $$props.cls);
	};

	let cls;

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*variant, className*/ 1536) {
			 $$invalidate(8, cls = `button ${variant} ${className}`);
		}
	};

	return [
		href,
		type,
		value,
		tabindex,
		disabled,
		rounded,
		fab,
		rel,
		cls,
		className,
		variant,
		$$scope,
		$$slots,
		click_handler,
		focus_handler,
		blur_handler,
		change_handler,
		click_handler_1,
		focus_handler_1,
		blur_handler_1,
		change_handler_1,
		click_handler_2,
		focus_handler_2,
		blur_handler_2,
		change_handler_2
	];
}

class Button extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$h, create_fragment$h, safe_not_equal, {
			class: 9,
			href: 0,
			type: 1,
			value: 2,
			tabindex: 3,
			variant: 10,
			disabled: 4,
			rounded: 5,
			fab: 6,
			rel: 7
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Button",
			options,
			id: create_fragment$h.name
		});
	}

	get class() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set class(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get href() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set href(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get type() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set type(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get value() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set value(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get tabindex() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set tabindex(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get variant() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set variant(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get disabled() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set disabled(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get rounded() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set rounded(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get fab() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set fab(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get rel() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set rel(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules/svelte-material-icons/CheckCircleOutline.svelte generated by Svelte v3.21.0 */

const file$h = "node_modules/svelte-material-icons/CheckCircleOutline.svelte";

function create_fragment$i(ctx) {
	let svg;
	let path;

	const block = {
		c: function create() {
			svg = svg_element("svg");
			path = svg_element("path");
			attr_dev(path, "d", "M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20M16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z");
			attr_dev(path, "fill", /*color*/ ctx[2]);
			add_location(path, file$h, 8, 59, 234);
			attr_dev(svg, "width", /*width*/ ctx[0]);
			attr_dev(svg, "height", /*height*/ ctx[1]);
			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			add_location(svg, file$h, 8, 0, 175);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, svg, anchor);
			append_dev(svg, path);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*color*/ 4) {
				attr_dev(path, "fill", /*color*/ ctx[2]);
			}

			if (dirty & /*width*/ 1) {
				attr_dev(svg, "width", /*width*/ ctx[0]);
			}

			if (dirty & /*height*/ 2) {
				attr_dev(svg, "height", /*height*/ ctx[1]);
			}

			if (dirty & /*viewBox*/ 8) {
				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(svg);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$i.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$i($$self, $$props, $$invalidate) {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	const writable_props = ["size", "width", "height", "color", "viewBox"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<CheckCircleOutline> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("CheckCircleOutline", $$slots, []);

	$$self.$set = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

	$$self.$inject_state = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [width, height, color, viewBox, size];
}

class CheckCircleOutline extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$i, create_fragment$i, safe_not_equal, {
			size: 4,
			width: 0,
			height: 1,
			color: 2,
			viewBox: 3
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "CheckCircleOutline",
			options,
			id: create_fragment$i.name
		});
	}

	get size() {
		throw new Error("<CheckCircleOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set size(value) {
		throw new Error("<CheckCircleOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get width() {
		throw new Error("<CheckCircleOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set width(value) {
		throw new Error("<CheckCircleOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get height() {
		throw new Error("<CheckCircleOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set height(value) {
		throw new Error("<CheckCircleOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get color() {
		throw new Error("<CheckCircleOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set color(value) {
		throw new Error("<CheckCircleOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get viewBox() {
		throw new Error("<CheckCircleOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set viewBox(value) {
		throw new Error("<CheckCircleOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules/svelte-material-icons/CloseCircleOutline.svelte generated by Svelte v3.21.0 */

const file$i = "node_modules/svelte-material-icons/CloseCircleOutline.svelte";

function create_fragment$j(ctx) {
	let svg;
	let path;

	const block = {
		c: function create() {
			svg = svg_element("svg");
			path = svg_element("path");
			attr_dev(path, "d", "M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2C6.47,2 2,6.47 2,12C2,17.53 6.47,22 12,22C17.53,22 22,17.53 22,12C22,6.47 17.53,2 12,2M14.59,8L12,10.59L9.41,8L8,9.41L10.59,12L8,14.59L9.41,16L12,13.41L14.59,16L16,14.59L13.41,12L16,9.41L14.59,8Z");
			attr_dev(path, "fill", /*color*/ ctx[2]);
			add_location(path, file$i, 8, 59, 234);
			attr_dev(svg, "width", /*width*/ ctx[0]);
			attr_dev(svg, "height", /*height*/ ctx[1]);
			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			add_location(svg, file$i, 8, 0, 175);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, svg, anchor);
			append_dev(svg, path);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*color*/ 4) {
				attr_dev(path, "fill", /*color*/ ctx[2]);
			}

			if (dirty & /*width*/ 1) {
				attr_dev(svg, "width", /*width*/ ctx[0]);
			}

			if (dirty & /*height*/ 2) {
				attr_dev(svg, "height", /*height*/ ctx[1]);
			}

			if (dirty & /*viewBox*/ 8) {
				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(svg);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$j.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$j($$self, $$props, $$invalidate) {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	const writable_props = ["size", "width", "height", "color", "viewBox"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<CloseCircleOutline> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("CloseCircleOutline", $$slots, []);

	$$self.$set = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

	$$self.$inject_state = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [width, height, color, viewBox, size];
}

class CloseCircleOutline extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$j, create_fragment$j, safe_not_equal, {
			size: 4,
			width: 0,
			height: 1,
			color: 2,
			viewBox: 3
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "CloseCircleOutline",
			options,
			id: create_fragment$j.name
		});
	}

	get size() {
		throw new Error("<CloseCircleOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set size(value) {
		throw new Error("<CloseCircleOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get width() {
		throw new Error("<CloseCircleOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set width(value) {
		throw new Error("<CloseCircleOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get height() {
		throw new Error("<CloseCircleOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set height(value) {
		throw new Error("<CloseCircleOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get color() {
		throw new Error("<CloseCircleOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set color(value) {
		throw new Error("<CloseCircleOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get viewBox() {
		throw new Error("<CloseCircleOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set viewBox(value) {
		throw new Error("<CloseCircleOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules/svelte-material-icons/InformationOutline.svelte generated by Svelte v3.21.0 */

const file$j = "node_modules/svelte-material-icons/InformationOutline.svelte";

function create_fragment$k(ctx) {
	let svg;
	let path;

	const block = {
		c: function create() {
			svg = svg_element("svg");
			path = svg_element("path");
			attr_dev(path, "d", "M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z");
			attr_dev(path, "fill", /*color*/ ctx[2]);
			add_location(path, file$j, 8, 59, 234);
			attr_dev(svg, "width", /*width*/ ctx[0]);
			attr_dev(svg, "height", /*height*/ ctx[1]);
			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			add_location(svg, file$j, 8, 0, 175);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, svg, anchor);
			append_dev(svg, path);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*color*/ 4) {
				attr_dev(path, "fill", /*color*/ ctx[2]);
			}

			if (dirty & /*width*/ 1) {
				attr_dev(svg, "width", /*width*/ ctx[0]);
			}

			if (dirty & /*height*/ 2) {
				attr_dev(svg, "height", /*height*/ ctx[1]);
			}

			if (dirty & /*viewBox*/ 8) {
				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(svg);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$k.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$k($$self, $$props, $$invalidate) {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	const writable_props = ["size", "width", "height", "color", "viewBox"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<InformationOutline> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("InformationOutline", $$slots, []);

	$$self.$set = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

	$$self.$inject_state = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [width, height, color, viewBox, size];
}

class InformationOutline extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$k, create_fragment$k, safe_not_equal, {
			size: 4,
			width: 0,
			height: 1,
			color: 2,
			viewBox: 3
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "InformationOutline",
			options,
			id: create_fragment$k.name
		});
	}

	get size() {
		throw new Error("<InformationOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set size(value) {
		throw new Error("<InformationOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get width() {
		throw new Error("<InformationOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set width(value) {
		throw new Error("<InformationOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get height() {
		throw new Error("<InformationOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set height(value) {
		throw new Error("<InformationOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get color() {
		throw new Error("<InformationOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set color(value) {
		throw new Error("<InformationOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get viewBox() {
		throw new Error("<InformationOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set viewBox(value) {
		throw new Error("<InformationOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules/svelte-material-icons/AlertOutline.svelte generated by Svelte v3.21.0 */

const file$k = "node_modules/svelte-material-icons/AlertOutline.svelte";

function create_fragment$l(ctx) {
	let svg;
	let path;

	const block = {
		c: function create() {
			svg = svg_element("svg");
			path = svg_element("path");
			attr_dev(path, "d", "M12,2L1,21H23M12,6L19.53,19H4.47M11,10V14H13V10M11,16V18H13V16");
			attr_dev(path, "fill", /*color*/ ctx[2]);
			add_location(path, file$k, 8, 59, 234);
			attr_dev(svg, "width", /*width*/ ctx[0]);
			attr_dev(svg, "height", /*height*/ ctx[1]);
			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			add_location(svg, file$k, 8, 0, 175);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, svg, anchor);
			append_dev(svg, path);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*color*/ 4) {
				attr_dev(path, "fill", /*color*/ ctx[2]);
			}

			if (dirty & /*width*/ 1) {
				attr_dev(svg, "width", /*width*/ ctx[0]);
			}

			if (dirty & /*height*/ 2) {
				attr_dev(svg, "height", /*height*/ ctx[1]);
			}

			if (dirty & /*viewBox*/ 8) {
				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(svg);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$l.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$l($$self, $$props, $$invalidate) {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	const writable_props = ["size", "width", "height", "color", "viewBox"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<AlertOutline> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("AlertOutline", $$slots, []);

	$$self.$set = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

	$$self.$inject_state = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [width, height, color, viewBox, size];
}

class AlertOutline extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$l, create_fragment$l, safe_not_equal, {
			size: 4,
			width: 0,
			height: 1,
			color: 2,
			viewBox: 3
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "AlertOutline",
			options,
			id: create_fragment$l.name
		});
	}

	get size() {
		throw new Error("<AlertOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set size(value) {
		throw new Error("<AlertOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get width() {
		throw new Error("<AlertOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set width(value) {
		throw new Error("<AlertOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get height() {
		throw new Error("<AlertOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set height(value) {
		throw new Error("<AlertOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get color() {
		throw new Error("<AlertOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set color(value) {
		throw new Error("<AlertOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get viewBox() {
		throw new Error("<AlertOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set viewBox(value) {
		throw new Error("<AlertOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src/comp/Notify/Notify.svelte generated by Svelte v3.21.0 */
const file$l = "src/comp/Notify/Notify.svelte";

function get_each_context$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[9] = list[i];
	return child_ctx;
}

// (142:4) {#if message.icon }
function create_if_block_2$1(ctx) {
	let div;
	let current;
	var switch_value = /*message*/ ctx[9].icon;

	function switch_props(ctx) {
		return { $$inline: true };
	}

	if (switch_value) {
		var switch_instance = new switch_value(switch_props());
	}

	const block = {
		c: function create() {
			div = element("div");
			if (switch_instance) create_component(switch_instance.$$.fragment);
			attr_dev(div, "class", "message-icon svelte-unifbx");
			add_location(div, file$l, 142, 6, 2994);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			if (switch_instance) {
				mount_component(switch_instance, div, null);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (switch_value !== (switch_value = /*message*/ ctx[9].icon)) {
				if (switch_instance) {
					group_outros();
					const old_component = switch_instance;

					transition_out(old_component.$$.fragment, 1, 0, () => {
						destroy_component(old_component, 1);
					});

					check_outros();
				}

				if (switch_value) {
					switch_instance = new switch_value(switch_props());
					create_component(switch_instance.$$.fragment);
					transition_in(switch_instance.$$.fragment, 1);
					mount_component(switch_instance, div, null);
				} else {
					switch_instance = null;
				}
			}
		},
		i: function intro(local) {
			if (current) return;
			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (switch_instance) destroy_component(switch_instance);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2$1.name,
		type: "if",
		source: "(142:4) {#if message.icon }",
		ctx
	});

	return block;
}

// (150:6) {:else }
function create_else_block$1(ctx) {
	let t_value = /*message*/ ctx[9].text + "";
	let t;

	const block = {
		c: function create() {
			t = text(t_value);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*messages*/ 1 && t_value !== (t_value = /*message*/ ctx[9].text + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block$1.name,
		type: "else",
		source: "(150:6) {:else }",
		ctx
	});

	return block;
}

// (148:6) {#if message.html != null }
function create_if_block_1$2(ctx) {
	let html_tag;
	let raw_value = /*message*/ ctx[9].html + "";

	const block = {
		c: function create() {
			html_tag = new HtmlTag(raw_value, null);
		},
		m: function mount(target, anchor) {
			html_tag.m(target, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*messages*/ 1 && raw_value !== (raw_value = /*message*/ ctx[9].html + "")) html_tag.p(raw_value);
		},
		d: function destroy(detaching) {
			if (detaching) html_tag.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$2.name,
		type: "if",
		source: "(148:6) {#if message.html != null }",
		ctx
	});

	return block;
}

// (155:6) {#if message.action}
function create_if_block$5(ctx) {
	let div;
	let current;

	function click_handler(...args) {
		return /*click_handler*/ ctx[8](/*message*/ ctx[9], ...args);
	}

	const button = new Button({
			props: {
				$$slots: { default: [create_default_slot$2] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	button.$on("click", click_handler);

	const block = {
		c: function create() {
			div = element("div");
			create_component(button.$$.fragment);
			attr_dev(div, "class", "message-action svelte-unifbx");
			add_location(div, file$l, 155, 8, 3328);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			mount_component(button, div, null);
			current = true;
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			const button_changes = {};

			if (dirty & /*$$scope, messages*/ 4097) {
				button_changes.$$scope = { dirty, ctx };
			}

			button.$set(button_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(button.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(button.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_component(button);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$5.name,
		type: "if",
		source: "(155:6) {#if message.action}",
		ctx
	});

	return block;
}

// (157:10) <Button on:click={event => message.action.fn(event, message)}>
function create_default_slot$2(ctx) {
	let t_value = /*message*/ ctx[9].action.text + "";
	let t;

	const block = {
		c: function create() {
			t = text(t_value);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*messages*/ 1 && t_value !== (t_value = /*message*/ ctx[9].action.text + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$2.name,
		type: "slot",
		source: "(157:10) <Button on:click={event => message.action.fn(event, message)}>",
		ctx
	});

	return block;
}

// (136:2) {#each messages as message (message)}
function create_each_block$1(key_1, ctx) {
	let div1;
	let t0;
	let div0;
	let div0_class_value;
	let t1;
	let t2;
	let div1_class_value;
	let div1_transition;
	let rect;
	let stop_animation = noop;
	let current;
	let if_block0 = /*message*/ ctx[9].icon && create_if_block_2$1(ctx);

	function select_block_type(ctx, dirty) {
		if (/*message*/ ctx[9].html != null) return create_if_block_1$2;
		return create_else_block$1;
	}

	let current_block_type = select_block_type(ctx);
	let if_block1 = current_block_type(ctx);
	let if_block2 = /*message*/ ctx[9].action && create_if_block$5(ctx);

	const block = {
		key: key_1,
		first: null,
		c: function create() {
			div1 = element("div");
			if (if_block0) if_block0.c();
			t0 = space();
			div0 = element("div");
			if_block1.c();
			t1 = space();
			if (if_block2) if_block2.c();
			t2 = space();
			attr_dev(div0, "class", div0_class_value = "message-content " + (/*message*/ ctx[9].html != null ? "html" : "text") + " svelte-unifbx");
			add_location(div0, file$l, 146, 4, 3097);
			attr_dev(div1, "class", div1_class_value = "message " + /*message*/ ctx[9].variant + " svelte-unifbx");
			add_location(div1, file$l, 136, 4, 2827);
			this.first = div1;
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);
			if (if_block0) if_block0.m(div1, null);
			append_dev(div1, t0);
			append_dev(div1, div0);
			if_block1.m(div0, null);
			append_dev(div1, t1);
			if (if_block2) if_block2.m(div1, null);
			append_dev(div1, t2);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (/*message*/ ctx[9].icon) {
				if (if_block0) {
					if_block0.p(ctx, dirty);

					if (dirty & /*messages*/ 1) {
						transition_in(if_block0, 1);
					}
				} else {
					if_block0 = create_if_block_2$1(ctx);
					if_block0.c();
					transition_in(if_block0, 1);
					if_block0.m(div1, t0);
				}
			} else if (if_block0) {
				group_outros();

				transition_out(if_block0, 1, 1, () => {
					if_block0 = null;
				});

				check_outros();
			}

			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block1) {
				if_block1.p(ctx, dirty);
			} else {
				if_block1.d(1);
				if_block1 = current_block_type(ctx);

				if (if_block1) {
					if_block1.c();
					if_block1.m(div0, null);
				}
			}

			if (!current || dirty & /*messages*/ 1 && div0_class_value !== (div0_class_value = "message-content " + (/*message*/ ctx[9].html != null ? "html" : "text") + " svelte-unifbx")) {
				attr_dev(div0, "class", div0_class_value);
			}

			if (/*message*/ ctx[9].action) {
				if (if_block2) {
					if_block2.p(ctx, dirty);

					if (dirty & /*messages*/ 1) {
						transition_in(if_block2, 1);
					}
				} else {
					if_block2 = create_if_block$5(ctx);
					if_block2.c();
					transition_in(if_block2, 1);
					if_block2.m(div1, t2);
				}
			} else if (if_block2) {
				group_outros();

				transition_out(if_block2, 1, 1, () => {
					if_block2 = null;
				});

				check_outros();
			}

			if (!current || dirty & /*messages*/ 1 && div1_class_value !== (div1_class_value = "message " + /*message*/ ctx[9].variant + " svelte-unifbx")) {
				attr_dev(div1, "class", div1_class_value);
			}
		},
		r: function measure() {
			rect = div1.getBoundingClientRect();
		},
		f: function fix() {
			fix_position(div1);
			stop_animation();
			add_transform(div1, rect);
		},
		a: function animate() {
			stop_animation();
			stop_animation = create_animation(div1, rect, flip, { duration: 200 });
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block0);
			transition_in(if_block2);

			add_render_callback(() => {
				if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fly, { x: -200, duration: 250 }, true);
				div1_transition.run(1);
			});

			current = true;
		},
		o: function outro(local) {
			transition_out(if_block0);
			transition_out(if_block2);
			if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fly, { x: -200, duration: 250 }, false);
			div1_transition.run(0);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div1);
			if (if_block0) if_block0.d();
			if_block1.d();
			if (if_block2) if_block2.d();
			if (detaching && div1_transition) div1_transition.end();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$1.name,
		type: "each",
		source: "(136:2) {#each messages as message (message)}",
		ctx
	});

	return block;
}

function create_fragment$m(ctx) {
	let div;
	let each_blocks = [];
	let each_1_lookup = new Map();
	let div_class_value;
	let current;
	let each_value = /*messages*/ ctx[0];
	validate_each_argument(each_value);
	const get_key = ctx => /*message*/ ctx[9];
	validate_each_keys(ctx, each_value, get_each_context$1, get_key);

	for (let i = 0; i < each_value.length; i += 1) {
		let child_ctx = get_each_context$1(ctx, each_value, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
	}

	const block = {
		c: function create() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(div, "class", div_class_value = "messenger " + /*className*/ ctx[1] + " svelte-unifbx");
			add_location(div, file$l, 134, 0, 2747);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}

			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*messages*/ 1) {
				const each_value = /*messages*/ ctx[0];
				validate_each_argument(each_value);
				group_outros();
				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].r();
				validate_each_keys(ctx, each_value, get_each_context$1, get_key);
				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, fix_and_outro_and_destroy_block, create_each_block$1, null, get_each_context$1);
				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].a();
				check_outros();
			}

			if (!current || dirty & /*className*/ 2 && div_class_value !== (div_class_value = "messenger " + /*className*/ ctx[1] + " svelte-unifbx")) {
				attr_dev(div, "class", div_class_value);
			}
		},
		i: function intro(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o: function outro(local) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].d();
			}
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$m.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$m($$self, $$props, $$invalidate) {
	const icons = { success: CheckCircleOutline, error: CloseCircleOutline, info: InformationOutline, warning: AlertOutline };
	let { class: className = "" } = $$props;
	let { messages = [] } = $$props;
	let { maxStack = 3 } = $$props;
	let { duration = 3000 } = $$props;

	const add = src => {
		let message;

		if (typeof src === "string") {
			message = { text: stc };
		} else {
			message = { ...src };
		}

		message.variant = message.variant || "normal";
		message.duration = message.duration || duration;
		message.persist = !!message.persist;

		message.icon = message.icon || (message.variant === "normal"
		? null
		: icons[message.variant]);

		$$invalidate(0, messages = [...messages, message]);

		if (!message.persist) {
			setTimeout(() => remove(message), message.duration);
		}

		if (messages.length > maxStack) {
			$$invalidate(0, messages = messages.slice(1));
		}
	};

	const remove = key => {
		$$invalidate(0, messages = messages.filter(message => message != key));
	};

	const clear = () => {
		$$invalidate(0, messages = []);
	};

	const writable_props = ["class", "messages", "maxStack", "duration"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Notify> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("Notify", $$slots, []);
	const click_handler = (message, event) => message.action.fn(event, message);

	$$self.$set = $$props => {
		if ("class" in $$props) $$invalidate(1, className = $$props.class);
		if ("messages" in $$props) $$invalidate(0, messages = $$props.messages);
		if ("maxStack" in $$props) $$invalidate(2, maxStack = $$props.maxStack);
		if ("duration" in $$props) $$invalidate(3, duration = $$props.duration);
	};

	$$self.$capture_state = () => ({
		fly,
		flip,
		Button,
		success: CheckCircleOutline,
		error: CloseCircleOutline,
		info: InformationOutline,
		warning: AlertOutline,
		icons,
		className,
		messages,
		maxStack,
		duration,
		add,
		remove,
		clear
	});

	$$self.$inject_state = $$props => {
		if ("className" in $$props) $$invalidate(1, className = $$props.className);
		if ("messages" in $$props) $$invalidate(0, messages = $$props.messages);
		if ("maxStack" in $$props) $$invalidate(2, maxStack = $$props.maxStack);
		if ("duration" in $$props) $$invalidate(3, duration = $$props.duration);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		messages,
		className,
		maxStack,
		duration,
		add,
		remove,
		clear,
		icons,
		click_handler
	];
}

class Notify extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$m, create_fragment$m, safe_not_equal, {
			class: 1,
			messages: 0,
			maxStack: 2,
			duration: 3,
			add: 4,
			remove: 5,
			clear: 6
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Notify",
			options,
			id: create_fragment$m.name
		});
	}

	get class() {
		return this.$$.ctx[1];
	}

	set class(className) {
		this.$set({ class: className });
		flush();
	}

	get messages() {
		return this.$$.ctx[0];
	}

	set messages(messages) {
		this.$set({ messages });
		flush();
	}

	get maxStack() {
		return this.$$.ctx[2];
	}

	set maxStack(maxStack) {
		this.$set({ maxStack });
		flush();
	}

	get duration() {
		return this.$$.ctx[3];
	}

	set duration(duration) {
		this.$set({ duration });
		flush();
	}

	get add() {
		return this.$$.ctx[4];
	}

	set add(value) {
		throw new Error("<Notify>: Cannot set read-only property 'add'");
	}

	get remove() {
		return this.$$.ctx[5];
	}

	set remove(value) {
		throw new Error("<Notify>: Cannot set read-only property 'remove'");
	}

	get clear() {
		return this.$$.ctx[6];
	}

	set clear(value) {
		throw new Error("<Notify>: Cannot set read-only property 'clear'");
	}
}

let notify = null;
const getNotifier = () => {
    if (notify != null)
        return notify;
    notify = new Notify({ target: document.body });
    return notify;
};

/* src/comp/Dialog/Dialog.svelte generated by Svelte v3.21.0 */
const file$m = "src/comp/Dialog/Dialog.svelte";

// (75:0) {#if isOpen}
function create_if_block$6(ctx) {
	let x_overlay;
	let x_dialog;
	let t;
	let x_overlay_transition;
	let current;
	let dispose;
	let if_block = /*title*/ ctx[1] != null && create_if_block_1$3(ctx);
	const default_slot_template = /*$$slots*/ ctx[9].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

	const block = {
		c: function create() {
			x_overlay = element("x-overlay");
			x_dialog = element("x-dialog");
			if (if_block) if_block.c();
			t = space();
			if (default_slot) default_slot.c();
			set_custom_element_data(x_dialog, "class", "elevation-4 svelte-1dwhcuk");
			add_location(x_dialog, file$m, 76, 8, 1580);
			set_custom_element_data(x_overlay, "class", "svelte-1dwhcuk");
			toggle_class(x_overlay, "modal", /*modal*/ ctx[3]);
			add_location(x_overlay, file$m, 75, 4, 1466);
		},
		m: function mount(target, anchor, remount) {
			insert_dev(target, x_overlay, anchor);
			append_dev(x_overlay, x_dialog);
			if (if_block) if_block.m(x_dialog, null);
			append_dev(x_dialog, t);

			if (default_slot) {
				default_slot.m(x_dialog, null);
			}

			current = true;
			if (remount) run_all(dispose);

			dispose = [
				listen_dev(x_dialog, "click", stop_propagation(/*click_handler*/ ctx[10]), false, false, true),
				listen_dev(x_overlay, "click", /*click_handler_1*/ ctx[11], false, false, false)
			];
		},
		p: function update(ctx, dirty) {
			if (/*title*/ ctx[1] != null) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_1$3(ctx);
					if_block.c();
					if_block.m(x_dialog, t);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (default_slot) {
				if (default_slot.p && dirty & /*$$scope*/ 256) {
					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[8], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null));
				}
			}

			if (dirty & /*modal*/ 8) {
				toggle_class(x_overlay, "modal", /*modal*/ ctx[3]);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);

			add_render_callback(() => {
				if (!x_overlay_transition) x_overlay_transition = create_bidirectional_transition(x_overlay, fade, { duration: 200 }, true);
				x_overlay_transition.run(1);
			});

			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			if (!x_overlay_transition) x_overlay_transition = create_bidirectional_transition(x_overlay, fade, { duration: 200 }, false);
			x_overlay_transition.run(0);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(x_overlay);
			if (if_block) if_block.d();
			if (default_slot) default_slot.d(detaching);
			if (detaching && x_overlay_transition) x_overlay_transition.end();
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$6.name,
		type: "if",
		source: "(75:0) {#if isOpen}",
		ctx
	});

	return block;
}

// (78:12) {#if title != null}
function create_if_block_1$3(ctx) {
	let x_title;
	let t;

	const block = {
		c: function create() {
			x_title = element("x-title");
			t = text(/*title*/ ctx[1]);
			set_custom_element_data(x_title, "class", "svelte-1dwhcuk");
			add_location(x_title, file$m, 78, 16, 1684);
		},
		m: function mount(target, anchor) {
			insert_dev(target, x_title, anchor);
			append_dev(x_title, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*title*/ 2) set_data_dev(t, /*title*/ ctx[1]);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(x_title);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$3.name,
		type: "if",
		source: "(78:12) {#if title != null}",
		ctx
	});

	return block;
}

function create_fragment$n(ctx) {
	let if_block_anchor;
	let current;
	let dispose;
	let if_block = /*isOpen*/ ctx[0] && create_if_block$6(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor, remount) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
			if (remount) dispose();
			dispose = listen_dev(window, "keydown", /*keydown*/ ctx[4], true, false, false);
		},
		p: function update(ctx, [dirty]) {
			if (/*isOpen*/ ctx[0]) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*isOpen*/ 1) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block$6(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$n.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$n($$self, $$props, $$invalidate) {
	let isOpen = false;
	let title;
	let onClose;
	let modal;

	const noop = () => {
		
	};

	const open = (args = {}) => {
		$$invalidate(1, title = args.title || null);
		$$invalidate(2, onClose = args.onClose || null);
		$$invalidate(3, modal = modal || false);
		$$invalidate(0, isOpen = true);
	};

	const close = () => {
		$$invalidate(3, modal = false);
		$$invalidate(2, onClose = null);
		$$invalidate(1, title = null);
		$$invalidate(0, isOpen = false);
	};

	const keydown = event => {
		if (isOpen && !modal && onClose && event.key === "Escape") {
			onClose();
		}
	};

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Dialog> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("Dialog", $$slots, ['default']);

	function click_handler(event) {
		bubble($$self, event);
	}

	const click_handler_1 = () => !modal && onClose && onClose();

	$$self.$set = $$props => {
		if ("$$scope" in $$props) $$invalidate(8, $$scope = $$props.$$scope);
	};

	$$self.$capture_state = () => ({
		fade,
		isOpen,
		title,
		onClose,
		modal,
		noop,
		open,
		close,
		keydown
	});

	$$self.$inject_state = $$props => {
		if ("isOpen" in $$props) $$invalidate(0, isOpen = $$props.isOpen);
		if ("title" in $$props) $$invalidate(1, title = $$props.title);
		if ("onClose" in $$props) $$invalidate(2, onClose = $$props.onClose);
		if ("modal" in $$props) $$invalidate(3, modal = $$props.modal);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		isOpen,
		title,
		onClose,
		modal,
		keydown,
		open,
		close,
		noop,
		$$scope,
		$$slots,
		click_handler,
		click_handler_1
	];
}

class Dialog extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$n, create_fragment$n, safe_not_equal, { open: 5, close: 6 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Dialog",
			options,
			id: create_fragment$n.name
		});
	}

	get open() {
		return this.$$.ctx[5];
	}

	set open(value) {
		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get close() {
		return this.$$.ctx[6];
	}

	set close(value) {
		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src/comp/TextField.svelte generated by Svelte v3.21.0 */

const file$n = "src/comp/TextField.svelte";

// (132:2) {:else}
function create_else_block$2(ctx) {
	let textarea;
	let textarea_style_value;
	let t;
	let if_block_anchor;
	let dispose;
	let if_block = /*label*/ ctx[3] != null && create_if_block_2$2(ctx);

	const block = {
		c: function create() {
			textarea = element("textarea");
			t = space();
			if (if_block) if_block.c();
			if_block_anchor = empty();
			attr_dev(textarea, "id", /*id*/ ctx[8]);
			attr_dev(textarea, "name", /*name*/ ctx[9]);
			textarea.value = /*value*/ ctx[0];
			textarea.readOnly = /*readonly*/ ctx[5];
			textarea.disabled = /*disabled*/ ctx[4];
			attr_dev(textarea, "rows", /*rows*/ ctx[14]);
			attr_dev(textarea, "spellcheck", /*spellcheck*/ ctx[6]);

			attr_dev(textarea, "style", textarea_style_value = /*resize*/ ctx[7]
			? `resize: " ${/*resize*/ ctx[7]}`
			: "");

			attr_dev(textarea, "class", "svelte-1dt36ba");
			add_location(textarea, file$n, 132, 4, 2434);
		},
		m: function mount(target, anchor, remount) {
			insert_dev(target, textarea, anchor);
			insert_dev(target, t, anchor);
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			if (remount) run_all(dispose);

			dispose = [
				listen_dev(textarea, "input", /*handleChange*/ ctx[16], false, false, false),
				listen_dev(textarea, "input", /*input_handler_1*/ ctx[24], false, false, false),
				listen_dev(textarea, "focus", /*focus_handler_1*/ ctx[25], false, false, false),
				listen_dev(textarea, "blur", /*blur_handler_1*/ ctx[26], false, false, false),
				listen_dev(textarea, "change", /*change_handler_1*/ ctx[27], false, false, false),
				listen_dev(textarea, "keypress", /*keypress_handler_1*/ ctx[28], false, false, false)
			];
		},
		p: function update(ctx, dirty) {
			if (dirty & /*id*/ 256) {
				attr_dev(textarea, "id", /*id*/ ctx[8]);
			}

			if (dirty & /*name*/ 512) {
				attr_dev(textarea, "name", /*name*/ ctx[9]);
			}

			if (dirty & /*value*/ 1) {
				prop_dev(textarea, "value", /*value*/ ctx[0]);
			}

			if (dirty & /*readonly*/ 32) {
				prop_dev(textarea, "readOnly", /*readonly*/ ctx[5]);
			}

			if (dirty & /*disabled*/ 16) {
				prop_dev(textarea, "disabled", /*disabled*/ ctx[4]);
			}

			if (dirty & /*rows*/ 16384) {
				attr_dev(textarea, "rows", /*rows*/ ctx[14]);
			}

			if (dirty & /*spellcheck*/ 64) {
				attr_dev(textarea, "spellcheck", /*spellcheck*/ ctx[6]);
			}

			if (dirty & /*resize*/ 128 && textarea_style_value !== (textarea_style_value = /*resize*/ ctx[7]
			? `resize: " ${/*resize*/ ctx[7]}`
			: "")) {
				attr_dev(textarea, "style", textarea_style_value);
			}

			if (/*label*/ ctx[3] != null) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_2$2(ctx);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(textarea);
			if (detaching) detach_dev(t);
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block$2.name,
		type: "else",
		source: "(132:2) {:else}",
		ctx
	});

	return block;
}

// (110:2) {#if !multiline}
function create_if_block$7(ctx) {
	let input;
	let t;
	let if_block_anchor;
	let dispose;
	let if_block = /*label*/ ctx[3] != null && create_if_block_1$4(ctx);

	const block = {
		c: function create() {
			input = element("input");
			t = space();
			if (if_block) if_block.c();
			if_block_anchor = empty();
			attr_dev(input, "id", /*id*/ ctx[8]);
			attr_dev(input, "name", /*name*/ ctx[9]);
			attr_dev(input, "type", /*type*/ ctx[2]);
			attr_dev(input, "step", /*step*/ ctx[10]);
			attr_dev(input, "max", /*max*/ ctx[11]);
			attr_dev(input, "min", /*min*/ ctx[12]);
			input.value = /*value*/ ctx[0];
			input.readOnly = /*readonly*/ ctx[5];
			input.disabled = /*disabled*/ ctx[4];
			attr_dev(input, "spellcheck", /*spellcheck*/ ctx[6]);
			attr_dev(input, "class", "svelte-1dt36ba");
			add_location(input, file$n, 110, 4, 2113);
		},
		m: function mount(target, anchor, remount) {
			insert_dev(target, input, anchor);
			insert_dev(target, t, anchor);
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			if (remount) run_all(dispose);

			dispose = [
				listen_dev(input, "input", /*handleChange*/ ctx[16], false, false, false),
				listen_dev(input, "input", /*input_handler*/ ctx[19], false, false, false),
				listen_dev(input, "focus", /*focus_handler*/ ctx[20], false, false, false),
				listen_dev(input, "blur", /*blur_handler*/ ctx[21], false, false, false),
				listen_dev(input, "change", /*change_handler*/ ctx[22], false, false, false),
				listen_dev(input, "keypress", /*keypress_handler*/ ctx[23], false, false, false)
			];
		},
		p: function update(ctx, dirty) {
			if (dirty & /*id*/ 256) {
				attr_dev(input, "id", /*id*/ ctx[8]);
			}

			if (dirty & /*name*/ 512) {
				attr_dev(input, "name", /*name*/ ctx[9]);
			}

			if (dirty & /*type*/ 4) {
				attr_dev(input, "type", /*type*/ ctx[2]);
			}

			if (dirty & /*step*/ 1024) {
				attr_dev(input, "step", /*step*/ ctx[10]);
			}

			if (dirty & /*max*/ 2048) {
				attr_dev(input, "max", /*max*/ ctx[11]);
			}

			if (dirty & /*min*/ 4096) {
				attr_dev(input, "min", /*min*/ ctx[12]);
			}

			if (dirty & /*value*/ 1 && input.value !== /*value*/ ctx[0]) {
				prop_dev(input, "value", /*value*/ ctx[0]);
			}

			if (dirty & /*readonly*/ 32) {
				prop_dev(input, "readOnly", /*readonly*/ ctx[5]);
			}

			if (dirty & /*disabled*/ 16) {
				prop_dev(input, "disabled", /*disabled*/ ctx[4]);
			}

			if (dirty & /*spellcheck*/ 64) {
				attr_dev(input, "spellcheck", /*spellcheck*/ ctx[6]);
			}

			if (/*label*/ ctx[3] != null) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_1$4(ctx);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(input);
			if (detaching) detach_dev(t);
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$7.name,
		type: "if",
		source: "(110:2) {#if !multiline}",
		ctx
	});

	return block;
}

// (149:4) {#if label != null}
function create_if_block_2$2(ctx) {
	let span;
	let t;

	const block = {
		c: function create() {
			span = element("span");
			t = text(/*label*/ ctx[3]);
			attr_dev(span, "class", "label svelte-1dt36ba");
			add_location(span, file$n, 149, 6, 2716);
		},
		m: function mount(target, anchor) {
			insert_dev(target, span, anchor);
			append_dev(span, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*label*/ 8) set_data_dev(t, /*label*/ ctx[3]);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(span);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2$2.name,
		type: "if",
		source: "(149:4) {#if label != null}",
		ctx
	});

	return block;
}

// (129:4) {#if label != null}
function create_if_block_1$4(ctx) {
	let span;
	let t;

	const block = {
		c: function create() {
			span = element("span");
			t = text(/*label*/ ctx[3]);
			attr_dev(span, "class", "label svelte-1dt36ba");
			add_location(span, file$n, 129, 6, 2375);
		},
		m: function mount(target, anchor) {
			insert_dev(target, span, anchor);
			append_dev(span, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*label*/ 8) set_data_dev(t, /*label*/ ctx[3]);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(span);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$4.name,
		type: "if",
		source: "(129:4) {#if label != null}",
		ctx
	});

	return block;
}

function create_fragment$o(ctx) {
	let div;
	let div_class_value;

	function select_block_type(ctx, dirty) {
		if (!/*multiline*/ ctx[13]) return create_if_block$7;
		return create_else_block$2;
	}

	let current_block_type = select_block_type(ctx);
	let if_block = current_block_type(ctx);

	const block = {
		c: function create() {
			div = element("div");
			if_block.c();
			attr_dev(div, "class", div_class_value = "text-field " + /*className*/ ctx[1] + " svelte-1dt36ba");
			toggle_class(div, "empty", /*empty*/ ctx[15]);
			toggle_class(div, "disabled", /*disabled*/ ctx[4]);
			toggle_class(div, "readonly", /*readonly*/ ctx[5]);
			toggle_class(div, "multiline", /*multiline*/ ctx[13]);
			add_location(div, file$n, 102, 0, 1983);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			if_block.m(div, null);
		},
		p: function update(ctx, [dirty]) {
			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(div, null);
				}
			}

			if (dirty & /*className*/ 2 && div_class_value !== (div_class_value = "text-field " + /*className*/ ctx[1] + " svelte-1dt36ba")) {
				attr_dev(div, "class", div_class_value);
			}

			if (dirty & /*className, empty*/ 32770) {
				toggle_class(div, "empty", /*empty*/ ctx[15]);
			}

			if (dirty & /*className, disabled*/ 18) {
				toggle_class(div, "disabled", /*disabled*/ ctx[4]);
			}

			if (dirty & /*className, readonly*/ 34) {
				toggle_class(div, "readonly", /*readonly*/ ctx[5]);
			}

			if (dirty & /*className, multiline*/ 8194) {
				toggle_class(div, "multiline", /*multiline*/ ctx[13]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if_block.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$o.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$o($$self, $$props, $$invalidate) {
	let { class: className = "" } = $$props;
	let { type = "text" } = $$props;
	let { value = "" } = $$props;
	let { label = null } = $$props;
	let { disabled = false } = $$props;
	let { readonly = false } = $$props;
	let { spellcheck = null } = $$props; // string
	let { resize = null } = $$props; // (none) vertical horizontal both unset initial inherit
	let { id = null } = $$props;
	let { name = null } = $$props;
	let { step = null } = $$props;
	let { max = null } = $$props;
	let { min = null } = $$props;
	let { multiline = false } = $$props;
	let { minrows = 1 } = $$props;
	let { maxrows = Infinity } = $$props;
	let rows = 1;

	const handleChange = event => {
		if (type === "number") {
			$$invalidate(0, value = parseFloat(event.target.value) || 0);
		} else {
			$$invalidate(0, value = event.target.value);
		}
	};

	const writable_props = [
		"class",
		"type",
		"value",
		"label",
		"disabled",
		"readonly",
		"spellcheck",
		"resize",
		"id",
		"name",
		"step",
		"max",
		"min",
		"multiline",
		"minrows",
		"maxrows"
	];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<TextField> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("TextField", $$slots, []);

	function input_handler(event) {
		bubble($$self, event);
	}

	function focus_handler(event) {
		bubble($$self, event);
	}

	function blur_handler(event) {
		bubble($$self, event);
	}

	function change_handler(event) {
		bubble($$self, event);
	}

	function keypress_handler(event) {
		bubble($$self, event);
	}

	function input_handler_1(event) {
		bubble($$self, event);
	}

	function focus_handler_1(event) {
		bubble($$self, event);
	}

	function blur_handler_1(event) {
		bubble($$self, event);
	}

	function change_handler_1(event) {
		bubble($$self, event);
	}

	function keypress_handler_1(event) {
		bubble($$self, event);
	}

	$$self.$set = $$props => {
		if ("class" in $$props) $$invalidate(1, className = $$props.class);
		if ("type" in $$props) $$invalidate(2, type = $$props.type);
		if ("value" in $$props) $$invalidate(0, value = $$props.value);
		if ("label" in $$props) $$invalidate(3, label = $$props.label);
		if ("disabled" in $$props) $$invalidate(4, disabled = $$props.disabled);
		if ("readonly" in $$props) $$invalidate(5, readonly = $$props.readonly);
		if ("spellcheck" in $$props) $$invalidate(6, spellcheck = $$props.spellcheck);
		if ("resize" in $$props) $$invalidate(7, resize = $$props.resize);
		if ("id" in $$props) $$invalidate(8, id = $$props.id);
		if ("name" in $$props) $$invalidate(9, name = $$props.name);
		if ("step" in $$props) $$invalidate(10, step = $$props.step);
		if ("max" in $$props) $$invalidate(11, max = $$props.max);
		if ("min" in $$props) $$invalidate(12, min = $$props.min);
		if ("multiline" in $$props) $$invalidate(13, multiline = $$props.multiline);
		if ("minrows" in $$props) $$invalidate(17, minrows = $$props.minrows);
		if ("maxrows" in $$props) $$invalidate(18, maxrows = $$props.maxrows);
	};

	$$self.$capture_state = () => ({
		className,
		type,
		value,
		label,
		disabled,
		readonly,
		spellcheck,
		resize,
		id,
		name,
		step,
		max,
		min,
		multiline,
		minrows,
		maxrows,
		rows,
		handleChange,
		empty
	});

	$$self.$inject_state = $$props => {
		if ("className" in $$props) $$invalidate(1, className = $$props.className);
		if ("type" in $$props) $$invalidate(2, type = $$props.type);
		if ("value" in $$props) $$invalidate(0, value = $$props.value);
		if ("label" in $$props) $$invalidate(3, label = $$props.label);
		if ("disabled" in $$props) $$invalidate(4, disabled = $$props.disabled);
		if ("readonly" in $$props) $$invalidate(5, readonly = $$props.readonly);
		if ("spellcheck" in $$props) $$invalidate(6, spellcheck = $$props.spellcheck);
		if ("resize" in $$props) $$invalidate(7, resize = $$props.resize);
		if ("id" in $$props) $$invalidate(8, id = $$props.id);
		if ("name" in $$props) $$invalidate(9, name = $$props.name);
		if ("step" in $$props) $$invalidate(10, step = $$props.step);
		if ("max" in $$props) $$invalidate(11, max = $$props.max);
		if ("min" in $$props) $$invalidate(12, min = $$props.min);
		if ("multiline" in $$props) $$invalidate(13, multiline = $$props.multiline);
		if ("minrows" in $$props) $$invalidate(17, minrows = $$props.minrows);
		if ("maxrows" in $$props) $$invalidate(18, maxrows = $$props.maxrows);
		if ("rows" in $$props) $$invalidate(14, rows = $$props.rows);
		if ("empty" in $$props) $$invalidate(15, empty = $$props.empty);
	};

	let empty;

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*multiline, minrows, maxrows, value*/ 401409) {
			 {
				if (multiline) {
					$$invalidate(14, rows = Math.max(minrows, Math.min(maxrows, value.split("\n").length)));
				}

				
			}
		}

		if ($$self.$$.dirty & /*value*/ 1) {
			 $$invalidate(15, empty = value === "");
		}
	};

	return [
		value,
		className,
		type,
		label,
		disabled,
		readonly,
		spellcheck,
		resize,
		id,
		name,
		step,
		max,
		min,
		multiline,
		rows,
		empty,
		handleChange,
		minrows,
		maxrows,
		input_handler,
		focus_handler,
		blur_handler,
		change_handler,
		keypress_handler,
		input_handler_1,
		focus_handler_1,
		blur_handler_1,
		change_handler_1,
		keypress_handler_1
	];
}

class TextField extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$o, create_fragment$o, safe_not_equal, {
			class: 1,
			type: 2,
			value: 0,
			label: 3,
			disabled: 4,
			readonly: 5,
			spellcheck: 6,
			resize: 7,
			id: 8,
			name: 9,
			step: 10,
			max: 11,
			min: 12,
			multiline: 13,
			minrows: 17,
			maxrows: 18
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "TextField",
			options,
			id: create_fragment$o.name
		});
	}

	get class() {
		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set class(value) {
		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get type() {
		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set type(value) {
		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get value() {
		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set value(value) {
		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get label() {
		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set label(value) {
		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get disabled() {
		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set disabled(value) {
		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get readonly() {
		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set readonly(value) {
		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get spellcheck() {
		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set spellcheck(value) {
		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get resize() {
		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set resize(value) {
		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get id() {
		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set id(value) {
		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get name() {
		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set name(value) {
		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get step() {
		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set step(value) {
		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get max() {
		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set max(value) {
		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get min() {
		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set min(value) {
		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get multiline() {
		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set multiline(value) {
		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get minrows() {
		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set minrows(value) {
		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get maxrows() {
		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set maxrows(value) {
		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src/comp/Dialog/Prompt.svelte generated by Svelte v3.21.0 */
const file$o = "src/comp/Dialog/Prompt.svelte";

// (72:8) <Button class="accept" on:click={accept} raised color="var(--pc)">
function create_default_slot_2$1(ctx) {
	let t_value = /*args*/ ctx[0].accept + "";
	let t;

	const block = {
		c: function create() {
			t = text(t_value);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*args*/ 1 && t_value !== (t_value = /*args*/ ctx[0].accept + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_2$1.name,
		type: "slot",
		source: "(72:8) <Button class=\\\"accept\\\" on:click={accept} raised color=\\\"var(--pc)\\\">",
		ctx
	});

	return block;
}

// (73:8) <Button class="cancel" on:click={cancel}>
function create_default_slot_1$1(ctx) {
	let t_value = /*args*/ ctx[0].cancel + "";
	let t;

	const block = {
		c: function create() {
			t = text(t_value);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*args*/ 1 && t_value !== (t_value = /*args*/ ctx[0].cancel + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_1$1.name,
		type: "slot",
		source: "(73:8) <Button class=\\\"cancel\\\" on:click={cancel}>",
		ctx
	});

	return block;
}

// (67:0) <Dialog bind:this={dialog} title={args.title}>
function create_default_slot$3(ctx) {
	let div0;
	let updating_value;
	let t0;
	let div1;
	let t1;
	let current;

	function textfield_value_binding(value) {
		/*textfield_value_binding*/ ctx[7].call(null, value);
	}

	let textfield_props = { label: /*args*/ ctx[0].label };

	if (/*$value*/ ctx[4] !== void 0) {
		textfield_props.value = /*$value*/ ctx[4];
	}

	const textfield = new TextField({ props: textfield_props, $$inline: true });
	binding_callbacks.push(() => bind(textfield, "value", textfield_value_binding));

	const button0 = new xe({
			props: {
				class: "accept",
				raised: true,
				color: "var(--pc)",
				$$slots: { default: [create_default_slot_2$1] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	button0.$on("click", function () {
		if (is_function(/*accept*/ ctx[1])) /*accept*/ ctx[1].apply(this, arguments);
	});

	const button1 = new xe({
			props: {
				class: "cancel",
				$$slots: { default: [create_default_slot_1$1] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	button1.$on("click", function () {
		if (is_function(/*cancel*/ ctx[2])) /*cancel*/ ctx[2].apply(this, arguments);
	});

	const block = {
		c: function create() {
			div0 = element("div");
			create_component(textfield.$$.fragment);
			t0 = space();
			div1 = element("div");
			create_component(button0.$$.fragment);
			t1 = space();
			create_component(button1.$$.fragment);
			attr_dev(div0, "class", "body svelte-1622lo9");
			add_location(div0, file$o, 67, 4, 1263);
			attr_dev(div1, "class", "actions svelte-1622lo9");
			add_location(div1, file$o, 70, 4, 1357);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div0, anchor);
			mount_component(textfield, div0, null);
			insert_dev(target, t0, anchor);
			insert_dev(target, div1, anchor);
			mount_component(button0, div1, null);
			append_dev(div1, t1);
			mount_component(button1, div1, null);
			current = true;
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			const textfield_changes = {};
			if (dirty & /*args*/ 1) textfield_changes.label = /*args*/ ctx[0].label;

			if (!updating_value && dirty & /*$value*/ 16) {
				updating_value = true;
				textfield_changes.value = /*$value*/ ctx[4];
				add_flush_callback(() => updating_value = false);
			}

			textfield.$set(textfield_changes);
			const button0_changes = {};

			if (dirty & /*$$scope, args*/ 513) {
				button0_changes.$$scope = { dirty, ctx };
			}

			button0.$set(button0_changes);
			const button1_changes = {};

			if (dirty & /*$$scope, args*/ 513) {
				button1_changes.$$scope = { dirty, ctx };
			}

			button1.$set(button1_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(textfield.$$.fragment, local);
			transition_in(button0.$$.fragment, local);
			transition_in(button1.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(textfield.$$.fragment, local);
			transition_out(button0.$$.fragment, local);
			transition_out(button1.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div0);
			destroy_component(textfield);
			if (detaching) detach_dev(t0);
			if (detaching) detach_dev(div1);
			destroy_component(button0);
			destroy_component(button1);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$3.name,
		type: "slot",
		source: "(67:0) <Dialog bind:this={dialog} title={args.title}>",
		ctx
	});

	return block;
}

function create_fragment$p(ctx) {
	let current;

	let dialog_1_props = {
		title: /*args*/ ctx[0].title,
		$$slots: { default: [create_default_slot$3] },
		$$scope: { ctx }
	};

	const dialog_1 = new Dialog({ props: dialog_1_props, $$inline: true });
	/*dialog_1_binding*/ ctx[8](dialog_1);

	const block = {
		c: function create() {
			create_component(dialog_1.$$.fragment);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			mount_component(dialog_1, target, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const dialog_1_changes = {};
			if (dirty & /*args*/ 1) dialog_1_changes.title = /*args*/ ctx[0].title;

			if (dirty & /*$$scope, cancel, args, accept, $value*/ 535) {
				dialog_1_changes.$$scope = { dirty, ctx };
			}

			dialog_1.$set(dialog_1_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(dialog_1.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(dialog_1.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			/*dialog_1_binding*/ ctx[8](null);
			destroy_component(dialog_1, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$p.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$p($$self, $$props, $$invalidate) {
	let $value;
	let args = {};
	let accept;
	let cancel;
	let value = writable("");
	validate_store(value, "value");
	component_subscribe($$self, value, value => $$invalidate(4, $value = value));
	let dialog;

	const open = async _args => {
		$$invalidate(0, args = _args);
		value.set(_args.value || "");

		return new Promise(resolve => {
				$$invalidate(1, accept = () => {
					dialog.close();
					resolve(value.get());
				});

				$$invalidate(2, cancel = () => {
					dialog.close();
					resolve(false);
				});

				dialog.open({
					title: args.title,
					modal: false,
					onClose: cancel
				});
			});
	};

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Prompt> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("Prompt", $$slots, []);

	function textfield_value_binding(value$1) {
		$value = value$1;
		value.set($value);
	}

	function dialog_1_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			$$invalidate(3, dialog = $$value);
		});
	}

	$$self.$capture_state = () => ({
		Dialog,
		writable,
		args,
		accept,
		cancel,
		value,
		dialog,
		open,
		Button: xe,
		TextField,
		$value
	});

	$$self.$inject_state = $$props => {
		if ("args" in $$props) $$invalidate(0, args = $$props.args);
		if ("accept" in $$props) $$invalidate(1, accept = $$props.accept);
		if ("cancel" in $$props) $$invalidate(2, cancel = $$props.cancel);
		if ("value" in $$props) $$invalidate(5, value = $$props.value);
		if ("dialog" in $$props) $$invalidate(3, dialog = $$props.dialog);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		args,
		accept,
		cancel,
		dialog,
		$value,
		value,
		open,
		textfield_value_binding,
		dialog_1_binding
	];
}

class Prompt extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$p, create_fragment$p, safe_not_equal, { open: 6 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Prompt",
			options,
			id: create_fragment$p.name
		});
	}

	get open() {
		return this.$$.ctx[6];
	}

	set open(value) {
		throw new Error("<Prompt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

let promptComponent = null;
const prompt = async (props) => {
    if (promptComponent == null) {
        promptComponent = new Prompt({ target: document.body });
    }
    return promptComponent.open(props);
};

/* src/comp/Dashboard/DrawerActions.svelte generated by Svelte v3.21.0 */
const file$p = "src/comp/Dashboard/DrawerActions.svelte";

function create_fragment$q(ctx) {
	let x_drawer_actions;
	let current;

	const draweritem = new DrawerItem({
			props: {
				label: /*locale*/ ctx[0].drawerActions.createMailbox.label,
				icon: FolderPlusOutline
			},
			$$inline: true
		});

	draweritem.$on("click", /*createFolder*/ ctx[3]);

	const block = {
		c: function create() {
			x_drawer_actions = element("x-drawer-actions");
			create_component(draweritem.$$.fragment);
			set_custom_element_data(x_drawer_actions, "class", "svelte-1gz124t");
			add_location(x_drawer_actions, file$p, 31, 0, 979);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, x_drawer_actions, anchor);
			mount_component(draweritem, x_drawer_actions, null);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const draweritem_changes = {};
			if (dirty & /*locale*/ 1) draweritem_changes.label = /*locale*/ ctx[0].drawerActions.createMailbox.label;
			draweritem.$set(draweritem_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(draweritem.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(draweritem.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(x_drawer_actions);
			destroy_component(draweritem);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$q.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$q($$self, $$props, $$invalidate) {
	let $l;
	let $trans;
	const { locale: l, trans } = getContext("app");
	validate_store(l, "l");
	component_subscribe($$self, l, value => $$invalidate(4, $l = value));
	validate_store(trans, "trans");
	component_subscribe($$self, trans, value => $$invalidate(5, $trans = value));
	let { locale = $l } = $$props;

	const createFolder = async () => {
		let path = await prompt(locale.dialogs.createMailbox);

		if (path && (path = path.trim())) {
			try {
				await createMailbox(path);

				getNotifier().add({
					variant: "success",
					text: $trans("drawerActions.createMailbox.success", { n: path })
				});
			} catch(e) {
				getNotifier().add({ variant: "error", text: e.message });
			}
		}
	};

	const writable_props = ["locale"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<DrawerActions> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("DrawerActions", $$slots, []);

	$$self.$set = $$props => {
		if ("locale" in $$props) $$invalidate(0, locale = $$props.locale);
	};

	$$self.$capture_state = () => ({
		DrawerItem,
		Add: FolderPlusOutline,
		getNotifier,
		createMailbox,
		getContext,
		l,
		trans,
		locale,
		prompt,
		createFolder,
		$l,
		$trans
	});

	$$self.$inject_state = $$props => {
		if ("locale" in $$props) $$invalidate(0, locale = $$props.locale);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [locale, l, trans, createFolder];
}

class DrawerActions extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$q, create_fragment$q, safe_not_equal, { locale: 0 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "DrawerActions",
			options,
			id: create_fragment$q.name
		});
	}

	get locale() {
		throw new Error("<DrawerActions>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set locale(value) {
		throw new Error("<DrawerActions>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src/comp/Dashboard/Drawer.svelte generated by Svelte v3.21.0 */
const file$q = "src/comp/Dashboard/Drawer.svelte";

// (91:0) {#if $hasDrawer}
function create_if_block$8(ctx) {
	let t0;
	let x_drawer;
	let div0;
	let t1;
	let span;
	let t3;
	let t4;
	let div1;
	let current;
	let if_block = /*$drawerOpenMobile*/ ctx[1] && create_if_block_1$5(ctx);
	const menubutton = new MenuButton({ props: { dark: true }, $$inline: true });
	const mailboxlist = new MailboxList({ $$inline: true });
	const draweractions = new DrawerActions({ $$inline: true });

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			t0 = space();
			x_drawer = element("x-drawer");
			div0 = element("div");
			create_component(menubutton.$$.fragment);
			t1 = space();
			span = element("span");
			span.textContent = "Raven";
			t3 = space();
			create_component(mailboxlist.$$.fragment);
			t4 = space();
			div1 = element("div");
			create_component(draweractions.$$.fragment);
			attr_dev(span, "class", "label svelte-18z12aq");
			add_location(span, file$q, 98, 6, 2126);
			attr_dev(div0, "class", "title svelte-18z12aq");
			add_location(div0, file$q, 96, 4, 2074);
			attr_dev(div1, "class", "actions svelte-18z12aq");
			add_location(div1, file$q, 105, 4, 2212);
			set_custom_element_data(x_drawer, "class", "svelte-18z12aq");
			toggle_class(x_drawer, "mobile-open", /*$drawerOpenMobile*/ ctx[1]);
			toggle_class(x_drawer, "desktop-open", /*$drawerOpenDesktop*/ ctx[2]);
			add_location(x_drawer, file$q, 95, 2, 1981);
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, t0, anchor);
			insert_dev(target, x_drawer, anchor);
			append_dev(x_drawer, div0);
			mount_component(menubutton, div0, null);
			append_dev(div0, t1);
			append_dev(div0, span);
			append_dev(x_drawer, t3);
			mount_component(mailboxlist, x_drawer, null);
			append_dev(x_drawer, t4);
			append_dev(x_drawer, div1);
			mount_component(draweractions, div1, null);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (/*$drawerOpenMobile*/ ctx[1]) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*$drawerOpenMobile*/ 2) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block_1$5(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(t0.parentNode, t0);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}

			if (dirty & /*$drawerOpenMobile*/ 2) {
				toggle_class(x_drawer, "mobile-open", /*$drawerOpenMobile*/ ctx[1]);
			}

			if (dirty & /*$drawerOpenDesktop*/ 4) {
				toggle_class(x_drawer, "desktop-open", /*$drawerOpenDesktop*/ ctx[2]);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			transition_in(menubutton.$$.fragment, local);
			transition_in(mailboxlist.$$.fragment, local);
			transition_in(draweractions.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			transition_out(menubutton.$$.fragment, local);
			transition_out(mailboxlist.$$.fragment, local);
			transition_out(draweractions.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(t0);
			if (detaching) detach_dev(x_drawer);
			destroy_component(menubutton);
			destroy_component(mailboxlist);
			destroy_component(draweractions);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$8.name,
		type: "if",
		source: "(91:0) {#if $hasDrawer}",
		ctx
	});

	return block;
}

// (92:2) {#if $drawerOpenMobile}
function create_if_block_1$5(ctx) {
	let x_overlay;
	let x_overlay_transition;
	let current;
	let dispose;

	const block = {
		c: function create() {
			x_overlay = element("x-overlay");
			set_custom_element_data(x_overlay, "class", "svelte-18z12aq");
			add_location(x_overlay, file$q, 92, 4, 1877);
		},
		m: function mount(target, anchor, remount) {
			insert_dev(target, x_overlay, anchor);
			current = true;
			if (remount) dispose();
			dispose = listen_dev(x_overlay, "click", /*click_handler*/ ctx[8], false, false, false);
		},
		p: noop,
		i: function intro(local) {
			if (current) return;

			add_render_callback(() => {
				if (!x_overlay_transition) x_overlay_transition = create_bidirectional_transition(x_overlay, fade, { duration: 300 }, true);
				x_overlay_transition.run(1);
			});

			current = true;
		},
		o: function outro(local) {
			if (!x_overlay_transition) x_overlay_transition = create_bidirectional_transition(x_overlay, fade, { duration: 300 }, false);
			x_overlay_transition.run(0);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(x_overlay);
			if (detaching && x_overlay_transition) x_overlay_transition.end();
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$5.name,
		type: "if",
		source: "(92:2) {#if $drawerOpenMobile}",
		ctx
	});

	return block;
}

function create_fragment$r(ctx) {
	let if_block_anchor;
	let current;
	let if_block = /*$hasDrawer*/ ctx[0] && create_if_block$8(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (/*$hasDrawer*/ ctx[0]) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*$hasDrawer*/ 1) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block$8(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$r.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$r($$self, $$props, $$invalidate) {
	let $hasDrawer;
	let $drawerOpenMobile;
	let $drawerOpenDesktop;
	const { hasDrawer, toggleDrawer, isMobile, drawerOpenMobile, drawerOpenDesktop } = getContext("dash");
	validate_store(hasDrawer, "hasDrawer");
	component_subscribe($$self, hasDrawer, value => $$invalidate(0, $hasDrawer = value));
	validate_store(drawerOpenMobile, "drawerOpenMobile");
	component_subscribe($$self, drawerOpenMobile, value => $$invalidate(1, $drawerOpenMobile = value));
	validate_store(drawerOpenDesktop, "drawerOpenDesktop");
	component_subscribe($$self, drawerOpenDesktop, value => $$invalidate(2, $drawerOpenDesktop = value));
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Drawer> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("Drawer", $$slots, []);
	const click_handler = () => drawerOpenMobile.set(false);

	$$self.$capture_state = () => ({
		getContext,
		fade,
		MailboxList,
		MenuButton,
		Menu,
		DrawerItem,
		hasDrawer,
		toggleDrawer,
		isMobile,
		drawerOpenMobile,
		drawerOpenDesktop,
		DrawerActions,
		$hasDrawer,
		$drawerOpenMobile,
		$drawerOpenDesktop
	});

	return [
		$hasDrawer,
		$drawerOpenMobile,
		$drawerOpenDesktop,
		hasDrawer,
		drawerOpenMobile,
		drawerOpenDesktop,
		toggleDrawer,
		isMobile,
		click_handler
	];
}

class Drawer extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$r, create_fragment$r, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Drawer",
			options,
			id: create_fragment$r.name
		});
	}
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

function getCjsExportFromNamespace (n) {
	return n && n['default'] || n;
}

var purify = createCommonjsModule(function (module, exports) {
/*! @license DOMPurify | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/2.0.8/LICENSE */

(function (global, factory) {
   module.exports = factory() ;
}(commonjsGlobal, function () {
  function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

  var hasOwnProperty = Object.hasOwnProperty,
      setPrototypeOf = Object.setPrototypeOf,
      isFrozen = Object.isFrozen,
      objectKeys = Object.keys;
  var freeze = Object.freeze,
      seal = Object.seal; // eslint-disable-line import/no-mutable-exports

  var _ref = typeof Reflect !== 'undefined' && Reflect,
      apply = _ref.apply,
      construct = _ref.construct;

  if (!apply) {
    apply = function apply(fun, thisValue, args) {
      return fun.apply(thisValue, args);
    };
  }

  if (!freeze) {
    freeze = function freeze(x) {
      return x;
    };
  }

  if (!seal) {
    seal = function seal(x) {
      return x;
    };
  }

  if (!construct) {
    construct = function construct(Func, args) {
      return new (Function.prototype.bind.apply(Func, [null].concat(_toConsumableArray(args))))();
    };
  }

  var arrayForEach = unapply(Array.prototype.forEach);
  var arrayIndexOf = unapply(Array.prototype.indexOf);
  var arrayJoin = unapply(Array.prototype.join);
  var arrayPop = unapply(Array.prototype.pop);
  var arrayPush = unapply(Array.prototype.push);
  var arraySlice = unapply(Array.prototype.slice);

  var stringToLowerCase = unapply(String.prototype.toLowerCase);
  var stringMatch = unapply(String.prototype.match);
  var stringReplace = unapply(String.prototype.replace);
  var stringIndexOf = unapply(String.prototype.indexOf);
  var stringTrim = unapply(String.prototype.trim);

  var regExpTest = unapply(RegExp.prototype.test);
  var regExpCreate = unconstruct(RegExp);

  var typeErrorCreate = unconstruct(TypeError);

  function unapply(func) {
    return function (thisArg) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return apply(func, thisArg, args);
    };
  }

  function unconstruct(func) {
    return function () {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return construct(func, args);
    };
  }

  /* Add properties to a lookup table */
  function addToSet(set, array) {
    if (setPrototypeOf) {
      // Make 'in' and truthy checks like Boolean(set.constructor)
      // independent of any properties defined on Object.prototype.
      // Prevent prototype setters from intercepting set as a this value.
      setPrototypeOf(set, null);
    }

    var l = array.length;
    while (l--) {
      var element = array[l];
      if (typeof element === 'string') {
        var lcElement = stringToLowerCase(element);
        if (lcElement !== element) {
          // Config presets (e.g. tags.js, attrs.js) are immutable.
          if (!isFrozen(array)) {
            array[l] = lcElement;
          }

          element = lcElement;
        }
      }

      set[element] = true;
    }

    return set;
  }

  /* Shallow clone an object */
  function clone(object) {
    var newObject = {};

    var property = void 0;
    for (property in object) {
      if (apply(hasOwnProperty, object, [property])) {
        newObject[property] = object[property];
      }
    }

    return newObject;
  }

  var html = freeze(['a', 'abbr', 'acronym', 'address', 'area', 'article', 'aside', 'audio', 'b', 'bdi', 'bdo', 'big', 'blink', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'content', 'data', 'datalist', 'dd', 'decorator', 'del', 'details', 'dfn', 'dir', 'div', 'dl', 'dt', 'element', 'em', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'main', 'map', 'mark', 'marquee', 'menu', 'menuitem', 'meter', 'nav', 'nobr', 'ol', 'optgroup', 'option', 'output', 'p', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'section', 'select', 'shadow', 'small', 'source', 'spacer', 'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'tr', 'track', 'tt', 'u', 'ul', 'var', 'video', 'wbr']);

  // SVG
  var svg = freeze(['svg', 'a', 'altglyph', 'altglyphdef', 'altglyphitem', 'animatecolor', 'animatemotion', 'animatetransform', 'audio', 'canvas', 'circle', 'clippath', 'defs', 'desc', 'ellipse', 'filter', 'font', 'g', 'glyph', 'glyphref', 'hkern', 'image', 'line', 'lineargradient', 'marker', 'mask', 'metadata', 'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialgradient', 'rect', 'stop', 'style', 'switch', 'symbol', 'text', 'textpath', 'title', 'tref', 'tspan', 'video', 'view', 'vkern']);

  var svgFilters = freeze(['feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence']);

  var mathMl = freeze(['math', 'menclose', 'merror', 'mfenced', 'mfrac', 'mglyph', 'mi', 'mlabeledtr', 'mmultiscripts', 'mn', 'mo', 'mover', 'mpadded', 'mphantom', 'mroot', 'mrow', 'ms', 'mspace', 'msqrt', 'mstyle', 'msub', 'msup', 'msubsup', 'mtable', 'mtd', 'mtext', 'mtr', 'munder', 'munderover']);

  var text = freeze(['#text']);

  var html$1 = freeze(['accept', 'action', 'align', 'alt', 'autocapitalize', 'autocomplete', 'autopictureinpicture', 'autoplay', 'background', 'bgcolor', 'border', 'capture', 'cellpadding', 'cellspacing', 'checked', 'cite', 'class', 'clear', 'color', 'cols', 'colspan', 'controls', 'controlslist', 'coords', 'crossorigin', 'datetime', 'decoding', 'default', 'dir', 'disabled', 'disablepictureinpicture', 'disableremoteplayback', 'download', 'draggable', 'enctype', 'enterkeyhint', 'face', 'for', 'headers', 'height', 'hidden', 'high', 'href', 'hreflang', 'id', 'inputmode', 'integrity', 'ismap', 'kind', 'label', 'lang', 'list', 'loading', 'loop', 'low', 'max', 'maxlength', 'media', 'method', 'min', 'minlength', 'multiple', 'muted', 'name', 'noshade', 'novalidate', 'nowrap', 'open', 'optimum', 'pattern', 'placeholder', 'playsinline', 'poster', 'preload', 'pubdate', 'radiogroup', 'readonly', 'rel', 'required', 'rev', 'reversed', 'role', 'rows', 'rowspan', 'spellcheck', 'scope', 'selected', 'shape', 'size', 'sizes', 'span', 'srclang', 'start', 'src', 'srcset', 'step', 'style', 'summary', 'tabindex', 'title', 'translate', 'type', 'usemap', 'valign', 'value', 'width', 'xmlns']);

  var svg$1 = freeze(['accent-height', 'accumulate', 'additive', 'alignment-baseline', 'ascent', 'attributename', 'attributetype', 'azimuth', 'basefrequency', 'baseline-shift', 'begin', 'bias', 'by', 'class', 'clip', 'clip-path', 'clip-rule', 'color', 'color-interpolation', 'color-interpolation-filters', 'color-profile', 'color-rendering', 'cx', 'cy', 'd', 'dx', 'dy', 'diffuseconstant', 'direction', 'display', 'divisor', 'dur', 'edgemode', 'elevation', 'end', 'fill', 'fill-opacity', 'fill-rule', 'filter', 'filterunits', 'flood-color', 'flood-opacity', 'font-family', 'font-size', 'font-size-adjust', 'font-stretch', 'font-style', 'font-variant', 'font-weight', 'fx', 'fy', 'g1', 'g2', 'glyph-name', 'glyphref', 'gradientunits', 'gradienttransform', 'height', 'href', 'id', 'image-rendering', 'in', 'in2', 'k', 'k1', 'k2', 'k3', 'k4', 'kerning', 'keypoints', 'keysplines', 'keytimes', 'lang', 'lengthadjust', 'letter-spacing', 'kernelmatrix', 'kernelunitlength', 'lighting-color', 'local', 'marker-end', 'marker-mid', 'marker-start', 'markerheight', 'markerunits', 'markerwidth', 'maskcontentunits', 'maskunits', 'max', 'mask', 'media', 'method', 'mode', 'min', 'name', 'numoctaves', 'offset', 'operator', 'opacity', 'order', 'orient', 'orientation', 'origin', 'overflow', 'paint-order', 'path', 'pathlength', 'patterncontentunits', 'patterntransform', 'patternunits', 'points', 'preservealpha', 'preserveaspectratio', 'primitiveunits', 'r', 'rx', 'ry', 'radius', 'refx', 'refy', 'repeatcount', 'repeatdur', 'restart', 'result', 'rotate', 'scale', 'seed', 'shape-rendering', 'specularconstant', 'specularexponent', 'spreadmethod', 'startoffset', 'stddeviation', 'stitchtiles', 'stop-color', 'stop-opacity', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke', 'stroke-width', 'style', 'surfacescale', 'tabindex', 'targetx', 'targety', 'transform', 'text-anchor', 'text-decoration', 'text-rendering', 'textlength', 'type', 'u1', 'u2', 'unicode', 'values', 'viewbox', 'visibility', 'version', 'vert-adv-y', 'vert-origin-x', 'vert-origin-y', 'width', 'word-spacing', 'wrap', 'writing-mode', 'xchannelselector', 'ychannelselector', 'x', 'x1', 'x2', 'xmlns', 'y', 'y1', 'y2', 'z', 'zoomandpan']);

  var mathMl$1 = freeze(['accent', 'accentunder', 'align', 'bevelled', 'close', 'columnsalign', 'columnlines', 'columnspan', 'denomalign', 'depth', 'dir', 'display', 'displaystyle', 'encoding', 'fence', 'frame', 'height', 'href', 'id', 'largeop', 'length', 'linethickness', 'lspace', 'lquote', 'mathbackground', 'mathcolor', 'mathsize', 'mathvariant', 'maxsize', 'minsize', 'movablelimits', 'notation', 'numalign', 'open', 'rowalign', 'rowlines', 'rowspacing', 'rowspan', 'rspace', 'rquote', 'scriptlevel', 'scriptminsize', 'scriptsizemultiplier', 'selection', 'separator', 'separators', 'stretchy', 'subscriptshift', 'supscriptshift', 'symmetric', 'voffset', 'width', 'xmlns']);

  var xml = freeze(['xlink:href', 'xml:id', 'xlink:title', 'xml:space', 'xmlns:xlink']);

  // eslint-disable-next-line unicorn/better-regex
  var MUSTACHE_EXPR = seal(/\{\{[\s\S]*|[\s\S]*\}\}/gm); // Specify template detection regex for SAFE_FOR_TEMPLATES mode
  var ERB_EXPR = seal(/<%[\s\S]*|[\s\S]*%>/gm);
  var DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]/); // eslint-disable-line no-useless-escape
  var ARIA_ATTR = seal(/^aria-[\-\w]+$/); // eslint-disable-line no-useless-escape
  var IS_ALLOWED_URI = seal(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i // eslint-disable-line no-useless-escape
  );
  var IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i);
  var ATTR_WHITESPACE = seal(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205f\u3000]/g // eslint-disable-line no-control-regex
  );

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

  function _toConsumableArray$1(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

  var getGlobal = function getGlobal() {
    return typeof window === 'undefined' ? null : window;
  };

  /**
   * Creates a no-op policy for internal use only.
   * Don't export this function outside this module!
   * @param {?TrustedTypePolicyFactory} trustedTypes The policy factory.
   * @param {Document} document The document object (to determine policy name suffix)
   * @return {?TrustedTypePolicy} The policy created (or null, if Trusted Types
   * are not supported).
   */
  var _createTrustedTypesPolicy = function _createTrustedTypesPolicy(trustedTypes, document) {
    if ((typeof trustedTypes === 'undefined' ? 'undefined' : _typeof(trustedTypes)) !== 'object' || typeof trustedTypes.createPolicy !== 'function') {
      return null;
    }

    // Allow the callers to control the unique policy name
    // by adding a data-tt-policy-suffix to the script element with the DOMPurify.
    // Policy creation with duplicate names throws in Trusted Types.
    var suffix = null;
    var ATTR_NAME = 'data-tt-policy-suffix';
    if (document.currentScript && document.currentScript.hasAttribute(ATTR_NAME)) {
      suffix = document.currentScript.getAttribute(ATTR_NAME);
    }

    var policyName = 'dompurify' + (suffix ? '#' + suffix : '');

    try {
      return trustedTypes.createPolicy(policyName, {
        createHTML: function createHTML(html$$1) {
          return html$$1;
        }
      });
    } catch (_) {
      // Policy creation failed (most likely another DOMPurify script has
      // already run). Skip creating the policy, as this will only cause errors
      // if TT are enforced.
      console.warn('TrustedTypes policy ' + policyName + ' could not be created.');
      return null;
    }
  };

  function createDOMPurify() {
    var window = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getGlobal();

    var DOMPurify = function DOMPurify(root) {
      return createDOMPurify(root);
    };

    /**
     * Version label, exposed for easier checks
     * if DOMPurify is up to date or not
     */
    DOMPurify.version = '2.0.10';

    /**
     * Array of elements that DOMPurify removed during sanitation.
     * Empty if nothing was removed.
     */
    DOMPurify.removed = [];

    if (!window || !window.document || window.document.nodeType !== 9) {
      // Not running in a browser, provide a factory function
      // so that you can pass your own Window
      DOMPurify.isSupported = false;

      return DOMPurify;
    }

    var originalDocument = window.document;
    var removeTitle = false;

    var document = window.document;
    var DocumentFragment = window.DocumentFragment,
        HTMLTemplateElement = window.HTMLTemplateElement,
        Node = window.Node,
        NodeFilter = window.NodeFilter,
        _window$NamedNodeMap = window.NamedNodeMap,
        NamedNodeMap = _window$NamedNodeMap === undefined ? window.NamedNodeMap || window.MozNamedAttrMap : _window$NamedNodeMap,
        Text = window.Text,
        Comment = window.Comment,
        DOMParser = window.DOMParser,
        trustedTypes = window.trustedTypes;

    // As per issue #47, the web-components registry is inherited by a
    // new document created via createHTMLDocument. As per the spec
    // (http://w3c.github.io/webcomponents/spec/custom/#creating-and-passing-registries)
    // a new empty registry is used when creating a template contents owner
    // document, so we use that as our parent document to ensure nothing
    // is inherited.

    if (typeof HTMLTemplateElement === 'function') {
      var template = document.createElement('template');
      if (template.content && template.content.ownerDocument) {
        document = template.content.ownerDocument;
      }
    }

    var trustedTypesPolicy = _createTrustedTypesPolicy(trustedTypes, originalDocument);
    var emptyHTML = trustedTypesPolicy ? trustedTypesPolicy.createHTML('') : '';

    var _document = document,
        implementation = _document.implementation,
        createNodeIterator = _document.createNodeIterator,
        getElementsByTagName = _document.getElementsByTagName,
        createDocumentFragment = _document.createDocumentFragment;
    var importNode = originalDocument.importNode;


    var hooks = {};

    /**
     * Expose whether this browser supports running the full DOMPurify.
     */
    DOMPurify.isSupported = implementation && typeof implementation.createHTMLDocument !== 'undefined' && document.documentMode !== 9;

    var MUSTACHE_EXPR$$1 = MUSTACHE_EXPR,
        ERB_EXPR$$1 = ERB_EXPR,
        DATA_ATTR$$1 = DATA_ATTR,
        ARIA_ATTR$$1 = ARIA_ATTR,
        IS_SCRIPT_OR_DATA$$1 = IS_SCRIPT_OR_DATA,
        ATTR_WHITESPACE$$1 = ATTR_WHITESPACE;
    var IS_ALLOWED_URI$$1 = IS_ALLOWED_URI;

    /**
     * We consider the elements and attributes below to be safe. Ideally
     * don't add any new ones but feel free to remove unwanted ones.
     */

    /* allowed element names */

    var ALLOWED_TAGS = null;
    var DEFAULT_ALLOWED_TAGS = addToSet({}, [].concat(_toConsumableArray$1(html), _toConsumableArray$1(svg), _toConsumableArray$1(svgFilters), _toConsumableArray$1(mathMl), _toConsumableArray$1(text)));

    /* Allowed attribute names */
    var ALLOWED_ATTR = null;
    var DEFAULT_ALLOWED_ATTR = addToSet({}, [].concat(_toConsumableArray$1(html$1), _toConsumableArray$1(svg$1), _toConsumableArray$1(mathMl$1), _toConsumableArray$1(xml)));

    /* Explicitly forbidden tags (overrides ALLOWED_TAGS/ADD_TAGS) */
    var FORBID_TAGS = null;

    /* Explicitly forbidden attributes (overrides ALLOWED_ATTR/ADD_ATTR) */
    var FORBID_ATTR = null;

    /* Decide if ARIA attributes are okay */
    var ALLOW_ARIA_ATTR = true;

    /* Decide if custom data attributes are okay */
    var ALLOW_DATA_ATTR = true;

    /* Decide if unknown protocols are okay */
    var ALLOW_UNKNOWN_PROTOCOLS = false;

    /* Output should be safe for jQuery's $() factory? */
    var SAFE_FOR_JQUERY = false;

    /* Output should be safe for common template engines.
     * This means, DOMPurify removes data attributes, mustaches and ERB
     */
    var SAFE_FOR_TEMPLATES = false;

    /* Decide if document with <html>... should be returned */
    var WHOLE_DOCUMENT = false;

    /* Track whether config is already set on this instance of DOMPurify. */
    var SET_CONFIG = false;

    /* Decide if all elements (e.g. style, script) must be children of
     * document.body. By default, browsers might move them to document.head */
    var FORCE_BODY = false;

    /* Decide if a DOM `HTMLBodyElement` should be returned, instead of a html
     * string (or a TrustedHTML object if Trusted Types are supported).
     * If `WHOLE_DOCUMENT` is enabled a `HTMLHtmlElement` will be returned instead
     */
    var RETURN_DOM = false;

    /* Decide if a DOM `DocumentFragment` should be returned, instead of a html
     * string  (or a TrustedHTML object if Trusted Types are supported) */
    var RETURN_DOM_FRAGMENT = false;

    /* If `RETURN_DOM` or `RETURN_DOM_FRAGMENT` is enabled, decide if the returned DOM
     * `Node` is imported into the current `Document`. If this flag is not enabled the
     * `Node` will belong (its ownerDocument) to a fresh `HTMLDocument`, created by
     * DOMPurify. */
    var RETURN_DOM_IMPORT = false;

    /* Try to return a Trusted Type object instead of a string, retrun a string in
     * case Trusted Types are not supported  */
    var RETURN_TRUSTED_TYPE = false;

    /* Output should be free from DOM clobbering attacks? */
    var SANITIZE_DOM = true;

    /* Keep element content when removing element? */
    var KEEP_CONTENT = true;

    /* If a `Node` is passed to sanitize(), then performs sanitization in-place instead
     * of importing it into a new Document and returning a sanitized copy */
    var IN_PLACE = false;

    /* Allow usage of profiles like html, svg and mathMl */
    var USE_PROFILES = {};

    /* Tags to ignore content of when KEEP_CONTENT is true */
    var FORBID_CONTENTS = addToSet({}, ['annotation-xml', 'audio', 'colgroup', 'desc', 'foreignobject', 'head', 'iframe', 'math', 'mi', 'mn', 'mo', 'ms', 'mtext', 'noembed', 'noframes', 'plaintext', 'script', 'style', 'svg', 'template', 'thead', 'title', 'video', 'xmp']);

    /* Tags that are safe for data: URIs */
    var DATA_URI_TAGS = addToSet({}, ['audio', 'video', 'img', 'source', 'image', 'track']);

    /* Attributes safe for values like "javascript:" */
    var URI_SAFE_ATTRIBUTES = null;
    var DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, ['alt', 'class', 'for', 'id', 'label', 'name', 'pattern', 'placeholder', 'summary', 'title', 'value', 'style', 'xmlns']);

    /* Keep a reference to config to pass to hooks */
    var CONFIG = null;

    /* Ideally, do not touch anything below this line */
    /* ______________________________________________ */

    var formElement = document.createElement('form');

    /**
     * _parseConfig
     *
     * @param  {Object} cfg optional config literal
     */
    // eslint-disable-next-line complexity
    var _parseConfig = function _parseConfig(cfg) {
      if (CONFIG && CONFIG === cfg) {
        return;
      }

      /* Shield configuration object from tampering */
      if (!cfg || (typeof cfg === 'undefined' ? 'undefined' : _typeof(cfg)) !== 'object') {
        cfg = {};
      }

      /* Set configuration parameters */
      ALLOWED_TAGS = 'ALLOWED_TAGS' in cfg ? addToSet({}, cfg.ALLOWED_TAGS) : DEFAULT_ALLOWED_TAGS;
      ALLOWED_ATTR = 'ALLOWED_ATTR' in cfg ? addToSet({}, cfg.ALLOWED_ATTR) : DEFAULT_ALLOWED_ATTR;
      URI_SAFE_ATTRIBUTES = 'ADD_URI_SAFE_ATTR' in cfg ? addToSet(clone(DEFAULT_URI_SAFE_ATTRIBUTES), cfg.ADD_URI_SAFE_ATTR) : DEFAULT_URI_SAFE_ATTRIBUTES;
      FORBID_TAGS = 'FORBID_TAGS' in cfg ? addToSet({}, cfg.FORBID_TAGS) : {};
      FORBID_ATTR = 'FORBID_ATTR' in cfg ? addToSet({}, cfg.FORBID_ATTR) : {};
      USE_PROFILES = 'USE_PROFILES' in cfg ? cfg.USE_PROFILES : false;
      ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== false; // Default true
      ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false; // Default true
      ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false; // Default false
      SAFE_FOR_JQUERY = cfg.SAFE_FOR_JQUERY || false; // Default false
      SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false; // Default false
      WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false; // Default false
      RETURN_DOM = cfg.RETURN_DOM || false; // Default false
      RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false; // Default false
      RETURN_DOM_IMPORT = cfg.RETURN_DOM_IMPORT || false; // Default false
      RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || false; // Default false
      FORCE_BODY = cfg.FORCE_BODY || false; // Default false
      SANITIZE_DOM = cfg.SANITIZE_DOM !== false; // Default true
      KEEP_CONTENT = cfg.KEEP_CONTENT !== false; // Default true
      IN_PLACE = cfg.IN_PLACE || false; // Default false
      IS_ALLOWED_URI$$1 = cfg.ALLOWED_URI_REGEXP || IS_ALLOWED_URI$$1;
      if (SAFE_FOR_TEMPLATES) {
        ALLOW_DATA_ATTR = false;
      }

      if (RETURN_DOM_FRAGMENT) {
        RETURN_DOM = true;
      }

      /* Parse profile info */
      if (USE_PROFILES) {
        ALLOWED_TAGS = addToSet({}, [].concat(_toConsumableArray$1(text)));
        ALLOWED_ATTR = [];
        if (USE_PROFILES.html === true) {
          addToSet(ALLOWED_TAGS, html);
          addToSet(ALLOWED_ATTR, html$1);
        }

        if (USE_PROFILES.svg === true) {
          addToSet(ALLOWED_TAGS, svg);
          addToSet(ALLOWED_ATTR, svg$1);
          addToSet(ALLOWED_ATTR, xml);
        }

        if (USE_PROFILES.svgFilters === true) {
          addToSet(ALLOWED_TAGS, svgFilters);
          addToSet(ALLOWED_ATTR, svg$1);
          addToSet(ALLOWED_ATTR, xml);
        }

        if (USE_PROFILES.mathMl === true) {
          addToSet(ALLOWED_TAGS, mathMl);
          addToSet(ALLOWED_ATTR, mathMl$1);
          addToSet(ALLOWED_ATTR, xml);
        }
      }

      /* Merge configuration parameters */
      if (cfg.ADD_TAGS) {
        if (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) {
          ALLOWED_TAGS = clone(ALLOWED_TAGS);
        }

        addToSet(ALLOWED_TAGS, cfg.ADD_TAGS);
      }

      if (cfg.ADD_ATTR) {
        if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) {
          ALLOWED_ATTR = clone(ALLOWED_ATTR);
        }

        addToSet(ALLOWED_ATTR, cfg.ADD_ATTR);
      }

      if (cfg.ADD_URI_SAFE_ATTR) {
        addToSet(URI_SAFE_ATTRIBUTES, cfg.ADD_URI_SAFE_ATTR);
      }

      /* Add #text in case KEEP_CONTENT is set to true */
      if (KEEP_CONTENT) {
        ALLOWED_TAGS['#text'] = true;
      }

      /* Add html, head and body to ALLOWED_TAGS in case WHOLE_DOCUMENT is true */
      if (WHOLE_DOCUMENT) {
        addToSet(ALLOWED_TAGS, ['html', 'head', 'body']);
      }

      /* Add tbody to ALLOWED_TAGS in case tables are permitted, see #286, #365 */
      if (ALLOWED_TAGS.table) {
        addToSet(ALLOWED_TAGS, ['tbody']);
        delete FORBID_TAGS.tbody;
      }

      // Prevent further manipulation of configuration.
      // Not available in IE8, Safari 5, etc.
      if (freeze) {
        freeze(cfg);
      }

      CONFIG = cfg;
    };

    /**
     * _forceRemove
     *
     * @param  {Node} node a DOM node
     */
    var _forceRemove = function _forceRemove(node) {
      arrayPush(DOMPurify.removed, { element: node });
      try {
        // eslint-disable-next-line unicorn/prefer-node-remove
        node.parentNode.removeChild(node);
      } catch (_) {
        node.outerHTML = emptyHTML;
      }
    };

    /**
     * _removeAttribute
     *
     * @param  {String} name an Attribute name
     * @param  {Node} node a DOM node
     */
    var _removeAttribute = function _removeAttribute(name, node) {
      try {
        arrayPush(DOMPurify.removed, {
          attribute: node.getAttributeNode(name),
          from: node
        });
      } catch (_) {
        arrayPush(DOMPurify.removed, {
          attribute: null,
          from: node
        });
      }

      node.removeAttribute(name);
    };

    /**
     * _initDocument
     *
     * @param  {String} dirty a string of dirty markup
     * @return {Document} a DOM, filled with the dirty markup
     */
    var _initDocument = function _initDocument(dirty) {
      /* Create a HTML document */
      var doc = void 0;
      var leadingWhitespace = void 0;

      if (FORCE_BODY) {
        dirty = '<remove></remove>' + dirty;
      } else {
        /* If FORCE_BODY isn't used, leading whitespace needs to be preserved manually */
        // eslint-disable-next-line unicorn/better-regex
        var matches = stringMatch(dirty, /^[\s]+/);
        leadingWhitespace = matches && matches[0];
      }

      var dirtyPayload = trustedTypesPolicy ? trustedTypesPolicy.createHTML(dirty) : dirty;
      /* Use the DOMParser API by default, fallback later if needs be */
      try {
        doc = new DOMParser().parseFromString(dirtyPayload, 'text/html');
      } catch (_) {}

      /* Remove title to fix a mXSS bug in older MS Edge */
      if (removeTitle) {
        addToSet(FORBID_TAGS, ['title']);
      }

      /* Use createHTMLDocument in case DOMParser is not available */
      if (!doc || !doc.documentElement) {
        doc = implementation.createHTMLDocument('');
        var _doc = doc,
            body = _doc.body;

        body.parentNode.removeChild(body.parentNode.firstElementChild);
        body.outerHTML = dirtyPayload;
      }

      if (dirty && leadingWhitespace) {
        doc.body.insertBefore(document.createTextNode(leadingWhitespace), doc.body.childNodes[0] || null);
      }

      /* Work on whole document or just its body */
      return getElementsByTagName.call(doc, WHOLE_DOCUMENT ? 'html' : 'body')[0];
    };

    /* Here we test for a broken feature in Edge that might cause mXSS */
    if (DOMPurify.isSupported) {
      (function () {
        try {
          var doc = _initDocument('<x/><title>&lt;/title&gt;&lt;img&gt;');
          if (regExpTest(/<\/title/, doc.querySelector('title').innerHTML)) {
            removeTitle = true;
          }
        } catch (_) {}
      })();
    }

    /**
     * _createIterator
     *
     * @param  {Document} root document/fragment to create iterator for
     * @return {Iterator} iterator instance
     */
    var _createIterator = function _createIterator(root) {
      return createNodeIterator.call(root.ownerDocument || root, root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT, function () {
        return NodeFilter.FILTER_ACCEPT;
      }, false);
    };

    /**
     * _isClobbered
     *
     * @param  {Node} elm element to check for clobbering attacks
     * @return {Boolean} true if clobbered, false if safe
     */
    var _isClobbered = function _isClobbered(elm) {
      if (elm instanceof Text || elm instanceof Comment) {
        return false;
      }

      if (typeof elm.nodeName !== 'string' || typeof elm.textContent !== 'string' || typeof elm.removeChild !== 'function' || !(elm.attributes instanceof NamedNodeMap) || typeof elm.removeAttribute !== 'function' || typeof elm.setAttribute !== 'function' || typeof elm.namespaceURI !== 'string') {
        return true;
      }

      return false;
    };

    /**
     * _isNode
     *
     * @param  {Node} obj object to check whether it's a DOM node
     * @return {Boolean} true is object is a DOM node
     */
    var _isNode = function _isNode(object) {
      return (typeof Node === 'undefined' ? 'undefined' : _typeof(Node)) === 'object' ? object instanceof Node : object && (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' && typeof object.nodeType === 'number' && typeof object.nodeName === 'string';
    };

    /**
     * _executeHook
     * Execute user configurable hooks
     *
     * @param  {String} entryPoint  Name of the hook's entry point
     * @param  {Node} currentNode node to work on with the hook
     * @param  {Object} data additional hook parameters
     */
    var _executeHook = function _executeHook(entryPoint, currentNode, data) {
      if (!hooks[entryPoint]) {
        return;
      }

      arrayForEach(hooks[entryPoint], function (hook) {
        hook.call(DOMPurify, currentNode, data, CONFIG);
      });
    };

    /**
     * _sanitizeElements
     *
     * @protect nodeName
     * @protect textContent
     * @protect removeChild
     *
     * @param   {Node} currentNode to check for permission to exist
     * @return  {Boolean} true if node was killed, false if left alive
     */
    // eslint-disable-next-line complexity
    var _sanitizeElements = function _sanitizeElements(currentNode) {
      var content = void 0;

      /* Execute a hook if present */
      _executeHook('beforeSanitizeElements', currentNode, null);

      /* Check if element is clobbered or can clobber */
      if (_isClobbered(currentNode)) {
        _forceRemove(currentNode);
        return true;
      }

      /* Now let's check the element's type and name */
      var tagName = stringToLowerCase(currentNode.nodeName);

      /* Execute a hook if present */
      _executeHook('uponSanitizeElement', currentNode, {
        tagName: tagName,
        allowedTags: ALLOWED_TAGS
      });

      /* Take care of an mXSS pattern using p, br inside svg, math */
      if ((tagName === 'svg' || tagName === 'math') && currentNode.querySelectorAll('p, br').length !== 0) {
        _forceRemove(currentNode);
        return true;
      }

      /* Remove element if anything forbids its presence */
      if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
        /* Keep content except for black-listed elements */
        if (KEEP_CONTENT && !FORBID_CONTENTS[tagName] && typeof currentNode.insertAdjacentHTML === 'function') {
          try {
            var htmlToInsert = currentNode.innerHTML;
            currentNode.insertAdjacentHTML('AfterEnd', trustedTypesPolicy ? trustedTypesPolicy.createHTML(htmlToInsert) : htmlToInsert);
          } catch (_) {}
        }

        _forceRemove(currentNode);
        return true;
      }

      /* Remove in case a noscript/noembed XSS is suspected */
      if (tagName === 'noscript' && regExpTest(/<\/noscript/i, currentNode.innerHTML)) {
        _forceRemove(currentNode);
        return true;
      }

      if (tagName === 'noembed' && regExpTest(/<\/noembed/i, currentNode.innerHTML)) {
        _forceRemove(currentNode);
        return true;
      }

      /* Convert markup to cover jQuery behavior */
      if (SAFE_FOR_JQUERY && !currentNode.firstElementChild && (!currentNode.content || !currentNode.content.firstElementChild) && regExpTest(/</g, currentNode.textContent)) {
        arrayPush(DOMPurify.removed, { element: currentNode.cloneNode() });
        if (currentNode.innerHTML) {
          currentNode.innerHTML = stringReplace(currentNode.innerHTML, /</g, '&lt;');
        } else {
          currentNode.innerHTML = stringReplace(currentNode.textContent, /</g, '&lt;');
        }
      }

      /* Sanitize element content to be template-safe */
      if (SAFE_FOR_TEMPLATES && currentNode.nodeType === 3) {
        /* Get the element's text content */
        content = currentNode.textContent;
        content = stringReplace(content, MUSTACHE_EXPR$$1, ' ');
        content = stringReplace(content, ERB_EXPR$$1, ' ');
        if (currentNode.textContent !== content) {
          arrayPush(DOMPurify.removed, { element: currentNode.cloneNode() });
          currentNode.textContent = content;
        }
      }

      /* Execute a hook if present */
      _executeHook('afterSanitizeElements', currentNode, null);

      return false;
    };

    /**
     * _isValidAttribute
     *
     * @param  {string} lcTag Lowercase tag name of containing element.
     * @param  {string} lcName Lowercase attribute name.
     * @param  {string} value Attribute value.
     * @return {Boolean} Returns true if `value` is valid, otherwise false.
     */
    // eslint-disable-next-line complexity
    var _isValidAttribute = function _isValidAttribute(lcTag, lcName, value) {
      /* Make sure attribute cannot clobber */
      if (SANITIZE_DOM && (lcName === 'id' || lcName === 'name') && (value in document || value in formElement)) {
        return false;
      }

      /* Allow valid data-* attributes: At least one character after "-"
          (https://html.spec.whatwg.org/multipage/dom.html#embedding-custom-non-visible-data-with-the-data-*-attributes)
          XML-compatible (https://html.spec.whatwg.org/multipage/infrastructure.html#xml-compatible and http://www.w3.org/TR/xml/#d0e804)
          We don't need to check the value; it's always URI safe. */
      if (ALLOW_DATA_ATTR && regExpTest(DATA_ATTR$$1, lcName)) ; else if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR$$1, lcName)) ; else if (!ALLOWED_ATTR[lcName] || FORBID_ATTR[lcName]) {
        return false;

        /* Check value is safe. First, is attr inert? If so, is safe */
      } else if (URI_SAFE_ATTRIBUTES[lcName]) ; else if (regExpTest(IS_ALLOWED_URI$$1, stringReplace(value, ATTR_WHITESPACE$$1, ''))) ; else if ((lcName === 'src' || lcName === 'xlink:href' || lcName === 'href') && lcTag !== 'script' && stringIndexOf(value, 'data:') === 0 && DATA_URI_TAGS[lcTag]) ; else if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA$$1, stringReplace(value, ATTR_WHITESPACE$$1, ''))) ; else if (!value) ; else {
        return false;
      }

      return true;
    };

    /**
     * _sanitizeAttributes
     *
     * @protect attributes
     * @protect nodeName
     * @protect removeAttribute
     * @protect setAttribute
     *
     * @param  {Node} currentNode to sanitize
     */
    // eslint-disable-next-line complexity
    var _sanitizeAttributes = function _sanitizeAttributes(currentNode) {
      var attr = void 0;
      var value = void 0;
      var lcName = void 0;
      var idAttr = void 0;
      var l = void 0;
      /* Execute a hook if present */
      _executeHook('beforeSanitizeAttributes', currentNode, null);

      var attributes = currentNode.attributes;

      /* Check if we have attributes; if not we might have a text node */

      if (!attributes) {
        return;
      }

      var hookEvent = {
        attrName: '',
        attrValue: '',
        keepAttr: true,
        allowedAttributes: ALLOWED_ATTR
      };
      l = attributes.length;

      /* Go backwards over all attributes; safely remove bad ones */
      while (l--) {
        attr = attributes[l];
        var _attr = attr,
            name = _attr.name,
            namespaceURI = _attr.namespaceURI;

        value = stringTrim(attr.value);
        lcName = stringToLowerCase(name);

        /* Execute a hook if present */
        hookEvent.attrName = lcName;
        hookEvent.attrValue = value;
        hookEvent.keepAttr = true;
        hookEvent.forceKeepAttr = undefined; // Allows developers to see this is a property they can set
        _executeHook('uponSanitizeAttribute', currentNode, hookEvent);
        value = hookEvent.attrValue;
        /* Did the hooks approve of the attribute? */
        if (hookEvent.forceKeepAttr) {
          continue;
        }

        /* Remove attribute */
        // Safari (iOS + Mac), last tested v8.0.5, crashes if you try to
        // remove a "name" attribute from an <img> tag that has an "id"
        // attribute at the time.
        if (lcName === 'name' && currentNode.nodeName === 'IMG' && attributes.id) {
          idAttr = attributes.id;
          attributes = arraySlice(attributes, []);
          _removeAttribute('id', currentNode);
          _removeAttribute(name, currentNode);
          if (arrayIndexOf(attributes, idAttr) > l) {
            currentNode.setAttribute('id', idAttr.value);
          }
        } else if (
        // This works around a bug in Safari, where input[type=file]
        // cannot be dynamically set after type has been removed
        currentNode.nodeName === 'INPUT' && lcName === 'type' && value === 'file' && hookEvent.keepAttr && (ALLOWED_ATTR[lcName] || !FORBID_ATTR[lcName])) {
          continue;
        } else {
          // This avoids a crash in Safari v9.0 with double-ids.
          // The trick is to first set the id to be empty and then to
          // remove the attribute
          if (name === 'id') {
            currentNode.setAttribute(name, '');
          }

          _removeAttribute(name, currentNode);
        }

        /* Did the hooks approve of the attribute? */
        if (!hookEvent.keepAttr) {
          continue;
        }

        /* Work around a security issue in jQuery 3.0 */
        if (SAFE_FOR_JQUERY && regExpTest(/\/>/i, value)) {
          _removeAttribute(name, currentNode);
          continue;
        }

        /* Take care of an mXSS pattern using namespace switches */
        if (regExpTest(/svg|math/i, currentNode.namespaceURI) && regExpTest(regExpCreate('</(' + arrayJoin(objectKeys(FORBID_CONTENTS), '|') + ')', 'i'), value)) {
          _removeAttribute(name, currentNode);
          continue;
        }

        /* Sanitize attribute content to be template-safe */
        if (SAFE_FOR_TEMPLATES) {
          value = stringReplace(value, MUSTACHE_EXPR$$1, ' ');
          value = stringReplace(value, ERB_EXPR$$1, ' ');
        }

        /* Is `value` valid for this attribute? */
        var lcTag = currentNode.nodeName.toLowerCase();
        if (!_isValidAttribute(lcTag, lcName, value)) {
          continue;
        }

        /* Handle invalid data-* attribute set by try-catching it */
        try {
          if (namespaceURI) {
            currentNode.setAttributeNS(namespaceURI, name, value);
          } else {
            /* Fallback to setAttribute() for browser-unrecognized namespaces e.g. "x-schema". */
            currentNode.setAttribute(name, value);
          }

          arrayPop(DOMPurify.removed);
        } catch (_) {}
      }

      /* Execute a hook if present */
      _executeHook('afterSanitizeAttributes', currentNode, null);
    };

    /**
     * _sanitizeShadowDOM
     *
     * @param  {DocumentFragment} fragment to iterate over recursively
     */
    var _sanitizeShadowDOM = function _sanitizeShadowDOM(fragment) {
      var shadowNode = void 0;
      var shadowIterator = _createIterator(fragment);

      /* Execute a hook if present */
      _executeHook('beforeSanitizeShadowDOM', fragment, null);

      while (shadowNode = shadowIterator.nextNode()) {
        /* Execute a hook if present */
        _executeHook('uponSanitizeShadowNode', shadowNode, null);

        /* Sanitize tags and elements */
        if (_sanitizeElements(shadowNode)) {
          continue;
        }

        /* Deep shadow DOM detected */
        if (shadowNode.content instanceof DocumentFragment) {
          _sanitizeShadowDOM(shadowNode.content);
        }

        /* Check attributes, sanitize if necessary */
        _sanitizeAttributes(shadowNode);
      }

      /* Execute a hook if present */
      _executeHook('afterSanitizeShadowDOM', fragment, null);
    };

    /**
     * Sanitize
     * Public method providing core sanitation functionality
     *
     * @param {String|Node} dirty string or DOM node
     * @param {Object} configuration object
     */
    // eslint-disable-next-line complexity
    DOMPurify.sanitize = function (dirty, cfg) {
      var body = void 0;
      var importedNode = void 0;
      var currentNode = void 0;
      var oldNode = void 0;
      var returnNode = void 0;
      /* Make sure we have a string to sanitize.
        DO NOT return early, as this will return the wrong type if
        the user has requested a DOM object rather than a string */
      if (!dirty) {
        dirty = '<!-->';
      }

      /* Stringify, in case dirty is an object */
      if (typeof dirty !== 'string' && !_isNode(dirty)) {
        // eslint-disable-next-line no-negated-condition
        if (typeof dirty.toString !== 'function') {
          throw typeErrorCreate('toString is not a function');
        } else {
          dirty = dirty.toString();
          if (typeof dirty !== 'string') {
            throw typeErrorCreate('dirty is not a string, aborting');
          }
        }
      }

      /* Check we can run. Otherwise fall back or ignore */
      if (!DOMPurify.isSupported) {
        if (_typeof(window.toStaticHTML) === 'object' || typeof window.toStaticHTML === 'function') {
          if (typeof dirty === 'string') {
            return window.toStaticHTML(dirty);
          }

          if (_isNode(dirty)) {
            return window.toStaticHTML(dirty.outerHTML);
          }
        }

        return dirty;
      }

      /* Assign config vars */
      if (!SET_CONFIG) {
        _parseConfig(cfg);
      }

      /* Clean up removed elements */
      DOMPurify.removed = [];

      /* Check if dirty is correctly typed for IN_PLACE */
      if (typeof dirty === 'string') {
        IN_PLACE = false;
      }

      if (IN_PLACE) ; else if (dirty instanceof Node) {
        /* If dirty is a DOM element, append to an empty document to avoid
           elements being stripped by the parser */
        body = _initDocument('<!-->');
        importedNode = body.ownerDocument.importNode(dirty, true);
        if (importedNode.nodeType === 1 && importedNode.nodeName === 'BODY') {
          /* Node is already a body, use as is */
          body = importedNode;
        } else if (importedNode.nodeName === 'HTML') {
          body = importedNode;
        } else {
          // eslint-disable-next-line unicorn/prefer-node-append
          body.appendChild(importedNode);
        }
      } else {
        /* Exit directly if we have nothing to do */
        if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT && RETURN_TRUSTED_TYPE &&
        // eslint-disable-next-line unicorn/prefer-includes
        dirty.indexOf('<') === -1) {
          return trustedTypesPolicy ? trustedTypesPolicy.createHTML(dirty) : dirty;
        }

        /* Initialize the document to work on */
        body = _initDocument(dirty);

        /* Check we have a DOM node from the data */
        if (!body) {
          return RETURN_DOM ? null : emptyHTML;
        }
      }

      /* Remove first element node (ours) if FORCE_BODY is set */
      if (body && FORCE_BODY) {
        _forceRemove(body.firstChild);
      }

      /* Get node iterator */
      var nodeIterator = _createIterator(IN_PLACE ? dirty : body);

      /* Now start iterating over the created document */
      while (currentNode = nodeIterator.nextNode()) {
        /* Fix IE's strange behavior with manipulated textNodes #89 */
        if (currentNode.nodeType === 3 && currentNode === oldNode) {
          continue;
        }

        /* Sanitize tags and elements */
        if (_sanitizeElements(currentNode)) {
          continue;
        }

        /* Shadow DOM detected, sanitize it */
        if (currentNode.content instanceof DocumentFragment) {
          _sanitizeShadowDOM(currentNode.content);
        }

        /* Check attributes, sanitize if necessary */
        _sanitizeAttributes(currentNode);

        oldNode = currentNode;
      }

      oldNode = null;

      /* If we sanitized `dirty` in-place, return it. */
      if (IN_PLACE) {
        return dirty;
      }

      /* Return sanitized string or DOM */
      if (RETURN_DOM) {
        if (RETURN_DOM_FRAGMENT) {
          returnNode = createDocumentFragment.call(body.ownerDocument);

          while (body.firstChild) {
            // eslint-disable-next-line unicorn/prefer-node-append
            returnNode.appendChild(body.firstChild);
          }
        } else {
          returnNode = body;
        }

        if (RETURN_DOM_IMPORT) {
          /*
            AdoptNode() is not used because internal state is not reset
            (e.g. the past names map of a HTMLFormElement), this is safe
            in theory but we would rather not risk another attack vector.
            The state that is cloned by importNode() is explicitly defined
            by the specs.
          */
          returnNode = importNode.call(originalDocument, returnNode, true);
        }

        return returnNode;
      }

      var serializedHTML = WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;

      /* Sanitize final string template-safe */
      if (SAFE_FOR_TEMPLATES) {
        serializedHTML = stringReplace(serializedHTML, MUSTACHE_EXPR$$1, ' ');
        serializedHTML = stringReplace(serializedHTML, ERB_EXPR$$1, ' ');
      }

      return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(serializedHTML) : serializedHTML;
    };

    /**
     * Public method to set the configuration once
     * setConfig
     *
     * @param {Object} cfg configuration object
     */
    DOMPurify.setConfig = function (cfg) {
      _parseConfig(cfg);
      SET_CONFIG = true;
    };

    /**
     * Public method to remove the configuration
     * clearConfig
     *
     */
    DOMPurify.clearConfig = function () {
      CONFIG = null;
      SET_CONFIG = false;
    };

    /**
     * Public method to check if an attribute value is valid.
     * Uses last set config, if any. Otherwise, uses config defaults.
     * isValidAttribute
     *
     * @param  {string} tag Tag name of containing element.
     * @param  {string} attr Attribute name.
     * @param  {string} value Attribute value.
     * @return {Boolean} Returns true if `value` is valid. Otherwise, returns false.
     */
    DOMPurify.isValidAttribute = function (tag, attr, value) {
      /* Initialize shared config vars if necessary. */
      if (!CONFIG) {
        _parseConfig({});
      }

      var lcTag = stringToLowerCase(tag);
      var lcName = stringToLowerCase(attr);
      return _isValidAttribute(lcTag, lcName, value);
    };

    /**
     * AddHook
     * Public method to add DOMPurify hooks
     *
     * @param {String} entryPoint entry point for the hook to add
     * @param {Function} hookFunction function to execute
     */
    DOMPurify.addHook = function (entryPoint, hookFunction) {
      if (typeof hookFunction !== 'function') {
        return;
      }

      hooks[entryPoint] = hooks[entryPoint] || [];
      arrayPush(hooks[entryPoint], hookFunction);
    };

    /**
     * RemoveHook
     * Public method to remove a DOMPurify hook at a given entryPoint
     * (pops it from the stack of hooks if more are present)
     *
     * @param {String} entryPoint entry point for the hook to remove
     */
    DOMPurify.removeHook = function (entryPoint) {
      if (hooks[entryPoint]) {
        arrayPop(hooks[entryPoint]);
      }
    };

    /**
     * RemoveHooks
     * Public method to remove all DOMPurify hooks at a given entryPoint
     *
     * @param  {String} entryPoint entry point for the hooks to remove
     */
    DOMPurify.removeHooks = function (entryPoint) {
      if (hooks[entryPoint]) {
        hooks[entryPoint] = [];
      }
    };

    /**
     * RemoveAllHooks
     * Public method to remove all DOMPurify hooks
     *
     */
    DOMPurify.removeAllHooks = function () {
      hooks = {};
    };

    return DOMPurify;
  }

  var purify = createDOMPurify();

  return purify;

}));
//# sourceMappingURL=purify.js.map
});

const sanitize = (html) => {
    const fragment = purify.sanitize(html, { RETURN_DOM_FRAGMENT: true });
    [].forEach.call(fragment.querySelectorAll("a[href]"), (a) => {
        a.setAttribute("rel", "nofollow noopener");
        a.setAttribute("target", "_blank");
    });
    const helper = [].map.call(fragment.childNodes, ((node) => {
        if (node instanceof Element) {
            return node.outerHTML;
        }
        else {
            return node.textContent;
        }
    })).join("");
    return helper;
};

/* node_modules/svelte-material-icons/WindowClose.svelte generated by Svelte v3.21.0 */

const file$r = "node_modules/svelte-material-icons/WindowClose.svelte";

function create_fragment$s(ctx) {
	let svg;
	let path;

	const block = {
		c: function create() {
			svg = svg_element("svg");
			path = svg_element("path");
			attr_dev(path, "d", "M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z");
			attr_dev(path, "fill", /*color*/ ctx[2]);
			add_location(path, file$r, 8, 59, 234);
			attr_dev(svg, "width", /*width*/ ctx[0]);
			attr_dev(svg, "height", /*height*/ ctx[1]);
			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			add_location(svg, file$r, 8, 0, 175);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, svg, anchor);
			append_dev(svg, path);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*color*/ 4) {
				attr_dev(path, "fill", /*color*/ ctx[2]);
			}

			if (dirty & /*width*/ 1) {
				attr_dev(svg, "width", /*width*/ ctx[0]);
			}

			if (dirty & /*height*/ 2) {
				attr_dev(svg, "height", /*height*/ ctx[1]);
			}

			if (dirty & /*viewBox*/ 8) {
				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(svg);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$s.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$s($$self, $$props, $$invalidate) {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	const writable_props = ["size", "width", "height", "color", "viewBox"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<WindowClose> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("WindowClose", $$slots, []);

	$$self.$set = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

	$$self.$inject_state = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [width, height, color, viewBox, size];
}

class WindowClose extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$s, create_fragment$s, safe_not_equal, {
			size: 4,
			width: 0,
			height: 1,
			color: 2,
			viewBox: 3
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "WindowClose",
			options,
			id: create_fragment$s.name
		});
	}

	get size() {
		throw new Error("<WindowClose>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set size(value) {
		throw new Error("<WindowClose>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get width() {
		throw new Error("<WindowClose>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set width(value) {
		throw new Error("<WindowClose>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get height() {
		throw new Error("<WindowClose>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set height(value) {
		throw new Error("<WindowClose>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get color() {
		throw new Error("<WindowClose>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set color(value) {
		throw new Error("<WindowClose>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get viewBox() {
		throw new Error("<WindowClose>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set viewBox(value) {
		throw new Error("<WindowClose>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules/svelte-material-icons/ColorHelper.svelte generated by Svelte v3.21.0 */

const file$s = "node_modules/svelte-material-icons/ColorHelper.svelte";

function create_fragment$t(ctx) {
	let svg;
	let path;

	const block = {
		c: function create() {
			svg = svg_element("svg");
			path = svg_element("path");
			attr_dev(path, "d", "M0,24H24V20H0V24Z");
			attr_dev(path, "fill", /*color*/ ctx[2]);
			add_location(path, file$s, 8, 59, 234);
			attr_dev(svg, "width", /*width*/ ctx[0]);
			attr_dev(svg, "height", /*height*/ ctx[1]);
			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			add_location(svg, file$s, 8, 0, 175);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, svg, anchor);
			append_dev(svg, path);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*color*/ 4) {
				attr_dev(path, "fill", /*color*/ ctx[2]);
			}

			if (dirty & /*width*/ 1) {
				attr_dev(svg, "width", /*width*/ ctx[0]);
			}

			if (dirty & /*height*/ 2) {
				attr_dev(svg, "height", /*height*/ ctx[1]);
			}

			if (dirty & /*viewBox*/ 8) {
				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(svg);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$t.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$t($$self, $$props, $$invalidate) {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	const writable_props = ["size", "width", "height", "color", "viewBox"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ColorHelper> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("ColorHelper", $$slots, []);

	$$self.$set = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

	$$self.$inject_state = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [width, height, color, viewBox, size];
}

class ColorHelper extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$t, create_fragment$t, safe_not_equal, {
			size: 4,
			width: 0,
			height: 1,
			color: 2,
			viewBox: 3
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "ColorHelper",
			options,
			id: create_fragment$t.name
		});
	}

	get size() {
		throw new Error("<ColorHelper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set size(value) {
		throw new Error("<ColorHelper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get width() {
		throw new Error("<ColorHelper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set width(value) {
		throw new Error("<ColorHelper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get height() {
		throw new Error("<ColorHelper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set height(value) {
		throw new Error("<ColorHelper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get color() {
		throw new Error("<ColorHelper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set color(value) {
		throw new Error("<ColorHelper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get viewBox() {
		throw new Error("<ColorHelper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set viewBox(value) {
		throw new Error("<ColorHelper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src/comp/Compose/AddrInput.svelte generated by Svelte v3.21.0 */
const file$t = "src/comp/Compose/AddrInput.svelte";

function get_each_context$2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[14] = list[i];
	child_ctx[16] = i;
	return child_ctx;
}

// (108:2) {#each addrs as addr, i}
function create_each_block$2(ctx) {
	let x_addr;
	let t0_value = /*addr*/ ctx[14].address + "";
	let t0;
	let t1;
	let x_addr_close;
	let current;
	let dispose;
	const close = new Close({ $$inline: true });

	function click_handler(...args) {
		return /*click_handler*/ ctx[11](/*i*/ ctx[16], ...args);
	}

	const block = {
		c: function create() {
			x_addr = element("x-addr");
			t0 = text(t0_value);
			t1 = space();
			x_addr_close = element("x-addr-close");
			create_component(close.$$.fragment);
			set_custom_element_data(x_addr_close, "class", "svelte-1l83fdz");
			add_location(x_addr_close, file$t, 110, 6, 2000);
			set_custom_element_data(x_addr, "class", "svelte-1l83fdz");
			add_location(x_addr, file$t, 108, 4, 1964);
		},
		m: function mount(target, anchor, remount) {
			insert_dev(target, x_addr, anchor);
			append_dev(x_addr, t0);
			append_dev(x_addr, t1);
			append_dev(x_addr, x_addr_close);
			mount_component(close, x_addr_close, null);
			current = true;
			if (remount) dispose();
			dispose = listen_dev(x_addr_close, "click", click_handler, false, false, false);
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			if ((!current || dirty & /*addrs*/ 1) && t0_value !== (t0_value = /*addr*/ ctx[14].address + "")) set_data_dev(t0, t0_value);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(close.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(close.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(x_addr);
			destroy_component(close);
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$2.name,
		type: "each",
		source: "(108:2) {#each addrs as addr, i}",
		ctx
	});

	return block;
}

function create_fragment$u(ctx) {
	let label;
	let t;
	let input_1;
	let current;
	let dispose;
	let each_value = /*addrs*/ ctx[0];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	const block = {
		c: function create() {
			label = element("label");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t = space();
			input_1 = element("input");
			attr_dev(input_1, "type", "text");
			attr_dev(input_1, "autocomplete", "off");
			attr_dev(input_1, "name", /*name*/ ctx[3]);
			attr_dev(input_1, "id", /*id*/ ctx[4]);
			attr_dev(input_1, "class", "svelte-1l83fdz");
			add_location(input_1, file$t, 115, 2, 2109);
			attr_dev(label, "class", "addr-input svelte-1l83fdz");
			add_location(label, file$t, 106, 0, 1906);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor, remount) {
			insert_dev(target, label, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(label, null);
			}

			append_dev(label, t);
			append_dev(label, input_1);
			/*input_1_binding*/ ctx[12](input_1);
			set_input_value(input_1, /*value*/ ctx[1]);
			current = true;
			if (remount) run_all(dispose);

			dispose = [
				listen_dev(input_1, "keypress", /*keypress*/ ctx[5], false, false, false),
				listen_dev(input_1, "blur", /*blur*/ ctx[7], false, false, false),
				listen_dev(input_1, "keydown", /*keydown*/ ctx[6], false, false, false),
				listen_dev(input_1, "input", /*input_1_input_handler*/ ctx[13]),
				listen_dev(input_1, "input", /*input_handler*/ ctx[10], false, false, false)
			];
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*remove, addrs*/ 257) {
				each_value = /*addrs*/ ctx[0];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$2(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block$2(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(label, t);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}

			if (!current || dirty & /*name*/ 8) {
				attr_dev(input_1, "name", /*name*/ ctx[3]);
			}

			if (!current || dirty & /*id*/ 16) {
				attr_dev(input_1, "id", /*id*/ ctx[4]);
			}

			if (dirty & /*value*/ 2 && input_1.value !== /*value*/ ctx[1]) {
				set_input_value(input_1, /*value*/ ctx[1]);
			}
		},
		i: function intro(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o: function outro(local) {
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(label);
			destroy_each(each_blocks, detaching);
			/*input_1_binding*/ ctx[12](null);
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$u.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$u($$self, $$props, $$invalidate) {
	let { name = "" } = $$props;
	let { id = "" } = $$props;
	let { addrs = [] } = $$props; // {name, address}[]
	let { value = "" } = $$props;
	let { input = null } = $$props;

	const add = () => {
		const address = value.trim();

		if (address) {
			if (!addrs.some(a => a.address === address)) {
				$$invalidate(0, addrs = [...addrs, { address, name: "" }]);
				$$invalidate(1, value = "");
			}
		}
	};

	const keypress = event => {
		if (event.key === "Enter") {
			add();
		}
	};

	const keydown = event => {
		if (event.key === "Backspace") {
			if (addrs.length) {
				if (input.selectionStart === input.selectionEnd && input.selectionStart === 0) {
					$$invalidate(0, addrs = addrs.slice(0, addrs.length - 1));
				}
			}
		}
	};

	const blur = add;

	const remove = i => {
		const helper = addrs.slice();
		helper.splice(i, 1);
		$$invalidate(0, addrs = helper);
	};

	const writable_props = ["name", "id", "addrs", "value", "input"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<AddrInput> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("AddrInput", $$slots, []);

	function input_handler(event) {
		bubble($$self, event);
	}

	const click_handler = i => remove(i);

	function input_1_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			$$invalidate(2, input = $$value);
		});
	}

	function input_1_input_handler() {
		value = this.value;
		$$invalidate(1, value);
	}

	$$self.$set = $$props => {
		if ("name" in $$props) $$invalidate(3, name = $$props.name);
		if ("id" in $$props) $$invalidate(4, id = $$props.id);
		if ("addrs" in $$props) $$invalidate(0, addrs = $$props.addrs);
		if ("value" in $$props) $$invalidate(1, value = $$props.value);
		if ("input" in $$props) $$invalidate(2, input = $$props.input);
	};

	$$self.$capture_state = () => ({
		Close,
		name,
		id,
		addrs,
		value,
		input,
		add,
		keypress,
		keydown,
		blur,
		remove
	});

	$$self.$inject_state = $$props => {
		if ("name" in $$props) $$invalidate(3, name = $$props.name);
		if ("id" in $$props) $$invalidate(4, id = $$props.id);
		if ("addrs" in $$props) $$invalidate(0, addrs = $$props.addrs);
		if ("value" in $$props) $$invalidate(1, value = $$props.value);
		if ("input" in $$props) $$invalidate(2, input = $$props.input);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		addrs,
		value,
		input,
		name,
		id,
		keypress,
		keydown,
		blur,
		remove,
		add,
		input_handler,
		click_handler,
		input_1_binding,
		input_1_input_handler
	];
}

class AddrInput extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$u, create_fragment$u, safe_not_equal, {
			name: 3,
			id: 4,
			addrs: 0,
			value: 1,
			input: 2
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "AddrInput",
			options,
			id: create_fragment$u.name
		});
	}

	get name() {
		throw new Error("<AddrInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set name(value) {
		throw new Error("<AddrInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get id() {
		throw new Error("<AddrInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set id(value) {
		throw new Error("<AddrInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get addrs() {
		throw new Error("<AddrInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set addrs(value) {
		throw new Error("<AddrInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get value() {
		throw new Error("<AddrInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set value(value) {
		throw new Error("<AddrInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get input() {
		throw new Error("<AddrInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set input(value) {
		throw new Error("<AddrInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

var toString = Object.prototype.toString;

var kindOf = function kindOf(val) {
  if (val === void 0) return 'undefined';
  if (val === null) return 'null';

  var type = typeof val;
  if (type === 'boolean') return 'boolean';
  if (type === 'string') return 'string';
  if (type === 'number') return 'number';
  if (type === 'symbol') return 'symbol';
  if (type === 'function') {
    return isGeneratorFn(val) ? 'generatorfunction' : 'function';
  }

  if (isArray(val)) return 'array';
  if (isBuffer(val)) return 'buffer';
  if (isArguments(val)) return 'arguments';
  if (isDate(val)) return 'date';
  if (isError(val)) return 'error';
  if (isRegexp(val)) return 'regexp';

  switch (ctorName(val)) {
    case 'Symbol': return 'symbol';
    case 'Promise': return 'promise';

    // Set, Map, WeakSet, WeakMap
    case 'WeakMap': return 'weakmap';
    case 'WeakSet': return 'weakset';
    case 'Map': return 'map';
    case 'Set': return 'set';

    // 8-bit typed arrays
    case 'Int8Array': return 'int8array';
    case 'Uint8Array': return 'uint8array';
    case 'Uint8ClampedArray': return 'uint8clampedarray';

    // 16-bit typed arrays
    case 'Int16Array': return 'int16array';
    case 'Uint16Array': return 'uint16array';

    // 32-bit typed arrays
    case 'Int32Array': return 'int32array';
    case 'Uint32Array': return 'uint32array';
    case 'Float32Array': return 'float32array';
    case 'Float64Array': return 'float64array';
  }

  if (isGeneratorObj(val)) {
    return 'generator';
  }

  // Non-plain objects
  type = toString.call(val);
  switch (type) {
    case '[object Object]': return 'object';
    // iterators
    case '[object Map Iterator]': return 'mapiterator';
    case '[object Set Iterator]': return 'setiterator';
    case '[object String Iterator]': return 'stringiterator';
    case '[object Array Iterator]': return 'arrayiterator';
  }

  // other
  return type.slice(8, -1).toLowerCase().replace(/\s/g, '');
};

function ctorName(val) {
  return typeof val.constructor === 'function' ? val.constructor.name : null;
}

function isArray(val) {
  if (Array.isArray) return Array.isArray(val);
  return val instanceof Array;
}

function isError(val) {
  return val instanceof Error || (typeof val.message === 'string' && val.constructor && typeof val.constructor.stackTraceLimit === 'number');
}

function isDate(val) {
  if (val instanceof Date) return true;
  return typeof val.toDateString === 'function'
    && typeof val.getDate === 'function'
    && typeof val.setDate === 'function';
}

function isRegexp(val) {
  if (val instanceof RegExp) return true;
  return typeof val.flags === 'string'
    && typeof val.ignoreCase === 'boolean'
    && typeof val.multiline === 'boolean'
    && typeof val.global === 'boolean';
}

function isGeneratorFn(name, val) {
  return ctorName(name) === 'GeneratorFunction';
}

function isGeneratorObj(val) {
  return typeof val.throw === 'function'
    && typeof val.return === 'function'
    && typeof val.next === 'function';
}

function isArguments(val) {
  try {
    if (typeof val.length === 'number' && typeof val.callee === 'function') {
      return true;
    }
  } catch (err) {
    if (err.message.indexOf('callee') !== -1) {
      return true;
    }
  }
  return false;
}

/**
 * If you need to support Safari 5-7 (8-10 yr-old browser),
 * take a look at https://github.com/feross/is-buffer
 */

function isBuffer(val) {
  if (val.constructor && typeof val.constructor.isBuffer === 'function') {
    return val.constructor.isBuffer(val);
  }
  return false;
}

const valueOf = Symbol.prototype.valueOf;


function clone(val, deep) {
  switch (kindOf(val)) {
    case 'array':
      return val.slice();
    case 'object':
      return Object.assign({}, val);
    case 'date':
      return new val.constructor(Number(val));
    case 'map':
      return new Map(val);
    case 'set':
      return new Set(val);
    case 'buffer':
      return cloneBuffer(val);
    case 'symbol':
      return cloneSymbol(val);
    case 'arraybuffer':
      return cloneArrayBuffer(val);
    case 'float32array':
    case 'float64array':
    case 'int16array':
    case 'int32array':
    case 'int8array':
    case 'uint16array':
    case 'uint32array':
    case 'uint8clampedarray':
    case 'uint8array':
      return cloneTypedArray(val);
    case 'regexp':
      return cloneRegExp(val);
    case 'error':
      return Object.create(val);
    default: {
      return val;
    }
  }
}

function cloneRegExp(val) {
  const flags = val.flags !== void 0 ? val.flags : (/\w+$/.exec(val) || void 0);
  const re = new val.constructor(val.source, flags);
  re.lastIndex = val.lastIndex;
  return re;
}

function cloneArrayBuffer(val) {
  const res = new val.constructor(val.byteLength);
  new Uint8Array(res).set(new Uint8Array(val));
  return res;
}

function cloneTypedArray(val, deep) {
  return new val.constructor(val.buffer, val.byteOffset, val.length);
}

function cloneBuffer(val) {
  const len = val.length;
  const buf = Buffer.allocUnsafe ? Buffer.allocUnsafe(len) : Buffer.from(len);
  val.copy(buf);
  return buf;
}

function cloneSymbol(val) {
  return valueOf ? Object(valueOf.call(val)) : {};
}

/**
 * Expose `clone`
 */

var shallowClone = clone;

/*!
 * isobject <https://github.com/jonschlinkert/isobject>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

var isobject = function isObject(val) {
  return val != null && typeof val === 'object' && Array.isArray(val) === false;
};

function isObjectObject(o) {
  return isobject(o) === true
    && Object.prototype.toString.call(o) === '[object Object]';
}

var isPlainObject = function isPlainObject(o) {
  var ctor,prot;

  if (isObjectObject(o) === false) return false;

  // If has modified constructor
  ctor = o.constructor;
  if (typeof ctor !== 'function') return false;

  // If has modified prototype
  prot = ctor.prototype;
  if (isObjectObject(prot) === false) return false;

  // If constructor does not have an Object-specific method
  if (prot.hasOwnProperty('isPrototypeOf') === false) {
    return false;
  }

  // Most likely a plain Object
  return true;
};

/**
 * Module dependenices
 */





function cloneDeep(val, instanceClone) {
  switch (kindOf(val)) {
    case 'object':
      return cloneObjectDeep(val, instanceClone);
    case 'array':
      return cloneArrayDeep(val, instanceClone);
    default: {
      return shallowClone(val);
    }
  }
}

function cloneObjectDeep(val, instanceClone) {
  if (typeof instanceClone === 'function') {
    return instanceClone(val);
  }
  if (instanceClone || isPlainObject(val)) {
    const res = new val.constructor();
    for (let key in val) {
      res[key] = cloneDeep(val[key], instanceClone);
    }
    return res;
  }
  return val;
}

function cloneArrayDeep(val, instanceClone) {
  const res = new val.constructor(val.length);
  for (let i = 0; i < val.length; i++) {
    res[i] = cloneDeep(val[i], instanceClone);
  }
  return res;
}

/**
 * Expose `cloneDeep`
 */

var cloneDeep_1 = cloneDeep;

var toStr = Object.prototype.toString;

var isArguments$1 = function isArguments(value) {
	var str = toStr.call(value);
	var isArgs = str === '[object Arguments]';
	if (!isArgs) {
		isArgs = str !== '[object Array]' &&
			value !== null &&
			typeof value === 'object' &&
			typeof value.length === 'number' &&
			value.length >= 0 &&
			toStr.call(value.callee) === '[object Function]';
	}
	return isArgs;
};

var keysShim;
if (!Object.keys) {
	// modified from https://github.com/es-shims/es5-shim
	var has = Object.prototype.hasOwnProperty;
	var toStr$1 = Object.prototype.toString;
	var isArgs = isArguments$1; // eslint-disable-line global-require
	var isEnumerable = Object.prototype.propertyIsEnumerable;
	var hasDontEnumBug = !isEnumerable.call({ toString: null }, 'toString');
	var hasProtoEnumBug = isEnumerable.call(function () {}, 'prototype');
	var dontEnums = [
		'toString',
		'toLocaleString',
		'valueOf',
		'hasOwnProperty',
		'isPrototypeOf',
		'propertyIsEnumerable',
		'constructor'
	];
	var equalsConstructorPrototype = function (o) {
		var ctor = o.constructor;
		return ctor && ctor.prototype === o;
	};
	var excludedKeys = {
		$applicationCache: true,
		$console: true,
		$external: true,
		$frame: true,
		$frameElement: true,
		$frames: true,
		$innerHeight: true,
		$innerWidth: true,
		$onmozfullscreenchange: true,
		$onmozfullscreenerror: true,
		$outerHeight: true,
		$outerWidth: true,
		$pageXOffset: true,
		$pageYOffset: true,
		$parent: true,
		$scrollLeft: true,
		$scrollTop: true,
		$scrollX: true,
		$scrollY: true,
		$self: true,
		$webkitIndexedDB: true,
		$webkitStorageInfo: true,
		$window: true
	};
	var hasAutomationEqualityBug = (function () {
		/* global window */
		if (typeof window === 'undefined') { return false; }
		for (var k in window) {
			try {
				if (!excludedKeys['$' + k] && has.call(window, k) && window[k] !== null && typeof window[k] === 'object') {
					try {
						equalsConstructorPrototype(window[k]);
					} catch (e) {
						return true;
					}
				}
			} catch (e) {
				return true;
			}
		}
		return false;
	}());
	var equalsConstructorPrototypeIfNotBuggy = function (o) {
		/* global window */
		if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
			return equalsConstructorPrototype(o);
		}
		try {
			return equalsConstructorPrototype(o);
		} catch (e) {
			return false;
		}
	};

	keysShim = function keys(object) {
		var isObject = object !== null && typeof object === 'object';
		var isFunction = toStr$1.call(object) === '[object Function]';
		var isArguments = isArgs(object);
		var isString = isObject && toStr$1.call(object) === '[object String]';
		var theKeys = [];

		if (!isObject && !isFunction && !isArguments) {
			throw new TypeError('Object.keys called on a non-object');
		}

		var skipProto = hasProtoEnumBug && isFunction;
		if (isString && object.length > 0 && !has.call(object, 0)) {
			for (var i = 0; i < object.length; ++i) {
				theKeys.push(String(i));
			}
		}

		if (isArguments && object.length > 0) {
			for (var j = 0; j < object.length; ++j) {
				theKeys.push(String(j));
			}
		} else {
			for (var name in object) {
				if (!(skipProto && name === 'prototype') && has.call(object, name)) {
					theKeys.push(String(name));
				}
			}
		}

		if (hasDontEnumBug) {
			var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);

			for (var k = 0; k < dontEnums.length; ++k) {
				if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
					theKeys.push(dontEnums[k]);
				}
			}
		}
		return theKeys;
	};
}
var implementation = keysShim;

var slice = Array.prototype.slice;


var origKeys = Object.keys;
var keysShim$1 = origKeys ? function keys(o) { return origKeys(o); } : implementation;

var originalKeys = Object.keys;

keysShim$1.shim = function shimObjectKeys() {
	if (Object.keys) {
		var keysWorksWithArguments = (function () {
			// Safari 5.0 bug
			var args = Object.keys(arguments);
			return args && args.length === arguments.length;
		}(1, 2));
		if (!keysWorksWithArguments) {
			Object.keys = function keys(object) { // eslint-disable-line func-name-matching
				if (isArguments$1(object)) {
					return originalKeys(slice.call(object));
				}
				return originalKeys(object);
			};
		}
	} else {
		Object.keys = keysShim$1;
	}
	return Object.keys || keysShim$1;
};

var objectKeys = keysShim$1;

var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';
var toStr$2 = Object.prototype.toString;

var isStandardArguments = function isArguments(value) {
	if (hasToStringTag && value && typeof value === 'object' && Symbol.toStringTag in value) {
		return false;
	}
	return toStr$2.call(value) === '[object Arguments]';
};

var isLegacyArguments = function isArguments(value) {
	if (isStandardArguments(value)) {
		return true;
	}
	return value !== null &&
		typeof value === 'object' &&
		typeof value.length === 'number' &&
		value.length >= 0 &&
		toStr$2.call(value) !== '[object Array]' &&
		toStr$2.call(value.callee) === '[object Function]';
};

var supportsStandardArguments = (function () {
	return isStandardArguments(arguments);
}());

isStandardArguments.isLegacyArguments = isLegacyArguments; // for tests

var isArguments$2 = supportsStandardArguments ? isStandardArguments : isLegacyArguments;

var hasSymbols = typeof Symbol === 'function' && typeof Symbol('foo') === 'symbol';

var toStr$3 = Object.prototype.toString;
var concat = Array.prototype.concat;
var origDefineProperty = Object.defineProperty;

var isFunction = function (fn) {
	return typeof fn === 'function' && toStr$3.call(fn) === '[object Function]';
};

var arePropertyDescriptorsSupported = function () {
	var obj = {};
	try {
		origDefineProperty(obj, 'x', { enumerable: false, value: obj });
		// eslint-disable-next-line no-unused-vars, no-restricted-syntax
		for (var _ in obj) { // jscs:ignore disallowUnusedVariables
			return false;
		}
		return obj.x === obj;
	} catch (e) { /* this is IE 8. */
		return false;
	}
};
var supportsDescriptors = origDefineProperty && arePropertyDescriptorsSupported();

var defineProperty = function (object, name, value, predicate) {
	if (name in object && (!isFunction(predicate) || !predicate())) {
		return;
	}
	if (supportsDescriptors) {
		origDefineProperty(object, name, {
			configurable: true,
			enumerable: false,
			value: value,
			writable: true
		});
	} else {
		object[name] = value;
	}
};

var defineProperties = function (object, map) {
	var predicates = arguments.length > 2 ? arguments[2] : {};
	var props = objectKeys(map);
	if (hasSymbols) {
		props = concat.call(props, Object.getOwnPropertySymbols(map));
	}
	for (var i = 0; i < props.length; i += 1) {
		defineProperty(object, props[i], map[props[i]], predicates[props[i]]);
	}
};

defineProperties.supportsDescriptors = !!supportsDescriptors;

var defineProperties_1 = defineProperties;

/* eslint no-invalid-this: 1 */

var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var slice$1 = Array.prototype.slice;
var toStr$4 = Object.prototype.toString;
var funcType = '[object Function]';

var implementation$1 = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr$4.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slice$1.call(arguments, 1);

    var bound;
    var binder = function () {
        if (this instanceof bound) {
            var result = target.apply(
                this,
                args.concat(slice$1.call(arguments))
            );
            if (Object(result) === result) {
                return result;
            }
            return this;
        } else {
            return target.apply(
                that,
                args.concat(slice$1.call(arguments))
            );
        }
    };

    var boundLength = Math.max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs.push('$' + i);
    }

    bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};

var functionBind = Function.prototype.bind || implementation$1;

/* eslint complexity: [2, 18], max-statements: [2, 33] */
var shams = function hasSymbols() {
	if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') { return false; }
	if (typeof Symbol.iterator === 'symbol') { return true; }

	var obj = {};
	var sym = Symbol('test');
	var symObj = Object(sym);
	if (typeof sym === 'string') { return false; }

	if (Object.prototype.toString.call(sym) !== '[object Symbol]') { return false; }
	if (Object.prototype.toString.call(symObj) !== '[object Symbol]') { return false; }

	// temp disabled per https://github.com/ljharb/object.assign/issues/17
	// if (sym instanceof Symbol) { return false; }
	// temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
	// if (!(symObj instanceof Symbol)) { return false; }

	// if (typeof Symbol.prototype.toString !== 'function') { return false; }
	// if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }

	var symVal = 42;
	obj[sym] = symVal;
	for (sym in obj) { return false; } // eslint-disable-line no-restricted-syntax
	if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) { return false; }

	if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) { return false; }

	var syms = Object.getOwnPropertySymbols(obj);
	if (syms.length !== 1 || syms[0] !== sym) { return false; }

	if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) { return false; }

	if (typeof Object.getOwnPropertyDescriptor === 'function') {
		var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
		if (descriptor.value !== symVal || descriptor.enumerable !== true) { return false; }
	}

	return true;
};

var origSymbol = commonjsGlobal.Symbol;


var hasSymbols$1 = function hasNativeSymbols() {
	if (typeof origSymbol !== 'function') { return false; }
	if (typeof Symbol !== 'function') { return false; }
	if (typeof origSymbol('foo') !== 'symbol') { return false; }
	if (typeof Symbol('bar') !== 'symbol') { return false; }

	return shams();
};

/* globals
	Atomics,
	SharedArrayBuffer,
*/

var undefined$1;

var $TypeError = TypeError;

var $gOPD = Object.getOwnPropertyDescriptor;
if ($gOPD) {
	try {
		$gOPD({}, '');
	} catch (e) {
		$gOPD = null; // this is IE 8, which has a broken gOPD
	}
}

var throwTypeError = function () { throw new $TypeError(); };
var ThrowTypeError = $gOPD
	? (function () {
		try {
			// eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
			arguments.callee; // IE 8 does not throw here
			return throwTypeError;
		} catch (calleeThrows) {
			try {
				// IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
				return $gOPD(arguments, 'callee').get;
			} catch (gOPDthrows) {
				return throwTypeError;
			}
		}
	}())
	: throwTypeError;

var hasSymbols$2 = hasSymbols$1();

var getProto = Object.getPrototypeOf || function (x) { return x.__proto__; }; // eslint-disable-line no-proto
var generatorFunction =  undefined$1;
var asyncFunction =  undefined$1;
var asyncGenFunction =  undefined$1;

var TypedArray = typeof Uint8Array === 'undefined' ? undefined$1 : getProto(Uint8Array);

var INTRINSICS = {
	'%Array%': Array,
	'%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined$1 : ArrayBuffer,
	'%ArrayBufferPrototype%': typeof ArrayBuffer === 'undefined' ? undefined$1 : ArrayBuffer.prototype,
	'%ArrayIteratorPrototype%': hasSymbols$2 ? getProto([][Symbol.iterator]()) : undefined$1,
	'%ArrayPrototype%': Array.prototype,
	'%ArrayProto_entries%': Array.prototype.entries,
	'%ArrayProto_forEach%': Array.prototype.forEach,
	'%ArrayProto_keys%': Array.prototype.keys,
	'%ArrayProto_values%': Array.prototype.values,
	'%AsyncFromSyncIteratorPrototype%': undefined$1,
	'%AsyncFunction%': asyncFunction,
	'%AsyncFunctionPrototype%':  undefined$1,
	'%AsyncGenerator%':  undefined$1,
	'%AsyncGeneratorFunction%': asyncGenFunction,
	'%AsyncGeneratorPrototype%':  undefined$1,
	'%AsyncIteratorPrototype%':  undefined$1,
	'%Atomics%': typeof Atomics === 'undefined' ? undefined$1 : Atomics,
	'%Boolean%': Boolean,
	'%BooleanPrototype%': Boolean.prototype,
	'%DataView%': typeof DataView === 'undefined' ? undefined$1 : DataView,
	'%DataViewPrototype%': typeof DataView === 'undefined' ? undefined$1 : DataView.prototype,
	'%Date%': Date,
	'%DatePrototype%': Date.prototype,
	'%decodeURI%': decodeURI,
	'%decodeURIComponent%': decodeURIComponent,
	'%encodeURI%': encodeURI,
	'%encodeURIComponent%': encodeURIComponent,
	'%Error%': Error,
	'%ErrorPrototype%': Error.prototype,
	'%eval%': eval, // eslint-disable-line no-eval
	'%EvalError%': EvalError,
	'%EvalErrorPrototype%': EvalError.prototype,
	'%Float32Array%': typeof Float32Array === 'undefined' ? undefined$1 : Float32Array,
	'%Float32ArrayPrototype%': typeof Float32Array === 'undefined' ? undefined$1 : Float32Array.prototype,
	'%Float64Array%': typeof Float64Array === 'undefined' ? undefined$1 : Float64Array,
	'%Float64ArrayPrototype%': typeof Float64Array === 'undefined' ? undefined$1 : Float64Array.prototype,
	'%Function%': Function,
	'%FunctionPrototype%': Function.prototype,
	'%Generator%':  undefined$1,
	'%GeneratorFunction%': generatorFunction,
	'%GeneratorPrototype%':  undefined$1,
	'%Int8Array%': typeof Int8Array === 'undefined' ? undefined$1 : Int8Array,
	'%Int8ArrayPrototype%': typeof Int8Array === 'undefined' ? undefined$1 : Int8Array.prototype,
	'%Int16Array%': typeof Int16Array === 'undefined' ? undefined$1 : Int16Array,
	'%Int16ArrayPrototype%': typeof Int16Array === 'undefined' ? undefined$1 : Int8Array.prototype,
	'%Int32Array%': typeof Int32Array === 'undefined' ? undefined$1 : Int32Array,
	'%Int32ArrayPrototype%': typeof Int32Array === 'undefined' ? undefined$1 : Int32Array.prototype,
	'%isFinite%': isFinite,
	'%isNaN%': isNaN,
	'%IteratorPrototype%': hasSymbols$2 ? getProto(getProto([][Symbol.iterator]())) : undefined$1,
	'%JSON%': typeof JSON === 'object' ? JSON : undefined$1,
	'%JSONParse%': typeof JSON === 'object' ? JSON.parse : undefined$1,
	'%Map%': typeof Map === 'undefined' ? undefined$1 : Map,
	'%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols$2 ? undefined$1 : getProto(new Map()[Symbol.iterator]()),
	'%MapPrototype%': typeof Map === 'undefined' ? undefined$1 : Map.prototype,
	'%Math%': Math,
	'%Number%': Number,
	'%NumberPrototype%': Number.prototype,
	'%Object%': Object,
	'%ObjectPrototype%': Object.prototype,
	'%ObjProto_toString%': Object.prototype.toString,
	'%ObjProto_valueOf%': Object.prototype.valueOf,
	'%parseFloat%': parseFloat,
	'%parseInt%': parseInt,
	'%Promise%': typeof Promise === 'undefined' ? undefined$1 : Promise,
	'%PromisePrototype%': typeof Promise === 'undefined' ? undefined$1 : Promise.prototype,
	'%PromiseProto_then%': typeof Promise === 'undefined' ? undefined$1 : Promise.prototype.then,
	'%Promise_all%': typeof Promise === 'undefined' ? undefined$1 : Promise.all,
	'%Promise_reject%': typeof Promise === 'undefined' ? undefined$1 : Promise.reject,
	'%Promise_resolve%': typeof Promise === 'undefined' ? undefined$1 : Promise.resolve,
	'%Proxy%': typeof Proxy === 'undefined' ? undefined$1 : Proxy,
	'%RangeError%': RangeError,
	'%RangeErrorPrototype%': RangeError.prototype,
	'%ReferenceError%': ReferenceError,
	'%ReferenceErrorPrototype%': ReferenceError.prototype,
	'%Reflect%': typeof Reflect === 'undefined' ? undefined$1 : Reflect,
	'%RegExp%': RegExp,
	'%RegExpPrototype%': RegExp.prototype,
	'%Set%': typeof Set === 'undefined' ? undefined$1 : Set,
	'%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols$2 ? undefined$1 : getProto(new Set()[Symbol.iterator]()),
	'%SetPrototype%': typeof Set === 'undefined' ? undefined$1 : Set.prototype,
	'%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined$1 : SharedArrayBuffer,
	'%SharedArrayBufferPrototype%': typeof SharedArrayBuffer === 'undefined' ? undefined$1 : SharedArrayBuffer.prototype,
	'%String%': String,
	'%StringIteratorPrototype%': hasSymbols$2 ? getProto(''[Symbol.iterator]()) : undefined$1,
	'%StringPrototype%': String.prototype,
	'%Symbol%': hasSymbols$2 ? Symbol : undefined$1,
	'%SymbolPrototype%': hasSymbols$2 ? Symbol.prototype : undefined$1,
	'%SyntaxError%': SyntaxError,
	'%SyntaxErrorPrototype%': SyntaxError.prototype,
	'%ThrowTypeError%': ThrowTypeError,
	'%TypedArray%': TypedArray,
	'%TypedArrayPrototype%': TypedArray ? TypedArray.prototype : undefined$1,
	'%TypeError%': $TypeError,
	'%TypeErrorPrototype%': $TypeError.prototype,
	'%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined$1 : Uint8Array,
	'%Uint8ArrayPrototype%': typeof Uint8Array === 'undefined' ? undefined$1 : Uint8Array.prototype,
	'%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined$1 : Uint8ClampedArray,
	'%Uint8ClampedArrayPrototype%': typeof Uint8ClampedArray === 'undefined' ? undefined$1 : Uint8ClampedArray.prototype,
	'%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined$1 : Uint16Array,
	'%Uint16ArrayPrototype%': typeof Uint16Array === 'undefined' ? undefined$1 : Uint16Array.prototype,
	'%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined$1 : Uint32Array,
	'%Uint32ArrayPrototype%': typeof Uint32Array === 'undefined' ? undefined$1 : Uint32Array.prototype,
	'%URIError%': URIError,
	'%URIErrorPrototype%': URIError.prototype,
	'%WeakMap%': typeof WeakMap === 'undefined' ? undefined$1 : WeakMap,
	'%WeakMapPrototype%': typeof WeakMap === 'undefined' ? undefined$1 : WeakMap.prototype,
	'%WeakSet%': typeof WeakSet === 'undefined' ? undefined$1 : WeakSet,
	'%WeakSetPrototype%': typeof WeakSet === 'undefined' ? undefined$1 : WeakSet.prototype
};


var $replace = functionBind.call(Function.call, String.prototype.replace);

/* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */
var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
var reEscapeChar = /\\(\\)?/g; /** Used to match backslashes in property paths. */
var stringToPath = function stringToPath(string) {
	var result = [];
	$replace(string, rePropName, function (match, number, quote, subString) {
		result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : (number || match);
	});
	return result;
};
/* end adaptation */

var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
	if (!(name in INTRINSICS)) {
		throw new SyntaxError('intrinsic ' + name + ' does not exist!');
	}

	// istanbul ignore if // hopefully this is impossible to test :-)
	if (typeof INTRINSICS[name] === 'undefined' && !allowMissing) {
		throw new $TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
	}

	return INTRINSICS[name];
};

var GetIntrinsic = function GetIntrinsic(name, allowMissing) {
	if (typeof name !== 'string' || name.length === 0) {
		throw new TypeError('intrinsic name must be a non-empty string');
	}
	if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
		throw new TypeError('"allowMissing" argument must be a boolean');
	}

	var parts = stringToPath(name);

	var value = getBaseIntrinsic('%' + (parts.length > 0 ? parts[0] : '') + '%', allowMissing);
	for (var i = 1; i < parts.length; i += 1) {
		if (value != null) {
			if ($gOPD && (i + 1) >= parts.length) {
				var desc = $gOPD(value, parts[i]);
				if (!allowMissing && !(parts[i] in value)) {
					throw new $TypeError('base intrinsic for ' + name + ' exists, but the property is not available.');
				}
				value = desc ? (desc.get || desc.value) : value[parts[i]];
			} else {
				value = value[parts[i]];
			}
		}
	}
	return value;
};

var $Function = GetIntrinsic('%Function%');
var $apply = $Function.apply;
var $call = $Function.call;

var callBind = function callBind() {
	return functionBind.apply($call, arguments);
};

var apply = function applyBind() {
	return functionBind.apply($apply, arguments);
};
callBind.apply = apply;

var numberIsNaN = function (value) {
	return value !== value;
};

var implementation$2 = function is(a, b) {
	if (a === 0 && b === 0) {
		return 1 / a === 1 / b;
	}
	if (a === b) {
		return true;
	}
	if (numberIsNaN(a) && numberIsNaN(b)) {
		return true;
	}
	return false;
};

var polyfill = function getPolyfill() {
	return typeof Object.is === 'function' ? Object.is : implementation$2;
};

var shim = function shimObjectIs() {
	var polyfill$1 = polyfill();
	defineProperties_1(Object, { is: polyfill$1 }, {
		is: function testObjectIs() {
			return Object.is !== polyfill$1;
		}
	});
	return polyfill$1;
};

var polyfill$1 = callBind(polyfill(), Object);

defineProperties_1(polyfill$1, {
	getPolyfill: polyfill,
	implementation: implementation$2,
	shim: shim
});

var objectIs = polyfill$1;

var src = functionBind.call(Function.call, Object.prototype.hasOwnProperty);

var regexExec = RegExp.prototype.exec;
var gOPD = Object.getOwnPropertyDescriptor;

var tryRegexExecCall = function tryRegexExec(value) {
	try {
		var lastIndex = value.lastIndex;
		value.lastIndex = 0; // eslint-disable-line no-param-reassign

		regexExec.call(value);
		return true;
	} catch (e) {
		return false;
	} finally {
		value.lastIndex = lastIndex; // eslint-disable-line no-param-reassign
	}
};
var toStr$5 = Object.prototype.toString;
var regexClass = '[object RegExp]';
var hasToStringTag$1 = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

var isRegex = function isRegex(value) {
	if (!value || typeof value !== 'object') {
		return false;
	}
	if (!hasToStringTag$1) {
		return toStr$5.call(value) === regexClass;
	}

	var descriptor = gOPD(value, 'lastIndex');
	var hasLastIndexDataProperty = descriptor && src(descriptor, 'value');
	if (!hasLastIndexDataProperty) {
		return false;
	}

	return tryRegexExecCall(value);
};

var $Object = Object;
var $TypeError$1 = TypeError;

var implementation$3 = function flags() {
	if (this != null && this !== $Object(this)) {
		throw new $TypeError$1('RegExp.prototype.flags getter called on non-object');
	}
	var result = '';
	if (this.global) {
		result += 'g';
	}
	if (this.ignoreCase) {
		result += 'i';
	}
	if (this.multiline) {
		result += 'm';
	}
	if (this.dotAll) {
		result += 's';
	}
	if (this.unicode) {
		result += 'u';
	}
	if (this.sticky) {
		result += 'y';
	}
	return result;
};

var supportsDescriptors$1 = defineProperties_1.supportsDescriptors;
var $gOPD$1 = Object.getOwnPropertyDescriptor;
var $TypeError$2 = TypeError;

var polyfill$2 = function getPolyfill() {
	if (!supportsDescriptors$1) {
		throw new $TypeError$2('RegExp.prototype.flags requires a true ES5 environment that supports property descriptors');
	}
	if ((/a/mig).flags === 'gim') {
		var descriptor = $gOPD$1(RegExp.prototype, 'flags');
		if (descriptor && typeof descriptor.get === 'function' && typeof (/a/).dotAll === 'boolean') {
			return descriptor.get;
		}
	}
	return implementation$3;
};

var supportsDescriptors$2 = defineProperties_1.supportsDescriptors;

var gOPD$1 = Object.getOwnPropertyDescriptor;
var defineProperty$1 = Object.defineProperty;
var TypeErr = TypeError;
var getProto$1 = Object.getPrototypeOf;
var regex = /a/;

var shim$1 = function shimFlags() {
	if (!supportsDescriptors$2 || !getProto$1) {
		throw new TypeErr('RegExp.prototype.flags requires a true ES5 environment that supports property descriptors');
	}
	var polyfill = polyfill$2();
	var proto = getProto$1(regex);
	var descriptor = gOPD$1(proto, 'flags');
	if (!descriptor || descriptor.get !== polyfill) {
		defineProperty$1(proto, 'flags', {
			configurable: true,
			enumerable: false,
			get: polyfill
		});
	}
	return polyfill;
};

var flagsBound = callBind(implementation$3);

defineProperties_1(flagsBound, {
	getPolyfill: polyfill$2,
	implementation: implementation$3,
	shim: shim$1
});

var regexp_prototype_flags = flagsBound;

var toString$1 = {}.toString;

var isarray = Array.isArray || function (arr) {
  return toString$1.call(arr) == '[object Array]';
};

var getDay = Date.prototype.getDay;
var tryDateObject = function tryDateGetDayCall(value) {
	try {
		getDay.call(value);
		return true;
	} catch (e) {
		return false;
	}
};

var toStr$6 = Object.prototype.toString;
var dateClass = '[object Date]';
var hasToStringTag$2 = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

var isDateObject = function isDateObject(value) {
	if (typeof value !== 'object' || value === null) {
		return false;
	}
	return hasToStringTag$2 ? tryDateObject(value) : toStr$6.call(value) === dateClass;
};

var strValue = String.prototype.valueOf;
var tryStringObject = function tryStringObject(value) {
	try {
		strValue.call(value);
		return true;
	} catch (e) {
		return false;
	}
};
var toStr$7 = Object.prototype.toString;
var strClass = '[object String]';
var hasToStringTag$3 = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

var isString = function isString(value) {
	if (typeof value === 'string') {
		return true;
	}
	if (typeof value !== 'object') {
		return false;
	}
	return hasToStringTag$3 ? tryStringObject(value) : toStr$7.call(value) === strClass;
};

var numToStr = Number.prototype.toString;
var tryNumberObject = function tryNumberObject(value) {
	try {
		numToStr.call(value);
		return true;
	} catch (e) {
		return false;
	}
};
var toStr$8 = Object.prototype.toString;
var numClass = '[object Number]';
var hasToStringTag$4 = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

var isNumberObject = function isNumberObject(value) {
	if (typeof value === 'number') {
		return true;
	}
	if (typeof value !== 'object') {
		return false;
	}
	return hasToStringTag$4 ? tryNumberObject(value) : toStr$8.call(value) === numClass;
};

var boolToStr = Boolean.prototype.toString;

var tryBooleanObject = function booleanBrandCheck(value) {
	try {
		boolToStr.call(value);
		return true;
	} catch (e) {
		return false;
	}
};
var toStr$9 = Object.prototype.toString;
var boolClass = '[object Boolean]';
var hasToStringTag$5 = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

var isBooleanObject = function isBoolean(value) {
	if (typeof value === 'boolean') {
		return true;
	}
	if (value === null || typeof value !== 'object') {
		return false;
	}
	return hasToStringTag$5 && Symbol.toStringTag in value ? tryBooleanObject(value) : toStr$9.call(value) === boolClass;
};

var isSymbol = createCommonjsModule(function (module) {

var toStr = Object.prototype.toString;
var hasSymbols = hasSymbols$1();

if (hasSymbols) {
	var symToStr = Symbol.prototype.toString;
	var symStringRegex = /^Symbol\(.*\)$/;
	var isSymbolObject = function isRealSymbolObject(value) {
		if (typeof value.valueOf() !== 'symbol') {
			return false;
		}
		return symStringRegex.test(symToStr.call(value));
	};

	module.exports = function isSymbol(value) {
		if (typeof value === 'symbol') {
			return true;
		}
		if (toStr.call(value) !== '[object Symbol]') {
			return false;
		}
		try {
			return isSymbolObject(value);
		} catch (e) {
			return false;
		}
	};
} else {

	module.exports = function isSymbol(value) {
		// this environment does not support Symbols.
		return false ;
	};
}
});

var isBigint = createCommonjsModule(function (module) {

if (typeof BigInt === 'function') {
	var bigIntValueOf = BigInt.prototype.valueOf;
	var tryBigInt = function tryBigIntObject(value) {
		try {
			bigIntValueOf.call(value);
			return true;
		} catch (e) {
		}
		return false;
	};

	module.exports = function isBigInt(value) {
		if (
			value === null
			|| typeof value === 'undefined'
			|| typeof value === 'boolean'
			|| typeof value === 'string'
			|| typeof value === 'number'
			|| typeof value === 'symbol'
			|| typeof value === 'function'
		) {
			return false;
		}
		if (typeof value === 'bigint') { // eslint-disable-line valid-typeof
			return true;
		}

		return tryBigInt(value);
	};
} else {
	module.exports = function isBigInt(value) {
		return false ;
	};
}
});

// eslint-disable-next-line consistent-return
var whichBoxedPrimitive = function whichBoxedPrimitive(value) {
	// eslint-disable-next-line eqeqeq
	if (value == null || (typeof value !== 'object' && typeof value !== 'function')) {
		return null;
	}
	if (isString(value)) {
		return 'String';
	}
	if (isNumberObject(value)) {
		return 'Number';
	}
	if (isBooleanObject(value)) {
		return 'Boolean';
	}
	if (isSymbol(value)) {
		return 'Symbol';
	}
	if (isBigint(value)) {
		return 'BigInt';
	}
};

var $indexOf = callBind(GetIntrinsic('String.prototype.indexOf'));

var callBound = function callBoundIntrinsic(name, allowMissing) {
	var intrinsic = GetIntrinsic(name, !!allowMissing);
	if (typeof intrinsic === 'function' && $indexOf(name, '.prototype.')) {
		return callBind(intrinsic);
	}
	return intrinsic;
};

var $Map = typeof Map === 'function' && Map.prototype ? Map : null;
var $Set = typeof Set === 'function' && Set.prototype ? Set : null;

var exported;

if (!$Map) {
	// eslint-disable-next-line no-unused-vars
	exported = function isMap(x) {
		// `Map` is not present in this environment.
		return false;
	};
}

var $mapHas = $Map ? Map.prototype.has : null;
var $setHas = $Set ? Set.prototype.has : null;
if (!exported && !$mapHas) {
	// eslint-disable-next-line no-unused-vars
	exported = function isMap(x) {
		// `Map` does not have a `has` method
		return false;
	};
}

var isMap = exported || function isMap(x) {
	if (!x || typeof x !== 'object') {
		return false;
	}
	try {
		$mapHas.call(x);
		if ($setHas) {
			try {
				$setHas.call(x);
			} catch (e) {
				return true;
			}
		}
		return x instanceof $Map; // core-js workaround, pre-v2.5.0
	} catch (e) {}
	return false;
};

var $Map$1 = typeof Map === 'function' && Map.prototype ? Map : null;
var $Set$1 = typeof Set === 'function' && Set.prototype ? Set : null;

var exported$1;

if (!$Set$1) {
	// eslint-disable-next-line no-unused-vars
	exported$1 = function isSet(x) {
		// `Set` is not present in this environment.
		return false;
	};
}

var $mapHas$1 = $Map$1 ? Map.prototype.has : null;
var $setHas$1 = $Set$1 ? Set.prototype.has : null;
if (!exported$1 && !$setHas$1) {
	// eslint-disable-next-line no-unused-vars
	exported$1 = function isSet(x) {
		// `Set` does not have a `has` method
		return false;
	};
}

var isSet = exported$1 || function isSet(x) {
	if (!x || typeof x !== 'object') {
		return false;
	}
	try {
		$setHas$1.call(x);
		if ($mapHas$1) {
			try {
				$mapHas$1.call(x);
			} catch (e) {
				return true;
			}
		}
		return x instanceof $Set$1; // core-js workaround, pre-v2.5.0
	} catch (e) {}
	return false;
};

var $WeakMap = typeof WeakMap === 'function' && WeakMap.prototype ? WeakMap : null;
var $WeakSet = typeof WeakSet === 'function' && WeakSet.prototype ? WeakSet : null;

var exported$2;

if (!$WeakMap) {
	// eslint-disable-next-line no-unused-vars
	exported$2 = function isWeakMap(x) {
		// `WeakMap` is not present in this environment.
		return false;
	};
}

var $mapHas$2 = $WeakMap ? $WeakMap.prototype.has : null;
var $setHas$2 = $WeakSet ? $WeakSet.prototype.has : null;
if (!exported$2 && !$mapHas$2) {
	// eslint-disable-next-line no-unused-vars
	exported$2 = function isWeakMap(x) {
		// `WeakMap` does not have a `has` method
		return false;
	};
}

var isWeakmap = exported$2 || function isWeakMap(x) {
	if (!x || typeof x !== 'object') {
		return false;
	}
	try {
		$mapHas$2.call(x, $mapHas$2);
		if ($setHas$2) {
			try {
				$setHas$2.call(x, $setHas$2);
			} catch (e) {
				return true;
			}
		}
		return x instanceof $WeakMap; // core-js workaround, pre-v3
	} catch (e) {}
	return false;
};

var isWeakset = createCommonjsModule(function (module) {

var $WeakMap = typeof WeakMap === 'function' && WeakMap.prototype ? WeakMap : null;
var $WeakSet = typeof WeakSet === 'function' && WeakSet.prototype ? WeakSet : null;

var exported;

if (!$WeakMap) {
	// eslint-disable-next-line no-unused-vars
	exported = function isWeakSet(x) {
		// `WeakSet` is not present in this environment.
		return false;
	};
}

var $mapHas = $WeakMap ? $WeakMap.prototype.has : null;
var $setHas = $WeakSet ? $WeakSet.prototype.has : null;
if (!exported && !$setHas) {
	// eslint-disable-next-line no-unused-vars
	module.exports = function isWeakSet(x) {
		// `WeakSet` does not have a `has` method
		return false;
	};
}

module.exports = exported || function isWeakSet(x) {
	if (!x || typeof x !== 'object') {
		return false;
	}
	try {
		$setHas.call(x, $setHas);
		if ($mapHas) {
			try {
				$mapHas.call(x, $mapHas);
			} catch (e) {
				return true;
			}
		}
		return x instanceof $WeakSet; // core-js workaround, pre-v3
	} catch (e) {}
	return false;
};
});

var whichCollection = function whichCollection(value) {
	if (value && typeof value === 'object') {
		if (isMap(value)) {
			return 'Map';
		}
		if (isSet(value)) {
			return 'Set';
		}
		if (isWeakmap(value)) {
			return 'WeakMap';
		}
		if (isWeakset(value)) {
			return 'WeakSet';
		}
	}
	return false;
};

var esGetIterator = createCommonjsModule(function (module) {

/* eslint global-require: 0 */
// the code is structured this way so that bundlers can
// alias out `has-symbols` to `() => true` or `() => false` if your target
// environments' Symbol capabilities are known, and then use
// dead code elimination on the rest of this module.
//
// Similarly, `isarray` can be aliased to `Array.isArray` if
// available in all target environments.



if (hasSymbols$1() || shams()) {
	var $iterator = Symbol.iterator;
	// Symbol is available natively or shammed
	// natively:
	//  - Chrome >= 38
	//  - Edge 12-14?, Edge >= 15 for sure
	//  - FF >= 36
	//  - Safari >= 9
	//  - node >= 0.12
	module.exports = function getIterator(iterable) {
		// alternatively, `iterable[$iterator]?.()`
		if (iterable != null && typeof iterable[$iterator] !== 'undefined') {
			return iterable[$iterator]();
		}
		if (isArguments$2(iterable)) {
			// arguments objects lack Symbol.iterator
			// - node 0.12
			return Array.prototype[$iterator].call(iterable);
		}
	};
} else {
	// Symbol is not available, native or shammed
	var isArray = isarray;
	var isString$1 = isString;
	var GetIntrinsic$1 = GetIntrinsic;
	var $Map = GetIntrinsic$1('%Map%', true);
	var $Set = GetIntrinsic$1('%Set%', true);
	var callBound$1 = callBound;
	var $arrayPush = callBound$1('Array.prototype.push');
	var $charCodeAt = callBound$1('String.prototype.charCodeAt');
	var $stringSlice = callBound$1('String.prototype.slice');

	var advanceStringIndex = function advanceStringIndex(S, index) {
		var length = S.length;
		if ((index + 1) >= length) {
			return index + 1;
		}

		var first = $charCodeAt(S, index);
		if (first < 0xD800 || first > 0xDBFF) {
			return index + 1;
		}

		var second = $charCodeAt(S, index + 1);
		if (second < 0xDC00 || second > 0xDFFF) {
			return index + 1;
		}

		return index + 2;
	};

	var getArrayIterator = function getArrayIterator(arraylike) {
		var i = 0;
		return {
			next: function next() {
				var done = i >= arraylike.length;
				var value;
				if (!done) {
					value = arraylike[i];
					i += 1;
				}
				return {
					done: done,
					value: value
				};
			}
		};
	};

	var getNonCollectionIterator = function getNonCollectionIterator(iterable) {
		if (isArray(iterable) || isArguments$2(iterable)) {
			return getArrayIterator(iterable);
		}
		if (isString$1(iterable)) {
			var i = 0;
			return {
				next: function next() {
					var nextIndex = advanceStringIndex(iterable, i);
					var value = $stringSlice(iterable, i, nextIndex);
					i = nextIndex;
					return {
						done: nextIndex > iterable.length,
						value: value
					};
				}
			};
		}
	};

	if (!$Map && !$Set) {
		// the only language iterables are Array, String, arguments
		// - Safari <= 6.0
		// - Chrome < 38
		// - node < 0.12
		// - FF < 13
		// - IE < 11
		// - Edge < 11

		module.exports = getNonCollectionIterator;
	} else {
		// either Map or Set are available, but Symbol is not
		// - es6-shim on an ES5 browser
		// - Safari 6.2 (maybe 6.1?)
		// - FF v[13, 36)
		// - IE 11
		// - Edge 11
		// - Safari v[6, 9)

		var isMap$1 = isMap;
		var isSet$1 = isSet;

		// Firefox >= 27, IE 11, Safari 6.2 - 9, Edge 11, es6-shim in older envs, all have forEach
		var $mapForEach = callBound$1('Map.prototype.forEach', true);
		var $setForEach = callBound$1('Set.prototype.forEach', true);
		if (typeof process === 'undefined' || !process.versions || !process.versions.node) { // "if is not node"

			// Firefox 17 - 26 has `.iterator()`, whose iterator `.next()` either
			// returns a value, or throws a StopIteration object. These browsers
			// do not have any other mechanism for iteration.
			var $mapIterator = callBound$1('Map.prototype.iterator', true);
			var $setIterator = callBound$1('Set.prototype.iterator', true);
			var getStopIterationIterator = function (iterator) {
				var done = false;
				return {
					next: function next() {
						try {
							return {
								done: done,
								value: done ? undefined : iterator.next()
							};
						} catch (e) {
							done = true;
							return {
								done: true,
								value: undefined
							};
						}
					}
				};
			};
		}
		// Firefox 27-35, and some older es6-shim versions, use a string "@@iterator" property
		// this returns a proper iterator object, so we should use it instead of forEach.
		// newer es6-shim versions use a string "_es6-shim iterator_" property.
		var $mapAtAtIterator = callBound$1('Map.prototype.@@iterator', true) || callBound$1('Map.prototype._es6-shim iterator_', true);
		var $setAtAtIterator = callBound$1('Set.prototype.@@iterator', true) || callBound$1('Set.prototype._es6-shim iterator_', true);

		var getCollectionIterator = function getCollectionIterator(iterable) {
			if (isMap$1(iterable)) {
				if ($mapIterator) {
					return getStopIterationIterator($mapIterator(iterable));
				}
				if ($mapAtAtIterator) {
					return $mapAtAtIterator(iterable);
				}
				if ($mapForEach) {
					var entries = [];
					$mapForEach(iterable, function (v, k) {
						$arrayPush(entries, [k, v]);
					});
					return getArrayIterator(entries);
				}
			}
			if (isSet$1(iterable)) {
				if ($setIterator) {
					return getStopIterationIterator($setIterator(iterable));
				}
				if ($setAtAtIterator) {
					return $setAtAtIterator(iterable);
				}
				if ($setForEach) {
					var values = [];
					$setForEach(iterable, function (v) {
						$arrayPush(values, v);
					});
					return getArrayIterator(values);
				}
			}
		};

		module.exports = function getIterator(iterable) {
			return getCollectionIterator(iterable) || getNonCollectionIterator(iterable);
		};
	}
}
});

var _nodeResolve_empty = {};

var _nodeResolve_empty$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': _nodeResolve_empty
});

var require$$0 = getCjsExportFromNamespace(_nodeResolve_empty$1);

var hasMap = typeof Map === 'function' && Map.prototype;
var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, 'size') : null;
var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === 'function' ? mapSizeDescriptor.get : null;
var mapForEach = hasMap && Map.prototype.forEach;
var hasSet = typeof Set === 'function' && Set.prototype;
var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, 'size') : null;
var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === 'function' ? setSizeDescriptor.get : null;
var setForEach = hasSet && Set.prototype.forEach;
var hasWeakMap = typeof WeakMap === 'function' && WeakMap.prototype;
var weakMapHas = hasWeakMap ? WeakMap.prototype.has : null;
var hasWeakSet = typeof WeakSet === 'function' && WeakSet.prototype;
var weakSetHas = hasWeakSet ? WeakSet.prototype.has : null;
var booleanValueOf = Boolean.prototype.valueOf;
var objectToString = Object.prototype.toString;
var match = String.prototype.match;
var bigIntValueOf = typeof BigInt === 'function' ? BigInt.prototype.valueOf : null;

var inspectCustom = require$$0.custom;
var inspectSymbol = inspectCustom && isSymbol$1(inspectCustom) ? inspectCustom : null;

var objectInspect = function inspect_(obj, options, depth, seen) {
    var opts = options || {};

    if (has$1(opts, 'quoteStyle') && (opts.quoteStyle !== 'single' && opts.quoteStyle !== 'double')) {
        throw new TypeError('option "quoteStyle" must be "single" or "double"');
    }

    if (typeof obj === 'undefined') {
        return 'undefined';
    }
    if (obj === null) {
        return 'null';
    }
    if (typeof obj === 'boolean') {
        return obj ? 'true' : 'false';
    }

    if (typeof obj === 'string') {
        return inspectString(obj, opts);
    }
    if (typeof obj === 'number') {
        if (obj === 0) {
            return Infinity / obj > 0 ? '0' : '-0';
        }
        return String(obj);
    }
    if (typeof obj === 'bigint') { // eslint-disable-line valid-typeof
        return String(obj) + 'n';
    }

    var maxDepth = typeof opts.depth === 'undefined' ? 5 : opts.depth;
    if (typeof depth === 'undefined') { depth = 0; }
    if (depth >= maxDepth && maxDepth > 0 && typeof obj === 'object') {
        return '[Object]';
    }

    if (typeof seen === 'undefined') {
        seen = [];
    } else if (indexOf(seen, obj) >= 0) {
        return '[Circular]';
    }

    function inspect(value, from) {
        if (from) {
            seen = seen.slice();
            seen.push(from);
        }
        return inspect_(value, opts, depth + 1, seen);
    }

    if (typeof obj === 'function') {
        var name = nameOf(obj);
        return '[Function' + (name ? ': ' + name : '') + ']';
    }
    if (isSymbol$1(obj)) {
        var symString = Symbol.prototype.toString.call(obj);
        return typeof obj === 'object' ? markBoxed(symString) : symString;
    }
    if (isElement(obj)) {
        var s = '<' + String(obj.nodeName).toLowerCase();
        var attrs = obj.attributes || [];
        for (var i = 0; i < attrs.length; i++) {
            s += ' ' + attrs[i].name + '=' + wrapQuotes(quote(attrs[i].value), 'double', opts);
        }
        s += '>';
        if (obj.childNodes && obj.childNodes.length) { s += '...'; }
        s += '</' + String(obj.nodeName).toLowerCase() + '>';
        return s;
    }
    if (isArray$1(obj)) {
        if (obj.length === 0) { return '[]'; }
        return '[ ' + arrObjKeys(obj, inspect).join(', ') + ' ]';
    }
    if (isError$1(obj)) {
        var parts = arrObjKeys(obj, inspect);
        if (parts.length === 0) { return '[' + String(obj) + ']'; }
        return '{ [' + String(obj) + '] ' + parts.join(', ') + ' }';
    }
    if (typeof obj === 'object') {
        if (inspectSymbol && typeof obj[inspectSymbol] === 'function') {
            return obj[inspectSymbol]();
        } else if (typeof obj.inspect === 'function') {
            return obj.inspect();
        }
    }
    if (isMap$1(obj)) {
        var mapParts = [];
        mapForEach.call(obj, function (value, key) {
            mapParts.push(inspect(key, obj) + ' => ' + inspect(value, obj));
        });
        return collectionOf('Map', mapSize.call(obj), mapParts);
    }
    if (isSet$1(obj)) {
        var setParts = [];
        setForEach.call(obj, function (value) {
            setParts.push(inspect(value, obj));
        });
        return collectionOf('Set', setSize.call(obj), setParts);
    }
    if (isWeakMap(obj)) {
        return weakCollectionOf('WeakMap');
    }
    if (isWeakSet(obj)) {
        return weakCollectionOf('WeakSet');
    }
    if (isNumber(obj)) {
        return markBoxed(inspect(Number(obj)));
    }
    if (isBigInt(obj)) {
        return markBoxed(inspect(bigIntValueOf.call(obj)));
    }
    if (isBoolean(obj)) {
        return markBoxed(booleanValueOf.call(obj));
    }
    if (isString$1(obj)) {
        return markBoxed(inspect(String(obj)));
    }
    if (!isDate$1(obj) && !isRegExp(obj)) {
        var xs = arrObjKeys(obj, inspect);
        if (xs.length === 0) { return '{}'; }
        return '{ ' + xs.join(', ') + ' }';
    }
    return String(obj);
};

function wrapQuotes(s, defaultStyle, opts) {
    var quoteChar = (opts.quoteStyle || defaultStyle) === 'double' ? '"' : "'";
    return quoteChar + s + quoteChar;
}

function quote(s) {
    return String(s).replace(/"/g, '&quot;');
}

function isArray$1(obj) { return toStr$a(obj) === '[object Array]'; }
function isDate$1(obj) { return toStr$a(obj) === '[object Date]'; }
function isRegExp(obj) { return toStr$a(obj) === '[object RegExp]'; }
function isError$1(obj) { return toStr$a(obj) === '[object Error]'; }
function isSymbol$1(obj) { return toStr$a(obj) === '[object Symbol]'; }
function isString$1(obj) { return toStr$a(obj) === '[object String]'; }
function isNumber(obj) { return toStr$a(obj) === '[object Number]'; }
function isBigInt(obj) { return toStr$a(obj) === '[object BigInt]'; }
function isBoolean(obj) { return toStr$a(obj) === '[object Boolean]'; }

var hasOwn = Object.prototype.hasOwnProperty || function (key) { return key in this; };
function has$1(obj, key) {
    return hasOwn.call(obj, key);
}

function toStr$a(obj) {
    return objectToString.call(obj);
}

function nameOf(f) {
    if (f.name) { return f.name; }
    var m = match.call(f, /^function\s*([\w$]+)/);
    if (m) { return m[1]; }
    return null;
}

function indexOf(xs, x) {
    if (xs.indexOf) { return xs.indexOf(x); }
    for (var i = 0, l = xs.length; i < l; i++) {
        if (xs[i] === x) { return i; }
    }
    return -1;
}

function isMap$1(x) {
    if (!mapSize || !x || typeof x !== 'object') {
        return false;
    }
    try {
        mapSize.call(x);
        try {
            setSize.call(x);
        } catch (s) {
            return true;
        }
        return x instanceof Map; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isWeakMap(x) {
    if (!weakMapHas || !x || typeof x !== 'object') {
        return false;
    }
    try {
        weakMapHas.call(x, weakMapHas);
        try {
            weakSetHas.call(x, weakSetHas);
        } catch (s) {
            return true;
        }
        return x instanceof WeakMap; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isSet$1(x) {
    if (!setSize || !x || typeof x !== 'object') {
        return false;
    }
    try {
        setSize.call(x);
        try {
            mapSize.call(x);
        } catch (m) {
            return true;
        }
        return x instanceof Set; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isWeakSet(x) {
    if (!weakSetHas || !x || typeof x !== 'object') {
        return false;
    }
    try {
        weakSetHas.call(x, weakSetHas);
        try {
            weakMapHas.call(x, weakMapHas);
        } catch (s) {
            return true;
        }
        return x instanceof WeakSet; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isElement(x) {
    if (!x || typeof x !== 'object') { return false; }
    if (typeof HTMLElement !== 'undefined' && x instanceof HTMLElement) {
        return true;
    }
    return typeof x.nodeName === 'string' && typeof x.getAttribute === 'function';
}

function inspectString(str, opts) {
    // eslint-disable-next-line no-control-regex
    var s = str.replace(/(['\\])/g, '\\$1').replace(/[\x00-\x1f]/g, lowbyte);
    return wrapQuotes(s, 'single', opts);
}

function lowbyte(c) {
    var n = c.charCodeAt(0);
    var x = {
        8: 'b', 9: 't', 10: 'n', 12: 'f', 13: 'r'
    }[n];
    if (x) { return '\\' + x; }
    return '\\x' + (n < 0x10 ? '0' : '') + n.toString(16);
}

function markBoxed(str) {
    return 'Object(' + str + ')';
}

function weakCollectionOf(type) {
    return type + ' { ? }';
}

function collectionOf(type, size, entries) {
    return type + ' (' + size + ') {' + entries.join(', ') + '}';
}

function arrObjKeys(obj, inspect) {
    var isArr = isArray$1(obj);
    var xs = [];
    if (isArr) {
        xs.length = obj.length;
        for (var i = 0; i < obj.length; i++) {
            xs[i] = has$1(obj, i) ? inspect(obj[i], obj) : '';
        }
    }
    for (var key in obj) { // eslint-disable-line no-restricted-syntax
        if (!has$1(obj, key)) { continue; } // eslint-disable-line no-restricted-syntax, no-continue
        if (isArr && String(Number(key)) === key && key < obj.length) { continue; } // eslint-disable-line no-restricted-syntax, no-continue
        if ((/[^\w$]/).test(key)) {
            xs.push(inspect(key, obj) + ': ' + inspect(obj[key], obj));
        } else {
            xs.push(key + ': ' + inspect(obj[key], obj));
        }
    }
    return xs;
}

var $TypeError$3 = GetIntrinsic('%TypeError%');
var $WeakMap$1 = GetIntrinsic('%WeakMap%', true);
var $Map$2 = GetIntrinsic('%Map%', true);
var $push = callBound('Array.prototype.push');

var $weakMapGet = callBound('WeakMap.prototype.get', true);
var $weakMapSet = callBound('WeakMap.prototype.set', true);
var $weakMapHas = callBound('WeakMap.prototype.has', true);
var $mapGet = callBound('Map.prototype.get', true);
var $mapSet = callBound('Map.prototype.set', true);
var $mapHas$3 = callBound('Map.prototype.has', true);
var objectGet = function (objects, key) { // eslint-disable-line consistent-return
	for (var i = 0; i < objects.length; i += 1) {
		if (objects[i].key === key) {
			return objects[i].value;
		}
	}
};
var objectSet = function (objects, key, value) {
	for (var i = 0; i < objects.length; i += 1) {
		if (objects[i].key === key) {
			objects[i].value = value; // eslint-disable-line no-param-reassign
			return;
		}
	}
	$push(objects, {
		key: key,
		value: value
	});
};
var objectHas = function (objects, key) {
	for (var i = 0; i < objects.length; i += 1) {
		if (objects[i].key === key) {
			return true;
		}
	}
	return false;
};

var sideChannel = function getSideChannel() {
	var $wm;
	var $m;
	var $o;
	var channel = {
		assert: function (key) {
			if (!channel.has(key)) {
				throw new $TypeError$3('Side channel does not contain ' + objectInspect(key));
			}
		},
		get: function (key) { // eslint-disable-line consistent-return
			if ($WeakMap$1 && key && (typeof key === 'object' || typeof key === 'function')) {
				if ($wm) {
					return $weakMapGet($wm, key);
				}
			} else if ($Map$2) {
				if ($m) {
					return $mapGet($m, key);
				}
			} else {
				if ($o) { // eslint-disable-line no-lonely-if
					return objectGet($o, key);
				}
			}
		},
		has: function (key) {
			if ($WeakMap$1 && key && (typeof key === 'object' || typeof key === 'function')) {
				if ($wm) {
					return $weakMapHas($wm, key);
				}
			} else if ($Map$2) {
				if ($m) {
					return $mapHas$3($m, key);
				}
			} else {
				if ($o) { // eslint-disable-line no-lonely-if
					return objectHas($o, key);
				}
			}
			return false;
		},
		set: function (key, value) {
			if ($WeakMap$1 && key && (typeof key === 'object' || typeof key === 'function')) {
				if (!$wm) {
					$wm = new $WeakMap$1();
				}
				$weakMapSet($wm, key, value);
			} else if ($Map$2) {
				if (!$m) {
					$m = new $Map$2();
				}
				$mapSet($m, key, value);
			} else {
				if (!$o) {
					$o = [];
				}
				objectSet($o, key, value);
			}
		}
	};
	return channel;
};

var hasOwn$1 = Object.prototype.hasOwnProperty;
var toString$2 = Object.prototype.toString;

var foreach = function forEach (obj, fn, ctx) {
    if (toString$2.call(fn) !== '[object Function]') {
        throw new TypeError('iterator must be a function');
    }
    var l = obj.length;
    if (l === +l) {
        for (var i = 0; i < l; i++) {
            fn.call(ctx, obj[i], i, obj);
        }
    } else {
        for (var k in obj) {
            if (hasOwn$1.call(obj, k)) {
                fn.call(ctx, obj[k], k, obj);
            }
        }
    }
};

/**
 * Array#filter.
 *
 * @param {Array} arr
 * @param {Function} fn
 * @param {Object=} self
 * @return {Array}
 * @throw TypeError
 */

var arrayFilter = function (arr, fn, self) {
  if (arr.filter) return arr.filter(fn, self);
  if (void 0 === arr || null === arr) throw new TypeError;
  if ('function' != typeof fn) throw new TypeError;
  var ret = [];
  for (var i = 0; i < arr.length; i++) {
    if (!hasOwn$2.call(arr, i)) continue;
    var val = arr[i];
    if (fn.call(self, val, i, arr)) ret.push(val);
  }
  return ret;
};

var hasOwn$2 = Object.prototype.hasOwnProperty;

var availableTypedArrays = function availableTypedArrays() {
	return arrayFilter([
		'BigInt64Array',
		'BigUint64Array',
		'Float32Array',
		'Float64Array',
		'Int16Array',
		'Int32Array',
		'Int8Array',
		'Uint16Array',
		'Uint32Array',
		'Uint8Array',
		'Uint8ClampedArray'
	], function (typedArray) {
		return typeof commonjsGlobal[typedArray] === 'function';
	});
};

var $gOPD$2 = GetIntrinsic('%Object.getOwnPropertyDescriptor%');
if ($gOPD$2) {
	try {
		$gOPD$2([], 'length');
	} catch (e) {
		// IE 8 has a broken gOPD
		$gOPD$2 = null;
	}
}

var getOwnPropertyDescriptor = $gOPD$2;

var $toString = callBound('Object.prototype.toString');
var hasSymbols$3 = hasSymbols$1();
var hasToStringTag$6 = hasSymbols$3 && typeof Symbol.toStringTag === 'symbol';

var typedArrays = availableTypedArrays();

var $indexOf$1 = callBound('Array.prototype.indexOf', true) || function indexOf(array, value) {
	for (var i = 0; i < array.length; i += 1) {
		if (array[i] === value) {
			return i;
		}
	}
	return -1;
};
var $slice = callBound('String.prototype.slice');
var toStrTags = {};

var getPrototypeOf = Object.getPrototypeOf; // require('getprototypeof');
if (hasToStringTag$6 && getOwnPropertyDescriptor && getPrototypeOf) {
	foreach(typedArrays, function (typedArray) {
		var arr = new commonjsGlobal[typedArray]();
		if (!(Symbol.toStringTag in arr)) {
			throw new EvalError('this engine has support for Symbol.toStringTag, but ' + typedArray + ' does not have the property! Please report this.');
		}
		var proto = getPrototypeOf(arr);
		var descriptor = getOwnPropertyDescriptor(proto, Symbol.toStringTag);
		if (!descriptor) {
			var superProto = getPrototypeOf(proto);
			descriptor = getOwnPropertyDescriptor(superProto, Symbol.toStringTag);
		}
		toStrTags[typedArray] = descriptor.get;
	});
}

var tryTypedArrays = function tryAllTypedArrays(value) {
	var anyTrue = false;
	foreach(toStrTags, function (getter, typedArray) {
		if (!anyTrue) {
			try {
				anyTrue = getter.call(value) === typedArray;
			} catch (e) { /**/ }
		}
	});
	return anyTrue;
};

var isTypedArray = function isTypedArray(value) {
	if (!value || typeof value !== 'object') { return false; }
	if (!hasToStringTag$6) {
		var tag = $slice($toString(value), 8, -1);
		return $indexOf$1(typedArrays, tag) > -1;
	}
	if (!getOwnPropertyDescriptor) { return false; }
	return tryTypedArrays(value);
};

var $toString$1 = callBound('Object.prototype.toString');
var hasSymbols$4 = hasSymbols$1();
var hasToStringTag$7 = hasSymbols$4 && typeof Symbol.toStringTag === 'symbol';

var typedArrays$1 = availableTypedArrays();

var $slice$1 = callBound('String.prototype.slice');
var toStrTags$1 = {};

var getPrototypeOf$1 = Object.getPrototypeOf; // require('getprototypeof');
if (hasToStringTag$7 && getOwnPropertyDescriptor && getPrototypeOf$1) {
	foreach(typedArrays$1, function (typedArray) {
		if (typeof commonjsGlobal[typedArray] === 'function') {
			var arr = new commonjsGlobal[typedArray]();
			if (!(Symbol.toStringTag in arr)) {
				throw new EvalError('this engine has support for Symbol.toStringTag, but ' + typedArray + ' does not have the property! Please report this.');
			}
			var proto = getPrototypeOf$1(arr);
			var descriptor = getOwnPropertyDescriptor(proto, Symbol.toStringTag);
			if (!descriptor) {
				var superProto = getPrototypeOf$1(proto);
				descriptor = getOwnPropertyDescriptor(superProto, Symbol.toStringTag);
			}
			toStrTags$1[typedArray] = descriptor.get;
		}
	});
}

var tryTypedArrays$1 = function tryAllTypedArrays(value) {
	var foundName = false;
	foreach(toStrTags$1, function (getter, typedArray) {
		if (!foundName) {
			try {
				var name = getter.call(value);
				if (name === typedArray) {
					foundName = name;
				}
			} catch (e) {}
		}
	});
	return foundName;
};



var whichTypedArray = function whichTypedArray(value) {
	if (!isTypedArray(value)) { return false; }
	if (!hasToStringTag$7) { return $slice$1($toString$1(value), 8, -1); }
	return tryTypedArrays$1(value);
};

// modified from https://github.com/es-shims/es6-shim


var canBeObject = function (obj) {
	return typeof obj !== 'undefined' && obj !== null;
};
var hasSymbols$5 = shams();
var toObject = Object;
var push = functionBind.call(Function.call, Array.prototype.push);
var propIsEnumerable = functionBind.call(Function.call, Object.prototype.propertyIsEnumerable);
var originalGetSymbols = hasSymbols$5 ? Object.getOwnPropertySymbols : null;

var implementation$4 = function assign(target, source1) {
	if (!canBeObject(target)) { throw new TypeError('target must be an object'); }
	var objTarget = toObject(target);
	var s, source, i, props, syms, value, key;
	for (s = 1; s < arguments.length; ++s) {
		source = toObject(arguments[s]);
		props = objectKeys(source);
		var getSymbols = hasSymbols$5 && (Object.getOwnPropertySymbols || originalGetSymbols);
		if (getSymbols) {
			syms = getSymbols(source);
			for (i = 0; i < syms.length; ++i) {
				key = syms[i];
				if (propIsEnumerable(source, key)) {
					push(props, key);
				}
			}
		}
		for (i = 0; i < props.length; ++i) {
			key = props[i];
			value = source[key];
			if (propIsEnumerable(source, key)) {
				objTarget[key] = value;
			}
		}
	}
	return objTarget;
};

var lacksProperEnumerationOrder = function () {
	if (!Object.assign) {
		return false;
	}
	// v8, specifically in node 4.x, has a bug with incorrect property enumeration order
	// note: this does not detect the bug unless there's 20 characters
	var str = 'abcdefghijklmnopqrst';
	var letters = str.split('');
	var map = {};
	for (var i = 0; i < letters.length; ++i) {
		map[letters[i]] = letters[i];
	}
	var obj = Object.assign({}, map);
	var actual = '';
	for (var k in obj) {
		actual += k;
	}
	return str !== actual;
};

var assignHasPendingExceptions = function () {
	if (!Object.assign || !Object.preventExtensions) {
		return false;
	}
	// Firefox 37 still has "pending exception" logic in its Object.assign implementation,
	// which is 72% slower than our shim, and Firefox 40's native implementation.
	var thrower = Object.preventExtensions({ 1: 2 });
	try {
		Object.assign(thrower, 'xy');
	} catch (e) {
		return thrower[1] === 'y';
	}
	return false;
};

var polyfill$3 = function getPolyfill() {
	if (!Object.assign) {
		return implementation$4;
	}
	if (lacksProperEnumerationOrder()) {
		return implementation$4;
	}
	if (assignHasPendingExceptions()) {
		return implementation$4;
	}
	return Object.assign;
};

var shim$2 = function shimAssign() {
	var polyfill = polyfill$3();
	defineProperties_1(
		Object,
		{ assign: polyfill },
		{ assign: function () { return Object.assign !== polyfill; } }
	);
	return polyfill;
};

var polyfill$4 = polyfill$3();

defineProperties_1(polyfill$4, {
	getPolyfill: polyfill$3,
	implementation: implementation$4,
	shim: shim$2
});

var object_assign = polyfill$4;

var $getTime = callBound('Date.prototype.getTime');
var gPO = Object.getPrototypeOf;
var $objToString = callBound('Object.prototype.toString');

var $Set$2 = GetIntrinsic('%Set%', true);
var $mapHas$4 = callBound('Map.prototype.has', true);
var $mapGet$1 = callBound('Map.prototype.get', true);
var $mapSize = callBound('Map.prototype.size', true);
var $setAdd = callBound('Set.prototype.add', true);
var $setDelete = callBound('Set.prototype.delete', true);
var $setHas$3 = callBound('Set.prototype.has', true);
var $setSize = callBound('Set.prototype.size', true);

// taken from https://github.com/browserify/commonjs-assert/blob/bba838e9ba9e28edf3127ce6974624208502f6bc/internal/util/comparisons.js#L401-L414
function setHasEqualElement(set, val1, opts, channel) {
  var i = esGetIterator(set);
  var result;
  while ((result = i.next()) && !result.done) {
    if (internalDeepEqual(val1, result.value, opts, channel)) { // eslint-disable-line no-use-before-define
      // Remove the matching element to make sure we do not check that again.
      $setDelete(set, result.value);
      return true;
    }
  }

  return false;
}

// taken from https://github.com/browserify/commonjs-assert/blob/bba838e9ba9e28edf3127ce6974624208502f6bc/internal/util/comparisons.js#L416-L439
function findLooseMatchingPrimitives(prim) {
  if (typeof prim === 'undefined') {
    return null;
  }
  if (typeof prim === 'object') { // Only pass in null as object!
    return void 0;
  }
  if (typeof prim === 'symbol') {
    return false;
  }
  if (typeof prim === 'string' || typeof prim === 'number') {
    // Loose equal entries exist only if the string is possible to convert to a regular number and not NaN.
    return +prim === +prim; // eslint-disable-line no-implicit-coercion
  }
  return true;
}

// taken from https://github.com/browserify/commonjs-assert/blob/bba838e9ba9e28edf3127ce6974624208502f6bc/internal/util/comparisons.js#L449-L460
function mapMightHaveLoosePrim(a, b, prim, item, opts, channel) {
  var altValue = findLooseMatchingPrimitives(prim);
  if (altValue != null) {
    return altValue;
  }
  var curB = $mapGet$1(b, altValue);
  var looseOpts = object_assign({}, opts, { strict: false });
  if (
    (typeof curB === 'undefined' && !$mapHas$4(b, altValue))
    // eslint-disable-next-line no-use-before-define
    || !internalDeepEqual(item, curB, looseOpts, channel)
  ) {
    return false;
  }
  // eslint-disable-next-line no-use-before-define
  return !$mapHas$4(a, altValue) && internalDeepEqual(item, curB, looseOpts, channel);
}

// taken from https://github.com/browserify/commonjs-assert/blob/bba838e9ba9e28edf3127ce6974624208502f6bc/internal/util/comparisons.js#L441-L447
function setMightHaveLoosePrim(a, b, prim) {
  var altValue = findLooseMatchingPrimitives(prim);
  if (altValue != null) {
    return altValue;
  }

  return $setHas$3(b, altValue) && !$setHas$3(a, altValue);
}

// taken from https://github.com/browserify/commonjs-assert/blob/bba838e9ba9e28edf3127ce6974624208502f6bc/internal/util/comparisons.js#L518-L533
function mapHasEqualEntry(set, map, key1, item1, opts, channel) {
  var i = esGetIterator(set);
  var result;
  var key2;
  while ((result = i.next()) && !result.done) {
    key2 = result.value;
    if (
      // eslint-disable-next-line no-use-before-define
      internalDeepEqual(key1, key2, opts, channel)
      // eslint-disable-next-line no-use-before-define
      && internalDeepEqual(item1, $mapGet$1(map, key2), opts, channel)
    ) {
      $setDelete(set, key2);
      return true;
    }
  }

  return false;
}

function internalDeepEqual(actual, expected, options, channel) {
  var opts = options || {};

  // 7.1. All identical values are equivalent, as determined by ===.
  if (opts.strict ? objectIs(actual, expected) : actual === expected) {
    return true;
  }

  var actualBoxed = whichBoxedPrimitive(actual);
  var expectedBoxed = whichBoxedPrimitive(expected);
  if (actualBoxed !== expectedBoxed) {
    return false;
  }

  // 7.3. Other pairs that do not both pass typeof value == 'object', equivalence is determined by ==.
  if (!actual || !expected || (typeof actual !== 'object' && typeof expected !== 'object')) {
    return opts.strict ? objectIs(actual, expected) : actual == expected; // eslint-disable-line eqeqeq
  }

  /*
   * 7.4. For all other Object pairs, including Array objects, equivalence is
   * determined by having the same number of owned properties (as verified
   * with Object.prototype.hasOwnProperty.call), the same set of keys
   * (although not necessarily the same order), equivalent values for every
   * corresponding key, and an identical 'prototype' property. Note: this
   * accounts for both named and indexed properties on Arrays.
   */
  // see https://github.com/nodejs/node/commit/d3aafd02efd3a403d646a3044adcf14e63a88d32 for memos/channel inspiration

  var hasActual = channel.has(actual);
  var hasExpected = channel.has(expected);
  var sentinel;
  if (hasActual && hasExpected) {
    if (channel.get(actual) === channel.get(expected)) {
      return true;
    }
  } else {
    sentinel = {};
  }
  if (!hasActual) { channel.set(actual, sentinel); }
  if (!hasExpected) { channel.set(expected, sentinel); }

  // eslint-disable-next-line no-use-before-define
  return objEquiv(actual, expected, opts, channel);
}

function isBuffer$1(x) {
  if (!x || typeof x !== 'object' || typeof x.length !== 'number') {
    return false;
  }
  if (typeof x.copy !== 'function' || typeof x.slice !== 'function') {
    return false;
  }
  if (x.length > 0 && typeof x[0] !== 'number') {
    return false;
  }

  return !!(x.constructor && x.constructor.isBuffer && x.constructor.isBuffer(x));
}

function setEquiv(a, b, opts, channel) {
  if ($setSize(a) !== $setSize(b)) {
    return false;
  }
  var iA = esGetIterator(a);
  var iB = esGetIterator(b);
  var resultA;
  var resultB;
  var set;
  while ((resultA = iA.next()) && !resultA.done) {
    if (resultA.value && typeof resultA.value === 'object') {
      if (!set) { set = new $Set$2(); }
      $setAdd(set, resultA.value);
    } else if (!$setHas$3(b, resultA.value)) {
      if (opts.strict) { return false; }
      if (!setMightHaveLoosePrim(a, b, resultA.value)) {
        return false;
      }
      if (!set) { set = new $Set$2(); }
      $setAdd(set, resultA.value);
    }
  }
  if (set) {
    while ((resultB = iB.next()) && !resultB.done) {
      // We have to check if a primitive value is already matching and only if it's not, go hunting for it.
      if (resultB.value && typeof resultB.value === 'object') {
        if (!setHasEqualElement(set, resultB.value, opts.strict, channel)) {
          return false;
        }
      } else if (
        !opts.strict
        && !$setHas$3(a, resultB.value)
        && !setHasEqualElement(set, resultB.value, opts.strict, channel)
      ) {
        return false;
      }
    }
    return $setSize(set) === 0;
  }
  return true;
}

function mapEquiv(a, b, opts, channel) {
  if ($mapSize(a) !== $mapSize(b)) {
    return false;
  }
  var iA = esGetIterator(a);
  var iB = esGetIterator(b);
  var resultA;
  var resultB;
  var set;
  var key;
  var item1;
  var item2;
  while ((resultA = iA.next()) && !resultA.done) {
    key = resultA.value[0];
    item1 = resultA.value[1];
    if (key && typeof key === 'object') {
      if (!set) { set = new $Set$2(); }
      $setAdd(set, key);
    } else {
      item2 = $mapGet$1(b, key);
      if ((typeof item2 === 'undefined' && !$mapHas$4(b, key)) || !internalDeepEqual(item1, item2, opts, channel)) {
        if (opts.strict) {
          return false;
        }
        if (!mapMightHaveLoosePrim(a, b, key, item1, opts, channel)) {
          return false;
        }
        if (!set) { set = new $Set$2(); }
        $setAdd(set, key);
      }
    }
  }

  if (set) {
    while ((resultB = iB.next()) && !resultB.done) {
      key = resultB.value[0];
      item2 = resultB.value[1];
      if (key && typeof key === 'object') {
        if (!mapHasEqualEntry(set, a, key, item2, opts, channel)) {
          return false;
        }
      } else if (
        !opts.strict
        && (!a.has(key) || !internalDeepEqual($mapGet$1(a, key), item2, opts, channel))
        && !mapHasEqualEntry(set, a, key, item2, object_assign({}, opts, { strict: false }), channel)
      ) {
        return false;
      }
    }
    return $setSize(set) === 0;
  }
  return true;
}

function objEquiv(a, b, opts, channel) {
  /* eslint max-statements: [2, 100], max-lines-per-function: [2, 120], max-depth: [2, 5] */
  var i, key;

  if (typeof a !== typeof b) { return false; }
  if (a == null || b == null) { return false; }

  if ($objToString(a) !== $objToString(b)) { return false; }

  if (isArguments$2(a) !== isArguments$2(b)) { return false; }

  var aIsArray = isarray(a);
  var bIsArray = isarray(b);
  if (aIsArray !== bIsArray) { return false; }

  // TODO: replace when a cross-realm brand check is available
  var aIsError = a instanceof Error;
  var bIsError = b instanceof Error;
  if (aIsError !== bIsError) { return false; }
  if (aIsError || bIsError) {
    if (a.name !== b.name || a.message !== b.message) { return false; }
  }

  var aIsRegex = isRegex(a);
  var bIsRegex = isRegex(b);
  if (aIsRegex !== bIsRegex) { return false; }
  if ((aIsRegex || bIsRegex) && (a.source !== b.source || regexp_prototype_flags(a) !== regexp_prototype_flags(b))) {
    return false;
  }

  var aIsDate = isDateObject(a);
  var bIsDate = isDateObject(b);
  if (aIsDate !== bIsDate) { return false; }
  if (aIsDate || bIsDate) { // && would work too, because both are true or both false here
    if ($getTime(a) !== $getTime(b)) { return false; }
  }
  if (opts.strict && gPO && gPO(a) !== gPO(b)) { return false; }

  if (whichTypedArray(a) !== whichTypedArray(b)) {
    return false;
  }

  var aIsBuffer = isBuffer$1(a);
  var bIsBuffer = isBuffer$1(b);
  if (aIsBuffer !== bIsBuffer) { return false; }
  if (aIsBuffer || bIsBuffer) { // && would work too, because both are true or both false here
    if (a.length !== b.length) { return false; }
    for (i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) { return false; }
    }
    return true;
  }

  if (typeof a !== typeof b) { return false; }

  var ka = objectKeys(a);
  var kb = objectKeys(b);
  // having the same number of owned properties (keys incorporates hasOwnProperty)
  if (ka.length !== kb.length) { return false; }

  // the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  // ~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i]) { return false; } // eslint-disable-line eqeqeq
  }

  // equivalent values for every corresponding key, and ~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!internalDeepEqual(a[key], b[key], opts, channel)) { return false; }
  }

  var aCollection = whichCollection(a);
  var bCollection = whichCollection(b);
  if (aCollection !== bCollection) {
    return false;
  }
  if (aCollection === 'Set' || bCollection === 'Set') { // aCollection === bCollection
    return setEquiv(a, b, opts, channel);
  }
  if (aCollection === 'Map') { // aCollection === bCollection
    return mapEquiv(a, b, opts, channel);
  }

  return true;
}

var deepEqual = function deepEqual(a, b, opts) {
  return internalDeepEqual(a, b, opts, sideChannel());
};

// Implementation originally from Twitter's Hogan.js:
// https://github.com/twitter/hogan.js/blob/master/lib/template.js#L325-L335

var rAmp = /&/g;
var rLt = /</g;
var rApos =/\'/g;
var rQuot = /\"/g;
var hChars =/[&<>\"\']/;

var htmlEscape = function(str) {
  if (str == null) {
    return str;
  }

  if (typeof str !== "string") {
    str = String(str);
  }

  if (hChars.test(String(str))) {
    return str
      .replace(rAmp,'&amp;')
      .replace(rLt,'&lt;')
      .replace(rApos,'&apos;')
      .replace(rQuot, '&quot;');
  }
  else {
    return str;
  }
};

const _get$1 = async (mailboxId, messageId, markAsSeen = true) => {
    return await get(`/users/me/mailboxes/${mailboxId}/messages/${messageId}${markAsSeen ? `?markAsSeen=true` : ""}`);
};
const list = async (from) => {
    console.log("[WS] listing messages", from);
    const { nextCursor, previousCursor, results } = await get(`/users/me/mailboxes/${from}/messages`);
    console.log("[WS] messages received");
    return { next: nextCursor, prev: previousCursor, messages: results };
};
const flag = async (mailboxId, messages, value) => {
    return await put(`/users/me/mailboxes/${mailboxId}/messages`, {
        message: messages.join(","),
        flagged: value
    });
};
const markAsSpam = async (from, messages, value) => {
    const junkId = junk.get().id;
    const inboxId = inbox.get().id;
    if (value) {
        if (from === junkId) {
            throw new Error("The messages are already in Junk folder");
        }
        return await moveTo(from, messages, junkId);
    }
    else {
        if (from !== junkId) {
            throw new Error("To unmark as spam the must be in the Junk folder");
        }
        return await moveTo(from, messages, inboxId);
    }
};
const updateSeen = async (from, messages, value) => {
    return await put(`/users/me/mailboxes/${from}/messages`, {
        message: messages.join(","),
        seen: value
    });
};
const moveTo = async (from, messages, to) => {
    if (from === to) {
        throw new Error("messages.moveTo 'from' and 'to' are the same mailbox");
    }
    return await put(`/users/me/mailboxes/${from}/messages`, {
        message: messages.join(','),
        moveTo: to
    });
};
const next = async (from, cursor) => {
    const { nextCursor, previousCursor, results } = await get(`/users/me/mailboxes/${from}/messages?next=${cursor}`);
    return { next: nextCursor, prev: previousCursor, messages: results };
};
const _del = async (from, messages) => {
    if (from === trash.get().id || from === drafts.get().id) {
        return await Promise.all(messages.map(m => del(`/users/me/mailboxes/${from}/messages/${m}`)));
    }
    else {
        return await moveTo(from, messages, trash.get().id);
    }
};
// html should be sanitized after passing to this function
const createDraft = (src = {}) => {
    console.log("createDraft", src);
    const defs = {
        draft: true,
        flagged: false,
        text: "",
        html: "",
        subject: "",
        to: [],
        bcc: [],
        cc: [],
        files: [],
    };
    return Object.assign(defs, src);
    //const {message} = await post(`/users/me/mailboxes/${drafts.get().id}/messages`, draft)
    //return await get(`/users/me/mailboxes/${drafts.get().id}/messages/${message.id}`)
};
const getDraft = async (id) => {
    const { flagged, text, html, subject, to, bcc, cc, files, attachments } = await _get$1(drafts.get().id, id);
    const d = { id };
    flagged != null && (d.flagged = flagged);
    text != null && (d.text = text);
    html != null && (d.html = html.join(""));
    subject != null && (d.subject = subject);
    to != null && (d.to = to);
    bcc != null && (d.bcc = bcc);
    cc != null && (d.cc = cc);
    files != null && (d.files = files);
    return createDraft(d);
};
const createBody = (action, ref) => {
    return "<br/>".repeat(5) +
        [
            "-".repeat(10) + " " +
                (action === "Re" ? "Reply message" : "Forwarded message") +
                " " + "-".repeat(10) + "<br/>",
            ref.from && (`From: <b>${htmlEscape(ref.from.name) || ""}</b> ${htmlEscape("<\u200B" + ref.from.address + "\u200B>")}` + "<br/>"),
            ref.to && ref.to.length && (`To: ${ref.to.map(to => htmlEscape(to.address)).join(", ")}` + "<br/>"),
            "Subject: " + htmlEscape(ref.subject) + "<br/>",
            "Date: " + htmlEscape(new Date(ref.date).toUTCString()) + "<br/>",
        ].filter(Boolean).join("") + "<br/><br/>" +
        (ref.html && sanitize(ref.html.join("")) || "");
};
const createReply = async (mailbox, message) => {
    const ref = await _get$1(mailbox, message, false);
    const html = createBody("Re", ref);
    return createDraft({
        subject: "Re: " + (ref.subject || ""),
        to: [ref.from],
        html,
        reference: {
            mailbox,
            id: message,
            action: "reply",
            attachments: false
        }
    });
};
const createReplyAll = async (mailbox, message) => {
    const ref = await _get$1(mailbox, message, false);
    const html = createBody("Re", ref);
    return createDraft({
        html,
        reference: {
            mailbox,
            id: message,
            action: "replyAll",
            attachments: false
        }
    });
};
const createForward = async (mailbox, message) => {
    var _a, _b;
    const ref = await _get$1(mailbox, message, false);
    const html = createBody("Fwd", ref);
    const to = ref.from ? [ref.from] : [];
    (_a = ref.to) === null || _a === void 0 ? void 0 : _a.forEach(addr => { var _a; return addr.address !== ((_a = user.get()) === null || _a === void 0 ? void 0 : _a.address) && to.push(addr); });
    const files = [];
    if ((_b = ref.attachments) === null || _b === void 0 ? void 0 : _b.length) {
        for (const attachment of ref.attachments) {
            const { id, sizeKb, filename, contentType } = attachment;
            const file = { id, filename, contentType, size: Math.round(sizeKb * 1024) };
            files.push(file);
        }
    }
    return createDraft({
        html,
        subject: "Re: " + (ref.subject || ""),
        to,
        files,
        reference: {
            mailbox,
            id: message,
            action: "forward",
            attachments: true
        }
    });
};
const createPostableDraft = (draft) => {
    const { flagged, to, cc, bcc, subject, text, html, files, metadata, reference } = draft;
    return {
        draft: true, flagged, to, cc, bcc, subject, text, html, metadata, reference,
        files: files.map(f => f.id).filter(Boolean)
    };
};
const saveDraft = async (draft) => {
    const toPost = createPostableDraft(draft);
    const { message: { id } } = await post(`/users/me/mailboxes/${drafts.get().id}/messages`, toPost);
    if (draft.id != null) {
        del(`/users/me/mailboxes/${drafts.get().id}/messages/${draft.id}`);
    }
    return id;
};
const submitDraft = async (id, { deleteFiles = false } = {}) => {
    return post(`/users/me/mailboxes/${drafts.get().id}/messages/${id}/submit`, { deleteFiles });
};

var messages = /*#__PURE__*/Object.freeze({
    __proto__: null,
    get: _get$1,
    list: list,
    flag: flag,
    markAsSpam: markAsSpam,
    updateSeen: updateSeen,
    moveTo: moveTo,
    next: next,
    del: _del,
    createDraft: createDraft,
    getDraft: getDraft,
    createReply: createReply,
    createReplyAll: createReplyAll,
    createForward: createForward,
    createPostableDraft: createPostableDraft,
    saveDraft: saveDraft,
    submitDraft: submitDraft
});

const [send$1, receive] = crossfade({
    duration: 300,
    fallback: (node) => fade(node, { duration: 150 })
});
const current = writable(null);
const wins = writable([]);
const create = async (draft) => {
    let push = false;
    if (draft == null) {
        const $draft = await createDraft();
        draft = writable($draft);
        push = true;
    }
    else if (draft.get().id != null) {
        const d = wins.get().find(d => d.get().id === draft.get().id);
        if (d) {
            draft = d;
            push = false;
        }
        else {
            push = true;
        }
    }
    else {
        push = true;
    }
    push && wins.update(w => [draft, ...w]);
    current.set(draft);
};

/* node_modules/svelte-material-icons/FormatBold.svelte generated by Svelte v3.21.0 */

const file$u = "node_modules/svelte-material-icons/FormatBold.svelte";

function create_fragment$v(ctx) {
	let svg;
	let path;

	const block = {
		c: function create() {
			svg = svg_element("svg");
			path = svg_element("path");
			attr_dev(path, "d", "M13.5,15.5H10V12.5H13.5A1.5,1.5 0 0,1 15,14A1.5,1.5 0 0,1 13.5,15.5M10,6.5H13A1.5,1.5 0 0,1 14.5,8A1.5,1.5 0 0,1 13,9.5H10M15.6,10.79C16.57,10.11 17.25,9 17.25,8C17.25,5.74 15.5,4 13.25,4H7V18H14.04C16.14,18 17.75,16.3 17.75,14.21C17.75,12.69 16.89,11.39 15.6,10.79Z");
			attr_dev(path, "fill", /*color*/ ctx[2]);
			add_location(path, file$u, 8, 59, 234);
			attr_dev(svg, "width", /*width*/ ctx[0]);
			attr_dev(svg, "height", /*height*/ ctx[1]);
			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			add_location(svg, file$u, 8, 0, 175);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, svg, anchor);
			append_dev(svg, path);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*color*/ 4) {
				attr_dev(path, "fill", /*color*/ ctx[2]);
			}

			if (dirty & /*width*/ 1) {
				attr_dev(svg, "width", /*width*/ ctx[0]);
			}

			if (dirty & /*height*/ 2) {
				attr_dev(svg, "height", /*height*/ ctx[1]);
			}

			if (dirty & /*viewBox*/ 8) {
				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(svg);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$v.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$v($$self, $$props, $$invalidate) {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	const writable_props = ["size", "width", "height", "color", "viewBox"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<FormatBold> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("FormatBold", $$slots, []);

	$$self.$set = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

	$$self.$inject_state = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [width, height, color, viewBox, size];
}

class FormatBold extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$v, create_fragment$v, safe_not_equal, {
			size: 4,
			width: 0,
			height: 1,
			color: 2,
			viewBox: 3
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "FormatBold",
			options,
			id: create_fragment$v.name
		});
	}

	get size() {
		throw new Error("<FormatBold>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set size(value) {
		throw new Error("<FormatBold>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get width() {
		throw new Error("<FormatBold>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set width(value) {
		throw new Error("<FormatBold>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get height() {
		throw new Error("<FormatBold>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set height(value) {
		throw new Error("<FormatBold>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get color() {
		throw new Error("<FormatBold>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set color(value) {
		throw new Error("<FormatBold>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get viewBox() {
		throw new Error("<FormatBold>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set viewBox(value) {
		throw new Error("<FormatBold>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules/svelte-material-icons/FormatUnderline.svelte generated by Svelte v3.21.0 */

const file$v = "node_modules/svelte-material-icons/FormatUnderline.svelte";

function create_fragment$w(ctx) {
	let svg;
	let path;

	const block = {
		c: function create() {
			svg = svg_element("svg");
			path = svg_element("path");
			attr_dev(path, "d", "M5,21H19V19H5V21M12,17A6,6 0 0,0 18,11V3H15.5V11A3.5,3.5 0 0,1 12,14.5A3.5,3.5 0 0,1 8.5,11V3H6V11A6,6 0 0,0 12,17Z");
			attr_dev(path, "fill", /*color*/ ctx[2]);
			add_location(path, file$v, 8, 59, 234);
			attr_dev(svg, "width", /*width*/ ctx[0]);
			attr_dev(svg, "height", /*height*/ ctx[1]);
			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			add_location(svg, file$v, 8, 0, 175);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, svg, anchor);
			append_dev(svg, path);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*color*/ 4) {
				attr_dev(path, "fill", /*color*/ ctx[2]);
			}

			if (dirty & /*width*/ 1) {
				attr_dev(svg, "width", /*width*/ ctx[0]);
			}

			if (dirty & /*height*/ 2) {
				attr_dev(svg, "height", /*height*/ ctx[1]);
			}

			if (dirty & /*viewBox*/ 8) {
				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(svg);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$w.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$w($$self, $$props, $$invalidate) {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	const writable_props = ["size", "width", "height", "color", "viewBox"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<FormatUnderline> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("FormatUnderline", $$slots, []);

	$$self.$set = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

	$$self.$inject_state = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [width, height, color, viewBox, size];
}

class FormatUnderline extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$w, create_fragment$w, safe_not_equal, {
			size: 4,
			width: 0,
			height: 1,
			color: 2,
			viewBox: 3
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "FormatUnderline",
			options,
			id: create_fragment$w.name
		});
	}

	get size() {
		throw new Error("<FormatUnderline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set size(value) {
		throw new Error("<FormatUnderline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get width() {
		throw new Error("<FormatUnderline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set width(value) {
		throw new Error("<FormatUnderline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get height() {
		throw new Error("<FormatUnderline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set height(value) {
		throw new Error("<FormatUnderline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get color() {
		throw new Error("<FormatUnderline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set color(value) {
		throw new Error("<FormatUnderline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get viewBox() {
		throw new Error("<FormatUnderline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set viewBox(value) {
		throw new Error("<FormatUnderline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules/svelte-material-icons/FormatItalic.svelte generated by Svelte v3.21.0 */

const file$w = "node_modules/svelte-material-icons/FormatItalic.svelte";

function create_fragment$x(ctx) {
	let svg;
	let path;

	const block = {
		c: function create() {
			svg = svg_element("svg");
			path = svg_element("path");
			attr_dev(path, "d", "M10,4V7H12.21L8.79,15H6V18H14V15H11.79L15.21,7H18V4H10Z");
			attr_dev(path, "fill", /*color*/ ctx[2]);
			add_location(path, file$w, 8, 59, 234);
			attr_dev(svg, "width", /*width*/ ctx[0]);
			attr_dev(svg, "height", /*height*/ ctx[1]);
			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			add_location(svg, file$w, 8, 0, 175);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, svg, anchor);
			append_dev(svg, path);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*color*/ 4) {
				attr_dev(path, "fill", /*color*/ ctx[2]);
			}

			if (dirty & /*width*/ 1) {
				attr_dev(svg, "width", /*width*/ ctx[0]);
			}

			if (dirty & /*height*/ 2) {
				attr_dev(svg, "height", /*height*/ ctx[1]);
			}

			if (dirty & /*viewBox*/ 8) {
				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(svg);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$x.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$x($$self, $$props, $$invalidate) {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	const writable_props = ["size", "width", "height", "color", "viewBox"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<FormatItalic> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("FormatItalic", $$slots, []);

	$$self.$set = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

	$$self.$inject_state = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [width, height, color, viewBox, size];
}

class FormatItalic extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$x, create_fragment$x, safe_not_equal, {
			size: 4,
			width: 0,
			height: 1,
			color: 2,
			viewBox: 3
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "FormatItalic",
			options,
			id: create_fragment$x.name
		});
	}

	get size() {
		throw new Error("<FormatItalic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set size(value) {
		throw new Error("<FormatItalic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get width() {
		throw new Error("<FormatItalic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set width(value) {
		throw new Error("<FormatItalic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get height() {
		throw new Error("<FormatItalic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set height(value) {
		throw new Error("<FormatItalic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get color() {
		throw new Error("<FormatItalic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set color(value) {
		throw new Error("<FormatItalic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get viewBox() {
		throw new Error("<FormatItalic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set viewBox(value) {
		throw new Error("<FormatItalic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules/svelte-material-icons/FormatAlignLeft.svelte generated by Svelte v3.21.0 */

const file$x = "node_modules/svelte-material-icons/FormatAlignLeft.svelte";

function create_fragment$y(ctx) {
	let svg;
	let path;

	const block = {
		c: function create() {
			svg = svg_element("svg");
			path = svg_element("path");
			attr_dev(path, "d", "M3,3H21V5H3V3M3,7H15V9H3V7M3,11H21V13H3V11M3,15H15V17H3V15M3,19H21V21H3V19Z");
			attr_dev(path, "fill", /*color*/ ctx[2]);
			add_location(path, file$x, 8, 59, 234);
			attr_dev(svg, "width", /*width*/ ctx[0]);
			attr_dev(svg, "height", /*height*/ ctx[1]);
			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			add_location(svg, file$x, 8, 0, 175);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, svg, anchor);
			append_dev(svg, path);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*color*/ 4) {
				attr_dev(path, "fill", /*color*/ ctx[2]);
			}

			if (dirty & /*width*/ 1) {
				attr_dev(svg, "width", /*width*/ ctx[0]);
			}

			if (dirty & /*height*/ 2) {
				attr_dev(svg, "height", /*height*/ ctx[1]);
			}

			if (dirty & /*viewBox*/ 8) {
				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(svg);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$y.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$y($$self, $$props, $$invalidate) {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	const writable_props = ["size", "width", "height", "color", "viewBox"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<FormatAlignLeft> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("FormatAlignLeft", $$slots, []);

	$$self.$set = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

	$$self.$inject_state = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [width, height, color, viewBox, size];
}

class FormatAlignLeft extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$y, create_fragment$y, safe_not_equal, {
			size: 4,
			width: 0,
			height: 1,
			color: 2,
			viewBox: 3
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "FormatAlignLeft",
			options,
			id: create_fragment$y.name
		});
	}

	get size() {
		throw new Error("<FormatAlignLeft>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set size(value) {
		throw new Error("<FormatAlignLeft>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get width() {
		throw new Error("<FormatAlignLeft>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set width(value) {
		throw new Error("<FormatAlignLeft>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get height() {
		throw new Error("<FormatAlignLeft>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set height(value) {
		throw new Error("<FormatAlignLeft>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get color() {
		throw new Error("<FormatAlignLeft>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set color(value) {
		throw new Error("<FormatAlignLeft>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get viewBox() {
		throw new Error("<FormatAlignLeft>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set viewBox(value) {
		throw new Error("<FormatAlignLeft>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules/svelte-material-icons/FormatAlignRight.svelte generated by Svelte v3.21.0 */

const file$y = "node_modules/svelte-material-icons/FormatAlignRight.svelte";

function create_fragment$z(ctx) {
	let svg;
	let path;

	const block = {
		c: function create() {
			svg = svg_element("svg");
			path = svg_element("path");
			attr_dev(path, "d", "M3,3H21V5H3V3M9,7H21V9H9V7M3,11H21V13H3V11M9,15H21V17H9V15M3,19H21V21H3V19Z");
			attr_dev(path, "fill", /*color*/ ctx[2]);
			add_location(path, file$y, 8, 59, 234);
			attr_dev(svg, "width", /*width*/ ctx[0]);
			attr_dev(svg, "height", /*height*/ ctx[1]);
			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			add_location(svg, file$y, 8, 0, 175);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, svg, anchor);
			append_dev(svg, path);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*color*/ 4) {
				attr_dev(path, "fill", /*color*/ ctx[2]);
			}

			if (dirty & /*width*/ 1) {
				attr_dev(svg, "width", /*width*/ ctx[0]);
			}

			if (dirty & /*height*/ 2) {
				attr_dev(svg, "height", /*height*/ ctx[1]);
			}

			if (dirty & /*viewBox*/ 8) {
				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(svg);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$z.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$z($$self, $$props, $$invalidate) {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	const writable_props = ["size", "width", "height", "color", "viewBox"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<FormatAlignRight> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("FormatAlignRight", $$slots, []);

	$$self.$set = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

	$$self.$inject_state = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [width, height, color, viewBox, size];
}

class FormatAlignRight extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$z, create_fragment$z, safe_not_equal, {
			size: 4,
			width: 0,
			height: 1,
			color: 2,
			viewBox: 3
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "FormatAlignRight",
			options,
			id: create_fragment$z.name
		});
	}

	get size() {
		throw new Error("<FormatAlignRight>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set size(value) {
		throw new Error("<FormatAlignRight>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get width() {
		throw new Error("<FormatAlignRight>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set width(value) {
		throw new Error("<FormatAlignRight>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get height() {
		throw new Error("<FormatAlignRight>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set height(value) {
		throw new Error("<FormatAlignRight>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get color() {
		throw new Error("<FormatAlignRight>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set color(value) {
		throw new Error("<FormatAlignRight>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get viewBox() {
		throw new Error("<FormatAlignRight>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set viewBox(value) {
		throw new Error("<FormatAlignRight>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules/svelte-material-icons/FormatAlignCenter.svelte generated by Svelte v3.21.0 */

const file$z = "node_modules/svelte-material-icons/FormatAlignCenter.svelte";

function create_fragment$A(ctx) {
	let svg;
	let path;

	const block = {
		c: function create() {
			svg = svg_element("svg");
			path = svg_element("path");
			attr_dev(path, "d", "M3,3H21V5H3V3M7,7H17V9H7V7M3,11H21V13H3V11M7,15H17V17H7V15M3,19H21V21H3V19Z");
			attr_dev(path, "fill", /*color*/ ctx[2]);
			add_location(path, file$z, 8, 59, 234);
			attr_dev(svg, "width", /*width*/ ctx[0]);
			attr_dev(svg, "height", /*height*/ ctx[1]);
			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			add_location(svg, file$z, 8, 0, 175);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, svg, anchor);
			append_dev(svg, path);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*color*/ 4) {
				attr_dev(path, "fill", /*color*/ ctx[2]);
			}

			if (dirty & /*width*/ 1) {
				attr_dev(svg, "width", /*width*/ ctx[0]);
			}

			if (dirty & /*height*/ 2) {
				attr_dev(svg, "height", /*height*/ ctx[1]);
			}

			if (dirty & /*viewBox*/ 8) {
				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(svg);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$A.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$A($$self, $$props, $$invalidate) {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	const writable_props = ["size", "width", "height", "color", "viewBox"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<FormatAlignCenter> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("FormatAlignCenter", $$slots, []);

	$$self.$set = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

	$$self.$inject_state = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [width, height, color, viewBox, size];
}

class FormatAlignCenter extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$A, create_fragment$A, safe_not_equal, {
			size: 4,
			width: 0,
			height: 1,
			color: 2,
			viewBox: 3
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "FormatAlignCenter",
			options,
			id: create_fragment$A.name
		});
	}

	get size() {
		throw new Error("<FormatAlignCenter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set size(value) {
		throw new Error("<FormatAlignCenter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get width() {
		throw new Error("<FormatAlignCenter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set width(value) {
		throw new Error("<FormatAlignCenter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get height() {
		throw new Error("<FormatAlignCenter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set height(value) {
		throw new Error("<FormatAlignCenter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get color() {
		throw new Error("<FormatAlignCenter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set color(value) {
		throw new Error("<FormatAlignCenter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get viewBox() {
		throw new Error("<FormatAlignCenter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set viewBox(value) {
		throw new Error("<FormatAlignCenter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules/svelte-material-icons/FormatListBulleted.svelte generated by Svelte v3.21.0 */

const file$A = "node_modules/svelte-material-icons/FormatListBulleted.svelte";

function create_fragment$B(ctx) {
	let svg;
	let path;

	const block = {
		c: function create() {
			svg = svg_element("svg");
			path = svg_element("path");
			attr_dev(path, "d", "M7,5H21V7H7V5M7,13V11H21V13H7M4,4.5A1.5,1.5 0 0,1 5.5,6A1.5,1.5 0 0,1 4,7.5A1.5,1.5 0 0,1 2.5,6A1.5,1.5 0 0,1 4,4.5M4,10.5A1.5,1.5 0 0,1 5.5,12A1.5,1.5 0 0,1 4,13.5A1.5,1.5 0 0,1 2.5,12A1.5,1.5 0 0,1 4,10.5M7,19V17H21V19H7M4,16.5A1.5,1.5 0 0,1 5.5,18A1.5,1.5 0 0,1 4,19.5A1.5,1.5 0 0,1 2.5,18A1.5,1.5 0 0,1 4,16.5Z");
			attr_dev(path, "fill", /*color*/ ctx[2]);
			add_location(path, file$A, 8, 59, 234);
			attr_dev(svg, "width", /*width*/ ctx[0]);
			attr_dev(svg, "height", /*height*/ ctx[1]);
			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			add_location(svg, file$A, 8, 0, 175);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, svg, anchor);
			append_dev(svg, path);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*color*/ 4) {
				attr_dev(path, "fill", /*color*/ ctx[2]);
			}

			if (dirty & /*width*/ 1) {
				attr_dev(svg, "width", /*width*/ ctx[0]);
			}

			if (dirty & /*height*/ 2) {
				attr_dev(svg, "height", /*height*/ ctx[1]);
			}

			if (dirty & /*viewBox*/ 8) {
				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(svg);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$B.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$B($$self, $$props, $$invalidate) {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	const writable_props = ["size", "width", "height", "color", "viewBox"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<FormatListBulleted> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("FormatListBulleted", $$slots, []);

	$$self.$set = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

	$$self.$inject_state = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [width, height, color, viewBox, size];
}

class FormatListBulleted extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$B, create_fragment$B, safe_not_equal, {
			size: 4,
			width: 0,
			height: 1,
			color: 2,
			viewBox: 3
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "FormatListBulleted",
			options,
			id: create_fragment$B.name
		});
	}

	get size() {
		throw new Error("<FormatListBulleted>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set size(value) {
		throw new Error("<FormatListBulleted>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get width() {
		throw new Error("<FormatListBulleted>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set width(value) {
		throw new Error("<FormatListBulleted>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get height() {
		throw new Error("<FormatListBulleted>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set height(value) {
		throw new Error("<FormatListBulleted>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get color() {
		throw new Error("<FormatListBulleted>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set color(value) {
		throw new Error("<FormatListBulleted>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get viewBox() {
		throw new Error("<FormatListBulleted>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set viewBox(value) {
		throw new Error("<FormatListBulleted>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules/svelte-material-icons/FormatListNumbered.svelte generated by Svelte v3.21.0 */

const file$B = "node_modules/svelte-material-icons/FormatListNumbered.svelte";

function create_fragment$C(ctx) {
	let svg;
	let path;

	const block = {
		c: function create() {
			svg = svg_element("svg");
			path = svg_element("path");
			attr_dev(path, "d", "M7,13V11H21V13H7M7,19V17H21V19H7M7,7V5H21V7H7M3,8V5H2V4H4V8H3M2,17V16H5V20H2V19H4V18.5H3V17.5H4V17H2M4.25,10A0.75,0.75 0 0,1 5,10.75C5,10.95 4.92,11.14 4.79,11.27L3.12,13H5V14H2V13.08L4,11H2V10H4.25Z");
			attr_dev(path, "fill", /*color*/ ctx[2]);
			add_location(path, file$B, 8, 59, 234);
			attr_dev(svg, "width", /*width*/ ctx[0]);
			attr_dev(svg, "height", /*height*/ ctx[1]);
			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			add_location(svg, file$B, 8, 0, 175);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, svg, anchor);
			append_dev(svg, path);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*color*/ 4) {
				attr_dev(path, "fill", /*color*/ ctx[2]);
			}

			if (dirty & /*width*/ 1) {
				attr_dev(svg, "width", /*width*/ ctx[0]);
			}

			if (dirty & /*height*/ 2) {
				attr_dev(svg, "height", /*height*/ ctx[1]);
			}

			if (dirty & /*viewBox*/ 8) {
				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(svg);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$C.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$C($$self, $$props, $$invalidate) {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	const writable_props = ["size", "width", "height", "color", "viewBox"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<FormatListNumbered> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("FormatListNumbered", $$slots, []);

	$$self.$set = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

	$$self.$inject_state = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [width, height, color, viewBox, size];
}

class FormatListNumbered extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$C, create_fragment$C, safe_not_equal, {
			size: 4,
			width: 0,
			height: 1,
			color: 2,
			viewBox: 3
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "FormatListNumbered",
			options,
			id: create_fragment$C.name
		});
	}

	get size() {
		throw new Error("<FormatListNumbered>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set size(value) {
		throw new Error("<FormatListNumbered>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get width() {
		throw new Error("<FormatListNumbered>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set width(value) {
		throw new Error("<FormatListNumbered>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get height() {
		throw new Error("<FormatListNumbered>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set height(value) {
		throw new Error("<FormatListNumbered>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get color() {
		throw new Error("<FormatListNumbered>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set color(value) {
		throw new Error("<FormatListNumbered>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get viewBox() {
		throw new Error("<FormatListNumbered>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set viewBox(value) {
		throw new Error("<FormatListNumbered>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules/svelte-material-icons/Undo.svelte generated by Svelte v3.21.0 */

const file$C = "node_modules/svelte-material-icons/Undo.svelte";

function create_fragment$D(ctx) {
	let svg;
	let path;

	const block = {
		c: function create() {
			svg = svg_element("svg");
			path = svg_element("path");
			attr_dev(path, "d", "M12.5,8C9.85,8 7.45,9 5.6,10.6L2,7V16H11L7.38,12.38C8.77,11.22 10.54,10.5 12.5,10.5C16.04,10.5 19.05,12.81 20.1,16L22.47,15.22C21.08,11.03 17.15,8 12.5,8Z");
			attr_dev(path, "fill", /*color*/ ctx[2]);
			add_location(path, file$C, 8, 59, 234);
			attr_dev(svg, "width", /*width*/ ctx[0]);
			attr_dev(svg, "height", /*height*/ ctx[1]);
			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			add_location(svg, file$C, 8, 0, 175);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, svg, anchor);
			append_dev(svg, path);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*color*/ 4) {
				attr_dev(path, "fill", /*color*/ ctx[2]);
			}

			if (dirty & /*width*/ 1) {
				attr_dev(svg, "width", /*width*/ ctx[0]);
			}

			if (dirty & /*height*/ 2) {
				attr_dev(svg, "height", /*height*/ ctx[1]);
			}

			if (dirty & /*viewBox*/ 8) {
				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(svg);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$D.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$D($$self, $$props, $$invalidate) {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	const writable_props = ["size", "width", "height", "color", "viewBox"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Undo> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("Undo", $$slots, []);

	$$self.$set = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

	$$self.$inject_state = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [width, height, color, viewBox, size];
}

class Undo extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$D, create_fragment$D, safe_not_equal, {
			size: 4,
			width: 0,
			height: 1,
			color: 2,
			viewBox: 3
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Undo",
			options,
			id: create_fragment$D.name
		});
	}

	get size() {
		throw new Error("<Undo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set size(value) {
		throw new Error("<Undo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get width() {
		throw new Error("<Undo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set width(value) {
		throw new Error("<Undo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get height() {
		throw new Error("<Undo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set height(value) {
		throw new Error("<Undo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get color() {
		throw new Error("<Undo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set color(value) {
		throw new Error("<Undo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get viewBox() {
		throw new Error("<Undo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set viewBox(value) {
		throw new Error("<Undo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules/svelte-material-icons/Redo.svelte generated by Svelte v3.21.0 */

const file$D = "node_modules/svelte-material-icons/Redo.svelte";

function create_fragment$E(ctx) {
	let svg;
	let path;

	const block = {
		c: function create() {
			svg = svg_element("svg");
			path = svg_element("path");
			attr_dev(path, "d", "M18.4,10.6C16.55,9 14.15,8 11.5,8C6.85,8 2.92,11.03 1.54,15.22L3.9,16C4.95,12.81 7.95,10.5 11.5,10.5C13.45,10.5 15.23,11.22 16.62,12.38L13,16H22V7L18.4,10.6Z");
			attr_dev(path, "fill", /*color*/ ctx[2]);
			add_location(path, file$D, 8, 59, 234);
			attr_dev(svg, "width", /*width*/ ctx[0]);
			attr_dev(svg, "height", /*height*/ ctx[1]);
			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			add_location(svg, file$D, 8, 0, 175);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, svg, anchor);
			append_dev(svg, path);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*color*/ 4) {
				attr_dev(path, "fill", /*color*/ ctx[2]);
			}

			if (dirty & /*width*/ 1) {
				attr_dev(svg, "width", /*width*/ ctx[0]);
			}

			if (dirty & /*height*/ 2) {
				attr_dev(svg, "height", /*height*/ ctx[1]);
			}

			if (dirty & /*viewBox*/ 8) {
				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(svg);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$E.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$E($$self, $$props, $$invalidate) {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	const writable_props = ["size", "width", "height", "color", "viewBox"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Redo> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("Redo", $$slots, []);

	$$self.$set = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

	$$self.$inject_state = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [width, height, color, viewBox, size];
}

class Redo extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$E, create_fragment$E, safe_not_equal, {
			size: 4,
			width: 0,
			height: 1,
			color: 2,
			viewBox: 3
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Redo",
			options,
			id: create_fragment$E.name
		});
	}

	get size() {
		throw new Error("<Redo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set size(value) {
		throw new Error("<Redo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get width() {
		throw new Error("<Redo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set width(value) {
		throw new Error("<Redo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get height() {
		throw new Error("<Redo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set height(value) {
		throw new Error("<Redo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get color() {
		throw new Error("<Redo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set color(value) {
		throw new Error("<Redo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get viewBox() {
		throw new Error("<Redo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set viewBox(value) {
		throw new Error("<Redo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules/svelte-material-icons/FormatQuoteClose.svelte generated by Svelte v3.21.0 */

const file$E = "node_modules/svelte-material-icons/FormatQuoteClose.svelte";

function create_fragment$F(ctx) {
	let svg;
	let path;

	const block = {
		c: function create() {
			svg = svg_element("svg");
			path = svg_element("path");
			attr_dev(path, "d", "M14,17H17L19,13V7H13V13H16M6,17H9L11,13V7H5V13H8L6,17Z");
			attr_dev(path, "fill", /*color*/ ctx[2]);
			add_location(path, file$E, 8, 59, 234);
			attr_dev(svg, "width", /*width*/ ctx[0]);
			attr_dev(svg, "height", /*height*/ ctx[1]);
			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			add_location(svg, file$E, 8, 0, 175);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, svg, anchor);
			append_dev(svg, path);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*color*/ 4) {
				attr_dev(path, "fill", /*color*/ ctx[2]);
			}

			if (dirty & /*width*/ 1) {
				attr_dev(svg, "width", /*width*/ ctx[0]);
			}

			if (dirty & /*height*/ 2) {
				attr_dev(svg, "height", /*height*/ ctx[1]);
			}

			if (dirty & /*viewBox*/ 8) {
				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(svg);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$F.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$F($$self, $$props, $$invalidate) {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	const writable_props = ["size", "width", "height", "color", "viewBox"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<FormatQuoteClose> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("FormatQuoteClose", $$slots, []);

	$$self.$set = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

	$$self.$inject_state = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [width, height, color, viewBox, size];
}

class FormatQuoteClose extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$F, create_fragment$F, safe_not_equal, {
			size: 4,
			width: 0,
			height: 1,
			color: 2,
			viewBox: 3
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "FormatQuoteClose",
			options,
			id: create_fragment$F.name
		});
	}

	get size() {
		throw new Error("<FormatQuoteClose>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set size(value) {
		throw new Error("<FormatQuoteClose>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get width() {
		throw new Error("<FormatQuoteClose>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set width(value) {
		throw new Error("<FormatQuoteClose>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get height() {
		throw new Error("<FormatQuoteClose>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set height(value) {
		throw new Error("<FormatQuoteClose>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get color() {
		throw new Error("<FormatQuoteClose>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set color(value) {
		throw new Error("<FormatQuoteClose>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get viewBox() {
		throw new Error("<FormatQuoteClose>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set viewBox(value) {
		throw new Error("<FormatQuoteClose>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules/svelte-material-icons/FormatSize.svelte generated by Svelte v3.21.0 */

const file$F = "node_modules/svelte-material-icons/FormatSize.svelte";

function create_fragment$G(ctx) {
	let svg;
	let path;

	const block = {
		c: function create() {
			svg = svg_element("svg");
			path = svg_element("path");
			attr_dev(path, "d", "M3,12H6V19H9V12H12V9H3M9,4V7H14V19H17V7H22V4H9Z");
			attr_dev(path, "fill", /*color*/ ctx[2]);
			add_location(path, file$F, 8, 59, 234);
			attr_dev(svg, "width", /*width*/ ctx[0]);
			attr_dev(svg, "height", /*height*/ ctx[1]);
			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			add_location(svg, file$F, 8, 0, 175);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, svg, anchor);
			append_dev(svg, path);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*color*/ 4) {
				attr_dev(path, "fill", /*color*/ ctx[2]);
			}

			if (dirty & /*width*/ 1) {
				attr_dev(svg, "width", /*width*/ ctx[0]);
			}

			if (dirty & /*height*/ 2) {
				attr_dev(svg, "height", /*height*/ ctx[1]);
			}

			if (dirty & /*viewBox*/ 8) {
				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(svg);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$G.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$G($$self, $$props, $$invalidate) {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	const writable_props = ["size", "width", "height", "color", "viewBox"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<FormatSize> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("FormatSize", $$slots, []);

	$$self.$set = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

	$$self.$inject_state = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [width, height, color, viewBox, size];
}

class FormatSize extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$G, create_fragment$G, safe_not_equal, {
			size: 4,
			width: 0,
			height: 1,
			color: 2,
			viewBox: 3
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "FormatSize",
			options,
			id: create_fragment$G.name
		});
	}

	get size() {
		throw new Error("<FormatSize>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set size(value) {
		throw new Error("<FormatSize>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get width() {
		throw new Error("<FormatSize>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set width(value) {
		throw new Error("<FormatSize>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get height() {
		throw new Error("<FormatSize>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set height(value) {
		throw new Error("<FormatSize>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get color() {
		throw new Error("<FormatSize>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set color(value) {
		throw new Error("<FormatSize>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get viewBox() {
		throw new Error("<FormatSize>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set viewBox(value) {
		throw new Error("<FormatSize>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules/svelte-material-icons/FormatClear.svelte generated by Svelte v3.21.0 */

const file$G = "node_modules/svelte-material-icons/FormatClear.svelte";

function create_fragment$H(ctx) {
	let svg;
	let path;

	const block = {
		c: function create() {
			svg = svg_element("svg");
			path = svg_element("path");
			attr_dev(path, "d", "M6,5V5.18L8.82,8H11.22L10.5,9.68L12.6,11.78L14.21,8H20V5H6M3.27,5L2,6.27L8.97,13.24L6.5,19H9.5L11.07,15.34L16.73,21L18,19.73L3.55,5.27L3.27,5Z");
			attr_dev(path, "fill", /*color*/ ctx[2]);
			add_location(path, file$G, 8, 59, 234);
			attr_dev(svg, "width", /*width*/ ctx[0]);
			attr_dev(svg, "height", /*height*/ ctx[1]);
			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			add_location(svg, file$G, 8, 0, 175);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, svg, anchor);
			append_dev(svg, path);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*color*/ 4) {
				attr_dev(path, "fill", /*color*/ ctx[2]);
			}

			if (dirty & /*width*/ 1) {
				attr_dev(svg, "width", /*width*/ ctx[0]);
			}

			if (dirty & /*height*/ 2) {
				attr_dev(svg, "height", /*height*/ ctx[1]);
			}

			if (dirty & /*viewBox*/ 8) {
				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(svg);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$H.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$H($$self, $$props, $$invalidate) {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	const writable_props = ["size", "width", "height", "color", "viewBox"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<FormatClear> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("FormatClear", $$slots, []);

	$$self.$set = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

	$$self.$inject_state = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [width, height, color, viewBox, size];
}

class FormatClear extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$H, create_fragment$H, safe_not_equal, {
			size: 4,
			width: 0,
			height: 1,
			color: 2,
			viewBox: 3
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "FormatClear",
			options,
			id: create_fragment$H.name
		});
	}

	get size() {
		throw new Error("<FormatClear>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set size(value) {
		throw new Error("<FormatClear>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get width() {
		throw new Error("<FormatClear>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set width(value) {
		throw new Error("<FormatClear>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get height() {
		throw new Error("<FormatClear>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set height(value) {
		throw new Error("<FormatClear>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get color() {
		throw new Error("<FormatClear>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set color(value) {
		throw new Error("<FormatClear>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get viewBox() {
		throw new Error("<FormatClear>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set viewBox(value) {
		throw new Error("<FormatClear>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src/comp/Editor/FontSize.svelte generated by Svelte v3.21.0 */
const file$H = "src/comp/Editor/FontSize.svelte";

// (10:2) <x-command slot="activator" class="multiple" data-tooltip={tooltip}>
function create_activator_slot$1(ctx) {
	let x_command;
	let current;
	const size = new FormatSize({ $$inline: true });

	const block = {
		c: function create() {
			x_command = element("x-command");
			create_component(size.$$.fragment);
			set_custom_element_data(x_command, "slot", "activator");
			set_custom_element_data(x_command, "class", "multiple");
			set_custom_element_data(x_command, "data-tooltip", /*tooltip*/ ctx[0]);
			add_location(x_command, file$H, 9, 2, 238);
		},
		m: function mount(target, anchor) {
			insert_dev(target, x_command, anchor);
			mount_component(size, x_command, null);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (!current || dirty & /*tooltip*/ 1) {
				set_custom_element_data(x_command, "data-tooltip", /*tooltip*/ ctx[0]);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(size.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(size.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(x_command);
			destroy_component(size);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_activator_slot$1.name,
		type: "slot",
		source: "(10:2) <x-command slot=\\\"activator\\\" class=\\\"multiple\\\" data-tooltip={tooltip}>",
		ctx
	});

	return block;
}

// (14:2) <Menuitem     on:click={() => document.execCommand("fontSize", null, "1")}     style="font-size: 0.75em; height: 2.75em;"   >
function create_default_slot_4(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("Pequeño");
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_4.name,
		type: "slot",
		source: "(14:2) <Menuitem     on:click={() => document.execCommand(\\\"fontSize\\\", null, \\\"1\\\")}     style=\\\"font-size: 0.75em; height: 2.75em;\\\"   >",
		ctx
	});

	return block;
}

// (19:2) <Menuitem     on:click={() => document.execCommand("fontSize", null, "3")}   >
function create_default_slot_3(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("Normal");
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_3.name,
		type: "slot",
		source: "(19:2) <Menuitem     on:click={() => document.execCommand(\\\"fontSize\\\", null, \\\"3\\\")}   >",
		ctx
	});

	return block;
}

// (23:2) <Menuitem     style="font-size: 1.5em; height: 2em;"     on:click={() => document.execCommand("fontSize", null, "5")}   >
function create_default_slot_2$2(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("Grande");
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_2$2.name,
		type: "slot",
		source: "(23:2) <Menuitem     style=\\\"font-size: 1.5em; height: 2em;\\\"     on:click={() => document.execCommand(\\\"fontSize\\\", null, \\\"5\\\")}   >",
		ctx
	});

	return block;
}

// (28:2) <Menuitem      style="font-size: 2em; height: 1.5em;"     on:click={() => document.execCommand("fontSize", null, "7")}   >
function create_default_slot_1$2(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("Gigante");
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_1$2.name,
		type: "slot",
		source: "(28:2) <Menuitem      style=\\\"font-size: 2em; height: 1.5em;\\\"     on:click={() => document.execCommand(\\\"fontSize\\\", null, \\\"7\\\")}   >",
		ctx
	});

	return block;
}

// (9:0) <Menu origin="bottom left" dx={0} dy={25}>
function create_default_slot$4(ctx) {
	let t0;
	let t1;
	let t2;
	let t3;
	let current;

	const menuitem0 = new Nn({
			props: {
				style: "font-size: 0.75em; height: 2.75em;",
				$$slots: { default: [create_default_slot_4] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	menuitem0.$on("click", /*click_handler*/ ctx[1]);

	const menuitem1 = new Nn({
			props: {
				$$slots: { default: [create_default_slot_3] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	menuitem1.$on("click", /*click_handler_1*/ ctx[2]);

	const menuitem2 = new Nn({
			props: {
				style: "font-size: 1.5em; height: 2em;",
				$$slots: { default: [create_default_slot_2$2] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	menuitem2.$on("click", /*click_handler_2*/ ctx[3]);

	const menuitem3 = new Nn({
			props: {
				style: "font-size: 2em; height: 1.5em;",
				$$slots: { default: [create_default_slot_1$2] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	menuitem3.$on("click", /*click_handler_3*/ ctx[4]);

	const block = {
		c: function create() {
			t0 = space();
			create_component(menuitem0.$$.fragment);
			t1 = space();
			create_component(menuitem1.$$.fragment);
			t2 = space();
			create_component(menuitem2.$$.fragment);
			t3 = space();
			create_component(menuitem3.$$.fragment);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t0, anchor);
			mount_component(menuitem0, target, anchor);
			insert_dev(target, t1, anchor);
			mount_component(menuitem1, target, anchor);
			insert_dev(target, t2, anchor);
			mount_component(menuitem2, target, anchor);
			insert_dev(target, t3, anchor);
			mount_component(menuitem3, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const menuitem0_changes = {};

			if (dirty & /*$$scope*/ 32) {
				menuitem0_changes.$$scope = { dirty, ctx };
			}

			menuitem0.$set(menuitem0_changes);
			const menuitem1_changes = {};

			if (dirty & /*$$scope*/ 32) {
				menuitem1_changes.$$scope = { dirty, ctx };
			}

			menuitem1.$set(menuitem1_changes);
			const menuitem2_changes = {};

			if (dirty & /*$$scope*/ 32) {
				menuitem2_changes.$$scope = { dirty, ctx };
			}

			menuitem2.$set(menuitem2_changes);
			const menuitem3_changes = {};

			if (dirty & /*$$scope*/ 32) {
				menuitem3_changes.$$scope = { dirty, ctx };
			}

			menuitem3.$set(menuitem3_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(menuitem0.$$.fragment, local);
			transition_in(menuitem1.$$.fragment, local);
			transition_in(menuitem2.$$.fragment, local);
			transition_in(menuitem3.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(menuitem0.$$.fragment, local);
			transition_out(menuitem1.$$.fragment, local);
			transition_out(menuitem2.$$.fragment, local);
			transition_out(menuitem3.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t0);
			destroy_component(menuitem0, detaching);
			if (detaching) detach_dev(t1);
			destroy_component(menuitem1, detaching);
			if (detaching) detach_dev(t2);
			destroy_component(menuitem2, detaching);
			if (detaching) detach_dev(t3);
			destroy_component(menuitem3, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$4.name,
		type: "slot",
		source: "(9:0) <Menu origin=\\\"bottom left\\\" dx={0} dy={25}>",
		ctx
	});

	return block;
}

function create_fragment$I(ctx) {
	let current;

	const menu = new Menu$1({
			props: {
				origin: "bottom left",
				dx: 0,
				dy: 25,
				$$slots: {
					default: [create_default_slot$4],
					activator: [create_activator_slot$1]
				},
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(menu.$$.fragment);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			mount_component(menu, target, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const menu_changes = {};

			if (dirty & /*$$scope, tooltip*/ 33) {
				menu_changes.$$scope = { dirty, ctx };
			}

			menu.$set(menu_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(menu.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(menu.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(menu, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$I.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$I($$self, $$props, $$invalidate) {
	let { tooltip } = $$props;
	const writable_props = ["tooltip"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<FontSize> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("FontSize", $$slots, []);
	const click_handler = () => document.execCommand("fontSize", null, "1");
	const click_handler_1 = () => document.execCommand("fontSize", null, "3");
	const click_handler_2 = () => document.execCommand("fontSize", null, "5");
	const click_handler_3 = () => document.execCommand("fontSize", null, "7");

	$$self.$set = $$props => {
		if ("tooltip" in $$props) $$invalidate(0, tooltip = $$props.tooltip);
	};

	$$self.$capture_state = () => ({ Size: FormatSize, Menu: Menu$1, Menuitem: Nn, tooltip });

	$$self.$inject_state = $$props => {
		if ("tooltip" in $$props) $$invalidate(0, tooltip = $$props.tooltip);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [tooltip, click_handler, click_handler_1, click_handler_2, click_handler_3];
}

class FontSize extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$I, create_fragment$I, safe_not_equal, { tooltip: 0 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "FontSize",
			options,
			id: create_fragment$I.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*tooltip*/ ctx[0] === undefined && !("tooltip" in props)) {
			console.warn("<FontSize> was created without expected prop 'tooltip'");
		}
	}

	get tooltip() {
		throw new Error("<FontSize>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set tooltip(value) {
		throw new Error("<FontSize>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules/svelte-material-icons/FormatFont.svelte generated by Svelte v3.21.0 */

const file$I = "node_modules/svelte-material-icons/FormatFont.svelte";

function create_fragment$J(ctx) {
	let svg;
	let path;

	const block = {
		c: function create() {
			svg = svg_element("svg");
			path = svg_element("path");
			attr_dev(path, "d", "M17,8H20V20H21V21H17V20H18V17H14L12.5,20H14V21H10V20H11L17,8M18,9L14.5,16H18V9M5,3H10C11.11,3 12,3.89 12,5V16H9V11H6V16H3V5C3,3.89 3.89,3 5,3M6,5V9H9V5H6Z");
			attr_dev(path, "fill", /*color*/ ctx[2]);
			add_location(path, file$I, 8, 59, 234);
			attr_dev(svg, "width", /*width*/ ctx[0]);
			attr_dev(svg, "height", /*height*/ ctx[1]);
			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			add_location(svg, file$I, 8, 0, 175);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, svg, anchor);
			append_dev(svg, path);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*color*/ 4) {
				attr_dev(path, "fill", /*color*/ ctx[2]);
			}

			if (dirty & /*width*/ 1) {
				attr_dev(svg, "width", /*width*/ ctx[0]);
			}

			if (dirty & /*height*/ 2) {
				attr_dev(svg, "height", /*height*/ ctx[1]);
			}

			if (dirty & /*viewBox*/ 8) {
				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(svg);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$J.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$J($$self, $$props, $$invalidate) {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	const writable_props = ["size", "width", "height", "color", "viewBox"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<FormatFont> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("FormatFont", $$slots, []);

	$$self.$set = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

	$$self.$inject_state = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [width, height, color, viewBox, size];
}

class FormatFont extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$J, create_fragment$J, safe_not_equal, {
			size: 4,
			width: 0,
			height: 1,
			color: 2,
			viewBox: 3
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "FormatFont",
			options,
			id: create_fragment$J.name
		});
	}

	get size() {
		throw new Error("<FormatFont>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set size(value) {
		throw new Error("<FormatFont>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get width() {
		throw new Error("<FormatFont>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set width(value) {
		throw new Error("<FormatFont>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get height() {
		throw new Error("<FormatFont>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set height(value) {
		throw new Error("<FormatFont>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get color() {
		throw new Error("<FormatFont>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set color(value) {
		throw new Error("<FormatFont>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get viewBox() {
		throw new Error("<FormatFont>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set viewBox(value) {
		throw new Error("<FormatFont>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src/comp/Editor/FontFamily.svelte generated by Svelte v3.21.0 */
const file$J = "src/comp/Editor/FontFamily.svelte";

// (14:2) <x-command slot="activator" class="multiple" data-tooltip={tooltip}>
function create_activator_slot$2(ctx) {
	let x_command;
	let current;
	const fontfamily = new FormatFont({ $$inline: true });

	const block = {
		c: function create() {
			x_command = element("x-command");
			create_component(fontfamily.$$.fragment);
			set_custom_element_data(x_command, "slot", "activator");
			set_custom_element_data(x_command, "class", "multiple");
			set_custom_element_data(x_command, "data-tooltip", /*tooltip*/ ctx[0]);
			add_location(x_command, file$J, 13, 2, 321);
		},
		m: function mount(target, anchor) {
			insert_dev(target, x_command, anchor);
			mount_component(fontfamily, x_command, null);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (!current || dirty & /*tooltip*/ 1) {
				set_custom_element_data(x_command, "data-tooltip", /*tooltip*/ ctx[0]);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(fontfamily.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(fontfamily.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(x_command);
			destroy_component(fontfamily);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_activator_slot$2.name,
		type: "slot",
		source: "(14:2) <x-command slot=\\\"activator\\\" class=\\\"multiple\\\" data-tooltip={tooltip}>",
		ctx
	});

	return block;
}

// (18:2) <Menuitem     style="font-family: sans-serif;"     on:click={() => cmd("fontName", "sans-serif")}   >
function create_default_slot_3$1(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("Sans Serif");
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_3$1.name,
		type: "slot",
		source: "(18:2) <Menuitem     style=\\\"font-family: sans-serif;\\\"     on:click={() => cmd(\\\"fontName\\\", \\\"sans-serif\\\")}   >",
		ctx
	});

	return block;
}

// (23:2) <Menuitem     style="font-family: serif;"     on:click={() => cmd("fontName", "serif")}   >
function create_default_slot_2$3(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("Serif");
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_2$3.name,
		type: "slot",
		source: "(23:2) <Menuitem     style=\\\"font-family: serif;\\\"     on:click={() => cmd(\\\"fontName\\\", \\\"serif\\\")}   >",
		ctx
	});

	return block;
}

// (28:2) <Menuitem     style="font-family: monospace;"     on:click={() => cmd("fontName", "monospace")}   >
function create_default_slot_1$3(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("Monospace");
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_1$3.name,
		type: "slot",
		source: "(28:2) <Menuitem     style=\\\"font-family: monospace;\\\"     on:click={() => cmd(\\\"fontName\\\", \\\"monospace\\\")}   >",
		ctx
	});

	return block;
}

// (13:0) <Menu origin="bottom left" dx={0} dy={25}>
function create_default_slot$5(ctx) {
	let t0;
	let t1;
	let t2;
	let current;

	const menuitem0 = new Nn({
			props: {
				style: "font-family: sans-serif;",
				$$slots: { default: [create_default_slot_3$1] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	menuitem0.$on("click", /*click_handler*/ ctx[2]);

	const menuitem1 = new Nn({
			props: {
				style: "font-family: serif;",
				$$slots: { default: [create_default_slot_2$3] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	menuitem1.$on("click", /*click_handler_1*/ ctx[3]);

	const menuitem2 = new Nn({
			props: {
				style: "font-family: monospace;",
				$$slots: { default: [create_default_slot_1$3] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	menuitem2.$on("click", /*click_handler_2*/ ctx[4]);

	const block = {
		c: function create() {
			t0 = space();
			create_component(menuitem0.$$.fragment);
			t1 = space();
			create_component(menuitem1.$$.fragment);
			t2 = space();
			create_component(menuitem2.$$.fragment);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t0, anchor);
			mount_component(menuitem0, target, anchor);
			insert_dev(target, t1, anchor);
			mount_component(menuitem1, target, anchor);
			insert_dev(target, t2, anchor);
			mount_component(menuitem2, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const menuitem0_changes = {};

			if (dirty & /*$$scope*/ 32) {
				menuitem0_changes.$$scope = { dirty, ctx };
			}

			menuitem0.$set(menuitem0_changes);
			const menuitem1_changes = {};

			if (dirty & /*$$scope*/ 32) {
				menuitem1_changes.$$scope = { dirty, ctx };
			}

			menuitem1.$set(menuitem1_changes);
			const menuitem2_changes = {};

			if (dirty & /*$$scope*/ 32) {
				menuitem2_changes.$$scope = { dirty, ctx };
			}

			menuitem2.$set(menuitem2_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(menuitem0.$$.fragment, local);
			transition_in(menuitem1.$$.fragment, local);
			transition_in(menuitem2.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(menuitem0.$$.fragment, local);
			transition_out(menuitem1.$$.fragment, local);
			transition_out(menuitem2.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t0);
			destroy_component(menuitem0, detaching);
			if (detaching) detach_dev(t1);
			destroy_component(menuitem1, detaching);
			if (detaching) detach_dev(t2);
			destroy_component(menuitem2, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$5.name,
		type: "slot",
		source: "(13:0) <Menu origin=\\\"bottom left\\\" dx={0} dy={25}>",
		ctx
	});

	return block;
}

function create_fragment$K(ctx) {
	let current;

	const menu = new Menu$1({
			props: {
				origin: "bottom left",
				dx: 0,
				dy: 25,
				$$slots: {
					default: [create_default_slot$5],
					activator: [create_activator_slot$2]
				},
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(menu.$$.fragment);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			mount_component(menu, target, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const menu_changes = {};

			if (dirty & /*$$scope, tooltip*/ 33) {
				menu_changes.$$scope = { dirty, ctx };
			}

			menu.$set(menu_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(menu.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(menu.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(menu, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$K.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$K($$self, $$props, $$invalidate) {
	const { cmd } = getContext("editor");
	let { tooltip } = $$props;
	const writable_props = ["tooltip"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<FontFamily> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("FontFamily", $$slots, []);
	const click_handler = () => cmd("fontName", "sans-serif");
	const click_handler_1 = () => cmd("fontName", "serif");
	const click_handler_2 = () => cmd("fontName", "monospace");

	$$self.$set = $$props => {
		if ("tooltip" in $$props) $$invalidate(0, tooltip = $$props.tooltip);
	};

	$$self.$capture_state = () => ({
		getContext,
		cmd,
		FontFamily: FormatFont,
		Menu: Menu$1,
		Menuitem: Nn,
		tooltip
	});

	$$self.$inject_state = $$props => {
		if ("tooltip" in $$props) $$invalidate(0, tooltip = $$props.tooltip);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [tooltip, cmd, click_handler, click_handler_1, click_handler_2];
}

class FontFamily_1 extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$K, create_fragment$K, safe_not_equal, { tooltip: 0 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "FontFamily_1",
			options,
			id: create_fragment$K.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*tooltip*/ ctx[0] === undefined && !("tooltip" in props)) {
			console.warn("<FontFamily> was created without expected prop 'tooltip'");
		}
	}

	get tooltip() {
		throw new Error("<FontFamily>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set tooltip(value) {
		throw new Error("<FontFamily>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules/svelte-material-icons/FormatColorFill.svelte generated by Svelte v3.21.0 */

const file$K = "node_modules/svelte-material-icons/FormatColorFill.svelte";

function create_fragment$L(ctx) {
	let svg;
	let path;

	const block = {
		c: function create() {
			svg = svg_element("svg");
			path = svg_element("path");
			attr_dev(path, "d", "M19,11.5C19,11.5 17,13.67 17,15A2,2 0 0,0 19,17A2,2 0 0,0 21,15C21,13.67 19,11.5 19,11.5M5.21,10L10,5.21L14.79,10M16.56,8.94L7.62,0L6.21,1.41L8.59,3.79L3.44,8.94C2.85,9.5 2.85,10.47 3.44,11.06L8.94,16.56C9.23,16.85 9.62,17 10,17C10.38,17 10.77,16.85 11.06,16.56L16.56,11.06C17.15,10.47 17.15,9.5 16.56,8.94Z");
			attr_dev(path, "fill", /*color*/ ctx[2]);
			add_location(path, file$K, 8, 59, 234);
			attr_dev(svg, "width", /*width*/ ctx[0]);
			attr_dev(svg, "height", /*height*/ ctx[1]);
			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			add_location(svg, file$K, 8, 0, 175);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, svg, anchor);
			append_dev(svg, path);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*color*/ 4) {
				attr_dev(path, "fill", /*color*/ ctx[2]);
			}

			if (dirty & /*width*/ 1) {
				attr_dev(svg, "width", /*width*/ ctx[0]);
			}

			if (dirty & /*height*/ 2) {
				attr_dev(svg, "height", /*height*/ ctx[1]);
			}

			if (dirty & /*viewBox*/ 8) {
				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(svg);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$L.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$L($$self, $$props, $$invalidate) {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	const writable_props = ["size", "width", "height", "color", "viewBox"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<FormatColorFill> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("FormatColorFill", $$slots, []);

	$$self.$set = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

	$$self.$inject_state = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [width, height, color, viewBox, size];
}

class FormatColorFill extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$L, create_fragment$L, safe_not_equal, {
			size: 4,
			width: 0,
			height: 1,
			color: 2,
			viewBox: 3
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "FormatColorFill",
			options,
			id: create_fragment$L.name
		});
	}

	get size() {
		throw new Error("<FormatColorFill>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set size(value) {
		throw new Error("<FormatColorFill>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get width() {
		throw new Error("<FormatColorFill>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set width(value) {
		throw new Error("<FormatColorFill>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get height() {
		throw new Error("<FormatColorFill>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set height(value) {
		throw new Error("<FormatColorFill>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get color() {
		throw new Error("<FormatColorFill>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set color(value) {
		throw new Error("<FormatColorFill>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get viewBox() {
		throw new Error("<FormatColorFill>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set viewBox(value) {
		throw new Error("<FormatColorFill>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

var red = {"50":"#ffebee","100":"#ffcdd2","200":"#ef9a9a","300":"#e57373","400":"#ef5350","500":"#f44336","600":"#e53935","700":"#d32f2f","800":"#c62828","900":"#b71c1c","a100":"#ff8a80","a200":"#ff5252","a400":"#ff1744","a700":"#d50000"};
var purple = {"50":"#f3e5f5","100":"#e1bee7","200":"#ce93d8","300":"#ba68c8","400":"#ab47bc","500":"#9c27b0","600":"#8e24aa","700":"#7b1fa2","800":"#6a1b9a","900":"#4a148c","a100":"#ea80fc","a200":"#e040fb","a400":"#d500f9","a700":"#aa00ff"};
var deepPurple = {"50":"#ede7f6","100":"#d1c4e9","200":"#b39ddb","300":"#9575cd","400":"#7e57c2","500":"#673ab7","600":"#5e35b1","700":"#512da8","800":"#4527a0","900":"#311b92","a100":"#b388ff","a200":"#7c4dff","a400":"#651fff","a700":"#6200ea"};
var blue = {"50":"#e3f2fd","100":"#bbdefb","200":"#90caf9","300":"#64b5f6","400":"#42a5f5","500":"#2196f3","600":"#1e88e5","700":"#1976d2","800":"#1565c0","900":"#0d47a1","a100":"#82b1ff","a200":"#448aff","a400":"#2979ff","a700":"#2962ff"};
var cyan = {"50":"#e0f7fa","100":"#b2ebf2","200":"#80deea","300":"#4dd0e1","400":"#26c6da","500":"#00bcd4","600":"#00acc1","700":"#0097a7","800":"#00838f","900":"#006064","a100":"#84ffff","a200":"#18ffff","a400":"#00e5ff","a700":"#00b8d4"};
var green = {"50":"#e8f5e9","100":"#c8e6c9","200":"#a5d6a7","300":"#81c784","400":"#66bb6a","500":"#4caf50","600":"#43a047","700":"#388e3c","800":"#2e7d32","900":"#1b5e20","a100":"#b9f6ca","a200":"#69f0ae","a400":"#00e676","a700":"#00c853"};
var yellow = {"50":"#fffde7","100":"#fff9c4","200":"#fff59d","300":"#fff176","400":"#ffee58","500":"#ffeb3b","600":"#fdd835","700":"#fbc02d","800":"#f9a825","900":"#f57f17","a100":"#ffff8d","a200":"#ffff00","a400":"#ffea00","a700":"#ffd600"};
var orange = {"50":"#fff3e0","100":"#ffe0b2","200":"#ffcc80","300":"#ffb74d","400":"#ffa726","500":"#ff9800","600":"#fb8c00","700":"#f57c00","800":"#ef6c00","900":"#e65100","a100":"#ffd180","a200":"#ffab40","a400":"#ff9100","a700":"#ff6d00"};
var grey = {"50":"#fafafa","100":"#f5f5f5","200":"#eeeeee","300":"#e0e0e0","400":"#bdbdbd","500":"#9e9e9e","600":"#757575","700":"#616161","800":"#424242","900":"#212121"};
var white = "#ffffff";
var black = "#000000";

/* src/comp/Editor/ColorCell.svelte generated by Svelte v3.21.0 */
const file$L = "src/comp/Editor/ColorCell.svelte";

function create_fragment$M(ctx) {
	let x_color_cell;
	let dispose;

	const block = {
		c: function create() {
			x_color_cell = element("x-color-cell");
			set_style(x_color_cell, "background-color", /*color*/ ctx[1]);
			set_custom_element_data(x_color_cell, "class", "svelte-1dys0jt");
			add_location(x_color_cell, file$L, 18, 0, 282);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor, remount) {
			insert_dev(target, x_color_cell, anchor);
			if (remount) dispose();
			dispose = listen_dev(x_color_cell, "click", /*click_handler*/ ctx[3], false, false, false);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*color*/ 2) {
				set_style(x_color_cell, "background-color", /*color*/ ctx[1]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(x_color_cell);
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$M.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$M($$self, $$props, $$invalidate) {
	const { cmd } = getContext("editor");
	let { variant } = $$props;
	let { color } = $$props;
	const writable_props = ["variant", "color"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ColorCell> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("ColorCell", $$slots, []);
	const click_handler = () => cmd(variant, color);

	$$self.$set = $$props => {
		if ("variant" in $$props) $$invalidate(0, variant = $$props.variant);
		if ("color" in $$props) $$invalidate(1, color = $$props.color);
	};

	$$self.$capture_state = () => ({ getContext, cmd, variant, color });

	$$self.$inject_state = $$props => {
		if ("variant" in $$props) $$invalidate(0, variant = $$props.variant);
		if ("color" in $$props) $$invalidate(1, color = $$props.color);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [variant, color, cmd, click_handler];
}

class ColorCell extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$M, create_fragment$M, safe_not_equal, { variant: 0, color: 1 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "ColorCell",
			options,
			id: create_fragment$M.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*variant*/ ctx[0] === undefined && !("variant" in props)) {
			console.warn("<ColorCell> was created without expected prop 'variant'");
		}

		if (/*color*/ ctx[1] === undefined && !("color" in props)) {
			console.warn("<ColorCell> was created without expected prop 'color'");
		}
	}

	get variant() {
		throw new Error("<ColorCell>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set variant(value) {
		throw new Error("<ColorCell>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get color() {
		throw new Error("<ColorCell>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set color(value) {
		throw new Error("<ColorCell>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src/comp/Editor/ColorGroup.svelte generated by Svelte v3.21.0 */
const file$M = "src/comp/Editor/ColorGroup.svelte";

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[6] = list[i];
	return child_ctx;
}

function get_each_context$3(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[3] = list[i];
	return child_ctx;
}

// (92:8) {#each row as color}
function create_each_block_1(ctx) {
	let current;

	const cell = new ColorCell({
			props: {
				color: /*color*/ ctx[6],
				variant: /*variant*/ ctx[2]
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(cell.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(cell, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const cell_changes = {};
			if (dirty & /*colors*/ 2) cell_changes.color = /*color*/ ctx[6];
			if (dirty & /*variant*/ 4) cell_changes.variant = /*variant*/ ctx[2];
			cell.$set(cell_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(cell.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(cell.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(cell, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_1.name,
		type: "each",
		source: "(92:8) {#each row as color}",
		ctx
	});

	return block;
}

// (90:4) {#each colors as row}
function create_each_block$3(ctx) {
	let x_row;
	let t;
	let current;
	let each_value_1 = /*row*/ ctx[3];
	validate_each_argument(each_value_1);
	let each_blocks = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	const block = {
		c: function create() {
			x_row = element("x-row");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t = space();
			set_custom_element_data(x_row, "class", "svelte-9tg79y");
			add_location(x_row, file$M, 90, 6, 6187);
		},
		m: function mount(target, anchor) {
			insert_dev(target, x_row, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(x_row, null);
			}

			append_dev(x_row, t);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (dirty & /*colors, variant*/ 6) {
				each_value_1 = /*row*/ ctx[3];
				validate_each_argument(each_value_1);
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1(ctx, each_value_1, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block_1(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(x_row, t);
					}
				}

				group_outros();

				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;

			for (let i = 0; i < each_value_1.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o: function outro(local) {
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(x_row);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$3.name,
		type: "each",
		source: "(90:4) {#each colors as row}",
		ctx
	});

	return block;
}

function create_fragment$N(ctx) {
	let x_color_group;
	let x_title;
	let t0;
	let t1;
	let x_colors;
	let current;
	let each_value = /*colors*/ ctx[1];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	const block = {
		c: function create() {
			x_color_group = element("x-color-group");
			x_title = element("x-title");
			t0 = text(/*label*/ ctx[0]);
			t1 = space();
			x_colors = element("x-colors");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			set_custom_element_data(x_title, "class", "svelte-9tg79y");
			add_location(x_title, file$M, 87, 2, 6115);
			set_custom_element_data(x_colors, "class", "svelte-9tg79y");
			add_location(x_colors, file$M, 88, 2, 6144);
			set_custom_element_data(x_color_group, "class", "svelte-9tg79y");
			add_location(x_color_group, file$M, 86, 0, 6097);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, x_color_group, anchor);
			append_dev(x_color_group, x_title);
			append_dev(x_title, t0);
			append_dev(x_color_group, t1);
			append_dev(x_color_group, x_colors);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(x_colors, null);
			}

			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (!current || dirty & /*label*/ 1) set_data_dev(t0, /*label*/ ctx[0]);

			if (dirty & /*colors, variant*/ 6) {
				each_value = /*colors*/ ctx[1];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$3(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block$3(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(x_colors, null);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o: function outro(local) {
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(x_color_group);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$N.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

const defaultColors = (() => {
	return [
		[
			white,
			grey[200],
			grey[300],
			grey[400],
			grey[500],
			grey[600],
			grey[700],
			grey[800],
			black
		],
		...[red, orange, yellow, green, cyan, blue, deepPurple, purple].map(c => {
			return [c[100], c[200], c[300], c[400], c[500], c[600], c[700], c[800], c[900]];
		})
	];
})();

function instance$N($$self, $$props, $$invalidate) {
	let { label } = $$props;
	let { colors = defaultColors } = $$props;
	let { variant } = $$props; //"foreColor" || "backColor"
	const writable_props = ["label", "colors", "variant"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ColorGroup> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("ColorGroup", $$slots, []);

	$$self.$set = $$props => {
		if ("label" in $$props) $$invalidate(0, label = $$props.label);
		if ("colors" in $$props) $$invalidate(1, colors = $$props.colors);
		if ("variant" in $$props) $$invalidate(2, variant = $$props.variant);
	};

	$$self.$capture_state = () => ({
		white,
		black,
		grey,
		red,
		orange,
		yellow,
		green,
		cyan,
		blue,
		deepPurple,
		purple,
		defaultColors,
		Cell: ColorCell,
		label,
		colors,
		variant
	});

	$$self.$inject_state = $$props => {
		if ("label" in $$props) $$invalidate(0, label = $$props.label);
		if ("colors" in $$props) $$invalidate(1, colors = $$props.colors);
		if ("variant" in $$props) $$invalidate(2, variant = $$props.variant);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [label, colors, variant];
}

class ColorGroup extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$N, create_fragment$N, safe_not_equal, { label: 0, colors: 1, variant: 2 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "ColorGroup",
			options,
			id: create_fragment$N.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*label*/ ctx[0] === undefined && !("label" in props)) {
			console.warn("<ColorGroup> was created without expected prop 'label'");
		}

		if (/*variant*/ ctx[2] === undefined && !("variant" in props)) {
			console.warn("<ColorGroup> was created without expected prop 'variant'");
		}
	}

	get label() {
		throw new Error("<ColorGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set label(value) {
		throw new Error("<ColorGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get colors() {
		throw new Error("<ColorGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set colors(value) {
		throw new Error("<ColorGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get variant() {
		throw new Error("<ColorGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set variant(value) {
		throw new Error("<ColorGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src/comp/Editor/Color.svelte generated by Svelte v3.21.0 */
const file$N = "src/comp/Editor/Color.svelte";

// (24:4) <x-command slot="activator" class="multiple" data-tooltip={locale.tooltip}>
function create_activator_slot$3(ctx) {
	let x_command;
	let x_command_data_tooltip_value;
	let current;
	const fill = new FormatColorFill({ $$inline: true });

	const block = {
		c: function create() {
			x_command = element("x-command");
			create_component(fill.$$.fragment);
			set_custom_element_data(x_command, "slot", "activator");
			set_custom_element_data(x_command, "class", "multiple");
			set_custom_element_data(x_command, "data-tooltip", x_command_data_tooltip_value = /*locale*/ ctx[0].tooltip);
			add_location(x_command, file$N, 23, 4, 447);
		},
		m: function mount(target, anchor) {
			insert_dev(target, x_command, anchor);
			mount_component(fill, x_command, null);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (!current || dirty & /*locale*/ 1 && x_command_data_tooltip_value !== (x_command_data_tooltip_value = /*locale*/ ctx[0].tooltip)) {
				set_custom_element_data(x_command, "data-tooltip", x_command_data_tooltip_value);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(fill.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(fill.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(x_command);
			destroy_component(fill);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_activator_slot$3.name,
		type: "slot",
		source: "(24:4) <x-command slot=\\\"activator\\\" class=\\\"multiple\\\" data-tooltip={locale.tooltip}>",
		ctx
	});

	return block;
}

// (29:6) {#if has("foreColor")}
function create_if_block_1$6(ctx) {
	let current;

	const colorgroup = new ColorGroup({
			props: {
				variant: "foreColor",
				label: /*locale*/ ctx[0].foreColor
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(colorgroup.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(colorgroup, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const colorgroup_changes = {};
			if (dirty & /*locale*/ 1) colorgroup_changes.label = /*locale*/ ctx[0].foreColor;
			colorgroup.$set(colorgroup_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(colorgroup.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(colorgroup.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(colorgroup, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$6.name,
		type: "if",
		source: "(29:6) {#if has(\\\"foreColor\\\")}",
		ctx
	});

	return block;
}

// (32:6) {#if has("backColor")}
function create_if_block$9(ctx) {
	let current;

	const colorgroup = new ColorGroup({
			props: {
				variant: "backColor",
				label: /*locale*/ ctx[0].backColor
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(colorgroup.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(colorgroup, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const colorgroup_changes = {};
			if (dirty & /*locale*/ 1) colorgroup_changes.label = /*locale*/ ctx[0].backColor;
			colorgroup.$set(colorgroup_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(colorgroup.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(colorgroup.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(colorgroup, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$9.name,
		type: "if",
		source: "(32:6) {#if has(\\\"backColor\\\")}",
		ctx
	});

	return block;
}

// (23:2) <Menu origin="bottom left" dy={25}>
function create_default_slot$6(ctx) {
	let t0;
	let x_color;
	let show_if_1 = /*has*/ ctx[1]("foreColor");
	let t1;
	let show_if = /*has*/ ctx[1]("backColor");
	let current;
	let if_block0 = show_if_1 && create_if_block_1$6(ctx);
	let if_block1 = show_if && create_if_block$9(ctx);

	const block = {
		c: function create() {
			t0 = space();
			x_color = element("x-color");
			if (if_block0) if_block0.c();
			t1 = space();
			if (if_block1) if_block1.c();
			set_custom_element_data(x_color, "class", "svelte-1d0rqmn");
			add_location(x_color, file$N, 27, 4, 560);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t0, anchor);
			insert_dev(target, x_color, anchor);
			if (if_block0) if_block0.m(x_color, null);
			append_dev(x_color, t1);
			if (if_block1) if_block1.m(x_color, null);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (show_if_1) if_block0.p(ctx, dirty);
			if (show_if) if_block1.p(ctx, dirty);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block0);
			transition_in(if_block1);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block0);
			transition_out(if_block1);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t0);
			if (detaching) detach_dev(x_color);
			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$6.name,
		type: "slot",
		source: "(23:2) <Menu origin=\\\"bottom left\\\" dy={25}>",
		ctx
	});

	return block;
}

function create_fragment$O(ctx) {
	let x_command_group;
	let current;

	const menu = new Menu$1({
			props: {
				origin: "bottom left",
				dy: 25,
				$$slots: {
					default: [create_default_slot$6],
					activator: [create_activator_slot$3]
				},
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			x_command_group = element("x-command-group");
			create_component(menu.$$.fragment);
			add_location(x_command_group, file$N, 21, 0, 387);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, x_command_group, anchor);
			mount_component(menu, x_command_group, null);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const menu_changes = {};

			if (dirty & /*$$scope, locale*/ 9) {
				menu_changes.$$scope = { dirty, ctx };
			}

			menu.$set(menu_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(menu.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(menu.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(x_command_group);
			destroy_component(menu);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$O.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$O($$self, $$props, $$invalidate) {
	const { cmd, has } = getContext("editor");
	let { locale } = $$props;
	const writable_props = ["locale"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Color> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("Color", $$slots, []);

	$$self.$set = $$props => {
		if ("locale" in $$props) $$invalidate(0, locale = $$props.locale);
	};

	$$self.$capture_state = () => ({
		getContext,
		cmd,
		has,
		Fill: FormatColorFill,
		ColorGroup,
		Menu: Menu$1,
		locale
	});

	$$self.$inject_state = $$props => {
		if ("locale" in $$props) $$invalidate(0, locale = $$props.locale);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [locale, has];
}

class Color extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$O, create_fragment$O, safe_not_equal, { locale: 0 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Color",
			options,
			id: create_fragment$O.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*locale*/ ctx[0] === undefined && !("locale" in props)) {
			console.warn("<Color> was created without expected prop 'locale'");
		}
	}

	get locale() {
		throw new Error("<Color>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set locale(value) {
		throw new Error("<Color>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

var bind$1 = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString$3 = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray$2(val) {
  return toString$3.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer$2(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString$3.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString$2(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber$1(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate$2(val) {
  return toString$3.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString$3.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString$3.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction$1(val) {
  return toString$3.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction$1(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray$2(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Function equal to merge with the difference being that no reference
 * to original objects is kept.
 *
 * @see merge
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function deepMerge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = deepMerge(result[key], val);
    } else if (typeof val === 'object') {
      result[key] = deepMerge({}, val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind$1(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

var utils = {
  isArray: isArray$2,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer$2,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString$2,
  isNumber: isNumber$1,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate$2,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction$1,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  deepMerge: deepMerge,
  extend: extend,
  trim: trim
};

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
var buildURL = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

var InterceptorManager_1 = InterceptorManager;

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
var transformData = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};

var isCancel = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

var normalizeHeaderName = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};

/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
var enhanceError = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
var createError = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
var settle = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
var isAbsoluteURL = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
var combineURLs = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
var buildFullPath = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
var parseHeaders = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};

var isURLSameOrigin = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);

var cookies = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);

var xhr = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies$1 = cookies;

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies$1.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = xhr;
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = xhr;
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

var defaults_1 = defaults;

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
var dispatchRequest = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults_1.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
var mergeConfig = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'params', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy'];
  var defaultToConfig2Keys = [
    'baseURL', 'url', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress',
    'maxContentLength', 'validateStatus', 'maxRedirects', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath'
  ];

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, function mergeDeepProperties(prop) {
    if (utils.isObject(config2[prop])) {
      config[prop] = utils.deepMerge(config1[prop], config2[prop]);
    } else if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (utils.isObject(config1[prop])) {
      config[prop] = utils.deepMerge(config1[prop]);
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys);

  var otherKeys = Object
    .keys(config2)
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, function otherKeysDefaultToConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  return config;
};

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager_1(),
    response: new InterceptorManager_1()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

var Axios_1 = Axios;

/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

var Cancel_1 = Cancel;

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel_1(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

var CancelToken_1 = CancelToken;

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
var spread = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios_1(defaultConfig);
  var instance = bind$1(Axios_1.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios_1.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults_1);

// Expose Axios class to allow class inheritance
axios.Axios = Axios_1;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = Cancel_1;
axios.CancelToken = CancelToken_1;
axios.isCancel = isCancel;

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = spread;

var axios_1 = axios;

// Allow use of default import syntax in TypeScript
var _default = axios;
axios_1.default = _default;

var axios$1 = axios_1;

const upload = async (filename, contentType, file, fns = {}) => {
    const e = encodeURIComponent;
    const { start, progress, complete, error } = fns;
    start && start();
    axios$1.post(`/upload?filename=${e(filename)}&contentType=${e(contentType)}`, file, {
        headers: { "content-type": "application/binary" },
        onUploadProgress: progress
    }).then(res => {
        const json = res.data;
        if (json.error) {
            throw new Error(json.error);
        }
        complete && complete(json);
    }).catch(e => {
        window.__error = e;
        console.log(e);
        if (e.response) {
            const res = e.response;
            if (res.headers.contentType === "application/json") {
                error && error(res.data.error);
            }
            else if (res.status === 413) {
                error && error(new Error(`File ${filename} is too big`));
            }
            else {
                error && error(e);
            }
        }
        else {
            error && error(e);
        }
    });
};
const createContext = (init) => {
    const files = writable(init.files.map(f => {
        return writable({
            ...f,
            state: "complete",
            loaded: f.size
        });
    }));
    const loading = writable(false);
    const open = writable(init.open);
    const updateLoading = () => {
        loading.set(files.get().some(f => f.get().state === "uploading"));
    };
    const add = (userFile) => {
        const already = files.get().find(f => f.get().size === userFile.size && f.get().filename === userFile.name);
        if (already) {
            console.warn("trying to re-upload probably same file: " + userFile.name);
            return;
        }
        const $file = {
            size: userFile.size,
            filename: userFile.name,
            contentType: userFile.type || "aplication/octet-stream",
            state: "unstarted",
            loaded: 0
        };
        const file = writable($file);
        files.set([...files.get(), file]);
        file.subscribe(() => files.invalidate());
        upload($file.filename, $file.contentType, userFile, {
            start() {
                file.update(f => ({ ...f, state: "uploading" }));
                loading.set(true);
            },
            progress(e) {
                file.update(f => ({ ...f, loaded: e.loaded }));
            },
            complete(json) {
                file.update(f => ({
                    ...f,
                    state: "complete",
                    id: json.id,
                    loaded: f.size,
                }));
                updateLoading();
            },
            error(e) {
                console.log("[UPLOAD ERROR]");
                console.log(e);
                file.update(f => ({ ...f, state: "error", errorMessage: e.message }));
                getNotifier().add({ variant: "error", text: e.message });
                updateLoading();
            }
        });
    };
    const remove = (file) => {
        files.update(fs => fs.filter(f => f !== file));
        if (files.get().length === 0) {
            open.set(false);
        }
        updateLoading();
    };
    return { files, loading, open, add, remove };
};

/* node_modules/svelte-material-icons/AlertCircle.svelte generated by Svelte v3.21.0 */

const file$O = "node_modules/svelte-material-icons/AlertCircle.svelte";

function create_fragment$P(ctx) {
	let svg;
	let path;

	const block = {
		c: function create() {
			svg = svg_element("svg");
			path = svg_element("path");
			attr_dev(path, "d", "M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z");
			attr_dev(path, "fill", /*color*/ ctx[2]);
			add_location(path, file$O, 8, 59, 234);
			attr_dev(svg, "width", /*width*/ ctx[0]);
			attr_dev(svg, "height", /*height*/ ctx[1]);
			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			add_location(svg, file$O, 8, 0, 175);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, svg, anchor);
			append_dev(svg, path);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*color*/ 4) {
				attr_dev(path, "fill", /*color*/ ctx[2]);
			}

			if (dirty & /*width*/ 1) {
				attr_dev(svg, "width", /*width*/ ctx[0]);
			}

			if (dirty & /*height*/ 2) {
				attr_dev(svg, "height", /*height*/ ctx[1]);
			}

			if (dirty & /*viewBox*/ 8) {
				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(svg);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$P.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$P($$self, $$props, $$invalidate) {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	const writable_props = ["size", "width", "height", "color", "viewBox"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<AlertCircle> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("AlertCircle", $$slots, []);

	$$self.$set = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

	$$self.$inject_state = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [width, height, color, viewBox, size];
}

class AlertCircle extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$P, create_fragment$P, safe_not_equal, {
			size: 4,
			width: 0,
			height: 1,
			color: 2,
			viewBox: 3
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "AlertCircle",
			options,
			id: create_fragment$P.name
		});
	}

	get size() {
		throw new Error("<AlertCircle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set size(value) {
		throw new Error("<AlertCircle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get width() {
		throw new Error("<AlertCircle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set width(value) {
		throw new Error("<AlertCircle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get height() {
		throw new Error("<AlertCircle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set height(value) {
		throw new Error("<AlertCircle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get color() {
		throw new Error("<AlertCircle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set color(value) {
		throw new Error("<AlertCircle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get viewBox() {
		throw new Error("<AlertCircle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set viewBox(value) {
		throw new Error("<AlertCircle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

const legacy = "asc";
const extensions = ["3g2", "3ga", "3gp", "7z", "aa", "aac", "ac", "accdb", "accdt", "ace", "adn", "ai", "aif", "aifc", "aiff", "ait", "amr", "ani", "apk", "app", "applescript", "asax", "asc", "ascx", "asf", "ash", "ashx", "asm", "asmx", "asp", "aspx", "asx", "au", "aup", "avi", "axd", "aze", "bak", "bash", "bat", "bin", "blank", "bmp", "bowerrc", "bpg", "browser", "bz2", "bzempty", "c", "cab", "cad", "caf", "cal", "cd", "cdda", "cer", "cfg", "cfm", "cfml", "cgi", "chm", "class", "cmd", "code-workspace", "codekit", "coffee", "coffeelintignore", "com", "compile", "conf", "config", "cpp", "cptx", "cr2", "crdownload", "crt", "crypt", "cs", "csh", "cson", "csproj", "css", "csv", "cue", "cur", "dart", "dat", "data", "db", "dbf", "deb", "default", "dgn", "dist", "diz", "dll", "dmg", "dng", "doc", "docb", "docm", "docx", "dot", "dotm", "dotx", "download", "dpj", "ds_store", "dsn", "dtd", "dwg", "dxf", "editorconfig", "el", "elf", "eml", "enc", "eot", "eps", "epub", "eslintignore", "exe", "f4v", "fax", "fb2", "fla", "flac", "flv", "fnt", "folder", "fon", "gadget", "gdp", "gem", "gif", "gitattributes", "gitignore", "go", "gpg", "gpl", "gradle", "gz", "h", "handlebars", "hbs", "heic", "hlp", "hs", "hsl", "htm", "html", "ibooks", "icns", "ico", "ics", "idx", "iff", "ifo", "image", "img", "iml", "in", "inc", "indd", "inf", "info", "ini", "inv", "iso", "j2", "jar", "java", "jpe", "jpeg", "jpg", "js", "json", "jsp", "jsx", "key", "kf8", "kmk", "ksh", "kt", "kts", "kup", "less", "lex", "licx", "lisp", "lit", "lnk", "lock", "log", "lua", "m", "m2v", "m3u", "m3u8", "m4", "m4a", "m4r", "m4v", "map", "master", "mc", "md", "mdb", "mdf", "me", "mi", "mid", "midi", "mk", "mkv", "mm", "mng", "mo", "mobi", "mod", "mov", "mp2", "mp3", "mp4", "mpa", "mpd", "mpe", "mpeg", "mpg", "mpga", "mpp", "mpt", "msg", "msi", "msu", "nef", "nes", "nfo", "nix", "npmignore", "ocx", "odb", "ods", "odt", "ogg", "ogv", "ost", "otf", "ott", "ova", "ovf", "p12", "p7b", "pages", "part", "partial", "pcd", "pdb", "pdf", "pem", "pfx", "pgp", "ph", "phar", "php", "pid", "pkg", "pl", "plist", "pm", "png", "po", "pom", "pot", "potx", "pps", "ppsx", "ppt", "pptm", "pptx", "prop", "ps", "ps1", "psd", "psp", "pst", "pub", "py", "pyc", "qt", "ra", "ram", "rar", "raw", "rb", "rdf", "rdl", "reg", "resx", "retry", "rm", "rom", "rpm", "rpt", "rsa", "rss", "rst", "rtf", "ru", "rub", "sass", "scss", "sdf", "sed", "sh", "sit", "sitemap", "skin", "sldm", "sldx", "sln", "sol", "sphinx", "sql", "sqlite", "step", "stl", "svg", "swd", "swf", "swift", "swp", "sys", "tar", "tax", "tcsh", "tex", "tfignore", "tga", "tgz", "tif", "tiff", "tmp", "tmx", "torrent", "tpl", "ts", "tsv", "ttf", "twig", "txt", "udf", "vb", "vbproj", "vbs", "vcd", "vcf", "vcs", "vdi", "vdx", "vmdk", "vob", "vox", "vscodeignore", "vsd", "vss", "vst", "vsx", "vtx", "war", "wav", "wbk", "webinfo", "webm", "webp", "wma", "wmf", "wmv", "woff", "woff2", "wps", "wsf", "xaml", "xcf", "xfl", "xlm", "xls", "xlsm", "xlsx", "xlt", "xltm", "xltx", "xml", "xpi", "xps", "xrb", "xsd", "xsl", "xspf", "xz", "yaml", "yml", "z", "zip", "zsh"];
const url = (filename) => {
    const ext = extname(filename);
    const file = extensions.includes(ext) ? ext : legacy;
    return `/static/file-icons/${file}.svg`;
};
const extname = (filename) => {
    const parts = filename.split(".");
    return parts[parts.length - 1] || "";
};

/* src/comp/Upload/FileItem.svelte generated by Svelte v3.21.0 */

const { Error: Error_1 } = globals;
const file_1 = "src/comp/Upload/FileItem.svelte";

// (132:4) {#if ext}
function create_if_block_3$1(ctx) {
	let x_extension;
	let t;

	const block = {
		c: function create() {
			x_extension = element("x-extension");
			t = text(/*ext*/ ctx[2]);
			set_custom_element_data(x_extension, "class", "svelte-1dbkuyv");
			add_location(x_extension, file_1, 132, 6, 2497);
		},
		m: function mount(target, anchor) {
			insert_dev(target, x_extension, anchor);
			append_dev(x_extension, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*ext*/ 4) set_data_dev(t, /*ext*/ ctx[2]);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(x_extension);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_3$1.name,
		type: "if",
		source: "(132:4) {#if ext}",
		ctx
	});

	return block;
}

// (143:36) 
function create_if_block_2$3(ctx) {
	let x_state;
	let x_state_data_tooltip_value;
	let current;
	const error = new AlertCircle({ $$inline: true });

	const block = {
		c: function create() {
			x_state = element("x-state");
			create_component(error.$$.fragment);
			set_custom_element_data(x_state, "class", "error svelte-1dbkuyv");
			set_custom_element_data(x_state, "data-tooltip", x_state_data_tooltip_value = /*$file*/ ctx[3].errorMessage);
			add_location(x_state, file_1, 143, 4, 2839);
		},
		m: function mount(target, anchor) {
			insert_dev(target, x_state, anchor);
			mount_component(error, x_state, null);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (!current || dirty & /*$file*/ 8 && x_state_data_tooltip_value !== (x_state_data_tooltip_value = /*$file*/ ctx[3].errorMessage)) {
				set_custom_element_data(x_state, "data-tooltip", x_state_data_tooltip_value);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(error.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(error.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(x_state);
			destroy_component(error);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2$3.name,
		type: "if",
		source: "(143:36) ",
		ctx
	});

	return block;
}

// (139:39) 
function create_if_block_1$7(ctx) {
	let x_state;
	let current;
	const success = new CheckCircleOutline({ $$inline: true });

	const block = {
		c: function create() {
			x_state = element("x-state");
			create_component(success.$$.fragment);
			set_custom_element_data(x_state, "class", "complete svelte-1dbkuyv");
			add_location(x_state, file_1, 139, 4, 2738);
		},
		m: function mount(target, anchor) {
			insert_dev(target, x_state, anchor);
			mount_component(success, x_state, null);
			current = true;
		},
		p: noop,
		i: function intro(local) {
			if (current) return;
			transition_in(success.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(success.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(x_state);
			destroy_component(success);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$7.name,
		type: "if",
		source: "(139:39) ",
		ctx
	});

	return block;
}

// (137:2) {#if $file.state === "uploading"}
function create_if_block$a(ctx) {
	let x_progress;

	const block = {
		c: function create() {
			x_progress = element("x-progress");
			set_style(x_progress, "width", /*$file*/ ctx[3].loaded / /*$file*/ ctx[3].size * 100 + "%");
			set_custom_element_data(x_progress, "class", "svelte-1dbkuyv");
			add_location(x_progress, file_1, 137, 4, 2628);
		},
		m: function mount(target, anchor) {
			insert_dev(target, x_progress, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*$file*/ 8) {
				set_style(x_progress, "width", /*$file*/ ctx[3].loaded / /*$file*/ ctx[3].size * 100 + "%");
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(x_progress);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$a.name,
		type: "if",
		source: "(137:2) {#if $file.state === \\\"uploading\\\"}",
		ctx
	});

	return block;
}

function create_fragment$Q(ctx) {
	let x_file;
	let x_icon;
	let img;
	let img_src_value;
	let t0;
	let t1;
	let x_name;
	let t2_value = /*$file*/ ctx[3].filename + "";
	let t2;
	let t3;
	let current_block_type_index;
	let if_block1;
	let t4;
	let x_action;
	let t5;
	let x_file_outro;
	let current;
	let dispose;
	let if_block0 = /*ext*/ ctx[2] && create_if_block_3$1(ctx);
	const if_block_creators = [create_if_block$a, create_if_block_1$7, create_if_block_2$3];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*$file*/ ctx[3].state === "uploading") return 0;
		if (/*$file*/ ctx[3].state === "complete") return 1;
		if (/*$file*/ ctx[3].state === "error") return 2;
		return -1;
	}

	if (~(current_block_type_index = select_block_type(ctx))) {
		if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
	}

	const remove_1 = new Close({ $$inline: true });
	const ripple = new ge({ $$inline: true });

	const block = {
		c: function create() {
			x_file = element("x-file");
			x_icon = element("x-icon");
			img = element("img");
			t0 = space();
			if (if_block0) if_block0.c();
			t1 = space();
			x_name = element("x-name");
			t2 = text(t2_value);
			t3 = space();
			if (if_block1) if_block1.c();
			t4 = space();
			x_action = element("x-action");
			create_component(remove_1.$$.fragment);
			t5 = space();
			create_component(ripple.$$.fragment);
			if (img.src !== (img_src_value = url(/*$file*/ ctx[3].filename))) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", "");
			attr_dev(img, "width", "100%");
			attr_dev(img, "height", "100%");
			add_location(img, file_1, 130, 4, 2411);
			set_custom_element_data(x_icon, "class", "svelte-1dbkuyv");
			add_location(x_icon, file_1, 129, 2, 2398);
			set_custom_element_data(x_name, "class", "svelte-1dbkuyv");
			add_location(x_name, file_1, 135, 2, 2554);
			set_custom_element_data(x_action, "class", "remove btn-dark svelte-1dbkuyv");
			set_custom_element_data(x_action, "data-tooltip", /*removeTooltip*/ ctx[1]);
			add_location(x_action, file_1, 147, 2, 2938);
			set_custom_element_data(x_file, "class", "svelte-1dbkuyv");
			add_location(x_file, file_1, 128, 0, 2355);
		},
		l: function claim(nodes) {
			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor, remount) {
			insert_dev(target, x_file, anchor);
			append_dev(x_file, x_icon);
			append_dev(x_icon, img);
			append_dev(x_icon, t0);
			if (if_block0) if_block0.m(x_icon, null);
			append_dev(x_file, t1);
			append_dev(x_file, x_name);
			append_dev(x_name, t2);
			append_dev(x_file, t3);

			if (~current_block_type_index) {
				if_blocks[current_block_type_index].m(x_file, null);
			}

			append_dev(x_file, t4);
			append_dev(x_file, x_action);
			mount_component(remove_1, x_action, null);
			append_dev(x_action, t5);
			mount_component(ripple, x_action, null);
			current = true;
			if (remount) dispose();
			dispose = listen_dev(x_action, "click", /*click_handler*/ ctx[6], false, false, false);
		},
		p: function update(ctx, [dirty]) {
			if (!current || dirty & /*$file*/ 8 && img.src !== (img_src_value = url(/*$file*/ ctx[3].filename))) {
				attr_dev(img, "src", img_src_value);
			}

			if (/*ext*/ ctx[2]) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_3$1(ctx);
					if_block0.c();
					if_block0.m(x_icon, null);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if ((!current || dirty & /*$file*/ 8) && t2_value !== (t2_value = /*$file*/ ctx[3].filename + "")) set_data_dev(t2, t2_value);
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index === previous_block_index) {
				if (~current_block_type_index) {
					if_blocks[current_block_type_index].p(ctx, dirty);
				}
			} else {
				if (if_block1) {
					group_outros();

					transition_out(if_blocks[previous_block_index], 1, 1, () => {
						if_blocks[previous_block_index] = null;
					});

					check_outros();
				}

				if (~current_block_type_index) {
					if_block1 = if_blocks[current_block_type_index];

					if (!if_block1) {
						if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
						if_block1.c();
					}

					transition_in(if_block1, 1);
					if_block1.m(x_file, t4);
				} else {
					if_block1 = null;
				}
			}

			if (!current || dirty & /*removeTooltip*/ 2) {
				set_custom_element_data(x_action, "data-tooltip", /*removeTooltip*/ ctx[1]);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block1);
			transition_in(remove_1.$$.fragment, local);
			transition_in(ripple.$$.fragment, local);
			if (x_file_outro) x_file_outro.end(1);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block1);
			transition_out(remove_1.$$.fragment, local);
			transition_out(ripple.$$.fragment, local);

			if (local) {
				x_file_outro = create_out_transition(x_file, /*out*/ ctx[5], { duration: 150 });
			}

			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(x_file);
			if (if_block0) if_block0.d();

			if (~current_block_type_index) {
				if_blocks[current_block_type_index].d();
			}

			destroy_component(remove_1);
			destroy_component(ripple);
			if (detaching && x_file_outro) x_file_outro.end();
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$Q.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$Q($$self, $$props, $$invalidate) {
	let $file,
		$$unsubscribe_file = noop,
		$$subscribe_file = () => ($$unsubscribe_file(), $$unsubscribe_file = subscribe(file, $$value => $$invalidate(3, $file = $$value)), file);

	$$self.$$.on_destroy.push(() => $$unsubscribe_file());
	let { file } = $$props;
	validate_store(file, "file");
	$$subscribe_file();
	const { remove } = getContext("upload");

	const out = (node, params) => {
		const h = node.clientHeight;

		return {
			easing: quadOut,
			...params,
			css: (t, u) => {
				return `z-index: 1; margin-top: -${u * h}px; opacity: ${t};`;
			}
		};
	};

	let { removeTooltip } = $$props;
	const writable_props = ["file", "removeTooltip"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<FileItem> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("FileItem", $$slots, []);
	const click_handler = () => remove(file);

	$$self.$set = $$props => {
		if ("file" in $$props) $$subscribe_file($$invalidate(0, file = $$props.file));
		if ("removeTooltip" in $$props) $$invalidate(1, removeTooltip = $$props.removeTooltip);
	};

	$$self.$capture_state = () => ({
		file,
		upload,
		getNotifier,
		slide,
		Error: AlertCircle,
		Success: CheckCircleOutline,
		Remove: Close,
		Ripple: ge,
		url,
		extname,
		getContext,
		remove,
		quadOut,
		out,
		removeTooltip,
		ext,
		$file
	});

	$$self.$inject_state = $$props => {
		if ("file" in $$props) $$subscribe_file($$invalidate(0, file = $$props.file));
		if ("removeTooltip" in $$props) $$invalidate(1, removeTooltip = $$props.removeTooltip);
		if ("ext" in $$props) $$invalidate(2, ext = $$props.ext);
	};

	let ext;

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*$file*/ 8) {
			 $$invalidate(2, ext = extname($file.filename));
		}
	};

	return [file, removeTooltip, ext, $file, remove, out, click_handler];
}

class FileItem extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$Q, create_fragment$Q, safe_not_equal, { file: 0, removeTooltip: 1 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "FileItem",
			options,
			id: create_fragment$Q.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*file*/ ctx[0] === undefined && !("file" in props)) {
			console.warn("<FileItem> was created without expected prop 'file'");
		}

		if (/*removeTooltip*/ ctx[1] === undefined && !("removeTooltip" in props)) {
			console.warn("<FileItem> was created without expected prop 'removeTooltip'");
		}
	}

	get file() {
		throw new Error_1("<FileItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set file(value) {
		throw new Error_1("<FileItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get removeTooltip() {
		throw new Error_1("<FileItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set removeTooltip(value) {
		throw new Error_1("<FileItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src/comp/CircularProgress.svelte generated by Svelte v3.21.0 */

const file$P = "src/comp/CircularProgress.svelte";

function create_fragment$R(ctx) {
	let div;
	let svg;
	let circle;
	let div_class_value;

	const block = {
		c: function create() {
			div = element("div");
			svg = svg_element("svg");
			circle = svg_element("circle");
			attr_dev(circle, "class", "circle indeterminate svelte-qr8o1e");
			attr_dev(circle, "cx", "44");
			attr_dev(circle, "cy", "44");
			attr_dev(circle, "r", "20.2");
			attr_dev(circle, "fill", "none");
			attr_dev(circle, "stroke", "currentColor");
			attr_dev(circle, "stroke-width", "3.6");
			add_location(circle, file$P, 55, 4, 1152);
			attr_dev(svg, "viewBox", "22 22 44 44");
			attr_dev(svg, "height", /*size*/ ctx[3]);
			attr_dev(svg, "width", /*size*/ ctx[3]);
			add_location(svg, file$P, 54, 2, 1093);
			attr_dev(div, "class", div_class_value = "circular-progress " + /*variant*/ ctx[0] + " " + /*className*/ ctx[1] + " svelte-qr8o1e");
			attr_dev(div, "style", /*style*/ ctx[2]);
			add_location(div, file$P, 53, 0, 1029);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, svg);
			append_dev(svg, circle);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*size*/ 8) {
				attr_dev(svg, "height", /*size*/ ctx[3]);
			}

			if (dirty & /*size*/ 8) {
				attr_dev(svg, "width", /*size*/ ctx[3]);
			}

			if (dirty & /*variant, className*/ 3 && div_class_value !== (div_class_value = "circular-progress " + /*variant*/ ctx[0] + " " + /*className*/ ctx[1] + " svelte-qr8o1e")) {
				attr_dev(div, "class", div_class_value);
			}

			if (dirty & /*style*/ 4) {
				attr_dev(div, "style", /*style*/ ctx[2]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$R.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$R($$self, $$props, $$invalidate) {
	let { class: className = "" } = $$props;
	let { style = "" } = $$props;
	let { value = null } = $$props;
	let { variant = "indeterminate" } = $$props; // "static", "determinate"
	let { size = "1em" } = $$props;
	const writable_props = ["class", "style", "value", "variant", "size"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<CircularProgress> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("CircularProgress", $$slots, []);

	$$self.$set = $$props => {
		if ("class" in $$props) $$invalidate(1, className = $$props.class);
		if ("style" in $$props) $$invalidate(2, style = $$props.style);
		if ("value" in $$props) $$invalidate(4, value = $$props.value);
		if ("variant" in $$props) $$invalidate(0, variant = $$props.variant);
		if ("size" in $$props) $$invalidate(3, size = $$props.size);
	};

	$$self.$capture_state = () => ({ className, style, value, variant, size });

	$$self.$inject_state = $$props => {
		if ("className" in $$props) $$invalidate(1, className = $$props.className);
		if ("style" in $$props) $$invalidate(2, style = $$props.style);
		if ("value" in $$props) $$invalidate(4, value = $$props.value);
		if ("variant" in $$props) $$invalidate(0, variant = $$props.variant);
		if ("size" in $$props) $$invalidate(3, size = $$props.size);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*value, variant*/ 17) {
			 if (value != null && variant === "indeterminate") $$invalidate(0, variant = "static");
		}
	};

	return [variant, className, style, size, value];
}

class CircularProgress extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$R, create_fragment$R, safe_not_equal, {
			class: 1,
			style: 2,
			value: 4,
			variant: 0,
			size: 3
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "CircularProgress",
			options,
			id: create_fragment$R.name
		});
	}

	get class() {
		throw new Error("<CircularProgress>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set class(value) {
		throw new Error("<CircularProgress>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get style() {
		throw new Error("<CircularProgress>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set style(value) {
		throw new Error("<CircularProgress>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get value() {
		throw new Error("<CircularProgress>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set value(value) {
		throw new Error("<CircularProgress>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get variant() {
		throw new Error("<CircularProgress>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set variant(value) {
		throw new Error("<CircularProgress>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get size() {
		throw new Error("<CircularProgress>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set size(value) {
		throw new Error("<CircularProgress>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules/svelte-material-icons/Paperclip.svelte generated by Svelte v3.21.0 */

const file$Q = "node_modules/svelte-material-icons/Paperclip.svelte";

function create_fragment$S(ctx) {
	let svg;
	let path;

	const block = {
		c: function create() {
			svg = svg_element("svg");
			path = svg_element("path");
			attr_dev(path, "d", "M16.5,6V17.5A4,4 0 0,1 12.5,21.5A4,4 0 0,1 8.5,17.5V5A2.5,2.5 0 0,1 11,2.5A2.5,2.5 0 0,1 13.5,5V15.5A1,1 0 0,1 12.5,16.5A1,1 0 0,1 11.5,15.5V6H10V15.5A2.5,2.5 0 0,0 12.5,18A2.5,2.5 0 0,0 15,15.5V5A4,4 0 0,0 11,1A4,4 0 0,0 7,5V17.5A5.5,5.5 0 0,0 12.5,23A5.5,5.5 0 0,0 18,17.5V6H16.5Z");
			attr_dev(path, "fill", /*color*/ ctx[2]);
			add_location(path, file$Q, 8, 59, 234);
			attr_dev(svg, "width", /*width*/ ctx[0]);
			attr_dev(svg, "height", /*height*/ ctx[1]);
			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			add_location(svg, file$Q, 8, 0, 175);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, svg, anchor);
			append_dev(svg, path);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*color*/ 4) {
				attr_dev(path, "fill", /*color*/ ctx[2]);
			}

			if (dirty & /*width*/ 1) {
				attr_dev(svg, "width", /*width*/ ctx[0]);
			}

			if (dirty & /*height*/ 2) {
				attr_dev(svg, "height", /*height*/ ctx[1]);
			}

			if (dirty & /*viewBox*/ 8) {
				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(svg);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$S.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$S($$self, $$props, $$invalidate) {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	const writable_props = ["size", "width", "height", "color", "viewBox"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Paperclip> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("Paperclip", $$slots, []);

	$$self.$set = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

	$$self.$inject_state = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [width, height, color, viewBox, size];
}

class Paperclip extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$S, create_fragment$S, safe_not_equal, {
			size: 4,
			width: 0,
			height: 1,
			color: 2,
			viewBox: 3
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Paperclip",
			options,
			id: create_fragment$S.name
		});
	}

	get size() {
		throw new Error("<Paperclip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set size(value) {
		throw new Error("<Paperclip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get width() {
		throw new Error("<Paperclip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set width(value) {
		throw new Error("<Paperclip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get height() {
		throw new Error("<Paperclip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set height(value) {
		throw new Error("<Paperclip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get color() {
		throw new Error("<Paperclip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set color(value) {
		throw new Error("<Paperclip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get viewBox() {
		throw new Error("<Paperclip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set viewBox(value) {
		throw new Error("<Paperclip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src/comp/Upload/Upload.svelte generated by Svelte v3.21.0 */
const file$R = "src/comp/Upload/Upload.svelte";

function get_each_context$4(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[13] = list[i];
	return child_ctx;
}

// (180:4) {#if loading}
function create_if_block_2$4(ctx) {
	let x_loading;
	let current;
	const circularprogress = new CircularProgress({ props: { size: "100%" }, $$inline: true });

	const block = {
		c: function create() {
			x_loading = element("x-loading");
			create_component(circularprogress.$$.fragment);
			set_custom_element_data(x_loading, "class", "svelte-16ltvkg");
			add_location(x_loading, file$R, 180, 6, 3372);
		},
		m: function mount(target, anchor) {
			insert_dev(target, x_loading, anchor);
			mount_component(circularprogress, x_loading, null);
			current = true;
		},
		i: function intro(local) {
			if (current) return;
			transition_in(circularprogress.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(circularprogress.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(x_loading);
			destroy_component(circularprogress);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2$4.name,
		type: "if",
		source: "(180:4) {#if loading}",
		ctx
	});

	return block;
}

// (185:4) {#if $ctxFiles.length}
function create_if_block_1$8(ctx) {
	let x_bubble;
	let t_value = /*$ctxFiles*/ ctx[4].length + "";
	let t;
	let x_bubble_transition;
	let current;

	const block = {
		c: function create() {
			x_bubble = element("x-bubble");
			t = text(t_value);
			set_custom_element_data(x_bubble, "class", "svelte-16ltvkg");
			add_location(x_bubble, file$R, 185, 6, 3486);
		},
		m: function mount(target, anchor) {
			insert_dev(target, x_bubble, anchor);
			append_dev(x_bubble, t);
			current = true;
		},
		p: function update(ctx, dirty) {
			if ((!current || dirty & /*$ctxFiles*/ 16) && t_value !== (t_value = /*$ctxFiles*/ ctx[4].length + "")) set_data_dev(t, t_value);
		},
		i: function intro(local) {
			if (current) return;

			add_render_callback(() => {
				if (!x_bubble_transition) x_bubble_transition = create_bidirectional_transition(x_bubble, scale, { duration: 200 }, true);
				x_bubble_transition.run(1);
			});

			current = true;
		},
		o: function outro(local) {
			if (!x_bubble_transition) x_bubble_transition = create_bidirectional_transition(x_bubble, scale, { duration: 200 }, false);
			x_bubble_transition.run(0);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(x_bubble);
			if (detaching && x_bubble_transition) x_bubble_transition.end();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$8.name,
		type: "if",
		source: "(185:4) {#if $ctxFiles.length}",
		ctx
	});

	return block;
}

// (192:2) {#if open}
function create_if_block$b(ctx) {
	let x_popup;
	let svg;
	let path;
	let t0;
	let x_popup_body;
	let x_scroll;
	let each_blocks = [];
	let each_1_lookup = new Map();
	let t1;
	let x_popup_top;
	let x_label;
	let t2;
	let x_popup_transition;
	let current;
	let each_value = /*$ctxFiles*/ ctx[4];
	validate_each_argument(each_value);
	const get_key = ctx => /*file*/ ctx[13];
	validate_each_keys(ctx, each_value, get_each_context$4, get_key);

	for (let i = 0; i < each_value.length; i += 1) {
		let child_ctx = get_each_context$4(ctx, each_value, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block$4(key, child_ctx));
	}

	const button = new xe({
			props: {
				$$slots: { default: [create_default_slot$7] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	button.$on("click", /*click_handler*/ ctx[12]);

	const block = {
		c: function create() {
			x_popup = element("x-popup");
			svg = svg_element("svg");
			path = svg_element("path");
			t0 = space();
			x_popup_body = element("x-popup-body");
			x_scroll = element("x-scroll");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t1 = space();
			x_popup_top = element("x-popup-top");
			x_label = element("x-label");
			t2 = space();
			create_component(button.$$.fragment);
			attr_dev(path, "d", "M0 0 L24 0 L12 24 L 0 0");
			attr_dev(path, "fill", "#fff");
			add_location(path, file$R, 194, 8, 3756);
			attr_dev(svg, "class", "arrow svelte-16ltvkg");
			attr_dev(svg, "viewBox", "0 0 24 24");
			attr_dev(svg, "preserveAspectRatio", "none");
			add_location(svg, file$R, 193, 6, 3681);
			set_custom_element_data(x_scroll, "class", "svelte-16ltvkg");
			add_location(x_scroll, file$R, 197, 8, 3846);
			set_custom_element_data(x_label, "class", "svelte-16ltvkg");
			add_location(x_label, file$R, 203, 10, 4032);
			set_custom_element_data(x_popup_top, "class", "svelte-16ltvkg");
			add_location(x_popup_top, file$R, 202, 8, 4008);
			set_custom_element_data(x_popup_body, "class", "svelte-16ltvkg");
			add_location(x_popup_body, file$R, 196, 6, 3823);
			set_custom_element_data(x_popup, "class", "svelte-16ltvkg");
			add_location(x_popup, file$R, 192, 4, 3619);
		},
		m: function mount(target, anchor) {
			insert_dev(target, x_popup, anchor);
			append_dev(x_popup, svg);
			append_dev(svg, path);
			append_dev(x_popup, t0);
			append_dev(x_popup, x_popup_body);
			append_dev(x_popup_body, x_scroll);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(x_scroll, null);
			}

			append_dev(x_popup_body, t1);
			append_dev(x_popup_body, x_popup_top);
			append_dev(x_popup_top, x_label);
			append_dev(x_popup_top, t2);
			mount_component(button, x_popup_top, null);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (dirty & /*$ctxFiles, locale*/ 24) {
				const each_value = /*$ctxFiles*/ ctx[4];
				validate_each_argument(each_value);
				group_outros();
				validate_each_keys(ctx, each_value, get_each_context$4, get_key);
				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, x_scroll, outro_and_destroy_block, create_each_block$4, null, get_each_context$4);
				check_outros();
			}

			const button_changes = {};

			if (dirty & /*$$scope, locale*/ 65544) {
				button_changes.$$scope = { dirty, ctx };
			}

			button.$set(button_changes);
		},
		i: function intro(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			transition_in(button.$$.fragment, local);

			add_render_callback(() => {
				if (!x_popup_transition) x_popup_transition = create_bidirectional_transition(x_popup, fly, { x: 0, y: 20, duration: 250 }, true);
				x_popup_transition.run(1);
			});

			current = true;
		},
		o: function outro(local) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			transition_out(button.$$.fragment, local);
			if (!x_popup_transition) x_popup_transition = create_bidirectional_transition(x_popup, fly, { x: 0, y: 20, duration: 250 }, false);
			x_popup_transition.run(0);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(x_popup);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].d();
			}

			destroy_component(button);
			if (detaching && x_popup_transition) x_popup_transition.end();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$b.name,
		type: "if",
		source: "(192:2) {#if open}",
		ctx
	});

	return block;
}

// (199:10) {#each $ctxFiles as file (file)}
function create_each_block$4(key_2, ctx) {
	let first;
	let current;

	const fileitem = new FileItem({
			props: {
				file: /*file*/ ctx[13],
				removeTooltip: /*locale*/ ctx[3].remove
			},
			$$inline: true
		});

	const block = {
		key: key_2,
		first: null,
		c: function create() {
			first = empty();
			create_component(fileitem.$$.fragment);
			this.first = first;
		},
		m: function mount(target, anchor) {
			insert_dev(target, first, anchor);
			mount_component(fileitem, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const fileitem_changes = {};
			if (dirty & /*$ctxFiles*/ 16) fileitem_changes.file = /*file*/ ctx[13];
			if (dirty & /*locale*/ 8) fileitem_changes.removeTooltip = /*locale*/ ctx[3].remove;
			fileitem.$set(fileitem_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(fileitem.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(fileitem.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(first);
			destroy_component(fileitem, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$4.name,
		type: "each",
		source: "(199:10) {#each $ctxFiles as file (file)}",
		ctx
	});

	return block;
}

// (205:10) <Button on:click={() => input.click()}>
function create_default_slot$7(ctx) {
	let t_value = /*locale*/ ctx[3].add + "";
	let t;

	const block = {
		c: function create() {
			t = text(t_value);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*locale*/ 8 && t_value !== (t_value = /*locale*/ ctx[3].add + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$7.name,
		type: "slot",
		source: "(205:10) <Button on:click={() => input.click()}>",
		ctx
	});

	return block;
}

function create_fragment$T(ctx) {
	let x_upload;
	let input_1;
	let t0;
	let x_action;
	let t1;
	let t2;
	let t3;
	let x_action_data_tooltip_value;
	let t4;
	let current;
	let dispose;
	const clip = new Paperclip({ $$inline: true });
	const ripple = new ge({ $$inline: true });
	let if_block0 = /*loading*/ ctx[2] && create_if_block_2$4(ctx);
	let if_block1 = /*$ctxFiles*/ ctx[4].length && create_if_block_1$8(ctx);
	let if_block2 = /*open*/ ctx[1] && create_if_block$b(ctx);

	const block = {
		c: function create() {
			x_upload = element("x-upload");
			input_1 = element("input");
			t0 = space();
			x_action = element("x-action");
			create_component(clip.$$.fragment);
			t1 = space();
			create_component(ripple.$$.fragment);
			t2 = space();
			if (if_block0) if_block0.c();
			t3 = space();
			if (if_block1) if_block1.c();
			t4 = space();
			if (if_block2) if_block2.c();
			attr_dev(input_1, "type", "file");
			attr_dev(input_1, "name", "0-upload");
			attr_dev(input_1, "id", "0-upload");
			input_1.multiple = true;
			attr_dev(input_1, "class", "svelte-16ltvkg");
			add_location(input_1, file$R, 174, 2, 3124);
			set_custom_element_data(x_action, "class", "upload btn-dark svelte-16ltvkg");
			set_custom_element_data(x_action, "data-tooltip", x_action_data_tooltip_value = /*open*/ ctx[1] ? null : /*locale*/ ctx[3].tooltip);
			add_location(x_action, file$R, 176, 2, 3225);
			set_custom_element_data(x_upload, "class", "svelte-16ltvkg");
			add_location(x_upload, file$R, 172, 0, 3108);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor, remount) {
			insert_dev(target, x_upload, anchor);
			append_dev(x_upload, input_1);
			/*input_1_binding*/ ctx[11](input_1);
			append_dev(x_upload, t0);
			append_dev(x_upload, x_action);
			mount_component(clip, x_action, null);
			append_dev(x_action, t1);
			mount_component(ripple, x_action, null);
			append_dev(x_action, t2);
			if (if_block0) if_block0.m(x_action, null);
			append_dev(x_action, t3);
			if (if_block1) if_block1.m(x_action, null);
			append_dev(x_upload, t4);
			if (if_block2) if_block2.m(x_upload, null);
			current = true;
			if (remount) run_all(dispose);

			dispose = [
				listen_dev(input_1, "change", /*change*/ ctx[5], false, false, false),
				listen_dev(x_action, "click", /*click*/ ctx[7], false, false, false)
			];
		},
		p: function update(ctx, [dirty]) {
			if (/*loading*/ ctx[2]) {
				if (if_block0) {
					if (dirty & /*loading*/ 4) {
						transition_in(if_block0, 1);
					}
				} else {
					if_block0 = create_if_block_2$4(ctx);
					if_block0.c();
					transition_in(if_block0, 1);
					if_block0.m(x_action, t3);
				}
			} else if (if_block0) {
				group_outros();

				transition_out(if_block0, 1, 1, () => {
					if_block0 = null;
				});

				check_outros();
			}

			if (/*$ctxFiles*/ ctx[4].length) {
				if (if_block1) {
					if_block1.p(ctx, dirty);

					if (dirty & /*$ctxFiles*/ 16) {
						transition_in(if_block1, 1);
					}
				} else {
					if_block1 = create_if_block_1$8(ctx);
					if_block1.c();
					transition_in(if_block1, 1);
					if_block1.m(x_action, null);
				}
			} else if (if_block1) {
				group_outros();

				transition_out(if_block1, 1, 1, () => {
					if_block1 = null;
				});

				check_outros();
			}

			if (!current || dirty & /*open, locale*/ 10 && x_action_data_tooltip_value !== (x_action_data_tooltip_value = /*open*/ ctx[1] ? null : /*locale*/ ctx[3].tooltip)) {
				set_custom_element_data(x_action, "data-tooltip", x_action_data_tooltip_value);
			}

			if (/*open*/ ctx[1]) {
				if (if_block2) {
					if_block2.p(ctx, dirty);

					if (dirty & /*open*/ 2) {
						transition_in(if_block2, 1);
					}
				} else {
					if_block2 = create_if_block$b(ctx);
					if_block2.c();
					transition_in(if_block2, 1);
					if_block2.m(x_upload, null);
				}
			} else if (if_block2) {
				group_outros();

				transition_out(if_block2, 1, 1, () => {
					if_block2 = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(clip.$$.fragment, local);
			transition_in(ripple.$$.fragment, local);
			transition_in(if_block0);
			transition_in(if_block1);
			transition_in(if_block2);
			current = true;
		},
		o: function outro(local) {
			transition_out(clip.$$.fragment, local);
			transition_out(ripple.$$.fragment, local);
			transition_out(if_block0);
			transition_out(if_block1);
			transition_out(if_block2);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(x_upload);
			/*input_1_binding*/ ctx[11](null);
			destroy_component(clip);
			destroy_component(ripple);
			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
			if (if_block2) if_block2.d();
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$T.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

const contexts = new WeakMap();

function instance$T($$self, $$props, $$invalidate) {
	let $ctxFiles;
	let { files } = $$props;
	let { input } = $$props;
	let { open = false } = $$props;
	let { loading = false } = $$props;

	const change = e => {
		for (const file of input.files) {
			ctx.add(file);
		}

		if (input.files.length) {
			ctx.open.set(true);
		}

		$$invalidate(0, input.value = null, input);
	};

	const { key } = getContext("compose");
	let ctx;

	if (contexts.has(key)) {
		ctx = contexts.get(key);
	} else {
		ctx = createContext({ files, open, loading });
		contexts.set(key, ctx);
	}

	ctx.open.subscribe(v => $$invalidate(1, open = v));
	ctx.loading.subscribe(v => $$invalidate(2, loading = v));

	ctx.files.subscribe(fs => {
		$$invalidate(8, files = fs.map(f => {
			const { filename, id, contentType, size } = f.get();
			return { filename, id, contentType, size };
		}));
	});

	let ctxFiles = ctx.files;
	validate_store(ctxFiles, "ctxFiles");
	component_subscribe($$self, ctxFiles, value => $$invalidate(4, $ctxFiles = value));
	setContext("upload", ctx);

	const click = e => {
		if (files.length === 0) {
			input.click();
		} else {
			ctx.open.update(o => !o);
		}
	};

	let { locale } = $$props;
	const writable_props = ["files", "input", "open", "loading", "locale"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Upload> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("Upload", $$slots, []);

	function input_1_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			$$invalidate(0, input = $$value);
		});
	}

	const click_handler = () => input.click();

	$$self.$set = $$props => {
		if ("files" in $$props) $$invalidate(8, files = $$props.files);
		if ("input" in $$props) $$invalidate(0, input = $$props.input);
		if ("open" in $$props) $$invalidate(1, open = $$props.open);
		if ("loading" in $$props) $$invalidate(2, loading = $$props.loading);
		if ("locale" in $$props) $$invalidate(3, locale = $$props.locale);
	};

	$$self.$capture_state = () => ({
		contexts,
		files,
		input,
		open,
		loading,
		setContext,
		getContext,
		fly,
		scale,
		FileItem,
		CircularProgress,
		Clip: Paperclip,
		Button: xe,
		Ripple: ge,
		createContext,
		change,
		key,
		ctx,
		ctxFiles,
		click,
		locale,
		$ctxFiles
	});

	$$self.$inject_state = $$props => {
		if ("files" in $$props) $$invalidate(8, files = $$props.files);
		if ("input" in $$props) $$invalidate(0, input = $$props.input);
		if ("open" in $$props) $$invalidate(1, open = $$props.open);
		if ("loading" in $$props) $$invalidate(2, loading = $$props.loading);
		if ("ctx" in $$props) ctx = $$props.ctx;
		if ("ctxFiles" in $$props) $$invalidate(6, ctxFiles = $$props.ctxFiles);
		if ("locale" in $$props) $$invalidate(3, locale = $$props.locale);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		input,
		open,
		loading,
		locale,
		$ctxFiles,
		change,
		ctxFiles,
		click,
		files,
		ctx,
		key,
		input_1_binding,
		click_handler
	];
}

class Upload extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$T, create_fragment$T, safe_not_equal, {
			files: 8,
			input: 0,
			open: 1,
			loading: 2,
			locale: 3
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Upload",
			options,
			id: create_fragment$T.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*files*/ ctx[8] === undefined && !("files" in props)) {
			console.warn("<Upload> was created without expected prop 'files'");
		}

		if (/*input*/ ctx[0] === undefined && !("input" in props)) {
			console.warn("<Upload> was created without expected prop 'input'");
		}

		if (/*locale*/ ctx[3] === undefined && !("locale" in props)) {
			console.warn("<Upload> was created without expected prop 'locale'");
		}
	}

	get files() {
		throw new Error("<Upload>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set files(value) {
		throw new Error("<Upload>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get input() {
		throw new Error("<Upload>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set input(value) {
		throw new Error("<Upload>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get open() {
		throw new Error("<Upload>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set open(value) {
		throw new Error("<Upload>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get loading() {
		throw new Error("<Upload>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set loading(value) {
		throw new Error("<Upload>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get locale() {
		throw new Error("<Upload>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set locale(value) {
		throw new Error("<Upload>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src/comp/ProgressButton.svelte generated by Svelte v3.21.0 */
const file$S = "src/comp/ProgressButton.svelte";

// (45:4) <Button       disabled={inprogress}       {...$$props}       on:click       on:change       on:focus       on:blur     >
function create_default_slot$8(ctx) {
	let span;
	let current;
	const default_slot_template = /*$$slots*/ ctx[4].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], null);

	const block = {
		c: function create() {
			span = element("span");
			if (default_slot) default_slot.c();
			attr_dev(span, "class", "progress-button-in svelte-11fbe15");
			add_location(span, file$S, 52, 6, 865);
		},
		m: function mount(target, anchor) {
			insert_dev(target, span, anchor);

			if (default_slot) {
				default_slot.m(span, null);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (default_slot) {
				if (default_slot.p && dirty & /*$$scope*/ 512) {
					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[9], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, null));
				}
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(span);
			if (default_slot) default_slot.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$8.name,
		type: "slot",
		source: "(45:4) <Button       disabled={inprogress}       {...$$props}       on:click       on:change       on:focus       on:blur     >",
		ctx
	});

	return block;
}

// (59:2) {#if inprogress}
function create_if_block$c(ctx) {
	let div;
	let current;
	const circularprogress_spread_levels = [/*progress*/ ctx[1]];
	let circularprogress_props = {};

	for (let i = 0; i < circularprogress_spread_levels.length; i += 1) {
		circularprogress_props = assign(circularprogress_props, circularprogress_spread_levels[i]);
	}

	const circularprogress = new CircularProgress({
			props: circularprogress_props,
			$$inline: true
		});

	const block = {
		c: function create() {
			div = element("div");
			create_component(circularprogress.$$.fragment);
			attr_dev(div, "class", "progress svelte-11fbe15");
			add_location(div, file$S, 59, 4, 976);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			mount_component(circularprogress, div, null);
			current = true;
		},
		p: function update(ctx, dirty) {
			const circularprogress_changes = (dirty & /*progress*/ 2)
			? get_spread_update(circularprogress_spread_levels, [get_spread_object(/*progress*/ ctx[1])])
			: {};

			circularprogress.$set(circularprogress_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(circularprogress.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(circularprogress.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_component(circularprogress);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$c.name,
		type: "if",
		source: "(59:2) {#if inprogress}",
		ctx
	});

	return block;
}

function create_fragment$U(ctx) {
	let div1;
	let div0;
	let t;
	let current;
	const button_spread_levels = [{ disabled: /*inprogress*/ ctx[0] }, /*$$props*/ ctx[2]];

	let button_props = {
		$$slots: { default: [create_default_slot$8] },
		$$scope: { ctx }
	};

	for (let i = 0; i < button_spread_levels.length; i += 1) {
		button_props = assign(button_props, button_spread_levels[i]);
	}

	const button = new xe({ props: button_props, $$inline: true });
	button.$on("click", /*click_handler*/ ctx[5]);
	button.$on("change", /*change_handler*/ ctx[6]);
	button.$on("focus", /*focus_handler*/ ctx[7]);
	button.$on("blur", /*blur_handler*/ ctx[8]);
	let if_block = /*inprogress*/ ctx[0] && create_if_block$c(ctx);

	const block = {
		c: function create() {
			div1 = element("div");
			div0 = element("div");
			create_component(button.$$.fragment);
			t = space();
			if (if_block) if_block.c();
			attr_dev(div0, "class", "button svelte-11fbe15");
			add_location(div0, file$S, 43, 2, 713);
			attr_dev(div1, "class", "progress-button svelte-11fbe15");
			toggle_class(div1, "inprogress", /*inprogress*/ ctx[0]);
			add_location(div1, file$S, 42, 0, 664);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);
			append_dev(div1, div0);
			mount_component(button, div0, null);
			append_dev(div1, t);
			if (if_block) if_block.m(div1, null);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const button_changes = (dirty & /*inprogress, $$props*/ 5)
			? get_spread_update(button_spread_levels, [
					dirty & /*inprogress*/ 1 && { disabled: /*inprogress*/ ctx[0] },
					dirty & /*$$props*/ 4 && get_spread_object(/*$$props*/ ctx[2])
				])
			: {};

			if (dirty & /*$$scope*/ 512) {
				button_changes.$$scope = { dirty, ctx };
			}

			button.$set(button_changes);

			if (/*inprogress*/ ctx[0]) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*inprogress*/ 1) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block$c(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(div1, null);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}

			if (dirty & /*inprogress*/ 1) {
				toggle_class(div1, "inprogress", /*inprogress*/ ctx[0]);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(button.$$.fragment, local);
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(button.$$.fragment, local);
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div1);
			destroy_component(button);
			if (if_block) if_block.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$U.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$U($$self, $$props, $$invalidate) {
	let { inprogress = false } = $$props;
	let { progress = {} } = $$props;
	let { $$slots = {}, $$scope } = $$props;
	validate_slots("ProgressButton", $$slots, ['default']);

	function click_handler(event) {
		bubble($$self, event);
	}

	function change_handler(event) {
		bubble($$self, event);
	}

	function focus_handler(event) {
		bubble($$self, event);
	}

	function blur_handler(event) {
		bubble($$self, event);
	}

	$$self.$set = $$new_props => {
		$$invalidate(2, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
		if ("inprogress" in $$new_props) $$invalidate(0, inprogress = $$new_props.inprogress);
		if ("progress" in $$new_props) $$invalidate(1, progress = $$new_props.progress);
		if ("$$scope" in $$new_props) $$invalidate(9, $$scope = $$new_props.$$scope);
	};

	$$self.$capture_state = () => ({
		Button: xe,
		CircularProgress,
		inprogress,
		progress,
		disabled
	});

	$$self.$inject_state = $$new_props => {
		$$invalidate(2, $$props = assign(assign({}, $$props), $$new_props));
		if ("inprogress" in $$props) $$invalidate(0, inprogress = $$new_props.inprogress);
		if ("progress" in $$props) $$invalidate(1, progress = $$new_props.progress);
		if ("disabled" in $$props) disabled = $$new_props.disabled;
	};

	let disabled;

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*inprogress*/ 1) {
			 disabled = inprogress;
		}
	};

	$$props = exclude_internal_props($$props);

	return [
		inprogress,
		progress,
		$$props,
		disabled,
		$$slots,
		click_handler,
		change_handler,
		focus_handler,
		blur_handler,
		$$scope
	];
}

class ProgressButton extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$U, create_fragment$U, safe_not_equal, { inprogress: 0, progress: 1 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "ProgressButton",
			options,
			id: create_fragment$U.name
		});
	}

	get inprogress() {
		throw new Error("<ProgressButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set inprogress(value) {
		throw new Error("<ProgressButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get progress() {
		throw new Error("<ProgressButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set progress(value) {
		throw new Error("<ProgressButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src/comp/Editor/Editor.svelte generated by Svelte v3.21.0 */
const file$T = "src/comp/Editor/Editor.svelte";

// (169:6) {#if all("undo", "redo")}
function create_if_block_15(ctx) {
	let x_command_group;
	let x_command0;
	let x_command0_data_tooltip_value;
	let t;
	let x_command1;
	let x_command1_data_tooltip_value;
	let current;
	let dispose;
	const undo = new Undo({ $$inline: true });
	const redo = new Redo({ $$inline: true });

	const block = {
		c: function create() {
			x_command_group = element("x-command-group");
			x_command0 = element("x-command");
			create_component(undo.$$.fragment);
			t = space();
			x_command1 = element("x-command");
			create_component(redo.$$.fragment);
			set_custom_element_data(x_command0, "data-tooltip", x_command0_data_tooltip_value = /*locale*/ ctx[4].cmd.undo);
			add_location(x_command0, file$T, 170, 8, 4274);
			set_custom_element_data(x_command1, "data-tooltip", x_command1_data_tooltip_value = /*locale*/ ctx[4].cmd.redo);
			add_location(x_command1, file$T, 173, 8, 4394);
			add_location(x_command_group, file$T, 169, 6, 4248);
		},
		m: function mount(target, anchor, remount) {
			insert_dev(target, x_command_group, anchor);
			append_dev(x_command_group, x_command0);
			mount_component(undo, x_command0, null);
			append_dev(x_command_group, t);
			append_dev(x_command_group, x_command1);
			mount_component(redo, x_command1, null);
			current = true;
			if (remount) run_all(dispose);

			dispose = [
				listen_dev(x_command0, "click", /*click_handler*/ ctx[13], false, false, false),
				listen_dev(x_command1, "click", /*click_handler_1*/ ctx[14], false, false, false)
			];
		},
		p: function update(ctx, dirty) {
			if (!current || dirty & /*locale*/ 16 && x_command0_data_tooltip_value !== (x_command0_data_tooltip_value = /*locale*/ ctx[4].cmd.undo)) {
				set_custom_element_data(x_command0, "data-tooltip", x_command0_data_tooltip_value);
			}

			if (!current || dirty & /*locale*/ 16 && x_command1_data_tooltip_value !== (x_command1_data_tooltip_value = /*locale*/ ctx[4].cmd.redo)) {
				set_custom_element_data(x_command1, "data-tooltip", x_command1_data_tooltip_value);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(undo.$$.fragment, local);
			transition_in(redo.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(undo.$$.fragment, local);
			transition_out(redo.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(x_command_group);
			destroy_component(undo);
			destroy_component(redo);
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_15.name,
		type: "if",
		source: "(169:6) {#if all(\\\"undo\\\", \\\"redo\\\")}",
		ctx
	});

	return block;
}

// (180:6) {#if has("fontName")}
function create_if_block_14(ctx) {
	let x_command_group;
	let current;

	const fontfamily = new FontFamily_1({
			props: { tooltip: /*locale*/ ctx[4].cmd.fontName },
			$$inline: true
		});

	const block = {
		c: function create() {
			x_command_group = element("x-command-group");
			create_component(fontfamily.$$.fragment);
			add_location(x_command_group, file$T, 180, 8, 4580);
		},
		m: function mount(target, anchor) {
			insert_dev(target, x_command_group, anchor);
			mount_component(fontfamily, x_command_group, null);
			current = true;
		},
		p: function update(ctx, dirty) {
			const fontfamily_changes = {};
			if (dirty & /*locale*/ 16) fontfamily_changes.tooltip = /*locale*/ ctx[4].cmd.fontName;
			fontfamily.$set(fontfamily_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(fontfamily.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(fontfamily.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(x_command_group);
			destroy_component(fontfamily);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_14.name,
		type: "if",
		source: "(180:6) {#if has(\\\"fontName\\\")}",
		ctx
	});

	return block;
}

// (186:6) {#if has("fontSize")}
function create_if_block_13(ctx) {
	let x_command_group;
	let current;

	const fontsize = new FontSize({
			props: { tooltip: /*locale*/ ctx[4].cmd.fontSize },
			$$inline: true
		});

	const block = {
		c: function create() {
			x_command_group = element("x-command-group");
			create_component(fontsize.$$.fragment);
			add_location(x_command_group, file$T, 186, 8, 4729);
		},
		m: function mount(target, anchor) {
			insert_dev(target, x_command_group, anchor);
			mount_component(fontsize, x_command_group, null);
			current = true;
		},
		p: function update(ctx, dirty) {
			const fontsize_changes = {};
			if (dirty & /*locale*/ 16) fontsize_changes.tooltip = /*locale*/ ctx[4].cmd.fontSize;
			fontsize.$set(fontsize_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(fontsize.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(fontsize.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(x_command_group);
			destroy_component(fontsize);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_13.name,
		type: "if",
		source: "(186:6) {#if has(\\\"fontSize\\\")}",
		ctx
	});

	return block;
}

// (192:6) {#if any("bold", "italic", "underline")}
function create_if_block_9(ctx) {
	let x_command_group;
	let show_if_2 = /*has*/ ctx[6]("bold");
	let t0;
	let show_if_1 = /*has*/ ctx[6]("italic");
	let t1;
	let show_if = /*has*/ ctx[6]("underline");
	let current;
	let if_block0 = show_if_2 && create_if_block_12(ctx);
	let if_block1 = show_if_1 && create_if_block_11(ctx);
	let if_block2 = show_if && create_if_block_10(ctx);

	const block = {
		c: function create() {
			x_command_group = element("x-command-group");
			if (if_block0) if_block0.c();
			t0 = space();
			if (if_block1) if_block1.c();
			t1 = space();
			if (if_block2) if_block2.c();
			add_location(x_command_group, file$T, 192, 8, 4900);
		},
		m: function mount(target, anchor) {
			insert_dev(target, x_command_group, anchor);
			if (if_block0) if_block0.m(x_command_group, null);
			append_dev(x_command_group, t0);
			if (if_block1) if_block1.m(x_command_group, null);
			append_dev(x_command_group, t1);
			if (if_block2) if_block2.m(x_command_group, null);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (show_if_2) if_block0.p(ctx, dirty);
			if (show_if_1) if_block1.p(ctx, dirty);
			if (show_if) if_block2.p(ctx, dirty);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block0);
			transition_in(if_block1);
			transition_in(if_block2);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block0);
			transition_out(if_block1);
			transition_out(if_block2);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(x_command_group);
			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
			if (if_block2) if_block2.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_9.name,
		type: "if",
		source: "(192:6) {#if any(\\\"bold\\\", \\\"italic\\\", \\\"underline\\\")}",
		ctx
	});

	return block;
}

// (194:10) {#if has("bold")}
function create_if_block_12(ctx) {
	let x_command;
	let x_command_data_tooltip_value;
	let current;
	let dispose;
	const bold = new FormatBold({ $$inline: true });

	const block = {
		c: function create() {
			x_command = element("x-command");
			create_component(bold.$$.fragment);
			set_custom_element_data(x_command, "data-tooltip", x_command_data_tooltip_value = /*locale*/ ctx[4].cmd.bold);
			add_location(x_command, file$T, 194, 12, 4958);
		},
		m: function mount(target, anchor, remount) {
			insert_dev(target, x_command, anchor);
			mount_component(bold, x_command, null);
			current = true;
			if (remount) dispose();
			dispose = listen_dev(x_command, "click", /*click_handler_2*/ ctx[15], false, false, false);
		},
		p: function update(ctx, dirty) {
			if (!current || dirty & /*locale*/ 16 && x_command_data_tooltip_value !== (x_command_data_tooltip_value = /*locale*/ ctx[4].cmd.bold)) {
				set_custom_element_data(x_command, "data-tooltip", x_command_data_tooltip_value);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(bold.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(bold.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(x_command);
			destroy_component(bold);
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_12.name,
		type: "if",
		source: "(194:10) {#if has(\\\"bold\\\")}",
		ctx
	});

	return block;
}

// (200:10) {#if has("italic")}
function create_if_block_11(ctx) {
	let x_command;
	let x_command_data_tooltip_value;
	let current;
	let dispose;
	const italic = new FormatItalic({ $$inline: true });

	const block = {
		c: function create() {
			x_command = element("x-command");
			create_component(italic.$$.fragment);
			set_custom_element_data(x_command, "data-tooltip", x_command_data_tooltip_value = /*locale*/ ctx[4].cmd.italic);
			add_location(x_command, file$T, 200, 12, 5137);
		},
		m: function mount(target, anchor, remount) {
			insert_dev(target, x_command, anchor);
			mount_component(italic, x_command, null);
			current = true;
			if (remount) dispose();
			dispose = listen_dev(x_command, "click", /*click_handler_3*/ ctx[16], false, false, false);
		},
		p: function update(ctx, dirty) {
			if (!current || dirty & /*locale*/ 16 && x_command_data_tooltip_value !== (x_command_data_tooltip_value = /*locale*/ ctx[4].cmd.italic)) {
				set_custom_element_data(x_command, "data-tooltip", x_command_data_tooltip_value);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(italic.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(italic.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(x_command);
			destroy_component(italic);
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_11.name,
		type: "if",
		source: "(200:10) {#if has(\\\"italic\\\")}",
		ctx
	});

	return block;
}

// (206:10) {#if has("underline")}
function create_if_block_10(ctx) {
	let x_command;
	let x_command_data_tooltip_value;
	let current;
	let dispose;
	const underline = new FormatUnderline({ $$inline: true });

	const block = {
		c: function create() {
			x_command = element("x-command");
			create_component(underline.$$.fragment);
			set_custom_element_data(x_command, "data-tooltip", x_command_data_tooltip_value = /*locale*/ ctx[4].cmd.underline);
			add_location(x_command, file$T, 206, 12, 5325);
		},
		m: function mount(target, anchor, remount) {
			insert_dev(target, x_command, anchor);
			mount_component(underline, x_command, null);
			current = true;
			if (remount) dispose();
			dispose = listen_dev(x_command, "click", /*click_handler_4*/ ctx[17], false, false, false);
		},
		p: function update(ctx, dirty) {
			if (!current || dirty & /*locale*/ 16 && x_command_data_tooltip_value !== (x_command_data_tooltip_value = /*locale*/ ctx[4].cmd.underline)) {
				set_custom_element_data(x_command, "data-tooltip", x_command_data_tooltip_value);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(underline.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(underline.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(x_command);
			destroy_component(underline);
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_10.name,
		type: "if",
		source: "(206:10) {#if has(\\\"underline\\\")}",
		ctx
	});

	return block;
}

// (214:6) {#if any("foreColor", "backColor")}
function create_if_block_8(ctx) {
	let current;

	const color = new Color({
			props: { locale: /*locale*/ ctx[4].color },
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(color.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(color, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const color_changes = {};
			if (dirty & /*locale*/ 16) color_changes.locale = /*locale*/ ctx[4].color;
			color.$set(color_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(color.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(color.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(color, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_8.name,
		type: "if",
		source: "(214:6) {#if any(\\\"foreColor\\\", \\\"backColor\\\")}",
		ctx
	});

	return block;
}

// (218:6) {#if any("justifyLeft", "justifyCenter", "justifyRight")}
function create_if_block_4$1(ctx) {
	let x_command_group;
	let show_if_2 = /*has*/ ctx[6]("justifyLeft");
	let t0;
	let show_if_1 = /*has*/ ctx[6]("justifyCenter");
	let t1;
	let show_if = /*has*/ ctx[6]("justifyRight");
	let current;
	let if_block0 = show_if_2 && create_if_block_7(ctx);
	let if_block1 = show_if_1 && create_if_block_6(ctx);
	let if_block2 = show_if && create_if_block_5(ctx);

	const block = {
		c: function create() {
			x_command_group = element("x-command-group");
			if (if_block0) if_block0.c();
			t0 = space();
			if (if_block1) if_block1.c();
			t1 = space();
			if (if_block2) if_block2.c();
			add_location(x_command_group, file$T, 218, 8, 5683);
		},
		m: function mount(target, anchor) {
			insert_dev(target, x_command_group, anchor);
			if (if_block0) if_block0.m(x_command_group, null);
			append_dev(x_command_group, t0);
			if (if_block1) if_block1.m(x_command_group, null);
			append_dev(x_command_group, t1);
			if (if_block2) if_block2.m(x_command_group, null);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (show_if_2) if_block0.p(ctx, dirty);
			if (show_if_1) if_block1.p(ctx, dirty);
			if (show_if) if_block2.p(ctx, dirty);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block0);
			transition_in(if_block1);
			transition_in(if_block2);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block0);
			transition_out(if_block1);
			transition_out(if_block2);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(x_command_group);
			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
			if (if_block2) if_block2.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_4$1.name,
		type: "if",
		source: "(218:6) {#if any(\\\"justifyLeft\\\", \\\"justifyCenter\\\", \\\"justifyRight\\\")}",
		ctx
	});

	return block;
}

// (220:10) {#if has("justifyLeft")}
function create_if_block_7(ctx) {
	let x_command;
	let x_command_data_tooltip_value;
	let current;
	let dispose;
	const justifyleft = new FormatAlignLeft({ $$inline: true });

	const block = {
		c: function create() {
			x_command = element("x-command");
			create_component(justifyleft.$$.fragment);
			set_custom_element_data(x_command, "data-tooltip", x_command_data_tooltip_value = /*locale*/ ctx[4].cmd.justifyLeft);
			add_location(x_command, file$T, 220, 12, 5748);
		},
		m: function mount(target, anchor, remount) {
			insert_dev(target, x_command, anchor);
			mount_component(justifyleft, x_command, null);
			current = true;
			if (remount) dispose();
			dispose = listen_dev(x_command, "click", /*click_handler_5*/ ctx[18], false, false, false);
		},
		p: function update(ctx, dirty) {
			if (!current || dirty & /*locale*/ 16 && x_command_data_tooltip_value !== (x_command_data_tooltip_value = /*locale*/ ctx[4].cmd.justifyLeft)) {
				set_custom_element_data(x_command, "data-tooltip", x_command_data_tooltip_value);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(justifyleft.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(justifyleft.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(x_command);
			destroy_component(justifyleft);
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_7.name,
		type: "if",
		source: "(220:10) {#if has(\\\"justifyLeft\\\")}",
		ctx
	});

	return block;
}

// (225:10) {#if has("justifyCenter")}
function create_if_block_6(ctx) {
	let x_command;
	let x_command_data_tooltip_value;
	let current;
	let dispose;
	const justifycenter = new FormatAlignCenter({ $$inline: true });

	const block = {
		c: function create() {
			x_command = element("x-command");
			create_component(justifycenter.$$.fragment);
			set_custom_element_data(x_command, "data-tooltip", x_command_data_tooltip_value = /*locale*/ ctx[4].cmd.justifyCenter);
			add_location(x_command, file$T, 225, 12, 5954);
		},
		m: function mount(target, anchor, remount) {
			insert_dev(target, x_command, anchor);
			mount_component(justifycenter, x_command, null);
			current = true;
			if (remount) dispose();
			dispose = listen_dev(x_command, "click", /*click_handler_6*/ ctx[19], false, false, false);
		},
		p: function update(ctx, dirty) {
			if (!current || dirty & /*locale*/ 16 && x_command_data_tooltip_value !== (x_command_data_tooltip_value = /*locale*/ ctx[4].cmd.justifyCenter)) {
				set_custom_element_data(x_command, "data-tooltip", x_command_data_tooltip_value);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(justifycenter.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(justifycenter.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(x_command);
			destroy_component(justifycenter);
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_6.name,
		type: "if",
		source: "(225:10) {#if has(\\\"justifyCenter\\\")}",
		ctx
	});

	return block;
}

// (230:10) {#if has("justifyRight")}
function create_if_block_5(ctx) {
	let x_command;
	let x_command_data_tooltip_value;
	let current;
	let dispose;
	const justifyright = new FormatAlignRight({ $$inline: true });

	const block = {
		c: function create() {
			x_command = element("x-command");
			create_component(justifyright.$$.fragment);
			set_custom_element_data(x_command, "data-tooltip", x_command_data_tooltip_value = /*locale*/ ctx[4].cmd.justifyRight);
			add_location(x_command, file$T, 230, 12, 6165);
		},
		m: function mount(target, anchor, remount) {
			insert_dev(target, x_command, anchor);
			mount_component(justifyright, x_command, null);
			current = true;
			if (remount) dispose();
			dispose = listen_dev(x_command, "click", /*click_handler_7*/ ctx[20], false, false, false);
		},
		p: function update(ctx, dirty) {
			if (!current || dirty & /*locale*/ 16 && x_command_data_tooltip_value !== (x_command_data_tooltip_value = /*locale*/ ctx[4].cmd.justifyRight)) {
				set_custom_element_data(x_command, "data-tooltip", x_command_data_tooltip_value);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(justifyright.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(justifyright.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(x_command);
			destroy_component(justifyright);
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_5.name,
		type: "if",
		source: "(230:10) {#if has(\\\"justifyRight\\\")}",
		ctx
	});

	return block;
}

// (238:6) {#if any("insertUnorderedList", "insertOrderedList")}
function create_if_block_1$9(ctx) {
	let x_command_group;
	let show_if_1 = /*has*/ ctx[6]("insertUnorderedList");
	let t;
	let show_if = /*has*/ ctx[6]("insertOrderedList");
	let current;
	let if_block0 = show_if_1 && create_if_block_3$2(ctx);
	let if_block1 = show_if && create_if_block_2$5(ctx);

	const block = {
		c: function create() {
			x_command_group = element("x-command-group");
			if (if_block0) if_block0.c();
			t = space();
			if (if_block1) if_block1.c();
			add_location(x_command_group, file$T, 238, 8, 6433);
		},
		m: function mount(target, anchor) {
			insert_dev(target, x_command_group, anchor);
			if (if_block0) if_block0.m(x_command_group, null);
			append_dev(x_command_group, t);
			if (if_block1) if_block1.m(x_command_group, null);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (show_if_1) if_block0.p(ctx, dirty);
			if (show_if) if_block1.p(ctx, dirty);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block0);
			transition_in(if_block1);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block0);
			transition_out(if_block1);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(x_command_group);
			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$9.name,
		type: "if",
		source: "(238:6) {#if any(\\\"insertUnorderedList\\\", \\\"insertOrderedList\\\")}",
		ctx
	});

	return block;
}

// (240:10) {#if has("insertUnorderedList")}
function create_if_block_3$2(ctx) {
	let x_command;
	let x_command_data_tooltip_value;
	let current;
	let dispose;
	const listbulleted = new FormatListBulleted({ $$inline: true });

	const block = {
		c: function create() {
			x_command = element("x-command");
			create_component(listbulleted.$$.fragment);
			set_custom_element_data(x_command, "data-tooltip", x_command_data_tooltip_value = /*locale*/ ctx[4].cmd.insertUnorderedList);
			add_location(x_command, file$T, 240, 12, 6506);
		},
		m: function mount(target, anchor, remount) {
			insert_dev(target, x_command, anchor);
			mount_component(listbulleted, x_command, null);
			current = true;
			if (remount) dispose();
			dispose = listen_dev(x_command, "click", /*click_handler_8*/ ctx[21], false, false, false);
		},
		p: function update(ctx, dirty) {
			if (!current || dirty & /*locale*/ 16 && x_command_data_tooltip_value !== (x_command_data_tooltip_value = /*locale*/ ctx[4].cmd.insertUnorderedList)) {
				set_custom_element_data(x_command, "data-tooltip", x_command_data_tooltip_value);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(listbulleted.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(listbulleted.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(x_command);
			destroy_component(listbulleted);
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_3$2.name,
		type: "if",
		source: "(240:10) {#if has(\\\"insertUnorderedList\\\")}",
		ctx
	});

	return block;
}

// (245:10) {#if has("insertOrderedList")}
function create_if_block_2$5(ctx) {
	let x_command;
	let x_command_data_tooltip_value;
	let current;
	let dispose;
	const listnumbered = new FormatListNumbered({ $$inline: true });

	const block = {
		c: function create() {
			x_command = element("x-command");
			create_component(listnumbered.$$.fragment);
			set_custom_element_data(x_command, "data-tooltip", x_command_data_tooltip_value = /*locale*/ ctx[4].cmd.insertOrderedList);
			add_location(x_command, file$T, 245, 12, 6733);
		},
		m: function mount(target, anchor, remount) {
			insert_dev(target, x_command, anchor);
			mount_component(listnumbered, x_command, null);
			current = true;
			if (remount) dispose();
			dispose = listen_dev(x_command, "click", /*click_handler_9*/ ctx[22], false, false, false);
		},
		p: function update(ctx, dirty) {
			if (!current || dirty & /*locale*/ 16 && x_command_data_tooltip_value !== (x_command_data_tooltip_value = /*locale*/ ctx[4].cmd.insertOrderedList)) {
				set_custom_element_data(x_command, "data-tooltip", x_command_data_tooltip_value);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(listnumbered.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(listnumbered.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(x_command);
			destroy_component(listnumbered);
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2$5.name,
		type: "if",
		source: "(245:10) {#if has(\\\"insertOrderedList\\\")}",
		ctx
	});

	return block;
}

// (253:6) {#if has("removeFormat")}
function create_if_block$d(ctx) {
	let x_command_group;
	let x_command;
	let x_command_data_tooltip_value;
	let current;
	let dispose;
	const removeformat = new FormatClear({ $$inline: true });

	const block = {
		c: function create() {
			x_command_group = element("x-command-group");
			x_command = element("x-command");
			create_component(removeformat.$$.fragment);
			set_custom_element_data(x_command, "data-tooltip", x_command_data_tooltip_value = /*locale*/ ctx[4].cmd.removeFormat);
			add_location(x_command, file$T, 254, 10, 7011);
			add_location(x_command_group, file$T, 253, 8, 6983);
		},
		m: function mount(target, anchor, remount) {
			insert_dev(target, x_command_group, anchor);
			append_dev(x_command_group, x_command);
			mount_component(removeformat, x_command, null);
			current = true;
			if (remount) dispose();
			dispose = listen_dev(x_command, "click", /*click_handler_10*/ ctx[23], false, false, false);
		},
		p: function update(ctx, dirty) {
			if (!current || dirty & /*locale*/ 16 && x_command_data_tooltip_value !== (x_command_data_tooltip_value = /*locale*/ ctx[4].cmd.removeFormat)) {
				set_custom_element_data(x_command, "data-tooltip", x_command_data_tooltip_value);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(removeformat.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(removeformat.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(x_command_group);
			destroy_component(removeformat);
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$d.name,
		type: "if",
		source: "(253:6) {#if has(\\\"removeFormat\\\")}",
		ctx
	});

	return block;
}

// (265:8) <ProgressButton color="#4273e8" progress={{size: "1.5em"}} raised inprogress={sending} on:click={() => dispatch("send")}>
function create_default_slot$9(ctx) {
	let span;
	let t_value = /*locale*/ ctx[4].send + "";
	let t;

	const block = {
		c: function create() {
			span = element("span");
			t = text(t_value);
			set_style(span, "text-transform", "none");
			set_style(span, "font-size", "1.1em");
			add_location(span, file$T, 265, 10, 7427);
		},
		m: function mount(target, anchor) {
			insert_dev(target, span, anchor);
			append_dev(span, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*locale*/ 16 && t_value !== (t_value = /*locale*/ ctx[4].send + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(span);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$9.name,
		type: "slot",
		source: "(265:8) <ProgressButton color=\\\"#4273e8\\\" progress={{size: \\\"1.5em\\\"}} raised inprogress={sending} on:click={() => dispatch(\\\"send\\\")}>",
		ctx
	});

	return block;
}

function create_fragment$V(ctx) {
	let x_editor;
	let x_editable;
	let t0;
	let x_bar;
	let x_toolbar;
	let show_if_7 = /*all*/ ctx[9]("undo", "redo");
	let t1;
	let show_if_6 = /*has*/ ctx[6]("fontName");
	let t2;
	let show_if_5 = /*has*/ ctx[6]("fontSize");
	let t3;
	let show_if_4 = /*any*/ ctx[8]("bold", "italic", "underline");
	let t4;
	let show_if_3 = /*any*/ ctx[8]("foreColor", "backColor");
	let t5;
	let show_if_2 = /*any*/ ctx[8]("justifyLeft", "justifyCenter", "justifyRight");
	let t6;
	let show_if_1 = /*any*/ ctx[8]("insertUnorderedList", "insertOrderedList");
	let t7;
	let show_if = /*has*/ ctx[6]("removeFormat");
	let t8;
	let x_end;
	let updating_files;
	let t9;
	let x_send;
	let current;
	let dispose;
	let if_block0 = show_if_7 && create_if_block_15(ctx);
	let if_block1 = show_if_6 && create_if_block_14(ctx);
	let if_block2 = show_if_5 && create_if_block_13(ctx);
	let if_block3 = show_if_4 && create_if_block_9(ctx);
	let if_block4 = show_if_3 && create_if_block_8(ctx);
	let if_block5 = show_if_2 && create_if_block_4$1(ctx);
	let if_block6 = show_if_1 && create_if_block_1$9(ctx);
	let if_block7 = show_if && create_if_block$d(ctx);

	function upload_files_binding(value) {
		/*upload_files_binding*/ ctx[24].call(null, value);
	}

	let upload_props = { locale: /*locale*/ ctx[4].upload };

	if (/*files*/ ctx[2] !== void 0) {
		upload_props.files = /*files*/ ctx[2];
	}

	const upload = new Upload({ props: upload_props, $$inline: true });
	binding_callbacks.push(() => bind(upload, "files", upload_files_binding));

	const progressbutton = new ProgressButton({
			props: {
				color: "#4273e8",
				progress: { size: "1.5em" },
				raised: true,
				inprogress: /*sending*/ ctx[3],
				$$slots: { default: [create_default_slot$9] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	progressbutton.$on("click", /*click_handler_11*/ ctx[25]);

	const block = {
		c: function create() {
			x_editor = element("x-editor");
			x_editable = element("x-editable");
			t0 = space();
			x_bar = element("x-bar");
			x_toolbar = element("x-toolbar");
			if (if_block0) if_block0.c();
			t1 = space();
			if (if_block1) if_block1.c();
			t2 = space();
			if (if_block2) if_block2.c();
			t3 = space();
			if (if_block3) if_block3.c();
			t4 = space();
			if (if_block4) if_block4.c();
			t5 = space();
			if (if_block5) if_block5.c();
			t6 = space();
			if (if_block6) if_block6.c();
			t7 = space();
			if (if_block7) if_block7.c();
			t8 = space();
			x_end = element("x-end");
			create_component(upload.$$.fragment);
			t9 = space();
			x_send = element("x-send");
			create_component(progressbutton.$$.fragment);
			set_custom_element_data(x_editable, "contenteditable", "");
			set_custom_element_data(x_editable, "class", "svelte-5urd9p");
			if (/*text*/ ctx[1] === void 0 || /*html*/ ctx[0] === void 0) add_render_callback(() => /*x_editable_input_handler*/ ctx[12].call(x_editable));
			add_location(x_editable, file$T, 163, 2, 4072);
			set_custom_element_data(x_toolbar, "class", "elevation-4 svelte-5urd9p");
			add_location(x_toolbar, file$T, 166, 4, 4177);
			set_custom_element_data(x_send, "class", "svelte-5urd9p");
			add_location(x_send, file$T, 263, 6, 7278);
			set_custom_element_data(x_end, "class", "svelte-5urd9p");
			add_location(x_end, file$T, 261, 4, 7214);
			set_custom_element_data(x_bar, "class", "svelte-5urd9p");
			add_location(x_bar, file$T, 165, 2, 4165);
			set_custom_element_data(x_editor, "class", "svelte-5urd9p");
			add_location(x_editor, file$T, 162, 0, 4059);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor, remount) {
			insert_dev(target, x_editor, anchor);
			append_dev(x_editor, x_editable);

			if (/*text*/ ctx[1] !== void 0) {
				x_editable.textContent = /*text*/ ctx[1];
			}

			if (/*html*/ ctx[0] !== void 0) {
				x_editable.innerHTML = /*html*/ ctx[0];
			}

			append_dev(x_editor, t0);
			append_dev(x_editor, x_bar);
			append_dev(x_bar, x_toolbar);
			if (if_block0) if_block0.m(x_toolbar, null);
			append_dev(x_toolbar, t1);
			if (if_block1) if_block1.m(x_toolbar, null);
			append_dev(x_toolbar, t2);
			if (if_block2) if_block2.m(x_toolbar, null);
			append_dev(x_toolbar, t3);
			if (if_block3) if_block3.m(x_toolbar, null);
			append_dev(x_toolbar, t4);
			if (if_block4) if_block4.m(x_toolbar, null);
			append_dev(x_toolbar, t5);
			if (if_block5) if_block5.m(x_toolbar, null);
			append_dev(x_toolbar, t6);
			if (if_block6) if_block6.m(x_toolbar, null);
			append_dev(x_toolbar, t7);
			if (if_block7) if_block7.m(x_toolbar, null);
			append_dev(x_bar, t8);
			append_dev(x_bar, x_end);
			mount_component(upload, x_end, null);
			append_dev(x_end, t9);
			append_dev(x_end, x_send);
			mount_component(progressbutton, x_send, null);
			current = true;
			if (remount) dispose();
			dispose = listen_dev(x_editable, "input", /*x_editable_input_handler*/ ctx[12]);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*text*/ 2 && /*text*/ ctx[1] !== x_editable.textContent) {
				x_editable.textContent = /*text*/ ctx[1];
			}

			if (dirty & /*html*/ 1 && /*html*/ ctx[0] !== x_editable.innerHTML) {
				x_editable.innerHTML = /*html*/ ctx[0];
			}

			if (show_if_7) if_block0.p(ctx, dirty);
			if (show_if_6) if_block1.p(ctx, dirty);
			if (show_if_5) if_block2.p(ctx, dirty);
			if (show_if_4) if_block3.p(ctx, dirty);
			if (show_if_3) if_block4.p(ctx, dirty);
			if (show_if_2) if_block5.p(ctx, dirty);
			if (show_if_1) if_block6.p(ctx, dirty);
			if (show_if) if_block7.p(ctx, dirty);
			const upload_changes = {};
			if (dirty & /*locale*/ 16) upload_changes.locale = /*locale*/ ctx[4].upload;

			if (!updating_files && dirty & /*files*/ 4) {
				updating_files = true;
				upload_changes.files = /*files*/ ctx[2];
				add_flush_callback(() => updating_files = false);
			}

			upload.$set(upload_changes);
			const progressbutton_changes = {};
			if (dirty & /*sending*/ 8) progressbutton_changes.inprogress = /*sending*/ ctx[3];

			if (dirty & /*$$scope, locale*/ 67108880) {
				progressbutton_changes.$$scope = { dirty, ctx };
			}

			progressbutton.$set(progressbutton_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block0);
			transition_in(if_block1);
			transition_in(if_block2);
			transition_in(if_block3);
			transition_in(if_block4);
			transition_in(if_block5);
			transition_in(if_block6);
			transition_in(if_block7);
			transition_in(upload.$$.fragment, local);
			transition_in(progressbutton.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block0);
			transition_out(if_block1);
			transition_out(if_block2);
			transition_out(if_block3);
			transition_out(if_block4);
			transition_out(if_block5);
			transition_out(if_block6);
			transition_out(if_block7);
			transition_out(upload.$$.fragment, local);
			transition_out(progressbutton.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(x_editor);
			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
			if (if_block2) if_block2.d();
			if (if_block3) if_block3.d();
			if (if_block4) if_block4.d();
			if (if_block5) if_block5.d();
			if (if_block6) if_block6.d();
			if (if_block7) if_block7.d();
			destroy_component(upload);
			destroy_component(progressbutton);
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$V.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$V($$self, $$props, $$invalidate) {
	let $l;
	const dispatch = createEventDispatcher();
	let { html = "" } = $$props;
	let { text = "" } = $$props;
	let { sending = false } = $$props;
	let { files } = $$props;
	const has = cmd => document.queryCommandSupported(cmd);
	const cmd = (key, value) => document.execCommand(key, null, value);
	const any = (...cmds) => cmds.some(c => has(c));
	const all = (...cmds) => cmds.every(c => has(c));
	setContext("editor", { has, cmd, any, all });
	const { locale: l } = getContext("app");
	validate_store(l, "l");
	component_subscribe($$self, l, value => $$invalidate(11, $l = value));
	let { locale = $l.editor } = $$props;
	const writable_props = ["html", "text", "sending", "files", "locale"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Editor> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("Editor", $$slots, []);

	function x_editable_input_handler() {
		text = this.textContent;
		html = this.innerHTML;
		$$invalidate(1, text);
		$$invalidate(0, html);
	}

	const click_handler = () => cmd("undo");
	const click_handler_1 = () => cmd("redo");
	const click_handler_2 = () => cmd("bold");
	const click_handler_3 = () => cmd("italic");
	const click_handler_4 = () => cmd("underline");
	const click_handler_5 = () => cmd("justifyLeft");
	const click_handler_6 = () => cmd("justifyCenter");
	const click_handler_7 = () => cmd("justifyRight");
	const click_handler_8 = () => cmd("insertUnorderedList");
	const click_handler_9 = () => cmd("insertOrderedList");
	const click_handler_10 = () => cmd("removeFormat");

	function upload_files_binding(value) {
		files = value;
		$$invalidate(2, files);
	}

	const click_handler_11 = () => dispatch("send");

	$$self.$set = $$props => {
		if ("html" in $$props) $$invalidate(0, html = $$props.html);
		if ("text" in $$props) $$invalidate(1, text = $$props.text);
		if ("sending" in $$props) $$invalidate(3, sending = $$props.sending);
		if ("files" in $$props) $$invalidate(2, files = $$props.files);
		if ("locale" in $$props) $$invalidate(4, locale = $$props.locale);
	};

	$$self.$capture_state = () => ({
		setContext,
		getContext,
		createEventDispatcher,
		dispatch,
		html,
		text,
		sending,
		files,
		has,
		cmd,
		any,
		all,
		Bold: FormatBold,
		Underline: FormatUnderline,
		Italic: FormatItalic,
		JustifyLeft: FormatAlignLeft,
		JustifyRight: FormatAlignRight,
		JustifyCenter: FormatAlignCenter,
		ListBulleted: FormatListBulleted,
		ListNumbered: FormatListNumbered,
		Undo,
		Redo,
		Quote: FormatQuoteClose,
		Size: FormatSize,
		RemoveFormat: FormatClear,
		FontSize,
		FontFamily: FontFamily_1,
		Color,
		Upload,
		getNotifier,
		ProgressButton,
		l,
		locale,
		$l
	});

	$$self.$inject_state = $$props => {
		if ("html" in $$props) $$invalidate(0, html = $$props.html);
		if ("text" in $$props) $$invalidate(1, text = $$props.text);
		if ("sending" in $$props) $$invalidate(3, sending = $$props.sending);
		if ("files" in $$props) $$invalidate(2, files = $$props.files);
		if ("locale" in $$props) $$invalidate(4, locale = $$props.locale);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		html,
		text,
		files,
		sending,
		locale,
		dispatch,
		has,
		cmd,
		any,
		all,
		l,
		$l,
		x_editable_input_handler,
		click_handler,
		click_handler_1,
		click_handler_2,
		click_handler_3,
		click_handler_4,
		click_handler_5,
		click_handler_6,
		click_handler_7,
		click_handler_8,
		click_handler_9,
		click_handler_10,
		upload_files_binding,
		click_handler_11
	];
}

class Editor extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$V, create_fragment$V, safe_not_equal, {
			html: 0,
			text: 1,
			sending: 3,
			files: 2,
			locale: 4
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Editor",
			options,
			id: create_fragment$V.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*files*/ ctx[2] === undefined && !("files" in props)) {
			console.warn("<Editor> was created without expected prop 'files'");
		}
	}

	get html() {
		throw new Error("<Editor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set html(value) {
		throw new Error("<Editor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get text() {
		throw new Error("<Editor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set text(value) {
		throw new Error("<Editor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get sending() {
		throw new Error("<Editor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set sending(value) {
		throw new Error("<Editor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get files() {
		throw new Error("<Editor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set files(value) {
		throw new Error("<Editor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get locale() {
		throw new Error("<Editor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set locale(value) {
		throw new Error("<Editor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src/comp/Compose/Compose.svelte generated by Svelte v3.21.0 */
const file$U = "src/comp/Compose/Compose.svelte";

// (339:0) {#if self === $current}
function create_if_block$e(ctx) {
	let x_popup;
	let x_topbar;
	let x_topbar_button0;
	let t0;
	let x_topbar_button1;
	let t1;
	let x_compose;
	let x_metadata;
	let label0;
	let x_label0;
	let t2_value = /*locale*/ ctx[5].compose.labels.to + "";
	let t2;
	let t3;
	let updating_addrs;
	let t4;
	let x_toggle_cc;
	let t5;
	let t6;
	let t7;
	let t8;
	let label1;
	let x_label1;
	let t9_value = /*locale*/ ctx[5].compose.labels.subject + "";
	let t9;
	let t10;
	let input;
	let t11;
	let x_center;
	let updating_html;
	let updating_text;
	let updating_files;
	let x_popup_intro;
	let x_popup_outro;
	let current;
	let dispose;
	const close_1 = new WindowClose({ $$inline: true });
	const minimize_1 = new ColorHelper({ $$inline: true });

	function addrinput_addrs_binding(value) {
		/*addrinput_addrs_binding*/ ctx[20].call(null, value);
	}

	let addrinput_props = { name: "to" };

	if (/*$self*/ ctx[10].to !== void 0) {
		addrinput_props.addrs = /*$self*/ ctx[10].to;
	}

	const addrinput = new AddrInput({ props: addrinput_props, $$inline: true });
	binding_callbacks.push(() => bind(addrinput, "addrs", addrinput_addrs_binding));
	let if_block0 = !/*showCc*/ ctx[0] && create_if_block_4$2(ctx);
	let if_block1 = !/*showBcc*/ ctx[1] && create_if_block_3$3(ctx);
	let if_block2 = /*showCc*/ ctx[0] && create_if_block_2$6(ctx);
	let if_block3 = /*showBcc*/ ctx[1] && create_if_block_1$a(ctx);

	function editor_1_html_binding(value) {
		/*editor_1_html_binding*/ ctx[29].call(null, value);
	}

	function editor_1_text_binding(value) {
		/*editor_1_text_binding*/ ctx[30].call(null, value);
	}

	function editor_1_files_binding(value) {
		/*editor_1_files_binding*/ ctx[31].call(null, value);
	}

	let editor_1_props = {
		locale: /*locale*/ ctx[5].editor,
		sending: /*sending*/ ctx[9]
	};

	if (/*$self*/ ctx[10].html !== void 0) {
		editor_1_props.html = /*$self*/ ctx[10].html;
	}

	if (/*$self*/ ctx[10].text !== void 0) {
		editor_1_props.text = /*$self*/ ctx[10].text;
	}

	if (/*$self*/ ctx[10].files !== void 0) {
		editor_1_props.files = /*$self*/ ctx[10].files;
	}

	const editor_1 = new Editor({ props: editor_1_props, $$inline: true });
	/*editor_1_binding*/ ctx[28](editor_1);
	binding_callbacks.push(() => bind(editor_1, "html", editor_1_html_binding));
	binding_callbacks.push(() => bind(editor_1, "text", editor_1_text_binding));
	binding_callbacks.push(() => bind(editor_1, "files", editor_1_files_binding));
	editor_1.$on("send", /*sendMessage*/ ctx[13]);

	const block = {
		c: function create() {
			x_popup = element("x-popup");
			x_topbar = element("x-topbar");
			x_topbar_button0 = element("x-topbar-button");
			create_component(close_1.$$.fragment);
			t0 = space();
			x_topbar_button1 = element("x-topbar-button");
			create_component(minimize_1.$$.fragment);
			t1 = space();
			x_compose = element("x-compose");
			x_metadata = element("x-metadata");
			label0 = element("label");
			x_label0 = element("x-label");
			t2 = text(t2_value);
			t3 = space();
			create_component(addrinput.$$.fragment);
			t4 = space();
			x_toggle_cc = element("x-toggle-cc");
			if (if_block0) if_block0.c();
			t5 = space();
			if (if_block1) if_block1.c();
			t6 = space();
			if (if_block2) if_block2.c();
			t7 = space();
			if (if_block3) if_block3.c();
			t8 = space();
			label1 = element("label");
			x_label1 = element("x-label");
			t9 = text(t9_value);
			t10 = space();
			input = element("input");
			t11 = space();
			x_center = element("x-center");
			create_component(editor_1.$$.fragment);
			set_custom_element_data(x_topbar_button0, "class", "svelte-1qf03dz");
			add_location(x_topbar_button0, file$U, 342, 6, 6900);
			set_custom_element_data(x_topbar_button1, "class", "min svelte-1qf03dz");
			add_location(x_topbar_button1, file$U, 345, 6, 7000);
			set_custom_element_data(x_topbar, "class", "svelte-1qf03dz");
			add_location(x_topbar, file$U, 341, 4, 6863);
			set_custom_element_data(x_label0, "class", "svelte-1qf03dz");
			add_location(x_label0, file$U, 354, 10, 7221);
			set_custom_element_data(x_toggle_cc, "class", "svelte-1qf03dz");
			add_location(x_toggle_cc, file$U, 356, 10, 7333);
			attr_dev(label0, "class", "label-input svelte-1qf03dz");
			add_location(label0, file$U, 353, 8, 7183);
			set_custom_element_data(x_label1, "class", "svelte-1qf03dz");
			add_location(x_label1, file$U, 388, 10, 8461);
			attr_dev(input, "type", "text");
			attr_dev(input, "name", "subject");
			attr_dev(input, "id", "subject");
			attr_dev(input, "autocomplete", "off");
			attr_dev(input, "class", "svelte-1qf03dz");
			add_location(input, file$U, 389, 10, 8522);
			attr_dev(label1, "class", "label-input svelte-1qf03dz");
			attr_dev(label1, "for", "subject");
			add_location(label1, file$U, 387, 8, 8409);
			set_custom_element_data(x_metadata, "class", "svelte-1qf03dz");
			add_location(x_metadata, file$U, 352, 6, 7162);
			set_custom_element_data(x_center, "class", "svelte-1qf03dz");
			add_location(x_center, file$U, 393, 6, 8666);
			set_custom_element_data(x_compose, "class", "svelte-1qf03dz");
			add_location(x_compose, file$U, 350, 4, 7137);
			set_custom_element_data(x_popup, "class", "svelte-1qf03dz");
			add_location(x_popup, file$U, 340, 2, 6800);
		},
		m: function mount(target, anchor, remount) {
			insert_dev(target, x_popup, anchor);
			append_dev(x_popup, x_topbar);
			append_dev(x_topbar, x_topbar_button0);
			mount_component(close_1, x_topbar_button0, null);
			append_dev(x_topbar, t0);
			append_dev(x_topbar, x_topbar_button1);
			mount_component(minimize_1, x_topbar_button1, null);
			append_dev(x_popup, t1);
			append_dev(x_popup, x_compose);
			append_dev(x_compose, x_metadata);
			append_dev(x_metadata, label0);
			append_dev(label0, x_label0);
			append_dev(x_label0, t2);
			append_dev(label0, t3);
			mount_component(addrinput, label0, null);
			append_dev(label0, t4);
			append_dev(label0, x_toggle_cc);
			if (if_block0) if_block0.m(x_toggle_cc, null);
			append_dev(x_toggle_cc, t5);
			if (if_block1) if_block1.m(x_toggle_cc, null);
			append_dev(x_metadata, t6);
			if (if_block2) if_block2.m(x_metadata, null);
			append_dev(x_metadata, t7);
			if (if_block3) if_block3.m(x_metadata, null);
			append_dev(x_metadata, t8);
			append_dev(x_metadata, label1);
			append_dev(label1, x_label1);
			append_dev(x_label1, t9);
			append_dev(label1, t10);
			append_dev(label1, input);
			set_input_value(input, /*$self*/ ctx[10].subject);
			append_dev(x_compose, t11);
			append_dev(x_compose, x_center);
			mount_component(editor_1, x_center, null);
			current = true;
			if (remount) run_all(dispose);

			dispose = [
				listen_dev(
					x_topbar_button0,
					"click",
					stop_propagation(function () {
						if (is_function(/*close*/ ctx[4])) /*close*/ ctx[4].apply(this, arguments);
					}),
					false,
					false,
					true
				),
				listen_dev(x_topbar_button1, "click", stop_propagation(/*minimize*/ ctx[3]), false, false, true),
				listen_dev(x_topbar, "click", /*minimize*/ ctx[3], false, false, false),
				listen_dev(input, "input", /*input_input_handler*/ ctx[27])
			];
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			if ((!current || dirty[0] & /*locale*/ 32) && t2_value !== (t2_value = /*locale*/ ctx[5].compose.labels.to + "")) set_data_dev(t2, t2_value);
			const addrinput_changes = {};

			if (!updating_addrs && dirty[0] & /*$self*/ 1024) {
				updating_addrs = true;
				addrinput_changes.addrs = /*$self*/ ctx[10].to;
				add_flush_callback(() => updating_addrs = false);
			}

			addrinput.$set(addrinput_changes);

			if (!/*showCc*/ ctx[0]) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_4$2(ctx);
					if_block0.c();
					if_block0.m(x_toggle_cc, t5);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (!/*showBcc*/ ctx[1]) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block_3$3(ctx);
					if_block1.c();
					if_block1.m(x_toggle_cc, null);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}

			if (/*showCc*/ ctx[0]) {
				if (if_block2) {
					if_block2.p(ctx, dirty);

					if (dirty[0] & /*showCc*/ 1) {
						transition_in(if_block2, 1);
					}
				} else {
					if_block2 = create_if_block_2$6(ctx);
					if_block2.c();
					transition_in(if_block2, 1);
					if_block2.m(x_metadata, t7);
				}
			} else if (if_block2) {
				group_outros();

				transition_out(if_block2, 1, 1, () => {
					if_block2 = null;
				});

				check_outros();
			}

			if (/*showBcc*/ ctx[1]) {
				if (if_block3) {
					if_block3.p(ctx, dirty);

					if (dirty[0] & /*showBcc*/ 2) {
						transition_in(if_block3, 1);
					}
				} else {
					if_block3 = create_if_block_1$a(ctx);
					if_block3.c();
					transition_in(if_block3, 1);
					if_block3.m(x_metadata, t8);
				}
			} else if (if_block3) {
				group_outros();

				transition_out(if_block3, 1, 1, () => {
					if_block3 = null;
				});

				check_outros();
			}

			if ((!current || dirty[0] & /*locale*/ 32) && t9_value !== (t9_value = /*locale*/ ctx[5].compose.labels.subject + "")) set_data_dev(t9, t9_value);

			if (dirty[0] & /*$self*/ 1024 && input.value !== /*$self*/ ctx[10].subject) {
				set_input_value(input, /*$self*/ ctx[10].subject);
			}

			const editor_1_changes = {};
			if (dirty[0] & /*locale*/ 32) editor_1_changes.locale = /*locale*/ ctx[5].editor;
			if (dirty[0] & /*sending*/ 512) editor_1_changes.sending = /*sending*/ ctx[9];

			if (!updating_html && dirty[0] & /*$self*/ 1024) {
				updating_html = true;
				editor_1_changes.html = /*$self*/ ctx[10].html;
				add_flush_callback(() => updating_html = false);
			}

			if (!updating_text && dirty[0] & /*$self*/ 1024) {
				updating_text = true;
				editor_1_changes.text = /*$self*/ ctx[10].text;
				add_flush_callback(() => updating_text = false);
			}

			if (!updating_files && dirty[0] & /*$self*/ 1024) {
				updating_files = true;
				editor_1_changes.files = /*$self*/ ctx[10].files;
				add_flush_callback(() => updating_files = false);
			}

			editor_1.$set(editor_1_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(close_1.$$.fragment, local);
			transition_in(minimize_1.$$.fragment, local);
			transition_in(addrinput.$$.fragment, local);
			transition_in(if_block2);
			transition_in(if_block3);
			transition_in(editor_1.$$.fragment, local);

			add_render_callback(() => {
				if (x_popup_outro) x_popup_outro.end(1);
				if (!x_popup_intro) x_popup_intro = create_in_transition(x_popup, receive, { key: /*self*/ ctx[2] });
				x_popup_intro.start();
			});

			current = true;
		},
		o: function outro(local) {
			transition_out(close_1.$$.fragment, local);
			transition_out(minimize_1.$$.fragment, local);
			transition_out(addrinput.$$.fragment, local);
			transition_out(if_block2);
			transition_out(if_block3);
			transition_out(editor_1.$$.fragment, local);
			if (x_popup_intro) x_popup_intro.invalidate();
			x_popup_outro = create_out_transition(x_popup, send$1, { key: /*self*/ ctx[2] });
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(x_popup);
			destroy_component(close_1);
			destroy_component(minimize_1);
			destroy_component(addrinput);
			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
			if (if_block2) if_block2.d();
			if (if_block3) if_block3.d();
			/*editor_1_binding*/ ctx[28](null);
			destroy_component(editor_1);
			if (detaching && x_popup_outro) x_popup_outro.end();
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$e.name,
		type: "if",
		source: "(339:0) {#if self === $current}",
		ctx
	});

	return block;
}

// (358:12) {#if !showCc}
function create_if_block_4$2(ctx) {
	let span;
	let t_value = /*locale*/ ctx[5].compose.labels.cc + "";
	let t;
	let dispose;

	const block = {
		c: function create() {
			span = element("span");
			t = text(t_value);
			attr_dev(span, "class", "svelte-1qf03dz");
			add_location(span, file$U, 358, 14, 7387);
		},
		m: function mount(target, anchor, remount) {
			insert_dev(target, span, anchor);
			append_dev(span, t);
			if (remount) dispose();
			dispose = listen_dev(span, "click", prevent_default(/*click_handler*/ ctx[21]), false, true, false);
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*locale*/ 32 && t_value !== (t_value = /*locale*/ ctx[5].compose.labels.cc + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(span);
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_4$2.name,
		type: "if",
		source: "(358:12) {#if !showCc}",
		ctx
	});

	return block;
}

// (366:12) {#if !showBcc}
function create_if_block_3$3(ctx) {
	let span;
	let t_value = /*locale*/ ctx[5].compose.labels.bcc + "";
	let t;
	let dispose;

	const block = {
		c: function create() {
			span = element("span");
			t = text(t_value);
			attr_dev(span, "class", "svelte-1qf03dz");
			add_location(span, file$U, 366, 14, 7659);
		},
		m: function mount(target, anchor, remount) {
			insert_dev(target, span, anchor);
			append_dev(span, t);
			if (remount) dispose();
			dispose = listen_dev(span, "click", prevent_default(/*click_handler_1*/ ctx[22]), false, true, false);
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*locale*/ 32 && t_value !== (t_value = /*locale*/ ctx[5].compose.labels.bcc + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(span);
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_3$3.name,
		type: "if",
		source: "(366:12) {#if !showBcc}",
		ctx
	});

	return block;
}

// (376:8) {#if showCc}
function create_if_block_2$6(ctx) {
	let label;
	let x_label;
	let t0_value = /*locale*/ ctx[5].compose.labels.cc + "";
	let t0;
	let t1;
	let updating_addrs;
	let updating_input;
	let current;

	function addrinput_addrs_binding_1(value) {
		/*addrinput_addrs_binding_1*/ ctx[23].call(null, value);
	}

	function addrinput_input_binding(value) {
		/*addrinput_input_binding*/ ctx[24].call(null, value);
	}

	let addrinput_props = { name: "cc" };

	if (/*$self*/ ctx[10].cc !== void 0) {
		addrinput_props.addrs = /*$self*/ ctx[10].cc;
	}

	if (/*cc*/ ctx[6] !== void 0) {
		addrinput_props.input = /*cc*/ ctx[6];
	}

	const addrinput = new AddrInput({ props: addrinput_props, $$inline: true });
	binding_callbacks.push(() => bind(addrinput, "addrs", addrinput_addrs_binding_1));
	binding_callbacks.push(() => bind(addrinput, "input", addrinput_input_binding));

	const block = {
		c: function create() {
			label = element("label");
			x_label = element("x-label");
			t0 = text(t0_value);
			t1 = space();
			create_component(addrinput.$$.fragment);
			set_custom_element_data(x_label, "class", "svelte-1qf03dz");
			add_location(x_label, file$U, 377, 12, 8015);
			attr_dev(label, "class", "label-input svelte-1qf03dz");
			add_location(label, file$U, 376, 10, 7975);
		},
		m: function mount(target, anchor) {
			insert_dev(target, label, anchor);
			append_dev(label, x_label);
			append_dev(x_label, t0);
			append_dev(label, t1);
			mount_component(addrinput, label, null);
			current = true;
		},
		p: function update(ctx, dirty) {
			if ((!current || dirty[0] & /*locale*/ 32) && t0_value !== (t0_value = /*locale*/ ctx[5].compose.labels.cc + "")) set_data_dev(t0, t0_value);
			const addrinput_changes = {};

			if (!updating_addrs && dirty[0] & /*$self*/ 1024) {
				updating_addrs = true;
				addrinput_changes.addrs = /*$self*/ ctx[10].cc;
				add_flush_callback(() => updating_addrs = false);
			}

			if (!updating_input && dirty[0] & /*cc*/ 64) {
				updating_input = true;
				addrinput_changes.input = /*cc*/ ctx[6];
				add_flush_callback(() => updating_input = false);
			}

			addrinput.$set(addrinput_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(addrinput.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(addrinput.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(label);
			destroy_component(addrinput);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2$6.name,
		type: "if",
		source: "(376:8) {#if showCc}",
		ctx
	});

	return block;
}

// (382:8) {#if showBcc}
function create_if_block_1$a(ctx) {
	let label;
	let x_label;
	let t0_value = /*locale*/ ctx[5].compose.labels.bcc + "";
	let t0;
	let t1;
	let updating_addrs;
	let updating_input;
	let current;

	function addrinput_addrs_binding_2(value) {
		/*addrinput_addrs_binding_2*/ ctx[25].call(null, value);
	}

	function addrinput_input_binding_1(value) {
		/*addrinput_input_binding_1*/ ctx[26].call(null, value);
	}

	let addrinput_props = { name: "bcc" };

	if (/*$self*/ ctx[10].bcc !== void 0) {
		addrinput_props.addrs = /*$self*/ ctx[10].bcc;
	}

	if (/*bcc*/ ctx[7] !== void 0) {
		addrinput_props.input = /*bcc*/ ctx[7];
	}

	const addrinput = new AddrInput({ props: addrinput_props, $$inline: true });
	binding_callbacks.push(() => bind(addrinput, "addrs", addrinput_addrs_binding_2));
	binding_callbacks.push(() => bind(addrinput, "input", addrinput_input_binding_1));

	const block = {
		c: function create() {
			label = element("label");
			x_label = element("x-label");
			t0 = text(t0_value);
			t1 = space();
			create_component(addrinput.$$.fragment);
			set_custom_element_data(x_label, "class", "svelte-1qf03dz");
			add_location(x_label, file$U, 383, 12, 8242);
			attr_dev(label, "class", "label-input svelte-1qf03dz");
			add_location(label, file$U, 382, 10, 8202);
		},
		m: function mount(target, anchor) {
			insert_dev(target, label, anchor);
			append_dev(label, x_label);
			append_dev(x_label, t0);
			append_dev(label, t1);
			mount_component(addrinput, label, null);
			current = true;
		},
		p: function update(ctx, dirty) {
			if ((!current || dirty[0] & /*locale*/ 32) && t0_value !== (t0_value = /*locale*/ ctx[5].compose.labels.bcc + "")) set_data_dev(t0, t0_value);
			const addrinput_changes = {};

			if (!updating_addrs && dirty[0] & /*$self*/ 1024) {
				updating_addrs = true;
				addrinput_changes.addrs = /*$self*/ ctx[10].bcc;
				add_flush_callback(() => updating_addrs = false);
			}

			if (!updating_input && dirty[0] & /*bcc*/ 128) {
				updating_input = true;
				addrinput_changes.input = /*bcc*/ ctx[7];
				add_flush_callback(() => updating_input = false);
			}

			addrinput.$set(addrinput_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(addrinput.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(addrinput.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(label);
			destroy_component(addrinput);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$a.name,
		type: "if",
		source: "(382:8) {#if showBcc}",
		ctx
	});

	return block;
}

function create_fragment$W(ctx) {
	let if_block_anchor;
	let current;
	let if_block = /*self*/ ctx[2] === /*$current*/ ctx[11] && create_if_block$e(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (/*self*/ ctx[2] === /*$current*/ ctx[11]) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty[0] & /*self, $current*/ 2052) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block$e(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$W.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$W($$self, $$props, $$invalidate) {
	let $self,
		$$unsubscribe_self = noop,
		$$subscribe_self = () => ($$unsubscribe_self(), $$unsubscribe_self = subscribe(self, $$value => $$invalidate(10, $self = $$value)), self);

	let $l;
	let $current;
	validate_store(current, "current");
	component_subscribe($$self, current, $$value => $$invalidate(11, $current = $$value));
	$$self.$$.on_destroy.push(() => $$unsubscribe_self());
	let { self } = $$props;
	validate_store(self, "self");
	$$subscribe_self();
	setContext("compose", { key: self });

	//let html = sanitize($self.html);
	//let saved = clone($self);
	//saved.html = 
	let saved = createPostableDraft($self);

	let { saving = false } = $$props;
	let ms = 3000;
	let timer;

	const saveIf = async () => {
		let current = createPostableDraft($self);

		if (!deepEqual(saved, current)) {
			$$invalidate(14, saving = true);
			const id = await saveDraft($self);
			set_store_value(self, $self.id = id, $self);
			saved = current;
			$$invalidate(14, saving = false);
		}
	};

	onMount(async () => {
		if (!$self.id) {
			set_store_value(self, $self.id = await saveDraft($self), $self);
		}

		timer = setTimeout(
			function fn() {
				saveIf();
				timer = setTimeout(fn, ms);
			},
			ms
		);
	});

	onDestroy(() => {
		clearTimeout(timer);
		saveIf();
	});

	let { showCc = !!$self.cc.length } = $$props;
	let { showBcc = !!$self.bcc.length } = $$props;
	let cc, bcc; // DOM
	let editor; // Component 
	const minimize = () => current.set(null);

	let { close = () => {
		wins.update(w => w.filter(w => w !== self));
		current.set(null);
	} } = $$props;

	const { locale: l } = getContext("app");
	validate_store(l, "l");
	component_subscribe($$self, l, value => $$invalidate(17, $l = value));
	let { locale = $l } = $$props;
	let sending = false;

	const sendMessage = async () => {
		if (sending) return;
		$$invalidate(9, sending = true);

		try {
			await submitDraft($self.id);

			getNotifier().add({
				variant: "success",
				text: locale.notifier.messageSent
			});

			close();
		} catch(e) {
			getNotifier().add({ variant: "error", text: e.message });
		} finally {
			$$invalidate(9, sending = false);
		}
	};

	const writable_props = ["self", "saving", "showCc", "showBcc", "close", "locale"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Compose> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("Compose", $$slots, []);

	function addrinput_addrs_binding(value) {
		$self.to = value;
		self.set($self);
	}

	const click_handler = () => {
		$$invalidate(0, showCc = true);

		setTimeout(
			() => {
				cc && cc.focus();
			},
			1
		);
	};

	const click_handler_1 = () => {
		$$invalidate(1, showBcc = true);

		setTimeout(
			() => {
				bcc && bcc.focus();
			},
			1
		);
	};

	function addrinput_addrs_binding_1(value) {
		$self.cc = value;
		self.set($self);
	}

	function addrinput_input_binding(value) {
		cc = value;
		$$invalidate(6, cc);
	}

	function addrinput_addrs_binding_2(value) {
		$self.bcc = value;
		self.set($self);
	}

	function addrinput_input_binding_1(value) {
		bcc = value;
		$$invalidate(7, bcc);
	}

	function input_input_handler() {
		$self.subject = this.value;
		self.set($self);
	}

	function editor_1_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			$$invalidate(8, editor = $$value);
		});
	}

	function editor_1_html_binding(value) {
		$self.html = value;
		self.set($self);
	}

	function editor_1_text_binding(value) {
		$self.text = value;
		self.set($self);
	}

	function editor_1_files_binding(value) {
		$self.files = value;
		self.set($self);
	}

	$$self.$set = $$props => {
		if ("self" in $$props) $$subscribe_self($$invalidate(2, self = $$props.self));
		if ("saving" in $$props) $$invalidate(14, saving = $$props.saving);
		if ("showCc" in $$props) $$invalidate(0, showCc = $$props.showCc);
		if ("showBcc" in $$props) $$invalidate(1, showBcc = $$props.showBcc);
		if ("close" in $$props) $$invalidate(4, close = $$props.close);
		if ("locale" in $$props) $$invalidate(5, locale = $$props.locale);
	};

	$$self.$capture_state = () => ({
		sanitize,
		onMount,
		onDestroy,
		setContext,
		fade,
		Close: WindowClose,
		Minimize: ColorHelper,
		AddrInput,
		deepClone: cloneDeep_1,
		deepEqual,
		current,
		wins,
		send: send$1,
		receive,
		createPostableDraft,
		self,
		saved,
		saving,
		ms,
		timer,
		saveIf,
		showCc,
		showBcc,
		cc,
		bcc,
		editor,
		minimize,
		close,
		Editor,
		getNotifier,
		submitDraft,
		saveDraft,
		getContext,
		l,
		locale,
		sending,
		sendMessage,
		$self,
		$l,
		$current
	});

	$$self.$inject_state = $$props => {
		if ("self" in $$props) $$subscribe_self($$invalidate(2, self = $$props.self));
		if ("saved" in $$props) saved = $$props.saved;
		if ("saving" in $$props) $$invalidate(14, saving = $$props.saving);
		if ("ms" in $$props) ms = $$props.ms;
		if ("timer" in $$props) timer = $$props.timer;
		if ("showCc" in $$props) $$invalidate(0, showCc = $$props.showCc);
		if ("showBcc" in $$props) $$invalidate(1, showBcc = $$props.showBcc);
		if ("cc" in $$props) $$invalidate(6, cc = $$props.cc);
		if ("bcc" in $$props) $$invalidate(7, bcc = $$props.bcc);
		if ("editor" in $$props) $$invalidate(8, editor = $$props.editor);
		if ("close" in $$props) $$invalidate(4, close = $$props.close);
		if ("locale" in $$props) $$invalidate(5, locale = $$props.locale);
		if ("sending" in $$props) $$invalidate(9, sending = $$props.sending);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		showCc,
		showBcc,
		self,
		minimize,
		close,
		locale,
		cc,
		bcc,
		editor,
		sending,
		$self,
		$current,
		l,
		sendMessage,
		saving,
		saved,
		timer,
		$l,
		ms,
		saveIf,
		addrinput_addrs_binding,
		click_handler,
		click_handler_1,
		addrinput_addrs_binding_1,
		addrinput_input_binding,
		addrinput_addrs_binding_2,
		addrinput_input_binding_1,
		input_input_handler,
		editor_1_binding,
		editor_1_html_binding,
		editor_1_text_binding,
		editor_1_files_binding
	];
}

class Compose extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(
			this,
			options,
			instance$W,
			create_fragment$W,
			safe_not_equal,
			{
				self: 2,
				saving: 14,
				showCc: 0,
				showBcc: 1,
				minimize: 3,
				close: 4,
				locale: 5
			},
			[-1, -1]
		);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Compose",
			options,
			id: create_fragment$W.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*self*/ ctx[2] === undefined && !("self" in props)) {
			console.warn("<Compose> was created without expected prop 'self'");
		}
	}

	get self() {
		throw new Error("<Compose>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set self(value) {
		throw new Error("<Compose>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get saving() {
		throw new Error("<Compose>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set saving(value) {
		throw new Error("<Compose>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get showCc() {
		throw new Error("<Compose>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set showCc(value) {
		throw new Error("<Compose>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get showBcc() {
		throw new Error("<Compose>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set showBcc(value) {
		throw new Error("<Compose>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get minimize() {
		return this.$$.ctx[3];
	}

	set minimize(value) {
		throw new Error("<Compose>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get close() {
		throw new Error("<Compose>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set close(value) {
		throw new Error("<Compose>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get locale() {
		throw new Error("<Compose>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set locale(value) {
		throw new Error("<Compose>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src/comp/Compose/Tabs.svelte generated by Svelte v3.21.0 */
const file$V = "src/comp/Compose/Tabs.svelte";

function get_each_context$5(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[10] = list[i];
	return child_ctx;
}

function get_each_context_1$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[10] = list[i];
	return child_ctx;
}

// (98:0) {#if $wins.length}
function create_if_block$f(ctx) {
	let x_tabs;
	let each_blocks_1 = [];
	let each0_lookup = new Map();
	let t0;
	let t1;
	let each_blocks = [];
	let each1_lookup = new Map();
	let each1_anchor;
	let current;
	let each_value_1 = /*$wins*/ ctx[2];
	validate_each_argument(each_value_1);
	const get_key = ctx => /*self*/ ctx[10];
	validate_each_keys(ctx, each_value_1, get_each_context_1$1, get_key);

	for (let i = 0; i < each_value_1.length; i += 1) {
		let child_ctx = get_each_context_1$1(ctx, each_value_1, i);
		let key = get_key(child_ctx);
		each0_lookup.set(key, each_blocks_1[i] = create_each_block_1$1(key, child_ctx));
	}

	let if_block = /*$current*/ ctx[1] && create_if_block_1$b(ctx);
	let each_value = /*$wins*/ ctx[2];
	validate_each_argument(each_value);
	const get_key_1 = ctx => /*self*/ ctx[10];
	validate_each_keys(ctx, each_value, get_each_context$5, get_key_1);

	for (let i = 0; i < each_value.length; i += 1) {
		let child_ctx = get_each_context$5(ctx, each_value, i);
		let key = get_key_1(child_ctx);
		each1_lookup.set(key, each_blocks[i] = create_each_block$5(key, child_ctx));
	}

	const block = {
		c: function create() {
			x_tabs = element("x-tabs");

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].c();
			}

			t0 = space();
			if (if_block) if_block.c();
			t1 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each1_anchor = empty();
			set_custom_element_data(x_tabs, "class", "svelte-lxu5u5");
			add_location(x_tabs, file$V, 98, 2, 1988);
		},
		m: function mount(target, anchor) {
			insert_dev(target, x_tabs, anchor);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].m(x_tabs, null);
			}

			insert_dev(target, t0, anchor);
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, t1, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(target, anchor);
			}

			insert_dev(target, each1_anchor, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (dirty & /*$wins, $current, open, close, locale*/ 31) {
				const each_value_1 = /*$wins*/ ctx[2];
				validate_each_argument(each_value_1);
				group_outros();
				for (let i = 0; i < each_blocks_1.length; i += 1) each_blocks_1[i].r();
				validate_each_keys(ctx, each_value_1, get_each_context_1$1, get_key);
				each_blocks_1 = update_keyed_each(each_blocks_1, dirty, get_key, 1, ctx, each_value_1, each0_lookup, x_tabs, fix_and_outro_and_destroy_block, create_each_block_1$1, null, get_each_context_1$1);
				for (let i = 0; i < each_blocks_1.length; i += 1) each_blocks_1[i].a();
				check_outros();
			}

			if (/*$current*/ ctx[1]) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*$current*/ 2) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block_1$b(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(t1.parentNode, t1);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}

			if (dirty & /*$wins*/ 4) {
				const each_value = /*$wins*/ ctx[2];
				validate_each_argument(each_value);
				group_outros();
				validate_each_keys(ctx, each_value, get_each_context$5, get_key_1);
				each_blocks = update_keyed_each(each_blocks, dirty, get_key_1, 1, ctx, each_value, each1_lookup, each1_anchor.parentNode, outro_and_destroy_block, create_each_block$5, each1_anchor, get_each_context$5);
				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;

			for (let i = 0; i < each_value_1.length; i += 1) {
				transition_in(each_blocks_1[i]);
			}

			transition_in(if_block);

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o: function outro(local) {
			for (let i = 0; i < each_blocks_1.length; i += 1) {
				transition_out(each_blocks_1[i]);
			}

			transition_out(if_block);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(x_tabs);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].d();
			}

			if (detaching) detach_dev(t0);
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(t1);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].d(detaching);
			}

			if (detaching) detach_dev(each1_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$f.name,
		type: "if",
		source: "(98:0) {#if $wins.length}",
		ctx
	});

	return block;
}

// (106:8) {#if $current !== self}
function create_if_block_2$7(ctx) {
	let x_tab_crossfade;
	let x_tab_crossfade_intro;
	let x_tab_crossfade_outro;
	let current;

	const block = {
		c: function create() {
			x_tab_crossfade = element("x-tab-crossfade");
			set_custom_element_data(x_tab_crossfade, "class", "svelte-lxu5u5");
			add_location(x_tab_crossfade, file$V, 106, 10, 2383);
		},
		m: function mount(target, anchor) {
			insert_dev(target, x_tab_crossfade, anchor);
			current = true;
		},
		i: function intro(local) {
			if (current) return;

			if (local) {
				add_render_callback(() => {
					if (x_tab_crossfade_outro) x_tab_crossfade_outro.end(1);
					if (!x_tab_crossfade_intro) x_tab_crossfade_intro = create_in_transition(x_tab_crossfade, receive, { key: /*self*/ ctx[10] });
					x_tab_crossfade_intro.start();
				});
			}

			current = true;
		},
		o: function outro(local) {
			if (x_tab_crossfade_intro) x_tab_crossfade_intro.invalidate();

			if (local) {
				x_tab_crossfade_outro = create_out_transition(x_tab_crossfade, send$1, { key: /*self*/ ctx[10] });
			}

			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(x_tab_crossfade);
			if (detaching && x_tab_crossfade_outro) x_tab_crossfade_outro.end();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2$7.name,
		type: "if",
		source: "(106:8) {#if $current !== self}",
		ctx
	});

	return block;
}

// (100:4) {#each $wins as self (self)}
function create_each_block_1$1(key_1, ctx) {
	let x_tab;
	let x_tab_title;
	let t0_value = /*locale*/ ctx[0].newMessageTitle + "";
	let t0;
	let t1;
	let x_tab_close;
	let t2;
	let t3;
	let x_tab_transition;
	let rect;
	let stop_animation = noop;
	let current;
	let dispose;
	const close_1 = new Close({ $$inline: true });

	function click_handler(...args) {
		return /*click_handler*/ ctx[8](/*self*/ ctx[10], ...args);
	}

	let if_block = /*$current*/ ctx[1] !== /*self*/ ctx[10] && create_if_block_2$7(ctx);

	function click_handler_1(...args) {
		return /*click_handler_1*/ ctx[9](/*self*/ ctx[10], ...args);
	}

	const block = {
		key: key_1,
		first: null,
		c: function create() {
			x_tab = element("x-tab");
			x_tab_title = element("x-tab-title");
			t0 = text(t0_value);
			t1 = space();
			x_tab_close = element("x-tab-close");
			create_component(close_1.$$.fragment);
			t2 = space();
			if (if_block) if_block.c();
			t3 = space();
			set_custom_element_data(x_tab_title, "class", "svelte-lxu5u5");
			add_location(x_tab_title, file$V, 101, 8, 2179);
			set_custom_element_data(x_tab_close, "class", "svelte-lxu5u5");
			add_location(x_tab_close, file$V, 102, 8, 2239);
			set_custom_element_data(x_tab, "class", "svelte-lxu5u5");
			toggle_class(x_tab, "current", /*self*/ ctx[10] === /*$current*/ ctx[1]);
			add_location(x_tab, file$V, 100, 6, 2036);
			this.first = x_tab;
		},
		m: function mount(target, anchor, remount) {
			insert_dev(target, x_tab, anchor);
			append_dev(x_tab, x_tab_title);
			append_dev(x_tab_title, t0);
			append_dev(x_tab, t1);
			append_dev(x_tab, x_tab_close);
			mount_component(close_1, x_tab_close, null);
			append_dev(x_tab, t2);
			if (if_block) if_block.m(x_tab, null);
			append_dev(x_tab, t3);
			current = true;
			if (remount) run_all(dispose);

			dispose = [
				listen_dev(x_tab_close, "click", stop_propagation(click_handler), false, false, true),
				listen_dev(x_tab, "click", click_handler_1, false, false, false)
			];
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			if ((!current || dirty & /*locale*/ 1) && t0_value !== (t0_value = /*locale*/ ctx[0].newMessageTitle + "")) set_data_dev(t0, t0_value);

			if (/*$current*/ ctx[1] !== /*self*/ ctx[10]) {
				if (if_block) {
					if (dirty & /*$current, $wins*/ 6) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block_2$7(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(x_tab, t3);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}

			if (dirty & /*$wins, $current*/ 6) {
				toggle_class(x_tab, "current", /*self*/ ctx[10] === /*$current*/ ctx[1]);
			}
		},
		r: function measure() {
			rect = x_tab.getBoundingClientRect();
		},
		f: function fix() {
			fix_position(x_tab);
			stop_animation();
			add_transform(x_tab, rect);
		},
		a: function animate() {
			stop_animation();
			stop_animation = create_animation(x_tab, rect, flip, { duration: 300 });
		},
		i: function intro(local) {
			if (current) return;
			transition_in(close_1.$$.fragment, local);
			transition_in(if_block);

			add_render_callback(() => {
				if (!x_tab_transition) x_tab_transition = create_bidirectional_transition(x_tab, fade, { duration: 300 }, true);
				x_tab_transition.run(1);
			});

			current = true;
		},
		o: function outro(local) {
			transition_out(close_1.$$.fragment, local);
			transition_out(if_block);
			if (!x_tab_transition) x_tab_transition = create_bidirectional_transition(x_tab, fade, { duration: 300 }, false);
			x_tab_transition.run(0);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(x_tab);
			destroy_component(close_1);
			if (if_block) if_block.d();
			if (detaching && x_tab_transition) x_tab_transition.end();
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_1$1.name,
		type: "each",
		source: "(100:4) {#each $wins as self (self)}",
		ctx
	});

	return block;
}

// (113:2) {#if $current}
function create_if_block_1$b(ctx) {
	let x_overlay;
	let x_overlay_transition;
	let current;
	let dispose;

	const block = {
		c: function create() {
			x_overlay = element("x-overlay");
			add_location(x_overlay, file$V, 113, 4, 2554);
		},
		m: function mount(target, anchor, remount) {
			insert_dev(target, x_overlay, anchor);
			current = true;
			if (remount) dispose();
			dispose = listen_dev(x_overlay, "click", /*minimize*/ ctx[5], false, false, false);
		},
		p: noop,
		i: function intro(local) {
			if (current) return;

			add_render_callback(() => {
				if (!x_overlay_transition) x_overlay_transition = create_bidirectional_transition(x_overlay, fade, { duration: 300 }, true);
				x_overlay_transition.run(1);
			});

			current = true;
		},
		o: function outro(local) {
			if (!x_overlay_transition) x_overlay_transition = create_bidirectional_transition(x_overlay, fade, { duration: 300 }, false);
			x_overlay_transition.run(0);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(x_overlay);
			if (detaching && x_overlay_transition) x_overlay_transition.end();
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$b.name,
		type: "if",
		source: "(113:2) {#if $current}",
		ctx
	});

	return block;
}

// (117:2) {#each $wins as self (self)}
function create_each_block$5(key_1, ctx) {
	let first;
	let current;

	const compose = new Compose({
			props: { self: /*self*/ ctx[10] },
			$$inline: true
		});

	const block = {
		key: key_1,
		first: null,
		c: function create() {
			first = empty();
			create_component(compose.$$.fragment);
			this.first = first;
		},
		m: function mount(target, anchor) {
			insert_dev(target, first, anchor);
			mount_component(compose, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const compose_changes = {};
			if (dirty & /*$wins*/ 4) compose_changes.self = /*self*/ ctx[10];
			compose.$set(compose_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(compose.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(compose.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(first);
			destroy_component(compose, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$5.name,
		type: "each",
		source: "(117:2) {#each $wins as self (self)}",
		ctx
	});

	return block;
}

function create_fragment$X(ctx) {
	let if_block_anchor;
	let current;
	let if_block = /*$wins*/ ctx[2].length && create_if_block$f(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (/*$wins*/ ctx[2].length) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*$wins*/ 4) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block$f(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$X.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$X($$self, $$props, $$invalidate) {
	let $current;
	let $l;
	let $wins;
	validate_store(current, "current");
	component_subscribe($$self, current, $$value => $$invalidate(1, $current = $$value));
	validate_store(wins, "wins");
	component_subscribe($$self, wins, $$value => $$invalidate(2, $wins = $$value));
	const open = self => current.set(self);

	const close = self => {
		if (self === $current) {
			current.set(null);
		}

		wins.update(w => w.filter(w => w !== self));
	};

	let minimize = () => current.set(null);
	const { locale: l } = getContext("app");
	validate_store(l, "l");
	component_subscribe($$self, l, value => $$invalidate(7, $l = value));
	let { locale = $l.compose.tabs } = $$props;
	const writable_props = ["locale"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Tabs> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("Tabs", $$slots, []);
	const click_handler = self => close(self);
	const click_handler_1 = self => open(self);

	$$self.$set = $$props => {
		if ("locale" in $$props) $$invalidate(0, locale = $$props.locale);
	};

	$$self.$capture_state = () => ({
		fade,
		flip,
		Compose,
		wins,
		current,
		send: send$1,
		receive,
		Close,
		open,
		close,
		minimize,
		getContext,
		l,
		locale,
		$current,
		$l,
		$wins
	});

	$$self.$inject_state = $$props => {
		if ("minimize" in $$props) $$invalidate(5, minimize = $$props.minimize);
		if ("locale" in $$props) $$invalidate(0, locale = $$props.locale);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		locale,
		$current,
		$wins,
		open,
		close,
		minimize,
		l,
		$l,
		click_handler,
		click_handler_1
	];
}

class Tabs extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$X, create_fragment$X, safe_not_equal, { locale: 0 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Tabs",
			options,
			id: create_fragment$X.name
		});
	}

	get locale() {
		throw new Error("<Tabs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set locale(value) {
		throw new Error("<Tabs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules/svelte-material-icons/EmailEditOutline.svelte generated by Svelte v3.21.0 */

const file$W = "node_modules/svelte-material-icons/EmailEditOutline.svelte";

function create_fragment$Y(ctx) {
	let svg;
	let path;

	const block = {
		c: function create() {
			svg = svg_element("svg");
			path = svg_element("path");
			attr_dev(path, "d", "M19.07 13.88L13 19.94V22H15.06L21.12 15.93M22.7 13.58L21.42 12.3C21.32 12.19 21.18 12.13 21.04 12.13C20.89 12.14 20.75 12.19 20.65 12.3L19.65 13.3L21.7 15.3L22.7 14.3C22.89 14.1 22.89 13.78 22.7 13.58M11 18H4V8L12 13L20 8V10H22V6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H11V18M20 6L12 11L4 6H20Z");
			attr_dev(path, "fill", /*color*/ ctx[2]);
			add_location(path, file$W, 8, 59, 234);
			attr_dev(svg, "width", /*width*/ ctx[0]);
			attr_dev(svg, "height", /*height*/ ctx[1]);
			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			add_location(svg, file$W, 8, 0, 175);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, svg, anchor);
			append_dev(svg, path);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*color*/ 4) {
				attr_dev(path, "fill", /*color*/ ctx[2]);
			}

			if (dirty & /*width*/ 1) {
				attr_dev(svg, "width", /*width*/ ctx[0]);
			}

			if (dirty & /*height*/ 2) {
				attr_dev(svg, "height", /*height*/ ctx[1]);
			}

			if (dirty & /*viewBox*/ 8) {
				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(svg);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$Y.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$Y($$self, $$props, $$invalidate) {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	const writable_props = ["size", "width", "height", "color", "viewBox"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<EmailEditOutline> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("EmailEditOutline", $$slots, []);

	$$self.$set = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

	$$self.$inject_state = $$props => {
		if ("size" in $$props) $$invalidate(4, size = $$props.size);
		if ("width" in $$props) $$invalidate(0, width = $$props.width);
		if ("height" in $$props) $$invalidate(1, height = $$props.height);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("viewBox" in $$props) $$invalidate(3, viewBox = $$props.viewBox);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [width, height, color, viewBox, size];
}

class EmailEditOutline extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$Y, create_fragment$Y, safe_not_equal, {
			size: 4,
			width: 0,
			height: 1,
			color: 2,
			viewBox: 3
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "EmailEditOutline",
			options,
			id: create_fragment$Y.name
		});
	}

	get size() {
		throw new Error("<EmailEditOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set size(value) {
		throw new Error("<EmailEditOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get width() {
		throw new Error("<EmailEditOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set width(value) {
		throw new Error("<EmailEditOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get height() {
		throw new Error("<EmailEditOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set height(value) {
		throw new Error("<EmailEditOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get color() {
		throw new Error("<EmailEditOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set color(value) {
		throw new Error("<EmailEditOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get viewBox() {
		throw new Error("<EmailEditOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set viewBox(value) {
		throw new Error("<EmailEditOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src/comp/Dashboard/Dashboard.svelte generated by Svelte v3.21.0 */
const file$X = "src/comp/Dashboard/Dashboard.svelte";

// (105:0) {#if $page.path !== "/login"}
function create_if_block$g(ctx) {
	let x_fab;
	let x_fab_transition;
	let current;
	let dispose;

	const button = new xe({
			props: {
				icon: true,
				fab: true,
				$$slots: { default: [create_default_slot$a] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			x_fab = element("x-fab");
			create_component(button.$$.fragment);
			set_custom_element_data(x_fab, "class", "svelte-1jryazc");
			add_location(x_fab, file$X, 105, 2, 2294);
		},
		m: function mount(target, anchor, remount) {
			insert_dev(target, x_fab, anchor);
			mount_component(button, x_fab, null);
			current = true;
			if (remount) dispose();
			dispose = listen_dev(x_fab, "click", /*click_handler*/ ctx[13], false, false, false);
		},
		p: function update(ctx, dirty) {
			const button_changes = {};

			if (dirty & /*$$scope*/ 16384) {
				button_changes.$$scope = { dirty, ctx };
			}

			button.$set(button_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(button.$$.fragment, local);

			add_render_callback(() => {
				if (!x_fab_transition) x_fab_transition = create_bidirectional_transition(x_fab, scale, { duration: 400 }, true);
				x_fab_transition.run(1);
			});

			current = true;
		},
		o: function outro(local) {
			transition_out(button.$$.fragment, local);
			if (!x_fab_transition) x_fab_transition = create_bidirectional_transition(x_fab, scale, { duration: 400 }, false);
			x_fab_transition.run(0);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(x_fab);
			destroy_component(button);
			if (detaching && x_fab_transition) x_fab_transition.end();
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$g.name,
		type: "if",
		source: "(105:0) {#if $page.path !== \\\"/login\\\"}",
		ctx
	});

	return block;
}

// (108:6) <Icon>
function create_default_slot_1$4(ctx) {
	let current;
	const compose = new EmailEditOutline({ $$inline: true });

	const block = {
		c: function create() {
			create_component(compose.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(compose, target, anchor);
			current = true;
		},
		i: function intro(local) {
			if (current) return;
			transition_in(compose.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(compose.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(compose, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_1$4.name,
		type: "slot",
		source: "(108:6) <Icon>",
		ctx
	});

	return block;
}

// (107:4) <Button icon fab>
function create_default_slot$a(ctx) {
	let current;

	const icon = new Le({
			props: {
				$$slots: { default: [create_default_slot_1$4] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(icon.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(icon, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const icon_changes = {};

			if (dirty & /*$$scope*/ 16384) {
				icon_changes.$$scope = { dirty, ctx };
			}

			icon.$set(icon_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(icon.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(icon.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(icon, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$a.name,
		type: "slot",
		source: "(107:4) <Button icon fab>",
		ctx
	});

	return block;
}

function create_fragment$Z(ctx) {
	let x_dashboard;
	let t0;
	let x_center;
	let t1;
	let x_main;
	let x_dashboard_intro;
	let t2;
	let t3;
	let if_block_anchor;
	let current;
	const topbar = new Topbar({ $$inline: true });
	const drawer = new Drawer({ $$inline: true });
	const default_slot_template = /*$$slots*/ ctx[12].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[14], null);
	const tabs = new Tabs({ $$inline: true });
	let if_block = /*$page*/ ctx[0].path !== "/login" && create_if_block$g(ctx);

	const block = {
		c: function create() {
			x_dashboard = element("x-dashboard");
			create_component(topbar.$$.fragment);
			t0 = space();
			x_center = element("x-center");
			create_component(drawer.$$.fragment);
			t1 = space();
			x_main = element("x-main");
			if (default_slot) default_slot.c();
			t2 = space();
			create_component(tabs.$$.fragment);
			t3 = space();
			if (if_block) if_block.c();
			if_block_anchor = empty();
			set_custom_element_data(x_main, "class", "svelte-1jryazc");
			add_location(x_main, file$X, 96, 4, 2185);
			set_custom_element_data(x_center, "class", "svelte-1jryazc");
			add_location(x_center, file$X, 94, 2, 2155);
			set_custom_element_data(x_dashboard, "class", "svelte-1jryazc");
			add_location(x_dashboard, file$X, 92, 0, 2100);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, x_dashboard, anchor);
			mount_component(topbar, x_dashboard, null);
			append_dev(x_dashboard, t0);
			append_dev(x_dashboard, x_center);
			mount_component(drawer, x_center, null);
			append_dev(x_center, t1);
			append_dev(x_center, x_main);

			if (default_slot) {
				default_slot.m(x_main, null);
			}

			insert_dev(target, t2, anchor);
			mount_component(tabs, target, anchor);
			insert_dev(target, t3, anchor);
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (default_slot) {
				if (default_slot.p && dirty & /*$$scope*/ 16384) {
					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[14], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[14], dirty, null));
				}
			}

			if (/*$page*/ ctx[0].path !== "/login") {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*$page*/ 1) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block$g(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(topbar.$$.fragment, local);
			transition_in(drawer.$$.fragment, local);
			transition_in(default_slot, local);

			if (!x_dashboard_intro) {
				add_render_callback(() => {
					x_dashboard_intro = create_in_transition(x_dashboard, fade, { duration: 300 });
					x_dashboard_intro.start();
				});
			}

			transition_in(tabs.$$.fragment, local);
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(topbar.$$.fragment, local);
			transition_out(drawer.$$.fragment, local);
			transition_out(default_slot, local);
			transition_out(tabs.$$.fragment, local);
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(x_dashboard);
			destroy_component(topbar);
			destroy_component(drawer);
			if (default_slot) default_slot.d(detaching);
			if (detaching) detach_dev(t2);
			destroy_component(tabs, detaching);
			if (detaching) detach_dev(t3);
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$Z.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$Z($$self, $$props, $$invalidate) {
	let $isMobile;
	let $drawerOpenMobile;
	let $drawerOpenDesktop;
	let $page;
	const drawerOpenMobile = writable(false);
	validate_store(drawerOpenMobile, "drawerOpenMobile");
	component_subscribe($$self, drawerOpenMobile, value => $$invalidate(7, $drawerOpenMobile = value));
	const drawerOpenDesktop = writable(true);
	validate_store(drawerOpenDesktop, "drawerOpenDesktop");
	component_subscribe($$self, drawerOpenDesktop, value => $$invalidate(8, $drawerOpenDesktop = value));
	const media = matchMedia("screen and (max-width: 768px)");
	const isMobile = writable(media.matches);
	validate_store(isMobile, "isMobile");
	component_subscribe($$self, isMobile, value => $$invalidate(6, $isMobile = value));

	media.onchange = () => {
		isMobile.set(media.matches);
	};

	const toggleDrawer = () => {
		if ($isMobile) {
			if ($drawerOpenMobile) {
				set_store_value(drawerOpenMobile, $drawerOpenMobile = false);
			} else {
				set_store_value(drawerOpenMobile, $drawerOpenMobile = true);
				set_store_value(drawerOpenDesktop, $drawerOpenDesktop = true);
			}
		} else {
			if ($drawerOpenDesktop) {
				set_store_value(drawerOpenDesktop, $drawerOpenDesktop = false);
				set_store_value(drawerOpenMobile, $drawerOpenMobile = false);
			} else {
				set_store_value(drawerOpenDesktop, $drawerOpenDesktop = true);
			}
		}
	};

	const custom = (node, { duration = 400 }) => {
		return {
			duration,
			easing: quadOut,
			css: (t, u) => `\
        transform: scale(${0.95 + t * 0.05});\
        opacity: ${t};\
        `
		};
	};

	const { page } = getContext("router");
	validate_store(page, "page");
	component_subscribe($$self, page, value => $$invalidate(0, $page = value));
	const hasDrawer = derived(page, page => page.path !== "/login");

	setContext("dash", {
		toggleDrawer,
		isMobile,
		drawerOpenMobile,
		drawerOpenDesktop,
		hasDrawer
	});

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Dashboard> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("Dashboard", $$slots, ['default']);
	const click_handler = async () => create();

	$$self.$set = $$props => {
		if ("$$scope" in $$props) $$invalidate(14, $$scope = $$props.$$scope);
	};

	$$self.$capture_state = () => ({
		getContext,
		setContext,
		writable,
		derived,
		Topbar,
		Drawer,
		Tabs,
		drawerOpenMobile,
		drawerOpenDesktop,
		media,
		isMobile,
		toggleDrawer,
		scale,
		fade,
		quadOut,
		custom,
		page,
		hasDrawer,
		Button: xe,
		Icon: Le,
		Compose: EmailEditOutline,
		create,
		createDraft,
		$isMobile,
		$drawerOpenMobile,
		$drawerOpenDesktop,
		$page
	});

	return [
		$page,
		drawerOpenMobile,
		drawerOpenDesktop,
		isMobile,
		page,
		media,
		$isMobile,
		$drawerOpenMobile,
		$drawerOpenDesktop,
		toggleDrawer,
		custom,
		hasDrawer,
		$$slots,
		click_handler,
		$$scope
	];
}

class Dashboard extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$Z, create_fragment$Z, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Dashboard",
			options,
			id: create_fragment$Z.name
		});
	}
}

/* src/lib/router/Router.svelte generated by Svelte v3.21.0 */

function get_each_context$6(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[7] = list[i];
	return child_ctx;
}

// (11:0) {:else}
function create_else_block$3(ctx) {
	let current;
	const default_slot_template = /*$$slots*/ ctx[6].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

	const block = {
		c: function create() {
			if (default_slot) default_slot.c();
		},
		m: function mount(target, anchor) {
			if (default_slot) {
				default_slot.m(target, anchor);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (default_slot) {
				if (default_slot.p && dirty & /*$$scope*/ 32) {
					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[5], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null));
				}
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (default_slot) default_slot.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block$3.name,
		type: "else",
		source: "(11:0) {:else}",
		ctx
	});

	return block;
}

// (7:0) {#if $render}
function create_if_block$h(ctx) {
	let each_blocks = [];
	let each_1_lookup = new Map();
	let each_1_anchor;
	let current;
	let each_value = [0];
	validate_each_argument(each_value);
	const get_key = ctx => /*$page*/ ctx[3].path;
	validate_each_keys(ctx, each_value, get_each_context$6, get_key);

	for (let i = 0; i < 1; i += 1) {
		let child_ctx = get_each_context$6(ctx, each_value, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block$6(key, child_ctx));
	}

	const block = {
		c: function create() {
			for (let i = 0; i < 1; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		m: function mount(target, anchor) {
			for (let i = 0; i < 1; i += 1) {
				each_blocks[i].m(target, anchor);
			}

			insert_dev(target, each_1_anchor, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (dirty & /*$render*/ 4) {
				const each_value = [0];
				validate_each_argument(each_value);
				group_outros();
				validate_each_keys(ctx, each_value, get_each_context$6, get_key);
				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block$6, each_1_anchor, get_each_context$6);
				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;

			for (let i = 0; i < 1; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o: function outro(local) {
			for (let i = 0; i < 1; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d: function destroy(detaching) {
			for (let i = 0; i < 1; i += 1) {
				each_blocks[i].d(detaching);
			}

			if (detaching) detach_dev(each_1_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$h.name,
		type: "if",
		source: "(7:0) {#if $render}",
		ctx
	});

	return block;
}

// (8:2) {#each [0] as _ ($page.path)}
function create_each_block$6(key_1, ctx) {
	let first;
	let switch_instance_anchor;
	let current;
	const switch_instance_spread_levels = [/*$render*/ ctx[2].args || {}];
	var switch_value = /*$render*/ ctx[2].component;

	function switch_props(ctx) {
		let switch_instance_props = {};

		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
		}

		return {
			props: switch_instance_props,
			$$inline: true
		};
	}

	if (switch_value) {
		var switch_instance = new switch_value(switch_props());
	}

	const block = {
		key: key_1,
		first: null,
		c: function create() {
			first = empty();
			if (switch_instance) create_component(switch_instance.$$.fragment);
			switch_instance_anchor = empty();
			this.first = first;
		},
		m: function mount(target, anchor) {
			insert_dev(target, first, anchor);

			if (switch_instance) {
				mount_component(switch_instance, target, anchor);
			}

			insert_dev(target, switch_instance_anchor, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const switch_instance_changes = (dirty & /*$render*/ 4)
			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*$render*/ ctx[2].args || {})])
			: {};

			if (switch_value !== (switch_value = /*$render*/ ctx[2].component)) {
				if (switch_instance) {
					group_outros();
					const old_component = switch_instance;

					transition_out(old_component.$$.fragment, 1, 0, () => {
						destroy_component(old_component, 1);
					});

					check_outros();
				}

				if (switch_value) {
					switch_instance = new switch_value(switch_props());
					create_component(switch_instance.$$.fragment);
					transition_in(switch_instance.$$.fragment, 1);
					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
				} else {
					switch_instance = null;
				}
			} else if (switch_value) {
				switch_instance.$set(switch_instance_changes);
			}
		},
		i: function intro(local) {
			if (current) return;
			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(first);
			if (detaching) detach_dev(switch_instance_anchor);
			if (switch_instance) destroy_component(switch_instance, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$6.name,
		type: "each",
		source: "(8:2) {#each [0] as _ ($page.path)}",
		ctx
	});

	return block;
}

function create_fragment$_(ctx) {
	let current_block_type_index;
	let if_block;
	let if_block_anchor;
	let current;
	const if_block_creators = [create_if_block$h, create_else_block$3];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*$render*/ ctx[2]) return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	const block = {
		c: function create() {
			if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if_blocks[current_block_type_index].m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				}

				transition_in(if_block, 1);
				if_block.m(if_block_anchor.parentNode, if_block_anchor);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if_blocks[current_block_type_index].d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$_.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$_($$self, $$props, $$invalidate) {
	let $render,
		$$unsubscribe_render = noop,
		$$subscribe_render = () => ($$unsubscribe_render(), $$unsubscribe_render = subscribe(render, $$value => $$invalidate(2, $render = $$value)), render);

	let $page,
		$$unsubscribe_page = noop,
		$$subscribe_page = () => ($$unsubscribe_page(), $$unsubscribe_page = subscribe(page, $$value => $$invalidate(3, $page = $$value)), page);

	$$self.$$.on_destroy.push(() => $$unsubscribe_render());
	$$self.$$.on_destroy.push(() => $$unsubscribe_page());
	let { router } = $$props;
	const writable_props = ["router"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Router> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("Router", $$slots, ['default']);

	$$self.$set = $$props => {
		if ("router" in $$props) $$invalidate(4, router = $$props.router);
		if ("$$scope" in $$props) $$invalidate(5, $$scope = $$props.$$scope);
	};

	$$self.$capture_state = () => ({ router, render, page, $render, $page });

	$$self.$inject_state = $$props => {
		if ("router" in $$props) $$invalidate(4, router = $$props.router);
		if ("render" in $$props) $$subscribe_render($$invalidate(0, render = $$props.render));
		if ("page" in $$props) $$subscribe_page($$invalidate(1, page = $$props.page));
	};

	let render;
	let page;

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*router*/ 16) {
			 $$subscribe_render($$invalidate(0, render = router._render));
		}

		if ($$self.$$.dirty & /*router*/ 16) {
			 $$subscribe_page($$invalidate(1, page = router.page));
		}
	};

	return [render, page, $render, $page, router, $$scope, $$slots];
}

class Router extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$_, create_fragment$_, safe_not_equal, { router: 4 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Router",
			options,
			id: create_fragment$_.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*router*/ ctx[4] === undefined && !("router" in props)) {
			console.warn("<Router> was created without expected prop 'router'");
		}
	}

	get router() {
		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set router(value) {
		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src/App.svelte generated by Svelte v3.21.0 */

// (15:0) <Dashboard>
function create_default_slot$b(ctx) {
	let current;

	const router_1 = new Router({
			props: { router: /*router*/ ctx[0] },
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(router_1.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(router_1, target, anchor);
			current = true;
		},
		p: noop,
		i: function intro(local) {
			if (current) return;
			transition_in(router_1.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(router_1.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(router_1, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$b.name,
		type: "slot",
		source: "(15:0) <Dashboard>",
		ctx
	});

	return block;
}

function create_fragment$$(ctx) {
	let current;

	const dashboard = new Dashboard({
			props: {
				$$slots: { default: [create_default_slot$b] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(dashboard.$$.fragment);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			mount_component(dashboard, target, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const dashboard_changes = {};

			if (dirty & /*$$scope*/ 8) {
				dashboard_changes.$$scope = { dirty, ctx };
			}

			dashboard.$set(dashboard_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(dashboard.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(dashboard.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(dashboard, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$$.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$$($$self, $$props, $$invalidate) {
	let { app } = $$props;
	const { session, router } = app;
	setContext("app", app);
	setContext("session", session);
	setContext("router", router);
	const writable_props = ["app"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("App", $$slots, []);

	$$self.$set = $$props => {
		if ("app" in $$props) $$invalidate(1, app = $$props.app);
	};

	$$self.$capture_state = () => ({
		setContext,
		Dashboard,
		Router,
		app,
		session,
		router
	});

	$$self.$inject_state = $$props => {
		if ("app" in $$props) $$invalidate(1, app = $$props.app);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [router, app];
}

class App extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$$, create_fragment$$, safe_not_equal, { app: 1 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "App",
			options,
			id: create_fragment$$.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*app*/ ctx[1] === undefined && !("app" in props)) {
			console.warn("<App> was created without expected prop 'app'");
		}
	}

	get app() {
		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set app(value) {
		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/**
 * Tokenize input string.
 */
function lexer(str) {
    var tokens = [];
    var i = 0;
    while (i < str.length) {
        var char = str[i];
        if (char === "*" || char === "+" || char === "?") {
            tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
            continue;
        }
        if (char === "\\") {
            tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
            continue;
        }
        if (char === "{") {
            tokens.push({ type: "OPEN", index: i, value: str[i++] });
            continue;
        }
        if (char === "}") {
            tokens.push({ type: "CLOSE", index: i, value: str[i++] });
            continue;
        }
        if (char === ":") {
            var name = "";
            var j = i + 1;
            while (j < str.length) {
                var code = str.charCodeAt(j);
                if (
                // `0-9`
                (code >= 48 && code <= 57) ||
                    // `A-Z`
                    (code >= 65 && code <= 90) ||
                    // `a-z`
                    (code >= 97 && code <= 122) ||
                    // `_`
                    code === 95) {
                    name += str[j++];
                    continue;
                }
                break;
            }
            if (!name)
                throw new TypeError("Missing parameter name at " + i);
            tokens.push({ type: "NAME", index: i, value: name });
            i = j;
            continue;
        }
        if (char === "(") {
            var count = 1;
            var pattern = "";
            var j = i + 1;
            if (str[j] === "?") {
                throw new TypeError("Pattern cannot start with \"?\" at " + j);
            }
            while (j < str.length) {
                if (str[j] === "\\") {
                    pattern += str[j++] + str[j++];
                    continue;
                }
                if (str[j] === ")") {
                    count--;
                    if (count === 0) {
                        j++;
                        break;
                    }
                }
                else if (str[j] === "(") {
                    count++;
                    if (str[j + 1] !== "?") {
                        throw new TypeError("Capturing groups are not allowed at " + j);
                    }
                }
                pattern += str[j++];
            }
            if (count)
                throw new TypeError("Unbalanced pattern at " + i);
            if (!pattern)
                throw new TypeError("Missing pattern at " + i);
            tokens.push({ type: "PATTERN", index: i, value: pattern });
            i = j;
            continue;
        }
        tokens.push({ type: "CHAR", index: i, value: str[i++] });
    }
    tokens.push({ type: "END", index: i, value: "" });
    return tokens;
}
/**
 * Parse a string for the raw tokens.
 */
function parse(str, options) {
    if (options === void 0) { options = {}; }
    var tokens = lexer(str);
    var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a;
    var defaultPattern = "[^" + escapeString(options.delimiter || "/#?") + "]+?";
    var result = [];
    var key = 0;
    var i = 0;
    var path = "";
    var tryConsume = function (type) {
        if (i < tokens.length && tokens[i].type === type)
            return tokens[i++].value;
    };
    var mustConsume = function (type) {
        var value = tryConsume(type);
        if (value !== undefined)
            return value;
        var _a = tokens[i], nextType = _a.type, index = _a.index;
        throw new TypeError("Unexpected " + nextType + " at " + index + ", expected " + type);
    };
    var consumeText = function () {
        var result = "";
        var value;
        // tslint:disable-next-line
        while ((value = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR"))) {
            result += value;
        }
        return result;
    };
    while (i < tokens.length) {
        var char = tryConsume("CHAR");
        var name = tryConsume("NAME");
        var pattern = tryConsume("PATTERN");
        if (name || pattern) {
            var prefix = char || "";
            if (prefixes.indexOf(prefix) === -1) {
                path += prefix;
                prefix = "";
            }
            if (path) {
                result.push(path);
                path = "";
            }
            result.push({
                name: name || key++,
                prefix: prefix,
                suffix: "",
                pattern: pattern || defaultPattern,
                modifier: tryConsume("MODIFIER") || ""
            });
            continue;
        }
        var value = char || tryConsume("ESCAPED_CHAR");
        if (value) {
            path += value;
            continue;
        }
        if (path) {
            result.push(path);
            path = "";
        }
        var open = tryConsume("OPEN");
        if (open) {
            var prefix = consumeText();
            var name_1 = tryConsume("NAME") || "";
            var pattern_1 = tryConsume("PATTERN") || "";
            var suffix = consumeText();
            mustConsume("CLOSE");
            result.push({
                name: name_1 || (pattern_1 ? key++ : ""),
                pattern: name_1 && !pattern_1 ? defaultPattern : pattern_1,
                prefix: prefix,
                suffix: suffix,
                modifier: tryConsume("MODIFIER") || ""
            });
            continue;
        }
        mustConsume("END");
    }
    return result;
}
/**
 * Create path match function from `path-to-regexp` spec.
 */
function match$1(str, options) {
    var keys = [];
    var re = pathToRegexp(str, keys, options);
    return regexpToFunction(re, keys, options);
}
/**
 * Create a path match function from `path-to-regexp` output.
 */
function regexpToFunction(re, keys, options) {
    if (options === void 0) { options = {}; }
    var _a = options.decode, decode = _a === void 0 ? function (x) { return x; } : _a;
    return function (pathname) {
        var m = re.exec(pathname);
        if (!m)
            return false;
        var path = m[0], index = m.index;
        var params = Object.create(null);
        var _loop_1 = function (i) {
            // tslint:disable-next-line
            if (m[i] === undefined)
                return "continue";
            var key = keys[i - 1];
            if (key.modifier === "*" || key.modifier === "+") {
                params[key.name] = m[i].split(key.prefix + key.suffix).map(function (value) {
                    return decode(value, key);
                });
            }
            else {
                params[key.name] = decode(m[i], key);
            }
        };
        for (var i = 1; i < m.length; i++) {
            _loop_1(i);
        }
        return { path: path, index: index, params: params };
    };
}
/**
 * Escape a regular expression string.
 */
function escapeString(str) {
    return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
/**
 * Get the flags for a regexp from the options.
 */
function flags(options) {
    return options && options.sensitive ? "" : "i";
}
/**
 * Pull out keys from a regexp.
 */
function regexpToRegexp(path, keys) {
    if (!keys)
        return path;
    // Use a negative lookahead to match only capturing groups.
    var groups = path.source.match(/\((?!\?)/g);
    if (groups) {
        for (var i = 0; i < groups.length; i++) {
            keys.push({
                name: i,
                prefix: "",
                suffix: "",
                modifier: "",
                pattern: ""
            });
        }
    }
    return path;
}
/**
 * Transform an array into a regexp.
 */
function arrayToRegexp(paths, keys, options) {
    var parts = paths.map(function (path) { return pathToRegexp(path, keys, options).source; });
    return new RegExp("(?:" + parts.join("|") + ")", flags(options));
}
/**
 * Create a path regexp from string input.
 */
function stringToRegexp(path, keys, options) {
    return tokensToRegexp(parse(path, options), keys, options);
}
/**
 * Expose a function for taking tokens and returning a RegExp.
 */
function tokensToRegexp(tokens, keys, options) {
    if (options === void 0) { options = {}; }
    var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function (x) { return x; } : _d;
    var endsWith = "[" + escapeString(options.endsWith || "") + "]|$";
    var delimiter = "[" + escapeString(options.delimiter || "/#?") + "]";
    var route = start ? "^" : "";
    // Iterate over the tokens and create our regexp string.
    for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
        var token = tokens_1[_i];
        if (typeof token === "string") {
            route += escapeString(encode(token));
        }
        else {
            var prefix = escapeString(encode(token.prefix));
            var suffix = escapeString(encode(token.suffix));
            if (token.pattern) {
                if (keys)
                    keys.push(token);
                if (prefix || suffix) {
                    if (token.modifier === "+" || token.modifier === "*") {
                        var mod = token.modifier === "*" ? "?" : "";
                        route += "(?:" + prefix + "((?:" + token.pattern + ")(?:" + suffix + prefix + "(?:" + token.pattern + "))*)" + suffix + ")" + mod;
                    }
                    else {
                        route += "(?:" + prefix + "(" + token.pattern + ")" + suffix + ")" + token.modifier;
                    }
                }
                else {
                    route += "(" + token.pattern + ")" + token.modifier;
                }
            }
            else {
                route += "(?:" + prefix + suffix + ")" + token.modifier;
            }
        }
    }
    if (end) {
        if (!strict)
            route += delimiter + "?";
        route += !options.endsWith ? "$" : "(?=" + endsWith + ")";
    }
    else {
        var endToken = tokens[tokens.length - 1];
        var isEndDelimited = typeof endToken === "string"
            ? delimiter.indexOf(endToken[endToken.length - 1]) > -1
            : // tslint:disable-next-line
                endToken === undefined;
        if (!strict) {
            route += "(?:" + delimiter + "(?=" + endsWith + "))?";
        }
        if (!isEndDelimited) {
            route += "(?=" + delimiter + "|" + endsWith + ")";
        }
    }
    return new RegExp(route, flags(options));
}
/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 */
function pathToRegexp(path, keys, options) {
    if (path instanceof RegExp)
        return regexpToRegexp(path, keys);
    if (Array.isArray(path))
        return arrayToRegexp(path, keys, options);
    return stringToRegexp(path, keys, options);
}
//# sourceMappingURL=index.js.map

const createRouter = (inp = {}, session = writable(null), { dev = true } = { dev: true }) => {
    const routes = [];
    const page = writable(null);
    const _render = writable(null);
    const hash = writable(location.hash);
    const add = (url, get) => {
        routes.push({
            get,
            match: match$1(url)
        });
    };
    for (const [path, component] of Object.entries(inp)) {
        add(path, component);
    }
    const match = (path) => {
        for (const route of routes) {
            const match = route.match(path);
            if (match) {
                return {
                    params: match.params,
                    get: route.get,
                };
            }
        }
        return null;
    };
    const start = () => new Promise(resolve => {
        hash.subscribe(async () => {
            console.log("[ROUTER] [HASHCHANGE]", location.hash);
            const h = location.hash;
            const hash = h.replace(/^#!?\//, "/") || "/";
            const url = new URL(hash, location.href);
            const path = url.pathname;
            const query = Object.create(null);
            const host = url.host;
            url.searchParams.forEach(([key, value]) => {
                if (query[key] == null) {
                    query[key] = value;
                }
                else if (query[key] instanceof Array) {
                    query[key].push(value);
                }
                else {
                    query[key] = [query[key], value];
                }
            });
            const m = match(path);
            for (const route of routes) {
                const m = route.match(path);
                if (!m)
                    continue;
                const { params } = m;
                const { get } = route;
                const { preload, default: component } = await get();
                let args = params;
                if (preload) {
                    let redirected = false;
                    let errored = false;
                    let nexted = false;
                    const redirect = (code, url) => {
                        redirected = true;
                        location.hash = url || String(code);
                    };
                    const error = (args) => {
                        errored = true;
                    };
                    const next = () => {
                        nexted = true;
                    };
                    args = await preload.call({ redirect, error, next, fetch }, { path, host, params, query }, session.get());
                    if (redirected) {
                        return;
                    }
                    else if (errored) {
                        return;
                    }
                    else if (nexted) {
                        continue;
                    }
                }
                page.set({ path, query, host, params });
                _render.set({ component, args });
                return resolve();
            }
            page.set({ path, query, host, params: {} });
            _render.set(null);
            resolve();
        });
        window.onhashchange = () => hash.set(location.hash);
    });
    const link = (node) => {
        node.onclick = (event) => {
            if (event.defaultPrevented)
                return;
            if (event.ctrlKey)
                return;
            if (node.host !== location.host)
                return;
            else {
                event.preventDefault();
            }
        };
    };
    return { start, add, match, page, hash, _render, link };
};

/*
import * as Mailbox from "./Mailbox.svelte";
import * as Message from "./Message.svelte"
import * as Error404 from "./404.svelte"
import * as Login from "./Login.svelte"
import * as Index from "./Index.svelte"
import * as Compose from "./Compose.svelte"
*/
/*
export const routes = {
  "/": () => import("./Index.svelte"),
  "/mailbox/:mailbox": () => import("./Mailbox.svelte"),
  "/mailbox/:mailbox/message/:message": () => import("./Message.svelte"),
  "/compose": () => import("./Compose.svelte"),
  "(.*)": () => import("./404.svelte"),
}
*/
const routes = {
    "/": () => import('./Index-8dc8b58e.js'),
    "/login": () => import('./Login-82efa600.js'),
    "/mailbox/:mailbox": () => import('./Mailbox-ef8f752b.js'),
    "/mailbox/:mailbox/message/:message": () => import('./Message-8f72c84d.js'),
    "/storage": () => import('./Storage-0840f14c.js'),
    "(.*)": () => import('./404-5e11d75e.js')
};

var stringFormat = createCommonjsModule(function (module) {
void function(global) {

  //  ValueError :: String -> Error
  function ValueError(message) {
    var err = new Error(message);
    err.name = 'ValueError';
    return err;
  }

  //  create :: Object -> String,*... -> String
  function create(transformers) {
    return function(template) {
      var args = Array.prototype.slice.call(arguments, 1);
      var idx = 0;
      var state = 'UNDEFINED';

      return template.replace(
        /([{}])\1|[{](.*?)(?:!(.+?))?[}]/g,
        function(match, literal, _key, xf) {
          if (literal != null) {
            return literal;
          }
          var key = _key;
          if (key.length > 0) {
            if (state === 'IMPLICIT') {
              throw ValueError('cannot switch from ' +
                               'implicit to explicit numbering');
            }
            state = 'EXPLICIT';
          } else {
            if (state === 'EXPLICIT') {
              throw ValueError('cannot switch from ' +
                               'explicit to implicit numbering');
            }
            state = 'IMPLICIT';
            key = String(idx);
            idx += 1;
          }

          //  1.  Split the key into a lookup path.
          //  2.  If the first path component is not an index, prepend '0'.
          //  3.  Reduce the lookup path to a single result. If the lookup
          //      succeeds the result is a singleton array containing the
          //      value at the lookup path; otherwise the result is [].
          //  4.  Unwrap the result by reducing with '' as the default value.
          var path = key.split('.');
          var value = (/^\d+$/.test(path[0]) ? path : ['0'].concat(path))
            .reduce(function(maybe, key) {
              return maybe.reduce(function(_, x) {
                return x != null && key in Object(x) ?
                  [typeof x[key] === 'function' ? x[key]() : x[key]] :
                  [];
              }, []);
            }, [args])
            .reduce(function(_, x) { return x; }, '');

          if (xf == null) {
            return value;
          } else if (Object.prototype.hasOwnProperty.call(transformers, xf)) {
            return transformers[xf](value);
          } else {
            throw ValueError('no transformer named "' + xf + '"');
          }
        }
      );
    };
  }

  //  format :: String,*... -> String
  var format = create({});

  //  format.create :: Object -> String,*... -> String
  format.create = create;

  //  format.extend :: Object,Object -> ()
  format.extend = function(prototype, transformers) {
    var $format = create(transformers);
    prototype.format = function() {
      var args = Array.prototype.slice.call(arguments);
      args.unshift(this);
      return $format.apply(global, args);
    };
  };

  /* istanbul ignore else */
  {
    module.exports = format;
  }

}.call(commonjsGlobal, commonjsGlobal);
});

const Trans = (locale) => {
    const flatted = Object.create(null);
    const add = (parent, object) => {
        for (const [key, value] of Object.entries(object)) {
            const flattedKey = parent == null ? key : `${parent}.${key}`;
            if (typeof value === "string" || value instanceof Array) {
                flatted[flattedKey] = value;
            }
            else {
                add(flattedKey, value);
            }
        }
    };
    add(null, locale);
    return (key, params = {}) => {
        let template = flatted[key];
        if (template == null) {
            // this should never happen
            console.warn("[i18n] Unexistent locale key: " + key);
            return "";
        }
        if (template instanceof Array) {
            const n = params.n || 0;
            if (template.length === 2) {
                template = n === 1 ? template[1] : template[0];
            }
            else if (template.length === 3) {
                if (n === 0 || n === 1) {
                    template = template[n];
                }
                else {
                    template = template[2];
                }
            }
            else {
                template = template[n] != null ? template[n] : template[template.length - 1];
            }
        }
        return stringFormat(template, params);
    };
};

let app = null;
const getApp = () => {
    if (app == null) {
        app = createApp();
    }
    return app;
};
const createApp = async () => {
    const $locale = window.__RAVEN__.locale;
    const locale = writable($locale);
    const trans = writable(Trans($locale));
    locale.subscribe($locale => {
        trans.set(Trans($locale));
    }, false);
    const session = writable({});
    await ready.then(() => {
        return load();
    }).catch(() => {
        location.replace("#!/login");
    });
    const router = createRouter(routes, session);
    await router.start();
    return { session, router, trans: readonly(trans), locale: readonly(locale) };
};

async function main() {
    const app = await getApp();
    document.body.innerHTML = "";
    new App({
        target: document.body,
        props: { app },
        intro: true,
    });
}
main();

export { messages as $, group_outros as A, Button as B, transition_out as C, check_outros as D, transition_in as E, destroy_component as F, bubble as G, globals as H, xe as I, getContext as J, validate_store as K, component_subscribe as L, getNotifier as M, login as N, text as O, set_data_dev as P, writable as Q, ge as R, SvelteComponentDev as S, TextField as T, subscribe as U, onDestroy as V, slide as W, fly as X, create as Y, drafts as Z, sent as _, init as a, set_custom_element_data as a0, toggle_class as a1, stop_propagation as a2, flag as a3, getDraft as a4, setContext as a5, onMount as a6, fade as a7, flip as a8, DeleteOutline as a9, others as aA, createEventDispatcher as aB, moveTo as aC, Nn as aD, Menu$1 as aE, destroy_each as aF, Paperclip as aG, url as aH, sanitize as aI, mailboxes as aJ, createReply as aK, createForward as aL, HtmlTag as aM, _get$1 as aN, get as aO, AlertDecagramOutline as aa, CircularProgress as ab, junk as ac, trash as ad, list as ae, quadOut as af, mailboxMeta as ag, validate_each_argument as ah, validate_each_keys as ai, updateSeen as aj, markAsSpam as ak, _del as al, next as am, set_store_value as an, empty as ao, add_render_callback as ap, create_in_transition as aq, create_out_transition as ar, update_keyed_each as as, create_bidirectional_transition as at, set_style as au, outro_and_destroy_block as av, _get as aw, create_slot as ax, get_slot_context as ay, get_slot_changes as az, svg_element as b, attr_dev as c, dispatch_dev as d, add_location as e, insert_dev as f, append_dev as g, detach_dev as h, inbox as i, assign as j, binding_callbacks as k, bind as l, element as m, noop as n, create_component as o, space as p, mount_component as q, run_all as r, safe_not_equal as s, listen_dev as t, user as u, validate_slots as v, prevent_default as w, get_spread_update as x, get_spread_object as y, add_flush_callback as z };
//# sourceMappingURL=main-048546a6.js.map
