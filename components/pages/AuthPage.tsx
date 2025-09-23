

import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../App';

const AuthPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formStep, setFormStep] = useState<'form' | 'verify'>('form');
    const [error, setError] = useState('');
    const [currentBg, setCurrentBg] = useState(0);
    const navigate = useNavigate();
    const context = useContext(AppContext);
    const backgroundImages = context?.siteConfig.authPageBackgrounds || [];

    useEffect(() => {
        if (backgroundImages.length === 0) return;
        const interval = setInterval(() => {
            setCurrentBg(prev => (prev + 1) % backgroundImages.length);
        }, 5000); // Change image every 5 seconds
        return () => clearInterval(interval);
    }, [backgroundImages.length]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (isLogin) {
            // Super Admin Check
            if (email.toLowerCase() === 'kazumi@gmail.com' && password === 'kazumiadmin') {
                context?.login(email, 'superadmin');
                navigate('/');
                return;
            }

            // Regular Customer Login (simulated)
            if (email && password) {
                context?.login(email, 'customer');
                navigate('/'); 
            } else {
                setError('Email atau kata sandi tidak valid.');
            }

        } else {
            // This is registration, so proceed to the verification step
            setFormStep('verify');
        }
    };

    const handleVerificationSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        const formData = new FormData(e.currentTarget);
        const code = formData.get('verificationCode') as string;

        // Simulate validation: check if the code is a 6-digit number
        if (code && code.length === 6 && /^\d{6}$/.test(code)) {
            alert('Verifikasi berhasil! Akun Anda telah dibuat. Anda akan diarahkan ke halaman utama.');
            navigate('/');
        } else {
            setError('Kode verifikasi tidak valid. Harap masukkan 6 digit kode yang benar.');
        }
    };

    const switchToRegister = () => {
        setIsLogin(false);
        setFormStep('form');
        setError('');
    };
    
    const switchToLogin = () => {
        setIsLogin(true);
        setFormStep('form');
        setError('');
    };

    return (
        <div className="auth-page-container">
            <div className="auth-page-background">
                {backgroundImages.map((img, index) => (
                    <div
                        key={index}
                        className={`background-image ${index === currentBg ? 'active' : ''}`}
                        style={{ backgroundImage: `url(${img})` }}
                    />
                ))}
            </div>
            <div className="login-container">
                <Link to="/" className="logo" style={{ textDecoration: 'none' }}>KAZUMI</Link>
                
                {formStep === 'form' ? (
                    <>
                        <p style={{color: '#4a5568', marginBottom: '1.5rem', fontSize: '1.1rem'}}>
                            {isLogin ? 'Selamat datang kembali!' : 'Buat akun baru Anda.'}
                        </p>
                        <form onSubmit={handleSubmit} className="auth-form">
                            {!isLogin && (
                                <>
                                    <div className="form-group">
                                        <label htmlFor="name" className="form-label">Nama Lengkap</label>
                                        <input type="text" id="name" name="name" placeholder="Masukkan nama lengkap Anda" required className="form-input" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="whatsapp" className="form-label">Nomor WA</label>
                                        <input type="tel" id="whatsapp" name="whatsapp" placeholder="Contoh: 081234567890" required className="form-input" />
                                    </div>
                                </>
                            )}
                            <div className="form-group">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input type="email" id="email" name="email" placeholder="Masukkan email Anda" required className="form-input" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password" className="form-label">Kata Sandi</label>
                                <input type="password" id="password" name="password" placeholder="Masukkan kata sandi Anda" required minLength={6} className="form-input" />
                            </div>
                            {error && <p className="error-message" style={{textAlign: 'center', marginBottom: '1rem'}}>{error}</p>}
                            <button type="submit" className="btn-primary">
                                {isLogin ? 'Login' : 'Daftar'}
                            </button>
                        </form>

                        <p className="link-text">
                            {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}
                            <button onClick={isLogin ? switchToRegister : switchToLogin} style={{marginLeft: '0.5rem'}}>
                                {isLogin ? 'Daftar Sekarang' : 'Login'}
                            </button>
                        </p>
                    </>
                ) : (
                    <>
                        <p style={{color: '#4a5568', marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: 'bold'}}>
                            Verifikasi Akun Anda
                        </p>
                         <p style={{color: '#4a5568', marginBottom: '1.5rem', fontSize: '0.95rem'}}>
                           Kami telah mengirimkan kode verifikasi ke email dan WhatsApp Anda. Silakan masukkan kode di bawah ini.
                        </p>
                        <form onSubmit={handleVerificationSubmit} className="auth-form">
                            <div className="form-group">
                                <label htmlFor="verificationCode" className="form-label">Kode Verifikasi</label>
                                <input type="text" id="verificationCode" name="verificationCode" placeholder="Masukkan 6 digit kode" required maxLength={6} className="form-input" />
                            </div>
                            {error && <p className="error-message" style={{textAlign: 'center', marginBottom: '1rem'}}>{error}</p>}
                            <button type="submit" className="btn-primary">
                                Verifikasi
                            </button>
                        </form>
                         <p className="link-text">
                            Salah memasukkan data?
                            <button onClick={() => setFormStep('form')} style={{marginLeft: '0.5rem'}}>
                                Kembali
                            </button>
                        </p>
                    </>
                )}
                
                <p className="link-text"><Link to="/">Kembali ke Beranda</Link></p>
            </div>
        </div>
    );
};

export default AuthPage;