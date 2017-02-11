package me.jscott.revolution;

import flixel.FlxG;
import datetime.DateTime;
import flixel.util.FlxColor;
import flixel.text.FlxText;
import me.jscott.revolution.data.Game;
import flixel.FlxState;
import datetime.DateTime;

/**
* Main game state of Industrial Revolution
**/
class PlayState extends FlxState {
	var game:Game;

    // Time management
    var NORMAL_SPEED:Float = 1.0;
    var FAST_SPEED:Float = 0.5;

    var tickElapsed:Float = 0;
    var time:Int = 0;
    var speed:Float = 1.0;
    var startDate = DateTime.fromString('1670-01-01 00:00:01');

    // Interface elements
    var timeText:FlxText;

    private function createUI():Void {
        timeText = new FlxText(FlxG.width - 170, 10, 160); // x, y, width
        timeText.setFormat(null, 20, FlxColor.WHITE, CENTER);
        timeText.text = formatTimeText(time);
        add(timeText);
    }

    /**
    * Turn a tick count into a date string. Offset from the startYear and startDate
    **/
    private function formatTimeText(time:Int) {
        // TODO turn time into a date string
        var date = startDate + Day(time);
        return date.format("%d/%m/%Y");
    }

    public function new(game:Game): Void {
        super();
        this.game = game;
    }

	override public function create():Void {
		super.create();
        createUI();
	}

	override public function update(elapsed:Float):Void {
		super.update(elapsed);

        // Manage ticks
        tickElapsed += elapsed;
        if (tickElapsed >= speed) {
            tick();
            tickElapsed = 0;
        }
	}

    /**
    * Advance the clock by one time unit and perform associated actions
    **/
    public function tick() {
        time += 1;

        // TODO: Refresh time indicator
        timeText.text = formatTimeText(time);
    }
}
