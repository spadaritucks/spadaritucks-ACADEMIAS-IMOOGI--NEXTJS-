'use client'
import MainNavBar from '@/components/MainNavbar'
import Footer from '@/components/Footer'
import { FC, ReactNode } from 'react'
import Navbar from '@/components/navbar/component'
import { Link } from 'lucide-react'
import LoginIcon from '@mui/icons-material/Login';
import './layout.css'






export const Main: FC<{ children: ReactNode }> = ({ children }) => {

    return (
        <>
            <Navbar>
                <a href='/unidades'>Unidades</a>
                <a href='/modalidade'>Modalidades</a>
                <a href='catalogo'>Planos</a>
                <a className="login-link-icon" href='login'><LoginIcon sx={{ margin: 0.5, fontSize: 30 }} />Login</a>
            </Navbar>
            {children}
            <Footer />
        </>

    )
}