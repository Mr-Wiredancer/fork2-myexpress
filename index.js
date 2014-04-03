var http = require('http');

module.exports = function(){

    var handler = function(req, res){
        res.statusCode = 404;
        res.end();
    }

    handler.listen = function(port, cb){
        var server = http.createServer(handler);
        server.listen(port, cb);

        return server;
    }

    return handler;
}

