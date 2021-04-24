<script>

import {onMount} from 'svelte';

	import router from 'page'

	import * as geolib from 'geolib';

	import * as navigator from 'navigator';

	import Modal from './routes/modal.svelte'
	// Include our Routes
	import Home from './routes/Home.svelte'
	import News from './routes/News.svelte'
	// Variables
	let page;
	let params;

	// Set up the pages to watch for
	router('/', () => (page = Home))
	router('/news', () => (page = News))

	// Set up the router to start and actively watch for changes
	router.start();

</script>

<svelte:component this="{page}" params="{params}" />

<svelte:head>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
    <style>
        @import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");

		@tailwind base;
		@tailwind components;
		@tailwind utilities;
    </style>

</svelte:head>

<style global lang="postcss">
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>