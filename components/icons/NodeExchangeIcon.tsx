import React from 'react';

interface NodeExchangeIconProps {
  className?: string;
  size?: number;
}

export const NodeExchangeIcon: React.FC<NodeExchangeIconProps> = ({
  className = '',
  size = 24
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M2 16 L9 16"
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinecap="round"
      />

      <circle
        cx="13"
        cy="16"
        r="3.5"
        fill="currentColor"
      />

      <circle
        cx="26"
        cy="16"
        r="10"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
      />

      <circle
        cx="26"
        cy="16"
        r="7.5"
        stroke="currentColor"
        strokeWidth="1.8"
        fill="none"
      />

      <path
        d="M37 16 L46 16"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.6"
      />

      <path
        d="M1 6 L8 6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.4"
      />

      <path
        d="M1 26 L10 26"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.4"
      />

      <text
        x="26"
        y="16"
        fontSize="11"
        fontWeight="bold"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="currentColor"
      >
        $
      </text>
    </svg>
  );
};
