import { component$,noSerialize , useStylesScoped$,useTask$ , useStore,useOn,$,useBrowserVisibleTask$} from '@builder.io/qwik';
import { Socket } from 'dgram';
import { FrogLogo } from '../icons/floppyfrog';

interface GameProps {
  id: string;
  size: number;
  userid: number;
  gameID:number;
  MYUSERID:number;
}
interface GameData {
  letters: Array<number>,
  moves: number,
  won: number,
  lost: number,
  MYUSERID:number,
  gameID:number,
  mousex: number,
  mousey: number,
  started: number,
  gamestate: number,
  game_started_at: null | string,
  game_ended_at: null | string,
  socket:object,
  scale:number,


}

export function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export function ResetBoard(store){

  store.gamestate = 0;
  store.game_started_at = null;
  store.game_ended_at = null;
  store.won = 0;
  store.lost = 0;
  var NewBoard = new Array(55).fill(0);
  NewBoard[27] = 2;

  console.log("setting random places");
    for(let randNum = 0; randNum <= 12; randNum++){
      let GeneratedIndex = Math.floor(Math.random() * 55);
      if(NewBoard[GeneratedIndex] != 0){
        randNum--;
        continue;
      }
      NewBoard[GeneratedIndex] = 1;
    };
    store.moves = 3;
    store.letters = NewBoard;
}

export function drawHexagon(x, y, size, ctx, State){   
  ctx.lineWidth = 10;
  const a = 2 * Math.PI / 6;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    ctx.lineTo(x + size * Math.sin(a * i), y + size * Math.cos(a * i));
  }
  ctx.closePath();
  if(State == 0) {
    ctx.fillStyle = "green";
    ctx.fill();
  }
  if(State == 1) {
    ctx.fillStyle = "blue";
    ctx.fill();
  }
  if(State == 2) {
    ctx.fillStyle = "lime";
    ctx.fill();
  }
  ctx.stroke();
}

export function drawGrid(width, height, size, ctx, store) {
  const a = 2 * Math.PI / 6;
  let r = size;
  for (let y = 0; y  < height; y += 1) {
    for (let x = 0, j = 1; x  < width; x +=1) {
      let xLocation = (size * Math.sin(a)) * x * 2 + (y % 2 *(size *  Math.sin(a)));
      let yLocation = (size * (1 + Math.cos(a))) * y ;
      drawHexagon(xLocation + size, yLocation + size, size, ctx, store.letters[x + (y * 5)]);
    }
  }
}

export function AdjacentSquares(n){
  let ResultSet = new Set();
    ResultSet.add(Math.min(n + 1, 54));
    ResultSet.add(Math.max(n - 1, 0));

  if (Math.floor(n / 5) % 2 == 1){
    ResultSet.add(Math.max(n - 4, 0));
    ResultSet.add(Math.max(n - 5, 0));
    ResultSet.add(Math.min(n + 5, 54));
    ResultSet.add(Math.min(n + 6, 54));
  }else{
    ResultSet.add(Math.max(n - 5, 0));
    ResultSet.add(Math.max(n - 6, 0));
    ResultSet.add(Math.min(n + 4, 54));
    ResultSet.add(Math.min(n + 5, 54));
  }
  return ResultSet;
}

function union(setA, setB) {
  const _union = new Set(setA);
  for (const elem of setB) {
    _union.add(elem);
  }
  return _union;
}

export function DistanceMap(State){
  const DistMap = new Array(55).fill(100);
  let OpenClass = new Set();
  let ClosedClass = new Set();
  for (let n = 0; n  < 55; n += 1) {
    if ((n % 5 == 0 || n % 5 == 4 || Math.floor(n / 5) == 0 || Math.floor(n / 5) == 10) && State.letters[n] == 0){
      OpenClass.add(n);
    }
    if(State.letters[n] != 0){
      ClosedClass.add(n);
    }
  }
  let Distance = 1;
    while(OpenClass.size != 0){
      let ToAdd = new Set();
      OpenClass.forEach((value) => {
        ToAdd = union(ToAdd,AdjacentSquares(value));
        ClosedClass.forEach((value2) => {
          ToAdd.delete(value2)
        });
        DistMap[(value) as number] = Math.min(Distance, DistMap[(value) as number]);
        ClosedClass.add(value);
        OpenClass.delete(value);
      });
      OpenClass = union(OpenClass, ToAdd);
      Distance++;
      if(Distance >= 30){
        break;
      }
    }
  return DistMap;
}

export function getRandomKey(collection) {
  let keys = Array.from(collection.keys());
  return keys[Math.floor(Math.random() * keys.length)];
}

export default component$((props: GameProps) => {
  const store = useStore<GameData>(
    {
      letters: new Array(55).fill(0),
      moves:3,
      won:0,
      lost:0,
      socket:null,
      gameID:props.gameID,
    },
    { deep: true }
  );

  useOn(
    'click',
    $((ev) => {
      if (props.userid != props.MYUSERID){
return;
      }
      console.log("clicked");
      if(store.gamestate == 0){
        store.gamestate = 1;
        store.game_started_at = new Date().toISOString();
        console.log('game started',store.game_started_at);
        return; // Click to begin game (first click no effect on board)
      }
      // Calculate selected hexagon
      let event = ev ! as PointerEvent;
      let size = props.size*store.scale;
      const a = 2 * Math.PI / 6;
      let minx = 0, miny = 0, minDist = 100000;
      for(let x = 0 ; x < 5; x++){
        for(let y = 0; y < 11; y++){
          let xLocation = (size *  Math.sin(a)) * x * 2 + (y % 2 *(size *  Math.sin(a))) + size;
          let yLocation = (size * (1 + Math.cos(a))) * y + size;
          let distance = Math.sqrt((xLocation - event.offsetX)**2 + (yLocation - event.offsetY)**2);
          if (distance < minDist){
            minDist = distance;
            minx = x;
            miny = y;
          }
        }
      }
      if (minDist < size){
        if(store.letters[minx + (miny * 5)] == 0 && store.moves != 0){
          store.letters[minx + (miny * 5)] = 1;
          store.moves -= 1;
        } 
      }

      // Check for win
      let DMap = DistanceMap(store);
      let CurrLocation = store.letters.indexOf(2);
      let NextToPig = AdjacentSquares(CurrLocation);
      let minDist2 = 99;
      NextToPig.forEach((value) => {
        if (DMap[value ! as number] < minDist2){
          minDist2 = DMap[value! as number];
        }
      });
      if(minDist2 >= 99){
        store.won = 1;
        store.game_ended_at = new Date().toISOString();
        console.log("game won",store.game_started_at,store.game_ended_at);
        ResetBoard(store);
        return;
      }

      // Pig Logic (moves the pig)
      if (store.moves == 0 && store.lost != 1) {
        let DMap = DistanceMap(store);
        let CurrLocation = store.letters.indexOf(2);
        let NextToPig = AdjacentSquares(CurrLocation);
        let minDist2 = 99;
        NextToPig.forEach((value) => {
          if (DMap[value! as number] < minDist2) {
            minDist2 = DMap[value! as number];
          }
        });
        NextToPig.forEach((value) => {
          if (DMap[value! as number] > minDist2) {
            NextToPig.delete(value);
          }
        });
        if(minDist2 >= 99){
          store.game_ended_at = new Date().toISOString();
          store.won = 1;
          console.log("game won",store.game_started_at,store.game_ended_at);
          ResetBoard(store);
        } else {
          const NewSpace = getRandomKey(NextToPig)! as number;
          store.letters[CurrLocation ! as number] = 0;
          store.letters[NewSpace] = 2;
          if(NewSpace % 5 == 0 || NewSpace % 5 == 4 || Math.floor(NewSpace / 5) == 0 || Math.floor(NewSpace / 5) == 10 ){
            store.lost = 1;
            store.game_ended_at = new Date().toISOString();
            console.log("game lost",store.game_started_at,store.game_ended_at);
            ResetBoard(store);
          } else {
            store.moves += 1;
          }
        }
      }
      //let canvas = event.target;
      //var ctx = canvas.getContext("2d");
      //drawGrid(5,11,50,ctx,store);
    })
  );
  
  useBrowserVisibleTask$(({ }) => {
    function handleResize() {
      console.log(Math.max((window.innerWidth/3),280) , Math.min(Math.max((window.innerWidth/3),280),450));
      store.scale = Math.min(Math.max((window.innerWidth/3),280),450)/ (9.8*props.size);
    }

    window.addEventListener('resize', handleResize);
    //SetUp WSS when it its visable on the screen
    console.log('game start');
    ResetBoard(store);

    var socket = new WebSocket('ws://10.0.0.164:8080');
    store.socket = noSerialize(socket);
    socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      if (data.type=="update"){

      
      var current = [... store.letters];
      console.log(data.data)
      console.log(data.data.gameID,props.gameID);
      if(!arraysEqual(data.data.letters,current) && props.userid == data.data.userId && props.gameID ==  data.data.gameID){
        console.log("updating game");
        store.letters = data.data.letters;
        store.moves = data.data.moves;
      }
    
    }
      //console.log(event.data.data.letters);
      //console.log(store.letters);
      //store.letters[1] = 1;
      // Update your Qwik component state or perform any other necessary action based on the received message
    });

    socket.addEventListener('open', (event) => {
      
      const message = {
        type: 'update',
        data: {
          userId: props.userid,
          letters: store.letters,
          moves:store.moves,
          gameID:props.gameID,
        }
      };
      
      store.socket.send(JSON.stringify(message));

    });
    
  });
  useBrowserVisibleTask$(({ track }) => {
    //props.size = 60;
    // Updates game display when state changed and when visable
    // Runs when the component is visible and when "store.count" changes
    
    track(() => store.letters[1]);
    track(() => store.scale);


    
    const canvas = document.getElementById(props.id) ! as HTMLElement;
    var ctx = canvas.getContext("2d");
    drawGrid(5, 11, props.size, ctx, store);

    if(store.socket!=null && store.socket.readyState == 1){
      const message = {
        type: 'update',
        data: {
          userId: props.userid,
          letters: store.letters,
          moves:store.moves,
          gameID:props.gameID,
        }
      };
      
      store.socket.send(JSON.stringify(message));
    }
    //const WebSocket = require('ws');

    console.log(window.innerWidth);
    var scale = Math.min(Math.max((window.innerWidth/3),280),450)/ (9.8*props.size);
    store.scale = scale;
    console.log(scale);
    canvas.style.width = scale*(9.8*props.size)+"px";
    canvas.style.height =scale*(17*props.size)+"px";



    //store.letters[1] = 1;



    // let size = 25;
    // const a = 2 * Math.PI / 6;
    // let DMap = DistanceMap(store);
    // for(let m = 0; m < 55; m++){ 
    //   let x = m % 5;
    //   let y = Math.floor(m / 5);
    //   let xLocation = (size *  Math.sin(a)) * x * 2 + (y % 2 * (size *  Math.sin(a))) + size;
    //   let yLocation = (size * (1 + Math.cos(a))) * y + size;
    //   ctx.font = "48px serif";
    //   ctx.fillStyle = "white";
      // Draw distance map (debug)
      // if(DMap[x + (y * 5)] != 100){
      //   ctx.fillText(DMap[x + (y * 5)], xLocation, yLocation);
      // }
    // }
  });


  

  return (
    <div id="gamebox">
      <canvas id={props.id} width={9.8*props.size} height={17*props.size}></canvas>
      <div>This is the Game render, {store.moves} Moves, GameID {props.gameID},UserGameIndex {props.userid}, my UserID{props.MYUSERID}</div> 
      {/* <button onClick$={() => {ResetBoard(store);}}>Reset!</button> */}
    </div>
  );
});