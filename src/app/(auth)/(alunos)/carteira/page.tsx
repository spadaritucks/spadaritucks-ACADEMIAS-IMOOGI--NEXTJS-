'use client'

import UserSession from "@/api/UserSession";
import { Contrato, getUsers, Usuario, UsuarioModalidade } from "@/api/UsuariosRequest";
import { ClientMain } from "@/layouts/client/layout";
import { FC, useEffect, useState } from "react";
import '@/Assets/css/pages-styles/area_aluno.css'
import logo from '../../../../../public/logo imoogi novo sem  fundo.png'
import Image from "next/image";
import ReactPDF, { PDFDownloadLink } from '@react-pdf/renderer';
import { border } from "@chakra-ui/react";

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


 function carteiraAluno() {
    const [contratos, setContratos] = useState<Contrato[]>([])
    const [modalidades, setModalidades] = useState<UsuarioModalidade[]>([])
    const [imgData, setImageData] = useState<any>()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [user, setUser] = useState<Usuario>()


        useEffect(() => {
            const userResponse = sessionStorage.getItem('user');
            if (userResponse) {
                setUser(JSON.parse(userResponse));
            }
        }, [])


    useEffect(() => {
        setIsLoading(true)
        try{
            const convertBase64 = async () => {
                if (user) {
                    const filename = user.foto_usuario.replace(/^uploads\//, ''); // Remove 'uploads/' do início
                    const fotoUsuario = `${process.env.NEXT_PUBLIC_API_URL}/api/image/${encodeURIComponent(filename)}`;
                    const response = await fetch(fotoUsuario);
                    const data = await response.json();
    
                    const imgData = data.image;
                    setImageData(imgData)
                }
    
            }
            convertBase64()
        } catch (error) {
            console.error('Erro ao converter a imagem para base64:', error);
        } finally {
            setIsLoading(false)
        }

    }, [user])

    
const downloadPDF = () => {
    const element = document.getElementById('area-carteira');
    if (element) {
        html2canvas(element,{scale: 3}).then((canvas) => {
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            const pdf = new jsPDF('portrait', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('carteira_aluno.pdf');
        });
    } else {
        console.error('Elemento não encontrado.');
    }
};

    useEffect(() => {

        const handleContratos = async () => {
            const response = await getUsers()
            setContratos(response.contratos)
            setModalidades(response.modalidades)

        }
        handleContratos();

    }, [])

    if (!user) {
        return null;
    }

    const contrato = contratos.filter(contrato => contrato.usuario_id === user.id)
    const modalidade = modalidades.filter(modalidade => modalidade.usuario_id === user.id)


    let nomeCompleto = user.nome;
    let partesNome = nomeCompleto.split(' ')
    let nome = partesNome.slice(0, 2).join(' ')

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
            <p className="ml-2">Carregando dados...</p>

        </div>
    }



    return (
        <ClientMain>
            <h1>Carteira do Aluno</h1>
            <section className="menuCarteira">
                <div className="area-carteira" id="area-carteira">
                    <Image src={logo} alt="" width={150} height={100}></Image>
                    <div className="dados-carteira">
                        <div className="foto-usuario-area">
                            <Image className="foto-usuario" src={imgData} alt="" width={150} height={150}></Image>
                        </div>
                        <div className="dados-usuario-area">
                            <div className="divDados">
                                <span>Nome:</span>
                                <p className="nome-usuario">{nome}</p>
                            </div>
                            <div className="divDados">
                                <span>Plano:</span>
                                {contrato.map(contrato => (
                                    <p className="nome-plano">{contrato.nome_plano}</p>
                                ))}
                            </div>
                            <div className="divDados">
                                <span>Modalidade:</span>
                                <div className="container-modalidades">
                                    {modalidade.map(modalidade => (

                                        <p className="nome-modalidade">{modalidade.nome_modalidade}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <button onClick={downloadPDF} className="btn-pdf">Download PDF</button>
            </section>
            
        </ClientMain>
    )
}

export default UserSession(carteiraAluno)