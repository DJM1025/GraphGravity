#include <iostream>
#include <string>
#include <sstream>
#include <math.h>
#include "pugixml-1.5\src\pugixml.hpp"

using namespace std;
using namespace pugi;
void parseGraph(int ***adjMatrix,int **gravityValues,int ***pathLengths);
void printMatrix(int **ary);
int nextAdjacent(int from, int last,int **adjMatrix,int *currentGravityPath);
void Exhaustive(int **adjMatrix, int **pathLengths);
int findGravity();
void Permute();
int global_nodes;

int main(){
	
	int** adjMatrix;
	int** pathLengths;
	int* gravityValues;

	parseGraph(&adjMatrix,&gravityValues,&pathLengths);
	Exhaustive(adjMatrix,pathLengths);
	printMatrix(pathLengths);

	for(int x = 0; x < global_nodes;x++)
		cout << "Gravity Value:  " << gravityValues[x] << " " << endl;

	cout << "-------Normal Termination---------------------" << endl;
	system("pause");
}//end main

void findGravity(int **adjMatrix,int *gravityValues)
{
	int minimum = 0;
	int nextVertex;
	int vertex;
	int temp;
	int *currentGravityPath = new int [global_nodes];

	for(int source=0; source < global_nodes; source++)
	{
		for(int destination=0; destination < global_nodes; destination++)
		{
			for(int i = 0; i < global_nodes;i++)
			{
				currentGravityPath[i] = -1;
			}//end for i

			if(source != destination)
			{
				int x = 0;
				currentGravityPath[x] = source;
				nextVertex = source;
				while(nextVertex != destination && nextVertex != -1)//this goes through and determines which node has the gravity path going from it
				{
					vertex = nextAdjacent(nextVertex,-1,adjMatrix,currentGravityPath);
					minimum = abs(gravityValues[vertex] - gravityValues[destination]);
					temp = vertex;
					vertex = nextAdjacent(nextVertex,vertex,adjMatrix,currentGravityPath);
					while(vertex != -1)
					{
						if(abs(gravityValues[vertex] - gravityValues[destination]) < minimum)
						{
							minimum = abs(gravityValues[vertex] - gravityValues[destination]);
							temp = vertex;
						}//end if
						vertex = nextAdjacent(nextVertex, vertex,adjMatrix,currentGravityPath);
					}//end inner while
					nextVertex = temp;
					x++;
					currentGravityPath[x] = temp;//holds the destination node position for the gravity path

				}//end outer while

			}//end  if the source destination check
			//begin checking for the paths by comparing them
			



		}//end for destination node
	}//end for source node


}//end function findGravity()
//this function sets the path length distances for all nodes
void Exhaustive(int **adjMatrix, int **pathLengths)
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

void Permute()
{
	if(global_nodes == 1)
		cout << "Gravitational there is only a single node... " <<  endl;
	else
	{

	}
}
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

}//end function nextAdjacent


//parses the graph and creates the adjacency matrix. -- may have to add more to this later
void parseGraph(int ***adjMatrix,int **gravityValues, int ***pathLengths) {
	
	int nodeCounter = 0; //counts the number of nodes in the graph
	xml_document doc;
	xml_parse_result result = doc.load_file("graph.xml");
	xml_node nodes = doc.child("graph");
	for(xml_node node = nodes.first_child(); node; node = node.next_sibling())
	{

		for(xml_attribute attr = node.first_attribute(); attr; attr = attr.next_attribute())
		{
			cout << " " << attr.name() << "=" << attr.value();
		}//end for attributes

		nodeCounter++;
		cout << endl;
	}//end for
	global_nodes = nodeCounter;
	*gravityValues = new int [nodeCounter];
	*adjMatrix = new int *[nodeCounter];
	*pathLengths = new int *[nodeCounter];
	for(int x=0;x < nodeCounter;x++)
	{
		(*adjMatrix)[x] = new int[nodeCounter];
		(*pathLengths)[x] = new int[nodeCounter];
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