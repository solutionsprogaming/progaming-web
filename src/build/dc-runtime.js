/* Mini runtime para las landings de ProGaming (plantilla + estado), sin dependencias salvo morphdom. */
(function () {
  'use strict';
  var HOLE = /\{\{\s*([^}]+?)\s*\}\}/g;
  var SOLE = /^\{\{\s*([^}]+?)\s*\}\}$/;

  function lookup(scope, path) {
    path = path.trim();
    if (path === 'true') return true;
    if (path === 'false') return false;
    if (/^-?\d+(\.\d+)?$/.test(path)) return Number(path);
    var parts = path.split('.'), v = scope;
    for (var i = 0; i < parts.length; i++) { if (v == null) return undefined; v = v[parts[i]]; }
    return v;
  }
  function interp(str, scope) {
    return str.replace(HOLE, function (_, p) { var v = lookup(scope, p); return v == null ? '' : String(v); });
  }

  var EVENTS = { onclick: 'click', onchange: 'change', oninput: 'input' };

  function DCLogic(props) { this.props = props || {}; this.state = {}; }
  DCLogic.prototype.setState = function (patch) {
    var s = typeof patch === 'function' ? patch(this.state, this.props) : patch;
    this.state = Object.assign({}, this.state, s);
    this.__app && this.__app.schedule();
  };
  DCLogic.prototype.forceUpdate = function () { this.__app && this.__app.schedule(); };
  window.DCLogic = DCLogic;

  function App(root, tpl, Comp, props) {
    this.root = root; this.tpl = tpl; this.handlers = {}; this.hid = 0;
    this.comp = new Comp(props); this.comp.__app = this; this.queued = false;
    var self = this;
    ['click', 'input', 'change'].forEach(function (type) {
      root.addEventListener(type, function (e) {
        var el = e.target;
        while (el && el !== root) {
          var id = el.getAttribute && el.getAttribute('data-dc-' + type);
          if (id && self.handlers[id]) { self.handlers[id](e); break; }
          el = el.parentNode;
        }
      });
    });
  }
  App.prototype.schedule = function () {
    var self = this; if (this.queued) return; this.queued = true;
    requestAnimationFrame(function () { self.queued = false; self.render(); });
  };
  App.prototype.build = function (node, scope, out) {
    var self = this;
    if (node.nodeType === 3) { out.appendChild(document.createTextNode(interp(node.nodeValue, scope))); return; }
    if (node.nodeType !== 1) return;
    var tag = node.tagName.toLowerCase();
    var isFor = tag === 'sc-for' || (tag === 'optgroup' && node.hasAttribute('data-sc-for'));
    if (isFor) {
      var m = SOLE.exec(node.getAttribute('list') || ''); var list = m ? lookup(scope, m[1]) : [];
      var as = node.getAttribute('as') || 'item';
      (list || []).forEach(function (item, i) {
        var sc = Object.create(scope); sc[as] = item; sc.$index = i;
        node.childNodes.forEach(function (c) { self.build(c, sc, out); });
      });
      return;
    }
    if (tag === 'sc-if') {
      var mv = SOLE.exec(node.getAttribute('value') || '');
      if (mv && lookup(scope, mv[1])) node.childNodes.forEach(function (c) { self.build(c, scope, out); });
      return;
    }
    var el = node.namespaceURI === 'http://www.w3.org/2000/svg'
      ? document.createElementNS(node.namespaceURI, node.tagName)
      : document.createElement(node.tagName);
    for (var a = 0; a < node.attributes.length; a++) {
      var at = node.attributes[a], name = at.name, val = at.value, lname = name.toLowerCase();
      if (lname.indexOf('hint-') === 0) continue;
      var sole = SOLE.exec(val);
      if (EVENTS[lname]) {
        var fn = sole ? lookup(scope, sole[1]) : null;
        if (typeof fn === 'function') {
          var id = 'h' + (++self.hid); self.handlers[id] = fn;
          var type = EVENTS[lname];
          if (type === 'change' && (tag === 'input' || tag === 'textarea')) type = 'input';
          el.setAttribute('data-dc-' + type, id);
        }
        continue;
      }
      if (sole) {
        var v = lookup(scope, sole[1]);
        if (v === false || v == null) continue;
        el.setAttribute(name, v === true ? '' : String(v));
      } else {
        el.setAttribute(name, interp(val, scope));
      }
    }
    if (tag === 'input' && el.hasAttribute('value')) el.value = el.getAttribute('value');
    var kids = node.content ? node.content.childNodes : node.childNodes;
    kids.forEach(function (c) { self.build(c, scope, el); });
    out.appendChild(el);
  };
  App.prototype.render = function () {
    this.handlers = {}; this.hid = 0;
    var vals = this.comp.renderVals ? this.comp.renderVals() : {};
    var next = document.createElement('div'); next.id = this.root.id;
    var self = this;
    this.tpl.content.childNodes.forEach(function (c) { self.build(c, vals, next); });
    window.morphdom(this.root, next, {
      onBeforeElUpdated: function (from, to) {
        if (from.tagName === 'SELECT') {           // conserva la opción elegida
          var keep = from.value;
          from.querySelectorAll('[data-dc-change]').forEach(function () {});
          ['data-dc-change', 'data-dc-input'].forEach(function (k) {
            if (to.hasAttribute(k)) from.setAttribute(k, to.getAttribute(k));
          });
          from.value = keep; return false;
        }
        if (from === document.activeElement && (from.tagName === 'INPUT' || from.tagName === 'TEXTAREA')) {
          ['data-dc-change', 'data-dc-input'].forEach(function (k) {
            if (to.hasAttribute(k)) from.setAttribute(k, to.getAttribute(k));
          });
          return false;
        }
        return true;
      }
    });
  };

  window.DCApp = {
    mount: function (rootId, tplId, Comp, props) {
      var app = new App(document.getElementById(rootId), document.getElementById(tplId), Comp, props);
      app.render();
      if (app.comp.componentDidMount) app.comp.componentDidMount();
      return app;
    }
  };
})();
