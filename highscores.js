//we want a reference to the high scores list
const highScoresList = document.getElementById("highScoresList");

//we want to get the high scores out of storage
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

highScoresList.innerHTML = highScores.map(score => {
    return `<li class = "high-score"> ${score.name} - ${score.score}</li>`;
}).join(" ");



