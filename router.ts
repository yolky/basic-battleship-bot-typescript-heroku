import * as express from 'express';
import * as bodyParser from 'body-parser';
import {MyBot} from './src/my-bot';
import {Position} from './src/position'
import {Direction} from './src/direction';
import {ShipPlacement} from './src/shipConfiguration';
import {ShipPossibilities} from './src/shipPossibilities';
import {BoardState} from './src/boardState';
import {ConfigurationGenerator} from './src/configurationGenerator';
import {Shot} from './src/shot'

export class Router {
    public static route(): void {
        let app = express();
        let myBot = new MyBot();

        app.set('port', (process.env.PORT || 5000));
        app.use(express.static(__dirname + '/public'));
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());

        console.log('hasdf');

        app.get('/GetShipPositions', (req, res) => {
            console.log(req.url);
            let positions = myBot.getShipPositions();
            res.send(positions);
        });

        app.post('/SelectTarget', (req, res) => {
            console.log(req.url);
            let target = myBot.selectTarget(req.body);
            console.log(target);
            res.send(target);
        });

        app.listen(app.get('port'), () => {
            console.log("Node app is running at localhost:" + app.get('port'));
        });
        /*let test = new ShipPossibilities(4);

        test.showPossibilities();

        let testBlock: ShipPlacement = new ShipPlacement(Direction.Horizontal,5,new Position(3,3));

        test.removePosibilities(testBlock);

        test.showPossibilities();*/
        
        // let testGen: ConfigurationGenerator = new ConfigurationGenerator();

        // let shots: Array<Shot> = [{Position: new Position(4,4), WasHit: false}];

        // testGen.generateConfigurations(10000,[5,4,3,3,2],shots);
        // console.log(testGen.boardCounter);


    }
}

Router.route();