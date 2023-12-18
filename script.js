const svg = document.getElementById("canva");
let squareNo;
let squares = 1;
let canvaArray = Array.from({length: 3}, _ => new Array(3).fill("a1"));

/* ----- Divisor ----- */
let xdivisor=640;
let ydivisor=360;
const xgrid = document.getElementById("xgrid");
const ygrid = document.getElementById("ygrid");
xgrid.value = 3;
ygrid.value = 3;

function updateDivisor(){
   if (xgrid.value>=1 & ygrid.value>=1){
        xdivisor = 1920/xgrid.value;
        ydivisor = 1080/ygrid.value;
        canvaArray = Array.from({length: parseInt(ygrid.value)}, _ => new Array(parseInt(xgrid.value)).fill("a1"));
   }
   squares = 1;
   svg.innerHTML = `<rect x="0" y="0"  width="640px" height="360px" onclick="popup(1)" id="rect1"/>`;
}

/* ----- Split Type ----- */
let splitType = "width";
const checkBox = document.getElementById("myCheck");

function toggleType(){
    if (checkBox.checked == true) {
        splitType = "height";
        svg.style.cursor = "e-resize";
    }else {
        splitType = "width";
        svg.style.cursor = "n-resize";
    }
}

/* ----- Popup ----- */
const modal = document.getElementById("sizeSetting");
const warning = document.getElementById("warning");
const firstBox = document.getElementById("firstBox");
const secondBox = document.getElementById("secondBox");
const context = document.getElementById("sizeContext");
const leftcontext = document.getElementById("leftContext");
const rightcontext = document.getElementById("rightContext");
function popup(x){
    context.innerHTML = "Available ";
    
    warning.innerHTML = "";
    modal.style.display = "block";
    firstBox.value = 0;
    secondBox.value = 0;
    squareNo = x;
    const crect =document.getElementById(`rect${x}`);
    console.log(splitType);
    if (splitType == "width") {
        context.innerHTML += `column(s): ${Math.round(parseInt(crect.getAttribute(splitType))*3/xdivisor)}`;
        leftcontext.innerHTML = "left:";
        rightcontext.innerHTML = ":right"
    }
    else {
        context.innerHTML += `row(s): ${Math.round(parseInt(crect.getAttribute(splitType))*3/ydivisor)}`;
        leftcontext.innerHTML = "top:";
        rightcontext.innerHTML = ":bottom"
    }
    
    console.log(canvaArray);
}

function calculateValue(){
    if (firstBox.value > 0 && secondBox.value > 0){
        const crect =document.getElementById(`rect${squareNo}`);
        squares++;
        if (splitType == "width"){
            split(crect, Math.round(firstBox.value*xdivisor/3),squares);
        }else {
            split(crect, Math.round(firstBox.value*ydivisor/3),squares);
        }
        modal.style.display = "none";
    }else{
        warning.innerHTML = "Value supposed to be more than 0";
    }
}

function changeValue(x){
    const crect =document.getElementById(`rect${squareNo}`);
    var y = firstBox;
    if(x==y) y = secondBox;
    
    if (splitType == "height") {
        if(y.value>=Math.round(parseInt(crect.getAttribute(splitType))*3/ydivisor)){
            y.value = Math.round(parseInt(crect.getAttribute(splitType))*3/ydivisor)-1;
        };
        if(y.value & y.value<=0){
            y.value = 1;
        };
        x.value = Math.round(parseInt(crect.getAttribute(splitType))*3/ydivisor-y.value);
    }
    if (splitType == "width") {
        if(y.value>=Math.round(parseInt(crect.getAttribute(splitType))*3/xdivisor)){
            y.value =Math.round(parseInt(crect.getAttribute(splitType))*3/xdivisor)-1;
        };
        if(y.value & y.value<=0){
            y.value = 1;
        };
        x.value = Math.round(parseInt(crect.getAttribute(splitType))*3/xdivisor-y.value);
    }
}
function split(crect, value, number){
    var xy; 
    if (splitType=="height"){
        xy="y";
    }else if(splitType=="width"){
        xy="x";
    }
    
    const crect2 = crect.cloneNode(true);
    crect2.setAttribute(xy, `${parseInt(crect.getAttribute(xy))+value}`);
    crect2.setAttribute(splitType, `${parseInt(crect.getAttribute(splitType))-value}`);
    crect2.setAttribute("id", `rect${number}`);
    crect2.setAttribute("onclick", `popup(${number})`)
    crect.setAttribute(splitType, value);
    svg.innerHTML += crect2.outerHTML;
    
    for (let i=Math.round(parseInt(crect2.getAttribute("y"))*3/ydivisor);i<Math.round(parseInt(crect2.getAttribute("height"))+parseInt(crect2.getAttribute("y")))*3/ydivisor;i++){
        for (let j=Math.round(parseInt(crect2.getAttribute("x"))*3/xdivisor);j<Math.round(parseInt(crect2.getAttribute("width"))+parseInt(crect2.getAttribute("x")))*3/xdivisor;j++){
            canvaArray[Math.round(i)][Math.round(j)] = `a${number}`;
        }
    }

}


window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

//generateCode//
function generateCode(){
    document.querySelectorAll(".codeBox").forEach(box => box.style.visibility = "visible");
    document.querySelectorAll('h2').forEach(text => text.style.visibility = "visible");
    document.querySelectorAll(".codeBox").forEach(box => box.innerHTML = "");
    document.getElementById("css").innerHTML += generateCSS();
    document.getElementById("html").innerHTML += generateHTML();
}
function generateCSS(){
    let cssText = `<span>.layout {</span>  <br/><span class="space">display: grid;</span>
                    <br/><span class="space">width: 100%;</span>
                    <br/><span class="space">height: 1080px;</span>
                    <br/><span class="space">grid:</span>`;
    for (let i=0; i<canvaArray.length; i++){
        cssText += `<br/><span class="space"></span><span class="space">"` + canvaArray[i].join(" ") + `" 1fr</span>`;
    }
    cssText += `<br/><span class="space"></span><span class="space">/</span>`;
    for (let i=0; i<canvaArray[0].length; i++){
        cssText += " 1fr";
    }
    cssText += ";<br/>}"
    for (let i=0; i<squares; i++){
        cssText += `<br/><span>#grid${i+1} { grid-area: a${i+1}; }</span>`
    }
    cssText += `<br/><span>.grid {</span>
                <br/><span class="space">background-color: aliceblue;</span>
                <br/><span class="space">border: 1px solid black;</span>
                <br/><span class="space">padding: 10px;</span>
                <br/><span class="space">text-align: center;</span>
                <br/><span>}</span>`
    return cssText;
}
function generateHTML(){
    let htmlText = `<span><</span><span>section class="layout"></span>`;
    for (let i=0; i<squares; i++){
        htmlText += `<br/><span class="space"></span><span><</span><span>div class="grid" id="grid${i+1}">${i+1}<</span><span>/div></span>`;
    }
    htmlText += `<br/><span><</span><span>/section></span>`;
    return htmlText;
}
