import {app} from "../App.js";

class Jewel {
    constructor(cell, type, fromTop) {
        this.cell = cell;
        this.type = type;
        this.el = null;
        this.id = null;
        this.isSelected = false;
        this.fromTop = fromTop;
    }
    render() {
        const jewels = app.screens.game.jewels;
        jewels.sort((a, b) => b.id - a.id);
        this.id = jewels[0]?.id + 1 || 1;
        this.el = document.createElement('img');
        this.el.src = `./img/${this.type}.png`;
        this.el.classList.add('jewel');
        this.el.setAttribute('data-row', this.cell.row);
        this.el.setAttribute('data-col', this.cell.col);
        if (this.fromTop) {
            this.el.style.top = '-40px';
            this.el.style.left = this.cell.el.offsetLeft + 'px';
            this.el.style.width = this.cell.el.scrollWidth + 'px';
            this.el.style.height = this.cell.el.scrollHeight + 'px';
            setTimeout(() => {
                this.updatePos();
            }, 1);
        } else {
            this.updatePos();
        }
        app.screens.game.box.el.append(this.el);
        this.listen();
    }
    updatePos() {
        this.el.setAttribute('data-row', this.cell.row);
        this.el.setAttribute('data-col', this.cell.col);
        this.el.style.left = this.cell.el.offsetLeft + 'px';
        this.el.style.top = this.cell.el.offsetTop + 'px';
        this.el.style.width = this.cell.el.scrollWidth + 'px';
        this.el.style.height = this.cell.el.scrollHeight + 'px';
    }
    listen() {
        this.el.addEventListener('click', e => {
            e.preventDefault();
            if (this.type === 'vertical') {
                app.screens.game.jewels.find(jewel => jewel.isSelected)?.unSelect();
                app.screens.game.destroyVertical(this.cell.col);
            } else if (this.type === 'horizontal') {
                app.screens.game.jewels.find(jewel => jewel.isSelected)?.unSelect();
                app.screens.game.destroyHorizontal(this.cell.row);
            } else if (this.type === 'bomb') {
                app.screens.game.jewels.find(jewel => jewel.isSelected)?.unSelect();
                app.screens.game.destroyBomb(this.cell.row, this.cell.col);
            } else {
                const jewelSelected = app.screens.game.jewels.find(jewel => jewel.isSelected);
                if (app.screens.game.canClick) {
                    if (jewelSelected) {
                        if (this.isAround(jewelSelected)) {
                            this.swapTo(jewelSelected);
                            if (app.screens.game.checkMatches().flat(Infinity).length > 0) {
                                app.screens.game.destroyMatches();
                            } else {
                                setTimeout(() => {
                                    this.swapTo(jewelSelected);
                                }, 400);
                            }
                        }
                    } else {
                        this.select();
                    }
                }
            }
        });
    }
    isAround(jewelSelected) {
        return jewelSelected.cell.row === this.cell.row + 1 && jewelSelected.cell.col === this.cell.col ||
               jewelSelected.cell.row === this.cell.row - 1 && jewelSelected.cell.col === this.cell.col ||
               jewelSelected.cell.row === this.cell.row && jewelSelected.cell.col === this.cell.col + 1 ||
               jewelSelected.cell.row === this.cell.row && jewelSelected.cell.col === this.cell.col - 1;
    }
    swapTo(jewelSelected) {
        const handleCell = jewelSelected.cell;
        jewelSelected.cell = this.cell;
        this.cell = handleCell;
        this.updatePos();
        jewelSelected.updatePos();
        this.unSelect();
        jewelSelected.unSelect();
    }
    select() {
        this.isSelected = true;
        this.cell.el.classList.add('selected');
    }
    unSelect() {
        this.isSelected = false;
        this.cell.el.classList.remove('selected');
    }
    destroy() {
        setTimeout(() => {
            this.el.classList.add('destroy');
            setTimeout(() => {
                app.screens.game.jewels.splice(app.screens.game.jewels.findIndex(jewel => jewel.id === this.id), 1);
            }, 200);
        }, 200);
    }
}

export default Jewel;