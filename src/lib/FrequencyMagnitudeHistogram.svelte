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
			.attr('transform', 'translate(' + margin.left + ',' + heightWithMargin + ')')
			.call(d3.axisBottom(x));

		svg
			.append('g')
			.attr('transform', 'translate(' + margin.left + ',' + '0)')
			.call(d3.axisLeft(y).ticks(8));
		svg
			.selectAll('rect')
			.data(bins)
			.enter()
			.append('rect')
			.attr('x', margin.left)
			.attr('y', 0)
			.attr('transform', function (d) {
				return 'translate(' + x(d.x0) + ',' + y(d.length) + ')';
			})
			.attr('width', function (d) {
				return Math.max(x(d.x1) - x(d.x0) - 1, 0);
			})
			.attr('height', function (d) {
				return heightWithMargin - y(d.length);
			})
			.style('fill', fill);
		svg
			.append('text')
			.attr('x', margin.left + 10)
			.attr('y', margin.top + 5)
			.text('frequency');
		svg
			.append('text')
			.attr('x', widthWithMargin + margin.left - 70)
			.attr('y', heightWithMargin - 10)
			.text('magnitude');
	});
</script>

<svg bind:this={svg_node} {width} {height} />
