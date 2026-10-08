import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

declare var PaystackPop: any;

@Component({
  selector: 'app-complete-payment',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './complete-payment.html',
  styleUrl: './complete-payment.css',
})
export class CompletePayment implements OnInit {
  booking = signal<any>(null);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);
  paymentSuccess = signal<boolean>(false);

  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private readonly PAYSTACK_KEY = 'pk_test_7c6a7a78cba7a54b309b75c81a319959247ba402'; // Replace with your Paystack key

  ngOnInit(): void {
    const reference = this.route.snapshot.queryParamMap.get('reference');
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!reference || !token) {
      this.errorMessage.set('Invalid payment link. Missing parameters.');
      this.isLoading.set(false);
      return;
    }

    this.fetchBookingDetails(reference, token);
  }

  fetchBookingDetails(reference: string, token: string): void {
    const url = `http://localhost/Lumea/get-booking?reference=${reference}&token=${token}`;

    this.http.get<any>(url).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        const data = res.data || res;

        if (data && (data.id || data.treatment_id)) {
          this.booking.set(data);
        } else {
          this.errorMessage.set(res.message || 'Unable to find booking details.');
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set('Link expired or booking already paid.');
        console.error(err);
      }
    });
  }

  payWithPaystack(): void {
    const data = this.booking();
    if (!data) return;

    const depositKobo = 5000 * 100;

    const handler = PaystackPop.setup({
      key: this.PAYSTACK_KEY,
      email: data.email || 'customer@example.com',
      amount: depositKobo,
      currency: 'NGN',
      ref: 'LUM_' + Math.floor(Math.random() * 1000000000 + 1),
      metadata: {
        appointment_id: data.id,
        treatment_name: data.treatment_name
      },
      callback: (response: any) => {
        this.verifyAndConfirmPayment(response.reference, data.id);
      },
      onClose: () => {
        console.log('Payment modal closed');
      }
    });

    handler.openIframe();
  }

  verifyAndConfirmPayment(paystackRef: string, appointmentId: number | string): void {
  this.isLoading.set(true);

  // Post to your established Auth.php route
  this.http.post<any>('http://localhost/Lumea/verify-payment', {
    paystack_reference: paystackRef,
    appointment_id: appointmentId
  }).subscribe({
    next: (res) => {
      this.isLoading.set(false);
      this.paymentSuccess.set(true);
     
    },
    error: (err) => {
      this.isLoading.set(false);
      console.error('Verification error:', err);
      alert('Payment processed, but confirmation failed. Please contact support.');
    }
  });
}
}