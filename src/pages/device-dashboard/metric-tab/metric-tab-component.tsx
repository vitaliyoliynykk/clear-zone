import { Badge } from '@chakra-ui/react';
import { FC } from 'react';

import { TabContainer } from './styled-component';

const MetricTabComponent: FC<{
  metric: string;
  value: string;
  badgeColor: string;
  status: string;
  state?: string | null;
  onClick?: () => void;
}> = ({ metric, value, badgeColor, status, onClick, state }) => {
  return (
    <TabContainer onClick={onClick}>
      <p style={{ fontWeight: 'bold' }}>{metric}</p>
      <p>
        {value} <Badge colorPalette={badgeColor}>{status}</Badge>{' '}
        {state ? <Badge colorPalette="teal">{state}</Badge> : null}
      </p>
    </TabContainer>
  );
};

export default MetricTabComponent;
