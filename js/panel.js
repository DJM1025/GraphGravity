
// @@@@@@@@@@@@@@@    Side Panel 

function sidePainel()
{
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








//begin code for menus
MenuColors=new	Array("grey","red","blue","purple");
buttons=new Array();
buttons[0]=new	Array("file", "import3", "export2");
buttons[1]=new	Array("edit", ["undo","z"], ["redo","y"], ["copy","c"], ["paste","p"], ["extrude","x"], "scale", ["complement","i"],"force");
buttons[2]=new	Array("select", ["expand","e"], ["invert","f"], ["all","a"], ["none","d"], "shortestPath", "dominate"); 
// added clean for force direction
buttons[3]=new	Array("panels", "actions", "navigation", "adjacencyMatrix", "hopNodes", "NodeDetect", "runCurrentPermutation", "nextPermutation", "previousPermutation", "subGraph");
buttons[4]=new	Array("mode", "normal", ["label","\u21a9"], "realign"); //\u23CE\u21B5\u21B2\u2936\u21B5
buttons[5]=new Array("", "helpOn","helpFile","about");
//buttons[6]=new Array("testing", "adjacencyMatrix", "exhaustive", "permute", "checkgravity", "everything"); //newly added button array for testing features 

//help
function appendHelp(){
	hg = document.getElementById("helpFile");
	document.documentElement.appendChild(hg);
}

function helpFile(){
	var W=top.wopen("basicTutorialA.html");
}

var GlobalStatus=buttons[4][1];
var oldGlobalStatus=1;
var	bwidth=110;
var	barheight=20;
var Position=new Object();
function addMenu(B,toggle,colorScheme){
	var menu = document.createElementNS(xmlns,"g");
	menu.setAttributeNS(null,"id","menu"+B);
	//menu.addEventListener("mouseover",function(){showHide('hidden',B);},false);
	document.documentElement.appendChild(menu);
	var rect = document.createElementNS(xmlns,"rect");
	rect.setAttributeNS(null,"x",B*(bwidth+2)-1);
	rect.setAttributeNS(null,"y",0-1);
	rect.setAttributeNS(null,"width",bwidth+2);
	rect.setAttributeNS(null,"height",barheight+2);
	rect.setAttributeNS(null,"fill","none");
	rect.setAttributeNS(null,"stroke","none");
	rect.setAttributeNS(null,"stroke-width",0);
	rect.setAttributeNS(null,"id","rect"+B);
	menu.appendChild(rect);
	if (toggle==true) populateButtons(0,B,toggle,"red",buttons[B][1]);
	for (var i=0;i<buttons[B].length;i++){
		if(!colorScheme)populateButtons(i,B,toggle,MenuColors[i%MenuColors.length]);
		else populateButtons(i,B,toggle,colorScheme[i%colorScheme.length]);
	}
	document.documentElement.addEventListener("mousemove",updateCoords,false);
}

function populateButtons(i,B,toggle,color,toggleName){
	var group = document.createElementNS(xmlns,"g");
	var rect = document.createElementNS(xmlns,"rect");
	var text = document.createElementNS(xmlns,"text");
	if (i>0) {
		group.setAttributeNS(null,"visibility","hidden");
		if (toggle==true) {
			var action = function(){
				showHide('hidden',B);
				setStatus(i,buttons[B][0]);
			}
			group.addEventListener("mouseup",action,false);
		}
		else{
			if(buttons[B][0]=="file"){
				var action = function(evt){
					showHide('hidden',B);
					hilight(evt);
					document.getElementById('mode').setAttributeNS(null,"visibility","visible");
					if(buttons[B][i] instanceof Array) window[buttons[B][i][0]]();
					else window[buttons[B][i]]();
				}
				group.addEventListener("mouseup",action,false);
			}
			else if(buttons[B][0]=="edit" || buttons[B][0]=="select"){
				var action = function(evt){
					showHide('hidden',B);
					hilight(evt);
					if(buttons[B][i] instanceof Array) Graph.Nodes[buttons[B][i][0]]();
					else Graph.Nodes[buttons[B][i]]();
				}
				group.addEventListener("mouseup",action,false);
			}
			else{
				var action = function(evt){
					showHide('hidden',B);
					hilight(evt);
					if(buttons[B][i] instanceof Array) window[buttons[B][i][0]]();
					else window[buttons[B][i]]();
				}
				group.addEventListener("mouseup",action,false);
			}
		}
	}
	else{
		group.addEventListener("mousedown",function(evt){if(evt.button===0 || evt.button===undefined){evt.preventDefault(); showHide('visible',B);} if(buttons[B][0]=="file"){var mode=document.getElementById('mode'); if(mode.firstChild.getAttributeNS(null,"x")==0){mode.setAttributeNS(null,"visibility","hidden");}}},false);
	}
	group.addEventListener("mouseover",hilight,false);
	group.addEventListener("mouseout",hilight,false);
	var menu = document.getElementById('menu'+B);
	menu.appendChild(group);
	rect.setAttributeNS(null,"x",B*(bwidth+2));
	rect.setAttributeNS(null,"y",i*barheight);
	rect.setAttributeNS(null,"width",bwidth);
	rect.setAttributeNS(null,"height",barheight);
	rect.setAttributeNS(null,"fill",color);
	rect.setAttributeNS(null,"opacity",.2);
	group.appendChild(rect);
	text.setAttributeNS(null,"x",B*(bwidth+2)+10);
	text.setAttributeNS(null,"y",i*barheight+15);
	text.setAttributeNS(null,"fill","black");
	text.setAttributeNS(null,"font-size",16);
	text.setAttributeNS(null,"font-family","garamond");
	text.setAttributeNS(null,"pointer-events","none");
	group.appendChild(text);
	if (toggleName!=null){
		var rightEdge=window.innerWidth-(bwidth+2)
		if(rightEdge>buttons.length*(bwidth+2)-2){
			rect.setAttributeNS(null,"x",rightEdge);
			text.setAttributeNS(null,"x",rightEdge+15);
		}
		else{
			rect.setAttributeNS(null,"x",0);
			rect.setAttributeNS(null,"y",barheight+2);
			text.setAttributeNS(null,"x",15);
			text.setAttributeNS(null,"y",barheight+17);
		}
		tv=document.createTextNode(toggleName);
		group.setAttributeNS(null,"id","mode");
	}
	else {
		if(buttons[B][i] instanceof Array){
			var keytext = document.createElementNS(xmlns,"text");
			keytext.setAttributeNS(null,"x",B*(bwidth+2)+bwidth-10);
			keytext.setAttributeNS(null,"y",i*barheight+15);
			keytext.setAttributeNS(null,"fill","white");
			keytext.setAttributeNS(null,"font-size",16);
			keytext.setAttributeNS(null,"font-family","garamond");
			keytext.setAttributeNS(null,"pointer-events","none");
			var underline = document.createElementNS(xmlns,"line");
			underline.setAttributeNS(null,"x1",B*(bwidth+2)+bwidth-10);
			underline.setAttributeNS(null,"y1",i*barheight+17);
			underline.setAttributeNS(null,"x2",B*(bwidth+2)+bwidth-2);
			underline.setAttributeNS(null,"y2",i*barheight+17);
			underline.setAttributeNS(null,"opacity",.4);
			underline.setAttributeNS(null,"stroke","white");
			underline.setAttributeNS(null,"stroke-width",1);
			group.appendChild(underline);
			group.appendChild(keytext);
			ktv=document.createTextNode(buttons[B][i][1]);
			keytext.appendChild(ktv);
			var displayText=buttons[B][i][0].replace(/[A-Z]/g, ' $&').toLowerCase().replace(/\d/g, '');
			tv=document.createTextNode(displayText);
		}
		else{
			var displayText=buttons[B][i].replace(/[A-Z]/g, ' $&').toLowerCase().replace(/\d/g, '');
			tv=document.createTextNode(displayText);
		}
		group.setAttributeNS(null,"id","b"+B+":"+i);
	}
	text.appendChild(tv);
}

function setStatus(i,id){
	if(buttons[4][i] instanceof Array) var B=buttons[4][i][0];
	else var B=buttons[4][i];
	togDisplay=document.getElementById(id);
	togDisplay.firstChild.nextSibling.firstChild.nodeValue=B;
	GlobalStatus=B;
}

function hilight(evt){
	var o=evt.currentTarget;
	if(evt.type=="mouseover"){
		o.firstChild.setAttributeNS(null,"opacity",.5);
		o.firstChild.nextSibling.setAttributeNS(null,"fill","white");
	}
	else{
		o.firstChild.setAttributeNS(null,"opacity",.2);
		o.firstChild.nextSibling.setAttributeNS(null,"fill","black");
	}
}

function checkBounds(B, cnt){
	if(!cnt)cnt=0;
	if(((Position.x > B*(bwidth+2) && Position.x < B*(bwidth+2)+bwidth) && Position.y < barheight*buttons[B].length+2)&&cnt<30){
		cnt++;
		setTimeout('checkBounds('+B+','+cnt+')',500);
	}
	else{
		showHide("hidden",B);
		document.getElementById('mode').setAttributeNS(null,"visibility","visible");
	}
}

function showHide(s,B){
	for	(var i=1;i<buttons[B].length;i++){
		document.getElementById("b"+B+":"+i).setAttributeNS(null,"visibility",s);
	}
	var rect = document.getElementById('rect'+B);
	var checkMenuBounds;
	if(s=="visible"){
		document.documentElement.appendChild(document.getElementById("menu"+B));
		rect.setAttributeNS(null,"height",barheight*buttons[B].length+2);
		if (B != 5) {
			rect.setAttributeNS(null, "stroke", "grey");
			rect.setAttributeNS(null, "stroke-width", 2);
		}
		setTimeout('checkBounds('+B+')',500);
	}
	else{
		rect.setAttributeNS(null,"height",barheight+2);
		rect.setAttributeNS(null,"stroke","none");
		rect.setAttributeNS(null,"stroke-width",0);
	}
}

function updateCoords(evt){
	Position.x=evt.clientX;
	Position.y=evt.clientY;
}

//begin code for panels
action=0; //used to count the number of actions preformed
RetainedNodes=new Object();
RetainedSelection=new Object();
oldnodenum=new Object();
oldlabelnum=new Object();
oldDocWidth=new Object();
oldDocHeight=new Object();
oldViewBox=new Object();
function dragPanel(Panel,offsetX,offsetY){
	if(Position.x>1 && Position.y>1){
		var rectBg=Panel.firstChild;
		var rectTitle=rectBg.nextSibling.firstChild;
		var circle=rectBg.nextSibling.nextSibling.nextSibling.firstChild;
		rectBg.setAttributeNS(null,"x",Position.x-offsetX);
		rectBg.setAttributeNS(null,"y",Position.y-offsetY);
		rectTitle.setAttributeNS(null,"x",Position.x-offsetX+1);
		rectTitle.setAttributeNS(null,"y",Position.y-offsetY+1);
		var text=Panel.getElementsByTagName('text');
		var lines=Panel.getElementsByTagName('line');
		if(Panel.id=="APanel"){
			circle.setAttributeNS(null,"cx",Position.x-offsetX+138);
			circle.setAttributeNS(null,"cy",Position.y-offsetY+12);
			var spacer=28;
			var picker=document.getElementById('picker');
			picker.setAttributeNS(null,"x",Position.x-offsetX);
			picker.setAttributeNS(null,"y",Position.y-offsetY);
			picker.setAttributeNS(null,"height",0);
			for(var i=0; i<text.length; i++){
				if(i==0){
					text.item(i).setAttributeNS(null,"x",Position.x-offsetX+5);
					text.item(i).setAttributeNS(null,"y",Position.y-offsetY+18);
				}
				else if(i==1){
					text.item(i).setAttributeNS(null,"x",Position.x-offsetX+18);
					text.item(i).setAttributeNS(null,"y",Position.y-offsetY+18);
				}
				else{
					text.item(i).setAttributeNS(null,"x",Position.x-offsetX+10);
					text.item(i).setAttributeNS(null,"y",Position.y-offsetY+spacer);
					spacer+=16;
				}
			}
			spacer = 48;
			for(var i=0; i<lines.length; i++){
				if(i==0){
					lines.item(i).setAttributeNS(null,"x1",Position.x-offsetX+1);
					lines.item(i).setAttributeNS(null,"y1",Position.y-offsetY+24);
					lines.item(i).setAttributeNS(null,"x2",Position.x-offsetX+149);
					lines.item(i).setAttributeNS(null,"y2",Position.y-offsetY+24);
				}
				else{
					lines.item(i).setAttributeNS(null,"x1",Position.x-offsetX+1);
					lines.item(i).setAttributeNS(null,"y1",Position.y-offsetY+spacer);
					lines.item(i).setAttributeNS(null,"x2",Position.x-offsetX+149);
					lines.item(i).setAttributeNS(null,"y2",Position.y-offsetY+spacer);
					spacer+=16;
				}
			}
		}
		else if(Panel.id=="NPanel"){
			circle.setAttributeNS(null,"cx",Position.x-offsetX+138);
			circle.setAttributeNS(null,"cy",Position.y-offsetY+12);
			for(var i=0; i<text.length; i++){
				if(i==0){
					text.item(i).setAttributeNS(null,"x",Position.x-offsetX+5);
					text.item(i).setAttributeNS(null,"y",Position.y-offsetY+18);
				}
				else if(i==1){
					text.item(i).setAttributeNS(null,"x",Position.x-offsetX+24);
					text.item(i).setAttributeNS(null,"y",Position.y-offsetY+18);
				}
			}
			for(var i=0; i<lines.length; i++){
				if(i==0){
					lines.item(i).setAttributeNS(null,"x1",Position.x-offsetX+1);
					lines.item(i).setAttributeNS(null,"y1",Position.y-offsetY+24);
					lines.item(i).setAttributeNS(null,"x2",Position.x-offsetX+149);
					lines.item(i).setAttributeNS(null,"y2",Position.y-offsetY+24);
				}
				else if(i==1){
					lines.item(i).setAttributeNS(null,"x1",Position.x-offsetX+11);
					lines.item(i).setAttributeNS(null,"y1",Position.y-offsetY+136);
					lines.item(i).setAttributeNS(null,"x2",Position.x-offsetX+139);
					lines.item(i).setAttributeNS(null,"y2",Position.y-offsetY+136);
					lines.item(i).nextSibling.nextSibling.setAttributeNS(null,"x",Position.x-offsetX+10);
					lines.item(i).nextSibling.nextSibling.setAttributeNS(null,"y",Position.y-offsetY+130);
					lines.item(i).nextSibling.setAttributeNS(null,"y",Position.y-offsetY+130);
				}
				else if(i==2){
					lines.item(i).setAttributeNS(null,"x1",Position.x-offsetX+11);
					lines.item(i).setAttributeNS(null,"y1",Position.y-offsetY+170);
					lines.item(i).setAttributeNS(null,"x2",Position.x-offsetX+139);
					lines.item(i).setAttributeNS(null,"y2",Position.y-offsetY+170);
					lines.item(i).nextSibling.nextSibling.setAttributeNS(null,"x",Position.x-offsetX+10);
					lines.item(i).nextSibling.nextSibling.setAttributeNS(null,"y",Position.y-offsetY+164);
					lines.item(i).nextSibling.setAttributeNS(null,"y",Position.y-offsetY+164);
				}
			}
			var docSizeRect=document.getElementById('docSize').firstChild;
			docSizeRect.setAttributeNS(null,"x",Position.x-offsetX+10);
			docSizeRect.setAttributeNS(null,"y",Position.y-offsetY+34);
			var zoomText=document.getElementById('docSize').nextSibling;
			zoomText.setAttributeNS(null,"x",Position.x-offsetX+10);
			zoomText.setAttributeNS(null,"y",Position.y-offsetY+126);
			var displayDimensionsText=document.getElementById('enlargeCanvas').nextSibling;
			displayDimensionsText.setAttributeNS(null,"x",Position.x-offsetX+10);
			displayDimensionsText.setAttributeNS(null,"y",Position.y-offsetY+160);
			var displayWidth = document.getElementById('enlargeCanvas').nextSibling.nextSibling;
			displayWidth.setAttributeNS(null,"x",Position.x-offsetX+10);
			displayWidth.setAttributeNS(null,"y",Position.y-offsetY+192);
			var displayHeight = document.getElementById('enlargeCanvas').nextSibling.nextSibling.nextSibling;
			displayHeight.setAttributeNS(null,"x",Position.x-offsetX+80);
			displayHeight.setAttributeNS(null,"y",Position.y-offsetY+192);
			redrawNavPanel();
		}
		else if(Panel.id=="SPanel"){
			circle.setAttributeNS(null,"cx",Position.x-offsetX+288);
			circle.setAttributeNS(null,"cy",Position.y-offsetY+12);
			for(var i=0; i<text.length; i++){
				if(i==0){
					text.item(i).setAttributeNS(null,"x",Position.x-offsetX+5);
					text.item(i).setAttributeNS(null,"y",Position.y-offsetY+18);
				}
				else if(i==1){
					text.item(i).setAttributeNS(null,"x",Position.x-offsetX+16);
					text.item(i).setAttributeNS(null,"y",Position.y-offsetY+18);
				}
				else if(i==2){
					text.item(i).setAttributeNS(null,"x",Position.x-offsetX+10);
					text.item(i).setAttributeNS(null,"y",Position.y-offsetY+42);
				}
				else if(i==3){
					text.item(i).setAttributeNS(null,"x",Position.x-offsetX+88);
					text.item(i).setAttributeNS(null,"y",Position.y-offsetY+42);
					text.item(i).previousSibling.setAttributeNS(null,"x",Position.x-offsetX+82);
					text.item(i).previousSibling.setAttributeNS(null,"y",Position.y-offsetY+32);
				}
				else if(i==4){
					text.item(i).setAttributeNS(null,"x",Position.x-offsetX+136);
					text.item(i).setAttributeNS(null,"y",Position.y-offsetY+42);
					text.item(i).previousSibling.setAttributeNS(null,"x",Position.x-offsetX+130);
					text.item(i).previousSibling.setAttributeNS(null,"y",Position.y-offsetY+32);
				}
			}
			for(var i=0; i<lines.length; i++){
				if(i==0){
					lines.item(i).setAttributeNS(null,"x1",Position.x-offsetX+1);
					lines.item(i).setAttributeNS(null,"y1",Position.y-offsetY+24);
					lines.item(i).setAttributeNS(null,"x2",Position.x-offsetX+299);
					lines.item(i).setAttributeNS(null,"y2",Position.y-offsetY+24);
				}
				else if(i==1){
					lines.item(i).setAttributeNS(null,"x1",Position.x-offsetX+176);
					lines.item(i).setAttributeNS(null,"y1",Position.y-offsetY+37);
					lines.item(i).setAttributeNS(null,"x2",Position.x-offsetX+294);
					lines.item(i).setAttributeNS(null,"y2",Position.y-offsetY+37);
					lines.item(i).nextSibling.nextSibling.setAttributeNS(null,"x",Position.x-offsetX+175);
					lines.item(i).nextSibling.nextSibling.setAttributeNS(null,"y",Position.y-offsetY+31);
					lines.item(i).nextSibling.setAttributeNS(null,"x",Position.x-offsetX+235);
					lines.item(i).nextSibling.setAttributeNS(null,"y",Position.y-offsetY+31);
				}
			}
			//positionScaleSlider();
		}
		else if(Panel.id=="MsgPanel"){
			var rects=Panel.getElementsByTagName('rect');
			circle.setAttributeNS(null,"cx",Position.x-offsetX+288);
			circle.setAttributeNS(null,"cy",Position.y-offsetY+12);
			for(var i=0; i<text.length; i++){
				if(i==0){
					text.item(i).setAttributeNS(null,"x",Position.x-offsetX+5);
					text.item(i).setAttributeNS(null,"y",Position.y-offsetY+18);
				}
				else if(i==1){
					text.item(i).setAttributeNS(null,"x",Position.x-offsetX+24);
					text.item(i).setAttributeNS(null,"y",Position.y-offsetY+18);
				}
				else if(i==2){
					text.item(i).setAttributeNS(null,"x",Position.x-offsetX+10);
					text.item(i).setAttributeNS(null,"y",Position.y-offsetY+40);
				}
				else if(i==3){
					text.item(i).setAttributeNS(null,"x",Position.x-offsetX+82);
					text.item(i).setAttributeNS(null,"y",Position.y-offsetY+41);
				}
			}
			for(var i=0; i<lines.length; i++){
				if(i==0){
					lines.item(i).setAttributeNS(null,"x1",Position.x-offsetX+1);
					lines.item(i).setAttributeNS(null,"y1",Position.y-offsetY+24);
					lines.item(i).setAttributeNS(null,"x2",Position.x-offsetX+299);
					lines.item(i).setAttributeNS(null,"y2",Position.y-offsetY+24);
				}
			}
			for(var i=0; i<rects.length; i++){
				if(i==2){
					rects.item(i).setAttributeNS(null,"x",Position.x-offsetX+80);
					rects.item(i).setAttributeNS(null,"y",Position.y-offsetY+30);
				}
			}
		}
		else if(Panel.id=="AboutPanel"){
			circle.setAttributeNS(null,"cx",Position.x-offsetX+458);
			circle.setAttributeNS(null,"cy",Position.y-offsetY+12);
			for(var i=0; i<text.length; i++){
				if(i==0){
					text.item(i).setAttributeNS(null,"x",Position.x-offsetX+5);
					text.item(i).setAttributeNS(null,"y",Position.y-offsetY+18);
				}
				else if(i==1){
					text.item(i).setAttributeNS(null,"x",Position.x-offsetX+18);
					text.item(i).setAttributeNS(null,"y",Position.y-offsetY+18);
				}
				else if(i==2){
					var tspanItems=text.item(i).getElementsByTagName('tspan');
					var spacer=40;
					text.item(i).setAttributeNS(null,"x",Position.x-offsetX+10);
					text.item(i).setAttributeNS(null,"y",Position.y-offsetY+spacer);
					for(var j=0; j<tspanItems.length; j++){
						tspanItems.item(j).setAttributeNS(null,"x",Position.x-offsetX+10);
						tspanItems.item(j).setAttributeNS(null,"y",Position.y-offsetY+spacer);
						spacer+=15;
					}
				}
			}
			for(var i=0; i<lines.length; i++){
				if(i==0){
					lines.item(i).setAttributeNS(null,"x1",Position.x-offsetX+1);
					lines.item(i).setAttributeNS(null,"y1",Position.y-offsetY+24);
					lines.item(i).setAttributeNS(null,"x2",Position.x-offsetX+468);
					lines.item(i).setAttributeNS(null,"y2",Position.y-offsetY+24);
				}
			}
		}
		else if(Panel.id == "ExportPanel"){
			var rects=Panel.getElementsByTagName('rect');
			circle.setAttributeNS(null,"cx",Position.x-offsetX+153);
			circle.setAttributeNS(null,"cy",Position.y-offsetY+12);
			for(var i=0; i<text.length; i++){
				if(i==0){
					text.item(i).setAttributeNS(null,"x",Position.x-offsetX+5);
					text.item(i).setAttributeNS(null,"y",Position.y-offsetY+18);
				}
				else if(i==1){
					text.item(i).setAttributeNS(null,"x",Position.x-offsetX+19);
					text.item(i).setAttributeNS(null,"y",Position.y-offsetY+18);
				}
				else if(i==2){
					text.item(i).setAttributeNS(null,"x",Position.x-offsetX+10);
					text.item(i).setAttributeNS(null,"y",Position.y-offsetY+40);
				}
				else if(i==3){
					text.item(i).setAttributeNS(null,"x",Position.x-offsetX+15);
					text.item(i).setAttributeNS(null,"y",Position.y-offsetY+64);
				}
				else if(i==4){
					text.item(i).setAttributeNS(null,"x",Position.x-offsetX+40);
					text.item(i).setAttributeNS(null,"y",Position.y-offsetY+94);
				}
				else if(i==5){
					text.item(i).setAttributeNS(null,"x",Position.x-offsetX+30);
					text.item(i).setAttributeNS(null,"y",Position.y-offsetY+124);
				}
				else if(i==6){
					text.item(i).setAttributeNS(null,"x",Position.x-offsetX+35);
					text.item(i).setAttributeNS(null,"y",Position.y-offsetY+154);
				}
			}
			for(var i=0; i<lines.length; i++){
				if(i==0){
					lines.item(i).setAttributeNS(null,"x1",Position.x-offsetX+1);
					lines.item(i).setAttributeNS(null,"y1",Position.y-offsetY+24);
					lines.item(i).setAttributeNS(null,"x2",Position.x-offsetX+164);
					lines.item(i).setAttributeNS(null,"y2",Position.y-offsetY+24);
				}
			}
			for(var i=0; i<rects.length; i++){
				if(i==2){
					rects.item(i).setAttributeNS(null,"x",Position.x-offsetX+10);
					rects.item(i).setAttributeNS(null,"y",Position.y-offsetY+50);
				}
				else if(i==3){
					rects.item(i).setAttributeNS(null,"x",Position.x-offsetX+11);
					rects.item(i).setAttributeNS(null,"y",Position.y-offsetY+51);
				}
				else if(i==4){
					rects.item(i).setAttributeNS(null,"x",Position.x-offsetX+11);
					rects.item(i).setAttributeNS(null,"y",Position.y-offsetY+63);
				}
				else if(i==5){
					rects.item(i).setAttributeNS(null,"x",Position.x-offsetX+10);
					rects.item(i).setAttributeNS(null,"y",Position.y-offsetY+80);
				}
				else if(i==6){
					rects.item(i).setAttributeNS(null,"x",Position.x-offsetX+11);
					rects.item(i).setAttributeNS(null,"y",Position.y-offsetY+81);
				}
				else if(i==7){
					rects.item(i).setAttributeNS(null,"x",Position.x-offsetX+11);
					rects.item(i).setAttributeNS(null,"y",Position.y-offsetY+93);
				}
				else if(i==8){
					rects.item(i).setAttributeNS(null,"x",Position.x-offsetX+10);
					rects.item(i).setAttributeNS(null,"y",Position.y-offsetY+110);
				}
				else if(i==9){
					rects.item(i).setAttributeNS(null,"x",Position.x-offsetX+11);
					rects.item(i).setAttributeNS(null,"y",Position.y-offsetY+111);
				}
				else if(i==10){
					rects.item(i).setAttributeNS(null,"x",Position.x-offsetX+11);
					rects.item(i).setAttributeNS(null,"y",Position.y-offsetY+123);
				}
				else if(i==11){
					rects.item(i).setAttributeNS(null,"x",Position.x-offsetX+10);
					rects.item(i).setAttributeNS(null,"y",Position.y-offsetY+140);
				}
				else if(i==12){
					rects.item(i).setAttributeNS(null,"x",Position.x-offsetX+11);
					rects.item(i).setAttributeNS(null,"y",Position.y-offsetY+141);
				}
				else if(i==13){
					rects.item(i).setAttributeNS(null,"x",Position.x-offsetX+11);
					rects.item(i).setAttributeNS(null,"y",Position.y-offsetY+153);
				}
			}
		}
		else if(Panel.id == "ImportPanel"){
			var rects=Panel.getElementsByTagName('rect');
			circle.setAttributeNS(null,"cx",Position.x-offsetX+153);
			circle.setAttributeNS(null,"cy",Position.y-offsetY+12);
			for(var i=0; i<text.length; i++){
				if(i==0){
					text.item(i).setAttributeNS(null,"x",Position.x-offsetX+5);
					text.item(i).setAttributeNS(null,"y",Position.y-offsetY+18);
				}
				else if(i==1){
					text.item(i).setAttributeNS(null,"x",Position.x-offsetX+13);
					text.item(i).setAttributeNS(null,"y",Position.y-offsetY+18);
				}
				else if(i==2){
					text.item(i).setAttributeNS(null,"x",Position.x-offsetX+10);
					text.item(i).setAttributeNS(null,"y",Position.y-offsetY+40);
				}
				else if(i==3){
					text.item(i).setAttributeNS(null,"x",Position.x-offsetX+30);
					text.item(i).setAttributeNS(null,"y",Position.y-offsetY+64);
				}
				else if(i==4){
					text.item(i).setAttributeNS(null,"x",Position.x-offsetX+30);
					text.item(i).setAttributeNS(null,"y",Position.y-offsetY+94);
				}
				else if(i==5){
					text.item(i).setAttributeNS(null,"x",Position.x-offsetX+22);
					text.item(i).setAttributeNS(null,"y",Position.y-offsetY+124);
				}
				else if(i==6){
					text.item(i).setAttributeNS(null,"x",Position.x-offsetX+328);
					text.item(i).setAttributeNS(null,"y",Position.y-offsetY+42);
				}
				else if(i==7){
					text.item(i).setAttributeNS(null,"x",Position.x-offsetX+170);
					text.item(i).setAttributeNS(null,"y",Position.y-offsetY+45);
				}
				else if(i==8){
					text.item(i).setAttributeNS(null,"x",Position.x-offsetX+170);
					text.item(i).setAttributeNS(null,"y",Position.y-offsetY+61);
				}
				else if(i==9){
					text.item(i).setAttributeNS(null,"x",Position.x-offsetX+170);
					text.item(i).setAttributeNS(null,"y",Position.y-offsetY+77);
				}
				else if(i==10){
					text.item(i).setAttributeNS(null,"x",Position.x-offsetX+170);
					text.item(i).setAttributeNS(null,"y",Position.y-offsetY+93);
				}
				else if(i==11){
					text.item(i).setAttributeNS(null,"x",Position.x-offsetX+170);
					text.item(i).setAttributeNS(null,"y",Position.y-offsetY+109);
				}
			}
			for(var i=0; i<lines.length; i++){
				if(i==0){
					lines.item(i).setAttributeNS(null,"x1",Position.x-offsetX+1);
					lines.item(i).setAttributeNS(null,"y1",Position.y-offsetY+24);
					lines.item(i).setAttributeNS(null,"x2",Position.x-offsetX+164);
					lines.item(i).setAttributeNS(null,"y2",Position.y-offsetY+24);
				}
			}
			for(var i=0; i<rects.length; i++){
				if(i==2){
					rects.item(i).setAttributeNS(null,"x",Position.x-offsetX+10);
					rects.item(i).setAttributeNS(null,"y",Position.y-offsetY+50);
				}
				else if(i==3){
					rects.item(i).setAttributeNS(null,"x",Position.x-offsetX+11);
					rects.item(i).setAttributeNS(null,"y",Position.y-offsetY+51);
				}
				else if(i==4){
					rects.item(i).setAttributeNS(null,"x",Position.x-offsetX+11);
					rects.item(i).setAttributeNS(null,"y",Position.y-offsetY+63);
				}
				else if(i==5){
					rects.item(i).setAttributeNS(null,"x",Position.x-offsetX+10);
					rects.item(i).setAttributeNS(null,"y",Position.y-offsetY+80);
				}
				else if(i==6){
					rects.item(i).setAttributeNS(null,"x",Position.x-offsetX+11);
					rects.item(i).setAttributeNS(null,"y",Position.y-offsetY+81);
				}
				else if(i==7){
					rects.item(i).setAttributeNS(null,"x",Position.x-offsetX+11);
					rects.item(i).setAttributeNS(null,"y",Position.y-offsetY+93);
				}
				else if(i==8){
					rects.item(i).setAttributeNS(null,"x",Position.x-offsetX+10);
					rects.item(i).setAttributeNS(null,"y",Position.y-offsetY+110);
				}
				else if(i==9){
					rects.item(i).setAttributeNS(null,"x",Position.x-offsetX+11);
					rects.item(i).setAttributeNS(null,"y",Position.y-offsetY+111);
				}
				else if(i==10){
					rects.item(i).setAttributeNS(null,"x",Position.x-offsetX+11);
					rects.item(i).setAttributeNS(null,"y",Position.y-offsetY+123);
				}
				else if(i==11){
					circle.setAttributeNS(null,"cx",Position.x-offsetX+353);
					circle.setAttributeNS(null,"cy",Position.y-offsetY+12);
					lines.item(0).setAttributeNS(null,"x1",Position.x-offsetX+1);
					lines.item(0).setAttributeNS(null,"y1",Position.y-offsetY+24);
					lines.item(0).setAttributeNS(null,"x2",Position.x-offsetX+364);
					lines.item(0).setAttributeNS(null,"y2",Position.y-offsetY+24);
					rects.item(i).setAttributeNS(null,"x",Position.x-offsetX+167);
					rects.item(i).setAttributeNS(null,"y",Position.y-offsetY+30);
				}
				else if(i==12){
					rects.item(i).setAttributeNS(null,"x",Position.x-offsetX+312);
					rects.item(i).setAttributeNS(null,"y",Position.y-offsetY+30);
				}
				else if(i==13){
					rects.item(i).setAttributeNS(null,"x",Position.x-offsetX+313);
					rects.item(i).setAttributeNS(null,"y",Position.y-offsetY+31);
				}
				else if(i==14){
					rects.item(i).setAttributeNS(null,"x",Position.x-offsetX+313);
					rects.item(i).setAttributeNS(null,"y",Position.y-offsetY+40);
				}
				else if(i==15){
					rects.item(i).setAttributeNS(null,"x",Position.x-offsetX+169);
					rects.item(i).setAttributeNS(null,"y",Position.y-offsetY+35);
				}
				else if(i==16){
					rects.item(i).setAttributeNS(null,"x",Position.x-offsetX+169);
					rects.item(i).setAttributeNS(null,"y",Position.y-offsetY+51);
				}
				else if(i==17){
					rects.item(i).setAttributeNS(null,"x",Position.x-offsetX+169);
					rects.item(i).setAttributeNS(null,"y",Position.y-offsetY+67);
				}
				else if(i==18){
					rects.item(i).setAttributeNS(null,"x",Position.x-offsetX+169);
					rects.item(i).setAttributeNS(null,"y",Position.y-offsetY+83);
				}
				else if(i==19){
					rects.item(i).setAttributeNS(null,"x",Position.x-offsetX+169);
					rects.item(i).setAttributeNS(null,"y",Position.y-offsetY+99);
				}
			}
		}
	}
}

function changeActionText(evt){
	var Panel=document.getElementById('APanel')
	var actionGroup=document.getElementById('actionList');
	var actionText=actionGroup.getElementsByTagName('text');
	var panelLines=Panel.getElementsByTagName('line');
	var picker=document.getElementById('picker');
	for(var i=1; i<panelLines.length; i++){
		var top=panelLines.item(i).getAttributeNS(null,"y1")-16;
		var bottom=panelLines.item(i).getAttributeNS(null,"y1");
		if(evt.clientY>top && evt.clientY<bottom){
			//if(picker.getAttributeNS(null,"y")!=top){
				picker.setAttributeNS(null,"y",top);
				picker.setAttributeNS(null,"height",16);
			//}
		}
	}
}

function changeAction(evt){
	if(evt.button===0 || evt.button===undefined){
		var Panel=document.getElementById('APanel')
		var actionGroup=document.getElementById('actionList');
		var actionText=actionGroup.getElementsByTagName('text');
		var panelLines=Panel.getElementsByTagName('line');
		for(var i=1; i<panelLines.length; i++){
			if(evt.clientY>panelLines.item(i).getAttributeNS(null,"y1")-16 && evt.clientY<panelLines.item(i).getAttributeNS(null,"y1")){
				action=actionText.item(i).id.substr(1);
				if(actionGroup.lastChild.getAttributeNS(null,"opacity")==0.5){
					if (action>0) action--;
					else action=9;
					Graph.Nodes.redo();
				}
				else{
					if (action<9) action++;
					else action=0;
					Graph.Nodes.undo();
				}
			}
		}
	}
}

function zoomView(){
	var zoomSlider=document.getElementById('zoomSlider');
	var top=zoomSlider.firstChild.getAttributeNS(null, "x1");
	var bottom=zoomSlider.firstChild.getAttributeNS(null, "x2");
	var thumb=zoomSlider.firstChild.nextSibling.getAttributeNS(null, "x");
	var currentView=(bottom-thumb)/(bottom-top);
	var docW=(+document.getElementById('CanvasBg').getAttributeNS(null, "width"));
	var docH=(+document.getElementById('CanvasBg').getAttributeNS(null, "height"));
	var windowAR=window.innerWidth/window.innerHeight;
	var docAR=docW/docH;
	Graph.Canvas.viewbox.width=docW
	Graph.Canvas.viewbox.height=docW*(1/windowAR);
	//else{
	//	Graph.Canvas.viewbox.width=docH*windowAR;
	//	Graph.Canvas.viewbox.height=docH;
	//}
	var width=Math.floor(currentView*Graph.Canvas.viewbox.width);
	var height=Math.floor(currentView*Graph.Canvas.viewbox.height);
	Graph.Canvas.viewbox.width=width;
	Graph.Canvas.viewbox.height=height;
	if((Graph.Canvas.viewbox.minX+Graph.Canvas.viewbox.width)>docW){
		Graph.Canvas.viewbox.minX=docW-Graph.Canvas.viewbox.width;
	}
	if((Graph.Canvas.viewbox.minY+Graph.Canvas.viewbox.height)>docH){
		Graph.Canvas.viewbox.minY=docH-Graph.Canvas.viewbox.height;
	}
	if(Graph.Canvas.viewbox.minY<0){
		Graph.Canvas.viewbox.minY=0;
	}
	if(Graph.Canvas.viewbox.minY==0 && Graph.Canvas.viewbox.height>docH){
		document.getElementById('CanvasBg').setAttributeNS(null, "height", Graph.Canvas.viewbox.height);
	}
	Graph.Canvas.setAttributeNS(null, "width", window.innerWidth);
	Graph.Canvas.setAttributeNS(null, "height", window.innerHeight);
	Graph.Canvas.setAttributeNS(null, "viewBox", Graph.Canvas.viewbox.minX+" "+Graph.Canvas.viewbox.minY+" "+width+" "+height);
	redrawNavPanel();
}

function dragSliderThumb(evt){
	var zoomSlider=document.getElementById('zoomSlider');
	var bottom=zoomSlider.firstChild.getAttributeNS(null, "x1");
	var top=zoomSlider.firstChild.getAttributeNS(null, "x2");
	if((Position.x-2)>bottom){
		if((Position.x+6)<top){
			zoomSlider.firstChild.nextSibling.setAttributeNS(null, "x", Position.x-2);
		}
		else{
			zoomSlider.firstChild.nextSibling.setAttributeNS(null, "x", top-6);
		}
	}
	else{
		zoomSlider.firstChild.nextSibling.setAttributeNS(null, "x", bottom);
	}
	zoomView();
}

function bumpSliderThumb(evt){
	if(evt.button===0 || evt.button===undefined){
		var zoomSlider=document.getElementById('zoomSlider');
		var bottom=zoomSlider.firstChild.getAttributeNS(null, "x1");
		var top=zoomSlider.firstChild.getAttributeNS(null, "x2");
		if((Position.x-2)>bottom && (Position.x+4)<top){
			zoomSlider.firstChild.nextSibling.setAttributeNS(null, "x", Position.x-2);
			zoomView();
		}
		var restoreCanvasUp=function(evt){Graph.Canvas.addEventListener("mouseup", Graph.mup, false);}
		document.documentElement.addEventListener("mousemove", dragSliderThumb, false);
		Graph.Canvas.removeEventListener("mouseup", Graph.mup, false);
		document.documentElement.addEventListener("mouseup", function(evt){document.documentElement.removeEventListener("mousemove", dragSliderThumb, false); restoreCanvasUp(evt);}, false);
	}
}

function panView(){
	var docSize=document.getElementById('docSize');
	var docSizeX = (+docSize.firstChild.getAttributeNS(null, "x"));
	var docSizeY = (+docSize.firstChild.getAttributeNS(null, "y"));
	var docSizeW = (+docSize.firstChild.getAttributeNS(null, "width"));
	var docSizeH = (+docSize.firstChild.getAttributeNS(null, "height"));
	var viewSize=document.getElementById('viewSize');
	var viewSizeX=(+viewSize.firstChild.getAttributeNS(null, "x"));
	var viewSizeY=(+viewSize.firstChild.getAttributeNS(null, "y"));
	var diffX = viewSizeX-docSizeX;
	var diffY = viewSizeY-docSizeY;
	var docW=(+document.getElementById('CanvasBg').getAttributeNS(null, "width"));
	var docH=(+document.getElementById('CanvasBg').getAttributeNS(null, "height"));
	var scale=docW/docSizeW;
	var minX=diffX*scale;
	var minY=diffY*scale;
	Graph.Canvas.setAttributeNS(null, "viewBox", minX+" "+minY+" "+Graph.Canvas.viewbox.width+" "+Graph.Canvas.viewbox.height);
	Graph.Canvas.viewbox.minX=minX;
	Graph.Canvas.viewbox.minY=minY;
}

function dragViewableArea(evt){
	var docSize=document.getElementById('docSize');
	var docSizeTop = (+docSize.firstChild.getAttributeNS(null, "y"));
	var docSizeLeft = (+docSize.firstChild.getAttributeNS(null, "x"));
	var docSizeBottom = docSizeTop+(+docSize.firstChild.getAttributeNS(null, "height"));
	var docSizeRight = docSizeLeft+(+docSize.firstChild.getAttributeNS(null, "width"));
	var viewSize=document.getElementById('viewSize');
	var viewSizeW=(+viewSize.firstChild.getAttributeNS(null, "width"));
	var viewSizeH=(+viewSize.firstChild.getAttributeNS(null, "height"));
	if(Position.x-(viewSizeW/2)>docSizeLeft){
		if(Position.x+(viewSizeW/2)<docSizeRight){
			viewSize.firstChild.setAttributeNS(null, "x", Position.x-(viewSizeW/2));
		}
		else{
			viewSize.firstChild.setAttributeNS(null, "x", docSizeRight-viewSizeW);
		}
	}
	else{
		viewSize.firstChild.setAttributeNS(null, "x", docSizeLeft);
	}
	if(Position.y-(viewSizeH/2)>docSizeTop){
		if(Position.y+(viewSizeH/2)<docSizeBottom){
			viewSize.firstChild.setAttributeNS(null, "y", Position.y-(viewSizeH/2));
		}
		else{
			viewSize.firstChild.setAttributeNS(null, "y", docSizeBottom-viewSizeH);
		}
	}
	else{
		viewSize.firstChild.setAttributeNS(null, "y", docSizeTop);
	}
	panView();
}

function bumpViewableArea(evt){
	if(evt.button===0 || evt.button===undefined){
		var docSize=document.getElementById('docSize');
		var docSizeTop = (+docSize.firstChild.getAttributeNS(null, "y"));
		var docSizeLeft = (+docSize.firstChild.getAttributeNS(null, "x"));
		var docSizeBottom = docSizeTop+(+docSize.firstChild.getAttributeNS(null, "height"));
		var docSizeRight = docSizeLeft+(+docSize.firstChild.getAttributeNS(null, "width"));
		var viewSize=document.getElementById('viewSize');
		var viewSizeW=(+viewSize.firstChild.getAttributeNS(null, "width"));
		var viewSizeH=(+viewSize.firstChild.getAttributeNS(null, "height"));
		if(Position.x>docSizeLeft && Position.x<docSizeRight && Position.y>docSizeTop && Position.y<docSizeBottom){
			if(Position.x-(viewSizeW/2)>docSizeLeft){
				if(Position.x+(viewSizeW/2)<docSizeRight){
					viewSize.firstChild.setAttributeNS(null, "x", Position.x-(viewSizeW/2));
				}
				else{
					viewSize.firstChild.setAttributeNS(null, "x", docSizeRight-viewSizeW);
				}
			}
			else{
				viewSize.firstChild.setAttributeNS(null, "x", docSizeLeft);
			}
			if(Position.y-(viewSizeH/2)>docSizeTop){
				if(Position.y+(viewSizeH/2)<docSizeBottom){
			viewSize.firstChild.setAttributeNS(null, "y", Position.y-(viewSizeH/2));
				}
				else{
					viewSize.firstChild.setAttributeNS(null, "y", docSizeBottom-viewSizeH);
				}
			}
			else{
				viewSize.firstChild.setAttributeNS(null, "y", docSizeTop);
			}
			panView();
		}
		var restoreCanvasUp=function(evt){Graph.Canvas.addEventListener("mouseup", Graph.mup, false);}
		document.documentElement.addEventListener("mousemove", dragViewableArea, false);
		Graph.Canvas.removeEventListener("mouseup", Graph.mup, false);
		document.documentElement.addEventListener("mouseup", function(evt){document.documentElement.removeEventListener("mousemove", dragViewableArea, false); restoreCanvasUp(evt)}, false);
	}
}

function dragCanvasThumb(evt){
	var canvasSlider=document.getElementById('enlargeCanvas');
	var bottom=canvasSlider.firstChild.getAttributeNS(null, "x1");
	var top=canvasSlider.firstChild.getAttributeNS(null, "x2");
	if((Position.x-2)>bottom){
		if((Position.x+6)<top){
			canvasSlider.firstChild.nextSibling.setAttributeNS(null, "x", Position.x-2);
		}
		else{
			canvasSlider.firstChild.nextSibling.setAttributeNS(null, "x", top-6);
		}
	}
	else{
		canvasSlider.firstChild.nextSibling.setAttributeNS(null, "x", bottom);
	}
	enlargeCanvas();
}

function bumpCanvasThumb(evt){
	if(evt.button===0 || evt.button===undefined){
		var canvasSlider=document.getElementById('enlargeCanvas');
		var bottom=canvasSlider.firstChild.getAttributeNS(null, "x1");
		var top=canvasSlider.firstChild.getAttributeNS(null, "x2");
		if((Position.x-2)>bottom && (Position.x+4)<top){
			canvasSlider.firstChild.nextSibling.setAttributeNS(null, "x", Position.x-2);
			enlargeCanvas();
		}
		var restoreCanvasUp=function(evt){Graph.Canvas.addEventListener("mouseup", Graph.mup, false);}
		document.documentElement.addEventListener("mousemove", dragCanvasThumb, false);
		Graph.Canvas.removeEventListener("mouseup", Graph.mup, false);
		document.documentElement.addEventListener("mouseup", function(evt){document.documentElement.removeEventListener("mousemove", dragCanvasThumb, false); restoreCanvasUp(evt);}, false);
	}
}

var enlargeCanvas=function(){

	var canvasSlider=document.getElementById('enlargeCanvas');
	var top=canvasSlider.firstChild.getAttributeNS(null, "x1");
	var bottom=canvasSlider.firstChild.getAttributeNS(null, "x2");
	var thumb=canvasSlider.firstChild.nextSibling.getAttributeNS(null, "x");
	var currentPos=(bottom-thumb)/(bottom-top);
	var doc = document.getElementById('CanvasBg');
	var docW = (+doc.getAttributeNS(null, "width"));
	var docH = (+doc.getAttributeNS(null, "height"));
	var width=Math.floor(Math.abs(currentPos-1)*7500);
	var height=Math.floor(Math.abs(currentPos-1)*4500);
	if(Math.max((Graph.width()+15), Math.max(window.innerWidth,Graph.Canvas.viewbox.width))>width){
		width=Math.max((Graph.width()+15), Math.max(window.innerWidth,Graph.Canvas.viewbox.width));
	}
	if(Math.max((Graph.height()+15), Math.max(window.innerHeight,Graph.Canvas.viewbox.height))>height){
		height=Math.max((Graph.height()+15), Math.max(window.innerHeight,Graph.Canvas.viewbox.height));
	}
	if((Graph.Canvas.viewbox.minX+Graph.Canvas.viewbox.width)>width){
		Graph.Canvas.viewbox.minX=width-Graph.Canvas.viewbox.width;
	}
	if((Graph.Canvas.viewbox.minY+Graph.Canvas.viewbox.height)>height){
		Graph.Canvas.viewbox.minY=height-Graph.Canvas.viewbox.height;
	}
	doc.setAttributeNS(null, "width", width);
	doc.setAttributeNS(null, "height", height);
	Graph.Canvas.setAttributeNS(null, "viewBox", Graph.Canvas.viewbox.minX+" "+Graph.Canvas.viewbox.minY+" "+Graph.Canvas.viewbox.width+" "+Graph.Canvas.viewbox.height);
	var displayWidth = document.getElementById('enlargeCanvas').nextSibling.nextSibling;
	var displayHeight = document.getElementById('enlargeCanvas').nextSibling.nextSibling.nextSibling;
	displayWidth.firstChild.nodeValue = "width: "+width;
	displayHeight.firstChild.nodeValue = "height: "+height;
	redrawNavPanel();
}

function redrawNavPanel(){
	var doc = document.getElementById('CanvasBg');
	var docW = (+doc.getAttributeNS(null, "width"));
	var docH = (+doc.getAttributeNS(null, "height"));
	var docSize=document.getElementById('docSize');
	var docSizeX=(+docSize.firstChild.getAttributeNS(null, "x"));
	var docSizeY=(+docSize.firstChild.getAttributeNS(null, "y"));
	var docSizeW;
	var docSizeH;
	var viewSize=document.getElementById('viewSize').firstChild;
	var viewSizeX;
	var viewSizeY;
	var viewSizeW;
	var viewSizeH;
	docAR = docW/docH;
	if(docAR >= 1.625){
		docSizeW = 130;
		docSizeH = Math.floor(130*(1/docAR));
		viewSizeX = docSizeX+(Graph.Canvas.viewbox.minX*(docSizeW/docW));
		viewSizeY = docSizeY+(Graph.Canvas.viewbox.minY*(docSizeH/docH));
		viewSizeW = Graph.Canvas.viewbox.width*(docSizeW/docW);
		viewSizeH = Graph.Canvas.viewbox.height*(docSizeH/docH);
	}
	else{
		docSizeH = 80;
		docSizeW = Math.floor(docSizeH*docAR);
		viewSizeX = docSizeX+(Graph.Canvas.viewbox.minX*(docSizeW/docW));
		viewSizeY = docSizeY+(Graph.Canvas.viewbox.minY*(docSizeH/docH));
		viewSizeW = Graph.Canvas.viewbox.width*(docSizeW/docW);
		viewSizeH = Graph.Canvas.viewbox.height*(docSizeH/docH);
	}
	docSize.firstChild.setAttributeNS(null, "width", docSizeW);
	docSize.firstChild.setAttributeNS(null, "height", docSizeH);
	viewSize.setAttributeNS(null, "x", viewSizeX);
	viewSize.setAttributeNS(null, "y", viewSizeY);
	viewSize.setAttributeNS(null, "width", viewSizeW);
	viewSize.setAttributeNS(null, "height", viewSizeH);
	var displayWidth = document.getElementById('enlargeCanvas').nextSibling.nextSibling;
	var displayHeight = document.getElementById('enlargeCanvas').nextSibling.nextSibling.nextSibling;
	displayWidth.firstChild.nodeValue = "width: "+docW;
	displayHeight.firstChild.nodeValue = "height: "+docH;
	displayWidth.appendChild(displayWidth.firstChild);
	displayHeight.appendChild(displayHeight.firstChild);
	var zoomSlider=document.getElementById('zoomSlider');
	var top=(+zoomSlider.firstChild.getAttributeNS(null, "x1"));
	var bottom=(+zoomSlider.firstChild.getAttributeNS(null, "x2"));
	var zoomFactor=Math.abs((+viewSize.getAttributeNS(null, "width"))/(+docSize.firstChild.getAttributeNS(null, "width"))-1);
	var thumbPosition=((bottom-top)*zoomFactor)+top;
	zoomSlider.firstChild.nextSibling.setAttributeNS(null, "x", thumbPosition);
	var canvasSlider=document.getElementById('enlargeCanvas');
	top=(+canvasSlider.firstChild.getAttributeNS(null, "x1"));
	bottom=(+canvasSlider.firstChild.getAttributeNS(null, "x2"));
	var canvasSliderFactor=(+doc.getAttributeNS(null, "width"))/7500;
	thumbPosition=((bottom-top)*canvasSliderFactor)+top;
	canvasSlider.firstChild.nextSibling.setAttributeNS(null, "x", thumbPosition);

}

function navigation(){
	var Panel=document.getElementById('NPanel');
	document.getElementById('NPanelTitle').addEventListener("mousedown", dragPanelStart, false);
	redrawNavPanel()
	var close=function(){
		Graph.Canvas.removeEventListener("mouseup", Graph.mup, false);
		document.getElementById('zoomSlider').removeEventListener("mousedown", bumpSliderThumb, false);
		document.getElementById('enlargeCanvas').removeEventListener("mousedown", enlargeCanvas, false);
		document.documentElement.addEventListener("mouseup", function(){Graph.Canvas.addEventListener("mouseup", Graph.mup, false); document.getElementById('NClose').removeEventListener("mousedown", close, false);}, false);
		document.getElementById('panels').appendChild(document.getElementById('NPanel'));
	}
	document.getElementById('NClose').addEventListener("mousedown", close, false);
	document.getElementById('zoomSlider').addEventListener("mousedown", bumpSliderThumb, false);
	document.getElementById('docSize').addEventListener("mousedown", bumpViewableArea, false);
	document.getElementById('enlargeCanvas').addEventListener("mousedown", bumpCanvasThumb, false);
	document.documentElement.appendChild(Panel);
}

function actions(){
	var Panel=document.getElementById('APanel')
	document.getElementById('APanelTitle').addEventListener("mousedown", dragPanelStart, false);
	var close=function(){
		Graph.Canvas.removeEventListener("mouseup", Graph.mup, false);
		Panel.firstChild.removeEventListener("mousemove", changeActionText, false);
		document.documentElement.removeEventListener("mousemove", minimizePicker, false);
		document.getElementById('picker').removeEventListener("mousedown", changeAction, false);
		document.documentElement.addEventListener("mouseup", function(){Graph.Canvas.addEventListener("mouseup", Graph.mup, false); document.getElementById('AClose').removeEventListener("mousedown", close, false);}, false);
		document.getElementById('panels').appendChild(document.getElementById('APanel'));
	}
	var minimizePicker=function(){
		var minX=(+Panel.firstChild.getAttributeNS(null,"x"));
		var maxX=minX+(+Panel.firstChild.getAttributeNS(null,"width"));
		var minY=(+Panel.firstChild.getAttributeNS(null,"y"));
		var maxY=minY+(+Panel.firstChild.getAttributeNS(null,"height"));
		if(Position.x<minX || Position.x>maxX || Position.y<minY || Position.y>maxY){
			document.getElementById('picker').setAttributeNS(null,"height",0);
		}
	}
	document.getElementById('AClose').addEventListener("mousedown", close, false);
	Panel.firstChild.addEventListener("mousemove", changeActionText, false);
	document.getElementById('picker').addEventListener("mouseout", function(){document.getElementById('picker').setAttributeNS(null,"height",0);}, false);
	document.getElementById('picker').addEventListener("mousedown", changeAction, false);
	document.documentElement.addEventListener("mousemove", minimizePicker, false);
	document.documentElement.appendChild(Panel);
}

function backspaceScaleValue(evt){
	if (evt.keyCode==8){
		evt.preventDefault();
			var scaleInputText = document.getElementById('scaleInput').nextSibling.firstChild.nodeValue.toString();
			document.getElementById('scaleInput').nextSibling.firstChild.nodeValue=scaleInputText.substring(0,scaleInputText.length-1);
	}
}

function enterScaleValue(evt){
	evt.preventDefault();
	if (evt.keyCode) var k= evt.keyCode;
	else var k = evt.charCode;
	var qk=String.fromCharCode(k);
	if (k==8){
		evt.preventDefault();
		evt.stopPropagation();
		return false;
	}
	if (k==13){//Enter key (return key)
		Graph.Canvas.addEventListener("mouseup",Graph.mup,false);
		document.documentElement.removeEventListener("keydown",backspaceScaleValue,false);
		document.documentElement.removeEventListener("keypress",enterScaleValue,false);
		document.documentElement.addEventListener("keydown",Graph.kdown,false);
		document.documentElement.addEventListener("keyup",Graph.kup,false);
		document.documentElement.addEventListener("keydown",Graph.backspace,false);
		document.documentElement.addEventListener("keypress",Graph.kpress,false);
		document.documentElement.removeChild(document.documentElement.lastChild);
	}
	if(k>=48 && k<=57 || k==46){
		document.getElementById('scaleInput').nextSibling.firstChild.nodeValue+=qk;
	}
}

function changeScaleValue(evt){
	if(evt.button===0 || evt.button===undefined){
		evt.preventDefault();
		evt.stopPropagation();
		document.getElementById('scaleInput').nextSibling.firstChild.nodeValue="";
		Graph.Canvas.removeEventListener("mouseup",Graph.mup,false);
		document.documentElement.removeEventListener("keydown",Graph.kdown,false);
		document.documentElement.removeEventListener("keyup",Graph.kup,false);
		document.documentElement.removeEventListener("keydown",Graph.backspace,false);
		document.documentElement.removeEventListener("keypress",Graph.kpress,false);
		document.documentElement.addEventListener("keypress", enterScaleValue, false);
		document.documentElement.addEventListener("keydown", backspaceScaleValue,false);
		var blur=document.createElementNS(xmlns, "rect");
		blur.setAttributeNS(null, "x", 0);
		blur.setAttributeNS(null, "y", 0);
		blur.setAttributeNS(null, "width", window.innerWidth);
		blur.setAttributeNS(null, "height", window.innerHeight);
		blur.setAttributeNS(null, "fill", "#fff");
		blur.setAttributeNS(null, "opacity", 0);
		document.documentElement.appendChild(blur);
		var endScaleInput = function(evt){var BBox=document.getElementById('scaleButton').getBBox(); if(Position.x>BBox.x && Position.x<(BBox.x+BBox.width) && Position.y>BBox.y && Position.y<(BBox.y+BBox.height)){scale(evt);} Graph.Canvas.addEventListener("mouseup",Graph.mup,false); document.documentElement.removeEventListener("mouseup",endScaleInput,false);}
		blur.addEventListener("mousedown", function(evt){evt.preventDefault(); evt.stopPropagation(); document.documentElement.removeEventListener("keypress", enterScaleValue, false); document.documentElement.removeEventListener("keydown", backspaceScaleValue,false); document.documentElement.addEventListener("keydown",Graph.kdown,false); document.documentElement.addEventListener("keyup",Graph.kup,false); document.documentElement.addEventListener("keydown",Graph.backspace,false); document.documentElement.addEventListener("keypress",Graph.kpress,false); document.documentElement.removeChild(evt.currentTarget); document.documentElement.addEventListener("mouseup",endScaleInput,false);}, false);
	}
}

function dragScaleThumb(evt){
	var scaleSlider=document.getElementById('scaleSlider');
	var top=scaleSlider.firstChild.getAttributeNS(null, "x1");
	var bottom=scaleSlider.firstChild.getAttributeNS(null, "x2");
	var thumb=scaleSlider.firstChild.nextSibling;
	if((Position.x-2)>top){
		if((Position.x+6)<bottom){
			thumb.setAttributeNS(null, "x", Position.x-2);
		}
		else{
			thumb.setAttributeNS(null, "x", bottom-6);
		}
	}
	else{
		thumb.setAttributeNS(null, "x", top);
	}
	scale();
}

function bumpScaleThumb(evt){
	if(evt.button===0 || evt.button===undefined){
		var scaleSlider=document.getElementById('scaleSlider');
		var top=(+scaleSlider.firstChild.getAttributeNS(null, "x1"));
		var bottom=(+scaleSlider.firstChild.getAttributeNS(null, "x2"));
		var thumb=scaleSlider.firstChild.nextSibling;
		if((Position.x-2)>top){
			if((Position.x+6)<bottom){
				thumb.setAttributeNS(null, "x", Position.x-2);
			}
			else{
				thumb.setAttributeNS(null, "x", bottom-6);
			}
		}
		else{
			thumb.setAttributeNS(null, "x", top);
		}
		scale();
		var endScaleSlider=function(evt){Graph.selectionDist=new Object(); thumb.setAttributeNS(null, "x", top+59); document.documentElement.removeEventListener("mousemove", dragScaleThumb, false); logAction("scaled subgraph"); document.documentElement.removeEventListener("mouseup", endScaleSlider, false); Graph.Canvas.addEventListener("mouseup", Graph.mup, false);}
		document.documentElement.addEventListener("mousemove", dragScaleThumb, false);
		Graph.Canvas.removeEventListener("mouseup", Graph.mup, false);
		document.documentElement.addEventListener("mouseup", endScaleSlider, false);
	}
}

function scale(evt){
	var BBox=Graph.Nodes.selectionBBox();
	var factor
	if(evt){
		factor=(+document.getElementById('scaleInput').nextSibling.firstChild.nodeValue);
	}
	else{
		var scaleSlider=document.getElementById('scaleSlider');
		var bottom=scaleSlider.firstChild.getAttributeNS(null, "x1");
		var top=scaleSlider.firstChild.getAttributeNS(null, "x2");
		var thumb=scaleSlider.firstChild.nextSibling.getAttributeNS(null, "x");
		var currentPos=((bottom*2)-(thumb*2))/(bottom-top);
		factor=currentPos;
	}
	if(isNaN(factor)) return false;
	if(isEmptyObject(Graph.selectionCenter)){
		Graph.selectionCenter.x=(BBox.width*0.5)+BBox.minX;
		Graph.selectionCenter.y=(BBox.height*0.5)+BBox.minY;
	}
	if(isEmptyObject(Graph.selectionDist)){
		for(var i in Graph.SelectedNodes){
			Graph.selectionDist[i]=new Object();
			Graph.selectionDist[i].x=(Graph.Nodes[i].x+(Graph.Nodes[i].width*0.5))-Graph.selectionCenter.x;
			Graph.selectionDist[i].y=(Graph.Nodes[i].y+(Graph.Nodes[i].height*0.5))-Graph.selectionCenter.y;
			Graph.Nodes[i].x =Graph.selectionCenter.x+(Graph.selectionDist[i].x*factor)-(Graph.Nodes[i].width*0.5)
			Graph.Nodes[i].y =Graph.selectionCenter.y+(Graph.selectionDist[i].y*factor)-(Graph.Nodes[i].height*0.5)
			var group=Graph.SelectedNodes[i]
			var rect = group.firstChild;
			rect.setAttributeNS(null,"x",Graph.Nodes[i].x);
			rect.setAttributeNS(null,"y",Graph.Nodes[i].y);
			var text=rect.nextSibling;
			text.setAttributeNS(null,"x",Graph.Nodes[i].x+5);
			text.setAttributeNS(null,"y",Graph.Nodes[i].y+Graph.Nodes[i].height-5);
			Graph.Edges.move(Graph.Nodes[i]);
		}
	}
	else{
		for(var i in Graph.SelectedNodes){
			Graph.Nodes[i].x =Graph.selectionCenter.x+(Graph.selectionDist[i].x*factor)-(Graph.Nodes[i].width*0.5)
			Graph.Nodes[i].y =Graph.selectionCenter.y+(Graph.selectionDist[i].y*factor)-(Graph.Nodes[i].height*0.5)
			var group=Graph.SelectedNodes[i]
			var rect = group.firstChild;
			rect.setAttributeNS(null,"x",Graph.Nodes[i].x);
			rect.setAttributeNS(null,"y",Graph.Nodes[i].y);
			var text=rect.nextSibling;
			text.setAttributeNS(null,"x",Graph.Nodes[i].x+5);
			text.setAttributeNS(null,"y",Graph.Nodes[i].y+Graph.Nodes[i].height-5);
			Graph.Edges.move(Graph.Nodes[i]);
		}
	}
	if(evt){
		Graph.selectionDist=new Object();
		logAction("scaled subgraph");
	}
}

function message(msg){
	var Panel=document.getElementById('MsgPanel');
	document.getElementById('MsgPanelTitle').addEventListener("mousedown", dragPanelStart, false);
	if(msg){
		if(msg.match(/\D/g)){
			try{
				Panel.removeChild(document.getElementById('dlText'));
			}
			catch(err){
				//console.log(err);
			}
			try{
				Panel.removeChild(document.getElementById('dlRect'));
			}
			catch(err){
				//console.log(err);
			}
			document.getElementById('MsgText').firstChild.firstChild.nodeValue=msg;
		}
		else{
			document.getElementById('MsgText').firstChild.firstChild.nodeValue=' ';
			var dlText = document.createElementNS(xmlns,'text');
			dlText.setAttributeNS(null,'id', 'dlText');
			dlText.setAttributeNS(null,'x', parseInt(Panel.firstChild.getAttributeNS(null, 'x'))+82);
			dlText.setAttributeNS(null,'y', parseInt(Panel.firstChild.getAttributeNS(null, 'y'))+41);
			dlText.setAttributeNS(null,"font-size","12");
			dlText.setAttributeNS(null,"font-family","garamond");
			dlText.setAttributeNS(null,"pointer-events","none");
			var dlTextNode=document.createTextNode("Click Here to Download");
			dlText.appendChild(dlTextNode);
			var dlRect=document.createElementNS(xmlns, 'rect');
			dlRect.setAttributeNS(null, 'id', 'dlRect');
			dlRect.setAttributeNS(null, 'x', parseInt(Panel.firstChild.getAttributeNS(null,'x'))+80);
			dlRect.setAttributeNS(null, 'y', parseInt(Panel.firstChild.getAttributeNS(null,'y'))+30);
			dlRect.setAttributeNS(null, 'rx', 5);
			dlRect.setAttributeNS(null, 'ry', 5);
			dlRect.setAttributeNS(null, 'width', 400); //here to change width
			dlRect.setAttributeNS(null, 'height', 14);
			dlRect.setAttributeNS(null, 'fill', 'white');
			dlRect.setAttributeNS(null, 'stroke', 'black');
			dlRect.setAttributeNS(null, 'stroke-width', '1');
			dlRect.addEventListener('mousedown', function(evt){top.wopen('graph'+msg+'.php')}, false);
			Panel.appendChild(dlRect);
			Panel.appendChild(dlText);
		}
	}
	var close=function(){
		Graph.Canvas.removeEventListener("mouseup", Graph.mup, false);
		document.documentElement.addEventListener("mouseup", function(){Graph.Canvas.addEventListener("mouseup", Graph.mup, false); document.getElementById('MsgClose').removeEventListener("mousedown", close, false);}, false);
		document.getElementById('panels').appendChild(document.getElementById('MsgPanel'));
	}
	document.getElementById('MsgClose').addEventListener("mousedown", close, false);
	document.documentElement.appendChild(Panel);
}

function about(){
	var Panel=document.getElementById('AboutPanel');
	document.getElementById('AboutPanelTitle').addEventListener("mousedown", dragPanelStart, false);
	var close=function(){
		Graph.Canvas.removeEventListener("mouseup", Graph.mup, false);
		document.documentElement.addEventListener("mouseup", function(){Graph.Canvas.addEventListener("mouseup", Graph.mup, false); document.getElementById('AboutClose').removeEventListener("mousedown", close, false);}, false);
		document.getElementById('panels').appendChild(document.getElementById('AboutPanel'));
	}
	document.getElementById('AboutClose').addEventListener("mousedown", close, false);
	document.documentElement.appendChild(Panel);
}

function dragPanelStart(evt){
	if(evt.button===0 || evt.button===undefined){
		evt.preventDefault();
		var Panel=evt.currentTarget.parentNode;
		var offsetX=evt.clientX-(+Panel.firstChild.getAttributeNS(null,"x"));
		var offsetY=evt.clientY-(+Panel.firstChild.getAttributeNS(null,"y"));
		var drag=function(evt){dragPanel(Panel,offsetX,offsetY);}
		document.documentElement.addEventListener("mousemove",drag,false);
		Graph.Canvas.removeEventListener("mouseup", Graph.mup, false);
		var endPanelDrag=function(evt){document.documentElement.removeEventListener("mousemove",drag,false); Graph.Canvas.addEventListener("mouseup", Graph.mup, false); document.documentElement.removeEventListener("mouseup",endPanelDrag,false);}
		document.documentElement.addEventListener("mouseup",endPanelDrag,false);
		document.documentElement.appendChild(Panel);
	}
}

function logAction(log){
	reserve();
	var actionGroup=document.getElementById('actionList');
	var actionText=actionGroup.getElementsByTagName('text');
	var panelLines=actionGroup.getElementsByTagName('line');
	for(var i=0; i<actionText.length; i++){
		if(actionText.item(i).getAttributeNS(null,"opacity")==0.5){
			actionGroup.removeChild(actionText.item(i));
			actionGroup.removeChild(panelLines.item(i-1));
			i--;
		}	
	}
	if(actionText.length>10){
		actionGroup.removeChild(actionText.item(1));
		actionGroup.removeChild(panelLines.item(0));
		for(var i=1; i<actionText.length; i++){
			var oldY = (+actionText.item(i).getAttributeNS(null,"y"));
			actionText.item(i).setAttributeNS(null,"y",oldY-16);
			var oldY = (+panelLines.item(i-1).getAttributeNS(null,"y1"));
			panelLines.item(i-1).setAttributeNS(null,"y1",oldY-16);
			panelLines.item(i-1).setAttributeNS(null,"y2",oldY-16);
		}
	}
	var x=(+actionGroup.lastChild.getAttributeNS(null,"x"))
	var y=(+actionGroup.lastChild.getAttributeNS(null,"y"))
	var line=document.createElementNS(xmlns,"line");
	line.setAttributeNS(null,"x1",x-9);
	line.setAttributeNS(null,"y1",y+20);
	line.setAttributeNS(null,"x2",x+139);
	line.setAttributeNS(null,"y2",y+20);
	line.setAttributeNS(null,"opacity",0.1);
	line.setAttributeNS(null,"stroke","blue");
	line.setAttributeNS(null,"stroke-width",1);
	actionGroup.appendChild(line);
	var text=document.createElementNS(xmlns,"text");
	text.setAttributeNS(null,"id",'a'+action);
	text.setAttributeNS(null,"x",x);
	text.setAttributeNS(null,"y",y+16);
	text.setAttributeNS(null,"font-size","14");
	text.setAttributeNS(null,"opacity",1);
	text.setAttributeNS(null,"font-family","garamond");
	text.setAttributeNS(null,"pointer-events","none");
	actionGroup.appendChild(text);
	var textType3 = document.createTextNode(log);
	text.appendChild(textType3);
}

function reserve(){
	action++;
	if(action>9) action=0;
	RetainedNodes[action] = new Object();
	RetainedNodes[action] = cloneObject(Graph.Nodes);
	RetainedSelection[action]=new Object();
	for(var i in Graph.SelectedNodes){
		RetainedSelection[action][i] = i;
	}
	oldnodenum[action]=Graph.nodenum;
	oldlabelnum[action]=Graph.labelnum;
	oldDocWidth[action]=document.getElementById("CanvasBg").getAttributeNS(null,"width");
	oldDocHeight[action]=document.getElementById("CanvasBg").getAttributeNS(null, "height");
	oldViewBox[action]=Graph.Canvas.getAttributeNS(null, "viewBox");
}

//Begin Help

helpFlag = false;
 
function helpPlace(){
	var hb = document.getElementById("helpbox")
	var hh = hb.getAttribute('height')
	var hw = parseInt(hb.getAttribute('width'))
	hb.setAttribute('y', window.innerHeight - hh)
	hb.setAttribute('x', ((window.innerWidth*.5)-(hw/2)))
	
	var ht = document.getElementById("helptext")
	var hby = hb.getAttribute('y')
	ht.setAttribute('y', parseInt(hby) + 20)
	ht.setAttribute('x', ((window.innerWidth*.5)-((hw/2)-5)))
	
}

function helpOff(){
	for (var i in Graph.Nodes) {
		if (typeof Graph.Nodes[i] == "object") {
			nods = document.getElementById(Graph.Nodes[i].id);
			//alert(document.getElementById(Graph.Nodes[i].id));
			nods.removeEventListener("mouseover", help, false);
		}
	}
	document.getElementById('back').appendChild(document.getElementById('guf'));
	helpFlag = false;
}

function helpOn(){
	helpPlace();
	if (helpFlag == false) {
		var items = new Array("menu0", "menu1", "menu2", "menu3", "menu4");
		for (var i in Graph.Nodes) {
			if (typeof Graph.Nodes[i] == "object") {
				var nods = document.getElementById(Graph.Nodes[i].id);
				nods.addEventListener("mouseover", help, false);
			}
		}
		for (var i = 0; i < items.length; i++) {
			var c = document.getElementById(items[i]);
			c.addEventListener("mouseover", help, false);
		}
		Graph.Canvas.addEventListener("mouseover", help, false);
		var g = document.getElementById("guf");
		document.documentElement.appendChild(g);
		helpFlag = true;
	}
	else {
		helpOff()
	}
}

function help(evt){
	evt.stopPropagation();
	n = evt.currentTarget;
	if (helpFlag == true) {
		g = document.getElementById("helptext")
		if (n.id.match(/[g]\d/)) {
			g.firstChild.replaceData(0, g.firstChild.data.length, 'This is a node: Click to select, Click and drag to move it.')
			for (var i in Graph.SelectedNodes) {
				if (!Graph.SelectedNodes[n.id] && !isEmptyObject(Graph.SelectedNodes)) {
					g.firstChild.replaceData(0, g.firstChild.data.length, 'Click to connect, r+click to reserve current selection after click, t+ click to transition selection')
				}
				if (i == n.id) {
					g.firstChild.replaceData(0, g.firstChild.data.length, 'This node is selected: Click another node to connect, ShiftClick to select multiple nodes, Click and drag to move it')
				}
			}
		}
		if (n.nodeName == "svg") {
			g.firstChild.replaceData(0, g.firstChild.data.length, 'This is The Canvas: Click to add a new node, Shift Click and Drag to select multiple nodes.')
		}
		else {
			if (n.id == 'helpFile') {
				g.firstChild.replaceData(0, g.firstChild.data.length, 'This is The Help File')
			}
		}
	}
	else {
		return;
	}
}

//BEGIN IMPORT EXPORT
chosenFile=undefined;
function export2(){
	var Panel=document.getElementById('ExportPanel');
	document.getElementById('ExportPanelTitle').addEventListener("mousedown", dragPanelStart, false);
	var close=function(){
		Graph.Canvas.removeEventListener("mouseup", Graph.mup, false);
		document.documentElement.addEventListener("mouseup", function(){Graph.Canvas.addEventListener("mouseup", Graph.mup, false); document.getElementById('ExportClose').removeEventListener("mousedown", close, false);}, false);
		document.getElementById('exportClipboardButton').removeEventListener("mousedown", exp1, false);
		document.getElementById('makeSiteButton').removeEventListener("mousedown", makeSite, false);
		document.getElementById('exportServerButton').removeEventListener("mousedown", serverExport, false);
		document.getElementById('panels').appendChild(document.getElementById('ExportPanel'));
	}
	document.getElementById('ExportClose').addEventListener("mousedown", close, false);
	var exp1=function(){window['export1']();}
	document.getElementById('exportClipboardButton').addEventListener("mousedown", exp1, false);
	document.getElementById('makeSiteButton').addEventListener("mousedown", function(){window['makeSite']()}, false);
	//document.getElementById('makeSiteButton').addEventListener("mousedown", makeSite, false);
	document.getElementById('exportServerButton').addEventListener("mousedown", serverExport, false);
	document.getElementById('exportLocalButton').addEventListener("mousedown", localExport, false);
	document.documentElement.appendChild(Panel);
}

function export1(n){
	var s='';
	s+= "<graph>\n";
	for(var i in Graph.Nodes){
		if(typeof Graph.Nodes[i] == "object"){
			s += "<node id=\"";
			s += Graph.Nodes[i].id+"\"";
			s += " x=\"";
			s += Graph.Nodes[i].x+"\"";
			s += " y=\"";
			s += Graph.Nodes[i].y+"\"";
			s += " color=\"" ;
			s += Graph.Nodes[i].color+"\"";
			s += " label=\"";
			s += Graph.Nodes[i].label+"\"";
			s +=">\n";
			for(var g in Graph.Nodes[i].edges){
				s += "<edge to=\"";
				s += Graph.Nodes[i].edges[g]+"\"";
				s += " />\n";
 			}
			s += "</node>\n";
		}
	}
	s+="</graph>";
	if(n == "nowindow"){
		return s;
	}
	else{
		var W=top.wopen(s);
	}
}

function import3(){
	var Panel=document.getElementById('ImportPanel');
	document.getElementById('ImportPanelTitle').addEventListener("mousedown", dragPanelStart, false);
	var close=function(){
		Graph.Canvas.removeEventListener("mouseup", Graph.mup, false);
		document.documentElement.addEventListener("mouseup", function(){Graph.Canvas.addEventListener("mouseup", Graph.mup, false); document.getElementById('ImportClose').removeEventListener("mousedown", close, false);}, false);
		document.getElementById('importClipboardButton').removeEventListener("mousedown", exp1, false);
		document.getElementById('importServerButton').removeEventListener("mousedown", importServer, false);
		document.getElementById('importLocalButton').removeEventListener("mousedown", importLocal, false);
		document.getElementById('panels').appendChild(document.getElementById('ImportPanel'));
	}
	document.getElementById('ImportClose').addEventListener("mousedown", close, false);
	var exp1=function(){window['import1']();}
	document.getElementById('importClipboardButton').addEventListener("mousedown", exp1, false);
	document.getElementById('importServerButton').addEventListener("mousedown", importServer, false);
	document.getElementById('importLocalButton').addEventListener("mousedown", importLocal, false);
	document.documentElement.appendChild(Panel);
}

function importServer(){
	document.getElementById('importServerButton').removeEventListener("mousedown", importServer, false);
	var Panel=document.getElementById('ImportPanel');
	var circle=document.getElementById('ImportClose').firstChild;
	var title=document.getElementById('ImportPanelTitle');
	Panel.firstChild.setAttributeNS(null, 'width', '365');
	//Panel.firstChild.setAttributeNS(null, 'fill', 'url(#ExpGrad)');
	title.firstChild.setAttributeNS(null, 'width', '363');
	title.nextSibling.setAttributeNS(null, 'x2', parseInt(title.nextSibling.getAttributeNS(null,'x1'))+363)
	var cx=parseInt(Panel.firstChild.getAttributeNS(null, 'x'))+parseInt(Panel.firstChild.getAttributeNS(null, 'width'))-12;
	circle.setAttributeNS(null, 'cx', cx);
	var importBox=document.createElementNS(xmlns, 'rect');
	importBox.setAttributeNS(null, 'x', parseInt(Panel.firstChild.getAttributeNS(null,'x'))+167);
	importBox.setAttributeNS(null, 'y', parseInt(Panel.firstChild.getAttributeNS(null,'y'))+30);
	importBox.setAttributeNS(null, 'width', '140');
	importBox.setAttributeNS(null, 'height', '102');
	importBox.setAttributeNS(null, 'fill', 'white');
	importBox.setAttributeNS(null, 'stroke', 'black');
	importBox.setAttributeNS(null, 'stroke-width', '1');
	Panel.appendChild(importBox);
	var okButton=document.createElementNS(xmlns, 'g');
	okButton.setAttributeNS(null, 'id', 'okBut');
	var okRect=document.createElementNS(xmlns, 'rect');
	okRect.setAttributeNS(null, 'x', parseInt(Panel.firstChild.getAttributeNS(null,'x'))+312);
	okRect.setAttributeNS(null, 'y', parseInt(Panel.firstChild.getAttributeNS(null,'y'))+30);
	okRect.setAttributeNS(null, 'rx', 5);
	okRect.setAttributeNS(null, 'ry', 5);
	okRect.setAttributeNS(null, 'width', 48);
	okRect.setAttributeNS(null, 'height', 15);
	okRect.setAttributeNS(null, 'fill', 'url(#ButtonGradBg)');
	okRect.setAttributeNS(null, 'stroke', 'none');
	okButton.appendChild(okRect);
	var okTopHighlight=document.createElementNS(xmlns, 'rect');
	okTopHighlight.setAttributeNS(null, 'x', parseInt(Panel.firstChild.getAttributeNS(null,'x'))+313);
	okTopHighlight.setAttributeNS(null, 'y', parseInt(Panel.firstChild.getAttributeNS(null,'y'))+31);
	okTopHighlight.setAttributeNS(null, 'rx', 3);
	okTopHighlight.setAttributeNS(null, 'ry', 3);
	okTopHighlight.setAttributeNS(null, 'width', 46);
	okTopHighlight.setAttributeNS(null, 'height', 6);
	okTopHighlight.setAttributeNS(null, 'fill', 'url(#ButtonGradTopHighlight)');
	okTopHighlight.setAttributeNS(null, 'stroke', 'none');
	okButton.appendChild(okTopHighlight);
	var okBottomHighlight=document.createElementNS(xmlns, 'rect');
	okBottomHighlight.setAttributeNS(null, 'x', parseInt(Panel.firstChild.getAttributeNS(null,'x'))+313);
	okBottomHighlight.setAttributeNS(null, 'y', parseInt(Panel.firstChild.getAttributeNS(null,'y'))+40);
	okBottomHighlight.setAttributeNS(null, 'rx', 4);
	okBottomHighlight.setAttributeNS(null, 'ry', 4);
	okBottomHighlight.setAttributeNS(null, 'width', 46);
	okBottomHighlight.setAttributeNS(null, 'height', 4);
	okBottomHighlight.setAttributeNS(null, 'fill', 'url(#ButtonGradBottomHighlight)');
	okBottomHighlight.setAttributeNS(null, 'stroke', 'none');
	okButton.appendChild(okBottomHighlight);
	var okText=document.createElementNS(xmlns, 'text');
	okText.setAttributeNS(null,'x',parseInt(Panel.firstChild.getAttributeNS(null,'x'))+328)
	okText.setAttributeNS(null,'y',parseInt(Panel.firstChild.getAttributeNS(null,'y'))+42)
	okText.setAttributeNS(null,"font-size","12")
	okText.setAttributeNS(null,"font-family","garamond");
	okText.setAttributeNS(null,"pointer-events","none");
	var okTextNode=document.createTextNode("OK");
	okText.appendChild(okTextNode);
	okButton.appendChild(okText);
	Panel.appendChild(okButton);
	document.getElementById("okBut").addEventListener("mousedown", serverImport, false);
	okButton.addEventListener("mousedown", serverImport, false);
	okText.addEventListener("mousedown", serverImport, false);
	var fileNames=document.createElementNS(xmlns, 'g');
	fileNames.setAttributeNS(null, 'id', 'fileNames');
	Panel.appendChild(fileNames);
	getNames();
	//okButton.addEventListener("mousedown", serverImport(), false);
	//okText.addEventListener("mousedown", serverImport(), false);
}

function getNames(){
	if(window.XMLHttpRequest){  
			http_req = new XMLHttpRequest();
	}
	else{
		alert("ERROR")
	}
	http_req.open('POST','returnF.php',true);
	http_req.onreadystatechange = act;
	http_req.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	http_req.setRequestHeader("Connection","close");
	http_req.send(null);
	
	function act(){
		if(http_req.readyState == 4 ){
			var names = http_req.responseText;
			splitNames = names.split(",");
			importFileNames(splitNames);				
		}
	}
}

function importFileNames(names){
	var Panel=document.getElementById('ImportPanel');
	var rect=new Array();
	var text=new Array();
	var textNode=new Array();
	var spacer=45;
	for(var i=0; i<names.length; i++){
		//console.log(names[i]);
		rect[i]=document.createElementNS(xmlns,'rect');
		rect[i].setAttributeNS(null,'x',parseInt(Panel.firstChild.getAttributeNS(null,'x'))+169);
		rect[i].setAttributeNS(null,'y',parseInt(Panel.firstChild.getAttributeNS(null,'y'))+spacer-10);
		rect[i].setAttributeNS(null,"width", 90);
		rect[i].setAttributeNS(null,"height", 14);
		rect[i].setAttributeNS(null,"fill","white");
		rect[i].setAttributeNS(null,"stroke","white");
		rect[i].setAttributeNS(null,"stroke-dasharray","1,1");
		rect[i].setAttributeNS(null,"stroke-width",1);
		document.getElementById('fileNames').appendChild(rect[i]);
		text[i]=document.createElementNS(xmlns,'text');
		text[i].setAttributeNS(null,'x',parseInt(Panel.firstChild.getAttributeNS(null,'x'))+170);
		text[i].setAttributeNS(null,'y',parseInt(Panel.firstChild.getAttributeNS(null,'y'))+spacer);
		text[i].setAttributeNS(null,"font-size","12");
		text[i].setAttributeNS(null,"font-family","garamond");
		text[i].setAttributeNS(null,"pointer-events","none");
		textNode[i]=document.createTextNode(names[i]);
		text[i].appendChild(textNode[i]);
		document.getElementById('fileNames').appendChild(text[i]);
		rect[i].addEventListener("mousedown", highlightFile, false);
		spacer+=16;
	}
}

function highlightFile(evt){
	var rects=document.getElementById('fileNames').getElementsByTagName('rect');
	for(var i=0; i<rects.length; i++){
		rects.item(i).setAttributeNS(null,"fill","white");
		rects.item(i).setAttributeNS(null,"stroke","white");
	}
	evt.target.setAttributeNS(null, 'fill', 'blue');
	evt.target.setAttributeNS(null, 'stroke', 'black');
	chosenFile=evt.target.nextSibling.firstChild.nodeValue;
	alert(chosenFile);
	//console.log(chosenFile);
}

function importLocal(){
	var W=top.wopen("uploadPage.html");
}

function localImport(fileName){
	try{
		var rects=document.getElementById('fileNames').getElementsByTagName('rect');
		for(var i=0; i<rects.length; i++){
			rects.item(i).setAttributeNS(null,"fill","white");
			rects.item(i).setAttributeNS(null,"stroke","white");
		}
	}
	catch(err){
		//console.log(err);
	}
	chosenFile = fileName;
	//console.log('open'); 
	var httpG = new XMLHttpRequest();
	httpG.open('post',"tempFileUpload/"+chosenFile,true);
	httpG.onreadystatechange = getinfo;
	httpG.send(null);

	function getinfo(){
		if(httpG.readyState == 4){
			//alert(httpG.responseText);
			import2(httpG.responseText);
		}
	}
}


function serverImport(){
	//console.log('open'); 
	var httpG = new XMLHttpRequest();
	httpG.open('post',"SavedGraphs/"+chosenFile,true);
	httpG.onreadystatechange = getinfo;
	httpG.send(null);

	function getinfo(){
		if(httpG.readyState == 4){
			//alert(httpG.responseText);
			import2(httpG.responseText);
		}
	}
}
function import1(){
	 var W=top.wopen("Paste Your <grapher> XML Formatted Data Here", "read"); //added 8-05
}

function import2(n){
	try //Internet Explorer
	  {
  		xmlSave=new ActiveXObject("Microsoft.XMLDOM");
	        xmlSave.async="false";
	        xmlSave.loadXML(n);
 
	  }
	catch(e)
  	{
  		var importstring = n
  		parser=new DOMParser();
  		xmlSave=parser.parseFromString(n,"text/xml");
 
        }

	var tmap=new Object();
	var newNodes=xmlSave.getElementsByTagName('node')
	setattr = new Array('id','x','y','color','label')
	for (var i=0;i<newNodes.length;i++){
		var a = newNodes[i].attributes;
		attr1 = new Array()	
		for (var g=0;g<setattr.length;g++){
			attr1[g] = a.getNamedItem(setattr[g]).nodeValue
			//if(g==0)console.log("attr1[0] : "+attr1[g]+" : "+g);
		}
		tmap[attr1[0]]='g'+Graph.nodenum;
		//console.log("tmap["+attr1[0]+"] : "+'g'+Graph.nodenum);
		Graph.nodenum++;
	}	
	for (var i=0;i<newNodes.length;i++){
		var a = newNodes[i].attributes;
		attr1 = new Array()	
		for (var g=0;g<setattr.length;g++){
			attr1[g] = a.getNamedItem(setattr[g]).nodeValue	
			//if(g==0)console.log("attr1[0] : "+attr1[g]+" : "+g);
		}
		var newEdges = newNodes[i].getElementsByTagName('edge')
		var edges = new Object();
		for(var k=0;k<newEdges.length;k++){
			var to = newEdges[k].attributes.getNamedItem('to').nodeValue
			edges[tmap[to]]=[tmap[to]];
		}
		var node = new Object();
		node.x=(+attr1[1]);
		node.y=(+attr1[2]);
		node.id=tmap[attr1[0]];
		//console.log("attr1[0] : "+attr1[0]+" ; tmap["+attr1[0]+"] : "+tmap[attr1[0]]);
		node.label=attr1[4];
		node.width=28;
		node.height=20;
		node.color=attr1[3];
		node.edges=edges;
		Graph.Nodes[node.id]=node;
		Graph.createNode(node);
	}

	
	for(var i in Graph.Nodes){
		if(typeof Graph.Nodes[i] == "object"){
			var m=document.getElementById(i);
			for(var j in Graph.Nodes[i].edges){
				var al=document.getElementById(j);
				if(m.id<al.id) {
					if(!document.getElementById("L"+m.id+":"+al.id)) Graph.Nodes.addEdge(m,al);
				}
				else{
					if(!document.getElementById("L"+al.id+":"+m.id)) Graph.Nodes.addEdge(m,al);
			
				}
			}
		}
	}
	logAction('imported sub graph');
}

function serverExport(){
	var str = export1("nowindow")
	var http_req = false;
	da = new Date().getTime()
	ds = "d="+da+".xml&xsv="+str
	request();
	function request(){
		if(window.XMLHttpRequest){
			http_req = new XMLHttpRequest(); 
		}
		else{
			alert("ERROR OLD BROWSER?")
		}
		http_req.open('POST','save.php',true);
		http_req.onreadystatechange = act;
		http_req.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		http_req.setRequestHeader("Content-length",ds.length);
		http_req.setRequestHeader("Connection","close");
		http_req.send(ds);
		function act(){
			if(http_req.readyState == 4 ){
				//var W =top.wopen("http://cs.sru.edu/dailey09/reno/LIVEVERSIONAUG272009/grapher.html?xsv="+da)
				serverExportPanel(http_req.responseText);
			}
		}	
	}
}

function serverExportPanel(nFile){
	//console.log('graph'+nFile+'.xml');
	message('Your graph has been stored as \'graph'+nFile+'.xml\'');
}

function localExport(){
	var str = export1("nowindow");
	var http_req = false;
	var ds="xsv=<?php header('Content-type: attachment/force-download'); header('Content-disposition: attachment;filename=graph.xml'); ?>"+str; 
	request();
	function request(){
		if(window.XMLHttpRequest){
			http_req = new XMLHttpRequest(); 
		}
		else{
			alert("ERROR OLD BROWSER?")
		}
		http_req.open('POST','saveLocal.php',true);
		http_req.onreadystatechange = act;
		http_req.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		http_req.setRequestHeader("Content-length",ds.length);
		http_req.setRequestHeader("Connection","close");
		http_req.send(ds);
		function act(){
			if(http_req.readyState == 4 ){
				//var W =top.wopen("http://cs.sru.edu/dailey09/reno/LIVEVERSIONAUG272009/grapher.html?xsv="+da)
				localExportPanel(http_req.responseText);
			}
		}	
	}
}

function localExportPanel(nFile){
	//console.log(nFile);
	message(nFile);
}

function makeSite(){
	var counter=0;
	int_count=0;
	//Edges_Matrix = new Array();
	Edges_Matrix = new String();
	if(isEmptyObject(Graph.SelectedNodes)) Graph.Nodes.all();
	for (var i in Graph.SelectedNodes)
 	{
 		int_count=0;
 		for (var j in Graph.Nodes[i].edges)
 		{
 			if (int_count==0)
 			{
 			Edges_Matrix += j;
 			int_count++;
 	 		}
 	 		else
 	 		{
 	 		Edges_Matrix += ","+j;
 	 		}
	 	}
	Edges_Matrix += "B";
 	int_count=0;
 	counter++;
 	}	
	window.open("../cgi/makeSite2.php?edges_array="+Edges_Matrix+"");
	//window.location = "../cgi/makeSite.php";
	//top.makeSite2();
}

