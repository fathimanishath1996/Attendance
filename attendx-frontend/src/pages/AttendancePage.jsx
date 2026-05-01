import { useState, useEffect, useRef } from 'react';
import { Camera, MapPin, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { calculateDistance, OFFICE_LOCATION, MAX_DISTANCE_METERS } from '../utils/geo';
import api from '../utils/api';

const AttendancePage = () => {
  const [location, setLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [error, setError] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [status, setStatus] = useState(null); // 'none', 'present', 'checked-out'

  useEffect(() => {
    getLocation();
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const { data } = await api.get('/attendance/today');
      if (data) {
        if (data.check_out_time) setStatus('checked-out');
        else setStatus('present');
      } else {
        setStatus('none');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      setError("Could not access camera");
    }
  };

  const capturePhoto = () => {
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, 400, 300);
    const dataUrl = canvasRef.current.toDataURL('image/jpeg');
    setCapturedImage(dataUrl);
    
    // Stop camera stream
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    setCameraActive(false);
  };

  const getLocation = () => {
    setError(null);
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        
        const dist = calculateDistance(
          latitude, 
          longitude, 
          OFFICE_LOCATION.lat, 
          OFFICE_LOCATION.lng
        );
        setDistance(dist);
      },
      (err) => {
        setError("Please enable location access to check in");
      }
    );
  };

  const handleAction = async () => {
    if (distance > MAX_DISTANCE_METERS) {
      alert("You are too far from the office!");
      return;
    }

    setLoading(true);
    try {
      // 1. Convert DataURL to Blob
      const response = await fetch(capturedImage);
      const blob = await response.blob();

      // 2. Prepare FormData
      const formData = new FormData();
      formData.append('photo', blob, 'selfie.jpg');
      formData.append('lat', location.lat);
      formData.append('lng', location.lng);

      // 3. Call API
      const endpoint = status === 'none' ? '/attendance/checkin' : '/attendance/checkout';
      
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      alert(status === 'none' ? "Checked in successfully!" : "Checked out successfully!");
      fetchStatus();
      setCapturedImage(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Attendance</h1>
        <p style={{ color: 'var(--text-muted)' }}>GPS & Photo verification required</p>
      </header>

      {error && (
        <div style={{ background: '#fee2e2', color: 'var(--danger)', padding: '1rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
          <AlertCircle size={20} /> {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Location Card */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <MapPin style={{ color: distance <= MAX_DISTANCE_METERS ? 'var(--success)' : 'var(--danger)' }} />
              <span style={{ fontWeight: '600' }}>Office Proximity</span>
            </div>
            <button onClick={getLocation} style={{ color: 'var(--primary)' }}><RefreshCw size={18} /></button>
          </div>
          
          <div style={{ padding: '1rem', background: 'var(--bg-main)', borderRadius: 'var(--radius)' }}>
            {distance !== null ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>Distance:</span>
                  <span style={{ fontWeight: 'bold' }}>{Math.round(distance)} meters</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  Current: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </div>
                <div style={{ fontSize: '0.875rem', color: distance <= MAX_DISTANCE_METERS ? 'var(--success)' : 'var(--danger)' }}>
                  {distance <= MAX_DISTANCE_METERS ? "✓ Within Range" : "✗ Too far from office"}
                </div>
              </>
            ) : (
              <div>Fetching location...</div>
            )}
          </div>
        </div>

        {/* Camera Card */}
        <div className="card" style={{ textAlign: 'center' }}>
          {!capturedImage ? (
            <>
              <div style={{ width: '100%', aspectRatio: '4/3', background: '#000', borderRadius: 'var(--radius)', overflow: 'hidden', marginBottom: '1rem', position: 'relative' }}>
                <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', display: cameraActive ? 'block' : 'none' }} />
                {!cameraActive && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <Camera size={48} opacity={0.3} />
                  </div>
                )}
              </div>
              {!cameraActive ? (
                <button className="btn btn-primary" style={{ width: '100%' }} onClick={startCamera}>Open Camera</button>
              ) : (
                <button className="btn btn-primary" style={{ width: '100%' }} onClick={capturePhoto}>Capture Selfie</button>
              )}
            </>
          ) : (
            <>
              <img src={capturedImage} alt="Selfie" style={{ width: '100%', borderRadius: 'var(--radius)', marginBottom: '1rem' }} />
              <button className="btn" style={{ width: '100%', border: '1px solid var(--border)' }} onClick={() => setCapturedImage(null)}>Retake Photo</button>
            </>
          )}
        </div>

        {/* Submit Button */}
        <button 
          className="btn btn-primary" 
          disabled={!location || distance > MAX_DISTANCE_METERS || !capturedImage || loading}
          style={{ padding: '1.25rem', fontSize: '1.1rem', opacity: (!location || distance > MAX_DISTANCE_METERS || !capturedImage) ? 0.5 : 1 }}
          onClick={handleAction}
        >
          {loading ? 'Processing...' : (status === 'none' ? 'Confirm Check-In' : 'Confirm Check-Out')}
        </button>
      </div>

      <canvas ref={canvasRef} width="400" height="300" style={{ display: 'none' }} />
    </div>
  );
};

export default AttendancePage;
