import React from 'react';
import './App.css';

import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'new playlist',
      playlistTracks: []
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }
    let newPlaylistTracks = this.state.playlistTracks;
    newPlaylistTracks.push(track);
    this.setState({ playlistTracks: newPlaylistTracks });
  }

  removeTrack(track) {
    let newPlaylistTracks = this.state.playlistTracks.filter(item => item.id !== track.id);
    this.setState({ playlistTracks: newPlaylistTracks });
  }

  updatePlaylistName(newPlaylistName) {
    this.setState({
      playlistName: newPlaylistName
    });
  }

  savePlaylist() {
    let trackURI = this.state.playlistTracks.map(track => track.uri);
    Spotify.saveSpotifyPlaylist(this.state.playlistName, trackURI).then(() => {
      this.setState({
        playlistTracks: [],
        playlistName: 'new playlist'
      });
    });
  }

  search(searchTerm) {
    Spotify.searchSpotify(searchTerm).then(results => {
      this.setState({ searchResults: results });
    });
  }

  render() {
    return (
      <div>
        <h1>ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
            />
          </div>
        </div>
      </div>
    )
  }
};

export default App;