import React, { useState } from 'react';

export const TruncatedText = ({ text, maxLength = 100, className = '', moreClassName = '', testId }) => {
  const [expanded, setExpanded] = useState(false);

  if (!text) return null;
  if (text.length <= maxLength) {
    return <p className={className} data-testid={testId}>{text}</p>;
  }

  return (
    <p className={className} data-testid={testId}>
      {expanded ? text : `${text.slice(0, maxLength).trimEnd()}...`}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setExpanded((v) => !v);
        }}
        data-testid={testId ? `${testId}-toggle` : undefined}
        className={`ml-1 underline underline-offset-2 hover:text-amber-700 transition-colors ${moreClassName}`}
      >
        {expanded ? 'less' : 'more'}
      </button>
    </p>
  );
};
