import React, {Component} from 'react';
import './App.css';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'; 
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';


const app = new Clarifai.App({
  apiKey: 'dd7d4cfbcb0648ad887c064c25183f2a'
 });

const particlesOptions = {
  particles: {
    number:{
      value: 60,
      density: {
        density : {
          enable : true,
          value_area:800 
        }
      }
    }
  }
}
class App extends Component{
  constructor() {
    super();
    this.state = {
      input: '',
      imgUrl: ''
    }
  }
   onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit =() => {
    console.log('Clicked');
    this.setState({imgUrl:this.state.input});
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input).then(
      function(response) {
        // do something with responseconsole.logc(response);
        console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
      },
      function(err) {// there was an error}
      }
    );
  }

  render() {
    return(
      <div className="App">
        <Particles className='particles'
          params={particlesOptions} 
        />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm onInputChange = {this.onInputChange} onDetectClick = {this.onButtonSubmit}/>
        <FaceRecognition imgUrl = {this.state.input}/> 
        
        {/* 
        
        */}

      </div>
    );
  }
}
export default App;
