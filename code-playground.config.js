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
					<s-slideshow class="ratio-16-9 m-b" loop timeout="5000">
						<div s-slideshow-slide>
							<img class="abs-cover" src="https://source.unsplash.com/category/buildings/800x600" />
							<div class="slideshow__metas">
								<h1 class="h5 m-b">Hello World #1</h1>
								<a href="#" class="btn btn--primary">
									More info...
								</a>
							</div>
						</div>
						<div s-slideshow-slide active>
							<img class="abs-cover" src="https://source.unsplash.com//category/food/800x600" />
							<div class="slideshow__metas slideshow__metas--primary">
								<h1 class="h5 m-b">Hello World #2</h1>
								<a href="#" class="btn btn--secondary">
									More info...
								</a>
							</div>
						</div>
						<div s-slideshow-slide id="my-cool-slide">
							<img class="abs-cover" src="https://source.unsplash.com//category/people/800x600" />
							<div class="slideshow__metas slideshow__metas--secondary">
								<h1 class="h5 m-b">Hello World #3</h1>
								<a href="#" class="btn btn--primary">
									More info...
								</a>
							</div>
						</div>
						<div s-slideshow-slide>
							<img class="abs-cover" src="https://source.unsplash.com//category/nature/800x600" />
							<div class="slideshow__metas slideshow__metas--success">
								<h1 class="h5 m-b">Hello World #4</h1>
								<a href="#" class="btn btn--secondary">
									More info...
								</a>
							</div>
						</div>

						<div s-slideshow-next class="slideshow__next">></div>
						<div s-slideshow-previous class="slideshow__previous"><</div>

						<ul class="slideshow__navigation">
							<li class="slideshow__navigation-item" s-slideshow-goto="0"></li>
							<li class="slideshow__navigation-item" s-slideshow-goto="1"></li>
							<li class="slideshow__navigation-item" s-slideshow-goto="2"></li>
							<li class="slideshow__navigation-item" s-slideshow-goto="3"></li>
						</ul>

					</s-slideshow>
					<a href="#" onclick="document.querySelector('s-slideshow').previous()" class="btn btn--secondary">
						Previous
					</a>
					<a href="#" onclick="document.querySelector('s-slideshow').next()" class="btn btn--primary">
						Next
					</a>
					<a href="#" onclick="document.querySelector('s-slideshow').goTo(3)" class="btn">
						Go to slide 4
					</a>
					<a href="#" onclick="document.querySelector('s-slideshow').goTo('my-cool-slide')" class="btn">
						Go to "my-cool-slide"
					</a>
				</div>
			`
		},
		css : {
			language : 'sass',
			data : `
				@import 'node_modules/coffeekraken-sugar/index';
				@import 'node_modules/coffeekraken-s-typography-component/index';
				@import 'node_modules/coffeekraken-s-button-component/index';
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
					padding: s-space(medium);
					width:100%;
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

				.slideshow__next,
				.slideshow__previous {
					font-size: s-rem(30px);
					color: white;
					position:absolute;
					top:33%;
					transform: translateY(-50%);
					z-index:10;
					background-color: s-color(black, -opacity .5);
					display:inline-block;
					padding:6px 15px 10px 15px;
					line-height: 1;
					user-select: none;
					cursor: pointer;

					&:hover {
						background-color: s-color(black, -opacity .8);
					}
				}
				.slideshow__next {
					right:0;
				}

				.slideshow__navigation {
					position:absolute;
					bottom:s-rem(10px); left:0;
					width: 100%;
					z-index:10;
					text-align: center;
				}
					.slideshow__navigation-item {
						display: inline-block;
						width: s-rem(8px); height: s-rem(8px);
						background-color: s-color(white, -opacity .3);
						border-radius: s-rem(4px);
						cursor: pointer;

						&:hover,
						&[active] {
							background-color: s-color(white, -opacity 1);
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
