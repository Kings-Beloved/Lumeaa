import { Routes } from '@angular/router';
import { FAQs } from './faqs/faqs';
import { Homepage } from './homepage/homepage';
import { About } from './about/about';
import { Saloon } from './saloon/saloon';
import { BookingComponent } from './booking/booking';
import { BookingLogic } from './booking-logic/booking-logic';
import { CompletePayment } from './complete-payment/complete-payment';

export const routes: Routes = [
    {path:'', component:Homepage},
    {path:'faqs', component:FAQs},
    {path:'about', component:About},
    {path: 'saloon', component:Saloon},
    {path:'Bookings', component:BookingComponent},
    {path:'booking', component:BookingLogic},
    {path:'complete-payment', component:CompletePayment}
];
