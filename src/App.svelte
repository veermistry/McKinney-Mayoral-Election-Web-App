<script>
	import locations from './locations.json';
	console.log(`running version ${locations.length}`);

	let imgSrc = './SvelteAppMedia/downtown-mckinney.jpeg'
	
	let header = 'McKinney 2021 General Election';

	let src = '';

	let showModal = false;

	let ZIP;

	let z_index_val = 0;

	import Modal from './modal.svelte'
	
	const toggleModal = () => {
		showModal =  !showModal;
		if (z_index_val == 0)
			z_index_val = -1;
		else
		z_index_val = 0;
	}

</script>

<Modal {showModal} on:click={toggleModal}/>
<main>
	<!--register button-->
<div>
	<button on:click={toggleModal}>REGISTER</button>
	<!--titleheader-->
	<h1>{header}</h1>
	<img {imgSrc} alt="display" />
	<!--input subtitle-->
	<b>Find a voting location in your area!</b>
	<input on:keytype={ZIP} type="text" placeholder="Insert ZIP" bind:value={ZIP}>
	<h2>WHAT ELECTION?</h2>
	{#each locations as location}
		{#if ZIP == location.Zip}
			<a href={location.MapsLink} target="_blank">Location: <u>{location.Name}, {location.Room}</u></a>
		{/if}
	{/each}
	<p>On May 1st, 2021, voters will elect representatives for these positions in City Council:
		<br>
		<br>•   Mayor	
		<br>•   District 1
		<br>•   District 3
		<br>•   At Large 1	
		<br>
		<br> Mayoral Candidates:
		<br>
		<b>Current Mayor: George Fuller</b>
	</p>
</div>
</main>

<style>
	main{
		margin: 0 auto;
	}
	h1{
		text-align: left;
		padding: 1em;
		max-width: 500px;
		margin: 40;
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
	img{
		position: relative;
		top: 150px;
		left: 40px;
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
	a{
		position: absolute;
		top: 200px;
		right: 40px;
		color: blue;
	}
	h2{
		position: absolute;
		text-align: left;
		padding: 1em;
		max-width: 500px;
		margin: 40;
		top: 400px;
	}
	p{
		position: relative;
		text-align: left;
		padding: 1em;
		max-width: 700px;
		margin: 40;
		top: 310px;
		left: 40px;
	}

</style>