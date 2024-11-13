'use client';
import '../../../../Assets/css/pages-styles/dashboard.css';
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
import { ModalEditUserProvider, useUserEditModal } from '@/components/user-modals-edit/EditUserContext';
import EditUserModal from '@/components/user-modals-edit/EditUserModal';
import { Dispatch, ReactNode, SetStateAction, useEffect, useRef, useState } from 'react';
import { Usuarios } from '../usuarios/usuarios';
import { Contratos } from '../usuarios/contratos';
import { Funcionario } from '../usuarios/funcionario';
import '../../../../Assets/css/pages-styles/forms.css'
import { Contrato, DadosFuncionario, deleteUser, getUsers, updateUser, updateUserModalidade, Usuario, UsuarioModalidade } from '@/api/UsuariosRequest';
import { DadosPessoais } from './DadosPessoais';
import { Informacoes } from './Informaçoes';
import { AdmMain } from "@/layouts/admin/layout"
import { Chart } from "react-google-charts";
import { getModalidade, Modalidade } from '@/api/ModalidadesRequest';
import UserSession from '@/api/UserSession';
import { getPacks, getPlanos, Packs, Plano } from '@/api/PlanosRequest';
import { useModal } from '@/components/errors/errorContext';
import Link from 'next/link';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getPagamentosMensais, PagamentoMensal, putPagamentosMensais } from '@/api/PagamentosRequest';
import useCPFMask from '@/hooks/CpfFormat';




const Dashboard = () => {
    return (
        <AdmMain>
            <DashboardContent />
        </AdmMain>
    );
};

export interface UserFormProps {
    selectType?: string;
    user: Usuario; // Assumindo que Usuario é a interface para os dados do usuário
    contrato?: Contrato;
    funcionario?: DadosFuncionario;
    modalidade?: UsuarioModalidade[];
    pack?: Packs;
    formRef: React.RefObject<HTMLFormElement>;
    handleSubmitUpdate: (e: React.FormEvent<HTMLFormElement>) => void;
}

interface UserModalidadesProp {
    modalidade: UsuarioModalidade[];
    handleSubmitUpdateModalidade: (e: React.FormEvent<HTMLFormElement>) => void;
    formRef: React.RefObject<HTMLFormElement>;
}


const DashboardContent = () => {
    const { showModal, hideModal } = useUserEditModal();
    const { modalServer } = useModal()
    const formRef = useRef<HTMLFormElement>(null);
    const [selectType, setSelectType] = useState<string>('');
    const [showContratos, setShowContratos] = useState<boolean>(false);
    const [showFuncionario, setShowFuncionario] = useState<boolean>(false);
    const [users, setUsers] = useState<Usuario[]>([]);
    const [contratos, setContratos] = useState<Contrato[]>([])
    const [userModalidade, setUserModalidade] = useState<UsuarioModalidade[]>([])
    const [funcionarios, setFuncionarios] = useState<DadosFuncionario[]>([])
    const [pagamentos, setPagamentos] = useState<PagamentoMensal[]>([])
    const [planos, setPlanos] = useState<Plano[]>([])
    const [packs, setPacks] = useState<Packs[]>([])

    const [search, setSearch] = useState<string>('')
    const [openDadosPessoais, setOpenDadosPessoais] = useState<boolean>(false)
    const [openInfo, setOpenInfo] = useState<boolean>(false);
    const [ativos, setAtivos] = useState<number>(0)
    const [renovacao, setRenovacao] = useState<number>(0)
    const [vencidos, setVencidos] = useState<number>(0)
    const [numAlunos, setNumAlunos] = useState<number>(0)
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [formErrors, setFormErros] = useState<{ [key: string]: string[] }>({})
    const { applyMaskToCPF } = useCPFMask();

    const getUsersFunction = async () => {
        setIsLoading(true);
        try {
            const response = await getUsers();
            const responsePacks = await getPacks();
            const responsePlanos = await getPlanos();
            const responsePagamentos = await getPagamentosMensais();
            setUsers(response.usuarios)
            setContratos(response.contratos)
            setUserModalidade(response.modalidades)
            setFuncionarios(response.funcionarios)
            setPacks(responsePacks)
            setPlanos(responsePlanos)
            setPagamentos(responsePagamentos)
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
            // Aqui você pode adicionar uma lógica para mostrar uma mensagem de erro
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getUsersFunction()
    }, [])

    const handleDadosPessoais = (id: number) => {
        setOpenDadosPessoais(true)
        setOpenInfo(false)
        const user = users.find(user => user.id === id);
        showModal('Dados Pessoais', <DadosPessoais user={user} />)
    }

    const handleInformacoes = (id: number) => {
        setOpenDadosPessoais(false)
        setOpenInfo(true)
        const contrato = contratos.find(contrato => contrato.usuario_id === id);
        const funcionario = funcionarios.find(funcionario => funcionario?.usuario_id === id)
        const modalidade = userModalidade.filter(modalidade => modalidade.usuario_id === id)
        const pack = packs.find(pack => pack.id === contrato?.packs_id);

        showModal('Informações do Usuario', <Informacoes pack={pack} contrato={contrato} funcionario={funcionario} modalidade={modalidade} />)
    }

    const handleEditClickWithType = (id: number, title: string) => {
        const user = users.find(user => user.id === id);
        const contrato = contratos.find(contrato => contrato.usuario_id === id)
        const modalidade = userModalidade.filter(modalidade => modalidade.usuario_id === id)
        const funcionario = funcionarios.find(funcionario => funcionario.usuario_id === id)
        const pack = packs.find(pack => pack.id === contrato?.packs_id);

        const handleSubmitUpdate = (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault()

            if (formRef.current) {
                const formdata = new FormData(formRef.current)
                const id = user?.id
                formdata.append('_method', 'PUT')

                if (id) {
                    const sendFormdata = async () => {
                        const response = await updateUser(id, formdata)
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
            }
            getUsersFunction()
        }

        if (user) {
            setSelectType(user.tipo_usuario);
            showModal(title, (
                <UserForm selectType={user.tipo_usuario} user={user} formRef={formRef} contrato={contrato} funcionario={funcionario}
                    modalidade={modalidade} handleSubmitUpdate={handleSubmitUpdate} pack={pack} />
            ));
        }
    }

    const handleUserModalidadeEdit = (id: number, title: string) => {
        const user = users.find(user => user.id === id)
        const modalidade = userModalidade.filter(modalidade => modalidade.usuario_id === id);

        const handleSubmitUpdateModalidade = (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault()

            if (formRef.current) {
                const formdata = new FormData(formRef.current)
                const id = user?.id
                console.log(formdata)
                formdata.append('_method', 'PUT')

                if (id) {
                    const sendFormdata = async () => {
                        const response = await updateUserModalidade(id, formdata);
                        if (typeof response === 'object' && response !== null) {
                            setFormErros(response.message)
                            console.log(formErrors)
                            modalServer("Erro", 'Preencha os campos necessarios!')
                            if (response.message) {
                                modalServer('Erro', response.message); // Certifique-se de que response.message é uma string
                            } else {
                                modalServer('Mensagem', response.message); // Mensagem padrão
                            }
                        } else {
                             modalServer('Erro', 'Resposta inesperada do servidor.');
                        }
                        console.log(formdata)
                    }
                    sendFormdata()
                }
            }
            getUsersFunction()
        }

        showModal(title, <ModalidadeUserForm modalidade={modalidade} handleSubmitUpdateModalidade={handleSubmitUpdateModalidade} formRef={formRef} />)
    }

    const handleDeleteButton = (id: number) => {
        showModal('Tem certeza que deseja deletar este usuário?',
            <>
                <Button variant='imoogi' onClick={async () => {
                    const response = await deleteUser(id);
                    modalServer('Sucesso', response);
                    getUsersFunction();
                    hideModal()
                }}>Sim</Button>
                <Button variant='imoogi' type='button' onClick={() => { hideModal() }}>Não</Button>
            </>
        );
    }

    const handleStatusUser = (id: number) => {
        const contrato = contratos.find(contrato => contrato.usuario_id === id);

        if (contrato) {
            const dataHoje = new Date();
            const data_vencimento = new Date(contrato.data_vencimento || '');

            const diffInTime = data_vencimento.getTime() - dataHoje.getTime();
            const dias = Math.ceil(diffInTime / (1000 * 3600 * 24));
            if (dias > 30) {
                return <p>{dias} dias restantes <br />Ativo</p>;
            } else if (dias <= 30 && dias > 0) {
                return <p>{dias} dias restantes <br />Renovação</p>;
            } else if (dias <= 0) {
                return <p>{dias} dias restantes <br />Vencido</p>;
            } else if (contrato.nome_plano === "Gympass") {
                return <p>Gympass</p>
            }
            else if (contrato.nome_plano === "Totalpass") {
                return <p>Totalpass</p>
            }

        } else {
            return 'Colaborador';
        }
    };

    const handleMensalidade = () => {


        const planosMensais = planos.filter(plano => Number(plano.duracao) === 1);


        if (planosMensais.length === 0) {
            return <p>Nenhum plano mensal disponível.</p>;
        }

        const contratosMensais = contratos.filter(contrato =>
            planosMensais.some(plano => plano.id === contrato.planos_id)
        );


        if (contratosMensais.length === 0) {
            return <p>Nenhum contrato mensal encontrado.</p>;
        }

        return contratosMensais.map((contrato) => {
            const user = users.find(user => user.id === contrato.usuario_id);
            const planoMensal = planosMensais.find(plano => plano.id === contrato.planos_id);
            const dataVencimento = new Date(contrato.data_vencimento || '');
            const dataAtual = new Date();
            const diffInTime = dataVencimento.getTime() - dataAtual.getTime();
            const dias = Math.ceil(diffInTime / (1000 * 3600 * 24));

            return (
                <div key={contrato.id} className={`mensal-container ${dias <= 10 ? 'bg-red-200' : 'bg-stone-50'}`}>
                    <p className='mensal-nome'>{user?.nome.split(' ').slice(0, 2).join(' ')}</p>
                    <Button variant='imoogi' onClick={() => modalAlunosMensais(planoMensal, dataVencimento, dias)}>Informações</Button>
                    <Button variant='imoogi'><Link className='text-white decoration-none' href={`https://wa.me/${user?.telefone}`}>Telefone</Link></Button>
                </div>
            );
        });



    };


    const modalAlunosMensais = (planoMensal: Plano | undefined, dataVencimento: Date, dias: number) => {
        showModal('Informações',
            <div className='alunos_mensais_info'>
                <p className='mensal-plano'>{planoMensal?.nome_plano || 'Plano não encontrado'}</p>
                <p className='mensal-vencimento'>Vence em {dataVencimento.toLocaleDateString()}</p>
                <p className='mensal-dias'>{dias} dias restantes</p>
            </div>
        );
    }


    const handlePlanosVencimento = () => {
        const planosFidelidade = planos.filter(plano => plano.duracao > 1)

        if (planosFidelidade.length === 0) {
            return <p>Nenhum plano fidelidade disponível.</p>
        }

        const dataAtual = new Date();
        const contratosFidelidade = contratos.filter(contrato => {
            const planoFidelidade = planosFidelidade.some(plano => plano.id === contrato.planos_id);
            const dataRenovacao = new Date(contrato.data_renovacao || '');
            const diffInTime = dataRenovacao.getTime() - dataAtual.getTime();
            const dias = Math.ceil(diffInTime / (1000 * 3600 * 24));
            return planoFidelidade && dias <= 30 && dias > 0;
        });

        if (contratosFidelidade.length === 0) {
            return <p>Nenhum contrato fidelidade próximo da renovação encontrado.</p>
        }

        return contratosFidelidade.map((contrato) => {
            const user = users.find(user => user.id === contrato.usuario_id);
            const planoFidelidade = planosFidelidade.find(plano => plano.id === contrato.planos_id);
            const dataRenovacao = new Date(contrato.data_renovacao || '');
            const diffInTime = dataRenovacao.getTime() - dataAtual.getTime();
            const dias = Math.ceil(diffInTime / (1000 * 3600 * 24));

            return (
                <div key={contrato.id} className="planosVencimento-container bg-yellow-200">
                    <p className='planosVencimento-nome'>{user?.nome.split(' ').slice(0, 2).join(' ')}</p>
                    <Button variant='imoogi' onClick={() => modalPlanosVencimento(planoFidelidade, dataRenovacao, dias)}>Informações</Button>
                    <Button variant='imoogi'><Link className='text-white decoration-none' href={`https://wa.me/${user?.telefone}`}>Telefone</Link></Button>
                </div>
            );
        });
    };

    const modalPlanosVencimento = (planoFidelidade: Plano | undefined, dataRenovacao: Date, dias: number) => {
        showModal('Informações',
            <div className='planosVencimento-info'>
                <p className='planosVencimento-plano'>{planoFidelidade?.nome_plano || 'Plano não encontrado'}</p>
                <p className='planosVencimento-vencimento'>Vence em {dataRenovacao.toLocaleDateString()}</p>
                <p className='planosVencimento-dias'>{dias} dias restantes</p>
            </div>
        );





    }

    const handleComprovantes = (id: number) => {
        const userPagamentos = pagamentos.filter(pagamento => pagamento.usuario_id === id)
        showModal('Comprovantes',
            <div>
                {userPagamentos.map(pagamento => (
                    <div key={pagamento.id} className='aluno-pagamentosModal'>
                        <Button variant='imoogi'><Link href={`${process.env.NEXT_PUBLIC_API_URL}/storage/${pagamento.comprovante}`}>Comprovante</Link></Button>

                        <p className="dado-pagamento m-4 text-center w-40 "> <span> Valor Pago </span> R$ {pagamento.valor_pago}</p>
                        <p className="dado-pagamento m-4 text-center w-40 "> <span>Data do Pagamento </span> {pagamento.data_pagamento}</p>
                        <p className="dado-pagamento m-4 text-center w-25 "><span>Comentario </span>{pagamento.comentario}  <Button variant='link' onClick={() => handleAddComentario(pagamento.id)}>Adicionar Comentario</Button></p>

                    </div>

                ))}
            </div>
        )
    }

    const handleAddComentario = (pagamento_id: number) => {
        showModal('Adicionar Comentario',
            <form onSubmit={handleSubmitComentario(pagamento_id)} ref={formRef}>
                <div className="form-name-input">
                    <span>Comentario sobre Pagamento</span>
                    <textarea name="comentario_adm" id="comentario_adm" rows={4} cols={25}></textarea>
                </div>

                <div className="form-name-input" style={{ gridColumn: '1 / -1' }}>
                    <button type='submit' className='submit-button'>Enviar</button>
                </div>
            </form>
        )
    }

    const handleSubmitComentario = (pagamento_id: number) => async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (formRef.current) {
            const formdata = new FormData(formRef.current);
            formdata.append('_method', 'PUT');

            try {
                const response = await putPagamentosMensais(pagamento_id, formdata);
                if (response) {
                    if (response.status == 'false') {
                        if (typeof response.message == 'object') {
                            modalServer('Erro', 'Preencha todos os campos')
                        } if (typeof response.message == 'string') {
                            modalServer('Erro', response.message)
                        }
                    } else {
                        console.log(pagamento_id)
                        console.log(formdata)
                        modalServer('Sucesso', response.message)
                    }

                }
                getUsersFunction();

            } catch (error) {
                console.error('Erro ao enviar comentário:', error);
            }
        }
    };

    const handleAlunoPass = () => {
        const contrato = contratos.filter(contrato => contrato.nome_plano === "Gympass" || contrato.nome_plano === "Totalpass");

        if (contrato.length > 0) {
            return contrato.map(contrato => {
                const user = users.filter(user => user.id === contrato.usuario_id);
                return user.map(user => (
                    <div className='aluno_beneficio' key={user.id}>
                        <p>{user.nome}</p>
                        <Button variant='imoogi'><Link className='text-white decoration-none' href={`https://wa.me/${user.telefone}`}>Telefone</Link></Button>
                        <p>{contrato.nome_plano}</p>
                    </div>
                ));
            });
        } else {
            return <p>Nenhum aluno com benefício encontrado</p>; // Retorna um JSX válido
        }
    };


    //Prenchimento dos Graficos
    useEffect(() => {
        let ativosCount = 0;
        let renovacaoCount = 0;
        let vencidosCount = 0;
        let alunosCount = 0
        let passCount = 0


        users.forEach((user) => {
            const contrato = contratos.find(contrato => contrato.usuario_id === user.id);
            const contratoGympass = contratos.find(contrato => contrato.usuario_id === user.id && contrato.nome_plano === 'Gympass')
            const contratoTotalpass = contratos.find(contrato => contrato.usuario_id === user.id && contrato.nome_plano === 'Totalpass')

            if (contrato) {
                const dataHoje = new Date();
                const data_renovacao = new Date(contrato.data_renovacao || '');

                if (!isNaN(data_renovacao.getTime())) {
                    const diffInTime = data_renovacao.getTime() - dataHoje.getTime();
                    const dias = Math.ceil(diffInTime / (1000 * 3600 * 24));

                    if (dias > 30) {
                        ativosCount++;
                    } else if (dias <= 30 && dias > 0) {
                        renovacaoCount++;
                    } else if (dias <= 0) {
                        vencidosCount++;
                    }

                }

                if (contratoGympass || contratoTotalpass) {
                    passCount++
                }


            }


        });

        setAtivos(ativosCount);
        setRenovacao(renovacaoCount);
        setVencidos(vencidosCount);
        alunosCount = ativosCount + renovacaoCount + passCount;

        setNumAlunos(alunosCount)

    }, [users, contratos]);

    function charts() {
        const dataBars = [
            ["Indice", "Planos Ativos", "Planos Renovação", "Planos Vencidos"],
            ["Planos", ativos, renovacao, vencidos],
        ];

        const dataPie = [
            ["Planos", "Porcentagem"],
            ["Planos Ativos", ativos],
            ["Planos Renovação", renovacao],
            ["Planos Vencidos", vencidos],
        ];

        const optionsPie = {
            title: "Porcentagem Realidade Alunos",
        };

        const optionsBars = {
            chart: {
                title: "ACADEMIAS IMOOGI",
                subtitle: "Realidade de Alunos",
            },
        };
        return (
            <>
                <div className="chart-container">
                    <Chart
                        chartType="Bar"
                        width="350px"
                        height="350px"
                        data={dataBars}
                        options={optionsBars} />
                </div>
                <div className="chart-container">
                    <Chart
                        chartType="PieChart"
                        data={dataPie}
                        options={optionsPie}
                        width={"400px"}
                        height={"400px"} />
                </div>
            </>
        );
    }

    useEffect(() => {
        setShowContratos(selectType === 'aluno');
        setShowFuncionario(selectType === 'funcionario');
    }, [selectType]);

    const filteredUsers = users.filter(user =>
        user.nome.toLowerCase().includes(search.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
                <p className="ml-2">Carregando dados...</p>
            </div>
        );
    }

    return (
        <section className="dashboard">
            <div className="usuarios-list">
                <div className="painel">
                    <h2>Painel de Usuarios</h2>
                    <div className='search-bar-area'>
                        <span>Pesquisar</span>
                        <input type="text" placeholder="Pesquisar" className="search-input" onChange={(e) => setSearch(e.target.value)} />
                    </div>
                    <div className="user-container alunos">
                        <Table>
                            <TableCaption>Lista de usuários</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-center">ID</TableHead>
                                    <TableHead className="text-center">Nome do Aluno</TableHead>
                                    <TableHead className="text-center">Tipo do Usuario</TableHead>
                                    <TableHead className="text-center">Ações</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map(user => (
                                    <TableRow key={user.id}>
                                        <TableCell className="text-center">{user.id}</TableCell>
                                        <TableCell className="text-center">{user.nome}</TableCell>
                                        <TableCell className="text-center">{user.tipo_usuario}</TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex justify-center space-x-2">
                                                <>
                                                    {user.tipo_usuario === 'aluno' && pagamentos.find(pagamento => pagamento.usuario_id === user.id) && (
                                                        <Button variant='imoogi' onClick={() => handleComprovantes(user.id)}>Comprovantes</Button>
                                                    )}
                                                    <DropdownMenu>

                                                        <DropdownMenuTrigger><Button variant='imoogi'>Ações</Button></DropdownMenuTrigger>
                                                        <DropdownMenuContent>
                                                            <DropdownMenuItem onClick={() => handleDadosPessoais(user.id)}>Dados Pessoais</DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleInformacoes(user.id)}>Informações</DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleEditClickWithType(user.id, 'Editar Usuarios')}>Editar</DropdownMenuItem>
                                                            {user.tipo_usuario === 'aluno' && (
                                                                <DropdownMenuItem onClick={() => handleUserModalidadeEdit(user.id, 'Modalidade Vinculadas')}>Modalidades</DropdownMenuItem>
                                                            )}

                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                    <Button variant='imoogi' onClick={() => handleDeleteButton(user.id)}>Excluir</Button>
                                                </>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">{handleStatusUser(user.id)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            <div className='charts-area'>
                {charts()}
                <div className='chart-container'>
                    <span>Numero de Alunos</span>
                    <p className='number-alunos'>{numAlunos}</p>
                </div>
            </div>

            <div className='dadosPlanosAlunos'>
                <div className='mensal-area'>
                    <h2>Alunos Mensalistas</h2>
                    <div className='mensal-list'>
                        {handleMensalidade()}
                    </div>

                </div>

                <div className='planosVencimentoArea'>
                    <h2>Planos em Renovação</h2>
                    <div className='planosVencimentoList'>
                        {handlePlanosVencimento()}
                    </div>
                </div>

                <div className='alunosGympassTotalpass'>
                    <h2>Gympass & Totalpass</h2>
                    <div className='alunosGympassTotalpassList'>
                        {handleAlunoPass()}
                    </div>
                </div>
            </div>
        </section>
    );

};

const UserForm = ({ selectType, user, contrato, modalidade, funcionario, pack, formRef, handleSubmitUpdate }: UserFormProps) => {
    const { applyMaskToCPF } = useCPFMask();
    
    const handleInputClick = () => {
        if (user && formRef?.current) {
            const form = formRef.current;
            

            (form['tipo_usuario'] as HTMLSelectElement).value = user.tipo_usuario.toString();
            (form['nome'] as HTMLInputElement).value = user.nome.toString();
            (form['email'] as HTMLInputElement).value = user.email.toString();
            (form['data_nascimento'] as HTMLInputElement).value = user.data_nascimento.toString();
            (form['cpf'] as HTMLInputElement).value = applyMaskToCPF(user.cpf.toString());
            (form['rg'] as HTMLInputElement).value = user.rg.toString();
            (form['telefone'] as HTMLInputElement).value = user.telefone.toString();
            (form['cep'] as HTMLInputElement).value = user.cep.toString();
            (form['logradouro'] as HTMLInputElement).value = user.logradouro.toString();
            (form['numero'] as HTMLInputElement).value = user.numero.toString();
            user.complemento ? (form['complemento'] as HTMLInputElement).value = user.complemento.toString() : ''
            if (contrato && modalidade) {
                (form['planos_id'] as HTMLSelectElement).value = contrato.planos_id.toString();
                { pack ? (form['packs_id'] as HTMLSelectElement).value = contrato.packs_id.toString() : '' }
                { contrato.data_inicio ? (form['data_inicio'] as HTMLInputElement).value = contrato.data_inicio.toString() : '' }
                { contrato.data_renovacao ? (form['data_renovacao'] as HTMLInputElement).value = contrato.data_renovacao.toString() : "" }
                { contrato.data_vencimento ? (form['data_vencimento'] as HTMLInputElement).value = contrato.data_vencimento.toString() : "" }
                { contrato.valor_plano ? (form['valor_plano'] as HTMLInputElement).value = contrato.valor_plano.toString().replace('.', ',') : "" }
                { contrato.desconto ? (form['desconto'] as HTMLInputElement).value = contrato.desconto.toString().replace('.', ',') : '' }
                { contrato.parcelas ? (form['parcelas'] as HTMLInputElement).value = contrato.parcelas.toString() : "" }
                (form['observacoes'] as HTMLInputElement).value = contrato.observacoes.toString();
            }
            if (funcionario) {
                (form['tipo_funcionario'] as HTMLSelectElement).value = funcionario.tipo_funcionario.toString();
                (form['cargo'] as HTMLInputElement).value = funcionario.cargo.toString();
                (form['atividades'] as HTMLInputElement).value = funcionario.atividades.toString();
            }

        }
    }

    useEffect(() => {
        handleInputClick();
    }, [user, contrato, modalidade, funcionario])



    return (
        <form className="register-form" ref={formRef} onSubmit={handleSubmitUpdate}>
            <div className="form-component">
                <Usuarios handleInputClick={handleInputClick} formRef={formRef} user={user} contrato={contrato} modalidade={modalidade}
                    funcionario={funcionario} /> {/* Manter aqui apenas se necessário */}
            </div>
            <div className="form-component">
                {selectType === 'aluno' && <Contratos user={user} modalidade={modalidade} handleInputClick={handleInputClick} contrato={contrato} />}
                {selectType === 'funcionario' && <Funcionario />}
            </div>
            <div className="form-name-input" style={{ gridColumn: '1 / -1' }}>
                <button type='submit' className='submit-button'>Enviar</button>
            </div>
        </form>
    );
}

const ModalidadeUserForm = ({ modalidade, handleSubmitUpdateModalidade, formRef }: UserModalidadesProp) => {

    const [modalidades, setModalidades] = useState<Modalidade[]>([])
    const [inputModalidadeState, setInputModalidadeState] = useState<boolean>(false)
    const [secondInputModalidadeState, setSecondInputModalidadeState] = useState<boolean>(false)


    const toogleInputModalidade = () => {
        setInputModalidadeState(prevState => !prevState);
    }

    const toogleSecondInputModalidade = () => {
        setSecondInputModalidadeState(!secondInputModalidadeState)
    }


    useEffect(() => {
        const fetchModalidades = async () => {
            try {
                const modalidades = await getModalidade();
                setModalidades(modalidades);
            } catch (error) {
                console.error('Failed to fetch modalidades:', error);
            }
        };
        fetchModalidades()
    })

    return (
        <>
            <form className="register-form" onSubmit={handleSubmitUpdateModalidade} ref={formRef} >
                <div className="form-component" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                    <div className="form-name-input">
                        <span>Modalidade 1</span>
                        <select name="modalidade_id[]" id="modalidade_id" >
                            <option value="" >Selecione</option>
                            {modalidades.map((modalidade) => (
                                <option value={modalidade.id}>
                                    {modalidade.nome_modalidade}
                                </option>
                            ))}
                        </select>
                        <button type='button' className='insertMoreOne' onClick={toogleInputModalidade}> + 1 Modalidade</button>
                    </div>
                    <div className={`form-name-input modalidadeForm ${inputModalidadeState ? `flex` : 'none'}`} >
                        <span>Modalidade 2</span>
                        <select name="modalidade_id[]" id="modalidade_id" disabled={!inputModalidadeState}>
                            <option value="" >Selecione</option>
                            {modalidades.map((modalidade) => (
                                <option value={modalidade.id}>
                                    {modalidade.nome_modalidade}
                                </option>
                            ))}
                        </select>
                        <button type='button' className='insertMoreOne' onClick={toogleSecondInputModalidade}> + 1 Modalidade</button>
                    </div>
                    <div className={`form-name-input modalidadeForm ${secondInputModalidadeState ? `flex` : 'none'}`} >
                        <span>Modalidade 3</span>
                        <select name="modalidade_id[]" id="modalidade_id" disabled={!secondInputModalidadeState}>
                            <option value="" >Selecione</option>
                            {modalidades.map((modalidade) => (
                                <option value={modalidade.id}>
                                    {modalidade.nome_modalidade}
                                </option>
                            ))}
                        </select>
                    </div>

                </div>
                <div className="form-name-input" style={{ gridColumn: '1 / -1' }}>
                    <button type='submit' className='submit-button'>Enviar</button>
                </div>
            </form>
        </>
    )

}





export default UserSession(Dashboard);