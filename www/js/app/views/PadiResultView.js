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

app.views.PadiResultView = (function () {

    var template = 'templates/PadiResultView.html';

    app.cache.Cache.get(template);

    return app.views.BaseView.extend({

        tagName: 'div',

        className: 'main-view',

        initialize: function (options) {
            app.views.BaseView.prototype.initialize.apply(this, arguments);
            this.map = undefined;
        },

        render: function () {

            var self = this;

            app.cache.Cache.get(template, function(data) {

                // environment

                var environment = new app.models.Environment(self.model.get('environment'));
                var waterDensity = new app.units.Unit(environment.get('density')).as('kg/m^3');
                console.log('water density: ' + waterDensity.value());

                // water type

                var waterType = (environment.toJSON().water == 'freshwater') ? 'FRESH' : 'SEA';
                console.log('water type: ' + waterType);

                // diver

                var diver = new app.models.Diver(self.model.get('diver'));

                // suits and cylinders

                var suits = [];
                var cylinders = [];
                var cylinderSolids = [];
                var gears = self.model.get('gears');
                for (var i = 0 ; i < gears.length ; i++) {
                    var gear = app.models.GearFactory.build(gears[i], diver.toJSON());
                    var type = gear.toJSON().type;
                    var category = gear.toJSON().category;
                    if (category === 'SUIT') {
                        suits.push(gear);
                    }
                    if (category === 'CYLINDER') {
                        cylinders.push(gear);
                        var cylinderSolid = new org.wildbits.hydro.Solid(gear.volume().value(), gear.mass().value());
                        cylinderSolids.push(cylinderSolid);
                    }
                }
                var cylindersComposite = new org.wildbits.hydro.Composite(cylinderSolids);
                var cylindersBuoyancy = cylindersComposite.buoyancy(waterDensity.value());
                console.log('cylinders buoyancy: ' + cylindersBuoyancy);

                // body weight

                var bodyWeight = new app.units.Unit(diver.toJSON().weight);
                console.log('body weight: ' + bodyWeight.value());

                // fat ratio

                var fatRatio = diver.toJSON().fatRatio.value;
                console.log('fatRatio: ' + fatRatio);

                // suit type (default to skin)

                var suitType = (suits.length == 0) ? 'SWIMSUIT' : suits[0].toJSON().type ;
                self.model.set('suitType', suitType);

                // weight to add

                var weight = app.guidelines.PadiBasic.estimateWeight(waterType, suitType, bodyWeight.as('kg').value(), fatRatio, diver.toJSON().gender, cylindersBuoyancy);

                self.model.set('weight', weight);

                self.$el.html(_.template(data)({
                    json: self.model.toJSON(),
                    config: self.config
                }));

                // environment

                self.$el.find('.table-view .environment').after(
                    new app.views.EnvironmentResultView({
                        model: environment,
                        config: self.config
                    }).render().$el);

            });
            return this;
        }

    });

})();