var express = require('../index.js')
    , expect = require('chai').expect
    , http = require('http')
    , request = require('supertest');

describe('app', function(){
    describe('create http server', function(){
        describe('return 404 forever', function(){
            var app;

            before(function(){
                app = express();
            });

            it('respnods to wutever with 404', function(){
                request(app)
                    .get('/fuck/the/beach')
                    .expect(404);
            });
    
            it('respnods to wutever with 404', function(){
                request(app)
                    .get('/')
                    .expect(404);
            });    
        });
    });

    describe('#listen', function(){
        var app, server;

        before(function(done){
            app = express();
            server = app.listen(7001, done);
        });

        it('should be an http.Server', function(){
            expect(server).to.be.instanceof(http.Server);
        });

        it('responds to wutever with 404', function(){
            request('http://localhost:7001')
                .get('/this/random/facker')
                .expect(404);
        });
    });
});
