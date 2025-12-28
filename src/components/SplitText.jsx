export function SplitText({ 
  children, 
  className = "", 
  wordClass = "split-word", 
  charClass = "split-char" 
}) {
  
  // 1. Split the string into words
  const words = children.split(" ");

  return (
    <span className={className}>
      {words.map((word, wordIndex) => (
        // 2. Wrap each word in a span with the 'wordClass' (Fixes HeroSection)
        <span 
          key={wordIndex} 
          className={`${wordClass} inline-block whitespace-nowrap`}
          style={{ marginRight: "0.25em" }} // distinct spacing for words
        >
          {word.split("").map((char, charIndex) => (
            // 3. Wrap each character in a span with 'charClass' (Fixes NarrativeIntro)
            <span 
              key={charIndex} 
              className={`${charClass} inline-block`}
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}

