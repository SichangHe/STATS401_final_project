<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { features } from '$lib/custom.geo.json';
	// @ts-ignore
	import quakes from '$lib/eurasia_earthquakes.csv';

	type Quake = {
		latitude: String;
		longitude: String;
		time: Date | String;
		mag: number;
	};
	quakes.sort((a: Quake, b: Quake) => a.mag - b.mag);
	quakes.forEach((d: any) => (d.time = new Date(d.time)));
	console.log(quakes);
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

	const tooltip_follow = (e: MouseEvent) => {
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
		const g = svg.append('g');
		g.selectAll('path')
			.data(features)
			.join('path')
			.attr('fill', (d) =>
				countries.includes(d.properties.name_en) ? pale_red_gray : pale_green_gray
			)
			// @ts-ignore
			.attr('d', d3.geoPath().projection(projection))
			.style('stroke', '#fff')
			.on('mouseover', (_, d) => {
				tooltip.style.visibility = 'visible';
				tooltip.innerText = d.properties.name_en;
			})
			.on('mousemove', tooltip_follow);

		const zoom = d3.zoom().on('zoom', (e) => g.attr('transform', e.transform));
		// @ts-ignore
		svg.call(zoom);

		g.selectAll('circle')
			.data(quakes)
			.join('circle')
			.attr('cx', (d: any) => projection([d.longitude, d.latitude])![0])
			.attr('cy', (d: any) => projection([d.longitude, d.latitude])![1])
			.attr('r', 3)
			.style('fill', (d: any) => `hsl(${normalize_mag(d.mag)}turn 100% 50%)`)
			.style('stroke', (d: any) => `hsl(${normalize_mag(d.mag)}turn 100% 50%)`)
			.style('stroke-width', 0.7)
			.attr('fill-opacity', 0.5)
			.style('opacity', 0.8)
			.on('mouseover', (e, d: any) => {
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
