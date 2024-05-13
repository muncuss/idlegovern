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