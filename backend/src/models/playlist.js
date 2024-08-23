import bcrypt from 'bcryptjs';
import { ObjectId, ReturnDocument } from 'mongodb';
import getDb from '../config/db.js';

const createPlaylist = async (userId, name) => {
  const db = getDb();
  const userObjectId = new ObjectId(userId);
  const newPlaylist = {
    userId: userObjectId,
    name,
    songs: [],
    createdAt: new Date(),
  };
  const result = await db.collection('playlists').insertOne(newPlaylist);
  if (result && result.insertedId) {
    // Fetch the newly created playlist by its ID
    const newPlaylist = await db.collection('playlists').findOne({ _id: result.insertedId });
    return newPlaylist;
  } else {
    throw new Error('Playlist creation failed');
  }
};

const getPlaylists = async (userId) => {
  const db = getDb();
  // Convert userId to ObjectId if it's not already an ObjectId
  const userObjectId = new ObjectId(userId);
  const playlists = await db.collection('playlists').find({ userId: userObjectId }).toArray();
  return playlists;
};

const addSongToPlaylist = async (playlistId, song) => {
  const db = getDb();
  const playlistCollection = await db.collection('playlists');
  const result = await playlistCollection.updateOne(
    { _id: new ObjectId(playlistId) },
    { $push: { songs: song } }
  );
  return result.modifiedCount > 0;
}

const getPlaylistById = async (playlistId) => {
  const db = getDb();
  const playlistCollection = await db.collection('playlists');
  const playlist = await playlistCollection.findOne({ _id: new ObjectId(playlistId) });
  return playlist;
}

const updatePlaylistName = async (playlistId, newName, userId) => {
  const db = getDb();
  const playlistCollection = await db.collection('playlists');
  const result = await playlistCollection.updateOne(
    { _id: new ObjectId(playlistId), userId: new ObjectId(userId) },
    { $set: { name: newName } }
  );

  return result.modifiedCount > 0;
}

export { createPlaylist, getPlaylists, addSongToPlaylist, getPlaylistById, updatePlaylistName };