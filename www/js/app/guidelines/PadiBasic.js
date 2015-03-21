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
app.guidelines = app.guidelines || {};

/**
 * Implementation of the PADI's Basic Weighting Guidelines.
 *
 * PADI's guidelines detail how to compute the buoyancy of a suit as a function of the diver body weight,
 * type of water (sea or fresh) and suit type.
 * The guidelines are meant to evaluate an amount of weight as a start for the buoyancy check.
 *
 * As mentioned in the PADI's guidelines, the result should take into account the buoyancy of the cylinders which may
 * provide a positive buoyancy (for instance with some ALU cylinders). The guidelines only provide one example,
 * the AL80 which requires adding 2 kg.
 * The computation of the buoyancy for other cylinders is done externally.
 *
 * As mentioned in the PADI's guidelines, the result  are based on individuals of average build thus lean individuals
 * may need less weight, heavy individuals may need more. The implementation adapts the results based on the diver
 * fat ratio.
 *
 * All mass units are in {@code kg}.
 */
app.guidelines.PadiBasic =  (function () {

    var illegalArgument = function(value) {
        throw ('Illegal argument value: ' + value);
    };

    var SUIT_TYPE = {

        /**
         * Swimsuit or dive skin
         */
        SWIMSUIT: function (bodyWeight) {
            return new app.math.Range(0.5, 2);
        },

        /**
         * Thin (3 mm/1/16 inch), one-piece wet suits – shorties or jump suits
         */
        THIN_WET_SUIT: function (bodyWeight) {
            var lead = 0.05 * bodyWeight;
            return new app.math.Range(lead,lead);
        },

        /**
         * Medium-thickness (5mm/3/16 inch), Two-piece wet suit
         */
        MEDIUM_WET_SUIT: function (bodyWeight) {
            var lead = 0.10 * bodyWeight;
            return new app.math.Range(lead, lead);
        },

        /**
         * Thick (7mm/1/4 inch), two-piece wet suit with hood and boots
         */
        THICK_WET_SUIT: function (bodyWeight) {
            var lead = 0.10 * bodyWeight;
            return new app.math.Range(lead + 1.5, lead + 3.0);
        },

        /**
         * Neoprene dry suits
         */
        NEOPRENE_DRY_SUIT: function (bodyWeight) {
            var lead = 0.10 * bodyWeight;
            return new app.math.Range(lead + 3.0, lead + 5.0);
        },

        /**
         * Shell-style dry suits (using light-weight, nonfoam underwear)
         */
        SHELL_DRY_SUIT_LIGHT: function (bodyWeight) {
            var lead = 0.10 * bodyWeight;
            return new app.math.Range(lead + 1.5,lead + 3.0);
        },

        /**
         * Shell style dry suits (using heavy-weight or foam underwear)
         */
        SHELL_DRY_SUIT_HEAVY: function (bodyWeight) {
            var lead = 0.10 * bodyWeight;
            return new app.math.Range(lead + 3.0, lead + 7.0);
        }
    };

    /**
     * Return the offset in {@code kg} to be added in order to compensate for the diver fat ratio.
     * Leaner individuals may need less weight, heavier individuals may require more weight
     * @param fatRatio the diver fat ratio
     */
    var FITNESS_OFFSET = {
        male: function (fatRatio) {
            return 10.023 * fatRatio - 2.0638;
        },
        female: function (fatRatio) {
            return 9.6235 * fatRatio - 2.6722;
        }
    };


        /**
     * Returns the offset of lead required when passing from salt to fresh water.
     * Returns {@code undefined} when the offset is undefined.
     * @param bodyWeight the weight of the diver.
     * @returns {Number} the offset to be added
     */
    var saltToFreshOffset = function (bodyWeight) {
        switch (true) {
            case bodyWeight >= 45 && bodyWeight <= 56 : return -2.0;
            case bodyWeight >  56 && bodyWeight <= 70 : return -2.3;
            case bodyWeight >  70 && bodyWeight <= 85 : return -3.0;
            case bodyWeight >  85 && bodyWeight <= 99 : return -3.2;
            default                                   : return undefined;
        }
    };


    /**
     * Return the estimated weight to carry for a dive according to the PADI's Basic Weighting Guidelines.
     * Returns {@code undefined} if the PADI guideline is not defined for the input parameters.
     * @throws Error when an argument provided is not supported.
     * @param waterType the type of water in {@code SEA}, {@code FRESH}.
     * @param suitType the type of suit in {@code SWIMSUIT}, {@code THIN_WET_SUIT}, {@code MEDIUM_WET_SUIT},
     *        {@code THICK_WET_SUIT}, {@code NEOPRENE_DRY_SUIT}, {@code SHELL_DRY_SUIT_LIGHT},
     *        {@code SHELL_DRY_SUIT_HEAVY}.
     * @param bodyWeight the weight of the diver in {@code kg}.
     * @param fatRatio the diver fat ratio
     * @param gender the diver gender in 'female', 'male'
     * @param cylindersBuoyancy the maximum buoyancy for all the cylinders to be taken in the dive
     */
    var estimateWeight = function (waterType, suitType, bodyWeight, fatRatio, gender, cylindersBuoyancy) {

        if (waterType !== 'SEA' && waterType !== 'FRESH') {
            illegalArgument(waterType);
        }

        var suit = SUIT_TYPE[suitType];
        if (!suit) {
            illegalArgument(suitType);
        }

        var fitness = FITNESS_OFFSET[gender];
        if (!fitness) {
            illegalArgument(gender);
        }
        var fitnessOffset = fitness(fatRatio);

        // compute water offset

        var waterOffset = (waterType === 'FRESH') ? saltToFreshOffset(bodyWeight) : 0.0;
        if (waterOffset == undefined) {
            return undefined;
        }

        // compute suit buoyancy range

        var suitBuoyancy = suit(bodyWeight).add(waterOffset);

        // apply water fitness ratio

        var fittedSuitBuoyancy = suitBuoyancy.add(fitnessOffset);

        // compute total buoyancy

        var totalBuoyancy = fittedSuitBuoyancy.add(cylindersBuoyancy);

        return {
            suit: suitBuoyancy,
            fitnessOffset: fitnessOffset,
            fittedSuit: fittedSuitBuoyancy,
            cylinders: cylindersBuoyancy,
            total: totalBuoyancy
        };
    };

    return {
        estimateWeight: estimateWeight
    };

})();