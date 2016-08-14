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

app.views.AbsoluteResultView = (function () {

    var template = 'templates/AbsoluteResultView.html';

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

                // compute the plan

                var plan = [];

                // environment

                var environment = new app.models.Environment(self.model.get('environment'));
                var waterDensity = new app.units.Unit(environment.get('density')).as('kg/m^3');

                // diver

                var diver = new app.models.Diver(self.model.get('diver'));

                var diverSolid = new org.wildbits.hydro.Solid(diver.volume().value(), diver.mass().value());
                plan.push(diverSolid);
                diver.set('buoyancy', {
                    value: diverSolid.buoyancy(waterDensity.value()),
                    unit: 'kg'
                });

                // gears

                var gearSolids = [];
                var totalGasMass = 0;
                var hasCylinder = false;

                var gears = self.model.get('gears');
                for (var i = 0 ; i < gears.length ; i++) {
                    var gear = app.models.GearFactory.build(gears[i], diver.toJSON());
                    var gearSolid = new org.wildbits.hydro.Solid(gear.volume().value(), gear.mass().value());
                    plan.push(gearSolid);
                    gearSolids.push(gearSolid);
                    gear.set('buoyancy', {
                        value: gearSolid.buoyancy(waterDensity.value()),
                        unit: 'kg'
                    });
                    var json = gear.toJSON();
                    gears[i] = new app.models.Gear(json);
                    if (json.category === 'CYLINDER' && json.gasMass) {
                        hasCylinder = true;
                        totalGasMass += new app.units.Unit(json.gasMass).as('kg').value();
                    }
                }

                var gearsComposite = new org.wildbits.hydro.Composite(gearSolids);
                self.model.set('gearsBuoyancy', {
                    value: gearsComposite.buoyancy(waterDensity.value()),
                    unit: 'kg'
                });

                // plan

                var finalComposite = new org.wildbits.hydro.Composite(plan);
                var buoyancy = finalComposite.buoyancy(waterDensity.value());
                self.model.set('buoyancy', {
                    value: buoyancy,
                    unit: 'kg'
                });

                self.model.set('totalGasMass', {
                    value: totalGasMass,
                    unit: 'kg'
                });

                self.model.set('hasCylinder', hasCylinder);

                self.$el.html(_.template(data)({
                    json: self.model.toJSON(),
                    config: self.config
                }));

                // Buoyancy

                self.$el.find('.table-view .results').after(
                    new app.views.BuoyancyResultView({
                        model: self.model,
                        config: self.config
                    }).render().$el);


                // environment

                self.$el.find('.table-view .environment').after(
                    new app.views.EnvironmentResultView({
                        model: environment,
                        config: self.config
                    }).render().$el);

                // diver

                self.$el.find('.table-view .diver').after(
                    new app.views.DiverResultView({
                        model: diver,
                        config: self.config
                    }).render().$el);



                // gears

                var $gearsDetails = self.$el.find('.gears-details');
                _.each(gears, function (gear) {
                    $gearsDetails.after(
                        new app.views.GearResultView({
                            model: gear,
                            config: self.config
                        }).render().$el
                    );
                });
            });
            return this;
        }

    });

})();