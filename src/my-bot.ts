import {Position} from './position';
import {randBetween} from './random';
import {BoardState} from './boardState';
import {ConfigurationGenerator} from './configurationGenerator';
import {Shot} from './shot';
import {ShipPlacer} from './shipPlacer';

export class MyBot {
    static letters:string = 'ABCDEFGHIJ';
    static shipPlacer = new ShipPlacer([5,4,3,3,2]);

    public getShipPositions() {
        // return [
        //     { StartingSquare: { Row: "A", Column: 1 }, EndingSquare : { Row: "A", Column: 5 } },
        //     { StartingSquare: { Row: "C", Column: 1 }, EndingSquare : { Row: "C", Column: 4 } },
        //     { StartingSquare: { Row: "E", Column: 1 }, EndingSquare : { Row: "E", Column: 3 } },
        //     { StartingSquare: { Row: "G", Column: 1 }, EndingSquare : { Row: "G", Column: 3 } },
        //     { StartingSquare: { Row: "I", Column: 1 }, EndingSquare : { Row: "I", Column: 2 } },
        // ]
        //return BoardState.getRandomStartingConfiguration([5,4,3,3,2]);
        return MyBot.shipPlacer.chooseConfiguration();
    }

    public selectTarget(gamestate) {
        let generator = new ConfigurationGenerator();
        let shotList: Array<Shot>;
        if(!gamestate.MyShots){
            shotList = [];
        }else{
            shotList = gamestate.MyShots.map((x)=> {
                return {Position: Position.letterFormatToPosition(x.Position.Row, x.Position.Column), WasHit: x.WasHit};
            });
        }
        
        generator.generateConfigurations(80,[5,4,3,3,2], shotList);
        console.log(JSON.stringify(gamestate));

        let opponentShots: Array<Shot>;

        if(!gamestate.OpponentsShots){
            opponentShots = [];
        }else{
            opponentShots = gamestate.OpponentsShots.map((x)=> {
                return {Position: Position.letterFormatToPosition(x.Position.Row, x.Position.Column), WasHit: false};
            });
        }

        if((opponentShots.length == 1|| opponentShots.length == 0)&&gamestate.GameCount == 1){
            MyBot.shipPlacer = new ShipPlacer([5,4,3,3,2]);
        }

        if(opponentShots.length>0){
            MyBot.shipPlacer.penalizePosition(opponentShots[opponentShots.length-1].Position, opponentShots.length);
        }
        

        return generator.getMaxPosition();

        
        //return this.getRandomTarget(gamestate);
        // var previousShot = gamestate.MyShots && gamestate.MyShots[gamestate.MyShots.length-1];
        // if(previousShot) {
        //     console.log(gamestate);
        //     return this.getNextTarget(previousShot.Position);
            
        // }
        
        // return { Row: "A", Column: 1 };  
    }

    private getNextTarget(position) {
        var column = this.getNextColumn(position.Column);
        var row = column === 1 ? this.getNextRow(position.Row) : position.Row;
        return { Row: row, Column: column }
    }

    private getNextRow(row) {
        var newRow = row.charCodeAt(0) + 1;
        if(newRow > 'J'.charCodeAt(0)) {
            return 'A';
        }
        return String.fromCharCode(newRow);
    }

    private getRandomTarget(gamestate){
        let prevMoves: Array<any> = gamestate.MyShots.map((x) => {return x.Position});
        let randPosition: Position;
        do{
            randPosition = new Position(randBetween(0,9),randBetween(0,9));
        }while(MyBot.containsObject(prevMoves, randPosition))


        return randPosition;
    }

    private static containsObject(list:Array<object>, object:Object):boolean{
        if(!list){
            return false;
        }
        for(var i=0; i<list.length; i++){
            if(list[i]==object){
                return true;
            }
        }
        return false;
    }

    private getNextColumn(column) {
        return column % 10 + 1;
    }
}

