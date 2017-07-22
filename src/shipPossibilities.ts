import {Position} from './position';
import {Direction} from './direction';
import {ShipPlacement} from './shipPlacement'
import * as Globals from './constants';
import {randBetween} from './random';
import {Shot} from './shot'
import {BoardState} from './boardState';

export class ShipPossibilities{
    private length: number;
    private numberOfPossibilities:number;
    private possibilities: ConfigurationSet;
    private static initialPosAndNum: {[length: number]: {configs: ConfigurationSet, size: number}} = {};

    public constructor(length:number){
        this.length = length;
        let returnValue: {configs: ConfigurationSet, size:number}
        if(!ShipPossibilities.initialPosAndNum[this.length]){
            ShipPossibilities.initialPosAndNum[this.length] = ShipPossibilities.generateAllPossibilities(this.length); 
        }

        returnValue = ShipPossibilities.initialPosAndNum[this.length];
        
        this.numberOfPossibilities = returnValue.size;
        //deep cloning
        this.possibilities = JSON.parse(JSON.stringify(returnValue.configs));
        
    }

    public removePossibilities(shipConfiguration: ShipPlacement){
        let lengthRow:number = shipConfiguration.orientation == Direction.Vertical? shipConfiguration.length: 1;
        let lengthCol:number = shipConfiguration.orientation == Direction.Horizontal? shipConfiguration.length: 1;

        let startRow:number = Math.max(0,shipConfiguration.position.row-1);
        let endRow:number = Math.min(Globals.BOARD_ROWS-1, shipConfiguration.position.row + lengthRow);
        
        let startCol:number = Math.max(0,shipConfiguration.position.col-1);
        let endCol:number = Math.min(Globals.BOARD_COLS-1, shipConfiguration.position.col + lengthCol);

        this.removeVerticalPossibilities(startRow, endRow, startCol, endCol);
        this.removeHorizontalPossibilities(startRow, endRow, startCol, endCol);

    }

    public removeSquare(position: Position){
        this.removeVerticalPossibilities(position.row, position.row,position.col, position.col);
        this.removeHorizontalPossibilities(position.row, position.row,position.col, position.col);
    }

    public removeFromState(boardState: BoardState){
        for(var i=0; i<boardState.ships.length; i++){
            this.removePossibilities(boardState.ships[i])
        }
        this.removeFromShots(boardState.shots);
    }

    public removeFromShots(shots: Array<Shot>){
        for(var i=0; i<shots.length; i++){
            if(!shots[i].WasHit){
                this.removeSquare(shots[i].Position);
            }
        }
    }

    public showPossibilities(){
        console.log("horiz");
        for(var i=0;i <Globals.BOARD_ROWS; i++){
            let currentRow:string = '';
            for(var j = 0; j<Globals.BOARD_COLS; j++){
                if(this.possibilities[i].row[j].horizontal){
                    currentRow += 'X';
                }
                else{
                    currentRow += 'O';
                }
            }
            console.log(currentRow);
        }

        console.log("vertical:");

        for(var i=0;i <Globals.BOARD_ROWS; i++){
            let currentRow:string = '';
            for(var j = 0; j<Globals.BOARD_COLS; j++){
                if(this.possibilities[i].row[j].vertical){
                    currentRow += 'X';
                }
                else{
                    currentRow += 'O';
                }
            }
            console.log(currentRow);
        }
    }

    private removeVerticalPossibilities(_startRow:number, endRow:number, startCol:number, endCol:number){
        let startRow:number = Math.max(0,_startRow-(this.length-1));

        for(var i=startRow;i <=endRow; i++){
            for(var j = startCol; j<=endCol; j++){
                if(this.possibilities[i].row[j].vertical)
                {
                    this.possibilities[i].row[j].vertical = false;
                    this.possibilities[i].numInRow--;
                    this.numberOfPossibilities--;
                }
            }
        }
    }

    private removeHorizontalPossibilities(startRow:number, endRow:number, _startCol:number, endCol:number){
        let startCol:number = Math.max(0,_startCol-(this.length-1));

        for(var i=startRow;i <=endRow; i++){
            for(var j = startCol; j<=endCol; j++){
                if(this.possibilities[i].row[j].horizontal)
                {
                    this.possibilities[i].row[j].horizontal = false;
                    this.possibilities[i].numInRow--;
                    this.numberOfPossibilities--;
                }
            }
        }
    }


    static generateAllPossibilities(length:number):{configs: ConfigurationSet, size:number}{
        //initialize configSet
        let currentPossibilities: ConfigurationSet = [];
        for(var i=0; i<Globals.BOARD_ROWS; i++){
            currentPossibilities.push({row: [],numInRow:0});
            for(var j=0; j<Globals.BOARD_COLS; j++){
                currentPossibilities[i].row.push({horizontal: false,vertical: false});
            }
        }

        let count:number =0;

        for(var i=0; i<Globals.BOARD_ROWS-length+1; i++){  
            for(var j=0; j<Globals.BOARD_COLS; j++){
                currentPossibilities[i].row[j].vertical = true;
                currentPossibilities[i].numInRow++;
                count++;
            }
        }

        for(var i=0; i<Globals.BOARD_ROWS; i++){
            for(var j=0; j<Globals.BOARD_COLS-length+1; j++){
                currentPossibilities[i].row[j].horizontal = true;
                currentPossibilities[i].numInRow++;
                count++;
            }
        }
        return {configs: currentPossibilities,size: count};
    }

    public pickRandomPlacement(){
        //get random number up to possibility count
        //choose that one from the list
        //generate the thing
        let randIndex:number = randBetween(0,this.numberOfPossibilities-1);

        let currentIndex: number = -1; //increase this until >= rand
        let rowIndex: number = -1;
        do{
            rowIndex++;
            currentIndex += this.possibilities[rowIndex].numInRow;
        }while(currentIndex<randIndex);
        let indexInRow: number = (this.possibilities[rowIndex].numInRow-1)+randIndex - currentIndex;
        let currentIndexInRow:number = -1;
        for(var i=0; i<10; i++){
            if(this.possibilities[rowIndex].row[i].horizontal){
                currentIndexInRow++;
            }
            if(currentIndexInRow == indexInRow){
                return new ShipPlacement(Direction.Horizontal, this.length, new Position(rowIndex,i));
            }
            if(this.possibilities[rowIndex].row[i].vertical){
                currentIndexInRow++;
            }
            if(currentIndexInRow == indexInRow){
                return new ShipPlacement(Direction.Vertical, this.length, new Position(rowIndex,i));
            }
        }
        //then rowIndex is good
    }
}





type ConfigurationSet = Array<ConfigurationRow>;
type ConfigurationRow = {row: Array<{horizontal: boolean, vertical:boolean}>, numInRow: number};