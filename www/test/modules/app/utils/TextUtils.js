/**
 * Copyright 2016 wildbits.github.io
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


    module("app.utils.TextUtils", {});

    test("no filtering", 4, function(assert) {
        var same = 'same';
        equal(app.utils.TextUtils.sanitize(same), same);
        var sameWithSpace = 'same with space';
        equal(app.utils.TextUtils.sanitize(sameWithSpace), sameWithSpace);
        var sameMixed = 'Fab 10/300 BS5045-7:2000(PED) UK';
        equal(app.utils.TextUtils.sanitize(sameMixed), sameMixed);
        var sameAll = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 §!"#$%&()*+,-./:;=@[]_~|{}™…•°©®]';
        equal(app.utils.TextUtils.sanitize(sameAll), sameAll);
    });

    test("accents", 2, function(assert) {
        equal(app.utils.TextUtils.sanitize('àrbre'), 'arbre');
        equal(app.utils.TextUtils.sanitize('ÂrBreŸ'), 'ArBreY');
    });

    test("filtering", 2, function(assert) {
        equal(app.utils.TextUtils.sanitize('<not>'), 'not');
        equal(app.utils.TextUtils.sanitize('\t\nnot£'), 'not');
    });

})();