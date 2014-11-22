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

app.views.EnvironmentResultView = (function () {

    var template = 'templates/EnvironmentResultView.html';

    app.cache.Cache.get(template);

    return app.views.BaseView.extend({

        tagName: 'li',

        className: 'table-view-cell',

        initialize: function (options) {
            app.views.BaseView.prototype.initialize.apply(this, arguments);
        },

        render: function () {

            var self = this;

            app.cache.Cache.get(template, function(data) {

                self.$el.html(_.template(data)({
                    json: self.model.toJSON(),
                    config: self.config
                }));

                var $features = self.$el.find('.environment-features');

                var features = { water: undefined, temperature: 0 };

                for (var feature in features) {
                    if (features.hasOwnProperty(feature)) {
                        var attributes = {
                            feature: feature,
                            value: self.model.get(feature)
                        };
                        var fv = new app.views.FeatureView({
                            model: new app.models.Feature(attributes),
                            config: self.config
                        });
                        fv.render(features[feature]);
                        $features.append(fv.$el).append(' ');
                    }
                }


                $features.after(new app.views.FeatureView({
                    model: new app.models.Feature({
                        feature: 'density',
                        value: self.model.get('density')
                    }),
                    config: self.config
                }).render(4).$el);

            });

            return this;
        }

    });

})();