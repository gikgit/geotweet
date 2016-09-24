var socket = io.connect('http://127.0.0.1:3000');

$('#restart').on('click', function(event) {
  event.preventDefault();
  socket.emit('restart', {});
});

$('#stop').on('click', function(event) {
  event.preventDefault();
  socket.emit('stop',{});
});

$('#clear').on('click', function(event) {
  event.preventDefault();
  loadmap();
  socket.emit('clear',{});
});

//map
// var width = 900;
// var height = 600;
// var centered;
//
// var projection = d3.geo.mercator()
//                 .center([0, 5 ])
//                 .scale(200)
//                 .rotate([-180,0]);
//
// var svg = d3.select("body").append("svg")
//             .attr("width", width)
//             .attr("height", height);
// var path = d3.geo.path().projection(projection);
// var g = svg.append("g");
//
// d3.json("json/world-110m2.json", function(error, topology) {
// g.selectAll("path").data(topojson.object(topology, topology.objects.countries)
//       .geometries)
//       .enter()
//       .append("path");
// });
//
// // zoom and pan
// var zoom = d3.behavior.zoom()
//     .on("zoom",function() {
//         g.attr("transform","translate("+
//             d3.event.translate.join(",")+")scale("+d3.event.scale+")");
//         g.selectAll("circle")
//             .attr("d", path.projection(projection));
//         g.selectAll("path")
//             .attr("d", path.projection(projection));
//
//   });
//
// svg.call(zoom);


// zoomable us map
var width = 960,
    height = 500,
    active = d3.select(null);

var projection = d3.geo.albersUsa()
    .scale(1000)
    .translate([width / 2, height / 2]);

var zoom = d3.behavior.zoom()
    .translate([0, 0])
    .scale(1)
    .scaleExtent([1, 8])
    .on("zoom", zoomed);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .on("click", stopped, true);

svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .on("click", reset);

var g = svg.append("g");

svg
    .call(zoom) // delete this line to disable free zooming
    .call(zoom.event);

function loadmap() {
   d3.json("json/us.json", function(error, us) {
    if (error) throw error;

    g.selectAll("path")
        .data(topojson.feature(us, us.objects.states).features)
      .enter().append("path")
        .attr("d", path)
        .attr("class", "feature")
        .on("click", clicked);

    g.append("path")
        .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
        .attr("class", "mesh")
        .attr("d", path);
  });
}

loadmap();
// d3.json("json/us.json", function(error, us) {
//   if (error) throw error;

//   g.selectAll("path")
//       .data(topojson.feature(us, us.objects.states).features)
//     .enter().append("path")
//       .attr("d", path)
//       .attr("class", "feature")
//       .on("click", clicked);

//   g.append("path")
//       .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
//       .attr("class", "mesh")
//       .attr("d", path);
// });

function clicked(d) {
  if (active.node() === this) return reset();
  active.classed("active", false);
  active = d3.select(this).classed("active", true);

  var bounds = path.bounds(d),
      dx = bounds[1][0] - bounds[0][0],
      dy = bounds[1][1] - bounds[0][1],
      x = (bounds[0][0] + bounds[1][0]) / 2,
      y = (bounds[0][1] + bounds[1][1]) / 2,
      scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
      translate = [width / 2 - scale * x, height / 2 - scale * y];

  svg.transition()
      .duration(750)
      .call(zoom.translate(translate).scale(scale).event);
}

function reset() {
  active.classed("active", false);
  active = d3.select(null);

  svg.transition()
      .duration(750)
      .call(zoom.translate([0, 0]).scale(1).event);
}

function zoomed() {
  g.style("stroke-width", 1.5 / d3.event.scale + "px");
  g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

// If the drag behavior prevents the default click,
// also stop propagation so we don’t click-to-zoom.
function stopped() {
  if (d3.event.defaultPrevented) d3.event.stopPropagation();
}





//wait socket reponse
socket.on('callback', function(data) {
    g.selectAll("circle")
           .data(data.data)
           .enter()
           .append("circle")
           .attr("cx", function(d) {
             console.log(d);
              return projection(d.coord)[0];
           })
           .attr("cy", function(d) {
              return projection(d.coord)[1];
           })
           .attr("r", 1)
           .style("fill", "red");

    // g.selectAll('.labels')
    //    		.data(data.data)
    //       .enter()
    //       .append('text')
    //    		.attr('transform', function(d) {
    //    			return 'translate(' + projection(d.coord) + ')';
    //    		})
    //    		.attr('dy', function(d){
    //    		// 	var name = d.name;
    //         return -3;
    //    		// 	if (city == 'Washington') {
    //    		// 		return 8;
    //    		// 	}
    //    		// 	else {
    //    		// 		return -3;
    //    		// 	}
    //    		}) // vertical offset
    //    		.attr('dx', 3) // horizontal offset
    //    		.text(function(d) {
    //    			return d.des;
    //    		})
    //    		.attr('class', 'labels')
    //       .style("font-size","0.1px");
  // });
  // Print the data.data somewhere...

});
