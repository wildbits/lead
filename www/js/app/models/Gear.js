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
 * A generic dive gear
 */
app.models.Gear = app.models.Solid.extend({

    initialize: function() {
        this.syncer = app.sync.Syncer.getSync('app.model.Gear', 'mem');
    },

    defaults : {
        name    : undefined,     // the gear name
        category: undefined,     // the gear category
        img     : undefined,     // the path to the gear image
        volume  : {unit: 'm^3'}, // the total gear volume in {@code m^3}
        mass    : {unit: 'kg'}   // the total gear mass in {@code kg}
    },

    validate: function (attrs) {
        return this.validateDefined(attrs, ['name','category','img']);
    }

});