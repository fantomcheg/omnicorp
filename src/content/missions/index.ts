import { firstMission } from './firstMission';
import { realIdorMission } from './realIdorMission';
import { secondMission } from './secondMission';

export const missions = [firstMission, secondMission, realIdorMission] as const;
