//id:0/num of message;1:num of minutes;2:revenue;
var xx=0.6;
var yy = 25;
var data,worldPath,regionPath,contries,country;
var currentRegion=null,currentid=null,currenttype=null,regions=[];
var width = 1200,
    height = 460,
    widthC = 650,
    heightC = 500,
    widthD3 = 400,
    heightD3 = 400,
    fill = d3.scale.category20();
var margin = {top: 5, right: 0, bottom: 0, left: 0};
var  tooltip = CustomTooltip("call_tooltip", 240);

var center = {x:widthC/2, y:heightC/2};
var type_centers = {
	      "minute": {x: width / 3+40, y: height / 2},
	      "message": {x: width / 2 +40, y: height / 2},
	      "revenue": {x: 2 * width / 3 +40, y: height / 2}
	    };

var layout_gravity = -0.03;
var damper = 0.1;
var vis_region = null,
	nodes_region=[],
	nodes_country=[],
	force_region = null,
	force_county=null,
	circles_region = null,
	circles_country=null;
	legend_region=null;

vis_region = d3.select("#visRegion").append("svg:svg")
    .attr("width", width)
    .attr("height", height)
    .attr("id","bubble_region");


vis_region.append("rect")
	.attr("id", "bubble-background")
//.attr("fill","none")
	.attr("width", width)
	.attr("height", height)
	.style("fill-opacity",0)
	.on("click", clear)

vis_country = d3.select("#visCountry").append("svg:svg")
.attr("width", widthC)
.attr("height", heightC)
.attr("id","bubble_country");


var d3maptitlesvg = d3.select("#orthomaptitle")
.append("svg")
.attr("width", 400)
.attr("height", 20) ;
d3maptitlesvg.append("svg:text")
  .attr("class", "titles")
  .attr("x", 0)
  .attr("y", 15)
  .attr("text-anchor", "left")
  .text("Regional Map");

force_region = d3.layout.force();
force_country=d3.layout.force();

var collisionPadding = 4,
clipPadding = 4,
minRadius = 14, // minimum collision radius
maxRadius = 60; // also determines collision search radius

var radius_scale = d3.scale.pow().exponent(0.5)
	.range([minRadius, maxRadius]);

//map definition
var regionsProj={"Africa":[17,12],
        "Asia":[83,29.9],
        "North and Central America":[-97.5,33.5],
        "Eastern Europe":[20.79,44.22],
        "Middle East":[33.5,32.5],
        "Caribbean":[-72.68,18.89],
        "Other regions":[29.73,-77.37],
        "Oceania":[134.48, -25.74],
        "Western Europe":[14.5,51.5],
        "South America":[-71.53,39.05]        
        };
var d3mapsvg = d3.select("#orthomap")
		.append("svg")
		.attr("width", widthD3)
		.attr("height", heightD3);
var centroid = d3.geo.path()
    .projection(function(d) { return d; })
    .centroid;

var projection = d3.geo.orthographic()
    .translate([widthD3 / 2, heightD3 / 2])
    .scale(200)
    .rotate([98,-39])
    .clipAngle(90);

var path = d3.geo.path()
    .projection(projection);

var graticule = d3.geo.graticule()
    .extent([[-180, -90], [180 - .1, 90 - .1]]);

var line = d3mapsvg.append("path")
    .datum(graticule)
    .attr("class", "graticule")
    .attr("d", path);
 var dragrotate = {x: 0, y: 90};
d3mapsvg.append("circle")
    .datum(dragrotate)
    .attr("class", "mouse")
    .attr("cx", widthD3 / 2)
    .attr("cy", heightD3 / 2)
    .attr("r", projection.scale())
    .call(d3.behavior.drag()
      .origin(Object)
      .on("drag", function(d) {
        projection.rotate([(d.x = d3.event.x) / 2, -(d.y = d3.event.y) / 2]);
        d3mapsvg.selectAll("path").attr("d", path)
      }));

var title = d3mapsvg.append("text")
	.attr("class", "countrytext")
    .attr("x", widthD3 / 2)
    .attr("y", heightD3 * 3 / 5);

var rotate = d3_geo_greatArcInterpolator();

function getRightScale(domainMin,domainMax){
	radius_scale.domain([domainMin,domainMax]);
	return radius_scale;
}

function create_nodes_region(){
	var num1Node=[],num2Node=[],num3Node=[],num1=[],num2=[],num3=[];
	var maxScale;
	var id=0;
	data.Regions.forEach(function(d){
		id++;
		var obj1=new Object();
		var obj2=new Object();
		var obj3=new Object();
		var obj4=new Object();
		
		obj1.region=d.RegionName;
		obj1.num=parseInt(d.RegionTotals.MessageTelephoneServiceDetail.TrafficBilledInUS.NumberOfMinutes);
		obj1.id=id;
		obj1.type="minute";
		num1Node.push(obj1);
		num1.push(obj1.num);
		
		obj2.region=d.RegionName;
		obj2.num=parseInt(d.RegionTotals.MessageTelephoneServiceDetail.TrafficBilledInUS.NumberOfMessages);
		obj2.id=id;
		obj2.type="message";
		num2Node.push(obj2);
		num2.push(obj2.num)
		
		obj3.region=d.RegionName;
		obj3.num=parseInt(d.RegionTotals.MessageTelephoneServiceDetail.TrafficBilledInUS.UsCarrierRevenues);
		obj3.payout=parseInt(d.RegionTotals.MessageTelephoneServiceDetail.TrafficBilledInUS.PayoutToForeignCarriers);
		obj3.retainedRevenue=parseInt(d.RegionTotals.MessageTelephoneServiceDetail.TrafficBilledInUS.RetainedRevenues);
		obj3.id=id;
		obj3.type="revenue";
		num3Node.push(obj3);
		num3.push(obj3.num);
		
		obj4.id=id;
		obj4.region=d.RegionName;
		regions.push(obj4);
	});
	maxScale=d3.max(num1);
	radius_scale.domain([0,maxScale]);
	for (var i=0;i<num1Node.length;i++){
		var node=new Object();
		node.id=num1Node[i].id;
		node.type=num1Node[i].type;
		node.region=num1Node[i].region;
		node.num=num1Node[i].num;
		node.radius=radius_scale(parseInt(num1Node[i].num));
        node.x = Math.random() * 900
        node.y= Math.random() * 800
		nodes_region.push(node);		
	}
	maxScale=d3.max(num2);
	radius_scale.domain([0,maxScale]);
	for (var i=0;i<num2Node.length;i++){
		var node=new Object();
		node.id=num2Node[i].id;
		node.type=num2Node[i].type;
		node.region=num2Node[i].region;
		node.num=num2Node[i].num;
		node.radius=radius_scale(parseInt(num2Node[i].num));
        node.x = Math.random() * 900
        node.y= Math.random() * 800
		nodes_region.push(node);		
	}
	maxScale=d3.max(num3);
	radius_scale.domain([0,maxScale]);
	for (var i=0;i<num3Node.length;i++){
		var node=new Object();
		node.id=num3Node[i].id;
		node.type=num3Node[i].type;
		node.region=num3Node[i].region;
		node.num=num3Node[i].num;
		node.payout=num3Node[i].payout;
		node.retainedRevenue=num3Node[i].retainedRevenue;
		node.radius=radius_scale(parseInt(num3Node[i].num));
        node.x = Math.random() * 900
        node.y= Math.random() * 800
		nodes_region.push(node);		
	}
	
	update();
}

function update(){
	circles_region=vis_region.selectAll("circle_region")
		.data(nodes_region);
	
	legend_region = vis_region.selectAll("legend_region")
		.data(regions);
	
    force_region
		.nodes(nodes_region)
		.gravity(layout_gravity)
		.charge(function(d){return -Math.pow(d.radius, 2.0) / 8;})
		.friction(0.9)
		.on("tick", forceRegionTick)
		.size([width, height]);  
	
	update_bubble_region();	
	create_legend();
	
	//update_label_region();
	display_title();
	force_region.start();

}
function update_bubble_region(){
//	circles_region=vis_region.selectAll("circle_region")
//						.data(nodes_region);
	circles_region.exit().remove();
	circles_region.enter().append("circle")
    .attr("r", 0)
    .attr("fill",  function(d) { return fill(d.id); })
    .attr("stroke-width", 1)
    .attr("stroke",  function(d) { return fill(d.id); })
    .style("fill-opacity", 0.2)
    .style("cursor", "pointer")
    .attr("id",  function(d) { return d.id; })
    .on("mouseover", function(d,i) {return show_details(d,i,this)})
    .on("mouseout", function(d,i) {return hide_details(d,i,this)})
    .on("click",function(d,i){return show_country(d,i,this)})
	
	circles_region.transition().duration(2000)
	.attr("r", function(d){return d.radius});

    circles_region.call(force_region.drag);
}

function update_bubble_country(){
	circles_country=vis_country.selectAll("circle")
						.data(nodes_country);
	//circles_country.exit().remove();
	circles_country.enter().append("circle")
    .attr("r", 0)
    .attr("fill", currentFill)
    .attr("stroke-width", 1)
    .attr("stroke", currentFill)
    .style("fill-opacity", 0.2)
    .on("mouseover", function(d,i) {return show_details(d,i,this)})
    .on("mouseout", function(d,i) {return hide_details(d,i,this)})
	
	circles_country.transition().duration(2000)
	.attr("r", function(d){return d.radius});

	circles_country.attr("fill",currentFill).attr("stroke",currentFill);
	circles_country.exit().transition().duration(2500).attr("r",0).remove();
	
    force_country
	.nodes(nodes_country)
	.gravity(layout_gravity)
	.charge(function(d){return -Math.pow(d.radius, 2.0) / 8;})
	.friction(0.9)
	.on("tick", forceCountryTick)
	.size([widthC, heightC]);  

    circles_country.call(force_country.drag);
    force_country.start();
}


function forceRegionTick(e) {
    circles_region.each(move_towards_type(e.alpha))
    .attr("cx", function(d){return d.x})
    .attr("cy", function(d){return d.y});
}; 

function forceCountryTick(e) {
    circles_country.each(move_towards_center(e.alpha))
    .attr("cx", function(d){return d.x})
    .attr("cy", function(d){return d.y});
}; 

function create_legend(){
	legend_region.enter()
		.append("circle")
		.attr("cx",8)
		.attr("cy",function(d,i){return i*20+120;})
		.attr("r", 6)
	    .attr("fill",  function(d) { return fill(d.id); })
	    .attr("stroke-width", 1)
	    .attr("stroke",  function(d) { return fill(d.id); })
	    .style("fill-opacity", 0.2)
	legend_region.enter()
		.append("text")
			.attr("text-anchor", "left")
            .attr("x", 20)
            .attr("y", function(d, i) { return i*20+120})
              .attr("dx", 0)
              .attr("dy", "0.3em") // Controls padding to place text above bars
              .text(function(d) { return d.region;})
              .style("fill", function(d) { return fill(d.id); })
		

}

function update_label_region(){
	label_region=d3.select("#visRegion").selectAll("#bubble-labels").data([nodes_region])
	.enter()
	.append("div")
	.attr("id","label_region");
	
	label_region = label_region.selectAll(".bubble-label").data(nodes_region);
	label_region.exit().remove();
    
   labelEnter=label_region.enter().append("a")
        .attr("class", "bubble-label")
        .attr("href", function(d){return encodeURIComponent(d.id)})
        .call(force_region.drag);
      //.call(connectEvents)
      
    labelEnter.append("div")
        	.attr("class", "bubble-label-name")
        	.text(function(d){return d.region});
   labelEnter.append("div")
   		.attr("class", "bubble-label-value")
   		.text(function(d){return d.num})
   
   label_region
   	.style("font-size", function(d){return Math.max(8,d.radius /2)+"px";})
   	.style("width", function(d){return d.radius * 2.5 + "px"});
   
   label_region.append("span")
   	.text(function(d){return d.name;})
   	.each(function(d){d.dx=Math.max(d.radius *2.5,this.getBoundingClientRect().width);})
   	.remove();
   
   label_region
   	.style("width",function(d){return d.dx + "px";})
   
   label_region.each(function(d){d.dy=this.getBoundingClientRect().height;});
   
}

function move_towards_center(alpha){
	return function(d){
	  d.x = d.x + (center.x - d.x) * (damper + 0.02) * alpha;
	  d.y = d.y + (center.y - d.y) * (damper + 0.02) * alpha;
	};
}

function move_towards_type(alpha){
	return function (d){
		  var target = type_centers[d.type];
		  d.x = d.x + (target.x - d.x) * (damper + 0.02) * alpha * 1.1;
		  d.y = d.y + (target.y - d.y) * (damper + 0.02) * alpha * 1.1;
	};
}

function show_details(data,i,element){
    d3.select(element).attr("stroke", "black")
    if (typeof(data.region) != "undefined"){
    	content = "<span class='name'>Region: </span><span class='value'>" + data.region + "</span><br/>";
    	if (data.type=="minute"){
    		content += "<span class='name'>Number of Minutes: </span><span class='value'>" + addCommas(data.num) + "</span><br/>";
    	}else if(data.type=="message"){
    		content += "<span class='name'>Number of Messages: </span><span class='value'>" + addCommas(data.num) + "</span><br/>";
    	}
    	else if(data.type=="revenue"){
    		content += "<span class='name'>US Carrier Revenue: $</span><span class='value'>" + addCommas(data.num) + "</span><br/>";
    		content += "<span class='name'>Payout to Foreigh Carriers: $</span><span class='value'>" + addCommas(data.payout) + "</span><br/>";
    		content += "<span class='name'>Retained Revenue: $</span><span class='value'>" + addCommas(data.retainedRevenue) + "</span><br/>";
    	}
    }else{
	    content = "<span class='name'>Country: </span><span class='value'>" + data.country + "</span><br/>";
		if (data.type=="minute"){
			content += "<span class='name'>Number of Minutes: </span><span class='value'>" + addCommas(data.num) + "</span><br/>";
		}else if(data.type=="message"){
			content += "<span class='name'>Number of Messages: </span><span class='value'>" + addCommas(data.num) + "</span><br/>";
		}
		else if(data.type=="revenue"){
			content += "<span class='name'>US Carrier Revenue: $</span><span class='value'>" + addCommas(data.num) + "</span><br/>";
			content += "<span class='name'>Payout to Foreigh Carriers: $</span><span class='value'>" + addCommas(data.payout) + "</span><br/>";
			content += "<span class='name'>Retained Revenue: $</span><span class='value'>" + addCommas(data.retainedRevenue) + "</span><br/>";
		}
		rotateToCounty(data.country);
    }

    tooltip.showTooltip(content,d3.event)

}

function hide_details (data, i, element) {
    d3.select(element).attr("stroke", function(d) {return fill(d.id)});
    tooltip.hideTooltip();
     title.text("");
    country.transition()
        .style("fill", function(d, j) {return "#b8b8b8"; });
}

function display_title(){
	titles_x = {"Number of Minutes": 300, "Number of Messages": width / 2 +40, "US Carrier Revenues": width - 200};
	titles_data = d3.keys(titles_x)
	titles = vis_region.selectAll(".titles")
	  .data(titles_data)

	titles.enter().append("text")
	  .attr("class", "titles")
	  .attr("x", function(d){return titles_x[d];})
	  .attr("y", 40)
	  .attr("text-anchor", "middle")
	  .text(function(d){return d;})
}

function display_title_country(t){
	title_country = vis_country.selectAll(".titles")
	  .data([t])
	  .text(function(d){return d;});	

	title_country.enter().append("text")
	  .attr("class", "titles")
	  .attr("x", 0)
	  .attr("y", 15)
	  .attr("text-anchor", "left")
	  .text(function(d){return d;});
	title_country.exit().remove();
}

function show_country(da,i,element){
	if (currentRegion == null || currentRegion != da.region || currentType != da.type){
		d3.select("#details").style("display","block");
		var msgType;
		nodes_country=[];
		currentCountries=[];
		currentRegion = da.region;
		currentType=da.type;
		currentFill = element.attributes.fill.value;
		data.Regions.forEach(function(d){
			if(d.RegionName==da.region){
				var num=[];
				d.TrafficReportDetails.forEach(function(c){
					var obj=new Object();
					obj.id=da.id;
					obj.type=da.type;
					obj.country=c.CountryName;
					if (da.type=="minute"){
						obj.num=parseInt(c.MessageTelephoneServiceDetail.TrafficBilledInUS.NumberOfMinutes);
						msgType="Number of Minutes";
					}
					else if (da.type=="message"){
						obj.num=parseInt(c.MessageTelephoneServiceDetail.TrafficBilledInUS.NumberOfMessages);
						msgType="Number of Messages";
					}
					else if (da.type=="revenue"){
						obj.num=parseInt(c.MessageTelephoneServiceDetail.TrafficBilledInUS.UsCarrierRevenues);
						obj.payout=parseInt(c.MessageTelephoneServiceDetail.TrafficBilledInUS.PayoutToForeignCarriers);
						obj.retainedRevenue=parseInt(c.MessageTelephoneServiceDetail.TrafficBilledInUS.RetainedRevenues);
						msgType="US Carrier Revenues";
					}
					num.push(obj.num)
					nodes_country.push(obj);
					currentCountries.push(c.CountryName);
				})
				var maxScale = d3.max(num);
				radius_scale.domain([0,maxScale]);
			}		
		})
		nodes_country.forEach(function(d){
			d.radius=radius_scale(parseInt(d.num));
	        d.x = Math.random() * 900
	        d.y= Math.random() * 800
		})
		update_bubble_country();
		display_title_country( msgType + " in " + da.region);
		rotateToRegion(currentRegion);
		
		//hightlight the bubble
		circles_region.style("fill-opacity",0.2);
		d3.select(element).style("fill-opacity",1);
		//console.log(nodes_country);
	}	
}

function rotateToCounty(countryName) {
    c = worldPath.filter(function(d){return d.id.toUpperCase() == countryName.toUpperCase()})
    if (c.length>0){
      title.text(c[0].id);
    	country.transition()
        	.style("fill", function(d, j) {return d.id.toUpperCase() === c[0].id.toUpperCase() ? "red" : "#b8b8b8"; });

    	d3.transition()
       	 //.delay(250)
        	.duration(750)
       	 .tween("rotate", function() {
          	var point = centroid(c[0]);
          	rotate.source(projection.rotate()).target([-point[0], -point[1]]).distance();
          	return function(t) {
            	projection.rotate(rotate(t));
            	country.attr("d", path);
           	 line.attr("d", path);
          	};
        })
      //.transition()
      //  .each("end", step);
    }
    else{
    	 title.text("");
   	 country.transition()
        	.style("fill", function(d, j) {return "#b8b8b8"; });
     		projection.rotate([0,0]);
     		//rotateToRegion(currentRegion);
    } 
  }

  function rotateToRegion(regionName) {
  	var displayName="";
  	if (typeof regionsProj[regionName] == "undefined"){
  		regionName = "North and Central America";
  	}
  	else{
  		displayName = regionName;
  	}
  		d3.transition()
       //.delay(250)
        .duration(750)
        .tween("rotate", function() {
          var point = regionsProj[regionName];
          rotate.source(projection.rotate()).target([-point[0], -point[1]]).distance();
          return function(t) {
            projection.rotate(rotate(t));
            country.attr("d", path);
            line.attr("d", path);
          };
        })  
        title.text(displayName);      
    }


function clear(){
	if(circles_region != null){
		circles_region.style("fill-opacity",0.2);
		d3.select("#details").style("display","none");
	}
}

function addCommas(nStr)
{
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}



function getPropertyNameByType(){
	var pName;
	if (currentType=="minute"){
		pName = "NumberOfMinutes";
	}
	else if (currentType=="message"){
		pName = "NumberOfMessages";
	}
	else if (currentType=="revenue"){
		pName = "UsCarrierRevenues";
	}
	return pName;
}

queue()
    .defer(d3.json, "data/2011.json")
    .defer(d3.json, "data/readme-world-110m.json")
    .await(ready);

function ready(error, mydata,world) {
	data = mydata;
	worldPath = topojson.object(world, world.objects.countries).geometries;
	data.Regions.forEach(function(r){
		r.TrafficReportDetails.forEach(function(c){
			//allname.push(c.CountryName);
			worldPath.forEach(function(w){
				if (c.CountryName==w.id){
					w.NumberOfMinutes=parseInt(c.MessageTelephoneServiceDetail.TrafficBilledInUS.NumberOfMinutes);
					w.NumberOfMessages=parseInt(c.MessageTelephoneServiceDetail.TrafficBilledInUS.NumberOfMessages);
					w.UsCarrierRevenues=parseInt(c.MessageTelephoneServiceDetail.TrafficBilledInUS.UsCarrierRevenues);
					w.PayoutToForeignCarriers=parseInt(c.MessageTelephoneServiceDetail.TrafficBilledInUS.PayoutToForeignCarriers);
					w.RetainedRevenues=parseInt(c.MessageTelephoneServiceDetail.TrafficBilledInUS.RetainedRevenues);					
				}				
			})
		})

	})
	 country = d3mapsvg.selectAll(".country")
      .data(worldPath)
    .enter().insert("path", ".graticule")
      .attr("class", "country")
      .attr("d", path);
	create_nodes_region();
 };

//great arc interpolater, by Jason Davis
 var d3_radians = Math.PI / 180;

function d3_geo_greatArcInterpolator() {
  var x0, y0, cy0, sy0, kx0, ky0,
      x1, y1, cy1, sy1, kx1, ky1,
      d,
      k;

  function interpolate(t) {
    var B = Math.sin(t *= d) * k,
        A = Math.sin(d - t) * k,
        x = A * kx0 + B * kx1,
        y = A * ky0 + B * ky1,
        z = A * sy0 + B * sy1;
    return [
      Math.atan2(y, x) / d3_radians,
      Math.atan2(z, Math.sqrt(x * x + y * y)) / d3_radians
    ];
  }

  interpolate.distance = function() {
    if (d == null) k = 1 / Math.sin(d = Math.acos(Math.max(-1, Math.min(1, sy0 * sy1 + cy0 * cy1 * Math.cos(x1 - x0)))));
    return d;
  };

  interpolate.source = function(_) {
    var cx0 = Math.cos(x0 = _[0] * d3_radians),
        sx0 = Math.sin(x0);
    cy0 = Math.cos(y0 = _[1] * d3_radians);
    sy0 = Math.sin(y0);
    kx0 = cy0 * cx0;
    ky0 = cy0 * sx0;
    d = null;
    return interpolate;
  };

  interpolate.target = function(_) {
    var cx1 = Math.cos(x1 = _[0] * d3_radians),
        sx1 = Math.sin(x1);
    cy1 = Math.cos(y1 = _[1] * d3_radians);
    sy1 = Math.sin(y1);
    kx1 = cy1 * cx1;
    ky1 = cy1 * sx1;
    d = null;
    return interpolate;
  };

  return interpolate;
}
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-40154586-1']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();
