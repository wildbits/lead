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
app.map = app.map || {};

/**
 * Allow to issue WMS GetFeatureInfo requests.
 * See {@link http://docs.geoserver.org/latest/en/user/services/wms/reference.html#wms-getfeatureinfo}
 */
app.map.WmsFeatureInfo = (function () {

    var def = {

        service: 'WMS',
        request: 'GetFeatureInfo',
        info_format: 'text/xml',
        version: '1.3.0',
        crs: 'CRS:84',
        query_layers: '',
        height: 256,
        width: 256,
        i: 128,
        j: 128

    };

    var parseFeature = function (xml)  {

        var json = new X2JS().xml2json(xml);

        var fir = json['FeatureInfoResponse'] || {};
        var fi = fir['FeatureInfo'] || {};

        return {

            latitude: fir.latitude,
            longitude: fir.longitude,
            value: fi.value === "none" ? undefined : fi.value,
            time: fi.time

        };
    };

    return function (baseUrl, options) {

        var params = $.extend({}, def, options);

        return {

            /**
             * @param latLng
             * @param callback
             * @returns {*} the value sampled at the point or undefined if the WMS layer is undefined at the location.
             */
            getFeatureInfo: function (latLng, callback) {

                var p = $.extend({}, params, {});

                var southWest = new L.LatLng(latLng.lat - p.padding, latLng.lng - p.padding);
                var northEast = new L.LatLng(latLng.lat + p.padding, latLng.lng + p.padding);

                var bounds = new L.LatLngBounds(southWest, northEast);

                p.bbox = bounds.toBBoxString();

                var uri = baseUrl + '?' + $.param(p);

                return $.ajax({
                    url: uri,
                    type: 'GET',
                    cache: false,
                    dataType: 'xml'
                }).done(function (data,status,xhr) {
                    callback(parseFeature(data));
                }).fail(function (xhr,status,error) {
                    callback(undefined);
                });
            }
        };
    };

})();