import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxUiLoaderConfigModule } from './shared/ngx-ui-loader-config.module';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NgxUiLoaderConfigModule 
],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('tcv-frontend');
}
