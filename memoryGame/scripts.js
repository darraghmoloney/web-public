const buttonList = [{
    id: "greenCircle",
  },
  {
    id: "redCircle",
  },
  {
    id: "yellowCircle",
  },
  {
    id: "blueCircle",
  }
];

const startWaitTime = 700; //to revert time speed changes


let blinkWaitTime = 700; //time between blinks
let flashTime = 400; //length of button flash animation

let loseGameBlink; //timer for end game flash

let finishedBlink = false; //to handle 5-second click timer, etc

let flashList = [] //generate buttons to flash
let shownItems = []; //track list of shown buttons for game logic
let clickedItems = []; //track user input
let gameOver = false; //to break out of gameplay loop
let roundNumber = 1; //track current round for button flash loop

let clickTimer; //allow 5 seconds between clicks before game over


let recordScore = 0;

/*  Flash a specific light by adding the CSS flash animation.
*/
function blinkButton(item) {
  let blinkItem = item;
  document.getElementById(blinkItem).style.animation = `flash ${flashTime}ms`;
  setTimeout(function() {
      document.getElementById(blinkItem).style.animation = "";
    },
    flashTime);
    shownItems.push(item);
}


function blinkAll() {
  let button = ["greenCircle", "redCircle", "yellowCircle", "blueCircle"];

  for(const b of button) {
    document.getElementById(b).style.animation = `flash ${flashTime}ms`;
    setTimeout(function() {
        document.getElementById(b).style.animation = "";
      },
      flashTime);
  }
}

/*  Simple random algorithm - could be improved
*/
function getRandomLoc() {
  return Math.floor(Math.random() * buttonList.length);
}

function getRandomButtonId() {
  let randomLoc = getRandomLoc();
  return buttonList[randomLoc].id;
}


/*  Based on MDN
  https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener
*/
function removeClickListeners() {
  document.getElementById("greenCircle").removeEventListener("click", onGreenClick);
  document.getElementById("redCircle").removeEventListener("click", onRedClick);
  document.getElementById("yellowCircle").removeEventListener("click", onYellowClick);
  document.getElementById("blueCircle").removeEventListener("click", onBlueClick);

  /*  Change the cursor pointer effect
      based on https://alligator.io/js/classlist/
   */
  let activeButtons = document.querySelectorAll(".smallCircle");
  activeButtons.forEach((item, i) => {
      item.classList.remove("hover");
      item.classList.remove("click");
  });

}
/*  From MDN
  https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
*/
function addClickListeners() {
  document.getElementById("greenCircle").addEventListener("click", onGreenClick);
  document.getElementById("redCircle").addEventListener("click", onRedClick);
  document.getElementById("yellowCircle").addEventListener("click", onYellowClick);
  document.getElementById("blueCircle").addEventListener("click", onBlueClick);

  /*  Make the cursor turn into a pointer when click is allowed */
  let activeButtons = document.querySelectorAll(".smallCircle");
  activeButtons.forEach((item, i) => {
      item.classList.add("hover");
      item.classList.add("click");
  });


}

async function blinkMany(numItems) {

  finishedBlink = false;

  /*	Disable click while buttons flash	*/
  removeClickListeners();


  /*	Loop up to the number of items, showing a random one
  		each time, with a setTimeout proportional to the
      item number. This is a bit of a hack.
  */
  for (let i = 0; i < numItems; i++) {
    setTimeout( function() {blinkButton(flashList[i])}, blinkWaitTime * i);
  }

  /*	Wait for all items to finish blink, and return
   */

  setTimeout(function() {
    finishedBlink = true;

    console.log(`flashing finished`);

    /*	Allow click only after items blinked */
    addClickListeners();

    console.log(shownItems);

    /* Allow 5 seconds for click before ending game */
    clickTimer = setTimeout(function() {endGame("TIME'S UP!")}, 5000);

  }, blinkWaitTime * numItems);

}

const onGreenClick = () => {
  // console.log(`green clicked`);

  clickedItems.push("greenCircle");

  console.log(clickedItems.toString());
  // console.log(shownItems.toString());

  clearTimeout(clickTimer);

  checkGameOver();
}

const onRedClick = () => {
  // console.log(`red clicked`);

  clickedItems.push("redCircle");

  console.log(clickedItems.toString());
  // console.log(shownItems.toString());


  clearTimeout(clickTimer);

  checkGameOver();
}

const onYellowClick = () => {
  // console.log(`yellow clicked`);

  clickedItems.push("yellowCircle");

  console.log(clickedItems.toString());
  // console.log(shownItems.toString());

  clearTimeout(clickTimer);

  checkGameOver();
}

const onBlueClick = () => {
  // console.log(`blue clicked`);

  clickedItems.push("blueCircle");

  console.log(clickedItems.toString());
  // console.log(shownItems.toString());

  clearTimeout(clickTimer);

  checkGameOver();
}

const onStartClick = () => {

  console.log(`start clicked`);
  /*  Add color to indicator light with glow effect
      Based on
      https://www.w3docs.com/snippets/css/how-to-create-flashing-glowing-button-using-animation-in-css3.html
  */

  document.getElementById("indicator").style.backgroundColor = "#39ff14";
  document.getElementById("indicator").style.boxShadow = "0px 0px 5px 5px #0ff";

	playGame();

}

document.getElementById("startButton").addEventListener("click", onStartClick);

function playGame() {
    let startElement = document.querySelector("#startButton");
    startElement.classList.remove("hover");
  	document.getElementById("startButton").removeEventListener("click", onStartClick);
    document.getElementById("startButton").innerHTML="GET READY...";
    document.getElementById("startButton").style.color ="lightgreen";

    flashList = [];
    setTimeout( function() {playRound(roundNumber)}, 3000);


}

function playRound(roundNum) {
    console.log(`round ${roundNum}`);
		shownItems = [];
  	clickedItems = [];
    document.getElementById("startButton").innerHTML= `ROUND ${roundNumber}`;
    document.getElementById("startButton").style.color ="yellow";

    flashList.push( getRandomButtonId() );
		blinkMany(roundNum);
}

function checkGameOver() {
	/*	Condition 1 - the last clicked item doesn't match that
  		shown item at the same point in the shown item list
      i.e.the wrong answer was clicked
  */
  if(clickedItems[clickedItems.length-1] !== shownItems[clickedItems.length-1] ) {

      endGame("WRONG ONE!");
      clearTimeout(clickTimer); //causing bugs, so added here too
  }
  /*	Condition 2 -first check failed so all items were correct,
  		and all items were clicked -> win condition.
      If all items were clicked, that list is the same length
      as the shown items
  */
  else if(clickedItems.length === shownItems.length) {
  		gameOver = false;
      roundNumber++;

			incrementScore();

      document.getElementById("startButton").innerHTML= `CLEAR`;
      document.getElementById("startButton").style.color ="lightblue";

      /*Decrease the flash interval if round is the 5th,
        9th or 13th
        This is an (if / else if) so the change is only
        applied once
        Interval is decreased to 85% each time
      */
      if(roundNumber % 5 === 0) {
        blinkWaitTime = Math.round(blinkWaitTime * 0.85);
        document.getElementById("startButton").innerHTML= `FASTER...`;
      }
      else if(roundNumber % 9 === 0) {
        blinkWaitTime = Math.round(blinkWaitTime * 0.85);
        document.getElementById("startButton").innerHTML= `FASTER...`;
      }
      else if(roundNumber % 13 === 0) {
        blinkWaitTime = Math.round(blinkWaitTime * 0.85);
        document.getElementById("startButton").innerHTML= `FASTER...`;
      }

      /* Give 1 second between rounds */
      setTimeout( function() {playRound(roundNumber)}, 500);
  } else {
  	/*	Condition 3 - game is still being played */
      gameOver = false;
      incrementScore();

      /*  As the game continues, the click timer should start again */
      clickTimer = setTimeout( function() {endGame("TIME'S UP!")}, 5000);
  }

}

function incrementScore() {
	let score = parseInt(document.getElementById("currentScore").innerHTML);
  score++;
  checkTopScore(score);
  if(score < 10) { //Padded for niceness
  	score = "0" + score;
  }
  document.getElementById("currentScore").innerHTML = score;
}

function checkTopScore(score) {
	let topContainer = document.getElementById("topScore");
	let currentTop = parseInt(topContainer.innerHTML);

  if(score > currentTop) {
    if(score > recordScore) {
      recordScore = score;
    }
  	if(score < 10) {
    	score = "0" + score;
    }
    topContainer.innerHTML = score;
    topContainer.style.color = "green";
  }
}

function resetGame() {
  console.log(`game reset`);
  clearTimeout(loseGameBlink);
	roundNumber = 1;
  let startElement = document.querySelector("#startButton")
  startElement.classList.add("hover");
	document.getElementById("startButton").addEventListener("click", onStartClick);
  document.getElementById("startButton").innerHTML = "START";
  document.getElementById("startButton").style.color = "white";
  document.getElementById("currentScore").innerHTML = "00";
  document.getElementById("topScore").style.color = "black";
  document.getElementById("indicator").style.boxShadow = "";
  flashList = [];
}


function endGame(comment) {
  console.log(`game over - ${comment}`)
  gameOver = true;
  removeClickListeners();

  for (let i = 0; i < 5; i++) {
    loseGameBlink = setTimeout(blinkAll, blinkWaitTime * i);
  }

  document.getElementById("startButton").innerHTML = comment;
  setTimeout(
    function() {document.getElementById("startButton").innerHTML = "GAME OVER"},
    1000);
  document.getElementById("startButton").style.color = "red";
  document.getElementById("indicator").style.backgroundColor = "red";
  document.getElementById("indicator").style.boxShadow = "0px 0px 3px 3px red";

  blinkWaitTime = startWaitTime; //revert to original value

  clearTimeout(clickTimer); //just in case it's still active



  setTimeout(resetGame, 4000);
}
