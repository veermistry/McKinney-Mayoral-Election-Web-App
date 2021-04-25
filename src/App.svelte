<script>
	import {onMount} from 'svelte';	

	// Include Svelte Ruter
	import router from 'page'

	import * as geolib from 'geolib';
	import * as navigator from 'navigator';

	import Modal from './resources/components/modal.svelte'


	// Include our Pages
	import Home from './resources/views/Home.svelte'
	import News from './resources/views/News.svelte'
	
	// Page Router Params
	let page;
	let params;

	// Set up the pages to watch for
	router('/', () => {page = Home})
	router('/news', () => {page = News})

	// Start the router binding
	router.start();

</script>

<!-- Pass the page and the page props to the application -->
<svelte:component this="{page}" params="{params}" />

<svelte:head>
	<link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet">
</svelte:head>