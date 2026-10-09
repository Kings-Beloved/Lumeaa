import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';

@Service()
export class Treatment {
    private http = inject(HttpClient);

    getTreatment(){
        return this.http.get('https://lumea-uoet.onrender.com/treatment/getTreatment');
    }
}
