package;

import me.jscott.revolution.PlayState;
import flixel.FlxGame;
import openfl.display.Sprite;

/**
* This is the entry point of Industrial Revolution.
**/
class Main extends Sprite {
	public function new() {
		super();

        // Skip the splash screen and go straight to the PlayState
		addChild(new FlxGame(0, 0, PlayState, 1, 60, 60, true));
	}
}
