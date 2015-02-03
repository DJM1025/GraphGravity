#include <iostream>
#include <math.h>
#include "pugixml-1.5\src\pugixml.hpp"

using namespace std;
using namespace pugi;


int main(){

	cout << "Hello world" << endl;
	
	xml_document doc;

	xml_parse_result result = doc.load_file("graph.xml");

	xml_node nodes = doc.child("graph");

	for(xml_node node = nodes.first_child(); node; node = node.next_sibling())
	{

		for(xml_attribute attr = node.first_attribute(); attr; attr = attr.next_attribute())
		{
			cout << " " << attr.name() << "=" << attr.value();
		}//end for attributes

		cout << endl;
	}//end for

	//cout << "Load result: " << result.description() << ", node id: " << doc.child("node").attribute("id").value() << endl;


	cout << "-------Normal Termination---------------------" << endl;
	system("pause");
}//end main