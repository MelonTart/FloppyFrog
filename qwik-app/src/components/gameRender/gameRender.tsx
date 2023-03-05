import { component$, useStylesScoped$,useTask$ , useStore,useOn,$} from '@builder.io/qwik';
import { FrogLogo } from '../icons/floppyfrog';

export default component$(() => {
  const store = useStore({
    count: 0,
    debounced: 0,
  });

  useOn(
    'click',
    $((event) => {
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
    console.log(minx,miny);
  
  })
  );

  useTask$(({ track }) => {
    // track changes in store.count
    track(() => store.count);

    //const ctx = canvas.getContext('2d');
  });

  return (
    <>
    <canvas id="GameBoard-Main" width= "500px" height="1000px">    

    
      <div>This is the Game render</div> 
    </canvas>
    <button onClick$={() => {

      function drawGrid(width, height,size,ctx) {
        const a = 2 * Math.PI / 6;
        let r = size;
        for (let y = 0; y  < height; y +=1) {
          for (let x = 0, j = 1; x  < width; x +=1) {
            let xLocation = (size *  Math.sin(a))*x*2 + (y%2 *(size *  Math.sin(a)));
            let yLocation = (size* (1+Math.cos(a)))*y ;
            drawHexagon(xLocation+size,yLocation+size,size,ctx);
          }
        }
      }

      function drawHexagon(x,y,size,ctx){
        
        const a = 2 * Math.PI / 6;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          ctx.lineTo(x + size * Math.sin(a * i), y + size * Math.cos(a * i));
        }
        ctx.closePath();
        ctx.stroke();
      }
      // The click handler is completely stateless, and does not use any QWIK api.
      // Meaning, the qwik runtime is NEVER downloaded, nor executed
      console.log('click');
      const canvas = document.getElementById('GameBoard-Main')! as HTMLElement;
      var ctx = canvas.getContext("2d");
      //drawRectangle(100,100,50,ctx);
      drawGrid(5,11,50,ctx);
  //ctx.fillStyle = "#333333";
  //ctx.fill();
      //div.style.background = 'yellow';
      console.log(ctx);
    }}>Draw!</button>
      </>
  );
});