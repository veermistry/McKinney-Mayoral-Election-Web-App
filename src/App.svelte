<script>
	import locations from './locations.json';
	console.log(`running version ${locations.length}`);

	import Modal from './Modal.svelte'

	let imgSrc = 'SvelteAppMedia/downtown-mckinney.jpeg'
	
	let header = 'McKinney 2021 General Election';

	let src = ''

	let showModal = false;

	let ZIP;

	const toggleModal = () => {
		showModal =  !showModal;
	}
</script>

<Modal {showModal} on:click={toggleModal}/>
<main>
	<h1>{header}</h1>
	<img {imgSrc} alt="display" />
	<button on:click={toggleModal}>REGISTER</button>
	<b>Find a voting location in your area!</b>
	<input on:keytype={ZIP} type="number" placeholder="Insert ZIP" bind:value={ZIP}>
	{#each locations as location}
		{#if ZIP == location.Zip}
			<p>Location: {location.Name}</p>
		{/if}
	{/each}
</main>

<style>
	h1{
		text-align: left;
		padding: 1em;
		max-width: 500px;
		margin: 40;
	}
	img{
		position: absolute;
		top: 150px;
		left: 40px;
	}
	button{
		position: absolute;
		top: 50px;
		right: 40px;
		text-align: center;
		padding: 1em;
		max-width: 500px;
		margin: 10;
	}
	b{
		position: absolute;
		top: 130px;
		right: 40px;
	}
	input{
		position: absolute;
		top: 155px;
		right: 40px;
	}
	p{
		position: absolute;
		top: 175px;
		right: 40px;
	}

</style>