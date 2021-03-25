'use strict';
const $ = require('jquery');
//This will just add extra capabilities to existing jQuery. So there is no need to store this in a variable.
require('bootstrap-sass');
//Include this on every page to make sure Promises are present on every page
require('babel-polyfill');
require('../css/main.scss');

$(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip();
});
