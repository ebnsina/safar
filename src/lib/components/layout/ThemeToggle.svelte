<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from '../ui/Icon.svelte';
	import { ICONS } from '../ui/icons';

	let theme = $state<'light' | 'dark'>('light');

	// The no-flash script in app.html has already stamped the root; read it back.
	onMount(() => {
		theme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
	});

	function toggle() {
		theme = theme === 'dark' ? 'light' : 'dark';
		document.documentElement.dataset.theme = theme;
		try {
			localStorage.setItem('safar-theme', theme);
		} catch {
			// A blocked storage API only costs the preference between visits.
		}
	}
</script>

<button
	type="button"
	onclick={toggle}
	class="text-muted transition-colors duration-160 hover:text-ink"
	aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
>
	<Icon icon={theme === 'dark' ? ICONS.light : ICONS.dark} size={16} />
</button>
