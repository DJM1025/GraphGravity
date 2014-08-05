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

function exportToSpreadsheet()
{
	var s = getXML();
	var w = window.open("http://cs.sru.edu/~gravity/simple_spreadsheet/spreadsheet_offline.html");
	setTimeout(function () {w.loadXML(s);}, 100);
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
		var x = numNodes[i].getAttribute("x");
		var y = numNodes[i].getAttribute("y");
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