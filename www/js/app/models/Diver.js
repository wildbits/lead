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
 * A diver body
 */
app.models.Diver = (function () {

    /**
     * Average density of FFM (Fat Free Mass) in {@code kg•m^-3}
     */
    var DENSITY_FFM = 1100;

    /**
     * Average density of fat in {@code kg•m^-3}
     */
    var DENSITY_FAT = 901;

    /**
     * Average volume in intestine in {@code m^-3}
     */
    var VI = 0.0001;

    /**
     * The American journal of clinical nutrition, 53(5), 1112-1116.
     * Fat-free mass in relation to stature: ratios of fat-free mass to height in children, adults, and elderly subjects.
     * Barlett, H. L., Puhl, S. M., Hodgson, J. L., & Buskirk, E. R. (1991).
     *
     * @type {{male: Function, female: Function}}
     */
    var FFM_HEIGHT = {

        /**
         * The Male Fat Free Mass over Height ratio, according to the given age.
         * @param age {Number} the age of the person
         * @returns {Number} the FFM over Height ratio ; or {@code -1} if undefined
         */
        male: function (age) {
            switch (true) {
                case age < 6 : return -1;
                case age < 8 : return 15.5;
                case age < 11: return 18.5;
                case age < 14: return 22.3;
                case age < 16: return 27.3;
                case age < 19: return 35.2;
                case age < 23: return 36.5;
                case age < 31: return 34.9;
                case age < 41: return 35.2;
                case age < 51: return 35.0;
                case age < 56: return 35.4;
                case age < 61: return 35.0;
                case age < 66: return 33.3;
                case age < 71: return 31.7;
                default      : return -1;
            }
        },
        /**
         * The Female Fat Free Mass over Height ratio, according to the given age.
         * @param age {Number} the age of the person
         * @returns {Number} the FFM over Height ratio ; or {@code -1} if undefined
         */
        female: function (age) {
            switch (true) {
                case age < 6 : return -1;
                case age < 8 : return 15.6;
                case age < 11: return 18.3;
                case age < 14: return 21.2;
                case age < 16: return 25.4;
                case age < 19: return 27.3;
                case age < 23: return 27.6;
                case age < 31: return 28.5;
                case age < 41: return 28.7;
                case age < 51: return 29.1;
                case age < 56: return 26.5;
                case age < 62: return 25.6;
                case age < 66: return 24.8;
                case age < 86: return 24.3;
                default      : return -1;
            }
        }
    };

    /**
     * Average lungs volumes characteristics in {@code m^3}
     */
    var AVG_LUNGS_VOLUMES = {
        male: {
            irv: 0.003,  // Inspiratory reserve volume
            tv : 0.0005, // Tidal volume
            erv: 0.0011, // Expiratory reserve volume
            rv : 0.0012  // Residual volume
        },
        female: {
            irv: 0.0019,
            tv : 0.0005,
            erv: 0.0007,
            rv : 0.0011
        }
    };

    /**
     * The body surface area using Schlich and al. equations.
     * 3-D-Body-Scan als anthropometrisches Verfahren zur Bestimmung der spezifischen Korperoberflache.
     */
    var SURFACE = {

        /**
         * @param weight {number} diver weight in {@code kg}
         * @param height {number} diver height in {@code m}
         * @returns {number} the diver surface in {@code m^2}
         */
        male: function (weight, height) {
            return 0.000579479 * Math.pow(weight, 0.38) * Math.pow(height * 100, 1.24);
        },

        /**
         * @param weight {number} diver weight in {@code kg}
         * @param height {number} diver height in {@code m}
         * @returns {number} the diver surface in {@code m^2}
         */
        female: function (weight, height) {
            return 0.000975482 * Math.pow(weight, 0.46) * Math.pow(height * 100, 1.08);
        }
    };

    var GENDERS = {
        male: {
            FFM_HEIGHT: FFM_HEIGHT.male,
            AVG_LUNGS_VOLUMES: AVG_LUNGS_VOLUMES.male,
            SURFACE: SURFACE.male
        },
        female: {
            FFM_HEIGHT: FFM_HEIGHT.female,
            AVG_LUNGS_VOLUMES: AVG_LUNGS_VOLUMES.female,
            SURFACE: SURFACE.female
        }
    };

    return app.models.Solid.extend({

        initialize: function(attributes) {
            this.syncer = app.sync.Syncer.getSync('app.model.Diver', 'mem');

            // check attributes

            if (this.validateDefined(attributes, ['gender', 'age']) || this.validateValue(attributes, ['height', 'weight'])) {
                return;
            }

            var gender = GENDERS[attributes.gender];
            if (!gender) {
                return;
            }

            // enforce base units

            var weight = new app.units.Unit(attributes.weight).as(this.defaults.weight.unit);
            attributes.weight = weight.obj();

            var height = new app.units.Unit(attributes.height).as(this.defaults.height.unit);
            attributes.height = height.obj();

            // Evaluate the body fat ratio and body volume

            var freeFatMass = gender.FFM_HEIGHT(attributes.age) * height.value();
            var freeFatVolume = freeFatMass / DENSITY_FFM;

            var fatMass = Math.max(weight.value() - freeFatMass, 0.0);
            var fatVolume = fatMass / DENSITY_FAT;

            var fatRatio = fatMass / weight.value();

            var gv = gender.AVG_LUNGS_VOLUMES;
            var lungsVolume = gv.erv + gv.rv + gv.tv / 2; // lungs volume at mid functional capacity

            var volume = freeFatVolume + fatVolume + lungsVolume + VI;
            var density = weight.value() / volume;

            this.set('volume',   {value: volume, unit: 'm^3'});
            this.set('density',  {value: density, unit: 'kg/m^3'});
            this.set('fatRatio', {value: fatRatio});

            // evaluate the body surface

            var surface = gender.SURFACE(weight.value(), height.value());
            this.set('surface', {value: surface, unit: 'm^2'});
        },

        defaults : {
            gender  : undefined,     // the person gender in 'male', 'female'
            age     : undefined,     // the person age
            height  : {unit: 'm'},   // the person height in {@code m}
            volume  : {unit: 'm^3'}, // the total person volume in {@code m^3}
            weight  : {unit: 'kg'},  // the total person weight in {@code kg}
            required: {'gender': true, 'age': true, 'height': true, 'weight': true}
        },

        validate: function (attrs) {
            return this.validateDefined(attrs, ['gender', 'age']) || this.validateValue(attrs, ['height', 'volume', 'weight']);
        },

        /**
         * @returns {app.units.Unit} the mass in {@code kg}
         */
        mass: function () {
            return new app.units.Unit(this.get('weight')).as('kg');
        },

        /**
         * @returns {app.units.Unit} the surface of the diver body in {@code m^2}
         */
        surface: function () {
            return new app.units.Unit(this.get('surface')).as('m^2');
        }

    });
})();