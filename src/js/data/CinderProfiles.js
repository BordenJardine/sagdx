var CinderProfiles = function() {
};

CinderProfiles.PROFILES = [
  {
    name: 'Girl Next Door',
    image: 'frog_profile.png',
    correctDirection: 0,
    revealImage: 'frog_reveal.png',
    revealImage2: 'frog_reveal2.png',
    revealText: 'GET OUT',
    minigame: 'FrogGame',
    minigameDirection: 1
  },
  {
    name: 'Cinderella',
    image: 'cind.png',
    correctDirection: 1,
    revealImage: 'reveal.png',
    revealText: 'TeH B1g R3V34l!!!1',
    minigame: 'CinderellaGame',
    minigameDirection: 1
  },
  {
    name: 'Mermaid',
    image: 'mermaid.png',
    correctDirection: 1,
    revealImage: 'reveal.png',
    revealText: 'OH OH HOW DOES THIS WORK?',
    minigame: 'MermaidGame',
    minigameDirection: 1
  },
  {
    name: 'Gorgon Girl',
    image: 'medusa_before.png',
    correctDirection: 1,
    revealImage: 'medusa_after.png',
    revealText: "OH NO IT'S A GORGON",
    minigame: 'SnakeGame',
    minigameDirection: 1
  }
];

module.exports = CinderProfiles;
