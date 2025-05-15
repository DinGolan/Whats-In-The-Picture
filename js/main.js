/**************************************/
/* Exercise 1 - What's In the Picture */
/**************************************/
'use strict';

// Global Variables //
var gCorrectAnswersCount = 0;
var gCountQuests   = 0;
var gCurrQuestIdx  = undefined;
var gTimerInterval = undefined;
var gTimeLeft      = undefined;
var gQuests        = [];
const NUM_OF_QUEST = 4;

// Implementations //
function initGame() {
    if (gTimerInterval) clearInterval(gTimerInterval); // Stop any active timer before restarting the game //
    gCountQuests = 0;
    gCorrectAnswersCount = 0;

    createQuests();
    gCurrQuestIdx = getRandQuestNum();
    renderQuest();
}

function getRandQuestNum() {
    let randIdx = Math.floor(Math.random() * gQuests.length);
    return randIdx;
}

function createQuests() {
    for (let i = 0; i < NUM_OF_QUEST; i++) {
        let currQuest = createQuest(i + 1);
        gQuests.push(currQuest);
    }
}

function createQuest(questId) {
    let options = generateOptions(questId);

    return {
        id: questId,
        opts: options,
        correctOptIdx: questId % 2
    };
} 

function generateOptions(questId) {
    switch(questId) {
        case 1:  return ['Dog', 'Cow'];
        case 2:  return ['Elephant', 'Rabbit'];
        case 3:  return ['Lion', 'Penguin'];
        case 4:  return ['Horse', 'Giraffe'];
        default: return null;
    }
}

function renderQuest() {
    let currQuest = gQuests[gCurrQuestIdx];
    let altValue  = currQuest.opts[currQuest.correctOptIdx];
    let opt_1     = currQuest.opts[0];
    let opt_2     = currQuest.opts[1];
    const numSec  = 10;

    let strHTML = `
        <p class="timer">Time Left : <span class="seconds">${numSec}</span> (sec)</p>
        <img src="img/${currQuest.id}.jpg" alt="${altValue}" class="quest-img">
        <div>
            <button class="button" onclick="onButtonClick(this)">${opt_1}</button>
            <button class="button" onclick="onButtonClick(this)">${opt_2}</button>
        </div>`;

    const elContainer     = document.querySelector('.container');
    elContainer.innerHTML = strHTML;

    if (gTimerInterval) clearInterval(gTimerInterval); // Clear previous timer before starting a new one for this question //
    startTimer();
}

function onButtonClick(elBtn) {
    if (gTimerInterval) clearInterval(gTimerInterval); // Stop timer when user answers (to prevent overlap) //

    const delayMs  = 200; 
    let currQuest  = gQuests[gCurrQuestIdx];
    let correctAns = currQuest.opts[currQuest.correctOptIdx];

    const isCorrect = elBtn.innerText === correctAns;
    const resTxt    = isCorrect ? 'correct' : 'wrong'
    elBtn.classList.add(resTxt);

    const sound = new Audio(`sound/${resTxt}.mp3`);
    sound.play();

    if (isCorrect) gCorrectAnswersCount++;
    setTimeout(moveToNextQuest, delayMs);
}

function moveToNextQuest() {
    gCountQuests++;

    if (gCountQuests >= NUM_OF_QUEST) {
        showGameResult();
    } else {
        gCurrQuestIdx = (gCurrQuestIdx + 1) % NUM_OF_QUEST; // Move to Next Question //
        renderQuest();
    }
}

function startTimer() {
    const delayMs = 1000;
    gTimeLeft = 10;
    updateTimerDisplay();

    gTimerInterval = setInterval(() => {
        gTimeLeft--;
        updateTimerDisplay();

        if (gTimeLeft === 0) {
            if (gTimerInterval) clearInterval(gTimerInterval); // Stop timer when time runs out //
            moveToNextQuest();
        }
    }, delayMs);
}

function updateTimerDisplay() {
    const elSeconds = document.querySelector('.seconds');
    if (elSeconds) elSeconds.innerText = gTimeLeft;
}

function showGameResult() {
    const elContainer = document.querySelector('.container');
    const percentage  = Math.round((gCorrectAnswersCount / NUM_OF_QUEST) * 100);
    let resTxt        = '';

    if (percentage === 100)    resTxt = '🌟 Excellent 🌟';
    else if (percentage >= 75) resTxt = '👍 Well Done 👍';
    else if (percentage >= 50) resTxt = '🙂 Not Bad 🙂';
    else {
        resTxt = '😕 Try Again 😕';
    }

    elContainer.innerHTML = `
        <h1 class="game-over-msg">🧠 Game Over 🧠</h1>
        <p class="game-score">You Answered <span class="bold-text">${gCorrectAnswersCount}</span> out of <span class="bold-text">${NUM_OF_QUEST}</span> correctly (${percentage}%)</p>
        <p class="result-text">${resTxt}</p>
        <button class="restart-btn" onclick="initGame()">Restart</button>`; 
}