<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import cloud from 'd3-cloud';
	import { data } from '$lib/date_w_tokens.json';

	const blacklist =
		/^((turkey)|(turki)|(syria)|(earthqua)|(http).*)|(that)|(those)|(than)|(from)|(this)|(will)|(with)|(have)|(been)|(were)|(they)|(them)|(their)|(your)|(for)|(the)|(and)|(you)|(who)|(are)|(her)|(our)|(has)|(amp)|(his)|(not)|(but)|(was)|(000)|(can)|(tur)|(tra)|(what)|(\[.*\])$/i;

	const count_data = (data) => {
		let counts = new Map();
		for (const d_w_t of data) {
			for (const tk of d_w_t['Tokens']) {
				counts.set(tk, (counts.get(tk) || 0) + 1);
			}
		}
		const aggregated = [];
		for (const [tk, cnt] of counts) {
			if (tk.length < 3 || blacklist.test(tk)) {
				continue;
			}
			aggregated.push({ text: tk, size: cnt });
		}
		aggregated.sort((a, b) => b.size - a.size);
		return aggregated;
	};

	// set the dimensions and margins of the graph
	export let width = 350;
	export let height = 250;

	let svg_node: SVGSVGElement;

	onMount(() => {
		// append the svg object to the body of the page
		const svg = d3.select(svg_node).attr('width', width).attr('height', height).append('g');

		const words = count_data(data).slice(0, 50);
		const scale_word = 64 / words[0].size;

		// Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
		// Wordcloud features that are different from one word to the other must be here
		const layout = cloud()
			.size([width, height])
			.words(words)
			.padding(5) //space between words
			.rotate(() => ~~(Math.random() * 2) * 90)
			.fontSize((d) => d.size * scale_word) // font size of words
			.on('end', draw);
		layout.start();

		// This function takes the output of 'layout' above and draw the words
		// Wordcloud features that are THE SAME from one word to the other can be here
		function draw(words) {
			svg
				.append('g')
				.attr('transform', `translate(${layout.size()[0] / 2},${layout.size()[1] / 2})`)
				.selectAll('text')
				.data(words)
				.enter()
				.append('text')
				.style('font-size', (d) => d.size)
				.style('fill', '#69b3a2')
				.attr('text-anchor', 'middle')
				.style('font-family', 'Impact')
				.attr('transform', (d) => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
				.text((d) => d.text);
		}
	});
</script>

<svg bind:this={svg_node} />
