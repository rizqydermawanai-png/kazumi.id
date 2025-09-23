import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../App';

// Countdown Timer Component for the bubble
const CountdownTimer: React.FC<{ launchDate: string }> = ({ launchDate }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(launchDate) - +new Date();
        let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearTimeout(timer);
    });

    const pad = (num: number) => String(num).padStart(2, '0');

    return (
        <div className="event-countdown-timer">
            {timeLeft.days > 0 && `${pad(timeLeft.days)}d `}
            {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
        </div>
    );
};

// New component for the modal's countdown timer logic
const ModalCountdown: React.FC<{ launchDate: string }> = ({ launchDate }) => {
     const calculateTimeLeft = () => {
        const difference = +new Date(launchDate) - +new Date();
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
    };
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    useEffect(() => {
        const timer = setTimeout(() => { setTimeLeft(calculateTimeLeft()); }, 1000);
        return () => clearTimeout(timer);
    });

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
        <div className="countdown-timer">
            {timerComponents.length ? timerComponents : <span>Waktu Habis!</span>}
        </div>
    );
};


// Main Component
const FloatingActionBubbles: React.FC = () => {
    const context = useContext(AppContext);
    const { promotion, specialEvent } = context?.siteConfig || {};

    const [isPromoModalOpen, setPromoModalOpen] = useState(false);
    const [isEventModalOpen, setEventModalOpen] = useState(false);
    const [activeBubble, setActiveBubble] = useState<'promotion' | 'event' | null>(null);

    const availableBubbles: ('promotion' | 'event')[] = [];
    if (promotion?.enabled) availableBubbles.push('promotion');
    if (specialEvent?.enabled) availableBubbles.push('event');
    
    useEffect(() => {
        if (availableBubbles.length === 0) {
            setActiveBubble(null);
            return;
        }
        
        // Set initial bubble
        setActiveBubble(availableBubbles[0]);
        
        if (availableBubbles.length > 1) {
             const interval = setInterval(() => {
                setActiveBubble(prev => {
                    const currentIndex = availableBubbles.indexOf(prev!);
                    const nextIndex = (currentIndex + 1) % availableBubbles.length;
                    return availableBubbles[nextIndex];
                });
            }, 7000); // Change every 7 seconds
            return () => clearInterval(interval);
        }
    }, [promotion?.enabled, specialEvent?.enabled]);
    
    if (availableBubbles.length === 0) return null;

    return (
        <>
            <div className="floating-bubbles-container">
                {/* Promotion Bubble */}
                {promotion?.enabled && (
                    <div className={`bubble-wrapper ${activeBubble === 'promotion' ? 'visible' : ''}`}>
                        <div className="promotion-bubble" onClick={() => setPromoModalOpen(true)}>
                             {promotion.image.url.startsWith('data:video') ? (
                                <video src={promotion.image.url} className="promotion-thumbnail" autoPlay loop muted playsInline style={{ objectPosition: promotion.image.position }} />
                            ) : (
                                <img src={promotion.image.url} alt="Promotion" className="promotion-thumbnail" style={{ objectPosition: promotion.image.position }} />
                            )}
                        </div>
                    </div>
                )}

                {/* Special Event Bubble */}
                {specialEvent?.enabled && (
                     <div className={`bubble-wrapper ${activeBubble === 'event' ? 'visible' : ''}`}>
                         <div onClick={() => setEventModalOpen(true)} style={{ cursor: 'pointer' }}>
                            <div className="event-bubble">
                                {specialEvent.bubbleImage.url.startsWith('data:video') ? (
                                    <video src={specialEvent.bubbleImage.url} className="event-thumbnail" autoPlay loop muted playsInline style={{ objectPosition: specialEvent.bubbleImage.position }} />
                                ) : (
                                    <img src={specialEvent.bubbleImage.url} alt={specialEvent.title} className="event-thumbnail" style={{ objectPosition: specialEvent.bubbleImage.position }} />
                                )}
                            </div>
                            <CountdownTimer launchDate={specialEvent.launchDate} />
                         </div>
                     </div>
                )}
            </div>

            {/* Promotion Modal */}
            {promotion?.enabled && (
                <div className={`promotion-modal ${isPromoModalOpen ? 'active' : ''}`} onClick={() => setPromoModalOpen(false)}>
                    <div className="promotion-modal-content" onClick={e => e.stopPropagation()}>
                        <span className="close-button" onClick={() => setPromoModalOpen(false)}>&times;</span>
                        <img src={promotion.fullImage} alt="Promotion Full Image" className="promotion-full-image" />
                        <h3 className="promotion-modal-title">{promotion.title}</h3>
                        <p className="promotion-modal-description">{promotion.description}</p>
                        <Link to={promotion.link} className="promotion-modal-cta" onClick={() => setPromoModalOpen(false)}>{promotion.cta}</Link>
                    </div>
                </div>
            )}
            
            {/* Special Event Modal */}
            {specialEvent?.enabled && (
                <div className={`event-modal ${isEventModalOpen ? 'active' : ''}`} onClick={() => setEventModalOpen(false)}>
                    <div className="event-modal-content" onClick={e => e.stopPropagation()}>
                        <span className="close-button" onClick={() => setEventModalOpen(false)}>&times;</span>
                        <img src={specialEvent.images[0].url} alt="Event background" className="event-modal-background" style={{ objectPosition: specialEvent.images[0].position }} />
                        <div className="event-modal-body">
                            <h4 className="event-modal-pre-title">{specialEvent.preTitle}</h4>
                            <h3 className="event-modal-title">{specialEvent.title}</h3>
                            <p className="event-modal-description">{specialEvent.description}</p>
                            <ModalCountdown launchDate={specialEvent.launchDate} />
                            <Link to={specialEvent.ctaLink} className="event-modal-cta" onClick={() => setEventModalOpen(false)}>
                                {specialEvent.ctaText}
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default FloatingActionBubbles;