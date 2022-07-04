import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PresetButtonComponent } from './preset-button/preset-button.component';
import { StationTunerComponent } from './station-tuner/station-tuner.component';

@NgModule({
  declarations: [
    AppComponent,
    PresetButtonComponent,
    StationTunerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
