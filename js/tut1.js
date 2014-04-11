$(document).ready(function(){
	var width = 960,
	    height = 1160;
	this.circle ="";

	var svg = d3.select("body").append("svg")
		.attr("class", "svgImage")
	    .attr("width", width)
	    .attr("height", height)
	    .append("g")
 		.call(d3.behavior.zoom().x().y().scaleExtent([1, 8]).on("zoom", zoom));

	queue()
	    .defer(d3.json, "data/hawaii_topojson.json")
	    .defer(d3.json, "data/wells.json")
	    .await(ready);

	function ready(error, hawaii, wells) {
		drawMap(hawaii, wells);
	}

	function transform(d) {
		console.log(d);
	 return "translate(" + x(d.y) + "," + y(d.x) + ")";
	}

	function drawMap(hawaii, wells) {

	  	// Convert back to GeoJSON:
	  	var subunits = topojson.feature(hawaii, hawaii.objects.subunits);

		// Define the projection:
		// Hawaii: 19.5667° N, 155.5000° W
		// All of Hawaii's Islands:
		var projection = d3.geo.albers()
	    .center([0, 18.5])
	    .rotate([157.50, 0])
	    .parallels([15, 25])
	    .scale(8000)
	    .translate([width / 2, height / 2]);

	  	// Define path generator:
		var path = d3.geo.path()
		.projection(projection)
		.pointRadius(2);

	  	// Add state path:
		svg.append("path")
	    .datum(subunits)
	    .attr("class", "state")
	    .attr("d", path);

		// Define path generator:
		var path = d3.geo.path()
	    .projection(projection)
	    .pointRadius(2);

	    this.circle = svg.selectAll("circle.wells")
	    .data(wells, function(d) {
	      return [d.LongDegree, d.LatDegree];
	    })
	    .enter()
	    .append("circle")
	    .attr("class", "wells")
	    .attr("cx", function(d) {
	    return projection([d.LongDegree, d.LatDegree])[0];
	    })
	    .attr("cy", function(d) {
	      return projection([d.LongDegree, d.LatDegree])[1];
	    })
		.attr("r", 2)
	    .attr("opacity", 0.5)
	    .append("svg:title")
	    .text(function(d){return d.OtherName})
		.attr("transform", transform);
	};

	function zoom() {
	  circle.attr("transform", transform);
	}

});