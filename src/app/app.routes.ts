import { Routes } from '@angular/router';
import { HomeLayout } from './layout/home-layout/home-layout';
import { Home } from './pages/publico/home/home';
import { Noticias } from './pages/publico/noticias/noticias';
import { Reportajes } from './pages/publico/reportajes/reportajes';
import { Contacto } from './pages/publico/contacto/contacto';
import { Login } from './pages/publico/login/login';
import { Detalle } from './pages/publico/detalle/detalle';
import { HomeUserLayout } from './layout/home-user-layout/home-user-layout';
import { authGuard } from './auth/auth-guard';
import { HomeUser } from './pages/user/home-user/home-user';
import { UsuariosUser } from './pages/user/usuarios-user/usuarios-user';
import { MensajesUser } from './pages/user/mensajes-user/mensajes-user';
import { ReportajesUser } from './pages/user/reportajes-user/reportajes-user';
import { Previsualizacion } from './pages/user/previsualizacion/previsualizacion';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },

    {
        path: 'home',
        component: HomeLayout,  // Layout con navbar home
        children: [
            { path: '', component: Home },
            { path: 'noticias', component: Noticias },
            { path: 'reportajes', component: Reportajes },
            { path: 'contacto', component: Contacto },
            { path: 'detalle/:id', component: Detalle },

            { path: 'login', component: Login },
            // { path: 'crear-cuenta', component: CrearCuenta },
        ]
    },

    {
        path: 'home-user',
        component: HomeUserLayout,
        canActivate: [authGuard], // PROTECCIÓN AQUÍ
        children: [
            { path: '', component: HomeUser },
            { path: 'reportajes-usuario', component: ReportajesUser },
            { path: 'mensajes-usuario', component: MensajesUser },
            { path: 'usuarios-usuario', component: UsuariosUser },
            { path: 'previsualizacion/:id', component: Previsualizacion },
            // Aquí irán: usuarios, mensajes, noticias-gestión, etc.
        ]
    },

];
