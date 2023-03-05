import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { Link } from '@builder.io/qwik-city';

export default component$(() => {
  return (
    <>
      <div>
          Floppy Frog!
      </div>
      <div>
        <a href="/play" title="frog">Play</a>
      </div>
     </>
  );
});

export const head: DocumentHead = {
  title: 'Floppy Frog',
  meta: [
    {
      name: 'Floppy Frog',
      content: 'Floppy Frog, Can You Survive?',
    },
  ],
};
