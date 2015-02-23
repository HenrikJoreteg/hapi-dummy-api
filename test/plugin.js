var Lab = require('lab'),
    Hapi = require('hapi');

var lab = exports.lab = Lab.script();
var pseudoAPI = require('../');


lab.experiment('hapi-dummy-api', function () {
    var server = new Hapi.Server();

    server.connection({ port: 80, labels: 'a' });

    var opts = {
        data: [{
            id: 0,
            name: 'chair'
        }, {
            id: "one",
            name: 'table'
        }],
        rootUrl: '/api/things'
    };

    var root = opts.rootUrl;

    lab.test('Plugin successfully loads', function (done) {

        server.register({
            register: pseudoAPI,
            options: opts
        }, function (err) {
            Lab.expect(err).to.equal(undefined);
            done();
        });
    });

    lab.test('Plugin registers routes', function (done) {
        var table = server.table()[0].table;

        Lab.expect(table).to.have.length(5);

        Lab.expect(table[0].path).to.equal(root);
        Lab.expect(table[0].method).to.equal('get');

        Lab.expect(table[1].path).to.equal(root + '/{id}');
        Lab.expect(table[1].method).to.equal('get');

        Lab.expect(table[2].path).to.equal(root);
        Lab.expect(table[2].method).to.equal('post');

        Lab.expect(table[3].path).to.equal(root + '/{id}');
        Lab.expect(table[3].method).to.equal('delete');

        Lab.expect(table[4].path).to.equal(root + '/{id}');
        Lab.expect(table[4].method).to.equal('put');

        done();
    });

    lab.test('get a thing', function (done) {
        var options = {
            method: "GET",
            url: root + '/0'
        };

        server.inject(options, function (response) {
            var result = response.result;

            Lab.expect(response.statusCode).to.equal(200);
            Lab.expect(result).to.be.an('object');
            Lab.expect(result.name).to.equal(opts.data[0].name);
            Lab.expect(result.id).to.equal(opts.data[0].id);
            done();
        });
    });

    lab.test('get a thing that has a string for an id', function (done) {
        var options = {
            method: "GET",
            url: root + '/one'
        };

        server.inject(options, function (response) {
            var result = response.result;

            Lab.expect(response.statusCode).to.equal(200);
            Lab.expect(result).to.be.an('object');
            Lab.expect(result.name).to.equal(opts.data[1].name);
            Lab.expect(result.id).to.equal(opts.data[1].id);
            done();
        });
    });

    lab.test('get all the things', function (done) {
        var options = {
            method: "GET",
            url: root
        };

        server.inject(options, function (response) {
            var result = response.result;

            Lab.expect(response.statusCode).to.equal(200);
            Lab.expect(result).to.be.an('array');
            Lab.expect(result.length).to.equal(opts.data.length);
            done();
        });
    });


    lab.test('get a thing that does not exist', function (done) {
        var options = {
            method: "GET",
            url: root + '/zzz'
        };

        server.inject(options, function (response) {
            var result = response.result;

            Lab.expect(response.statusCode).to.equal(404);
            done();
        });
    });

    lab.test('post a thing', function (done) {
        var options = {
            method: "POST",
            url: root,
            payload: {
                name: "cup"
            }
        };

        server.inject(options, function (response) {
            var result = response.result;

            Lab.expect(response.statusCode).to.equal(201);
            Lab.expect(result).to.be.an('object');
            Lab.expect(result.id).to.equal(opts.data[2].id);
            Lab.expect(result.name).to.equal("cup");
            done();
        });
    });

    lab.test('delete a thing', function (done) {
        var options = {
            method: "DELETE",
            url: root + "/2"
        };

        server.inject(options, function (response) {
            var result = response.result;

            Lab.expect(response.statusCode).to.equal(200);
            Lab.expect(result).to.be.an('object');
            Lab.expect(result.id).to.equal(opts.data[2].id);
            Lab.expect(result.name).to.equal(opts.data[2].name);
            done();
        });
    });

    lab.test('delete a thing that does not exist', function (done) {
        var options = {
            method: "DELETE",
            url: root + "/37337"
        };

        server.inject(options, function (response) {
            var result = response.result;

            Lab.expect(response.statusCode).to.equal(404);
            Lab.expect(result).to.equal(null);
            done();
        });
    });

    lab.test('update a thing', function (done) {
        var options = {
            method: "PUT",
            url: root + "/one",
            payload: {
                name: "rock"
            }
        };

        server.inject(options, function (response) {
            var result = response.result;

            Lab.expect(response.statusCode).to.equal(200);
            Lab.expect(result).to.be.an('object');
            Lab.expect(result.id).to.equal(opts.data[1].id);
            Lab.expect(result.name).to.equal("rock");
            done();
        });
    });

    lab.test('update a thing that does not exist', function (done) {
        var options = {
            method: "PUT",
            url: root + "/9999",
            payload: {
                name: "rock"
            }
        };

        server.inject(options, function (response) {
            var result = response.result;

            Lab.expect(response.statusCode).to.equal(404);
            Lab.expect(result).to.equal(null);
            done();
        });
    });
});
