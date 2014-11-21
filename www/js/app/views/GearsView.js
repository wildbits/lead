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

app.views.GearsView = (function () {

    var template = 'templates/GearsView.html';

    app.cache.Cache.get(template);

    return app.views.BaseView.extend({

        tagName: 'div',

        className: 'main-view',

        events: {
            'click .bar-nav .icon-left-nav': 'back',
            'click .add-gears': 'addGear',
            'click .remove-gear': 'removeGear'
        },

        initialize: function (options) {
            app.views.BaseView.prototype.initialize.apply(this, arguments);
            this.model.on('sync', this.render, this);
        },

        render: function () {

            var self = this;

            app.cache.Cache.get(template, function(data) {

                self.$el.html(_.template(data)(self.model.toJSON()));

                var gears = self.model.get('gears');

                var $gearsList = self.$el.find('.selected-gears-view');

                _.each(gears, function (gear) {
                    var gv = new app.views.GearLinkView({
                        model: new app.models.Gear(gear),
                        mode: 'remove',
                        config: self.config
                    });
                    gv.render();
                    $gearsList.append(gv.$el);
                });

                // footer

                self.$el.append(new app.views.ConfigView({
                    model: self.config
                }).render().$el);

            });

            return this;
        },

        back: function () {
            Backbone.history.history.back();
        },

        addGear: function (e) {
            e.preventDefault();
            var hash = 'plans/' +  this.model.id + '/gears/store';
            app.router.navigate(hash, {trigger: true});
        },

        removeGear: function (e) {
            var $btn = $(e.currentTarget);
            var id = $btn.attr('id');
            var gears = _.filter(this.model.get('gears'), function (gear) {
                return gear.id != id;
            });
            this.model.set('gears', gears);
            this.model.save();
        }

    });

})();