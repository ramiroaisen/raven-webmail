declare module "*.svelte" {
	export type SvelteComponent = any;
	const component: SvelteComponent;
	export default component;
	export const preload: (...args: any[]) => any | Promise<any>;
}

declare module "html-escape" {
	const s: (src: string) => string;
	export default s; 
}