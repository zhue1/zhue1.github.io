var equation, xinterceptArray, yinterceptArray;

function solver(){
    var xintercept = "";
    var yintercept = "";
    equation = document.forms["input-form"]["equation"].value;
    if(equation.indexOf('y') != -1){
        equation = nerdamer.solveEquations(equation, 'y')[0].text();
    }
    yintercept = nerdamer(equation, {x:0}).evaluate().text();
    xintercept = nerdamer.solve(equation, 'x').text().slice(1,-1);
    yinterceptArray = yintercept.split(',');
    xinterceptArray = xintercept.split(',');
    xintercept = "";
    yintercept = "";
    for(let i = 0; i < xinterceptArray.length; i++){
        if(xinterceptArray[i].indexOf('i') == -1){
            xintercept += xinterceptArray[i] + ', ';
        }
    }
    for(let i = 0; i < yinterceptArray.length; i++){
        if(yinterceptArray[i].indexOf('i') == -1){
            yintercept += yinterceptArray[i] + ', ';
        }   
    }
    if(xintercept[xintercept.length - 2] == ','){
        xintercept = xintercept.slice(0, -2);
    }
    if(yintercept[yintercept.length - 2] == ','){
        yintercept = yintercept.slice(0, -2);
    }
    if(!xintercept){
        xintercept = "None";
    }
    if(!yintercept){
        yintercept = "None";
    }
    document.getElementById("zeros").innerHTML = "<b>x-intercept(s):</b> x= " + xintercept;
    document.getElementById("y-intercept").innerHTML = "<b>y-intercept:</b> y= " + yintercept;
}