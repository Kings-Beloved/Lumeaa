import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [CommonModule],
  styleUrl: './faqs.css',
  templateUrl: './faqs.html',
})
export class FAQs {
  // Track open FAQ item by ID (null means all are closed)
  openFaqId: string | null = null;

  faqs: FaqItem[] = [
    {
      id: '01',
      question: 'Do I need a consultation before booking a treatment?',
      answer: "For many treatments, we recommend starting with a consultation so our team can understand your goals and recommend an approach that's appropriate for you. Some treatments may be booked directly depending on the service."
    },
    {
      id: '02',
      question: 'How do I book an appointment?',
      answer: 'Select your preferred treatment, choose an available date and time, provide your details, and secure your appointment with the required booking deposit.'
    },
    {
      id: '03',
      question: 'Is a deposit required to book?',
      answer: 'Yes. A booking deposit may be required to secure your appointment. The deposit is applied toward your treatment, subject to our booking and cancellation policy.'
    },
    {
      id: '04',
      question: 'Can I reschedule or cancel my appointment?',
      answer: 'Yes. We understand that plans change. Please contact us within the timeframe outlined in our cancellation policy to reschedule or cancel your appointment.'
    },
    {
      id: '05',
      question: 'How do I know which treatment is right for me?',
      answer: "Every person is different. During your consultation, we'll discuss your goals, assess your needs, and recommend treatments that are appropriate for you."
    },
    {
      id: '06',
      question: 'What should I expect during my first visit?',
      answer: "Your first visit begins with a consultation where we'll discuss your goals, answer your questions, and explain the recommended treatment options. We'll make sure you understand the process before proceeding."
    },
    {
      id: '07',
      question: 'How long does a treatment take?',
      answer: "Treatment times vary depending on the service. When you select a treatment during booking, you'll be shown the expected appointment duration."
    },
    {
      id: '08',
      question: 'Do you offer aftercare guidance?',
      answer: "Yes. You'll receive appropriate aftercare instructions following your treatment, including guidance on what to expect and how to care for your skin or treated area."
    }
  ];

  toggleFaq(id: string): void {
    this.openFaqId = this.openFaqId === id ? null : id;
  }
}