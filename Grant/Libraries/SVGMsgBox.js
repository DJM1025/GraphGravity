function SVGMsgBox(parent, message, acceptCallback/*, declineCallback*/) {

    //MAYBE ADD ON METHODS TO THE PROTOTYPE SO I DONT HAVE TO HAVE THEM PASS A PARENT? just a thought?
    function generateMsgIcon(circleCx, circleCy, circleRadius) {
        var errorGroup = document.createElementNS(xmlns, "g");

        var cx = circleCx;
        var cy = circleCy;
        var r = circleRadius;

        var errorCircle = document.createElementNS(xmlns, "circle");
        errorCircle.setAttributeNS(null, "cx", cx);
        errorCircle.setAttributeNS(null, "cy", cy);
        errorCircle.setAttributeNS(null, "r", r);
        errorCircle.setAttributeNS(null, "fill", "red");
        errorCircle.setAttributeNS(null, "stroke", "black");
        errorCircle.setAttributeNS(null, "stroke-width", "3");
        errorGroup.appendChild(errorCircle);

        for (var i = 0; i < 4; i++) {
            var errorXPart = document.createElementNS(xmlns, "line");
            errorXPart.setAttributeNS(null, "x1", cx);
            errorXPart.setAttributeNS(null, "y1", cy);
            errorXPart.setAttributeNS(null, "x2", cx + r - (r * .3));
            errorXPart.setAttributeNS(null, "y2", cy);
            errorXPart.setAttributeNS(null, "stroke", "white");
            errorXPart.setAttributeNS(null, "stroke-width", r * .25);
            errorXPart.setAttributeNS(null, "transform", "rotate(" + (45 + (i * 90)) + "," + cx + "," + cy + ")");
            errorGroup.appendChild(errorXPart);
        }

        return errorGroup;
    }

    var xmlns = "http://www.w3.org/2000/svg";
    var xlink = "http://www.w3.org/1999/xlink";

    var pageWidth = window.innerWidth;
    var pageHeight = window.innerHeight;

    var msgBoxGroup = document.createElementNS(xmlns, "g");

    var blurRect = document.createElementNS(xmlns, "rect");
    blurRect.setAttributeNS(null, "x", "0");
    blurRect.setAttributeNS(null, "y", "0");
    blurRect.setAttributeNS(null, "width", "100%");
    blurRect.setAttributeNS(null, "height", "100%");
    blurRect.setAttributeNS(null, "fill", "black");
    blurRect.setAttributeNS(null, "opacity", ".5");
    blurRect.addEventListener("click", function flashAlert() {
        function flash() {
            if (flashes === 0) {
                clearInterval(flashTimer);
                blurRect.addEventListener("click", flashAlert, false);
            }
            else {
                if (flashes % 2 === 0) {
                    msgOuterRect.setAttributeNS(null, "stroke", "red");
                }
                else {
                    msgOuterRect.setAttributeNS(null, "stroke", "black");
                }
                flashes--;
            }
        };

        blurRect.removeEventListener("click", flashAlert, false);
        var flashes = 6;
        var flashTimer = setInterval(flash, 50);
    }, false);
    /*parent*/msgBoxGroup.appendChild(blurRect);

    var msgOuterGroup = document.createElementNS(xmlns, "g");

    var x = pageWidth * .35;
    var y = pageHeight * .3875;
    var width = pageWidth * .3;
    var height = pageHeight * .225;

    var msgOuterRect = document.createElementNS(xmlns, "rect");
    msgOuterRect.setAttributeNS(null, "x", x);
    msgOuterRect.setAttributeNS(null, "y", y);
    msgOuterRect.setAttributeNS(null, "width", width);
    msgOuterRect.setAttributeNS(null, "height", height);
    msgOuterRect.setAttributeNS(null, "fill", "black");
    msgOuterRect.setAttributeNS(null, "stroke", "black");
    msgOuterRect.setAttributeNS(null, "stroke-width", "2.5");
    msgOuterRect.setAttributeNS(null, "rx", "2.5");
    msgOuterGroup.appendChild(msgOuterRect);

    //msgOuterGroup.appendChild(generateMsgIcon((x + (width / 5)), (y + (height / 2)), height / 4));

    /*var msgHeaderText = document.createElementNS(xmlns, "text");
    msgHeaderText.setAttributeNS(null, "x", "40.5%");
    msgHeaderText.setAttributeNS(null, "y", "42%")
    msgHeaderText.setAttributeNS(null, "pointer-events", "none");
    //msgHeaderText.setAttributeNS(null, "text-anchor", "middle");
    msgHeaderText.setAttributeNS(null, "alignment-baseline", "middle");
    msgHeaderText.setAttributeNS(null, "fill", "White");
    msgHeaderText.setAttributeNS(null, "font-family", "Arial");
    msgHeaderText.setAttributeNS(null, "font-size", "14");
    msgHeaderText.setAttributeNS(null, "font-weight", "bold");
    msgHeaderText.textContent = "Message from Grapher";
    msgOuterGroup.appendChild(msgHeaderText);*/

    msgBoxGroup.appendChild(msgOuterGroup);

    //var closeButtonGroup = document.createElementNS(xmlns, "g");
    
    /*var closeButtonRect = document.createElementNS(xmlns, "rect");
    closeButtonRect.setAttributeNS(null, "x", "58.5%");
    closeButtonRect.setAttributeNS(null, "y", "41%");
    closeButtonRect.setAttributeNS(null, "width", "1%");
    closeButtonRect.setAttributeNS(null, "height", "2%");
    closeButtonRect.setAttributeNS(null, "fill", "red");
    closeButtonRect.setAttributeNS(null, "stroke", "black");
    closeButtonRect.setAttributeNS(null, "stroke-width", "1");
    closeButtonRect.setAttributeNS(null, "rx", "2");
    closeButtonGroup.appendChild(closeButtonRect);*/

    /*var closeX = document.createElementNS(xmlns, "text");
    closeX.setAttributeNS(null, "x", "59%");
    closeX.setAttributeNS(null, "y", "42.10%")
    closeX.setAttributeNS(null, "text-anchor", "middle");
    closeX.setAttributeNS(null, "alignment-baseline", "middle");
    closeX.setAttributeNS(null, "fill", "white");
    closeX.setAttributeNS(null, "font-family", "Arial");
    closeX.setAttributeNS(null, "font-size", "12");
    closeX.setAttributeNS(null, "font-weight", "bold");
    closeX.textContent = "X";
    closeX.addEventListener("mouseover", function () {
        this.setAttributeNS(null, "fill", "red");
    }, false);
    closeX.addEventListener("mouseout", function () {
        this.setAttributeNS(null, "fill", "white");
    }, false);
    closeX.addEventListener("mouseup", function () {
        //close();
        cancel();
    }, false);
    //closeButtonGroup.appendChild(closeX)

    //msgOuterGroup.appendChild(closeButtonGroup);
    msgOuterGroup.appendChild(closeX)*/

    var msgBodyGroup = document.createElementNS(xmlns, "g");

    var msgBodyRect = document.createElementNS(xmlns, "rect");
    msgBodyRect.setAttributeNS(null, "x", x + (width / 20));
    msgBodyRect.setAttributeNS(null, "y", y + (height / 6));
    msgBodyRect.setAttributeNS(null, "width", width - ((width / 20) * 2));
    msgBodyRect.setAttributeNS(null, "height", height - ((height / 6) * 1.5));
    msgBodyRect.setAttributeNS(null, "fill", "white");
    msgBodyRect.setAttributeNS(null, "stroke", "black");
    msgBodyRect.setAttributeNS(null, "stroke-width", "2");
    //msgBodyRect.setAttributeNS(null, "fill-opacity", ".5");
    msgBodyRect.setAttributeNS(null, "rx", "2.5");
    msgBodyGroup.appendChild(msgBodyRect);

    var cY = +msgBodyRect.getAttributeNS(null, "y") + (+msgBodyRect.getAttributeNS(null, "height") / 2);
    var cX = +msgBodyRect.getAttributeNS(null, "x") + (+msgBodyRect.getAttributeNS(null, "width") / 6);

    msgBodyGroup.appendChild(generateMsgIcon(/*(x + (width / 5))*/cX, /*(y + (height / 2))*/cY, height / 4));

    /*var msgBodyFO = document.createElementNS(xmlns, "foreignObject");
    msgBodyFO.setAttributeNS(null, "pointer-events", "none");
    msgBodyFO.setAttributeNS(null, "x", "45%");
    msgBodyFO.setAttributeNS(null, "y", "45%");
    msgBodyFO.setAttributeNS(null, "width", "14.5%");
    msgBodyFO.setAttributeNS(null, "height", "12%");
    
    var msgBodyDiv = document.createElement("div");
    //msgBodyDiv.contentEditable = true;
    msgBodyDiv.style.fontFamily = "Arial";
    msgBodyDiv.style.fontWeight = "bold";
    msgBodyDiv.style.fontSize = "13px";
    //msgBodyDiv.style.overflowY = "scroll";
    var msgBodyText = document.createTextNode(message);
    msgBodyDiv.appendChild(msgBodyText);
    msgBodyFO.appendChild(msgBodyDiv);

    msgBodyGroup.appendChild(msgBodyFO);*/

    msgBoxGroup.appendChild(msgBodyGroup);

    /*var msgYesButtonGroup = document.createElementNS(xmlns, "g");
    msgYesButtonGroup.addEventListener("click", accept, false);
    var focusedButton = msgYesButtonGroup;

    var msgYesButtonRect = document.createElementNS(xmlns, "rect");
    msgYesButtonRect.setAttributeNS(null, "x", "45%");
    msgYesButtonRect.setAttributeNS(null, "y", "54%");
    msgYesButtonRect.setAttributeNS(null, "width", "5%");
    msgYesButtonRect.setAttributeNS(null, "height", "3%");
    msgYesButtonRect.setAttributeNS(null, "fill", "black");
    msgYesButtonRect.setAttributeNS(null, "stroke", "red");
    msgYesButtonRect.setAttributeNS(null, "stroke-width", "2");
    msgYesButtonRect.setAttributeNS(null, "rx", "2");
    msgYesButtonGroup.appendChild(msgYesButtonRect);

    var msgYesButtonText = document.createElementNS(xmlns, "text");
    msgYesButtonText.setAttributeNS(null, "x", "47.5%");
    msgYesButtonText.setAttributeNS(null, "y", "55.5%");
    msgYesButtonText.setAttributeNS(null, "pointer-events", "none");
    msgYesButtonText.setAttributeNS(null, "text-anchor", "middle");
    msgYesButtonText.setAttributeNS(null, "alignment-baseline", "middle");
    msgYesButtonText.setAttributeNS(null, "fill", "white");
    msgYesButtonText.setAttributeNS(null, "font-family", "Arial");
    msgYesButtonText.setAttributeNS(null, "font-size", "12");
    msgYesButtonText.setAttributeNS(null, "font-weight", "bold");
    msgYesButtonText.textContent = "Yes";
    msgYesButtonGroup.appendChild(msgYesButtonText);

    msgBodyGroup.appendChild(msgYesButtonGroup);

    var msgCancelButtonGroup = document.createElementNS(xmlns, "g");
    msgCancelButtonGroup.addEventListener("click", cancel, false);

    var msgCancelButtonRect = document.createElementNS(xmlns, "rect");
    msgCancelButtonRect.setAttributeNS(null, "x", "51%");
    msgCancelButtonRect.setAttributeNS(null, "y", "54%");
    msgCancelButtonRect.setAttributeNS(null, "width", "5%");
    msgCancelButtonRect.setAttributeNS(null, "height", "3%");
    msgCancelButtonRect.setAttributeNS(null, "fill", "black");
    msgCancelButtonRect.setAttributeNS(null, "stroke", "none");
    msgCancelButtonRect.setAttributeNS(null, "stroke-width", "2");
    msgCancelButtonRect.setAttributeNS(null, "rx", "2");
    msgCancelButtonGroup.appendChild(msgCancelButtonRect);

    var msgCancelButtonText = document.createElementNS(xmlns, "text");
    msgCancelButtonText.setAttributeNS(null, "x", "53.5%");
    msgCancelButtonText.setAttributeNS(null, "y", "55.5%");
    msgCancelButtonText.setAttributeNS(null, "pointer-events", "none");
    msgCancelButtonText.setAttributeNS(null, "text-anchor", "middle");
    msgCancelButtonText.setAttributeNS(null, "alignment-baseline", "middle");
    msgCancelButtonText.setAttributeNS(null, "fill", "white");
    msgCancelButtonText.setAttributeNS(null, "font-family", "Arial");
    msgCancelButtonText.setAttributeNS(null, "font-size", "12");
    msgCancelButtonText.setAttributeNS(null, "font-weight", "bold");
    msgCancelButtonText.textContent = "Cancel";
    msgCancelButtonGroup.appendChild(msgCancelButtonText);

    msgBodyGroup.appendChild(msgCancelButtonGroup);

    var msgIcon = document.createElementNS(xmlns, "image");
    msgIcon.setAttributeNS(xlink, "xlink:href", "./MsgBoxImages/Error.gif");
    //msgIcon.setAttributeNS(null, "preserveAspectRatio", false);
    msgIcon.setAttributeNS(null, "x", "41.5%");
    msgIcon.setAttributeNS(null, "y", "47%");
    msgIcon.setAttributeNS(null, "width", 50);
    msgIcon.setAttributeNS(null, "height", 50);

    msgBodyGroup.appendChild(msgIcon);

    //function msgBoxKeyDown() {
    function switchFocusOrEnter() {
        if (event.keyCode === 37 || event.keyCode === 39) {
            if (focusedButton === msgYesButtonGroup) {
                msgYesButtonRect.setAttributeNS(null, "stroke", "none");
                msgCancelButtonRect.setAttributeNS(null, "stroke", "red");
                focusedButton = msgCancelButtonGroup;
            }
            else {
                msgCancelButtonRect.setAttributeNS(null, "stroke", "none");
                msgYesButtonRect.setAttributeNS(null, "stroke", "red");
                focusedButton = msgYesButtonGroup;
            }
        }
        else if (event.keyCode === 13) {
            focusedButton === msgYesButtonGroup ? accept() : cancel();
        }
    };

    function close() {
        msgBoxGroup.parentNode.removeChild(msgBoxGroup);
        window.removeEventListener("keydown", switchFocusOrEnter, false);
    };

    function accept() {
        close();
        //being frozen if I don't do a timeout, but won't matter later because of web worker
        if (acceptCallback) {
            setTimeout(acceptCallback, 10);
        }
    };

    function cancel() {
        close();
    };*/

    parent.appendChild(msgBoxGroup);
    //window.addEventListener("keydown", switchFocusOrEnter, false);

};

/*this.SVGAcceptBox = function () { ok
};

this.SVGErrorBox = function () { yes, cancel
};

this.SVGWarningBox = function () { yes, cancel
};

this.SVGInfoBox = function () { ok
};*/

