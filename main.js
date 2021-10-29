
let rows = 4;
let columns = 4;
const pWidth = 750;
const pHeight = 750;
const imgSrc = 'https://media.giphy.com/media/Jrl4FlTaymFFbNiwU5/giphy.gif';
let winCondition;
let gameOver = false;

function createPuzzle(row, col) {
    //create all rows
    for (let i=0; i<row; i++) {
        createRow(i, col);
    }
    winCondition = Array.from(document.getElementsByClassName('image'));
}

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

function createSlide(rowDiv, rowNum, colNum) {
    //calculate image offset for slide
    let xMargin = -colNum*(pWidth/columns);
    let yMargin = -rowNum*(pHeight/rows);

    //create slide container element
    let sDiv = document.createElement('div');
    sDiv.className = 'slide';
    sDiv.id = 'r' + rowNum + 's' + colNum;
    sDiv.style.width = (pWidth/columns) + 'px';
    sDiv.style.height = (pHeight/rows) + 'px';
    rowDiv.appendChild(sDiv);

    //create slide image element
    let sImg = document.createElement('img');
    if (rowNum === 0 && colNum === 0) {
        sImg.src = '';
        sImg.id = 'blank';
    } else {
        sImg.src = imgSrc;
        sImg.id = 'r' + rowNum + 'i' + colNum;
    }
    sImg.className = 'image';
    sImg.style.objectFit = 'cover';
    sImg.style.width = pWidth + 'px';
    //margins offset the image to show the right piece for each slide
    sImg.style.margin = yMargin + 'px 0 0 ' + xMargin + 'px';

    //add slide image to container element
    sDiv.appendChild(sImg);
}

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
    }
    //console.log(sElem.item(i));
}

function isEqual(arr1, arr2) {
    for (let i in arr1) {
        if (arr1[i] !== arr2[i]) {
            return false
        }
    }
    return true;
}

function checkWin() {
    let currentLayout = Array.from(document.getElementsByClassName('image'));
    //console.log(currentLayout);
    //console.log(winCondition);
    if (isEqual(currentLayout, winCondition)) {
        document.getElementById('title').innerHTML = '<h1>You Win!</h1>';
        console.log('You win!');
        document.getElementById('blank').src = imgSrc;
        gameOver = true;
    }
}

function shuffle() {
    let numMoves = getRandomInt(100, 300);

    for (let i = 0; i < numMoves; i++) {
        moveRandomSlide();
    }
}

function moveRandomSlide() {
    let blank = document.getElementById('blank');
    let blankRow = parseInt(blank.parentElement.id[1]);
    let blankCol = parseInt(blank.parentElement.id[3]);
    
    let ranBox = getRandomInt(0, rows+columns);
    let ranSlide;

    if (ranBox < rows) {
        ranSlide = document.getElementById('r' + ranBox + 's' + blankCol);
        move(ranSlide);
    } else {
        ranSlide = document.getElementById('r' + blankRow + 's' + (ranBox-rows));
        move(ranSlide);
    }
    //console.log(ranBox);
    //console.log(ranSlide);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }

createPuzzle(rows, columns);
shuffle();

let sElem = document.getElementsByClassName('slide');
for (let i = 0; i < sElem.length; i++) {
    sElem.item(i).addEventListener("click", function() {
        move(sElem.item(i));
        checkWin();
    })}

