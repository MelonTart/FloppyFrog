import { component$, useStylesScoped$,useTask$ , useStore,useOn,$,useBrowserVisibleTask$} from '@builder.io/qwik';
import { FrogLogo } from '../icons/floppyfrog';


export function drawHexagon(x,y,size,ctx,State){
        
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


export default component$(() => {

  const store = useStore(
    {
      letters: new Array(55).fill(0),
      moves:3,
    },
    { deep: true }
  );
  useOn(
    'click',
    $((ev) => {
      let event = ev ! as PointerEvent;
      let size = 50;
      const a = 2 * Math.PI / 6;
      let minx = 0,miny=0, minDist = 100000;
      for(let x =0 ;x<5;x++){
        for(let y =0 ;y<11;y++){
          let xLocation = (size *  Math.sin(a))*x*2 + (y%2 *(size *  Math.sin(a))) +size;
          let yLocation = (size* (1+Math.cos(a)))*y +size;
          let distance = Math.sqrt((xLocation - event.offsetX)**2 + (yLocation - event.offsetY)**2);
          if (distance < minDist){
            minDist = distance;
            minx = x;
            miny = y;
          }
      }
    }
    console.log(minDist);
    if (minDist<size){
          if(store.letters[minx+(miny*5)]==0){
              store.letters[minx+(miny*5)] = 1;
          } 
    }

    //let canvas = event.target;
    //var ctx = canvas.getContext("2d");
    //drawGrid(5,11,50,ctx,store);

  })
  );

  useBrowserVisibleTask$(({ track }) => {
    track(() => store.letters[1]);
    const canvas = document.getElementById('GameBoard-Main') ! as HTMLElement;
    var ctx = canvas.getContext("2d");
    drawGrid(5,11,50,ctx,store);
    // will run when the component becomes visible and every time "store.count" changes
    console.log('runs in the browser');
  });





  useTask$(({ track }) => {
    //inital setting of board
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



  });

  return (
    <>
    <canvas id="GameBoard-Main" width= "500px" height="1000px">    

    
      <div>This is the Game render</div> 
    </canvas>
    <button onClick$={() => {



      
      // The click handler is completely stateless, and does not use any QWIK api.
      // Meaning, the qwik runtime is NEVER downloaded, nor executed
      //console.log('click');
      const canvas = document.getElementById('GameBoard-Main') ! as HTMLElement;
      var ctx = canvas.getContext("2d");
      //drawRectangle(100,100,50,ctx);
      drawGrid(5,11,50,ctx,store);
  //ctx.fillStyle = "#333333";
  //ctx.fill();
      //div.style.background = 'yellow';
      console.log(ctx);
    }}>Draw!</button>
      </>
  );
});