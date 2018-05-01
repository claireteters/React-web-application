const clientID = '80063efec64e4e61afb22317825ef1a8';
const redirectURI = encodeURIComponent('http://localhost:3000/callback/');
let accessToken;

const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
        }
    },

    searchSpotify(searchTerm) {
        const accessToken = this.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        }).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Request Failed!');
            }
        }, networkError => {
            console.log(networkError.message);
        }).then(jsonResponse => {
            if (!jsonResponse.tracks) {
                return [];
            }
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                albumImage: track.album.images[2].url,
                uri: track.uri
            }));
        });
    },

    saveSpotifyPlaylist(playlistName, tracksURI) {
        if (!playlistName || !tracksURI.length) {
            return;
        }
        let accessToken = this.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };
        let userID;

        return fetch('https://api.spotify.com/v1/me', { headers: headers }
        ).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Request Failed!');
            }
        }, networkError => {
            console.log(networkError.message);
        }).then(jsonResponse => {
            userID = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({ name: playlistName })
            }).then(response => response.json()
            ).then(jsonResponse => {
                let playlistID = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({ uris: tracksURI })
                });
            });
        });
    }


};
window.onload = Spotify.getAccessToken();
export default Spotify;