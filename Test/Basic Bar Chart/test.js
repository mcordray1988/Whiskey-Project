// Data Journalism - D3

// Code for Chart is Wrapped Inside a Function That Automatically Resizes the Chart
function makeResponsive() {

  // If SVG Area is not Empty When Browser Loads, Remove & Replace with a Resized Version of Chart
  var svgArea = d3.select("body").select("svg");

  // Clear SVG is Not Empty
  if (!svgArea.empty()) {
    svgArea.remove();
  }
  
  // Setup Chart Parameters/Dimensions
  var svgWidth = 980;
  var svgHeight = 600;

  // Set SVG Margins
  var margin = {
    top: 20,
    right: 40,
    bottom: 90,
    left: 100
  };

  // Define Dimensions of the Chart Area
  var height = svgHeight - margin.top - margin.bottom;
  var width = svgWidth - margin.left - margin.right;

  // Create an SVG Element/Wrapper - Select Body, Append SVG Area & Set the Dimensions
  var svg = d3
    .select(".chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  // Append Group Element & Set Margins - Shift (Translate) by Left and Top Margins Using Transform
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Initial Params
  var chosenXAxis = "Rating";
  var chosenYAxis = "Whiskies";

  // Function for Updating xScale Upon Click on Axis Label
  function xScale(whiskeyData, chosenXAxis) {
    // Create Scale Functions for the Chart (chosenXAxis)
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(whiskeyData, d => d[chosenXAxis]) * 0.8,
        d3.max(whiskeyData, d => d[chosenXAxis]) * 1.05
      ])
      .range([0, width]);
    return xLinearScale;
  }

  // Function for Updating yScale Upon Click on Axis Label
  function yScale(whiskeyData, chosenYAxis) {
    // Create Scale Functions for the Chart (chosenYAxis)
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(whiskeyData, d => d[chosenYAxis]) * 0.0001,
        d3.max(whiskeyData, d => d[chosenYAxis]) * 1.05
      ])
      .range([height, 0]);
    return yLinearScale;
  }

  // Function for Updating xAxis Upon Click on Axis Label
  function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
    return xAxis;
  }

  // Function for Updating yAxis Upon Click on Axis Label
  function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
    return yAxis;
  }

  // Function for Updating Circles Group with a Transition to New Circles
  function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("cy", d => newYScale(d[chosenYAxis]));
    return circlesGroup;
  }

  // Function for Updating Text Group with a Transition to New Text
  function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    textGroup.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]))
      .attr("y", d => newYScale(d[chosenYAxis]))
      .attr("text-anchor", "middle");

    return textGroup;
  }

  // Function for Updating Circles Group with New Tooltip
  function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup) {

    if (chosenXAxis === "Rating") {
      var xLabel = "Rating";
    }
    if (chosenYAxis === "Whiskies") {
      var yLabel = "Whiskies";
    }
    else if (chosenYAxis === "Votes") {
      var yLabel = "Votes";
    }

    // Initialize Tool Tip
    var toolTip = d3.tip()
      .attr("class", "tooltip d3-tip")
      .offset([90, 90])
      .html(function(d) {
        return (`<strong>${d.Brand}</strong><br>${xLabel} ${d[chosenXAxis]}<br>${yLabel} ${d[chosenYAxis]}`);
      });
    // Create Circles Tooltip in the Chart
    circlesGroup.call(toolTip);
    // Create Event Listeners to Display and Hide the Circles Tooltip
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout Event
      .on("mouseout", function(data) {
        toolTip.hide(data);
      });
    // Create Text Tooltip in the Chart
    textGroup.call(toolTip);
    // Create Event Listeners to Display and Hide the Text Tooltip
    textGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout Event
      .on("mouseout", function(data) {
        toolTip.hide(data);
      });
    return circlesGroup;
  }

  // Import Data from the data.json File & Execute Everything Below
  d3.json("WhiskeyBrands.json")
    .then(function(whiskeyData) {

    // Format/Parse the Data (Cast as Numbers)
    whiskeyData.forEach(function(data) {
      data.Whiskies = +data.Whiskies
      data.Votes = +data.Votes
      data.Rating = +data.Rating
    });

    // Create xLinearScale & yLinearScale Functions for the Chart
    var xLinearScale = xScale(whiskeyData, chosenXAxis);
    var yLinearScale = yScale(whiskeyData, chosenYAxis);

    // Create Axis Functions for the Chart
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append xAxis to the Chart
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    // Append yAxis to the Chart
    var yAxis = chartGroup.append("g")
      .classed("y-axis", true)
      .call(leftAxis);

    // Create & Append Initial Circles
    var circlesGroup = chartGroup.selectAll(".stateCircle")
      .data(whiskeyData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("class", "stateCircle")
      .attr("r", 15)
      .attr("opacity", ".75");

    // Append Text to Circles
    var textGroup = chartGroup.selectAll(".stateText")
      .data(whiskeyData)
      .enter()
      .append("text")
      .attr("x", d => xLinearScale(d[chosenXAxis]))
      .attr("y", d => yLinearScale(d[chosenYAxis]*.98))
      .text(d => (d.Brand))
      .attr("class", "stateText")
      .attr("font-size", "12px")
      .attr("text-anchor", "middle")
      .attr("fill", "white");

    // Create Group for 1 xAxis Label
    var xLabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);
    // Append xAxis
    var ratingLabel = xLabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "Rating") // Value to Grab for Event Listener
      .classed("active", true)
      .text("Ratings");

    // Create Group for 2 yAxis Labels
    var yLabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(-25, ${height / 2})`);
    // Append yAxis
    var whiskiesLabel = yLabelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -30)
      .attr("x", 0)
      .attr("value", "Whiskies")
      .attr("dy", "1em")
      .classed("axis-text", true)
      .classed("active", true)
      .text("Whiskies");

    var votesLabel = yLabelsGroup.append("text") 
      .attr("transform", "rotate(-90)")
      .attr("y", -50)
      .attr("x", 0)
      .attr("value", "Votes")
      .attr("dy", "1em")
      .classed("axis-text", true)
      .classed("inactive", true)
      .text("Votes");

    // updateToolTip Function
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);

    // xAxis Labels Event Listener
    xLabelsGroup.selectAll("text")
      .on("click", function() {
        // Get Value of Selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {
          // Replaces chosenXAxis with Value
          chosenXAxis = value;
          // Updates xScale for New Data
          xLinearScale = xScale(whiskeyData, chosenXAxis);
          // Updates xAxis with Transition
          xAxis = renderXAxes(xLinearScale, xAxis);
          // Updates Circles with New Values
          circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
          // Updates Text with New Values
          textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis)
          // Updates Tooltips with New Information
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);
          // Changes Classes to Change Bold Text
          if (chosenXAxis === "Rating") {
            ratingLabel
              .classed("active", true)
              .classed("inactive", false);
          }
        }
      });
    
      // yAxis Labels Event Listener
    yLabelsGroup.selectAll("text")
      .on("click", function() {
        // Get Value of Selection
        var value = d3.select(this).attr("value");
        if (value !== chosenYAxis) {
          // Replaces chosenYAxis with Value
          chosenYAxis = value;
          // Updates yScale for New Data
          yLinearScale = yScale(whiskeyData, chosenYAxis);
          // Updates yAxis with Transition
          yAxis = renderYAxes(yLinearScale, yAxis);
          // Updates Circles with New Values
          circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
          // Updates Text with New Values
          textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis)
          // Updates Tooltips with New Information
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);
          // Changes Classes to Change Bold Text
          if (chosenYAxis === "Whiskies") {
            whiskiesLabel
              .classed("active", true)
              .classed("inactive", false);
            votesLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else {
            whiskiesLabel
              .classed("active", false)
              .classed("inactive", true);
            votesLabel
              .classed("active", true)
              .classed("inactive", false);
          }
        }
      });
  });
}
// When Browser Loads, makeResponsive() is Called
makeResponsive();

// When Browser Window is Resized, makeResponsive() is Called
d3.select(window).on("resize", makeResponsive);