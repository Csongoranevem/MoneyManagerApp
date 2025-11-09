import { Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { RegistrationComponent } from '../components/registration/registration.component';
import { WalletComponent } from '../components/wallet/wallet.component';
import { CategoriesComponent } from '../components/categories/categories.component';
import { ProfileComponent } from '../components/profile/profile.component';
import { LogoutComponent } from '../components/logout/logout.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'registration', component: RegistrationComponent },
    { path: 'wallet', component: WalletComponent },
    { path: 'categories', component: CategoriesComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'logout', component: LogoutComponent },
];
