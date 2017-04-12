# Coffeekraken s-slideshow-component <img src=".resources/coffeekraken-logo.jpg" height="25px" />

<p>
	<a href="https://travis-ci.org/Coffeekraken/s-slideshow-component">
		<img src="https://img.shields.io/travis/Coffeekraken/s-slideshow-component.svg?style=flat-square" />
	</a>
	<a href="https://www.npmjs.com/package/coffeekraken-s-slideshow-component">
		<img src="https://img.shields.io/npm/v/coffeekraken-s-datepicker.svg?style=flat-square" />
	</a>
	<a href="https://github.com/coffeekraken/s-slideshow-component/blob/master/LICENSE.txt">
		<img src="https://img.shields.io/npm/l/coffeekraken-s-datepicker.svg?style=flat-square" />
	</a>
	<!-- <a href="https://github.com/coffeekraken/s-slideshow-component">
		<img src="https://img.shields.io/npm/dt/coffeekraken-s-datepicker.svg?style=flat-square" />
	</a>
	<a href="https://github.com/coffeekraken/s-slideshow-component">
		<img src="https://img.shields.io/github/forks/coffeekraken/s-slideshow-component.svg?style=social&label=Fork&style=flat-square" />
	</a>
	<a href="https://github.com/coffeekraken/s-slideshow-component">
		<img src="https://img.shields.io/github/stars/coffeekraken/s-slideshow-component.svg?style=social&label=Star&style=flat-square" />
	</a> -->
	<a href="https://twitter.com/coffeekrakenio">
		<img src="https://img.shields.io/twitter/url/http/coffeekrakenio.svg?style=social&style=flat-square" />
	</a>
	<a href="http://coffeekraken.io">
		<img src="https://img.shields.io/twitter/url/http/shields.io.svg?style=flat-square&label=coffeekraken.io&colorB=f2bc2b&style=flat-square" />
	</a>
</p>

Create nice, simple and fully customizable slideshow.

## Features

- Maintain attributes on elements for easy styling
	- ```active``` : Attribute on the active slide
	- ```first``` : Attribute on the first slide
	- ```last``` : Attribute on the last slide
	- ```previous``` : Attribute on the previous slide
	- ```next``` : Attribute on the next slide
	- ```before-active``` : Attribute on each slides that are before the active one
	- ```after-active``` : Attribute on each slides that are after the active one
	- ```slide="{idx}"``` : Attribute on the slideshow itself that set the active slide
- Nice and easy API
- And more...

## Table of content

1. **[Demo](http://components.coffeekraken.io/app/s-slideshow-component)**
2. [Install](#readme-install)
3. [Get Started](#readme-get-started)
4. [Javascript API](doc/js)
5. [SASS API](doc/sass)
6. [Sugar Web Components Documentation](http://github.com/coffeekraken/sugar/doc/webcomponent.md)
7. [Browsers support](#readme-browsers-support)
8. [Contribute](#readme-contribute)
9. [Who are Coffeekraken?](#readme-who-are-coffeekraken)
10. [Licence](#readme-license)

<a name="readme-install"></a>
## Install

```
npm install https://git@github.com/coffeekraken/s-slideshow-component.git --save
```

<a name="readme-get-started"></a>
## Get Started

First, import the component into your javascript file like so:

```js
import SSlideshowComponent from 'coffeekraken-s-slideshow-component'
```

Then simply use it inside your html like so:

```html
<s-slideshow class="ratio-16-9 m-b" loop>
	<div s-slideshow-slide>
		<img class="abs-cover" src="https://source.unsplash.com/category/buildings/800x600" />
	</div>
	<div s-slideshow-slide active>
		<img class="abs-cover" src="https://source.unsplash.com//category/food/800x600" />
	</div>
	<div s-slideshow-slide>
		<img class="abs-cover" src="https://source.unsplash.com//category/people/800x600" />
	</div>
	<div s-slideshow-slide>
		<img class="abs-cover" src="https://source.unsplash.com//category/nature/800x600" />
	</div>
</s-slideshow>
```

If you need some styling to start with, you can generate it like so:

```scss
@import 'node_modules/coffeekraken-s-slideshow-component/index';
// only a base bare styling
@include s-slideshow-classes-bare();
// ...and optionally the visual styles
@include s-slideshow-classes-style();
// ...or generate directly the bare and style classes
@include s-slideshow-classes();
```

<a id="readme-browsers-support"></a>
## Browsers support

| [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/edge.png" alt="IE / Edge" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/firefox.png" alt="Firefox" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/chrome.png" alt="Chrome" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/safari.png" alt="Safari" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| --------- | --------- | --------- | --------- |
| IE11+ | last 2 versions| last 2 versions| last 2 versions

> As browsers are automatically updated, we will keep as reference the last two versions of each but this component can work on older ones as well.

> The webcomponent API (custom elements, shadowDOM, etc...) is not supported in some older browsers like IE10, etc... In order to make them work, you will need to integrate the [corresponding polyfill](https://www.webcomponents.org/polyfills).

<a id="readme-contribute"></a>
## Contribute

This is an open source project and will ever be! You are more that welcomed to contribute to his development and make it more awesome every day.
To do so, you have several possibilities:

1. [Share the love ❤️](https://github.com/Coffeekraken/coffeekraken/blob/master/contribute.md#contribute-share-the-love)
2. [Declare issues](https://github.com/Coffeekraken/coffeekraken/blob/master/contribute.md#contribute-declare-issues)
3. [Fix issues](https://github.com/Coffeekraken/coffeekraken/blob/master/contribute.md#contribute-fix-issues)
4. [Add features](https://github.com/Coffeekraken/coffeekraken/blob/master/contribute.md#contribute-add-features)
5. [Build web component](https://github.com/Coffeekraken/coffeekraken/blob/master/contribute.md#contribute-build-web-component)

<a id="readme-who-are-coffeekraken"></a>
## Who are Coffeekraken

We try to be **some cool guys** that build **some cool tools** to make our (and yours hopefully) **every day life better**.  

#### [More on who we are](https://github.com/Coffeekraken/coffeekraken/blob/master/who-are-we.md)

<a id="readme-license"></a>
## License

The code is available under the [MIT license](LICENSE.txt). This mean that you can use, modify, or do whatever you want with it. This mean also that it is shipped to you for free, so don't be a hater and if you find some issues, etc... feel free to [contribute](https://github.com/Coffeekraken/coffeekraken/blob/master/contribute.md) instead of sharing your frustrations on social networks like an asshole...
