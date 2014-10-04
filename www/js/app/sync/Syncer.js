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
app.sync = app.sync || {};

/**
 * see https://github.com/jashkenas/backbone/blob/master/backbone.js Backbone.sync
 */
app.sync.Syncer = (function () {

    var syncs = {};

    var Sync = function(store) {

        this.sync = function(method, model, options) {

            switch (method) {

                case 'create':
                    var created = store.create(model);
                    options.success(created);
                    return {};

                case 'read':
                    if (!model.id) {
                        var reads = store.readAll(model);
                        options.success(reads);
                    } else {
                        var read = store.read(model);
                        options.success(read);
                    }
                    return {};

                case 'update':
                    var updated = store.update(model);
                    options.success(updated);
                    return {};

                case 'delete':
                    var deleted = store.remove(model);
                    options.success(deleted);
                    return {};

                default:
                    throw ('Unsupported method: ' + method);
            }
        };
    };

    var buildStore = function(modelType, syncType) {
        switch (syncType) {
            case 'mem':
                return new app.stores.MemoryStore(modelType);
            case 'default':
                return buildDefaultStore(modelType);
            default:
                return buildDefaultStore(modelType);
        }
    };

    var buildDefaultStore = function(modelType) {
        return new app.stores.LocalStore(modelType);
    };

    return {

        /**
         * @param {String} modelType the model type identifier
         * @param {String} syncType (optional) the the sync type in ['mem','default']
         * @returns {Backbone.sync} sync according to a model and sync types
         */
        getSync: function(modelType, syncType) {
            var modelSyncs = syncs[modelType] = syncs[modelType] || {};
            return modelSyncs[syncType] = modelSyncs[syncType] || new Sync(buildStore(modelType, syncType));
        }

    };

}());




