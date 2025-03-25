import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PermissionsService } from '../../../rbac/src/public-api';
import { UsersApiService } from './app.config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [UsersApiService, PermissionsService]
})
export class AppComponent {
  title = 'test-app';
  constructor(
    permissionService: PermissionsService
  ) {
    permissionService.load().subscribe(r => {
    });
  }
}
