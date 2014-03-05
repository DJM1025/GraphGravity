/****************************************************************** CheckAllPermutations */
function CheckAllPermutations() {
    adjacencyMatrix();
    run_gravity();
    Permute(sz);//@@@@@@@@@@@@@@@@@@@@@@@@

}

/*********************************************************************** adjacencyMatrix     
 * Adjacency matrix creation takes the node & edges and outputs 
 * an adjacency matrix array. 
 * Then Proceeds to work gravity through Exhaustive */
function adjacencyMatrix() {
    adjMatrix = getAdjMatrix();
    sz = adjMatrix.length;
    //var strcpy = new String();
    msg = new String();
    for (var i = 0; i < adjMatrix.length; i++) {
        msg += "[";
        for (var j = 0; j < adjMatrix[i].length; j++) {
            (j == adjMatrix[i].length - 1) ? msg += adjMatrix[i][j].toString() : msg += adjMatrix[i][j].toString() + ", ";
        }
        msg += "]\n";
    }
    //declaration of all testing string variables below
    shortestdistances = new String();
    allshortestpaths = new String();
    pathvsgravity = "";
    //results ="";
    GravityReturn0 = "";
    allgravperms = "";
    //end test variable declaration.
    Exhaustive();
}

/************************************************************************* Create2DArray */
function Create2DArray() {
    var arr = new Array();

    for (var i = 0; i < sz; i++) {
        arr[i] = new Array();
    }

    return arr;
}

/************************************************************************* Create3DArray */
function Create3DArray() {
    var arr = new Array();
    for (var i = 0; i < sz; i++) {
        arr[i] = new Array();
        for (var j = 0; j < sz; j++) {
            arr[i][j] = new Array();
        }
    }
    return arr;
}

/*************************************************************************** removeNodes 
 * Will remove all selected nodes. */
graph.prototype.removeNodes = function (evt) {
    for (var i in Graph.SelectedNodes) {  //Deletes all selected node objects.  
        for (var j in Graph.Nodes[i].edges) {  //Walks thru nodes and deletes edges first 
            Graph.Nodes.removeEdge(Graph.Nodes[j], Graph.SelectedNodes[i]);
        }
        Graph.Canvas.Nodes.removeChild(Graph.SelectedNodes[i]);
        delete Graph.SelectedNodes[i];
        delete Graph.Nodes[i];
    }
    logAction("removed sub graph");
}

/**************************************************************************** Exhaustive */
function Exhaustive() {
    var i, j, k, thirdDimSize;
    PathLengths = Create2DArray();
    Paths = Create3DArray();
    var eqPathsSrcMid = 0;//num of equadistant paths from source node to middle node
    var eqPathsMidDest = 0;//num of equadistant paths from middle node to destination node
    var thirdDimSize = 0;//probably don't need this as I can just declare a new array
    for (i = 0; i < sz; i++) {
        for (j = 0; j < sz; j++) {
            if (adjMatrix[i][j] == 0) {
                PathLengths[i][j] = 9999999999;
            }
            else {
                PathLengths[i][j] = 1;
                Paths[i][j][0] = j;
            }
        } //end of j loop
        PathLengths[i][i] = 0;
    } //end of i loop
    for (k = 0; k < sz; k++)//start k (middle node)
    {
        for (i = 0; i < sz; i++)//start i (src node)
        {
            for (j = 0; j < sz; j++)//start j (dest node)
            {
                //doesnt work because it hasnt got to the second portion of the path yet
                if (PathLengths[i][k] == 0 || PathLengths[k][j] == 0) {
                    continue;
                }
                else if (PathLengths[i][k] + PathLengths[k][j] < PathLengths[i][j]) {
                    /*thirdDimSize=Paths[i][j].length
                    for(var h=0;h<thirdDimSize;h++){
                      Paths[i][j].pop();
                    }*/
                    Paths[i][j] = new Array();
                    PathLengths[i][j] = PathLengths[i][k] + PathLengths[k][j];

                    eqPathsSrcMid = Paths[i][k].length;
                    eqPathsMidDest = Paths[k][j].length;

                    if (eqPathsSrcMid > 1 || eqPathsMidDest > 1) {
                        for (var t = 0; t < eqPathsSrcMid; t++) {
                            for (var y = 0; y < eqPathsMidDest; y++) {
                                Paths[i][j].push(Paths[i][k][t].toString() + "," + Paths[k][j][y].toString())
                            }
                        }
                    }

                    else {
                        Paths[i][j].push(Paths[i][k][0].toString() + "," + Paths[k][j][0].toString());
                    }


                }
                else if (PathLengths[i][k] + PathLengths[k][j] == PathLengths[i][j]) {
                    eqPathsSrcMid = Paths[i][k].length;
                    eqPathsMidDest = Paths[k][j].length;

                    if (eqPathsSrcMid > 1 || eqPathsMidDest > 1) {
                        for (var t = 0; t < eqPathsSrcMid; t++) {
                            for (var y = 0; y < eqPathsMidDest; y++) {
                                Paths[i][j].push(Paths[i][k][t].toString() + "," + Paths[k][j][y].toString())
                            }
                        }
                    }

                    else {
                        Paths[i][j].push(Paths[i][k][0].toString() + "," + Paths[k][j][0].toString());
                    }
                }

            }//end j	
        }//end i
    }//end k

    //for test purposes only
    shortestdistances += "Final Shortest distances:\n";
    for (row = 0; row < sz; row++) {
        for (col = 0; col < sz; col++) {
            shortestdistances += PathLengths[row][col].toString() + ",";
        }
        shortestdistances += "\n";
    }
    allshortestpaths += "End of All pairs Shortest paths\n"
    for (row = 0; row < sz; row++) {
        for (col = 0; col < sz; col++) {
            if (col != row) {
                allshortestpaths += "path from " + row + " to " + col + " is " + row + "," + Paths[row][col] + "";
            }
            allshortestpaths += "\n";
        }

    }
    //run_gravity();
} //end exhaustive

/*************************************************************************** run_gravity */
function run_gravity() {
    Gravity = new Array();
    for (i = 0; i < sz; i++) {
        Gravity[i] = i + 1;
    }
    //Permute(sz);
}

/******************************************************************************* Permute */
function Permute(n) {
    holder = "";
    d = sz;
    var initialGravity = new Array();
    var initialAdjMatrix = Create2DArray();
    for (var i = 0; i < sz; i++) {
        initialGravity[i] = Gravity[i];
        for (var j = 0; j < sz; j++) {
            initialAdjMatrix[i][j] = adjMatrix[i][j];
        }
    }
    if (subgraph == 0) {
        do {
            for (var i = 0; i < sz; i++) {
                //document.getElementById("g"+(i+1)).firstChild.nextSibling.firstChild.nodeValue=Gravity[i]+1;
                for (var j = 0; j < sz; j++) {
                    if (initialAdjMatrix[initialGravity[i]][initialGravity[j]] == 1) {
                        adjMatrix[Gravity[i]][Gravity[j]] = 1;
                    }
                    else {
                        adjMatrix[Gravity[i]][Gravity[j]] = 0;
                    }
                }
            }
            Exhaustive();
            if (CheckGravity(0) != 0) {
                results = 1;
                numOfPermutations++;
                CorrectGravity[CorrectIndex] = Gravity.toString();
                CorrectGravity[CorrectIndex] = CorrectGravity[CorrectIndex].split(",");
                CorrectIndex++;

            }
        } while (nextPerm());
    }
    else {
        do {
            if (CheckGravity(1) != 0) {
                results = 1;
                numOfPermutations++;
                CorrectGravity[CorrectIndex] = Gravity.toString();
                CorrectGravity[CorrectIndex] = CorrectGravity[CorrectIndex].split(",");
                CorrectIndex++;
            }
        } while (nextPerm());
    }
}

/****************************************************************************** nextPerm */
function nextPerm(n) {
    var i, j, k, swap, s, si;

    for (k = d - 2; k >= 0; k--) {
        if (Gravity[k] < Gravity[k + 1]) {
            s = Gravity[k + 1];
            si = k + 1;
            for (i = k + 2; i < d; i++) {
                if ((Gravity[i] > Gravity[k]) && (Gravity[i] < s)) {
                    s = Gravity[i];
                    si = i;
                }
            }
            swap = Gravity[si];
            Gravity[si] = Gravity[k];
            Gravity[k] = swap;
            for (i = k + 1; i < d - 1; i++) {
                for (j = i + 1; j < d; j++) {
                    if (Gravity[i] > Gravity[j]) {
                        swap = Gravity[i];
                        Gravity[i] = Gravity[j];
                        Gravity[j] = swap;
                    }
                }
            }
            return (true);
        }
    }
    return (false);
}

/************************************************************************** CheckGravity */
function CheckGravity(subgraph) {
    var goodGravity = true;
    var stringPath = ""
    var path = "";
    var currentSrc = 0;
    var shortestPaths = new Array();
    var nextVertex = 0;
    var prevV = false;
    var prevVertexes = new Array();
    var shortestPathsSub;
    var shortestPathsLength = 0;
    var currentVertex = 0;
    var gravDistance = 0;
    var lowestGravDistance = 999999;
    var nextVertexGravDistance = 0;
    landmarks = new Array();//maybe make public? or add to the graph object?
    vantagePoints = new Array();//maybe make public? or add to the graph object?
    //initialize landmark and vantage points arrays - assume all are VPs and LMs and take away as we find them not to be
    for (var i = 0; i < sz; i++) {
        landmarks[i] = i;
        vantagePoints[i] = i;
    }
    pathFound = false;
    //adjacencyMatrix();
    for (var srce = 0; srce < sz; srce++) {//begin srce
        //console.log("Source node: "+srce);
        for (var dest = 0; dest < sz; dest++) {//begin dest
            //console.log("Destination node: "+dest);
            if (srce == dest) {
                continue;
            }
            else if (adjMatrix[srce][dest] == 1) {
                continue;
            }
            for (var t = 0; t < Paths[srce][dest].length; t++) {
                path = srce + ",";
                path += Paths[srce][dest][t];
                shortestPaths.push(path.split(","));
                //console.log(path);																				 							 									 
            }
            next://break of next dest											 									 
                for (var i = 0; i < shortestPaths.length; i++) {//begin shortest paths											 
                    nextPath://break of next path										   			 				 
                        for (var j = 0; j < shortestPaths[i].length; j++) {// begin shortest path nodes															 
                            currentSrc = shortestPaths[i][j];
                            prevVertexes[currentSrc] = "X";
                            nextVertex = shortestPaths[i][j + 1];
                            nextVertexGravDistance = Math.abs(nextVertex - dest);
                            if (nextVertexGravDistance == 0) {
                                lowestGravDistance = 999999;
                                pathFound = true;//path is found, need to go to new destination..
                                //console.log("Path - "+shortestPaths[i]+" - is gravitational")
                                prevVertexes = new Array();
                                break next;//break to next dest, maybe just return 1? maybe else?																									
                            }
                            for (var node = 0; node < sz; node++) {//begin node
                                if (adjMatrix[currentSrc][node] == 1 && prevVertexes[node] != "X") {
                                    currentVertex = node;
                                    //console.log("Current vertex is: "+currentVertex);																																																												
                                    gravDistance = Math.abs(currentVertex - dest);
                                    if (gravDistance < lowestGravDistance) {
                                        lowestGravDistance = gravDistance;
                                        //console.log("Lowest gravity distance: "+lowestGravDistance)																																 				   																		
                                    }
                                }
                            }//end node							 		 
                            if (nextVertexGravDistance > lowestGravDistance) {//if 										 																 																	 
                                lowestGravDistance = 999999;
                                prevVertexes = new Array();
                                break nextPath; //path is bad, go to next path										 
                            }
                            else {
                                lowestGravDistance = 999999;
                                prevVertexes[currentVertex] = "X";
                                //console.log("Path good so far");
                            }
                        }//end shortest path nodes 														 													 																																	 														 
                    prevVertexes = new Array();
                }//end shortest paths
            if (!pathFound) {//might need to check where this is reset
                goodGravity = false;
                GravityBadReason = "Permuation Invalid - There is no gravitational path from " + (srce + 1) + " to " + (dest + 1) + "!";
                //console.log(GravityBadReason);										
                vantagePoints[srce] = "X";
                landmarks[dest] = "X";
                //return 0; commented out for landmark/vantage point checking
                return 0;
            }
            lowestGravDistance = 999999;
            shortestPaths = new Array();
            prevVertexes = new Array();
            prevV = false;
            pathFound = false;
        }//end dest
    }//end srce
    if (!goodGravity) {
        //landmarksVantagePoints();
        return 0;
    }
    else {
        //landmarksVantagePoints();
        return 1;
    }
}//end CheckGravity

/**************************************************************** landmarksVantagePoints */
function landmarksVantagePoints() {
    for (var i = 0; i < sz; i++) {//begin i
        if (landmarks[i] !== "X" || vantagePoints[i] !== "X") {//checks to see if node i is a landmark OR a vantage point
            var currentNode = document.getElementById("g" + (i + 1)).firstChild;
            var leftX = parseFloat(currentNode.getAttributeNS(null, "x"));
            var width = parseFloat(currentNode.getAttributeNS(null, "width"));
            var rightX = leftX + width;
            var centerX = (leftX + rightX) / 2
            var topY = parseFloat(currentNode.getAttributeNS(null, "y"));
            var height = parseFloat(currentNode.getAttributeNS(null, "height"));
            var bottomY = topY + height;
            var centerY = (topY + bottomY) / 2;
            var circle = document.createElementNS(xmlns, "circle");
            circle.setAttributeNS(null, "cx", centerX);
            circle.setAttributeNS(null, "cy", centerY);
            circle.setAttributeNS(null, "r", (width / 2) + 10);
            circle.setAttributeNS(null, "stroke-width", "2");
            circle.setAttributeNS(null, "fill", "none");
            var pulse = document.createElementNS(xmlns, "animate");
            pulse.setAttribute("attributeName", "stroke-width");
            pulse.setAttribute("dur", ".5s");
            pulse.setAttribute("values", "3; 7.5; 3");
            pulse.setAttribute("repeatCount", "indefinite");
            if (landmarks[i] !== "X" && vantagePoints[i] !== "X") {//checks to see if node i is both a landmark AND a vantage point
                circle.setAttributeNS(null, "stroke", "purple");
            }
            else if (landmarks[i] !== "X") {//checks to see if node i is ONLY a landmark
                circle.setAttributeNS(null, "stroke", "red");
            }
            else if (vantagePoints[i] !== "X") {//checks to see if node i is ONLY a vantage point
                circle.setAttributeNS(null, "stroke", "blue");
            }
            circle.appendChild(pulse);
            document.getElementById("g" + (i + 1)).appendChild(circle); //crashes page when cursor is focused afterwards
        }//end big if
    }//end i
}//end landmarksVantagePoints
