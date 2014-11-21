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
app.views = app.views || {};

app.views.FeatureView = (function () {

    var template = 'templates/FeatureView.html';

    app.cache.Cache.get(template);

    return app.views.BaseView.extend({

        tagName: 'span',

        className: 'badge',

        initialize: function (options) {
            app.views.BaseView.prototype.initialize.apply(this, arguments);
        },

        render: function (precision) {

            var self = this;

            app.cache.Cache.get(template, function(data) {

                var json = self.model.toJSON();

                json.precision = precision;
                self.$el.html(_.template(data)({
                    json: json,
                    config: self.config
                }));

                var value = (typeof json.value === 'object') ? json.value.value : json.value;
                if (value) {
                    self.$el.addClass('badge-primary');
                }

            });

            return this;
        }

    });

})();