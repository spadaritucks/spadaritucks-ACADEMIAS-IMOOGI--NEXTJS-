'use client'
import Link from "next/link";
import Image from 'next/image';
import { useState } from "react";
import Logo from '../../public/logo.jpg'
import MenuIcon from '@mui/icons-material/Menu';
import LoginIcon from '@mui/icons-material/Login';
import '@/Assets/css/components-styles/DefaultNav.css'
import NavDropdown from 'react-bootstrap/NavDropdown';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  
    

export default function MainNavBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Menu começa fechado



    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen); // Alterna entre aberto e fechado
        
    };


    return (
        <>

            <nav className='navbar-style'>
                <Link href='/'><Image width={162} height={33} className="nav-bar-logo" src={Logo} alt="Imoogi" /></Link>

                <div className={`nav-itens ${isMenuOpen ? 'open' : ''}`}>
                    <div className="nav-link-routes">
                        <Link className="nav-bar-link" href='/unidades'>Unidades</Link>
                        <Link className="nav-bar-link" href='/modalidade'>Modalidades</Link>


                        <DropdownMenu>
                            <DropdownMenuTrigger>Colaboradores</DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Colaboradores</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem><Link href='/equipe' className="nav-bar-link">Equipe</Link></DropdownMenuItem>
                                <DropdownMenuItem><Link href='/gympass' className="nav-bar-link">Gympass</Link></DropdownMenuItem>
                                <DropdownMenuItem><Link href='/totalpass' className="nav-bar-link">TotalPass</Link></DropdownMenuItem>
                               
                            </DropdownMenuContent>
                        </DropdownMenu>
                        
                    </div>


                    <div className="nav-link-login">
                        <button className='nav-btn-register'><Link href='catalogo'>Planos</Link></button>
                        <Link className="login-link-icon" href='login'><LoginIcon sx={{ margin: 0.5, fontSize: 30 }} />Login</Link>
                    </div>


                </div>

                <div className="btn-toogle" onClick={toggleMenu}>
                    {!isMenuOpen ?  <MenuIcon sx={{ fontSize: 45 }}  /> :<CloseSharpIcon sx={{ fontSize: 45 }} />}
                </div>

            </nav>



        </>
    )
}