import { NavLink } from "@remix-run/react";
import { cn } from "~/lib/utils";

export function Navbar({
  isLoggedIn,
  canSeeDashboard,
}: {
  isLoggedIn: boolean;
  canSeeDashboard: boolean;
}) {
  return (
    <nav className="flex items-center justify-between w-full py-4 px-10 border-b underline-offset-8">
      <div>
        <NavLink
          className={({ isActive }) =>
            cn(
              "text-2xl font-bold cursor-pointer",
              isActive && "underline decoration-slate-500"
            )
          }
          to="/"
        >
          Songer
        </NavLink>
      </div>
      <div>
        <ul className="flex items-center gap-10">
          {isLoggedIn && (
            <>
              <li>
                <NavLink
                  className={({ isActive }) =>
                    cn(
                      "text-m font-bold cursor-pointer",
                      isActive && "underline decoration-slate-500"
                    )
                  }
                  to="/reset"
                  prefetch="intent"
                >
                  Reset
                </NavLink>
              </li>
              {canSeeDashboard && (
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      cn(
                        "text-m font-bold cursor-pointer",
                        isActive && "underline decoration-slate-500"
                      )
                    }
                    to="/admin"
                    prefetch="intent"
                  >
                    Dashboard
                  </NavLink>
                </li>
              )}
              <li>
                <NavLink
                  className={({ isActive }) =>
                    cn(
                      "text-m font-bold cursor-pointer",
                      isActive && "underline decoration-slate-500"
                    )
                  }
                  to="/search"
                  prefetch="intent"
                >
                  Add a song
                </NavLink>
              </li>
              <li className="flex items-center gap-2">
                <NavLink
                  className={({ isActive }) =>
                    cn(
                      "text-m font-bold cursor-pointer",
                      isActive && "underline decoration-slate-500"
                    )
                  }
                  to="/logout"
                >
                  Logout
                </NavLink>
              </li>
            </>
          )}
          {!isLoggedIn && (
            <li>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  cn(
                    "text-m font-bold cursor-pointer",
                    isActive && "underline decoration-slate-500"
                  )
                }
              >
                Login
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
