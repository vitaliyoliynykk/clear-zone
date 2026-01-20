import { Badge } from '@chakra-ui/react';
import { FC } from 'react';

import { TabContainer } from './styled-component';

const MetricTabComponent: FC<{
  metric: string;
  value: string;
  badgeColor: string;
  status: string;
  onClick?: () => void;
}> = ({ metric, value, badgeColor = 'green', status, onClick }) => {
  return (
    <TabContainer onClick={onClick}>
      <p style={{ fontWeight: 'bold' }}>{metric}</p>
      <p>
        {value} <Badge colorPalette={badgeColor}>{status}</Badge>
      </p>
    </TabContainer>
  );
};

export default MetricTabComponent;
