
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
            changedNum();
            root.removeEventListener("mousedown", Graph.disableTextHighlight, false);
            //this.openTab(openTab);
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
    };

    function changedNum(){
        var num = parseInt(document.getElementById("numWalkers").value);
        //Add walkers 
        while(num > walkers.length){
            walkers.push(new graphWalker());
            //Determine state of traversal (random, pick-a-start, or data-based)
            switch(type){
                case "random":
					walkers[walkers.length-1].randomStart();
                    break;
            }
        }
        //Remove walkers (# was decreased)
        while(num < walkers.length){
            walkers[walkers.length-1].removeWalker();
            walkers.pop();
        }
    }

	function pause(){
		//for(var i=0; i<walkers.length; i++)
			walkers[0].pauseTraversal();
	}
    
	function changeSpeed(mod){
		for(var i=0; i<walkers.length; i++)
			walkers[i].updateSpeed(mod);
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
	playBtn.setAttributeNS(null, "id", "Z");

    //Play button title (hover over text)
    var playTxt = document.createElementNS(xmlns, "title");
    playTxt.textContent = "Start Traversal";
    playBtn.appendChild(playTxt);

    //Pause button is a group that includes two lines 
    var pauseBtn = document.createElementNS(xmlns, "g");
	pauseBtn.setAttributeNS(null,"id","P");
	
	pauseBtn.addEventListener("click", pause);

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
    var y = y2 + tabBgHeight*.15; 
    numText.setAttributeNS(null, "x", x);
    numText.setAttributeNS(null, "y", y);
    numText.setAttributeNS(null, "fill", "black");
    numText.setAttributeNS(null, "font-family", "Arial");
    numText.setAttributeNS(null, "font-size", /*"30"*/tabGroupOffsetTop / 2.5);
    numText.setAttributeNS(null, "font-weight", "bold");
    numText.textContent = "Number Crawlers ";

    var foreign = document.createElementNS(xmlns, "foreignObject");
    x = importWindowX + importWindowWidth*.65;
    y = y2 + tabBgHeight*.09;
    foreign.setAttributeNS(null, "x", x);
    foreign.setAttributeNS(null, "y", y);
    foreign.setAttributeNS(null, "width", "50");
    foreign.setAttributeNS(null, "height", "20");
    var numInput = document.createElement("input");
    numInput.setAttribute("type", "text");
    numInput.setAttribute("id", "numWalkers");
    numInput.setAttribute("value", "1");
    numInput.addEventListener("change", changedNum);
    foreign.appendChild(numInput);

    //Speed Bar (background "bar" rect and then a moveable rect on top)
    var scaleGroup = document.createElementNS(xmlns, "g");

    //Test describing purpose of bar 
    var speedTxt = document.createElementNS(xmlns, "text");
    x = importWindowX + importWindowWidth*.05;
    y = tabBgY+tabBgHeight*.5;
    speedTxt.setAttributeNS(null, "x", x);
    speedTxt.setAttributeNS(null, "y", y);
    speedTxt.setAttributeNS(null, "fill", "black");
    speedTxt.setAttributeNS(null, "font-family", "Arial");
    speedTxt.setAttributeNS(null, "font-size", /*"30"*/tabGroupOffsetTop / 2.5);
    speedTxt.setAttributeNS(null, "font-weight", "bold");
    speedTxt.textContent = "Speed: ";
    scaleGroup.appendChild(speedTxt);

    var scaleBarX = x + importWindowWidth*.25;
    var scaleBarY = tabBgY+tabBgHeight*.48;
    var scaleBarWidth = tabBgWidth * .6;
    var scaleBarHeight = tabBgHeight * .01;

    var scaleBar = document.createElementNS(xmlns, "rect");
    scaleBar.setAttributeNS(null, "x", scaleBarX);
    scaleBar.setAttributeNS(null, "y", scaleBarY);
    scaleBar.setAttributeNS(null, "width", scaleBarWidth);
    scaleBar.setAttributeNS(null, "height", scaleBarHeight);
    scaleBar.setAttributeNS(null, "fill", "black");
    scaleBar.setAttributeNS(null, "stroke", "white");
    scaleBar.setAttributeNS(null, "stroke-width", "2");
    scaleBar.setAttributeNS(null, "rx", "2.5");
    scaleBar.style.cursor = "pointer";
    scaleGroup.appendChild(scaleBar);

    // scaleBar.addEventListener("click", function (event) {
    //     //scaleSlider.setAttributeNS(null, "x", event.pageX - (scaleSliderWidth / 2));
    //     //percentScale = (((event.pageX - scaleBarX) / scaleBarWidth) - .5) * 2;
    //     changeSpeed();
    // }, false);

    var scaleSliderY = scaleBarY - (scaleBarHeight * 2);
    var scaleSliderWidth = scaleBarWidth / 20;
    var scaleSliderHeight = scaleBarHeight * 5;
    var scaleSliderX = scaleBarX + (scaleBarWidth / 2) - (scaleSliderWidth / 2);

    var scaleSlider = document.createElementNS(xmlns, "rect");
    scaleSlider.setAttributeNS(null, "x", scaleSliderX);
    scaleSlider.setAttributeNS(null, "y", scaleSliderY);
    scaleSlider.setAttributeNS(null, "width", scaleSliderWidth);
    scaleSlider.setAttributeNS(null, "height", scaleSliderHeight);
    scaleSlider.setAttributeNS(null, "fill", "red");
    scaleSlider.setAttributeNS(null, "stroke", "white");
    scaleSlider.setAttributeNS(null, "stroke-width", "2");
    scaleSlider.setAttributeNS(null, "rx", "2.5");
    scaleSlider.style.cursor = "pointer";
    scaleGroup.appendChild(scaleSlider);

    scaleSlider.addEventListener("mousedown", function down(event) {
        var moved = false;
        var offsetX = event.pageX - +scaleSlider.getAttributeNS(null, "x");

        root.addEventListener("mousemove", move, false);
        root.addEventListener("mouseup", function up(event) {
            root.removeEventListener("mousemove", move, false);
            root.removeEventListener("mouseup", up, false);
        //changeSpeed();
    }, false);

        function move(event) {
            if (!moved) {
                Graph.clipboard.addToHistory("Scaled nodes");
                moved = true;
            }
            if (event.pageX < scaleBarX) {
                scaleSlider.setAttributeNS(null, "x", scaleBarX - (scaleSliderWidth / 2));
                percentScale = -1;
            }
            else if (event.pageX > (scaleBarX + scaleBarWidth)) {
                scaleSlider.setAttributeNS(null, "x", (scaleBarX + scaleBarWidth) - (scaleSliderWidth / 2));
                percentScale = 1;
            }
            else {
                scaleSlider.setAttributeNS(null, "x", event.pageX - offsetX);
                percentScale = (((event.pageX - scaleBarX) / scaleBarWidth) - .5) * 2;
            }
            //alert(percentScale);
            changeSpeed(percentScale);
        }
    }, false);

    //Add everything to the background (tabGroup) 
    tabGroup.appendChild(pauseBtn);
    tabGroup.appendChild(playBtn);
    tabGroup.appendChild(numText);
    tabGroup.appendChild(foreign);
    tabGroup.appendChild(scaleGroup);

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