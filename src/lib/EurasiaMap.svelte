<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { features } from '$lib/custom.geo.json';
	import quakes from '$lib/eurasia_earthquakes.csv';

	quakes.sort((a, b) => a.mag > b.mag);
	quakes.forEach((d) => (d.time = new Date(d.time)));
	const min_mag = quakes[0].mag;
	const max_mag = quakes[quakes.length - 1].mag;
	const mag_diff = max_mag - min_mag;
	const normalize_offset = 1 / 6;
	const normalize_mag = (mag: number) =>
		((min_mag - mag) / mag_diff) * normalize_offset + normalize_offset;

	const width = 1000;
	const height = 600;
	const countries = ['Turkey', 'Syria'];
	const pale_red_gray = 'hsl(0 10% 90%)';
	const pale_green_gray = 'hsl(120deg 10% 90%)';

	let svg_node: SVGSVGElement;
	let tooltip: HTMLElement;

	const tooltip_follow = (e) => {
		tooltip.style.left = `${e.pageX}px`;
		tooltip.style.top = `${e.pageY - 50}px`;
	};

	const projection = d3
		.geoNaturalEarth1()
		.scale(width / 4)
		.translate([width / 5, (2 * height) / 3]);

	onMount(() => {
		const svg = d3
			.select(svg_node)
			.attr('width', width)
			.attr('height', height)
			.on('mouseout', () => (tooltip.style.visibility = 'hidden'));
		svg
			.append('g')
			.selectAll('path')
			.data(features)
			.join('path')
			.attr('fill', (d) =>
				countries.includes(d.properties.name_en) ? pale_red_gray : pale_green_gray
			)
			.attr('d', d3.geoPath().projection(projection))
			.style('stroke', '#fff')
			.on('mouseover', (_, d) => {
				tooltip.style.visibility = 'visible';
				tooltip.innerText = d.properties.name_en;
			})
			.on('mousemove', tooltip_follow);

		svg
			.selectAll('circle')
			.data(quakes)
			.join('circle')
			.attr('cx', (d) => projection([d.longitude, d.latitude])[0])
			.attr('cy', (d) => projection([d.longitude, d.latitude])[1])
			.attr('r', 3)
			.style('fill', (d) => `hsl(${normalize_mag(d.mag)}turn 100% 50%)`)
			.style('stroke', (d) => `hsl(${normalize_mag(d.mag)}turn 100% 50%)`)
			.style('stroke-width', 0.7)
			.attr('fill-opacity', 0.5)
			.style('opacity', 0.8)
			.on('mouseover', (e, d) => {
				e.target.style.opacity = 1;
				console.log(d);
				tooltip.style.visibility = 'visible';
				tooltip.innerText = `${d.mag}, ${d.time.toLocaleString()}`;
			})
			.on('mousemove', tooltip_follow)
			.on('mouseout', (e) => (e.target.style.opacity = 0.8));
	});
</script>

<svg bind:this={svg_node} />
<div bind:this={tooltip} />

<style>
	div {
		position: absolute;
		visibility: hidden;
	}
</style>
