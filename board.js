class Board {
	ctx;
	ctxNext;
	grid;
	piece;
	next;
	requestId;
	time;

	constructor(ctx, ctxNext) {
		this.ctx = ctx;
		this.ctxNext = ctxNext;
		this.init();
	}

	init() {
		// Рассчитать размер холста из констант.
		this.ctx.canvas.width = COLS * BLOCK_SIZE;
		this.ctx.canvas.height = ROWS * BLOCK_SIZE;

		// Масштаб, поэтому нам не нужно указывать размер при каждом розыгрыше.
		this.ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
	}

	reset(){
		this.grid = this.getEmptyGrid();
		this.piece = new Piece(this.ctx);
		this.piece.setStartingPosition();
		this.getNewPiece();
	}

	getNewPiece() {
		this.next = new Piece(this.ctxNext);
		this.ctxNext.clearRect(
			0,
			0,
			this.ctxNext.canvas.width,
			this.ctxNext.canvas.height
		);
		this.next.draw();
	}

	draw() {
		this.piece.draw();
		this.drawBoard();
	}

	drop() {
		let p = moves[KEY.DOWN](this.piece);
		if (this.valid(p)) {
			this.piece.move(p);
		} else {
			this.freeze();
			this.clearLines();
			if (this.piece.y === 0) {
				// Конец игры
				return false;
			}
			this.piece = this.next;
			this.piece.ctx = this.ctx;
			this.piece.setStartingPosition();
			this.getNewPiece();
		}
		return true;
	}

	clearLines() {
		let lines = 0;

		this.grid.forEach((row, y) => {

			// Если каждое значение больше 0.
			if (row.every(value => value > 0)) {
				lines++;

				// Удалить строку.
				this.grid.splice(y, 1);

				// Добавьте заполненную нулями строку вверху.
				this.grid.unshift(Array(COLS).fill(0));
			}
		});

		if(lines > 0) {
			// Расчет точек по очищенным линиям и уровню.

			account.score += this.getLinesClearedPoints(lines);
			account.lines += lines;

			// Если мы достигли линии для следующего уровня
			if (account.lines >= LINES_PER_LEVEL) {
				// Перейти на следующий уровень
				account.level++;

				// Удалить строки, чтобы мы начали работать для следующего уровня
				account.lines -= LINES_PER_LEVEL;

				// Увеличить скорость игры
				time.level = LEVEL[account.level];
			}
		}
	}

	valid(p) {
		
	}
}