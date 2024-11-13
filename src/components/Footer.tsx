'use client'
import '@/Assets/css/components-styles/ClientFooter.css'
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Link from "next/link";
import Image from 'next/image';
import Logo from '../../public/logo.jpg'


export default function Footer() {

    return (
        <footer className='footer-bar'>
            <div className='footer-card logo-text '>
                <Image width={258.3} height={64.5} src={Logo} alt="" className='footer-logo'></Image>
                <p className='footer-text'>DPU Krav Maga BR - Boxe - Kickboxing - Muay Thai - Taekwondo
                    - Hapkido - Hwarang Kumdo - Jiu-Jitsu - Capoeira - Aulas PCD
                </p>
                <p className='footer-text'>Fit Dance
                </p>
            </div>
            <div className="footer-card links">
                <h2>Links</h2>
                <ul><li><Link href='/unidades'>Unidades</Link></li>
                    <li><Link href='/modalidade'>Modalidades</Link></li>
                    <li><Link href='/equipe'>Equipe</Link></li>
                </ul>


            </div>

            <div className="footer-card social">
                <h2>Redes Sociais</h2>
                <a href="https://api.whatsapp.com/send/?phone=11977010020&text&type=phone_number&app_absent=0" className='social-plataform'><WhatsAppIcon /><p>WhatsApp</p></a>
                <a href="https://www.instagram.com/academiasimoogi_oficial/" className='social-plataform'><InstagramIcon /><p>Instagram</p></a>
                <a href="https://www.facebook.com/mestre.jefersondasilva" className='social-plataform'><FacebookIcon /><p>Facebook</p></a>
            </div>

            <div className="footer-card location">
                <h2>Localização</h2>
                <LocationOnIcon sx={{ margin: 0.5, fontSize: 30 }} /><p> Rua Marechal Deodoro 1815 - 2°Andar - São Bernardo do Campo - SP</p>
            </div>

        </footer>
    )
}