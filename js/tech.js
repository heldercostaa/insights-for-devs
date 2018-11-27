let languageChart = dc.barChart('#chart-tech1');
let frameworkChart = dc.barChart('#chart-tech1');

d3.csv("data/survey_results_public_2.csv").then(function(data){

  var facts = crossfilter(data);

  var languageDim = facts.dimension(function(d) {
   if (d.LanguageWorkedWith) return d.LanguageWorkedWith.split(";");
  });

  var frameworkDim = facts.dimension(function(d) {
   if (d.FrameworkWorkedWith) return d.FrameworkWorkedWith.split(";");
  });

  var languageGroup = languageDim.group().reduceSum(function(d) {
    return 1;
  });
  var framworkGroup = frameworkDim.group().reduceSum(function(d) {
    return 1;
  });

  languageChart.width(600)
           .height(400)
           .margins({top: 50, right: 50, bottom: 50, left: 75})
           .dimension(languageDim)
           .x(d3.scaleBand())
           .xUnits(dc.units.ordinal)
           .renderHorizontalGridLines(true)
           .xAxisLabel("Popularidade")
           .yAxisLabel("Linguagem")
           //.legend(dc.legend().x(1000).y(30).itemHeight(13).gap(5))
           .brushOn(false)  
           .group(languageGroup, 'Linguagem')
                        .ordinalColors(['darkorange']);
  languageChart.width(600)
           .height(400)
           .margins({top: 50, right: 50, bottom: 50, left: 75})
           .dimension(framekworkDim)
           .x(d3.scaleBand())
           .xUnits(dc.units.ordinal)
           .renderHorizontalGridLines(true)
           .xAxisLabel("Popularidade")
           .yAxisLabel("Framework")
           //.legend(dc.legend().x(1000).y(30).itemHeight(13).gap(5))
           .brushOn(false)  
           .group(frameworkGroup, 'Framework')
                        .ordinalColors(['steelblue']);                            
          
  dc.renderAll();
});