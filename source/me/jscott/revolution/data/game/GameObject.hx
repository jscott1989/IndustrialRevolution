package me.jscott.revolution.data.game;
import me.jscott.revolution.data.universe.UniverseObject;

class GameObject {
    var id: String;
    var universeObject: UniverseObject;

    public function new(id:String, universeObject: UniverseObject = null) {
        this.id = id;
        this.universeObject = universeObject;
    }
}
