/* tslint:disable */
/* eslint-disable */
/**
* @param {Int32Array} map
* @param {number} turn_player
* @param {number} depth
* @returns {Result}
*/
export function think_ai(map: Int32Array, turn_player: number, depth: number): Result;
/**
*/
export class Result {
  free(): void;
/**
*/
  from: number;
/**
*/
  to: number;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_result_free: (a: number) => void;
  readonly __wbg_get_result_from: (a: number) => number;
  readonly __wbg_set_result_from: (a: number, b: number) => void;
  readonly __wbg_get_result_to: (a: number) => number;
  readonly __wbg_set_result_to: (a: number, b: number) => void;
  readonly think_ai: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_malloc: (a: number) => number;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
