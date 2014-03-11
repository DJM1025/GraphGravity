//TO-DO
//js file for global variables
//make groups have the attributes and have them inherit? might not be possible because of text
//make a window.onload or something of the sort so that the user can't start clicking before everything is ready
//use closures for mouse events
//make a mousedown event for the document, not each node
//make a central event handler
//change mouseover to entire group and do target so you dont have to assign and event listener to each node - just like in SVGDropDown Object
//make a style sheet so that i don't need to do 'style.visibility = hidden' for every dropdown menu and other stuff
//order of children layout (nodes, selected, edges, selectedEdges, etc.)
//make sure not to add to history if nothing really happened (i.e a select all when all are selected, or a deselect all when none are selected)...
//add a functionality so when the user selects a node and then shift clicks another node, all nodes inclusive nodes are selected (i.e selected node2 then shift click node7 - nodes 2,3,4,5,6,7 will be selected)
//i took out the branch connect because it seemed to do the same for creating multiple edges, but it is different because the selected nodes stay highlighted
//fix complement - if you do it when nothing is selected the redo/undo gets messed up

//SVG namespacesp;
var xmlns = "http://www.w3.org/2000/svg";
var xlink = "http://www.w3.org/1999/xlink";
var svgXmlNs = "http://www.w3.org/2000/xmlns/";

//make a global.js for root, namespaces, etc.
var root = document.documentElement;

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
    root.appendChild(boundingRect);
};

//add findMidPoint method to the SVGGElement prototype
SVGGElement.prototype.findMidpoint = function findMidpoint() {
    var bounds = this.getBoundingClientRect();
    return {
        x: bounds.left + (bounds.width / 2),
        y: bounds.top + (bounds.height / 2)
    };
};

function SVGMenuDropDown (x, y, itemWidth, itemHeight, title) {
    var count = -1;
    var nextItemY = y;
    var itemList = [];

    var container = document.createElementNS(xmlns, "g");
    container.setAttributeNS(null, "fill", "red");
    container.setAttributeNS(null, "stroke", "black");
    container.setAttributeNS(null, "stroke-width", "5");
    container.addEventListener("mouseover", function (event) {
        var itemRect = event.target;
        if (!itemRect.parentNode.header) {
            itemRect.setAttributeNS(null, "fill", "white");
            itemRect.nextElementSibling.setAttributeNS(null, "fill", "red");
        }
    }, false);
    container.addEventListener("mouseout", function (event) {
        var itemRect = event.target;
        if (!itemRect.parentNode.header) {
            itemRect.setAttributeNS(null, "fill", "red");
            itemRect.nextElementSibling.setAttributeNS(null, "fill", "white");
        }
    }, false);

    this.append = function (parent) {
        parent.appendChild(container);
        this.addItem(title);
        itemList[0].style.visibility = "visible";
        itemList[0].header = true;
        itemList = [];
    }

    this.getCount = function () {
        return count;
    };

    this.addItem = function (itemText) {
        //for loop - iterate through arguments
        //OPTIONS TO ADD
        //add onto end
        //insert before
        //insert after

        var newItem = document.createElementNS(xmlns, "g");
        newItem.style.visibility = "hidden";

        var newRect = document.createElementNS(xmlns, "rect");
        newRect.setAttributeNS(null, "x", newRect.X = x);       
        newRect.setAttributeNS(null, "y", newRect.Y = nextItemY);
        newRect.setAttributeNS(null, "width", newRect.Width = itemWidth);
        newRect.setAttributeNS(null, "height", newRect.Height = itemHeight);
        newItem.appendChild(newRect);
        container.appendChild(newItem);

        var newText = document.createElementNS(xmlns, "text");
        newText.setAttributeNS(null, "font-family", "Arial");
        newText.setAttributeNS(null, "font-size", "12");
        newText.setAttributeNS(null, "fill", "white");
        newText.setAttributeNS(null, "font-weight", "bold");
        newText.setAttributeNS(null, "x", x + (itemWidth/2));
        newText.setAttributeNS(null, "alignment-baseline", "middle");
        newText.setAttributeNS(null, "y", newText.Y = (nextItemY + (itemHeight/2)));
        newText.setAttributeNS(null, "text-anchor", "middle");
        newText.setAttributeNS(null, "stroke-width", 0);
        newText.setAttributeNS(null, "pointer-events", "none");
        newText.textContent = newItem.textValue = itemText;
        newItem.appendChild(newText);

        itemList.push(newItem);
        nextItemY += itemHeight;
        count++;
    };

    this.removeItem = function (itemToRemove) {
        //maybe i can just give each item and index property so I know where it's at
        //for loop - iterate through arguments
        
        if (typeof itemToRemove === "string") {
            for (var n = 0; n < count; n++) {
                var nextItem = itemList[n];
                if (nextItem.textValue === itemToRemove) {
                    nextItem.parentNode.removeChild(nextItem);
                    itemList.splice(n, 1);
                    count--;
                    adjust(n);
                    break;
                }
            }
        }
        else if (typeof itemToRemove === "number") {
            var index = itemToRemove;
            var item = itemList[index];
            item.parentNode.removeChild(item);
            itemList.splice(index, 1);
            count--;
            adjust(index);
        }

        function adjust(index) {
            if (index !== count) {
                for (i = index; i < count; i++) {
                    var itemRect = itemList[i].firstElementChild;
                    itemRect.setAttributeNS(null, "y", itemRect.Y = (itemRect.Y - itemHeight));
                    var itemText = itemRect.nextElementSibling;
                    itemText.setAttributeNS(null, "y", itemText.Y = (itemText.Y - itemHeight));
                }
            }
            nextItemY -= itemHeight;
        };

    };

    this.expand = function () {
        //kinda broken because if expanded, newly inserted nodes are invisible
        for (var n = 0; n < count; n++) {
            itemList[n].style.visibility = "visible";
        }
    };

    this.contract = function () {
        for (var n = 0; n < count; n++) {
            itemList[n].style.visibility = "hidden";
        }
    };

    this.createExpandArrow = function () {
        //make this fucking elegant and rename the method
        var itemRect = itemList[0].firstElementChild; //maybe make the custom x, y, width, height on the group instead of the rect
        var expandArrow = document.createElementNS(xmlns, "path");
        var offSetRight = itemRect.Width / 15;
        var offSetLeft = itemRect.Width - (itemRect.Width / 7.5);
        var offSetTopBot = itemRect.Height / 3;
        var point1 = ((itemRect.X + itemRect.Width) - offSetRight) + "," + (itemRect.Y + (itemRect.Height / 2));
        var point2 = (itemRect.X + offSetLeft) + "," + (itemRect.Y + offSetTopBot);
        var point3 = (itemRect.X + offSetLeft) + "," + ((itemRect.Y + itemRect.Height) - offSetTopBot);
        expandArrow.setAttributeNS(null, "d", "M " + point1 + " " + point2 + " " + point3 + "z");
        expandArrow.setAttributeNS(null, "fill", "white");
        expandArrow.setAttributeNS(null, "stroke", "black");
        expandArrow.setAttributeNS(null, "stroke-width", "2");
        root.appendChild(expandArrow);
    };

    this.addSubGroup = function(parentItem, dropDownToAdd){
    }
}

//create and return a 2-dimensional array
function create2DArray(length) {
    var twoDArray = new Array(length);
    for (var index = 0; index < Graph.numberOfNodes; index++) {
        twoDArray[index] = new Array(length);
    }
    return twoDArray;
};

window.addEventListener("keydown", function (event) {
    //if (!Graph.multipleSelect && !Graph.rangeSelect && !Graph.autoConnect && !Graph.branchConnect) { <--- prevents using multiple hotkeys at once (but maybe someone would want to branch and auto-connect....)
    //'ctrl' key - select multiple nodes at once
    if (event.keyCode == 17) {
        //change to evt.ctrlKey
        Graph.multipleSelect = true;
    }
        //'t' key - auto connect nodes
    else if (event.keyCode == 84) {
        Graph.autoConnect = true;
    }
        //'r' key - branch from selected node
    else if (event.keyCode == 82) {
        Graph.branchConnect = true;
    }
    //}    
}, false);

window.addEventListener("keyup", function (event) {
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
            var nodesToDelete = [];
            var numSelectedNodes = nodeCount = Graph.numberOfSelectedNodes;
            for (var node in Graph.selectedNodes) {
                var nextNode = Graph.selectedNodes[node];
                nodesToDelete.push(nextNode);
                if (nodeCount === numSelectedNodes - 1) {
                    Graph.deleteNode(nextNode, true, nodesToDelete);
                }
                else {
                    Graph.deleteNode(nextNode, false);
                }
                nodeCount++;
            }
            Graph.fixGravityValues();
            break;
        case 65://'a' key
            Graph.selectAllNodes(true);
            break;
        case 68://'d' key
            Graph.deselectAllNodes(true);
            break;
        case 67://'c' key
            Graph.clipboard.copy();
            break;
        case 86://'v' key
            Graph.clipboard.paste();
            break;
        case 90://'z' key
            Graph.clipboard.undo();
            break;
        case 89://'y' key
            Graph.clipboard.redo();
            break;
        case 88://'x' key
            Graph.extrude();
            break;
        case 73://'i' key
            Graph.complement(true);
            break;
        case 70://'f' key
            Graph.invert(true);
            break;
        case 69://'e' key
            Graph.expand(true);
            break;
    }
}, false);

//Graph object (static class) - i would probably just change this to a giant object - this kinda looks dumb with a function out here
function Graph() {
    throw new Error("Graph is a static class");
};

Graph.sortNodePair = function (node1, node2) {
    /*return {
        'lowNode': node1.nodeNum < node2.nodeNum ? node1 : node2,
        'highNode': node1.nodeNum < node2.nodeNum ? node2 : node1
    };*/

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
    alert();
    var correctNum = 0;
    for (var node in Graph.nodes) {
        var nextNode = Graph.nodes[node];
        if (nextNode.nodeNum !== correctNum) {
            delete Graph.nodes[nextNode.nodeNum];
            Graph.nodes[correctNum] = nextNode;
            nextNode.nodeNum = correctNum;
            var nodeText = nextNode.firstElementChild.nextElementSibling;
            nodeText.textContent = nextNode.nodeLabel = correctNum + 1;
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
Graph.nodeWidth = 25;
Graph.nodeHeight = 20;
Graph.numberOfNodes = 0;
Graph.numberOfSelectedNodes = 0;
Graph.multipleSelect = false; //selecting multiple nodes at once
Graph.autoConnect = false; //create node connected to all selected nodes(s) - newly created node becomes selected
Graph.branchConnect = false; //create nodes "branching" off of all selected node(s) - original node(s) remain selected
Graph.adjacencyMatrix = null;
Graph.shortestPaths = null;
Graph.shortestPathLengths = null;
Graph.nodes = {};
Graph.selectedNodes = {};
Graph.clipboard = (function () {
    var copiedItem = {};
    var historyArray = [50];
    var current = -1;
    var top = -1;

    return {
        'copy': function (extrude) {
            if (Graph.numberOfSelectedNodes !== 0) {
                copiedItem = {};
                for (var node in Graph.selectedNodes) {
                    var nextNode = Graph.selectedNodes[node];
                    var nodeInfo = {
                        'node': null,
                        'origNum': nextNode.nodeNum,
                        'x': nextNode.X,
                        'y': nextNode.Y,
                        'edges': []
                    };
                    for (var edge in nextNode.edges) {
                        var nextEdge = nextNode.edges[edge];
                        if (nextEdge.selected) {
                            nodeInfo.edges.push(parseInt(edge));
                        }
                    }
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
        },

        'undo': function () {
            if (current !== -1) {
                var action = historyArray[current--];
                switch(action.name)
                {  
                    case "Selected node":
                        var nodes = action.nodes;
                        for(var n=0;n<nodes.length;n++){
                            Graph.deselectNode(Graph.selectedNodes[nodes[n]], false);
                        }
                        break;
                    case "Deselected node":
                        Graph.selectNode(Graph.nodes[action.node], false);
                        break;
                    case "Selected all nodes":
                        var nodes = action.nodes;
                        for (var n = 0; n < nodes.length; n++) {
                            Graph.deselectNode(Graph.selectedNodes[nodes[n]], false)
                        }
                        break;
                    case "Deselected all nodes":
                        var nodes = action.nodes;
                        for (var n = 0; n < nodes.length; n++) {
                            Graph.selectNode(Graph.nodes[nodes[n]], false)
                        }
                        break;
                    case "Created node":
                        var node = action.node;
                        Graph.selectNode(Graph.nodes[node.nodeNum], false);
                        Graph.deleteNode(Graph.selectedNodes[node.nodeNum], false);
                        break;
                    case "Deleted node":
                        break;
                    case "Created/Deleted edges":
                        var edgesToCreate = action.edgesList.edgesToCreate;
                        var edgesToDelete = action.edgesList.edgesToDelete;
                        var node1 = Graph.nodes[action.edgesList.node];
                        if (edgesToCreate.length > edgesToDelete.length) {
                            for (var n = 0; n < edgesToCreate.length; n++) {
                                var node2 = Graph.nodes[edgesToCreate[n]];
                                Graph.selectNode(node2, false);
                                Graph.deleteEdge(node1, node2, false);
                                if (n < edgesToDelete.length) {
                                    node2 = Graph.nodes[edgesToDelete[n]];
                                    Graph.selectNode(node2, false);
                                    Graph.createEdge(node1, node2, false);
                                }
                            }
                        }
                        else{
                            for (var n = 0; n < edgesToDelete.length; n++) {
                                var node2 = Graph.nodes[edgesToDelete[n]];
                                Graph.selectNode(node2, false);
                                Graph.createEdge(node1, node2, false);
                                if (n < edgesToCreate.length) {
                                    node2 = Graph.nodes[edgesToCreate[n]];
                                    Graph.selectNode(node2, false);
                                    Graph.deleteEdge(node1, node2, false);
                                }
                            }
                        }
                        break;
                    case "Deleted edge":
                        //don't forget to basically copy create
                        break;
                    case "Auto connected":
                        break;
                    case "Branch connected":
                        break;
                    case "Moved node":
                        break;
                    case "Pasted":
                        //delete all selected and reselect what was selected before?
                        break;
                    case "Extruded nodes":
                        //delete all selected and reselect what was selected before?
                        break;
                    case "Complemented nodes":
                        Graph.complement(false);
                        if (action.deselectOnUndo) {
                            Graph.deselectAllNodes(false);
                        }
                        break;
                    case "Expanded":
                        var nodes = action.nodes;
                        for (var node in nodes) {
                            Graph.deselectNode(Graph.selectedNodes[node], false);
                        }
                        break;
                    case "Inverted":
                        Graph.invert(false)
                        break;
                    case "Dominated":
                        break;
                }
                //historyArray[current--]["undo"]();
            }
        },

        'redo': function () {
            if (current !== top) {
                var action = historyArray[++current];
                switch (action.name) {
                    case "Selected node":
                        var nodes = action.nodes;
                        for(var n=0;n<nodes.length;n++){
                            Graph.selectNode(Graph.nodes[nodes[n]], false);
                        }
                        break;
                    case "Deselected node":
                        Graph.deselectNode(Graph.selectedNodes[action.node], false);
                        break;
                    case "Selected all nodes":
                        Graph.selectAllNodes(false);
                        break;
                    case "Deselected all nodes":
                        Graph.deselectAllNodes(false);
                        break;
                    case "Created node":
                        var node = action.node;
                        Graph.createNode(node.X + (Graph.nodeWidth/2), node.Y + (Graph.nodeHeight/2), false);                        
                        break;
                    case "Deleted node":
                        break;
                    case "Created/Deleted edges":
                        var edgesToCreate = action.edgesList.edgesToCreate;
                        var edgesToDelete = action.edgesList.edgesToDelete;
                        var node1 = Graph.nodes[action.edgesList.node];
                        if (edgesToCreate.length > edgesToDelete.length) {
                            for (var n = 0; n < edgesToCreate.length; n++) {
                                var node2 = Graph.selectedNodes[edgesToCreate[n]];
                                Graph.deselectNode(node2, false);
                                Graph.createEdge(node1, node2, false);
                                if (n < edgesToDelete.length) {
                                    node2 = Graph.selectedNodes[edgesToDelete[n]];
                                    Graph.deselectNode(node2, false);
                                    Graph.deleteEdge(node1, node2, false);
                                }
                            }
                        }
                        else {
                            for (var n = 0; n < edgesToDelete.length; n++) {
                                var node2 = Graph.selectedNodes[edgesToDelete[n]];
                                Graph.deselectNode(node2, false);
                                Graph.deleteEdge(node1, node2, false);
                                if (n < edgesToCreate.length) {
                                    node2 = Graph.selectedNodes[edgesToCreate[n]];
                                    Graph.deselectNode(node2, false);
                                    Graph.createEdge(node1, node2, false);
                                }
                            }
                        }
                        break;
                    case "Auto connected":
                        break;
                    case "Branch connected":
                        break;
                    case "Moved node":
                        break;
                    case "Pasted":
                        break;
                    case "Extruded nodes":
                        //extrude lol?
                        break;
                    case "Complemented nodes":
                        Graph.complement(false);
                        break;
                    case "Expanded":
                        var nodes = action.nodes;
                        for (var node in nodes) {
                            Graph.selectNode(Graph.nodes[node], false);
                        }
                        break;
                    case "Inverted":
                        Graph.invert(false)
                        break;
                    case "Dominated":
                        break;
                }
                //historyArray[++current]["redo"]();
            }
        },

        //possibly
        /*'addToHistory': function (actionName, undoFunc, redoFunc) {
            var action = {
                'actionName': actionName,
                'undo': undoFunc,
                'redo': redoFunc
            };
        },*/

        'addToHistory': function (action) {
            if (current === top) {
                historyArray[++current] = action;
                top++;
            }
            else {
                historyArray[++current] = action;
                top = current;
            }
            console.log(action);
        }
    };
})();
//Graph.landmarks = {};
//Graph.vantagePoints = {};
//Graph.numberOfLandmarks = 0;
//Graph.numberOfVantagePoints = 0;
//Graph.isGravitational = false;
Graph.deselectOnRelease = false;

//create the graph plane/background
Graph.plane = document.createElementNS(xmlns, "svg");
Graph.plane.id = "graphPlane";
Graph.plane.setAttributeNS(svgXmlNs, "xmlns", "http://www.w3.org/2000/svg");
Graph.plane.setAttributeNS(svgXmlNs, "xmlns:xlink", "http://www.w3.org/1999/xlink");
Graph.plane.setAttributeNS(null, "version", "1.1");
//Graph.plane.setAttributeNS(null, "zoomAndPan", "disabled");
Graph.plane.background = document.createElementNS(xmlns, "rect");
Graph.plane.background.setAttributeNS(null, "x", "0");
Graph.plane.background.setAttributeNS(null, "y", "0");
Graph.plane.background.setAttributeNS(null, "width", "100%");
Graph.plane.background.setAttributeNS(null, "height", "100%");
Graph.plane.background.setAttributeNS(null, "fill", "gray");
Graph.plane.appendChild(Graph.plane.background);
root.appendChild(Graph.plane);


//draw selection area
Graph.plane.background.addEventListener("mousedown", function beginSelectionArea() {
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

        Graph.plane.addEventListener("mousemove", expandSelectionArea, false);
        Graph.plane.addEventListener("mouseup", finishSelectionArea, false);

        function expandSelectionArea() {
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
            var nodeList = [];
            for (var node in Graph.nodes) {
                var nodeBBox = Graph.nodes[node].getBBox();
                var nodeMaxX = nodeBBox.x + nodeBBox.width;
                var nodeMaxY = nodeBBox.y + nodeBBox.height;
                if ((nodeMaxX > selectionArea.minX && nodeBBox.x < selectionArea.maxX) && (nodeMaxY > selectionArea.minY && nodeBBox.y < selectionArea.maxY)) {                    
                    nodeList.push(node);
                }
            }
            for (var n = 0; n < nodeList.length; n++) {
                var nextNode = Graph.nodes[nodeList[n]];
                if (n === nodeList.length - 1) {
                    Graph.selectNode(nextNode, true, nodeList);
                }
                else {
                    Graph.selectNode(nextNode, false);
                }
            }
            selectionArea.parentNode.removeChild(selectionArea);
            Graph.plane.removeEventListener("mousemove", expandSelectionArea, false);
            Graph.plane.removeEventListener("mouseup", finishSelectionArea, false);
        }           
    }
}, false);

Graph.plane.background.addEventListener("mouseup", function (event) {
    if (Graph.numberOfSelectedNodes == 0) {
        var createdNode = Graph.createNode(event.pageX, event.pageY, true);
        if (Graph.autoConnect || Graph.branchConnect) {
            Graph.selectNode(createdNode);
        }
    }
    else {
        if (Graph.autoConnect) {
            var createdNode = Graph.createNode(event.pageX, event.pageY);
            for (var node in Graph.selectedNodes) {
                var currentNode = Graph.selectedNodes[node];
                Graph.createEdge(currentNode, createdNode);
                Graph.deselectNode(currentNode);
            }
            Graph.selectNode(createdNode);

        }
        else if (Graph.branchConnect) {
            var createdNode = Graph.createNode(event.pageX, event.pageY);
            for (var node in Graph.selectedNodes) {
                var currentNode = Graph.selectedNodes[node];
                Graph.createEdge(currentNode, createdNode);
            }
        }
        else if (!Graph.multipleSelect) {
            Graph.deselectAllNodes();
        }
    }
}, false);

//create node/edge groups
Graph.edgesGroup = document.createElementNS(xmlns, "g"); 
Graph.edgesGroup.id = "edgesGroup";
Graph.edgesGroup.setAttributeNS(null, "stroke", "orange");
Graph.edgesGroup.setAttributeNS(null, "stroke-width", "2");
Graph.plane.appendChild(Graph.edgesGroup);
Graph.selectedEdgesGroup = document.createElementNS(xmlns, "g");
Graph.selectedEdgesGroup.id = "selectedEdgesGroup";
Graph.selectedEdgesGroup.setAttributeNS(null, "stroke", "yellow");
Graph.selectedEdgesGroup.setAttributeNS(null, "stroke-width", "2");
Graph.plane.appendChild(Graph.selectedEdgesGroup);
Graph.nodesGroup = document.createElementNS(xmlns, "g");
Graph.nodesGroup.id = "nodesGroup";
Graph.plane.appendChild(Graph.nodesGroup);
Graph.selectedNodesGroup = document.createElementNS(xmlns, "g");
Graph.selectedNodesGroup.id = "selectedNodesGroup";
//Graph.nodesGroup.appendChild(Graph.selectedNodesGroup);
Graph.plane.appendChild(Graph.selectedNodesGroup);

//create a node
Graph.createNode = function (x, y, addToHistory) {
    var nodeGroup = document.createElementNS(xmlns, "g");
    //nodeGroup.midpoint = { x: x, y: y };
    nodeGroup.adjacentNodes = {};
    nodeGroup.selected = false;    
    nodeGroup.nodeNum = Graph.numberOfNodes;
    nodeGroup.edges = {};

    var nodeRect = document.createElementNS(xmlns, "rect");
    nodeRect.setAttributeNS(null, "rx", "2.5");
    nodeRect.setAttributeNS(null, "fill", "red");
    nodeRect.setAttributeNS(null, "stroke", "black");
    nodeRect.setAttributeNS(null, "stroke-width", "2.5");
    nodeRect.setAttributeNS(null, "x", nodeGroup.X = (x - (Graph.nodeWidth / 2)));
    nodeRect.setAttributeNS(null, "y", nodeGroup.Y = (y - (Graph.nodeHeight / 2)));
    nodeRect.setAttributeNS(null, "height", Graph.nodeHeight);
    nodeRect.setAttributeNS(null, "width", Graph.nodeWidth);
    nodeGroup.appendChild(nodeRect);

    var nodeText = document.createElementNS(xmlns, "text");
    nodeText.textContent = nodeGroup.nodeLabel = ++Graph.numberOfNodes;
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
        nodeGroup.addEventListener("mouseover", Graph.highlightEdges, false);
        nodeGroup.addEventListener("mouseout", Graph.highlightEdges, false);
    }, false)

    nodeGroup.addEventListener("mousedown", Graph.pressHoldNode, false);
    nodeGroup.addEventListener("mouseup", Graph.releaseNode, false);

    if (addToHistory) {
        Graph.clipboard.addToHistory({
            'name': "Created node",
            'node': nodeGroup           
        });
    }

    return nodeGroup;
    
}

//delete a node
Graph.deleteNode = function (node, addToHistory, nodeList) {
    for (var adj in node.adjacentNodes) {
        var adjNode = node.adjacentNodes[adj];
        if (adjNode.nodeNum < node.nodeNum) {
            Graph.deleteEdge(adjNode, node);
        }
        else {
            Graph.deleteEdge(node, adjNode);
        }
    }
      
    delete Graph.selectedNodes[node.nodeNum];
    node.parentNode.removeChild(node);    
    Graph.numberOfNodes--;
    Graph.numberOfSelectedNodes--;
    //****FUCKED UP BECAUSE FIXING NODE NUMBERS MESSES UP THE NUMBERS
    //think i just need to bump everything up, i.e if I delete a 2 and there at 5 nodes, bump the 2 and everything after it up 1 - so then i have 1,3,4,5 and a place for the two
    //but how will this work for multiple deletes? hopefully the same?
    if (addToHistory) {
        Graph.clipboard.addToHistory({
            'name': "Deleted node",
            'nodes': nodeList,
            'undo': function () {
                for (var n = 0; n < this.nodes.length; n++) {
                    var nextNode = this.nodes[n];
                    Graph.selectNode(Graph.createNode(nextNode.X + (Graph.nodeWidth / 2), nextNode.Y + (Graph.nodeHeight / 2), false), false);
                }
            },
            'redo': function () {
                for (var n = 0; n < this.nodes.length; n++) {                    
                    var nextNode = Graph.selectedNodes[this.nodes[n].nodeNum];
                    Graph.deleteNode(nextNode, false);
                }
            }
        });
    }
};

//mousedown on a node
Graph.pressHoldNode = function (event) {
    var nodeGroup = event.currentTarget;
    //is there a reason i am using alreadySelected and not just selected?
    if (nodeGroup.selected) {
        nodeGroup.alreadySelected = true;
    }
    else {
        nodeGroup.alreadySelected = false;
    }    
    if (Graph.numberOfSelectedNodes == 0) {
        Graph.selectNode(nodeGroup, true, [nodeGroup.nodeNum]);
        Graph.deselectOnRelease = false;
    }
    else {
        if (Graph.multipleSelect) {
            if (nodeGroup.selected) {
                Graph.deselectNode(nodeGroup, true);
                Graph.deselectOnRelease = false;
            }
            else {
                Graph.selectNode(nodeGroup, true, [nodeGroup.nodeNum]);
                Graph.deselectOnRelease = false;
            }

        }
        else {
            if (nodeGroup.selected) {
                //return;
            }
            else if (Graph.autoConnect) {//auto-connect - begin                
                for (var node in Graph.selectedNodes) {
                    var currentNode = Graph.selectedNodes[node];
                    if (nodeGroup.adjacentNodes[currentNode.nodeNum]) {
                        Graph.deleteEdge(nodeGroup, currentNode);
                    }
                    else {
                        Graph.createEdge(nodeGroup, currentNode);
                    }
                    Graph.deselectNode(currentNode);
                }
                Graph.selectNode(nodeGroup);
                Graph.deselectOnRelease = false;
            }//auto-connect - end
            else if (Graph.branchConnect) {//branch connect - begin                
                for (var node in Graph.selectedNodes) {
                    var currentNode = Graph.selectedNodes[node];
                    if (!nodeGroup.adjacentNodes[currentNode.nodeNum]) {
                        Graph.createEdge(nodeGroup, currentNode);
                    }
                    else {
                        Graph.deleteEdge(nodeGroup, currentNode);
                    }
                }
                Graph.selectNode(nodeGroup);
                Graph.deselectOnRelease = true;
            }//branch connect - end
            else {
                var edgesList = {
                    'node': nodeGroup.nodeNum,
                    'edgesToCreate': [],
                    'edgesToDelete': []
                };
                var nodeCounter = Graph.numberOfSelectedNodes;
                for (var node in Graph.selectedNodes) {
                    nodeCounter--;
                    var currentNode = Graph.selectedNodes[node];
                    if (!nodeGroup.adjacentNodes[currentNode.nodeNum]) {
                        edgesList.edgesToCreate.push(node);
                        if (nodeCounter === 0) {
                            Graph.createEdge(nodeGroup, currentNode, true, edgesList);
                        }
                        else {
                            Graph.createEdge(nodeGroup, currentNode, false);
                        }
                    }
                    else {
                        edgesList.edgesToDelete.push(node);
                        if (nodeCounter === 0) {
                            Graph.deleteEdge(nodeGroup, currentNode, true, edgesList);
                        }
                        else {
                            Graph.deleteEdge(nodeGroup, currentNode, false);
                        }
                    }
                    Graph.deselectNode(currentNode, false);
                }
                Graph.selectNode(nodeGroup, false);
                Graph.deselectOnRelease = true;
                
            }
        }
    }

    var initialX = nodeGroup.X;
    var initialY = nodeGroup.Y;
    var xOffset = event.pageX - nodeGroup.X;
    var yOffset = event.pageY - nodeGroup.Y;
    //maybe on root?
    Graph.plane.onmousemove = function (event) {
        var nodeRect = nodeGroup.firstElementChild;
        var nodeText = nodeRect.nextElementSibling;
        if (nodeGroup.alreadySelected) {
            nodeRect.setAttributeNS(null, "x", nodeGroup.X = event.pageX - xOffset);
            nodeRect.setAttributeNS(null, "y", nodeGroup.Y = event.pageY - yOffset);
            //nodeText.setAttributeNS(null, "x", nodeText.X = event.pageX - xOffset);
            //nodeText.setAttributeNS(null, "y", nodeText.Y = event.pageY - yOffset);
            var changeX = nodeGroup.X - initialX;
            var changeY = nodeGroup.Y - initialY;

            for (var selectedNode in Graph.selectedNodes) {
                var currentSelectedNode = Graph.selectedNodes[selectedNode];

                if (currentSelectedNode !== nodeGroup) {
                    var currentRect = currentSelectedNode.firstElementChild;
                    var currentText = currentRect.nextSibling;
                    currentRect.setAttributeNS(null, "x", currentSelectedNode.X + changeX);
                    currentRect.setAttributeNS(null, "y", currentSelectedNode.Y + changeY);
                    //var initialX = parseFloat(currentText.getAttributeNS(null, "x"));
                    //var initialY = parseFloat(currentText.getAttributeNS(null, "y"));
                    //currentText.setAttributeNS(null, "x", initialX + changeX);
                    //currentText.setAttributeNS(null, "y", initialY + changeY);
                }

                /*for (var adjNode in currentSelectedNode.adjacentNodes) {
                    var currentAdjNode = currentSelectedNode.adjacentNodes[adjNode];
                    var edgePathString;
                    var edge;
                    if (!currentAdjNode.selected) {
                        var edgeContents = Graph.constructEdgeString(currentSelectedNode, currentAdjNode, true);
                        edge = Graph.edges[edgeContents.edgeString];
                        edgePathString = "M " + edgeContents.lowNode.midpoint.x + "," + edgeContents.lowNode.midpoint.y + " " + edgeContents.highNode.midpoint.x + "," + edgeContents.highNode.midpoint.y;
                        edge.setAttributeNS(null, "d", edgePathString);
                    }
                    else {
                        if (currentAdjNode.nodeNum < currentSelectedNode.nodeNum) {
                            continue;
                        }
                        else {
                            edge = Graph.selectedEdges[currentSelectedNode.nodeNum + ":" + currentAdjNode.nodeNum];
                            edgePathString = "M " + currentSelectedNode.midpoint.x + "," + currentSelectedNode.midpoint.y + " " + currentAdjNode.midpoint.x + "," + currentAdjNode.midpoint.y;
                            edge.setAttributeNS(null, "d", edgePathString);
                        }
                    }
                }*/
            }
        }

        /*else {
            nodeGroup.midpoint.x = event.pageX;
            nodeGroup.midpoint.y = event.pageY;
            nodeRect.setAttributeNS(null, "x", (event.pageX - (Graph.nodeWidth / 2)));
            nodeRect.setAttributeNS(null, "y", (event.pageY - (Graph.nodeHeight / 2)));
            nodeText.setAttributeNS(null, "x", event.pageX);
            nodeText.setAttributeNS(null, "y", event.pageY + (parseInt(nodeRect.getAttributeNS(null, "height")) / 5));

            for (var adjNode in nodeGroup.adjacentNodes) {
                var adjacentNode = nodeGroup.adjacentNodes[adjNode];
                if (!adjacentNode.selected) {
                    var edgeContents = Graph.constructEdgeString(nodeGroup, adjacentNode, true);
                    var edge = Graph.edges[edgeContents.edgeString];
                    var edgePathString = "M " + edgeContents.lowNode.midpoint.x + "," + edgeContents.lowNode.midpoint.y + " " + edgeContents.highNode.midpoint.x + "," + edgeContents.highNode.midpoint.y;
                    edge.setAttributeNS(null, "d", edgePathString);
                }
            }
        }*/

        /*for (var node in Graph.nodes) {
            Graph.nodes[node].onmouseover = null;
            Graph.nodes[node].onmouseout = null;
        }*/
        //Graph.moveNode(event, nodeGroup);
        if (!Graph.autoConnect && !nodeGroup.alreadySelected) {
            Graph.deselectOnRelease = true;
        }
        else {
            Graph.deselectOnRelease = false;
        }
    };
};

//mouse up on a node
Graph.releaseNode = function (event) {
    var node = event.currentTarget;
    if (Graph.deselectOnRelease) {
        Graph.deselectNode(node);       
        for (var adj in node.adjacentNodes) {
            var adjNode = node.adjacentNodes[adj];
            if (adjNode.nodeNum < node.nodeNum) {
                adjNode.edges[node.nodeNum].removeAttributeNS(null, "stroke");
            }
            else {
                node.edges[adjNode.nodeNum].removeAttributeNS(null, "stroke");
            }
        }
    }
    /*for (var node in Graph.nodes) {
        var nextNode = Graph.nodes[node];
        nextNode.addEventListener("mouseover", Graph.highlightEdges, false);
        nextNode.addEventListener("mouseout", Graph.highlightEdges, false);
    }*/
    //Graph.plane.removeEventListener("mousemove",,false);
    Graph.deselectOnRelease = false;
    Graph.plane.onmousemove = null;
};

//select a node
Graph.selectNode = function (node, addToHistory, nodeList) {
    if (addToHistory) {
        Graph.clipboard.addToHistory({
            'name': "Selected node",
            'nodes': nodeList
        });
    }

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
Graph.deselectNode = function (node, addToHistory) {
    if (addToHistory) {
        Graph.clipboard.addToHistory({
            'name': "Deselected node",
            'node': node.nodeNum,
        });
    }

    Graph.changeNodeColor(node, "red", "white");
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

//select all nodest
Graph.selectAllNodes = function (addToHistory) {
    if (addToHistory) {
        Graph.clipboard.addToHistory({
            'name': "Selected all nodes",
            'nodes': (function(nodeList){
                for(var node in Graph.nodes){
                    nodeList.push(node);
                }
                return nodeList;
            })([])
        });
    }

    for (var node in Graph.nodes) {
        Graph.selectNode(Graph.nodes[node], false);        
    }
};

//deselect all nodes
Graph.deselectAllNodes = function (addToHistory) {
    if (addToHistory) {
        Graph.clipboard.addToHistory({
            'name': "Deselected all nodes",
            'nodes': (function (nodeList) {
                for (var node in Graph.selectedNodes) {
                    nodeList.push(node);
                }
                return nodeList;
            })([])
        });
    }

    for (var node in Graph.selectedNodes) {
        Graph.deselectNode(Graph.selectedNodes[node], false);
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
Graph.invert = function (addToHistory) {
    var length = Graph.numberOfNodes;
    for (var n = 0; n < length; n++) {
        if (Graph.nodes[n]) {
            var node = Graph.nodes[n];
            Graph.selectNode(node, false)
        }
        else {
            var node = Graph.selectedNodes[n];
            Graph.deselectNode(node, false);
        }

    }

    if (addToHistory) {
        Graph.clipboard.addToHistory({
            'name': "Inverted"
        });
    }
};

//expand
Graph.expand = function (addToHistory) {
    var initialSelected = Graph.numberOfSelectedNodes;
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
        Graph.selectNode(Graph.nodes[expandList[node]], false);        
    }
    var finalSelected = Graph.numberOfSelectedNodes;
    
    if (addToHistory) {
        if (finalSelected > initialSelected) {
            Graph.clipboard.addToHistory({
                'name': "Expanded",
                'nodes': expandList
            });

        }
    }
};

//create an edge between two nodes
Graph.createEdge = function (node1, node2, addToHistory, edgesList) {
    var pair = Graph.sortNodePair(node1, node2);
    var lowNode = pair.lowNode;
    var highNode = pair.highNode;

    var lowNodeMP = lowNode.findMidpoint();
    var highNodeMP = highNode.findMidpoint();
    var edge = document.createElementNS(xmlns, "path");
    edge.selected = false;
    edge.setAttributeNS(null, "d", "M " + lowNodeMP.x + "," + lowNodeMP.y + " " + highNodeMP.x + "," + highNodeMP.y);
    Graph.edgesGroup.appendChild(edge);
    if (node1.selected && node2.selected) {
        Graph.selectEdge(edge);
    }
    lowNode.edges[highNode.nodeNum] = edge;
    node1.adjacentNodes[node2.nodeNum] = node2;
    node2.adjacentNodes[node1.nodeNum] = node1;

    if (addToHistory) {
        Graph.clipboard.addToHistory({
            'name': "Created/Deleted edges",
            'edgesList': edgesList
        });
    }
};

//delete an edge between two nodes
Graph.deleteEdge = function (node1, node2, addToHistory, edgesList) {
    var pair = Graph.sortNodePair(node1, node2);
    var lowNode = pair.lowNode;
    var highNode = pair.highNode;

    var edge = lowNode.edges[highNode.nodeNum];
    edge.parentNode.removeChild(edge);
    delete lowNode.edges[highNode.nodeNum];
     
    delete node1.adjacentNodes[node2.nodeNum];
    delete node2.adjacentNodes[node1.nodeNum];

    if (addToHistory) {
        Graph.clipboard.addToHistory({
            'name': "Created/Deleted edges",
            'edgesList': edgesList
        });
    }
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

//move a node
Graph.moveNode = function (event, nodeGroup, addToHistory) {
    //moved inline - probably shouldnt do this
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

Graph.viewClipBoard = function () {

    function SVGWindow(innerColor, borderColor, x, y, width, height) {

    }

    var clipBoardWindow = document.createElementNS(xmlns, "g");
    clipBoardWindow.id = "clipBoard";
    
    var clipBoardDoc = document.createElementNS(xmlns, "rect");
    clipBoardDoc.setAttributeNS(null, "x", "50");
    clipBoardDoc.setAttributeNS(null, "y", "50");
    clipBoardDoc.setAttributeNS(null, "width", "500");
    clipBoardDoc.setAttributeNS(null, "height", "500");
    //clipBoardDoc.setAttributeNS(null, "rx", "5");
    clipBoardDoc.setAttributeNS(null, "fill", "black");
    clipBoardDoc.setAttributeNS(null, "stroke", "red");
    clipBoardDoc.setAttributeNS(null, "stroke-width", "5");
    clipBoardDoc.style.cursor = "e-resize";
    clipBoardDoc.setAttributeNS(null, "pointer-events", "stroke");
    clipBoardWindow.appendChild(clipBoardDoc);

    var button = document.createElementNS(xmlns, "rect");
    button.setAttributeNS(null, "x", "50");
    button.setAttributeNS(null, "y", "50");
    button.setAttributeNS(null, "width", "100");
    button.setAttributeNS(null, "height", "50");
    button.setAttributeNS(null, "fill", "black");
    button.setAttributeNS(null, "stroke", "red");
    button.setAttributeNS(null, "stroke-width", "5");
    //button.setAttributeNS(null, "rx", "1");
    clipBoardWindow.appendChild(button);

    /*var clipBoardEdge = document.createElementNS(xmlns, "rect");
    clipBoardEdge.setAttributeNS(null, "x", "50");
    clipBoardEdge.setAttributeNS(null, "y", "50");
    clipBoardEdge.setAttributeNS(null, "width", "500");
    clipBoardEdge.setAttributeNS(null, "height", "500");
    //clipBoardEdge.setAttributeNS(null, "rx", "5");
    clipBoardEdge.setAttributeNS(null, "fill", "none");
    clipBoardEdge.setAttributeNS(null, "stroke", "red");
    clipBoardEdge.setAttributeNS(null, "stroke-width", "5");
    clipBoardWindow.appendChild(clipBoardEdge);*/

    root.appendChild(clipBoardWindow);
    clipBoardWindow.addEventListener("mousedown", function (event) {
        //clipBoardWindow.drawBoundingRect();
        var startX = event.pageX - clipBoardWindow.getCTM().e;
        var startY = event.pageY - clipBoardWindow.getCTM().f;
        root.addEventListener("mousemove", moveCBWindow, false);
        root.addEventListener("mouseup", function releaseCBWindow(event) {
            root.removeEventListener("mousemove", moveCBWindow, false);
            root.removeEventListener("mouseup", releaseCBWindow, false);
        }, false);

        function moveCBWindow(event) {
            clipBoardWindow.setAttributeNS(null, "transform", "translate(" + (event.pageX - startX) + "," + (event.pageY - startY) + ")");            
        }
        
    }, false);

};

//extrude - 
Graph.extrude = function (addToHistory) {
    //THE EXTRUDE COPY NEEDS TO GO THE THE CLIPBOARD THEN BE TAKEN AWAY BECAUSE WE DONT WANT TO OVERWRITE WHAT THE USER HAD COPIED ON THE CLIPBOARD
    Graph.clipboard.copy(true);
    Graph.clipboard.paste(true);
    if (addToHistory) {
        Graph.clipboard.addToHistory({
            'name': "Extruded"
        });
    }
};

//scale -
Graph.scale = function () {
    alert("Scale in progress");
}
 
//complement - removes original edges, and creates new edges between it and nodes it was not originally adjacent to
Graph.complement = function (addToHistory) {
    if (addToHistory) {
        Graph.clipboard.addToHistory({
            'name': "Complemented nodes",
            'deselectOnUndo': Graph.numberOfSelectedNodes === 0 ? true : false
        });
    }

    if (Graph.numberOfSelectedNodes == 0) {
        Graph.selectAllNodes(false);
    }

    for (var node in Graph.selectedNodes) {
        var nextNode = Graph.selectedNodes[node];
        for (var adj in Graph.selectedNodes) {
            var adjNode = Graph.selectedNodes[adj];
            if (nextNode.nodeNum < adjNode.nodeNum) {
                if (nextNode.edges[adj]) {
                    Graph.deleteEdge(nextNode, adjNode, false);
                }
                else {
                    Graph.createEdge(nextNode, adjNode, false);
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
    Graph.shortestPaths = create2DArray(Graph.numberOfSelectedNodes);

    for (var src = 0; src < Graph.numberOfSelectedNodes; src++)
    {
        for (var dest = 0; dest < Graph.numberOfSelectedNodes; dest++)
        {
            if (Graph.adjacencyMatrix[src][dest] == 0)
            {
                Graph.shortestPathLengths[src][dest] = Infinity;	 
            }
            else
            {
                Graph.shortestPathLengths[src][dest] = 1;
                Graph.shortestPaths[src][dest] = dest.toString();
            }
        }

        Graph.shortestPathLengths[src][src] = 0;
    }

    for (var mid=0; mid<Graph.numberOfSelectedNodes; mid++)
    {
        for (var src=0; src<Graph.numberOfSelectedNodes; src++)
        {
            for (var dest=0; dest<Graph.numberOfSelectedNodes; dest++)
            {			
                if(src === mid || mid === dest || src === dest){
                    continue;
                }
                else if ((Graph.shortestPathLengths[src][mid] + Graph.shortestPathLengths[mid][dest]) < Graph.shortestPathLengths[src][dest])
                {
                    Graph.shortestPathLengths[src][dest] = (Graph.shortestPathLengths[src][mid] + Graph.shortestPathLengths[mid][dest]);
                    Graph.shortestPaths[src][dest] = (Graph.shortestPaths[src][mid].toString() + "," + Graph.shortestPaths[mid][dest].toString());
                }
            }
        }
    }
};

//RUN GRAVITY
Graph.runGravity = function () {
    Graph.findShortestPaths();
    var nodes = Graph.selectedNodes;
    var returnNodeQueue = [];
    var equidistantPaths = [];
    console.log("Nodes:", nodes);
    //look into where you go already have the gravity path and dont need to come back to it
    //say you are going from 1-->2 and you find 1-->3 on the way - i dont need to actually calculate that for the next src/dest combo - i have it already
    //this probably doesnt work at all because the choices will change based on the dest but just a thought that it may possible work in some situations
    for (var src = 0; src < Graph.numberOfSelectedNodes; src++) {
        for (var dest = 0; dest < Graph.numberOfSelectedNodes; dest++) {
            if (src === dest || Graph.adjacencyMatrix[src][dest] === true) {
                continue;
            }
            console.log("Source:", src);
            console.log("Dest:", dest);
            var currentNode = nodes["node" + src];
            console.log("\tCurrent node:", currentNode.nodeNum);
            var prevVertexes = [];
            prevVertexes[currentNode.nodeNum] = true;
            console.log("\tPrevious vertexes:", prevVertexes);
            var currentPath = "";
            var currentPathLength = 0;
            var destFound = false;
            while (!destFound) {
                var adjNodes = currentNode.adjacentNodes;
                console.log("\tadjacent nodes:", adjNodes);
                var bestGravDist = Infinity;
                var bestGravChoice;
                var equidistanceProblem = false;
                //use adj matrix for adjNodes instead
                for (var adjNodeNum in adjNodes) {                    
                    var adjNode = adjNodes[adjNodeNum];                    
                    //need a check for cycle - done i think - think it goes one step extra for the equidistant cases- have a check for adj to dest below
                    if (!prevVertexes[adjNode.nodeNum]) {
                        console.log("\tPrevious vertex? -", adjNode.nodeNum, " - No");
                        var gravDist = Math.abs(dest - adjNode.nodeNum);
                        if (gravDist < bestGravDist) {
                            equidistanceProblem = false;
                            bestGravDist = gravDist;
                            bestGravChoice = adjNode.nodeNum;
                        }
                        else if (gravDist === bestGravDist) {
                            equidistanceProblem = true;
                            if (adjNode.nodeNum < dest) {
                                bestGravChoice = adjNode.nodeNum;
                            }
                        }
                    }
                    else {
                        console.log("\tPrevious vertex? -", adjNode.nodeNum, " - Yes");
                    }
                }
                if (bestGravDist === Infinity) {
                    console.log("\tCaught in loop!");
                    return false;
                    continue;
                }
                console.log("\tBest choice:", bestGravChoice);
                if (equidistanceProblem) {
                    var returnNodeNum = (dest + bestGravDist);
                    
                    console.log("\tEquidistance between:", bestGravChoice,"and", returnNodeNum);
                    returnNodeQueue.push({
                        'nodeNum': returnNodeNum,
                        'pathTo': (currentPath === "" ? returnNodeNum.toString() : (currentPath + "," + returnNodeNum))
                    });
                }
                currentPath += currentPath === "" ? bestGravChoice : ("," + bestGravChoice);
                currentPathLength++;
                console.log("\tCurrent path:", currentPath);
                console.log("\tCurrent path length", currentPathLength);

                if (Graph.adjacencyMatrix[bestGravChoice][dest] === true || bestGravChoice === dest) {
                    console.log("\tDest found!", src, "-->", dest);
                    if (bestGravChoice !== dest) {
                        currentPath += "," + dest;
                        currentPathLength++;
                    }
                    if (Graph.shortestPathLengths[src][dest] !== currentPathLength) {
                        console.log("Graph is not gravitational - the gravity path from", src, "to", dest, "is of length", currentPathLength, " and the shortest path length is", Graph.shortestPathLengths[src][dest]);
                        return false;
                    }
                    else if (returnNodeQueue.length !== 0) {
                        equidistantPaths.push(currentPath);
                        nextInQueue = returnNodeQueue.pop();
                        currentNode = nodes["node" + nextInQueue.nodeNum];
                        currentPath = nextInQueue.pathTo;
                        console.log("\tReturn to node:", currentNode.nodeNum);
                        console.log("\tCurrent path:", currentPath);
                        prevVertexes = [];
                        prevVertexes[src] = true;
                        var currentPathNodes = currentPath.split(",");
                        currentPathLength = currentPathNodes.length;
                        for (var n = 0; n < currentPathLength; n++) {
                            var nextNode = currentPathNodes[n];
                            prevVertexes[nextNode] = true;
                        }
                        console.log("\tPrevious vertexes:", prevVertexes);
                    }
                    else {
                        destFound = true;
                        currentPathLength = 0;
                        console.log("All gravity paths:", src, "-->", dest, "are gravitational!  Moving on...");
                    }
                }
                else {
                    currentNode = nodes["node" + bestGravChoice];
                    console.log("current node:", currentNode.nodeNum);
                    prevVertexes[currentNode.nodeNum] = true;
                    console.log("previous vertexes:", prevVertexes);                    
                }
                alert("Click to continue");
            }

            /*if (Graph.shortestPathLengths[src][dest] !== currentPathLength) {
                console.log("shortest path lengths:", Graph.shortestPathLengths[src][dest], currentPathLength);
                return false;
            }*/
        }
    }
    return true;
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
    var arr = [1, 2, 3];
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
    console.log("Object -", (end - start) / 1000);
};