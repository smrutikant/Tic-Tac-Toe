const bord = document.getElementById("bord");
const cell_picker = document.getElementsByClassName("ttt-cell");
var combinedNumbersOfMove = 0;
var waitforComp = false;
var chosenValue = false;
var inputSet = [];
var choiceForComputer = "O";
var endGame = false;
var confirmMessage = false;
var tempChoice = "X";
var availableSet = [
  [false, false, false],
  [false, false, false],
  [false, false, false],
];

var theOs = [];
var theXs = [];

var unOccupiedIndexes = [
  "0_0",
  "0_1",
  "0_2",
  "1_0",
  "1_1",
  "1_2",
  "2_0",
  "2_1",
  "2_2",
];

var corners = ["0_0", "0_2", "2_0", "2_2"]; //First preference of computer to be in a attacking mood when there is no risk

const winningSequences = [
  ["0_0", "0_1", "0_2"],
  ["1_0", "1_1", "1_2"],
  ["2_0", "2_1", "2_2"],
  ["0_0", "1_0", "2_0"],
  ["0_1", "1_1", "2_1"],
  ["0_2", "1_2", "2_2"],
  ["0_0", "1_1", "2_2"],
  ["0_2", "1_1", "2_0"],
];

window.onload = function () {
  /*registerSW();*/
  for (var cellcount = 0; cellcount < cell_picker.length; cellcount++) {
    var eachcell = cell_picker[cellcount];
    eachcell.onclick = function () {
      handleCellClicked(this);
    };
  }
};

const setchoice = (theChoice) => {
  var message =
    "Are you sure? You want to play with&nbsp;&nbsp;&nbsp;<span class='close-shadow class" +
    theChoice +
    "'>" +
    theChoice +
    "&nbsp;&nbsp;</span>";
  tempChoice = theChoice;
  openPopup("confirm", message);
};

const handleCellClicked = (cell) => {
  if (!chosenValue) {
    openPopup("alert", "Please pick a choice to continue!");
  } else {
    var choiceHolder = document.getElementById("choiceHolder");
    choiceHolder.innerHTML =
      `You have chosen : <span class='close-shadow class${chosenValue}'>` +
      chosenValue +
      `</span>`;
    if (!waitforComp) {
      waitforComp = true;
      if (cell.innerHTML == "") {
        fillSet(cell.id, chosenValue);
        document.getElementById("loader").classList.toggle("display");
        setTimeout(() => {
          changeTurn();
          document.getElementById("loader").classList.toggle("display");
        }, 1500);
      } else {
        openPopup(
          "alert",
          "This cell is occupied. Please select another cell."
        );
      }
    } else {
      return false;
    }
  }
};

const fillSet = (cellid, cellVal) => {
  if (endGame) {
    document.getElementById("playagain").classList.add("display");
    document.getElementById("gameover-card").classList.add("display");
    return false;
  } else {
    //document.getElementById("playagain").classList.remove("display");
    cell_ref = cellid;
    cellid = cellid.split("_");
    availableSet[cellid[0]][cellid[1]] = cellVal;
    switch (cellVal) {
      case "O":
        theOs.push(cell_ref);
        document.getElementById(cell_ref).classList.add("classO");
        PlaySound("audioO");
        break;
      case "X":
        theXs.push(cell_ref);
        document.getElementById(cell_ref).classList.add("classX");
        PlaySound("audioX");
        break;
    }
    document.getElementById(cell_ref).innerHTML = cellVal;
    removeOccupied(cell_ref);
    combinedNumbersOfMove++;
    if (combinedNumbersOfMove > 4) {
      var gameMessage = checkGame();
      if (gameMessage) {
        document.getElementById("playagain").classList.add("display");
        document.getElementById("gameover-card").classList.add("display");
        document.getElementById("endmessage").innerHTML = gameMessage;
        //alert(gameMessage);
      }
    }
  }
};

const changeTurn = () => {
  attackOponent();
};

const saveSelf = () => {
  var cellsToSave = getTheCellthatCanBeTargeted(chosenValue);
  console.log(choiceForComputer);
  console.log("Cell to save: " + cellsToSave);
  if (cellsToSave.length > 0) {
    fillSet(cellsToSave[0], choiceForComputer);
  } else {
    makeaMove();
  }
};

const attackOponent = () => {
  var cellsTooccupyFor = getTheCellthatCanBeTargeted(choiceForComputer);
  var targetCell;
  if (cellsTooccupyFor.length > 0) {
    targetCell = cellsTooccupyFor[0];
    fillSet(targetCell, choiceForComputer);
  } else {
    saveSelf();
  }
  waitforComp = false;
};

const makeaMove = () => {
  //The first priority will be the corner cells and the secondary priority will be the center cell
  //Lets intersect the corner cell array and unoccupied cells array to get a free corner cell
  var freeCornerCells = intersect(unOccupiedIndexes, corners);
  if (unOccupiedIndexes.indexOf("1_1") != -1) {
    //Center cell is free
    targetCell = "1_1";
  } else if (freeCornerCells.length > 0) {
    targetCell =
      freeCornerCells[Math.floor(Math.random() * freeCornerCells.length)];
  } else {
    targetCell =
      unOccupiedIndexes[Math.floor(Math.random() * unOccupiedIndexes.length)];
  }
  fillSet(targetCell, choiceForComputer);
};

const checkGame = () => {
  //alert("Started checking for game");
  if (unOccupiedIndexes.length <= 0) {
    endGame = true;
    document.getElementById("result-emoji").src = "assets/results/draw.png";
    return "Well! This Match has drawn. Let's play again!";
  }
  for (var i = 0; i < winningSequences.length; i++) {
    if (
      document.getElementById(winningSequences[i][0]).innerHTML ==
        document.getElementById(winningSequences[i][1]).innerHTML &&
      document.getElementById(winningSequences[i][1]).innerHTML ==
        document.getElementById(winningSequences[i][2]).innerHTML &&
      document.getElementById(winningSequences[i][0]).innerHTML != ""
    ) {
      var winnerCode = document.getElementById(winningSequences[i][0])
        .innerHTML;
      if (chosenValue == winnerCode) {
        endGame = true;
        document.getElementById("result-emoji").src =
          "assets/results/winner.png";
        return "Congrats! You won this game.";
      } else {
        endGame = true;
        document.getElementById("result-emoji").src =
          "assets/results/looser.png";
        return "Oopss!!! You lost this game. Try again";
      }
    }
  }
  return false;
};

const getTheCellthatCanBeTargeted = (against) => {
  var riskyCellFound = false;
  var theriskyCell = [];

  for (var i = 0; i < unOccupiedIndexes.length; i++) {
    //console.log(unOccupiedIndexes[i]);

    var winningCombinationSet = getWinningCombinationSetFor(
      unOccupiedIndexes[i]
    );

    console.log(winningCombinationSet);

    for (var j = 0; j < winningCombinationSet.length; j++) {
      var l_count = 0;

      for (var k = 0; k < winningCombinationSet[j].length; k++) {
        if (winningCombinationSet[j][k] != unOccupiedIndexes[i]) {
          var keys = winningCombinationSet[j][k].split("_");
          if (availableSet[keys[0]][keys[1]] == against) {
            l_count++;
          }
        }
      }

      if (l_count > 1) {
        // unOccupiedIndex[i] is risky
        riskyCellFound = true;
        theriskyCell.push(unOccupiedIndexes[i]);
      }
    }
  }

  return theriskyCell;
};

function getWinningCombinationSetFor(index) {
  var resultant = [];
  for (var p = 0; p < winningSequences.length; p++) {
    if (winningSequences[p].indexOf(index) !== -1) {
      resultant.push(winningSequences[p]);
    }
  }
  return resultant;
}

function PlaySound(audio) {
  var sound = document.getElementById(audio);
  sound.play();
}

function removeOccupied(item) {
  var index = unOccupiedIndexes.indexOf(item);
  unOccupiedIndexes.splice(index, 1);
}

function intersect(a, b) {
  var t;
  if (b.length > a.length) (t = b), (b = a), (a = t); // indexOf to loop over shorter
  return a.filter(function (e) {
    return b.indexOf(e) > -1;
  });
}

async function registerSW() {
  if ("serviceWorker" in navigator) {
    try {
      await navigator.serviceWorker.register("./sw.js");
    } catch (e) {
      console.log(`SW registration failed`);
    }
  }
}

function playAgain() {
  window.location.reload();
  combinedNumbersOfMove = 0;
  /*
  chosenValue = "X";
  inputSet = [];
  choiceForComputer = "O";
  endGame = false;
  availableSet = [
    [false, false, false],
    [false, false, false],
    [false, false, false],
  ];

  theOs = [];
  theXs = [];

  unOccupiedIndexes = [
    "0_0",
    "0_1",
    "0_2",
    "1_0",
    "1_1",
    "1_2",
    "2_0",
    "2_1",
    "2_2",
  ];

  for (var cellcount = 0; cellcount < cell_picker.length; cellcount++) {
    var eachcell = cell_picker[cellcount];
    eachcell.innerHTML = "";
  }
  document.getElementById("pickachoice").selectedIndex = "0";
  */
}

function goback() {
  history.go(-1);
}

var closeMessage = document.getElementById("close_message");
if (closeMessage) {
  closeMessage.addEventListener("click", function () {
    document.getElementById("popupformessage").classList.remove("visible");
    document.getElementById("confirmbtns").classList.remove("visible");
  });
}

function confirmYes() {
  chosenValue = tempChoice;
  var choiceHolder = document.getElementById("choiceHolder");
  choiceHolder.innerHTML =
    `You have chosen : <span class='close-shadow class${chosenValue}'>` +
    chosenValue +
    `</span>`;
  choiceForComputer = chosenValue == "X" ? "O" : "X";
  document.getElementById("popupformessage").classList.remove("visible");
  document.getElementById("confirmbtns").classList.remove("visible");
}

function confirmNo() {
  document.getElementById("popupformessage").classList.remove("visible");
  document.getElementById("confirmbtns").classList.remove("visible");
}

function openPopup(type, message) {
  if (type == "confirm") {
    document.getElementById("the_message").innerHTML = message;
    document.getElementById("popupformessage").classList.add("visible");
    document.getElementById("confirmbtns").classList.add("visible");
    document.getElementById("close_message").style.display = "none";
    document.getElementById("confirmbtns").style.display("block");
  } else {
    document.getElementById("the_message").innerHTML = message;
    document.getElementById("popupformessage").classList.add("visible");
    document.getElementById("confirmbtns").classList.remove("visible");
    document.getElementById("confirmbtns").style.display("none");
    document.getElementById("close_message").style.display = "flex";
  }
}
