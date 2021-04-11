import React, { useCallback, useState } from "react";
import { ReviewTemplate } from "../templates/ReviewTemplate";

export const ReviewPageContext = React.createContext({
  reloadCount: 0,
  reload: () => {},
});

const useReviewPageContext = () => {
  const [reloadCount, setReloadCount] = useState(0);
  return {
    reloadCount,
    reload: useCallback(() => setReloadCount(reloadCount + 1), [reloadCount]),
  };
};

export const ReviewPage = () => (
  <ReviewPageContext.Provider value={useReviewPageContext()}>
    <ReviewTemplate />
  </ReviewPageContext.Provider>
);
