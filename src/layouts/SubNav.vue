<template>

	<div :id="`${ subnav_name }`" :class="`subnav ${this.category}`">
		<div class="content_subnav">
			<div class="content_subnav_item" 
						v-for="item in nav_data" 
						:key="item.subnav_title">
				<div class="subnav_title" @click="click_subNav($event.target, subnav_name, item.dom_id_content)">{{item.subnav_title}}</div>
			</div>
		</div>

		<div class="subnav_stick_row">
			<div class="subnav_stick"></div>
		</div>
	</div>

</template>

<style scoped>
	@import'~@/assets/css/Nav.css';
</style>

<script>
	import EventEmitter from 'events';
	import KUTE from 'kute.js';

	export default {
		props: [
			'subnav_name',
			'event_type',
			'nav_data'
		],
		data() {
			return {
				/* set these refs to make coding a little easier for EVENT mgmt */
				EVENTS:this.$root.sl_port.EVENTS,
				ee:this.$root.sl_port.ee,
				root:this.$root,
				firstLoad:true,
				category:"subnav_"
			}
		},
		mounted() {

			//DOM - grab first nav item
			let elem = document.querySelector("#"+this.subnav_name).querySelectorAll(".content_subnav_item")[0].firstChild;

			//console.dir(this.nav_data[0]);

			//simulate a click for init
			this.click_subNav(elem,this.subnav_name,this.nav_data[0].dom_id_content);

			//listen for main nav click
			this.ee.on(this.EVENTS.CLICK_NAV,this.event_mainNavClick);

		},
		methods: {

			event_mainNavClick(e,str_navCategory) {

				//console.log("event_mainNavClick() - str_navCategory: " + str_navCategory);

				this.category = "subnav_"+str_navCategory;

				//console.dir(this.category);

				let elem = document.querySelector("#"+this.subnav_name).querySelectorAll(".content_subnav_item")[0].firstChild;

				this.click_subNav(elem,this.subnav_name,this.nav_data[0].dom_id_content);

			},
			/*
			* Used for a Nav item click
			*	@e - the DOM event.target
			* @event_dom_key - is a reference of prop: subnav_name
			*/
			click_subNav(e, in_subnav_name, in_dom_id_content){

				/* console.log("SUBNAV - click_subNav() - " + this.subnav_name);
				console.log("- in_subnav_name: " + in_subnav_name);
				console.log("- in_dom_id_content: " + in_dom_id_content); */

				//this.$router.push("/portfolio/"+str_skillGroup+"/skillset");

				//EVENT - tell everyone listening a subnav tab has been clicked
				this.ee.emit(this.EVENTS.CLICK_SUBNAV,in_subnav_name, in_dom_id_content); 

				//INT - measure where the pipe needs to animate over to
				let left = e.offsetLeft*.95;

				//DOM - select all other tabs
				let elem_allTabs = this.$el.querySelectorAll(".subnav_title");
				//let elem_allTabs = this.$el;

				//console.dir(elem_allTabs);

				//CSS - turn all off active on all tabs
				for (let i=0;i<elem_allTabs.length;i++) {
					elem_allTabs[i].classList.remove('subnav_active');
				}

				//CSS - turn on right one
				e.classList.add("subnav_active");

				//DOM - get the subnav_stick
				let this_nav_stick = this.$el.querySelector(".subnav_stick");

				//ANIMATE - subnav stick move
				KUTE.to(this_nav_stick,{left:left},{easing:"easingCubicOut"}).start();

			}//end f

		}//end methods

	}//end export default

</script>
