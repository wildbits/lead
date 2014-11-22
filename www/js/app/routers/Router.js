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
app.routers = app.routers || {};

app.routers.Router = Backbone.Router.extend({

    initialize: function (slider) {
        this.currentView = false;
        this.slider = slider;
        this.history = [];
    },

    routes: {
        ''                                        : 'license',
        'modes'                                   : 'modes',
        'modes/absolute/:id'                      : 'modeAbsolute',
        'modes/relative/:id/:id'                  : 'modeRelative',
        'plans/:id/result'                        : 'planAbsoluteResult',
        'plans/:id/:id/result'                    : 'planRelativeResult',
        'plans/:id/diver'                         : 'planDiver',
        'plans/:id/gears'                         : 'planGears',
        'plans/:id/gears/store'                   : 'planStore',
        'plans/:id/gears/store/:id'               : 'planStoreCategory',
        'plans/:id/environment'                   : 'planEnvironment'
    },

    showView: function(view) {
        var current = this.currentView;
        var cleanup = function () {
            if (current) {
                current.close();
            }
        };
        var currentHash = window.location.hash;
        var index = _.indexOf(this.history, currentHash);
        if (index > -1) {
            this.history = this.history.slice(0, index + 1);
            this.slider.left(view.render().$el, cleanup);
        } else {
            this.history.push(currentHash);
            this.slider.right(view.render().$el, cleanup);
        }
        this.currentView = view;
    },

    modes: function () {
        var self = this;
        new app.models.Config({id: 'config'}).fetch({
            success: function (config) {
                var view = new app.views.ModesView({config: config.toJSON()});
                self.showView(view);
            }
        });

    },

    license: function () {
        var self = this;
        new app.models.Config({id: 'config'}).fetch({
            success: function (config) {
                var view = new app.views.LicenseView({config: config.toJSON()});
                self.showView(view);
            }
        });

    },

    modeAbsolute: function (planId) {
        var self = this;
        new app.models.Plan({id: planId}).fetch({
            success: function (plan) {
                new app.models.Config({id: 'config'}).fetch({
                    success: function (config) {
                        var view = new app.views.AbsoluteView({model: plan, config: config.toJSON()});
                        self.showView(view);
                    }
                });
            }
        });
    },

    modeRelative: function (refPlanId, compPlanId) {
        var self = this;
        new app.models.Plan({id: refPlanId}).fetch({
            success: function (refPlan) {
                new app.models.Plan({id: compPlanId}).fetch({
                    success: function (compPlan) {
                        new app.models.Config({id: 'config'}).fetch({
                            success: function (config) {
                                var view = new app.views.RelativeView({model: refPlan, compModel: compPlan, config: config.toJSON()});
                                self.showView(view);
                            }
                        });
                    }
                });
            }
        });
    },

    planEnvironment: function (planId) {
        var self = this;
        new app.models.Plan({id: planId}).fetch({
            success: function (plan) {
                new app.models.Config({id: 'config'}).fetch({
                    success: function (config) {
                        var view = new app.views.EnvironmentView({model: plan, config: config.toJSON()});
                        self.showView(view);
                    }
                });
            }
        });
    },

    planDiver: function (planId) {
        var self = this;
        new app.models.Plan({id: planId}).fetch({
            success: function (plan) {
                new app.models.Config({id: 'config'}).fetch({
                    success: function (config) {
                        var view = new app.views.DiverView({model: plan, config: config.toJSON()});
                        self.showView(view);
                    }
                });
            }
        });
    },

    planAbsoluteResult: function (planId) {
        var self = this;
        new app.models.Plan({id: planId}).fetch({
            success: function (plan) {
                new app.models.Config({id: 'config'}).fetch({
                    success: function (config) {
                        var view = new app.views.AbsoluteResultView({model: plan, config: config.toJSON()});
                        self.showView(view);
                    }
                });
            }
        });
    },

    planRelativeResult: function (refPlanId, compPlanId) {
        var self = this;
        new app.models.Plan({id: refPlanId}).fetch({
            success: function (refPlan) {
                new app.models.Plan({id: compPlanId}).fetch({
                    success: function (compPlan) {
                        new app.models.Config({id: 'config'}).fetch({
                            success: function (config) {
                                var view = new app.views.RelativeResultView({model: refPlan, compModel: compPlan, config: config.toJSON()});
                                self.showView(view);
                            }
                        });
                    }
                });
            }
        });
    },

    planGears: function (planId) {
        var self = this;
        new app.models.Plan({id: planId}).fetch({
            success: function (plan) {
                new app.models.Config({id: 'config'}).fetch({
                    success: function (config) {
                        var view = new app.views.GearsView({model: plan, config: config.toJSON()});
                        self.showView(view);
                    }
                });
            }
        });
    },

    planStore: function (planId) {
        var self = this;
        new app.models.Plan({id: planId}).fetch({
            success: function (plan) {
                new app.collections.Gears().fetch({
                    success: function (gears) {
                        new app.models.Config({id: 'config'}).fetch({
                            success: function (config) {
                                var view = new app.views.StoreView({collection: gears, model: plan, config: config.toJSON()});
                                self.showView(view);
                            }
                        });
                    }
                });
            }
        });
    },

    planStoreCategory: function (planId, categoryId) {
        var self = this;
        new app.models.Plan({id: planId}).fetch({
            success: function (plan) {
                new app.collections.Gears().fetch({
                    success: function (gears) {
                        new app.models.Config({id: 'config'}).fetch({
                            success: function (config) {
                                var view = new app.views.StoreCategoryView({
                                    collection: gears.models.filter(function (gear) {
                                        return gear.get('category') == categoryId;
                                    }),
                                    model: plan,
                                    config: config.toJSON()
                                });
                                self.showView(view);
                            }
                        });
                    }
                });
            }
        });
    }
});
