const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];

//res is response
fetch("https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple").then( res => {
    return res.json(); //will get the body and converse into json
}).then(loadedQuestions => {
    questions = loadedQuestions.results.map(loadedQuestion =>{
        const formattedQuestion = {
            question: loadedQuestion.question
        };

        const answerChoices = [...loadedQuestion.incorrect_answers];
        formattedQuestion.answer = Math.floor(Math.random()*3) + 1;
        // need the minus one because our array is not zero based but we need zero based
        answerChoices.splice(formattedQuestion.answer - 1, 0, loadedQuestion.correct_answer);


        answerChoices.forEach((choice, index) => {
            formattedQuestion["choice" + (index+1)] = choice;
        });

        return formattedQuestion;
    });
    startGame();
}).catch(err =>{
    console.error(err);
});

//Constants
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 3;

startGame = () =>{
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
}

getNewQuestion = () =>{

    /* if theres no questions left in the array or the question counter goes above the max questions then it ends the game */
    if (availableQuestions.length === 0 ||questionCounter >= MAX_QUESTIONS){
        localStorage.setItem("mostRecentScore", score);
        return window.location.assign('/end.html');
    }

    questionCounter++;
    /* updates the actual text on screen based on the question that theyre on*/
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;

    //update the progress bar, must be a value in pixels
    progressBarFull.style.width = `${(questionCounter/MAX_QUESTIONS) *100}%`;

    const questionIndex = Math.floor(Math.random()* availableQuestions.length);
    currentQuestion = availableQuestions [questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach( choice =>{
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    });

    availableQuestions.slice(questionIndex, 1); /* gets rid of the questions that were already used */

    acceptingAnswers = true;
}

choices.forEach(choice => {
    choice.addEventListener('click', e =>{
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        /* for creating graphics to show whether the answer selected is correct or incorrect */
        const classToApply = 
        selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

        /* keeps track of the score by calling the incrementScore function and passing through the correct bonus to update the score if the user got the answer right */
        if (classToApply === 'correct'){
            incrementScore(CORRECT_BONUS);
        }

        /* it applies the 'classToApply' to the classes in the parent element found in the game.html */
        selectedChoice.parentElement.classList.add(classToApply);

        /* the setTimeOut callback function lets you add the classtoApply for a short period of time before it gets removed, so it waits 1 second before it removes the classToApply*/
        setTimeout( () =>{
                /* we immediately remove it after because we only want the color to show for a little bit, then move on */
                selectedChoice.parentElement.classList.remove(classToApply);
                getNewQuestion();
        },1000);

        
    });
});

incrementScore = num =>{
    score+=num;
    scoreText.innerText = score;
};
