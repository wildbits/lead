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
(function() {


    module("app.units.Unit", {});

    test("wrong constructors", 5, function(assert) {
        assert.throws( function () { new app.units.Unit(1,'unsupported'); } );
        assert.throws( function () { new app.units.Unit(1); } );
        assert.throws( function () { new app.units.Unit({value: 1}); } );
        assert.throws( function () { new app.units.Unit({unit: 'm'}); } );
        assert.throws( function () { new app.units.Unit({value: 1, unit: 'unsupported'}); } );
    });

    test("number coercion", 1, function(assert) {
        var u1 = new app.units.Unit('4', 'm');
        equal(u1.value(), 4);
    });

    test("zero value", 1, function(assert) {
        var u1 = new app.units.Unit(0, 'm');
        equal(u1.value(), 0);
    });

    test("constructors", 3, function() {
        var u1 = new app.units.Unit(1, 'm');
        var u2 = new app.units.Unit({value: 1, unit: 'm'});
        equal(u1.value(), u2.value());
        equal(u1.unit(), u2.unit());
        equal(u1.format(), u2.format());
    });

    test("obj", 2, function() {
        var u = new app.units.Unit(1, 'm');
        var obj = u.obj();
        equal(obj.value, u.value());
        equal(obj.unit, u.unit());
    });

    test("length", 6, function() {
        var l1 = new app.units.Unit(1, 'm');
        equal(l1.format(), '1 m');
        equal(l1.value(), 1);
        equal(l1.as('m').format(), '1 m');
        equal(l1.as('ft').as('m').format(), '1 m');
        equal(l1.as('ft').format(), '3.28 ft');
        equal(new app.units.Unit(3.28, 'ft').as('m').format(), '1.00 m');
    });

    test("pressure", 5, function() {
        var p = new app.units.Unit(100000, 'Pa');
        equal(p.format(), '100000 Pa');
        equal(p.as('bar').format(), '1 bar');
        equal(new app.units.Unit(1, 'bar').as('Pa').format(), '100000 Pa');
        equal(p.as('psi').format(), '14.50 psi');
        equal(new app.units.Unit(14.5037738, 'psi').as('Pa').format(), '100000.00 Pa');
    });

    test("volume", 5, function() {
        var p = new app.units.Unit(1, 'm^3');
        equal(p.format(), '1 m^3');
        equal(p.as('l').format(), '1000 l');
        equal(new app.units.Unit(1000, 'l').as('m^3').format(), '1 m^3');
        equal(p.as('cuft').format(), '35.31 cuft');
        equal(new app.units.Unit(35.3146667, 'cuft').as('m^3').format(), '1 m^3');
    });

    test("temperature", 6, function() {
        var p = new app.units.Unit(300, 'K');
        equal(p.format(), '300 K');
        equal(p.as('°C').format(), '26.85 °C');
        equal(new app.units.Unit(26.85, '°C').as('K').format(), '300 K');
        equal(p.as('°F').format(), '80.33 °F');
        equal(new app.units.Unit(80.33, '°F').as('K').format(), '300 K');
        equal(new app.units.Unit(20, '°C').as('°F').format(), '68.00 °F');
    });

    test("mass", 5, function() {
        var p = new app.units.Unit(1000, 'g');
        equal(p.format(), '1000 g');
        equal(p.as('kg').format(), '1 kg');
        equal(new app.units.Unit(1, 'kg').as('g').format(), '1000 g');
        equal(p.as('lb').format(), '2.20 lb');
        equal(new app.units.Unit(2.20462, 'lb').as('g').format(), '1000.00 g');
    });

    test("density", 7, function() {
        var p = new app.units.Unit(1000, 'g/m^3');
        equal(p.format(), '1000 g/m^3');
        equal(p.as('kg/m^3').format(), '1 kg/m^3');
        equal(new app.units.Unit(1, 'kg/m^3').as('g/m^3').format(), '1000 g/m^3');
        equal(p.as('kg/l').format(3), '0.001 kg/l');
        equal(new app.units.Unit(0.001, 'kg/l').as('g/m^3').format(), '1000 g/m^3');
        equal(p.as('lb/cuft').format(3), '0.062 lb/cuft');
        equal(new app.units.Unit(0.0624279606, 'lb/cuft').as('g/m^3').format(), '1000.00 g/m^3');
    });

})();