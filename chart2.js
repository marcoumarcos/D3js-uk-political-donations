// GLOBALS
var w = 1000,h = 900;
var padding = 2;
var nodes = [];
var force, node, data, maxVal;
var brake = 0.2;
var radius = d3.scale.sqrt().range([10, 20]);

var partyCentres = { 
    con: { x: w / 3, y: h / 3.3}, 
    lab: {x: w / 3, y: h / 2.3}, 
    lib: {x: w / 3, y: h / 1.8}
  };

var entityCentres = { 
    company: {x: w / 3.65, y: h / 2.3},
		union: {x: w / 3.65, y: h / 1.8},
		other: {x: w / 1.15, y: h / 1.9},
		society: {x: w / 1.12, y: h  / 3.2 },
		pub: {x: w / 1.8, y: h / 2.8},
		individual: {x: w / 3.65, y: h / 3.3},
	};

var fill = d3.scale.ordinal().range(["#EECADA", "#60E8AD", "#F26183", "#EC80FE"]);

var svgCentre = { 
    x: w / 3.6, y: h / 2
  };

var svg = d3.select("#chart").append("svg")
	.attr("id", "svg")
	.attr("width", w)
	.attr("height", h);

var nodeGroup = svg.append("g");

var tooltip = d3.select("#chart")
 	.append("div")
	.attr("class", "tooltip")
	.attr("id", "tooltip");

function transition(name) {
	if (name === "all-departments") {
		$("#initial-content").fadeIn(250);
		$("#value-scale").fadeIn(1000);
		$("#ana-enotita").fadeOut(250);
		$("#view-source-type").fadeOut(250);
		$("#view-party-type").fadeOut(250);
		$("#chart").fadeIn(1000);
		return total();
		//location.reload();
	}
	if (name === "group-by-perif") {
		$("#initial-content").fadeOut(250);
		$("#value-scale").fadeOut(250);
		$("#view-party-type").fadeOut(250);
		$("#view-source-type").fadeOut(250);
		$("#ana-enotita").fadeIn(1000);
        $("#chart").fadeIn(1000);
		return donorType();
	}
	if (name === "group-by-dimos") {
		$("#initial-content").fadeOut(250);
		$("#value-scale").fadeOut(250);
		$("#ana-enotita").fadeOut(250);
		$("#view-party-type").fadeOut(250);
		$("#view-source-type").fadeIn(1000);
        $("#chart").fadeIn(1000);
		return fundsType();
	}
	}

function start() {

	node = nodeGroup.selectAll("circle")
		.data(nodes)
	.enter().append("circle")
		.attr("class", function(d) { return "node"; })
		.attr("amount", function(d) { return d.value; })
		.attr("perif", function(d) { return d.perif; })
		.attr("dimos", function(d) { return d.dimos; })
		.attr("r", 0)
		.style("fill", function(d) { return fill(d.perif); })
		.on("mouseover", mouseover)
		.on("mouseout", mouseout)	//;
		// Alternative title based 'tooltips'
		// node.append("title")
		//	.text(function(d) { return d.donor; });
		.on("click", googleSearch);	//activate google search
	
		force.gravity(0)
			.friction(0.75)
			.charge(function(d) { return -Math.pow(d.radius, 2) / 3; })
			.on("tick", all)
			.start();

		node.transition()
			.duration(2500)
			.attr("r", function(d) { return d.radius; });
}

function total() {

	force.gravity(0)
		.friction(0.9)
		.charge(function(d) { return -Math.pow(d.radius, 2) / 2.8; })
		.on("tick", all)
		.start();
}

function donorType() {
	force.gravity(0)
		.friction(0.8)
		.charge(function(d) { return -Math.pow(d.radius, 2.0) / 3; })
		.on("tick", entities)
		.start();
}

function fundsType() {
	force.gravity(0)
		.friction(0.75)
		.charge(function(d) { return -Math.pow(d.radius, 2.0) / 3; })
		.on("tick", types)
		.start();
}

function entities(e) {
	node.each(moveToEnts(e.alpha));

		node.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) {return d.y; });
}

function types(e) {
	node.each(moveToFunds(e.alpha));
		node.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) {return d.y; });
}

function all(e) {
	node.each(moveToCentre(e.alpha))
		.each(collide(0.001));
		node.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) {return d.y; });
}

function moveToCentre(alpha) {
	return function(d) {
	    var offset = 150;
	    var step = -50;
		var centreX = svgCentre.x + 75;
			if (d.value <= 5001) {
				centreY = svgCentre.y + offset + step;
			} else if (d.value <= 7501) {
				centreY = svgCentre.y + offset + step * 2;
			} else if (d.value <= 10001) {
				centreY = svgCentre.y + offset + step * 3;
			} else  if (d.value <= 12501) {
				centreY = svgCentre.y + offset + step * 4;
			} else  if (d.value <= 15001) {
				centreY = svgCentre.y + offset + step * 5;
			} else  if (d.value <= maxVal) {
				centreY = svgCentre.y + offset + step * 6;
			} else {
				centreY = svgCentre.y;
			}

		d.x += (centreX - d.x) * (brake + 0.06) * alpha * 1.2;
		d.y += (centreY - 100 - d.y) * (brake + 0.06) * alpha * 1.2;
	};
}

function moveToEnts(alpha) {
	return function(d) {

		if (d.perif === 'ΒΟΡΕΙΟΥ ΤΟΜΕΑ ΑΘΗΝΩΝ') {
            centreX = 350;
            centreY = 200;
		} else if (d.perif === 'ΔΥΤΙΚΟΥ ΤΟΜΕΑ ΑΘΗΝΩΝ') {
            centreX = 800;
            centreY = 300;
        } else if (d.perif === 'ΚΕΝΤΡΙΚΟΥ ΤΟΜΕΑ ΑΘΗΝΩΝ') {
            centreX = 320;
            centreY = 400;
        } else{
            centreX = 800;
            centreY = 520;
        }
		d.x += (centreX - d.x) * (brake + 0.02) * alpha * 1.1;
		d.y += (centreY - d.y) * (brake + 0.02) * alpha * 1.1;
	};
}

function moveToFunds(alpha) {
	return function(d) {
		if (d.dimos !== 'ΑΘΗΝΑΙΩΝ') {
            centreX = 350;
			centreY = 300;
		} else {
			centreX = 660;
			centreY = 300;
		}
		d.x += (centreX - d.x) * (brake + 0.02) * alpha * 1.1;
		d.y += (centreY - d.y) * (brake + 0.02) * alpha * 1.1;
	};
}

// Collision detection function by m bostock
function collide(alpha) {
  var quadtree = d3.geom.quadtree(nodes);
  return function(d) {
    var r = d.radius + radius.domain()[1] + padding,
        nx1 = d.x - r,
        nx2 = d.x + r,
        ny1 = d.y - r,
        ny2 = d.y + r;
    quadtree.visit(function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== d)) {
        var x = d.x - quad.point.x,
            y = d.y - quad.point.y,
            l = Math.sqrt(x * x + y * y),
            r = d.radius + quad.point.radius + (d.color !== quad.point.color) * padding;
        if (l < r) {
          l = (l - r) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y;
        }
      }
      return x1 > nx2
          || x2 < nx1
          || y1 > ny2
          || y2 < ny1;
    });
  };
}

function display(data) {

    data = data.filter(function (d) { return d["ΝΟΜΑΡΧΙΑ"] === "ΑΘΗΝΩΝ" });

    data.forEach(function(d) {
        d["ΠΛΗΘΟΣ ΕΚΛΟΓΕΩΝ"] = +d["ΠΛΗΘΟΣ ΕΚΛΟΓΕΩΝ"].replace(",","");
    });

	maxVal = d3.max(data, function(d) { return d["ΠΛΗΘΟΣ ΕΚΛΟΓΕΩΝ"]; });

	var radiusScale = d3.scale.pow()
		.domain([0, maxVal])
			.range([0, 150]);

	data.forEach(function(d, i) {
		var y = radiusScale(d["ΠΛΗΘΟΣ ΕΚΛΟΓΕΩΝ"]);
		var node = {
				radius: radiusScale(d["ΠΛΗΘΟΣ ΕΚΛΟΓΕΩΝ"]) / 5,
				value: d["ΠΛΗΘΟΣ ΕΚΛΟΓΕΩΝ"],
                perif: d["ΠΕΡΙΦΕΡΕΙΑΚΗ ΕΝΟΤΗΤΑ"],
                dimos: d["ΔΗΜΟΣ (Καλλικράτειος)"],
                diamerisma: d["ΕΚΛΟΓΙΚΟ ΔΙΑΜΕΡΙΣΜΑ"],
				x: Math.random() * w,
				y: -y
      };

      nodes.push(node)
	});

	console.log(nodes);

	force = d3.layout.force()
		.nodes(nodes)
		.size([w, h]);

	return start();
}

function mouseover(d, i) {
	// tooltip popup
	var mosie = d3.select(this);
	var amount = mosie.attr("amount");
	var offset = $("svg").offset();

	
	var infoBox = "<p> Περιφερειακή ενότητα: <b>" + d.perif + "</b> " +  "</p>"
	
	 							+ "<p> Δήμος: <b>" + d.dimos + "</b></p>"
                                + "<p> Εκλ.διαμ.: <b>" + d.diamerisma + "</b></p>"
								+ "<p> Πλήθος εκλογέων: <b>" + amount + "</b></p>";
	
	
	mosie.classed("active", true);
	d3.select(".tooltip")
  	.style("left", (parseInt(d3.select(this).attr("cx") - 80) + offset.left) + "px")
    .style("top", (parseInt(d3.select(this).attr("cy") - (d.radius+150)) + offset.top) + "px")
		.html(infoBox)
			.style("display","block");
	
	responsiveVoice.speak(amount + " voters");

	var oldHtml = $("#mouse-visits").html();
	var htmlToAdd = "<div>Εκλ.Διαμ. " + d.diamerisma +": "+ amount + "</div>"
    $("#mouse-visits").html(htmlToAdd + oldHtml);

	}

function mouseout() {
	// no more tooltips
		var mosie = d3.select(this);
	
		mosie.classed("active", false);

		d3.select(".tooltip")
			.style("display", "none");
	
	responsiveVoice.cancel();	
		}

$(document).ready(function() {
		d3.selectAll(".switch").on("click", function(d) {
      var id = d3.select(this).attr("id");
      return transition(id);
    });
    return d3.csv("data/plhthos1eklogeon2010anaekldiamerisma.csv", display);

});

/* Function which opens google search results for each municipality */
function googleSearch(d) {
  window.open("https://www.google.com/search?q=ΔΗΜΟΣ+" + d.dimos);
}
