// Trạng thái ban đầu của bảng (3 hàng x 4 cột = 12 ô: từ 1 đến 11, ô 0 là ô đen)
const ROWS = 3;
const COLS = 4;
const WIN_STATE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0];

let boardState = [...WIN_STATE];
let isPlaying = false;
let timerInterval = null;
let secondsElapsed = 0;
let stepCount = 0;
let historyList = [];

// DOM Elements
const gameBoard = document.getElementById('game-board');
const btnStart = document.getElementById('btn-start');
const timerDisplay = document.getElementById('timer-display');
const stepCountDisplay = document.getElementById('step-count');
const winOverlay = document.getElementById('win-overlay');
const winStats = document.getElementById('win-stats');
const btnRestart = document.getElementById('btn-restart');
const historyBody = document.getElementById('history-body');
const noHistoryText = document.getElementById('no-history');

// Hàm format thời gian mm:ss
function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');
  return `${mm}:${ss}`;
}

// Render bàn cờ ra giao diện
function renderBoard() {
  gameBoard.innerHTML = '';
  boardState.forEach((num, index) => {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    
    if (num === 0) {
      tile.classList.add('tile-black');
    } else {
      tile.classList.add(`tile-${num}`);
      tile.textContent = num;
      // Cho phép bấm chuột vào các ô lân cận ô đen để di chuyển
      tile.addEventListener('click', () => {
        if (!isPlaying) return;
        handleTileClick(index);
      });
    }

    gameBoard.appendChild(tile);
  });
}

// Bắt đầu đếm giờ
function startTimer() {
  clearInterval(timerInterval);
  secondsElapsed = 0;
  timerDisplay.textContent = '00:00';
  timerInterval = setInterval(() => {
    secondsElapsed++;
    timerDisplay.textContent = formatTime(secondsElapsed);
  }, 1000);
}

// Dừng đếm giờ
function stopTimer() {
  clearInterval(timerInterval);
}

// Tìm vị trí của ô đen (giá trị 0)
function getBlackTileIndex() {
  return boardState.indexOf(0);
}

// Lấy danh sách các hướng có thể di chuyển của ô đen
function getValidMoves(blackIndex) {
  const row = Math.floor(blackIndex / COLS);
  const col = blackIndex % COLS;
  const moves = [];

  // Lên (row - 1)
  if (row > 0) moves.push(blackIndex - COLS);
  // Xuống (row + 1)
  if (row < ROWS - 1) moves.push(blackIndex + COLS);
  // Trái (col - 1)
  if (col > 0) moves.push(blackIndex - 1);
  // Phải (col + 1)
  if (col < COLS - 1) moves.push(blackIndex + 1);

  return moves;
}

// Trộn ô 100 lần (đảm bảo bài toán 100% giải được)
function shuffleBoard() {
  boardState = [...WIN_STATE];
  let lastMovedIndex = -1;

  for (let i = 0; i < 100; i++) {
    const blackIndex = getBlackTileIndex();
    const validMoves = getValidMoves(blackIndex);

    // Tránh việc đảo ngược ngay bước vừa đi để độ xáo trộn cao nhất
    const filteredMoves = validMoves.filter(idx => idx !== lastMovedIndex);
    const candidateMoves = filteredMoves.length > 0 ? filteredMoves : validMoves;

    const chosenIndex = candidateMoves[Math.floor(Math.random() * candidateMoves.length)];
    
    // Đổi chỗ
    boardState[blackIndex] = boardState[chosenIndex];
    boardState[chosenIndex] = 0;
    lastMovedIndex = blackIndex;
  }
}

// Xử lý di chuyển ô đen
function moveBlackTile(direction) {
  if (!isPlaying) return;

  const blackIndex = getBlackTileIndex();
  const row = Math.floor(blackIndex / COLS);
  const col = blackIndex % COLS;
  let targetIndex = -1;

  if (direction === 'UP') {
    // Di chuyển ô đen lên trên (đổi chỗ với ô phía trên)
    if (row > 0) targetIndex = blackIndex - COLS;
  } else if (direction === 'DOWN') {
    // Di chuyển ô đen xuống dưới (đổi chỗ với ô phía dưới)
    if (row < ROWS - 1) targetIndex = blackIndex + COLS;
  } else if (direction === 'LEFT') {
    // Di chuyển ô đen sang trái (đổi chỗ với ô bên trái)
    if (col > 0) targetIndex = blackIndex - 1;
  } else if (direction === 'RIGHT') {
    // Di chuyển ô đen sang phải (đổi chỗ với ô bên phải)
    if (col < COLS - 1) targetIndex = blackIndex + 1;
  }

  // Nếu vị trí hợp lệ trong khung
  if (targetIndex !== -1) {
    boardState[blackIndex] = boardState[targetIndex];
    boardState[targetIndex] = 0;
    stepCount++;
    stepCountDisplay.textContent = stepCount;
    renderBoard();
    checkWinCondition();
  }
}

// Hỗ trợ click chuột vào ô số kề cạnh ô đen
function handleTileClick(clickedIndex) {
  const blackIndex = getBlackTileIndex();
  const validMoves = getValidMoves(blackIndex);

  if (validMoves.includes(clickedIndex)) {
    boardState[blackIndex] = boardState[clickedIndex];
    boardState[clickedIndex] = 0;
    stepCount++;
    stepCountDisplay.textContent = stepCount;
    renderBoard();
    checkWinCondition();
  }
}

// Kiểm tra chiến thắng
function checkWinCondition() {
  if (!isPlaying || stepCount === 0) return;

  const isWin = boardState.every((val, index) => val === WIN_STATE[index]);

  if (isWin) {
    isPlaying = false;
    stopTimer();

    const timeStr = formatTime(secondsElapsed);

    // Cập nhật giao diện nút
    btnStart.textContent = 'Bắt đầu';
    btnStart.className = 'btn btn-start';

    // Hiện thông báo You Win
    winStats.textContent = `Bạn đã hoàn thành trong ${timeStr} với ${stepCount} bước đi!`;
    winOverlay.classList.remove('hidden');

    // Lưu vào lịch sử lượt chơi
    const newRecord = {
      id: historyList.length + 1,
      steps: stepCount,
      time: timeStr
    };
    historyList.push(newRecord);
    renderHistory();
  }
}

// Render bảng lịch sử lượt chơi
function renderHistory() {
  if (historyList.length === 0) {
    noHistoryText.style.display = 'block';
    historyBody.innerHTML = '';
    return;
  }

  noHistoryText.style.display = 'none';
  historyBody.innerHTML = '';
  historyList.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.id}</td>
      <td>${item.steps}</td>
      <td>${item.time}</td>
    `;
    historyBody.appendChild(row);
  });
}

// Bắt đầu game
function startGame() {
  isPlaying = true;
  stepCount = 0;
  stepCountDisplay.textContent = '0';
  winOverlay.classList.add('hidden');

  // Đổi nút sang "Kết thúc"
  btnStart.textContent = 'Kết thúc';
  btnStart.className = 'btn btn-end';

  // Trộn bảng 100 lần & bắt đầu đếm giờ
  shuffleBoard();
  renderBoard();
  startTimer();
}

// Kết thúc game
function endGame() {
  isPlaying = false;
  stopTimer();

  // Đổi nút sang "Bắt đầu"
  btnStart.textContent = 'Bắt đầu';
  btnStart.className = 'btn btn-start';

  // Đặt lại bảng về vị trí ban đầu
  boardState = [...WIN_STATE];
  renderBoard();
}

// Sự kiện nút Bắt đầu / Kết thúc
btnStart.addEventListener('click', () => {
  if (!isPlaying) {
    startGame();
  } else {
    endGame();
  }
});

// Nút Chơi lại từ Popup Win
btnRestart.addEventListener('click', () => {
  winOverlay.classList.add('hidden');
  startGame();
});

// Lắng nghe sự kiện bàn phím (A, W, S, D và các phím mũi tên)
window.addEventListener('keydown', (e) => {
  const key = e.key;

  if (key === 'ArrowUp' || key === 'w' || key === 'W') {
    e.preventDefault();
    moveBlackTile('UP');
  } else if (key === 'ArrowDown' || key === 's' || key === 'S') {
    e.preventDefault();
    moveBlackTile('DOWN');
  } else if (key === 'ArrowLeft' || key === 'a' || key === 'A') {
    e.preventDefault();
    moveBlackTile('LEFT');
  } else if (key === 'ArrowRight' || key === 'd' || key === 'D') {
    e.preventDefault();
    moveBlackTile('RIGHT');
  }
});

// Khởi tạo hiển thị ban đầu
renderBoard();
renderHistory();
