declare function FuiCore<Type, Names extends PropertyKey, Methods = {}>(builder: core.FuiBuilder<Type, Names>, methods?: (tap: core.FuiTap<Type, Env, Methods>) => Methods): core.FuiEngine<Type, Names, Methods>;

declare namespace FuiCore {
  type FuiEngine<Type, Names extends PropertyKey, Methods = {}> = Record<Names, FuiElement<Type, void, Methods> & Methods>;

  interface FuiBuilder<Type, Names extends PropertyKey> {
    build(name: Names): Type
    append(a: Type, b: Type): void
  }

  type FuiTap<Type, Env, Methods> = (tap: (value: any, target: Type) => void) => FuiElement<Type, Env, Methods> & Methods;

  interface FuiElement<Type, Env, Methods> {
    (scope?: Env): Type;

    add: (element: this) => FuiElement<Type, Env, Methods> & Methods;
    lift: <AltEnv = Env>(fn: (scope: AltEnv) => this) => FuiElement<Type, AltEnv, Methods> & Methods;
    scope: <NewEnv>(fn: (scope: Env) => NewEnv) => FuiElement<Type, NewEnv, Methods> & Methods;
  }
}

export = FuiCore;
