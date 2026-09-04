"use client";

import React, { useMemo } from "react";
import katex from "katex";

interface MathProps {
  math: string;
  className?: string;
}

export const InlineMath: React.FC<MathProps> = ({ math, className = "" }) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, { displayMode: false, throwOnError: false });
    } catch {
      return math;
    }
  }, [math]);

  return (
    <span
      className={`inline-math ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export const BlockMath: React.FC<MathProps> = ({ math, className = "" }) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, { displayMode: true, throwOnError: false });
    } catch {
      return math;
    }
  }, [math]);

  return (
    <div
      className={`block-math overflow-x-auto my-2 py-1 text-center ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
