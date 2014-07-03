
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
//NEED TO JUST FINISH REDO FOR connect/disconnect nodes and then the clipboard is almost done
//I imagine any events bound to the window are not good for library purposes?
//check if you are consistent with mousedown, mousemove, and mouseup, namely should up be root or the object? -- and make sure all your mouseups remove themselves
//mousemoves all on the root?
//remove 'addToHistory' aspect of all methods and redo the clipboard
//add enter key and esc functionality - ok/accept on top most window and close top most window respectively
//add your own 'tabIndex' to nodes
// all worst cases to asure of no bugs - example: user clicks run gravity when there are no nodes created
//prolly should replace all 'click' with 'mouseup'...
//i need to have resize capability - not ON resize but after they mouseup and the window size has changed

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
    var xmlns = "http://www.w3.org/2000/svg";
    var xlink = "http://www.w3.org/1999/xlink";
    var svgXmlNs = "http://www.w3.org/2000/xmlns/";

    //make a global.js for root, namespaces, etc.
    var root = document.documentElement;
    var parentSVG = document.getElementById("parentSVG");
    //prevent text highlighting
    root.addEventListener("mousedown", function (event) { event.preventDefault(); }, false);

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

    //add findMidPoint method to the SVGGElement prototype
    SVGGElement.prototype.findMidpoint = function findMidpoint() {
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

    window.addEventListener("keyup", function (event) {//prolly should be keydown
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
                for (var node in Graph.selectedNodes) {
                    var nextNode = Graph.selectedNodes[node];;
                    Graph.deleteNode(nextNode);
                }
                Graph.fixGravityValues();
                break;
            case 65://'a' key
                Graph.selectAllNodes();
                break;
            case 68://'d' key
                Graph.deselectAllNodes();
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
                Graph.complement();
                break;
            case 70://'f' key
                Graph.invert();
                break;
            case 69://'e' key
                Graph.expand();
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
                Graph.deselectAllNodes(false);
                for (var num in copiedItem) {
                    var nextNodeInfo = copiedItem[num];
                    //mouseout isnt trigged so it takes a mouseover/out before the edge highlight triggers
                    var newNode = Graph.createNode((nextNodeInfo.x + offSetX), (nextNodeInfo.y + offSetY), false);
                    Graph.selectNode(newNode, false);
                    if (extrude) {
                        Graph.createEdge(Graph.nodes[nextNodeInfo.origNum], newNode, false);
                    }
                    nextNodeInfo.node = newNode;
                }
                for (var num in copiedItem) {
                    var nextNodeInfo = copiedItem[num];
                    var node1 = nextNodeInfo.node;
                    for (var q = 0; q < nextNodeInfo.edges.length; q++) {
                        var node2 = copiedItem[nextNodeInfo.edges[q]].node;
                        Graph.createEdge(node1, node2, false);
                    }
                }
            },

            'undo': function () {
                if (current !== -1) {
                    var action = historyArray[current--];
                    switch (action.name) {
                        case "Selected node":
                            var nodes = action.nodes;
                            for (var n = 0; n < nodes.length; n++) {
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
                            var nodeNum = action.node.nodeNum;
                            if (!action.edgesList) {
                                var node = Graph.nodes[nodeNum] || Graph.selectedNodes[nodeNum];
                                if (checkEmpty(node.adjacentNodes)) {
                                    action.edgesList = {};
                                    var connectType = action.edgesList.connectType = node.selected ? "auto" : "branch";
                                    var edgesToDelete = action.edgesList.edgesToDelete = [];
                                    for (var adj in node.adjacentNodes) {
                                        if (connectType === "auto") {
                                            Graph.selectNode(Graph.nodes[adj], false);
                                        }
                                        edgesToDelete.push(adj);
                                    }
                                }
                                console.log(action.edgesList);
                            }
                            if (!action.edgesList || (action.edgesList && action.edgesList.connectType === "branch")) {
                                Graph.selectNode(Graph.nodes[nodeNum], false);
                            }
                            //need to fix to select all connected for auto connect, if action.edgesList exists
                            Graph.deleteNode(Graph.selectedNodes[nodeNum], false);
                            break;
                        case "Deleted node":
                            var deletedNodes = action.nodes;
                            console.log(deletedNodes[0].node, deletedNodes[0].edges);
                            /*for (var n = 0; n < deletedNodes.length; n++) {
                                var nextNode = deletedNodes[n];
                                if (nextNode.nodeNum < action.numberOfNodes) {
                                    for (var i = nextNode.nodeNum; i < action.numberOfNodes; i++) {
    
                                    }
                                }
    
                            }*/


                            break;
                        case "Connected/Disconnected nodes":
                            var edgesToCreate = action.edgesList.edgesToCreate;
                            var edgesToDelete = action.edgesList.edgesToDelete;
                            var connectType = action.edgesList.connectType;
                            if (connectType === "auto") {
                                var node1 = Graph.selectedNodes[action.edgesList.node];
                            }
                            else {
                                var node1 = Graph.nodes[action.edgesList.node];
                            }
                            if (edgesToCreate.length > edgesToDelete.length) {
                                for (var n = 0; n < edgesToCreate.length; n++) {
                                    if (connectType === "branch") {
                                        var node2 = Graph.selectedNodes[edgesToCreate[n]];
                                    }
                                    else {
                                        var node2 = Graph.nodes[edgesToCreate[n]];
                                        Graph.selectNode(node2, false);
                                    }
                                    Graph.deleteEdge(node1, node2, false);
                                    if (n < edgesToDelete.length) {
                                        if (connectType === "branch") {
                                            node2 = Graph.selectedNodes[edgesToDelete[n]];
                                        }
                                        else {
                                            node2 = Graph.nodes[edgesToDelete[n]];
                                            Graph.selectNode(node2, false);
                                        }
                                        Graph.createEdge(node1, node2, false);
                                    }
                                }
                            }
                            else {
                                for (var n = 0; n < edgesToDelete.length; n++) {
                                    if (connectType === "branch") {
                                        var node2 = Graph.selectedNodes[edgesToDelete[n]];
                                    }
                                    else {
                                        var node2 = Graph.nodes[edgesToDelete[n]];
                                        Graph.selectNode(node2, false);
                                    }
                                    Graph.createEdge(node1, node2, false);
                                    if (n < edgesToCreate.length) {
                                        if (connectType === "branch") {
                                            node2 = Graph.selectedNodes[edgesToCreate[n]];
                                        }
                                        else {
                                            node2 = Graph.nodes[edgesToCreate[n]];
                                            Graph.selectNode(node2, false);
                                        }
                                        Graph.deleteEdge(node1, node2, false);
                                    }
                                }
                            }
                            if (connectType === "auto") {
                                Graph.deselectNode(node1, false);
                            }
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
                            for (var n = 0; n < nodes.length; n++) {
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
                            node = Graph.createNode(node.X + (Graph.nodeWidth / 2), node.Y + (Graph.nodeHeight / 2), false);
                            if (action.edgesList) {
                                var connectType = action.edgesList.connectType;
                                if (connectType === "auto") {
                                    Graph.selectNode(node, false);
                                }
                                var edgesToCreate = action.edgesList.edgesToDelete;
                                for (var n = 0; n < edgesToCreate.length; n++) {
                                    var adjNode = Graph.selectedNodes[edgesToCreate[n]];
                                    if (connectType === "auto") {
                                        Graph.deselectNode(adjNode, false);
                                    }
                                    Graph.createEdge(node, adjNode, false);
                                }
                            }
                            break;
                        case "Deleted node":
                            break;
                        case "Connected/Disconnected nodes":
                            var edgesToCreate = action.edgesList.edgesToCreate;
                            var edgesToDelete = action.edgesList.edgesToDelete;
                            var connectType = action.edgesList.connectType;
                            var node1 = Graph.nodes[action.edgesList.node];
                            if (edgesToCreate.length > edgesToDelete.length) {
                                for (var n = 0; n < edgesToCreate.length; n++) {
                                    var node2 = Graph.selectedNodes[edgesToCreate[n]];
                                    if (connectType !== "branch") {
                                        Graph.deselectNode(node2, false);
                                    }
                                    Graph.createEdge(node1, node2, false);
                                    if (n < edgesToDelete.length) {
                                        node2 = Graph.selectedNodes[edgesToDelete[n]];
                                        if (connectType !== "branch") {
                                            Graph.deselectNode(node2, false);
                                        }
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
                            if (connectType === "auto") {
                                console.log("hi");
                                Graph.selectNode(node1, false);
                            }
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
    //Graph.numberOfLandmarks = 0;
    //Graph.numberOfVantagePoints = 0;
    Graph.deselectOnRelease = false;
    Graph.selectedSingle = false;
    
    Graph.badGravityReason = null;
    Graph.landmarks = {};
    Graph.vantagePoints = {};
    Graph.gravFlavorings = [];

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
                /*Graph.plane*/root.removeEventListener("mousemove", expandSelectionArea, false);
                Graph.plane.removeEventListener("mouseup", finishSelectionArea, false);
            }
        }
    }, false);

    Graph.plane.background.addEventListener("mouseup", function (event) {
        if (Graph.numberOfSelectedNodes === 0) {
            var createdNode = Graph.createNode(event.pageX, event.pageY);
            if (Graph.autoConnect || Graph.branchConnect) {
                Graph.selectNode(createdNode, false);
            }
        }
        else {
            if (Graph.autoConnect) {
                var createdNode = Graph.createNode(event.pageX, event.pageY);
                for (var node in Graph.selectedNodes) {
                    var currentNode = Graph.selectedNodes[node];
                    Graph.createEdge(currentNode, createdNode, false);
                    Graph.deselectNode(currentNode, false);
                }
                Graph.selectNode(createdNode, false);

            }
            else if (Graph.branchConnect) {
                var createdNode = Graph.createNode(event.pageX, event.pageY);
                for (var node in Graph.selectedNodes) {
                    var currentNode = Graph.selectedNodes[node];
                    Graph.createEdge(currentNode, createdNode, false);
                }
            }
            else if (!Graph.multipleSelect) {
                Graph.deselectAllNodes(true);
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
    Graph.createNode = function (x, y, nodeLabel) {
        var nodeGroup = document.createElementNS(xmlns, "g");
        //nodeGroup.midpoint = { x: x, y: y };
        nodeGroup.adjacentNodes = {};
        nodeGroup.selected = false;
        nodeGroup.nodeNum = nodeGroup.gravityValue = Graph.numberOfNodes++; //changed to pre-increment because it was starting at 0 instead of 1
        nodeGroup.edges = {};
		nodeGroup.color = "red";
		nodeGroup.image = "empty";
		nodeGroup.edgesList = new Array();

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
		Graph.numberOfNodes++;
		var nodeGroup = document.createElementNS(xmlns, "g");
        //nodeGroup.midpoint = { x: x, y: y };
        nodeGroup.adjacentNodes = {};
        nodeGroup.selected = false;
        nodeGroup.nodeNum = nodeGroup.gravityValue = node.gravityValue;
        nodeGroup.edges = {};
		nodeGroup.color = node.color;
		nodeGroup.image = node.image;
		nodeGroup.edgesList = node.edges;

        var nodeRect = nodeGroup.rect = document.createElementNS(xmlns, "rect");
        nodeRect.setAttributeNS(null, "rx", "2.5");
        nodeRect.setAttributeNS(null, "fill", "red");
        nodeRect.setAttributeNS(null, "stroke", "black");
        nodeRect.setAttributeNS(null, "stroke-width", "2.5");
        nodeRect.setAttributeNS(null, "x", nodeGroup.X = (node.X - (Graph.nodeWidth / 2)));
        nodeRect.setAttributeNS(null, "y", nodeGroup.Y = (node.Y - (Graph.nodeHeight / 2)));
        nodeRect.setAttributeNS(null, "height", Graph.nodeHeight);
        nodeRect.setAttributeNS(null, "width", Graph.nodeWidth);
        nodeGroup.appendChild(nodeRect);

        var nodeText = nodeGroup.text = document.createElementNS(xmlns, "text");
        nodeText.textContent = nodeGroup.nodeLabel = node.label;
        nodeText.setAttributeNS(null, "pointer-events", "none");
        nodeText.setAttributeNS(null, "text-anchor", "middle");
        nodeText.setAttributeNS(null, "alignment-baseline", "middle");
        nodeText.setAttributeNS(null, "fill", "white");
        nodeText.setAttributeNS(null, "font-family", "Arial");
        nodeText.setAttributeNS(null, "font-size", "12");
        nodeText.setAttributeNS(null, "font-weight", "bold");
        nodeText.setAttributeNS(null, "x", nodeText.X = node.X);
        nodeText.setAttributeNS(null, "y", nodeText.Y = node.Y);
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
                'numberOfNodes': Graph.numberOfNodes
            });
        }
    };

    //mousedown on a node
    Graph.pressHoldNode = function (event) {
        var nodeGroup = event.currentTarget;
        if (Graph.numberOfSelectedNodes === 0) {
            Graph.selectNode(nodeGroup);
            Graph.selectedSingle = true;
            Graph.deselectOnRelease = false;
        }
        else {
            if (Graph.multipleSelect) {
                if (nodeGroup.selected) {
                    Graph.deselectNode(nodeGroup);
                    Graph.deselectOnRelease = false;
                }
                else {
                    Graph.selectNode(nodeGroup);
                    Graph.deselectOnRelease = false;
                }

            }
            else {
                if (!nodeGroup.selected) {
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
            initialCoords[node] = { 'x': nextNode.X, 'y': nextNode.Y };
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
        /*Graph.plane*/root.addEventListener("mousemove", moveNode, false);

        function moveNode(event) {
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
                        nextText.setAttributeNS(null, "x", nextText.X = coords.x + changeX + rectXOffset + (Graph.nodeWidth / 2));
                        nextText.setAttributeNS(null, "y", nextText.Y = coords.y + changeY + rectYOffset + (Graph.nodeHeight / 2));

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
            /*Graph.plane*/root.removeEventListener("mousemove", moveNode, false);
            Graph.plane.removeEventListener("mouseup", release, false);
        }, false);
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
                'nodes': (function (nodeList) {
                    for (var node in Graph.nodes) {
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
        edge.selected = false; //edge.parentNode === selectedEdgesGroup?
        edge.setAttributeNS(null, "d", "M " + (lowNodeMP.x) + " " + (lowNodeMP.y) + " " + highNodeMP.x + " " + highNodeMP.y);
        Graph.edgesGroup.appendChild(edge);
        if (node1.selected && node2.selected) {
            Graph.selectEdge(edge);
        }
		node1.edgesList.push(node2.nodeNum);
		node2.edgesList.push(node1.nodeNum);
		
        lowNode.edges[highNode.nodeNum] = edge;
        node1.adjacentNodes[node2.nodeNum] = node2;
        node2.adjacentNodes[node1.nodeNum] = node1;

        if (addToHistory) {
            Graph.clipboard.addToHistory({
                'name': "Connected/Disconnected nodes",
                'edgesList': edgesList
            });
        }
    };
	
	Graph.connectNodes = function(addToHistory, edgesList) {
		
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
				}//end if
				
			}//end for y
		}//end for x
	
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
                'name': "Connected/Disconnected nodes",
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

        /*function SVGWindow(innerColor, borderColor, x, y, width, height) {
    
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
        //clipBoardDoc.setAttributeNS(null, "pointer-events", "stroke");
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
        //clipBoardWindow.appendChild(button);
        */
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

        /*root.appendChild(clipBoardWindow);
        clipBoardWindow.addEventListener("mousedown", function (event) {
            clipBoardWindow.drawBoundingRect();
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
            
        }, false);*/

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
		alert("inside scale");
        Graph.createScaleSlider();
    }
	
	//createScaleSlider
	Graph.createScaleSlider = function () {
		
		sliderGroup = document.createElementNS(xmlns,"g");
		sliderGroup.setAttributeNS(null,"id","scaleSlider");
		var sliderRect = document.createElementNS(xmlns,"rect");
		sliderRect.setAttributeNS(null,"height","40");
		sliderRect.setAttributeNS(null,"width","140");
		sliderRect.setAttributeNS(null,"x","120");
		sliderRect.setAttributeNS(null,"y","100");
		sliderRect.setAttributeNS(null,"rx","5");
		sliderRect.setAttributeNS(null,"ry","5");
		sliderRect.setAttributeNS(null,"fill","blue");
		sliderRect.setAttributeNS(null,"stroke-width","2");
		sliderRect.setAttributeNS(null,"stroke","orange");
		
		sliderRect.addEventListener("onmousedown", function () { alert("work!!!")} ,false);
		
		sliderGroup.appendChild(sliderRect);
		parentSVG.appendChild(sliderGroup); //adds the slider on top of the Graph.plane so it is in front
		
	}//end createScaleSlider
	
	Graph.moveScaleSlider = function (event){
		alert("inside moveScaleSlider");
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

    Graph.checkCurrentFlavoring = function () {
        //do a warning here instead
        if (Graph.numberOfSelectedNodes === 0) {
            Graph.selectAllNodes();
            //SVGMsgBox(parentSVG, "No nodes are selected!  Would you like to check the current flavoring with all nodes selected?", Graph.selectAllNodes);
        }
        Graph.findShortestPaths();

        if (Graph.runGravity(true)) {
            var message = "Graph is gravitational!";
        }
        else {
            var message = Graph.badGravityReason + " Would you like to check other permutations?";
        }
        SVGMsgBox(parentSVG, message, Graph.findGravFlavoring);
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
                    if(current !== 0){
                        var currentFlavoring = Graph.gravFlavorings[current];
                        var previousFlavoring = Graph.gravFlavorings[current-1];
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
        }
        var indexLoc = 0;
        var numNodes = Graph.numberOfSelectedNodes;
        var used = new Array(numNodes);
        var initial = [];
        var gravValues = new Array(numNodes);
        for (var i = 0; i < numNodes; i++) {
            initial[i] = i;
        }
        
        permute(0);

        if (Graph.gravFlavorings.length === 0) {
            SVGMsgBox(parentSVG, "Sorry, there were no gravitational permutations found for this graph.");
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

            SVGMsgBox(parentSVG, "There were " + Graph.gravFlavorings.length + " gravitational permutations found for this graph! One possible permutation is being displayed.");
            var currentPermNum = 0;
            showPermutation(currentPermNum);

            //this event listener needs to be removed at some point
            window.addEventListener("keydown", function () {
                if (event.keyCode === 37) {
                    if (currentPermNum === 0) {
                        currentPermNum = Graph.gravFlavorings.length-1;
                    }
                    else{
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
}, false);