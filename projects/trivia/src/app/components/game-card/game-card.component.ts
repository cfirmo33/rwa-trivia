import { Component, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { Observable, Subscription, timer, interval } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { User, Game, Category, PlayerMode, GameStatus, CalenderConstants } from 'shared-library/shared/model';
import { Utils } from 'shared-library/core/services';
import { AppState, appState, categoryDictionary } from '../../store';
import { take } from 'rxjs/operators';
import { AutoUnsubscribe } from 'shared-library/shared/decorators';

@Component({
  selector: 'game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss']
})

@AutoUnsubscribe()
export class GameCardComponent implements OnInit, OnChanges, OnDestroy {

  @Input() game: Game;
  @Input() cardType: any;
  @Input() userDict: { [key: string]: User };
  user$: Observable<User>;
  correctAnswerCount: number;
  questionIndex: number;
  user: User;
  myTurn: boolean;
  otherUserId: string;
  otherUserInfo: User;
  public remainingHours: string;
  public remainingMinutes: string;
  timerSub: Subscription;
  categoryDict$: Observable<{ [key: number]: Category }>;
  categoryDict: { [key: number]: Category };
  randomCategoryId = 0;
  PlayerMode = PlayerMode;
  totalRound = 16;
  gameStatus: any;
  defaultAvatar = 'assets/images/default-avatar-small.png';
  userDict$: Observable<{ [key: string]: User }>;
  constructor(public store: Store<AppState>, public utils: Utils) {

    this.gameStatus = GameStatus;
    this.user$ = this.store.select(appState.coreState).pipe(select(s => s.user));
    this.user$.subscribe(user => {
      if (user !== null) {
        this.user = user;
      }
    });

    this.userDict$ = store.select(appState.coreState).pipe(select(s => s.userDict));
    this.userDict$.subscribe(userDict => {
      this.userDict = userDict;
      if (this.game) {
        this.otherUserId = this.game.playerIds.filter(userId => userId !== this.user.userId)[0];
        this.otherUserInfo = this.userDict[this.otherUserId];
      }
    });

    this.categoryDict$ = store.select(categoryDictionary);
    this.categoryDict$.subscribe(categoryDict => this.categoryDict = categoryDict);

  }

  ngOnInit() {
    this.store.select(appState.coreState).pipe(take(1)).subscribe(s => {
      this.user = s.user;
      this.myTurn = this.game.nextTurnPlayerId === this.user.userId;
      this.randomCategoryId = Math.floor(Math.random() * this.game.gameOptions.categoryIds.length);
      if (this.myTurn) {
        this.updateRemainingTime();
      }
    });
  }

  ngOnChanges() {
    this.questionIndex = this.game.playerQnAs.length;
    this.correctAnswerCount = this.game.playerQnAs.filter((p) => p.answerCorrect).length;
    if (this.game) {
      this.otherUserId = this.game.playerIds.filter(userId => userId !== this.user.userId)[0];
      this.otherUserInfo = this.userDict[this.otherUserId];
    }
  }

  getImageUrl(user: User) {
    return this.utils.getImageUrl(user, 70, 60, '70X60');
  }

  ngOnDestroy() {

  }

  updateRemainingTime() {
    this.timerSub = timer(1000, 1000).subscribe(t => {
      if (this.game.nextTurnPlayerId === this.user.userId) {

        const diff = this.utils.getTimeDifference(this.game.turnAt);
        const hour = Math.floor(diff / (CalenderConstants.HOURS_CALCULATIONS));
        const minute = Math.floor(diff % (CalenderConstants.HOURS_CALCULATIONS) / (CalenderConstants.MINUTE_CALCULATIONS));

        if (minute > 0) {
          this.remainingHours = this.utils.convertIntoDoubleDigit(31 - hour);
          this.remainingMinutes = this.utils.convertIntoDoubleDigit(60 - minute);

        } else {
          this.remainingHours = this.utils.convertIntoDoubleDigit(32 - hour);
          this.remainingMinutes = this.utils.convertIntoDoubleDigit(0);
        }
      }
    });
  }
}
