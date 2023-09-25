/*
  Advices
  - Always Check The Console
  - Take Your Time To Name The Identifiers
  - DRY

  Steps To Create The Project
  [01] Create HTML Markup
  [02] Add Styling And Separate From Logic
  [03] Create The App Logic
  ---- [01] Add Levels
  ---- [02] Show Level And Seconds
  ---- [03] Add Array Of Words
  ---- [04] ِAdd Start Game Button
  ---- [05] Generate Upcoming Words
  ---- [06] Disable Copy Word And Paste Event + Focus On Input
  ---- [07] Start Play Function
  ---- [08] Start The Time And Count Score
  ---- [09] Add The Error And Success Messages
  [04] Your Trainings To Add Features
  ---- [01] Save Score To Local Storage With Date
  ---- [02] Choose Levels From Select Box
  ---- [03] Break The Logic To More Functions
  ---- [04] Choose Array Of Words For Every Level
  ---- [05] Write Game Instruction With Dynamic Values
  ---- [06] Add 7 Seconds For The First Word
*/
let testedWord = document.querySelector(".tested__word"); // Make sure to use the correct selector
let input = document.querySelector(".input");
let startBtn = document.querySelector(".start");
let theWord = document.querySelector(".word"); 
let timeLeft = document.querySelector(".time span")
let scoreGot = document.querySelector(".score .got")
let scoreTotal = document.querySelector(".score .total")
let lvlNameSpan = document.querySelector(".typing__title .lvl");
let secondsSpan = document.querySelector(".typing__title .seconds");
const rangeInput = document.getElementById("rangeInput");
const selectedValue = document.getElementById("selectedValue");
let levelsBtn = document.querySelectorAll(".levels")
let finishMessage = document.querySelector(".finish");
const lvls = {
    "Easy": 7,
    "Normal": 5,
    "Hard": 3
};


let defaultLvl = "Easy";
let defaultLevelSeconds = lvls[defaultLvl];
let fetchedWords = []


// Get the random data
async function fetchDataFromAPI() {
  const apiUrl = 'https://random-word-api.herokuapp.com/word';

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        fetchedWords.push(data[0]);
        return data[0]; // Return the fetched word
    } catch (error) {
        console.error('Fetch error:', error);
        throw error; // Rethrow the error to handle it elsewhere if needed
    }
}

levelsBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        levelsBtn.forEach((li) => {
            li.classList.remove("active");
      });
      window.localStorage.setItem("color" , e.currentTarget.dataset.color)
      e.currentTarget.classList.add("active");
      main.style.backgroundColor = e.currentTarget.dataset.color;
    });
});

// add words to fetched data
function displayRandomWords(words) {

  fetchedWords.push(words[0])
}
// Get references to the HTML elements


// Add an event listener to the input range element
rangeInput.addEventListener("input", ()=>{
    const value = rangeInput.value;
    switch (value){
        case '1':
            selectedValue.textContent = "Easy";
            defaultLvl ="Easy"
            defaultLevelSeconds = lvls[defaultLvl];
            lvlNameSpan.innerHTML = defaultLvl;
            secondsSpan.innerHTML = defaultLevelSeconds;

            break;
        case "3":
            selectedValue.textContent = "Hard";
            defaultLvl ="Hard"
            defaultLevelSeconds = lvls[defaultLvl];
            lvlNameSpan.innerHTML = defaultLvl;
            secondsSpan.innerHTML = defaultLevelSeconds;
            break;
        default :
            selectedValue.textContent = "Normal";
            defaultLvl ="Normal"
            defaultLevelSeconds = lvls[defaultLvl];
            lvlNameSpan.innerHTML = defaultLvl;
            secondsSpan.innerHTML = defaultLevelSeconds;
    }
});

lvlNameSpan.innerHTML = defaultLvl;
secondsSpan.innerHTML = defaultLevelSeconds;

startBtn.onclick = function () {
    this.remove();
    rangeInput.remove();
    input.focus();
    for (let i = 0 ; i <= 10; i++){
        fetchDataFromAPI();
    }
    let score = fetchedWords.length
    scoreTotal.innerHTML = score

    // Generate Word Function
    genWords();
}

input.onpaste = () => {return false;}

function genWords() {
    // init the random word 
    let randomWord = fetchedWords[Math.floor(Math.random() * fetchedWords.length)];
    // get the index of this  word 
    let  index = fetchedWords.indexOf(randomWord)
    fetchedWords.splice(index, 1);
    theWord.innerHTML = randomWord;

    startPlay();

}


function startPlay() {
    timeLeft.innerHTML = defaultLevelSeconds;
    let start = setInterval(() => {
        timeLeft.innerHTML--;
        if (timeLeft.innerHTML === "0") {
            clearInterval(start);
            if (theWord.innerHTML.toLowerCase() === input.value.toLowerCase()) {
                // Empty Input Field
                let div = document.createElement("div");
                let txt = document.createTextNode(theWord.innerHTML);
                div.appendChild(txt);
                div.classList= "tested";
                testedWord.appendChild(div)
                
                input.value = '';
                // Increase Score
                scoreGot.innerHTML++;
                if (fetchedWords.length > 0) {
                    // Call Generate Word Function
                    genWords();
                }
                else {
                    let span = document.createElement("span");
                    span.className = 'good';
                    let spanText = document.createTextNode("Congratz");
                    span.appendChild(spanText);
                    finishMessage.appendChild(span);
                    // Remove Upcoming Words Box
                    upcomingWords.remove();
                    }
                }
            else {
                let span = document.createElement("span");
                span.className = 'bad';
                let spanText = document.createTextNode("Game Over");
                span.appendChild(spanText);
                finishMessage.appendChild(span);
                setTimeout(()=>{
                    location.reload();
                },3000)
              }
        }
    }, 1000);
}
