import Intro from "./Intro.js";
import Countdown from "./Countdown.js";
import Game from "./Game.js";
import Ranking from "./Ranking.js";

class App {
    constructor() {
       this.screens = {
           intro: null,
           countdown: null,
           game: null,
           ranking: null
       };
       this.activeScreen = null;
       this.audio = {
           bg: null,
           destroy: null,
           bomb: null,
       }
    }
    render() {
        this.registerScreens();
        this.initScreen();
        this.registerAudios();
    }
    registerScreens() {
        this.screens.intro = new Intro();
        this.screens.countdown = new Countdown();
        this.screens.game = new Game();
        this.screens.ranking = new Ranking();

        this.screens.intro.render();
        this.screens.countdown.render();
        this.screens.game.render();
        this.screens.ranking.render();
    }
    registerAudios() {
        this.audio.bg = new Audio();
        this.audio.bg.src = './sounds/background.mp3';
        this.audio.bg.loop = true;
        this.audio.destroy = new Audio();
        this.audio.destroy.src = './sounds/destroyed.mp3';
        this.audio.bomb = new Audio();
        this.audio.bomb.src = './sounds/bomb.mp3';
    }
    initScreen() {
        this.setActiveScreen('intro');
    }
    setActiveScreen(screen) {
        if (this.activeScreen) this.screens[this.activeScreen].unMount();
        this.activeScreen = screen;
        this.screens[this.activeScreen].mount();
    }
}

export const app = new App();
app.render();