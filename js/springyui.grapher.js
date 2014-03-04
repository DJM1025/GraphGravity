/**
 * Springy v2.0.1
 *
 * Copyright (c) 2010 Dennis Hotson
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

(function() {

jQuery.fn.springy = function(params) {
	var graph = this.graph = params.graph || new Springy.Graph();

	var stiffness = params.stiffness || 200.0;
	var repulsion = params.repulsion || 200.0;
	var damping = params.damping || .3;
	var nodeSelected = params.nodeSelected || null;

	var canvas = this[0];
	//var ctx = canvas.getContext("2d");

	var layout = this.layout = new Springy.Layout.ForceDirected(graph, stiffness, repulsion, damping);

	// calculate bounding box of graph layout.. with ease-in
	var currentBB = layout.getBoundingBox();
	var targetBB = {bottomleft: new Springy.Vector(-2, -2), topright: new Springy.Vector(2, 2)};

	var toScreen = function(p) {
		var size = currentBB.topright.subtract(currentBB.bottomleft);
		var sx = p.subtract(currentBB.bottomleft).divide(size.x).x * window.innerWidth;
		var sy = p.subtract(currentBB.bottomleft).divide(size.y).y * window.innerHeight;
		return new Springy.Vector(sx, sy);
	};

	// half-assed drag and drop
	var selected = null;
	var nearest = null;

	Springy.Node.prototype.getWidth = function() {
		var text = (this.data.label !== undefined) ? this.data.label : this.id;
		if (this._width && this._width[text])
			return this._width[text];



		return 10;
	};

	Springy.Node.prototype.getHeight = function() {
		return 10;
	};

	var renderer = this.renderer = new Springy.Renderer(layout,
		function clear() {

		},
		function drawEdge(edge, p1, p2) {


			var from = graph.getEdges(edge.source, edge.target);
			var to = graph.getEdges(edge.target, edge.source);

			var total = from.length + to.length;

			// Figure out edge's position in relation to other edges between the same nodes
			var n = 0;
			for (var i=0; i<from.length; i++) {
				if (from[i].id === edge.id) {
					n = i;
				}
			}


			var boxWidth = edge.target.getWidth();
			var boxHeight = edge.target.getHeight();



			// label
			if (edge.data.label !== undefined) {
				text = edge.data.label

			}

		},
		function drawNode(node, p) {
			var s = toScreen(p);


			graph.Nodes

			var boxWidth = node.getWidth();
			var boxHeight = node.getHeight();


			if (selected !== null && nearest.node !== null && selected.node.id === node.id) {

			} else if (nearest !== null && nearest.node !== null && nearest.node.id === node.id) {

			} else {

			}

			var text = (node.data.label !== undefined) ? node.data.label : node.id;

		}
	);

	renderer.start();

	
	return this;
}

})();

