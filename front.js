let pawns = [];
for (let i = 1; i <= 8; i++) {
    pawns.push(document.getElementById(`p${i}`));
}
let wpawns = [];
for (let i = 1; i <= 8; i++) {
    wpawns.push(document.getElementById(`P${i}`));
}

// Black pieces
let r1 = document.getElementById('r1');
let r2 = document.getElementById('r2');
let n1 = document.getElementById('n1');
let n2 = document.getElementById('n2');
let b1 = document.getElementById('b1');
let b2 = document.getElementById('b2');
let q  = document.getElementById('q');
let k  = document.getElementById('k');

// White pieces
let R1 = document.getElementById('R1');
let R2 = document.getElementById('R2');
let N1 = document.getElementById('N1');
let N2 = document.getElementById('N2');
let B1 = document.getElementById('B1');
let B2 = document.getElementById('B2');
let Q  = document.getElementById('Q');
let K  = document.getElementById('K');

function fenToDict(fen) {
    const [position] = fen.split(" "); // only need the piece placement part
    const rows = position.split("/");
    const files = ["a","b","c","d","e","f","g","h"];
    const dict = {};

    for (let rank = 8; rank >= 1; rank--) {
        const row = rows[8 - rank]; // rows go from 8 -> 1
        let fileIndex = 0;

        for (const char of row) {
            if (isNaN(char)) {
                // It's a piece
                const square = files[fileIndex] + rank;
                if (!dict[char]) dict[char] = [];
                dict[char].push(square);
                fileIndex++;
            } else {
                fileIndex += parseInt(char, 10);
            }
        }
    }
    return dict;
}

function placePiecesFromFen(fen) {
    const dict = fenToDict(fen);
    const pieceMap = {
        'p': pawns,
        'P': wpawns,
        'r': [r1, r2],
        'R': [R1, R2],
        'n': [n1, n2],
        'N': [N1, N2],
        'b': [b1, b2],
        'B': [B1, B2],
        'q': [q],
        'Q': [Q],
        'k': [k],
        'K': [K]
    };

    function hideAllPieces() {
        const allElements = [].concat(
            pawns, wpawns,
            [r1, r2, n1, n2, b1, b2, q, k, R1, R2, N1, N2, B1, B2, Q, K]
        );
        allElements.forEach(el => {
            if (el) {
                el.style.display = 'none';
            }
        });
    }
    hideAllPieces();

    function placeElementOnSquare(el, square) {
        if (!el || !square || square.length < 2) return;
        const file = square[0];
        const rank = square.slice(1);
        el.style.left = `var(--file-${file})`;
        el.style.top  = `var(--rank-${rank})`;
        el.style.display = '';
    }

    for (const pieceChar in pieceMap) {
        const domRef = pieceMap[pieceChar];
        const positions = dict[pieceChar] || [];
        const domArray = Array.isArray(domRef) ? domRef : [domRef];

        positions.forEach((square, idx) => {
            const el = domArray[idx];
            if (el) {
                placeElementOnSquare(el, square);
            } else {
                console.warn(`No DOM element available to place piece ${pieceChar} at ${square} (index ${idx}).`);
            }
        });

        domArray.forEach((el, idx) => {
            if (!positions[idx] && el) {
                el.style.display = 'none';
            }
        });
    }
}

const startFen = "rn1qk2r/ppp2ppp/3B1n2/3p4/3P4/2N2N2/PPQ1PPPP/R3KB1R b KQkq - 0 7";
placePiecesFromFen(startFen);