<template>
	<div :id="dom_id_content" class="port_item_stats portItem_detailPanel">
		
		<!-- CONTENET FOR SKILLS-->
		<div class="porItem_detailPanel_skills_content">

			<div class="skill_content_item" v-for="(skillset,i) in item_data" :key="skillset.strength+i+i">

				<div>{{ skillset.title }}</div>
			
				<!-- Make sure this isn't an empty skill category-->
				<div class="port_item_stat_horiz2" v-if="skillset.skills.length > 0">

					<div class="skills_fuelBars">

						<div class="skill_row" v-for="(skill,k) in skillset.skills" :key="skill+k">
							<div class="skill_row_title">{{ skill.title }}</div>
							<div class="skill_row_fuelBar skill_bar_horizontal">
								<div :class="`skill_bar_horizontal_fuel type_${ skill.category } bar_width${ skill.strength}`"></div>
							</div>
						</div>
					</div>
					
				</div>

			</div>

		</div>
	

	</div>
</template>

<style scoped>

.port_item_stats {
	display:block;
	text-align:center;
}

	.porItem_detailPanel_skills_nav {
		display:flex;
		justify-content:center;
	}

	.skill_bar_vertical_group {
		width:6vw;
		display:flex;
		padding:2vw;
		justify-content:center;
		cursor:pointer;
	}

	.skill_bar_vertical_group .skill_bar_vertical {
		height:70px;
	}

	.port_item_stat_horiz {
		text-align:center;
	}

	.port_item_stat_horiz .skill_bar_vertical {
		padding:0.5vw;
	}

	.port_item_stat_horiz .arrow_down_white {
		width:2vw;
	}

</style>

<script>

	import EventEmitter from 'events';
	import KUTE from 'kute.js';

	export default {
		props: ['subnav_name','item_data','dom_id_content'],
		metaInfo: {
			title: 'Portfolio Item Skills'
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

			event_onSubNavClick(in_subnav_name, in_dom_id_content) {

				//console.log("event_onSubNavClick() PORT DETAIL - event_dom_key: " + event_dom_key + " - nav_name: " + nav_name);

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
