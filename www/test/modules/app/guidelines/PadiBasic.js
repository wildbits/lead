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

    var EPSILON = 0.1;

    var compareFloats = function (f1, f2) {
        return Math.abs(f2 - f1) < EPSILON;
    };

    test("PADI example 1", 4, function(assert) {

        var estimateInSeaWater = app.guidelines.PadiBasic.estimateWeight('SEA', 'MEDIUM_WET_SUIT', 70, 0.20590641524, 'male', 2);
        var weightInSeaWater = estimateInSeaWater.total;
        equal(true, compareFloats(weightInSeaWater.min(), weightInSeaWater.max()));
        equal(true, compareFloats(weightInSeaWater.min(), 9));

        var estimateInFreshWater = app.guidelines.PadiBasic.estimateWeight('FRESH', 'MEDIUM_WET_SUIT', 70, 0.20590641524, 'male', 2);
        var weightInFreshWater = estimateInFreshWater.total;
        equal(true, compareFloats(weightInFreshWater.min(), weightInFreshWater.max()));
        equal(true, compareFloats(weightInFreshWater.min(), 6.4));

    });

    test("PADI example 2", 2, function(assert) {

        var estimateInSeaWater = app.guidelines.PadiBasic.estimateWeight('SEA', 'SWIMSUIT', 85, 0.2558, 'male', 0);
        var weightInSeaWater = estimateInSeaWater.total;
        equal(true, compareFloats(weightInSeaWater.max(), weightInSeaWater.max()));
        equal(true, compareFloats(weightInSeaWater.max(), 2.5));

    });

    test("PADI example 3", 4, function(assert) {

        var estimateInSeaWater = app.guidelines.PadiBasic.estimateWeight('SEA', 'SHELL_DRY_SUIT_HEAVY', 50, 0.20590641524, 'male', 2);
        var weightInSeaWater = estimateInSeaWater.total;
        notEqual(true, compareFloats(weightInSeaWater.min(), weightInSeaWater.max()));
        equal(true, compareFloats(weightInSeaWater.mean(), 12));

        var estimateInFreshWater = app.guidelines.PadiBasic.estimateWeight('FRESH', 'SHELL_DRY_SUIT_HEAVY', 50, 0.20590641524, 'male', 2);
        var weightInFreshWater = estimateInFreshWater.total;
        notEqual(true, compareFloats(weightInFreshWater.min(), weightInFreshWater.max()));
        equal(true, compareFloats(weightInFreshWater.mean(), 10));
    });

    test("illegal parameters", 3, function(assert) {
        assert.throws( function () { app.guidelines.PadiBasic.estimateWeight('UNKNOWN', 'SHELL_DRY_SUIT_HEAVY', 50, 0.20590641524, 'male', 2); } );
        assert.throws( function () { app.guidelines.PadiBasic.estimateWeight('FRESH', 'UNKNOWN', 50, 0.20590641524, 'male', 2); } );
        assert.throws( function () { app.guidelines.PadiBasic.estimateWeight('FRESH', 'SWIMSUIT', 50, 'UNKNOWN', 'male', 2); } );
    });


})();