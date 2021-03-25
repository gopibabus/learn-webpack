const $ = require('jquery');
require('bootstrap-sass');
const RepLogApp = require('./components/RepLogApp');

//Just to support legacy code and global is the window object in browser environment
global.$ = $;

$(document).ready(function() {
    let $wrapper = $('.js-rep-log-table');
    const logs = $wrapper.data('rep-logs');
    let repLogApp = new RepLogApp($wrapper, logs);
});
