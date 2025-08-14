import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const TypingEffectLink = ({ text, href, style }) => {
  const [displayText, setDisplayText] = useState('');
  const typingSpeed = 100; // Speed of typing in milliseconds

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayText(prev => prev + text[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <Link href={href} style={style}>
      {displayText}
    </Link>
  );
};

export default TypingEffectLink;