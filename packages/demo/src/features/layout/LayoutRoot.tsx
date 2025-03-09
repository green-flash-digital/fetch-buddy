import { Link, Outlet } from "react-router";

export function LayoutRoot() {
  return (
    <header>
      <article>
        <ul>
          <li>
            <Link to="/swr">SWR</Link>
          </li>
        </ul>
      </article>
      <main>
        <Outlet />
      </main>
    </header>
  );
}
