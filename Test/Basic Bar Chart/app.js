// SVG wrapper dimensions are determined by the current width
// and height of the browser window.
var svgWidth = 980;
var svgHeight = 600;

var margin = {
  top: 20,
  right: 40,
  bottom: 90,
  left: 100
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
d3.json("WhiskeyBrands.json").then(function(whiskeyData) {

	// Step 1: Parse data/cast as numbers
	whiskeyData.forEach(function(data) {
		data.Whiskies = +data.Whiskies
		data.Votes = +data.Votes;
	});

	// Step 1.5 Filter data to top 10 votes
	var topData = whiskeyData.sort(function(a,b) {
		return d3.descending(+a.Votes, +b.Votes);
	}).slice(0, 10);

	// Step 2: Create scale functions
	// Band scale for horizontal axis
	var xBandScale = d3.scaleBand()
		.domain(topData.map(d => d.Brand))
		.range([0, width])
		.padding(0.1);

	// Linear scale for vertical axis
	var yLinearScale = d3.scaleLinear()
		.domain([20, d3.max(topData, d => d.Votes)])
		.range([height, 0]);

	// Step 3: Create axis functions
	var bottomAxis = d3.axisBottom(xBandScale);
	var leftAxis = d3.axisLeft(yLinearScale).ticks(10);

	// Step 4: Append Axes to the chart
	chartGroup.append("g")
		.attr("transform", `translate(0, ${height})`)
		.call(bottomAxis);

	chartGroup.append("g")
		.call(leftAxis);

	// Step 5: Create Circles ◘◘◘ Replace with bars/pie chart info
	var barGroup = chartGroup.selectAll(".bar")
	.data(topData)
	.enter()
	.append("rect")
	.attr("x", d => xBandScale(d.Brand))
	.attr("y", d => yLinearScale(d.Votes))
	.attr("width", xBandScale.bandwidth())
	.attr("height", d => height - yLinearScale(d.Votes))
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
	barGroup.on("click", function(data) {
		toolTip.show(data, this);
	})
		// onmouseout event
		.on("mouseout", function(data, index) {
			toolTip.hide(data);
		});

	// Create axes labels
	chartGroup.append("text")
		.attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
		.attr("class", "axisText")
		.text("Whiskey Information");
}).catch(function(error) {
	console.log(error);
});