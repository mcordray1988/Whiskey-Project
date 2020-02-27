// SVG wrapper dimensions are determined by the current width
// and height of the browser window.
var svgWidth = 1200;
var svgHeight = 660;

var margin = {
  top: 50,
  right: 50,
  bottom: 50,
  left: 50
};

var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("data/Whiskey_Brand.csv").then(function(whiskeyData) {

	// Step 1: Parse data/cast as numbers
	whiskeyData.forEach(function(data) {
		data.Whiskies = +data.Whiskies;
		data.Votes = +data.Votes;
	});

	// Step 2: Create scale functions
	var xLinearScale = d3.scaleLinear()
		.domain([20, d3.max(whiskeyData, d => d.Whiskies)])
		.range([0, width]);

	var yLinearScale = d3.scaleLinear()
		.domain([20, d3.max(whiskeyData, d => d.Votes)])
		.range([height, 0]);

	// Step 3: Create axis functions
	var bottomAxis = d3.axisBottom(xLinearScale);
	var leftAxis = d3.axisLeft(yLinearScale);

	// Step 4: Append Axes to the chart
	chartGroup.append("g")
		.attr("transform", `translate(0, ${height})`)
		.call(bottomAxis);

	chartGroup.append("g")
		.call(leftAxis);

	// Step 5: Create Circles ◘◘◘ Replace with bars/pie chart info
	var circlesGroup = chartGroup.selectAll("circle")
	.data(whiskeyData)
	.enter()
	.append("circle")
	.attr("cx", d => xLinearScale(d.Whiskies))
	.attr("cy", d => xLinearScale(d.Votes))
	.attr("r", "15")
	.attr("fill", "brown")
	.attr("opacity", ".5");

	// Step 6: Initialize tool tip
	var toolTip = d3.tip()
		.attr("class", "tooltip")
		.offset([80, -60])
		.html(function(d) {
			return (`${d.Brand}<br>Whiskies: ${d.Whiskies}<br>Votes: ${d.Votes}`);
		});

	// Step 7: Create tooltip in the chart
	chartGroup.call(toolTip);

	// Step 8: Create event listeners to display and hide the tooltip
	circlesGroup.on("click", function(data) {
		toolTip.show(data, this);
	})
		// onmouseout event
		.on("mouseout", function(data, index) {
			toolTip.hide(data);
		});

	// Create axes labels
	chartGroup.append("text")
		.attr("transform", `translate(${width / 2}, ${height + margin.tip + 30})`)
		.attr("class", "axisText")
		.text("Hair Metal Band Hair Length (inches)");
}).catch(function(error) {
	console.log(error);
});