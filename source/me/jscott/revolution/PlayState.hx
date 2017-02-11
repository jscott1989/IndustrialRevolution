package me.jscott.revolution;

import flixel.ui.FlxButton;
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
    var paused = false;
    var startDate = DateTime.fromString('1670-01-01 00:00:01');

    // Interface elements
    var dayText:FlxText;
    var timeText:FlxText;
    var pauseButton:FlxButton;
    var playButton:FlxButton;
    var FFButton:FlxButton;
    var newsTab:FlxButton;
    var staffTab:FlxButton;
    var researchTab:FlxButton;
    var grantsTab:FlxButton;
    var optionsTab:FlxButton;

    private function createUI():Void {
        // Create time display
        dayText = new FlxText(FlxG.width - 170, 10, 160); // x, y, width
        dayText.setFormat(null, 20, FlxColor.WHITE, CENTER);
        dayText.text = formatDayText(time);
        add(dayText);

        timeText = new FlxText(FlxG.width - 170, dayText.y + dayText.height, 160); // x, y, width
        timeText.setFormat(null, 20, FlxColor.WHITE, CENTER);
        timeText.text = formatTimeText(time);
        add(timeText);

        // Create time controls
        pauseButton= new FlxButton(FlxG.width - 140, timeText.y + timeText.height, "", pause);
        pauseButton.loadGraphic(AssetPaths.pausebutton__png);

        playButton= new FlxButton(pauseButton.x + pauseButton.width + 5, pauseButton.y, "", play);
        playButton.loadGraphic(AssetPaths.playbutton_active__png);

        FFButton = new FlxButton(playButton.x + playButton.width + 5, playButton.y, "", fastForward);
        FFButton.loadGraphic(AssetPaths.fastforwardbutton__png);

        pauseButton.width = 10;
        add(pauseButton);
        add(playButton);
        add(FFButton);

        // Create primary interface tabs
        newsTab = new FlxButton(50, 38, "", showNewsTab);
        newsTab.loadGraphic(AssetPaths.newstab_active__png);
        add(newsTab);

        staffTab = new FlxButton(newsTab.x + newsTab.width + 10, newsTab.y, "", showStaffTab);
        staffTab.loadGraphic(AssetPaths.stafftab__png);
        add(staffTab);

        researchTab = new FlxButton(staffTab.x + staffTab.width + 10, staffTab.y, "", showResearchTab);
        researchTab.loadGraphic(AssetPaths.researchtab__png);
        add(researchTab);

        grantsTab = new FlxButton(researchTab.x + researchTab.width + 10, researchTab.y, "", showGrantsTab);
        grantsTab.loadGraphic(AssetPaths.grantstab__png);
        add(grantsTab);

        optionsTab = new FlxButton(grantsTab.x + grantsTab.width + 10, grantsTab.y, "", showOptionsTab);
        optionsTab.loadGraphic(AssetPaths.optionstab__png);
        add(optionsTab);
    }

    private function play() {
        speed = NORMAL_SPEED;
        paused = false;
        playButton.loadGraphic(AssetPaths.playbutton_active__png);
        pauseButton.loadGraphic(AssetPaths.pausebutton__png);
        FFButton.loadGraphic(AssetPaths.fastforwardbutton__png);
    }

    private function pause() {
        if (paused) {
            paused = false;
            pauseButton.loadGraphic(AssetPaths.pausebutton__png);
            if (speed == NORMAL_SPEED) {
                playButton.loadGraphic(AssetPaths.playbutton_active__png);
            } else {
                FFButton.loadGraphic(AssetPaths.fastforwardbutton_active__png);
            }
        } else {
            paused = true;
            pauseButton.loadGraphic(AssetPaths.pausebutton_active__png);
            playButton.loadGraphic(AssetPaths.playbutton__png);
            FFButton.loadGraphic(AssetPaths.fastforwardbutton__png);
        }
    }

    private function fastForward() {
        speed = FAST_SPEED;
        paused = false;

        FFButton.loadGraphic(AssetPaths.fastforwardbutton_active__png);
        pauseButton.loadGraphic(AssetPaths.pausebutton__png);
        playButton.loadGraphic(AssetPaths.playbutton__png);
    }

    private function showNewsTab() {
        newsTab.loadGraphic(AssetPaths.newstab_active__png);
        staffTab.loadGraphic(AssetPaths.stafftab__png);
        researchTab.loadGraphic(AssetPaths.researchtab__png);
        grantsTab.loadGraphic(AssetPaths.grantstab__png);
        optionsTab.loadGraphic(AssetPaths.optionstab__png);
    }

    private function showStaffTab() {
        newsTab.loadGraphic(AssetPaths.newstab__png);
        staffTab.loadGraphic(AssetPaths.stafftab_active__png);
        researchTab.loadGraphic(AssetPaths.researchtab__png);
        grantsTab.loadGraphic(AssetPaths.grantstab__png);
        optionsTab.loadGraphic(AssetPaths.optionstab__png);
    }

    private function showResearchTab() {
        newsTab.loadGraphic(AssetPaths.newstab__png);
        staffTab.loadGraphic(AssetPaths.stafftab__png);
        researchTab.loadGraphic(AssetPaths.researchtab_active__png);
        grantsTab.loadGraphic(AssetPaths.grantstab__png);
        optionsTab.loadGraphic(AssetPaths.optionstab__png);
    }

    private function showGrantsTab() {
        newsTab.loadGraphic(AssetPaths.newstab__png);
        staffTab.loadGraphic(AssetPaths.stafftab__png);
        researchTab.loadGraphic(AssetPaths.researchtab__png);
        grantsTab.loadGraphic(AssetPaths.grantstab_active__png);
        optionsTab.loadGraphic(AssetPaths.optionstab__png);
    }

    private function showOptionsTab() {
        newsTab.loadGraphic(AssetPaths.newstab__png);
        staffTab.loadGraphic(AssetPaths.stafftab__png);
        researchTab.loadGraphic(AssetPaths.researchtab__png);
        grantsTab.loadGraphic(AssetPaths.grantstab__png);
        optionsTab.loadGraphic(AssetPaths.optionstab_active__png);
    }

    /**
    * Turn a tick count into a date string. Offset from the startYear and startDate
    **/
    private function formatTimeText(time:Int) {
        // TODO turn time into a date string
        var date = startDate + Day(time);
        return date.format("%d/%m/%Y");
    }

    private function formatDayText(time:Int) {
        var date = startDate + Day(time);
        var dow = date.format("%w");
        if (dow == "0") {
            return "SUN";
        }
        if (dow == "1") {
            return "MON";
        }
        if (dow == "2") {
            return "TUE";
        }
        if (dow == "3") {
            return "WED";
        }
        if (dow == "4") {
            return "THU";
        }
        if (dow == "5") {
            return "FRI";
        }
        if (dow == "6") {
            return "SAT";
        }
        return "???";
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
        if (!paused) {
            tickElapsed += elapsed;
            if (tickElapsed >= speed) {
                tick();
                tickElapsed = 0;
            }
        }
	}

    /**
    * Advance the clock by one time unit and perform associated actions
    **/
    public function tick() {
        time += 1;

        // TODO: Refresh time indicator
        dayText.text = formatDayText(time);
        timeText.text = formatTimeText(time);
    }
}
