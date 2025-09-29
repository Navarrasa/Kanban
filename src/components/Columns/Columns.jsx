import { Tarefa } from "../../components/Tarefa/Tarefa"; 
import { useDroppable } from "@dnd-kit/core";

export function Columns({ id, titulo, tarefas }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    // Considerar usar uma região landmark ou section para melhor organização semântica
    <section 
      ref={setNodeRef} 
      className="column" 
    >
      {/* Título com id para referenciar na aria-labelledby */}
      <h2 id={`column-${id}-title`}>{titulo}</h2>
      {tarefas.map((tarefa) => (
        <Tarefa key={tarefa.id} tarefa={tarefa} />
      ))}
    </section>
  );
}
