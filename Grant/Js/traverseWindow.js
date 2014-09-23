
function LoadTraverseWindow(parent) {
    var root = document.documentElement;
    var xmlns = "http://www.w3.org/2000/svg";
    var xlink = "http://www.w3.org/1999/xlink";
    var open = null;
    var type = null;
    
    var impExpObj = {
        'openTab': null,
        'open': function open(/*importExport,*/ openTab) {
            //Initialize walkers array and add a walker to it 
            type = openTab;
            walkers = new Array();
            root.removeEventListener("mousedown", Graph.disableTextHighlight, false);
            this.openTab(openTab);
            parent.appendChild(importWindowGroup);

        },
        'close': function close() {
            //window.removeEventListener("resize", resizeWindow, false);
            //reset first
            //Remove all walkers
            for(var i=0; i<walkers.length; i++){
                walkers[i].removeWalker();
                //Array will be reset when the window is re-opened (no need to remove the elements from the array)
            }
            root.addEventListener("mousedown", Graph.disableTextHighlight, false);
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

    function changedNum(){
        //alert("In changedNum");
        var num = parseInt(document.getElementById("numWalkers").value);
        while(num > walkers.length){
            walkers.push(new graphWalker());
            //Determine state of traversal (random, pick-a-start, or data-based)
            switch(type){
                case "random":
                    walkers[walkers.length-1].randomStart();
                    break;
            }
        }
        while(num < walkers.length){
            walkers[walkers.length-1].removeWalker();
            walkers.pop();
        }
    }

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

    var importWindowWidth = pageWidth * .2;
    var importWindowHeight = pageHeight * .45;
    var importWindowX = pageWidth - importWindowWidth;
    var importWindowY = 0;

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
    var tabBgWidth = importWindowWidth - 2*tabGroupOffsetX;
    var tabBgHeight = importWindowHeight - (3/2)*tabGroupOffsetTop;

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
    //tabGroup.appendChild(generateTabs("Local", "Server", "Clipboard", "Website"))  

    //Play button 
    var playBtn = document.createElementNS(xmlns, "polygon");
    var xA = importWindowX+importWindowWidth*.30;
    var xB = importWindowX+importWindowWidth*.43;
    var yA = tabBgY+tabBgWidth*.05;
    var yB = tabBgY+tabBgWidth*.15;
    var yC = tabBgY+tabBgWidth*.25;
    var points = xA+","+yA+" "+xB+","+yB+" "+xA+","+yC;
    playBtn.setAttributeNS(null, "points", points);
    playBtn.setAttributeNS(null, "fill", "#4CBB17");
	

    //Play button title (hover over text)
    var playTxt = document.createElementNS(xmlns, "title");
    playTxt.textContent = "Start Traversal";
    playBtn.appendChild(playTxt);

    //Pause button is a group that includes two lines 
    var pauseBtn = document.createElementNS(xmlns, "g");

    var pauseBtnA = document.createElementNS(xmlns, "line");
    var x = importWindowX+importWindowWidth*.55;
    var y1 = tabBgY+tabBgWidth*.05;
    var y2 = tabBgY+tabBgWidth*.25;
    pauseBtnA.setAttributeNS(null, "x1", x);
    pauseBtnA.setAttributeNS(null, "x2", x);
    pauseBtnA.setAttributeNS(null, "y1", y1);
    pauseBtnA.setAttributeNS(null, "y2", y2);
    pauseBtnA.setAttributeNS(null, "stroke", "#4CBB17");
    pauseBtnA.setAttributeNS(null, "stroke-width", "6");
    pauseBtn.appendChild(pauseBtnA);

    var pauseBtnB = document.createElementNS(xmlns, "line");
    x = importWindowX+importWindowWidth*.60;
    pauseBtnB.setAttributeNS(null, "x1", x);
    pauseBtnB.setAttributeNS(null, "x2", x);
    pauseBtnB.setAttributeNS(null, "y1", y1);
    pauseBtnB.setAttributeNS(null, "y2", y2);
    pauseBtnB.setAttributeNS(null, "stroke", "#4CBB17");
    pauseBtnB.setAttributeNS(null, "stroke-width", "6");
    pauseBtn.appendChild(pauseBtnB);

    var pauseTxt = document.createElementNS(xmlns, "title");
    pauseTxt.textContent = "Pause Traversal";
    pauseBtn.appendChild(pauseTxt);


    //Place a text import for number of crawlers desired 
    //First, place text to describe what the box is for 
    var numText = document.createElementNS(xmlns, "text");
    x = importWindowX + importWindowWidth*.05;
    var y = y2 + 30; 
    numText.setAttributeNS(null, "x", x);
    numText.setAttributeNS(null, "y", y);
    numText.setAttributeNS(null, "fill", "black");
    numText.setAttributeNS(null, "font-family", "Arial");
    numText.setAttributeNS(null, "font-size", /*"30"*/tabGroupOffsetTop / 2.5);
    numText.setAttributeNS(null, "font-weight", "bold");
    numText.textContent = "Number Crawlers ";

    var foreign = document.createElementNS(xmlns, "foreignObject");
    x = x + 110;
    y = y2 + 15;
    foreign.setAttributeNS(null, "x", x);
    foreign.setAttributeNS(null, "y", y);
    foreign.setAttributeNS(null, "width", "50");
    foreign.setAttributeNS(null, "height", "20");
    var numInput = document.createElement("input");
    numInput.setAttribute("type", "text");
    numInput.setAttribute("id", "numWalkers");
    numInput.setAttribute("value", "0");
    numInput.addEventListener("change", changedNum);
    foreign.appendChild(numInput);

    //Add everything to the background (tabGroup) 
    tabGroup.appendChild(pauseBtn);
    tabGroup.appendChild(playBtn);
    tabGroup.appendChild(numText);
    tabGroup.appendChild(foreign);

    var importHeaderX = tabBgX;
    var importHeaderY = tabBgY - (tabGroupOffsetTop / 2);

    var importHeaderText = document.createElementNS(xmlns, "text");
    importHeaderText.setAttributeNS(null, "x", importHeaderX);
    importHeaderText.setAttributeNS(null, "y", importHeaderY)
    importHeaderText.setAttributeNS(null, "pointer-events", "none");
    importHeaderText.setAttributeNS(null, "alignment-baseline", "middle");
    importHeaderText.setAttributeNS(null, "fill", "white");
    importHeaderText.setAttributeNS(null, "font-family", "Arial");
    importHeaderText.setAttributeNS(null, "font-size", /*"30"*/tabGroupOffsetTop / 2);
    importHeaderText.setAttributeNS(null, "font-weight", "bold");
    importHeaderText.textContent = "Traversal Options";
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

    return impExpObj;
}