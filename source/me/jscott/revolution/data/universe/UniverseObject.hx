package me.jscott.revolution.data.universe;

/**
* An object in the universe should not be updated during a single game.
* Things committed here will affect future games.
**/
class UniverseObject {
    var id:String;

    public function new(id:String) {
        this.id = id;
    }

    public function getID():String {
        return id;
    }
}
