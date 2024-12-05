import { Component } from '@angular/core';
import { PostLayoutPageComponent } from './pages/post-layout-page/post-layout-page.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [PostLayoutPageComponent]
})
export class AppComponent {
}
