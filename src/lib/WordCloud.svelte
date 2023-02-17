<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import cloud from 'd3-cloud';

	// List of words
	const words = [
		{ text: 'Running', size: 10 },
		{ text: 'Surfing', size: 20 },
		{ text: 'Climbing', size: 50 },
		{ text: 'Kiting', size: 30 },
		{ text: 'Sailing', size: 20 },
		{ text: 'Snowboarding', size: 60 }
	];

	// set the dimensions and margins of the graph
	const margin = { top: 10, right: 10, bottom: 10, left: 10 },
		width = 450 - margin.left - margin.right,
		height = 450 - margin.top - margin.bottom;

	let svg_node: SVGSVGElement;

	onMount(() => {
		// append the svg object to the body of the page
		const svg = d3
			.select(svg_node)
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		// Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
		// Wordcloud features that are different from one word to the other must be here
		const layout = cloud()
			.size([width, height])
			.words(words)
			.padding(5) //space between words
			.rotate(() => ~~(Math.random() * 2) * 90)
			.fontSize((d) => d.size) // font size of words
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
