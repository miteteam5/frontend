import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyticsRoutingModule } from './analytics-routing.module';
import { Statement5Component } from './statement5/statement5.component';
import { AnalyticsComponent } from './analytics.component';
import { HttpClientModule } from '@angular/common/http';
import {MatCardModule} from '@angular/material/card';
import { Ng2GoogleChartsModule } from "ng2-google-charts";
import {MatSelectModule} from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
@NgModule({
  declarations: [Statement5Component, AnalyticsComponent],
  imports: [
    CommonModule,
    AnalyticsRoutingModule,
    HttpClientModule,
    MatSelectModule,
    FormsModule,
    Ng2GoogleChartsModule,
    MatCardModule,
    MatProgressSpinnerModule
    
    
  ]
})
export class AnalyticsModule { }
