import React, { useEffect, useRef, useState } from 'react';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  animation?: 'fade' | 'slide-left' | 'slide-right';
  delay?: number;
  className?: string;
  id?: string;
}

const Section: React.FC<SectionProps> = ({ 
  children, 
  animation = 'fade', 
  delay = 0, 
  className = '', 
  id,
  ...props 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  const getAnimationClass = () => {
    if (!isVisible) return 'opacity-0 translate-y-10'; // Initial state
    switch (animation) {
      case 'slide-left': return 'animate-slide-left';
      case 'slide-right': return 'animate-slide-right';
      default: return 'animate-fade-in';
    }
  };

  return (
    <section 
      ref={ref}
      id={id}
      className={`transition-all duration-1000 ${getAnimationClass()} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
      {...props}
    >
      {children}
    </section>
  );
};

export default Section;