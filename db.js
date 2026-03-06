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

function saveTime(){

    const time = parseFloat(document.getElementById("timeInput").value);
    const solved = parseInt(document.getElementById("solvedInput").value);
    const attempted = parseInt(document.getElementById("attemptedInput").value);

    const point = solved - (attempted - solved);

    const now = new Date();

    const tx = db.transaction("times","readwrite");
    const store = tx.objectStore("times");

    store.add({
        time:time,
        solved:solved,
        attempted:attempted,
        point:point,
        date:now.toISOString()
    });

    tx.oncomplete = function(){

        loadTimes();

        document.getElementById("timeInput").value="";
        document.getElementById("solvedInput").value="";
        document.getElementById("attemptedInput").value="";
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

            out += `
            <div>
            ${data[i].solved} / ${data[i].attempted} [${data[i].time}]
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

        const d = req.result;

        const date = new Date(d.date);

        const formatted =
        date.getFullYear() + "/" +
        String(date.getMonth()+1).padStart(2,"0") + "/" +
        String(date.getDate()).padStart(2,"0") + " " +
        String(date.getHours()).padStart(2,"0") + ":" +
        String(date.getMinutes()).padStart(2,"0");

        alert(`${d.point} point, ${formatted}`);
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
