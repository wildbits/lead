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

    var MODEL = Backbone.Model.extend({
        defaults: {
            'p':'v1'
        }
    });

    module("app.stores.MemoryStore", {});

    test("create", 2, function() {

        var memoryStore = new app.stores.MemoryStore();
        var returned1 = memoryStore.create(new MODEL());
        var returned2 = memoryStore.create(new MODEL());
        notEqual(returned1, returned2);
        equal(memoryStore.readAll(new MODEL()).length, 2);
    });

    test("read", 5, function() {

        var memoryStore = new app.stores.MemoryStore();
        var m1 = new MODEL();
        m1.set({'p':'new v'});
        equal(m1.get('p'), 'new v');
        var returned = memoryStore.create(m1);
        notEqual(returned, undefined);
        var read = memoryStore.read(returned);
        notEqual(read, undefined);
        equal(returned.id, read.id);
        equal(read.p, 'new v');
    });

    test("update", 4, function() {

        var memoryStore = new app.stores.MemoryStore();
        var m1 = new MODEL();
        var returned = memoryStore.create(m1);
        notEqual(returned, undefined);
        equal(returned.p, 'v1');
        m1.set('p','another value');
        memoryStore.update(m1);
        var read = memoryStore.read(m1);
        notEqual(read, undefined);
        equal(read.p, 'another value');
    });

    test("remove", 1, function() {

        var memoryStore = new app.stores.MemoryStore();
        var m1 = new MODEL();
        var returned = memoryStore.create(m1);
        memoryStore.remove(m1);
        var read = memoryStore.read(m1);
        equal(read, undefined);
    });


})();