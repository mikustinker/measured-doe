jQuery( window ).on( 'elementor/frontend/init', function() {
  var AnimatedHeadlineHandler = elementorModules.frontend.handlers.Base.extend({
    svgPaths: {
      circle: ['M325,18C228.7-8.3,118.5,8.3,78,21C22.4,38.4,4.6,54.6,5.6,77.6c1.4,32.4,52.2,54,142.6,63.7 c66.2,7.1,212.2,7.5,273.5-8.3c64.4-16.6,104.3-57.6,33.8-98.2C386.7-4.9,179.4-1.4,126.3,20.7'],
      underline_zigzag: ['M9.3,127.3c49.3-3,150.7-7.6,199.7-7.4c121.9,0.4,189.9,0.4,282.3,7.2C380.1,129.6,181.2,130.6,70,139 c82.6-2.9,254.2-1,335.9,1.3c-56,1.4-137.2-0.3-197.1,9'],
      x: ['M497.4,23.9C301.6,40,155.9,80.6,4,144.4', 'M14.1,27.6c204.5,20.3,393.8,74,467.3,111.7'],
      strikethrough: ['M3,75h493.5'],
      curly: ['M3,146.1c17.1-8.8,33.5-17.8,51.4-17.8c15.6,0,17.1,18.1,30.2,18.1c22.9,0,36-18.6,53.9-18.6 c17.1,0,21.3,18.5,37.5,18.5c21.3,0,31.8-18.6,49-18.6c22.1,0,18.8,18.8,36.8,18.8c18.8,0,37.5-18.6,49-18.6c20.4,0,17.1,19,36.8,19 c22.9,0,36.8-20.6,54.7-18.6c17.7,1.4,7.1,19.5,33.5,18.8c17.1,0,47.2-6.5,61.1-15.6'],
      diagonal: ['M13.5,15.5c131,13.7,289.3,55.5,475,125.5'],
      double: ['M8.4,143.1c14.2-8,97.6-8.8,200.6-9.2c122.3-0.4,287.5,7.2,287.5,7.2', 'M8,19.4c72.3-5.3,162-7.8,216-7.8c54,0,136.2,0,267,7.8'],
      double_underline: ['M5,125.4c30.5-3.8,137.9-7.6,177.3-7.6c117.2,0,252.2,4.7,312.7,7.6', 'M26.9,143.8c55.1-6.1,126-6.3,162.2-6.1c46.5,0.2,203.9,3.2,268.9,6.4'],
      underline: ['M7.7,145.6C109,125,299.9,116.2,401,121.3c42.1,2.2,87.6,11.8,87.3,25.7']
    },

    getDefaultSettings: function getDefaultSettings() {
      var settings = {
        animationDelay: 2500,
        //letters effect
        lettersDelay: 50,
        //typing effect
        typeLettersDelay: 150,
        selectionDuration: 500,
        //clip effect
        revealDuration: 600,
        revealAnimationDelay: 1500
      };

      settings.typeAnimationDelay = settings.selectionDuration + 800;

      settings.selectors = {
        headline: '.twbb-headline',
        dynamicWrapper: '.twbb-headline-dynamic-wrapper'
      };

      settings.classes = {
        dynamicText: 'twbb-headline-dynamic-text',
        dynamicLetter: 'twbb-headline-dynamic-letter',
        textActive: 'twbb-headline-text-active',
        textInactive: 'twbb-headline-text-inactive',
        letters: 'twbb-headline-letters',
        animationIn: 'twbb-headline-animation-in',
        typeSelected: 'twbb-headline-typing-selected'
      };

      return settings;
    },

    getDefaultElements: function getDefaultElements() {
      var selectors = this.getSettings('selectors');

      return {
        $headline: this.$element.find(selectors.headline),
        $dynamicWrapper: this.$element.find(selectors.dynamicWrapper)
      };
    },

    getNextWord: function getNextWord($word) {
      return $word.is(':last-child') ? $word.parent().children().eq(0) : $word.next();
    },

    switchWord: function switchWord($oldWord, $newWord) {
      $oldWord.removeClass('twbb-headline-text-active').addClass('twbb-headline-text-inactive');

      $newWord.removeClass('twbb-headline-text-inactive').addClass('twbb-headline-text-active');
    },

    singleLetters: function singleLetters() {
      var classes = this.getSettings('classes');

      this.elements.$dynamicText.each(function () {
        var $word = jQuery(this),
          letters = $word.text().split(''),
          isActive = $word.hasClass(classes.textActive);

        $word.empty();

        letters.forEach(function (letter) {
          var $letter = jQuery('<span>', { class: classes.dynamicLetter }).text(letter);

          if (isActive) {
            $letter.addClass(classes.animationIn);
          }

          $word.append($letter);
        });

        $word.css('opacity', 1);
      });
    },

    showLetter: function showLetter($letter, $word, bool, duration) {
      var self = this,
        classes = this.getSettings('classes');

      $letter.addClass(classes.animationIn);

      if (!$letter.is(':last-child')) {
        setTimeout(function () {
          self.showLetter($letter.next(), $word, bool, duration);
        }, duration);
      } else if (!bool) {
        setTimeout(function () {
          self.hideWord($word);
        }, self.getSettings('animationDelay'));
      }
    },

    hideLetter: function hideLetter($letter, $word, bool, duration) {
      var self = this,
        settings = this.getSettings();

      $letter.removeClass(settings.classes.animationIn);

      if (!$letter.is(':last-child')) {
        setTimeout(function () {
          self.hideLetter($letter.next(), $word, bool, duration);
        }, duration);
      } else if (bool) {
        setTimeout(function () {
          self.hideWord(self.getNextWord($word));
        }, self.getSettings('animationDelay'));
      }
    },

    showWord: function showWord($word, $duration) {
      var self = this,
        settings = self.getSettings(),
        animationType = self.getElementSettings('animation_type');

      if ('typing' === animationType) {
        self.showLetter($word.find('.' + settings.classes.dynamicLetter).eq(0), $word, false, $duration);

        $word.addClass(settings.classes.textActive).removeClass(settings.classes.textInactive);
      } else if ('clip' === animationType) {
        self.elements.$dynamicWrapper.animate({ width: $word.width() + 10 }, settings.revealDuration, function () {
          setTimeout(function () {
            self.hideWord($word);
          }, settings.revealAnimationDelay);
        });
      }
    },

    hideWord: function hideWord($word) {
      var self = this,
        settings = self.getSettings(),
        classes = settings.classes,
        letterSelector = '.' + classes.dynamicLetter,
        animationType = self.getElementSettings('animation_type'),
        nextWord = self.getNextWord($word);

      if ('typing' === animationType) {
        self.elements.$dynamicWrapper.addClass(classes.typeSelected);

        setTimeout(function () {
          self.elements.$dynamicWrapper.removeClass(classes.typeSelected);

          $word.addClass(settings.classes.textInactive).removeClass(classes.textActive).children(letterSelector).removeClass(classes.animationIn);
        }, settings.selectionDuration);
        setTimeout(function () {
          self.showWord(nextWord, settings.typeLettersDelay);
        }, settings.typeAnimationDelay);
      } else if (self.elements.$headline.hasClass(classes.letters)) {
        var bool = $word.children(letterSelector).length >= nextWord.children(letterSelector).length;

        self.hideLetter($word.find(letterSelector).eq(0), $word, bool, settings.lettersDelay);

        self.showLetter(nextWord.find(letterSelector).eq(0), nextWord, bool, settings.lettersDelay);
      } else if ('clip' === animationType) {
        self.elements.$dynamicWrapper.animate({ width: '2px' }, settings.revealDuration, function () {
          self.switchWord($word, nextWord);
          self.showWord(nextWord);
        });
      } else {
        self.switchWord($word, nextWord);

        setTimeout(function () {
          self.hideWord(nextWord);
        }, settings.animationDelay);
      }
    },

    animateHeadline: function animateHeadline() {
      var self = this,
        animationType = self.getElementSettings('animation_type'),
        $dynamicWrapper = self.elements.$dynamicWrapper;

      if ('clip' === animationType) {
        $dynamicWrapper.width($dynamicWrapper.width() + 10);
      } else if ('typing' !== animationType) {
        //assign to .elementor-headline-dynamic-wrapper the width of its longest word
        var width = 0;

        self.elements.$dynamicText.each(function () {
          var wordWidth = jQuery(this).width();

          if (wordWidth > width) {
            width = wordWidth;
          }
        });

        $dynamicWrapper.css('width', width);
      }

      //trigger animation
      setTimeout(function () {
        self.hideWord(self.elements.$dynamicText.eq(0));
      }, self.getSettings('animationDelay'));
    },

    getSvgPaths: function getSvgPaths(pathName) {
      var pathsInfo = this.svgPaths[pathName],
        $paths = jQuery();

      pathsInfo.forEach(function (pathInfo) {
        $paths = $paths.add(jQuery('<path>', { d: pathInfo }));
      });

      return $paths;
    },

    fillWords: function fillWords() {
      var elementSettings = this.getElementSettings(),
        classes = this.getSettings('classes'),
        $dynamicWrapper = this.elements.$dynamicWrapper;

      if ('rotate' === elementSettings.headline_style) {
        var rotatingText = (elementSettings.rotating_text || '').split('\n');

        rotatingText.forEach(function (word, index) {
          var $dynamicText = jQuery('<span>', { class: classes.dynamicText }).html(word.replace(/ /g, '&nbsp;'));

          if (!index) {
            $dynamicText.addClass(classes.textActive);
          }

          $dynamicWrapper.append($dynamicText);
        });
      } else {
        var $dynamicText = jQuery('<span>', { class: classes.dynamicText + ' ' + classes.textActive }).text(elementSettings.highlighted_text),
          $svg = jQuery('<svg>', {
            xmlns: 'http://www.w3.org/2000/svg',
            viewBox: '0 0 500 150',
            preserveAspectRatio: 'none'
          }).html(this.getSvgPaths(elementSettings.marker));

        $dynamicWrapper.append($dynamicText, $svg[0].outerHTML);
      }

      this.elements.$dynamicText = $dynamicWrapper.children('.' + classes.dynamicText);
    },

    rotateHeadline: function rotateHeadline() {
      var settings = this.getSettings();

      //insert <span> for each letter of a changing word
      if (this.elements.$headline.hasClass(settings.classes.letters)) {
        this.singleLetters();
      }

      //initialise headline animation
      this.animateHeadline();
    },

    initHeadline: function initHeadline() {
      if ('rotate' === this.getElementSettings('headline_style')) {
        this.rotateHeadline();
      }
    },

    onInit: function onInit() {
        elementorModules.frontend.handlers.Base.prototype.onInit.apply(this, arguments);

      this.fillWords();

      this.initHeadline();
    }
  });

  elementorFrontend.hooks.addAction( 'frontend/element_ready/twbbanimated-headline.default', function ( $scope ) {
    new AnimatedHeadlineHandler({ $element: $scope });
  });


});

var tenwebCountdown = function( $countdown, endTime ) {
  var timeInterval,
    elements = {
      $monthsSpan: $countdown.find( '.tenweb-countdown-months' ),
      $daysSpan: $countdown.find( '.tenweb-countdown-days' ),
      $hoursSpan: $countdown.find( '.tenweb-countdown-hours' ),
      $minutesSpan: $countdown.find( '.tenweb-countdown-minutes' ),
      $secondsSpan: $countdown.find( '.tenweb-countdown-seconds' )
    };

  var updateClock = function() {
    var timeRemaining = tenwebCountdown.getTimeRemaining( endTime, elements[ '$monthsSpan' ].length );

    jQuery.each( timeRemaining.parts, function( timePart ) {
      var $element = elements[ '$' + timePart + 'Span' ],
        partValue = this.toString();

      if ( 1 === partValue.length ) {
        partValue = 0 + partValue;
      }

      if ( $element.length ) {
        $element.text( partValue );
      }
    } );

    if ( timeRemaining.total <= 0 ) {
      var hideAfterExpiry = $countdown.data( 'hide-after-expiry' );
      if ( 'yes' == hideAfterExpiry ) {
        $countdown.find('.tenweb-countdown-item').addClass( 'tenweb-hidden' );
        $countdown.parent().find('.tenweb-countdown-description').addClass( 'tenweb-hidden' );
        $countdown.parent().find('.tenweb-countdown-expired').removeClass( 'tenweb-hidden' );
      }
      clearInterval( timeInterval );
    }
  };

  var initializeClock = function() {
    updateClock();

    timeInterval = setInterval( updateClock, 1000 );
  };

  initializeClock();
};

tenwebCountdown.getTimeRemaining = function( endTime, showMonths ) {
  var now = new Date();
  var timeRemaining = endTime - now;
  var days = Math.floor( timeRemaining / ( 1000 * 60 * 60 * 24 ) );
  var months = showMonths && days > 31 ? (endTime.getFullYear() - now.getFullYear()) * 12 + endTime.getMonth() - now.getMonth() : 0;
  if ( showMonths && months ) {
    days = endTime.getDate() - now.getDate();
  }
  var hours = Math.floor( ( timeRemaining / ( 1000 * 60 * 60 ) ) % 24 );
  var minutes = Math.floor( ( timeRemaining / 1000 / 60 ) % 60 );
  var seconds = Math.floor( ( timeRemaining / 1000 ) % 60 );

  if ( days < 0 || hours < 0 || minutes < 0 ) {
    seconds = minutes = hours = days = 0;
  }

  return {
    total: timeRemaining,
    parts: {
      months: months,
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds
    }
  };
};

jQuery( window ).on( 'elementor/frontend/init', function() {
  elementorFrontend.hooks.addAction( 'frontend/element_ready/twbbcountdown.default', function ( $scope ) {
    var $element = $scope.find( '.tenweb-countdown' ),
      date = new Date( $element.data( 'date' ) * 1000 );

    new tenwebCountdown( $element, date );
  } );
});
jQuery(window).on('elementor/frontend/init', function () {
  var config = TWBBFrontendConfig.facebook_sdk;
  loadSDK = function loadSDK() {
    // Don't load in parallel
    if ( config.isLoading || config.isLoaded ) {
      return;
    }
    config.isLoading = true;
    jQuery.ajax({
      url: 'https://connect.facebook.net/' + config.lang + '/sdk.js',
      dataType: 'script',
      cache: true,
      success: function success() {
        FB.init({
          appId: config.app_id,
          version: 'v2.10',
          xfbml: false
        });
        config.isLoaded = true;
        config.isLoading = false;
        jQuery(document).trigger('fb:sdk:loaded');
      }
    });
  };
  function parse_current_element( $scope ) {
    loadSDK(); // On FB SDK is loaded, parse current element
    var parse = function parse() {
      FB.XFBML.parse($scope[0]);
    };
    if ( config.isLoaded ) {
      parse();
    }
    else {
      jQuery(document).on('fb:sdk:loaded', parse);
    }
  };

  function parse_current_element( $scope ) {
    loadSDK(); // On FB SDK is loaded, parse current element
    var parse = function parse() {
      FB.XFBML.parse($scope[0]);
    };
    if ( config.isLoaded ) {
      parse();
    }
    else {
      jQuery(document).on('fb:sdk:loaded', parse);
    }
  }
  elementorFrontend.hooks.addAction('frontend/element_ready/twbb_facebook-page.default', function ( $scope ) {
    parse_current_element($scope);
  });
  
  elementorFrontend.hooks.addAction('frontend/element_ready/twbb_facebook-comments.default', function ( $scope ) {
    parse_current_element($scope);
  });
  
  elementorFrontend.hooks.addAction('frontend/element_ready/twbb_facebook-embed.default', function ( $scope ) {
    parse_current_element( $scope );
  });
  
  elementorFrontend.hooks.addAction('frontend/element_ready/twbb_facebook-button.default', function ( $scope ) {
    parse_current_element( $scope );
  });
});

/*!
 * SmartMenus jQuery Plugin - v1.0.1 - November 1, 2016
 * http://www.smartmenus.org/
 *
 * Copyright Vasil Dinkov, Vadikom Web Ltd.
 * http://vadikom.com
 *
 * Licensed MIT
 */

(function(factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery'], factory);
	} else if (typeof module === 'object' && typeof module.exports === 'object') {
		// CommonJS
		module.exports = factory(require('jquery'));
	} else {
		// Global jQuery
		factory(jQuery);
	}
} (function($) {

	var menuTrees = [],
		IE = !!window.createPopup, // detect it for the iframe shim
		mouse = false, // optimize for touch by default - we will detect for mouse input
		touchEvents = 'ontouchstart' in window, // we use this just to choose between toucn and pointer events, not for touch screen detection
		mouseDetectionEnabled = false,
		requestAnimationFrame = window.requestAnimationFrame || function(callback) { return setTimeout(callback, 1000 / 60); },
		cancelAnimationFrame = window.cancelAnimationFrame || function(id) { clearTimeout(id); };

	// Handle detection for mouse input (i.e. desktop browsers, tablets with a mouse, etc.)
	function initMouseDetection(disable) {
		var eNS = '.smartmenus_mouse';
		if (!mouseDetectionEnabled && !disable) {
			// if we get two consecutive mousemoves within 2 pixels from each other and within 300ms, we assume a real mouse/cursor is present
			// in practice, this seems like impossible to trick unintentianally with a real mouse and a pretty safe detection on touch devices (even with older browsers that do not support touch events)
			var firstTime = true,
				lastMove = null;
			$(document).bind(getEventsNS([
				['mousemove', function(e) {
					var thisMove = { x: e.pageX, y: e.pageY, timeStamp: new Date().getTime() };
					if (lastMove) {
						var deltaX = Math.abs(lastMove.x - thisMove.x),
							deltaY = Math.abs(lastMove.y - thisMove.y);
	 					if ((deltaX > 0 || deltaY > 0) && deltaX <= 2 && deltaY <= 2 && thisMove.timeStamp - lastMove.timeStamp <= 300) {
							mouse = true;
							// if this is the first check after page load, check if we are not over some item by chance and call the mouseenter handler if yes
							if (firstTime) {
								var $a = $(e.target).closest('a');
								if ($a.is('a')) {
									$.each(menuTrees, function() {
										if ($.contains(this.$root[0], $a[0])) {
											this.itemEnter({ currentTarget: $a[0] });
											return false;
										}
									});
								}
								firstTime = false;
							}
						}
					}
					lastMove = thisMove;
				}],
				[touchEvents ? 'touchstart' : 'pointerover pointermove pointerout MSPointerOver MSPointerMove MSPointerOut', function(e) {
					if (isTouchEvent(e.originalEvent)) {
						mouse = false;
					}
				}]
			], eNS));
			mouseDetectionEnabled = true;
		} else if (mouseDetectionEnabled && disable) {
			$(document).unbind(eNS);
			mouseDetectionEnabled = false;
		}
	}

	function isTouchEvent(e) {
		return !/^(4|mouse)$/.test(e.pointerType);
	}

	// returns a jQuery bind() ready object
	function getEventsNS(defArr, eNS) {
		if (!eNS) {
			eNS = '';
		}
		var obj = {};
		$.each(defArr, function(index, value) {
			obj[value[0].split(' ').join(eNS + ' ') + eNS] = value[1];
		});
		return obj;
	}

	$.SmartMenus = function(elm, options) {
		this.$root = $(elm);
		this.opts = options;
		this.rootId = ''; // internal
		this.accessIdPrefix = '';
		this.$subArrow = null;
		this.activatedItems = []; // stores last activated A's for each level
		this.visibleSubMenus = []; // stores visible sub menus UL's (might be in no particular order)
		this.showTimeout = 0;
		this.hideTimeout = 0;
		this.scrollTimeout = 0;
		this.clickActivated = false;
		this.focusActivated = false;
		this.zIndexInc = 0;
		this.idInc = 0;
		this.$firstLink = null; // we'll use these for some tests
		this.$firstSub = null; // at runtime so we'll cache them
		this.disabled = false;
		this.$disableOverlay = null;
		this.$touchScrollingSub = null;
		this.cssTransforms3d = 'perspective' in elm.style || 'webkitPerspective' in elm.style;
		this.wasCollapsible = false;
		this.init();
	};

	$.extend($.SmartMenus, {
		hideAll: function() {
			$.each(menuTrees, function() {
				this.menuHideAll();
			});
		},
		destroy: function() {
			while (menuTrees.length) {
				menuTrees[0].destroy();
			}
			initMouseDetection(true);
		},
		prototype: {
			init: function(refresh) {
				var self = this;

				if (!refresh) {
					menuTrees.push(this);

					this.rootId = (new Date().getTime() + Math.random() + '').replace(/\D/g, '');
					this.accessIdPrefix = 'sm-' + this.rootId + '-';

					if (this.$root.hasClass('sm-rtl')) {
						this.opts.rightToLeftSubMenus = true;
					}

					// init root (main menu)
					var eNS = '.smartmenus';
					this.$root
						.data('smartmenus', this)
						.attr('data-smartmenus-id', this.rootId)
						.dataSM('level', 1)
						.bind(getEventsNS([
							['mouseover focusin', $.proxy(this.rootOver, this)],
							['mouseout focusout', $.proxy(this.rootOut, this)],
							['keydown', $.proxy(this.rootKeyDown, this)]
						], eNS))
						.delegate('a', getEventsNS([
							['mouseenter', $.proxy(this.itemEnter, this)],
							['mouseleave', $.proxy(this.itemLeave, this)],
							['mousedown', $.proxy(this.itemDown, this)],
							['focus', $.proxy(this.itemFocus, this)],
							['blur', $.proxy(this.itemBlur, this)],
							['click', $.proxy(this.itemClick, this)]
						], eNS));

					// hide menus on tap or click outside the root UL
					eNS += this.rootId;
					if (this.opts.hideOnClick) {
						$(document).bind(getEventsNS([
							['touchstart', $.proxy(this.docTouchStart, this)],
							['touchmove', $.proxy(this.docTouchMove, this)],
							['touchend', $.proxy(this.docTouchEnd, this)],
							// for Opera Mobile < 11.5, webOS browser, etc. we'll check click too
							['click', $.proxy(this.docClick, this)]
						], eNS));
					}
					// hide sub menus on resize
					$(window).bind(getEventsNS([['resize orientationchange', $.proxy(this.winResize, this)]], eNS));

					if (this.opts.subIndicators) {
						this.$subArrow = $('<span/>').addClass('sub-arrow');
						if (this.opts.subIndicatorsText) {
							this.$subArrow.html(this.opts.subIndicatorsText);
						}
					}

					// make sure mouse detection is enabled
					initMouseDetection();
				}

				// init sub menus
				this.$firstSub = this.$root.find('ul').each(function() { self.menuInit($(this)); }).eq(0);

				this.$firstLink = this.$root.find('a').eq(0);

				// find current item
				if (this.opts.markCurrentItem) {
					var reDefaultDoc = /(index|default)\.[^#\?\/]*/i,
						reHash = /#.*/,
						locHref = window.location.href.replace(reDefaultDoc, ''),
						locHrefNoHash = locHref.replace(reHash, '');
					this.$root.find('a').each(function() {
						var href = this.href.replace(reDefaultDoc, ''),
							$this = $(this);
						if (href == locHref || href == locHrefNoHash) {
							$this.addClass('current');
							if (self.opts.markCurrentTree) {
								$this.parentsUntil('[data-smartmenus-id]', 'ul').each(function() {
									$(this).dataSM('parent-a').addClass('current');
								});
							}
						}
					});
				}

				// save initial state
				this.wasCollapsible = this.isCollapsible();
			},
			destroy: function(refresh) {
				if (!refresh) {
					var eNS = '.smartmenus';
					this.$root
						.removeData('smartmenus')
						.removeAttr('data-smartmenus-id')
						.removeDataSM('level')
						.unbind(eNS)
						.undelegate(eNS);
					eNS += this.rootId;
					$(document).unbind(eNS);
					$(window).unbind(eNS);
					if (this.opts.subIndicators) {
						this.$subArrow = null;
					}
				}
				this.menuHideAll();
				var self = this;
				this.$root.find('ul').each(function() {
						var $this = $(this);
						if ($this.dataSM('scroll-arrows')) {
							$this.dataSM('scroll-arrows').remove();
						}
						if ($this.dataSM('shown-before')) {
							if (self.opts.subMenusMinWidth || self.opts.subMenusMaxWidth) {
								$this.css({ width: '', minWidth: '', maxWidth: '' }).removeClass('sm-nowrap');
							}
							if ($this.dataSM('scroll-arrows')) {
								$this.dataSM('scroll-arrows').remove();
							}
							$this.css({ zIndex: '', top: '', left: '', marginLeft: '', marginTop: '', display: '' });
						}
						if (($this.attr('id') || '').indexOf(self.accessIdPrefix) == 0) {
							$this.removeAttr('id');
						}
					})
					.removeDataSM('in-mega')
					.removeDataSM('shown-before')
					.removeDataSM('ie-shim')
					.removeDataSM('scroll-arrows')
					.removeDataSM('parent-a')
					.removeDataSM('level')
					.removeDataSM('beforefirstshowfired')
					.removeAttr('role')
					.removeAttr('aria-hidden')
					.removeAttr('aria-labelledby')
					.removeAttr('aria-expanded');
				this.$root.find('a.has-submenu').each(function() {
						var $this = $(this);
						if ($this.attr('id').indexOf(self.accessIdPrefix) == 0) {
							$this.removeAttr('id');
						}
					})
					.removeClass('has-submenu')
					.removeDataSM('sub')
					.removeAttr('aria-haspopup')
					.removeAttr('aria-controls')
					.removeAttr('aria-expanded')
					.closest('li').removeDataSM('sub');
				if (this.opts.subIndicators) {
					this.$root.find('span.sub-arrow').remove();
				}
				if (this.opts.markCurrentItem) {
					this.$root.find('a.current').removeClass('current');
				}
				if (!refresh) {
					this.$root = null;
					this.$firstLink = null;
					this.$firstSub = null;
					if (this.$disableOverlay) {
						this.$disableOverlay.remove();
						this.$disableOverlay = null;
					}
					menuTrees.splice($.inArray(this, menuTrees), 1);
				}
			},
			disable: function(noOverlay) {
				if (!this.disabled) {
					this.menuHideAll();
					// display overlay over the menu to prevent interaction
					if (!noOverlay && !this.opts.isPopup && this.$root.is(':visible')) {
						var pos = this.$root.offset();
						this.$disableOverlay = $('<div class="sm-jquery-disable-overlay"/>').css({
							position: 'absolute',
							top: pos.top,
							left: pos.left,
							width: this.$root.outerWidth(),
							height: this.$root.outerHeight(),
							zIndex: this.getStartZIndex(true),
							opacity: 0
						}).appendTo(document.body);
					}
					this.disabled = true;
				}
			},
			docClick: function(e) {
				if (this.$touchScrollingSub) {
					this.$touchScrollingSub = null;
					return;
				}
				// hide on any click outside the menu or on a menu link
				if (this.visibleSubMenus.length && !$.contains(this.$root[0], e.target) || $(e.target).is('a')) {
					this.menuHideAll();
				}
			},
			docTouchEnd: function(e) {
				if (!this.lastTouch) {
					return;
				}
				if (this.visibleSubMenus.length && (this.lastTouch.x2 === undefined || this.lastTouch.x1 == this.lastTouch.x2) && (this.lastTouch.y2 === undefined || this.lastTouch.y1 == this.lastTouch.y2) && (!this.lastTouch.target || !$.contains(this.$root[0], this.lastTouch.target))) {
					if (this.hideTimeout) {
						clearTimeout(this.hideTimeout);
						this.hideTimeout = 0;
					}
					// hide with a delay to prevent triggering accidental unwanted click on some page element
					var self = this;
					this.hideTimeout = setTimeout(function() { self.menuHideAll(); }, 350);
				}
				this.lastTouch = null;
			},
			docTouchMove: function(e) {
				if (!this.lastTouch) {
					return;
				}
				var touchPoint = e.originalEvent.touches[0];
				this.lastTouch.x2 = touchPoint.pageX;
				this.lastTouch.y2 = touchPoint.pageY;
			},
			docTouchStart: function(e) {
				var touchPoint = e.originalEvent.touches[0];
				this.lastTouch = { x1: touchPoint.pageX, y1: touchPoint.pageY, target: touchPoint.target };
			},
			enable: function() {
				if (this.disabled) {
					if (this.$disableOverlay) {
						this.$disableOverlay.remove();
						this.$disableOverlay = null;
					}
					this.disabled = false;
				}
			},
			getClosestMenu: function(elm) {
				var $closestMenu = $(elm).closest('ul');
				while ($closestMenu.dataSM('in-mega')) {
					$closestMenu = $closestMenu.parent().closest('ul');
				}
				return $closestMenu[0] || null;
			},
			getHeight: function($elm) {
				return this.getOffset($elm, true);
			},
			// returns precise width/height float values
			getOffset: function($elm, height) {
				var old;
				if ($elm.css('display') == 'none') {
					old = { position: $elm[0].style.position, visibility: $elm[0].style.visibility };
					$elm.css({ position: 'absolute', visibility: 'hidden' }).show();
				}
				var box = $elm[0].getBoundingClientRect && $elm[0].getBoundingClientRect(),
					val = box && (height ? box.height || box.bottom - box.top : box.width || box.right - box.left);
				if (!val && val !== 0) {
					val = height ? $elm[0].offsetHeight : $elm[0].offsetWidth;
				}
				if (old) {
					$elm.hide().css(old);
				}
				return val;
			},
			getStartZIndex: function(root) {
				var zIndex = parseInt(this[root ? '$root' : '$firstSub'].css('z-index'));
				if (!root && isNaN(zIndex)) {
					zIndex = parseInt(this.$root.css('z-index'));
				}
				return !isNaN(zIndex) ? zIndex : 1;
			},
			getTouchPoint: function(e) {
				return e.touches && e.touches[0] || e.changedTouches && e.changedTouches[0] || e;
			},
			getViewport: function(height) {
				var name = height ? 'Height' : 'Width',
					val = document.documentElement['client' + name],
					val2 = window['inner' + name];
				if (val2) {
					val = Math.min(val, val2);
				}
				return val;
			},
			getViewportHeight: function() {
				return this.getViewport(true);
			},
			getViewportWidth: function() {
				return this.getViewport();
			},
			getWidth: function($elm) {
				return this.getOffset($elm);
			},
			handleEvents: function() {
				return !this.disabled && this.isCSSOn();
			},
			handleItemEvents: function($a) {
				return this.handleEvents() && !this.isLinkInMegaMenu($a);
			},
			isCollapsible: function() {
				return this.$firstSub.css('position') == 'static';
			},
			isCSSOn: function() {
				return this.$firstLink.css('display') == 'block';
			},
			isFixed: function() {
				var isFixed = this.$root.css('position') == 'fixed';
				if (!isFixed) {
					this.$root.parentsUntil('body').each(function() {
						if ($(this).css('position') == 'fixed') {
							isFixed = true;
							return false;
						}
					});
				}
				return isFixed;
			},
			isLinkInMegaMenu: function($a) {
				return $(this.getClosestMenu($a[0])).hasClass('mega-menu');
			},
			isTouchMode: function() {
				return !mouse || this.opts.noMouseOver || this.isCollapsible();
			},
			itemActivate: function($a, focus) {
				var $ul = $a.closest('ul'),
					level = $ul.dataSM('level');
				// if for some reason the parent item is not activated (e.g. this is an API call to activate the item), activate all parent items first
				if (level > 1 && (!this.activatedItems[level - 2] || this.activatedItems[level - 2][0] != $ul.dataSM('parent-a')[0])) {
					var self = this;
					$($ul.parentsUntil('[data-smartmenus-id]', 'ul').get().reverse()).add($ul).each(function() {
						self.itemActivate($(this).dataSM('parent-a'));
					});
				}
				// hide any visible deeper level sub menus
				if (!this.isCollapsible() || focus) {
					this.menuHideSubMenus(!this.activatedItems[level - 1] || this.activatedItems[level - 1][0] != $a[0] ? level - 1 : level);
				}
				// save new active item for this level
				this.activatedItems[level - 1] = $a;
				if (this.$root.triggerHandler('activate.smapi', $a[0]) === false) {
					return;
				}
				// show the sub menu if this item has one
				var $sub = $a.dataSM('sub');
				if ($sub && (this.isTouchMode() || (!this.opts.showOnClick || this.clickActivated))) {
					this.menuShow($sub);
				}
			},
			itemBlur: function(e) {
				var $a = $(e.currentTarget);
				if (!this.handleItemEvents($a)) {
					return;
				}
				this.$root.triggerHandler('blur.smapi', $a[0]);
			},
			itemClick: function(e) {
				var $a = $(e.currentTarget);
				if (!this.handleItemEvents($a)) {
					return;
				}
				if (this.$touchScrollingSub && this.$touchScrollingSub[0] == $a.closest('ul')[0]) {
					this.$touchScrollingSub = null;
					e.stopPropagation();
					return false;
				}
				if (this.$root.triggerHandler('click.smapi', $a[0]) === false) {
					return false;
				}
				var subArrowClicked = $(e.target).is('span.sub-arrow'),
					$sub = $a.dataSM('sub'),
					firstLevelSub = $sub ? $sub.dataSM('level') == 2 : false;
				// if the sub is not visible
				if ($sub && !$sub.is(':visible')) {
					if (this.opts.showOnClick && firstLevelSub) {
						this.clickActivated = true;
					}
					// try to activate the item and show the sub
					this.itemActivate($a);
					// if "itemActivate" showed the sub, prevent the click so that the link is not loaded
					// if it couldn't show it, then the sub menus are disabled with an !important declaration (e.g. via mobile styles) so let the link get loaded
					if ($sub.is(':visible')) {
						this.focusActivated = true;
						return false;
					}
				} else if (this.isCollapsible() && subArrowClicked) {
					this.itemActivate($a);
					this.menuHide($sub);
					return false;
				}
				if (this.opts.showOnClick && firstLevelSub || $a.hasClass('disabled') || this.$root.triggerHandler('select.smapi', $a[0]) === false) {
					return false;
				}
			},
			itemDown: function(e) {
				var $a = $(e.currentTarget);
				if (!this.handleItemEvents($a)) {
					return;
				}
				$a.dataSM('mousedown', true);
			},
			itemEnter: function(e) {
				var $a = $(e.currentTarget);
				if (!this.handleItemEvents($a)) {
					return;
				}
				if (!this.isTouchMode()) {
					if (this.showTimeout) {
						clearTimeout(this.showTimeout);
						this.showTimeout = 0;
					}
					var self = this;
					this.showTimeout = setTimeout(function() { self.itemActivate($a); }, this.opts.showOnClick && $a.closest('ul').dataSM('level') == 1 ? 1 : this.opts.showTimeout);
				}
				this.$root.triggerHandler('mouseenter.smapi', $a[0]);
			},
			itemFocus: function(e) {
				var $a = $(e.currentTarget);
				if (!this.handleItemEvents($a)) {
					return;
				}
				// fix (the mousedown check): in some browsers a tap/click produces consecutive focus + click events so we don't need to activate the item on focus
				if (this.focusActivated && (!this.isTouchMode() || !$a.dataSM('mousedown')) && (!this.activatedItems.length || this.activatedItems[this.activatedItems.length - 1][0] != $a[0])) {
					this.itemActivate($a, true);
				}
				this.$root.triggerHandler('focus.smapi', $a[0]);
			},
			itemLeave: function(e) {
				var $a = $(e.currentTarget);
				if (!this.handleItemEvents($a)) {
					return;
				}
				if (!this.isTouchMode()) {
					$a[0].blur();
					if (this.showTimeout) {
						clearTimeout(this.showTimeout);
						this.showTimeout = 0;
					}
				}
				$a.removeDataSM('mousedown');
				this.$root.triggerHandler('mouseleave.smapi', $a[0]);
			},
			menuHide: function($sub) {
				if (this.$root.triggerHandler('beforehide.smapi', $sub[0]) === false) {
					return;
				}
				$sub.stop(true, true);
				if ($sub.css('display') != 'none') {
					var complete = function() {
						// unset z-index
						$sub.css('z-index', '');
					};
					// if sub is collapsible (mobile view)
					if (this.isCollapsible()) {
						if (this.opts.collapsibleHideFunction) {
							this.opts.collapsibleHideFunction.call(this, $sub, complete);
						} else {
							$sub.hide(this.opts.collapsibleHideDuration, complete);
						}
					} else {
						if (this.opts.hideFunction) {
							this.opts.hideFunction.call(this, $sub, complete);
						} else {
							$sub.hide(this.opts.hideDuration, complete);
						}
					}
					// remove IE iframe shim
					if ($sub.dataSM('ie-shim')) {
						$sub.dataSM('ie-shim').remove().css({ '-webkit-transform': '', transform: '' });
					}
					// deactivate scrolling if it is activated for this sub
					if ($sub.dataSM('scroll')) {
						this.menuScrollStop($sub);
						$sub.css({ 'touch-action': '', '-ms-touch-action': '', '-webkit-transform': '', transform: '' })
							.unbind('.smartmenus_scroll').removeDataSM('scroll').dataSM('scroll-arrows').hide();
					}
					// unhighlight parent item + accessibility
					$sub.dataSM('parent-a').removeClass('highlighted').attr('aria-expanded', 'false');
					$sub.attr({
						'aria-expanded': 'false',
						'aria-hidden': 'true'
					});
					var level = $sub.dataSM('level');
					this.activatedItems.splice(level - 1, 1);
					this.visibleSubMenus.splice($.inArray($sub, this.visibleSubMenus), 1);
					this.$root.triggerHandler('hide.smapi', $sub[0]);
				}
			},
			menuHideAll: function() {
				if (this.showTimeout) {
					clearTimeout(this.showTimeout);
					this.showTimeout = 0;
				}
				// hide all subs
				// if it's a popup, this.visibleSubMenus[0] is the root UL
				var level = this.opts.isPopup ? 1 : 0;
				for (var i = this.visibleSubMenus.length - 1; i >= level; i--) {
					this.menuHide(this.visibleSubMenus[i]);
				}
				// hide root if it's popup
				if (this.opts.isPopup) {
					this.$root.stop(true, true);
					if (this.$root.is(':visible')) {
						if (this.opts.hideFunction) {
							this.opts.hideFunction.call(this, this.$root);
						} else {
							this.$root.hide(this.opts.hideDuration);
						}
						// remove IE iframe shim
						if (this.$root.dataSM('ie-shim')) {
							this.$root.dataSM('ie-shim').remove();
						}
					}
				}
				this.activatedItems = [];
				this.visibleSubMenus = [];
				this.clickActivated = false;
				this.focusActivated = false;
				// reset z-index increment
				this.zIndexInc = 0;
				this.$root.triggerHandler('hideAll.smapi');
			},
			menuHideSubMenus: function(level) {
				for (var i = this.activatedItems.length - 1; i >= level; i--) {
					var $sub = this.activatedItems[i].dataSM('sub');
					if ($sub) {
						this.menuHide($sub);
					}
				}
			},
			menuIframeShim: function($ul) {
				// create iframe shim for the menu
				if (IE && this.opts.overlapControlsInIE && !$ul.dataSM('ie-shim')) {
					$ul.dataSM('ie-shim', $('<iframe/>').attr({ src: 'javascript:0', tabindex: -9 })
						.css({ position: 'absolute', top: 'auto', left: '0', opacity: 0, border: '0' })
					);
				}
			},
			menuInit: function($ul) {
				if (!$ul.dataSM('in-mega')) {
					// mark UL's in mega drop downs (if any) so we can neglect them
					if ($ul.hasClass('mega-menu')) {
						$ul.find('ul').dataSM('in-mega', true);
					}
					// get level (much faster than, for example, using parentsUntil)
					var level = 2,
						par = $ul[0];
					while ((par = par.parentNode.parentNode) != this.$root[0]) {
						level++;
					}
					// cache stuff for quick access
					var $a = $ul.prevAll('a').eq(-1);
					// if the link is nested (e.g. in a heading)
					if (!$a.length) {
						$a = $ul.prevAll().find('a').eq(-1);
					}
					$a.addClass('has-submenu').dataSM('sub', $ul);
					$ul.dataSM('parent-a', $a)
						.dataSM('level', level)
						.parent().dataSM('sub', $ul);
					// accessibility
					var aId = $a.attr('id') || this.accessIdPrefix + (++this.idInc),
						ulId = $ul.attr('id') || this.accessIdPrefix + (++this.idInc);
					$a.attr({
						id: aId,
						'aria-haspopup': 'true',
						'aria-controls': ulId,
						'aria-expanded': 'false'
					});
					$ul.attr({
						id: ulId,
						'role': 'group',
						'aria-hidden': 'true',
						'aria-labelledby': aId,
						'aria-expanded': 'false'
					});
					// add sub indicator to parent item
					if (this.opts.subIndicators) {
						$a[this.opts.subIndicatorsPos](this.$subArrow.clone());
					}
				}
			},
			menuPosition: function($sub) {
				var $a = $sub.dataSM('parent-a'),
					$li = $a.closest('li'),
					$ul = $li.parent(),
					level = $sub.dataSM('level'),
					subW = this.getWidth($sub),
					subH = this.getHeight($sub),
					itemOffset = $a.offset(),
					itemX = itemOffset.left,
					itemY = itemOffset.top,
					itemW = this.getWidth($a),
					itemH = this.getHeight($a),
					$win = $(window),
					winX = $win.scrollLeft(),
					winY = $win.scrollTop(),
					winW = this.getViewportWidth(),
					winH = this.getViewportHeight(),
					horizontalParent = $ul.parent().is('[data-sm-horizontal-sub]') || level == 2 && !$ul.hasClass('sm-vertical'),
					rightToLeft = this.opts.rightToLeftSubMenus && !$li.is('[data-sm-reverse]') || !this.opts.rightToLeftSubMenus && $li.is('[data-sm-reverse]'),
					subOffsetX = level == 2 ? this.opts.mainMenuSubOffsetX : this.opts.subMenusSubOffsetX,
					subOffsetY = level == 2 ? this.opts.mainMenuSubOffsetY : this.opts.subMenusSubOffsetY,
					x, y;
				if (horizontalParent) {
					x = rightToLeft ? itemW - subW - subOffsetX : subOffsetX;
					y = this.opts.bottomToTopSubMenus ? -subH - subOffsetY : itemH + subOffsetY;
				} else {
					x = rightToLeft ? subOffsetX - subW : itemW - subOffsetX;
					y = this.opts.bottomToTopSubMenus ? itemH - subOffsetY - subH : subOffsetY;
				}
				if (this.opts.keepInViewport) {
					var absX = itemX + x,
						absY = itemY + y;
					if (rightToLeft && absX < winX) {
						x = horizontalParent ? winX - absX + x : itemW - subOffsetX;
					} else if (!rightToLeft && absX + subW > winX + winW) {
						x = horizontalParent ? winX + winW - subW - absX + x : subOffsetX - subW;
					}
					if (!horizontalParent) {
						if (subH < winH && absY + subH > winY + winH) {
							y += winY + winH - subH - absY;
						} else if (subH >= winH || absY < winY) {
							y += winY - absY;
						}
					}
					// do we need scrolling?
					// 0.49 used for better precision when dealing with float values
					if (horizontalParent && (absY + subH > winY + winH + 0.49 || absY < winY) || !horizontalParent && subH > winH + 0.49) {
						var self = this;
						if (!$sub.dataSM('scroll-arrows')) {
							$sub.dataSM('scroll-arrows', $([$('<span class="scroll-up"><span class="scroll-up-arrow"></span></span>')[0], $('<span class="scroll-down"><span class="scroll-down-arrow"></span></span>')[0]])
								.bind({
									mouseenter: function() {
										$sub.dataSM('scroll').up = $(this).hasClass('scroll-up');
										self.menuScroll($sub);
									},
									mouseleave: function(e) {
										self.menuScrollStop($sub);
										self.menuScrollOut($sub, e);
									},
									'mousewheel DOMMouseScroll': function(e) { e.preventDefault(); }
								})
								.insertAfter($sub)
							);
						}
						// bind scroll events and save scroll data for this sub
						var eNS = '.smartmenus_scroll';
						$sub.dataSM('scroll', {
								y: this.cssTransforms3d ? 0 : y - itemH,
								step: 1,
								// cache stuff for faster recalcs later
								itemH: itemH,
								subH: subH,
								arrowDownH: this.getHeight($sub.dataSM('scroll-arrows').eq(1))
							})
							.bind(getEventsNS([
								['mouseover', function(e) { self.menuScrollOver($sub, e); }],
								['mouseout', function(e) { self.menuScrollOut($sub, e); }],
								['mousewheel DOMMouseScroll', function(e) { self.menuScrollMousewheel($sub, e); }]
							], eNS))
							.dataSM('scroll-arrows').css({ top: 'auto', left: '0', marginLeft: x + (parseInt($sub.css('border-left-width')) || 0), width: subW - (parseInt($sub.css('border-left-width')) || 0) - (parseInt($sub.css('border-right-width')) || 0), zIndex: $sub.css('z-index') })
								.eq(horizontalParent && this.opts.bottomToTopSubMenus ? 0 : 1).show();
						// when a menu tree is fixed positioned we allow scrolling via touch too
						// since there is no other way to access such long sub menus if no mouse is present
						if (this.isFixed()) {
							$sub.css({ 'touch-action': 'none', '-ms-touch-action': 'none' })
								.bind(getEventsNS([
									[touchEvents ? 'touchstart touchmove touchend' : 'pointerdown pointermove pointerup MSPointerDown MSPointerMove MSPointerUp', function(e) {
										self.menuScrollTouch($sub, e);
									}]
								], eNS));
						}
					}
				}
				$sub.css({ top: 'auto', left: '0', marginLeft: x, marginTop: y - itemH });
				// IE iframe shim
				this.menuIframeShim($sub);
				if ($sub.dataSM('ie-shim')) {
					$sub.dataSM('ie-shim').css({ zIndex: $sub.css('z-index'), width: subW, height: subH, marginLeft: x, marginTop: y - itemH });
				}
			},
			menuScroll: function($sub, once, step) {
				var data = $sub.dataSM('scroll'),
					$arrows = $sub.dataSM('scroll-arrows'),
					end = data.up ? data.upEnd : data.downEnd,
					diff;
				if (!once && data.momentum) {
					data.momentum *= 0.92;
					diff = data.momentum;
					if (diff < 0.5) {
						this.menuScrollStop($sub);
						return;
					}
				} else {
					diff = step || (once || !this.opts.scrollAccelerate ? this.opts.scrollStep : Math.floor(data.step));
				}
				// hide any visible deeper level sub menus
				var level = $sub.dataSM('level');
				if (this.activatedItems[level - 1] && this.activatedItems[level - 1].dataSM('sub') && this.activatedItems[level - 1].dataSM('sub').is(':visible')) {
					this.menuHideSubMenus(level - 1);
				}
				data.y = data.up && end <= data.y || !data.up && end >= data.y ? data.y : (Math.abs(end - data.y) > diff ? data.y + (data.up ? diff : -diff) : end);
				$sub.add($sub.dataSM('ie-shim')).css(this.cssTransforms3d ? { '-webkit-transform': 'translate3d(0, ' + data.y + 'px, 0)', transform: 'translate3d(0, ' + data.y + 'px, 0)' } : { marginTop: data.y });
				// show opposite arrow if appropriate
				if (mouse && (data.up && data.y > data.downEnd || !data.up && data.y < data.upEnd)) {
					$arrows.eq(data.up ? 1 : 0).show();
				}
				// if we've reached the end
				if (data.y == end) {
					if (mouse) {
						$arrows.eq(data.up ? 0 : 1).hide();
					}
					this.menuScrollStop($sub);
				} else if (!once) {
					if (this.opts.scrollAccelerate && data.step < this.opts.scrollStep) {
						data.step += 0.2;
					}
					var self = this;
					this.scrollTimeout = requestAnimationFrame(function() { self.menuScroll($sub); });
				}
			},
			menuScrollMousewheel: function($sub, e) {
				if (this.getClosestMenu(e.target) == $sub[0]) {
					e = e.originalEvent;
					var up = (e.wheelDelta || -e.detail) > 0;
					if ($sub.dataSM('scroll-arrows').eq(up ? 0 : 1).is(':visible')) {
						$sub.dataSM('scroll').up = up;
						this.menuScroll($sub, true);
					}
				}
				e.preventDefault();
			},
			menuScrollOut: function($sub, e) {
				if (mouse) {
					if (!/^scroll-(up|down)/.test((e.relatedTarget || '').className) && ($sub[0] != e.relatedTarget && !$.contains($sub[0], e.relatedTarget) || this.getClosestMenu(e.relatedTarget) != $sub[0])) {
						$sub.dataSM('scroll-arrows').css('visibility', 'hidden');
					}
				}
			},
			menuScrollOver: function($sub, e) {
				if (mouse) {
					if (!/^scroll-(up|down)/.test(e.target.className) && this.getClosestMenu(e.target) == $sub[0]) {
						this.menuScrollRefreshData($sub);
						var data = $sub.dataSM('scroll'),
							upEnd = $(window).scrollTop() - $sub.dataSM('parent-a').offset().top - data.itemH;
						$sub.dataSM('scroll-arrows').eq(0).css('margin-top', upEnd).end()
							.eq(1).css('margin-top', upEnd + this.getViewportHeight() - data.arrowDownH).end()
							.css('visibility', 'visible');
					}
				}
			},
			menuScrollRefreshData: function($sub) {
				var data = $sub.dataSM('scroll'),
					upEnd = $(window).scrollTop() - $sub.dataSM('parent-a').offset().top - data.itemH;
				if (this.cssTransforms3d) {
					upEnd = -(parseFloat($sub.css('margin-top')) - upEnd);
				}
				$.extend(data, {
					upEnd: upEnd,
					downEnd: upEnd + this.getViewportHeight() - data.subH
				});
			},
			menuScrollStop: function($sub) {
				if (this.scrollTimeout) {
					cancelAnimationFrame(this.scrollTimeout);
					this.scrollTimeout = 0;
					$sub.dataSM('scroll').step = 1;
					return true;
				}
			},
			menuScrollTouch: function($sub, e) {
				e = e.originalEvent;
				if (isTouchEvent(e)) {
					var touchPoint = this.getTouchPoint(e);
					// neglect event if we touched a visible deeper level sub menu
					if (this.getClosestMenu(touchPoint.target) == $sub[0]) {
						var data = $sub.dataSM('scroll');
						if (/(start|down)$/i.test(e.type)) {
							if (this.menuScrollStop($sub)) {
								// if we were scrolling, just stop and don't activate any link on the first touch
								e.preventDefault();
								this.$touchScrollingSub = $sub;
							} else {
								this.$touchScrollingSub = null;
							}
							// update scroll data since the user might have zoomed, etc.
							this.menuScrollRefreshData($sub);
							// extend it with the touch properties
							$.extend(data, {
								touchStartY: touchPoint.pageY,
								touchStartTime: e.timeStamp
							});
						} else if (/move$/i.test(e.type)) {
							var prevY = data.touchY !== undefined ? data.touchY : data.touchStartY;
							if (prevY !== undefined && prevY != touchPoint.pageY) {
								this.$touchScrollingSub = $sub;
								var up = prevY < touchPoint.pageY;
								// changed direction? reset...
								if (data.up !== undefined && data.up != up) {
									$.extend(data, {
										touchStartY: touchPoint.pageY,
										touchStartTime: e.timeStamp
									});
								}
								$.extend(data, {
									up: up,
									touchY: touchPoint.pageY
								});
								this.menuScroll($sub, true, Math.abs(touchPoint.pageY - prevY));
							}
							e.preventDefault();
						} else { // touchend/pointerup
							if (data.touchY !== undefined) {
								if (data.momentum = Math.pow(Math.abs(touchPoint.pageY - data.touchStartY) / (e.timeStamp - data.touchStartTime), 2) * 15) {
									this.menuScrollStop($sub);
									this.menuScroll($sub);
									e.preventDefault();
								}
								delete data.touchY;
							}
						}
					}
				}
			},
			menuShow: function($sub) {
				if (!$sub.dataSM('beforefirstshowfired')) {
					$sub.dataSM('beforefirstshowfired', true);
					if (this.$root.triggerHandler('beforefirstshow.smapi', $sub[0]) === false) {
						return;
					}
				}
				if (this.$root.triggerHandler('beforeshow.smapi', $sub[0]) === false) {
					return;
				}
				$sub.dataSM('shown-before', true)
					.stop(true, true);
				if (!$sub.is(':visible')) {
					// highlight parent item
					var $a = $sub.dataSM('parent-a');
					if (this.opts.keepHighlighted || this.isCollapsible()) {
						$a.addClass('highlighted');
					}
					if (this.isCollapsible()) {
						$sub.removeClass('sm-nowrap').css({ zIndex: '', width: 'auto', minWidth: '', maxWidth: '', top: '', left: '', marginLeft: '', marginTop: '' });
					} else {
						// set z-index
						$sub.css('z-index', this.zIndexInc = (this.zIndexInc || this.getStartZIndex()) + 1);
						// min/max-width fix - no way to rely purely on CSS as all UL's are nested
						if (this.opts.subMenusMinWidth || this.opts.subMenusMaxWidth) {
							$sub.css({ width: 'auto', minWidth: '', maxWidth: '' }).addClass('sm-nowrap');
							if (this.opts.subMenusMinWidth) {
							 	$sub.css('min-width', this.opts.subMenusMinWidth);
							}
							if (this.opts.subMenusMaxWidth) {
							 	var noMaxWidth = this.getWidth($sub);
							 	$sub.css('max-width', this.opts.subMenusMaxWidth);
								if (noMaxWidth > this.getWidth($sub)) {
									$sub.removeClass('sm-nowrap').css('width', this.opts.subMenusMaxWidth);
								}
							}
						}
						this.menuPosition($sub);
						// insert IE iframe shim
						if ($sub.dataSM('ie-shim')) {
							$sub.dataSM('ie-shim').insertBefore($sub);
						}
					}
					var complete = function() {
						// fix: "overflow: hidden;" is not reset on animation complete in jQuery < 1.9.0 in Chrome when global "box-sizing: border-box;" is used
						$sub.css('overflow', '');
					};
					// if sub is collapsible (mobile view)
					if (this.isCollapsible()) {
						if (this.opts.collapsibleShowFunction) {
							this.opts.collapsibleShowFunction.call(this, $sub, complete);
						} else {
							$sub.show(this.opts.collapsibleShowDuration, complete);
						}
					} else {
						if (this.opts.showFunction) {
							this.opts.showFunction.call(this, $sub, complete);
						} else {
							$sub.show(this.opts.showDuration, complete);
						}
					}
					// accessibility
					$a.attr('aria-expanded', 'true');
					$sub.attr({
						'aria-expanded': 'true',
						'aria-hidden': 'false'
					});
					// store sub menu in visible array
					this.visibleSubMenus.push($sub);
					this.$root.triggerHandler('show.smapi', $sub[0]);
				}
			},
			popupHide: function(noHideTimeout) {
				if (this.hideTimeout) {
					clearTimeout(this.hideTimeout);
					this.hideTimeout = 0;
				}
				var self = this;
				this.hideTimeout = setTimeout(function() {
					self.menuHideAll();
				}, noHideTimeout ? 1 : this.opts.hideTimeout);
			},
			popupShow: function(left, top) {
				if (!this.opts.isPopup) {
					alert('SmartMenus jQuery Error:\n\nIf you want to show this menu via the "popupShow" method, set the isPopup:true option.');
					return;
				}
				if (this.hideTimeout) {
					clearTimeout(this.hideTimeout);
					this.hideTimeout = 0;
				}
				this.$root.dataSM('shown-before', true)
					.stop(true, true);
				if (!this.$root.is(':visible')) {
					this.$root.css({ left: left, top: top });
					// IE iframe shim
					this.menuIframeShim(this.$root);
					if (this.$root.dataSM('ie-shim')) {
						this.$root.dataSM('ie-shim').css({ zIndex: this.$root.css('z-index'), width: this.getWidth(this.$root), height: this.getHeight(this.$root), left: left, top: top }).insertBefore(this.$root);
					}
					// show menu
					var self = this,
						complete = function() {
							self.$root.css('overflow', '');
						};
					if (this.opts.showFunction) {
						this.opts.showFunction.call(this, this.$root, complete);
					} else {
						this.$root.show(this.opts.showDuration, complete);
					}
					this.visibleSubMenus[0] = this.$root;
				}
			},
			refresh: function() {
				this.destroy(true);
				this.init(true);
			},
			rootKeyDown: function(e) {
				if (!this.handleEvents()) {
					return;
				}
				switch (e.keyCode) {
					case 27: // reset on Esc
						var $activeTopItem = this.activatedItems[0];
						if ($activeTopItem) {
							this.menuHideAll();
							$activeTopItem[0].focus();
							var $sub = $activeTopItem.dataSM('sub');
							if ($sub) {
								this.menuHide($sub);
							}
						}
						break;
					case 32: // activate item's sub on Space
						var $target = $(e.target);
						if ($target.is('a') && this.handleItemEvents($target)) {
							var $sub = $target.dataSM('sub');
							if ($sub && !$sub.is(':visible')) {
								this.itemClick({ currentTarget: e.target });
								e.preventDefault();
							}
						}
						break;
				}
			},
			rootOut: function(e) {
				if (!this.handleEvents() || this.isTouchMode() || e.target == this.$root[0]) {
					return;
				}
				if (this.hideTimeout) {
					clearTimeout(this.hideTimeout);
					this.hideTimeout = 0;
				}
				if (!this.opts.showOnClick || !this.opts.hideOnClick) {
					var self = this;
					this.hideTimeout = setTimeout(function() { self.menuHideAll(); }, this.opts.hideTimeout);
				}
			},
			rootOver: function(e) {
				if (!this.handleEvents() || this.isTouchMode() || e.target == this.$root[0]) {
					return;
				}
				if (this.hideTimeout) {
					clearTimeout(this.hideTimeout);
					this.hideTimeout = 0;
				}
			},
			winResize: function(e) {
				if (!this.handleEvents()) {
					// we still need to resize the disable overlay if it's visible
					if (this.$disableOverlay) {
						var pos = this.$root.offset();
	 					this.$disableOverlay.css({
							top: pos.top,
							left: pos.left,
							width: this.$root.outerWidth(),
							height: this.$root.outerHeight()
						});
					}
					return;
				}
				// hide sub menus on resize - on mobile do it only on orientation change
				if (!('onorientationchange' in window) || e.type == 'orientationchange') {
					var isCollapsible = this.isCollapsible();
					// if it was collapsible before resize and still is, don't do it
					if (!(this.wasCollapsible && isCollapsible)) { 
						if (this.activatedItems.length) {
							this.activatedItems[this.activatedItems.length - 1][0].blur();
						}
						this.menuHideAll();
					}
					this.wasCollapsible = isCollapsible;
				}
			}
		}
	});

	$.fn.dataSM = function(key, val) {
		if (val) {
			return this.data(key + '_smartmenus', val);
		}
		return this.data(key + '_smartmenus');
	};

	$.fn.removeDataSM = function(key) {
		return this.removeData(key + '_smartmenus');
	};

	$.fn.smartmenus = function(options) {
		if (typeof options == 'string') {
			var args = arguments,
				method = options;
			Array.prototype.shift.call(args);
			return this.each(function() {
				var smartmenus = $(this).data('smartmenus');
				if (smartmenus && smartmenus[method]) {
					smartmenus[method].apply(smartmenus, args);
				}
			});
		}
		// [data-sm-options] attribute on the root UL
		var dataOpts = this.data('sm-options') || null;
		if (dataOpts) {
			try {
				dataOpts = eval('(' + dataOpts + ')');
			} catch(e) {
				dataOpts = null;
				alert('ERROR\n\nSmartMenus jQuery init:\nInvalid "data-sm-options" attribute value syntax.');
			};
		}
		return this.each(function() {
			new $.SmartMenus(this, $.extend({}, $.fn.smartmenus.defaults, options, dataOpts));
		});
	};

	// default settings
	$.fn.smartmenus.defaults = {
		isPopup:		false,		// is this a popup menu (can be shown via the popupShow/popupHide methods) or a permanent menu bar
		mainMenuSubOffsetX:	0,		// pixels offset from default position
		mainMenuSubOffsetY:	0,		// pixels offset from default position
		subMenusSubOffsetX:	0,		// pixels offset from default position
		subMenusSubOffsetY:	0,		// pixels offset from default position
		subMenusMinWidth:	'10em',		// min-width for the sub menus (any CSS unit) - if set, the fixed width set in CSS will be ignored
		subMenusMaxWidth:	'20em',		// max-width for the sub menus (any CSS unit) - if set, the fixed width set in CSS will be ignored
		subIndicators: 		true,		// create sub menu indicators - creates a SPAN and inserts it in the A
		subIndicatorsPos: 	'prepend',	// position of the SPAN relative to the menu item content ('prepend', 'append')
		subIndicatorsText:	'+',		// [optionally] add text in the SPAN (e.g. '+') (you may want to check the CSS for the sub indicators too)
		scrollStep: 		30,		// pixels step when scrolling long sub menus that do not fit in the viewport height
		scrollAccelerate:	true,		// accelerate scrolling or use a fixed step
		showTimeout:		250,		// timeout before showing the sub menus
		hideTimeout:		500,		// timeout before hiding the sub menus
		showDuration:		0,		// duration for show animation - set to 0 for no animation - matters only if showFunction:null
		showFunction:		null,		// custom function to use when showing a sub menu (the default is the jQuery 'show')
							// don't forget to call complete() at the end of whatever you do
							// e.g.: function($ul, complete) { $ul.fadeIn(250, complete); }
		hideDuration:		0,		// duration for hide animation - set to 0 for no animation - matters only if hideFunction:null
		hideFunction:		function($ul, complete) { $ul.fadeOut(200, complete); },	// custom function to use when hiding a sub menu (the default is the jQuery 'hide')
							// don't forget to call complete() at the end of whatever you do
							// e.g.: function($ul, complete) { $ul.fadeOut(250, complete); }
		collapsibleShowDuration:0,		// duration for show animation for collapsible sub menus - matters only if collapsibleShowFunction:null
		collapsibleShowFunction:function($ul, complete) { $ul.slideDown(200, complete); },	// custom function to use when showing a collapsible sub menu
							// (i.e. when mobile styles are used to make the sub menus collapsible)
		collapsibleHideDuration:0,		// duration for hide animation for collapsible sub menus - matters only if collapsibleHideFunction:null
		collapsibleHideFunction:function($ul, complete) { $ul.slideUp(200, complete); },	// custom function to use when hiding a collapsible sub menu
							// (i.e. when mobile styles are used to make the sub menus collapsible)
		showOnClick:		false,		// show the first-level sub menus onclick instead of onmouseover (i.e. mimic desktop app menus) (matters only for mouse input)
		hideOnClick:		true,		// hide the sub menus on click/tap anywhere on the page
		noMouseOver:		false,		// disable sub menus activation onmouseover (i.e. behave like in touch mode - use just mouse clicks) (matters only for mouse input)
		keepInViewport:		true,		// reposition the sub menus if needed to make sure they always appear inside the viewport
		keepHighlighted:	true,		// keep all ancestor items of the current sub menu highlighted (adds the 'highlighted' class to the A's)
		markCurrentItem:	false,		// automatically add the 'current' class to the A element of the item linking to the current URL
		markCurrentTree:	true,		// add the 'current' class also to the A elements of all ancestor items of the current item
		rightToLeftSubMenus:	false,		// right to left display of the sub menus (check the CSS for the sub indicators' position)
		bottomToTopSubMenus:	false,		// bottom to top display of the sub menus
		overlapControlsInIE:	true		// make sure sub menus appear on top of special OS controls in IE (i.e. SELECT, OBJECT, EMBED, etc.)
	};

	return $;
}));

jQuery( window ).on( 'elementor/frontend/init', function() {

    var MenuHandler = elementorModules.frontend.handlers.Base.extend({
      stretchElement: null,
      getDefaultSettings: function () {
        return {
          selectors: {
            menu: '.twbb-nav-menu',
            dropdownMenu: '.twbb-nav-menu__container.twbb-nav-menu--dropdown',
            menuToggle: '.twbb-menu-toggle'
          }
        };
      },
      getDefaultElements: function () {
        var selectors = this.getSettings('selectors'),
          elements = {};
        elements.$menu = this.$element.find(selectors.menu);
        elements.$dropdownMenu = this.$element.find(selectors.dropdownMenu);
        elements.$dropdownMenuFinalItems = elements.$dropdownMenu.find('.menu-item:not(.menu-item-has-children) > a');
        elements.$menuToggle = this.$element.find(selectors.menuToggle);
        return elements;
      },
      bindEvents: function () {
        if (!this.elements.$menu.length) {
          return;
        }
        this.elements.$menuToggle.on('click', this.toggleMenu.bind(this));
        this.elements.$dropdownMenuFinalItems.on('click', this.toggleMenu.bind(this, false));
        elementorFrontend.addListenerOnce(this.$element.data('model-cid'), 'resize', this.stretchMenu);
      },
      initStretchElement: function () {
        this.stretchElement = new elementorFrontend.modules.StretchElement({element: this.elements.$dropdownMenu});
      },
      toggleMenu: function (show) {
        var $dropdownMenu = this.elements.$dropdownMenu,
          isDropdownVisible = this.elements.$menuToggle.hasClass('twbb-active');
        if ('boolean' !== typeof show) {
          show = !isDropdownVisible;
        }
        this.elements.$menuToggle.toggleClass('twbb-active', show);
        if (show) {
          $dropdownMenu.hide().slideDown(250, function () {
            $dropdownMenu.css('display', '');
          });
          if (this.getElementSettings('full_width')) {
            this.stretchElement.stretch();
          }
        }
        else {
          $dropdownMenu.show().slideUp(250, function () {
            $dropdownMenu.css('display', '');
          });
        }
      },
      stretchMenu: function () {
        if (this.getElementSettings('full_width')) {
          this.stretchElement.stretch();
          this.elements.$dropdownMenu.css('top', this.elements.$menuToggle.outerHeight());
        }
        else {
          this.stretchElement.reset();
        }
      },
      onInit: function () {

          elementorModules.frontend.handlers.Base.prototype.onInit.apply(this, arguments);
        if (!this.elements.$menu.length) {
          return;
        }
        this.elements.$menu.smartmenus({
          subIndicatorsText: '<i class="fa"></i>',
          subIndicatorsPos: 'append',
          subMenusMaxWidth: '1000px',
        });
        this.initStretchElement();
        this.stretchMenu();
      },
      onElementChange: function (propertyName) {
        if ('full_width' === propertyName) {
          this.stretchMenu();
        }
      }
    });

  elementorFrontend.hooks.addAction( 'frontend/element_ready/twbb-nav-menu.default', function ( $scope ) {
    if ( jQuery.fn.smartmenus ) {
      // Override the default stupid detection
      jQuery.SmartMenus.prototype.isCSSOn = function() {
        return true;
      };

      if ( elementorFrontend.config.is_rtl  ) {
        jQuery.fn.smartmenus.defaults.rightToLeftSubMenus = true;
      }
    }

    new MenuHandler( { $element: $scope } );
  });
});

var twbb_widgets = [];
var twbb_posts = function (args, name) {

    var _this = this;

    var current_page = 1;
    var template = "";
    var $container = null;
    var $pagination = null;
    var $widget_container = null;
    var $loading = null;
    var is_editor = (typeof elementor !== "undefined");

    this.query_args = args.query_args;
    this.query_args_hash = args.query_args_hash;
    this.widget_id = args.widget_id;
    this.settings = args.settings;
    this.posts = [];
    this.pages_count = 1;

    this.init = function () {
        set_html_elements();
        set_template();
        this.get_posts();
    };

    this.render = function () {
        var html, i;

        this.clear_html();
        var compiled = _.template(template);

        if (this.posts.length === 0) {
            $widget_container.append('<p>No posts found.</p>');
            return;
        }

        for (i in this.posts) {
            html = compiled(this.posts[i]);
            $widget_container.append(html);
        }
        this.display_separators();

        if (this.settings.masonry === "yes") {
            this.masonry();
        }

        if (this.settings.pagination === "yes" && this.pages_count > 1) {
            this.pagination();
        }
    };

    this.get_posts = function () {

        this.show_loading();

        if (current_page === 1 && typeof args.first_page_data !== "undefined") {
            _this.posts = args.first_page_data.posts;
            _this.pages_count = args.first_page_data.pages_count;
            _this.render();
            _this.hide_loading();
            return;
        }

        jQuery.post(twbb.ajaxurl, {
            action: 'twbb_widgets',
            widget_name: "posts",
            query_args: _this.query_args,
            query_args_hash: _this.query_args_hash,
            page: current_page,
            nonce: twbb.nonce
        }).done(function (data) {
            _this.posts = data.data.posts;
            _this.pages_count = parseInt(data.data.pages_count);
            _this.render();
            _this.hide_loading();
        }).fail(function (data) {
            _this.hide_loading();
        });

    };

    this.display_separators = function () {
        jQuery('.twbb-posts-meta-data').each(function () {

            var last_item = null;
            jQuery(this).find('.twbb-posts-meta-separator').each(function () {
                if (jQuery(this).prev().html() !== "") {
                    jQuery(this).addClass('twbb-posts-active-meta-separator');
                    last_item = jQuery(this);
                }
            });
            last_item.removeClass('twbb-posts-active-meta-separator');
        });
    };

    this.masonry = function () {
        var $msnry = $widget_container.imagesLoaded(function () {
            // init Masonry after all images have loaded
            $msnry.masonry({
                gutter: _this.settings.masonry_column_gap.size,
                itemSelector: '.twbb-posts-item'
            }).masonry('reloadItems');
        });

    };

    this.pagination = function () {
        var html = "";

        var deactive_class = 'twbb-posts-page-deactive';
        var class_name = "";

        if (this.settings.pagination_first_last_buttons === "yes") {
            class_name = 'twbb-posts-page twbb-posts-page-first';
            if (current_page === 1) {
                class_name += ' ' + deactive_class;
            }

            html += get_page_link_html(class_name, 1, this.settings.pagination_first_label);
        }

        if (this.settings.pagination_next_prev_buttons === "yes") {
            class_name = 'twbb-posts-page twbb-posts-page-prev';
            if (current_page === 1) {
                class_name += ' ' + deactive_class;
            }

            html += get_page_link_html(class_name, current_page - 1, this.settings.pagination_prev_label);
        }

        var length = (this.pages_count > this.settings.pagination_page_limit) ? this.settings.pagination_page_limit : this.pages_count;
        if (this.settings.pagination_number_buttons === "yes") {
            for (var i = 1; i <= length; i++) {
                class_name = 'twbb-posts-page twbb-posts-page-num';
                if (i === current_page) {
                    class_name += ' twbb-posts-current-page ' + deactive_class;
                }

                html += get_page_link_html(class_name, i, i);

            }
        }

        if (this.settings.pagination_next_prev_buttons === "yes") {
            class_name = 'twbb-posts-page twbb-posts-page-next';
            if (current_page === this.pages_count) {
                class_name += ' ' + deactive_class;
            }

            html += get_page_link_html(class_name, current_page + 1, this.settings.pagination_next_label);
        }

        if (this.settings.pagination_first_last_buttons === "yes") {
            class_name = 'twbb-posts-page twbb-posts-page-last';
            if (current_page === this.pages_count) {
                class_name += ' ' + deactive_class;
            }

            html += get_page_link_html(class_name, length, this.settings.pagination_last_label);
        }

        if ($pagination === null) {
            html = "<div class='twbb-posts-pagination'>" + html + "</div>";

            $widget_container.parent().append(html);
            $pagination = $container.find('.twbb-posts-pagination');
        } else {
            $pagination.append(html);
        }

        $pagination.find('.twbb-posts-page').on('click', function (e) {
            e.preventDefault();

            if (is_editor === true) {
                return false;
            }

            var page = parseInt(jQuery(this).data('page'));
            if (page < 1 || page > _this.pages_count) {
                return false;
            }

            current_page = page;
            _this.get_posts();
            jQuery(window).scrollTop(0);
            return false;
        });
    };

    this.show_loading = function () {
        if ($loading === null) {
            $container.append('<div class="twbb-posts-loading"><i class="fa fa-spinner fa-spin"></i></div>');
            $loading = jQuery($container.find('.twbb-posts-loading'));
        } else {
            $loading.show();
        }
    };

    this.hide_loading = function () {
        $loading.hide();
    };

    function set_html_elements() {
        $container = jQuery('div[data-id="' + _this.widget_id + '"]');
        if ( 0 == $container.length ) { /* Global widget */
            $container = jQuery('.elementor-global-' + _this.widget_id);
        }
        $widget_container = $container.find('.twbb-posts-widget-container');
    }

    function set_template() {
        settings = _this.settings;

        template = "";


        var img_template = "";
        var title_template = "";

        if (settings.show_image === "yes") {
            img_template = "<% if(twbb_image != '') { %><div class='twbb-posts-image'><img src='<%= twbb_image %>'/></div><% } %>";
        }

        if (settings.show_title === "yes") {
            title_template += "<div class='twbb-posts-title'>" +
                "<" + settings.title_tag + " class='twbb-posts-title-tag'><a href='<%= twbb_permalink %>'><%= post_title %></a></" + settings.title_tag + ">" +
                "</div>";
        }

        if (settings.image_position === "above_title") {
            template += img_template + title_template;
        } else {
            template += title_template + img_template;
        }

        if (typeof settings.meta_data !== "undefined" && settings.meta_data.length > 0) {
            template += "<div class='twbb-posts-meta-data'>";
            for (var i = 0; i < settings.meta_data.length; i++) {
                switch (settings.meta_data[i]) {
                    case "author":
                        template += '<span class="twbb-posts-author-meta"><% print(posts_print_author(twbb_author)) %></span>';
                        break;
                    case "date":
                        template += '<span class="twbb-posts-date-meta"><%= twbb_date %></span>';
                        break;
                    case "time":
                        template += '<span class="twbb-posts-time-meta"><%= twbb_time %></span>';
                        break;
                    case "comments":
                        template += '<span class="twbb-posts-comments-meta">' +
                            '<% if(twbb_comments > 0) { %><%=  twbb_comments %> <% }else{ print("No") } print(" comments")%>' +
                            '</span>';
                        break;
                    case "categories":
                        template += '<span class="twbb-posts-categories-meta"><% print(posts_print_terms(twbb_categories, "categories")) %></span>';
                        break;
                    case "tags":
                        template += '<span class="twbb-posts-tags-meta"><% print(posts_print_terms(twbb_tags, "tags")) %></span>';
                        break;
                }

                template += '<span class="twbb-posts-meta-separator">' + settings.meta_separator + '</span>';
            }
            template += "</div>";

        }

        if (settings.show_excerpt === "yes") {
            template += "<div class='twbb-posts-content'><%= twbb_excerpt %></div>";
        }

        if (settings.show_read_more === "yes") {
            template += "<div class='twbb-posts-read-more'>" +
                "<a href='<%= twbb_permalink %>'>" + settings.read_more_text + "</a>" +
                "</div>";
        }

        template = '<div class="twbb-posts-item">' + template + '</div>';
    }

    get_page_link_html = function (class_name, page, text) {
        return "<a href='#' class='" + class_name + "' data-page='" + page + "'>" + text + "</a>";
    };

    posts_print_author = function (twbb_author) {

        if (_this.settings.author_meta_link === "yes") {
            return "<a href='" + twbb_author.link + "'>" + twbb_author.name + "</a>";
        } else {
            return twbb_author.name;
        }
    };

    posts_print_terms = function (terms, tax) {
        var html = "";
        var prefix = (tax === "tags") ? "#" : "";
        var link = (
            (tax === "categories" && _this.settings.categories_meta_link === "yes") ||
            (tax === "tags" && _this.settings.tags_meta_link === "yes")
        );


        for (var i in terms) {
            if (link === true) {
                html += "<a href='" + terms[i].link + "'>" + prefix + terms[i].name + "</a>, ";
            } else {
                html += prefix + terms[i].name + ", ";
            }
        }

        return html.trim().slice(0, html.length - 2);
    };

    this.clear_html = function () {

        if ($widget_container !== null) {
            $widget_container.html('');
        }

        if ($pagination !== null) {
            $pagination.html('');

            if (_this.settings.masonry === "yes") {
                $widget_container.masonry('destroy');
            }
        }

    };

    this.init();
    twbb_add_widget(name, this);
};

function twbb_add_widget(name, widget) {
  if (typeof twbb_widgets[name] === "undefined") {
    twbb_widgets[name] = [];
  }
  twbb_widgets[name].push(widget);
}

function twbb_get_widgets(name) {
  if (typeof twbb_widgets[name] === "undefined") {
    return [];
  }
  else {
    return twbb_widgets[name];
  }
}

function twbb_is_widget_added(name) {
  return (jQuery('.elementor-widget-' + name).length > 0);
}

jQuery( window ).on( 'elementor/frontend/init', function () {
    var twbb_posts_ready = function ( $scope ) {
        var $element = $scope.find( '.twbb-posts-widget-container' );

        new twbb_posts( JSON.parse( $element.attr('data-params') ), $element.attr('data-widget'));
    };
    elementorFrontend.hooks.addAction('frontend/element_ready/twbb-posts.default', twbb_posts_ready );
    elementorFrontend.hooks.addAction('frontend/element_ready/twbb-posts-archive.default', twbb_posts_ready );
});

jQuery( window ).on( 'elementor/frontend/init', function() {
  var tenwebSearchBerHandler = elementorModules.frontend.handlers.Base.extend({
    getDefaultSettings: function () {
      return {
        selectors: {
          wrapper: '.tenweb-search-form',
          container: '.tenweb-search-form__container',
          icon: '.tenweb-search-form__icon',
          input: '.tenweb-search-form__input',
          toggle: '.tenweb-search-form__toggle',
          submit: '.tenweb-search-form__submit',
          closeButton: '.dialog-close-button'
        },
        classes: {
          isFocus: 'tenweb-search-form--focus',
          isFullScreen: 'tenweb-search-form--full-screen',
          lightbox: 'tenweb-lightbox'
        }
      };
    },
    getDefaultElements: function () {
      var selectors = this.getSettings('selectors'),
        elements = {};
      elements.$wrapper = this.$element.find(selectors.wrapper);
      elements.$container = this.$element.find(selectors.container);
      elements.$input = this.$element.find(selectors.input);
      elements.$icon = this.$element.find(selectors.icon);
      elements.$toggle = this.$element.find(selectors.toggle);
      elements.$submit = this.$element.find(selectors.submit);
      elements.$closeButton = this.$element.find(selectors.closeButton);
      return elements;
    },
    bindEvents: function () {
      var self = this,
        $container = self.elements.$container,
        $closeButton = self.elements.$closeButton,
        $input = self.elements.$input,
        $wrapper = self.elements.$wrapper,
        $icon = self.elements.$icon,
        skin = this.getElementSettings('skin'),
        classes = this.getSettings('classes');
      if ('full_screen' === skin) {

        // Activate full-screen mode on click
        self.elements.$toggle.on('click', function () {
          $container.toggleClass(classes.isFullScreen).toggleClass(classes.lightbox);
          $input.focus();
        });
        // Deactivate full-screen mode on click or on esc.
        $container.on('click', function (event) {
          if ($container.hasClass(classes.isFullScreen) && ($container[0] === event.target)) {
            $container.removeClass(classes.isFullScreen).removeClass(classes.lightbox);
          }
        });
        $closeButton.on('click', function () {
          $container.removeClass(classes.isFullScreen).removeClass(classes.lightbox);
        });
        elementorFrontend.getElements('$document').keyup(function (event) {
          var ESC_KEY = 27;
          if (ESC_KEY === event.keyCode) {
            if ($container.hasClass(classes.isFullScreen)) {
              $container.click();
            }
          }
        });
      }
      else {

        // Apply focus style on wrapper element when input is focused
        $input.on({
          focus: function () {
            $wrapper.addClass(classes.isFocus);
          },
          blur: function () {
            $wrapper.removeClass(classes.isFocus);
          }
        });
      }
      if ('minimal' === skin) {

        // Apply focus style on wrapper element when icon is clicked in minimal skin
        $icon.on('click', function () {
          $wrapper.addClass(classes.isFocus);
          $input.focus();
        });
      }
    }
  });
  elementorFrontend.hooks.addAction('frontend/element_ready/twbbsearch-form.default', function ($scope) {
    new tenwebSearchBerHandler({$element: $scope});
  });
});







(function( $ ) {

  var ShareLink = function( element, userSettings ) {
    var $element,
      settings = {};

    var getNetworkLink = function( networkName ) {
      var link = ShareLink.networkTemplates[ networkName ].replace( /{([^}]+)}/g, function( fullMatch, pureMatch ) {
        if ( networkName == 'twitter' && pureMatch == 'text' ) {
          var text = jQuery(jQuery.parseHTML(settings[pureMatch])).text().replace(/\s\s+/g, ' ');
          var href = window.location.href;
          settings[pureMatch] = text.substr( 0, 345 - href.length ) + ' ...';
        }

        return settings[ pureMatch ];
      });

      return encodeURI( link );
    };

    var getNetworkNameFromClass = function( className ) {
      var classNamePrefix = className.substr( 0, settings.classPrefixLength );

      return classNamePrefix === settings.classPrefix ? className.substr( settings.classPrefixLength ) : null;
    };

    var bindShareClick = function( networkName ) {
      $element.on( 'click', function() {
        openShareLink( networkName );
      } );
    };

    var openShareLink = function( networkName ) {
      var shareWindowParams = '';

      if ( settings.width && settings.height ) {
        var shareWindowLeft = screen.width / 2 - settings.width / 2,
          shareWindowTop = screen.height / 2 - settings.height / 2;

        shareWindowParams = 'toolbar=0,status=0,width=' + settings.width + ',height=' + settings.height + ',top=' + shareWindowTop + ',left=' + shareWindowLeft;
      }

      var link = getNetworkLink( networkName ),
        isPlainLink = /^https?:\/\//.test( link ),
        windowName = isPlainLink ? '' : '_self';

      open( link, windowName, shareWindowParams );
    };

    var run = function() {
      $.each( element.classList, function() {
        var networkName = getNetworkNameFromClass( this );

        if ( networkName ) {
          bindShareClick( networkName );

          return false;
        }
      } );
    };

    var initSettings = function() {
      $.extend( settings, ShareLink.defaultSettings, userSettings );

      [ 'title', 'text' ].forEach( function( propertyName ) {
        settings[ propertyName ] = settings[ propertyName ].replace( '#', '' );
      } );

      settings.classPrefixLength = settings.classPrefix.length;
    };

    var initElements = function() {
      $element = $( element );
    };

    var init = function() {
      initSettings();

      initElements();

      run();
    };

    init();
  };

  ShareLink.networkTemplates = {
    twitter: 'https://twitter.com/intent/tweet?url={url}&text={text}',
    pinterest: 'https://www.pinterest.com/pin/find/?url={url}',
    facebook: 'https://www.facebook.com/sharer.php?u={url}',
    vk: 'https://vkontakte.ru/share.php?url={url}&title={title}&description={text}&image={image}',
    linkedin: 'https://www.linkedin.com/shareArticle?mini=true&url={url}&title={title}&summary={text}&source={url}',
    odnoklassniki: 'http://odnoklassniki.ru/dk?st.cmd=addShare&st.s=1&st._surl={url}',
    tumblr: 'https://tumblr.com/share/link?url={url}',
    delicious: 'https://del.icio.us/save?url={url}&title={title}',
    digg: 'https://digg.com/submit?url={url}',
    reddit: 'https://reddit.com/submit?url={url}&title={title}',
    /*mix: 'https://www.mix.com/submit?url={url}',*/
    pocket: 'https://getpocket.com/edit?url={url}',
    whatsapp: 'whatsapp://send?text=*{title}*\n{text}\n{url}',
    xing: 'https://www.xing.com/app/user?op=share&url={url}',
    print: 'javascript:print()',
    email: 'mailto:?subject={title}&body={url}',
    telegram: 'https://telegram.me/share/url?url={url}&text={text}',
    skype: 'https://web.skype.com/share?url={url}'
  };

  ShareLink.defaultSettings = {
    title: '',
    text: '',
    image: '',
    url: location.href,
    classPrefix: 's_',
    width: 640,
    height: 480
  };

  $.each( { shareLink: ShareLink }, function( pluginName ) {
    var PluginConstructor = this;

    $.fn[ pluginName ] = function( settings ) {
      return this.each( function() {
        $( this ).data( pluginName, new PluginConstructor( this, settings ) );
      } );
    };
  } );
})( jQuery );

jQuery( window ).on( 'elementor/frontend/init', function() {
  var HandlerModule = elementorModules.frontend.handlers.Base,
    tenwebShareButtonsHandler;

  tenwebShareButtonsHandler = HandlerModule.extend( {
    onInit: function() {
      HandlerModule.prototype.onInit.apply( this, arguments );

      var elementSettings = this.getElementSettings(),
        classes = this.getSettings( 'classes' ),
        isCustomURL = elementSettings.share_url && elementSettings.share_url.url,
        shareLinkSettings = {
          classPrefix: classes.shareLinkPrefix
        };

      if ( isCustomURL ) {
        shareLinkSettings.url = elementSettings.share_url.url;
      } else {
        shareLinkSettings.url = location.href;
        shareLinkSettings.title = elementorFrontend.config.post.title;
        shareLinkSettings.text = elementorFrontend.config.post.excerpt;
      }

      this.elements.$shareButton.shareLink( shareLinkSettings );
    },
    getDefaultSettings: function() {
      return {
        selectors: {
          shareButton: '.elementor-share-btn'
        },
        classes: {
          shareLinkPrefix: 'elementor-share-btn_'
        }
      };
    },
    getDefaultElements: function() {
      var selectors = this.getSettings( 'selectors' );

      return {
        $shareButton: this.$element.find( selectors.shareButton )
      };
    }
  } );

  if ( ! elementorFrontend.isEditMode() ) {
    elementorFrontend.hooks.addAction('frontend/element_ready/twbbshare-buttons.default', function ($scope) {
      new tenwebShareButtonsHandler({$element: $scope});
    });
  }
});
jQuery( window ).on( 'elementor/frontend/init', function() {
  var TOCHandler = elementorModules.frontend.handlers.Base.extend({
      getDefaultSettings: function getDefaultSettings() {
      var elementSettings = this.getElementSettings(),
          listWrapperTag = 'numbers' === elementSettings.marker_view ? 'ol' : 'ul';
      return {
        selectors: {
          widgetContainer: '.elementor-widget-container',
          postContentContainer: '.elementor:not([data-elementor-type="header"]):not([data-elementor-type="footer"]):not([data-elementor-type="popup"])',
          expandButton: '.elementor-toc__toggle-button--expand',
          collapseButton: '.elementor-toc__toggle-button--collapse',
          body: '.elementor-toc__body',
          headerTitle: '.elementor-toc__header-title'
        },
        classes: {
          anchor: 'elementor-menu-anchor',
          listWrapper: 'elementor-toc__list-wrapper',
          listItem: 'elementor-toc__list-item',
          listTextWrapper: 'elementor-toc__list-item-text-wrapper',
          firstLevelListItem: 'elementor-toc__top-level',
          listItemText: 'elementor-toc__list-item-text',
          activeItem: 'elementor-item-active',
          headingAnchor: 'elementor-toc__heading-anchor',
          collapsed: 'elementor-toc--collapsed'
        },
        listWrapperTag: listWrapperTag
      };
    },
    getDefaultElements: function getDefaultElements() {
      var settings = this.getSettings();
      return {
        $pageContainer: this.getContainer(),
        $widgetContainer: this.$element.find(settings.selectors.widgetContainer),
        $expandButton: this.$element.find(settings.selectors.expandButton),
        $collapseButton: this.$element.find(settings.selectors.collapseButton),
        $tocBody: this.$element.find(settings.selectors.body),
        $listItems: this.$element.find('.' + settings.classes.listItem)
      };
    },
    getContainer: function getContainer() {
      var settings = this.getSettings(),
          elementSettings = this.getElementSettings(); // If there is a custom container defined by the user, use it as the headings-scan container

      if (elementSettings.container) {
        return jQuery(elementSettings.container);
      } // Get the document wrapper element in which the TOC is located


      var $documentWrapper = this.$element.parents('.elementor'); // If the TOC container is a popup, only scan the popup for headings

      if ('popup' === $documentWrapper.attr('data-elementor-type')) {
        return $documentWrapper;
      } // If the TOC container is anything other than a popup, scan only the post/page content for headings


      return jQuery(settings.selectors.postContentContainer);
    },
    bindEvents: function bindEvents() {
      var _this = this;

      var elementSettings = this.getElementSettings();

      if (elementSettings.minimize_box) {
        this.elements.$expandButton.on('click', function () {
          return _this.expandBox();
        });
        this.elements.$collapseButton.on('click', function () {
          return _this.collapseBox();
        });
      }

      if (elementSettings.collapse_subitems) {
        this.elements.$listItems.on('hover', function (event) {
          return jQuery(event.target).slideToggle();
        });
      }
    },
    getHeadings: function getHeadings() {
    // Get all headings from document by user-selected tags
    var elementSettings = this.getElementSettings(),
        tags = elementSettings.headings_by_tags.join(','),
        selectors = this.getSettings('selectors'),
        excludedSelectors = elementSettings.exclude_headings_by_selector;
    return this.elements.$pageContainer.find(tags).not(selectors.headerTitle).filter(function (index, heading) {
      return !jQuery(heading).closest(excludedSelectors).length; // Handle excluded selectors if there are any
    });
  },
    addAnchorsBeforeHeadings: function addAnchorsBeforeHeadings() {
    var _this2 = this;

    var classes = this.getSettings('classes'); // Add an anchor element right before each TOC heading to create anchors for TOC links

    this.elements.$headings.before(function (index) {
      // Check if the heading element itself has an ID, or if it is a widget which includes a main heading element, whether the widget wrapper has an ID
      if (jQuery(_this2.elements.$headings[index]).data('hasOwnID')) {
        return;
      }

      return "<span id=\"".concat(classes.headingAnchor, "-").concat(index, "\" class=\"").concat(classes.anchor, " \"></span>");
    });
  },
    activateItem: function activateItem($listItem) {
    var classes = this.getSettings('classes');
    this.deactivateActiveItem($listItem);
    $listItem.addClass(classes.activeItem);
    this.$activeItem = $listItem;

    if (!this.getElementSettings('collapse_subitems')) {
      return;
    }

    var $activeList;

    if ($listItem.hasClass(classes.firstLevelListItem)) {
      $activeList = $listItem.parent().next();
    } else {
      $activeList = $listItem.parents('.' + classes.listWrapper).eq(-2);
    }

    if (!$activeList.length) {
      delete this.$activeList;
      return;
    }

    this.$activeList = $activeList;
    this.$activeList.stop().slideDown();
  },
    deactivateActiveItem: function deactivateActiveItem($activeToBe) {
    if (!this.$activeItem || this.$activeItem.is($activeToBe)) {
      return;
    }

    var _this$getSettings = this.getSettings(),
        classes = _this$getSettings.classes;

    this.$activeItem.removeClass(classes.activeItem);

    if (this.$activeList && (!$activeToBe || !this.$activeList[0].contains($activeToBe[0]))) {
      this.$activeList.slideUp();
    }
  },
    followAnchor: function followAnchor($element, index) {
    var _this3 = this;

    var anchorSelector = $element[0].hash;
    var $anchor;

    try {
      // `decodeURIComponent` for UTF8 characters in the hash.
      $anchor = jQuery(decodeURIComponent(anchorSelector));
    } catch (e) {
      return;
    }

    elementorFrontend.waypoint($anchor, function (direction) {
      if (_this3.itemClicked) {
        return;
      }

      var id = $anchor.attr('id');

      if ('down' === direction) {
        _this3.viewportItems[id] = true;

        _this3.activateItem($element);
      } else {
        delete _this3.viewportItems[id];

        _this3.activateItem(_this3.$listItemTexts.eq(index - 1));
      }
    }, {
      offset: 'bottom-in-view',
      triggerOnce: false
    });
    elementorFrontend.waypoint($anchor, function (direction) {
      if (_this3.itemClicked) {
        return;
      }

      var id = $anchor.attr('id');

      if ('down' === direction) {
        delete _this3.viewportItems[id];

        if ((_this3.viewportItems).length) {
          _this3.activateItem(_this3.$listItemTexts.eq(index + 1));
        }
      } else {
        _this3.viewportItems[id] = true;

        _this3.activateItem($element);
      }
    }, {
      offset: 0,
      triggerOnce: false
    });
  },
    followAnchors: function followAnchors() {
    var _this4 = this;

    this.$listItemTexts.each(function (index, element) {
      return _this4.followAnchor(jQuery(element), index);
    });
  },
    populateTOC: function populateTOC() {
    this.listItemPointer = 0;
    var elementSettings = this.getElementSettings();

    if (elementSettings.hierarchical_view) {
      this.createNestedList();
    } else {
      this.createFlatList();
    }

    this.$listItemTexts = this.$element.find('.elementor-toc__list-item-text');
    this.$listItemTexts.on('click', this.onListItemClick.bind(this));

    if (!elementorFrontend.isEditMode()) {
      this.followAnchors();
    }
  },
    createNestedList: function createNestedList() {
    var _this5 = this;

    this.headingsData.forEach(function (heading, index) {
      heading.level = 0;

      for (var i = index - 1; i >= 0; i--) {
        var currentOrderedItem = _this5.headingsData[i];

        if (currentOrderedItem.tag <= heading.tag) {
          heading.level = currentOrderedItem.level;

          if (currentOrderedItem.tag < heading.tag) {
            heading.level++;
          }

          break;
        }
      }
    });
    this.elements.$tocBody.html(this.getNestedLevel(0));
  },
    createFlatList: function createFlatList() {
    this.elements.$tocBody.html(this.getNestedLevel());
  },
    getNestedLevel: function getNestedLevel(level) {
    var settings = this.getSettings(),
        elementSettings = this.getElementSettings(),
        icon = this.getElementSettings('icon'); // Open new list/nested list

    var html = "<".concat(settings.listWrapperTag, " class=\"").concat(settings.classes.listWrapper, "\">"); // for each list item, build its markup.

    while (this.listItemPointer < this.headingsData.length) {
      var currentItem = this.headingsData[this.listItemPointer];
      var listItemTextClasses = settings.classes.listItemText;

      if (0 === currentItem.level) {
        // If the current list item is a top level item, give it the first level class
        listItemTextClasses += ' ' + settings.classes.firstLevelListItem;
      }

      if (level > currentItem.level) {
        break;
      }

      if (level === currentItem.level) {
        html += "<li class=\"".concat(settings.classes.listItem, "\">");
        html += "<div class=\"".concat(settings.classes.listTextWrapper, "\">");
        var liContent = "<a href=\"#".concat(currentItem.anchorLink, "\" class=\"").concat(listItemTextClasses, "\">").concat(currentItem.text, "</a>"); // If list type is bullets, add the bullet icon as an <i> tag

        if ('bullets' === elementSettings.marker_view && icon) {
          liContent = "<i class=\"".concat(icon.value, "\"></i>").concat(liContent);
        }

        html += liContent;
        html += '</div>';
        this.listItemPointer++;
        var nextItem = this.headingsData[this.listItemPointer];

        if (nextItem && level < nextItem.level) {
          // If a new nested list has to be created under the current item,
          // this entire method is called recursively (outside the while loop, a list wrapper is created)
          html += this.getNestedLevel(nextItem.level);
        }

        html += '</li>';
      }
    }

    html += "</".concat(settings.listWrapperTag, ">");
    return html;
  },
    handleNoHeadingsFound: function handleNoHeadingsFound() {
      var noHeadingsText = 'No headings were found on this page.';

    // var noHeadingsText = elementorProFrontend.config.i18n['toc_no_headings_found'];
    //
    // if (elementorFrontend.isEditMode()) {
    //   noHeadingsText = elementorPro.translate('toc_no_headings_found');
    // }

    return this.elements.$tocBody.html(noHeadingsText);
  },
    collapseOnInit: function collapseOnInit() {
    var minimizedOn = this.getElementSettings('minimized_on'),
        currentDeviceMode = elementorFrontend.getCurrentDeviceMode();

    if ('tablet' === minimizedOn && 'desktop' !== currentDeviceMode || 'mobile' === minimizedOn && 'mobile' === currentDeviceMode) {
      this.collapseBox();
    }
  },
    getHeadingAnchorLink: function getHeadingAnchorLink(index, classes) {
    var headingID = this.elements.$headings[index].id,
        wrapperID = this.elements.$headings[index].closest('.elementor-widget').id;
    var anchorLink = '';

    if (headingID) {
      anchorLink = headingID;
    } else if (wrapperID) {
      // If the heading itself has an ID, we don't want to overwrite it
      anchorLink = wrapperID;
    } // If there is no existing ID, use the heading text to create a semantic ID


    if (headingID || wrapperID) {
      jQuery(this.elements.$headings[index]).data('hasOwnID', true);
    } else {
      anchorLink = "".concat(classes.headingAnchor, "-").concat(index);
    }

    return anchorLink;
  },
    setHeadingsData: function setHeadingsData() {
    var _this6 = this;

    this.headingsData = [];
    var classes = this.getSettings('classes'); // Create an array for simplifying TOC list creation

    this.elements.$headings.each(function (index, element) {
      var anchorLink = _this6.getHeadingAnchorLink(index, classes);

      _this6.headingsData.push({
        tag: +element.nodeName.slice(1),
        text: element.textContent,
        anchorLink: anchorLink
      });
    });
  },
    run: function run() {
    this.elements.$headings = this.getHeadings();

    if (!this.elements.$headings.length) {
      return this.handleNoHeadingsFound();
    }

    this.setHeadingsData();

    if (!elementorFrontend.isEditMode()) {
      this.addAnchorsBeforeHeadings();
    }

    this.populateTOC();

    if (this.getElementSettings('minimize_box')) {
      this.collapseOnInit();
    }
  },
    expandBox: function expandBox() {
    var boxHeight = this.getCurrentDeviceSetting('min_height');
    this.$element.removeClass(this.getSettings('classes.collapsed'));
    this.elements.$tocBody.slideDown(); // return container to the full height in case a min-height is defined by the user

    this.elements.$widgetContainer.css('min-height', boxHeight.size + boxHeight.unit);
  },
    collapseBox: function collapseBox() {
    this.$element.addClass(this.getSettings('classes.collapsed'));
    this.elements.$tocBody.slideUp(); // close container in case a min-height is defined by the user

    this.elements.$widgetContainer.css('min-height', '0px');
  },
    onInit: function onInit() {
    var _get2,
        _this7 = this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

      _get2 = elementorModules.frontend.handlers.Base.prototype.onInit.apply(_this7, [this].concat(args));

    this.viewportItems = [];
      return _this7.run();
  },
    onListItemClick: function onListItemClick(event) {
    var _this8 = this;

    this.itemClicked = true;
    setTimeout(function () {
      return _this8.itemClicked = false;
    }, 2000);
    var $clickedItem = jQuery(event.target),
        $list = $clickedItem.parent().next(),
        collapseNestedList = this.getElementSettings('collapse_subitems');
    var listIsActive;

    if (collapseNestedList && $clickedItem.hasClass(this.getSettings('classes.firstLevelListItem'))) {
      if ($list.is(':visible')) {
        listIsActive = true;
      }
    }

    this.activateItem($clickedItem);

    if (collapseNestedList && listIsActive) {
      $list.slideUp();
    }
  },
  });

  elementorFrontend.hooks.addAction( 'frontend/element_ready/twbb_table-of-contents.default', function ( $scope ) {
    new TOCHandler({ $element: $scope });
  });

});

jQuery( window ).on( 'elementor/frontend/init', function() {

	var TWBase = elementorModules.frontend.handlers.Base.extend({

		getDefaultSettings: function getDefaultSettings() {
			return {
				selectors: {
					mainSwiper: '.tenweb-media-carousel-swiper',
					swiperSlide: '.swiper-slide'
				},
				slidesPerView: {
					desktop: 3,
					tablet: 2,
					mobile: 1
				}
			};
		},

		getDefaultElements: function getDefaultElements() {
			var selectors = this.getSettings('selectors');

			var elements = {
				$mainSwiper: this.$element.find(selectors.mainSwiper)
			};

			elements.$mainSwiperSlides = elements.$mainSwiper.find(selectors.swiperSlide);

			return elements;
		},

		getSlidesCount: function getSlidesCount() {
			return this.elements.$mainSwiperSlides.length;
		},

		getInitialSlide: function getInitialSlide() {
			var editSettings = this.getEditSettings();

			return editSettings.activeItemIndex ? editSettings.activeItemIndex - 1 : 0;
		},

		getEffect: function getEffect() {
			return this.getElementSettings('effect');
		},

		getDeviceSlidesPerView: function getDeviceSlidesPerView(device) {
			var slidesPerViewKey = 'slides_per_view' + ('desktop' === device ? '' : '_' + device);

			return Math.min(this.getSlidesCount(), +this.getElementSettings(slidesPerViewKey) || this.getSettings('slidesPerView')[device]);
		},

		getSlidesPerView: function getSlidesPerView(device) {
			if ('slide' === this.getEffect()) {
				return this.getDeviceSlidesPerView(device);
			}

			return 1;
		},

		getDesktopSlidesPerView: function getDesktopSlidesPerView() {
			return this.getSlidesPerView('desktop');
		},

		getTabletSlidesPerView: function getTabletSlidesPerView() {
			return this.getSlidesPerView('tablet');
		},

		getMobileSlidesPerView: function getMobileSlidesPerView() {
			return this.getSlidesPerView('mobile');
		},

		getDeviceSlidesToScroll: function getDeviceSlidesToScroll(device) {
			var slidesToScrollKey = 'slides_to_scroll' + ('desktop' === device ? '' : '_' + device);

			return Math.min(this.getSlidesCount(), +this.getElementSettings(slidesToScrollKey) || 1);
		},

		getSlidesToScroll: function getSlidesToScroll(device) {
			if ('slide' === this.getEffect()) {
				return this.getDeviceSlidesToScroll(device);
			}

			return 1;
		},

		getDesktopSlidesToScroll: function getDesktopSlidesToScroll() {
			return this.getSlidesToScroll('desktop');
		},

		getTabletSlidesToScroll: function getTabletSlidesToScroll() {
			return this.getSlidesToScroll('tablet');
		},

		getMobileSlidesToScroll: function getMobileSlidesToScroll() {
			return this.getSlidesToScroll('mobile');
		},

		getSpaceBetween: function getSpaceBetween(device) {
			var propertyName = 'space_between';

			if (device && 'desktop' !== device) {
				propertyName += '_' + device;
			}

			return this.getElementSettings(propertyName).size || 0;
		},

		getSwiperOptions: function getSwiperOptions() {
			var elementSettings = this.getElementSettings();

			if ('progress' === elementSettings.pagination) {
				elementSettings.pagination = 'progressbar';
			}

			var swiperOptions = {
				grabCursor: true,
				initialSlide: this.getInitialSlide(),
				loop: 'yes' === elementSettings.loop,
				speed: elementSettings.speed,
				effect: this.getEffect()
			};

			if (elementSettings.show_arrows) {
				swiperOptions.navigation = {
					prevEl: '.elementor-swiper-button-prev',
					nextEl: '.elementor-swiper-button-next'
				};
			}

			if (elementSettings.pagination) {
				swiperOptions.pagination = {
					el: '.swiper-pagination',
					type: elementSettings.pagination,
					clickable: true
				};
			}

			if ('cube' !== this.getEffect()) {
				var breakpointsSettings = {},
					breakpoints = elementorFrontend.config.breakpoints;

				breakpointsSettings[breakpoints.lg-1] = {
					slidesPerView: this.getDesktopSlidesPerView(),
					slidesPerGroup: this.getDesktopSlidesToScroll(),
					spaceBetween: this.getSpaceBetween('desktop'),
				}

				breakpointsSettings[breakpoints.md-1] = {
					slidesPerView: this.getTabletSlidesPerView(),
					slidesPerGroup: this.getTabletSlidesToScroll(),
					spaceBetween: this.getSpaceBetween('tablet')
				};

				breakpointsSettings[breakpoints.xs] = {
					slidesPerView: this.getMobileSlidesPerView(),
					slidesPerGroup: this.getMobileSlidesToScroll(),
					spaceBetween: this.getSpaceBetween('mobile')
				};

				swiperOptions.breakpoints = breakpointsSettings;
			}

			if (!this.isEdit && elementSettings.autoplay) {
				swiperOptions.autoplay = {
					delay: elementSettings.autoplay_speed,
					disableOnInteraction: !!elementSettings.pause_on_interaction
				};
			}

			return swiperOptions;

		},

		updateSpaceBetween: function updateSpaceBetween(swiper, propertyName) {
			var deviceMatch = propertyName.match('space_between_(.*)'),
				device = deviceMatch ? deviceMatch[1] : 'desktop',
				newSpaceBetween = this.getSpaceBetween(device),
				breakpoints = elementorFrontend.config.breakpoints;

			if ('desktop' !== device) {
				var breakpointDictionary = {
					tablet: breakpoints.lg - 1,
					mobile: breakpoints.md - 1
				};

				swiper.params.breakpoints[breakpointDictionary[device]].spaceBetween = newSpaceBetween;
			} else {
				swiper.originalParams.spaceBetween = newSpaceBetween;
			}

			swiper.params.spaceBetween = newSpaceBetween;

			swiper.update();
		},

		onInit: function onInit() {
			elementorModules.frontend.handlers.Base.prototype.onInit.apply(this, arguments);

			this.swipers = {};

			if (1 >= this.getSlidesCount()) {
				return;
			}

			this.swipers.main = new Swiper(this.elements.$mainSwiper, this.getSwiperOptions());
		},

		onElementChange: function onElementChange(propertyName) {
			if (1 >= this.getSlidesCount()) {
				return;
			}

			if (0 === propertyName.indexOf('width')) {
				this.swipers.main.update();
			}

			if (0 === propertyName.indexOf('space_between')) {
				this.updateSpaceBetween(this.swipers.main, propertyName);
			}
		},

		onEditSettingsChange: function onEditSettingsChange(propertyName) {
			if (1 >= this.getSlidesCount()) {
				return;
			}

			if ('activeItemIndex' === propertyName) {
				this.swipers.main.slideToLoop(this.getEditSettings('activeItemIndex') - 1);
			}
		}
	});

	var TWmedia_carousel = TWBase.extend({

		slideshowSpecialElementSettings: ['slides_per_view', 'slides_per_view_tablet', 'slides_per_view_mobile'],

		isSlideshow: function isSlideshow() {
			return 'slideshow' === this.getElementSettings('skin');
		},

		getDefaultSettings: function getDefaultSettings() {
			var defaultSettings = TWBase.prototype.getDefaultSettings.apply(this, arguments);

			if (this.isSlideshow()) {
				defaultSettings.selectors.thumbsSwiper = '.elementor-thumbnails-swiper';

				defaultSettings.slidesPerView = {
					desktop: 5,
					tablet: 4,
					mobile: 3
				};
			}

			return defaultSettings;
		},

		getElementSettings: function getElementSettings(setting) {
			if (-1 !== this.slideshowSpecialElementSettings.indexOf(setting) && this.isSlideshow()) {
				setting = 'slideshow_' + setting;
			}

			return TWBase.prototype.getElementSettings.call(this, setting);
		},

		getDefaultElements: function getDefaultElements() {
			var selectors = this.getSettings('selectors'),
				defaultElements = TWBase.prototype.getDefaultElements.apply(this, arguments);

			if (this.isSlideshow()) {
				defaultElements.$thumbsSwiper = this.$element.find(selectors.thumbsSwiper);
			}

			return defaultElements;
		},

		getEffect: function getEffect() {
			if ('coverflow' === this.getElementSettings('skin')) {
				return 'coverflow';
			}

			return TWBase.prototype.getEffect.apply(this, arguments);
		},

		getSlidesPerView: function getSlidesPerView(device) {
			if (this.isSlideshow()) {
				return 1;
			}

			if ('coverflow' === this.getElementSettings('skin')) {
				return this.getDeviceSlidesPerView(device);
			}

			return TWBase.prototype.getSlidesPerView.apply(this, arguments);
		},

		getSwiperOptions: function getSwiperOptions() {
			var options = TWBase.prototype.getSwiperOptions.apply(this, arguments);

			if (this.isSlideshow()) {
				options.loopedSlides = this.getSlidesCount();

				delete options.pagination;
				delete options.breakpoints;
			}

			return options;
		},

		onInit: function onInit() {
			TWBase.prototype.onInit.apply(this, arguments);

			var slidesCount = this.getSlidesCount();

			if (!this.isSlideshow() || 1 >= slidesCount) {
				return;
			}

			var elementSettings = this.getElementSettings(),
				loop = 'yes' === elementSettings.loop,
				breakpointsSettings = {},
				breakpoints = elementorFrontend.config.breakpoints;

			breakpointsSettings[breakpoints.lg - 1] = {
				slidesPerView: this.getDeviceSlidesPerView('desktop'),
				spaceBetween: this.getSpaceBetween('desktop')
			};

			breakpointsSettings[breakpoints.md - 1] = {
				slidesPerView: this.getDeviceSlidesPerView('tablet'),
				spaceBetween: this.getSpaceBetween('tablet')
			};

			breakpointsSettings[breakpoints.xs] = {
				slidesPerView: this.getDeviceSlidesPerView('mobile'),
				spaceBetween: this.getSpaceBetween('mobile')
			};

			var thumbsSliderOptions = {
				initialSlide: this.getInitialSlide(),
				centeredSlides: elementSettings.centered_slides,
				slideToClickedSlide: true,
				loopedSlides: slidesCount,
				loop: loop,
				onSlideChangeEnd: function onSlideChangeEnd(swiper) {
					if (loop) {
						swiper.fixLoop();
					}
				},
				breakpoints: breakpointsSettings
			};

			this.swipers.main.controller.control = this.swipers.thumbs = new Swiper(this.elements.$thumbsSwiper, thumbsSliderOptions);

			this.swipers.thumbs.controller.control = this.swipers.main;
		},

		onElementChange: function onElementChange(propertyName) {
			if (1 >= this.getSlidesCount()) {
				return;
			}

			if (!this.isSlideshow()) {
				TWBase.prototype.onElementChange.apply(this, arguments);

				return;
			}

			if (0 === propertyName.indexOf('width')) {
				this.swipers.main.update();
				this.swipers.thumbs.update();
			}

			if (0 === propertyName.indexOf('space_between')) {
				this.updateSpaceBetween(this.swipers.thumbs, propertyName);
			}
		}
	});

	elementorFrontend.hooks.addAction('frontend/element_ready/twbb_media-carousel.default',  function ( $scope ) {
		var $element = $scope.find( '.elementor-widget-twbb_media-carousel .tenweb-media-carousel-swiper' );

		new TWmedia_carousel( { $element: $scope } );
	});
});
/*
* Section parallax effect
 */
(function(document,window){

  tenwebParallax = function(element,options){

    var defoultOptions = {
      vertical_scroll:{
        active: false,
        direction: 'up',
        speed: 4,
      },
      horizontal_scroll:{
        active: false,
        direction: 'right',
        speed: 4,
      },
      transparency:{
        active: false,
        direction: 'in',
        speed: 5,
      },
      blur:{
        active: false,
        direction: 'in',
        speed: 10,
      },
      scale:{
        active: false,
        direction: 'in',
        speed: 10,
      }
    }
    this.element = element;
    var curOptions = {};
    mergeOptions(options);
    this.layerDiv = createInnerDiv();
    this.options = curOptions;
    function mergeOptions(userOpt){
      // checking if options acceptable then set user def options else set def options
      curOptions = defoultOptions;
      if(typeof userOpt !== 'object')
        curOptions = defoultOptions;
      let optionsArray = Object.entries(userOpt);
      for(let i = 0; i < optionsArray.length;i++){
        if(typeof optionsArray[i] === 'object' && typeof defoultOptions[optionsArray[i][0]] === 'object'){
          if(typeof optionsArray[i][1] === 'object'){
            if(typeof optionsArray[i][1].active !== 'undefined' && ["on", "yes","On", "Yes", true].includes(optionsArray[i][1].active))
              curOptions[optionsArray[i][0]].active=true;
            if(typeof optionsArray[i][1].speed !== 'undefined' && 0<=optionsArray[i][1].speed<=10)
              curOptions[optionsArray[i][0]].speed=optionsArray[i][1].speed;
            if(typeof optionsArray[i][1].direction !== 'undefined' && ['in','out','up','down'].includes(optionsArray[i][1].direction))
              curOptions[optionsArray[i][0]].direction=optionsArray[i][1].direction;
          }
        }
      }
    }
    function createInnerDiv(){
      var conteinerDiv = document.createElement('div');
      conteinerDiv.classList.add("tenweb-elementor-scrolling-effects-container");
      var layerDiv = document.createElement('div');
      layerDiv.classList.add("tenweb-elementor-scrolling-effects-layer");

      var style = element.currentStyle || window.getComputedStyle(element, null);

      layerDiv.style.backgroundImage = style.backgroundImage;
      layerDiv.style.backgroundPosition = style.backgroundPosition;
      layerDiv.style.backgroundRepeat = style.backgroundRepeat;
      layerDiv.style.backgroundSize = style.backgroundSize;

      conteinerDiv.appendChild(layerDiv);
      element.prepend(conteinerDiv);
      return layerDiv;
    }
  }

  tenwebParallax.prototype = {
    vertical_transform:function(){
      if(this.options.vertical_scroll.active){
        this.layerDiv.style.height = (100 + this.options.vertical_scroll.speed * 100 / 10) + "%";
        if(this.isElementVisible()){
          var center = this.element.offsetHeight * this.options.vertical_scroll.speed / 2 / 10;
          var backgroundScrolled = - (window.scrollY + window.innerHeight - this.element.offsetTop) * this.options.vertical_scroll.speed / 4 / 10;
          if(this.options.vertical_scroll.direction == 'down')
            backgroundScrolled = - backgroundScrolled;
          return "translateY(calc(-" + center + "px + " + backgroundScrolled + "px))";
        }else{
          return '';
        }
      }
      return '';
    },
    horizontal_transform:function(){
      if(this.options.horizontal_scroll.active){
        this.layerDiv.style.width = (100 + this.options.horizontal_scroll.speed * 100 / 10) + "%";
        if(this.isElementVisible()){
          var backgroundScrolled =  (window.scrollY + window.innerHeight - this.element.offsetTop) * this.options.horizontal_scroll.speed/4  / 10;
          var center = this.element.offsetWidth * this.options.horizontal_scroll.speed/ 2 / 10;
          if(this.options.horizontal_scroll.direction == 'left')
            backgroundScrolled = - backgroundScrolled;
          return "translateX(calc(-" + center + "px + " + backgroundScrolled + "px))";
        }else{
          return '';
        }
      }
      return '';
    },
    transparency:function(){
      if(this.options.transparency.active){
        if(this.isElementVisible()){
          opacity_value = (window.scrollY + window.innerHeight - this.element.offsetTop) / (this.element.offsetHeight + window.innerHeight)
          opacity_value = opacity_value*(this.options.transparency.speed/10);
          if(this.options.transparency.direction == 'out')
            opacity_value = 1 - opacity_value;
          return opacity_value;
        }else{
          return '';
        }
      }
      return '';
    },
    blur:function(){
      if(this.options.blur.active){
        if(this.isElementVisible()){
          blur_value = (window.scrollY + window.innerHeight - this.element.offsetTop) / (this.element.offsetHeight + window.innerHeight)
          blur_value = blur_value * this.options.blur.speed;
          if(this.options.blur.direction == 'out')
            blur_value = 10 - blur_value;
          return "blur(" + blur_value + "px)";
        }else{
          return '';
        }
      }
      return '';
    },
    scale:function(){
      if(this.options.scale.active){
        if(this.isElementVisible()){
          scale_value = (window.scrollY + window.innerHeight - this.element.offsetTop) / (this.element.offsetHeight + window.innerHeight)
          scale_value = scale_value*(this.options.scale.speed)/10;
          scale_value = scale_value+1;
          if(this.options.scale.direction == 'out')
            scale_value = 2 - scale_value;
          return "scale(" + scale_value + ")";
        }else{
          return '';
        }
      }
      return '';
    },
    onScroll:function(){
      var transform_options = this.vertical_transform();
      transform_options += this.horizontal_transform();
      transform_options += this.scale();
      this.layerDiv.style.transform = transform_options;
      this.layerDiv.style.opacity = this.transparency();
      this.layerDiv.style.filter = this.blur();

    },
    onResize:function(){
      var transform_options = this.vertical_transform();
      transform_options += this.horizontal_transform();
      transform_options += this.scale();
      this.layerDiv.style.transform = transform_options;
      this.layerDiv.style.opacity = this.transparency();
      this.layerDiv.style.filter = this.blur();
    },
    changePosition:function(){

    },
    isElementVisible:function(){
      var ElementPositionInfo = this.element.getBoundingClientRect();
      if(ElementPositionInfo.top + ElementPositionInfo.height >= 0 && ElementPositionInfo.top <= (window.innerHeight || document.documentElement.clientHeight))
        return true;
      return false;
    },
    elementTopPosition:function(){
      return ;
    },
    elementBottomPosition:function(){
      return ;
    },

    addDisableBackgroundClass:function(){
      this.element.classList.add("tenweb-disable-background-image");
    },
    removeDisableBackgroundClass:function(){
      this.element.classList.remove("tenweb-disable-background-image");
    },
    start:function(){
      var self = this;
      this.onScroll = this.onScroll.bind(this);
      this.onResize = this.onResize.bind(this);
      this.addDisableBackgroundClass();
      window.addEventListener('scroll',this.onScroll);
      window.addEventListener('resize',this.onResize);
      self.onResize();
      return this;
    },
    destroy:function(){
      this.layerDiv.parentElement.remove();
      this.removeDisableBackgroundClass();
      window.removeEventListener('scroll',this.onScroll);
      window.removeEventListener('resize',this.onResize);
    }
  }

})(document,window);

jQuery( window ).on( 'elementor/frontend/init', function() {
	var ParallaxHandler = elementorModules.frontend.handlers.Base.extend({
		defoult_settings:{
			"background_background": "classic",
			"tenweb_enable_parallax_efects": "no",
			"tenweb_vertical_scroll_efects-direction": "down",
			"tenweb_vertical_scroll_efects-speed": {"unit":"px","size":4.5,"sizes":[]},
			"tenweb_vertical_scroll_efects": "no",
			"tenweb_horizontal_scroll_efects": "no",
			"tenweb_transparency_efects": "no",
			"tenweb_blur_efects": "no",
			"tenweb_scale_efects": "no",
			"tenweb_horizontal_scroll_efects-direction": "left",
			"tenweb_horizontal_scroll_efects-speed": {"unit":"px","size":4,"sizes":[]},
			"tenweb_transparency_efects-direction": "in",
			"tenweb_transparency_efects-speed": {"unit":"px","size":4,"sizes":[]},
			"tenweb_blur_efects-direction": "in",
			"tenweb_blur_efects-speed": {"unit":"px","size":4,"sizes":[]},
			"tenweb_scale_efects-direction": "in",
			"tenweb_scale_efects-speed": {"unit":"px","size":4,"sizes":[]},
			"tenweb_parallax_on": ["desktop","tablet","mobile"]
		},
		current_settings:{
		},
		curParalax:{

		},
		elementBgImg:'',
		is_active:false,
		updateSettings: function(settings){
			var self = this;
			for(const [key, value] of Object.entries(self.defoult_settings)){
				if(typeof settings[key] != 'undefined')
					self.current_settings[key] = settings[key];
				else
					self.current_settings[key] = self.defoult_settings[key];
			}
		},
		isSectionParallax:function(sectionSettings){
			if (sectionSettings.hasOwnProperty('tenweb_enable_parallax_efects')){
				return true;
			}
			return false;
		},
		activate: function activate() {
			var self = this;
			var curElem = self.$element[0];
			if(self.is_active){
				self.deactivate();
			}
			self.curParalax = new tenwebParallax(curElem,{
				vertical_scroll:{
					active: self.current_settings['tenweb_vertical_scroll_efects'],
					speed: self.current_settings['tenweb_vertical_scroll_efects-speed']['size'],
					direction: self.current_settings['tenweb_vertical_scroll_efects-direction'],
				},
				horizontal_scroll:{
					active: self.current_settings['tenweb_horizontal_scroll_efects'],
					speed: self.current_settings['tenweb_horizontal_scroll_efects-speed']['size'],
					direction: self.current_settings['tenweb_horizontal_scroll_efects-direction'],
				},
				transparency:{
					active: self.current_settings['tenweb_transparency_efects'],
					speed: self.current_settings['tenweb_transparency_efects-speed']['size'],
					direction: self.current_settings['tenweb_transparency_efects-direction'],
				},
				blur:{
					active: self.current_settings['tenweb_blur_efects'],
					speed: self.current_settings['tenweb_blur_efects-speed']['size'],
					direction: self.current_settings['tenweb_blur_efects-direction'],
				},
				scale:{
					active:self.current_settings['tenweb_scale_efects'],
					speed: self.current_settings['tenweb_scale_efects-speed']['size'],
					direction: self.current_settings['tenweb_scale_efects-direction'],
				}
			}).start();
			self.is_active = true;
		},
		deactivate: function deactivate() {
			var self = this,
				curElem = self.$element[0];
			if(typeof  self.curParalax.destroy =="function")
				self.curParalax.destroy();
			self.is_active = false;
		},

		run: function run(refresh) {
			var sectionSettings = this.getElementSettings();
			if(this.isSectionParallax(sectionSettings)){
				this.updateSettings(sectionSettings);
				if(this.current_settings['tenweb_enable_parallax_efects'] === 'yes' && this.current_settings['background_background'] === 'classic') {
					var currentDeviceMode = elementorFrontend.getCurrentDeviceMode(),
						activedDevices = this.getElementSettings('tenweb_parallax_on');

					if (-1 !== activedDevices.indexOf(currentDeviceMode)) {
						this.activate();
					} else {
						this.deactivate();
					}
				}else{
					this.deactivate();
				}
			}else{
				this.deactivate();
			}
		},

		reactivate: function reactivate() {
			this.deactivate();
			this.activate();
		},

		onElementChange: function onElementChange(settingKey) {
			this.run();
		},

		onInit: function onInit() {
			var self=this;
			elementorModules.frontend.handlers.Base.prototype.onInit.apply(this, arguments);
			this.run();
		},

		onDestroy: function onDestroy() {
			elementorModules.frontend.handlers.Base.prototype.onDestroy.apply(this, arguments);
			this.deactivate();
		},
	});

	elementorFrontend.hooks.addAction( 'frontend/element_ready/section', function ( $scope ) {
		new ParallaxHandler({ $element: $scope });
	});
});
jQuery( window ).on( 'elementor/frontend/init', function() {
    var SlidesHandler = elementorModules.frontend.handlers.Base.extend({
        getDefaultSettings: function getDefaultSettings() {
            return {
                selectors: {
                    slider: '.twbb_slides-wrapper',
                    slideContent: '.swiper-slide',
                    slideInnerContents: '.swiper-slide-contents'
                },
                classes: {
                    animated: 'animated'
                },
                attributes: {
                    dataSliderOptions: 'slider_options',
                    dataAnimation: 'animation'
                },
                slidesPerView: {
                    desktop: 1,
                    tablet: 1,
                    mobile: 1
                },
            };
        },

        getDefaultElements: function getDefaultElements() {
            var selectors = this.getSettings('selectors');

            var elements = {
                $slider: this.$element.find(selectors.slider)
            };

            elements.$mainSwiperSlides = elements.$slider.find(selectors.slideContent);

            return elements;
        },

        getSlidesCount: function getSlidesCount() {
            return this.elements.$mainSwiperSlides.length;
        },

        getInitialSlide: function getInitialSlide() {
            var editSettings = this.getEditSettings();

            return editSettings.activeItemIndex ? editSettings.activeItemIndex - 1 : 0;
        },

        getDeviceSlidesPerView: function getDeviceSlidesPerView(device) {
            var slidesPerViewKey = 'slides_per_view' + ('desktop' === device ? '' : '_' + device);

            return Math.min(this.getSlidesCount(), +this.getElementSettings(slidesPerViewKey) || this.getSettings('slidesPerView')[device]);
        },

        getSlidesPerView: function getSlidesPerView(device) {
            return this.getDeviceSlidesPerView(device);
        },

        getDesktopSlidesPerView: function getDesktopSlidesPerView() {
            return this.getSlidesPerView('desktop');
        },

        getTabletSlidesPerView: function getTabletSlidesPerView() {
            return this.getSlidesPerView('tablet');
        },

        getMobileSlidesPerView: function getMobileSlidesPerView() {
            return this.getSlidesPerView('mobile');
        },

        getDeviceSlidesToScroll: function getDeviceSlidesToScroll(device) {
            var slidesToScrollKey = 'slides_to_scroll' + ('desktop' === device ? '' : '_' + device);

            return Math.min(this.getSlidesCount(), +this.getElementSettings(slidesToScrollKey) || 1);
        },

        getSlidesToScroll: function getSlidesToScroll(device) {
            return this.getDeviceSlidesToScroll(device);
        },

        getDesktopSlidesToScroll: function getDesktopSlidesToScroll() {
            return this.getSlidesToScroll('desktop');
        },

        getTabletSlidesToScroll: function getTabletSlidesToScroll() {
            return this.getSlidesToScroll('tablet');
        },

        getMobileSlidesToScroll: function getMobileSlidesToScroll() {
            return this.getSlidesToScroll('mobile');
        },

        getSpaceBetween: function getSpaceBetween(device) {
            var propertyName = 'space_between';

            if (device && 'desktop' !== device) {
                propertyName += '_' + device;
            }

            return this.getElementSettings(propertyName).size || 0;
        },

        updateSpaceBetween: function updateSpaceBetween(swiper, propertyName) {
            var deviceMatch = propertyName.match('space_between_(.*)'),
                device = deviceMatch ? deviceMatch[1] : 'desktop',
                newSpaceBetween = this.getSpaceBetween(device),
                breakpoints = elementorFrontend.config.breakpoints;

            if ('desktop' !== device) {
                var breakpointDictionary = {
                    tablet: breakpoints.lg - 1,
                    mobile: breakpoints.md - 1
                };

                swiper.params.breakpoints[breakpointDictionary[device]].spaceBetween = newSpaceBetween;
            } else {
                swiper.originalParams.spaceBetween = newSpaceBetween;
            }

            swiper.params.spaceBetween = newSpaceBetween;

            swiper.update();
        },

        getSwiperOptions: function getSwiperOptions() {
            var elementSettings = this.getElementSettings();

            var swiperOptions = {
                grabCursor: true,
                initialSlide: this.getInitialSlide(),
                loop: 'yes' === elementSettings.infinite,
                speed: elementSettings.transition_speed,
                effect: elementSettings.transition,
                on: {
                    slideChange: function slideChange() {
                        var kenBurnsActiveClass = 'elementor-ken-burns--active';

                        if (this.$activeImage) {
                            this.$activeImage.removeClass(kenBurnsActiveClass);
                        }

                        this.$activeImage = jQuery(this.slides[this.activeIndex]).children();

                        this.$activeImage.addClass(kenBurnsActiveClass);
                    }
                }
            };
            var breakpointsSettings = {},
                breakpoints = elementorFrontend.config.breakpoints;

            breakpointsSettings[breakpoints.lg - 1] = {
                slidesPerView: this.getDesktopSlidesPerView(),
                slidesPerGroup: this.getDesktopSlidesToScroll(),
                spaceBetween: this.getSpaceBetween('desktop'),
            }

            breakpointsSettings[breakpoints.md - 1] = {
                slidesPerView: this.getTabletSlidesPerView(),
                slidesPerGroup: this.getTabletSlidesToScroll(),
                spaceBetween: this.getSpaceBetween('tablet')
            };

            breakpointsSettings[breakpoints.xs] = {
                slidesPerView: this.getMobileSlidesPerView(),
                slidesPerGroup: this.getMobileSlidesToScroll(),
                spaceBetween: this.getSpaceBetween('mobile')
            };

            swiperOptions.breakpoints = breakpointsSettings;

            var showArrows = 'arrows' === elementSettings.navigation || 'both' === elementSettings.navigation,
                pagination = 'dots' === elementSettings.navigation || 'both' === elementSettings.navigation;

            if (showArrows) {
                swiperOptions.navigation = {
                    prevEl: '.elementor-swiper-button-prev',
                    nextEl: '.elementor-swiper-button-next'
                };
            }

            if (pagination) {
                swiperOptions.pagination = {
                    el: '.swiper-pagination',
                    type: 'bullets',
                    clickable: true
                };
            }

            if (!this.isEdit && elementSettings.autoplay) {
                swiperOptions.autoplay = {
                    delay: elementSettings.autoplay_speed,
                    disableOnInteraction: !!elementSettings.pause_on_hover
                };
            }

            if (true === swiperOptions.loop) {
                swiperOptions.loopedSlides = this.getSlidesCount();
            }

            if ('fade' === swiperOptions.effect) {
                swiperOptions.fadeEffect = {crossFade: true};
            }

            return swiperOptions;
        },

        initSlider: function initSlider() {
            var $slider = this.elements.$slider,
                settings = this.getSettings(),
                animation = $slider.data(settings.attributes.dataAnimation);

            if (!$slider.length) {
                return;
            }

            this.swipers = {};

            if (1 >= this.getSlidesCount()) {
                return;
            }

            this.swipers.main = new Swiper(this.elements.$slider, this.getSwiperOptions());

            this.editButtonChange();
            if (!animation) {
                return;
            }

            this.swipers.main.on('slideChangeTransitionStart', function () {
                var $sliderContent = $slider.find(settings.selectors.slideInnerContents);

                $sliderContent.removeClass(settings.classes.animated + ' ' + animation).hide();
            });

            this.swipers.main.on('slideChangeTransitionEnd', function () {
                var $currentSlide = $slider.find(settings.selectors.slideInnerContents);

                $currentSlide.show().addClass(settings.classes.animated + ' ' + animation);
            });
        },

        editButtonChange: function editButtonChange( panel ) {
            // try to get better solution
            if ( jQuery('body').hasClass('elementor-editor-active' ) ) {

                elementor.getPanelView().getCurrentPageView().$el.find( '.elementor-repeater-fields .elementor-edit-template' ).remove();
                if ( this.$element.find( '.elementor-widget-container .elementor-swiper .twbb_slides-wrapper .swiper-wrapper .swiper-slide-template.swiper-slide-active' ).length ) {
                    var templateID = this.$element.find( '.elementor-widget-container .elementor-swiper .twbb_slides-wrapper .swiper-wrapper .swiper-slide-template.swiper-slide-active' ).attr( 'data-template-id' );
                    var editUrl = twbb.home_url + '/wp-admin/edit.php?post_type=elementor_library&tabs_group=twbb_templates&elementor_library_type=twbb_slide';
                    var buttonName = 'Add';

                    if ( templateID ) {
                        editUrl = twbb.home_url + '/wp-admin/post.php?post=' + templateID + '&action=elementor';
                        buttonName = 'Edit';
                    }

                    var editButtonHTML = jQuery( '<a />', {
                        target: '_blank',
                        class: 'elementor-button elementor-button-default elementor-edit-template',
                        href: editUrl,
                        html: '<i class="eicon-pencil"></i>' + buttonName
                    } );

                    elementor.getPanelView().getCurrentPageView().$el.find('.elementor-control-template_id').after( editButtonHTML );
                }
            }

        },

        onInit: function onInit() {
            elementorModules.frontend.handlers.Base.prototype.onInit.apply(this, arguments);
            // try to get better solution
            if ( jQuery('body').hasClass('elementor-editor-active' ) ) {
                elementor.hooks.addAction('panel/open_editor/widget/twbb_slides', this.editButtonChange);
            }
            this.initSlider();
        },

        onElementChange: function onElementChange(propertyName) {
            if (1 >= this.getSlidesCount()) {
                return;
            }

            if (0 === propertyName.indexOf('width')) {
                this.swipers.main.update();
            }

            if (0 === propertyName.indexOf('space_between')) {
                this.updateSpaceBetween(this.swipers.main, propertyName);
            }
        },

        onEditSettingsChange: function onEditSettingsChange(propertyName) {
            if (1 >= this.getSlidesCount()) {
                return;
            }

            if ('activeItemIndex' === propertyName) {
                this.swipers.main.slideToLoop(this.getEditSettings('activeItemIndex') - 1);
            }

            this.editButtonChange();
        },
    });

    elementorFrontend.hooks.addAction( 'frontend/element_ready/twbb_slides.default', function ( $scope ) {
        new SlidesHandler({ $element: $scope });
    });
});

(function($) {
    var Sticky = function(element, userSettings) {
        var $element, isSticky = false,
            isFollowingParent = false,
            isReachedEffectsPoint = false,
            elements = {},
            settings;
        var defaultSettings = {
            to: "top",
            offset: 0,
            effectsOffset: 0,
            parent: false,
            classes: {
                sticky: "sticky",
                stickyActive: "sticky-active",
                stickyEffects: "sticky-effects",
                spacer: "sticky-spacer"
            }
        };
        var initElements = function() {
            $element = $(element).addClass(settings.classes.sticky);
            elements.$window = $(window);
            if (settings.parent) {
                if ("parent" === settings.parent) {
                    elements.$parent = $element.parent()
                } else {
                    elements.$parent = $element.closest(settings.parent)
                }
            }
        };
        var initSettings = function() {
            settings = jQuery.extend(true, defaultSettings, userSettings)
        };
        var bindEvents = function() {
            elements.$window.on({
                scroll: onWindowScroll,
                resize: onWindowResize
            })
        };
        var unbindEvents = function() {
            elements.$window.off("scroll", onWindowScroll).off("resize", onWindowResize)
        };
        var init = function() {
            initSettings();
            initElements();
            bindEvents();
            checkPosition()
        };
        var backupCSS = function($element, backupState, properties) {
            var css = {},
                elementStyle = $element[0].style;
            properties.forEach(function(property) {
                css[property] = undefined !== elementStyle[property] ? elementStyle[property] : ""
            });
            $element.data("css-backup-" + backupState, css)
        };
        var getCSSBackup = function($element, backupState) {
            return $element.data("css-backup-" + backupState)
        };
        var addSpacer = function() {
            elements.$spacer = $element.clone().addClass(settings.classes.spacer).css({
                visibility: "hidden",
                transition: "none",
                animation: "none"
            });
            $element.after(elements.$spacer)
        };
        var removeSpacer = function() {
            elements.$spacer.remove()
        };
        var stickElement = function() {
            backupCSS($element, "unsticky", ["position", "width", "margin-top", "margin-bottom", "top", "bottom"]);
            var css = {
                position: "fixed",
                width: getElementOuterSize($element, "width"),
                marginTop: 0,
                marginBottom: 0
            };
            css[settings.to] = settings.offset;
            css["top" === settings.to ? "bottom" : "top"] = "";
            $element.css(css).addClass(settings.classes.stickyActive)
        };
        var unstickElement = function() {
            $element.css(getCSSBackup($element, "unsticky")).removeClass(settings.classes.stickyActive).css({position: "relative"});
        };
        var followParent = function() {
            backupCSS(elements.$parent, "childNotFollowing", ["position"]);
            elements.$parent.css("position", "relative");
            backupCSS($element, "notFollowing", ["position", "top", "bottom"]);
            var css = {
                position: "absolute"
            };
            css[settings.to] = "";
            css["top" === settings.to ? "bottom" : "top"] = 0;
            $element.css(css);
            isFollowingParent = true
        };
        var unfollowParent = function() {
            elements.$parent.css(getCSSBackup(elements.$parent, "childNotFollowing"));
            $element.css(getCSSBackup($element, "notFollowing"));
            isFollowingParent = false
        };
        var getElementOuterSize = function($element, dimension, includeMargins) {
            var computedStyle = getComputedStyle($element[0]),
                elementSize = parseFloat(computedStyle[dimension]),
                sides = "height" === dimension ? ["top", "bottom"] : ["left", "right"],
                propertiesToAdd = [];
            if ("border-box" !== computedStyle.boxSizing) {
                propertiesToAdd.push("border", "padding")
            }
            if (includeMargins) {
                propertiesToAdd.push("margin")
            }
            propertiesToAdd.forEach(function(property) {
                sides.forEach(function(side) {
                    elementSize += parseFloat(computedStyle[property + "-" + side])
                })
            });
            return elementSize
        };
        var getElementViewportOffset = function($element) {
            var windowScrollTop = elements.$window.scrollTop(),
                elementHeight = getElementOuterSize($element, "height"),
                viewportHeight = innerHeight,
                elementOffsetFromTop = $element.offset().top,
                distanceFromTop = elementOffsetFromTop - windowScrollTop,
                topFromBottom = distanceFromTop - viewportHeight;
            return {
                top: {
                    fromTop: distanceFromTop,
                    fromBottom: topFromBottom
                },
                bottom: {
                    fromTop: distanceFromTop + elementHeight,
                    fromBottom: topFromBottom + elementHeight
                }
            }
        };
        var stick = function() {
            addSpacer();
            stickElement();
            isSticky = true;
            $element.trigger("sticky:stick")
        };
        var unstick = function() {
            unstickElement();
            removeSpacer();
            isSticky = false;
            $element.trigger("sticky:unstick")
        };
        var checkParent = function() {
            var elementOffset = getElementViewportOffset($element),
                isTop = "top" === settings.to;
            if (isFollowingParent) {
                var isNeedUnfollowing = isTop ? elementOffset.top.fromTop > settings.offset : elementOffset.bottom.fromBottom < -settings.offset;
                if (isNeedUnfollowing) {
                    unfollowParent()
                }
            } else {
                var parentOffset = getElementViewportOffset(elements.$parent),
                    parentStyle = getComputedStyle(elements.$parent[0]),
                    borderWidthToDecrease = parseFloat(parentStyle[isTop ? "borderBottomWidth" : "borderTopWidth"]),
                    parentViewportDistance = isTop ? parentOffset.bottom.fromTop - borderWidthToDecrease : parentOffset.top.fromBottom + borderWidthToDecrease,
                    isNeedFollowing = isTop ? parentViewportDistance <= elementOffset.bottom.fromTop : parentViewportDistance >= elementOffset.top.fromBottom;
                if (isNeedFollowing) {
                    followParent()
                }
            }
        };
        var checkEffectsPoint = function(distanceFromTriggerPoint) {
            if (isReachedEffectsPoint && -distanceFromTriggerPoint < settings.effectsOffset) {
                $element.removeClass(settings.classes.stickyEffects);
                isReachedEffectsPoint = false
            } else if (!isReachedEffectsPoint && -distanceFromTriggerPoint >= settings.effectsOffset) {
                $element.addClass(settings.classes.stickyEffects);
                isReachedEffectsPoint = true
            }
        };
        var checkPosition = function() {
            var offset = settings.offset,
                distanceFromTriggerPoint;
            if (isSticky) {
                var spacerViewportOffset = getElementViewportOffset(elements.$spacer);
                distanceFromTriggerPoint = "top" === settings.to ? spacerViewportOffset.top.fromTop - offset : -spacerViewportOffset.bottom.fromBottom - offset;
                if (settings.parent) {
                    checkParent()
                }
                if (distanceFromTriggerPoint > 0) {
                    unstick()
                }
            } else {
                var elementViewportOffset = getElementViewportOffset($element);
                distanceFromTriggerPoint = "top" === settings.to ? elementViewportOffset.top.fromTop - offset : -elementViewportOffset.bottom.fromBottom - offset;
                if (distanceFromTriggerPoint <= 0) {
                    stick();
                    if (settings.parent) {
                        checkParent()
                    }
                }
            }
            checkEffectsPoint(distanceFromTriggerPoint)
        };
        var onWindowScroll = function() {
            checkPosition()
        };
        var onWindowResize = function() {
            if (!isSticky) {
                return
            }
            unstickElement();
            stickElement()
        };
        this.destroy = function() {
            if (isSticky) {
                unstick()
            }
            unbindEvents();
            $element.removeClass(settings.classes.sticky)
        };
        init()
    };
    $.fn.sticky = function(settings) {
        var isCommand = "string" === typeof settings;
        this.each(function() {
            var $this = $(this);
            if (!isCommand) {
                $this.data("sticky", new Sticky(this, settings));
                return
            }
            var instance = $this.data("sticky");
            if (!instance) {
                throw Error("Trying to perform the `" + settings + "` method prior to initialization")
            }
            if (!instance[settings]) {
                throw ReferenceError("Method `" + settings + "` not found in sticky instance")
            }
            instance[settings].apply(instance, Array.prototype.slice.call(arguments, 1));
            if ("destroy" === settings) {
                $this.removeData("sticky")
            }
        });
        return this
    };
    window.Sticky = Sticky
})(jQuery);

jQuery( window ).on( 'elementor/frontend/init', function() {

	var StickyHandler = elementorModules.frontend.handlers.Base.extend({
		bindEvents: function bindEvents() {
			elementorFrontend.addListenerOnce(this.getUniqueHandlerID() + 'tenweb_sticky', 'resize', this.run);
		},
		unbindEvents: function unbindEvents() {
			elementorFrontend.removeListeners(this.getUniqueHandlerID() + 'tenweb_sticky', 'resize', this.run);
		},
		isStickyInstanceActive: function isStickyInstanceActive() {
			return undefined !== this.$element.data('tenweb_sticky');
		},
		activate: function activate() {
			var elementSettings = this.getElementSettings(),
				stickyOptions = {
					to: elementSettings.tenweb_sticky,
					offset: elementSettings.tenweb_sticky_offset,
					effectsOffset: elementSettings.tenweb_sticky_effects_offset,
					classes: {
						sticky: 'elementor-sticky',
						stickyActive: 'elementor-sticky--active elementor-section--handles-inside',
						stickyEffects: 'elementor-sticky--effects',
						spacer: 'elementor-sticky__spacer'
					}
				},
				$wpAdminBar = elementorFrontend.elements.$wpAdminBar;

			if (elementSettings.tenweb_sticky_parent) {
				stickyOptions.parent = '.elementor-widget-wrap';
			}

			if ($wpAdminBar.length && 'top' === elementSettings.tenweb_sticky && 'fixed' === $wpAdminBar.css('position')) {
				stickyOptions.offset += $wpAdminBar.height();
			}

			this.$element.sticky(stickyOptions);
		},
		deactivate: function deactivate() {
			if (!this.isStickyInstanceActive()) {
				return;
			}

			this.$element.sticky('destroy');
		},
		run: function run(refresh) {
			if (!this.getElementSettings('tenweb_sticky')) {
				this.deactivate();
				return;
			}

			var currentDeviceMode = elementorFrontend.getCurrentDeviceMode(),
				activeDevices = this.getElementSettings('tenweb_sticky_on');

			if (-1 !== activeDevices.indexOf(currentDeviceMode)) {
				if (true === refresh) {
					this.reactivate();
				} else if (!this.isStickyInstanceActive()) {
					this.activate();
				}
			} else {
				this.deactivate();
			}
		},
		reactivate: function reactivate() {
			this.deactivate();
			this.activate();
		},
		onElementChange: function onElementChange(settingKey) {
			if (-1 !== ['tenweb_sticky', 'tenweb_sticky_on'].indexOf(settingKey)) {
				this.run(true);
			}

			if (-1 !== ['tenweb_sticky_offset', 'tenweb_sticky_effects_offset', 'tenweb_sticky_parent'].indexOf(settingKey)) {
				this.reactivate();
			}
		},
		onInit: function onInit() {
			elementorModules.frontend.handlers.Base.prototype.onInit.apply(this, arguments);
			this.run();
		},
		onDestroy: function onDestroy() {
			elementorModules.frontend.handlers.Base.prototype.onDestroy.apply(this, arguments);
			this.deactivate();
		}
	});

	elementorFrontend.hooks.addAction( 'frontend/element_ready/section', function ( $scope ) {
		new StickyHandler({ $element: $scope });
	});
});

jQuery( window ).on( 'elementor/frontend/init', function() {

	function getInitialSlide ( settings ) {
		return Math.floor( ( settings.slides_count - 1 ) / 2 );
	}

	function getSlidesToScroll ( settings ) {
		return Math.min( settings.slides_count, +settings.slides_to_scroll || 1 );
	}

	function getDeviceSlidesPerView( view , settings ) {
		var str = "slides_per_view" + ("desktop" === view ? "" : "_" + view);
		var num =	Math.min( settings.slides_count, +settings[str] || settings['slidesPerView'][view] );
		return num;
	}

	function getSpaceBetween( view, settings ) {
		var str = "space_between";
		return view && "desktop" !== view && (str += "_" + view), settings.breakpoints[str].size || 0;
	}

	elementorFrontend.hooks.addAction('frontend/element_ready/twbb-testimonial-carousel.default',  function () {
		jQuery('.tenweb-testimonial-carousel-swiper').each(function(i,elem) {

			var id = jQuery(elem).parents('.elementor-widget-twbb-testimonial-carousel').attr('data-id');
			jQuery(elem).attr('id', 'tenweb-testimonial-carousel-swiper-' + id);
			var settings = jQuery(elem).data('settings');

			if ( ! jQuery.isEmptyObject(settings) ) {

				settings.slidesPerView = {
					desktop: 1,
					tablet: 1,
					mobile: 1
				};
				var swiperOptions = {
					navigation: {
						prevEl: '.tenweb-swiper-button-prev',
						nextEl: '.tenweb-swiper-button-next'
					},
					pagination: {
						el: '.swiper-pagination',
						type: settings.pagination,
						clickable: true
					},
					grabCursor: true,
					speed: settings.speed,
					effect: 'slide',
					initialSlide: getInitialSlide( settings ),
					slidesPerView: getDeviceSlidesPerView( 'desktop', settings ),
					loop: 'yes' === settings.loop,
					loopedSlides:settings.slides_count,
					slidesPerGroup: getSlidesToScroll( settings ),
					spaceBetween: getSpaceBetween( '', settings ),
					breakpoints: {
						1280: {
							slidesPerView: getDeviceSlidesPerView( 'desktop', settings ),
							spaceBetween: getSpaceBetween( 'desktop', settings )
						},
						768: {
							slidesPerView: getDeviceSlidesPerView( 'tablet', settings ),
							spaceBetween: getSpaceBetween( 'tablet', settings )
						},
						320: {
							slidesPerView: getDeviceSlidesPerView( 'mobile', settings ),
							spaceBetween: getSpaceBetween( 'mobile', settings )
						}
					}
				}

				if ( settings.autoplay == 'yes' ) {
					swiperOptions.autoplay = {
						delay: settings.autoplay_speed,
						disableOnInteraction: !! settings.pause_on_interaction
					}
				}

				new Swiper( '#tenweb-testimonial-carousel-swiper-' + id, swiperOptions );
			}
		});
	});

});
jQuery( window ).on( 'elementor/frontend/init', function() {

	var MiniCartHandler = elementorModules.frontend.handlers.Base.extend({

		getDefaultSettings: function getDefaultSettings() {
			return {
				selectors: {
					container: '.twbb_menu-cart__container',
					toggle: '.twbb_menu-cart__toggle .elementor-button',
					closeButton: '.twbb_menu-cart__close-button',
					cartLink: '#twbb_menu-cart__toggle_button'
				},
				classes: {
					isShown: 'twbb_menu-cart--shown',
					lightbox: 'elementor-lightbox'
				}
			};
		},

		getDefaultElements: function getDefaultElements() {
			var selectors = this.getSettings('selectors'),
				elements = {};

			elements.$container = this.$element.find(selectors.container);
			elements.$toggle = this.$element.find(selectors.toggle);
			elements.$closeButton = this.$element.find(selectors.closeButton);
			elements.$cartLink = this.$element.find(selectors.cartLink);

			return elements;
		},

		bindEvents: function bindEvents() {
			var _elements = this.elements,
				$container = _elements.$container,
				$toggle = _elements.$toggle,
				$closeButton = _elements.$closeButton,
				$cartLink = _elements.$cartLink,
				classes = this.getSettings('classes');

			// Activate full-screen mode on click

			$toggle.on('click', function (event) {
				var currentUrl = window.location.origin + window.location.pathname,
					isCart = $container.data('cart') === currentUrl,
					isCheckout = $container.data('checkout') === currentUrl;

				if (!isCart && !isCheckout) {
					event.preventDefault();
					$container.addClass(classes.isShown);
				} else {
					var cartUrl = $container.data('cart');
					$cartLink.attr('href', cartUrl);
					$container.removeClass(classes.isShown);
				}
			});

			// Deactivate full-screen mode on click or on esc.
			$container.on('click', function (event) {
				if ($container.hasClass(classes.isShown) && $container[0] === event.target) {
					$container.removeClass(classes.isShown);
				}
			});

			$closeButton.on('click', function () {
				$container.removeClass(classes.isShown);
			});

			elementorFrontend.elements.$document.keyup(function (event) {
				var ESC_KEY = 27;

				if (ESC_KEY === event.keyCode) {
					if ($container.hasClass(classes.isShown)) {
						$container.click();
					}
				}
			});
		},

		onInit: function onInit() {
			elementorModules.frontend.handlers.Base.prototype.onInit.apply(this, arguments);

			this.bindEvents();
		}
	});

	elementorFrontend.hooks.addAction( 'frontend/element_ready/twbb_woocommerce-menu-cart.default', function ( $scope ) {
		new MiniCartHandler( { $element: $scope } );
	});

	jQuery(document.body).on('wc_fragments_loaded wc_fragments_refreshed', function () {
		jQuery('div.elementor-widget-twbb_woocommerce-menu-cart').each(function () {
			elementorFrontend.elementsHandler.runReadyTrigger(jQuery(this));
		});
	});

});
//for ie
(function () {
  if (typeof window.CustomEvent === "function") {
    return false;
  }

  function CustomEvent(event, params) {
    params = params || {bubbles: false, cancelable: false, detail: undefined};
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }

  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent;
})();
(function () {
  function extend(o1, o2) {
    for (var key in o2) {
      if (o2.hasOwnProperty(key)) {
        o1[key] = o2[key];
      }
    }
  }

  this.MultiRange = function MultiRange(placeholderElm, settings) {
    settings = typeof settings == 'object' ? settings : {}; // make sure settings is an 'object'
    this.settings = {
      minRange: typeof settings.minRange == 'number' ? settings.minRange : 1,
      tickStep: settings.tickStep || 5,
      step: typeof settings.step == 'number' ? settings.step : 1,
      scale: 100,
      min: settings.min || 0,
      max: settings.max || 100,
    };
    this.delta = this.settings.max - this.settings.min;
    // if "ticks" count was defined, re-calculate the "tickStep"
    if (settings.ticks) {
      this.settings.tickStep = this.delta / settings.ticks;
    }
    // a list of ranges (ex. [5,20])
    this.ranges = settings.ranges || [
      this.settings.ranges[0],
      this.settings.ranges[1]
    ];
    this.id = Math.random().toString(36).substr(2, 9); // almost-random ID
    this.DOM = {}; // Store all relevant DOM elements in an Object
    extend(this, new this.EventDispatcher());
    this.build(placeholderElm);
    this.events.binding.call(this);
  };
  MultiRange.prototype = {
    build: function (placeholderElm) {
      var that = this,
        scopeClasses = placeholderElm.className.indexOf('multiRange') == -1 ?
          'multiRange ' + placeholderElm.className :
          placeholderElm.className;
      this.DOM.scope = document.createElement('div');
      this.DOM.scope.className = scopeClasses;
      this.DOM.rangeWrap = document.createElement('div');
      this.DOM.rangeWrap.className = 'multiRange__rangeWrap';
      this.DOM.rangeWrap.innerHTML = this.getRangesHTML();
      this.DOM.ticks = document.createElement('div');
      this.DOM.ticks.className = 'multiRange__ticks';
      this.DOM.ticks.innerHTML = this.generateTicks();
      // append to Scope
      this.DOM.scope.appendChild(this.DOM.rangeWrap);
      this.DOM.scope.appendChild(this.DOM.ticks);
      // replace the placeholder component element with the real one
      placeholderElm.parentNode.replaceChild(this.DOM.scope, placeholderElm);
    },
    generateTicks() {
      var steps = (this.delta) / this.settings.tickStep,
        HTML = '',
        value,
        i;
      for (i = 0; i <= steps; i++) {
        value = (+this.settings.min) + this.settings.tickStep * i; // calculate tick value
        value = value.toFixed(1).replace('.0', ''); // cleaup
        HTML += '<div data-value="' + value + '"></div>';
      }
      return HTML;
    },
    getRangesHTML() {
      var that = this,
        rangesHTML = '',
        ranges;
      this.ranges.unshift(0);
      //  if( this.ranges[0] > this.settings.min )
      //      this.ranges.unshift(this.settings.min)
      if (this.ranges[this.ranges.length - 1] <= this.settings.max) {
        this.ranges.push(this.settings.max);
      }
      ranges = this.ranges;
      ranges.forEach(function (range, i) {
        if (i == ranges.length - 1) {
          return;
        } // skip last ltem
        var leftPos = (range - that.settings.min) / (that.delta) * 100;
        // protection..
        if (leftPos < 0) {
          leftPos = 0;
        }
        // range =  ranges[i+1] - range;
        rangesHTML += '<div data-idx="' + i + '" class="multiRange__range" style="left:' + leftPos + '%"><div class="multiRange__handle"></div></div>';
        if (i == 1) {
          jQuery('.current_min_price').html(range.toFixed(1).replace('.0', ''));
        }
        else if (i == 2) {
          jQuery('.current_max_price').html(range.toFixed(1).replace('.0', ''));
        }
      })
      return rangesHTML;
    },
    /**
     * A constructor for exposing events to the outside
     */
    EventDispatcher: function () {
      // Create a DOM EventTarget object
      var target = document.createTextNode('');
      // Pass EventTarget interface calls to DOM EventTarget object
      this.off = target.removeEventListener.bind(target);
      this.on = target.addEventListener.bind(target);
      this.trigger = function (eventName, data) {
        if (!eventName) {
          return;
        }
        var e = new CustomEvent(eventName, {"detail": data});
        target.dispatchEvent(e);
      }
    },
    /**
     * DOM events listeners binding
     */
    events: {
      binding: function () {
        this.DOM.rangeWrap.addEventListener('mousedown', this.events.callbacks.onMouseDown.bind(this));
        this.DOM.rangeWrap.addEventListener('touchstart', this.events.callbacks.onMouseDown.bind(this));
        //prevent anything from being able to be dragged
        this.DOM.scope.addEventListener("dragstart", function (e) {
          return false;
        });
        // this.eventDispatcher.on('add', this.settings.callbacks.add)
      },
      callbacks: {
        onMouseDown: function (e) {
          var target = e.target;
          if (!target) {
            return;
          }
          if (target.className == 'multiRange__handle__value') {
            target = target.parentNode;
          }
          else if (target.className != 'multiRange__handle') {
            return;
          }
          // set some variables (so percentages could be calculated on mousemove)
          var _BCR = this.DOM.scope.getBoundingClientRect();
          this.offsetLeft = _BCR.left;
          this.scopeWidth = _BCR.width;
          this.DOM.currentSlice = target.parentNode;
          this.DOM.currentSlice.classList.add('grabbed');
          this.DOM.currentSliceValue = this.DOM.currentSlice.querySelector('.multiRange__handle__value');
          document.body.classList.add('multiRange-grabbing');
          // bind temporary events (save "bind" reference so events could later be removed)
          this.events.onMouseUpFunc = this.events.callbacks.onMouseUp.bind(this);
          this.events.mousemoveFunc = this.events.callbacks.onMouseMove.bind(this);
          window.addEventListener('mouseup', this.events.onMouseUpFunc);
          window.addEventListener('mousemove', this.events.mousemoveFunc);
          window.addEventListener('touchend', this.events.onMouseUpFunc);
          window.addEventListener('touchmove', this.events.mousemoveFunc);
        },
        onMouseUp: function (e) {
          this.DOM.currentSlice.classList.remove('grabbed');
          window.removeEventListener('mousemove', this.events.mousemoveFunc);
          window.removeEventListener('mouseup', this.events.onMouseUpFunc);
          window.removeEventListener('touchmove', this.events.mousemoveFunc);
          window.removeEventListener('touchend', this.events.onMouseUpFunc);
          document.body.classList.remove('multiRange-grabbing');
          // publish the event
          var value = parseInt(this.DOM.currentSlice.style.left);
          this.trigger('changed', {idx: +this.DOM.currentSlice.dataset.idx, value: value, ranges: this.ranges});
          this.DOM.currentSlice = null;
        },
        onMouseMove: function (e) {
          if (!this.DOM.currentSlice) {
            window.removeEventListener('mouseup', this.events.onMouseUpFunc);
            window.removeEventListener('touchend', this.events.onMouseUpFunc);
            return;
          }
          // do not continue if the mouse was overflowing of the left or the right side of the range
          //if(  e.clientX < this.offsetLeft || e.clientX > (this.offsetLeft + this.scopeWidth) )
          //  return;
          var that = this,
            value,
            xPosScopeLeft;// the numeric value
          if (e.touches) { //for touch devices
            xPosScopeLeft = e.touches[0].clientX - this.offsetLeft;
          }
          else {
            xPosScopeLeft = e.clientX - this.offsetLeft;
          }
          var leftPrecentage = xPosScopeLeft / this.scopeWidth * 100;
          var prevSliceValue = this.ranges[+this.DOM.currentSlice.dataset.idx - 1];
          var nextSliceValue = this.ranges[+this.DOM.currentSlice.dataset.idx + 1];
          value = this.settings.min + (this.delta / 100 * leftPrecentage);
          if (this.settings.step) {
            // if( value%this.settings.step > 1 ) return;
            value = Math.round((value) / this.settings.step) * this.settings.step;
          }
          // make sure a slice value doesn't go above the next slice value and not below the previous one
          if (value < prevSliceValue + this.settings.minRange) {
            value = prevSliceValue + this.settings.minRange;
          }
          if (value > nextSliceValue - this.settings.minRange) {
            value = nextSliceValue - this.settings.minRange;
          }
          // define min and max move points
          if (value < (this.settings.min + this.settings.minRange)) {
            value = this.settings.min + this.settings.minRange;
          }
          if (value > (this.settings.max - this.settings.minRange)) {
            value = this.settings.max - this.settings.minRange;
          }
          leftPrecentage = (value - this.settings.min) / this.delta * 100;
          // update the DOM
          window.requestAnimationFrame(function () {
            if (that.DOM.currentSlice) {
              that.DOM.currentSlice.style.left = leftPrecentage + '%';
              //that.DOM.currentSliceValue.innerHTML = value.toFixed(1).replace('.0', '');
            }
          });
          // update "ranged" Array
          this.ranges[this.DOM.currentSlice.dataset.idx] = +value.toFixed(1);
          this.currentMinPriceDOM = jQuery(this.DOM.scope).closest('.twbb_woo_price_filter').children('.twbb_woo_price_filter-info').children('.twbb_woo_price_filter-info-price_range').children('span').children('.current_min_price');
          this.currentMaxPriceDOM = jQuery(this.DOM.scope).closest('.twbb_woo_price_filter').children('.twbb_woo_price_filter-info').children('.twbb_woo_price_filter-info-price_range').children('span').children('.current_max_price');
          jQuery(this.currentMinPriceDOM).html(this.ranges[1]);
          jQuery(this.currentMaxPriceDOM).html(this.ranges[2]);
          // publish the event
          this.trigger('change', {idx: +this.DOM.currentSlice.dataset.idx, value: value, ranges: this.ranges})
          jQuery('.price1').attr('value', this.ranges[1]);
          jQuery('.price2').attr('value', this.ranges[2]);
        }
      }
    }
  }
})(this);
let priceFilters = document.querySelectorAll('.twbb_woo_price_filter');
let currentMinPrice = parseInt(jQuery('.price1').attr('value'));
let allMinPrice = parseInt(jQuery('.price1').attr('data-minPrice'));
let currentMaxPrice = parseInt(jQuery('.price2').attr('value'));
let allMaxPrice = parseInt(jQuery('.price2').attr('data-maxPrice'));
for (let i = 0; i < priceFilters.length; i++) {
  new MultiRange(document.querySelectorAll('.multiRange')[i], {
    ranges: [currentMinPrice, currentMaxPrice],
    min: allMinPrice,
    max: allMaxPrice,
    step: 1,
    minRange: 0,
    ticks: 4,
  });
}

jQuery(".twbb_woo_price_filter").submit(function(e) {
  e.preventDefault();
  var href = new URL(location.href);
  href.searchParams.delete('product-page');
  window.history.pushState(null, null, href.href);
  //location.href = href.href;
  this.submit();
});
var data_tabs_count = 0;
jQuery( window ).on( 'elementor/frontend/init', function() {
  elementorFrontend.hooks.addAction( 'frontend/element_ready/twbb_woocommerce-product-data-tabs.default', function ( $scope ) {
    var data_tabs = jQuery('body .elementor-widget-twbb_woocommerce-product-data-tabs');
    if( data_tabs.length > 1 ) {
      alert("The page already includes a Product Data Tabs widget.");
      elementor.getPanelView().getCurrentPageView().getOption('editedElementView').removeElement();
    }
  });
});
jQuery( window ).on( 'elementor/frontend/init', function() {
  var InitSwiper = function ( $scope ) {
    var swiper_container = $scope.find('.woocommerce-product-gallery--with-images');
    var swiper_wrapper = swiper_container.find('ol.flex-control-thumbs');
    var swiper_slides = swiper_container.find('ol.flex-control-thumbs li');
    if ( 4 < swiper_container.find('ol.flex-control-thumbs li').length ) {
      swiper_wrapper.addClass('swiper-wrapper');
      swiper_slides.addClass('swiper-slide');
      swiper_container.append(jQuery('<div class="swiper-button-prev"></div><div class="swiper-button-next"></div>'));
      var fixNavigationButtonsPositions = function () {
        swiper_container.find('.swiper-button-prev, .swiper-button-next').css('top', 'calc(100% - ' + swiper_container.find('.swiper-slide').height() / 2 + 'px)');
      };
      var swiper = new Swiper(swiper_container, {
        slidesPerView: 4,
        spaceBetween: 0,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        on: {
          imagesReady: fixNavigationButtonsPositions,
          resize: fixNavigationButtonsPositions,
        },
      });
    }
  };

  elementorFrontend.hooks.addAction( 'frontend/element_ready/twbb_woocommerce-product-images.default', InitSwiper );
  elementorFrontend.hooks.addAction( 'frontend/element_ready/twbb_woocommerce-page.default', InitSwiper );
});
jQuery( window ).on( 'elementor/frontend/init', function() {
  elementorFrontend.hooks.addAction( 'frontend/element_ready/twbb_woocommerce-page.default', function ( $scope ) {
    var single_product = jQuery('body .elementor-widget-twbb_woocommerce-page');
    if( single_product.length > 1 ) {
      alert("The page already includes a WooCommerce Pages Widget element.");
      elementor.getPanelView().getCurrentPageView().getOption('editedElementView').removeElement();
    }
  });
});
