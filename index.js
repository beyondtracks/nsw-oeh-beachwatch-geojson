const gp = require('geojson-precision');
const turf = {
    point: require('@turf/helpers').point,
    featureCollection: require('@turf/helpers').featureCollection
};
const async = require('async');
const extend = require('xtend');
const moment = require('moment');
const _ = require('lodash');

module.exports = {
    /**
     * Convert the NSW OEH Beachwatch Upstream Feed to:
     *
     *   - Drop unneeded or duplicate properties
     *   - Limit coordinate precision
     *   - Convert to GeoJSON
     *
     * @param {Array} georss Array of NSW OEH Beachwatch Upstream Feeds as a XML Strings
     * @param {Function} callback Callback function invoked with (err, geojson)
     */
    convert: function(georssList, callback) {
        return async.parallel(georssList.map(function (georss) {
            return function (cb) {
                // parse the upstream XML
                require('xml2js').parseString(georss, function (err, xml) {
                    if (err) {
                        throw 'Error parsing XML response body';
                    } else {
                        cb(err, xml);
                    }
                });
            };
        }),
        function (err, results) {
            if (err) {
                callback(err);
            } else {
                var features = _.flattenDepth(results.map(geojsonFeatures), 2);
                callback(null, gp.parse(turf.featureCollection(features), 4));
            }
        });
    }
};

function geojsonFeatures(georss) {
    if (georss && georss.rss) {
        var channelProperties = {};
        if (georss.rss.channel && georss.rss.channel.length && georss.rss.channel[0].item && georss.rss.channel[0].item.length) {
            var bwData = georss.rss.channel[0]['bw:data'][0];

            channelProperties.rainfall = bwData['bw:rainfall'][0];
            channelProperties.oceanTemp = Number(bwData['bw:oceanTemp'][0]);
            channelProperties.swell = bwData['bw:swell'][0];
            channelProperties.highTide = bwData['bw:highTide'][0]; // TODO .match(/([^ ]+) meters at ([^.]+)./);
            channelProperties.lowTide = bwData['bw:lowTide'][0];

            return georss.rss.channel[0].item.map(function (item) {
                var coordinates = item['georss:point'][0].split(/\s/).map(function (coord) { return Number(coord); }).reverse();

                var itemProperties = {};

                if ('pubDate' in item)
                    itemProperties.pubDate = item.pubDate[0];

                if ('title' in item)
                    itemProperties.title = item.title[0];

                if ('bw:data' in item && item['bw:data'].length) {
                    var bwData = item['bw:data'][0];
                    itemProperties.advice = bwData['bw:advice'][0].replace(/\\r/, '').replace(/\\n/, '').trim().replace(/Pollution is /, '').split('.')[0];
                    itemProperties.patrolInfo = bwData['bw:patrolInfo'][0];
                    itemProperties.bsg = bwData['bw:bsg'][0];
                    itemProperties.bsgComment = bwData['bw:bsgComment'][0];
                    itemProperties.starRating = bwData['bw:starRating'][0].length;
                    itemProperties.dateSample = moment(bwData['bw:dateSample'][0], 'DD/MM/YYYY').format();
                }

                var properties = extend(channelProperties, itemProperties);

                return turf.point(coordinates, properties);
            });
        }
    }
}
