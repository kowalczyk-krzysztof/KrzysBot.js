import { GameMode, playerStats } from '../../cache/templeCache';

export const gameModeCheck = (username: string): string => {
  const keyword: string = username;
  const gameMode: GameMode = playerStats[keyword].info['Game mode'];
  if (gameMode === GameMode.IM) return GameModeString.IM;
  else if (gameMode === GameMode.UIM) return GameModeString.UIM;
  else if (gameMode === GameMode.HCIM) return GameModeString.HCIM;
  else return GameModeString.NORMAL;
};

export const skillerOrF2P = (username: string): string => {
  const keyword: string = username;
  const skiller: number = playerStats[keyword].info['Cb-3'];
  const f2p: number = playerStats[keyword].info.F2p;
  if (skiller === 1 && f2p === 1) return SkillerOrF2p.BOTH;
  else if (skiller === 1 && f2p === 0) return SkillerOrF2p.SKILLER;
  else if (skiller === 0 && f2p === 1) return SkillerOrF2p.F2P;
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
