import { Routes } from '@angular/router';
import { LayoutComponent } from './page/layout/layout.component';
import { DashboardComponent } from './page/dashboard/dashboard.component';
import { HomeComponent } from './page/user/home/home.component';
import { ServiceComponent } from './page/user/service/service.component';
import { BungalowsComponent } from './page/user/bungalows/bungalows.component';
import { FoodMenuComponent } from './page/user/foods/foods.component';
import { ResponsableDashboardComponent } from './page/responsable/responsable-dashboard/responsable-dashboard.component';
import { NavAdminComponent } from './page/layout/nav-admin/nav-admin/nav-admin.component';
import { BookingViewComponent } from './page/admin/booking-view/booking-view.component';
import { OverviewViewComponent } from './page/admin/overview-view/overview-view.component';
import { GuestsViewComponent } from './page/admin/guests-view/guests-view.component';
import { CheckInViewComponent } from './page/admin/check-in-view/check-in-view.component';
import { FoodViewComponent } from './page/admin/foods-view/foods-view.component';
import { NotificationsViewComponent } from './page/admin/notifications-view/notifications-view.component';
import { ServicesViewComponent } from './page/admin/services-view/services-view.component';
import { BungalowViewComponent } from './page/admin/bungalows-view/bungalows-view.component';
import { LoginComponent } from './page/login/login.component';
import { UserRole } from './Model/user.model';
import { authGuard } from './page/login/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  // Role: RESPONSABLE
  {
    path: 'responsable',
    component: ResponsableDashboardComponent,
    canActivate: [authGuard],
    data: { roles: [UserRole.RESPONSABLE] }
  },

  // Role: ADMIN
  {
    path: 'admin',
    component: NavAdminComponent,
    canActivate: [authGuard],
    data: { roles: [UserRole.ADMIN] },
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: OverviewViewComponent },
      { path: 'booking', component: BookingViewComponent },
      { path: 'guests', component: GuestsViewComponent },
      { path: 'bungalows', component: BungalowViewComponent },
      { path: 'check-in', component: CheckInViewComponent },
      { path: 'foods', component: FoodViewComponent },
      { path: 'notifications', component: NotificationsViewComponent },
      { path: 'services', component: ServicesViewComponent }
    ]
  },

  // Role: USER
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    data: { roles: [UserRole.USER, UserRole.ADMIN, UserRole.RESPONSABLE] }, // Allow all roles for user routes
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'home', component: HomeComponent },
      { path: 'service', component: ServiceComponent },
      { path: 'bungalows', component: BungalowsComponent },
      { path: 'foods', component: FoodMenuComponent }
    ]
  },

  { path: '**', redirectTo: '/login' }
];