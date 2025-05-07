import { provideAppInitializer, DoBootstrap, Injector, NgModule } from '@angular/core'
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RouterModule, Routes, Router } from '@angular/router'
import { TranslateLoader, TranslateModule, MissingTranslationHandler } from '@ngx-translate/core'
import {
  TRANSLATION_PATH,
  createTranslateLoader,
  translationPathFactory,
  provideThemeConfig
} from '@onecx/angular-utils'
import { AngularAuthModule } from '@onecx/angular-auth'
import { addInitializeModuleGuard, AppStateService, ConfigurationService } from '@onecx/angular-integration-interface'
import { createAppEntrypoint, initializeRouter, startsWith } from '@onecx/angular-webcomponents'

import {
  PortalApiConfiguration,
  PortalCoreModule,
  PortalMissingTranslationHandler
} from '@onecx/portal-integration-angular'

import { Configuration } from './shared/generated'
import { environment } from 'src/environments/environment'
import { AppEntrypointComponent } from './app-entrypoint.component'

function apiConfigProvider(configService: ConfigurationService, appStateService: AppStateService) {
  return new PortalApiConfiguration(Configuration, environment.apiPrefix)
}

const routes: Routes = [
  {
    matcher: startsWith(''),
    loadChildren: () => import('./help/help.module').then((m) => m.HelpModule)
  }
]
@NgModule({
  declarations: [AppEntrypointComponent],
  imports: [
    AngularAuthModule,
    BrowserModule,
    BrowserAnimationsModule,
    PortalCoreModule.forMicroFrontend(),
    RouterModule.forRoot(addInitializeModuleGuard(routes)),
    TranslateModule.forRoot({
      isolate: true,
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      },
      missingTranslationHandler: { provide: MissingTranslationHandler, useClass: PortalMissingTranslationHandler }
    })
  ],
  providers: [
    ConfigurationService,
    { provide: Configuration, useFactory: apiConfigProvider, deps: [ConfigurationService, AppStateService] },
    {
      provide: provideAppInitializer,
      useFactory: initializeRouter,
      multi: true,
      deps: [Router, AppStateService]
    },
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: TRANSLATION_PATH,
      useFactory: (appStateService: AppStateService) => translationPathFactory('assets/i18n/')(appStateService),
      multi: true,
      deps: [AppStateService]
    },
    provideThemeConfig({
      overrides: {
        components: {
          breadcrumb: {
            padding: '0.75rem',
            item: {
              icon: {
                color: 'rgba(0, 0, 0, 0.87)'
              },
              color: 'rgba(0, 0, 0, 0.87)'
            },
            separator: {
              color: 'rgba(0, 0, 0, 0.87)'
            }
          },
          paginator: {
            current: {
              page: {
                report: {
                  color: 'rgba(0, 0, 0, 0.87)'
                }
              }
            }
          },
          datatable: {
            header: {
              cell: {
                background: '#ffffff',
                hover: {
                  background: 'rgba(0, 0, 0, .04)'
                },
                selected: {
                  background: 'rgba(0, 0, 0, .04)',
                  color: 'rgba(0, 0, 0, 0.87)'
                }
              }
            },
            column: {
              title: {
                font: {
                  weight: '500'
                }
              }
            }
          },
          autocomplete: {
            dropdown: {
              background: '#274b5f',
              color: '#ffffff',
              hover: {
                background: '#ad1457',
                color: '#ffffff'
              },
              border: {
                color: '#274b5f'
              }
            }
          },
          floatlabel: {
            font: {
              weight: '400'
            }
          },
          fileupload: {
            header: {
              padding: '0.75rem'
            },
            content: {
              padding: '0.75rem'
            }
          },
          dialog: {
            footer: {
              padding: '10.5px 17.5px 10.5px 17.5px'
            },
            title: {
              font: {
                weight: '500'
              }
            }
          },
          fieldset: {
            padding: '4.9px',
            legend: {
              font: {
                weight: '500'
              }
            }
          },
          inputgroup: {
            padding: '0.75'
          },
          inputtext: {
            color: 'rgba(0, 0, 0, .87)',
            disabled: {
              background: '#ffffff',
              color: 'rgba(0, 0, 0, .87)'
            }
          },
          button: {
            padding: {
              y: '0.643rem'
            }
          }
        }
      }
    })
  ]
})
export class OneCXHelpModule implements DoBootstrap {
  constructor(private readonly injector: Injector) {
    console.info('OneCX Help Module constructor')
  }

  ngDoBootstrap(): void {
    createAppEntrypoint(AppEntrypointComponent, 'ocx-help-component', this.injector)
  }
}
