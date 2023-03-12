import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import GameRender from '~/components/gameRender/gameRender';

export default component$(() => {
  return (
    <div>
      <GameRender id="GameCanvas1" size={27} userid={1} />
      <GameRender id="GameCanvas2" size={27} userid={2}/>
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