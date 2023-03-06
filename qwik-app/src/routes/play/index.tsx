import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import GameRender from '~/components/gameRender/gameRender';

export default component$(() => {
  return (
    
      <GameRender id="GameCanvas"/>

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