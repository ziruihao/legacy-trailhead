/**
 * Trip document structure.
 * @typedef {Object} Trip
 * @property {string} title - Title of the trip.
 */

/**
 * User document structure.
 * @typedef {Object} User
 * @property {string} name - Name of the user.
 */

/**
 * Vehicle request document structure.
 * @typedef {Object} VehicleRequest
 * @property {User} requester - User who created the request.
 */

/**
 * Vehicle request assignment document structure.
 * @typedef {Object} Assignment
 * @property {VehicleRequest} request - Associated request.
 */

exports.unused = {};
