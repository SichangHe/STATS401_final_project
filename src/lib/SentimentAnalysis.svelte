<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	//@ts-ignore
	import data from '$lib/sentiment.csv';

	let svg_node: SVGSVGElement;
	let width = 900;
	let height = 400;
	const barWidth = 30;

	const margin = { top: 20, right: 10, bottom: 20, left: 10 };

	width = width - margin.left - margin.right;
	height = height - margin.top - margin.bottom;

	const totalWidth = width + margin.left + margin.right;
	const totalheight = height + margin.top + margin.bottom;

	onMount(() => {
		// import data
		const groupCounts = {};
		const globalCounts = [];
		for (let i = 0; i < 2; i++) {
			const cons = 5 + i;
			const key = '2023/2/' + cons.toString();
			groupCounts[key] = [];

			for (let j = 0; j < data.length; j++) {
				if (Number(data[j].date) == i) {
					const entry = Number(data[j].p_comp);
					groupCounts[key].push(entry);
					globalCounts.push(entry);
				}
			}
		}

		// Sort group counts so quantile methods work
		for (const key in groupCounts) {
			const groupCount = groupCounts[key];
			groupCounts[key] = groupCount.sort();
		}

		// Setup a color scale for filling each box
		const colorScale = d3.scaleOrdinal(d3.schemeBlues[9]).domain(Object.keys(groupCounts));

		function boxQuartiles(d) {
			return [d3.quantile(d, 0.25), d3.quantile(d, 0.5), d3.quantile(d, 0.75)];
		}

		// Compute an ordinal xScale for the keys in boxPlotData
		const xScale = d3
			.scalePoint()
			.domain(Object.keys(groupCounts))
			.rangeRound([0, width])
			.padding(0.5);

		// Compute a global y scale based on the global counts
		const yScale = d3.scaleLinear().domain([-1, 1]).range([0, height]);

		// Setup the svg and group we will draw the box plot in
		const svg = d3
			.select(svg_node)
			.attr('width', totalWidth)
			.attr('height', totalheight)
			.append('g')
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

		// Move the left axis over 25 pixels, and the top axis over 35 pixels
		const axisG = svg.append('g').attr('transform', 'translate(25,0)');
		const axisTopG = svg.append('g').attr('transform', 'translate(35,0)');

		// Setup the group the box plot elements will render in
		const g = svg.append('g').attr('transform', 'translate(20,5)');

		// Prepare the data for the box plots
		const boxPlotData = [];
		for (const [key, groupCount] of Object.entries(groupCounts)) {
			const record = {};
			const localMin = d3.min(groupCount);
			const localMax = d3.max(groupCount);

			record['key'] = key;
			record['counts'] = groupCount;
			record['quartile'] = boxQuartiles(groupCount);
			record['whiskers'] = [localMin, localMax];
			record['color'] = colorScale(key);

			boxPlotData.push(record);
		}

		// Draw the box plot vertical lines
		const verticalLines = g
			.selectAll('.verticalLines')
			.data(boxPlotData)
			.enter()
			.append('line')
			.attr('x1', function (datum) {
				return xScale(datum.key) + barWidth / 2;
			})
			.attr('y1', function (datum) {
				const whisker = datum.whiskers[0];
				return yScale(whisker);
			})
			.attr('x2', function (datum) {
				return xScale(datum.key) + barWidth / 2;
			})
			.attr('y2', function (datum) {
				const whisker = datum.whiskers[1];
				return yScale(whisker);
			})
			.attr('stroke', '#000')
			.attr('stroke-width', 1)
			.attr('fill', 'none');

		// Draw the boxes of the box plot, filled in white and on top of vertical lines
		const rects = g
			.selectAll('rect')
			.data(boxPlotData)
			.enter()
			.append('rect')
			.attr('width', barWidth)
			.attr('height', function (datum) {
				const quartiles = datum.quartile;
				const height = yScale(quartiles[2]) - yScale(quartiles[0]);
				return height;
			})
			.attr('x', function (datum) {
				return xScale(datum.key);
			})
			.attr('y', function (datum) {
				return yScale(datum.quartile[0]);
			})
			.attr('fill', function (datum) {
				return datum.color;
			})
			.attr('stroke', '#000')
			.attr('stroke-width', 1);

		// Now render all the horizontal lines at once - the whiskers and the median
		const horizontalLineConfigs = [
			// Top whisker
			{
				x1: function (datum) {
					return xScale(datum.key);
				},
				y1: function (datum) {
					return yScale(datum.whiskers[0]);
				},
				x2: function (datum) {
					return xScale(datum.key) + barWidth;
				},
				y2: function (datum) {
					return yScale(datum.whiskers[0]);
				}
			},
			// Median line
			{
				x1: function (datum) {
					return xScale(datum.key);
				},
				y1: function (datum) {
					return yScale(datum.quartile[1]);
				},
				x2: function (datum) {
					return xScale(datum.key) + barWidth;
				},
				y2: function (datum) {
					return yScale(datum.quartile[1]);
				}
			},
			// Bottom whisker
			{
				x1: function (datum) {
					return xScale(datum.key);
				},
				y1: function (datum) {
					return yScale(datum.whiskers[1]);
				},
				x2: function (datum) {
					return xScale(datum.key) + barWidth;
				},
				y2: function (datum) {
					return yScale(datum.whiskers[1]);
				}
			}
		];

		for (let i = 0; i < horizontalLineConfigs.length; i++) {
			const lineConfig = horizontalLineConfigs[i];

			// Draw the whiskers at the min for this series
			const horizontalLine = g
				.selectAll('.whiskers')
				.data(boxPlotData)
				.enter()
				.append('line')
				.attr('x1', lineConfig.x1)
				.attr('y1', lineConfig.y1)
				.attr('x2', lineConfig.x2)
				.attr('y2', lineConfig.y2)
				.attr('stroke', '#000')
				.attr('stroke-width', 1)
				.attr('fill', 'none');
		}

		// Setup a scale on the left
		const axisLeft = d3.axisLeft(yScale);
		axisG.append('g').call(axisLeft);

		// Setup a series axis on the top
		const axisTop = d3.axisTop(xScale);
		axisTopG.append('g').call(axisTop);
	});
</script>

<svg bind:this={svg_node} />

<style>
</style>
