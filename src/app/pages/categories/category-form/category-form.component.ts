import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validator, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { Category } from "../shared/category.model";
import {CategoryService  } from "../shared/category.service";

import { switchMap } from "rxjs/operators";

import * as toastr from "toastr";
import { error } from 'jquery';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {


  currentAction!: string; 
  cateoryForm!: FormGroup;
  pageTitle!: string;
  serverErrorMessages: string[] = [];
  submittingForm: boolean = false;
  category: Category = new Category();


  constructor( 
      private categoryService: CategoryService,
      private route: ActivatedRoute,
      private router: Router,
      private formBuilder: FormBuilder
    ) {}

  ngOnInit(): void {
    this.setCurrent();
    this.buildCategoryForm();
    this.loadCategory();
    
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }
 
  // PUBLIC METHODS
  submitForm() {
    this.submittingForm = true;

    if(this.currentAction == "new") {
      this.createCategory();
    } else {
      this.updateCategory();
    }
  }

  // PRIVATE METHODS

  private setCurrent() {
    this.route.snapshot.url[0].path == "new" ? this.currentAction = "new" : this.currentAction = "edit";
  }

  private buildCategoryForm() {

    
    this.cateoryForm = this.formBuilder.group({
        id: [null],
        name: [null, [Validators.required, Validators.minLength(2)]],
        description: [null]
    })
  }

  
  private loadCategory() {
    if(this.currentAction == "edit") {
      this.route.paramMap.pipe(
        switchMap(params => this.categoryService.getById(+params.get("id")!))
      )
      .subscribe(
        (category) => {
          this.category = category;
          this.cateoryForm.patchValue(category)
        },
        (error) => alert("Ocorreu um erro no servidor, tente mais tarde.")
      )
    }
  }

  private setPageTitle() {

    if(this.currentAction == "new")
      this.pageTitle = "Cadastro de Nova Categoria"
    else {
      const categoryName = this.category.name || "";
      this.pageTitle = "Editando a Categoria " + categoryName;
    }    
  }


  private createCategory() {
    const category: Category = Object.assign(new Category(), this.cateoryForm.value);

    this.categoryService.create(category).subscribe(
      category => this.actionsForSuccess(category),
      error => this.actionsForError(error)
    )
  }

  private updateCategory() {
    const category: Category = Object.assign(new Category(), this.cateoryForm.value);
    console.log("opaaaaa")
    console.log(category)

    const resposta = this.categoryService.update(category).subscribe(
      category => this.actionsForSuccess(category),
      error => this.actionsForError(error)
    );

    console.log("Resposta do service")
    console.log(resposta)
  }

  private actionsForSuccess(category: Category) {
    toastr.success("Solicitação processada com sucesso!");

    // Redirect/relod component page
    this.router.navigateByUrl("categories", {skipLocationChange: true}).then(
      () => this.router.navigate(["categories", category.id, "edit"])
    )
  }

  private actionsForError(error: any) {
    toastr.error("Occorreu um erro ao processar a sua solicitação!");

    this.submittingForm = false;

    if(error.status == 422) {
      this.serverErrorMessages = JSON.parse(error._body).erros;
    } else {
      this.serverErrorMessages = ["Falha na comunicação com o servidor, Por Favor, tente mais tarde"]
    }
  }

 

}
