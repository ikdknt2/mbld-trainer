function copyScrambles(){

  const text = document.getElementById("scrambleList").innerText;

  navigator.clipboard.writeText(text)
  .then(()=>alert("Copied!"))
  .catch(()=>alert("Copy failed"));

}

window.copyScrambles = copyScrambles;
