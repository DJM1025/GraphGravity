//TO DO'S
//ADD ALL METHODS TO SVGMenu.prototype possibly - though this may eliminate closure capability
//CHANGE THE MENU TO HIDE ONLY WHEN THE USER CLICKS ON A DIFFERENT CONTROL BESIDES THE MENU
//add xmlns to this file because it is in only in Graph.js atm
//prolly shouldn't use parentElement - just use parentNode (or in any case such as nextElementSibling)
//possibly make an invisible rect that can tell when they click off of the menu?
//make a slight delay before hiding a submenu and showing a new submenu so the user can "cut-corners"
//on mouseout of main group - if related target is not a child, set a variable to hide? maybe?
//remember, this is a library - if the programmer wants to bind events to stupid items in the menu then they can go for it (just don't do it in yours)
//for binding functions to the items - make an automatic call to the wrapper function that closes the menu and then calls the binded function (so i don't repeat the close module)
//openItem functionaly is all clunky and stuff
//Object.defineProperty !!!!!
//Error handling or no?
//maybe instead of transparency in image shortcuts, make it black (sketch)
//must remember that I must only keep the next level open when hovering, close as you backtrack as well
window.addEventListener("load", function loadMenu() {
    window.SVGMenu = function SVGMenu(/*parent,*/x, y) {
        var xmlns = "http://www.w3.org/2000/svg";
        var xlink = "http://www.w3.org/1999/xlink";

        //this need to be a parameter
        var parentSVG = document.getElementById("parentSVG");

        //var headerItemWidth = 100; //is this even used?
        var subItemWidth = 200;
        var itemHeight = 30;
        var titleOffset = subItemWidth / 6;
        var shortcutOffset = subItemWidth * (2 / 3);
        var expandArrowOffset = (subItemWidth - (subItemWidth / 6)) + (subItemWidth / 10);
        var imgOffsetHz = (subItemWidth / 6) * (1/5);
        var imgOffsetVt = itemHeight * (1/4);
        var imgWidth = (subItemWidth / 6) - (imgOffsetHz * 2);
        var imgHeight = itemHeight - (imgOffsetVt * 2);
        var hideTimer;

        var menuHeirarchy = {
            'Menu': (function () {
                var menuGroup = document.createElementNS(xmlns, "g");
                menuGroup.setAttributeNS(null, "fill", "black");
                window.addEventListener("mousedown", function (event) {
                    //this is temporary and shitty because it doesnt work when you click nodes
                    if (/*event.target === Graph.plane.background*/event.target.id === "graphBackground") {
                        if (menuHeirarchy.OpenItem !== null) {
                            hide(menuHeirarchy.OpenItem, true);
                            menuHeirarchy.OpenItem = null;
                            //NEED TO MAKE THE OPEN ITEM NULL, BECAUSE WHEN THIS HAPPENS THEN I MOUSEOVER THE MENU IT IS ACTING LIKE IT IS ALREADY OPEN!
                        }
                    }
                }, false);
                return menuGroup;
            })(),
            'nextX': x,
            'OpenItem': null
        };

        function createMenuItem(title, x, y, header, shortcut, img) {
            var itemGroup = document.createElementNS(xmlns, "g");
            itemGroup.topParent = menuHeirarchy.Menu;

            var itemRect = itemGroup.rect = document.createElementNS(xmlns, "rect");
            itemRect.setAttributeNS(null, "x", x);
            itemRect.setAttributeNS(null, "y", y);
            //itemRect.setAttributeNS(null, "width", shortcut ? subItemWidth : (subItemWidth / 2));
            itemRect.setAttributeNS(null, "width", header ? (subItemWidth / 2) : subItemWidth);
            itemRect.setAttributeNS(null, "height", itemHeight);
            itemRect.setAttributeNS(null, "stroke", "white");
            itemGroup.appendChild(itemRect);

            //var hoverRect = itemGroup.hoverRect = itemRect.cloneNode(false);
            //itemGroup.appendChild(hoverRect);
            
            var itemTitleText = itemGroup.text = document.createElementNS(xmlns, "text");
            itemTitleText.setAttributeNS(null, "font-family", "Arial");
            itemTitleText.setAttributeNS(null, "font-size", 11);
            itemTitleText.setAttributeNS(null, "fill", "white");
            itemTitleText.setAttributeNS(null, "font-weight", "bold");
            //itemText.setAttributeNS(null, "x", shortcut ? (x + (subItemWidth / 2)) : (x + ((subItemWidth / 2) / 2)));
            itemTitleText.setAttributeNS(null, "x", header ? (x + ((subItemWidth / 2) / 2)) : (x + titleOffset));
            itemTitleText.setAttributeNS(null, "y", y + (itemHeight / 2));
            itemTitleText.setAttributeNS(null, "text-anchor", header ? "middle" : "left");
            itemTitleText.setAttributeNS(null, "alignment-baseline", "middle");
            itemTitleText.setAttributeNS(null, "pointer-events", "none");
            itemTitleText.textContent = title;
            itemGroup.appendChild(itemTitleText);

            if (!header) {
                if (shortcut) {
                    var itemShortcutText = itemGroup.text = document.createElementNS(xmlns, "text");
                    itemShortcutText.setAttributeNS(null, "font-family", "Arial");
                    itemShortcutText.setAttributeNS(null, "font-size", 11);
                    itemShortcutText.setAttributeNS(null, "fill", "white");
                    itemShortcutText.setAttributeNS(null, "font-weight", "bold");
                    itemShortcutText.setAttributeNS(null, "x", x + shortcutOffset);
                    itemShortcutText.setAttributeNS(null, "y", y + (itemHeight / 2));
                    itemShortcutText.setAttributeNS(null, "alignment-baseline", "middle");
                    itemShortcutText.setAttributeNS(null, "pointer-events", "none");
                    itemShortcutText.textContent = shortcut;
                    itemGroup.appendChild(itemShortcutText);
                }

                if (img) {
                    var itemImage = document.createElementNS(xmlns, "image");
                    itemImage.setAttributeNS(xlink, "xlink:href", img);
                    itemImage.setAttributeNS(null, "x", x +imgOffsetHz);
                    itemImage.setAttributeNS(null, "y", y + imgOffsetVt);
                    itemImage.setAttributeNS(null, "width", imgWidth);
                    itemImage.setAttributeNS(null, "height", imgHeight);
                    itemGroup.appendChild(itemImage);
                }
            }

            itemGroup.addEventListener("mouseover", function () {
                //var offsetLeftRight = subItemWidth / 20;
                var offsetLeftRight = itemHeight / 5;
                var offsetTopBot = itemHeight / 5;
                var hoverRect = document.createElementNS(xmlns, "rect");
                hoverRect.setAttributeNS(null, "x", x + offsetLeftRight);
                hoverRect.setAttributeNS(null, "y", y + offsetTopBot);
                //hoverRect.setAttributeNS(null, "width", shortcut ? ((subItemWidth) - (offsetLeftRight * 2)) :((subItemWidth / 2) - (offsetLeftRight * 2)));            
                hoverRect.setAttributeNS(null, "width", header ? ((subItemWidth / 2) - (offsetLeftRight * 2)) : ((subItemWidth) - (offsetLeftRight * 2)));
                hoverRect.setAttributeNS(null, "height", (itemHeight - (offsetTopBot * 2)));
                hoverRect.setAttributeNS(null, "fill", "white");
                hoverRect.setAttributeNS(null, "opacity", .25);
                hoverRect.setAttributeNS(null, "pointer-events", "none");
                itemGroup.insertBefore(hoverRect, itemTitleText);
                if (this.expandArrow) {
                    this.expandArrow.setAttributeNS(null, "fill", "red");
                }    
                itemGroup.addEventListener("mouseout", function out() {
                    hoverRect.parentElement.removeChild(hoverRect);
                    /*if (this.expandArrow) {
                        //this.expandArrow.setAttributeNS(null, "fill", "white");
                    }*/
                    itemGroup.removeEventListener("mouseout", out, false);
                }, false);
    
            }, false);
            return itemGroup;
        };

        function searchHeirarchy() {
        };

        function delayHide() {
            //console.log("delaying hide");
            hideTimer = setTimeout(function () {
                hide(menuHeirarchy.OpenItem, true);
                menuHeirarchy.OpenItem = null;
            }, 2500);
        };

        function hide(parentItem, recursive) {
            /*for (var q in menuHeirarchy["File"]) {
                console.log(q, typeof(q), menuHeirarchy["File"][q]);
            }*/
            if (parentItem.expandArrow) {
                parentItem.expandArrow.setAttributeNS(null, "fill", "white");
            }
            var subItems = parentItem.childNodes/*children*/;
            for (var n = 0; n < subItems.length; n++) {
                var subItem = subItems[n];
                if (subItem.nodeName === "g") {
                    //console.log("Hiding", subItem);
                    subItem.style.visibility = "hidden";
                    //if (recursive) {
                        hide(subItem, true);
                    //}
                }
            }
        };

        function show(parentItem) {
            var subItems = parentItem.children;
            for (var n = 0; n < subItems.length; n++) {
                var subItem = subItems[n];
                if (subItem.nodeName === "g") {
                    //console.log("Showing", subItem);
                    subItem.style.visibility = "visible";
                }
            }
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
                'subItemY': y + itemHeight,
                'OpenItem': null,
                'Item': (function () {
                    var itemGroup = createMenuItem(title.toUpperCase(), menuHeirarchy.nextX, y, true);
                    menuHeirarchy.Menu.appendChild(itemGroup);
                    itemGroup.addEventListener("click", function (/*event*/) {
                        if (menuHeirarchy.OpenItem === this) {
                            hide(this, true);
                            menuHeirarchy.OpenItem = null;
                        }
                        else {
                            show(this);
                            menuHeirarchy.OpenItem = this;
                        }
                        //stop event propogation? maybe? maybe even capture
                    }, false/*true*/);
                    itemGroup.addEventListener("mouseover", function () {
                        //clearTimeout(hideTimer);
                        if (menuHeirarchy.OpenItem !== null /*&& menuHeirarchy.OpenItem !== this*/) { ///<--delay hiding subitems if hovering over the open header item
                            console.log("showing new");
                            hide(menuHeirarchy.OpenItem, true)
                            show(this);
                            menuHeirarchy.OpenItem = this;
                        }
                    }, false);
                    menuHeirarchy.nextX += subItemWidth / 2;
                    return itemGroup;
                })()
            }
        };

        this.addSubItem = function (parentHeirarchy, title, shortcut, img) {
            var heirarchy = menuHeirarchy;
            for (var n = 0; n < parentHeirarchy.length; n++) {
                var nextLevel = parentHeirarchy[n];
                if (heirarchy[nextLevel]) {
                    heirarchy = heirarchy[nextLevel];
                }
                else {
                    return;
                }
            }
            if (heirarchy[title]) {
                return;
            }
            if (parentHeirarchy.length > 1 && !heirarchy.Item.expandArrow) {
                var item = heirarchy.Item;
                console.log("Expand arrow added to", heirarchy.Item.id);
                var point1 = {
                    'x': item.expandArrowX - (subItemWidth / 50),
                    'y': item.expandArrowY - (subItemWidth / 50)
                };
                var point2 = {
                    'x': item.expandArrowX - (subItemWidth / 50),
                    'y': item.expandArrowY + (subItemWidth / 50)
                };
                var point3 = {
                    'x': item.expandArrowX + (subItemWidth / 50),
                    'y': item.expandArrowY
                };
                var expandArrow = document.createElementNS(xmlns, "polygon");
                expandArrow.setAttributeNS(null, "points", point1.x + "," + point1.y + " " + point2.x + "," + point2.y + " " + point3.x + "," + point3.y);
                expandArrow.setAttributeNS(null, "fill", "white");
                heirarchy.Item.expandArrow = heirarchy.Item.appendChild(expandArrow);
                //heirarchy.Item.expandArrow = true;
            }
            /*Object.defineProperty(heirarchy, title, {
                'subItemX': heirarchy.subItemX + subItemWidth - 5,
                'subItemY': heirarchy.subItemY + 3,
                'OpenItem': null,
                'Item': (function () {
                    //var subItemGroup = createMenuItem(title, heirarchy.subItemX, heirarchy.subItemY, shortcut, img);
                    var subItemGroup = createMenuItem(title, heirarchy.subItemX, heirarchy.subItemY, false, shortcut, img);
                    subItemGroup.id = title;
                    subItemGroup.style.visibility = "hidden";
                    subItemGroup.expandArrowX = heirarchy.subItemX + expandArrowOffset;
                    subItemGroup.expandArrowY = heirarchy.subItemY + (itemHeight / 2);
                    subItemGroup.addEventListener("mouseover", function (event) {
                        //clearTimeout(hideTimer);
                        console.log(heirarchy.OpenItem);
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
                        //subItemGroup.addEventListener("mouseout", function out(event) {
                        //    clearTimeout(hideTimer);
                        //    event.stopPropagation();
                        //    subItemGroup.removeEventListener("mouseout", out, false);
                        //}, false);
                        event.stopPropagation();
                        //do whatever is binded to the item
                    }, false);
                    //heirarchy.Item.appendChild(subItemGroup);
                    var firstSubItem = heirarchy.Item.firstChild.nextSibling.nextSibling;
                    heirarchy.Item.insertBefore(subItemGroup, firstSubItem);
                    heirarchy.subItemY += itemHeight;
                    return subItemGroup;
                })(),
            });*/
            heirarchy[title] = {
                'subItemX': heirarchy.subItemX + subItemWidth - 5,
                'subItemY': heirarchy.subItemY + 3,
                'OpenItem': null,
                'Item': (function () {
                    //var subItemGroup = createMenuItem(title, heirarchy.subItemX, heirarchy.subItemY, shortcut, img);
                    var subItemGroup = createMenuItem(title, heirarchy.subItemX, heirarchy.subItemY, false, shortcut, img);
                    subItemGroup.id = title;
                    subItemGroup.style.visibility = "hidden";
                    subItemGroup.expandArrowX = heirarchy.subItemX + expandArrowOffset;
                    subItemGroup.expandArrowY = heirarchy.subItemY + (itemHeight / 2);
                    subItemGroup.addEventListener("mouseover", function (event) {
                        //clearTimeout(hideTimer);
                        console.log(heirarchy.OpenItem);
                        if (heirarchy.OpenItem !== null && heirarchy.OpenItem !== this) {
                            hide(heirarchy.OpenItem, true);
                        }
                        show(this);
                        heirarchy.OpenItem = this;
                        event.stopPropagation();
                    }, false);
                    subItemGroup.addEventListener("click", function (event) {
                      //  hide(menuHeirarchy.OpenItem, true);
                        //menuHeirarchy.OpenItem = null;
                        /*subItemGroup.addEventListener("mouseout", function out(event) {
                            clearTimeout(hideTimer);
                            event.stopPropagation();
                            subItemGroup.removeEventListener("mouseout", out, false);
                        }, false);*/
                        event.stopPropagation();
                        //do whatever is binded to the item
                    }, false);
                    //heirarchy.Item.appendChild(subItemGroup);
                    var firstSubItem = heirarchy.Item.firstChild.nextSibling.nextSibling;
                    heirarchy.Item.insertBefore(subItemGroup, firstSubItem);
                    heirarchy.subItemY += itemHeight;
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
            for (var n = 0; n < parentHeirarchy.length; n++) {
                var nextLevel = parentHeirarchy[n];
                if (heirarchy[nextLevel]) {
                    heirarchy = heirarchy[nextLevel];
                }
                else {
                    return;
                }
            }
            heirarchy.Item.addEventListener("click", function (event) {
                hide(menuHeirarchy.OpenItem, true);
                menuHeirarchy.OpenItem = null;
                func();
            }, false);            
        }

        this.append = function (parent) {
            parent.appendChild(menuHeirarchy.Menu);
        };

        this.addSubItemShortcut = function () {
        };

        this.addSubItemImg = function () {
        };

    };

    //onload
    (function presetMenu() {
        var menu = new SVGMenu(0, 0);

        menu.addHeaderItem("File");
        menu.addSubItem(["File"], "Import", false, "./MenuImages/Import.gif");
        menu.addSubItem(["File", "Import"], "Local", false, "./MenuImages/Local.gif");
        menu.addSubItem(["File", "Import"], "Server", false, "./MenuImages/Server.gif");
        menu.addSubItem(["File", "Import"], "Clipboard", false, "./MenuImages/Clipboard.gif");
        menu.addSubItem(["File", "Import"], "Website", false, "./MenuImages/Website.gif");
        menu.addSubItem(["File"], "Export", false, "./MenuImages/Export.gif");
        menu.addSubItem(["File", "Export"], "Local", false, "./MenuImages/Local.gif");
        menu.addSubItem(["File", "Export"], "Server", false, "./MenuImages/Server.gif");
        menu.addSubItem(["File", "Export"], "Clipboard", false, "./MenuImages/Clipboard.gif");
        menu.addSubItem(["File", "Export"], "Website", false, "./MenuImages/Website.gif");

        menu.addHeaderItem("Edit");
        menu.addSubItem(["Edit"], "Undo", "Ctrl+Z", "./MenuImages/Undo.gif");
        menu.addSubItem(["Edit"], "Redo", "Ctrl+Y", "./MenuImages/Redo.gif");
        menu.addSubItem(["Edit"], "Cut", "Ctrl+X", "./MenuImages/Cut.gif");
        menu.addSubItem(["Edit"], "Copy", "Ctrl+C", "./MenuImages/Copy.gif");
        menu.addSubItem(["Edit"], "Paste", "Ctrl+V", "./MenuImages/Paste.gif");
        menu.addSubItem(["Edit"], "Delete", "Del", "./MenuImages/Delete.gif");
        menu.addSubItem(["Edit"], "Scale", false, "./MenuImages/Scale.gif");

        menu.addHeaderItem("Select");
        menu.addSubItem(["Select"], "All", "Ctrl+A");
        menu.addSubItem(["Select"], "None", "Ctrl+D");
        menu.addSubItem(["Select"], "Invert", "Ctrl+I");
        menu.addSubItem(["Select"], "Cut-points");
        menu.addSubItem(["Select"], "Dominate");
        menu.addSubItem(["Select"], "Shortest Path");

        menu.addHeaderItem("View");
        menu.addSubItem(["View"], "Panel", "Ctrl+P");
        menu.addSubItem(["View"], "History", "Ctrl+H");
        menu.addSubItem(["View"], "Spreadsheet");
        menu.addSubItem(["View"], "Help", "Ctrl+F1");

        menu.addHeaderItem("Graph");
        menu.addSubItem(["Graph"], "Gravity", "Ctrl+G");
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

        menu.addSubItem(["Graph", "Adjacency Matrix"], "Adjacency Matrix");
        menu.addSubItem(["Graph", "Adjacency Matrix", "Adjacency Matrix"], "Adjacency Matrix");
        menu.addSubItem(["Graph", "Adjacency Matrix", "Adjacency Matrix", "Adjacency Matrix"], "Adjacency Matrix");


        function temp(action) {
            alert(action + ":  in progress");
        }

        //FILE - IMPORT
        menu.bindAction(["File", "Import", "Local"], function () { temp("Import -> Local"); });
        menu.bindAction(["File", "Import", "Server"], function () { temp("Import -> Server"); });
        menu.bindAction(["File", "Import", "Clipboard"], function () { importClipboard(); });
        menu.bindAction(["File", "Import", "Website"], function () { temp("Import -> Website"); });

        //FILE - EXPORT
        menu.bindAction(["File", "Export", "Local"], function () { temp("Export -> Local"); });
        menu.bindAction(["File", "Export", "Server"], function () { temp("Export -> Server"); });
        menu.bindAction(["File", "Export", "Clipboard"], function () { exportClipboard(); });
        menu.bindAction(["File", "Export", "Website"], function () { temp("Export -> Website"); });

        //EDIT
        menu.bindAction(["Edit", "Undo"], function () { temp("Edit -> Undo"); });
        menu.bindAction(["Edit", "Redo"], function () { temp("Edit -> Redo"); });
        menu.bindAction(["Edit", "Cut"], function () { temp("Edit -> Cut"); });
        menu.bindAction(["Edit", "Copy"], function () { temp("Edit -> Copy"); });
        menu.bindAction(["Edit", "Paste"], function () { temp("Edit -> Paste"); });
        menu.bindAction(["Edit", "Delete"], function () { temp("Edit -> Delete"); });
        menu.bindAction(["Edit", "Scale"], function () { temp("Edit -> Scale"); });

        //SELECT
        menu.bindAction(["Select", "All"], Graph.selectAllNodes);
        menu.bindAction(["Select", "None"], Graph.deselectAllNodes);
        menu.bindAction(["Select", "Invert"], Graph.invert);
        menu.bindAction(["Select", "Cut-points"], function () { temp("Select -> Cut-points"); });
        menu.bindAction(["Select", "Dominate"], function () { temp("Select -> Dominate"); });
        menu.bindAction(["Select", "Shortest Path"], function () { temp("Select -> Shortest Path"); });

        //VIEW
        menu.bindAction(["View", "Panel"], function () { temp("View -> Panel"); });
        menu.bindAction(["View", "History"], function () { temp("View -> History"); });
        menu.bindAction(["View", "Spreadsheet"], function () { exportToSpreadsheet(); });
        menu.bindAction(["View", "Help"], function () { temp("View -> Help"); });

        //GRAPH
        menu.bindAction(["Graph", "Complement"], Graph.complement);
        menu.bindAction(["Graph", "Extrude"], Graph.extrude);
        menu.bindAction(["Graph", "Breadth-First"], function () { temp("Graph -> Breadth-First"); });
        menu.bindAction(["Graph", "Force"], function () { temp("Graph -> Force"); });
        menu.bindAction(["Graph", "Adjacency Matrix"], function () { temp("Graph -> Adjacency Matrix"); });

        //GRAPH - GRAPH GRAVITY
        menu.bindAction(["Graph", "Gravity", "Landmarks"], function () { temp("Graph -> Gravity -> Landmarks"); });
        menu.bindAction(["Graph", "Gravity", "Vantage Points"], function () { temp("Graph -> Gravity -> Vantage Points"); });
        menu.bindAction(["Graph", "Gravity", "Current Flavoring"], Graph.checkCurrentFlavoring);
        menu.bindAction(["Graph", "Gravity", "Find Flavoring"], function () { temp("Graph -> Gravity -> Find Flavoring"); });
        menu.bindAction(["Graph", "Gravity", "Options"], function () { temp("Graph -> Gravity -> Options"); });


        //GRAPH - CREATE RANDOM
        menu.bindAction(["Graph", "Create Random", "Adjacency Matrix"], function () { temp("Graph -> Create Random -> Adjacency Matrix"); });
        menu.bindAction(["Graph", "Create Random", "Visual"], function () { temp("Graph -> Create Random -> Visual"); });
        menu.bindAction(["Graph", "Create Random", "Tree"], function () { temp("Graph -> Create Random -> Tree"); });
        menu.bindAction(["Graph", "Create Random", "Options"], function () { temp("Graph -> Create Random -> Options"); });

        //menu.removeSubItem(["File", "Export", "Clipboard"], "No Clippy");
        //menu.removeSubItem(["File"], "Import");
        menu.append(parentSVG);

    })();
}, false);
