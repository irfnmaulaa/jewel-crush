import {app} from "./App.js";

class Intro {
    constructor() {
        this.el = document.getElementById('intro');
        this.name = document.getElementById('intro-name');
        this.btnPlay = document.getElementById('intro-play');
    }
    render() {
        this.listen();
    }
    mount() {
        this.el.classList.add('active');
        this.name.focus();
    }
    unMount() {
        this.el.classList.remove('active');
    }
    listen() {
        this.btnPlay.addEventListener('click', (e) => {
            e.preventDefault();
            if (!this.name.value) {
                alert("Name must be filled!");
                this.name.focus();
                return;
            }
            app.setActiveScreen('countdown');
        });
    }
}

export default Intro;