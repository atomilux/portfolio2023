<template>
	<div :id="dom_id_content" class="skills">

		<div class="skills_content">
			
			<div class="column col1">
				<div class="skills_desc">{{ current_skillset_details.desc }}</div>
				<div class="skills_link">
					<g-image class="acrobat_icon" src="/images/icon_acrobat.svg"></g-image>
					<a :href="`/${current_skillset_details.resume }`" target="_blank">{{ current_skillset_details.title }} RESUME</a>
				</div>				
			</div>

			<div class="column col2">

				<div class="skills_fuelBars">

					<div class="skill_row" v-for="skill in skills_get_byActiveCategory()" :key="skill.key">
						<div class="skill_row_title">{{ skill.title }}</div>
						<div class="skill_row_fuelBar skill_bar_horizontal">
							<div :class="`skill_bar_horizontal_fuel type_${ skill.category } bar_width${ skill.strength}`"></div>
						</div>
					</div>

				</div>

			</div>

		</div>
			
	</div>

</template>

<script>

	import EventEmitter from 'events';
	import KUTE from 'kute.js';

	export default {
		props:['subnav_name','dom_id_content','data_static','current_skillset_details'],
		metaInfo: {
			title: 'Skills2'
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
		mounted() {
			//console.dir(this.current_skillset_details);
		},
		methods: {

			event_onSubNavClick(in_subnav_name, in_dom_id_content) {

				//console.log("SKILLS - event_onSubNavClick() - in_subnav_name: " + in_subnav_name + " - in_dom_id_content: " + in_dom_id_content);

				//if not for our nav id - quietly return
				if (this.subnav_name != in_subnav_name) {
					return;
				}

				//select dom
				let tmp_elem = document.querySelector("#"+this.dom_id_content);

				//console.dir(tmp_elem);

				let int_newOpacity = 0;
				tmp_elem.style.zIndex = 0;

				if (this.dom_id_content == in_dom_id_content) {
					//console.log("MATCH: " + in_dom_id_content);
					int_newOpacity = 1;
					tmp_elem.style.zIndex = 100;
				}

				//animate - fade me
				KUTE.to(tmp_elem,{opacity:int_newOpacity},{easing:'easingCubicOut'}).start();

			},
			resume_getURL_byActiveCategory(str_skillCategory) {
				switch(str_skillCategory) {
					case "skills_marketing":
						return '<a href="marketingresume.pdf">Marketing Resume</a>';
						break;
					case "skills_uiux":
						return '<a href="uiuxresume.pdf">UI/UX Resume</a>';
						break;
					case "skills_webDev":
						return '<a href="webDevresume.pdf">Web Development Resume</a>';
						break;
					case "skills_gameDev":
						return '<a href="gameDevResume.pdf">Game Development Resume</a>';
						break;
					default:
						return;
				}
			}, 
			skills_get_byActiveCategory: function () {

				//let str_skillCategory = this.$router.history.current.params.mode;
				let str_skillCategory = this.current_skillset_details.key;

				//console.log("skills_getByActiveCategory() - " + str_skillCategory);
				let tmp = null;

				switch(str_skillCategory) {
					case "skills_marketing":
						tmp = this.data_static.metadata.skills_marketing_built;
						return tmp;
					case "skills_uiux":
						tmp = this.data_static.metadata.skills_uiux_built;
						return tmp;
					case "skills_webDev":
						tmp = this.data_static.metadata.skills_webDev_built;
						return tmp;
					case "skills_gameDev":
						tmp = this.data_static.metadata.skills_gameDev_built;
						return tmp;
					default:
						return tmp;

				}

				return tmp;

			}
		}
	}
</script>
