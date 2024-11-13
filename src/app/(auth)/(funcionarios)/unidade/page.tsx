'use client'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useEffect, useRef, useState } from 'react';
import '../../../../Assets/css/pages-styles/dashboard.css'
import '../../../../Assets/css/pages-styles/crud.css'
import Create from './create';
import Update from './update';
import Delete from './delete';
import { useModal } from '@/components/errors/errorContext';
import Image from 'next/image';
import { createUnidade, deleteUnidade, getUnidades, updateUnidade } from '@/api/UnidadesRequest';
import Link from 'next/link';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { AdmMain } from "@/layouts/admin/layout"
import UserSession from '@/api/UserSession';
import { useUserEditModal } from "@/components/user-modals-edit/EditUserContext";

function Unidades() {

    const [showCreate, setShowCreate] = useState<Boolean>(false);
    const [showUpdate, setShowUpdate] = useState<Boolean>(false);
    const [showRead, setShowRead] = useState<any[]>([]);
    const [showDelete, setShowDelete] = useState<Boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const formRef = useRef<HTMLFormElement>(null)
    const [formErrors, setFormErros] = useState<{ [key: string] : string[]}>({})
    const { modalServer } = useModal();
    const { showModal, hideModal } = useUserEditModal();

    const handleShowCreate = () => {
        setShowCreate(!showCreate)
        setShowUpdate(false)
        setShowDelete(false)
    }

    const handleShowUpdate = () => {
        setShowUpdate(!showUpdate)
        setShowCreate(false)
        setShowDelete(false)
    }

    const handleShowDelete = () => {
        setShowDelete(!showDelete)
        setShowCreate(false)
        setShowUpdate(false)
    }

    const handleShowRead = () => {

      setIsLoading(true)
      try{
        const request = async () => {
            const response = await getUnidades()
            setShowRead(response)

        }

        request()
      }catch(error){
        console.log(error)
      }finally{
        setIsLoading(false)
      }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (formRef.current) {
            const formdata = new FormData(formRef.current)
            const sendFormdata = async () => {
                const response = await createUnidade(formdata)
                if (response) {
                    
                    if (response.status === 'false') {
                        if (typeof response.message === 'object') {
                            
                            setFormErros(response.message)
                            console.log(formErrors)
                            modalServer("Erro", 'Preencha os campos necessarios!')
                          
                        } else {
                            modalServer("Erro", response.message)
                        }
                    } else {
                        modalServer("Sucesso", response.message)
                    }
                }
            }

            sendFormdata()
        }
        handleShowRead()
    }

    const handleSubmitUpdate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (formRef.current) {
            const formdata = new FormData(formRef.current)
            const id = formdata.get('unidade_id')
            formdata.append('_method', 'PUT')

            if (id) {
                const sendFormdata = async () => {
                    const response= await updateUnidade(id, formdata)
                    if (response) {
                    
                        if (response.status === 'false') {
                            if (typeof response.message === 'object') {
                                
                                setFormErros(response.message)
                                console.log(formErrors)
                                modalServer("Erro", 'Preencha os campos necessarios!')
                              
                            } else {
                                modalServer("Erro", response.message)
                            }
                        } else {
                            modalServer("Erro", response.message)
                        }
                    }
                }
                sendFormdata()
            }


        }
        handleShowRead()
    }

    const handleSubmitDelete = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (formRef.current) {
            const formdata = new FormData(formRef.current);
            const id = formdata.get('unidade_id');

            showModal('Tem certeza que deseja deletar esta unidade?',
                <>
                    <Button variant='imoogi' onClick={async () => {
                        if (id) {
                            const response: any = await deleteUnidade(id);
                            modalServer('Sucesso', response);
                        }
                        handleShowRead(); // Atualiza a lista após a deleção
                        hideModal()
                    }}>Sim</Button>
                    <Button variant='imoogi' type='button' onClick={() => { hideModal() }}>Não</Button>
                </>
            );
        }
    }



    useEffect(() => {
        handleShowRead()
    }, [])

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
                <p className="ml-2">Carregando dados...</p>
            </div>
        )
    }

    return (
        <AdmMain>
            <>
                <h1>Painel de Unidades</h1>
                <section className="painel-crud">
                    <div className="tabela-crud">
                        <Table>
                            <TableCaption>Lista de Unidades</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Foto da Unidade</TableHead>
                                    <TableHead>Nome da Unidade</TableHead>
                                    <TableHead>Endereço</TableHead>
                                    <TableHead>Grade Horaria</TableHead>
                                    <TableHead>Descrição da Unidade</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {showRead.map(unidade => (
                                    <TableRow key={unidade.id}>
                                        <TableCell>
                                            <Image width={70} height={70} src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${unidade.imagem_unidade}`} alt=""></Image></TableCell>
                                        <TableCell>{unidade.nome_unidade}</TableCell>
                                        <TableCell>{unidade.endereco}</TableCell>
                                        <TableCell>
                                            <Link href={`${process.env.NEXT_PUBLIC_API_URL}/storage/${unidade.grade}`}>
                                                <div className='pdf-link' ><PictureAsPdfIcon /> PDF GRADE HORARIA</div></Link>
                                        </TableCell>
                                        <TableCell>{unidade.descricao}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="crud-operations">
                        <div className='crud-buttons'>
                            <Button variant="imoogi" onClick={handleShowCreate}>Criar Unidade</Button>
                            <Button variant="imoogi" onClick={handleShowUpdate}>Atualizar Unidade</Button>
                            <Button variant="imoogi" onClick={handleShowDelete}>Deletar Unidade</Button>
                        </div>
                        <div className="crud-inputs">
                            {showCreate && <Create formErrors={formErrors} handleSubmit={handleSubmit} formRef={formRef} />}
                            {showUpdate && <Update formErrors={formErrors} handleSubmitUpdate={handleSubmitUpdate} formRef={formRef} unidades={showRead} />}
                            {showDelete && <Delete unidades={showRead} handleSubmitDelete={handleSubmitDelete} formRef={formRef} />}

                        </div>

                    </div>
                </section>
            </>
        </AdmMain>
    )


}

export default UserSession(Unidades)