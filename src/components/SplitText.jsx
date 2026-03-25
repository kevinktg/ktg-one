export function SplitText({
  children,
  className = "",
  wordClass = "split-word",
  charClass = "split-char"
}) {
  let text = "";
  if (typeof children === "string") {
    text = children;
  } else if (Array.isArray(children)) {
    text = children.map(child => (typeof child === "string" || typeof child === "number") ? child : "").join("");
  } else if (typeof children === "number") {
    text = String(children);
  }

  const words = text.split(" ");

  return (
    <span className={className}>
      {words.map((word, wordIndex) => (
        <span
          key={`${word}-${wordIndex}`}
          className={`${wordClass} inline-block whitespace-nowrap`}
          style={{ marginRight: "0.25em", display: "inline-block", verticalAlign: "middle" }}
        >
          {word.split("").map((char, charIndex) => (
            <span
              key={`${char}-${wordIndex}-${charIndex}`}
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

