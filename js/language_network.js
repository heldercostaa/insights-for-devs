$(allInView);
$(window).scroll(allInView);

// Variável para impedir gerar duplicações do grafo.
var existe = false;

// Função que retorna true se o elemento está visível na tela do usuário e falso c.c.
function isScrolledIntoView(elem) {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

	return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

// Funcção que mana executar o código de geração do gráfico se o usuário estiver na parte correta na tela.
function allInView() {
	if (isScrolledIntoView($("#network")) && !existe) makeNetwork();
}

// Função para gerar grafo de redes.
function makeNetwork() {

	const width = document.getElementById('row').offsetWidth;
	const height = width/2;

	const radius = 20;

	// Create svg element inside #vis element and attribute it to the vis variable
	const network = d3.select('#network')
				.append('svg')
				.attr('width', width)
				.attr('height', height);
				//.attr('viewBox', [-width/2, -height/2, width, height])

	// Read the contents of data/songs.json file and process it as a graph variable
	d3.json('data/languages-network/stack_network.json').then(function(graph){

		let colorScale = ["#FEA47F","#25CCF7","#EAB543","#55E6C1","#2C3A47","#3B3B98","#FC427B","#BDC581","#82589F","#ff5e57","#F8EFBA","#1B9CFC","#d2dae2","#085410"];

		// Set the nodes and links
		const nodes = graph.nodes;
		const links = graph.links;
		
		// create simulation constant using the forceSimulation function defined down below
		const simulation = forceSimulation(nodes, links).on('tick', ticked);
		// create link svg elements
		const link = network.append('g')
						.attr("class", "links")
						.selectAll('line')
						.data(links)
						.enter()
						.append('line')
						.attr('class', 'link');
		
		// set dynamic radius
		const countExtent = d3.extent(nodes, function(d){
			return d.nodesize;
		});

		let circleRadius = d3.scaleSqrt()
							.range([5,20])
							.domain(countExtent);

		// create node svg elements
		const node = network.append('g')
						.attr('class', 'nodes')
						.selectAll('g')
						.data(nodes)
						.enter()
						.append('g')
						.call(drag(simulation));

		node.append('circle')
			.attr('r', d => circleRadius(d.nodesize))
			.attr('fill', d => colorScale[d.group-1])
			.on('mouseover', fade(0.1))
			.on('mouseout', fade(1));
			
		// Labels em cada nó
		const text = node.append('text')
			.style('font-size', "10px")
			.text(d => d.name )
			.attr('fill', d => colorScale[d.group-1])
				.on('mouseover', fade(0.1))
				.on('mouseout', fade(1));

		// define function ticked
		function ticked() {
			
			// Faz com que as labels não se sobreponham
			text.attr("x", function(d) { return circleRadius(d.nodesize) + 3; });
				//.attr("y", function(d) { return d.y; });         

			link.attr('x1', d => d.source.x)
				.attr('x2', d => d.target.x)
				.attr('y1', d => d.source.y)
				.attr('y2', d => d.target.y);

			node.attr('cx', d => d.x = Math.max(radius, Math.min(width - radius, d.x)))
				.attr('cy', d => d.y = Math.max(radius, Math.min(height - radius, d.y)))
				.attr("transform", d => "translate(" + d.x + "," + d.y + ")");
		}

		// define function drag
		function drag(simulation){
			function dragstarted(d) {
				if (!d3.event.active) simulation.alphaTarget(0.3).restart();
				d.fx = d.x;
				d.fy = d.y;
			}

			function dragged(d) {
				d.fx = d3.event.x;
				d.fy = d3.event.y;
			}

			function dragended(d) {
				if (!d3.event.active) simulation.alphaTarget(0);
				d.fx = null;
				d.fy = null;
			}

			return d3.drag()
					.on("start", dragstarted)
					.on("drag", dragged)
					.on("end", dragended);
		}
		// define the forceSimulation function that will receive nodes and links and 
		// will return a d3.forceSimulation() object 
		function forceSimulation(nodes, links) {
			return d3.forceSimulation(nodes)
					.force('link', d3.forceLink(links).id(d => d.name).distance(30))
					.force('charge', d3.forceManyBody())
					.force('center', d3.forceCenter(width/2, height/2))
					.force('collide', d3.forceCollide(30));
		}
		
		// Set the low opacity to other nodes 
		const linkedByIndex = {};
		graph.links.forEach(d => {
			graph.links.forEach(e => {
				d.source.group == e.source.group ? linkedByIndex[`${d.source.index},${e.source.index}`] = 1 : 0;
			})
		});
		
		function isConnected(a, b) {
			return linkedByIndex[`${a.index},${b.index}`] || linkedByIndex[`${b.index},${a.index}`] || a.index === b.index;
		}

		function fade(opacity) {
			return d => {
				node.style('stroke-opacity', function (o) {
					const thisOpacity = isConnected(d, o) ? 1 : opacity;
					this.setAttribute('fill-opacity', thisOpacity);
					return thisOpacity;
				})
				link.style('stroke-opacity', o => (o.source === d || o.target === d ? 1 : opacity));
			};
		}

	});

	existe = true;

}