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
app.models = app.models || {};

/**
 * A dive suit
 */
app.models.Suit = (function () {

    /**
     * Density of closed cell foamed neoprene in {@code kg•m^-3}
     */
    var FOAMED_NEOPRENE_DENSITY = 300;

    var WetSuit = function (surface, thickness) {

        return {

            volume: function () {
                var volume = surface * thickness;
                return new app.units.Unit(volume, 'm^3');
            },

            mass: function () {
                var mass = this.volume().value() * FOAMED_NEOPRENE_DENSITY;
                return new app.units.Unit(mass, 'kg');
            }

        };

    };

    return app.models.Gear.extend({

        initialize: function (attributes, diver) {
            app.models.Gear.prototype.initialize.apply(this, arguments);

            if (diver) {
                var wetSuit = new WetSuit(diver.surface.value * attributes['surfaceRatio'], attributes['thickness']);
                this.set('volume', wetSuit.volume().obj());
                this.set('mass',   wetSuit.mass().obj());
            }
        },

        defaults : {
            category: 'SUIT'    // suit type
        }

    });
})();