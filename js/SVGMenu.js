
//TO DO'S
//ADD ALL METHODS TO SVGMenu.prototype possibly - though this may eliminate closure capability
//CHANGE THE MENU TO HIDE ONLY WHEN THE USER CLICKS ON A DIFFERENT CONTROL BESIDES THE MENU
//add xmlns to this file because it is in only in Graph.js atm
//prolly should use parentElement - just use parentNode (or in any case such as nextElementSibling)
function SVGMenu(x, y) {    

    var staticWidth = 150;
    var staticHeight = 30;
    var hideTimer;

    var menuHeirarchy = {
        'Menu': (function () {
            var menuGroup = document.createElementNS(xmlns, "g");
            menuGroup.setAttributeNS(null, "fill", "red");
            window.addEventListener("click", function(event){
                if(event.target === Graph.plane.background){
                    if(menuHeirarchy.OpenItem !== null){
                        hide(menuHeirarchy.OpenItem, true);
                    }
                }
            }, false);
            /*menuGroup.addEventListener("blur", function(event){
                hide(this, true);
            }, false);*/
            /*menuGroup.addEventListener("mouseout", function (event) {
                console.log(event.relatedTarget, menuHeirarchy.OpenItem);
                if (event.relatedTarget) {
                    var relatedTarget = event.relatedTarget.parentElement;
                    if (relatedTarget.topParent !== this) {
                        delayHide();
                    }
                }
                else {
                    if (menuHeirarchy.OpenItem !== null) {
                        delayHide()
                    }
                }                
            }, false);*/
            return menuGroup;
        })(),
        'nextX': x,
        'OpenItem': null
    };

    function createMenuItem(title, x, y, header) {
        var itemGroup = document.createElementNS(xmlns, "g");
        itemGroup.topParent = menuHeirarchy.Menu;

        var itemRect = itemGroup.rect = document.createElementNS(xmlns, "rect");
        itemRect.setAttributeNS(null, "x", x);
        itemRect.setAttributeNS(null, "y", y);
        itemRect.setAttributeNS(null, "width", header ? (staticWidth / 2) : staticWidth);       
        itemRect.setAttributeNS(null, "height", staticHeight);
        itemGroup.appendChild(itemRect);

        //var hoverRect = itemGroup.hoverRect = itemRect.cloneNode(false);
        //itemGroup.appendChild(hoverRect);

        var itemText = itemGroup.text = document.createElementNS(xmlns, "text");
        itemText.setAttributeNS(null, "font-family", "Arial");
        itemText.setAttributeNS(null, "font-size", 11);
        itemText.setAttributeNS(null, "fill", "white");
        itemText.setAttributeNS(null, "font-weight", "bold");        
        itemText.setAttributeNS(null, "x", header ? (x + ((staticWidth/2) / 2)) : (x + (staticWidth / 2)));        
        itemText.setAttributeNS(null, "y", y + (staticHeight / 2));
        itemText.setAttributeNS(null, "text-anchor", "middle");
        itemText.setAttributeNS(null, "alignment-baseline", "middle");
        itemText.setAttributeNS(null, "pointer-events", "none");
        itemText.textContent = title;
        itemGroup.appendChild(itemText);

        itemGroup.addEventListener("mouseover", function () {
            console.log("over");
            //var offsetLeftRight = staticWidth / 20;
            var offsetLeftRight = staticHeight / 5;
            var offsetTopBot = staticHeight / 5;
            var hoverRect = document.createElementNS(xmlns, "rect");
            hoverRect.setAttributeNS(null, "x", x + offsetLeftRight);
            hoverRect.setAttributeNS(null, "y", y + offsetTopBot);
            hoverRect.setAttributeNS(null, "width", header ? ((staticWidth/2) - (offsetLeftRight * 2)) : ((staticWidth) - (offsetLeftRight * 2)));
            hoverRect.setAttributeNS(null, "height", (staticHeight - (offsetTopBot * 2)));
            hoverRect.setAttributeNS(null, "fill", "orange");
            hoverRect.setAttributeNS(null, "opacity", .75);
            hoverRect.setAttributeNS(null, "pointer-events", "none");
            itemGroup.insertBefore(hoverRect, itemText);

            itemGroup.addEventListener("mouseout", function out() {
                hoverRect.parentElement.removeChild(hoverRect);
                itemGroup.removeEventListener("mouseout", out, false);
            }, false);

        }, false);

        return itemGroup;
    };

    function searchHeirarchy(){
    };

    function delayHide() {
        console.log("delaying hide");
        hideTimer = setTimeout(function () {
            hide(menuHeirarchy.OpenItem, true);
            menuHeirarchy.OpenItem = null;
        }, 2500);
    };

    function hide(parentItem, recursive) {
        var subItems = parentItem.children;
        for (var n = 0; n < subItems.length; n++) {
            var subItem = subItems[n];
            if (subItem.nodeName === "g") {
                console.log("Hiding", subItem);
                subItem.style.visibility = "hidden";
                if (recursive) {
                    hide(subItem, true);
                }
            }
        }
    };

    function show(parentItem) {
        var subItems = parentItem.children;
        for (var n = 0; n < subItems.length; n++) {
            var subItem = subItems[n];
            if (subItem.nodeName === "g") {
                console.log("Showing", subItem);
                subItem.style.visibility = "visible";
            }
        }
    };

    function addExpandArrow(subItem) {

    };

    /*function checkForChild(parent, item) {
        if (item.parentElement === parent) {
            return true;
        }
        else if (item.parentElement === null) {
            return false;
        }
        else{
            checkForChild(parent, item.parentElement);
        }
        
    }*/

    this.addHeaderItem = function (title) {
        if (menuHeirarchy[title]) {
            return;
            //throw new Error(title + " already exists in the menu.");
        }
        menuHeirarchy[title] = {
            'subItemX': menuHeirarchy.nextX,
            'subItemY': y + staticHeight,
            'OpenItem': null,
            'Item': (function () {
                var itemGroup = createMenuItem(title.toUpperCase(), menuHeirarchy.nextX, y, true);
                menuHeirarchy.Menu.appendChild(itemGroup);
                itemGroup.addEventListener("click", function (event) {
                    if (menuHeirarchy.OpenItem === this) {
                        hide(this, true);
                        menuHeirarchy.OpenItem = null;
                    }
                    else {
                        show(this);
                        menuHeirarchy.OpenItem = this;
                    }
                    //stop event propogation? maybe
                }, false);
                itemGroup.addEventListener("mouseover", function () {
                    clearTimeout(hideTimer);
                    if (menuHeirarchy.OpenItem !== null /*&& menuHeirarchy.OpenItem !== this*/) {
                        hide(menuHeirarchy.OpenItem, true)
                        show(this);
                        menuHeirarchy.OpenItem = this;
                    }
                }, false);
                menuHeirarchy.nextX += staticWidth/2;
                return itemGroup;
            })()
        }
    };

    this.addSubItem = function (parentHeirarchy, title) {
        var heirarchy = menuHeirarchy;
        var errorString = "";
        for (var n = 0; n < parentHeirarchy.length; n++) {
            var nextLevel = parentHeirarchy[n];
            errorString += (nextLevel + " --> ");
            if (heirarchy[nextLevel]) {
                heirarchy = heirarchy[nextLevel];
            }
            else {
                return;
                //throw new Error(errorString.substring(0, errorString.length - 5) + ": Heirarchy does not exist in the menu.");
            }
        }
        if (heirarchy[title]) {
            return;
            //throw new Error((errorString + title) + " already exists in the menu.");
        }
        heirarchy[title] = {
            'subItemX': heirarchy.subItemX + staticWidth,
            'subItemY': heirarchy.subItemY,
            'OpenItem': null,
            'Item': (function () {
                var subItemGroup = createMenuItem(title, heirarchy.subItemX, heirarchy.subItemY, false);
                subItemGroup.id = title;
                subItemGroup.style.visibility = "hidden";
                subItemGroup.addEventListener("mouseover", function (event) {
                    clearTimeout(hideTimer);
                    if (heirarchy.OpenItem !== null && heirarchy.OpenItem !== this) {
                        hide(heirarchy.OpenItem, true);
                    }
                    show(this);
                    heirarchy.OpenItem = this;
                    event.stopPropagation();
                }, false);
                subItemGroup.addEventListener("click", function (event) {
                    hide(menuHeirarchy.OpenItem, true);
                    menuHeirarchy.OpenItem = null;
                    subItemGroup.addEventListener("mouseout", function out(event) {
                        clearTimeout(hideTimer);
                        event.stopPropagation();
                        subItemGroup.removeEventListener("mouseout", out, false);
                    }, false);
                    event.stopPropagation();
                    //do whatever is binded to the item
                }, false);
                heirarchy.Item.appendChild(subItemGroup);
                heirarchy.subItemY += staticHeight;
                return subItemGroup;
            })(),
        };
        //console.log(menuHeirarchy);
    };

    this.insertSubItemBefore = function (newSubItem, something) {

    }

    this.insertSubItemAfter = function (newSubItem, something) {

    }

    this.removeSubItem = function (parentHeirarchy, title) {
        /*var heirarchy = menuHeirarchy;
        var errorString = "";
        for (var n = 0; n < parentHeirarchy.length; n++) {
            var nextLevel = parentHeirarchy[n];
            errorString += (nextLevel + " --> ");
            if (heirarchy[nextLevel]) {
                heirarchy = heirarchy[nextLevel];
            }
            else {
                return;
                //throw new Error(errorString.substring(0, errorString.length - 5) + ": Heirarchy does not exist in the menu.");
            }
        }
        if (!heirarchy[title]) {
            return;
            //throw new Error((errorString + title) + " already exists in the menu.");
        }

        var subItemGroup = heirarchy[title].Item;
        subItemGroup.parentElement.removeChild(subItemGroup);*/
    };

    this.bindAction = function (parentHeirarchy, func) {
        var heirarchy = menuHeirarchy;
        var errorString = "";
        for (var n = 0; n < parentHeirarchy.length; n++) {
            var nextLevel = parentHeirarchy[n];
            errorString += (nextLevel + " --> ");
            if (heirarchy[nextLevel]) {
                heirarchy = heirarchy[nextLevel];
            }
            else {
                return;
                //throw new Error(errorString.substring(0, errorString.length - 5) + ": Heirarchy does not exist in the menu.");
            }
        }
        heirarchy.Item.addEventListener("click", func, false);
    }

    this.append = function (parent) {
        parent.appendChild(menuHeirarchy.Menu);
    };

}

(function presetMenu() {
    var menu = new SVGMenu(0, 0);
    menu.addHeaderItem("File");
    menu.addSubItem(["File"], "Import");
    menu.addSubItem(["File", "Import"], "Local");
    menu.addSubItem(["File", "Import"], "Server");
    menu.addSubItem(["File", "Import"], "Clipboard");
    menu.addSubItem(["File", "Import"], "Website");
    menu.addSubItem(["File"], "Export");    
    menu.addSubItem(["File", "Export"], "Local");
    menu.addSubItem(["File", "Export"], "Server");
    menu.addSubItem(["File", "Export"], "Clipboard");
    menu.addSubItem(["File", "Export"], "Website");

    menu.addHeaderItem("Edit");
    menu.addSubItem(["Edit"], "Undo");
    menu.addSubItem(["Edit"], "Redo");
    menu.addSubItem(["Edit"], "Cut");
    menu.addSubItem(["Edit"], "Copy");
    menu.addSubItem(["Edit"], "Paste");
    menu.addSubItem(["Edit"], "Delete");
    menu.addSubItem(["Edit"], "Scale");

    menu.addHeaderItem("Select");    
    menu.addSubItem(["Select"], "All");
    menu.addSubItem(["Select"], "None");
    menu.addSubItem(["Select"], "Invert");
    menu.addSubItem(["Select"], "Cut-points");
    menu.addSubItem(["Select"], "Dominate");
    menu.addSubItem(["Select"], "Shortest Path");

    menu.addHeaderItem("View");
    menu.addSubItem(["View"], "Panel");
    menu.addSubItem(["View"], "History");
    menu.addSubItem(["View"], "Spreadsheet");
    menu.addSubItem(["View"], "Help");

    menu.addHeaderItem("Graph");
    menu.addSubItem(["Graph"], "Gravity");
    menu.addSubItem(["Graph", "Gravity"], "Landmarks");
    menu.addSubItem(["Graph", "Gravity"], "Vantage Points");
    menu.addSubItem(["Graph", "Gravity"], "Current Flavoring");
    menu.addSubItem(["Graph", "Gravity"], "Find Flavoring");
    menu.addSubItem(["Graph", "Gravity"], "Options");
    menu.addSubItem(["Graph"], "Create Random");
    menu.addSubItem(["Graph", "Create Random"], "Adjacency Matrix");
    menu.addSubItem(["Graph", "Create Random"], "Visual");
    menu.addSubItem(["Graph", "Create Random"], "Tree");
    menu.addSubItem(["Graph", "Create Random"], "Options");
    menu.addSubItem(["Graph"], "Complement");
    menu.addSubItem(["Graph"], "Extrude");
    menu.addSubItem(["Graph"], "Breadth-First");
    menu.addSubItem(["Graph"], "Force");
    menu.addSubItem(["Graph"], "Adjacency Matrix");
    /*menu.addSubItem(["Gravity"], "Run Gravity");
    menu.addSubItem(["File", "Import"], "Local");
    menu.addSubItem(["File", "Import"], "Server");
    menu.addSubItem(["File", "Import"], "Clipboard");
    menu.addSubItem(["File", "Export"], "Local");
    menu.addSubItem(["File", "Export"], "Server");
    menu.addSubItem(["File", "Export"], "Clipboard");
    menu.addSubItem(["File", "Export", "Clipboard"], "Option 1");
    menu.addSubItem(["File", "Export", "Clipboard"], "Option 2");
    menu.addSubItem(["Edit"], "Undo");
    menu.addSubItem(["Edit"], "Redo");
    menu.addSubItem(["Edit"], "Copy");
    menu.addSubItem(["Edit"], "Paste");
    menu.addSubItem(["Edit"], "Extrude");
    menu.addSubItem(["Edit"], "Scale");
    menu.addSubItem(["Select"], "All");
    menu.addSubItem(["Select"], "None");
    menu.addSubItem(["Select"], "Invert");
    menu.addSubItem(["Select"], "Expand");
    menu.bindAction(["Gravity", "Run Gravity"], Graph.runGravity);*/

    //menu.removeSubItem(["File", "Export", "Clipboard"], "No Clippy");
    //menu.removeSubItem(["File"], "Import");
    menu.append(root);
})();

