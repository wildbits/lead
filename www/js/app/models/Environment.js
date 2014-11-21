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
 * A model of the environment for the dive
 */
app.models.Environment = (function () {

    /**
     * Average seawater salinity in {@code kg•kg^-1}
     */
    var SEAWATER_SALINITY = {value: 0.035, unit: 'kg/kg'};

    /**
     * Fresh water salinity in {@code kg•kg^-1}
     */
    var FRESHWATER_SALINITY = {value: 0, unit: 'kg/kg'};

    var WATER = {
        seawater: {
            salinity: function(attributes) {
                return SEAWATER_SALINITY;
            }
        },
        freshwater: {
            salinity: function (attributes) {
                return FRESHWATER_SALINITY;
            }
        },
        specificSeawater: {
            salinity: function (attributes) {
                return attributes.salinity;
            }
        }
    };

    return app.models.BaseModel.extend({

        initialize: function(attributes) {
            this.syncer = app.sync.Syncer.getSync('app.model.Environment', 'mem');

            // check attributes

            if (this.validateDefined(attributes, ['water']) || this.validateValue(attributes, ['temperature'])) {
                return;
            }

            var water = WATER[attributes.water];
            if (!water) {
                return;
            }

            // enforce base units

            var temperature = new app.units.Unit(attributes.temperature).as(this.defaults.temperature.unit);
            attributes.temperature = temperature.obj();

            // evaluate the water density

            var salinity = new app.units.Unit(water.salinity(attributes));
            var seawater = new org.wildbits.hydro.Seawater();
            var density = new app.units.Unit(seawater.density(temperature.as('°C').value(), salinity.as('kg/kg').value()), this.defaults.density.unit);

            this.set('density', density.obj());

        },

        defaults : {
            water      : undefined,        // water type in 'seawater', 'freshwater'
            temperature: {unit: 'K'},      // water temperature in {@code K}
            density    : {unit: 'kg/m^3'}  // water density in {@code kg•m^-3}
        },

        validate: function (attrs) {
            return this.validateDefined(attrs, ['water']) || this.validateValue(attrs, ['temperature','density']);
        }
    });
})();