// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api/

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

module.exports = function (api) {

	//----------- ROUTING -------------

	api.createPages(({ createPage }) => {
		createPage(
			{
				path: '/portfolio/:skillset/:skillset_mode/:port_id/:port_mode',
				component: './src/templates/Portfolio.vue',
			}
		),
		createPage(
			{
				path: '/portfolio/:skillset/:skillset_mode/:port_id/',
				component: './src/templates/Portfolio.vue',
			}
		),
		createPage(
			{
				path: '/portfolio/:skillset/:skillset_mode',
				component: './src/templates/Portfolio.vue',
			}
		),
		createPage(
			{
				path: '/portfolio/:skillset',
				component: './src/templates/Portfolio.vue',
			}
		),
		createPage(
			{
				path: '/portfolio',
				component: './src/templates/Portfolio.vue',
			}
		)
	}),

	/*

api.createPages(({ createPage }) => {
		createPage({
			path: '/portfolio/:mode([a-z0-9\_\+]+)',
			component: './src/templates/Portfolio.vue',
			context: {
				"da_key":"DOG"
			}
		})
	}),
	*/

	//ASYNC load portfolio JSON
  api.loadSource(async actions => {
		
    // Use the Data Store API here: https://gridsome.org/docs/data-store-api/

		//get raw JSON
		const PortfolioRaw = require('./src/data/siteData3.json');

		//Create COLLECTIONS
   
		//---- for Portfolio items -----
		const collection_portfolioItems = actions.addCollection({typeName:"PortfolioItems"});

		//---- for Ranked Skills by Category ----
		const collection_portItemSkillStrength = actions.addCollection({typeName:"PortfolioItemsSkillStrength"});

		//---- for every Skill, ranked -----
		const collection_skillsRated = actions.addCollection({typeName:"SkillsRated"});

		//---- for skills by category ... AGAIN?! - TODO see if we need
		const collection_portfolioItemSkillMap = actions.addCollection({typeName:"PortfolioItemSkillMap"});

		//TODO - use this 
		const collection_portIDtoRatedSkills = actions.addCollection({typeName:"PortIDtoRatedSkills"});


		//---------- BUILD COLLECTION: PortfolioItemsSkillStrength --------------

		let arr_marketingSkills = [];
		let arr_UIUXskills = [];
		let arr_WebDevSkills = [];
		let arr_GameDevSkills = [];

		//Step through the entire portfolio - item by item
		for(let i=0;i<PortfolioRaw.portfolio.length;i++) {

			//scope in to portfolio item
			let obj_tmpPortItem = PortfolioRaw.portfolio[i];

			//grab the port title
			let str_tmpKey = obj_tmpPortItem.title;

			//grab the port ID
			let int_tmpID = obj_tmpPortItem.id;

			//bust up skills string
			let arr_tmpSkills = obj_tmpPortItem.skillset.split(",");

			//async call to make sure we don't get ahead of ourselves
			//get skills for this port ID
			let arr_skillLookups = await skillBuilder_buildSkillsByPortID(obj_tmpPortItem, PortfolioRaw.skillsets.skills_rated);


			collection_portIDtoRatedSkills.addNode({"port_id":int_tmpID, "skills": arr_skillLookups});


			//as we step through skills and find data - tuck into here
			let arr_rankedSkills = [];

			//step through each skill
			for (let j=0;j<arr_tmpSkills.length;j++) {

				//look up skill and get ratings
				let obj_skill = await skillBuilder_findSkill(arr_tmpSkills[j], PortfolioRaw.skillsets.skills_rated);
				
				//add to array
				arr_rankedSkills.push(obj_skill);		
				
				let str_tmpSkillType = await determineSkillCategory(arr_tmpSkills[j],PortfolioRaw.skillsets.skills_rated);

				switch (str_tmpSkillType) {

					case "skills_marketing":
						arr_marketingSkills.includes(int_tmpID)? '' : arr_marketingSkills.push(int_tmpID);
						break;
					case "skills_uiux":
						arr_UIUXskills.includes(int_tmpID)? '' : arr_UIUXskills.push(int_tmpID);
						break;
					case "skills_webDev":
						arr_WebDevSkills.includes(int_tmpID)? '' : arr_WebDevSkills.push(int_tmpID);
						break;
					case "skills_gameDev":
						arr_GameDevSkills.includes(int_tmpID)? '' : arr_GameDevSkills.push(int_tmpID);
						break;
					default:
						break;

				}//end switch
				
			
			}//end for

			//build object
			let obj_tmp = {
				title:str_tmpKey,
				skills:arr_rankedSkills
			}

			//console.dir(obj_tmp);

			//add to collection
			collection_portItemSkillStrength.addNode(obj_tmp);
			
		}//end for


		collection_portfolioItemSkillMap.addNode({	"title":"skills_marketing", 	"ids":arr_marketingSkills	});
		collection_portfolioItemSkillMap.addNode({	"title":"skills_uiux", 				"ids":arr_UIUXskills			});
		collection_portfolioItemSkillMap.addNode({	"title":"skills_webDev", 			"ids":arr_WebDevSkills		});
		collection_portfolioItemSkillMap.addNode({	"title":"skills_gameDev", 		"ids":arr_GameDevSkills	});


		//---------- BUILD COLLECTION: SkillsRated --------------

		//grab all skills - TODO - do we use this? 
		for (const j in PortfolioRaw.skillsets.skills_rated) {

			let tmpRatedSkill = PortfolioRaw.skillsets.skills_rated[j];

			collection_skillsRated.addNode({
				title:tmpRatedSkill.title,
				strength:tmpRatedSkill.strength,
				categories:tmpRatedSkill.categories
			});

		}//end for



		//---------- BUILD COLLECTION: PortfolioItems --------------

		//array for all skill types
		const skills = [];

		//Populate Portfolio items collection 
		for (let i=0;i<PortfolioRaw.portfolio.length;i++) {

			//scope in 
			let tmp = PortfolioRaw.portfolio[i];

			//extract skills and push to global skills []
			skillBuilder(tmp.skillset,skills);
			
			collection_portfolioItems.addNode({
				id: tmp.id,
				category: tmp.category,
				title: tmp.title,
				strength_creative: tmp.strength_creative,
				strength_code: tmp.strength_code,
				objective: tmp.objective,
				solution: tmp.solution,
				skillset: tmp.skillset,
				images: tmp.images,
				links: tmp.links
			});

		}//end for


		//---------- BUILD COLLECTION: PortfolioItems --------------



		//---------- BUILD STATIC ITEMS --------------

		let regExCommas = new RegExp(/,\s/,"g");
		let regExUnderscores = new RegExp(/ /,"g");
		
		//save these to global metaData
		actions.addMetadata("skillsArray",skills);
		actions.addMetadata("skillsFilteredArray",skills);

		//save roles
		actions.addMetadata("skills_roles",PortfolioRaw.skillsets.skills_roles);

		//store skills
		actions.addMetadata("skills_rated",PortfolioRaw.skillsets.skills_rated);

		//store portfolio
		actions.addMetadata("portfolio",PortfolioRaw.portfolio);

		actions.addMetadata("skills_marketing",PortfolioRaw.skillsets.skills_marketing.toLowerCase().replace(regExCommas,",").replace(regExUnderscores,"_"));

		actions.addMetadata("skills_uiux",PortfolioRaw.skillsets.skills_uiux.toLowerCase().replace(regExCommas,",").replace(regExUnderscores,"_"));
		actions.addMetadata("skills_webDev",PortfolioRaw.skillsets.skills_webDev.toLowerCase().replace(regExCommas,",").replace(regExUnderscores,"_"));
		actions.addMetadata("skills_gameDev",PortfolioRaw.skillsets.skills_gameDev.toLowerCase().replace(regExCommas,",").replace(regExUnderscores,"_"));

		actions.addMetadata("skills_rated",PortfolioRaw.skillsets.skills_rated);

		actions.addMetadata(
			"skills_marketing_built",
			skillBuilderRanked(PortfolioRaw.skillsets.skills_rated,"skills_marketing")
		);

		actions.addMetadata(
			"skills_uiux_built",
			skillBuilderRanked(PortfolioRaw.skillsets.skills_rated,"skills_uiux")
		);

		actions.addMetadata(
			"skills_webDev_built",
			skillBuilderRanked(PortfolioRaw.skillsets.skills_rated,"skills_webDev")
		);

		actions.addMetadata(
			"skills_gameDev_built",
			skillBuilderRanked(PortfolioRaw.skillsets.skills_rated,"skills_gameDev")
		);

  });


	//------ UTILS ---------------

	
	determineSkillCategory = function (portfolio_item_skill_key, masterRatedSkills) {

		//console.log("determineSkillCategory() checking: " + portfolio_item_skill_key);

		//step through our skills array and find key+category matches
		for (let i=0; i < masterRatedSkills.length; i++) {

			//console.log("determineSkillCategory() key: " + masterRatedSkills[i].key);

			//match the portfolio item skill key to the master skill key - return category type
			if (masterRatedSkills[i].key === portfolio_item_skill_key) {
				//console.log("determineSkillCategory() MATCH FOR: " + portfolio_item_skill_key);
				return masterRatedSkills[i].category;
			}

		}//end for

	}//end f

	skillBuilder_buildSkillsByPortID = async function (obj_portItem, arr_skills) {

		//console.log("skillBuilder_buildSkillsByPortID()");
		//console.dir(obj_portItem);

		let tmp_portSkills = obj_portItem.skillset.split(",");
		let tmp_ratedSkillsFinal = [];

		//console.log("skillBuilder_buildSkillsByPortID() - BUSTED UP SKILLS");
		//console.dir(tmp_portSkills);

		for (let i=0;i<tmp_portSkills.length;i++) {

			let tmp_skill = await skillBuilder_findSkill(tmp_portSkills[i], arr_skills);

			//console.log("SKILL RETURNED FOR: " + obj_portItem.id);

			tmp_ratedSkillsFinal.push(tmp_skill);

		}//end for

		return tmp_ratedSkillsFinal;

	}//end f

	skillBuilder_findSkill = async function(str_key,arr_skills) {
		//console.log("skillBuilder_findSkill() - str_key: " + str_key);
		//console.log("skillBuilder_findSkill() - arr_skills: " + arr_skills.length);
		let keyFound = false;
		for (let i=0;i<arr_skills.length;i++) {
			if (arr_skills[i].key == str_key) {
				//console.log("skillBuilder_findSkill() - MATCH: " + arr_skills[i].title + "-" + str_key);
				//console.dir(arr_skills[i]);
				return arr_skills[i];
			}
		}
		if (keyFound === false) {
			console.log("ERROR - no skill for: " + str_key);
		}
	}//end f

	//step through skills and grab all matching the category key
	skillBuilderRanked = function(masterRatedSkills, skillCategory) {

		let tmp = [];

		for (let jj=0;jj<masterRatedSkills.length;jj++) {
			if (masterRatedSkills[jj].category === skillCategory) {
				tmp.push(masterRatedSkills[jj]);
			}
		}
		return tmp;

	}//end f

	// builds a master list of all skills in all portfolio items
	skillBuilder = function (rawSkillsString, masterItems) {

		//bust up the raw skill string
		let rawItems = rawSkillsString.split(",");

		//iterate over busted up items array
		for (let i=0;i<rawItems.length;i++) {

			//clean up extra spaces, replace legit spaces with _
			let cleanedItem = rawItems[i].trim().toLowerCase().replace(" ","_");

			//if it's not in there already
			if (!masterItems.includes(cleanedItem)) {

				//add this fella
				masterItems.push(cleanedItem);

			}

		}//end for

	}//end f

}//end module.exports
