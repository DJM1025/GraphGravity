
//TO DO'S
//js file for global variables - DOUBT IT ACTUALLY - MAKE THEM ALL AS PART OF THE CLOSURE
//make groups have the attributes and have them inherit? might not be possible because of text
//make a window.onload or something of the sort so that the user can't start clicking before everything is ready - ****THE LOADING BAR***
//use closures for mouse events
//make a mousedown event for the document, not each node
//make a central event handler
//change mouseover to entire group and do target so you dont have to assign and event listener to each node - just like in SVGDropDown Object
//make a style sheet so that i don't need to do 'style.visibility = hidden' for every dropdown menu and other stuff
//order of children layout (nodes, selected, edges, selectedEdges, etc.)
//make sure not to add to history if nothing really happened (i.e a select all when all are selected, or a deselect all when none are selected)...
//add a functionality so when the user selects a node and then shift clicks another node, all nodes inclusive nodes are selected (i.e selected node2 then shift click node7 - nodes 2,3,4,5,6,7 will be selected)
//i took out the branch connect because it seemed to do the same for creating multiple edges, but it is different because the selected nodes stay highlighted
//fix complement - if you do it when nothing is selected the redo/undo gets messed up - fixed i think
//fix the mouseover nodes, you have to do it twice to highlight edges
//TO STOP TEXT HIGHLIGHTING JUST DO 'EVENT.PREVENTDEFAULT' FOR MOUSEMOVE - i just need to figure out where i should do this (root, Graph.plane, window? - which one?)
//I imagine any events bound to the window are not good for library purposes?
//check if you are consistent with mousedown, mousemove, and mouseup, namely should up be root or the object? -- and make sure all your mouseups remove themselves
//mousemoves all on the root?
//add enter key and esc functionality - ok/accept on top most window and close top most window respectively
//add your own 'tabIndex' to nodes
// all worst cases to asure of no bugs - example: user clicks run gravity when there are no nodes created
//prolly should replace all 'click' with 'mouseup'...
//i need to have resize capability - not ON resize but after they mouseup and the window size has changed
//make all the svg libraries into a namespace like jquery or sumthing
//need to have the permutations cached until a new graph is made
//fix all the addToHistory garbage (add/remove in function call params etc.)
//make sure the method is actually doing something if you are adding to history... i.e delete key mash when only the first of the 5 key hits does something
//fix the reptition between clipboard and menu (there's a lot of double liners that could be functions)
//need resize capability for EVERYTHING - nodes/menus/etc.
//right now the keydowns on the import window are affecting the graph (select all, paste, etc) - need added/removed based on what windows are opened/closed
//look into doing minimized windows and such
//or, speaking of above, just remove child and append it again when they reopen the window
//change all mousemoves and mouseups to root ****
//for selection area - the mouseup when you let go triggers the deselect all nodes if you let go of shift...... fix
//definitely css file for styling the graph and windows/etc
//remove stupid findNodeMidpoint function from move node function - i have a method added to the SVGG prototype
//thinking select and deselect shouldnt be recorded in history
//optimize the move if possible
//give everything an id for easier debugging

/*
var timer = null;
document.documentElement.onkeydown = function () {
    if (timer === null) {
        console.log("down");
        timer = setInterval(function(){console.log("held")}, 1000);
    }
    else{
    }
};
document.documentElement.onkeyup = function () {
    if (timer !== null) {
        console.log("release"); 
        clearInterval(timer);
        timer = null;
    }
};
function () {
    if (timer !== null) {
        console.log("release");
        clearInterval(timer);
        timer = null;
    }
}
*/
window.addEventListener("load", function loadGraph() {
    //SVG namespaces;
    xmlns = "http://www.w3.org/2000/svg";
    var xlink = "http://www.w3.org/1999/xlink";
    var svgXmlNs = "http://www.w3.org/2000/xmlns/";

    //make a global.js for root, namespaces, etc.
    var root = document.documentElement;
    parentSVG = document.getElementById("parentSVG");
    //prevent text highlighting
    //this disables the text area in import/export window
    //root.addEventListener("mousedown", function (event) { event.preventDefault(); }, false); //only remove when the import window is open    

    //add drawBoundingRect method to SVGElement prototype (for debugging purposes)
    SVGElement.prototype.drawBoundingRect = function drawBoundingRect() {
        var bounds = this.getBoundingClientRect();
        var boundingRect = document.createElementNS(xmlns, "rect");
        boundingRect.setAttributeNS(null, "x", bounds.left);
        boundingRect.setAttributeNS(null, "y", bounds.top);
        boundingRect.setAttributeNS(null, "width", bounds.width);
        boundingRect.setAttributeNS(null, "height", bounds.height);
        boundingRect.setAttributeNS(null, "fill", "none");
        boundingRect.setAttributeNS(null, "stroke", "blue");
        boundingRect.setAttributeNS(null, "stroke-width", "2");
        this.parentNode.appendChild(boundingRect);
    };

    SVGTextElement.prototype.centerVertically = function centerVertically() {
        /*var elementBounds = this.getBoundingClientRect();
        var parentBounds = this.parentNode.getBoundingClientRect();
        console.log(elementBounds, parentBounds);
        var elementY = parentBounds.top + ((parentBounds.height - elementBounds.height) / 2);
        this.setAttributeNS(null, "y", elementY);*/
    }

    //add findMidPoint method to the SVGGElement prototype
    SVGElement.prototype.findMidpoint = function findMidpoint() {
        var bounds = this.getBoundingClientRect();
        return {
            x: bounds.left + (bounds.width / 2),
            y: bounds.top + (bounds.height / 2)
        };
    };

    //create and return a 2-dimensional array
    function create2DArray(length) {
        var twoDArray = new Array(length);
        for (var index = 0; index < Graph.numberOfNodes; index++) {
            twoDArray[index] = new Array(length);
        }
        return twoDArray;
    };

    //check if object is empty
    function checkEmpty(obj) {
        for (var prop in obj) {
            return true;
        }
        return false;
    }

    window.addEventListener("keydown", function (event) {
        //if (!Graph.multipleSelect && !Graph.rangeSelect && !Graph.autoConnect && !Graph.branchConnect) { <--- prevents using multiple hotkeys at once (but maybe someone would want to branch and auto-connect....)
        //'ctrl' key - select multiple nodes at once
        if (event.keyCode === 17) {
            //change to evt.ctrlKey
            Graph.multipleSelect = true;
        }
            //'t' key - auto connect nodes
        else if (event.keyCode === 84) {
            Graph.autoConnect = true;
        }
            //'r' key - branch from selected node
        else if (event.keyCode === 82) {
            Graph.branchConnect = true;
        }
        //}    
    }, false);

    window.addEventListener("keyup", function (event) {//prolly should be keydown - well the functions calls should prolly be moved to keydown
        //make a default case to call reset? and break the others?
        switch (event.keyCode) {
            case 17: //'ctrl' key
                Graph.multipleSelect = false;
                break;
            case 84: //'t' key
                Graph.autoConnect = false;
                break;
            case 82: //'r' key
                Graph.branchConnect = false;
                break;
            case 46://'delete' key                
                Graph.clipboard.addToHistory("Deleted nodes");
                for (var node in Graph.selectedNodes) {
                    var nextNode = Graph.selectedNodes[node];
                    Graph.deleteNode(nextNode);
                }
                Graph.fixGravityValues();
                Graph.scaleWindow.reset();
                break;
            case 65://'a' key
                Graph.clipboard.addToHistory("Selected all nodes");
                Graph.selectAllNodes();
                Graph.scaleWindow.reset();
                break;
            case 68://'d' key
                Graph.clipboard.addToHistory("Deselected all nodes");
                Graph.deselectAllNodes();
                Graph.scaleWindow.reset();
                break;
            case 67://'c' key
                Graph.clipboard.copy();
                break;
            case 86://'v' key
                Graph.clipboard.addToHistory("Pasted subgraph");
                Graph.clipboard.paste();
                Graph.scaleWindow.reset();
                break;
            case 90://'z' key
                Graph.clipboard.undo();
                Graph.scaleWindow.reset();
                break;
            case 89://'y' key
                Graph.clipboard.redo();
                Graph.scaleWindow.reset();
                break;
            case 88://'x' key
                Graph.clipboard.addToHistory("Extruded subgraph");
                Graph.extrude();
                Graph.scaleWindow.reset();
                break;
            case 73://'i' key
                Graph.clipboard.addToHistory("Complemented subgraph");
                Graph.complement();
                Graph.scaleWindow.reset();
                break;
            case 70://'f' key
                Graph.clipboard.addToHistory("Inverted subgraph");
                Graph.invert();
                Graph.scaleWindow.reset();
                break;
            case 69://'e' key
                Graph.clipboard.addToHistory("Expanded subgraph");
                Graph.expand();
                Graph.scaleWindow.reset();
                break;
        }
    }, false);

    //Graph object (static class) - i would probably just change this to a giant object - this kinda looks dumb with a function out here
    window.Graph = function Graph() {
        throw new Error("Graph is a static class");
    };

    Graph.sortNodePair = function (node1, node2) {
        if (node1.nodeNum < node2.nodeNum) {
            return {
                'lowNode': node1,
                'highNode': node2
            };
        }
        else {
            return {
                'lowNode': node2,
                'highNode': node1
            };
        }
    };

    Graph.fixGravityValues = function () {
        var correctNum = 0;
        for (var node in Graph.nodes) {
            var nextNode = Graph.nodes[node];
            if (nextNode.nodeNum !== correctNum) {
                delete Graph.nodes[nextNode.nodeNum];
                Graph.nodes[correctNum] = nextNode;
                nextNode.nodeNum = nextNode.gravityValue = correctNum;
                nextNode.text.textContent = nextNode.nodeLabel = correctNum + 1;
            }
            correctNum++;
        }

        for (var node in Graph.nodes) {
            var nextNode = Graph.nodes[node];
            for (var adj in nextNode.adjacentNodes) {
                var adjNode = nextNode.adjacentNodes[adj];
                if (adjNode.nodeNum !== adj) {
                    delete nextNode.adjacentNodes[adj];
                    nextNode.adjacentNodes[adjNode.nodeNum] = adjNode;
                    if (nextNode.nodeNum !== Graph.numberOfNodes) {
                        var edge = nextNode.edges[adj];
                        delete nextNode.edges[adj];
                        if (nextNode.nodeNum < adjNode.nodeNum) {
                            nextNode.edges[adjNode.nodeNum] = edge;
                        }
                    }
                }
            }
        }
    };

    //graph global properties
    Graph.disableTextHighlight = function (event) {
        event.preventDefault();
    };
    root.addEventListener("mousedown", Graph.disableTextHighlight, false);
    Graph.nodeWidth = 25;
    Graph.nodeHeight = 20;
    Graph.numberOfNodes = 0;
    Graph.numberOfSelectedNodes = 0;
    Graph.multipleSelect = false; //selecting multiple nodes at once
    Graph.autoConnect = false; //create node connected to all selected nodes(s) - newly created node becomes selected
    Graph.branchConnect = false; //create nodes "branching" off of all selected node(s) - original node(s) remain selected
    Graph.adjacencyMatrix = null;
    //Graph.shortestPaths = null;
    Graph.shortestPathLengths = null;
    Graph.nodes = {};
    Graph.selectedNodes = {};
    Graph.clipboard = (function () {
        var copiedItem = {};
        var historyArray = [50];
        var current = -1;
        var top = -1;

        function captureGraphState() {
            var nodeInfoArray = []
            for (var n = 0; n < Graph.numberOfNodes; n++) {
                var nextNode = Graph.selectedNodes[n] || Graph.nodes[n];
                nodeInfoArray.push({
                    'x': nextNode.X + (Graph.nodeWidth / 2),
                    'y': nextNode.Y + (Graph.nodeHeight / 2),
                    'nodeNum': nextNode.nodeNum,
                    'nodeLabel': nextNode.nodeLabel,
                    'gravityValue': nextNode.gravityValue,
                    'edges': (function (edgeArr) {
                        for (var edge in nextNode.edges) {
                            edgeArr.push(edge);
                        }
                        return edgeArr;
                    })([]),
                    'selected': nextNode.selected
                });
            }
            return nodeInfoArray;
        };

        function redrawGraph(info) {
            var num = Graph.numberOfNodes;
            for (var i = 0; i < num; i++) {
                Graph.deleteNode(Graph.nodes[i] || Graph.selectedNodes[i]);
            }

            for (var n = 0; n < info.length; n++) {
                var nextInfo = info[n];
                Graph.createNode(nextInfo.x, nextInfo.y, nextInfo.gravityValue, nextInfo.nodeLabel);
            }
            for (var m = 0; m < info.length; m++) {
                var nextInfo = info[m];
                var nextNode = Graph.nodes[nextInfo.nodeNum];
                for (var i = 0; i < nextInfo.edges.length; i++) {
                    Graph.createEdge(nextNode, Graph.nodes[nextInfo.edges[i]]);
                }
                if (nextInfo.selected) {
                    Graph.selectNode(nextNode);
                }
            }
        };

        return {
            'copy': function (extrude) {
                if (Graph.numberOfSelectedNodes !== 0) {
                    copiedItem = {};
                    for (var node in Graph.selectedNodes) {
                        var nextNode = Graph.selectedNodes[node];
                        var nodeInfo = {
                            'node': null,
                            'origNum': nextNode.nodeNum,
                            'x': nextNode.X, //might want to add offset here too instead of just doing a trolly 40 point offset below to make up for it
                            'y': nextNode.Y,
                            'edges': (function (array) {
                                for (var edge in nextNode.edges) {
                                    var nextEdge = nextNode.edges[edge];
                                    if (nextEdge.selected) {
                                        array.push(parseInt(edge));
                                    }
                                }
                                return array;
                            })([])
                        };
                        copiedItem[node] = nodeInfo;
                    }
                }
            },

            'paste': function (extrude) {
                var offSetX = extrude ? -40 : 40;
                var offSetY = 40;
                Graph.deselectAllNodes();
                for (var num in copiedItem) {
                    var nextNodeInfo = copiedItem[num];
                    //mouseout isnt trigged so it takes a mouseover/out before the edge highlight triggers
                    var newNode = Graph.createNode((nextNodeInfo.x + offSetX), (nextNodeInfo.y + offSetY));
                    Graph.selectNode(newNode);
                    if (extrude) {
                        Graph.createEdge(Graph.nodes[nextNodeInfo.origNum], newNode);
                    }
                    nextNodeInfo.node = newNode;
                }
                for (var num in copiedItem) {
                    var nextNodeInfo = copiedItem[num];
                    var node1 = nextNodeInfo.node;
                    for (var q = 0; q < nextNodeInfo.edges.length; q++) {
                        var node2 = copiedItem[nextNodeInfo.edges[q]].node;
                        Graph.createEdge(node1, node2);
                    }
                }
                if (extrude) {
                    //dont want to completely clear, just remove the last added by the extrude
                    copiedItem = {};
                }
            },

            'undo': function () {
                if (current !== -1) {
                    var action = historyArray[current--];
                    if (!action.afterInfo) {
                        action.afterInfo = captureGraphState();
                    }
                    redrawGraph(action.beforeInfo);
                }
            },

            'redo': function () {
                if (current !== top) {
                    var action = historyArray[++current];
                    redrawGraph(action.afterInfo);
                }
            },

            'addToHistory': function (actionName) {
                var action = {
                    'actionName': actionName,
                    'beforeInfo': captureGraphState(),
                    'afterInfo': null
                };
                console.log(actionName);
                if (current === top) {
                    historyArray[++current] = action;
                    top++;
                }
                else {
                    historyArray[++current] = action;
                    top = current;
                }
            }
        };
    })();
    //Graph.numberOfLandmarks = 0;
    //Graph.numberOfVantagePoints = 0;
    Graph.deselectOnRelease = false;
    Graph.selectedSingle = false;

    Graph.badGravityReason = null;
    Graph.landmarks = {};
    Graph.vantagePoints = {};
    Graph.gravFlavorings = [];

    //windows
    Graph.topWindow = null;
    Graph.importWindow = LoadImportWindow(parentSVG);
    Graph.exportWindow = null;
    Graph.scaleWindow = (function () {
        var hidden = true;
        var scalePercent;
        var nodeInfo = [];

        var pageWidth = window.innerWidth;
        var pageHeight = window.innerHeight;

        var scaleGroup = document.createElementNS(xmlns, "g");

        var scaleBarX = pageWidth * .42;
        var scaleBarY = pageHeight * .49;
        var scaleBarWidth = pageWidth * .16;
        var scaleBarHeight = pageHeight * .01;
		var scaleBoxX = pageWidth * .4;
		var scaleBoxY = pageHeight * .44;
		var scaleBoxWidth = pageWidth * .22;
		var scaleBoxHeight = pageHeight * .1;

        var percentScale;
		
		var scaleBox = document.createElementNS(xmlns, "rect");
		scaleBox.setAttributeNS(null, "x", scaleBoxX);
		scaleBox.setAttributeNS(null, "y", scaleBoxY);
		scaleBox.setAttributeNS(null, "width", scaleBoxWidth);
		scaleBox.setAttributeNS(null, "height", scaleBoxHeight);
		scaleBox.setAttributeNS(null, "fill", "black");
		scaleBox.setAttributeNS(null, "stroke", "white");
		scaleBox.setAttributeNS(null, "stroke-width", "2");
		scaleBox.setAttributeNS(null, "rx", "2.5");
		
		scaleBox.addEventListener("mousedown", function down(event) {
			Graph.clipboard.addToHistory("relocated Scale Box");
			scaleBox.addEventListener("mousemove", move, false);
			scaleBox.addEventListener("mouseup", function up(){
				scaleBox.removeEventListener("mousemove", move, false);
				scaleBox.removeEventListener("mouseup", up, false);
			}, false);
			
			var initialX = event.pageX;
			var initialY = event.pageY;
			var initialBoxX=scaleBoxX;
			var initialBoxY=scaleBoxY;
			var initialBarX=scaleBarX;
			var initialBarY= scaleBarY;
			var initialSliderX = scaleSliderX;
			var initialSliderY = scaleSliderY;
			function move(event){
				var offsetX = event.pageX - initialX;
				var offsetY = event.pageY - initialY;
				scaleBoxX = initialBoxX + offsetX;
				scaleBoxY = initialBoxY + offsetY;
				scaleBarX = initialBarX + offsetX;
				scaleBarY = initialBarY + offsetY;
				scaleSliderX = initialSliderX + offsetX;
				scaleSliderY = initialSliderY + offsetY;
				
				scaleBox.setAttributeNS(null, "x", scaleBoxX);
				scaleBox.setAttributeNS(null, "y", scaleBoxY);
				scaleBar.setAttributeNS(null, "x", scaleBarX);
				scaleBar.setAttributeNS(null, "y", scaleBarY);
				scaleSlider.setAttributeNS(null, "x", scaleSliderX);
				scaleSlider.setAttributeNS(null, "y", scaleSliderY);
				scaleExit.setAttributeNS(null, "x", scaleBarX+scaleBarWidth);
				scaleExit.setAttributeNS(null, "y", scaleBarY-Graph.nodeHeight);
			}
			
		}, false);
		
		scaleGroup.appendChild(scaleBox);

        var scaleBar = document.createElementNS(xmlns, "rect");
        scaleBar.setAttributeNS(null, "x", scaleBarX);
        scaleBar.setAttributeNS(null, "y", scaleBarY);
        scaleBar.setAttributeNS(null, "width", scaleBarWidth);
        scaleBar.setAttributeNS(null, "height", scaleBarHeight);
        scaleBar.setAttributeNS(null, "fill", "black");
        scaleBar.setAttributeNS(null, "stroke", "white");
        scaleBar.setAttributeNS(null, "stroke-width", "2");
        scaleBar.setAttributeNS(null, "rx", "2.5");
        scaleBar.style.cursor = "pointer";
        scaleGroup.appendChild(scaleBar);

        scaleBar.addEventListener("click", function (event) {
            Graph.clipboard.addToHistory("Scaled nodes");
            scaleSlider.setAttributeNS(null, "x", event.pageX - (scaleSliderWidth / 2));
            percentScale = (((event.pageX - scaleBarX) / scaleBarWidth) - .5) * 2;
            Graph.scaleWindow.scale();
        }, false);

        var scaleSliderY = scaleBarY - (scaleBarHeight * 2);
        var scaleSliderWidth = scaleBarWidth / 20;
        var scaleSliderHeight = scaleBarHeight * 5;
        var scaleSliderX = scaleBarX + (scaleBarWidth / 2) - (scaleSliderWidth / 2);

        var scaleSlider = document.createElementNS(xmlns, "rect");
        scaleSlider.setAttributeNS(null, "x", scaleSliderX);
        scaleSlider.setAttributeNS(null, "y", scaleSliderY);
        scaleSlider.setAttributeNS(null, "width", scaleSliderWidth);
        scaleSlider.setAttributeNS(null, "height", scaleSliderHeight);
        scaleSlider.setAttributeNS(null, "fill", "red");
        scaleSlider.setAttributeNS(null, "stroke", "white");
        scaleSlider.setAttributeNS(null, "stroke-width", "2");
        scaleSlider.setAttributeNS(null, "rx", "2.5");
        scaleSlider.style.cursor = "pointer";
        scaleGroup.appendChild(scaleSlider);
		
		//append exit button
		var scaleExit = document.createElementNS(xmlns, "rect");
		scaleExit.setAttributeNS(null, "x", scaleBarX+scaleBarWidth);
		scaleExit.setAttributeNS(null, "y", scaleBarY-Graph.nodeHeight);
		scaleExit.setAttributeNS(null, "width", Graph.nodeWidth);
		scaleExit.setAttributeNS(null, "height", Graph.nodeHeight);
		scaleExit.setAttributeNS(null, "fill", "red");
		scaleExit.setAttributeNS(null, "stroke", "white");
		scaleExit.setAttributeNS(null, "stroke-width", "2");
		scaleExit.setAttributeNS(null, "rx", "2.5");
        scaleExit.style.cursor = "pointer";
		
		scaleExit.addEventListener("click", function down(event) {
			if (event.which == 1){
				//scaleExit.removeEventListener("click", down, false);
				parentSVG.removeChild(scaleGroup);
				hidden=true;
			}
			}, false);
			
		scaleGroup.appendChild(scaleExit);

        scaleSlider.addEventListener("mousedown", function down(event) {
            var moved = false;
            var offsetX = event.pageX - +scaleSlider.getAttributeNS(null, "x");

            root.addEventListener("mousemove", move, false);
            root.addEventListener("mouseup", function up(event) {
                root.removeEventListener("mousemove", move, false);
                root.removeEventListener("mouseup", up, false);
            }, false);

            function move(event) {
                if (!moved) {
                    Graph.clipboard.addToHistory("Scaled nodes");
                    moved = true;
                }
                if (event.pageX < scaleBarX) {
                    scaleSlider.setAttributeNS(null, "x", scaleBarX - (scaleSliderWidth / 2));
                    percentScale = -1;
                }
                else if (event.pageX > (scaleBarX + scaleBarWidth)) {
                    scaleSlider.setAttributeNS(null, "x", (scaleBarX + scaleBarWidth) - (scaleSliderWidth / 2));
                    percentScale = 1;
                }
                else {
                    scaleSlider.setAttributeNS(null, "x", event.pageX - offsetX);
                    percentScale = (((event.pageX - scaleBarX) / scaleBarWidth) - .5) * 2;
                }
                Graph.scaleWindow.scale();
            }
        }, false);

        parentSVG.appendChild(scaleGroup);

        return {
            'scale': function scale() {
                for (var i = 0; i < Graph.numberOfSelectedNodes; i++) {
                    var nextInfo = nodeInfo[i];
                    var node = Graph.selectedNodes[nextInfo.nodeNum];
                    var xDiff = nextInfo.x;
                    var yDiff = nextInfo.y;
                    var origX = nextInfo.origX;
                    var origY = nextInfo.origY;
                    var origTextX = nextInfo.origTextX;
                    var origTextY = nextInfo.origTextY;
                    node.rect.setAttributeNS(null, "x", node.X = (origX - (xDiff * (percentScale))));
                    node.rect.setAttributeNS(null, "y", node.Y = (origY - (yDiff * (percentScale))));
                    node.text.setAttributeNS(null, "x", node.text.X = (origTextX - (xDiff * (percentScale))));
                    node.text.setAttributeNS(null, "y", node.text.Y = (origTextY - (yDiff * (percentScale))));
                    //because im not moving them with the mouse i may be able to use edges instead of adjnodes
                    var nodeMP = node.findMidpoint();
                    for (var adj in node.adjacentNodes) {
                        var adjNode = node.adjacentNodes[adj];
                        var adjNodeMP = adjNode.findMidpoint();
                        if (node.nodeNum < adjNode.nodeNum) {
                            var nextEdge = node.edges[adj];
                        }
                        else {
                            var nextEdge = adjNode.edges[node.nodeNum];
                        }
                        nextEdge.setAttributeNS(null, "d", "M " + nodeMP.x + " " + nodeMP.y + " " + adjNodeMP.x + " " + adjNodeMP.y);
                    }
                    //need to either make the slider be centered with the mouse of subtract the difference
                }
            },
            'show': function () {
                if (hidden) {
                    parentSVG.appendChild(scaleGroup);
                    this.reset();
                    hidden = false;
                }
            },
            'hide': function () {
                if (!hidden) {
                    parentSVG.removeChild(scaleGroup);
                    hidden = true;
                }
            },
            'reset': function () {
                scaleSlider.setAttributeNS(null, "x", scaleSliderX);
                var nodes = Graph.selectedNodes;
                var midPoint = Graph.selectedNodesGroup.findMidpoint();
                nodeInfo = [];
                for (var node in nodes) {
                    nextNode = nodes[node];
                    nodeInfo.push({
                        'nodeNum': nextNode.nodeNum,
                        'x': midPoint.x - nextNode.X - (Graph.nodeWidth / 2),
                        'y': midPoint.y - nextNode.Y - (Graph.nodeHeight / 2),
                        'origX': nextNode.X,
                        'origY': nextNode.Y,
                        'origTextX': nextNode.text.X,
                        'origTextY': nextNode.text.Y
                    });
                }
            }
        }
    })();
    Graph.panel = null;
    Graph.gravityWindow = null;

    //create the graph plane/background
    Graph.plane = document.createElementNS(xmlns, "svg");
    Graph.plane.id = "graphPlane";
    Graph.plane.setAttributeNS(svgXmlNs, "xmlns", "http://www.w3.org/2000/svg");
    Graph.plane.setAttributeNS(svgXmlNs, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    Graph.plane.setAttributeNS(null, "version", "1.1");
    //Graph.plane.setAttributeNS(null, "zoomAndPan", "disabled");
    Graph.plane.background = document.createElementNS(xmlns, "rect");
    Graph.plane.background.id = "graphBackground";
    Graph.plane.background.setAttributeNS(null, "x", "0");
    Graph.plane.background.setAttributeNS(null, "y", "0");
    Graph.plane.background.setAttributeNS(null, "width", "100%");
    Graph.plane.background.setAttributeNS(null, "height", "100%");
    Graph.plane.background.setAttributeNS(null, "fill", "gray");
    Graph.plane.appendChild(Graph.plane.background);
    parentSVG.appendChild(Graph.plane);

    //draw selection area
    Graph.plane.background.addEventListener("mousedown", function beginSelectionArea(event) {
        if (event.shiftKey) {
            var selectionArea = document.createElementNS(xmlns, "rect");
            selectionArea.setAttributeNS(null, "fill", "white");
            selectionArea.setAttributeNS(null, "fill-opacity", ".5");
            selectionArea.setAttributeNS(null, "stroke", "red");
            selectionArea.setAttributeNS(null, "stroke-width", "2");
            selectionArea.setAttributeNS(null, "stroke-dasharray", "5, 5")
            selectionArea.setAttributeNS(null, "x", event.pageX);
            selectionArea.setAttributeNS(null, "y", event.pageY);
            selectionArea.initialPoint = { x: event.pageX, y: event.pageY };
            Graph.plane.appendChild(selectionArea);

            //might want to make all mousemoves root
            /*Graph.plane*/root.addEventListener("mousemove", expandSelectionArea, false);
            Graph.plane.addEventListener("mouseup", finishSelectionArea, false);

            function expandSelectionArea(event) {
                event.preventDefault();
                if (event.pageX < selectionArea.initialPoint.x) {
                    selectionArea.setAttributeNS(null, "x", event.pageX);
                    selectionArea.setAttributeNS(null, "width", selectionArea.initialPoint.x - event.pageX);
                }
                else {
                    selectionArea.setAttributeNS(null, "width", event.pageX - selectionArea.initialPoint.x);
                }

                if (event.pageY < selectionArea.initialPoint.y) {
                    selectionArea.setAttributeNS(null, "y", event.pageY);
                    selectionArea.setAttributeNS(null, "height", selectionArea.initialPoint.y - event.pageY);
                }
                else {
                    selectionArea.setAttributeNS(null, "height", event.pageY - selectionArea.initialPoint.y);
                }
            }

            function finishSelectionArea() {
                var selectionAreaBBox = selectionArea.getBBox();
                selectionArea.minX = selectionAreaBBox.x;
                selectionArea.maxX = selectionAreaBBox.x + selectionAreaBBox.width;
                selectionArea.minY = selectionAreaBBox.y;
                selectionArea.maxY = selectionAreaBBox.y + selectionAreaBBox.height;

                var found = false;
                for (var node in Graph.nodes) {
                    var nextNode = Graph.nodes[node];
                    var nodeBBox = nextNode.getBBox();
                    var nodeMaxX = nodeBBox.x + nodeBBox.width;
                    var nodeMaxY = nodeBBox.y + nodeBBox.height;
                    if ((nodeMaxX > selectionArea.minX && nodeBBox.x < selectionArea.maxX) && (nodeMaxY > selectionArea.minY && nodeBBox.y < selectionArea.maxY)) {
                        if (!found) {
                            found = true;
                            Graph.clipboard.addToHistory("Selection area used");
                        }
                        if (!nextNode.selected) {
                            Graph.selectNode(nextNode);
                        }
                    }
                }
                if (found) {
                    Graph.scaleWindow.reset();
                }
                selectionArea.parentNode.removeChild(selectionArea);
                /*Graph.plane*/root.removeEventListener("mousemove", expandSelectionArea, false);
                Graph.plane.removeEventListener("mouseup", finishSelectionArea, false);
            }
        }
    }, false);

    Graph.plane.background.addEventListener("mouseup", function (event) {
        Graph.scaleWindow.reset()
        if (Graph.numberOfSelectedNodes === 0 && event.which == 1) {
            Graph.clipboard.addToHistory("Created node");
            var createdNode = Graph.createNode(event.pageX, event.pageY);
            if (Graph.autoConnect || Graph.branchConnect) {
                Graph.selectNode(createdNode);
            }
        }
        else {
            if (Graph.autoConnect) {
                Graph.clipboard.addToHistory("Auto connected");
                var createdNode = Graph.createNode(event.pageX, event.pageY);
                for (var node in Graph.selectedNodes) {
                    var currentNode = Graph.selectedNodes[node];
                    Graph.createEdge(currentNode, createdNode);
                    Graph.deselectNode(currentNode);
                }
                Graph.selectNode(createdNode);

            }
            else if (Graph.branchConnect) {
                Graph.clipboard.addToHistory("Branch connected");
                var createdNode = Graph.createNode(event.pageX, event.pageY);
                for (var node in Graph.selectedNodes) {
                    var currentNode = Graph.selectedNodes[node];
                    Graph.createEdge(currentNode, createdNode);
                }
            }
            else if (!Graph.multipleSelect) {
                Graph.clipboard.addToHistory("Deselec.ed all nodes");
                Graph.deselectAllNodes();
            }
        }
    }, false);

    //create node/edge groups
    Graph.edgesGroup = document.createElementNS(xmlns, "g");
    Graph.edgesGroup.id = "edgesGroup";
    Graph.edgesGroup.setAttributeNS(null, "stroke", "orange");
    //Graph.edgesGroup.setAttributeNS(null, "stroke-width", "2");
    Graph.plane.appendChild(Graph.edgesGroup);
    Graph.nodesGroup = document.createElementNS(xmlns, "g");
    Graph.nodesGroup.id = "nodesGroup";
    Graph.plane.appendChild(Graph.nodesGroup);
    Graph.selectedEdgesGroup = document.createElementNS(xmlns, "g");
    Graph.selectedEdgesGroup.id = "selectedEdgesGroup";
    Graph.selectedEdgesGroup.setAttributeNS(null, "stroke", "yellow");
    Graph.selectedEdgesGroup.setAttributeNS(null, "stroke-width", "2");
    Graph.plane.appendChild(Graph.selectedEdgesGroup);
    Graph.selectedNodesGroup = document.createElementNS(xmlns, "g");
    Graph.selectedNodesGroup.id = "selectedNodesGroup";
    //Graph.nodesGroup.appendChild(Graph.selectedNodesGroup);
    Graph.plane.appendChild(Graph.selectedNodesGroup);

    //create a node
    Graph.createNode = function (x, y, gravityValue, nodeLabel) {
        var nodeGroup = document.createElementNS(xmlns, "g");
        //nodeGroup.midpoint = { x: x, y: y };
        nodeGroup.adjacentNodes = {};
        nodeGroup.selected = false;
        //nodeGroup.nodeNum = nodeGroup.gravityValue = Graph.numberOfNodes++;
        nodeGroup.nodeNum = Graph.numberOfNodes++;
        nodeGroup.gravityValue = gravityValue || Graph.numberOfNodes;
        nodeGroup.edges = {};
		nodeGroup.color = "red";
		nodeGroup.image = "";
		nodeGroup.timesVisited = 0;	//tracks how many times to graphwalker has visited a node
		nodeGroup.edgesList = new Array();
		nodeGroup.edgesVisited = new Array();
		var nodeTextSize = nodeLabel || Graph.numberOfNodes;
		nodeTextSize = "" + nodeTextSize + "";

        var nodeRect = nodeGroup.rect = document.createElementNS(xmlns, "rect");
        nodeRect.setAttributeNS(null, "rx", "2.5");
        nodeRect.setAttributeNS(null, "fill", "red");
        nodeRect.setAttributeNS(null, "stroke", "black");
        nodeRect.setAttributeNS(null, "stroke-width", "2.5");
        nodeRect.setAttributeNS(null, "x", nodeGroup.X = (x - (Graph.nodeWidth / 2)));
        nodeRect.setAttributeNS(null, "y", nodeGroup.Y = (y - (Graph.nodeHeight / 2)));
        nodeRect.setAttributeNS(null, "height", Graph.nodeHeight);
        nodeRect.setAttributeNS(null, "width", Graph.nodeWidth);
        nodeGroup.appendChild(nodeRect);

        var nodeText = nodeGroup.text = document.createElementNS(xmlns, "text");
        nodeText.textContent = nodeGroup.nodeLabel = nodeLabel || Graph.numberOfNodes;
        nodeText.setAttributeNS(null, "pointer-events", "none");
        nodeText.setAttributeNS(null, "text-anchor", "middle");
        nodeText.setAttributeNS(null, "alignment-baseline", "middle");
        nodeText.setAttributeNS(null, "fill", "white");
        nodeText.setAttributeNS(null, "font-family", "Arial");
        nodeText.setAttributeNS(null, "font-size", "12");
        nodeText.setAttributeNS(null, "font-weight", "bold");
        nodeText.setAttributeNS(null, "x", nodeText.X = x);
        nodeText.setAttributeNS(null, "y", nodeText.Y = y);
        nodeGroup.appendChild(nodeText);

        Graph.nodes[nodeGroup.nodeNum] = Graph.nodesGroup.appendChild(nodeGroup);

        nodeGroup.addEventListener("mouseout", function activateNodeHover() {
            nodeGroup.removeEventListener("mouseout", activateNodeHover, false);
            /*nodeGroup.addEventListener("mouseover", Graph.highlightEdges, false);
            nodeGroup.addEventListener("mouseout", Graph.highlightEdges, false);*/
        }, false)

        nodeGroup.addEventListener("mousedown", Graph.pressHoldNode, false);
        return nodeGroup;
    }

	//overloaded function for import creation
	Graph.createImportedNode = function( node) {
		var nodeGroup = document.createElementNS(xmlns, "g");
        //nodeGroup.midpoint = { x: x, y: y };
        nodeGroup.adjacentNodes = {};
        nodeGroup.selected = false;
        nodeGroup.nodeNum = Graph.numberOfNodes++;
		nodeGroup.gravityValue = node.gravityValue;
        nodeGroup.edges = {};
		nodeGroup.color = node.color;
		nodeGroup.image = node.image;
		nodeGroup.timesVisited = 0;
		nodeGroup.edgesList = node.edges;
		nodeGroup.edgesVisited = new Array();
		var nodeTextSize = node.label
		nodeTextSize = "" + nodeTextSize + "";

        var nodeRect = nodeGroup.rect = document.createElementNS(xmlns, "rect");
        nodeRect.setAttributeNS(null, "rx", "2.5");
        nodeRect.setAttributeNS(null, "fill", node.color);
        nodeRect.setAttributeNS(null, "stroke", "black");
        nodeRect.setAttributeNS(null, "stroke-width", "2.5");
        nodeRect.setAttributeNS(null, "x", nodeGroup.X = (node.X));
        nodeRect.setAttributeNS(null, "y", nodeGroup.Y = (node.Y));
        nodeRect.setAttributeNS(null, "height", Graph.nodeHeight);
        //nodeRect.setAttributeNS(null, "width", Graph.nodeWidth);
		nodeRect.setAttributeNS(null, "width", nodeTextSize.length * 5 + 20);
        nodeGroup.appendChild(nodeRect);

        var nodeText = nodeGroup.text = document.createElementNS(xmlns, "text");
        nodeText.textContent = nodeGroup.nodeLabel = node.label;
        nodeText.setAttributeNS(null, "pointer-events", "none");
        nodeText.setAttributeNS(null, "text-anchor", "middle");
        nodeText.setAttributeNS(null, "alignment-baseline", "middle");
        nodeText.setAttributeNS(null, "fill", "black");
        nodeText.setAttributeNS(null, "font-family", "Arial");
        nodeText.setAttributeNS(null, "font-size", "12");
        nodeText.setAttributeNS(null, "font-weight", "bold");
        nodeText.setAttributeNS(null, "x", nodeText.X = (node.X + (nodeTextSize.length * 2.5 + 10)));
        nodeText.setAttributeNS(null, "y", nodeText.Y = (node.Y + Graph.nodeHeight / 2));
        nodeGroup.appendChild(nodeText);

        Graph.nodes[nodeGroup.nodeNum] = Graph.nodesGroup.appendChild(nodeGroup);

        nodeGroup.addEventListener("mouseout", function activateNodeHover() {
            nodeGroup.removeEventListener("mouseout", activateNodeHover, false);
            /*nodeGroup.addEventListener("mouseover", Graph.highlightEdges, false);
            nodeGroup.addEventListener("mouseout", Graph.highlightEdges, false);*/
        }, false)

        nodeGroup.addEventListener("mousedown", Graph.pressHoldNode, false);
        return nodeGroup;
	
	};
	
	Graph.connectNodes = function(addToHistory, edgesList) 
	{	
		for(var x = 0; x < Graph.numberOfNodes;x++)
		{
			for(var y = 0; y < Graph.nodes[x].edgesList.length;y++)
			{
				var node1 = Graph.nodes[x];
				var node2 = Graph.nodes[Graph.nodes[x].edgesList[y]];
				if(node2.nodeNum > x)
				{
					var pair = Graph.sortNodePair(node1,node2);
					var lowNode = pair.lowNode;
					var highNode = pair.highNode;
					var lowNodeMP = lowNode.findMidpoint();
					var highNodeMP = highNode.findMidpoint();
					var edge = document.createElementNS(xmlns, "path");
					edge.selected = false; //edge.parentNode === selectedEdgesGroup?
					edge.setAttributeNS(null, "d", "M " + (lowNodeMP.x) + " " + (lowNodeMP.y) + " " + highNodeMP.x + " " + highNodeMP.y);
					edge.setAttributeNS(null, "id", node1.nodeNum+"-"+node2.nodeNum);
					edge.setAttributeNS(null, "stroke-width", "2");
					Graph.edgesGroup.appendChild(edge);
				
					if (node1.selected && node2.selected) {
						Graph.selectEdge(edge);
					}
		
					lowNode.edges[highNode.nodeNum] = edge;
					node1.adjacentNodes[node2.nodeNum] = node2;
					node2.adjacentNodes[node1.nodeNum] = node1;

					if (addToHistory) {
					Graph.clipboard.addToHistory({
						'name': "Connected/Disconnected nodes",
						'edgesList': edgesList
						});
					}
					
					node1.edgesVisited.push(0);
					node2.edgesVisited.push(0);
				}//end if
				
			}//end for y
		}//end for x
	};

    //delete a node
    Graph.deleteNode = function (node) {
        for (var adj in node.adjacentNodes) {
            var adjNode = node.adjacentNodes[adj];
            Graph.deleteEdge(adjNode, node);
        }
        if (node.selected) {
            delete Graph.selectedNodes[node.nodeNum];
            Graph.numberOfSelectedNodes--;
        }
        else {
            delete Graph.nodes[node.nodeNum];
        }
        node.parentNode.removeChild(node);
        Graph.numberOfNodes--;

    };

    //mousedown on a node
    Graph.pressHoldNode = function (event) {
        var nodeGroup = event.currentTarget;
        if (Graph.numberOfSelectedNodes === 0) {
            Graph.clipboard.addToHistory("Selected node");
            Graph.selectNode(nodeGroup);
            Graph.selectedSingle = true;
            Graph.deselectOnRelease = false;
            Graph.scaleWindow.reset();
        }
        else {
            if (Graph.multipleSelect) {
                if (nodeGroup.selected) {
                    Graph.clipboard.addToHistory("Deselected node");
                    Graph.deselectNode(nodeGroup);
                    Graph.deselectOnRelease = false;
                }
                else {
                    Graph.clipboard.addToHistory("Selected node");
                    Graph.selectNode(nodeGroup);
                    Graph.deselectOnRelease = false;
                }
                Graph.scaleWindow.reset();
            }
            else {
                if (!nodeGroup.selected) {
                    Graph.clipboard.addToHistory("Connected/Disconnected nodes");
                    for (var node in Graph.selectedNodes) {
                        var currentNode = Graph.selectedNodes[node];
                        if (!nodeGroup.adjacentNodes[currentNode.nodeNum]) {
                            Graph.createEdge(nodeGroup, currentNode);
                        }
                        else {
                            Graph.deleteEdge(nodeGroup, currentNode);
                        }
                        if (!Graph.branchConnect) {
                            Graph.deselectNode(currentNode);
                        }
                    }
                    if (Graph.autoConnect) {
                        Graph.deselectOnRelease = false;
                    }
                    else {
                        Graph.deselectOnRelease = true;
                    }
                    Graph.selectNode(nodeGroup);
                    Graph.scaleWindow.reset();
                }
                else {
                    Graph.deselectOnRelease = false;
                }
            }
        }

        var initialCoords = {};
        for (var node in Graph.selectedNodes) {
            var nextNode = Graph.selectedNodes[node];
            var nextText = nextNode.text;
            initialCoords[node] = { 'x': nextNode.X, 'y': nextNode.Y, 'tx': nextText.X, 'ty': nextText.Y };
        }
        var nodeRect = nodeGroup.rect;
        var nodeText = nodeGroup.text;
        var initialX = event.pageX;
        var initialY = event.pageY;
        var rectXOffset = initialX - nodeGroup.X;
        var rectYOffset = initialY - nodeGroup.Y;
        var textXOffset = initialX - nodeText.X;
        var textYOffset = initialY - nodeText.Y;

        function findNodeMidpoint(node) {
            return {
                'x': node.X + (Graph.nodeWidth / 2),
                'y': node.Y + (Graph.nodeHeight / 2)
            };
        }
        //maybe on root?
        var firstMove = true;
        /*Graph.plane*/root.addEventListener("mousemove", moveNode, false);

        function moveNode(event) {
            if (firstMove) {
                Graph.clipboard.addToHistory("Moved nodes");
                firstMove = false;
            }
            nodeRect.setAttributeNS(null, "x", nodeGroup.X = event.pageX - rectXOffset);
            nodeRect.setAttributeNS(null, "y", nodeGroup.Y = event.pageY - rectYOffset);
            nodeText.setAttributeNS(null, "x", nodeText.X = event.pageX - textXOffset);
            nodeText.setAttributeNS(null, "y", nodeText.Y = event.pageY - textYOffset);
            if (nodeGroup.selected) {
                if (Graph.selectedSingle) {
                    Graph.deselectOnRelease = true;
                }
                var changeX = nodeGroup.X - initialX;
                var changeY = nodeGroup.Y - initialY;
                for (var node in Graph.selectedNodes) {
                    var nextNode = Graph.selectedNodes[node];
                    if (nextNode !== nodeGroup) {
                        var nextRect = nextNode.rect;
                        var nextText = nextNode.text;
                        var coords = initialCoords[node]
                        nextRect.setAttributeNS(null, "x", nextNode.X = coords.x + changeX + rectXOffset);
                        nextRect.setAttributeNS(null, "y", nextNode.Y = coords.y + changeY + rectYOffset);
                        nextText.setAttributeNS(null, "x", nextText.X = coords.tx + changeX + rectXOffset);// + (Graph.nodeWidth / 2));
                        nextText.setAttributeNS(null, "y", nextText.Y = coords.ty + changeY + rectYOffset);// + (Graph.nodeHeight / 2));

                    }
                    var nextNodeMP = findNodeMidpoint(nextNode);

                    for (var adj in nextNode.adjacentNodes) {
                        var adjNode = nextNode.adjacentNodes[adj];
                        var adjNodeMP = findNodeMidpoint(adjNode);
                        if (nextNode.nodeNum < adjNode.nodeNum) {
                            var nextEdge = nextNode.edges[adj];
                        }
                        else {
                            var nextEdge = adjNode.edges[nextNode.nodeNum];
                        }
                        nextEdge.setAttributeNS(null, "d", "M " + nextNodeMP.x + " " + nextNodeMP.y + " " + adjNodeMP.x + " " + adjNodeMP.y);
                    }
                }
            }
            else {
                var nodeGroupMP = findNodeMidpoint(nodeGroup);
                for (var adj in nodeGroup.adjacentNodes) {
                    var adjNode = nodeGroup.adjacentNodes[adj];
                    var adjNodeMP = findNodeMidpoint(adjNode);
                    if (nodeGroup.nodeNum < adjNode.nodeNum) {
                        var nextEdge = nodeGroup.edges[adj];
                    }
                    else {
                        var nextEdge = adjNode.edges[nodeGroup.nodeNum];
                    }
                    nextEdge.setAttributeNS(null, "d", "M " + nodeGroupMP.x + " " + nodeGroupMP.y + " " + adjNodeMP.x + " " + adjNodeMP.y);
                }
            }
        }

        Graph.plane.addEventListener("mouseup", function release() {
            if (Graph.deselectOnRelease) {
                Graph.deselectNode(nodeGroup);
                Graph.deselectOnRelease = false;
            }
            Graph.selectedSingle = false;
            if (!firstMove) {
                Graph.scaleWindow.reset();
            }
            /*Graph.plane*/root.removeEventListener("mousemove", moveNode, false);
            Graph.plane.removeEventListener("mouseup", release, false);
        }, false);
    };

    //select a node
    Graph.selectNode = function (node) {
        Graph.changeNodeColor(node, "white", "red");
        delete Graph.nodes[node.nodeNum];
        Graph.selectedNodes[node.nodeNum] = node;
        Graph.selectedNodesGroup.appendChild(node);
        node.selected = true;
        Graph.numberOfSelectedNodes++;
        for (var adj in node.adjacentNodes) {
            var adjNode = node.adjacentNodes[adj];
            if (adjNode.selected) {
                if (adjNode.nodeNum < node.nodeNum) {
                    Graph.selectEdge(adjNode.edges[node.nodeNum]);
                }
                else {
                    Graph.selectEdge(node.edges[adjNode.nodeNum]);
                }
            }
        }
    };

    //deselect a node
    Graph.deselectNode = function (node) {
        Graph.changeNodeColor(node, node.color, "black");
        delete Graph.selectedNodes[node.nodeNum];
        Graph.nodes[node.nodeNum] = node;
        Graph.nodesGroup.appendChild(node);
        node.selected = false;
        Graph.numberOfSelectedNodes--;
        for (var adj in node.adjacentNodes) {
            var adjNode = node.adjacentNodes[adj];
            if (adjNode.selected) {
                if (adjNode.nodeNum < node.nodeNum) {
                    Graph.deselectEdge(adjNode.edges[node.nodeNum]);
                }
                else {
                    Graph.deselectEdge(node.edges[adjNode.nodeNum]);
                }
            }
        }
    };

    //select all nodes
    Graph.selectAllNodes = function () {
        for (var node in Graph.nodes) {
            Graph.selectNode(Graph.nodes[node]);
        }
    };

    //deselect all nodes
    Graph.deselectAllNodes = function () {
        for (var node in Graph.selectedNodes) {
            Graph.deselectNode(Graph.selectedNodes[node]);
        }
    };

    //change color/text of a node
    Graph.changeNodeColor = function (nodeGroup, rectFill, textFill) {
        var nodeRect = nodeGroup.firstElementChild;
        var nodeText = nodeRect.nextElementSibling;
        nodeRect.setAttributeNS(null, "fill", rectFill);
        nodeText.setAttributeNS(null, "fill", textFill);
    };

    //invert selected/deselected nodes
    Graph.invert = function () {
        var length = Graph.numberOfNodes;
        for (var n = 0; n < length; n++) {
            if (Graph.nodes[n]) {
                var node = Graph.nodes[n];
                Graph.selectNode(node)
            }
            else {
                var node = Graph.selectedNodes[n];
                Graph.deselectNode(node);
            }

        }
    };

    //expand
    Graph.expand = function () {
        var expandList = {};
        for (var node in Graph.selectedNodes) {
            var nextNode = Graph.selectedNodes[node];
            for (var adj in nextNode.adjacentNodes) {
                var adjNode = nextNode.adjacentNodes[adj];
                if (!adjNode.selected) {
                    expandList[adj] = adj;
                }
            }
        }

        for (var node in expandList) {
            Graph.selectNode(Graph.nodes[expandList[node]]);
        }
    };

    //create an edge between two nodes
    Graph.createEdge = function (node1, node2) {
        var pair = Graph.sortNodePair(node1, node2);
        var lowNode = pair.lowNode;
        var highNode = pair.highNode;

        var lowNodeMP = lowNode.findMidpoint();
        var highNodeMP = highNode.findMidpoint();
        var edge = document.createElementNS(xmlns, "path");
        edge.selected = false; //edge.parentNode === selectedEdgesGroup?
        edge.setAttributeNS(null, "d", "M " + lowNodeMP.x + " " + lowNodeMP.y + " " + highNodeMP.x + " " + highNodeMP.y);
		edge.setAttributeNS(null,"id", "" + node1.nodeNum + "-" + node2.nodeNum + "");
		edge.setAttributeNS(null,"stroke-width",2);
        Graph.edgesGroup.appendChild(edge);
        if (node1.selected && node2.selected) {
            Graph.selectEdge(edge);
        }
		
		node1.edgesList.push(node2.nodeNum);
		node1.edgesVisited.push(0);
		node2.edgesList.push(node1.nodeNum);
		node2.edgesVisited.push(0);
		
		
        lowNode.edges[highNode.nodeNum] = edge;
        node1.adjacentNodes[node2.nodeNum] = node2;
        node2.adjacentNodes[node1.nodeNum] = node1;

    };

    //delete an edge between two nodes
    Graph.deleteEdge = function (node1, node2) {
        var pair = Graph.sortNodePair(node1, node2);
        var lowNode = pair.lowNode;
        var highNode = pair.highNode;

        var edge = lowNode.edges[highNode.nodeNum];
        edge.parentNode.removeChild(edge);
        delete lowNode.edges[highNode.nodeNum];
		
		for(var x = 0; x < node1.edgesList.length; x++)
		{
			if(node1.edgesList[x] == node2.nodeNum)
				node1.edgesList.splice(x,1);
		}
		
		for(var y = 0; y < node2.edgesList.length; y++)
		{
			if(node2.edgesList[y] == node1.nodeNum)
				node2.edgesList.splice(y,1);
		}

		
		delete node1.edgesList[node2.nodeNum];
		delete node2.edgesList[node1.nodeNum];

        delete node1.adjacentNodes[node2.nodeNum];
        delete node2.adjacentNodes[node1.nodeNum];
    };

    //select an edge (for clipboard purposes)
    Graph.selectEdge = function (edge) {
        edge.selected = true;
        Graph.selectedEdgesGroup.appendChild(edge);
    };

    //deselect an edge (for clipboard purposes)
    Graph.deselectEdge = function (edge) {
        edge.selected = false;
        Graph.edgesGroup.appendChild(edge);
    };

    Graph.highlightEdges = function (event) {
        var node = event.currentTarget;

        for (var adj in node.adjacentNodes) {
            var adjNode = node.adjacentNodes[adj];
            if (adjNode.nodeNum < node.nodeNum) {
                var edge = adjNode.edges[node.nodeNum];
            }
            else {
                var edge = node.edges[adjNode.nodeNum];
            }

            if (event.type == "mouseover") {
                var nodeOpacity = .75;
                edge.setAttributeNS(null, "stroke", "purple");
            }
            else {
                var nodeOpacity = 1;
                edge.removeAttributeNS(null, "stroke");
            }
        }
        node.setAttributeNS(null, "fill-opacity", nodeOpacity);

    };

    //extrude - 
    Graph.extrude = function () {
        //THE EXTRUDE COPY NEEDS TO GO THE THE CLIPBOARD THEN BE TAKEN AWAY BECAUSE WE DONT WANT TO OVERWRITE WHAT THE USER HAD COPIED ON THE CLIPBOARD
        Graph.clipboard.copy(true);
        Graph.clipboard.paste(true);
    };


    //scale -
    Graph.scale = function () {
        Graph.scaleWindow.show();
    }

    //complement - removes original edges, and creates new edges between it and nodes it was not originally adjacent to
    Graph.complement = function () {
        if (Graph.numberOfSelectedNodes == 0) {
            Graph.selectAllNodes();
        }

        for (var node in Graph.selectedNodes) {
            var nextNode = Graph.selectedNodes[node];
            for (var adj in Graph.selectedNodes) {
                var adjNode = Graph.selectedNodes[adj];
                if (nextNode.nodeNum < adjNode.nodeNum) {
                    if (nextNode.edges[adj]) {
                        Graph.deleteEdge(nextNode, adjNode);
                    }
                    else {
                        Graph.createEdge(nextNode, adjNode);
                    }
                }
            }
        }
    };

    //calculate the adj matrix of the graph(subgraph)
    Graph.calculateAdjMatrix = function () {
        Graph.adjacencyMatrix = create2DArray(Graph.numberOfSelectedNodes);

        for (var node in Graph.selectedNodes) {
            var nextNode = Graph.selectedNodes[node];
            for (var adj in Graph.selectedNodes) {
                var adjNode = Graph.selectedNodes[adj];
                if (node < adj) {
                    if (nextNode.adjacentNodes[adj]) {
                        Graph.adjacencyMatrix[node][adj] = true;
                        Graph.adjacencyMatrix[adj][node] = true;
                    }
                    else {
                        Graph.adjacencyMatrix[node][adj] = false;
                        Graph.adjacencyMatrix[adj][node] = false;
                    }
                }
            }
        }
    };

    Graph.findShortestPaths = function () {
        Graph.calculateAdjMatrix();
        Graph.shortestPathLengths = create2DArray(Graph.numberOfSelectedNodes);
        for (var src = 0; src < Graph.numberOfSelectedNodes; src++) {
            for (var dest = 0; dest < Graph.numberOfSelectedNodes; dest++) {
                if (Graph.adjacencyMatrix[src][dest] == 0) {
                    Graph.shortestPathLengths[src][dest] = Infinity;
                }
                else {
                    Graph.shortestPathLengths[src][dest] = 1;
                }
            }
            Graph.shortestPathLengths[src][src] = 0;
        }

        for (var mid = 0; mid < Graph.numberOfSelectedNodes; mid++) {
            for (var src = 0; src < Graph.numberOfSelectedNodes; src++) {
                for (var dest = 0; dest < Graph.numberOfSelectedNodes; dest++) {
                    if (src === mid || mid === dest || src === dest) {
                        continue;
                    }
                    else if ((Graph.shortestPathLengths[src][mid] + Graph.shortestPathLengths[mid][dest]) < Graph.shortestPathLengths[src][dest]) {
                        Graph.shortestPathLengths[src][dest] = (Graph.shortestPathLengths[src][mid] + Graph.shortestPathLengths[mid][dest]);
                    }
                }
            }
        }
    };

    Graph.checkFlavoring = function() { 
        var currentNode;
        for(var src = 0; src < Graph.numberOfNodes; src++){
            //Start Node = Graph.nodes[i] -- Graph.nodes[i].edgesList
            for(var dest = 0; dest < Graph.numberofNodes; dest++){
                if(src == dest)
                    continue;
            }
        }
            
    };

    Graph.checkCurrentFlavoring = function () {
        //do a warning here instead
        if (Graph.numberOfSelectedNodes === 0) {
            Graph.selectAllNodes();
            //SVGMsgBox(parentSVG, "No nodes are selected!  Would you like to check the current flavoring with all nodes selected?", Graph.selectAllNodes);
        }
        Graph.findShortestPaths();

        if (Graph.runGravity(true)) {
            var msgBoxOptions = {
                'msgType': SVGMsgBox.MsgType.Accept,
                'msg': "Graph is gravitational!",
                'acceptCallback': false,
                'acceptButtonText': "OK",
                'declineCallBack': false,
                'declineButtonText': false
            };
            SVGMsgBox(parentSVG, msgBoxOptions);
        }
        else {
            var msgBoxOptions = {
                'msgType': SVGMsgBox.MsgType.Error,
                'msg': Graph.badGravityReason + " Would you like to check other permutations?",
                'acceptCallback': Graph.findGravFlavoring,
                'acceptButtonText': "Yes",
                'declineCallBack': false,
                'declineButtonText': "No"
            };
            SVGMsgBox(parentSVG, msgBoxOptions);
        }

    };

    //RUN GRAVITY
    Graph.runGravity = function (firstTime) {
        var nodes = Graph.selectedNodes;
        var landmarks = {};
        var vantagePoints = {};
        /*for (var node in nodes) {
            landmarks[node] = vantagePoints[node] = nodes[node];
        }*/
        //look into where you go already have the gravity path and dont need to come back to it -REMEMBER PAST GRAVITY AND NON-GRAVITY PATHS so i do not need to keep re-traversing within the same flavoring
        //say you are going from 1-->2 and you find 1-->3 on the way - i dont need to actually calculate that for the next src/dest combo - i have it already
        //this probably doesnt work at all because the choices will change based on the dest but just a thought that it may possible work in some situations
        var gravFlavoring = true;

        for (var src = 0; src < Graph.numberOfSelectedNodes; src++) {
            for (var dest = 0; dest < Graph.numberOfSelectedNodes; dest++) {
                if (src === dest || Graph.adjacencyMatrix[src][dest] === true) {
                    continue;
                }
                var currentNode = nodes[src];
                var destNode = nodes[dest];
                var prevVertexes = [];
                var returnNodeStack = [];
                //var equidistantPaths = [];
                prevVertexes[src] = true;
                var currentPath = "";
                var currentPathLength = 0;
                //var currentPath = [];
                while (true) {
                    var adjNodes = currentNode.adjacentNodes;
                    var bestGravDist = Infinity;
                    var bestGravChoice;
                    var eqChoice;
                    var equidistanceProblem = false;
                    for (var adjNodeNum in adjNodes) {
                        var adjNode = adjNodes[adjNodeNum];
                        if (adjNode.selected) {
                            if (!prevVertexes[adjNodeNum]) {
                                var gravDist = Math.abs(destNode.gravityValue - adjNode.gravityValue);
                                if (gravDist < bestGravDist) {
                                    equidistanceProblem = false;
                                    bestGravDist = gravDist;
                                    bestGravChoice = adjNode;
                                }
                                else if (gravDist === bestGravDist) {
                                    equidistanceProblem = true;
                                    eqChoice = adjNode;
                                }
                            }
                        }
                    }
                    if (bestGravDist === Infinity) {
                        if (firstTime) {
                            Graph.badGravityReason = "Current flavoring is not gravitational - in traveling from node " + nodes[src].nodeLabel + " to " + destNode.nodeLabel + " a dead end is hit!";
                        }
                        //delete landmarks[dest];
                        //delete vantagePoints[src];
                        gravFlavoring = false;
                        //break;
                        return false;
                    }
                    if (equidistanceProblem) {
                        returnNodeStack.push({
                            'nodeNum': eqChoice.nodeNum,
                            'pathTo': (currentPath === "" ? eqChoice.nodeNum.toString() : (currentPath + "," + eqChoice.nodeNum.toString()))
                        });
                    }
                    currentPath += currentPath === "" ? bestGravChoice.nodeNum.toString() : ("," + bestGravChoice.nodeNum.toString());
                    currentPathLength++;
                    if (Graph.adjacencyMatrix[bestGravChoice.nodeNum][dest] === true || bestGravChoice.nodeNum === dest) {
                        if (bestGravChoice.nodeNum !== dest) {
                            currentPath += "," + dest;
                            currentPathLength++;
                        }

                        if (Graph.shortestPathLengths[src][dest] !== currentPathLength) {
                            Graph.badGravityReason = "Current flavoring is not gravitational - the gravity path from " + nodes[src].nodeLabel + " to " + destNode.nodeLabel + " is of length " + currentPathLength + ", and the shortest path length is " + Graph.shortestPathLengths[src][dest] + "!"
                            //delete landmarks[dest];
                            //delete vantagePoints[src];
                            gravFlavoring = false;
                            //break;
                            return false;

                        }
                        else if (returnNodeStack.length !== 0) {
                            //equidistantPaths.push(currentPath);
                            nextInQueue = returnNodeStack.pop();
                            currentNode = nodes[nextInQueue.nodeNum];
                            currentPath = nextInQueue.pathTo;
                            prevVertexes = [];
                            prevVertexes[src] = true;
                            var currentPathNodes = currentPath.split(",");
                            currentPathLength = currentPathNodes.length;
                            for (var n = 0; n < currentPathLength; n++) {
                                prevVertexes[currentPathNodes[n]] = true;
                            }
                        }
                        else {
                            break;
                        }
                    }
                    else {
                        currentNode = nodes[bestGravChoice.nodeNum];
                        prevVertexes[currentNode.nodeNum] = true;
                    }
                }
            }
        }

        if (gravFlavoring) {
            //show green message
            return true;
        }
        else {
            //show error message and ask if they want to to find additional flavorings
            return false;
        }

        //make this separate
        /*(function () {
            for (var lm in landmarks) {
                var nextLM = landmarks[lm].rect;
                if (vantagePoints[lm]) {
                    nextLM.setAttributeNS(null, "stroke", "purple");
                    nextLM.setAttributeNS(null, "stroke-width", "5");
                    delete vantagePoints[lm];
                }
                else {
                    nextLM.setAttributeNS(null, "stroke", "red");
                    nextLM.setAttributeNS(null, "stroke-width", "5");
                }
            }
            for (var vp in vantagePoints) {
                var nextVP = vantagePoints[vp].rect;
                nextVP.setAttributeNS(null, "stroke", "blue");
                nextVP.setAttributeNS(null, "stroke-width", "5");
            }
        })();
        return true;*/
    };

    Graph.findGravFlavoring = function findGravFlavoring() {
        function permute(level) {
            if (level === numNodes) {
                if (Graph.runGravity()) {
                    var current = Graph.gravFlavorings.push(gravValues) - 1;
                    if (current !== 0) {
                        var currentFlavoring = Graph.gravFlavorings[current];
                        var previousFlavoring = Graph.gravFlavorings[current - 1];
                        for (var i = 0; i < numNodes; i++) {
                            if (currentFlavoring[i] === undefined) {
                                currentFlavoring[i] = previousFlavoring[i];
                            }
                        }
                    }
                    gravValues = new Array(numNodes);
                }
                return;
            }
            for (var i = 0; i < numNodes; ++i) {
                if (used[i]) continue;
                gravValues[indexLoc] = initial[i];
                Graph.selectedNodes[indexLoc].gravityValue = initial[i];
                indexLoc++;
                used[i] = true;
                permute(level + 1);
                used[i] = false;
                indexLoc--
            }
        }//end function permute
        var indexLoc = 0;
        var numNodes = Graph.numberOfSelectedNodes;
        var used = new Array(numNodes);
        var initial = [];
        var gravValues = new Array(numNodes);
        for (var i = 0; i < numNodes; i++) {
            initial[i] = i;
        }

        permute(0);

        console.log(Graph.gravFlavorings);

        if (Graph.gravFlavorings.length === 0) {
            var msgBoxOptions = {
                'msgType': SVGMsgBox.MsgType.Info,
                'msg': "Sorry, there were no gravitational permutations found for this graph.",
                'acceptCallback': false,
                'acceptButtonText': "OK",
                'declineCallBack': false,
                'declineButtonText': false
            };
            //SVGMsgBox(parentSVG, SVGMsgBox.MsgType.Info, "Sorry, there were no gravitational permutations found for this graph.");
            SVGMsgBox(parentSVG, msgBoxOptions);
        }
        else {
            function showPermutation(num) {
                var chosenFlavoring = Graph.gravFlavorings[num];
                for (var i = 0; i < numNodes; i++) {
                    var nextNode = Graph.selectedNodes[i];
                    nextNode.gravityValue = chosenFlavoring[i];
                    nextNode.nodeLabel = nextNode.text.textContent = chosenFlavoring[i] + 1;
                }
            }

            var msgBoxOptions = {
                'msgType': SVGMsgBox.MsgType.Info,
                'msg': "There were " + Graph.gravFlavorings.length + " gravitational permutations found for this graph! One possible permutation is being displayed.",
                'acceptCallback': false,
                'acceptButtonText': "OK",
                'declineCallBack': false,
                'declineButtonText': false
            };
            //SVGMsgBox(parentSVG, SVGMsgBox.MsgType.Info, "There were " + Graph.gravFlavorings.length + " gravitational permutations found for this graph! One possible permutation is being displayed.");
            SVGMsgBox(parentSVG, msgBoxOptions);
            var currentPermNum = 0;
            showPermutation(currentPermNum);

            //this event listener needs to be removed at some point
            window.addEventListener("keydown", function () {
                if (event.keyCode === 37) {
                    if (currentPermNum === 0) {
                        currentPermNum = Graph.gravFlavorings.length - 1;
                    }
                    else {
                        currentPermNum--;
                    }
                }
                else if (event.keyCode === 39) {
                    if (currentPermNum === Graph.gravFlavorings.length - 1) {
                        currentPermNum = 0;
                    }
                    else {
                        currentPermNum++;
                    }
                }
                showPermutation(currentPermNum);
            }, false);

        }
    };

    Graph.import = function (openTab) {
        Graph.importWindow.open(openTab);
    };

    Graph.export = function () {
		exportClipboard();
    };

    Graph.cutPoints = function () {
    };

    Graph.dominate = function () {
    };

    Graph.shortestPath - function () {
    };

    Graph.viewPanel = function () {
    };

    Graph.viewHistory = function () {
    };

    Graph.viewSpreadsheet = function () {
    };

    Graph.viewHelp = function () {
    };

    Graph.findLandmarks = function () {
    };

    Graph.findVantagePoints = function () {
    }

    Graph.gravityOptions = function () {
    };

	
	Graph.createRandomGraph = function () {
		
		var pageWidth = window.innerWidth;
		var pageHeight = window.innerHeight;
		var numNodes = prompt("How many nodes?"); //using prompt is just an easy way to get the info for now
		var numEdges = prompt("How many edges?");
		var rand1, rand2;
		while((numEdges > numNodes*(numNodes - 1)/2)){
			numEdges = prompt("Too many edges for this graph! Try again!");
		}
		for(var i = 1; i <= numNodes; i++){
			Graph.createNode(Math.floor((Math.random()* (pageWidth - 100)) + 50),Math.floor((Math.random() * (pageHeight- 100)) + 50),i,i);
		}
		//First method to generate random edges.
		for(var i = 0; i < numEdges; i++){
			 rand1 = 0;
			 rand2 = 0;
			 Graph.selectAllNodes();
			 Graph.calculateAdjMatrix();
			 while(rand1 == rand2 || Graph.adjacencyMatrix[rand1][rand2] ){
				 rand1 = Math.floor(Math.random()*numNodes);
				 rand2 = Math.floor(Math.random()*numNodes);
			 }
				 Graph.createEdge(Graph.selectedNodes[rand1],Graph.selectedNodes[rand2]);
		 }
		
		
	}//end createRandomGraph
    Graph.createRandomGraphMatrix = function () {
		var pageWidth = window.innerWidth;
		var pageHeight = window.innerHeight;
		var numNodes = prompt("How many nodes?"); //using prompt is just an easy way to get the info for now
		var numEdges = prompt("How many edges?");
		var rand1, rand2;
		
		Graph.selectAllNodes();
		for(var node in Graph.selectedNodes){
			Graph.deleteNode(Graph.selectedNodes[node]);
		}
		
		while((numEdges > numNodes*(numNodes - 1)/2)){
			numEdges = prompt("Too many edges for this graph! Try again!");
		}
		for(var i = 1; i <= numNodes; i++){
			Graph.createNode(Math.floor((Math.random()* (pageWidth - 100)) + 50),Math.floor((Math.random() * (pageHeight- 100)) + 50),i,i);
		}
		
		//Method two for generating random edges
		var distanceArray = create2DArray(numNodes - 1);
		var sortedArray = new Array; // this is used to easily sort the distance values
		var nodeIndex1 = nodeIndex2 = 0;
		Graph.selectAllNodes();
		//Get the distance between all nodes and store in a matrix
		for(var i = 0; i < numNodes; i++){
			for(var j = i + 1; j < numNodes; j++){
				distanceArray[i][j] = sortedArray[sortedArray.length] = Math.sqrt(Math.abs(Graph.selectedNodes[i].Y - Graph.selectedNodes[j].Y) + 
					Math.abs(Graph.selectedNodes[i].X - Graph.selectedNodes[j].X));
			}
		}
		sortedArray.sort(function(a,b) {return a-b });
		//find the indices of the closest nodes and create an edge between them.
		for(var i = 0; i < numEdges; i++){
			nodeIndex1 = nodeIndex2 = 0;
			while(distanceArray[nodeIndex1].indexOf(sortedArray[i]) < 0){
				nodeIndex1++;
			}
			nodeIndex2 = distanceArray[nodeIndex1].indexOf(sortedArray[i]);
			distanceArray[nodeIndex1][nodeIndex2] = 0;
			Graph.createEdge(Graph.selectedNodes[nodeIndex1], Graph.selectedNodes[nodeIndex2]);
		}
		
    };

	Graph.createRandomTree = function(){
		var numNodes = prompt("How many nodes?");
		var middleWidth = window.innerWidth/2;
		var startHeight = 100;
		var currentNumNodes = 0;
		var usedArray = [];
		var numUsed = 0;
		//create first root node
		if(numNodes > 1){
			currentNumNodes++;
			Graph.createNode(middleWidth,startHeight,currentNumNodes,currentNumNodes);
			Graph.selectAllNodes();
			while(currentNumNodes < numNodes){
				var randNode = Math.floor(Math.random()*currentNumNodes);
				var numNewNodes = (1 + Math.floor(Math.random()*((numNodes - currentNumNodes))/4));
				var used = false;
				
				//check to see if the node picked has already been used as a root
				for(var i = 0; i < numUsed; i++){
					if(usedArray[i] == randNode){
						used = true;
					}
				}
				if(used == false){
					usedArray[numUsed] = randNode;
					numUsed++;
					for(var i = 0; i < numNewNodes; i++){
						var nodeOffset = (-40*(numNewNodes - 1)) + (120*i);
						var nodeY = Graph.selectedNodes[randNode].Y + 100;
						currentNumNodes++;
						Graph.createNode((Graph.selectedNodes[randNode].X + nodeOffset),nodeY,currentNumNodes,currentNumNodes);
						Graph.selectAllNodes();
						Graph.createEdge(Graph.selectedNodes[randNode],Graph.selectedNodes[currentNumNodes - 1]);
					}
				}
			}
		}
		else{
			alert("Not enough nodes!");
		}
	};
    Graph.breadthFirst = function () {
    };

    Graph.force = function () {
    };

    Graph.speedCheck = function () {
        /*function createObj(first, last) {
            return {firstName: first, lastName: last};
        }
    
        var first = "grant";
        var last = "dennith";
        var begin = new Date;
        for (var i = 0; i < 100000000; i++) {
            var obj = createObj(first, last);
        }
        var end = new Date;
        console.log("Func:", ((end - begin)/1000), "seconds");
    
        var begin = new Date;
        for (var i = 0; i < 100000000; i++) {
            var obj = { firstName: first, lastName: last };
        }
        var end = new Date;
        console.log("No func:", ((end - begin)/1000), "seconds");
    
    
        var stringy = "string";
        
        var string3 = "";
        var stringArr = [];
        var begin = new Date;
        for (var i = 0; i < 300000; i++) {
            stringArr[i] = stringy;
        }
        string3 = stringArr.join("");
        var end = new Date;
        console.log("Array join method", (end - begin), "milliseconds");
    
        var string3 = "";
        var begin = new Date;
        for (var i = 0; i < 300000; i++) {
            string3 = string3.concat(stringy);
        }
        var end = new Date;
        console.log("concat method", (end - begin), "milliseconds");
    
        var string3 = "";
        var begin = new Date;
        for (var i = 0; i < 300000; i++) {
            string3 += stringy;
        }
        var end = new Date;
        console.log("+ operator", (end - begin), "milliseconds");
    
        var adjMatrixObj = {
            6: {},
            3: {},
            4: true
        };
        var begin = new Date;
        for (var i = 0; i < 10000000; i++) {
            if (adjMatrixObj[7] === true) var mkay = 1;
        }
        var end = new Date;
        console.log("obj", (end - begin), "milliseconds");
    
        var adjMatrixArr = [true,false,true,true,false]
        var begin = new Date;
        for (var i = 0; i < 10000000; i++) {
            if (adjMatrixArr[1] === true) alert();
        }
        var end = new Date;
        console.log("array", (end - begin), "milliseconds");*/
        /*var arr1 = [0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var begin = new Date;
        for (var i = 0; i < 10000000000; i++) {
            arr1[29] = 1;
        }
        var end = new Date;
        console.log("integer", (end - begin)/1000, "seconds");
    
        var arr2 = [true, true, true, false, true, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true];
        var begin = new Date;
        for (var i = 0; i < 10000000000; i++) {
            arr2[29] = true;
        }
        var end = new Date;
        console.log("boolean", (end - begin)/1000, "seconds");*/
        /*var arr1 = []
        var begin = new Date;
        for (var i = 0; i < 10000000; i++) {
            arr1.push(5);
            arr1.push(4);
        }
        var end = new Date;
        console.log("array", (end - begin), "m-seconds");
    
        var arr2 = "";
        var begin = new Date;
        var begin = new Date;
        for (var i = 0; i < 10000000; i++) {
            arr2 += "," + 5;
            
        }
        var end = new Date;
        console.log("string", (end - begin), "m-seconds");*/
        /*var arr2 = [1,2,3,4,10,50];
        var arr3 = [];
        var begin = new Date;
        for (var i = 0; i < 10000000; i++) {
            for(var q = 0; q < 6; q++){
                arr3[arr2[q]] = true;
            }
        }
        var end = new Date;
        console.log("for", (end - begin)/1000, "seconds");
    
        var arr2 = [1,2,3,4,10,50];
        var arr3 = [];
        var begin = new Date;
        for (var i = 0; i < 10000000; i++) {
            arr2.forEach(function(element){arr3[element] = true;});
            //var q = arr2[1];
        }
        var end = new Date;
        console.log("forEach", (end - begin)/1000, "seconds");*/

        //for
        /*var pathTo = [1, 2, 3, 4, 10, 50];
        var prevVerts = [];
        var len = pathTo.length;
        var begin = new Date;
        for (var i = 0; i < 1000000; i++) {
            for (var j = 0; j < len; j++) {
                prevVerts[pathTo[j]] = true;
            }
        }
        var end = new Date;
        console.log("for", (end - begin) / 1000, "seconds");
    
        //for i in
        var pathTo = [1, 2, 3, 4, 10, 50];
        var prevVerts = {};
        var begin = new Date;
        for (var i = 0; i < 1000000; i++) {
            for (var j in pathTo) {
                if (pathTo.hasOwnProperty(j)) {
                    prevVerts[j] = true;
                }
            }
        }
        var end = new Date;
        console.log("for i in", (end - begin) / 1000, "seconds");
    
        //forEach
        var pathTo = [1, 2, 3, 4, 10, 50];
        var prevVerts = [];
        var begin = new Date;
        for (var i = 0; i < 1000000; i++) {
            pathTo.forEach(function (element) { prevVerts[element] = true; });
        }
        var end = new Date;
        console.log("forEach", (end - begin) / 1000, "seconds");
    
        //equals
        var pathTo = [1, 2, 3, 4, 10, 50];
        var prevVerts = [];
        var begin = new Date;
        for (var i = 0; i < 1000000; i++) {
            prevVerts = pathTo;
        }
        var end = new Date;
        console.log("equals", (end - begin) / 1000, "seconds");*/

        /*var arr = [];
        var begin = new Date;
        for (var i = 0; i < 10000000; i++) {
            arr.push(i);
        }
        var end = new Date;
        console.log("Array", (end - begin) / 1000, "seconds");
        
        var str = "";
        var begin = new Date;
        for (var i = 0; i < 10000000; i++) {
            str += i;
        }
        var end = new Date;
        console.log("String", (end - begin) / 1000, "seconds");*/

        /*var nodesArray = [];    
        var nodesObj = {};
        var numNodes = 13
        for (var i = 0; i < numNodes; i++) {
            nodesArray.push({ nodeNum: i, nodeLabel: i + 1 });
            nodesObj["node" + i] = { nodeNum: i, nodeLabel: i + 1 };
        }
    
        var start = new Date;
        for (var i = 0; i < 1000000; i++) {
            for (var node in nodesObj) {
                var temp = nodesObj[node];
            }
        }
        var end = new Date;
        console.log("Obj -", (end - start) / 1000);
    
        var start = new Date;
        for (var i = 0; i < 1000000; i++) {
            for (var j = 0; j < numNodes; j++) {
                var temp = nodesArray[j];
            }
        }
        var end = new Date;
        console.log("Array -", (end - start) / 1000);*/

        /*
        //Array vs object access (seem to be exactly the same)
        var arr = [1, 2, 3, 4, 5];
        var start = new Date;
        for (var q = 0; q < 10000000; q++) {
            for (var i = 0; i < 5; i++) {
                var temp = arr[i];
            }
        }
        var end = new Date;
        console.log("Array -", (end - start) / 1000);
    
        var obj = {
            0: 1,
            1: 2,
            2: 3,
            3: 4,
            4: 5
        }
        var start = new Date;    
        for (var z = 0; z < 10000000; z++) {
            for (var j = 0; j < 5; j++) {
                var temp = obj[j];
            }
        }
        var end = new Date;
        console.log("Object -", (end - start) / 1000);*/

        /*
        //Array vs object deletion (deleting from objects is much faster b/c every time you 'push' an array, a bigger one is created and all the other elements are copied)
        var arr = [];
        for (var t = 0; t < 100000; t++) {
            arr.push(true);
        }
        var start = new Date;
        for (var q = 0; q < 100000; q++) {
            delete arr[q];
        }
        var end = new Date;
        console.log("Array -", (end - start) / 1000);
    
        var obj = {}
        for (var m = 0; m < 100000; m++) {
            obj[m] = true;
        }
        var start = new Date;
        for (var z = 0; z < 100000; z++) {
            delete obj[z];
        }
        var end = new Date;
        console.log("Object -", (end - start) / 1000);*/

        /*var ddArray = [[1,1], [1,1]]
        var start = new Date;
        for (var z = 0; z < 10000000; z++) {
            if (ddArray[0][1] === 0) {
                var t = true;
            }
        }
        var end = new Date;
        console.log("Array -", (end - start) / 1000);
        
        var obj = {
            adj:{
                0: 0,
                1: 1,
                2: 2,
                3: 3
            }
        };
        var start = new Date;
        for (var p = 0; p < 10000000; p++) {
            if (!obj.adj[4]) {
                var y = true;
            }
        }
        var end = new Date;
        console.log("Object -", (end - start) / 1000);*/
        /*var arr = [1, 2, 3];
        var start = new Date;
        for (var z = 0; z < 1000000; z++) {
            if (arr.indexOf(6) !== -1) {
                var temp = true;
            }
        }
        var end = new Date;
        console.log("Array -", (end - start) / 1000);
    
        var obj = {
            'Import': {},
            'Export': {},
            'Undo': {},
            'Redo': {},
            'Gravity': {}
        };
        var start = new Date;
        for (var q = 0; q < 1000000; q++) {
            if (obj["Niggers"]) {
                var temp1 = true;
            }
        }
        var end = new Date;
        console.log("Object -", (end - start) / 1000);*/

        /*var arr1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        var start = new Date;
        for (var z = 0; z < 1000000; z++) {
            for (var q = 0; q < arr1.length; q++) {
                var temp = arr1[q];
            }
        }
        var end = new Date;
        console.log("Slow loop:", end-start);
    
        var arr1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        var start = new Date;
        for (var z = 0; z < 1000000; z++) {
            for (var q = 0, qq = arr1.length; q < qq; q++) {
                var temp = arr1[q];
            }
        }
        var end = new Date;
        console.log("Fast loop:", end - start);
    
        var arr1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        var start = new Date;
        var qq = arr1.length;
        for (var z = 0; z < 1000000; z++) {
            for (var q = qq - 1; q > 0 ; q--) {
                var temp = arr1[q];
            }
        }
        var end = new Date;
        console.log("Fast loop also:", end - start);
    
        var arr1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        var start = new Date;
        for (var z = 0; z < 1000000; z++) {
            var qq = arr1.length;
            while (qq--) {
                var temp = arr1[qq];
            }
        }
        var end = new Date;
        console.log("While loop:", end - start);*/

        /*var obj = {
            'prop1': []
        };
        var start = new Date;
        var iterations = 1000000;
        while (iterations--) {
            if (obj.hasOwnProperty("prop1")) {
                var temp = 1;
            }
        }
        var end = new Date;
        console.log("hasOwnProperty", end - start);
    
        var start = new Date;
        var iterations = 1000000;
        while (iterations--) {
            if (obj["prop1"]) {
                var temp = 1;
            }
        }
        var end = new Date;
        console.log("Direct access check", end - start);*/

        /*var node = Graph.nodes[0];
        var start = new Date;
        var iterations = 1000000;
        while (iterations--) {
            var temp = node.X;
        }
        var end = new Date;
        console.log("prop", end - start);
    
        var start = new Date;
        var iterations = 1000000;
        while (iterations--) {
            var temp = +node.firstElementChild.getAttributeNS(null, "x");
        }
        var end = new Date;
        console.log("getAttribute", end - start);*/

        /*var dummyObj = {
            '0': 'TQL Cen',
            '1': 'TQL Cen',
            '2': 'TQL Cen',
            '3': 'TQL Cen',
            '4': 'TQL Cen',
            '5': 'TQL Cen',
            };
        var numIterations1 = 1000000;
        var numIterations2 = 1000000;
        var start = new Date;
        while (numIterations1--) {
            var bacock = "TQL Cen";
        }
        var end = new Date;
        console.log("Direct access", (end - start) / 1000);
    
        var start = new Date;
        while (numIterations2--) {
            var bacock = dummyObj[4];
        }
        var end = new Date;
        console.log("Property access", (end - start) / 1000);*/

        var arr = [];
        var start = new Date;
        for (var i = 0; i < 10000000; i++) {
            arr.push(1);
        }
        var end = new Date;
        console.log("Array: ", (end - start) / 1000);

        var str = "";
        var start = new Date;
        for (var j = 0; j < 10000000; j++) {
            str += 1;
        }
        var end = new Date;
        console.log("String: ", (end - start) / 1000);

    };

    Graph.performanceCheck = function (func) {
        var start = new Date;
        func(/*"123456789ab"*/);
        var end = new Date;
        console.log(func.name.toUpperCase(), "complete in", (end - start) / 1000, "seconds.");
    }

    /*Graph.findGravFlavoring = function (input) {
    
        function permute(input, outputString, used, inputlength, level) {
            if (level === inputLength) {
                numPerms++;
                console.log(outputString); 
                return;
            }
            for (var i = 0; i < inputLength; ++i) {
                if (used[i]) continue;
                outputString += input[i];      
                used[i] = true;
                permute(input, outputString, used, inputLength, level + 1);
                used[i] = false;
                outputString = outputString.substring(0, outputString.length - 1);   
            }
        }
    
        var inputLength = input.length;
        var used = new Array(inputLength);
        var outputString = "";
        var numPerms = 0;
        permute(input, outputString, used, inputLength, 0);
        console.log(numPerms);
    };*/

    Graph.testErrorCircle = function testErrorCircle(circleCx, circleCy, circleRadius) {
        var pageWidth = window.innerWidth;
        var pageHeight = window.innerHeight;

        var errorGroup = document.createElementNS(xmlns, "g");

        var cx = pageWidth * circleCx;
        var cy = pageHeight * circleCy;
        var r = pageWidth * circleRadius;

        var errorCircle = document.createElementNS(xmlns, "circle");
        errorCircle.setAttributeNS(null, "cx", cx);
        errorCircle.setAttributeNS(null, "cy", cy);
        errorCircle.setAttributeNS(null, "r", r);
        errorCircle.setAttributeNS(null, "fill", "red");
        errorGroup.appendChild(errorCircle);

        for (var i = 0; i < 4; i++) {
            var errorXPart = document.createElementNS(xmlns, "line");
            errorXPart.setAttributeNS(null, "x1", cx);
            errorXPart.setAttributeNS(null, "y1", cy);
            errorXPart.setAttributeNS(null, "x2", cx + r - (r * .3));
            errorXPart.setAttributeNS(null, "y2", cy);
            errorXPart.setAttributeNS(null, "stroke", "white");
            errorXPart.setAttributeNS(null, "stroke-width", r * .25);
            errorXPart.setAttributeNS(null, "transform", "rotate(" + (45 + (i * 90)) + "," + cx + "," + cy + ")");
            errorGroup.appendChild(errorXPart);
        }

        parentSVG.appendChild(errorGroup);
    };
	
	Graph.deleteGraph = function deleteGraph() {
		Graph.deselectAllNodes();
		for (var i = Graph.numberOfNodes-1; i >= 0; i--) {
			Graph.deleteNode(Graph.nodes[i]);
		}
		
	};
}, false);