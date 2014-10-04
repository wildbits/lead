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
app.stores = app.stores || {};

/**
 * A generic implementation of a CRUD store for {Backbone.Model} models.
 * The implementation converts model attributes into string values and delegates their persistence to a
 * specific storage implementation.
 */
app.stores.Store = (function () {

    return function (storage) {

        /**
         * State for the last generated identifier
         */
        var lastId = Date.now();

        /**
         * @returns {number} a unique (per instance) identifier.
         */
        var generateId = function () {
            return ++lastId;
        };

        /**
         * @param {Backbone.Model} model the model instance to be persisted
         * @returns {*} the persisted attributes of the given model
         */
        this.create = function(model) {
            if (!model.id) {
                model.id = generateId();
                model.set(model.idAttribute, model.id);
            }
            storage.set(model.id, JSON.stringify(model.toJSON()));
            return this.read(model);
        };

        /**
         * @param {Backbone.Model} model the model to be read from the store
         * @returns {*} the model attributes or undefined if no match could be found
         */
        this.read = function(model) {
            var attributes = storage.get(model.id);
            return attributes != undefined ? JSON.parse(attributes) : attributes;
        };

        /**
         * @returns {Array} an array containing all the {Backbone.Model} models attributes available in the store
         */
        this.readAll = function() {
            var all = [];
            var raws = storage.getAll();
            for (var i = raws.length ; i-- ; ) {
                var raw = raws[i];
                all.push(JSON.parse(raw));
            }
            return all;
        };

        /**
         * @param {Backbone.Model} model the model to be updated
         * @returns {*} the attributes of the updated model read from the store
         */
        this.update = function(model) {
            storage.set(model.id, JSON.stringify(model.toJSON()));
            return this.read(model);
        };

        /**
         * @param {Backbone.Model} model the model to be removed from the store
         * @returns {*} the attributes of the model provided
         */
        this.remove = function(model) {
            storage.remove(model.id);
            return JSON.parse(JSON.stringify(model.toJSON()));
        };
    };

}());