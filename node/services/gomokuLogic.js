'use strict';

const rowLength = 15;
const cellMods = [0, 1, 1, 1, 0, -1, -1, -1];
const rowMods  = [-1, -1, 0, 1, 1, 1, 0, -1];
const cellConstructor = (id) => ({
    isEmpty: true,
    isWhite: true,
    id: id
});

const fillCell = function(table, number, isWhite){
    table[number].isEmpty = false;
    table[number].isWhite = isWhite;
    return checkVictory(table, number);
};

const tableConstructor = function(){
    let table = [];
    for(let i = 0; i < rowLength*rowLength; i++) {
        table.push(cellConstructor(i));
    }
    return table;
};

const watchLine = function(table, isWhite, cell, row, cellModifier, rowModifier, only){
    // if only = true, then we count only cells with the same color
    // if only = false, we count cells with color AND empty cells
    let length = 0;
    let isSame = true;
    let count = 4;
    let tCell = cell;
    let tRow = row;

    while(isSame && count > 0){
        tCell = tCell + cellModifier;
        tRow = tRow + rowModifier;
        if (tCell < 0 || tCell > (rowLength-1) || tRow < 0 || (tRow > rowLength-1)) {
            isSame = false;
        } else {
            let cellToScan = table[tRow * rowLength + tCell];
            if (
                (only && cellToScan.isWhite === isWhite && !cellToScan.isEmpty) ||
                (!only && (cellToScan.isWhite === isWhite || cellToScan.isEmpty))
            ) {
                length++;
                count--;
            } else {
                isSame = false;
            }
        }
    }
    return length;
};

const watchLines = function(table, isWhite, cell, row, only) {
    const results = [];
    let isOk = false;
    const cellNumber = rowLength * row + cell;

    const cellHasRightColor = table[cellNumber].isWhite === isWhite;
    const cellIsEmpty = table[cellNumber].isEmpty;

    if (
        (only && (cellIsEmpty || !cellHasRightColor)) ||
        (!only && !cellIsEmpty && !cellHasRightColor)
    ) {
        return false;
    }

    for (let i = 0; i < cellMods.length; i++) {
        results.push(watchLine(table, isWhite, cell, row, cellMods[i], rowMods[i], only));
    }

    for (let i = 0; i < cellMods.length/2; i++) {
        if ((results[i] + results[i + cellMods.length/2]) >= 4) {
            isOk = true;
        }
    }

    return isOk;
};

const checkVictory = function(table, cellNumber) {
    let row = Math.floor(cellNumber/rowLength);
    let cell = cellNumber - row * rowLength;
    let isWhite = table[cellNumber].isWhite;

    if (table[cellNumber].isEmpty) {
        return false;
    }

    return watchLines(table, isWhite, cell, row, true);
};

const checkPossibility = function(table, isWhite) {
    let isPossible = false;
    let i = 0;
    while(!isPossible && i < rowLength*rowLength) {
        let row = Math.floor(i/rowLength);
        let cell = i - row * rowLength;
        isPossible = watchLines(table, isWhite, cell, row, false);
        i++;
    }
    return isPossible;
};

module.exports = {fillCell, tableConstructor, checkVictory, checkPossibility};