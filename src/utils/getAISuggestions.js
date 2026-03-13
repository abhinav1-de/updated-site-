// Smart anime suggestion system - works client-side without external APIs
// Comprehensive database of popular anime A-Z with keywords for matching
const animeDatabase = [
  // A
  { title: "Attack on Titan", keywords: ["action", "fight", "giant", "titan", "war", "battle", "military"], reason: "Popular action anime with intense battles" },
  { title: "Akame ga Kill", keywords: ["action", "assassin", "dark", "fight", "revolution"], reason: "Dark action with assassins" },
  { title: "Assassination Classroom", keywords: ["comedy", "school", "teacher", "alien", "education"], reason: "Comedy about alien teacher" },
  { title: "Angel Beats", keywords: ["drama", "music", "afterlife", "school", "emotion"], reason: "Emotional afterlife drama" },
  { title: "Another", keywords: ["horror", "mystery", "school", "death", "curse"], reason: "Horror mystery in school" },
  { title: "A Silent Voice", keywords: ["drama", "school", "emotion", "sad", "bully", "deaf"], reason: "Emotional drama about redemption" },
  
  // B  
  { title: "Black Clover", keywords: ["magic", "fantasy", "fight", "demon", "grimoire"], reason: "Magical battles and determination" },
  { title: "Bleach", keywords: ["action", "soul", "reaper", "fight", "spiritual"], reason: "Soul reaper action series" },
  { title: "Berserk", keywords: ["dark", "fantasy", "sword", "violence", "medieval"], reason: "Dark medieval fantasy epic" },
  { title: "Blue Exorcist", keywords: ["demon", "exorcist", "school", "supernatural"], reason: "Demon fighting school series" },
  
  // C
  { title: "Clannad", keywords: ["romance", "drama", "sad", "family", "emotion", "cry"], reason: "Emotional family drama series" },
  { title: "Code Geass", keywords: ["mecha", "strategy", "rebellion", "smart", "politics"], reason: "Strategic mecha with politics" },
  { title: "Cowboy Bebop", keywords: ["space", "cowboy", "sci-fi", "bounty", "jazz"], reason: "Space cowboy with amazing soundtrack" },
  { title: "Chainsaw Man", keywords: ["action", "demon", "dark", "chainsaw", "violence"], reason: "Dark action with chainsaws" },
  
  // D
  { title: "Demon Slayer", keywords: ["action", "sword", "demon", "fight", "battle", "samurai"], reason: "Top-rated action with sword fighting" },
  { title: "Death Note", keywords: ["dark", "death", "psychological", "thriller", "smart"], reason: "Psychological thriller masterpiece" },
  { title: "Dragon Ball Z", keywords: ["action", "fight", "power", "battle", "strong", "saiyan"], reason: "Legendary fighting anime" },
  { title: "Dr. Stone", keywords: ["science", "survival", "smart", "civilization", "chemistry"], reason: "Science survival adventure" },
  
  // E
  { title: "Evangelion", keywords: ["mecha", "robot", "psychological", "sci-fi"], reason: "Psychological mecha classic" },
  { title: "Erased", keywords: ["mystery", "time", "travel", "thriller", "child"], reason: "Time travel mystery thriller" },
  
  // F
  { title: "Fullmetal Alchemist", keywords: ["fantasy", "alchemy", "magic", "brother", "dark"], reason: "Epic fantasy with alchemy magic" },
  { title: "Fire Force", keywords: ["action", "fire", "supernatural", "fight"], reason: "Firefighting with superpowers" },
  { title: "Fairy Tail", keywords: ["magic", "guild", "fantasy", "dragon", "friendship"], reason: "Magical guild adventure series" },
  { title: "Fruits Basket", keywords: ["romance", "drama", "zodiac", "curse", "family"], reason: "Zodiac curse romance drama" },
  
  // G
  { title: "Gintama", keywords: ["comedy", "funny", "samurai", "parody", "random"], reason: "Comedy masterpiece with samurai" },
  { title: "Goblin Slayer", keywords: ["dark", "fantasy", "adventure", "goblin", "rpg"], reason: "Dark fantasy RPG adventure" },
  { title: "Ghost in the Shell", keywords: ["cyberpunk", "sci-fi", "cyborg", "philosophy"], reason: "Cyberpunk philosophical sci-fi" },
  
  // H
  { title: "Haikyuu", keywords: ["sport", "volleyball", "school", "team", "competition"], reason: "Inspiring volleyball sports anime" },
  { title: "Hunter x Hunter", keywords: ["adventure", "hunter", "power", "friendship"], reason: "Adventure with complex power system" },
  { title: "Hyouka", keywords: ["mystery", "school", "slice", "life", "detective"], reason: "School mystery slice of life" },
  
  // I - Isekai Focus
  { title: "In Another World With My Smartphone", keywords: ["isekai", "smartphone", "magic", "harem", "overpowered"], reason: "Isekai with smartphone powers" },
  { title: "I'm Standing on a Million Lives", keywords: ["isekai", "game", "quest", "survival"], reason: "Game-like isekai survival" },
  
  // J
  { title: "Jujutsu Kaisen", keywords: ["action", "curse", "school", "supernatural", "fight"], reason: "Supernatural curse fighting" },
  { title: "JoJo's Bizarre Adventure", keywords: ["action", "bizarre", "stand", "power", "family"], reason: "Bizarre adventure across generations" },
  
  // K
  { title: "Konosuba", keywords: ["comedy", "funny", "isekai", "adventure", "parody"], reason: "Hilarious isekai parody" },
  { title: "K-On!", keywords: ["music", "school", "cute", "band", "friendship"], reason: "Cute girls doing music" },
  { title: "Kuroko no Basket", keywords: ["sport", "basketball", "school", "team"], reason: "Supernatural basketball series" },
  { title: "Kill la Kill", keywords: ["action", "school", "uniform", "fight", "trigger"], reason: "Over-the-top school action" },
  
  // L
  { title: "Log Horizon", keywords: ["isekai", "mmo", "game", "strategy", "virtual"], reason: "MMO isekai with strategy" },
  { title: "Love is War", keywords: ["comedy", "romance", "school", "strategy", "love"], reason: "Strategic romantic comedy" },
  
  // M
  { title: "My Hero Academia", keywords: ["action", "hero", "power", "school", "fight", "super"], reason: "Superhero academy with great action" },
  { title: "Mob Psycho 100", keywords: ["psychic", "comedy", "action", "supernatural"], reason: "Psychic powers with great animation" },
  { title: "Monster", keywords: ["thriller", "psychological", "doctor", "serial", "killer"], reason: "Psychological thriller masterpiece" },
  { title: "Made in Abyss", keywords: ["adventure", "abyss", "dark", "exploration"], reason: "Dark adventure into mysterious abyss" },
  
  // N
  { title: "Naruto", keywords: ["ninja", "action", "fight", "power", "village", "battle"], reason: "Classic ninja action adventure" },
  { title: "No Game No Life", keywords: ["isekai", "game", "strategy", "smart", "colorful"], reason: "Strategic isekai with games" },
  { title: "Noragami", keywords: ["supernatural", "god", "spirit", "action"], reason: "God and spirits supernatural action" },
  
  // O
  { title: "One Piece", keywords: ["adventure", "pirate", "action", "long", "epic", "sea"], reason: "Epic pirate adventure series" },
  { title: "One Punch Man", keywords: ["action", "hero", "fight", "comedy", "strong", "punch"], reason: "Parody superhero with amazing animation" },
  { title: "Overlord", keywords: ["isekai", "undead", "game", "overpowered", "dark"], reason: "Dark overpowered isekai" },
  { title: "Ouran High School Host Club", keywords: ["comedy", "romance", "school", "host", "rich"], reason: "Host club romantic comedy" },
  
  // P
  { title: "Parasyte", keywords: ["horror", "alien", "parasite", "dark", "body"], reason: "Body horror with alien parasites" },
  { title: "Princess Mononoke", keywords: ["fantasy", "nature", "ghibli", "movie", "environment"], reason: "Ghibli environmental fantasy" },
  { title: "Psycho-Pass", keywords: ["cyberpunk", "dystopia", "police", "psychological"], reason: "Cyberpunk dystopian police" },
  
  // Q
  { title: "Quintessential Quintuplets", keywords: ["romance", "harem", "school", "tutor", "quintuplets"], reason: "Quintuplet harem romance" },
  
  // R
  { title: "Re:Zero", keywords: ["isekai", "time", "loop", "dark", "suffering"], reason: "Dark time loop isekai" },
  { title: "Rising of the Shield Hero", keywords: ["isekai", "shield", "betrayal", "revenge"], reason: "Shield hero betrayal isekai" },
  { title: "Rascal Does Not Dream", keywords: ["romance", "supernatural", "school", "bunny", "girl"], reason: "Supernatural school romance" },
  
  // S
  { title: "Spirited Away", keywords: ["fantasy", "magic", "movie", "ghibli", "spirit"], reason: "Magical Studio Ghibli masterpiece" },
  { title: "Steins Gate", keywords: ["sci-fi", "time", "travel", "science", "thriller"], reason: "Time travel sci-fi thriller" },
  { title: "Sword Art Online", keywords: ["isekai", "vr", "game", "romance", "virtual"], reason: "VR game isekai romance" },
  { title: "Seven Deadly Sins", keywords: ["fantasy", "magic", "sin", "knights", "power"], reason: "Knights with deadly sins" },
  { title: "Spy x Family", keywords: ["comedy", "family", "spy", "assassin", "wholesome"], reason: "Spy family wholesome comedy" },
  { title: "Solo Leveling", keywords: ["action", "game", "leveling", "monster", "hunter"], reason: "Monster hunter leveling system" },
  
  // T
  { title: "Tokyo Ghoul", keywords: ["horror", "dark", "monster", "ghoul", "blood"], reason: "Dark supernatural horror series" },
  { title: "Toradora", keywords: ["romance", "school", "love", "comedy", "tsundere"], reason: "Popular high school romance" },
  { title: "That Time I Got Reincarnated as a Slime", keywords: ["isekai", "slime", "reincarnation", "monster", "op"], reason: "Slime reincarnation isekai" },
  { title: "The Saga of Tanya the Evil", keywords: ["isekai", "war", "military", "magic", "evil"], reason: "Military war isekai" },
  { title: "The Disastrous Life of Saiki K", keywords: ["comedy", "psychic", "school", "funny"], reason: "Psychic comedy in high school" },
  { title: "Tower of God", keywords: ["tower", "climb", "test", "power", "mystery"], reason: "Tower climbing with mysteries" },
  
  // U
  { title: "Uzumaki", keywords: ["horror", "spiral", "psychological", "creepy"], reason: "Spiral horror psychological" },
  
  // V
  { title: "Violet Evergarden", keywords: ["beautiful", "emotion", "letter", "war", "sad"], reason: "Gorgeous emotional drama" },
  { title: "Vinland Saga", keywords: ["viking", "war", "history", "revenge", "drama"], reason: "Viking historical drama" },
  
  // W
  { title: "Weathering With You", keywords: ["romance", "weather", "rain", "love", "movie"], reason: "Romantic fantasy about weather" },
  { title: "Wonder Egg Priority", keywords: ["psychological", "dream", "girl", "suicide", "dark"], reason: "Psychological girl drama" },
  
  // X
  { title: "xxxHOLiC", keywords: ["supernatural", "wish", "grant", "mystery"], reason: "Supernatural wish granting" },
  
  // Y
  { title: "Your Name", keywords: ["romance", "love", "movie", "beautiful", "drama", "time"], reason: "Beautiful romantic drama film" },
  { title: "Your Lie in April", keywords: ["music", "piano", "sad", "emotion", "classical"], reason: "Beautiful music drama" },
  { title: "Yuri on Ice", keywords: ["sport", "ice", "skating", "yaoi", "music"], reason: "Ice skating sports romance" },
  
  // Z
  { title: "Zombie Land Saga", keywords: ["zombie", "idol", "comedy", "music", "undead"], reason: "Zombie idol comedy" },
];

/**
 * Get smart anime suggestions based on user search query
 * @param {string} query - User's search query
 * @returns {Promise<Array>} - Array of suggested anime
 */
export const getAISuggestions = async (query) => {
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 1);
    const suggestions = [];
    
    // Score each anime based on keyword matches
    animeDatabase.forEach(anime => {
      let score = 0;
      
      // Check for exact title matches (highest priority)
      if (anime.title.toLowerCase().includes(query.toLowerCase())) {
        score += 100;
      }
      
      // Check keyword matches
      searchTerms.forEach(term => {
        anime.keywords.forEach(keyword => {
          if (keyword.includes(term) || term.includes(keyword)) {
            score += keyword === term ? 10 : 5; // Exact match vs partial match
          }
        });
      });
      
      if (score > 0) {
        suggestions.push({
          ...anime,
          score
        });
      }
    });
    
    // Sort by score and return top 5
    return suggestions
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(item => ({
        title: item.title,
        reason: item.reason
      }));
    
  } catch (error) {
    console.error("Error getting AI suggestions:", error);
    return [];
  }
};
