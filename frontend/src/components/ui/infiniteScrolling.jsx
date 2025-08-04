// components/common/InfiniteScrollWrapper.jsx
import React from "react";
import { useInView } from "react-intersection-observer";

const InfiniteScrollWrapper = ({ children, loadMore, hasMore, isLoading }) => {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: false });

  React.useEffect(() => {
    if (inView && hasMore && !isLoading) {
      loadMore();
    }
  }, [inView, hasMore, isLoading, loadMore]);

  return (
    <div>
      {children}

      {hasMore && (
        <div
          ref={ref}
          className="w-full h-32 flex justify-center items-center"
        >
          <span className="text-gray-500">Scroll to load more...</span>
        </div>
      )}

      {isLoading && (
        <p className="text-center mt-6 text-sm text-gray-500">
          Loading more...
        </p>
      )}
    </div>
  );
};

export default InfiniteScrollWrapper;
