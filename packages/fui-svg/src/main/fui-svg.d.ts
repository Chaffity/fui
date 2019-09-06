import { FuiEngine, FuiMethods } from "@chaffity/fui-core";

declare interface FuiSVGMethods {
  attr(key: string, val: string): this
  prop(key: string, val: string): this
}

declare const FuiSVGEngine: FuiEngine<SVGElement, keyof SVGElementTagNameMap, FuiSVGMethods>;

export = FuiSVGEngine;
