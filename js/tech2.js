function render(data, comparator) {
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
    var frameworkGroup = frameworkDim.group().reduceSum(function(d) {
        return 1;
    });

    hotLanguages = languageGroup.top(10);
    console.log(hotLanguages);
    hotFrameworks = frameworkGroup.top(10);
    console.log(hotFrameworks);
    d3.select("#chart-tech1").selectAll("div.h-bar")
            .data(hotLanguages)
        .enter().append("div")
        .attr("class", "h-bar")
        .style("width", function (d) {
            return d.value + "px";
        })
        .append("span");
    
    d3.select("#chart-tech2").selectAll("div.h-bar")
            .data(hotFrameworks)
        .attr("class", "h-bar")
        .style("width", function (d) {
            return d.value + "px";
        })
        .select("span")
            .text(function (d) {
                return d.key;
            });
     if(comparator)
        d3.select("body")
            .selectAll("div.h-bar") 
            .sort(comparator);
}

let comparePorCont = function (a, b) { 
    return a.value - b.value;
};


d3.csv("data/survey_results_public_2.csv").then(function(data){ 
    render(data, comparePorCont);
});