<script>
	import EurasiaMap from '$lib/EurasiaMap.svelte';
	import WordCloud from '$lib/WordCloud.svelte';
	import SentimentAnalysis from '$lib/SentimentAnalysis.svelte';
	import FrequencyMagnitudeHistogram from '../lib/FrequencyMagnitudeHistogram.svelte';
	import Frequency from '$lib/Frequency.svelte';

	import { base } from '$app/paths';

	const h2 = 250;
	const w2 = 350;
</script>

<article class="flex-column justify-center">
	<div class="flex-row justify-between">
		<h1>Analysis of 2023 Turkey-Syria Earthquake</h1>
		<img src="{base}/qr_code.svg" alt="QR code to this webpage." />
	</div>

	<div class="flex-item">
		<p>
			Earthquake distribution map of earthquakes from 2000 to 2023 around the Turkey-Syria region.
		</p>
		<EurasiaMap />
	</div>
	<div class="flex-row justify-between">
		<div class="flex-item">
			<p>Word cloud of Tweets.</p>
			<WordCloud height={h2} width={w2} />
		</div>
		<div class="flex-item">
			<p>Demo sentiment analysis:</p>
			<SentimentAnalysis height={h2} width={w2} />
		</div>
	</div>
	<div class="flex-row justify-between">
		<div class="flex-item">
			<p>Frequence Magnitude Histogram:</p>
			<FrequencyMagnitudeHistogram height={h2} width={w2} />
		</div>
		<div class="flex-item">
			<p>frequency</p>
			<Frequency height={h2} width={w2} />
		</div>
	</div>
</article>

<style>
	article {
		border-color: lightgray;
		border-style: solid;
		border-width: 2px;
		min-height: 29.7cm;
		width: 21cm;
	}

	img {
		width: 8%;
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
</style>
