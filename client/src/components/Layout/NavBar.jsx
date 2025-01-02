/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */
import { Link } from "react-router-dom";
import { navItems } from "../../static/data";

const NavBar = () => {
  return (
    <div>
      <div className="bg-white h-full mt-3 py-4 rounded-md">
        <div className="flex items-start justify-around pt-2 px-2">
          {navItems &&
            navItems.map((i, index) => (
              <div className="w-full" key={index}>
                <Link
                  to={i.url}
                  className="text-black flex flex-col items-center justify-between mx-3"
                >
                  <div className="relative">
                    <div className="absolute inset-0 -m-2 rounded-2xl border border-gray-300 bg-gradient-to-b from-current to-transparent opacity-10"></div>
                    <div className="relative z-10">
                      <img
                        src={i.image_Url}
                        alt=""
                        className="size-[35px] object-cover rounded-lg"
                      />
                    </div>
                  </div>
                  <p
                    className="text-center text-[14px] font-[550] mt-3 break-words"
                    style={{ color: i.color }}
                  >
                    {i.title}
                  </p>
                </Link>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
