'use strict'
document.getElementById('right-click-menu').style.top = -(document.getElementById('right-click-menu').clientHeight) + 'px'; // hide menu by defult
var active = undefined, // does save the index number of the app taht is active
    windowCount = 0; // number of open windows for cicked app
var apps = [];
apps.length = document.getElementsByClassName('app').length; // set lenght of array

function getOffset(el) {
    el = el.getBoundingClientRect();
    return {
        left: el.left + window.scrollX,
        top: el.top + window.scrollY
    }
}

function getStyleRuleValue(style, selector) {
    for (var i = 0; i < document.styleSheets.length; i++) {
        var mysheet = document.styleSheets[i];
        var myrules = mysheet.cssRules ? mysheet.cssRules : mysheet.rules;
        if (myrules === undefined || myrules === null || myrules.length <= 0) {
            continue;
        }
        for (var j = 0; j < myrules.length; j++) {
            if (myrules[j].selectorText && myrules[j].selectorText.toLowerCase() === selector.toLowerCase()) {
                return myrules[j].style[style];
            }
        }
    }
};

/** Module to controloh my preview
 */
var preview = (function() {
    var pub = {};

    function _centerWindows(buttons, previewTag) {
        setTimeout(function() {
            var attValue = buttons[0].getAttribute("breakpoint");
            var num;

            if (attValue > 6) {
                num = getStyleRuleValue("left", "#main #preview .window");
            } else {
                num = getStyleRuleValue("left", "#main #preview .window[breakpoint=\"" + attValue + "\"]");
            }
            wrapper.style.left = -Number(num.slice(0, num.length - 2)) + 20 + "px";

            setTimeout(function() {
                previewTag.style.transition = '140ms';
                document.getElementById('preview').setAttribute("boolean", "true");
            }, 10);
        }, 100);
    }

    function _checkKey(e) {
        var lel; // helper
        e = e || window.event;

        if (e.key == 'ArrowUp') {
            lel = 'ArrowLeft'
        } else if (e.key == 'ArrowDown') {
            lel = 'ArrowRight'
        } else if (e.key == 'ArrowLeft') {
            lel = 'ArrowLeft';
        } else if (e.key == 'ArrowRight') {
            lel = 'ArrowRight';
        }
        preview.scroll(lel);
    }

    /** Initializes preview.
     * Remove the wrapper with all divs(windows) in it
     * and create new one. Do for loop and create as much windows
     * as specified in the windowCount property(or the windowCount attribute).
     * Right now there is needed: window wrapper with header wrapper with
     * textnode inside.
     */
    function _initialize(pos) {
        var previewTag = document.getElementById('preview');
        var appClass = document.getElementsByClassName('app')[pos],
            num = (getOffset(appClass).left) + (appClass.offsetWidth / 2);
        var btn,
            header,
            text,
            wrapper = document.getElementById('wrapper'), // TODO: Make this more specific
            buttons;

        previewTag.style.transition = '0ms';
        if ((num - (previewTag.offsetWidth / 2)) > 0) {
            previewTag.style.left = (num - (previewTag.offsetWidth / 2)) + 'px';
        } else { // prevent preview to go outside the (left side of the) screen
            previewTag.style.left = 0;
        }

        if (wrapper != null) {
            previewTag.removeChild(wrapper); // Remove old wrapper(and all DIVs inside)
        }
        wrapper = document.createElement('DIV');
        wrapper.setAttribute("id", "wrapper");
        previewTag.appendChild(wrapper);
        buttons = wrapper.getElementsByClassName('window');
        for (var i = 0; i < apps[pos].windowCount; i++) {
            btn = document.createElement('DIV');
            header = document.createElement('DIV')
            text = document.createTextNode('Make me active!');

            header.appendChild(text);
            header.setAttribute("class", "header");
            btn.appendChild(header);
            btn.setAttribute("class", "window");
            btn.setAttribute("onclick", "");

            wrapper.appendChild(btn);
        }
        setTimeout(function() {
            for (var i = 0; i < buttons.length; i++) {
                buttons[i].setAttribute("breakpoint", ((buttons.length + 1) - i)); // +1 to avoid breakpoint 1
            }
        }, 22);

        _centerWindows(buttons, previewTag)
        document.onkeydown = _checkKey;
    }

    pub.visible = false;
    pub.position = undefined;
    pub.lastPosition = undefined;
    pub.hide = function() {
        if (preview.visible) {
            preview.visible = 0; // set boolean to "not open" TODO: Use boolean strings ('true', 'false')
            preview.position = undefined; // set preview position to undefined
            document.getElementById('preview').setAttribute("boolean", "false");
            document.onkeydown = "";
        } else {
            console.log("ERR: Conflict: preview already hidden.");
        }
    };
    pub.show = function(pos) {
        if (preview.visible == 0) {
            preview.visible = 1;
            preview.lastPosition = preview.position;
            preview.position = pos;
            _initialize(pos);
        } else {
            console.log("ERR: Conflict: preview already shown.");
        }
    };
    pub.scroll = function(lel) {
        var temp; // stores the new breakpoint value
        var buttons = document.getElementsByClassName('window');
        var help = buttons.length,
            num,
            attValue = buttons[0].getAttribute("breakpoint");
        var previewId = document.getElementById('preview');

        if (lel == 'ArrowLeft' && (Number(buttons[buttons.length - 1].getAttribute("breakpoint")) + 1) < 5) {
            for (var i = 0; i < buttons.length; i++) { // get the ones that needs to get scrolled
                if (buttons[i].getAttribute("breakpoint") == 1) {
                    help = i + 1;
                    break;
                }
            }
            for (var i = 0; i < help; i++) { // actually scroll them
                temp = Number(buttons[i].getAttribute("breakpoint")) + 1;
                buttons[i].setAttribute("breakpoint", temp);
                //_centerWindows(buttons, previewId);
                if (attValue > 6) {
                    num = getStyleRuleValue("left", "#main #preview .window");
                } else {
                    num = getStyleRuleValue("left", "#main #preview .window[breakpoint=\"" + attValue + "\"]");
                }
                wrapper.style.left = -Number(num.slice(0, num.length - 2)) + 20 + "px";
            }

        } else if (lel == 'ArrowRight' && (Number(buttons[0].getAttribute("breakpoint")) - 1) > 3) {
            for (var i = 0; i < buttons.length; i++) { // get the ones that needs to get scrolled
                if (buttons[i].getAttribute("breakpoint") == 1) {
                    help = i;
                    break;
                }
            }
            for (var i = 0; i < help; i++) { // actually scroll them
                temp = Number(buttons[i].getAttribute("breakpoint")) - 1;
                buttons[i].setAttribute("breakpoint", temp);
                //_centerWindows(buttons, previewId);
                if (attValue > 6) {
                    num = getStyleRuleValue("left", "#main #preview .window");
                } else {
                    num = getStyleRuleValue("left", "#main #preview .window[breakpoint=\"" + attValue + "\"]");
                }
                wrapper.style.left = -Number(num.slice(0, num.length - 2)) + 20 + "px";
            }
        }

        return false;
    }

    return pub;
})();

/** Module to control menu (right-click-menu)
 */
var menu = (function() {
    var pub = {};

    function _initialize(pos) {
        var menuId = document.getElementById('right-click-menu');
        var appClass = document.getElementsByClassName('app')[pos];
        var num = (getOffset(appClass).left) + (appClass.offsetWidth / 2);

        menuId.style.transition = "0ms";
        if ((num - (menuId.offsetWidth / 2)) > 0) {
            menuId.style.left = num - (menuId.offsetWidth / 2) + "px";
        } else {
            menuId.style.left = 0;
        }
        num = apps[pos].windowCount;
        if (num < 1) {
            document.getElementsByClassName('entry')[1].setAttribute("clickable", "false");
            document.getElementsByClassName('entry')[1].setAttribute("onclick", "");
        } else {
            document.getElementsByClassName('entry')[1].setAttribute("clickable", 'true');
            document.getElementsByClassName('entry')[1].setAttribute("onclick", "apps[menu.position].closeAllWindows();");
        }

        setTimeout(function() {
            menuId.style.transition = "140ms";
            document.getElementById('right-click-menu').setAttribute("boolean", "true");
            document.getElementById('right-click-menu').style.top = 0;
        }, 10);
    }
    pub.visible = 0;
    pub.position = undefined;
    pub.lastPosition = undefined;
    pub.hide = function() {
        if (menu.visible) {
            document.getElementById('right-click-menu').setAttribute("boolean", "false");
            document.getElementById('right-click-menu').style.top = -(document.getElementById('right-click-menu').clientHeight) + 'px';
            menu.visible = 0;
            menu.lastPosition = menu.position;
            menu.position = undefined;
        } else {
            console.log("ERR: Conflict: Menu already hidden.");
        }
        return false;
    };
    pub.show = function(pos) {
        if (menu.visible == 0) {
            _initialize(pos);
            menu.visible = 1;
            menu.lastPosition = menu.position;
            menu.position = pos;
        } else {
            console.log("ERR: Conflict: Menu already shown.");
        }
        return false;
    };

    return pub;
})();
var app = {};

/**Create object with propertys and methods for every index of "apps" array.
 *That is so every app (visible on the taskbar) has its own propertys and methods
 */
for (var i = 0; i < apps.length; i++) {

    apps[i] = (function() {
        var pub = {};
        var h = i;
        var elem = document.getElementsByClassName('app')[h];

        pub.active = false;
        pub.windowCount = elem.getAttribute('windowCount');
        pub.menu = false; // if is opened on that app
        pub.preview = false; // if preview is opened on that app
        pub.pinned = true; // if app is pinned
        pub.closeAllWindows = function() {
            elem.setAttribute("windowCount", "0"); // reset windowCount
            pub.windowCount = 0;

            if (pub.active) { // if app was active
                console.log("active?: " + pub.active);
                active = undefined; // no active app anymore
                pub.active = true;
                console.log(pub.active);
                elem.setAttribute("active", "false"); // make app inactive
            }
            menu.hide();
            console.log("winCount: " + pub.windowCount);
            console.log("active: " + pub.active);
        };
        pub.addWindow = function() {
            pub.windowCount++;

            elem.setAttribute("windowCount", pub.windowCount);
            elem.setAttribute("active", "true");

            if ((active != h) && (active != undefined)) { // When there was already an active app
                document.getElementsByClassName('app')[active].setAttribute("active", "false"); // old active
            }
            active = h;
            pub.active = true;

            if (preview.visible)
                preview.hide();

            if (menu.visible)
                menu.hide();

        };
        pub.closeWindow = function() {};
        pub.pinToPanel = function() {};

        return pub;
    })();
}

/** Gets triggered on left-click on an app.
 * Does all the fancy logic behind the preview behaviour
 */
function previewAction(clicked) {
    var elem = document.getElementsByClassName('app');
    windowCount = elem[clicked].getAttribute("windowCount");

    if (windowCount == 0) { // If there is no instance already open
        apps[clicked].addWindow();

    } else if (windowCount == 1) {
        elem[clicked].setAttribute("active", "true");
        if (active !== undefined) { // When there was already an (other) active app
            elem[active].setAttribute("active", "false");
        }
        if (active == clicked) { // if clicked app is active one
            active = undefined; // set clicked app to inactive
        } else {
            active = clicked;
            apps[clicked].active = true;
        }
        if (preview.visible) {
            preview.hide();
        }

    } else if (windowCount > 1) {
        if ((preview.position != clicked) && preview.visible) {
            preview.hide(); // Do it twice for reopening with updated content
            setTimeout(function() {
                preview.show(clicked);
            }, 300);
        } else if (preview.visible) { // TODO: Use the preview property from apps module
            preview.hide();
        } else {
            preview.show(clicked);
        }
        if (menu.visible) {
            menu.hide();
        }
    }
}

/** Gets triggered on right-click on an app.
 * Does all the fancy logic behind the right-click-menu behaviour
 */
function menuAction(clicked) {
    if (menu.visible && (menu.position != clicked)) { // looks if menu from other app is open
        menu.hide(); // closes menu from other app
        setTimeout(function() {
            menu.show(clicked);
        }, 300);
    } else if (menu.visible) { // when menu open from clicked app TODO: Use the menu property from apps module
        menu.hide(); // opens/shriks menu
    } else {
        menu.show(clicked);
    }

    if (preview.visible) {
        preview.hide();
    }
    return false;
}

/** Rezises the panel according to the cssRules
 */
function panelSize(size) {
    var rules = document.styleSheets[0]['cssRules'];
    //var selector = rule[].selectorText;
    //var value = rule[].value;
    /** Make object that holds all selectors that should be modified and it holds also what properties should change and with what values
     * Example: '#panel': {height: 2}
     * In this case #panel is the selecor and holds an object that contains height with value 2.
     * This means that the property that should change in the CSS selector #panel is height.
     * The value, in this case 2, references at the "dimensions" object.
     */
    /*var dimensions = {menuButtonSize: 9, menuButtonMargin: 2, appSize: 13, iconSize: 7, margin: 3, marginSmall: 1, indicatorWidth: 6};
    var ruleQuery = {'#panel': {height: 2}, '#panel #menu-button': {height: 0, width: 0, margin: 1}, '#panel #icon-task-list .app': {height: 2, width: 2}, '#panel #icon-task-list .app .indicator': {width: 6, height: 5, margin: 5},
                    '#panel #icon-task-list .app .indicator .blob': {width: 5, height: 5, borderRadius: null}, '#panel #icon-task-list .app .indicator .blob:nth-child(2)': {marginLeft: 5}, '#panel #icon-task-list .app[windowCount="1"] .indicator',
                    '#panel #icon-task-list .app[windowCount="2"] .indicator', '#panel #icon-task-list .app[active="true"] .indicator .blob:nth-child(1)',
                    '#panel #icon-task-list .app[active="true"] .indicator', '#panel #icon-task-list .app .icon', '#panel #icon-task-list .app .icon img'};*/
    // rules[2].style.height = 13 * size + "px";
    document.getElementById('panel').setAttribute("size", size);
}
var background = (function() {
    var pub = {};

    pub.change = function(value) {
        document.getElementsByTagName('body')[0].style.backgroundImage = "url(../SolusDesignConcept/" + value + ")";
    }

    return pub;
})();
