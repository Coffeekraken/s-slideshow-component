Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _SWebComponent2 = require('coffeekraken-sugar/js/core/SWebComponent');

var _SWebComponent3 = _interopRequireDefault(_SWebComponent2);

var _querySelectorLive = require('coffeekraken-sugar/js/dom/querySelectorLive');

var _querySelectorLive2 = _interopRequireDefault(_querySelectorLive);

var _autoCast = require('coffeekraken-sugar/js/utils/string/autoCast');

var _autoCast2 = _interopRequireDefault(_autoCast);

var _find = require('lodash/find');

var _find2 = _interopRequireDefault(_find);

var _dispatchEvent = require('coffeekraken-sugar/js/dom/dispatchEvent');

var _dispatchEvent2 = _interopRequireDefault(_dispatchEvent);

var _debounce = require('coffeekraken-sugar/js/utils/functions/debounce');

var _debounce2 = _interopRequireDefault(_debounce);

var _mutationObservable = require('coffeekraken-sugar/js/dom/mutationObservable');

var _mutationObservable2 = _interopRequireDefault(_mutationObservable);

require('coffeekraken-sugar/js/utils/rxjs/operators/groupByTimeout');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
// import __isInViewport from 'coffeekraken-sugar/js/dom/isInViewport'


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
* Dispatched after the change happen
* @event
*/

var SSlideshowComponent = function (_SWebComponent) {
	_inherits(SSlideshowComponent, _SWebComponent);

	function SSlideshowComponent() {
		_classCallCheck(this, SSlideshowComponent);

		return _possibleConstructorReturn(this, (SSlideshowComponent.__proto__ || Object.getPrototypeOf(SSlideshowComponent)).apply(this, arguments));
	}

	_createClass(SSlideshowComponent, [{
		key: 'componentWillMount',


		/**
   * Component will mount
  	 * @definition 		SWebComponent.componentWillMount
   * @protected
   */
		value: function componentWillMount() {
			_get(SSlideshowComponent.prototype.__proto__ || Object.getPrototypeOf(SSlideshowComponent.prototype), 'componentWillMount', this).call(this);

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
		key: 'componentMount',
		value: function componentMount() {
			var _this2 = this;

			_get(SSlideshowComponent.prototype.__proto__ || Object.getPrototypeOf(SSlideshowComponent.prototype), 'componentMount', this).call(this);

			// update references
			this._updateReferences();

			// update slides references
			this._slides = this._getSlides();

			// monitor new slides
			this._monitorNewSlides();

			// onInit callback
			this.props.onInit && this.props.onInit(this);

			// store the onResize debounced function
			this._onResizeDebounced = (0, _debounce2.default)(this._applyCurrentSlideHeightToSlideshow.bind(this), 250);

			// if need to apply the slideshow height according to the slide one,
			// listen on window resize to reapply it correctly
			if (this.props.applySlideHeight) {
				window.addEventListener('resize', this._onResizeDebounced);

				// listen for content of the slideshow being loaded like images, etc...
				this.addEventListener('load', function (e) {
					_this2._applyCurrentSlideHeightToSlideshow();
				}, true);
			}

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
		key: 'componentUnmount',
		value: function componentUnmount() {
			_get(SSlideshowComponent.prototype.__proto__ || Object.getPrototypeOf(SSlideshowComponent.prototype), 'componentUnmount', this).call(this);
			this._disable();
		}

		/**
   * Component will receive prop
   * @definition 		SWebComponent.componentWillReceiveProp
   * @protected
   */

	}, {
		key: 'componentWillReceiveProp',
		value: function componentWillReceiveProp(name, newVal, oldVal) {
			var _this3 = this;

			if (newVal === undefined || newVal === null) return;
			switch (name) {
				case 'slide':
				case 'slideId':
					clearTimeout(this._changeSlideTimeout);
					this._changeSlideTimeout = setTimeout(function () {
						_this3._goTo(newVal);
					});
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
		key: 'render',
		value: function render() {
			_get(SSlideshowComponent.prototype.__proto__ || Object.getPrototypeOf(SSlideshowComponent.prototype), 'render', this).call(this);
		}

		/**
   * When the element is enabled
   * @return 	{SSlideshowComponent}
   */

	}, {
		key: '_enable',
		value: function _enable() {
			var _this4 = this;

			// no transmation
			this.classList.add('clear-transmations');

			// next
			this.next();

			// remove the no transmation class to allow animations, etc...
			setTimeout(function () {
				_this4.classList.remove('clear-transmations');
			});

			// maintain chainability
			return this;
		}

		/**
   * When the element is disabled
   * @return 	{SSlideshowComponent}
   */

	}, {
		key: '_disable',
		value: function _disable() {
			// stop listening for certain events
			window.removeEventListener('resize', this._onResizeDebounced);
			// remove all classes
			this._unapplyStateAttrubutes();
			// maintain chainability
			return this;
		}

		/**
   * Monitor for new slides
   */

	}, {
		key: '_monitorNewSlides',
		value: function _monitorNewSlides() {
			var _this5 = this;

			(0, _mutationObservable2.default)(this, {
				childList: true
			}).groupByTimeout().subscribe(function (mutations) {
				var mutation = mutations[0];
				var needUpdateSlides = false;
				if (mutation.addedNodes) {
					mutation.addedNodes.forEach(function (node) {
						if (!node.tagName || needUpdateSlides) return;
						if (node.hasAttribute(_this5._componentNameDash + '-slide') || node.tagName.toLowerCase() === _this5._componentNameDash + '-slide') {
							needUpdateSlides = true;
						}
					});
				}
				if (mutation.removedNodes) {
					mutation.removedNodes.forEach(function (node) {
						if (!node.tagName || needUpdateSlides) return;
						if (node.hasAttribute(_this5._componentNameDash + '-slide') || node.tagName.toLowerCase() === _this5._componentNameDash + '-slide') {
							needUpdateSlides = true;
						}
					});
				}
				if (needUpdateSlides) {
					_this5._slides = _this5._getSlides();
				}
			});
		}

		/**
   * Init a new slide
   */

	}, {
		key: '_initSlide',
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
		key: '_unapplyStateAttrubutes',
		value: function _unapplyStateAttrubutes() {
			var _this6 = this;

			this.mutate(function () {
				// unactivate all the slides
				_this6._slides.forEach(function (slide) {
					slide.removeAttribute('active');
					slide.removeAttribute('before-active');
					slide.removeAttribute('after-active');
					slide.removeAttribute('next');
					slide.removeAttribute('previous');
					slide.removeAttribute('first');
					slide.removeAttribute('last');
				});
				// remove the active class on all goto
				[].forEach.call(_this6._refs.goTos, function (goTo) {
					goTo.removeAttribute('active');
				});
				// remove attributes on the slideshow itself
				_this6.removeAttribute('last');
				_this6.removeAttribute('first');
			});
		}

		/**
   * Apply the good attributes to the elements
   */

	}, {
		key: '_applyStateAttributes',
		value: function _applyStateAttributes() {
			var _this7 = this;

			this.mutate(function () {
				// activate the current slide
				_this7._activeSlide.setAttribute('active', true);
				// goto classes
				[].forEach.call(_this7._refs.goTos, function (goTo) {
					var slide = goTo.getAttribute(_this7._componentNameDash + '-goto');
					var idx = _this7._getSlideIdxById(slide);
					if (idx === _this7.props.slide) {
						goTo.setAttribute('active', true);
					}
				});
				// add the next and previous classes
				if (_this7.getPreviousSlide()) {
					if (!_this7.getPreviousSlide().hasAttribute('previous')) {
						_this7.getPreviousSlide().setAttribute('previous', true);
					}
				}
				if (_this7.getNextSlide()) {
					if (!_this7.getNextSlide().hasAttribute('next')) {
						_this7.getNextSlide().setAttribute('next', true);
					}
				}
				// apply the first and last classes
				if (_this7.getFirstSlide()) {
					if (!_this7.getFirstSlide().hasAttribute('first')) {
						_this7.getFirstSlide().setAttribute('first', true);
					}
				}
				if (_this7.getLastSlide()) {
					if (!_this7.getLastSlide().hasAttribute('last')) {
						_this7.getLastSlide().setAttribute('last', true);
					}
				}
				// apply the beforeActiveClass
				_this7.getBeforeActiveSlides().forEach(function (slide) {
					if (!slide.hasAttribute('before-active')) {
						slide.setAttribute('before-active', true);
					}
				});
				// apply the afterActiveClass
				_this7.getAfterActiveSlides().forEach(function (slide) {
					if (!slide.hasAttribute('after-active')) {
						slide.setAttribute('after-active', true);
					}
				});
				// first and last attribute on the slideshow itself
				if (_this7.isLast()) {
					_this7.setAttribute('last', true);
				}
				if (_this7.isFirst()) {
					_this7.setAttribute('first', true);
				}
			});
		}

		/**
   * Apply the current slide height to the slideshow element itself
   */

	}, {
		key: '_applyCurrentSlideHeightToSlideshow',
		value: function _applyCurrentSlideHeightToSlideshow() {
			var _this8 = this;

			if (!this.getActiveSlide()) return;

			this.mutate(function () {
				if (!_this8._applyCurrentSlideHeightToSlideshowTarget && typeof _this8.props.applySlideHeight === 'string') {
					// get the target to apply the height on
					_this8._applyCurrentSlideHeightToSlideshowTarget = _this8.querySelector(_this8.props.applySlideHeight);
				} else if (!_this8._applyCurrentSlideHeightToSlideshowTarget) {
					_this8._applyCurrentSlideHeightToSlideshowTarget = _this8;
				}

				var activeSlideHeight = _this8.getActiveSlide().offsetHeight;
				if (!_this8._applyCurrentSlideHeightToSlideshowTarget) return;
				if (!activeSlideHeight) return;
				_this8._applyCurrentSlideHeightToSlideshowTarget.style.height = activeSlideHeight + 'px';
			});
		}

		/**
   * Get slide idx by id
   * @param 		{String} 		id 		The slide id
   * @return 		{Integer} 				The slide idx
   */

	}, {
		key: '_getSlideIdxById',
		value: function _getSlideIdxById(id) {
			// autocast the id
			id = (0, _autoCast2.default)(id);
			// if the id is already an integer idx
			if (typeof id === 'number') return id;
			// if is a string
			if (typeof id === 'string') {
				// find the slide
				var slideElm = (0, _find2.default)(this._slides, function (sld) {
					return sld.id === id.replace('#', '');
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
		key: '_injectDynamicValuesInHtml',
		value: function _injectDynamicValuesInHtml() {
			var _this9 = this;

			// apply current
			if (this._refs.current) {
				[].forEach.call(this._refs.current, function (current) {
					current.innerHTML = _this9.props.slide + 1;
				});
			}
			// apply total
			if (this._refs.total) {
				[].forEach.call(this._refs.total, function (total) {
					total.innerHTML = _this9._slides.length;
				});
			}
		}

		/**
   * Loop on slides to find the first one that has the active class
   * @return 	{HTMLElement} 	The first active class
   */

	}, {
		key: '_findActiveSlideByAttributes',
		value: function _findActiveSlideByAttributes() {
			for (var i = 0; i < this._slides.length; i++) {
				var slide = this._slides[i];
				if (slide.hasAttribute('active')) {
					return slide;
				}
			}
			return null;
		}

		/**
   * Go to next slide
   * @return 	{SSlideshowComponent}
   */

	}, {
		key: 'next',
		value: function next() {
			// stop if the document is hidden
			if (document.hidden) return;

			// get the current active slide index
			var idx = this.props.slide;

			// if the slideshow is at his first time
			var activeSlideIndex = this._slides.length - 1;
			if (idx === null) {
				// try to find a slide that has the active class
				var activeSlide = this._findActiveSlideByAttributes();
				if (activeSlide) {
					activeSlideIndex = this._slides.indexOf(activeSlide);
				} else {
					activeSlideIndex = 0;
				}
			} else if (idx + 1 < this._slides.length) {
				activeSlideIndex = idx + 1;
			} else if (this.props.loop) {
				activeSlideIndex = 0;
			}

			// check if the slide has an id
			var slideId = null;
			if (this._slides[activeSlideIndex].hasAttribute('id')) {
				slideId = this._slides[activeSlideIndex].id;
			}

			// set slide prop
			this.setProps({
				'slide': activeSlideIndex,
				'slideId': slideId
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
		key: 'previous',
		value: function previous() {

			// stop if the document is hidden
			if (document.hidden) return;

			// get the current active slide index
			var idx = this.props.slide;

			// if the slideshow is at his first time
			var activeSlideIndex = 0;
			if (idx === null) {
				// try to find a slide that has the active class
				var activeSlide = this._findActiveSlideByAttributes();
				if (activeSlide) {
					activeSlideIndex = this._slides.indexOf(activeSlide);
				} else {
					activeSlideIndex = 0;
				}
			} else if (idx - 1 >= 0) {
				activeSlideIndex = idx - 1;
			} else if (this.props.loop) {
				activeSlideIndex = this._slides.length - 1;
			}

			// check if the slide has an id
			var slideId = null;
			if (this._slides[activeSlideIndex].hasAttribute('id')) {
				slideId = this._slides[activeSlideIndex].id;
			}

			// set slide prop
			this.setProps({
				'slide': activeSlideIndex,
				'slideId': slideId
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
		key: 'goTo',
		value: function goTo(slide) {
			// get the slide idx
			var slideIndex = this._getSlideIdxById(slide);
			// check the slide index
			if (slideIndex >= this._slides.length) {
				throw 'The slide ' + slideIndex + ' does not exist...';
			}

			// check if the slide has an id
			var slideId = null;
			if (this._slides[slideIndex].hasAttribute('id')) {
				slideId = this._slides[slideIndex].id;
			}

			// set slide prop
			this.setProps({
				'slide': slideIndex,
				'slideId': slideId
			});
		}
	}, {
		key: '_goTo',
		value: function _goTo(slide) {

			// transform potential slide id in slide idx
			var slideIndex = this._getSlideIdxById(slide);

			// check the slide index
			if (slideIndex >= this._slides.length) {
				throw 'The slide ' + slideIndex + ' does not exist...';
			}
			// beforeChange callback
			this.props.beforeChange && this.props.beforeChange(this);

			// event
			(0, _dispatchEvent2.default)(this, 'beforeChange');

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
			(0, _dispatchEvent2.default)(this, 'change');

			// apply classes
			this._applyStateAttributes();

			// afterChange callback
			this.props.afterChange && this.props.afterChange(this);

			// event
			(0, _dispatchEvent2.default)(this, 'afterChange');

			// maintain chainability
			return this;
		}

		/**
   * Register a function to init a new slide
   * @param 	{Function} 	initer 	The initer function
   * @return 	{SSlideshowComponent}
   */

	}, {
		key: 'onNewSlide',
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
		key: 'getBeforeActiveSlides',
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
		key: 'getAfterActiveSlides',
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
		key: 'getActiveSlideIndex',
		value: function getActiveSlideIndex() {
			return this.props.slide;
		}

		/**
   * Return the active slide element
   * @return 	{HTMLElement} 	The active slide
   */

	}, {
		key: 'getActiveSlide',
		value: function getActiveSlide() {
			return this._activeSlide;
		}

		/**
   * Return the first slide element
   * @return 	{HTMLElement} 	The first slide
   */

	}, {
		key: 'getFirstSlide',
		value: function getFirstSlide() {
			return this._slides[0];
		}

		/**
   * Return the last slide element
   * @return 	{HTMLElement} 	The last slide
   */

	}, {
		key: 'getLastSlide',
		value: function getLastSlide() {
			return this._slides[this._slides.length - 1];
		}

		/**
   * Return the next slide index
   * @return 	{Integer} 	The next slide index
   */

	}, {
		key: 'getNextSlideIndex',
		value: function getNextSlideIndex() {
			var activeSlideIndex = this.props.slide;
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
		key: 'getNextSlide',
		value: function getNextSlide() {
			return this._slides[this.getNextSlideIndex()];
		}

		/**
   * Return the previous slide index
   * @return 	{Integer} 	The previous slide index
   */

	}, {
		key: 'getPreviousSlideIndex',
		value: function getPreviousSlideIndex() {
			var activeSlideIndex = this.props.slide;
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
		key: 'getPreviousSlide',
		value: function getPreviousSlide() {
			return this._slides[this.getPreviousSlideIndex()];
		}

		/**
   * Return if the slideshow loop status is true
   * @return 	{Boolean} 	The loop status
   */

	}, {
		key: 'isLoop',
		value: function isLoop() {
			return this.props.loop;
		}

		/**
   * Return if the first slide is active
   * @return 	{Boolean} 	true if the first slide is active
   */

	}, {
		key: 'isFirst',
		value: function isFirst() {
			return this._slides[0].hasAttribute('active');
		}

		/**
   * Return if the first slide is active
   * @return 	{Boolean} 	true if the first slide is active
   */

	}, {
		key: 'isLast',
		value: function isLast() {
			return this._slides[this._slides.length - 1].hasAttribute('active');
		}

		/**
   * Go find the slides of the slideshow
   * @return 	{Array} 	The array of slides found
   */

	}, {
		key: '_getSlides',
		value: function _getSlides() {
			var _this10 = this;

			// grab the slides and maintain stack up to date
			var slides = [].slice.call(this.querySelectorAll(this._componentNameDash + '-slide, [' + this._componentNameDash + '-slide]'));
			// init slides
			slides.forEach(function (slide) {
				_this10._initSlide(slide);
			});
			// return the slides
			return slides;
		}

		/**
      * Go find into dom every elements needed for the slideshow
      * @return 	{void}
   */

	}, {
		key: '_updateReferences',
		value: function _updateReferences() {
			// grab the total and current token handler
			this._refs.total = this.querySelectorAll(this._componentNameDash + '-total, [' + this._componentNameDash + '-total]');
			this._refs.current = this.querySelectorAll(this._componentNameDash + '-current, [' + this._componentNameDash + '-current]');
			// grab all the goto elements
			this._refs.goTos = this.querySelectorAll(this._componentNameDash + '-goto, [' + this._componentNameDash + '-goto]');
		}
	}], [{
		key: 'defaultCss',


		/**
   * Css
   * @protected
   */
		value: function defaultCss(componentName, componentNameDash) {
			return '\n\t\t\t' + componentNameDash + ' {\n\t\t\t\tdisplay : block;\n\t\t\t}\n\t\t';
		}
	}, {
		key: 'defaultProps',


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
				initSlide: null

			};
		}

		/**
   * Physical props
   * @definition 		SWebComponent.physicalProps
   * @protected
   */

	}, {
		key: 'physicalProps',
		get: function get() {
			return ['slide', 'slideId'];
		}
	}]);

	return SSlideshowComponent;
}(_SWebComponent3.default);

exports.default = SSlideshowComponent;