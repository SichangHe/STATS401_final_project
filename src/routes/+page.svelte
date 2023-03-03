<script lang="ts">
	import EurasiaMap from '$lib/EurasiaMap.svelte';
	import WordCloud from '$lib/WordCloud.svelte';
	import SentimentAnalysis from '$lib/SentimentAnalysis.svelte';
	import FrequencyMagnitudeHistogram from '$lib/FrequencyMagnitudeHistogram.svelte';
	import Frequency from '$lib/Frequency.svelte';

	import { base } from '$app/paths';

	const h2 = 220;
	const w2 = 380;
	const dark_purple = 'hsl(300deg, 90%, 40%)';
	const purple_scheme = {
		a: 'hsl(300deg, 90%, 80%)',
		b: 'hsl(300deg, 90%, 30%)'
	};
</script>

<article class="flex-column font-7-8">
	<div class="dark flex-column">
		<div class="flex-item">
			<EurasiaMap />
			<p>
				▲ Earthquake distribution 2000 ~ 2023. Two reddest points in the center took place on Feb 6.
				Despite many weaker quakes, this area seldom experience such strong ones, thus presumably
				unprepared.
			</p>
			<div class="column-2 gap-1 font-5-8">
				Earthquake data around Turkey of magnitude ≥ 5 since 2000 retrieved from United States
				Geological Survey (USGS). Polygons represent countries. Turkey and Syria are marked dark
				red. Each circle represents one earthquake. Hue indicates magnitude. Hover over each
				earthquake for its magnitude and time. Drag, scroll, and pinch to pan and zoom the map.
				Hover over the bottom right of the map to unhide the time slider. Drag the slider to choose
				the beginning year of the time interval.
			</div>
		</div>

		<div class="flex-row justify-between">
			<div>
				<h1>Analysis of 2023 Turkey-Syria Earthquake</h1>
				<p class="font-1">
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

	<div class="column-2 gap-1">
		<div class="flex-column justify-between">
			<div class="flex-item">
				<p>▼ Word Cloud From Tweets. Rescue is common theme.</p>
				<p class="font-5-8">
					Tweets Feb 6 ~ Feb 16 containing <em>Turkey earthquake</em> or
					<em>#TurkeySyriaEarthquake</em> scraped from Twitter using snscrape. Tokenized with a Hugging
					Face tokenizer. Trivial subwords and tag words ignored. Hover over each subword to get a pop-up
					card about it and its number of mentions. Hover over bottom to unhide slider. Slide to choose
					end of time interval.
				</p>
				<WordCloud height={h2} width={w2} fill={dark_purple} />
			</div>
			<div class="flex-item">
				<FrequencyMagnitudeHistogram height={h2} width={w2} fill={dark_purple} />
				<p>▲ Frequency of Earthquakes by Magnitude</p>
				<p class="font-5-8">
					Same earthquake data as the distribution map but with earthquakes around the globe. The
					heights of the histogram bars represent the number of times an earthquake within the
					magnitude range occurred. Hover over the bars to see the exact count of earthquakes in
					each range.
				</p>
			</div>
		</div>

		<div class="flex-column justify-between">
			<div class="flex-item">
				<p>▼ Box Plot of Sentiment of Related Tweets</p>
				<p class="font-5-8">
					Same data as the word cloud. Each box shows the distribution of sentiment (VADER) of
					tweets for one day. Darker boxes represent a more negative average sentiment. It is clear
					that sentiment becomes more negative as discussion shifts towards the earthquake response.
					Hover over each box to view the sentiment details on that day.
				</p>
				<SentimentAnalysis height={h2} width={w2} scheme={purple_scheme} />
			</div>
			<div class="flex-item">
				<Frequency height={h2} width={w2} stroke={dark_purple} />
				<p>▲ Frequency of Tweets Related to Turkey Earthquake</p>
				<p class="font-5-8">
					Same data as the word cloud. X axis represents time, Y axis represents number of tweets on
					each particular day. Though frequency of tweets mentioning earthquake skyrocketed after
					the disaster struck, it quickly died down. Hover over the line to see key points in the
					timeline of the earthquake and subsequent response.
				</p>
			</div>
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
		height: 29.7cm;
		position: relative;
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
		bottom: 0;
		font-size: 0.55rem;
		position: absolute;
		right: 0;
	}

	.column-2 {
		column-count: 2;
	}

	.flex-column {
		display: flex;
		flex-direction: column;
	}
	.flex-row {
		display: flex;
		flex-direction: row;
	}

	.gap-1 {
		gap: 1rem;
	}

	.justify-center {
		justify-content: center;
	}
	.justify-between {
		justify-content: space-between;
	}

	.font-1 {
		font-size: 1rem;
	}
	.font-2-3 {
		font-size: 0.75rem;
	}
	.font-7-8 {
		font-size: 0.875rem;
	}
	.font-5-8 {
		font-size: 0.625rem;
	}

	@media print {
		* {
			-webkit-print-color-adjust: exact;
			print-color-adjust: exact;
		}
	}
</style>
