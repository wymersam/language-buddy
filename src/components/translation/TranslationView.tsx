import React, { useState } from "react";
import { ArrowLeftRight, Copy, Volume2, RotateCcw } from "lucide-react";

interface TranslationViewProps {
  user: {
    targetLanguage: string;
    nativeLanguage: string;
  };
}

export default function TranslationView({ user }: TranslationViewProps) {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState<string>(
    user.nativeLanguage,
  );
  const [targetLanguage, setTargetLanguage] = useState<string>(
    user.targetLanguage,
  );
  const [error, setError] = useState<string | null>(null);

  const supportedLanguages = [
    { code: "English", name: "English" },
    { code: "German", name: "German" },
    { code: "Spanish", name: "Spanish" },
    { code: "French", name: "French" },
    { code: "Italian", name: "Italian" },
    { code: "Portuguese", name: "Portuguese" },
    { code: "Dutch", name: "Dutch" },
    { code: "Chinese", name: "Chinese" },
    { code: "Japanese", name: "Japanese" },
    { code: "Korean", name: "Korean" },
    { code: "Arabic", name: "Arabic" },
    { code: "Russian", name: "Russian" },
  ];

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;

    setIsTranslating(true);
    setError(null);

    try {
      const response = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `You are a professional translator. Translate the given text from ${sourceLanguage} to ${targetLanguage}. Provide only the translation, no explanations or additional text. If the source text is already in ${targetLanguage}, provide a natural translation to ${sourceLanguage}.`,
            },
            {
              role: "user",
              content: `Translate this text: "${sourceText}"`,
            },
          ],
        }),
      });

      if (response.ok) {
        const completion = await response.json();
        const translation = completion.choices[0]?.message?.content || "";
        setTranslatedText(translation.trim());
      } else {
        throw new Error("Translation request failed");
      }
    } catch (err) {
      setError("Translation failed. Please try again.");
      console.error("Translation error:", err);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSwapLanguages = () => {
    const tempLang = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(tempLang);

    // Swap the text content as well
    const tempText = sourceText;
    setSourceText(translatedText);
    setTranslatedText(tempText);
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const handleSpeak = (text: string, language: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);

      // Map language names to speech synthesis language codes
      const languageMap: Record<string, string> = {
        English: "en-US",
        German: "de-DE",
        Spanish: "es-ES",
        French: "fr-FR",
        Italian: "it-IT",
        Portuguese: "pt-PT",
        Dutch: "nl-NL",
        Chinese: "zh-CN",
        Japanese: "ja-JP",
        Korean: "ko-KR",
        Arabic: "ar-SA",
        Russian: "ru-RU",
      };

      utterance.lang = languageMap[language] || "en-US";
      speechSynthesis.speak(utterance);
    }
  };

  const handleClear = () => {
    setSourceText("");
    setTranslatedText("");
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleTranslate();
    }
  };

  return (
    <div className="translation-container">
      <div className="translation-header">
        <h2>Translation</h2>
        <p>Translate between {supportedLanguages.length} languages instantly</p>
      </div>

      <div className="language-selector">
        <div className="language-select-group">
          <select
            value={sourceLanguage}
            onChange={(e) => setSourceLanguage(e.target.value)}
            className="language-select"
          >
            {supportedLanguages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSwapLanguages}
          className="swap-languages-btn"
          title="Swap languages"
        >
          <ArrowLeftRight size={20} />
        </button>

        <div className="language-select-group">
          <select
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            className="language-select"
          >
            {supportedLanguages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="translation-content">
        <div className="translation-panel">
          <div className="panel-header">
            <span className="panel-title">{sourceLanguage}</span>
            <div className="panel-actions">
              <button
                onClick={handleClear}
                className="action-btn"
                title="Clear all"
              >
                <RotateCcw size={18} />
              </button>
              {sourceText && (
                <>
                  <button
                    onClick={() => handleSpeak(sourceText, sourceLanguage)}
                    className="action-btn"
                    title="Listen"
                  >
                    <Volume2 size={18} />
                  </button>
                  <button
                    onClick={() => handleCopy(sourceText)}
                    className="action-btn"
                    title="Copy"
                  >
                    <Copy size={18} />
                  </button>
                </>
              )}
            </div>
          </div>
          <textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Enter text in ${sourceLanguage}...`}
            className="translation-textarea"
            rows={6}
          />
        </div>

        <div className="translation-panel">
          <div className="panel-header">
            <span className="panel-title">{targetLanguage}</span>
            <div className="panel-actions">
              {translatedText && (
                <>
                  <button
                    onClick={() => handleSpeak(translatedText, targetLanguage)}
                    className="action-btn"
                    title="Listen"
                  >
                    <Volume2 size={18} />
                  </button>
                  <button
                    onClick={() => handleCopy(translatedText)}
                    className="action-btn"
                    title="Copy"
                  >
                    <Copy size={18} />
                  </button>
                </>
              )}
            </div>
          </div>
          <textarea
            value={translatedText}
            readOnly
            placeholder={`Translation will appear here...`}
            className="translation-textarea readonly"
            rows={6}
          />
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      <div className="translation-actions">
        <button
          onClick={handleTranslate}
          disabled={!sourceText.trim() || isTranslating}
          className="translate-btn"
        >
          {isTranslating ? "Translating..." : "Translate"}
        </button>
        <p className="translate-shortcut">Press Ctrl+Enter to translate</p>
      </div>
    </div>
  );
}
