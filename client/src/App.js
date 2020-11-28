import React, { Component } from 'react';
import SortBar from './components/SortBar';
import SongList from './components/SongList';
import LayoutChange from './components/LayoutChange';
import ChannelBox from './components/ChannelBox';

class App extends Component {  
  constructor(props) {
    super(props);

    this.state = {
      songs: null,
      ytplay: {},
      ytplayDefault: {},
      groupChannels: false,
      sortDateNewest: true,
      layoutChange: false,
      channelSort: {
        Proximity: true,
        'Revealed Music': true,
        'Thrilling Music': true,
        WaveMusic: true,
      },
      logos: {
        Proximity: 'proximity',
        'Revealed Music': 'revealed',
        'Thrilling Music': 'thrilling',
        WaveMusic: 'wavemusic',
      },
    };
  }

  songsSet = (songsNew) => {
    this.setState({
      songs: songsNew
    })
  }

  ytplayStateInit = () => {
    this.state.songs.map((song) => {
      this.setState({
        ytplay: {
          ...this.state.ytplay,
          [song.videoId] : false
        },
        ytplayDefault: {
          ...this.state.ytplayDefault,
          [song.videoId] : false
        }
      })
    })
  }

  // Reset YT vids on sort so they do not autoplay
  ytplayStateReset = () => {
    this.setState({
      ytplay: {
        ...this.state.ytplayDefault
      }
    })
  }

  videoPlay = (videoId) => {
    this.setState({
      ytplay: {
        ...this.state.ytplay,
        [videoId]: true
      }
    })
  };

  groupChannelsToggle = () => {
    this.setState({
      groupChannels: !this.state.groupChannels
    })
  }

  sortSong = (d1, d2, bool) => {
    if (d1 >= d2) {
      return bool ? -1:1;
    }
    if (d1 < d2) {
      return bool ? 1:-1;
    }
  }

  groupChannelsEnable = () => {
    let songsGrouped = [...this.state.songs];
    songsGrouped.sort((a, b) => {
      let d1;
      let d2;
      if (this.state.groupChannels) {
        d1 = new Date(a.published);
        d2 = new Date(b.published);
        return this.sortSong(d1, d2, true);
      } else {
        d1 = a.channel;
        d2 = b.channel;
        return this.sortSong(d1, d2, false);
      }
    })
    this.songsSet(songsGrouped);
    this.groupChannelsToggle(); 
    this.ytplayStateReset();
  }


  sortDateNewestToggle = (bool) => {
    this.setState({
      sortDateNewest: bool
    })
  }

  layoutToggle = () => {
    this.setState({
      layoutChange: !this.state.layoutChange
    })
  }

  toggleSort = (channel) => {
    this.setState({
      channelSort: {
        ...this.state.channelSort,
        [channel]: !this.state.channelSort[channel]
      }
    })
  }

  selectAll = (bool) => {
    let channelCopy = { ...this.state.channelSort };
    Object.keys(channelCopy).forEach(channel => {
      channelCopy[channel] = bool;
    })
    this.setState({
      channelSort: {
        ...channelCopy
      }
    })
  }

  dateSortNewest = (bool) => {
    let songsSorted = [...this.state.songs ];
    songsSorted.sort((a, b) => {
      const d1 = new Date(a.published);
      const d2 = new Date(b.published);
      return this.sortSong(d1, d2, bool);
    })
    this.songsSet(songsSorted);
    this.sortDateNewestToggle(bool); 
    this.ytplayStateReset();
  }

  async componentDidMount() {
    // Fetch data from YT API
    const songsGet = await fetch('/.netlify/functions/youtube');
    const songsGetJSON = await songsGet.json();
    this.songsSet(songsGetJSON);
    // Set initial state of all YT videos
    this.ytplayStateInit();
  }

  render() {
    return (
      <div>
        {
          this.state.songs
          && <div id='content'>
              <SortBar
                groupChannels={this.state.groupChannels}
                groupChannelsEnable={this.groupChannelsEnable}
                sortDateNewest={this.state.sortDateNewest}
                dateSortNewest={this.dateSortNewest}
              />
              <SongList
                songs={this.state.songs}
                videoPlay={this.videoPlay}
                ytplay={this.state.ytplay}
                ytplayStateReset={this.ytplayStateReset}
                channelSort={this.state.channelSort}
                layoutChange={this.state.layoutChange}
                logos={this.state.logos}
              />
              <LayoutChange
                layoutChange={this.state.layoutChange}
                layoutToggle={this.layoutToggle}
              />
              <ChannelBox
                channelSort={this.state.channelSort}
                toggleSort={this.toggleSort}
                selectAll={this.selectAll}
                logos={this.state.logos}
              />
             </div>  
        }
      </div>
    );
  }
}

export default App;
