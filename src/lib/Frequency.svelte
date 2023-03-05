<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	let svg_node: SVGSVGElement;
	//@ts-ignore
	import data from '$lib/frequency.csv';

	const parseDate = d3.timeParse('%Y/%m/%d');

	export let height = 250;
	export let width = 350;
	export let stroke = 'blue';
	const maxDate = d3.max(data, function (d) {
		return parseDate(d.Date);
	});
	const minDate = d3.min(data, function (d) {
		return parseDate(d.Date);
	});
	const maxNum = d3.max(data, function (d) {
		return Number(d.num);
	});

	const y = d3
		.scaleLinear()
		.domain([0, maxNum])
		.range([height - 70, 0]);

	const x = d3
		.scaleTime()
		.domain([minDate, maxDate])
		.range([0, width - 70]);

	const yAxis = d3.axisLeft(y).ticks(8);
	const xAxis = d3.axisBottom(x).ticks(5);

	const line = d3
		.line()
		.x(function (d) {
			return x(parseDate(d.Date));
		})
		.y(function (d) {
			return y(Number(d.num));
		});

	onMount(() => {
		const svg = d3.select(svg_node).attr('height', height).attr('width', width);

		const chartGroup = svg.append('g').attr('transform', 'translate(40, 30)');

		chartGroup
			.append('path')
			.attr('d', line(data))
			.attr('fill', 'none')
			.attr('stroke', stroke)
			.on('mouseover', function () {
				svg
					.append('text')
					.attr('id', '1')
					.attr('x', x(parseDate(data[0].Date)) + 50)
					.attr('y', y(Number(data[0].num)) + 20)
					.text('Turkey–Syria earthquake occured')
					.style('font-size', '10px')
					.style('fill', 'purple');
				svg
					.append('text')
					.attr('id', '2')
					.attr('x', x(parseDate(data[3].Date)) + 50)
					.attr('y', y(Number(data[3].num)) + 20)
					.text('Twitter was shut down it Turkey')
					.style('font-size', '10px')
					.style('fill', 'purple');
				svg
					.append('circle')
					.attr('cx', x(parseDate(data[0].Date)) + 40)
					.attr('cy', y(Number(data[0].num)) + 30)
					.attr('r', 5)
					.style('fill', 'yellow');
				svg
					.append('circle')
					.attr('cx', x(parseDate(data[3].Date)) + 40)
					.attr('cy', y(Number(data[3].num)) + 30)
					.attr('r', 5)
					.style('fill', 'yellow');
			})
			.on('mouseout', function () {
				svg.selectAll('circle').remove();
				svg.selectAll("text[id='1']").remove();
				svg.selectAll("text[id='2']").remove();
			});

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

<svg bind:this={svg_node} xmlns="http://www.w3.org/2000/svg" />

<style>
</style>
