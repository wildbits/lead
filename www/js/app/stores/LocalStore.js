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
 * The LocalStore is a implementation of the {app.sync.Syncer} store using the HTML5 localStorage to persist models.
 */
app.stores.LocalStore = (function () {

    var data = window.localStorage;

    return function (modelType) {

        /**
         * @returns {string} the key for the given model identifier
         */
        var getKey = function (modelId) {
            return getKeyPrefix() + modelId;
        };

        /**
         * @returns {string} the key prefix for the model type
         */
        var getKeyPrefix = function () {
            return modelType + '.';
        };

        var LocalStorageImpl = function () {

            return {

                get: function (id) {
                    return data.getItem(getKey(id));
                },

                getAll: function () {
                    var keyPrefix = getKeyPrefix();
                    var keyPrefixLength = keyPrefix.length;
                    var all = [];
                    for (var key in data) {
                        if (data.hasOwnProperty(key)) {
                            if (key.slice(0, keyPrefixLength) == keyPrefix) { // key starts with key prefix
                                all.push(data.getItem(key));
                            }
                        }
                    }
                    return all;
                },

                set: function (id, value) {
                    data.setItem(getKey(id), value);
                },

                remove: function (id) {
                    data.removeItem(getKey(id));
                }

            }

        };

        return new app.stores.Store(new LocalStorageImpl());

    };

}());