<template>
	<div :id="dom_id_content" class="portfolio">
		<div class="portfolio_content">
			<div class="port_item" @click="click_ui_portfolioItem($event,node.id)" v-for="(node,k) in portfolio_filtered" :key="node.id+k">
				<div class="port_item_small">

					<div class="port_item_title_main opacity0">{{ node.title }}</div>

					<span v-if="image_isThumbnail(node.images[0]) === false">
						<div :data-id='"elem"+k' v-bind:class='ajax_getVimeoThumbnail("elem"+k, node.images[0])'>
							<img class="port_thumbnail" src="empty"/>
						</div>
					</span>
					<img v-if="image_isThumbnail(node.images[0]) === true" class="port_thumbnail" v-bind:src="`/${node.images[0]}`"/>
					
					<!-- BEGIN PORT ITEM TITLE BAR-->
					<div class="port_item_title_bar">

						<!-- PORT ITEM TITLE -->
						<div class="port_item_title">{{ node.title }}</div> 

						<!--BEGIN PORT ITEM STATS-->
						<div class="port_item_stats">
							<div class="port_item_stat" v-for="(skill,l) in skills_get_byPortfolioID(node.id)" :key="skill.key+l">
								<div class="skill_bar_vertical">
									<div :class="`skill_bar_vertical_fuel type_${ skill.category } bar_height${ skill.strength }`"></div>
								</div>
							</div>
						</div>
						<!--END PORT ITEM STATS-->
						
					</div>
					<!-- END PORT ITEM TITLE BAR-->

					<div class="port_item_details maskMe">

						<div class="port_item_objective">{{ node.objective }}</div>

						<ul>
							<li class="port_item_results" v-for="(solution,i) in node.solution" :key="i">{{ solution }}</li>
						</ul>

						<ul>
							<li v-for="(link,i) in node.links" :key="i">
								<a class="port_item_link" v-bind:href="`${link.url}`" target="_blank">{{ link.title }}</a>
							</li>
						</ul>

					</div>

				</div>
			</div>
		</div>

	</div>
</template>

<style scoped>
	@import'~@/assets/css/PortfolioCategory.css';
</style>

<script>

	import EventEmitter from 'events';
	import KUTE from 'kute.js';

	export default {
		props: ['subnav_name','dom_id_content','portfolio_filtered','portfolio_full'],
		metaInfo: {
			title: 'Portfolio Category'
		},
		data() {
			return {
				/* set these refs to make coding a little easier for EVENT mgmt */
				EVENTS:this.$root.sl_port.EVENTS,
				ee:this.$root.sl_port.ee,
				root:this.$root

				/* key_subNav:'portfolio' */
			}
		},
		beforeMount(){

			//assign event listener - for SUBNAV clicks
			this.ee.on(this.EVENTS.CLICK_SUBNAV,this.event_onSubNavClick);

		},
		mounted() {

			this.elem_me = document.querySelector("#skills");

		},
		methods: {

			ajax_getVimeoThumbnail(key, str_url){		
				
				let r_vidID = /[0-9]+/;
				let int_id = str_url.match(r_vidID)[0];

				//console.log("VIMEO: " + int_id);

				let xhr = new XMLHttpRequest();
				
				let url = 'http://vimeo.com/api/v2/video/' + int_id + '.json';
				xhr.open("GET", url, true);

				xhr.onreadystatechange = function () {
					if (this.readyState == 4 && this.status == 200) {

						//DOM fished b/c DOMs via refs were lagging and undefined
						document.querySelectorAll('[data-id=' + key + ']')[0].firstChild.src = JSON.parse(this.responseText)[0].thumbnail_large; 

					}
				}
				// Sending our request
				xhr.send();
				
			},
			image_isThumbnail(str_url){
				let r_img = /(png|jpg|gif)/;
				let b_isTrue = false;
				let match = r_img.test(str_url);
				
				if (match != false){
					b_isTrue = true;
				}
				return b_isTrue;
			},
			image_vimeoGetThumbnail() {

			},

			event_onSubNavClick(in_subnav_name, in_dom_id_content) {

				/* console.log("PORTFOLIO CATEGORY - event_onSubNavClick() PORTFOLIO");
				console.log("- in_subnav_name: " + in_subnav_name);
				console.log("- in_dom_id_content: " + in_dom_id_content);
				console.log("- subnav_name: " + this.subnav_name); */

				//if not for our nav id - quietly return
				if (this.subnav_name != in_subnav_name) {
					return;
				}

				//select me in DOM
				let tmp_elem = document.querySelector("#"+this.dom_id_content);

				//console.dir(tmp_elem);

				//CSS - set default opacity to 0
				let int_newOpacity = 0;
				tmp_elem.style.zIndex = 0;

				//CSS - if this event is meant for us - opacity to 1 (visible)
				if (this.dom_id_content == in_dom_id_content) {
					console.log("SHOW ME - PORTFOLIO CATEGORY");
					int_newOpacity = 1;
					tmp_elem.style.zIndex = 100;
				}

				//animate - fade me (in if active - out if inactive)
				KUTE.to(tmp_elem,{opacity:int_newOpacity},{easing:'easingCubicOut'}).start();

			},
			click_ui_portfolioItem(e,int_id) {
				this.ee.emit(this.EVENTS.CLICK_PORT_ITEM,e,int_id);
			},
			skills_get_byPortfolioID: function (int_id) {
				//console.log("skills_get_byPortfolioID() = int_id: " + int_id);
				//console.log("skills_get_byPortfolioID() = length: " + this.$page.portItemSkillMap.edges.length);
				//console.dir(this.$page.portItemSkillMap.edges); 
				for (let i=0;i<this.$page.skillsByPortId.edges.length;i++) {
					if (int_id == this.$page.skillsByPortId.edges[i].node.port_id) {
						//console.log("SKILL LOOKUP MATCH");
						let tmp = _.sortBy(this.$page.skillsByPortId.edges[i].node.skills,['category']);
						//console.dir(tmp);
						//return this.$page.skillsByPortId.edges[i].node.skills;
						return tmp;
					}
				}
			}
		}
	}
</script>