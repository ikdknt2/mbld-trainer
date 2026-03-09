function importCSV(){

    const fileInput = document.getElementById("csvFile");

    if(fileInput.files.length === 0){
        alert("CSVファイルを選択してください");
        return;
    }

    const file = fileInput.files[0];

    const reader = new FileReader();

    reader.onload = function(e){

        const text = e.target.result;

        const lines = text.trim().split("\n");

        lines.shift(); // ヘッダー削除

        const tx = db.transaction("times","readwrite");
        const store = tx.objectStore("times");

        lines.forEach(line => {

            const cols = line.split(",");

            const timeStr = cols[0];
            const attempted = parseInt(cols[1]);
            const solved = parseInt(cols[2]);
            const penalties = parseInt(cols[3]);
            const date = new Date(cols[5]).getTime();

            const time = parseTime(timeStr) - penalties * 2;

            store.add({
                time: time,
                attempted: attempted,
                solved: solved,
                penalties: penalties,
                date: date
            });

        });

        tx.oncomplete = function(){
            loadTimes();
            alert("Import complete");
        };

    };

    reader.readAsText(file);
}

window.importCSV = importCSV;
