var p2re = require('path-to-regexp')

var stripTrailingSlash = function(s){
	return s[s.length-1] === '/'?s.substr(0, s.length-1):s;

}

module.exports = (function(){
    var Layer = function(path, middleware){
    	path = stripTrailingSlash(path);
        
        this.path = path;
        this.names = [];
        this.re = p2re(path, this.names, {end:false});
        this.handle = middleware;
    };    

    Layer.prototype.match = function(path){
    	path = decodeURIComponent(path);
    	path = stripTrailingSlash(path);

    	var testResult = this.re.exec(path);

    	if (!testResult) return undefined;

    	var toReturn = {path:testResult[0], params:{}};

    	for (var i = 0; i < this.names.length; i++){
    		var name = this.names[i]['name'];
    		toReturn.params[name] = testResult[i+1];
    	}

    	return toReturn;

        // return (path.indexOf(this.path) === 0)?{'path':this.path}:undefined;  
    };
   
    return Layer;

    
})();
