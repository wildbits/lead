/**
 * Copyright 2014-2015 wildbits.github.io
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
        'config'                                  : 'config',
        'plans/:id/result'                        : 'resultArchimedes',
        'plans/:id/result-padi'                   : 'resultPadi',
        'plans/:id/diver'                         : 'diver',
        'plans/:id/gears'                         : 'gears',
        'plans/:id/gears/store'                   : 'store',
        'plans/:id/gears/store/:id'               : 'storeCategory',
        'plans/:id/gears/store/:id/create'        : 'createGear',
        'plans/:id/gears/:id/configure'           : 'configureGear',
        'plans/:id/gears/:id/edit'                : 'editGear',
        'plans/:id/environment'                   : 'environment'
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

    environment: function (planId) {
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

    config: function () {
        var self = this;
        new app.models.Config({id: 'config'}).fetch({
            success: function (config) {
                var view = new app.views.ConfigView({model: config.toJSON(), config: config.toJSON()});
                self.showView(view);
            }
        });
    },

    diver: function (planId) {
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

    resultArchimedes: function (planId) {
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

    resultPadi: function (planId) {
        var self = this;
        new app.models.Plan({id: planId}).fetch({
            success: function (plan) {
                new app.models.Config({id: 'config'}).fetch({
                    success: function (config) {
                        var view = new app.views.PadiResultView({model: plan, config: config.toJSON()});
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

    gears: function (planId) {
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

    store: function (planId) {
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

    configureGear: function (planId, gearId) {
        var self = this;
        new app.models.Plan({id: planId}).fetch({
            success: function (plan) {
                new app.models.Config({id: 'config'}).fetch({
                    success: function (config) {
                        new app.models.Gear({id: gearId}).fetch({
                            success: function (gear) {
                                var category = gear.get('category');
                                if (category == 'CYLINDER') {
                                    var view = new app.views.CylinderConfigView({
                                        collection: gear,
                                        model: plan,
                                        config: config.toJSON()
                                    });
                                    self.showView(view);
                                } else {
                                    console.log("can't configure gear " + gearId + " of type " + category);
                                }
                            }
                        });
                    }
                });
            }
        });
    },

    editGear: function (planId, gearId) {

        var self = this;
        new app.models.Plan({id: planId}).fetch({
            success: function (plan) {
                new app.models.Config({id: 'config'}).fetch({
                    success: function (config) {
                        new app.models.Gear({id: gearId}).fetch({
                            success: function (gear) {
                                var view;
                                var category = gear.get('category');
                                if (category == 'CYLINDER') {
                                    view = new app.views.CylinderEditorView({
                                        model: gear,
                                        config: config.toJSON()
                                    });
                                } else {
                                    view = new app.views.GearEditorView({
                                        model: gear,
                                        config: config.toJSON()
                                    });
                                }
                                self.showView(view);
                            }
                        });
                    }
                });
            }
        });
    },

    createGear: function (planId, categoryId) {
        var self = this;
        new app.models.Plan({id: planId}).fetch({
            success: function (plan) {
                new app.models.Config({id: 'config'}).fetch({
                    success: function (config) {
                        var view;
                        if (categoryId == 'CYLINDER') {
                            view = new app.views.CylinderEditorView({
                                model: new app.models.Cylinder({}),
                                config: config.toJSON()
                            });
                        } else {
                            view = new app.views.GearEditorView({
                                model: new app.models.Gear({
                                    category: categoryId
                                }),
                                config: config.toJSON()
                            });
                        }
                        self.showView(view);



                    }
                });
            }
        });
    },

    storeCategory: function (planId, categoryId) {
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
