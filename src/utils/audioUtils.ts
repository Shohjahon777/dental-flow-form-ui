
export class AudioUtils {
  static async audioToBase64(audioBlob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove the data URL prefix (e.g., "data:audio/wav;base64,")
        const base64Data = base64String.split(',')[1];
        console.log('Audio converted to base64, length:', base64Data.length);
        resolve(base64Data);
      };
      reader.onerror = () => {
        console.error('Error converting audio to base64');
        reject(new Error('Failed to convert audio to base64'));
      };
      reader.readAsDataURL(audioBlob);
    });
  }
}
