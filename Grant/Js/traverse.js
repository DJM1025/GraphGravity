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

		var randomAdjacent = Math.floor(Math.random() * Graph.nodes[randomNode].edgesList.length);
		var destinationNode = Graph.nodes[randomNode].edgesList[randomAdjacent];
		
		var destX = Graph.nodes[destinationNode].X + Graph.nodeWidth / 2;
		var destY = Graph.nodes[destinationNode].Y + Graph.nodeHeight /2;
		
		var animateX = document.createElementNS(xmlns,"animate");
		animateX.setAttributeNS(null,"attributeName","cx");
		animateX.setAttributeNS(null,"attributeType","XML");
		animateX.setAttributeNS(null,"from",this.cx);
		animateX.setAttributeNS(null,"to",destX);
		animateX.setAttributeNS(null,"begin","Z.click");
		animateX.setAttributeNS(null,"dur","5s");
		animateX.setAttributeNS(null,"onend","function(){this.changeDirection}");
		animateX.setAttributeNS(null,"fill","freeze");
		//animateX.setAttributeNS(null,"repeatCount","indefinite");
		
		
		var animateY = document.createElementNS(xmlns,"animate");
		animateY.setAttributeNS(null,"attributeName","cy");
		animateY.setAttributeNS(null,"attributeType","XML");
		animateY.setAttributeNS(null,"from",this.cy);
		animateY.setAttributeNS(null,"to",destY);
		animateY.setAttributeNS(null,"begin","Z.click");
		animateY.setAttributeNS(null,"dur","5s");
		animateY.setAttributeNS(null,"onend","this.changeDirection()");
		animateY.setAttributeNS(null,"fill","freeze");
		//animateY.setAttributeNS(null,"repeatCount","indefinite");

		document.getElementById(this.id).appendChild(animateX);
		document.getElementById(this.id).appendChild(animateY);


	}
	else
		alert("Please create a graph with at least 2 nodes first!");
}
/*
function changeDirection(evt)
{
	alert("did i work");
}*/


graphWalker.prototype.changeDirection = function () {

	alert("did isfasdf work?");
}

//Destroys the graph walker's SVG image that is displayed on the screen 
graphWalker.prototype.removeWalker = function () {
	this.element.parentNode.removeChild(this.element);
}