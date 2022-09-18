import {app} from "../App.js";

class Cell {
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.el = null;
        this.id = null;
    }
    render() {
        const cells = app.screens.game.cells;
        cells.sort((a, b) => b.id - a.id);
        this.id = cells[0]?.id + 1 || 1;
        this.el = document.createElement('div');
        this.el.classList.add('cell');
        this.el.setAttribute('data-row', this.row);
        this.el.setAttribute('data-col', this.col);
        app.screens.game.box.el.append(this.el);
    }
}

export default Cell;