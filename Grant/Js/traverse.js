function graphWalker(){
	this.radius = 10;
	this.cx = 500;
	this.cy = 500;
	this.destinationX = 0;
	this.destinationY = 0;
	this.destinationNode = 0;
	this.speed = "5s";
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
	if(Graph.numberOfNodes > 1)
	{
		//sort the edgesVisited Array
		var randomNode = Math.floor(Math.random() * Graph.numberOfNodes);
		this.cx = Graph.nodes[randomNode].X + Graph.nodeWidth / 2; //may need fixed in the future
		this.cy = Graph.nodes[randomNode].Y + Graph.nodeHeight / 2;
		this.currentNode = randomNode;
		this.init();

		var randomAdjacent = Math.floor(Math.random() * Graph.nodes[randomNode].edgesList.length);
		var destinationNode = Graph.nodes[randomNode].edgesList[randomAdjacent];
		
		var destX = Graph.nodes[destinationNode].X + Graph.nodeWidth / 2;
		var destY = Graph.nodes[destinationNode].Y + Graph.nodeHeight /2;
		
		this.destinationNode = destinationNode;
		this.destinationX = destX;
		this.destinationY = destY;
		var obj = this;
		
		var animateX = document.createElementNS(xmlns,"animate");
		animateX.setAttributeNS(null,"attributeName","cx");
		animateX.setAttributeNS(null,"attributeType","XML");
		animateX.setAttributeNS(null,"from",this.cx);
		animateX.setAttributeNS(null,"to",destX);
		animateX.setAttributeNS(null,"begin","Z.click");
		animateX.setAttributeNS(null,"dur",this.speed);
		animateX.onend = function ()
		{
			changeDirection(obj);
		}
		animateX.setAttributeNS(null,"fill","freeze");
		animateX.setAttributeNS(null,"restart","never");
		
		var animateY = document.createElementNS(xmlns,"animate");
		animateY.setAttributeNS(null,"attributeName","cy");
		animateY.setAttributeNS(null,"attributeType","XML");
		animateY.setAttributeNS(null,"from",this.cy);
		animateY.setAttributeNS(null,"to",destY);
		animateY.setAttributeNS(null,"begin","Z.click");
		animateY.setAttributeNS(null,"dur",this.speed);
		animateY.setAttributeNS(null,"fill","freeze");
		animateY.setAttributeNS(null,"restart","never");

		this.element.appendChild(animateX);
		this.element.appendChild(animateY);
	}
	else
		alert("Please create a graph with at least 2 nodes first!");
}
function getIndexLocation(node)
{
	var iterator;
	for(var x = 0;x < Graph.nodes[node.currentNode].edgesList.length;x++)
	{
		if(node.destinationNode === Graph.nodes[node.currentNode].edgesList[x])
			iterator = x;
	}
	
	return iterator;
	
}
function changeDirection(node)
{
	node.cx = node.element.getAttribute("cx");
	node.cy = node.element.getAttribute("cy");
	node.element.setAttributeNS(null,"cx",node.cx);
	node.element.setAttributeNS(null,"cy",node.cy);

	Graph.nodes[node.destinationNode].timesVisited++;	//increment the number of times the node has been visited
	Graph.nodes[node.currentNode].edgesVisited[getIndexLocation(node)]++;
	Graph.nodes[node.destinationNode].edgesVisited[getIndexLocation(node)]++;
	node.updateColors();
	node.updateEdges();
	
	node.currentNode = node.destinationNode;
	
	
	var randomAdjacent = Math.floor(Math.random() * Graph.nodes[node.currentNode].edgesList.length);
	var destinationNode = Graph.nodes[node.currentNode].edgesList[randomAdjacent];
		
	var destX = Graph.nodes[destinationNode].X + Graph.nodeWidth / 2;
	var destY = Graph.nodes[destinationNode].Y + Graph.nodeHeight /2;
		
	node.destinationNode = destinationNode;
	node.destinationX = destX;
	node.destinationY = destY;
	//remove previous animtate attributes
	while(node.element.firstChild)
	{
		node.element.removeChild(node.element.firstChild);
	}
	node.moveTo();
}
graphWalker.prototype.updateEdges = function() {

	
	alert(Graph.nodes[this.currentNode].edgesVisited[getIndexLocation(this)]);
	alert(Graph.nodes[this.destinationNode].edgesVisited[getIndexLocation(this)]);
}

graphWalker.prototype.updateColors = function () {
	
	//Handles changing colors of nodes -- needs some math to figure out how colors will be changed
	Graph.nodes[this.destinationNode].color = "rgb(64,64,"+(Graph.nodes[this.destinationNode].timesVisited + 128) + ")";
	Graph.changeNodeColor(Graph.nodes[this.destinationNode],Graph.nodes[this.destinationNode].color, "black");
	
	//Handles changing of edges colors -- also needs math to figure out how colors will be changed
	

}

graphWalker.prototype.updateSpeed = function (modifier) {
	this.pauseTraversal();
	this.speed = 5.01 - (5 * modifier);
	this.moveTo();

}

graphWalker.prototype.moveTo = function () {

	var obj = this;
	var animateX = document.createElementNS(xmlns,"animate");
		animateX.setAttributeNS(null,"attributeName","cx");
		animateX.setAttributeNS(null,"attributeType","XML");
		animateX.setAttributeNS(null,"from",this.cx);
		animateX.setAttributeNS(null,"to",this.destinationX);
		animateX.setAttributeNS(null,"begin","Z.click");
		//animateX.setAttributeNS(null, "end", "P.click");
		animateX.setAttributeNS(null,"dur",this.speed);
		animateX.onend = function ()
		{
			changeDirection(obj);
		}
		animateX.setAttributeNS(null,"fill","freeze");
		animateX.setAttributeNS(null,"restart","never");
		
		var animateY = document.createElementNS(xmlns,"animate");
		animateY.setAttributeNS(null,"attributeName","cy");
		animateY.setAttributeNS(null,"attributeType","XML");
		animateY.setAttributeNS(null,"from",this.cy);
		animateY.setAttributeNS(null,"to",this.destinationY);
		animateY.setAttributeNS(null,"begin","Z.click");
		//animateX.setAttributeNS(null, "end", "P.click");
		animateY.setAttributeNS(null,"dur",this.speed);
		animateY.setAttributeNS(null,"fill","freeze");
		animateY.setAttributeNS(null,"restart","never");

		this.element.appendChild(animateX);
		this.element.appendChild(animateY);

		this.element.firstChild.beginElement();		  //X
		this.element.childNodes[1].beginElement();   //Y 
}

graphWalker.prototype.pauseTraversal = function () {

	this.cx = this.element.getAttribute("cx");
	this.cy = this.element.getAttribute("cy");
	this.element.setAttributeNS(null,"cx",this.cx);
	this.element.setAttributeNS(null,"cy",this.cy);

	while(this.element.firstChild)
	{
		this.element.removeChild(this.element.firstChild);
	}
}

//Destroys the graph walker's SVG image that is displayed on the screen 
graphWalker.prototype.removeWalker = function () {
	this.element.parentNode.removeChild(this.element);
}