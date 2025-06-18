import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { RouterModule, Routes } from '@angular/router'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { TranslateLoader, TranslateModule } from '@ngx-translate/core'

import { AngularAcceleratorModule, createTranslateLoader } from '@onecx/angular-accelerator'
import { APP_CONFIG, AppStateService } from '@onecx/angular-integration-interface'

import { environment } from '../environments/environment'
import { AppComponent } from './app.component'
import { AngularAuthModule } from '@onecx/angular-auth'

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./help/help.module').then((m) => m.HelpModule)
  }
]
@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    AngularAuthModule,
    AngularAcceleratorModule,
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
      enableTracing: true
    }),
    TranslateModule.forRoot({
      isolate: true,
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient, AppStateService]
      }
    })
  ],
  providers: [{ provide: APP_CONFIG, useValue: environment }, provideHttpClient(withInterceptorsFromDi())]
})
export class AppModule {
  constructor() {
    console.info('OneCX Help Module constructor')
  }
}
