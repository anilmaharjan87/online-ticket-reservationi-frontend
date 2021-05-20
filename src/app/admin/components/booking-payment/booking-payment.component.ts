import {Component, OnInit} from '@angular/core';
import {BookingService} from "../booking/bookin.service";
import {ActivatedRoute} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-booking-payment',
  templateUrl: './booking-payment.component.html',
  styleUrls: ['./booking-payment.component.scss']
})
export class BookingPaymentComponent implements OnInit {
  data: any;
  paymentMethods: any;
  reservationId: number;
  paymentMethodFormControl: FormControl;
  paymentForm: FormGroup;

  constructor(private bookingService: BookingService, private route: ActivatedRoute, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.getReservationInfo();
    this.getPaymentMethods();
    this.paymentMethodFormControl = new FormControl('', [Validators.required]);

    this.paymentForm = new FormGroup({
      paymentMethod: this.paymentMethodFormControl,
    })
  }

  private getReservationInfo() {
    this.reservationId = +this.route.snapshot.paramMap.get('id');
    this.bookingService.getReservationInfo(this.reservationId).subscribe(res => {
      this.data = res;
      console.log(res);
      /*  this.bookingForm.patchValue({
          unitCost: res.ticketDto.cost
        });*/
    });
  }

  confirm() {
    let rawValue = this.paymentForm.getRawValue();
    rawValue.reservationId = this.data.reservationDto.id;
    debugger;
    this.bookingService.pay(rawValue).subscribe(
      res => {
        this.snackBar.open(res.message);
      },
      error => {
        this.snackBar.open(error.message);
      }
    );
  }

  getPaymentMethods() {
    this.bookingService.getPaymentMethods().subscribe(res => {
      this.paymentMethods = res;
      console.log(this.paymentMethods);
    })
  }
}