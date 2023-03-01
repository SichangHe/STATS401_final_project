<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { features } from '$lib/custom.geo.json';
	import QuakeCard from '$lib/QuakeCard.svelte';
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
	const min_mag = quakes[0].mag;
	const max_mag = quakes[quakes.length - 1].mag;
	const mag_diff = max_mag - min_mag;
	const normalize_offset = 1 / 6;
	const mag_position = (mag: number) => (mag - min_mag) / mag_diff;
	const normalize_mag = (mag: number) => -mag_position(mag) * normalize_offset + normalize_offset;

	const width = 794;
	const height = 280;
	const countries = ['Turkey', 'Syria'];
	const pale_red_gray = 'hsl(0 30% 10%)';
	const pale_green_gray = 'hsl(120deg 10% 10%)';

	let svg_node: SVGSVGElement;
	let tooltip = {
		left: 0,
		top: 0,
		visible: false,
		content: ''
	};
	let card: QuakeCard;

	const tooltip_follow = (mouse_event: MouseEvent) => {
		tooltip.left = mouse_event.pageX;
		tooltip.top = mouse_event.pageY + 50;
	};
	const card_follow = (mouse_event: any, quake: Quake) => {
		const circle: HTMLElement = mouse_event.target;
		circle.style.opacity = '1';
		console.log(quake);
		card.config({
			visible: true,
			title: quake.mag.toString(),
			body: quake.time.toLocaleString(),
			left: mouse_event.pageX,
			top: mouse_event.pageY + 50,
			fill: circle.style.fill
		});
	};
	const hide_card_tooltip = () => {
		card.config({ visible: false });
		tooltip.visible = false;
	};

	const projection = d3
		.geoNaturalEarth1()
		.scale((width * 3) / 4)
		.translate([width / 5, height * 1.9]);

	const color_scale = d3
		.scaleLinear()
		.domain([min_mag, max_mag])
		.range([0, width / 2]);
	const color_axis = d3.axisBottom(color_scale);

	onMount(() => {
		const svg = d3.select(svg_node).on('mouseout', hide_card_tooltip);
		const g = svg.append('g');
		svg
			.append('g')
			.attr('style', `transform: translate(20px, ${height - 30}px)`)
			.attr('class', 'axis')
			.call(color_axis)
			.append('rect')
			.attr('height', 6)
			.attr('width', width / 2)
			.style('opacity', 0.8)
			.attr('fill', 'url(#eurasia-map-yellow-red-linear-gradient)');

		g.selectAll('path')
			.data(features)
			.join('path')
			.attr('fill', (d) =>
				countries.includes(d.properties.name_en) ? pale_red_gray : pale_green_gray
			)
			// @ts-ignore
			.attr('d', d3.geoPath().projection(projection))
			.style('stroke', 'hsl(300deg, 10%, 30%)')
			.on('mouseover', (_, d) => {
				tooltip.visible = true;
				tooltip.content = d.properties.name_en;
			})
			.on('mousemove', tooltip_follow);

		const zoom = d3
			.zoom()
			.scaleExtent([0.5, 5])
			.translateExtent([
				[0, 0],
				[width, height]
			])
			.on('zoom', (e) => g.attr('transform', e.transform));
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
			// @ts-ignore
			.on('mouseover', card_follow)
			.on('mousemove', tooltip_follow)
			.on('mouseout', (e) => (e.target.style.opacity = 0.8));
	});
</script>

<svg bind:this={svg_node} {height} {width}>
	<defs>
		<linearGradient id="eurasia-map-yellow-red-linear-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
			<stop offset="0%" style="stop-color: hsl({normalize_mag(min_mag)}turn 100% 50%)" />
			<stop offset="100%" style="stop-color: hsl({normalize_mag(max_mag)}turn 100% 50%)" />
		</linearGradient></defs
	>
</svg>
<div
	style="left: {tooltip.left}px; top: {tooltip.top}px; visibility: {tooltip.visible
		? 'visible'
		: 'hidden'}"
>
	<b> {tooltip.content} </b>
</div>
<QuakeCard bind:this={card} />

<style>
	div {
		color: white;
		position: absolute;
		visibility: hidden;
		-webkit-text-stroke: 0.2px black;
	}
	svg {
		/* Dim blue. */
		background-color: hsl(200deg 10% 20%);
	}
</style>
