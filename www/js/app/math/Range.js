/**
 * Copyright 2015 wildbits.github.io
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
app.math = app.math || {};

/**
 * Trivial implementation of a range type and required operations.
 */
app.math.Range = (function () {

    var validateNumeric = function(value) {
        if (! $.isNumeric(value)) {
            throw value + ' is not a numeric value';
        }
    };

    return function (min, max) {

        validateNumeric(min);
        validateNumeric(max);

        if (max < min) {
            throw min + ' is not smaller or equals than ' + max;
        }

        var add = function (value) {
            validateNumeric(value);
            return new app.math.Range(min + value, max + value);
        };

        var addRange = function (range) {
            return new app.math.Range(min + range.min(), max + range.max());
        };

        var mul = function (value) {
            validateNumeric(value);
            return new app.math.Range(min * value, max * value);
        };

        var minimum = function () {
            return min;
        };

        var maximum = function () {
            return max;
        };

        var mean = function () {
            return (max + min) / 2;
        };

        return {
            add: add,
            addRange: addRange,
            mul: mul,
            mean: mean,
            min: minimum,
            max: maximum
        };
    };

})();