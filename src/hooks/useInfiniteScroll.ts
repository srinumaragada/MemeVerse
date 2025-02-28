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
      { threshold: 0.1 } // Trigger when 10% of the element is visible
    );

    const currentRef = ref.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [callback]);

  return { ref };
}

export default useInfiniteScroll;