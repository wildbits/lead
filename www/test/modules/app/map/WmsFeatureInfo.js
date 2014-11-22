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

    module("app.map.WmsFeatureInfo", {});

    var fi = new app.map.WmsFeatureInfo('http://proxy-thredds-jpl-nasa-gov.herokuapp.com/thredds/wms/ncml_aggregation/SalinityDensity/aquarius/aggregate__AQUARIUS_L3_SSS_SMI_MONTHLY_V3.ncml', {
        crs: 'CRS:84',
        version: '1.3.0',
        query_layers: 'l3m_data',
        padding: 0.5,
        time: '2011-08-01T00%3A00%3A00.000Z'
    });

    asyncTest("get", 1, function() {

        var latLng = new L.LatLng(-16.426552125, -10.600117875000024);

        fi.getFeatureInfo(latLng, function (info) {
            equal(info.value, 36.67357);
        });

    });

})();