import { GameMode, playerStats } from '../../cache/templeCache';

export const gameModeCheck = (username: string): string => {
  const keyword: string = username;
  const gameMode: GameMode = playerStats[keyword].info['Game mode'];
  if (gameMode === GameMode.IM) return 'IM';
  else if (gameMode === GameMode.UIM) return 'UIM';
  else if (gameMode === GameMode.HCIM) return 'HCIM';
  else return '';
};
