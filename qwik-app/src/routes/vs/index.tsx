import { component$,useTask$,useStore,useBrowserVisibleTask$,noSerialize,onClick$ ,$,useOn} from '@builder.io/qwik';
import { Socket } from 'dgram';
import type { DocumentHead } from '@builder.io/qwik-city';
import GameRender from '~/components/gameRender/gameRender';

export default component$(() => {
 
    const store = useStore(
        {
          MYUSERID: 0,
          gameID:1,
          Connected:[],
        },
        { deep: true }
      );

      useBrowserVisibleTask$(({ }) => {
        //SetUp WSS when it its visable on the screen

        var socket = new WebSocket('ws://10.0.0.164:8080');
        //store.socket = noSerialize(socket);
        socket.addEventListener('message', (event) => {
          const data = JSON.parse(event.data);
          if(data.type == "Matching"){
            console.log("Matching More");
            if(store.MYUSERID ==0){
                store.MYUSERID =  data.data.MYUSERID;
                store.gameID =  data.data.gameID;
                store.Connected.push(store.MYUSERID);
                if(store.MYUSERID==2){
                    store.Connected.push(1); //case where we connect as the last user of a game so add the first user
                }
            }else{
                if(store.gameID == data.data.gameID){
                    store.Connected.push(2); //case was already connected but another person was matched into the same game so add them. you must be 1
                }
                
            }
            console.log(store.Connected);
          }

          //console.log(event.data.data.letters);
          //console.log(store.letters);
          //store.letters[1] = 1;
          // Update your Qwik component state or perform any other necessary action based on the received message
        });
    
        socket.addEventListener('open', (event) => {
          
          const message = {
            type: 'Matching',
          };
          
          socket.send(JSON.stringify(message));
    
        });
        
      });
     


  return (
    <div onClick$={() => {}} >
         { store.Connected.map((UserID) => (
            <GameRender  id={"GameCanvas"+UserID} key={"gc"+UserID} size={27} userid={UserID} gameID = {store.gameID} MYUSERID= {store.MYUSERID} />

      ))}
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Vs',
  meta: [
    {
      name: 'Floppy Frog',
      content: 'Floppy Frog, Who Will Win',
    },
  ],
};