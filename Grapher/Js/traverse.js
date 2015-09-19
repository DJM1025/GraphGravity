
function graphWalker(){
	this.id = "traversalWalker";
	this.radius = 10;
	this.cx = 500;
	this.cy = 500;
	this.destinationX = 0;
	this.destinationY = 0;
	this.destinationNode = 0;
	this.speed = 5.01 - (5 * speedMod); //Speed mod is a global variable in the TraverseWindow which controls starting speed for new walkers
	this.color = "black";
	this.currentNode = null;
	this.element = null; 	//Holds the SVG element for the walker (document.getElementBy not needed)
	
	this.userData = false;
	this.nodeDestArray = new Array();
	this.nodeTimeArray = new Array();
	this.currentNodeIndex = 0;
	this.minTravelTime = .1;
}

/******
* parseUserData - takes traversal data and splits it into 2 separate arrays
* User data is missing the last move and includes an empty field at the end
*****/
graphWalker.prototype.parseUserData = function (pathArray) {
	var tempArray = pathArray.split(";");
	for (var x=0; x< tempArray.length; x++) {
		var singleNode = tempArray[x].split(",")
		this.nodeDestArray[x] = singleNode[0]
		this.nodeTimeArray[x] = singleNode[1]
	}
}

graphWalker.prototype.findLowestTime = function () {
	var lowestTime = this.nodeTimeArray[0];
	var time;
	for (var x=1; x<this.nodeTimeArray.length-1; x++) {
		time = this.nodeTimeArray[x]-this.nodeTimeArray[x-1]
		if ( time < lowestTime  && time > 0)
			lowestTime = time;
	}
	
	return lowestTime;
}

graphWalker.prototype.setMinTravelTime = function (time) {
	this.userData = true;
	if (time > 0)
		this.minTravelTime = time;
	else
		this.minTravelTime = .1;
		
	this.updateSpeed(0)
}

graphWalker.prototype.init = function(){
	var circle = document.createElementNS(xmlns, "circle");
	circle.setAttributeNS(null, "id", this.id);
	circle.setAttributeNS(null,"r", this.radius);
	circle.setAttributeNS(null,"cx", this.cx);
	circle.setAttributeNS(null,"cy", this.cy);
	circle.setAttributeNS(null,"fill", this.color);
	circle.setAttributeNS(null, "stroke", this.color);
	circle.setAttributeNS(null, "stroke-width", 2);
	circle.setAttributeNS(null,"fill-opacity", 0.5);
	document.getElementById("graphPlane").appendChild(circle);
	this.element = circle;
}

graphWalker.prototype.randomStart = function (){
	choosenColor = 1; //sets the currentlySelected Color
	defaultColors(choosenColor)   //initializes all of the nodes to there starting colors
	setKeyColors(choosenColor);
	if(Graph.numberOfNodes > 1)	{
		var randomNode = Math.floor(Math.random() * Graph.numberOfNodes);
		this.cx = Graph.nodes[randomNode].X + Graph.nodes[randomNode].nodeWidth / 2; //may need fixed in the future
		this.cy = Graph.nodes[randomNode].Y + Graph.nodeHeight / 2;
		this.currentNode = randomNode;
		this.init();

		var randomAdjacent = Math.floor(Math.random() * Graph.nodes[randomNode].edgesList.length);
		var destinationNode = Graph.nodes[randomNode].edgesList[randomAdjacent];
		var destX = Graph.nodes[destinationNode].X + Graph.nodes[destinationNode].nodeWidth / 2;
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
		animateX.onend = function ()	{
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
}
graphWalker.prototype.specifyStart = function (){
	choosenColor = 1; //sets the currentlySelected Color
	defaultColors(choosenColor)   //intializes all of the nodes to there starting colors
	setKeyColors(choosenColor);
	
	if(Graph.numberOfNodes > 1)	{
		var startNode = this.nodeDestArray[this.currentNodeIndex] -1
		if (startNode >=0){
			this.cx = Graph.nodes[startNode].X + Graph.nodes[startNode].nodeWidth / 2; //may need fixed in the future
			this.cy = Graph.nodes[startNode].Y + Graph.nodeHeight / 2;
			this.currentNode = startNode;
			this.init();
			this.currentNodeIndex ++;

			var destinationNode = Graph.nodes[this.nodeDestArray[this.currentNodeIndex]-1].nodeNum;
			var destX = Graph.nodes[destinationNode].X + Graph.nodes[destinationNode].nodeWidth / 2;
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
			animateX.onend = function ()	{
				specifyDirection(obj);
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
	}
}
function getIndexLocation(node,flag){
	var iterator;
	if(flag === 1)	{
		for(var x = 0;x < Graph.nodes[node.currentNode].edgesList.length;x++)		{
			if(node.destinationNode === Graph.nodes[node.currentNode].edgesList[x])
				iterator = x;
		}
	}
	else	{
		for(var x = 0;x < Graph.nodes[node.destinationNode].edgesList.length;x++)		{
			if(node.currentNode === Graph.nodes[node.destinationNode].edgesList[x])
				iterator = x;
		}
	}
	return iterator;
}
function changeDirection(node){
	node.cx = node.element.getAttribute("cx");
	node.cy = node.element.getAttribute("cy");
	node.element.setAttributeNS(null,"cx",node.cx);
	node.element.setAttributeNS(null,"cy",node.cy);

	Graph.nodes[node.destinationNode].timesVisited++;	//increment the number of times the node has been visited
	Graph.nodes[node.currentNode].edgesVisited[getIndexLocation(node,1)]++;
	Graph.nodes[node.destinationNode].edgesVisited[getIndexLocation(node,0)]++;
	
	node.updateColors(choosenColor);
	
	node.updateEdges();
	
	node.currentNode = node.destinationNode;
	
	var randomAdjacent = Math.floor(Math.random() * Graph.nodes[node.currentNode].edgesList.length);
	var destinationNode = Graph.nodes[node.currentNode].edgesList[randomAdjacent];
		
	var destX = Graph.nodes[destinationNode].X + Graph.nodes[destinationNode].nodeWidth / 2;
	var destY = Graph.nodes[destinationNode].Y + Graph.nodeHeight /2;
		
	node.destinationNode = destinationNode;
	node.destinationX = destX;
	node.destinationY = destY;
	//remove previous animtate attributes
	while(node.element.firstChild)	{
		node.element.removeChild(node.element.firstChild);
	}
	node.moveTo("random");
}
function specifyDirection (node) {
	node.currentNodeIndex ++;
	node.cx = node.element.getAttribute("cx");
	node.cy = node.element.getAttribute("cy");
	node.element.setAttributeNS(null,"cx",node.cx);
	node.element.setAttributeNS(null,"cy",node.cy);

	Graph.nodes[node.destinationNode].timesVisited++;	//increment the number of times the node has been visited
	Graph.nodes[node.currentNode].edgesVisited[getIndexLocation(node,1)]++;
	Graph.nodes[node.destinationNode].edgesVisited[getIndexLocation(node,0)]++;
	
	node.updateColors(choosenColor);
	node.updateEdges();
	
	node.currentNode = node.destinationNode;
	
	var nextNode = Graph.nodes[node.nodeDestArray[node.currentNodeIndex]-1];
	
	if (node.currentNodeIndex < node.nodeDestArray.length -1) {	// -1 is because the data has an extra field at the end
		setTimeout(function(){  
			var destX = nextNode.X + nextNode.nodeWidth / 2;
			var destY = nextNode.Y + Graph.nodeHeight /2;
				
			node.destinationNode = nextNode.nodeNum;
			node.destinationX = destX;
			node.destinationY = destY;
			//remove previous animate attributes
			while(node.element.firstChild)	{
				node.element.removeChild(node.element.firstChild);
			}
			node.moveTo("specified");		
		}, (node.nodeTimeArray[node.currentNodeIndex] - node.nodeTimeArray[node.currentNodeIndex-1] - node.minTravelTime) * (node.speed * 500));
		//alert(node.nodeTimeArray[node.currentNodeIndex] - node.nodeTimeArray[node.currentNodeIndex-1])
	}
	else{
		var startNode = node.nodeDestArray[0]-1
		var destX = Graph.nodes[startNode].X + Graph.nodes[startNode].nodeWidth / 2;
		var destY = Graph.nodes[startNode].Y + Graph.nodeHeight /2;
			
		node.destinationNode = startNode.nodeNum;
		node.destinationX = destX;
		node.destinationY = destY;
		//remove previous animate attributes
		while(node.element.firstChild)	{
			node.element.removeChild(node.element.firstChild);
		}
		node.moveTo("specified");
		
		node.color = "white"
		node.element.setAttributeNS(null, "fill", node.color);
		node.element.setAttributeNS(null, "stroke", "black");
		node.element.setAttributeNS(null, "stroke-width", 4);
	}
}
graphWalker.prototype.updateEdges = function() {
	var base = 2;
	var id1 = document.getElementById(this.currentNode + "-" + this.destinationNode);
	var id2 = document.getElementById(this.destinationNode + "-" + this.currentNode);
	
	if(id1)	{
		id1.setAttributeNS(null,"stroke-width", base + (0.3 * Graph.nodes[this.currentNode].edgesVisited[getIndexLocation(this,1)]));
		//id1.setAttributeNS(null,"stroke-width", id1.getAttributeNS(null, "stroke-width") +.2);
	}
	else if(id2)	{
		id2.setAttributeNS(null,"stroke-width", base + (0.3 * Graph.nodes[this.currentNode].edgesVisited[getIndexLocation(this,1)]));
		//id2.setAttributeNS(null,"stroke-width", id2.getAttributeNS(null, "stroke-width") +.2);
	}
}
function setChoosenColor(colorChoice,boxSelected){
	var boxColors = document.getElementById("colorBoxes").childNodes;
	for(var x = 0;x < boxColors.length;x++)	{
		if(x == boxSelected)
			boxColors[x].setAttributeNS(null,"fill","green");
		else
			boxColors[x].setAttributeNS(null,"fill","white");
	}//end for
	choosenColor = colorChoice;
	setKeyColors(choosenColor);
	walkers[0].updateColors(choosenColor);
}
function defaultColors(colorChoice){
	if(colorChoice == 0){ //red to yellow scaling color gradient	
		for(var x=0; x < Graph.numberOfNodes;x++)		{
			Graph.nodes[x].color = "rgb(128,0,0)";
			Graph.changeNodeColor(Graph.nodes[x],Graph.nodes[x].color, "black");
		}
	}
	else if(colorChoice == 1){ //blue to red heat map gradient
		for(var x=0; x < Graph.numberOfNodes;x++)		{
			Graph.nodes[x].color = "rgb(0,0,255)";
			Graph.changeNodeColor(Graph.nodes[x],Graph.nodes[x].color, "white");
		}
	}
}
function resetGraph(){
	
	for(var x=0; x < Graph.edgesGroup.childNodes.length;x++)	{
		Graph.edgesGroup.children[x].setAttributeNS(null,"stroke-width","2");
	}
	while(walkers.length > 0)	{
		walkers[walkers.length - 1].removeWalker();
		walkers.pop();
	}
	for(var x = 0;x < Graph.numberOfNodes;x++)	{
		defaultColors(choosenColor);
		Graph.changeNodeColor(Graph.nodes[x],Graph.nodes[x].color, "black");
		Graph.nodes[x].timesVisited = 0;
		for(var y =0; y < Graph.nodes[x].edgesVisited.length;y++)		{
			Graph.nodes[x].edgesVisited[y] = 0;
		}
	}
	
	document.getElementById("numWalkers").value = 0;
}
function setKeyColors(colorChoice){
	var keyGroup = document.getElementById("keyArea").childNodes;
	if(colorChoice == 0)	{
		for(var x = 0; x < keyGroup.length;x++)		{
			var redColor = Math.round(128 + (128 * (x/(keyGroup.length-1))));
			var greenColor =  Math.round((255 * (x/(keyGroup.length-1))));
			keyGroup[x].setAttributeNS(null,"fill","rgb(" + redColor +","+ greenColor + ",0)");
		}
	}
	else if(colorChoice == 1)	{
		for(var x = 0; x < keyGroup.length;x++)	{
			var redColor = Math.round((255 * (x/(keyGroup.length-1))));
			var blueColor =	 Math.round(( 255 - (255 * (x/(keyGroup.length-1)))));
			keyGroup[x].setAttributeNS(null,"fill","rgb("+ redColor + ",0,"+  blueColor+ ")");
		}
	}
}
graphWalker.prototype.updateColors = function (colorChoice) {
	var min = Graph.nodes[0].timesVisited;	//start with live test data for this 
	var max = Graph.nodes[0].timesVisited;
	var midPoint; //currently not used but may be in the future for calculations
	for(var x = 1; x < Graph.numberOfNodes;x++)	{
		if(Graph.nodes[x].timesVisited > max)
			max = Graph.nodes[x].timesVisited;
		else if(Graph.nodes[x].timesVisited < min)
			min = Graph.nodes[x].timesVisited;
	}
	midPoint = (max + min)/2;
	if(max == min){
		if(colorChoice == 0){
			for(var x = 0; x < Graph.numberOfNodes; x++){
				Graph.changeNodeColor(Graph.nodes[x],"rgb(128,0,0)","black");
			}
		}
		else if(colorChoice == 1){
			for(var x = 0; x < Graph.numberOfNodes; x++){
				Graph.changeNodeColor(Graph.nodes[x],"rgb(0,0,255)","white");
			}
		}
	}
	else if(colorChoice == 0)	{
		for(var x = 0; x < Graph.numberOfNodes;x++)
		{
			var redBase = 128;
			var greenBase = 0;
			var nodeRed = Math.round(128 * ((Graph.nodes[x].timesVisited - min) / (max - min)));
			var nodeGreen = Math.round(255 * ((Graph.nodes[x].timesVisited - min) / (max - min)));
			Graph.nodes[x].color = "rgb(" + (redBase + nodeRed) + "," + (greenBase + nodeGreen) + ",0)";
			Graph.changeNodeColor(Graph.nodes[x],Graph.nodes[x].color,"black");
		}
	}//end if
	else if(colorChoice == 1)	{
		var blueBase = 128;
		var redBase = 0;
		for(var x = 0; x < Graph.numberOfNodes;x++)	{
			var blueBase = 255;
			var redBase = 0;
			var nodeBlue = Math.round(255 * ((Graph.nodes[x].timesVisited - min) / (max - min)));
			var nodeRed = Math.round(255 * ((Graph.nodes[x].timesVisited - min) / (max - min)));
			Graph.nodes[x].color = "rgb(" + (redBase + nodeRed) + ",0," + (blueBase - nodeBlue) + ")";
			Graph.changeNodeColor(Graph.nodes[x],Graph.nodes[x].color,"white");
		}
	}
	//set color flag back after global color update
}

graphWalker.prototype.updateSpeed = function (modifier) {
	this.pauseTraversal();
	if (this.userData) {
		this.speed = (5.01 - (5*modifier)) * this.minTravelTime * 10
	}
	else {
		this.speed = 5.01 - (5 * modifier);
	}
	//this.moveTo();
	document.getElementById("graphPlane").unpauseAnimations();
}

graphWalker.prototype.moveTo = function (movementType) {
	var obj = this;
	var animateX = document.createElementNS(xmlns,"animate");
		animateX.setAttributeNS(null,"attributeName","cx");
		animateX.setAttributeNS(null,"attributeType","XML");
		animateX.setAttributeNS(null,"from",this.cx);
		animateX.setAttributeNS(null,"to",this.destinationX);
		animateX.setAttributeNS(null,"begin","Z.click");
		//animateX.setAttributeNS(null, "end", "P.click");
		animateX.setAttributeNS(null,"dur",this.speed);
		animateX.onend = function ()	{
			if (movementType == "random")
				changeDirection(obj);
			else
				specifyDirection(obj);
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
	document.getElementById("graphPlane").pauseAnimations();
}

//Destroys the graph walker's SVG image that is displayed on the screen 
graphWalker.prototype.removeWalker = function () {
	try {
		this.element.parentNode.removeChild(this.element);
	}
	catch (err) {/* Do nothing */}
}
