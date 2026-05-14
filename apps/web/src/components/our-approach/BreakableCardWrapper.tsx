import React from 'react';
import { BreakableCard } from '@/components/ui/kinetic-shatter-box-section';

interface BreakableCardWrapperProps {
  title: string;
  subtitle?: string;
  description: string;
  isBullet?: boolean;
  pricing?: string;
}

export default function BreakableCardWrapper({ title, subtitle, description, isBullet, pricing }: BreakableCardWrapperProps) {
  return (
    <BreakableCard
      title={title}
      subtitle={subtitle}
      description={description}
      isBullet={isBullet}
      pricing={pricing}
      className="text-black"
    />
  );
}
