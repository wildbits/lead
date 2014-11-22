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

app.models.Feature = (function () {

    return app.models.BaseModel.extend({

        initialize: function (attributes) {
            app.models.BaseModel.prototype.initialize.apply(this, arguments);
            this.syncer = app.sync.Syncer.getSync('app.model.Feature', 'mem');
        },

        defaults : {
            feature  : undefined,  // the feature name
            value    : undefined   // the feature value
        },

        validate: function (attrs) {
            return this.validateDefined(attrs, ['feature','value']);
        }

    });
})();