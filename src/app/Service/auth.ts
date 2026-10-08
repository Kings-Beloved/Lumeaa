import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';

@Service()
export class Auth {
private http = inject(HttpClient);
  private baseUrl = 'http://localhost/Lumea/auth';

  createCustomer(customerData: any) {
    return this.http.post(`${this.baseUrl}/createCustomer`, customerData);
  }

  verifyPayment(paymentData: any) {
    return this.http.post(`${this.baseUrl}/verifyPayment`, paymentData);
  }
}
