import type { JSX } from "react";
import { forwardRef } from "react";
import { clsx } from "clsx";
import { css } from "@linaria/core";

export type ListPropsNative = JSX.IntrinsicElements["ul"];
export type ListProps = ListPropsNative;

const styles = css`
  list-style-type: none;
  padding: 0;
  margin: 0;
  height: 100%;
  overflow-y: auto;

  li {
    padding: 0.5rem 1rem;
    margin: 0;

    & > div {
      font-size: 1.25rem;
      font-weight: 600;
    }
    & > p {
      margin: 0;
    }

    & + & {
      margin-top: 0.5rem;
    }
  }
`;

export const List = forwardRef<HTMLUListElement, ListProps>(function List(
  { children, className, ...restProps },
  ref
) {
  return (
    <ul {...restProps} className={clsx(styles, className)} ref={ref}>
      {children}
    </ul>
  );
});
