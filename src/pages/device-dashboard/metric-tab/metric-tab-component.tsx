import { Badge } from '@chakra-ui/react';
import { FC } from 'react';

import { theme } from '@/utils/theme';

const MetricTabComponent: FC<{
  metric: string;
  value: string;
  badgeColor: string;
  status: string;
  onClick?: () => void;
}> = ({ metric, value, badgeColor = 'green', status, onClick }) => {
  return (
    <div
      style={{
        padding: 8,
        borderRadius: theme.radius.medium,
        borderColor: theme.colors.grayDark,
        backgroundColor: theme.colors.white,
        borderWidth: 1,
        marginBottom: theme.spacing.sm,
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      <p style={{ fontWeight: 'bold' }}>{metric}</p>
      <p>
        {value} <Badge colorPalette={badgeColor}>{status}</Badge>
      </p>
    </div>
  );
};

export default MetricTabComponent;
