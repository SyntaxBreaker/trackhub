import {useState, useEffect} from 'react';

export default function useIsMobileView() {
    const [isMobile, setIsMobile] = useState(false);

    function handleWindowSizeChange() {
        setIsMobile(window.innerWidth <= 450);
    }

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange)
    
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange)
        }
    }, [])

    return isMobile;
}