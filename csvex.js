function exportCSV(){

    const tx = db.transaction("times","readonly");
    const store = tx.objectStore("times");

    const req = store.getAll();

    req.onsuccess = function(){

        const data = req.result;

        if(data.length === 0){
            alert("No data");
            return;
        }

        let csv = "Time,Attempted,Solved,Penalties,Point,Date\n";

        data.forEach(d => {

            const penalties = d.penalties || 0;
            const finalTime = d.time + penalties * 2;
            const point = 2 * d.solved - d.attempted;

            const date = new Date(d.date).toLocaleString();

            csv +=
                formatTime(finalTime) + "," +
                d.attempted + "," +
                d.solved + "," +
                penalties + "," +
                point + "," +
                date + "\n";
        });

        const blob = new Blob([csv], {type:"text/csv"});

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "bld_times.csv";
        a.click();

        URL.revokeObjectURL(url);
    };
}

window.exportCSV = exportCSV;
