import React, {Component} from 'react';
import './App.css';
import Particles from 'react-particles-js';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
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

const initialState = {
  input: '',
  imgUrl: '',
  box: {},
  route: 'signin',
  isSignedIn:false,
  user: {
    id:'',
    name:'',
    email:'',
    entries:0,
    joined:''
}
};
class App extends Component{
  constructor() {
    super();
    this.state = initialState;
  }
  loadUser = (data) => {
    this.setState(
      {
        user:{
          id: data.id,
          name: data.name,
          email: data.email,
          // password: data.email,
          entries: data.entries,
          joined: data.joined  
         }
      } 
    );
  }


  // componentDidMount() {
  //   fetch('http://localhost:3002/')
  //   .then(response=> response.json())
  //   .then(data => console.log(data))
  // }

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
    this.setState({box: box}); 
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onPictureSubmit = () => {
    this.setState({imgUrl:this.state.input});
    app.models
    .predict(
      Clarifai.FACE_DETECT_MODEL, 
      this.state.input)
      .then((response)=> 
      {
        if (response) {
          fetch('http://localhost:3002/image', {
           method:'put',
           headers: {'Content-Type':'application/json'},
           body: JSON.stringify(
               {    id: this.state.user.id
                }
            )
       }).then(response => response.json())
       .then(count => {this.setState(
        Object.assign(this.state.user, {entries: count})
        //it will change the whole object to update one key and value we will use above
        // {user: {
        //   entries: count
        // }}
       )})
       .catch(err => console.log)
          
        }
        this.displayFaceBox(this.calculateFaceLocation(response))})
      .catch(err => console.log(err));// shorthand using Es6
    
  }
 
  onRouteChange = (routeValue) => {
    if(routeValue ==='signout')
    {
      this.setState(initialState);
    }
    else if(routeValue ==='home'){
      this.setState({isSignedIn:true});
    }
    this.setState({route: routeValue});
  }

  isSignedIn= () => {
    if(this.state.route ==='home'){
      this.setState({isSignedIn: true});
    }
    else{
      this.setState({isSignedIn: false});
    }
    return this.state.isSignedIn;
  }
 // props are basically waht type of power a component have
 // for eg :- it has onClick power , loadUser power etc etc

  render() {
    return(
      <div className="App">
        <Particles className='particles'
          params={particlesOptions} 
        />
        <Navigation onRouteChange = {this.onRouteChange} isSignedIn={this.state.isSignedIn}/>
        {
          this.state.route === 'home'
          ? <div>
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries}/> 
              <ImageLinkForm onInputChange = {this.onInputChange} onDetectClick = {this.onPictureSubmit}/>
              <FaceRecognition box ={this.state.box}imgUrl = {this.state.input}/> 
            </div> 
          :(this.state.route ==='signin'?<Signin loadUser ={this.loadUser} onRouteChange = {this.onRouteChange }/>: <Register loadUser = {this.loadUser} onRouteChange = {this.onRouteChange }/>
          )  
        }
      
      </div>
    );
  }
}
export default App;
