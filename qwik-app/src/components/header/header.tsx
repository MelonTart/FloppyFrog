import { component$, useStylesScoped$ } from '@builder.io/qwik';
import { FrogLogo } from '../icons/floppyfrog';
import styles from './header.css?inline';

export default component$(() => {
  useStylesScoped$(styles);

  return (
    <header>
      <div class="logo">
        <a href="https://github.com/MelonTart/FloppyFrog" target="_blank" title="frog">
          <FrogLogo />
        </a>
      </div>
      <ul>
        <li>
          <a href="/account" target="_blank">
            Game History
          </a>
        </li>
        <li>
          <a href="/leaderboard" target="_blank">
            Leaderboard
          </a>
        </li>
        <li>
          <a href="/account" target="_blank">
            Account
          </a>
        </li>
      </ul>
    </header>
  );
});
