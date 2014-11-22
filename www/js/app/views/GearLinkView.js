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

app.views.GearLinkView = (function () {

    var template = 'templates/GearLinkView.html';

    app.cache.Cache.get(template);

    return app.views.BaseView.extend({

        tagName: 'li',

        className: 'table-view-cell',

        initialize: function (options) {
            app.views.BaseView.prototype.initialize.apply(this, arguments);
            this.mode = options.mode;
        },

        render: function () {

            var self = this;

            app.cache.Cache.get(template, function(data) {

                var json = self.model.toJSON();

                self.$el.html(_.template(data)({
                    json: json,
                    mode: self.mode,
                    config: self.config
                }));

                var $features = self.$el.find('.gear-features-' + json.id);

                var features = { size: undefined, material: undefined, capacity: 1, mass:1 };

                for (var feature in features) {
                    if (features.hasOwnProperty(feature)) {
                        var value = self.model.get(feature);
                        if (value) {
                            if (! value.unit || value.value) {
                                var attributes = {
                                    feature: feature,
                                    value: value
                                };
                                var fv = new app.views.FeatureView({
                                    model: new app.models.Feature(attributes),
                                    config: self.config
                                });
                                fv.render(features[feature]);
                                $features.append(fv.$el).append(' ');
                            }
                        }
                    }
                }

            });

            return this;
        }

    });

})();