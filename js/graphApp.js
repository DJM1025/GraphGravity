var testing = 1;

/********************************************************************* Global Variables  */




var kpressBool;/* Used as a check for if the keyboard is pressed down, only 
used in functions Kpress and backspace */


/********************************************************************* Touch Setup */
var isTouchSupported = 'ontouchstart' in window;
var mDownE = isTouchSupported ? 'touchstart' : 'mousedown';
var mMoveE = isTouchSupported ? 'touchmove' : 'mousemove';
var mUpE = isTouchSupported ? 'touchend' : 'mouseup';


function aspectRatio() {
    var windowAR = window.innerWidth / window.innerHeight;
    var docW = (+document.getElementById('CanvasBg').getAttributeNS(null, "width"));
    var docH = (+document.getElementById('CanvasBg').getAttributeNS(null, "height"));
    var docAR = docW / docH;
    var vBox = Graph.Canvas.getAttributeNS(null, "viewBox");
    var CanvasBg = document.getElementById("CanvasBg");
    var SVGwidth = Math.max((+CanvasBg.getAttributeNS(null, "width")), (+CanvasBg.getAttributeNS(null, "width"))) + 10;
    vBox = vBox.split(" ");
    var minX = Graph.Canvas.viewbox.minX
    var minY = Graph.Canvas.viewbox.minY
    var width = Graph.Canvas.viewbox.width
    var height = Graph.Canvas.viewbox.height
    var viewBoxAR = width / height;
    if (window.innerWidth > docW) {
        document.getElementById('CanvasBg').setAttributeNS(null, "width", window.innerWidth);
    }
    if (window.innerHeight > docH) {
        document.getElementById('CanvasBg').setAttributeNS(null, "height", window.innerHeight);
    }
    if (windowDimensions.width != window.innerWidth) {
        //var windowWidthDiff=window.innerWidth-windowDimensions.width;
        //var windowWidthViewRatio=Graph.Canvas.viewbox.width/windowDimensions.width;
        var newWidth = Math.floor(height * windowAR);
        //var newWidth = width+(windowWidthDiff*windowWidthViewRatio);
        Graph.Canvas.setAttributeNS(null, "width", window.innerWidth);
        Graph.Canvas.setAttributeNS(null, "height", window.innerHeight);
        Graph.Canvas.setAttributeNS(null, "viewBox", minX + " " + minY + " " + newWidth + " " + height);
        Graph.Canvas.viewbox.minX = minX;
        Graph.Canvas.viewbox.minY = minY;
        Graph.Canvas.viewbox.width = newWidth;
        Graph.Canvas.viewbox.height = height;
        windowDimensions.width = window.innerWidth;
    }
    if (windowDimensions.height != window.innerHeight) {
        //var windowHeightDiff=window.innerHeight-windowDimensions.height;
        //var windowHeightViewRatio=Graph.Canvas.viewbox.height/windowDimensions.height;
        var newHeight = Math.floor(width * (1 / windowAR));
        //var newHeight = height+(windowHeightDiff*windowHeightViewRatio);
        Graph.Canvas.setAttributeNS(null, "width", window.innerWidth);
        Graph.Canvas.setAttributeNS(null, "height", window.innerHeight);
        Graph.Canvas.setAttributeNS(null, "viewBox", minX + " " + minY + " " + width + " " + newHeight);
        Graph.Canvas.viewbox.minX = minX;
        Graph.Canvas.viewbox.minY = minY;
        Graph.Canvas.viewbox.width = width;
        Graph.Canvas.viewbox.height = newHeight;
        windowDimensions.height = window.innerHeight;
    }
    if ((Graph.Canvas.viewbox.minX + Graph.Canvas.viewbox.width) > docW) {
        Graph.Canvas.viewbox.minX = docW - Graph.Canvas.viewbox.width;
    }
    if ((Graph.Canvas.viewbox.minY + Graph.Canvas.viewbox.height) > docH) {
        Graph.Canvas.viewbox.minY = docH - Graph.Canvas.viewbox.height;
    }
    if (Graph.Canvas.viewbox.minX < 0) {
        Graph.Canvas.viewbox.minX = 0;
    }
    if (Graph.Canvas.viewbox.minY < 0) {
        Graph.Canvas.viewbox.minY = 0;
    }
    if (Graph.Canvas.viewbox.minX == 0 && Graph.Canvas.viewbox.width > docW) {
        document.getElementById('CanvasBg').setAttributeNS(null, "width", Graph.Canvas.viewbox.width);
    }
    if (Graph.Canvas.viewbox.minY == 0 && Graph.Canvas.viewbox.height > docH) {
        document.getElementById('CanvasBg').setAttributeNS(null, "height", Graph.Canvas.viewbox.height);
    }
    redrawNavPanel();
    if (helpFlag == true) {
        helpPlace();
    }
}

function modeIndicatorPosition() {
    var mode = document.getElementById('mode');
    var rect = mode.firstChild;
    var text = rect.nextSibling;
    var rightEdge = window.innerWidth - (bwidth + 2)
    if (rightEdge > buttons.length * (bwidth + 2) - 2) {
        rect.setAttributeNS(null, "x", rightEdge);
        rect.setAttributeNS(null, "y", 0);
        text.setAttributeNS(null, "x", rightEdge + 15);
        text.setAttributeNS(null, "y", 15);
    }
    else {
        rect.setAttributeNS(null, "x", 0);
        rect.setAttributeNS(null, "y", barheight + 2);
        text.setAttributeNS(null, "x", 15);
        text.setAttributeNS(null, "y", barheight + 17);
    }
}

function init() {
    xmlns = 'http://www.w3.org/2000/svg';
    xlinkns = 'http://www.w3.org/1999/xlink';
    top.SVGRegister = import2; // added debug 8-5 then for additional change SVGRegister to import2
    top.SVGRegister2 = export1;
    top.SVGRegister3 = localImport;
    //document.documentElement.setAttributeNS(null, "viewBox", "0 0 "+window.innerWidth+" "+window.innerHeight);
    document.documentElement.addEventListener("mousedown", function (evt) { evt.preventDefault(); }, false);
    document.documentElement.addEventListener("keypress", function (evt) { if (evt.keyCode == 8) evt.preventDefault(); }, false);
    windowDimensions = { width: window.innerWidth, height: window.innerHeight };
    Graph = new graph();
    if (window.addEventListener) {
        window.addEventListener("resize", aspectRatio, false);
       // window.addEventListener("resize", modeIndicatorPosition, false);
    }
    //var c = ["blue","yellow"]; //colors may still be sent as a parameter to addMenu()
    addMenu(0);
    addMenu(1);
    addMenu(2);
    addMenu(3);
    addMenu(4, true); var HelpColors = new Array("none", "red", "blue", "purple");
    addMenu(5, false, HelpColors);
    appendHelp();
    document.getElementById('helpFile').addEventListener("mousedown", function (evt) {
        if (evt.button === 0 || evt.button === undefined) { evt.preventDefault(); showHide('visible', 5); }
    }, false);
    window.focus();
    logAction("start");
}


/********************************************************************************* graph 
 * Graph Object, this is used for the graph work area interface. 
 * This is how the graph is able to draw, destroy and execute user input.*/
function graph(){
	this.Nodes=new Nodes();
	this.Edges=new Edges();
	this.SelectedNodes=new Object();
	this.selectionCenter=new Object();
	this.selectionDist=new Object();
	this.createCanvas();
	this.Canvas.parent=this;
	this.Canvas.viewbox={minX:0,minY:0,width:window.innerWidth,height:window.innerHeight};
	this.Canvas.Position=new Object();
	this.Canvas.Position.x=function(clientX){
		var x=(clientX*Math.max(Graph.Canvas.viewbox.width/window.innerWidth, Graph.Canvas.viewbox.height/window.innerHeight))+Math.max(0, Graph.Canvas.viewbox.height/2*(window.innerWidth/window.innerHeight-Graph.Canvas.viewbox.width/Graph.Canvas.viewbox.height))+Graph.Canvas.viewbox.minX;
		return x;		
	}
	this.Canvas.Position.y=function(clientY){
		var y=(clientY*Math.max(Graph.Canvas.viewbox.width/window.innerWidth, Graph.Canvas.viewbox.height/window.innerHeight))+Math.max(0, Graph.Canvas.viewbox.width/2*(window.innerHeight/window.innerWidth-Graph.Canvas.viewbox.height/Graph.Canvas.viewbox.width))+Graph.Canvas.viewbox.minY;
		return y;		
	}
	this.nodenum=1;
	this.labelnum=1;
	this.PasteBoard=new Object();
	this.retainSelection=false;
	this.selecting=false;
	this.transitionSelection=false;
	this.copies; //multiplier used to displace copied nodes
	this.Colors=new Array("#faa","#faf","#8af","#aff","#bf9","#a8f","#fa8");
}

/************************************************************************** createCanvas */
graph.prototype.createCanvas = function(){
	this.Canvas=document.createElementNS(xmlns,"svg");
	this.Canvas.setAttributeNS(null,"width",(window.innerWidth));
	this.Canvas.setAttributeNS(null, "height", (window.innerHeight -25));
	this.Canvas.setAttributeNS(null, "x", 0);
	this.Canvas.setAttributeNS(null, "y", 25);
	this.Canvas.setAttributeNS(null,"viewBox","0 25 "+(window.innerWidth)+" "+(window.innerHeight - 25));
	this.Canvas.defs=document.createElementNS(xmlns,"defs");
	this.Canvas.defs.protoNode=document.createElementNS(xmlns,"g");
	this.Canvas.defs.protoNode.setAttributeNS(null,"id","proto");
	this.Canvas.defs.protoNode.rect=document.createElementNS(xmlns,"rect");
	this.Canvas.defs.protoNode.rect.setAttributeNS(null,"x",0);
	this.Canvas.defs.protoNode.rect.setAttributeNS(null,"y",0);
	this.Canvas.defs.protoNode.rect.setAttributeNS(null,"width",28);
	this.Canvas.defs.protoNode.rect.setAttributeNS(null,"height",20);
	this.Canvas.defs.protoNode.rect.setAttributeNS(null,"fill","blue");
	this.Canvas.defs.protoNode.rect.setAttributeNS(null,"stroke","red");
	this.Canvas.defs.protoNode.rect.setAttributeNS(null,"stroke-width",1);
	this.Canvas.defs.protoNode.appendChild(this.Canvas.defs.protoNode.rect);
	this.Canvas.defs.protoNode.txt=document.createElementNS(xmlns,"text");
	this.Canvas.defs.protoNode.txt.setAttributeNS(null,"x","10");
	this.Canvas.defs.protoNode.txt.setAttributeNS(null,"y","15");
	this.Canvas.defs.protoNode.txt.setAttributeNS(null,"font-size","18");
	this.Canvas.defs.protoNode.txt.setAttributeNS(null,"font-family","garamond");
	this.Canvas.defs.protoNode.txt.setAttributeNS(null,"pointer-events","none");
	this.Canvas.defs.protoNode.txt.tn = document.createTextNode(" ");
	this.Canvas.defs.protoNode.txt.appendChild(this.Canvas.defs.protoNode.txt.tn);
	this.Canvas.defs.protoNode.appendChild(this.Canvas.defs.protoNode.txt);
	this.Canvas.defs.appendChild(this.Canvas.defs.protoNode);
	this.Canvas.appendChild(this.Canvas.defs);
	this.Canvas.bg=document.createElementNS(xmlns,"rect");
	this.Canvas.bg.setAttributeNS(null,"id","CanvasBg");
	this.Canvas.bg.setAttributeNS(null,"x",0);
	this.Canvas.bg.setAttributeNS(null,"y",0);
	this.Canvas.bg.setAttributeNS(null,"width",innerWidth);
	this.Canvas.bg.setAttributeNS(null,"height",innerHeight);
	this.Canvas.bg.setAttributeNS(null,"fill","#eed");
	this.Canvas.bg.setAttributeNS(null,"stroke","none");
	this.Canvas.appendChild(this.Canvas.bg);
	this.Canvas.Edges=document.createElementNS(xmlns,"g");
	this.Canvas.Edges.setAttributeNS(null,"id","Edges");
	this.Canvas.appendChild(this.Canvas.Edges);
	this.Canvas.Nodes=document.createElementNS(xmlns,"g");
	this.Canvas.appendChild(this.Canvas.Nodes);
	this.Canvas.addEventListener("mouseup", this.mup, false);
	this.Canvas.addEventListener("mousedown", this.mdown, false);
	//this.Canvas.addEventListener("mousemove", this.updateUserCoords, false);
	document.documentElement.addEventListener("keyup", this.kup, false);
	document.documentElement.addEventListener("keydown", this.kdown, false);
	document.documentElement.addEventListener("keydown",this.backspace,false);
	document.documentElement.addEventListener("keypress",this.kpress,false);
	document.documentElement.appendChild(this.Canvas);
	//document.getElementById("viewer").appendChild(this.Canvas);
}

/**************************************************************************** createNode */
graph.prototype.createNode = function(node){
	var group=document.getElementById('proto').cloneNode(true);//Graph.Canvas.defs.protoNode produced null error in ASV
	group.setAttributeNS(null,"id",node.id);
	group.addEventListener("mousedown", Graph.Nodes.down, false);
	group.addEventListener("mouseover", Graph.Nodes.over, false);
	group.addEventListener("mouseout", Graph.Nodes.out, false);
	if(helpFlag) group.addEventListener("mouseover", help, false);
	Graph.Canvas.Nodes.appendChild(group);
	var rect = group.firstChild;
	rect.setAttributeNS(null,"x",node.x);
	rect.setAttributeNS(null,"y",node.y);	
	rect.setAttributeNS(null,"stroke","red");
	rect.setAttributeNS(null,"fill",node.color);
	rect.setAttributeNS(null,"width",node.width);
	rect.setAttributeNS(null,"height",node.height);
	var text=rect.nextSibling;
	text.id='text'+node.label;
	text.setAttributeNS(null,"x",node.x+5);
	text.setAttributeNS(null,"y",node.y+node.height-5);
	text.firstChild.nodeValue = node.label;
	Graph.scribe(group,node.label);
	rect.getA
}

/********************************************************************************* mdown
 * stands for Mouse Down, used as an event listener for the whole of the 
 * graph working area */
graph.prototype.mdown = function(evt){
	if(evt.button===0 || evt.button===undefined){
		evt.preventDefault();
		evt.stopPropagation();
		if(evt.shiftKey || Graph.selecting){
			var band=document.getElementById('band');
			band.setAttributeNS(null, "x", Graph.Canvas.Position.x(isTouchSupported ? evt.changedTouches[0].pageX : evt.clientX));
			band.setAttributeNS(null, "y", Graph.Canvas.Position.y(isTouchSupported ? evt.changedTouches[0].pageY : evt.clientY));
			band.setAttributeNS(null,"width",0);
			band.setAttributeNS(null,"height",0);
			Graph.Canvas.appendChild(band);
			var offX = Graph.Canvas.Position.x(isTouchSupported ? evt.changedTouches[0].pageX : evt.clientX)
			var offY = Graph.Canvas.Position.y(isTouchSupported ? evt.changedTouches[0].pageY : evt.clientY);
			var rubberBandStart=function(evt){rubberBand(evt,offX,offY);}
			var removeBand=function(){
				document.getElementById('back').appendChild(band);
				var changed=false;
				for(var i in Graph.Nodes){
					if(Graph.Nodes[i].x > (+band.getAttributeNS(null, "x")) && Graph.Nodes[i].x < (+band.getAttributeNS(null, "x"))+(+band.getAttributeNS(null, "width")) && Graph.Nodes[i].y>(+band.getAttributeNS(null, "y")) && Graph.Nodes[i].y<(+band.getAttributeNS(null, "y"))+(+band.getAttributeNS(null, "height"))){
						if(!Graph.SelectedNodes[i]){
							Graph.Nodes.select(i);
							changed=true;
						}
					}
				}
				//if(changed) logSel("modified selection");
				document.documentElement.removeEventListener("mouseup", removeBand,false);
			}
			var restoreCanvasUp=function(){Graph.Canvas.addEventListener("mouseup", Graph.mup, false); document.documentElement.removeEventListener("mouseup", restoreCanvasUp, false);}
			Graph.Canvas.removeEventListener("mouseup", Graph.mup, false);
			document.documentElement.addEventListener("mouseup", restoreCanvasUp, false);
			document.documentElement.addEventListener("mousemove", rubberBandStart,false);
			document.documentElement.addEventListener("mouseup", function(){document.documentElement.removeEventListener("mousemove", rubberBandStart,false);},false);
			document.documentElement.addEventListener("mouseup", removeBand,false);
		}
	}
}

/*********************************************************************************** mup 
 * stands for Mouse up, used as an event listener for the whole of the 
 * graph working area */
graph.prototype.mup = function(evt){
	if(evt.button===0 || evt.button===undefined){
		evt.preventDefault();
		var node=evt.currentTarget;
		if(isEmptyObject(Graph.SelectedNodes)){
			if(Graph.retainSelection || Graph.transitionSelection || evt.shiftKey || Graph.selecting){
				Graph.addNode(evt);
				var node=document.getElementById('g'+(Graph.nodenum-1));
				Graph.Nodes.select(node.id);
				//logSel()
				logAction("created node");
			}
			else{
				Graph.addNode(evt);
				logAction("created node");
			}
		}
		else{
			if(Graph.retainSelection || Graph.transitionSelection){
				Graph.addNode(evt);
				var node=document.getElementById('g'+(Graph.nodenum-1));
				for(i in Graph.SelectedNodes){
					Graph.Nodes.addEdge(node,Graph.SelectedNodes[i]);
				}
				if(Graph.transitionSelection){
					Graph.Nodes.none();
					Graph.Nodes.select(node.id);
				}
				//logSel()
				logAction("created node with edges");
			
			}
			else if(evt.shiftKey || Graph.selecting){
				Graph.addNode(evt);
				var node=document.getElementById('g'+(Graph.nodenum-1));
				Graph.Nodes.select(node.id);
				logAction("created node");
			}
			else Graph.Nodes.none();
		}
	}
}

/******************************************************************************* addNode 
This will create a new node object that is contained in the Graph work area. */
graph.prototype.addNode = function(evt){
	var node = new Object();
	node.x = this.Canvas.Position.x(isTouchSupported ? evt.changedTouches[0].pageX : evt.clientX);
	node.y = this.Canvas.Position.y(isTouchSupported ? evt.changedTouches[0].pageY : evt.clientY);
	node.id='g'+this.nodenum;
	node.label=this.labelnum.toString();
	node.width=28;
	node.height=20;
	node.color=this.Colors[this.nodenum%this.Colors.length];
	node.edges=new Object();
	node.state=0;
	this.Nodes[node.id]=node;
	this.nodenum++;
	this.labelnum++;
	this.createNode(node);
}


/********************************************************************************* width */
graph.prototype.width = function(){
	var width=0;
	for(var i in Graph.Nodes){
		if(typeof Graph.Nodes[i]=='object'){
			width=Math.max((Graph.Nodes[i].x+Graph.Nodes[i].width),width);
		}
	}
	return Math.ceil(width);
}

/******************************************************************************** height */
graph.prototype.height = function(){
	var height=0;
	for(var i in Graph.Nodes){
		if(typeof Graph.Nodes[i]=='object'){
			height=Math.max((Graph.Nodes[i].y+Graph.Nodes[i].height),height);
		}
	}
	return Math.ceil(height);
}

/******************************************************************************** scribe */
graph.prototype.scribe = function(node,label){
	var rect=node.firstChild;
	rect.nextSibling.firstChild.nodeValue=label;
	var bbox=rect.nextSibling.getBBox();
	if(bbox.width>0)var width = Math.ceil(bbox.width)+15;
	//var len=rect.nextSibling.getComputedTextLength()
	//if(len>0)var width = Math.ceil(len)+15;
	else var width = 15;
	Graph.Nodes[node.id].width=width;
	Graph.Nodes[node.id].label=label;
	rect.setAttributeNS(null,"width", width);
}

/******************************************************************************** kpress */
graph.prototype.kpress = function(evt){
	if(GlobalStatus!="label") return false
	evt.preventDefault();
	if (evt.keyCode) var k= evt.keyCode;
	else var k = evt.charCode;
	var qk=String.fromCharCode(k);
	if (k==8){
		evt.preventDefault();
		evt.stopPropagation();
		return false;
	}
	kpressBool = (kpressBool) ? kpressBool : false;
	if (k==13 && kpressBool==true){//Enter key (return key)
		kpressBool=false;
		setStatus(oldGlobalStatus,buttons[4][0]);
	}
	else kpressBool=true;
	if(!isEmptyObject(Graph.SelectedNodes)){
		if(k>=33 && k<=126){
			for(var i in Graph.SelectedNodes){
				Graph.Nodes[i].label+=qk;
				Graph.scribe(Graph.SelectedNodes[i],Graph.Nodes[i].label);
				Graph.Edges.move(Graph.Nodes[i]);
				kpressBool = true;
			}
			logAction("modified labels");
		}
		else if(k==32){
			for(var i in Graph.SelectedNodes){
				Graph.Nodes[i].label+='\u2219';
				Graph.scribe(Graph.SelectedNodes[i],Graph.Nodes[i].label);
				Graph.Edges.move(Graph.Nodes[i]);
				kpressBool = true;
			}
			logAction("modified labels");
		}
		/*if(k>=33 && k<=36 || k>=41 && k<=126){
			for(var i in Graph.SelectedNodes){
				Graph.Nodes[i].label+=qk;
				Graph.scribe(Graph.SelectedNodes[i],Graph.Nodes[i].label);
				Graph.Edges.move(Graph.Nodes[i]);
				kpressBool = true;
			}
			logAction("modified labels");
		}
		else if(k>=37 && k<=40){
			if(evt.shiftKey){
				for(var i in Graph.SelectedNodes){
					Graph.Nodes[i].label+=qk;
					Graph.scribe(Graph.SelectedNodes[i],Graph.Nodes[i].label);
					Graph.Edges.move(Graph.Nodes[i]);
					kpressBool = true;
				}
			}
			else if(k==37){
				for(var i in Graph.SelectedNodes){
					Graph.Nodes[i].label+='\u2190';
					Graph.scribe(Graph.SelectedNodes[i],Graph.Nodes[i].label);
					Graph.Edges.move(Graph.Nodes[i]);
					kpressBool = true;
				}
			}
			else if(k==38){
				for(var i in Graph.SelectedNodes){
					Graph.Nodes[i].label+='\u2191';
					Graph.scribe(Graph.SelectedNodes[i],Graph.Nodes[i].label);
					Graph.Edges.move(Graph.Nodes[i]);
					kpressBool = true;
				}
			}
			else if(k==39){
				for(var i in Graph.SelectedNodes){
					Graph.Nodes[i].label+='\u2192';
					Graph.scribe(Graph.SelectedNodes[i],Graph.Nodes[i].label);
					Graph.Edges.move(Graph.Nodes[i]);
					kpressBool = true;
				}
			}
			else if(k==40){
				for(var i in Graph.SelectedNodes){
					Graph.Nodes[i].label+='\u2193';
					Graph.scribe(Graph.SelectedNodes[i],Graph.Nodes[i].label);
					Graph.Edges.move(Graph.Nodes[i]);
					kpressBool = true;
				}
			}
			logAction("modified labels");
		
		}*/
	}
}

/*********************************************************************************** kup */
graph.prototype.kup = function(evt){
	if(GlobalStatus!="normal") return false
	evt.preventDefault();
	var k=evt.keyCode;
	if(k==46 && window.navigator.appName!="Adobe SVG Viewer"){
		Graph.removeNodes();
		return false;
	}
	else if(k==127){
		Graph.removeNodes();
		return false;
	}
	else if(k==65) Graph.Nodes.all();
	else if(k==68) Graph.Nodes.none();
	else if(k==70) Graph.Nodes.invert();
	else if(k==69) Graph.Nodes.expand();
	else if(k==88) Graph.Nodes.extrude();
	else if(k==67) Graph.Nodes.copy();
	else if(k==86) Graph.Nodes.paste();
	else if(k==73) Graph.Nodes.complement();
	else if(k==89) Graph.Nodes.redo();
	else if(k==90) Graph.Nodes.undo();
	else if(k==82) Graph.retainSelection=false;
	else if(k==83) Graph.selecting=false;
	else if(k==84) Graph.transitionSelection=false;
	else if(k==77) nextPermutation();
	else if(k==78) previousPermutation();
	else if(k==116) runCurrentPermutation();
	else if(k==117) subGraph();
}

/***************************************************************************** backspace */
graph.prototype.backspace = function(evt){
	if(GlobalStatus!="label") return false
	if (evt.keyCode==8){
		evt.preventDefault();
		evt.stopPropagation();
		if(!isEmptyObject(Graph.SelectedNodes)){
			for(var i in Graph.SelectedNodes){
				Graph.Nodes[i].label=Graph.Nodes[i].label.substring(0,Graph.Nodes[i].label.length-1);
				Graph.scribe(Graph.SelectedNodes[i],Graph.Nodes[i].label);
				Graph.Edges.move(Graph.Nodes[i]);
			}
			kpressBool = true;
			logAction("modified labels");
		}
	}
}

/********************************************************************************* kdown */
graph.prototype.kdown = function(evt){
	if(GlobalStatus!="normal") return false
	evt.preventDefault();
	evt.stopPropagation();
	//alert(evt.cancelable);
	var k=evt.keyCode;
	if (k==8){
		evt.preventDefault();
		evt.stopPropagation();
		Graph.Nodes.undo();
	}
	else if(k==13){ //Enter key (return key)
		setStatus(2,buttons[4][0]);
	}
	else if(k==82) Graph.retainSelection=true;
	else if(k==83) Graph.selecting=true;
	else if(k==84) Graph.transitionSelection=true;
	else if(k==37){
		if(Graph.Canvas.viewbox.minX>10) Graph.Canvas.viewbox.minX-=10;
		else Graph.Canvas.viewbox.minX=0;
		Graph.Canvas.setAttributeNS(null, "viewBox", Graph.Canvas.viewbox.minX+" "+Graph.Canvas.viewbox.minY+" "+Graph.Canvas.viewbox.width+" "+Graph.Canvas.viewbox.height);
		redrawNavPanel();
		/*if(!isEmptyObject(Graph.SelectedNodes)){
			for(var i in Graph.SelectedNodes){
				var rect=Graph.SelectedNodes[i].firstChild;
				var x2=(+rect.getAttributeNS(null, "x"))-2;
				rect.setAttributeNS(null,"x",x2);
				var text=rect.nextSibling;
				text.setAttributeNS(null,"x",x2+5);
				node=Graph.Nodes[i];
				node.x=x2;
				Graph.Edges.move(Graph.Nodes[i]);
			}
			logAction("moved sub graph");
		}*/
	}
	else if(k==38){
		if(Graph.Canvas.viewbox.minY>10) Graph.Canvas.viewbox.minY-=10;
		else Graph.Canvas.viewbox.minY=0;
		Graph.Canvas.setAttributeNS(null, "viewBox", Graph.Canvas.viewbox.minX+" "+Graph.Canvas.viewbox.minY+" "+Graph.Canvas.viewbox.width+" "+Graph.Canvas.viewbox.height);
		redrawNavPanel();
		/*
		if(!isEmptyObject(Graph.SelectedNodes)){
			for(var i in Graph.SelectedNodes){
				var rect=Graph.SelectedNodes[i].firstChild;
				var y2=(+rect.getAttributeNS(null, "y"))-2;
				rect.setAttributeNS(null,"y",y2);
				var text=rect.nextSibling;
				text.setAttributeNS(null,"y",y2+(+rect.getAttributeNS(null, "height"))-5);
				node=Graph.Nodes[i];
				node.y=y2;
				Graph.Edges.move(Graph.Nodes[i]);
			}
			logAction("moved sub graph");
		}*/
	}
	else if(k==39){
		doc=document.getElementById('CanvasBg');
		docW=doc.getAttributeNS(null,'width');
		if(Graph.Canvas.viewbox.minX+Graph.Canvas.viewbox.width<docW-10) Graph.Canvas.viewbox.minX+=10;
		else Graph.Canvas.viewbox.minX=docW-Graph.Canvas.viewbox.width;
		Graph.Canvas.setAttributeNS(null, "viewBox", Graph.Canvas.viewbox.minX+" "+Graph.Canvas.viewbox.minY+" "+Graph.Canvas.viewbox.width+" "+Graph.Canvas.viewbox.height);
		redrawNavPanel();
		/*
		if(!isEmptyObject(Graph.SelectedNodes)){
			for(var i in Graph.SelectedNodes){
				var rect=Graph.SelectedNodes[i].firstChild;
				var x2=(+rect.getAttributeNS(null, "x"))+2;
				rect.setAttributeNS(null,"x",x2);
				var text=rect.nextSibling;
				text.setAttributeNS(null,"x",x2+5);
				node=Graph.Nodes[i];
				node.x=x2;
				Graph.Edges.move(Graph.Nodes[i]);
			}
			logAction("moved sub graph");
		}*/
	}
	else if(k==40){
		doc=document.getElementById('CanvasBg');
		docH=doc.getAttributeNS(null,'height');
		if(Graph.Canvas.viewbox.minY+Graph.Canvas.viewbox.height<docH-10) Graph.Canvas.viewbox.minY+=10;
		else Graph.Canvas.viewbox.minY=docH-Graph.Canvas.viewbox.height;
		Graph.Canvas.setAttributeNS(null, "viewBox", Graph.Canvas.viewbox.minX+" "+Graph.Canvas.viewbox.minY+" "+Graph.Canvas.viewbox.width+" "+Graph.Canvas.viewbox.height);
		redrawNavPanel();
	}
	else if(k==192){
		var node = new Object();
		var bbox=Graph.Canvas.getBBox();
		node.x=Math.ceil(Math.random()*bbox.width);
		node.y=Math.ceil(Math.random()*bbox.height);
		node.id='g'+Graph.nodenum;
		node.label=Graph.labelnum.toString();
		node.width=28;
		node.height=20;
		node.color=Graph.Colors[Graph.nodenum%Graph.Colors.length];
		node.edges=new Object();
		Graph.Nodes[node.id]=node;
		Graph.nodenum++;
		Graph.labelnum++;
		Graph.createNode(node);
		logAction("egg");
	}
}
/****************************************************************************************
~~~~~~~~~~~~~~~~~~~~~~~~~~~~Ends Graph Prototype section~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/



/********************************************************************************* Nodes */
function Nodes(){

/*******************************************************************************/
/************************************************************************ redo */
	this.redo=function(){		
		var Panel=document.getElementById('APanel');
		var actionGroup=document.getElementById('actionList');
		var actionText=actionGroup.getElementsByTagName('text');
		if(actionText.length>1){
			if(actionGroup.lastChild.getAttributeNS(null,"opacity")==0.5){
				if (action<9) action++;
				else action=0;
				var current=document.getElementById('a'+action);
				var redoBool=false;
				for(i=0; i<actionText.length; i++){
					if(redoBool) actionText.item(i).setAttributeNS(null,"opacity",0.5);
					else actionText.item(i).setAttributeNS(null,"opacity",1);
					if(actionText.item(i).id==current.id){
						redoBool=true;
					}
					
				}
				Graph.Nodes.all();
				for(var i in Graph.SelectedNodes){
					for(var j in Graph.Nodes[i].edges){
						Graph.Nodes.removeEdge(Graph.Nodes[j],Graph.SelectedNodes[i]);
					}
				}
				for(var i in Graph.SelectedNodes){
					Graph.Canvas.Nodes.removeChild(Graph.SelectedNodes[i]);
					delete Graph.SelectedNodes[i];
					delete Graph.Nodes[i];
				}
				Graph.Nodes = cloneObject(RetainedNodes[action]);
				for(var i in Graph.Nodes){
					if(typeof Graph.Nodes[i]=="object") Graph.createNode(Graph.Nodes[i]);
				}
				for(var i in Graph.Nodes){
					m=document.getElementById(i);
					for(var j in Graph.Nodes[i].edges){
						n=document.getElementById(j);
						if(m.id<n.id) {
							if(!document.getElementById("L"+m.id+":"+n.id)) Graph.Nodes.addEdge(m,n);
						}
						else{
							if(!document.getElementById("L"+n.id+":"+m.id)) Graph.Nodes.addEdge(m,n);
						}
					}
				}
				for(var i in RetainedSelection[action]){
					Graph.Nodes.select(i);
				}
				Graph.nodenum=oldnodenum[action];
				Graph.labelnum=oldlabelnum[action];
				document.getElementById("CanvasBg").setAttributeNS(null, "width", oldDocWidth[action]);
				document.getElementById("CanvasBg").setAttributeNS(null, "height", oldDocHeight[action]);
				Graph.Canvas.setAttributeNS(null, "viewBox", oldViewBox[action]);
				var viewBoxArray=oldViewBox[action].split(' ');
				Graph.Canvas.viewbox.minX=parseInt(viewBoxArray[0], 10);
				Graph.Canvas.viewbox.minY=parseInt(viewBoxArray[1], 10);
				Graph.Canvas.viewbox.width=parseInt(viewBoxArray[2], 10);
				Graph.Canvas.viewbox.height=parseInt(viewBoxArray[3], 10);
				redrawNavPanel();
			}
		}
	}
/*******************************************************************************/
/************************************************************************ undo */
	this.undo=function(){		
		var Panel=document.getElementById('APanel');
		var actionGroup=document.getElementById('actionList');
		var actionText=actionGroup.getElementsByTagName('text');
		if(actionText.length>2){
			if(actionText.item(2).getAttributeNS(null,"opacity")==1){
				if (action>0) action--;
				else action=9;
				var current=document.getElementById('a'+action);
				var undoBool=false;
				for(i=0; i<actionText.length; i++){
					if(undoBool) actionText.item(i).setAttributeNS(null,"opacity",0.5);
					else actionText.item(i).setAttributeNS(null,"opacity",1);
					if(actionText.item(i).id==current.id){
						undoBool=true;
					}
					
				}
				Graph.Nodes.all();
				for(var i in Graph.SelectedNodes){
					for(var j in Graph.Nodes[i].edges){
						Graph.Nodes.removeEdge(Graph.Nodes[j],Graph.SelectedNodes[i]);
					}
				}
				for(var i in Graph.SelectedNodes){
					Graph.Canvas.Nodes.removeChild(Graph.SelectedNodes[i]);
					delete Graph.SelectedNodes[i];
					delete Graph.Nodes[i];
				}
				Graph.Nodes = cloneObject(RetainedNodes[action]);
				for(var i in Graph.Nodes){
					if(typeof Graph.Nodes[i]=="object") Graph.createNode(Graph.Nodes[i]);
				}
				for(var i in Graph.Nodes){
					m=document.getElementById(i);
					for(var j in Graph.Nodes[i].edges){
						n=document.getElementById(j);
						if(m.id<n.id) {
							if(!document.getElementById("L"+m.id+":"+n.id)) Graph.Nodes.addEdge(m,n);
						}
						else{
							if(!document.getElementById("L"+n.id+":"+m.id)) Graph.Nodes.addEdge(m,n);
						}
					}
				}
				for(var i in RetainedSelection[action]){
					Graph.Nodes.select(i);
				}
				Graph.nodenum=oldnodenum[action];
				Graph.labelnum=oldlabelnum[action];
				document.getElementById("CanvasBg").setAttributeNS(null, "width", oldDocWidth[action]);
				document.getElementById("CanvasBg").setAttributeNS(null, "height", oldDocHeight[action]);
				Graph.Canvas.setAttributeNS(null, "viewBox", oldViewBox[action]);
				var viewBoxArray=oldViewBox[action].split(' ');
				Graph.Canvas.viewbox.minX=parseInt(viewBoxArray[0], 10);
				Graph.Canvas.viewbox.minY=parseInt(viewBoxArray[1], 10);
				Graph.Canvas.viewbox.width=parseInt(viewBoxArray[2], 10);
				Graph.Canvas.viewbox.height=parseInt(viewBoxArray[3], 10);
				redrawNavPanel();
			}
		}
	}
/*******************************************************************************/
/*************************************************************** highlightPath */
	this.highlightPath=function(target, Q){
		Graph.Nodes.none();
		current=Q[target.id];
		for(;;){
			Graph.Nodes.select(current.id);
			if(!current.prev) return false;
			current=Q[current.prev];
		}	
	}
/*******************************************************************************/
/**************************************************************** shortestPath */	
	this.shortestPath=function(){
		var current,target,cnt,Q,i,j,q,p,n,next
		if(objectLength(Graph.SelectedNodes)!=2){
			message("please select two nodes to calculate a shortest path");
			return false;
		}
		next=new Array();
		p=0;
		n=0;
		Q = new Object();
		for (q in Graph.Nodes){
			if (typeof Graph.Nodes[q] == "object"){
				Q[q] = cloneObject(Graph.Nodes[q]);
			}
		}
		cnt=0;
		for(i in Graph.SelectedNodes){
			if(cnt==0) current=Q[i]
			else target=Q[i];
			cnt++;
		}
		for(j in Q){
			if(typeof Graph.Nodes[j] === "object"){
				Q[j].dist=Infinity;
				Q[j].prev=undefined;
				Q[j].ch=false;
			}
		}
		current.dist=0;
		for(;;){
			if(current==target){
				message("The shortest distance between these nodes is "+current.dist);
				Graph.Nodes.highlightPath(target, Q);
				return false;
			}
			for(j in current.edges){
				if(!Q[j].ch){
					if(Q[j].dist>current.dist+1){
						Q[j].dist=current.dist+1;
						Q[j].prev=current.id;
						next[p]=Q[j];
						p++;
					}
				}
			}
			Q[j].ch=true;
			current=next[n];
			n++;
			if(!current){
				message("nodes belong to disconnected subgraphs");
				return false;
			}
		}
	}
/*******************************************************************************/   //            <-----Up Date 
/************************************************************************ Force


*/
	this.force=function(){
		testing = 1;
		if(isEmptyObject(Graph.SelectedNodes)) Graph.Nodes.all();
		
		var graphNodesHold = new Array(objectLength(Graph.SelectedNodes));
			
		var graphForce = new window.Springy.GraphF(); 

		var row = 0, col = 0;
	
		for(var i in Graph.SelectedNodes){	//need to creat all nodes before edges can be added 	
			graphNodesHold[row] = graphForce.newNode();
			row++;
		}
		
		row = 0;	
		for(var i in Graph.SelectedNodes){
			col=0;
			for(var j in Graph.SelectedNodes){
				if(Graph.Nodes[i].edges[j]){
					graphForce.newEdge(graphNodesHold[row], graphNodesHold[col]);
				}
				col++;
			}
			row++;
		}

		var layout = new Springy.Layout.ForceDirected(graphForce, 200.00, 200.00, .1);


	// calculate bounding box of graph layout.. with ease-in
	var currentBB = layout.getBoundingBox();
	var targetBB = {bottomleft: new Springy.Vector(-2, -2), topright: new Springy.Vector(2, 2)};

	// auto adjusting bounding box
	Springy.requestAnimationFrame(function adjust() {
		targetBB = layout.getBoundingBox();
		// current gets 20% closer to target every iteration
		currentBB = {
			bottomleft: currentBB.bottomleft.add( targetBB.bottomleft.subtract(currentBB.bottomleft)
				.divide(10)),
			topright: currentBB.topright.add( targetBB.topright.subtract(currentBB.topright)
				.divide(10))
		};

		Springy.requestAnimationFrame(adjust);
	});


	// convert to/from screen coordinates
	var toScreen = function(p) {
		var size = currentBB.topright.subtract(currentBB.bottomleft);		
		var sx = p.subtract(currentBB.bottomleft).divide(size.x).x * window.innerWidth;
		var sy = p.subtract(currentBB.bottomleft).divide(size.y).y * window.innerHeight;
		
		//alert(" vector:" + p.x + " screen:" + sx);
		var s = new Springy.Vector(sx, sy);
		var g = new Springy.Vector(window.innerWidth, window.innerHeight);
		
		
		
		//alert(" vector again : " + s.multiply(size.x).divide(g.x).add(currentBB.bottomleft).x);
		return new Springy.Vector(sx, sy);
	};

	var renderer = new Springy.Renderer(layout,
		function drawNode(node, p) {
		
			var vectorPlace = toScreen(p);
			var rect=Graph.SelectedNodes["g" + (node.id + 1)].firstChild;
			 			 
			rect.setAttributeNS(null,"x",vectorPlace.x);
			rect.setAttributeNS(null,"y",vectorPlace.y);
			var text=rect.nextSibling;
			text.setAttributeNS(null,"x",vectorPlace.x+5);
			text.setAttributeNS(null,"y",vectorPlace.y+(+rect.getAttributeNS(null, "height"))-5);
			
			var node=Graph.Nodes["g" + (node.id + 1)];
			node.x=vectorPlace.x;
			node.y=vectorPlace.y;
			Graph.Edges.move(node); 
		}
	);

	renderer.start();
}
/*******************************************************************************/
/******************************************************************** dominate */	
	this.dominate=function(){

	Graph.Nodes.all();
		var Q, P, current, cnt, cont, q, p, j, k, l, m, o, r, skip;
		Q=new Object();
		P=new Object();
		for (q in Graph.SelectedNodes){
			Q[q] = cloneObject(Graph.Nodes[q]);
			cnt=0;
			for(p in Q[q].edges) {
				cnt++;
			}
			Q[q].degree=cnt;
			Q[q].dominated=new Object();
		}
		Graph.Nodes.none();
		for(;;){
			//if(isEmptyObject(Q)) return false;
			for(l in Q){
				if(isEmptyObject(Q[l].dominated)) cont=true;
			}
			if(!cont){
				for(o in P){
					skip==false;
					if(objectLength(P[o].dominated)>1){
						for(r in Graph.Nodes[o].edges){
							if(objectLength(P[r].dominated)==1) skip=true;
						}
						if(!skip) Graph.Nodes.deselect(o);
					}
				}
				return false;
			}
			for(j in Q){
				if(current){
					if(Q[j].degree>current.degree) current=Q[j];
					if(Q[j].degree==current.degree && !isEmptyObject(current.dominated)) current=Q[j];
				}
				else current=Q[j];
			}
			Graph.Nodes.select(current.id);
			//console.log(current.id);
			for(k in current.edges){
				if(Q[k]){
					Q[k].degree--;
					Q[k].dominated[current.id]=current.id;
					delete Q[k].edges[current.id];
					if(Q[k].degree==0) delete Q[k];
					//delete Q[k];
				}
			}
			P[current.id]=cloneObject(Q[current.id]);
			delete Q[current.id];
			current=undefined;
			cont=false;
		}
	}
/*******************************************************************************/
/************************************************************************ copy */	
	this.copy=function(){
		Graph.PasteBoard=new Object();
		Graph.copies=1;
		if(isEmptyObject(Graph.SelectedNodes)) Graph.Nodes.all();
		for(var i in Graph.SelectedNodes){
			Graph.PasteBoard[i] = cloneObject(Graph.Nodes[i]);
		}
	}
/*******************************************************************************/
/*********************************************************************** paste */
	this.paste=function(){
		Graph.Nodes.none();
		var pastedNodes = new Object();
		var oldnum = Graph.nodenum;
		for(var i in Graph.PasteBoard){
			pastedNodes['g'+Graph.nodenum] = cloneObject(Graph.PasteBoard[i])
			pastedNodes['g'+Graph.nodenum].id = 'g'+Graph.nodenum;
			pastedNodes['g'+Graph.nodenum].edgeKey = i;
			pastedNodes['g'+Graph.nodenum].x += 30*Graph.copies;
			pastedNodes['g'+Graph.nodenum].y += 30*Graph.copies;
			pastedNodes['g'+Graph.nodenum].label += "`";
			Graph.nodenum++;
		}
		//checkPlacement(pastedNodes);
		for(var i in pastedNodes){
			for(var j in pastedNodes[i].edges){
				for(var h in pastedNodes){
					if(pastedNodes[h].edgeKey==j){
						pastedNodes[i].edges[h]=h;
						
					}
				}
				if(j.substr(1) < oldnum) delete pastedNodes[i].edges[j];
			}
			Graph.Nodes[i] = pastedNodes[i];
			Graph.createNode(Graph.Nodes[i]);
		}
		for(var i in pastedNodes){
			var m=document.getElementById(i);
			for(var j in Graph.Nodes[i].edges){
				var n=document.getElementById(j);
				if(m.id<n.id) {
					if(!document.getElementById("L"+m.id+":"+n.id)) Graph.Nodes.addEdge(m,n);
				}
				else{
					if(!document.getElementById("L"+n.id+":"+m.id)) Graph.Nodes.addEdge(m,n);
				}
			}
			Graph.Nodes.select(i);
		}
		Graph.copies++;
		logAction("pasted sub graph");
	}
/*******************************************************************************/
/********************************************************************* extrude */
	this.extrude=function(){
		var extrudedNodes=new Object();
		var oldnum = Graph.nodenum;
		if(isEmptyObject(Graph.SelectedNodes)) Graph.Nodes.all();
		for(var i in Graph.SelectedNodes){
			extrudedNodes['g'+Graph.nodenum] = cloneObject(Graph.Nodes[i]);
			extrudedNodes['g'+Graph.nodenum] = cloneObject(Graph.Nodes[i])
			extrudedNodes['g'+Graph.nodenum].id = 'g'+Graph.nodenum;
			extrudedNodes['g'+Graph.nodenum].edgeKey = i;
			extrudedNodes['g'+Graph.nodenum].x -= 30;
			extrudedNodes['g'+Graph.nodenum].y += 30;
			extrudedNodes['g'+Graph.nodenum].label += "`";
			Graph.nodenum++;
		}
		//checkPlacement(Graph.extrudedNodes);
		Graph.Nodes.none();
		for(var i in extrudedNodes){
			for(var j in extrudedNodes[i].edges){
				for(var h in extrudedNodes){
					if(extrudedNodes[h].edgeKey==j){
						extrudedNodes[i].edges[h]=h;
					}
				}
				if(j.substr(1) < oldnum) delete extrudedNodes[i].edges[j];
			}
			Graph.Nodes[i] = extrudedNodes[i];
			Graph.createNode(Graph.Nodes[i]);
		}
		for(var i in extrudedNodes){
			var m=document.getElementById(i);
			for(var j in Graph.Nodes[i].edges){
				var n=document.getElementById(j);
				if(m.id<n.id) {
					if(!document.getElementById("L"+m.id+":"+n.id)) Graph.Nodes.addEdge(m,n);
				}
				else{
					if(!document.getElementById("L"+n.id+":"+m.id)) Graph.Nodes.addEdge(m,n);
				}
			}
			Graph.Nodes[i].edges[extrudedNodes[i].edgeKey] = extrudedNodes[i].edgeKey;
			Graph.Nodes.addEdge(m,document.getElementById(extrudedNodes[i].edgeKey));
			Graph.Nodes.select(i);
		}
		logAction("extruded sub graph");
	}
/*******************************************************************************/
/****************************************************************** complement */
	this.complement=function(){		
		if(isEmptyObject(Graph.SelectedNodes)) Graph.Nodes.all();
		for (var i in Graph.SelectedNodes){
			for (var j in Graph.SelectedNodes){
				if (j>i){
					var findlink=false;
					for (var l in Graph.Nodes[j].edges){
						if (Graph.Nodes[j].edges[l]==i) findlink=true;
					}
					if(!findlink) {
						Graph.Nodes.addEdge(Graph.SelectedNodes[i],Graph.SelectedNodes[j]);
						Graph.Edges.color(Graph.SelectedNodes[i],Graph.SelectedNodes[j],"blue");
					}
					else {
						Graph.Nodes.removeEdge(Graph.SelectedNodes[i],Graph.SelectedNodes[j]);
					}
				}
			}
		}
		logAction("complemented sub graph");
	}
	
	this.hasMoved=false;//<------------------------------why false?
	
/*******************************************************************************/
/************************************************************************ move */
	this.move=function(evt, offX, offY){
		for (var i in Graph.SelectedNodes){
		    var x2 = Graph.Canvas.Position.x(isTouchSupported ? evt.changedTouches[0].pageX : evt.clientX) - offX[i];
		    var y2 = Graph.Canvas.Position.y(isTouchSupported ? evt.changedTouches[0].pageY : evt.clientY) - offY[i];
			var rect=Graph.SelectedNodes[i].firstChild;
			rect.setAttributeNS(null,"x",x2);
			rect.setAttributeNS(null,"y",y2);
			var text=rect.nextSibling;
			text.setAttributeNS(null,"x",x2+5);
			text.setAttributeNS(null,"y",y2+(+rect.getAttributeNS(null, "height"))-5);
			var node=Graph.Nodes[i];
			node.x=x2;
			node.y=y2;
			Graph.Edges.move(node);
		}
		Graph.Nodes.hasMoved=true;
	}
/*******************************************************************************/
/********************************************************************* addEdge */
	this.addEdge = function(m,n){
		Graph.Nodes.createEdge(m,n);
	}
/*******************************************************************************/
/****************************************************************** createEdge */
	this.createEdge = function(m,n){
		var edge = document.createElementNS(xmlns,"path");
		x1=(+m.firstChild.getAttributeNS(null, "x"))+m.firstChild.getAttributeNS(null, "width")/2;
		x2=(+n.firstChild.getAttributeNS(null, "x"))+n.firstChild.getAttributeNS(null, "width")/2;
		y1=(+m.firstChild.getAttributeNS(null, "y"))+m.firstChild.getAttributeNS(null, "height")/2;
		y2=(+n.firstChild.getAttributeNS(null, "y"))+n.firstChild.getAttributeNS(null, "height")/2;
		edge.setAttributeNS(null,"d","M "+x1+" "+y1+" "+x2+" "+y2);
		edge.setAttributeNS(null,"stroke","black");
		edge.setAttributeNS(null,"stroke-width",2);
		if(m.id<n.id) edge.setAttributeNS(null,"id","L"+m.id+":"+n.id);
		else edge.setAttributeNS(null,"id","L"+n.id+":"+m.id);
		document.getElementById("Edges").appendChild(edge); //Graph.Canvas.Edges produced null error in ASV
		//Graph.Canvas.Nodes.appendChild(m);
		//Graph.Canvas.Nodes.appendChild(n);
		Graph.Nodes[m.id].edges[n.id]=n.id;
		Graph.Nodes[n.id].edges[m.id]=m.id;
	}
/*******************************************************************************/
/****************************************************************** removeEdge */
	this.removeEdge = function(m,n){
		if(m.id<n.id) var edge=document.getElementById("L"+m.id+":"+n.id);
		else var edge=document.getElementById("L"+n.id+":"+m.id);
		document.getElementById("Edges").removeChild(edge); //Graph.Canvas.Edges produced null error in ASV
		delete Graph.Nodes[m.id].edges[n.id];
		delete Graph.Nodes[n.id].edges[m.id];
	}
/*******************************************************************************/
/******************************************************************* findEdges */
	this.findEdges = function(evt){
		var node=evt.currentTarget;
		for(var i in Graph.SelectedNodes){
			if (!isEmptyObject(Graph.Nodes[node.id].edges)){
				var remove=false;
				for(var j in Graph.Nodes[node.id].edges){
					if(i===Graph.Nodes[node.id].edges[j]) remove=true;
				}
				if(remove) Graph.Nodes.removeEdge(Graph.SelectedNodes[i],node);
				else Graph.Nodes.addEdge(Graph.SelectedNodes[i],node);
			}
			else Graph.Nodes.addEdge(Graph.SelectedNodes[i],node);
		}
	}
/*******************************************************************************/
/*********************************************************************** scale */
	this.scale=function(){
		var Panel=document.getElementById('SPanel')
		document.getElementById('SPanelTitle').addEventListener("mousedown", dragPanelStart, false);
		var close=function(){
			Graph.Canvas.removeEventListener("mouseup", Graph.mup, false);
			document.getElementById('scaleInput').removeEventListener("mousedown", changeScaleValue, false);
			document.getElementById('scaleButton').removeEventListener("mousedown", scale, false);
			document.getElementById('scaleSlider').removeEventListener("mousedown", bumpScaleThumb, false);
			document.documentElement.addEventListener("mouseup", function(){Graph.Canvas.addEventListener("mouseup", Graph.mup, false); document.getElementById('SClose').removeEventListener("mousedown", close, false);}, false);
			document.getElementById('panels').appendChild(document.getElementById('SPanel'));
		}
		document.getElementById('SClose').addEventListener("mousedown", close, false);
		document.getElementById('scaleInput').addEventListener("mousedown", changeScaleValue, false);
		document.getElementById('scaleButton').addEventListener("mousedown", scale, false);
		document.getElementById('scaleSlider').addEventListener("mousedown", bumpScaleThumb, false);
		document.documentElement.appendChild(Panel);
	}
/*******************************************************************************/
/*************************************************************** selectionBBox */
	this.selectionBBox=function(){
		var minX = Infinity;
		for(var i in Graph.SelectedNodes){
			minX=Math.min(Graph.Nodes[i].x, minX);
		}
		var minY = Infinity;
		for(var i in Graph.SelectedNodes){
			minY=Math.min(Graph.Nodes[i].y, minY);
		}
		var width = 0;
		for(var i in Graph.SelectedNodes){
			width=Math.max(Graph.Nodes[i].x+Graph.Nodes[i].width-minX, width);
		}
		var height = 0;
		for(var i in Graph.SelectedNodes){
			height=Math.max(Graph.Nodes[i].y+Graph.Nodes[i].height-minY, height);
		}
		var BBox = {minX: minX, minY: minY, width: width, height: height};
		return BBox;
	}
/*******************************************************************************/
/********************************************************************** select */
	this.select=function(id){
		var group=document.getElementById(id);
		group.firstChild.setAttributeNS(null,"opacity",.5);
		group.firstChild.setAttributeNS(null,"stroke","black");
		group.firstChild.setAttributeNS(null,"stroke-width",3);
		group.firstChild.setAttributeNS(null,"fill","yellow");
		group.firstChild.nextSibling.setAttributeNS(null,"fill","red");
		Graph.SelectedNodes[id]=group;
		Graph.Canvas.Nodes.appendChild(group);
		var m = group;
		for(var j in Graph.Nodes[group.id].edges){
			var n=document.getElementById(j);
			if(Graph.SelectedNodes[j]){
				Graph.Edges.color(m,n,"blue");
			}
		}
		Graph.selectionCenter=new Object();
		Graph.selectionDist=new Object();
	}
/*******************************************************************************/
/******************************************************************** deselect */
	this.deselect=function(id){
		var group=document.getElementById(id);
		group.firstChild.setAttributeNS(null,"opacity",1);
		group.firstChild.setAttributeNS(null,"stroke","red");
		group.firstChild.setAttributeNS(null,"stroke-width",1);
		group.firstChild.setAttributeNS(null,"fill",Graph.Nodes[id].color);
		group.firstChild.nextSibling.setAttributeNS(null,"fill","black");
		Graph.Canvas.Nodes.appendChild(group);
		delete Graph.SelectedNodes[id]
		var m = group;
		for(var j in Graph.Nodes[group.id].edges){
			var n=document.getElementById(j);
			Graph.Edges.color(m,n,"black");
		}
		Graph.selectionCenter=new Object();
		Graph.selectionDist=new Object();
	}
/*******************************************************************************/
/************************************************************************* all */
	this.all=function(){
		for(var i in Graph.Nodes){
			if(typeof Graph.Nodes[i] === "object") Graph.Nodes.select(i);
		}
	}
/*******************************************************************************/
/************************************************************************ none */
	this.none=function(){ //select none
		for(var i in Graph.SelectedNodes){
			Graph.Nodes.deselect(i);
		}
		Graph.SelectedNodes=new Object();
		//logSel("modified selection");
	}
/*******************************************************************************/
/********************************************************************** invert */
	this.invert=function(){ //invert selection
		var oldSelection=new Object();
		for(var i in Graph.SelectedNodes){
			oldSelection[i]=i;
		}
		Graph.Nodes.none();
		for(var i in Graph.Nodes){
			if(typeof Graph.Nodes[i] === "object" && !oldSelection[i]) Graph.Nodes.select(i);
		}
	}
/*******************************************************************************/
/********************************************************************** expand */
	this.expand=function(){	//expand selection
		var oldSelection=new Object();
		for(var i in Graph.SelectedNodes){
			oldSelection[i]=i;
		}
		for(var i in Graph.SelectedNodes){
			if(oldSelection[i]){
				for(var j in Graph.Nodes[i].edges){
					Graph.Nodes.select(j);
				}
			}
		}
	}
/*******************************************************************************/
/************************************************************************** up */
	this.up=function(target, selected, shiftKey, edgesCreated){
		if(shiftKey || Graph.selecting){
			if(selected) Graph.Nodes.deselect(target.id);
			else Graph.Nodes.select(target.id);
		}
		else{
			if(!selected){
				if(Graph.Nodes.hasMoved){
					if(!Graph.transitionSelection) Graph.Nodes.deselect(target.id);
				}
				if(objectLength(Graph.SelectedNodes)>1 || edgesCreated){
					if(!Graph.transitionSelection && !Graph.retainSelection) Graph.Nodes.none();
					else if(!Graph.transitionSelection) Graph.Nodes.deselect(target.id);
				}
			}
		}
		if(Graph.Nodes.hasMoved==true){
			logAction("moved subgraph");
			Graph.selectionCenter=new Object();
			Graph.selectionDist=new Object();
			Graph.Nodes.hasMoved=false;
		}
		Graph.Canvas.addEventListener("mouseup", Graph.mup, false);
	}
/*******************************************************************************/
/************************************************************************ down */
	this.down=function(evt){
		if(evt.button===0 || evt.button===undefined){
			evt.preventDefault();
			evt.stopPropagation();
			Graph.Canvas.removeEventListener("mouseup", Graph.mup, false);
			var target=evt.currentTarget
			var selected;
			(Graph.SelectedNodes[target.id]) ? selected=true : selected=false;
			var shiftKey;
			(evt.shiftKey || Graph.selecting) ? shiftKey=true : shiftKey=false;
			var edgesCreated = false;
			if(!Graph.SelectedNodes[target.id] && !shiftKey && !isEmptyObject(Graph.SelectedNodes)){
				Graph.Nodes.findEdges(evt);
				logAction("modified edges");
				edgesCreated = true;
				if(!Graph.retainSelection){
					Graph.Nodes.none();
				}
			}
			if(!selected) Graph.Nodes.select(target.id);
			var offX= new Object();
			var offY= new Object();
			for (var i in Graph.SelectedNodes) { offX[i] = Graph.Canvas.Position.x(isTouchSupported ? evt.changedTouches[0].pageX : evt.clientX) - Graph.Nodes[i].x; offY[i] = Graph.Canvas.Position.y(isTouchSupported ? evt.changedTouches[0].pageY : evt.clientY) - Graph.Nodes[i].y; }
			var animateMove = function(evt){Graph.Nodes.move(evt, offX, offY);}
			var animateMoveEnd = function(evt){Graph.Canvas.removeEventListener("mousemove", animateMove, false); Graph.Canvas.removeEventListener("mouseup", animateMoveEnd, false); Graph.Nodes.up(target, selected, shiftKey, edgesCreated);}
			Graph.Canvas.addEventListener("mousemove", animateMove, false);
			Graph.Canvas.addEventListener("mouseup", animateMoveEnd, false);
		}
	}
/*******************************************************************************/
/************************************************************************ over */
	this.over=function(evt){
		var group=document.getElementById(evt.currentTarget.id);
		if(!Graph.SelectedNodes[group.id]){
			var rect=group.firstChild;
			rect.setAttributeNS(null,"opacity",.5);
			rect.setAttributeNS(null,"stroke","black");
			rect.nextSibling.setAttributeNS(null,"fill","red");
		}
		var m = group;
		for(var j in Graph.Nodes[group.id].edges){
			var n=document.getElementById(j);
			Graph.Edges.color(m,n,"red");
		}
	}
/*******************************************************************************/
/************************************************************************* out */
	this.out=function(evt){
		var group=document.getElementById(evt.currentTarget.id);
		if(!Graph.SelectedNodes[group.id]){
			var rect=group.firstChild;
			rect.setAttributeNS(null,"opacity",1);
			rect.setAttributeNS(null,"stroke","red");
			rect.nextSibling.setAttributeNS(null,"fill","black");
		}
		var m = group;
		for(var j in Graph.Nodes[group.id].edges){
			var n=document.getElementById(j);
			if(Graph.SelectedNodes[j] && Graph.SelectedNodes[m.id]){
				Graph.Edges.color(m,n,"blue");
			}
			else{
				Graph.Edges.color(m,n,"black");
			}
		}
	}

}



/**************************************************************************** rubberBand */
function rubberBand(evt, offX, offY) {
    band = document.getElementById('band');
    if (Graph.Canvas.Position.x(isTouchSupported ? evt.changedTouches[0].pageX : evt.clientX) > offX) {
        band.setAttributeNS(null, "width", Graph.Canvas.Position.x(isTouchSupported ? evt.changedTouches[0].pageX : evt.clientX) - offX);
    }
    else {
        band.setAttributeNS(null, "x", offX - (offX - Graph.Canvas.Position.x(isTouchSupported ? evt.changedTouches[0].pageX : evt.clientX)));
        band.setAttributeNS(null, "width", offX - Graph.Canvas.Position.x(isTouchSupported ? evt.changedTouches[0].pageX : evt.clientX));
    }
    if (Graph.Canvas.Position.y(isTouchSupported ? evt.changedTouches[0].pageY : evt.clientY) > offY) {
        band.setAttributeNS(null, "height", Graph.Canvas.Position.y(isTouchSupported ? evt.changedTouches[0].pageY : evt.clientY) - offY);
    }
    else {
        band.setAttributeNS(null, "y", offY - (offY - Graph.Canvas.Position.y(isTouchSupported ? evt.changedTouches[0].pageY : evt.clientY)));
        band.setAttributeNS(null, "height", offY - Graph.Canvas.Position.y(isTouchSupported ? evt.changedTouches[0].pageY : evt.clientY));
    }
    //Root.appendChild(band);
}

/********************************************************************************* Edges */
function Edges(){
	this.color = function(m,n,color){
		if(m.id<n.id) {
			var edge=document.getElementById("L"+m.id+":"+n.id);
			edge.setAttributeNS(null,"stroke",color);
		}
		else{
			var edge=document.getElementById("L"+n.id+":"+m.id);
			edge.setAttributeNS(null,"stroke",color);
		}
	}
	this.move = function(node){
		for(var i in node.edges){
			//console.log(typeof node.edges[i])
			var rect1=document.getElementById(node.id).firstChild;
			var rect2=document.getElementById(i).firstChild;
			x1=node.x+rect1.getAttributeNS(null, "width")/2;
			x2=(+rect2.getAttributeNS(null, "x"))+rect2.getAttributeNS(null, "width")/2;
			y1=node.y+rect1.getAttributeNS(null, "height")/2;
			y2=(+rect2.getAttributeNS(null, "y"))+rect2.getAttributeNS(null, "height")/2;
			if(node.id<i) edge = document.getElementById("L"+node.id+":"+i);
			else edge = document.getElementById("L"+i+":"+node.id);
			edge.setAttributeNS(null,"d","M "+x1+" "+y1+" "+x2+" "+y2);
			document.getElementById("Edges").appendChild(edge); //Graph.Canvas.Edges produced null error in ASV
		}
	}
}

/************************************************************************** getAdjMatrix
 * Creates a 2 dimensional array sized for an adjacency 
 * matrix that will contain all nodes & edges on the graph */ 
function getAdjMatrix(){
	if(isEmptyObject(Graph.SelectedNodes)) Graph.Nodes.all();
	var length = objectLength(Graph.SelectedNodes);
	var row = 0;
	var col;
	var adjMatrix = new Array(length);
	for(var i in Graph.SelectedNodes){
		col = 0;
		adjMatrix[row] = new Array(length);
		for(var j in Graph.SelectedNodes){
			(Graph.Nodes[i].edges[j]) ? adjMatrix[row][col]=1 : adjMatrix[row][col]=0;
			col++;
		}
		row++;
	}
	return adjMatrix;
}

/************************************************************************** getJSONformat added 7/2/2013
 * Converts Grapher’s graph into basic JSON format
 example 
  /*"nodes": [
    "1",
    "2",
    "3",
    "4"
  ],
  "edges": [
    ["1", "2"],
    ["1", "3"],
    ["1", "4"],
	["2", "4"]
  ]
};*/
function getJSONformat(){
	if(isEmptyObject(Graph.SelectedNodes)) Graph.Nodes.all();
	var length = objectLength(Graph.SelectedNodes);
	var row = 1;
	var col;
	var nodesJSON = "\"nodes\": [";
	var edgesJSON = "],  \"edges\": [";
	for(var i in Graph.SelectedNodes){
		col = 1;
		nodesJSON += "\""+row+"\",";
		for(var j in Graph.SelectedNodes){
			if(Graph.Nodes[i].edges[j]){
				edgesJSON+= "[\""+row+"\", \""+ col+"\"],";
			}
			col++;
		}
		row++;
	}
	nodesJSON =  nodesJSON.substring(0,(nodesJSON.length-1))//trim off the extra comma
	edgesJSON =  edgesJSON.substring(0,(edgesJSON.length-1))
	return (nodesJSON + edgesJSON + "]");
}


/****************************************************************************** hopNodes */
function hopNodes(){
	var startNode = parseInt(prompt("Please enter a starting node"));
	var endNode = parseInt(prompt("Please enter an end node"));
	output="";
	output+="The original full path from node " + startNode + " to node " + endNode + " is " + Paths[startNode][endNode].toString() + "\n";
	var i = startNode;
	while (i != endNode)
	{
		var pathHolder = Paths[i][endNode].toString().split(",");
		output+="The shortest path from " + i + " to " + endNode + " starts with the motion of " + i + " to " + pathHolder[0] + "\n";
		i=pathHolder[0];
	}
}

/****************************************************************************** subGraph */
function subGraph(){
	adjacencyMatrix();
	subGravity = new Array();
	Gravity = new Array();
	OrigSubGraph = new Array();
	numOfPermutations = 0;
	minicount = 0;
	subgraph=1;
	for(var j in Graph.SelectedNodes){
		Gravity[minicount] = document.getElementById("text"+Graph.Nodes[j].label).firstChild.nodeValue;
		OrigSubGraph[minicount] = document.getElementById("text"+Graph.Nodes[j].label).firstChild.nodeValue;
		//Gravity[minicount]=minicount+1;
		minicount++;
		}
	//Gravity.sort();
	startValue = 1;
	if (CheckGravity(1) != 0)
		{
			msg = "This permutation is flavored correctly.";
			message(msg);			
		}
	else
	{
			var user_response = prompt(GravityBadReason,"y")	;
			if (user_response == "Y" || user_response == "y")
			{
				/*adjacencyMatrix();
				for (i=0; i<sz; i++)
  					{
	 				   Gravity[i]=i+startValue;
					  }*/
				CorrectGravity = new Array();
				CorrectIndex = 0;
				p=0;
				results = 0;
				counter=0;
				Permute(sz);
				if (results == 1)
					{
						//resultsTest();
						if (numOfPermutations > 1)
						{
							msg = "There were " + numOfPermutations + " permutations were found for this structure.\nHere is one of them."
							minicount=0;
							for (var j in graph.SelectedNodes)
								{
									//accessnum = OrigSubGraph[minicount];
									document.getElementById("g" + OrigSubGraph[j]).firstChild.nextSibling.firstChild.nodeValue = CorrectGravity[0][j].toString();
									minicount++;
								}
							message(msg);
						}
						else {
							msg = "A proper permutation has been found for this graph. It is currently being displayed.";
							for (var j in graph.SelectedNodes)
								{
									document.getElementById("g"+OrigSubGraph[j]).firstChild.nextSibling.firstChild.nodeValue = (CorrectGravity[0][j]).toString();
								}
							message(msg);
							  }
					}
				else
				{
					msg = "A proper permutation for this graph does not appear to exist.";
					message(msg);
				}	
			}	
	}
} 


/**************************************************************************** NodeDetect 
  * This function goes into the graph work area and detects all of the 
  * nodes that are attached to one another and all loan nodes, then displays findings. 
  * Does need revision and clean up. */
function NodeDetect(){
 numOfLone = new Array();
 numOfStingers = new Array();
 counter=0;
 stingcount=0;
 lonecount=0;
 if(isEmptyObject(Graph.SelectedNodes)) Graph.Nodes.all();	
 for (var i in Graph.SelectedNodes)
 {
 	for (var j in Graph.Nodes[i].edges)
 	{
 	 counter++;
	 }
 	if (counter == 1)
 	{
 		numOfStingers[stingcount] = i;
 		stingcount++;	
 	}
 	else if (counter == 0)
 	{
 		numOfLone[lonecount] = i;
 		lonecount++;	
 	}	
 	counter=0;
 }	
 results="";
 results += "There were a total of " + numOfStingers.length + " stinger nodes detected.  These nodes were : ";
 for (var y=0; y<numOfStingers.length; y++)
 {
 	if (y != numOfStingers.length-1)
	{
  results += numOfStingers[y].substr(1).toString() + ", ";
	}
  else
	{
	results += numOfStingers[y].substr(1).toString() + ". ";
	}
 }
 results += "There were a total of " + numOfLone.length + " lone nodes detected.  These nodes were: ";
 for (var z=0; z<numOfLone.length; z++)
 {
  if (z != numOfLone.length-1)
	{
  results += numOfLone[z].substr(1).toString() + ", ";
	}
	else
	{
	results += numOfLone[z].substr(1).toString() + ".";
	}
 }
 alert(results);
}

/**************************************************************************** node_Edges 
Not used in program $$$ May need deleted. */
function node_Edges(){
	var counter=0;
	var int_count=0;
	Edges_Matrix = new Array();
	if(isEmptyObject(Graph.SelectedNodes)) Graph.Nodes.all();
	for (var i in Graph.SelectedNodes)
 	{
 		for (var j in Graph.Nodes[i].edges)
 		{
 			if (int_count==0)
 			{
 			Edges_Matrix[counter] = j + ",";
 			int_count++;
 	 		}
 	 		else
 	 		{
 	 		Edges_Matrix[counter] += j+",";
 	 		}
	 	}
 	int_count=0;
 	counter++;
 	}	
}


