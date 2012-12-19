var regionsProj={"Africa":[280,[16.845,3.7449999999999974]],
				"Asia":[280,[102.595,24.62]],
				"North and Central America":[280,[-112.78,40.745]],
				"Eastern Europe":[280,[-82.655,108.87]],
				"Middle East":[750,[45.47,27.12]],
				"Caribbean":[1000,[-72.905,15.87]],
				"Other regions":[300,[-112.78,266.62]],
				"Oceania":[300,[-25.78,204.37]],
				"Western Europe":[500,[5.3445,422.495]],
				"South America":[300,[-73.155,336.87]]				
				};
var projection3d = d3.geo.azimuthal()
    .scale(200)
    .origin([-71.03,42.37])
    .mode("orthographic")
    .translate([275, 250]);

var circle = d3.geo.greatCircle()
    .origin(projection3d.origin());

var path3d = d3.geo.path()
	.projection(projection3d);

var orthomapsvg = d3.select("#orthomap").append("svg:svg")
.attr("width", widthD3)
.attr("height", heightD3-20)
.attr("transform", "translate(0," + heightD3 + "-20)")
.on("mousedown", mousedown);
var feature;

//var graticule = d3.geo.graticule()
//.extent([[-90 + 2 * ε, -90 + 2 * ε], [90 - 2 * ε, 90 - 2 * ε]]);
//
//
//orthomapsvg.append("path")
//.datum(graticule.outline)
//.attr("class", "background")
//.attr("d", path);
//
//orthomapsvg.selectAll(".graticule")
//.data(graticule.lines)
//.enter().append("path")
//.attr("class", "graticule")
//.attr("d", path);
//
//orthomapsvg.append("path")
//.datum(graticule.outline)
//.attr("class", "foreground")
//.attr("d", path);

function update3dmap(collection,gmax){
//	var title_map = orthomapsvg.selectAll(".titles")
//	  .data(["Regional Map"])
//	  .text(function(d){return d;});	
//
//	title_map.enter().append("text")
//	  .attr("class", "titles")
//	  .attr("x", 0)
//	  .attr("y", 15)
//	  .style("fill","red")
//	  .style("stroke", "white")
//	  .attr("text-anchor", "left")
//	  .text(function(d){return d;});
	
    var cscale = d3.scale.pow().exponent(.5).domain([0, gmax])
    	.range(["#fae893", "#756518"]);
    
	  feature = orthomapsvg.selectAll("path")
      	.data(collection.features)
      .attr("d", clip)
	  .attr("fill", function(d) {
		  if (d.properties.isHighlight){
			  return cscale(d.properties[getPropertyNameByType()]);
		  }else{
			  return "#aaa"; }
		  })
	  .attr("stroke", "#fff")
	  .on("mouseover", function(d,i) {return highlightCountry(d,i,this)})
	  .on("mouseout", function(d,i) {return unhighlightCountry(d,i,this)});
	  
	  feature.enter().append("path")
		 .attr("d", path)
		 .attr("d", clip)
	  .attr("fill", function(d) {
		  if (d.properties.isHighlight){
			  return cscale(d.properties[getPropertyNameByType()]);
		  }else{
			  return "#aaa"; }
		  })
	  .attr("stroke", "#fff")
	  .on("mouseover", function(d,i) {return highlightCountry(d,i,this)})
	  .on("mouseout", function(d,i) {return unhighlightCountry(d,i,this)});

  feature.append("svg:title")
      .text(function(d) { return d.properties.name; });  
  feature.exit().remove();
  
  if (typeof(regionsProj[currentRegion]) != "undefined"){
	  projection3d.scale(regionsProj[currentRegion][0]);
	  projection3d.origin(regionsProj[currentRegion][1]);
	  circle.origin(regionsProj[currentRegion][1]);
	  refresh(500);
  }
}

d3.select(window)
.on("mousemove", mousemove)
.on("mouseup", mouseup);

var m0,
o0;

function mousedown() {
m0 = [d3.event.pageX, d3.event.pageY];
o0 = projection3d.origin();
d3.event.preventDefault();
}

function mousemove() {
	if (m0) {
	var m1 = [d3.event.pageX, d3.event.pageY],
	    o1 = [o0[0] + (m0[0] - m1[0]) / 8, o0[1] + (m1[1] - m0[1]) / 8];
	projection3d.origin(o1);
	circle.origin(o1)
	refresh();
	}
}

function mouseup() {
	if (m0) {
	mousemove();
	m0 = null;
	}
}

function refresh(duration) {
	(duration ? feature.transition().duration(duration) : feature).attr("d", clip);
}

function clip(d) {
	  return path3d(circle.clip(d));
}




        