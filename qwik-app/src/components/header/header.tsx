import { component$, useStylesScoped$ } from '@builder.io/qwik';
import { FrogLogo } from '../icons/floppyfrog';
import styles from './header.css?inline';

interface HeaderProps {
  user: { username: string, token: string};
};

export default component$((props: HeaderProps) => {
  useStylesScoped$(styles);

  // const user = {
  //   username: "dillonmarquard",
  //   token:"as8d9fyhw34fjcvbn894"
  // };

  return (
    <header>
      <div class="logo">
        <a href="/" title="frog">
          <FrogLogo />
        </a>
      </div>
      <ul>
        <li>
          <a href={"/user/" + props.user.username + '/match'}>History</a>
        </li>
        <li>
          <a href="/leaderboard">Leaderboard</a>
        </li>
        <li>
          <a href={"/user/" + props.user.username}>Profile</a>
        </li>
      </ul>
    </header>
  );
});
