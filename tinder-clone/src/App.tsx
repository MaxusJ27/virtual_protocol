
import './App.css';
import Layout from './screens/Layout';
// redux 
import { Provider } from 'react-redux';
import store from './store';
// routes 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// screens 
import TinderRecommendation from './screens/TinderRecommendation';
import TinderList from './screens/TinderList';
import Upload from './screens/Upload';


function App() {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" Component={TinderRecommendation} />
            <Route path="/matches" Component={TinderList} />
            <Route path="/upload" Component={Upload} />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  );
}

export default App;
