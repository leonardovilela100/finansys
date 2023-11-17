import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';


import { EntriesRoutingModule } from './entries-routing.module';
import { EntryListComponent } from './entry-list/entry-list.component';


@NgModule({
  declarations: [EntryListComponent],
  imports: [
    CommonModule,
    EntriesRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ]
})
export class EntriesModule { }
