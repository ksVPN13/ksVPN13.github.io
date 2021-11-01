
let rows = 4;
let columns = 4;
let pWidth = 99.5;
let pHeight = 99.5;
let imgSrc = 'https://cdnb.artstation.com/p/assets/images/images/024/538/827/original/pixel-jeff-clipa-s.gif?1582740711';
let winCondition;
let gameOver = false;
let clicks = 0;
let rSlider = document.getElementById('rows');
let cSlider = document.getElementById('cols');
let rVal = document.getElementById('rVal');
let cVal = document.getElementById('cVal');
let imgUrl = document.getElementById('url');
const form = document.getElementById('form');
const footer = document.getElementById('footer');
const submitButton = document.getElementById('submit');
const titleText = document.getElementById('titleText');

document.body.requestFullscreen('hide');

// Update the current slider value (each time you drag the slider handle)
rSlider.oninput = function() {
    rVal.innerHTML = this.value;
  }
cSlider.oninput = function() {
    cVal.innerHTML = this.value;
}

//set width and heigh values based on screen type
/*
if (screen.width < 450 ) {
    pWidth = 95;
    pHeight = 96;
    //console.log('mobile');
} else {
    pWidth = 85;
    pHeight = 80;
    //console.log('desktop');
}*/

//creates the puzzle
function createPuzzle(row, col) {
    //create all rows
    for (let i=0; i<row; i++) {
        createRow(i, col);
    }
    makeClickable();
    winCondition = Array.from(document.getElementsByClassName('image'));
    //shuffle();
}

//takes row number and a count of columns to create the rows
function createRow(index, col) {
    const pDiv = document.getElementById('puzzle');
    //create row div element
    let rDiv = document.createElement('div');
    //set id of element to r#
    rDiv.id = 'r' + index;
    rDiv.className = 'row';
    //add rDiv to puzzle
    pDiv.appendChild(rDiv);

    //create all slides
    for (let i=0; i<col; i++) {
        createSlide(rDiv, index, i);
    }
}

//takes a row element to append slide elements based on row number and column number
function createSlide(rowDiv, rowNum, colNum) {
    //calculate image offset for slide
    let xMargin = -colNum*(pWidth/columns);
    let yMargin = -rowNum*(pHeight/rows);

    //create slide container element
    let sDiv = document.createElement('div');
    sDiv.className = 'slide';
    sDiv.id = 'r' + rowNum + 's' + colNum;
    sDiv.style.width = (pWidth/columns) + 'vw';
    sDiv.style.height = (pHeight/rows) + 'vh';
    rowDiv.appendChild(sDiv);

    //create slide image element
    let sImg = document.createElement('img');
    if (rowNum === 0 && colNum === 0) {
        sImg.id = 'blank';
        sImg.style.opacity = 0;
    } else {
        sImg.id = 'r' + rowNum + 'i' + colNum;
    }
    sImg.src = imgSrc;
    sImg.className = 'image';
    sImg.style.objectFit = 'cover';
    sImg.style.width = pWidth + 'vw';
    sImg.style.height = pHeight + 'vh';
    //margins offset the image to show the right piece for each slide
    sImg.style.margin = yMargin + 'vh 0 0 ' + xMargin + 'vw';

    //add slide image to container element
    sDiv.appendChild(sImg);
}

//moves the image elements into new containers
function move(sCont) {
    if (gameOver){
        return;
    }
    //get current row and column information from parent element
    let currentRow = parseInt(sCont.id[1]);
    let currentCol = parseInt(sCont.id[3]);

    //console.log('you clicked row ' + (currentRow + 1) + ' and column ' + (currentCol + 1));

    //get blank spot row and column
    let blank = document.getElementById('blank');
    let blankRow = parseInt(blank.parentElement.id[1]);
    let blankCol = parseInt(blank.parentElement.id[3]);

    //console.log('CRow: ' + currentRow + ' CCol: ' + currentCol);
    //console.log('BRow: ' + blankRow + ' BCol: ' + blankCol);

    if(currentRow === blankRow && currentCol === blankCol) {
        //do nothing
        return;
    } else if (currentRow === blankRow) {
        //move whole row
        if (currentCol < blankCol) {
            sCont.appendChild(blank);
            for (let i = currentCol; i < blankCol; i++) {
                let moveSlide = document.getElementById('r' + currentRow + 's' + i).firstChild;
                document.getElementById('r' + currentRow + 's' + (i + 1)).appendChild(moveSlide);
                //console.log('blank is at ' + blankCol);
            }
        } else {
            sCont.appendChild(blank);
            for (let i = currentCol; i > blankCol; i--) {
                let moveSlide = document.getElementById('r' + currentRow + 's' + i).firstChild;
                document.getElementById('r' + currentRow + 's' + (i - 1)).appendChild(moveSlide);
            }
        }
    } else if (currentCol === blankCol) {
        //move whole column
        if (currentRow < blankRow) {
            sCont.appendChild(blank);
            for (let i = currentRow; i < blankRow; i++) {
                let moveSlide = document.getElementById('r' + i + 's' + currentCol).firstChild;
                document.getElementById('r' + (i + 1) + 's' + currentCol).appendChild(moveSlide);
                //console.log('blank is at ' + blankCol);
            }
        } else {
            sCont.appendChild(blank);
            for (let i = currentRow; i > blankRow; i--) {
                let moveSlide = document.getElementById('r' + i + 's' + currentCol).firstChild;
                document.getElementById('r' + (i - 1) + 's' + currentCol).appendChild(moveSlide);
            }
        }
    } else {
        return; //stops from counting click
    }
    countClick();
    //console.log(sElem.item(i));
}

//checks if two arrays are the same
function isEqual(arr1, arr2) {
    for (let i in arr1) {
        if (arr1[i] !== arr2[i]) {
            return false
        }
    }
    return true;
}

//checks win condition
function checkWin() {
    let currentLayout = Array.from(document.getElementsByClassName('image'));
    //console.log(currentLayout);
    //console.log(winCondition);
    if (isEqual(currentLayout, winCondition) && (!gameOver)) {
        //if win condition is met, change text, stop clicks and remove margin from slides
        //document.getElementById('title').innerHTML = '<h1>You Win!</h1>';
        console.log('You win!');
        document.getElementById('blank').style.opacity = 1;
        gameOver = true;

        //loop through slides to remove border
        let sElem = document.getElementsByClassName('slide');
        for (let i = 0; i < sElem.length; i++) {
            sElem.item(i).style.border = 'none';
        }

        //create play again button to refresh page
        let playAgain = document.createElement('div');
        playAgain.className = 'button';
        playAgain.id = 'reload';
        playAgain.style.display = 'inline-block';
        playAgain.style.fontSize = '20px';
        playAgain.innerHTML = 'Play Again';
        playAgain.style.cursor = 'pointer';
        document.getElementById('youWin').appendChild(playAgain);

        playAgain.addEventListener('click', () => location.reload());
    }
}

//shuffles the board by making a random number of moves
function shuffle() {
    let numMoves = getRandomInt(100, 300);

    for (let i = 0; i < numMoves; i++) {
        moveRandomSlide();
    }

    clicks = 0;
    document.getElementById('click').innerHTML = clicks;
}

//moves a random slide, only picking one that is moveable
function moveRandomSlide() {
    //get the blank location
    let blank = document.getElementById('blank');
    let blankRow = parseInt(blank.parentElement.id[1]);
    let blankCol = parseInt(blank.parentElement.id[3]);
    
    //get a random box number based on number of rows and columns
    let ranBox = getRandomInt(0, rows+columns);
    let ranSlide;

    //selects a random slide and moves it
    if (ranBox < rows) {
        ranSlide = document.getElementById('r' + ranBox + 's' + blankCol);
        //console.log(ranSlide);
        move(ranSlide);
    } else {
        ranSlide = document.getElementById('r' + blankRow + 's' + (ranBox-rows));
        //console.log(ranSlide);
        move(ranSlide);
    }
    //console.log(ranBox);
    //console.log(ranSlide);
}

//gets a random int
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

//takes the click event and add the move function to the item that was clicked
function userMove(event) {
    //console.log(event);
    move(event.currentTarget);
    checkWin();
}

//adds click events to all slides
function makeClickable() {
    let sElem = document.getElementsByClassName('slide');
    for (let i = 0; i < sElem.length; i++) {
        sElem.item(i).addEventListener("click", userMove);
    }
}

//counts and upates clicks
function countClick() {
    clicks++;
    document.getElementById('click').innerHTML = clicks;
}

//initialize puzzle and shuffle
//createPuzzle(rows, columns);
//shuffle();

submitButton.addEventListener('click', () => {
    rows = parseInt(rSlider.value);
    columns = parseInt(cSlider.value);
    imgSrc = imgUrl.value;
    //console.log(rSlider.value + ' ' + cSlider.value + ' ' + imgUrl.value)
    createPuzzle(rows, columns);
    shuffle();
    footer.style.visibility = 'visible';
    form.remove();
    titleText.remove();
});
