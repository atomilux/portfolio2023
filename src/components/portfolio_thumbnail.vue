<template>
  <Layout>
    <h1>{{props.title}}</h1>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error doloremque omnis animi, eligendi magni a voluptatum, vitae, consequuntur rerum illum odit fugit assumenda rem dolores inventore iste reprehenderit maxime! Iusto.</p>
  </Layout>
</template>

<script>
export default {
  props: ['title'],
	setup(props) {
		console.log(props.title)
	}
}
</script>