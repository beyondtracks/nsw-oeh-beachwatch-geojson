const gp = require('geojson-precision');
const turf = {
    point: require('@turf/helpers').point,
    featureCollection: require('@turf/helpers').featureCollection
};

// polyfill Object.entries
const entries = require('object.entries');
if (!Object.entries) {
    entries.shim();
}

module.exports = {
    /**
     * "Cleans" the NSW OEH Beachwatch Upstream Feed to:
     *
     *   - Drop unneded or duplicate properties
     *   - Limit coordinate precision
     *   - Unpack overloaded Categories field
     *
     * @param {Object} json NSW OEH Beachwatch Upstream Feed as a JSON Object
     * @return {Object}
     */
    clean: function(json) {
        if (json && json.beaches) {
            return gp.parse(turf.featureCollection(Object.entries(json.beaches).map(([key, beach]) => {
                var properties = {
                    name: beach.Name,
                    time: beach.Timestamp
                };
                if (beach.Categories && beach.Categories.length) {
                    properties.status = beach.Categories[0].replace(/\/n/, '').trim().replace(/Pollution is /, '');
                }
                return turf.point([Number(beach.Longitude), Number(beach.Latitude)], properties);
            })), 4);
        }
    }
};
