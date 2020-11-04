<?php
  /*print_r($_REQUEST);
  exit;*/
?>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>Tic Tac Toe</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="apple-mobile-web-app-capable" content="yes" />

    <link
      rel="apple-touch-icon"
      sizes="180x180"
      href="./assets/favicons/apple-touch-icon.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="32x32"
      href="./assets/favicons/favicon-32x32.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="16x16"
      href="./assets/favicons/favicon-16x16.png"
    />
    <link
      rel="mask-icon"
      href="./assets/favicons/safari-pinned-tab.svg"
      color="#5bbad5"
    />
    <meta name="msapplication-TileColor" content="#da532c" />
    <meta name="theme-color" content="#ffffff" />

    <link
      rel="stylesheet"
      type="text/css"
      media="screen"
      href="./assets/styles/style.css"
    />
    <link rel="manifest" href="./manifest.webmanifest" />
    <link
      rel="apple-touch-icon"
      sizes="180x180"
      href="./assets/appicons/appicon-no-space.png"
    />
    <script src="./assets/script/script.js"></script>
  </head>
  <body>
    <div id="gameover-card">
      <div id="gameover">
        <div class="g-text">
          <p class="g-over">
            <img
              id="result-emoji"
              src="assets/results/winner.png"
              style="width: 112px;"
            />
          </p>
          <p id="endmessage"></p>
          <button onclick="playAgain()" id="playagain" class="">
            Play again!
          </button>
        </div>
      </div>
    </div>
    <h1 id="gamename">Let's play Tic-Tac-Toe</h1>
    <div id="pitch">
      <img id="loader" class="" src="assets/loaders/loader3.gif" />
      <div id="choiceHolder">
        <button class="select-button" id="setchoiceX" onclick="setchoice('X')">
          Choose X
        </button>
        <button class="select-button" id="setchoiceO" onclick="setchoice('O')">
          Choose O
        </button>
      </div>
      <table id="bord" style="border-collapse: collapse;" border="0">
        <tr>
          <td class="ttt-cell" id="0_0"></td>
          <td class="ttt-cell" id="0_1"></td>
          <td class="ttt-cell" id="0_2"></td>
        </tr>
        <tr>
          <td class="ttt-cell" id="1_0"></td>
          <td class="ttt-cell" id="1_1"></td>
          <td class="ttt-cell" id="1_2"></td>
        </tr>
        <tr>
          <td class="ttt-cell" id="2_0"></td>
          <td class="ttt-cell" id="2_1"></td>
          <td class="ttt-cell" id="2_2"></td>
        </tr>
      </table>
      <audio id="audioX" src="assets/sounds/O.mp3" autostart="false"></audio>
      <audio id="audioO" src="assets/sounds/X2.mp3" autostart="false"></audio>
    </div>
  </body>
</html>
