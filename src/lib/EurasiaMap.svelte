<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { sliderBottom } from 'd3-simple-slider';
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
	const filter_quakes = (begin: Date) => quakes.filter((q: Quake) => q.time > begin);

	const width = 793;
	const height = 290;
	const countries = ['Turkey', 'Syria'];
	const pale_red_gray = 'hsl(0 30% 10%)';
	const pale_green_gray = 'hsl(120deg 10% 10%)';

	let svg_node: SVGSVGElement;
	let slider_opacity = 0;
	let begin_year = 0;
	let card: QuakeCard;
	let g_node: SVGGElement;
	let slider_node: SVGGElement;

	const card_follow = (mouse_event: MouseEvent) =>
		card.config({
			visible: true,
			left: mouse_event.pageX,
			top: mouse_event.pageY + 50
		});
	const card_follow_quake = (mouse_event: any, quake: Quake) => {
		const circle: HTMLElement = mouse_event.target;
		circle.style.opacity = '1';
		console.log(quake);
		card_follow(mouse_event);
		card.config({
			visible: true,
			title: quake.mag.toString(),
			body: quake.time.toLocaleString(),
			fill: circle.style.fill
		});
	};
	const card_follow_slider = (mouse_event: MouseEvent) => {
		slider_opacity = 1;
		card_follow(mouse_event);
		card.config({
			title: `Since ${2000 + begin_year}`,
			fill: 'white',
			body: 'Slide to choose time interval.'
		});
	};
	const card_follow_country = (mouse_event: MouseEvent, d: any) => {
		card_follow(mouse_event);
		card.config({
			visible: true,
			title: d.properties.name_en,
			fill: 'white',
			body: ''
		});
	};
	const hide_card = () => card.config({ visible: false });

	const projection = d3
		.geoNaturalEarth1()
		.scale((width * 3) / 4)
		.translate([width / 5, height * 1.9]);

	const color_scale = d3
		.scaleLinear()
		.domain([min_mag, max_mag])
		.range([0, width / 2]);
	const color_axis = d3.axisBottom(color_scale);

	const draw_quakes = (el: d3.Selection<SVGGElement, unknown, null, undefined>, quakes: Quake[]) =>
		el
			.selectAll('circle')
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
			.on('mouseover', card_follow_quake)
			.on('mousemove', card_follow)
			.on('mouseout', (e) => (e.target.style.opacity = 0.8));

	onMount(() => {
		const svg = d3.select(svg_node);
		const slider = d3
			.select(slider_node)
			.on('mouseover', card_follow_slider)
			.on('mousemove', card_follow)
			.on('mouseout', () => (slider_opacity = 0));
		const g = d3.select(g_node);
		// Color scale bar.
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
		// Draw countries.
		g.selectAll('path')
			.data(features)
			.join('path')
			.attr('fill', (d) =>
				countries.includes(d.properties.name_en) ? pale_red_gray : pale_green_gray
			)
			// @ts-ignore
			.attr('d', d3.geoPath().projection(projection))
			.style('stroke', 'hsl(300deg, 10%, 30%)')
			.on('mouseover', card_follow_country)
			.on('mousemove', card_follow);
		// Handle zoom.
		const zoom = d3
			.zoom()
			.scaleExtent([0.5, 5])
			.translateExtent([
				[0, 0],
				[width, height]
			])
			.on('zoom', (e) => g.attr('transform', e.transform));
		// Slider
		//@ts-ignore
		const make_slider = sliderBottom()
			//@ts-ignore
			.min(0)
			.max(23)
			.step(1)
			.width(width / 4)
			.displayValue(false)
			.tickPadding(-8)
			.on('onchange', (d: number) => {
				begin_year = d;
				card.config({
					title: `Since ${2000 + begin_year}`
				});
				g.call(draw_quakes, filter_quakes(new Date(2000 + d, 0, 0)));
			});

		// @ts-ignore
		svg.on('mouseout', hide_card).call(zoom);
		slider.call(make_slider);
		// Initial quakes drawing.
		g.call(draw_quakes, quakes);
	});
</script>

<svg bind:this={svg_node} {height} {width} xmlns="http://www.w3.org/2000/svg">
	<defs>
		<linearGradient id="eurasia-map-yellow-red-linear-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
			<stop offset="0%" style="stop-color: hsl({normalize_mag(min_mag)}turn 100% 50%)" />
			<stop offset="100%" style="stop-color: hsl({normalize_mag(max_mag)}turn 100% 50%)" />
		</linearGradient></defs
	>
	<g bind:this={g_node} />
	<g
		bind:this={slider_node}
		style="transform: translate({(width * 2) / 3}px, {height - 30}px); opacity: {slider_opacity}"
	/>
</svg>

<QuakeCard bind:this={card} />

<style>
	svg {
		/* Dim blue. */
		background-color: hsl(200deg 10% 20%);
	}

	:global(g.slider > g > path) {
		outline: none;
	}
</style>
