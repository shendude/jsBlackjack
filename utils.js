//card logic
class Deck {
  constructor() {
    let ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    this.cards = ranks.concat(ranks, ranks, ranks);
    this.curr = 0;
  }
  shuffle() {
    for (let i = 0; i < this.cards.length - 1; i++) {
      let tar = Math.floor(Math.random() * (this.cards.length - i) + i);
      let temp = this.cards[tar];
      this.cards[tar] = this.cards[i];
      this.cards[i] = temp;
    }
  }
  get() {
    this.curr++;
    return this.cards[this.curr - 1];
  }
}

//game state logic
class Game {
  
  //initializes game state
  constructor() {
    this.p1 = {id: 1, hand: 0, aces: 0, stay: false};
    this.p2 = {id: 2, hand: 0, aces: 0, stay: false};
    this.turn = this.p2;
    this.other = this.p1;
    this.d = new Deck();
    this.d.shuffle();
    this.switch();
  }
  
  //recieves user commands
  interpret(str) {
    str = parser(str);
    if (str.length === 0) {
      console.log('current hand: ' + this.turn.hand);
      console.log('type hit or type stay');
    } else if (str === 'hit') {
      this.deal(this.turn);
      this.switch();
    } else if (str === 'stay') {
      this.turn.stay = true;
      this.switch();
    }
  }
  
  //switchs players
  switch() {
    if ((this.turn.id === 2) && (!this.p1.stay)) {
      console.log('player 1 press enter');
      this.turn = this.p1;
      this.other = this.p2;
    } else if ((this.turn.id === 1) && (!this.p2.stay)) {
      console.log('player 2 press enter');
      this.turn = this.p2;
      this.other = this.p1;
    } else if (!this.turn.stay && this.other.stay) {
      console.log('other player stays');
    } else {
      console.log('both stay');
      this.finish();
    }
  }
  
  //hit command
  deal(player) {
    const card = this.d.get();
    const suits = {'11': 'J', '12': 'Q', '13': 'K'};
    if (card > 10) {
      console.log('got a ' + suits['' + card]);
      player.hand += 10;
    } else if (card === 1) {
      console.log('got an ace!');
      player.hand += 11;
      player.aces ++;
    } else {
      console.log('got a ' + card);
      player.hand += card
    }
    this.check(player);
  }
  
  //check for bust, 21
  check(player) {
    if (player.hand === 21) {
      console.log('you got blackjack!');
      this.win(player);
    } else if (player.hand > 21) {
      if (player.aces > 0) {
        player.hand -= 10;
        player.aces --;
      } else {
        console.log('BUST');
        this.lose(player);
      }
    }
  }
  
  //checks who has the better hand 
  finish() {
    if (this.p1.hand === this.p2.hand) {
      console.log('tie');
      process.exit();
    }
    this.p1.hand > this.p2.hand ? this.win(this.p1) : this.win(this.p2);
  }
  
  //game end states
  lose(player) {
    const winner = player.id === 1 ? 2 : 1;
    console.log('player ' + winner + ' wins');
    process.exit();
  }
  win(player) {
    console.log('player ' + player.id + ' wins! with a hand of ' + player.hand);
    process.exit();
  }
}

//user input cleaner, sanitizer
var parser = (str) => {
  str = str.split(/\W/).join('');
  return str.toLowerCase();
}

module.exports = {Game: Game};