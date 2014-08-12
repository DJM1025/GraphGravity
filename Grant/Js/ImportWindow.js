//TO-DO
//possibly cache the import window after opened once so i don't need to generate every time? i don't think so
//make tab line length more elegant - give it a clip path
//all groups defined at top?
//rethink layout order of groups

//SVGSVGElement.prototype.loadImportWindow = function () {
function LoadImportWindow(parent) {

    var xmlns = "http://www.w3.org/2000/svg";
    var xlink = "http://www.w3.org/1999/xlink";
    var open = null;
    
    var impExpObj = {
        'openTab': null,
        'open': function open(/*importExport,*/ openTab) {
            this.openTab(openTab);
            parent.appendChild(importWindowGroup);
        },
        'close': function close() {
            //window.removeEventListener("resize", resizeWindow, false);
            //reset first
            closeButtonGroup.firstChild.removeAttributeNS(null, "stroke");
            closeButtonGroup.firstChild.removeAttributeNS(null, "stroke-width");
            parent.removeChild(importWindowGroup);
        },
        'minimize': function minimize() {
            //do not reset here
        },
        'maximize': function maximize() {
        },
        'resize': function resize() {
        },
        'center': function center() {
        },
        'accept': function accept() {
        },
        'cancel': function cancel() {
            //reset first
        }
    };

    function mouseOverHighlight() {
        this.addEventListener("mouseover", function over() {
            this.firstChild.setAttributeNS(null, "stroke", "white");
            this.firstChild.setAttributeNS(null, "stroke-width", 2);
            this.addEventListener("mouseout", function out() {
                this.firstChild.removeAttributeNS(null, "stroke");
                this.firstChild.removeAttributeNS(null, "stroke-width");
                this.removeEventListener("mouseout", out, false);
            }, false);
        }, false);
    };

    function generateMinimizeIcon(cx, cy, width) {
        var minimizeIcon = document.createElementNS(xmlns, "line");
        minimizeIcon.setAttributeNS(null, "x1", cx - (width / 3.5));
        minimizeIcon.setAttributeNS(null, "y1", cy);
        minimizeIcon.setAttributeNS(null, "x2", cx + (width / 3.5));
        minimizeIcon.setAttributeNS(null, "y2", cy);
        minimizeIcon.setAttributeNS(null, "stroke", "white");
        minimizeIcon.setAttributeNS(null, "stroke-width", width / 8);
        return minimizeIcon;

    };

    function generateMaximizeIcon(cx, cy, width) {
        var maximizeIconGroup = document.createElementNS(xmlns, "g");
        var maximizeHorizontal = document.createElementNS(xmlns, "line");
        maximizeHorizontal.setAttributeNS(null, "x1", cx - (width / 3.5));
        maximizeHorizontal.setAttributeNS(null, "y1", cy);
        maximizeHorizontal.setAttributeNS(null, "x2", cx + (width / 3.5));
        maximizeHorizontal.setAttributeNS(null, "y2", cy);
        maximizeHorizontal.setAttributeNS(null, "stroke", "white");
        maximizeHorizontal.setAttributeNS(null, "stroke-width", width / 8);
        maximizeIconGroup.appendChild(maximizeHorizontal);
        var maximizeVertical = document.createElementNS(xmlns, "line");
        maximizeVertical.setAttributeNS(null, "x1", cx);
        maximizeVertical.setAttributeNS(null, "y1", cy - (width / 3.5));
        maximizeVertical.setAttributeNS(null, "x2", cx);
        maximizeVertical.setAttributeNS(null, "y2", cy + (width / 3.5));
        maximizeVertical.setAttributeNS(null, "stroke", "white");
        maximizeVertical.setAttributeNS(null, "stroke-width", width / 8);
        maximizeIconGroup.appendChild(maximizeVertical);
        return maximizeIconGroup;
    };

    function generateCloseIcon(cx, cy, halfWidth) {
        var closeIconGroup = document.createElementNS(xmlns, "g");
        for (var i = 0; i < 4; i++) {
            var iconPart = document.createElementNS(xmlns, "line");
            iconPart.setAttributeNS(null, "x1", cx);
            iconPart.setAttributeNS(null, "y1", cy);
            iconPart.setAttributeNS(null, "x2", cx + halfWidth - (halfWidth * .3));
            iconPart.setAttributeNS(null, "y2", cy);
            iconPart.setAttributeNS(null, "stroke", "white");
            iconPart.setAttributeNS(null, "stroke-width", halfWidth / 4);
            iconPart.setAttributeNS(null, "transform", "rotate(" + (45 + (i * 90)) + "," + cx + "," + cy + ")");
            iconPart.setAttributeNS(null, "pointer-events", "none");
            closeIconGroup.appendChild(iconPart);
        }
        return closeIconGroup;
    };

    function generateTabs() {
        function openClose(tabName) {
            if (open) {
                open.firstChild.setAttributeNS(null, "fill", "black");
            }
            if (typeof(tabName) == "string") {
                open = tabs[tabName.toLowerCase()];
            }
            else {
                open = this;
            }
            for (var i = 0; i < argsLength; i++) {
                var nextTab = importTabGroup.childNodes[i];
                var rect = nextTab.firstChild;
                var text = rect.nextSibling;
                var img = text.nextSibling;
                if (nextTab == open) {
                    rect.setAttributeNS(null, "fill", "#0431B4");
                    rect.setAttributeNS(null, "x", openRectX);
                    text.setAttributeNS(null, "x", openTextX);
                    img.setAttributeNS(null, "x", openImgX);
                    nextTab.removeAttributeNS(null, "opacity");

                }
                else {
                    rect.setAttributeNS(null, "x", closedRectX);
                    text.setAttributeNS(null, "x", closedTextX);
                    img.setAttributeNS(null, "x", closedImgX);
                    nextTab.setAttributeNS(null, "opacity", ".8");
                }
            }

        }

        var argsLength = arguments.length;
        var tabs = {};
        var tabWidth = tabBgWidth - (tabBgWidth / 5);
        var tabHeight = tabBgHeight / 8;
        var tabX = tabBgX + (tabBgWidth / 10);
        var tabY = tabBgY + (tabHeight / 2);

        var openRectX = tabX + (tabBgWidth / 10);
        var openTextX = openRectX + (tabWidth / 2) + (tabBgWidth / 20);
        var openImgX = openRectX;
        var closedRectX = tabX - (tabBgWidth / 10);
        var closedTextX = tabX + (tabWidth / 2) - (tabBgWidth / 20);
        var closedImgX = closedRectX;

        var open = null;

        var importTabGroup = document.createElementNS(xmlns, "g");
        importTabGroup.style.cursor = "pointer";

        for (var n = 0; n < argsLength; n++) {
            var tabGroup = document.createElementNS(xmlns, "g");
            tabGroup.addEventListener("mouseover", function over() {
                importTabGroup.appendChild(this);
                this.firstChild.setAttributeNS(null, "fill", "#0431B4");
                this.addEventListener("mouseout", function out() {
                    if (open != this) {
                        this.firstChild.setAttributeNS(null, "fill", "black");
                    }
                    this.removeEventListener("mouseout", out, false);
                }, false);
            }, false);

            tabGroup.addEventListener("click", openClose, false);

            var tabRect = document.createElementNS(xmlns, "rect");
            tabRect.setAttributeNS(null, "x", tabX);
            tabRect.setAttributeNS(null, "y", tabY);
            tabRect.setAttributeNS(null, "width", tabWidth);
            tabRect.setAttributeNS(null, "height", tabHeight);
            tabRect.setAttributeNS(null, "fill", "black");
            tabRect.setAttributeNS(null, "stroke", "black");
            tabRect.setAttributeNS(null, "stroke-width", "3");
            tabRect.setAttributeNS(null, "rx", "3.5");
            tabGroup.appendChild(tabRect);

            var tabText = document.createElementNS(xmlns, "text");
            tabText.setAttributeNS(null, "x", tabX + (tabWidth / 1.75));
            tabText.setAttributeNS(null, "y", (tabY + (tabHeight / 2)))
            tabText.setAttributeNS(null, "pointer-events", "none");
            tabText.setAttributeNS(null, "text-anchor", "middle");
            tabText.setAttributeNS(null, "alignment-baseline", "middle");
            tabText.setAttributeNS(null, "fill", "white");
            tabText.setAttributeNS(null, "font-family", "Arial");
            tabText.setAttributeNS(null, "font-size", (tabHeight / 3.5));
            tabText.setAttributeNS(null, "font-weight", "bold");
            tabText.textContent = arguments[n].toUpperCase();
            tabGroup.appendChild(tabText);

            var tabImg = document.createElementNS(xmlns, "image");
            tabImg.setAttributeNS(xlink, "xlink:href", "./ImportExportImages/" + arguments[n] + ".gif");
            tabImg.setAttributeNS(null, "x", tabX);
            tabImg.setAttributeNS(null, "y", tabY + (tabHeight / 4));
            tabImg.setAttributeNS(null, "width", tabHeight);
            tabImg.setAttributeNS(null, "height", tabHeight / 2);
            tabGroup.appendChild(tabImg);

            importTabGroup.appendChild(tabGroup);

            tabY += tabHeight + (tabHeight / 3);
            tabs[arguments[n].toLowerCase()] = tabGroup;
        }
        
        impExpObj.openTab = openClose;
        return importTabGroup;
    };

    function reset() {
    }

    var pageWidth = window.innerWidth;
    var pageHeight = window.innerHeight;

    var importWindowGroup = document.createElementNS(xmlns, "g");
    importWindowGroup.id = "importWindowGroup";
    parent.appendChild(importWindowGroup);
    var importOuterGroup = document.createElementNS(xmlns, "g");
    importOuterGroup.id = "importOuterGroup";
    importWindowGroup.appendChild(importOuterGroup);
    var importWindowButtonsGroup = document.createElementNS(xmlns, "g");
    importWindowButtonsGroup.id = "importWindowButtonsGroup";
    importWindowButtonsGroup.style.cursor = "pointer";
    importOuterGroup.appendChild(importWindowButtonsGroup);
    var importBodyGroup = document.createElementNS(xmlns, "g");
    importBodyGroup.id = "importBodyGroup";
    importOuterGroup.appendChild(importBodyGroup);
    var bottomPanelGroup = document.createElementNS(xmlns, "g");
    bottomPanelGroup.id = "bottomPanelGroup";
    importOuterGroup.appendChild(bottomPanelGroup);

    var importWindowX = pageWidth * .30;
    var importWindowY = pageHeight * .25;
    var importWindowWidth = pageWidth * .40;
    var importWindowHeight = pageHeight * .5;

    var outerRect = document.createElementNS(xmlns, "rect");
    outerRect.addEventListener("mousedown", function (event) {
        var startX = event.pageX - importWindowGroup.getCTM().e;
        var startY = event.pageY - importWindowGroup.getCTM().f;
        parent.addEventListener("mousemove", moveImportWindow, false);
        parent.addEventListener("mouseup", function releaseImportWindow(event) {
            parent.removeEventListener("mousemove", moveImportWindow, false);
            parent.removeEventListener("mouseup", releaseImportWindow, false);
        }, false);

        function moveImportWindow(event) {
            importWindowGroup.setAttributeNS(null, "transform", "translate(" + (event.pageX - startX) + "," + (event.pageY - startY) + ")");
        }

    }, false);
    outerRect.setAttributeNS(null, "x", importWindowX);
    outerRect.setAttributeNS(null, "y", importWindowY);
    outerRect.setAttributeNS(null, "width", importWindowWidth);
    outerRect.setAttributeNS(null, "height", importWindowHeight);
    outerRect.setAttributeNS(null, "fill", "black");
    //outerRect.setAttributeNS(null, "stroke", "white");
    //outerRect.setAttributeNS(null, "stroke-width", "5");
    outerRect.setAttributeNS(null, "rx", "3.5");
    importOuterGroup.insertBefore(outerRect, importWindowButtonsGroup);

    var tabGroupOffsetTop = importWindowHeight / 10;
    var tabGroupOffsetX = tabGroupOffsetTop / 3;

    var tabBgX = importWindowX + tabGroupOffsetX;
    var tabBgY = importWindowY + tabGroupOffsetTop;
    var tabBgWidth = (importWindowWidth - (tabGroupOffsetX * 2)) / 4;
    var tabBgHeight = importWindowHeight - (tabGroupOffsetTop * 2.5) - (tabGroupOffsetX / 2);

    var tabGroup = document.createElementNS(xmlns, "g");
    tabGroup.id = "tabGroup";
    importBodyGroup.appendChild(tabGroup);

    var tabBackground = document.createElementNS(xmlns, "rect");
    tabBackground.setAttributeNS(null, "x", tabBgX);
    tabBackground.setAttributeNS(null, "y", tabBgY);
    tabBackground.setAttributeNS(null, "width", tabBgWidth);
    tabBackground.setAttributeNS(null, "height", tabBgHeight);
    tabBackground.setAttributeNS(null, "fill", "white");
    tabBackground.setAttributeNS(null, "rx", "3.5");
    tabGroup.appendChild(tabBackground);
    tabGroup.appendChild(generateTabs("Local", "Server", "Clipboard", "Website"))
    //var buttonGroup = document.createElementNS(xmlns, "g");

    var foreignObjX = (tabBgX + tabBgWidth) + (tabGroupOffsetX / 2);
    var foreignObjY = tabBgY;
    var foreignObjWidth = importWindowWidth - tabBgWidth - (tabGroupOffsetX * 2) - (tabGroupOffsetX / 2);
    var foreignObjHeight = tabBgHeight;

    var importBodyFO = document.createElementNS(xmlns, "foreignObject");
    importBodyFO.setAttributeNS(null, "x", foreignObjX);
    importBodyFO.setAttributeNS(null, "y", foreignObjY);
    importBodyFO.setAttributeNS(null, "width", foreignObjWidth);
    importBodyFO.setAttributeNS(null, "height", foreignObjHeight);
    importBodyGroup.appendChild(importBodyFO);

    var importDivPadding = (foreignObjHeight / 25);
    var importDivFontSize = importDivPadding + "px"; //just make it equal to font size?
    var importBodyDiv = document.createElement("div");
    //importBodyDiv.style.position = "absolute";
    importBodyDiv.contentEditable = true;
    importBodyDiv.spellcheck = false;
    importBodyDiv.style.width = (foreignObjWidth - (importDivPadding * 2)) + "px";
    importBodyDiv.style.height = (foreignObjHeight - (importDivPadding * 2)) + "px";
    importBodyDiv.style.fontFamily = "Arial";
    importBodyDiv.style.fontWeight = "bold";
    importBodyDiv.style.fontSize = importDivFontSize;
    importBodyDiv.style.padding = importDivPadding + "px";
    importBodyDiv.style.overflowY = "scroll";
    //importBodyDiv.style.opacity = ".5";
    importBodyDiv.style.backgroundColor = "white";
    importBodyDiv.style.color = "gray";
    importBodyDiv.style.borderRadius = "3.5px";
    importBodyDiv.innerHTML = "Paste xml here...";
    importBodyFO.appendChild(importBodyDiv);
    importBodyDiv.addEventListener("click", function () {
        if (this.innerHTML == "Paste xml here...") {
            this.innerHTML = "";
            this.style.color = "black";
        }
    }, false);

    var importFileInput = document.createElement("input");
    importFileInput.setAttributeNS(null, "type", "file");
    //importBodyDiv.appendChild(importFileInput);

    var bottomPanelX = tabBgX;
    var bottomPanelY = tabBgY + tabBgHeight + (tabGroupOffsetX / 2);
    var bottomPanelWidth = tabBgWidth + foreignObjWidth + (tabGroupOffsetX / 2);
    var bottomPanelHeight = (tabBgHeight / 8) + (tabGroupOffsetX / 1.5);

    var bottomPanelRect = document.createElementNS(xmlns, "rect");
    bottomPanelRect.setAttributeNS(null, "x", bottomPanelX);
    bottomPanelRect.setAttributeNS(null, "y", bottomPanelY);
    bottomPanelRect.setAttributeNS(null, "width", bottomPanelWidth);
    bottomPanelRect.setAttributeNS(null, "height", bottomPanelHeight);
    bottomPanelRect.setAttributeNS(null, "fill", "white");
    bottomPanelRect.setAttributeNS(null, "rx", "3.5");
    bottomPanelGroup.appendChild(bottomPanelRect);

    var cancelButtonGroup = document.createElementNS(xmlns, "g");
    cancelButtonGroup.addEventListener("mouseover", function over() {
        this.firstChild.setAttributeNS(null, "fill", "#0431B4");
        this.addEventListener("mouseout", function out() {
            this.firstChild.setAttributeNS(null, "fill", "black");
            this.removeEventListener("mouseout", out, false);
        }, false);
    }, false);

    var cancelButtonWidth = tabBgWidth * .55;
    var cancelButtonHeight = bottomPanelHeight * .6;
    var cancelButtonRectX = bottomPanelX + bottomPanelWidth - cancelButtonWidth - tabGroupOffsetX;
    var cancelButtonRectY = bottomPanelY + ((bottomPanelHeight - cancelButtonHeight) / 2);

    var cancelButtonRect = document.createElementNS(xmlns, "rect");
    cancelButtonRect.setAttributeNS(null, "x", cancelButtonRectX);
    cancelButtonRect.setAttributeNS(null, "y", cancelButtonRectY);
    cancelButtonRect.setAttributeNS(null, "width", cancelButtonWidth);
    cancelButtonRect.setAttributeNS(null, "height", cancelButtonHeight);
    cancelButtonRect.setAttributeNS(null, "fill", "black");
    cancelButtonRect.setAttributeNS(null, "stroke", "black");
    cancelButtonRect.setAttributeNS(null, "stroke-width", "3");
    cancelButtonRect.setAttributeNS(null, "rx", "3.5");
    cancelButtonGroup.appendChild(cancelButtonRect);

    var cancelButtonTextX = cancelButtonRectX + (cancelButtonWidth / 2);
    var cancelButtonTextY = cancelButtonRectY + (cancelButtonHeight / 2);

    var cancelButtonText = document.createElementNS(xmlns, "text");
    cancelButtonText.setAttributeNS(null, "x", cancelButtonTextX);
    cancelButtonText.setAttributeNS(null, "y", cancelButtonTextY);
    cancelButtonText.setAttributeNS(null, "pointer-events", "none");
    cancelButtonText.setAttributeNS(null, "text-anchor", "middle");
    cancelButtonText.setAttributeNS(null, "alignment-baseline", "middle");
    cancelButtonText.setAttributeNS(null, "fill", "white");
    cancelButtonText.setAttributeNS(null, "font-family", "Arial");
    cancelButtonText.setAttributeNS(null, "font-size", cancelButtonHeight / 2);
    cancelButtonText.setAttributeNS(null, "font-weight", "bold");
    cancelButtonText.textContent = "Cancel";
    cancelButtonGroup.appendChild(cancelButtonText);
    bottomPanelGroup.appendChild(cancelButtonGroup);

    var okButtonGroup = document.createElementNS(xmlns, "g");
    okButtonGroup.addEventListener("mouseover", function over() {
        this.firstChild.setAttributeNS(null, "fill", "#0431B4");
        this.addEventListener("mouseout", function out() {
            this.firstChild.setAttributeNS(null, "fill", "black");
            this.removeEventListener("mouseout", out, false);
        }, false);
    }, false);
	
	//okButtonGroup.addEventListener("click", function () {alert("importing")}, false);

    var okButtonWidth = cancelButtonWidth;
    var okButtonHeight = cancelButtonHeight;
    var okButtonRectX = cancelButtonRectX - okButtonWidth - tabGroupOffsetX;
    var okButtonRectY = cancelButtonRectY;

    var okButtonRect = document.createElementNS(xmlns, "rect");
    okButtonRect.setAttributeNS(null, "x", okButtonRectX);
    okButtonRect.setAttributeNS(null, "y", okButtonRectY);
    okButtonRect.setAttributeNS(null, "width", okButtonWidth);
    okButtonRect.setAttributeNS(null, "height", okButtonHeight);
    okButtonRect.setAttributeNS(null, "fill", "black");
    okButtonRect.setAttributeNS(null, "stroke", "black");
    okButtonRect.setAttributeNS(null, "stroke-width", "3");
    okButtonRect.setAttributeNS(null, "rx", "3.5");
    okButtonGroup.appendChild(okButtonRect);

    var okButtonTextX = okButtonRectX + (okButtonWidth / 2);
    var okButtonTextY = okButtonRectY + (okButtonHeight / 2);

    var okButtonText = document.createElementNS(xmlns, "text");
    okButtonText.setAttributeNS(null, "x", okButtonTextX);
    okButtonText.setAttributeNS(null, "y", okButtonTextY);
    okButtonText.setAttributeNS(null, "pointer-events", "none");
    okButtonText.setAttributeNS(null, "text-anchor", "middle");
    okButtonText.setAttributeNS(null, "alignment-baseline", "middle");
    okButtonText.setAttributeNS(null, "fill", "white");
    okButtonText.setAttributeNS(null, "font-family", "Arial");
    okButtonText.setAttributeNS(null, "font-size", okButtonHeight / 2);
    okButtonText.setAttributeNS(null, "font-weight", "bold");
    okButtonText.textContent = "OK";
    okButtonGroup.appendChild(okButtonText);

    bottomPanelGroup.appendChild(okButtonGroup);
    okButtonGroup.style.cursor = cancelButtonGroup.style.cursor = "pointer";

    var importHeaderX = tabBgX;
    var importHeaderY = tabBgY - (tabGroupOffsetTop / 2);

    var importHeaderText = document.createElementNS(xmlns, "text");
    importHeaderText.setAttributeNS(null, "x", importHeaderX);
    importHeaderText.setAttributeNS(null, "y", importHeaderY)
    importHeaderText.setAttributeNS(null, "pointer-events", "none");
    importHeaderText.setAttributeNS(null, "alignment-baseline", "middle");
    importHeaderText.setAttributeNS(null, "fill", "white");
    importHeaderText.setAttributeNS(null, "font-family", "Arial");
    importHeaderText.setAttributeNS(null, "font-size", /*"30"*/tabGroupOffsetTop / 2);//tight********
    importHeaderText.setAttributeNS(null, "font-weight", "bold");
    importHeaderText.textContent = "IMPORT";
    importOuterGroup.appendChild(importHeaderText);

    var closeButtonGroup = document.createElementNS(xmlns, "g");
    closeButtonGroup.addEventListener("click", impExpObj.close, false);
    mouseOverHighlight.call(closeButtonGroup);

    var closeButtonWidth = tabGroupOffsetTop / 2;
    var closeButtonHeight = tabGroupOffsetTop / 2;
    var closeButtonX = (importWindowX + importWindowWidth - tabGroupOffsetX) - closeButtonWidth;
    var closeButtonY = importWindowY + (tabGroupOffsetTop / 4);

    var closeButtonRect = document.createElementNS(xmlns, "rect");
    closeButtonRect.setAttributeNS(null, "x", closeButtonX);
    closeButtonRect.setAttributeNS(null, "y", closeButtonY);
    closeButtonRect.setAttributeNS(null, "width", closeButtonWidth);
    closeButtonRect.setAttributeNS(null, "height", closeButtonHeight);
    closeButtonRect.setAttributeNS(null, "fill", "red");
    closeButtonRect.setAttributeNS(null, "rx", 2.5);
    closeButtonGroup.appendChild(closeButtonRect);

    importWindowButtonsGroup.appendChild(closeButtonGroup);
    var mp = closeButtonGroup.findMidpoint();
    closeButtonGroup.appendChild(generateCloseIcon(mp.x, mp.y, (closeButtonWidth / 2)));

    /*var maximizeButtonGroup = document.createElementNS(xmlns, "g");
    maximizeButtonGroup.addEventListener("click", impExpObj.maximize, false);
    mouseOverHighlight.call(maximizeButtonGroup);

    var maximizeButtonWidth = closeButtonWidth;
    var maximizeButtonHeight = closeButtonHeight;
    var maximizeButtonX = closeButtonX - closeButtonWidth - (closeButtonWidth / 3);
    var maximizeButtonY = closeButtonY;

    var maximizeButtonRect = document.createElementNS(xmlns, "rect");
    maximizeButtonRect.setAttributeNS(null, "x", maximizeButtonX);
    maximizeButtonRect.setAttributeNS(null, "y", maximizeButtonY);
    maximizeButtonRect.setAttributeNS(null, "width", maximizeButtonWidth);
    maximizeButtonRect.setAttributeNS(null, "height", maximizeButtonHeight);
    maximizeButtonRect.setAttributeNS(null, "fill", "#29A629");
    maximizeButtonRect.setAttributeNS(null, "rx", 2.5);
    maximizeButtonGroup.appendChild(maximizeButtonRect);

    importWindowButtonsGroup.appendChild(maximizeButtonGroup);
    var mp = maximizeButtonGroup.findMidpoint();
    maximizeButtonGroup.appendChild(generateMaximizeIcon(mp.x, mp.y, maximizeButtonWidth));

    var minimizeButtonGroup = document.createElementNS(xmlns, "g");
    minimizeButtonGroup.addEventListener("click", impExpObj.minimize, false);
    mouseOverHighlight.call(minimizeButtonGroup);

    var minimizeButtonWidth = closeButtonWidth;
    var minimizeButtonHeight = closeButtonHeight;
    var minimizeButtonX = maximizeButtonX - closeButtonWidth - (closeButtonWidth / 3);
    var minimizeButtonY = closeButtonY;

    var minimizeButtonRect = document.createElementNS(xmlns, "rect");
    minimizeButtonRect.setAttributeNS(null, "x", minimizeButtonX);
    minimizeButtonRect.setAttributeNS(null, "y", minimizeButtonY);
    minimizeButtonRect.setAttributeNS(null, "width", minimizeButtonWidth);
    minimizeButtonRect.setAttributeNS(null, "height", minimizeButtonHeight);
    minimizeButtonRect.setAttributeNS(null, "fill", "#FFCC00");
    minimizeButtonRect.setAttributeNS(null, "rx", 2.5);
    minimizeButtonGroup.appendChild(minimizeButtonRect);

    importWindowButtonsGroup.appendChild(minimizeButtonGroup);
    var mp = minimizeButtonGroup.findMidpoint();
    minimizeButtonGroup.appendChild(generateMinimizeIcon(mp.x, mp.y, minimizeButtonWidth));*/

    return impExpObj;


}