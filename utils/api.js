export async function getStory(topic, email) {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/story/get_story?topic=${topic}&email=${email}`
      );
  
      if (response.ok) {
        const data = await response.json();
        return {
          status: 'success',
          data: {
            story: data.story,
            audio: data.audio
          }
        };
      } else if (response.status === 400) {
        return {
          status: 'error',
          message: 'Issue generating topic. Please try again.'
        };
      } else {
        return {
          status: 'error',
          message: 'An error occurred. Please try again later.'
        };
      }
    } catch (error) {
      console.error('Error:', error);
      return {
        status: 'error',
        message: 'An error occurred. Please try again later.'
      };
    }
  }