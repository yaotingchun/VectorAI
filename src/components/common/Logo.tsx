import React from 'react';
import vectorLogo from '../../assets/vector-logo.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  collapsed?: boolean;
  showSubtitle?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  collapsed = false,
  className = '',
  style,
}) => {
  const heightMap = {
    sm: 26,
    md: 36,
    lg: 50,
  };

  const height = heightMap[size];

  if (collapsed) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...style,
        }}
        title="Vector.ai"
      >
        <img
          src={vectorLogo}
          alt="Vector.ai"
          style={{
            height: `${height}px`,
            width: `${height}px`,
            objectFit: 'cover',
            objectPosition: 'left center',
            display: 'block',
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center select-none ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        ...style,
      }}
    >
      <img
        src={vectorLogo}
        alt="Vector.ai - Factory Intelligence Platform"
        style={{
          height: `${height}px`,
          width: 'auto',
          maxWidth: '100%',
          objectFit: 'contain',
          display: 'block',
        }}
      />
    </div>
  );
};

export default Logo;
