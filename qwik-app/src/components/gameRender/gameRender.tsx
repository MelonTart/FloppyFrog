import { component$, useStylesScoped$,useTask$ , useStore,useOn,$,useBrowserVisibleTask$} from '@builder.io/qwik';
import { FrogLogo } from '../icons/floppyfrog';


export function ResetBoard(store){
  store.won = 0;
  store.lost=0;
  store.moves=3;
  store.letters.fill(0);
  store.letters[27] = 2;

  console.log("setting random places");
    for(let randNum = 0;randNum<=12; randNum++){
      let GeneratedIndex = Math.floor(Math.random() * 55);
      if(store.letters[GeneratedIndex] != 0){
        randNum--;
        continue;
      }
      store.letters[GeneratedIndex] = 1;
    };
}

export function drawHexagon(x,y,size,ctx,State){
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

export function drawGrid(width, height,size,ctx,store) {
  const a = 2 * Math.PI / 6;
  let r = size;
  for (let y = 0; y  < height; y +=1) {
    for (let x = 0, j = 1; x  < width; x +=1) {
      let xLocation = (size *  Math.sin(a))*x*2 + (y%2 *(size *  Math.sin(a)));
      let yLocation = (size* (1+Math.cos(a)))*y ;
      drawHexagon(xLocation+size,yLocation+size,size,ctx,store.letters[x+y*5]);
    }
  }
}

export function AdjacentSquares(n){
let ResultSet = new Set();
  ResultSet.add(Math.min(n+1,54));
  ResultSet.add(Math.max(n-1,0));

if (Math.floor(n/5) % 2 == 1){
  ResultSet.add(Math.max(n-4,0));
  ResultSet.add(Math.max(n-5,0));
  ResultSet.add(Math.min(n+5,54));
  ResultSet.add(Math.min(n+6,54));
}else{
  ResultSet.add(Math.max(n-5,0));
  ResultSet.add(Math.max(n-6,0));
  ResultSet.add(Math.min(n+4,54));
  ResultSet.add(Math.min(n+5,54));
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
 for (let n = 0; n  < 55; n +=1) {
      if ((n%5 ==0 || n%5 ==4 || Math.floor(n/5) == 0 || Math.floor(n/5) == 10) && State.letters[n] == 0){
        OpenClass.add(n);
      }
      if(State.letters[n] != 0){
        ClosedClass.add(n);
      }
 }
 let Distance = 1;
while(OpenClass.size !=0){
  let ToAdd = new Set();
  OpenClass.forEach((value) => {
    ToAdd=union(ToAdd,AdjacentSquares(value));
    ClosedClass.forEach((value2) => {
      ToAdd.delete(value2)
    });
    DistMap[(value) as number] = Math.min(Distance,DistMap[(value) as number]);
    ClosedClass.add(value);
    OpenClass.delete(value);
  });
  OpenClass = union(OpenClass,ToAdd);
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
export default component$(() => {

  const store = useStore(
    {
      letters: new Array(55).fill(0),
      moves:3,
      won:0,
      lost:0,
      mousex:0,
      mousey:0,
    },
    { deep: true }
  );

  

  useOn(
    'click',
    $((ev) => {
      let event = ev ! as PointerEvent;
      let size = 50;
      const a = 2 * Math.PI / 6;
      let minx = 0,miny=0, minDist = 100000,mindistx=1000,mindisty=1000;
      for(let x =0 ;x<5;x++){
        for(let y =0 ;y<11;y++){
          let xLocation = (size *  Math.sin(a))*x*2 + (y%2 *(size *  Math.sin(a))) +size;
          let yLocation = (size* (1+Math.cos(a)))*y +size;
          let distance = Math.sqrt((xLocation - event.offsetX)**2 + (yLocation - event.offsetY)**2);
          if (distance < minDist){
            mindistx = (xLocation - event.offsetX);
            mindisty = (yLocation - event.offsetY);
            minDist = distance;
            minx = x;
            miny = y;
          }
      }
    }
    if (minDist<((size*Math.sin(a)))){
          if(store.letters[minx+(miny*5)]==0 && store.moves != 0){
              store.letters[minx+(miny*5)] = 1;
              store.moves -=1;
          } 
    }

    //check for win
    let DMap = DistanceMap(store);
    let CurrLocation = store.letters.indexOf(2);
    let NextToPig = AdjacentSquares(CurrLocation);
    let minDist2 = 99;
    NextToPig.forEach((value) => {
      if (DMap[value! as number]<minDist2){
        minDist2 = DMap[value! as number];
      }
    });
    if(minDist2>=99){
      console.log("Game won!");
      store.won = 1;
      ResetBoard(store);
      return;
    }

    //do pig logic
    if( store.moves ==0 && store.lost != 1)
    {
      let DMap = DistanceMap(store);
      let CurrLocation = store.letters.indexOf(2);
      let NextToPig = AdjacentSquares(CurrLocation);
      let minDist2 = 99;
      NextToPig.forEach((value) => {
        if (DMap[value! as number]<minDist2){
          minDist2 = DMap[value! as number];
        }
      });
      NextToPig.forEach((value) => {
        if (DMap[value! as number]>minDist2){
          NextToPig.delete(value);
        }
      });
      if(minDist2>=99){
        console.log("Game won!");
        store.won = 1;
        ResetBoard(store);
      }else{
      const NewSpace = getRandomKey(NextToPig)! as number;
      store.letters[CurrLocation ! as number] = 0;
      store.letters[NewSpace] = 2;
      if(NewSpace % 5 ==0 ||NewSpace % 5 ==4  || Math.floor(NewSpace / 5) ==0  || Math.floor(NewSpace / 5) ==10 ){
        store.lost = 1;
        console.log("Game Lost!");
        ResetBoard(store);
      }else{
        store.moves+=1;
      }
      
      }


    }



    //let canvas = event.target;
    //var ctx = canvas.getContext("2d");
    //drawGrid(5,11,50,ctx,store);

  })
  );

  useBrowserVisibleTask$(({ track }) => {
    //updatesgame display when state changed and when visable
    track(() => store.letters[1]);
    const canvas = document.getElementById('GameBoard-Main') ! as HTMLElement;
    var ctx = canvas.getContext("2d");
    drawGrid(5,11,500,ctx,store);
    let size = 500;
    const a = 2 * Math.PI / 6;
    let DMap = DistanceMap(store);
    for(let m = 0;m<55;m++){ 
      let x = m%5;
      let y = Math.floor(m/5);
      let xLocation = (size *  Math.sin(a))*x*2 + (y%2 *(size *  Math.sin(a))) +size;
      let yLocation = (size* (1+Math.cos(a)))*y +size;
      ctx.font = "480px serif";
      ctx.fillStyle = "white";
      if(DMap[x+(y*5)]!= 100){
        ctx.fillText(DMap[x+(y*5)], xLocation-(size/4), yLocation+(size/4));

      }
      
    }
    canvas.style.width = "500px";
    canvas.style.height = "950px";
    // will run when the component becomes visible and every time "store.count" changes
  });





  useTask$(({ track }) => {
    //inital setting of board
    ResetBoard(store);
  });

  return (
    <>
    <canvas id="GameBoard-Main" width= "5000px" height="9500px">    
    </canvas>
    <div>This is the Game render, {store.moves} Moves, {store.mousex},{store.mousey}</div> 
    <button onClick$={() => {

ResetBoard(store);


    }}>Reset!</button>
      </>
  );
});