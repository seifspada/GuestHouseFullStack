import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true, // Required for standalone components
  imports: [RouterOutlet], // Correctly include RouterOutlet here
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // Note: Use styleUrls (plural) instead of styleUrl
})
export class AppComponent {
  title = 'frontmaison';
}