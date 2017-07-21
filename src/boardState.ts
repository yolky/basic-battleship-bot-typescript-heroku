import {ShipPlacement} from './shipConfiguration';
import {ShipPossibilities} from './shipPossibilities';
import * as Globals from './constants';
import {Position} from './position';
import {Shot} from './shot';

export class BoardState{
    public ships: Array<ShipPlacement> = [];
    public shots: Array<Shot> = [];

    public constructor(ships: Array<ShipPlacement>, shots: Array<Shot> = []){
        this.ships = ships;
        this.shots = shots;
    }

    static getRandomSet(lengths: Array<number>, shots:Array<Shot> = []):BoardState
    {
        let placements:Array<ShipPlacement> = [];
        let possibleShipPositions: Array<ShipPossibilities> = [];
        for(var i=0; i< lengths.length; i++){
            possibleShipPositions.push(new ShipPossibilities(lengths[i]));
            possibleShipPositions[i].removeFromShots(shots);
        }
        for(var i=0; i< lengths.length; i++){
            for(var j=0; j<placements.length; j++){
                possibleShipPositions[i].removePosibilities(placements[j]);
            }
            placements.push(possibleShipPositions[i].pickRandomConfiguration());
        }
        return new BoardState(placements)
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