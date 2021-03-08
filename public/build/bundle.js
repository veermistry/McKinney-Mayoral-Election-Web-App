
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
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
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
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
    function self(fn) {
        return function (event) {
            // @ts-ignore
            if (event.target === this)
                fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
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
    function add_render_callback(fn) {
        render_callbacks.push(fn);
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
            set_current_component(null);
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
    const outroing = new Set();
    let outros;
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

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
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
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
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
    /**
     * Base class for Svelte components. Used when dev=false.
     */
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
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.32.3' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
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
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    var locations = [
    	{
    		ID: 1,
    		Type: "Both",
    		Name: "Anna ISD Administration Building",
    		Room: "Board Conference Room",
    		"Street Address": "201 E 7th Street",
    		City: "Anna",
    		State: "TX",
    		Zip: "75049",
    		Longitude: "33.346207",
    		Latitude: "-96.547211",
    		MapsLink: "https://www.google.com/maps/place/201+E+7th+St,+Anna,+TX+75409/@33.3459207,-96.549416,17z/data=!3m1!4b1!4m5!3m4!1s0x864c722569d27345:0x9946be998630d896!8m2!3d33.3459207!4d-96.5472327"
    	},
    	{
    		ID: 2,
    		Type: "Election Day",
    		Name: "Blue Ridge ISD Administration",
    		Room: "Board Room",
    		"Street Address": "318 West School Street",
    		City: "Blue Ridge",
    		State: "TX",
    		Zip: "75424",
    		Longitude: "33.30546",
    		Latitude: "-96.40425",
    		MapsLink: "https://www.google.com/maps/place/318+School+St,+Blue+Ridge,+TX+75424/@33.3053024,-96.4063836,17z/data=!3m1!4b1!4m5!3m4!1s0x864b8a9ceee18afd:0x53b8470d2bc7a6ca!8m2!3d33.3053024!4d-96.4042003"
    	},
    	{
    		ID: 3,
    		Type: "Both",
    		Name: "Celina ISD Administration Building",
    		Room: "Gym",
    		"Street Address": "205 S Colorado Street",
    		City: "Celina",
    		State: "TX",
    		Zip: "75009",
    		Longitude: "33.32303",
    		Latitude: "-96.78852",
    		MapsLink: "https://www.google.com/maps/place/205+S+Colorado+St,+Celina,+TX+75009/@33.3227598,-96.7879198,3a,75y,101.61h,90t/data=!3m7!1e1!3m5!1sSuJCBr_A6lBfC2AxI_srxQ!2e0!6s%2F%2Fgeo2.ggpht.com%2Fcbk%3Fpanoid%3DSuJCBr_A6lBfC2AxI_srxQ%26output%3Dthumbnail%26cb_client%3Dsearch.gws-prod.gps%26thumb%3D2%26w%3D86%26h%3D86%26yaw%3D101.61207%26pitch%3D0%26thumbfov%3D100!7i13312!8i6656!4m5!3m4!1s0x864c419f1eae233d:0xeae268e5ce91d1de!8m2!3d33.3228011!4d-96.7885113"
    	},
    	{
    		ID: 4,
    		Type: "Both",
    		Name: "Collin County Elections Office",
    		Room: "Voting Room",
    		"Street Address": "2010 Redbud Boulevard, Suite 102",
    		City: "McKinney",
    		State: "TX",
    		Zip: "75069",
    		Longitude: "33.21976",
    		Latitude: "-96.62817",
    		MapsLink: "https://www.google.com/maps/place/2010+Redbud+Blvd+Suite+102,+McKinney,+TX+75069/@33.2198637,-96.6293986,18z/data=!4m5!3m4!1s0x864c13071c3fffff:0x6d751c9053bd878b!8m2!3d33.2196956!4d-96.6281564"
    	},
    	{
    		ID: 5,
    		Type: "Both",
    		Name: "Farmersville City Hall",
    		Room: "Council Chambers",
    		"Street Address": "205 S Main Street",
    		City: "Farmersville",
    		State: "TX",
    		Zip: "75442",
    		Longitude: "33.16128",
    		Latitude: "-96.35975",
    		MapsLink: "https://www.google.com/maps/place/Farmersville+City+Hall/@33.161077,-96.3620083,17z/data=!3m1!4b1!4m5!3m4!1s0x864bf6f38077042b:0x34f86fe7c651ab13!8m2!3d33.161077!4d-96.359825"
    	},
    	{
    		ID: 6,
    		Type: "Both",
    		Name: "First Melissa",
    		Room: "Building B Foyer",
    		"Street Address": "2101 E Melissa Road",
    		City: "Melissa",
    		State: "TX",
    		Zip: "75454",
    		Longitude: "33.28182",
    		Latitude: "-96.5667",
    		MapsLink: "https://www.google.com/maps/place/First+Melissa/@33.2820014,-96.5686887,17z/data=!3m1!4b1!4m5!3m4!1s0x864c72a30b59e83b:0x5b576f9736864025!8m2!3d33.2820014!4d-96.5665054"
    	},
    	{
    		ID: 7,
    		Type: "Both",
    		Name: "Josephine City Hall",
    		Room: "Council Chambers",
    		"Street Address": "201 Main Street",
    		City: "Josephine",
    		State: "TX",
    		Zip: "75164",
    		Longitude: "33.06636",
    		Latitude: "-96.43309",
    		MapsLink: "https://www.google.com/maps/place/Josephine+City+Hall/@33.0620708,-96.3120151,17z/data=!3m1!4b1!4m5!3m4!1s0x864bfa31a68bff09:0x12452808733cbf34!8m2!3d33.0620708!4d-96.3098318"
    	},
    	{
    		ID: 8,
    		Type: "Both",
    		Name: "Lavon City Hall",
    		Room: "Gym",
    		"Street Address": "120 School Road",
    		City: "Lavon",
    		State: "TX",
    		Zip: "75166",
    		Longitude: "33.02636",
    		Latitude: "-96.56556"
    	},
    	{
    		ID: 9,
    		Type: "Both",
    		Name: "New Hope Town Hall",
    		Room: "Council Chambers",
    		"Street Address": "121 Rockcrest Road",
    		City: "New Hope",
    		State: "TX",
    		Zip: "75071",
    		Longitude: "33.21091",
    		Latitude: "-96.56556"
    	},
    	{
    		ID: 10,
    		Type: "Both",
    		Name: "Princeton Public Works Department",
    		Room: "Conference Room",
    		"Street Address": "255 Monte Carlo Boulevard",
    		City: "Princeton",
    		State: "TX",
    		Zip: "75047",
    		Longitude: "33.18083",
    		Latitude: "-96.49537"
    	},
    	{
    		ID: 11,
    		Type: "Both",
    		Name: "Prosper Town Hall",
    		Room: "Community Room",
    		"Street Address": "250 W First Street",
    		City: "Prosper",
    		State: "TX",
    		Zip: "75078",
    		Longitude: "33.23468",
    		Latitude: "-96.8039"
    	},
    	{
    		ID: 12,
    		Type: "Election Day",
    		Name: "Weston Community Center",
    		Room: "Main Hall",
    		"Street Address": "117 Main Street",
    		City: "Weston",
    		State: "TX",
    		Zip: "75097",
    		Longitude: "33.34722",
    		Latitude: "-96.66892"
    	},
    	{
    		ID: 13,
    		Type: "Both",
    		Name: "Wylie Senior Recreation Center",
    		Room: "Dining Room",
    		"Street Address": "800 Thomas Street",
    		City: "Wylie",
    		State: "TX",
    		Zip: "75098",
    		Longitude: "33.0038",
    		Latitude: "-96.53215"
    	}
    ];

    /* src/modal.svelte generated by Svelte v3.32.3 */

    const file = "src/modal.svelte";

    // (5:0) {#if showModal}
    function create_if_block(ctx) {
    	let div1;
    	let div0;
    	let h1;
    	let t0;
    	let u;
    	let a0;
    	let t2;
    	let t3;
    	let b;
    	let t5;
    	let p;
    	let t6;
    	let br0;
    	let t7;
    	let br1;
    	let t8;
    	let br2;
    	let t9;
    	let br3;
    	let t10;
    	let br4;
    	let t11;
    	let br5;
    	let t12;
    	let br6;
    	let t13;
    	let br7;
    	let t14;
    	let br8;
    	let t15;
    	let br9;
    	let t16;
    	let t17;
    	let small;
    	let t18;
    	let a1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			t0 = text("Click ");
    			u = element("u");
    			a0 = element("a");
    			a0.textContent = "here";
    			t2 = text(" to begin your registration process");
    			t3 = space();
    			b = element("b");
    			b.textContent = "Are you eligible to vote?";
    			t5 = space();
    			p = element("p");
    			t6 = text("You are eligible if:\n                ");
    			br0 = element("br");
    			t7 = space();
    			br1 = element("br");
    			t8 = text(" • You are a United States citizen; ");
    			br2 = element("br");
    			t9 = space();
    			br3 = element("br");
    			t10 = text(" • You are a resident of the county where you submit the application; ");
    			br4 = element("br");
    			t11 = space();
    			br5 = element("br");
    			t12 = text(" • You are at least 17 years and 10 months old, and you are 18 years of age on\n                Election Day. ");
    			br6 = element("br");
    			t13 = space();
    			br7 = element("br");
    			t14 = text(" • You are not a convicted felon (you may be eligible to vote if you have completed your sentence, probation, and parole); and ");
    			br8 = element("br");
    			t15 = space();
    			br9 = element("br");
    			t16 = text(" • You have not been declared by a court exercising probate jurisdiction to be either totally mentally incapacitated or partially mentally incapacitated without the right to vote.");
    			t17 = space();
    			small = element("small");
    			t18 = text("information from ");
    			a1 = element("a");
    			a1.textContent = "https://www.votetexas.gov/register/index.html";
    			attr_dev(a0, "href", "https://www.votetexas.gov/register/index.html");
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "class", "svelte-u6mpz8");
    			add_location(a0, file, 7, 25, 217);
    			add_location(u, file, 7, 22, 214);
    			add_location(h1, file, 7, 12, 204);
    			add_location(b, file, 8, 12, 354);
    			add_location(br0, file, 10, 16, 439);
    			add_location(br1, file, 11, 16, 460);
    			add_location(br2, file, 11, 56, 500);
    			add_location(br3, file, 12, 16, 521);
    			add_location(br4, file, 12, 90, 595);
    			add_location(br5, file, 13, 16, 616);
    			add_location(br6, file, 14, 30, 729);
    			add_location(br7, file, 15, 16, 750);
    			add_location(br8, file, 15, 147, 881);
    			add_location(br9, file, 16, 16, 902);
    			attr_dev(p, "class", "svelte-u6mpz8");
    			add_location(p, file, 9, 12, 399);
    			attr_dev(a1, "href", "https://www.votetexas.gov/register/index.html");
    			attr_dev(a1, "class", "svelte-u6mpz8");
    			add_location(a1, file, 18, 36, 1139);
    			add_location(small, file, 18, 12, 1115);
    			attr_dev(div0, "class", "modal svelte-u6mpz8");
    			add_location(div0, file, 6, 8, 172);
    			attr_dev(div1, "class", "backdrop svelte-u6mpz8");
    			toggle_class(div1, "promo", /*isPromo*/ ctx[1]);
    			add_location(div1, file, 5, 4, 105);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, h1);
    			append_dev(h1, t0);
    			append_dev(h1, u);
    			append_dev(u, a0);
    			append_dev(h1, t2);
    			append_dev(div0, t3);
    			append_dev(div0, b);
    			append_dev(div0, t5);
    			append_dev(div0, p);
    			append_dev(p, t6);
    			append_dev(p, br0);
    			append_dev(p, t7);
    			append_dev(p, br1);
    			append_dev(p, t8);
    			append_dev(p, br2);
    			append_dev(p, t9);
    			append_dev(p, br3);
    			append_dev(p, t10);
    			append_dev(p, br4);
    			append_dev(p, t11);
    			append_dev(p, br5);
    			append_dev(p, t12);
    			append_dev(p, br6);
    			append_dev(p, t13);
    			append_dev(p, br7);
    			append_dev(p, t14);
    			append_dev(p, br8);
    			append_dev(p, t15);
    			append_dev(p, br9);
    			append_dev(p, t16);
    			append_dev(div0, t17);
    			append_dev(div0, small);
    			append_dev(small, t18);
    			append_dev(small, a1);

    			if (!mounted) {
    				dispose = listen_dev(div1, "click", self(/*click_handler*/ ctx[2]), false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*isPromo*/ 2) {
    				toggle_class(div1, "promo", /*isPromo*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(5:0) {#if showModal}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let t;
    	let main;
    	let if_block = /*showModal*/ ctx[0] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t = space();
    			main = element("main");
    			add_location(main, file, 23, 0, 1286);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, main, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*showModal*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(t.parentNode, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(main);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Modal", slots, []);
    	let { showModal = false } = $$props;
    	let { isPromo = false } = $$props;
    	const writable_props = ["showModal", "isPromo"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Modal> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ("showModal" in $$props) $$invalidate(0, showModal = $$props.showModal);
    		if ("isPromo" in $$props) $$invalidate(1, isPromo = $$props.isPromo);
    	};

    	$$self.$capture_state = () => ({ showModal, isPromo });

    	$$self.$inject_state = $$props => {
    		if ("showModal" in $$props) $$invalidate(0, showModal = $$props.showModal);
    		if ("isPromo" in $$props) $$invalidate(1, isPromo = $$props.isPromo);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [showModal, isPromo, click_handler];
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { showModal: 0, isPromo: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get showModal() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showModal(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isPromo() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isPromo(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.32.3 */

    const { console: console_1 } = globals;
    const file$1 = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (42:2) {#if ZIP == location.Zip}
    function create_if_block$1(ctx) {
    	let a;
    	let t0;
    	let u;
    	let t1_value = /*location*/ ctx[8].Name + "";
    	let t1;
    	let t2;
    	let t3_value = /*location*/ ctx[8].Room + "";
    	let t3;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t0 = text("Location: ");
    			u = element("u");
    			t1 = text(t1_value);
    			t2 = text(", ");
    			t3 = text(t3_value);
    			add_location(u, file$1, 42, 57, 959);
    			attr_dev(a, "href", /*location*/ ctx[8].MapsLink);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "class", "svelte-7c1db7");
    			add_location(a, file$1, 42, 3, 905);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t0);
    			append_dev(a, u);
    			append_dev(u, t1);
    			append_dev(u, t2);
    			append_dev(u, t3);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(42:2) {#if ZIP == location.Zip}",
    		ctx
    	});

    	return block;
    }

    // (41:1) {#each locations as location}
    function create_each_block(ctx) {
    	let if_block_anchor;
    	let if_block = /*ZIP*/ ctx[1] == /*location*/ ctx[8].Zip && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*ZIP*/ ctx[1] == /*location*/ ctx[8].Zip) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(41:1) {#each locations as location}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let modal;
    	let t0;
    	let main;
    	let div;
    	let button;
    	let t2;
    	let h1;
    	let t4;
    	let img;
    	let t5;
    	let b0;
    	let t7;
    	let input;
    	let t8;
    	let h2;
    	let t10;
    	let t11;
    	let p;
    	let t12;
    	let br0;
    	let t13;
    	let br1;
    	let t14;
    	let br2;
    	let t15;
    	let br3;
    	let t16;
    	let br4;
    	let t17;
    	let br5;
    	let t18;
    	let br6;
    	let t19;
    	let br7;
    	let t20;
    	let b1;
    	let current;
    	let mounted;
    	let dispose;

    	modal = new Modal({
    			props: { showModal: /*showModal*/ ctx[0] },
    			$$inline: true
    		});

    	modal.$on("click", /*toggleModal*/ ctx[4]);
    	let each_value = locations;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			create_component(modal.$$.fragment);
    			t0 = space();
    			main = element("main");
    			div = element("div");
    			button = element("button");
    			button.textContent = "REGISTER";
    			t2 = space();
    			h1 = element("h1");
    			h1.textContent = `${/*header*/ ctx[3]}`;
    			t4 = space();
    			img = element("img");
    			t5 = space();
    			b0 = element("b");
    			b0.textContent = "Find a voting location in your area!";
    			t7 = space();
    			input = element("input");
    			t8 = space();
    			h2 = element("h2");
    			h2.textContent = "WHAT ELECTION?";
    			t10 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t11 = space();
    			p = element("p");
    			t12 = text("On May 1st, 2021, voters will elect representatives for these positions in City Council:\n\t\t");
    			br0 = element("br");
    			t13 = space();
    			br1 = element("br");
    			t14 = text("•   Mayor\t\n\t\t");
    			br2 = element("br");
    			t15 = text("•   District 1\n\t\t");
    			br3 = element("br");
    			t16 = text("•   District 3\n\t\t");
    			br4 = element("br");
    			t17 = text("•   At Large 1\t\n\t\t");
    			br5 = element("br");
    			t18 = space();
    			br6 = element("br");
    			t19 = text(" Mayoral Candidates:\n\t\t");
    			br7 = element("br");
    			t20 = space();
    			b1 = element("b");
    			b1.textContent = "Current Mayor: George Fuller";
    			attr_dev(button, "class", "svelte-7c1db7");
    			add_location(button, file$1, 32, 1, 550);
    			attr_dev(h1, "class", "svelte-7c1db7");
    			add_location(h1, file$1, 34, 1, 620);
    			attr_dev(img, "imgsrc", /*imgSrc*/ ctx[2]);
    			attr_dev(img, "alt", "display");
    			attr_dev(img, "class", "svelte-7c1db7");
    			add_location(img, file$1, 35, 1, 639);
    			attr_dev(b0, "class", "svelte-7c1db7");
    			add_location(b0, file$1, 37, 1, 694);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "Insert ZIP");
    			attr_dev(input, "class", "svelte-7c1db7");
    			add_location(input, file$1, 38, 1, 739);
    			attr_dev(h2, "class", "svelte-7c1db7");
    			add_location(h2, file$1, 39, 1, 819);
    			add_location(br0, file$1, 46, 2, 1115);
    			add_location(br1, file$1, 47, 2, 1122);
    			add_location(br2, file$1, 48, 2, 1139);
    			add_location(br3, file$1, 49, 2, 1160);
    			add_location(br4, file$1, 50, 2, 1181);
    			add_location(br5, file$1, 51, 2, 1203);
    			add_location(br6, file$1, 52, 2, 1210);
    			add_location(br7, file$1, 53, 2, 1237);
    			attr_dev(b1, "class", "svelte-7c1db7");
    			add_location(b1, file$1, 54, 2, 1244);
    			attr_dev(p, "class", "svelte-7c1db7");
    			add_location(p, file$1, 45, 1, 1021);
    			add_location(div, file$1, 31, 0, 543);
    			attr_dev(main, "class", "svelte-7c1db7");
    			add_location(main, file$1, 29, 0, 512);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(modal, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, div);
    			append_dev(div, button);
    			append_dev(div, t2);
    			append_dev(div, h1);
    			append_dev(div, t4);
    			append_dev(div, img);
    			append_dev(div, t5);
    			append_dev(div, b0);
    			append_dev(div, t7);
    			append_dev(div, input);
    			set_input_value(input, /*ZIP*/ ctx[1]);
    			append_dev(div, t8);
    			append_dev(div, h2);
    			append_dev(div, t10);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			append_dev(div, t11);
    			append_dev(div, p);
    			append_dev(p, t12);
    			append_dev(p, br0);
    			append_dev(p, t13);
    			append_dev(p, br1);
    			append_dev(p, t14);
    			append_dev(p, br2);
    			append_dev(p, t15);
    			append_dev(p, br3);
    			append_dev(p, t16);
    			append_dev(p, br4);
    			append_dev(p, t17);
    			append_dev(p, br5);
    			append_dev(p, t18);
    			append_dev(p, br6);
    			append_dev(p, t19);
    			append_dev(p, br7);
    			append_dev(p, t20);
    			append_dev(p, b1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*toggleModal*/ ctx[4], false, false, false),
    					listen_dev(
    						input,
    						"keytype",
    						function () {
    							if (is_function(/*ZIP*/ ctx[1])) /*ZIP*/ ctx[1].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(input, "input", /*input_input_handler*/ ctx[5])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			const modal_changes = {};
    			if (dirty & /*showModal*/ 1) modal_changes.showModal = /*showModal*/ ctx[0];
    			modal.$set(modal_changes);

    			if (dirty & /*ZIP*/ 2 && input.value !== /*ZIP*/ ctx[1]) {
    				set_input_value(input, /*ZIP*/ ctx[1]);
    			}

    			if (dirty & /*locations, ZIP*/ 2) {
    				each_value = locations;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, t11);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modal, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	console.log(`running version ${locations.length}`);
    	let imgSrc = "./SvelteAppMedia/downtown-mckinney.jpeg";
    	let header = "McKinney 2021 General Election";
    	let src = "";
    	let showModal = false;
    	let ZIP;
    	let z_index_val = 0;

    	const toggleModal = () => {
    		$$invalidate(0, showModal = !showModal);
    		if (z_index_val == 0) z_index_val = -1; else z_index_val = 0;
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		ZIP = this.value;
    		$$invalidate(1, ZIP);
    	}

    	$$self.$capture_state = () => ({
    		locations,
    		imgSrc,
    		header,
    		src,
    		showModal,
    		ZIP,
    		z_index_val,
    		Modal,
    		toggleModal
    	});

    	$$self.$inject_state = $$props => {
    		if ("imgSrc" in $$props) $$invalidate(2, imgSrc = $$props.imgSrc);
    		if ("header" in $$props) $$invalidate(3, header = $$props.header);
    		if ("src" in $$props) src = $$props.src;
    		if ("showModal" in $$props) $$invalidate(0, showModal = $$props.showModal);
    		if ("ZIP" in $$props) $$invalidate(1, ZIP = $$props.ZIP);
    		if ("z_index_val" in $$props) z_index_val = $$props.z_index_val;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [showModal, ZIP, imgSrc, header, toggleModal, input_input_handler];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    var app = new App({
    	target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
