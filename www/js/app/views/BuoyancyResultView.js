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
app.views = app.views || {};

app.views.BuoyancyResultView = (function () {

    var template = 'templates/BuoyancyResultView.html';

    app.cache.Cache.get(template);

    return app.views.BaseView.extend({

        tagName: 'li',

        className: 'table-view-cell-no-padding main-result',

        initialize: function (options) {
            app.views.BaseView.prototype.initialize.apply(this, arguments);
        },

        render: function () {

            var self = this;

            app.cache.Cache.get(template, function(data) {

                var json = self.model.toJSON();

                self.$el.html(_.template(data)({
                    json: json,
                    config: self.config
                }));

                // buoyancy

                self.$el.find('.buoyancy').html(
                    new app.views.BuoyancyView({
                        model: new app.models.Feature({
                            feature: 'buoyancy',
                            value: self.model.get('buoyancy')
                        }),
                        config: self.config
                    }).render(1).$el);

            });
            return this;
        }
    });

})();