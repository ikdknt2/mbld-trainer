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

    const timeStr = document.getElementById("timeInput").value;

    // Time形式チェック
    const pattern = /^(\d+(\.\d{1,2})?|\d+:[0-5]\d(\.\d{1,2})?)$/;

    if(!pattern.test(timeStr)){
        alert("Time must be SS, SS.ss, M:SS or M:SS.ss (seconds 00-59)");
        return;
    }

    const time = parseTime(timeStr);

    if(isNaN(time)){
        alert("Invalid time");
        return;
    }

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
        time: time,
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

        const mode = document.getElementById("sortMode").value;

        if(mode === "time"){
            data.sort((a,b)=>(a.time+(a.penalties||0)*2)-(b.time+(b.penalties||0)*2));
        }

        if(mode === "solved"){
            data.sort((a,b)=>b.solved-a.solved);
        }

        if(mode === "point"){
            data.sort((a,b)=>(2*b.solved-b.attempted)-(2*a.solved-a.attempted));
        }

        if(mode === "date"){
            data.sort((a,b)=>b.date-a.date);
        }

        updatePB(data);
        updatePointPB(data);

        let out="";

        for(let i=0;i<data.length;i++){

            const point = 2 * data[i].solved - data[i].attempted;

            let pointText;
            if(point <= 1){
                pointText = "DNF(" + point + ")";
            }else{
                pointText = point;
            }

            const finalTime = data[i].time + (data[i].penalties || 0) * 2;

            out += `
            <div class="timeRow">
            
            <div class="timeSolved">
            ${data[i].solved} / ${data[i].attempted}
            </div>
            
            <div class="timeTime">
            [${formatTime(finalTime)}]
            </div>
            
            <div class="timePoint">
            ${pointText}
            </div>
            
            <div class="timeButtons">
            <button onclick="showInfo(${data[i].id})">...</button>
            <button onclick="deleteTime(${data[i].id})">❌</button>
            </div>
            
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

    const dateText = new Date(data.date).toLocaleString();

    alert(
      "Time: " + formatTime(finalTime) + "\n" +
      "Penalties: " + penalties + "\n" +
      "Attempted: " + attempted + "\n" +
      "Solved: " + solved + "\n" +
      "Date: " + dateText + "\n" +
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

function updatePB(data){

    if(data.length === 0){
        document.getElementById("pbSolved").innerText = "No record";
        return;
    }

    let best = data[0];

    for(let i=1;i<data.length;i++){
        if(data[i].solved > best.solved){
            best = data[i];
        }
    }

    const finalTime = best.time + (best.penalties || 0) * 2;

    document.getElementById("pbSolved").innerText =
        "PB(Solved): " + best.solved + " / " + best.attempted +
        " [" + formatTime(finalTime) + "]";
}

function updatePointPB(data){

    if(data.length === 0){
        document.getElementById("pbPoint").innerText = "No record";
        return;
    }

    let best = data[0];

    for(let i=1;i<data.length;i++){

        const pointCurrent = 2 * data[i].solved - data[i].attempted;
        const pointBest = 2 * best.solved - best.attempted;

        if(pointCurrent > pointBest){
            best = data[i];
        }

    }

    const finalTime = best.time + (best.penalties || 0) * 2;
    const point = 2 * best.solved - best.attempted;

    document.getElementById("pbPoint").innerText =
        "PB(Point): " + point + " pt  (" +
        best.solved + "/" + best.attempted +
        " [" + formatTime(finalTime) + "])";
}

function isValidTimeFormat(str){

    const pattern = /^(\d+:\d{2}(\.\d{1,2})?|\d+(\.\d{1,2})?)$/;

    return pattern.test(str);

}

window.saveTime = saveTime;
window.deleteTime = deleteTime;
window.showInfo = showInfo;
