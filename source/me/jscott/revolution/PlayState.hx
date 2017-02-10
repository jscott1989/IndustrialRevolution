package me.jscott.revolution;

import flixel.util.FlxColor;
import flixel.text.FlxText;
import me.jscott.revolution.data.Game;
import flixel.FlxState;

/**
* Main game state of Industrial Revolution
**/
class PlayState extends FlxState {
	var game:Game;

    public function new(game:Game): Void {
        super();
        this.game = game;
    }

	override public function create():Void {
		super.create();
        var myText = new FlxText(0, 0, 500); // x, y, width
        myText.text = "This is the playstate - it knows which game is loaded.";
        myText.setFormat(null, 20, FlxColor.WHITE, CENTER);
        myText.setBorderStyle(OUTLINE, FlxColor.RED, 1);
        add(myText);
	}

	override public function update(elapsed:Float):Void {
		super.update(elapsed);
	}
}
