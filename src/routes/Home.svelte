<script>
	import {onMount} from 'svelte';

	import * as geolib from 'geolib';

	import * as navigator from 'navigator';

	import Modal from './modal.svelte';

    import visible from './modal.svelte';

	import Slider from '@fouita/slider';

	let val_tax = 20;

	let markerbase = 0;

	import locations from './locations.json';
	(`running version ${locations.length}`);

	let closestLocation = "";

	let location = { latitude: 33.20484, longitude: -96.67274};

	const getDistanceInMiles = (locationx) => {
        // convert meters to miles
		console.log(locationx.Latitude + " " + locationx.Longitude)
        return (0.000621371192 * geolib.getDistance(
            { latitude: locationx.Latitude, longitude: locationx.Longitude},
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

    let registerModal;

    let colorcount = 0;

</script>

<Modal bind:this={registerModal}/>
<main>

	<div>
        <div>
            <nav>
                <div class = "shadow-md">
                    <h1 class="font-main p-4 text-black bg-gray-50">
                        <a href="/" class="text-md sm:text-xl">McKinney 2021 General Election</a>
                    </h1>
                </div>
				<ul class="flex items-start px-10 pb-10 justify-center w-full">
                    <li class="text-gray-400 font-main uppercase mt-12 ">
                        <a href="/">
                            <span class="font-main text-base text-blue-800 border-b border-blue-900 m-7">HOME</span>
                        </a>
                    </li>
                    <li id = "Register" class="text-gray-400 font-main uppercase mt-12">
						<button on:click={registerModal.show}>
							<span class="text-base font-main border-b border-blue-900 sm: text">REGISTER</span>
						</button>
                    </li>
                    <li class="text-gray-400 font-main uppercase mt-12">
                        <a href="/news">
                            <span class="text-base font-main m-7 border-b border-blue-900 sm: text">News</span>
                        </a>
                    </li>
                </ul>
				<div class = "flex justify-center">
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
				<div class="my-10">
					<div id = "map"></div>
					<script>
						function initMap(){
							var options = {
								zoom:10,
								center:{lat:33.1983,lng:-96.6389}
							}

							var map = new 
							google.maps.Map(document.getElementById('map'), options);

							addMarker({coords:{lat: 33.346207, lng: -96.547211}});

							function addMarker(props){
								var marker = new google.maps.Marker({
								position:props.coords,
								map:map 
							});
							}
							/*marker1 = new google.maps.Marker({
								position:{lat: 33.346207, lng: -96.547211},
								map:map
							});
							var infoWindow = new google.maps.InfoWindow({
								content: '<a href={locations.MapsLink}></a>'
							});
							marker1.addListener('click', function)
							marker2 = new google.maps.Marker({
								position:{lat:33.30546, lng: -96.40425},
								map:map
							});
							

							marker3 = new google.maps.Marker({
								position:{lat:33.32303, lng:-96.78852},
								map:map
							});
							

							marker4 = new google.maps.Marker({
								position:{lat:33.32303, lng:-96.78852},
								map:map
							});
							
							marker5 = new google.maps.Marker({
								position:{lat:33.16128,lng:-96.35975},
								map:map
							});*/

						}
					</script>
					<script
      				src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDJ1Z1ZXwvhBxVWmdzGB22X5gE5VaOOwoM&callback=initMap&libraries=&v=weekly"
      				async
    >				</script>
				</div>
                <div class="grid mx-5 md:grid-cols-3">
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
                    <div class="block mx-3">
                        <h1>All Voting Locations & Rooms</h1>
                        <div class=" w-2/3 h-44 overflow-scroll shadow-inner">
                            <table class="table-auto">
								<thead>
									<tr class = "text-sm">
											Click on the name of the location to get directions.
									</tr>
								</thead>
                                <tbody>
                                    {#each locations as location}
                                        <tr>
                                            <td class="mx-3 border border-color-gray-500 bg-color-gray-500 underline"><a href={location.MapsLink}>{location.Name}, </a></td>
                                            <td class="mx-3 border border-color-gray-500">{location.Room}</td>
                                        </tr>
                                    {/each}
                                </tbody>
                            </table>
                        </div>
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
					<div class="bg-gray-200 shadow-md rounded-lg overflow-hidden">
						<img src="img/George_Fuller.jpeg" alt="George Fuller" class="w-full h-60 object-cover content-center shadow-md">
						<div>
							<span class=" font-bold text-center mx-2" > Current Mayor: <a href="https://www.mckinneytexas.org/1167/Council-Members#Biographies" target="_blank" class="underline">George Fuller</a> </span>
							<span class="block leading-tight mx-3">George Fuller is the current mayor of McKinney and was elected in May 2017. 
                                He is an award-winning property builder and partakes in many other ventures, including Body Quest Inc.– an exercise equipment company– as well as currently owning the Guitar Sanctuary on Virginia by Adriatica, where he is a managing construction partner as well. 
                                Fuller is also President of the Stonebridge Ranch Commercial Association, Board Director for Meals on Wheels, and co-founded the non-profit Love Life Foundation with his wife Maylee, in which they bring awareness to tragedies against children and work to raise awareness for support organizations. </span>
						</div>
					</div>
					<div class="bg-gray-200 rounded-lg overflow-hidden shadow-xl">
						<img src="img/Jimmy_Stewart.jpeg" alt="Jimmy Stewart" class="w-full h-60 object-cover content-center shadow-md">
						<div>
							<span class=" font-bold text-center mx-2" ><a href="https://www.facebook.com/Jimmy-Stewart-For-McKinney-Mayor-353532622386631" target="_blank" class="underline">Jimmy Stewart</a></span>
							<span class="block leading-tight mx-3">George info</span>
						</div>
					</div>
					<div class="bg-gray-200 rounded-lg overflow-hidden shadow-xl">
						<img src="img/Thomas_Meredith.jpeg" alt="Thomas_Meredith" class="w-full h-60 object-cover content-center shadow-md">
						<div>
							<span class="font-bold text-center mx-2" > <a href="https://www.facebook.com/Meredith-For-McKinney-104874304725724" target="_blank" class="underline">Thomas Meredith</a> </span>
							<span class="block leading-tight mx-3">George info</span>
						</div>
					</div>
				</div>
				<div class="p-6 text-3xl text-center">
					{val_tax} 
				</div>
				<Slider class="mt-5 mx-6" max={100} bind:val_tax/>
				<div class="ml-4 mt-10">
						<p> 
							District 1 Candidates: 
							<small class="text-gray-500 my-10">Click on their names to go to their webpages.</small>
						</p>
				</div>
				<div class="grid grid-rows-3 grid-cols-2 lg:grid-cols-5 lg:grid-rows-1 rounded-md overflow-hidden gap-5 px-5">
					<div class="bg-gray-200 shadow-xl rounded-md">
						<span class=" font-bold text-center mx-2" ><a href="https://www.facebook.com/Jimmy-Stewart-For-McKinney-Mayor-353532622386631" target="_blank" class="underline">Cristoval (Cris) Treviño</a></span>
							<span class="block leading-tight mx-3">George info</span>
					</div>
					<div class="bg-gray-200 shadow-xl rounded-md">
						<span class=" font-bold text-center mx-2" ><a href="https://www.facebook.com/Jimmy-Stewart-For-McKinney-Mayor-353532622386631" target="_blank" class="underline">Johnny Moore</a></span>
							<span class="block leading-tight mx-3">George info</span>
					</div>
					<div class="bg-gray-200 shadow-xl rounded-md">
						<span class=" font-bold text-center mx-2" ><a href="https://www.facebook.com/Jimmy-Stewart-For-McKinney-Mayor-353532622386631" target="_blank" class="underline">Justin Beller</a></span>
							<span class="block leading-tight mx-3">George info</span>
					</div>
					<div class="bg-gray-200 shadow-xl rounded-md">
						<span class=" font-bold text-center mx-2" ><a href="https://www.facebook.com/Jimmy-Stewart-For-McKinney-Mayor-353532622386631" target="_blank" class="underline">Stanley Penn</a></span>
							<span class="block leading-tight mx-3">George info</span>
					</div>
					<div class="bg-gray-200 shadow-xl rounded-md">
						<span class=" font-bold text-center mx-2" ><a href="https://www.facebook.com/Jimmy-Stewart-For-McKinney-Mayor-353532622386631" target="_blank" class="underline">Thomas Tolan</a></span>
							<span class="block leading-tight mx-3">George info</span>
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
					<div class="bg-gray-200 shadow-xl rounded-md">
						<span class=" font-bold text-center mx-2" ><a href="https://www.facebook.com/Jimmy-Stewart-For-McKinney-Mayor-353532622386631" target="_blank" class="underline">Gere' Feltus</a></span>
							<span class="block leading-tight mx-3">George info</span>
					</div>
					<div class="bg-gray-200 shadow-xl rounded-md">
						<span class=" font-bold text-center mx-2" ><a href="https://www.facebook.com/Jimmy-Stewart-For-McKinney-Mayor-353532622386631" target="_blank" class="underline">Vicente Torres</a></span>
							<span class="block  leading-tight mx-3">George info</span>
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
					<div class="bg-gray-200 shadow-xl rounded-md">
						<span class=" font-bold text-center mx-2" ><a href="https://www.facebook.com/Jimmy-Stewart-For-McKinney-Mayor-353532622386631" target="_blank" class="underline">Brian J. Magnuson</a></span>
							<span class="block leading-tight mx-3">George info</span>
					</div>
					<div class="bg-gray-200 shadow-xl rounded-md">
						<span class=" font-bold text-center mx-2" >Current Officeholder <a href="https://www.facebook.com/Jimmy-Stewart-For-McKinney-Mayor-353532622386631" target="_blank" class="underline">Charlie Philips</a></span>
							<span class="block l eading-tight mx-3">George info</span>
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

		#map{
			height:400px;
			width:100%;
		}
    </style>
</svelte:head>


<style global lang="postcss">
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>
