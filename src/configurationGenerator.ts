import * as Globals from './constants'
import {Shot} from './shot'
import {BoardState} from './boardState'
import {Position} from './position'
import {ShipPlacement} from './shipPlacement'

export class ConfigurationGenerator{
    public boardCounter: Array<Array<number>>;
    public squaresHit: Array<Array<boolean>>;

    private nextPath: number[] = [];
    private exhaustive: boolean = false;

    public constructor(){
        this.boardCounter = [];
        this.squaresHit = [];
        for(var i=0;i <Globals.BOARD_ROWS; i++){
            this.boardCounter.push([]);
            this.squaresHit.push([]);
            for(var j = 0; j<Globals.BOARD_COLS; j++){
                this.boardCounter[i].push(0);
                this.squaresHit[i].push(false);
            }
        }        
    }

    public generateConfiguration(lengths:Array<number>, shots: Array<Shot> = [], hitShots:Array<Shot> = []):void{
        let compatible: boolean = false;
        let boardToAdd: Array<Array<boolean>>;
       
        
        if(!this.exhaustive){
            let returnValue: {state:BoardState, doSwitch:boolean, nextPath: number[]}  = BoardState.getRandomSet(lengths,shots,hitShots);
            if(returnValue.doSwitch){
                this.exhaustive = true;
                this.nextPath = returnValue.nextPath;
            }else{
                this.addShipsToGrid(returnValue.state.ships);
            }
        }else{

            

            let returnValue: {state:BoardState, found:boolean, nextPath: number[]};
            returnValue = BoardState.tryGetRandomSet(lengths,shots,hitShots,this.nextPath,true);
            this.nextPath = returnValue.nextPath;
            if(returnValue.found){
                this.addShipsToGrid(returnValue.state.ships);
            }
        }
        
    }

    public addShipsToGrid(ships: Array<ShipPlacement>){
        for(var i=0; i<ships.length; i++){
            
            let squaresToAdd: Array<Position> = ships[i].getOccupiedPositions();
            for(var j=0;j<squaresToAdd.length; j++){
                this.boardCounter[squaresToAdd[j].row][squaresToAdd[j].col]++;
            }
        }
    }


    public generateConfigurations(num:number, lengths:Array<number>, shots: Array<Shot> = []){
        let hitShots: Array<Shot> = [];
        for(var i=0; i<shots.length; i++){
            this.squaresHit[shots[i].Position.row][shots[i].Position.col] = true;
            if(shots[i].WasHit){
                hitShots.push(shots[i]);
            }
        }


        for(var i=0;i<num;i++){
            
            this.generateConfiguration(lengths, shots, hitShots);
        }

       
    }

    public getMaxPosition():Position{
        let currentMax:number = 0;
        let currentRow:number = 0;
        let currentCol:number = 0;
        for(var i=0;i <Globals.BOARD_ROWS; i++){
            for(var j = 0; j<Globals.BOARD_COLS; j++){
                if(this.boardCounter[i][j]>currentMax && !this.squaresHit[i][j]){
                    currentMax = this.boardCounter[i][j];
                    currentRow = i;
                    currentCol = j;
                }
            }
        }
        console.log(this.boardCounter);
        return new Position(currentRow, currentCol);
    }
}