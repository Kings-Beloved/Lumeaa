import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { Homepage } from './homepage/homepage';
import { BookingComponent } from './booking/booking';
import { BookingLogic } from './booking-logic/booking-logic';
import { FAQs } from './faqs/faqs';
import { Footer } from './footer/footer';
import { About } from './about/about';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Homepage, BookingComponent, BookingLogic, FAQs, Footer, About],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Lumea');
}
