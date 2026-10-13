import { getSessionUser } from "@/modules/auth/guard";
import { NavbarClient } from "./navbar-client";

export async function Navbar() {
  const user = await getSessionUser();
  return <NavbarClient user={user} />;
}
