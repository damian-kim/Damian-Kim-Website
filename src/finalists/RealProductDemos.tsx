import { useCallback, useEffect, useRef, useState } from 'react';
import './realProductDemos.css';

export function JunoSourceDemo() {
  const [launched, setLaunched] = useState(false);

  return (
    <div className="juno-live-embed">
      <header><div><i /> JUNO <small>LIVE APPLICATION BUILD</small></div><span>E:\Juno\juno · Agora RTC</span></header>
      {launched ? (
        <iframe
          src="/demos/juno/index.html?embed=portfolio"
          title="Interactive Juno voice and video application"
          allow="microphone; camera; display-capture; autoplay"
        />
      ) : (
        <div className="juno-live-launch">
          <div>
            <h3>Step inside Juno.</h3>
            <button type="button" onClick={() => setLaunched(true)}>Try it out</button>
          </div>
        </div>
      )}
    </div>
  );
}

export function SateSourceDemo() {
  return (
    <div className="sate-live-embed">
      <header><div><i /> SATE <small>LIVE APPLICATION BUILD</small></div><span>GROUP RESTAURANT RECOMMENDATIONS</span></header>
      <iframe
        src="/demos/sate/index.html"
        title="Interactive Sate restaurant recommendation application"
        allow="geolocation"
      />
    </div>
  );
}

type Camera = 'camera_a' | 'camera_b';
type VideoKind = 'stripped' | 'replay_original';
const GOLFIE_ASSET_ROOT = '/demos/golfie/8497991969ec';
const SPEEDS = [0.25, 0.5, 1, 1.5, 2];

export function GolfieSourceSwingDemo() {
  const videos = useRef(new Map<string, HTMLVideoElement>());
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(1);
  const frameRate = 30;

  const register = (key: string) => (node: HTMLVideoElement | null) => {
    if (node) videos.current.set(key, node); else videos.current.delete(key);
  };
  const seekAll = useCallback((next: number) => {
    const bounded = Math.max(0, Math.min(next, duration));
    videos.current.forEach((video) => { if (Number.isFinite(video.duration)) video.currentTime = Math.min(bounded, video.duration); });
    setTime(bounded);
  }, [duration]);
  const setAllPlaying = useCallback((next: boolean) => {
    setPlaying(next);
    videos.current.forEach((video) => {
      video.playbackRate = speed;
      if (next) void video.play().catch(() => setPlaying(false)); else video.pause();
    });
  }, [speed]);

  useEffect(() => { videos.current.forEach((video) => { video.playbackRate = speed; }); }, [speed]);

  const src = (camera: Camera, kind: VideoKind) => `${GOLFIE_ASSET_ROOT}/${camera}_${kind}.mp4`;
  return (
    <div className="golfie-source-swing">
      <header><div><i /> GOLFIE VISION <small>SESSION 8497991969EC</small></div><span>REAL PROCESSED OUTPUT · 30 FPS</span></header>
      <div className="golfie-source-legend">
        <span><i className="key-left" />Anatomical left arm</span><span><i className="key-right" />Anatomical right arm</span><span><i className="key-shoulder" />Shoulder axis</span><span><i className="key-hips" />Hip axis</span><span><i className="key-center" />2D posture center</span>
      </div>
      <div className="golfie-source-cameras">
        {(['camera_a', 'camera_b'] as Camera[]).map((camera, cameraIndex) => (
          <section key={camera}><h3>{camera === 'camera_a' ? 'Camera A · Down the line' : 'Camera B · Face on'}</h3>
            <figure><figcaption>Body + pose analysis</figcaption><video ref={register(`${camera}-analysis`)} src={src(camera, 'stripped')} muted playsInline preload="metadata" onLoadedMetadata={(event) => { event.currentTarget.playbackRate = speed; if (cameraIndex === 0) setDuration(event.currentTarget.duration || 1); }} onTimeUpdate={cameraIndex === 0 ? (event) => { const master = event.currentTarget; setTime(master.currentTime); videos.current.forEach((video) => { if (video !== master && Math.abs(video.currentTime - master.currentTime) > .06) video.currentTime = Math.min(master.currentTime, video.duration || master.currentTime); }); } : undefined} onEnded={cameraIndex === 0 ? () => setAllPlaying(false) : undefined} /></figure>
            <figure><figcaption>Original uploaded frames</figcaption><video ref={register(`${camera}-original`)} src={src(camera, 'replay_original')} muted playsInline preload="metadata" /></figure>
          </section>
        ))}
      </div>
      <div className="golfie-source-timeline"><input aria-label="Replay position" type="range" min="0" max={duration} step={1 / frameRate} value={Math.min(time, duration)} onChange={(event) => { setAllPlaying(false); seekAll(Number(event.target.value)); }} /><span>{time.toFixed(2)}s / {duration.toFixed(2)}s</span></div>
      <footer><div><button type="button" onClick={() => { setAllPlaying(false); seekAll(time - 1 / frameRate); }}>│◀</button><button type="button" className="golfie-source-play" onClick={() => setAllPlaying(!playing)}>{playing ? 'Pause' : 'Play'}</button><button type="button" onClick={() => { setAllPlaying(false); seekAll(time + 1 / frameRate); }}>▶│</button></div><label>Speed<select value={speed} onChange={(event) => setSpeed(Number(event.target.value))}>{SPEEDS.map((value) => <option key={value} value={value}>{value}×</option>)}</select></label><span>← → frame step · synchronized dual-camera replay</span></footer>
    </div>
  );
}
