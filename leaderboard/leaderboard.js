const tbody = document.querySelector("tbody");
const createTableCell = (content) => {
  return "<td>" + content + "</td>";
}
const createLeaderBoardEntry = (rank, name, score, time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  const timeDisplay = minutes + "m " + seconds + "s";
  return "<tr>" + createTableCell(rank + ".") + createTableCell(name) + createTableCell(score) + createTableCell(timeDisplay) + "</tr>";
}

fetch('./get_leaderboard.php').then(res => res.json()).then(data => {
  let rank = 1
  data.forEach(entry => {
  const tr = document.createElement("tr");
  tr.innerHTML = createLeaderBoardEntry(rank, entry.name,entry.score,entry.time);
  tbody.appendChild(tr);
  rank++;
})
});


