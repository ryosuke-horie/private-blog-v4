import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

export function loader({ context }: Route.LoaderArgs) {
	return {};
}

export default function Home({ loaderData }: Route.ComponentProps) {
	return (
		<div>
			<h1>Welcome to Remix</h1>
		</div>
	);
}
