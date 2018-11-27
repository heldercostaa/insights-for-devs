let compositeChart = dc.compositeChart('#chart-salary');

d3.csv("data/survey_results_public_1.csv").then(function(data){
data.forEach(function(d) { 
  if(d.ConvertedSalary=="NA") d.ConvertedSalary = 0;
  else d.ConvertedSalary = +d.ConvertedSalary;
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
        .domain(["Fewer than 10 employees", "10 to 19 employees", "20 to 99 employees", "100 to 499 employees", "500 to 999 employees", "1,000 to 4,999 employees", "5,000 to 9,999 employees", "10,000 or more employees", "NA"])
        .range(["Menos de 10", "10-19", "20-99","100-499","500-999","1000-4999","5000-9999","Mais de 10000", "NA"]);
var companyAccessor = function(d) {
  return d.value;
}
var filteredData = bachelorGroup.all();
filteredData.pop(8,9);
  console.log('filteredData', filteredData);
var companies = d3.set(filteredData.map(companyAccessor));
compositeChart.width(1200)
         .height(400)
         .margins({top: 50, right: 50, bottom: 50, left: 75})
         .dimension(companyDim)
         .x(companyScale)//d3.scaleBand())
           // .range(["Menos de 10", "10-19", "20-99","100-499","500-999","1000-4999","5000-9999","Mais de 10000", "NA"]))
         .xUnits(dc.units.ordinal)
         .y(d3.scaleLinear().domain([70000,140000]))
         .renderHorizontalGridLines(true)
         .xAxisLabel("Company size")
         .yAxisLabel("Salary (average)")
         .legend(dc.legend().x(1000).y(30).itemHeight(13).gap(5))
         .brushOn(false)
         .group(bachelorGroup)  
        .compose([
            dc.lineChart(compositeChart)
                      .group(bachelorGroup, 'Bachelor')
                      .ordinalColors(['steelblue']),
            dc.lineChart(compositeChart)
                      .group(masterGroup, 'Master')
                      .ordinalColors(['darkorange']),
            dc.lineChart(compositeChart)
                      .group(salaryGroup, 'Others')
                      .ordinalColors(['yellow'])]); 
compositeChart.render();
});