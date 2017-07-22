import {ShipPlacement} from './shipPlacement';
import {ShipPossibilities} from './shipPossibilities';
import * as Globals from './constants';
import {Position} from './position';
import {Shot} from './shot';
import {randBetween} from './random'

export class BoardState{
    public ships: Array<ShipPlacement> = [];
    public shots: Array<Shot> = [];

    public constructor(ships: Array<ShipPlacement>, shots: Array<Shot> = []){
        this.ships = ships;
        this.shots = shots;
    }

    static getRandomSet(lengths: Array<number>, shots:Array<Shot> = [], hitShots: Array<Shot> = []):BoardState
    {
        let possibleShips: Array<ShipPlacement> = [];
        let validShipPositions: Array<ShipPossibilities> = [];

        let hitShotsWithResolved: {[Position: string]: {shot:Shot, resolved: boolean});

        for(var i=0; i<hitShots.length; i++){
            hitShotsWithResolved[JSON.stringify(hitShots[i].Position)] = {shot: hitShots[i], resolved: false};
        }
        let allResolved: boolean= true;
        if(hitShots.length > 0){
            allResolved = false;
        }

        //perhaps get valid placements beforehand, and choose one with minimum number of valid placements

        while(!allResolved){
            //use placeRandomShipFromShot to get next ship
            //remove the resolved shots
            //update the valid positions for all the ships
            //update the allResolved boolean (NOR the list's resolved property)

            //if at any point validPlacements  == 0,
        }

        //for whatever ships have yet to be placed (needs to be checked)
        //place those ships randomly

        // for(var i=0; i<lengths.length; i++){
        //     validShipPositions.push(new ShipPossibilities(lengths[i]));
        //     //possibleShips.push(BoardState.placeNextShip(lengths,possibleShips,shots,i));
        // }
        return new BoardState(possibleShips);

        //pick first shot
        //choose
    }

    static placeRandomShipFromShot(hitShot: Shot, validShipPositions: Array<ShipPossibilities>):ShipPlacement{
        if(hitShot.WasHit){
            let validPlacements: Array<ShipPlacement> = [];
            for(var i=0; i<validShipPositions.length; i++){
                validPlacements.concat(validShipPositions[i].getValidShotImpliedPlacements(hitShot));
            }
            return validPlacements[randBetween(0,validPlacements.length-1)];
            //pick a random one

        }
        else{
            throw new Error("should be hit only...");
        }
    }

    public drawShips(){
        let board:Array<Array<boolean>> = this.getBoardArray();

        console.log("ships:");
        
        for(var i=0;i <Globals.BOARD_ROWS; i++){
            let currentRow:string = '';
            for(var j = 0; j<Globals.BOARD_COLS; j++){
                if(board[i][j]){
                    currentRow += 'X';
                }
                else{
                    currentRow += 'O';
                }
            }
            console.log(currentRow);
        }
    }

    public getBoardArray():Array<Array<boolean>>{
        
        let board:Array<Array<boolean>> = [];
        for(var i=0;i <Globals.BOARD_ROWS; i++){
            board.push([])
            for(var j = 0; j<Globals.BOARD_COLS; j++){
                board[i].push(false);
            }
        }

        for(var i=0; i<this.ships.length; i++){
            let blockedSquares: Array<Position> = this.ships[i].getOccupiedPositions();
            for(var j=0; j< blockedSquares.length; j++){
                board[blockedSquares[j].row][blockedSquares[j].col] = true;
            }
        }
        return board;
    }

    public static getRandomBoardArray(lengths: Array<number>, shots: Array<Shot>):Array<Array<boolean>>{
        return BoardState.getRandomSet(lengths,shots).getBoardArray();
    }

    public static getRandomStartingConfiguration(lengths: Array<number>):Array<ShipPlacement>{
        return BoardState.getRandomSet(lengths).ships;
    }
    
}