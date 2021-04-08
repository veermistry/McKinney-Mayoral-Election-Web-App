<script>
	import {onMount} from 'svelte';

	import * as geolib from 'geolib';

	import * as navigator from 'navigator';

	import Modal from './modal.svelte';

	import locations from './locations.json';
	(`running version ${locations.length}`);

	let closestLocation = "";

	let location = { latitude: 33.20484, longitude: -96.67274};

	const getDistanceInMiles = (locationx) => {
        // convert meters to miles
		console.log(locationx.Latitude + " " + locationx.Longitude)
        return (0.000621371192 * geolib.getDistance(
            { latitude: locationx.Latitude, longitude: locationx.Longitude },
            {latitude: location.latitude, longitude: location.longitude }
        )).toFixed(1);
    };
	onMount( async () => {
        // attempt to get user's geolocation, otherwise use the default for McKinney
        navigator.geolocation.getCurrentPosition(
            (position) => {
                location = position.coords
            },
            () => {
                console('Position could not be determined -- use McKinney center coordinates instead')
            }
        );

        alert( `You are ${getDistanceInMiles()} miles away from the 1st voting location` );
    });


	let closestDist = 10000000000000000;

	let showModal = false;

	let showNearest = false;

	const triggerNearest = () => {
		showNearest =  !showNearest;
	}

	let ZIP = "";
	
	const toggleModal = () => {
		showModal =  !showModal;
	}

	const findDistance = () => {
		geolib.getDistance(
    		{ latitude: location.Latitude, longitude: location.Longitude },
    		{ latitude: coords.latitude, longitude: coords.longitude }
		);
	}

	const assignVals = (locationx) => {
		closestLocation = locationx.Name;
		closestDist = getDistanceInMiles(locationx);
	}

</script>

<Modal {showModal} on:click={toggleModal}/>
<main>

	<div>
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
                        <a href="/news">
                            <span class="text-base font-main m-7 border-b border-blue-900 sm: text">News</span>
                        </a>
                    </li>
                    <li class="text-gray-400 font-main uppercase mt-12 ">
                        <a href="/">
                            <span class="font-main text-base text-blue-800 border-b border-blue-900">Find your location</span>
                        </a>
                    </li>
                </ul>

				<div class = "justify-center">
					<button on:click={triggerNearest}>
						<span class="text-base font-main border-b border-blue-900 sm: text">FIND LOCATION</span>
					</button>
					{#if showNearest}
						{#each locations as locationx}
							{#if getDistanceInMiles(locationx) <= closestDist}
								{assignVals(locationx)}
								<!--{console.log(closestDist + " " + closestLocation)}-->
							{/if}
						{/each}}
						<p> Your closest location: {closestLocation}. </p>
					{/if}
				</div>
                <div class="grid md:grid-cols-2">
					<div class="block">
                        <div class="ml-5">
								<span class="text-gray-700 font-main">Location QuickSearch:</span>
								<input on:keytype={ZIP} type="text" class="form-input block mt-1 w-56 border border-blue-900" placeholder="Insert ZIP" bind:value={ZIP}>
								{#each locations as location}
									{#if ZIP == location.Zip}
										<span class="block"><a href={location.MapsLink} target="_blank">Location: <u>{location.Name}, {location.Room}</u></a>
										<p>This location is {geolib.getDistance(
											{latitude: location.Latitude, longitude: location.Longitude},
											{latitude: 40.7580, longitude: 73.9855}
										)} meters from Times Square NYC!</p>
										</span>
									{/if}
								{/each}
                        </div>
                    </div>
					<div class="block">
						<img src="img/downtown-mckinney.jpeg" alt="downtown" class="justify-start m-5 shadow-lg h-36 w-64" >
					</div>
				</div>
            </nav>
        </div>
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
				<div class="grid md:grid-cols-3 md:grid-rows-1 sm:grid-cols-2 sm:grid-rows-2 rounded-md overflow-hidden gap-10 lg:gap-20 px-5">
					<div class="bg-gray-200 shadow-md rounded-t-lg overflow-hidden">
						<img src="img/George_Fuller.jpeg" alt="George Fuller" class="w-full h-60 object-cover content-center shadow-md">
						<div>
							<span class=" font-bold text-center" > Current Mayor: <a href="https://www.mckinneytexas.org/1167/Council-Members#Biographies" target="_blank" class="underline">George Fuller</a> </span>
							<span class="block">George info</span>
						</div>
					</div>
					<div class="bg-gray-200 rounded-t-lg overflow-hidden shadow-xl">
						<img src="img/Jimmy_Stewart.jpeg" alt="Jimmy Stewart" class="w-full h-60 object-cover content-center shadow-md">
						<div>
							<span class=" font-bold text-center" ><a href="https://www.facebook.com/Jimmy-Stewart-For-McKinney-Mayor-353532622386631" target="_blank" class="underline">Jimmy Stewart</a></span>
							<span class="block">George info</span>
						</div>
					</div>
					<div class="bg-gray-200 rounded-t-lg overflow-hidden shadow-xl">
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
				<div class="grid grid-rows-3 grid-cols-2 lg:grid-cols-5 lg:grid-rows-1 rounded-md overflow-hidden gap-5 px-5">
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
						<span class=" font-bold text-center" >Current Officeholder <a href="https://www.facebook.com/Jimmy-Stewart-For-McKinney-Mayor-353532622386631" target="_blank" class="underline">Charlie Philips</a></span>
							<span class="block">George info</span>
					</div>
    </div>

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
