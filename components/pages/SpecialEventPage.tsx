import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../App';

const SpecialEventPage: React.FC = () => {
    const context = useContext(AppContext);
    const eventConfig = context?.siteConfig.specialEvent;

    const launchDate = useMemo(() => 
        eventConfig?.launchDate ? new Date(eventConfig.launchDate) : new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), 
        [eventConfig?.launchDate]
    );

    const [currentSlide, setCurrentSlide] = useState(0);
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    function calculateTimeLeft() {
        const difference = +launchDate - +new Date();
        let timeLeft: { [key: string]: number } = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        }

        return timeLeft;
    }

    useEffect(() => {
        if (!eventConfig || eventConfig.images.length === 0) return;
        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % eventConfig.images.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [eventConfig]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearTimeout(timer);
    });

    if (!eventConfig || !eventConfig.enabled) {
        return (
            <div className="page-container" style={{ textAlign: 'center', height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <h1 className="page-title">Tidak Ada Event Spesial</h1>
                <p>Saat ini tidak ada event spesial yang sedang berlangsung. Silakan kembali lagi nanti.</p>
                <Link to="/" className="cta-button" style={{marginTop: '2rem'}}>Kembali ke Beranda</Link>
            </div>
        );
    }

    const timerComponents = Object.entries(timeLeft).map(([interval, value]) => {
        if (value === undefined) return null;
        return (
            <div key={interval} className="countdown-item">
                <span className="countdown-value">{String(value).padStart(2, '0')}</span>
                <span className="countdown-label">{interval}</span>
            </div>
        );
    });

    return (
        <div className="special-event-page">
            <Link to="/" className="event-logo-link">KAZUMI</Link>
            <div className="event-slider-container">
                {eventConfig.images.map((img, index) => (
                    <div
                        key={index}
                        className={`event-slide ${index === currentSlide ? 'active' : ''}`}
                        style={{ 
                            backgroundImage: `url(${img.url})`,
                            backgroundPosition: img.position || 'center'
                        }}
                    />
                ))}
            </div>
            <div className="event-overlay">
                <div className="event-content">
                    <h2 className="event-pre-title">{eventConfig.preTitle}</h2>
                    <h1 className="event-title">{eventConfig.title}</h1>
                    <p className="event-description">{eventConfig.description}</p>
                    <div className="countdown-timer">
                        {timerComponents.length ? timerComponents : <span>Waktu Habis!</span>}
                    </div>
                    <Link to={eventConfig.ctaLink} className="event-cta-button">{eventConfig.ctaText}</Link>
                </div>
            </div>
        </div>
    );
};

export default SpecialEventPage;