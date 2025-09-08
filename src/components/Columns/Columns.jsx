import { Tarefa } from "../../components/Tarefa/Tarefa"; 

export function Columns({ titulo, tarefas = []}) {
    return(
        <section className="coluna">
            <h2 className="titulo">{titulo}</h2>
            {tarefas.map(tarefa => {
                console.log("Renderizando", tarefa);
                return<Tarefa key={tarefa.id} tarefa={tarefa} />
            })}
        </section>
    );
}