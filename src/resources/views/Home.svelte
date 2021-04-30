<script>
	import {onMount} from 'svelte';
	import * as geolib from 'geolib';
	import locations from '../../data/locations.json';
	import Modal from '../components/modal.svelte';
	import Nav from '../components/nav.svelte'
	import { } from 'node:os';

	let val_tax = 20;
  $: closestLocation = locations[2];
  let currentPosition = { latitude: 0.000, longitude: 0.000};
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

  function getDistanceInMiles(targetPosition) {
    // calculate distance and convert to miles
    var distanceInMeters = geolib.getDistance(targetPosition, currentPosition);
    var distanceInMiles = distanceInMeters * 0.000621371192;
    return distanceInMiles.toFixed(1);
  };

  function onLoadCurrentPosition(pos) {
    currentPosition = pos.coords;
    closestLocation = getClosestLocation();
  }

  function onErrorLoadingCurrentPosition(err) {
    console.warn("Position could not be determined -- will use McKinney center coordinates instead");
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  function getClosestLocation() {
    let closestLocation = locations[0]
    let shortestDistance = 100000000000000000000000
    for(let i = 0; i < locations.length; ++i) {
        let distance = geolib.getDistance(currentPosition,
		{latitude: locations[i].Latitude, longitude: locations[i].Longitude})
        if(distance < shortestDistance) {
            shortestDistance = distance
            closestLocation = locations[i]
        }
    }
    return closestLocation
  }
	const triggerNearest = () => {
		showNearest =  !showNearest;
	}




	const assignVals = (locationx) => {
		closestLocation = locationx.Name;
		closestDist = getDistanceInMiles(locationx);
	}

    let registerModal;

  onMount(async () => {
    navigator.geolocation.getCurrentPosition(onLoadCurrentPosition, onErrorLoadingCurrentPosition);
  });

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
							<h1 class="text-white text-2xl font-semibold uppercase md:text-3xl">McKinney General <span class="underline text-blue-400">Election</span></h1>
							<button class="mt-4 px-4 py-2 bg-blue-600 text-white text-sm uppercase font-medium rounded hover:bg-blue-500 focus:outline-none focus:bg-blue-500"><a href = "/register">Register</a></button>
						</div>
					</div>
				</div>
				<!--div style="display: none" class="justify-center">
					<button on:click={triggerNearest}>
						<span class="text-base font-main border-b border-blue-900 sm: text">FIND LOCATION</span>
					</button>
					{#if showNearest}
						{#each locations as locationx}
							{#if getDistanceInMiles(locationx) <= closestDist}
								assignVals(locationx)
								console.log(closestDist + " " + closestLocation)
							{/if}
						{/each}}
						<p> </p>
					{/if}
				</div-->
                <div class="flex flex-wrap flex-row p-5">
					<div class="w-full md:w-2/3 p-5">
                        <div class="w-full">
							<h1 class = "text-xl"><b>Your Nearest Location: 
							</b><a href = {getClosestLocation().MapsLink} class="underline text-purple-800">{getClosestLocation().Name}, {getClosestLocation().Room} </a></h1>
							<div class="w-full text-gray-700 font-main block">Location QuickSearch:</div> 
							<div class="w-full leading-tight text-gray-500">Enter your zip code to find a location near you.</div> 
							<input on:keytype={ZIP} type="text" placeholder="Insert ZIP" class="form-input mt-2 w-56 px-3 py-2 rounded border-2 md:border-none md:shadow" bind:value={ZIP}>
								{#if ZIP.length === 5}
									{#each locations as location}
										{#if ZIP == location.Zip}
											<span class="block p-2">
												<a href={location.MapsLink} target="_blank">Location: <u class = "text-purple-800">{location.Name}, {location.Room}</u></a>
											</span>
											{ setFound(true) }
										{/if}
									{/each}
									{#if ZIP.length === 5 && !Found}
										<span class="block p-2 text-red-300">
											Sorry. No locations found for the ZIP code provided.
										</span>
									{/if}
								{:else}
								<span class="block p-2 text-red-300">
									ZIP code is not valid.
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
								<br> As is the case every year, the main issues of the election consist of taxes & city planning, due to the consistent growth in population that McKinney has had.
								<br>
								<br> However, the state of Texas itself has experienced quite a unique year, not only due to COVID-19, but also because of the ice storm Texas had faced in February of this year. 
								Thus, the support of small business will be an elemental issue of this election, as they recover from the pandemic this year as well as expenses from the storm.
								<br>
								<br> As the city continues to discuss more of development on the east side of McKinney, the residents have asked for a say in the development. Thus, as District 1 encompasses much of the area, the question of whether their voices will be heard has an important role in the district's race, and in the rest of the general election as well.
							</div>
						</div>
					</div>
                    <div class="w-full md:w-1/3 p-5">
                        <h1>All Voting Locations & Rooms</h1>
						<small class="w-full leading-tight text-gray-500">
							Click on the name of the location to get directions.
						</small>
                        <div style="max-height: 250px; overflow-y: scroll;">
							<table class="table-auto w-full shadow-inner">
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

				<div class="w-full text-2xl mb-3 px-5">Mayoral Candidates<br><small class="text-gray-500">Click on their names to go to their webpages.</small></div>
				
				<div class="w-full md:w-1/2 flex flex-wrap flex-row items-center content-center">
					<div class="w-full md:w-1/5 p-5">
						<img src="img/George_Fuller.jpeg" alt="George Fuller" class="rounded-lg">
					</div>
					<div class="w-full md:w-4/5 p-5">
						<span class=" font-bold text-center mx-2" >
							<a href="https://www.mckinneytexas.org/1167/Council-Members#Biographies" target="_blank" class="underline text-purple-800">George Fuller</a>
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
						<img src="img/Thomas_Meredith.jpg" alt="Thomas_Meredith" class="rounded-lg">
					</div>
					<div class="w-full md:w-4/5 p-5">
						<span class=" font-bold text-center mx-2" >
							<a href="https://www.facebook.com/Meredith-For-McKinney-104874304725724" target="_blank" class="underline text-purple-800">Thomas Meredith</a>
						</span>
						<span class="block leading-tight mx-3">
							Thomas Meredith is a small business owner and active citizen & participant in local politics. 
							He and his wife have owned and managed The Pantry restaurant in downtown McKinney for the past 
							20 years. 
							Tom has worked with fellow McKinney business owners to propose such-minded policies to 
							the McKinney municipal government, such as implementing 3 hour parking downtown. 
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
					<p class="block text-base text-gray-500"> 
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

				<div class="w-full text-2xl my-3 mb-2 px-5">District 1 Candidates<br><small class="text-gray-500">Click on their names to go to their webpages.</small></div>
				<div class="w-full flex flex-wrap flex-row p-2">
					<div class="w-full md:w-1/2 lg:w-1/5 p-2 mx-3">
						<div class="font-bold text-left">
							<a href="https://www.facebook.com/Cris-Trevino-for-McKinney-D1-City-Council-109026511061328/?ref=page_internal" target="_blank" class="underline text-purple-800">
								Cristoval (Cris) Treviño
							</a>
						</div>
						Cris Treviño is a born-and-raised McKinney citizen who has worked in law enforcement for the past 19 years. 
						He grew up in District 1, and has been involved in the community for years...
						<span class="more" hidden="hidden">
							Cris looks to add a Neighborhood Walmart & pharmacy, more banking services, a mini postal location, and create shuttles to McKinney medical services.
							Cris also plans on creating a District 1 business assocation, for business owners in the district to discuss issues and work towards mutual success.
						</span>
						<button type="button" class="font-small font-bold w-full mt-2 text-left text-gray-500" on:click="{toggle}">Read More</button>
					</div>
					<div class="w-full md:w-1/2 lg:w-1/5 p-2 mx-3">
						<div class="font-bold text-left">
							<a href="https://www.facebook.com/Moore.Johnny12/" target="_blank" class="underline text-purple-800">
								Johnny Moore
							</a>
						</div>
						Johnny Moore is a high school counselor and has coached high school football & track for 13 years. 
						Johnny prioritizes the future leaders of McKinney, as looks to work in collaboration with...
						<span class="more m-0" hidden="hidden">
							Collin College to subsidize tuition costs.
							Johnny is married and has a daughter who have lived in McKinney for many years.
						</span>
						<button type="button" class="font-small font-bold w-full mt-2 text-left text-gray-500" on:click="{toggle}">Read More</button>
					</div>
					<div class="w-full md:w-1/2 lg:w-1/5 p-2 mx-3">
						<div class="font-bold text-left">
							<a href="https://votebeller.com/" target="_blank" class="underline text-purple-800">
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
						<button type="button" class="font-small font-bold w-full mt-2 text-left text-gray-500" on:click="{toggle}">Read More</button>
					</div>
					<div class="w-full md:w-1/2 lg:w-1/5 p-2 mx-3">
						<div class="font-bold text-left">
							<a href="https://www.pennformckinney.org" target="_blank" class="underline text-purple-800">
								Stanley Penn
							</a>
						</div>
						Stan Penn is the current owner of The Celt Irish Pub in downtown McKinney, and former banker. 
						Stan has served as Chamber board member and Finance Committee chairman... 
						<span class="more m-0" hidden="hidden">
							, and has participated in many community organizations, such as board member of Chestnut Square. Penn looks to grow the commercial tax base in order to compensate for the city's population growth.
							He also wishes to preserve greenery/open land while continuing to fund parks, and maintain proportional funding for public services, including police, EMS, & the Fire department.
						</span>
						<button type="button" class="font-small font-bold w-full mt-2 text-left text-gray-500" on:click="{toggle}">Read More</button>
					</div>
				</div>

				<div class="w-full text-2xl my-5 mb-2 px-5">District 3 Candidates<br><small class="text-gray-500">Click on their names to go to their webpages.</small></div>
				<div class="w-full flex flex-wrap flex-row p-2">
					<div class="w-full md:w-1/2 lg:w-1/5 p-2">
						<div class="font-bold text-left">
							<a href="https://www.feltus4mckinney.com/" target="_blank" class="underline text-purple-800">
								Gere' Feltus
							</a>
						</div>
						Dr. Geré Feltus is a certified family physician, native to North Texas, and active citizen.
						Dr. Feltus developed a focus in her practice on the promotion of healthy lifestyles through faith-based settings
						, partnering with local churches to target cardiovascular disease...
						<span class="more m-0" hidden="hidden">
							, partnering with local churches to target cardiovascular disease, diabetes, & mental health disorders. 
							She has also served as a board member of the American Heart Association. 
							Dr. Feltus prioritizes increasing employment by bringing in forward-thinking businesses, along with investment in education.
							Feltus looks to diversity housing to accomodate for the various demographics entering the city, and looks to expand local programs that support small businesses.
						</span>
						<button type="button" class="font-small font-bold w-full mt-2 text-left text-gray-500" on:click="{toggle}">Read More</button>
					</div>
					<div class="w-full md:w-1/2 lg:w-1/5 p-2">
						<div class="font-bold text-left">
							<a href="https://www.torresformckinney.com/" target="_blank" class="underline text-purple-800">
								Vicente Torres
							</a>
						</div>
						Vicente Torres is an active citizen and long-time resident in North Texas.
						Vicente has a degree in Public Affairs from the University of Texas at Dallas and is involved in his community in various aspects.
						He believes in creating a business-friendly environment in McKinney, in order to bring in various types of commerce to the city...
						<span class="more m-0" hidden="hidden">
							, from small businesses to larger companies, in order to generate higher tax revenue. 
							Vicente also wishes to conduct city planning by maintaining McKinney's "unique by nature" motto while expanding to accomodate for the influx in population.
							Transparency is an important quality to Vicente, as he looks to adhere to the Texas government code of open meetings.
						</span>
						<button type="button" class="font-small font-bold w-full mt-2 text-left text-gray-500" on:click="{toggle}">Read More</button>
					</div>
				</div>

				<div class="w-full text-2xl my-5 mb-2 px-5">At Large 1 Candidates<br><small class = "text-gray-500">Click on their names to go to their webpages.</small></div>
				<div class="w-full flex flex-wrap flex-row p-2">
					<div class="w-full md:w-1/2 lg:w-1/5 p-2">
						<div class="font-bold text-left">
							<a href="https://www.facebook.com/BrianjmagnusonMckinneyAtLarge1/?ref=page_internal" target="_blank" class="underline text-purple-800">
								Brian J. Magnuson
							</a>
						</div>
						Brian Magnuson is a disabled veteran, artist, & art teacher, as well as an active member of the community.
						Brian looks to create an environment that caters to businesses in McKinney while maintaining nature in the city.
						He is an advocate for...
						<span class="more m-0" hidden="hidden">
							small governance, where the government is more focused on holistic improvement rather than growth, while preserving his essentials of government, which include teachers, police, & fire department.
						</span>
						<button type="button" class="font-small font-bold w-full mt-2 text-left text-gray-500" on:click="{toggle}">Read More</button>
					</div>
					<div class="w-full md:w-1/2 lg:w-1/5 p-2">
						<div class="font-bold text-left">
							<a href="https://www.facebook.com/Jimmy-Stewart-For-McKinney-Mayor-353532622386631" target="_blank" class="underline text-purple-800">
								Charlie Philips
							</a>
						</div>
						Charlie Philips is the incumbent officeholder of the At Large 1 position, and is a Senior Partner of Philips & Epperson Attorneys L.P. 
						Charlie has been active in the community in many different ways over the years, ranging from being the Founder of the Collin County Teen Court Scholarship Fund to participating...
						<span class="more m-0" hidden="hidden">
							in the McKinney ISD Special Olympics. 
							In his past term, Philips has worked to reduce property tax rate every year in office, increase commercial growth by 70%, increase profitability of McKinney National Airport, increase corporate growth, and various other
							achievements. Philips prioritizes reducing costs of housing in order to sustain the influx in population, as well as bringing in more employers for the incoming population.
							Charlie looks to continue the no new revenue budget as it was last year, and looks to decrease residential taxes as commercial growth continues.
						</span>
						<button type="button" class="font-small font-bold w-full mt-2 text-left text-gray-500" on:click="{toggle}">Read More</button>
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
<!--test old state-->
