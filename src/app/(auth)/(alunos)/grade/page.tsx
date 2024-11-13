"use client"

import { ClientMain } from "@/layouts/client/layout"
import { FC, useEffect, useState } from "react";
import { Aula, getAulas } from "@/api/AulasRequest";
import '@/Assets/css/pages-styles/aulas.css'
import { createReservas, deleteReserva, getReservas, Reserva } from "@/api/ReservasRequest";
import UserSession from "@/api/UserSession";
import { useModal } from "@/components/errors/errorContext";
import { Contrato, getUsers, Usuario, UsuarioModalidade } from "@/api/UsuariosRequest";
import { format, addWeeks, startOfWeek, endOfWeek, parseISO, isSameWeek, isBefore, isAfter, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';

// Definindo a ordem dos dias da semana
const diasDaSemana = ['Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado', 'Domingo'];

// Função para converter horários no formato "HH:MM" para minutos desde a meia-noite
const convertToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};

// Função para gerar uma chave única para cada aula
const generateKey = (modalidade_id: number, horario: string, dia_semana: string, data: string) => {
    return `${modalidade_id}-${horario}-${dia_semana}-${data}`;
};

function GradeReservas() {
    const [aulas, setAulas] = useState<Aula[]>([]);
    const [reservasPorAula, setReservasPorAula] = useState<{ [key: string]: number }>({});
    const [reservas, setReservas] = useState<Reserva[]>([])
    const { modalServer } = useModal();
    const [userModalidades, setUserModalidades] = useState<UsuarioModalidade[]>([])
    const [contratos, setContratos] = useState<Contrato[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [semanaAtual, setSemanaAtual] = useState(new Date());
    const [dataAula, setDataAula] = useState<string>();
    const [user, setUser] = useState<Usuario>();


    useEffect(() => {
        const userResponse = sessionStorage.getItem('user');
        if (userResponse) {
            setUser(JSON.parse(userResponse));
        }
    }, [])


    useEffect(() => {
        setIsLoading(true)
        try {
            const fetchAulas = async () => {
                const inicio = startOfWeek(semanaAtual, { weekStartsOn: 1 });
                const fim = endOfWeek(semanaAtual, { weekStartsOn: 1 });
                const response = await getAulas(format(inicio, 'yyyy-MM-dd'), format(fim, 'yyyy-MM-dd'));
                const userResponse = await getUsers();

                // Filtrar apenas as aulas da semana atual
                const aulasDaSemana = response.filter((aula: Aula) => {
                    const dataInicio = parseISO(aula.data_inicio);
                    const dataFim = parseISO(aula.data_fim);
                    return dataInicio <= fim && dataFim >= inicio;
                });

                //Verificação das Modalidades Vinculadas
                const modalidadesVinculadas = userResponse.modalidades.filter(
                    (modalidade: UsuarioModalidade) => modalidade.usuario_id === user?.id
                );
                setUserModalidades(modalidadesVinculadas);

                const modalidadeIds = modalidadesVinculadas.map((modalidade: UsuarioModalidade) => modalidade.modalidade_id);

                const filteredAulas = aulasDaSemana.filter((aula: Aula) =>
                    modalidadeIds.includes(aula.modalidade_id)
                );

                //Hook contendo os contratos para verificação
                setContratos(userResponse.contratos);

                // Ordena as aulas por dia da semana e horário
                const sortedAulas = filteredAulas.sort((a: Aula, b: Aula) => {
                    const diaA = diasDaSemana.indexOf(a.dia_semana);
                    const diaB = diasDaSemana.indexOf(b.dia_semana);

                    if (diaA === diaB) {
                        return convertToMinutes(a.horario) - convertToMinutes(b.horario);
                    }
                    return diaA - diaB;
                });

                setAulas(sortedAulas);
            };

            fetchAulas();

        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }, [semanaAtual, user]);

    useEffect(() => {
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
        fetchReservas();
    }, [])

    const clickReserva = async (modalidade_id: number, horario: string, dia_semana: string, limite_alunos: number, dataCorrespondente: string) => {
        if (!user) return;
        const dia_semanaIndex = diasDaSemana.indexOf(dia_semana)
        const aulaKey = generateKey(modalidade_id, horario, dia_semanaIndex.toString(), dataCorrespondente);
        const reservasAtual = reservasPorAula[aulaKey] || 0;

        const reservaExistente = reservas.find(reserva => reserva.usuario_id === user.id
                                              && reserva.modalidade_id === modalidade_id
                                              && reserva.horario === horario
                                              && reserva.dia_semana === dia_semanaIndex.toString()
                                              && reserva.data === dataCorrespondente
        )
        console.log(reservaExistente)
        if(reservaExistente){
            const reservaKey = generateKey(reservaExistente.modalidade_id, reservaExistente.horario, reservaExistente.dia_semana, reservaExistente.data)
            console.log(aulaKey, reservaKey)
            
            if(reservaKey === aulaKey){
                modalServer('Erro', 'Você já reservou essa aula!')
                return
            }
        }
        

        // Verifica se o limite de alunos foi atingido
        if (reservasAtual >= limite_alunos) {
            modalServer('Erro', 'O limite de alunos para esta aula já foi atingido.');
            return;
        }


        if(dataCorrespondente < new Date().toISOString()){
            modalServer('Erro', 'Você não pode reservar aulas passadas!')
            return
        }

        

        



        //Verificação se o Plano esta em vigor
        const contrato = contratos.find(contrato => contrato.usuario_id === user.id)

        if (contrato) {
            const dataHoje = new Date()
            const dataVencimento = new Date(contrato.data_vencimento)

            if (isNaN(dataVencimento.getTime())) {
                modalServer('Erro', 'Data de vencimento inválida.');
                return;
            }

            const diffInTime = dataVencimento.getTime() - dataHoje.getTime();
            const dias = Math.ceil(diffInTime / (1000 * 3600 * 24));

            if (dias < 0) {
                modalServer('Erro', 'Regularize o seu Plano')
                return
            }
        }

        const formdata = new FormData();
        const diaSemanaNumero = diasDaSemana.indexOf(dia_semana);
        formdata.append('usuario_id', user.id.toString());
        formdata.append('modalidade_id', modalidade_id.toString());
        formdata.append('horario', horario);
        formdata.append('dia_semana', diaSemanaNumero.toString());
        formdata.append('data', dataCorrespondente);

        const response = await createReservas(formdata);
        if (response.status === 'false') {
            modalServer('Mensagem', response.message);
        } else {
            modalServer('Mensagem', response.message);
            console.log(dataAula)
            setReservasPorAula(prevState => ({
                ...prevState,
                [aulaKey]: (prevState[aulaKey] || 0) + 1
            }));

            // Adicione esta linha para atualizar o estado das reservas
            setReservas(prevReservas => [
                ...prevReservas,
                {
                    usuario_id: user.id,
                    modalidade_id: modalidade_id,
                    horario: horario,
                    dia_semana: dia_semana,
                    data: dataCorrespondente
                } as Reserva
            ]);
        }



    };

    // Função para verificar se a aula ocorre em um determinado dia da semana atual
    const aulaOcorreNoDia = (aula: Aula, diaSemana: string) => {

        const dataInicio = parseISO(aula.data_inicio);
        const dataFim = parseISO(aula.data_fim);
        const diaAtual = diasDaSemana.indexOf(diaSemana);
        const diasAula = aula.dia_semana.split(',').map(Number);
        const inicioSemana = startOfWeek(semanaAtual, { weekStartsOn: 1 });
        const fimSemana = endOfWeek(semanaAtual, { weekStartsOn: 1 });

        return diasAula.includes(diaAtual) &&
            isBefore(dataInicio, fimSemana) &&
            isAfter(dataFim, inicioSemana);
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



    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
                <p className="ml-2">Carregando dados...</p>
            </div>
        );
    }



    return (
        <ClientMain>
            <section className='aulas-menu'>
                <h1>Grade de Aulas</h1>
                <div className='buttons-datas'>
                    <Button variant='imoogi' onClick={() => setSemanaAtual(addWeeks(semanaAtual, -1))}>Semana Anterior</Button>
                    <span>{format(semanaAtual, "'Semana de' dd 'de' MMMM", { locale: ptBR })}</span>
                    <Button variant='imoogi' onClick={() => setSemanaAtual(addWeeks(semanaAtual, 1))}>Próxima Semana</Button>
                </div>
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

                                           
                                            
                                                const diaSemanaNumero = reservaDiadaSemana ? diasDaSemana.indexOf(reservaDiadaSemana.dia_semana) : -1; // Aqui você deve garantir que 'dia' é o mesmo que você usou no useEffect
                                                const aulaKey = generateKey(aula.modalidade_id, aula.horario, diaSemanaNumero.toString(), dataCorrespondente);
                                                console.log(aulaKey)
                                                return (
                                                    <div className='aula' key={aulaKey}>
                                                        <h3 className='modalidade_aula'>{aula.nome_modalidade}</h3>
                                                        <p className='horario'>{aula.horario.substring(0, 5)}</p>
                                                        <div className="container-reserva">
                                                            <button
                                                                className="btn-reserva"
                                                                onClick={() => clickReserva(aula.modalidade_id, aula.horario, dia, aula.limite_alunos, dataCorrespondente)}
                                                            >
                                                                Reservar
                                                            </button>
                                                            <p className="limiteAlunos">
                                                                {reservasPorAula[aulaKey] || 0}/{aula.limite_alunos}
                                                            </p>
                                                        </div>
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
        </ClientMain>
    );
}

export default UserSession(GradeReservas)