

var xmlns = "http://www.w3.org/2000/svg";
var xlink = "http://www.w3.org/1999/xlink";
var svgXmlNs = "http://www.w3.org/2000/xmlns/";

var root = document.documentElement;

var isTouchSupported = 'ontouchstart' in window;
var mDownE = isTouchSupported ? 'touchstart' : 'mousedown';
var mMoveE = isTouchSupported ? 'touchmove' : 'mousemove';
var mUpE = isTouchSupported ? 'touchend' : 'mouseup';


function sidePanel() {





}

function panel() {
            //<rect fill="black" height="50"  width="25" stroke="red" stroke-width="2" x="20" y="20" ry="10" />
           // <rect fill="gray" height="34" width="2" stroke="gray" stroke-width="2" x="25" y="28" ry="1" />
           // <rect fill="gray" height="34" width="2" stroke="gray" stroke-width="2" x="30" y="28" ry="1" />

    //var sideClick = document.getElementById("sideClick")
    this.g = document.createElementNS(xmlns, "g");
    this.rect = document.createElementNS(xmlns,"rect");
    this.rect.setAttributeNS(null, "height", "51");
    this.rect.setAttributeNS(null, "width", "28");
    this.rect.setAttributeNS(null, "fill", "black");
    this.rect.setAttributeNS(null, "rx", "5");
    this.rect.setAttributeNS(null, "stroke", "red");
    this.rect.setAttributeNS(null, "stroke-width", "2");
    this.rect.setAttributeNS(null, "x", (window.innerWidth - 26));
    this.rect.setAttributeNS(null, "y", (window.innerHeight / 2 - 25));
    this.g.appendChild(this.rect);
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
        this.g.appendChild(rect);
    }
    this.panel = document.createElementNS(xmlns, "rect");
    this.panel.setAttributeNS(null, "height", window.innerHeight);
    this.panel.setAttributeNS(null, "width", "2");
    this.panel.setAttributeNS(null, "fill", "gray");
    this.panel.setAttributeNS(null, "rx", "2");
    this.panel.setAttributeNS(null, "stroke", "black");
    this.panel.setAttributeNS(null, "stroke-width", "2");
    this.panel.setAttributeNS(null, "x", (window.innerWidth - 2));
    this.panel.setAttributeNS(null, "y", "0");
    //this.sideClick.setAttributeNS(null, "translate", "transform(" + +"," + +")"
    this.g.appendChild(this.panel);
    root.appendChild(this.g);



    this.rect.addEventListener(mDownE, function (evt) {
        mX = isTouchSupported ? evt.changedTouches[0].pageX : evt.clientX
        mY = isTouchSupported ? evt.changedTouches[0].pageY : evt.clientY


    });

}
function point(x, y) {
    this.x = x;
    this.y = y;
}

panel()



