jQuery("#High Scores").on("click", function registerScore() {
  console.log(score);
  console.log(highscoreList);
  gameResult = {player: playerName, score: score};
  highscoreList.push(gameResult);
  highscoreList.sort(function(a,b) { return (b.score - a.score ); });
  if (score == highscoreList[0].score && score>1) {
    jQuery("#content").empty();
    playerName = prompt("You got a high score! What is your name?");
    jQuery("#content").css('color', 'yellow').append(
      "<ul>" +
        "<li>"+ playerName + ":" + score + "<li>" +
      "</ul>");
  }
}
);

jQuery("#credits").on("click", function() {
  var message = "Game created by Neeraj";
  jQuery("#content").empty();
  jQuery("#content").css('color', 'yellow').append(
    "<div>"+ message + "</div>"
  );
});

jQuery("#help").on("click", function() {
  jQuery("#content").empty();
  jQuery("#content").css('color', 'yellow').append(
    "<ol>" +
          "<li>" + "Press SPACE to go up" + "</li>" +
          "<li>" + "Avoid the incoming pipes" + "</li>" +
          "<li>" + "Earn points by collecting stars" + "</li>" +
          "<li>" + "Click the screen to pause the game" + "</li>" +
    "</ol>"
  );
});

jQuery("#sharing").on("click", function (){
  var text = "I scored " + score.toString() + " in Batman Wanders...! Can you do better!";
  var escapedText = encodeURIComponent(text);
  var url =
  "https:twitter.com/share?text=" +
  escapedText;
  jQuery("#sharing").attr("href", url);
});

function registerScore(score) {
  console.log(score);
  console.log(highscoreList);
  gameResult = {player: playerName, score: score};
  highscoreList.push(gameResult);
  highscoreList.sort(function(a,b) { return (b.score - a.score ); });
  if (score == highscoreList[0].score && score>1) {
    jQuery("#content").empty();
    playerName = prompt("You got a high score! What is your name?");
    jQuery("#content").css('color', 'yellow').append(
      "<ul>" +
        "<li>"+ playerName + ":" + score + "<li>" +
      "</ul>");
  }
}
