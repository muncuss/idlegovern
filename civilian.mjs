/* CIVILIAN */
export function birthf(birthRate, pop) {
    let total
    total = pop * birthRate
//    birthx = Math.ceil(total) - pop
    popx += Math.ceil(total)
    return popx
}

export function popAmount(x) {
    return Math.floor(x * (80/100))
}

export function harvest(land, harvestRate, wheatPop) {
    let total
    total = land * harvestRate
    wheatPop += Math.ceil(total)
    return wheatPop
}

export function produce(artisan, produceRate, goodsPop) {
    let total
    total = popAmount(artisan) * produceRate
    goodsPop += total
    return goodsPop
}

export function eat(pop, consumRate, wheatPop) {
    let eaten
    let remaining
    let wheat = wheatPop
    eaten = pop * (consumRate / 12)
    remaining = wheatPop - Math.ceil(eaten)
    if(remaining <= 0) {
        wheat += forage(remaining)
        wheat -= Math.ceil(eaten)
    }else {
        wheat -= Math.ceil(eaten)
    }
    return wheatPop
} 

export function forage(x) {
    let foraged
    let min = x 
    let max = x * 1.2
    foraged = randomInt(min, max)
    return foraged
}

