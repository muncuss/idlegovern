/* importing function */




/* data using medieval britain/europe */
var day = 27
var month = 6
var year = 1165
var pop = 4720
var birth = 0
var birthRate = 0.0008
var death = 0
var deathRate = 0.015
var wheatPop = 200
var goodsPop = 0
var farmer = 80 // % of total pop
var artisan = 20 // %
var land = 1062 // 80% is farmer, divide by household (avg 4 people in household)
var harvestRate = 77 /* average 1 pop has 11 acre with productivity of minimum 7 bushel/acre */
var fertileRate = 1
var produceRate = 6
var consumRate = 13 // bushel annual per pop
var goodsPrice = 5
/* 
var forestExist = 0
var swampExist = 0
var hillExist = 0
var lakeExist = 0 
*/
var taxRate = 5 //in %
var wheatLord = 10
var coinLord = 100
var troop = 0
var troopWage = 3
var troopConsumeRate = 2 // bushel per attack
var strength = 0







/* SYSTEM FUNCTION */
function timer() {
    day++;
    console.log(wheatPop)
    if(day > 30) {
        month++;
        day = 1
        birthf()
        eat()
        
    }
    if(month > 12) {
        year++;
        month = 12
    }
    if(month == 7 && day == 1) {
        harvest()
        console.log(wheatPop)
        harvestTax()
    }
}

function randomInt(min, max) { 
    return Math.ceil(Math.random() * (max - min) + min); 

}

function notif(input) {
    window.alert(input)
}







/* LORD */
function harvestTax() {
    let x
    x = wheatPop * (taxRate / 100)
    wheatLord += Math.floor(x)
}

function produceTax() {
    let x
    x = goodsPop * (taxRate / 100)
    goodsLord += Math.floor(x)
}

function sellGoodsLord(input) {
    if(input > goodsLord) {
        notif("Not enough goods in warehouse!")
    }else {
        coinLord += input * goodsPrice
        goodsLord -= input
    }
}

function changeTax(input) {
    if(input > 30) { //max tax rate 30%
        notif("Tax rate too high!")
    }else {
        taxRate = input
    }
}

function recruit(input) {
    if(input > pop) {
        notif("Not enough population!")
    }else {
        troop += input
    }
}





/* CIVILIAN */
function birthf() {
    let total
    total = pop * birthRate
//    birthx = Math.ceil(total) - pop
    pop += Math.ceil(total)
}

function popAmount(x) {
    return Math.floor(x * (80/100))
}

function harvest() {
    let total
    total = land * harvestRate
    wheatPop += Math.ceil(total)
}

function produce() {
    let total
    total = popAmount(artisan) * produceRate
    goodsPop += total
}

function eat() {
    let eaten
    let remaining
    eaten = pop * (consumRate / 12)
    remaining = wheatPop - Math.ceil(eaten)
    if(remaining <= 0) {
        wheatPop += forage(remaining)
        wheatPop -= Math.ceil(eaten)
    }else {
        wheatPop -= Math.ceil(eaten)
    }
} 

function forage(x) {
    let foraged
    let min = x 
    let max = x * 1.2
    foraged = randomInt(min, max)
    return foraged
}






/* MISC */
function troopWage() {
    let tu
    tu = troop * troopWage
    if(tu < coinLord) {
        notif("Not enough coin to pay your troops! some of them leave the barack")
        troop -= tu / troopWage
    }else {
        coinLord -= tu
    }
}

function troopEat() {
    let tu
    tu = troop * troopConsumeRate
    if(tu > coinLord) {
        notif("You did not bring enough food for the war. They resort to hunting and foraging to get more food")
        wheatLord += forage(tu)
        wheatLord -= tu
    }else {
        wheatLord -= tu
    }
}

function calcStrength() {
    
}





/* UI FUNCTION */
function run() {
    setInterval(showit, 1000)
    setInterval(timer, 1000)
}

function showit() {
    document.getElementById("date").innerHTML     = day+"/"+month+"/"+year
    document.getElementById("pop").innerHTML = pop
    document.getElementById("wheat").innerHTML = wheatLord
}

