/**
 * @typedef { {key: string, [k: string]: unknown} } ModulePacket
 * @typedef { (packet: ModulePacket, senderId: string) => void} ModuleSocketFunction
 */
/**
 * @param {ModuleSocketFunction} callback
 */
export function socketOn(callback: ModuleSocketFunction): void;
/**
 * @param {ModuleSocketFunction} callback
 */
export function socketOff(callback: ModuleSocketFunction): void;
/**
 * @param {ModulePacket} packet
 */
export function socketEmit(packet: ModulePacket): void;
export function registerPermissionSocket(): void;
export type ModulePacket = {
    [k: string]: unknown;
    key: string;
};
export type ModuleSocketFunction = (packet: ModulePacket, senderId: string) => void;
