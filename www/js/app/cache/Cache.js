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
app.cache = app.cache || {};

app.cache.Cache = (function () {

    var store = {};

    var getData = function (path, dataType) {
        var id = path;
        return (store[id]) ? store[id] : store[id] = $.ajax({
                url: path,
                dataType: dataType
            }).fail(function () {
            store[id] = undefined;
        });
    };

    var get = function (path, callback, dataType) {
        return getData(path, dataType).done(function (data) {
            if (callback) {
                callback(data);
            }
        }).fail(function () {
            if (callback) {
                callback('');
            }
        });
    };

    return {
        get: get
    };

}());




