<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	//@ts-ignore
	import data from '$lib/sentiment.csv';

	let svg_node: SVGSVGElement;
	export let width = 350;
	export let height = 250;
	export let scheme = {
		a: 'rgb(238, 130, 238)',
		b: 'rgb(75, 0, 130)'
	};

	const barWidth = 10;

	const margin = { top: 20, right: 80, bottom: 20, left: 10 };

	const widthWithMargin = width - margin.left - margin.right;
	const heightWithMargin = height - margin.top - margin.bottom;

	onMount(() => {
		// import data
		const groupCounts = {};
		for (let i = 0; i < 11; i++) {
			const cons = 6 + i;
			const key = '2/' + cons.toString();
			groupCounts[key] = [];

			for (let j = 0; j < data.length; j++) {
				if (Number(data[j].date) == i) {
					const entry = Number(data[j].p_comp);
					groupCounts[key].push(entry);
				}
			}
		}

		// Setup a color scale for filling each box
		const maxvalue = 0.3;
		const minvalue = -0.2;

		const linear = d3.scaleLinear().domain([minvalue, maxvalue]).range([0, 1]);

		const computeColor = d3.interpolate(scheme.a, scheme.b);

		function boxQuartiles(d) {
			return [d3.quantile(d, 0.25), d3.quantile(d, 0.5), d3.quantile(d, 0.75)];
		}

		// Compute an ordinal xScale for the keys in boxPlotData
		const xScale = d3
			.scalePoint()
			.domain(Object.keys(groupCounts))
			.rangeRound([-10, widthWithMargin])
			.padding(0.5);

		// Compute a global y scale based on the global counts
		const yScale = d3.scaleLinear().domain([-1, 1]).range([heightWithMargin, 0]);

		// Setup the svg and group we will draw the box plot in
		const svg = d3
			.select(svg_node)
			.append('g')
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

		// Move the left axis over 25 pixels, and the top axis over 35 pixels
		const axisG = svg.append('g').attr('transform', 'translate(25,0)');
		const axisTopG = svg.append('g').attr('transform', 'translate(35,0)');

		// Setup the group the box plot elements will render in
		const g = svg.append('g').attr('transform', 'translate(20,0)');

		// Prepare the data for the box plots
		const boxPlotData = [];
		var i = 0;
		for (const [key, groupCount] of Object.entries(groupCounts)) {
			const record = {};
			const localMin = d3.min(groupCount);
			const localMax = d3.max(groupCount);

			record['id'] = i;
			i = i + 1;
			record['key'] = key;
			record['min'] = localMax;
			record['max'] = localMin;
			record['counts'] = groupCount;
			record['quartile'] = boxQuartiles(groupCount);
			record['whiskers'] = [localMin, localMax];
			const t = linear(boxQuartiles(groupCount)[1]);
			const color = computeColor(t);
			record['color'] = color.toString();
			boxPlotData.push(record);
		}

		// Draw the box plot vertical lines
		const verticalLines = g
			.selectAll('.verticalLines')
			.data(boxPlotData)
			.enter()
			.append('line')
			.attr('x1', function (datum) {
				return xScale(datum.key) + barWidth / 2 + 10;
			})
			.attr('y1', function (datum) {
				const whisker = datum.whiskers[0];
				return yScale(-whisker);
			})
			.attr('x2', function (datum) {
				return xScale(datum.key) + barWidth / 2 + 10;
			})
			.attr('y2', function (datum) {
				const whisker = datum.whiskers[1];
				return yScale(-whisker);
			})
			.attr('stroke', '#000')
			.attr('stroke-width', 1)
			.attr('fill', 'none');

		// Draw the boxes of the box plot, filled in white and on top of vertical lines
		const rects = g
			.selectAll('rect.group0')
			.data(boxPlotData)
			.enter()
			.append('rect')
			.attr('class', 'group0')
			.attr('width', barWidth)
			.attr('height', function (datum) {
				const quartiles = datum.quartile;
				const height = -(yScale(quartiles[2]) - yScale(quartiles[0]));
				return height;
			})
			.attr('x', function (datum) {
				return xScale(datum.key) + 10;
			})
			.attr('y', function (datum) {
				return yScale(-datum.quartile[0]);
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
					return xScale(datum.key) + 10;
				},
				y1: function (datum) {
					return yScale(-datum.whiskers[0]);
				},
				x2: function (datum) {
					return xScale(datum.key) + barWidth + 10;
				},
				y2: function (datum) {
					return yScale(-datum.whiskers[0]);
				}
			},
			// Median line
			{
				x1: function (datum) {
					return xScale(datum.key) + 10;
				},
				y1: function (datum) {
					return yScale(-datum.quartile[1]);
				},
				x2: function (datum) {
					return xScale(datum.key) + barWidth + 10;
				},
				y2: function (datum) {
					return yScale(-datum.quartile[1]);
				}
			},
			// Bottom whisker
			{
				x1: function (datum) {
					return xScale(datum.key) + 10;
				},
				y1: function (datum) {
					return yScale(-datum.whiskers[1]);
				},
				x2: function (datum) {
					return xScale(datum.key) + barWidth + 10;
				},
				y2: function (datum) {
					return yScale(-datum.whiskers[1]);
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

		// interaction
		// interaction area
		var on = 0;
		const area = g
			.selectAll('rect.group1')
			.data(boxPlotData)
			.enter()
			.append('rect')
			.attr('class', 'group1')
			.attr('key', function (d) {
				return d.key;
			})
			.attr('id', function (d) {
				return d.id;
			})
			.attr('width', barWidth)
			.attr('height', heightWithMargin)
			.attr('x', function (datum) {
				return xScale(datum.key) + 10;
			})
			.attr('y', 0)
			.attr('fill', 'transparent')
			.on('mouseover', function (d) {
				const curbox = boxPlotData[d.target.id];
				var array = checkNum();
				// med
				if (array[2] == 1) {
					const rect = g
						.insert('rect', 'area')
						.attr('id', 'small')
						.attr('x', function () {
							return xScale(curbox.key) + 2;
						})
						.attr('y', function () {
							return yScale(-curbox.quartile[1]) - 6;
						})
						.attr('height', 10)
						.attr('width', 25)
						.style('fill', 'white');

					const med = g
						.insert('text', 'area')
						.attr('x', function () {
							if ((-curbox.quartile[1]).toString() == '0') return xScale(curbox.key) + 13;
							else return xScale(curbox.key) + 3;
						})
						.attr('y', function () {
							return yScale(-curbox.quartile[1]) + 3;
						})
						.text(function () {
							return (-curbox.quartile[1]).toString().substring(0, 5);
						})
						.style('font-size', '10px')
						.style('fill', 'purple');
				}
				// q3
				if (array[1] == 1) {
					const rect = g
						.insert('rect', 'area')
						.attr('id', 'small')
						.attr('x', function () {
							return xScale(curbox.key) + 2;
						})
						.attr('y', function () {
							return yScale(-curbox.quartile[0]) - 6;
						})
						.attr('height', 10)
						.attr('width', 25)
						.style('fill', 'white');

					const q1 = g
						.insert('text', 'area')
						.attr('x', function () {
							if ((-curbox.quartile[0]).toString() == '0') return xScale(curbox.key) + 13;
							else return xScale(curbox.key) + 3;
						})
						.attr('y', function () {
							return yScale(-curbox.quartile[0]) + 3;
						})
						.text(function () {
							return (-curbox.quartile[0]).toString().substring(0, 5);
						})
						.style('font-size', '10px')
						.style('fill', 'purple');
				}
				// q1
				if (array[3] == 1) {
					const rect = g
						.insert('rect', 'area')
						.attr('id', 'small')
						.attr('x', function () {
							return xScale(curbox.key) + 2;
						})
						.attr('y', function () {
							return yScale(-curbox.quartile[2]) - 6;
						})
						.attr('height', 10)
						.attr('width', 25)
						.style('fill', 'white');

					const q3 = g
						.insert('text', 'area')
						.attr('x', function () {
							if ((-curbox.quartile[2]).toString() == '0') return xScale(curbox.key) + 13;
							else return xScale(curbox.key) + 3;
						})
						.attr('y', function () {
							return yScale(-curbox.quartile[2]) + 3;
						})
						.text(function () {
							return (-curbox.quartile[2]).toString().substring(0, 5);
						})
						.style('font-size', '10px')
						.style('fill', 'purple');
				}
				// max
				if (array[0] == 1) {
					const rect = g
						.insert('rect', 'area')
						.attr('id', 'small')
						.attr('x', function () {
							return xScale(curbox.key) + 2;
						})
						.attr('y', function () {
							return yScale(-curbox.max) - 6;
						})
						.attr('height', 10)
						.attr('width', 25)
						.style('fill', 'white');

					const max = g
						.insert('text', 'area')
						.attr('x', function () {
							if ((-curbox.max).toString() == '0') return xScale(curbox.key) + 13;
							else return xScale(curbox.key) + 3;
						})
						.attr('y', function () {
							return yScale(-curbox.max) + 3;
						})
						.text(function () {
							return (-curbox.max).toString().substring(0, 5);
						})
						.style('font-size', '10px')
						.style('fill', 'purple');
				}
				// min
				if (array[4] == 1) {
					const rect = g
						.insert('rect', 'area')
						.attr('id', 'small')
						.attr('x', function () {
							return xScale(curbox.key) + 2;
						})
						.attr('y', function () {
							return yScale(-curbox.min) - 6;
						})
						.attr('height', 10)
						.attr('width', 25)
						.style('fill', 'white');
					const min = g
						.insert('text', 'area')
						.attr('x', function () {
							if ((-curbox.min).toString() == '0') return xScale(curbox.key) + 13;
							else return xScale(curbox.key) + 3;
						})
						.attr('y', function () {
							return yScale(-curbox.min) + 3;
						})
						.text(function () {
							return (-curbox.min).toString().substring(0, 5);
						})
						.style('font-size', '10px')
						.style('fill', 'purple');
				}
			})
			.on('mouseout', function (d) {
				g.selectAll('text').remove();
				g.selectAll("rect[id='small']").remove();
			});

		// check form functions
		function checkNum() {
			var array = new Array();
			for (var i = 0; i < myform1.single.length; i++) {
				if (myform1.single[i].checked == true) array[i] = 1;
				else array[i] = 0;
			}
			return array;
		}
	});
</script>

<div class="form">
	<form
		name="myform1"
		style="position:absolute;top:650px;left:740px;line-height:12.5px;font-size:5px"
	>
		<input
			type="checkbox"
			class="checkclass"
			name="single"
			id="type1"
			style="margin-bottom:0px"
		/>max
		<br />
		<input
			type="checkbox"
			class="checkclass"
			name="single"
			id="type2"
			style="margin-bottom:0px"
		/>Q3
		<br />
		<input
			type="checkbox"
			class="checkclass"
			name="single"
			id="type3"
			style="margin-bottom:0px"
		/>med
		<br />
		<input
			type="checkbox"
			class="checkclass"
			name="single"
			id="type4"
			style="margin-bottom:0px"
		/>Q1
		<br />
		<input
			type="checkbox"
			class="checkclass"
			name="single"
			id="type5"
			style="margin-bottom:0px"
		/>min
	</form>
</div>

<svg bind:this={svg_node} {height} {width} xmlns="http://www.w3.org/2000/svg" />
