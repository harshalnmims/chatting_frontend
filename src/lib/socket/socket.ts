import {io} from 'socket.io-client';
const ENDPOINT = 'http://localhost:9000';

const socket = io(ENDPOINT);

export const ioClient = socket