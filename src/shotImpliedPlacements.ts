import {ShipPlacement} from './shipPlacement';
import * as Globals from './constants';
import {Direction} from './direction';
import {Position} from './position';
import {Shot} from './shot'
import {ShipPossibilities} from './shipPossibilities'
import {randBetween} from './random'

export class ShotImpliedPlacements{
    private static initialShotImpliedPlacements: {[length: number]:Array<Array<Array<ShipPlacement>>>} = {};
    public shot: Shot;
    public resolved = false;
    private validPlacementsByLength: {[length:number]: Array<ShipPlacement>};

    public allValidPlacements: Array<ShipPlacement> = [];
    
    public constructor(shot:Shot){
        this.shot = shot;
        for(var key in ShotImpliedPlacements.initialShotImpliedPlacements){
            this.validPlacementsByLength[key] = JSON.parse(JSON.stringify(ShotImpliedPlacements[key][this.shot.Position.row][this.shot.Position.col]));
            //deep copy again
        }
    }

    public static generateShotImpliedPlacements(length: number){
        ShotImpliedPlacements.initialShotImpliedPlacements[length] = [];
        for(var i=0; i<Globals.BOARD_ROWS; i++){
            ShotImpliedPlacements.initialShotImpliedPlacements[length].push([]);
            for(var j=0; j<Globals.BOARD_COLS; j++){
                ShotImpliedPlacements.initialShotImpliedPlacements[length][i].push([]);
                let minRow: number = Math.max(0,i-(length-1));
                for(var g = minRow; g<i; g++){
                    ShotImpliedPlacements.initialShotImpliedPlacements[length][i][j].push(new ShipPlacement(Direction.Vertical, length, new Position(g,j)));
                }
                let minCol: number = Math.max(0,j-(length-1));
                for(var g = minCol; g<j; g++){
                    ShotImpliedPlacements.initialShotImpliedPlacements[length][i][j].push(new ShipPlacement(Direction.Horizontal, length, new Position(j,g)));
                }
            }
        }
    }

    public removeInvalidPositions(shipsToCheck: Array<ShipPossibilities>){
        for(var i=0; i<shipsToCheck.length; i++){
            this.removeInvalidPositionsSingle(shipsToCheck[i],false);
        }
        this.generateSingleValidPlacementsList();
    }

    public removeInvalidPositionsSingle(shipToCheck: ShipPossibilities, remakeList:boolean = true){
        for(var i=0; i<this.validPlacementsByLength[shipToCheck.length].length; i++){
            let currentPlacement: ShipPlacement = this.validPlacementsByLength[shipToCheck.length][i];
            let selectedPossibilitySet: {horizontal: boolean, vertical:boolean} = shipToCheck.possibilities[currentPlacement.position.row][currentPlacement.position.col];
            
            //if invalid
            if(!((selectedPossibilitySet.horizontal && currentPlacement.orientation == Direction.Horizontal)
            || (selectedPossibilitySet.vertical && currentPlacement.orientation == Direction.Vertical))){
                this.validPlacementsByLength[shipToCheck.length].splice(i);
            }
        }
        if(remakeList){
            this.generateSingleValidPlacementsList();
        }
    }

    private generateSingleValidPlacementsList(){
        let ans: Array<ShipPlacement> = [];
        for(var key in this.validPlacementsByLength){
            for(var i=0; i<this.validPlacementsByLength[key].length; i++){
                ans.push(this.validPlacementsByLength[key][i]);
            }
        }
    }

    public updateRemainingShips(numberRemaining: {[length:number]:number}):void{
        let updateNeeded:boolean = false;
        for(var key in numberRemaining){
            if(numberRemaining[key]==0 &&this.validPlacementsByLength[key].length >0){
                this.validPlacementsByLength[key] = [];
                updateNeeded = true;
            }
        }
        if(updateNeeded){
            this.generateSingleValidPlacementsList();
        }
    }

    public pickRandomPlacement ():ShipPlacement{
        return this.allValidPlacements[randBetween(0,this.allValidPlacements.length-1)];
    }
}