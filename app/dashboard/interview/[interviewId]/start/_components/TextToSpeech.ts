const url = 'https://api.murf.ai/v1/speech/generate';

export const textToSpeech = async (text: string) => {
  console.log("Sending text to TTS API:", text);
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': 'ap2_c6785814-59ba-483c-aad7-5cb7375cc119'
    },
    body: JSON.stringify({ text, voiceId: 'en-US-natalie' })
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    console.log(data);
    return data.audioFile; // Return the audio file URL
  } catch (error) {
    console.error(error);
  }
};
