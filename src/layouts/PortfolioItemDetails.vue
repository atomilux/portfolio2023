<template>

	<!-- PORT ITEM: DETAILS-->
	<div :id="dom_id_content" class="portItem_detailPanel" style="z-index:100">

		<div class="column">

			<!-- OBJECTIVE -->
			<div class="port_detail_objective">
				<h3>OBJECTIVE:</h3>
				<div>{{ item_data.objective }}</div>
			</div>

			<!-- LINKS-->
			<div v-if="item_data.links.length > 0" class="links">
				<h3>LINKS:</h3>
				<div v-for="(link,k) in item_data.links" :key="k" class="link_item"> 
					<div>
						<g-image class="link_icon" :src="link_icon(link.url)"></g-image>
					</div>
					<div>
						<a :href='`${link.url}`' target="_blank" class="link">
							{{ link.title }}
						</a>
					</div>
				</div>
			</div>

		</div>

		<div class="column">
			<!-- SOLUTION -->
			<div class="port_detail_solution">
				<h3>SOLUTION:</h3>
				<ul>
					<li v-for="(solution,j) in item_data.solution" :key="j">{{ solution }}</li>
				</ul>
			</div>
		</div>

	</div>
	
</template>

<style scoped>


</style>

<script>

	import EventEmitter from 'events';
	import KUTE from 'kute.js';

	export default {
		props: ['subnav_name','item_data','dom_id_content'],
		metaInfo: {
			title: 'Portfolio Item Details'
		},
		data() {
			return {
				/* set these refs to make coding a little easier for EVENT mgmt */
				EVENTS:this.$root.sl_port.EVENTS,
				ee:this.$root.sl_port.ee,
				root:this.$root
			}
		},
		beforeMount(){

			//assign event listener - for SUBNAV clicks
			this.ee.on(this.EVENTS.CLICK_SUBNAV,this.event_onSubNavClick);

		},
		methods: {
			link_isPDF(str_name) {
				let r = /.pdf/;
				return str_name.match(r);
			},
			link_icon(str_name) {
				let r_pdf = /.pdf/;

				let str_linkIcon = "/images/icon_newWindow_256x256.svg";
				let str_pdfIcon = "/images/icon_acrobat.svg";

				let str_finalIconURL = str_linkIcon;

				if (str_name.match(r_pdf)) {
					str_finalIconURL = str_pdfIcon;
				}

				return str_finalIconURL;

			},

			event_onSubNavClick(in_subnav_name, in_dom_id_content) {

				//console.log("event_onSubNavClick() PORT DETAIL - event_dom_key: " + event_dom_key + " - nav_name: " + nav_name);

				//if this is not my event
				if (in_subnav_name != this.subnav_name) {
					return;
				}

				//select me in DOM
				let tmp_elem = document.querySelector("#"+this.dom_id_content);

				//console.dir(this.dom_id_content);

				//set default opacity to 0
				let int_newOpacity = 0;

				//set default CSS z-index to 0
				tmp_elem.style.zIndex = 0;

				//if this event was meant for me
				if (in_dom_id_content == this.dom_id_content) {
					
					//console.log("MATCH: " + this.dom_id_content);

					//CSS - change opacity target to 1 (visible)
					int_newOpacity = 1;

					//CSS - push to top of the z-index stack
					tmp_elem.style.zIndex = 100;

				}

				//animate - fade me
				KUTE.to(tmp_elem,{opacity:int_newOpacity},{easing:'easingCubicOut'}).start();

			}
		}
	}
</script>
