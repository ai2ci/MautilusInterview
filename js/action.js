
// global variables
var pixelsDown = 4;
var gamepoints = 0;
var probability = 1.0 / 5; 
var paused = false;

/**
 * show score on the table
 */
function showScore(){
  $("#score").text(gamepoints);
}
/**
 * get random letter
 * @returns String
 */
function getRandomLetter(){
  var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    return letters[Math.floor(Math.random() * letters.length)];
}
/**
 * get random color
 * @returns String
 */
function getRandomColor(){
  var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
/**
 * get random int 
 * @param {int} min
 * @param {int} max
 * @returns {int}
 */
function getRandomInt(min, max){
  return Math.round(min + Math.random()*(max-min));
}
/**
 * return randomized box
 * @param {int} maxX position
 * @param {int} maxY position
 * @returns {Element}
 */
function addBox(maxX, maxY){
  // randomize params of box
  var letter = getRandomLetter();
  var fontSize = getRandomInt(10, 40);
  var size = getRandomInt( fontSize + 4 , 50);
  var x = getRandomInt(0, maxX - size);
  var y = getRandomInt(0, maxY - size);
  var color = getRandomColor();
  // create
  var element = document.createElement("div");
  
  $(element).addClass("letterbox");
  $(element).addClass(letter.toLowerCase() + "-letter");
  $(element).text(letter);
  $(element).css({
    width : size + "px",
    height : size + "px",
    top : x + "px",
    left : y + "px",
    "font-size" : fontSize + "px",
    backgroundColor : color,
    "line-height": size + "px"
  });
  return element;
}
/**
 * append letter box to the playground
 */
function appendBox(){
  var maxX = $("#activefield").height();
  var maxY = $("#activefield").width();
  var element = addBox(maxX,maxY)
  $(element).click(function(){
    this.remove();
  });
  $("#activefield").append(element);
  
}
/**
 * box is over the active field
 */
function boxOver(){
  gamepoints--;
  showScore();
}

// tic-tac every second
setInterval(function(){
  if(!paused){
    //randomize create box i probability
    var bet = Math.random();
    if(bet < probability){
      appendBox();
    }
    // fall down all the boxes or set state to over
    $.each($(".letterbox"),function(i){
      var element = $(".letterbox")[i];
      var top = parseInt($(element).css("top"));
      if ( top - 2*pixelsDown  > $("#activefield").height()){
        // over activefield
        $(element).removeClass("letterbox");
        $(element).addClass("overletterbox");
        boxOver();
      } else {
        // fall down
        $(element).css({top: (top + pixelsDown) + "px"});
      }
    })
  }
},1000);

// action on keyboard press
$(document).keypress(function(event) {
  if(!paused){
    // get key from event code
    var key = String.fromCharCode(event.keyCode);
    // find all boxes by  pressed letter
    var catched = $(".letterbox." + key+ "-letter");
    // 
    if(catched.length == 1){
      gamepoints--;
    } else if (catched.length == 2) {
      gamepoints++;
    }
    // remove boxes
    catched.remove();
    showScore();
  }
});

// action on button click
$(document).ready(function(){
  $("#pausetoggle").click(function(){
    // change state
    paused = !paused;
  });
});