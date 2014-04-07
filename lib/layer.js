module.exports = (function(){
    var Layer = function(path, middleware){
        this.path = path;
        this.handle = middleware;
    };    

    Layer.prototype.match = function(path){
        return (path.indexOf(this.path) === 0)?{'path':this.path}:undefined;  
    };
   
    return Layer;

    
})();
