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
app = app || {};

app.units = (function () {

    var FT_BASE_FACTOR = 3.2808399;

    var BAR_BASE_FACTOR = 100000;

    var PSI_BASE_FACTOR = 6894.75729;

    var LITER_BASE_FACTOR = 1000;

    var CUFT_BASE_FACTOR = 35.3146667;

    var CELSIUS_BASE_DELTA = 273.15;

    var DEFAULT_PRECISION = 2;

    var KG_BASE_FACTOR = 1000;

    var POUND_BASE_FACTOR = 453.592;

    var KGL_BASE_FACTOR = 1000000;

    var LBCUFT_BASE_FACTOR = 16018.4634;

    var id = function (value) {
        return value;
    };

    var multiply = function (factor) {
        return function (value) {
            return value * factor;
        }
    };

    var divide = function (divider) {
        return function (value) {
            return value / divider;
        }
    };

    var add = function (adder) {
        return function (value) {
            return value + adder;
        }
    };

    var sub = function (adder) {
        return function (value) {
            return value - adder;
        }
    };

    var kToF = function (value) {
        return value * 9 / 5 - 459.67;
    };

    var fToK = function (value) {
        return (value + 459.67) * 5 / 9;
    };

    var UNITS = {

        // mass
        g:  { measure: 'mass', output: 'g', utb: id, btu: id },
        kg: { measure: 'mass', output: 'kg', utb: multiply(KG_BASE_FACTOR), btu: divide(KG_BASE_FACTOR) },
        lb: { measure: 'mass', output: 'lbs', utb: multiply(POUND_BASE_FACTOR), btu: divide(POUND_BASE_FACTOR) },

        // temperature
        K:    { measure: 'temperature', output: 'K', utb: id, btu: id },
        '°C': { measure: 'temperature', output: '°C', utb: add(CELSIUS_BASE_DELTA), btu: sub(CELSIUS_BASE_DELTA) },
        '°F': { measure: 'temperature', output: '°F', utb: fToK, btu: kToF },

        // volume
        'm^3': { measure: 'volume', output: 'm^3', utb: id, btu: id },
        l:     { measure: 'volume', output: 'l', utb: divide(LITER_BASE_FACTOR), btu: multiply(LITER_BASE_FACTOR) },
        cuft:  { measure: 'volume', output: 'cuft', utb: divide(CUFT_BASE_FACTOR), btu: multiply(CUFT_BASE_FACTOR) },

        // pressure
        Pa:  { measure: 'pressure', output: 'Pa', utb: id, btu: id },
        bar: { measure: 'pressure', output: 'bar', utb: multiply(BAR_BASE_FACTOR), btu: divide(BAR_BASE_FACTOR) },
        psi: { measure: 'pressure', output: 'psi', utb: multiply(PSI_BASE_FACTOR), btu: divide(PSI_BASE_FACTOR) },

        // length
        m:  { measure: 'length', output: 'm',  utb: id, btu: id },
        ft: { measure: 'length', output: 'ft', utb: divide(FT_BASE_FACTOR), btu: multiply(FT_BASE_FACTOR) },

        // density
        'g/m^3':   { measure: 'density', output: 'g/m^3',  utb: id, btu: id },
        'kg/m^3':  { measure: 'density', output: 'kg/m^3',  utb: multiply(KG_BASE_FACTOR), btu: divide(KG_BASE_FACTOR) },
        'kg/l':    { measure: 'density', output: 'kg/l',  utb: multiply(KGL_BASE_FACTOR), btu: divide(KGL_BASE_FACTOR) },
        'lb/cuft': { measure: 'density', output: 'lb/cuft',  utb: multiply(LBCUFT_BASE_FACTOR), btu: divide(LBCUFT_BASE_FACTOR) },

        // mass fraction
        'kg/kg': { measure: 'mass-fraction', output: 'kg/kg', utb: id, btu: id },
        'g/kg':  { measure: 'mass-fraction', output: 'g/kg',  utb: divide(1000), btu: multiply(1000) },
        'lb/lb': { measure: 'mass-fraction', output: 'lb/lb', utb: id, btu: id }
    };

    /**
     * @param value the value to check
     * @returns {boolean} true if the value is an integer value.
     */
    var isInt = function (value) {
        return value % 1 === 0;
    };

    /**
     * Build and return an equivalent quantity in a new unit
     *
     * @param unit {Number} the unit for the new quantity
     * @returns {app.units.Unit} the quantity with new unit
     */
    var as = function (unit) {
        var to = UNITS[unit];
        var from = UNITS[this.unit()];
        if (from.measure == to.measure) {
            return new app.units.Unit(to.btu(from.utb(this.value())), unit);
        } else {
            throw 'Incompatible units from: ' + from.measure() + ' to: ' + to.measure();
        }
    };

    var obj = function () {
        return {
            value: this.value(),
            unit: this.unit()
        };
    };

    var measure = function () {
        return UNITS[this.unit()].measure;
    };

    /**
     * Format the value and unit with the given precision.
     *
     * @param [precision] {Number} the precision for the value
     * @returns {string} the formatted string
     */
    var format = function (precision) {
        var p = precision !== undefined ? precision : DEFAULT_PRECISION;
        return (isInt(this.value()) ? this.value() : this.value().toFixed(p)) + ' ' + this.unit();
    };

    /**
     * A value associated to a unit
     *
     * @param value {value|{value: value, unit: unit}}
     * @param [unit] {String}
     */
    var Unit = function (value, unit) {

        var hasUnit = (typeof unit !== 'undefined');

        this.v = (hasUnit) ? value : value.value;
        this.u = (hasUnit) ? unit : value.unit;

        if (typeof this.u === 'undefined' || typeof this.v === 'undefined') {
            throw 'value and units must be specified';
        }

        if (! $.isNumeric(this.v)) {
            throw 'value must be a numeric value';
        }

        if (! UNITS[this.u]) {
            throw 'unsupported unit: ' + this.u;
        }

        this.value = function () {
            return this.v;
        };

        this.unit = function () {
            return this.u;
        };
    };

    Unit.prototype.as = as;
    Unit.prototype.obj = obj;
    Unit.prototype.format = format;
    Unit.prototype.measure = measure;

    return {
        Unit: Unit
    };

}());




