var express = require('../index.js')
    , expect = require('chai').expect
    , http = require('http')
    , request = require('supertest');

describe('app', function(){
    describe('create http server', function(){
        var app = express();
        describe('return 404 forever', function(){
            it('respnods to wutever with 404', function(done){
                request(app)
                    .get('/fuck/the/beach')
                    .expect(404)
                    .end(done);
            });
    
            it('respnods to wutever with 404', function(done){
                request(app)
                    .get('/')
                    .expect(404)
                    .end(done);
            });    
    
            
        });
    });

    describe('#listen', function(){
        var app = express()
            , server = app.listen(7001);

        it('should be an http.Server', function(){
            expect(server).to.be.instanceof(http.Server);
        });

        it('responds to wutever with 404', function(done){
            request('http://localhost:7001')
                .get('/this/random/facker')
                .expect(404)
                .end(done);
        });
    });
});
