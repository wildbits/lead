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
 * The model for the application configuration
 */
app.models.Config =  (function () {

    var UNITS = {

        metric: {
            mass           : 'kg',
            temperature    : '°C',
            volume         : 'l',
            pressure       : 'bar',
            length         : 'm',
            density        : 'kg/l',
            'mass-fraction': 'kg/kg'
        },

        imperial: {
            mass           : 'lb',
            temperature    : '°F',
            volume         : 'cuft',
            pressure       : 'psi',
            length         : 'ft',
            density        : 'lb/cuft',
            'mass-fraction': 'lb/lb'
        }
    };

    return app.models.BaseModel.extend({

        initialize: function (attributes) {

            this.syncer = app.sync.Syncer.getSync('app.model.Config', 'default');

            // check attributes

            if (this.validateDefined(attributes, ['unitSystem']) || ! UNITS[attributes.unitSystem]) {
                return;
            }

            attributes.units = UNITS[attributes.unitSystem];

            this.set('units', attributes.units);

        },

        defaults : {
            unitSystem: undefined,  // the unit system in 'metric','imperial'
            units: {}               // the unit for each measure
        },

        validate: function (attrs) {
            return this.validateDefined(attrs, ['unitSystem','units']);
        }

    });

})();