const URL = window.location.hostname.includes('localhost')
    ? 'https://localhost:8080'
    : 'https://devflix-react.herokuapp.com';

export default {
    URL,
};