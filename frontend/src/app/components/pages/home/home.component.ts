import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { FoodService } from 'src/app/services/food.service';
import { Food } from 'src/app/shared/models/Food';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  foods: Food[] = [];

  constructor(private foodService: FoodService, route: ActivatedRoute) {
    let foodsObservable: Observable<Food[]>;

    route.params.subscribe((param) => {
      if (param.searchTerm) {
        foodsObservable = this.foodService.getAllFoodsBySearchTerm(param.searchTerm);
      } else if (param.tag) {
        foodsObservable = this.foodService.getAllFoodsByTag(param.tag);
      } else {
        foodsObservable = this.foodService.getAll();
      }

      foodsObservable.subscribe(foodsObj => {
        this.foods = foodsObj;
      });
    });
  }

  ngOnInit(): void {
  }

}
