import React, { useState } from "react";
import { BsArrowLeftShort, BsSearch, BsPerson } from "react-icons/bs";
import { AiOutlineLogout } from "react-icons/ai";
import { TbReport } from "react-icons/tb";
import { RiDashboardFill } from "react-icons/ri";
import HorizontalBarUser from "./HorizontalBarUser";
import { Link } from "react-router-dom";
import Asos_img from "../logo/Asos_img.jpg";
import clsx from 'clsx';

export default function NavBarUser({ children }) {
    const [open, setOpen] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setIsDarkMode(prev => !prev);
    };

    const Menus = [
        { title: "Tableau de bord", icon: <RiDashboardFill className="text-2xl" />, link: "/dashboard_user" },
        { title: "Rapport", icon: <TbReport className="text-2xl" />, link: "/rapport_user" },
        { title: "Profil", spacing: true, icon: <BsPerson className="text-2xl" />, link: "/employer_profile" },
        { title: "Déconnexion", icon: <AiOutlineLogout className="text-2xl" />, link: "/logout" },
    ];

    return (
        <div className={clsx("flex h-screen w-screen", isDarkMode ? "bg-gray-800 text-gray-300" : "bg-white text-black")}>
            {/* Navbar verticale */}
            <div className={clsx("transition-all duration-300", open ? "w-72" : "w-20", isDarkMode ? "bg-gray-900" : "bg-blue-700", "h-full p-5 pt-8 relative")}>
                <BsArrowLeftShort
                    className={clsx("bg-white text-blue-700 text-3xl rounded-full absolute -right-3 top-9 border border-blue-700 cursor-pointer", !open && "rotate-180")}
                    onClick={() => setOpen(prev => !prev)}
                    aria-label="Toggle menu"
                />
                
                <div className="flex items-center justify-center">
                    <img
                        src={Asos_img}
                        alt="Logo ASOS"
                        className={clsx("bg-green-400 rounded cursor-pointer duration-500", open && "rotate-360")}
                        style={{ width: "60px", height: "60px" }}
                    />
                </div>

                <div className={clsx("flex items-center rounded-md mt-6 py-2", isDarkMode ? "bg-gray-700" : "bg-gray-200", !open && "px-2.5", open && "px-2")}>
                    <BsSearch className={clsx("text-blue-700 text-lg block cursor-pointer", open && "mr-2")} />
                    <input
                        type="search"
                        className={clsx("text-base bg-transparent w-full focus:outline-none", isDarkMode ? "text-gray-300" : "text-blue-700", !open && "hidden")}
                        placeholder="Rechercher..."
                    />
                </div>

                <ul className="pt-2">
                    {Menus.map((menu, index) => (
                        <li
                            key={index}
                            className={clsx("text-white text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-blue-800 rounded-md", menu.spacing && "mt-9", !menu.spacing && "mt-2")}
                        >
                            <Link to={menu.link} className="flex items-center w-full text-white">
                                {menu.icon}
                                <span className={clsx("text-base font-medium flex-1 duration-300", !open && "hidden")}>
                                    {menu.title}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Conteneur principal avec la navbar horizontale et le contenu */}
            <div className="flex flex-col flex-grow overflow-hidden w-full">
                {/* Navbar horizontale */}
                <div className="flex-shrink-0">
                    <HorizontalBarUser isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
                </div>

                {/* Contenu de la page */}
                <div className="flex-grow p-4 overflow-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}
