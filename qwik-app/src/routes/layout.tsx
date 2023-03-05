import { component$, Slot } from '@builder.io/qwik';
import { loader$ } from '@builder.io/qwik-city';

import Header from '../components/header/header';
import GameRender from '../components/gameRender/gameRender';

export const useServerTimeLoader = loader$(() => {
  return {
    date: new Date().toISOString(),
  };
});

export default component$(() => {
  const serverTime = useServerTimeLoader();
  const u = {
    username:"insert username",
    token:"usertoken"
  };

  return (
    <>
      <main>
        <Header user={u} />
        <section>
          <Slot />
          <GameRender />
        </section>
      </main>
      <footer>
          <div>{serverTime.value.date}</div>
      </footer>
    </>
  );
});
