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

app.views.AbsoluteView = (function () {

    var template = 'templates/AbsoluteView.html';

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
            this.diverLink = new app.views.DiverLinkView(options);
            this.gearsLink = new app.views.GearsLinkView(options);
            this.environmentLink = new app.views.EnvironmentLinkView(options);
        },

        render: function () {

            var self = this;

            app.cache.Cache.get(template, function(data) {

                self.$el.html(_.template(data)(self.model.toJSON()));
                var $links = self.$el.find('.main .table-view');

                // diver

                self.diverLink.render();
                $links.append(self.diverLink.$el);

                // gears

                self.gearsLink.render();
                $links.append(self.gearsLink.$el);

                // environment

                self.environmentLink.render();
                $links.append(self.environmentLink.$el);

                // footer

                self.$el.append(new app.views.ConfigView({
                    model: self.config
                }).render().$el);

            });

            return this;
        },

        compute: function (e) {
            var hash = 'plans/' +  this.model.id + '/result';
            app.router.navigate(hash, {trigger: true});
        },

        back: function () {
            Backbone.history.history.back();
        }

    });

})();