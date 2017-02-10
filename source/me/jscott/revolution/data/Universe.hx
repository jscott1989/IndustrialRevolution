package me.jscott.revolution.data;

/**
* This class deals with loading and saving of objects in the universe.
*
* The universe represents the persistent world beyond a single game.
**/
import me.jscott.revolution.data.universe.Technology;
import me.jscott.revolution.data.universe.Person;

class Universe {
    var people: Array<Person>;
    var technologies: Array<Technology>;

    public function new() {
        // TODO: Load from file if it exists
        reset();
    }

    /**
    * Load the universe from a file
    **/
    public function load() {

    }

    /**
    * Reset the universe
    **/
    public function reset() {
        // Empty database
        people = new Array<Person>();
        technologies = new Array<Technology>();

        createDefaultPeople();
        createDefaultTechnologies();
    }

    public function createDefaultPeople() {
    }

    public function createDefaultTechnologies() {

    }
}
