/* begin Page */
cssFix = function(){
var u = navigator.userAgent.toLowerCase(),
addClass = function(el, val){
	if(! el.className) {
		el.className = val;
	} else {
		var newCl = el.className;
		newCl+=(' '+val);
		el.className = newCl;
	}
},
is = function(t){return (u.indexOf(t)!=-1)};
addClass(document.getElementsByTagName('html')[0],[
(!(/opera|webtv/i.test(u))&&/msie (\d)/.test(u))?('ie ie'+RegExp.$1)
: is('firefox/2')?'gecko firefox2'
: is('firefox/3')?'gecko firefox3'
: is('gecko/')?'gecko'
: is('chrome/')?'chrome'
: is('opera/9')?'opera opera9':/opera (\d)/.test(u)?'opera opera'+RegExp.$1
: is('konqueror')?'konqueror'
: is('applewebkit/')?'webkit safari'
: is('mozilla/')?'gecko':'',
(is('x11')||is('linux'))?' linux'
: is('mac')?' mac'
: is('win')?' win':''
].join(' '));
}();

var ixtEventHelper = {
	'bind': function(obj, evt, fn) {
		if (obj.addEventListener)
			obj.addEventListener(evt, fn, false);
		else if (obj.attachEvent)
			obj.attachEvent('on' + evt, fn);
		else
			obj['on' + evt] = fn;
	}
};

var userAgent = navigator.userAgent.toLowerCase();
var browser = {
	version: (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
	safari: /webkit/.test(userAgent) && !/chrome/.test(userAgent),
	chrome: /chrome/.test(userAgent),
	opera: /opera/.test(userAgent),
	msie: /msie/.test(userAgent) && !/opera/.test(userAgent),
	mozilla: /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent)
};

var ixtLoadEvent = (function() {
	var list = [];
	var done = false;
	var ready = function() {
		if (done) return;
		done = true;
		for (var i = 0; i < list.length; i++)
			list[i]();
	};

	if (document.addEventListener && !browser.opera)
		document.addEventListener('DOMContentLoaded', ready, false);

	if (browser.msie && window == top) {
		(function() {
			try {
				document.documentElement.doScroll('left');
			} catch (e) {
				setTimeout(arguments.callee, 10);
				return;
			}
			ready();
		})();
	}
/*
	if (browser.opera) {
		document.addEventListener('DOMContentLoaded', function() {
			for (var i = 0; i < document.styleSheets.length; i++) {
				if (document.styleSheets[i].disabled) {
					setTimeout(arguments.callee, 10);
					return;
				}
			}
			ready();
		}, false);
	}
*/
	if (browser.safari || browser.chrome) {
		var numStyles;
		(function() {
			if (document.readyState != 'loaded' && document.readyState != 'complete') {
				setTimeout(arguments.callee, 10);
				return;
			}
			if ('undefined' == typeof numStyles) {
				numStyles = document.getElementsByTagName('style').length;
				var links = document.getElementsByTagName('link');
				for (var i = 0; i < links.length; i++) {
					numStyles += (links[i].getAttribute('rel') == 'stylesheet') ? 1 : 0;
				}
				if (document.styleSheets.length != numStyles) {
					setTimeout(arguments.callee, 0);
					return;
				}
			}
			ready();
		})();
	}
	ixtEventHelper.bind(window, 'load', ready);
	return ({
		add: function(f) {
			list.push(f);
		}
	})
})();

(function() {
	// fix ie blinking
	var m = document.uniqueID && document.compatMode && !window.XMLHttpRequest && document.execCommand;
	try { if (!!m) { m('BackgroundImageCache', false, true); } }
	catch (oh) { };
})();

function xGetElementsByClassName(clsName, parentEle, tagName) {
	var elements = null;
	var found = [];
	var s = String.fromCharCode(92);
	var re = new RegExp('(?:^|' + s + 's+)' + clsName + '(?:$|' + s + 's+)');
	if (!parentEle) parentEle = document;
	if (!tagName) tagName = '*';
	elements = parentEle.getElementsByTagName(tagName);
	if (elements) {
		for (var i = 0; i < elements.length; ++i) {
			if (elements[i].className.search(re) != -1) {
				found[found.length] = elements[i];
			}
		}
	}
	return found;
}

var styleUrlCached = null;
function GetStyleUrl() {
    if (null == styleUrlCached) {
        var ns;
        styleUrlCached = '';
        ns = document.getElementsByTagName('link');
        for (var i = 0; i < ns.length; i++) {
            var l = ns[i];
            if (l.href && /style\.ie6\.css(\?.*)?$/.test(l.href)) {
                return styleUrlCached = l.href.replace(/style\.ie6\.css(\?.*)?$/, '');
            }
        }

        ns = document.getElementsByTagName('style');
        for (var i = 0; i < ns.length; i++) {
            var matches = new RegExp('import\\s+"([^"]+\\/)style\\.ie6\\.css"').exec(ns[i].innerHTML);
            if (null != matches && matches.length > 0)
                return styleUrlCached = matches[1];
        }
    }
    return styleUrlCached;
}

function fixPNG(element) {
	if (/MSIE (5\.5|6).+Win/.test(navigator.userAgent)) {
		var src;
		if (element.tagName == 'IMG') {
			if (/\.png$/.test(element.src)) {
				src = element.src;
				element.src = GetStyleUrl() + '../img/spacer.gif';
			}
		}
		else {
			src = element.currentStyle.backgroundImage.match(/url\("(.+\.png)"\)/i);
			if (src) {
				src = src[1];
				element.runtimeStyle.backgroundImage = 'none';
			}
		}
		if (src) element.runtimeStyle.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + src + "')";
	}
}

function ixtHasClass(el, cls) {
	return (el && el.className && (' ' + el.className + ' ').indexOf(' ' + cls + ' ') != -1);
}
/* end Page */

/* begin Menu */
function gTranslateFix() {
	var menus = xGetElementsByClassName("ixt-menu", document);
	for (var i = 0; i < menus.length; i++) {
		var menu = menus[i];
		var childs = menu.childNodes;
		var listItems = [];
		for (var j = 0; j < childs.length; j++) {
			var el = childs[j];
			if (String(el.tagName).toLowerCase() == "li") listItems.push(el);
		}
		for (var j = 0; j < listItems.length; j++) {
			var item = listItems[j];
			var a = null;
			var gspan = null;
			for (var p = 0; p < item.childNodes.length; p++) {
				var l = item.childNodes[p];
				if (!(l && l.tagName)) continue;
				if (String(l.tagName).toLowerCase() == "a") a = l;
				if (String(l.tagName).toLowerCase() == "span") gspan = l;
			}
			if (gspan && a) {
				var t = null;
				for (var k = 0; k < gspan.childNodes.length; k++) {
					var e = gspan.childNodes[k];
					if (!(e && e.tagName)) continue;
					if (String(e.tagName).toLowerCase() == "a" && e.firstChild) e = e.firstChild;
					if (e && e.className && e.className == 't') {
						t = e;
						if (t.firstChild && t.firstChild.tagName && String(t.firstChild.tagName).toLowerCase() == "a") {
							while (t.firstChild.firstChild) t.appendChild(t.firstChild.firstChild);
							t.removeChild(t.firstChild);
						}
						a.appendChild(t);
						break;
					}
				}
				gspan.parentNode.removeChild(gspan);
			}
		}
	}
}
ixtLoadEvent.add(gTranslateFix);

function Insert_Separators() {
	var menus = xGetElementsByClassName("ixt-menu", document);
	for (var i = 0; i < menus.length; i++) {
		var menu = menus[i];
		var childs = menu.childNodes;
		var listItems = [];
		for (var j = 0; j < childs.length; j++) {
			var el = childs[j];
			if (String(el.tagName).toLowerCase() == "li") listItems.push(el);
		}
		for (var j = 0; j < listItems.length - 1; j++) {
			var item = listItems[j];
			var span = document.createElement('span');
			span.className = 'ixt-menu-separator';
			var li = document.createElement('li');
			li.appendChild(span);
			item.parentNode.insertBefore(li, item.nextSibling);
		}
	}
}
ixtLoadEvent.add(Insert_Separators);

function Menu_IE6Setup() {
	var isIE6 = navigator.userAgent.toLowerCase().indexOf("msie") != -1
    && navigator.userAgent.toLowerCase().indexOf("msie 7") == -1;
	if (!isIE6) return;
	var aTmp2, i, j, oLI, aUL, aA;
	var aTmp = xGetElementsByClassName("ixt-menu", document, "ul");
	for (i = 0; i < aTmp.length; i++) {
		aTmp2 = aTmp[i].getElementsByTagName("li");
		for (j = 0; j < aTmp2.length; j++) {
			oLI = aTmp2[j];
			aUL = oLI.getElementsByTagName("ul");
			if (aUL && aUL.length) {
				oLI.UL = aUL[0];
				aA = oLI.getElementsByTagName("a");
				if (aA && aA.length)
					oLI.A = aA[0];
				oLI.onmouseenter = function() {
					this.className += " ixt-menuhover";
					this.UL.className += " ixt-menuhoverUL";
					if (this.A) this.A.className += " ixt-menuhoverA";
				};
				oLI.onmouseleave = function() {
					this.className = this.className.replace(/ixt-menuhover/, "");
					this.UL.className = this.UL.className.replace(/ixt-menuhoverUL/, "");
					if (this.A) this.A.className = this.A.className.replace(/ixt-menuhoverA/, "");
				};
			}
		}
	}
}
ixtLoadEvent.add(Menu_IE6Setup);
/* end Menu */

/* begin Button */
function ixtButtonsSetupJsHover(className) {
	var tags = ["input", "a", "button"];
	for (var j = 0; j < tags.length; j++){
		var buttons = xGetElementsByClassName(className, document, tags[j]);
		for (var i = 0; i < buttons.length; i++) {
			var button = buttons[i];
			if (!button.tagName || !button.parentNode) return;
			if (!ixtHasClass(button.parentNode, 'ixt-button-wrapper')) {
				if (!ixtHasClass(button, 'ixt-button')) button.className += ' ixt-button';
				var wrapper = document.createElement('span');
				wrapper.className = "ixt-button-wrapper";
				if (ixtHasClass(button, 'active')) wrapper.className += ' active';
				var spanL = document.createElement('span');
				spanL.className = "l";
				spanL.innerHTML = " ";
				wrapper.appendChild(spanL);
				var spanR = document.createElement('span');
				spanR.className = "r";
				spanR.innerHTML = " ";
				wrapper.appendChild(spanR);
				button.parentNode.insertBefore(wrapper, button);
				wrapper.appendChild(button);
			}
			ixtEventHelper.bind(button, 'mouseover', function(e) {
				e = e || window.event;
				wrapper = (e.target || e.srcElement).parentNode;
				wrapper.className += " hover";
			});
			ixtEventHelper.bind(button, 'mouseout', function(e) {
				e = e || window.event;
				button = e.target || e.srcElement;
				wrapper = button.parentNode;
				wrapper.className = wrapper.className.replace(/hover/, "");
				if (!ixtHasClass(button, 'active')) wrapper.className = wrapper.className.replace(/active/, "");
			});
			ixtEventHelper.bind(button, 'mousedown', function(e) {
				e = e || window.event;
				button = e.target || e.srcElement;
				wrapper = button.parentNode;
				if (!ixtHasClass(button, 'active')) wrapper.className += " active";
			});
			ixtEventHelper.bind(button, 'mouseup', function(e) {
				e = e || window.event;
				button = e.target || e.srcElement;
				wrapper = button.parentNode;
				if (!ixtHasClass(button, 'active')) wrapper.className = wrapper.className.replace(/active/, "");
			});
		}
	}
}

ixtLoadEvent.add(function() { ixtButtonsSetupJsHover("ixt-button"); });
/* end Button */

