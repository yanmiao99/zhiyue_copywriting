import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './app.less';

const App = createApp({
	onShow(options) {},
});

App.use(createPinia());

export default App;
