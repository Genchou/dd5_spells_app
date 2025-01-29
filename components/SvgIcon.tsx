import { FC } from 'react';
import Svg, { Path, SvgProps, SvgXml } from 'react-native-svg';

type SvgIconProps = {
  svg: string;
  size: number;
  color: string;
} & SvgProps;

const xml = `
`;

export const SvgIcon: FC<SvgIconProps> = ({ color, size, ...otherProps }) => {
  return <SvgXml fill={color} height={size} width={size} xml={xml} />;
};
