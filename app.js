// Must Initialize select 2 dropdown to properly work
$(document).ready(function() {
    $('.dropdownCategory').select2({
        placeholder: 'Select an option'
      });
    $('.dropdownDifficulty').select2({
    placeholder: 'Select an option'
    });
    $('.dropdownType').select2({
        placeholder: 'Select an option'
        });
});



function convertToUrl( amount, category, difficulty, type) {
    // shorthand if statement 
     amount = amount == 'x' ? '' : `amount=${amount}` ;
     category = category ==  'x' ? '' : `&category=${category}`;
     difficulty = difficulty =='x' ? '' : `&difficulty=${difficulty}`;
     type = type == 'x' ? '' : `&type=${type}`;
    return (`${baseUrl}${amount}${category}${difficulty}${type}`);
}

// update slider value on DOM
$(document).on('input', '.numQuestions', function() {
    $('.label').html( $(this).val() );
});

// get Url 
const baseUrl = 'https://opentdb.com/api.php?'; // if any var is not specified, it results to random
var amount = ''; // required // no. of questions
var category = '';  
var difficulty = ''; // easy || medium || hard
var type = ''; //multiple choice (multiple) || true/false (boolean)


$('.button').on('click',() => {

    //get values
    amount = $('.numQuestions').val();
    category = $('.dropdownCategory').val();
    difficulty = $('.dropdownDifficulty').val();
    type = $('.dropdownType').val();
    
    newUrl = convertToUrl(amount, category, difficulty, type);
    getRequest(newUrl);
});



function removeBody(){
    $('div.body').fadeOut(500, function() {
        $(this).addClass("flex");
        $(this).addClass("hide");
    });
    setTimeout(function(){ 
        $('div.mainGame').fadeIn(500, function() {
            $(this).removeClass("hide");
        });    
     }, 500);
   
}
function removeCard(){
    $('.showNext').addClass('hide');
    $('div.mainGame').fadeOut(500, function() {
        $(this).addClass("hide");
    });
    setTimeout(function(){ 
        $('div.body').fadeIn(500, function() {
            $(this).addClass("flex");
            $(this).removeClass("hide");
        
        });    
     }, 200);
    
}

//restart game
$('.restart').on('click', () => {
    $('.restart').addClass('hide');
    $( ".body" ).fadeIn();
    $('.showNext').removeClass('hide');
    removeCard();
    $('.showNext').addClass('hide');
    $('.showChoices').addClass('hide');
    $('.showChoices').text(' ');
    $('.showQuestion').text(' ');
    $('.showIcon').attr("src",`#`);
});

//shows next question
function showCard(resultsArray, questionAt){
    //resets the card
    enableClicks();
    turnNormal();
    $('.showNext').addClass('hide');
    $('.showChoices').text('#');
    $('.showChoices').removeClass('hide');
    $('.restart').addClass('hide');
    console.log(resultsArray);
    console.log('%cQUESTION AT ' + questionAt,"color:red; font-size:20px;" );
    let showAll = resultsArray[questionAt];
    let category = showAll.category;
    let difficulty = showAll.difficulty;
    let question = showAll.question;
    let correct_answer = showAll.correct_answer;
    let incorrect_answers = showAll.incorrect_answers;  
    let type = showAll.type;
    function shuffle(array) {
        array.sort(() => Math.random() - 0.5);
      }
      
    var choice = [];
    choice.push(correct_answer);
    console.log(choice);
    incorrect_answers.forEach(element => {
        choice.push(element);
        shuffle(choice);
    });
    
    
    $('.showIcon').attr("src",`img/${category}.png`);
    $('.showCategory').text(`${category} || ${difficulty}`); 
    $('.showDifficulty').text(`${difficulty}`);
    $('.showQuestion').html(question).text();
    console.log(choice);
    choice.forEach((element, index) =>{
        $(`#${index}`).html(element).text();
    });  
    
    if(type == 'boolean'){
        $('#2').addClass('hide');
        $('#3').addClass('hide');
    }
    if(type == 'multiple'){
        $('#2').removeClass('hide');
        $('#3').removeClass('hide');
    }
   

} 

function showEnd(questionAt,score){
    //resets the card
    console.log('%cRESTART','color:orange; font-size:20px;');
    $('.showNext').addClass('hide');
    $('.showChoices').text('#');
    $('.restart').removeClass('hide');
    $('.showChoices').addClass('hide');
    $('.showQuestion').html(`Have a nice Day!`).text();
    // fetch('https://api.kanye.rest/') // get a random Kanye West quote
    //     .then(res => res.json())
    //     .then(res => $('.showQuestion').html(`${res.quote} <br> -Kanye West`).text());
   
    
    $('.showIcon').attr("src",`img/winner.png`);
    $('.showCategory').text(`You answered ${score} / ${questionAt} `); 
}

function turnNormal(){
    $('div.showChoices').css({
        "background-color": "white",
        "font-weight": "normal",
        "color":"#37474F"
      });
}

function turnGreen(correct_answer){
    $('div.showChoices').css({
        "background-color": "#D3D3D3",
        "font-weight": "bolder"
      });
      
      $(`div.showChoices:contains(${correct_answer})`).css({
        "background-color": "green",
        "color": "white",
        "font-weight": "bolder"
      });
} 

function turnRed(correct_answer){
    $('div.showChoices').css({
        "background-color": "red",
        "font-weight": "bolder",
        "color": "#D3D3D3",
      });
      $(`div.showChoices:contains(${correct_answer})`).css({
        "background-color": "#FFFACD",
        "font-weight": "bolder",
        "color": "#37474F",
      });
} 

function disableClicks(){
    $('.showChoices').css( "pointer-events", "none" );
}

function enableClicks(){
    $('.showChoices').css( "pointer-events", "auto" );
}
var score = 0;

function resetScore(){
    score = 0;
}
function addScore(){
    score += 1;
}
    

function getRequest(newUrl){
    const request = async () => {
        const response = await fetch(newUrl);
        const json = await response.json();
        
        const resultsArray = json.results;
        
        if(json.response_code == 1){ 
            // Code 1: No Results Could not return results. 
            // The API doesn't have enough questions for your 
            // query. (Ex. Asking for 50 Questions in a
            // Category that only has 20.)
            console.log('nopes');
            alert('Sorry, we dont have enough questions for your query. Try Again.')
        }
        else{ // returned results successfully
            console.log(json);
            removeBody();
            let theCards = json.results;
            var questionAt = 0;
            score = 0; 
            showCard(theCards,questionAt);
             //shows next question
             $('.showNext').on('click', () => {
                 if(questionAt == theCards.length - 1){ // user answered all questions
                    let len = theCards.length -1;
                     showEnd(questionAt + 1, score);
                     console.log('%cQUESTION AT ' + len,"color:tomato; font-weight: bold; font-size:20px;" );
                 }
                 else{
                    questionAt += 1;
                    showCard(theCards,questionAt);
                    console.log('correct' + theCards[questionAt].correct_answer);
                 }
            });
            
            $('div.showChoices').off('click').on('click',function() {
                 var text = $(this).text();
                //console.log(text);
                var texts = $(this).html(text).text();
                console.log('%c This'+ text , 'color:magenta; font-weight: bold;');
               console.log('%c TEXTs'+ texts , 'color:magenta; font-weight: bold;');
               console.log('%c alalu'+ theCards[questionAt].correct_answer , 'color:magenta; font-weight: bold;');
               
               var correctAnswer = he.decode(theCards[questionAt].correct_answer);
                console.log(correctAnswer);
                if(correctAnswer == texts){
                    addScore();
                    console.log("%c SCOOORE" + score,'color:blue; font-weight: bold; font-size: 20px');
                    $('.showNext').removeClass('hide');
                    $('.restart').addClass('hide');
                    disableClicks();
                    
                    turnGreen(correctAnswer);
                }
                else{
                    $('.showNext').removeClass('hide');
                    //$('.restart').removeClass('hide');
                    disableClicks();
                    var correctAnswer = he.decode(theCards[questionAt].correct_answer);
                    turnRed(correctAnswer);
                    
                }
            });          
        }
        return json;
    }
    request()
}
