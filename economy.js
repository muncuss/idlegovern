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
    
    if(arr[0] == "farmer") {
        let eatReq = Math.ceil((popAmount(arr[1]) * consumRate) * 12)
        let wheatSellable = Math.floor((arr[3] - eatReq) * 0.8)
        let cost = Math.floor((wheatSellable * priceOg[0]) * buyFactor)
        let able = Math.floor((capMerchant[0] - 100) / priceOg[0])
        let ableCost = Math.floor(able * priceOg[0] * buyFactor)
        
        if(wheatSellable > able && capMerchant[0] > ableCost && able > 0 && invMerchant[0] < 1000) {
            arrFarmer[3] -= able
            invMerchant[0] += able
            trdSupply[0] += able
            arrFarmer[2] += ableCost
            capMerchant[0] -= ableCost
            priceChange(0, "sell", able)
            console.log("Merchant bought", able, "wheat from some farmer")
        }
        
    }else if(arr[0] == "artisan"){
        let goodsSellable = Math.floor(arr[4] * 0.8)
        let cost = Math.floor((goodsSellable * priceOg[1]) * buyFactor)
        let able = Math.floor((capMerchant[1] - 100) / priceOg[1])
        let ableCost = Math.floor(able * priceOg[1] * buyFactor)
        
        if(goodsSellable > able && capMerchant[1] > ableCost && able > 0 && invMerchant[1] < 50) {
            arrArtisan[4] -= able
            invMerchant[1] += able
            trdSupply[1] += able
            arrArtisan[2] += ableCost
            capMerchant[1] -= ableCost
            priceChange(1, "sell", able)
            console.log("Merchant bought", able, "goods from some crafstmen")
        }
        
    }else if(arr[0] == "gatherer") {
        let materSellable = Math.floor(arr[5] * 0.8)
        let cost = Math.floor((materSellable * priceOg[2]) * buyFactor)
        let able = Math.floor((capMerchant[2] - 100) / priceOg[2])
        let ableCost = Math.floor(able * priceOg[2] * buyFactor)
        
        if(materSellable > able && capMerchant[2] > ableCost && able > 0 && invMerchant[2] < 50) {
            arrGatherer[5] -= able
            invMerchant[2] += able
            trdSupply[2] += able
            arrGatherer[2] += ableCost
            capMerchant[2] -= ableCost
            priceChange(2, "sell", able)
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
        priceChange(0, "buy", amount)
        return liest
    }else {
        wheat += amount
        debt += cost
        invMerchant[0] -= amount
        arrMerchant[6] += cost
        liest[3] = wheat
        liest[6] = debt
        trdDemand[0] += amount
        priceChange(0, "buy", amount)
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
        priceChange(1, "buy", amount)
        return liest
    }else {
        goods += amount
        debt += cost
        invMerchant[1] -= amount
        arrMerchant[6] += cost
        liest[4] = goods
        liest[6] = debt
        trdDemand[1] += amount
        priceChange(1, "buy", amount)
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
        priceChange(2, "buy", amount)
        return liest
    }else {
        material += amount
        debt += cost
        invMerchant[2] -= amount
        arrMerchant[6] += cost
        liest[5] = material
        liest[6] = debt
        trdDemand[2] += amount
        priceChange(2, "buy", amount)
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
        priceChange(0, "sell", amount)
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
        priceChange(1, "sell", amount)
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
        priceChange(2, "sell", amount)
        return liest
    }else {
        return liest
    }
}

function supplyDemand(supply, demand) {
    if(day == 1 && month == 1) {
        for(let i = 0; i < supply.length; i++) {
            trdSupply[i] = invMerchant[i]
            trdDemand[i] = 0
        }
    }
}
/* //PROBLEM: PUSING
function dynamicPrice() {
    let p = priceOg
    let s = trdSupply
    let d = trdDemand
    
    for(let i = 0; i < p.length; i++) {
        let diff = d[i] - s[i]
        if(i == 0) {
            diff += 1000
        }else if(i == 1 && p[i] < 70) {
            diff += 50
        }else if(i == 2 && p[i] < 24) {
            diff += 50
        }
        console.log("diff",i,"is",diff)
        if(diff > 0) {
            if(i == 0 && p[i] < 7.3) {
                let rem = diff / 1000
                p[i] += rem * 0.1
            }else if(i == 1 && p[i] < 30) {
                let rem = diff / 50
                p[i] += rem * 0.5
            }else if(i == 2 && p[i] < 10) {
                let rem = diff / 100
                p[i] += rem * 0.3
            }
        }else if(diff < 0) {
            if(i == 0 && p[i] > 4.3 && d[i] > 0) {
                let rem = diff / -1000
                p[i] -= rem * 0.1
            }else if(i == 1 && p[i] > 18 && d[i] > 0) {
                let rem = diff / -50
                p[i] -= rem * 0.5
            }else if(i == 2 && p[i] > 6 && d[i] > 0) {
                let rem = diff / -100
                p[i] -= rem * 0.3
            }
        }
        
        p[i] = parseFloat(p[i].toFixed(2))
    }
    console.log(p)
    priceOg = p
}
*/
 
function priceChange(res, type, amount) {
    let p = 0
    
    if(type == "buy") {
        if(res == 0) {
            p += (amount / 200) * 0.01
        }else if(res == 1) {
            p += (amount / 50) * 0.01
        }else if(res == 2) {
            p += (amount / 100) * 0.01
        }
    }else if(type == "sell") {
        if(res == 0) {
            p -= (amount / 200) * 0.01
        }else if(res == 1) {
            p -= (amount / 50) * 0.01
        }else if(res == 2) {
            p -= (amount / 100) * 0.01
        }
    }
    priceOg[res] += parseFloat(p.toFixed(2))
    priceOg[res] = parseFloat(priceOg[res].toFixed(2))
}

