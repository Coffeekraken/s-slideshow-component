module.exports = {
	// server port
	port : 3000,

	// title
	title : 's-slideshow-component',

	// layout
	layout : 'right',

	// compile server
	compileServer : {

		// compile server port
		port : 4000

	},

	// editors
	editors : {
		html : {
			language : 'html',
			data : `
				<div class="container">
					<h1 class="h1 m-b-small">
						Coffeekraken s-slideshow-component
					</h1>
					<p class="p m-b-bigger">Provide a nice and fully customizable select webcomponent that use a real select as source of truth</p>
					<s-slideshow class="ratio-16-9 m-b" loop>
						<div s-slideshow-slide>
							<img class="abs-cover" src="https://source.unsplash.com/category/buildings/800x600" />
							<div class="slideshow__metas">
								<h1 class="h3 m-b">Hello World #1</h1>
								<p class="p m-b">
									Ut sollicitudin enim ac nibh tempor commodo. Phasellus a nunc congue, sollicitudin nibh molestie, rutrum ligula. Duis ex diam, finibus sed dictum sit amet, faucibus sollicitudin risus. Nam eget tortor.
								</p>
								<a href="#" class="btn btn--primary">
									More info...
								</a>
							</div>
						</div>
						<div s-slideshow-slide active>
							<img class="abs-cover" src="https://source.unsplash.com//category/food/800x600" />
							<div class="slideshow__metas slideshow__metas--primary">
								<h1 class="h3 m-b">Hello World #2</h1>
								<p class="p m-b">
									Ut sollicitudin enim ac nibh tempor commodo. Phasellus a nunc congue, sollicitudin nibh molestie, rutrum ligula. Duis ex diam, finibus sed dictum sit amet, faucibus sollicitudin risus. Nam eget tortor.
								</p>
								<a href="#" class="btn btn--secondary">
									More info...
								</a>
							</div>
						</div>
						<div s-slideshow-slide>
							<img class="abs-cover" src="https://source.unsplash.com//category/people/800x600" />
							<div class="slideshow__metas slideshow__metas--secondary">
								<h1 class="h3 m-b">Hello World #3</h1>
								<p class="p m-b">
									Ut sollicitudin enim ac nibh tempor commodo. Phasellus a nunc congue, sollicitudin nibh molestie, rutrum ligula. Duis ex diam, finibus sed dictum sit amet, faucibus sollicitudin risus. Nam eget tortor.
								</p>
								<a href="#" class="btn btn--primary">
									More info...
								</a>
							</div>
						</div>
						<div s-slideshow-slide>
							<img class="abs-cover" src="https://source.unsplash.com//category/nature/800x600" />
							<div class="slideshow__metas slideshow__metas--success">
								<h1 class="h3 m-b">Hello World #4</h1>
								<p class="p m-b">
									Ut sollicitudin enim ac nibh tempor commodo. Phasellus a nunc congue, sollicitudin nibh molestie, rutrum ligula. Duis ex diam, finibus sed dictum sit amet, faucibus sollicitudin risus. Nam eget tortor.
								</p>
								<a href="#" class="btn btn--secondary">
									More info...
								</a>
							</div>
						</div>
					</s-slideshow>
					<a href="#" onclick="document.querySelector('s-slideshow').previous()" class="btn btn--secondary">
						Previous
					</a>
					<a href="#" onclick="document.querySelector('s-slideshow').next()" class="btn btn--primary">
						Next
					</a>
					<a href="#" onclick="document.querySelector('s-slideshow').goTo(3)" class="btn">
						Go to slide 3
					</a>
				</div>
			`
		},
		css : {
			language : 'sass',
			data : `
				@import 'node_modules/coffeekraken-sugar/index';
				@import 'index';
				@include s-init();
				@include s-classes();
				@include s-typography-classes();
				@include s-button-classes();
				body {
					background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
				}
				.container {
					@include s-position(absolute, middle, center);
					min-width:80vw;
				}
				@include s-slideshow-classes();
				s-slideshow {
					max-width: 1000px;
				}
				.slideshow__metas {
					padding: s-space(big);
					@include s-position(absolute, bottom);
					background : s-color(default);
					opacity:0;
					transform: translateY(100px);
					@include s-transition(-delay .4s);

					@each $color in (primary,secondary,success) {
						&.slideshow__metas--#{$color} {
							background : s-color($color);
						}
					}
					&, * { color: white; }

					[active] > & {
						opacity:1;
						transform: translateY(0);
					}
				}
				img {
					opacity:0;
					@include s-transition(slow);
					&[loaded] {
						opacity:1;
					}
				}
			`
		},
		js : {
			language : 'js',
			data : `
				import 'webcomponents.js/webcomponents-lite'
				import SSlideshowComponent from './dist/index'
			`
		}
	}
}
