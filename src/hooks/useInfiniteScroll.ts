import { useEffect, useRef } from "react";

function useInfiniteScroll(callback: () => void) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          callback(); // Load more memes when in view
        }
      },
      { threshold: 1.0 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [callback]);

  return { ref };
}

export default useInfiniteScroll;
