// import React from 'react';
import React, { Component } from 'react';
import Particles from 'react-particles-js';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Clarifai from 'clarifai'
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';


// initialize with your api key. This will also work in your browser via http://browserify.org/
const app = new Clarifai.App({
 apiKey: '6deec75c0c1e454cab4cbb3dd8402557'
});


const particlesOptions={
  particles: {
    number:{
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

class App extends Component {
  
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      boxes: [],
      faces: [],
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }
  
  resetState = () => {
    this.setState({
      input: '',
      imageUrl: '',
      boxes: [],
      faces: []
    })
  }
  
  // componentDidMount(){
  //   fetch('http://localhost:3004/')
  //     .then(response => response.json())
  //     .then(console.log)
  // }

  loadUser = (data) => {
    this.setState({user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
    }})
  }
  calculateFaceLocation = (data) => {   
    const clarifaiFace = data.outputs[0].data.regions;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    
    // parse through API JSON call and grab location data for each face
    for (const [, value] of clarifaiFace.entries()) {
        this.state.faces.push(value.region_info.bounding_box)
    }
    
    // parse through faces and calculate points for bounding box
    for(const [, value] of this.state.faces.entries()) {
      this.state.boxes.push({
        leftCol: value.left_col * width,
        topRow: value.top_row * height,
        rightCol: width - (value.right_col * width),
        bottomRow: height - (value.bottom_row * height)
      })
    }
  }
  
  displayFaceBox = () => {
    this.setState({boxes: this.state.boxes})
  }
  
  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }
    
  onPictureSubmit = () =>{
    this.resetState();
    this.setState({imageUrl: this.state.input});
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL, 
        this.state.input)
      // .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))  
        .then(response => {
          if(response){
            fetch('http://localhost:3004/image', {
              method: 'put',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                id: this.state.user.id
              })
            })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count }))
            })
          }
          this.displayFaceBox(this.calculateFaceLocation(response))  
        })
        .catch(err => console.log(err));
  }
  
  
  onRouteChange = (route) => {
    if(route === 'home'){
      this.setState({isSignedIn: true})
    }else if(route === 'signout'){
      this.setState({isSignedIn: false})
    }
    this.setState({route: route})
  }

  render(){
    const { isSignedIn, imageUrl, route, boxes, user} = this.state
    return (
      <div className="App">
        <Particles 
          className='particles' 
          params={particlesOptions}
        />
        <Navigation 
          isSignedIn={isSignedIn} 
          onRouteChange={this.onRouteChange} 
        />
        { route === 'home' 
          ? <div> 
              <Logo /> 
              <Rank 
                name={user.name}
                entries={user.entries}
              />
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onPictureSubmit={this.onPictureSubmit}
              />
              <FaceRecognition 
                boxes={boxes} 
                imageUrl={imageUrl}
              />
            </div> 
          : (
              route === 'signin'
              ? <SignIn 
                  onRouteChange={this.onRouteChange}
                  loadUser={this.loadUser}
                />
              : <Register 
                  loadUser={this.loadUser} 
                  onRouteChange={this.onRouteChange}
                />
            )
        }
      </div>
    );
  }
}

export default App;
