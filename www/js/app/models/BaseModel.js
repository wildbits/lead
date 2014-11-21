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
 * The base model containing methods shared among all models
 */
app.models.BaseModel = (function () {

    return Backbone.Model.extend({

        /**
         * Validate that a given set of keys on an object refer to defined values
         * key: {value: 'some-value'}
         *
         * @param obj the values to be validated
         * @param keys values names
         * @returns {String|Boolean} an error message or {@code false} if all keys are defined.
         */
        validateValue: function (obj, keys) {
            for (var key in keys) {
                if (keys.hasOwnProperty(key)) {
                    var v = obj[keys[key]];
                    if (! v) {
                        return 'Undefined key: ' + key;
                    }
                    if (! v.value) {
                        return 'Undefined value: ' + obj[keys[key]];
                    }
                }
            }
            return false;
        },

        /**
         * Validate that a set of keys refer to defined values on a given object
         * key: 'some-value'
         *
         * @param obj the object to be validated
         * @param keys the values which must be defined
         * @returns {String|Boolean} an error message or {@code false} if all keys are defined
         */
        validateDefined: function (obj, keys) {
            for (var key in keys) {
                if (keys.hasOwnProperty(key)) {
                    if (! obj[keys[key]]) {
                        return 'Undefined key: ' + key + ' on object: ' + obj;
                    }
                }
            }
            return false;
        },


        /**
         * Overrides Backbone sync method in order to hook a custom Syncer
         */
        sync: function(method, model, options) {
            return this.syncer.sync(method, model, options);
        }

    });
})();