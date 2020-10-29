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
      imgUrl: '',
      box: {}
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return({
      leftCol: clarifaiFace.left_col * width,
      topRow : clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height) 
    });
  }
  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box: box}); 
  }

   onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {

    this.setState({imgUrl:this.state.input});
    app.models
    .predict(
      Clarifai.FACE_DETECT_MODEL, 
      this.state.input)
      .then((response)=> {this.displayFaceBox(this.calculateFaceLocation(response))})
      .catch(err => console.log(err));// shorthand using Es6
    
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
