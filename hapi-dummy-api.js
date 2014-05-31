// Instantiate this, then register it as a hapi plugin
// and you've got yourself a fake API for quick/easy
// clientside dev.
var _ = require('underscore');


function API(spec) {
    this.data = spec.data || [];
    this.root = spec.rootUrl || '/api';
    this.idProperty = spec.idProperty || 'id';
    this.delay = spec.delay || 0;
    this.name = spec.name || 'api';
    this.version = spec.version || '0.0.0';

    this.idCounter = this.data.length;

    // bind our register function to maintain scope
    // since hapi doesn't do that for us
    this.register = _.bind(this.register, this);
}

API.prototype.get = function (id) {
    var searchObj = {};
    searchObj[this.idProperty] = id;
    var found = _.findWhere(this.data, searchObj);
    if (found) return found;
    // try it as a number
    searchObj[this.idProperty] = Number(id);
    return _.findWhere(this.data, searchObj)
};

API.prototype.register = function (plugin, options, next) {
    var self = this;

    plugin.route({
        method: 'GET',
        path: self.root,
        handler: function (request, reply) {
            _.delay(function () {
                reply(self.data);
            }, self.delay);
        }
    });

    plugin.route({
        method: 'POST',
        path: self.root,
        handler: function (request, reply) {
            var person = request.payload;
            person.id = self.idCounter++;
            self.data.push(person);
            _.delay(function () {
                reply(person).code(201);
            }, self.delay);
        }
    });

    plugin.route({
        method: 'GET',
        path: self.root + '/{' + self.idProperty + '}',
        handler: function (request, reply) {
            var found = self.get(request.params[self.idProperty]);
            _.delay(function () {
                reply(found).code(found ? 200 : 404);
            }, self.delay);
        }
    });

    plugin.route({
        method: 'DELETE',
        path: self.root + '/{' + self.idProperty + '}',
        handler: function (request, reply) {
            var found = self.get(request.params[self.idProperty]);
            if (found) self.data = _.without(self.data, found);
            _.delay(function () {
                reply(found).code(found ? 200 : 404);
            }, self.delay);
        }
    });

    plugin.route({
        method: 'PUT',
        path: self.root + '/{' + self.idProperty + '}',
        handler: function (request, reply) {
            var found = self.get(request.params[self.idProperty]);
            if (found) _.extend(found, request.payload);
            _.delay(function () {
                reply(found).code(found ? 200 : 404);
            }, self.delay);
        }
    });

    next();
};

module.exports = API;
