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
  constructor(props) { super(props); this.state = { api: 0, interest: 0, name: '' }; }
  renderVals() {
    var accent = this.props.accent ?? '#1D4ED8';
    var wa = String(this.props.whatsapp ?? '573205519656').replace(/\D/g, '');
    var link = function (t) { return 'https://wa.me/' + wa + '?text=' + encodeURIComponent(t); };

    var R = 220;
    var orbitData = [['Plataformas', '#1D4ED8'], ['Fichas', '#0E7490'], ['API', '#6D28D9'], ['Chat integrado', '#25D366'], ['Panel multinivel', '#FBBF24']];
    var orbit = orbitData.map(function (o, i) {
      var ang = (i / orbitData.length) * Math.PI * 2 - Math.PI / 2;
      var x = Math.round(Math.cos(ang) * R), y = Math.round(Math.sin(ang) * R);
      return { label: o[0], color: o[1], pos: 'position: absolute; left: calc(50% + ' + x + 'px); top: calc(50% + ' + y + 'px); transform: translate(-50%, -50%)' };
    });

    var plats = [
      ['Bet30', '/assets/69bba896-bet30.webp', '/assets/ccbb7011-bet30-prev.webp'],
      ['Rey Bet', '/assets/793c2ae8-reybet.webp', '/assets/0a804136-reybet-prev.webp'],
      ['Casino Zeus', '/assets/004cb616-casinozeus.webp', '/assets/d8f7c6db-casinozeus-prev.webp'],
      ['Tío Rico Juegos', '/assets/cbf124a9-tiorico.webp', '/assets/32ce5755-tiorico-prev.webp'],
      ['Ganamos VIP', '/assets/c5797625-ganamosvip.webp', '/assets/b577096c-ganamosvip-prev.webp'],
      ['Casino Zeta', '/assets/881f1b2b-casinozeta.webp', '/assets/13ae23b3-casinozeta-prev.webp'],
      ['Celuapuestas', '/assets/c5739fd8-celuapuestas.webp', '/assets/75f8a6ad-celuapuestas-prev.webp'],
      ['Gana en Casa', '/assets/8fe427d4-ganaencasa.webp', '/assets/51b46328-ganaencasa-prev.webp'],
      ['Cash Master', '/assets/5903b74d-cashmaster.webp', '/assets/2a7416ee-cashmaster-prev.webp'],
      ['Ganamos', '/assets/2f1e68c9-ganamoslat.webp', '/assets/20dfeb26-ganamoslat-prev.webp'],
      ['Ganá Aquí', '/assets/7e66c580-ganaaqui.webp', '/assets/bd1250c9-ganaaqui-prev.webp']
    ];
    var examples = plats.map(function (p) { return { name: p[0], logo: p[1], preview: p[2] }; });
    var marquee = plats.map(function (p) { return { logo: p[1], alt: p[0] }; }).concat(plats.map(function (p) { return { logo: p[1], alt: '' }; }));

    var services = [
      { tag: 'Tu propia marca', title: 'Plataformas personalizadas', text: 'Tu casino online con tu dominio, logo y colores, panel multinivel y proveedores integrados. Lista en 1 semana.', cta: 'Ver plataformas', href: '/plataformas/', hasImg: true, img: '/assets/d8f7c6db-casinozeus-prev.webp', bg: 'linear-gradient(135deg, #1D4ED8, #1D4ED8)', icon: 'M3 4h18v12H3zM8 20h8M12 16v4' },
      { tag: 'Opera hoy', title: 'Venta de fichas', text: 'Para agentes y cajeros: compra fichas en 11 plataformas listas y carga a tus jugadores. Pago en USDT o ARS.', cta: 'Comprar fichas', href: '/fichas/', hasImg: true, img: '/assets/0a804136-reybet-prev.webp', bg: 'linear-gradient(135deg, #0E7490, #0E7490)', icon: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v10M9 9.5h4.5a1.5 1.5 0 0 1 0 3h-3a1.5 1.5 0 0 0 0 3H15' },
      { tag: 'Integraciones', title: 'API de juegos', text: 'Más de 2.000 juegos de los proveedores más jugados —Evolution, Pragmatic Play, PG Soft y más— con una sola integración.', cta: 'Conocer la API', href: '/api/', hasImg: false, img: '', bg: 'linear-gradient(135deg, #5B21B6, #6D28D9)', icon: 'M8 9l-4 3 4 3M16 9l4 3-4 3M14 5l-4 14' },
      { tag: 'Sin depender de WhatsApp', title: 'Chat integrado', text: 'Un chat de comunicación dentro de la plataforma para que un bloqueo de WhatsApp no te cueste jugadores ni ventas.', cta: 'Ver cómo funciona', href: '/plataformas/#chat', hasImg: false, img: '', bg: 'linear-gradient(135deg, #15803D, #25D366)', icon: 'M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.4A8 8 0 1 1 21 12z' }
    ];

    var apiLabels = ['API de juegos y proveedores', 'API del panel y automatizaciones'];
    var tb = 'border: 0; border-radius: 8px; font: inherit; font-weight: 600; font-size: 15px; padding: 11px 18px; min-height: 44px; cursor: pointer; ';
    var apiTabs = apiLabels.map((l, i) => ({ label: l, selected: i === this.state.api ? 'true' : 'false', style: tb + (i === this.state.api ? 'background: ' + accent + '; color: #FFFFFF;' : 'background: transparent; color: #334155;'), pick: () => this.setState({ api: i }) }));

    var flowLabels = ['Proveedor', 'API', 'ProGaming', 'Tu plataforma', 'Jugador'];
    var flow = flowLabels.map(function (l, i) {
      var hl = i === 2;
      return { n: '0' + (i + 1), label: l, arrow: i < flowLabels.length - 1,
        style: 'flex: 1 1 140px; border-radius: 12px; padding: 16px; text-align: center; ' + (hl ? 'background: ' + accent + '; color: #FFFFFF;' : 'border: 1px solid #CBD5E1; color: #0B1630;') };
    });
    var provCaps = [
      { t: 'Catálogo de juegos', d: 'Incorporación y actualización de juegos de distintos proveedores.' },
      { t: 'Autenticación de jugadores', d: 'Conexión entre la cuenta del jugador y el proveedor.' },
      { t: 'Saldo y transacciones', d: 'Validación de apuestas, premios, cargas y movimientos.' },
      { t: 'Sesiones de juego', d: 'Creación y gestión de las sesiones de los jugadores.' },
      { t: 'Historial y reportes', d: 'Información de las operaciones realizadas.' },
      { t: 'Bonos y promociones', d: 'Funciones promocionales cuando el proveedor las soporta.' },
      { t: 'Sincronización automática', d: 'Disponibilidad de juegos siempre actualizada.' },
      { t: 'Gestión centralizada', d: 'Todos los proveedores desde un mismo panel.' }
    ];
    var panelCaps = [
      { n: '1', t: 'Crear usuarios automáticamente', d: 'El chatbot da de alta al jugador sin que tu cajero intervenga.' },
      { n: '2', t: 'Cargar y descargar saldo', d: 'Acredita fichas a un usuario según lo que se pida en el chat.' },
      { n: '3', t: 'Conecta tus herramientas', d: 'Chatbots, Zapier, Make, n8n o el desarrollo de tu equipo.' },
      { n: '4', t: 'Acceso con token seguro', d: 'Autenticación por API token, ideal para automatizaciones.' }
    ];

    var apiStats = [
      { big: '+2.000', t: 'Juegos disponibles', d: 'Tragamonedas, ruletas, video póker y casino en vivo.' },
      { big: '1', t: 'Sola integración', d: 'Múltiples proveedores desde un mismo punto.' },
      { big: 'Auto', t: 'Juegos siempre al día', d: 'Los nuevos títulos y actualizaciones llegan solos.' }
    ];
    var provs = [
      { name: 'Evolution', logo: '', text: true },
      { name: 'Pragmatic Play', logo: '', text: true },
      { name: 'NetEnt', logo: '/assets/d48e454e-prov-netent.webp', text: false },
      { name: 'PG Soft', logo: '/assets/a6cdbbbb-prov-pgsoft.webp', text: false },
      { name: 'Microgaming', logo: '/assets/75151d94-prov-microgaming.webp', text: false },
      { name: 'Aristocrat', logo: '/assets/7a6ba0cc-prov-aristocrat.webp', text: false },
      { name: 'Novomatic', logo: '/assets/5db9c77a-prov-novomatic.webp', text: false },
      { name: 'IGT', logo: '/assets/d8b3874c-prov-igt.webp', text: false },
      { name: 'Scientific Games', logo: '/assets/f9bf0110-prov-scientific-games.webp', text: false },
      { name: 'EGT Interactive', logo: '/assets/aa1304a9-prov-egt.webp', text: false },
      { name: 'EGT Digital', logo: '/assets/3ddd285a-prov-egt-digital.webp', text: false },
      { name: 'Spribe', logo: '/assets/741d69d5-prov-spribe.webp', text: false },
      { name: 'Habanero', logo: '/assets/ab908f42-prov-habanero.webp', text: false },
      { name: 'RubyPlay', logo: '/assets/c8762139-prov-rubyplay.webp', text: false },
      { name: 'Booming Games', logo: '/assets/6e9f4f37-prov-booming.webp', text: false },
      { name: 'ELK Studios', logo: '/assets/eca9c30c-prov-elk.webp', text: false },
      { name: 'JILI', logo: '/assets/676dce19-prov-jili.webp', text: false },
      { name: 'Amatic', logo: '/assets/a72d7feb-prov-amatic.webp', text: false },
      { name: 'Inbet Games', logo: '/assets/c4cf1968-prov-inbet.webp', text: false },
      { name: 'Igrosoft', logo: '/assets/f289495f-prov-igrosoft.webp', text: false },
      { name: 'Apex', logo: '/assets/754bf550-prov-apex.webp', text: false },
      { name: 'DLV', logo: '/assets/7083ac23-prov-dlv.webp', text: false },
      { name: 'Fire Kirin', logo: '/assets/5a0df4c0-prov-firekirin.webp', text: false }
    ].map(function (p) { return { name: p.name, logo: p.logo, isText: p.text, isImg: !p.text }; });
    var provLoop = provs.concat(provs);
    var whys = [
      { big: '24/7', t: 'Soporte técnico', d: 'Monitoreo continuo y atención para ti y tu equipo.' },
      { big: '11', t: 'Plataformas operando', d: 'Marcas que ya funcionan con nuestra tecnología.' },
      { big: '+2.000', t: 'Juegos por API', d: 'Un solo punto de integración para tu catálogo.' },
      { big: 'ARS · USDT', t: 'Pagos flexibles', d: 'Pago de fichas en pesos argentinos o USDT.' }
    ];

    var labels = ['Una plataforma con mi marca', 'Comprar fichas', 'Integrar la API', 'Chat integrado / automatizaciones', 'Ser distribuidor / socio'];
    var sel = this.state.interest;
    var nm = (this.state.name || '').trim();
    var msg = (nm ? 'Hola, soy ' + nm + '. ' : 'Hola. ') + 'Me interesa: ' + labels[sel] + '. Quiero más información sobre ProGaming Solutions.';
    var ob = 'font: inherit; font-size: 15px; font-weight: 500; text-align: left; padding: 12px 14px; border-radius: 8px; min-height: 48px; cursor: pointer; ';
    var options = labels.map((l, i) => ({ label: l, pressed: i === sel ? 'true' : 'false', style: ob + (i === sel ? 'background: rgba(37,211,102,0.12); border: 1.5px solid #25D366; color: #0B1630;' : 'background: #FFFFFF; border: 1px solid #CBD5E1; color: #334155;'), pick: () => this.setState({ interest: i }) }));

    return {
      accent: accent, orbit: orbit, examples: examples, marquee: marquee, services: services,
      apiTabs: apiTabs, provLoop: provLoop, apiStats: apiStats, apiProv: this.state.api === 0, apiPanel: this.state.api === 1, flow: flow, provCaps: provCaps, panelCaps: panelCaps,
      whys: whys, options: options, preview: msg, name: this.state.name,
      setName: (e) => this.setState({ name: e.target.value }),
      waGeneral: link('Hola, quiero información sobre los servicios de ProGaming Solutions.'),
      waApi: link('Hola, quiero información para integrar la API de ProGaming Solutions.'),
      waChat: link('Hola, quiero el chat de comunicación integrado en mi plataforma para no depender de WhatsApp.'),
      waCustom: link(msg),
      waDisplay: '+' + wa.slice(0, 2) + ' ' + wa.slice(2, 5) + ' ' + wa.slice(5, 8) + ' ' + wa.slice(8)
    };
  }
}

DCApp.mount('dc-root', 'dc-tpl', Component, {"whatsapp": "573205519656", "accent": "#1D4ED8"});
// Medición: cada clic a WhatsApp envía un evento a Google Analytics y/o Meta Pixel si están instalados.
document.addEventListener('click', function (e) {
  var a = e.target.closest && e.target.closest('a[href^="https://wa.me"]');
  if (!a) return;
  var lugar = (a.textContent || '').trim().slice(0, 60);
  if (window.gtag) gtag('event', 'click_whatsapp', { boton: lugar, pagina: location.hostname });
  if (window.fbq) fbq('track', 'Contact', { content_name: lugar });
});
