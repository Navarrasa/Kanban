import { Board } from '../components/board/Board';

export function Home() {
  return (
    <section className='section'>
      {/* Quadro de tarefas */}
      <Board />
    </section>
  );
}