package me.jscott.revolution.data.universe;

/**
* A potential technology to be researched
**/
class Technology extends UniverseObject {
    var name:String;

    public function new(id:String, name:String) {
        super(id);
        this.name = name;
    }

    public function getName():String {
        return name;
    }
}
