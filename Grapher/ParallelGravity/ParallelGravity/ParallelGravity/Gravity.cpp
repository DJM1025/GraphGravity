#include <iostream>
#include <string>
#include <sstream>
#include <math.h>
#include "pugixml-1.5\src\pugixml.hpp"

using namespace std;
using namespace pugi;
void parseGraph(int ***adjMatrix,int **gravityValues);
void printMatrix(int **ary);
int nextAdjacent(int from, int last,int **adjMatrix,int *currentGravityPath);
int findGravity();
void Permute();
int global_nodes;

int main(){
	
	int** adjMatrix;
	int* gravityValues;

	parseGraph(&adjMatrix,&gravityValues);
	printMatrix(adjMatrix);

	for(int x = 0; x < global_nodes;x++)
		cout << "Gravity Value:  " << gravityValues[x] << " " << endl;

	cout << "-------Normal Termination---------------------" << endl;
	system("pause");
}//end main

void findGravity(int **adjMatrix)
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

				while(nextVertex != destination && nextVertex != -1)
				{
					vertex = nextAdjacent(nextVertex,-1,adjMatrix,currentGravityPath);
					//minimum = abs(

				}

			}//end  if for the source destination check
			




		}//end for destination node
	}//end for source node


}//end function findGravity()

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
void parseGraph(int ***adjMatrix,int **gravityValues) {
	
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
	for(int x=0;x < nodeCounter;x++)
	{
		(*adjMatrix)[x] = new int[nodeCounter];
	}//end for x

	for(int r=0; r < nodeCounter;r++)
	{
		for(int c=0; c < nodeCounter;c++)
		{
			(*adjMatrix)[r][c] = 0;
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