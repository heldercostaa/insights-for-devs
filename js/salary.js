let compositeChart = dc.compositeChart('#chart-salary');

d3.csv("data/survey_results_public_1.csv").then(function(data){
data.forEach(function(d) { 
  if(d.ConvertedSalary=="NA") d.ConvertedSalary = 0;
  else d.ConvertedSalary = +d.ConvertedSalary;
});
data.forEach(function(d) { 
  if(d.CompanySize=="Fewer than 10 employees") d.CompanySize = "1;9 ou menos";
  else if(d.CompanySize== "10 to 19 employees" ) d.CompanySize = "2;10 até 19";
  else if(d.CompanySize=="20 to 99 employees" ) d.CompanySize = "3;20 até 99";
  else if(d.CompanySize=="100 to 499 employees" ) d.CompanySize = "4;100 até 499";
  else if(d.CompanySize=="500 to 999 employees" ) d.CompanySize = "5;500 até 999";
  else if(d.CompanySize=="1,000 to 4,999 employees" ) d.CompanySize = "6;1000 até 4999";
  else if(d.CompanySize=="5,000 to 9,999 employees" ) d.CompanySize = "7;5000 até 9999";
  else if(d.CompanySize=="10,000 or more employees") d.CompanySize = "8;10000 ou mais";
});

var n_bachelor = {};
data.forEach(function(d){
    n_bachelor[d.CompanySize] = 0
})
data.forEach(function(d){
    if (d.FormalEducation=='Bachelor’s degree (BA, BS, B.Eng., etc.)' && d.ConvertedSalary != 0) 
        n_bachelor[d.CompanySize] = n_bachelor[d.CompanySize] + 1;
})
var n_master = {};
data.forEach(function(d){
    n_master[d.CompanySize] = 0
})
data.forEach(function(d){
    if (d.FormalEducation=='Master’s degree (MA, MS, M.Eng., MBA, etc.)'&& d.ConvertedSalary != 0) 
        n_master[d.CompanySize] = n_master[d.CompanySize] + 1;
})
var n_others = {};
data.forEach(function(d){
    n_others[d.CompanySize] = 0
})
data.forEach(function(d){
    if (d.FormalEducation!='Master’s degree (MA, MS, M.Eng., MBA, etc.)'&&d.FormalEducation!='Bachelor’s degree (BA, BS, B.Eng., etc.)' && d.ConvertedSalary != 0) 
        n_others[d.CompanySize] = n_others[d.CompanySize] + 1;
})
console.log(n_bachelor)
console.log(n_master)

var facts = crossfilter(data);

var companyDim = facts.dimension(function(d) {
 //console.log(d.CompanySize);
 return d.CompanySize;
});
var bachelorGroup = companyDim.group().reduceSum(function(d) {
  if (d.FormalEducation=='Bachelor’s degree (BA, BS, B.Eng., etc.)' && d.ConvertedSalary!=0) return +d.ConvertedSalary/n_bachelor[d.CompanySize];
  else return 0;
});
var masterGroup = companyDim.group().reduceSum(function(d) {
  if (d.FormalEducation=='Master’s degree (MA, MS, M.Eng., MBA, etc.)' && d.ConvertedSalary!=0) return +d.ConvertedSalary/n_master[d.CompanySize];
  else return 0;
});
var salaryGroup = companyDim.group().reduceSum(function(d) {
  if (d.FormalEducation!='Master’s degree (MA, MS, M.Eng., MBA, etc.)' && d.FormalEducation!='Bachelor’s degree (BA, BS, B.Eng., etc.)' && d.ConvertedSalary!=0) return +d.ConvertedSalary/n_others[d.CompanySize];
  else return 0;
});

let companyScale = d3.scaleBand()
        .domain(["Fewer than 10 employees", "10 to 19 employees", "20 to 99 employees", "100 to 499 employees", "500 to 999 employees", "1,000 to 4,999 employees", "5,000 to 9,999 employees", "10,000 or more employees"])
        .range(["Menos de 10", "10-19", "20-99","100-499","500-999","1000-4999","5000-9999","Mais de 10000"]);
var companyAccessor = function(d) {
  return d.value;
}
var filteredData = bachelorGroup.all();
filteredData.pop(8,9);
var filteredData2 = masterGroup.all();
filteredData2.pop(8,9);
var filteredData3 = salaryGroup.all();
filteredData3.pop(8,9);
  console.log('filteredData', filteredData);
var companies = d3.set(filteredData.map(companyAccessor));
compositeChart.width(1200)
         .height(400)
         .margins({top: 50, right: 50, bottom: 50, left: 75})
         .dimension(companyDim)
         .x(d3.scaleBand())
         .xUnits(dc.units.ordinal)
         .y(d3.scaleLinear().domain([70000,140000]))
         .renderHorizontalGridLines(true)
         .xAxisLabel("Tamanho da empresa")
         .yAxisLabel("Média salarial")
         .legend(dc.legend().x(1000).y(30).itemHeight(13).gap(5))
         .brushOn(false)
         .group(bachelorGroup)
         ._rangeBandPadding(1)  
        .compose([
            dc.lineChart(compositeChart)
                      .group(bachelorGroup, 'Bacharel')
                      .ordinalColors(['steelblue']),
            dc.lineChart(compositeChart)
                      .group(masterGroup, 'Mestre')
                      .ordinalColors(['darkorange']),
            dc.lineChart(compositeChart)
                      .group(salaryGroup, 'Outros')
                      .ordinalColors(['green'])]);
compositeChart.xAxis().ticks(8).tickFormat(function(d){ return d.split(';')[1]}); 
compositeChart.render();
});