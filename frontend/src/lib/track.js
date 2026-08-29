import axios from 'axios';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const track = (event, props = {}) => {
  try {
    axios.post(`${API_URL}/analytics/events`, { event, props, ts: new Date().toISOString(), path: window.location.pathname }).catch(() => {});
  } catch (e) { /* fire and forget */ }
};
