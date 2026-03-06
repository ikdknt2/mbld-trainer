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

window.saveTime = saveTime;
window.deleteTime = deleteTime;
window.showInfo = showInfo;

function saveTime(){

    const baseTime = parseTime(document.getElementById("timeInput").value);
    const solved = parseInt(document.getElementById("solvedInput").value);
    const attempted = parseInt(document.getElementById("attemptedInput").value);
    const penalty = parseInt(document.getElementById("penaltyInput").value) || 0;

    if(solved > attempted){
        alert("Solved cannot exceed Attempted");
        return;
    }

    if(penalty > solved){
        alert("Penalty cannot exceed Solved");
        return;
    }

    const time = baseTime + penalty * 2;

    const point = solved - (attempted - solved);

    const now = new Date();

    const tx = db.transaction("times","readwrite");
    const store = tx.objectStore("times");

    store.add({
        time: time,
        solved: solved,
        attempted: attempted,
        penalty: penalty,
        date: now.toISOString()
    });

    tx.oncomplete = function(){

        loadTimes();

        document.getElementById("timeInput").value="";
        document.getElementById("solvedInput").value="";
        document.getElementById("attemptedInput").value="";
        document.getElementById("penaltyInput").value="0";
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

            out += `
            <div>
            ${data[i].solved} / ${data[i].attempted} [${formatTime(data[i].time)}]
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

        alert(
        "Time: " + formatTime(finalTime) + "\n" +
        "Penalties: " + penalties + "\n" +
        "Attempted: " + attempted + "\n" +
        "Solved: " + solved + "\n" +
        "Point: " + point
        );

    };
}
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
