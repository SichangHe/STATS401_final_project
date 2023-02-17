<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { features } from '$lib/custom.geo.json';

	const width = 1000;
	const height = 600;

	let svg_node: SVGSVGElement;

	const projection = d3
		.geoNaturalEarth1()
		.scale(width / 4)
		.translate([width / 5, (2 * height) / 3]);

	onMount(() => {
		const svg = d3.select(svg_node).attr('width', width).attr('height', height);
		svg
			.append('g')
			.selectAll('path')
			.data(features)
			.join('path')
			.attr('fill', '#69b3a2')
			.attr('d', d3.geoPath().projection(projection))
			.style('stroke', '#fff');
	});
</script>

<svg bind:this={svg_node} />