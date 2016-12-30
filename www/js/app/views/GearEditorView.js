/**
 * Copyright 2016 wildbits.github.io
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

app.views.GearEditorView = (function () {

    var template = 'templates/GearEditorView.html';

    app.cache.Cache.get(template);

    return app.views.BaseView.extend({

        tagName: 'div',

        className: 'main-view',

        events: {
            'click .save-gear': 'saveGear',
            'click .btn-cancel': 'cancelEdit'
        },

        initialize: function (options) {
            app.views.BaseView.prototype.initialize.apply(this, arguments);
        },

        render: function () {

            var self = this;

            app.cache.Cache.get(template, function(data) {

                var gear = new app.models.Gear(self.model.toJSON());

                self.$el.html(_.template(data)({
                    json: gear.toJSON(),
                    config: self.config
                }));

                // mass

                self.$el.find('.gear-weight').after(new app.views.OptionView({
                    model: new app.models.Option({
                        name: 'mass',
                        data: gear.get('mass'),
                        default: {value: 2.0, unit: 'kg'},
                        values: (function () {
                            var values = [];
                            for (var i = 0.1 ; i < 99 ; i+=0.1) { values.push({value: i, unit: 'kg'}); }
                            return values;
                        })()
                    }),
                    config: self.config
                }).render(1).$el);

                // Volume

                self.$el.find('.gear-volume').after(new app.views.OptionView({
                    model: new app.models.Option({
                        name: 'volume',
                        data: gear.get('volume'),
                        default: {value: 0.001, unit: 'm^3'},
                        values: (function () {
                            var values = [];
                            for (var i = 0.0001 ; i < 0.05 ; i+=0.0001) { values.push({value: i, unit: 'm^3'}); }
                            return values;
                        })()
                    }),
                    config: self.config
                }).render(3).$el);

                // Gear name

                self.$el.find('.gear-name').after(new app.views.TextInputView({
                    model: new Backbone.Model({
                        name: 'gearName',
                        value: gear.get('name')
                    }),
                    config: self.config
                }).render().$el);

            });

            return this;
        },

        cancelEdit: function (e) {
            Backbone.history.history.back();
        },

        saveGear: function(e) {

            var gear = this.model;

            var $form = this.$el.find('.gear-form');

            var mass = new app.units.Unit($form.find('select[name=mass]').val(), 'kg');
            gear.set('mass', mass.obj());

            var volume = new app.units.Unit($form.find('select[name=volume]').val(), 'm^3');
            gear.set('volume', volume.obj());

            var name = app.utils.TextUtils.sanitize($form.find('input[name=gearName]').val().trim());
            if (! name) {
                name = 'New gear ' + new Date().getTime();
            }
            gear.set('name', name);

            this.model.save();

            var hash = 'plans/abs/gears/store/' + gear.get('category');
            app.router.navigate(hash, {trigger: true});

        }

    });

})();