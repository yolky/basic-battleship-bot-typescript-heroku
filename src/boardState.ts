import {ShipPlacement} from './shipPlacement';
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
        let possibleShips: Array<ShipPlacement> = [];
        for(var i=0; i<lengths.length; i++){
            possibleShips.push(BoardState.placeNextShip(lengths,possibleShips,shots,i));
        }
        return new BoardState(possibleShips);
    }

    
    static placeNextShip(lengths: Array<number>, alreadyPlaced: Array<ShipPlacement>, shots: Array<Shot>, indexToPlace: number):ShipPlacement{
        let nextShip = new ShipPossibilities(lengths[indexToPlace]);
        for(var i =0; i< alreadyPlaced.length; i++){
            nextShip.removePossibilities(alreadyPlaced[i]);
        }
        nextShip.removeFromShots(shots);

        return nextShip.pickRandomPlacement();
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