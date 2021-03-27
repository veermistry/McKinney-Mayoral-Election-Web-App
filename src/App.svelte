<script>
	import Dialog from '@fouita/dialog'

	import Flex from 'svelte-flex';

	import * as geolib from 'geolib';

	import locations from './locations.json';
(`running version ${locations.length}`);

	let imgSrc = './SvelteAppMedia/downtown-mckinney.jpeg'
	
	let header = 'McKinney 2021 General Election';

	let src = '';

	let showModal = false;

	let showDistance = false;

	let ZIP;

	let z_index_val = 0;

	import Modal from './modal.svelte'
	
	const toggleModal = () => {
		showModal =  !showModal;
	}

	const findDistance = () => {
		getDistance(
    		{ latitude: location.Latitude, longitude: location.Longitude },
    		{ latitude: "40.7580", longitude: "73.9855" }
		);
	}

	window.addEventListener
	('DOMContentLoaded', () =>{
		const register = document.querySelector('#Register')
		const close = document.querySelector('#close')


	})

</script>

<Modal {showModal} on:click={toggleModal}/>
<main>
	<div><!--content wrapper-->
        <div>
            <nav>
                <div class = "shadow-md">
                    <h1 class="font-main p-4 text-black bg-gray-50">
                        <a href="/" class="text-md sm:text-xl">McKinney 2021 General Election</a>
                    </h1>
                </div>
                <ul class="flex items-start px-10 pb-10 md:justify-center w-full">
                    <li id = "Register" class="text-gray-400 font-main uppercase mt-12">
						<button on:click={toggleModal}>
							<span class="text-base font-main border-b border-blue-900 sm: text">REGISTER</span>
						</button>
                    </li>
                    <li class="text-gray-400 font-main uppercase mt-12">
                        <a href="/">
                            <span class="text-base font-main m-7 border-b border-blue-900 sm: text">News</span>
                        </a>
                    </li>
                    <li class="text-gray-400 font-main uppercase mt-12 ">
                        <a href="/">
                            <span class="font-main text-base text-blue-800 border-b border-blue-900">Find your location</span>
                        </a>
                    </li>
                </ul>
				<div id="background" class="bg-black bg-opacity-50 absolute inset-0 hidden justify-center items-center">
					<div class="bg-white py-1 px-2 rounded shadow-xl">
						<div class = "px-1">
							<div class="flex justify-center items-center">
								<h1>Click <u><a href="https://www.votetexas.gov/register/index.html" target="_blank">here</a></u> to begin your registration process</h1>
							</div>
            				<b>Are you eligible to vote?</b>
            				<p>You are eligible if:
                			<br>
                			<br> • You are a United States citizen; <br>
                			<br> • You are a resident of the county where you submit the application; <br>
                			<br> • You are at least 17 years and 10 months old, and you are 18 years of age on
                			Election Day. <br>
                			<br> • You are not a convicted felon (you may be eligible to vote if you have completed your sentence, probation, and parole); and <br>
                			<br> • You have not been declared by a court exercising probate jurisdiction to be either totally mentally incapacitated or partially mentally incapacitated without the right to vote.
            				</p>
							<div class="flex justify-end items-end px-2">
								<small>information from <a href="https://www.votetexas.gov/register/index.html">https://www.votetexas.gov/register/index.html</a></small>
							</div>
							<div id="close">
								Close screen
							</div>
						</div>
					</div>
				</div>
                <div class="grid md:grid-cols-2">
					<div class="block">
                        <div class="ml-5">
								<span class="text-gray-700 font-main">Location QuickSearch:</span>
                            	<!--input type="form" class="form-input block mt-1 w-56 border border-blue-900" placeholder="Enter your ZIP code here!"-->
								<input on:keytype={ZIP} type="text" class="form-input block mt-1 w-56 border border-blue-900" placeholder="Insert ZIP" bind:value={ZIP}>
								{#each locations as location}
									{#if ZIP == location.Zip}
										<span class="block"><a href={location.MapsLink} target="_blank">Location: <u>{location.Name}, {location.Room}</u></a>
										<!--p>This location is {geolib.getDistance(
											{latitude: location.Latitude, longitude: location.Longitude},
											{latitude: 40.7580, longitude: 73.9855}
										)} meters from Times Square NYC!</p-->
										</span>
									{/if}
								{/each}
                        </div>
                    </div>
					<div class="block">
						<img src="img/downtown-mckinney.jpeg" alt="downtown" class="justify-start m-5 shadow-lg h-36 w-64" >
					</div>
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                   
                </div>
            </nav>
        </div><!-- end nav-->

            <header>
                <h2 class="text-black font-bold text-lg ml-3">What Election?</h2>
            </header>
				<div class="justify-center items-center">
					<p class="w-full ml-4">
						On May 1st, 2021, voters in McKinney will elect representatives for these positions in City Council:
						<br> <br>
						• Mayor <br>
						• District 1 <br>
						• District 3 <br>
						• At Large 1 <br>
						<br>
						Mayoral Candidates: 
						<small class="text-gray-500">Click on their names to go to their webpages.</small>
					</p>
				</div>
				<div class="grid md:grid-cols-3 md:grid-rows-1 sm:grid-cols-2 sm:grid-rows-2 rounded-md overflow-hidden gap-10 px-5">
					<div class="bg-gray-200 shadow-xl">
						<img src="img/George_Fuller.jpeg" alt="George Fuller" class="w-full h-60 object-cover content-center shadow-md">
						<div>
							<span class=" font-bold text-center" > Current Mayor: <a href="https://www.mckinneytexas.org/1167/Council-Members#Biographies" target="_blank" class="underline">George Fuller</a> </span>
							<span class="block">George info</span>
						</div>
					</div>
					<div class="bg-gray-200 rounded shadow-xl">
						<img src="img/Jimmy_Stewart.jpeg" alt="Jimmy Stewart" class="w-full h-60 object-cover content-center shadow-md">
						<div>
							<span class=" font-bold text-center" ><a href="https://www.facebook.com/Jimmy-Stewart-For-McKinney-Mayor-353532622386631" target="_blank" class="underline">Jimmy Stewart</a></span>
							<span class="block">George info</span>
						</div>
					</div>
					<div class="bg-gray-200 rounded shadow-xl">
						<img src="img/Thomas_Meredith.jpeg" alt="Thomas_Meredith" class="w-full h-60 object-cover content-center shadow-md">
						<div>
							<span class="font-bold text-center" > <a href="https://www.facebook.com/Meredith-For-McKinney-104874304725724" target="_blank" class="underline">Thomas Meredith</a> </span>
							<span class="block">George info</span>
						</div>
					</div>
				</div>
				<div class="ml-4">
					<p>
						<br>
						District 1 Candidates: 
						<small class="text-gray-500">Click on their names to go to their webpages.</small>
						<br>
					</p>
				</div>
				<div class="grid grid-rows-3 grid-cols-2 md:grid-cols-5 md:grid-rows-1 rounded-md overflow-hidden gap-5 px-5">
					<div class="bg-gray-200 shadow-xl">
						<span class=" font-bold text-center" ><a href="https://www.facebook.com/Jimmy-Stewart-For-McKinney-Mayor-353532622386631" target="_blank" class="underline">Cristoval (Cris) Treviño</a></span>
							<span class="block">George info</span>
					</div>
					<div class="bg-gray-200 shadow-xl">
						<span class=" font-bold text-center" ><a href="https://www.facebook.com/Jimmy-Stewart-For-McKinney-Mayor-353532622386631" target="_blank" class="underline">Johnny Moore</a></span>
							<span class="block">George info</span>
					</div>
					<div class="bg-gray-200 shadow-xl">
						<span class=" font-bold text-center" ><a href="https://www.facebook.com/Jimmy-Stewart-For-McKinney-Mayor-353532622386631" target="_blank" class="underline">Justin Beller</a></span>
							<span class="block">George info</span>
					</div>
					<div class="bg-gray-200 shadow-xl">
						<span class=" font-bold text-center" ><a href="https://www.facebook.com/Jimmy-Stewart-For-McKinney-Mayor-353532622386631" target="_blank" class="underline">Stanley Penn</a></span>
							<span class="block">George info</span>
					</div>
					<div class="bg-gray-200 shadow-xl">
						<span class=" font-bold text-center" ><a href="https://www.facebook.com/Jimmy-Stewart-For-McKinney-Mayor-353532622386631" target="_blank" class="underline">Thomas Tolan</a></span>
							<span class="block">George info</span>
					</div>
				</div>
				<div class="ml-4">
					<p>
						<br>
						District 3 Candidates: 
						<small class="text-gray-500">Click on their names to go to their webpages.</small>
						<br>
					</p>
				</div>
				<div class="grid grid-cols-2 rounded-md overflow-hidden gap-5 px-5">
					<div class="bg-gray-200 shadow-xl">
						<span class=" font-bold text-center" ><a href="https://www.facebook.com/Jimmy-Stewart-For-McKinney-Mayor-353532622386631" target="_blank" class="underline">Gere' Feltus</a></span>
							<span class="block">George info</span>
					</div>
					<div class="bg-gray-200 shadow-xl">
						<span class=" font-bold text-center" ><a href="https://www.facebook.com/Jimmy-Stewart-For-McKinney-Mayor-353532622386631" target="_blank" class="underline">Vicente Torres</a></span>
							<span class="block">George info</span>
					</div>
				</div>
				<div class="ml-4">
					<p>
						<br>
						At Large 1 Candidates: 
						<small class="text-gray-500">Click on their names to go to their webpages.</small>
						<br>
					</p>
				</div>
				<div class="grid grid-rows-1 grid-cols-2 rounded-md overflow-hidden gap-5 px-5 mb-10">
					<div class="bg-gray-200 shadow-xl">
						<span class=" font-bold text-center" ><a href="https://www.facebook.com/Jimmy-Stewart-For-McKinney-Mayor-353532622386631" target="_blank" class="underline">Brian J. Magnuson</a></span>
							<span class="block">George info</span>
					</div>
					<div class="bg-gray-200 shadow-xl">
						<span class=" font-bold text-center" ><a href="https://www.facebook.com/Jimmy-Stewart-For-McKinney-Mayor-353532622386631" target="_blank" class="underline">Charlie Philips</a></span>
							<span class="block">George info</span>
					</div>
				</div>
                <!--div class="flex items-start text-bold">
                    <div class="flex-1 bg-gray-300 m-5 text-center shadow-xl" > Current Mayor: <a href="https://www.mckinneytexas.org/1167/Council-Members#Biographies" target="_blank" class="underline">George Fuller</a> </div>
                    <div class="flex-1 bg-gray-300 m-5 text-center shadow-xl" > <a href="https://www.facebook.com/Jimmy-Stewart-For-McKinney-Mayor-353532622386631" target="_blank" class="underline">Jimmy Stewart</a></div>
                    <div class="flex-1 bg-gray-300 m-5 text-center shadow-xl" > <a href="https://www.facebook.com/Meredith-For-McKinney-104874304725724" target="_blank" class="underline">Thomas Meredith</a> </div>
                </div>
                <div class="grid grid-cols-3 gap-5 px-5">
                    <img src="img/George_Fuller.jpeg" alt="George Fuller" class="flex-1 h-30 object-cover object-center m-5 content-center">
                    <img src="img/Jimmy_Stewart.jpeg" alt="Jimmy Stewart" class="flex-1 h-30 object-cover object-center m-5">
                    <img src="img/Thomas_Meredith.jpeg" alt="Thomas Meredith" class="flex-1 h-30 object-cover object-center m-5">
                </div>
                <div class="flex items-start text-bold">
                    <p class="flex-1 bg-gray-300 m-5">george info</p>
                    <p class="flex-1 bg-gray-300 m-5">jimmy info</p>
                    <p class="flex-1 bg-gray-300 m-5">thomas info</p>
                </div-->

    </div>
	<!--register button-->
<!--div>
	<Flex class="flex-end">
		<button on:click={toggleModal}>REGISTER</button>
	</Flex>

	<h1 class="shadow">{header}</h1>
	<img src="public/img/downtown-mckinney.jpeg" alt="downtown" />

	<b>Find a voting location in your area!</b>
	<input on:keytype={ZIP} type="text" placeholder="Insert ZIP" bind:value={ZIP}>
	<h2>WHAT ELECTION?</h2>
	{#each locations as location}
		{#if ZIP == location.Zip}
			<a href={location.MapsLink} target="_blank">Location: <u>{location.Name}, {location.Room}</u></a>
			<p>This location is {geolib.getDistance(
				{latitude: location.Latitude, longitude: location.Longitude},
				{latitude: 40.7580, longitude: 73.9855}
				)} meters from Times Square NYC!</p>
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
		<small>Click the names of each candidate to visit their webpage.</small>
	</p>
</div-->
</main>

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

<!--style>
	/* poppins-regular - latin */

	/*main{
		font-family: 'Poppins';
		margin: 0 auto;
	}
	h1{
		text-align: left;
		padding: 1em;
		max-width: 5000px;
		margin: 40;
		background-color: #ededed;
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
	h2{
		background-color: #ededed;
		left: 20px;
	}
	b{
		position: absolute;
		top: 150px;
		right: 40px;
	}
	input{
		position: absolute;
		top: 175px;
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
	small{
		color: gray;
	}*/
</style-->