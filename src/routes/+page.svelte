<script lang="ts">
	import EurasiaMap from '$lib/EurasiaMap.svelte';
	import WordCloud from '$lib/WordCloud.svelte';
	import SentimentAnalysis from '$lib/SentimentAnalysis.svelte';
	import FrequencyMagnitudeHistogram from '$lib/FrequencyMagnitudeHistogram.svelte';
	import Frequency from '$lib/Frequency.svelte';

	import { base } from '$app/paths';

	const h2 = 200;
	const w2 = 350;
	const dark_purple = 'hsl(300deg, 90%, 40%)';
	// Generate an array of purple colors of given number
	// from hsl(300deg, 90%, 90%) to hsl(300deg, 90%, 10%)
	const gen_purple_scheme = (n: number) =>
		[...Array(n).keys()].map((i: number) => `hsl(300deg, 90%, ${60 * (1 - i / (n - 1)) + 30}%)`);
	const purple_scheme7 = gen_purple_scheme(7);
</script>

<article class="flex-column justify-between font-7-8">
	<div class="dark flex-column">
		<div class="flex-item">
			<EurasiaMap />
			<p>
				▲ Earthquake distribution 2000 ~ 2023. Two reddest points in the center took place on Feb 6.
				Despite many weaker quakes, this area seldom experience such strong ones, thus presumably
				unprepared.
			</p>
			<div class="flex-row justify-between gap-1">
				<p class="font-5-8">
					Polygons represent countries. Turkey and Syria are marked dark red. Each circle for one
					earthquake of magnitude ≥ 5. Hue represent magnitude. Hover on each earthquake to get a
					pop-up card about its magnitude and time.
				</p>
				<p class="font-5-8">
					Drag, scroll, and pinch to pan and zoom the map. Hover on the bottom right of the map to
					unhide the time slider. Drag the slider to choose the beginning year of the time interval.
				</p>
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

	<div class="flex-row justify-between gap-1">
		<div class="flex-item">
			<p>▼ Frequent subwords in Tweets. Rescue is common theme.</p>
			<p class="font-5-8">
				Tweets Feb 6 ~ Feb 16 containing <em>Turkey earthquake</em> or
				<em>#TurkeySyriaEarthquake</em>. Tokenized with Hugging Face tokenizer. Trivial subwords and
				tag words ignored. Hover each subword to get a pop-up card about it and its number of
				mentions. Hover on bottom to unhide slider. Slide to choose end of time interval.
			</p>
			<WordCloud height={h2} width={w2} fill={dark_purple} />
		</div>
		<div class="flex-item">
			<p>▼ Sentiment of Tweets Related to Turkey Earthquake Over Time</p>
			<p class="font-5-8">
				VADER Sentiment is calculated by summing up the sentiment score of each word in a tweet.
				With 0 representing a neutral tweet, it is clear that discussion on twitter is primarily
				negative. As the full extent of damage becomes apparent and criticism of the government’s
				response begin, sentiments stay negative. Perhaps this is why the Turkish government blocked
				Twitter?
			</p>
			<SentimentAnalysis height={h2} width={w2} scheme={purple_scheme7} />
		</div>
	</div>

	<div class="flex-row justify-between gap-1">
		<div class="flex-item">
			<p>▼ Frequency of Earthquakes by Magnitude from 2000 to Present</p>
			<p class="font-5-8">
				Earthquakes of low magnitude are exponentially more common than earthquakes of high
				magnitude. Though this analysis only includes earthquakes of magnitude 5.0 or greater, we
				expect this correlation to continue. The devastating earthquake that struck Turkey was truly
				a statistical anomaly.
			</p>
			<FrequencyMagnitudeHistogram height={h2} width={w2} fill={dark_purple} />
		</div>
		<div class="flex-item">
			<p>▼ Frequency of Tweets Related to Turkey Earthquake</p>
			<p class="font-5-8">
				Frequency of tweets containing “turkey earthquake” and “#TurkeySyriaEarthquake”. Before the
				earthquake, baseline discussion of earthquakes was low. Though frequency of tweets
				mentioning earthquake skyrocketed after the disaster struck, it quickly died down, perhaps
				in part due to the Turkish government making the controversial decision to block Twitter
				temporarily on February 8, 2023.
			</p>
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
		height: 29.7cm;
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
