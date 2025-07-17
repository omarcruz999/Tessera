import { NavLink } from "react-router-dom";
import logo from "../assets/Tessera.svg";
import logoimage from "../assets/tesseraLogo.svg";

const PublicNavbar = () => {
  // add `!text-lg` to make it bigger
  const defaultClasses =
    "!px-3 !py-2 !rounded-md !font-medium !no-underline " +
    "!text-lg " +
    "!transition-colors !duration-200 " +
    "!text-[#8EB486] hover:!text-[#80A278]";

  // just overrides color, size stays from defaultClasses
  const activeOverride = "!text-[#80A278]";

  return (
    <div className="fixed top-0 left-0 w-full bg-[#3e2723] z-50">
      <nav className="flex w-full justify-between px-4 py-2 items-center">
        <div className="flex space-x-4 items-center">
          <NavLink to="/">
            <img src={logoimage} alt="Tessera" className="h-10" />
          </NavLink>
          <NavLink to="/">
            <img src={logo} alt="Tessera Logo" className="h-10 w-30" />
          </NavLink>
        </div>
        <div className="flex items-center">
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? `${defaultClasses} ${activeOverride}`
                : defaultClasses
            }
          >
            About
          </NavLink>
        </div>
      </nav>
    </div>
  );
};

export default PublicNavbar;