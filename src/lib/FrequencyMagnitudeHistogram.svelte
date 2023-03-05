<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { features } from '$lib/custom.geo.json';
	import quakes from '$lib/earthquake.csv';
	const margin = { top: 10, right: 20, bottom: 30, left: 40 };
	export let width = 350;
	export let height = 250;
	export let fill = '#69b3a2';
	const widthWithMargin = width - margin.left - margin.right;
	const heightWithMargin = height - margin.top - margin.bottom;

	let svg_node;

	const x = d3.scaleLinear().domain([5, 10]).range([0, widthWithMargin]);
	const histogram = d3
		.histogram()
		.value(function (d) {
			return d.mag;
		})
		.domain(x.domain())
		.thresholds(x.ticks(70));

	const bins = histogram(quakes);

	const y = d3.scaleLinear().range([heightWithMargin, 0]);

	y.domain([
		0,
		d3.max(bins, function (d) {
			return d.length;
		})
	]);

	onMount(() => {
		let svg = d3.select(svg_node);
		svg
			.append('g')
			.attr(
				'transform',
				'translate(' + margin.left + ',' + (heightWithMargin + margin.top + 12) + ')'
			)
			.call(d3.axisBottom(x));

		svg
			.append('g')
			.attr('transform', 'translate(' + margin.left + ',' + (margin.top + 12) + ')')
			.call(d3.axisLeft(y).ticks(8));
		svg
			.selectAll('rect')
			.data(bins)
			.enter()
			.append('rect')
			.attr('x', margin.left)
			.attr('y', margin.top + 12)
			.attr('transform', function (d) {
				return 'translate(' + x(d.x0) + ',' + y(d.length) + ')';
			})
			.attr('width', function (d) {
				return Math.max(x(d.x1) - x(d.x0) - 1, 0);
			})

			.attr('height', function (d) {
				return heightWithMargin - y(d.length);
			})
			.on('mouseover', function (d) {
				svg
					.append('circle')
					.attr('cx', widthWithMargin + margin.left)
					.attr('cy', margin.top + 12)

					.attr('r', 15)
					.style('fill', 'red');
					let pos = d3.pointer(e, this);
				svg.select('rect').attr('fill','red');
				svg
					.append('text')
					.attr('x', 0 )
					.attr('y', margin.top + 12)
					.text(''+pos[0]);
			})
			.on('mouseout', function () {
				svg.selectAll('circle').style('opacity', 0);
				
			})
			.style('fill', fill);
		console.log(bins);
		svg
			.append('text')
			.attr('x', margin.left - 30)
			.attr('y', margin.top + 5)
			.text('frequency');
		svg
			.append('text')
			.attr('x', widthWithMargin + margin.left - 50)
			.attr('y', heightWithMargin + margin.top + 5)
			.text('magnitude');
	});
</script>

<svg bind:this={svg_node} {width} {height} xmlns="http://www.w3.org/2000/svg" />
