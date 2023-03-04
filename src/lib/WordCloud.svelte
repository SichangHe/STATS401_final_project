<!-- TODO: make slider. -->
<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import cloud from 'd3-cloud';
	import { sliderBottom } from 'd3-simple-slider';
	import { data as raw } from '$lib/date_w_tokens.json';
	import QuakeCard from '$lib/QuakeCard.svelte';

	type Tweet = {
		Date: Date;
		Tokens: string[];
	};

	raw.forEach((d: any) => (d.Date = new Date(d.Date)));
	// @ts-ignore
	let data: Tweet[] = raw;

	const blacklist =
		/^((turkey)|(turki)|(syria)|(earthqua)|(http).*)|(that)|(those)|(than)|(from)|(this)|(will)|(with)|(have)|(been)|(were)|(they)|(them)|(their)|(your)|(for)|(the)|(and)|(you)|(who)|(are)|(she)|(her)|(our)|(has)|(amp)|(his)|(not)|(but)|(was)|(000)|(can)|(tur)|(tra)|(what)|(\[.*\])$/i;
	// Count mentions given end date.
	const count_till = (end: Date) => {
		let counts = new Map();
		for (const d_w_t of data) {
			if (d_w_t.Date > end) {
				continue;
			}
			for (const tk of d_w_t.Tokens) {
				counts.set(tk, (counts.get(tk) || 0) + 1);
			}
		}
		const aggregated = [];
		for (const [tk, cnt] of counts) {
			if (tk.length < 3 || blacklist.test(tk)) {
				continue;
			}
			aggregated.push({ text: tk, count: cnt });
		}
		aggregated.sort((a, b) => b.count - a.count);
		return aggregated.slice(0, 50);
	};

	export let width = 350;
	export let height = 250;
	export let fill = '#69b3a2';

	let g_node: SVGGElement;
	let slider_node: SVGGElement;
	let card: QuakeCard;
	let end_day = 18;
	let slider_opacity = 0;

	const card_follow = (mouse_event: MouseEvent) =>
		card.config({
			visible: true,
			left: mouse_event.pageX,
			top: mouse_event.pageY + 50
		});
	const card_follow_word = (mouse_event: MouseEvent, d: any) => {
		console.log(d);
		card_follow(mouse_event);
		card.config({
			title: d.text,
			body: `${d.count} mensions`
		});
	};
	const card_follow_slider = (mouse_event: MouseEvent) => {
		slider_opacity = 1;
		card_follow(mouse_event);
		card.config({
			title: `Until Feb ${end_day}`,
			fill: 'white',
			body: 'Slide to choose time interval.'
		});
	};
	onMount(() => {
		const g = d3.select(g_node);
		const slider = d3
			.select(slider_node)
			.on('mouseover', card_follow_slider)
			.on('mousemove', card_follow)
			.on('mouseout', () => (slider_opacity = 0));

		// Draw the word cloud.
		const draw = (words: any) =>
			g
				.selectAll('text')
				.data(words)
				.join('text')
				.style('font-size', (d: any) => d.size)
				.style('fill', fill)
				.attr('text-anchor', 'middle')
				.style('font-family', 'Impact')
				.attr('transform', (d: any) => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
				.text((d: any) => d.text)
				.on('mouseover', card_follow_word)
				.on('mousemove', card_follow)
				.on('mouseout', () => card.config({ visible: false }));
		// Constructs a new cloud layout instance.
		const layout = (words: any) =>
			cloud()
				.size([width, height])
				.words(words)
				.padding(5)
				.rotate(() => ~~(Math.random() * 2) * 90)
				.fontSize((d: any) => (d.count * 64) / words[0].count)
				.on('end', draw)
				.start();
		// Slider
		//@ts-ignore
		const make_slider = sliderBottom()
			//@ts-ignore
			.min(8)
			.max(end_day)
			.step(1)
			.width(width / 2)
			.displayValue(false)
			.tickPadding(-8)
			.value(end_day)
			.on('onchange', (d: number) => {
				end_day = d;
				card.config({
					title: `Until Feb ${end_day}`
				});
				layout(count_till(new Date(2023, 1, end_day)));
			});

		const last_day = new Date(2023, 1, end_day);
		slider.call(make_slider);
		layout(count_till(last_day));
	});
</script>

<svg {height} {width} xmlns="http://www.w3.org/2000/svg">
	<g bind:this={g_node} style="transform: translate({width / 2}px, {height / 2}px);" />
	<g
		bind:this={slider_node}
		style="transform: translate({width / 4}px, {height - 30}px); opacity: {slider_opacity}"
	/>
</svg>
<QuakeCard bind:this={card} />
