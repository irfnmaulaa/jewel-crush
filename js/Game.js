import {app} from "./App.js";
import Cell from "./components/Cell.js";
import Jewel from "./components/Jewel.js";

class Game {
    constructor() {
        this.el = document.getElementById('game');
        this.board = {
            nameEl: document.getElementById('game-name'),
            timer: {
                value: 30,
                el: document.getElementById('game-timer'),
                decrease: () => {
                    this.board.timer.value--;
                    this.board.timer.el.innerText = this.board.timer.value;
                }
            },
            score: {
                value: 0,
                el: document.getElementById('game-score'),
                increase: (add) => {
                    if (!this.isGameOver) {
                        this.board.score.value += add;
                        this.board.score.el.innerText = this.board.score.value;
                    }
                }
            },
            btnToggleMusic: document.getElementById('game-toggle-music'),
        }
        this.result = {
            el: document.getElementById('game-result'),
            descEl: document.getElementById('game-desc'),
            btnPlay: document.getElementById('game-play'),
            btnRanking: document.getElementById('game-ranking'),
        };
        this.box = {
            el: document.getElementById('game-box'),
        }
        this.cells = [];
        this.jewels = [];
        this.types  = ['jewel-1', 'jewel-2', 'jewel-3', 'jewel-4', 'jewel-5'];
        this.canClick = true;
        this.isGameOver = false;
        this.btnQuit = document.getElementById('game-quit');
    }
    render() {
        this.listen();
        this.initCells();
    }
    mount() {
        this.el.classList.add('active');
        this.initBoard();
        this.initJewels();
        app.audio.bg?.play();
    }
    initScreen() {
        this.result.el.classList.remove('active');
        this.isGameOver = false;
    }
    initBoard() {
        // Init Timer
        this.board.timer.value = 30;
        this.board.timer.el.innerText = this.board.timer.value;
        const interval = setInterval(() => {
            if (this.board.timer.value === 0) {
                clearInterval(interval);
                this.gameOver();
                return;
            }
            this.board.timer.decrease();
        }, 1000);

        // Init Score
        this.board.score.value = 0;
        this.board.score.el.innerText = this.board.score.value;
    }
    initCells() {
        this.cells = [];
        for (let row = 1; row <= 9; row++){
            for (let col = 1; col <= 9; col++){
                const cell = new Cell(row, col);
                cell.render();
                this.cells.push(cell);
            }
        }
    }
    initJewels() {
        this.jewels.forEach(jewel => jewel.destroy())
        for (let row = 1; row <= 9; row++){
            for (let col = 1; col <= 9; col++){
                const cell  = this.getCell(row, col);
                const aroundTypes = this.getAroundTypes(row, col);
                let filtered = this.types.filter(type => !aroundTypes.includes(type));
                let type  = filtered[Math.floor(Math.random() * filtered.length)];
                if (row === 4 && col === 4) {
                    type = 'vertical';
                }
                const jewel = new Jewel(cell, type);
                jewel.render();
                this.jewels.push(jewel);
            }
        }
    }
    getAroundTypes(row, col) {
        const left = this.jewels.filter(({cell}) =>
            cell.row === row && cell.col === col - 2 ||
            cell.row === row && cell.col === col - 1
        ).map(jewel => jewel.type);

        const top = this.jewels.filter(({cell}) =>
            cell.row === row - 1 && cell.col === col ||
            cell.row === row - 2 && cell.col === col
        ).map(jewel => jewel.type);

        let except = [];
        if (left.length > 1 && left.every(type => type === left[0])) {
            except.push(left[0]);
        }
        if (top.length > 1 && top.every(type => type === top[0])) {
            except.push(top[0]);
        }

        return except;
    }
    getCell(row, col) {
        return this.cells.find(cell => cell.row === row && cell.col === col);
    }
    getJewel(row, col) {
        return this.jewels.find(jewel => jewel.cell.row === row && jewel.cell.col === col);
    }
    unMount() {
        this.el.classList.remove('active');
        this.initScreen();
        app.audio.bg?.pause();
        app.audio.bg.currentTime = 0;
    }
    gameOver() {
        this.storeScore();
        this.result.el.classList.add('active');
        this.result.descEl.innerHTML = `Your score is <b>${ this.board.score.value }</b>.`;
        app.audio.bg?.pause();
    }
    storeScore() {
        let payload = new FormData();

        payload.append('name', app.screens.intro.name.value);
        payload.append('score', this.board.score.value);
        payload.append('time', 30);

        fetch('register.php', {
            method: 'POST',
            body: payload,
        })
            .then(response => response.json())
            .then(response => {
                response.sort((a, b) => b.score - a.score);
                localStorage.setItem('scores', JSON.stringify(response));
                app.screens.ranking.scores = response;
            })
    }
    listen() {
        this.board.btnToggleMusic.addEventListener('click', e => {
            e.preventDefault();
             const state = this.board.btnToggleMusic.getAttribute('data-state');
             if (state === 'play') {
                 app.audio.bg?.pause();
                 this.board.btnToggleMusic.setAttribute('data-state', 'pause');
                 this.board.btnToggleMusic.innerText = 'Play Music';
             } else {
                 app.audio.bg?.play();
                 this.board.btnToggleMusic.setAttribute('data-state', 'play');
                 this.board.btnToggleMusic.innerText = 'Pause Music';
             }
        });
        this.result.btnPlay.addEventListener('click', e => {
           e.preventDefault();
           app.setActiveScreen('countdown');
        });
        this.result.btnRanking.addEventListener('click', e => {
            e.preventDefault();
            app.setActiveScreen('ranking');
        });
        this.btnQuit.addEventListener('click', e => {
            e.preventDefault();
            app.setActiveScreen('intro');
        });
    }
    checkMatches() {

        // horizontal
        let horizontalMatches = [];
        for (let row = 1; row <= 9; row++) {
            let handle = [], matches = [];
            for (let col = 1; col <= 9; col++) {
                const jewel = this.getJewel(row, col);
                if (handle[handle.length - 1]?.type === jewel?.type) {
                    handle.push(jewel);
                    if (handle.length >= 3 && col === 9) {
                        matches.push(handle.filter(item => item));
                    }
                } else {
                    if (handle.length >= 3) {
                        matches.push(handle.filter(item => item));
                    }
                    handle = [jewel];
                }
            }
            if (matches.length > 0) horizontalMatches.push(matches);
        }

        let verticalMatches = [];
        for (let col = 1; col <= 9; col++) {
            let handle = [], matches = [];
            for (let row = 1; row <= 9; row++) {
                const jewel = this.getJewel(row, col);
                if (handle[handle.length - 1]?.type === jewel?.type) {
                    handle.push(jewel);
                    if (handle.length >= 3 && row === 9) {
                        matches.push(handle.filter(item => item));
                    }
                } else {
                    if (handle.length >= 3) {
                        matches.push(handle.filter(item => item));
                    }
                    handle = [jewel];
                }
            }
            if (matches.length > 0) verticalMatches.push(matches);
        }

        return [...horizontalMatches.flat(), ...verticalMatches.flat()];
    }
    destroyMatches() {
        if (!this.isGameOver) {
            this.canClick = false;
            let addition = false;
            if (this.checkMatches().flat(Infinity).length > 0) app.audio.destroy?.play();
            this.checkMatches().forEach(match => {
                if (match.length === 4 && !addition) {
                    addition = ['vertical', 'horizontal'][Math.floor(Math.random() * 2)];
                } else if (match.length >= 5 && !addition) {
                    addition = 'bomb';
                }
                match.forEach(jewel => {
                    setTimeout(() => {
                        if (match.length === 4) {
                            this.board.score.increase(3);
                        } else if (match.length >= 5) {
                            this.board.score.increase(3);
                        } else {
                            this.board.score.increase(1);
                        }
                    }, 200);
                    jewel.destroy()
                });
            });

            setTimeout(() => {
                this.fillCells(addition);
            }, 410);
            setTimeout(() => {
                if (this.checkMatches().flat(Infinity).length > 0) {
                    this.destroyMatches();
                } else {
                    this.canClick = true;
                }
            }, 1000);
        }
    }
    destroyVertical(col) {
        this.jewels.filter(jewel => jewel.cell.col === col).forEach(jewel => jewel.destroy());
        app.audio.bomb?.play();
        setTimeout(() => {
            this.fillCells();
            this.destroyMatches();
        }, 800);
    }
    destroyHorizontal(row) {
        this.jewels.filter(jewel => jewel.cell.row === row).forEach(jewel => jewel.destroy());
        app.audio.bomb?.play();
        setTimeout(() => {
            this.fillCells();
            this.destroyMatches();
        }, 800);
    }
    destroyBomb(row, col) {

    }
    fillCells(feature = false) {
        const randCol = Math.floor(Math.random() * 8) + 1;
        for(let col = 1; col <= 9; col++) {
            let cellsEmpty = this.cells.filter(cell => cell.col === col && !this.getJewel(cell.row, col));
            cellsEmpty.sort((a, b) => b.row - a.row);
            const lastCell = cellsEmpty[0];
            if (lastCell) {
                let jewelsTop = this.jewels.filter(jewel => jewel.cell.col === col && jewel.cell.row < lastCell.row);
                jewelsTop.sort((a, b) => b.cell.row - a.cell.row);
                jewelsTop.forEach((jewel, i) => {
                   jewel.cell =  this.getCell(lastCell.row - i, col);
                   jewel.updatePos();
                });

                const randRow = Math.floor(Math.random()*(lastCell.row - jewelsTop.length - 1)) + 1;

                for (let row = 1; row <= lastCell.row - jewelsTop.length; row++) {
                    let cell = this.getCell(row, col);
                    let type = this.types[Math.floor(Math.random() * this.types.length)];
                    if (feature && randRow === row && randCol === col) {
                        type = feature;
                    }
                    const jewel = new Jewel(cell, type, true);
                    jewel.render();
                    this.jewels.push(jewel);
                }
            }
        }
    }
}

export default Game;