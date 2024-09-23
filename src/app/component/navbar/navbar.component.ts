import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  @Input() user?: User;
  constructor(private userService: UserService, private router: Router) {}

  logOut(): void {
    //console.log('logout function');
    this.userService.logOut();
    this.router.navigate(['/login']);
  }
}
