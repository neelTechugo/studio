import type { SVGProps } from 'react';

const VirtuFitLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    fill="currentColor"
    aria-label="VirtuFit Logo"
    {...props}
  >
    <path d="M20 10 L20 90 L30 90 L30 55 L45 70 L55 70 L40 50 L55 30 L45 30 L30 45 L30 10 Z" />
    <path d="M60 10 Q 80 10 80 30 L80 70 Q 80 90 60 90 L60 80 Q 70 80 70 70 L70 30 Q 70 20 60 20 Z" />
  </svg>
);

export default VirtuFitLogo;
