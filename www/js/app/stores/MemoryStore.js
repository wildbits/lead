/**
 * Copyright wildbits org
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
app.stores = app.stores || {};

/**
 * The MemoryStore is an in memory implementation of the {app.sync.Syncer} store.
 */
app.stores.MemoryStore = (function () {

    return function (modelType) {

        var MemoryImpl = function () {

            /**
             * Holds the mapping from models identifier to models values
             *
             * keys are {Backbone.Model} model identifiers
             * values are {Backbone.Model} model attributes
             */
            var store = {};

            return {

                get: function (id) {
                    return store[id];
                },

                getAll: function () {
                    var all = [];
                    for (var id in store) {
                        if (store.hasOwnProperty(id)) {
                            all.push(store[id]);
                        }
                    }
                    return all;
                },

                set: function (id, value) {
                    store[id] = value;
                },

                remove: function (id) {
                    delete store[id];
                }

            }

        };

        return new app.stores.Store(new MemoryImpl());

    };

}());