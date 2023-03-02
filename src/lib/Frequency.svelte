<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	let svg_node: SVGSVGElement;
	//@ts-ignore
	import data from '$lib/frequency.csv';

	var parseDate = d3.timeParse('%Y/%m/%d');

	export let height = 250;
	export let width = 350;
	var maxDate = d3.max(data, function (d) {
		return parseDate(d.Date);
	});
	var minDate = d3.min(data, function (d) {
		return parseDate(d.Date);
	});
	var maxNum = d3.max(data, function (d) {
		return Number(d.num);
	});

	onMount(() => {
		var parseDate = d3.timeParse('%Y/%m/%d');

		var y = d3
			.scaleLinear()
			.domain([0, maxNum])
			.range([height - 70, 0]);

		var x = d3
			.scaleTime()
			.domain([minDate, maxDate])
			.range([0, width - 70]);

		var yAxis = d3.axisLeft(y);
		var xAxis = d3.axisBottom(x).ticks(5);

		var svg = d3.select(svg_node).attr('height', height).attr('width', width);

		var chartGroup = svg.append('g').attr('transform', 'translate(40, 30)');

		var line = d3
			.line()
			.x(function (d) {
				return x(parseDate(d.Date));
			})
			.y(function (d) {
				return y(Number(d.num));
			});

		chartGroup.append('path').attr('d', line(data)).attr('fill', 'none').attr('stroke', 'blue');

		chartGroup
			.append('g')
			.attr('class', 'x axis')
			.attr('transform', 'translate(0, ' + (height - 70) + ')')
			.call(xAxis);

		chartGroup.append('g').attr('class', 'y axis').call(yAxis);

		svg
			.append('text')
			.attr('class', 'x label')
			.attr('text-anchor', 'end')
			.attr('x', width)
			.attr('y', height - 45)
			.text('Date');

		svg
			.append('text')
			.attr('class', 'y label')
			.attr('x', 0)
			.attr('y', 20)
			.text('number of mention');
	});
</script>

<svg bind:this={svg_node} />

<style>
</style>
