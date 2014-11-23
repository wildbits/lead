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
app.views = app.views || {};

app.views.Map = (function() {

    var NASA_WMS_HOST = 'thredds.jpl.nasa.gov';

    var PROXY_NASA_WMS_HOST = 'proxy-thredds-jpl-nasa-gov.herokuapp.com';

    var SALINITY_PATH = '/thredds/wms/ncml_aggregation/SalinityDensity/aquarius/aggregate__AQUARIUS_L3_SSS_SMI_MONTHLY_V3.ncml';

    var TEMPERATURE_PATH = '/thredds/wms/ncml_aggregation/OceanTemperature/amsre/aggregate__AMSRE_L3_SST_1DEG_1MO.ncml';

    var MAX_ZOOM = 6;

    var INIT_ZOOM = 3;

    var MIN_ZOOM = 2;

    var MONTHS = {
        'january': '01', february: '02', march: '03', april: '04', may: '05', june: '06', july: '07', august: '08',
        'september': '09', october: '10', november: '11', december: '12'
    };

    var TEMP_TIME = {
        january: '2010-01-16T12:00:00.000Z',
        february: '2010-02-15T00:00:00.000Z',
        march: '2010-03-16T12:00:00.000Z',
        april: '2010-04-16T00:00:00.000Z',
        may: '2010-05-16T12:00:00.000Z',
        june: '2010-06-16T00:00:00.000Z',
        july: '2010-07-16T12:00:00.000Z',
        august: '2010-08-16T12:00:00.000Z',
        september: '2010-09-16T00:00:00.000Z',
        october: '2010-10-16T12:00:00.000Z',
        november: '2010-11-16T00:00:00.000Z',
        december: '2010-12-16T12:00:00.000Z'
    };

    var getIsoTime = function (year, month) {
        return year + '-' + month + '-01T00:00:00.000Z';
    };

    var getTime = function (month) {
        var lastYear = new Date().getFullYear() - 1;
        return getIsoTime(lastYear, MONTHS[month]);
    };

    var initPos = [47.3604383, 8.5418468];

    var icon = L.icon({
        // original img is 98 x 131
        iconUrl: 'img/marker.png',
        iconRetinaUrl: 'img/marker.png',
        iconSize: [49, 65],
        iconAnchor: [24, 65]
    });

    var buildSalinityTile = function (month) {
        var url = window.location.protocol + '//' + NASA_WMS_HOST + SALINITY_PATH;
        return L.tileLayer.wms(url, {
            detectRetina: true,
            zoom: INIT_ZOOM,
            minZoom: MIN_ZOOM,
            maxZoom: MAX_ZOOM,
            layers: 'l3m_data',
            format: 'image/png',
            version: '1.3.0',
            transparent: true,
            styles: 'boxfill/ferret',
            time: getTime(month),
            attribution: '© Nasa PO.DAAC'
        });
    };

    var buildSalinityFeatureInfo = function (month) {
        var url = window.location.protocol + '//' + PROXY_NASA_WMS_HOST + SALINITY_PATH;
        return new app.map.WmsFeatureInfo(url, {
            crs: 'CRS:84',
            version: '1.3.0',
            query_layers: 'l3m_data',
            padding: 0.5,
            time: getTime(month)
        });
    };

    var buildTemperatureFeatureInfo = function (month) {
        var url = window.location.protocol + '//' + PROXY_NASA_WMS_HOST + TEMPERATURE_PATH;
        return new app.map.WmsFeatureInfo(url, {
            crs: 'CRS:84',
            version: '1.3.0',
            query_layers: 'tos',
            padding: 0.5,
            time: TEMP_TIME[month]
        });
    };

    return function (tag) {

        var setCenter = function (e) {
            marker.setLatLng(e.latlng);
            map.panTo(e.latlng);
        };

        var locate = function () {
            moved = false;
            map.locate({
                maxZoom: INIT_ZOOM,
                enableHighAccuracy: true
            });
        };

        var m = 'january';

        var moved = false;

        var salinityTile = undefined, salinityFeature = undefined, temperatureFeature = undefined;

        var map = L.map(tag, {
            zoomControl: false,
            zoom: INIT_ZOOM,
            minZoom: MIN_ZOOM,
            maxZoom: MAX_ZOOM,
            worldCopyJump: true
        });

        var marker = L.marker(initPos, {
            icon: icon
        });

        marker.addTo(map);

        var baseTileUri = window.location.protocol + '//server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}';

        var baseTile = L.tileLayer(baseTileUri, {
            detectRetina: true,
            zoom: INIT_ZOOM,
            minZoom: MIN_ZOOM,
            maxZoom: MAX_ZOOM,
            attribution: '&copy; Esri et al.'
        });

        baseTile.addTo(map);

        map.setView(initPos, INIT_ZOOM);

        map.on('locationfound', function (e) {
            if (!moved) {
                setCenter(e);
            }
        });

        map.on('dblclick', function (e) {
            moved = true;
            setCenter(e);
        });

        var eventTypes = [];

        return {

            on: function (type, callback) {
                eventTypes.push(type);
                marker.on(type, callback);
            },

            setMonth: function (month) {
                m = month;
                if (salinityTile) {
                    map.removeLayer(salinityTile)
                }
                salinityTile = buildSalinityTile(m);
                salinityTile.addTo(map);

                salinityFeature = buildSalinityFeatureInfo(m);

                temperatureFeature = buildTemperatureFeatureInfo(m);
            },

            locate: locate,

            setView: function (latitude, longitude) {
                var latLng = new L.LatLng(latitude, longitude);
                map.setView(latLng, INIT_ZOOM);
                marker.setLatLng(latLng);
            },

            getMonth: function () {
                return m;
            },

            getMarkerCenter: function () {
                return marker.getLatLng();
            },

            getSalinity: function (latLng, callback) {
                salinityFeature.getFeatureInfo(latLng, callback);
            },

            getTemperature: function (latLng, callback) {
                temperatureFeature.getFeatureInfo(latLng, callback);
            },

            unRegister: function () {
                map.off('dblclick');
                map.off('locationfound');
                for (var i = 0 ; i < eventTypes.length ; i++) {
                    marker.off(eventTypes[i]);
                }
            }

        };

    };

})();