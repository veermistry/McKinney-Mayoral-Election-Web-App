import App from './App.svelte';

var app = new App({
	target: document.body
});

window.initMap = function ready() {
	app.$set({ ready: true });
}

export default app;