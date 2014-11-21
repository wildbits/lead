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
var app = app || {};

app.App = (function () {

    var createPlan = function (planId, diverRequired) {
        new app.models.Plan({
            id: planId
        }).fetch({
            success: function (plan) {
                plan.save();
            }
        });
    };

    $(document).on("ready", function () {

        var gears = 'data/gears.json';

        app.cache.Cache.get(gears, function (gears) {

            var i18nConf = {
                fallbackLng: 'en',
                ns: {
                    namespaces: ['app', 'features'],
                    defaultNs: 'app'
                },
                lng: 'en'
            };

            i18n.init(i18nConf, function (i18n) {

                app.i18n = i18n;

                // http://lostechies.com/derickbailey/2011/09/15/zombies-run-managing-page-transitions-in-backbone-apps
                Backbone.View.prototype.close = function () {
                    this.remove();
                    this.unbind();
                };

                var slider = new app.sliders.Slider($('body'));
                app.router = new app.routers.Router(slider);


                // Load device specific css

                var platform = app.platforms.Platform.getPlatform();
                switch (platform) {
                    case 'Android':
                        app.platforms.Platform.loadCss('css/ratchet-theme-android.min.css');
                        break;
                    case 'iOS':
                        app.platforms.Platform.loadCss('css/ratchet-theme-ios.min.css');
                        break;
                }

                // Create configuration if needed

                var config = new app.models.Config({id: 'config', unitSystem: 'metric'}).fetch({
                    success: function (config) {
                        config.save();
                    }
                });

                // Install the gears

                _.each(gears['gears'], function (gear) {
                    new app.models.Gear(gear).save();
                });

                _.each(gears['suits'], function (suit) {
                    new app.models.Suit(suit).save();
                });

                _.each(gears['cylinders'], function (cylinder) {
                    new app.models.Cylinder(cylinder).save();
                });

                // Create the plans if needed

                createPlan('abs');
                createPlan('rel1');
                createPlan('rel2');

                Backbone.history.start();

            });

        }, 'json');

    });

})();