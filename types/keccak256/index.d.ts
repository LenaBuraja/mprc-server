declare module "keccak256" {
	function keccak256(data: string | Buffer): Buffer;
	export = keccak256;
}
