// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api

import DefaultLayout from '~/layouts/Default.vue'

export default function (Vue, { router, head, isClient }) {
  // Set default layout as a global component
  Vue.component('Layout', DefaultLayout);

	//override this function so you won't get scroll to top every time something is clicked
	router.options.scrollBehavior = (to,from,savedPosition) => {

	}

}
