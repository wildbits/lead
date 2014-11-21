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

app.models.Option = (function () {

    return app.models.BaseModel.extend({

        initialize: function (attributes) {
            app.models.BaseModel.prototype.initialize.apply(this, arguments);
            this.syncer = app.sync.Syncer.getSync('app.model.Option', 'mem');
        },

        defaults : {
            name    : undefined, // the name of the option
            values  : [],        // the option values name
            default : undefined, // the default value if no option is selected
            data    : undefined  // the selected data
        },

        validate: function (attrs) {
            return this.validateDefined(attrs, ['name','default','data']);
        }

    });
})();