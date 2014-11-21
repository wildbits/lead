/**
 * Copyright 2014 wildbits org
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
app.sliders = app.sliders || {};

app.sliders.Slider = (function () {

    var $curr;

    var opposite = function (direction) {
        return direction == 'right' ? 'left' : 'right';
    };

    return function ($container) {

        this.slide = function ($next, callback, direction) {

            $container.append($next);

            if ($curr) {

                $next.addClass('slider ' + direction);

                //noinspection BadExpressionStatementJS
                $container[0].offsetWidth;

                $curr.addClass('slider transition ' + opposite(direction));
                $next.addClass('slider transition center');

                var $past = $curr;
                $next.one('webkitTransitionEnd transitionend', function () {
                    $past.remove();
                    callback();
                });
            }
            $curr = $next;
        };

        this.right = function ($next, callback) {
            this.slide($next, callback, 'right');
        };

        this.left = function ($next, callback) {
            this.slide($next, callback, 'left');
        };
    };

})();