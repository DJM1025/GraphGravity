function graphWalker(){
	this.radius = 10;
	this.cx = 500;
	this.cy = 500;
	this.color = "black";
	this.traverseWin = LoadTraverseWindow(parentSVG);
}

graphWalker.prototype.init = function(){
	var circle = document.createElementNS(xmlns, "circle");
	circle.setAttributeNS(null,"r", this.radius);
	circle.setAttributeNS(null,"cx", this.cx);
	circle.setAttributeNS(null,"cy", this.cy);
	circle.setAttributeNS(null,"fill", this.color);
	document.getElementById("graphPlane").appendChild(circle);

	this.traverseWin.open();
}
graphWalker.prototype.randomStart = function ()
{
	if(Graph.numberOfNodes> 1)
	{
		var randomNode = Math.floor(Math.random() * Graph.numberOfNodes);
		this.cx = Graph.nodes[randomNode].X + Graph.nodeWidth / 2; //may need fixed in the future
		this.cy = Graph.nodes[randomNode].Y + Graph.nodeHeight / 2;
		this.init();
		var randomAdjacent = Math.floor(Math.random() * Graph.nodes[randomNode].adjacentNodes.length);
	}
	else
		alert("Please create a graph with at least 2 nodes first!");
}
