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

    const tx = db.transaction("times","readwrite");
    const store = tx.objectStore("times");

    store.add({time:time});

    tx.oncomplete = loadTimes;
}

function loadTimes(){

    const tx = db.transaction("times","readonly");
    const store = tx.objectStore("times");

    const req = store.getAll();

    req.onsuccess = function(){

        const data = req.result;

        let out="";

        for(let i=0;i<data.length;i++){
            out += data[i].time + "<br>";
        }

        document.getElementById("timeList").innerHTML = out;
    };
}
