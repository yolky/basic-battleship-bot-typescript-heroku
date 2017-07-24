import {ShipPlacement} from './shipPlacement';
import {ShipPossibilities} from './shipPossibilities';
import * as Globals from './constants';
import {Position} from './position';
import {Shot} from './shot';
import {randBetween} from './random'
import {ShotImpliedPlacements} from './shotImpliedPlacements'

export class BoardState{
    public ships: Array<ShipPlacement> = [];
    public shots: Array<Shot> = [];

    public constructor(ships: Array<ShipPlacement>, shots: Array<Shot> = []){
        this.ships = ships;
        this.shots = shots;
    }

    static tryGetRandomSet(shipLengths: Array<number>, shots:Array<Shot> = [], hitShots: Array<Shot> = []):{state: BoardState, found: boolean}
    {
        let possibleShips: Array<ShipPlacement> = [];
        let validShipPositions: Array<ShipPossibilities> = [];

        let numberRemaining: {[length: number]: number} = [];

        let shotImpliedPlacementsList: Array<ShotImpliedPlacements> = [];

        for(var i=0; i<shipLengths.length; i++){
            validShipPositions.push(new ShipPossibilities(shipLengths[i]));
            validShipPositions[i].removeFromShots(shots);

            if(!numberRemaining[shipLengths[i]]){
                numberRemaining[shipLengths[i]] = 1;
            }
            else{
                numberRemaining[shipLengths[i]]++;
            }
        }

        for(var i=0; i<hitShots.length; i++){
            shotImpliedPlacementsList.push(new ShotImpliedPlacements(hitShots[i]));
            shotImpliedPlacementsList[i].removeInvalidPositions(validShipPositions);
        }

        shotImpliedPlacementsList.sort((a,b,)=>{return a.allValidPlacements.length - b.allValidPlacements.length});

        //sort by #

        let numberUnresolved: number= hitShots.length;

        //perhaps get valid placements beforehand, and choose one with minimum number of valid placements

        while(numberUnresolved >0){
            let firstUnresolved:ShotImpliedPlacements;
            let index: number =0;
            while(!firstUnresolved){
                if(shotImpliedPlacementsList[index].resolved == false){
                    firstUnresolved = shotImpliedPlacementsList[index];
                }
            }
            let nextShip:ShipPlacement
            if(firstUnresolved.allValidPlacements.length>0){
                nextShip = firstUnresolved.pickRandomPlacement();
            }
            else{
                return {state: new BoardState([]), found:false};
            }
            

            let occupiedPositions: Array<Position> = nextShip.getOccupiedPositions();
            possibleShips.push(nextShip);
            numberRemaining[nextShip.length]--;
            for(var i=0;i<validShipPositions.length; i++){
                validShipPositions[i].removePossibilities(nextShip);
            }
            for(var i=0; i<occupiedPositions.length;i++){
                for(var j=0; j<shotImpliedPlacementsList.length;j++){
                    if((!shotImpliedPlacementsList[j].resolved)&&shotImpliedPlacementsList[j].shot.Position == occupiedPositions[i]){
                        numberUnresolved--;
                        shotImpliedPlacementsList[j].resolved = true;
                    }
                    shotImpliedPlacementsList[j].updateRemainingShips(numberRemaining);
                    shotImpliedPlacementsList[j].removeInvalidPositions(validShipPositions);
                }
            }

            shotImpliedPlacementsList.sort((a,b,)=>{return a.allValidPlacements.length - b.allValidPlacements.length});
        }

        //for whatever ships have yet to be placed (needs to be checked)
        //place those ships randomly

        for(var i=0; i<shipLengths.length; i++){
            if(numberRemaining[shipLengths[i]]>0){
                let nextShip: ShipPlacement;
                if(validShipPositions[i].numberOfPossibilities >0){
                    nextShip= validShipPositions[i].pickRandomPlacement();      
                }else{
                    return {state: new BoardState([]), found:false};
                }
                
                for(var j=0; j<validShipPositions.length; j++){
                    validShipPositions[j].removePossibilities(nextShip);
                }
                possibleShips.push(nextShip);
                numberRemaining[shipLengths[i]]--;
            }
        }
        return {state: new BoardState(possibleShips), found:true}

        //pick first shot
        //choose
    }

    static getRandomSet(shipLengths: Array<number>, shots:Array<Shot> = [], hitShots: Array<Shot> = []):BoardState{
        let returnValue: {state: BoardState, found: boolean};
        do{
            let returnValue = BoardState.tryGetRandomSet(shipLengths, shots, hitShots);
        }while(!returnValue.found)
        return returnValue.state;
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