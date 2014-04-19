

var xmlns = "http://www.w3.org/2000/svg";
var xlink = "http://www.w3.org/1999/xlink";
var svgXmlNs = "http://www.w3.org/2000/xmlns/";

var root = document.documentElement;

var isTouchSupported = 'ontouchstart' in window;
var mDownE = isTouchSupported ? 'touchstart' : 'mousedown';
var mMoveE = isTouchSupported ? 'touchmove' : 'mousemove';
var mUpE = isTouchSupported ? 'touchend' : 'mouseup';


function panel() {
            //<rect fill="black" height="50"  width="25" stroke="red" stroke-width="2" x="20" y="20" ry="10" />
           // <rect fill="gray" height="34" width="2" stroke="gray" stroke-width="2" x="25" y="28" ry="1" />
           // <rect fill="gray" height="34" width="2" stroke="gray" stroke-width="2" x="30" y="28" ry="1" />

    //var sideClick = document.getElementById("sideClick")
    var g = document.createElementNS(xmlns, "g");
    var rect = document.createElementNS(xmlns,"rect");
    rect.setAttributeNS(null, "height", "51");
    rect.setAttributeNS(null, "width", "28");
    rect.setAttributeNS(null, "fill", "black");
    rect.setAttributeNS(null, "rx", "5");
    rect.setAttributeNS(null, "stroke", "red");
    rect.setAttributeNS(null, "stroke-width", "2");
    rect.setAttributeNS(null, "x", (window.innerWidth - 26));
    rect.setAttributeNS(null, "y", (window.innerHeight / 2 - 25));
    g.appendChild(rect);
    for (var i = 0; i < 3; i++) {
        var rect = document.createElementNS(xmlns, "rect");
        rect.setAttributeNS(null, "height", "34");
        rect.setAttributeNS(null, "width", "2");
        rect.setAttributeNS(null, "fill", "gray");
        rect.setAttributeNS(null, "rx", "1");
        rect.setAttributeNS(null, "stroke", "gray");
        rect.setAttributeNS(null, "stroke-width", "2");
        rect.setAttributeNS(null, "x", (window.innerWidth - 22 + (i * 7)));
        rect.setAttributeNS(null, "y", (window.innerHeight / 2 - 16));
        g.appendChild(rect);
    }
    var panel = document.createElementNS(xmlns, "rect");
    panel.setAttributeNS(null, "height", window.innerHeight);
    panel.setAttributeNS(null, "width", "2");
    panel.setAttributeNS(null, "fill", "gray");
    panel.setAttributeNS(null, "rx", "2");
    panel.setAttributeNS(null, "stroke", "black");
    panel.setAttributeNS(null, "stroke-width", "2");
    panel.setAttributeNS(null, "x", (window.innerWidth - 2));
    panel.setAttributeNS(null, "y", "0");
    g.appendChild(panel);
    root.appendChild(g);

    g.open = false;

    root.addEventListener(mUpE, function (evt) {
        g.removeEventListener(mMoveE, movePanel, false);
    }, false);

    g.addEventListener(mDownE, function (evt) {
        g.addEventListener(mMoveE, movePanel, false);
    }, false);

    g.addEventListener("click", function (evt) {
        g.removeEventListener(mMoveE, movePanel, false);
        g.open = true;
        var sidePanel = evt.currentTarget;

        sidePanel.childNodes[0].setAttributeNS(null, "x", window.innerWidth-350 - 26)
        sidePanel.childNodes[1].setAttributeNS(null, "x", window.innerWidth-350 - 22)
        sidePanel.childNodes[2].setAttributeNS(null, "x", window.innerWidth-350 - 15)
        sidePanel.childNodes[3].setAttributeNS(null, "x", window.innerWidth-350 - 8)
        sidePanel.childNodes[4].setAttributeNS(null, "x", window.innerWidth-350)
        sidePanel.childNodes[4].setAttributeNS(null, "width", window.innerWidth-350)

    }, false);

};

function movePanel(evt) {
            mX = isTouchSupported ? evt.changedTouches[0].pageX : evt.clientX
            mY = isTouchSupported ? evt.changedTouches[0].pageY : evt.clientY
            var sidePanel = evt.currentTarget;

            sidePanel.childNodes[0].setAttributeNS(null, "x", mX - 26 )
            sidePanel.childNodes[1].setAttributeNS(null, "x", mX - 22)
            sidePanel.childNodes[2].setAttributeNS(null, "x", mX - 15)
            sidePanel.childNodes[3].setAttributeNS(null, "x", mX - 8)
            sidePanel.childNodes[4].setAttributeNS(null, "x", mX)
            sidePanel.childNodes[4].setAttributeNS(null, "width", window.innerWidth-mX)

            //sidePanel.setAttributeNS(null, "x", (mx - 2));
};





panel();
