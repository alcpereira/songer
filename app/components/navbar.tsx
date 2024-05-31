import { NavLink } from "@remix-run/react";

export function Navbar({
  isLoggedIn,
  canSeeDashboard,
}: {
  isLoggedIn: boolean;
  canSeeDashboard: boolean;
}) {
  return (
    <nav
      className="flex items-center justify-between w-full py-4 px-8 px
-24"
    >
      <div>
        <a className="text-2xl font-bold" href="/">
          Songer
        </a>
      </div>
      <div>
        <ul className="flex items-center gap-8">
          {isLoggedIn && (
            <>
              {canSeeDashboard && (
                <li>
                  <NavLink to="/admin" className="text-m font-bold">
                    Dashboard
                  </NavLink>
                </li>
              )}
              <li>
                <NavLink to="/search" className="text-m font-bold">
                  Add a song
                </NavLink>
              </li>
              <li className="flex items-center gap-2">
                <NavLink
                  to="/logout"
                  className="text-m font-bold cursor-pointer"
                >
                  Logout
                </NavLink>
              </li>
            </>
          )}
          {!isLoggedIn && (
            <li>
              <NavLink to="/login" className="text-m font-bold cursor-pointer">
                Login
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
