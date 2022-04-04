const username = document.getElementById('username');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');

//get whats in local storage and saves it into the array highScores OR return an empty array
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

const MAX_HIGH_SCORES = 5;

finalScore.innerText = mostRecentScore;

username.addEventListener('keyup', () =>{
    //when theres no username value, the save score button will be disabled
    saveScoreBtn.disabled = !username.value;
})

saveHighScore = e =>{
    e.preventDefault();

    //score object that has a score that references the most recent score
    const score = {
        score: mostRecentScore,
        name: username.value
    };

    //pushes the new score into the highScore array
    highScores.push(score);

    //SORTING THE ARRAY FROM HIGHEST TO LOWEST - if the b score is lower than the a score, then put b before a (return is implicit)
    highScores.sort((a,b) => b.score - a.score)

    //cut off anything from the array at index 5
    highScores.splice(5);

    //need to update the high scores
    localStorage.setItem('highScores', JSON.stringify(highScores));
    
    //we go back home once we save the score
    window.location.assign('/');
};