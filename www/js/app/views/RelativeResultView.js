/**
 * Copyright 2014 wildbits org
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

app.views.RelativeResultView = (function () {

    var template = 'templates/RelativeResultView.html';

    app.cache.Cache.get(template);

    /**
     * Compute the diver volume such that the buoyancy of the plan is 0.
     * The diver weight is required.
     */
    var computeDiver = function (model) {

        var diver = new app.models.Diver(model.get('diver'));

        // environment

        var environment = new app.models.Environment(model.get('environment'));
        var waterDensity = new app.units.Unit(environment.get('density')).as('kg/m^3');

        // gears

        var gears = [];

        _.each(model.get('gears'), function (g) {
            var gear = app.models.GearFactory.build(g, diver.toJSON());
            gears.push(new org.wildbits.hydro.Solid(
                new app.units.Unit(gear.get('volume')).as('m^3').value(),
                new app.units.Unit(gear.get('mass')).as('kg').value()));
        });

        // diver

        var gearsComposite = new org.wildbits.hydro.Composite(gears);
        var gearsBuoyancy = gearsComposite.buoyancy(waterDensity.value());


        var diverWeight = new app.units.Unit(diver.get('weight')).as('kg').value();

        // planBuoyancy = diverBuoyancy + gearsBuoyancy = 0 ;
        var diverBuoyancy = - gearsBuoyancy;

        var diverApparentWeight = - diverBuoyancy;

        var diverDisplacedWaterWeight = diverWeight - diverApparentWeight;

        var diverDensity = waterDensity.value() * diverWeight / diverDisplacedWaterWeight;

        var diverVolume = diverWeight / diverDensity;

        var diverSolid = new org.wildbits.hydro.Solid(diverVolume, diverWeight);

        diver.set('volume', {
            value: diverVolume,
            unit: 'm^3'
        });

        diver.set('density', {
            value: diverDensity,
            unit: 'kg/m^3'
        });

        diver.set('buoyancy', {
            value: diverSolid.buoyancy(waterDensity.value()),
            unit: 'kg'
        });

        return {
            diverSolid: diverSolid,
            diver: diver
        };
    };

    var setDiver = function (model, computedDiver) {
        model.set('diver', computedDiver.diver.toJSON());
        return model;
    };

    var computePlan = function (model) {

        var plan = [];

        // environment

        var environment = new app.models.Environment(model.get('environment'));
        var waterDensity = new app.units.Unit(environment.get('density')).as('kg/m^3');

        // diver

        var diver = new app.models.Diver(model.get('diver'));

        var diverSolid = new org.wildbits.hydro.Solid(diver.volume().value(), diver.mass().value());
        plan.push(diverSolid);
        diver.set('buoyancy', {
            value: diverSolid.buoyancy(waterDensity.value()),
            unit: 'kg'
        });

        // gears

        var gearSolids = [];

        var gears = model.get('gears');
        for (var i = 0 ; i < gears.length ; i++) {
            var gear = app.models.GearFactory.build(gears[i], diver.toJSON());
            var gearSolid = new org.wildbits.hydro.Solid(gear.volume().value(), gear.mass().value());
            plan.push(gearSolid);
            gearSolids.push(gearSolid);
            gear.set('buoyancy', {
                value: gearSolid.buoyancy(waterDensity.value()),
                unit: 'kg'
            });
            gears[i] = new app.models.Gear(gear.toJSON());
        }

        var gearsComposite = new org.wildbits.hydro.Composite(gearSolids);
        model.set('gearsBuoyancy', {
            value: gearsComposite.buoyancy(waterDensity.value()),
            unit: 'kg'
        });

        // plan

        var finalComposite = new org.wildbits.hydro.Composite(plan);
        var buoyancy = finalComposite.buoyancy(waterDensity.value());
        model.set('buoyancy', {
            value: buoyancy,
            unit: 'kg'
        });

        return {
            model: model,
            environment: environment,
            gears: gears,
            buoyancy: buoyancy,
            diver: diver
        };
    };

    var updateView = function ($el, computedPlan, config) {

        // environment

        $el.find('.environment').after(
            new app.views.EnvironmentResultView({
                model: computedPlan.environment,
                config: config
            }).render().$el);

        $el.find('.diver').after(
            new app.views.DiverResultView({
                model: computedPlan.diver,
                config: config
            }).render().$el);

        // gears summary

        $el.find('.gears').after(
            new app.views.GearsSummaryResultView({
                model: computedPlan.model,
                config: config
            }).render().$el);

        // gears

        var $gearsDetails = $el.find('.gears-details');
        _.each(computedPlan.gears, function (gear) {
            $gearsDetails.after(
                new app.views.GearResultView({
                    model: gear,
                    config: config
                }).render().$el
            );
        });

    };

    return app.views.BaseView.extend({

        tagName: 'div',

        className: 'main-view',

        events: {
            'click .bar-nav .icon-left-nav': 'back'
        },

        initialize: function (options) {
            app.views.BaseView.prototype.initialize.apply(this, arguments);
            this.compModel = options.compModel;
        },

        render: function () {

            var self = this;

            app.cache.Cache.get(template, function(data) {

                var diverComputed = computeDiver(self.model);

                setDiver(self.model, diverComputed);
                setDiver(self.compModel, diverComputed);

                // buoyancy for the reference plan must be equal to 0.
                var referenceComputed = computePlan(self.model);

                var plannedComputed = computePlan(self.compModel);

                // planned.buoyancy - reference.buoyancy ;
                var deltaBuoyancy = plannedComputed.buoyancy - referenceComputed.buoyancy;

                self.$el.html(_.template(data)({
                    json: {
                        deltaBuoyancy: {
                            value: deltaBuoyancy,
                            unit: 'kg'
                        },
                        reference: self.model.toJSON(),
                        planned: self.compModel.toJSON()
                    },
                    config: self.config
                }));

                updateView(self.$el.find('.table-view.reference'), referenceComputed, self.config);
                updateView(self.$el.find('.table-view.planned'), plannedComputed, self.config);

                // Buoyancy

                self.$el.find('.table-view.buoyancy').append(
                    new app.views.BuoyancyResultView({
                        model: self.compModel,
                        config: self.config
                    }).render().$el);

                // footer

                self.$el.append(new app.views.ConfigView({
                    model: self.config
                }).render().$el);

            });
            return this;
        },

        back: function () {
            Backbone.history.history.back();
        }

    });

})();