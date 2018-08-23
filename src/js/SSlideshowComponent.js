import SWebComponent from 'coffeekraken-sugar/js/core/SWebComponent'
import querySelectorLive from 'coffeekraken-sugar/js/dom/querySelectorLive'
import __isInViewport from 'coffeekraken-sugar/js/dom/isInViewport'
import __autoCast from 'coffeekraken-sugar/js/utils/string/autoCast'
import _find from 'lodash/find'
import __onSwipe from 'coffeekraken-sugar/js/dom/onSwipe'
import __dispatchEvent from 'coffeekraken-sugar/js/dom/dispatchEvent';
import __debounce from 'coffeekraken-sugar/js/utils/functions/debounce';
import __mutationObservable from 'coffeekraken-sugar/js/dom/mutationObservable';
import STimer from 'coffeekraken-sugar/js/classes/STimer'
import 'coffeekraken-sugar/js/utils/rxjs/operators/groupByTimeout';

/**
 * @name 		SSlideshowComponent
 * @extends 	SWebComponent
 * Create nice, simple and fully customizable slideshow.
 *
 * Features:
 * - Maintain attributes on elements for easy styling
 * 	- ```active``` : Attribute on the active slide
 * 	- ```first``` : Attribute on the first slide
 * 	- ```last``` : Attribute on the last slide
 * 	- ```previous``` : Attribute on the previous slide
 * 	- ```next``` : Attribute on the next slide
 * 	- ```before-active``` : Attribute on each slides that are before the active one
 * 	- ```after-active``` : Attribute on each slides that are after the active one
 * 	- ```slide="{idx}"``` : Attribute on the slideshow itself that set the active slide idx
 * 	- ```slide-id="{id}"``` : Attribute on the slideshow itself that set the active slide id
 * 	- ```last``` : Attribute on the slideshow itself when the slideshow is at the last slide
 * 	- ```first``` : Attribute on the slideshow itself when the slideshow is at the first slide
 * - Nice and easy API
 * - And more...
 *
 *
 * @example 		html
 * <s-slideshow loop>
 * 	<div s-slideshow-slide>
 *	 <img class="abs-cover" src="https://source.unsplash.com/category/buildings/800x600" />
 *  </div>
 *  <div s-slideshow-slide>
 *	 <img class="abs-cover" src="https://source.unsplash.com//category/food/800x600" />
 *  </div>
 *  <div s-slideshow-slide>
 *	 <img class="abs-cover" src="https://source.unsplash.com//category/people/800x600" />
 *  </div>
 *  <div s-slideshow-slide>
 *	 <img class="abs-cover" src="https://source.unsplash.com//category/nature/800x600" />
 *  </div>
 * </s-slideshow>
 *
 * @author 		Olivier Bossel <olivier.bossel@gmail.com>
 */

/**
 * @name 	beforeChange
 * Dispatched before the change happen
 * @event
 */

 /**
 * @name 	change
 * Dispatched when the change happen
 * @event
 */

 /**
 * @name 	afterChange
 * Dispatched after the change has happened
 * @event
 */

export default class SSlideshowComponent extends SWebComponent {

	/**
	 * Default props
	 * @definition 		SWebComponent.defaultProps
	 * @protected
	 */
	static get defaultProps() {
		return {

			/**
			 * Set the active slide by index
			 * @prop
			 * @type 		{Integer}
			 */
			slide : null,

			/**
			 * Set the slide by id and not by idx as for the slide prop
			 * @prop
			 * @type 		{String}
			 */
			slideId : null,

			/**
			 * Set if the slideshow is infinite
			 * @prop
			 * @tyoe 	{Boolean}
			 */
			loop : false,

			/**
			 * Set if want that the plugin set the height of the s-slideshow tag accordingly to the active slide height.
			 * This is usefull for js animations etc...
			 * If set as string, it will be treated as a css selector to get the element inside the slider on which to apply the slide height
			 * @prop
			 * @type 	{Boolean|String}
			 */
			applySlideHeight : false,

			/**
			 * Callback when the slideshow is inited
			 * @prop
			 * @type 	{Function}
			 */
			onInit : null,

			/**
			 * Callback before the slideshow pass to another slide
			 * @prop
			 * @type 	{Function}
			 */
			beforeChange : null,

			/**
			 * Callback when the slider change from a slide to another
			 * @prop
			 * @type 	{Function}
			 */
			onChange : null,

			/**
			 * Callback when the slideshow has changed slide
			 * @prop
			 * @type 	{Function}
			 */
			afterChange : null,

			/**
			 * Callback used to init a new slide
			 * @prop
			 * @type 	{Function}
			 */
			initSlide : null,

			/**
			 * Change slide when click on the slideshow depending on the props.direction setting.
			 * Will not trigger slide change if the user want to select something in the slide or that
			 * he clicked on an interactive item like a link, button, textarea, input or select.
			 * @prop
			 * @type 	{Boolean}
			 */
			nextOnClick : false,

			/**
			 * Set the direction of the slideshow when click
			 * @prop
			 * @type 		{String}
			 * @values 		forward|backward
			 */
			direction : 'forward',

			/**
			 * Timeout between each slides
			 * @prop
			 * @type 	{Number}
			 */
			timeout : null,

			/**
			 * Specify if need to pause the timer on hover
			 * @prop
			 * @type 	{Boolean}
			 */
			pauseOnHover : true,

			/**
			 * Set if the keyboard navigation is enabled
			 * @prop
			 * @type 	{Boolean}
			 */
			keyboardEnabled : true,

			/**
			 * Set if the touch navigation is enabled
			 * @prop
			 * @type 	{Boolean}
			 */
			touchEnabled : true

		};
	}

	/**
	 * Physical props
	 * @definition 		SWebComponent.physicalProps
	 * @protected
	 */
	static get physicalProps() {
		return ['slide', 'slideId'];
	}

	/**
	 * Css
	 * @protected
	 */
	static defaultCss(componentName, componentNameDash) {
		return `
			${componentNameDash} {
				display : block;
			}
		`;
	}

	/**
	 * Component will mount
 	 * @definition 		SWebComponent.componentWillMount
	 * @protected
	 */
	componentWillMount() {
		super.componentWillMount();

		/**
		 * Store all the slides elements
		 * @type 	{Array}
		 * @private
		 */
		this._slides = [];

		/**
		 * Store all the slides initer functions
		 * @type 	{Array}
		 * @private
		 */
		this._slidesIniter = [];

		/**
		 * Store the active slide
		 * @type 	{DOMElement}
		 * @private
		 */
		this._activeSlide = null;

		/**
		 * Store the elements references like navigation, etc...
		 * @type 	{Object}
		 * @private
		 */
		this._refs = {
			next : null, 				// the next button
			previous : null,			// the previous button
			totals : [],				// all the totals tokens
			currents : [], 				// all the currents tokens
			goTos : [] 					// all the goto elements
		};

		this._changeSlideTimeout = null;
	}

	/**
	 * Mount component
	 * @definition 		SWebComponent.componentMount
	 * @protected
	 */
	componentMount() {
		super.componentMount();

		// update references
		this._updateReferences();

		// update slides references
		this._slides = this._getSlides();

		// monitor new slides
		this._monitorNewSlides();

		// onInit callback
		this.props.onInit && this.props.onInit(this);

		// store the onResize debounced function
		this._onResizeDebouncedFn = __debounce(this._applyCurrentSlideHeightToSlideshow.bind(this), 250)
		this._onSlideContentLoadedFn = this._onSlideContentLoaded.bind(this);
		this._onKeyUpFn = this._onKeyup.bind(this);

		// enable
		setTimeout(() => {
			this._enable();
		});
	}

	/**
	 * Component unmount
	 * @definition 		SWebComponent.componentUnmount
	 * @protected
	 */
	componentUnmount() {
		super.componentUnmount();
		this._disable();
	}

	/**
	 * Component will receive prop
	 * @definition 		SWebComponent.componentWillReceiveProp
	 * @protected
	 */
	componentWillReceiveProp(name, newVal, oldVal) {
		if (newVal === undefined || newVal === null) return;
		switch(name) {
			case 'slide':
			case 'slideId':
				clearTimeout(this._changeSlideTimeout);
				this._changeSlideTimeout = setTimeout(() => {
					this._goTo(newVal);
				});
				if (this._timer) this._timer.reset( ! this._isMouseover);
			break;
			case 'timeout':
				// if there's not timeout anymore
				// stop the timer if needed
				if ( ! newVal && this._timer) {
					this._timer.stop();
					this._timer.destroy();
					this._timer = null;
					return;
				}
				// create the timer if not any
				if ( ! this._timer) {
					this._timer = this._createTimer(newVal);
					return;
				}
				// otherwise, simply set the new dureation of the timer
				this._timer.duration(newVal);
			break;
			case 'applySlideHeight':
				if ( ! newVal) this.style.height = null;
				else this._applyCurrentSlideHeightToSlideshow()
			break;
		}
	}

	/**
	 * Render the component
	 * Here goes the code that reflect the this.props state on the actual html element
	 * @definition 		SWebComponent.render
	 * @protected
	 */
	render() {
		super.render();
	}

	/**
	 * When the element is enabled
	 * @return 	{SSlideshowComponent}
	 */
	_enable() {
		// if need to apply the slideshow height according to the slide one,
		// listen on window resize to reapply it correctly
		if (this.props.applySlideHeight) this._enableApplySlideHeight()

		// no transmation
		this.classList.add('clear-transmations');

		// next
		this.next();

		// remove the no transmation class to allow animations, etc...
		setTimeout(() => {
			this.classList.remove('clear-transmations');
		});

		// listen for click on element
		this.addEventListener('click', this._onClick.bind(this));

		// enable keyboard navigation
		if (this.props.keyboardEnabled) this._initKeyboardNavigation();

		// init touch navigation
		this._initTouchNavigation();

		this.addEventListener('mousedown', this._onMousedown.bind(this));
		this.addEventListener('mouseup', this._onMouseup.bind(this));
		this.addEventListener('mouseenter', this._onMouseover.bind(this));
		this.addEventListener('mouseleave', this._onMouseout.bind(this));

		// init the previous and next navigation
		this._initPreviousAndNextButtons();

		// timeout
		if (this.props.timeout) {
			this._timer = this._createTimer(this.props.timeout);
		}

		// maintain chainability
		return this;
	}

	/**
	 * When the element is disabled
	 * @return 	{SSlideshowComponent}
	 */
	_disable() {
		if (this.props.applySlideHeight) this._disableApplySlideHeight()

		// remove all classes
		this._unapplyStateAttrubutes();

		// disable keyboard navigation
		document.removeEventListener('keyup', this._onKeyUpFn);

		// disable mouse navigation
		this.removeEventListener('mousedown', this._onMousedown);
		this.removeEventListener('mouseup', this._onMouseup);
		this.removeEventListener('mouseenter', this._onMouseover);
		this.removeEventListener('mouseleave', this._onMouseout);

		// do not listen for click anymore
		this.removeEventListener('click', this._onClick);
		this._refs.previous && this._refs.previous.removeEventListener('click', this._onPreviousClick);
		this._refs.next && this._refs.next.removeEventListener('click', this._onNextClick);

		// maintain chainability
		return this;
	}

	/**
	 * Create a timer
	 */
	_createTimer(timeout) {
		const timer = new STimer(timeout, {
			loop : true,
			tickCount : 1
		});
		timer.onTick(() => {
			if (this.props.direction === 'forward') this.next();
			else this.previous();
		});
		timer.start();
		return timer;
	}

	/**
	 * Enable apply slide height
	 */
	_enableApplySlideHeight() {
		// listen for window resize to resize the slideshow if needed
		window.addEventListener('resize', this._onResizeDebouncedFn);

		// listen for content of the slideshow being loaded like images, etc...
		this.addEventListener('load', this._onSlideContentLoadedFn, true);
	}

	/**
	 * Disable apply slide height
	 */
	_disableApplySlideHeight() {
		window.removeEventListener('resize', this._onResizeDebouncedFn);
		this.removeEventListener('load', this._onSlideContentLoadedFn, true);
	}

	/**
	 * On images, etc... are loaded inside the slideshow
	 */
	_onSlideContentLoaded(e) {
		this._applyCurrentSlideHeightToSlideshow();
	}

	/**
	 * Apply the current slide height to the slideshow element itself
	 */
	_applyCurrentSlideHeightToSlideshow() {

		if ( ! this.getActiveSlide()) return

		this.mutate(() => {
			if ( ! this._applyCurrentSlideHeightToSlideshowTarget && typeof(this.props.applySlideHeight) === 'string') {
				// get the target to apply the height on
				this._applyCurrentSlideHeightToSlideshowTarget = this.querySelector(this.props.applySlideHeight);
			} else if ( ! this._applyCurrentSlideHeightToSlideshowTarget) {
				this._applyCurrentSlideHeightToSlideshowTarget = this;
			}

			const activeSlideHeight = this.getActiveSlide().offsetHeight;
			if ( ! this._applyCurrentSlideHeightToSlideshowTarget) return;
			if ( ! activeSlideHeight) return
			this._applyCurrentSlideHeightToSlideshowTarget.style.height = activeSlideHeight + 'px'
		});
	}

	/**
	 * When the user click on the slideshow
	 * @param 	{Event} 	e 	The event
	 */
	_onClick(e) {

		// check if we click on a goto element
		let goTo = e.target.getAttribute(`${this._componentNameDash}-goto`);
		if (goTo) {
			// autocast
			goTo = __autoCast(goTo);
			this.goTo(goTo);
		} else if (
			e.target.nodeName.toLowerCase() !== 'a'
			&& e.target.nodeName.toLowerCase() !== 'button'
			&& e.target.nodeName.toLowerCase() !== 'input'
			&& e.target.nodeName.toLowerCase() !== 'textarea'
			&& e.target.nodeName.toLowerCase() !== 'select'
		) {
			// do something only if the prop nextOnClick is true
			if (this.props.nextOnClick) {

				// a click must be lower than 200 ms,
				// otherwise we stop here
				if (this._mouseupTimestamp && this._mousedownTimestamp) {
					if (this._mouseupTimestamp - this._mousedownTimestamp > 200) {
						return;
					}
				}

				// check direction and respond accordingly
				if (this.props.direction === 'forward') {
					this.next();
				} else {
					this.previous();
				}
			}
		}
	}

	/**
	 * When the user has clicked on the next button
	 * @param 	{Event} 	e 	The event
	 */
	_onNextClick(e) {
		e.preventDefault();
		e.stopPropagation();
		this.next();
	}

	/**
	 * When the mouse enter the slideshow
	 * @param 	{Event} 	e 	The event
	 */
	_onMouseover(e) {
		// pause timer
		this._isMouseover = true;
		if (this._timer && this.props.pauseOnHover) this._timer.pause();
	}

	/**
	 * When the mouse leave the slideshow
	 * @param 	{Event} 	e 	The event
	 */
	_onMouseout(e) {
		this._isMouseover = false;
		if (this._timer && this.props.pauseOnHover) this._timer.start();
	}

	/**
	 * When the user has clicked on the previous button
	 * @param 	{Event} 	e 	The event
	 */
	_onPreviousClick(e) {
		e.preventDefault();
		e.stopPropagation();
		this.previous();
	}

	/**
	 * When the user has clicked down on the slideshow
	 * @param 	{Event} 	e 	The event
	 */
	_onMousedown(e) {
		this._mousedownTimestamp = new Date().getTime();
	}

	/**
	 * When the user has clicked down on the slideshow
	 * @param 	{Event} 	e 	The event
	 */
	_onMouseup(e) {
		this._mouseupTimestamp = new Date().getTime();
	}

	/**
	 * Monitor for new slides
	 */
	_monitorNewSlides() {
		__mutationObservable(this, {
			childList : true
		}).groupByTimeout().subscribe((mutations) => {
			const mutation = mutations[0];
			let needUpdateSlides = false;
			if (mutation.addedNodes) {
				mutation.addedNodes.forEach((node) => {
					if ( ! node.tagName || needUpdateSlides) return;
					if (
						node.hasAttribute(`${this._componentNameDash}-slide`)
						|| node.tagName.toLowerCase() === `${this._componentNameDash}-slide`
					) {
						needUpdateSlides = true;
					}
				});
			}
			if (mutation.removedNodes) {
				mutation.removedNodes.forEach((node) => {
					if ( ! node.tagName || needUpdateSlides) return;
					if (
						node.hasAttribute(`${this._componentNameDash}-slide`)
						|| node.tagName.toLowerCase() === `${this._componentNameDash}-slide`
					) {
						needUpdateSlides = true;
					}
				});
			}
			if (needUpdateSlides) {
				this._slides = this._getSlides();
			}
		});
	}

	/**
	 * Init a new slide
	 */
	_initSlide(slide) {
		// do not init slide twice
		if (slide._sSlideshowInited) return;
		slide._sSlideshowInited = true;
		// callback if exist
		this.props.initSlide && this.props.initSlide(slide);
		// slides initer
		this._slidesIniter.forEach((initer) => {
			initer(slide);
		});
	}

	/**
	 * Remove the attributes from the elements
	 */
	_unapplyStateAttrubutes() {
		this.mutate(() => {
			// unactivate all the slides
			this._slides.forEach((slide) => {
				slide.removeAttribute('active');
				slide.removeAttribute('before-active');
				slide.removeAttribute('after-active');
				slide.removeAttribute('next');
				slide.removeAttribute('previous');
				slide.removeAttribute('first');
				slide.removeAttribute('last');
			});
			// remove the active class on all goto
			[].forEach.call(this._refs.goTos, (goTo) => {
				goTo.removeAttribute('active');
			});
			// remove attributes on the slideshow itself
			this.removeAttribute('last');
			this.removeAttribute('first');
		});
	}

	/**
	 * Apply the good attributes to the elements
	 */
	_applyStateAttributes() {
		this.mutate(() => {
			// activate the current slide
			this._activeSlide.setAttribute('active', true);
			// goto classes
			[].forEach.call(this._refs.goTos, (goTo) => {
				const slide = goTo.getAttribute(`${this._componentNameDash}-goto`);
				const idx = this._getSlideIdxById(slide);
				if (idx === parseInt(this.props.slide)) {
					goTo.setAttribute('active', true);
				}
			});
			// add the next and previous classes
			if (this.getPreviousSlide()) {
				if ( ! this.getPreviousSlide().hasAttribute('previous')) {
					this.getPreviousSlide().setAttribute('previous', true);
				}
			}
			if (this.getNextSlide()) {
				if ( ! this.getNextSlide().hasAttribute('next')) {
					this.getNextSlide().setAttribute('next', true);
				}
			}
			// apply the first and last classes
			if (this.getFirstSlide()) {
				if ( ! this.getFirstSlide().hasAttribute('first')) {
					this.getFirstSlide().setAttribute('first', true);
				}
			}
			if (this.getLastSlide()) {
				if ( ! this.getLastSlide().hasAttribute('last')) {
					this.getLastSlide().setAttribute('last', true);
				}
			}
			// apply the beforeActiveClass
			this.getBeforeActiveSlides().forEach((slide) => {
				if ( ! slide.hasAttribute('before-active') ) {
					slide.setAttribute('before-active', true);
				}
			});
			// apply the afterActiveClass
			this.getAfterActiveSlides().forEach((slide) => {
				if ( ! slide.hasAttribute('after-active') ) {
					slide.setAttribute('after-active', true);
				}
			});
			// first and last attribute on the slideshow itself
			if (this.isLast()) {
				this.setAttribute('last', true);
			}
			if (this.isFirst()) {
				this.setAttribute('first', true);
			}
		});
	}

	/**
	 * Get slide idx by id
	 * @param 		{String} 		id 		The slide id
	 * @return 		{Integer} 				The slide idx
	 */
	_getSlideIdxById(id) {
		// autocast the id
		id = __autoCast(id);
		// if the id is already an integer idx
		if (typeof(id) === 'number') return id;
		// if is a string
		if (typeof(id) === 'string') {
			// find the slide
			const slideElm = _find(this._slides, (sld) => {
				return sld.id === id.replace('#','');
			});
			if (slideElm) {
				return this._slides.indexOf(slideElm);
			}
		}
		// by default, return first slide
		return 0;
	}

	/**
	 * Apply the differents tokens available to use in the html template
	 */
	_injectDynamicValuesInHtml() {
		// apply current
		if (this._refs.current) {
			[].forEach.call(this._refs.current, (current) => {
				current.innerHTML = parseInt(this.props.slide) + 1;
			});
		}
		// apply total
		if (this._refs.total) {
			[].forEach.call(this._refs.total, (total) => {
				total.innerHTML = this._slides.length;
			});
		}
	}

	/**
	 * Loop on slides to find the first one that has the active class
	 * @return 	{HTMLElement} 	The first active class
	 */
	_findActiveSlideByAttributes() {
		for(let i=0; i<this._slides.length; i++) {
			const slide = this._slides[i];
			if (slide.hasAttribute('active')) {
				return slide;
			}
		}
		return null;
	}

	/**
	 * Init the previous and next buttons
	 */
	_initPreviousAndNextButtons() {
		// if the next element exist
		if (this._refs.next) {
			this._refs.next.addEventListener('click', this._onNextClick.bind(this));
		}
		// if the previous element exist
		if (this._refs.previous) {
			this._refs.previous.addEventListener('click', this._onPreviousClick.bind(this));
		}
	}

	/**
	 * Init the keyboard navigation
	 */
	_initKeyboardNavigation() {
		// listen for keyup event
		document.addEventListener('keyup', this._onKeyUpFn);
	}

	/**
	 * Init the touch navigation
	 */
	_initTouchNavigation() {
		// listen for swiped
		__onSwipe(this, (swipeNfo) => {
			// if the touch navigation is not enabled, stop here
			if ( ! this.props.touchEnabled) return;
			// check the swipe direction
			if (swipeNfo.left) {
				this.next();
			} else if (swipeNfo.right) {
				this.previous();
			}
		});
	}

	/**
	 * When the user has released a keyboard key
	 * @param 	{Event} 	e 	The event
	 */
	_onKeyup(e) {
		// do nothing if the keyboard navigation if not enabled
		if ( ! this.props.keyboardEnabled) return;

		// do nothing if the slideshow is not in viewport
		if ( ! __isInViewport(this)) return;

		// check the key
		switch(e.keyCode) {
			case 39: // right arrow
				this.next();
			break;
			case 37: // left arrow
				this.previous();
			break;
		}
	}

	/**
	 * Go to next slide
	 * @return 	{SSlideshowComponent}
	 */
	next() {
		// stop if the document is hidden
		if (document.hidden) return;

		// get the current active slide index
		const idx = this.props.slide;

		// if the slideshow is at his first time
		let activeSlideIndex = this._slides.length-1;
		if (idx === null) {
			// try to find a slide that has the active class
			const activeSlide = this._findActiveSlideByAttributes();
			if (activeSlide) {
				activeSlideIndex = this._slides.indexOf(activeSlide);
			} else {
				activeSlideIndex = 0;
			}
		} else if (parseInt(idx) + 1 < this._slides.length) {
			activeSlideIndex = parseInt(idx)+1;
		} else if (this.props.loop) {
		   activeSlideIndex = 0;
		}

		// check if the slide has an id
		let slideId = null;
		if (this._slides[activeSlideIndex].hasAttribute('id')) {
			slideId = this._slides[activeSlideIndex].id;
		}

		// set slide prop
		this.setProps({
			'slide': activeSlideIndex,
			'slideId' : slideId
		});

		// onNext callback
		this.props.onNext && this.props.onNext(this);

		// maintain chainability
		return this;
	}

	/**
	 * Go to previous slide
	 * @return 	{SSlideshowComponent}
	 */
	previous() {

		// stop if the document is hidden
		if (document.hidden) return;

		// get the current active slide index
		const idx = this.props.slide;

		// if the slideshow is at his first time
		let activeSlideIndex = 0;
		if (idx === null) {
			// try to find a slide that has the active class
			const activeSlide = this._findActiveSlideByAttributes();
			if (activeSlide) {
				activeSlideIndex = this._slides.indexOf(activeSlide);
			} else {
				activeSlideIndex = 0;
			}
		} else if (parseInt(idx) - 1 >= 0) {
			activeSlideIndex = parseInt(idx)-1;
		} else if (this.props.loop) {
			activeSlideIndex = this._slides.length-1;
		}

		// check if the slide has an id
		let slideId = null;
		if (this._slides[activeSlideIndex].hasAttribute('id')) {
			slideId = this._slides[activeSlideIndex].id;
		}

		// set slide prop
		this.setProps({
			'slide': activeSlideIndex,
			'slideId' : slideId
		});

		// onPrevious callback
		this.props.onPrevious && this.props.onPrevious(this);

		// maintain chainability
		return this;
	}

	/**
	 * Go to a specific slide
	 * @param 	{Integer} 	slide 	The slide index to go to or the slide id
	 * @return 	{SSlideshowComponent} 	The instance itself
	 */
	goTo(slide) {
		// get the slide idx
		const slideIndex = this._getSlideIdxById(slide);
		// check the slide index
		if ( slideIndex >= this._slides.length) {
			throw `The slide ${slideIndex} does not exist...`;
		}

		// check if the slide has an id
		let slideId = null;
		if (this._slides[slideIndex].hasAttribute('id')) {
			slideId = this._slides[slideIndex].id;
		}

		// set slide prop
		this.setProps({
			'slide': slideIndex,
			'slideId' : slideId
		});
	}
	_goTo(slide) {

		// transform potential slide id in slide idx
		const slideIndex = this._getSlideIdxById(slide);

		// check the slide index
		if ( slideIndex >= this._slides.length) {
			throw `The slide ${slideIndex} does not exist...`;
		}
		// beforeChange callback
		this.props.beforeChange && this.props.beforeChange(this);

		// event
		__dispatchEvent(this, 'beforeChange');

		// unapply classes
		this._unapplyStateAttrubutes();

		// active the good slide
		this._activeSlide = this._slides[slideIndex];

		// if need to apply the current slide height,
		// do it now
		if (this.props.applySlideHeight) {
			this._applyCurrentSlideHeightToSlideshow();
		}

		// apply total and current tokens
		this._injectDynamicValuesInHtml();

		// onChange callback
		this.props.onChange && this.props.onChange(this);

		// change event
		__dispatchEvent(this, 'change');

		// apply classes
		this._applyStateAttributes();

		// afterChange callback
		this.props.afterChange && this.props.afterChange(this);

		// event
		__dispatchEvent(this, 'afterChange');

		// maintain chainability
		return this;
	}

	/**
	 * Register a function to init a new slide
	 * @param 	{Function} 	initer 	The initer function
	 * @return 	{SSlideshowComponent}
	 */
	onNewSlide(callback) {
		if (this._slidesIniter.indexOf(callback) === -1) {
			this._slidesIniter.push(callback);
		}
	}

	/**
	 * Return all the slides that are before the active one
	 * @return 	{Array} 	The array of slides that are before the active one
	 */
	getBeforeActiveSlides() {
		const activeIdx = this.props.slide;
		const newArray = this._slides.slice(0);
		newArray.splice(activeIdx, 1000);
		return newArray;
	}

	/**
	 * Return all the slides that are before the active one
	 * @return 	{Array} 	The array of slides that are before the active one
	 */
	getAfterActiveSlides() {
		const activeIdx = this.props.slide;
		const newArray = this._slides.slice(0);
		newArray.splice(0, activeIdx + 1);
		return newArray;
	}

	/**
	 * Return the index of the active slide
	 * @return 	{Integer}	The active slide index
	 */
	getActiveSlideIndex() {
		return parseInt(this.props.slide);
	}

	/**
	 * Return the active slide element
	 * @return 	{HTMLElement} 	The active slide
	 */
	getActiveSlide() {
		return this._activeSlide;
	}

	/**
	 * Return the first slide element
	 * @return 	{HTMLElement} 	The first slide
	 */
	getFirstSlide() {
		return this._slides[0];
	}

	/**
	 * Return the last slide element
	 * @return 	{HTMLElement} 	The last slide
	 */
	getLastSlide() {
		return this._slides[this._slides.length - 1];
	}

	/**
	 * Return the next slide index
	 * @return 	{Integer} 	The next slide index
	 */
	getNextSlideIndex() {
		const activeSlideIndex = parseInt(this.props.slide);
		if (activeSlideIndex + 1 < this._slides.length) {
			return activeSlideIndex + 1;
		} else {
			return 0;
		}
	}

 	/**
	 * Return the previous slide element
	 * @return 	{HTMLElement} 	The previous slide
	 */
	getNextSlide() {
		return this._slides[this.getNextSlideIndex()];
	}

	/**
	 * Return the previous slide index
	 * @return 	{Integer} 	The previous slide index
	 */
	getPreviousSlideIndex() {
		const activeSlideIndex = parseInt(this.props.slide);
		if (activeSlideIndex > 0) {
			return activeSlideIndex - 1;
		} else {
			return this._slides.length - 1;
		}
	}

 	/**
	 * Return the previous slide element
	 * @return 	{HTMLElement} 	The previous slide
	 */
	getPreviousSlide() {
		return this._slides[this.getPreviousSlideIndex()];
	}

	/**
	 * Return if the slideshow loop status is true
	 * @return 	{Boolean} 	The loop status
	 */
	isLoop() {
		return this.props.loop;
	}

	/**
	 * Return if the first slide is active
	 * @return 	{Boolean} 	true if the first slide is active
	 */
	isFirst() {
		return this._slides[0].hasAttribute('active');
	}

	/**
	 * Return if the first slide is active
	 * @return 	{Boolean} 	true if the first slide is active
	 */
	isLast() {
		return this._slides[this._slides.length-1].hasAttribute('active');
	}

	/**
	 * Go find the slides of the slideshow
	 * @return 	{Array} 	The array of slides found
	 */
	_getSlides() {
		// grab the slides and maintain stack up to date
		let slides = [].slice.call(this.querySelectorAll(`${this._componentNameDash}-slide, [${this._componentNameDash}-slide]`));
		// init slides
		slides.forEach((slide) => {
			this._initSlide(slide);
		});
		// return the slides
		return slides;
	}

	/**
     * Go find into dom every elements needed for the slideshow
     * @return 	{void}
	 */
	_updateReferences() {
		// grab the total and current token handler
		this._refs.total = this.querySelectorAll(`${this._componentNameDash}-total, [${this._componentNameDash}-total]`);
		this._refs.current = this.querySelectorAll(`${this._componentNameDash}-current, [${this._componentNameDash}-current]`);
		// grab all the goto elements
		this._refs.goTos = this.querySelectorAll(`${this._componentNameDash}-goto, [${this._componentNameDash}-goto]`);
		// grab the next and previous element
		this._refs.next = this.querySelector(`${this._componentNameDash}-next, [${this._componentNameDash}-next]`);
		this._refs.previous = this.querySelector(`${this._componentNameDash}-previous, [${this._componentNameDash}-previous]`);
	}
}
