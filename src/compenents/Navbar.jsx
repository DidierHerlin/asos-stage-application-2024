// src/components/Navbar.js
import React, { useState,useEffect  } from "react";
import {
    BsArrowLeftShort,
    BsSearch,
    BsFillFileImageFill,
    BsPerson
} from "react-icons/bs";
import {
    AiOutlineFileText,
    AiOutlineLogout
} from "react-icons/ai";
import { TbReport } from "react-icons/tb";
import { GrUserWorker } from "react-icons/gr";
import { RiDashboardFill } from "react-icons/ri";
import HorizontalNavbar from "./HorizontalNavbar";
import { Link } from "react-router-dom";
import Asos_img from "../logo/Asos_img.jpg";

export default function Navbar({ children }) {
    const [open, setOpen] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("dark-mode") === "true";
      });
    
      const toggleDarkMode = () => {
        setIsDarkMode((prev) => {
          const newMode = !prev;
          localStorage.setItem("dark-mode", newMode.toString());
          return newMode;
        });
      };
    
      useEffect(() => {
        if (isDarkMode) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }, [isDarkMode]);

    // Définition des éléments du menu
    const Menus = [
        { title: "Tableau de bord", icon: <RiDashboardFill className="text-2xl" />, link: "/dashboard" },
        { title: "Rapport", icon: <TbReport className="text-2xl"/>, link: "/rapport" },
        { title: "Projet", spacing: true, icon: <BsFillFileImageFill className="text-2xl"/>, link: "/tables-projet" },
        { title: "Employer", icon: <GrUserWorker className="text-2xl"/>, link: "/employer" },
        { title: "Profil", spacing: true, icon: <BsPerson className="text-2xl"/>, link: "/profil" },
        { title: "Déconnexion", icon: <AiOutlineLogout className="text-2xl"/>, link: "/logout" },
    ];

    return (
        <div className={`flex h-screen w-screen ${isDarkMode ? "bg-gray-800 text-gray-300" : "bg-white text-black"}`}>
            {/* Navbar verticale */}
            <div className={`transition-all duration-300 ${open ? "w-72" : "w-20"} ${isDarkMode ? "bg-gray-900" : "bg-blue-700"} h-full p-5 pt-8 relative`}>
                <BsArrowLeftShort
                    className={`bg-white text-blue-700 text-3xl rounded-full absolute -right-3 top-9 border border-blue-700 cursor-pointer ${!open ? "rotate-180" : ""}`}
                    onClick={() => setOpen(prev => !prev)}
                />
                <div className="flex items-center justify-center">
                    <img 
                        src={Asos_img} 
                        alt="Logo Asos" 
                        className={`bg-green-400 rounded cursor-pointer duration-500 ${open ? "rotate-360" : ""}`} 
                        style={{ width: "60px", height: "60px" }} 
                    />
                    <h1 className={`text-white origin-left font-medium text-2xl transition-transform duration-300 ${!open ? "scale-0" : "scale-100"}`}>
                        {/* Ajoutez votre texte ici */}
                    </h1>
                </div>

                <div className={`flex items-center rounded-md ${isDarkMode ? "bg-gray-700" : "bg-white"} mt-6 ${!open ? "px-2.5" : "px-2"} py-2`}>
                    <BsSearch className={`text-blue-700 text-lg block cursor-pointer ${open ? "mr-2" : ""}`} />
                    <input
                        type="search"
                        className={`text-base bg-transparent w-full focus:outline-none ${isDarkMode ? "text-gray-300" : "text-blue-700"} ${!open ? "hidden" : ""}`}
                        placeholder="Rechercher..."
                    />
                </div>

                <ul className="pt-2">
                    {Menus.map((menu, index) => (
                        <li
                            key={index}
                            className={`text-white text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-blue-800 rounded-md ${menu.spacing ? "mt-9" : "mt-2"}`}
                        >
                            {menu.link ? (
                                <Link to={menu.link} className="flex items-center w-full text-white">
                                    {menu.icon}
                                    <span className={`text-base font-medium flex-1 duration-300 ${!open ? "hidden" : ""}`}>
                                        {menu.title}
                                    </span>
                                </Link>
                            ) : (
                                <>
                                    {menu.icon}
                                    <span className={`text-base font-medium flex-1 duration-300 ${!open ? "hidden" : ""}`}>
                                        {menu.title}
                                    </span>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Conteneur principal contenant la navbar horizontale et le contenu */}
            <div className="flex flex-col flex-grow overflow-hidden w-full">
                {/* Navbar horizontale */}
                <div className="flex-shrink-0">
                    <HorizontalNavbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
                </div>

                {/* Contenu de la page */}
                <div className="flex-grow p-4 overflow-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}
