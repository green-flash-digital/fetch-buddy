import { css } from "@linaria/core";
import { Link, Outlet } from "react-router";

const styles = css`
  :global() {
    body,
    html {
      height: 100vh;
      width: 100vw;
      overflow: hidden;

      * {
        box-sizing: border-box;
        &::after,
        &::before {
          box-sizing: border-box;
        }
      }
    }
    #root {
      height: 100%;
      width: 100%;
    }
    #root {
      display: grid;
      grid-template-columns: 300px 1fr;
      grid-template-rows: 80px 1fr;
      grid-template-areas:
        "header header"
        "sidebar main";

      & > article {
        grid-area: sidebar;
        height: 100%;
      }

      & > header {
        grid-area: header;
        height: 100%;
      }
      & > main {
        grid-area: main;
        height: 100%;
        overflow: hidden;
      }
    }
  }
`;

export function LayoutRoot() {
  return (
    <>
      <header className={styles}></header>
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
    </>
  );
}
