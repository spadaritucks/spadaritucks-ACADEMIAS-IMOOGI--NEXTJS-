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
import { createPlano, deletePlano, getPlanos, updatePlano } from '@/api/PlanosRequest';
import { useModal } from '@/components/errors/errorContext';
import { AdmMain } from "@/layouts/admin/layout"
import UserSession from '@/api/UserSession';
import { set } from "date-fns";
import { Contrato, getUsers } from "@/api/UsuariosRequest";
import { useUserEditModal } from "@/components/user-modals-edit/EditUserContext";

function Planos() {

    const [showCreate, setShowCreate] = useState<Boolean>(false);
    const [showUpdate, setShowUpdate] = useState<Boolean>(false);
    const [showRead, setShowRead] = useState<any[]>([]);
    const [userPlan, setUserPlan] = useState<Contrato[]>([])
    const [showDelete, setShowDelete] = useState<Boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [formErrors, setFormErros] = useState<{ [key: string] : string[]}>({})

    const formRef = useRef<HTMLFormElement>(null)
    const { modalServer} = useModal();
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
        try {
            const request = async () => {
                const response = await getPlanos()
                setShowRead(response)

                const responseUsers = await getUsers()
                setUserPlan(responseUsers.contratos);


            }

            request()
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (formRef.current) {
            const formdata = new FormData(formRef.current)
            
            const sendFormdata = async () => {
                const response = await createPlano(formdata)
                console.log(response)
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
        setIsLoading(true)
        handleShowRead()
    }

    const handleSubmitUpdate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (formRef.current) {
            const formdata = new FormData(formRef.current)
            const id = formdata.get('planos_id')
            formdata.append('_method', 'PUT')

            if (id) {
                const sendFormdata = async () => {
                    const response = await updatePlano(id, formdata)
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
        setIsLoading(true)
        handleShowRead()
    }

    const handleSubmitDelete = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (formRef.current) {
            const formdata = new FormData(formRef.current);
            const id = formdata.get('planos_id') as string;
            const idNumber = parseInt(id);

            const usuariosVinculados = userPlan.find(contrato => contrato.planos_id === idNumber);

            if (usuariosVinculados) {
                modalServer('Erro', 'Existem usuarios vinculados a esse plano');
                return;
            } else {
                showModal('Tem certeza que deseja deletar este plano?',
                    <>
                        <Button variant='imoogi' onClick={async () => {
                            if (id) {
                                const response: any = await deletePlano(id);
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
                <h1>Painel de Planos e Contratos</h1>
                <section className="painel-crud">
                    <div className="tabela-crud">
                        <Table>
                            <TableCaption>Lista de Planos e Contratos</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-center">Nome do Plano</TableHead>
                                    <TableHead>Duração(em meses)</TableHead>
                                    <TableHead>Matricula</TableHead>
                                    <TableHead>Valor Mensal</TableHead>
                                    <TableHead>Valor Total</TableHead>
                                    <TableHead>N°Modalidades</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Numero de Checkins</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {showRead.map(planos => (
                                    <TableRow key={planos.id}>
                                        <TableCell className="text-center">{planos.nome_plano}</TableCell>
                                        <TableCell>{planos.duracao > 1 ? planos.duracao + ' meses' : planos.duracao + ' mês'}</TableCell>
                                        <TableCell>{'R$' + planos.valor_matricula.replace('.', ',')}</TableCell>
                                        <TableCell>{'R$' + planos.valor_mensal.replace('.', ',')}</TableCell>
                                        <TableCell>{'R$' + planos.valor_total.replace('.', ',')}</TableCell>
                                        <TableCell>{planos.num_modalidades > 1 ? planos.num_modalidades + ' modalidades' : planos.num_modalidades + ' modalidade'}</TableCell>
                                        <TableCell>{planos.status}</TableCell>
                                        <TableCell>{planos.number_checkins}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="crud-operations">
                        <div className='crud-buttons'>
                            <Button variant="imoogi" onClick={handleShowCreate}>Criar Plano</Button>
                            <Button variant="imoogi" onClick={handleShowUpdate}>Atualizar Plano</Button>
                            <Button variant="imoogi" onClick={handleShowDelete}>Deletar Plano</Button>
                        </div>
                        <div className="crud-inputs">
                            {showCreate && <Create handleSubmit={handleSubmit} formRef={formRef} formErrors={formErrors}  />}
                            {showUpdate && <Update formErrors={formErrors} handleSubmitUpdate={handleSubmitUpdate} formRef={formRef} planos={showRead} />}
                            {showDelete && <Delete planos={showRead} handleSubmitDelete={handleSubmitDelete} formRef={formRef} />}

                        </div>

                    </div>
                </section>
            </>
        </AdmMain>

    )


}

export default UserSession(Planos)