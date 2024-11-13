'use client'
import {
    Table,
    TableContainer,
} from '@chakra-ui/react'
import { AdmMain } from "@/layouts/admin/layout"
import '@/Assets/css/pages-styles/aulas.css'
import { useEffect, useRef, useState } from 'react';
import { Aula, createAula, deleteAula, getAulas } from '@/api/AulasRequest';
import '../../../../Assets/css/pages-styles/crud.css'
import { useModal } from '@/components/errors/errorContext';
import '../../../../Assets/css/pages-styles/dashboard.css'
import Create from './create';
import UserSession from '@/api/UserSession';
import { format, addWeeks, startOfWeek, endOfWeek, parseISO, isSameWeek, isBefore, isAfter, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { ModalEditUserProvider, useUserEditModal } from '@/components/user-modals-edit/EditUserContext';
import { getUsers, Usuario } from '@/api/UsuariosRequest';
import { getReservas, Reserva } from '@/api/ReservasRequest';

// Definindo a ordem dos dias da semana
const diasDaSemana = ['Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado', 'Domingo'];

// Função para converter horários no formato "HH:MM" para minutos desde a meia-noite
const convertToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};


const generateKey = (modalidade_id: number, horario: string, dia_semana: string, data: string) => {
    return `${modalidade_id}-${horario}-${dia_semana}-${data}`
}



function Aulas() {

    return (
        <AdmMain>
            <AulasContent />
        </AdmMain>
    )

}

const AulasContent = () => {
    const { showModal, hideModal } = useUserEditModal();
    const [aulas, setAulas] = useState<Aula[]>([]);
    const [users, setUsers] = useState<Usuario[]>([])
    const [reservas, setReservas] = useState<Reserva[]>([])
    const formRef = useRef<HTMLFormElement>(null);
    const { modalServer } = useModal();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [semanaAtual, setSemanaAtual] = useState(new Date());
    const [reservasPorAula, setReservasPorAula] = useState<{ [key: string]: number }>({});
    const [formErrors, setFormErros] = useState<{ [key: string] : string[]}>({});
    


    useEffect(() => {
        setIsLoading(true)
        try {
            const fetchAulas = async () => {
                const inicio = startOfWeek(semanaAtual, { weekStartsOn: 1 }); // Começar na segunda-feira
                const fim = endOfWeek(semanaAtual, { weekStartsOn: 1 }); // Terminar no domingo
                const response = await getAulas(format(inicio, 'yyyy-MM-dd'), format(fim, 'yyyy-MM-dd'));

                // Filtrar e ordenar as aulas
                const aulasRelevantes = response.filter((aula: Aula) => {
                    const dataInicio = parseISO(aula.data_inicio);
                    const dataFim = parseISO(aula.data_fim);
                    return dataInicio <= fim && dataFim >= inicio;
                }).sort((a: Aula, b: Aula) => {
                    const diaA = diasDaSemana.indexOf(format(parseISO(a.data_inicio), 'EEEE', { locale: ptBR }));
                    const diaB = diasDaSemana.indexOf(format(parseISO(b.data_inicio), 'EEEE', { locale: ptBR }));

                    if (diaA === diaB) {
                        return convertToMinutes(a.horario) - convertToMinutes(b.horario);
                    }
                    return diaA - diaB;
                });

                setAulas(aulasRelevantes);
            };

            fetchAulas();


        } catch (error) {
            console.error("Erro ao carregar dados:", error);
        } finally {
            setIsLoading(false)
        }
    }, [semanaAtual]);

    useEffect(() => {

        const fetchUsers = async () => {

            const responseUsers = await getUsers();
            setUsers(responseUsers.usuarios)
        }

        const fetchReservas = async () => {
            try {
                const reservasResponse = await getReservas();
                setReservas(reservasResponse);

                // Contagem de reservas para cada aula ao carregar a página
                const reservasContadas: { [key: string]: number } = {};

                reservasResponse.forEach((reserva: Reserva) => {
                    const diaSemanaNumero = diasDaSemana.indexOf(reserva.dia_semana);
                    const aulaKey = generateKey(reserva.modalidade_id, reserva.horario, diaSemanaNumero.toString(), reserva.data);

                    if (!reservasContadas[aulaKey]) {
                        reservasContadas[aulaKey] = 0;
                    }
                    reservasContadas[aulaKey]++;

                  
                });

                setReservasPorAula(reservasContadas); // Atualiza o estado com as reservas carregadas do back-end

            } catch (error) {
                console.log("Erro ao carregar reservas", error);
            }
        };
       
        



        fetchUsers()
        fetchReservas()

    }, [])



    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (formRef.current) {
            const formdata = new FormData(formRef.current)
            const diasSemana = Array.from(formdata.getAll('dia_semana')).join(',');
            formdata.delete('dia_semana');
            formdata.append('dia_semana', diasSemana);

            const response = await createAula(formdata)

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
    }

    const handleSubmitDelete = (id: number) => {
    

        showModal('Tem certeza que deseja deletar esta aula?',
            <>
                <Button variant='imoogi' onClick={async () => {
                    if (formRef.current) {
                        const formdata = new FormData(formRef.current);
                        const id = formdata.get('aula_id') as string;
                        if (id) {
                            const response: any = await deleteAula(Number(id));
                            modalServer('Sucesso', response);
                        }
                    }
                    hideModal()
                }}>Sim</Button>
                <Button variant='imoogi' type='button' onClick={() => { hideModal() }}>Não</Button>
            </>
        );
    }

    // Função para verificar se a aula ocorre em um determinado dia
    const aulaOcorreNoDia = (aula: Aula, diaSemana: string) => {
        const dataInicio = parseISO(aula.data_inicio);
        const dataFim = parseISO(aula.data_fim);
        const diaAtual = diasDaSemana.indexOf(diaSemana);
        const diasAula = aula.dia_semana.split(',').map(Number);

        return diasAula.includes(diaAtual) &&
            dataInicio <= endOfWeek(semanaAtual, { weekStartsOn: 1 }) &&
            dataFim >= startOfWeek(semanaAtual, { weekStartsOn: 1 });
    };

    // Agrupando as aulas por dia da semana
    const aulasPorDia = diasDaSemana.map((dia, index) => {
        const dataCorrespondente = format(addDays(startOfWeek(semanaAtual, { weekStartsOn: 1 }), index), 'yyyy-MM-dd'); // Calcular a data a partir do início da semana
        return {
            dia,
            aulas: aulas.filter(aula => aulaOcorreNoDia(aula, dia)),
            dataCorrespondente
        };
    });

    const modalAlunosAulas = (modalidade_id: number, horario: string, dia_semana: string, dataCorrespondente: string) => {
        const indexDiaSemana = diasDaSemana.indexOf(dia_semana)
        const aulaKey = generateKey(modalidade_id, horario, indexDiaSemana.toString(), dataCorrespondente)

        const alunosDaAula = reservas.filter(reserva => reserva.modalidade_id === modalidade_id &&
                                                        reserva.horario === horario && 
                                                        reserva.dia_semana === indexDiaSemana.toString() && 
                                                        reserva.data === dataCorrespondente
        );

        showModal('Presença na Aula',
            <div className="alunos-container" key={aulaKey}>
                {alunosDaAula.map((reserva, index) => {
                    console.log(users)
                    const usersReserva = users.filter(user => user.id == reserva.usuario_id)

                    {
                        return usersReserva ? (
                            usersReserva.map(user => (
                                <div className='aluno' key={user.id}>
                                    <p>{user.nome}</p>
                                </div>
                            )

                            )
                        ) : <p>Não há alunos nessa aula</p>
                    }


                })}

            </div>
        )
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

        <section className='aulas-menu'>
            <h1>Gerenciamento de Aulas</h1>
            <div className='buttons-datas'>
                <Button variant='imoogi' onClick={() => setSemanaAtual(addWeeks(semanaAtual, -1))}>Semana Anterior</Button>
                <span>{format(semanaAtual, "'Semana de' dd 'de' MMMM", { locale: ptBR })}</span>
                <Button variant='imoogi' onClick={() => setSemanaAtual(addWeeks(semanaAtual, 1))}>Próxima Semana</Button>
            </div>
            <div className='gerenciamento-aulas'>
                <div className='aulas-list'>
                    {aulasPorDia.map(({ dia, aulas }) => (
                        <div className='aulas-area' key={dia}>
                            <h2>{dia}</h2>
                            {aulas.length > 0 ? aulas.map(aula => (
                                <div className='aula-component' key={aula.id}>
                                    <h3 className='modalidade_aula' style={{ margin: '0 5px' }}>{aula.nome_modalidade}</h3>
                                    <p className='horario' style={{ margin: '0 5px' }}>{aula.horario.substring(0, 5)}</p>
                                    <p className='limites_alunos' style={{ margin: '0 5px' }}>Limite: {aula.limite_alunos} Alunos</p>

                                </div>
                            )) : <p>Nenhuma Aula Encontrada</p>}
                        </div>
                    ))}

                </div>
                <div className='aulas-create'>
                    <Create formErrors={formErrors} diasDaSemana={diasDaSemana} handleSubmit={handleSubmit} formRef={formRef} />
                </div>
            </div>

            <h1>Grade de Aulas</h1>
        
                <div className='grade-aulas'>
                    <div className='aulas-container'>
                        {aulasPorDia.map(({ dia, aulas, dataCorrespondente }) => {
                           


                            return (
                                <div className='coluna-aulas' key={dia}>
                                    <h2 className='dia_semana'>{dia} - {dataCorrespondente}</h2>
                                    <div className='aulas-lista'>
                                        {aulas.length > 0 ? aulas.map(aula => {
                                            const diaSemana = diasDaSemana.indexOf(dia); // Converte a string 'dia' para o número correspondente
                                            const reservaDiadaSemana = reservas.find(reserva =>
                                                reserva.modalidade_id === aula.modalidade_id &&
                                                reserva.horario === aula.horario &&
                                                reserva.dia_semana === diaSemana.toString()  &&
                                                reserva.data === dataCorrespondente
                                            

                                            );

                                           
                                            
                                                const diaSemanaNumero = reservaDiadaSemana ? diasDaSemana.indexOf(reservaDiadaSemana.dia_semana) : -1; 
                                                const aulaKey = generateKey(aula.modalidade_id, aula.horario, diaSemanaNumero.toString(), dataCorrespondente);
                                                console.log(aulaKey)
                                                return (
                                                    <div className='aula' key={aulaKey}>
                                                        <h3 className='modalidade_aula'>{aula.nome_modalidade}</h3>
                                                        <p className='horario'>{aula.horario.substring(0, 5)}</p>
                                                        <Button variant='default' onClick={() => modalAlunosAulas(aula.modalidade_id, aula.horario, dia, dataCorrespondente)}>Alunos</Button>
                                                        {reservasPorAula[aulaKey] || 0}/{aula.limite_alunos}
                                                        <Button variant='destructive' onClick={() => handleSubmitDelete(aula.id)}>Excluir</Button>
                                                    </div>
                                                );
                                            }
                                        ) : <p>Nenhuma Aula</p>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
        </section>
        
    );

    


}


export default UserSession(Aulas);