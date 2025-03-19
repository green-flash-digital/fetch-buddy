export type FetchBuddyMiddlewareFn<R> = (arg: R) => R | Promise<R>;
export type FetchBuddyMiddlewareRequest = FetchBuddyMiddlewareFn<RequestInit>;

export class FetchBuddyMiddleware<R> {
  private _middlewareFns: Set<FetchBuddyMiddlewareFn<R>>;

  constructor() {
    this._middlewareFns = new Set<FetchBuddyMiddlewareFn<R>>();
  }

  use(middlewareFn: FetchBuddyMiddlewareFn<R>) {
    this._middlewareFns.add(middlewareFn);
  }

  async apply(val: R) {
    let modifiedVal = val;
    for (const middleware of this._middlewareFns) {
      modifiedVal = await middleware(modifiedVal);
    }
    return modifiedVal;
  }
}
