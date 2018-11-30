$(allInViewDev);
$(window).scroll(allInViewDev);

// Variável para impedir gerar duplicações
let existeDev = false;

// Função que retorna true se o elemento está visível na tela do usuário e falso c.c.
function isScrolledIntoViewDev(elem) {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

	return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

// Funcção que mana executar o código de geração do gráfico se o usuário estiver na parte correta na tela.
function allInViewDev() {
	if (isScrolledIntoViewDev($("#devtype-chart")) && !existeDev) makeDevType();
}

function makeDevType() {
	const width = document.getElementById('row').offsetWidth;
	const height = width/3;

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
	// console.log(devGroup.top(1)[0].value)
	devChart.width(width)
			.height(height)
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

	existeDev = true;
}