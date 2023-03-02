<script lang="ts">
	type Config = {
		title?: string;
		body?: string;
		visible?: boolean;
		left?: number;
		top?: number;
		fill?: string;
	};

	let cfg: Config = {
		visible: false
	};
	export function config(config: Config) {
		Object.assign(cfg, config);
		cfg = cfg;
	}
</script>

<div
	style="visibility: {cfg.visible ? 'visible' : 'hidden'}; left: {cfg.left}px; top: {cfg.top}px;"
>
	<h2 style="background-color: {cfg.fill};">{cfg.title}</h2>
	<p>
		{cfg.body}
	</p>
</div>

<style>
	div {
		background-color: white;
		border-color: #e5e7eb;
		border-radius: 0.5rem;
		border-style: solid;
		border-width: 2px;
		color: black;
		padding-left: 1rem;
		padding-right: 1rem;
		position: absolute;
		transform: translateX(-50%);
	}
</style>
