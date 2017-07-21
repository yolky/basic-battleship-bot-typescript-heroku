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
}