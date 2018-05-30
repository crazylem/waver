/*
 Version: 1.0.0
 Author: lemehovskiy
 Website: http://lemehovskiy.github.io
 Repo: https://github.com/lemehovskiy/waver
 */

'use strict';

(function ($) {

    class Waver {

        constructor(element, options) {
            // let self = this;

            //extend by function call
            this.settings = $.extend(true, {
                debug: true
            }, options);

            this.$element = $(element);

            //extend by data options
            // this.data_options = this.$element.data('waver');
            this.settings = $.extend(true, this.settings, this.$element.data('waver'));

            this.items = [];
            this.$waverItems = this.$element.find('.waver-item');
            this.position = {x: 0, y: 0, rotation: 0};

            this.$comets = document.querySelectorAll('.GSAP');

            this.bezierCount = 5;

            this.init();
        }

        init() {
            let self = this;
            self.fillItems();

            let randomFromTo = function (from = 0, to = 1) {
                    return Math.random() * from + to - from;
                };
                // bezier_element = document.querySelectorAll('.GSAP');

            function BTweens() {
                // let windowWidth = window.innerWidth,
                //     windowHeight = window.innerHeight,
                // let count = 5;

                TweenLite.killDelayedCallsTo(BTweens);
                TweenLite.delayedCall(this.bezierCount * 4, BTweens);

                for (let i = this.$comets.length; i--;) {
                    let count = this.bezierCount,
                        bezierValues = [];
                        // bezier_element_width = bezier_element[i].offsetWidth,
                        // bezier_element_height = bezier_element[i].offsetHeight;

                    while (count--) {
                        bezierValues.push({
                            x: randomFromTo(0, window.innerWidth - this.$comets[i].offsetWidth),
                            y: randomFromTo(0, window.innerHeight - this.$comets[i].offsetHeight),
                            // zIndex: Math.round(math_random(1) * 7)
                            //TODO:? зачем здесь рандом zIndex?
                            zIndex: 1
                        });
                    }

                    if (this.$comets[i].TweenLite) {
                        this.$comets[i].TweenLite.kill()
                    }

                    TweenMax.to(self.position, count, {
                        bezier: {values: bezierValues, timeResolution: 0, type: "soft"},
                        yoyo: true,
                        repeat: -1,
                        onUpdate: function () {
                            self.onUpdate();
                        }, ease: Linear.easeNone
                    });


                    if (self.settings.debug) {
                        TweenMax.to(this.$comets[i], count, {
                            yoyo: true,
                            repeat: -1,
                            bezier: {timeResolution: 0, type: "soft", values: bezierValues},
                            ease: Linear.easeNone
                        });
                    }
                }
            }

            BTweens();

            window.onresize = function () {
                TweenLite.killDelayedCallsTo(BTweens);
                TweenLite.delayedCall(0.4, BTweens);
            };

        }

        onUpdate() {
            let self = this;
            // console.log(self.items);
            self.items.forEach(function(waver_item){

                let a = waver_item.x - self.position.x;
                let b = waver_item.y - self.position.y;

                let distance = Math.sqrt( a*a + b*b );

                if (distance < 200 && !waver_item.active) {
                    waver_item.distance = distance;
                    waver_item.active = true;
                    waver_item.$el.addClass('active');
                }
                else if (waver_item.active && !waver_item.wait_disappear) {
                    waver_item.wait_disappear = true;

                    setTimeout(function(){
                        waver_item.$el.removeClass('active');
                        waver_item.active = false;
                        waver_item.wait_disappear = false;
                    }, 2000 - waver_item.distance * (2000 / 200))
                }

            })

        }

        fillItems() {
            let self = this;
            this.$waverItems.each(function () {
                self.items.push({
                    $el: $(this),
                    x: $(this).offset().left + $(this).outerWidth() / 2,
                    y: $(this).offset().top + $(this).outerHeight() / 2,
                });
            });
        }
    }

    $.fn.waver = function () {
        let $this = this,
            opt = arguments[0],
            args = Array.prototype.slice.call(arguments, 1),
            length = $this.length,
            i,
            ret;
        for (i = 0; i < length; i++) {
            if (typeof opt === 'object' || typeof opt === 'undefined')
                $this[i].waver = new Waver($this[i], opt);
            else
                ret = $this[i].waver[opt].apply($this[i].waver, args);
            if (typeof ret !== 'undefined') return ret;
        }
        return $this;
    };

})(jQuery);