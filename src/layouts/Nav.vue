<template>
  <Layout>

		<div class="nav">
			
			<!-- BEGIN: NAV TITLE -->
			<div class="nav_role">
				<div class="nav_role_control">
					<div class="nav_role_title">AS A SENIOR LEVEL:</div>
				</div>
			</div>

			<!-- BEGIN: PRIMARY NAV-->
			<div class="nav_role_list_container">
				<div :class="`nav_role_item ${node.key}`" v-for="node in skills_roles" :key="node.key">
					<div class="nav_role_item_link" @click.stop="click_ui_skills_set_group($event,node.key)">{{ node.title }}</div>
				</div>
			</div>

		</div>

  </Layout>
</template>

<style scoped>
	@import'~@/assets/css/Nav.css';
</style>

<script>
	import EventEmitter from 'events';
	import KUTE from 'kute.js';

	export default {
		props: ['skills_roles'],
		data() {
			return {
				/* set these refs to make coding a little easier for EVENT mgmt */
				EVENTS:this.$root.sl_port.EVENTS,
				ee:this.$root.sl_port.ee,
				isOpen:false
			}
		},
		beforeMount() {

			//reference for scoping inside onresize()
			const me = this;

			this.ee.on(this.EVENTS.ROUTE_SKILLSET,this.event_skillset);

			//------ listen for onresize and recalc/animate nav ------------
			window.onresize = () => {

				let obj_tmpHeights = me.ui_calc_navOpenAndCloseHeights();

				//if we're closed recalc/resize this
				if (me.$root.sl_port.navOpen == false) {

					//me.$static.sl_navOpenHeight = nav.offsetHeight;
					me.$root.sl_port.navOpenHeight = obj_tmpHeights.sl_navOpenHeight;

					//me.$static.sl_navClosedHeight = nav_role.offsetHeight + nav_role_item.offsetHeight;
					me.$root.sl_port.navClosedHeight = obj_tmpHeights.sl_navClosedHeight;

					//animate - nav to closed height
					KUTE.to('.nav',{height:me.$root.sl_port.navClosedHeight},{easing:"easingCubicOut"}).start();

				}//end if

				//adjust open height
				else {

					me.$static.sl_navOpenHeight = obj_tmpHeights.sl_navOpenHeight;

					//animate - nav to open height
					KUTE.to('.nav',{height:me.$static.sl_navOpenHeight},{easing:"easingCubicOut"}).start();

				}

			}//end onresize

		},
		mounted() {
			//this.init();
		},
		methods: {
			event_skillset(str_skillGroup) {
				console.log("NAV - str_skillGroup: " + str_skillGroup);
				//this.click_ui_skills_set_group({},str_skillGroup);
			},
			init() {
				//get route 
				//set up accordingly
				console.dir(this.$route.params.skillset);
				console.dir(document.querySelectorAll(".nav_role_item."+this.$route.params.skillset));

				this.click_ui_skills_set_group(
					document.querySelectorAll(".nav_role_item."+this.$route.params.skillset),
					this.$route.params.skillset
				);

			},
			click_ui_skills_set_group(e, str_skillGroup) {
				
				//console.log("click_toggleSkillGroup() - " + str_skillGroup);
				//console.dir(e);

				//console.dir(this.$root.sl_port);

				//if it's a first click
				if (this.$root.sl_port.isFirstLoad == true) {
					//set this again - sometimes race conditions cause wrong value
					let obj_tmpCalcs = this.ui_calc_navOpenAndCloseHeights();
					this.$root.sl_port.navOpenHeight = obj_tmpCalcs.sl_navOpenHeight;
					//this.$root.sl_port.navOpenHeight = document.getElementsByClassName("nav")[0].offsetHeight;
					this.$root.sl_port.isFirstLoad = false;
				}

				//if nav is closed - STOP
				if (this.$root.sl_port.navOpen == false) {
					this.click_ui_toggleSkillsMenu();
					return;
				}

				//set nav active
				this.set_navActive(e.target);

				console.dir(this.$root.sl_port);
				console.dir(this.$root.sl_port.domRefs);
				console.dir(this.$root.sl_port.domObjs);
				
				let domObjs = this.$root.sl_port.domObjs();

				console.dir(domObjs);

				//turn on page content
				domObjs.page_content.style.opacity = 1;

				//animate fadeins
				KUTE.to(domObjs.subnav,{opacity:1}).start();

				//simulate nav click trigger for skills
				//TODO - move this into SubNav component
				//this.click_ui_subnav_setActive("skills");

				this.click_ui_toggleSkillsMenu();

				//remove all classes
				domObjs.nav.classList.remove("nav_webDev");
				domObjs.nav.classList.remove("nav_gameDev");
				domObjs.nav.classList.remove("nav_marketing");
				domObjs.nav.classList.remove("nav_uiux");

				switch(str_skillGroup) {
					case "skills_webDev":
						domObjs.nav.classList.add("nav_webDev");
						this.$root.sl_port.category_active = "category_webDev";
						break;
					case "skills_gameDev":
						domObjs.nav.classList.add("nav_gameDev");
						this.$root.sl_port.category_active = "category_gameDev";
						break;
					case "skills_marketing":
						domObjs.nav.classList.add("nav_marketing");
						this.$root.sl_port.category_active = "category_marketing";
						break;
					case "skills_uiux":
						domObjs.nav.classList.add("nav_uiux");
						this.$root.sl_port.category_active = "category_uiux";
						break;
					default:
						break;
				}

				//console.dir(this.$page.skillsByPortId);
				//console.log(this.$router.history.current.params);

				this.$router.push("/portfolio/"+str_skillGroup);

				//EVENT - EMIT
				this.ee.emit(this.EVENTS.CLICK_NAV,e,str_skillGroup);
			
 
			},
			ui_calc_navOpenAndCloseHeights() {

				//let nav = document.getElementsByClassName("nav")[0];
				let nav_role = document.getElementsByClassName("nav_role")[0];
				let nav_role_items = document.getElementsByClassName("nav_role_item");
				let nav_role_item = nav_role_items[0];

				let int_listHeight = nav_role.offsetHeight;

				for (let i=0;i<nav_role_items.length;i++) {

					int_listHeight += nav_role_items[i].offsetHeight;

				}//end for

				return {
					"sl_navOpenHeight":		int_listHeight,
					"sl_navClosedHeight":	(nav_role.offsetHeight + nav_role_item.offsetHeight) * .9
				}

			},
			click_ui_toggleSkillsMenu:function() {

				//get appropriate height based on nav open/closed
				let newH = this.$root.sl_port.navOpen? this.$root.sl_port.navClosedHeight : this.$root.sl_port.navOpenHeight;

				//animate - height
				KUTE.to('.nav',{height:newH},{easing:"easingCubicOut"}).start();

				//toggle var
				this.$root.sl_port.navOpen = !this.$root.sl_port.navOpen;

			},
			set_navActive(element_navOn) {

				//get nav items
				let arr_navItems = document.getElementsByClassName("nav_role_item_link");

				//iterate
				for(let i=0; i<arr_navItems.length;i++) {

					//matching elements
					if (element_navOn === arr_navItems[i]) {
						//console.log("MATCH NAV ITEM!");
						//console.dir(arr_navItems[i]);
						arr_navItems[i].parentNode.classList.add("textBold","orderMinus1");
					}//end if

					//non matching elements
					else {
						arr_navItems[i].parentNode.classList.remove("textBold","orderMinus1");
					}

				}//end for

			},
		}
	}
</script>
