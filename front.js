function pieceImageFor(letter) {
  // Map FEN letter -> filename piece type
  const map = {
    p: 'pawn',
    r: 'rook',
    n: 'knight',
    b: 'bishop',
    q: 'queen',
    k: 'king'
  };
  const lower = letter.toLowerCase();
  const type = map[lower];
  if (!type) return null;
  const color = letter === lower ? 'black' : 'white';
  return `pieces/${color}-${type}.png`;
}

function fileIndexToCol(fileIndex) {
  // fileIndex 0..7 -> grid column 1..8
  return fileIndex + 1;
}
function rankToGridRow(rank) {
  // gridRow = 9 - rank
  return 9 - rank;
}

function renderFEN(fen) {
  if (typeof fen !== 'string') throw new Error('FEN must be a string');
  const board = document.getElementById('board');
  if (!board) throw new Error('No element with id="board" found');

  // take only the piece placement field (first token)
  const parts = fen.trim().split(/\s+/);
  if (!parts[0]) throw new Error('Invalid FEN');
  const placement = parts[0];
  const ranks = placement.split('/');
  if (ranks.length !== 8) throw new Error('FEN must have 8 ranks');

  // clear existing pieces
  board.innerHTML = '';

  for (let i = 0; i < 8; ++i) {
    const rankStr = ranks[i]; // this is rank starting from 8 down to 1
    const rankNumber = 8 - i; // i=0 -> rank8, i=7 -> rank1

    let file = 0; // file index 0..7 (a..h)
    for (let chIndex = 0; chIndex < rankStr.length; ++chIndex) {
      const ch = rankStr[chIndex];
      if (/\d/.test(ch)) {
        // digit => skip that many empty squares
        const skip = parseInt(ch, 10);
        file += skip;
        continue;
      }

      if (file > 7) {
        console.warn('FEN appears malformed (too many files in rank)', rankStr);
        break;
      }

      // create a piece element
      const imgSrc = pieceImageFor(ch);
      const pieceDiv = document.createElement('div');
      pieceDiv.className = 'piece';
      pieceDiv.setAttribute('data-piece', ch); // 'P','k','r' etc.

      // compute algebraic square name (optional helper)
      const fileLetter = String.fromCharCode('a'.charCodeAt(0) + file);
      const squareName = fileLetter + rankNumber;
      pieceDiv.setAttribute('data-square', squareName);

      // place using CSS Grid coordinates
      pieceDiv.style.gridColumnStart = String(fileIndexToCol(file));
      pieceDiv.style.gridRowStart = String(rankToGridRow(rankNumber));

      // image
      if (imgSrc) {
        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = ch;
        pieceDiv.appendChild(img);
      } else {
        pieceDiv.textContent = ch;
      }

      board.appendChild(pieceDiv);
      file += 1;
    }
    if (file !== 8) {}
  }
}

// convenience: find piece on a square (algebraic like 'e4')
function pieceOnSquare(square) {
  return document.querySelector(`#board > .piece[data-square="${square}"]`);
}

// Example usage:
const startFEN = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR';
renderFEN(startFEN);