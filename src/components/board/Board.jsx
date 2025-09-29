import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Columns } from '../Columns/Columns';
import { DndContext } from '@dnd-kit/core';
import { restrictToFirstScrollableAncestor } from "@dnd-kit/modifiers";

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

    function handleDragEnd(event){
        const {active, over} = event;

        if(over && active){
            const tarefaId = active.id //pegar o id da tarefa qeu ta sofrendo o evento¨
            const novaColuna = over.id // quero pegar a coluna da tarefa

            //atualiza a interface do usuário
            setTarefas(prev => {
                return prev.map(tarefa => tarefa.id === tarefaId ? { ...tarefa, status: novaColuna } : tarefa);
            })
 
            //atualiza o status do card (muda a situação do card : a fazer/fazendo/fronto)
 
            axios.patch(`http://127.0.0.1:8000/api/tarefas/${tarefaId}/`, {
                status: novaColuna
            })
            .catch(err => console.error("Erro ao atualizar status: ", err));
        }
    }
 

    //armazenando em variáveis o resultado de uma função callback que procura tarefas com um certo status
    const tarefasAfazer = tarefas.filter(tarefa => tarefa.status === 'pendente');
    const tarefasFazendo = tarefas.filter(tarefa => tarefa.status === 'em_andamento');
    const tarefasFeito = tarefas.filter(tarefa => tarefa.status === 'concluido');
    console.log(tarefas );

    return (
        <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToFirstScrollableAncestor]}>
            <section className="container" aria-label="Quadro de tarefas">
            <h1>Meu Quadro</h1>

            {/* Wrapping columns in a landmark region para ajudar na navegação */}
            <section
                className="columns-wrapper"
                aria-label="Colunas de tarefas"
            >
                {/* Cada Columns deve representar uma lista de itens */}
                <Columns id="pendente" titulo="A fazer" tarefas={tarefasAfazer} />
                <Columns id="em_andamento" titulo="Fazendo" tarefas={tarefasFazendo} />
                <Columns id="concluido" titulo="Feito" tarefas={tarefasFeito} />
            </section>
            </section>
        </DndContext>
    );
}
