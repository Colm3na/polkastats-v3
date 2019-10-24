<template>
  <div>
    <section id="navigation">
      <div class="nav-bg-color fixed-top">
        <div class="container">
          <b-navbar toggleable="lg" type="dark" class="row">
            <b-navbar-brand>
              <nuxt-link to="/" class="navbar-brand" title="PolkaStats | Polkadot network statistics"><span class="logo"></span>PolkaStats</nuxt-link>
            </b-navbar-brand>
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
            <b-collapse id="nav-collapse" is-nav class="flex-grow-1 text-center text-sx-right text-md-right text-lg-right">
              <b-navbar-nav class="navbar-nav ml-auto flex-nowrap">
                <b-nav-item>
                  <nuxt-link to="/about" active-class="active" class="nav-link">About</nuxt-link>
                </b-nav-item>                              
              </b-navbar-nav>
            </b-collapse>
          </b-navbar>
        </div>
      </div>
    </section>
    <nuxt />
    <section id="footer">
      <div class="container"> 
        <div class="row mt-4 pt-5">
          <div class="col-xs-12 col-sm-12 col-md-12 mt-2 mt-sm-2 text-center text-white">
            
            <h2 class="mb-3">Get in contact</h2>
            <ul class="list-unstyled list-inline social mb-5 text-center">
              <li class="list-inline-item mr-2"><a target="_blank" href="https://twitter.com/polkastats"><i class="fab fa-twitter"></i> @PolkaStats</a></li>
              <li class="list-inline-item mr-2"><a target="_blank" href="https://keybase.io/encrypt#polkastats"><i class="fab fa-keybase"></i> PGP: 14C5 91D0 8ABA 03B7</a></li>
              <li class="list-inline-item"><a target="_blank" href="mailto:polkastats@protonmail.com"><i class="fa fa-envelope"></i> polkastats@protonmail.com</a></li>
            </ul>

            <p style="font-size: 0.95rem;">Made with <i class="far fa-heart"></i> by <a href="https://mariopino.es" title="Mario Pino">Mario Pino</a> in <a target="_blank" href="https://www.coworkingcolmena.com/" title="La Colmena">La Colmena</a> <span class="mx-2">|</span> Built with <a href="https://basicattentiontoken.org/" target="_blank">Basic Atttention Token <img src="/img/brave/logo-full-color.png" class="img-fluid bat" /></a> <span class="mx-2">|</span> <a href="https://github.com/Colm3na/polkastats" aria-label="View source on GitHub" title="View source code on GitHub" target="_blank"><i class="fab fa-github"></i> View source code on GitHub</a></p>
          </div>
          </hr>
        </div>  
      </div>
    </section>
    <a href="https://github.com/Colm3na/polkastats" class="github-corner" aria-label="View source on GitHub" title="View source code on GitHub" target="_blank"><svg class="github-corner d-none d-md-none d-lg-block"  width="90" height="90" viewBox="0 0 250 250" style="fill:#d75ea1; color:#fff; position: absolute; top: 0; border: 0; right: 0; z-index: 1100;" aria-hidden="true"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path></svg></a><style>.github-corner:hover .octo-arm{animation:octocat-wave 560ms ease-in-out}@keyframes octocat-wave{0%,100%{transform:rotate(0)}20%,60%{transform:rotate(-25deg)}40%,80%{transform:rotate(10deg)}}@media (max-width:500px){.github-corner:hover .octo-arm{animation:none}.github-corner .octo-arm{animation:octocat-wave 560ms ease-in-out}}</style>
  </div>
</template>
<script>
export default {} 
</script>
<style>
@import url('https://use.fontawesome.com/releases/v5.6.3/css/all.css');
@import url('https://fonts.googleapis.com/css?family=Roboto:300,400,700&display=swap');

/* Global */
body {
  font-family: 'Roboto', sans-serif;
  color: #52555a;
  background-color: rgba(247, 238, 246, 0.5);
  word-break: break-word;
}
.main.container {
  padding-left: 5px;
  padding-right: 5px;
}
a {
  color: #670d35;
}
a:hover {
  color: #670d35;
}

.navbar-dark .navbar-nav .nav-link {
  color: rgba(255, 255, 255, 0.7);
}
.navbar-dark .navbar-nav .nav-link:hover, .navbar-dark .navbar-nav .nav-link:focus {
  color: rgba(255, 255, 255, 1);
}

.btn {
  border-width: 2px;
  border-radius: 0.5rem;
}
.btn-primary {
  background-color: #670d35;
  border-color: #670d35;
}
.btn-outline-primary {
  color: #670d35;
  border-color: #670d35;
}
.btn-outline-primary:not(:disabled):not(.disabled):active, .btn-outline-primary:not(:disabled):not(.disabled).active, .show > .btn-outline-primary.dropdown-toggle {
  background-color: #670d35;
  border-color: #670d35;
}
.btn-outline-primary:hover {
  background-color: #670d35;
  border-color: #670d35;
}

/* Header */
#navigation {
  margin-bottom: 88px;
}
section#navigation nav {
	background-color: #670d35;
}
.navbar {
  padding: 0.5rem 0.3rem 0.5rem 0.3rem;
}
/* Animated logo */
.navbar-brand .logo {
  margin-right: 0.5rem;
  margin-top: -0.1rem;
  display: inline-block;
  vertical-align: middle;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #e6007a;
  cursor: pointer;
  box-shadow: 0 0 0 rgba(204,169,44, 0.4);
  animation: pulse 2s infinite;
}
.pulse:hover {
  animation: none;
}
@-webkit-keyframes pulse {
  0% {
    -webkit-box-shadow: 0 0 0 0 rgba(204,169,44, 0.4);
  }
  70% {
      -webkit-box-shadow: 0 0 0 10px rgba(204,169,44, 0);
  }
  100% {
      -webkit-box-shadow: 0 0 0 0 rgba(204,169,44, 0);
  }
}
@keyframes pulse {
  0% {
    -moz-box-shadow: 0 0 0 0 rgba(204,169,44, 0.4);
    box-shadow: 0 0 0 0 rgba(204,169,44, 0.4);
  }
  70% {
      -moz-box-shadow: 0 0 0 10px rgba(204,169,44, 0);
      box-shadow: 0 0 0 10px rgba(204,169,44, 0);
  }
  100% {
      -moz-box-shadow: 0 0 0 0 rgba(204,169,44, 0);
      box-shadow: 0 0 0 0 rgba(204,169,44, 0);
  }
}
/* End animated logo */
.navbar-nav {
  text-transform: uppercase;
}
.nav-bg-color {
  background-color: #670d35;
  box-shadow: 0 4px 12px 0 rgba(100,100,100,.3);  
}
.dropdown-item {
  padding: 0rem 1.5rem;
}
.dropdown-item a {
	color: #670d35 !important;
}
.dropdown-item.active, .dropdown-item:active {
    color: #fff;
    background-color: #670d35;
}
.btn-outline-white {
    color: #ffffff;
    border-color: #ffffff;
}
.btn-outline-white:hover {
    color: #670d35;
    background-color: #ffffff;
    border-color: #ffffff;
}
.flag-icon {
  border: 2px solid transparent;
  border-radius: 2px;
  width: 1.6em;
  height: 1.3em;
}
.flag-icon-es {
  margin-left: 2rem;
}
.nav-link .nuxt-link-exact-active .flag-icon {
  border: 2px solid white;
}

/* Slider */
.carousel-caption h2,
.carousel-caption p {
  text-shadow: 2px 4px rgba(0,0,0,0.4);
}

/* Footer */
section .section-title {
  text-align: center;
  color: #007b5e;
  margin-bottom: 50px;
  text-transform: uppercase;
}
#footer {
	background-color: #2d2f33;
  padding: 0 0 40px 0;
}
#footer h5{
  padding-left: 10px;
  border-left: 3px solid #eeeeee;
  padding-bottom: 6px;
  margin-bottom: 20px;
  color:#ffffff;
}
#footer a {
  color: #ffffff;
  background-color: transparent;
  -webkit-text-decoration-skip: objects;
}
#footer ul.social li{
  padding: 3px 12px 0 0;
}
#footer ul.social li a i {
  margin-right: 5px;
  font-size:18px;
  -webkit-transition: .5s all ease;
  -moz-transition: .5s all ease;
  transition: .5s all ease;
}
#footer ul.social li:hover a i {
  font-size:24px;
  margin-top:-10px;
}
#footer ul.social li a,
#footer ul.quick-links li a{
  color:#ffffff;
}
#footer ul.social li a:hover{
  color:#eeeeee;
}
#footer ul.quick-links li{
  padding: 3px 0;
  -webkit-transition: .5s all ease;
  -moz-transition: .5s all ease;
  transition: .5s all ease;
}
#footer ul.quick-links li:hover{
  padding: 3px 0;
  margin-left:5px;
  font-weight:700;
}
#footer ul.quick-links li a i{
  margin-right: 5px;
}
#footer ul.quick-links li:hover a i {
  font-weight: 700;
}
.bat {
  max-width: 18px;
  vertical-align: middle;
  margin-left: .1rem;
}

@media (max-width:991px){
  #navigation {
    margin-bottom: 52px;
  }
  #navigation .container {
    max-width: 100%;
  }
  .navbar {
    padding: 0 0.5rem;
  }
}

@media (max-width:767px){
  #navigation {
    margin-bottom: 52px;
  }
  .main.container {
    padding-left: 15px;
    padding-right: 15px;
  }
  #footer h5 {
		padding-left: 0;
		border-left: transparent;
		padding-bottom: 0px;
		margin-bottom: 10px;
	}
  .navbar-nav {
    padding-bottom: 1rem;
  }
  .flag-icon-es {
    margin-left: 0;
  }
  #navigation .container {
    max-width: 100%;
  }  
  .navbar {
    padding: 0 0.5rem;
  }
}

/* CTA */
.cta {
  color: #fff;
  background-color: #5bc0de;
  border-color: #14b6e6;
  background-image: linear-gradient(135deg, #670d35, #b1e2f1);
}

/* Breadcrumbs */
.breadcrumb {
  padding: 0.5rem 0rem;
  margin-bottom: 3rem;
  background-color: initial;
  border-radius: 0;
  font-size: 15px;
  border-bottom: 1px solid #d75ea1;
}

/* Notifications */
.b-toaster.b-toaster-top-right .b-toaster-slot,
.toast,
.b-toast {
  z-index: 1000000000;
}
.toast-body {
  word-break: break-word;
}
.system {
  font-size: 2rem;
  font-weight: 300;
  line-height: 1.2;
}
</style>
