import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { RecipesState } from './recipes.reducer';
import { RecipeService } from '../../services/recipies/recipie.service';
import { RecipesActionTypes, GetAllRequest, GetAllComplete, EntrySubmitted, RecipeCreated } from './recipes.actions';
import { DisplayRecipe } from '../../models/recipe/display-recipe';
import { Recipe } from '../../models/recipe/recipe';
import { map, switchMap } from 'rxjs/operators';
import { UserActionTypes } from '../user/user.actions';

@Injectable({providedIn: 'root'})
export class RecipesEffects {

    @Effect()
    formSubmitted$ = this.actions$.pipe(
        ofType<EntrySubmitted>(RecipesActionTypes.EntrySubmitted),
        switchMap(entry => this.service.submitNewRecipe(entry.payload).pipe(
            map(res => this.getDisplayRecipe(res)),
            map(recipe => new RecipeCreated(recipe))
        ))
    );

    @Effect()
    getRecipes$ = this.dataPersistance.pessimisticUpdate(RecipesActionTypes.GetAllRequest, {
        run: (action: GetAllRequest, state: RecipesState) => {
            return this.service.getAllRecipies().pipe(
                map(recipes => recipes.map(r => this.getDisplayRecipe(r))),
                map(displayRecipies => new GetAllComplete(displayRecipies))
            );
        },

        onError: (action: GetAllRequest, error) => {
            console.log('Error', error);
        }
    });

    private getDisplayRecipe(recipe: Recipe): DisplayRecipe {
        return Object.assign({}, recipe,
            {
                imageUrl: `http://localhost:3000/image/recipe/${recipe.id}.jpg`
            });
    }

    @Effect()
    loggedIn$ = this.actions$.pipe(
        ofType(UserActionTypes.LoginComplete, UserActionTypes.LoadUserComplete),
        map(_ => new GetAllRequest())
    );

    constructor(
        private actions$: Actions,
        private dataPersistance: DataPersistence<RecipesState>,
        private service: RecipeService
    ) {}
}