/* importing function */



/* data using roman era. coin = denarii */
var day = 24
var month = 6
var year = 1165
var pop = 4648
var birth = 0
var birthd = 0
var birthRate = 0.002
var death = 0
var deathRate = 0.015 //for famine or something
//var wheatPop = 5000
//var goodsPop = 0
//var farmer = 0.5 // % of total pop
//var artisan = 0.1 // %
//var gatherer = 0.2
//var laborer = 0.2
//var land = 1062 // 80% is farmer, divide by household (avg 6 people in household)
var harvestRate = 77 /* medieval data*/
var fertileRate = 1
var produceRate = 4 //per month
var gatherRate = 9
var consumRate = 1.04 /* medieval data per month */

var arrLord = ["lord", 0, 50000, 600, 10, 0, 0, 0]
var arrFarmer = ["farmer", 0.5, 800, 5000, 10, 0, 0, 3]
var arrArtisan = ["artisan", 0.2, 1500, 1000, 100, 40, 0, 3]
var arrGatherer = ["gatherer", 0.2, 500, 1000, 10, 80, 0, 3]
var arrMerchant = ["merchant", 0.1, 15000, 2000, 20, 20, 0, 0]
//var priceOg = [5.8, 80, 23] //
var priceOg = [5.8, 24, 8]
var buyFactor = 0.95
var sellFactor = 1.05
var capMerchant = [1000, 1000, 1000]
var invMerchant = [1000,50,50]
var trdSupply = [1000,50,50]
var trdDemand = [0,0,0]

//var taxRate = 5 //in %
//var wheatLord = 600
//var goodsLord = 10
//var coinLord = 30000
var troopAmount = 0
var troopWage = 60 //2 pence per day medieval data
var troopConsumeRate = 0.034 //per day bushel
var troopStrength = 2
var troopMission = 0

var monsterAmount = 300
var monsterStrength = 5
var monsterLair = 3
var monsterBirthRate = 0.0005

var notiff = ["a","b","c"]

var inter1
var inter2
var currentTab = "troop"



/* SYSTEM FUNCTION */
function timer() {
    day++;
    if(day > 30) {
        month++
        day = 1
        monthly()
        console.log("Merchant coin:", arrMerchant[2])
    }
    if(month > 12) {
        year++;
        month = 1
        produceTax()
        gatherTax()
    }
    if(month == 7 && day == 1) {
        harvest()
        harvestTax()
    }
}

function monthly() {
    birthf()
    
    arrFarmer = eat(arrFarmer)
    arrArtisan = eat(arrArtisan)
    arrGatherer = eat(arrGatherer)
    arrMerchant = eat(arrMerchant)
    arrFarmer = wheatRot(arrFarmer)
    arrArtisan = wheatRot(arrArtisan)
    arrGatherer = wheatRot(arrGatherer)
    arrMerchant = wheatRot(arrMerchant)
    arrFarmer = goodsBreak(arrFarmer)
    arrArtisan = goodsBreak(arrArtisan)
    arrGatherer = goodsBreak(arrGatherer)
    arrMerchant = goodsBreak(arrMerchant)
    arrFarmer = minGoods(arrFarmer)
    arrArtisan = minGoods(arrArtisan)
    arrGatherer = minGoods(arrGatherer)
    
    troopWagef()
    troopEat()
    monsterBreed()
    monsterRaid()
    
    produce()
    gather()
    
    merchantCapital()
    merchantBuy(arrFarmer)
    merchantBuy(arrArtisan)
    merchantBuy(arrGatherer)
    arrFarmer = payDebt(arrFarmer)
    arrArtisan = payDebt(arrArtisan)
    arrGatherer = payDebt(arrGatherer)
}

function randomInt(min, max) { 
    return Math.ceil(Math.random() * (max - min) + min); 

}

function notif(text) {
//    window.alert(text)
    notiff.splice(0,0,text) 
}

function runOnce(func) {
    let k = 0
    if(k == 0) {
        func()
        k = 1
    }
}





/* LORD */
function harvestTax() {
    let x
    x = Math.floor(arrFarmer[3] * (arrFarmer[7] / 100))
    arrFarmer[3] -= x
    arrLord[3] += x
    notif(`This year harvest tax is ${x} bushels`)
}

function produceTax() {
    let x
    x = Math.floor(arrArtisan[4] * (arrArtisan[7] / 100))
    arrArtisan[4] -= x
    arrLord[4] += x
    notif(`Production tax from the artisans is ${x} goods in various forms`)
}

function gatherTax() {
    let x
    x = Math.floor(arrGatherer[5] * (arrGatherer[7] / 100))
    arrGatherer[5] -= x
    arrLord[5] += x
    notif(`Tax from the gatherer is ${x} material`)
}

function sellWheatLord(input) {
    let cost = input * Math.floor(priceOg[0] * buyFactor)
    if(input > arrLord[3]) {
        notif("Not enough wheat in warehouse!")
    }else if(input < 0){
        notif("You can't do that'")
    }else if(arrMerchant[2] < cost){
        notif(`The merchant doesn't have enough coin to buy ${input} wheat`)
    }else {
        arrLord = sellWheat(input, arrLord)
        notif(`You sold ${input} wheat for ${cost} coins`)
    }
}

function sellGoodsLord(input) {
    let cost = input * Math.floor(priceOg[1] * buyFactor)
    if(input > arrLord[4]) {
        notif("Not enough goods in warehouse!")
    }else if(input < 0){
        notif("You can't do that'")
    }else if(arrMerchant[2] < cost){
        notif(`The merchant doesn't have enough coin to buy ${input} goods`)
    }else {
        arrLord = sellGoods(input, arrLord)
        notif(`You sold ${input} goods for ${cost} coins`)
    }
}

function sellMaterialLord(input) {
    let cost = input * Math.floor(priceOg[2] * buyFactor)
    if(input > arrLord[5]) {
        notif("Not enough material in warehouse!")
    }else if(input < 0){
        notif("You can't do that'")
    }else if(arrMerchant[2] < cost){
        notif(`The merchant doesn't have enough coin to buy ${input} material`)
    }else {
        arrLord = sellMaterial(input, arrLord)
        notif(`You sold ${input} materials for ${cost} coins`)
    }
}

function buyWheatLord(input) {
    let cost = input * Math.floor(priceOg[0] * sellFactor)
    if(input > invMerchant[0]) {
        notif("The market doesn't have enough wheat")
    }else if(input < 0){
        notif("You can't do that'")
    }else if(arrLord[2] < cost){
        notif("You don't have enough coin M'lord")
    }else {
        arrLord = buyWheat(input, arrLord)
        notif(`You bought ${input} wheat for ${cost} coins from local market`)
    }
}

function buyGoodsLord(input) {
    let cost = input * Math.floor(priceOg[1] * sellFactor)
    if(input > invMerchant[1]) {
        notif("The market doesn't have enough goods")
    }else if(input < 0){
        notif("You can't do that'")
    }else if(arrLord[2] < cost){
        notif("You don't have enough coin M'lord")
    }else {
        arrLord = buyGoods(input, arrLord)
        notif(`You bought ${input} goods for ${cost} coins from local market`)
    }
}

function buyMaterialLord(input) {
    let cost = input * Math.floor(priceOg[2] * sellFactor)
    if(input > invMerchant[2]) {
        notif("The market doesn't have enough material")
    }else if(input < 0){
        notif("You can't do that'")
    }else if(arrLord[2] < cost){
        notif("You don't have enough coin M'lord")
    }else {
        arrLord = buyMaterial(input, arrLord)
        notif(`You bought ${input} materials for ${cost} coins from local market`)
    }
}

function changeTax(input,x) {
    if(input > 30) { //max tax rate 30%
        notif("Tax rate too high!")
    }else if(input < 0){
        notif("Are you serious?")
    }else{
        x[7] = input
        notif(`Changed tax rate to ${input}`)
    }
}





/* ENEMY */
function monsterBreed() {
    let w
    w = monsterAmount * monsterBirthRate
    monsterAmount += Math.floor(w)
}

function monsterRaid() {
    let k = randomInt(0, 4)
    let pack = randomInt(5, 10)
    if(k == 1) {
        notif("Monster raided our village!")
        let ts = troopAmount * troopStrength
        let ms = pack * monsterStrength
        let result = ts - ms
        if(result < 0) {
        //troop total strength is weaker
            let resultpos = Math.abs(result)
            let tloss = Math.floor(resultpos / troopStrength)
            if(ts <= 0 && pop > tloss) {
            //no troop
                pop -= tloss
                notif(`${tloss} people was killed by the monster! Maybe you should have recruited some troops`)
            }else {
                notif(`Casualty from previous monster attack is ${tloss} people, from both soldier and civilian`)
                let diff = Math.abs(tloss - troopAmount)            
                if(tloss > troopAmount && pop > diff) {
                    troopAmount -= tloss - diff
                    pop -= diff
                }else if(tloss < troopAmount && pop > diff){
                    troopAmount -= tloss
                }else if(tloss > troopAmount && pop < diff){
                    pop = 0
                    lost()
                }else {
                    lost()
                }
            }
        }else {
            notif(`Rejoice! your troops succesfully defended the town from monster raid!`)
            let mloss = result / ms
            monsterAmount -= Math.floor(mloss)
        }
    }
}

function destroyLair(troopx) {
    let ts = troopx * troopStrength
    let ms = (monsterAmount/monsterLair)*monsterStrength
    let result = ts - ms
    if(result < 0) {
        notif("The expedition failed! Unfortunately, your entire troop in the mission is killed")
        troopMission = 0
    }else {
        notif("The expedition succeeded! one lair is destroyed")
        monsterLair -= 1
        monsterAmount -= monsterAmount/monsterLair
        let killed = result / troopStrength
        troopAmount += troopMission - Math.floor(killed)
    }
}





/* TROOP */
function troopWagef() {
    let tu
    let payBack
    
    tu = (troopAmount+troopMission) * troopWage
    payBack = Math.floor(tu / 3)
    if(tu > arrLord[2]) {
        notif("Not enough coin to pay your troops! some of them leave the barack")
        let o = tu - arrLord[2]
        let p = o / troopWage
        troopAmount -= Math.floor(p)
        arrLord[2] -= Math.floor((troopAmount+troopMission)*troopWage)
    }else if(troopAmount > 0) {
        arrLord[2] -= tu
        arrFarmer[2] += payBack
        arrArtisan[2] += payBack
        arrGatherer[2] += payBack
        notif(`Troops wage for this month is ${tu} coins`)
    }
}

function troopEat() {
    let tu
    
    tu = Math.ceil(troopAmount * troopConsumeRate)
    if(arrLord[2] < tu) {
        notif("There is not enough wheat in the warehouse to feed the troops. Your troops resort to hunting and foraging")
        arrLord[3] += forage(tu)
        arrLord[3] -= tu
    }else if(troopAmount > 0) {
        arrLord[3] -= tu
        notif(`${tu} bushel of wheat has been used to feed the troops`)
    }
}

function troopAssign(x) {
    let time = (randomInt(10,20) * 1000)
    let wheat = Math.ceil((x * troopConsumeRate) * (time / 1000))
    
    if(arrLord[3] > wheat && x > 0) {
        troopAmount -= x
        troopMission = x
        arrLord[3] -= wheat
        notif(`You have assigned ${x} troops in a mission to destroy monster lair`)
        setTimeout(destroyLair, time, x)
    }else {
        notif("You don't have enough wheat to supply the troops in mission!")
    }
}

/*function calcStrength() {
    
}*/

function troopRecruit(input) {
    if(input > pop) {
        notif("Not enough population!")
    }else if(arrLord[4] < input * 2) {
        notif("Not enough armor and weapon for the new recruit!")
    }else if(input > 0){
        let g = input * 2
        arrLord[4] -= g
        troopAmount += input
        pop -= input
        notif(`You have recruited ${input} new troop, costing ${g} goods for the weapon and armor`)
    }
}

function troopDismiss(input) {
    if(input > troopAmount && input > 0) {
        notif("No one to be dissmissed!")
    }else {
        troopAmount -= input
        pop += input
    }
}





/* MISC */
function lost() {
    notif("YOU LOST!")
    clearInterval(inter1)
}




/* UI FUNCTION */
function run() {
//    ai.change("changed!")
//    console.log(ai.go)
//    console.log(go)
    inter1 = setInterval(timer, 1000)
    inter2 = setInterval(showit, 1000)
    initialTab()
//    timer()
//    showit()
}

function showit() {
    notifRemove()
//    initialTab()
    document.getElementById("date").innerHTML     = day+"/"+month+"/"+year
    document.getElementById("pop").innerHTML = pop
    document.getElementById("coin").innerHTML = arrLord[2]
    document.getElementById("wheat").innerHTML = arrLord[3]
    document.getElementById("goods").innerHTML = arrLord[4]
    document.getElementById("material").innerHTML = arrLord[5]
    //document.getElementById("taxrate").innerHTML = taxRate
    document.getElementById("idleTroop").innerHTML = troopAmount
    document.getElementById("inMission").innerHTML = troopMission
    document.getElementById("monsterLair").innerHTML = monsterLair
    document.getElementById("notiff").innerHTML = notiff.join("<br/>")
    
}

function notifRemove() {
    if(notiff.length > 5) {
        notiff.splice(5,1)
    }
}

function switchTab(tab) {
//    let bro
//    bro = tab
    let bro = tab.toString()
     document.getElementById(currentTab).style.display = "none"
    document.getElementById(bro).style.display = "inline"
    currentTab = bro
}

function initialTab() {
    document.getElementById("economy").style.display = "none"
}





/* INPUT */
function changeTaxInput() {
    let k = document.getElementById("changeTaxInput").value
   changeTax(parseInt(k))
   document.getElementById("changeTaxInput").value = null
}

/*function sellGoodsInput() {
    let k = document.getElementById("sellGoodsInput").value
   sellGoodsLord(parseInt(k))
   document.getElementById("sellGoodsInput").value = null
}

function buyGoodsInput() {
    let k = document.getElementById("buyGoodsInput").value
   buyGoodsLord(parseInt(k))
   document.getElementById("buyGoodsInput").value = null
}*/

function troopRecruitInput() {
   let k = document.getElementById("inputTroopRecruit").value
   troopRecruit(parseInt(k))
   document.getElementById("inputTroopRecruit").value = null
}

function troopAssignInput() {
   let k = document.getElementById("assignForMission").value
   troopAssign(parseInt(k))
   document.getElementById("assignForMission").value = null
}

function troopDismissInput() {
   let k = document.getElementById("inputTroopDismiss").value
   troopDismiss(parseInt(k))
   document.getElementById("inputTroopDismiss").value = null
}

function buyInput() {
    let amount = document.getElementById("buyAmount").value
    let bwheat = document.getElementById("bwheat").selected
    let bgoods = document.getElementById("bgoods").selected
    let bmaterial = document.getElementById("bmaterial").selected
    
    if(bwheat == true) {
        buyWheatLord(parseInt(amount))
        document.getElementById("buyAmount").value = null
    }else if(bgoods == true) {
        buyGoodsLord(parseInt(amount))
        document.getElementById("buyAmount").value = null
    }else if(bmaterial == true) {
        buyMaterialLord(parseInt(amount))
        document.getElementById("buyAmount").value = null
    }
}

function sellInput() {
    let amount = document.getElementById("sellAmount").value
    let swheat = document.getElementById("swheat").selected
    let sgoods = document.getElementById("sgoods").selected
    let smaterial = document.getElementById("smaterial").selected
    
    if(swheat == true) {
        sellWheatLord(parseInt(amount))
        document.getElementById("sellAmount").value = null
    }else if(sgoods == true) {
        sellGoodsLord(parseInt(amount))
        document.getElementById("sellAmount").value = null
    }else if(smaterial == true) {
        sellMaterialLord(parseInt(amount))
        document.getElementById("sellAmount").value = null
    }
}



//window.addEventListener("load", (event) => { run(); });

