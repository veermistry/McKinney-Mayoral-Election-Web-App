<script>
	// import {onMount} from 'svelte';
	import * as geolib from 'geolib';
	import locations from '../../data/locations.json';
	import Modal from '../components/modal.svelte';
	import Nav from '../components/nav.svelte'
import { } from 'node:os';

	let val_tax = 20;
	let closestLocation = "";
	let location = { latitude: 33.20484, longitude: -96.67274};
	let closestDist = 10000000000000000;
	let showModal = false;
	let showNearest = false;
	let ZIP = "";
	let Found = false;

	const toggle = async (e) => {

		let element = e.currentTarget.parentNode.querySelector('.more')
		
		if (element.getAttribute('hidden') !== null) {
			element.removeAttribute('hidden')
			element.parentNode.querySelector('button').innerHTML = 'See Less'
		} else {
			element.setAttribute('hidden', 'hidden')
			element.parentNode.querySelector('button').innerHTML = 'Read More'
		}
	}

	const setFound = (bool) => {
		Found = bool
		return '' // Prevents rendering from the inline call.
	};

	const getDistanceInMiles = (locationx) => {
        // convert meters to miles
		console.log(locationx.Latitude + " " + locationx.Longitude)
        return (0.000621371192 * geolib.getDistance(
            { latitude: locationx.Latitude, longitude: locationx.Longitude},
            {latitude: location.latitude, longitude: location.longitude }
        )).toFixed(1);
    };
	/*onMount( async () => {
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
    });*/

	const triggerNearest = () => {
		showNearest =  !showNearest;
	}

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

    /*function initMap(){
							var options = {
								zoom:9,
								center:{lat:33.1983,lng:-96.6389}
							}
						}

							var map = new 
							google.maps.Map(document.getElementById('map'), options);

							addMarker({
								coords:{lat: 33.346207, lng: -96.547211},
								content: '<small>Anna ISD Administration Building</small>'
							});
							addMarker({
								coords:{lat:33.30546, lng: -96.40425},
								content: '<small>Blue Ridge ISD Administration</small>'
							});
							addMarker({
								coords:{lat:33.32303, lng:-96.78852},
								content: '<small>Celina ISD Administration Building</small>'
							});
							addMarker({
								coords:{lat:33.21976, lng:-96.62817},
								content: '<small>Collin County Elections Office</small>'
							});
							addMarker({
								coords:{lat:33.16128, lng:-96.35975},
								content: '<small>Farmersville City Hall</small>'
							});
							addMarker({
								coords:{lat:33.28182, lng: -96.5667},
								content: '<small>First Melissa</small>'
							});
							addMarker({
								coords:{lat:33.06636, lng: -96.43309},
								content: '<small>Josephine City Hall</small>'
							});
							addMarker({
								coords:{lat:33.02636, lng:-96.56556},
								content: '<small>Lavon City Hall</small>'
							});
							addMarker({
								coords:{lat:33.21091, lng:-96.56556},
								content: '<small>New Hope Town Hall</small>'
							});
							addMarker({
								coords:{lat:33.18083, lng: -96.49537},
								content: '<small>Princeton Public Works Department</small>'
							});
							addMarker({
								coords:{lat:33.23468, lng:-96.8039},
								content: '<small>Prosper Town Hall</small>'
							});
							addMarker({
								coords:{lat:33.34722, lng:-96.66892},
								content: '<small>Weston Community Center</small>'
							});
							addMarker({
								coords:{lat:33.0038, lng: -96.53215},
								content: '<small>Wylie Senior Recreation Center</small>'
							});

							function addMarker(props){
								var marker = new google.maps.Marker({
								position:props.coords,
								map:map 
							});
							}

							if(props.iconImage){
								marker.setIcon(props.iconImage);
							}

							if(props.content){
								var infoWindow = new google.maps.infoWindow({
									content:props.content
								});

								marker.addListener('click', function(){
									infoWindow.open(map, marker);
								});
							}*/


</script>


<Modal bind:this={registerModal}/>
<main>

	<div>
        <div>
            
			<Nav/>

			<div class="page-wrapper">
				<div style="display: none" class="flex justify-center">
					<button on:click={triggerNearest}>
						<span class="text-base font-main border-b border-blue-900 sm: text">FIND LOCATION</span>
					</button>
					{#if showNearest}
						{#each locations as locationx}
							{#if getDistanceInMiles(locationx) <= closestDist}
								{assignVals(locationx)}
								{console.log(closestDist + " " + closestLocation)}
							{/if}
						{/each}}
					{/if}
				</div>
				<div style="display: none" class="my-10">
					<div id = "map">
						<script>
							function initMap(){
							   var options = {
								zoom:9,
								center:{lat:33.1983,lng:-96.6389}
								}
							}

							var map = new google.maps.Map(document.getElementById('map'), options);

							addMarker({
								coords:{lat: 33.346207, lng: -96.547211},
								content: '<small>Anna ISD Administration Building</small>'
							});
							addMarker({
								coords:{lat:33.30546, lng: -96.40425},
								content: '<small>Blue Ridge ISD Administration</small>'
							});
							addMarker({
								coords:{lat:33.32303, lng:-96.78852},
								content: '<small>Celina ISD Administration Building</small>'
							});
							addMarker({
								coords:{lat:33.21976, lng:-96.62817},  
								content: '<small>Collin County Elections Office</small>'
							});
							addMarker({
								coords:{lat:33.16128, lng:-96.35975},
								content: '<small>Farmersville City Hall</small>'
							});
							addMarker({
								coords:{lat:33.28182, lng: -96.5667},
								content: '<small>First Melissa</small>'
							});
							addMarker({
								coords:{lat:33.06636, lng: -96.43309},
								content: '<small>Josephine City Hall</small>'
							});
							addMarker({
								coords:{lat:33.02636, lng:-96.56556},
								content: '<small>Lavon City Hall</small>'
							});
							addMarker({
								coords:{lat:33.21091, lng:-96.56556},
								content: '<small>New Hope Town Hall</small>'
							});
							addMarker({
								coords:{lat:33.18083, lng: -96.49537},
								content: '<small>Princeton Public Works Department</small>'
							});
							addMarker({
								coords:{lat:33.23468, lng:-96.8039},
								content: '<small>Prosper Town Hall</small>'
							});
							addMarker({
								coords:{lat:33.34722, lng:-96.66892},
								content: '<small>Weston Community Center</small>'
							});
							addMarker({
								coords:{lat:33.0038, lng: -96.53215},
								content: '<small>Wylie Senior Recreation Center</small>'
							});

							function addMarker(props){
								var marker = new google.maps.Marker({
								position:props.coords,
								map:map 
							});
							}

							if(props.iconImage){
								marker.setIcon(props.iconImage);
							}

							if(props.content){
								var infoWindow = new google.maps.infoWindow({
									content:props.content
								});

								marker.addListener('click', function(){
									infoWindow.open(map, marker);
								});
							}
						</script>
					</div>
					<script defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDJ1Z1ZXwvhBxVWmdzGB22X5gE5VaOOwoM&callback=initMap">		
					</script>
				</div>
				<div class="w-full bg-cover bg-center" style="height:32rem; background-image: url('https://cirrusaircraft.com/wp-content/uploads/2021/04/stories-mckinney.jpg');">
					<div class="flex items-center justify-center h-full w-full bg-gray-900 bg-opacity-50">
						<div class="text-center">
							<h1 class="text-white text-2xl font-semibold uppercase md:text-3xl">McKinney County <span class="underline text-blue-400">Elections</span></h1>
							<button class="mt-4 px-4 py-2 bg-blue-600 text-white text-sm uppercase font-medium rounded hover:bg-blue-500 focus:outline-none focus:bg-blue-500">Register</button>
						</div>
					</div>
				</div>
                <div class="flex flex-wrap flex-row p-5">
					<div class="w-full md:w-2/3 p-5">
                        <div class="w-full">
							<div class="w-full text-gray-700 font-main">Location QuickSearch:</div> 
							<div class="w-full leading-tight text-gray-500">Enter your zip code to find a location near you.</div> 
							<input on:keytype={ZIP} type="text" placeholder="Insert ZIP" class="form-input mt-2 w-56 px-3 py-2 rounded shadow" bind:value={ZIP}>
								{#if ZIP.length === 5}
									{#each locations as location}
										{#if ZIP == location.Zip}
											<span class="block p-2">
												<a href={location.MapsLink} target="_blank">Location: <u>{location.Name}, {location.Room}</u></a>
											</span>
											{ setFound(true) }
										{/if}
									{/each}
									{#if ZIP.length === 5 && !Found}
										<span class="block p-2">
											Sorry. No locations found for the Zip code provided.
										</span>
									{/if}
								{:else}
								<span class="block p-2">
									Zip code is not valid.
								</span>
								{/if}
							<h2 class="mt-3 w-full text-black font-bold text-lg">What Election?</h2> 
							<div class="w-full justify-center items-center">On May 1st, 2021, voters in McKinney will elect representatives for these positions in City Council:
								<ul class="mt-3">
									<li>Mayor</li> 
									<li>District 1</li> 
									<li>District 3</li> 
									<li>At Large 1</li>
								</ul>
							</div>
						</div>
					</div>
                    <div class="w-full md:w-1/3 p-5">
                        <h1>All Voting Locations & Rooms</h1>
						<small class="w-full leading-tight text-gray-500">
							Click on the name of the location to get directions.
						</small>
                        <div style="max-height: 250px; overflow-y: scroll;">
							<table class="table-auto w-full">
								<thead>
									<tr>
										<th class="text-left">Location</th>
										<th class="text-left">Room</th>
									</tr>
								</thead>
								<tbody>
									{#each locations as location}
										<tr>
											<td class="p-3 border border-color-gray-500 underline"><a href={location.MapsLink}>{location.Name}</a></td>
											<td class="p-3 border border-color-gray-500">{location.Room}</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
                    </div>
				</div>
        	</div>
            <div class="page-wrapper p-5 flex flex-row flex-wrap">

				<div class="w-full text-2xl mb-3 px-5">Mayoral Candidates<br><small>Click on their names to go to their webpages.</small></div>
				
				<div class="w-full md:w-1/2 flex flex-wrap flex-row items-center content-center">
					<div class="w-full md:w-1/5 p-5">
						<img src="img/George_Fuller.jpeg" alt="George Fuller" class="rounded-lg">
					</div>
					<div class="w-full md:w-4/5 p-5">
						<span class=" font-bold text-center mx-2" >
							<a href="https://www.mckinneytexas.org/1167/Council-Members#Biographies" target="_blank" class="underline">George Fuller</a>
						</span>
						<span class="block leading-tight mx-3">
							George Fuller is the current mayor of McKinney and was elected in May 2017. 
							He is an award-winning property builder and partakes in many other ventures, 
							including Body Quest Inc.– an exercise equipment company– as well as currently 
							owning the Guitar Sanctuary on Virginia by Adriatica, where he is a managing 
							construction partner as well. 
							Fuller is also President of the Stonebridge Ranch Commercial Association, 
							Board Director for Meals on Wheels, and co-founded the non-profit Love Life 
							Foundation with his wife Maylee, in which they bring awareness to tragedies 
							against children and work to raise awareness for support organizations. 
						</span>
					</div>
				</div>

				<div class="w-full md:w-1/2 flex flex-wrap flex-row items-center content-center">
					<div class="w-full md:w-1/5 p-5">
						<img src="img/Thomas_Meredith.jpeg" alt="Thomas_Meredith" class="rounded-lg">
					</div>
					<div class="w-full md:w-4/5 p-5">
						<span class=" font-bold text-center mx-2" >
							<a href="https://www.facebook.com/Meredith-For-McKinney-104874304725724" target="_blank" class="underline">Thomas Meredith</a>
						</span>
						<span class="block leading-tight mx-3">
							Thomas Meredith is a small business owner and active citizen & participant in local politics. 
							He and his wife have owned and managed The Pantry restaurant in downtown McKinney for the past 
							20 years, which was recognized for Outstanding Small Business twice. 
							Tom has worked with fellow McKinney business owners to propose such-minded policies to 
							the McKinney municipal government, including implementing 3 hour parking downtown and adding 
							lights in the parking as well. 
							Tom has been involved in local elections for many years, has been on the City of McKinney bond &
							McKinney Census Community in 2010, and was Vice President & Treasurer of the Property Owners 
							organization from 2003–2009. Tom is a father and is married to Cleo Meredith. 
						</span>
					</div>
				</div>

				<div class="w-full p-5"> 
					<p class="text-xl">
						Incumbent Mayor Fuller notable achievements & occurrences:
					</p>
					<p class="block text-base"> 
						• 2021 was the first year for McKinney to have no-new-revenue tax rate in recent history.
						<br> • McKinney recieved a Cultural District Designation from the Texas Commission on the Arts.
						<br> • McKinney also recieved designation as a 'Texas Music Friendly Community' from the state government.
						<br> • Amazon & Raytheon expanded in McKinney greatly.
						<br> • First public parking garage was built in Downtown McKinney.
						<br> • Independent Financial headquarters are being built in McKinney.
						<br> • Turned the McKinney National Airport profitable while eliminating it's subsidies
						<br> • Began construction of a new FBO Terminal at the airport.
					</p>
				</div>
				<!--<div class="p-6 text-3xl text-center">
					{val_tax} 
				</div>
				<Slider style="display: none" class="mt-5 mx-6" max={100} bind:val_tax/>-->

				<div class="w-full text-2xl my-3 mb-2 px-5">District 1 Candidates<br><small>Click on their names to go to their webpages.</small></div>
				<div class="w-full flex flex-wrap flex-row p-2">
					<div class="w-full md:w-1/2 lg:w-1/5 p-2">
						<div class="font-bold text-left">
							<a href="https://www.facebook.com/Cris-Trevino-for-McKinney-D1-City-Council-109026511061328/?ref=page_internal" target="_blank" class="underline">
								Cristoval (Cris) Treviño
							</a>
						</div>
						Cris Treviño is a born-and-raised McKinney citizen who has worked in law enforcement for the past 19 years. 
						He grew up in District 1, and has been involved in the community for years...
						<span class="more" hidden="hidden">
							Cris looks to add a Neighborhood Walmart & pharmacy, more banking services, a mini postal location, and create shuttles to McKinney medical services.
							Cris also plans on creating a District 1 business assocation, for business owners in the district to discuss issues and work towards mutual success.
						</span>
						<button type="button" class="font-small font-bold w-full mt-2 text-left" on:click="{toggle}">Read More</button>
					</div>
					<div class="w-full md:w-1/2 lg:w-1/5 p-2">
						<div class="font-bold text-left">
							<a href="https://www.facebook.com/Moore.Johnny12/" target="_blank" class="underline">
								Johnny Moore
							</a>
						</div>
						Johnny Moore is a high school counselor and has coached high school football & track for 13 years. 
						Johnny prioritizes the future leaders of McKinney, as looks to work in collaboration with...
						<span class="more m-0" hidden="hidden">
							Collin College to subsidize tuition costs.
							Johnny is married and has a daughter who have lived in McKinney for many years.
						</span>
						<button type="button" class="font-small font-bold w-full mt-2 text-left" on:click="{toggle}">Read More</button>
					</div>
					<div class="w-full md:w-1/2 lg:w-1/5 p-2">
						<div class="font-bold text-left">
							<a href="https://votebeller.com/" target="_blank" class="underline">
								Justin Beller
							</a>
						</div>
						Justin Beller is a community banker and active citizen & participant in the community.
						He is and has been involved in many community organizations, serving on the board of the Holy Family School in 2011...
						<span class="more m-0" hidden="hidden">
							, and was appointed by the city government to serve on the McKinney Housing Authority Board for 6 years, redeveloping Newsome and Merritt homes.
							During his membership on the housing board, Justin started a group for young men called McKinney Force, building relationships & community with District 1 residents, with an emphasis on civic duty and empowerment. 
							Justin has also served on the Chamber of Commerce Board, and was recognized as the leadership alumni of the year. 
						</span>
						<button type="button" class="font-small font-bold w-full mt-2 text-left" on:click="{toggle}">Read More</button>
					</div>
					<div class="w-full md:w-1/2 lg:w-1/5 p-2">
						<div class="font-bold text-left">
							<a href="https://www.facebook.com/Jimmy-Stewart-For-McKinney-Mayor-353532622386631" target="_blank" class="underline">
								Stanley Penn
							</a>
						</div>
						Some placeholder content...
						<span class="more m-0" hidden="hidden">
							Some hidden placeholder content
						</span>
						<button type="button" class="font-small font-bold w-full mt-2 text-left" on:click="{toggle}">Read More</button>
					</div>
					<div class="w-full md:w-1/2 lg:w-1/5 p-2">
						<div class="font-bold text-left">
							<a href="https://www.facebook.com/Jimmy-Stewart-For-McKinney-Mayor-353532622386631" target="_blank" class="underline">
								Thomas Tolan
							</a>
						</div>
						Some placeholder content...
						<span class="more m-0" hidden="hidden">
							some hidden placeholder content
						</span>
						<button type="button" class="font-small font-bold w-full mt-2 text-left" on:click="{toggle}">Read More</button>
					</div>
				</div>

				<div class="w-full text-2xl my-5 mb-2 px-5">District 3 Candidates<br><small>Click on their names to go to their webpages.</small></div>
				<div class="w-full flex flex-wrap flex-row p-2">
					<div class="w-full md:w-1/2 lg:w-1/5 p-2">
						<div class="font-bold text-left">
							<a href="https://www.facebook.com/Jimmy-Stewart-For-McKinney-Mayor-353532622386631" target="_blank" class="underline">
								Gere' Feltus
							</a>
						</div>
						Some placeholder content...
						<span class="more m-0" hidden="hidden">
							Some hidden placeholder content
						</span>
						<button type="button" class="font-small font-bold w-full mt-2 text-left" on:click="{toggle}">Read More</button>
					</div>
					<div class="w-full md:w-1/2 lg:w-1/5 p-2">
						<div class="font-bold text-left">
							<a href="https://www.facebook.com/Jimmy-Stewart-For-McKinney-Mayor-353532622386631" target="_blank" class="underline">
								Vicente Torres
							</a>
						</div>
						Some placeholder content...
						<span class="more m-0" hidden="hidden">
							some hidden placeholder content
						</span>
						<button type="button" class="font-small font-bold w-full mt-2 text-left" on:click="{toggle}">Read More</button>
					</div>
				</div>

				<div class="w-full text-2xl my-5 mb-2 px-5">At Large 1 Candidates<br><small>Click on their names to go to their webpages.</small></div>
				<div class="w-full flex flex-wrap flex-row p-2">
					<div class="w-full md:w-1/2 lg:w-1/5 p-2">
						<div class="font-bold text-left">
							<a href="https://www.facebook.com/Jimmy-Stewart-For-McKinney-Mayor-353532622386631" target="_blank" class="underline">
								Brian J. Magnuson
							</a>
						</div>
						Some placeholder content...
						<span class="more m-0" hidden="hidden">
							Some hidden placeholder content
						</span>
						<button type="button" class="font-small font-bold w-full mt-2 text-left" on:click="{toggle}">Read More</button>
					</div>
					<div class="w-full md:w-1/2 lg:w-1/5 p-2">
						<div class="font-bold text-left">
							<a href="https://www.facebook.com/Jimmy-Stewart-For-McKinney-Mayor-353532622386631" target="_blank" class="underline">
								Charlie Philips
							</a>
						</div>
						Some placeholder content...
						<span class="more m-0" hidden="hidden">
							some hidden placeholder content
						</span>
						<button type="button" class="font-small font-bold w-full mt-2 text-left" on:click="{toggle}">Read More</button>
					</div>
				</div>

			</div>
		</div>
	</div>
</main>

<style global>

	main {
		max-width: 100vw;
		overflow-x: hidden;
	}

	.page-wrapper {
		max-width: 1920px;
		margin-left: auto;
		margin-right: auto;
	}
</style>

