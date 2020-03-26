const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const canvasNext = document.getElementById('next');
const ctxNext = canvasNext.getContext('2d');

let accountValues = {
	score: 0;
	level: 0;
	lines: 0
}

function updateAccount(key, value) {
	let element = document.getElementById(key);
	if (element) {
		element.textContent = value;
	}
}

let account = new Proxy(accountValues, {
	set: (target, key, value) => {
		target[key] = value;
		updateAccount(key, value);
		return true;
	}
});


let requestId;

moves = {
	[KEY.LEFT]: p => ({ ...p, x: p.x - 1 }),
	[KEY.RIGHT]: p => ({ ...p, x: p.x + 1 }),
	[KEY.DOWN]: p => ({ ...p, y: p.y + 1 }),
	[KEY.SPACE]: p => ({ ...p, y: p.y + 1 }),
};

let board = new Board(ctx, ctxNext);
addEventListener();
initNext();

function initNext() {
	// Рассчитать размер холста по константам.
	ctxNext.canvas.width = 4 * BLOCK_SIZE;
	ctxNext.canvas.height = 4 * BLOCK_SIZE;
	ctxNext.scale(BLOCK_SIZE, BLOCK_SIZE);
}

function addEventListener() {
	document.addEventListener('keydown', event => {
		if (event.keyCode === KEY.P) {
			pause();
		}
		if (event.keyCode === KEY.ESC) {
			gameOver();
		} else if (moves[event.keyCode]) {
			event.preventDefault();
			// Получить новое состояние
			let p = moves[event.keyCode](board.piece);
			if (event.keyCode === KEY.SPACE) {
				// Hard drop
				while (board.valid(p)) {
					account.score += POINTS.HARD_DROP;
					board.piece.move(p);
					p = moves[KEY.DOWN](board.piece);
				}
			} else if (board.valid(p)) {
				board.piece.move(p);
				if (event.keyCode === KEY.DOWN) {
					account.score += POINTS.SOFT_DROP;
				}
			}
		}
	});
}

