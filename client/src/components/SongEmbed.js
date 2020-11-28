import React, { Component } from 'react';

class SongEmbed extends Component {

  renderNoPlay = () => {
    return (
      <div className='play-button'></div>
    )
  }

  renderAutoPlay = () => {
    const song = this.props.song;
    return (
      <iframe
        title={`${song.videoId}-iframe`}
        width='160'
        height='90'
        src={`https://www.youtube.com/embed/${song.videoId}?rel=0&showinfo=0&autoplay=1`} frameBorder='0'
        allow='autoplay; encrypted-media'
        allowFullScreen
      >
      </iframe>
    )
  }

  componentDidMount() {
    this.props.ytplayStateReset();
  }

  render() {
    const song = this.props.song;
    return (
      <div
        className='youtube song-embed'
        data-embed={`${song.videoId}`}
        onClick={() => this.props.videoPlay(song.videoId)}
      >
        <img 
          className='yt-lazy-image'
          src={`https://img.youtube.com/vi/${song.videoId}/mqdefault.jpg`}
          alt='song preview'
        ></img>
        {this.props.play ? this.renderAutoPlay() : this.renderNoPlay()}
      </div>
    )
  }
}

export default SongEmbed;