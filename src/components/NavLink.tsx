"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

function NavLink({ href, children }: { href: string; children: ReactNode }) {
	const pathName = usePathname();
	const isActive = pathName === href;
	return (
		<Link
			href={href}
			className={isActive ? "activeLink" : ""}>
			{children}
		</Link>
	);
}

export default NavLink;
