import React from 'react';
import { LucideIcon, LucideProps } from 'lucide-react';

export interface IconProps extends Omit<LucideProps, 'ref'> {
  icon: LucideIcon;
}

export const Icon: React.FC<IconProps> = ({ icon: IconComponent, ...props }) => {
  return <IconComponent {...props} />;
}; 