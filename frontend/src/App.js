
import './App.css';
import {Profile} from './profile/Profile'
import {Messages} from './messages/Messages'
import {Input} from './input/Input'


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Profile></Profile>
        <hr></hr>
        <Messages></Messages>
        <hr></hr>
        <Input></Input>
      </header>
    </div>
  );
}

export default App;
