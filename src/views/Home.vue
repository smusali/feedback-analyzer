<template>
  <div class="home">
    <h1>User Feedback Analysis</h1>
    <div>
      <h2>Available Categories</h2>
      <ul>
        <li v-for="category in categories" :key="category">{{ category }}</li>
      </ul>
    </div>
    <div>
      <textarea v-model="feedback" placeholder="Enter user feedback here..."></textarea>
      <button @click="analyzeFeedback">Analyze Feedback</button>
    </div>
    <div v-if="result">
      <h2>Analysis Result</h2>
      <p><strong>Category:</strong> {{ result.category }}</p>
      <p><strong>Sentiment:</strong> {{ result.sentiment }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Home',
  data() {
    return {
      categories: [],
      feedback: '',
      result: null,
    };
  },
  created() {
    this.getCategories();
  },
  methods: {
    async getCategories() {
      try {
        const response = await axios.get('/api/categories');
        this.categories = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async analyzeFeedback() {
      try {
        const response = await axios.post('/api/analyze', { feedback: this.feedback });
        this.result = response.data;
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style scoped>
.home {
  padding: 20px;
}

textarea {
  width: 100%;
  height: 100px;
}

button {
  margin-top: 10px;
}
</style>
