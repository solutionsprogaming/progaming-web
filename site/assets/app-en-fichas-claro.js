/* morphdom (MIT) — ver morphdom-LICENSE.txt */
(function(global,factory){typeof exports==="object"&&typeof module!=="undefined"?module.exports=factory():typeof define==="function"&&define.amd?define(factory):(global=global||self,global.morphdom=factory())})(this,function(){"use strict";var DOCUMENT_FRAGMENT_NODE=11;function morphAttrs(fromNode,toNode){var toNodeAttrs=toNode.attributes;var attr;var attrName;var attrNamespaceURI;var attrValue;var fromValue;if(toNode.nodeType===DOCUMENT_FRAGMENT_NODE||fromNode.nodeType===DOCUMENT_FRAGMENT_NODE){return}for(var i=toNodeAttrs.length-1;i>=0;i--){attr=toNodeAttrs[i];attrName=attr.name;attrNamespaceURI=attr.namespaceURI;attrValue=attr.value;if(attrNamespaceURI){attrName=attr.localName||attrName;fromValue=fromNode.getAttributeNS(attrNamespaceURI,attrName);if(fromValue!==attrValue){if(attr.prefix==="xmlns"){attrName=attr.name}fromNode.setAttributeNS(attrNamespaceURI,attrName,attrValue)}}else{fromValue=fromNode.getAttribute(attrName);if(fromValue!==attrValue){fromNode.setAttribute(attrName,attrValue)}}}var fromNodeAttrs=fromNode.attributes;for(var d=fromNodeAttrs.length-1;d>=0;d--){attr=fromNodeAttrs[d];attrName=attr.name;attrNamespaceURI=attr.namespaceURI;if(attrNamespaceURI){attrName=attr.localName||attrName;if(!toNode.hasAttributeNS(attrNamespaceURI,attrName)){fromNode.removeAttributeNS(attrNamespaceURI,attrName)}}else{if(!toNode.hasAttribute(attrName)){fromNode.removeAttribute(attrName)}}}}var range;var NS_XHTML="http://www.w3.org/1999/xhtml";var doc=typeof document==="undefined"?undefined:document;var HAS_TEMPLATE_SUPPORT=!!doc&&"content"in doc.createElement("template");var HAS_RANGE_SUPPORT=!!doc&&doc.createRange&&"createContextualFragment"in doc.createRange();function createFragmentFromTemplate(str){var template=doc.createElement("template");template.innerHTML=str;return template.content.childNodes[0]}function createFragmentFromRange(str){if(!range){range=doc.createRange();range.selectNode(doc.body)}var fragment=range.createContextualFragment(str);return fragment.childNodes[0]}function createFragmentFromWrap(str){var fragment=doc.createElement("body");fragment.innerHTML=str;return fragment.childNodes[0]}function toElement(str){str=str.trim();if(HAS_TEMPLATE_SUPPORT){return createFragmentFromTemplate(str)}else if(HAS_RANGE_SUPPORT){return createFragmentFromRange(str)}return createFragmentFromWrap(str)}function compareNodeNames(fromEl,toEl){var fromNodeName=fromEl.nodeName;var toNodeName=toEl.nodeName;var fromCodeStart,toCodeStart;if(fromNodeName===toNodeName){return true}fromCodeStart=fromNodeName.charCodeAt(0);toCodeStart=toNodeName.charCodeAt(0);if(fromCodeStart<=90&&toCodeStart>=97){return fromNodeName===toNodeName.toUpperCase()}else if(toCodeStart<=90&&fromCodeStart>=97){return toNodeName===fromNodeName.toUpperCase()}else{return false}}function createElementNS(name,namespaceURI){return!namespaceURI||namespaceURI===NS_XHTML?doc.createElement(name):doc.createElementNS(namespaceURI,name)}function moveChildren(fromEl,toEl){var curChild=fromEl.firstChild;while(curChild){var nextChild=curChild.nextSibling;toEl.appendChild(curChild);curChild=nextChild}return toEl}function syncBooleanAttrProp(fromEl,toEl,name){if(fromEl[name]!==toEl[name]){fromEl[name]=toEl[name];if(fromEl[name]){fromEl.setAttribute(name,"")}else{fromEl.removeAttribute(name)}}}var specialElHandlers={OPTION:function(fromEl,toEl){var parentNode=fromEl.parentNode;if(parentNode){var parentName=parentNode.nodeName.toUpperCase();if(parentName==="OPTGROUP"){parentNode=parentNode.parentNode;parentName=parentNode&&parentNode.nodeName.toUpperCase()}if(parentName==="SELECT"&&!parentNode.hasAttribute("multiple")){if(fromEl.hasAttribute("selected")&&!toEl.selected){fromEl.setAttribute("selected","selected");fromEl.removeAttribute("selected")}parentNode.selectedIndex=-1}}syncBooleanAttrProp(fromEl,toEl,"selected")},INPUT:function(fromEl,toEl){syncBooleanAttrProp(fromEl,toEl,"checked");syncBooleanAttrProp(fromEl,toEl,"disabled");if(fromEl.value!==toEl.value){fromEl.value=toEl.value}if(!toEl.hasAttribute("value")){fromEl.removeAttribute("value")}},TEXTAREA:function(fromEl,toEl){var newValue=toEl.value;if(fromEl.value!==newValue){fromEl.value=newValue}var firstChild=fromEl.firstChild;if(firstChild){var oldValue=firstChild.nodeValue;if(oldValue==newValue||!newValue&&oldValue==fromEl.placeholder){return}firstChild.nodeValue=newValue}},SELECT:function(fromEl,toEl){if(!toEl.hasAttribute("multiple")){var selectedIndex=-1;var i=0;var curChild=fromEl.firstChild;var optgroup;var nodeName;while(curChild){nodeName=curChild.nodeName&&curChild.nodeName.toUpperCase();if(nodeName==="OPTGROUP"){optgroup=curChild;curChild=optgroup.firstChild}else{if(nodeName==="OPTION"){if(curChild.hasAttribute("selected")){selectedIndex=i;break}i++}curChild=curChild.nextSibling;if(!curChild&&optgroup){curChild=optgroup.nextSibling;optgroup=null}}}fromEl.selectedIndex=selectedIndex}}};var ELEMENT_NODE=1;var DOCUMENT_FRAGMENT_NODE$1=11;var TEXT_NODE=3;var COMMENT_NODE=8;function noop(){}function defaultGetNodeKey(node){if(node){return node.getAttribute&&node.getAttribute("id")||node.id}}function morphdomFactory(morphAttrs){return function morphdom(fromNode,toNode,options){if(!options){options={}}if(typeof toNode==="string"){if(fromNode.nodeName==="#document"||fromNode.nodeName==="HTML"||fromNode.nodeName==="BODY"){var toNodeHtml=toNode;toNode=doc.createElement("html");toNode.innerHTML=toNodeHtml}else{toNode=toElement(toNode)}}else if(toNode.nodeType===DOCUMENT_FRAGMENT_NODE$1){toNode=toNode.firstElementChild}var getNodeKey=options.getNodeKey||defaultGetNodeKey;var onBeforeNodeAdded=options.onBeforeNodeAdded||noop;var onNodeAdded=options.onNodeAdded||noop;var onBeforeElUpdated=options.onBeforeElUpdated||noop;var onElUpdated=options.onElUpdated||noop;var onBeforeNodeDiscarded=options.onBeforeNodeDiscarded||noop;var onNodeDiscarded=options.onNodeDiscarded||noop;var onBeforeElChildrenUpdated=options.onBeforeElChildrenUpdated||noop;var skipFromChildren=options.skipFromChildren||noop;var addChild=options.addChild||function(parent,child){return parent.appendChild(child)};var childrenOnly=options.childrenOnly===true;var fromNodesLookup=Object.create(null);var keyedRemovalList=[];function addKeyedRemoval(key){keyedRemovalList.push(key)}function walkDiscardedChildNodes(node,skipKeyedNodes){if(node.nodeType===ELEMENT_NODE){var curChild=node.firstChild;while(curChild){var key=undefined;if(skipKeyedNodes&&(key=getNodeKey(curChild))){addKeyedRemoval(key)}else{onNodeDiscarded(curChild);if(curChild.firstChild){walkDiscardedChildNodes(curChild,skipKeyedNodes)}}curChild=curChild.nextSibling}}}function removeNode(node,parentNode,skipKeyedNodes){if(onBeforeNodeDiscarded(node)===false){return}if(parentNode){parentNode.removeChild(node)}onNodeDiscarded(node);walkDiscardedChildNodes(node,skipKeyedNodes)}function indexTree(node){if(node.nodeType===ELEMENT_NODE||node.nodeType===DOCUMENT_FRAGMENT_NODE$1){var curChild=node.firstChild;while(curChild){var key=getNodeKey(curChild);if(key){fromNodesLookup[key]=curChild}indexTree(curChild);curChild=curChild.nextSibling}}}indexTree(fromNode);function handleNodeAdded(el){onNodeAdded(el);var curChild=el.firstChild;while(curChild){var nextSibling=curChild.nextSibling;var key=getNodeKey(curChild);if(key){var unmatchedFromEl=fromNodesLookup[key];if(unmatchedFromEl&&compareNodeNames(curChild,unmatchedFromEl)){curChild.parentNode.replaceChild(unmatchedFromEl,curChild);morphEl(unmatchedFromEl,curChild)}else{handleNodeAdded(curChild)}}else{handleNodeAdded(curChild)}curChild=nextSibling}}function cleanupFromEl(fromEl,curFromNodeChild,curFromNodeKey){while(curFromNodeChild){var fromNextSibling=curFromNodeChild.nextSibling;if(curFromNodeKey=getNodeKey(curFromNodeChild)){addKeyedRemoval(curFromNodeKey)}else{removeNode(curFromNodeChild,fromEl,true)}curFromNodeChild=fromNextSibling}}function morphEl(fromEl,toEl,childrenOnly){var toElKey=getNodeKey(toEl);if(toElKey){delete fromNodesLookup[toElKey]}if(!childrenOnly){var beforeUpdateResult=onBeforeElUpdated(fromEl,toEl);if(beforeUpdateResult===false){return}else if(beforeUpdateResult instanceof HTMLElement){fromEl=beforeUpdateResult;indexTree(fromEl)}morphAttrs(fromEl,toEl);onElUpdated(fromEl);if(onBeforeElChildrenUpdated(fromEl,toEl)===false){return}}if(fromEl.nodeName!=="TEXTAREA"){morphChildren(fromEl,toEl)}else{specialElHandlers.TEXTAREA(fromEl,toEl)}}function morphChildren(fromEl,toEl){var skipFrom=skipFromChildren(fromEl,toEl);var curToNodeChild=toEl.firstChild;var curFromNodeChild=fromEl.firstChild;var curToNodeKey;var curFromNodeKey;var fromNextSibling;var toNextSibling;var matchingFromEl;outer:while(curToNodeChild){toNextSibling=curToNodeChild.nextSibling;curToNodeKey=getNodeKey(curToNodeChild);while(!skipFrom&&curFromNodeChild){fromNextSibling=curFromNodeChild.nextSibling;if(curToNodeChild.isSameNode&&curToNodeChild.isSameNode(curFromNodeChild)){curToNodeChild=toNextSibling;curFromNodeChild=fromNextSibling;continue outer}curFromNodeKey=getNodeKey(curFromNodeChild);var curFromNodeType=curFromNodeChild.nodeType;var isCompatible=undefined;if(curFromNodeType===curToNodeChild.nodeType){if(curFromNodeType===ELEMENT_NODE){if(curToNodeKey){if(curToNodeKey!==curFromNodeKey){if(matchingFromEl=fromNodesLookup[curToNodeKey]){if(fromNextSibling===matchingFromEl){isCompatible=false}else{fromEl.insertBefore(matchingFromEl,curFromNodeChild);if(curFromNodeKey){addKeyedRemoval(curFromNodeKey)}else{removeNode(curFromNodeChild,fromEl,true)}curFromNodeChild=matchingFromEl;curFromNodeKey=getNodeKey(curFromNodeChild)}}else{isCompatible=false}}}else if(curFromNodeKey){isCompatible=false}isCompatible=isCompatible!==false&&compareNodeNames(curFromNodeChild,curToNodeChild);if(isCompatible){morphEl(curFromNodeChild,curToNodeChild)}}else if(curFromNodeType===TEXT_NODE||curFromNodeType==COMMENT_NODE){isCompatible=true;if(curFromNodeChild.nodeValue!==curToNodeChild.nodeValue){curFromNodeChild.nodeValue=curToNodeChild.nodeValue}}}if(isCompatible){curToNodeChild=toNextSibling;curFromNodeChild=fromNextSibling;continue outer}if(curFromNodeKey){addKeyedRemoval(curFromNodeKey)}else{removeNode(curFromNodeChild,fromEl,true)}curFromNodeChild=fromNextSibling}if(curToNodeKey&&(matchingFromEl=fromNodesLookup[curToNodeKey])&&compareNodeNames(matchingFromEl,curToNodeChild)){if(!skipFrom){addChild(fromEl,matchingFromEl)}morphEl(matchingFromEl,curToNodeChild)}else{var onBeforeNodeAddedResult=onBeforeNodeAdded(curToNodeChild);if(onBeforeNodeAddedResult!==false){if(onBeforeNodeAddedResult){curToNodeChild=onBeforeNodeAddedResult}if(curToNodeChild.actualize){curToNodeChild=curToNodeChild.actualize(fromEl.ownerDocument||doc)}addChild(fromEl,curToNodeChild);handleNodeAdded(curToNodeChild)}}curToNodeChild=toNextSibling;curFromNodeChild=fromNextSibling}cleanupFromEl(fromEl,curFromNodeChild,curFromNodeKey);var specialElHandler=specialElHandlers[fromEl.nodeName];if(specialElHandler){specialElHandler(fromEl,toEl)}}var morphedNode=fromNode;var morphedNodeType=morphedNode.nodeType;var toNodeType=toNode.nodeType;if(!childrenOnly){if(morphedNodeType===ELEMENT_NODE){if(toNodeType===ELEMENT_NODE){if(!compareNodeNames(fromNode,toNode)){onNodeDiscarded(fromNode);morphedNode=moveChildren(fromNode,createElementNS(toNode.nodeName,toNode.namespaceURI))}}else{morphedNode=toNode}}else if(morphedNodeType===TEXT_NODE||morphedNodeType===COMMENT_NODE){if(toNodeType===morphedNodeType){if(morphedNode.nodeValue!==toNode.nodeValue){morphedNode.nodeValue=toNode.nodeValue}return morphedNode}else{morphedNode=toNode}}}if(morphedNode===toNode){onNodeDiscarded(fromNode)}else{if(toNode.isSameNode&&toNode.isSameNode(morphedNode)){return}morphEl(morphedNode,toNode,childrenOnly);if(keyedRemovalList){for(var i=0,len=keyedRemovalList.length;i<len;i++){var elToRemove=fromNodesLookup[keyedRemovalList[i]];if(elToRemove){removeNode(elToRemove,elToRemove.parentNode,false)}}}}if(!childrenOnly&&morphedNode!==fromNode&&fromNode.parentNode){if(morphedNode.actualize){morphedNode=morphedNode.actualize(fromNode.ownerDocument||doc)}fromNode.parentNode.replaceChild(morphedNode,fromNode)}return morphedNode}}var morphdom=morphdomFactory(morphAttrs);return morphdom});
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


class Component extends DCLogic {
  constructor(props) { super(props); this.state = { role: 0, pay: 0, platform: '', qty: '', name: '', faq: -1, sel: 0 }; }
  componentDidMount() { this.startAuto(); }
  componentWillUnmount() { clearInterval(this.timer); }
  startAuto() {
    clearInterval(this.timer);
    this.timer = setInterval(() => { this.setState({ sel: (this.state.sel + 1) % 11 }); }, 5000);
  }
  renderVals() {
    var accent = this.props.accent ?? '#0E7490';
    var wa = String(this.props.whatsapp ?? '573205519656').replace(/\D/g, '');
    var link = function (t) { return 'https://wa.me/' + wa + '?text=' + encodeURIComponent(t); };
    var plats = [
      ['Bet30', 'bet30-777.online', '/assets/69bba896-bet30.webp', '/assets/ccbb7011-bet30-prev.webp'],
      ['Celuapuestas', 'celuapuestas-777.online', '/assets/c5739fd8-celuapuestas.webp', '/assets/75f8a6ad-celuapuestas-prev.webp'],
      ['Casino Zeus', 'casinozeus-777.online', '/assets/004cb616-casinozeus.webp', '/assets/d8f7c6db-casinozeus-prev.webp'],
      ['Casino Zeta', 'casinozeta-777.online', '/assets/881f1b2b-casinozeta.webp', '/assets/13ae23b3-casinozeta-prev.webp'],
      ['Gana en Casa', 'ganaen-casa.online', '/assets/8fe427d4-ganaencasa.webp', '/assets/51b46328-ganaencasa-prev.webp'],
      ['Ganamos', 'ganamos-lat.com', '/assets/2f1e68c9-ganamoslat.webp', '/assets/20dfeb26-ganamoslat-prev.webp'],
      ['Tío Rico Juegos', 'tioricojuegos.net', '/assets/cbf124a9-tiorico.webp', '/assets/32ce5755-tiorico-prev.webp'],
      ['Ganamos VIP', 'ganamos.vip', '/assets/c5797625-ganamosvip.webp', '/assets/b577096c-ganamosvip-prev.webp'],
      ['Cash Master', 'cash-master.net', '/assets/5903b74d-cashmaster.webp', '/assets/2a7416ee-cashmaster-prev.webp'],
      ['Ganá Aquí', 'ganaaqui.net', '/assets/7e66c580-ganaaqui.webp', '/assets/bd1250c9-ganaaqui-prev.webp'],
      ['Rey Bet', 'rey-bet.net', '/assets/793c2ae8-reybet.webp', '/assets/0a804136-reybet-prev.webp']
    ];
    var names = plats.map(function (p) { return p[0]; });
    var sel = this.state.sel;
    var tileBase = 'position: relative; overflow: hidden; height: 84px; background: #0B1528; border-radius: 12px; padding: 12px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform .2s; ';
    var platforms = plats.map((p, i) => ({
      name: p[0], domain: p[1], site: 'https://' + p[1] + '/', logo: p[2], preview: p[3],
      hasPreview: !!p[3], noPreview: !p[3],
      pressed: i === sel ? 'true' : 'false',
      selected: i === sel,
      tileStyle: tileBase + (i === sel ? 'border: 2px solid ' + accent + '; box-shadow: 0 0 0 3px rgba(34,211,238,0.18), 0 10px 30px rgba(124,58,237,0.25); transform: translateY(-2px);' : 'border: 1px solid #E2E8F0;'),
      pick: () => { this.setState({ sel: i }); this.startAuto(); },
      wa: link('Hi, I want to buy credits for the platform ' + p[0] + '. Can you send me prices and conditions?')
    }));
    var cur = platforms[sel];
    var platformOptions = [{ value: '', label: 'Not sure yet / I\'d like a recommendation' }].concat(names.map(function (n) { return { value: n, label: n }; }));

    var btn = 'font: inherit; font-size: 15px; font-weight: 500; text-align: left; padding: 12px 14px; border-radius: 999px; min-height: 48px; cursor: pointer; ';
    var ON = 'background: rgba(37,211,102,0.12); border: 1.5px solid #25D366; color: #0B1630;';
    var OFF = 'background: #FFFFFF; border: 1px solid #CBD5E1; color: #334155;';
    var roleLabels = ['I\'m already an agent / cashier', 'I\'m just starting'];
    var payLabels = ['USDT', 'ARS'];
    var roles = roleLabels.map((l, i) => ({ label: l, pressed: i === this.state.role ? 'true' : 'false', style: btn + (i === this.state.role ? ON : OFF), pick: () => this.setState({ role: i }) }));
    var pays = payLabels.map((l, i) => ({ label: l, pressed: i === this.state.pay ? 'true' : 'false', style: btn + 'flex: 1; text-align: center; ' + (i === this.state.pay ? ON : OFF), pick: () => this.setState({ pay: i }) }));

    var nm = (this.state.name || '').trim();
    var qty = (this.state.qty || '').trim();
    var plat = this.state.platform;
    var msg = (nm ? 'Hi, I\'m ' + nm + '. ' : 'Hi. ') +
      (this.state.role === 0 ? 'I already operate as an agent/cashier' : 'I\'m just starting') +
      ' and I want to buy credits' + (plat ? ' para ' + plat : '') + '.' +
      (qty ? ' Approximate amount: ' + qty + '.' : '') +
      ' I\'d pay in ' + payLabels[this.state.pay] + '. Can you send me price and conditions?';

    var benefits = [
      { title: 'Volume pricing', text: 'The more credits you buy, the better your price per credit.', icon: 'M3 17l6-6 4 4 8-8M14 7h7v7' },
      { title: 'Instant activation', text: 'No development or waiting: platforms that are already running.', icon: 'M13 2L4 14h7l-1 8 9-12h-7l1-8z' },
      { title: 'Agent & cashier panel', text: 'Load, withdraw and control balances from your own panel.', icon: 'M3 4h18v12H3zM8 20h8M12 16v4' },
      { title: 'Build your network', text: 'Create cashiers and sub-agents under you and grow your operation.', icon: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM19 8v6M22 11h-6' },
      { title: 'Games from leading providers', text: 'Slots and casino from well-known providers, depending on the platform.', icon: 'M6 11h4M8 9v4M15 12h.01M18 10h.01M17.3 5H6.7a4 4 0 0 0-4 3.6L2 15a3 3 0 0 0 5.5 1.7L9 15h6l1.5 1.7A3 3 0 0 0 22 15l-.7-6.4a4 4 0 0 0-4-3.6z' },
      { title: '24/7 support', text: 'We support you and train you on using the panel.', icon: 'M3 18v-6a9 9 0 0 1 18 0v6M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z' }
    ];

    var faqData = [
      ['What are credits?', 'They are the balance you load into your agent user on the platform. With them you load your cashiers and players.'],
      ['What\'s the minimum purchase?', 'It depends on the platform. Message us on WhatsApp and we\'ll send you the conditions.'],
      ['How is the price set?', 'By volume: the more credits you buy, the better the price. We send you your table based on the amount you handle.'],
      ['How do I pay?', 'In USDT or Argentine pesos (ARS). Once payment is confirmed, we add the credits to your user.'],
      ['Do I need experience?', 'No. We create your user and train you on the agent and cashier panel.'],
      ['What if I want my own platform with my brand?', 'We do that too: visit the Platforms page on our website to see our custom platforms.']
    ];
    var faqs = faqData.map((f, i) => ({ q: f[0], a: f[1], open: this.state.faq === i, expanded: this.state.faq === i ? 'true' : 'false', sign: this.state.faq === i ? '−' : '+', toggle: () => this.setState({ faq: this.state.faq === i ? -1 : i }) }));

    return {
      accent: accent,
      waGeneral: link('Hi, I\'d like information to buy credits.'),
      waCotizar: link('Hi, I\'d like a quote for credits to operate on a platform.'),
      waChat: link('Hi, I want to integrate the communication chat inside my platform so I don\'t depend on WhatsApp.'),
      waTabla: link('Hi, I\'d like to receive the volume price table for credits.'),
      waCustom: link(msg),
      waDisplay: '+' + wa.slice(0, 2) + ' ' + wa.slice(2, 5) + ' ' + wa.slice(5, 8) + ' ' + wa.slice(8),
      preview: msg,
      platforms: platforms, cur: cur, platformOptions: platformOptions,
      roles: roles, pays: pays,
      qty: this.state.qty, name: this.state.name,
      setQty: (e) => this.setState({ qty: e.target.value }),
      setName: (e) => this.setState({ name: e.target.value }),
      setPlatform: (e) => this.setState({ platform: e.target.value }),
      benefits: benefits, faqs: faqs
    };
  }
}

DCApp.mount('dc-root', 'dc-tpl', Component, {"whatsapp": "573205519656", "accent": "#0E7490"});
// Medición: cada clic a WhatsApp envía un evento a Google Analytics y/o Meta Pixel si están instalados.
document.addEventListener('click', function (e) {
  var a = e.target.closest && e.target.closest('a[href^="https://wa.me"]');
  if (!a) return;
  var lugar = (a.textContent || '').trim().slice(0, 60);
  if (window.gtag) gtag('event', 'click_whatsapp', { boton: lugar, pagina: location.hostname });
  if (window.fbq) fbq('track', 'Contact', { content_name: lugar });
});
