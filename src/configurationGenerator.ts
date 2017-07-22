import * as Globals from './constants'
import {Shot} from './shot'
import {BoardState} from './boardState'
import {Position} from './position'

export class ConfigurationGenerator{
    public boardCounter: Array<Array<number>>;

    public lastNum=0;

    public constructor(){
        this.boardCounter = [];
        for(var i=0;i <Globals.BOARD_ROWS; i++){
            this.boardCounter.push([])
            for(var j = 0; j<Globals.BOARD_COLS; j++){
                this.boardCounter[i].push(0);
            }
        }        
    }

    public generateConfiguration(lengths:Array<number>, shots: Array<Shot> = [], hitShots:Array<Shot> = []):void{
        let compatible: boolean = false;
        let boardToAdd: Array<Array<boolean>>;
        while(!compatible){
            boardToAdd = BoardState.getRandomBoardArray(lengths, shots);
            compatible = true;
            for(var i =0; i<hitShots.length; i++){
                //console.log(lengths);
                //console.log(hitShots[i].Position.row + ','+hitShots[i].Position.col);
                if(!boardToAdd[hitShots[i].Position.row][hitShots[i].Position.col]){
                    compatible = false;
                    break;
                }
            }
        }
        
        for(var i=0;i <Globals.BOARD_ROWS; i++){
            for(var j = 0; j<Globals.BOARD_COLS; j++){
                if(boardToAdd[i][j]){
                    this.boardCounter[i][j]++;
                }
            }
        }      
    }

    public generateConfigurations(num:number, lengths:Array<number>, shots: Array<Shot> = []){
        let hitShots: Array<Shot> = [];
        for(var i=0; i<shots.length; i++){
            if(shots[i].WasHit){
                hitShots.push(shots[i]);
            }
        }
        for(var i=0;i<num;i++){

            this.generateConfiguration(lengths, shots, hitShots);
        }
        this.lastNum = num;
    }

    public getMaxPosition():Position{
        let currentMax:number = 0;
        let currentRow:number = 0;
        let currentCol:number = 0;
        for(var i=0;i <Globals.BOARD_ROWS; i++){
            for(var j = 0; j<Globals.BOARD_COLS; j++){
                if(this.boardCounter[i][j]>currentMax && this.boardCounter[i][j] != this.lastNum){
                    currentMax = this.boardCounter[i][j];
                    currentRow = i;
                    currentCol = j;
                }
            }
        }
        return new Position(currentRow, currentCol);
    }
}