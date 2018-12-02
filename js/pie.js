var chart = dc.pieChart("#age");
var chart2 = dc.pieChart("#years");
var chart3 = dc.pieChart("#hobby");
var chart4 = dc.pieChart("#carreer");
var chart5 = dc.pieChart("#five");


var width = document.getElementById('row').offsetWidth;
var height = 250;

d3.csv("data/data_pie.csv").then(function(data) {

  var cross           = crossfilter(data),
      hobbyDimension  = cross.dimension(function(d) {
        return d.Hobby;})
      hobbySumGroup = hobbyDimension.group().reduceSum(function(d) {return 1;});
  var yearsDimension  = cross.dimension(function(d) {
    return d.YearsCodingProf;})
      yearsSumGroup = yearsDimension.group().reduceSum(function(d) {return 1;});
  var carreerDimension  = cross.dimension(function(d) {
    return d.CareerSatisfaction;})
      carreerSumGroup = carreerDimension.group().reduceSum(function(d) {return 1;});
  var ageDimension  = cross.dimension(function(d) {
    return d.Age;})
      ageSumGroup = ageDimension.group().reduceSum(function(d) {return 1;});
  var fiveDimension  = cross.dimension(function(d) {
    return d.HopeFiveYears;})
      fiveSumGroup = fiveDimension.group().reduceSum(function(d) {return 1;});

  chart
    .width(width)
    .height(height)
    .innerRadius(40)
    .radius(80)
    .dimension(ageDimension)
    .group(ageSumGroup)
    //.cx(140)
    //.cy(140)
    .externalLabels(30)
    .slicesCap(4)
	.legend(dc.legend().x((width/2)+150).y(10))
    .on('pretransition', function(chart) {
        chart.selectAll('text.pie-slice').text(function(d) {
            if(d.data.key == "Others"){
                return null;
            }else{
            return dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100) + '%';
            }
        })
	});


    chart2
    .width(width)
    .height(height)
    .innerRadius(40)
    .radius(80)
    .dimension(yearsDimension)
    .group(yearsSumGroup)
    //.cx(400)
    //.cy(300)
    .slicesCap(7)
	.externalLabels(30)
	.legend(dc.legend().x((width/2)+150).y(10))
    .on('pretransition', function(chart) {
        chart.selectAll('text.pie-slice').text(function(d) {
            return dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100) + '%';
        })
    });
    chart3
    .width(width)
    .height(height)
    .innerRadius(40)
    .radius(80)
    .dimension(hobbyDimension)
    .group(hobbySumGroup)
    .externalLabels(30)
    //.cx(400)
    //.cy(300)
	.legend(dc.legend().x((width/2)+150).y(10))
    .on('pretransition', function(chart) {
        chart.selectAll('text.pie-slice').text(function(d) {
            return dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100) + '%';
        })
    });
    chart4
    .width(width)
    .height(height)
    .innerRadius(40)
    .radius(80)
    .dimension(carreerDimension)
    .group(carreerSumGroup)
    //.cx(400)
    //.cy(300)
    .externalLabels(30)
	.legend(dc.legend().x((width/2)+150).y(10))
    .on('pretransition', function(chart) {
        chart.selectAll('text.pie-slice').text(function(d) {
            return dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100) + '%';
        })
    });
    chart5
    .width(width)
    .height(height)
    .innerRadius(40)
    .radius(80)
    .dimension(fiveDimension)
    .group(fiveSumGroup)
    //.cx(400)
    //.cy(380)
    .slicesCap(5)
    .externalLabels(30)
	.legend(dc.legend().x((width/2)+150).y(10))
    .on('pretransition', function(chart) {
        chart.selectAll('text.pie-slice').text(function(d) {
            return dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100) + '%';
        })
    });

  chart.render();
  chart2.render();
  chart3.render();
  chart4.render();
  chart5.render();
});
