var http = require('http');

module.exports = function(){
    var next, generateNext, handler, upperNext;

    var generateNext = function(req, res){
        var nextIndex = 0; 

        return function(err){
            if (nextIndex >= handler.stack.length){
                if (upperNext){
                    upperNext(err);
                }else{
                    res.statusCode = err?500:404;
                    res.end();
                    return;    
                }
            }


            var middleware = handler.stack[nextIndex]
                , isErrMiddleware = (middleware.length === 4);
            
            nextIndex += 1;
            
            if ((err && !isErrMiddleware) || (!err && isErrMiddleware)){
                next(err);
                return;
            }
            
            try{
                if (err){
                    middleware(err, req, res, next);
                }else{
                    middleware(req, res, next);    
                }
            }catch(e){
                res.statusCode = 500;
                res.end();
            }
        }
    }

    handler = function(req, res, parentNext){
        if (parentNext){
            upperNext = parentNext;

        }

        next = generateNext(req, res);
        next();
    }

    handler.listen = function(port, cb){
        var server = http.createServer(handler);
        server.listen(port, cb);

        return server;
    }
    
    handler.stack = [];

    handler.use = function(middleware){
        handler.stack.push(middleware);    
    }

    return handler;
}

