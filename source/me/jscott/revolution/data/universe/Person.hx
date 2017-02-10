package me.jscott.revolution.data.universe;

/**
* A person during the industrial revolution.
**/
class Person extends UniverseObject {
    var name:String;

    public function new(id:String, name:String) {
        super(id);
        this.name = name;
    }

    public function getName():String {
        return name;
    }
}
