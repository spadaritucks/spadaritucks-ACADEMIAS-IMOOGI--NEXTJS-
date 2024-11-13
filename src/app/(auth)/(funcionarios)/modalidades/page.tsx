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
import { createModalidade, deleteModalidade, getModalidade, updateModalidade } from '@/api/ModalidadesRequest';
import Image from 'next/image';
import { AdmMain } from "@/layouts/admin/layout"
import UserSession from '@/api/UserSession';
import modalidade from "@/app/modalidade/page";
import { Contrato, getUsers, UsuarioModalidade } from "@/api/UsuariosRequest";
import { useUserEditModal } from "@/components/user-modals-edit/EditUserContext";

function Modalidade() {

    const [showCreate, setShowCreate] = useState<Boolean>(false);
    const [showUpdate, setShowUpdate] = useState<Boolean>(false);
    const [showRead, setShowRead] = useState<any[]>([]);
    const [showDelete, setShowDelete] = useState<Boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [userModalidade, setUserModalidades] = useState<UsuarioModalidade[]>([])
    const [formErrors, setFormErros] = useState<{ [key: string]: string[] }>({})

  
    const { showModal, hideModal } = useUserEditModal();

    const formRef = useRef<HTMLFormElement>(null)
    const { modalServer } = useModal();

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
        setIsLoading(true);
        try {
            const request = async () => {
                const response = await getModalidade()
                setShowRead(response)

                const userResponse = await getUsers();
                setUserModalidades(userResponse.modalidades);

            }

            request()
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        handleShowRead()
    }, [])



    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()


        if (formRef.current) {
            const formdata = new FormData(formRef.current)
            const sendFormdata = async () => {
                const response = await createModalidade(formdata)

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
            const id = formdata.get('modalidade_id')
            formdata.append('_method', 'PUT')

            if (id) {
                const sendFormdata = async () => {
                    const response = await updateModalidade(id, formdata)
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

        showModal('Tem certeza que deseja deletar esta modalidade?',
            <>
                <Button variant='imoogi' onClick={async () => {
                    if (formRef.current) {
                        const formdata = new FormData(formRef.current);
                        const id = formdata.get('modalidade_id') as string;
                        const idNumber = parseInt(id);

                        const usuariosExistentes = userModalidade.find(modalidade => modalidade.modalidade_id === idNumber);

                        if (usuariosExistentes) {
                            modalServer("Erro", 'Já existem usuarios vinculados a essa modalidade');
                            return;
                        } else {
                            if (id) {
                                const response: any = await deleteModalidade(id);
                                modalServer('Sucesso', response);
                                console.log(response);
                            }
                        }
                    }
                    handleShowRead(); // Atualiza a lista após a deleção
                }}>Sim</Button>
                <Button variant='imoogi' type='button' onClick={() => {hideModal()}}>Não</Button>
            </>
        );
    }

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
                <h1>Painel de Modalidades</h1>
                <section className="painel-crud">
                    <div className="tabela-crud">
                        <Table>
                            <TableCaption>Lista de Modalidades</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Foto da Modalidade</TableHead>
                                    <TableHead>Nome da Modalidade</TableHead>
                                    <TableHead>Descrição da Modalidade</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {showRead.map(modalidades => (
                                    <TableRow key={modalidades.id}>
                                        <TableCell>
                                            <Image width={70} height={70} src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${modalidades.foto_modalidade}`} alt=""></Image>
                                        </TableCell>
                                        <TableCell>{modalidades.nome_modalidade}</TableCell>
                                        <TableCell>{modalidades.descricao_modalidade}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="crud-operations">
                        <div className='crud-buttons'>
                            <Button variant="imoogi" onClick={handleShowCreate}>Criar Modalidade</Button>
                            <Button variant="imoogi" onClick={handleShowUpdate}>Atualizar Modalidade</Button>
                            <Button variant="imoogi" onClick={handleShowDelete}>Deletar Modalidade</Button>
                        </div>
                        <div className="crud-inputs">
                            {showCreate && <Create formErrors={formErrors} handleSubmit={handleSubmit} formRef={formRef} />}
                            {showUpdate && <Update formErrors={formErrors} handleSubmitUpdate={handleSubmitUpdate} formRef={formRef} modalidades={showRead} />}
                            {showDelete && <Delete modalidades={showRead} handleSubmitDelete={handleSubmitDelete} formRef={formRef} />}
                        </div>
                    </div>
                </section>
            </>
        </AdmMain>
    )
}

export default UserSession(Modalidade)