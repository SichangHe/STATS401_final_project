<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { features } from '$lib/custom.geo.json';
	import quakes from '$lib/earthquake.csv';
	var margin = { top: 10, right: 20, bottom: 30, left: 40 },
		width = 460 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

	let svg_node;
	onMount(() => {
		let svg = d3.select(svg_node);
        const x = d3.scaleLinear().domain([5, 10]).range([0, width]);
		const histogram = d3.histogram()
			.value(function (d) {
				return d.mag;
			})
			.domain(x.domain())
			.thresholds(x.ticks(70));

		const bins = histogram(quakes);

		const y = d3.scaleLinear().range([height, 0]);
		
		y.domain([0,d3.max(bins, function (d) {return d.length;})])
		svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

		
			svg
				.append('g')
				.attr('transform', 'translate(50,' + height + ')')
				.call(d3.axisBottom(x));
			svg.append('text').attr('x', 10).attr('y',15).text('frequency');
			svg.append('text').attr('x', 420).attr('y', 460).text('mag');
			svg.append('g').attr('transform', 'translate(50,0)').call(d3.axisLeft(y));

			svg
				.selectAll('rect')
				.data(bins)
				.enter()
				.append('rect')
				.attr('x', 50)
				.attr('transform', function (d) {
					return 'translate(' + x(d.x0) + ',' + y(d.length) + ')';
				})
				.attr('width', function (d) {
					return x(d.x1) - x(d.x0) - 1;
				})
				.attr('height', function (d) {
					return height - y(d.length);
				})
				.style('fill', '#69b3a2');
		
		 
	});
</script>

<svg
	bind:this={svg_node}
	width={width + margin.left + margin.right}
	height={height + margin.top + margin.bottom}
/>
