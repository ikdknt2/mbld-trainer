let db;

const request = indexedDB.open("bldDB",1);

request.onupgradeneeded = function(e){
    db = e.target.result;
    db.createObjectStore("times",{keyPath:"id",autoIncrement:true});
};

request.onsuccess = function(e){
    db = e.target.result;
    loadTimes();
};

function parseTime(str){

    if(!str) return NaN;

    const parts = str.split(":");

    if(parts.length === 1){
        return parseFloat(parts[0]);
    }

    const min = parseInt(parts[0]);
    const sec = parseFloat(parts[1]);

    return min * 60 + sec;
}

function formatTime(sec){

    const m = Math.floor(sec / 60);
    const s = (sec % 60).toFixed(2).padStart(5,"0");

    return `${m}:${s}`;
}

function saveTime(){

    const time = parseFloat(document.getElementById("timeInput").value);
    const attempted = parseInt(document.getElementById("attemptedInput").value);
    const solved = parseInt(document.getElementById("solvedInput").value);
    const penalties = parseInt(document.getElementById("penaltyInput").value) || 0;

    if(solved > attempted){
        alert("Solved cannot exceed Attempted");
        return;
    }

    if(penalties > solved){
        alert("Penalty cannot exceed Solved");
        return;
    }

    const tx = db.transaction("times","readwrite");
    const store = tx.objectStore("times");

    store.add({
        time: time,           // ← 必ず数値
        attempted: attempted,
        solved: solved,
        penalties: penalties,
        date: Date.now()
    });

    tx.oncomplete = function(){
        document.getElementById("timeInput").value = "";
        document.getElementById("attemptedInput").value = "";
        document.getElementById("solvedInput").value = "";
        document.getElementById("penaltyInput").value = "";
        loadTimes();
    };

}

function loadTimes(){

    const tx = db.transaction("times","readonly");
    const store = tx.objectStore("times");

    const req = store.getAll();

    req.onsuccess = function(){

        const data = req.result;

        let out="";

        for(let i=data.length-1;i>=0;i--){

            const point = 2 * data[i].solved - data[i].attempted;
    
            let timeText;

            if(point <= 1){
            timeText = "DNF(" + point + ")";
            }else{
            timeText = formatTime(data[i].time);
        }

    out += `
    <div>
    ${data[i].solved} / ${data[i].attempted} [${timeText}]
    <button onclick="showInfo(${data[i].id})">...</button>
    <button onclick="deleteTime(${data[i].id})">❌</button>
    </div>
    `;
}
        document.getElementById("timeList").innerHTML = out;
    };

}

function showInfo(id){

  const tx = db.transaction("times","readonly");
  const store = tx.objectStore("times");

  const req = store.get(id);

  req.onsuccess = function(){

    const data = req.result;

    const attempted = data.attempted;
    const solved = data.solved;
    const penalties = data.penalties || 0;

    const point = 2 * solved - attempted;

    const finalTime = data.time + penalties * 2;

    let pointText;

    if(point <= 1){
      pointText = "DNF(" + point + ")";
    }else{
      pointText = point;
    }

    alert(
      "Time: " + formatTime(finalTime) + "\n" +
      "Penalties: " + penalties + "\n" +
      "Attempted: " + attempted + "\n" +
      "Solved: " + solved + "\n" +
      "Point: " + pointText
    );

  };

}

function deleteTime(id){

    if(!confirm("この結果を削除しますか？")){
        return;
    }

    const tx = db.transaction("times","readwrite");
    const store = tx.objectStore("times");

    store.delete(id);

    tx.oncomplete = loadTimes;
}

window.saveTime = saveTime;
window.deleteTime = deleteTime;
window.showInfo = showInfo;
