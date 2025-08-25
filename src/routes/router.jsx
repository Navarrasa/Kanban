import { Routes, Route } from 'react-router-dom';
import { Home } from '../pages/Home';
import { CadTarefa } from '../pages/cadTarefa';
import { CadUsuario } from '../pages/cadUsuario';
import { DefaultLayout } from '../layout/DefaultLayout';


export function Router() {
    return(

        <Routes>
            <Route element={<DefaultLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/tasks" element={<CadTarefa />} />
                <Route path="/users" element={<CadUsuario />} />

            </Route>
        </Routes>
    );
}