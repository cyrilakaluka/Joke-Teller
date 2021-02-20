// Import text to speech module
import VoiceRSS from './voicerss-tts.min.js';

// import DOM elements
const audio = document.getElementById('joke-audio');
const jokeButton = document.getElementById('tell-a-joke');
const robotGif = document.getElementById('robot-gif');

function getRandomJokeCategory() {
  const categories = ['Programming', 'Misc', 'Dark', 'Pun', 'Spooky', 'Christmas'];
  return categories[Math.floor(Math.random() * categories.length)];
}

function delay(time) {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
}

function setRobotStanding() {
  robotGif.classList.remove('animate-sit');
  robotGif.classList.add('animate-stand');
}

function setRobotSitting() {
  robotGif.classList.remove('animate-stand');
  robotGif.classList.add('animate-sit');
}

async function setUIJokeStart() {
  const ROBOT_ANIMATION_TIME = 1500;
  // disable the jokeButton
  jokeButton.disabled = true;
  // Ensure robot is standing
  setRobotStanding();
  await delay(ROBOT_ANIMATION_TIME);
}

async function setUIJokeComplete() {
  const DELAY_UI_JOKE_END = 10000;
  const ROBOT_ANIMATION_TIME = 600;

  jokeButton.disabled = false;
  setRobotSitting();
  await delay(ROBOT_ANIMATION_TIME);

  let timeoutId = 0;

  const clearSetTimeout = () => clearTimeout(timeoutId);

  jokeButton.addEventListener('click', clearSetTimeout, { once: true });

  timeoutId = setTimeout(() => {
    jokeButton.removeEventListener('click', clearSetTimeout);
    setRobotStanding();
  }, DELAY_UI_JOKE_END);
}

function convertAndPlay(text) {
  const speechConfig = {
    key: '3342329acf294635bd36af744392efca',
    src: text,
    hl: 'en-us',
    r: 0,
    c: 'mp3',
    f: '44khz_16bit_stereo',
    ssml: false,
    el: audio,
  };

  return new Promise(resolve => {
    audio.addEventListener('ended', resolve, { once: true });
    VoiceRSS.speech(speechConfig);
  });
}

async function tellJoke() {
  const jokeAPIURL = `https://v2.jokeapi.dev/joke/${getRandomJokeCategory()}?blacklistFlags=nsfw,religious,political,racist,sexist,explicit`;

  await setUIJokeStart();

  try {
    const response = await fetch(jokeAPIURL);
    const data = await response.json();
    const joke = (data.joke || `${data.setup} ... ${data.delivery}`).trim().replace(/ /g, '%20');
    await convertAndPlay(joke);
  } catch (error) {
    console.error('Oops! an error occurred', error);
  } finally {
    setUIJokeComplete();
  }
}

jokeButton.addEventListener('click', tellJoke);
