package me.jscott.revolution;

import flixel.util.FlxColor;
import flixel.text.FlxText;
import flixel.FlxG;
import me.jscott.revolution.data.Universe;
import me.jscott.revolution.data.Game;
import flixel.FlxState;

/**
* Main menu state of Industrial Revolution.
**/
class MenuState extends FlxState {
	override public function create():Void {
		super.create();
        var myText = new FlxText(0, 0, 500); // x, y, width
        myText.text = "Helsadsalo World";
        myText.setFormat(null, 20, FlxColor.WHITE, CENTER);
        myText.setBorderStyle(OUTLINE, FlxColor.RED, 1);
        add(myText);
        // For now we just create a new Game and then move to the playstate
        var universe = new Universe();
        var game = new Game(universe);
        FlxG.switchState(new PlayState(game));
	}

	override public function update(elapsed:Float):Void {
        super.update(elapsed);
	}
}
