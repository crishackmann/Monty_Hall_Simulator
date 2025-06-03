
export enum GamePhase {
  AWAITING_INITIAL_PICK = 'AWAITING_INITIAL_PICK',
  MONTY_REVEALING = 'MONTY_REVEALING', // Brief state while Monty "thinks"
  AWAITING_FINAL_DECISION = 'AWAITING_FINAL_DECISION',
  SHOWING_RESULT = 'SHOWING_RESULT',
}

export interface DoorState {
  id: number;
  hasCar: boolean;
  isPlayerSelected: boolean; // Player's current/final pick
  isMontyOpened: boolean; // Door opened by Monty to reveal a goat
  // isRevealedAtEnd is implicit when GamePhase.SHOWING_RESULT
}

export interface GameStats {
  stayWins: number;
  stayGames: number;
  switchWins: number;
  switchGames: number;
}
