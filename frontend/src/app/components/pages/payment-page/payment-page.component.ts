import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { Order } from 'src/app/shared/models/Order';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-payment-page',
  templateUrl: './payment-page.component.html',
  styleUrls: ['./payment-page.component.css']
})
export class PaymentPageComponent implements OnInit {
  order: Order = new Order;

  constructor(private orderService: OrderService, private router: Router, private cartService: CartService, private toastrService: ToastrService) {
    this.orderService.getNewOrderForCurrentUser().subscribe({
      next: (order) => {
        this.order = order;
      },
      error: (errorResponse) => {
        router.navigateByUrl('/checkout');
      }
    })
  }

  ngOnInit(): void {
  }

  confirmOrderAndPay() {
    this.orderService.pay(this.order).subscribe({
      next: (orderId) => {
        this.cartService.clearCart();
        this.router.navigateByUrl('/track/' + orderId);
        this.toastrService.success('Order Placed Successfully', 'Success');
      },
      error: (error: any) => {
        this.toastrService.error('Payment Save Failed', error);
      },
    });
  }

}
