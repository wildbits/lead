/**
 * Copyright 2014 wildbits.github.io
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
 * An empty cylinder and its valve
 */
app.models.Cylinder = (function () {

    /**
     * Density for common metals in {@code kg•m^-3}
     */
    var MATERIAL_DENSITY = {
        aluminium: 2720,
        steel: 7850
    };

    /**
     * Average mass of cylinder valve in {@code kg}
     */
    var VALVE_MASS = 0.7;

    /**
     * Average volume of cylinder valve in {@code m^3}
     */
    var VALVE_VOLUME = 0.000087;

    /**
     * Gas temperature in {@code °K}
     */
    var GAS_TEMPERATURE = 293.15;

    return app.models.Gear.extend({

        initialize: function (attributes) {
            app.models.Gear.prototype.initialize.apply(this, arguments);

            // check attributes

            if (this.validateDefined(attributes, ['material']) || this.validateValue(attributes, ['weight','capacity'])) {
                return;
            }

            // enforce base units

            var weight = new app.units.Unit(attributes.weight).as(this.defaults.weight.unit);
            attributes.weight = weight.obj();

            var capacity = new app.units.Unit(attributes.capacity).as(this.defaults.capacity.unit);
            attributes.capacity = capacity.obj();

            // compute volume and mass for the empty cylinder + valve

            var cylinder = new org.wildbits.hydro.Cylinder(capacity.value(), MATERIAL_DENSITY[attributes.material], weight.value(), 0);
            var valve = new org.wildbits.hydro.Solid(VALVE_VOLUME, VALVE_MASS);

            var composite = new org.wildbits.hydro.Composite([cylinder, valve]);
            this.set('volume', {value: composite.volume(), unit: 'm^3'});
            this.set('mass', {value: composite.mass(), unit: 'kg'});

            // compute gas mass at the given pressure (assume gas is dry air, assume gas temperature is 20 °C)

            if (attributes.pressure) {
                var pressure = new app.units.Unit(attributes.pressure).as('Pa');
                var air = new org.wildbits.hydro.DryAir();
                var density = air.density(GAS_TEMPERATURE, pressure.value());
                var airMass = density * capacity.as('m^3').value();
                this.set('gasMass', {value: airMass, unit: 'kg'});
            }
        },

        defaults : {
            category : 'CYLINDER',     // cylinder type
            capacity : {unit: 'm^3'},  // the cylinder capacity in {@code m^3}
            weight   : {unit: 'kg'},   // the weight in {@code kg} of the empty cylinder
            material : undefined       // the cylinder material in 'aluminium', 'steel'
        },

        validate: function (attrs) {
            return this.validateDefined(attrs, ['material']) || this.validateValue(attrs, ['weight','capacity','volume','mass']);
        }

    });
})();