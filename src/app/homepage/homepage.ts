import { Component } from '@angular/core';
import { FAQs } from '../faqs/faqs';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  imports: [FAQs, RouterLink, RouterLinkActive],
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
