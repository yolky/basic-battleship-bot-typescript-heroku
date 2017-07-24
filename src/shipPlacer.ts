import {ShipPossibilities} from './shipPossibilities'
import {ShotImpliedPlacements} from './shotImpliedPlacements'
import * as Globals from './constants'
import {ShipPlacement} from './shipPlacement'
import {Position} from './position'
import {Direction} from './direction'

export class ShipPlacer{
    private weightsByLength: {[length:number]: Array<Array<Array<{horizontal: number, vertical: number}>>>} = {};
    private shipPossibilitiesByLength: {[length:number]: ShipPossibilities} = {};
    public shipLengths: Array<number> = [];
    public numberOfShipsOfLength: {[length: number]: number} = {};

    public constructor(shipLengths:Array<number>){
        this.shipLengths = shipLengths;

        for(var i=0; i<this.shipLengths.length; i++){
            this.shipPossibilitiesByLength[this.shipLengths[i]] = new ShipPossibilities(this.shipLengths[i]);
            if(!this.numberOfShipsOfLength[shipLengths[i]]){
                this.numberOfShipsOfLength[shipLengths[i]] = 1;
            }else{
                this.numberOfShipsOfLength[shipLengths[i]]++;
            }
        }

        for(var key in this.numberOfShipsOfLength){
            for(var i=0; i<this.numberOfShipsOfLength[key]; i++){
                if(!this.weightsByLength[key]){
                    this.weightsByLength[key] = [];
                }

                this.weightsByLength[key].push([]);
                for(var row=0; row<Globals.BOARD_ROWS; row++){
                    this.weightsByLength[key][i].push([]);
                    for(var col=0; col<Globals.BOARD_ROWS; col++){
                        this.weightsByLength[key][i][row].push({horizontal:0, vertical: 0});
                    }
                }
            }
            
        }
        

        this.setInvalidPositionsToNegInf();
        
    }

    private setInvalidPositionsToNegInf():void{
        for(var key in this.shipPossibilitiesByLength){
            for(var row=0; row<Globals.BOARD_ROWS; row++){
                for(var col=0; col<Globals.BOARD_ROWS; col++){
                    if(!this.shipPossibilitiesByLength[key].possibilities[row].row[col].horizontal){
                        for(var i=0; i<this.weightsByLength[key].length; i++){
                            this.weightsByLength[key][i][row][col].horizontal = Number.NEGATIVE_INFINITY;
                        }
                    }
                    if(!this.shipPossibilitiesByLength[key].possibilities[row].row[col].vertical){
                        for(var i=0; i<this.weightsByLength[key].length; i++){
                            this.weightsByLength[key][i][row][col].vertical = Number.NEGATIVE_INFINITY;
                        }
                    }
                }
            }
        }
    }

    public penalizePosition(){}

    public chooseConfiguration():Array<ShipPlacement>{

        let shipPlacements: Array<ShipPlacement> = [];

        for(var key in this.numberOfShipsOfLength){
            for(var i=0; i< this.numberOfShipsOfLength[key]; i++){
                let maxProbability = Number.NEGATIVE_INFINITY;
                let maxPosition = new Position(0,0);
                let maxOrientation = Direction.Horizontal;

                for(var row=0; row<Globals.BOARD_ROWS; row++){
                    for(var col=0; col<Globals.BOARD_ROWS; col++){

                        if(this.weightsByLength[key][i][row][col].horizontal> maxProbability){
                            maxProbability = this.weightsByLength[key][i][row][col].horizontal;
                            maxPosition = new Position(row,col);
                            maxOrientation = Direction.Horizontal;
                        }
                        if(this.weightsByLength[key][i][row][col].vertical> maxProbability){
                            maxProbability = this.weightsByLength[key][i][row][col].vertical;
                            maxPosition = new Position(row,col);
                            maxOrientation = Direction.Vertical;
                        }
                    }
                }

                let nextShip = new ShipPlacement(maxOrientation, Number(key), maxPosition);
                shipPlacements.push(nextShip);
                for(var removalLength in this.shipPossibilitiesByLength){
                    this.shipPossibilitiesByLength[removalLength].removePossibilities(nextShip);
                }
                this.setInvalidPositionsToNegInf();
            }
        }

        

        return shipPlacements;
    }
}