
// @@@@@@@@@@@@@@@    Side Panel 


function sidePainel() {
    var xmlns = 'http://www.w3.org/2000/svg';
    var xlinkns = 'http://www.w3.org/1999/xlink';
    ratioscreen.availHeight
    screen.availWidth
    svgPainel = document.createElement('SVG')
    this.Canvas = document.createElementNS(xmlns, "svg");
    this.Canvas.setAttributeNS(null, "width", (window.innerWidth));
    this.Canvas.setAttributeNS(null, "height", (window.innerHeight - 25));
    this.Canvas.setAttributeNS(null, "x", 0);
    this.Canvas.setAttributeNS(null, "y", 25);
    this.Canvas.setAttributeNS(null, "viewBox", "0 25 " + (window.innerWidth) + " " + (window.innerHeight - 25));
    this.Canvas.defs = document.createElementNS(xmlns, "defs");
    this.Canvas.defs.protoNode = document.createElementNS(xmlns, "g");
    this.Canvas.defs.protoNode.setAttributeNS(null, "id", "proto");
    this.Canvas.defs.protoNode.rect = document.createElementNS(xmlns, "rect");
    this.Canvas.defs.protoNode.rect.setAttributeNS(null, "x", 0);
    this.Canvas.defs.protoNode.rect.setAttributeNS(null, "y", 0);
    this.Canvas.defs.protoNode.rect.setAttributeNS(null, "width", 28);
    this.Canvas.defs.protoNode.rect.setAttributeNS(null, "height", 20);
    this.Canvas.defs.protoNode.rect.setAttributeNS(null, "fill", "blue");
    this.Canvas.defs.protoNode.rect.setAttributeNS(null, "stroke", "red");
    this.Canvas.defs.protoNode.rect.setAttributeNS(null, "stroke-width", 1);
    this.Canvas.defs.protoNode.appendChild(this.Canvas.defs.protoNode.rect);
    this.Canvas.defs.protoNode.txt = document.createElementNS(xmlns, "text");
    this.Canvas.defs.protoNode.txt.setAttributeNS(null, "x", "10");
    this.Canvas.defs.protoNode.txt.setAttributeNS(null, "y", "15");
    this.Canvas.defs.protoNode.txt.setAttributeNS(null, "font-size", "18");
    this.Canvas.defs.protoNode.txt.setAttributeNS(null, "font-family", "garamond");
    this.Canvas.defs.protoNode.txt.setAttributeNS(null, "pointer-events", "none");
    this.Canvas.defs.protoNode.txt.tn = document.createTextNode(" ");
    this.Canvas.defs.protoNode.txt.appendChild(this.Canvas.defs.protoNode.txt.tn);
    this.Canvas.defs.protoNode.appendChild(this.Canvas.defs.protoNode.txt);
    this.Canvas.defs.appendChild(this.Canvas.defs.protoNode);
    this.Canvas.appendChild(this.Canvas.defs);
    this.Canvas.bg = document.createElementNS(xmlns, "rect");
    this.Canvas.bg.setAttributeNS(null, "id", "CanvasBg");
    this.Canvas.bg.setAttributeNS(null, "x", 0);
    this.Canvas.bg.setAttributeNS(null, "y", 0);
    this.Canvas.bg.setAttributeNS(null, "width", innerWidth);
    this.Canvas.bg.setAttributeNS(null, "height", innerHeight);
    this.Canvas.bg.setAttributeNS(null, "fill", "#eed");
    this.Canvas.bg.setAttributeNS(null, "stroke", "none");
    this.Canvas.appendChild(this.Canvas.bg);
    this.Canvas.Edges = document.createElementNS(xmlns, "g");
    this.Canvas.Edges.setAttributeNS(null, "id", "Edges");
    this.Canvas.appendChild(this.Canvas.Edges);
    this.Canvas.Nodes = document.createElementNS(xmlns, "g");
    this.Canvas.appendChild(this.Canvas.Nodes);
    this.Canvas.addEventListener("mouseup", this.mup, false);
    this.Canvas.addEventListener("mousedown", this.mdown, false);
    document.documentElement.addEventListener("keyup", this.kup, false);
    document.documentElement.addEventListener("keydown", this.kdown, false);
    document.documentElement.addEventListener("keydown", this.backspace, false);
    document.documentElement.addEventListener("keypress", this.kpress, false);
    document.documentElement.appendChild(this.Canvas);



}



function screenType(evt) {
    screen.availHeight
    screen.availWidth
}




//@@@@@@@@@@@@@@@@ End Side Panel