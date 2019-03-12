"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _SWebComponent2 = require("coffeekraken-sugar/js/core/SWebComponent");

var _SWebComponent3 = _interopRequireDefault(_SWebComponent2);

var _querySelectorLive = require("coffeekraken-sugar/js/dom/querySelectorLive");

var _querySelectorLive2 = _interopRequireDefault(_querySelectorLive);

var _isInViewport = require("coffeekraken-sugar/js/dom/isInViewport");

var _isInViewport2 = _interopRequireDefault(_isInViewport);

var _autoCast = require("coffeekraken-sugar/js/utils/string/autoCast");

var _autoCast2 = _interopRequireDefault(_autoCast);

var _find2 = require("lodash/find");

var _find3 = _interopRequireDefault(_find2);

var _onSwipe = require("coffeekraken-sugar/js/dom/onSwipe");

var _onSwipe2 = _interopRequireDefault(_onSwipe);

var _dispatchEvent = require("coffeekraken-sugar/js/dom/dispatchEvent");

var _dispatchEvent2 = _interopRequireDefault(_dispatchEvent);

var _debounce = require("coffeekraken-sugar/js/utils/functions/debounce");

var _debounce2 = _interopRequireDefault(_debounce);

var _mutationObservable = require("coffeekraken-sugar/js/dom/mutationObservable");

var _mutationObservable2 = _interopRequireDefault(_mutationObservable);

var _addEventListener = require("coffeekraken-sugar/js/dom/addEventListener");

var _addEventListener2 = _interopRequireDefault(_addEventListener);

var _STimer = require("coffeekraken-sugar/js/classes/STimer");

var _STimer2 = _interopRequireDefault(_STimer);

require("coffeekraken-sugar/js/utils/rxjs/operators/groupByTimeout");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

var SSlideshowComponent = function (_SWebComponent) {
	_inherits(SSlideshowComponent, _SWebComponent);

	function SSlideshowComponent() {
		_classCallCheck(this, SSlideshowComponent);

		return _possibleConstructorReturn(this, (SSlideshowComponent.__proto__ || Object.getPrototypeOf(SSlideshowComponent)).apply(this, arguments));
	}

	_createClass(SSlideshowComponent, [{
		key: "componentWillMount",


		/**
   * Component will mount
   * @definition 		SWebComponent.componentWillMount
   * @protected
   */
		value: function componentWillMount() {
			_get(SSlideshowComponent.prototype.__proto__ || Object.getPrototypeOf(SSlideshowComponent.prototype), "componentWillMount", this).call(this);

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
				next: null, // the next button
				previous: null, // the previous button
				totals: [], // all the totals tokens
				currents: [], // all the currents tokens
				goTos: [] // all the goto elements
			};

			this._changeSlideTimeout = null;
		}

		/**
   * Mount component
   * @definition 		SWebComponent.componentMount
   * @protected
   */

	}, {
		key: "componentMount",
		value: function componentMount() {
			var _this2 = this;

			_get(SSlideshowComponent.prototype.__proto__ || Object.getPrototypeOf(SSlideshowComponent.prototype), "componentMount", this).call(this);

			// update references
			this._updateReferences();

			// update slides references
			this._slides = this._updateSlidesRefs();

			// monitor new slides
			this._monitorNewSlides();

			// onInit callback
			this.props.onInit && this.props.onInit(this);

			// store the onResize debounced function
			this._onResizeDebouncedFn = (0, _debounce2.default)(this._applyCurrentSlideHeightToSlideshow.bind(this), 250);
			this._onSlideContentLoadedFn = this._onSlideContentLoaded.bind(this);
			this._onKeyUpFn = this._onKeyup.bind(this);

			// enable
			setTimeout(function () {
				_this2._enable();
			});
		}

		/**
   * Component unmount
   * @definition 		SWebComponent.componentUnmount
   * @protected
   */

	}, {
		key: "componentUnmount",
		value: function componentUnmount() {
			_get(SSlideshowComponent.prototype.__proto__ || Object.getPrototypeOf(SSlideshowComponent.prototype), "componentUnmount", this).call(this);
			this._disable();
		}

		/**
   * Component will receive prop
   * @definition 		SWebComponent.componentWillReceiveProp
   * @protected
   */

	}, {
		key: "componentWillReceiveProp",
		value: function componentWillReceiveProp(name, newVal, oldVal) {
			var _this3 = this;

			if (newVal === undefined || newVal === null) return;
			switch (name) {
				case "slide":
				case "slideId":
					clearTimeout(this._changeSlideTimeout);
					this._changeSlideTimeout = setTimeout(function () {
						_this3._goTo(newVal);
					});
					if (this._timer) this._timer.reset(!this._isMouseover);
					break;
				case "timeout":
					// if there's not timeout anymore
					// stop the timer if needed
					if (!newVal && this._timer) {
						this._timer.stop();
						this._timer.destroy();
						this._timer = null;
						return;
					}
					// create the timer if not any
					if (!this._timer) {
						this._timer = this._createTimer(newVal);
						return;
					}
					// otherwise, simply set the new dureation of the timer
					this._timer.duration(newVal);
					break;
				case "slidesPerChange":
					// go back to slide 0 if it is not the same
					if (newVal !== oldVal) {
						this.goTo(0);
					}
					break;
				case "applySlideHeight":
					if (!newVal) this.style.height = null;else this._applyCurrentSlideHeightToSlideshow();
					break;
			}
		}

		/**
   * Render the component
   * Here goes the code that reflect the this.props state on the actual html element
   * @definition 		SWebComponent.render
   * @protected
   */

	}, {
		key: "render",
		value: function render() {
			_get(SSlideshowComponent.prototype.__proto__ || Object.getPrototypeOf(SSlideshowComponent.prototype), "render", this).call(this);
		}

		/**
   * When the element is enabled
   * @return 	{SSlideshowComponent}
   */

	}, {
		key: "_enable",
		value: function _enable() {
			var _this4 = this;

			// if need to apply the slideshow height according to the slide one,
			// listen on window resize to reapply it correctly
			if (this.props.applySlideHeight) this._enableApplySlideHeight();

			// no transmation
			this.classList.add("clear-transmations");

			// next
			this.next(true);

			// remove the no transmation class to allow animations, etc...
			setTimeout(function () {
				_this4.classList.remove("clear-transmations");
			});

			// listen for click on element
			this.addEventListener("click", this._onClick.bind(this));

			// enable keyboard navigation
			if (this.props.keyboardEnabled) this._initKeyboardNavigation();

			// init touch navigation
			this._initTouchNavigation();

			this.addEventListener("mousedown", this._onMousedown.bind(this));
			this.addEventListener("mouseup", this._onMouseup.bind(this));
			this.addEventListener("mouseenter", this._onMouseover.bind(this));
			this.addEventListener("mouseleave", this._onMouseout.bind(this));

			// init the previous and next navigation
			this._initPreviousAndNextButtons();

			// listen for resize to apply the responsiveSlidesPerChange property correctly
			this._originalSlidesPerChange = this.props.slidesPerChange;
			this._removeResizeHandler = (0, _addEventListener2.default)(window, "resize", this._setResponsiveSlidePerChange.bind(this));
			// first time
			this._setResponsiveSlidePerChange();

			// timeout
			if (this.props.timeout) {
				this._timer = this._createTimer(this.props.timeout);
			}

			// maintain chainability
			return this;
		}

		/**
   * Set responsive slides per change
   */

	}, {
		key: "_setResponsiveSlidePerChange",
		value: function _setResponsiveSlidePerChange() {
			var slidesPerChange = this._originalSlidesPerChange;
			for (var key in this.props.responsiveSlidesPerChange) {
				if (window.innerWidth >= parseInt(key)) {
					slidesPerChange = this.props.responsiveSlidesPerChange[key];
				}
			}
			this.setProp("slidesPerChange", slidesPerChange);
		}

		/**
   * When the element is disabled
   * @return 	{SSlideshowComponent}
   */

	}, {
		key: "_disable",
		value: function _disable() {
			if (this.props.applySlideHeight) this._disableApplySlideHeight();

			// remove all classes
			this._unapplyStateAttrubutes();

			// disable keyboard navigation
			document.removeEventListener("keyup", this._onKeyUpFn);

			// disable mouse navigation
			this.removeEventListener("mousedown", this._onMousedown);
			this.removeEventListener("mouseup", this._onMouseup);
			this.removeEventListener("mouseenter", this._onMouseover);
			this.removeEventListener("mouseleave", this._onMouseout);

			if (this._removeResizeHandler) this._removeResizeHandler();

			// do not listen for click anymore
			this.removeEventListener("click", this._onClick);
			this._refs.previous && this._refs.previous.removeEventListener("click", this._onPreviousClick);
			this._refs.next && this._refs.next.removeEventListener("click", this._onNextClick);

			// maintain chainability
			return this;
		}

		/**
   * Create a timer
   */

	}, {
		key: "_createTimer",
		value: function _createTimer(timeout) {
			var _this5 = this;

			var timer = new _STimer2.default(timeout, {
				loop: true,
				tickCount: 1
			});
			timer.onTick(function () {
				if (_this5.props.direction === "forward") _this5.next();else _this5.previous();
			});
			timer.start();
			return timer;
		}

		/**
   * Enable apply slide height
   */

	}, {
		key: "_enableApplySlideHeight",
		value: function _enableApplySlideHeight() {
			// listen for window resize to resize the slideshow if needed
			window.addEventListener("resize", this._onResizeDebouncedFn);

			// listen for content of the slideshow being loaded like images, etc...
			this.addEventListener("load", this._onSlideContentLoadedFn, true);
		}

		/**
   * Disable apply slide height
   */

	}, {
		key: "_disableApplySlideHeight",
		value: function _disableApplySlideHeight() {
			window.removeEventListener("resize", this._onResizeDebouncedFn);
			this.removeEventListener("load", this._onSlideContentLoadedFn, true);
		}

		/**
   * On images, etc... are loaded inside the slideshow
   */

	}, {
		key: "_onSlideContentLoaded",
		value: function _onSlideContentLoaded(e) {
			this._applyCurrentSlideHeightToSlideshow();
		}

		/**
   * Apply the current slide height to the slideshow element itself
   */

	}, {
		key: "_applyCurrentSlideHeightToSlideshow",
		value: function _applyCurrentSlideHeightToSlideshow() {
			var _this6 = this;

			if (!this.getActiveSlide()) return;

			this.mutate(function () {
				if (!_this6._applyCurrentSlideHeightToSlideshowTarget && typeof _this6.props.applySlideHeight === "string") {
					// get the target to apply the height on
					_this6._applyCurrentSlideHeightToSlideshowTarget = _this6.querySelector(_this6.props.applySlideHeight);
				} else if (!_this6._applyCurrentSlideHeightToSlideshowTarget) {
					_this6._applyCurrentSlideHeightToSlideshowTarget = _this6;
				}

				var activeSlideHeight = _this6.getActiveSlide().offsetHeight;
				if (!_this6._applyCurrentSlideHeightToSlideshowTarget) return;
				if (!activeSlideHeight) return;
				_this6._applyCurrentSlideHeightToSlideshowTarget.style.height = activeSlideHeight + "px";
			});
		}

		/**
   * When the user click on the slideshow
   * @param 	{Event} 	e 	The event
   */

	}, {
		key: "_onClick",
		value: function _onClick(e) {
			// check if we click on a goto element
			var goTo = e.target.getAttribute(this._componentNameDash + "-goto");
			if (goTo) {
				// autocast
				goTo = (0, _autoCast2.default)(goTo);
				this.goTo(goTo);
			} else if (e.target.nodeName.toLowerCase() !== "a" && e.target.nodeName.toLowerCase() !== "button" && e.target.nodeName.toLowerCase() !== "input" && e.target.nodeName.toLowerCase() !== "textarea" && e.target.nodeName.toLowerCase() !== "select") {
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
					if (this.props.direction === "forward") {
						this.next();
					} else {
						this.previous();
					}
				}
			}
		}

		/**
   * When the user has clicked on the next button
   * @param 	{Event} 	e 	The event
   */

	}, {
		key: "_onNextClick",
		value: function _onNextClick(e) {
			e.preventDefault();
			e.stopPropagation();
			this.next();
		}

		/**
   * When the mouse enter the slideshow
   * @param 	{Event} 	e 	The event
   */

	}, {
		key: "_onMouseover",
		value: function _onMouseover(e) {
			// pause timer
			this._isMouseover = true;
			if (this._timer && this.props.pauseOnHover) this._timer.pause();
		}

		/**
   * When the mouse leave the slideshow
   * @param 	{Event} 	e 	The event
   */

	}, {
		key: "_onMouseout",
		value: function _onMouseout(e) {
			this._isMouseover = false;
			if (this._timer && this.props.pauseOnHover) this._timer.start();
		}

		/**
   * When the user has clicked on the previous button
   * @param 	{Event} 	e 	The event
   */

	}, {
		key: "_onPreviousClick",
		value: function _onPreviousClick(e) {
			e.preventDefault();
			e.stopPropagation();
			this.previous();
		}

		/**
   * When the user has clicked down on the slideshow
   * @param 	{Event} 	e 	The event
   */

	}, {
		key: "_onMousedown",
		value: function _onMousedown(e) {
			this._mousedownTimestamp = new Date().getTime();
		}

		/**
   * When the user has clicked down on the slideshow
   * @param 	{Event} 	e 	The event
   */

	}, {
		key: "_onMouseup",
		value: function _onMouseup(e) {
			this._mouseupTimestamp = new Date().getTime();
		}

		/**
   * Monitor for new slides
   */

	}, {
		key: "_monitorNewSlides",
		value: function _monitorNewSlides() {
			var _this7 = this;

			(0, _mutationObservable2.default)(this, {
				childList: true
			}).groupByTimeout().subscribe(function (mutations) {
				var mutation = mutations[0];
				var needUpdateSlides = false;
				if (mutation.addedNodes) {
					mutation.addedNodes.forEach(function (node) {
						if (!node.tagName || needUpdateSlides) return;
						if (node.hasAttribute(_this7._componentNameDash + "-slide") || node.tagName.toLowerCase() === _this7._componentNameDash + "-slide") {
							needUpdateSlides = true;
						}
					});
				}
				if (mutation.removedNodes) {
					mutation.removedNodes.forEach(function (node) {
						if (!node.tagName || needUpdateSlides) return;
						if (node.hasAttribute(_this7._componentNameDash + "-slide") || node.tagName.toLowerCase() === _this7._componentNameDash + "-slide") {
							needUpdateSlides = true;
						}
					});
				}
				if (needUpdateSlides) {
					_this7._slides = _this7._updateSlidesRefs();
				}
			});
		}

		/**
   * Init a new slide
   */

	}, {
		key: "_initSlide",
		value: function _initSlide(slide) {
			// do not init slide twice
			if (slide._sSlideshowInited) return;
			slide._sSlideshowInited = true;
			// callback if exist
			this.props.initSlide && this.props.initSlide(slide);
			// slides initer
			this._slidesIniter.forEach(function (initer) {
				initer(slide);
			});
		}

		/**
   * Remove the attributes from the elements
   */

	}, {
		key: "_unapplyStateAttrubutes",
		value: function _unapplyStateAttrubutes() {
			var _this8 = this;

			this.mutate(function () {
				// unactivate all the slides
				_this8._slides.forEach(function (slide) {
					slide.removeAttribute("active");
					slide.removeAttribute("before-active");
					slide.removeAttribute("after-active");
					slide.removeAttribute("next");
					slide.removeAttribute("previous");
					slide.removeAttribute("first");
					slide.removeAttribute("last");
				});
				// remove the active class on all goto
				[].forEach.call(_this8._refs.goTos, function (goTo) {
					goTo.removeAttribute("active");
				});
				// remove attributes on the slideshow itself
				_this8.removeAttribute("last");
				_this8.removeAttribute("first");
			});
		}

		/**
   * Apply the good attributes to the elements
   */

	}, {
		key: "_applyStateAttributes",
		value: function _applyStateAttributes() {
			var _this9 = this;

			this.mutate(function () {
				// activate the current slide
				_this9._activeSlide.setAttribute("active", true);
				// goto classes
				[].forEach.call(_this9._refs.goTos, function (goTo) {
					var slide = goTo.getAttribute(_this9._componentNameDash + "-goto");
					var idx = _this9._getSlideIdxById(slide);
					if (idx === parseInt(_this9.props.slide)) {
						goTo.setAttribute("active", true);
					}
				});
				// add the next and previous classes
				if (_this9.getPreviousSlide()) {
					if (!_this9.getPreviousSlide().hasAttribute("previous")) {
						_this9.getPreviousSlide().setAttribute("previous", true);
					}
				}
				if (_this9.getNextSlide()) {
					if (!_this9.getNextSlide().hasAttribute("next")) {
						_this9.getNextSlide().setAttribute("next", true);
					}
				}
				// apply the first and last classes
				if (_this9.getFirstSlide()) {
					if (!_this9.getFirstSlide().hasAttribute("first")) {
						_this9.getFirstSlide().setAttribute("first", true);
					}
				}
				if (_this9.getLastSlide()) {
					if (!_this9.getLastSlide().hasAttribute("last")) {
						_this9.getLastSlide().setAttribute("last", true);
					}
				}
				// apply the beforeActiveClass
				_this9.getBeforeActiveSlides().forEach(function (slide) {
					if (!slide.hasAttribute("before-active")) {
						slide.setAttribute("before-active", true);
					}
				});
				// apply the afterActiveClass
				_this9.getAfterActiveSlides().forEach(function (slide) {
					if (!slide.hasAttribute("after-active")) {
						slide.setAttribute("after-active", true);
					}
				});
				// first and last attribute on the slideshow itself
				if (_this9.isLast()) {
					_this9.setAttribute("last", true);
				}
				if (_this9.isFirst()) {
					_this9.setAttribute("first", true);
				}
			});
		}

		/**
   * Get slide idx by id
   * @param 		{String} 		id 		The slide id
   * @return 		{Integer} 				The slide idx
   */

	}, {
		key: "_getSlideIdxById",
		value: function _getSlideIdxById(id) {
			// autocast the id
			id = (0, _autoCast2.default)(id);
			// if the id is already an integer idx
			if (typeof id === "number") return id;
			// if is a string
			if (typeof id === "string") {
				// find the slide
				var slideElm = (0, _find3.default)(this._slides, function (sld) {
					return sld.id === id.replace("#", "");
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

	}, {
		key: "_injectDynamicValuesInHtml",
		value: function _injectDynamicValuesInHtml() {
			var _this10 = this;

			// apply current
			if (this._refs.current) {
				[].forEach.call(this._refs.current, function (current) {
					current.innerHTML = parseInt(_this10.props.slide) + 1;
				});
			}
			// apply total
			if (this._refs.total) {
				[].forEach.call(this._refs.total, function (total) {
					total.innerHTML = _this10._slides.length;
				});
			}
		}

		/**
   * Loop on slides to find the first one that has the active class
   * @return 	{HTMLElement} 	The first active class
   */

	}, {
		key: "_findActiveSlideByAttributes",
		value: function _findActiveSlideByAttributes() {
			for (var i = 0; i < this._slides.length; i++) {
				var slide = this._slides[i];
				if (slide.hasAttribute("active")) {
					return slide;
				}
			}
			return null;
		}

		/**
   * Init the previous and next buttons
   */

	}, {
		key: "_initPreviousAndNextButtons",
		value: function _initPreviousAndNextButtons() {
			// if the next element exist
			if (this._refs.next) {
				this._refs.next.addEventListener("click", this._onNextClick.bind(this));
			}
			// if the previous element exist
			if (this._refs.previous) {
				this._refs.previous.addEventListener("click", this._onPreviousClick.bind(this));
			}
		}

		/**
   * Init the keyboard navigation
   */

	}, {
		key: "_initKeyboardNavigation",
		value: function _initKeyboardNavigation() {
			// listen for keyup event
			document.addEventListener("keyup", this._onKeyUpFn);
		}

		/**
   * Init the touch navigation
   */

	}, {
		key: "_initTouchNavigation",
		value: function _initTouchNavigation() {
			var _this11 = this;

			// listen for swiped
			(0, _onSwipe2.default)(this, function (swipeNfo) {
				// if the touch navigation is not enabled, stop here
				if (!_this11.props.touchEnabled) return;
				// check the swipe direction
				if (swipeNfo.left) {
					_this11.next();
				} else if (swipeNfo.right) {
					_this11.previous();
				}
			});
		}

		/**
   * When the user has released a keyboard key
   * @param 	{Event} 	e 	The event
   */

	}, {
		key: "_onKeyup",
		value: function _onKeyup(e) {
			// do nothing if the keyboard navigation if not enabled
			if (!this.props.keyboardEnabled) return;

			// do nothing if the slideshow is not in viewport
			if (!(0, _isInViewport2.default)(this)) return;

			// check the key
			switch (e.keyCode) {
				case 39:
					// right arrow
					this.next();
					break;
				case 37:
					// left arrow
					this.previous();
					break;
			}
		}

		/**
   * Go to next slide
   * @return 	{SSlideshowComponent}
   */

	}, {
		key: "next",
		value: function next() {
			var isFirst = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

			// stop if the document is hidden
			if (document.hidden) return;

			// get the current active slide index
			var idx = this.props.slide;

			// if the slideshow is at his first time
			var activeSlideIndex = void 0;
			if (idx === null) {
				// try to find a slide that has the active class
				var activeSlide = this._findActiveSlideByAttributes();
				if (activeSlide) {
					activeSlideIndex = this._slides.indexOf(activeSlide);
				} else {
					activeSlideIndex = 0;
				}
			} else if (parseInt(idx) + this.props.slidesPerChange < this._slides.length) {
				activeSlideIndex = parseInt(idx) + this.props.slidesPerChange;
			} else if (this.props.loop) {
				var left = parseInt(idx) + this.props.slidesPerChange - this._slides.length;
				activeSlideIndex = left;
			} else {
				activeSlideIndex = this.props.slide;
			}

			// check if the slide has an id
			var slideId = null;
			if (this._slides[activeSlideIndex].hasAttribute("id")) {
				slideId = this._slides[activeSlideIndex].id;
			}

			// set slide prop
			this.setProps({
				slide: activeSlideIndex,
				slideId: slideId,
				direction: isFirst ? this.props.direction : "forward"
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

	}, {
		key: "previous",
		value: function previous() {
			// stop if the document is hidden
			if (document.hidden) return;

			// get the current active slide index
			var idx = this.props.slide;

			// if the slideshow is at his first time
			var activeSlideIndex = void 0;
			if (idx === null) {
				// try to find a slide that has the active class
				var activeSlide = this._findActiveSlideByAttributes();
				if (activeSlide) {
					activeSlideIndex = this._slides.indexOf(activeSlide);
				} else {
					activeSlideIndex = 0;
				}
			} else if (parseInt(idx) - this.props.slidesPerChange >= 0) {
				activeSlideIndex = parseInt(idx) - this.props.slidesPerChange;
			} else if (this.props.loop) {
				var left = Math.abs(parseInt(idx) - this.props.slidesPerChange);
				activeSlideIndex = this._slides.length - left;
				console.log('active #1', activeSlideIndex);

				// activeSlideIndex = this._slides.length - 1;
			} else {
				activeSlideIndex = this.props.slide;
				console.log('active #3', activeSlideIndex);
			}

			// check if the slide has an id
			var slideId = null;
			if (this._slides[activeSlideIndex].hasAttribute("id")) {
				slideId = this._slides[activeSlideIndex].id;
			}

			// set slide prop
			this.setProps({
				slide: activeSlideIndex,
				slideId: slideId,
				direction: "backward"
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

	}, {
		key: "goTo",
		value: function goTo(slide) {
			// get the slide idx
			var slideIndex = this._getSlideIdxById(slide);
			// check the slide index
			if (slideIndex >= this._slides.length) {
				throw "The slide " + slideIndex + " does not exist...";
			}

			// check if the slide has an id
			var slideId = null;
			if (this._slides[slideIndex].hasAttribute("id")) {
				slideId = this._slides[slideIndex].id;
			}

			// set slide prop
			this.setProps({
				slide: slideIndex,
				slideId: slideId
			});
		}
	}, {
		key: "_goTo",
		value: function _goTo(slide) {
			// transform potential slide id in slide idx
			var slideIndex = this._getSlideIdxById(slide);

			// check the slide index
			if (slideIndex >= this._slides.length) {
				throw "The slide " + slideIndex + " does not exist...";
			}
			// beforeChange callback
			this.props.beforeChange && this.props.beforeChange(this);

			// event
			(0, _dispatchEvent2.default)(this, "beforeChange");

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
			(0, _dispatchEvent2.default)(this, "change");

			// apply classes
			this._applyStateAttributes();

			// afterChange callback
			this.props.afterChange && this.props.afterChange(this);

			// event
			(0, _dispatchEvent2.default)(this, "afterChange");

			// maintain chainability
			return this;
		}

		/**
   * Register a function to init a new slide
   * @param 	{Function} 	initer 	The initer function
   * @return 	{SSlideshowComponent}
   */

	}, {
		key: "onNewSlide",
		value: function onNewSlide(callback) {
			if (this._slidesIniter.indexOf(callback) === -1) {
				this._slidesIniter.push(callback);
			}
		}

		/**
   * Return all the slides that are before the active one
   * @return 	{Array} 	The array of slides that are before the active one
   */

	}, {
		key: "getBeforeActiveSlides",
		value: function getBeforeActiveSlides() {
			var activeIdx = this.props.slide;
			var newArray = this._slides.slice(0);
			newArray.splice(activeIdx, 1000);
			return newArray;
		}

		/**
   * Return all the slides that are before the active one
   * @return 	{Array} 	The array of slides that are before the active one
   */

	}, {
		key: "getAfterActiveSlides",
		value: function getAfterActiveSlides() {
			var activeIdx = this.props.slide;
			var newArray = this._slides.slice(0);
			newArray.splice(0, activeIdx + 1);
			return newArray;
		}

		/**
   * Return the index of the active slide
   * @return 	{Integer}	The active slide index
   */

	}, {
		key: "getActiveSlideIndex",
		value: function getActiveSlideIndex() {
			return parseInt(this.props.slide);
		}

		/**
   * Return the active slide element
   * @return 	{HTMLElement} 	The active slide
   */

	}, {
		key: "getActiveSlide",
		value: function getActiveSlide() {
			return this._activeSlide;
		}

		/**
   * Return the first slide element
   * @return 	{HTMLElement} 	The first slide
   */

	}, {
		key: "getFirstSlide",
		value: function getFirstSlide() {
			return this._slides[0];
		}

		/**
   * Return the last slide element
   * @return 	{HTMLElement} 	The last slide
   */

	}, {
		key: "getLastSlide",
		value: function getLastSlide() {
			return this._slides[this._slides.length - 1];
		}

		/**
   * Return the next slide index
   * @return 	{Integer} 	The next slide index
   */

	}, {
		key: "getNextSlideIndex",
		value: function getNextSlideIndex() {
			var activeSlideIndex = parseInt(this.props.slide);
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

	}, {
		key: "getNextSlide",
		value: function getNextSlide() {
			return this._slides[this.getNextSlideIndex()];
		}

		/**
   * Return the previous slide index
   * @return 	{Integer} 	The previous slide index
   */

	}, {
		key: "getPreviousSlideIndex",
		value: function getPreviousSlideIndex() {
			var activeSlideIndex = parseInt(this.props.slide);
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

	}, {
		key: "getPreviousSlide",
		value: function getPreviousSlide() {
			return this._slides[this.getPreviousSlideIndex()];
		}

		/**
   * Return the slides stack in array of HTMLElement format
   * @return    {Array<HTMLElement>}    The slides stack
   */

	}, {
		key: "getSlides",
		value: function getSlides() {
			return Array.from(this._slides);
		}

		/**
   * Return if the slideshow loop status is true
   * @return 	{Boolean} 	The loop status
   */

	}, {
		key: "isLoop",
		value: function isLoop() {
			return this.props.loop;
		}

		/**
   * Return if the first slide is active
   * @return 	{Boolean} 	true if the first slide is active
   */

	}, {
		key: "isFirst",
		value: function isFirst() {
			return this._slides[0].hasAttribute("active");
		}

		/**
   * Return if the first slide is active
   * @return 	{Boolean} 	true if the first slide is active
   */

	}, {
		key: "isLast",
		value: function isLast() {
			return this._slides[this._slides.length - 1].hasAttribute("active");
		}

		/**
   * Go find the slides of the slideshow
   * @return 	{Array} 	The array of slides found
   */

	}, {
		key: "_updateSlidesRefs",
		value: function _updateSlidesRefs() {
			var _this12 = this;

			// grab the slides and maintain stack up to date
			var slides = [].slice.call(this.querySelectorAll(this._componentNameDash + "-slide, [" + this._componentNameDash + "-slide]"));
			// init slides
			slides.forEach(function (slide) {
				_this12._initSlide(slide);
			});
			// return the slides
			return slides;
		}

		/**
   * Go find into dom every elements needed for the slideshow
   * @return 	{void}
   */

	}, {
		key: "_updateReferences",
		value: function _updateReferences() {
			// grab the total and current token handler
			this._refs.total = this.querySelectorAll(this._componentNameDash + "-total, [" + this._componentNameDash + "-total]");
			this._refs.current = this.querySelectorAll(this._componentNameDash + "-current, [" + this._componentNameDash + "-current]");
			// grab all the goto elements
			this._refs.goTos = this.querySelectorAll(this._componentNameDash + "-goto, [" + this._componentNameDash + "-goto]");
			// grab the next and previous element
			this._refs.next = this.querySelector(this._componentNameDash + "-next, [" + this._componentNameDash + "-next]");
			this._refs.previous = this.querySelector(this._componentNameDash + "-previous, [" + this._componentNameDash + "-previous]");
		}
	}], [{
		key: "defaultCss",


		/**
   * Css
   * @protected
   */
		value: function defaultCss(componentName, componentNameDash) {
			return "\n\t\t\t" + componentNameDash + " {\n\t\t\t\tdisplay : block;\n\t\t\t}\n\t\t";
		}
	}, {
		key: "defaultProps",

		/**
   * Default props
   * @definition 		SWebComponent.defaultProps
   * @protected
   */
		get: function get() {
			return {
				/**
     * Set the active slide by index
     * @prop
     * @type 		{Integer}
     */
				slide: null,

				/**
     * Set the slide by id and not by idx as for the slide prop
     * @prop
     * @type 		{String}
     */
				slideId: null,

				/**
     * Set if the slideshow is infinite
     * @prop
     * @tyoe 	{Boolean}
     */
				loop: false,

				/**
     * Specify how many slides the slider has to pass on any change. Default is 1 but this can be usefull for special situations.
     * @prop
     * @type    {Integer}
     */
				slidesPerChange: 1,

				/**
     * Specify how many slide the slider has to pass on each `next` and `previous` call depending on viewport width.
     * This is a parameter that works in mobile first. Meaning that a value of `'300': 2` mean from 300px to infinite, apply 2 as slidesPerChange property
     * @example    js
     * {
     *   768: 2,
     *   1200: 3
     * }
     */
				responsiveSlidesPerChange: null,

				/**
     * Set if want that the plugin set the height of the s-slideshow tag accordingly to the active slide height.
     * This is usefull for js animations etc...
     * If set as string, it will be treated as a css selector to get the element inside the slider on which to apply the slide height
     * @prop
     * @type 	{Boolean|String}
     */
				applySlideHeight: false,

				/**
     * Callback when the slideshow is inited
     * @prop
     * @type 	{Function}
     */
				onInit: null,

				/**
     * Callback before the slideshow pass to another slide
     * @prop
     * @type 	{Function}
     */
				beforeChange: null,

				/**
     * Callback when the slider change from a slide to another
     * @prop
     * @type 	{Function}
     */
				onChange: null,

				/**
     * Callback when the slideshow has changed slide
     * @prop
     * @type 	{Function}
     */
				afterChange: null,

				/**
     * Callback used to init a new slide
     * @prop
     * @type 	{Function}
     */
				initSlide: null,

				/**
     * Change slide when click on the slideshow depending on the props.direction setting.
     * Will not trigger slide change if the user want to select something in the slide or that
     * he clicked on an interactive item like a link, button, textarea, input or select.
     * @prop
     * @type 	{Boolean}
     */
				nextOnClick: false,

				/**
     * Set the direction of the slideshow when click. If click on previous button, will be set to "backward".
     * On click on the next button, will be set to "forward".
     * @prop
     * @type 		{String}
     * @values 		forward|backward
     */
				direction: "forward",

				/**
     * Timeout between each slides
     * @prop
     * @type 	{Number}
     */
				timeout: null,

				/**
     * Specify if need to pause the timer on hover
     * @prop
     * @type 	{Boolean}
     */
				pauseOnHover: true,

				/**
     * Set if the keyboard navigation is enabled
     * @prop
     * @type 	{Boolean}
     */
				keyboardEnabled: true,

				/**
     * Set if the touch navigation is enabled
     * @prop
     * @type 	{Boolean}
     */
				touchEnabled: true
			};
		}

		/**
   * Physical props
   * @definition 		SWebComponent.physicalProps
   * @protected
   */

	}, {
		key: "physicalProps",
		get: function get() {
			return ["slide", "slideId", "slidesPerChange", "direction"];
		}
	}]);

	return SSlideshowComponent;
}(_SWebComponent3.default);

exports.default = SSlideshowComponent;