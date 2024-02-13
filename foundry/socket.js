import { MODULE } from ".";

/**
 * @typedef { {key: string, [k: string]: unknown} } ModulePacket
 * @typedef { (packet: ModulePacket, senderId: string) => void} ModuleSocketFunction
 */

/**
 * @param {ModuleSocketFunction} callback
 */
export function socketOn(callback) {
	game.socket.on(`module.${MODULE.id}`, callback);
}

/**
 * @param {ModuleSocketFunction} callback
 */
export function socketOff(callback) {
	game.socket.off(`module.${MODULE.id}`, callback);
}

/**
 * @param {ModulePacket} packet
 */
export function socketEmit(packet) {
	game.socket.emit(`module.${MODULE.id}`, packet);
}
