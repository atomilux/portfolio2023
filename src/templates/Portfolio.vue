<template>

	<Layout>

		<!-- HEADER -->
		<div id="header_full">
			<g-image src="~/assets/logo_stevelux_logotype_940x150.svg" />
		</div>
 
		<!-- ---- PRIMARYNAV ---- -->
		<Nav :skills_roles="this.$static.metadata.skills_roles"></Nav>

		<!-- ---- PORTFOLIO: SUBNAV ---- -->
		<SubNav 
			subnav_name="subnav_category" 
			:event_type="this.$root.sl_port.EVENTS.CLICK_SUBNAV" 
			:nav_data="subnav_data">
		</SubNav>


		<div class="page_content">

			<!-- ---- SKILLS ---- -->
			<Skills
				subnav_name="subnav_category" 
				dom_id_content="skillset"
				:data_static="this.$static" 
				:current_skillset_details="this.$static.metadata.current_skillset_details">
			</Skills>


			<!-- ---- PORTFOLIO ITEMS ---- -->
			<PortfolioCategory 
				subnav_name="subnav_category"
				dom_id_content="portfolio"
				:portfolio_filtered="this.$static.metadata.filteredPortfolio" 
				:portfolio_full="this.$static.metadata.masterPortfolio">
			</PortfolioCategory>
			
		</div>


		<!-- ---- PORTFOLIO ITEM DETAIL ---- -->
		<div class="port_detailShell opacity0" @click="click_ui_closePortDetail($event)">

			<div :class="`port_detail ${this.$root.sl_port.category_active}`">

				<div class="port_detail_nav" @click="click_ui_closePortDetail($event)">
					<g-image class="port_detail_nav_x" src="~/assets/x_icon.svg"/> 
				</div>
				<div class="port_detail_title">{{ this.portfolio_get_currentItemData().title }}</div>

				<SubNav 
					subnav_name="subnav_portfolioItemDetail"	
					:event_type="this.$root.sl_port.EVENTS.CLICK_SUBNAV"
					:nav_data="subnav_data_portDetail">
				</SubNav>

				<PortfolioItemDetails
					subnav_name="subnav_portfolioItemDetail"
					dom_id_content="portItem_details" 
					:item_data="this.portfolio_get_currentItemData()">
				</PortfolioItemDetails>

				<PortfolioItemSkills
					subnav_name="subnav_portfolioItemDetail"
					dom_id_content="portItem_skills"
					:item_data="skills_get_byPortfolioID(this.portfolio_get_currentItemData().id)">
				</PortfolioItemSkills>

				<PortfolioItemMedia
					subnav_name="subnav_portfolioItemDetail"
					dom_id_content="portItem_media"
					:item_data="this.portfolio_get_currentItemData()">
				</PortfolioItemMedia>

			</div>

		</div>

	</Layout>
</template>

<style>

	@import url('https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100;0,200;0,300;0,400;0,500;1,100;1,200;1,300;1,400;1,500&display=swap');

	@import '~@/assets/css/fonts.css';

	@import '~@/assets/css/Portfolio.css';

	@import'~@/assets/css/Nav.css';

	@import'~@/assets/css/SubNav.css';

	@import'~@/assets/css/Skills.css';

	@import'~@/assets/css/PortfolioItemDetails.css';

	@import'~@/assets/css/PortfolioItemMedia.css';


</style>

<script>
	import Nav from '../layouts/Nav.vue';
	import SubNav from '../layouts/SubNav.vue';
	import PortfolioCategory from '../layouts/PortfolioCategory.vue';
	import PortfolioItemDetails from '../layouts/PortfolioItemDetails.vue';
	import PortfolioItemMedia from '../layouts/PortfolioItemMedia.vue';
	import PortfolioItemSkills from '../layouts/PortfolioItemSkills.vue';
	import Skills from '../layouts/Skills.vue';
	import About from '../pages/About.vue';
	import _ from 'lodash';
	import KUTE from 'kute.js';
	import EventEmitter from 'events';
	import Vue from 'vue';


	export default {
  	components: { 
			Nav, SubNav, About, PortfolioCategory, 
			Skills, PortfolioItemDetails, PortfolioItemMedia, PortfolioItemSkills 
		},
		metaInfo: {
			title: 'S T E V E  L U X : P O R T F O L I O'
		},
		data() {
			return {
				subnav_data: [
					{
						'subnav_title':'SKILLSET', 
						'dom_id_content':'skillset'
					}, 
					{
						'subnav_title':'PORTFOLIO', 
						'dom_id_content':'portfolio'
					}
				],
				subnav_data_portDetail: [
					{
						'subnav_title':'DETAILS', 
						'dom_id_content':'portItem_details'
					}, 
					{
						'subnav_title':'SKILLS', 
						'dom_id_content':'portItem_skills'
					},
					{
						'subnav_title':'MEDIA', 
						'dom_id_content':'portItem_media'
					}
				]
			}
		},
		watch:{

			//watch $route for changes
			$route(to,from) {

				console.log("ROUTER");
				console.dir(from);
				console.dir(to);

				console.dir((to.params.mode === undefined));
				

				this.portfolio_filter();

				//set this for app wide storage
				this.$static.metadata.nav_current_skillset = this.$router.history.current.params.skillset;

				//set this for app wide storage
				this.$static.metadata.current_skillset_details = this.skillCategoryDetails_getByActiveCategory(this.$router.history.current.params.skillset);

				//dispatch routing event
				//this.$root.sl_port.ee.emit(this.$root.sl_port.EVENTS.ROUTE_SKILLSET,this.$router.history.current.params.skillset);

				//this.route_logic();

			}//end $route

		},
		beforeMount() {

			//console.log("beforeMount");

			console.dir(this.$route);

			window.history.scrollRestoration = "manual"; 

			//init obj for all SL PORT data
			this.$root.sl_port = {
				EVENTS:"",
				domRefs:{},
				portLocs:[],
				elem_portItem:"",
				int_portItem_originalWidth:0,
				navOpenHeight:"",
				navClosedHeight:"",
				category_active:"default",
				isFirstLoad:true,
				navOpen:true,
				metadata:{}
			};


			//set dummy data to template mapping won't blow up
			this.portfolio_set_currentItemDetail(0);

			//=============== EVENTS ===============

			//EVENTS - MASTER ENUM that is a single point of origin for all EVENT types
			let EVENTS = {
				CLICK_NAV: 								"CLICK_NAV",
				CLICK_SUBNAV:							"CLICK_SUBNAV",
				CLICK_SUBNAV_PORTITEM:		"CLICK_SUBNAV_PORTITEM",
				SKILLS_UPDATE_HORIZBARS: 	"SKILLS_UPDATE_HORIZBARS",
				CHILD_TEST: 							"CHILD_TEST",
				CLICK_PORT_ITEM:					"CLICK_PORT_ITEM",
				ROUTE_SKILLSET:						"ROUTE_SKILLSET",
				ROUTE_SKILLSET_MODE:			"ROUTE_SKILLSET_MODE",
				ROUTE_PORT_ID:						"ROUTE_PORT_ID"
			}

			this.$root.sl_port.EVENTS = EVENTS;
			
			this.$root.sl_port.ee = new EventEmitter();

			//map this for global access
			this.$root.sl_port.metadata.skills_marketing_built 	= this.$static.metadata.skills_marketing_built;
			this.$root.sl_port.metadata.skills_uiux_built 			= this.$static.metadata.skills_uiux_built;
			this.$root.sl_port.metadata.skills_webDev_built 		= this.$static.metadata.skills_webDev_built;
			this.$root.sl_port.metadata.skills_gameDev_built 		= this.$static.metadata.skills_gameDev_built;

			//--- EVENT: CLICK_NAV ----

			this.$root.sl_port.ee.on(EVENTS.SKILLS_UPDATE_HORIZBARS,this.event_onUpdateHorizBars);

			this.$root.sl_port.ee.on(EVENTS.CLICK_PORT_ITEM,this.event_clickPortItem);


			//set this for app wide storage
			this.$static.metadata.nav_current_skillset = this.$router.history.current.params.skillset;

			//set this for app wide storage
			this.$static.metadata.current_skillset_details = this.skillCategoryDetails_getByActiveCategory(this.$router.history.current.params.skillset);

			//set DOM refs
			this.$root.sl_port.domObjs = () => { 

				//console.log("set_domCommonElements()");

				return {
					"subnav": 									document.querySelector("div.subnav"),
					"subnav_skills":						document.querySelector("div.subnav_skills"),
					"subnav_portfolio":					document.querySelector("div.subnav_portfolio"),

					"subnav_stick":							document.querySelector("div.subnav").
																								querySelector("div.subnav_stick_row").
																								querySelector("div.subnav_stick"),

					"subnav_portDetail_stick": 	document.querySelector("div.port_detailShell").
																								querySelector("div.port_detail").
																								querySelector("div.subnav").
																								querySelector("div.subnav_stick_row").
																								querySelector("div.subnav_stick"),

					"portfolio": 								document.querySelector("div.portfolio"),
					"skills": 									document.querySelector("div.skills"),
					"skill_bar_horizontal": 		document.querySelector("div.skill_bar_horizontal"),
					"port_detail":							document.querySelector("div.port_detailShell"),
					"port_detail_inner":				document.querySelector("div.port_detail"),
					"page_content": 						document.querySelector("div.page_content"),

					"nav": 											document.querySelector("div.nav"),
					"nav_role": 								document.querySelector("div.nav_role"),
					"nav_role_item": 						document.querySelector("div.nav_role_item")
				}

			}	

		},
		mounted() {

			//this.route_logic();

			//console.log("MOUNTED");
			window.me = this;

			//DOM selections
			let header = document.getElementById("header_full");
			let nav = document.getElementsByClassName("nav")[0];
			let nav_role = document.getElementsByClassName("nav_role")[0];
			let nav_role_item = document.getElementsByClassName("nav_role_item")[0];
			let subnav = document.getElementsByClassName("subnav")[0];
			let page_content = document.getElementsByClassName("page_content")[0];

			let obj_calcs = this.ui_calc_navOpenAndCloseHeights();

			this.$root.sl_port.navOpenHeight = obj_calcs.sl_navOpenHeight;
			this.$root.sl_port.navClosedHeight = obj_calcs.sl_navClosedHeight;

			//console.log(nav.offsetHeight);

			//set opacity 0 for these items
			header.style.opacity = 0;
			nav.style.opacity = 0;
			subnav.style.opacity = 0;
			page_content.style.opacity = 0;
		
			//animate - fade in header and nav
			KUTE.to(header,{opacity:1},{easing:"easingCubicOut"}).start();
			KUTE.to(nav,{opacity:1},{easing:"easingCubicOut",delay:1000}).start();


			this.$root.sl_port.domRefs = this.$root.sl_port.domObjs();

			/* 
			this.$root.sl_port.domRefs = {
					"subnav": 									document.querySelector("div.subnav"),
					"subnav_skills":						document.querySelector("div.subnav_skills"),
					"subnav_portfolio":					document.querySelector("div.subnav_portfolio"),

					"subnav_stick":							document.querySelector("div.subnav").
																								querySelector("div.subnav_stick_row").
																								querySelector("div.subnav_stick"),

					"subnav_portDetail_stick": 	document.querySelector("div.port_detailShell").
																								querySelector("div.port_detail").
																								querySelector("div.subnav"). 
																								querySelector("div.subnav_stick_row").
																								querySelector("div.subnav_stick"),

					"portfolio": 								document.querySelector("div.portfolio"),
					"skills": 									document.querySelector("div.skills"),
					"skill_bar_horizontal": 		document.querySelector("div.skill_bar_horizontal"),
					"port_detail":							document.querySelector("div.port_detailShell"),
					"port_detail_inner":				document.querySelector("div.port_detail"),
					"page_content": 						document.querySelector("div.page_content"),

					"nav": 											document.querySelector("div.nav"),
					"nav_role": 								document.querySelector("div.nav_role"),
					"nav_role_item": 						document.querySelector("div.nav_role_item")
				}
 */


		},
		methods: {

			route_logic() {

				console.log("route_logic()");

				let route = this.$route;

				console.dir(route);

				//routing hierarchy - /portfolio/:skillset/:skillset_mode/:port_id/:port_mode
				/*
					1-skillset
					2-skillset_mode
					3-port_id
					4-port_mode
				*/

				// 1 - skillset
				if (route.params.skillset !== undefined) {

					//user requests skillset 
					//this.$root.sl_port.ee.emit(this.$root.sl_port.EVENTS.ROUTE_SKILLSET,this.$router.history.current.params.skillset);

					console.log("1 - skillset: " + route.params.skillset);

					// 2 - mode
					if (route.params.skillset_mode !== undefined) {

						console.log("2 - skillset_mode: " + route.params.skillset_mode);

						//3 - port_id
						if (route.params.port_id !== undefined) {

							console.log("3 - port_id: " + route.params.port_id);

							//4 - port_mode
							if (route.params.port_mode !== undefined) {

								console.log("4 - port_mode: " + route.params.port_mode);

							}//end 4

						}//end 3

					}//end 2

				}//end 1

			},

			/* ============== EVENT HANDLERS =========== */

			event_onUpdateHorizBars: (me) => {

				console.log("event_onUpdateHorizBars()");

				me.ui_set_domCommonElements();

				let arr_horizBars = me.$sl_port.domRefs.skill_bar_horizontal;

				//animate in each bar
				for (let i=0;i<arr_horizBars.length;i++) {

					let tmp_bar = arr_horizBars[i];
					let int_percentWidth = 0;

					tmp_bar.classList.contains("bar_width1")? int_percentWidth=10 : "";
					tmp_bar.classList.contains("bar_width2")? int_percentWidth=20 : "";
					tmp_bar.classList.contains("bar_width3")? int_percentWidth=30 : "";
					tmp_bar.classList.contains("bar_width4")? int_percentWidth=40 : "";
					tmp_bar.classList.contains("bar_width5")? int_percentWidth=50 : "";
					tmp_bar.classList.contains("bar_width6")? int_percentWidth=60 : "";
					tmp_bar.classList.contains("bar_width7")? int_percentWidth=70 : "";
					tmp_bar.classList.contains("bar_width8")? int_percentWidth=80 : "";
					tmp_bar.classList.contains("bar_width9")? int_percentWidth=90 : "";
					tmp_bar.classList.contains("bar_width10")? int_percentWidth=100 : "";

					console.log(int_percentWidth);

					KUTE.to(tmp_bar,{width:int_percentWidth+"%"},{delay:i*100});

				}//end for

			},
			event_clickPortItem (e,int_id) {
				console.log("event_clickPortItem()");
				this.click_ui_portfolioItem(e,int_id);
			},

			/* ============== CLICK HANDLERS =========== */

			click_ui_closePortDetail(e) {

				console.log("click_ui_closePortDetail()");
				console.dir(e.target);

				//catch if it's not a background click or a nav close bar click and return
				if (	e.target.className.includes("port_detail_nav") == false && 
							e.target.className.includes("port_detailShell") == false &&
							e.target.className.includes("port_item_small") == false) {
					return; 
				}

				let overlay = this.$root.sl_port.domRefs.port_detail;
				let h = window.outerHeight;

				KUTE.to( overlay, { bottom:h },
					{
						easing:"easingCubicOut",
						onComplete:()=>{ 
							this.ui_set_portItemOverlayToOff()
			 			} 
					}
				).start();

				KUTE.to(overlay,{opacity:0},{easing:"easingCubicOut"}).start();

			},
			click_ui_portfolioItem(e,int_id) {

				console.dir(e.target.parentElement);
				console.log(int_id);

				this.$static.port_activeID = int_id;

				this.portfolio_set_currentItemDetail(int_id);

				this.ui_set_portfolioItemOverlayToOn();

				//scroll to top
				console.dir(this.$root.sl_port.domRefs);
				this.$root.sl_port.domRefs.port_detail_inner.scrollTo({ top: 0, behavior: 'smooth' });

			},
			ui_set_portfolioItemOverlayToOn() {

				console.log("set_portfolioItemOverlayToOn()");

				let overlayShell = this.$root.sl_port.domRefs.port_detail;

				let overlay = overlayShell.querySelector("div.port_detail");
				let w = window.innerWidth;
				let h = window.innerHeight;

				//overlay.classList.remove("hideMe");

				overlayShell.style.zIndex = 2000;
				overlayShell.style.opacity = 0;

				//KUTE.to( overlay, { top:h*.05,left:w*.05,width:w*.9,height:h*.9 }, { easing:"easingCubicOut" } ).start();

				KUTE.to( overlayShell, {opacity:1}, {easing:"easingCubicOut"} ).start();

			},
			ui_set_portItemOverlayToOff() {
				this.$root.sl_port.domRefs.port_detail.classList.add("opacity0");
				this.$root.sl_port.domRefs.port_detail.style.zIndex = -100;
			},
			ui_calc_navOpenAndCloseHeights() {

				let nav = document.getElementsByClassName("nav")[0];
				let nav_role = document.getElementsByClassName("nav_role")[0];
				let nav_role_items = document.getElementsByClassName("nav_role_item");
				let nav_role_item = nav_role_items[0];

				let int_listHeight = nav_role.offsetHeight;

				for (let i=0;i<nav_role_items.length;i++) {

					int_listHeight += nav_role_items[i].offsetHeight;

				}//end for

				//console.log("calc_navOpenAndCloseHeights() - int_listHeight:"+int_listHeight);

				return {
					"sl_navOpenHeight":		int_listHeight,
					"sl_navClosedHeight":	(nav_role.offsetHeight + nav_role_item.offsetHeight) * .9
				}

			},
			ui_set_domCommonElements() { 

				//console.log("set_domCommonElements()");
/* 
				let obj = {
					"subnav": 									document.querySelector("div.subnav"),
					"subnav_skills":						document.querySelector("div.subnav_skills"),
					"subnav_portfolio":					document.querySelector("div.subnav_portfolio"),

					"subnav_stick":							document.querySelector("div.subnav").
																								querySelector("div.subnav_stick_row").
																								querySelector("div.subnav_stick"),

					"subnav_portDetail_stick": 	document.querySelector("div.port_detailShell").
																								querySelector("div.port_detail").
																								querySelector("div.subnav"). 
																								querySelector("div.subnav_stick_row").
																								querySelector("div.subnav_stick"),

					"portfolio": 								document.querySelector("div.portfolio"),
					"skills": 									document.querySelector("div.skills"),
					"skill_bar_horizontal": 		document.querySelector("div.skill_bar_horizontal"),
					"port_detail":							document.querySelector("div.port_detailShell"),
					"port_detail_inner":				document.querySelector("div.port_detail"),
					"page_content": 						document.querySelector("div.page_content"),

					"nav": 											document.querySelector("div.nav"),
					"nav_role": 								document.querySelector("div.nav_role"),
					"nav_role_item": 						document.querySelector("div.nav_role_item")
				}
 */
				//this.$root.sl_port.domRefs = obj;
				//this.$root.sl_port.domRefs = this.$root.sl_port.domObjs();

				//return obj;

			},
			
			skillCategoryDetails_getByActiveCategory() {

				//console.log("skillCategoryDetails_getByActiveCategory()");

				let str_skillCategory = this.$router.history.current.params.skillset;
				//console.log("skillCategoryDetails_getByActiveCategory() - " + str_skillCategory);

				for (let i=0;i<this.$static.metadata.skills_roles.length;i++) {
					if (this.$static.metadata.skills_roles[i].key == str_skillCategory) {
						//console.log("MATCH: " + str_skillCategory);
						//console.dir(this.$static.metadata.skills_roles[i]);
						return this.$static.metadata.skills_roles[i];
					}
				}

			},
			skills_get_byActiveCategory: function () {

				let str_skillCategory = this.$router.history.current.params.skillset;
				//console.log("skills_getByActiveCategory() - " + str_skillCategory);
				let tmp = null;

				switch(str_skillCategory) {
					case "skills_marketing":
						tmp = this.$static.metadata.skills_marketing_built;
						return tmp;
					case "skills_uiux":
						tmp = this.$static.metadata.skills_uiux_built;
						return tmp;
					case "skills_webDev":
						tmp = this.$static.metadata.skills_webDev_built;
						return tmp;
					case "skills_gameDev":
						tmp = this.$static.metadata.skills_gameDev_built;
						return tmp;
					default:
						return tmp;

				}

				return tmp;

			},
			skills_get_byPortfolioID (int_id) {
				//console.log("skills_get_byPortfolioID() = int_id: " + int_id);
				//console.log("skills_get_byPortfolioID() = length: " + this.$page.portItemSkillMap.edges.length);
				//console.dir(this.$static.metadata.skills_roles); 

				//---- step through ALL skills
				for (let i=0;i<this.$page.skillsByPortId.edges.length;i++) {

					// MATCH - port id in (int_id) to port_id key
					if (int_id == this.$page.skillsByPortId.edges[i].node.port_id) {

						//-------- sort skills by category TODO - do we need? ------
						let arr_tmp = _.sortBy(this.$page.skillsByPortId.edges[i].node.skills,['category']);

						//------ skills - grouped into arrays by category --------
						//let obj_skillsSortedByCategory = {};

						let obj_skillsSortedByCategory2 = [];

						//---- loop through all the skills ----
						for(let j=0;j<this.$static.metadata.skills_roles.length;j++) {

							let str_key = this.$static.metadata.skills_roles[j].key;
							let tmp = _.filter(arr_tmp,{'category':str_key});

							//obj_skillsSortedByCategory[str_key] = tmp;

							if (tmp.length > 0) {

								obj_skillsSortedByCategory2.push(
									{
										title:this.$static.metadata.skills_roles[j].title,
										skills:tmp
									}
								);

							}


						}//end for

						//console.dir(obj_skillsSortedByCategory2);

						return obj_skillsSortedByCategory2;
					}
				}
			},
			portfolio_filter: function() {

				console.log("filterPortfolio() - params: " + this.$router.history.current.params.skillset);

				//get skills 
				let str_skills = this.$router.history.current.params.skillset;
				let arr_skillKeys = str_skills.split("+");
				let arr_finalIDset = [];

				//console.dir(str_skills);
				//console.dir(arr_skillKeys);

				for (let i=0;i<arr_skillKeys.length;i++) {

					let arr_tmpIDs = this.portfolio_get_itemIDsBySkillKey(arr_skillKeys[i]).node.ids;

					for (let j=0;j<arr_tmpIDs.length;j++) {

						if (!arr_finalIDset.includes(arr_tmpIDs[j])) {
							arr_finalIDset.push(arr_tmpIDs[j]);
						}

					}//end for

				}//end for

				//console.dir(arr_finalIDset);
				//console.dir(this.$static.metadata.filteredPortfolio);

				this.$static.metadata.filteredPortfolio = [];

				for (let i=0;i<arr_finalIDset.length;i++) {
					this.$static.metadata.filteredPortfolio.push(this.portfolio_get_itemDataByID(arr_finalIDset[i]));
				}

				//sort by ID descending 
				this.$static.metadata.filteredPortfolio.reverse();

				//console.dir(this.$static.metadata.filteredPortfolio);
				
			},
			portfolio_set_currentItemDetail(int_id) {
				//console.log("portfolio_set_currentItemDetail() int_id: " + int_id);
				//this.$static.port_activeID = int_id;
				this.$static.port_currentItem = this.portfolio_get_itemDataByID(int_id);
				this.$forceUpdate();
			},
			portfolio_get_currentItemData() {
				//console.log("portfolio_get_currentItemData()");
				//console.dir(this.$static.port_currentItem);
				return this.$static.port_currentItem;
			},
			portfolio_get_itemDataByID: function (int_id) {

				//console.log("getPortfolioDataByID() int_id: " + int_id);

				for(let i=0;i<this.$static.metadata.masterPortfolio.length;i++) {

					//console.log("getPortfolioDataByID() id: " + this.$static.metadata.masterPortfolio[i].id);
					
					if (this.$static.metadata.masterPortfolio[i].id == int_id) {
						//console.dir("MATCH ID: " + int_id);
						//console.dir(this.$static.metadata.masterPortfolio[i]);
						return this.$static.metadata.masterPortfolio[i];
					}

				}//end for

			},
			portfolio_get_itemIDsBySkillKey (str_skillKey) {

				//console.dir("portfolio_get_itemIDsBySkillKey()" + str_skillKey);

				for (let i=0;i<this.$page.portItemSkillMap.edges.length;i++) {

					let obj_tmpSkillMap = this.$page.portItemSkillMap.edges[i];
					let str_title = obj_tmpSkillMap.node.title;

					if (str_title === str_skillKey) {
						//console.dir("MATCH: " + obj_tmpSkillMap.node.title);
						return obj_tmpSkillMap;
					}

				}//end for

			}//end f

		}//end methods

	}//end export default
</script>

<static-query>
	query {
		metadata {
			skills_roles {
				key,
				title,
				desc,
				resume
			},
			skills_marketing_built {
				title,
				strength,
				key,
				category
			}
			skills_uiux_built {
				title,
				strength,
				key,
				category
			},
			skills_webDev_built {
				title,
				strength,
				key,
				category
			},
			skills_gameDev_built {
				title,
				strength,
				key,
				category
			},
			masterPortfolio: portfolio {
				id,
				title,
				objective,
				solution,
				skillset,
				images,
				links {
					title,
					url
				}
			},
			filteredPortfolio: portfolio {
				id,
				title,
				objective,
				solution,
				skillset,
				images,
				links {
					title,
					url
				}
			}
		}  
	}
</static-query>

<page-query>
	query {
		skillsByPortId:allPortIDtoRatedSkills {
			edges {
				node {
					port_id
					skills {
						title
						key
						strength
						category
					}
				}
			}
		},
		portItemSkillMap:allPortfolioItemSkillMap {
			edges {
				node {
					title,
					ids
				}
			}
		},
		portItems: allPortfolioItems(
			filter: { 
				skillset: { regex: "U"}
			}) {
			edges {
				node {
					title,
					skillset
				}
			}
		}
	}
</page-query>
