import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Columns } from '../Columns/Columns';


export function Board() {
    
    const [tarefas, setTarefas] = useState([]);

    // o Effect é um hook que permite a renderização de alguma coisa na tela
    useEffect (() => {

        //construo uma variável com o endereço da API
        const apiURL = 'http://127.0.0.1:8000/api/tarefas/';

        //permite a chamada do endereço
        axios.get(apiURL)

            //se a resposta for positiva
            .then(response => {setTarefas(response.data)
            })

            //se der algum problema
            .catch(error => {
                console.error("Algo seu errado", error)
            });
    }, [])

    //armazenando em variáveis o resultado de uma função callback que procura tarefas com um certo status
    const tarefasAfazer = tarefas.filter(tarefa => tarefa.status === 'pending');
    const tarefasFazendo = tarefas.filter(tarefa => tarefa.status === 'in_progress');
    const tarefasFeito = tarefas.filter(tarefa => tarefa.status === 'completed');

    return (
        <section className="container">
            <h1>Meu Quadro</h1>
            <section className="columns-wrapper">
                <Columns titulo="A fazer" tarefas={tarefasAfazer} />
                <Columns titulo="Fazendo" tarefas={tarefasFazendo} />
                <Columns titulo="Feito" tarefas={tarefasFeito} />
            </section>
        </section>
    );
}