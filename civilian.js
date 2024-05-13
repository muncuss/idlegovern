/* CIVILIAN */
function birthf() {
    let total
    
    total = pop * birthRate
    if(total < 0) {
        pop += Math.ceil(total)
    }else {
        pop += Math.floor(total)
    }
}

//unused
function birthdf(){
    if(birthd > 1) {
        birthd--
        pop++
    }
}

function popAmount(x) {
    return Math.floor(x * pop)
}

function harvest() {
    let total
    let event = harvestEvent()
    let famAmount = Math.floor(popAmount(arrFarmer[1]) / 6)
    let harvested
    let reqGoods = famAmount
    
    total = Math.floor(famAmount * 11) * harvestRate
    arrFarmer[3] = Math.floor(total * event)
    if(arrFarmer[4] > reqGoods && arrFarmer[6] < (popAmount(arrFarmer[1])*10)) {
        arrFarmer[4] -= reqGoods
    } else{
        arrFarmer = buyGoods(reqGoods, arrFarmer)
    }
}

function harvestEvent() {
    let ch = randomInt(0, 3)
    if(ch == 0) {
        switch(randomInt(0, 2)) {
            case 0:
                notif("A flood destroyed most of the field. The people experience harvest failure")
                return 0.1
                break;
            case 1:
                notif("Some of the crops can't be harvested due to disease")
                return 0.8
                break;
            case 2:
                notif("Good weather makes the crops produce more wheat")
                return 1.2
                break;
        }
    }else {
        return 1
    }
}

function produce() {
    let total
    let reqMat = Math.floor(popAmount(arrArtisan[1]) * 3)
    let remain = invMerchant[5] - reqMat
    total = popAmount(arrArtisan[1]) * produceRate
    
    if(arrArtisan[4] > 2000) {
        arrArtisan[4] += 0
    }else if(arrArtisan[5] < reqMat) {
    //if not enough material
        if(invMerchant[5] < reqMat && arrArtisan[6] < (popAmount(arrArtisan[1])*10)) {
        //if merchant not enough material
            arrArtisan = buyMaterial((reqMat - remain), arrArtisan)
            arrArtisan[5] += forage((reqMat - remain))
        }else if(invMerchant[5] > reqMat &&  arrArtisan[6] < (popAmount(arrArtisan[1])*10)) {
            arrArtisan = buyMaterial(reqMat, arrArtisan)
        }else {
            arrArtisan[4] += 0
        }
    }else {
        arrArtisan[5] -= reqMat
        arrArtisan[4] += total
    }
}

function gather() {
    let gathered
    let total
    
    total = popAmount(arrGatherer[1]) * gatherRate
    if(arrGatherer[5] > 5000) {
        arrGatherer[5] += 0
    }else {
        arrGatherer[5] += total
    }
}

function forage(x) {
    let foraged
    let min = x 
    let max = x * 1.2
    
    foraged = randomInt(min, max)
    return foraged
}

function eat(arr) {
    let liest = arr
    let eaten
    let remaining
    let totalPop = popAmount(arr[1])
    let wheatPop = arr[3]
    let costBuy 
    
    eaten = totalPop * consumRate
    remaining = wheatPop - Math.ceil(eaten)
    if(remaining < 0) {
        outStock = remaining + invMerchant[0]
        if(outStock < 0) {
            wheatPop += forage(Math.abs(remaining))
            wheatPop -= Math.ceil(eaten)
        }else if(outStock > 0 && arr[6] < (popAmount(arr[1])*10)){
            liest = buyWheat(Math.abs(remaining),arr)
            wheatPop -= Math.ceil(eaten)
        }else {
            wheatPop += forage(Math.abs(remaining))
            wheatPop -= Math.ceil(eaten)
        }
    }else {
        wheatPop -= Math.ceil(eaten)
    }
    liest[3] = wheatPop
    
    return liest
}

//ROT/BREAK
function minGoods(arr) {
    let liest = arr
    let min = Math.floor(popAmount(arr[1]) / 6) * 10
    let amount = Math.floor(invMerchant[1] / 3)
    
    if(arr[4] < min && arr[6] < (popAmount(arr[1])*10)) {
        liest = buyGoods(amount, liest)
    }
    
    return liest
}

function goodsBreak(arr) {
    let liest = arr
    let goods = arr[4]
    
    goods -= Math.ceil(goods * 0.01)
    liest[4] = goods
    
    return liest
}

function wheatRot(arr) {
    let liest = arr
    let wheat = arr[3]
    
    wheat -= Math.ceil(wheat * 0.01)
    liest[3] = wheat
    
    return liest
}

/* function happiness() {
    if(happiness < 3) {
        migrate()
    }else if(happiness < 1){
        revolt()
    }
} */
