import { component$, Slot } from '@builder.io/qwik';
import { loader$ } from '@builder.io/qwik-city';

import Header from '../components/header/header';

export const useServerTimeLoader = loader$(() => {
  return {
    date: new Date().toISOString(),
  };
});

export default component$(() => {
  const serverTime = useServerTimeLoader();
  const u = {
    username:"notloggedin",
    token:"sessiontoken"
  };

  return (
    <>
      <main>
        <Header user={u} />
        <section class="margin: auto">
          <Slot />
        </section>
      </main>
      <footer>
          <div>{serverTime.value.date}</div>
      </footer>
    </>
  );
});
