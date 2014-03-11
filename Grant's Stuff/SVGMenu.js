var MenuStructure = {
    'File': {
        'Item': document.createElementNS(null, "g"),
        'SubItems': {
            'Import': {
                'Item': document.createElementNS(null, "g"),
                'SubItems': {
                    'Local': {
                        'Item': document.createElementNS(null, "g")
                    },
                    'Server': {
                        'Item': document.createElementNS(null, "g")
                    },
                    'Clipboard': {
                        'Item': document.createElementNS(null, "g")
                    }
                }
            },
            'Export': {
                'Item': document.createElementNS(null, "g"),
                'SubItems': {
                    'Local': {
                        'Item': document.createElementNS(null, "g")
                    },
                    'Server': {
                        'Item': document.createElementNS(null, "g")
                    },
                    'Clipboard': {
                        'Item': document.createElementNS(null, "g")
                    }
                }
            }
        }
    },
    'Edit': {
    },
    'View': {
    }
};

var menuHeirarchy = {
    'File': {
        'Item': document.createElementNS(null, "g"),
        'Import': {
            'Item': document.createElementNS(null, "g"),
            'Local': {
                'Item': document.createElementNS(null, "g"),
                'Parent': "Import.Item",
                'Children': {},
                'Open': null
            },
            'Server': {
                'Item': document.createElementNS(null, "g")
            },
            'Clipboard': {
                'Item': document.createElementNS(null, "g")
            },
            'Open': "Clipboard",
            'Parent': "File.Item",
            'Children': "Local.Item, Server.Item, Clipboard.Item"
        },
        'Export': {
            'Item': document.createElementNS(null, "g"),
            'Local': {
                'Item': document.createElementNS(null, "g")
            },
            'Server': {
                'Item': document.createElementNS(null, "g")
            },
            'Clipboard': {
                'Item': document.createElementNS(null, "g")
            },
            'Parent': "File",
            'Children': "Local.Item, Server.Item, Clipboard.Item"
        },
        'Open': "Import",
        'Parent': "File.Item",
        'Children': "Local.Item, Server.Item, Clipboard.Item"
    }
};

function SVGMenu(x, y) {
    var staticWidth = 150;
    var staticHeight = 30;
    var hideTimer;

    var menuHeirarchy = {
        'Menu': (function () {
            var menuGroup = document.createElementNS(xmlns, "g");
            menuGroup.setAttributeNS(null, "fill", "red");
            menuGroup.addEventListener("mouseout", function (event) {
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
            }, false);
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
    menu.addHeaderItem("Edit");
    menu.addHeaderItem("Select");
    menu.addHeaderItem("Gravity");
    menu.addSubItem(["File"], "Import");
    menu.addSubItem(["File"], "Export");
    menu.addSubItem(["File", "Import"], "Local");
    menu.addSubItem(["File", "Import"], "Server");
    menu.addSubItem(["File", "Import"], "Clipboard");
    menu.addSubItem(["File", "Export"], "Local");
    menu.addSubItem(["File", "Export"], "Server");
    menu.addSubItem(["File", "Export"], "Clipboard");
    menu.addSubItem(["File", "Export", "Clipboard"], "ClipArt");
    menu.addSubItem(["File", "Export", "Clipboard"], "No Clippy");
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
    //menu.bindAction(["File", "Import", "Local"], Graph.selectAllNodes);

    //menu.removeSubItem(["File", "Export", "Clipboard"], "No Clippy");
    //menu.removeSubItem(["File"], "Import");
    menu.append(root);
})();

/*function menuSVG(x, y) {

    function createMenuCell(title, cellX, cellY, header) {
        var cellContainer = document.createElementNS(xmlns, "g");
        cellContainer.setAttributeNS(null, "fill", "red");

        var cellRect = document.createElementNS(xmlns, "rect");
        cellRect.setAttributeNS(null, "x", cellX);
        cellRect.setAttributeNS(null, "y", cellY);
        cellRect.setAttributeNS(null, "width", header ? staticWidth : (staticWidth * 3));
        cellRect.setAttributeNS(null, "height", staticHeight);
        //cellRect.setAttributeNS(null, "pointer-events", "visibleFill");

        var cellText = document.createElementNS(xmlns, "text");
        cellText.setAttributeNS(null, "font-family", "Arial");
        cellText.setAttributeNS(null, "font-size", header ? 12 : 11);
        cellText.setAttributeNS(null, "fill", "white");
        cellText.setAttributeNS(null, "font-weight", "bold");
        cellText.setAttributeNS(null, "x", header ? (cellX + (staticWidth/2)) : (cellX + ((staticWidth * 3) / 6)));
        cellText.setAttributeNS(null, "alignment-baseline", "middle");
        cellText.setAttributeNS(null, "y", (cellY + (staticHeight / 2)));
        cellText.setAttributeNS(null, "text-anchor", header ? "middle" : "start");
        cellText.setAttributeNS(null, "stroke-width", 0);
        cellText.setAttributeNS(null, "pointer-events", "none");
        cellText.textContent = header ? title.toUpperCase() : title;
        
        cellContainer.appendChild(cellRect);
        cellContainer.appendChild(cellText);        

        //cellContainer.setAttributeNS(null, "name", title);
        return cellContainer;
    }

    var optionLookUpTable = {};
    var staticWidth = 75;
    var staticHeight = 30;

    var menuContainer = document.createElementNS(xmlns, "g");
    menuContainer.setAttributeNS(null, "stroke", "red");
    menuContainer.setAttributeNS(null, "stroke-width", "5");

    this.addMenuHeader = function (title) {
        var menuItemContainer = document.createElementNS(xmlns, "g");
        var menuHeader = createMenuCell(title, x, y, true);
        menuHeader.addEventListener("click", function () {
            this.open = true;
            var options = optionLookUpTable[title].optionList;
            for (var option in options) {
                options[option].container.style.visibility = "visible";
            }
            //stop propogation? - dont think since its the top group
        }, false);

        menuHeader.addEventListener("mouseover", function () {
            this.setAttributeNS(null, "fill", "#FF674C");
        }, false);

        menuHeader.addEventListener("mouseout", function () {
            if (!this.open) {
                this.setAttributeNS(null, "fill", "red");
            }
        }, false);

        menuItemContainer.appendChild(menuHeader);

        optionLookUpTable[title] = {
            'container': menuContainer.appendChild(menuItemContainer),
            'optionList': {},
            'nextX': x,
            'nextY': (y + staticHeight),
            'header': true
        };

        x += staticWidth;
    }

    this.addOptionItem = function (parentTitle, title, imageSrcPath) {
       
        var parent = optionLookUpTable[parentTitle];

        var newOptionItem = createMenuCell(title, parent.nextX, parent.nextY, false);
        newOptionItem.style.visibility = "hidden";

        newOptionItem.addEventListener("click", function (event) {            
            var options = optionLookUpTable[title].optionList;
            for (var option in options) {
                options[option].container.style.visibility = "visible";
            }
            event.stopPropagation();
        }, false);

        newOptionItem.addEventListener("mouseover", function () {
            this.setAttributeNS(null, "fill", "#FF674C");            
            event.stopPropagation();
        }, false);

        newOptionItem.addEventListener("mouseout", function (event) {
            this.setAttributeNS(null, "fill", "red");
            var parentOptionList = optionLookUpTable[title].optionList;
            for (var option in parentOptionList) {
                var childOption = parentOptionList[option];
                childOption.container.style.visibility = "hidden";
                childOption.container.setAttributeNS(null, "fill", "red");
            }


            //var parentOption = optionLookUpTable[parentTitle];
            //var parentOptionList = parentOption.optionList;
            //for (var option in parentOptionList) {
              //  var childOption = parentOptionList[option];
                //if (childOption.container !== optionLookUpTable[title].container) {
                  //  var childOptionList = childOption.optionList;
                    //for (var opt in childOptionList) {
                      //  childOptionList[opt].container.style.visibility = "hidden";
                        //childOptionList[opt].container.setAttributeNS(null, "fill", "red");
                    //}
               // }
            //}

            event.stopPropagation();
        }, false);
        
        if (!parent.header) {
            if (!parent.expandArrow) {
                var expandArrow = document.createElementNS(xmlns, "text");
                expandArrow.setAttributeNS(null, "font-family", "Arial");
                expandArrow.setAttributeNS(null, "font-size", 11);
                expandArrow.setAttributeNS(null, "fill", "white");
                expandArrow.setAttributeNS(null, "font-weight", "bold");
                expandArrow.setAttributeNS(null, "x", parent.nextX - ((staticWidth * 3) / 10));
                expandArrow.setAttributeNS(null, "alignment-baseline", "middle");
                expandArrow.setAttributeNS(null, "y", parent.nextY + (staticHeight / 2));
                expandArrow.setAttributeNS(null, "text-anchor", "start");
                expandArrow.setAttributeNS(null, "stroke-width", 0);
                expandArrow.setAttributeNS(null, "pointer-events", "none");
                expandArrow.textContent = ">";
                parent.expandArrow = parent.container.appendChild(expandArrow);
            }
        }

        optionLookUpTable[title] = optionLookUpTable[parentTitle].optionList[title] = {
            'container': parent.container.appendChild(newOptionItem),
            'optionList': {},
            'nextX': (parent.nextX + (staticWidth * 3)),
            'nextY': parent.nextY
        };

        parent.nextY += staticHeight;
    }

    this.removeMenuHeader = function (title) {

    }

    this.removeOptionItem = function () {
    }

    this.append = function (parent) {
        parent.appendChild(menuContainer);
        console.log(optionLookUpTable);
    }

    this.addClickHandler = function (optionItem, handlerFunc) {
        optionLookUpTable[optionItem].container.addEventListener("click", handlerFunc, false);
    }
};*/