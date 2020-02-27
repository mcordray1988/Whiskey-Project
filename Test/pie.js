//set margin & radius
var margin ={top:20, right: 20, bottom: 20, left:20}
    width = 500 - margin.right - margin.left,
    height = 500 - margin.top - margin.bottom,
    radius = width/2;




//create arc generator and pie generator

var arc = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

var labelArc = d3.arc()
    .outerRadius(radius - 50)
    .innerRadius(radius - 50);

var pie = d3.pie()
    .sort(null)
    .value(function(d) { return d.Whiskies; });

//define svg

var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width/2 + "," + height/2 + ")");

//import data
d3.csv("Whisky_Brand.csv").then(function(whiskeyData){
//d3.csv("Whisky_Brand.csv", function(whiskeyData){
    whiskeyData.forEach(function(d){
        d.Brand = +d.Brand;
        d.Votes = +d.Votes;
        d.Country = +d.Country;
    });

    var nested_data = d3.nest()
    .key(function(d) { return d.Brand, d.Country; })
    .entries(whiskeyData);
    console.log(nested_data)

    var g = svg
        .selectAll(".country")
        .data(pie(whiskeyData))
        .enter()
        .append("g")
        .attr("class", "country")
    /*var g = svg.selectAll(".arc")
        .data(pie(whiskeyData))
        .enter()
        .append("g")
        .attr("class", "arc");*/

    //append path of arc

    g.append("path")
        .attr("d", arc)
        .style("fill","blue");

    //append the text

    g.append("text")
        .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .text(function(d) {return d.Brand;} );
/*
        d3.select('g')
        .selectAll('text')
        .data(whiskeyData)
        .enter()
        .append('text')
        .each(function(d) {
            var centroid = labelArc.centroid(d);
            d3.select(this)
                .attr('x', centroid[0])
                .attr('y', centroid[1])
                .attr('dy', '0.33em')
                .text(d.whiskeyData.Whiskies);*/
        
})