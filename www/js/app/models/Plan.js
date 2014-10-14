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

app.models.Plan = Backbone.Model.extend({

    initialize: function() {
        this.syncer = app.sync.Syncer.getSync('app.model.Plan', 'default');
    },

    defaults : {
        diver       : {},
        gears       : [],
        environment : {}
    },

    validate: function (attributes) {
        var diver = attributes.diver;
        var weight = diver.weight;
        if (weight) {
            if (! $.isNumeric(weight) || (weight <= 0)) {
                return 'weight must be a positive number';
            }
        }
        var height = diver.height;
        if (height) {
            if (! $.isNumeric(height) || (height <= 0)) {
                return 'height must be a positive number';
            }
        }
        return false;
    },

    sync: function(method, model, options) {
        return this.syncer.sync(method, model, options);
    }

});