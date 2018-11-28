let devChart = dc.rowChart('#devtype-chart');
function remove_NA(source_group) {
    return {
        all:function () {
            return source_group.all().filter(function(d) {
                return d.key != "NA";
            });
        }
    };
}
d3.csv("data/survey_results_public_2.csv").then(function(data){
data.forEach(function(d) { 
  if(d.ConvertedSalary=="NA") d.ConvertedSalary = 0;
  else d.ConvertedSalary = +d.ConvertedSalary;
});

var facts = crossfilter(data);

var devDim = facts.dimension(function(d) {
 //console.log(d.CompanySize);
 return d.DevType;
});
var devGroup = devDim.group().reduceCount();
var devGroupNew = remove_NA(devGroup);
console.log(devGroup.top(1)[0].value)
devChart.width(1200)
         .height(400)
        // .margins({top: 50, right: 50, bottom: 50, left: 75})
         .dimension(devDim)
         .x(d3.scaleLinear().domain([0,devGroup.top(1)[0].value]).range([0,1000]))
         //.xUnits(dc.units.ordinal)
         //.renderHorizontalGridLines(true)
         //.xAxisLabel("Tipo de desenvolvedor")
         //.yAxisLabel("Popularidade")
         //.legend(dc.legend().x(1000).y(250).itemHeight(13).gap(5))
         //.brushOn(true)
         //._rangeBandPadding(1)  
        .group(devGroupNew, 'Tipo de desenvolvedor')
        .rowsCap(10)
        .elasticX(true);
devChart.render();
});