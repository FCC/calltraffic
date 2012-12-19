//id:0/num of message;1:num of minutes;2:revenue;
var xx=0.6;
var yy = 25;
var data,worldPath,regionPath;
var projection,path;
var currentRegion=null,currentid=null,currenttype=null,regions=[];
var currentCountries=[], currentCountryFeatures={"type":"FeatureCollection","features":[]};
var width = 1200,
    height = 460,
    widthC = 650,
    heightC = 500,
    widthD3 = 550,
    heightD3 = 500,
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
//	labels_region=null;

	var regions_proj=[{"region":"Africa","proj":[1432.1880650994576,[100.77034358047017,147.75406871609405]]}];


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
//label_region=d3.select("#visRegion").selectAll("#bubble-labels").data([nodes_region])
//	.enter()
//	.append("div")
//	.attr("id","label_region");

//var projection = d3.geo.equirectangular()
//		.scale(1)
//		.translate([0, 0]),
//	path = d3.geo.path().projection(projection);

var d3mapsvg = d3.select("#d3map")
		.append("svg")
		.attr("width", widthD3)
		.attr("height", heightD3) 
		.append("g")
//		 // .call(d3.behavior.zoom()
//		//	.on("zoom", redraw))

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

var countryPaths = d3mapsvg.append("g")
				 .attr("id", "country_path");

force_region = d3.layout.force();
force_country=d3.layout.force();

var collisionPadding = 4,
clipPadding = 4,
minRadius = 14, // minimum collision radius
maxRadius = 60; // also determines collision search radius

var radius_scale = d3.scale.pow().exponent(0.5)
	.range([minRadius, maxRadius]);

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
    
//    label_region
//    	.style("left", function(d){return  (d.x- d.dx / 2) + "px"})
//    	.style("top", function(d) {return (d.y - d.dy / 2) + "px"})
}; 

function forceCountryTick(e) {
    circles_country.each(move_towards_center(e.alpha))
    .attr("cx", function(d){return d.x})
    .attr("cy", function(d){return d.y});
    
//    label_region
//    	.style("left", function(d){return  (d.x- d.dx / 2) + "px"})
//    	.style("top", function(d) {return (d.y - d.dy / 2) + "px"})
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
		highlightMap(data.country);
    }
	

    //content +="<span class=\"name\">Amount:</span><span class=\"value\"> $#{addCommas(data.value)}</span><br/>"

    tooltip.showTooltip(content,d3.event)
}

function hide_details (data, i, element) {
    d3.select(element).attr("stroke", function(d) {return fill(d.id)});
    tooltip.hideTooltip();
    countryPaths.selectAll("path")
    .attr("stroke","#fff");
    if (typeof(feature) != "undefined"){
    	feature.attr("stroke","#fff");
    }
    
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
		update_d3map();
		//update3dmap();
		display_title_country( msgType + " in " + da.region);
		
		//hightlight the bubble
		circles_region.style("fill-opacity",0.2);
		d3.select(element).style("fill-opacity",1);
		//console.log(nodes_country);
	}	
}

function update_d3map(){
	
	currentCountryFeatures.features=[];
	worldPath.features.forEach(function(w){
		w.properties.isHighlight=false;
		currentCountries.forEach(function(c){
			if (c == w.properties.name){
				currentCountryFeatures.features.push(w);
				w.properties.isHighlight=true;
			}
		})
	})	
	var countries,gmax,gmin,propertyName;
	if (currentCountryFeatures.features.length==0){
		$("#mapContainer").hide();
	}
	else{
		$("#mapContainer").show();
	
		if (currentType=="minute"){
			countries=currentCountryFeatures.features.sort(function(a,b){
				return a.properties.NumberOfMinutes-b.properties.NumberOfMinutes;
			});		
			gmax=countries[countries.length-1].properties.NumberOfMinutes;
			gmin=countries[0].properties.NumberOfMinutes;
			propertyName="NumberOfMinutes";
			//countries.forEach(function(d){console.log(d.properties.NumberOfMinutes)});
		}else if (currentType=="message"){
			countries=currentCountryFeatures.features.sort(function(a,b){
				return a.properties.NumberOfMessages-b.properties.NumberOfMessages;
			});		
			gmax=countries[countries.length-1].properties.NumberOfMessages;
			gmin=countries[0].properties.NumberOfMessages;
			propertyName="NumberOfMessages";
		}else if (currentType=="revenue"){
			countries=currentCountryFeatures.features.sort(function(a,b){
				return a.properties.UsCarrierRevenues-b.properties.UsCarrierRevenues;
			});	
			gmax=countries[countries.length-1].properties.UsCarrierRevenues;
			gmin=countries[0].properties.UsCarrierRevenues;
			propertyName="UsCarrierRevenues";
		};
		
	    var cscale = d3.scale.pow().exponent(.5).domain([0, gmax])
	         .range(["#fae893", "#756518"]);
	
	 projection = d3.geo.equirectangular()
			.scale(1)
			.translate([0, 0]);
//	    projection = d3.geo.albers()
//		.scale(1)
//		.translate([0, 0]);
	    path = d3.geo.path().projection(projection);
		
		       var bounds0 = d3.geo.bounds(currentCountryFeatures);
	           var bounds = bounds0.map(projection);
	           var xscale = xx * widthD3/Math.abs(bounds[1][0] - bounds[0][0]);
	           var yscale = (heightD3 - yy) /
	                        Math.abs(bounds[1][1] - bounds[0][1]);
	           var scale = Math.min(xscale, yscale);
	           var translate =[-bounds0[0][0], -bounds0[1][1]];
	
	                projection.scale(scale);
	                projection.translate(projection([275,200]));
//	           if (typeof(regionsProj[currentRegion]) != "undefined"){
//	        		  projection.scale(regionsProj[currentRegion][0]);
//	        		  projection.translate(projection(translate));
//	        	  }
		
		var p = countryPaths.selectAll("path")
					  .data(countries)
					  .attr("d",path)
					  .attr("fill", function(d) { return cscale(d.properties[getPropertyNameByType()]); })
					  .attr("stroke", "#fff")
					  	  .on("mouseover", function(d,i) {return highlightCountry(d,i,this)})
					      .on("mouseout", function(d,i) {return unhighlightCountry(d,i,this)});
		
		p.enter().append("path")
					 .attr("d", path)
					.attr("fill", function(d) { return cscale(d.properties[getPropertyNameByType()]); })
					.attr("stroke", "#fff")
					  .on("mouseover", function(d,i) {return highlightCountry(d,i,this)})
					  .on("mouseout", function(d,i) {return unhighlightCountry(d,i,this)});

		 p.append("svg:title")
	      .text(function(d) { return d.properties.name; });  			  
		p.exit().remove();
		
		update3dmap(worldPath,gmax);
	
	}	
	
}

function highlightCountry(data,index,element){
	if (data.properties.isHighlight){
		d3.select(element).attr("stroke","red");
		circles_country.filter(function(e){
			   if(e.country==data.properties.name){
				   return true;
			   }
			   else{
				   return false;
			   }
			})
			.attr("stroke","black")
	}

}

function unhighlightCountry(data,index,element){
	if (data.properties.isHighlight){
		d3.select(element).attr("stroke","#fff");
		circles_country.filter(function(e){
			   if(e.country==data.properties.name){
				   return true;
			   }
			   else{
				   return false;
			   }
			})
			.attr("stroke",currentFill)
	}
}

function highlightMap(countryName){
	countryPaths.selectAll("path").filter(function(e){
		   if(e.properties.name==countryName){
			   return true;
		   }
		   else{
			   return false;
		   }
		})
		.attr("stroke","red")
		//.attr("stroke-width",2);
	
	feature.filter(function(e){
		   if(e.properties.name==countryName){
			   return true;
		   }
		   else{
			   return false;
		   }
		})
		.attr("stroke","red")
		//.attr("stroke-width",2);
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

function toggle_view(viewType){
	if (viewType=="2dmap"){
		$("#d3map").show();
		$("#orthomap").hide();
	}
	else{
		$("#d3map").hide();
		$("#orthomap").show();
	}
}

function populateWorldPath(){
	//console.log(worldPath);
	// allname=[];
	// foundname=[];
	data.Regions.forEach(function(r){
		r.TrafficReportDetails.forEach(function(c){
			//allname.push(c.CountryName);
			worldPath.features.forEach(function(w){
				if (c.CountryName==w.properties.name){
					w.properties.NumberOfMinutes=parseInt(c.MessageTelephoneServiceDetail.TrafficBilledInUS.NumberOfMinutes);
					w.properties.NumberOfMessages=parseInt(c.MessageTelephoneServiceDetail.TrafficBilledInUS.NumberOfMessages);
					w.properties.UsCarrierRevenues=parseInt(c.MessageTelephoneServiceDetail.TrafficBilledInUS.UsCarrierRevenues);
					w.properties.PayoutToForeignCarriers=parseInt(c.MessageTelephoneServiceDetail.TrafficBilledInUS.PayoutToForeignCarriers);
					w.properties.RetainedRevenues=parseInt(c.MessageTelephoneServiceDetail.TrafficBilledInUS.RetainedRevenues);
					//foundname.push(c.CountryName);	
					
				}
				
			})
		})

	})
	//console.log(allname.sort(d3.ascending));
	//console.log(foundname.sort(d3.ascending));

}

function redraw(){
	d3mapsvg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
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

d3.json("data/2010.json", function(d){
	data=d;
	d3.json("data/world2.json",function(json){
		worldPath=json;;
		populateWorldPath();
		create_nodes_region();
	})
	
});
