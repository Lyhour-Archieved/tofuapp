import { Component, OnInit } from '@angular/core';
import { ShoppingListItemFacade } from 'src/app/core-data/state/shopping-list-item/shopping-list-items.facade';
import { Observable } from 'rxjs';
import { Recipe } from 'src/app/core-data/models/recipe/recipe';
import { ShoppingListFacade } from 'src/app/core-data/state/shopping-list/shopping-list.facade';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { AddListComponent } from 'src/app/shared/add-list/add-list.component';

@Component({
  selector: 'app-default-shopping-list',
  templateUrl: './default-shopping-list.component.html',
  styleUrls: ['./default-shopping-list.component.css']
})
export class DefaultShoppingListComponent implements OnInit {
  public recipesInList$: Observable<Recipe[]>;
  public currentListName$: Observable<string>;

  constructor(
    private readonly itemFacade: ShoppingListItemFacade,
    private readonly listFacade: ShoppingListFacade,
    private readonly matDialog: MatDialog
  ) { 
    this.recipesInList$ = this.itemFacade.recipesInCurrentList$;
    this.currentListName$ = this.listFacade.currentList$.pipe(
      map(list => list.name)
    )
  }

  ngOnInit() {
  }

  removeFromList(id: number) {
    this.itemFacade.removeRecipeFromList(id);
  }

  createNewList(){
    this.matDialog.open(AddListComponent, {
      width: "400px",
    });

  }
}
