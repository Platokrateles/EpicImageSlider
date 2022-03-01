const numberOfNolanMovies = 11;

const screenWidth = 1366;
const screenHeight = 643;

let styleCSS = getComputedStyle(document.body);
let mainContainer = document.querySelector(".container");
let imageContainers = document.querySelectorAll(".singleImageContainer");
let radioButtons = document.querySelectorAll(".radioBtn")

let switchModeBtn = document.querySelector(".switchMode");
let isAutomaticMode = true;
switchModeBtn.addEventListener("click", switchMode);

let btnLeft = document.querySelector(".l");
let btnRight = document.querySelector(".r");
btnLeft.addEventListener("click", goClockwise);
btnRight.addEventListener("click", goCounterClockwise);

let imageContainersMapped = [[3, 4, 5, 6, 7, 'b'], [2, 1, 11, 10, 9, 8]];
let imageContainersMapped1D = [].concat(...imageContainersMapped);

for(iC of imageContainers)
{
    iC.setAttribute("transform", "translateX(0px) translateY(0px)");
}

const numberICMrows = 2;
const numberICMcolumns = 6;
let radioButtonIndex = 6;

const scaleX = Number(styleCSS.getPropertyValue('--scaleX'));
const scaleY = Number(styleCSS.getPropertyValue('--scaleY'));
const containerBorder = styleCSS.getPropertyValue('--containerBorder').replace('px', '');

const widthOfIC = (screenWidth * scaleX - 2 * containerBorder) / numberICMcolumns;
const heightOfIC = (screenHeight * scaleY - 2 * containerBorder) / numberICMrows ;

let finalXOffset = 0, finalYOffset = 0;
let ofssetsXYmap = [[0, 0], [0, 0], [0, 0], [0, 0],
                    [0, 0], [0, 0], [0, 0], [0, 0],
                    [0, 0], [0, 0], [0, 0]]



async function main()
{
    btnLeft.style.display = "none";
    btnRight.style.display = "none";

    while(1)
    {
        await sleep(7000);
        goCounterClockwise();
        if(isAutomaticMode == false)
            break;
    }
}

async function goClockwise()
{
    btnLeft.style.display = "none";
    btnRight.style.display = "none";

    radioButtonIndex--;

    let containerIndex = '', r = -1, c = -1;
    writeOutTheArray(imageContainersMapped, 2, 6);
    for(const imageContainer of imageContainers)
    {
        containerIndex = imageContainer.getAttribute("class");
        containerIndex = containerIndex.substring(20);
        containerIndex = Number(containerIndex.replace(' m', ''));

        if(containerIndex)
        {
            r = imageContainersMapped1D.indexOf(containerIndex);
            c = r - Math.floor(r / numberICMcolumns) * numberICMcolumns;
            r = Math.floor(r / numberICMcolumns);

            if(r == 0 && c >= 0 && c <= 3)
                slide(widthOfIC, 0, imageContainer, containerIndex);
            if(r == 1 && c >= 1 && c <= 5)
                slide(-widthOfIC, 0, imageContainer, containerIndex);
            if(r == 1 && c == 0)
                slide(0, -heightOfIC, imageContainer, containerIndex);
            if(r == 0 && c == 4)
                slide(widthOfIC, heightOfIC, imageContainer, containerIndex);
        }
    }
    remapArray('clockwise');
    checkRadioButton(radioButtonIndex);
    
    if(isAutomaticMode == false)
    {
        await sleep(2000);
        btnLeft.style.display = "flow-root";
        btnRight.style.display = "flow-root";
    }
}

async function goCounterClockwise()
{
    btnLeft.style.display = "none";
    btnRight.style.display = "none";
    
    radioButtonIndex++;

    let containerIndex = '', r = -1, c = -1;
    for(const imageContainer of imageContainers)
    {
        containerIndex = imageContainer.getAttribute("class");
        containerIndex = containerIndex.substring(20);
        containerIndex = Number(containerIndex.replace(' m', ''));

        r = imageContainersMapped1D.indexOf(containerIndex);
        c = r - Math.floor(r / numberICMcolumns) * numberICMcolumns;
        r = Math.floor(r / numberICMcolumns);

        if(r == 0 && c >= 1 && c <= 4)
            slide(-widthOfIC, 0, imageContainer, containerIndex);
        if(r == 1 && c >= 0 && c <= 4)
            slide(widthOfIC, 0, imageContainer, containerIndex);
        if(r == 0 && c == 0)
            slide(0, heightOfIC, imageContainer, containerIndex);
        if(r == 1 && c == 5)
            slide(-widthOfIC, -heightOfIC, imageContainer, containerIndex);
        
    }
    remapArray('counterClockwise');
    checkRadioButton(radioButtonIndex);

    if(isAutomaticMode == false)
    {
        await sleep(2000);
        btnLeft.style.display = "flow-root";
        btnRight.style.display = "flow-root";
    }
}

function slide(xOffset, yOffset, object, index)
{
    let actXOffset = 0, actYOffset = 0;

    let str = object.getAttribute("transform");
    str = str.replaceAll('translate', '');
    str = str.replace('X', '');
    str = str.replace('Y', '');
    str = str.replaceAll('(', '');
    str = str.replaceAll(')', '');
    str = str.replaceAll('px', '');
    str = str.split(" ");

    actXOffset = Number(str[0]);
    actYOffset = Number(str[1]);

    ofssetsXYmap[index-1][0] += actXOffset + xOffset;
    ofssetsXYmap[index-1][1] += actYOffset + yOffset;

    object.style.transform = `translateX(${ofssetsXYmap[index-1][0]}px) translateY(${ofssetsXYmap[index-1][1]}px)`;
}

function remapArray(mode)
{
    let arrSrc = imageContainersMapped;
    let arr = [ [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0] ]
    let i, j;

    if(mode === 'counterClockwise')
        for(i = 0; i < numberICMrows; i++)
            for(j = 0; j < numberICMcolumns; j++)
            {
                if(i == 1 && j == 5)
                    arr[0][4] = arrSrc[i][j];
                if(i == 0 && j == 5)
                    arr[0][5] = arrSrc[i][j];
                if(i == 1 && j <= 5 && j >= 1)
                    arr[i][j] = arrSrc[i][j-1];
                if(i == 0 && j == 0)
                    arr[1][0] = arrSrc[i][j];
                if(i == 0 && j >= 1 && j < 5)
                    arr[i][j-1] = arrSrc[i][j];
            };

    if(mode === 'clockwise')
        for(i = 0; i < numberICMrows; i++)
            for(j = 0; j < numberICMcolumns; j++)
            {
                if(i == 0 && j == 4)
                      arr[1][5] = arrSrc[i][j];
                if(i == 0 && j == 5)
                    arr[0][5] = arrSrc[i][j];
                if(i == 1 && j <= 4 && j >= 0)
                    arr[i][j] = arrSrc[i][j+1];
                if(i == 1 && j == 0)
                    arr[0][0] = arrSrc[i][j];
                if(i == 0 && j >= 0 && j < 4)
                    arr[i][j+1] = arrSrc[i][j];
            };

    imageContainersMapped = arr;
    imageContainersMapped1D = [].concat(...imageContainersMapped);
};

function writeOutTheArray(arr, i, j)
{
    let txtOutput = '';
    for(i = 0; i < 2; i++)
    {
        for(j = 0; j < 6; j++)
        {
            txtOutput += arr[i][j] + "  ";
        }
        txtOutput += "\n";
    }
    console.log(txtOutput);
};

function checkRadioButton(index)
{
    index %= numberOfNolanMovies;
    if(index == 0)
        index = 11;
    if(index < 0)
        index += numberOfNolanMovies;

    let actRadioButton = radioButtons.item(index - 1);
    actRadioButton.style.backgroundColor = "white";
    actRadioButton.style.boxShadow = "0 5px 50px 0 white inset,0 5px 50px 0 white, 0 5px 50px 0 white inset,0 5px 100px 15px white";
    if(index >= 2 && index <= 10)
    {
        radioButtons.item(index-2).style.backgroundColor = "gray";
        radioButtons.item(index).style.backgroundColor = "gray";
        
        radioButtons.item(index-2).style.boxShadow = "";
        radioButtons.item(index).style.boxShadow = "";
        
        return;
    }

    if(index == 1)
    {
        radioButtons.item(1).style.backgroundColor = "gray";
        radioButtons.item(radioButtons.length - 1).style.backgroundColor = "gray";
        
        radioButtons.item(1).style.boxShadow = "";
        radioButtons.item(numberOfNolanMovies - 1).style.boxShadow = "";
    }

    if(index == numberOfNolanMovies)
    {
        radioButtons.item(0).style.backgroundColor = "gray";
        radioButtons.item(numberOfNolanMovies - 2).style.backgroundColor = "gray";
        
        radioButtons.item(0).style.boxShadow = "";
        radioButtons.item(numberOfNolanMovies - 2).style.boxShadow = "";
    }
}

async function sleep(msec) {
    return new Promise(resolve => setTimeout(resolve, msec));
}

function switchMode()
{
    if(isAutomaticMode)
    {
        isAutomaticMode = false;
        btnLeft.style.display = "flow-root";
        btnRight.style.display = "flow-root";
        switchModeBtn.textContent = "MANUAL";
        switchModeBtn.style.width = "200px";
        return;
    }
    
    isAutomaticMode = true;
    btnLeft.style.display = "none";
    btnRight.style.display = "none";
    switchModeBtn.textContent = "AUTO";
    switchModeBtn.style.width = "135px";
    main();
    return;
}

main();