#include <iostream>
#include <omp.h>
#include <time.h>
#include <sstream>
#include <omp.h>
#include <math.h>
#include <fstream>
#include <string>
#include "pugixml-1.5\src\pugixml.hpp"

using namespace std;
using namespace pugi;
void parseGraph(int ***adjMatrix,int **gravityValues,int ***pathLengths);
void printMatrix(int **ary);
int nextAdjacent(int from, int last,int **adjMatrix,int *currentGravityPath);
void floyd_warshall(int **adjMatrix, int **pathLengths);
bool findGravity(int **adjMatrix,int *gravityValues,int **pathLengths);
void Permute(int *gravityValues,int **adjMatrix,int **pathLengths);
void writeXML(int **adjMatrix, int *gravityValues);
int global_nodes;
string **xmlInfo;
bool flag = true;

int main(){
		int** adjMatrix;
		int** pathLengths;
		int* gravityValues;
		clock_t startT, stopT;

		startT = clock();
		parseGraph(&adjMatrix, &gravityValues, &pathLengths);
	 	floyd_warshall(adjMatrix, pathLengths);
#pragma omp parallel num_threads(4) shared(flag,adjMatrix,pathLengths,gravityValues)
		{
			Permute(gravityValues, adjMatrix, pathLengths);
		}
		stopT = clock();
		float seconds = (float)(stopT - startT) / CLOCKS_PER_SEC;

		cout << "Total Run Time: " << seconds << endl;
		cout << "-------Normal Termination---------------------" << endl;
		system("pause");
}//end main

bool findGravity(int **adjMatrix,int *gravityValues,int **pathLengths)
{
	//bool flag = true;
	int minimum = 0;
	int nextVertex;
	int vertex;
	int temp;
	//int *currentGravityPath = new int [global_nodes];
	int *currentGravityPath;
	int currentPathLength = 0;
	int x=0;
	int absCheck;
	flag = true;

//#pragma omp parallel num_threads(4) shared(adjMatrix,gravityValues,pathLengths,flag) firstprivate(currentPathLength,minimum,x) private(vertex,nextVertex,temp,currentGravityPath) 
	//{
		currentGravityPath = new int[global_nodes];
		for (int i = 0; i < global_nodes; i++)
		{
			currentGravityPath[i] = -1;
		}//end for i
		//cout << "Thread NUM = " << omp_get_thread_num() << " Location of variable = " << &currentGravityPath << endl;
#pragma omp parallel for  
		for (int source = 0; source < global_nodes; source++)
		{
			for (int destination = 0; destination < global_nodes; destination++)
			{
				for (int i = 0; i < global_nodes; i++)
				{
					currentGravityPath[i] = -1;
				}//end for i
				currentPathLength = 0;

				if (flag){
					if (source != destination)
					{
						x = 0;
						currentGravityPath[x] = source;
						nextVertex = source;
						while (nextVertex != destination && nextVertex != -1)//this goes through and determines which node has the gravity path going from it
						{
							vertex = nextAdjacent(nextVertex, -1, adjMatrix, currentGravityPath);
							minimum = gravityValues[vertex] - gravityValues[destination];
							if(minimum < 0)
								minimum = minimum*(-1);
							temp = vertex;
							vertex = nextAdjacent(nextVertex, vertex, adjMatrix, currentGravityPath);
							while (vertex != -1)
							{
								absCheck = gravityValues[vertex] - gravityValues[destination];
								if(absCheck < 0)
									absCheck = absCheck *(-1);
								if (absCheck < minimum)
								{
									minimum = abs(gravityValues[vertex] - gravityValues[destination]);
									temp = vertex;
								}//end if
								vertex = nextAdjacent(nextVertex, vertex, adjMatrix, currentGravityPath);
							}//end inner while
							nextVertex = temp;
							currentGravityPath[x] = temp;//holds the destination node position for the gravity path
							x++;
							currentPathLength++;
						}//end outer while

						//begin checking for the paths by comparing them

						#pragma omp critical
						if (currentPathLength != pathLengths[source][destination])
						{
							//cout << "This graph is improperly flavored" << endl;
							flag = false;
						}

					}//end  if the source destination check
				}
			}//end for destination node
		}//end for source node
		delete[]currentGravityPath;
	//}//end omp parallel region

	if (flag)
	{
		//cout << " This is a valid permutation: ";
		writeXML(adjMatrix, gravityValues);
		return true;
	}
	else
		return false;
		//cout << "Invalid Permutation." << endl;
}//end function findGravity()

void writeXML(int **adjMatrix, int *gravityValues){
	ofstream myfile ("output.xml");
	myfile << "<graph>\n";
	if (myfile.is_open())
	{
		int gravityValue;
		int nodeNum; 
		for(int i = 0; i < global_nodes; i++) {
			myfile << "<node id='" << xmlInfo[i][0] << "' ";
			myfile << "gravityValue='" << gravityValues[i] << "' ";
			myfile << "x='" << xmlInfo[i][1] << "' ";
			myfile << "y='" << xmlInfo[i][2] << "' ";
			myfile << "label='" <<  gravityValues[i] << "' ";
			myfile << "color='" << xmlInfo[i][4] << "'>\n ";
			myfile << "<img src='" << xmlInfo[i][5] << "' />\n";
			
			for (int j = 0; j < global_nodes; j++){
				if (adjMatrix[i][j] == 1)
					myfile << "<edge to = '" << xmlInfo[j][0] << "' />\n";
			}
			myfile << "</node>";
		}
		myfile << "</graph>\n";
		myfile.close();
	}
}

//this function sets the path length distances for all nodes
void floyd_warshall(int **adjMatrix, int **pathLengths)
{
	for(int i =0; i < global_nodes;i++)
	{
		for(int j=0; j < global_nodes;j++)
		{
			if(adjMatrix[i][j] == 0)
				pathLengths[i][j]=99999;
			else
			{
				pathLengths[i][j] =1;
			}//end else
		}// end for j
		pathLengths[i][i] =1;
	}//end for i
	for(int x=0; x < global_nodes;x++)
	{
		for(int y=0; y < global_nodes;y++)
		{
			for(int z=0; z < global_nodes;z++)
			{
				if(pathLengths[y][x] + pathLengths[x][z] < pathLengths[y][z])
				{
					pathLengths[y][z] = pathLengths[y][x] + pathLengths[x][z];
				}
			}//end for z
		}//end for y
	}//end for x
}

void Permute(int *gravityValues,int **adjMatrix,int **pathLengths)
{

	int *permute = new int[global_nodes];
	int count = 1;
	int temp;
	for (int x = 0; x < global_nodes; x++)
		permute[x] = x;

	int i = 1;
	int j;
	bool check = findGravity(adjMatrix, gravityValues, pathLengths); //need to call with initial setup and then do all the permutations
	while (i < global_nodes && !check)
	{

		permute[i]--;
		if (i % 2 == 0)
			j = 0;
		else
			j = permute[i];
		//swap
		temp = gravityValues[j];
		gravityValues[j] = gravityValues[i];
		gravityValues[i] = temp;

		check = findGravity(adjMatrix, gravityValues, pathLengths);

		i = 1;
		while (permute[i] == 0)
		{
			permute[i] = i;
			i++;
		}//end while
		count++;

	}//end outer while
}//end function permute
int nextAdjacent(int from, int last,int **adjMatrix,int *currentGravityPath)
{
	int i = last + 1;
	int index = 0;
	bool found = false;

	while(i < global_nodes)
	{
		if(adjMatrix[from][i] == 1)
		{
			index = 0;
			found = 0;
			while(currentGravityPath[index] != -1 && !found)
			{
				if(currentGravityPath[index] == i)
					found = true;
				else
					index++;
			}//end inner while
		if(!found)
			return i;
		}//end if
		i++;
	}//end while

	return -1;

}//end function nextAdjacent


//parses the graph and creates the adjacency matrix. -- may have to add more to this later
void parseGraph(int ***adjMatrix,int **gravityValues, int ***pathLengths) {
	
	int nodeCounter = 0; //counts the number of nodes in the graph
	xml_document doc;

	xml_parse_result result = doc.load_file("10nodes.xml");

	xml_node nodes = doc.child("graph");
	for(xml_node node = nodes.first_child(); node; node = node.next_sibling())
	{
		/*
		for(xml_attribute attr = node.first_attribute(); attr; attr = attr.next_attribute())
		{
			cout << " " << attr.name() << "=" << attr.value();
		}//end for attributes
		*/
		nodeCounter++;
		cout << endl;
	}//end for
	global_nodes = nodeCounter;

	xmlInfo = new string *[nodeCounter];
	*gravityValues = new int [nodeCounter];
	*adjMatrix = new int *[nodeCounter];
	*pathLengths = new int *[nodeCounter];
	for(int x=0;x < nodeCounter;x++)
	{
		(*adjMatrix)[x] = new int[nodeCounter];
		(*pathLengths)[x] = new int[nodeCounter];
		xmlInfo[x] = new string[7];  //0 = ID, 1 = X, 2 = Y, 3 = Label, 4 = Color, 5 = Img
	}//end for x

	for(int r=0; r < nodeCounter;r++)
	{
		for(int c=0; c < nodeCounter;c++)
		{
			(*adjMatrix)[r][c] = 0;
			(*pathLengths)[r][c] = 0;
		}//end for c
	}//end for r
	int count = 0;

	for(xml_node node = nodes.first_child(); node; node = node.next_sibling())
	{
		(*gravityValues)[count] = node.attribute("gravityValue").as_int();
		//Store node info in XML-Info Array
		//0 = ID, 1 = X, 2 = Y, 3 = Label, 4 = Color, 5 = Img
		xmlInfo[count][0] = node.attribute("id").as_string();
		xmlInfo[count][1] = node.attribute("x").as_string();
		xmlInfo[count][2] = node.attribute("y").as_string();
		xmlInfo[count][3] = node.attribute("label").as_string();
		xmlInfo[count][4] = node.attribute("color").as_string();
		xmlInfo[count][6] = node.attribute("gravityValue").as_string();
		xmlInfo[count][5] = node.child("img").attribute("src").as_string();
		for(xml_node edge = node.child("edge"); edge; edge = edge.next_sibling("edge"))
		{
			string str = edge.attribute("to").as_string();
			string stringTo = str.substr(1);
			int edgeTo;

			stringstream convert(stringTo);

			if( !(convert >> edgeTo))
				edgeTo = 0;			//this is the error case which sets the edgeTo to zero

			(*adjMatrix)[count][edgeTo] = 1;
			(*adjMatrix)[edgeTo][count] = 1;
		}//end for each edge
		count++;
		cout << endl;
	}//end for

}
//function prints the adjacency matrix for the user to look at
void printMatrix(int **ary)
{
	for(int r=0;r < global_nodes;r++)
	{
		for(int c=0;c < global_nodes;c++)
		{
			cout << "  " << ary[r][c] << "  ";
		}
		cout << endl;
	}
}