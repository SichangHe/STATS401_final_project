<script>
	import Vis from '$lib/Vis.svelte';
	import EurasiaMap from '$lib/EurasiaMap.svelte';
	import WordCloud from '$lib/WordCloud.svelte';
	import SentimentAnalysis from '$lib/SentimentAnalysis.svelte'
	import FrequencyMagnitudeHistogram from '../lib/FrequencyMagnitudeHistogram.svelte';
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<p>Demo vis:</p>
<Vis />
<p>Demo Eurasia map:</p>
<EurasiaMap />
<p>Demo word cloud:</p>
<WordCloud />
<p>Demo sentiment analysis:</p>
<SentimentAnalysis />
<p>Frequence Magnitude Histogram:</p>
<FrequencyMagnitudeHistogram />
