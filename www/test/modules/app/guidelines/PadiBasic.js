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
(function() {

    module("app.guidelines.PadiBasic", {});

    test("PADI example 1", 4, function(assert) {

        var estimateInSeaWater = app.guidelines.PadiBasic.estimateWeight('SEA', 'MEDIUM_WET_SUIT', 70, 'FIT', 2);
        var weightInSeaWater = estimateInSeaWater.total;
        equal(weightInSeaWater.min(), weightInSeaWater.max());
        equal(weightInSeaWater.min(), 9);

        var estimateInFreshWater = app.guidelines.PadiBasic.estimateWeight('FRESH', 'MEDIUM_WET_SUIT', 70, 'FIT', 2);
        var weightInFreshWater = estimateInFreshWater.total;
        equal(weightInFreshWater.min(), weightInFreshWater.max());
        equal(weightInFreshWater.min(), 6.7);

    });

    test("PADI example 2", 2, function(assert) {

        var estimateInSeaWater = app.guidelines.PadiBasic.estimateWeight('SEA', 'SWIMSUIT', 85, 'AVERAGE', 0);
        var weightInSeaWater = estimateInSeaWater.total;
        equal(weightInSeaWater.max(), weightInSeaWater.max());
        equal(weightInSeaWater.max(), 2.5);

    });

    test("PADI example 3", 4, function(assert) {

        var estimateInSeaWater = app.guidelines.PadiBasic.estimateWeight('SEA', 'SHELL_DRY_SUIT_HEAVY', 50, 'FIT', 2);
        var weightInSeaWater = estimateInSeaWater.total;
        notEqual(weightInSeaWater.min(), weightInSeaWater.max());
        equal(weightInSeaWater.mean(), 12);

        var estimateInFreshWater = app.guidelines.PadiBasic.estimateWeight('FRESH', 'SHELL_DRY_SUIT_HEAVY', 50, 'FIT', 2);
        var weightInFreshWater = estimateInFreshWater.total;
        notEqual(weightInFreshWater.min(), weightInFreshWater.max());
        equal(weightInFreshWater.mean(), 10);
    });

    test("illegal parameters", 3, function(assert) {
        assert.throws( function () { app.guidelines.PadiBasic.estimateWeight('UNKNOWN', 'SHELL_DRY_SUIT_HEAVY', 50, 'FIT', 2); } );
        assert.throws( function () { app.guidelines.PadiBasic.estimateWeight('FRESH', 'UNKNOWN', 50, 'FIT', 2); } );
        assert.throws( function () { app.guidelines.PadiBasic.estimateWeight('FRESH', 'SWIMSUIT', 50, 'UNKNOWN', 2); } );
    });

    test("undefined guideline value", 1, function(assert) {
        var estimateInSeaWater = app.guidelines.PadiBasic.estimateWeight('FRESH', 'SHELL_DRY_SUIT_HEAVY', 30, 'FIT', 2);
        equal(estimateInSeaWater, undefined);
    });


})();