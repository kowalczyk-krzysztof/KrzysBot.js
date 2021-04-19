// TempleOSRS Cache
import { playerStats } from '../../cache/templeCache';
// UTILS: Enums
import {
  TempleOther,
  TempleGameMode,
  TempleTrueOrFalse,
  TempleGameModeFormatted,
  SkillerOrF2p,
} from './enums';

export const gameModeCheck = (username: string): string => {
  const gameMode: TempleGameMode =
    playerStats[username][TempleOther.INFO][TempleOther.GAME_MODE];
  if (gameMode === TempleGameMode.IM) return TempleGameModeFormatted.IM;
  else if (gameMode === TempleGameMode.UIM) return TempleGameModeFormatted.UIM;
  else if (gameMode === TempleGameMode.HCIM)
    return TempleGameModeFormatted.HCIM;
  else return TempleGameModeFormatted.NORMAL;
};

export const skillerOrF2P = (username: string): string => {
  const skiller: number =
    playerStats[username][TempleOther.INFO][TempleOther.CB3];
  const f2p: number = playerStats[username][TempleOther.INFO][TempleOther.F2P];
  if (skiller === TempleTrueOrFalse.TRUE && f2p === TempleTrueOrFalse.TRUE)
    return SkillerOrF2p.BOTH;
  else if (
    skiller === TempleTrueOrFalse.TRUE &&
    f2p === TempleTrueOrFalse.FALSE
  )
    return SkillerOrF2p.SKILLER;
  else if (
    skiller === TempleTrueOrFalse.FALSE &&
    f2p === TempleTrueOrFalse.TRUE
  )
    return SkillerOrF2p.F2P;
  else return SkillerOrF2p.NONE;
};
