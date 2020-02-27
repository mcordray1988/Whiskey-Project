am4core.ready(function() {

    // Themes begin
    am4core.useTheme(am4themes_dataviz);
    am4core.useTheme(am4themes_animated);
    // Themes end
    
    // Create map instance
    var chart = am4core.create("chartdiv", am4maps.MapChart);
    var interfaceColors = new am4core.InterfaceColorSet();
    
    try {
        chart.geodata = am4geodata_worldLow;
    }
    catch (e) {
        chart.raiseCriticalError(new Error("Map geodata could not be loaded. Please download the latest <a href=\"https://www.amcharts.com/download/download-v4/\">amcharts geodata</a> and extract its contents into the same directory as your amCharts files."));
    }
    // Set projection
    chart.projection  = new am4maps.projections.Orthographic();
    chart.panBehavior = "rotateLongLat";
    chart.padding(20,20,20,20);
    
    // Add zoom control
    chart.zoomControl = new am4maps.ZoomControl();
    
    var homeButton = new am4core.Button();
    homeButton.events.on("hit", function(){
      chart.goHome();
    });
    
    homeButton.icon = new am4core.Sprite();
    homeButton.padding(7, 5, 7, 5);
    homeButton.width = 30;
    homeButton.icon.path = "M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8";
    homeButton.marginBottom = 10;
    homeButton.parent = chart.zoomControl;
    homeButton.insertBefore(chart.zoomControl.plusButton);
    
    // ocean fill
    chart.backgroundSeries.mapPolygons.template.polygon.fill = am4core.color("#8dabbf"); 
    chart.backgroundSeries.mapPolygons.template.polygon.fillOpacity = 1;
    chart.deltaLongitude = 20;
    chart.deltaLatitude = -20;
    
    // limits vertical rotation
    chart.adapter.add("deltaLatitude", function(delatLatitude){
        return am4core.math.fitToRange(delatLatitude, -90, 90);
    })
    
    // Create map polygon series
    
    var shadowPolygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
    shadowPolygonSeries.geodata = am4geodata_continentsLow;
    
    try {
        shadowPolygonSeries.geodata = am4geodata_continentsLow;
    }
    catch (e) {
        shadowPolygonSeries.raiseCriticalError(new Error("Map geodata could not be loaded. Please download the latest <a href=\"https://www.amcharts.com/download/download-v4/\">amcharts geodata</a> and extract its contents into the same directory as your amCharts files."));
    }
    
    shadowPolygonSeries.useGeodata = true;
    shadowPolygonSeries.dx = 2;
    shadowPolygonSeries.dy = 2;
    shadowPolygonSeries.mapPolygons.template.fill = am4core.color("#000");
    shadowPolygonSeries.mapPolygons.template.fillOpacity = 0.2;
    shadowPolygonSeries.mapPolygons.template.strokeOpacity = 0;
    shadowPolygonSeries.fillOpacity = 0.1;
    shadowPolygonSeries.fill = am4core.color("#000");
    
    
    // Create map polygon series
    var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.useGeodata = true;
    
    polygonSeries.calculateVisualCenter = true;
    polygonSeries.tooltip.background.fillOpacity = 0.2;
    polygonSeries.tooltip.background.cornerRadius = 20;
    
    // land fill
    var template = polygonSeries.mapPolygons.template;
    template.nonScalingStroke = true;
    template.fill   = am4core.color("#1b4182");
    template.stroke = am4core.color("#000");
    
    polygonSeries.calculateVisualCenter = true;
    template.propertyFields.id = "id";
    template.tooltipPosition = "fixed";
    template.fillOpacity = 1;
    
    template.events.on("over", function (event) {
      if (event.target.dummyData) {
        event.target.dummyData.isHover = true;
      }
    })
    template.events.on("out", function (event) {
      if (event.target.dummyData) {
        event.target.dummyData.isHover = false;
      }
    })
    
    var hs = polygonSeries.mapPolygons.template.states.create("hover");
    hs.properties.fillOpacity = 1;
    hs.properties.fill = am4core.color("#deb7ad");
    
    
    var graticuleSeries = chart.series.push(new am4maps.GraticuleSeries());
    graticuleSeries.mapLines.template.stroke = am4core.color("#fff");
    graticuleSeries.fitExtent = false;
    graticuleSeries.mapLines.template.strokeOpacity = 0.2;
    graticuleSeries.mapLines.template.stroke = am4core.color("#fff");
    
    // distillary data popup 
    var distillaries = chart.series.push(new am4maps.MapPolygonSeries())
    distillaries.tooltip.background.fillOpacity = 0.2;
    distillaries.tooltip.background.cornerRadius = 20;
    distillaries.tooltip.autoTextColor = false;
    distillaries.tooltip.label.fill = am4core.color("#fff");
    distillaries.tooltip.dy = -5;
    
    // distillery markers
    var distillariesTemplate  = distillaries.mapPolygons.template;
    distillariesTemplate.fill = am4core.color("#e3380e");
    distillariesTemplate.strokeOpacity = 0;
    distillariesTemplate.fillOpacity = 0.75;
    distillariesTemplate.tooltipPosition = "fixed";
    
    
    
    var hs2 = distillaries.mapPolygons.template.states.create("hover");
    hs2.properties.fillOpacity = 1;
    hs2.properties.fill = am4core.color("#767b87");
    
    polygonSeries.events.on("inited", function () {
      polygonSeries.mapPolygons.each(function (mapPolygon) {
        var count = data[mapPolygon.id];
    
        if (count > 0) {
          var polygon = distillaries.mapPolygons.create();
          polygon.multiPolygon = am4maps.getCircle(mapPolygon.visualLongitude, mapPolygon.visualLatitude, Math.max(0.2, Math.log(count) * Math.LN10 / 10));
          polygon.tooltipText  = mapPolygon.dataItem.dataContext.name + ": avg. " + count;
          mapPolygon.dummyData = polygon;
          polygon.events.on("over", function () {
            mapPolygon.isHover = true;
          })
          polygon.events.on("out", function () {
            mapPolygon.isHover = false;
          })
        }
        else {
          mapPolygon.tooltipText = mapPolygon.dataItem.dataContext.name + ": no distillaries";
          mapPolygon.fillOpacity = 0.9;
        }
    
      })
    })
    
    var data = {
        "AU": 66.5, 
        "AT": 56.25, 
        "BE": 70.45, 
        "BT": 77.67, 
        "CA": 65.23, 
        "CN": 58, 
        "CZ": 53.33, 
        "DK": 61.45, 
        "EG": 5.63, 
        "FI": 79.3, 
        "FR": 70.09, 
        "DE": 62.64, 
        "HU": 72, 
        "IS": 69.08, 
        "IN": 72.9, 
        "ID": 73.25, 
        "IE": 82.52, 
        "IL": 81.85, 
        "IT": 71.75, 
        "JP": 78.36, 
        "KE": 56, 
        "LI": 77.7, 
        "LU": 69.64, 
        "MX": 81, 
        "NP": 0.01, 
        "NL": 64.42, 
        "AN": 65.75, 
        "NZ": 67.33, 
        "NO": 55.99, 
        "PK": 4, 
        "PH": 19.67, 
        "PL": 59.99, 
        "RU": 58.17, 
        "GB": 0.01, 
        "CS": 61.67, 
        "SK": 74.09, 
        "ZA": 78.94, 
        "ES": 73.19, 
        "SE": 77.55, 
        "CH": 72.29, 
        "TW": 85.47, 
        "TR": 67.67, 
        "UA": 16.8, 
        "UK": 61.98, 
        "US": 58.69 
    }
    });

    