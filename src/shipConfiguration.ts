import {Direction} from './direction'
import {Position} from './position'

export class ShipPlacement{
    public orientation: Direction;
    public length: number;
    public position: Position;

    public constructor(orientation:Direction, length: number, position: Position){
        this.orientation = orientation;
        this.length = length;
        this.position = position;
    }

    public toJSON(){
        let end:Position = new Position(this.orientation==Direction.Vertical?
        this.position.row+this.length:this.position.row,
        this.orientation==Direction.Horizontal?
        this.position.col+this.length:this.position.col);
        return {StartingSquare: this.position, EndingSquare: end};
    }
    
    public getOccupiedPositions():Array<Position>{
        let ans:Array<Position> = [];
        if(this.orientation == Direction.Horizontal){
            //iterate across columns
            for(var i =0 ; i<this.length; i++){
                ans.push(new Position(this.position.row,this.position.col + i));
            }
        }
        else if(this.orientation == Direction.Vertical){
            //iterate across columns
            for(var i =0 ; i<this.length; i++){
                ans.push(new Position(this.position.row + i,this.position.col));
            }
        }
        return ans;
    }
}