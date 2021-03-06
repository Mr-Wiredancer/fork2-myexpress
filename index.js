var http = require('http')
    , Layer = require('./lib/layer.js');

module.exports = function(){
    var next, generateNext, handler, upperNext;

    //初始化next, 构造一个closure来保存nextIndex变量(记住对middleware数组的具体调用)
    var generateNext = function(req, res){
        var nextIndex = 0;
        req.params = {};
        var originalURL = null;

        return function(err){
            if (nextIndex >= handler.stack.length){
                
                //此app是被作为middleware调用的，需要调用上一层的next
                if (upperNext){
                    upperNext(err);
    
                //已经没有middleware可以调用，返回404或500
                }else{
                    res.statusCode = err?500:404;
                    res.end();
                    return;    
                }
            }

            // restore url from subapp
            if (originalURL!=null){
                req.url = originalURL;
                originalURL = null;
            };

            var layer = handler.stack[nextIndex]
                , middleware = layer.handle
                , match = layer.match(req.url)
                , isErrMiddleware = (middleware.length === 4);

            nextIndex += 1;
            
            //根据err的有无选择是否跳过当前middleware
            if (!match || (err && !isErrMiddleware) || (!err && isErrMiddleware)){
                next(err);
                return;
            }

            populateParams(req, match.params);

            // trim url for subapp
            if (isApp(middleware)){
                originalURL = req.url;
                trimUrl(req, match.path);
            }

            //调用middleware, 捕捉任何可能的异常
            try{
                if (err){
                    middleware(err, req, res, next);
                }else{
                    middleware(req, res, next);    
                }
            }catch(e){
                next(e);
            }
        }
    }

    handler = function(req, res, parentNext){
        if (parentNext){
            upperNext = parentNext;//此app作为middleware被调用，保存parent的next以备之后调用

        }

        next = generateNext(req, res); //初始化next
        next();
    }

    handler.listen = function(port, cb){
        var server = http.createServer(handler);
        server.listen(port, cb);

        return server;
    }
    
    handler.stack = [];
    handler['handle'] = handler;

    handler.use = function(){
        if (arguments.length === 2){
            handler.stack.push(new Layer(arguments[0], arguments[1]));    
        }else{
            handler.stack.push(new Layer('/', arguments[0]))    
        }
    }

    return handler;
}

var isApp = function(middleware){
    return (typeof middleware.handle === 'function');
};

var trimUrl  = function(req, trimmed){
    req.url = req.url.substr(trimmed.length);
    if (req.url === '' || req.url[0]!='/'){
        req.url = '/'+req.url;
    }
};

var populateParams = function(req, params){
    for (var key in params){
        req.params[key] = params[key];
    }
}


