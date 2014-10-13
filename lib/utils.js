'use strict';

/** 
 * Check typeof object.
 * Example:
 *     checkType('Object', {}); // Return true
 *     checkType('Function'', '');  // Return false
 */
exports.checkType = function(type, obj) {
    var clas = Object.prototype.toString.call(obj).slice(8, -1);
    return obj !== undefined && obj !== null && clas === type;
};
