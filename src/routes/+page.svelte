<script>
	import EurasiaMap from '$lib/EurasiaMap.svelte';
	import WordCloud from '$lib/WordCloud.svelte';
	import SentimentAnalysis from '$lib/SentimentAnalysis.svelte';
	import FrequencyMagnitudeHistogram from '../lib/FrequencyMagnitudeHistogram.svelte';
	import Frequency from '$lib/Frequency.svelte';
</script>

<h1>Analysis of 2023 Turkey-Syria Earthquake</h1>
<p>Earthquake distribution map of earthquakes from 2000 to 2023 around the Turkey-Syria region.</p>
<EurasiaMap />
<p>Word cloud of Tweets.</p>
<WordCloud />
<p>Demo sentiment analysis:</p>
<SentimentAnalysis />
<p>Frequence Magnitude Histogram:</p>
<FrequencyMagnitudeHistogram />
<p>frequency</p>
<Frequency />
