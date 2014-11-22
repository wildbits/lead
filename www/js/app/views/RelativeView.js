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

app.views.RelativeView = (function () {

    var template = 'templates/RelativeView.html';

    app.cache.Cache.get(template);

    return app.views.BaseView.extend({

        tagName: 'div',

        className: 'main-view',

        events: {
            'click .btn-compute': 'compute',
            'click .bar-nav .icon-left-nav': 'back'
        },

        initialize: function (options) {
            app.views.BaseView.prototype.initialize.apply(this, arguments);

            this.compModel = options.compModel;

            var refOptions = {
                model: this.model,
                config: options.config
            };

            var compOptions = {
                model: this.compModel,
                config: options.config
            };

            this.reference = {
                gears: new app.views.GearsLinkView(refOptions),
                env: new app.views.EnvironmentLinkView(refOptions)
            };

            this.compared = {
                gears: new app.views.GearsLinkView(compOptions),
                env: new app.views.EnvironmentLinkView(compOptions)
            };

            this.diverLink = new app.views.DiverLinkView(options);
        },

        render: function () {

            var self = this;

            app.cache.Cache.get(template, function(data) {

                self.$el.html(_.template(data)({
                    json: {
                        reference: self.model.toJSON(),
                        compared: self.compModel.toJSON()
                    },
                    config: self.config
                }));

                var $reference = self.$el.find('.reference');
                var $planned = self.$el.find('.planned');

                // diver

                var $diver = self.$el.find('.diver');
                self.diverLink.render();
                $diver.after(self.diverLink.$el);

                // reference

                self.reference.env.render();
                $reference.after(self.reference.env.$el);
                self.reference.gears.render();
                $reference.after(self.reference.gears.$el);


                // plan

                self.compared.env.render();
                $planned.after(self.compared.env.$el);
                self.compared.gears.render();
                $planned.after(self.compared.gears.$el);

                // footer

                self.$el.append(new app.views.ConfigView({
                    model: self.config
                }).render().$el);

            });

            return this;
        },

        compute: function (e) {
            var hash = 'plans/' + this.model.id + '/' +  this.compModel.id + '/result';
            app.router.navigate(hash, {trigger: true});
        },

        back: function () {
            Backbone.history.history.back();
        }

    });

})();