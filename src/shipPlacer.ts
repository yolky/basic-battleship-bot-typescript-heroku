import {ShipPossibilities} from './shipPossibilities'
import {ShotImpliedPlacements} from './shotImpliedPlacements'
import * as Globals from './constants'
import {ShipPlacement} from './shipPlacement'
import {Position} from './position'
import {Direction} from './direction'
import {Shot} from './shot'

export class ShipPlacer{
    private currentWeightsByLength: {[length:number]: Array<Array<Array<{horizontal: number, vertical: number}>>>} = {};
    private dynamicWeightsByLength: {[length:number]: Array<Array<{horizontal: number, vertical: number}>>} = {};
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

        this.zeroWeights();
        
        this.initializeDynamicWeights();

        this.setInvalidPositionsToNegInf();

        this.addDynamicWeights()
        
    }

    private zeroWeights(){
        this.currentWeightsByLength = {};
        for(var key in this.numberOfShipsOfLength){
            for(var i=0; i<this.numberOfShipsOfLength[key]; i++){
                if(!this.currentWeightsByLength[key]){
                    this.currentWeightsByLength[key] = [];
                }

                this.currentWeightsByLength[key].push([]);
                for(var row=0; row<Globals.BOARD_ROWS; row++){
                    this.currentWeightsByLength[key][i].push([]);
                    for(var col=0; col<Globals.BOARD_ROWS; col++){
                        this.currentWeightsByLength[key][i][row].push({horizontal:0, vertical: 0});
                    }
                }
            }
        }
    }

    private initializeDynamicWeights(){
        for(var key in this.numberOfShipsOfLength){
            if(!this.dynamicWeightsByLength[key]){
                this.dynamicWeightsByLength[key] = [];
            }
            for(var row=0; row<Globals.BOARD_ROWS; row++){
                this.dynamicWeightsByLength[key].push([]);
                for(var col=0; col<Globals.BOARD_ROWS; col++){
                    this.dynamicWeightsByLength[key][row].push({horizontal: 0, vertical: 0});
                }
            }
        }
    }

    private addDynamicWeights(){
        for(var key in this.numberOfShipsOfLength){
            for(var i=0; i<this.numberOfShipsOfLength[key]; i++){
                for(var row=0; row<Globals.BOARD_ROWS; row++){
                    for(var col=0; col<Globals.BOARD_ROWS; col++){
                        this.currentWeightsByLength[key][i][row][col].horizontal += this.dynamicWeightsByLength[key][row][col].horizontal;
                        this.currentWeightsByLength[key][i][row][col].vertical += this.dynamicWeightsByLength[key][row][col].vertical;
                    }
                }
            }
        }
    }

    private setInvalidPositionsToNegInf():void{
        for(var key in this.shipPossibilitiesByLength){
            for(var row=0; row<Globals.BOARD_ROWS; row++){
                for(var col=0; col<Globals.BOARD_ROWS; col++){
                    if(!this.shipPossibilitiesByLength[key].possibilities[row].row[col].horizontal){
                        for(var i=0; i<this.currentWeightsByLength[key].length; i++){
                            this.currentWeightsByLength[key][i][row][col].horizontal = Number.NEGATIVE_INFINITY;
                        }
                    }
                    if(!this.shipPossibilitiesByLength[key].possibilities[row].row[col].vertical){
                        for(var i=0; i<this.currentWeightsByLength[key].length; i++){
                            this.currentWeightsByLength[key][i][row][col].vertical = Number.NEGATIVE_INFINITY;
                        }
                    }
                }
            }
        }
    }

    public penalizePosition(position: Position, turn: number){
        for(var length in ShotImpliedPlacements.initialShotImpliedPlacements){
            let ShipPlacementsToPenalize: Array<ShipPlacement> = ShotImpliedPlacements.initialShotImpliedPlacements[length][position.row][position.col];
            for(var i=0; i< ShipPlacementsToPenalize.length; i++){
                if(ShipPlacementsToPenalize[i].orientation == Direction.Horizontal){
                    this.dynamicWeightsByLength[length][ShipPlacementsToPenalize[i].position.row][ShipPlacementsToPenalize[i].position.col].horizontal -= (1/(turn+5));
                }
                if(ShipPlacementsToPenalize[i].orientation == Direction.Vertical){
                    this.dynamicWeightsByLength[length][ShipPlacementsToPenalize[i].position.row][ShipPlacementsToPenalize[i].position.col].vertical -= (1/(turn+5));
                }
            }
        }
    }

    public chooseConfiguration():Array<ShipPlacement>{

        this.zeroWeights();

        this.setInvalidPositionsToNegInf();

        this.addDynamicWeights()

        let shipPlacements: Array<ShipPlacement> = [];

        for(var key in this.numberOfShipsOfLength){
            for(var i=0; i< this.numberOfShipsOfLength[key]; i++){
                let maxProbability = Number.NEGATIVE_INFINITY;
                let maxPosition = new Position(0,0);
                let maxOrientation = Direction.Horizontal;

                for(var row=0; row<Globals.BOARD_ROWS; row++){
                    for(var col=0; col<Globals.BOARD_ROWS; col++){

                        if(this.currentWeightsByLength[key][i][row][col].horizontal> maxProbability){
                            maxProbability = this.currentWeightsByLength[key][i][row][col].horizontal;
                            maxPosition = new Position(row,col);
                            maxOrientation = Direction.Horizontal;
                        }
                        if(this.currentWeightsByLength[key][i][row][col].vertical> maxProbability){
                            maxProbability = this.currentWeightsByLength[key][i][row][col].vertical;
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