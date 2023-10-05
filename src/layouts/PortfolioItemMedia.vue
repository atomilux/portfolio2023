<template>
	<div :id="dom_id_content" class="portItem_detailPanel">
		<div class="portItem_image" v-for="(image,i) in item_data.images" :key="i">
			<div>{{  }}</div>
			<img v-if='mediaType(image) == "image"' v-bind:src="`/${image}`"/>
			<div v-if='mediaType(image) == "video"' v-bind:src="`/${image}`">
				<iframe title="vimeo-player" :src="`${image}`" width="100%" height="360" frameborder="0" allowfullscreen></iframe>
			</div>
		</div>
	</div>
</template>

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
			mediaType(str_url) {

				let r_img = /(png|jpg)/;
				let r_video = /(vimeo|youtube)/;

				let type = 'default';//default is image

				if (str_url.match(r_img)){
					type = "image"
				}
				if(str_url.match(r_video)){
					type = "video"
				}

				//console.log("TYPE:"+type);

				return type;

			},
			event_onSubNavClick(in_subnav_name, in_dom_id_content) {

				/* console.log("event_onSubNavClick() PORT DETAIL");
				console.log("event_onSubNavClick() - in_dom_id_content: " + in_dom_id_content);
				console.log("event_onSubNavClick() - in_subnav_name: " + in_subnav_name);

				console.log("- this.dom_id_content: " + this.dom_id_content);
				console.log("- this.subnav_name: " + this.subnav_name); */

				//if this is not my event
				if (in_subnav_name != this.subnav_name) {
					return;
				}

				//select me in DOM
				let tmp_elem = document.querySelector("#"+this.dom_id_content);

				//set default opacity to 0
				let int_newOpacity = 0;

				//set default CSS z-index to 0
				tmp_elem.style.zIndex = 0;

				//console.log(this.dom_id_content);

				//console.dir(tmp_elem);

				//if this event was meant for me
				if (in_dom_id_content == this.dom_id_content) {
					
					console.log("MATCH: " + this.dom_id_content);

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
