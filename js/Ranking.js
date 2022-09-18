import {app} from "./App.js";

class Ranking {
    constructor() {
        this.el = document.getElementById('ranking');
        this.btnPlay = document.getElementById('ranking-play');
        this.scores = [];
        this.table = document.getElementById('ranking-table');
        this.btnQuit = document.getElementById('ranking-quit');
    }
    render() {
        this.listen();
    }
    mount() {
        this.el.classList.add('active');
        this.setupTableRanking();
    }
    setupTableRanking() {
        this.table.innerHTML = '';
        this.scores.forEach((score, i) => {
            let tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${ i + 1 }</td>
                <td>${ score.name }</td>
                <td>${ score.score }</td>
            `;
            this.table.append(tr);
        });
    }
    unMount() {
        this.el.classList.remove('active');
    }
    listen() {
        this.btnPlay.addEventListener('click', e => {
            e.preventDefault();
            app.setActiveScreen('countdown');
        });
        this.btnQuit.addEventListener('click', e => {
           e.preventDefault();
            app.setActiveScreen('intro');
        });
    }
}

export default Ranking;