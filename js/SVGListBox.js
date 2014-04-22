
//TO DO'S
//DONT LOAD ALL ITEMS AT ONCE, JUST SHOW THEM AS THEY SHOULD BE SHOWN
//clean up redundant code
//put the guid method somewhere
//scroll wheel
//try to to perfect the mechanics
//functionalize code
//sort utility methods and class methods

function newGuid() {
    var guid = "";
    var numChars = 16;
    while (numChars--) {
        var nextCharType = Math.ceil(Math.random() * 3);
        if (nextCharType === 1) {
            guid += Math.floor(Math.random() * 10);
        }
        else if (nextCharType === 2) {
            guid += String.fromCharCode(97 + Math.floor(Math.random() * 26));
        }
        else {
            guid += String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
    }
    return guid;
};

(function () {
    var xmlns = "http://www.w3.org/2000/svg";
    var xlink = "http://www.w3.org/1999/xlink";
    var root = document.documentElement;

    this.SVGListBox = function SVGListBox(x, y) {
        var self = this;
        var listBoxWidth = 200;
        var listBoxHeight = 200;
        var scrollerWidthHeight = listItemHeight = textOffSet = 20;
        var contentHeight = 0;
        var maxScrollTop = y + scrollerWidthHeight;
        var maxScrollBot = y + listBoxHeight - (scrollerWidthHeight * 2);
        var listBoxContentWidth = listBoxWidth - scrollerWidthHeight;
        var scrollBarHeight = listBoxHeight - (scrollerWidthHeight * 3);
        var nextItemY = y;
        var numListItems = 0;
        var scrollBoxChange;
        var hiddenContentRatio;
        var scrollTimer = null;

        var listBoxGroup = document.createElementNS(xmlns, "g");

        var listBoxBodyGroup = document.createElementNS(xmlns, "g");

        var listBoxBodyCP = document.createElementNS(xmlns, "clipPath");
        listBoxBodyCP.id = newGuid();
        var clipRect = document.createElementNS(xmlns, "rect");
        clipRect.setAttributeNS(null, "x", x);
        clipRect.setAttributeNS(null, "y", y);
        clipRect.setAttributeNS(null, "width", listBoxContentWidth);
        clipRect.setAttributeNS(null, "height", listBoxHeight);
        listBoxBodyCP.appendChild(clipRect);
        listBoxBodyGroup.appendChild(listBoxBodyCP);
        listBoxBodyGroup.setAttributeNS(null, "clip-path", "url(#" + listBoxBodyCP.id + ")");

        var borderRect = clipRect.cloneNode(false);
        borderRect.setAttributeNS(null, "fill", "none");
        borderRect.setAttributeNS(null, "pointer-events", "none");
        borderRect.setAttributeNS(null, "stroke", "black");
        borderRect.setAttributeNS(null, "stroke-width", "1");
        listBoxGroup.appendChild(borderRect);


        var listBoxBodyContents = document.createElementNS(xmlns, "g");

        var listBoxBackground = document.createElementNS(xmlns, "rect");
        listBoxBackground.setAttributeNS(null, "x", x);
        listBoxBackground.setAttributeNS(null, "y", y);
        listBoxBackground.setAttributeNS(null, "width", listBoxContentWidth);
        listBoxBackground.setAttributeNS(null, "height", listBoxHeight);
        listBoxBackground.setAttributeNS(null, "fill", "white");
        listBoxBodyContents.appendChild(listBoxBackground);

        listBoxBodyGroup.appendChild(listBoxBodyContents);

        var listBoxScrollGroup = document.createElementNS(xmlns, "g");

        var listBoxScrollBar = document.createElementNS(xmlns, "rect");
        listBoxScrollBar.addEventListener("mousedown", function down(event) {
            listBoxBodyContents.setAttributeNS(null, "pointer-events", "none");
            var blockingRect = drawBlockingRect();
            if (event.pageY < +listBoxScrollBox.getAttributeNS(null, "y")) {
                self.jumpScrollUp();
                scrollTimer = setTimeout(function () {
                    scrollTimer = setInterval(function () {
                        if ((event.pageY < +listBoxScrollBox.getAttributeNS(null, "y"))) {
                            self.jumpScrollUp();
                        }
                    }, 50); //maybe make the percentage of the content shown
                }, 500);
            }
            else {
                self.jumpScrollDown();
                scrollTimer = setTimeout(function () {
                    scrollTimer = setInterval(function () {
                        if (event.pageY > (+listBoxScrollBox.getAttributeNS(null, "y") + +listBoxScrollBox.getAttributeNS(null, "height"))) {
                            self.jumpScrollDown();
                        }
                    }, 50); //maybe make the percentage of the content shown
                }, 500);
            }
            root.addEventListener("mouseup", function up() {
                listBoxBodyContents.removeAttributeNS(null, "pointer-events");
                root.removeEventListener("mouseup", up, false);
                blockingRect.parentNode.removeChild(blockingRect);
                clearInterval(scrollTimer);
                clearTimeout(scrollTimer);
            }, false);
        }, false);
        listBoxScrollBar.setAttributeNS(null, "x", x + listBoxContentWidth);
        listBoxScrollBar.setAttributeNS(null, "y", maxScrollTop);
        listBoxScrollBar.setAttributeNS(null, "width", scrollerWidthHeight);
        listBoxScrollBar.setAttributeNS(null, "height", scrollBarHeight);
        listBoxScrollBar.setAttributeNS(null, "fill", "black");
        listBoxScrollBar.setAttributeNS(null, "stroke", "black");
        listBoxScrollBar.setAttributeNS(null, "stroke-width", "1");
        listBoxScrollGroup.appendChild(listBoxScrollBar);

        var listBoxScrollUpGroup = document.createElementNS(xmlns, "g");
        listBoxScrollUpGroup.addEventListener("mousedown", function () {
            listBoxBodyContents.setAttributeNS(null, "pointer-events", "none");
            var blockingRect = drawBlockingRect();
            self.scrollUp();
            scrollTimer = setTimeout(function () {
                scrollTimer = setInterval(self.scrollUp, 50); //maybe make the percentage of the content shown
            }, 500);
            root.addEventListener("mouseup", function up() {
                listBoxBodyContents.removeAttributeNS(null, "pointer-events");
                root.removeEventListener("mouseup", up, false);
                blockingRect.parentNode.removeChild(blockingRect);
                clearInterval(scrollTimer);
                clearTimeout(scrollTimer);
            }, false);
        }, false);

        var listBoxScrollUp = document.createElementNS(xmlns, "rect");
        listBoxScrollUp.setAttributeNS(null, "x", x + listBoxContentWidth);
        listBoxScrollUp.setAttributeNS(null, "y", y);
        listBoxScrollUp.setAttributeNS(null, "width", scrollerWidthHeight);
        listBoxScrollUp.setAttributeNS(null, "height", scrollerWidthHeight);
        listBoxScrollUp.setAttributeNS(null, "fill", "red");
        listBoxScrollUp.setAttributeNS(null, "stroke", "black");
        listBoxScrollUp.setAttributeNS(null, "stroke-width", "1");
        listBoxScrollUpGroup.appendChild(listBoxScrollUp);
        listBoxScrollGroup.appendChild(listBoxScrollUpGroup);

        var listBoxScrollDownGroup = document.createElementNS(xmlns, "g");
        listBoxScrollDownGroup.addEventListener("mousedown", function () {
            listBoxBodyContents.setAttributeNS(null, "pointer-events", "none");
            var blockingRect = drawBlockingRect();
            self.scrollDown();
            scrollTimer = setTimeout(function () {
                scrollTimer = setInterval(self.scrollDown, 50); //maybe make the percentage of the content shown
            }, 500);
            root.addEventListener("mouseup", function up() {
                listBoxBodyContents.removeAttributeNS(null, "pointer-events");
                root.removeEventListener("mouseup", up, false);
                blockingRect.parentNode.removeChild(blockingRect);
                clearInterval(scrollTimer);
                clearTimeout(scrollTimer);
            }, false);
        }, false);

        var listBoxScrollDown = document.createElementNS(xmlns, "rect");
        listBoxScrollDown.setAttributeNS(null, "x", x + listBoxContentWidth);
        listBoxScrollDown.setAttributeNS(null, "y", maxScrollBot);
        listBoxScrollDown.setAttributeNS(null, "width", scrollerWidthHeight);
        listBoxScrollDown.setAttributeNS(null, "height", scrollerWidthHeight);
        listBoxScrollDown.setAttributeNS(null, "fill", "red");
        listBoxScrollDown.setAttributeNS(null, "stroke", "black");
        listBoxScrollDown.setAttributeNS(null, "stroke-width", "1");
        listBoxScrollDownGroup.appendChild(listBoxScrollDown);
        listBoxScrollGroup.appendChild(listBoxScrollDownGroup);

        var listBoxScrollBox = document.createElementNS(xmlns, "rect");
        listBoxScrollBox.setAttributeNS(null, "x", (x + listBoxContentWidth) + (scrollerWidthHeight * .125));
        listBoxScrollBox.setAttributeNS(null, "rx", "2");
        listBoxScrollBox.setAttributeNS(null, "y", maxScrollTop);
        listBoxScrollBox.setAttributeNS(null, "width", (scrollerWidthHeight * .75));
        listBoxScrollBox.setAttributeNS(null, "height", scrollBarHeight);
        listBoxScrollBox.setAttributeNS(null, "fill", "white");
        listBoxScrollBox.addEventListener("mousedown", function down(event) {
            listBoxBodyContents.setAttributeNS(null, "pointer-events", "none");
            var prevY = event.pageY;
            var self = this;
            var yOffSet = event.pageY - +listBoxScrollBox.getAttributeNS(null, "y");
            var blockingRect = drawBlockingRect();
            var listItems = listBoxBodyContents.children;

            function move(event) {
                if (contentHeight > listBoxHeight) {
                    var changeY = prevY - event.pageY;
                    prevY = event.pageY;
                    if (changeY > 0) {
                        var firstItem = listBoxBodyContents.children[1];
                        if ((+firstItem.cell.getAttributeNS(null, "y") < y) && (event.pageY < (maxScrollBot - (+listBoxScrollBox.getAttributeNS(null, "height") - yOffSet)))) {
                            for (var n = 1; n <= numListItems; n++) {
                                var nextListItem = listItems[n];
                                var newCellY = +nextListItem.cell.getAttributeNS(null, "y") + (hiddenContentRatio * changeY);
                                var newTextY = +nextListItem.text.getAttributeNS(null, "y") + (hiddenContentRatio * changeY);
                                nextListItem.cell.setAttributeNS(null, "y", newCellY);
                                nextListItem.text.setAttributeNS(null, "y", newTextY);
                            }
                            self.setAttributeNS(null, "y", event.pageY - yOffSet);
                        }
                        else if (+firstItem.cell.getAttributeNS(null, "y") > y) {
                            self.setAttributeNS(null, "y", maxScrollTop);
                            for (var n = 1; n <= numListItems; n++) {
                                var nextListItem = listItems[n];
                                var newCellY = y + ((n - 1) * listItemHeight);
                                var newTextY = newCellY + (listItemHeight / 2); ;
                                nextListItem.cell.setAttributeNS(null, "y", newCellY);
                                nextListItem.text.setAttributeNS(null, "y", newTextY);
                            }
                        }
                    }
                    else if (changeY < 0) {
                        var lastItem = listBoxBodyContents.children[numListItems];
                        if (((+lastItem.cell.getAttributeNS(null, "y") - listItemHeight) > maxScrollBot) && (event.pageY > (maxScrollTop + yOffSet))) {
                            for (var n = 1; n <= numListItems; n++) {
                                var nextListItem = listItems[n];
                                var newCellY = +nextListItem.cell.getAttributeNS(null, "y") + (hiddenContentRatio * changeY);
                                var newTextY = +nextListItem.text.getAttributeNS(null, "y") + (hiddenContentRatio * changeY);
                                nextListItem.cell.setAttributeNS(null, "y", newCellY);
                                nextListItem.text.setAttributeNS(null, "y", newTextY);
                            }
                            self.setAttributeNS(null, "y", event.pageY - yOffSet);
                        }
                        else if ((+lastItem.cell.getAttributeNS(null, "y") - listItemHeight) < maxScrollBot) {
                            self.setAttributeNS(null, "y", maxScrollBot - +listBoxScrollBox.getAttributeNS(null, "height"));
                            var prevItemY = maxScrollBot + listItemHeight;
                            for (var n = numListItems; n >= 1; n--) {
                                var nextListItem = listItems[n];
                                var newCellY = prevItemY;
                                var newTextY = newCellY + (listItemHeight / 2);
                                nextListItem.cell.setAttributeNS(null, "y", newCellY);
                                nextListItem.text.setAttributeNS(null, "y", newTextY);
                                prevItemY -= listItemHeight;
                            }
                        }
                    }

                }
            }
            root.addEventListener("mousemove", move, false);
            root.addEventListener("mouseup", function up() {
                listBoxBodyContents.removeAttributeNS(null, "pointer-events");
                blockingRect.parentNode.removeChild(blockingRect);
                root.removeEventListener("mousemove", move, false);
                root.removeEventListener("mouseup", up, false);
            }, false);
        }, false);
        listBoxScrollGroup.appendChild(listBoxScrollBox);

        listBoxGroup.appendChild(listBoxBodyGroup);
        listBoxGroup.appendChild(listBoxScrollGroup);

        var listBoxResizeGroup = document.createElementNS(xmlns, "g");
        listBoxResizeGroup.addEventListener("mousedown", function down(event) {
            listBoxBodyContents.setAttributeNS(null, "pointer-events", "none");
            var blockingRect = drawBlockingRect();
            var initialX = event.pageX;
            var initialY = event.pageY;
            var xOffset = initialX - +listBoxResizeBox.getAttributeNS(null, "x");
            var yOffset = initialY - +listBoxResizeBox.getAttributeNS(null, "y");
            var initialClipWidth = +clipRect.getAttributeNS(null, "width");
            var initialClipHeight = +clipRect.getAttributeNS(null, "height");
            var initialBgWidth = +listBoxBackground.getAttributeNS(null, "width");
            var initialBgHeight = +listBoxBackground.getAttributeNS(null, "height");
            var initialBorderWidth = +borderRect.getAttributeNS(null, "width");
            var initialBorderHeight = +borderRect.getAttributeNS(null, "height");
            var initialScrollUpX = +listBoxScrollUp.getAttributeNS(null, "x");
            var initialScrollDownX = +listBoxScrollDown.getAttributeNS(null, "x");
            var initialScrollDownY = +listBoxScrollDown.getAttributeNS(null, "y");
            var initialScrollBarX = +listBoxScrollBar.getAttributeNS(null, "x");
            var initialScrollBarHeight = +listBoxScrollBar.getAttributeNS(null, "height");
            var initialScrollBoxX = +listBoxScrollBox.getAttributeNS(null, "x");
            var initialScrollBoxY = +listBoxScrollBox.getAttributeNS(null, "y");
            var resizeArrowPoints = listBoxResizeArrow.getAttributeNS(null, "points").split(" ");
            var listItems = listBoxBodyContents.children;
            var initialYs = [];
            for (var i = 1; i <= numListItems; i++) {
                var nextListItem = listItems[i];
                initialYs.push(+nextListItem.cell.getAttributeNS(null, "y"));
            }
            function resize(event) {
                listBoxResizeBox.setAttributeNS(null, "x", event.pageX - xOffset);
                listBoxResizeBox.setAttributeNS(null, "y", event.pageY - yOffset);
                var changeX = +listBoxResizeBox.getAttributeNS(null, "x") - initialX;
                var changeY = +listBoxResizeBox.getAttributeNS(null, "y") - initialY;
                clipRect.setAttributeNS(null, "width", initialClipWidth + changeX + xOffset);
                clipRect.setAttributeNS(null, "height", initialClipHeight + changeY + yOffset);
                var contentWidth = initialBgWidth + changeX + xOffset;
                listBoxBackground.setAttributeNS(null, "width", contentWidth);
                var contentHeight = listBoxHeight = initialBgHeight + changeY + yOffset;
                listBoxBackground.setAttributeNS(null, "height", contentHeight);
                borderRect.setAttributeNS(null, "width", initialBorderWidth + changeX + xOffset);
                borderRect.setAttributeNS(null, "height", initialBorderHeight + changeY + yOffset);
                listBoxScrollUp.setAttributeNS(null, "x", initialScrollUpX + changeX + xOffset);
                listBoxScrollDown.setAttributeNS(null, "x", initialScrollDownX + changeX + xOffset);
                listBoxScrollDown.setAttributeNS(null, "y", maxScrollBot = initialScrollDownY + changeY + yOffset);
                listBoxScrollBar.setAttributeNS(null, "x", initialScrollBarX + changeX + xOffset);
                listBoxScrollBar.setAttributeNS(null, "height", scrollBarHeight = initialScrollBarHeight + changeY + yOffset);
                listBoxScrollBox.setAttributeNS(null, "x", initialScrollBoxX + changeX + xOffset);
                listBoxScrollBox.setAttributeNS(null, "y", initialScrollBoxY + changeY + yOffset);
                var pointString = "";
                for (var n = 0; n < 6; n += 2) {
                    var x = +resizeArrowPoints[n];
                    var y = +resizeArrowPoints[n + 1];
                    pointString += (x + changeX + xOffset) + " " + (y + changeY + yOffset);
                    if (n !== 5) {
                        pointString += " ";
                    }
                }
                listBoxResizeArrow.setAttributeNS(null, "points", pointString);

                for (var n = 1; n <= numListItems; n++) {
                    var nextListItem = listItems[n];
                    var nextListItemY = initialYs[n - 1];
                    nextListItem.cell.setAttributeNS(null, "y", nextListItemY - (initialY - event.pageY));
                    nextListItem.cell.setAttributeNS(null, "width", contentWidth);
                    nextListItem.text.setAttributeNS(null, "y", nextListItemY + (listItemHeight / 2) - (initialY - event.pageY));
                }
                resizeScrollBox();

            }
            root.addEventListener("mousemove", resize, false);
            root.addEventListener("mouseup", function up() {
                listBoxBodyContents.removeAttributeNS(null, "pointer-events");
                blockingRect.parentNode.removeChild(blockingRect);
                root.removeEventListener("mousemove", resize, false);
                root.removeEventListener("mouseup", up, false);
            }, false);
        }, false);

        var listBoxResizeBox = document.createElementNS(xmlns, "rect");
        listBoxResizeBox.setAttributeNS(null, "x", x + listBoxContentWidth);
        listBoxResizeBox.setAttributeNS(null, "y", maxScrollBot + listItemHeight);
        listBoxResizeBox.setAttributeNS(null, "width", scrollerWidthHeight);
        listBoxResizeBox.setAttributeNS(null, "height", scrollerWidthHeight);
        listBoxResizeBox.setAttributeNS(null, "fill", "black");
        listBoxResizeBox.setAttributeNS(null, "stroke", "black");
        //listBoxResizeBox.setAttributeNS(null, "stroke-width", "1");
        listBoxResizeGroup.appendChild(listBoxResizeBox);

        var listBoxResizeArrow = document.createElementNS(xmlns, "polygon");
        var pointString = (x + listBoxWidth) + " " + (maxScrollBot + (listItemHeight * 1.5)) + " ";
        pointString += (x + listBoxWidth) + " " + (y + listBoxHeight) + " ";
        pointString += (x + listBoxContentWidth + (listItemHeight / 2)) + " " + (y + listBoxHeight);
        listBoxResizeArrow.setAttributeNS(null, "points", pointString)
        listBoxResizeArrow.setAttributeNS(null, "fill", "white");
        listBoxResizeGroup.appendChild(listBoxResizeArrow);

        listBoxGroup.appendChild(listBoxResizeGroup);

        function constructPolygonString(point1, point2, point3) {
            return (point1.x + "," + point1.y + " " + point2.x + "," + point2.y + " " + point3.x + "," + point3.y);
        }

        function resizeScrollBox(blah) {
            var visibleRatio = listBoxHeight / contentHeight;
            var scrollBoxSize = scrollBarHeight * visibleRatio;
            var itemPercentOfContent = listItemHeight / (contentHeight);
            scrollBoxChange = scrollBarHeight * itemPercentOfContent;
            hiddenContentRatio = (contentHeight - listBoxHeight) / (+listBoxScrollBar.getAttributeNS(null, "height") - +listBoxScrollBox.getAttributeNS(null, "height"));
            listBoxScrollBox.setAttributeNS(null, "height", scrollBoxSize);
            listBoxScrollBox.setAttributeNS(null, "y", maxScrollBot - scrollBoxSize);

        };

        function drawBlockingRect() {
            var blockerRect = document.createElementNS(xmlns, "rect");
            blockerRect.setAttributeNS(null, "x", 0);
            blockerRect.setAttributeNS(null, "y", 0);
            blockerRect.setAttributeNS(null, "width", "100%");
            blockerRect.setAttributeNS(null, "height", "100%");
            blockerRect.setAttributeNS(null, "opacity", 0);
            return root.insertBefore(blockerRect, listBoxGroup);
        };

        function fixListItems() {
        };

        this.scrollUp = function () {
            if (contentHeight > listBoxHeight) {
                var listItems = listBoxBodyContents.children;
                var firstItem = listBoxBodyContents.children[1];
                if ((+firstItem.cell.getAttributeNS(null, "y") + listItemHeight) <= y) {
                    for (var n = 1; n <= numListItems; n++) {
                        var nextListItem = listItems[n];
                        nextListItem.cell.setAttributeNS(null, "y", +nextListItem.cell.getAttributeNS(null, "y") + listItemHeight);
                        nextListItem.text.setAttributeNS(null, "y", +nextListItem.text.getAttributeNS(null, "y") + listItemHeight);
                    }
                    listBoxScrollBox.setAttributeNS(null, "y", (+listBoxScrollBox.getAttributeNS(null, "y") - scrollBoxChange));
                }
                else {
                    listBoxScrollBox.setAttributeNS(null, "y", maxScrollTop);
                    for (var n = 1; n <= numListItems; n++) {
                        var nextListItem = listItems[n];
                        var newCellY = y + ((n - 1) * listItemHeight);
                        var newTextY = newCellY + (listItemHeight / 2);
                        nextListItem.cell.setAttributeNS(null, "y", newCellY);
                        nextListItem.text.setAttributeNS(null, "y", newTextY);
                    }
                }
            }
        };

        this.scrollDown = function () {
            if (contentHeight > listBoxHeight) {
                var listItems = listBoxBodyContents.children;
                var lastItem = listBoxBodyContents.children[numListItems];
                if ((+lastItem.cell.getAttributeNS(null, "y") - listItemHeight) >= (maxScrollBot + listItemHeight)) {
                    for (var n = 1; n <= numListItems; n++) {
                        var nextListItem = listItems[n];
                        nextListItem.cell.setAttributeNS(null, "y", +nextListItem.cell.getAttributeNS(null, "y") - listItemHeight);
                        nextListItem.text.setAttributeNS(null, "y", +nextListItem.text.getAttributeNS(null, "y") - listItemHeight);
                    }
                    listBoxScrollBox.setAttributeNS(null, "y", (+listBoxScrollBox.getAttributeNS(null, "y") + scrollBoxChange));
                }
                else {
                    listBoxScrollBox.setAttributeNS(null, "y", maxScrollBot - +listBoxScrollBox.getAttributeNS(null, "height"));
                    var prevItemY = maxScrollBot + listItemHeight;
                    for (var n = numListItems; n >= 1; n--) {
                        var nextListItem = listItems[n];
                        var newCellY = prevItemY;
                        var newTextY = newCellY + (listItemHeight / 2);
                        nextListItem.cell.setAttributeNS(null, "y", newCellY);
                        nextListItem.text.setAttributeNS(null, "y", newTextY);
                        prevItemY -= listItemHeight;
                    }
                }
            }

        };

        this.jumpScrollUp = function () {
            var numScrolls = Math.round((+listBoxScrollBox.getAttributeNS(null, "height") / 2) / scrollBoxChange);
            while (numScrolls--) {
                self.scrollUp();
            }
        };

        this.jumpScrollDown = function () {
            var numScrolls = Math.round((+listBoxScrollBox.getAttributeNS(null, "height") / 2) / scrollBoxChange);
            while (numScrolls--) {
                self.scrollDown();
            }
        };

        this.hideSrollBar = function () {
            listBoxScrollGroup.style.visibility = "hidden";
        };

        this.showScrollBar = function () {
            listBoxScrollGroup.style.visibility = "visible";
        };

        this.addListItem = function (text) {

            var listItemGroup = document.createElementNS(xmlns, "g");
            listItemGroup.addEventListener("mouseover", function () {
                this.firstChild.setAttributeNS(null, "fill", "orange");
            }, false);
            listItemGroup.addEventListener("mouseout", function () {
                this.firstChild.setAttributeNS(null, "fill", "white");
            }, false);

            var listItemCell = listItemGroup.cell = document.createElementNS(xmlns, "rect");
            listItemCell.setAttributeNS(null, "x", x);
            listItemCell.setAttributeNS(null, "y", nextItemY);
            listItemCell.setAttributeNS(null, "width", listBoxContentWidth);
            listItemCell.setAttributeNS(null, "height", listItemHeight);
            listItemCell.setAttributeNS(null, "fill", "white");
            listItemGroup.appendChild(listItemCell);

            var listItemText = listItemGroup.text = document.createElementNS(xmlns, "text");
            listItemText.setAttributeNS(null, "x", x + textOffSet);
            listItemText.setAttributeNS(null, "y", nextItemY + (listItemHeight / 2));
            listItemText.setAttributeNS(null, "pointer-events", "none");
            listItemText.setAttributeNS(null, "alignment-baseline", "middle");
            listItemText.setAttributeNS(null, "fill", "black");
            listItemText.setAttributeNS(null, "font-family", "Arial");
            listItemText.setAttributeNS(null, "font-size", "12");
            listItemText.setAttributeNS(null, "font-weight", "bold");
            listItemText.textContent = text;
            listItemGroup.appendChild(listItemText);

            listBoxBodyContents.appendChild(listItemGroup);

            contentHeight += listItemHeight;
            nextItemY += listItemHeight;
            numListItems++;
            if (contentHeight > listBoxHeight) {
                resizeScrollBox();
                var listItems = listBoxBodyContents.children;
                for (var n = 1; n <= numListItems; n++) {
                    var nextListItem = listItems[n];
                    nextListItem.cell.setAttributeNS(null, "y", +nextListItem.cell.getAttributeNS(null, "y") - listItemHeight);
                    nextListItem.text.setAttributeNS(null, "y", +nextListItem.text.getAttributeNS(null, "y") - listItemHeight);
                }
                nextItemY -= listItemHeight;
            }
        };

        this.removeListItem = function () {

            numListItems--;
        };

        function findItem(item) {
            var listItems = listBoxBodyContents.children;
            if (typeof item === "string") {
                for (var n = 1; n <= numListItems; n++) {
                    var nextListItem = listItems[n];
                    if (nextListItem.text.textContent === item) {
                        var listItem = nextListItem;
                    }
                }
            }
            else {
                var listItem = listItems[item + 1];
            }
            return listItem;
        };

        //First argument is the event type, second argument is the item name/index, third argument is a handler to bind
        this.bindAction = function (eventType, item, handler) {
            findItem(item).addEventListener(eventType, handler, false);

            //only need if have an option to remove all
            /*var listItem = findItem(item);
            if (listItem.handlers) {
            listItem.handlers.push(handler);
            console.log("additonal handler added");
            }
            else {
            listItem.handlers = [handler];
            console.log("first hander added");
            }*/
        }

        //First argument is the event type, second argument is the item name/index, third argument is a handler to unbind
        this.unbindAction = function (eventType, item, handler) {
            findItem(item).removeEventListener(eventType, handler, false);

            //only need if have an option to remove all
            /*var listItem = findItem(item);
            var handlers = listItem.handlers
            var handlerIndex = handlers.indexOf(handler);
            if (handlerIndex !== -1) {
            listItem.removeEventListener(eventType, handler, false);
            handlers.splice(handlerIndex, 1);
            console.log(handlers);
            }*/
        }

        this.append = function (parent) {
            parent.appendChild(listBoxGroup);
            //resizeScrollBox();
        };
    };
})();

(function () {
    /*LB1 = new SVGListBox(100, 300);
    for (var n = 1; n <= 100; n++) {
    LB1.addListItem("Hello from number " + n);
    }
    LB1.append(root);*/

    /*var LB2 = new SVGListBox(400, 100);
    LB2.addListItem("hello");
    LB2.append(root);
    LB2.hideSrollBar();

    var LB3 = new SVGListBox(800, 100);
    for (var n = 1; n <= 145; n++) {
    LB3.addListItem("Hello from number " + n);
    }
    LB3.append(root);

    var LB4 = new SVGListBox(100, 600);
    for (var n = 1; n <= 345; n++) {
    LB4.addListItem("Hello from number " + n);
    }
    LB4.append(root);

    var LB5 = new SVGListBox(400, 600);
    for (var n = 1; n <= 25; n++) {
    LB5.addListItem("Hello from number " + n);
    }
    LB5.append(root);*/
    //LB.hideSrollBar();
    //LB.showScrollBar();
})();