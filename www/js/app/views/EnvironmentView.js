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

/*
 * TODO Fetch the temperature for the given month and location and suggest for config.
 */
app.views.EnvironmentView = (function () {

    var template = 'templates/EnvironmentView.html';

    app.cache.Cache.get(template);

    return app.views.BaseView.extend({

        tagName: 'div',

        className: 'main-view',

        events: {
            'click .save-environment': 'saveEnvironment',
            'change .select-month': 'monthChanged',
            'change .select-water': 'waterChanged',
            'click .btn-locate': 'locate'
        },

        initialize: function (options) {
            app.views.BaseView.prototype.initialize.apply(this, arguments);
            this.map = undefined;
        },

        render: function () {

            var self = this;

            app.cache.Cache.get(template, function(data) {

                var environment = new app.models.Environment(self.model.get('environment'));

                self.$el.html(_.template(data)({
                    json: environment.toJSON(),
                    config: self.config
                }));

                // temperature

                self.$el.find('.water-temperature').after(new app.views.OptionView({
                    model: new app.models.Option({
                        name: 'temperature',
                        data: environment.get('temperature'),
                        default: {value: 299.15},
                        values: (function () {
                            var values = [];
                            for (var i = 276.15 ; i < 308.15 ; i+=1) {
                                values.push({value: i, unit: 'K'});
                            }
                            return values;
                        })()
                    }),
                    config: self.config
                }).render(2).$el);

                // water

                var water = environment.get('water');

                self.$el.find('.water-salinity').after(new app.views.OptionView({
                    model: new app.models.Option({
                        name: 'water',
                        data: water,
                        default: 'specificSeawater',
                        values: ['seawater','specificSeawater','freshwater']
                    }),
                    config: self.config
                }).render().$el);

                // month of year

                var months = ['january', 'february','march','april','may','june','july','august','september','october',
                    'november','december'];
                var currentMonth = new Date().getMonth();

                self.$el.find('.month-of-year').after(new app.views.OptionView({
                    model: new app.models.Option({
                        name: 'month',
                        data: environment.get('month'),
                        default: months[currentMonth],
                        values: months
                    }),
                    config: self.config
                }).render(0).$el);

                // map

                var month = self.$el.find('.select-month').val();

                if (! self.map) {

                    setTimeout(function () {

                        var $map = self.$el.find('#map');

                        self.map = new app.views.Map($map.get(0));
                        self.map.setMonth(month);

                        self.map.on('move', function (e) {
                            if (self.$el.find('.select-water').val() == 'specificSeawater') {
                                var latLng = e.latlng;
                                self.updateCoordinates(latLng);
                                self.updateSalinity(latLng);
                            }
                        });

                        if (self.$el.find('.select-water').val() == 'specificSeawater') {

                            // coordinates

                            var latitude = environment.get('latitude');
                            var longitude = environment.get('longitude');

                            if (latitude && longitude) {
                                self.map.setView(latitude, longitude);
                            } else {
                                self.showMap();
                                self.disableSaveBtn();
                                self.map.locate();
                            }
                        } else {
                            self.hideMessage();
                            self.enableSaveBtn();
                            self.hideMap();
                        }

                    }, 0);
                }


                // footer

                self.$el.append(new app.views.ConfigView({
                    model: self.config
                }).render().$el);

            });
            return this;
        },

        saveEnvironment: function () {

            var environment = new app.models.Environment(this.model.get('environment'));

            var $dataForm = this.$el.find('.data-form');

            // water

            var water = $dataForm.find('select[name=water]').val();
            environment.set('water', water);

            // temperature

            var temperature = $dataForm.find('select[name=temperature]').val();
            environment.set('temperature', {value: temperature, unit: 'K'});

            // specific salinity

            if (water == 'specificSeawater') {

                // location

                var markerLoc = this.map.getMarkerCenter();
                environment.set('latitude', markerLoc.lat);
                environment.set('longitude', markerLoc.lng);

                // salinity

                if (this.salinity) {
                    environment.set('salinity', this.salinity.as('kg/kg').obj());
                }

            }

            var updated = new app.models.Environment(environment.toJSON());
            this.model.set('environment', updated.toJSON());

            this.model.save();

            var hash = 'plans/' +  this.model.id + '/result';
            app.router.navigate(hash, {trigger: true});
        },

        salinity: undefined,

        updateSalinity: function (latLng) {

            var self = this;

            this.disableSaveBtn();
            this.hideDensity();
            this.hideMessage();
            this.salinity = undefined;

            this.map.getSalinity(latLng, function (salinity) {

                if (salinity && salinity.value) {

                    self.salinity = new app.units.Unit({
                        value: salinity.value,
                        unit: 'g/kg'                      // salinity in g/kg in poodac
                    }).as('kg/kg');

                    self.hideMessage();
                    self.showDensity(self.salinity);
                    self.enableSaveBtn();

                } else {

                    if (self.$el.find('.select-water').val() == 'specificSeawater') {
                        self.disableSaveBtn();
                    } else {
                        self.enableSaveBtn();
                    }
                    var msg = salinity ? 'Salinity undefined, please select a location on the colored overlay.' : 'Failed to access Open Data server, please try again later.';
                    self.displayMessage('negative', msg);
                    self.hideDensity();
                    self.salinity = undefined;

                }
            });
        },

        updateCoordinates: function (latLng) {

            var latFeature = new app.views.FeatureView({
                model: new app.models.Feature({feature: 'latitude', value: 'Lat. ' + latLng.lat.toFixed(3)}),
                config: this.config
            });

            var lngFeature = new app.views.FeatureView({
                model: new app.models.Feature({feature: 'longitude', value: 'Long. ' + latLng.lng.toFixed(3)}),
                config: this.config
            });

            var $features = this.$el.find('.map-features');

            $features.find('.latitude').html(latFeature.render().$el);
            $features.find('.longitude').html(lngFeature.render().$el);
        },

        showMap: function () {
            this.$el.find('.card-water-specific').show();
        },

        hideMap: function () {
            this.$el.find('.card-water-specific').hide();
        },

        disableSaveBtn: function () {
            this.$el.find('.save-environment').addClass("disabled");
        },

        enableSaveBtn: function () {
            this.$el.find('.save-environment').removeClass("disabled");
        },

        showDensity: function (salinity) {

            var $salinity = this.$el.find('.salinity');

            var self = this;

            $salinity.html(new app.views.FeatureView({

                model: new app.models.Feature({
                    feature: 'mass-fraction',
                    value: salinity.obj()
                }),
                config: self.config

            }).render(4).$el);

            $salinity.show();
        },

        hideDensity: function () {
            this.$el.find('.salinity').hide();
        },

        monthChanged: function (e) {
            var $select = $(e.target);
            var month = $select.val();
            this.map.setMonth(month);
            var latLng = this.map.getMarkerCenter();
            this.updateSalinity(latLng);
        },

        displayMessage: function (clazz, message) {
            var $output = this.$el.find('.output-message');
            $output.html($("<span>").attr('class', 'badge badge-' + clazz).append(message));
            this.$el.find('.output-message').show();
        },

        hideMessage: function () {
            this.$el.find('.output-message').hide();
        },

        waterChanged: function (e) {
            var $select = $(e.target);
            var water = $select.val();
            if (water == 'specificSeawater') {
                if (this.salinity) {
                    this.enableSaveBtn();
                } else {
                    this.disableSaveBtn();
                }
                this.showMap();
            } else {
                this.enableSaveBtn();
                this.hideMap();
            }
        },

        locate: function (e) {
            this.map.locate();
        },

        unbind: function () {
            if (this.map) {
                this.map.unRegister();
            }
        }

    });

})();