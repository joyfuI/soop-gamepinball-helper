import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import LaunchIcon from '@mui/icons-material/Launch';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';

import BattleNetIcon from './icons/BattleNetIcon';
import EAIcon from './icons/EAIcon';
import EpicGamesIcon from './icons/EpicGamesIcon';
import GOGComIcon from './icons/GOGComIcon';
import SteamIcon from './icons/SteamIcon';
import UbisoftIcon from './icons/UbisoftIcon';

const actions = [
  {
    icon: <AccessTimeFilledIcon />,
    name: '플레이 타임 찾기',
    url: 'https://howlongtobeat.com/',
  },
  {
    icon: <SteamIcon />,
    name: 'Steam',
    url: 'https://store.steampowered.com/',
  },
  {
    icon: <EpicGamesIcon />,
    name: 'Epic Games',
    url: 'https://store.epicgames.com/ko/',
  },
  { icon: <EAIcon />, name: 'EA', url: 'https://www.ea.com/ko-kr/games' },
  {
    icon: <UbisoftIcon />,
    name: 'Ubisoft',
    url: 'https://www.ubisoft.com/ko-kr/games',
  },
  {
    icon: <BattleNetIcon />,
    name: 'Battle.net',
    url: 'https://kr.shop.battle.net/ko-kr',
  },
  { icon: <GOGComIcon />, name: 'GOG.com', url: 'https://www.gog.com/en/' },
] as const;

const LinkDial = () => {
  return (
    <SpeedDial
      ariaLabel="external link"
      icon={<LaunchIcon />}
      sx={{ position: 'fixed', bottom: 76, right: 16 }}
    >
      {actions.map((action) => (
        <SpeedDialAction
          icon={action.icon}
          key={action.name}
          onClick={() => window.open(action.url)}
          slotProps={{ tooltip: { title: action.name } }}
        />
      ))}
    </SpeedDial>
  );
};

export default LinkDial;
