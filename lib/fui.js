// @ts-check

'use strict';

/**
 * Mandatory core functions used in every Fui instance
 *
 * @template Name, Type
 * @typedef {Object} FuiSetup
 *
 * @property {FuiSetupBuildCallback<Name, Type>} build
 * @property {FuiSetupAppendCallback<Type>} append
 */

/**
 * @template Name, Type
 * @callback FuiSetupBuildCallback
 *
 * @param {Name} name The name of the node to be built
 *
 * @returns {Type}
 */

/**
 * @template Type
 * @callback FuiSetupAppendCallback
 *
 * @param {Type} parentNode
 * @param {Type} childNode
 *
 * @return {void}
 */

/**
 * Optional extended methods that will be added to the Fui instance
 *
 * @template Type, Scope
 * @typedef {Object.<string, FuiMethod<Type, Scope>>} FuiMethods
 */

 /**
 * A custom method introduced into a `FuiEngine` by a given implementation.
 *
 * @template Type, Scope
 * @callback FuiMethod
 *
 * @param {*} x1
 * @param {*} x2
 * @param {*} x3
 *
 * @returns {FuiElement<Type, Scope>}
 */

/**
 * @template Type, Scope
 * @callback FuiMethodsBuilder
 *
 * @param {FuiTapCallback<Type>} tap
 *
 * @returns {FuiMethods<Type, Scope>}
 */

/**
 * @template Type
 * @callback FuiTapCallback
 *
 * @param {FuiTapEffectCallback<Type>} tapEffect
 *
 * @return {FuiElement<Type, Scope>}
 */

/**
 * A callback function tasked with responsibility of applying effects to nodes
 * in the tree.
 *
 * @template Type
 * @callback FuiTapEffectCallback
 *
 * @param {string} f
 * @param {Type} fx
 *
 * @return {void}
 */

/**
 * @template Scope, NewScope
 * @callback FuiScopeConversionCallback
 *
 * @param {Scope} scope
 *
 * @returns {NewScope}
 */

/**
 * A functional wrapper
 *
 * @template Type, Scope
 * @callback FuiElement
 *
 * @param {Scope} data
 *
 * @returns {Type}
 */

/**
 * A prepared instance of Fui.
 *
 * @template Name, Type, Scope
 * @typedef {Object<Name, FuiElement<Type, Scope>>} FuiEngine
 */

/**
 * @template Name, Type, Scope
 * @function
 *
 * @param {FuiSetup<Name, Type>} setup
 * @param {FuiMethodsBuilder<Type, Scope>} methods
 *
 * @returns {FuiEngine<Name, Type, Scope>}
 */
export default ({ build, append }, methods = (() => ({}))) => {
  const impl = f => (tap => Object.assign(f, {
    ...methods(tap),

    /**
     * Similar to the `map` method in a traditional Reader monad, this method
     * takes the output of the previous function, modifies it, and returns it.
     *
     * @param {FuiElement<Type, Scope>} g
     *
     * @returns {FuiElement<Type, Scope>}
     */
    add: g => tap((x, fx) => append(fx, g(x))),

    /**
     * Similiar to the `flatMap`, or `chain` method in a traditional Reader
     * monad, this method takes the output of the previous function, and
     * returns a new monad.
     *
     * @param {Function} g
     *
     * @returns {FuiElement<Type, Scope>}
     */
    lift: g => tap((x, fx) => append(fx, g(x)(x))),

    /**
     * Similar to the `local` method in a traditional Reader monad, this method
     * alters the execution environment that child compositions will be run
     * under.
     *
     * @template NewScope
     *
     * @param {FuiScopeConversionCallback<Scope, NewScope>} g
     *
     * @returns {FuiElement<Type, NewScope>}
     */
    scope: g => impl(x => f(g(x))),
  }))(g => impl(x => (g(x, x = f(x)), x)));

  return new Proxy(impl, {
    get: (_, prop) => impl(() => build(prop)),
  });
};
