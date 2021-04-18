// TempleOSRS Cache
import { playerStats } from '../../cache/templeCache';
// UTILS: Enums
import { TempleOther, GameMode, TrueOrFalse } from './enums';

export const gameModeCheck = (username: string): string => {
  const gameMode: GameMode =
    playerStats[username][TempleOther.INFO][TempleOther.GAME_MODE];
  if (gameMode === GameMode.IM) return GameModeString.IM;
  else if (gameMode === GameMode.UIM) return GameModeString.UIM;
  else if (gameMode === GameMode.HCIM) return GameModeString.HCIM;
  else return GameModeString.NORMAL;
};

export const skillerOrF2P = (username: string): string => {
  const skiller: number =
    playerStats[username][TempleOther.INFO][TempleOther.CB3];
  const f2p: number = playerStats[username][TempleOther.INFO][TempleOther.F2P];
  if (skiller === TrueOrFalse.TRUE && f2p === TrueOrFalse.TRUE)
    return SkillerOrF2p.BOTH;
  else if (skiller === TrueOrFalse.TRUE && f2p === TrueOrFalse.FALSE)
    return SkillerOrF2p.SKILLER;
  else if (skiller === TrueOrFalse.FALSE && f2p === TrueOrFalse.TRUE)
    return SkillerOrF2p.F2P;
  else return SkillerOrF2p.NONE;
};

export enum GameModeString {
  IM = 'IM',
  UIM = 'UIM',
  HCIM = 'HCIM',
  NORMAL = '',
}

export enum SkillerOrF2p {
  BOTH = 'Skiller and F2P',
  SKILLER = 'Level 3 skiller',
  F2P = 'F2P',
  NONE = 'None',
}
