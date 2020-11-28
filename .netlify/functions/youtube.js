// import dependencies
require('dotenv').config();
const axios = require('axios');

// YT API Key
const ytKey = process.env.YT_KEY;
// Set base URL to retrieve a Youtube channel's videos
const urlBase = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&maxResults=7&key=${ytKey}&playlistId=`;

// List of Youtube channel sources
const channelsYT = {
  Proximity: 'UU3ifTl5zKiCAhHIBQYcaTeg',
  'Revealed Music': 'UUnhHe0_bk_1_0So41vsZvWw',
  'Thrilling Music': 'UUh_Ob9q_Tf7-7Opf_6YvaKw',
  WaveMusic: 'UUbuK8xxu2P_sqoMnDsoBrrg',
};

// function to create array of promises from urlBase and channelsYT
const promiseMake = () => Object.values(channelsYT).map(channel => axios.get(urlBase + channel));

// function to format date
const dateFormat = (date) => {
  const dateNew = new Date(date);
  return dateNew.toLocaleString('en-us');
};

// function to insert each song into its own object
const songInsert = (channel, songs) => {
    channel.data.items.map((song) => {
      const songObj = {
        title: song.snippet.title,
        published: dateFormat(song.snippet.publishedAt),
        videoId: song.snippet.resourceId.videoId,
        channel: song.snippet.channelTitle,
      };
      songs.push(songObj);
    });
};
  
// function to sort songs by date
const sortDate = (songs) => {
    const songsSorted = songs.sort((a, b) => {
        const d1 = new Date(a.published);
        const d2 = new Date(b.published);
        if (d1 >= d2) {
        return -1;
        }
        if (d1 < d2) {
        return 1;
        }
    });
    return songsSorted;
};
  

// retrieve list of videos
exports.handler = async function(event, context) {
    // Array of songs to be collected
    const songs = [];

    // Wait until all promises are finished before sending array to front
    await Promise.all(promiseMake())
        .then((channels) => {
            channels.map((channel) => {
                songInsert(channel, songs);
            });
        })
        .catch((error) => {
            return {
                statusCode: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: '500',
                    message: error
                })
            };
        });
    
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(sortDate(songs))
    };
}