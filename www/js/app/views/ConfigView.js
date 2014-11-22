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

app.views.ConfigView = (function () {

    var template = 'templates/ConfigView.html';

    app.cache.Cache.get(template);

    return app.views.BaseView.extend({

        tagName: 'div',

        className: 'modal',

        id: 'config',

        initialize: function (options) {
            app.views.BaseView.prototype.initialize.apply(this, arguments);
        },

        events: {
            'click .save-units': 'saveUnits',
            'click .reset-app': 'resetApplication'
        },

        render: function () {

            var self = this;

            app.cache.Cache.get(template, function(data) {

                self.$el.html(_.template(data)({
                    config: self.config
                }));

                self.$el.find('.unit-system').after(new app.views.OptionView({
                    model: new app.models.Option({
                        name: 'unitSystem',
                        data: self.model.unitSystem,
                        default: 'metric',
                        values: ['metric','imperial']
                    }),
                    config: self.config
                }).render(0).$el);

            });

            return this;
        },

        resetApplication: function (e) {
            e.preventDefault();
            app.sync.Syncer.empty();
            window.location.replace("index.html");
        },

        saveUnits: function (e) {

            var $view = this.$el.find('.table-view');

            var updated = new app.models.Config(this.model);
            updated.set('unitSystem', $view.find('select[name=unitSystem]').val());

            new app.models.Config(updated.toJSON()).save();

            Backbone.history.history.back();
        }

    });

})();