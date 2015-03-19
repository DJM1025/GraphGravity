//This file contains everything that will be used for importing and exporting Graphs!!!

function getXML()
{
	Graph.deselectAllNodes(); //to make sure they are all in the proper group
	var s = "<graph>\n";
	for(var i=0; i < Graph.numberOfNodes;i++)
	{
		s += "<node id=\"g";
		s += Graph.nodes[i].nodeNum+"\"";
		s += " gravityValue=\"";
		s += Graph.nodes[i].gravityValue+"\"";
		s += " x=\"";
		s += Graph.nodes[i].X+"\"";
		s += " y=\"";
		s += Graph.nodes[i].Y+"\"";
		s += " label=\"";
		s += Graph.nodes[i].textContent+"\"";
		s += " color=\"";
		s += Graph.nodes[i].color+"\"";
		s += ">\n";
		s += "<img src=\"";
		s += Graph.nodes[i].image+"\"";
		s += " />\n";
		for(var j=0; j <Graph.nodes[i].edgesList.length; j++)//get all of the edges from the node.
		{
			s += "<edge to=\"g";
			s += Graph.nodes[i].edgesList[j];
			//s += "\" id=\""+i+"-"+j;
			s += "\" />\n";
		}
		s+= "</node>\n";
	}
	s += "</graph>";
	return s;
}

function exportToFile() 
{
	var s = getXML(); 
	download("Grapher Output.txt", s);
}

function exportToSite(site)
{
	var s = getXML();
	if(site == "Spreadsheet"){
		if(document.domain)
			var w = window.open("http://cs.sru.edu/~gravity/simple_spreadsheet/spreadsheet_offline.html");
		else
			var w = window.open("../Simple-Spreadsheet/simple_spreadsheet/spreadsheet_offline.html")
	}
	else if(site == "Constructor")
	{
		if(document.domain)
			var w = window.open("http://cs.sru.edu/~gravity/simple_spreadsheet/constructor.html");
		else
			var w = window.open("../Simple-Spreadsheet/simple_spreadsheet/constructor.html");
	}
	setTimeout(function () { w.postMessage(s, "*"); }, 500);
	//setTimeout(function () {w.loadXML(s);}, 100);
}

function exportClipboard()
{
	var s = getXML();
	window.prompt("Copy to clipboard: Ctrl+C, Enter", s);
}

function Node(x, y, nodeLabel, id, color, gravityValue, image,edgesArray)
{

	this.X = x;
	this.Y = y;
	this.label = nodeLabel;
	this.id = id;
	this.color = color;
	this.gravityValue = gravityValue;
	this.image = image;
	this.edges = edgesArray;
}

function importClipboard(code)
{
	var parser = new DOMParser();
	if(code == null) 
		var data = window.prompt("Please enter your Grapher data!");
	else 
		var data = code;
	xmlDoc = parser.parseFromString(data,"text/xml");
	
	var numNodes = xmlDoc.getElementsByTagName("node");
	for(var i =0; i < numNodes.length;i++)
	{
		var x = parseInt(numNodes[i].getAttribute("x"));
		var y = parseInt(numNodes[i].getAttribute("y"));
		var nodeLabel = numNodes[i].getAttribute("label");
		var id = numNodes[i].getAttribute("id");
		var gravity = parseInt(numNodes[i].getAttribute("gravityValue"));
		var color = numNodes[i].getAttribute("color");
		var img = xmlDoc.getElementsByTagName("img")[i].getAttribute("src");
		var edges = new Array();
		var numEdges = numNodes[i].getElementsByTagName("edge");
		for(var j =0; j < numEdges.length;j++)
		{
			var edgeNum = numEdges[j].getAttribute("to");
			edges.push(parseInt(edgeNum.substring(1,edgeNum.length)));
		}
		
		var node = new Node(x,y,nodeLabel,id,color,gravity,img,edges);
		Graph.createImportedNode(node);
	}
	
	Graph.connectNodes(false);
	
}

function importClipboardLegacy(code)
{
	var parser = new DOMParser();
	if(code == null) 
		var data = window.prompt("Please enter your Grapher data!");
	else 
		var data = code;
	xmlDoc = parser.parseFromString(data,"text/xml");
	
	var numNodes = xmlDoc.getElementsByTagName("node");
	for(var i =0; i < numNodes.length;i++)
	{
		var x = parseInt(numNodes[i].getAttribute("x"));
		var y = parseInt(numNodes[i].getAttribute("y"));
		var nodeLabel = numNodes[i].getAttribute("label");
		var idString = numNodes[i].getAttribute("id");
		var id = parseInt(idString.substring(1,idString.length));
		var color = numNodes[i].getAttribute("color");
		var img;
		var gravity;
		try{
			img = xmlDoc.getElementsByTagName("img")[i].getAttribute("src");
		}
		catch(err){
			img = null;
		}
		try{
			gravity = parseInt(numNodes[i].getAttribute("gravityValue"));
		}
		catch(err){
			gravity = null;
		}
		var edges = new Array();
		var numEdges = numNodes[i].getElementsByTagName("edge");
		for(var j =0; j < numEdges.length;j++)
		{
			var edgeNum = numEdges[j].getAttribute("to");
			edges.push(parseInt(edgeNum.substring(1,edgeNum.length))-1);
			
		}
		
		var node = new Node(x,y,nodeLabel,id,color,null,null,edges);
		Graph.createImportedNode(node);
	}
	
	Graph.connectNodes(false);
	
}
