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
app.platforms = app.platforms || {};

app.platforms.Platform = (function () {

    var getPlatformFromUserAgent = function (userAgent) {
        if (/Android/i.test(userAgent)) {
            return 'Android';
        } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
            return 'iOS';
        } else {
            return 'Generic'
        }
    };


    return {

        /**
         * Identify the platform running the app by leveraging the Cordova Device API. If the Device API is not available
         * fallback to basic detection based on userAgent.
         *
         * @returns {string} the platform identifier
         */
        getPlatform: function () {
            return window.device ? window.device.platform : getPlatformFromUserAgent(navigator.userAgent);
        },

        /**
         * Load the css from the given path in the page head.
         *
         * @param path the path to load the css content from.
         */
        loadCss: function (path) {
            $('head').append($('<link rel="stylesheet" type="text/css"/>').attr('href', path));
        },

        loadJs: function (uri) {
            $('head').append($('<link rel="stylesheet" type="text/css"/>').attr('href', path));
        }

    };

})();