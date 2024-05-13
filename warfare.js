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

