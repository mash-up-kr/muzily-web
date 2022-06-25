import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import type { YouTubePlayer } from "react-youtube";
import YouTube from "react-youtube";

// import "./styles.css";

const VIDEO_LIST = [
  {
    id: "4q4vpQCIZ6w",
    artist: "-",
    title: "재즈 플레이리스트1",
  },
  {
    id: "2HQag9B4nN0",
    artist: "-",
    title: "재즈 플레이리스트2",
  },
  {
    id: "D1PvIWdJ8xo",
    artist: "아이유",
    title: "Blueming",
  },
  {
    id: "d9IxdwEFk1c",
    artist: "아이유",
    title: "Palette",
  },
];

const VIDEOS = ["4q4vpQCIZ6w", "2HQag9B4nN0"];

function YouTubeComponentExample() {
  const [player, setPlayer] = useState<YouTubePlayer>();
  const [videoId, setVideoId] = useState(VIDEO_LIST[0].id);
  const [width, setWidth] = useState(1);
  const [hidden, setHidden] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [mute, setMute] = useState(true);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setMute(false);
  //   }, 3000);
  // }, [])

  return (
    <div className="App">
      {/* <div style={{ display: "flex", marginBottom: "1em" }}>
        <button type="button" onClick={() => player?.seekTo(120, true)}>
          Seek to 2 minutes
        </button>
        <button
          type="button"
          onClick={() => setVideoIndex((videoIndex + 1) % VIDEOS.length)}
        >
          Change video
        </button>
        <label>
          <input
            type="range"
            min="300"
            max="1080"
            value={width}
            onChange={(event) => setWidth(event.currentTarget.valueAsNumber)}
          />
          Width ({width}px)
        </label>
        <button type="button" onClick={() => setHidden(!hidden)}>
          {hidden ? "Show" : "Hide"}
        </button>
        <label>
          <input
            type="checkbox"
            checked={autoplay}
            onChange={(event) => setAutoplay(event.currentTarget.checked)}
          />
          Autoplaying
        </label>
      </div> */}

      <div>
        {VIDEO_LIST.map((el) => (
          <div key={el.id}>
            <div>{el.artist}</div>
            <div>{el.title}</div>
            <button onClick={() => setVideoId(el.id)}>재생하기</button>
          </div>
        ))}
      </div>
      {hidden ? (
        "mysterious"
      ) : (
        <YouTube
          videoId={videoId}
          opts={{
            width,
            height: width * (9 / 16),
            playerVars: {
              // autoplay: autoplay ? 1 : 0,
              autoplay: 1,
              // mute: mute ? 1 : 0,
              // controls: 0,
            },
          }}
          className="container"
          onReady={(event) => setPlayer(event.target)}
        />
      )}
    </div>
  );
}

export default YouTubeComponentExample;
