import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { Treatment } from '../Service/treatment';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../Service/auth';
import { DatePipe, NgClass } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

declare var PaystackPop: any;

@Component({
  imports: [ReactiveFormsModule, NgClass, DatePipe],
  selector: 'app-booking-logic',
  styleUrl: './booking-logic.css',
  templateUrl: './booking-logic.html',
})
export class BookingLogic implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private auth = inject(Auth);
  private treatment = inject(Treatment);
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  appointmentId: number | null = null;
  currentStep: number = 1;
  isSubmitting: boolean = false;
  bookingResponse: any = null;
  
  minDate: string = '';
  selectedDate: string = '';
  selectedTimeSlot: string = '';

  availableTimeSlots: string[] = [
    '09:00 AM',
    '10:30 AM',
    '12:00 PM',
    '01:30 PM',
    '03:00 PM',
    '04:30 PM',
    '06:00 PM'
  ];

  treatments = signal<any[]>([]);

  
  bookingForm = new FormGroup({
    bookingDateTime: new FormControl('', Validators.required),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    phoneNumber: new FormControl('', Validators.required),
    treatmentId: new FormControl<number | null>(null, Validators.required)
  });

  ngOnInit(): void {
    this.treatment.getTreatment().subscribe({
      next: (data: any) => {
        this.treatments.set(data.treatment);
      },
      error: (err: any) => {
        console.error('Error fetching treatments:', err);
      }
    });
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    this.route.queryParams.subscribe(params => {
    const reference = params['reference'];
    const token = params['token'];

    if (reference && token) {
      this.resumeBooking(reference, token);
    }
  });
  }

  

  nextStep() {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onDateSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedDate = input.value;
    this.updateBookingDateTime();
  }

  selectTimeSlot(slot: string): void {
    this.selectedTimeSlot = slot;
    this.updateBookingDateTime();
  }

  private updateBookingDateTime(): void {
    if (this.selectedDate && this.selectedTimeSlot) {
      
      const formattedDateTime = `${this.selectedDate} ${this.selectedTimeSlot}`;
      
      // Keep your original formControlName updated seamlessly
      this.bookingForm.patchValue({
        bookingDateTime: formattedDateTime
      });
      this.bookingForm.get('bookingDateTime')?.markAsTouched();
    }
  }

  get minDateTime(): string {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  }
  selectedTreatment: any = null
  paymentReference: string = ''

 selectTreatment(treatment: any) {
  this.selectedTreatment = treatment;
  this.bookingForm.patchValue({ treatmentId: treatment.id });
}

 submitBooking(event?: Event) {
  if (event) {
    event.preventDefault();
  }

  if (this.bookingForm.invalid || this.isSubmitting) return;

  this.isSubmitting = true;

  this.auth.createCustomer(this.bookingForm.value).subscribe({
    next: (response: any) => {
      this.isSubmitting = false;

      if (response && (response.status === 200 || response.status === '200')) {
        this.bookingResponse = response;
        this.currentStep = 4;
        this.cdr.detectChanges(); // Refresh template state
      } else {
        alert(response?.message || 'Error creating appointment.');
      }
    },
    error: (err: any) => {
      this.isSubmitting = false;
      console.error('Error submitting booking:', err);
    }
  });
}

  

  payWithPaystack() {
  const appointmentId = this.bookingResponse?.appointment_id;

  if (!appointmentId) {
    alert('Payment verification failed: Missing appointment ID.');
    return;
  }

  const handler = PaystackPop.setup({
    key: 'pk_test_7c6a7a78cba7a54b309b75c81a319959247ba402', // Test Public Key
    email: this.bookingForm.value.email || this.bookingResponse?.email,
    amount: 5000 * 100, // ₦5,000 in kobo
    currency: 'NGN',
    ref: 'LUM_' + Math.floor((Math.random() * 1000000000) + 1),
    callback: (response: any) => {
      // Pass the reference AND the appointmentId from bookingResponse
      this.verifyPaymentOnBackend(response.reference, appointmentId);
    },
    onClose: () => {
      console.log('Window closed');
    }
  });

  handler.openIframe();
}

paymentConfirmed: boolean = false;

verifyPaymentOnBackend(reference: string, appointmentId: number) {
  const payload = {
    appointment_id: appointmentId, // <--- MUST MATCH PHP's $data->appointment_id
    reference: reference,
    amount: 5000
  };

  this.auth.verifyPayment(payload).subscribe({
    next: (res: any) => {
      if (res.status === 200 || res.status === '200') {
        alert('Payment verified and booking reserved successfully!');
        // Refresh component or state to show "Paid / Confirmed" badge
        if (this.bookingResponse) {
          this.bookingResponse.payment_status = 'paid';
          this.bookingResponse.status = 'confirmed';
          this.paymentConfirmed = true
        }
        this.cdr.detectChanges();
      } else {
        alert('Payment verification failed: ' + res.message);
      }
    },
    error: (err: any) => {
      console.error('Verification HTTP Error:', err);
      alert('Network error verifying payment.');
    }
  });
}

resumeBooking(reference: string, token: string): void {
  const url = `http://localhost/Lumea/get-booking?reference=${reference}&token=${token}`;

  this.http.get<any>(url).subscribe({
    next: (res) => {
      const bookingData = res.data || res;

      if (bookingData && bookingData.id) {
        // 1. Patch reactive form
        this.bookingForm.patchValue({
          treatmentId: bookingData.treatment_id,
          bookingDateTime: `${bookingData.appointment_date} ${bookingData.start_time}`,
          firstName: bookingData.first_name || '',
          lastName: bookingData.last_name || '',
          email: bookingData.email || '',
          phoneNumber: bookingData.phone_number || ''
        });

        // 2. Store treatment details for checkout summary
        if (typeof this.selectedTreatment?.set === 'function') {
          this.selectedTreatment.set({
            id: bookingData.treatment_id,
            name: bookingData.treatment_name,
            deposit_amount: bookingData.deposit_amount
          });
        } else {
          this.selectedTreatment = {
            id: bookingData.treatment_id,
            name: bookingData.treatment_name,
            deposit_amount: bookingData.deposit_amount
          };
        }

        // 3. SET STEP TO 4 ACCORDING TO YOUR STATE DECLARATION:
        
        // IF USING SIGNALS:
        // this.currentStep.set(4);  <-- Use this if currentStep = signal(1)
        
        // IF USING STANDARD PROPERTY:
        // this.currentStep = 4;     <-- Use this if currentStep: number = 1

        // 4. Force Angular UI change detection
        this.cdr.detectChanges();
      }
    },
    error: (err) => {
      console.error('Error fetching booking data:', err);
    }
  });
}

}