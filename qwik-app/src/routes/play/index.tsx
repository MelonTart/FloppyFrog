import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import GameRender from '~/components/gameRender/gameRender';

export default component$(() => {
  return (
    <div>
      <GameRender id="GameCanvas" gameID={1} size={27} userid={1} MYUSERID={1} />
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Play',
  meta: [
    {
      name: 'Floppy Frog',
      content: 'Floppy Frog, Can You Survive?',
    },
  ],
};