import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Store, select } from '@ngrx/store';
import { AppState, appState } from './../store';
import { User } from './../../../../shared-library/src/lib/shared/model';
import { Subscription } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { TNSFirebaseService } from './../nativescript/core/services/tns-firebase.service';
// import { DbService } from 'shared-library/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit {
  user: User = new User();
  sub: Subscription;
  constructor(private router: Router,
    private store: Store<AppState>,
    // private dbUserService: DBUserService,
    private tnsFirebaseService: TNSFirebaseService,
 ) {
  // private dbService: DbService
  }

  ngOnInit() {
    this.sub = this.store.select(appState.coreState).pipe(select(s => s.user)).subscribe(user => {
      this.user = user;
      console.log('home', this.user);
    });
    const users: User = new User();
    users.email = "jitendra.ashutec@gmail.com";
    users.userId = "lZxdGMVkvkQehoa4ZkPVLE71phm1";
    users.displayName = "jitendra prajapati";
    // this.dbUserService.loadUserProfile2(users).subscribe(res => {
    //   console.log('res', res);
    // });

    // this.dbUserService.loadUserProfile2(users).pipe(map(u => {
    //   console.log('user called uu', u)
    // })).subscribe(response => {
    //   console.log('response in 45 >>> ', response);
    // })

    // this.dbService.getUser(users).pipe(map(u => {
    //     console.log('de');
    // }));
  }


  logout() {
    // this.firebaseService.logout();
    // firebase.logout();

    this.tnsFirebaseService.logout();
    this.router.navigate(["login"]);

  }
}
