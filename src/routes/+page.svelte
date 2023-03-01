<script>
	import EurasiaMap from '$lib/EurasiaMap.svelte';
	import WordCloud from '$lib/WordCloud.svelte';
	import SentimentAnalysis from '$lib/SentimentAnalysis.svelte';
	import FrequencyMagnitudeHistogram from '../lib/FrequencyMagnitudeHistogram.svelte';
	import Frequency from '$lib/Frequency.svelte';
</script>

<article class="flex-column justify-center">
	<h1>Analysis of 2023 Turkey-Syria Earthquake</h1>

	<div class="flex-item">
		<p>
			Earthquake distribution map of earthquakes from 2000 to 2023 around the Turkey-Syria region.
		</p>
		<EurasiaMap />
	</div>
	<div class="flex-row justify-center">
		<div class="flex-item">
			<p>Word cloud of Tweets.</p>
			<WordCloud />
		</div>
		<div class="flex-item">
			<p>Demo sentiment analysis:</p>
			<SentimentAnalysis />
		</div>
	</div>
	<div class="flex-row justify-center">
		<div class="flex-item">
			<p>Frequence Magnitude Histogram:</p>
			<FrequencyMagnitudeHistogram />
		</div>
		<div class="flex-item" />
		<div class="flex-item">
			<p>frequency</p>
			<Frequency />
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
</style>
