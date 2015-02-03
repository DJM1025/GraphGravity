#include <iostream>
#include <string>
#include <sstream>
#include <math.h>
#include "pugixml-1.5\src\pugixml.hpp"

using namespace std;
using namespace pugi;
void parseGraph(int ***adjMatrix);
void printMatrix(int **ary);
int CheckGravity();
void Exhaustive();
void NumberAndTest();
void Permute();
int global_nodes;

int main(){
	
	int** adjMatrix; 

	parseGraph(&adjMatrix);
	printMatrix(adjMatrix);

	cout << "-------Normal Termination---------------------" << endl;
	system("pause");
}//end main

//parses the graph and creates the adjacency matrix. -- may have to add more to this later
void parseGraph(int ***adjMatrix ) {
	
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