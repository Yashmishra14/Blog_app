import FormData from 'form-data';
import fetch from 'node-fetch';

const testPost = async () => {
  const formData = new FormData();
  formData.append('title', 'Test Post');
  formData.append('description', 'This is a test post');
  formData.append('categories', 'Tech');
  formData.append('username', 'testuser');

  try {
    const response = await fetch('http://localhost:8000/posts', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', result);
  } catch (error) {
    console.error('Error:', error);
  }
};

testPost();


