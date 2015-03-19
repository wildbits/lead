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

app.views.StoreCategoryView = (function () {

    var template = 'templates/StoreCategoryView.html';

    app.cache.Cache.get(template);

    return app.views.BaseView.extend({

        tagName: 'div',

        className: 'main-view',

        events: {
            //'click .bar-nav .icon-left-nav': 'back',
            'click .add-gear': 'add'
        },

        initialize: function (options) {
            app.views.BaseView.prototype.initialize.apply(this, arguments);
        },

        render: function () {

            var self = this;

            app.cache.Cache.get(template, function(data) {

                self.$el.html(_.template(data)({}));

                var $gearsList = self.$el.find('.gears-list');

                _.each(self.collection, function (gear) {
                    var gv = new app.views.GearLinkView({
                        model: gear,
                        mode: 'add',
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

        add: function(e) {
            e.preventDefault();
            var $btn = $(e.currentTarget);
            var gearId = $btn.attr('id');
            var gear = _.find(this.collection, function (gear) {
                return (gear.id == gearId);
            });
            var json = gear.toJSON();
            json.id = app.ids.Ids.next();
            this.model.get('gears').push(json);
            this.model.save();

            //Backbone.history.history.go(-2);

            var hash = 'plans/' +  this.model.id + '/gears';
            app.router.navigate(hash, {trigger: true});

        }/*,

        back: function () {
            Backbone.history.history.back();
        }
        */

    });

})();