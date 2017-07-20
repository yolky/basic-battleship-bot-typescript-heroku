export class MyBot {
    static letters:string = 'ABCDEFGHIJ';

    public getShipPositions() {
        return [
            { StartingSquare: { Row: "A", Column: 1 }, EndingSquare : { Row: "A", Column: 5 } },
            { StartingSquare: { Row: "C", Column: 1 }, EndingSquare : { Row: "C", Column: 4 } },
            { StartingSquare: { Row: "E", Column: 1 }, EndingSquare : { Row: "E", Column: 3 } },
            { StartingSquare: { Row: "G", Column: 1 }, EndingSquare : { Row: "G", Column: 3 } },
            { StartingSquare: { Row: "I", Column: 1 }, EndingSquare : { Row: "I", Column: 2 } },
        ]
    }

    public selectTarget(gamestate) {
        return this.getRandomTarget(gamestate);
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
        let prevMoves: Array<any> = Object.keys(gamestate.MyShots)['Position'];
        let randPosition: {Row:string, Column:number};
        do{
            let randomRow: string = MyBot.letters[MyBot.randIntBetween(1,10)];
            let randomCol: number = MyBot.randIntBetween(0,9);
            randPosition = {Row: randomRow, Column: randomCol};
        }while(MyBot.containsObject(prevMoves, randPosition))

        return randPosition;
    }

    private static containsObject(list:Array<object>, object:Object):boolean{
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

    private static randIntBetween(low:number, high:number):number{
        return (Math.floor(Math.random()*(high-low+1)))+low;
    }
}

