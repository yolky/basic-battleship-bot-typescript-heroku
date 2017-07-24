export class Position{
    public rowChar: string;
    public row: number;
    public col: number;

    public constructor(r:number, c:number){
        this.rowChar = this.toLetter(r);
        this.row = r;
        this.col = c;
    }

    private toLetter(n:number):string   {
        return 'ABCDEFGHIJ'[n];
    }

    private toJSON(){
        return {Row:this.rowChar, Column: this.col+1};
    }

    public static letterFormatToPosition(char: string, _col: number){
        return new Position(char.charCodeAt(0) - 65, _col-1);
    }

    public deepClone():Position{
        return new Position(this.row, this.col);
    }

    static isEqual(a: Position, b:Position):boolean{
        return (a.row == b.row) && (a.col == b.col);
    }
}