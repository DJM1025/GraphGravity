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

	// auto adjusting bounding box
	//Springy.requestAnimationFrame(function adjust() {
	//	targetBB = layout.getBoundingBox();
	//	// current gets 20% closer to target every iteration
	//	currentBB = {
	//		bottomleft: currentBB.bottomleft.add( targetBB.bottomleft.subtract(currentBB.bottomleft)
	//			.divide(10)),
	//		topright: currentBB.topright.add( targetBB.topright.subtract(currentBB.topright)
	//			.divide(10))
	//	};
//
	//	Springy.requestAnimationFrame(adjust);
	//});

	// convert to/from screen coordinates
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

		//ctx.save();
		//ctx.font = "16px Verdana, sans-serif";
		//var width = ctx.measureText(text).width + 10;
		//ctx.restore();
		//this._width || (this._width = {});
		//this._width[text] = width;

		return 10;
	};

	Springy.Node.prototype.getHeight = function() {
		return 10;
	};

	var renderer = this.renderer = new Springy.Renderer(layout,
		function clear() {
			//ctx.clearRect(0,0,canvas.width,canvas.height);
		},
		function drawEdge(edge, p1, p2) {
			//var x1 = toScreen(p1).x;
			//var y1 = toScreen(p1).y;
			//var x2 = toScreen(p2).x;
			//var y2 = toScreen(p2).y;
			//var direction = new Springy.Vector(x2-x1, y2-y1);
			//var normal = direction.normal().normalise();

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

			//var s1 = toScreen(p1);
			//var s2 = toScreen(p2);

			var boxWidth = edge.target.getWidth();
			var boxHeight = edge.target.getHeight();



			//var stroke = (edge.data.color !== undefined) ? edge.data.color : '#000000';

			//var weight = (edge.data.weight !== undefined) ? edge.data.weight : 1.0;

			//ctx.lineWidth = Math.max(weight *  2, 0.1);
			//arrowWidth = 1 + ctx.lineWidth;
			//arrowLength = 8;

			//var lineEnd;

			//lineEnd = s2;


			//ctx.strokeStyle = stroke;
			//ctx.beginPath();
			//ctx.moveTo(s1.x, s1.y);
			//ctx.lineTo(lineEnd.x, lineEnd.y);
			//ctx.stroke();

			// label
			if (edge.data.label !== undefined) {
				text = edge.data.label
				//ctx.save();
				//ctx.textAlign = "center";
				//ctx.textBaseline = "top";
				//ctx.font = "10px Helvetica, sans-serif";
				//ctx.fillStyle = "#5BA6EC";
				//ctx.fillText(text, (x1+x2)/2, (y1+y2)/2);
				//ctx.restore();
			}

		},
		function drawNode(node, p) {
			var s = toScreen(p);

			//ctx.save();
			graph.Nodes

			var boxWidth = node.getWidth();
			var boxHeight = node.getHeight();

			// clear background
			//ctx.clearRect(s.x - boxWidth/2, s.y - 10, boxWidth, 20);

			// fill background
			if (selected !== null && nearest.node !== null && selected.node.id === node.id) {
				//ctx.fillStyle = "#FFFFE0";
			} else if (nearest !== null && nearest.node !== null && nearest.node.id === node.id) {
				//ctx.fillStyle = "#EEEEEE";
			} else {
				//ctx.fillStyle = "#FFFFF9";
			}
			//ctx.fillRect(s.x - boxWidth/2, s.y - 10, boxWidth, 20);

			//ctx.textAlign = "left";
			//ctx.textBaseline = "top";
			//ctx.font = "16px Verdana, sans-serif";
			//ctx.fillStyle = "#000000";
			//ctx.font = "16px Verdana, sans-serif";
			var text = (node.data.label !== undefined) ? node.data.label : node.id;
			//ctx.fillText(text, s.x - boxWidth/2 + 5, s.y - 8);

			//ctx.restore();
		}
	);

	renderer.start();

	
	return this;
}

})();

