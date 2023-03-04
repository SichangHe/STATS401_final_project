<!-- TODO: make slider. -->
<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import cloud from 'd3-cloud';
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
		/^((turkey)|(turki)|(syria)|(earthqua)|(http).*)|(that)|(those)|(than)|(from)|(this)|(will)|(with)|(have)|(been)|(were)|(they)|(them)|(their)|(your)|(for)|(the)|(and)|(you)|(who)|(are)|(her)|(our)|(has)|(amp)|(his)|(not)|(but)|(was)|(000)|(can)|(tur)|(tra)|(what)|(\[.*\])$/i;
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

	let svg_node: SVGSVGElement;
	let card: QuakeCard;

	const card_follow = (mouse_event: MouseEvent, d: any) =>
		card.config({
			visible: true,
			title: d.text,
			body: `${d.count} mensions`,
			left: mouse_event.pageX,
			top: mouse_event.pageY + 50
		});

	onMount(() => {
		const svg = d3.select(svg_node);

		// Draw the word cloud.
		const draw = (words: any) =>
			svg
				.append('g')
				.attr('transform', `translate(${width / 2},${height / 2})`)
				.selectAll('text')
				.data(words)
				.enter()
				.append('text')
				.style('font-size', (d: any) => d.size)
				.style('fill', fill)
				.attr('text-anchor', 'middle')
				.style('font-family', 'Impact')
				.attr('transform', (d: any) => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
				.text((d: any) => d.text)
				.on('mouseover', (_, d) => console.log(d))
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

		const last_day = new Date(2023, 1, 18);
		layout(count_till(last_day));
	});
</script>

<svg bind:this={svg_node} {height} {width} xmlns="http://www.w3.org/2000/svg" />
<QuakeCard bind:this={card} />
