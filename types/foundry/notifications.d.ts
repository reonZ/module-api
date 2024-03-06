export function warn(str: string, arg1?: object | boolean, arg2?: boolean): void;
export function info(str: string, arg1?: object | boolean, arg2?: boolean): void;
export function error(str: string, arg1?: object | boolean, arg2?: boolean): void;
export type Notify = (str: string, arg1?: object | boolean, arg2?: boolean) => void;
