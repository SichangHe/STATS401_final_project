<script lang="ts">
	import EurasiaMap from '$lib/EurasiaMap.svelte';
	import WordCloud from '$lib/WordCloud.svelte';
	import SentimentAnalysis from '$lib/SentimentAnalysis.svelte';
	import FrequencyMagnitudeHistogram from '$lib/FrequencyMagnitudeHistogram.svelte';
	import Frequency from '$lib/Frequency.svelte';

	import { base } from '$app/paths';

	const h2 = 250;
	const w2 = 350;
	const dark_purple = 'hsl(300deg, 90%, 40%)';
	// Generate an array of purple colors of given number
	// from hsl(300deg, 90%, 90%) to hsl(300deg, 90%, 10%)
	const gen_purple_scheme = (n: number) =>
		[...Array(n).keys()].map((i: number) => `hsl(300deg, 90%, ${60 * (1 - i / (n - 1)) + 30}%)`);
	const purple_scheme7 = gen_purple_scheme(7);
</script>

<article class="flex-column justify-between">
	<div class="dark flex-column">
		<div class="flex-item">
			<EurasiaMap />
			<p>
				▲ Earthquake distribution 2000 ~ 2023. Two reddest points in the center took place on Feb 6.
				<br />
				Despite many weaker quakes, this area seldom experience such strong ones, thus presumably unprepared.
			</p>
			<div class="flex-row justify-between">
				<p class="font-2-3">
					Polygons represent countries. Turkey and Syria are marked dark red.
					<br />
					Each circle represents one earthquake with magnitude at least 5.
					<br />
					Hover on each earthquake to get a pop-up card about its magnitude and time.
				</p>
				<p class="font-2-3">
					Drag, scroll, and pinch to pan and zoom the map.
					<br />
					Hover on the bottom right of the map to unhide the time slider.
					<br />
					Drag the slider to choose the beginning year of the time interval.
				</p>
			</div>
		</div>

		<div class="flex-row justify-between">
			<div>
				<h1>Analysis of 2023 Turkey-Syria Earthquake</h1>
				<p>
					Turkey-Syria earthquake caused massive destruction and 45,000+ deaths. Why is it so fatal?
					How did people express their feelings about it?
				</p>
			</div>
			<div class="flex-column justify-center">
				<img src="{base}/qr_code.svg" alt="QR code to this webpage." class="qr-code" />
				<span> Scan to interact! </span>
			</div>
		</div>
	</div>

	<div class="flex-row justify-between">
		<div class="flex-item">
			<p>▼ Frequent word fragments in Tweets. Words related to rescues are most common.</p>
			<WordCloud height={h2} width={w2} fill={dark_purple} />
		</div>
		<div class="flex-item">
			<p>Demo sentiment analysis:</p>
			<SentimentAnalysis height={h2} width={w2} scheme={purple_scheme7} />
		</div>
	</div>

	<div class="flex-row justify-between">
		<div class="flex-item">
			<p>Frequence Magnitude Histogram:</p>
			<FrequencyMagnitudeHistogram height={h2} width={w2} fill={dark_purple} />
		</div>
		<div class="flex-item">
			<p>Turkish government blocked Twitter on Feb 8. What effects did it bring?</p>
			<Frequency height={h2} width={w2} stroke={dark_purple} />
		</div>
	</div>
	<div class="authors">
		<p>
			By Steven Hé (Sīchàng), Gezhi Wang, Yuxuan Wang, Neil Kelly for STATS 401.
			<a href="https://github.com/SichangHe/STATS401_final_project">
				<img src="{base}/gh-icon.svg" alt="GitHub icon." class="gh-icon" /></a
			>
		</p>
	</div>
</article>

<style>
	article {
		/* TODO: remove border when the layout is done. */
		border-color: lightgray;
		border-style: solid;
		border-width: 2px;

		background-color: hsl(45deg, 80%, 90%);
		color: hsl(300deg, 100%, 15%);
		font-family: 'PT Serif';
		min-height: 29.7cm;
		width: 21cm;
	}
	@media print {
		article {
			border-width: 0;
		}
	}

	h1 {
		font-size: 2rem;
		margin-bottom: 0.5rem;
		margin-top: 0.5rem;
	}

	img.qr-code {
		padding: 2px;
		width: 64px;
	}

	img.gh-icon {
		width: 8px;
	}

	p {
		margin-bottom: 0.25rem;
		margin-top: 0.25rem;
	}

	span {
		font-size: 0.55rem;
		text-align: center;
	}

	.dark {
		background-color: hsl(180deg, 10%, 10%);
		color: hsl(300deg, 100%, 90%);
	}

	.authors {
		font-size: 0.55rem;
		text-align: right;
	}

	.flex-column {
		display: flex;
		flex-direction: column;
	}
	.flex-row {
		display: flex;
		flex-direction: row;
	}

	.justify-center {
		justify-content: center;
	}
	.justify-between {
		justify-content: space-between;
	}

	.font-2-3 {
		font-size: 0.75rem;
	}

	@media print {
		* {
			-webkit-print-color-adjust: exact;
			print-color-adjust: exact;
		}
	}
</style>
