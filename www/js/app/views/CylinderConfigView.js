/**
 * Copyright 2015 wildbits.github.io
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

app.views.CylinderConfigView = (function () {

    var template = 'templates/CylinderConfigView.html';

    app.cache.Cache.get(template);

    return app.views.BaseView.extend({

        tagName: 'div',

        className: 'main-view',

        events: {
            'click .add-gears': 'addCylinder',
            'click .btn-back' : 'back'
        },

        initialize: function (options) {
            app.views.BaseView.prototype.initialize.apply(this, arguments);
            this.model.on('sync', this.render, this);
        },

        render: function () {

            var self = this;

            app.cache.Cache.get(template, function(data) {

                var cylinder = self.collection.toJSON();
                var maxPressure = new app.units.Unit(cylinder.maxPressure).as('bar');
                var defaultPressure = new app.units.Unit(cylinder.defaultPressure).as('bar');

                self.$el.html(_.template(data)({
                    json: cylinder,
                    config: self.config
                }));

                // filling-pressure

                self.$el.find('.filling-pressure').after(new app.views.OptionView({
                    model: new app.models.Option({
                        name: 'filling-pressure',
                        data: defaultPressure.obj(),
                        default: defaultPressure.obj(),
                        values: (function () {
                            var values = [{value: 1, unit: 'bar'}];
                            for (var i = 10 ; i <= maxPressure.value() ; i += 10) { values.push({value: i, unit: 'bar'}); }
                            return values;
                        })()
                    }),
                    config: self.config
                }).render(0).$el);

            });

            return this;
        },

        addCylinder: function (e) {
            e.preventDefault();

            var $form = this.$el.find('.gear-config-form');
            var pressure = $form.find('select[name=filling-pressure]').val();

            var cylinder = this.collection.toJSON();
            cylinder.id = app.ids.Ids.next();

            cylinder.pressure = {value: pressure, unit: 'bar'};
            cylinder = new app.models.Cylinder(cylinder).toJSON();

            this.model.get('gears').push(cylinder);
            this.model.save();

            var hash = 'plans/' +  this.model.id + '/gears';
            app.router.navigate(hash, {trigger: true});

        },

        back: function () {
            Backbone.history.history.back();
        }

    });

})();