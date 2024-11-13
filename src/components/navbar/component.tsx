'use client'

import Image from "next/image"
import { ReactNode, useEffect, useState } from "react"
import logo from '@/../public/dragao.png'
import menu from '@/../public/menu.png'
import close from '@/../public/close.png'
import Link from "next/link"
import './component.css'

//Parametros da Navbar
interface NavbarProps {
    children: ReactNode
    
}

export default function Navbar({ children }: NavbarProps) {

    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [navClass, setNavClass] = useState<string>("");

    //Função para abertura e fechamento do menu lateral
    const handleMenuClick = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    //Função para mudança de classe de estilização da navbar(Menu Padrão e Menu Autenticado)
    useEffect(() => {
        const token = sessionStorage.getItem('token');
        setNavClass(`${token ? "authenticated-nav-links" : "nav-links"} ${isMenuOpen ? "open" : ""}`);
    }, [isMenuOpen]);

    //Renderização da navbar
    return (
        <nav className="nav-area">
            <div className="logo-title-click"><Link href="/"><div><Image src={logo} width={80} height={80} alt="" /><h2>ACADEMIAS IMOOGI</h2></div></Link></div>
            <div className="menu-button" onClick={handleMenuClick} aria-expanded={isMenuOpen}>
                {isMenuOpen ? <Image src={close} alt="" width={35} height={35} /> : <Image src={menu} alt="" width={35} height={35} />}
            </div>
            <div className={navClass}>
                {children}
            </div>
        </nav>

    )
}