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
 * A solid allowing to access the mass and volume.
 */
app.models.Solid = app.models.BaseModel.extend({

    /**
     * @returns {app.units.Unit} the volume in {@code m^3}
     */
    volume: function () {
        return new app.units.Unit(this.get('volume')).as('m^3');
    },

    /**
     * @returns {app.units.Unit} the mass in {@code kg}
     */
    mass: function () {
        return new app.units.Unit(this.get('mass')).as('kg');
    }

});