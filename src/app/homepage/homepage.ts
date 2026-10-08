import { Component } from '@angular/core';
import { FAQs } from '../faqs/faqs';

@Component({
  imports: [FAQs],
  selector: 'app-homepage',
  styleUrl: './homepage.css',
  templateUrl: './homepage.html',
})
export class Homepage {

  services:string = "face";

  changeService(service: string){
    this.services = service;

    console.log(this.services);
    
  }
  
}
