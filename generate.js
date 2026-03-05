// 複数回スクランブルを生成して表示する
function generateManyScrambles(){
  const count = Math.max(1, parseInt(document.getElementById("scrambleCount").value) || 1);
  const list = document.getElementById("scrambleList");

  let html = "";
  for (let i = 1; i <= count; i++){
    // scramble.js の generateScramble() を使わず文字列だけ取得したいので
    // makeScramble() を scramble.js 側で window に公開しておく
    // もしくは generateScramble() を少し改変して返り値を返す形にする
    const scr = makeScramble(); // window.makeScramble() が必要
    html += `<div>${i}. ${scr}</div>`;
  }

  list.innerHTML = html;
}

// 初回表示
generateManyScrambles();
