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
//    let reqGoods = famAmount
    
    total = Math.floor(famAmount * 11) * harvestRate
    arrFarmer[3] = Math.floor(total * event)
}

function harvestEvent() {
    let ch = randomInt(0, 3)
    if(ch == 0) {
        switch(randomInt(0, 2)){
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
    
    total = popAmount(arrArtisan[1]) * produceRate
    if(arrArtisan[4] > 5000) {
        arrArtisan[4] += 0
    }else if(arrArtisan[5] < reqMat) {
        //if not enough goods, forage
        if(arrMerchant[5] < reqMat) {
            arrArtisan[5] += forage(reqMat)
        }else {
            arrArtisan = buyMaterial(reqMat, arrArtisan)
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
        }else if(outStock > 0){
            liest = buyWheat(Math.abs(remaining),arr)
            //wheatPop += forage(Math.abs(outStock)) what logic are you using here? just buy no need to forage
            wheatPop -= Math.ceil(eaten)
        }
    }else {
        wheatPop -= Math.ceil(eaten)
    }
    liest[3] = wheatPop
    
    return liest
}

/* local market:
each population sell 80% remainder to merchant. then merchant sell in town market daily. price can fluctuate based on demand. people can buy from merchant anytime they need something*/

function merchantCapital() {
    let assigned = Math.floor((arrMerchant[2] - 5000) / 3)
    
    for(let i = 0; i < capMerchant.length; i++){
        if(capMerchant[i] < 200 && assigned > 0) {
            capMerchant[i] += assigned
            arrMerchant[2] -= assigned
        }
    }
}
//kebawah belum
function merchantBuy(arr) {
    let demand = supplyDemand(trdSupply, trdDemand)
    
    if(arr[0] == "farmer") {
        let eatReq = Math.ceil((popAmount(arr[1]) * consumRate) * 12)
        let wheatSellable = Math.floor((arr[3] - eatReq) * 0.8)
        let cost = Math.floor((wheatSellable * priceOg[0]) * buyFactor)
        let able = Math.floor((capMerchant[0] - 100) / priceOg[0])
        let ableCost = Math.floor(able * priceOg[0] * buyFactor)
        
        if(wheatSellable > able && capMerchant[0] > ableCost && able > 0 && demand[0] > -1000) {
            arrFarmer[3] -= able
            invMerchant[0] += able
            trdSupply[0] += able
            arrFarmer[2] += ableCost
            capMerchant[0] -= ableCost
            console.log("Merchant bought", able, "wheat from some farmer")
        }
        
    }else if(arr[0] == "artisan"){
        let goodsSellable = Math.floor(arr[4] * 0.8)
        let cost = Math.floor((goodsSellable * priceOg[1]) * buyFactor)
        let able = Math.floor((capMerchant[1] - 100) / priceOg[1])
        let ableCost = Math.floor(able * priceOg[1] * buyFactor)
        
        if(goodsSellable > able && capMerchant[1] > ableCost && able > 0 && demand[1] > -50) {
            arrArtisan[4] -= able
            invMerchant[1] += able
            trdSupply[1] += able
            arrArtisan[2] += ableCost
            capMerchant[1] -= ableCost
            console.log("Merchant bought", able, "goods from some crafstmen")
        }
        
    }else if(arr[0] == "gatherer") {
        let materSellable = Math.floor(arr[5] * 0.8)
        let cost = Math.floor((materSellable * priceOg[2]) * buyFactor)
        let able = Math.floor((capMerchant[2] - 100) / priceOg[2])
        let ableCost = Math.floor(able * priceOg[2] * buyFactor)
        
        if(materSellable > able && capMerchant[2] > ableCost && able > 0 && demand[2] > -50) {
            arrGatherer[5] -= able
            invMerchant[2] += able
            trdSupply[2] += able
            arrGatherer[2] += ableCost
            capMerchant[2] -= ableCost
            console.log("Merchant bought", able, "materials from some miner and hunter")
        }
    }
}

function buyWheat(amount, arr) {
    let liest = arr
    let coin = arr[2]
    let wheat = arr[3]
    let debt = arr[6]
    
    let cost = amount * Math.floor(priceOg[0] * sellFactor)
    if(coin > cost) {
        coin -= cost
        wheat += amount
        arrMerchant[2] += cost
        invMerchant[0] -= amount
        liest[2] = coin
        liest[3] = wheat
        trdDemand[0] += amount
        return liest
    }else {
        wheat += amount
        debt += cost
        invMerchant[0] -= amount
        arrMerchant[6] += cost
        liest[3] = wheat
        liest[6] = debt
        trdDemand[0] += amount
        return liest
    }
}

function buyGoods(amount, arr) {
    let liest = arr
    let coin = arr[2]
    let goods = arr[4]
    let debt = arr[6]
    
    let cost = amount * Math.floor(priceOg[1] * sellFactor)
    if(coin > cost) {
        coin -= cost
        goods += amount
        arrMerchant[2] += cost
        invMerchant[1] -= amount
        liest[2] = coin
        liest[4] = goods
        trdDemand[1] += amount
        return liest
    }else {
        goods += amount
        debt += cost
        invMerchant[1] -= amount
        arrMerchant[6] += cost
        liest[4] = goods
        liest[6] = debt
        trdDemand[1] += amount
        return liest
    }
}

function buyMaterial(amount, arr) {
    let liest = arr
    let coin = arr[2]
    let material = arr[5]
    let debt = arr[6]
    
    let cost = amount * Math.floor(priceOg[2] * sellFactor)
    if(coin > cost) {
        coin -= cost
        material += amount
        arrMerchant[2] += cost
        invMerchant[2] -= amount
        liest[2] = coin
        liest[5] = material
        trdDemand[2] += amount
        return liest
    }else {
        material += amount
        debt += cost
        invMerchant[2] -= amount
        arrMerchant[6] += cost
        liest[5] = material
        liest[6] = debt
        trdDemand[2] += amount
        return liest
        //loan
    }
}

function payDebt(dataArray) {
    let liest = dataArray
    let coin = dataArray[2]
    let debt = dataArray[6]
    
    if(coin > debt && debt > 0) {
        console.log(dataArray[0], "just paid back a debt of", debt, "coins to the merchant")
        arrMerchant[6] -= debt
        arrMerchant[2] += debt
        coin -= debt
        debt = 0
        liest[2] = coin
        liest[6] = debt
    }
    return liest
}

//SELL & ROT/BREAK
function minGoods(arr) {
    let liest = arr
    let min = Math.floor(popAmount(arr[1]) / 6) * 10
    let amount = Math.floor(invMerchant[1] / 3)
    
    if(arr[4] < min) {
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

function sellWheat(amount, arr) {
    let liest = arr
    let coin = arr[2]
    let wheat = arr[3]
    let debt = arr[6]
    
    let cost = amount * Math.floor(priceOg[0] * buyFactor)
    if(arrMerchant[2] > cost) {
        coin += cost
        wheat -= amount
        arrMerchant[2] -= cost
        invMerchant[0] += amount
        liest[2] = coin
        liest[3] = wheat
        trdSupply[0] += amount
        return liest
    }else {
        return liest
    }
}

function sellGoods(amount, arr) {
    let liest = arr
    let coin = arr[2]
    let goods = arr[4]
    let debt = arr[6]
    
    let cost = amount * Math.floor(priceOg[1] * buyFactor)
    if(arrMerchant[2] > cost) {
        coin += cost
        goods -= amount
        arrMerchant[2] -= cost
        invMerchant[1] += amount
        liest[2] = coin
        liest[4] = goods
        trdSupply[1] += amount
        return liest
    }else {
        return liest
    }
}

function sellMaterial(amount, arr) {
    let liest = arr
    let coin = arr[2]
    let material = arr[5]
    let debt = arr[6]
    
    let cost = amount * Math.floor(priceOg[2] * buyFactor)
    if(arrMerchant[2] > cost) {
        coin += cost
        material -= amount
        arrMerchant[2] -= cost
        invMerchant[2] += amount
        liest[2] = coin
        liest[5] = material
        trdSupply[2] += amount
        return liest
    }else {
        return liest
    }
}

function supplyDemand(supply, demand) {
    let k = []
    
    if(day == 1 && month == 1) {
        for(let i = 0; i < supply.length; i++) {
            trdSupply[i] = invMerchant[i]
            trdDemand[i] = 0
        }
    }
    
    for(let i = 0; i < supply.length; i++) {
        k.push(demand[i] - supply[i])
    }
    
    return k
}
