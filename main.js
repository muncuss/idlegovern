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
//var land = 1062 // 80% is farmer, divide by household (avg 6 people in household)
var harvestRate = 77 /* medieval data*/
var fertileRate = 1
var produceRate = 4 //per month
var gatherRate = 9
var consumRate = 1.04 /* medieval data per month */
var happiness = 5
//["name", population percentage, coin, wheat, goods, material, debt, tax rate]
var arrLord = ["lord", 0, 12000, 600, 10, 0, 0, 0]
var arrFarmer = ["farmer", 0.5, 800, 8000, 10, 0, 0, 3]
var arrArtisan = ["artisan", 0.2, 1500, 1000, 100, 40, 0, 3]
var arrGatherer = ["gatherer", 0.2, 1500, 1000, 10, 80, 0, 3]
var arrMerchant = ["merchant", 0.1, 40000, 2000, 20, 20, 0, 0]
//var priceOg = [5.8, 80, 23] //
var priceOg = [5.8, 24, 8]
var buyFactor = 0.95
var sellFactor = 1.05
var capMerchant = [1000, 1000, 1000]
var invMerchant = [1000,50,50]
var trdSupply = [0,0,0]
var trdDemand = [0,0,0]

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
    lost()
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
    supplyDemand(trdSupply, trdDemand)
//    dynamicPrice()
    console.log(priceOg)
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





/* MISC */
function lost() {
    if(pop <= 0) {
        notif("YOU LOST!")
        clearInterval(inter1)
    }
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

