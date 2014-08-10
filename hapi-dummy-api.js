// register this as a hapi plugin and pass in an options object to override
// defaults and you've got yourself a fake API for quick/easy
// clientside dev.
var _ = require('underscore');

var defaults = {
    data: [],
    rootUrl: '/api',
    idProperty: 'id',
    delay: 0
};

exports.register = function (plugin, options, next) {

    options  = _.defaults(options, defaults);
    var data = options.data;
    var idCounter = data.length;

    var get = function (id) {
        var searchObj = {};
        searchObj[options.idProperty] = id;
        var found = _.findWhere(data, searchObj);
        if (found) return found;
        // try it as a number
        searchObj[options.idProperty] = Number(id);
        return _.findWhere(data, searchObj);
    };

    plugin.route({
        method: 'GET',
        path: options.rootUrl,
        handler: function (request, reply) {
            _.delay(function () {
                reply(data);
            }, options.delay);
        }
    });

    plugin.route({
        method: 'POST',
        path: options.rootUrl,
        handler: function (request, reply) {
            var person = request.payload;
            person.id = idCounter++;
            data.push(person);
            _.delay(function () {
                reply(person).code(201);
            }, options.delay);
        }
    });

    plugin.route({
        method: 'GET',
        path: options.rootUrl + '/{' + options.idProperty + '}',
        handler: function (request, reply) {
            var found = get(request.params[options.idProperty]);
            _.delay(function () {
                reply(found).code(found ? 200 : 404);
            }, options.delay);
        }
    });

    plugin.route({
        method: 'DELETE',
        path: options.rootUrl + '/{' + options.idProperty + '}',
        handler: function (request, reply) {
            var found = get(request.params[options.idProperty]);
            if (found) data = _.without(data, found);
            _.delay(function () {
                reply(found).code(found ? 200 : 404);
            }, options.delay);
        }
    });

    plugin.route({
        method: 'PUT',
        path: options.rootUrl + '/{' + options.idProperty + '}',
        handler: function (request, reply) {
            var found = get(request.params[options.idProperty]);
            if (found) _.extend(found, request.payload);
            _.delay(function () {
                reply(found).code(found ? 200 : 404);
            }, options.delay);
        }
    });

    next();
};

// multiple=true allows the plugin to be registered more than once
// the pkg attribute will make the plugin name/version match package.json
exports.register.attributes = {
    multiple: true,
    pkg: require("./package.json")
};
