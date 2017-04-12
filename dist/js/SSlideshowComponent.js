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
 * 	- ```slide="{idx}"``` : Attribute on the slideshow itself that set the active slide
 * - Nice and easy API
 * - And more...
 *
 *
 * @styleguide 		Objects / Slideshow
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
    * Store the observer of the slides
    * @type 	{Observer}
    * @private
    */
			this._slidesObserver = null;

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

			// grab the slides and maintain stack up to date
			// this._slides = [].slice.call(this.querySelectorAll(`${this._componentNameDash}-slide, [${this._componentNameDash}-slide]`));
			// // init slides
			// this._slides.forEach((slide) => {
			// 	this._initSlide(slide);
			// });
			//
			this._slidesObserver = (0, _querySelectorLive2.default)(this._componentNameDash + '-slide, [' + this._componentNameDash + '-slide]', {
				rootNode: this
			}).stack(this._slides).subscribe(function (elm) {
				// init new slide
				_this2._initSlide(elm);
			});

			// onInit callback
			this.props.onInit && this.props.onInit(this);

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
			this.destroy();
		}

		/**
   * Component will receive prop
   * @definition 		SWebComponent.componentWillReceiveProp
   * @protected
   */

	}, {
		key: 'componentWillReceiveProp',
		value: function componentWillReceiveProp(name, newVal, oldVal) {
			switch (name) {
				case 'slide':
					this._goTo(newVal);
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
			var _this3 = this;

			// no transmation
			this.classList.add('clear-transmations');

			// next
			this.next();

			// add all classes
			this._applyStateAttributes();

			// remove the no transmation class to allow animations, etc...
			setTimeout(function () {
				_this3.classList.remove('clear-transmations');
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
			// remove all classes
			this._unapplyStateAttrubutes();
			// maintain chainability
			return this;
		}

		/**
   * When the element is destroyed
   */

	}, {
		key: 'destroy',
		value: function destroy() {
			// destroy all element in slideshow that need to be destroyed
			this._slidesObserver.unsubscribe();
		}

		/**
   * Init a new slide
   */

	}, {
		key: '_initSlide',
		value: function _initSlide(slide) {
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
			// unactivate all the slides
			this._slides.forEach(function (slide) {
				slide.removeAttribute('active');
				slide.removeAttribute('before-active');
				slide.removeAttribute('after-active');
				slide.removeAttribute('next');
				slide.removeAttribute('previous');
				slide.removeAttribute('first');
				slide.removeAttribute('last');
			});
			// remove the active class on all goto
			[].forEach.call(this._refs.goTos, function (goTo) {
				goTo.removeAttribute('active');
			});
			// remove the previous and next classes
			// if (this.getPreviousSlide()) {
			// 	this.getPreviousSlide().removeAttribute('previous');
			// }
			// if (this.getNextSlide()) {
			// 	this.getNextSlide().removeAttribute('next');
			// }
			// // unapply the first and last classes
			// if (this.getFirstSlide()) {
			// 	this.getFirstSlide().removeAttribute('first');
			// }
			// if (this.getLastSlide()) {
			// 	this.getLastSlide().removeAttribute('last');
			// }
		}

		/**
   * Apply the good attributes to the elements
   */

	}, {
		key: '_applyStateAttributes',
		value: function _applyStateAttributes() {
			var _this4 = this;

			// activate the current slide
			this._activeSlide.setAttribute('active', true);
			// goto classes
			[].forEach.call(this._refs.goTos, function (goTo) {
				var idx = goTo.getAttribute(_this4._componentNameDash + '-goto');
				if (idx && (0, _autoCast2.default)(idx) === _this4.props.slide) {
					goTo.setAttribute('active', true);
				}
			});
			// add the next and previous classes
			if (this.getPreviousSlide()) {
				if (!this.getPreviousSlide().hasAttribute('previous')) {
					this.getPreviousSlide().setAttribute('previous', true);
				}
			}
			if (this.getNextSlide()) {
				if (!this.getNextSlide().hasAttribute('next')) {
					this.getNextSlide().setAttribute('next', true);
				}
			}
			// apply the first and last classes
			if (this.getFirstSlide()) {
				if (!this.getFirstSlide().hasAttribute('first')) {
					this.getFirstSlide().setAttribute('first', true);
				}
			}
			if (this.getLastSlide()) {
				if (!this.getLastSlide().hasAttribute('last')) {
					this.getLastSlide().setAttribute('last', true);
				}
			}
			// apply the beforeActiveClass
			this.getBeforeActiveSlides().forEach(function (slide) {
				if (!slide.hasAttribute('before-active')) {
					slide.setAttribute('before-active', true);
				}
			});
			// apply the afterActiveClass
			this.getAfterActiveSlides().forEach(function (slide) {
				if (!slide.hasAttribute('after-active')) {
					slide.setAttribute('after-active', true);
				}
			});
		}

		/**
   * Apply the differents tokens available to use in the html template
   */

	}, {
		key: '_applyTokens',
		value: function _applyTokens() {
			var _this5 = this;

			// apply current
			if (this._refs.current) {
				[].forEach.call(this._refs.current, function (current) {
					current.innerHTML = _this5.props.slide + 1;
				});
			}
			// apply total
			if (this._refs.total) {
				[].forEach.call(this._refs.total, function (total) {
					total.innerHTML = _this5._slides.length;
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

			// check if is in viewport
			// if ( ! __isInViewport(this) && this.props.slide !== -1) return;

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

			// set slide prop
			this.setProp('slide', activeSlideIndex);

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

			// check if is in viewport
			// if ( ! __isInViewport(this) && this.props.slide !== -1) return;

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

			// set slide prop
			this.setProp('slide', activeSlideIndex);

			// onPrevious callback
			this.props.onPrevious && this.props.onPrevious(this);

			// maintain chainability
			return this;
		}

		/**
   * Go to a specific slide
   * @param 	{Integer} 	slideIndex 	The slide index to go to
   * @return 	{SSlideshowComponent} 	The instance itself
   */

	}, {
		key: 'goTo',
		value: function goTo(slideIndex) {
			// check the slide index
			if (slideIndex >= this._slides.length) {
				throw 'The slide ' + slideIndex + ' does not exist...';
			}
			this.setProp('slide', slideIndex);
		}
	}, {
		key: '_goTo',
		value: function _goTo(slideIndex) {
			// check the slide index
			if (slideIndex >= this._slides.length) {
				throw 'The slide ' + slideIndex + ' does not exist...';
			}
			// beforeChange callback
			this.props.beforeChange && this.props.beforeChange(this);

			// unapply classes
			this._unapplyStateAttrubutes();

			// active the good slide
			this._activeSlide = this._slides[slideIndex];

			// apply total and current tokens
			this._applyTokens();

			// onChange callback
			this.props.onChange && this.props.onChange(this);

			// apply classes
			this._applyStateAttributes();

			// afterChange callback
			this.props.afterChange && this.props.afterChange(this);

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
			return this._slides[this.slides.length - 1].hasAttribute('active');
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
     * Set if the slideshow is infinite
     * @prop
     * @tyoe 	{Boolean}
     */
				loop: false,

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
			return ['slide'];
		}
	}]);

	return SSlideshowComponent;
}(_SWebComponent3.default);

exports.default = SSlideshowComponent;