import * as core from "../main/fui-core";

interface FuiTestTarget {
  name: string;
  data?: string;
  children: FuiTestTarget[];
}

interface FuiTestMethods {
  data(str: string): this
}

const { foo, bar, baz } = core<FuiTestTarget, "foo" | "bar" | "baz", FuiTestMethods>({
  build(name: string) {
    return { name, children: [] }
  },
  append(a: FuiTestTarget, b: FuiTestTarget) {
    return a.children.push(b)
  }
}, (tap: core.FuiTap<FuiTestTarget, void, FuiTestMethods>) => ({
  data(str: string) {
    return tap((_, fx) => fx.data = str);
  }
}));

const checks = [
  [foo(), {
    name: "foo",
    children: []
  }],

  [foo.add(bar)(), {
    name: "foo",
    children: [{
      name: "bar",
      children: []
    }]
  }],

  [foo.add(bar.add(baz))(), {
    name: "foo",
    children: [{
      name: "bar",
      children: [{
        name: "baz",
        children: []
      }]
    }]
  }],

  [foo.lift((data: string) => bar.data(data))("data"), {
    name: "foo",
    children: [{
      name: "bar",
      data: "data",
      children: []
    }]
  }],

  [foo.lift((data: string) => bar.data(data).lift((data: string) => baz.data(data)))("data"), {
    name: "foo",
    children: [{
      name: "bar",
      data: "data",
      children: [{
        name: "baz",
        data: "data",
        children: []
      }]
    }]
  }],

  [foo.lift((data: string) => bar.data(data)).scope((scope: string) => [scope, scope])("data"), {
    name: "foo",
    children: [{
      name: "bar",
      data: [
        "data",
        "data",
      ],
      children: []
    }]
  }],

  [foo.lift((data: string) => bar.data(data).lift((data: string) => baz.data(data)).scope((scope: string) => [scope, scope]))("data"), {
    name: "foo",
    children: [{
      name: "bar",
      data: "data",
      children: [{
        name: "baz",
        data: [
          "data",
          "data",
        ],
        children: []
      }]
    }]
  }]
]

describe("fui-core", () => {
  test.each(checks)("ensure tree is correct (%#)", (actual, extected) => {
    expect(actual).toEqual(extected);
  });
});
