export function speak(text: string, rate: number): void {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.rate = rate;
  window.speechSynthesis.speak(utt);
}

export function cancelSpeech(): void {
  window.speechSynthesis?.cancel();
}
