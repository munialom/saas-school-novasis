// useMediaQuery.ts
import { useState, useEffect } from 'react';

function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return; // Skip if not in a browser environment
        }

        const mediaQueryList = window.matchMedia(query);
        const handleChange = () => setMatches(mediaQueryList.matches);

        handleChange(); // Initial check
        mediaQueryList.addEventListener('change', handleChange);

        return () => {
            mediaQueryList.removeEventListener('change', handleChange);
        };
    }, [query]);

    return matches;
}

export default useMediaQuery;