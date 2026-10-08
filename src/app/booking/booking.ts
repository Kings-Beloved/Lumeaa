import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './booking.html',
  styleUrls: ['./booking.css']
})
export class BookingComponent implements OnInit {
  currentStep:number = 1;
  bookingForm!: FormGroup;
  
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  isLoading:boolean = false
  selectedTreatment:any = null;
  existingBookingId: string | null = null;

  services = [
    { id: 1, name: 'Facial Contouring & Sculpting', duration: '60 min', price: '$220' },
    { id: 2, name: 'Laser Skin Rejuvenation', duration: '45 min', price: '$310' },
    { id: 3, name: 'Dermal Injectables & Fillers', duration: '30 min', price: '$450' },
    { id: 4, name: 'Full Body Wellness Therapy', duration: '90 min', price: '$280' }
  ];

  timeSlots = ['09:00 AM', '11:00 AM', '01:30 PM', '03:30 PM', '05:00 PM'];

  constructor(private fb : FormBuilder) {}

  ngOnInit(): void {

    this.initForm();
    this.route.queryParams.subscribe(params => {
      const reference = params['reference'];
      const token = params['token'];

      if (reference && token) {
        this.isLoading = true
        this.resumeBooking(reference, token);
      }
    });

  }
  initForm():void{
    this.bookingForm = this.fb.group({
      serviceId: ['', Validators.required],
      date: ['', Validators.required],
      timeSlot: ['', Validators.required],
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      notes: ['']
    });
  }

  nextStep(): void {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  selectService(id: number): void {
    this.bookingForm.patchValue({ serviceId: id });
  }

  selectTime(slot: string): void {
    this.bookingForm.patchValue({ timeSlot: slot });
  }

  get selectedService() {
    const id = this.bookingForm.get('serviceId')?.value;
    return this.services.find(s => s.id === id);
  }

  onSubmit(): void {
    if (this.bookingForm.valid) {
      console.log('Booking Submitted:', this.bookingForm.value);
      this.currentStep = 4; // Success Screen
    }
  }

 resumeBooking(reference: string, token: string): void {
    const url = `http://localhost/Lumea/get-booking?reference=${reference}&token=${token}`;

    this.http.get<any>(url).subscribe({
      next: (res) => {
        this.isLoading = false;
        const bookingData = res.data || res;

        if (bookingData && (bookingData.id || bookingData.treatment_id)) {
          // 1. Populate reactive form fields
          this.bookingForm.patchValue({
            serviceId: bookingData.treatment_id,
            date: bookingData.appointment_date,
            timeSlot: bookingData.start_time
          });

          // 2. Set treatment object for checkout summary
          this.selectedTreatment = {
            id: bookingData.treatment_id,
            name: bookingData.treatment_name || 'Selected Treatment',
            deposit_amount: bookingData.deposit_amount || 220
          };

          // 3. Force state step update to Step 4
          this.currentStep = 4;
          
          // 4. Force Angular change detection cycle
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Failed to load pending booking:', err);
        this.currentStep = 1;
        this.cdr.detectChanges();
      }
    });
  }
}