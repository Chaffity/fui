declare const Fui: Record<keyof HTMLElementTagNameMap, Fui.FuiElement<any>>;

declare namespace Fui {
  interface FuiElement<E> {
    (scope: E): HTMLElement

    attr: (key: string, value: string) => FuiElement<E>;
    prop: (key: string, value: string) => FuiElement<E>;

    add: (element: FuiElement<E>) => FuiElement<E>;

    lift: <T>(fn: (scope: T) => FuiElement<T>) => FuiElement<T>;

    scope: <T>(fn: (scope: any) => T) => FuiElement<E>;
  }
}

export = Fui;
