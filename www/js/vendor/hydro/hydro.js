/**
 * Copyright wildbits org
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
org = {};
org.wildbits = {};

org.wildbits.hydro = (function () {

    'use strict';

    /**
     * Return the buoyancy of a solid, fully immersed in a liquid with the given density.
     *
     * @param {number} density The density of the liquid containing the solid in {@code kg•m^-3}
     * @return {number} The resulting buoyancy in {@code kg} or {@code null} if undefined.
     *                  A positive resulting buoyancy indicates the solid is positively buoyant.
     */
    var buoyancy = function(density) {
        return density * this.volume() - this.mass();
    };

    /**
     * Return the density of a solid.
     *
     * @return {number} density The density of the solid in {@code kg•m^-3}
     */
    var density = function() {
        return this.mass() / this.volume();
    };

    /**
     * Represents a solid cylinder filled with a gas under pressure.
     *
     * @param {number} capacity The capacity of the cylinder in {@code m^3}
     * @param {number} density The density of the cylinder material in {@code kg•m^-3}
     * @param {number} mass1 The mass of the cylinder material in {@code kg}
     * @param {number} mass2 The mass of the gas contained in the cylinder in {@code kg}
     */
    var Cylinder = function(capacity, density, mass1, mass2) {

        /**
         * @return {number} The external volume of the cylinder in {@code m^3}
         */
        this.volume = function() {
            // volume of material = mass / density
            // internal volume = capacity
            // external volume = volume of material + internal volume
            return (mass1 / density) + capacity;
        };

        /**
         * @return {number} The mass of the cylinder and its gas in {@code kg}
         */
        this.mass = function() {
            return mass1 + mass2;
        }

    };

    Cylinder.prototype.buoyancy = buoyancy;
    Cylinder.prototype.density = density;

    /**
     * Represent an homogeneous solid.
     *
     * @param volume The solid volume in {@code m^-3}
     * @param mass The solid mass in {@code kg}
     */
    var Solid = function(volume, mass) {

        /**
         * @return {number} The volume of the solid in {@code m^3}
         */
        this.volume = function () {
            return volume;
        };

        /**
         * @return {number} The mass of the solid in {@code kg}
         */
        this.mass = function () {
            return mass;
        };

    };

    Solid.prototype.buoyancy = buoyancy;
    Solid.prototype.density = density;

    /**
     * Represent a composite of solids.
     *
     * @param {*} solids The list of solids that can quack 'volume()' and 'mass()'.
     */
    var Composite = function (solids) {

        /**
         * @returns {number} The resulting mass of the composite in {@code kg}
         */
        this.mass = function() {
            var mass = 0;
            for (var i = solids.length ; i-- ; ) {
                mass += solids[i].mass();
            }
            return mass;
        };

        /**
         * @returns {number} The resulting volume of the composite in {@code m^3}
         */
        this.volume = function () {
            var volume = 0;
            for (var i = solids.length ; i-- ; ) {
                volume += solids[i].volume();
            }
            return volume;
        };

    };

    Composite.prototype.buoyancy = buoyancy;
    Composite.prototype.density = density;

    /**
     * Represent an amount of gas at a given pressure.
     *
     * @param {number} density The density of the gas at the given pressure in {@code kg•m^-3}
     * @param {number} volume The volume of the gas in {@code m^3}
     * @param {number} pressure The pressure of the gas in {@code Pa}
     */
    var Gas = function (density, volume, pressure) {

        /**
         * @return {number} The mass of the gas in {@code kg}
         */
        this.mass = function () {
            return density * volume * pressure;
        };

        /**
         * @return {number} The volume of the gas in {@code m^3}
         */
        this.volume = function () {
            return volume;
        };

        /**
         * @return {number} density The density of the gas in {@code kg•m^-3}
         */
        this.density = function () {
            return density;
        };

    };

    /**
     * Represent an amount of liquid with the given density.
     *
     * @param {number} density The density of the liquid
     * @param {number} volume The volume of the liquid
     */
    var Liquid = function (density, volume) {

        /**
         * @return {number} The mass of the liquid in {@code kg}
         */
        this.mass = function () {
            return density * volume;
        };

        /**
         * @return {number} The volume of the liquid in {@code m^3}
         */
        this.volume = function () {
            return volume;
        };

        /**
         * @return {number} density The density of the liquid in {@code kg•m^-3}
         */
        this.density = function () {
            return density;
        };


    };

    /**
     * Represent dry air.
     */
    var DryAir = function() {

        /**
         * Specific gas constant for dry air.
         */
        var R_DRY_AIR = 287.058;

        /**
         * Return the density of dry air at a given pressure and temperature.
         *
         * The density is computed using the ideal gas law.
         *
         * @param {number} pressure absolute pressure of the dry air in {@code Pa}
         * @param {number} temperature absolute temperature of the dry air in {@code K}
         * @return {number} The density in {@code kg•m^-3} or {@code null} if undefined
         */
        this.density = function(temperature, pressure) {
            return pressure / (R_DRY_AIR * temperature);
        };

    };

    /**
     * Represent salt water.
     */
    var Seawater = function () {

        var big = function (s) {
            return parseFloat(s);
        };

        var validTemperature = function (temperature) {
            return temperature >= MIN_TEMP && temperature < MAX_TEMP;
        };

        var validSalinity = function (salinity) {
            return salinity >= MIN_SAL && salinity < MAX_SAL;
        };

        var A1 = big("999.9");
        var A2 = big("0.02034");
        var A3 = big("-0.006162");
        var A4 = big("0.00002261");
        var A5 = big("-0.00000004657");
        var B1 = big("802.0");
        var B2 = big("-2.001");
        var B3 = big("0.01677");
        var B4 = big("-0.00003060");
        var B5 = big("-0.00001613");

        var MIN_TEMP = 0.0;
        var MAX_TEMP = 180.0;
        var MIN_SAL = 0.0;
        var MAX_SAL = 0.160;

        /**
         * Return the density of a substance at a given temperature.
         *
         * The density is computed based on the density model defined in the paper:
         * The thermophysical properties of seawater: A review of existing correlations and data, Eq. 8.
         * The paper is available on <a href="http://hdl.handle.net/1721.1/69157">MIT Open Access</a>.
         *
         * The model covers the following range for the input parameters:
         *
         * validTemp:     0 >= temperature < 180
         * validSalinity: 0 >= salinity < 0.160
         *
         * The method return a negative number if it fails to compute the salinity.
         *
         * @param {number} temperature The temperature in {@code °C}
         * @param {number} salinity The water salinity in {@code kg/kg}. Fresh water has salinity of {@code 0 kg/kg}
         * @return {number} The density in {@code kg•m^-3} or {@code null} if undefined
         */
        this.density = function (temperature, salinity) {
            if (validSalinity(salinity) && validTemperature(temperature)) {
                var t2 = Math.pow(temperature,2);
                var t3 = Math.pow(temperature,3);
                var t4 = Math.pow(temperature,4);
                var s2 = Math.pow(salinity,2);
                return A1 +
                    A2 * temperature +
                    A3 * t2 +
                    A4 * t3 +
                    A5 * t4 +
                    B1 * salinity +
                    B2 * salinity * temperature +
                    B3 * salinity * t2 +
                    B4 * salinity * t3 +
                    B5 * s2 * t2;
            } else {
                return -1;
            }
        }

    };

    return {

        Cylinder  : Cylinder,
        Solid     : Solid,
        DryAir    : DryAir,
        Gas       : Gas,
        Composite : Composite,
        Seawater  : Seawater,
        Liquid    : Liquid

    };

}());
