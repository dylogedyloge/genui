import { useState } from "react";

export const useVisibilityMap = (initialValue = 2) => {
  const [visibilityMap, setVisibilityMap] = useState<{
    [messageIndex: number]: { [invocationIndex: number]: number };
  }>({});

  const showMore = (messageIndex: number, invocationIndex: number) => {
    setVisibilityMap((prev) => ({
      ...prev,
      [messageIndex]: {
        ...prev[messageIndex],
        [invocationIndex]:
          (prev[messageIndex]?.[invocationIndex] || initialValue) + 2,
      },
    }));
  };

  const showLess = (messageIndex: number, invocationIndex: number) => {
    setVisibilityMap((prev) => ({
      ...prev,
      [messageIndex]: {
        ...prev[messageIndex],
        [invocationIndex]: Math.max(
          (prev[messageIndex]?.[invocationIndex] || initialValue) - 2,
          initialValue
        ),
      },
    }));
  };

  return { visibilityMap, showMore, showLess };
};
