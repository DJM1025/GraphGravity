function graphWalker(){
	this.radius = 10;
	this.cx = 500;
	this.cy = 500;
	this.color = "black";
	this.currentNode = null;
	this.element = null; 	//Holds the SVG element for the walker (document.getElementBy not needed)
}

graphWalker.prototype.init = function(){
	var circle = document.createElementNS(xmlns, "circle");
	circle.setAttributeNS(null, "id", this.id);
	circle.setAttributeNS(null,"r", this.radius);
	circle.setAttributeNS(null,"cx", this.cx);
	circle.setAttributeNS(null,"cy", this.cy);
	circle.setAttributeNS(null,"fill", this.color);
	document.getElementById("graphPlane").appendChild(circle);
	this.element = circle;
}

graphWalker.prototype.randomStart = function ()
{
	if(Graph.numberOfNodes> 1)
	{
		var randomNode = Math.floor(Math.random() * Graph.numberOfNodes);
		this.cx = Graph.nodes[randomNode].X + Graph.nodeWidth / 2; //may need fixed in the future
		this.cy = Graph.nodes[randomNode].Y + Graph.nodeHeight / 2;
		this.currentNode = randomNode;
		this.init();
	}
	else
		alert("Please create a graph with at least 2 nodes first!");
}

graphWalker.prototype.randomWalk = function () {
	var randomAdjacent = Math.floor(Math.random() * Graph.nodes[this.currentNode].edgesList.length);
	var destinationNode = Graph.nodes[this.currentNode].edgesList[randomAdjacent];
	
	var destX = Graph.nodes[destinationNode].X + Graph.nodeWidth / 2;
	var destY = Graph.nodes[destinationNode].Y + Graph.nodeHeight /2;
	
	var animateX = document.createElementNS(xmlns,"animate");
	animateX.setAttributeNS(null,"attributeName","cx");
	animateX.setAttributeNS(null,"attributeType","XML");
	animateX.setAttributeNS(null,"from",this.cx);
	animateX.setAttributeNS(null,"to",destX);
	animateX.setAttributeNS(null,"begin","0s");
	animateX.setAttributeNS(null,"dur","5s");
	animateX.setAttributeNS(null,"fill","freeze");
	animateX.setAttributeNS(null,"repeatCount","indefinite");
	
	var animateY = document.createElementNS(xmlns,"animate");
	animateY.setAttributeNS(null,"attributeName","cy");
	animateY.setAttributeNS(null,"attributeType","XML");
	animateY.setAttributeNS(null,"from",this.cy);
	animateY.setAttributeNS(null,"to",destY);
	animateY.setAttributeNS(null,"begin","0s");
	animateY.setAttributeNS(null,"dur","5s");
	animateY.setAttributeNS(null,"fill","freeze");
	animateY.setAttributeNS(null,"repeatCount","indefinite");

	this.element.appendChild(animateX);
	this.element.appendChild(animateY);
}

//Destroys the graph walker's SVG image that is displayed on the screen 
graphWalker.prototype.removeWalker = function () {
	this.element.parentNode.removeChild(this.element);
}