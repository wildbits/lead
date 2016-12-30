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

app.views.CylinderEditorView = (function () {

    var template = 'templates/CylinderEditorView.html';

    app.cache.Cache.get(template);

    return app.views.BaseView.extend({

        tagName: 'div',

        className: 'main-view',

        events: {
            'click .save-cylinder': 'saveCylinder',
            'click .btn-cancel': 'cancelEdit'
        },

        initialize: function (options) {
            app.views.BaseView.prototype.initialize.apply(this, arguments);
        },

        render: function () {

            var self = this;

            app.cache.Cache.get(template, function(data) {

                var cylinder = new app.models.Cylinder(self.model.toJSON());

                self.$el.html(_.template(data)({
                    json: cylinder.toJSON(),
                    config: self.config
                }));

                // Max pressure

                self.$el.find('.cylinder-maxPressure').after(new app.views.OptionView({
                    model: new app.models.Option({
                        name: 'maxPressure',
                        data: cylinder.get('maxPressure'),
                        default: {value: 228, unit: 'bar'},
                        values: (function () {
                            var values = [];
                            for (var i = 70 ; i < 330 ; i+=1) { values.push({value: i, unit: 'bar'}); }
                            return values;
                        })()
                    }),
                    config: self.config
                }).render().$el);

                // Material

                self.$el.find('.cylinder-material').after(new app.views.OptionView({
                    model: new app.models.Option({
                        name: 'material',
                        data: cylinder.get('material'),
                        default: 'aluminium',
                        values: ['aluminium','steel']
                    }),
                    config: self.config
                }).render().$el);

                // Weight

                self.$el.find('.cylinder-weight').after(new app.views.OptionView({
                    model: new app.models.Option({
                        name: 'weight',
                        data: cylinder.get('weight'),
                        default: {value: 15.7, unit: 'kg'},
                        values: (function () {
                            var values = [];
                            for (var i = 0.5 ; i < 40 ; i+=0.1) { values.push({value: i, unit: 'kg'}); }
                            return values;
                        })()
                    }),
                    config: self.config
                }).render(1).$el);

                // Water volume

                self.$el.find('.cylinder-water-volume').after(new app.views.OptionView({
                    model: new app.models.Option({
                        name: 'capacity',
                        data: cylinder.get('capacity'),
                        default: {value: 0.0103, unit: 'm^3'},
                        values: (function () {
                            var values = [];
                            for (var i = 0.0005 ; i < 0.03 ; i+=0.0001) { values.push({value: i, unit: 'm^3'}); }
                            return values;
                        })()
                    }),
                    config: self.config
                }).render(3).$el);

                // Cylinder name

                self.$el.find('.cylinder-name').after(new app.views.TextInputView({
                    model: new Backbone.Model({
                        name: 'cylinderName',
                        value: cylinder.get('name')
                    }),
                    config: self.config
                }).render().$el);

            });

            return this;
        },

        cancelEdit: function (e) {
            Backbone.history.history.back();
        },

        saveCylinder: function(e) {

            var cylinder = this.model;

            var $form = this.$el.find('.cylinder-form');

            cylinder.set('material', $form.find('select[name=material]').val());

            var weight = new app.units.Unit($form.find('select[name=weight]').val(), 'kg');
            cylinder.set('weight', weight.obj());

            var maxPressure = new app.units.Unit($form.find('select[name=maxPressure]').val(), 'bar');
            cylinder.set('maxPressure', maxPressure.obj());
            var defaultPressure = cylinder.get('defaultPressure');
            if (! defaultPressure || defaultPressure.value() < maxPressure.value()) {
                cylinder.set('defaultPressure', maxPressure.obj());
            }

            var capacity = new app.units.Unit($form.find('select[name=capacity]').val(), 'm^3');
            cylinder.set('capacity', capacity.obj());

            var name = app.utils.TextUtils.sanitize($form.find('input[name=cylinderName]').val().trim());
            if (! name) {
                name = 'New cylinder ' + new Date().getTime();
            }
            cylinder.set('name', name);

            this.model = new app.models.Cylinder(cylinder.toJSON());
            this.model.save();

            var hash = 'plans/abs/gears/store/CYLINDER';
            app.router.navigate(hash, {trigger: true});

        }

    });

})();