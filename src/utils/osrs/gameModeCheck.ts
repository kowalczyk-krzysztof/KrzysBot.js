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
// Game mode check for EHP and EHB commands
export const gameModeCheck = (username: string): string => {
  const gameMode: TempleGameMode =
    playerStats[username][TempleOther.INFO][TempleOther.GAME_MODE];
  if (gameMode === TempleGameMode.IM) return TempleGameModeFormatted.IM;
  if (gameMode === TempleGameMode.UIM) return TempleGameModeFormatted.UIM;
  if (gameMode === TempleGameMode.HCIM) return TempleGameModeFormatted.HCIM;
  return TempleGameModeFormatted.NORMAL;
};

export const skillerOrF2P = (username: string): string => {
  const skiller: number =
    playerStats[username][TempleOther.INFO][TempleOther.CB3];
  const f2p: number = playerStats[username][TempleOther.INFO][TempleOther.F2P];
  if (skiller === TempleTrueOrFalse.TRUE && f2p === TempleTrueOrFalse.TRUE)
    return SkillerOrF2p.BOTH;
  if (skiller === TempleTrueOrFalse.TRUE && f2p === TempleTrueOrFalse.FALSE)
    return SkillerOrF2p.SKILLER;
  if (skiller === TempleTrueOrFalse.FALSE && f2p === TempleTrueOrFalse.TRUE)
    return SkillerOrF2p.F2P;
  return SkillerOrF2p.NONE;
};
