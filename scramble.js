const faceMoves = ["U","D","L","R","F","B"];
const wideMoves = ["Uw","Rw","Fw"];
const suffixes  = ["", "'", "2"];

// グループ判定
function getGroup(move){
  if (move === "R" || move === "L") return 1;
  if (move === "U" || move === "D") return 2;
  if (move === "F" || move === "B") return 3;
  return 0;
}

// face move生成（同face2連 & 同グループ3連NG）
function randomFaceMove(last1, last2){
  let move;
  while (true){
    move = faceMoves[Math.floor(Math.random() * faceMoves.length)];

    if (last1 && move === last1) continue;
    if (last1 && last2 &&
        getGroup(move) === getGroup(last1) &&
        getGroup(move) === getGroup(last2)) {
      continue;
    }
    break;
  }

  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  return move + suffix;
}

// スクランブル生成
function generateScramble(){
  let scramble = [];
  let last1 = null;
  let last2 = null;

  // 前半: 18〜22手
  const faceCount = 18 + Math.floor(Math.random() * 5);
  for (let i = 0; i < faceCount; i++){
    const mv = randomFaceMove(last1, last2);
    scramble.push(mv);

    last2 = last1;
    last1 = mv.replace(/['2]$/, "");
  }

  // 後半: wide 0〜2手
  const wideCount = Math.floor(Math.random() * 3);
  for (let i = 0; i < wideCount; i++){
    const w = wideMoves[Math.floor(Math.random() * wideMoves.length)];
    const s = suffixes[Math.floor(Math.random() * suffixes.length)];
    scramble.push(w + s);
  }

  document.getElementById("scramble").textContent = scramble.join(" ");
}

// ボタン紐づけ
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("gen").addEventListener("click", generateScramble);
});

//　呼び出し可能関数
window.makeScramble = makeScramble;
