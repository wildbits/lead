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


    module("app.math.Range", {});

    test("constructor and accessor", 4, function(assert) {
        var r1 = new app.math.Range(0.5, 1.5);
        equal(r1.max(), 1.5);
        equal(r1.min(), 0.5);
        var r2 = new app.math.Range(0.0, 0.0);
        equal(r2.max(), 0.0);
        equal(r2.min(), 0.0);
    });

    test("wrong constructors", 2, function(assert) {
        assert.throws( function () { new app.math.Range(1,'not-a-number'); } );
        assert.throws( function () { new app.math.Range(10,1); } );
    });

    test("addition", 4, function(assert) {
        var r1 = new app.math.Range(10, 20);
        var r2 = r1.add(0);
        equal(r1.max(), r2.max());
        equal(r1.min(), r2.min());
        var r3 = r1.add(10);
        equal(r1.min() + 10, r3.min());
        equal(r1.max() + 10, r3.max());
    });

    test("multiplication", 4, function(assert) {
        var r1 = new app.math.Range(10, 20);
        var r2 = r1.mul(1);
        equal(r1.max(), r2.max());
        equal(r1.min(), r2.min());
        var r3 = r1.mul(10);
        equal(r1.min() * 10, r3.min());
        equal(r1.max() * 10, r3.max());
    });

    test("mean", 1, function(assert) {
        var r1 = new app.math.Range(10, 20);
        equal(r1.mean(), 15);
    });

})();