export class Position{
    public Row: string;
    public Column: number;

    public constructor(r:number, c:number){
        this.Row = this.toLetter(r);
        this.Column = c+1;
    }

    private toLetter(n:number):string   {
        return 'ABCEDFEGHIJ'[n];
    }
    
}