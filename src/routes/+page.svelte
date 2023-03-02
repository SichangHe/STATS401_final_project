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
		[...Array(n).keys()].map((i: number) => `hsl(300deg, 90%, ${80 * (1 - i / (n - 1)) + 10}%)`);
	const purple_scheme3 = gen_purple_scheme(3);
</script>

<article>
	<div class="dark flex-column">
		<div class="flex-item">
			<EurasiaMap />
			<p>
				▲ Earthquake distribution 2000 ~ 2023. Two reddest points in the center are recent.
				<br />
				Despite many weaker quakes, this area seldom experience such strong ones, thus presumably unprepared.
			</p>
		</div>

		<div class="flex-row justify-between">
			<div>
				<h1>Analysis of 2023 Turkey-Syria Earthquake</h1>
				<p>
					Magnitude 7.8 Turkey-Syria earthquake caused massive destruction and 45,000+ deaths. Why?
				</p>
			</div>
			<div class="flex-column justify-center">
				<img src="{base}/qr_code.svg" alt="QR code to this webpage." />
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
			<SentimentAnalysis height={h2} width={w2} scheme={purple_scheme3} />
		</div>
	</div>

	<div class="flex-row justify-between">
		<div class="flex-item">
			<p>Frequence Magnitude Histogram:</p>
			<FrequencyMagnitudeHistogram height={h2} width={w2} fill={dark_purple} />
		</div>
		<div class="flex-item">
			<p>frequency</p>
			<Frequency height={h2} width={w2} />
		</div>
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

	img {
		padding: 2px;
		width: 64px;
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

	@media print {
		* {
			-webkit-print-color-adjust: exact;
			print-color-adjust: exact;
		}
	}
</style>
