"use client";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import React, { useEffect } from "react";

function notFound() {
	const pathName = usePathname();

	return (
		<main className=" fixed inset-0 gap-4 mainScheme  pt-32 sm:pt-16 px-3 flex justify-center items-center flex-col text-center">
			<h1 className="font-black text-5xl">404</h1>
			<p className="text-xl">Page Not Found</p>
			<Link
				href={"/"}
				className="underline  mainScheme opacity-80 hover:opacity-100 ">
				Back To Home
			</Link>
		</main>
	);
}

export default notFound;
