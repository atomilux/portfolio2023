<template>
  <Layout>

		<div id="content">
			<div id="header">
					<g-image alt="Steve Lux Light bulb code logo" src="~/assets/logo_new1024x1024.png" />
			</div>
            
			<div id="nav">
					<ul>
							<li>
									<h1>
										<g-link class="nav__link" to="/portfolio/">PORTFOLIO</g-link>
									</h1>
							</li>
							<li>
									<h1>
										<a href="http://codeguy.steve-lux.com/new/resume_SteveLux_2017.pdf">EXPERIENCE</a>
									</h1>
							</li>
							<li>
									<h1>
										<a href="http://www.steve-lux.com/_stevetopia/index2.php">STEVETOPIA</a>
									</h1>
							</li>
					</ul>
			</div>
	</div>

	<div class="clients">
		<div class="client_header">CLIENTS</div>
		<div class="client_list">
			<div class="client">
				<a href="http://www.carnival.com" target="_blank">
					<g-image class="client_img" src="~/assets/logo_carnival1.png" />
				</a>
			</div>
			<div class="client">
				<a href="http://www.idsoftware.com" target="_blank">
					<g-image class="client_img" src="~/assets/logo_id1.png" />
				</a>
			</div>
			<div class="client">
				<a href="http://www.condenast.com" target="_blank">
					<g-image class="client_img" src="~/assets/logo_condenast1.png" />
				</a>
			</div>
			<div class="client">
				<a href="http://www.ge.com" target="_blank">
					<g-image class="client_img" src="~/assets/logo_ge1.png" />
				</a>
			</div>
			<div class="client">
				<a href="http://www.wired.com" target="_blank">
					<g-image class="client_img" src="~/assets/logo_wired1.png" />
				</a>
			</div>
			<div class="client">
				<a href="http://www.goodwill.com" target="_blank">
					<g-image class="client_img" src="~/assets/logo_goodwill1.png" />
				</a>
			</div>
		</div>
	</div>

  </Layout>
</template>

<script>
export default {
  metaInfo: {
    title: 'S  T  E  V  E    L  U  X  :  P  O  R  T  F  O  L  I  O'
  }
}
</script>
<link href="http://fonts.googleapis.com/css?family=Questrial" rel="stylesheet" type="text/css"></link>

<style>
	html {
		margin:0;
		padding:0;
	}
	* {
		font-family:Questrial,Arial,sans-serif;	
		font-size:1.5vw;
		letter-spacing:.3vw;
	}
	
	a {
		text-decoration:none;
		color: #999;	
	}
	
	a:hover {
		color: #000;	
	}
	
	
	a:after {
		content: '';
		display: block;
		margin: auto;
		height: 1px;
		width: 0px;
		background: transparent;
		transition: width .5s ease, background-color .5s ease;
	}
	a:hover:after {
		width: 100%;
		background: #000;
	}
	
	#content {
		margin:auto;
		text-align:center;	
	}
	
	#nav ul li {
		display:inline-block;
		list-style:none;
		padding: 0 5% 0 5%;
		border-right: 1px solid #999999;
	}
	
	#nav ul li:last-child {
		border:none;	
	}
	
	#header img {
		width:50%;	
	}

	.clients {
    width: 80%;
    text-align: center;
    padding: 2% 0 0 0;
    margin: 4% 0 6% 10%;
	}

	.client_header {
    border-bottom: 1px solid #ccc;
    padding: 0 0 2% 0;
    margin: 0 0 3% 0;
	}

	.client_img {
		max-height:3vw;
		width:auto;
		padding:1vw;
	}

	.client_list {
		display:flex;
		justify-content: center;
		align-items: center;
	}
</style>
