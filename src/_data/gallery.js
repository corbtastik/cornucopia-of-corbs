/**
 * Gallery Data
 * Returns photo data for the gallery shortcode
 */
const dummyPhotos = require('./sources/dummy');

module.exports = function() {
    return dummyPhotos();
};