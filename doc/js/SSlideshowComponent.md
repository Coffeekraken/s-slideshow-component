# SSlideshowComponent

Extends **SWebComponent**

Create nice, simple and fully customizable slideshow.

Features:
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



### Example
```html
	<s-slideshow loop>
	<div s-slideshow-slide>
 <img class="abs-cover" src="https://source.unsplash.com/category/buildings/800x600" />
 </div>
 <div s-slideshow-slide>
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
Author : Olivier Bossel <olivier.bossel@gmail.com>




## Attributes

Here's the list of available attribute to set on the element.

### slide

Set the active slide by index

Type : **{ Integer }**

Default : **null**


### loop

Set if the slideshow is infinite

Default : **false**


### onInit

Callback when the slideshow is inited

Type : **{ [Function](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Function) }**

Default : **null**


### beforeChange

Callback before the slideshow pass to another slide

Type : **{ [Function](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Function) }**

Default : **null**


### onChange

Callback when the slider change from a slide to another

Type : **{ [Function](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Function) }**

Default : **null**


### afterChange

Callback when the slideshow has changed slide

Type : **{ [Function](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Function) }**

Default : **null**


### initSlide

Callback used to init a new slide

Type : **{ [Function](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Function) }**




## Methods


### destroy

When the element is destroyed


### next

Go to next slide


### previous

Go to previous slide


### goTo

Go to a specific slide


Name  |  Type  |  Description  |  Status  |  Default
------------  |  ------------  |  ------------  |  ------------  |  ------------
slideIndex  |  **{ Integer }**  |  The slide index to go to  |  required  |

Return **{ SSlideshowComponent }** The instance itself


### onNewSlide

Register a function to init a new slide


Name  |  Type  |  Description  |  Status  |  Default
------------  |  ------------  |  ------------  |  ------------  |  ------------
initer  |  **{ [Function](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Function) }**  |  The initer function  |  required  |


### getBeforeActiveSlides

Return all the slides that are before the active one

Return **{ [Array](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Array) }** The array of slides that are before the active one


### getAfterActiveSlides

Return all the slides that are before the active one

Return **{ [Array](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Array) }** The array of slides that are before the active one


### getActiveSlideIndex

Return the index of the active slide

Return **{ Integer }** The active slide index


### getActiveSlide

Return the active slide element

Return **{ [HTMLElement](https://developer.mozilla.org/fr/docs/Web/API/HTMLElement) }** The active slide


### getFirstSlide

Return the first slide element

Return **{ [HTMLElement](https://developer.mozilla.org/fr/docs/Web/API/HTMLElement) }** The first slide


### getLastSlide

Return the last slide element

Return **{ [HTMLElement](https://developer.mozilla.org/fr/docs/Web/API/HTMLElement) }** The last slide


### getNextSlideIndex

Return the next slide index

Return **{ Integer }** The next slide index


### getNextSlide

Return the previous slide element

Return **{ [HTMLElement](https://developer.mozilla.org/fr/docs/Web/API/HTMLElement) }** The previous slide


### getPreviousSlideIndex

Return the previous slide index

Return **{ Integer }** The previous slide index


### getPreviousSlide

Return the previous slide element

Return **{ [HTMLElement](https://developer.mozilla.org/fr/docs/Web/API/HTMLElement) }** The previous slide


### isLoop

Return if the slideshow loop status is true

Return **{ [Boolean](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Boolean) }** The loop status


### isFirst

Return if the first slide is active

Return **{ [Boolean](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Boolean) }** true if the first slide is active


### isLast

Return if the first slide is active

Return **{ [Boolean](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Boolean) }** true if the first slide is active