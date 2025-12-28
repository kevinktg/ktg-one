export function SplitText({
  children,
  className = "",
  wordClass = "split-word",
  charClass = "split-char"
}) {

  const words = children.split(" ");

  return (
    <span className={className}>
      {words.map((word, wordIndex) => (
        <span
          key={wordIndex}
          className={`${wordClass} inline-block whitespace-nowrap`}
          style={{ marginRight: "0.25em", display: "inline-block", verticalAlign: "middle" }}
        >
          {word.split("").map((char, charIndex) => (
            <span
              key={charIndex}
              className={`${charClass} inline-block`}
              style={{ display: "inline-block" }}
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}

