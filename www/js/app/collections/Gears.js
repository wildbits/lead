/**
 * Copyright 2014-2016 wildbits.github.io
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
app.collections = app.collections || {};

/**
 * A set of gears
 */
app.collections.Gears = Backbone.Collection.extend({

    initialize: function() {
        this.syncer = app.sync.Syncer.getSync('app.model.Gear', 'default');
    },

    model: app.models.Gear,

    sync: function(method, model, options) {
        return this.syncer.sync(method, model, options);
    }

});