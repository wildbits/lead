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

app.views.DiverView = (function () {

    var template = 'templates/DiverView.html';

    app.cache.Cache.get(template);

    return app.views.BaseView.extend({

        tagName: 'div',

        className: 'main-view',

        events: {
            'click .save-diver': 'saveDiver'//,
            //'click .bar-nav .icon-left-nav': 'back'
        },

        initialize: function (options) {
            app.views.BaseView.prototype.initialize.apply(this, arguments);
        },

        render: function () {

            var self = this;

            app.cache.Cache.get(template, function(data) {

                var diver = new app.models.Diver(self.model.get('diver'));

                self.$el.html(_.template(data)({
                    json: diver.toJSON(),
                    config: self.config
                }));

                // gender

                self.$el.find('.diver-gender').after(new app.views.OptionView({
                    model: new app.models.Option({
                        name: 'gender',
                        data: diver.get('gender'),
                        default: 'male',
                        values: ['male','female']
                    }),
                    config: self.config
                }).render().$el);

                // age

                self.$el.find('.diver-age').after(new app.views.OptionView({
                    model: new app.models.Option({
                        name: 'age',
                        data: diver.get('age'),
                        default: 25,
                        values: (function () {
                            var values = [];
                            for (var i = 10 ; i < 61 ; i+=1) { values.push(i); }
                            return values;
                        })()
                    }),
                    config: self.config
                }).render(2).$el);

                // height

                self.$el.find('.diver-height').after(new app.views.OptionView({
                    model: new app.models.Option({
                        name: 'height',
                        data: diver.get('height'),
                        default: {value: 1.80, unit: 'm'},
                        values: (function () {
                            var values = [];
                            for (var i = 1.20 ; i < 2.11 ; i+=0.01) { values.push({value: Number(Number(i).toFixed(2)), unit: 'm'}); }
                            return values;
                        })()
                    }),
                    config: self.config
                }).render(2).$el);

                // weight

                self.$el.find('.diver-weight').after(new app.views.OptionView({
                    model: new app.models.Option({
                        name: 'weight',
                        data: diver.get('weight'),
                        default: {value: 80, unit: 'kg'},
                        values: (function () {
                            var values = [];
                            for (var i = 30 ; i < 121 ; i+=1) { values.push({value: i, unit: 'kg'}); }
                            return values;
                        })()
                    }),
                    config: self.config
                }).render(0).$el);

                // footer

                self.$el.append(new app.views.ConfigView({
                    model: self.config
                }).render().$el);

            });

            return this;
        },

        saveDiver: function(e) {

            var diver = new app.models.Diver(this.model.get('diver'));

            var $form = this.$el.find('.diver-form');

            diver.set('gender', $form.find('select[name=gender]').val());
            diver.set('age',    $form.find('select[name=age]').val());
            diver.set('height', {value: Number($form.find('select[name=height]').val()), unit: 'm'});
            diver.set('weight', {value: Number($form.find('select[name=weight]').val()), unit: 'kg'});

            var updated = new app.models.Diver(diver.toJSON());
            this.model.set('diver', updated.toJSON());

            this.model.save();
            //Backbone.history.history.back();
        }
        /*,

        back: function () {
            Backbone.history.history.back();
        }*/

    });

})();