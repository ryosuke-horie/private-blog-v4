import { css } from "styled-system/css";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

export default function Home() {
	return (
		<div className={css({ padding: "4", backgroundColor: "gray.100" })}>
			<h1 className={css({ fontSize: "2xl", fontWeight: "bold" })}>
				Welcome to the home page
			</h1>
		</div>
	);
}
